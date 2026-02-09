// Deepgram API client for call transcription
// Uses native fetch — no npm dependencies needed

const DEEPGRAM_API_BASE = 'https://api.deepgram.com/v1';

// ── Types ──

interface DeepgramWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker: number;
  punctuated_word: string;
}

interface DeepgramUtterance {
  start: number;
  end: number;
  confidence: number;
  channel: number;
  transcript: string;
  words: DeepgramWord[];
  speaker: number;
  id: string;
}

interface DeepgramResult {
  metadata: {
    request_id: string;
    duration: number;
    channels: number;
  };
  results: {
    channels: {
      alternatives: {
        transcript: string;
        confidence: number;
        words: DeepgramWord[];
      }[];
    }[];
    utterances: DeepgramUtterance[];
  };
}

export interface TranscriptionResult {
  transcript: string;
  duration_secs: number;
  confidence: number;
  speaker_count: number;
}

// ── Core fetch wrapper ──

function getApiKey(): string {
  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) throw new Error('DEEPGRAM_API_KEY is not set');
  return key;
}

async function deepgramFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${DEEPGRAM_API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getApiKey()}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Deepgram API error ${res.status} on ${path}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ── Formatting ──

/**
 * Merge adjacent utterances from the same speaker for cleaner output.
 * Input:  [{ speaker: 0, transcript: "Hi" }, { speaker: 0, transcript: "how are you" }, { speaker: 1, transcript: "Good" }]
 * Output: [{ speaker: 0, transcript: "Hi how are you" }, { speaker: 1, transcript: "Good" }]
 */
function mergeUtterances(utterances: DeepgramUtterance[]): { speaker: number; transcript: string }[] {
  if (utterances.length === 0) return [];

  const merged: { speaker: number; transcript: string }[] = [];
  let current = { speaker: utterances[0].speaker, transcript: utterances[0].transcript };

  for (let i = 1; i < utterances.length; i++) {
    const utt = utterances[i];
    if (utt.speaker === current.speaker) {
      current.transcript += ' ' + utt.transcript;
    } else {
      merged.push(current);
      current = { speaker: utt.speaker, transcript: utt.transcript };
    }
  }
  merged.push(current);

  return merged;
}

/**
 * Format merged utterances into speaker-labelled text.
 * Uses 1-based speaker numbers: "Speaker 1: ...\n\nSpeaker 2: ..."
 */
function formatTranscript(utterances: DeepgramUtterance[]): { text: string; speakerCount: number } {
  const merged = mergeUtterances(utterances);
  const speakers = new Set(merged.map((u) => u.speaker));

  const lines = merged.map((u) => `Speaker ${u.speaker + 1}: ${u.transcript}`);

  return {
    text: lines.join('\n\n'),
    speakerCount: speakers.size,
  };
}

// ── Public API ──

/**
 * Transcribe audio from a URL using Deepgram Nova-2 with speaker diarisation.
 * Returns speaker-labelled transcript text, duration, confidence, and speaker count.
 */
export async function transcribeFromUrl(audioUrl: string): Promise<TranscriptionResult> {
  const data = await deepgramFetch<DeepgramResult>(
    '/listen?model=nova-2&diarize=true&utterances=true&smart_format=true',
    {
      method: 'POST',
      body: JSON.stringify({ url: audioUrl }),
    }
  );

  const utterances = data.results.utterances || [];

  if (utterances.length === 0) {
    // Fallback: use the channel transcript if no utterances
    const channelTranscript = data.results.channels?.[0]?.alternatives?.[0]?.transcript || '';
    return {
      transcript: channelTranscript,
      duration_secs: data.metadata.duration,
      confidence: data.results.channels?.[0]?.alternatives?.[0]?.confidence || 0,
      speaker_count: 0,
    };
  }

  const { text, speakerCount } = formatTranscript(utterances);
  const avgConfidence = utterances.reduce((sum, u) => sum + u.confidence, 0) / utterances.length;

  return {
    transcript: text,
    duration_secs: data.metadata.duration,
    confidence: Math.round(avgConfidence * 1000) / 1000,
    speaker_count: speakerCount,
  };
}
