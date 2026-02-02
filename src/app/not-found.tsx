import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-sf-dark mb-4">404</h1>
        <p className="text-sf-secondary mb-6">SDR or page not found</p>
        <Link
          href="/"
          className="inline-block bg-sf-dark text-white px-6 py-3 rounded-lg hover:bg-sf-dark/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
