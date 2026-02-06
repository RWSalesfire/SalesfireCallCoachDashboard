import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Outcome mapping from HubSpot dispositions to our enum
const OUTCOME_MAP: Record<string, string> = {
  connected: 'warm_lead',
  'left voicemail': 'other',
  'left_voicemail': 'other',
  'no answer': 'other',
  'no_answer': 'other',
  busy: 'other',
  'wrong number': 'other',
  'wrong_number': 'other',
  'demo booked': 'demo',
  'demo_booked': 'demo',
  demo: 'demo',
  'sent email': 'email',
  'sent_email': 'email',
  email: 'email',
  'not interested': 'not_interested',
  'not_interested': 'not_interested',
  interested: 'warm_lead',
  'warm lead': 'warm_lead',
  'warm_lead': 'warm_lead',
};

function mapOutcome(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();
  // Check if it's already one of our valid values
  if (['demo', 'email', 'not_interested', 'warm_lead'].includes(lower)) {
    return lower;
  }
  return OUTCOME_MAP[lower] || null;
}

function parseDuration(value: unknown): number {
  const num = Number(value);
  if (isNaN(num) || num <= 0) return 0;
  // HubSpot sometimes sends milliseconds — if > 10000 assume ms
  return num > 10000 ? Math.round(num / 1000) : Math.round(num);
}

function parseCallDate(value: unknown): string {
  if (!value) return new Date().toISOString().split('T')[0];

  // ISO string
  if (typeof value === 'string' && value.includes('-')) {
    return new Date(value).toISOString().split('T')[0];
  }

  // Epoch — if > 10 digits it's ms, otherwise seconds
  const num = Number(value);
  if (!isNaN(num) && num > 0) {
    const ms = num > 1e12 ? num : num * 1000;
    return new Date(ms).toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export async function POST(request: NextRequest) {
  // Auth: check secret query param
  const secret = request.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Required fields
  const hubspotCallId = body.hubspot_call_id;
  const hubspotOwnerId = body.hubspot_owner_id;

  if (!hubspotCallId || !hubspotOwnerId) {
    return NextResponse.json(
      { error: 'Missing required fields: hubspot_call_id, hubspot_owner_id' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  // Look up SDR by hubspot_owner_id
  const { data: sdr, error: sdrError } = await supabase
    .from('sdrs')
    .select('id, name, slug')
    .eq('hubspot_owner_id', Number(hubspotOwnerId))
    .single();

  if (sdrError || !sdr) {
    return NextResponse.json(
      { error: `No SDR found for hubspot_owner_id: ${hubspotOwnerId}` },
      { status: 404 }
    );
  }

  const durationSeconds = parseDuration(body.duration_seconds);
  const callDate = parseCallDate(body.call_date);
  const transcript = (body.transcript as string) || null;
  const outcome = mapOutcome(body.outcome as string);

  // Upsert call (dedup on hubspot_call_id)
  const { data: call, error: callError } = await supabase
    .from('calls')
    .upsert(
      {
        hubspot_call_id: String(hubspotCallId),
        sdr_id: sdr.id,
        company: (body.company as string) || 'Unknown Company',
        prospect_name: (body.prospect_name as string) || null,
        call_date: callDate,
        duration_seconds: durationSeconds,
        outcome,
        transcript,
        recording_url: (body.recording_url as string) || null,
      },
      { onConflict: 'hubspot_call_id' }
    )
    .select('id')
    .single();

  if (callError) {
    console.error('Error upserting call:', callError);
    return NextResponse.json(
      { error: 'Failed to save call', details: callError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    call_id: call.id,
    sdr_name: sdr.name,
    sdr_slug: sdr.slug,
    call_date: callDate,
    duration: formatDuration(durationSeconds),
    has_transcript: !!transcript,
  });
}
