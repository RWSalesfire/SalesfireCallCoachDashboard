import { NextRequest, NextResponse } from 'next/server';
import { runEnrichCalls, EnrichResult } from '@/lib/pipeline/enrichCalls';
import { runTranscribeCalls, TranscribeResult } from '@/lib/pipeline/transcribeCalls';
import { runAnalyzeCalls, AnalyzeResult } from '@/lib/pipeline/analyzeCalls';
import { runAggregateDaily, AggregateResult } from '@/lib/pipeline/aggregateDaily';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function verifyCronSecret(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  if (auth === `Bearer ${process.env.CRON_SECRET}`) return true;
  const secret = request.nextUrl.searchParams.get('secret');
  return secret === process.env.CRON_SECRET;
}

interface PipelineResult {
  enrich: { success: boolean; duration_ms: number; result?: EnrichResult; error?: string };
  transcribe: { success: boolean; duration_ms: number; result?: TranscribeResult; error?: string };
  analyze: { success: boolean; duration_ms: number; result?: AnalyzeResult; error?: string };
  aggregate: { success: boolean; duration_ms: number; result?: AggregateResult; error?: string };
  total_duration_ms: number;
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pipelineStart = Date.now();
  const result: PipelineResult = {
    enrich: { success: false, duration_ms: 0 },
    transcribe: { success: false, duration_ms: 0 },
    analyze: { success: false, duration_ms: 0 },
    aggregate: { success: false, duration_ms: 0 },
    total_duration_ms: 0,
  };

  // Step 1: Enrich calls from HubSpot
  const enrichStart = Date.now();
  try {
    const enrichResult = await runEnrichCalls();
    result.enrich = {
      success: true,
      duration_ms: Date.now() - enrichStart,
      result: enrichResult,
    };
    console.log(`[pipeline] Enrich completed: ${enrichResult.calls_enriched} calls enriched in ${result.enrich.duration_ms}ms`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    result.enrich = {
      success: false,
      duration_ms: Date.now() - enrichStart,
      error: msg,
    };
    console.error(`[pipeline] Enrich failed: ${msg}`);
    // Continue — analysis can still run on existing data
  }

  // Step 2: Transcribe calls with Deepgram
  const transcribeStart = Date.now();
  try {
    const transcribeResult = await runTranscribeCalls();
    result.transcribe = {
      success: true,
      duration_ms: Date.now() - transcribeStart,
      result: transcribeResult,
    };
    console.log(`[pipeline] Transcribe completed: ${transcribeResult.succeeded} calls transcribed in ${result.transcribe.duration_ms}ms`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    result.transcribe = {
      success: false,
      duration_ms: Date.now() - transcribeStart,
      error: msg,
    };
    console.error(`[pipeline] Transcribe failed: ${msg}`);
    // Continue — analysis can still run on existing transcripts
  }

  // Step 3: Analyze calls with Claude
  const analyzeStart = Date.now();
  try {
    const analyzeResult = await runAnalyzeCalls();
    result.analyze = {
      success: true,
      duration_ms: Date.now() - analyzeStart,
      result: analyzeResult,
    };
    console.log(`[pipeline] Analyze completed: ${analyzeResult.processed} calls in ${result.analyze.duration_ms}ms`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    result.analyze = {
      success: false,
      duration_ms: Date.now() - analyzeStart,
      error: msg,
    };
    console.error(`[pipeline] Analyze failed: ${msg}`);
    // Continue — aggregation can still run on existing analyses
  }

  // Step 4: Aggregate daily stats and focus
  const aggregateStart = Date.now();
  try {
    const aggregateResult = await runAggregateDaily();
    result.aggregate = {
      success: true,
      duration_ms: Date.now() - aggregateStart,
      result: aggregateResult,
    };
    console.log(`[pipeline] Aggregate completed in ${result.aggregate.duration_ms}ms`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    result.aggregate = {
      success: false,
      duration_ms: Date.now() - aggregateStart,
      error: msg,
    };
    console.error(`[pipeline] Aggregate failed: ${msg}`);
  }

  result.total_duration_ms = Date.now() - pipelineStart;

  const allSucceeded = result.enrich.success && result.transcribe.success && result.analyze.success && result.aggregate.success;
  const status = allSucceeded ? 200 : 207; // 207 Multi-Status if partial failure

  return NextResponse.json(result, { status });
}

// Vercel cron triggers GET requests
export async function GET(request: NextRequest) {
  return POST(request);
}
