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
    discovery: number;
    theWhy: number;
    objections: number | 'N/A';
    close: number;
  };
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
  discovery: number;
  theWhy: number;
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
  demosBooked: number;
  demoChange: number;
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

export interface DashboardData {
  sdrName: string;
  sdrSlug: string;
  date: string;
  currentView: 'daily' | 'weekly';
  teamAvgConnectionRate: number;
  dailyStats: DailyStats;
  focusToday: FocusToday;
  yesterdaysCalls: Call[];
  weeklyData: WeeklyData;
  playbook: Playbook;
}

export interface SDRInfo {
  name: string;
  slug: string;
  email: string;
  hubspotOwnerId: number;
  bdName: string;
  bdEmail: string;
  bdHubspotOwnerId: number;
}
