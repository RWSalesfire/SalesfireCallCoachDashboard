export interface CallMetrics {
  talkTime: number;
  talkSpeed: number;
  monologue?: number;
  customerStory?: number;
  patience?: number;
}

export interface AreaBreakdownItem {
  score: number;
  why: string;
  well: string;
  improve: string;
  tryNext: string;
}

export interface FocusPriority {
  rank: 1 | 2 | 3;
  area: string;
  areaLabel: string;
  avgScore: number;
  tryNext: string;
}

export interface Call {
  id: string;
  company: string;
  prospect: string;
  date: string;
  duration: string;
  outcome: 'demo' | 'email' | 'not_interested' | 'warm_lead';
  overall: number;
  insight: string;
  scores?: {
    gatekeeper: number | 'N/A';
    opener: number;
    personalisation: number | 'N/A';
    discovery: number;
    callControl: number | 'N/A';
    toneEnergy: number | 'N/A';
    valueProp: number;
    objections: number | 'N/A';
    close: number;
  };
  metrics?: CallMetrics;
  areaBreakdown?: Record<string, AreaBreakdownItem>;
  keyMoment?: string;
  improvement?: string;
}

export interface DailyStats {
  totalDials: number;
  connectedCalls: number;
  connectionRate: number;
}

export interface FocusToday {
  instruction: string;
}

export interface WeekFocus {
  title: string;
  triggers: string[];
  dont: string;
  do: string;
  example: {
    context: string;
    couldHaveSaid: string;
  };
}

export interface ProgressDataPoint {
  week: number;
  overall: number;
  focusArea: number;
  close: number;
}

export interface RadarScores {
  gatekeeper: number;
  opener: number;
  personalisation: number;
  discovery: number;
  callControl: number;
  toneEnergy: number;
  valueProp: number;
  objections: number;
  close: number;
}

export interface WhyConnection {
  feature: string;
  why: string;
}

export interface ObjectionResponse {
  objection: string;
  response: string;
  followUp?: string;
}

export interface CaseStudy {
  sector: string;
  client: string;
  result: string;
  product: string;
}

export interface Playbook {
  whyConnections: WhyConnection[];
  objectionResponses: ObjectionResponse[];
  caseStudies: CaseStudy[];
}

export interface WeeklyData {
  weekNumber: number;
  callsReviewed: number;
  topScore: number;
  avgOverall: number;
  overallChange: number;
  avgFocusArea: number;
  focusAreaChange: number;
  focusAreaName: string;
  calls: Call[];
  radarScores: RadarScores;
  progressData: ProgressDataPoint[];
  weekFocus: WeekFocus;
}

export interface Last30DaysData {
  callsReviewed: number;
  demosBooked: number;
  avgOverall: number;
  calls: Call[];
}

export interface LibraryData {
  callsReviewed: number;
  demosBooked: number;
  avgOverall: number;
  calls: Call[];
}

export interface DashboardData {
  sdrName: string;
  sdrSlug: string;
  date: string;
  currentView: 'daily' | 'weekly' | 'last30days' | 'library';
  teamAvgConnectionRate: number;
  dailyStats: DailyStats;
  focusToday: FocusToday;
  yesterdaysCalls: Call[];
  weeklyData: WeeklyData;
  last30DaysData: Last30DaysData;
  libraryData: LibraryData;
  allTimeRadarScores: RadarScores;
  playbook: Playbook;
}

export type Timeframe = 'thisWeek' | 'last4Weeks' | 'last3Months';

export interface SDRInfo {
  name: string;
  slug: string;
  email: string;
  hubspotOwnerId: number;
  bdName: string;
  bdEmail: string;
  bdHubspotOwnerId: number;
}
