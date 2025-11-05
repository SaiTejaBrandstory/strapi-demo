import Image from "next/image";
import Link from "next/link";
import { getArticles, getGlobal } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// Force dynamic rendering - always fetch fresh data from Strapi
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const articlesData = await getArticles();
  const articles = articlesData?.data || [];
  
  const globalData = await getGlobal();
  const global = globalData?.data || {};
  const siteName = global.siteName || 'Strapi Blog';
  const siteDescription = global.siteDescription || 'A blog made with Strapi';

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-black dark:text-white">
              {siteName}
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                Home
              </Link>
              <Link href="/about" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-black dark:text-white mb-4">
            {siteName}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {siteDescription}
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <Link 
                key={article.id}
                href={`/articles/${article.slug}`}
                className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-shadow block"
              >
                {article.cover && article.cover.url && (
                  <div className="relative w-full h-48 bg-zinc-200 dark:bg-zinc-700">
                    <Image
                      src={`${API_URL}${article.cover.url}`}
                      alt={article.cover.alternativeText || article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                  </div>
                )}
                <div className="p-6">
                  {article.category && (
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-3">
                      {article.category.name}
                    </span>
                  )}
                  <h2 className="text-2xl font-semibold text-black dark:text-white mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      {article.author && (
                        <>
                          {article.author.avatar && article.author.avatar.url && (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={`${API_URL}${article.author.avatar.url}`}
                                alt={article.author.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          )}
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {article.author.name}
                          </span>
                        </>
                      )}
                    </div>
                    <time className="text-sm text-zinc-500 dark:text-zinc-500">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-600 dark:text-zinc-400">No articles found.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} {siteName}. Powered by Strapi CMS.
          </p>
        </div>
      </footer>
    </div>
  );
}
