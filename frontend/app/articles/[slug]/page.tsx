import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getGlobal } from "@/lib/api";
import { BlockRenderer } from "@/components/BlockRenderer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let articleData;
  try {
    articleData = await getArticle(slug);
  } catch (error) {
    console.error('Error fetching article:', error);
    notFound();
  }
  
  // Check if we have data and if the array has items
  if (!articleData || !articleData.data || articleData.data.length === 0) {
    notFound();
  }
  
  const article = articleData.data[0];

  if (!article) {
    notFound();
  }

  const globalData = await getGlobal();
  const global = globalData?.data || {};
  const siteName = global.siteName || 'Strapi Blog';

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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white mb-8"
        >
          ← Back to Articles
        </Link>

        {/* Article Header */}
        <article>
          {article.cover && article.cover.url && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={`${API_URL}${article.cover.url}`}
                alt={article.cover.alternativeText || article.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <div className="mb-8">
            {article.category && (
              <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
                {article.category.name}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
              {article.title}
            </h1>

            {article.description && (
              <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-6">
                {article.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              {article.author && (
                <div className="flex items-center gap-3">
                  {article.author.avatar && article.author.avatar.url && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={`${API_URL}${article.author.avatar.url}`}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <span>{article.author.name}</span>
                </div>
              )}
              <time>
                {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </div>

          {/* Article Blocks */}
          {article.blocks && article.blocks.length > 0 && (
            <div className="space-y-8">
              {article.blocks.map((block: any, index: number) => (
                <BlockRenderer key={index} block={block} />
              ))}
            </div>
          )}
        </article>
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

