/**
 * Metrics Monitoring — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: time-series ingestion at 5M metrics/s, agent-based collection, TSDB storage,
 *         dashboard queries with rollups & caching, polling vs stream alerting,
 *         notification service design, HA, and cardinality explosion
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const metricsMonitoringContent: StoryPointSeed = {
  title: "Metrics Monitoring",
  description:
    "Design a metrics monitoring platform (like Datadog/Prometheus) that ingests 5M metrics/second from 500k servers, stores time-series data, serves low-latency dashboard queries, and evaluates alert rules with sub-minute latency — covering agent-based collection, TSDB storage, rollups, caching, stream alerting, HA, and cardinality explosion.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_ingestion", title: "Ingestion & Data Collection", orderIndex: 1 },
    { id: "sec_q_storage", title: "TSDB Storage & Cardinality", orderIndex: 2 },
    { id: "sec_q_queries", title: "Dashboard Queries & Caching", orderIndex: 3 },
    { id: "sec_q_alerting", title: "Alerting & Notifications", orderIndex: 4 },
    { id: "sec_q_reliability", title: "Reliability, HA & Tradeoffs", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Architecture
    {
      title: "Metrics Monitoring — Requirements & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Metrics Monitoring — Requirements & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is a Metrics Monitoring Platform?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "A metrics monitoring platform collects performance data (CPU, memory, throughput, latency) from servers and services, stores it as time-series data, visualizes it on dashboards, and triggers alerts when thresholds are breached. Think Datadog, Prometheus/Grafana, or AWS CloudWatch. This is infrastructure that engineers rely on to understand system health and respond to incidents.",
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
                  "The platform should ingest metrics (CPU, memory, latency, custom counters) from services.",
                  "Users should query and visualize metrics on dashboards with filters, aggregations, and time ranges.",
                  'Users should define alert rules with thresholds over time windows (e.g., "alert if p99 latency > 500ms for 5 minutes").',
                  "Users should receive notifications when alerts fire (email, Slack, PagerDuty).",
                ],
              },
            },
            {
              id: "b5",
              type: "paragraph",
              content:
                "Out of scope: log aggregation and full-text search, distributed tracing (spans, traces), anomaly detection via ML.",
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
                "We design for monitoring 500k servers. Each server emits 100 metric data points every 10 seconds, yielding 5 million metrics per second at peak. Each data point is ~100-200 bytes, so we ingest ~1GB per second of raw data. That is the crux of the problem.",
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Scale to ingest 5M metrics per second from 500k servers.",
                  "Dashboard queries should return within seconds, even for queries spanning days or weeks.",
                  "Alerts should evaluate with low latency (< 1 minute from metric emission to alert firing).",
                  "Highly available — tolerate eventual consistency for dashboards, but alert evaluation must be reliable.",
                  "Handle late or out-of-order data gracefully (network delays are common).",
                ],
              },
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
                  'Label: A key-value pair attached to a metric for slicing/filtering. E.g., host="server-1", region="us-east".',
                  'Metric: A named measurement with labels and a value at a point in time. E.g., cpu_usage{host="server-1", region="us-east"} = 0.75.',
                  "Series: The full sequence of (timestamp, value) pairs for one specific metric + label combination over time.",
                  'Alert Rule: A condition that triggers notifications — combines a metric query, threshold, and duration. E.g., "average CPU in us-east above 90% for 5 minutes."',
                  "Dashboard: A collection of panels, each displaying a query result as a chart or table.",
                ],
              },
            },
            {
              id: "b11",
              type: "quote",
              content:
                '"The difficult part of a metrics monitoring system is managing series at scale. Most systems specifically attempt to limit growth of the number of series over time — a problem often referred to as cardinality explosion."',
            },
            {
              id: "b12",
              type: "heading",
              content: "Data Flow",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Services generate metric data points (CPU, memory, latency, etc.) and send them to the platform.",
                  "The platform ingests, validates, and stores metrics as time-series data.",
                  "Users query stored metrics through dashboards, filtering and aggregating across time ranges.",
                  "Alert rules are periodically evaluated against stored metrics.",
                  "When an alert condition is breached, a notification is sent to configured channels (Slack, PagerDuty, email).",
                ],
              },
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                "Steps 1-2 are write-heavy and continuous (5M metrics/second), while step 3 is read-heavy and bursty (engineers debugging incidents). Steps 4-5 need to be reliable above all else. These different characteristics drive many design decisions.",
            },
            {
              id: "b15",
              type: "heading",
              content: "System Interface (API)",
              metadata: { level: 2 },
            },
            {
              id: "b16",
              type: "code",
              content:
                '// Ingest metrics (high volume, batched)\nPOST /metrics/ingest\n{\n  "metrics": [\n    { "name": "cpu_usage", "labels": {"host": "server-1"}, "value": 0.75, "timestamp": 1640000000 },\n    ...\n  ]\n}\n\n// Query metrics (PromQL-like DSL)\nGET /metrics/query?query=avg(cpu_usage{region="us-east"})&start=A&end=B&step=60\n-> { "timestamps": [...], "values": [...] }\n\n// Define alert rules\nPOST /alerts/rules\n{\n  "name": "High CPU Alert",\n  "query": "avg(cpu_usage{region=\'us-east\'}) > 0.9",\n  "for": "5m",\n  "notifications": ["slack:#oncall", "pagerduty:team-infra"]\n}',
              metadata: { language: "javascript" },
            },
            {
              id: "b17",
              type: "heading",
              content: "Ingestion Path — From Naive to Production-Grade",
              metadata: { level: 2 },
            },
            {
              id: "b18",
              type: "heading",
              content: "Bad: Horizontal Scaling of Ingestion Service Alone",
              metadata: { level: 3 },
            },
            {
              id: "b19",
              type: "paragraph",
              content:
                "Adding 50 ingestion instances behind a load balancer moves the bottleneck, not removes it. All 50 instances still write directly to the database, which now faces 5M writes/second from 50 different sources. No buffer, no backpressure, no way to replay data after a failure.",
            },
            {
              id: "b20",
              type: "heading",
              content: "Good: Decouple with Kafka",
              metadata: { level: 3 },
            },
            {
              id: "b21",
              type: "paragraph",
              content:
                "Introduce Kafka between ingestion and storage. Kafka absorbs spikes, provides durability (metrics are persisted until consumed), and enables parallel consumers. Downside: adds operational complexity and 10-50ms latency.",
            },
            {
              id: "b22",
              type: "heading",
              content: "Great: Agent-Based Collection with Local Buffering",
              metadata: { level: 3 },
            },
            {
              id: "b23",
              type: "paragraph",
              content:
                "Run a small collector agent on each server (like Datadog Agent or OTEL collectors). The agent collects metrics locally, buffers and batches them, and periodically flushes via Kafka. This shifts work to the edge: instead of 5M requests/second hitting the ingestion service, we send ~50k batched requests/second. Agents can also perform local aggregation (e.g., computing percentiles locally before shipping).",
            },
            {
              id: "b24",
              type: "quote",
              content:
                '"By taking advantage of agents on the servers (to spread the problem) and Kafka (to buffer against spikes), we have the beginnings of an ingestion path. Pattern: Scaling Writes — choosing a write-optimized database, buffering bursts with a queue, and batching at the edge."',
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 2: Storage, Querying & Alerting
    {
      title: "Storage, Dashboard Queries & Alert Evaluation",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Storage, Dashboard Queries & Alert Evaluation",
          blocks: [
            {
              id: "sq1",
              type: "heading",
              content: "Why Not a Relational Database?",
              metadata: { level: 2 },
            },
            {
              id: "sq2",
              type: "paragraph",
              content:
                "At 5M writes/second, Postgres cannot keep up. Sharding breaks cross-shard queries. Read performance degrades as data grows — queries that worked fine with a week of data become unusable with a month. Retention management (DELETEs) causes write amplification and vacuum pressure.",
            },
            {
              id: "sq3",
              type: "heading",
              content: "Time-Series Database (TSDB)",
              metadata: { level: 2 },
            },
            {
              id: "sq4",
              type: "paragraph",
              content:
                "Use a database designed for this workload: InfluxDB, TimescaleDB, or VictoriaMetrics. These are built around the unique characteristics of time-series data:",
            },
            {
              id: "sq5",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Append-only writes: Data is written in time order and almost never updated. LSM-tree or append-only engines achieve high write throughput.",
                  'Time-based partitioning: Data is chunked by time (hourly, daily). Queries for "last 6 hours" only touch recent chunks. Old chunks can be dropped cleanly.',
                  "Columnar compression: Timestamps and values compress extremely well (a day of CPU metrics per host: 100KB → 5KB).",
                  "Built-in rollups: The DB can automatically compute 1-minute, 1-hour, and 1-day aggregates stored separately for fast long-range queries.",
                ],
              },
            },
            {
              id: "sq6",
              type: "paragraph",
              content:
                "Partition by both time and metric series (sharding by hash of metric name + labels). Raw 10-second data is kept for 15 days, 1-minute rollups for 90 days, 1-hour rollups for a year. A separate Query Service sits in front of the TSDB, translating PromQL-like DSL to storage queries — separating read and write paths for independent scaling.",
            },
            {
              id: "sq7",
              type: "heading",
              content: "Low-Latency Dashboard Queries — Deep Dive",
              metadata: { level: 2 },
            },
            {
              id: "sq8",
              type: "heading",
              content: "Bad: Query Raw Data Directly",
              metadata: { level: 3 },
            },
            {
              id: "sq9",
              type: "paragraph",
              content:
                "At 10-second intervals, 30 days = 259,200 data points per series. With 1,000 pods, that is 259 million rows (~25GB) for a single dashboard panel. Response times are measured in minutes, not seconds — unacceptable for incident debugging.",
            },
            {
              id: "sq10",
              type: "heading",
              content: "Good: Pre-Computed Rollups at Multiple Resolutions",
              metadata: { level: 3 },
            },
            {
              id: "sq11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Raw: 10-second intervals, kept 2 days.",
                  "1-minute rollups: kept 2 weeks.",
                  "1-hour rollups: kept 90 days.",
                  "1-day rollups: kept 2 years.",
                ],
              },
            },
            {
              id: "sq12",
              type: "paragraph",
              content:
                "The query engine selects the appropriate resolution based on the time range. A 30-day query uses hourly rollups (720 points per series). Caveat: rollups are lossy — you cannot query p99 latency from pre-aggregated averages. For percentile metrics, store histograms or sketches at each rollup level.",
            },
            {
              id: "sq13",
              type: "heading",
              content: "Great: Caching Layer + Query Splitting",
              metadata: { level: 3 },
            },
            {
              id: "sq14",
              type: "paragraph",
              content:
                "Queries separated by 10 seconds cover almost completely overlapping data (sliding window property). Add a Redis caching layer: split queries so recent data (last 2 hours) hits the database directly for freshness while historical data hits the cache. Precompute popular dashboard queries on a schedule. Cache keys include query + time range. For dashboards that do not require real-time data (most of them), serve entirely from cache with sub-100ms latency.",
            },
            {
              id: "sq15",
              type: "heading",
              content: "Alert Evaluation",
              metadata: { level: 2 },
            },
            {
              id: "sq16",
              type: "paragraph",
              content:
                'Users register alert rules via an API. Rules are stored in Postgres. An Alert Evaluator service periodically grabs rules and fires queries to the TSDB to evaluate them. This polling approach is exactly how Prometheus Alertmanager works — alert rules are evaluated on a fixed interval (default 1 minute), querying the same storage that serves dashboards. The simplicity of "alerts are just scheduled queries" makes the system easy to reason about and debug.',
            },
            {
              id: "sq17",
              type: "heading",
              content: "Notification Service",
              metadata: { level: 2 },
            },
            {
              id: "sq18",
              type: "paragraph",
              content:
                'A Notification Service sits between the Alert Evaluator and notification channels. It handles: deduplication (track alert state as "firing" or "resolved" — only notify on state transitions), grouping (collect alerts within a 30-second window, group by cluster/service, send one notification per group), silencing (mute alerts during maintenance), and escalation (re-notify via different channel if nobody acknowledges). This separation between "evaluating alert conditions" and "managing notifications" is the Prometheus/Alertmanager pattern.',
            },
          ],
          readingTime: 14,
        },
      },
    },

    // Material 3: Deep Dives — Stream Alerting, HA, Cardinality Explosion
    {
      title: "Deep Dives — Stream Alerting, High Availability & Cardinality Explosion",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Stream Alerting, High Availability & Cardinality Explosion",
          blocks: [
            {
              id: "dd1",
              type: "heading",
              content: "Reducing Alert Latency Below 1 Minute",
              metadata: { level: 2 },
            },
            {
              id: "dd2",
              type: "heading",
              content: "Good: Increase Polling Frequency",
              metadata: { level: 3 },
            },
            {
              id: "dd3",
              type: "paragraph",
              content:
                "Run the Alert Evaluator every 15-30 seconds instead of every minute. For 10,000 rules at 15-second intervals, that is ~670 queries/second. This adds load to the TSDB and you are still limited by the evaluation interval (15-second polling = up to 14 seconds latency).",
            },
            {
              id: "dd4",
              type: "heading",
              content: "Great: Stream Processing with Flink",
              metadata: { level: 3 },
            },
            {
              id: "dd5",
              type: "paragraph",
              content:
                'Since metrics already flow through Kafka, add Flink as a second consumer. For each metric series, Flink maintains a windowed state (e.g., rolling 5-minute buffer). Alert rules are compiled into Flink operators that continuously evaluate conditions against those windows. When a threshold is violated for the configured duration, Flink emits an alert event. Alert evaluation happens as data arrives — no database query at all. Latency drops from "up to 60 seconds" to "within seconds of the metric arriving." The polling-based evaluator can still handle non-critical alerts.',
            },
            {
              id: "dd6",
              type: "quote",
              content:
                '"For most organizations, polling every 30-60 seconds is sufficient. Stream-based alerting is worth the complexity only when the interviewer specifically asks. Even then, alerts are likely split between real-time and polling."',
            },
            {
              id: "dd7",
              type: "heading",
              content: "High Availability During Spikes and Failures",
              metadata: { level: 2 },
            },
            {
              id: "dd8",
              type: "paragraph",
              content:
                "If the monitoring system goes down during an incident, you are blind at the exact moment you need visibility. HA matters more here than in most systems. Think separately about: (1) Metrics ingestion — can we keep collecting? (2) Alerting and notifications — can we still detect and notify?",
            },
            {
              id: "dd9",
              type: "heading",
              content: "Great: End-to-End HA — Every Step Resumable",
              metadata: { level: 3 },
            },
            {
              id: "dd10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Ingestion: Agents buffer locally and retry if the network or ingestion layer is down.",
                  "Kafka: Replicated across zones — broker loss does not drop data.",
                  "Writes: Idempotent so retries do not create duplicate points.",
                  "Alert evaluation: State is checkpointed so a processor crash can resume.",
                  "Alert events: Written to Kafka before any external notifications.",
                  "Notification Service: Retries delivery and can fail over to a secondary channel.",
                ],
              },
            },
            {
              id: "dd11",
              type: "paragraph",
              content:
                'The essence: never let in-flight data disappear. When things break, degrade freshness, not correctness. Metrics and alerts may arrive late, but they still arrive. You also need meta-monitoring — a watchdog service to monitor the monitoring system itself. "How would you monitor the monitoring system?" is a classic interview question. The wrong answer is to use the monitoring system to monitor itself!',
            },
            {
              id: "dd12",
              type: "heading",
              content: "Cardinality Explosion",
              metadata: { level: 2 },
            },
            {
              id: "dd13",
              type: "paragraph",
              content:
                "Every unique combination of metric name + labels creates a new series. A metric like http_requests{host, region, endpoint, status_code, method} across 1,000 hosts, 5 regions, 200 endpoints, 10 status codes, and 5 HTTP methods could produce 50 million unique series in theory. On the write side, each series has overhead (indexes, metadata, in-memory tracking), causing performance degradation and memory spikes. On the read side, aggregating over billions of series is extremely slow.",
            },
            {
              id: "dd14",
              type: "heading",
              content: "Cardinality Enforcement",
              metadata: { level: 3 },
            },
            {
              id: "dd15",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Policy store (Postgres): Maps each metric name to allowed label keys, maximum series count, and per-label value limits.",
                  "Cardinality tracker (Redis): Fast counter tracking unique series per metric using a set per metric name.",
                  "Flow: Data point arrives → strip disallowed label keys → hash remaining labels to get series ID → check Redis if series exists → if new, check against cap → under cap: accept and publish to Kafka; over cap: drop and increment dropped_metrics counter.",
                  "When the cap is hit, fire an alert through the notification service. The dropped_metrics counter itself becomes a metric to monitor — more monitoring of the monitoring system!",
                ],
              },
            },
            {
              id: "dd16",
              type: "paragraph",
              content:
                "Policies need per-metric tuning. Too strict and you drop useful data; too loose and you do not prevent the problem. The Redis lookup adds latency to the ingestion path — consider batching checks or using a local bloom filter as a first pass to reduce Redis round trips.",
            },
            {
              id: "dd17",
              type: "heading",
              content: "Interview Level Expectations",
              metadata: { level: 2 },
            },
            {
              id: "dd18",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mid-level (E4): Identify need for a message queue for ingestion scale, propose time-series storage, basic understanding of alerts (poll the database). May not proactively identify cardinality.",
                  "Senior (E5): Proactively identify cardinality as a critical challenge and propose controls. Understand why stream processing is better than polling for alerts. Discuss rollups and retention for query performance.",
                  "Staff+ (E6+): Deep expertise on operational challenges — meta-monitoring, backpressure cascades, alert fatigue, multi-tenancy isolation. Opinions about technology choices backed by experience. Drive the conversation proactively.",
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
      title: "Why agent-based collection over direct push?",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In a metrics monitoring system ingesting 5M metrics/second from 500k servers, why is agent-based collection preferred over direct push to a central ingestion service?",
        explanation:
          "Agent-based collection shifts work to the edge. Instead of 5M requests/second hitting the central ingestion service, agents batch locally and flush periodically, reducing central load to ~50k requests/second. This is the standard pattern used by Datadog, Prometheus, and other production systems because it scales better and provides better reliability through local buffering.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Agents batch and buffer locally, reducing central ingestion load from 5M to ~50k requests/second",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Agents provide strong consistency guarantees for metric data",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Agents eliminate the need for Kafka in the pipeline",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Agents enable real-time alerting without a separate alert service",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why not Postgres for time-series metrics?",
      type: "question",
      sectionId: "sec_q_storage",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why does a relational database like Postgres fail as the primary storage for a metrics monitoring system at scale (5M writes/second)?",
        explanation:
          "At 5M writes/second, Postgres cannot keep up with the write throughput. Additionally, queries that work fine with a week of data become unusable with a month of data, retention management (DELETEs) causes write amplification and vacuum pressure, and sharding breaks cross-shard queries needed for aggregations.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Postgres lacks support for indexing by metric name",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Write throughput is insufficient, read performance degrades over time, and retention management creates vacuum pressure",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Postgres does not support timestamp-based queries",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Postgres cannot store floating-point metric values",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "TSDB key advantage for time-series data",
      type: "question",
      sectionId: "sec_q_storage",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Which characteristic of time-series databases (InfluxDB, VictoriaMetrics) makes them well-suited for metrics storage compared to general-purpose databases?",
        explanation:
          "Time-series databases use append-only writes with LSM-tree engines, time-based partitioning (so queries touch only recent chunks), columnar compression (extreme compression ratios), and built-in rollups. These characteristics are specifically optimized for the append-heavy, time-ordered nature of metrics data.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Support for complex JOIN operations across metric types",
              isCorrect: false,
            },
            {
              id: "b",
              text: "ACID transactions for metric updates",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Time-based partitioning with append-only writes, columnar compression, and built-in rollups",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Built-in full-text search for log correlation",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Polling vs stream-based alerting tradeoff",
      type: "question",
      sectionId: "sec_q_alerting",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A team debates between polling-based alerting (querying the TSDB every 30 seconds) and stream-based alerting (Flink consuming from Kafka). Which statement best captures the core tradeoff?",
        explanation:
          "Polling-based alerting reuses the existing query path (simple, debuggable), but latency is bounded by the polling interval and it adds load to the TSDB. Stream-based alerting evaluates conditions as data arrives (seconds of latency, no DB query) but adds operational complexity — Flink state management, checkpointing, and translating rules into streaming operators. Most organizations use polling for non-critical alerts and stream processing only when sub-minute latency is required.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Polling is better for critical alerts because it queries the source of truth (TSDB)",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Stream processing is always superior because it eliminates database load",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Polling reuses the query path and is simpler but has interval-bounded latency; stream processing is faster but adds Flink operational complexity",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Both approaches have identical latency when properly configured",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Rollup lossy tradeoff",
      type: "question",
      sectionId: "sec_q_queries",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A metrics monitoring system stores 1-minute rollups for 2 weeks and raw 10-second data for only 2 days. An engineer queries p99 latency for a service over the past week. What problem will they encounter?",
        explanation:
          "Rollups are lossy — they store aggregated values (min, max, avg, count) but not the full distribution. You cannot compute p99 from pre-aggregated averages because the individual data points have been collapsed. For percentile metrics over rollup periods, the system must store histograms or t-digest sketches at each rollup level.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The query will fail because 1-minute rollups do not support latency metrics",
              isCorrect: false,
            },
            {
              id: "b",
              text: "P99 cannot be computed from pre-aggregated rollups because the raw distribution is lost; histograms or sketches are needed",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The query will succeed but with slightly reduced accuracy proportional to the rollup window",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The TSDB will automatically reconstruct raw data from rollups for percentile queries",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Notification service deduplication",
      type: "question",
      sectionId: "sec_q_alerting",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The Alert Evaluator runs every minute and CPU remains above 90% for 10 minutes. Without a Notification Service, the on-call engineer gets paged 10 times. How does the Notification Service solve this?",
        explanation:
          'The Notification Service tracks alert state as either "firing" or "resolved." It only sends notifications on state transitions — when an alert first fires, and when it resolves. So the engineer gets one page when CPU first breaches 90%, and one when it drops below. This is exactly the Prometheus/Alertmanager pattern: dedup by tracking firing state.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Rate-limit notifications to at most one per hour per alert rule",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Track alert state as firing/resolved and only notify on state transitions — one page at breach start, one at resolution",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Buffer all alert events for 10 minutes and send a single summary",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Send the first notification and then suppress all subsequent ones permanently",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Kafka catch-up tradeoff after downtime",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "The ingestion consumers are down for 5 minutes. With Kafka buffering, there are now 5 minutes of backlogged metrics. If the system normally operates at 75% capacity, how long will it take to catch up to real-time, and what is the key operational insight?",
        explanation:
          "At 75% capacity, only 25% of capacity is available for catch-up. The backlog represents 5 minutes of full-throughput data. Catch-up time = backlog / spare_capacity = 5 minutes / 0.25 = 15 minutes. The key insight: for monitoring systems, it is often better to lose some data than to persistently run behind. A system that is 15 minutes behind on metrics is worse than one that dropped 5 minutes and is current.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Instantaneous — Kafka consumers can burst above normal capacity",
              isCorrect: false,
            },
            {
              id: "b",
              text: "20 minutes — Kafka replay adds overhead that reduces effective throughput",
              isCorrect: false,
            },
            {
              id: "c",
              text: "5 minutes — the system can process the backlog at the same rate it was produced",
              isCorrect: false,
            },
            {
              id: "d",
              text: "15 minutes — only 25% spare capacity available, and for monitoring it may be better to drop data than run persistently behind",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Meta-monitoring anti-pattern",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'An interviewer asks: "How would you monitor the monitoring system itself?" What is the most dangerous anti-pattern and the correct approach?',
        explanation:
          'Using the monitoring system to monitor itself is the classic anti-pattern — if it goes down, you lose both the primary monitoring and the meta-monitoring simultaneously. The correct approach is a separate, independent watchdog service (possibly a simpler, different monitoring system) that checks the health of the primary monitoring platform. This is a well-known operational lesson with endless post-mortems from teams who were "flying blind" because their monitoring, terminal access, or other tooling was down at the same time as the service they needed to debug.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Anti-pattern: alerting on monitoring health. Correct: only check monitoring health during business hours",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Anti-pattern: monitoring system monitors itself. Correct: separate independent watchdog service to avoid correlated failures",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Anti-pattern: monitoring too many metrics. Correct: only monitor critical infrastructure metrics",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Anti-pattern: using a different tool. Correct: always use the same monitoring platform for consistency",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Core non-functional requirements for metrics monitoring",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid non-functional requirements for a metrics monitoring platform at this scale:",
        explanation:
          "Scalability to 5M metrics/s, HA for alerts, sub-second dashboard queries, and handling late/out-of-order data are all core NFRs. Strong consistency is not required — eventual consistency for dashboards is acceptable. ML-based anomaly detection is explicitly out of scope.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Handle late or out-of-order data gracefully",
              isCorrect: true,
            },
            {
              id: "b",
              text: "ML-based anomaly detection on all metrics",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Scale to ingest 5M metrics per second from 500k servers",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Dashboard queries return within seconds even for week-long ranges",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Strong consistency for all dashboard reads",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "TSDB advantages over relational databases for metrics",
      type: "question",
      sectionId: "sec_q_storage",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL characteristics of time-series databases that make them superior to Postgres for metrics storage at scale:",
        explanation:
          "TSDBs use append-only writes (LSM-tree engines for high write throughput), time-based partitioning (old chunks drop cleanly without vacuum), columnar compression (timestamps and values compress extremely well), and built-in rollups. They do NOT support complex JOINs — that is a relational database strength. They also struggle with high-cardinality label combinations.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Superior support for complex JOINs across metric types",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Automatic handling of unlimited label cardinality",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Time-based partitioning so old data drops cleanly without vacuum pressure",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Append-only writes with LSM-tree engines for high write throughput",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Built-in rollup computation at multiple time resolutions",
              isCorrect: true,
            },
            {
              id: "f",
              text: "Columnar compression achieving 20:1 compression on timestamps and values",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Notification service responsibilities",
      type: "question",
      sectionId: "sec_q_alerting",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL responsibilities of the Notification Service in the alerting pipeline:",
        explanation:
          "The Notification Service handles deduplication (only notify on state transitions), grouping (one notification per cluster/service instead of per server), silencing (mute during maintenance), and escalation (re-notify via different channel if no acknowledgement). It does NOT evaluate alert rules (that is the Alert Evaluator) or store metric data.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Deduplication — only notify on firing/resolved state transitions",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Escalation — re-notify through a different channel if no acknowledgement",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Storing metric data points for later querying",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Grouping — collect alerts within a time window and send per group instead of per server",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Silencing — mute specific alerts during scheduled maintenance",
              isCorrect: true,
            },
            {
              id: "f",
              text: "Evaluating alert rule conditions against metric data",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Cardinality enforcement mechanisms",
      type: "question",
      sectionId: "sec_q_storage",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL components of the cardinality enforcement system described in this design:",
        explanation:
          "The cardinality enforcement system includes: a policy store in Postgres mapping metric names to allowed label keys and series caps, a Redis-based cardinality tracker using sets per metric name, label key stripping (dropping labels not in the allowlist), and a dropped_metrics counter that itself becomes a monitored metric. Bloom filters are mentioned as an optional optimization for reducing Redis round trips, but are not a core component. Schema validation for label values is a reasonable idea but not described in this design.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "A dropped_metrics counter that is itself a metric the system monitors",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Policy store in Postgres mapping metric names to allowed label keys and maximum series counts",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Schema validation that rejects label values containing special characters",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Label key stripping — discard labels not in the per-metric allowlist before hashing",
              isCorrect: true,
            },
            {
              id: "e",
              text: "A mandatory bloom filter on every ingestion node for sub-millisecond dedup",
              isCorrect: false,
            },
            {
              id: "f",
              text: "Redis-based cardinality tracker with a set per metric name for fast series existence checks",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Ingestion path evolution",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Walk through the evolution of the ingestion path from the naive approach (direct push) to the production-grade solution (agent-based collection with Kafka). For each stage, explain the bottleneck it solves and the new challenge it introduces.",
        explanation:
          "A strong answer covers three stages: (1) direct push to ingestion service — bottleneck is all 5M metrics hit the service, no buffer; (2) add Kafka — decouples ingestion from storage, handles backpressure, but still 5M requests hit ingestion; (3) agent-based collection — shifts batching to the edge, 100x reduction in central requests, local buffering handles transient failures.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Stage 1 — Direct Push: Servers POST metrics directly to a central ingestion service that writes to storage. At 5M metrics/second, the ingestion service is overwhelmed and becomes a bottleneck. There is no buffer, so if the database slows down, incoming metrics are dropped.\n\nStage 2 — Kafka Decoupling: Introduce Kafka between ingestion and storage. This provides backpressure handling (Kafka absorbs spikes), durability (metrics persist until consumed), and parallelism (multiple consumer partitions). However, we still have 5M requests/second hitting the central ingestion service — we have moved the bottleneck downstream but not eliminated it at the edge.\n\nStage 3 — Agent-Based Collection: Deploy a collector agent (like Datadog Agent) on each of the 500k servers. Agents collect metrics locally at high frequency, buffer and batch them, then flush periodically to Kafka. This reduces central ingestion load from 5M to ~50k requests/second — a 100x reduction. Agents can also compute local aggregations (percentiles) before shipping.\n\nNew challenge: Agent deployment complexity. You must manage agent versions, configurations, and failures across 500k servers. But this is the industry standard (Datadog, Prometheus, OTEL) because it is the only approach that scales to hundreds of thousands of sources.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Separate read and write paths",
      type: "question",
      sectionId: "sec_q_queries",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain why the metrics monitoring system separates the read path (Query Service) from the write path (Ingestion Consumer). How do their characteristics differ, and what does separation enable?",
        explanation:
          "A strong answer contrasts the two paths: writes are constant, predictable, and must never be dropped (5M/s continuous). Reads are sporadic, user-driven, bursty (engineers debugging incidents), and can be expensive (scanning weeks of data). Separation enables independent scaling, tuning, and adding a caching layer to the read path without complicating writes.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "The write path handles continuous, predictable, high-throughput ingestion at 5M metrics/second. It must never drop data and has strict latency requirements for metric freshness. The read path handles sporadic, bursty dashboard queries from engineers — potentially expensive queries scanning weeks of data that must return in seconds.\n\nThese have completely different scaling characteristics. Writes are steady-state and volume-driven; reads spike during incidents when everyone opens dashboards simultaneously. By separating them:\n\n1. Independent scaling: Add more ingestion consumers without affecting query performance, or scale query nodes during incident debugging without impacting write throughput.\n2. Independent tuning: Optimize the write path for throughput (batch writes, async acknowledgement) and the read path for latency (caching, query optimization).\n3. Caching layer: A Redis cache can be added to the Query Service for repeated dashboard queries without touching the write path.\n4. Failure isolation: A slow query does not create backpressure on metric ingestion.",
          minLength: 120,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the caching strategy for dashboard queries",
      type: "question",
      sectionId: "sec_q_queries",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a caching strategy for dashboard queries that takes advantage of the sliding window property of time-series queries. Explain query splitting, precomputation, and result caching. What are the cache invalidation challenges?",
        explanation:
          "A staff-level answer describes the sliding window insight (queries 10s apart overlap almost completely), query splitting (recent data from DB for freshness, historical from cache), precomputation of popular queries, result caching with query+time-range keys, and invalidation challenges (data backfills, corrections, memory management).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The key insight is the sliding window property: two dashboard queries separated by 10 seconds cover almost completely overlapping data — only the last 10 seconds differ. We can exploit this with three techniques:\n\n1. Query Splitting: Break a 30-day query into segments. Recent data (last 2 hours) queries the TSDB directly for freshness. Historical data (everything before 2 hours ago) queries the cache first. Historical data is immutable (once aggregated, it does not change), making it highly cacheable.\n\n2. Precomputation: Identify popular dashboard queries (by tracking query frequency) and precompute them on a schedule. Store results in Redis with TTLs aligned to data freshness requirements. Most dashboards refresh every 30-60 seconds, so a 30-second TTL on precomputed results is acceptable.\n\n3. Result Caching: Cache query results with composite keys: hash(query_DSL + time_range + resolution). Subsequent identical queries hit the cache directly. Since most engineers during an incident are looking at the same dashboards, cache hit rates are very high.\n\nFor non-real-time dashboards (most of them), this approach achieves sub-100ms latency by serving entirely from cache.\n\nCache Invalidation Challenges:\n- Data backfills or corrections must invalidate affected cache entries, requiring knowledge of which queries are affected.\n- Cache size needs monitoring to prevent memory exhaustion — eviction policies (LRU) and TTLs are essential.\n- Resolution transitions: A query might span the boundary between raw data and rollups, requiring careful stitching.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Cardinality explosion causes and mitigations",
      type: "question",
      sectionId: "sec_q_storage",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain what cardinality explosion is in a metrics monitoring system, why it is dangerous on both the read and write sides, and design a cardinality enforcement system. Include the enforcement flow and discuss the tradeoffs of label-based policies.",
        explanation:
          "A staff-level answer explains series = unique(metric_name + labels), gives a concrete example of combinatorial explosion, describes write-side impact (index overhead, memory spikes) and read-side impact (aggregating millions of series), then designs the policy store + Redis tracker + enforcement flow with drop-and-alert.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Cardinality explosion occurs when the number of unique time series grows uncontrollably. Each unique combination of metric name + label values creates a new series. For example, http_requests{host, region, endpoint, status_code, method} across 1,000 hosts × 5 regions × 200 endpoints × 10 status codes × 5 methods could produce 50 million unique series.\n\nWrite-side impact: Each series has overhead — indexes, metadata, in-memory tracking. When series count explodes, write performance degrades as the TSDB spends more time managing series metadata than storing data points. Memory usage spikes, potentially OOMing the database.\n\nRead-side impact: Aggregating over millions of series (e.g., total http_requests across all hosts) requires reading every series. At billions of series, even simple aggregations take minutes.\n\nEnforcement System Design:\n1. Policy Store (Postgres): Map each metric name to allowed label keys, maximum series count, and per-label value limits. E.g., http_requests allows labels {host, region, endpoint} with a 500k series cap.\n2. Cardinality Tracker (Redis): Maintain a SET per metric name containing all known series hashes. SET membership checks are O(1).\n3. Enforcement Flow: Data point arrives → strip labels not in the allowlist → hash remaining labels → SISMEMBER check in Redis → if new series, check SET size against cap → under cap: SADD to set and publish to Kafka; over cap: drop and increment dropped_metrics counter → alert the team when cap is hit.\n\nTradeoffs: Too strict → useful data is dropped. Too loose → does not prevent the problem. Requires per-metric tuning based on understanding actual usage patterns. The Redis check adds latency to the hot path — mitigate with local bloom filters as a first pass.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "HA design for the monitoring system",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Design the high availability strategy for a metrics monitoring platform. Address both the ingestion path and the alerting/notification path separately. Explain the philosophy "degrade freshness, not correctness" and how meta-monitoring fits in.',
        explanation:
          "A staff-level answer separates ingestion HA (agent buffering, Kafka replication, idempotent writes) from alerting HA (checkpointed state, Kafka before notifications, retry with failover), articulates the freshness-vs-correctness tradeoff, and addresses the meta-monitoring challenge.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'HA in a monitoring system is more critical than in most systems — if monitoring goes down during an incident, you are blind when you need visibility most.\n\nIngestion Path HA:\n- Agents buffer locally and retry if the network or ingestion layer is down. Agent-side buffering means metrics are not lost during transient failures.\n- Kafka is replicated across availability zones so a broker loss does not drop data.\n- Writes to the TSDB are idempotent so retries from agent or consumer restarts do not create duplicate data points.\n\nAlerting/Notification Path HA:\n- Alert evaluation state (whether using polling or Flink) is checkpointed so a processor crash can resume without losing track of in-progress evaluations.\n- Alert events are written to Kafka before any external notifications are sent. This ensures the alert is durably recorded even if PagerDuty or Slack is temporarily down.\n- The Notification Service retries delivery and can fail over to a secondary channel (e.g., SMS if Slack is down).\n\n"Degrade freshness, not correctness": When components fail, metrics and alerts may arrive late, but they still arrive. A monitoring system that shows stale-but-accurate data is far more useful than one that drops data and shows gaps.\n\nMeta-monitoring: The monitoring system cannot monitor itself — a correlated failure takes out both. Use a separate, independent watchdog service (possibly a simple heartbeat checker or a different monitoring tool like a basic Nagios instance) to verify that the primary monitoring platform is healthy. Many post-mortems trace back to the monitoring system failing at the same time as the service it was supposed to be watching.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Staff-level interview walkthrough",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are in a Staff Engineer system design interview. The interviewer asks you to design a metrics monitoring platform. Walk through how you would structure your 45-minute interview: what you cover in the first 5 minutes, how you allocate breadth vs depth, and which 2-3 deep dives you would choose and why.",
        explanation:
          "A staff-level answer demonstrates interview meta-strategy: quick requirements/scope, efficient HLD covering all four flows, then 60% of time on deep dives that showcase production experience. Good deep dive choices: cardinality explosion (shows operational awareness), query performance (shows understanding of data access patterns), HA/meta-monitoring (shows reliability thinking).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'First 5 minutes — Requirements & Scope:\nQuickly establish functional requirements (ingest, query dashboards, alert rules, notifications) and non-functional requirements (5M metrics/s, sub-second queries, <1 min alert latency, HA). Clarify out-of-scope: logs, tracing, ML anomaly detection. Define core entities: metric, label, series, alert rule, dashboard. Note the series explosion problem as a foreshadow.\n\nMinutes 5-15 — High-Level Design (40% breadth):\nSketch the end-to-end pipeline: Agent on each server → Kafka → Ingestion Consumer → TSDB (InfluxDB/VictoriaMetrics). Separate Query Service with Redis cache for dashboards. Alert Evaluator (polling TSDB) → Notification Service (dedup, grouping, silencing) → channels. Mention the PromQL-like query DSL and the API shape. Do not linger — move efficiently.\n\nMinutes 15-40 — Deep Dives (60% depth):\nI would choose these based on where I can demonstrate the most production experience:\n\n1. Cardinality Explosion (12 min): This is the defining challenge of metrics systems. Walk through the combinatorial math, explain write-side and read-side impact, then design the full enforcement system: policy store, Redis tracker, label stripping, drop-and-alert flow. Discuss tuning tradeoffs and bloom filter optimization. This shows I have operated a metrics platform at scale.\n\n2. Dashboard Query Performance (10 min): Multi-resolution rollups (raw → 1min → 1hr → 1day) with automatic resolution selection. The sliding window caching insight. Query splitting for fresh vs historical data. Percentile metrics requiring histograms/sketches at rollup boundaries. This shows depth on the data access patterns.\n\n3. HA and Meta-Monitoring (8 min): Agent-side buffering, Kafka replication, idempotent writes. "Degrade freshness, not correctness" philosophy. The meta-monitoring question: separate watchdog, not self-monitoring. Kafka catch-up math after downtime (75% capacity → 15 min catch-up for 5 min outage).\n\nMinutes 40-45: Wrap up with push vs pull collection model tradeoffs (Prometheus pull vs Datadog push). Answer remaining questions.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Name the scaling pattern",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "The metrics monitoring system uses three strategies to handle ingestion at 5M metrics/second: a write-optimized TSDB, Kafka buffering, and agent-level batching. What is the overarching scaling pattern name from HelloInterview?",
        explanation:
          'This is a "Scaling Writes" pattern. The entire ingestion architecture — write-optimized database, queue buffering for bursts, and batching at the edge — is driven by the need to handle massive write throughput. The read load from dashboard queries is comparatively smaller.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Scaling Writes",
          acceptableAnswers: [
            "Scaling Writes",
            "scaling writes",
            "Scaling writes",
            "scaling-writes",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Name the Prometheus component for notification management",
      type: "question",
      sectionId: "sec_q_alerting",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In the Prometheus ecosystem, what is the name of the component that handles alert deduplication, grouping, silencing, and escalation — the same role our Notification Service plays?",
        explanation:
          'Alertmanager is the Prometheus component that receives alert events from Prometheus and handles routing, grouping, deduplication, silencing, and notification delivery. The separation between "evaluating alert conditions" (Prometheus) and "managing notifications" (Alertmanager) is a well-established pattern.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Alertmanager",
          acceptableAnswers: [
            "Alertmanager",
            "alertmanager",
            "Alert Manager",
            "alert manager",
            "AlertManager",
            "Prometheus Alertmanager",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Series explosion terminology",
      type: "question",
      sectionId: "sec_q_storage",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "What is the term used in the metrics/observability industry for the problem where an uncontrolled growth in unique combinations of metric name + labels creates performance and storage issues in time-series databases?",
        explanation:
          "Cardinality explosion refers to the uncontrolled growth of unique time series in a metrics system. It occurs when labels with high value diversity (like user_id or request_id) are attached to metrics, creating millions or billions of unique series. It impacts both write performance (index/memory overhead per series) and read performance (aggregation across too many series).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Cardinality explosion",
          acceptableAnswers: [
            "Cardinality explosion",
            "cardinality explosion",
            "cardinality bomb",
            "high cardinality",
            "series explosion",
            "label cardinality explosion",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Data structure for lossless percentile rollups",
      type: "question",
      sectionId: "sec_q_queries",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Pre-aggregated rollups lose the raw distribution, making percentile queries impossible from averages alone. What data structure should be stored at each rollup level to enable approximate percentile queries (e.g., p99 latency)?",
        explanation:
          "Histograms (or probabilistic sketches like t-digest or DDSketch) capture the distribution of values at each rollup level, enabling approximate percentile computation. Unlike storing just min/max/avg/count, histograms preserve enough distribution information to compute p50, p95, p99, etc. T-digest is particularly popular because it provides high accuracy at the tails of the distribution where percentile queries matter most.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Histograms",
          acceptableAnswers: [
            "Histograms",
            "histograms",
            "histogram",
            "Histogram",
            "t-digest",
            "T-Digest",
            "sketches",
            "DDSketch",
            "histogram sketches",
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
      sectionId: "sec_q_alerting",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each technology/component to its role in the metrics monitoring pipeline:",
        explanation:
          "Kafka decouples ingestion from storage and provides buffering. The TSDB (InfluxDB/VictoriaMetrics) stores time-series data with compression and rollups. Redis provides fast caching for dashboard query results. The Alert Evaluator periodically queries the TSDB to check alert rule conditions.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Kafka",
              right: "Decouples ingestion from storage with backpressure buffering",
            },
            {
              id: "p2",
              left: "TSDB (InfluxDB)",
              right: "Stores time-series metrics with compression and rollups",
            },
            {
              id: "p3",
              left: "Redis",
              right: "Caches dashboard query results for sub-100ms latency",
            },
            {
              id: "p4",
              left: "Alert Evaluator",
              right: "Periodically queries TSDB to check alert rule conditions",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match design decision to its tradeoff",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each architectural decision to the tradeoff it introduces:",
        explanation:
          "Agent-based collection shifts work to the edge but requires managing agents across 500k servers. Rollups trade precision for query speed. Separate read/write paths enable independent scaling but increase operational complexity. Polling-based alerting is simple but alert latency is bounded by the polling interval.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Agent-based collection",
              right: "Reduces central load 100x but requires managing agents on 500k servers",
            },
            {
              id: "p2",
              left: "Pre-computed rollups",
              right: "Enables fast long-range queries but loses raw data distribution (lossy)",
            },
            {
              id: "p3",
              left: "Separate Query Service from Ingestion",
              right: "Independent scaling and caching but more services to operate",
            },
            {
              id: "p4",
              left: "Polling-based Alert Evaluator",
              right: "Simple and debuggable but latency bounded by polling interval",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match failure scenario to HA mechanism",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each failure scenario to the appropriate high availability mechanism in the metrics monitoring platform:",
        explanation:
          "Ingestion consumer crash: Kafka retains metrics until consumed, consumer group rebalances partitions. TSDB node failure: Sharded and replicated across nodes — other replicas serve queries. Alert evaluator crash: Checkpointed state allows resumption without losing in-progress evaluations. Notification provider outage (Slack down): Notification Service retries and fails over to secondary channel (e.g., SMS).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Ingestion consumer crashes",
              right:
                "Kafka retains data; consumer group rebalances partitions to surviving instances",
            },
            {
              id: "p2",
              left: "TSDB node goes down",
              right: "Replication across nodes ensures queries are served by remaining replicas",
            },
            {
              id: "p3",
              left: "Alert evaluator process dies",
              right: "Checkpointed evaluation state enables resumption without missed alerts",
            },
            {
              id: "p4",
              left: "Slack notification API is down",
              right: "Notification Service retries and fails over to secondary channel (SMS/email)",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "Series definition",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In a metrics monitoring system, a _____ is defined as the full sequence of (timestamp, value) pairs for one unique combination of metric name and labels over time.",
        explanation:
          'A series (or time series) is the fundamental unit of storage in a metrics platform. Each unique combination of metric name + label key-value pairs creates a distinct series. For example, cpu_usage{host="server-1"} and cpu_usage{host="server-2"} are two different series.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "In a metrics monitoring system, a {{blank1}} is defined as the full sequence of (timestamp, value) pairs for one unique combination of metric name and labels over time.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "series",
              acceptableAnswers: ["series", "time series", "time-series", "Series"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Monitoring freshness philosophy",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          'The HA philosophy for a metrics monitoring system is: "When things break, degrade _____, not correctness." Metrics may arrive late, but they still arrive.',
        explanation:
          'The principle "degrade freshness, not correctness" means that when components fail, the system should prioritize data accuracy over timeliness. Stale-but-accurate metrics are more useful than fast-but-incomplete data. This is achieved through agent-side buffering, Kafka retention, and idempotent writes.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            'The HA philosophy for a metrics monitoring system is: "When things break, degrade {{blank1}}, not correctness." Metrics may arrive late, but they still arrive.',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "freshness",
              acceptableAnswers: ["freshness", "Freshness", "timeliness", "latency"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Query engine resolution selection",
      type: "question",
      sectionId: "sec_q_queries",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "When a dashboard query arrives, the query engine selects the appropriate _____ based on the time range. A 30-day query uses hourly data (720 points per series) instead of raw 10-second data (259,200 points per series).",
        explanation:
          "The query engine selects the appropriate resolution (or granularity) based on the time range requested. Multiple resolutions are stored via pre-computed rollups: raw (10s), 1-minute, 1-hour, 1-day. Longer time ranges use coarser resolutions to keep query performance within seconds.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "When a dashboard query arrives, the query engine selects the appropriate {{blank1}} based on the time range. A 30-day query uses hourly data (720 points per series) instead of raw 10-second data (259,200 points per series).",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "resolution",
              acceptableAnswers: [
                "resolution",
                "granularity",
                "rollup level",
                "rollup",
                "time resolution",
              ],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // --- Numerical (2 questions) ---

    // Numerical 1 — medium
    {
      title: "Raw ingestion bandwidth estimation",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "Each of the 500k servers emits 100 metric data points every 10 seconds. Each data point is ~200 bytes. What is the raw ingestion bandwidth in GB per second? (Round to nearest integer)",
        explanation:
          "Metrics per second = 500,000 servers × 100 data points / 10 seconds = 5,000,000 metrics/second. Bandwidth = 5,000,000 × 200 bytes = 1,000,000,000 bytes/second = 1 GB/second. This is the crux of the scaling challenge for the ingestion path.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 1,
          tolerance: 0.5,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Theoretical series count from label combinations",
      type: "question",
      sectionId: "sec_q_storage",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A metric http_requests has labels: host (1,000 unique values), region (5 values), endpoint (200 values), status_code (10 values), and method (5 values). What is the theoretical maximum number of unique series (in millions)?",
        explanation:
          "Maximum unique series = 1,000 × 5 × 200 × 10 × 5 = 50,000,000 = 50 million. In practice the number is lower because not every combination exists (e.g., not every host exists in every region), but this theoretical maximum illustrates why cardinality enforcement is critical.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 50,
          tolerance: 5,
        },
      },
    },
  ],
};
