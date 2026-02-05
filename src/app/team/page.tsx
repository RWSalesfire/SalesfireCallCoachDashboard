import TeamOverview from '@/components/team/TeamOverview';
import { getTeamOverviewData } from '@/lib/teamData';

export const revalidate = 300;

export default function TeamPage() {
  const today = new Date().toISOString().split('T')[0];
  const teamData = getTeamOverviewData(today);

  return <TeamOverview data={teamData} />;
}
