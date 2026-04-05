import { StoryPointSeed, ItemSeed } from "../subhang-content";

// ── Dropbox (Cloud File Storage) — HLD Story Point ──

export const dropboxContent: StoryPointSeed = {
  title: "Dropbox — Cloud File Storage System Design",
  description:
    "Design a cloud-based file storage service like Dropbox that supports uploading, downloading, sharing, and syncing files across devices. Covers presigned URLs, chunked uploads, CDN distribution, and real-time sync.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_architecture", title: "Requirements & Core Architecture", orderIndex: 1 },
    { id: "sec_q_uploads", title: "Upload Design & Presigned URLs", orderIndex: 2 },
    { id: "sec_q_chunking", title: "Chunked Uploads & Resumability", orderIndex: 3 },
    { id: "sec_q_sync", title: "Sync & Delta Optimization", orderIndex: 4 },
    { id: "sec_q_security", title: "Security, Performance & Tradeoffs", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIAL 1: Problem Understanding & High-Level Design
    // ═══════════════════════════════════════════════════════
    {
      title: "Dropbox — Problem Understanding & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Dropbox — Problem Understanding & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Dropbox?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Dropbox is a cloud-based file storage service that allows users to store and share files. It provides a secure and reliable way to store and access files from anywhere, on any device.",
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
                items: [
                  "Users should be able to upload a file from any device",
                  "Users should be able to download a file from any device",
                  "Users should be able to share a file with other users and view files shared with them",
                  "Users can automatically sync files across devices",
                ],
              },
            },
            {
              id: "b5",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Highly available (prioritizing availability over consistency)",
                  "Support files as large as 50GB",
                  "Secure and reliable — able to recover files if lost or corrupted",
                  "Upload, download, and sync should be as fast as possible (low latency)",
                ],
              },
            },
            {
              id: "b7",
              type: "quote",
              content:
                "Dropbox prioritizes availability over consistency. A file uploaded in Germany not being visible in the US for a few seconds is acceptable — unlike a stock trading system where every read must reflect the most recent write.",
            },
            {
              id: "b8",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 2 },
            },
            {
              id: "b9",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "File — the raw data (bytes) users upload, download, and share",
                  "FileMetadata — name, size, MIME type, uploadedBy, status, chunks info",
                  "User — the user of the system",
                ],
              },
            },
            {
              id: "b10",
              type: "heading",
              content: "API Design",
              metadata: { level: 2 },
            },
            {
              id: "b11",
              type: "code",
              content: `// Upload: Request a presigned URL, then upload directly to S3
POST /files/presigned-url  →  PresignedUrl
  Body: { FileMetadata }

// Download: Get presigned/CDN-signed URL
GET /files/{fileId}/presigned-url  →  PresignedUrl

// Share a file
POST /files/{fileId}/share
  Body: { users: User[] }

// Sync: Fetch changes since last sync
GET /files/changes?since={timestamp}  →  ChangeEvent[]`,
              metadata: { language: "text" },
            },
            {
              id: "b12",
              type: "heading",
              content: "Upload Design Evolution",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "Bad: Upload file to a single backend server — does not scale, single point of failure. Good: Store file in Blob Storage (S3) via the backend — scales but uploads the file twice. Great: Upload directly to S3 using presigned URLs — the backend only generates the URL and stores metadata. The client uploads directly to S3, eliminating double transfer.",
            },
            {
              id: "b14",
              type: "heading",
              content: "Download Design Evolution",
              metadata: { level: 2 },
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "Bad: Download through backend server — double download, slow and expensive. Good: Download from S3 using presigned URLs — eliminates double transfer. Great: Use a CDN (e.g., CloudFront) to cache files at edge locations — reduces latency for geographically distributed users. The file service generates CDN-signed URLs instead of direct S3 presigned URLs.",
            },
            {
              id: "b16",
              type: "heading",
              content: "Sharing Design Evolution",
              metadata: { level: 2 },
            },
            {
              id: "b17",
              type: "paragraph",
              content:
                "Bad: Sharelist embedded in file metadata — scanning every file to find shares-with-me is O(n). Good: Cache an inverse mapping (userId → fileIds) for fast lookup, but must keep in sync. Great: Fully normalized separate SharedFiles table with (userId as partition key, fileId as sort key) — clean, no sync issues, slightly less efficient than cache but simpler to maintain.",
            },
            {
              id: "b18",
              type: "heading",
              content: "Sync Architecture",
              metadata: { level: 2 },
            },
            {
              id: "b19",
              type: "paragraph",
              content:
                'Local → Remote: A client-side sync agent monitors the local Dropbox folder using OS-level file system events (FSEvents on macOS, FileSystemWatcher on Windows). Changes are queued and uploaded via the upload API. Conflicts use "last write wins." Remote → Local: Hybrid approach — a single WebSocket/SSE connection per device pushes real-time change notifications, with periodic polling (GET /files/changes?since=timestamp) as a safety net for missed messages.',
            },
            {
              id: "b20",
              type: "heading",
              content: "System Components",
              metadata: { level: 3 },
            },
            {
              id: "b21",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "LB & API Gateway — routing, SSL termination, rate limiting, request validation",
                  "File Service — reads/writes metadata, generates presigned URLs (local crypto operation, no S3 call)",
                  "File Metadata DB (DynamoDB or PostgreSQL) — stores file metadata and SharedFiles table",
                  "S3 (Blob Storage) — actual file storage, presigned URL uploads/downloads",
                  "CDN (CloudFront) — caches files at edge locations for fast downloads",
                ],
              },
            },
          ],
          readingTime: 12,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // MATERIAL 2: Deep Dives — Large Files, Performance, Security
    // ═══════════════════════════════════════════════════════
    {
      title: "Dropbox — Deep Dives: Large Files, Performance & Security",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Dropbox — Deep Dives: Large Files, Performance & Security",
          blocks: [
            {
              id: "dd1",
              type: "heading",
              content: "Deep Dive 1: Supporting Large Files (up to 50GB)",
              metadata: { level: 2 },
            },
            {
              id: "dd2",
              type: "paragraph",
              content:
                "A single POST request for a 50GB file is impractical: web servers time out, most services (e.g., API Gateway has a 10MB hard limit) reject large payloads, network interruptions force full restarts, and users have no progress feedback. The solution is chunked/multipart upload.",
            },
            {
              id: "dd3",
              type: "heading",
              content: "Chunked Upload Flow",
              metadata: { level: 3 },
            },
            {
              id: "dd4",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Client chunks the file into 5-10MB pieces and calculates a fingerprint (SHA-256 hash) for each chunk and the entire file",
                  "Client checks if a file with the same fingerprint exists (for deduplication/resumability)",
                  'If new: POST to initiate multipart upload → backend calls S3 CreateMultipartUpload, gets uploadId, generates presigned URLs for each part, saves metadata with status "uploading"',
                  "Client uploads each chunk to S3 using its presigned URL. After each chunk, sends PATCH to backend with chunk status and ETag",
                  "Backend verifies ETags using S3 ListParts API (trust but verify), updates chunk status",
                  'Once all chunks are "uploaded", backend calls S3 CompleteMultipartUpload to assemble the object, then marks file as "uploaded"',
                ],
              },
            },
            {
              id: "dd5",
              type: "heading",
              content: "Resumable Uploads",
              metadata: { level: 3 },
            },
            {
              id: "dd6",
              type: "paragraph",
              content:
                "The FileMetadata schema includes a chunks array tracking each chunk's id and status (uploaded, uploading, not-uploaded). On resume, the client checks which chunks are already uploaded and only uploads the remaining ones. File identification uses content-based fingerprinting (SHA-256), not filenames, since different users may upload files with the same name.",
            },
            {
              id: "dd7",
              type: "code",
              content: `{
  "id": "123",
  "name": "large-video.mp4",
  "size": 5000000000,
  "mimeType": "video/mp4",
  "uploadedBy": "user1",
  "status": "uploading",
  "fingerprint": "sha256:abc123...",
  "chunks": [
    { "id": "chunk1", "status": "uploaded", "etag": "\"abc\"" },
    { "id": "chunk2", "status": "uploading" },
    { "id": "chunk3", "status": "not-uploaded" }
  ]
}`,
              metadata: { language: "json" },
            },
            {
              id: "dd8",
              type: "heading",
              content: "Deep Dive 2: Performance Optimization",
              metadata: { level: 2 },
            },
            {
              id: "dd9",
              type: "heading",
              content: "Content-Defined Chunking (CDC)",
              metadata: { level: 3 },
            },
            {
              id: "dd10",
              type: "paragraph",
              content:
                "Fixed-size chunks cause problems: inserting a single byte near the beginning shifts all chunk boundaries, making every subsequent chunk different. Content-Defined Chunking (CDC) uses a rolling hash (like Rabin fingerprinting) to determine chunk boundaries based on file content. A small edit only affects chunks surrounding the change — the vast majority remain identical. This is how Dropbox achieves efficient delta sync.",
            },
            {
              id: "dd11",
              type: "heading",
              content: "Compression",
              metadata: { level: 3 },
            },
            {
              id: "dd12",
              type: "paragraph",
              content:
                "Client-side compression before upload reduces transfer size. Smart compression: only apply when speed gains from fewer bytes outweigh compression/decompression time. Text files compress well (5GB → ~1GB); media files (PNG, MP4) barely compress at all. Algorithms: Gzip (broadest support), Brotli (better ratio for text), Zstandard (best speed/ratio balance — ideal for client-side). Important: always compress before encrypting, since encryption introduces randomness that defeats compression.",
            },
            {
              id: "dd13",
              type: "heading",
              content: "Parallel Chunk Uploads",
              metadata: { level: 3 },
            },
            {
              id: "dd14",
              type: "paragraph",
              content:
                "While bandwidth is fixed, sending multiple chunks in parallel maximizes utilization of available bandwidth. Adaptive chunk sizes based on network conditions further optimize throughput. For sync, only changed chunks need to be transferred, not the entire file.",
            },
            {
              id: "dd15",
              type: "heading",
              content: "Deep Dive 3: File Security",
              metadata: { level: 2 },
            },
            {
              id: "dd16",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Encryption in Transit — HTTPS for all client-server communication",
                  "Encryption at Rest — S3 server-side encryption with separate key storage",
                  "Access Control — SharedFiles table enforces ACL; only authorized users receive download URLs",
                  "Signed URLs — time-limited (e.g., 5 min) bearer tokens for downloads. Limit exposure of shared links. Can add IP binding or auth cookies for higher security",
                  "CDN Signed URLs — CloudFront validates signatures using registered public keys, checks expiration and restrictions before serving content",
                ],
              },
            },
            {
              id: "dd17",
              type: "heading",
              content: "Downloads and Range Requests",
              metadata: { level: 3 },
            },
            {
              id: "dd18",
              type: "paragraph",
              content:
                "After S3 CompleteMultipartUpload assembles all parts into a single object, downloads work normally — the client gets a single presigned/CDN-signed URL. For very large files, S3 and HTTP natively support Range requests, letting clients download byte ranges in parallel or resume interrupted downloads without knowing original chunk boundaries.",
            },
          ],
          readingTime: 15,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // MATERIAL 3: Interview Expectations & Tradeoff Summary
    // ═══════════════════════════════════════════════════════
    {
      title: "Dropbox — Interview Expectations by Level",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Dropbox — Interview Expectations by Level",
          blocks: [
            {
              id: "ie1",
              type: "heading",
              content: "What Interviewers Expect at Each Level",
              metadata: { level: 2 },
            },
            {
              id: "ie2",
              type: "heading",
              content: "Mid-Level (E4)",
              metadata: { level: 3 },
            },
            {
              id: "ie3",
              type: "paragraph",
              content:
                '80% breadth, 20% depth. Clearly define API endpoints and data model. Land on a functional high-level design covering upload, download, and sharing. Not expected to know presigned URLs or chunking upfront, but should reason through problems like "you\'re uploading the file twice — how to avoid that?" when probed.',
            },
            {
              id: "ie4",
              type: "heading",
              content: "Senior (E5)",
              metadata: { level: 3 },
            },
            {
              id: "ie5",
              type: "paragraph",
              content:
                "60% breadth, 40% depth. Quickly move through the initial high-level design to spend time on large file uploads in detail. Proactively think through several options. Many will have experience with multipart upload APIs and can speak about chunking, presigned URLs, and CDN tradeoffs from hands-on experience.",
            },
            {
              id: "ie6",
              type: "heading",
              content: "Staff+ (E6)",
              metadata: { level: 3 },
            },
            {
              id: "ie7",
              type: "paragraph",
              content:
                "40% breadth, 60% depth. Breeze through basics (REST API, data normalization) to dive into interesting areas. Demonstrate practical technology application backed by real-world experience. High proactivity — identify and solve issues independently. Treat the interviewer as a peer, articulate tradeoffs clearly, and possibly steer the conversation toward particularly interesting aspects.",
            },
            {
              id: "ie8",
              type: "heading",
              content: "Key Tradeoff Summary",
              metadata: { level: 2 },
            },
            {
              id: "ie9",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Availability vs Consistency: Dropbox favors AP — eventual consistency is acceptable for file storage",
                  "Direct S3 upload vs Backend proxy: Presigned URLs eliminate double transfer at cost of more complex client logic",
                  "CDN vs Direct S3 download: CDN reduces latency for distributed users but adds cost — cache strategically",
                  "Embedded sharelist vs Normalized table: Normalized SharedFiles table trades slightly slower writes for cleaner queries and no sync issues",
                  "Fixed-size vs Content-defined chunking: CDC with rolling hash enables efficient delta sync — critical for real-world performance",
                  'Client-reported vs Server-verified chunk status: "Trust but verify" — accept client updates for UX, periodically verify with S3 ListParts',
                  "Polling vs WebSocket for sync: Hybrid approach — WebSocket for real-time, polling as safety net",
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS — 30 total
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — Easy
    {
      title: "Best approach for file upload to blob storage",
      type: "question",
      sectionId: "sec_q_uploads",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In a Dropbox-like system, what is the most efficient way for a client to upload a file to blob storage (S3)?",
        explanation:
          "Using presigned URLs, the client uploads directly to S3, bypassing the application server entirely. This eliminates the double-transfer problem (client → server → S3) and reduces load on the backend. The server only generates the signed URL — a local cryptographic operation — and stores metadata.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Upload to a message queue, which asynchronously writes to S3",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Upload to the backend server, which then forwards to S3",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Upload directly to S3 using a presigned URL generated by the backend",
              isCorrect: true,
            },
            { id: "d", text: "Upload to the CDN, which replicates to S3", isCorrect: false },
          ],
        },
      },
    },

    // MCQ 2 — Easy
    {
      title: "Why Dropbox favors availability over consistency",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why does a file storage system like Dropbox prioritize availability over consistency in the CAP theorem tradeoff?",
        explanation:
          "Unlike financial systems where every read must reflect the most recent write, a file storage system can tolerate a brief delay before a newly uploaded file is visible to all users. A few seconds of stale data is acceptable, but the system being unavailable is not. This makes AP (Availability + Partition tolerance) the right choice.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Because consistency is impossible in distributed systems",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Because files are immutable and never change once uploaded",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Because a few seconds of stale data is acceptable, but downtime is not",
              isCorrect: true,
            },
            { id: "d", text: "Because all file operations are idempotent", isCorrect: false },
          ],
        },
      },
    },

    // MCQ 3 — Easy
    {
      title: "Role of the File Service in Dropbox architecture",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "In the Dropbox architecture, what is the primary role of the File Service?",
        explanation:
          "The File Service is the control plane — it reads/writes file metadata in the database and generates presigned URLs using the S3 SDK. Generating a presigned URL is a purely local cryptographic operation using AWS credentials; no call to S3 is made. The File Service never handles actual file data — clients upload/download directly to/from S3.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Compresses and encrypts files before storing them",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Manages file metadata and generates presigned URLs for direct S3 access",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Receives file uploads from clients and forwards them to S3",
              isCorrect: false,
            },
            { id: "d", text: "Serves as a CDN edge node for file downloads", isCorrect: false },
          ],
        },
      },
    },

    // MCQ 4 — Medium
    {
      title: "Why chunking must happen on the client",
      type: "question",
      sectionId: "sec_q_chunking",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When implementing chunked uploads for large files, why must the file be chunked on the client side rather than the server side?",
        explanation:
          "If you chunk on the server, the entire file must first be uploaded to the server as a single payload — defeating the purpose of chunking. Chunking solves: (1) payload size limits (API Gateway has a 10MB hard limit), (2) timeout issues, (3) network interruption recovery, and (4) progress tracking. All of these require breaking the file into pieces before it leaves the client.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Chunking on the server still requires uploading the entire file first, defeating the purpose",
              isCorrect: true,
            },
            { id: "b", text: "S3 only accepts uploads from client IP addresses", isCorrect: false },
            {
              id: "c",
              text: "Server-side chunking requires more CPU than client-side",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Server-side chunking cannot generate ETags for verification",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — Medium
    {
      title: "Content-Defined Chunking advantage over fixed-size",
      type: "question",
      sectionId: "sec_q_sync",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "What is the primary advantage of Content-Defined Chunking (CDC) over fixed-size chunking for delta sync in a file storage system?",
        explanation:
          "Fixed-size chunking means inserting a single byte near the beginning shifts all subsequent chunk boundaries, causing every chunk after the edit to have a different fingerprint. CDC uses a rolling hash (e.g., Rabin fingerprinting) to determine boundaries based on content, so a small edit only affects the chunks immediately surrounding the change — the vast majority remain identical.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "CDC eliminates the need for fingerprinting entirely",
              isCorrect: false,
            },
            {
              id: "b",
              text: "CDC produces smaller chunks, reducing network overhead",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A small edit only invalidates nearby chunks, not all subsequent ones",
              isCorrect: true,
            },
            {
              id: "d",
              text: "CDC chunks are easier to compress than fixed-size chunks",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — Medium
    {
      title: "Presigned URL generation is a local operation",
      type: "question",
      sectionId: "sec_q_uploads",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When the File Service generates a presigned URL for S3, what actually happens on the server?",
        explanation:
          "Generating a presigned URL is a purely local cryptographic operation. The service uses its AWS credentials to cryptographically sign a URL (incorporating the path, expiration, and permissions) without making any network call to S3. This is why the File Service can generate URLs extremely quickly and is not a bottleneck, even under high load.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The server creates an IAM role on the fly and attaches it to the URL",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The server cryptographically signs a URL locally using its AWS credentials — no S3 call needed",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The server makes an API call to S3 to request a temporary access token",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The server uploads a zero-byte placeholder to S3 and returns its URL",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — Hard
    {
      title: "Server-side chunk verification strategy",
      type: "question",
      sectionId: "sec_q_chunking",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'In the Dropbox chunked upload design, the backend uses a "trust but verify" approach for chunk status. Why is S3\'s ListParts API used instead of S3 event notifications for verifying individual chunk uploads?',
        explanation:
          "S3 event notifications only trigger when the entire multipart upload is completed (when CompleteMultipartUpload is called), not for individual part uploads. To verify individual parts during an in-progress upload, you must use the ListParts API, which returns all uploaded parts with their ETags. This allows the backend to verify chunk statuses reported by the client without waiting for the full upload to complete.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "S3 event notifications only fire on complete multipart upload, not individual part uploads",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Event notifications require Lambda functions which add too much latency",
              isCorrect: false,
            },
            {
              id: "c",
              text: "ListParts API is cheaper than event notifications for high-volume uploads",
              isCorrect: false,
            },
            {
              id: "d",
              text: "S3 event notifications have a 15-minute delay that is too slow for real-time tracking",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — Hard
    {
      title: "Compression ordering with encryption",
      type: "question",
      sectionId: "sec_q_security",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "When a Dropbox client needs to both compress and encrypt a file before upload, which ordering should be used and why?",
        explanation:
          "Encryption introduces randomness into the data, making it appear as high-entropy noise. Compression algorithms work by finding and exploiting patterns and redundancy in data. If you encrypt first, the resulting ciphertext has no exploitable patterns, so compression achieves virtually no size reduction. Compressing first exploits the original data patterns, then encryption secures the already-compressed output.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Encrypt first, then compress — encryption makes data more uniform, aiding compression",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The order does not matter — compression ratios are the same either way",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Compress first, then encrypt — encryption introduces randomness that defeats compression",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Interleave compression and encryption at the chunk level for maximum efficiency",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — Easy
    {
      title: "Problems with single-request large file upload",
      type: "question",
      sectionId: "sec_q_chunking",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL problems that arise from uploading a 50GB file via a single POST request:",
        explanation:
          "A single request for a 50GB file faces: (1) timeout issues — at 100Mbps it takes ~1.1 hours, (2) payload size limits — API Gateway has a 10MB hard limit, (3) network interruptions require restarting from scratch, (4) no progress indication for the user. These are the core motivations for chunked/multipart uploads.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "API Gateway payload size limits (e.g., 10MB) will reject the request",
              isCorrect: true,
            },
            { id: "b", text: "Network interruption forces a complete restart", isCorrect: true },
            {
              id: "c",
              text: "Server and client timeout limits will likely be exceeded",
              isCorrect: true,
            },
            { id: "d", text: "Users have no progress feedback during the upload", isCorrect: true },
            { id: "e", text: "S3 cannot store objects larger than 5GB", isCorrect: false },
          ],
        },
      },
    },

    // MCAQ 2 — Medium
    {
      title: "Benefits of CDN for file downloads",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL benefits of using a CDN (like CloudFront) for file downloads in a Dropbox-like system:",
        explanation:
          "CDNs cache files at edge locations worldwide, reducing latency for geographically distributed users. They support signed URLs for security (time-limited access with signature verification). They reduce load on the origin (S3) by serving cached content. However, CDNs are NOT free and actually add cost — the tradeoff is speed vs expense, and you should be strategic about what gets cached.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Reduces infrastructure cost compared to direct S3 downloads",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Supports signed URLs with expiration for access control",
              isCorrect: true,
            },
            { id: "c", text: "Reduces load on the origin S3 bucket", isCorrect: true },
            { id: "d", text: "Eliminates the need for S3 storage entirely", isCorrect: false },
            {
              id: "e",
              text: "Reduces download latency by serving from the nearest edge location",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — Medium
    {
      title: "Components of the sync architecture",
      type: "question",
      sectionId: "sec_q_sync",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL components/mechanisms used in Dropbox's hybrid remote-to-local sync approach:",
        explanation:
          "The hybrid sync approach uses: (1) a single WebSocket/SSE connection per device for real-time push notifications, (2) periodic polling via GET /files/changes?since=timestamp as a safety net for missed WebSocket messages, and (3) OS-specific file system events for detecting local changes. Client-side database replication is not part of this design — the metadata DB lives server-side.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Periodic polling as a safety net for missed push messages",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Client-side database replication of the metadata DB",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A single WebSocket/SSE connection per device for push notifications",
              isCorrect: true,
            },
            {
              id: "d",
              text: "OS-level file system events (FSEvents, FileSystemWatcher) for local changes",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — Hard
    {
      title: "Fingerprinting roles in chunked uploads",
      type: "question",
      sectionId: "sec_q_chunking",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL purposes that content-based fingerprinting (SHA-256 hash) serves in the chunked upload design:",
        explanation:
          "Content fingerprinting serves multiple purposes: (1) Deduplication — detecting if the same file content already exists, (2) Resumability — identifying a previously interrupted upload to resume from where it left off, (3) Chunk-level tracking — knowing exactly which chunks have been uploaded when resuming. It does NOT replace presigned URLs for S3 authorization — those are separate cryptographic tokens.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Identifying a previously interrupted upload for resumption",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Detecting duplicate file uploads across users (deduplication)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Replacing presigned URLs for S3 upload authorization",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Verifying chunk integrity after upload (compared with ETags)",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Tracking which individual chunks have been uploaded",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — Medium
    {
      title: "Explain the presigned URL upload flow",
      type: "question",
      sectionId: "sec_q_uploads",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the three-step process for uploading a file to a Dropbox-like system using presigned URLs. Why is this approach better than uploading through the backend server?",
        explanation:
          'Step 1: Client requests a presigned URL from the backend (POST /files/presigned-url with FileMetadata). The backend generates the URL using the S3 SDK (a local cryptographic operation) and saves metadata with status "uploading." Step 2: Client uses the presigned URL to PUT the file directly to S3 — the backend is not in the data path. Step 3: S3 sends a notification to the backend, which updates the metadata status to "uploaded." This is better because: (1) eliminates double transfer (client→server→S3 becomes client→S3), (2) reduces backend load and bandwidth costs, (3) the backend only handles lightweight metadata operations, making it easy to scale.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          rubric: [
            "Describes the three steps: request presigned URL, direct upload to S3, notification/metadata update",
            "Explains that presigned URL generation is a local crypto operation",
            "Identifies the elimination of double transfer as the key benefit",
            "Mentions reduced backend load / bandwidth savings",
          ],
        },
      },
    },

    // Paragraph 2 — Medium
    {
      title: "Design the sharing subsystem",
      type: "question",
      sectionId: "sec_q_uploads",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'A Dropbox-like system needs to support sharing files with other users and displaying a "shared with me" view. Describe three approaches to modeling the share relationship, explaining the tradeoffs of each.',
        explanation:
          'Approach 1 — Sharelist in file metadata: Add a sharelist array to each file document. Simple for checking "who has access to file X" but terrible for "which files are shared with user Y" — requires scanning every file. Approach 2 — Cache inverse mapping: Keep the sharelist and also cache userId→fileIds mapping. Fast lookups in both directions, but requires keeping the cache and source of truth in sync (use transactions). Approach 3 — Normalized SharedFiles table: Separate table with (userId partition key, fileId sort key). Clean, no sync issues, slightly less efficient than direct cache lookup but far simpler to maintain. Remove sharelist from metadata entirely. The normalized approach is generally preferred for its simplicity and consistency guarantees.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          rubric: [
            "Describes all three approaches: embedded sharelist, cache inverse mapping, normalized table",
            'Identifies the scan problem with embedded sharelist for "shared with me" queries',
            "Discusses sync challenges with the cache approach",
            "Explains why the normalized table is generally preferred",
          ],
        },
      },
    },

    // Paragraph 3 — Hard
    {
      title: "Design resumable chunked upload for 50GB files",
      type: "question",
      sectionId: "sec_q_chunking",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a resumable upload system for files up to 50GB. Cover the complete flow from initial upload to resumption after failure, including how you identify files and chunks, track progress, and verify integrity. What role does S3 multipart upload play?",
        explanation:
          'The design should cover: (1) Client-side chunking into 5-10MB pieces with SHA-256 fingerprints for the whole file and each chunk. (2) Initiation: POST to backend → calls S3 CreateMultipartUpload → gets uploadId → generates presigned URLs per part → saves metadata with "uploading" status and chunks array. (3) Upload loop: client uploads each chunk to its presigned URL, sends PATCH with ETag. Backend verifies via ListParts API. (4) Completion: all chunks "uploaded" → backend calls CompleteMultipartUpload → S3 assembles parts → status becomes "uploaded." (5) Resumption: client computes file fingerprint → checks if upload exists with that fingerprint → fetches chunk statuses → resumes only missing chunks. (6) Integrity: "trust but verify" — accept client PATCH for real-time progress UX but periodically verify with ListParts. Note: S3 event notifications only fire on complete multipart upload, not per-part.',
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          rubric: [
            "Describes client-side chunking with content-based fingerprinting",
            "Explains the S3 multipart upload initiation flow (CreateMultipartUpload, uploadId, presigned URLs per part)",
            "Covers the resume flow: fingerprint check → fetch existing chunk statuses → upload missing chunks only",
            "Mentions ETag-based server-side verification using ListParts API",
            "Explains CompleteMultipartUpload for final assembly",
            'Discusses the "trust but verify" approach for chunk status tracking',
          ],
        },
      },
    },

    // Paragraph 4 — Hard
    {
      title: "Hybrid sync architecture design",
      type: "question",
      sectionId: "sec_q_sync",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the bidirectional sync system for a Dropbox-like service. How does the client detect local changes? How does it learn about remote changes? Why is a hybrid push/pull approach necessary?",
        explanation:
          'Local → Remote: A client-side sync agent monitors the Dropbox folder using OS-specific file system events (FSEvents on macOS, FileSystemWatcher on Windows). Changed files are queued locally, then uploaded via the upload API with updated metadata. Conflicts use "last write wins." Remote → Local: Each device maintains a single WebSocket/SSE connection (not per-file). The server pushes change notifications (fileId, change type, updated metadata) in real-time. But WebSocket connections can drop and messages can be missed, so the client also periodically polls GET /files/changes?since=timestamp as a safety net. This hybrid gives real-time updates via push with guaranteed eventual consistency via polling. The since parameter enables efficient incremental sync — only changes since the last sync point are fetched.',
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          rubric: [
            "Describes OS-level file system event monitoring for local change detection",
            "Explains the upload flow for local → remote sync with conflict resolution",
            "Describes single WebSocket/SSE per device for real-time remote → local notifications",
            "Explains polling as a safety net for WebSocket reliability issues",
            "Mentions the since=timestamp parameter for incremental sync",
          ],
        },
      },
    },

    // Paragraph 5 — Hard
    {
      title: "Content-Defined Chunking for delta sync",
      type: "question",
      sectionId: "sec_q_sync",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain why fixed-size chunking fails for efficient delta sync and how Content-Defined Chunking (CDC) solves this problem. Include the role of rolling hashes and describe how this impacts sync performance.",
        explanation:
          "Fixed-size chunking (e.g., every 5MB) means inserting even a single byte near the beginning of a file shifts all subsequent chunk boundaries. Every chunk after the insertion point gets a different fingerprint, so delta sync sees nearly the entire file as changed — defeating the purpose. CDC uses a rolling hash function (like Rabin fingerprinting) to determine chunk boundaries based on the content itself, not fixed offsets. When the rolling hash hits a specific pattern (e.g., last N bits are zero), a chunk boundary is created. This means chunk boundaries are anchored to content patterns. A small edit only affects the 1-2 chunks immediately surrounding the change; all other chunks maintain their original boundaries and fingerprints. Impact: for a 50GB file where the user edits a few bytes, CDC might only require syncing a few MB instead of the entire file. This is how real-world systems like Dropbox achieve practical delta sync.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          rubric: [
            "Explains the boundary-shifting problem with fixed-size chunking",
            "Describes rolling hash (Rabin fingerprinting) mechanism for CDC",
            "Explains how CDC anchors boundaries to content patterns",
            "Quantifies the impact: small edit → only nearby chunks change",
            "Connects CDC to practical delta sync performance",
          ],
        },
      },
    },

    // Paragraph 6 — Hard
    {
      title: "Security model for file storage system",
      type: "question",
      sectionId: "sec_q_security",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a comprehensive security model for a Dropbox-like system. Address encryption (in transit and at rest), access control for shared files, and the risk of authorized users leaking download links to unauthorized parties.",
        explanation:
          "Encryption in Transit: HTTPS for all client-server communication. Encryption at Rest: S3 server-side encryption — each file encrypted with a unique key, key stored separately from the file. Access Control: SharedFiles table serves as the ACL — only users with a valid entry receive download URLs. The File Service checks this table before generating any presigned/signed URL. Link Leakage Mitigation: Signed URLs with short expiration (e.g., 5 minutes) limit the window of exposure. These are bearer tokens — anyone with a valid URL can download. For higher security: (1) bind the signed URL to the requester's IP address, (2) require authentication cookies alongside the signed URL, (3) implement download auditing to detect unusual patterns. CDN signed URLs work similarly — CloudFront validates the signature using registered public keys and checks expiration before serving content.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          rubric: [
            "Covers encryption in transit (HTTPS) and at rest (S3 SSE)",
            "Explains access control via SharedFiles table as ACL",
            "Addresses signed URL mechanism with time-limited expiration",
            "Discusses link leakage risk and mitigations (IP binding, auth cookies)",
            "Mentions CDN signed URL validation process",
          ],
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — Medium
    {
      title: "Identify the double-transfer problem",
      type: "question",
      sectionId: "sec_q_uploads",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In a naive Dropbox upload design where the client sends the file to the backend server which then stores it in S3, what is this anti-pattern called and how is it solved?",
        explanation:
          'This is the "double-transfer" or "double-upload" problem — the file is transmitted twice (client → server, then server → S3), wasting bandwidth, increasing latency, and adding unnecessary load to the backend. It is solved by using presigned URLs so the client uploads directly to S3, keeping the backend out of the data path entirely.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Double transfer problem, solved by presigned URLs for direct client-to-S3 upload",
        },
      },
    },

    // Text 2 — Medium
    {
      title: "Name the conflict resolution strategy",
      type: "question",
      sectionId: "sec_q_sync",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "When two users edit the same file simultaneously in a Dropbox-like system, what conflict resolution strategy is typically used?",
        explanation:
          'Dropbox uses "last write wins" (LWW) — the most recent edit overwrites the previous version. This is simple and works well for a file storage system where availability is prioritized over consistency. More sophisticated approaches like operational transformation or CRDTs are used for real-time collaborative editing (like Google Docs), which is out of scope for basic Dropbox.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Last write wins (LWW)",
        },
      },
    },

    // Text 3 — Hard
    {
      title: "S3 multipart upload completion behavior",
      type: "question",
      sectionId: "sec_q_chunking",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "After all chunks of a multipart upload are uploaded to S3, what specific S3 API call must the backend make, and what happens to the individual parts after this call succeeds?",
        explanation:
          "The backend must call CompleteMultipartUpload with the list of part numbers and their ETags. S3 then assembles all parts into a single object. After assembly, the individual parts are no longer separately addressable — the result is a single S3 object that can be downloaded with a normal GET request or byte-range requests. Downloads do not need to know original chunk boundaries.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "CompleteMultipartUpload — S3 assembles all parts into a single object",
        },
      },
    },

    // Text 4 — Hard
    {
      title: "Rolling hash algorithm for CDC",
      type: "question",
      sectionId: "sec_q_security",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Name the specific rolling hash algorithm commonly used for Content-Defined Chunking in systems like Dropbox, and explain in one sentence how it determines chunk boundaries.",
        explanation:
          "Rabin fingerprinting is the rolling hash algorithm commonly used for CDC. It slides a window over the file content and when the hash value matches a specific pattern (e.g., the last N bits are zero), a chunk boundary is created — anchoring boundaries to content patterns rather than fixed offsets.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Rabin fingerprinting — creates chunk boundaries when the rolling hash matches a specific bit pattern",
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — Easy
    {
      title: "Match Dropbox components to responsibilities",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each Dropbox architecture component to its primary responsibility:",
        explanation:
          "The File Service manages metadata and generates presigned URLs (control plane). S3 stores actual file bytes (data plane). The CDN caches files at edge locations for fast downloads. The API Gateway handles routing, SSL termination, rate limiting, and request validation. Understanding the separation between control plane (File Service) and data plane (S3/CDN) is key.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            { left: "File Service", right: "Manages metadata and generates presigned URLs" },
            { left: "S3 (Blob Storage)", right: "Stores actual file content (raw bytes)" },
            {
              left: "CDN (CloudFront)",
              right: "Caches files at edge locations for fast downloads",
            },
            { left: "API Gateway", right: "Routing, SSL termination, rate limiting" },
          ],
        },
      },
    },

    // Matching 2 — Medium
    {
      title: "Match upload design to tradeoff",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each upload approach to its primary limitation:",
        explanation:
          "Direct server storage has scalability and reliability issues (single point of failure). Backend-proxied S3 upload suffers from double transfer (file sent twice). Client-side presigned URL upload adds client complexity but eliminates redundant transfers. Fixed-size chunking causes boundary shifting problems when files are edited, making delta sync inefficient.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              left: "Upload to single backend server",
              right: "Not scalable, single point of failure",
            },
            {
              left: "Upload to backend → forward to S3",
              right: "Double transfer wastes bandwidth",
            },
            { left: "Presigned URL direct to S3", right: "More complex client-side logic" },
            { left: "Fixed-size chunking", right: "Small edits invalidate all subsequent chunks" },
          ],
        },
      },
    },

    // Matching 3 — Hard
    {
      title: "Match compression algorithm to characteristic",
      type: "question",
      sectionId: "sec_q_security",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each compression algorithm to its distinguishing characteristic for client-side file compression:",
        explanation:
          "Gzip has the broadest support across all platforms and browsers. Brotli achieves better compression ratios than Gzip, especially for text content. Zstandard (zstd) offers the best balance of compression speed and ratio — compresses/decompresses significantly faster than Gzip at comparable ratios and can be tuned across a wide range. For a client-side system like Dropbox, Zstandard is often the strong choice due to fast compression speed.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            { left: "Gzip", right: "Broadest platform and browser support" },
            { left: "Brotli", right: "Best compression ratio for text content" },
            { left: "Zstandard (zstd)", right: "Best speed-to-ratio balance, highly tunable" },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — Easy
    {
      title: "Presigned URLs fill-in-the-blank",
      type: "question",
      sectionId: "sec_q_uploads",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In a Dropbox-like system, _____ URLs allow the client to upload files directly to S3 without going through the backend server.",
        explanation:
          "Presigned URLs are time-limited, cryptographically signed URLs that grant temporary permission to upload or download a specific object in S3. They are generated by the backend using AWS credentials as a local operation.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [{ id: "b1", correctAnswer: "presigned", position: 0 }],
        },
      },
    },

    // Fill-blanks 2 — Easy
    {
      title: "CDN purpose fill-in-the-blank",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "A _____ is a network of geographically distributed servers that cache files and serve them from the server closest to the user, reducing download latency.",
        explanation:
          "A Content Delivery Network (CDN) like CloudFront caches content at edge locations around the world. When a user requests a file, it is served from the nearest edge location rather than the origin S3 bucket, significantly reducing latency for geographically distributed users.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [{ id: "b1", correctAnswer: "CDN", position: 0 }],
        },
      },
    },

    // Fill-blanks 3 — Medium
    {
      title: "Chunk verification fill-in-the-blank",
      type: "question",
      sectionId: "sec_q_chunking",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "After each chunk is uploaded to S3, the server verifies the upload by checking _____ returned by S3 against what the client reported, using the S3 _____ API.",
        explanation:
          'ETags are unique identifiers returned by S3 for each uploaded part. The backend verifies these ETags using the ListParts API, which returns all uploaded parts with their ETags for an in-progress multipart upload. This "trust but verify" approach ensures data integrity while maintaining good UX through client-reported progress.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            { id: "b1", correctAnswer: "ETags", position: 0 },
            { id: "b2", correctAnswer: "ListParts", position: 1 },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — Medium
    {
      title: "Calculate 50GB upload time",
      type: "question",
      sectionId: "sec_q_sync",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "A user wants to upload a 50GB file over a 100 Mbps internet connection. Approximately how many seconds will this take? (Assume 1 GB = 8 Gbits, no overhead)",
        explanation:
          "50 GB = 50 × 8 = 400 Gbits. At 100 Mbps = 0.1 Gbps: 400 / 0.1 = 4000 seconds (about 1.1 hours). This calculation demonstrates why single-request uploads are impractical for large files — timeouts, no progress feedback, and no resumability over such a long duration.",
        basePoints: 15,
        difficulty: "medium",
        questionData: { correctAnswer: 4000, tolerance: 100 },
      },
    },

    // Numerical 2 — Hard
    {
      title: "Calculate number of chunks for multipart upload",
      type: "question",
      sectionId: "sec_q_security",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A 50GB file is chunked into 10MB pieces for multipart upload. How many chunks will be created? If each chunk upload takes 0.8 seconds and we upload 5 chunks in parallel, approximately how many seconds will the total upload take? (Ignore overhead)",
        explanation:
          "Number of chunks: 50 GB = 50,000 MB. 50,000 / 10 = 5,000 chunks. With 5 parallel uploads: 5,000 / 5 = 1,000 sequential batches. 1,000 × 0.8 seconds = 800 seconds. Parallel chunk uploads significantly reduce total upload time compared to sequential upload. In practice, adaptive parallelism based on network conditions would further optimize this.",
        basePoints: 25,
        difficulty: "hard",
        questionData: { correctAnswer: 800, tolerance: 50 },
      },
    },
  ],
};
