import Link from 'next/link';
import ReadingTestBuilder from '@/components/admin/ReadingTestBuilder';

export default function AdminTestBuilderPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Reading Test Builder</h1>
            <p className="text-sm text-gray-600">
              Add passage (HTML) + edit question JSON + preview.
            </p>
          </div>
          <Link
            href="/admin"
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50"
          >
            Back to Admin
          </Link>
        </div>
      </header>

      <ReadingTestBuilder />
    </div>
  );
}

