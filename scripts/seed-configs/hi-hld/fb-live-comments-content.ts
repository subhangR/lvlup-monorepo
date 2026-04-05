import { StoryPointSeed, ItemSeed } from "../subhang-content";

// ── FB Live Comments — HLD Story Point ──

export const fbLiveCommentsContent: StoryPointSeed = {
  title: "Facebook Live Comments — Real-Time Comment System Design",
  description:
    "Design a real-time comment system for Facebook Live that supports posting, broadcasting, and viewing comments on live video feeds. Covers SSE vs WebSockets, pub/sub coordination, mega-stream scaling with CDN snapshots, and client reconnection strategies.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_protocols", title: "Real-Time Protocols & API Design", orderIndex: 1 },
    { id: "sec_q_data_model", title: "Data Modeling & Pagination", orderIndex: 2 },
    { id: "sec_q_scaling", title: "Horizontal Scaling & Server Coordination", orderIndex: 3 },
    { id: "sec_q_mega_streams", title: "Mega-Streams & CDN Delivery", orderIndex: 4 },
    { id: "sec_q_reliability", title: "Reliability, Failure Modes & Tradeoffs", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIAL 1: Problem Understanding & High-Level Design
    // ═══════════════════════════════════════════════════════
    {
      title: "FB Live Comments — Problem Understanding & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "FB Live Comments — Problem Understanding & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What are Facebook Live Comments?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Facebook Live Comments is a feature that enables viewers to post comments on a live video feed. Viewers see a continuous stream of comments in near-real-time. This is a classic real-time system design problem that tests your understanding of push-based architectures, pub/sub systems, and scaling strategies for high-fanout workloads.",
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
                  "Viewers can post comments on a Live video feed",
                  "Viewers can see new comments being posted while watching the live video",
                  "Viewers can see comments made before they joined the live feed (historical comments)",
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
                  "Scale to support millions of concurrent videos and thousands of comments per second per live video",
                  "Prioritize availability over consistency — eventual consistency is acceptable",
                  "Low latency: broadcast comments in near-real-time (< 200ms end-to-end under typical conditions)",
                ],
              },
            },
            {
              id: "b7",
              type: "quote",
              content:
                "Humans generally perceive interactions as real-time if they occur within 200 milliseconds. Any delay shorter than 200ms in a user interface is typically perceived as instantaneous — this is the target latency for real-time systems.",
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
                  "User — a viewer or broadcaster",
                  "Live Video — the video being broadcasted (owned by a different team but integrated with)",
                  "Comment — the message posted by a user on a live video",
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
              content: `// Post a comment on a live video
POST /comments/:liveVideoId
Header: JWT | SessionToken
Body: { "message": "Cool video!" }

// Fetch historical comments with cursor pagination
GET /comments/:liveVideoId?cursor={last_comment_id}&pageSize=10&sort=desc

// SSE stream for real-time comments
GET /comments/:liveVideoId/stream
→ Server-Sent Events connection`,
              metadata: { language: "text" },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "Note that userId is extracted from the JWT/session token in the request header, not passed in the body. This prevents users from impersonating others. The cursor pagination endpoint uses the last comment ID as cursor, providing stable pagination even as new comments are added.",
            },
            {
              id: "b13",
              type: "heading",
              content: "High-Level Comment Posting Flow",
              metadata: { level: 2 },
            },
            {
              id: "b14",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "User drafts a comment from their device (commenter client)",
                  "Client sends comment to the Comment Management Service via POST /comments/:liveVideoId",
                  "Comment Management Service validates the request and stores the comment in DynamoDB",
                  "Comment is then distributed to viewers via the real-time delivery mechanism",
                ],
              },
            },
            {
              id: "b15",
              type: "heading",
              content: "Why DynamoDB for Comments?",
              metadata: { level: 3 },
            },
            {
              id: "b16",
              type: "paragraph",
              content:
                "DynamoDB is a good fit because comments are simple key-value entities without complex relationships. The schema uses videoId as the partition key (ensuring all comments for a video are co-located) and commentId as the sort key (enabling ordered retrieval). The ScanIndexForward: false flag retrieves newest comments first for cursor pagination.",
            },
            {
              id: "b17",
              type: "heading",
              content: "Pagination: Offset vs Cursor",
              metadata: { level: 2 },
            },
            {
              id: "b18",
              type: "paragraph",
              content:
                "Offset pagination (offset=0&pageSize=10) is simple but breaks in fast-moving feeds — the database must scan all preceding rows, and new comments shift offsets causing duplicates or gaps. Cursor pagination (cursor={last_comment_id}&pageSize=10) is stable: it uses a unique identifier to mark position, performs consistently regardless of volume, and works naturally with DynamoDB's key-based queries.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // MATERIAL 2: Deep Dives — Real-Time Delivery & Scaling
    // ═══════════════════════════════════════════════════════
    {
      title: "FB Live Comments — Deep Dives: Real-Time Delivery & Scaling",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "FB Live Comments — Deep Dives: Real-Time Delivery & Scaling",
          blocks: [
            {
              id: "dd1",
              type: "heading",
              content: "Deep Dive 1: Real-Time Comment Broadcasting",
              metadata: { level: 2 },
            },
            {
              id: "dd2",
              type: "heading",
              content: "Why Polling Fails",
              metadata: { level: 3 },
            },
            {
              id: "dd3",
              type: "paragraph",
              content:
                "The naive approach is polling: clients request GET /comments/:liveVideoId?since={last_comment_id} every few seconds. This doesn't scale because (1) most polls return empty results (wasting resources), (2) the database is hammered with repeated queries, and (3) achieving sub-200ms latency requires polling every few milliseconds — completely infeasible.",
            },
            {
              id: "dd4",
              type: "heading",
              content: "WebSockets vs Server-Sent Events (SSE)",
              metadata: { level: 3 },
            },
            {
              id: "dd5",
              type: "paragraph",
              content:
                "WebSockets provide bidirectional communication but have higher overhead for maintaining connections. For live comments, the read/write ratio is heavily imbalanced — most viewers never post a comment but read all of them. SSE is the better choice: it's a unidirectional, persistent HTTP connection where the server pushes data to clients. Comment creation (infrequent writes) uses standard HTTP POST, while the frequent reads benefit from SSE's efficient one-way streaming.",
            },
            {
              id: "dd6",
              type: "quote",
              content:
                "SSE operates over standard HTTP, making it simpler to implement than WebSockets. However, some proxies and load balancers lack streaming support, browsers limit concurrent SSE connections per domain, and long-lived connections complicate monitoring.",
            },
            {
              id: "dd7",
              type: "heading",
              content: "Deep Dive 2: Scaling to Millions of Concurrent Viewers",
              metadata: { level: 2 },
            },
            {
              id: "dd8",
              type: "heading",
              content: "The Horizontal Scaling Challenge",
              metadata: { level: 3 },
            },
            {
              id: "dd9",
              type: "paragraph",
              content:
                "A single server handles ~100K concurrent SSE connections. For millions of viewers, we must scale horizontally. The core challenge: viewers of the same video end up on different servers. When a comment is posted to Server 1, how does Server 2 learn about it to notify its connected viewers? This is the coordination problem.",
            },
            {
              id: "dd10",
              type: "heading",
              content: "Solution 1: Naive Pub/Sub (Every Server Processes Everything)",
              metadata: { level: 3 },
            },
            {
              id: "dd11",
              type: "paragraph",
              content:
                "Separate read and write traffic by creating dedicated Realtime Messaging Servers (RMS). When a comment is created, the Comment Management Service publishes to a pub/sub channel. All RMS instances subscribe and forward to their connected viewers. Problem: every server processes every comment across all videos, even if none of its viewers are watching that video — wasteful at scale.",
            },
            {
              id: "dd12",
              type: "heading",
              content: "Solution 2: Partitioned Pub/Sub with Viewer Co-location",
              metadata: { level: 3 },
            },
            {
              id: "dd13",
              type: "paragraph",
              content:
                "Partition the comment stream into channels using hash(liveVideoId) % N. Each RMS subscribes only to channels it needs. Use a Layer 7 load balancer with consistent hashing on liveVideoId to route viewers of the same video to the same server. This minimizes channel subscriptions per server. NGINX or Envoy can inspect request paths/headers for intelligent routing.",
            },
            {
              id: "dd14",
              type: "heading",
              content: "Solution 3: Dispatcher Service",
              metadata: { level: 3 },
            },
            {
              id: "dd15",
              type: "paragraph",
              content:
                "Instead of pub/sub, introduce a Dispatcher Service that maintains a dynamic map of which servers have viewers for which videos. When a new comment arrives, the Dispatcher routes it directly to the relevant RMS instances. This centralizes routing logic, eliminates subscription management, and enables sophisticated routing rules. Multiple Dispatcher instances run behind a load balancer, consulting shared coordination data (ZooKeeper or etcd).",
            },
            {
              id: "dd16",
              type: "heading",
              content: "Redis vs Kafka for Pub/Sub",
              metadata: { level: 3 },
            },
            {
              id: "dd17",
              type: "paragraph",
              content:
                "Kafka is highly scalable and fault-tolerant but struggles with dynamic subscription patterns (users switching videos). Redis pub/sub provides low latency and handles dynamic subscriptions well. The fire-and-forget nature of Redis pub/sub is acceptable here because comments are persisted to the database — missed comments during brief disconnects are recovered via the catch-up mechanism.",
            },
            {
              id: "dd18",
              type: "heading",
              content: "Deep Dive 3: Mega-Streams (Viral Videos)",
              metadata: { level: 2 },
            },
            {
              id: "dd19",
              type: "paragraph",
              content:
                'When the World Cup final goes live with hundreds of millions of viewers and thousands of comments per second, traditional real-time goals break down. At 5,000 comments/second, each message is visible for ~4 milliseconds — no human can read that. Users experience a "vibe" of collective participation, not a conversation.',
            },
            {
              id: "dd20",
              type: "heading",
              content: "Sampling Strategy",
              metadata: { level: 3 },
            },
            {
              id: "dd21",
              type: "paragraph",
              content:
                "Sample the comment stream with an adaptive rate: 50% at 100 comments/sec, 1-2% at 5,000/sec. Prioritize comments from followed users, verified accounts, or comments with reactions. Each viewer receives a consistent, readable number of comments regardless of actual velocity.",
            },
            {
              id: "dd22",
              type: "heading",
              content: "CDN-Based Delivery with Periodic Snapshots",
              metadata: { level: 3 },
            },
            {
              id: "dd23",
              type: "paragraph",
              content:
                "The most elegant mega-stream solution: maintain a ring buffer of recent 100-200 comments. Every second, snapshot the buffer and push to CDN edge locations. Clients poll the CDN (not the server) every second. The client smoothly animates incoming comments, spacing them by timestamp to simulate a continuous stream. This leverages existing CDN infrastructure — a comment snapshot is just another cacheable asset.",
            },
            {
              id: "dd24",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Tradeoff: 1-2 seconds of latency instead of sub-200ms — acceptable since users can't read individual comments at this rate anyway",
                  '"Read your own write" consistency: client optimistically inserts user\'s own comments immediately, independent of CDN polling',
                  "Hysteresis in threshold logic prevents flapping between SSE and CDN modes as viewership hovers around the cutoff",
                  "Dynamic threshold: auto-flip from SSE to CDN at >100K viewers or >500 comments/sec",
                ],
              },
            },
            {
              id: "dd25",
              type: "heading",
              content: "Deep Dive 4: Handling Client Disconnections",
              metadata: { level: 2 },
            },
            {
              id: "dd26",
              type: "paragraph",
              content:
                "Mobile networks are flaky — users background apps, walk through tunnels, switch WiFi/cellular. SSE has a built-in Last-Event-ID header: every pushed comment includes a unique event ID. On reconnect, the browser automatically sends the last received ID, and the server replays missed comments. The client also tracks the last comment ID in local storage for explicit HTTP catch-up: GET /comments/:liveVideoId?since={last_comment_id}&limit=100.",
            },
            {
              id: "dd27",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Bounded replay: only replay last 5 minutes to avoid overwhelming users after long disconnections",
                  "A shared Redis cache gives any server the ability to replay recent comments for any video",
                  "Client must deduplicate by comment ID when merging SSE stream with HTTP catch-up results",
                  "Mobile optimization: preemptively disconnect SSE on background, reconnect and catch up on foreground",
                ],
              },
            },
          ],
          readingTime: 18,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // MATERIAL 3: Interview Expectations & Tradeoff Summary
    // ═══════════════════════════════════════════════════════
    {
      title: "FB Live Comments — Interview Expectations by Level",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "FB Live Comments — Interview Expectations by Level",
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
                "80% breadth, 20% depth. Proactively realize polling limitations and reason toward a push-based model. Should arrive at a pub/sub solution with minor hints and be able to scale it with help from the interviewer.",
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
                "60% breadth, 40% depth. Speed through the initial HLD to spend time on scaling discussions. Independently arrive at pub/sub with SSE, proactively lead the scaling conversation, and reason through tradeoffs of different coordination approaches.",
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
                "40% breadth, 60% depth. Not only identify pub/sub + SSE but proactively call out limitations around reliability or scalability. Discuss exact technology choices (Redis vs Kafka) with tradeoff reasoning. Recognize that requirements change at extreme scale (mega-streams) and propose CDN-based delivery — this shows staff-level thinking.",
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
                  "Polling vs SSE vs WebSockets: SSE wins for high read/write ratio — simpler than WebSockets, vastly better than polling",
                  "Naive Pub/Sub vs Partitioned Pub/Sub: Partitioned + viewer co-location eliminates wasted processing of irrelevant comments",
                  "Pub/Sub vs Dispatcher: Dispatcher centralizes routing but adds operational complexity; pub/sub is simpler for most cases",
                  "Redis vs Kafka for pub/sub: Redis for low-latency dynamic subscriptions; Kafka for durability (unnecessary here since comments are persisted)",
                  "SSE vs CDN snapshots for mega-streams: CDN trades 1-2s latency for massive scale — acceptable when comments are unreadable at high velocity",
                  "Offset vs Cursor pagination: Cursor is stable, efficient, and DynamoDB-native — always preferred for fast-moving feeds",
                  "Availability vs Consistency: AP for live comments — eventual consistency is fine, downtime is not",
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS — 28 total
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — Easy
    {
      title: "Best real-time delivery mechanism for live comments",
      type: "question",
      sectionId: "sec_q_protocols",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "For a live video comments system where most viewers only read comments and rarely post, which real-time delivery mechanism is most appropriate?",
        explanation:
          "Server-Sent Events (SSE) is the best fit for live comments because the read/write ratio is heavily imbalanced — most viewers never post but consume all comments. SSE provides efficient one-way streaming over standard HTTP, with lower overhead than bidirectional WebSockets. The infrequent writes (comment creation) use standard HTTP POST.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Long polling with 30-second timeout", isCorrect: false },
            { id: "b", text: "WebSockets for bidirectional communication", isCorrect: false },
            { id: "c", text: "Short polling every 500ms", isCorrect: false },
            {
              id: "d",
              text: "Server-Sent Events (SSE) for unidirectional streaming",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 2 — Easy
    {
      title: "Why cursor pagination over offset for live comments",
      type: "question",
      sectionId: "sec_q_data_model",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is cursor-based pagination preferred over offset-based pagination for fetching historical comments in a live feed?",
        explanation:
          "In a fast-moving comment feed, offset pagination is unstable: new comments shift offsets, causing duplicates or gaps. The database must also scan all preceding rows for each query, degrading performance as volume grows. Cursor pagination uses a unique comment ID as a stable reference point — performance is consistent regardless of volume, and new comments don't affect the cursor's position.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Offset pagination cannot work with DynamoDB", isCorrect: false },
            {
              id: "b",
              text: "Cursor pagination requires fewer database indexes",
              isCorrect: false,
            },
            { id: "c", text: "Cursor pagination allows bidirectional traversal", isCorrect: false },
            {
              id: "d",
              text: "Offset pagination is unstable in fast-moving feeds — new items cause duplicates or gaps",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 3 — Easy
    {
      title: "DynamoDB schema design for comments",
      type: "question",
      sectionId: "sec_q_data_model",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In a DynamoDB table storing live video comments, what should be used as the partition key and sort key?",
        explanation:
          "Using videoId as the partition key ensures all comments for a video are co-located on the same partition, enabling efficient range queries. The commentId as sort key provides ordering and uniqueness. This avoids the scatter-gather anti-pattern where comments for one video are spread across partitions.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "userId as partition key, createdAt as sort key", isCorrect: false },
            { id: "b", text: "commentId as partition key, videoId as sort key", isCorrect: false },
            {
              id: "c",
              text: "commentId as partition key, createdAt as sort key",
              isCorrect: false,
            },
            { id: "d", text: "videoId as partition key, commentId as sort key", isCorrect: true },
          ],
        },
      },
    },

    // MCQ 4 — Medium
    {
      title: "Naive pub/sub limitation at scale",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In a naive pub/sub architecture where all Realtime Messaging Servers subscribe to a single channel, what is the primary scaling problem?",
        explanation:
          "With naive pub/sub, every server processes every comment across all live videos, even if none of its connected viewers are watching that particular video. This means if there are 1 million concurrent videos, each server must process comments for all of them — an enormous waste of CPU and bandwidth that becomes impractical at Facebook scale.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Every server processes every comment from every video, even irrelevant ones",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The pub/sub broker becomes a single point of failure",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Comments are delivered in non-deterministic order",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The database is queried for every comment delivery",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — Medium
    {
      title: "Viewer co-location via Layer 7 load balancing",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In the partitioned pub/sub approach, why is a Layer 7 (application-layer) load balancer used with consistent hashing on liveVideoId instead of round-robin?",
        explanation:
          "Round-robin distributes viewers randomly, so a single server may have viewers watching many different videos, forcing it to subscribe to many pub/sub channels — replicating the inefficiency of naive pub/sub. Consistent hashing on liveVideoId ensures viewers of the same video are routed to the same server, minimizing the number of channels each server must subscribe to.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "Layer 7 is required to terminate SSL connections", isCorrect: false },
            {
              id: "b",
              text: "Consistent hashing co-locates viewers of the same video, minimizing channel subscriptions per server",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Round-robin cannot distribute SSE connections evenly",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Layer 7 load balancers have lower latency than Layer 4",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — Medium
    {
      title: "Redis vs Kafka for live comment pub/sub",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "For the pub/sub layer in a live comments system, why is Redis pub/sub often preferred over Kafka?",
        explanation:
          "Live comments require dynamic subscriptions — viewers constantly join and leave videos. Kafka excels at durable, ordered message streaming but struggles with highly dynamic subscription patterns. Redis pub/sub provides low-latency delivery with easy dynamic topic management. The fire-and-forget nature of Redis is acceptable because comments are already persisted to the database; missed messages during disconnections are recovered via the catch-up mechanism.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Redis handles dynamic subscriptions better and has lower latency; durability is unnecessary since comments are already persisted",
              isCorrect: true,
            },
            { id: "b", text: "Kafka cannot support more than 10,000 topics", isCorrect: false },
            { id: "c", text: "Redis pub/sub guarantees exactly-once delivery", isCorrect: false },
            {
              id: "d",
              text: "Redis provides stronger message ordering guarantees",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — Hard
    {
      title: "CDN snapshot delivery for mega-streams",
      type: "question",
      sectionId: "sec_q_mega_streams",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "For a viral live video with millions of viewers and 5,000 comments/second, the system switches from SSE to CDN-based delivery. What is the key architectural insight that makes this approach work?",
        explanation:
          'At extreme scale, the requirements fundamentally change. With 5,000 comments/second, each comment is visible for ~4ms — no human can read individual messages. Users experience a "vibe" of collective participation. Since individual comment delivery no longer matters, we can batch comments into periodic snapshots served via CDN — infrastructure specifically designed to serve identical content to millions of users simultaneously.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "At extreme comment velocity, users can't read individual comments, so batched snapshots with 1-2s delay are acceptable",
              isCorrect: true,
            },
            {
              id: "b",
              text: "CDN snapshots eliminate the need for a database entirely",
              isCorrect: false,
            },
            {
              id: "c",
              text: "CDN-based delivery provides exactly-once semantics that SSE cannot",
              isCorrect: false,
            },
            {
              id: "d",
              text: "CDN edge servers can maintain more SSE connections than application servers",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — Hard
    {
      title: "Dispatcher service vs partitioned pub/sub tradeoffs",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A Dispatcher Service routes comments directly to Realtime Messaging Servers instead of using pub/sub. What is the most significant operational challenge of this approach?",
        explanation:
          "The Dispatcher must maintain an accurate, real-time mapping of which servers have viewers for which videos. During rapid changes (a viral stream causing a sudden viewer influx), this mapping can become stale. Multiple Dispatcher instances need coordinated cache invalidation via ZooKeeper or etcd, and the mapping must be refreshed frequently — adding operational complexity that pub/sub avoids by decoupling producers from consumers.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The Dispatcher requires each comment to be stored in a separate database",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The Dispatcher cannot handle more than one live video at a time",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Keeping the Dispatcher's server-to-video mapping accurate during rapid viewer changes and across multiple instances",
              isCorrect: true,
            },
            {
              id: "d",
              text: "The Dispatcher introduces higher message delivery latency than pub/sub",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — Easy
    {
      title: "Advantages of SSE over WebSockets for live comments",
      type: "question",
      sectionId: "sec_q_protocols",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are valid advantages of Server-Sent Events (SSE) over WebSockets for a live comment streaming system? Select ALL that apply.",
        explanation:
          "SSE operates over standard HTTP (compatible with existing infrastructure), has lower connection overhead since it's unidirectional, and matches the natural read-heavy pattern of live comments. SSE does NOT provide lower latency than WebSockets (both are similar for server→client), and SSE does NOT support bidirectional communication — that's WebSockets.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "SSE matches the read-heavy traffic pattern where most viewers never post",
              isCorrect: true,
            },
            {
              id: "b",
              text: "SSE supports bidirectional communication for chat-like features",
              isCorrect: false,
            },
            {
              id: "c",
              text: "SSE has lower connection overhead for one-way server-to-client streaming",
              isCorrect: true,
            },
            {
              id: "d",
              text: "SSE provides lower latency than WebSockets for all message types",
              isCorrect: false,
            },
            {
              id: "e",
              text: "SSE operates over standard HTTP, compatible with existing infrastructure",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 2 — Medium
    {
      title: "Strategies for handling mega-stream comment delivery",
      type: "question",
      sectionId: "sec_q_mega_streams",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "When a live video goes viral with millions of viewers and thousands of comments per second, which strategies help manage the load? Select ALL that apply.",
        explanation:
          "Adaptive sampling reduces server-side processing. CDN snapshots leverage existing infrastructure for massive fanout. Prioritizing followed users' comments improves UX within the sampling budget. Increasing SSE polling frequency is the opposite of what you want — SSE is push-based, not polling-based, and more frequent delivery would increase load.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Switching all viewers to WebSockets for better throughput",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Increasing SSE polling frequency to keep up with comment volume",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Adaptive comment sampling — reduce sample rate as velocity increases",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Prioritizing comments from followed users or verified accounts",
              isCorrect: true,
            },
            {
              id: "e",
              text: "CDN-based periodic snapshots replacing SSE connections",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — Medium
    {
      title: "Client disconnection recovery mechanisms",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Which mechanisms help a live comments client recover gracefully after a network disconnection? Select ALL that apply.",
        explanation:
          "SSE's Last-Event-ID header enables automatic server-side replay. Client-side tracking in local storage enables explicit HTTP catch-up. A shared Redis cache ensures any server can replay comments regardless of which server the client reconnects to. Bounded replay (last 5 minutes) prevents overwhelming users after long disconnections. Re-establishing a fresh SSE connection without catching up loses all comments from the disconnection period.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Re-establishing a fresh SSE connection without any catch-up",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Bounded replay (last 5 minutes) to prevent information overload",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Client-side tracking of last comment ID in local storage",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Shared Redis cache for cross-server comment replay",
              isCorrect: true,
            },
            {
              id: "e",
              text: "SSE Last-Event-ID header for automatic reconnection and replay",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — Hard
    {
      title: "Challenges with SSE at scale",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are genuine infrastructure challenges when deploying SSE at scale for live comments? Select ALL that apply.",
        explanation:
          "All of these are real SSE challenges: some proxies/load balancers buffer streaming responses causing latency issues; browsers limit concurrent SSE connections per domain (typically 6 in HTTP/1.1); long-lived connections complicate monitoring and debugging; and file descriptor limits on servers constrain concurrent connections. SSE does NOT increase database write load — it's a delivery mechanism, not a storage mechanism.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Some proxies and load balancers buffer streaming responses, causing latency issues",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Browser limits on concurrent SSE connections per domain",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Server file descriptor limits constrain concurrent connection count",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Long-lived connections complicate monitoring and debugging",
              isCorrect: true,
            },
            {
              id: "e",
              text: "SSE connections increase database write load proportionally",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — Medium
    {
      title: "Explain the evolution from polling to SSE",
      type: "question",
      sectionId: "sec_q_protocols",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain why polling is insufficient for real-time comment delivery in a live video system, and describe why SSE is a better choice than WebSockets for this specific use case. Include the key tradeoffs.",
        explanation:
          "A strong answer should cover: (1) Polling generates excessive empty requests, hammers the database, and cannot achieve sub-200ms latency without polling every few milliseconds — which is infeasible. (2) WebSockets provide bidirectional communication, but live comments have a heavily imbalanced read/write ratio — most viewers never post. The bidirectional channel is wasted overhead. (3) SSE matches the pattern perfectly: server-to-client streaming for reads, standard HTTP POST for infrequent writes. (4) Tradeoffs: SSE has browser connection limits per domain, some proxy compatibility issues, and doesn't support client-to-server messaging natively.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          minWords: 80,
          maxWords: 300,
        },
      },
    },

    // Paragraph 2 — Medium
    {
      title: "DynamoDB schema design for live comments",
      type: "question",
      sectionId: "sec_q_data_model",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Design a DynamoDB table schema for storing live video comments. Explain your choice of partition key and sort key, justify why this structure supports both real-time comment retrieval and historical pagination, and describe the cursor-based pagination query.",
        explanation:
          'A strong answer should include: (1) Table with videoId as partition key (co-locates all comments for a video) and commentId (timestamp-based, e.g., Snowflake ID) as sort key for ordered retrieval. (2) Additional attributes: content, userId, createdAt. (3) Partition key choice avoids scatter-gather — all comments for one video are on the same partition. (4) ScanIndexForward: false retrieves newest first. (5) Cursor pagination query: KeyConditionExpression "videoId = :vid AND commentId < :cursor" with Limit for page size. (6) This is stable (new comments don\'t shift cursor position) and efficient (direct key lookup, no row scanning).',
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          minWords: 100,
          maxWords: 400,
        },
      },
    },

    // Paragraph 3 — Hard
    {
      title: "Design the partitioned pub/sub scaling architecture",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You have millions of concurrent viewers watching thousands of live videos. Describe how you would architect the comment distribution system using partitioned pub/sub with viewer co-location. Include the role of the Layer 7 load balancer, how channels are partitioned, and what happens when a new comment is posted.",
        explanation:
          "A strong answer should cover: (1) Separate Comment Management Service (writes) from Realtime Messaging Servers (reads) for independent scaling. (2) Partition comments into N channels using hash(liveVideoId) % N — bounds channel count. (3) Layer 7 load balancer (NGINX/Envoy) inspects liveVideoId in request path and uses consistent hashing to route viewers of the same video to the same RMS. (4) Each RMS maintains a local in-memory mapping: {videoId → [sseConnections]}. (5) Each RMS subscribes only to the channels containing videos its viewers watch. (6) New comment flow: POST → Comment Management Service → persists to DB → publishes to channel hash(videoId) % N → relevant RMS instances receive → push to connected viewers via SSE. (7) Tradeoff: server composition changes require subscription updates.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          minWords: 120,
          maxWords: 500,
        },
      },
    },

    // Paragraph 4 — Hard
    {
      title: "CDN snapshot architecture for mega-streams",
      type: "question",
      sectionId: "sec_q_mega_streams",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A live video has 100 million concurrent viewers with 5,000 comments per second. Explain why the standard SSE + pub/sub architecture breaks down, describe the CDN snapshot approach, and discuss how the client achieves a smooth UX despite the polling-based delivery.",
        explanation:
          'A strong answer should address: (1) Why standard approaches fail: maintaining 100M SSE connections is infeasible even across thousands of servers; pub/sub channels become overwhelmed by fanout. (2) Fundamental insight: at 5,000 cps, each comment is visible for ~4ms — users experience collective "vibe," not conversation. Sub-200ms latency is no longer meaningful. (3) CDN architecture: ring buffer of 100-200 recent comments → snapshot every 1 second → push to CDN origin → CDN distributes to edge locations globally. (4) Client UX: polls CDN every second, receives batch, animates comments smoothly by spacing them according to timestamps to simulate continuous flow. (5) "Read your own write": client optimistically inserts user\'s own comments immediately. (6) Transition: dynamic threshold (>100K viewers or >500 cps) with hysteresis to prevent mode flapping.',
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          minWords: 150,
          maxWords: 600,
        },
      },
    },

    // Paragraph 5 — Hard
    {
      title: "Client reconnection and catch-up strategy",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A viewer watching a live stream has a 30-second network interruption on their mobile device. Describe the complete reconnection flow, including how the system detects the disconnection, catches up on missed comments, and merges the catch-up with the live stream without duplicates or gaps.",
        explanation:
          'A strong answer covers: (1) SSE connection drops detected by browser/client. (2) Browser auto-reconnects sending Last-Event-ID header. (3) Server replays missed comments (bounded to last 5 minutes). (4) If reconnected to a different RMS, the server uses a shared Redis cache to replay comments for that video. (5) Client also makes explicit HTTP catch-up: GET /comments/:liveVideoId?since={last_tracked_id}&limit=100. (6) Deduplication: client maintains a set of received comment IDs and filters duplicates when merging SSE stream with HTTP results. (7) Mobile optimization: preemptively close SSE on app background, record last ID in app storage, reconnect and catch up on foreground. (8) Graceful degradation: for disconnections > 5 minutes, show "You missed X comments" with option to jump to live.',
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          minWords: 120,
          maxWords: 500,
        },
      },
    },

    // Paragraph 6 — Hard
    {
      title: "Compare Dispatcher vs Pub/Sub for server coordination",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Compare the Dispatcher Service approach with the Partitioned Pub/Sub approach for coordinating comment delivery across multiple Realtime Messaging Servers. Discuss the architecture, operational complexity, failure modes, and when you would choose one over the other.",
        explanation:
          "A strong answer should contrast: (1) Pub/Sub: producers publish to channels, servers subscribe — decoupled, battle-tested, simpler operationally, fewer corner cases. Redis pub/sub or Kafka as broker. Challenge: managing dynamic subscriptions as viewer composition changes. (2) Dispatcher: maintains a dynamic map (video → servers), directly routes comments. Centralizes routing logic, enables sophisticated rules (load-based routing), but requires accurate real-time mapping via ZooKeeper/etcd. Multiple Dispatcher instances need coordinated cache invalidation. (3) Failure modes: pub/sub degrades gracefully (missed messages recovered via catch-up), Dispatcher mapping staleness causes misdirected messages. (4) Decision: pub/sub for most cases (simpler, fewer edge cases); Dispatcher when you need fine-grained routing control or already have coordination infrastructure. In an interview, reach for pub/sub first.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          minWords: 120,
          maxWords: 500,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — Medium
    {
      title: "Why not use commentId as DynamoDB partition key",
      type: "question",
      sectionId: "sec_q_data_model",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In a DynamoDB table for live comments, why would using commentId as the partition key (instead of videoId) be a poor design choice? Answer in 2-3 sentences.",
        explanation:
          "Using commentId as the partition key distributes comments for the same video across different partitions. This means fetching all comments for a video requires a scatter-gather query across all partitions — extremely inefficient and slow. By using videoId as the partition key, all comments for a video are co-located on the same partition, enabling efficient range queries with the sort key.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Text 2 — Medium
    {
      title: "TCP connection limit misconception",
      type: "question",
      sectionId: "sec_q_protocols",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "A common misconception is that a server can only handle 65,535 concurrent SSE connections. Explain why this is wrong and what actually determines the connection limit.",
        explanation:
          "65,535 refers to the port number range, not the connection limit. Each TCP connection is identified by a unique 4-tuple: (source IP, source port, destination IP, destination port). A single server port can accept connections from many different source IP/port combinations. The actual limits are system resources: CPU, memory, file descriptors, and kernel tuning. With proper OS configuration, a single server can handle hundreds of thousands of concurrent connections.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Text 3 — Hard
    {
      title: "Hysteresis in SSE-to-CDN transition",
      type: "question",
      sectionId: "sec_q_mega_streams",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "When transitioning between SSE and CDN delivery modes based on viewership thresholds, why is hysteresis needed? What problem does it solve?",
        explanation:
          'Without hysteresis, if the threshold is 100K viewers, a stream hovering around 99K-101K would rapidly flip between SSE and CDN modes — a phenomenon called "flapping." Each transition disrupts the viewing experience (SSE connections torn down, CDN polling starts, then immediately reversed). Hysteresis uses different thresholds for activation (e.g., switch to CDN at 100K) and deactivation (switch back to SSE at 80K), creating a dead zone that prevents rapid oscillation.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Text 4 — Hard
    {
      title: "Read-your-own-write in CDN mode",
      type: "question",
      sectionId: "sec_q_mega_streams",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'In CDN snapshot mode, how does the client ensure "read your own write" consistency when a user posts a comment?',
        explanation:
          "When a user posts a comment, the client optimistically inserts it into the local comment feed immediately, without waiting for it to appear in the next CDN snapshot. This gives the user instant feedback that their comment was posted. The comment will eventually appear in a CDN snapshot too, so the client must deduplicate by comment ID to avoid showing the same comment twice.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — Easy
    {
      title: "Match scaling approaches to their descriptions",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each scaling approach to its correct description.",
        explanation:
          "Naive Pub/Sub broadcasts everything to all servers (wasteful). Partitioned Pub/Sub with co-location uses consistent hashing to minimize subscriptions. The Dispatcher Service centralizes routing and directly delivers to relevant servers. CDN Snapshots batch comments for mega-streams, trading latency for massive fan-out.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          leftItems: [
            { id: "l1", text: "Naive Pub/Sub" },
            { id: "l2", text: "Partitioned Pub/Sub + Co-location" },
            { id: "l3", text: "Dispatcher Service" },
            { id: "l4", text: "CDN Snapshots" },
          ],
          rightItems: [
            {
              id: "r1",
              text: "Centralizes routing logic and directly forwards comments to relevant servers",
            },
            { id: "r2", text: "Every server processes every comment from all videos" },
            {
              id: "r3",
              text: "Uses consistent hashing to minimize channel subscriptions per server",
            },
            {
              id: "r4",
              text: "Batches comments into periodic snapshots served from edge locations",
            },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r2" },
            { leftId: "l2", rightId: "r3" },
            { leftId: "l3", rightId: "r1" },
            { leftId: "l4", rightId: "r4" },
          ],
        },
      },
    },

    // Matching 2 — Medium
    {
      title: "Match real-time technologies to their characteristics",
      type: "question",
      sectionId: "sec_q_protocols",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each real-time communication technology to its key characteristic in the context of live comments.",
        explanation:
          "Short Polling wastes resources with empty requests. Long Polling holds connections but still has reconnection overhead. WebSockets provide full-duplex but are overkill for read-heavy patterns. SSE provides efficient unidirectional streaming that matches the imbalanced read/write ratio of live comments.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          leftItems: [
            { id: "l1", text: "Short Polling" },
            { id: "l2", text: "Long Polling" },
            { id: "l3", text: "WebSockets" },
            { id: "l4", text: "SSE" },
          ],
          rightItems: [
            { id: "r1", text: "Bidirectional channel — overkill for read-heavy patterns" },
            {
              id: "r2",
              text: "Most requests return empty — wastes database and network resources",
            },
            { id: "r3", text: "Efficient unidirectional streaming matching read-heavy traffic" },
            {
              id: "r4",
              text: "Holds connection until data available, but reconnection overhead per response",
            },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r2" },
            { leftId: "l2", rightId: "r4" },
            { leftId: "l3", rightId: "r1" },
            { leftId: "l4", rightId: "r3" },
          ],
        },
      },
    },

    // Matching 3 — Hard
    {
      title: "Match mega-stream problems to solutions",
      type: "question",
      sectionId: "sec_q_mega_streams",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each mega-stream challenge to the appropriate solution or mitigation.",
        explanation:
          "Comments too fast to read → sample subset with adaptive rate. Millions of SSE connections → CDN serves cacheable snapshots. Mode flapping at threshold → hysteresis with different up/down thresholds. User doesn't see own comment in CDN mode → optimistic local insertion.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          leftItems: [
            { id: "l1", text: "Comments flow faster than humans can read" },
            { id: "l2", text: "Millions of concurrent SSE connections overwhelm servers" },
            { id: "l3", text: "Rapid flapping between SSE and CDN modes" },
            { id: "l4", text: "User posts comment but doesn't see it in CDN snapshot for 1-2s" },
          ],
          rightItems: [
            {
              id: "r1",
              text: "Optimistic local insertion — add user's comment to feed immediately",
            },
            { id: "r2", text: "Adaptive sampling — deliver representative subset of comments" },
            { id: "r3", text: "Hysteresis — use different thresholds for up/down transitions" },
            { id: "r4", text: "CDN periodic snapshots — leverage edge caching for massive fanout" },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r2" },
            { leftId: "l2", rightId: "r4" },
            { leftId: "l3", rightId: "r3" },
            { leftId: "l4", rightId: "r1" },
          ],
        },
      },
    },

    // ── Fill-Blanks (3 questions) ──

    // Fill-Blanks 1 — Easy
    {
      title: "SSE connection model",
      type: "question",
      sectionId: "sec_q_protocols",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Server-Sent Events (SSE) use a _____ HTTP connection where the _____ pushes data to the _____ in a one-way stream.",
        explanation:
          "SSE establishes a persistent HTTP connection. Unlike WebSockets, it is unidirectional — the server pushes events to the client. The client receives data passively and uses standard HTTP requests (e.g., POST) for any client-to-server communication.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            {
              id: "blank1",
              correctAnswer: "persistent",
              acceptableAnswers: ["persistent", "long-lived", "long lived"],
            },
            { id: "blank2", correctAnswer: "server", acceptableAnswers: ["server"] },
            { id: "blank3", correctAnswer: "client", acceptableAnswers: ["client"] },
          ],
        },
      },
    },

    // Fill-Blanks 2 — Easy
    {
      title: "Cursor pagination mechanism",
      type: "question",
      sectionId: "sec_q_data_model",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Cursor-based pagination uses a unique _____ to mark position in the result set, making it _____ even when new items are added to the feed, unlike _____ pagination which shifts with insertions.",
        explanation:
          "Cursor pagination uses a unique identifier (such as a comment ID) as a stable reference point. New insertions don't affect cursor position, making it stable. Offset pagination shifts with every insertion, causing duplicates or gaps.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            {
              id: "blank1",
              correctAnswer: "identifier",
              acceptableAnswers: ["identifier", "ID", "id", "comment ID", "cursor"],
            },
            {
              id: "blank2",
              correctAnswer: "stable",
              acceptableAnswers: ["stable", "consistent", "reliable"],
            },
            {
              id: "blank3",
              correctAnswer: "offset",
              acceptableAnswers: ["offset", "offset-based"],
            },
          ],
        },
      },
    },

    // Fill-Blanks 3 — Medium
    {
      title: "Partitioned pub/sub channel assignment",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "In partitioned pub/sub, comments are assigned to channels using _____(liveVideoId) % N, and viewers are co-located on the same server using _____ hashing at the _____ load balancer.",
        explanation:
          "A hash function maps videoIds to a fixed number of channels. Consistent hashing at the Layer 7 (application-layer) load balancer routes viewers of the same video to the same Realtime Messaging Server, minimizing the number of channels each server subscribes to.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            { id: "blank1", correctAnswer: "hash", acceptableAnswers: ["hash", "hash function"] },
            { id: "blank2", correctAnswer: "consistent", acceptableAnswers: ["consistent"] },
            {
              id: "blank3",
              correctAnswer: "Layer 7",
              acceptableAnswers: [
                "Layer 7",
                "L7",
                "layer 7",
                "application-layer",
                "application layer",
              ],
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — Medium
    {
      title: "Estimate Realtime Messaging Server count",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "A popular live event has 10 million concurrent viewers watching 5,000 different live videos. Each Realtime Messaging Server can handle 100,000 concurrent SSE connections. Assuming even distribution, how many RMS instances are needed at minimum?",
        explanation:
          "10,000,000 viewers ÷ 100,000 connections per server = 100 servers minimum. In practice, you would add a safety margin (e.g., 120-150 servers) to handle uneven distribution, but the mathematical minimum is 100.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 100,
          tolerance: 5,
          unit: "servers",
        },
      },
    },

    // Numerical 2 — Hard
    {
      title: "Comment visibility duration at mega-stream scale",
      type: "question",
      sectionId: "sec_q_mega_streams",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A mega-stream has 5,000 comments per second. The client displays the 20 most recent comments on screen. On average, how many milliseconds is each comment visible before being pushed off screen? (Round to the nearest millisecond.)",
        explanation:
          'With 20 slots and 5,000 comments/second, each slot turns over at 5,000/20 = 250 times per second. So each comment is visible for 1,000ms / 250 = 4 milliseconds. This demonstrates why at mega-stream scale, users experience "vibe" rather than reading individual comments — making CDN-based delivery with 1-2s latency perfectly acceptable.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 4,
          tolerance: 1,
          unit: "ms",
        },
      },
    },
  ],
};
