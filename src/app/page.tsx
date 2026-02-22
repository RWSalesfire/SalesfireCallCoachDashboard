import Link from 'next/link';
import { sdrList } from '@/data/sampleData';
import MotivationCarousel from '@/components/MotivationCarousel';

export default function Home() {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-sf-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="page-title-lg">SDR Call Coaching</h1>
          <p className="body-muted mt-2 text-base">
            Daily and weekly call coaching insights for the Salesfire SDR team
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/team"
          className="block bg-sf-dark text-white rounded-xl p-8 hover:bg-sf-dark/90 transition-colors mb-10"
        >
          <h2 className="text-xl font-bold tracking-tight">Team Overview</h2>
          <p className="text-sm text-white/70 mt-1.5">View superpowers, leaderboard, and team averages</p>
        </Link>

        <h2 className="section-title mb-5">Select an SDR</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sdrList.map((sdr) => (
            <Link
              key={sdr.slug}
              href={`/${sdr.slug}/${today}`}
              className="group bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 border border-sf-border/50 hover:border-sf-dark/20"
            >
              <h3 className="text-lg font-semibold text-sf-body group-hover:text-sf-dark transition-colors">
                {sdr.name}
              </h3>
              <p className="text-sm text-sf-secondary mt-1">{sdr.email}</p>
              <div className="mt-4 pt-4 border-t border-sf-border">
                <p className="text-xs text-sf-secondary">
                  BD Partner: {sdr.bdName}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <MotivationCarousel />
      </main>

      <footer className="bg-white border-t border-sf-border mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="caption text-center">
            Salesfire Call Coaching Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
