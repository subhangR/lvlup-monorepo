/**
 * Instagram — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: feed generation (fan-out on read vs write), media upload & delivery,
 * CDN optimization, celebrity problem, hybrid feed approach, scalability at 500M DAU
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const instagramContent: StoryPointSeed = {
  title: "Design Instagram",
  description:
    "Master the system design of Instagram — covering feed generation strategies (fan-out on read vs write), media upload with presigned URLs, CDN-based media delivery, the celebrity problem, and scaling to 500M DAU.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements & High-Level Architecture", orderIndex: 1 },
    { id: "sec_q_feed_generation", title: "Feed Generation & Fan-Out Strategies", orderIndex: 2 },
    { id: "sec_q_hybrid_feed", title: "Hybrid Feed & Celebrity Problem", orderIndex: 3 },
    { id: "sec_q_media", title: "Media Upload & CDN Delivery", orderIndex: 4 },
    { id: "sec_q_storage_scaling", title: "Data Storage, Indexing & Scaling", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Design
    {
      title: "Instagram — Requirements & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Instagram — Requirements & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Instagram?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Instagram is a social media platform focused on visual content, allowing users to share photos and videos with followers. It is one of the most common system design interview questions at Meta and other FAANG companies. It shares patterns with FB News Feed and Dropbox but has unique challenges around feed generation and media delivery at massive scale.",
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
                  "Users should be able to create posts featuring photos, videos, and a simple caption.",
                  "Users should be able to follow other users (unidirectional relationship).",
                  "Users should be able to see a chronological feed of posts from users they follow.",
                ],
              },
            },
            {
              id: "b5",
              type: "paragraph",
              content:
                "Below the line (out of scope): likes/comments, search, stories, live streaming. Adding these shows product thinking but don't waste time on them unless prompted.",
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
                  "High availability — prioritize availability over consistency (eventual consistency acceptable, up to 2 minutes).",
                  "Low latency — feed delivery < 500ms end-to-end response time.",
                  "Instant media rendering — low latency photo/video delivery globally.",
                  "Scalable to 500M DAU with 100M posts per day.",
                ],
              },
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
                  "User: Username, profile details.",
                  "Post: Reference to media file, caption, creator user. A single Post entity handles both photos and videos.",
                  "Media: Actual bytes stored in S3 (blob store).",
                  "Follow: Unidirectional relationship — followerId → followedId.",
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
              content:
                '// Create a post\nPOST /posts -> postId\n{\n  "media": {photo or video bytes},\n  "caption": "My cool photo!"\n}\n\n// Follow a user (followerId from JWT)\nPOST /follows\n{\n  "followedId": "123"\n}\n\n// View feed with cursor pagination\nGET /feed?cursor={cursor}&limit={page_size} -> Post[]',
              metadata: { language: "text" },
            },
            {
              id: "b12",
              type: "heading",
              content: "High-Level Architecture",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "The core architecture consists of: (1) Clients (web/mobile) → (2) API Gateway (routing, auth, rate limiting) → (3) Microservices: Post Service (post creation, metadata storage, blob upload), Follow Service (follow/unfollow operations), Feed Service (feed generation). (4) Posts DB (DynamoDB or PostgreSQL) for metadata, (5) S3 for media blob storage, (6) Followers table for relationships.",
            },
            {
              id: "b14",
              type: "heading",
              content: "Database Choice: DynamoDB vs PostgreSQL",
              metadata: { level: 3 },
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "Given the scale (500M DAU), limited relational requirements, and acceptable eventual consistency, DynamoDB is a solid choice. However, Instagram actually uses PostgreSQL in production — proving that a well-configured SQL database CAN scale to this level. Either choice is valid; justify your decision. For DynamoDB: partition key = userId on Posts table (sort key = createdAt+postId for chronological ordering), partition key = followerId on Follows table (sort key = followedId).",
            },
            {
              id: "b16",
              type: "heading",
              content: "Shared vs Separate Databases",
              metadata: { level: 3 },
            },
            {
              id: "b17",
              type: "paragraph",
              content:
                "Having Post Service and Follow Service share a database is a valid production pattern. Tradeoffs: Shared DB gives simpler transactions and referential integrity but tighter coupling. Separate DBs give stronger isolation and independent scaling but require distributed transactions. Many FAANG companies start shared and evolve toward isolation as needs arise.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Feed Generation Deep Dive
    {
      title: "Deep Dive — Feed Generation & The Celebrity Problem",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dive — Feed Generation & The Celebrity Problem",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "The Feed Generation Challenge",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "Feed generation is the core scalability challenge for Instagram. A naive approach (fan-out on read) works at small scale but fails catastrophically at 500M DAU. Understanding the progression from naive → cached → precomputed → hybrid is essential for a Staff-level answer.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Bad: Fan-Out on Read (Naive Approach)",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "When a user requests their feed: (1) Query Follows table for all followed user IDs, (2) For each followed user, query Posts table for recent posts, (3) Merge and sort chronologically, (4) Return paginated result. For a user following 1,000 accounts, this requires 1,000+ queries to the Posts table per feed refresh.",
            },
            {
              id: "c5",
              type: "heading",
              content: "Why Fan-Out on Read Fails at Scale",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Read amplification: Each feed refresh generates 1,000+ DB reads. At 500M DAU × 5 refreshes/day = 2.5B feed generations/day.",
                  "Repeated work: Two users following the same accounts query for identical posts millions of times.",
                  "Unpredictable performance: Latency varies based on how many accounts a user follows — impossible to guarantee 500ms SLA.",
                  "Peak load: 150,000+ feed requests/second during peak hours, each triggering thousands of DB queries.",
                ],
              },
            },
            {
              id: "c7",
              type: "heading",
              content: "Mediocre: Simple Caching Layer",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Adding a Redis cache keyed by feed:{user_id}:{cursor} in front of the Posts table. Helps with repeated reads but does not solve the fundamental fan-out problem — the cache still needs to be populated via expensive aggregation queries. Cache needs to be massive for meaningful hit rates at Instagram scale.",
            },
            {
              id: "c9",
              type: "heading",
              content: "Good: Precomputed Feeds (Fan-Out on Write)",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "Instead of generating feeds at read time, precompute them at write time. When a user posts: (1) Store post metadata + media as before, (2) Put postId onto a message queue, (3) Feed Fan-out Service queries Follows table (via GSI: followedId → followerIds), (4) For each follower, prepend postId to their precomputed feed in Redis.",
            },
            {
              id: "c11",
              type: "heading",
              content: "Redis Feed Data Model",
              metadata: { level: 3 },
            },
            {
              id: "c12",
              type: "code",
              content:
                "Key:    feed:{user_id}\nType:   Sorted Set (ZSET)\nMembers: postId\nScores:  timestamp (or chronologically sortable postId)\n\n// Feed retrieval: single fast ZRANGEBYSCORE operation\n// Then hydrate postIds → post metadata via:\n// 1. Redis post cache (HASH) - fast path\n// 2. DynamoDB BatchGetItem - fallback for cache misses",
              metadata: { language: "text" },
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                "Feed hydration uses a hybrid approach: first check Redis post metadata cache (HASH), then batch-fetch cache misses from DynamoDB. TTL on the metadata cache controls freshness. Caption edits simply invalidate the cache entry.",
            },
            {
              id: "c14",
              type: "heading",
              content: "The Celebrity Problem (Write Amplification)",
              metadata: { level: 2 },
            },
            {
              id: "c15",
              type: "paragraph",
              content:
                "Fan-out on write's critical flaw: when a user with millions of followers posts, it triggers millions of Redis writes. A single celebrity post could overwhelm the system. This is write amplification — we've traded read-time complexity for write-time complexity.",
            },
            {
              id: "c16",
              type: "heading",
              content: "Great: Hybrid Approach (Staff-Level Answer)",
              metadata: { level: 2 },
            },
            {
              id: "c17",
              type: "paragraph",
              content:
                "Define a follower threshold (e.g., 100,000). Below threshold: fan-out on write (precompute feeds as above). Above threshold (celebrities): do NOT fan out on write. Instead, at read time, merge the precomputed feed with real-time queries for celebrity posts. This gives fast reads for the majority while bounding write amplification.",
            },
            {
              id: "c18",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "User requests feed → fetch precomputed portion from Redis (posts from non-celebrity accounts).",
                  "Query Posts table for recent posts from celebrities the user follows.",
                  "Merge both sets chronologically.",
                  "Return paginated result.",
                ],
              },
            },
            {
              id: "c19",
              type: "heading",
              content: "Redis Durability Considerations",
              metadata: { level: 3 },
            },
            {
              id: "c20",
              type: "paragraph",
              content:
                "Proactively address Redis durability in interviews: configure AOF (Append-Only File) persistence, use Redis Sentinel for HA with automatic failover, and Redis Cluster for data sharding. A thoughtful statement like \"We'd use AOF persistence with Sentinel for failover\" shows you don't treat Redis as a magical black box.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Media Upload, CDN, and Scaling
    {
      title: "Deep Dive — Media Handling, CDN, & Scaling to 500M DAU",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dive — Media Handling, CDN, & Scaling to 500M DAU",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Uploading Large Media Files",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "Photos can be up to 8MB and videos up to 4GB. A single HTTP request is usually constrained to < 2GB payload, so videos require chunked uploads. The pattern: (1) POST /posts creates metadata + returns a presigned S3 URL, (2) Client uploads directly to S3 via multipart upload API, (3) S3 reassembles chunks automatically.",
            },
            {
              id: "d3",
              type: "heading",
              content: "Presigned URLs: Why Upload to S3 Directly?",
              metadata: { level: 3 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "Presigned URLs let the client upload directly to S3, bypassing your backend servers. This prevents your servers from becoming a bottleneck for large file transfers. The URL is time-limited (e.g., 1 hour) and scoped to a specific S3 key. Your backend never handles the raw media bytes.",
            },
            {
              id: "d5",
              type: "heading",
              content: "Upload Completion: Client-Driven vs Server-Driven",
              metadata: { level: 3 },
            },
            {
              id: "d6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Client-driven: Client sends PATCH to update post metadata after upload. Simpler but less reliable — trusts client to report accurately.",
                  "Server-driven: S3 event notification triggers a Lambda/background job to update metadata. More complex but better consistency guarantees. Most production systems use this approach.",
                ],
              },
            },
            {
              id: "d7",
              type: "paragraph",
              content:
                "Post metadata includes a media_upload_status field (pending → complete). This ensures posts with incomplete uploads are never shown in feeds.",
            },
            {
              id: "d8",
              type: "heading",
              content: "Media Delivery: From S3 to User",
              metadata: { level: 2 },
            },
            {
              id: "d9",
              type: "heading",
              content: "Bad: Direct S3 Serving",
              metadata: { level: 3 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "Serving directly from S3 works for small apps but fails globally. A user in Singapore accessing us-east-1 S3 waits seconds for images. Every request hits S3 directly (expensive at scale), and the same high-resolution file is served to all devices regardless of screen size or network speed.",
            },
            {
              id: "d11",
              type: "heading",
              content: "Good: Global CDN Distribution",
              metadata: { level: 3 },
            },
            {
              id: "d12",
              type: "paragraph",
              content:
                "Put a CDN (CloudFront) in front of S3. CDN edge locations worldwide cache media close to users. The Singapore user loads from a nearby edge server instead of US East Coast. Cache images for 24 hours at edge locations since they rarely change. CDN provides built-in compression for transfer.",
            },
            {
              id: "d13",
              type: "heading",
              content: "Great: CDN + Dynamic Media Optimization",
              metadata: { level: 3 },
            },
            {
              id: "d14",
              type: "paragraph",
              content:
                "Combine CDN with a media processing pipeline (Cloudinary/Imgix). On upload, generate multiple variants: different resolutions, WebP format for supported browsers, multiple video quality levels with adaptive streaming. The CDN serves optimized variants based on device type and network conditions. Mobile users get appropriately sized images; desktop users get full resolution.",
            },
            {
              id: "d15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Intelligent caching: Popular media cached aggressively; less-accessed content has shorter TTLs.",
                  "Proactive cache warming: For viral content, pre-populate caches in regions with predicted high viewership.",
                  "Tradeoff: Multiple media variants increase storage costs and processing pipeline complexity.",
                ],
              },
            },
            {
              id: "d16",
              type: "heading",
              content: "Scaling to 500M DAU: Key Numbers",
              metadata: { level: 2 },
            },
            {
              id: "d17",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Media storage: 100M posts/day × 2MB average = 200TB/day → ~750 PB over 10 years. S3 handles this; move cold data to Glacier for cost savings.",
                  "Metadata storage: 100M posts/day × 1KB = 100GB/day. DynamoDB handles this easily.",
                  "Storage tiering: CDN → Cache/Memory → SSD → HDD → Tape. Move infrequently accessed data down levels to save cost.",
                  "Horizontal scaling: Microservices auto-scale based on CPU/memory thresholds. Each service has an implicit load balancer.",
                ],
              },
            },
            {
              id: "d18",
              type: "heading",
              content: "What Distinguishes Staff-Level Answers",
              metadata: { level: 2 },
            },
            {
              id: "d19",
              type: "quote",
              content:
                "Staff candidates quickly identify feed generation and media delivery as the true bottlenecks. They discuss system evolution (1M → 500M users), articulate where simpler solutions suffice and when to introduce complexity. They anticipate failure modes, discuss Redis durability proactively, and propose the hybrid fan-out approach without being prompted. They prioritize user experience and demonstrate awareness of operational concerns.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (30 total)
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "Follow relationship type in Instagram",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'How is the "follow" relationship modeled in Instagram\'s data model, and why does this matter for feed generation?',
        explanation:
          "Instagram follows are unidirectional — if Alice follows Bob, Alice sees Bob's posts but Bob does NOT see Alice's (unless he follows her back). This is modeled as a separate Follow table with followerId and followedId. Bidirectional would mean mutual follows like Facebook's friendship model, which is incorrect for Instagram.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Bidirectional — a single row represents mutual following between two users",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Embedded array — each User document contains a list of followed user IDs",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Unidirectional — stored as followerId → followedId pairs in a Follow table",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Graph-based — uses a dedicated graph database like Neo4j for relationship traversal",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Where to store media file bytes",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "Where should Instagram store the actual photo and video file bytes?",
        explanation:
          "S3 (or equivalent blob store) is the correct choice for storing large binary files. A relational database would be extremely slow for binary reads and bloat the database size. A file server lacks the durability and scalability of object storage. Redis is an in-memory cache — storing 200TB/day of media in memory is not feasible.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "DynamoDB — store the bytes as a BLOB column alongside post metadata",
              isCorrect: false,
            },
            {
              id: "b",
              text: "A dedicated file server managed by the Post Service",
              isCorrect: false,
            },
            {
              id: "c",
              text: "S3 (blob store) — designed for large binary objects with high durability",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Redis — in-memory storage for fast access to all media files",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Purpose of presigned URLs for media upload",
      type: "question",
      sectionId: "sec_q_media",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why does Instagram use presigned S3 URLs for media uploads instead of routing files through the backend Post Service?",
        explanation:
          "Presigned URLs let the client upload directly to S3, bypassing the backend entirely for the heavy file transfer. This prevents the Post Service from becoming a bottleneck — your servers never handle the raw media bytes, freeing them to handle metadata operations. The URL is time-limited and scoped for security.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "To allow S3 to validate the media content type before accepting the upload",
              isCorrect: false,
            },
            {
              id: "b",
              text: "To avoid backend servers becoming a bottleneck for large file transfers — the client uploads directly to S3",
              isCorrect: true,
            },
            {
              id: "c",
              text: "To reduce S3 storage costs by compressing files during the signed upload",
              isCorrect: false,
            },
            {
              id: "d",
              text: "To enable end-to-end encryption between the client and S3",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why fan-out on read fails at Instagram scale",
      type: "question",
      sectionId: "sec_q_feed_generation",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "What is the PRIMARY reason fan-out on read fails for Instagram's feed generation at 500M DAU?",
        explanation:
          "The core problem is read amplification: each feed refresh for a user following 1,000 accounts triggers 1,000+ DB queries. With 500M DAU × 5 refreshes/day = 2.5B feed generations, each requiring thousands of queries, the total database read load is unsustainable regardless of caching. Caching helps but doesn't solve the fundamental fan-out aggregation problem.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Read amplification — each feed refresh triggers 1,000+ DB queries per user, producing unsustainable read load at 2.5B daily feed generations",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Network bandwidth — transferring post data from DB to application servers saturates the network",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Sorting posts chronologically is computationally expensive at scale",
              isCorrect: false,
            },
            {
              id: "d",
              text: "DynamoDB does not support joins, so aggregating posts from multiple users is impossible",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Redis data structure for precomputed feeds",
      type: "question",
      sectionId: "sec_q_feed_generation",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Which Redis data structure is most appropriate for storing a user's precomputed feed, and why?",
        explanation:
          "A Sorted Set (ZSET) with postIds as members and timestamps as scores provides O(log N) insertion and efficient range queries for pagination (ZRANGEBYSCORE). Lists support push/pop but lack efficient range queries by timestamp. Hashes are key-value stores without ordering. Sets are unordered, making chronological feed retrieval impossible.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Sorted Set (ZSET) — postIds as members, timestamps as scores; enables O(log N) inserts and efficient chronological range queries",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Set — store unique postIds and sort client-side before returning",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Hash — map postId to post metadata for O(1) lookups",
              isCorrect: false,
            },
            {
              id: "d",
              text: "List (LPUSH/RPUSH) — prepend new posts and trim to fixed length for pagination",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Celebrity threshold in hybrid approach",
      type: "question",
      sectionId: "sec_q_hybrid_feed",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In the hybrid feed approach, a follower threshold (e.g., 100,000) determines whether a user's posts are fan-out on write or fan-out on read. What happens if this threshold is set TOO LOW?",
        explanation:
          'If the threshold is too low, too many accounts are classified as "celebrities," meaning their posts are NOT precomputed into followers\' feeds. At read time, the system must query the Posts table for recent posts from all these accounts and merge them with the precomputed feed. This defeats the purpose of fan-out on write — read performance degrades for a large number of users because the real-time merge workload increases.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Too many accounts are treated as celebrities, increasing read-time fan-out work and degrading feed latency for most users",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Write amplification increases because more followers' feeds need to be updated on each post",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The Follows table becomes a bottleneck because too many GSI lookups are needed",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Redis runs out of memory because too many feeds are being precomputed",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Feed hydration strategy tradeoffs",
      type: "question",
      sectionId: "sec_q_hybrid_feed",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "After retrieving postIds from a user's Redis feed ZSET, you need to hydrate them with full post metadata. Three options exist: (1) fetch each postId from DynamoDB, (2) store full metadata in Redis alongside the ZSET, (3) hybrid — check Redis post cache first, batch-fetch misses from DynamoDB. Which approach is best and why?",
        explanation:
          "The hybrid approach (option 3) balances performance and resource usage. Option 1 always queries DynamoDB, adding latency to every feed request. Option 2 stores all metadata in Redis, which consumes enormous memory and creates data consistency issues (caption edits require updating everywhere). The hybrid lets you tune TTL on the metadata cache — popular posts stay cached, infrequently accessed ones are fetched on demand, and stale entries are naturally evicted.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Hybrid (option 3) — Redis cache for hot posts with DynamoDB fallback; tunable TTL balances memory usage, consistency, and latency",
              isCorrect: true,
            },
            {
              id: "b",
              text: "None — embed full post metadata directly in the feed ZSET member instead of just postIds",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Option 2 (full metadata in Redis) — lowest latency since all data is in memory; consistency is handled by TTL eviction",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Option 1 (always DynamoDB) — simplest architecture and DynamoDB BatchGetItem is fast enough for 500M DAU",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Server-driven vs client-driven upload completion",
      type: "question",
      sectionId: "sec_q_media",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "For updating post metadata after a multipart media upload to S3 completes, most production systems prefer the server-driven approach (S3 event notification → Lambda) over the client-driven approach (client PATCH request). What is the key architectural reason?",
        explanation:
          'The server-driven approach ensures the backend has authoritative control over metadata state transitions. Clients can crash, lose connectivity, or lie about upload status. With S3 event notifications, the system transitions post status (pending → complete) only when S3 confirms the upload is actually complete. This prevents "ghost posts" (metadata exists but media doesn\'t) and ensures feed generation never includes incomplete uploads.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "S3 event notifications are faster than client PATCH requests, reducing time-to-visible for new posts",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Client-driven approach requires the client to have direct database write access, which is a security risk",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The backend maintains authoritative control over metadata state — clients can crash, lose connectivity, or misreport, leaving ghost posts",
              isCorrect: true,
            },
            {
              id: "d",
              text: "It eliminates the need for a media_upload_status field since S3 events guarantee ordering",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Core components of Instagram's high-level design",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL components that are part of Instagram's core high-level architecture:",
        explanation:
          "The core architecture includes: API Gateway (routing, auth, rate limiting), Post Service (post creation, metadata), S3/Blob Store (media bytes), and a Followers/Follow table (relationship tracking). A recommendation engine is explicitly out of scope for the core requirements — it relates to algorithmic feeds (likes/comments), not chronological feeds.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "S3 blob store for photo and video file storage", isCorrect: true },
            {
              id: "b",
              text: "API Gateway for routing, authentication, and rate limiting",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Post Service for handling post creation and metadata storage",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Recommendation engine for personalized feed ranking",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Advantages of fan-out on write over fan-out on read",
      type: "question",
      sectionId: "sec_q_feed_generation",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL advantages of the fan-out on write (precomputed feeds) approach over fan-out on read:",
        explanation:
          "Fan-out on write makes feed retrieval a single fast Redis operation (ZRANGEBYSCORE) instead of thousands of DB queries. It eliminates repeated aggregation work since each post is written to feeds once, not re-queried on every read. Feed latency becomes consistent regardless of how many accounts a user follows. However, it does NOT reduce total storage — in fact, it INCREASES storage because each postId is stored in every follower's feed.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Eliminates repeated aggregation work — each post is distributed once, not re-queried per reader",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Feed latency becomes predictable regardless of follow count",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Feed retrieval becomes a single fast Redis query instead of thousands of DB reads",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Reduces total storage requirements since feeds are stored once instead of computed each time",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "CDN optimization techniques for Instagram media",
      type: "question",
      sectionId: "sec_q_media",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid CDN optimization strategies for serving Instagram's photos and videos globally:",
        explanation:
          "CDN edge caching puts media near users for low latency. Dynamic media optimization generates multiple variants (resolutions, WebP format) served based on device type. Proactive cache warming for viral content prevents cold-cache latency spikes. However, a CDN does NOT handle post creation metadata storage — that is the Post Service's responsibility.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "CDN nodes store post creation metadata to reduce load on the Post Service",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Edge caching with location-aware routing to serve from the nearest CDN node",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Proactive cache warming in regions where viral content is expected to trend",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Dynamic media optimization — generate multiple resolutions and formats (WebP) per upload",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Staff-level considerations for Instagram's hybrid feed",
      type: "question",
      sectionId: "sec_q_hybrid_feed",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are Staff-level considerations that go beyond the basic hybrid feed design? Select ALL that apply.",
        explanation:
          "Staff candidates address: (1) Redis durability — AOF persistence + Sentinel for failover, not treating Redis as a black box; (2) System evolution — starting simple and evolving, not over-engineering from day one; (3) Operational monitoring — watching both the precomputed and real-time systems. However, implementing strong consistency across all feed reads contradicts Instagram's fundamental design choice to accept eventual consistency (up to 2 minutes) in favor of availability.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Separate monitoring and SLAs for users who follow many celebrities vs those who don't",
              isCorrect: true,
            },
            {
              id: "b",
              text: "System evolution strategy — starting with fan-out on read at 1M users, evolving to hybrid at 500M",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Redis persistence configuration (AOF + Sentinel failover) to handle feed cache node failures",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Implementing strong consistency across all feed reads to prevent users from ever seeing stale data",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Compare fan-out on read vs fan-out on write for feed generation",
      type: "question",
      sectionId: "sec_q_feed_generation",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare and contrast fan-out on read and fan-out on write approaches for generating Instagram's feed. For each, describe how it works, its performance characteristics at scale, and its primary limitation.",
        explanation:
          "A strong answer describes both approaches mechanically, quantifies the scale problem (2.5B feed generations/day, 1,000+ queries per refresh), and identifies the core tradeoff: read-time computation vs write-time amplification. The answer should naturally lead to the hybrid approach as the resolution.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Fan-out on Read:\nHow it works: When a user requests their feed, query the Follows table for followed user IDs, then query the Posts table for each user's recent posts, merge chronologically, and return.\nPerformance: For a user following 1,000 accounts, each feed request triggers 1,000+ DB queries. At 500M DAU × 5 refreshes = 2.5B daily feed generations, this creates unsustainable read amplification.\nPrimary limitation: Read-time aggregation is the bottleneck — latency varies wildly based on follow count, making a consistent 500ms SLA impossible.\n\nFan-out on Write:\nHow it works: When a user posts, asynchronously push the postId to every follower's precomputed feed in Redis (ZSET keyed by feed:{user_id}). At read time, simply fetch the top N entries from the user's ZSET — a single O(log N) operation.\nPerformance: Feed reads become fast and predictable. Write-time work is distributed via a message queue to the Fan-out Service.\nPrimary limitation: Write amplification — a celebrity with 10M followers triggers 10M Redis writes per post, potentially overwhelming the write pipeline.\n\nResolution: The hybrid approach uses fan-out on write for regular users (< 100K followers) and fan-out on read for celebrities, bounding write amplification while keeping reads fast for the majority.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the media upload flow with presigned URLs",
      type: "question",
      sectionId: "sec_q_media",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Describe the end-to-end flow for uploading a photo or video to Instagram, from the moment a user taps "Post" to when the media is stored and the post appears in followers\' feeds. Include the role of presigned URLs, multipart uploads, and the media_upload_status field.',
        explanation:
          "A strong answer traces: POST /posts → metadata created with pending status → presigned URL returned → client uploads via S3 multipart API → S3 event triggers status update → feed fan-out begins. Should explain why presigned URLs bypass the backend and why the status field prevents incomplete posts from appearing.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            '1. User taps "Post" with a photo/video and caption.\n2. Client sends POST /posts to the API Gateway → Post Service.\n3. Post Service creates a post metadata record in the Posts DB with caption, userId, and media_upload_status = "pending". It also generates a time-limited presigned S3 URL and returns it along with the postId to the client.\n4. Client uses the presigned URL to upload media directly to S3 via the multipart upload API. For videos (up to 4GB), the file is chunked — S3 handles reassembly. The backend servers never handle raw media bytes.\n5. When S3 confirms the multipart upload is complete, an S3 event notification triggers a Lambda/background job.\n6. The Lambda updates the post metadata: sets the S3 object_key and changes media_upload_status from "pending" to "complete".\n7. Only once status = "complete" does the postId get placed onto the message queue for feed fan-out.\n8. The Feed Fan-out Service queries the Follows table (GSI: followedId → followerIds) and prepends the postId to each follower\'s Redis feed ZSET.\n9. When a follower next requests their feed, the new postId appears in the ZRANGEBYSCORE result, gets hydrated with metadata, and the media URL resolves to a CDN-cached copy.\n\nThe media_upload_status field is critical — it prevents incomplete posts (where the user closed the app mid-upload) from ever appearing in feeds.',
          minLength: 150,
          maxLength: 2500,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the hybrid feed approach in detail",
      type: "question",
      sectionId: "sec_q_hybrid_feed",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the hybrid feed approach for Instagram that combines fan-out on write for regular users with fan-out on read for celebrities. Include: how the celebrity threshold is determined, what happens at write time, what happens at read time, the feed merge algorithm, and the tradeoffs this approach introduces.",
        explanation:
          "A complete answer covers: threshold definition (e.g., 100K followers, tuned based on write capacity), write-time bifurcation (queue vs skip), read-time merge logic (Redis ZSET + real-time celebrity queries), merge algorithm (chronological interleave with cursor), and tradeoffs (inconsistent latency for heavy celebrity followers, dual-system operational complexity, threshold tuning).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Hybrid Feed Design:\n\nThreshold determination: Define a follower count threshold (e.g., 100,000) based on write pipeline capacity. This threshold should be configurable and tuned based on monitoring — too low means too much read-time work, too high means excessive write amplification.\n\nWrite-time behavior:\n- When a user with < 100K followers posts: standard fan-out on write. Post goes to message queue → Fan-out Service queries Follows GSI → prepends postId to each follower's feed:{user_id} ZSET in Redis.\n- When a celebrity (≥ 100K followers) posts: store post metadata + media as normal, but do NOT trigger feed fan-out. The post is only stored in the Posts table.\n\nRead-time behavior:\n1. Fetch the precomputed portion from Redis: ZRANGEBYSCORE on feed:{user_id} with cursor and limit.\n2. Determine which celebrities the user follows (can be cached per user).\n3. For each celebrity, query the Posts table for recent posts (partitioned by userId, sorted by createdAt).\n4. Merge both result sets chronologically.\n\nMerge algorithm: Use a min-heap / priority queue merge. Take the top N items by timestamp from both the precomputed list and the celebrity posts. Use the oldest item's timestamp as the next cursor for pagination.\n\nTradeoffs:\n- Inconsistent latency: Users following many celebrities experience slower feeds than those who don't. Consider separate SLAs per user segment.\n- Dual-system complexity: Must monitor and maintain both the precomputed pipeline and the real-time celebrity query system.\n- Threshold edge cases: Users near the threshold may oscillate, causing feed inconsistencies. Use hysteresis (e.g., upgrade to celebrity at 100K, downgrade at 90K).\n- Celebrity post caching: Cache recent posts from popular celebrities to avoid repeated Posts table queries across millions of followers.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Media delivery optimization from S3 to global users",
      type: "question",
      sectionId: "sec_q_media",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the media delivery pipeline for Instagram, progressing from the simplest approach to the production-grade solution. Explain why direct S3 serving is insufficient, how a CDN improves the situation, and how dynamic media optimization provides the best user experience. Include specific technical details.",
        explanation:
          "Should progress through: direct S3 (high latency globally, expensive, same file for all devices) → CDN (edge caching, geographic proximity) → CDN + dynamic optimization (multiple variants, device-aware serving, adaptive streaming, intelligent caching). Should mention WebP, adaptive bitrate, TTLs, and proactive cache warming.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Media Delivery Evolution:\n\n1. Direct S3 Serving (Bad):\n- Client receives the S3 URL for each media file and downloads directly.\n- Problems: Users far from the S3 region (e.g., Singapore user, us-east-1 bucket) experience multi-second load times. Every request hits S3 directly — expensive at 500M DAU. The same 8MB high-resolution image is served to both a flagship phone on 5G and a budget phone on 3G.\n\n2. Global CDN Distribution (Good):\n- Place CloudFront (or equivalent CDN) in front of S3. CDN maintains edge locations worldwide.\n- When a user requests media, they're routed to the nearest edge location. If cached there, serve immediately (~10ms). If not, edge fetches from S3 origin, caches it, then serves.\n- Configure cache TTLs: images cached 24 hours at edge (they don't change once uploaded). CDN provides built-in compression during transfer.\n- Improvement: Singapore user loads from a regional edge server. Popular media is served millions of times without hitting S3.\n- Limitation: Same high-resolution file served to all devices. Popular content eviction from edge caches causes origin fetches.\n\n3. CDN + Dynamic Media Optimization (Great — Staff level):\n- On upload, a media processing pipeline (Cloudinary/Imgix) generates multiple variants:\n  - Images: 3-4 resolutions (thumbnail, mobile, tablet, desktop) + WebP format for supported browsers\n  - Videos: Multiple quality levels (360p, 720p, 1080p) + HLS/DASH adaptive streaming manifests\n- The CDN serves the optimal variant based on client device and network conditions (detected via User-Agent, Client Hints, or Accept headers).\n- Intelligent caching strategies: Popular media gets aggressive edge TTLs. Viral content is proactively warmed in predicted high-traffic regions. Long-tail content has shorter TTLs to save edge storage.\n- Tradeoffs: Storage cost increases (3-5x per media file for variants). Processing pipeline adds upload latency (mitigated since it's asynchronous). Pipeline failures need monitoring and retry logic.\n\nStorage tiering for cost: CDN edge → Redis/Memcached → SSD (hot) → HDD (warm) → Glacier (cold, >6 months old). Move infrequently accessed media down tiers automatically.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Database design and indexing strategy for Instagram",
      type: "question",
      sectionId: "sec_q_storage_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the database schema and indexing strategy for Instagram using DynamoDB. Define the partition keys, sort keys, and Global Secondary Indexes (GSIs) for the Posts and Follows tables. Explain how each index supports the system's primary access patterns.",
        explanation:
          'Must cover: Posts table (PK: userId, SK: createdAt#postId for chronological queries per user), Follows table (PK: followerId, SK: followedId for "who do I follow" queries), GSI on Follows (PK: followedId, SK: followerId for fan-out on write "who follows me" queries). Should explain why each key choice maps to an access pattern.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'DynamoDB Schema & Indexing:\n\nPosts Table:\n- Partition Key: userId — most queries fetch posts by a specific user ("get user X\'s recent posts")\n- Sort Key: createdAt#postId (composite) — provides chronological ordering within a user\'s partition; appending postId ensures uniqueness even for same-millisecond posts\n- Attributes: caption, mediaUrl (S3 key), mediaType (photo/video), mediaUploadStatus, createdAt\n- Access patterns served: "Get recent posts by user X" (PK=userId, SK descending, LIMIT N) — used by both feed generation and profile views\n\nFollows Table:\n- Partition Key: followerId — "who does user X follow?" is the primary query for fan-out on read\n- Sort Key: followedId — enables efficient point lookups ("does X follow Y?") and range queries\n- Access pattern: "Get all users that X follows" (PK=followerId, scan all SK values)\n\nFollows GSI (FollowedIndex):\n- Partition Key: followedId — inverts the relationship for fan-out on write\n- Sort Key: followerId\n- Access pattern: "Get all followers of user Y" (PK=followedId, scan all SK values) — used by the Feed Fan-out Service when Y posts\n- This GSI is critical for the precomputed feed approach. Without it, finding "who follows celebrity X" would require a full table scan.\n\nWhy DynamoDB?\n- Eventual consistency is acceptable (matches our NFR)\n- Partition key design naturally distributes data across partitions\n- Auto-scaling handles 100M posts/day without manual intervention\n- BatchGetItem for efficient feed hydration (fetch multiple posts by PK)\n\nAlternative: PostgreSQL with indexes on (user_id) for Posts and (follower_id, followed_id) for Follows. Instagram actually uses PostgreSQL in production — proving SQL can scale to 500M DAU with proper indexing and connection pooling.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Scaling Instagram to 500M DAU: capacity estimation",
      type: "question",
      sectionId: "sec_q_storage_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Perform a capacity estimation for Instagram at 500M DAU with 100M posts per day. Calculate daily media storage, metadata storage, and 10-year projections. Then explain the storage tiering strategy you would use to manage costs.",
        explanation:
          "Must include: media = 100M × 2MB = 200TB/day, ~750 PB over 10 years. Metadata = 100M × 1KB = 100GB/day. Storage tiering: CDN → Cache → SSD → HDD → Glacier. Cost optimization: move cold data to cheaper tiers. Should mention that S3 handles the scale but costs need management.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Capacity Estimation:\n\nMedia Storage:\n- Average media size: ~2MB (mix of photos ~1-2MB and videos ~5-50MB, weighted toward photos)\n- Daily: 100M posts/day × 2MB = 200TB/day\n- Yearly: 200TB × 365 = 73PB/year\n- 10-year: ~750PB\n- With media variants (3-5x for CDN optimization): 750PB × 4 = ~3EB\n- S3 can handle this, but at $0.023/GB/month, 750PB = ~$17M/month. Cost optimization is critical.\n\nMetadata Storage:\n- Per-post metadata: ~1KB (userId, caption, mediaUrl, timestamps, status)\n- Daily: 100M × 1KB = 100GB/day\n- Yearly: 36.5TB/year\n- 10-year: ~365TB — easily managed by DynamoDB or PostgreSQL\n\nFeed Cache (Redis):\n- Per-user feed: ~1,000 postIds × 16 bytes = 16KB per user\n- 500M users: 500M × 16KB = 8TB\n- Redis cluster with this capacity is feasible (distributed across many nodes)\n\nStorage Tiering Strategy (warm → cold):\n1. CDN Edge (hottest): Popular media, cached at 100+ edge locations. TTL: 24h for images, 6h for video thumbnails.\n2. Redis/Memcached: Feed ZSETs and post metadata cache. Sub-millisecond access.\n3. SSD (primary DB): Posts and Follows tables. Last 30 days of post metadata.\n4. HDD (warm): Media accessed < once/month. Lower IOPS but 3-4x cheaper per GB.\n5. S3 Glacier (cold): Media not accessed in 6+ months. ~$0.004/GB/month vs $0.023 for standard S3.\n\nAutomated lifecycle: S3 lifecycle policies automatically transition objects from Standard → Infrequent Access (30 days) → Glacier (180 days). This alone can reduce storage costs by 60-80% for older content.\n\nThroughput:\n- Peak feed requests: ~150,000+ RPS during peak hours\n- Microservices auto-scale horizontally based on CPU/memory thresholds\n- Each service tier has implicit load balancers distributing traffic",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Name the celebrity problem in feed generation",
      type: "question",
      sectionId: "sec_q_feed_generation",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In the fan-out on write approach, what is the specific problem caused by users with millions of followers posting? Name this problem and explain it in one sentence.",
        explanation:
          'This is called write amplification (or the "celebrity problem"). A single post by a user with millions of followers triggers millions of Redis writes to update each follower\'s feed, potentially overwhelming the write pipeline and causing delays for all users.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Write amplification (celebrity problem) — a single celebrity post triggers millions of Redis writes, one per follower.",
          acceptableAnswers: [
            "write amplification",
            "celebrity problem",
            "fan-out storm",
            "hot partition",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "DynamoDB partition key for Posts table",
      type: "question",
      sectionId: "sec_q_storage_scaling",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content: "What should the partition key of the Posts table in DynamoDB be, and why?",
        explanation:
          'The partition key should be userId because the primary access pattern is "get all recent posts by a specific user." This applies to both profile pages and feed generation (where we query posts per followed user). The sort key should be createdAt#postId for chronological ordering.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "userId — because the primary access pattern is fetching recent posts by a specific user for feed generation and profile views.",
          acceptableAnswers: ["userId", "user_id", "user id", "the user ID"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Why does Instagram need a GSI on the Follows table?",
      type: "question",
      sectionId: "sec_q_storage_scaling",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "The Follows table has followerId as its partition key. Why is a Global Secondary Index (GSI) with followedId as the partition key essential for the fan-out on write approach?",
        explanation:
          'When a user posts, the Feed Fan-out Service needs to find "all followers of this user" to update their feeds. The base table is partitioned by followerId (optimized for "who do I follow?"). Without the GSI (followedId → followerId), finding all followers would require a full table scan — unacceptable at scale. The GSI inverts the access pattern.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            'Fan-out on write requires "find all followers of user X" to update their feeds. Without the GSI, this requires a full table scan since the base table is partitioned by followerId, not followedId.',
          acceptableAnswers: [
            "find all followers",
            "invert the relationship",
            "full table scan",
            "who follows me",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "What prevents incomplete uploads from appearing in feeds?",
      type: "question",
      sectionId: "sec_q_media",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "After a user initiates a post but before the media upload to S3 is complete, what mechanism prevents the incomplete post from appearing in followers' feeds?",
        explanation:
          'The media_upload_status field on the post metadata starts as "pending" and transitions to "complete" only when S3 confirms the upload is done (via server-driven event notification). Feed fan-out is only triggered after the status becomes "complete." Posts with pending status are invisible to the feed system.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "The media_upload_status field (pending → complete). Feed fan-out is only triggered after the upload is confirmed complete by S3 event notification.",
          acceptableAnswers: [
            "media_upload_status",
            "upload status",
            "pending status",
            "status field",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match Instagram components to their responsibilities",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each Instagram system component to its primary responsibility:",
        explanation:
          "The API Gateway handles routing, authentication, and rate limiting as the entry point. The Post Service manages post creation and metadata storage. S3 stores the actual photo/video binary data. The Follow Service manages the unidirectional follow relationships between users.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "API Gateway",
              right: "Routing requests, authentication, and rate limiting",
            },
            {
              id: "p2",
              left: "Post Service",
              right: "Creating posts and storing metadata in the database",
            },
            {
              id: "p3",
              left: "S3 Blob Store",
              right: "Storing actual photo and video binary data",
            },
            {
              id: "p4",
              left: "Follow Service",
              right: "Managing unidirectional follow relationships",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match feed generation approaches to their primary weakness",
      type: "question",
      sectionId: "sec_q_feed_generation",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each feed generation approach to its primary weakness at Instagram scale:",
        explanation:
          "Fan-out on read suffers from read amplification (thousands of DB queries per feed request). Simple caching treats the symptom but doesn't solve the fan-out aggregation problem. Fan-out on write has write amplification where celebrity posts trigger millions of Redis writes. The hybrid approach introduces operational complexity of maintaining two parallel systems.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Fan-out on Read",
              right: "Read amplification — 1,000+ DB queries per feed refresh",
            },
            {
              id: "p2",
              left: "Simple Caching",
              right:
                "Treats the symptom — cache still needs expensive fan-out aggregation to populate",
            },
            {
              id: "p3",
              left: "Fan-out on Write",
              right: "Write amplification — celebrity posts trigger millions of Redis writes",
            },
            {
              id: "p4",
              left: "Hybrid Approach",
              right: "Dual-system operational complexity and inconsistent user latency",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match media delivery approaches to their limitations",
      type: "question",
      sectionId: "sec_q_media",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each media delivery approach to its specific limitation that the next approach solves:",
        explanation:
          "Direct S3 has high latency for geographically distant users. Basic CDN solves latency but serves the same file to all devices regardless of screen size or bandwidth. CDN with optimization generates variants but increases storage costs and pipeline complexity. The limitation of each approach motivates the next improvement.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Direct S3 Serving",
              right: "Multi-second latency for users far from the S3 region",
            },
            {
              id: "p2",
              left: "CDN without optimization",
              right:
                "Same high-resolution file served to all devices regardless of bandwidth or screen size",
            },
            {
              id: "p3",
              left: "CDN with dynamic optimization",
              right:
                "Multiple media variants increase storage costs 3-5x and add processing pipeline complexity",
            },
            {
              id: "p4",
              left: "All approaches",
              right:
                "Viral content causes cold-cache latency spikes without proactive cache warming",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Instagram DAU and posts per day",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Instagram's system design targets _____ million daily active users with _____ million posts per day.",
        explanation:
          "The standard Instagram system design interview assumes 500M DAU and 100M posts per day. These numbers drive all capacity estimation and architectural decisions.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Instagram's system design targets {{blank1}} million daily active users with {{blank2}} million posts per day.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "500",
              acceptableAnswers: ["500", "500M", "five hundred"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "100",
              acceptableAnswers: ["100", "100M", "one hundred"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Feed latency requirement",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Instagram's non-functional requirements specify feed delivery with less than _____ ms end-to-end response time, while accepting _____ consistency with up to 2 minutes of delay.",
        explanation:
          "The target is < 500ms for feed delivery. The system accepts eventual consistency (up to 2 minutes) — prioritizing availability over strict consistency. These two requirements together justify the precomputed feed approach with Redis.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Instagram's non-functional requirements specify feed delivery with less than {{blank1}} ms end-to-end response time, while accepting {{blank2}} consistency with up to 2 minutes of delay.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "500",
              acceptableAnswers: ["500", "500ms"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "eventual",
              acceptableAnswers: ["eventual", "eventual consistency"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Fan-out on write celebrity threshold",
      type: "question",
      sectionId: "sec_q_hybrid_feed",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "In the hybrid feed approach, users with fewer than _____ followers use fan-out on _____, while users above this threshold use fan-out on _____.",
        explanation:
          "The typical threshold is 100,000 followers. Below this, fan-out on write (precompute feeds). Above this, fan-out on read (query at read time). This hybrid balances write amplification concerns with read performance for the majority of users.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "In the hybrid feed approach, users with fewer than {{blank1}} followers use fan-out on {{blank2}}, while users above this threshold use fan-out on {{blank3}}.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "100,000",
              acceptableAnswers: ["100,000", "100000", "100K", "100k"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "write",
              acceptableAnswers: ["write", "fan-out on write"],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "read",
              acceptableAnswers: ["read", "fan-out on read"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Daily media storage calculation",
      type: "question",
      sectionId: "sec_q_storage_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "Instagram receives 100 million posts per day with an average media size of 2MB. How much new media storage (in terabytes) is needed per day?",
        explanation:
          "100,000,000 posts × 2MB = 200,000,000 MB = 200,000 GB = 200 TB per day. This is raw media storage before accounting for media variants (which would multiply by 3-5x for different resolutions and formats).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 200,
          tolerance: 10,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Redis memory for feed cache estimation",
      type: "question",
      sectionId: "sec_q_storage_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "Each user's precomputed feed stores the last 1,000 postIds. Each postId is 16 bytes. With 500 million users, how much Redis memory (in terabytes) is needed just for feed ZSETs? (1 TB = 10^12 bytes. Ignore Redis overhead.)",
        explanation:
          "500,000,000 users × 1,000 postIds × 16 bytes = 8,000,000,000,000 bytes = 8 TB. In practice, Redis ZSET overhead (score storage, skip list pointers) roughly doubles this to ~16TB, requiring a large Redis cluster distributed across many nodes.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 8,
          tolerance: 1,
        },
      },
    },
  ],
};
