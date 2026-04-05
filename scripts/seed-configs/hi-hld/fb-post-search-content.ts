/**
 * FB Post Search — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: inverted index, tokenization, write-heavy systems, caching, bigrams, two-stage ranking, hot/cold storage
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const fbPostSearchContent: StoryPointSeed = {
  title: "Facebook Post Search",
  description:
    "Design a post search system for Facebook that supports keyword search across billions of posts with sorting by recency and like count, handling 10k writes/s and 10k searches/s without using pre-built search engines like Elasticsearch.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements & Fundamentals", orderIndex: 1 },
    { id: "sec_q_index_design", title: "Inverted Index & Data Structures", orderIndex: 2 },
    { id: "sec_q_caching_reads", title: "Caching & Read Path Optimization", orderIndex: 3 },
    { id: "sec_q_scaling_writes", title: "Scaling Writes & Like Volume", orderIndex: 4 },
    { id: "sec_q_deep_dives", title: "Deep Dives & Trade-offs", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Design
    {
      title: "FB Post Search — Requirements & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "FB Post Search — Requirements & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Facebook Post Search?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                'Facebook is a social network centered around "posts" — messages that users create, like, and share. Post search enables users to find posts by keyword across the entire platform. This question is designed for infrastructure-style interviews where the interviewer wants to test your understanding of data layout, indexing, and scaling fundamentals. A key constraint: you are NOT allowed to use a pre-built search engine like Elasticsearch or Postgres Full-Text search.',
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
                  "Users should be able to create and like posts.",
                  "Users should be able to search posts by keyword.",
                  "Users should be able to get search results sorted by recency or like count.",
                ],
              },
            },
            {
              id: "b5",
              type: "heading",
              content: "Out of Scope",
              metadata: { level: 3 },
            },
            {
              id: "b6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Fuzzy matching (e.g., "bird" matches "ostrich").',
                  "Personalization in search results.",
                  "Privacy rules and filters.",
                  "Sophisticated relevance algorithms.",
                  "Images, media, and real-time search page updates.",
                ],
              },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "By de-scoping personalization, we dramatically simplify the problem and make caching much more effective. If two users search for the same keyword with the same sort order, they get identical results — a powerful caching property.",
            },
            {
              id: "b8",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b9",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Median query latency < 500ms.",
                  "High volume of requests (estimated below).",
                  "New posts searchable within < 1 minute.",
                  "All posts discoverable (old/unpopular posts may take longer).",
                  "Highly available.",
                ],
              },
            },
            {
              id: "b10",
              type: "heading",
              content: "Scale Estimations",
              metadata: { level: 2 },
            },
            {
              id: "b11",
              type: "paragraph",
              content:
                "Assume 1B users. Each user produces ~1 post/day and likes ~10 posts/day. Using ~100k seconds/day for convenience:",
            },
            {
              id: "b12",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Posts created: 1B × 1 post/day ÷ 100k s/day = 10k posts/second.",
                  "Likes created: 1B × 10 likes/day ÷ 100k s/day = 100k likes/second.",
                  "Searches: 1B × 1 search/day ÷ 100k s/day = 10k searches/second.",
                  "Total posts (10 years): 1B × 365 × 10 = 3.6 trillion posts.",
                  "Raw storage: 3.6T × 1KB/post = 3.6 PB.",
                ],
              },
            },
            {
              id: "b13",
              type: "quote",
              content:
                '"Likes are 10× more frequent than post creations. This system is write-heavy, and the like volume is the elephant in the room."',
            },
            {
              id: "b14",
              type: "heading",
              content: "Core Entities & API",
              metadata: { level: 2 },
            },
            {
              id: "b15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "User: Creates posts.",
                  "Post: Content text, creator, implicit like count.",
                  "Like: User likes a post (we mostly care about the count).",
                ],
              },
            },
            {
              id: "b16",
              type: "code",
              content:
                "// Write Path\nPOST /posts { userId, content } → 201 Created\nPOST /likes { userId, postId } → 200 OK\n\n// Read Path\nGET /search?query=keyword&sortBy=recency|likes&page=1 → { posts[], nextPage }",
              metadata: { language: "typescript" },
            },
            {
              id: "b17",
              type: "heading",
              content: "High-Level Design Overview",
              metadata: { level: 2 },
            },
            {
              id: "b18",
              type: "paragraph",
              content:
                "The system has two legs: an ingestion path (post creation and likes flow into the index) and a query path (search requests read from the index). An external Post Service and Like Service handle the client-facing API; our search system consumes events from these services. An API Gateway handles authentication and rate limiting, and a horizontally-scaled Search Service queries the index.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Inverted Index & Sorting Strategies
    {
      title: "Inverted Index Design & Sorting Strategies",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Inverted Index Design & Sorting Strategies",
          blocks: [
            {
              id: "idx1",
              type: "heading",
              content: "Why Not a Naive Database Query?",
              metadata: { level: 2 },
            },
            {
              id: "idx2",
              type: "paragraph",
              content:
                "The naive approach — SELECT * FROM Posts WHERE content LIKE '%keyword%' — requires scanning every post at query time. With petabytes of data, even sharding across N nodes only reduces work to size/N per node, which is still far too slow for sub-500ms latency. This is a dead-end.",
            },
            {
              id: "idx3",
              type: "heading",
              content: "The Inverted Index",
              metadata: { level: 2 },
            },
            {
              id: "idx4",
              type: "paragraph",
              content:
                "An inverted index maps keywords to the documents that contain them. Instead of scanning all posts for a keyword, we look up the keyword in a dictionary and immediately get the list of matching post IDs. This is the foundational data structure behind every search engine.",
            },
            {
              id: "idx5",
              type: "code",
              content:
                '// Inverted Index Structure (Redis)\n"taylor"  → [postId_1, postId_5, postId_99, ...]\n"swift"   → [postId_1, postId_42, postId_99, ...]\n"concert" → [postId_5, postId_200, ...]\n\n// When user searches "taylor":\n// 1. Look up "taylor" key → get list of post IDs\n// 2. Return posts (already ordered by creation time or sorted set score)',
              metadata: { language: "typescript" },
            },
            {
              id: "idx6",
              type: "paragraph",
              content:
                "We use Redis to store these inverted indexes in memory for blazing-fast lookups. When a post is created, the Ingestion Service tokenizes it (breaks content into keywords) and appends the post ID to every keyword's list. A post with 100 words triggers 100+ writes to different keys.",
            },
            {
              id: "idx7",
              type: "heading",
              content: "Sorting: Bad Approach — Request-Time Sorting",
              metadata: { level: 2 },
            },
            {
              id: "idx8",
              type: "paragraph",
              content:
                "The naive sorting approach: fetch all post IDs for a keyword, look up each post's timestamp or like count from the Post Service, then sort in memory. If \"Taylor\" matches 10 million posts, you're transferring hundreds of megabytes of post IDs, making 10 million lookups, then sorting — all at request time. This cannot meet the 500ms SLA.",
            },
            {
              id: "idx9",
              type: "heading",
              content: "Sorting: Great Approach — Dual Indexes",
              metadata: { level: 2 },
            },
            {
              id: "idx10",
              type: "paragraph",
              content:
                "Maintain two separate indexes per keyword: a Creation Index (Redis list — always append, query from the tail for recency) and a Likes Index (Redis sorted set — score = like count, allows efficient top-N retrieval). When a post is created, it goes into both indexes for every keyword it contains. When a like happens, update the score in the sorted set.",
            },
            {
              id: "idx11",
              type: "code",
              content:
                '// Creation Index (Redis List — ordered by insertion time)\n// Key: "creation:{keyword}"\n"creation:taylor" → [postId_oldest, ..., postId_newest]\n// LRANGE creation:taylor -10 -1  → 10 most recent\n\n// Likes Index (Redis Sorted Set — ordered by like count)\n// Key: "likes:{keyword}"\n"likes:taylor" → { postId_1: 5000, postId_99: 12000, postId_5: 300 }\n// ZREVRANGE likes:taylor 0 9  → top 10 by likes',
              metadata: { language: "typescript" },
            },
            {
              id: "idx12",
              type: "paragraph",
              content:
                "Tradeoff: we've doubled storage for indexes. But the query performance improvement is massive — top-N retrieval from a sorted set is O(log N + K) where K is the result set size. The bigger concern is that likes happen 10× more than post creations, and each like requires updating scores across many keyword indexes.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Deep Dives — Scaling, Caching, Multi-Keyword, Storage
    {
      title: "Deep Dives — Scaling, Caching & Storage Optimization",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Scaling, Caching & Storage Optimization",
          blocks: [
            {
              id: "dd1",
              type: "heading",
              content: "Deep Dive 1: Scaling Reads with Caching",
              metadata: { level: 2 },
            },
            {
              id: "dd2",
              type: "paragraph",
              content:
                "Two properties make caching extremely effective here: (1) No personalization means identical queries return identical results. (2) The 1-minute freshness SLA gives us a generous TTL window.",
            },
            {
              id: "dd3",
              type: "heading",
              content: "Good: Distributed Redis Cache",
              metadata: { level: 3 },
            },
            {
              id: "dd4",
              type: "paragraph",
              content:
                "Add a Redis cache alongside the Search Service. Cache key = query + sort order. On search, check cache first; on miss, query the index, store result with TTL < 1 minute. This eliminates redundant index lookups for popular queries.",
            },
            {
              id: "dd5",
              type: "heading",
              content: "Great: CDN Edge Caching",
              metadata: { level: 3 },
            },
            {
              id: "dd6",
              type: "paragraph",
              content:
                "Add cache-control headers to /search responses so a CDN (Cloudflare, CloudFront) caches results at the edge. Cache hits return in 10s of milliseconds vs 100s of ms through the full stack. The CDN acts as a geographically distributed HTTP cache — on miss, it proxies to the Search Service.",
            },
            {
              id: "dd7",
              type: "heading",
              content: "Deep Dive 2: Multi-Keyword / Phrase Queries",
              metadata: { level: 2 },
            },
            {
              id: "dd8",
              type: "heading",
              content: "Good: Set Intersection + Filter",
              metadata: { level: 3 },
            },
            {
              id: "dd9",
              type: "paragraph",
              content:
                'For "Taylor Swift": fetch post ID lists for "Taylor" and "Swift", compute the intersection (post IDs in both lists), then fetch post content to verify the words appear as a phrase, not independently (e.g., filter out "My friend Taylor made a swift exit"). Challenge: the individual lists can be millions of entries — expensive to transfer and intersect.',
            },
            {
              id: "dd10",
              type: "heading",
              content: "Great: Bigrams / Shingles",
              metadata: { level: 3 },
            },
            {
              id: "dd11",
              type: "paragraph",
              content:
                'Index consecutive word pairs (bigrams) during ingestion. "I saw Taylor Swift at the concert" produces bigrams: "I saw", "saw Taylor", "Taylor Swift", "Swift at", "at the", "the concert". Searching "Taylor Swift" hits the bigram index directly — no intersection needed. Tradeoff: index size grows dramatically since bigrams are far more unique (sparse). Mitigation: only index likely-to-be-searched bigrams using frequency analysis (e.g., count-min sketch), and fall back to intersection for rare pairs.',
            },
            {
              id: "dd12",
              type: "heading",
              content: "Deep Dive 3: Scaling Writes",
              metadata: { level: 2 },
            },
            {
              id: "dd13",
              type: "heading",
              content: "Post Creation (10k/s)",
              metadata: { level: 3 },
            },
            {
              id: "dd14",
              type: "paragraph",
              content:
                "Each post triggers 100+ writes (one per keyword). Use Kafka to buffer and fan out creation events to multiple Ingestion Service instances. Shard Redis indexes by keyword hash across many instances so writes are distributed.",
            },
            {
              id: "dd15",
              type: "heading",
              content: "Like Events (100k/s) — The Elephant in the Room",
              metadata: { level: 3 },
            },
            {
              id: "dd16",
              type: "heading",
              content: "Good: Batch Likes",
              metadata: { level: 4 },
            },
            {
              id: "dd17",
              type: "paragraph",
              content:
                "Aggregate likes for a given postId over a window (e.g., 30 seconds). Instead of 500 writes for a viral post, make 1 write with increment 500. Limitation: doesn't help for non-viral posts receiving steady low-rate likes.",
            },
            {
              id: "dd18",
              type: "heading",
              content: "Great: Two-Stage Architecture (Logarithmic Updates)",
              metadata: { level: 4 },
            },
            {
              id: "dd19",
              type: "paragraph",
              content:
                "Only update the likes index when the like count crosses milestones (powers of 2 or 10). 1000 likes → only 10 index writes. The index is inherently stale, but the ordering is approximately correct. To get precise results: retrieve top N×2 posts from the index, fetch real-time like counts from the Like Service, re-rank, return top N. Storage holds an approximation; the result is exact.",
            },
            {
              id: "dd20",
              type: "quote",
              content:
                '"This two-stage architecture — an approximately correct index backed by a precise re-ranking step — is a common pattern in information retrieval and recommendation systems."',
            },
            {
              id: "dd21",
              type: "heading",
              content: "Deep Dive 4: Storage Optimization — Hot/Cold Data",
              metadata: { level: 2 },
            },
            {
              id: "dd22",
              type: "paragraph",
              content:
                'Users are interested in a tiny fraction of indexed data. Two strategies: (1) Cap each inverted index at 1k-10k items — most users don\'t need all 10M posts containing "Mark". This reduces storage by orders of magnitude. (2) Move cold keyword indexes to blob storage (S3/R2). Use search analytics to identify rarely-accessed keywords. On query, check Redis first; on miss, fetch from blob storage with a small latency penalty.',
            },
            {
              id: "dd23",
              type: "heading",
              content: "Interview Level Expectations",
              metadata: { level: 2 },
            },
            {
              id: "dd24",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mid-level (E4): Define API endpoints and data model. Build both ingestion and query paths. May use naive approaches initially but respond well when probed.",
                  "Senior (E5): Speed through HLD. Have both ingestion and query detailed with proper inverted index and caching strategy. Discuss optimization of critical paths in depth.",
                  "Staff+ (E6): Deep tradeoff analysis across multiple deep dives. Proactively identify bottlenecks. Demonstrate two-stage architecture, bigrams, hot/cold storage. Teach the interviewer something new.",
                ],
              },
            },
          ],
          readingTime: 12,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════════════

    // --- MCQ (8 questions) ---

    // MCQ 1 — easy
    {
      title: "Why inverted index over LIKE query?",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is a SQL LIKE '%keyword%' query fundamentally unsuitable for Facebook-scale post search?",
        explanation:
          "LIKE '%keyword%' requires a full table scan because the leading wildcard prevents index usage. With trillions of posts and petabytes of data, even sharding across N nodes only reduces work to size/N per node — still far too slow for sub-500ms queries. An inverted index flips the lookup: instead of scanning all posts for a keyword, you look up the keyword and immediately get matching post IDs.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It requires a full table scan on every query, which is prohibitively slow at petabyte scale regardless of sharding",
              isCorrect: true,
            },
            {
              id: "b",
              text: "SQL databases cannot store text content longer than 255 characters",
              isCorrect: false,
            },
            {
              id: "c",
              text: "LIKE queries cannot match partial words within a sentence",
              isCorrect: false,
            },
            {
              id: "d",
              text: "LIKE queries are not supported in distributed SQL databases",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Redis data structure for the creation index",
      type: "question",
      sectionId: "sec_q_index_design",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What Redis data structure is most appropriate for the creation index (sorted by recency) in this design?",
        explanation:
          "A Redis List is ideal for the creation index because new posts are always appended (RPUSH) and recency queries read from the tail (LRANGE -N -1). Insertion order is preserved naturally. A sorted set would work but adds unnecessary overhead since we never need to re-order by creation time. Hash and Set do not maintain order.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Hash — mapping postId to creation timestamp",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Set — for O(1) membership checks",
              isCorrect: false,
            },
            {
              id: "c",
              text: "List — append-only with LRANGE for tail retrieval preserves insertion order naturally",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Sorted Set — with timestamp as the score",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Why caching is especially effective here",
      type: "question",
      sectionId: "sec_q_caching_reads",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Which combination of factors makes caching particularly effective for this post search system?",
        explanation:
          "Two factors make caching a near-perfect fit: (1) No personalization means any two users searching the same keyword with the same sort order get identical results — maximizing cache hit ratio. (2) The 1-minute freshness SLA provides a generous TTL window for cache entries. Together, these mean a huge fraction of queries can be served from cache.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Posts are immutable once created",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The read volume is much higher than write volume",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Redis already stores the indexes in memory",
              isCorrect: false,
            },
            {
              id: "d",
              text: "No personalization (identical results for identical queries) combined with a 1-minute freshness SLA",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why dual indexes over request-time sorting",
      type: "question",
      sectionId: "sec_q_index_design",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The design uses two separate inverted indexes (creation index and likes index) rather than a single index with request-time sorting. What is the primary reason?",
        explanation:
          'Request-time sorting requires fetching ALL post IDs for a keyword (potentially millions), looking up metadata for each, then sorting in memory. For "Taylor" with 10M matches, this means transferring hundreds of MB of post IDs and making 10M lookups — impossible within 500ms. Pre-sorted indexes allow direct top-N retrieval (LRANGE for recency, ZREVRANGE for likes) in O(log N + K) time.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Redis does not support sorting operations on lists",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Popular keywords can have millions of matching posts, making real-time fetch-and-sort impossible within the 500ms SLA",
              isCorrect: true,
            },
            {
              id: "c",
              text: "It reduces the total number of Redis keys needed",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Dual indexes ensure eventual consistency between creation time and like count",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Intersection vs bigram tradeoff",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'For multi-keyword queries like "Taylor Swift", the design proposes bigram indexing over set intersection. What is the key tradeoff?',
        explanation:
          'Bigrams provide dramatically faster reads (direct lookup vs. intersecting million-element sets), but the index size explodes because bigrams are far more unique than single words — "Swift at" appears in far fewer posts than "Swift" alone, creating sparse entries. The mitigation is to only index high-frequency bigrams and fall back to intersection for rare pairs.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Bigrams give O(1) lookup speed but dramatically increase index size due to sparse, unique word pairs",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Bigrams require less storage because they combine two keys into one",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Bigrams are faster to write but slower to read",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Set intersection is always slower regardless of list size",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "CDN vs distributed cache for search",
      type: "question",
      sectionId: "sec_q_caching_reads",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The design uses both a distributed Redis cache and a CDN for search results. What additional benefit does the CDN provide over the Redis cache alone?",
        explanation:
          "CDN nodes are geographically distributed close to users. A cache hit at the CDN edge returns results in ~10ms vs ~100ms+ through the full stack (API Gateway → Search Service → Redis cache). The CDN acts as the first layer of defense, reducing traffic to the backend for popular queries. Both layers share the same cache-control headers / TTL strategy.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "CDN provides larger cache capacity than Redis",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Geographic proximity — CDN edge cache hits return in ~10ms vs ~100ms+ through the backend",
              isCorrect: true,
            },
            {
              id: "c",
              text: "CDN handles cache invalidation more precisely",
              isCorrect: false,
            },
            {
              id: "d",
              text: "CDN guarantees zero cache misses for popular queries",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Two-stage architecture correctness guarantee",
      type: "question",
      sectionId: "sec_q_scaling_writes",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In the two-stage architecture for like-sorted search, indexes are updated only at milestone like counts (powers of 2). A post has 900 likes but the index shows it at the 512-like milestone. The system retrieves top N×2 candidates and re-ranks. Under what condition could this approach return incorrect top-N results?",
        explanation:
          "The two-stage approach retrieves N×2 candidates to account for stale scores. But if many posts have similar like counts and their true rankings differ significantly from the index order, the N×2 buffer may not capture a post that should be in the top N. For example, if 50 posts are clustered between 800-1000 likes but the index shows them all at 512, the sorted set ordering among those 50 is arbitrary, and the top N×2 might miss some. The 2× multiplier is a heuristic — in highly competitive clusters, it could need to be larger.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "When the Like Service is temporarily unavailable during re-ranking",
              isCorrect: false,
            },
            {
              id: "b",
              text: "When many posts cluster near the same milestone and their true rankings differ significantly, the N×2 buffer may exclude posts that belong in the top N",
              isCorrect: true,
            },
            {
              id: "c",
              text: "When a post crosses a milestone boundary between the index read and the re-rank",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It can never return incorrect results because the re-rank step always provides exact ordering",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Sharding inverted indexes by keyword",
      type: "question",
      sectionId: "sec_q_scaling_writes",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "The design shards Redis inverted indexes by keyword hash. A new requirement comes in: support multi-keyword intersection queries efficiently. What is the fundamental problem with keyword-based sharding for this use case?",
        explanation:
          'When indexes are sharded by keyword hash, "Taylor" and "Swift" likely reside on different Redis nodes. Computing the intersection requires fetching both full lists over the network to the Search Service. With millions of entries per keyword, this means transferring hundreds of MB across the network. Co-locating related keywords is impractical since any keyword can appear with any other. This is why bigram indexing (which creates a single key for the pair) is the preferred solution for phrase queries.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Keyword sharding prevents the use of sorted sets",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Hash-based sharding causes data skew toward popular keywords",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Redis does not support cross-shard operations",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Keywords in a phrase land on different shards, requiring network transfer of full post ID lists for intersection — potentially hundreds of MB",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Valid non-functional requirements for post search",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid non-functional requirements for the Facebook Post Search system:",
        explanation:
          "Median query latency < 500ms, high availability, and new posts searchable within 1 minute are all core NFRs from the problem statement. Strong consistency is not required — eventual consistency with a short freshness window suffices. Personalized results were explicitly de-scoped.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Median query latency under 500ms",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Personalized results based on user social graph",
              isCorrect: false,
            },
            {
              id: "c",
              text: "New posts searchable within 1 minute",
              isCorrect: true,
            },
            {
              id: "d",
              text: "High availability",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Strong consistency across all index replicas",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Strategies for handling like volume",
      type: "question",
      sectionId: "sec_q_scaling_writes",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid strategies for reducing the write pressure from 100k likes/second on the index:",
        explanation:
          "Batching aggregates likes over a time window before writing (reduces viral post writes). Milestone-based updates (powers of 2) reduce writes exponentially for all posts. Both are valid. Synchronous writes to all keyword indexes for every like is the current problem, not a solution. Write-ahead log helps durability, not write reduction.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Batch likes for a given postId over a 30-second window before writing",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Only update the likes index when like count crosses milestone thresholds (powers of 2 or 10)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Add a write-ahead log before the index to batch and compress writes",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Use Kafka to buffer like events and fan out to multiple ingestion instances",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Write synchronously to all keyword indexes for every single like event",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Components of the read path",
      type: "question",
      sectionId: "sec_q_caching_reads",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL components that are part of the optimized read path in the full design:",
        explanation:
          "The optimized read path includes: CDN (edge cache), API Gateway (auth, rate limiting), Search Service (query handling), Redis distributed cache (query result cache), and the inverted index (Redis). The Ingestion Service and Kafka are write-path components, not part of the read path.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Search Service for query handling and re-ranking",
              isCorrect: true,
            },
            {
              id: "b",
              text: "API Gateway for authentication and rate limiting",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Redis search result cache with TTL < 1 minute",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Ingestion Service for tokenization",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Kafka for buffering search requests",
              isCorrect: false,
            },
            {
              id: "f",
              text: "CDN for edge caching",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Valid storage optimization strategies",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid strategies for optimizing the storage footprint of the inverted index system:",
        explanation:
          'Capping index lists at 1k-10k items dramatically reduces storage (most users don\'t need all 10M "Mark" posts). Moving cold keyword indexes to blob storage (S3) based on access patterns saves memory. Indexing only high-frequency bigrams avoids sparse entries. However, compressing Redis sorted sets in-place is not a standard Redis feature, and deduplicating post IDs across keywords would break the inverted index structure.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Only index high-frequency bigrams, falling back to intersection for rare pairs",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Compress Redis sorted sets using LZ4 in-place to reduce memory",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Deduplicate post IDs across keyword indexes to save space",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Use count-min sketch to estimate keyword frequency and avoid indexing extremely rare terms",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Cap each inverted index at 1k-10k items to bound memory usage",
              isCorrect: true,
            },
            {
              id: "f",
              text: "Move rarely-accessed keyword indexes to blob storage (S3/R2) based on search analytics",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Inverted index construction process",
      type: "question",
      sectionId: "sec_q_index_design",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain step-by-step how a new post is processed and made searchable in this system. Cover the full flow from post creation to index availability, including tokenization and both index types.",
        explanation:
          "A strong answer traces the complete write path: Post Service → Kafka → Ingestion Service → tokenization → writes to both creation index (Redis list) and likes index (Redis sorted set with initial score 0) for every keyword.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'When a user creates a post, the Post Service publishes a creation event to Kafka. The Ingestion Service consumes this event and performs tokenization — breaking the post content into individual keywords by splitting on whitespace, converting to lowercase, and removing stop words.\n\nFor each keyword extracted (say a post has 50 keywords), the Ingestion Service performs two writes:\n1. Appends the postId to the creation index (Redis List) for that keyword using RPUSH. This maintains chronological order naturally.\n2. Adds the postId to the likes index (Redis Sorted Set) for that keyword with an initial score of 0 using ZADD.\n\nSo a 50-keyword post triggers 100 Redis writes. If bigram indexing is enabled, additional writes are made for consecutive word pairs (e.g., "Taylor Swift"), potentially doubling the write count.\n\nOnce all writes complete, the post is searchable. With Kafka buffering and parallel Ingestion Service instances, this happens well within the 1-minute freshness SLA.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Caching strategy design",
      type: "question",
      sectionId: "sec_q_caching_reads",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Design the multi-layer caching strategy for this post search system. Explain what each cache layer stores, its TTL, and how they work together. Why is caching especially effective for this particular problem?",
        explanation:
          "A strong answer covers CDN (edge, HTTP cache-control headers), distributed Redis cache (query + sort → results), TTL < 1 minute tied to freshness SLA, and explains that no-personalization + staleness tolerance make caching unusually effective.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'The caching strategy has two layers:\n\n1. CDN Edge Cache (Cloudflare/CloudFront): The /search endpoint returns cache-control headers (e.g., max-age=45). The CDN caches responses at geographically distributed edge nodes. Cache hits return in ~10ms — faster than any backend can respond. The TTL must be under 1 minute to honor the freshness SLA.\n\n2. Distributed Redis Cache: Behind the CDN, a Redis cache stores search results keyed by (query, sortOrder, page). On a CDN miss, the Search Service checks this cache before hitting the inverted index. TTL is also < 1 minute.\n\nThe two layers work hierarchically: CDN handles the broadest traffic, Redis handles CDN misses, and the inverted index handles Redis misses. For popular queries ("Taylor Swift" sorted by likes, page 1), the CDN hit rate should be very high.\n\nCaching is unusually effective here for two reasons: (1) No personalization — identical queries produce identical results, maximizing hit rates. (2) The 1-minute freshness SLA gives a generous TTL window — most caching systems dream of a full minute of acceptable staleness.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Two-stage architecture deep analysis",
      type: "question",
      sectionId: "sec_q_scaling_writes",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the two-stage architecture for like-sorted search in detail. Cover: why naive index updates fail at scale, how milestone-based updates reduce writes, the re-ranking step, its correctness guarantees, and edge cases where it might fail.",
        explanation:
          "A staff-level answer explains the 100k likes/s write pressure, logarithmic reduction via milestones, the N×2 retrieval + re-rank strategy, and the edge case of clustered milestone scores causing incorrect top-N results.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The naive approach updates every keyword's sorted set score on every like event. With 100k likes/s and posts containing ~100 keywords each, this could mean millions of Redis ZADD operations per second — unsustainable.\n\nThe two-stage architecture solves this with milestone-based index updates. The likes index is only updated when a post's like count crosses a milestone (powers of 2: 1, 2, 4, 8, 16, ...). For a post with 1000 likes, only ~10 index writes occur instead of 1000. This reduces write pressure exponentially.\n\nThe tradeoff: the index contains stale scores. A post with 900 likes might show as 512 in the index. To deliver exact results:\n1. Retrieve top N×2 candidates from the sorted set (overcollect to buffer against stale scores).\n2. For each candidate, query the Like Service for the real-time like count.\n3. Re-rank the N×2 candidates by true like count.\n4. Return the top N.\n\nCorrectness guarantee: the storage is an approximation, but the final result is exact — it reflects the most current like counts.\n\nEdge case: when many posts cluster near the same milestone (e.g., 50 posts between 800-1000 likes all stored at milestone 512), the sorted set ordering among them is arbitrary. The N×2 buffer might not capture a post that belongs in the true top N. Mitigation: increase the multiplier beyond 2× for high-traffic keywords, or use adaptive overcollection based on score density in the retrieved window.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Hot/cold storage architecture",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Design a hot/cold storage tiering strategy for the inverted index. Explain how you determine which keywords are "cold", how migration works, how queries handle the two tiers, and what happens when a cold keyword suddenly becomes hot (e.g., a trending topic about an old event).',
        explanation:
          "A staff-level answer covers access-pattern analytics, batch migration jobs, query fallback from Redis to S3 with latency penalty, and the re-promotion strategy when cold keywords become trending.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Hot tier: Redis in-memory. Cold tier: Blob storage (S3/R2).\n\nIdentifying cold keywords: Run a periodic analytics job (daily or weekly) that examines search query logs and identifies keywords with zero or near-zero queries in the past 30 days. These are candidates for cold storage. Keywords that have never been searched since creation can be migrated more aggressively.\n\nMigration: A batch job reads the cold keyword's creation index and likes index from Redis, serializes them to a structured format (e.g., sorted postId arrays in Parquet or JSON), uploads to S3 with the keyword as the key prefix, and then deletes from Redis. Metadata in a lightweight lookup table maps keywords to their storage tier.\n\nQuery handling: The Search Service first checks the tier metadata. For hot keywords, query Redis normally. For cold keywords, fetch the serialized index from S3 (latency: 50-200ms vs ~1ms for Redis). This still meets the 500ms SLA but is noticeably slower. If the cold keyword result set is small enough, load it back into a temporary Redis cache with a short TTL for subsequent page requests.\n\nCold-to-hot re-promotion: When a previously cold keyword suddenly trends (e.g., an old event resurfaces), the first few queries will be slow (S3 reads). The system detects the spike via a request counter per keyword. When the count exceeds a threshold (e.g., 100 queries/hour), trigger an async re-promotion job that loads the index back into Redis. Until re-promotion completes, an intermediate Redis cache (loaded on first cold query) handles repeat requests.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Write path scaling end-to-end",
      type: "question",
      sectionId: "sec_q_scaling_writes",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Walk through the complete write path scaling strategy for this system. Address both post creation (10k/s) and like events (100k/s). Explain how Kafka, the Ingestion Service, and Redis sharding work together. Identify the bottleneck at each layer and your mitigation strategy.",
        explanation:
          "A complete answer covers Kafka partitioning, parallel Ingestion Service instances, Redis sharding by keyword hash, the fan-out problem (100+ writes per post), like batching, and milestone-based updates.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Post Creation Path (10k posts/s):\nEach post has ~100 keywords, meaning ~200 Redis writes (100 to creation index + 100 to likes index). At 10k posts/s, that is ~2M Redis writes/s from post creation alone.\n\n1. Kafka: Post Service publishes post creation events. Partition by postId for ordering. Multiple partitions allow parallel consumption.\n2. Ingestion Service: Multiple instances consume from Kafka. Each tokenizes the post and writes to Redis. Horizontally scaled based on throughput.\n3. Redis Sharding: Index keys are sharded by keyword hash across many Redis instances (e.g., 50+ nodes). This distributes the 2M writes/s across the cluster. With consistent hashing, adding nodes is seamless.\n\nBottleneck: The fan-out from 1 post to 100+ writes amplifies throughput. If a single Redis node receives disproportionate writes (hot keyword like "the"), it bottlenecks. Mitigation: stop-word filtering eliminates most ultra-common keywords from the index.\n\nLike Event Path (100k likes/s):\nEach like needs to update sorted set scores across all keywords for that post (~100 keywords). Naive approach: 100k × 100 = 10M writes/s — unsustainable.\n\n1. Batching: A Batcher Service aggregates likes per postId over 30-second windows. A viral post getting 500 likes/30s becomes 1 write with +500 increment.\n2. Milestone-based updates (two-stage): Only write to the index when like count crosses powers of 2. 1000 likes → ~10 writes total. This reduces 10M writes/s to perhaps 100k writes/s.\n3. Kafka: Like events flow through Kafka, partitioned by postId. The Batcher Service consumes, aggregates, and only forwards milestone-crossing events to the Ingestion Service.\n\nOverall bottleneck: Redis write throughput per shard. With sharding, batching, and milestone updates combined, the system can handle the full load within Redis cluster capacity.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "System design interview walkthrough",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are in a 45-minute system design interview for Facebook Post Search. Walk through how you would structure your time. For each phase (requirements, estimation, HLD, deep dives), explain what you would cover and how a Staff+ answer differs from a Mid-level answer.",
        explanation:
          "A staff-level answer demonstrates meta-awareness of interview structure, time management, and the E4/E5/E6 progression. Should cover: proactive scoping, key estimates that influence design decisions, building simple first then optimizing, and choosing deep dives based on identified bottlenecks.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Phase 1 — Requirements (5 minutes):\nMid-level: Lists functional requirements, asks basic clarifying questions.\nStaff+: Proactively de-scopes personalization and privacy (noting the caching benefit), clarifies the "no Elasticsearch" constraint, and establishes the 1-minute freshness SLA. Explicitly acknowledges this is an infrastructure question testing data layout and indexing.\n\nPhase 2 — Estimation (5 minutes):\nMid-level: Calculates search QPS, maybe storage.\nStaff+: Calculates ALL three flows (10k posts/s, 100k likes/s, 10k searches/s), identifies this as write-heavy, notes likes are 10× posts (foreshadowing the biggest design challenge), and estimates 3.6PB total storage to motivate index size constraints. Key insight: "the estimations should influence the design, not exist for their own sake."\n\nPhase 3 — High-Level Design (10-15 minutes):\nMid-level: Builds ingestion → database → search. May start with LIKE query and improve when probed.\nStaff+: Immediately proposes inverted index (explains why LIKE query is a dead-end), builds dual indexes (creation + likes) upfront, acknowledges the tradeoff of doubled storage, and notes the like volume concern for the interviewer. Completes all 3 functional requirements before diving deep.\n\nPhase 4 — Deep Dives (20-25 minutes):\nMid-level: Addresses 1-2 topics when prompted. Proposes basic caching.\nStaff+: Proactively identifies 4 deep dive areas ranked by impact: (1) Scaling likes writes → two-stage architecture with milestone updates, (2) Caching → CDN + Redis with TTL reasoning, (3) Multi-keyword queries → bigrams with frequency-based selective indexing, (4) Storage optimization → hot/cold tiering with re-promotion. Teaches the interviewer something new (e.g., the two-stage retrieval pattern from information retrieval).',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Tokenization purpose",
      type: "question",
      sectionId: "sec_q_index_design",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'In the context of this post search system, what is "tokenization" and why is it a critical step in the ingestion pipeline?',
        explanation:
          "Tokenization is the process of breaking post content into individual keywords. It is critical because the inverted index maps keywords to posts — without tokenization, you cannot build the index.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Tokenization is the process of splitting post content into individual keywords (tokens) by breaking on whitespace, lowercasing, and removing stop words. It is critical because the inverted index is built on individual keywords — each token becomes a key that maps to the post. Without tokenization, the Ingestion Service cannot determine which index entries to update for a new post.",
          minLength: 50,
          maxLength: 500,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Write-heavy system identification",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "This system has 10k searches/s reads and 10k posts/s + 100k likes/s writes. Why is it classified as write-heavy, and what is the most impactful consequence for the design?",
        explanation:
          "The system is write-heavy because total write operations (posts + likes + their fan-out to multiple index entries) vastly exceed reads. The most impactful consequence is that the likes index update strategy becomes the primary scaling bottleneck.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "While raw request counts suggest balanced reads/writes (10k searches vs 10k posts), each post triggers 100+ index writes (fan-out to keywords), and likes at 100k/s each require multi-keyword index updates. Effective write operations are millions/s vs 10k reads/s. The most impactful consequence: the likes index update strategy becomes the dominant scaling bottleneck, driving the entire two-stage architecture design.",
          minLength: 50,
          maxLength: 500,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Count-min sketch for bigram filtering",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Explain how a count-min sketch could be used to decide which bigrams to index and which to skip. What are the tradeoffs of this probabilistic approach?",
        explanation:
          "A count-min sketch tracks approximate frequency of bigrams across posts. High-frequency bigrams are indexed; rare ones fall back to intersection. Tradeoff: false positives (indexing rare bigrams) waste storage; false negatives (skipping common bigrams) cause slower intersection-based queries.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "A count-min sketch is a probabilistic data structure that estimates element frequency with bounded error. During ingestion, every bigram is fed through the sketch. Before writing a bigram to the index, check its estimated frequency — only index it if it exceeds a threshold (e.g., appears in >1000 posts). Rare bigrams fall back to the intersection approach at query time. Tradeoffs: the sketch can overcount (false positives), causing rare bigrams to be needlessly indexed — wasting storage. It never undercounts, so common bigrams are always indexed. Space is O(1) regardless of vocabulary size, making it memory-efficient.",
          minLength: 50,
          maxLength: 500,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Redis sorted set vs list for likes index",
      type: "question",
      sectionId: "sec_q_index_design",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Why must the likes index use a Redis sorted set rather than a list? What is the time complexity of the critical operations (insert, update score, top-N retrieval)?",
        explanation:
          "A sorted set maintains elements ordered by score (like count), enabling efficient top-N retrieval. A list cannot maintain sort order when scores change. Time complexities: ZADD/ZINCRBY is O(log N), ZREVRANGE (top-N) is O(log N + K).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The likes index requires ordering by a value (like count) that changes over time. A Redis List preserves insertion order only — when a post receives new likes, you would need to remove and re-insert it, which is O(N). A Redis Sorted Set (ZSET) maintains elements ordered by score automatically. ZADD/ZINCRBY (insert/update score): O(log N). ZREVRANGE (top-N by score): O(log N + K) where K is the result count. This makes both updates and queries efficient regardless of index size.",
          minLength: 50,
          maxLength: 500,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match components to responsibilities",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each system component to its primary responsibility:",
        explanation:
          "The Ingestion Service tokenizes posts and writes to indexes. The Search Service handles query requests and re-ranking. Redis stores the inverted index (both creation and likes). The CDN caches search results at the edge. Kafka buffers creation/like events for the Ingestion Service.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          leftItems: [
            { id: "l1", text: "Ingestion Service" },
            { id: "l2", text: "Search Service" },
            { id: "l3", text: "Redis Cluster" },
            { id: "l4", text: "CDN" },
            { id: "l5", text: "Kafka" },
          ],
          rightItems: [
            { id: "r1", text: "Tokenize posts and write to inverted indexes" },
            { id: "r2", text: "Handle query requests, cache lookups, and re-ranking" },
            { id: "r3", text: "Store creation and likes inverted indexes in-memory" },
            { id: "r4", text: "Cache search results at geographically distributed edge nodes" },
            { id: "r5", text: "Buffer post creation and like events for parallel consumption" },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r1" },
            { leftId: "l2", rightId: "r2" },
            { leftId: "l3", rightId: "r3" },
            { leftId: "l4", rightId: "r4" },
            { leftId: "l5", rightId: "r5" },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match scaling problems to solutions",
      type: "question",
      sectionId: "sec_q_caching_reads",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each scaling problem to the most appropriate solution:",
        explanation:
          "Popular keyword queries benefit from CDN + Redis caching. 100k likes/s write pressure is solved by the two-stage milestone-based architecture. Multi-keyword phrase queries use bigram indexing. Petabytes of index data use hot/cold tiering. Post ingestion fan-out uses Kafka + parallel Ingestion instances.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          leftItems: [
            { id: "l1", text: "Popular keyword queries overload the Search Service" },
            { id: "l2", text: "100k likes/s each requiring multi-keyword index updates" },
            {
              id: "l3",
              text: 'Searching for "Taylor Swift" requires intersecting million-item lists',
            },
            { id: "l4", text: "Index data exceeds available Redis memory" },
            { id: "l5", text: "Post creation triggers 100+ index writes per post" },
          ],
          rightItems: [
            { id: "r1", text: "CDN edge cache + Redis search result cache with < 1min TTL" },
            { id: "r2", text: "Milestone-based updates (powers of 2) + two-stage re-ranking" },
            { id: "r3", text: "Bigram indexing for common phrase pairs" },
            { id: "r4", text: "Hot/cold tiering — move inactive keywords to S3 blob storage" },
            {
              id: "r5",
              text: "Kafka buffering + parallel Ingestion Service instances + Redis sharding",
            },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r1" },
            { leftId: "l2", rightId: "r2" },
            { leftId: "l3", rightId: "r3" },
            { leftId: "l4", rightId: "r4" },
            { leftId: "l5", rightId: "r5" },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match approaches to their tradeoff limitations",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each design approach to its primary limitation or tradeoff:",
        explanation:
          "Request-time sorting fails because of the volume of post IDs to transfer and sort. Bigrams explode index size with sparse unique pairs. Like batching only helps viral posts, not uniform-rate likes. Cold storage makes keyword re-promotion tricky when trends resurface. Two-stage ranking risks missing candidates in clustered milestone scores.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          leftItems: [
            { id: "l1", text: "Request-time sorting" },
            { id: "l2", text: "Bigram indexing" },
            { id: "l3", text: "Like batching (30s windows)" },
            { id: "l4", text: "Cold storage for rare keywords" },
            { id: "l5", text: "Two-stage milestone-based ranking" },
          ],
          rightItems: [
            { id: "r1", text: "Requires fetching and sorting millions of post IDs at query time" },
            { id: "r2", text: "Index size explodes due to sparse, highly unique word pairs" },
            { id: "r3", text: "No benefit for posts receiving steady low-rate likes (1 like/min)" },
            {
              id: "r4",
              text: "Sudden trending of old keywords requires latency-sensitive re-promotion",
            },
            {
              id: "r5",
              text: "Clustered milestone scores may cause the N×2 buffer to miss relevant candidates",
            },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r1" },
            { leftId: "l2", rightId: "r2" },
            { leftId: "l3", rightId: "r3" },
            { leftId: "l4", rightId: "r4" },
            { leftId: "l5", rightId: "r5" },
          ],
        },
      },
    },

    // --- Fill-Blanks (3 questions) ---

    // Fill-Blanks 1 — easy
    {
      title: "Inverted index definition",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "An inverted index maps _____ to the _____ that contain them, enabling O(1) lookup by keyword instead of scanning all documents.",
        explanation:
          "An inverted index maps keywords (terms) to the documents (posts) that contain them. This inverts the normal relationship where documents contain keywords, enabling direct keyword-to-document lookup.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            {
              id: "blank1",
              correctAnswer: "keywords",
              acceptableAnswers: ["keywords", "terms", "words", "tokens"],
            },
            {
              id: "blank2",
              correctAnswer: "documents",
              acceptableAnswers: ["documents", "posts", "document IDs", "post IDs"],
            },
          ],
        },
      },
    },

    // Fill-Blanks 2 — easy
    {
      title: "Scale estimates",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "With 1B users producing 1 post/day and 10 likes/day, the system handles _____ posts/second and _____ likes/second, making it a _____-heavy system.",
        explanation:
          "Posts: 1B / 100k seconds ≈ 10k/s. Likes: 1B × 10 / 100k ≈ 100k/s. The massive write volume (especially from likes with their index fan-out) makes this system write-heavy.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            {
              id: "blank1",
              correctAnswer: "10k",
              acceptableAnswers: ["10k", "10,000", "10000"],
            },
            {
              id: "blank2",
              correctAnswer: "100k",
              acceptableAnswers: ["100k", "100,000", "100000"],
            },
            {
              id: "blank3",
              correctAnswer: "write",
              acceptableAnswers: ["write"],
            },
          ],
        },
      },
    },

    // Fill-Blanks 3 — medium
    {
      title: "Redis sorted set operations",
      type: "question",
      sectionId: "sec_q_index_design",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "The likes index uses a Redis _____ where the score represents the _____. Retrieving the top-N results uses the _____ command with time complexity O(_____).",
        explanation:
          "The likes index uses a Redis Sorted Set (ZSET) with the like count as the score. ZREVRANGE retrieves elements in descending score order. Time complexity is O(log N + K) where K is the number of elements returned.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            {
              id: "blank1",
              correctAnswer: "sorted set",
              acceptableAnswers: ["sorted set", "ZSET", "zset"],
            },
            {
              id: "blank2",
              correctAnswer: "like count",
              acceptableAnswers: ["like count", "number of likes", "likes", "like score"],
            },
            {
              id: "blank3",
              correctAnswer: "ZREVRANGE",
              acceptableAnswers: ["ZREVRANGE", "zrevrange", "ZREVRANGEBYSCORE"],
            },
            {
              id: "blank4",
              correctAnswer: "log N + K",
              acceptableAnswers: ["log N + K", "log(N) + K", "O(log N + K)"],
            },
          ],
        },
      },
    },

    // --- Numerical (2 questions) ---

    // Numerical 1 — medium
    {
      title: "Index write fan-out estimation",
      type: "question",
      sectionId: "sec_q_scaling_writes",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "If the system processes 10,000 new posts per second and each post contains an average of 100 keywords, and we maintain dual indexes (creation + likes), how many total Redis write operations per second are needed for post ingestion alone? (Express in millions)",
        explanation:
          "10,000 posts/s × 100 keywords/post × 2 indexes (creation + likes) = 2,000,000 writes/s = 2 million writes/s. This highlights why Redis sharding is essential.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 2,
          tolerance: 0.5,
          unit: "million writes/s",
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Two-stage write reduction calculation",
      type: "question",
      sectionId: "sec_q_scaling_writes",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A post has 100 keywords in its content. Using the naive approach, reaching 1,000 likes requires 100,000 index updates (1,000 likes × 100 keywords). With milestone-based updates at powers of 2, how many total index updates are needed to reach 1,000 likes? (Hint: milestones are 1, 2, 4, 8, 16, 32, 64, 128, 256, 512)",
        explanation:
          "Milestones at powers of 2 up to 1000: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 = 10 milestones. Each milestone triggers 100 keyword updates. Total = 10 × 100 = 1,000 index updates. This is a 100× reduction from the naive 100,000 updates.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 1000,
          tolerance: 100,
          unit: "index updates",
        },
      },
    },
  ],
};
