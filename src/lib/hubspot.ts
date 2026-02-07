// HubSpot API client for call enrichment
// Uses native fetch — no npm dependencies needed

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

// ── Types ──

export interface EnrichedCallData {
  hubspot_call_id: number;
  hubspot_owner_id: number;
  prospect_name: string | null;
  company: string | null;
  recording_url: string | null;
  transcript: string | null;
  duration_ms: number;
  disposition: string | null;
  disposition_label: string | null;
  call_date: string;
  call_timestamp: string;
}

interface HubSpotCallProperties {
  hs_call_body?: string;
  hs_call_duration?: string;
  hs_call_disposition?: string;
  hs_call_recording_url?: string;
  hs_timestamp?: string;
  hubspot_owner_id?: string;
  hs_call_title?: string;
}

interface HubSpotSearchResult {
  id: string;
  properties: HubSpotCallProperties;
}

interface HubSpotSearchResponse {
  total: number;
  results: HubSpotSearchResult[];
  paging?: { next?: { after: string } };
}

interface HubSpotAssociation {
  from: { id: string };
  to: { toObjectId: number; associationTypes: { typeId: number }[] }[];
}

interface HubSpotBatchAssociationsResponse {
  results: HubSpotAssociation[];
}

interface HubSpotBatchReadResponse {
  results: { id: string; properties: Record<string, string | null> }[];
}

// ── Disposition mapping ──
// HubSpot stores call dispositions as GUIDs. These are the default HubSpot disposition GUIDs.
// Custom portals may have different GUIDs — unknown ones are logged and mapped to 'other'.
const DISPOSITION_GUID_MAP: Record<string, { label: string; outcome: string }> = {
  'f240bbac-87c9-4f6e-bf70-924b57d47db7': { label: 'Connected', outcome: 'warm_lead' },
  '9d9162e7-6cf3-4944-bf63-4dff82258764': { label: 'Busy', outcome: 'other' },
  '73a0d17f-1163-4015-8db0-11f8b9571a07': { label: 'No answer', outcome: 'other' },
  'a4c4c377-d246-4b32-a13b-75a56a4cd0ff': { label: 'Left voicemail', outcome: 'other' },
  'b2cf5968-551e-4856-9783-52b3da59a7d0': { label: 'Wrong number', outcome: 'other' },
  '17b47fee-58de-441e-a44c-c6300d46f273': { label: 'Left live message', outcome: 'other' },
};

function mapDisposition(guid: string | undefined): { label: string | null; outcome: string | null } {
  if (!guid) return { label: null, outcome: null };
  const mapped = DISPOSITION_GUID_MAP[guid.toLowerCase()];
  if (mapped) return mapped;
  console.warn(`[hubspot] Unknown disposition GUID: ${guid}`);
  return { label: guid, outcome: 'other' };
}

// ── Core fetch wrapper ──

function getAccessToken(): string {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new Error('HUBSPOT_ACCESS_TOKEN is not set');
  return token;
}

