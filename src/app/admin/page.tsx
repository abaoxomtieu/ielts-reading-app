import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Reading Admin</h1>
          <p className="text-sm text-gray-600 mt-1">
            Build and preview IELTS Reading tests.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900">Tools</h2>
          <div className="mt-4">
            <Link
              href="/admin/test-builder"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white font-semibold text-sm hover:bg-gray-800"
            >
              Open Test Builder
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

