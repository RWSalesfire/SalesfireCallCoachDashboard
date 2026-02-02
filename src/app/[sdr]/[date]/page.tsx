import { notFound } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { getSampleDataForSDR, sdrList } from '@/data/sampleData';

interface PageProps {
  params: Promise<{
    sdr: string;
    date: string;
  }>;
}

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

export default async function DailyPage({ params }: PageProps) {
  const { sdr, date } = await params;
  const data = getSampleDataForSDR(sdr, date);

  if (!data) {
    notFound();
  }

  return <Dashboard data={data} initialView="daily" />;
}
