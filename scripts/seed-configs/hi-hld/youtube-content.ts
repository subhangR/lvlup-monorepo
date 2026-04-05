/**
 * YouTube — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: video upload, adaptive bitrate streaming, video processing DAG, resumable uploads, CDN scaling
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const youtubeContent: StoryPointSeed = {
  title: "YouTube",
  description:
    "Design a video-sharing platform supporting upload and streaming of large videos at scale — covering presigned URL uploads, adaptive bitrate streaming, video processing DAGs, resumable uploads, and CDN-based scaling for 1M uploads/day and 100M views/day.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements & Architecture Overview", orderIndex: 1 },
    { id: "sec_q_uploads", title: "Upload Flow & Resumability", orderIndex: 2 },
    { id: "sec_q_streaming", title: "Video Storage & Adaptive Streaming", orderIndex: 3 },
    { id: "sec_q_processing", title: "Video Processing Pipeline", orderIndex: 4 },
    { id: "sec_q_scaling", title: "Scaling, CDN & Capacity Planning", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Requirements & Core Concepts
    {
      title: "YouTube — Requirements & Video Streaming Fundamentals",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "YouTube — Requirements & Video Streaming Fundamentals",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is YouTube?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "YouTube is a video-sharing platform that allows users to upload, view, and interact with video content. As the second most visited website in the world, it must handle massive scale — approximately 1 million video uploads per day and 100 million video views per day. The system design focuses on the core video upload and streaming mechanics.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: ["Users can upload videos.", "Users can watch (stream) videos."],
              },
            },
            {
              id: "b5",
              type: "paragraph",
              content:
                "Out of scope: view counts, search, comments, recommendations, channels, subscriptions. The question is mostly focused on the video-sharing mechanics. For feature-rich apps, have a brief back-and-forth with the interviewer to clarify focus.",
            },
            {
              id: "b6",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b7",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Highly available (prioritize availability over consistency).",
                  "Support uploading and streaming large videos (10s of GBs).",
                  "Low-latency streaming, even in low-bandwidth environments.",
                  "Scale to ~1M uploads/day and ~100M views/day.",
                  "Support resumable uploads.",
                ],
              },
            },
            {
              id: "b8",
              type: "paragraph",
              content:
                'For this question, given the small number of functional requirements, the non-functional requirements are even more critical. They characterize the complexity of the deceptively simple "upload" and "watch" interactions.',
            },
            {
              id: "b9",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "User: An uploader or viewer of videos.",
                  "Video: The actual video data (frames, audio).",
                  "VideoMetadata: Metadata including uploading user, URL to transcript, processing status, manifest file URLs, chunk tracking for resumable uploads.",
                ],
              },
            },
            {
              id: "b11",
              type: "heading",
              content: "Video Streaming Fundamentals",
              metadata: { level: 2 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "Video Codec: Compresses and decompresses digital video (e.g., H.264, H.265, VP9, AV1). Codecs trade off between compression time, platform support, compression efficiency, and quality. Video Container: A file format that stores video data and metadata (e.g., MP4, WebM). Differs from codec — codec determines compression, container determines storage format.",
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                'Bitrate: The number of bits transmitted per second (kbps/Mbps). Higher resolution and framerate = higher bitrate = more data needed. Manifest Files: Text-based documents describing video streams. A primary manifest lists all available video versions. Media manifests list segment URLs for each version — used by video players as an "index" to stream segments.',
            },
            {
              id: "b14",
              type: "heading",
              content: "API Design",
              metadata: { level: 2 },
            },
            {
              id: "b15",
              type: "code",
              content:
                "// Upload: Get presigned URL for direct S3 upload\nPOST /presigned_url\nRequest: { VideoMetadata }\nResponse: { presignedUrl, videoId }\n\n// Stream: Fetch metadata (contains manifest URL)\nGET /videos/{videoId}\nResponse: { VideoMetadata }  // includes manifest file URL",
              metadata: { language: "typescript" },
            },
            {
              id: "b16",
              type: "paragraph",
              content:
                "Note: The upload API evolves from POST /upload (sending video + metadata together) to POST /presigned_url (sending only metadata, uploading video directly to S3). Communicate proactively that APIs may change as the design deepens.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: High-Level Design — Upload & Streaming
    {
      title: "High-Level Design — Video Upload & Streaming",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "High-Level Design — Video Upload & Streaming",
          blocks: [
            {
              id: "hld1",
              type: "heading",
              content: "Video Upload — Evolving the Design",
              metadata: { level: 2 },
            },
            {
              id: "hld2",
              type: "heading",
              content: "Bad: Store the Raw Video",
              metadata: { level: 3 },
            },
            {
              id: "hld3",
              type: "paragraph",
              content:
                "Storing just the raw uploaded file ignores that different devices need different video formats (codec + container combinations). This naive approach will not work in practice because videos are unplayable on many devices.",
            },
            {
              id: "hld4",
              type: "heading",
              content: "Good: Store Different Video Formats",
              metadata: { level: 3 },
            },
            {
              id: "hld5",
              type: "paragraph",
              content:
                'After upload, S3 fires an event to a video processing service that converts the original into different formats (codec + container combos). Each format is stored as a file in S3, and VideoMetadata is updated with the file URLs. Challenge: Storing entire videos in each format means clients cannot download "part" of a video for streaming.',
            },
            {
              id: "hld6",
              type: "heading",
              content: "Great: Store Different Formats as Segments",
              metadata: { level: 3 },
            },
            {
              id: "hld7",
              type: "paragraph",
              content:
                "The best approach splits videos into small segments (a few seconds each) and converts each segment into multiple formats. This enables efficient streaming (clients download segment-by-segment) and adaptive bitrate streaming (clients switch formats mid-stream based on network conditions). The trade-off is a more complex processing pipeline — a DAG of work rather than a simple conversion.",
            },
            {
              id: "hld8",
              type: "heading",
              content: "Pattern: Handling Large Blobs",
              metadata: { level: 2 },
            },
            {
              id: "hld9",
              type: "paragraph",
              content:
                "Multi-gigabyte video files bypass application servers entirely using presigned URLs for direct S3 uploads, with resumable chunked transfers. The video service generates presigned URLs; the client uploads directly to S3. This avoids bottlenecking application servers with large file transfers. The same pattern applies to photo storage, document sharing, or backup services.",
            },
            {
              id: "hld10",
              type: "heading",
              content: "Video Metadata Storage",
              metadata: { level: 2 },
            },
            {
              id: "hld11",
              type: "paragraph",
              content:
                "At ~1M uploads/day, we accumulate ~365M metadata records/year. We use Cassandra because: it supports horizontal partitioning, offers high availability through leaderless replication, and we only need point lookups by videoId (no complex queries or joins). Cassandra is partitioned by videoId since each video is accessed independently.",
            },
            {
              id: "hld12",
              type: "heading",
              content: "Streaming — Evolving the Design",
              metadata: { level: 2 },
            },
            {
              id: "hld13",
              type: "heading",
              content: "Bad: Download the Entire Video",
              metadata: { level: 3 },
            },
            {
              id: "hld14",
              type: "paragraph",
              content:
                "The client downloads the full video before playback. A 10GB video on 100 Mbps internet takes 13+ minutes to download. If a network disruption occurs during the single HTTP request, all progress is lost. This approach is not viable for a streaming service.",
            },
            {
              id: "hld15",
              type: "heading",
              content: "Good: Download Segments Incrementally",
              metadata: { level: 3 },
            },
            {
              id: "hld16",
              type: "paragraph",
              content:
                "The client selects a video format based on device and preferences, then downloads segments sequentially. The first segment loads quickly (a few seconds of video), enabling fast playback start. Background downloads ensure seamless playback. Challenge: A fixed format does not adapt to fluctuating network conditions — if bandwidth drops, buffering occurs.",
            },
            {
              id: "hld17",
              type: "heading",
              content: "Great: Adaptive Bitrate Streaming",
              metadata: { level: 3 },
            },
            {
              id: "hld18",
              type: "paragraph",
              content:
                "The client fetches VideoMetadata → downloads the manifest file → selects the best format based on current network conditions → downloads the first segment → plays while downloading more. If network conditions change, the client switches to a different format (lower resolution for slow networks, higher for fast). This relies on having segments stored in multiple formats and a manifest file indexing all of them.",
            },
            {
              id: "hld19",
              type: "quote",
              content:
                '"Adaptive bitrate streaming is the gold standard for video delivery — it relies on storing segments in multiple formats, manifest files as indices, and the client being an active participant in format selection based on real-time network conditions."',
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Deep Dives — Processing DAG, Resumable Uploads, Scaling
    {
      title: "Deep Dives — Video Processing, Resumable Uploads & Scaling",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Video Processing, Resumable Uploads & Scaling",
          blocks: [
            {
              id: "dd1",
              type: "heading",
              content: "Deep Dive 1: Video Processing DAG",
              metadata: { level: 2 },
            },
            {
              id: "dd2",
              type: "paragraph",
              content:
                "When a video is uploaded, it must be post-processed into segments in multiple formats with manifest files. This is a directed acyclic graph (DAG) of work:",
            },
            {
              id: "dd3",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Split the original file into segments (e.g., using ffmpeg).",
                  "Transcode each segment into different codec/container combinations. Process audio and generate transcripts in parallel.",
                  "Create manifest files (primary + media manifests) referencing the segments in different formats.",
                  'Mark the upload as "complete" in the metadata DB.',
                ],
              },
            },
            {
              id: "dd4",
              type: "paragraph",
              content:
                "Segment transcoding is the most CPU-intensive step and benefits from extreme parallelism — segments are independent, so they can be processed on different worker nodes simultaneously. An orchestrator like Temporal manages the DAG execution, assigning work to workers at the right time. S3 stores temporary data between pipeline stages, with workers passing URLs rather than files.",
            },
            {
              id: "dd5",
              type: "heading",
              content: "Deep Dive 2: Resumable Uploads",
              metadata: { level: 2 },
            },
            {
              id: "dd6",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "The client divides the video into small chunks (~5-10 MB each), each with a fingerprint hash.",
                  "VideoMetadata stores a chunks field — a list of chunk objects with fingerprint and status (NotUploaded/Uploaded).",
                  "The client POSTs chunk metadata to the backend, initializing all chunks as NotUploaded.",
                  "The client uploads each chunk to S3 via multipart upload.",
                  "When S3 acknowledges a part, it returns the part number and ETag. The client relays this to the backend (PATCH /videos/{id}/chunks), which verifies the fingerprint/ETag via S3 APIs and marks the chunk as Uploaded.",
                  "After CompleteMultipartUpload, S3 emits an ObjectCreated:CompleteMultipartUpload event, kicking off downstream processing.",
                  "If the client stops, it can resume by fetching VideoMetadata to see which chunks are already uploaded and skip them.",
                ],
              },
            },
            {
              id: "dd7",
              type: "paragraph",
              content:
                "In practice, AWS multipart upload handles the mechanics. However, understanding the details — chunk tracking, fingerprint verification, and resume logic — demonstrates depth in interviews.",
            },
            {
              id: "dd8",
              type: "heading",
              content: "Chunks vs Segments",
              metadata: { level: 3 },
            },
            {
              id: "dd9",
              type: "paragraph",
              content:
                "Chunks and segments sound similar but serve completely different purposes. A chunk is raw binary data for upload purposes (e.g., 5MB piece of a 10GB file), useful for resumable uploading and throughput. A segment is a playable piece of video (e.g., 5 seconds), useful for adaptive bitrate streaming. S3 internally stitches chunks into the complete file after multipart upload completes.",
            },
            {
              id: "dd10",
              type: "heading",
              content: "Deep Dive 3: Scaling to 1M Uploads / 100M Views Per Day",
              metadata: { level: 2 },
            },
            {
              id: "dd11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Video Service: Stateless, horizontally scaled behind a load balancer. Handles presigned URL generation and metadata queries.",
                  "Video Metadata (Cassandra): Scales via leaderless replication and consistent hashing. Partitioned by videoId for uniform distribution. Hot videos can cause hotspots — mitigated by tuning replication factor and adding a cache layer.",
                  "Video Processing Service: Internal queuing handles upload bursts. Queue depth triggers elastic scaling of worker nodes. DAG parallelism ensures efficient transcoding.",
                  "S3: Scales elastically within a region (automatic cross-AZ replication). However, users far from the data center experience slow streaming.",
                ],
              },
            },
            {
              id: "dd12",
              type: "heading",
              content: "Caching for Hot Videos",
              metadata: { level: 3 },
            },
            {
              id: "dd13",
              type: "paragraph",
              content:
                "A distributed LRU cache (e.g., Redis) sits in front of Cassandra, storing frequently accessed VideoMetadata. This insulates the DB from read traffic on popular videos and provides faster lookups. The cache is partitioned by videoId.",
            },
            {
              id: "dd14",
              type: "heading",
              content: "CDN for Global Streaming",
              metadata: { level: 3 },
            },
            {
              id: "dd15",
              type: "paragraph",
              content:
                'CDNs cache popular video segments and manifest files on edge servers geographically close to users. This dramatically reduces latency and buffering. Once the manifest and segments are cached in the CDN, the client never needs to interact with the backend to continue streaming. This is the "Scaling Reads" pattern — for a 100:1 read-to-write ratio, aggressive caching and CDN distribution are essential.',
            },
            {
              id: "dd16",
              type: "heading",
              content: "Additional Deep Dives",
              metadata: { level: 2 },
            },
            {
              id: "dd17",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Pipelining uploads: Client segments the video and uploads segments directly, enabling the backend to start processing before the full upload completes. Trades upload speed for complexity and potential garbage segments.",
                  "Resume streaming: Store per-user progress (user + videoId + timestamp) to allow resuming where the user left off.",
                  "View counts: Exact counts (strong consistency) vs estimated counts (eventual consistency with counter-based approaches).",
                ],
              },
            },
            {
              id: "dd18",
              type: "heading",
              content: "Interview Level Expectations",
              metadata: { level: 2 },
            },
            {
              id: "dd19",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mid-level: Clearly define API and data model. Land on functional HLD with multipart upload and segment-based streaming. Understand direct S3 interface. Drive one deep dive.",
                  "Senior: Speed through HLD. Discuss multipart upload details for resumable uploads. Know video post-processing mechanics for adaptive bitrate streaming. Articulate tradeoffs clearly.",
                  "Staff+: Deep tradeoff analysis drawing from real experience. Breeze through basics (REST, normalization). Proactively identify problems. Spend 60% of time on deep dives. Treat interviewer as a peer.",
                ],
              },
            },
          ],
          readingTime: 14,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════════════

    // --- MCQ (8 questions) ---

    // MCQ 1 — easy
    {
      title: "Why use presigned URLs for video upload?",
      type: "question",
      sectionId: "sec_q_uploads",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In a YouTube-like system, why does the video service generate presigned URLs instead of accepting video data directly through its API?",
        explanation:
          'Multi-gigabyte video files would bottleneck application servers — consuming bandwidth, memory, and CPU. Presigned URLs allow clients to upload directly to S3, bypassing the application server entirely. The server only handles lightweight metadata. This is the "Handling Large Blobs" pattern.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "To bypass application servers and upload large files directly to object storage without bottlenecking the video service",
              isCorrect: true,
            },
            {
              id: "b",
              text: "To allow the client to choose which S3 region to upload to",
              isCorrect: false,
            },
            {
              id: "c",
              text: "To encrypt the video during upload for security purposes",
              isCorrect: false,
            },
            {
              id: "d",
              text: "To avoid needing authentication on the video service",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why segment videos instead of storing whole files?",
      type: "question",
      sectionId: "sec_q_streaming",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'Why does the "great" solution for video storage involve splitting videos into small segments rather than storing each format as a single file?',
        explanation:
          "Segments enable incremental streaming — clients download a few seconds at a time instead of waiting for the entire video. More importantly, segments enable adaptive bitrate streaming: the client can switch between formats (higher/lower quality) mid-stream based on network conditions. Without segments, format switching would require re-downloading the entire video.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "S3 cannot store files larger than 1 GB",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Segments reduce the total storage cost compared to whole files",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Segments are required by all video codecs for proper encoding",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Segments enable incremental streaming and allow clients to switch video quality mid-stream based on network conditions",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Cassandra for video metadata",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is Cassandra a good choice for storing video metadata at YouTube scale (~365M records/year)?",
        explanation:
          "Cassandra provides high availability through leaderless replication, supports horizontal partitioning (sharding), and handles point lookups efficiently. Since video metadata only requires point queries by videoId (no joins or complex queries), Cassandra's strengths align perfectly. It can be partitioned by videoId for uniform data distribution.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It offers high availability via leaderless replication and efficient horizontal partitioning by videoId for point lookups",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It supports complex JOIN operations needed for video recommendation queries",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It provides strong ACID transactions needed for upload consistency",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It natively supports video file storage alongside metadata",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Adaptive bitrate streaming flow",
      type: "question",
      sectionId: "sec_q_streaming",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "What is the correct sequence of operations when a client begins adaptive bitrate streaming of a video?",
        explanation:
          "The client first fetches VideoMetadata (which contains the manifest URL), then downloads the manifest file from S3/CDN. The manifest lists all available formats and segment URLs. The client selects a format based on current network conditions, downloads the first segment, and begins playback while prefetching subsequent segments. If network conditions change, the client switches formats seamlessly.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Request video from API server → Server streams segments directly → Client plays them in order",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Fetch VideoMetadata → Download manifest file → Select format based on network → Download first segment → Play and prefetch more segments",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Download manifest → Fetch VideoMetadata → Download entire video in selected format → Begin playback",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Fetch VideoMetadata → Download all segments → Select best quality → Begin playback",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Video processing pipeline as a DAG",
      type: "question",
      sectionId: "sec_q_processing",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Why is the video post-processing pipeline modeled as a directed acyclic graph (DAG) rather than a simple sequential pipeline?",
        explanation:
          "After splitting into segments, each segment can be independently transcoded into multiple formats, have its audio processed, and contribute to transcript generation — all in parallel. This fan-out/fan-in pattern with one-way dependencies (splitting must happen before transcoding) makes it a DAG, not a linear sequence. A simple queue would serialize work unnecessarily, losing the massive parallelism benefit.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Segments can be transcoded, audio-processed, and transcribed in parallel with fan-out/fan-in dependencies that form a graph, not a sequence",
              isCorrect: true,
            },
            {
              id: "b",
              text: "DAGs are required by video codec standards for proper transcoding order",
              isCorrect: false,
            },
            {
              id: "c",
              text: "DAGs guarantee that video processing will never fail or need retrying",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A DAG ensures that all video formats are created in alphabetical order",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Chunk vs segment distinction",
      type: "question",
      sectionId: "sec_q_uploads",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'A candidate uses "chunk" and "segment" interchangeably when designing YouTube. What is the critical distinction between these concepts?',
        explanation:
          "Chunks are raw binary data pieces for upload purposes (e.g., 5MB of a 10GB file) — they optimize upload throughput and enable resumability. Segments are playable video units (e.g., 5 seconds of video) — they enable streaming and adaptive bitrate switching. S3 stitches chunks into one complete file after multipart upload, while segments are created by the processing pipeline from that complete file.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "They are synonymous — the distinction is just a naming convention",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Chunks are created by the server; segments are created by the client",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Chunks are larger than segments but otherwise serve the same purpose",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Chunks are raw binary data for upload resumability; segments are playable video units for streaming — they serve completely different purposes",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "CDN cache invalidation for video streaming",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In the final YouTube design, once a video's manifest file and segments are cached in the CDN, the client never needs to contact the backend for continued streaming. What is the most significant architectural implication of this?",
        explanation:
          "When all streaming data (manifest + segments) is CDN-cached, the backend is completely decoupled from the streaming hot path. This means backend failures, deployments, or maintenance do not affect users currently watching videos. It also means the read path scales almost infinitely through CDN edge servers, while the backend only handles the write path (uploads, metadata) and initial manifest lookups before CDN caching kicks in.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The backend is completely decoupled from the streaming hot path — backend failures do not affect users currently watching videos",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Video metadata can be deleted from Cassandra once the CDN caches the manifest",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The video processing pipeline can be shut down after initial processing since the CDN handles format conversion",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The CDN eliminates the need for S3 entirely since all data lives on edge servers",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Why not pipeline uploads with processing?",
      type: "question",
      sectionId: "sec_q_uploads",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'The YouTube design uploads the complete video to S3 before starting the processing pipeline. An optimization would be to "pipeline" — the client uploads segments and the backend starts processing immediately. What is the strongest argument for NOT adopting this optimization by default?',
        explanation:
          'If the client abandons the upload midway, the backend has already processed partial segments — creating "garbage" data in S3 and partial entries in the metadata DB. This requires cleanup logic, orphan detection, and handling of partially-processed videos that will never be completed. The simpler approach (complete upload → process) provides a clean boundary: either the video is fully uploaded and will be processed, or it is not.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Abandoned uploads create garbage segments and partial metadata that require complex cleanup logic — the complete-then-process approach gives a clean atomicity boundary",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Video codecs require the full file to be present before any transcoding can begin",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The network savings from pipelining are negligible compared to the total upload time",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Pipelining is technically impossible because S3 multipart upload prevents reading data before completion",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Non-functional requirements for YouTube",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL valid non-functional requirements for a YouTube-like video platform:",
        explanation:
          "High availability, large video support (10s of GBs), low-latency streaming, and resumable uploads are all core NFRs. Strong consistency is not required — YouTube prioritizes availability (AP in CAP). Content moderation is explicitly out of scope for this design.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Strong consistency across all video metadata reads",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Support for uploading and streaming videos in the tens of GBs",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Low-latency streaming even in low-bandwidth environments",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Resumable uploads for large videos",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Real-time content moderation before video becomes available",
              isCorrect: false,
            },
            {
              id: "f",
              text: "High availability (prioritizing availability over consistency)",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Components that enable adaptive bitrate streaming",
      type: "question",
      sectionId: "sec_q_streaming",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL components/decisions that are prerequisites for adaptive bitrate streaming to work:",
        explanation:
          "Adaptive bitrate streaming requires: (1) video segments stored in multiple formats so the client can switch quality, (2) manifest files indexing all segments and formats so the client knows what's available, and (3) the client monitoring network conditions and selecting appropriate formats. A DAG processing pipeline creates these assets. A single-format storage or full-file download approach would not support adaptive streaming.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Each segment transcoded into multiple codec/container formats",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Manifest files (primary + media) listing all segment URLs per format",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Client-side logic to monitor network conditions and switch formats",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Videos split into small playable segments",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Server-side format selection based on user's device registration",
              isCorrect: false,
            },
            {
              id: "f",
              text: "Real-time transcoding of segments on each client request",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Scaling mechanisms in the final YouTube design",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content: "Select ALL scaling mechanisms used in the final YouTube system design:",
        explanation:
          "The design uses: CDN edge servers for geo-distributed caching of video content, distributed metadata cache (Redis LRU) to insulate Cassandra from hot video reads, Cassandra tuned replication for popular video metadata distribution, and horizontally scaled stateless video service behind a load balancer. Sharding S3 by region and rate limiting uploads are not part of the described architecture.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Sharding S3 buckets by geographic region for upload performance",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Distributed LRU cache in front of Cassandra for hot video metadata",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Cassandra replication tuning to spread hot video metadata across nodes",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Rate limiting video uploads to prevent processing pipeline overload",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Horizontally scaled stateless video service behind a load balancer",
              isCorrect: true,
            },
            {
              id: "f",
              text: "CDN edge servers caching popular video segments and manifest files",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Video processing DAG design decisions",
      type: "question",
      sectionId: "sec_q_processing",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content: "Select ALL true statements about the video processing DAG in the YouTube design:",
        explanation:
          "Segment transcoding is the most CPU-intensive step and benefits from extreme parallelism across worker nodes. Temporal (or similar) orchestrates the DAG, assigning work at the right time. S3 stores intermediate data between stages so workers pass URLs rather than files. The DAG creates both segment files and manifest files as output. Audio processing and transcription happen in parallel with video transcoding, not sequentially after it. The DAG does not process in real-time — it runs after the full upload completes.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The output includes both segment files in multiple formats and manifest files",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Segment transcoding is the most CPU-intensive step and can be parallelized across many worker nodes",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The DAG processes video segments in real-time as the client uploads each chunk",
              isCorrect: false,
            },
            {
              id: "d",
              text: "S3 stores intermediate data between pipeline stages — workers pass URLs, not files",
              isCorrect: true,
            },
            {
              id: "e",
              text: "An orchestrator like Temporal manages DAG execution and worker assignment",
              isCorrect: true,
            },
            {
              id: "f",
              text: "Audio processing must complete before video transcoding can begin",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Evolution of video storage approaches",
      type: "question",
      sectionId: "sec_q_streaming",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Walk through the three approaches to storing uploaded videos (raw, multiple formats, segmented formats). For each, explain what it does, why it falls short, and what the next approach fixes.",
        explanation:
          "A strong answer clearly articulates the progression: raw storage (no device compatibility) → multiple formats (no incremental streaming) → segmented formats (enables adaptive bitrate streaming). Each step builds on the previous by addressing its specific limitation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Approach 1 — Store Raw Video: Simply stores the original uploaded file without any post-processing. This fails because different devices require different video formats (codec + container combinations). A file uploaded from an iPhone may not play on an Android device or web browser. We need format diversity.\n\nApproach 2 — Store Different Formats: After upload, a processing service converts the original video into multiple formats and stores each as a separate file in S3. This solves device compatibility but introduces a new problem: storing entire videos per format means clients must download the full video before playback. There is no way to download "part" of a video, which makes streaming impossible.\n\nApproach 3 — Store Segmented Formats: Videos are split into small segments (a few seconds each), and each segment is transcoded into multiple formats. This is strictly better because: (1) clients can start playback after downloading just the first segment, (2) clients can switch formats mid-stream as network conditions change (adaptive bitrate streaming), and (3) failed downloads only lose a small segment, not the entire video. The tradeoff is a more complex processing pipeline — a DAG with splitting, transcoding, audio processing, and manifest file generation.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Resumable upload mechanism",
      type: "question",
      sectionId: "sec_q_uploads",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain how resumable uploads work in the YouTube design. Cover the client-side chunking, server-side tracking, and the resume flow when a client reconnects after a network failure.",
        explanation:
          "A strong answer covers chunk creation with fingerprints, VideoMetadata tracking of chunk status, S3 multipart upload with ETag verification, and the resume flow (fetch metadata → identify missing chunks → upload only missing ones).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "The client divides the video into small chunks (~5-10 MB each) and computes a fingerprint hash for each chunk. It sends chunk metadata to the backend (POST /videos/{id}/chunks), which stores each chunk's fingerprint and status (NotUploaded) in the VideoMetadata record.\n\nThe client uploads chunks to S3 via multipart upload. When S3 acknowledges a part, it returns a part number and ETag. The client relays this to the backend (PATCH /videos/{id}/chunks), which verifies the fingerprint against the ETag using S3 APIs and marks the chunk as Uploaded.\n\nWhen all chunks are uploaded, the client calls CompleteMultipartUpload. S3 internally stitches the chunks into the complete file and emits an ObjectCreated:CompleteMultipartUpload event, triggering the video processing pipeline.\n\nResume flow: If the client disconnects mid-upload, it can reconnect and fetch the VideoMetadata to see which chunks have status Uploaded vs NotUploaded. It skips already-uploaded chunks and only uploads the remaining ones. This avoids re-uploading potentially gigabytes of data after a network interruption.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the video processing DAG in detail",
      type: "question",
      sectionId: "sec_q_processing",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the video post-processing pipeline as a DAG. Specify the input, each stage of processing, what can be parallelized, the output artifacts, and how you would orchestrate this at scale. Explain why a DAG model is superior to a simple message queue for this workload.",
        explanation:
          "A staff-level answer details: input (raw video in S3), stages (split → transcode per segment per format + audio + transcript in parallel → manifest generation → mark complete), orchestration (Temporal), inter-stage data passing (S3 URLs), and why DAG > queue (dependencies, fan-out/fan-in, parallelism tracking).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Input: Raw video file in S3, triggered by ObjectCreated event after multipart upload completes.\n\nDAG Stages:\n1. Split: ffmpeg (or similar) splits the raw video into N segments of a few seconds each. Output: N segment files in S3.\n2. Fan-out processing (parallel per segment):\n   - Video transcoding: Each segment is transcoded into M codec/container formats (e.g., H.264/MP4, VP9/WebM, AV1/MP4). This is the most CPU-intensive step.\n   - Audio extraction: Audio track extracted for each format.\n   - Transcript generation: Speech-to-text on the audio track.\n   All N×M transcoding jobs run in parallel across worker nodes — there are no dependencies between segments.\n3. Fan-in: Once all segments for all formats are complete:\n   - Generate media manifest files (one per format), listing all segment URLs.\n   - Generate primary manifest file listing all media manifests.\n4. Mark complete: Update VideoMetadata with manifest URL and set status to "ready."\n\nOrchestration: Temporal manages the DAG — it knows the dependency graph, assigns work to worker pools, handles retries for failed tasks, and tracks completion. Workers are stateless and pull work from Temporal.\n\nInter-stage data: All intermediate artifacts are stored in S3. Workers pass S3 URLs through Temporal, never transferring files directly between workers.\n\nWhy DAG > Simple Queue: A message queue (SQS, RabbitMQ) processes items independently — it has no concept of "wait for all transcoding jobs for segment 5 to finish before generating manifest." A DAG orchestrator understands dependencies, tracks fan-out/fan-in completion, and knows when downstream stages can start. Without a DAG model, you would need to build ad-hoc coordination logic on top of queues — essentially reinventing an orchestrator poorly.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Scaling reads vs writes in YouTube",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "YouTube has a ~100:1 read-to-write ratio (100M views vs 1M uploads per day). Analyze how the system design addresses this asymmetry. Discuss the scaling strategy for both the read and write paths, and explain why the read path is the more challenging scaling problem.",
        explanation:
          "A staff-level answer identifies that the write path is inherently bounded (1M uploads → S3 + processing) while the read path must handle 100M views with global distribution. The read path is solved by aggressive CDN caching, metadata caching, and Cassandra read replicas. The key insight is that once content is CDN-cached, the read path scales almost infinitely without touching the backend.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Write Path (1M uploads/day):\nThe write path involves presigned URL generation (lightweight), direct S3 upload (handled by AWS), and video processing (CPU-intensive but async). The video service is stateless and horizontally scaled. The processing pipeline uses internal queuing with elastic worker scaling — burst traffic fills the queue, more workers spin up. Write path scaling is relatively straightforward because uploads are independent and the heavy lifting (transcoding) is embarrassingly parallel.\n\nRead Path (100M views/day):\nThe read path is the real scaling challenge. 100M views/day means ~1,157 video starts per second on average, with peaks 10x higher. Each view requires: (1) metadata lookup, (2) manifest download, (3) continuous segment downloads throughout playback.\n\nScaling reads involves multiple layers:\n1. CDN: Edge servers cache popular video segments and manifests globally. Once cached, streaming requires zero backend interaction. This is the single most impactful optimization — it moves the hot path from a centralized backend to a globally distributed edge network.\n2. Metadata cache: A distributed Redis LRU cache stores frequently accessed VideoMetadata, reducing Cassandra load from popular videos.\n3. Cassandra tuning: Increase replication factor for popular video partitions so multiple nodes can serve reads.\n\nWhy reads are harder: The write path is bounded by upload rate (1M/day), but a single uploaded video can generate millions of reads. A viral video creates a massive read amplification problem. The CDN solves this elegantly — the more popular a video, the more likely it is cached at every edge location, making popularity self-correcting from a scaling perspective.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Manifest file architecture",
      type: "question",
      sectionId: "sec_q_streaming",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the two-level manifest file architecture used in adaptive bitrate streaming. What does the primary manifest contain? What do media manifests contain? How does the video player use them to stream efficiently and adapt to network changes?",
        explanation:
          "A complete answer describes the primary manifest (lists all available video versions/formats), media manifests (one per format, lists segment URLs), and the player algorithm (select format → read media manifest → download segments → monitor network → switch format by reading a different media manifest).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Two-Level Manifest Architecture:\n\nPrimary Manifest: A "root" text file that lists all available versions of a video. Each version represents a different format — a combination of codec, container, resolution, and bitrate (e.g., H.264/MP4 at 1080p/5Mbps, VP9/WebM at 720p/2.5Mbps, H.264/MP4 at 360p/800kbps). The primary manifest points to one media manifest per version.\n\nMedia Manifests: Each media manifest represents one specific video format/quality level. It lists the URLs of all segments in sequential order, each segment being a few seconds of playable video. Think of it as an "index" — segment 1 URL, segment 2 URL, etc.\n\nPlayer Algorithm:\n1. The player downloads the primary manifest from the URL stored in VideoMetadata.\n2. It evaluates current network conditions (bandwidth, latency) and device capabilities.\n3. It selects the appropriate media manifest — e.g., high bandwidth → 1080p manifest, low bandwidth → 360p manifest.\n4. It reads the media manifest and downloads segment 1 at the chosen quality.\n5. While playing segment 1, it prefetches segments 2, 3, etc.\n6. Continuously, it monitors download speed. If segment downloads are taking longer (bandwidth dropping), it switches to a lower-quality media manifest for upcoming segments. If bandwidth improves, it switches to higher quality.\n\nThe key insight is that format switching is seamless because each segment is independently playable. The player simply starts reading from a different media manifest mid-stream — no re-downloading, no connection reset. This is why video quality on YouTube visibly changes (gets blurry then sharp) when network conditions fluctuate.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Staff-level interview walkthrough for YouTube",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are in a Staff Engineer system design interview. The interviewer asks you to design YouTube. Walk through how you would structure your 45-minute interview: what do you cover quickly, where do you spend depth, and which 2-3 deep dives would you choose? Justify your choices.",
        explanation:
          "A staff-level answer demonstrates interview meta-strategy: rapid requirements/API/entities, efficient HLD progression through storage approaches and streaming approaches, then 60% of time on deep dives that showcase real-world experience.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Minutes 0-5 — Requirements & Setup:\nQuickly confirm scope (upload + stream, not search/comments/recommendations). Pin down NFRs — these are more important than FRs for this question: large file support, low-latency streaming, resumable uploads, 1M uploads/100M views scale. Define entities (User, Video, VideoMetadata) and initial APIs.\n\nMinutes 5-15 — High-Level Design (breadth, 25%):\nProgress through upload approaches efficiently: \"Raw storage doesn't work because of device compatibility. Multiple formats don't work because we need incremental streaming. The right answer is segmented formats.\" Similarly for streaming: \"Full download is unacceptable. Fixed-format segments are better but don't adapt to network conditions. Adaptive bitrate streaming with manifest files is the gold standard.\" Arrive at the presigned URL → S3 → processing pipeline → Cassandra for metadata → CDN architecture. Don't linger — show I know this and move to depth.\n\nMinutes 15-40 — Deep Dives (depth, 60%):\n\n1. Video Processing DAG (12 min): This is the most technically interesting part. Walk through the split → transcode → manifest pipeline, explain why it's a DAG (dependencies, parallelism), discuss Temporal as orchestrator, and analyze the CPU-bound transcoding bottleneck. I'd draw the fan-out/fan-in pattern. This showcases system architecture experience.\n\n2. Resumable Uploads (8 min): Walk through chunk-based multipart upload with fingerprint tracking. Distinguish chunks from segments explicitly. Discuss the resume flow and verify-then-mark pattern. This shows I've dealt with real-world large file upload challenges.\n\n3. Scaling the Read Path (5 min): Explain the 100:1 read-write asymmetry, CDN as the key enabler, metadata caching, and the insight that once CDN-cached, the backend is fully decoupled from the streaming hot path.\n\nMinutes 40-45 — Additional considerations: Mention the pipelining optimization (start processing during upload) and its tradeoffs. Discuss view count tracking approaches if the interviewer wants to extend scope.",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Name the streaming technique",
      type: "question",
      sectionId: "sec_q_streaming",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What is the name of the streaming technique where the client dynamically switches between different video quality levels based on real-time network conditions?",
        explanation:
          "Adaptive Bitrate Streaming (ABR/ABS) dynamically adjusts video quality based on the viewer's network conditions. Popular implementations include HLS (HTTP Live Streaming) by Apple and DASH (Dynamic Adaptive Streaming over HTTP). The technique relies on having video segments available in multiple bitrates/formats and manifest files indexing them.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Adaptive bitrate streaming",
          acceptableAnswers: [
            "Adaptive bitrate streaming",
            "adaptive bitrate streaming",
            "ABR",
            "ABS",
            "Adaptive streaming",
            "adaptive streaming",
            "Adaptive Bitrate Streaming",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Workflow orchestration technology",
      type: "question",
      sectionId: "sec_q_processing",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What workflow orchestration technology is suggested for managing the video processing DAG — handling task dependencies, worker assignment, and retries?",
        explanation:
          "Temporal is a workflow orchestration platform that manages complex, long-running processes with built-in fault tolerance. It is well-suited for video processing DAGs because it handles task dependencies, retries, timeouts, and worker coordination. Alternatives include Apache Airflow and AWS Step Functions.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Temporal",
          acceptableAnswers: ["Temporal", "temporal", "Temporal.io"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "S3 event for triggering processing",
      type: "question",
      sectionId: "sec_q_uploads",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "After the client completes a multipart upload, S3 emits a specific event notification exactly once per object. What is the name of this S3 event that kicks off downstream video processing?",
        explanation:
          "S3 emits an ObjectCreated:CompleteMultipartUpload event when a multipart upload is finalized. This is a single, reliable trigger for starting the video processing pipeline. It fires exactly once per object, making it a clean integration point for event-driven architectures.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "ObjectCreated:CompleteMultipartUpload",
          acceptableAnswers: [
            "ObjectCreated:CompleteMultipartUpload",
            "objectcreated:completemultipartupload",
            "CompleteMultipartUpload",
            "s3:ObjectCreated:CompleteMultipartUpload",
            "ObjectCreated CompleteMultipartUpload",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Video processing tool",
      type: "question",
      sectionId: "sec_q_processing",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "What widely-used open-source tool is mentioned for splitting videos into segments and performing transcoding operations in the video processing pipeline?",
        explanation:
          "ffmpeg is the industry-standard open-source tool for video and audio processing. It can split videos into segments, transcode between codecs (H.264, VP9, AV1), convert between containers (MP4, WebM), extract audio tracks, and generate manifest files. It is highly optimized and supports GPU-accelerated transcoding.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "ffmpeg",
          acceptableAnswers: ["ffmpeg", "FFmpeg", "FFMPEG", "ff-mpeg"],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match component to role in YouTube architecture",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each component to its role in the YouTube system design:",
        explanation:
          "S3 stores the actual video data (segments, manifests, raw uploads). Cassandra stores video metadata (title, uploader, URLs, chunk status) with horizontal scaling. CDN caches popular content at edge locations for low-latency global delivery. Temporal orchestrates the multi-stage video processing DAG with dependency management.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "S3",
              right: "Blob storage for video files, segments, and manifests",
            },
            {
              id: "p2",
              left: "Cassandra",
              right: "Horizontally-partitioned video metadata storage",
            },
            { id: "p3", left: "CDN", right: "Edge caching for low-latency global video delivery" },
            {
              id: "p4",
              left: "Temporal",
              right: "DAG orchestration for video processing pipeline",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match video concept to its purpose",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each video streaming concept to its purpose:",
        explanation:
          "Codec determines how video is compressed/decompressed (e.g., H.264). Container is the file format for storage (e.g., MP4). Manifest files serve as an index for the player to find segments. Bitrate determines the data transmission rate, directly affecting quality and bandwidth requirements.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Video Codec (e.g., H.264, VP9)",
              right: "Compresses/decompresses video for efficient storage and transmission",
            },
            {
              id: "p2",
              left: "Video Container (e.g., MP4, WebM)",
              right: "File format that packages video data, audio, and metadata together",
            },
            {
              id: "p3",
              left: "Manifest File",
              right: "Index document listing segment URLs for the video player",
            },
            {
              id: "p4",
              left: "Bitrate",
              right: "Data transmission rate (kbps/Mbps) determining quality and bandwidth needs",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match scaling problem to solution in YouTube",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each scaling challenge in YouTube to its primary solution:",
        explanation:
          "Hot video metadata in Cassandra is solved by a distributed cache (Redis LRU) that absorbs read traffic. Global streaming latency is solved by CDN edge servers geographically close to users. Processing pipeline bursts are solved by internal queuing with elastic worker scaling. Large file upload bottlenecking servers is solved by presigned URLs for direct S3 upload.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Hot video metadata overwhelming Cassandra",
              right: "Distributed LRU cache (Redis) absorbing read traffic",
            },
            {
              id: "p2",
              left: "Users far from data center experiencing buffering",
              right: "CDN edge servers caching segments close to viewers",
            },
            {
              id: "p3",
              left: "Burst of video uploads overwhelming processing",
              right: "Internal queue with elastic worker scaling based on queue depth",
            },
            {
              id: "p4",
              left: "Large video files bottlenecking application servers",
              right: "Presigned URLs for direct client-to-S3 upload",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "Upload pattern name",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          'YouTube uses the "Handling Large _____" pattern where multi-gigabyte files bypass application servers and are uploaded directly to object storage via presigned URLs.',
        explanation:
          'The "Handling Large Blobs" pattern is used whenever multi-gigabyte files (videos, backups, large documents) need to be uploaded. The application server generates a presigned URL, and the client uploads directly to S3/GCS, avoiding bottlenecking the server with large file transfers.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            'YouTube uses the "Handling Large {{blank1}}" pattern where multi-gigabyte files bypass application servers and are uploaded directly to object storage via presigned URLs.',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Blobs",
              acceptableAnswers: ["Blobs", "blobs", "BLOBS", "Blob", "blob"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Read scaling pattern",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          'With a 100:1 view-to-upload ratio, YouTube is a textbook "Scaling _____" problem where CDN caching, metadata caching, and read replicas are essential.',
        explanation:
          'YouTube is a "Scaling Reads" problem. The read-to-write ratio is extreme — viral videos are watched millions of times but uploaded only once. The entire read-path architecture (CDN, metadata cache, Cassandra replication) exists to handle this asymmetry.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            'With a 100:1 view-to-upload ratio, YouTube is a textbook "Scaling {{blank1}}" problem where CDN caching, metadata caching, and read replicas are essential.',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Reads",
              acceptableAnswers: ["Reads", "reads", "Read", "read"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Processing pipeline model",
      type: "question",
      sectionId: "sec_q_processing",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "The video processing pipeline is modeled as a directed _____ graph (DAG) because segments can be processed in parallel with fan-out/fan-in dependencies but no circular dependencies.",
        explanation:
          "A directed acyclic graph has edges with direction (dependencies flow one way) and no cycles (no circular dependencies). Video processing is a DAG because: splitting must happen before transcoding (directed), transcoding fans out to parallel workers then fans in for manifest generation (directed), and no step depends on a later step (acyclic).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "The video processing pipeline is modeled as a directed {{blank1}} graph (DAG) because segments can be processed in parallel with fan-out/fan-in dependencies but no circular dependencies.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "acyclic",
              acceptableAnswers: ["acyclic", "Acyclic", "ACYCLIC"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // --- Numerical (2 questions) ---

    // Numerical 1 — medium
    {
      title: "Download time estimation",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "A 10 GB video needs to be downloaded on a 100 Mbps internet connection. How many minutes would a full download take? (Round to the nearest whole number. Note: 1 byte = 8 bits)",
        explanation:
          "10 GB = 10 × 8 = 80 Gigabits. At 100 Mbps = 0.1 Gbps, download time = 80 / 0.1 = 800 seconds = 13.3 minutes ≈ 13 minutes. This demonstrates why full-file download before playback is unacceptable for a streaming service — users would wait over 13 minutes before seeing any video.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 13,
          tolerance: 2,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Annual video metadata records estimation",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "YouTube receives approximately 1 million video uploads per day. How many video metadata records will accumulate in Cassandra over one year? (Answer in millions)",
        explanation:
          "1,000,000 uploads/day × 365 days = 365,000,000 = 365 million records per year. This scale justifies using a horizontally-partitioned database like Cassandra rather than a single-node relational database. At ~1KB per metadata record, this is ~365 GB of metadata — easily manageable for a distributed database but significant for a single node.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 365,
          tolerance: 10,
        },
      },
    },
  ],
};
