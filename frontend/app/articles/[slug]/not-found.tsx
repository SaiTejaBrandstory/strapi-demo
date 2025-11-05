import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">Article Not Found</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          The article you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

