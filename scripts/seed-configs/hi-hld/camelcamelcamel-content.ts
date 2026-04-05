import { StoryPointSeed, ItemSeed } from "../subhang-content";

// ── CamelCamelCamel (Price Tracking Service) — HLD Content ──

export const camelcamelcamelContent: StoryPointSeed = {
  title: "Design CamelCamelCamel (Price Tracking Service)",
  description:
    "Design a price tracking service like CamelCamelCamel that monitors Amazon product prices, displays price history charts, and notifies users of price drops. Covers web crawling at scale, Chrome extension crowdsourcing, data validation, event-driven notifications, and time-series query optimization.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements & API Design", orderIndex: 1 },
    { id: "sec_q_architecture", title: "Architecture & System Evolution", orderIndex: 2 },
    { id: "sec_q_data_collection", title: "Data Collection & Crawling at Scale", orderIndex: 3 },
    { id: "sec_q_validation", title: "Data Validation & Trust Mechanisms", orderIndex: 4 },
    { id: "sec_q_notifications", title: "Notifications & Price History Queries", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Problem Understanding & High-Level Architecture
    {
      title: "CamelCamelCamel — Requirements & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "CamelCamelCamel — Requirements & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is CamelCamelCamel?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "CamelCamelCamel is a price tracking service that monitors Amazon product prices over time and alerts users when prices drop below their specified thresholds. It features a Chrome extension with 1 million active users that displays price history directly on Amazon product pages. The system must handle 500 million Amazon products, serve price history queries under 500ms, and deliver notifications within 1 hour of price changes.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Functional Requirements",
              metadata: { level: 3 },
            },
            {
              id: "b4",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Users should be able to view price history for Amazon products (via website or Chrome extension)",
                  "Users should be able to subscribe to price drop notifications with thresholds (via website or Chrome extension)",
                ],
              },
            },
            {
              id: "b5",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 3 },
            },
            {
              id: "b6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Prioritize availability over consistency (eventual consistency acceptable)",
                  "Handle 500 million Amazon products at scale",
                  "Price history queries with < 500ms latency",
                  "Deliver price drop notifications within 1 hour of price change",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 3 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Product — Amazon product with current price and metadata",
                  "User — person using the service with contact info and preferences",
                  "Subscription — links users to products with a price threshold for notifications",
                  "Price — time-series data capturing price changes over time per product",
                ],
              },
            },
            {
              id: "b9",
              type: "heading",
              content: "API Design",
              metadata: { level: 3 },
            },
            {
              id: "b10",
              type: "code",
              content:
                "// Retrieve historical price data for charts\nGET /products/{product_id}/price?period=30d&granularity=daily\n  -> PriceHistory[]\n\n// Subscribe to price drop notifications\nPOST /subscriptions\n{\n  product_id,\n  price_threshold,\n  notification_type\n}\n  -> 200 OK",
              metadata: { language: "text" },
            },
            {
              id: "b11",
              type: "paragraph",
              content:
                "The product_id is placed in the URL path rather than the request body for better caching and REST compliance. The granularity parameter allows returning daily averages for long periods or hourly data for recent timeframes.",
            },
            {
              id: "b12",
              type: "heading",
              content: "High-Level Architecture",
              metadata: { level: 3 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "The architecture separates concerns into distinct services with different scaling characteristics:",
            },
            {
              id: "b14",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "API Gateway — handles authentication, rate limiting, request routing",
                  "Price History Service — manages price data retrieval, handles read-heavy queries from chart rendering",
                  "Web Crawler Service — scrapes Amazon product pages on a scheduled basis with consistent write patterns",
                  "Subscription Service — manages user subscriptions and price threshold settings",
                  "Notification Service — processes price change events and sends email alerts",
                  "Price Database (separate) — stores time-series price data, append-only, billions of rows, eventual consistency",
                  "Primary Database — stores Users, Products, Subscriptions with traditional CRUD patterns",
                ],
              },
            },
            {
              id: "b15",
              type: "quote",
              content:
                '"We separate the Price History Service from the crawler because they have different scaling characteristics. The history service handles many concurrent read requests from users viewing charts, while the crawler operates on a scheduled basis with consistent write patterns."',
            },
            {
              id: "b16",
              type: "paragraph",
              content:
                "The databases are strategically separated: the Primary Database stores Users, Products, and Subscriptions together (small, CRUD patterns), while the Price Database is separate because price history data grows to billions of rows, is append-only, requires time-series optimizations, and can tolerate eventual consistency.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Deep Dives — Scaling Data Collection & Validation
    {
      title: "Deep Dives — Scaling Data Collection & Validation",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Scaling Data Collection & Validation",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Deep Dive 1: Discovering & Tracking 500M Products",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "Tracking 500 million products while respecting Amazon's rate limiting (~1 request/second/IP) is the system's biggest technical challenge. This involves two sub-problems: product discovery (finding all existing products + ~3,000 new products daily) and price monitoring (efficiently updating prices with smart prioritization).",
            },
            {
              id: "c3",
              type: "heading",
              content: "Bad: Naive Web Crawling",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "A traditional web crawler starting from seed URLs and recursively following links would take over 15 years with a single crawler to visit each product once. Even 1,000 servers with unique IPs would require 5+ days for a complete catalog refresh, during which millions of price changes go undetected. New products might not be found for weeks.",
            },
            {
              id: "c5",
              type: "heading",
              content: "Good: Prioritized Crawling Based on User Interest",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "Product popularity follows a Pareto distribution — a small percentage of products get the vast majority of user attention. Instead of treating all 500M products equally, tier crawling by user interest: high-interest products checked every few hours, medium-interest daily, low-interest weekly. Use active subscription counts, search frequency, and notification click-through rates as priority signals.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Great: Chrome Extension + Selective Crawling (Hybrid)",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "The Chrome extension with 1 million users becomes a distributed data collection network. When users browse Amazon, the extension captures product IDs, current prices, and metadata, then reports to the backend. This crowdsourced approach naturally prioritizes popular products and discovers new ones automatically. Traditional crawlers only handle products not recently viewed by extension users.",
            },
            {
              id: "c9",
              type: "quote",
              content:
                "\"The Chrome extension isn't just a user feature — it's our secret weapon for data collection. It transforms user browsing behavior into our primary data collection mechanism.\"",
            },
            {
              id: "c10",
              type: "heading",
              content: "Deep Dive 2: Handling Malicious Price Updates",
              metadata: { level: 2 },
            },
            {
              id: "c11",
              type: "paragraph",
              content:
                "With 1 million extension users submitting price data, some will be malicious or erroneous. A single bad actor reporting an iPhone at $0.01 could trigger thousands of false notifications, damaging user trust.",
            },
            {
              id: "c12",
              type: "heading",
              content: "Good: Consensus-Based Validation",
              metadata: { level: 3 },
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                'Hold price updates in "pending validation" state. Require N independent users to report the same price within a time window before accepting. Higher thresholds for significant price drops or high-subscription products. Builds user reputation scores over time. Limitation: delays legitimate price changes for niche products, and coordinated attackers could still game the system.',
            },
            {
              id: "c14",
              type: "heading",
              content: "Great: Trust-But-Verify with Priority Verification",
              metadata: { level: 3 },
            },
            {
              id: "c15",
              type: "paragraph",
              content:
                "Accept extension data immediately and send notifications right away. Queue high-priority verification crawl jobs for suspicious changes (large drops, low-reputation users, high-subscriber products). Crawlers verify within 1-5 minutes. If data was wrong, send correction notifications and reduce user trust score. Conflicting reports from different users trigger immediate crawler verification.",
            },
            {
              id: "c16",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Most extension data processed immediately → fast notifications",
                  "Bad data caught within minutes → minimal damage",
                  "User reputation system creates long-term deterrent",
                  "Trade-off: more crawler load on Amazon from verification jobs",
                ],
              },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Deep Dives — Notifications & Price History Performance
    {
      title: "Deep Dives — Notifications, Price History & Final Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Notifications, Price History & Final Design",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Deep Dive 3: Event-Driven Notifications",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                'The initial cron-based polling (scan every 2 hours) fails our 1-hour notification requirement and creates massive database load. The fundamental fix: instead of asking "what changed?" periodically, ask "who cares?" immediately when a change happens.',
            },
            {
              id: "d3",
              type: "heading",
              content: "Option A: Database Change Data Capture (CDC)",
              metadata: { level: 3 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "Configure the database to automatically publish events when price data changes. Database triggers fire on new price records and send events to Kafka containing product ID, old price, and new price. Notification service subscribes to these events and queries the subscriptions table to find affected users. Clean because no application-level coordination needed.",
            },
            {
              id: "d5",
              type: "heading",
              content: "Option B: Dual Writes",
              metadata: { level: 3 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Price collection services write to both the database and publish events to Kafka simultaneously. Allows smarter filtering — filter out tiny fluctuations, batch rapid changes before publishing. Avoids database trigger overhead. Trade-off: application must remember to publish events; risk of database/Kafka inconsistency if one write fails.",
            },
            {
              id: "d7",
              type: "paragraph",
              content:
                "With either approach, notification consumers read price change events from Kafka, query the subscriptions table for triggered thresholds, and send emails. Only actual price changes are processed — no expensive table scans of millions of records.",
            },
            {
              id: "d8",
              type: "heading",
              content: "Deep Dive 4: Fast Price History Queries",
              metadata: { level: 2 },
            },
            {
              id: "d9",
              type: "paragraph",
              content:
                "Popular products have thousands of price data points spanning years. A 2-year price chart requires aggregating this data into time buckets (daily/weekly averages) under our 500ms latency target.",
            },
            {
              id: "d10",
              type: "heading",
              content: "Good: Scheduled Pre-Aggregation",
              metadata: { level: 3 },
            },
            {
              id: "d11",
              type: "paragraph",
              content:
                "Nightly batch job computes daily, weekly, and monthly price summaries (avg, min, max, open, close) in a price_aggregations table. Queries return pre-computed records in milliseconds. Limitation: data is up to 24 hours stale, but acceptable for historical trend analysis.",
            },
            {
              id: "d12",
              type: "heading",
              content: "Great: TimescaleDB for Real-Time Analytics",
              metadata: { level: 3 },
            },
            {
              id: "d13",
              type: "paragraph",
              content:
                "TimescaleDB, a time-series extension for PostgreSQL, enables real-time aggregations without pre-computation. Queries like SELECT time_bucket('1 day', timestamp), avg(price) return results in milliseconds even with billions of rows, thanks to automatic partitioning and compression. Keeps the entire data stack unified within PostgreSQL ecosystem.",
            },
            {
              id: "d14",
              type: "code",
              content:
                "-- TimescaleDB: real-time aggregation query\nSELECT time_bucket('1 day', timestamp) AS day,\n       avg(price) AS avg_price,\n       min(price) AS min_price,\n       max(price) AS max_price\nFROM prices\nWHERE product_id = 'B08N5WRWNW'\n  AND timestamp > NOW() - INTERVAL '6 months'\nGROUP BY day\nORDER BY day;",
              metadata: { language: "sql" },
            },
            {
              id: "d15",
              type: "heading",
              content: "Final Architecture Summary",
              metadata: { level: 2 },
            },
            {
              id: "d16",
              type: "paragraph",
              content:
                "The final system uses a hybrid data collection approach (Chrome extension crowdsourcing + prioritized crawlers), trust-but-verify validation, event-driven notifications via Kafka, and TimescaleDB for fast price history queries. Key architectural decisions: separate price database from operational database, separate read-heavy services from write-heavy services, and use the Chrome extension as both a user feature and a data collection mechanism.",
            },
            {
              id: "d17",
              type: "heading",
              content: "What Interviewers Expect at Each Level",
              metadata: { level: 2 },
            },
            {
              id: "d18",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mid-level: Working HLD addressing core FRs. Simple web scraping approach. Basic schema. Recognize scale limitations with guidance.",
                  "Senior: Identify data collection as core challenge. Propose Chrome extension approach. Explain why polling doesn't scale → event-driven alternatives. Go deep on 2+ deep dives.",
                  "Staff+: See Chrome extension as solving the fundamental scaling problem (not just a feature). Discuss system evolution — start simple, design for future scale. Surface concerns proactively: anti-scraping measures, extension privacy, Amazon page structure changes. Systems thinking across components.",
                ],
              },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "Database separation rationale",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why does the CamelCamelCamel design separate the Price Database from the Primary Database (Users, Products, Subscriptions)?",
        explanation:
          "The price history data has fundamentally different characteristics: it grows to billions of rows, is append-only, requires time-series optimizations, and can tolerate eventual consistency. The primary data has traditional CRUD patterns and is relatively small. Separating them allows independent optimization and scaling. This is not about read/write splitting (both databases handle reads) or cost (both need robust infrastructure).",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "To ensure strong consistency for price data while keeping eventual consistency for user data",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Because SQL databases cannot store time-series data at all",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Price data is append-only and time-series optimized, while primary data has CRUD patterns — they need different storage engines and independent scaling",
              isCorrect: true,
            },
            {
              id: "d",
              text: "To reduce costs by using a cheaper database for price data",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "API design: product_id placement",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In the CamelCamelCamel API, why is product_id placed in the URL path (GET /products/{product_id}/price) rather than in the request body?",
        explanation:
          "Placing the product_id in the URL path enables HTTP caching (CDNs and browsers can cache GET requests by URL) and follows REST conventions where URL paths identify resources. Request bodies are typically used for POST/PUT operations. Query parameters could work but path parameters are more RESTful for resource identification.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Path parameters are encrypted while body parameters are not",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It reduces the payload size, improving network performance significantly",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Better HTTP caching (CDNs cache by URL) and REST compliance for resource identification",
              isCorrect: true,
            },
            {
              id: "d",
              text: "GET requests cannot have request bodies in any HTTP specification",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Naive crawling failure reason",
      type: "question",
      sectionId: "sec_q_data_collection",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the primary reason naive web crawling fails for tracking 500 million Amazon products?",
        explanation:
          "With Amazon's rate limit of ~1 request/second/IP and 500 million products, a single crawler would take over 15 years for one pass. Even 1,000 servers need 5+ days. The fundamental issue is the scale arithmetic: limited crawling resources vs. massive product catalog. While Amazon does have anti-scraping measures, the core issue is the mathematical impossibility of keeping prices current.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Amazon changes their URL structure every day, making crawlers obsolete",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Amazon's product pages use JavaScript rendering that crawlers cannot parse",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The scale arithmetic — at 1 req/sec/IP rate limit, refreshing 500M products takes too long for prices to stay current",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Web crawling is illegal under all circumstances",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Chrome extension crowdsourcing advantage",
      type: "question",
      sectionId: "sec_q_data_collection",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "What is the most significant architectural advantage of using the Chrome extension as a data collection mechanism instead of relying solely on web crawlers?",
        explanation:
          "The Chrome extension's key insight is that it naturally prioritizes data collection for products users actually care about. 1 million users browsing Amazon creates a distributed data collection network that focuses on popular and trending items without explicit prioritization logic. It also discovers new products automatically when users visit them. While it reduces crawler costs, the real value is the natural alignment between data freshness and user demand.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "It naturally prioritizes data collection for products users actually care about, aligning freshness with demand",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It eliminates the need for any server-side infrastructure",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Extension data is always more accurate than crawler data because browsers render pages fully",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Chrome extensions can bypass Amazon's rate limiting entirely",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Polling vs event-driven notifications",
      type: "question",
      sectionId: "sec_q_notifications",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The initial CamelCamelCamel design uses a cron job polling every 2 hours for price changes. Which statement best describes why this approach fails at scale?",
        explanation:
          "The polling approach performs expensive full-table scans of the price database every 2 hours regardless of how many prices actually changed. Most products don't change price frequently, so the vast majority of scan work is wasted. Additionally, the 2-hour interval means notifications can be delayed up to 2 hours, violating the 1-hour NFR. Event-driven approaches only process actual changes, making them dramatically more efficient.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "It performs expensive database scans regardless of how many prices changed, and the 2-hour delay violates the 1-hour notification requirement",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Polling uses more network bandwidth than event-driven architectures",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Email servers cannot handle batch notification sending",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Cron jobs cannot run reliably in distributed systems",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Service separation rationale",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Why are the Price History Service and the Web Crawler Service designed as separate services rather than a single monolithic service?",
        explanation:
          "The core reason is different scaling characteristics. The Price History Service handles many concurrent read requests from users viewing charts (read-heavy, bursty traffic). The Web Crawler Service operates on a scheduled basis with consistent write patterns (write-heavy, steady traffic). Separating them allows independent scaling — you can add more Price History instances during peak browsing hours without affecting crawler scheduling, and vice versa.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Microservices are always better than monoliths regardless of context",
              isCorrect: false,
            },
            {
              id: "b",
              text: "They have different scaling characteristics — read-heavy bursty traffic vs. write-heavy steady traffic require independent scaling",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The crawler needs to be written in Python while the history service must be in Java",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Monolithic services cannot connect to two different databases",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "TimescaleDB vs pre-aggregation trade-off",
      type: "question",
      sectionId: "sec_q_notifications",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "When choosing between scheduled pre-aggregation (nightly cron) and TimescaleDB for price history queries, what is the most important trade-off to consider?",
        explanation:
          "Pre-aggregation provides extremely fast reads (just a lookup) but data is stale by up to 24 hours and only supports pre-defined granularities. TimescaleDB computes aggregations on demand, so data is always fresh and supports arbitrary time ranges/granularities, but each query does real computation. For a price tracking service, the flexibility of ad-hoc queries and real-time freshness is usually worth the trade-off, especially since TimescaleDB's time-series optimizations make these computations fast enough (<500ms).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Pre-aggregation requires PostgreSQL while TimescaleDB requires a completely different database ecosystem",
              isCorrect: false,
            },
            {
              id: "b",
              text: "TimescaleDB is always faster because it uses columnar storage, while pre-aggregation wastes disk space",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The only difference is cost — TimescaleDB is a paid product while pre-aggregation uses free open-source tools",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Pre-aggregation has faster reads but stale data and fixed granularities; TimescaleDB offers real-time freshness and flexible queries at higher per-query computation cost",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Trust-but-verify vs consensus trade-off",
      type: "question",
      sectionId: "sec_q_validation",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In the CamelCamelCamel design, the trust-but-verify approach is preferred over consensus-based validation for Chrome extension data. Which scenario would make consensus-based validation the better choice instead?",
        explanation:
          "Consensus-based validation sacrifices notification speed for data accuracy. It's the better choice when false notifications cause severe consequences — e.g., an automated purchasing system that buys products immediately when notified of a price drop. In such cases, acting on unverified data could result in real financial loss. For human-facing notifications where users can verify before acting, the speed advantage of trust-but-verify outweighs the occasional false alert.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "When the Chrome extension has fewer than 100 users",
              isCorrect: false,
            },
            {
              id: "b",
              text: "When Amazon products have prices above $1,000",
              isCorrect: false,
            },
            {
              id: "c",
              text: "When downstream systems automatically execute purchases based on price drop notifications, making false positives financially costly",
              isCorrect: true,
            },
            {
              id: "d",
              text: "When the system needs to support multiple retailers beyond Amazon",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Functional requirements identification",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are in-scope functional requirements for CamelCamelCamel? Select ALL that apply.",
        explanation:
          "The two core functional requirements are: (1) viewing price history for Amazon products via website or Chrome extension, and (2) subscribing to price drop notifications with thresholds. Product search/discovery and price comparison across retailers are explicitly out of scope — the system tracks Amazon prices only and assumes users know which products they want to monitor.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "View price history for Amazon products",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Subscribe to price drop notifications with thresholds",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Search and discover products on the platform",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Compare prices across multiple retailers",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Benefits of hybrid data collection",
      type: "question",
      sectionId: "sec_q_data_collection",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid benefits of the Chrome extension + selective crawling hybrid approach for data collection:",
        explanation:
          "The hybrid approach: (1) naturally prioritizes popular products because more users browse them, (2) discovers new products automatically when users visit unknown pages, and (3) dramatically reduces crawler infrastructure needs since extensions handle most popular products. However, it does NOT eliminate coverage gaps — niche products with low user interest may still have infrequent updates, which is explicitly called out as a limitation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Natural prioritization of popular products through user browsing patterns",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Complete elimination of coverage gaps for all 500 million products",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Dramatically reduced crawler infrastructure costs",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Automatic discovery of new products when extension users visit them",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Event-driven notification implementation options",
      type: "question",
      sectionId: "sec_q_notifications",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are valid approaches for implementing event-driven notifications in the CamelCamelCamel system? Select ALL that apply.",
        explanation:
          "Both CDC (database triggers publishing to Kafka) and dual writes (application writes to DB and Kafka simultaneously) are valid event-driven approaches discussed in the design. Both avoid the expensive polling pattern. Webhooks from Amazon don't exist (Amazon doesn't provide price change APIs). Client-side polling from the extension would not help with email notifications — the extension can't know about other users' subscriptions.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Dual writes: application writes to both database and Kafka simultaneously",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Client-side polling from the Chrome extension to check for subscription matches",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Webhooks from Amazon notifying our system of price changes",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Database Change Data Capture (CDC) with triggers publishing to Kafka",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "NFR-driven architectural decisions",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which architectural decisions in the CamelCamelCamel design are directly driven by non-functional requirements? Select ALL that apply.",
        explanation:
          "Eventual consistency is driven by the NFR to prioritize availability over consistency. TimescaleDB for the price DB is driven by the <500ms latency requirement for price history queries. Event-driven notifications via Kafka replace polling to meet the 1-hour notification delivery requirement. The Chrome extension as a data source is driven by the need to handle 500M products at scale. REST API design conventions are good practice but not driven by a specific NFR in this system.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Event-driven notifications via Kafka (1-hour notification delivery NFR)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Using eventual consistency for price data (availability > consistency NFR)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Using TimescaleDB for price storage (<500ms query latency NFR)",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Using REST API conventions for endpoint design",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Chrome extension as data source (500M products scale NFR)",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Design the notification flow",
      type: "question",
      sectionId: "sec_q_notifications",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Describe the end-to-end flow of how a user receives a price drop notification in the event-driven architecture, starting from when the Chrome extension detects a new price. Include all services and data stores involved.",
        explanation:
          "A strong answer traces the full path: extension reports price → API Gateway → Price collection service writes to Price DB (and publishes to Kafka via CDC or dual write) → Kafka consumer reads event → queries Subscriptions table for users with threshold >= new price → for each match, sends email via notification service → marks notification as sent to prevent duplicates.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "When a Chrome extension user visits an Amazon product page, the extension extracts the current price and sends it to the Price Collection API via the API Gateway. The service validates the data and writes the new price record to the Price Database (TimescaleDB). Simultaneously (via dual writes or CDC triggers), a price change event containing the product ID, old price, and new price is published to a Kafka topic.\n\nA Notification Consumer service subscribes to this Kafka topic. When it receives a price change event, it queries the Subscriptions table in the Primary Database to find all users whose price threshold for that product is at or above the new price. For each matching subscription, it constructs a notification email with the product details and price drop information, then sends it through the email notification service.\n\nFinally, the consumer marks each notification as sent in the database to prevent duplicate alerts if the event is reprocessed.",
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Database separation strategy",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain why the CamelCamelCamel design uses two separate databases (Primary DB and Price DB) instead of a single database. What are the specific characteristics of each workload that justify the separation?",
        explanation:
          "A strong answer identifies the specific workload differences: Primary DB has small data volume, CRUD patterns, needs relational queries (joins between Users, Products, Subscriptions); Price DB has billions of append-only rows, time-series access patterns, needs aggregation performance, can tolerate eventual consistency. Separating allows choosing optimal storage engines and scaling independently.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "The Primary Database stores Users, Products, and Subscriptions — entities with traditional CRUD access patterns, relational queries involving joins, relatively small data volume, and a need for transactional consistency (e.g., creating a subscription must be atomic). PostgreSQL is well-suited for this workload.\n\nThe Price Database stores historical price records — append-only time-series data that grows to billions of rows. Access patterns are almost exclusively time-range aggregations (average price over 30 days, min/max over a year). It needs time-series optimizations like automatic partitioning by time and compression, and can tolerate eventual consistency since slightly stale historical data is acceptable.\n\nSeparating them allows: (1) choosing TimescaleDB specifically for time-series workload while keeping standard PostgreSQL for CRUD, (2) scaling the Price DB independently as data grows, (3) applying different backup/retention policies, and (4) preventing heavy analytical queries on price data from impacting the responsiveness of user-facing CRUD operations.",
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Chrome extension as scaling solution",
      type: "question",
      sectionId: "sec_q_validation",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A staff-level insight in this design is recognizing the Chrome extension as a solution to the fundamental data collection scaling problem, not just a user-facing feature. Explain this insight: how does the Chrome extension transform the data collection challenge, what makes this approach superior to pure crawling, and what new problems does it introduce?",
        explanation:
          "Staff-level answer recognizes the paradigm shift: instead of the company bearing all crawling costs (scaling linearly with product count), user browsing activity provides a distributed data collection network that naturally scales with user adoption and naturally prioritizes products by user interest. New problems: data validation (malicious/erroneous reports), privacy concerns, dependency on user adoption patterns.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The Chrome extension fundamentally transforms the data collection problem from a company-resource problem to a user-activity problem. With pure crawling, the company must scale infrastructure linearly with the number of tracked products — 500M products at 1 req/sec/IP requires thousands of servers. The Chrome extension flips this by turning 1 million users' natural browsing behavior into a distributed data collection network.\n\nThis approach is superior because: (1) it naturally prioritizes products by actual user demand — popular products get frequent updates because many users view them, (2) it discovers new products automatically when users browse them, (3) it scales with user adoption rather than infrastructure investment, and (4) it collects data from real browser contexts that are harder for Amazon to rate-limit or block compared to server-based crawlers.\n\nHowever, it introduces significant new challenges: (a) data validation — malicious users could report false prices, requiring trust-but-verify or consensus mechanisms, (b) coverage gaps for niche products with few extension users, (c) privacy concerns about tracking user browsing behavior, (d) dependency on Chrome extension adoption and browser API stability, and (e) the need for traditional crawlers as a fallback for products not covered by extension data.",
          minLength: 150,
          maxLength: 2500,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Data validation strategy comparison",
      type: "question",
      sectionId: "sec_q_validation",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Compare and contrast the consensus-based validation and trust-but-verify approaches for handling potentially malicious Chrome extension price updates. For each approach, explain the mechanism, identify when it works well, when it fails, and argue which is better for CamelCamelCamel specifically.",
        explanation:
          "A strong answer covers both mechanisms in detail, identifies specific failure modes (consensus: delay for niche products, coordinated attacks; trust-but-verify: false notifications before verification, increased crawler load), and argues for trust-but-verify based on CamelCamelCamel's specific context (user-facing notifications where speed matters, users can verify prices themselves before purchasing).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Consensus-Based Validation: Holds price updates in a "pending" state until N independent users report the same price within a time window. Works well for popular products during normal browsing — multiple users quickly confirm price changes. Fails for niche products (may never reach consensus threshold) and during flash sales (overwhelmed by simultaneous updates). Coordinated attackers could also game the system. The key trade-off is accuracy over speed.\n\nTrust-But-Verify: Accepts extension data immediately and sends notifications right away, but queues priority crawler verification for suspicious changes (large drops, low-reputation users, high-subscriber products). Verification happens within 1-5 minutes. Works well because most data is legitimate, and corrections can be sent quickly. Fails when verification crawling hits Amazon rate limits, or when a false notification causes irreversible user action before verification completes.\n\nFor CamelCamelCamel specifically, trust-but-verify is the better choice because: (1) the notifications are informational — users still need to visit Amazon and purchase manually, so a false notification has low cost, (2) speed is a competitive advantage — a 2-hour consensus delay defeats the purpose of the service, (3) the user reputation system creates long-term deterrence against bad actors, and (4) the few false positives that slip through can be corrected within minutes, preserving trust while maximizing notification speed.',
          minLength: 150,
          maxLength: 2500,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "CDC vs dual writes trade-off analysis",
      type: "question",
      sectionId: "sec_q_notifications",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "The design presents two options for event-driven notifications: Database Change Data Capture (CDC) and Dual Writes. Analyze the trade-offs between these approaches, including consistency guarantees, operational complexity, and failure modes. Which would you recommend for CamelCamelCamel and why?",
        explanation:
          "Strong answers discuss: CDC pros (automatic, no application coordination, guaranteed consistency between DB and events), CDC cons (database trigger overhead, less control over event content/filtering). Dual write pros (application-level filtering, no trigger overhead), dual write cons (risk of DB/Kafka inconsistency on partial failure, requires discipline in application code). Recommendation should be justified by CamelCamelCamel's specific needs.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "CDC Approach: Database triggers automatically publish events when price records change, requiring no application-level coordination. Pros: (1) guaranteed consistency — if a price is written, an event is published, (2) no risk of forgetting to publish events when adding new write paths, (3) clean separation of concerns. Cons: (1) less control over event content — triggers see raw DB changes, making it harder to filter tiny fluctuations, (2) trigger overhead on every insert impacts write throughput, (3) tighter coupling between DB schema and event format.\n\nDual Writes: The application explicitly writes to both the database and Kafka. Pros: (1) full control over which changes generate events — can filter out sub-cent fluctuations or batch rapid changes, (2) no database trigger overhead, (3) event format is decoupled from DB schema. Cons: (1) risk of inconsistency — if the DB write succeeds but the Kafka publish fails (or vice versa), data diverges, (2) every new write path must remember to publish events, (3) more complex application code.\n\nFor CamelCamelCamel, I would recommend CDC with an outbox pattern: write price changes and an outbox record in a single DB transaction, then have a separate process relay outbox entries to Kafka. This gives CDC's consistency guarantees while allowing application-level control over event content. The filtering of tiny fluctuations can happen in the Kafka consumer rather than at publish time, keeping the data pipeline reliable.",
          minLength: 150,
          maxLength: 2500,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "System evolution from MVP to scale",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A staff-level interviewer expects candidates to discuss system evolution — how do you start simple but design for the scale you'll eventually need? Describe how CamelCamelCamel's architecture would evolve from a startup MVP to handling 500M products, covering at least three major evolution milestones and what triggers each transition.",
        explanation:
          "A strong answer shows progressive complexity: (1) MVP with simple crawlers + PostgreSQL + cron notifications, (2) add Chrome extension for crowdsourced data when crawler costs become unsustainable, (3) migrate to TimescaleDB and event-driven notifications when query latency and notification delays become unacceptable, (4) add data validation when extension user base grows large enough for bad actors. Each transition should be triggered by specific scaling pain points.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Milestone 1 — MVP (0-100K products): Start with a simple architecture: a small fleet of web crawlers, a single PostgreSQL database for everything (users, products, subscriptions, prices), and a cron job checking for price changes every 2 hours. This handles the initial product catalog and early users with minimal operational complexity. Trigger for evolution: crawler costs grow linearly with product count, and users complain about stale prices on popular products.\n\nMilestone 2 — Growth Phase (100K-10M products): Launch the Chrome extension as a user feature with price history overlays on Amazon pages. Begin using extension data for price collection, dramatically reducing crawler load. Implement prioritized crawling (Pareto-based) for products not covered by extension data. Separate the Price DB from the Primary DB as price data volume exceeds what a single PostgreSQL instance handles efficiently. Trigger: notification delays from cron polling become unacceptable; price chart queries slow down.\n\nMilestone 3 — Scale Phase (10M-500M products): Migrate the Price DB to TimescaleDB for sub-500ms chart queries. Replace cron-based notifications with event-driven processing via Kafka for sub-hour notification delivery. Implement trust-but-verify data validation as extension user base grows enough for bad actors to appear. Add user reputation scoring. Trigger: need for real-time flexibility in chart granularity; false notification incidents from unvalidated extension data.\n\nMilestone 4 — Maturity (500M+ products): Implement continuous aggregation policies in TimescaleDB for common query patterns. Add CDN caching for popular product charts. Build monitoring dashboards for data freshness and notification latency SLOs. Consider ClickHouse for heavy analytical workloads separate from operational queries. Each evolution step is triggered by specific scaling pain points, not premature optimization.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Pareto distribution in crawling",
      type: "question",
      sectionId: "sec_q_data_collection",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In the context of CamelCamelCamel's crawling strategy, explain in 1-2 sentences how the Pareto distribution of product popularity informs the prioritized crawling approach.",
        explanation:
          "The Pareto distribution means a small percentage of products receive the vast majority of user attention. This justifies tiered crawling: allocate most crawling resources to the small set of popular products (checked every few hours) while deprioritizing the long tail of rarely-viewed products (checked weekly or less).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Since a small percentage of products receive the vast majority of user attention (Pareto distribution), crawling resources should be concentrated on popular products (refreshed every few hours) while niche products get less frequent updates (daily or weekly), maximizing data freshness where it matters most with limited crawling capacity.",
          minLength: 40,
          maxLength: 500,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Amazon rate limiting constraint",
      type: "question",
      sectionId: "sec_q_data_collection",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Amazon rate-limits crawlers to approximately 1 request per second per IP address. How does this single constraint fundamentally shape the CamelCamelCamel architecture?",
        explanation:
          "The rate limit makes comprehensive crawling mathematically infeasible at 500M products, which forces the entire architecture toward the Chrome extension crowdsourcing approach and prioritized crawling. Without this constraint, a simple crawler fleet would suffice.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "At 1 req/sec/IP, scanning 500M products would take ~15 years per single crawler. Even 1,000 IPs need 5+ days for one pass. This mathematical impossibility forces the architecture away from pure crawling toward the Chrome extension crowdsourcing model — leveraging user browsing as a distributed, naturally-prioritized data collection mechanism rather than fighting rate limits with infrastructure.",
          minLength: 40,
          maxLength: 500,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Consensus validation weakness",
      type: "question",
      sectionId: "sec_q_validation",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Identify the most critical weakness of the consensus-based validation approach for Chrome extension price data, and explain in 1-2 sentences why it undermines the core value proposition of CamelCamelCamel.",
        explanation:
          "The most critical weakness is the delay for niche products. CamelCamelCamel's value proposition is timely price drop notifications. If a niche product has few extension users, it may take hours or days to reach consensus, meaning subscribers miss time-sensitive deals — directly undermining why they use the service.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The most critical weakness is that niche products with few extension users may never reach the consensus threshold in time, causing subscribers to miss time-sensitive price drops entirely. This directly undermines CamelCamelCamel's core value proposition of timely deal alerts — the users most likely to subscribe to niche product notifications are precisely the ones worst served by consensus validation.",
          minLength: 40,
          maxLength: 500,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Dual write consistency risk",
      type: "question",
      sectionId: "sec_q_notifications",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In the dual-write approach for event-driven notifications, what specific failure scenario creates data inconsistency, and what is the user-facing impact?",
        explanation:
          "If the database write succeeds but the Kafka publish fails, the price is updated but no notification event is generated. Users whose thresholds are met never receive alerts for a legitimate price drop — a silent failure that's hard to detect and directly breaks the notification promise.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "If the price database write succeeds but the Kafka event publish fails, the price is stored correctly but no notification event is generated. Users whose thresholds are triggered by this price drop silently never receive their alerts — a silent data loss scenario that's particularly dangerous because it's hard to detect (the price looks correct, but the notification pipeline has no record of the change).",
          minLength: 40,
          maxLength: 500,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match components to responsibilities",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each CamelCamelCamel component to its primary responsibility:",
        explanation:
          "The API Gateway handles authentication and rate limiting. The Price History Service handles read-heavy price data retrieval for chart rendering. The Web Crawler Service scrapes Amazon product pages on a schedule. The Subscription Service manages user subscriptions and threshold settings. Each has distinct scaling characteristics and responsibilities.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "API Gateway",
              right: "Authentication and rate limiting",
            },
            {
              id: "p2",
              left: "Price History Service",
              right: "Serving price data for chart rendering",
            },
            {
              id: "p3",
              left: "Web Crawler Service",
              right: "Scraping Amazon product pages",
            },
            {
              id: "p4",
              left: "Subscription Service",
              right: "Managing user price alert thresholds",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match scaling challenges to solutions",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each scaling challenge in CamelCamelCamel to the solution that addresses it:",
        explanation:
          "Chrome extension crowdsourcing solves the 500M product crawling problem. Trust-but-verify with priority crawlers handles malicious extension data. Kafka event-driven processing replaces the slow cron polling. TimescaleDB with time-bucketing solves slow price chart aggregation queries.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Cannot crawl 500M products fast enough",
              right: "Chrome extension crowdsourced data collection",
            },
            {
              id: "p2",
              left: "Malicious price reports from extension users",
              right: "Trust-but-verify with priority crawler verification",
            },
            {
              id: "p3",
              left: "Cron job notifications delayed beyond 1 hour",
              right: "Event-driven processing via Kafka",
            },
            {
              id: "p4",
              left: "Slow price chart aggregation queries",
              right: "TimescaleDB with time_bucket functions",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match crawling strategies to trade-offs",
      type: "question",
      sectionId: "sec_q_validation",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each data collection strategy to its primary trade-off:",
        explanation:
          "Naive crawling is simple but mathematically infeasible at 500M product scale. Prioritized crawling uses resources wisely but creates coverage gaps for new/trending products without user interest signals. Chrome extension crowdsourcing provides natural prioritization but depends on user adoption and introduces data validation challenges. The hybrid approach optimizes overall coverage but adds significant system complexity with multiple data paths, validation layers, and crawler coordination.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Naive web crawling",
              right: "Simple to build but takes 15+ years for one full pass at scale",
            },
            {
              id: "p2",
              left: "Prioritized crawling by user interest",
              right:
                "Efficient resource use but misses new/trending products without prior signals",
            },
            {
              id: "p3",
              left: "Chrome extension crowdsourcing",
              right:
                "Natural prioritization but introduces data validation challenges and adoption dependency",
            },
            {
              id: "p4",
              left: "Hybrid (extension + selective crawlers)",
              right: "Best coverage but highest operational complexity with multiple data paths",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Core entities of the system",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Complete the statement about CamelCamelCamel's core entity that links users to products for notifications.",
        explanation:
          "A Subscription links a User to a Product they want to monitor, specifying the price threshold that triggers notifications. It is the core entity enabling the notification functionality.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "A {{blank1}} entity links users to products they want to monitor, specifying the price {{blank2}} that triggers notifications.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Subscription",
              acceptableAnswers: ["Subscription", "subscription", "SUBSCRIPTION"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "threshold",
              acceptableAnswers: ["threshold", "Threshold", "THRESHOLD"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Price history API endpoint",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content: "Complete the CamelCamelCamel API endpoint for retrieving price history.",
        explanation:
          "The price history endpoint uses GET method with product_id in the path for REST compliance and caching. The granularity parameter allows different time resolutions (hourly, daily, weekly) depending on the requested time period.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks: "{{blank1}} /products/{product_id}/price?period=30d&{{blank2}}=daily",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "GET",
              acceptableAnswers: ["GET", "get", "Get"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "granularity",
              acceptableAnswers: ["granularity", "Granularity", "GRANULARITY"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "CAP theorem application in CamelCamelCamel",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content: "Complete the statement about CamelCamelCamel's consistency model.",
        explanation:
          "CamelCamelCamel prioritizes availability over consistency because slightly stale price data is acceptable — users are viewing historical trends, not making real-time trading decisions. Eventual consistency means all replicas will converge to the same state given enough time.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "CamelCamelCamel prioritizes {{blank1}} over consistency, accepting {{blank2}} consistency for price data because users view historical trends rather than real-time values.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "availability",
              acceptableAnswers: ["availability", "Availability", "AVAILABILITY"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "eventual",
              acceptableAnswers: ["eventual", "Eventual", "EVENTUAL"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Crawling time estimation",
      type: "question",
      sectionId: "sec_q_data_collection",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "If Amazon rate-limits to 1 request per second per IP, and you deploy 1,000 crawlers with unique IP addresses, how many days would it take to crawl all 500 million Amazon product pages once? (Round to the nearest whole number)",
        explanation:
          "Total requests: 500,000,000. Rate per crawler: 1 req/sec. Total rate with 1,000 crawlers: 1,000 req/sec. Time = 500,000,000 / 1,000 = 500,000 seconds. Convert to days: 500,000 / 86,400 ≈ 5.79 ≈ 6 days. This demonstrates why naive crawling is impractical — even with massive infrastructure, one full pass takes nearly a week during which millions of prices change.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 6,
          tolerance: 1,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Notification processing capacity",
      type: "question",
      sectionId: "sec_q_notifications",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "Assume CamelCamelCamel tracks 500 million products and on average 0.1% of products have a price change per day. If each price change triggers subscription checks for an average of 50 subscribers, how many total notification checks (subscription lookups) must the system process per day? Express your answer in millions.",
        explanation:
          "Products with price changes per day: 500,000,000 × 0.001 = 500,000. Notification checks per day: 500,000 × 50 = 25,000,000 = 25 million. This is manageable for a Kafka-based event-driven system processing events as they arrive, but would be extremely expensive as periodic batch database scans.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 25,
          tolerance: 0,
        },
      },
    },
  ],
};
