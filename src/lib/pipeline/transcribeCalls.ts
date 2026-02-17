import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { transcribeFromUrl } from '@/lib/deepgram';

const MAX_CALLS_PER_RUN = 10;
const MIN_DURATION_MS = 240_000; // Skip calls under 4 min — only transcribe meaningful conversations

export interface TranscribeResult {
  processed: number;
  succeeded: number;
  failed: number;
  skipped_short: number;
  results: { call_id: string; success: boolean; duration_secs?: number; error?: string }[];
}

export async function runTranscribeCalls(): Promise<TranscribeResult> {
  const supabase = getSupabaseAdmin();

  // Mark short connected calls as "transcribed" so we don't keep re-checking them.
  // Done as a separate step so it doesn't consume the MAX_CALLS_PER_RUN limit.
  const { data: shortCalls } = await supabase
    .from('calls')
    .select('id')
    .eq('has_transcript', false)
    .ilike('disposition_label', 'Connected%')
    .lt('duration_ms', MIN_DURATION_MS)
    .limit(100);

  let skippedShort = 0;
  if (shortCalls && shortCalls.length > 0) {
    const shortIds = shortCalls.map((c) => c.id);
    await supabase
      .from('calls')
      .update({ has_transcript: true })
      .in('id', shortIds);
    skippedShort = shortIds.length;
  }

  // Find connected calls with a recording URL, long enough to transcribe
  const { data: calls, error: fetchError } = await supabase
    .from('calls')
    .select('id, recording_url, duration_ms')
    .eq('has_transcript', false)
    .ilike('disposition_label', 'Connected%')
    .gte('duration_ms', MIN_DURATION_MS)
    .not('recording_url', 'is', null)
    .neq('recording_url', '')
    .order('created_at', { ascending: true })
    .limit(MAX_CALLS_PER_RUN);

  if (fetchError) {
    throw new Error(`Failed to fetch calls for transcription: ${fetchError.message}`);
  }

  if (!calls || calls.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0, skipped_short: skippedShort, results: [] };
  }

  const results: TranscribeResult['results'] = [];

  for (const call of calls) {
    try {
      console.log(`[transcribe] Processing call ${call.id}...`);
      const result = await transcribeFromUrl(call.recording_url!);

      const { error: updateError } = await supabase
        .from('calls')
        .update({
          transcript: result.transcript,
          has_transcript: true,
        })
        .eq('id', call.id);

      if (updateError) {
        console.error(`[transcribe] Error updating call ${call.id}:`, updateError);
        results.push({ call_id: call.id, success: false, error: updateError.message });
      } else {
        console.log(`[transcribe] Call ${call.id}: ${result.duration_secs.toFixed(0)}s, ${result.speaker_count} speakers, confidence ${result.confidence}`);
        results.push({ call_id: call.id, success: true, duration_secs: result.duration_secs });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[transcribe] Error transcribing call ${call.id}:`, message);
      results.push({ call_id: call.id, success: false, error: message });
    }
  }

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return { processed: results.length, succeeded, failed, skipped_short: skippedShort, results };
}
