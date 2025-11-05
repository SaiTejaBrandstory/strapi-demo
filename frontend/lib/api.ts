const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

async function fetchAPI(path: string, options: RequestInit = {}) {
  const url = `${API_URL}/api${path}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Disable caching to always get fresh data from Strapi
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const res = await fetch(url, mergedOptions);

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API Error (${res.status}):`, errorText);
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }

  return res.json();
}

export async function getArticles() {
  const data = await fetchAPI('/articles?populate=*');
  return data;
}

export async function getArticle(slug: string) {
  // Get article with blocks populated (for component media fields)
  const blockData = await fetchAPI(`/articles?filters[slug][$eq]=${slug}&populate[blocks][populate]=*`);
  
  // Get article with main relations populated (cover, author, category)
  const mainData = await fetchAPI(`/articles?filters[slug][$eq]=${slug}&populate=*`);
  
  // Merge: use blocks from blockData, everything else from mainData
  if (blockData?.data?.[0] && mainData?.data?.[0]) {
    return {
      ...blockData,
      data: [{
        ...mainData.data[0],
        blocks: blockData.data[0].blocks // Use populated blocks
      }]
    };
  }
  
  // Fallback to whichever has data
  return blockData?.data?.[0] ? blockData : mainData;
}

export async function getGlobal() {
  const data = await fetchAPI('/global?populate=*');
  return data;
}

export async function getAuthors() {
  const data = await fetchAPI('/authors?populate=*');
  return data;
}

export async function getCategories() {
  const data = await fetchAPI('/categories?populate=*');
  return data;
}

