/**
 * Facebook News Feed — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: fan-out on read vs write, precomputed feeds, async workers,
 * hybrid feed generation, caching strategies, hot key mitigation, DynamoDB design
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const fbNewsFeedContent: StoryPointSeed = {
  title: "Design Facebook News Feed",
  description:
    "Master the system design of a social media news feed — covering fan-out strategies, precomputed feeds, async workers, hybrid feed generation, caching with hot key mitigation, and scaling to 2B users.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements & API Design", orderIndex: 1 },
    { id: "sec_q_data_modeling", title: "Data Modeling & DynamoDB Design", orderIndex: 2 },
    { id: "sec_q_fanout", title: "Fan-out Strategies & Hybrid Feeds", orderIndex: 3 },
    { id: "sec_q_caching", title: "Caching & Hot Key Mitigation", orderIndex: 4 },
    { id: "sec_q_scaling", title: "Scaling & Capacity Estimation", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Design
    {
      title: "News Feed — Requirements & High-Level Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "News Feed — Requirements & High-Level Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Facebook's News Feed?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                'Facebook pioneered the News Feed — a product that shows recent stories from users in your social graph. This is a classic system design problem dealing with fan-out and data management at massive scale. We model uni-directional "follow" relationships (like Twitter) rather than bi-directional "friend" relationships.',
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
                  "Users should be able to create posts.",
                  "Users should be able to follow other users.",
                  "Users should be able to view a feed of posts from people they follow, in reverse chronological order (newest first).",
                  "Users should be able to page through their feed (infinite scroll).",
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
                  "Highly available — prioritize availability over consistency.",
                  "Eventual consistency tolerated: up to 1 minute of post staleness.",
                  "Posting and viewing the feed should return in < 500ms.",
                  "Scale to 2 billion users.",
                  "Users can follow an unlimited number of users and be followed by an unlimited number of users.",
                ],
              },
            },
            {
              id: "b7",
              type: "quote",
              content:
                "\"Having quantities on your non-functional requirements will help you make decisions during your design. A system which is single-digit millisecond fast requires a dramatically different architecture than a 'fast' system which can take a second to respond.\"",
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
                  "User: A user in the system.",
                  "Follow: A uni-directional link between users. Stored in a table with userFollowing as partition key and userFollowed as sort key.",
                  "Post: Content created by a user, shown in the feed of their followers.",
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
                '// Create a post\nPOST /posts\n{ "content": { } }\n→ 200 OK { "postId": "..." }\n\n// Follow a user (idempotent PUT)\nPUT /users/[id]/follow\n{ }\n→ 200 OK\n\n// View feed with cursor-based pagination\nGET /feed?pageSize={size}&cursor={timestamp}\n→ { items: Post[], nextCursor: string }',
              metadata: { language: "text" },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "The cursor is a timestamp representing the oldest post the user has seen. Each page returns N posts older than that timestamp. Since we sort in reverse chronological order, this gives us efficient pagination without offset-based queries.",
            },
            {
              id: "b13",
              type: "heading",
              content: "High-Level Design — Naive Approach",
              metadata: { level: 2 },
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                "The Post Service sits behind an API gateway/load balancer. It is stateless — it only writes to the database — so it scales horizontally by adding more hosts. For the database, DynamoDB provides high throughput with even partition distribution.",
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "The Follow Service manages a DynamoDB table keyed by (userFollowing, userFollowed). A Global Secondary Index (GSI) with reversed keys allows looking up all followers of a given user. This avoids needing a dedicated graph database — simple lookups and range queries suffice for our requirements.",
            },
            {
              id: "b16",
              type: "paragraph",
              content:
                "The Feed Service handles read requests: (1) query the Follow table to get all users the requester follows, (2) query the Post table via a GSI (creatorID partition key, createdAt sort key) to get recent posts from those users, (3) merge-sort by timestamp and return. This works for small-scale but has fan-out problems at scale.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Deep Dives — Fan-out Strategies
    {
      title: "Deep Dives — Fan-out Strategies & Hybrid Feeds",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Fan-out Strategies & Hybrid Feeds",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "The Fan-out Problem",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "The naive feed design has two critical scaling challenges: (1) users following many accounts cause fan-out on read — a single feed request fans out to N queries; (2) celebrity accounts with millions of followers cause fan-out on write — a single post must update millions of precomputed feeds. Solving these two problems is the heart of the news feed design.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Fan-out on Read vs Fan-out on Write",
              metadata: { level: 2 },
            },
            {
              id: "c4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Fan-out on Read: Assemble the feed when the user requests it. Simple but slow for users following many accounts — O(N) queries per request.",
                  "Fan-out on Write: Precompute feeds when posts are created. Fast reads (single lookup) but expensive writes for celebrity accounts with millions of followers.",
                  "Key tradeoff: Read latency vs write amplification. Most production systems use a hybrid approach.",
                ],
              },
            },
            {
              id: "c5",
              type: "heading",
              content: "Precomputed Feed Table",
              metadata: { level: 2 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "For users following many accounts, maintain a PrecomputedFeed table. Each entry is keyed by userId and stores a list of ~200 most recent post IDs in reverse chronological order. When a post is created, prepend the post ID to each follower's feed entry. This converts read-time fan-out into write-time fan-out.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Storage Estimation",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Each post ID ≈ 10 bytes. 200 posts per user = 2KB per user. With 2B users: 2KB × 2B = 4TB total. This is very manageable. At pennies per GB, each user's feed costs a fraction of a cent — well within budget given Facebook's ~$100/year revenue per US user.",
            },
            {
              id: "c9",
              type: "heading",
              content: "Async Workers with Queue",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "When a post is created, enqueue a message (post ID + creator user ID) to SQS (or any at-least-once delivery queue). A fleet of workers dequeue messages, look up the creator's followers, and prepend the post to each follower's precomputed feed. This decouples post creation latency from feed propagation and enables horizontal scaling of write workers.",
            },
            {
              id: "c11",
              type: "heading",
              content: "The Hybrid Approach (Great Solution)",
              metadata: { level: 2 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                'The optimal approach combines fan-out on read and fan-out on write on a per-account basis. For normal accounts (say < 10K followers), precompute feeds on write. For celebrity accounts (Justin Bieber with 90M+ followers), flag the follow relationship as "not precomputed." Workers skip these accounts entirely.',
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                "At read time, the Feed Service fetches the user's partially precomputed feed AND recent posts from their non-precomputed follows, then merges them. This bounds write amplification while keeping read latency low — most users follow only a few celebrities, so the read-side merge is small.",
            },
            {
              id: "c14",
              type: "quote",
              content:
                '"In most situations we don\'t need a one-size-fits-all solution. We can come up with clever ways to solve for different types of problems and combine them together." — HelloInterview',
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 3: Caching & Hot Key Mitigation
    {
      title: "Caching Strategies & Hot Key Mitigation",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Caching Strategies & Hot Key Mitigation",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "The Hot Key Problem",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "DynamoDB (and most key-value stores) scale well when load is evenly distributed across partitions. But viral posts create hot keys — a single post may receive 500 req/s while thousands of others get 0. This uneven access pattern overloads the partition hosting the hot key.",
            },
            {
              id: "d3",
              type: "heading",
              content: "Distributed Post Cache (Good Solution)",
              metadata: { level: 2 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "Insert a Redis cache between readers and the Post table. Since posts are rarely edited, use a long TTL with LRU eviction. Key by post ID to distribute across shards. Invalidate on post edit (not create). This absorbs the majority of reads — but a sharded cache still has the hot key problem: viral posts hash to a single shard.",
            },
            {
              id: "d5",
              type: "heading",
              content: "Redundant (Replicated) Post Cache (Great Solution)",
              metadata: { level: 2 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Instead of sharding (each post on exactly one node), use replicated cache instances where every instance can serve any post. A load balancer distributes requests across N instances. For a viral post, read traffic is spread across all N instances instead of hammering one shard — giving N× throughput for hot keys with zero coordination.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Trade-off: Sharded vs Replicated Cache",
              metadata: { level: 3 },
            },
            {
              id: "d8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Sharded: Higher total capacity (each post stored once), but hot keys overload individual shards.",
                  "Replicated: Lower total capacity (each post stored N times), but hot key traffic is distributed. More cache misses initially (N misses instead of 1 for new posts).",
                  "For news feed where recent/viral posts dominate access patterns, the replicated approach is superior — the working set of hot posts easily fits in each replica.",
                ],
              },
            },
            {
              id: "d9",
              type: "heading",
              content: "What's Expected at Each Level",
              metadata: { level: 2 },
            },
            {
              id: "d10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Mid-level (E4): Functional API + data model. Basic fan-out awareness. May have one "Good" solution but not expected to cover all deep dives.',
                  "Senior (E5): Speed through HLD to spend time on 2+ deep dives. Articulate pros/cons of architectural choices. Proactively surface fan-out and performance bottlenecks.",
                  "Staff+ (E6+): Cover all deep dives with practical depth. Draw from real-world experience. Surface and solve issues independently. Interviewer should only need to focus, not steer.",
                ],
              },
            },
          ],
          readingTime: 6,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "Why use PUT instead of POST for the follow endpoint?",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "The News Feed API uses PUT /users/[id]/follow instead of POST. What is the primary reason for this design choice?",
        explanation:
          'PUT is idempotent — calling it multiple times has the same effect as calling it once. If a user accidentally clicks "Follow" twice, a PUT request won\'t fail or create a duplicate. POST is not idempotent, so a second call could create a duplicate follow record or return an error.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: 'PUT is idempotent, so double-clicking "Follow" won\'t cause errors',
              isCorrect: true,
            },
            {
              id: "b",
              text: "PUT automatically handles unfollowing when called again",
              isCorrect: false,
            },
            {
              id: "c",
              text: "PUT allows sending authentication tokens in the body",
              isCorrect: false,
            },
            { id: "d", text: "PUT is faster than POST for write operations", isCorrect: false },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Cursor-based pagination in the feed",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "The News Feed uses cursor-based pagination with a timestamp cursor. Why is a timestamp a good cursor for this feed?",
        explanation:
          "Since the feed is ordered in reverse chronological order, a single timestamp (the oldest post seen) tells us exactly where the user stopped. We return posts older than the cursor — this works naturally with the createdAt sort key in DynamoDB without needing offset-based queries that degrade at large offsets.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Offset-based pagination is not supported by any database",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Posts are sorted by timestamp, so one value marks the exact boundary of unseen content",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Timestamps are shorter than UUIDs, reducing bandwidth",
              isCorrect: false,
            },
            { id: "d", text: "Timestamps prevent users from skipping pages", isCorrect: false },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Database choice for the Post table",
      type: "question",
      sectionId: "sec_q_data_modeling",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is DynamoDB a good choice for the Post table in a news feed system at 2B users?",
        explanation:
          "DynamoDB is a key-value/document store that can provision extremely high throughput when load is evenly distributed across partitions. It's fully managed, scales horizontally, and doesn't require complex relational queries for this use case. We don't need JOINs — posts are accessed by ID or by creator + timestamp via a GSI.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It provides high throughput with even partition distribution and scales horizontally without managing infrastructure",
              isCorrect: true,
            },
            { id: "b", text: "It automatically resolves hot key problems", isCorrect: false },
            {
              id: "c",
              text: "It supports complex SQL JOINs needed for feed generation",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It provides strong consistency by default across all operations",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why avoid a graph database for follows?",
      type: "question",
      sectionId: "sec_q_data_modeling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The design models follow relationships in DynamoDB rather than a graph database like Neo4j. What is the strongest justification for this choice?",
        explanation:
          'Graph databases excel at multi-hop traversals (friends of friends, recommendation embeddings) and complex graph algorithms. Our requirements only need single-hop queries: "who does X follow?" and "who follows X?" These are simple range queries on a key-value store. Using DynamoDB avoids the operational complexity and scaling challenges of a graph database without sacrificing functionality.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Graph databases require stronger consistency guarantees than our system needs",
              isCorrect: false,
            },
            {
              id: "b",
              text: "DynamoDB supports graph queries natively through DynamoDB Streams",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Our requirements only need single-hop lookups (direct follows/followers), not multi-hop traversals, so a key-value store with a GSI suffices",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Graph databases cannot scale to 2B users under any circumstances",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "PrecomputedFeed table sizing",
      type: "question",
      sectionId: "sec_q_fanout",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The PrecomputedFeed table stores 200 post IDs per user. Why is 200 a reasonable limit, and what happens when a user scrolls past it?",
        explanation:
          "Most users only read the first few items in their feed — going 200 posts deep is extremely rare. The 200 limit keeps entries compact (~2KB per user). If a user scrolls past the precomputed window, the system falls back to the naive approach: query the Follow and Post tables directly. This is acceptable because it's an edge case affecting very few users.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "200 is a DynamoDB item size limit — entries cannot store more post IDs",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Real users rarely scroll past 200 items; the system falls back to querying Follow/Post tables directly for deeper pages",
              isCorrect: true,
            },
            {
              id: "c",
              text: "200 was chosen because each post ID is 200 bytes, matching a 40KB DynamoDB limit",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The system returns an error when users try to scroll past 200 posts",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Why async workers instead of synchronous writes",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When a user creates a post, the system enqueues a message to SQS rather than directly updating all followers' feeds synchronously. Which non-functional requirement most directly justifies this design?",
        explanation:
          "The system tolerates up to 1 minute of eventual consistency. This window allows us to decouple post creation latency from feed propagation. The post API returns immediately while workers process the fan-out asynchronously. Without this tolerance, we'd need synchronous writes that would make post creation extremely slow for users with many followers.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "DynamoDB does not support synchronous writes from multiple services",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Eventual consistency tolerance (≤ 1 minute staleness) allows decoupling post creation from feed propagation",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The < 500ms latency requirement prevents any database writes during post creation",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The 2B user scale requires SQS specifically — other queues would not work",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Hybrid approach threshold tuning",
      type: "question",
      sectionId: "sec_q_fanout",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In the hybrid fan-out approach, accounts above a follower threshold are excluded from precomputed feeds and handled via fan-out on read. What would happen if you set this threshold too LOW (e.g., 100 followers)?",
        explanation:
          'Setting the threshold too low means most accounts are treated as "celebrity" accounts — their posts are NOT precomputed into followers\' feeds. At read time, the Feed Service must query recent posts from many non-precomputed follows and merge them with the precomputed feed. This increases read latency and Feed Service CPU load, effectively reverting toward a full fan-out-on-read architecture and negating the benefits of precomputation.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Read latency increases significantly because most feeds require merging many non-precomputed sources at query time",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Storage costs increase because more precomputed feed entries are stored",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Write amplification increases because more accounts need precomputation",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The SQS queue becomes overloaded with too many fan-out tasks",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Replicated cache trade-off analysis",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'The "Great Solution" uses replicated cache instances instead of a sharded cache. With N replicated instances, a never-before-seen viral post will initially cause N cache misses (one per instance). Why is this acceptable?',
        explanation:
          "N cache misses is a tiny constant (e.g., 10-20 instances) compared to the millions of read requests the viral post will receive. After N misses, every instance has the post cached and can independently serve it. The sharded alternative would have only 1 miss but all subsequent millions of reads would hammer that single shard. N misses spread across instances is vastly better than millions of requests concentrated on one shard.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "DynamoDB can easily handle N concurrent reads because its partitions auto-split",
              isCorrect: false,
            },
            {
              id: "b",
              text: "N is a small constant (10-20); after those misses, all N instances serve traffic independently — far better than millions of hits on one shard",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The cache misses are handled asynchronously so users never see the latency",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Redis replication protocol ensures only one instance actually hits the database",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Information stored in the Follow table",
      type: "question",
      sectionId: "sec_q_data_modeling",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL queries the Follow table + GSI design supports efficiently (single partition key lookup or range query):",
        explanation:
          "The Follow table has partition key = userFollowing and sort key = userFollowed. A GSI reverses these keys. (A) Check if user A follows user B: query with both keys — simple lookup. (B) Get all users A follows: query partition key userFollowing — range query. (C) Get all followers of user B: query GSI partition key userFollowed — range query. (D) Mutual follows requires two queries (A→B and B→A), not a single efficient lookup.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Get all followers of user B", isCorrect: true },
            { id: "b", text: "Check if user A follows user B", isCorrect: true },
            { id: "c", text: "Get all users that user A is following", isCorrect: true },
            {
              id: "d",
              text: "Find all mutual follows between two users in a single query",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Benefits of the hybrid fan-out approach",
      type: "question",
      sectionId: "sec_q_fanout",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL advantages of the hybrid fan-out approach over a pure fan-out-on-write strategy:",
        explanation:
          "The hybrid approach excludes celebrity accounts from write-time precomputation. This (A) caps write amplification since celebrity posts don't fan out to millions of feeds, and (C) reduces SQS queue depth by removing the highest-volume tasks. It does NOT eliminate read-time merging — in fact it introduces it for celebrity posts. And it doesn't reduce storage because the PrecomputedFeed table still stores 200 entries per user regardless.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Reduces storage in the PrecomputedFeed table to near zero",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Bounds write amplification by skipping celebrity accounts during precomputation",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Eliminates the need for any read-time feed merging",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Reduces queue depth and worker load for async feed workers",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Properties of the queue used for feed fan-out",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "The design uses SQS for async feed propagation. Select ALL properties that are essential for the queue in this context:",
        explanation:
          "At-least-once delivery ensures no post is lost — it's acceptable to prepend a post ID to a feed twice (idempotent operation) rather than lose it. High scalability is needed because millions of posts are created per day. FIFO ordering is NOT essential since feeds are sorted by timestamp regardless of processing order. Sub-millisecond latency is unnecessary since we tolerate up to 1 minute of staleness.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "At-least-once delivery of messages", isCorrect: true },
            { id: "b", text: "Highly scalable throughput", isCorrect: true },
            { id: "c", text: "Sub-millisecond message delivery latency", isCorrect: false },
            { id: "d", text: "Strict FIFO ordering of messages", isCorrect: false },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Challenges when a celebrity account with 50M followers posts",
      type: "question",
      sectionId: "sec_q_fanout",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Without the hybrid approach, a pure fan-out-on-write system must handle a celebrity with 50M followers creating a post. Select ALL real challenges this creates:",
        explanation:
          "With 50M followers: (A) Workers must update 50M PrecomputedFeed entries — enormous write volume. (B) Uneven load: one queue item for a celebrity requires 1000× more work than one for a normal user, making auto-scaling and load balancing difficult. (C) Propagation may exceed the 1-minute consistency window. SQS does support this volume (it scales horizontally), but the workers and downstream writes are the bottleneck, not the queue itself.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Feed propagation may exceed the 1-minute consistency SLA",
              isCorrect: true,
            },
            {
              id: "b",
              text: "SQS cannot handle 50M messages and will drop them",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Variable work per queue message makes worker load highly uneven",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Write amplification: 50M feed entries must be updated",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Explain the fan-out trade-off",
      type: "question",
      sectionId: "sec_q_fanout",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the difference between fan-out on read and fan-out on write in the context of a news feed. For each approach, describe when it performs well and when it struggles. Then explain how a hybrid approach combines the best of both.",
        explanation:
          "A strong answer should: (1) Define fan-out on read as assembling the feed at query time from source tables, (2) Define fan-out on write as precomputing feeds when posts are created, (3) Explain that fan-out on read struggles with users who follow many accounts (high read latency), (4) Explain that fan-out on write struggles with celebrity accounts (massive write amplification), (5) Describe the hybrid approach that uses write precomputation for normal accounts and read-time merging for celebrities.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Fan-out on read assembles the feed when the user requests it: look up who they follow, fetch recent posts from each, merge-sort by timestamp. This is simple but creates O(N) queries per request where N is the number of accounts followed — unacceptable for users following thousands of accounts.\n\nFan-out on write precomputes feeds at post-creation time. When a user posts, their followers' precomputed feed tables are updated with the new post ID. Reads become a single lookup. However, when a celebrity with 50M followers posts, the system must perform 50M writes — causing massive write amplification and potential SLA violations.\n\nThe hybrid approach assigns each account a fan-out strategy based on follower count. Normal accounts (< threshold) use write precomputation. Celebrity accounts skip precomputation; their posts are fetched at read time and merged with the precomputed feed. Most users follow only a few celebrities, so the read-time merge overhead is small, while write amplification is bounded.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Design the Follow table schema in DynamoDB",
      type: "question",
      sectionId: "sec_q_data_modeling",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Design the DynamoDB schema for the Follow table. Specify the partition key, sort key, and any Global Secondary Indexes. Explain which queries each index supports and why this design avoids the need for a graph database.",
        explanation:
          'A strong answer specifies: main table PK = userFollowing, SK = userFollowed for "does A follow B?" and "who does A follow?" queries; GSI with PK = userFollowed, SK = userFollowing for "who follows B?" queries. Should explain that graph databases add operational complexity and are justified only for multi-hop traversals (friends-of-friends, recommendations) which are out of scope.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'The Follow table uses a composite primary key:\n- Partition Key: userFollowing (the user who is following)\n- Sort Key: userFollowed (the user being followed)\n\nThis supports: (1) "Does user A follow user B?" — query with both PK and SK, an O(1) point lookup; (2) "Who does user A follow?" — query with PK only, returns all SK values as a range scan.\n\nA Global Secondary Index reverses the keys:\n- GSI Partition Key: userFollowed\n- GSI Sort Key: userFollowing\n\nThis supports: (3) "Who follows user B?" — query GSI with PK only.\n\nA graph database like Neo4j would be overkill because we only need single-hop queries (direct follows/followers). Graph databases are justified when you need multi-hop traversals — friend-of-friend recommendations, shortest path between users, or graph embeddings. Our requirements don\'t include any of these, so a simple key-value table with a GSI provides the same functionality with less operational overhead and well-understood DynamoDB scaling.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Sharded vs replicated cache analysis",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Compare the sharded (distributed) and replicated cache approaches for the Post cache. Analyze: (1) how each handles hot keys from viral posts, (2) the total cache capacity trade-off, (3) cache miss behavior, and (4) which approach is better suited for the news feed access pattern and why.",
        explanation:
          "A strong answer should cover: sharded cache gives more total capacity but hot keys overload individual shards; replicated cache has less total capacity but distributes hot key traffic across N instances; cache misses are N for replicated (one per instance) vs 1 for sharded; news feed access pattern is dominated by recent/viral posts (small working set) making replicated cache ideal since the hot post set fits easily in each replica.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Sharded Cache: Each post lives on exactly one Redis node (hashed by post ID). Total capacity = sum of all node memories. Problem: viral posts hash to one shard, which receives disproportionate traffic. That shard becomes a bottleneck while others sit idle. You cannot add more shards to help — the hot key still maps to one node.\n\nReplicated Cache: Every cache instance stores the same data. A load balancer distributes requests across N instances. Total capacity per instance = one node's memory, but every instance can serve any post. A viral post's traffic is split N ways. Hot key throughput scales linearly with N.\n\nCache Misses: For a new viral post, the sharded cache sees 1 miss (the assigned shard fetches from DB), but then all subsequent reads hit that one shard. The replicated cache sees N misses (one per instance), but then all N instances serve reads independently. N misses is a tiny cost compared to handling millions of subsequent reads.\n\nFor news feed, the replicated approach wins. The access pattern is dominated by recent and viral posts — a small working set that fits easily in each replica. The sharded approach's advantage of higher total capacity is irrelevant because we don't need to cache millions of cold posts. What we need is high throughput for a small number of hot posts, which replication provides.",
          minLength: 200,
          maxLength: 2500,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "End-to-end post creation flow with hybrid fan-out",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Trace the complete lifecycle of a post from creation to appearing in a follower's feed, assuming the hybrid fan-out approach. Cover: (1) the write path including the Post Service, SQS queue, and async workers, (2) how the system decides whether to precompute for a given follower, (3) the read path when the follower requests their feed, and (4) how eventual consistency is maintained within the 1-minute SLA.",
        explanation:
          "A strong answer traces: Post Service writes to Post table + enqueues to SQS → Worker dequeues, looks up creator's followers, checks precompute flag → For normal followers: prepend post ID to PrecomputedFeed → For celebrity-follow flag: skip. On read: Feed Service fetches precomputed feed + queries non-precomputed follows' recent posts + merges. 1-minute SLA is met because the queue + workers process within that window.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Write Path: (1) User hits POST /posts → API Gateway routes to a Post Service instance. (2) Post Service writes the post to the Posts table in DynamoDB and returns 200 with the postId (fast — user sees sub-500ms response). (3) Post Service enqueues a message to SQS: {postId, creatorUserId}.\n\n(4) An async feed worker dequeues the message. It queries the Follow table GSI (PK = creatorUserId) to get all followers. For each follower, it checks the follow record's precompute flag. (5) If the follow IS precomputed (normal account < threshold followers): the worker prepends the postId to that follower's entry in the PrecomputedFeed table. (6) If the follow is NOT precomputed (celebrity account): the worker skips this follower — their feed will pick up the post at read time.\n\nRead Path: (7) A follower hits GET /feed?cursor={timestamp}. The Feed Service fetches their precomputed feed from the PrecomputedFeed table (fast single-key lookup). (8) The Feed Service also identifies the follower's non-precomputed follows (celebrity accounts) and queries the Posts table GSI for recent posts from each. (9) It merge-sorts the precomputed list with the celebrity posts by timestamp and returns the page.\n\nConsistency: The queue + worker processing pipeline completes well within 1 minute for normal accounts. The 1-minute SLA is the budget for steps 4-6. SQS provides at-least-once delivery, and prepending a postId is idempotent (duplicate prepends are harmless). Workers auto-scale based on queue depth.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Handling a celebrity unfollowing scenario",
      type: "question",
      sectionId: "sec_q_fanout",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Consider a user who unfollows a celebrity account in the hybrid system. Describe: (1) what changes must occur in the Follow table, (2) whether the PrecomputedFeed needs updating and why, (3) how the Feed Service handles the unfollow at read time, and (4) any edge cases around eventual consistency (e.g., seeing a celebrity's post briefly after unfollowing).",
        explanation:
          "Strong answer: Delete the follow record from the Follow table (and GSI). Since celebrity follows are NOT precomputed, the PrecomputedFeed doesn't need updating. The Feed Service will no longer query that celebrity's posts at read time. Edge case: a brief window where cached/in-flight feed results still include the celebrity's posts due to eventual consistency — this is acceptable per our ≤1-minute staleness requirement.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "(1) Follow Table: Delete the record (userFollowing=currentUser, userFollowed=celebrity) from the Follow table. The GSI entry is automatically removed by DynamoDB. This is a DELETE /users/[id]/follow operation.\n\n(2) PrecomputedFeed: No update needed. Celebrity follows are flagged as NOT precomputed in the hybrid approach, so the celebrity's posts were never written into this user's precomputed feed. There are no stale post IDs to clean up.\n\n(3) Feed Service at Read Time: When the user next requests their feed, the Feed Service queries their non-precomputed follows to merge with the precomputed feed. Since the follow record is deleted, the celebrity no longer appears in this list. The Feed Service simply won't fetch that celebrity's recent posts.\n\n(4) Edge Cases: There's a brief window (seconds) where the user might still see the celebrity's posts. If the Feed Service had cached the user's follow list, the stale cache may include the celebrity. Solutions: set a short TTL on follow list caches, or invalidate on unfollow. Since our system tolerates ≤1-minute staleness, seeing one extra post briefly is acceptable. Additionally, if the user's feed was recently generated and cached, it may still contain the celebrity's posts until the cache TTL expires. For unfollow specifically, a cache-aside pattern with invalidation provides better UX.",
          minLength: 150,
          maxLength: 2500,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Capacity estimation for async workers",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Perform a back-of-envelope capacity estimation for the async feed workers. Assume: 2B total users, 500M DAU, each active user posts 0.5 times/day on average, average user has 200 followers, and each feed write takes 1ms. Estimate: (1) total posts per day, (2) total feed writes per day, (3) required sustained write throughput, and (4) number of worker instances needed if each can handle 1000 writes/second.",
        explanation:
          "Strong answer: 250M posts/day, 50B feed writes/day, ~580K writes/sec sustained, ~580 worker instances. Should show the math clearly and note that peak traffic may require 2-3× headroom.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "(1) Posts/day: 500M DAU × 0.5 posts/user = 250M posts/day.\n\n(2) Feed writes/day: Each post fans out to an average of 200 followers. 250M posts × 200 followers = 50 billion feed writes per day.\n\n(3) Sustained throughput: 50B writes / 86,400 seconds ≈ 578,700 writes/second sustained. This is the average — peak hours (e.g., evenings) may see 2-3× this rate, so we should plan for ~1.5M writes/second peak.\n\n(4) Worker instances: At 1000 writes/second per worker: 578,700 / 1000 ≈ 579 workers for sustained throughput. For peak capacity (1.5M/s): ~1,500 workers. With auto-scaling, we'd configure a baseline of ~600 instances scaling up to ~1,500.\n\nNote: This assumes all followers are precomputed. With the hybrid approach excluding celebrity accounts, the actual fan-out is lower. If 10% of follows are non-precomputed (celebrity), actual writes drop to ~45B/day, reducing worker needs by ~10%.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Name the fan-out strategy",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "When a user creates a post and the system immediately writes to all followers' precomputed feeds, this is called fan-out on _____. (one word)",
        explanation:
          "This is fan-out on WRITE. The write (post creation) triggers fan-out to all followers' feeds. The alternative — assembling the feed when a user requests it — is called fan-out on READ.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "write",
          acceptableAnswers: ["write", "Write", "WRITE"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Identify the hot key failure mode",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In a sharded Redis cache keyed by post ID, a viral post that receives millions of reads creates what problem? Name the specific issue in 2-3 words.",
        explanation:
          "The hot key problem (also called hot partition or hot shard). All reads for the viral post hash to the same cache shard, overloading it while other shards sit idle. This is a fundamental challenge in hash-based distributed systems.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "hot key problem",
          acceptableAnswers: [
            "hot key problem",
            "hot key",
            "hot partition",
            "hot shard",
            "hot spot",
            "hot key issue",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "DynamoDB scaling prerequisite",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "DynamoDB can scale to very high throughput provided a critical condition is met about how the load is distributed. What is this condition? Answer in one phrase.",
        explanation:
          'DynamoDB requires even load distribution across partitions (also phrased as "uniform partition key distribution" or "avoiding hot partitions"). Under the hood, DynamoDB distributes data across physical partitions based on the partition key. If one key receives disproportionate traffic, that physical partition becomes a bottleneck.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "even load across partitions",
          acceptableAnswers: [
            "even load across partitions",
            "even load distribution",
            "uniform partition key distribution",
            "even distribution across partitions",
            "evenly spread load across partitions",
            "uniform access pattern",
            "avoid hot partitions",
            "even partition distribution",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Identify the index that enables chronological post lookup",
      type: "question",
      sectionId: "sec_q_data_modeling",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'To efficiently query "all posts by user X in chronological order," the design adds a specific DynamoDB construct to the Post table. Name the construct type AND specify its key structure (partition key and sort key).',
        explanation:
          "A Global Secondary Index (GSI) with partition key = creatorID and sort key = createdAt. This allows efficient range queries for all posts by a given user ordered by time, which is essential for the feed generation logic.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "GSI with partition key creatorID and sort key createdAt",
          acceptableAnswers: [
            "GSI with partition key creatorID and sort key createdAt",
            "Global Secondary Index with creatorID partition key and createdAt sort key",
            "GSI: PK=creatorID, SK=createdAt",
            "GSI (creatorID, createdAt)",
            "global secondary index with creatorID and createdAt",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match components to responsibilities",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content:
          "Match each system component to its primary responsibility in the news feed architecture:",
        explanation:
          "The Post Service handles write operations for creating posts. The Feed Service handles read operations for generating user feeds. Async Workers handle background processing of feed fan-out from the SQS queue. The API Gateway handles routing and load balancing across service instances.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Post Service",
              right: "Writes new posts to the database and enqueues fan-out messages",
            },
            {
              id: "p2",
              left: "Feed Service",
              right: "Reads and merges precomputed feeds with celebrity posts for user requests",
            },
            {
              id: "p3",
              left: "Async Workers",
              right: "Dequeue messages and update followers' precomputed feeds",
            },
            {
              id: "p4",
              left: "API Gateway",
              right: "Routes requests to service instances and provides load balancing",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match fan-out strategies to their trade-offs",
      type: "question",
      sectionId: "sec_q_fanout",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each fan-out strategy to the problem it handles WORST:",
        explanation:
          "Fan-out on Read struggles most when a user follows thousands of accounts — each feed request requires querying all of them. Fan-out on Write struggles most with celebrity accounts — one post triggers millions of writes. Hybrid handles both but introduces merge complexity at read time. Direct database query (no caching or precomputation) struggles with hot keys since popular posts overwhelm individual partitions.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Fan-out on Read",
              right: "User following 10,000 accounts — feed request requires 10K queries",
            },
            {
              id: "p2",
              left: "Fan-out on Write",
              right: "Celebrity with 50M followers — single post triggers 50M writes",
            },
            {
              id: "p3",
              left: "Hybrid Approach",
              right: "Increased read-time complexity from merging precomputed + live data",
            },
            {
              id: "p4",
              left: "No Precomputation",
              right: "Viral post creating hot key on a single database partition",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match interview level to expected depth",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each interview level to the expected depth for the News Feed problem:",
        explanation:
          "Mid-level (E4) focuses on breadth — a working HLD that meets functional requirements. Senior (E5) must dive deep into at least 2 scaling challenges and articulate trade-offs. Staff+ (E6) should cover all deep dives with practical experience, surface issues independently, and demonstrate production-level thinking.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Mid-level (E4)",
              right: 'Clear API + data model; functional HLD; may have one "Good" scaling solution',
            },
            {
              id: "p2",
              left: "Senior (E5)",
              right:
                "Speed through HLD; deep-dive 2+ scaling problems; articulate pros/cons of choices",
            },
            {
              id: "p3",
              left: "Staff+ (E6)",
              right:
                "Cover all deep dives with real-world depth; surface and solve issues independently",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Feed pagination mechanism",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The feed API uses _____ pagination where the cursor is a _____ representing the oldest post the user has seen.",
        explanation:
          "Cursor-based pagination uses a timestamp as the cursor. Since the feed is sorted in reverse chronological order, the timestamp marks the boundary between seen and unseen content. This is more efficient than offset-based pagination for large datasets.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The feed API uses {{blank1}} pagination where the cursor is a {{blank2}} representing the oldest post the user has seen.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "cursor-based",
              acceptableAnswers: ["cursor-based", "cursor", "keyset"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "timestamp",
              acceptableAnswers: ["timestamp", "time stamp", "datetime"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Cache eviction strategy",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The Post cache uses a long _____ (time to live) and _____ (eviction policy) to keep the most recently accessed posts in memory.",
        explanation:
          "TTL (Time To Live) defines how long a cache entry lives before expiring. LRU (Least Recently Used) eviction removes the entries that haven't been accessed recently when the cache is full. Since posts are rarely edited, a long TTL is safe.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The Post cache uses a long {{blank1}} (time to live) and {{blank2}} (eviction policy) to keep the most recently accessed posts in memory.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "TTL",
              acceptableAnswers: ["TTL", "ttl", "time to live"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "LRU",
              acceptableAnswers: ["LRU", "lru", "least recently used"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "DynamoDB Follow table key design",
      type: "question",
      sectionId: "sec_q_data_modeling",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "The Follow table uses _____ as the partition key and _____ as the sort key, with a GSI that reverses these keys to support follower lookups.",
        explanation:
          'The partition key is userFollowing (the person doing the following) and the sort key is userFollowed (the person being followed). This allows efficient queries for "who does user X follow?" The GSI reverses the keys to support "who follows user Y?" queries.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "The Follow table uses {{blank1}} as the partition key and {{blank2}} as the sort key, with a GSI that reverses these keys to support follower lookups.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "userFollowing",
              acceptableAnswers: ["userFollowing", "user_following", "followerId", "follower_id"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "userFollowed",
              acceptableAnswers: ["userFollowed", "user_followed", "followeeId", "followee_id"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "PrecomputedFeed storage estimation",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "Each post ID is 10 bytes. The PrecomputedFeed stores 200 post IDs per user. With 2 billion users, how many terabytes (TB) of storage is needed for all precomputed feeds?",
        explanation:
          "Per user: 10 bytes × 200 posts = 2,000 bytes = 2KB. Total: 2KB × 2,000,000,000 users = 4,000,000,000 KB = 4,000,000 MB = 4,000 GB = 4 TB.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 4,
          tolerance: 0.5,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Fan-out write throughput calculation",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A news feed system handles 300 million posts per day. Each post fans out to an average of 150 followers. How many feed writes per second (sustained average) must the async worker fleet handle? Round to the nearest thousand.",
        explanation:
          "Total feed writes per day: 300M × 150 = 45 billion. Seconds per day: 86,400. Writes per second: 45,000,000,000 / 86,400 ≈ 520,833. Rounded to the nearest thousand: 521,000.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 521000,
          tolerance: 10000,
        },
      },
    },
  ],
};
