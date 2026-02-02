import { notFound } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { getDashboardData } from '@/lib/data';
import { sdrList } from '@/data/sampleData';

interface PageProps {
  params: Promise<{
    sdr: string;
    date: string;
  }>;
}

// Generate static params for sample data (pre-render these pages)
export function generateStaticParams() {
  const dates = ['2026-02-03', '2026-02-02', '2026-02-01'];
  const params = [];

  for (const sdr of sdrList) {
    for (const date of dates) {
      params.push({ sdr: sdr.slug, date });
    }
  }

  return params;
}

// Allow dynamic pages for any date
export const dynamicParams = true;

// Revalidate every 5 minutes for fresh data
export const revalidate = 300;

export default async function DailyPage({ params }: PageProps) {
  const { sdr, date } = await params;

  // Fetch from Supabase with fallback to sample data
  const data = await getDashboardData(sdr, date);

  if (!data) {
    notFound();
  }

  return <Dashboard data={data} initialView="daily" />;
}
