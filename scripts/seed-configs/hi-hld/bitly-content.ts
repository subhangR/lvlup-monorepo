/**
 * Bitly (URL Shortener) — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: functional/non-functional requirements, short code generation,
 * caching, scaling reads/writes, database design, and production concerns
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const bitlyContent: StoryPointSeed = {
  title: "Design a URL Shortener (Bit.ly)",
  description:
    "Master the system design of a URL shortening service — covering short code generation strategies, read-heavy caching, database scaling, and production tradeoffs at 1B URLs and 100M DAU.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements & API Design", orderIndex: 1 },
    { id: "sec_q_code_generation", title: "Short Code Generation Strategies", orderIndex: 2 },
    { id: "sec_q_caching", title: "Caching & Read Optimization", orderIndex: 3 },
    { id: "sec_q_scaling", title: "Scaling & Distributed Architecture", orderIndex: 4 },
    { id: "sec_q_production", title: "Production Concerns & Tradeoffs", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Design
    {
      title: "URL Shortener — Requirements & High-Level Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "URL Shortener — Requirements & High-Level Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is a URL Shortener?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "A URL shortener (like Bit.ly) converts long URLs into short, manageable links and redirects users who visit the short link to the original URL. It is one of the most common entry-level system design interview questions, but a strong answer requires depth in short code generation, caching, and scaling.",
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
                  "Users submit a long URL and receive a shortened version.",
                  "Optionally, users specify a custom alias (e.g., short.ly/my-alias).",
                  "Optionally, users specify an expiration date for the short URL.",
                  "Users access the original URL by visiting the shortened URL (redirect).",
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
                  "Uniqueness: Each short code maps to exactly one long URL.",
                  "Low latency: Redirection should occur in < 100ms.",
                  "High availability: 99.99% uptime (availability over consistency).",
                  "Scale: Support 1B shortened URLs and 100M DAU.",
                ],
              },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "A critical observation is the extreme read-to-write ratio. Users click short URLs far more often than they create them — roughly 1000:1. This asymmetry drives caching strategy, database choice, and the separation of read/write services.",
            },
            {
              id: "b8",
              type: "heading",
              content: "Core Entities & API Design",
              metadata: { level: 2 },
            },
            {
              id: "b9",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Original URL: The long URL the user wants to shorten.",
                  "Short URL / Short Code: The shortened identifier (e.g., abc123).",
                  "User: The creator of the shortened URL.",
                ],
              },
            },
            {
              id: "b10",
              type: "code",
              content:
                '// Create a short URL\nPOST /urls\n{\n  "long_url": "https://www.example.com/some/very/long/url",\n  "custom_alias": "optional_custom_alias",\n  "expiration_date": "optional_expiration_date"\n}\n-> { "short_url": "http://short.ly/abc123" }\n\n// Redirect to original URL\nGET /{short_code}\n-> HTTP 302 Redirect to the original long URL',
              metadata: { language: "text" },
            },
            {
              id: "b11",
              type: "heading",
              content: "High-Level Architecture",
              metadata: { level: 2 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "The basic flow: Client sends POST /urls → Primary Server generates a short code, stores the mapping in the database, and returns the short URL. On redirect, Client sends GET /{short_code} → Server looks up the mapping and returns an HTTP 302 redirect to the original URL.",
            },
            {
              id: "b13",
              type: "heading",
              content: "301 vs 302 Redirects",
              metadata: { level: 3 },
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                "301 (Permanent Redirect): Browsers cache this — subsequent requests bypass your server entirely. Good for performance but you lose control over the link. 302 (Found / Temporary Redirect): Browsers do NOT cache — every request goes through your server. Preferred for URL shorteners because it allows link updates, expiration enforcement, and analytics tracking.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Deep Dives — Short Code Generation & Caching
    {
      title: "Deep Dives — Short Code Generation & Scaling Reads",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Short Code Generation & Scaling Reads",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Short Code Generation Strategies",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "The core challenge: generate codes that are unique, short, and efficiently produced. Three approaches exist, each with distinct tradeoffs.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Bad: URL Prefix Truncation",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "Taking the first N characters of the input URL as the short code. This fails uniqueness — any two URLs sharing a prefix collide. Never viable.",
            },
            {
              id: "c5",
              type: "heading",
              content: "Good: Hash Function + Base62",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "Use SHA-256 (or similar) to hash the long URL, then base62-encode the result and take the first 8 characters. Base62 uses a-z, A-Z, 0-9 (excluding + and / which are problematic in URLs). 8 characters gives 62^8 ≈ 218 trillion possible codes. Deterministic hashing enables deduplication but is susceptible to collisions at scale. Handle collisions via a UNIQUE constraint on the short_code column and bounded retries (3-5 attempts with a random salt).",
            },
            {
              id: "c7",
              type: "heading",
              content: "Best: Unique Counter + Base62",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                'Use a centralized Redis counter with atomic INCR. Each counter value is unique — zero collision risk. Redis is single-threaded, so two simultaneous INCR calls always return different values. 1B URLs in base62 = 6-character codes ("15ftgG"). 62^6 ≈ 56B codes before needing 7 characters.',
            },
            {
              id: "c9",
              type: "paragraph",
              content:
                "Tradeoff: Sequential codes are predictable (enumeration attacks). Mitigate with XOR obfuscation or accept the tradeoff since short URLs are public by nature. In distributed environments, use counter batching: each Write Service instance reserves a batch (e.g., 1000 values) from Redis, eliminating per-request network calls.",
            },
            {
              id: "c10",
              type: "heading",
              content: "Scaling Reads: Database Indexing",
              metadata: { level: 2 },
            },
            {
              id: "c11",
              type: "paragraph",
              content:
                "Without indexing, redirect lookups require a full table scan — O(n) and unacceptable at scale. A B-tree index on the short_code column provides O(log n) lookups. Making short_code the primary key gives both indexing and uniqueness enforcement automatically.",
            },
            {
              id: "c12",
              type: "heading",
              content: "Scaling Reads: In-Memory Cache (Redis)",
              metadata: { level: 2 },
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                "With 100M DAU × 5 redirects/day = 500M redirects/day ≈ 5,787 RPS average. With peak spikes at 100x, that is ~600K RPS — far beyond what a single database can serve. An in-memory cache (Redis/Memcached) between the app server and database serves popular lookups from memory. Memory access (~100ns) is 1,000x faster than SSD (~0.1ms). Cache miss → query DB → populate cache. Use LRU eviction. Set cache TTL ≤ URL expiration time to avoid serving stale/expired redirects.",
            },
            {
              id: "c14",
              type: "heading",
              content: "Scaling Reads: CDN & Edge Computing",
              metadata: { level: 2 },
            },
            {
              id: "c15",
              type: "paragraph",
              content:
                "For popular short codes, serve redirects from CDN edge nodes (Cloudflare Workers, Lambda@Edge) close to the user — the request never reaches your origin server. Tradeoff: cache invalidation across global CDN nodes is complex, and edge functions have execution time/memory limits. You are trading cost and complexity for latency.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Scaling Writes & Production Considerations
    {
      title: "Scaling Writes & Production Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Scaling Writes & Production Architecture",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Database Sizing & Technology Choice",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "Each row: short_code (~8B) + long_url (~100B) + timestamps (~16B) + optional alias (~100B) ≈ 500 bytes with metadata. 1B rows × 500B = 500GB — well within a single Postgres instance on modern SSDs. Write throughput is low (~100K new URLs/day ≈ 1 write/second), so any reasonable RDBMS works. Pick whatever you have production experience with.",
            },
            {
              id: "d3",
              type: "heading",
              content: "High Availability",
              metadata: { level: 2 },
            },
            {
              id: "d4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Database Replication: Postgres synchronous/asynchronous replicas. If primary goes down, promote a replica.",
                  "Database Backups: Periodic snapshots stored in a separate location for disaster recovery.",
                  "Redis HA: Use Redis Sentinel or Redis Cluster with automatic failover for the counter service.",
                ],
              },
            },
            {
              id: "d5",
              type: "heading",
              content: "Separating Read & Write Services",
              metadata: { level: 2 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Given the extreme read-to-write ratio, separate into a Read Service (handles redirects) and a Write Service (handles URL creation). Scale each independently — you will need far more Read Service instances than Write Service instances. This is a classic CQRS-lite pattern.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Counter Batching for Distributed Writes",
              metadata: { level: 2 },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "When horizontally scaling the Write Service, all instances need the next unique counter value. Instead of calling Redis INCR for every request, each instance reserves a batch (e.g., 1000 values) atomically. Redis increments by 1000 and returns the start of the range. The instance uses values locally until exhausted, then requests a new batch. This reduces Redis load while maintaining global uniqueness.",
            },
            {
              id: "d9",
              type: "heading",
              content: "Multi-Region Deployment",
              metadata: { level: 2 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "Allocate disjoint counter ranges per region (e.g., Region A: 0–1B, Region B: 1B–2B) to avoid cross-region coordination. Writes go to the local region Redis. Reads can be served globally via distributed caches and CDN. If Redis fails before replicating the latest counter, a few values may be lost — but since we only need uniqueness, not continuity, this is acceptable. The database UNIQUE constraint is the ultimate safety net.",
            },
            {
              id: "d11",
              type: "heading",
              content: "What Distinguishes Staff-Level Answers",
              metadata: { level: 2 },
            },
            {
              id: "d12",
              type: "quote",
              content:
                "Staff candidates quickly recognize this is a read-heavy system and structure their design accordingly from the start. They proactively discuss multi-region deployment, counter range allocation, Redis failover, security implications of predictable codes, custom alias collision prevention, and URL expiration cleanup — without being prompted.",
            },
          ],
          readingTime: 7,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "HTTP redirect status code for URL shorteners",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "Which HTTP status code is preferred for URL shortener redirects, and why?",
        explanation:
          "302 (Found) is preferred because it prevents browser caching of the redirect. This ensures every request goes through the server, allowing link updates, expiration enforcement, and analytics tracking. A 301 would cause browsers to cache the redirect permanently, bypassing the server on subsequent requests.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "301 — permanent redirect is faster since the browser caches it",
              isCorrect: false,
            },
            {
              id: "b",
              text: "307 — required for all POST-to-GET redirect scenarios",
              isCorrect: false,
            },
            {
              id: "c",
              text: "200 — return the long URL in the response body for the client to handle",
              isCorrect: false,
            },
            {
              id: "d",
              text: "302 — prevents browser caching so the server retains control over the redirect",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why base62 encoding over base64",
      type: "question",
      sectionId: "sec_q_code_generation",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why do URL shorteners typically use base62 encoding (a-z, A-Z, 0-9) instead of base64?",
        explanation:
          'Base64 includes "+" and "/" characters. The slash is a URL path separator and the plus sign can be interpreted as a space in query strings. Base62 avoids these by using only alphanumeric characters, making codes safe to embed directly in URLs without encoding.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Base62 produces shorter codes than base64 for the same input",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Base62 has better collision resistance than base64",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Base64 is not supported by modern browsers",
              isCorrect: false,
            },
            {
              id: "d",
              text: 'Base64 includes "+" and "/" which conflict with URL path separators and query string encoding',
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Core entity identification",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When designing the data model for a URL shortener, which is the most important column to designate as the primary key?",
        explanation:
          "The short_code should be the primary key because: (1) it is the main lookup key for the most frequent operation (redirects), (2) primary keys are automatically indexed, providing O(log n) lookup, and (3) it enforces uniqueness at the database level. The long_url is not a good primary key because multiple short codes can map to the same long URL.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "short_code — it is the primary lookup key and must be unique",
              isCorrect: true,
            },
            {
              id: "b",
              text: "user_id — all queries are scoped to a specific user",
              isCorrect: false,
            },
            {
              id: "c",
              text: "long_url — it is the original data that needs to be retrieved",
              isCorrect: false,
            },
            {
              id: "d",
              text: "created_at — timestamp ordering is needed for all operations",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Hash-based code generation collision handling",
      type: "question",
      sectionId: "sec_q_code_generation",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When using SHA-256 hashing + base62 truncation for short code generation, what is the correct strategy for handling collisions?",
        explanation:
          "The correct approach is a UNIQUE constraint on the short_code column combined with bounded retries (3-5 attempts) using a random salt. The UNIQUE constraint catches collisions at the database level, and adding a salt to the hash input produces a different code on retry. Unbounded retries could cause performance issues under high collision rates. Increasing code length would work but defeats the purpose of a URL shortener. Ignoring collisions would overwrite existing mappings.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Use a longer hash output (16+ characters) to make collisions statistically impossible",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Check the database for existing codes before inserting — if found, append a random character",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Use an unbounded retry loop that keeps re-hashing until a unique code is found",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Add a UNIQUE constraint on short_code and retry with a random salt, bounded to 3-5 attempts",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Redis counter vs hash function tradeoff",
      type: "question",
      sectionId: "sec_q_code_generation",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Compared to hash-based short code generation, what is the primary advantage AND the primary risk of using a centralized Redis counter?",
        explanation:
          "A Redis counter guarantees uniqueness (zero collisions) because each INCR returns a strictly monotonic value. However, it introduces a single point of failure and a coordination bottleneck in distributed environments. The predictability concern is real but secondary — it can be mitigated with XOR obfuscation. The claim about Redis being slower is false — Redis INCR is O(1) and sub-millisecond.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Advantage: shorter codes. Risk: Redis is slower than computing a hash.",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Advantage: deduplication of identical URLs. Risk: counter overflow after 2^32 values.",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Advantage: no database needed. Risk: counter values are not URL-safe.",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Advantage: zero collisions guaranteed. Risk: single point of failure and coordination overhead in distributed systems.",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Cache TTL and URL expiration interaction",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A URL shortener supports optional expiration dates. How should the cache TTL relate to the URL expiration time?",
        explanation:
          "The cache TTL must be less than or equal to the URL expiration time. If the cache TTL is longer, expired URLs would continue to be served from cache even after they should return 410 Gone. Setting it shorter than expiration ensures stale entries are evicted before or when the URL expires. A fixed 24-hour TTL ignores URLs that expire sooner. Disabling caching for expiring URLs wastes performance for what might be a majority of URLs.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Use a fixed 24-hour TTL for all entries regardless of expiration",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Cache TTL should match the URL expiration time exactly for consistency",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Cache TTL should be ≤ the URL expiration time to prevent serving stale redirects",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Disable caching entirely for URLs with expiration dates",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Counter batching failure scenario",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In a counter-batching scheme where each Write Service instance reserves 1000 counter values from Redis, what happens if an instance crashes after reserving a batch but before using all values?",
        explanation:
          'The unused counter values in the crashed instance\'s batch are simply lost — they will never be assigned to any URL. This is acceptable because the system only requires uniqueness, not continuity. No short code will be duplicated because the next instance will get a different batch range. The "gaps" in the counter sequence are harmless. This is a deliberate tradeoff: we accept minor counter waste in exchange for dramatically reduced Redis coordination overhead.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The unused values are automatically returned to Redis via a cleanup mechanism",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The system must block all writes until the crashed instance is recovered and its batch is accounted for",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The unused values are lost, creating gaps in the sequence — acceptable because uniqueness only requires no duplicates, not continuity",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Other instances may receive overlapping counter values, causing collisions",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Multi-region counter coordination",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "For a multi-region URL shortener deployment, which approach correctly handles globally unique counter values without cross-region coordination on every write?",
        explanation:
          "Allocating disjoint counter ranges per region (e.g., Region A: 0–1B, Region B: 1B–2B) eliminates cross-region coordination entirely. Each region operates its own Redis counter independently within its allocated range. A single global Redis would require cross-region network calls on every write, adding 50-200ms latency. Eventual consistency between regional databases would cause duplicate short codes. Timestamp-based codes lack sufficient entropy for uniqueness.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Use eventually consistent counters across regions and resolve collisions asynchronously",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Use a single global Redis instance and route all writes to it across regions",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Generate codes using high-resolution timestamps combined with region identifiers",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Allocate disjoint counter ranges per region so each region's Redis operates independently within its range",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Valid non-functional requirements for a URL shortener",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL valid non-functional requirements for a production URL shortener:",
        explanation:
          'Uniqueness of short codes is essential — two codes mapping to different URLs would break the service. Low redirect latency (< 100ms) is critical for user experience. High availability (99.99%) is required because broken short links damage trust. Strong consistency is NOT a core requirement — eventual consistency is acceptable for analytics and the system explicitly favors availability over consistency (AP system). Real-time analytics is explicitly "below the line" in typical scoping.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Redirect latency < 100ms", isCorrect: true },
            { id: "b", text: "Strong consistency for all read operations", isCorrect: false },
            {
              id: "c",
              text: "Short code uniqueness (each code maps to exactly one URL)",
              isCorrect: true,
            },
            { id: "d", text: "System availability of 99.99%", isCorrect: true },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Benefits of separating read and write services",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid reasons for separating a URL shortener into independent Read and Write services:",
        explanation:
          "Separating read and write services allows independent scaling — you can run many more Read Service instances than Write instances given the 1000:1 read-to-write ratio. Different optimization strategies can be applied: the Read Service can be optimized for cache-first lookups while the Write Service handles counter coordination. However, this does NOT eliminate the need for a shared database (both services ultimately read/write the same URL mappings) and does NOT reduce overall system complexity — it increases it.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Read and write services can be scaled independently based on their different load profiles",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Each service can be optimized differently — Read for cache-first, Write for counter coordination",
              isCorrect: true,
            },
            {
              id: "c",
              text: "It eliminates the need for a shared database between services",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Failures in the Write Service do not affect redirect availability",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Cache warming and invalidation challenges",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid challenges when implementing an in-memory cache (Redis) for URL shortener redirects:",
        explanation:
          "Cache warm-up is a real issue — after a restart, all requests hit the database until the cache is populated. Memory limits require eviction policies (LRU is typical). Expired URL handling requires cache TTL alignment. However, write-through consistency is NOT a major concern because URL mappings are essentially immutable after creation — a URL mapping is written once and then only read. The rare deletion/expiration case is handled by TTL, not write-through.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Memory limits require choosing an eviction policy (e.g., LRU) and cache size",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Write-through consistency is difficult because URL mappings change frequently",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Cold cache after restart means initial requests all hit the database",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Cache TTL must align with URL expiration to avoid serving stale redirects",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Staff-level production concerns",
      type: "question",
      sectionId: "sec_q_production",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are production concerns that distinguish a Staff-level answer from a Senior-level answer in a URL shortener design interview? Select ALL that apply.",
        explanation:
          "Staff-level candidates proactively address: (1) predictable sequential codes enabling URL enumeration and how to mitigate it (XOR obfuscation), (2) multi-region counter range allocation to avoid cross-region coordination, (3) what happens during Redis failover and why lost counter values are acceptable. However, implementing a distributed consensus protocol (Raft/Paxos) for counter management is over-engineering — Redis Sentinel provides sufficient HA, and the database UNIQUE constraint is the ultimate safety net.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Redis failover behavior — why losing a few counter values is acceptable given the uniqueness-not-continuity requirement",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Multi-region counter range allocation to eliminate cross-region write coordination",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Implementing Raft consensus for the counter service to guarantee zero data loss",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Security implications of predictable sequential short codes and mitigation strategies",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Compare hash-based vs counter-based short code generation",
      type: "question",
      sectionId: "sec_q_code_generation",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare and contrast the hash-based (SHA-256 + base62 truncation) and counter-based (Redis INCR + base62) approaches for generating short codes in a URL shortener. Discuss the tradeoffs in terms of uniqueness, predictability, and distributed scalability.",
        explanation:
          "A strong answer covers: Hash-based is stateless and enables deduplication but has collision risk that grows with scale, requiring retry logic. Counter-based guarantees uniqueness but produces predictable/sequential codes and requires coordination (centralized Redis). For distributed scaling, counter batching reduces Redis load but wastes values on instance failure. Hash-based scales naturally since each server can compute independently but needs a UNIQUE constraint as a safety net.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Hash-based approach: Uses SHA-256 to hash the long URL, base62-encodes it, and takes the first 8 characters. Advantages: stateless (no coordination needed), deterministic (same URL → same code, enabling deduplication). Disadvantages: collision risk grows with scale — at n codes in a space of size S, collision probability is n/S per new code. Requires bounded retries with random salt and a UNIQUE constraint.\n\nCounter-based approach: Uses Redis atomic INCR to generate a monotonically increasing counter, then base62-encodes it. Advantages: zero collision risk, very efficient (O(1) Redis operation). Disadvantages: produces sequential/predictable codes (enumeration attacks possible — mitigate with XOR obfuscation), requires centralized coordination.\n\nFor distributed scaling: Counter batching (each instance reserves 1000 values) reduces Redis calls but wastes values on instance crashes (acceptable since we need uniqueness, not continuity). Hash-based scales naturally since each server computes independently, but collision rates increase at scale.\n\nStaff-level insight: Most production systems use the counter approach because collision-free guarantees simplify operations, and predictability concerns are secondary since short URLs are inherently public.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the read-to-write ratio and its architectural implications",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "A URL shortener has a read-to-write ratio of approximately 1000:1. Explain how this asymmetry should influence at least three architectural decisions in your system design.",
        explanation:
          "A strong answer identifies specific architectural decisions driven by the read-heavy workload: (1) Aggressive caching — multi-layer (application cache, Redis, CDN), (2) Separation of read/write services for independent scaling, (3) Database optimization focused on read performance (indexing, read replicas), (4) CDN/edge computing for popular URLs. The answer should quantify the impact where possible.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "The 1000:1 read-to-write ratio means redirects dominate the workload. This drives three key architectural decisions:\n\n1. Multi-layer caching: An in-memory cache (Redis) between the application and database is essential. With 100M DAU × 5 redirects = 500M daily reads, peak load reaches ~600K RPS. Memory access (100ns) is 1000x faster than SSD (0.1ms), making cache hits critical for meeting the <100ms latency requirement.\n\n2. Service separation (CQRS-lite): Splitting into Read Service and Write Service allows independent scaling. We might need 50 Read Service instances but only 2-3 Write Service instances. This optimizes resource utilization and isolates failure domains — a Write Service outage doesn't affect redirects.\n\n3. Database read optimization: Make short_code the primary key for automatic B-tree indexing. Consider read replicas to distribute query load. Since writes are ~1/second, a single primary with multiple read replicas is sufficient.\n\nBonus: For popular URLs, CDN edge nodes can serve redirects without hitting the origin, further reducing latency for geographically distributed users.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the complete redirect flow with caching",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the complete request flow when a user visits a shortened URL (e.g., short.ly/abc123). Include all layers from the user's browser to the database, covering cache hits, cache misses, expired URLs, and the HTTP response. Explain what happens at each step.",
        explanation:
          "A complete answer traces the full path: Browser → (CDN edge optional) → Load Balancer → Read Service → Cache check → DB fallback → Cache population → HTTP 302 response. Must handle: cache hit (fast path), cache miss (DB lookup + cache write), expired URL (410 Gone + cache eviction), and not-found (404). Should mention the Location header in the 302 response.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Complete redirect flow for GET /abc123:\n\n1. Browser sends GET request to short.ly/abc123\n2. DNS resolves to load balancer (or CDN if configured)\n3. Load balancer routes to a Read Service instance\n4. Read Service checks the in-memory cache (Redis) for key \"abc123\"\n\nCache HIT path:\n5a. Cache returns the long URL and expiration date\n6a. Read Service checks if the URL has expired (compare expiration_date to current time)\n7a. If valid: return HTTP 302 with Location: https://original-long-url.com\n7b. If expired: evict from cache, return HTTP 410 Gone\n\nCache MISS path:\n5b. Query the database: SELECT long_url, expiration_date FROM urls WHERE short_code = 'abc123'\n6b. If not found: return HTTP 404 Not Found\n7b. If found and not expired: write to cache with TTL = min(default_TTL, time_until_expiration), return HTTP 302\n8b. If found but expired: return HTTP 410 Gone, optionally mark for cleanup\n\nBrowser behavior:\n- On receiving 302, browser automatically follows the Location header to the original URL\n- 302 is NOT cached by the browser, so future clicks will go through our server again\n\nStaff consideration: For popular URLs, a CDN layer (step 2) can serve the redirect at the edge, never reaching the origin. Cache invalidation across CDN nodes adds complexity but reduces p99 latency significantly.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Handle custom aliases and collision prevention",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Users can optionally provide a custom alias (e.g., short.ly/my-product-launch) instead of receiving a generated short code. Describe the design challenges this introduces and how you would prevent collisions between custom aliases and auto-generated codes.",
        explanation:
          "Must address: (1) Namespace collision — a custom alias could match a future auto-generated code, (2) Solutions: prefix separation (generated codes start with a character custom aliases cannot use), separate database columns/tables, or reserve a character range. (3) Validation: length limits, character restrictions, profanity filtering. (4) Race conditions on popular aliases.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Custom aliases introduce several design challenges:\n\n1. Namespace collision: If auto-generated codes produce "abc123" and a user requests the custom alias "abc123", they would collide. Solutions:\n   - Prefix separation: Generated codes start with a reserved character (e.g., underscore) that custom aliases cannot use. Generated: _abc123, Custom: my-product.\n   - Separate namespaces: Store custom aliases in a different column or table, with the routing layer checking custom aliases first, then generated codes.\n   - Range reservation: If using counter-based generation, custom aliases use a different character set or length range.\n\n2. Validation requirements:\n   - Length limits (e.g., 3-30 characters) to prevent abuse\n   - Allowed characters: alphanumeric + hyphens (no special characters)\n   - Profanity/trademark filtering\n   - Uniqueness check before insertion\n\n3. Race conditions: Two users simultaneously requesting the same custom alias. Solution: Use a database UNIQUE constraint — the second INSERT fails, and the application retries or returns an error. For high contention, use optimistic locking or a distributed lock.\n\n4. Reservation vs. creation: Consider allowing users to "reserve" an alias before creating the URL, with a short TTL on reservations to prevent squatting.\n\nArchitectural impact: The Write Service must now check for alias availability before generating a code, adding a database read to the write path. This is acceptable given the low write throughput (~1 write/second).',
          minLength: 150,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "URL expiration cleanup strategy",
      type: "question",
      sectionId: "sec_q_production",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a strategy for cleaning up expired URLs from both the cache and the database. Consider the tradeoffs between eager cleanup (background jobs) and lazy cleanup (check on access). What approach would you recommend and why?",
        explanation:
          "Should discuss: lazy deletion (check expiration on read, return 410), eager deletion (background cron job scanning for expired rows), and hybrid approaches. Must consider: cache TTL alignment, database scan cost at scale, index on expiration_date for efficient scanning. Staff-level: discuss soft vs hard delete, analytics retention, and the cost of full table scans vs indexed range queries.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "I recommend a hybrid approach combining lazy and eager cleanup:\n\nLazy cleanup (on access):\n- On every redirect request, check if the URL has expired before redirecting\n- If expired: return HTTP 410 Gone and evict from cache\n- Advantage: zero cost for URLs that are never accessed again\n- Disadvantage: expired rows accumulate in the database, wasting storage\n\nEager cleanup (background job):\n- Run a periodic background job (e.g., every hour) that deletes expired rows\n- Query: DELETE FROM urls WHERE expiration_date < NOW() LIMIT 10000\n- Use batch deletes with LIMIT to avoid long-running transactions\n- Requires a B-tree index on expiration_date for efficient range scans\n- Advantage: reclaims storage and keeps the table size manageable\n- Disadvantage: adds operational complexity and consumes database I/O\n\nCache alignment:\n- Set cache TTL = min(default_cache_TTL, time_until_url_expiration)\n- This ensures cached entries are evicted before or when they expire\n- No explicit cache invalidation needed for expiration — TTL handles it\n\nStaff considerations:\n- Soft delete (mark as expired) vs hard delete: soft delete preserves data for analytics but increases table size. For a URL shortener at 1B rows, hard delete is preferred since analytics is out of scope.\n- At scale, the background job should be sharded by expiration_date ranges to parallelize cleanup.\n- Monitor the ratio of expired-to-active rows to tune cleanup frequency.",
          minLength: 150,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Database technology selection justification",
      type: "question",
      sectionId: "sec_q_production",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Justify your database technology choice for a URL shortener that must store 1B URL mappings and support 100M DAU. Consider storage size, read/write patterns, and high availability requirements. Why might this be simpler than candidates expect?",
        explanation:
          "Key insight: the database choice is not critical because (1) storage is small (~500GB for 1B rows), (2) write throughput is low (~1 write/sec), (3) the cache handles read throughput. Most candidates over-engineer this. A single Postgres instance with read replicas suffices. The answer should show the math.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The database choice is simpler than most candidates think. Here is the math:\n\nStorage: Each row ≈ 500 bytes (short_code 8B + long_url 100B + timestamps 16B + optional alias 100B + metadata). 1B rows × 500B = 500GB — easily fits on a single modern SSD.\n\nWrite throughput: ~100K new URLs/day ÷ 86,400 seconds ≈ 1.2 writes/second. This is trivial for any database.\n\nRead throughput: With an in-memory cache handling >99% of reads (cache hit rate), the database sees maybe 1% of 600K peak RPS = 6K reads/second. With proper indexing, a single Postgres instance handles this easily.\n\nMy recommendation: PostgreSQL.\n- Mature, well-understood, excellent tooling\n- Built-in replication for HA (streaming replication + pg_failover)\n- B-tree index on short_code (primary key) provides O(log n) lookups\n- UNIQUE constraint enforces code uniqueness at the database level\n- 500GB is well within Postgres operational limits\n\nHigh availability: Primary with 1-2 synchronous replicas. If primary fails, promote a replica. Periodic pg_dump backups to cloud storage for disaster recovery.\n\nWhy not NoSQL? DynamoDB or Cassandra would work but add operational complexity without clear benefits. The data model is simple (key-value lookup), the dataset fits on one machine, and write throughput is minimal. NoSQL shines at massive write throughput or flexible schemas — neither applies here.\n\nStaff insight: In interviews, pick whichever database you have production experience with and justify it with numbers. Showing that you can estimate storage and throughput requirements is more impressive than debating database brands.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Short code length for 1B URLs",
      type: "question",
      sectionId: "sec_q_code_generation",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Using base62 encoding with a counter-based approach, what is the minimum number of characters needed to support 1 billion unique short codes? Show your reasoning.",
        explanation:
          '62^5 = 916,132,832 (< 1B), 62^6 = 56,800,235,584 (> 1B). So 6 characters are needed. In fact, 1,000,000,000 in base62 encodes to the 6-character string "15ftgG". This means even at 1B URLs, codes remain compact.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "6 characters (62^5 ≈ 916M < 1B, 62^6 ≈ 56.8B > 1B)",
          acceptableAnswers: ["6", "6 characters", "six", "six characters"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Why Redis for the global counter",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In one sentence, explain why Redis is well-suited for managing a global counter in a URL shortener's distributed Write Service.",
        explanation:
          "Redis is single-threaded and supports atomic INCR operations, meaning two simultaneous calls always return different values with no race conditions — guaranteeing globally unique counter values without explicit locking.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Redis is single-threaded with atomic INCR, so concurrent calls always return unique values without race conditions.",
          acceptableAnswers: ["single-threaded", "atomic", "INCR", "no race conditions"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Predictable code mitigation",
      type: "question",
      sectionId: "sec_q_production",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Counter-based short codes are sequential and predictable. Name one technique to make them non-predictable while preserving uniqueness, and explain why this might not be necessary.",
        explanation:
          "XOR with a secret key (or any reversible bijective transformation) scrambles the sequence while preserving uniqueness (bijective = one-to-one mapping). However, mitigation may be unnecessary because short URLs are inherently public — they are designed to be shared. Enumeration reveals URLs that were already intended to be accessible.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "XOR with a secret key (reversible transformation preserving uniqueness). May not be necessary because short URLs are public by nature.",
          acceptableAnswers: [
            "XOR",
            "xor",
            "bijective",
            "reversible transformation",
            "encryption",
            "shuffle",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Redis failure impact on counter",
      type: "question",
      sectionId: "sec_q_production",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "If the Redis counter fails before replicating the latest counter value, what is the concrete impact on the URL shortener, and what database mechanism serves as the ultimate safety net?",
        explanation:
          "A few counter values may be lost (skipped), but since the system only requires uniqueness — not continuity — this is harmless. The UNIQUE constraint on the short_code column in the database is the ultimate safety net: even if Redis somehow issued a duplicate value, the database INSERT would fail and the application would retry.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "A few counter values are lost (gaps), which is acceptable since uniqueness does not require continuity. The database UNIQUE constraint on short_code is the safety net.",
          acceptableAnswers: ["UNIQUE constraint", "unique constraint", "gaps", "lost values"],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match HTTP status codes to their redirect behavior",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each HTTP status code to its redirect behavior in a URL shortener context:",
        explanation:
          "301 is a permanent redirect that browsers cache, so future requests bypass the server. 302 is a temporary redirect that browsers do NOT cache, ensuring every request goes through the server. 404 indicates the short code does not exist. 410 indicates the URL existed but has expired and been removed.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "301",
              right: "Permanent redirect — browser caches, bypasses server on future requests",
            },
            {
              id: "p2",
              left: "302",
              right: "Temporary redirect — browser does NOT cache, every request hits server",
            },
            { id: "p3", left: "404", right: "Short code not found in the system" },
            { id: "p4", left: "410", right: "URL existed but has expired and been removed" },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match short code generation approaches to their tradeoffs",
      type: "question",
      sectionId: "sec_q_code_generation",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each short code generation strategy to its primary weakness:",
        explanation:
          "URL prefix truncation fails on uniqueness — shared prefixes collide. Hash + base62 suffers from collision probability that grows with scale, requiring retry logic. Counter + base62 produces predictable sequential codes, enabling enumeration. Random number generation lacks sufficient entropy to guarantee uniqueness across billions of codes.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "URL prefix truncation",
              right: "Fails uniqueness — shared prefixes collide",
            },
            {
              id: "p2",
              left: "Hash (SHA-256) + base62",
              right: "Collision probability grows with scale, requires retries",
            },
            {
              id: "p3",
              left: "Counter (Redis INCR) + base62",
              right: "Sequential codes are predictable, enabling enumeration",
            },
            {
              id: "p4",
              left: "Random number generation",
              right: "Insufficient entropy to guarantee uniqueness at scale",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match scaling strategies to the problem they solve",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each scaling strategy to the specific problem it addresses in a URL shortener:",
        explanation:
          "In-memory caching solves the read throughput problem at 600K peak RPS. Separating read/write services addresses the 1000:1 asymmetry. Counter batching reduces Redis coordination overhead for distributed write instances. CDN edge computing minimizes redirect latency for geographically distributed users. Database read replicas offload read queries from the primary.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "In-memory cache (Redis/Memcached)",
              right: "Database cannot handle 600K peak redirect RPS from disk",
            },
            {
              id: "p2",
              left: "Separate Read/Write services",
              right: "1000:1 read-write asymmetry requires independent scaling",
            },
            {
              id: "p3",
              left: "Counter batching",
              right:
                "Per-request Redis INCR creates coordination bottleneck across write instances",
            },
            {
              id: "p4",
              left: "CDN edge computing",
              right: "Redirect latency for users far from the origin server",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Base62 character set",
      type: "question",
      sectionId: "sec_q_code_generation",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Base62 encoding uses _____ total characters: lowercase a-z, uppercase A-Z, and digits 0-9.",
        explanation:
          'Base62 uses 62 characters: 26 lowercase + 26 uppercase + 10 digits = 62. It excludes "+" and "/" from base64 because they conflict with URL syntax.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Base62 encoding uses {{blank1}} total characters: lowercase a-z, uppercase A-Z, and digits 0-9.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "62",
              acceptableAnswers: ["62", "sixty-two", "sixty two"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Read-to-write ratio",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "A URL shortener has an extreme read-to-write ratio of approximately _____:1, because users click existing short URLs far more often than they create new ones.",
        explanation:
          "The read-to-write ratio is approximately 1000:1. For every new URL created (a write), it may be clicked 1000 times (reads). This asymmetry is the defining characteristic that drives caching strategy and service separation.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "A URL shortener has an extreme read-to-write ratio of approximately {{blank1}}:1, because users click existing short URLs far more often than they create new ones.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "1000",
              acceptableAnswers: ["1000", "1,000", "1000:1"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Redis counter property",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "Redis is ideal for managing a global counter because it is _____ and its INCR command is _____, meaning concurrent calls always return different values.",
        explanation:
          "Redis is single-threaded — it processes one command at a time, eliminating race conditions. Its INCR operation is atomic — it increments and returns the new value in one indivisible step. Together, these properties guarantee that no two clients ever receive the same counter value.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "Redis is ideal for managing a global counter because it is {{blank1}} and its INCR command is {{blank2}}, meaning concurrent calls always return different values.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "single-threaded",
              acceptableAnswers: ["single-threaded", "single threaded"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "atomic",
              acceptableAnswers: ["atomic", "an atomic operation"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Peak redirect throughput calculation",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "With 100M DAU and 5 redirects per user per day, the average redirect rate is ~5,787 RPS. If peak traffic is 100x the average, what is the peak redirects per second the system must handle? (Answer in thousands, e.g., enter 600 for 600,000 RPS)",
        explanation:
          "Average RPS = 500,000,000 / 86,400 ≈ 5,787. Peak at 100x = 5,787 × 100 ≈ 578,700 ≈ 600K RPS (rounded). This peak throughput justifies the need for in-memory caching — no single database can serve 600K reads/second from disk.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 579,
          tolerance: 50,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Database storage estimation",
      type: "question",
      sectionId: "sec_q_production",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "Each URL mapping row is approximately 500 bytes (short_code + long_url + metadata). If the system stores 1 billion URL mappings, what is the total database storage in gigabytes? (1 GB = 10^9 bytes)",
        explanation:
          "1,000,000,000 rows × 500 bytes = 500,000,000,000 bytes = 500 GB. This is well within the capacity of a single modern SSD (typical servers have 1-4 TB SSDs), which is why a single Postgres instance suffices for storage. The key insight is that this system is NOT storage-bound — it is throughput-bound on reads.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 500,
          tolerance: 10,
        },
      },
    },
  ],
};
