import { notFound } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { getSampleDataForSDR, sdrList } from '@/data/sampleData';

interface PageProps {
  params: Promise<{
    sdr: string;
    week: string;
  }>;
}

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

export default async function WeeklyPage({ params }: PageProps) {
  const { sdr, week } = await params;
  const weekNum = parseInt(week, 10);

  if (isNaN(weekNum)) {
    notFound();
  }

  // For sample data, we use a fixed date but update the week number
  const data = getSampleDataForSDR(sdr, '2026-02-03');

  if (!data) {
    notFound();
  }

  // Update week number in the data
  data.weeklyData.weekNumber = weekNum;

  return <Dashboard data={data} initialView="weekly" />;
}
