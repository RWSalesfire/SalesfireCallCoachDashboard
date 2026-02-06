import Link from 'next/link';
import { sdrList } from '@/data/sampleData';
import MotivationCarousel from '@/components/MotivationCarousel';

export default function Home() {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-sf-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-sf-dark">SDR Call Coaching</h1>
          <p className="text-sf-secondary mt-2">
            Daily and weekly call coaching insights for the Salesfire SDR team
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/team"
          className="block bg-sf-dark text-white rounded-xl p-8 hover:bg-sf-dark/90 transition-colors mb-8"
        >
          <h3 className="text-xl font-bold">Team Overview</h3>
          <p className="text-sm text-white/70 mt-1">View superpowers, leaderboard, and team averages</p>
        </Link>

        <h2 className="text-xl font-semibold text-sf-dark mb-4">Select an SDR</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sdrList.map((sdr) => (
            <Link
              key={sdr.slug}
              href={`/${sdr.slug}/${today}`}
              className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200 border border-sf-border/50"
            >
              <h3 className="text-lg font-semibold text-sf-body">{sdr.name}</h3>
              <p className="text-sm text-sf-secondary mt-1">{sdr.email}</p>
              <div className="mt-3 pt-3 border-t border-sf-border">
                <p className="text-xs text-sf-secondary">
                  BD Partner: {sdr.bdName}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/guide"
          className="block bg-sf-card text-sf-dark rounded-xl p-6 hover:bg-sf-card/80 transition-colors border border-sf-border/50 mt-6"
        >
          <h3 className="text-lg font-semibold">Good Call vs Bad Call</h3>
          <p className="text-sm text-sf-secondary mt-1">What great calls look like across all 9 scoring areas</p>
        </Link>

      </main>

      <MotivationCarousel />

      <footer className="bg-white border-t border-sf-border mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-sf-secondary text-center">
            Salesfire Call Coaching Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
