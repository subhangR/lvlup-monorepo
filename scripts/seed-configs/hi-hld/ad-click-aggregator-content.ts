/**
 * Ad Click Aggregator — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: requirements, high-level design, stream processing, scaling, fault tolerance, idempotency
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const adClickAggregatorContent: StoryPointSeed = {
  title: "Ad Click Aggregator",
  description:
    "Design an ad click aggregation system that tracks billions of ad clicks, pre-aggregates metrics for low-latency querying, and guarantees fault-tolerant, idempotent data collection at 10k clicks/second peak.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements & System Design", orderIndex: 1 },
    { id: "sec_q_stream_processing", title: "Stream Processing & Aggregation", orderIndex: 2 },
    { id: "sec_q_scaling", title: "Scaling & Data Storage", orderIndex: 3 },
    { id: "sec_q_idempotency", title: "Idempotency & Deduplication", orderIndex: 4 },
    { id: "sec_q_fault_tolerance", title: "Fault Tolerance & Trade-offs", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Design
    {
      title: "Ad Click Aggregator — Requirements & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Ad Click Aggregator — Requirements & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is an Ad Click Aggregator?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "An Ad Click Aggregator is a system that collects and aggregates data on ad clicks. Advertisers use it to track ad performance and optimize campaigns. Think of the ads displayed on Facebook or Google — every click must be captured, aggregated, and made queryable in near real-time.",
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
                  "Users can click on an ad and be redirected to the advertiser's website.",
                  "Advertisers can query ad click metrics over time with a minimum granularity of 1 minute.",
                ],
              },
            },
            {
              id: "b5",
              type: "paragraph",
              content:
                "Out of scope: ad targeting, ad serving, cross-device tracking, integration with offline marketing channels.",
            },
            {
              id: "b6",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "We design for 10M active ads and a peak of 10k clicks per second. Average throughput is ~1k clicks/s (peak ≈ 10× average), yielding ~100M clicks per day.",
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Scalable to support a peak of 10k clicks per second.",
                  "Low-latency analytics queries for advertisers (sub-second response time).",
                  "Fault-tolerant and accurate — no click data should be lost.",
                  "Near real-time — advertisers should query data as soon as possible after the click.",
                  "Idempotent click tracking — the same click must not be counted multiple times.",
                ],
              },
            },
            {
              id: "b9",
              type: "heading",
              content: "System Interface & Data Flow",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Input: Ad click data from users.",
                  "Output: Aggregated ad click metrics for advertisers.",
                  "Flow: User clicks ad → click tracked & stored → user redirected → advertisers query aggregated metrics.",
                ],
              },
            },
            {
              id: "b11",
              type: "heading",
              content: "Handling Redirects",
              metadata: { level: 2 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "Client-side redirect: Simple — browser gets the target URL with the ad and redirects directly while POSTing to /click in parallel. Downside: users can bypass click tracking by extracting the URL. Server-side redirect (preferred): User clicks hit our server, which tracks the click and responds with a 302 redirect. This guarantees every click is captured before the user reaches the advertiser's site.",
            },
            {
              id: "b13",
              type: "heading",
              content: "Approaches to Processing Clicks",
              metadata: { level: 2 },
            },
            {
              id: "b14",
              type: "heading",
              content: "Bad: Store and Query From the Same Database",
              metadata: { level: 3 },
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "Store raw click events and run GROUP BY queries for metrics. At 10k clicks/s the database becomes a bottleneck and GROUP BY queries are too slow for sub-second response times.",
            },
            {
              id: "b16",
              type: "heading",
              content: "Good: Batch Processing with Separate Analytics DB",
              metadata: { level: 3 },
            },
            {
              id: "b17",
              type: "paragraph",
              content:
                "Store raw events in a write-optimized store (Cassandra), then run periodic Spark batch jobs to aggregate data into an OLAP database (Snowflake, BigQuery, ClickHouse). Advertisers query the pre-aggregated OLAP DB for fast reads. Downsides: data is always a few minutes stale, and traffic spikes can cause cascading delays.",
            },
            {
              id: "b18",
              type: "heading",
              content: "Great: Real-Time Stream Processing",
              metadata: { level: 3 },
            },
            {
              id: "b19",
              type: "paragraph",
              content:
                "Click processor writes events to a stream (Kafka/Kinesis). A stream processor (Flink) reads events, aggregates them in tumbling windows using event-time semantics, and flushes results to the OLAP DB. This provides near real-time data with configurable flush intervals.",
            },
            {
              id: "b20",
              type: "quote",
              content:
                '"Flink gives us windowed aggregations with event-time semantics, watermarks for late events, exactly-once processing, and built-in fault tolerance — all painful to build yourself on raw Kafka consumers."',
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Deep Dives — Scaling, Fault Tolerance, Idempotency
    {
      title: "Deep Dives — Scaling, Fault Tolerance & Idempotency",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Scaling, Fault Tolerance & Idempotency",
          blocks: [
            {
              id: "dd1",
              type: "heading",
              content: "Scaling to 10k Clicks Per Second",
              metadata: { level: 2 },
            },
            {
              id: "dd2",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Click Processor Service: Horizontally scale with auto-scaling behind a load balancer.",
                  "Stream (Kafka/Kinesis): Partition by AdId. Kinesis has 1MB/s or 1000 records/s per shard — add shards accordingly.",
                  "Stream Processor (Flink): Scale horizontally — one Flink task per shard, aggregating events for the AdIds in that shard.",
                  "OLAP Database: Managed solutions (Snowflake, BigQuery) auto-scale. Self-managed (ClickHouse) can shard by AdvertiserId.",
                ],
              },
            },
            {
              id: "dd3",
              type: "heading",
              content: "Hot Shard Problem",
              metadata: { level: 3 },
            },
            {
              id: "dd4",
              type: "paragraph",
              content:
                "When a viral ad (e.g., Nike + LeBron James) generates disproportionate traffic, its shard becomes overwhelmed. Solution: append a random suffix (0-N) to the partition key for hot ads, creating sub-partitions. When writing to the OLAP DB, Flink strips the suffix and upserts with SUM aggregation so concurrent writes from different sub-partitions combine correctly.",
            },
            {
              id: "dd5",
              type: "heading",
              content: "Fault Tolerance — No Lost Clicks",
              metadata: { level: 2 },
            },
            {
              id: "dd6",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Kafka/Kinesis replicate data across brokers/AZs — node failures don't lose data.",
                  "Enable persistent storage with a 7-day retention period so events can be replayed if the stream processor goes down.",
                  "For small aggregation windows (1 minute), Flink checkpointing may be unnecessary — replay from a known Kafka timestamp instead.",
                  "Archive raw events to a data lake (S3) via Kafka Connect S3 Sink or Kinesis Firehose.",
                ],
              },
            },
            {
              id: "dd7",
              type: "heading",
              content: "Reconciliation (Lambda Architecture)",
              metadata: { level: 3 },
            },
            {
              id: "dd8",
              type: "paragraph",
              content:
                "Run a periodic batch job (e.g., daily Spark job) that re-aggregates raw events from the data lake and compares with stream processor results. Discrepancies are investigated and the OLAP DB is corrected. This combines a speed layer (Flink) for low latency with a batch layer (Spark) for correctness — known as Lambda Architecture.",
            },
            {
              id: "dd9",
              type: "heading",
              content: "Idempotent Click Tracking",
              metadata: { level: 2 },
            },
            {
              id: "dd10",
              type: "paragraph",
              content:
                "Bad approach: Require login and dedup on userId + adId. This fails for retargeting scenarios where the same user should be able to click the same ad shown in different placements.",
            },
            {
              id: "dd11",
              type: "paragraph",
              content:
                "Great approach: The Ad Placement Service generates a unique impression ID per ad instance shown. This impression ID serves as the idempotency key. Before writing to the stream, the click processor checks a distributed cache (Redis) — if the impression ID exists, it's a duplicate; otherwise, write to stream first, then add to cache.",
            },
            {
              id: "dd12",
              type: "paragraph",
              content:
                "To prevent abuse with falsified impression IDs, sign the impression ID + adId using HMAC with a secret key. Verification is microseconds (just a hash) so it adds negligible latency. Cache size is small: 100M impressions/day × 16 bytes = ~1.6 GB.",
            },
            {
              id: "dd13",
              type: "heading",
              content: "Low-Latency Advertiser Queries",
              metadata: { level: 2 },
            },
            {
              id: "dd14",
              type: "paragraph",
              content:
                "Pre-aggregation handles minute-level queries. For larger windows (days, weeks, years), create additional tables with higher-granularity rollups via nightly cron jobs. This is analogous to caching — trading storage for query performance on the most common access patterns.",
            },
            {
              id: "dd15",
              type: "heading",
              content: "Interview Level Expectations",
              metadata: { level: 2 },
            },
            {
              id: "dd16",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mid-level (E4): Understand pre-aggregation, propose batch processing, handle basic probing on idempotency and DB choices.",
                  "Senior (E5): Speed through HLD, discuss batch vs stream tradeoffs, propose fault-tolerant solution, justify technology choices.",
                  "Staff+ (E6+): Deep tradeoff analysis, practical tech experience, proactively identify problems, teach the interviewer something new.",
                ],
              },
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Key Technology Choices & Patterns
    {
      title: "Key Technologies & Design Patterns",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Key Technologies & Design Patterns",
          blocks: [
            {
              id: "kt1",
              type: "heading",
              content: "Technology Selection Summary",
              metadata: { level: 2 },
            },
            {
              id: "kt2",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Event Store: Cassandra — LSM-tree based, append-only writes, optimized for high write throughput.",
                  "Message Stream: Kafka or Kinesis — distributed, fault-tolerant, persistent, partitionable.",
                  "Stream Processor: Apache Flink — event-time windowing, watermarks, exactly-once semantics, state recovery.",
                  "OLAP Database: Snowflake / BigQuery / ClickHouse — columnar storage, fast aggregations (COUNT, SUM, AVG).",
                  "Dedup Cache: Redis Cluster — sub-millisecond lookups, distributed, persistent (RDB/AOF).",
                  "Batch Reconciliation: Apache Spark — MapReduce paradigm, distributed, reads from data lake (S3).",
                ],
              },
            },
            {
              id: "kt3",
              type: "heading",
              content: "Why OLAP Over TSDB?",
              metadata: { level: 3 },
            },
            {
              id: "kt4",
              type: "paragraph",
              content:
                'Time-series databases (InfluxDB, TimescaleDB) excel at "give me metric X over time range Y" with low cardinality. But ad click systems have millions of ad IDs and advertisers want multi-dimensional slicing (device, geo, campaign). OLAP databases handle this high-cardinality, multi-dimensional querying far better. A TSDB is acceptable if requirements are truly limited to simple time-range queries.',
            },
            {
              id: "kt5",
              type: "heading",
              content: "Cassandra Write Path",
              metadata: { level: 3 },
            },
            {
              id: "kt6",
              type: "paragraph",
              content:
                "Cassandra writes first to an append-only commit log on disk (durability), then to an in-memory memtable. Memtables are periodically flushed to disk as SSTables. This LSM-tree structure is optimized for writes but not for range queries or aggregations — which is why we need the separate analytics pipeline.",
            },
            {
              id: "kt7",
              type: "heading",
              content: "Pattern: Scaling Writes",
              metadata: { level: 2 },
            },
            {
              id: "kt8",
              type: "paragraph",
              content:
                'Ad click aggregation is a textbook "scaling writes" problem. The entire architecture — stream buffering (Kafka), pre-aggregation (Flink), and partitioning by AdId — is driven by the need to handle high write throughput (10k/s peak) without losing data. The read load from advertisers querying metrics is comparatively small.',
            },
            {
              id: "kt9",
              type: "heading",
              content: "Event Time vs Processing Time",
              metadata: { level: 3 },
            },
            {
              id: "kt10",
              type: "paragraph",
              content:
                "Flink uses event time (when the click occurred) rather than processing time (when Flink received it) for aggregations. This ensures accuracy even when events arrive out of order. Watermarks track event-time progress and determine when it's safe to close a window. Late-arriving events can still be handled within configurable allowed lateness.",
            },
            {
              id: "kt11",
              type: "code",
              content:
                "-- OLAP Pre-aggregated Schema\nAd_Id       | Minute_Timestamp | Unique_Clicks\n------------|------------------|---------------\n123         | 1640000000       | 100\n123         | 1640000060       | 87\n456         | 1640000000       | 42\n\n-- Raw Event Schema (Cassandra)\nEvent_Id | Ad_Id | User_Id | Timestamp\n---------|-------|---------|----------\n1        | 123   | 456     | 1640000000\n2        | 123   | 789     | 1640000001",
              metadata: { language: "sql" },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════════════

    // --- MCQ (8 questions) ---

    // MCQ 1 — easy
    {
      title: "Server-side vs client-side redirect",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In an ad click aggregator, why is a server-side redirect (302) preferred over a client-side redirect for handling ad clicks?",
        explanation:
          "A server-side 302 redirect ensures every click is tracked before the user reaches the advertiser's site. With client-side redirects, sophisticated users or browser extensions can extract the target URL and bypass click tracking entirely, leading to data discrepancies.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It is faster than a client-side redirect",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It eliminates the need for a click processor service",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It guarantees every click is tracked before the user leaves",
              isCorrect: true,
            },
            {
              id: "d",
              text: "It prevents users from seeing the advertiser's URL",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why not query raw click events directly?",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is storing raw click events and running GROUP BY queries directly a poor solution at scale (10k clicks/s)?",
        explanation:
          "At 10k clicks/s, the database becomes a write and read bottleneck. GROUP BY queries over raw events are slow because they scan large datasets without pre-aggregation. This violates the sub-second query latency requirement for advertisers.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "SQL databases cannot store click events",
              isCorrect: false,
            },
            {
              id: "b",
              text: "GROUP BY queries are not supported at scale",
              isCorrect: false,
            },
            {
              id: "c",
              text: "GROUP BY queries scan too much raw data, making sub-second latency impossible",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Raw events take too much disk space",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Cassandra write path",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the correct write path in Cassandra that makes it suitable for high-throughput click event storage?",
        explanation:
          "Cassandra uses an LSM-tree based storage structure. Writes go first to an append-only commit log (for durability), then to an in-memory memtable. Memtables are periodically flushed to disk as SSTables. This append-only write path enables very high write throughput.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "B-tree index → WAL → Disk page",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Commit log → Memtable → SSTable",
              isCorrect: true,
            },
            {
              id: "c",
              text: "WAL → Buffer pool → Data file",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Memtable → Commit log → B-tree",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Stream processing vs batch processing latency",
      type: "question",
      sectionId: "sec_q_stream_processing",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A team is debating between Spark batch jobs (running every 5 minutes) and Flink stream processing (1-minute tumbling windows with 10-second flush intervals). Which statement best describes the latency tradeoff?",
        explanation:
          "Flink can flush partial results within a window (e.g., every 10 seconds) while maintaining minute-boundary aggregations. Spark batch jobs have inherent startup overhead and process entire batches, making sub-minute intervals impractical. Flink's configurable flush intervals provide the best of both worlds: minute-boundary correctness with seconds-level freshness.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Spark provides lower latency because it processes data in parallel across the cluster",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Flink can flush partial results every few seconds within its minute window; Spark batch jobs cannot practically run that frequently due to startup overhead",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Flink always has higher latency because it waits for watermarks before emitting results",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Both have identical latency if the Spark job frequency equals Flink's window size",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "OLAP vs TSDB for ad click metrics",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Why is an OLAP database (e.g., ClickHouse, BigQuery) generally preferred over a time-series database (e.g., InfluxDB) for ad click metrics?",
        explanation:
          'With millions of ad IDs and the need to slice data by multiple dimensions (device type, geography, campaign), OLAP databases handle high-cardinality, multi-dimensional querying much better. TSDBs excel at low-cardinality "metric X over time Y" patterns. If requirements are truly limited to simple time-range queries, a TSDB could work.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "OLAP handles high-cardinality, multi-dimensional queries (millions of ad IDs, multiple dimensions) better than TSDBs",
              isCorrect: true,
            },
            {
              id: "b",
              text: "OLAP databases have faster write throughput than TSDBs",
              isCorrect: false,
            },
            {
              id: "c",
              text: "TSDBs cannot store aggregated data",
              isCorrect: false,
            },
            {
              id: "d",
              text: "OLAP databases provide stronger consistency guarantees",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Hot shard resolution strategy",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A viral Nike ad is causing a hot shard in Kafka because all its click events share the same AdId partition key. What is the most effective mitigation?",
        explanation:
          "Appending a random suffix (0-N) to the partition key for hot ads distributes events across multiple partitions. When writing to the OLAP DB, Flink strips the suffix and upserts with SUM aggregation so concurrent writes combine correctly. This is superior to increasing partition count globally (wastes resources for non-hot ads) or moving to a different key (loses the ability to co-locate related events).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Buffer all hot ad events in memory and process them in a single batch",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Increase the total number of Kafka partitions globally",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Append a random suffix to the AdId partition key for known hot ads, then strip it before writing to the OLAP DB",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Switch the partition key from AdId to UserId",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Flink checkpointing necessity",
      type: "question",
      sectionId: "sec_q_stream_processing",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In an ad click aggregator with 1-minute tumbling windows, a candidate proposes enabling Flink checkpointing every 30 seconds. An experienced interviewer pushes back. What is the strongest argument against frequent checkpointing in this specific context?",
        explanation:
          "With 1-minute windows, losing Flink state means losing at most 1 minute of partially aggregated data. Since Kafka has persistent storage enabled, the system can replay from a known timestamp and re-aggregate. The overhead of checkpointing every 30 seconds (snapshotting state to S3) is not justified when the recovery cost is just replaying ~60 seconds of events. This is a nuanced argument that demonstrates seniority — understanding when a well-known pattern is actually unnecessary.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Kafka already provides exactly-once semantics, making Flink checkpointing redundant",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Checkpointing introduces duplicate events that break idempotency",
              isCorrect: false,
            },
            {
              id: "c",
              text: "With tiny windows, at most 1 minute of data is lost; replaying from Kafka is cheaper than frequent checkpoint overhead",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Flink does not support checkpointing with Kafka sources",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Order of operations for click dedup",
      type: "question",
      sectionId: "sec_q_idempotency",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "When deduplicating clicks using an impression ID cache, the click processor must (1) write to the stream and (2) add the impression ID to cache. What is the correct order and why?",
        explanation:
          "Writing to the stream first ensures clicks are never lost. If we cache first and the stream write fails, we'd silently drop a legitimate click with no way to recover it. By writing to the stream first, a cache update failure means the next click with the same impression ID might be a duplicate — but duplicates can be caught by the periodic reconciliation job. Lost clicks cannot be recovered.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Cache first, then write to stream — this prevents duplicates from ever entering the pipeline",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Both operations should be in a distributed transaction for atomicity",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The order does not matter because Flink handles deduplication downstream",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Write to stream first, then cache — a cache failure causes a recoverable duplicate, but a stream failure after caching causes an irrecoverable lost click",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Non-functional requirements for ad click aggregator",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL valid non-functional requirements for an ad click aggregation system:",
        explanation:
          "Scalability (10k clicks/s peak), fault tolerance (no lost clicks), and idempotent tracking are all core NFRs. Strong consistency across all reads is not required — eventual consistency with near real-time freshness is the target. Fraud detection is explicitly out of scope.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Fault-tolerant with no click data loss",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Idempotent click tracking",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Scalable to 10k clicks per second peak",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Strong consistency across all reads",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Real-time fraud detection",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Flink advantages over raw Kafka consumers",
      type: "question",
      sectionId: "sec_q_stream_processing",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL capabilities that Flink provides out-of-the-box that would be painful to build on raw Kafka consumers:",
        explanation:
          "Flink provides windowed aggregations with event-time semantics (not processing time), watermarks for tracking event-time progress and handling late events, exactly-once processing guarantees, and built-in fault tolerance with state recovery. Schema evolution and automatic OLAP writes are not Flink features.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Native OLAP database write connectors",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Built-in fault tolerance with state recovery",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Exactly-once processing guarantees",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Automatic schema evolution for downstream databases",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Windowed aggregations with event-time semantics",
              isCorrect: true,
            },
            {
              id: "f",
              text: "Watermarks for handling late-arriving events",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Fault tolerance mechanisms in the pipeline",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL mechanisms that contribute to fault tolerance in the ad click aggregation pipeline:",
        explanation:
          "Kafka replicates across brokers, Kinesis across AZs — both prevent data loss from node failures. Retention policies (e.g., 7 days) allow replaying events if the stream processor fails. Archiving raw events to S3 enables reconciliation. Synchronous writes to multiple OLAP replicas is not part of the described architecture — the OLAP DB handles its own replication internally.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Synchronous writes to multiple OLAP database replicas",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Periodic batch reconciliation comparing stream and batch results",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Kafka/Kinesis replication across brokers or availability zones",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Archiving raw events to a data lake (S3) for reconciliation",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Stream retention policy (e.g., 7-day retention)",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Impression ID dedup security considerations",
      type: "question",
      sectionId: "sec_q_idempotency",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content: "Select ALL true statements about the impression ID-based deduplication approach:",
        explanation:
          "Impression IDs are generated per ad instance shown (not per ad), so retargeting works correctly. HMAC signing prevents replay attacks with falsified IDs. The cache is small (~1.6 GB for 100M daily impressions). HMAC is a hash computation, not asymmetric crypto, so it adds microseconds. Dedup must happen before the stream (not in Flink) because duplicates could span aggregation window boundaries.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "HMAC signing prevents attackers from generating valid impression IDs for click fraud",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The Redis dedup cache for 100M daily impressions requires only ~1.6 GB",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Dedup must happen before writing to the stream, not in Flink, because duplicates can span window boundaries",
              isCorrect: true,
            },
            {
              id: "d",
              text: "HMAC verification adds significant latency because it uses asymmetric cryptography",
              isCorrect: false,
            },
            {
              id: "e",
              text: "One impression ID per AdId is sufficient for deduplication",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Batch vs stream processing tradeoffs",
      type: "question",
      sectionId: "sec_q_stream_processing",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare batch processing (Spark) and stream processing (Flink) for ad click aggregation. Discuss latency, complexity, fault tolerance, and when each approach is appropriate.",
        explanation:
          "A strong answer contrasts latency (batch has inherent delay vs stream near-real-time), complexity (batch is simpler to reason about vs stream requires understanding windowing/watermarks), fault tolerance (batch can re-run entire jobs vs stream needs checkpointing or replay), and use cases (batch for reconciliation and correctness vs stream for live dashboards).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Batch processing (Spark) aggregates click events on a schedule (e.g., every 5 minutes). It is simpler to implement and reason about — each batch job reads a fixed window of events, aggregates, and writes results. However, it introduces latency equal to the batch interval plus processing time. It is excellent for reconciliation and correctness guarantees.\n\nStream processing (Flink) processes events as they arrive, maintaining running aggregations in tumbling windows. It provides near real-time data (seconds of latency) but is more complex — requiring understanding of event-time semantics, watermarks, windowing, and state management. Flink can flush partial results within windows for even lower perceived latency.\n\nFor fault tolerance, Spark can simply re-run a failed batch. Flink relies on checkpointing or Kafka replay, though for small windows the replay cost is minimal.\n\nThe ideal architecture uses both: Flink for the speed layer (live advertiser dashboards) and Spark for the batch layer (periodic reconciliation to correct any streaming inaccuracies). This is the Lambda Architecture pattern.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Impression ID vs userId-based dedup",
      type: "question",
      sectionId: "sec_q_idempotency",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain why deduplicating ad clicks by userId + adId is insufficient, and how impression IDs solve the problem. Include the security consideration for impression IDs.",
        explanation:
          "A strong answer identifies the retargeting problem (same user, same ad, different placements), explains impression IDs as per-instance idempotency keys, and covers HMAC signing to prevent fraud.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Deduplicating by userId + adId means a user can only ever register one click for any given ad. This breaks retargeting scenarios where we intentionally show the same ad to the same user multiple times across different placements — each showing is a separate impression that should be independently clickable.\n\nImpression IDs solve this by generating a unique ID per ad instance shown. If 1000 users see the same Nike ad, that creates 1000 impression IDs. If one user sees it twice in different positions, that creates 2 impression IDs. Each impression can register exactly one click.\n\nThe security concern is that malicious users could fabricate impression IDs to inflate click counts. To prevent this, the Ad Placement Service signs the impression ID together with the adId using HMAC with a secret key. The click processor verifies this signature before processing — since HMAC is just a hash computation, verification adds only microseconds of latency.",
          minLength: 120,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the reconciliation pipeline",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a reconciliation pipeline that ensures long-term data accuracy in the ad click aggregator. Explain what data sources it uses, how it detects discrepancies, and how it corrects them. Discuss why this is necessary even with a reliable stream processor.",
        explanation:
          "A staff-level answer describes the Lambda Architecture: speed layer (Flink) for real-time and batch layer (Spark) for correctness. It should mention archiving raw events to S3, running daily Spark jobs to re-aggregate, comparing results with the OLAP DB, and updating discrepancies.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Even with reliable stream processing, transient Flink errors, bad code deployments, out-of-order events, or edge cases in watermark handling can introduce subtle inaccuracies. Click data directly impacts advertiser billing, so correctness is paramount.\n\nThe reconciliation pipeline works as follows:\n1. Raw event archival: Alongside the stream processors, raw click events are continuously dumped to a data lake (S3) via Kafka Connect S3 Sink Connector or Kinesis Data Firehose. This adds no load to Flink.\n2. Periodic batch re-aggregation: A daily Spark job reads all raw events from S3 for the previous day and performs a full re-aggregation — the same aggregation Flink does, but on the complete, ordered dataset.\n3. Discrepancy detection: The batch results are compared with the OLAP database values produced by Flink. Any mismatches are flagged.\n4. Correction: Discrepancies are investigated (alerting the team to potential bugs), and the OLAP DB is updated with the batch-computed correct values.\n\nThis is the Lambda Architecture pattern: a speed layer (Flink) for low-latency approximate results, and a batch layer (Spark) as the source of truth. The batch layer periodically corrects any drift in the speed layer, ensuring billing accuracy over time.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Scaling strategy end-to-end",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Walk through how each component of the ad click aggregator pipeline scales to handle 10k clicks per second at peak. Identify the bottleneck at each layer and explain the scaling strategy, including how you would handle hot shards.",
        explanation:
          "A complete answer addresses: click processor horizontal scaling with load balancer, Kafka/Kinesis partitioning by AdId with shard management, Flink horizontal scaling with one task per shard, OLAP sharding by AdvertiserId, and the hot shard solution (random suffix on partition key, strip before OLAP upsert).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Layer-by-layer scaling:\n\n1. Click Processor Service: Stateless HTTP service behind a load balancer. Scale horizontally with auto-scaling based on CPU/memory. Each instance handles /click requests independently.\n\n2. Message Stream (Kafka/Kinesis): Partition by AdId so all events for one ad land on the same partition. Kinesis shards support 1MB/s or 1000 records/s each — at 10k clicks/s with ~100 bytes each, we need ~10-15 shards minimum. Kafka partitions have higher throughput limits.\n\n3. Stream Processor (Flink): One Flink task reads from each partition, performing windowed aggregation for the AdIds in that shard. Adding partitions scales Flink linearly.\n\n4. OLAP Database: Managed solutions (BigQuery, Snowflake) auto-scale. Self-managed (ClickHouse) can shard by AdvertiserId so advertiser-level queries hit a single node.\n\nHot shards: When a viral ad dominates a partition, append a random suffix (AdId:0 through AdId:N) to the partition key for known hot ads (identified by ad spend or historical click volume). This spreads events across N+1 partitions. When Flink writes to the OLAP DB, it strips the suffix and performs upserts with SUM aggregation, so writes from different sub-partitions combine correctly.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Lambda Architecture tradeoffs",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "The ad click aggregator uses a Lambda Architecture with Flink as the speed layer and Spark as the batch layer. Discuss the tradeoffs of this architecture. What are the operational challenges? When might you consider Kappa Architecture instead?",
        explanation:
          "A staff-level answer discusses code duplication (maintaining two aggregation codebases), operational complexity (two pipelines to monitor), correctness guarantees, and latency. Kappa Architecture uses only stream processing (reprocessing by replaying the stream) and is simpler but assumes the stream processor can handle full reprocessing loads.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Lambda Architecture tradeoffs:\n\nAdvantages:\n- Speed layer (Flink) provides near real-time metrics for live advertiser dashboards.\n- Batch layer (Spark) acts as source of truth, catching any inaccuracies from transient stream processing issues.\n- Decoupled failure domains — batch layer works even if Flink is temporarily down.\n\nOperational challenges:\n- Code duplication: Aggregation logic must be maintained in both Flink and Spark, potentially in different languages/frameworks. Divergence between the two is a constant risk.\n- Monitoring complexity: Two pipelines to monitor, alert on, and debug.\n- Merge logic: The system needs logic to determine when to use batch-corrected values vs real-time values, especially during the transition window.\n\nKappa Architecture alternative:\nKappa eliminates the batch layer entirely. Historical reprocessing is done by replaying the event stream through the same Flink pipeline. This simplifies the codebase (one aggregation path) and operations (one pipeline).\n\nKappa works well when: the stream processor is reliable enough that corrections are rare, the event retention period covers the reprocessing window, and the stream processor can handle the throughput of replaying historical data alongside live data.\n\nFor ad click aggregation, Lambda is often preferred because click data has financial implications (advertiser billing), making the batch correction layer worth the operational overhead.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Staff-level interview walkthrough",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are in a Staff Engineer system design interview. The interviewer asks you to design an ad click aggregator. Walk through how you would structure your 45-minute interview: what do you cover in the first 5 minutes, how do you allocate time between breadth and depth, and which 2-3 deep dives would you choose and why?",
        explanation:
          "A staff-level answer demonstrates interview meta-strategy: quick requirements/scope, efficient HLD, then 60% of time on carefully chosen deep dives that showcase experience and teach the interviewer something.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "First 5 minutes — Requirements & Scope:\nQuickly confirm functional requirements (click tracking + redirect, advertiser metrics at 1-min granularity) and non-functional requirements (10k clicks/s peak, sub-second queries, no data loss, idempotency). Clarify out-of-scope items. Establish the system interface: Input = click data, Output = aggregated metrics.\n\nMinutes 5-15 — High-Level Design (breadth):\nSketch the end-to-end pipeline efficiently: Ad Placement Service → Click Processor (302 redirect) → Kafka → Flink (tumbling windows) → OLAP DB → Advertiser Query API. Mention Cassandra for raw events and S3 archival. Don't linger — the interviewer knows I understand the basics.\n\nMinutes 15-40 — Deep Dives (depth, 60% of time):\nI would choose these 2-3 deep dives based on where I can demonstrate the most depth:\n\n1. Scaling writes & hot shard handling (10 min): Walk through partition-by-AdId strategy, identify the hot shard problem proactively, propose the random suffix solution with upsert-SUM semantics. This shows I've dealt with real-world data skew.\n\n2. Fault tolerance & reconciliation (10 min): Explain why Flink checkpointing may be unnecessary for small windows (shows critical thinking against common wisdom), then design the Lambda Architecture reconciliation pipeline with S3 archival.\n\n3. Idempotency with impression IDs (5 min): Show the progression from userId-based dedup to impression IDs, including HMAC signing. This demonstrates security awareness.\n\nMinutes 40-45 — Wrap up with pre-aggregation strategy for larger time windows and answer any remaining questions.",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Name the architecture pattern",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What is the name of the architecture pattern that combines a real-time speed layer (e.g., Flink) with a batch correction layer (e.g., Spark) to balance latency and accuracy?",
        explanation:
          "The Lambda Architecture, coined by Nathan Marz, consists of a speed layer for low-latency results and a batch layer for correctness. The batch layer periodically reconciles any inaccuracies from the speed layer.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Lambda Architecture",
          acceptableAnswers: [
            "Lambda Architecture",
            "Lambda",
            "lambda architecture",
            "lambda",
            "Lambda architecture",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "HTTP redirect status code",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What HTTP status code does the click processor use to redirect users to the advertiser's website after tracking the click?",
        explanation:
          "A 302 (Found/Temporary Redirect) status code tells the browser to follow the new URL. A 302 is preferred over 301 (permanent redirect) because the redirect URL may change, and we don't want browsers to cache it.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "302",
          acceptableAnswers: ["302", "HTTP 302", "302 Found", "302 Temporary Redirect"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Signing algorithm for impression IDs",
      type: "question",
      sectionId: "sec_q_idempotency",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "What cryptographic mechanism is used to sign impression IDs (along with adId) to prevent click fraud with falsified IDs? Why is it chosen over asymmetric cryptography?",
        explanation:
          "HMAC (Hash-based Message Authentication Code) is used because it is extremely fast — just a hash computation with a secret key, taking only microseconds. Asymmetric cryptography (RSA, ECDSA) would be orders of magnitude slower and unnecessary since both the signer (Ad Placement Service) and verifier (Click Processor) can share a secret key.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "HMAC",
          acceptableAnswers: [
            "HMAC",
            "hmac",
            "Hash-based Message Authentication Code",
            "HMAC signing",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Flink time semantics",
      type: "question",
      sectionId: "sec_q_stream_processing",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Flink uses a specific type of timestamp (not processing time) for accurate aggregations even when events arrive out of order. What is this called, and what mechanism does Flink use to track its progress?",
        explanation:
          "Flink uses event time — the timestamp of when the click actually occurred, embedded in the event itself. Watermarks are used to track event-time progress across the stream, telling Flink when it's safe to close a window because no more events with timestamps before the watermark are expected.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Event time with watermarks",
          acceptableAnswers: [
            "Event time with watermarks",
            "event time, watermarks",
            "Event time and watermarks",
            "event time",
            "Event time",
          ],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match component to role in the pipeline",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each technology to its role in the ad click aggregator pipeline:",
        explanation:
          "Kafka buffers and distributes click events across partitions. Flink performs real-time windowed aggregation. ClickHouse (OLAP) stores pre-aggregated metrics for fast advertiser queries. Redis provides sub-millisecond impression ID lookups for deduplication.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            { id: "p1", left: "Kafka", right: "Message streaming and event buffering" },
            { id: "p2", left: "Flink", right: "Real-time windowed aggregation" },
            { id: "p3", left: "ClickHouse", right: "OLAP storage for advertiser queries" },
            { id: "p4", left: "Redis", right: "Impression ID dedup cache" },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match design decision to its tradeoff",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each architectural decision to the tradeoff it introduces:",
        explanation:
          "Server-side redirects add a network hop (latency) but guarantee click tracking. Pre-aggregation trades storage for query speed. Stream processing reduces latency but requires understanding complex concepts like watermarks and windowing. Random partition suffixes fix hot shards but require stripping and re-aggregating at write time.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Server-side 302 redirect",
              right: "Adds latency but guarantees click capture",
            },
            {
              id: "p2",
              left: "Pre-aggregation in OLAP DB",
              right: "Uses more storage but enables sub-second queries",
            },
            {
              id: "p3",
              left: "Flink stream processing",
              right: "Lower latency but higher operational complexity",
            },
            {
              id: "p4",
              left: "Random suffix on hot shard keys",
              right: "Distributes load but requires merge logic at write time",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match failure scenario to recovery mechanism",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each failure scenario to the appropriate recovery mechanism in the ad click aggregator:",
        explanation:
          "Flink crash: replay from Kafka (retention policy ensures data availability, small window means minimal re-aggregation). Redis cache down: Redis replicas + AOF persistence take over. Subtle aggregation drift from Flink bugs: daily Spark reconciliation from S3 data lake catches and corrects it. Kafka broker failure: replication across brokers ensures no data loss.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Flink stream processor crashes",
              right: "Replay events from Kafka using retention policy",
            },
            {
              id: "p2",
              left: "Redis dedup cache goes down",
              right: "Failover to replica with AOF/RDB persistence",
            },
            {
              id: "p3",
              left: "Subtle aggregation drift over time",
              right: "Daily Spark reconciliation job from S3 data lake",
            },
            {
              id: "p4",
              left: "Kafka broker failure",
              right: "Cross-broker replication ensures zero data loss",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "OLAP storage type",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "OLAP databases use _____ storage formats that make aggregation queries (COUNT, SUM, AVG) extremely fast compared to row-based databases.",
        explanation:
          "Columnar storage formats store data by column rather than by row. This allows aggregation queries to read only the columns they need, skipping irrelevant data. This is why OLAP databases like ClickHouse, BigQuery, and Snowflake are orders of magnitude faster than row-based databases for analytical queries.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "OLAP databases use {{blank1}} storage formats that make aggregation queries (COUNT, SUM, AVG) extremely fast compared to row-based databases.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "columnar",
              acceptableAnswers: ["columnar", "column-oriented", "column", "column-based"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Scaling pattern classification",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          'Ad click aggregation is a textbook "scaling _____" problem because the write throughput (10k clicks/s) far exceeds the read load from advertisers.',
        explanation:
          'This is a "scaling writes" problem. The architecture (Kafka buffering, Flink pre-aggregation, partitioning by AdId) is entirely driven by the need to handle high write throughput. Advertiser read queries are comparatively infrequent and hit pre-aggregated data.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            'Ad click aggregation is a textbook "scaling {{blank1}}" problem because the write throughput (10k clicks/s) far exceeds the read load from advertisers.',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "writes",
              acceptableAnswers: ["writes", "write", "Writes", "Write"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Flink window mechanism",
      type: "question",
      sectionId: "sec_q_stream_processing",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "Flink uses _____ to track event-time progress and determine when it is safe to close an aggregation window, even when events arrive out of order.",
        explanation:
          'Watermarks are special timestamps that flow through the stream, telling Flink "no more events with timestamps before this value will arrive." When a watermark passes a window boundary, Flink knows it\'s safe to close that window and emit results. This allows correct aggregation despite out-of-order event arrival.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "Flink uses {{blank1}} to track event-time progress and determine when it is safe to close an aggregation window, even when events arrive out of order.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "watermarks",
              acceptableAnswers: ["watermarks", "Watermarks", "watermark", "Watermark"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // --- Numerical (2 questions) ---

    // Numerical 1 — medium
    {
      title: "Daily click volume estimation",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "If the system has a peak throughput of 10k clicks/second and we assume average throughput is 1/10th of peak (a common heuristic), how many clicks per day does the system process? (Answer in millions)",
        explanation:
          "Average throughput = 10,000 / 10 = 1,000 clicks/second. Daily volume = 1,000 × 86,400 seconds/day = 86,400,000 ≈ ~86-100M clicks/day. The article rounds to ~100M for simplicity.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 86,
          tolerance: 15,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Dedup cache memory estimation",
      type: "question",
      sectionId: "sec_q_idempotency",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "The dedup cache stores impression IDs (128-bit UUIDs = 16 bytes each). If we process 100 million unique impressions per day, how many gigabytes of memory does the cache require? (Round to 1 decimal place)",
        explanation:
          "100,000,000 impressions × 16 bytes = 1,600,000,000 bytes = 1.6 GB. This is surprisingly small, demonstrating that the dedup cache is not a storage concern. In practice, you would add overhead for hash table structure (~2x), bringing it to ~3.2 GB — still easily handled by a single Redis instance.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 1.6,
          tolerance: 0.5,
        },
      },
    },
  ],
};
