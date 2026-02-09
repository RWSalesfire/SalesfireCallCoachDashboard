import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { transcribeFromUrl } from '@/lib/deepgram';

const MAX_CALLS_PER_RUN = 10;
const MIN_DURATION_MS = 30_000; // Skip calls under 30s (voicemails, wrong numbers)

export interface TranscribeResult {
  processed: number;
  succeeded: number;
  failed: number;
  skipped_short: number;
  results: { call_id: string; success: boolean; duration_secs?: number; error?: string }[];
}

export async function runTranscribeCalls(): Promise<TranscribeResult> {
  const supabase = getSupabaseAdmin();

  // Find calls with a recording URL but no transcript yet
  const { data: calls, error: fetchError } = await supabase
    .from('calls')
    .select('id, recording_url, duration_ms')
    .eq('has_transcript', false)
    .not('recording_url', 'is', null)
    .neq('recording_url', '')
    .order('created_at', { ascending: true })
    .limit(MAX_CALLS_PER_RUN);

  if (fetchError) {
    throw new Error(`Failed to fetch calls for transcription: ${fetchError.message}`);
  }

  if (!calls || calls.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0, skipped_short: 0, results: [] };
  }

  const results: TranscribeResult['results'] = [];
  let skippedShort = 0;

  for (const call of calls) {
    // Skip very short calls (voicemails, wrong numbers)
    if (call.duration_ms && call.duration_ms < MIN_DURATION_MS) {
      skippedShort++;
      // Mark as "transcribed" so we don't retry — there's nothing useful to transcribe
      await supabase
        .from('calls')
        .update({ has_transcript: true })
        .eq('id', call.id);
      continue;
    }

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