async function hubspotFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${HUBSPOT_API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HubSpot API error ${res.status} on ${path}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ── API functions ──

/**
 * Search for calls owned by a specific HubSpot user within a date range.
 * Handles pagination automatically (200 results per page).
 */
export async function searchCallsForOwner(
  ownerId: number,
  afterDate: string,  // YYYY-MM-DD
  beforeDate: string  // YYYY-MM-DD
): Promise<HubSpotSearchResult[]> {
  const allResults: HubSpotSearchResult[] = [];
  let after: string | undefined;

  const afterMs = new Date(afterDate + 'T00:00:00Z').getTime();
  const beforeMs = new Date(beforeDate + 'T23:59:59Z').getTime();

  do {
    const body: Record<string, unknown> = {
      filterGroups: [
        {
          filters: [
            { propertyName: 'hubspot_owner_id', operator: 'EQ', value: String(ownerId) },
            { propertyName: 'hs_timestamp', operator: 'GTE', value: String(afterMs) },
            { propertyName: 'hs_timestamp', operator: 'LTE', value: String(beforeMs) },
          ],
        },
      ],
      properties: [
        'hs_call_body',
        'hs_call_duration',
        'hs_call_disposition',
        'hs_call_recording_url',
        'hs_timestamp',
        'hubspot_owner_id',
        'hs_call_title',
      ],
      limit: 200,
    };

    if (after) {
      body.after = after;
    }

    const data = await hubspotFetch<HubSpotSearchResponse>(
      '/crm/v3/objects/calls/search',
      { method: 'POST', body: JSON.stringify(body) }
    );

    allResults.push(...data.results);
    after = data.paging?.next?.after;
  } while (after);

  return allResults;
}

/**
 * Batch get associations from calls to contacts or companies.
 * Chunks into batches of 100 (HubSpot limit).
 */
export async function batchGetAssociations(
  callIds: string[],
  toObjectType: 'contacts' | 'companies'
): Promise<Map<string, number[]>> {
  const result = new Map<string, number[]>();
  if (callIds.length === 0) return result;

  const chunks: string[][] = [];
  for (let i = 0; i < callIds.length; i += 100) {
    chunks.push(callIds.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    const data = await hubspotFetch<HubSpotBatchAssociationsResponse>(
      `/crm/v4/associations/calls/${toObjectType}/batch/read`,
      {
        method: 'POST',
        body: JSON.stringify({
          inputs: chunk.map((id) => ({ id })),
        }),
      }
    );

    for (const item of data.results) {
      const ids = (item.to || []).map((t) => t.toObjectId);
      if (ids.length > 0) {
        result.set(item.from.id, ids);
      }
    }
  }

  return result;
}

/**
 * Batch read contact records. Returns Map<contactId, full name>.
 */
export async function batchReadContacts(ids: number[]): Promise<Map<number, string>> {
  const result = new Map<number, string>();
  if (ids.length === 0) return result;

  const unique = Array.from(new Set(ids));
  const chunks: number[][] = [];
  for (let i = 0; i < unique.length; i += 100) {
    chunks.push(unique.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    const data = await hubspotFetch<HubSpotBatchReadResponse>(
      '/crm/v3/objects/contacts/batch/read',
      {
        method: 'POST',
        body: JSON.stringify({
          inputs: chunk.map((id) => ({ id: String(id) })),
          properties: ['firstname', 'lastname', 'email'],
        }),
      }
    );

    for (const contact of data.results) {
      const first = contact.properties.firstname || '';
      const last = contact.properties.lastname || '';
      const name = [first, last].filter(Boolean).join(' ').trim();
      if (name) {
        result.set(Number(contact.id), name);
      }
    }
  }

  return result;
}

/**
 * Batch read company records. Returns Map<companyId, company name>.
 */
export async function batchReadCompanies(ids: number[]): Promise<Map<number, string>> {
  const result = new Map<number, string>();
  if (ids.length === 0) return result;

  const unique = Array.from(new Set(ids));
  const chunks: number[][] = [];
  for (let i = 0; i < unique.length; i += 100) {
    chunks.push(unique.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    const data = await hubspotFetch<HubSpotBatchReadResponse>(
      '/crm/v3/objects/companies/batch/read',
      {
        method: 'POST',
        body: JSON.stringify({
          inputs: chunk.map((id) => ({ id: String(id) })),
          properties: ['name', 'domain'],
        }),
      }
    );

    for (const company of data.results) {
      const name = company.properties.name;
      if (name) {
        result.set(Number(company.id), name);
      }
    }
  }

  return result;
}

/**
 * Check if text looks like a transcript (speaker-labelled lines, substantial length).
 */
function looksLikeTranscript(text: string | undefined): boolean {
  if (!text || text.length < 100) return false;
  // Speaker-labelled patterns: "Name:", "Speaker 1:", "Rep:", etc.
  const speakerPattern = /^[A-Z][a-zA-Z\s]{1,30}:/m;
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  return lines.length >= 3 && speakerPattern.test(text);
}

/**
 * Orchestrator: search calls for an owner, resolve associations, return enriched data.
 */
export async function enrichCallsForOwner(
  ownerId: number,
  afterDate: string,
  beforeDate: string
): Promise<EnrichedCallData[]> {
  // 1. Search for calls
  const calls = await searchCallsForOwner(ownerId, afterDate, beforeDate);
  if (calls.length === 0) return [];

  const callIds = calls.map((c) => c.id);

  // 2. Get associations (contacts + companies) in parallel
  const [contactAssocs, companyAssocs] = await Promise.all([
    batchGetAssociations(callIds, 'contacts'),
    batchGetAssociations(callIds, 'companies'),
  ]);

  // 3. Collect all unique contact/company IDs
  const allContactIds: number[] = [];
  const allCompanyIds: number[] = [];
  contactAssocs.forEach((ids) => allContactIds.push(...ids));
  companyAssocs.forEach((ids) => allCompanyIds.push(...ids));

  // 4. Batch read names in parallel
  const [contactNames, companyNames] = await Promise.all([
    batchReadContacts(allContactIds),
    batchReadCompanies(allCompanyIds),
  ]);

  // 5. Build enriched results
  return calls.map((call) => {
    const props = call.properties;
    const { label: dispositionLabel, outcome: disposition } = mapDisposition(props.hs_call_disposition);

    // Resolve contact name (take first associated contact)
    const contactIds = contactAssocs.get(call.id) || [];
    let prospectName: string | null = null;
    for (const cid of contactIds) {
      const name = contactNames.get(cid);
      if (name) { prospectName = name; break; }
    }

    // Resolve company name (take first associated company)
    const compIds = companyAssocs.get(call.id) || [];
    let company: string | null = null;
    for (const cid of compIds) {
      const name = companyNames.get(cid);
      if (name) { company = name; break; }
    }

    // Duration: HubSpot hs_call_duration is in milliseconds
    const durationMs = props.hs_call_duration ? Number(props.hs_call_duration) : 0;

    // Timestamp
    const timestamp = props.hs_timestamp || new Date().toISOString();
    const callDate = new Date(Number(timestamp) || timestamp).toISOString().split('T')[0];
    const callTimestamp = new Date(Number(timestamp) || timestamp).toISOString();

    // Transcript: only if hs_call_body looks like a real transcript
    const transcript = looksLikeTranscript(props.hs_call_body) ? props.hs_call_body! : null;

    return {
      hubspot_call_id: Number(call.id),
      hubspot_owner_id: ownerId,
      prospect_name: prospectName,
      company,
      recording_url: props.hs_call_recording_url || null,
      transcript,
      duration_ms: durationMs,
      disposition,
      disposition_label: dispositionLabel,
      call_date: callDate,
      call_timestamp: callTimestamp,
    };
  });
}
