import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { enrichCallsForOwner, EnrichedCallData } from '@/lib/hubspot';
import { SDR } from '@/lib/supabase';

function formatDuration(ms: number): string {
  const totalSecs = Math.round(ms / 1000);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export interface EnrichResult {
  sdrs_processed: number;
  calls_found: number;
  calls_enriched: number;
  calls_new: number;
  errors: string[];
  details: { sdr: string; found: number; enriched: number; new_calls: number }[];
}

export async function runEnrichCalls(lookbackDays = 2): Promise<EnrichResult> {
  const supabase = getSupabaseAdmin();

  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    throw new Error('HUBSPOT_ACCESS_TOKEN is not set');
  }

  // Date range
  const now = new Date();
  const beforeDate = now.toISOString().split('T')[0];
  const afterDateObj = new Date(now);
  afterDateObj.setUTCDate(afterDateObj.getUTCDate() - lookbackDays);
  const afterDate = afterDateObj.toISOString().split('T')[0];

  // Get all active SDRs
  const { data: sdrs, error: sdrError } = await supabase
    .from('sdrs')
    .select('*')
    .eq('is_active', true);

  if (sdrError || !sdrs || sdrs.length === 0) {
    throw new Error('No active SDRs found');
  }

  const result: EnrichResult = {
    sdrs_processed: 0,
    calls_found: 0,
    calls_enriched: 0,
    calls_new: 0,
    errors: [],
    details: [],
  };

  for (const sdr of sdrs as SDR[]) {
    const sdrDetail = { sdr: sdr.name, found: 0, enriched: 0, new_calls: 0 };

    try {
      const enriched = await enrichCallsForOwner(sdr.hubspot_owner_id, afterDate, beforeDate);
      sdrDetail.found = enriched.length;

      for (const call of enriched) {
        try {
          await upsertEnrichedCall(supabase, sdr.id, call, sdrDetail);
          sdrDetail.enriched++;
        } catch (err) {
          const msg = `Error upserting call ${call.hubspot_call_id} for ${sdr.name}: ${err instanceof Error ? err.message : 'Unknown'}`;
          console.error(msg);
          result.errors.push(msg);
        }
      }
    } catch (err) {
      const msg = `Error enriching calls for ${sdr.name}: ${err instanceof Error ? err.message : 'Unknown'}`;
      console.error(msg);
      result.errors.push(msg);
    }

    result.sdrs_processed++;
    result.calls_found += sdrDetail.found;
    result.calls_enriched += sdrDetail.enriched;
    result.calls_new += sdrDetail.new_calls;
    result.details.push(sdrDetail);
  }

  return result;
}

async function upsertEnrichedCall(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  sdrId: string,
  call: EnrichedCallData,
  sdrDetail: { new_calls: number }
) {
  // Check if this call already exists
  const { data: existing } = await supabase
    .from('calls')
    .select('id, prospect_name, company, transcript, recording_url, disposition')
    .eq('hubspot_call_id', call.hubspot_call_id)
    .maybeSingle();

  if (existing) {
    // Smart merge: only overwrite fields where HubSpot has better data
    const updates: Record<string, unknown> = {};

    if (call.prospect_name && (!existing.prospect_name || existing.prospect_name === 'Unknown')) {
      updates.prospect_name = call.prospect_name;
    }

    if (call.company && (!existing.company || existing.company === 'Unknown Company')) {
      updates.company = call.company;
    }

    if (call.transcript && !existing.transcript) {
      updates.transcript = call.transcript;
      updates.has_transcript = true;
    }

    if (call.recording_url) {
      updates.recording_url = call.recording_url;
    }

    if (call.disposition && !existing.disposition) {
      updates.disposition = call.disposition;
      updates.disposition_label = call.disposition_label;
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('calls')
        .update(updates)
        .eq('id', existing.id);

      if (error) throw error;
    }
  } else {
    // New call — insert full record
    const durationMs = call.duration_ms || 0;
    const { error } = await supabase
      .from('calls')
      .insert({
        hubspot_call_id: call.hubspot_call_id,
        sdr_id: sdrId,
        company: call.company || 'Unknown Company',
        prospect_name: call.prospect_name,
        call_date: call.call_date,
        call_timestamp: call.call_timestamp,
        duration_ms: durationMs,
        duration_formatted: formatDuration(durationMs),
        disposition: call.disposition,
        disposition_label: call.disposition_label,
        is_connected: durationMs > 0,
        has_transcript: !!call.transcript,
        transcript: call.transcript,
        recording_url: call.recording_url,
      });

    if (error) throw error;
    sdrDetail.new_calls++;
  }
}
