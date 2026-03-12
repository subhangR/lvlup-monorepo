import { useEffect, useRef } from 'react';
import type { UnifiedItem, MaterialPayload, RichContentBlock, ItemAttachment } from '@levelup/shared-types';
import { File, ExternalLink, ImageIcon, Music } from 'lucide-react';

interface MaterialViewerProps {
  item: UnifiedItem;
  /** Called once when the material is considered "viewed/completed". */
  onComplete?: (itemId: string) => void;
}

export default function MaterialViewer({ item, onComplete }: MaterialViewerProps) {
  const payload = item.payload as MaterialPayload;
  const completedRef = useRef(false);

  // Mark material as completed on mount (user opened/viewed it).
  // Uses a ref to ensure the callback fires at most once per mount.
  useEffect(() => {
    if (onComplete && !completedRef.current) {
      completedRef.current = true;
      onComplete(item.id);
    }
  }, [item.id, onComplete]);

  return (
    <div className="space-y-4">
      <MaterialContent payload={payload} title={item.title} />
      {item.attachments && item.attachments.length > 0 && (
        <AttachmentList attachments={item.attachments} />
      )}
    </div>
  );
}

function AttachmentList({ attachments }: { attachments: ItemAttachment[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">Attachments</h4>
      <div className="grid gap-2 sm:grid-cols-2">
        {attachments.map((att) => {
          if (att.type === 'image') {
            return (
              <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="block">
                <img src={att.url} alt={att.fileName} loading="lazy" decoding="async" className="rounded-lg border w-full object-cover max-h-48" />
                <p className="mt-1 text-xs text-muted-foreground truncate">{att.fileName}</p>
              </a>
            );
          }
          if (att.type === 'audio') {
            return (
              <div key={att.id} className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-4 w-4 text-purple-500" />
                  <span className="text-sm truncate">{att.fileName}</span>
                </div>
                <audio controls className="w-full" src={att.url} />
              </div>
            );
          }
          return (
            <a
              key={att.id}
              href={att.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border p-3 hover:bg-muted transition-colors"
            >
              <File className="h-4 w-4 text-red-500" />
              <span className="text-sm flex-1 truncate">{att.fileName}</span>
              <span className="text-xs text-muted-foreground">{(att.size / 1024).toFixed(0)}KB</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function MaterialContent({ payload, title }: { payload: MaterialPayload; title?: string }) {
  switch (payload.materialType) {
    case 'text':
      return <TextMaterial content={payload.content ?? ''} title={title} />;
    case 'video':
      return <VideoMaterial url={payload.url} duration={payload.duration} title={title} />;
    case 'pdf':
      return <PDFMaterial url={payload.url} title={title} downloadable={payload.downloadable} />;
    case 'link':
      return <LinkMaterial url={payload.url} title={title} />;
    case 'interactive':
      return <InteractiveMaterial url={payload.url} title={title} />;
    case 'story':
      return <TextMaterial content={payload.content ?? ''} title={title} />;
    case 'rich':
      return <RichMaterial richContent={payload.richContent} title={title} />;
    default:
      return <p className="text-sm text-muted-foreground">Unsupported material type</p>;
  }
}

function TextMaterial({ content, title }: { content: string; title?: string }) {
  const isHtml = content.startsWith('<') || content.includes('<p>') || content.includes('<h');

  return (
    <div>
      {title && <h3 className="text-base font-semibold mb-2">{title}</h3>}
      {isHtml ? (
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div className="prose prose-sm max-w-none whitespace-pre-wrap">{content}</div>
      )}
    </div>
  );
}

function VideoMaterial({ url, duration, title }: { url?: string; duration?: number; title?: string }) {
  if (!url) return <p className="text-sm text-muted-foreground">No video URL provided</p>;

  // Detect YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);

  return (
    <div>
      {title && <h3 className="text-base font-semibold mb-2">{title}</h3>}
      {youtubeMatch ? (
        <div className="aspect-video rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={title || 'Video content'}
          />
        </div>
      ) : (
        <video src={url} controls className="w-full rounded-lg" />
      )}
      {duration && (
        <p className="mt-1 text-xs text-muted-foreground">
          Duration: {Math.floor(duration / 60)}m {duration % 60}s
        </p>
      )}
    </div>
  );
}

function PDFMaterial({ url, title, downloadable }: { url?: string; title?: string; downloadable?: boolean }) {
  if (!url) return <p className="text-sm text-muted-foreground">No PDF URL provided</p>;

  return (
    <div>
      {title && <h3 className="text-base font-semibold mb-2">{title}</h3>}
      <div className="rounded-lg border overflow-hidden" style={{ height: '60vh', minHeight: '300px' }}>
        <iframe src={url} className="w-full h-full" title={title || 'PDF document'} />
      </div>
      {downloadable && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <File className="h-4 w-4" /> Download PDF
        </a>
      )}
    </div>
  );
}

function LinkMaterial({ url, title }: { url?: string; title?: string }) {
  if (!url) return <p className="text-sm text-muted-foreground">No URL provided</p>;

  return (
    <div>
      {title && <h3 className="text-base font-semibold mb-2">{title}</h3>}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border p-4 text-primary hover:bg-primary/10"
      >
        <ExternalLink className="h-5 w-5" />
        <span className="text-sm font-medium">{url}</span>
      </a>
    </div>
  );
}

function InteractiveMaterial({ url, title }: { url?: string; title?: string }) {
  if (!url) return <p className="text-sm text-muted-foreground">No interactive URL</p>;

  return (
    <div>
      {title && <h3 className="text-base font-semibold mb-2">{title}</h3>}
      <div className="rounded-lg border overflow-hidden" style={{ height: '60vh', minHeight: '300px' }}>
        <iframe src={url} className="w-full h-full" sandbox="allow-scripts allow-same-origin" title={title || 'Interactive content'} />
      </div>
    </div>
  );
}

function RichMaterial({ richContent, title }: { richContent?: RichContentBlock; title?: string }) {
  if (!richContent) return <p className="text-sm text-muted-foreground">No content</p>;

  return (
    <article className="max-w-2xl mx-auto">
      {richContent.coverImage && (
        <img
          src={richContent.coverImage}
          alt={title ? `Cover image for ${title}` : 'Article cover image'}
          loading="eager"
          decoding="async"
          className="w-full rounded-lg mb-4 object-cover"
          style={{ maxHeight: '300px' }}
        />
      )}
      {(richContent.title || title) && (
        <h2 className="text-xl font-bold mb-1">{richContent.title || title}</h2>
      )}
      {richContent.subtitle && (
        <p className="text-muted-foreground mb-3">{richContent.subtitle}</p>
      )}
      {richContent.author && (
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          {richContent.author.avatar && (
            <img src={richContent.author.avatar} alt={`${richContent.author.name}'s avatar`} loading="lazy" decoding="async" className="w-6 h-6 rounded-full" />
          )}
          <span>{richContent.author.name}</span>
          {richContent.readingTime && <span>· {richContent.readingTime} min read</span>}
        </div>
      )}
      <div className="space-y-3">
        {richContent.blocks.map((block) => {
          switch (block.type) {
            case 'heading':
              return <h3 key={block.id} className="text-lg font-semibold mt-4">{block.content}</h3>;
            case 'paragraph':
              return <p key={block.id} className="text-sm leading-relaxed">{block.content}</p>;
            case 'image':
              return <img key={block.id} src={block.content} alt={block.caption || 'Content image'} loading="lazy" decoding="async" className="w-full rounded-lg" />;
            case 'code':
              return (
                <pre key={block.id} className="rounded bg-zinc-900 dark:bg-zinc-950 text-zinc-100 p-3 text-xs overflow-x-auto">
                  <code>{block.content}</code>
                </pre>
              );
            case 'quote':
              return (
                <blockquote key={block.id} className="border-l-4 border-border pl-4 italic text-sm text-muted-foreground">
                  {block.content}
                </blockquote>
              );
            case 'list':
              return (
                <ul key={block.id} className="list-disc pl-6 text-sm space-y-1">
                  {block.content.split('\n').map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              );
            case 'divider':
              return <hr key={block.id} className="border-gray-200" />;
            default:
              return <p key={block.id} className="text-sm">{block.content}</p>;
          }
        })}
      </div>
      {richContent.tags && richContent.tags.length > 0 && (
        <div className="flex gap-1 mt-4">
          {richContent.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
