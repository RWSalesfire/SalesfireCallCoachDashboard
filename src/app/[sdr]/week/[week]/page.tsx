import { notFound } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { getDashboardData } from '@/lib/data';
import { sdrList } from '@/data/sampleData';

interface PageProps {
  params: Promise<{
    sdr: string;
    week: string;
  }>;
}

// Generate static params for sample data (pre-render these pages)
export function generateStaticParams() {
  const weeks = ['4', '5', '6'];
  const params = [];

  for (const sdr of sdrList) {
    for (const week of weeks) {
      params.push({ sdr: sdr.slug, week });
    }
  }

  return params;
}

// Allow dynamic pages for any week
export const dynamicParams = true;

// Revalidate every 5 minutes for fresh data
export const revalidate = 300;

// Helper to get the Monday of an ISO week
function getDateFromWeek(year: number, week: number): string {
  // ISO 8601: Week 1 contains January 4th
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1);
  const targetMonday = new Date(mondayOfWeek1);
  targetMonday.setUTCDate(mondayOfWeek1.getUTCDate() + (week - 1) * 7);
  return targetMonday.toISOString().split('T')[0];
}

export default async function WeeklyPage({ params }: PageProps) {
  const { sdr, week } = await params;
  const weekNum = parseInt(week, 10);

  if (isNaN(weekNum) || weekNum < 1 || weekNum > 53) {
    notFound();
  }

  // Get a date that falls within the requested week
  const date = getDateFromWeek(2026, weekNum);

  // Fetch from Supabase with fallback to sample data
  const data = await getDashboardData(sdr, date);

  if (!data) {
    notFound();
  }

  // Ensure the week number matches what was requested
  data.weeklyData.weekNumber = weekNum;

  return <Dashboard data={data} initialView="weekly" />;
}
