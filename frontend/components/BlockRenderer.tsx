import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// Markdown renderer (simple implementation)
function Markdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentParagraph: string[] = [];
  let listItems: string[] = [];
  let inList = false;

  lines.forEach((line, index) => {
    // Headers
    if (line.startsWith('## ')) {
      if (currentParagraph.length > 0) {
        elements.push(<p key={`p-${index}`} className="mb-4">{currentParagraph.join(' ')}</p>);
        currentParagraph = [];
      }
      elements.push(
        <h2 key={`h2-${index}`} className="text-3xl font-bold text-black dark:text-white mt-8 mb-4">
          {line.replace('## ', '')}
        </h2>
      );
      return;
    }

    if (line.startsWith('### ')) {
      if (currentParagraph.length > 0) {
        elements.push(<p key={`p-${index}`} className="mb-4">{currentParagraph.join(' ')}</p>);
        currentParagraph = [];
      }
      elements.push(
        <h3 key={`h3-${index}`} className="text-2xl font-semibold text-black dark:text-white mt-6 mb-3">
          {line.replace('### ', '')}
        </h3>
      );
      return;
    }

    // List items
    if (line.trim().startsWith('- ')) {
      if (!inList) {
        inList = true;
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4">{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
      }
      listItems.push(line.trim().replace('- ', ''));
      return;
    } else if (inList) {
      elements.push(
        <ul key={`ul-${index}`} className="list-disc list-inside mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }

    // Regular paragraphs
    if (line.trim()) {
      // Simple markdown processing
      let processedLine = line;
      // Bold
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Links
      processedLine = processedLine.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
      currentParagraph.push(processedLine);
    } else {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`p-${index}`} className="mb-4 text-zinc-700 dark:text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: currentParagraph.join(' ') }} />
        );
        currentParagraph = [];
      }
    }
  });

  // Handle remaining content
  if (currentParagraph.length > 0) {
    elements.push(
      <p key="p-final" className="mb-4 text-zinc-700 dark:text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: currentParagraph.join(' ') }} />
    );
  }
  if (inList && listItems.length > 0) {
    elements.push(
      <ul key="ul-final" className="list-disc list-inside mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
        {listItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  return <div>{elements}</div>;
}

export function BlockRenderer({ block }: { block: any }) {
  const component = block.__component;

  switch (component) {
    case 'shared.rich-text':
      return (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <Markdown content={block.body} />
        </div>
      );

    case 'shared.quote':
      return (
        <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-8 bg-zinc-50 dark:bg-zinc-800 rounded-r-lg">
          <p className="text-lg italic text-zinc-700 dark:text-zinc-300 mb-2">
            "{block.body}"
          </p>
          {block.title && (
            <cite className="text-sm text-zinc-600 dark:text-zinc-400">
              — {block.title}
            </cite>
          )}
        </blockquote>
      );

    case 'shared.media':
      // With populate[blocks][populate]=*, file is a direct object with url
      if (block.file && block.file.url) {
        return (
          <div className="my-8">
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700">
              <Image
                src={`${API_URL}${block.file.url}`}
                alt={block.file.alternativeText || block.file.name || block.file.caption || 'Media'}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {block.file.caption && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 text-center italic">
                {block.file.caption}
              </p>
            )}
          </div>
        );
      }
      
      // Debug: log if media block exists but no file
      if (!block.file || !block.file.url) {
        console.warn('Media block found but no file data:', block);
      }
      return null;

    case 'shared.slider':
      // With populate[blocks][populate]=*, files is a direct array
      if (block.files && Array.isArray(block.files) && block.files.length > 0) {
        return (
          <div className="my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {block.files.map((file: any, index: number) => {
                // File has direct url field when populated
                if (!file.url) {
                  console.warn('Slider file without URL:', file);
                  return null;
                }
                return (
                  <div key={file.id || index} className="relative w-full h-64 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-700">
                    <Image
                      src={`${API_URL}${file.url}`}
                      alt={file.alternativeText || file.name || file.caption || `Slide ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {file.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                        {file.caption}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      
      // Debug: log if slider block exists but no files
      if (block.files === undefined || (Array.isArray(block.files) && block.files.length === 0)) {
        console.warn('Slider block found but no files data:', block);
      }
      return null;

    default:
      return null;
  }
}

