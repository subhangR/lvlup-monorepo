import { useState } from "react";
import type {
  UnifiedItem,
  MaterialPayload,
  RichContentBlock,
  ItemAttachment,
} from "@levelup/shared-types";
import { File, ExternalLink, Music, CheckCircle2 } from "lucide-react";
import ImageLightbox, { type LightboxImage } from "../common/ImageLightbox";

interface MaterialViewerProps {
  item: UnifiedItem;
  /** Called when the student explicitly marks the material as complete. */
  onComplete?: (itemId: string) => void;
  /** Whether this material is already completed in progress. */
  isCompleted?: boolean;
}

export default function MaterialViewer({ item, onComplete, isCompleted }: MaterialViewerProps) {
  const payload = item.payload as MaterialPayload;

  return (
    <div className="space-y-4">
      <MaterialContent payload={payload} title={item.title} />
      {item.attachments && item.attachments.length > 0 && (
        <AttachmentList attachments={item.attachments} />
      )}
      {onComplete && (
        <div className="flex justify-end pt-2">
          {isCompleted ? (
            <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </div>
          ) : (
            <button
              onClick={() => onComplete(item.id)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark as Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AttachmentList({ attachments }: { attachments: ItemAttachment[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const imageAttachments: LightboxImage[] = attachments
    .filter((a) => a.type === "image")
    .map((a) => ({ url: a.url, alt: a.fileName }));

  let imageCounter = -1;

  return (
    <div className="space-y-2">
      <h4 className="text-muted-foreground text-sm font-medium">Attachments</h4>
      <div className="grid gap-2 sm:grid-cols-2">
        {attachments.map((att) => {
          if (att.type === "image") {
            imageCounter++;
            const idx = imageCounter;
            return (
              <button
                key={att.id}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className="group block cursor-zoom-in text-left"
              >
                <img
                  src={att.url}
                  alt={att.fileName}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-lg border bg-white object-contain dark:bg-zinc-900"
                />
                <p className="text-muted-foreground group-hover:text-foreground mt-1 truncate text-xs transition-colors">
                  {att.fileName}
                </p>
              </button>
            );
          }
          if (att.type === "audio") {
            return (
              <div key={att.id} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Music className="h-4 w-4 text-purple-500" />
                  <span className="truncate text-sm">{att.fileName}</span>
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
              className="hover:bg-muted flex items-center gap-2 rounded-lg border p-3 transition-colors"
            >
              <File className="h-4 w-4 text-red-500" />
              <span className="flex-1 truncate text-sm">{att.fileName}</span>
              <span className="text-muted-foreground text-xs">
                {(att.size / 1024).toFixed(0)}KB
              </span>
            </a>
          );
        })}
      </div>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={imageAttachments}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

function MaterialContent({ payload, title }: { payload: MaterialPayload; title?: string }) {
  switch (payload.materialType) {
    case "text":
      return <TextMaterial content={payload.content ?? ""} title={title} />;
    case "video":
      return <VideoMaterial url={payload.url} duration={payload.duration} title={title} />;
    case "pdf":
      return <PDFMaterial url={payload.url} title={title} downloadable={payload.downloadable} />;
    case "link":
      return <LinkMaterial url={payload.url} title={title} />;
    case "interactive":
      return <InteractiveMaterial url={payload.url} title={title} />;
    case "story":
      return <TextMaterial content={payload.content ?? ""} title={title} />;
    case "rich":
      return <RichMaterial richContent={payload.richContent} title={title} />;
    default:
      return <p className="text-muted-foreground text-sm">Unsupported material type</p>;
  }
}

function TextMaterial({ content, title }: { content: string; title?: string }) {
  const isHtml = content.startsWith("<") || content.includes("<p>") || content.includes("<h");

  return (
    <div>
      {title && <h3 className="mb-2 text-base font-semibold">{title}</h3>}
      {isHtml ? (
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div className="prose prose-sm max-w-none whitespace-pre-wrap">{content}</div>
      )}
    </div>
  );
}

function VideoMaterial({
  url,
  duration,
  title,
}: {
  url?: string;
  duration?: number;
  title?: string;
}) {
  if (!url) return <p className="text-muted-foreground text-sm">No video URL provided</p>;

  // Detect YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);

  return (
    <div>
      {title && <h3 className="mb-2 text-base font-semibold">{title}</h3>}
      {youtubeMatch ? (
        <div className="aspect-video overflow-hidden rounded-lg">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            className="h-full w-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={title || "Video content"}
          />
        </div>
      ) : (
        <video src={url} controls className="w-full rounded-lg" />
      )}
      {duration && (
        <p className="text-muted-foreground mt-1 text-xs">
          Duration: {Math.floor(duration / 60)}m {duration % 60}s
        </p>
      )}
    </div>
  );
}

function PDFMaterial({
  url,
  title,
  downloadable,
}: {
  url?: string;
  title?: string;
  downloadable?: boolean;
}) {
  if (!url) return <p className="text-muted-foreground text-sm">No PDF URL provided</p>;

  return (
    <div>
      {title && <h3 className="mb-2 text-base font-semibold">{title}</h3>}
      <div
        className="overflow-hidden rounded-lg border"
        style={{ height: "60vh", minHeight: "300px" }}
      >
        <iframe src={url} className="h-full w-full" title={title || "PDF document"} />
      </div>
      {downloadable && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary mt-2 inline-flex items-center gap-1 text-sm hover:underline"
        >
          <File className="h-4 w-4" /> Download PDF
        </a>
      )}
    </div>
  );
}

function LinkMaterial({ url, title }: { url?: string; title?: string }) {
  if (!url) return <p className="text-muted-foreground text-sm">No URL provided</p>;

  return (
    <div>
      {title && <h3 className="mb-2 text-base font-semibold">{title}</h3>}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:bg-primary/10 inline-flex items-center gap-2 rounded-lg border p-4"
      >
        <ExternalLink className="h-5 w-5" />
        <span className="text-sm font-medium">{url}</span>
      </a>
    </div>
  );
}

function InteractiveMaterial({ url, title }: { url?: string; title?: string }) {
  if (!url) return <p className="text-muted-foreground text-sm">No interactive URL</p>;

  return (
    <div>
      {title && <h3 className="mb-2 text-base font-semibold">{title}</h3>}
      <div
        className="overflow-hidden rounded-lg border"
        style={{ height: "60vh", minHeight: "300px" }}
      >
        <iframe
          src={url}
          className="h-full w-full"
          sandbox="allow-scripts allow-same-origin"
          title={title || "Interactive content"}
        />
      </div>
    </div>
  );
}

function RichMaterial({ richContent, title }: { richContent?: RichContentBlock; title?: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!richContent) return <p className="text-muted-foreground text-sm">No content</p>;

  // Collect all image blocks for lightbox navigation
  const imageBlocks: LightboxImage[] = [];
  if (richContent.coverImage) {
    imageBlocks.push({
      url: richContent.coverImage,
      alt: title ? `Cover image for ${title}` : "Article cover image",
    });
  }
  for (const block of richContent.blocks) {
    if (block.type === "image") {
      imageBlocks.push({
        url: block.content,
        alt: ((block.metadata as Record<string, unknown>)?.caption as string) || "Content image",
      });
    }
  }

  let imageBlockCounter = richContent.coverImage ? 0 : -1;

  return (
    <article className="mx-auto max-w-2xl">
      {richContent.coverImage && (
        <button type="button" onClick={() => setLightboxIndex(0)} className="w-full cursor-zoom-in">
          <img
            src={richContent.coverImage}
            alt={title ? `Cover image for ${title}` : "Article cover image"}
            loading="eager"
            decoding="async"
            className="mb-4 w-full rounded-lg object-cover"
            style={{ maxHeight: "300px" }}
          />
        </button>
      )}
      {(richContent.title || title) && (
        <h2 className="mb-1 text-xl font-bold">{richContent.title || title}</h2>
      )}
      {richContent.subtitle && <p className="text-muted-foreground mb-3">{richContent.subtitle}</p>}
      {richContent.author && (
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
          {richContent.author.avatar && (
            <img
              src={richContent.author.avatar}
              alt={`${richContent.author.name}'s avatar`}
              loading="lazy"
              decoding="async"
              className="h-6 w-6 rounded-full"
            />
          )}
          <span>{richContent.author.name}</span>
          {richContent.readingTime && <span>· {richContent.readingTime} min read</span>}
        </div>
      )}
      <div className="space-y-3">
        {richContent.blocks.map((block) => {
          switch (block.type) {
            case "heading":
              return (
                <h3 key={block.id} className="mt-4 text-lg font-semibold">
                  {block.content}
                </h3>
              );
            case "paragraph":
              return (
                <p key={block.id} className="text-sm leading-relaxed">
                  {block.content}
                </p>
              );
            case "image": {
              imageBlockCounter++;
              const idx = imageBlockCounter;
              return (
                <figure key={block.id} className="my-2">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="w-full cursor-zoom-in"
                  >
                    <img
                      src={block.content}
                      alt={
                        ((block.metadata as Record<string, unknown>)?.caption as string) ||
                        "Content image"
                      }
                      loading="lazy"
                      decoding="async"
                      className="w-full rounded-lg border bg-white object-contain dark:bg-zinc-900"
                    />
                  </button>
                  {(block.metadata as Record<string, unknown>)?.caption && (
                    <figcaption className="text-muted-foreground mt-1 text-center text-xs">
                      {(block.metadata as Record<string, unknown>).caption as string}
                    </figcaption>
                  )}
                </figure>
              );
            }
            case "code":
              return (
                <pre
                  key={block.id}
                  className="overflow-x-auto rounded bg-zinc-900 p-3 text-xs text-zinc-100 dark:bg-zinc-950"
                >
                  <code>{block.content}</code>
                </pre>
              );
            case "quote":
              return (
                <blockquote
                  key={block.id}
                  className="border-border text-muted-foreground border-l-4 pl-4 text-sm italic"
                >
                  {block.content}
                </blockquote>
              );
            case "list": {
              const listItems: string[] =
                ((block.metadata as Record<string, unknown>)?.items as string[]) ??
                (block.content ? block.content.split("\n").filter(Boolean) : []);
              const isOrdered = (block.metadata as Record<string, unknown>)?.listType === "ordered";
              const ListTag = isOrdered ? "ol" : "ul";
              return (
                <ListTag
                  key={block.id}
                  className={`${isOrdered ? "list-decimal" : "list-disc"} space-y-1 pl-6 text-sm`}
                >
                  {listItems.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ListTag>
              );
            }
            case "divider":
              return <hr key={block.id} className="border-gray-200" />;
            default:
              return (
                <p key={block.id} className="text-sm">
                  {block.content}
                </p>
              );
          }
        })}
      </div>
      {richContent.tags && richContent.tags.length > 0 && (
        <div className="mt-4 flex gap-1">
          {richContent.tags.map((tag) => (
            <span key={tag} className="bg-muted rounded-full px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={imageBlocks}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </article>
  );
}
