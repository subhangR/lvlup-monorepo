/**
 * YouTube Top K — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: streaming aggregation, tumbling vs sliding windows, Kafka + Flink pipeline,
 * sharding writes, caching/precomputation, Count-Min Sketch approximation, specialized databases
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const topKContent: StoryPointSeed = {
  title: "Design a Top-K System (YouTube Top K)",
  description:
    "Master the system design of a Top-K video views service — covering streaming aggregation with Kafka and Flink, tumbling vs sliding windows, sharding writes at 700K TPS, caching/precomputation for sub-10ms reads, Count-Min Sketch approximation, and specialized database tradeoffs.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements, API & Core Concepts", orderIndex: 1 },
    { id: "sec_q_ingestion", title: "Ingestion Pipeline & Write Scaling", orderIndex: 2 },
    {
      id: "sec_q_read_optimization",
      title: "Read Optimization & Window Aggregation",
      orderIndex: 3,
    },
    { id: "sec_q_approximation", title: "Approximation & Specialized Databases", orderIndex: 4 },
    { id: "sec_q_deep_dives", title: "Deep Dives & Architecture Tradeoffs", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Design
    {
      title: "Top-K — Requirements & High-Level Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Top-K — Requirements & High-Level Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Understanding the Top-K Problem",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Top-K is a classic system design problem with many variants. The core challenge: given a massive stream of events (e.g., YouTube video views at 70 billion/day), efficiently compute the K most popular items across multiple time windows (last hour, day, month, all-time). Small changes in requirements — precision vs approximation, sliding vs tumbling windows — dramatically change the design.",
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
                  "Clients can query the top K videos for all-time (up to max 1K results).",
                  "Clients can query tumbling windows of 1 hour, 1 day, 1 month, and all-time.",
                  "Below the line: arbitrary time periods and arbitrary start/end points.",
                ],
              },
            },
            {
              id: "b5",
              type: "heading",
              content: "Tumbling Windows vs Sliding Windows",
              metadata: { level: 3 },
            },
            {
              id: "b6",
              type: "paragraph",
              content:
                'Tumbling windows use fixed boundaries (e.g., "last hour" at 10:06 means 9:00–10:00). Sliding windows move with the current time (e.g., "last hour" at 10:06 means 9:06–10:06). Tumbling windows are easier to implement because each event belongs to exactly one window and aggregates are simpler to compute. Propose tumbling first, then discuss sliding as a deep dive.',
            },
            {
              id: "b7",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Tolerate at most 1-minute delay between when a view occurs and when it is tabulated.",
                  "Results must be precise (no approximation) — we revisit this in deep dives.",
                  "Return results within 10s of milliseconds (implies precomputation).",
                  "Handle ~700K views/second (70B views/day ÷ 100K seconds/day).",
                  "Support ~3.6B total videos (1M new videos/day × 365 × 10 years).",
                ],
              },
            },
            {
              id: "b9",
              type: "heading",
              content: "Core Entities & API",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Video: The video being viewed.",
                  "View: The view event (timestamp + videoId).",
                  'Time Window: "all_time", "last_hour", "last_day", "last_month".',
                ],
              },
            },
            {
              id: "b11",
              type: "code",
              content:
                '// Retrieve top K videos\nGET /views/top-k?window={WINDOW}&k={K}\n-> { videoId: string, views: number }[]\n\n// Example:\nGET /views/top-k?window=last_hour&k=100\n-> [{ "videoId": "abc123", "views": 5000000 }, ...]',
              metadata: { language: "text" },
            },
            {
              id: "b12",
              type: "heading",
              content: "Basic High-Level Design",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "Start simple: a Kafka topic of ViewEvents partitioned by videoId → a View Consumer that updates counters in Postgres → a Top-K Service that queries the database. For all-time, a simple SELECT with ORDER BY views DESC LIMIT k using an index on views is O(k). For windowed queries, add a timestamp column and use GROUP BY + SUM, but this requires scanning billions of rows — a clear bottleneck to optimize in deep dives.",
            },
            {
              id: "b14",
              type: "code",
              content:
                '-- All-time top K (efficient with index on views)\nSELECT "videoId", "views"\nFROM VideoViews\nORDER BY "views" DESC LIMIT k;\n\n-- Windowed top K (expensive — scans many rows)\nSELECT "videoId", SUM("views") as "views"\nFROM VideoViews\nWHERE "timestamp" >= {windowStart} AND "timestamp" <= {windowEnd}\nGROUP BY "videoId"\nORDER BY SUM("views") DESC LIMIT k;',
              metadata: { language: "sql" },
            },
            {
              id: "b15",
              type: "quote",
              content:
                "Key insight: Build a working system first, then optimize. Acknowledge bottlenecks explicitly to the interviewer — it shows you see the problem and plan to address it. This approach signals maturity: start simple, iterate to optimal.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Deep Dives — Scaling Reads & Writes
    {
      title: "Deep Dives — Scaling Reads, Writes & Aggregation",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Scaling Reads, Writes & Aggregation",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Scaling Reads: Caching & Precomputation",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "The 1-minute grace period in our NFRs enables caching and precomputation. Good approach: cache top-K results in Redis with a TTL of a few hours. Cache hits return in sub-millisecond. Problem: when cache expires, a flood of requests hits the database and breaks our SLA. Great approach: add a cron job that precomputes top-K for each window on a fixed interval and warms the cache proactively. The Top-K Service only reads from cache, never querying the database on the hot path.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Scaling Writes: Sharding Ingestion",
              metadata: { level: 2 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "At 700K TPS, a single Postgres instance (max ~10K writes/sec) cannot keep up. Shard the database by videoId — the same partition key as the Kafka topic. Each View Consumer writes to its own database shard. To bring TPS per shard to ~10K, you need ~70 shards. Downside: the single SQL query for top-K no longer works — you must query each shard for its local top-K and merge results. Mathematically, merging the local top-K from each shard guarantees the correct global top-K.",
            },
            {
              id: "c5",
              type: "heading",
              content: "Scaling Writes: Batching with Flink",
              metadata: { level: 2 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "Many views concentrate on a small number of popular videos. Instead of one database write per view, use Apache Flink to batch and aggregate views over tumbling windows (e.g., 1 hour). Flink reads from Kafka, aggregates view counts per videoId per hour, and flushes aggregated counts to the database periodically. This can reduce write volume by 2–100x. With batching, database shards can drop from ~70 to 5–10. Flink handles late events via BoundedOutOfOrdernessWatermarkStrategy (30-second tolerance) and checkpoint/recovery by rewinding Kafka offsets.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Optimizing Top-K Queries: Window Aggregates",
              metadata: { level: 2 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Windowed queries scan hundreds of GBs — unacceptable even for precomputation. Good approach: aggregate at coarser granularity (hour → day → month tables). Great approach: maintain per-window aggregate tables (VideoViewsLastHour, VideoViewsLastDay, etc.) with an index on views. The Flink job updates these window tables directly on each flush. The top-K cron reads directly from the indexed views column — an O(k) operation. Tradeoff: more write complexity (updating 4 tables instead of 1) but dramatically faster reads.",
            },
            {
              id: "c9",
              type: "heading",
              content: "Sliding Windows Extension",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                'For sliding windows (e.g., "last hour" at 10:06 = 9:06–10:06), the aggregate table needs increments AND decrements. When a new minute arrives: (1) read views from T-60 minutes as the decrement, (2) write new minute\'s views as the increment, (3) update VideoViewsLastHour with the delta. This doubles database load. A pragmatic compromise: sliding windows for "last hour" (where freshness matters), tumbling for "last day" and "last month" (where users accept less granularity). An alternative: use a second Kafka consumer group on a lag to handle decrements, avoiding minute-grained storage.',
            },
            {
              id: "c11",
              type: "heading",
              content: "Full Flink-Based Solution",
              metadata: { level: 2 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                "The most elegant solution maintains all aggregates and top-K computation within Flink state (backed by RocksDB for disk-spill), eliminating Postgres entirely. Flink's RollingWindowAggregator keeps per-video, per-window counts. A TopKAggregator maintains a heap of top-K per window. Results are written directly to Redis via a sink. If a node fails, Flink restores from checkpoint and replays from Kafka. Caveat: this requires deep Flink knowledge — interviewers unfamiliar with Flink may push back or ask for lower-level explanations.",
            },
            {
              id: "c13",
              type: "code",
              content:
                "// Simplified Flink pipeline structure\nKafka ViewEvents\n  → keyBy(videoId)\n  → RollingWindowAggregator (per window: hour, day, month, all-time)\n  → keyBy(window)\n  → TopKAggregator (heap of top K per window)\n  → RedisSortedSetSink (write top-K to cache)",
              metadata: { language: "text" },
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Approximation & Specialized Databases
    {
      title: "Approximation (Count-Min Sketch) & Specialized Databases",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Approximation (Count-Min Sketch) & Specialized Databases",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Count-Min Sketch for Approximate Top-K",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "If users accept fuzziness (top videos differ by thousands of views, not dozens), Count-Min Sketch (CMS) drastically reduces memory. CMS uses multiple hash functions mapping items to a 2D array of counters — it forgets item IDs but remembers approximate frequency. Pair CMS with a sorted list/heap: on each view, add to CMS → estimate count → update the heap. Truncate the heap to K entries (max 1000). Memory drops from hundreds of GBs to hundreds of MBs.",
            },
            {
              id: "d3",
              type: "heading",
              content: "CMS with Redis",
              metadata: { level: 3 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "Redis natively supports CMS (CMS.INCRBY, CMS.QUERY) and sorted sets (ZADD, ZRANGE). Each view triggers CMS.INCRBY → CMS.QUERY → ZADD to the sorted set. Optimization: skip ZADD if the item is below the current top-1000 threshold. Challenge: durability — if Redis loses data between CMS update and sorted set update, state becomes inconsistent. Rebuilding from Kafka is slow.",
            },
            {
              id: "d5",
              type: "heading",
              content: "CMS with Flink",
              metadata: { level: 3 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Maintain CMS and sorted list in Flink state (checkpointed). More resilient than Redis — Flink restores from checkpoint and replays Kafka on failure. For sliding windows with CMS, you need a remove operation. Redis doesn't support CMS.DECRBY, but custom Flink state can. This is well outside typical interview scope but demonstrates deep knowledge.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Specialized Databases",
              metadata: { level: 2 },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "Three categories of specialized databases are commonly discussed for analytics-heavy workloads. Understanding WHY each fits (or doesn't) matters more than memorizing names.",
            },
            {
              id: "d9",
              type: "heading",
              content: "Bad Fit: InfluxDB / Prometheus",
              metadata: { level: 3 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "Time-series databases like InfluxDB excel at querying a single series (one videoId over time) but fail at cross-series aggregation. With billions of distinct videoIds as tags, a top() query becomes a full scan across billions of series — exactly what these databases are NOT optimized for. They are designed for narrow queries on high-cardinality time axes, not wide aggregations across high-cardinality entity axes.",
            },
            {
              id: "d11",
              type: "heading",
              content: "Good Fit: TimescaleDB",
              metadata: { level: 3 },
            },
            {
              id: "d12",
              type: "paragraph",
              content:
                "TimescaleDB extends Postgres with hypertables (time-partitioned tables) and continuous aggregates (materialized rollups). Model per-hour aggregates as a hypertable, then create continuous aggregates for day/month rollups. With an index on the views column, top-K queries become O(k). The resulting architecture closely mirrors our custom Postgres solution — which is not a coincidence: good system design often converges on similar data flows regardless of the specific technology.",
            },
            {
              id: "d13",
              type: "heading",
              content: "Good Fit: Real-time OLAP (Druid / Pinot / ClickHouse)",
              metadata: { level: 3 },
            },
            {
              id: "d14",
              type: "paragraph",
              content:
                "These databases pre-aggregate on ingest. Druid uses ingestion-time rollup with compaction. Pinot uses star-tree indexes for fixed query patterns. ClickHouse uses SummingMergeTree tables for continuous rollups. All support GROUP BY ... ORDER BY ... LIMIT K efficiently. Challenge: production reliability at scale and the expectation that you can explain the internals if an interviewer asks.",
            },
            {
              id: "d15",
              type: "quote",
              content:
                "Staff-level insight: \"You're better served by being able to construct solutions from simpler primitives than to defer to specialized tech you can't defend well. Most interviewers remember the first time they learned new tech X. They're more sympathetic if you understand what gave rise to X than if you just know its name.\"",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "Tumbling vs sliding windows",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'At 10:06, a client queries for the "last hour" of video views. Under a tumbling window approach, which time range is returned?',
        explanation:
          'Tumbling windows snap to fixed boundaries. The "last hour" at 10:06 returns the completed window from 9:00 to 10:00, not the sliding range of 9:06–10:06. This is chosen because each event belongs to exactly one window, making aggregation simpler — events don\'t need to be counted in overlapping windows.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "10:00 to 11:00 — the current hour boundary",
              isCorrect: false,
            },
            {
              id: "b",
              text: "9:00 to 10:00 — the last complete hour boundary",
              isCorrect: true,
            },
            {
              id: "c",
              text: "9:06 to 10:06 — the sliding 60-minute window from now",
              isCorrect: false,
            },
            {
              id: "d",
              text: "8:00 to 10:00 — the last two complete hours",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why precomputation over on-demand query",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why does the Top-K system use precomputed results in a cache rather than querying the database on each request?",
        explanation:
          "The non-functional requirement specifies sub-10ms response times, but windowed SQL queries over billions of rows take minutes, not milliseconds. A cron job precomputes top-K results and writes them to Redis. The API reads exclusively from cache on the hot path. The 1-minute freshness tolerance makes this viable — we don't need real-time precision.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Caching is required because Kafka cannot store historical data",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Postgres cannot execute ORDER BY with LIMIT correctly on large tables",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Precomputation eliminates the need for a database entirely",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Windowed aggregation queries scan billions of rows and take minutes, but the SLA requires sub-10ms responses",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Role of Kafka in the pipeline",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In the Top-K architecture, why is the Kafka ViewEvent topic partitioned by videoId?",
        explanation:
          "Partitioning by videoId ensures all views for the same video go to the same partition. This allows consumers and downstream database shards to use the same partitioning scheme, meaning each consumer writes only to its assigned shard. It also enables correct per-video aggregation without cross-partition coordination during Flink batching.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Kafka requires a partition key and videoId is the only available field",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It ensures events are delivered in chronological order across all videos",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It aligns with the database sharding key, enabling each consumer to write to one shard without cross-partition coordination",
              isCorrect: true,
            },
            {
              id: "d",
              text: "It enables exactly-once delivery semantics for all consumers",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Cache warming strategy",
      type: "question",
      sectionId: "sec_q_read_optimization",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The initial caching approach uses a TTL-based cache. What is the primary weakness, and how does precomputation via a cron job address it?",
        explanation:
          "When a TTL-based cache entry expires, the first request triggers a database query that takes minutes (scanning billions of rows). During this time, all requests either block or fail the SLA. Precomputation solves this: a cron job computes results ahead of the TTL expiration and warms the cache proactively. The API never queries the database. Stale cached entries remain servable for a grace period if the cron is delayed.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Cache expiry causes a stampede of slow database queries that break the SLA; the cron precomputes before expiry so the cache is always warm",
              isCorrect: true,
            },
            {
              id: "b",
              text: "TTL caches lose data on Redis restart; the cron provides persistence by writing to disk",
              isCorrect: false,
            },
            {
              id: "c",
              text: "TTL caches cannot store complex data structures; the cron converts results to a simpler format",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The cache has limited memory; the cron evicts old entries to make room for new ones",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Sharding correctness for top-K merge",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "After sharding the database, the top-K cron queries each shard for its local top-K and merges results. Why is this mathematically correct?",
        explanation:
          "If a video is in the global top-K, it must be in the top-K of its assigned shard (since all its views are on that shard due to videoId-based partitioning). Therefore, retrieving the local top-K from each shard and merging guarantees the global top-K is included. This only works because partitioning is by videoId — if views for one video were split across shards, local top-K would not be sufficient.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "All views for a given videoId reside on a single shard, so any globally top-K video must also be top-K on its shard",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The merge operation uses a weighted average that accounts for shard sizes",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Each shard returns all data, not just top-K, and the merge selects from the full dataset",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It is only approximately correct, which is acceptable given the 1-minute tolerance",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Flink batching benefit",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Introducing Flink between Kafka and Postgres for batching reduces database shards from ~70 to 5–10. What is the primary mechanism that enables this reduction?",
        explanation:
          'Many views in a given hour are for the same popular videos (Mr. Beast, Taylor Swift). Instead of one DB write per view (700K/sec), Flink aggregates counts per videoId per hour and writes one row per video per hour. The number of distinct videos viewed per hour is far less than the total view count, reducing write volume by 2–100x. This is the difference between "700K writes/sec" and "a few thousand writes per hour-flush."',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Flink uses a faster database protocol than standard Postgres wire protocol",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Flink compresses view events using gzip before writing to the database",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Flink eliminates the need for database indexes, reducing write overhead",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Many views concentrate on few popular videos; aggregating per-videoId per-hour collapses millions of writes into one row per video",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Why InfluxDB fails for Top-K",
      type: "question",
      sectionId: "sec_q_approximation",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "An engineer proposes using InfluxDB for the Top-K system. Why does this approach fail at YouTube scale?",
        explanation:
          'InfluxDB is optimized for querying individual time series (e.g., "show me CPU usage for server X over time"). With billions of distinct videoIds as tags/series, a top() query must scan across ALL series to find the highest values — this is a full scan across billions of series. Time-series databases excel at narrow queries on the time axis but fail at wide aggregations across the entity axis. The high cardinality of videoIds is the fundamental problem.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "InfluxDB does not support windowed queries",
              isCorrect: false,
            },
            {
              id: "b",
              text: "InfluxDB uses eventual consistency which violates our precision requirement",
              isCorrect: false,
            },
            {
              id: "c",
              text: "InfluxDB cannot handle more than 10K writes per second",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Billions of distinct videoIds create extreme tag cardinality; top() must scan all series, defeating the time-series indexing model",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Sliding window memory explosion with Flink",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "Why can't you simply use Flink's native sliding window with a 1-minute slide for the \"last month\" window?",
        explanation:
          "A sliding window with 1-minute slide for a 30-day window means each event belongs to 60 × 24 × 30 = 43,200 overlapping windows simultaneously. Flink must maintain state for all overlapping windows, multiplying memory by 43,200x. For billions of videos, this is terabytes of state — completely impractical. The solution is tumbling windows with explicit increment/decrement logic, or accepting tumbling semantics for longer windows.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Flink checkpoints become too large to persist in HDFS within the 1-minute tolerance",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Each event belongs to 43,200 overlapping windows (60×24×30), multiplying state memory by 43,200x — terabytes for billions of videos",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Flink does not support sliding windows natively; they must be implemented manually",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Kafka retention is typically 7 days, so a 30-day sliding window cannot access old events",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Non-functional requirements that favor precomputation",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following non-functional requirements directly support the decision to precompute top-K results? Select ALL that apply.",
        explanation:
          "The 1-minute freshness tolerance means results don't need to be real-time — precomputation on a schedule is acceptable. The sub-10ms response SLA eliminates on-demand aggregation queries (which take minutes). Together, they make precomputation both viable and necessary. 700K TPS is about write scaling, not read strategy. Precision vs approximation affects the algorithm (exact counts vs CMS) but not whether to precompute.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "700K views/second throughput requirement",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Sub-10ms response SLA — on-demand queries over billions of rows are too slow",
              isCorrect: true,
            },
            {
              id: "c",
              text: "1-minute freshness tolerance — results don't need real-time precision",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Results must be precise (no approximation)",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Benefits of Flink over direct Kafka consumers",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Compared to simple Kafka consumer services writing directly to Postgres, what advantages does adding Apache Flink provide? Select ALL that apply.",
        explanation:
          "Flink provides: (1) Batching/aggregation — collapsing many view events into one write per video per window, dramatically reducing DB write volume. (2) Late event handling via BoundedOutOfOrdernessWatermarkStrategy — events arriving slightly late (within 30s) are still counted correctly. (3) Checkpoint/recovery — if a node fails, Flink rewinds Kafka to the last checkpoint and replays, ensuring no data loss. Flink does NOT eliminate the need for Kafka (it reads FROM Kafka) nor does it provide SQL query optimization.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Checkpoint and recovery via Kafka offset rewinding prevents data loss on failure",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Batching reduces database write volume by aggregating per-videoId counts before flushing",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Flink automatically optimizes SQL queries on the downstream Postgres database",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Flink eliminates the need for Kafka by producing events directly",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Watermark-based late event handling ensures slightly delayed events are counted correctly",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Valid approaches for maintaining window aggregates",
      type: "question",
      sectionId: "sec_q_read_optimization",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are valid approaches for maintaining per-window aggregate tables (VideoViewsLastHour, etc.)? Select ALL that apply.",
        explanation:
          "Flink can maintain separate tumbling windows for each granularity (hour, day, month) and write aggregates to the corresponding tables. A cron job can periodically aggregate hour-grain rows into day/month tables. Both approaches work. Maintaining aggregates in Flink state (RocksDB-backed) and writing results directly to cache is the most elegant solution. Querying InfluxDB fails due to high cardinality. Real-time SQL triggers on every write would create more load than the 700K writes/sec they're trying to aggregate.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Add multiple tumbling windows in Flink, each outputting to a different table",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Flink maintains all window state in memory (RocksDB) and writes final top-K directly to Redis",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Cron job that periodically reads hour-grain data and aggregates into day/month tables",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Query InfluxDB continuous queries to produce rollups automatically",
              isCorrect: false,
            },
            {
              id: "e",
              text: "SQL triggers that aggregate on every INSERT to the hour-grain table",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Count-Min Sketch tradeoffs",
      type: "question",
      sectionId: "sec_q_approximation",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which statements about using Count-Min Sketch (CMS) for approximate Top-K are correct? Select ALL that apply.",
        explanation:
          "CMS provides an upper bound estimate (it can overcount due to hash collisions but never undercount). It reduces memory from hundreds of GBs to hundreds of MBs by not storing individual item IDs. CMS.DECRBY is not supported in Redis, so the Redis-based approach cannot handle sliding windows that need decrement operations — custom Flink state is required. CMS does NOT guarantee exact ordering; it is inherently approximate, which is why it requires user acceptance of fuzziness.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Redis CMS does not support DECRBY, making it unsuitable for sliding window decrements",
              isCorrect: true,
            },
            {
              id: "b",
              text: "CMS requires less memory than a heap-based approach but provides no frequency estimates",
              isCorrect: false,
            },
            {
              id: "c",
              text: "CMS guarantees exact top-K ordering as long as K ≤ 1000",
              isCorrect: false,
            },
            {
              id: "d",
              text: "CMS reduces memory from hundreds of GBs to hundreds of MBs by forgetting individual item IDs",
              isCorrect: true,
            },
            {
              id: "e",
              text: "CMS estimates are an upper bound — they can overcount but never undercount",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Incremental system design approach",
      type: "question",
      sectionId: "sec_q_read_optimization",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the incremental approach to designing a Top-K system in an interview. Why is it better to start with a suboptimal working system rather than jumping to the optimal solution? Describe the progression from basic to optimized.",
        explanation:
          "A strong answer describes: (1) Start with a basic Kafka → Consumer → Postgres pipeline that handles all-time top-K with a simple indexed query. (2) Extend to windowed queries with GROUP BY + timestamp — acknowledge this is slow. (3) Add caching/precomputation to meet SLA. (4) Shard to handle write volume. (5) Add Flink batching to reduce shards. (6) Optimize queries with per-window aggregate tables. Starting simple demonstrates you can build working systems and prioritize. Jumping to Flink + CMS + sharding immediately risks getting lost in complexity and signals you can't distinguish critical from trivial components.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          sampleAnswer:
            "Start with the simplest working system: Kafka topic → View Consumer → Postgres with a counter table. For all-time top-K, an indexed ORDER BY views DESC LIMIT k is O(k) and sufficient. Next, extend to time windows by adding a timestamp column and GROUP BY queries — this works but is slow for large windows. Then layer on caching: put a Redis cache in front with TTL, then upgrade to a cron-based precomputation that warms the cache proactively so the API never hits the database on the hot path. For write scaling, shard Postgres by videoId (same key as Kafka partitions), then introduce Flink to batch and aggregate views before writing, reducing shards from ~70 to 5–10. Finally, replace the expensive windowed queries with per-window aggregate tables that Flink updates directly. This progression shows the interviewer you can build, identify bottlenecks, and optimize systematically — which is more impressive than jumping to the final architecture.",
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Caching vs precomputation tradeoffs",
      type: "question",
      sectionId: "sec_q_read_optimization",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Compare the "cache with TTL" approach versus the "cron-based precomputation" approach for serving Top-K results. What specific failure mode does precomputation solve? What new operational concern does it introduce?',
        explanation:
          "A strong answer covers: TTL-based cache has a stampede problem at expiry — all clients suddenly hit the slow database query. Request coalescing partially helps (one server queries DB, others wait) but the one query still breaks the SLA. Precomputation eliminates this by running the expensive query on a schedule, ahead of cache expiry. The new concern is operational: if the cron fails, the cache eventually expires and the API has no data. Mitigations include retaining cache entries with longer TTLs (serve stale), monitoring cron health, and alerting on cache age.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          sampleAnswer:
            "With TTL-based caching, when a cache entry expires, the next request must execute the full aggregation query on the database. This takes minutes for windowed queries scanning billions of rows, breaking the sub-10ms SLA. Even with request coalescing (only one server queries the DB, others wait), that one query still takes too long. Precomputation solves this by decoupling the expensive query from the request path: a cron job computes top-K on a fixed schedule and writes results to Redis before the old cache entry expires. The API only reads from cache. The new operational concern is cron reliability: if the cron fails or runs late, the cache expires with no replacement data. This is mitigated by: (1) retaining cache entries for a few hours beyond normal TTL so stale data can be served temporarily, (2) monitoring the age of cached results and alerting if they exceed a threshold, and (3) building the cron to be idempotent so it can be safely retried.",
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Sliding window implementation with increment/decrement",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Describe how to implement sliding window support for the "last hour" top-K query using the Postgres-based approach. Explain the increment/decrement mechanism, what it costs, and propose a pragmatic compromise for longer windows.',
        explanation:
          'A strong answer describes the full mechanism: Flink aggregates at minute granularity. Each minute, the system: (1) reads views from exactly 60 minutes ago as the "decrement", (2) writes new minute\'s views as the "increment" to VideoViews, (3) updates VideoViewsLastHour with the delta (new_views - old_views). This works for all windows but doubles DB load (reads + writes instead of just writes) and requires retaining minute-grain data for the duration of the longest window (30 days). The pragmatic compromise: use sliding windows for "last hour" (where freshness matters) and tumbling windows for "last day" and "last month" (where users accept less granularity). An alternative eliminates minute-grain storage: use a lagged Kafka consumer group for decrements.',
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          sampleAnswer:
            'To support sliding windows for "last hour", maintain minute-granularity aggregates. Each minute: (1) Flink outputs the sum of views per videoId for that minute. (2) The system reads the VideoViews row from exactly T-60 minutes as the decrement. (3) It writes the new minute\'s views as the increment. (4) It updates VideoViewsLastHour by adding the increment and subtracting the decrement. This creates a rolling 60-minute window that shifts every minute. The cost is significant: we now do reads AND writes instead of just writes, doubling database load. We must also retain minute-grain data in VideoViews for at least 30 days (the longest window), causing table bloat. A pragmatic compromise: offer sliding windows only for "last hour" (where users notice staleness) and tumbling windows for "last day" and "last month" (where users accept hourly boundaries). An alternative architecture uses two Kafka consumer groups: one at the head of the stream for increments, one lagged by the window duration for decrements. This eliminates minute-grain storage in the database and leverages Kafka\'s built-in retention.',
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Full Flink-based architecture vs Postgres-based",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Compare the full Flink-based architecture (state in RocksDB, no Postgres) with the Postgres-based approach. Discuss the tradeoffs in terms of complexity, durability, operational concerns, and interview strategy.",
        explanation:
          'A strong answer weighs both sides: Flink-based is elegant — fewer components (Kafka → Flink → Redis), no Postgres, aggregation and top-K computed in-memory. State is checkpointed to durable storage and recovered by replaying Kafka. But it requires deep Flink knowledge, which interviewers may not share. If asked "how does checkpoint/recovery work?" you must explain at a low level. Postgres-based uses familiar components, is easier to explain, and lets you discuss sharding, indexing, and query optimization — topics most interviewers understand. Interview strategy: lead with the Postgres-based design for clarity, then mention Flink as an optimization if the interviewer is receptive.',
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          sampleAnswer:
            "The Flink-based architecture (Kafka → Flink → Redis) is the most elegant solution: RollingWindowAggregator and TopKAggregator run in Flink state backed by RocksDB, results are written directly to a Redis sorted set, and Postgres is eliminated entirely. Advantages: fewer moving parts, lower latency (no DB round-trips), natural handling of late events and recovery (checkpoint + Kafka replay). Disadvantages: high operational complexity (managing Flink clusters, tuning RocksDB, monitoring checkpoint sizes), deep domain expertise required, and Flink's stateful processing can be difficult to debug at scale. The Postgres-based approach (Kafka → Flink for batching → sharded Postgres → cron → Redis) uses widely understood components: sharding, indexing, SQL queries, and cron jobs. Most interviewers are comfortable probing these. Interview strategy: start with the Postgres path because it demonstrates clear, incremental problem-solving. Mention the Flink-only path as \"if I had time\" or if the interviewer shows familiarity with streaming frameworks. Never lead with Flink — if the interviewer doesn't know it, you'll spend all your time explaining infrastructure instead of demonstrating design skills.",
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Count-Min Sketch paired with sorted list",
      type: "question",
      sectionId: "sec_q_approximation",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain how Count-Min Sketch (CMS) and a sorted list/heap work together to provide approximate Top-K. Why can't CMS alone solve the problem? Describe the full flow from view event to top-K query.",
        explanation:
          'A strong answer explains: CMS supports add(item, count) and estimate(item) — it tells you "approximately how many times have I seen X" but it forgets which items were added. You cannot iterate over a CMS to find the top items. The sorted list/heap complements CMS by maintaining the actual top-K item IDs ordered by their estimated counts. Flow: (1) view event arrives, (2) CMS.add(videoId, 1), (3) CMS.estimate(videoId) returns approximate count, (4) if count > current heap minimum, insert/update in the heap, (5) truncate heap to K entries. On query, return the heap contents. Optimization: maintain the heap\'s minimum value in memory and skip CMS.estimate + heap updates for items clearly below threshold.',
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          sampleAnswer:
            'Count-Min Sketch (CMS) is a probabilistic data structure that estimates item frequency using multiple hash functions mapping to a 2D counter array. It supports two operations: add(item, count) and estimate(item). Critically, it CANNOT list or iterate over items — once an item is added, its identity is lost (only hash positions are updated). This means CMS alone cannot answer "what are the top-K items?" It can only answer "how many times has item X been seen?" To solve top-K, pair CMS with a min-heap of size K. The flow: (1) A view event for videoId arrives. (2) Call CMS.add(videoId, 1) to update the sketch. (3) Call CMS.estimate(videoId) to get the approximate total views — this is an upper bound (overcounting possible due to hash collisions, never undercounting). (4) If the estimate exceeds the current minimum of the heap, insert or update the entry in the heap. (5) If the heap exceeds K entries, evict the minimum. On a top-K query, return all entries in the heap sorted by estimated count. Optimization: cache the heap\'s minimum value and skip the CMS.estimate + heap operation entirely for items with an estimate well below the threshold — this avoids unnecessary heap operations for the long tail of unpopular videos.',
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Specialized databases for Top-K",
      type: "question",
      sectionId: "sec_q_approximation",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Compare InfluxDB, TimescaleDB, and a real-time OLAP database (Druid/Pinot/ClickHouse) for the Top-K problem. For each, explain why it works or fails, and articulate the staff-level principle about specialized vs primitive solutions in interviews.",
        explanation:
          "Strong answer: InfluxDB/Prometheus FAIL — optimized for per-series queries, not cross-series aggregation. Billions of videoIds as tags means top() scans all series. TimescaleDB is a GOOD fit — extends Postgres with hypertables and continuous aggregates that mirror the manual per-window aggregate table approach. Druid/Pinot/ClickHouse are GOOD fits — pre-aggregate on ingest with rollup, star-tree indexes, or SummingMergeTree. Staff principle: you're better off constructing solutions from primitives you can defend than citing specialized tech you can't explain internally. Understanding what gave rise to a technology earns more credit than knowing its name.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          sampleAnswer:
            'InfluxDB/Prometheus: BAD fit. These are time-series databases optimized for querying individual series over time (e.g., "show CPU for server X"). With billions of distinct videoIds as tags/series, a top() query must scan across ALL series — this is the worst-case for their inverted index model. They excel at narrow time-axis queries but fail at wide entity-axis aggregation. TimescaleDB: GOOD fit. It extends Postgres with hypertables (automatic time-based partitioning) and continuous aggregates (materialized rollups). Model per-hour data as a hypertable, create continuous aggregates for day/month rollups with indexed views columns. The resulting design closely mirrors our manual Postgres solution — which shows that good design converges regardless of tooling. Still needs caching for SLA compliance. Druid/Pinot/ClickHouse: GOOD fit. Pre-aggregate on ingest. Druid rolls up during ingestion and compacts older data. Pinot uses star-tree indexes for fixed query patterns. ClickHouse uses SummingMergeTree for continuous rollups. All support efficient ORDER BY views DESC LIMIT K. Challenge: production reliability at scale and the requirement to explain internals. Staff-level principle: Construct solutions from simple primitives (Kafka, Postgres, Redis, cron) that you deeply understand. Specialized databases are valid optimizations, but only propose them if you can explain their internals when probed. "Understanding what gave rise to technology X earns more credit than just knowing its name."',
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Single-query correctness for all-time top-K",
      type: "question",
      sectionId: "sec_q_read_optimization",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'In the basic (unsharded) Postgres design, the all-time top-K query uses an index on the "views" column. What is the time complexity of this query in terms of K, and why?',
        explanation:
          "The query is O(K). A B-tree index on the views column maintains a sorted structure. The query planner traverses the index from the maximum end, retrieving the first K entries directly. It does NOT scan the full table. The cost is the index maintenance: each write requires an O(log N) update to the B-tree index, but the read is O(K) regardless of table size.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          sampleAnswer:
            "O(K) — the B-tree index on views is sorted, so the query planner reads the top K entries directly from the index without scanning the full table.",
        },
      },
    },

    // Text 2 — medium
    {
      title: "Write cost of maintaining the views index",
      type: "question",
      sectionId: "sec_q_read_optimization",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'What is the time complexity of updating the B-tree index on the "views" column each time a view event increments a video\'s counter? How does this compare to an unindexed append-only write?',
        explanation:
          "Without the index, a simple counter increment is O(1) (update in place). With the B-tree index on views, each write must update the index to reflect the new view count, which is O(log N) where N is the number of rows. This is the tradeoff: O(K) reads require O(log N) writes instead of O(1) writes.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          sampleAnswer:
            "O(log N) per write to update the B-tree index, compared to O(1) for an unindexed append. The index makes reads O(K) but writes O(log N).",
        },
      },
    },

    // Text 3 — hard
    {
      title: "Lagged consumer group for sliding window decrements",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'Describe how a "lagged Kafka consumer group" can replace minute-grain storage in the database for sliding window decrements. What Kafka configuration is required?',
        explanation:
          "Instead of storing minute-grain data in Postgres and reading old rows for decrements, run a second Kafka consumer group that reads the same topic but with a configured offset lag equal to the window duration (e.g., 60 minutes behind the head). The head consumer increments counters; the lagged consumer decrements them. This eliminates the need to store minute-grain rows in the database entirely. Kafka must be configured with retention ≥ the longest window duration (30+ days for monthly windows).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          sampleAnswer:
            "A second consumer group reads the same Kafka topic lagged by the window duration (e.g., 60 min for hourly). Head group increments counters, lagged group decrements. Requires Kafka retention ≥ longest window (30+ days).",
        },
      },
    },

    // Text 4 — hard
    {
      title: "Why merging local top-K guarantees global correctness",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "After sharding by videoId, the system retrieves the top-K from each shard and merges. In one sentence, explain the mathematical guarantee that ensures this yields the correct global top-K.",
        explanation:
          "Because all views for a given videoId reside on exactly one shard (due to videoId-based partitioning), any video that is in the global top-K must also be in the top-K of its assigned shard. Therefore, the union of all shard-local top-Ks contains the global top-K, and a final merge-sort yields the correct result.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          sampleAnswer:
            "Since each videoId maps to exactly one shard, any globally top-K video must be top-K within its shard, so the union of shard-local top-Ks always contains the correct global top-K.",
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Component to responsibility mapping",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each component to its primary responsibility in the Top-K architecture.",
        explanation:
          "Kafka decouples view event production from consumption and provides replay capability. Flink aggregates individual view events into per-videoId, per-window counts before writing to the database, reducing write volume. Redis serves as the precomputed cache — the API reads top-K results from Redis, never querying the database on the hot path. The cron job runs the expensive aggregation query and writes results to Redis on a schedule.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          leftItems: [
            { id: "l1", text: "Kafka" },
            { id: "l2", text: "Flink" },
            { id: "l3", text: "Redis Cache" },
            { id: "l4", text: "Cron Job" },
          ],
          rightItems: [
            { id: "r1", text: "Serves precomputed top-K results to the API with sub-ms latency" },
            {
              id: "r2",
              text: "Aggregates individual view events into per-video counts, reducing write volume",
            },
            {
              id: "r3",
              text: "Decouples view event production from consumption and enables replay on failure",
            },
            {
              id: "r4",
              text: "Periodically executes expensive aggregation queries and warms the cache",
            },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r3" },
            { leftId: "l2", rightId: "r2" },
            { leftId: "l3", rightId: "r1" },
            { leftId: "l4", rightId: "r4" },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Problem to optimization mapping",
      type: "question",
      sectionId: "sec_q_read_optimization",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each bottleneck to the optimization technique that addresses it.",
        explanation:
          "700K writes/sec exceeds single-node capacity → shard by videoId to distribute writes. Windowed queries scan billions of rows → maintain per-window aggregate tables so top-K reads are O(k). Cache expiry stampede → cron-based precomputation warms the cache before TTL expires. Memory for storing all video counts → CMS reduces memory from hundreds of GBs to hundreds of MBs by using probabilistic counting.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          leftItems: [
            { id: "l1", text: "700K writes/sec exceeds single Postgres capacity" },
            { id: "l2", text: "Windowed queries scan billions of rows" },
            { id: "l3", text: "Cache expiry causes request stampede" },
            { id: "l4", text: "Full count table requires 64+ GB memory" },
          ],
          rightItems: [
            { id: "r1", text: "Count-Min Sketch reduces memory to hundreds of MBs" },
            { id: "r2", text: "Shard database by videoId to distribute writes" },
            { id: "r3", text: "Maintain per-window aggregate tables with indexed views column" },
            { id: "r4", text: "Cron-based precomputation warms cache before TTL expires" },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r2" },
            { leftId: "l2", rightId: "r3" },
            { leftId: "l3", rightId: "r4" },
            { leftId: "l4", rightId: "r1" },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Specialized database to characteristic mapping",
      type: "question",
      sectionId: "sec_q_approximation",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each specialized database to its characteristic behavior for the Top-K problem.",
        explanation:
          "InfluxDB is optimized for per-series queries, not cross-series aggregation — top() over billions of tags is a full scan. TimescaleDB extends Postgres with hypertables and continuous aggregates, closely mirroring the manual per-window table approach. Druid pre-aggregates during ingestion with rollup and compaction. ClickHouse uses SummingMergeTree to maintain running sums on ingest, shifting aggregation cost to write time.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          leftItems: [
            { id: "l1", text: "InfluxDB" },
            { id: "l2", text: "TimescaleDB" },
            { id: "l3", text: "Druid" },
            { id: "l4", text: "ClickHouse" },
          ],
          rightItems: [
            {
              id: "r1",
              text: "Ingestion-time rollup with background compaction for coarser grains",
            },
            { id: "r2", text: "SummingMergeTree maintains running sums, shifting cost to writes" },
            {
              id: "r3",
              text: "Continuous aggregates mirror manual per-window table approach on Postgres",
            },
            {
              id: "r4",
              text: "Per-series indexed; top() across billions of tags degrades to full scan",
            },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r4" },
            { leftId: "l2", rightId: "r3" },
            { leftId: "l3", rightId: "r1" },
            { leftId: "l4", rightId: "r2" },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Throughput calculation",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "YouTube has 70 billion views per day. Using the approximation of 100K seconds/day, the write throughput is _____ views per second.",
        explanation:
          "70,000,000,000 / 100,000 = 700,000. Using 100K seconds/day instead of 86,400 simplifies the mental math during interviews. The exact answer (810K) is close enough — the goal is order-of-magnitude estimation to inform architectural decisions.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            {
              id: "blank1",
              correctAnswer: "700,000",
              acceptableAnswers: ["700000", "700K", "700,000", "~700K", "700k"],
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Window type identification",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Windows that snap to fixed time boundaries (e.g., 9:00–10:00) are called _____ windows, while windows that move with the current time (e.g., 9:06–10:06) are called _____ windows.",
        explanation:
          "Tumbling windows use fixed boundaries where each event belongs to exactly one window. Sliding windows overlap because they advance by a smaller interval than the window size, so events can belong to multiple windows. Tumbling is easier to implement and is the preferred starting point in interviews.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            {
              id: "blank1",
              correctAnswer: "tumbling",
              acceptableAnswers: ["tumbling", "Tumbling", "fixed"],
            },
            {
              id: "blank2",
              correctAnswer: "sliding",
              acceptableAnswers: ["sliding", "Sliding", "rolling"],
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Flink late event strategy",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "Flink handles late-arriving events using a strategy called _____. For the Top-K system, a tolerance of _____ seconds is configured, which is within the 1-minute freshness SLA.",
        explanation:
          "BoundedOutOfOrdernessWatermarkStrategy tells Flink to wait for a specified duration for late events before closing a window. 30 seconds is chosen because it's generous enough to handle typical network delays but safely within the 1-minute tolerance specified in the non-functional requirements.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            {
              id: "blank1",
              correctAnswer: "BoundedOutOfOrdernessWatermarkStrategy",
              acceptableAnswers: [
                "BoundedOutOfOrdernessWatermarkStrategy",
                "BoundedOutOfOrderness",
                "bounded out-of-orderness",
                "bounded out of orderness watermark strategy",
              ],
            },
            {
              id: "blank2",
              correctAnswer: "30",
              acceptableAnswers: ["30", "~30"],
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Database shard count estimation",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "At 700K views/second, a single Postgres instance handles ~10K writes/second. Without Flink batching, how many database shards are needed to handle the full write throughput?",
        explanation:
          "700,000 / 10,000 = 70 shards. This is a straightforward capacity estimation. In practice, 70 database shards for a counter table is wasteful — which motivates the introduction of Flink batching to reduce the per-shard write rate and bring the count down to 5–10 shards.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 70,
          tolerance: 5,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Sliding window memory multiplication",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          'If Flink\'s native sliding window has a 1-minute slide interval for a "last month" (30-day) window, how many overlapping windows does each event belong to? (Calculate: minutes in 30 days)',
        explanation:
          "30 days × 24 hours × 60 minutes = 43,200 overlapping windows. Each event must be counted in all 43,200 windows simultaneously, multiplying memory requirements by 43,200x. For billions of videos, this makes Flink's native sliding windows completely impractical for long time periods.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 43200,
          tolerance: 100,
        },
      },
    },

    // ── True-False (2 questions) ──

    // True-False 1 — easy (bonus)
    {
      title: "Pagination for Top-K API",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "True or False: The Top-K API requires pagination because result sets can be arbitrarily large.",
        explanation:
          "False. The system explicitly limits K to a maximum of 1000 results. Since the result set is bounded, pagination is unnecessary. The client specifies K in the query parameter, and the system enforces the 1K cap. This is a deliberate design choice that simplifies the API and eliminates the need for cursor management.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "False — K is capped at 1000, so result sets are bounded and pagination is unnecessary",
              isCorrect: true,
            },
            {
              id: "b",
              text: "True — variable result sizes require pagination for all list endpoints",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // True-False 2 — medium (bonus)
    {
      title: "CMS overcount vs undercount",
      type: "question",
      sectionId: "sec_q_approximation",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "True or False: Count-Min Sketch can undercount item frequencies (return estimates lower than the true count) due to hash collisions.",
        explanation:
          "False. CMS can only OVERCOUNT. When multiple items hash to the same counter, the counter increases but never decreases. The estimate for any item is the MINIMUM across all hash functions — this is always ≥ the true count. Hash collisions add noise upward, never downward. This is why CMS provides an upper bound guarantee.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "True — hash collisions cause some counts to be missed, resulting in undercounting",
              isCorrect: false,
            },
            {
              id: "b",
              text: "False — CMS can only overcount; the minimum across hash functions is always ≥ the true count",
              isCorrect: true,
            },
          ],
        },
      },
    },
  ],
};
