/**
 * Google News (News Aggregator) — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: RSS ingestion, cursor-based pagination, CDC-powered caching,
 * content freshness pipelines, CDN media delivery, regional scaling,
 * category feeds, and hybrid personalization
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const googleNewsContent: StoryPointSeed = {
  title: "Design a News Aggregator (Google News)",
  description:
    "Master the system design of a news aggregation platform — covering data collection from publishers, cursor-based pagination, CDC-powered real-time cached feeds, content freshness, CDN media delivery, regional scaling for 100M DAU, category feeds, and hybrid personalization.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements & Core Architecture", orderIndex: 1 },
    { id: "sec_q_pagination", title: "Pagination & Data Access", orderIndex: 2 },
    { id: "sec_q_caching", title: "Caching, CDC & Feed Latency", orderIndex: 3 },
    { id: "sec_q_ingestion", title: "Content Ingestion & Freshness", orderIndex: 4 },
    { id: "sec_q_scaling", title: "Scaling, Traffic Spikes & Personalization", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Design
    {
      title: "News Aggregator — Requirements & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "News Aggregator — Requirements & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Google News?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Google News is a digital service that aggregates and displays news articles from thousands of publishers worldwide in a scrollable interface. Unlike social media feeds, a news aggregator does not host content — it links users to publisher websites. The core engineering challenge is ingesting content from thousands of heterogeneous sources and serving it with sub-200ms latency to 100M+ daily users.",
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
                  "Users should be able to view an aggregated feed of news articles from thousands of source publishers all over the world.",
                  'Users should be able to scroll through the feed "infinitely" (pagination).',
                  "Users should be able to click on articles and be redirected to the publisher's website to read the full content.",
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
                  "Availability over Consistency (CAP theorem): users prefer slightly outdated content over no content at all.",
                  "Scalable to 100M DAU with spikes up to 500M during breaking news.",
                  "Low latency feed load times (< 200ms).",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 2 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Article: id, title, summary, thumbnail URL, publish date, publisher ID, region, media URLs.",
                  "Publisher: id, name, URL, feed URL, region. Publishers are the origin of content.",
                  "User: id, region (may be inferred from IP). Even anonymous users are tracked for basic routing.",
                ],
              },
            },
            {
              id: "b9",
              type: "heading",
              content: "API Design",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "code",
              content:
                "// Get a page of articles for the user's feed\nGET /feed?page={page}&limit={limit}&region={region} -> Article[]\n\n// No endpoint needed for reading articles — the browser\n// redirects to the publisher's website using the article URL.",
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
                "The system has two distinct data paths with different scaling profiles. The write path (Data Collection Service) polls publisher RSS feeds every 3-6 hours, extracts article content and metadata, downloads thumbnails to Object Storage, and saves article data to the Database. The read path (Feed Service) sits behind an API Gateway and serves user feed requests by querying the database for recent articles filtered by region.",
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "Why separate these services? They have completely different scaling requirements (read-heavy vs write-heavy), different update frequencies (real-time vs batch), and different operational needs (user-facing vs background processing). This separation is a key architectural decision that enables independent scaling.",
            },
            {
              id: "b14",
              type: "heading",
              content: "Why Store Thumbnails in Object Storage?",
              metadata: { level: 3 },
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "Rather than pointing directly to publisher-hosted images, we download and store our own copies. Publisher servers may be slow, overloaded, or go down entirely. Hosting our own copies lets us standardize image quality and size for a consistent user experience, and serve them via CDN for global low-latency delivery.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Deep Dives — Pagination, Caching & Content Freshness
    {
      title: "Deep Dives — Pagination, Caching & Content Freshness",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Pagination, Caching & Content Freshness",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "1. Pagination — From Offset to Cursor",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                'Offset-based pagination (OFFSET + LIMIT) causes "pagination drift" when new articles are constantly published. Users see duplicates or miss content as the dataset shifts under them. Three progressively better solutions exist.',
            },
            {
              id: "c3",
              type: "heading",
              content: "Good: Timestamp-Based Cursors",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "Use the timestamp of the last article as a cursor: WHERE published_at < cursor_timestamp ORDER BY published_at DESC LIMIT 20. Eliminates drift because the query is relative to a fixed point in time, not a shifting offset. Requires an index on published_at. Limitation: articles with identical timestamps cause gaps.",
            },
            {
              id: "c5",
              type: "heading",
              content: "Great: Composite Cursor (Timestamp + Article ID)",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "Combine timestamp and article ID for total ordering: WHERE (published_at, article_id) < (cursor_ts, cursor_id) ORDER BY published_at DESC, article_id DESC LIMIT 20. Uses SQL tuple comparison with a composite index on (published_at, article_id). Handles timestamp collisions gracefully. Used by Twitter and Instagram.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Great: Monotonically Increasing IDs (ULIDs)",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Design article IDs to be time-ordered from the start using ULIDs or auto-increment. Pagination becomes trivial: WHERE article_id < cursor_id ORDER BY article_id DESC LIMIT 20. No composite cursors, no timestamp handling. Eliminates collision issues entirely. Requires planning the ID strategy upfront.",
            },
            {
              id: "c9",
              type: "heading",
              content: "2. Low Latency Feeds (< 200ms)",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "With 100M DAU × 5-10 refreshes/day = 500M-1B feed requests daily. Direct database queries cannot meet the 200ms target at this scale.",
            },
            {
              id: "c11",
              type: "heading",
              content: "Good: Redis Cache with TTL",
              metadata: { level: 3 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                "Cache recent articles by region in Redis sorted sets (feed:US, feed:UK) with 30-minute TTL. Cache-aside pattern: on miss, query DB, populate cache, return. Pagination works via ZREVRANGEBYSCORE with cursor values. Problem: TTL expiration causes thundering herd — all users in a region hit the DB simultaneously when cache expires. Also, 30-minute staleness is poor for a news platform.",
            },
            {
              id: "c13",
              type: "heading",
              content: "Great: Real-time Cached Feeds with CDC",
              metadata: { level: 3 },
            },
            {
              id: "c14",
              type: "paragraph",
              content:
                "Pre-compute feeds using Change Data Capture (CDC). When articles are written to the database, CDC events trigger Feed Generation Workers that immediately update relevant regional Redis sorted sets. No TTL needed — feeds are always fresh. Maintain only the most recent 1,000-2,000 articles per region using ZADD + ZREMRANGEBYRANK to cap size. Feed reads become simple ZREVRANGE operations completing in under 5ms.",
            },
            {
              id: "c15",
              type: "heading",
              content: "3. Content Freshness — Ingestion Pipelines",
              metadata: { level: 2 },
            },
            {
              id: "c16",
              type: "paragraph",
              content:
                "Polling RSS feeds every 3-6 hours creates unacceptable delays for breaking news. Three approaches improve freshness progressively.",
            },
            {
              id: "c17",
              type: "heading",
              content: "Good: Tiered RSS Polling",
              metadata: { level: 3 },
            },
            {
              id: "c18",
              type: "paragraph",
              content:
                "Implement priority tiers: high-priority publishers (CNN, BBC) polled every 5-10 minutes, medium every 30 minutes, low every 2-3 hours. Use ETags and Last-Modified headers to avoid reprocessing unchanged feeds. Limitation: still reactive (up to 5-minute delay), 100K+ HTTP requests/hour, and not all publishers have RSS feeds.",
            },
            {
              id: "c19",
              type: "heading",
              content: "Good: Intelligent Web Scraping",
              metadata: { level: 3 },
            },
            {
              id: "c20",
              type: "paragraph",
              content:
                "For publishers without RSS feeds, scrape websites using CSS selectors to extract article links, headlines, and timestamps. Maintain fingerprint databases (URL hashes) to detect new content. Combine with RSS for comprehensive coverage. Limitation: high maintenance as websites change HTML structure, legal concerns, slower than RSS.",
            },
            {
              id: "c21",
              type: "heading",
              content: "Great: Publisher Webhooks with Fallback Polling",
              metadata: { level: 3 },
            },
            {
              id: "c22",
              type: "paragraph",
              content:
                "Flip from pull-based to push-based: publishers call POST /webhooks/article-published when they publish. With 100M DAU, publishers are incentivized to integrate. Webhook payloads include article metadata; the system processes content within seconds. Authentication via shared secrets or API keys prevents spam. Maintain RSS polling and scraping as fallback for non-webhook publishers. Result: a hybrid system providing real-time updates where possible and regular polling elsewhere.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Scaling, Media, Categories & Personalization
    {
      title: "Scaling for Traffic Spikes, Media, Categories & Personalization",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Scaling for Traffic Spikes, Media, Categories & Personalization",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "4. Media Content — Thumbnail Delivery",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "Since users click through to publisher sites, we only serve thumbnails in the feed. Bad: storing images as binary blobs in the database destroys query performance. Good: store in S3 with direct URLs — separates concerns but global users face high latency from distant regions. Great: S3 + CloudFront CDN with multiple thumbnail sizes (150x100 mobile, 300x200 desktop, 600x400 retina) using HTML srcset. CDN caching reduces S3 requests by 90%+ and ensures sub-200ms load times globally.",
            },
            {
              id: "d3",
              type: "heading",
              content: "5. Handling Breaking News Traffic Spikes",
              metadata: { level: 2 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "Breaking news can spike traffic from 100M DAU to 10M concurrent users within minutes. News consumption is inherently regional, so we deploy infrastructure per region. Each component must be evaluated independently.",
            },
            {
              id: "d5",
              type: "heading",
              content: "Feed Service (Application Layer)",
              metadata: { level: 3 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Feed Services are stateless — horizontal scaling with auto-scaling groups behind load balancers. Spin up new instances in seconds, tear down when traffic subsides. One server handles 10K-100K concurrent connections; 10M users requires dozens of instances.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Cache Layer (Redis)",
              metadata: { level: 3 },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "A single Redis instance handles ~100K requests/second. For 10M concurrent users, deploy read replicas: writes go to master, reads are load-balanced across replicas. With ~2,000 articles per region, each instance stores all regional content — the challenge is purely read throughput. Redis Sentinel manages failover: if master fails, a replica is promoted. Replication lag is typically under 200ms, which is acceptable for news feeds.",
            },
            {
              id: "d9",
              type: "heading",
              content: "Scaling Math",
              metadata: { level: 3 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "10M concurrent users ÷ 100K requests/second per Redis instance = 100 total Redis instances needed at peak. Realistically, distribute across regions based on demand, scaling up during spikes and down during normal traffic.",
            },
            {
              id: "d11",
              type: "heading",
              content: "6. Category-Based Feeds",
              metadata: { level: 2 },
            },
            {
              id: "d12",
              type: "paragraph",
              content:
                "Bad: Real-time database filtering with WHERE category = 'sports' on every request. 50M peak requests = 50M DB operations. Good: Pre-computed category feeds in Redis (feed:sports:US) — fast but requires 250+ separate sorted sets (25 categories × 10 regions), increasing memory and cache management complexity.",
            },
            {
              id: "d13",
              type: "paragraph",
              content:
                "Great: In-memory filtering. Store complete article metadata (including category) as JSON in regional sorted sets. On category request, retrieve the regional cache (1,000 articles in <10ms) and filter in application memory (1-2ms). No data duplication, minimal architecture changes, and the simplest solution is often the best one.",
            },
            {
              id: "d14",
              type: "heading",
              content: "7. Personalization — Hybrid Feed Assembly",
              metadata: { level: 2 },
            },
            {
              id: "d15",
              type: "paragraph",
              content:
                "Bad: Real-time recommendation scoring destroys latency — billions of calculations per hour. Good: Pre-computed per-user caches work but memory explodes (50M users × 1,000 articles = 50B entries). Great: Store lightweight preference vectors (kilobytes per user) and assemble feeds on-demand by mixing pre-computed category feeds. Example: 60% feed:technology:US + 30% feed:business:US + 10% feed:trending:US. ML adjusts mixing ratios based on engagement. During breaking news, temporarily boost trending content weights.",
            },
            {
              id: "d16",
              type: "heading",
              content: "What Distinguishes Staff-Level Answers",
              metadata: { level: 2 },
            },
            {
              id: "d17",
              type: "quote",
              content:
                'Staff candidates recognize this is a read-heavy system from the start and separate ingestion from serving. They proactively discuss cursor-based pagination tradeoffs, CDC vs TTL for cache freshness, regional deployment for traffic isolation, in-memory filtering vs pre-computed category caches, and hybrid personalization — all without being prompted. They also engage the interviewer: "Can I black-box the ingestion pipeline? Do publishers maintain RSS feeds? Can we assume webhook adoption?"',
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
      title: "CAP theorem priority for a news aggregator",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When designing a news aggregator like Google News, which CAP theorem tradeoff is most appropriate, and why?",
        explanation:
          "Availability over consistency is the correct choice. Users prefer to see slightly outdated content rather than no content at all. News feeds are inherently tolerant of brief staleness — seeing an article from 5 minutes ago is acceptable, but a blank page is not. Partition tolerance is required in any distributed system, so the real choice is between consistency and availability.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Consistency over availability — users must always see the absolute latest articles",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Consistency over partition tolerance — network partitions never occur in modern cloud infrastructure",
              isCorrect: false,
            },
            {
              id: "c",
              text: "All three properties can be achieved simultaneously with enough infrastructure",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Availability over consistency — users tolerate slightly stale news but not a blank page",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why separate Data Collection and Feed services",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why should the Data Collection Service and Feed Service be separate components in a news aggregator?",
        explanation:
          "They have fundamentally different scaling profiles: the Data Collection Service is write-heavy and runs as a background batch process, while the Feed Service is read-heavy and user-facing with strict latency requirements. Separating them allows independent scaling, different deployment schedules, and failure isolation — a crash in the ingestion pipeline should not prevent users from reading their feed.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "They must use different programming languages for optimal performance",
              isCorrect: false,
            },
            {
              id: "b",
              text: "They have different scaling requirements (write-heavy vs read-heavy) and different operational needs (background vs user-facing)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Microservice architecture requires every function to be a separate service",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The Data Collection Service requires a NoSQL database while the Feed Service requires SQL",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Why store thumbnails in object storage",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why does a news aggregator download and store its own copies of article thumbnails rather than linking directly to publisher-hosted images?",
        explanation:
          "Publisher servers may be slow, overloaded, or go down entirely, which would break the feed experience. Hosting our own copies allows standardization of image quality/size for consistent UX and enables CDN delivery for low-latency global access. Databases should never store binary blobs — that destroys query performance.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Publisher servers may be slow or unavailable, and self-hosting enables image standardization and CDN delivery",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Copyright law requires aggregators to host copies of all media they display",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Publisher images are always too large to serve in a mobile feed",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Storing images in the database alongside articles improves query performance through locality",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Offset-based pagination failure mode",
      type: "question",
      sectionId: "sec_q_pagination",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A user is browsing page 2 of their news feed using offset-based pagination (OFFSET 20, LIMIT 20). While they are reading, 5 new articles are published. What happens when they request page 3?",
        explanation:
          'With offset-based pagination, new articles shift the dataset. The 5 new articles push existing articles down, so the items at offset 40-59 now include 5 articles that were previously at offset 35-39 (page 2). The user sees these as duplicates. This is called "pagination drift" and is why cursor-based pagination is essential for feeds with frequently changing data.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Page 3 is empty because the new articles consumed the remaining slots",
              isCorrect: false,
            },
            {
              id: "b",
              text: "They see 5 duplicate articles that were already on page 2, because new articles shifted the offset window",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The database automatically adjusts the offset to account for new inserts",
              isCorrect: false,
            },
            {
              id: "d",
              text: "They see the 5 new articles at the top of page 3",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "CDC vs TTL-based cache invalidation",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "What is the primary advantage of using Change Data Capture (CDC) to update regional feed caches compared to TTL-based cache expiration?",
        explanation:
          "CDC triggers cache updates immediately when new articles are written to the database, eliminating the staleness window that TTL-based caching creates. With TTL, users might not see new articles for up to 30 minutes, and when the TTL expires, all users in a region simultaneously hit the database (thundering herd). CDC provides both freshness and consistent performance by decoupling cache updates from user requests.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "CDC uses less memory than TTL-based caching because it only stores changed records",
              isCorrect: false,
            },
            {
              id: "b",
              text: "CDC eliminates the need for Redis entirely by streaming data directly to clients",
              isCorrect: false,
            },
            {
              id: "c",
              text: "CDC updates caches immediately on new data, eliminating the staleness window and thundering herd problems caused by TTL expiration",
              isCorrect: true,
            },
            {
              id: "d",
              text: "CDC guarantees strong consistency between the database and cache at all times",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Webhook vs polling ingestion tradeoff",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A news aggregator implements webhooks (POST /webhooks/article-published) for publisher notifications. What is the most significant limitation of a webhook-only approach?",
        explanation:
          "Webhooks require publisher cooperation and technical implementation. Many smaller publishers lack resources to build webhook integrations, and some may be reluctant to add external dependencies. A production system must maintain RSS polling and web scraping as fallback mechanisms for non-webhook publishers. The hybrid approach is essential for comprehensive coverage.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Webhooks are inherently slower than RSS polling because HTTP POST is slower than GET",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Webhooks require publisher buy-in and technical resources that many smaller publishers lack",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Webhook payloads are limited to 1KB, which cannot contain full article metadata",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Webhooks cannot be authenticated, making the system vulnerable to spam",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "In-memory filtering vs pre-computed category caches",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "For category-based feeds (Sports, Politics, Tech), why might in-memory filtering of the regional cache be preferable to maintaining pre-computed per-category Redis sorted sets?",
        explanation:
          "With in-memory filtering, each article exists once in its regional cache regardless of categories. Pre-computed category caches require 250+ separate sorted sets (25 categories × 10 regions), each needing independent size management and invalidation. The filtering approach reads 1,000 articles from Redis in <10ms and filters in application memory in 1-2ms — well within the 200ms budget. The key insight is that the simplest solution often wins when the numbers work out.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "No data duplication, simpler cache management, and filtering 1,000 articles in-memory adds only 1-2ms — well within latency budget",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Redis sorted sets cannot store JSON metadata, making pre-computed category caches impossible",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Pre-computed caches require a separate CDC pipeline per category, which is architecturally infeasible",
              isCorrect: false,
            },
            {
              id: "d",
              text: "In-memory filtering provides stronger consistency guarantees than pre-computed caches",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Hybrid personalization architecture",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A news aggregator with 100M DAU needs personalized feeds. Why is hybrid feed assembly (mixing pre-computed category feeds using lightweight user preference vectors) superior to pre-computing personalized per-user caches?",
        explanation:
          "Pre-computed per-user caches for 50M active users would require 50B entries (50M users × 1,000 articles each) — 200-500x the memory of category caching. Hybrid assembly stores only a small preference vector per user (kilobytes) and mixes from a few hundred existing category caches at request time. This reduces memory by ~100x while delivering relevant personalization. The tradeoff is slightly less personalization depth, but the architecture scales to 100M+ users without memory explosion.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Hybrid assembly provides more accurate recommendations than dedicated user caches",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Redis does not support per-user sorted sets at the scale of 50M users",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Pre-computed user caches cannot be updated when new articles arrive",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Per-user caches require 50B entries (200-500x more memory), while preference vectors are kilobytes per user and reuse existing category caches",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Core components of a news aggregator",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL components that are part of the high-level architecture for a news aggregator like Google News:",
        explanation:
          "The Data Collection Service polls publisher RSS feeds for articles. The Feed Service serves user feed requests. Object Storage (S3) stores article thumbnails. However, a Message Queue for real-time user notifications is not part of the core architecture — Google News does not push notifications to users; users pull their feed on demand.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Object Storage (S3) for article thumbnails", isCorrect: true },
            {
              id: "b",
              text: "Message queue for pushing real-time notifications to users",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Data Collection Service that polls publisher RSS feeds",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Feed Service behind an API Gateway for user requests",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid cursor-based pagination approaches",
      type: "question",
      sectionId: "sec_q_pagination",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL approaches that correctly solve the pagination drift problem for infinite scrolling in a news feed:",
        explanation:
          "Timestamp-based cursors (WHERE published_at < cursor) fix drift by querying relative to a fixed point. Composite cursors (timestamp + article ID) add total ordering to handle timestamp collisions. Monotonically increasing IDs (ULIDs) simplify pagination to WHERE id < cursor. However, increasing the page size does NOT fix drift — it only delays encountering duplicates since the offset-based window still shifts when new articles are added.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Increasing the page size from 20 to 100 to reduce the chance of seeing duplicates",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Monotonically increasing article IDs (ULIDs) used directly as cursors",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Timestamp-based cursors using WHERE published_at < cursor_timestamp",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Composite cursors combining timestamp and article ID for total ordering",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Content ingestion strategies for comprehensive coverage",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid strategies for a hybrid content ingestion pipeline that maximizes publisher coverage:",
        explanation:
          "A production system combines all three: RSS polling for publishers with feeds, web scraping for those without, and webhooks for real-time push notifications from willing publishers. Expecting all 10,000+ publishers to implement the same API is unrealistic — publishers use different technologies, have different capabilities, and some lack engineering resources for custom integrations.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Web scraping with CSS selectors for publishers without RSS feeds",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Publisher webhooks (POST /webhooks/article-published) for real-time notifications",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Tiered RSS polling with higher frequency for major publishers",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Requiring all publishers to implement a standardized REST API before being indexed",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Redis scaling strategies for breaking news spikes",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "During a breaking news event with 10M concurrent users, which scaling strategies are correct for the Redis cache layer? Select ALL that apply.",
        explanation:
          "Read replicas distribute query load since the data set is small (~2,000 articles per region) and the bottleneck is throughput, not storage. Regional deployment isolates traffic so one region's spike doesn't affect others. Redis Sentinel provides automatic failover if the master dies. However, sharding the regional feed across multiple Redis instances is unnecessary — with only 2,000 articles per region, each instance can hold all the data. The scaling challenge is purely read throughput, not data volume.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Shard the regional feed data across multiple Redis instances using consistent hashing",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Deploy Redis clusters per geographic region for traffic isolation",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Deploy read replicas and load-balance read requests across them",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Use Redis Sentinel for automatic master failover if the primary dies",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Compare pagination strategies for infinite scrolling",
      type: "question",
      sectionId: "sec_q_pagination",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare offset-based, timestamp-cursor, and composite-cursor pagination for a news feed with millions of articles being added daily. For each approach, explain the mechanism, its failure mode, and when you would use it.",
        explanation:
          "A strong answer explains: (1) Offset-based uses OFFSET/LIMIT but suffers pagination drift when new articles shift the dataset. (2) Timestamp cursors query WHERE published_at < cursor, fixing drift but failing on identical timestamps. (3) Composite cursors (timestamp + ID) provide total ordering, handling timestamp collisions. Should mention ULIDs as the simplest alternative if IDs are designed upfront.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Offset-based pagination: Uses page numbers with SQL OFFSET/LIMIT. Mechanism: page 2 with limit 20 → OFFSET 20 LIMIT 20. Failure mode: \"pagination drift\" — when new articles are published, all content shifts down, causing users to see duplicates (articles from page 2 reappear on page 3) or miss content entirely. Use case: Only acceptable for static datasets or admin dashboards where real-time updates are rare.\n\nTimestamp-cursor pagination: Uses the timestamp of the last article as a cursor. Mechanism: WHERE published_at < '2024-01-15T10:30:00Z' ORDER BY published_at DESC LIMIT 20. Fixes drift because the query is relative to a fixed time reference, not a shifting offset. Failure mode: timestamp collisions — when multiple articles share the same timestamp (common with batch RSS imports), articles are missed at page boundaries. Requires an index on published_at.\n\nComposite-cursor pagination: Combines timestamp and article ID. Mechanism: WHERE (published_at, article_id) < (cursor_ts, cursor_id) using SQL tuple comparison with a composite index. Provides total ordering even with identical timestamps, since the article ID breaks ties. Failure mode: slightly more complex cursor encoding/decoding, but no functional failure cases.\n\nSimplest solution: Use monotonically increasing IDs (ULIDs) from the start. Then pagination is just WHERE article_id < cursor_id — one column, one index, no collisions. This requires planning the ID strategy upfront but eliminates all other complexity.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the CDC-based feed caching pipeline",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Describe how Change Data Capture (CDC) is used to maintain real-time cached feeds in a news aggregator. Include the data flow from article ingestion to cache update, how unbounded cache growth is prevented, and why this is superior to TTL-based caching.",
        explanation:
          "A strong answer traces the full CDC pipeline: article written to DB → CDC event emitted → Feed Generation Worker consumes event → determines affected regions → ZADD to Redis sorted set with timestamp score → ZREMRANGEBYRANK to cap size. Must explain why TTL-based caching causes thundering herd and staleness problems that CDC eliminates.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "CDC-based feed caching pipeline:\n\n1. Data Collection Service ingests a new article and writes it to the database.\n2. The database emits a CDC event (change data capture) for the new row insert.\n3. A Feed Generation Worker consumes the CDC event and determines which regional feeds need updating based on the article's region field.\n4. The worker executes ZADD feed:{region} {timestamp_score} {article_json} to add the article to the appropriate Redis sorted set.\n5. Immediately after, the worker calls ZREMRANGEBYRANK feed:{region} 0 -{max_size} to remove the oldest articles beyond the limit (e.g., 2,000 articles per region), preventing unbounded growth.\n\nWhy this beats TTL-based caching:\n- Freshness: Articles appear in the cache within seconds of being written to the database, not after a 30-minute TTL window.\n- No thundering herd: With TTL, when cache expires, all users in a region simultaneously hit the database. With CDC, the cache is never empty — it is continuously updated.\n- Consistent performance: Feed reads are always served from a pre-populated cache (ZREVRANGE in <5ms), never falling through to the database.\n- No staleness window: Users always see the most recent articles, critical for a news platform.\n\nTradeoff: CDC adds infrastructure complexity (CDC pipeline, message queues, worker processes) and requires monitoring of the entire pipeline for failures.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the complete breaking news traffic spike response",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A major breaking news event causes traffic to spike to 10M concurrent users in a single region. Walk through each layer of the system architecture and explain how it handles this spike. Include specific scaling strategies, capacity calculations, and failure modes for the Feed Service, Redis cache, and database layers.",
        explanation:
          "Must cover: Feed Service (stateless, horizontal auto-scaling, load balancers), Redis (read replicas, math: 10M ÷ 100K/instance = 100 instances, Sentinel failover, replication lag), Database (shielded by cache, only handles cache misses ~1% of traffic). Should mention regional deployment for traffic isolation and that spikes in one region don't affect others.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Breaking news spike response, layer by layer:\n\nFeed Service (Application Layer):\n- Feed Services are stateless — no session data or local storage.\n- Auto-scaling groups detect CPU/memory threshold breach and provision new instances.\n- A single instance handles 10K-100K concurrent connections. For 10M users, we need 100-1,000 instances.\n- Load balancers (ALB/NLB) distribute traffic using round-robin or least-connections.\n- New instances spin up in seconds; tear down when traffic subsides.\n- Failure mode: if scaling is too slow, requests queue at the load balancer. Mitigation: pre-warm a baseline capacity and set aggressive scaling thresholds.\n\nRedis Cache Layer:\n- This is the critical layer — all feed reads hit Redis, not the database.\n- Single Redis instance: ~100K requests/second. For 10M concurrent users: 10M ÷ 100K = 100 Redis instances needed.\n- Strategy: deploy read replicas. Writes (new articles via CDC) go to master only. Reads are load-balanced across all replicas.\n- Data fits easily: ~2,000 articles per region × ~1KB each ≈ 2MB. No sharding needed — every replica holds the full dataset.\n- Redis Sentinel manages the cluster: if master fails, a replica is promoted automatically.\n- Replication lag: typically <200ms, acceptable for news feeds.\n- Failure mode: master failure during spike. Sentinel promotes replica in ~30 seconds; during that window, reads continue from replicas but new articles are delayed.\n\nDatabase Layer:\n- The database is largely shielded by the cache. With >99% cache hit rate, it sees ~1% of traffic.\n- 10M × 1% = 100K database queries — manageable for a properly indexed database.\n- If cache fails catastrophically, the database becomes the bottleneck. Mitigation: database read replicas as a second fallback.\n\nRegional Deployment:\n- News consumption is inherently regional. Deploy separate infrastructure per region.\n- A breaking news event in the US spikes US traffic but doesn't affect EU or APAC regions.\n- Each region scales independently based on local demand patterns.\n- During the spike, add more Redis read replicas in the affected region only.",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Design a hybrid content ingestion pipeline",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a hybrid content ingestion pipeline that combines RSS polling, web scraping, and publisher webhooks. For each method, explain when it is used, its advantages and limitations, and how the three methods work together to achieve comprehensive publisher coverage with near-real-time freshness.",
        explanation:
          "Must cover all three methods with clear use cases: RSS (cooperative publishers), scraping (no RSS feed), webhooks (premium real-time). Should discuss tiered polling frequency, fingerprint databases for deduplication, webhook authentication, and the fallback hierarchy. Staff-level: mention engaging the interviewer about scoping the ingestion pipeline.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Hybrid content ingestion pipeline:\n\n1. Publisher Webhooks (highest priority, real-time):\n- Use case: Major publishers willing to integrate. With 100M DAU, publishers are incentivized to push content to our platform.\n- Mechanism: Publishers call POST /webhooks/article-published with article metadata when they publish.\n- Authentication: Shared secrets or API keys to prevent spam and verify content authenticity.\n- Advantage: Near-instant content delivery (seconds). No wasted HTTP requests polling unchanged feeds.\n- Limitation: Requires publisher buy-in and technical resources. Cannot be mandated.\n- Coverage: Maybe 20-30% of publishers, but likely 60-70% of content volume (major publishers produce more).\n\n2. Tiered RSS Polling (medium priority, minutes to hours):\n- Use case: Publishers with RSS feeds who haven\'t implemented webhooks.\n- Mechanism: Separate worker pools per priority tier.\n  - High-priority (CNN, BBC, Reuters): Poll every 5-10 minutes.\n  - Medium-priority (regional outlets): Poll every 30 minutes.\n  - Low-priority (niche publications, weekly magazines): Poll every 2-3 hours.\n- Optimization: Track Last-Modified headers and ETags to skip unchanged feeds.\n- Advantage: Standardized, lightweight XML parsing. Most publishers already support RSS.\n- Limitation: Still reactive (up to 5-10 minute delay). 100K+ HTTP requests/hour at scale.\n- Coverage: 50-60% of publishers.\n\n3. Web Scraping (lowest priority, fallback):\n- Use case: Publishers without RSS feeds — newer outlets, publishers with limited or broken feeds.\n- Mechanism: Crawl publisher homepages/category pages using CSS selectors to find article links. Maintain fingerprint databases (URL hashes or content checksums) to detect new vs. seen articles.\n- Scheduling: High-traffic sites scraped every 10-15 minutes, smaller sites hourly.\n- Advantage: Covers publishers with no other integration method.\n- Limitation: High maintenance (HTML structure changes break selectors), legal concerns, slower and less reliable than RSS.\n- Coverage: 10-20% of publishers.\n\nHow they work together:\n- All three methods feed into a single content processing pipeline that normalizes articles into a standard format.\n- Deduplication: Articles from multiple sources (e.g., webhook AND RSS) are deduplicated using article URL hashes before database insertion.\n- The system prefers webhook data when available, RSS as secondary, and scraping as fallback.\n- Monitoring dashboard tracks coverage gaps — publishers with no recent articles trigger investigation.\n\nStaff-level insight: In an interview, start by asking the interviewer: "Can I black-box the ingestion pipeline?" If not: "Do our publishers maintain RSS feeds? Can we assume webhook adoption given our traffic?" This shows you understand scoping.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Thundering herd problem with TTL-based caching",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Explain the "thundering herd" problem in the context of TTL-based feed caching for a news aggregator with 100M DAU. Describe the exact sequence of events that causes it, quantify its impact, and propose two different solutions — one that still uses TTL and one that eliminates TTL entirely.',
        explanation:
          "Must describe: cache expiration → simultaneous DB queries from all users in a region → DB overload. Solutions: (1) TTL with jitter + cache stampede locks (request coalescing), (2) CDC-based cache updates that eliminate TTL. Should quantify: e.g., a US region with 30M users, TTL expires, thousands of concurrent DB queries in milliseconds.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The thundering herd problem:\n\nSequence of events:\n1. Regional feed cache (e.g., feed:US) is populated with 30-minute TTL.\n2. For 30 minutes, all feed requests from US users are served from Redis (~1ms response).\n3. At T+30min, the TTL expires and the cache entry is evicted.\n4. The next user request triggers a cache miss and queries the database.\n5. But \"next request\" is not just one — with 30M US DAU, thousands of requests arrive within milliseconds of each other.\n6. All requests see a cache miss simultaneously and all query the database.\n7. The database receives thousands of identical expensive queries (SELECT articles WHERE region='US' ORDER BY published_at DESC LIMIT 1000).\n8. Database CPU and connection pools are overwhelmed. Response times spike from 50ms to 5-10 seconds.\n9. The first query to complete repopulates the cache, but by then thousands of slow queries are already in flight.\n10. User experience degrades to 5+ second load times during this window.\n\nImpact quantification:\n- 30M US DAU ÷ 86,400 seconds = ~347 requests/second average.\n- At TTL expiration, even 1 second of cache miss means ~347 simultaneous DB queries.\n- During peak hours (3x average), that's ~1,000 concurrent DB queries for the same data.\n\nSolution 1 — TTL with jitter + request coalescing:\n- Add random jitter to TTL (e.g., 25-35 minutes instead of exactly 30) so not all regions expire simultaneously.\n- Implement a cache stampede lock: when a cache miss occurs, the first request acquires a lock and queries the database. All subsequent requests for the same key wait for the lock to be released, then read from the freshly populated cache.\n- Pro: Simple to implement. Con: Still has periodic staleness and brief lock contention.\n\nSolution 2 — CDC-based cache (eliminate TTL entirely):\n- Use Change Data Capture: when articles are written to the DB, CDC events trigger immediate cache updates.\n- The cache is never empty and never expires — it is continuously updated by Feed Generation Workers.\n- Cap cache size with ZREMRANGEBYRANK instead of TTL.\n- Pro: Zero thundering herd, always-fresh data, consistent latency.\n- Con: Additional infrastructure (CDC pipeline, workers, message queues).",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Category feeds vs personalization architecture decisions",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A news aggregator needs to support both category-based feeds (Sports, Politics, Tech) and personalized feeds based on user behavior. Compare three approaches: (1) pre-computed per-category caches, (2) in-memory filtering of regional caches, and (3) hybrid personalization with preference vectors. For each, analyze memory usage, latency, and architectural complexity.",
        explanation:
          "Must compare all three with concrete numbers. Pre-computed category caches: 250+ sorted sets, duplicated data, complex invalidation. In-memory filtering: single regional cache, 10ms read + 1-2ms filter, no duplication. Hybrid personalization: lightweight preference vectors + category mixing, ~100x less memory than per-user caches.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Comparison of three feed architecture approaches:\n\n1. Pre-computed per-category caches:\n- Memory: 25 categories × 10 regions × 2,000 articles × ~1KB = ~500MB. Each article is duplicated across category and regional caches.\n- Latency: Excellent — simple ZREVRANGE on feed:sports:US completes in <5ms.\n- Complexity: High. 250+ sorted sets need independent size management. CDC pipeline must categorize articles and update multiple cache keys atomically. Cache invalidation becomes complex — removing an expired article requires deleting from both regional and category caches.\n- Verdict: Over-engineered for the problem. The fast reads don't justify 250+ cache keys.\n\n2. In-memory filtering of regional caches:\n- Memory: 10 regions × 2,000 articles × ~1KB = ~20MB total. Each article exists once, stored as JSON with category metadata.\n- Latency: Redis read (1,000 articles) ≈ 10ms + application filtering ≈ 1-2ms = ~12ms total. Well within 200ms budget.\n- Complexity: Minimal. Existing regional CDC pipeline unchanged. Feed Service adds a simple in-memory filter step. No additional cache keys or invalidation logic.\n- Verdict: Best approach for categories. The simplest solution that meets latency requirements.\n\n3. Hybrid personalization with preference vectors:\n- Memory: User profiles: 50M active users × ~1KB preference vector = ~50GB (stored in a separate user profile cache). Feed data: Reuses existing category/regional caches (~20-500MB).\n- Latency: Fetch preference vector (~2ms) + fetch 2-3 category feeds (~10ms) + mix/sort in memory (~3ms) ≈ ~15ms total.\n- Complexity: Medium. Requires a user profile service, engagement tracking, and ML for preference vector updates. But avoids the 50B-entry explosion of per-user caches (50M users × 1,000 articles each).\n- Comparison with per-user caches: 50GB (preference vectors) vs ~50TB (per-user article caches) — a 1,000x reduction.\n- Verdict: Best approach for personalization. Builds on top of category caches with minimal additional infrastructure.\n\nArchitectural progression: Start with regional feeds → add in-memory filtering for categories → layer hybrid personalization on top. Each builds incrementally on the previous approach.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "What is a ULID and why use it for article IDs",
      type: "question",
      sectionId: "sec_q_pagination",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In one or two sentences, explain what a ULID is and why it is well-suited for article IDs in a news aggregator's cursor-based pagination.",
        explanation:
          "A ULID (Universally Unique Lexicographically Sortable Identifier) combines the uniqueness of UUIDs with chronological ordering. Because ULIDs are time-ordered, newer articles always have higher IDs, enabling simple cursor pagination (WHERE id < cursor) without composite cursors or timestamp handling.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "A ULID is a Universally Unique Lexicographically Sortable Identifier that combines UUID uniqueness with chronological ordering, enabling simple cursor pagination (WHERE id < cursor) without timestamp collisions.",
          acceptableAnswers: [
            "ULID",
            "lexicographically sortable",
            "time-ordered",
            "monotonically increasing",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Thundering herd in one sentence",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'In one sentence, define the "thundering herd" problem in the context of TTL-based cache expiration for a news aggregator.',
        explanation:
          "When a regional feed cache's TTL expires, all concurrent user requests see a cache miss simultaneously and flood the database with identical expensive queries, overwhelming it until the cache is repopulated.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "When a cache TTL expires, thousands of concurrent requests simultaneously miss the cache and flood the database with identical queries, overwhelming it.",
          acceptableAnswers: [
            "thundering herd",
            "simultaneous",
            "cache miss",
            "flood",
            "database overwhelmed",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Why Redis sharding is unnecessary for regional news feeds",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Explain in 2-3 sentences why Redis sharding (partitioning data across instances) is unnecessary for regional news feed caches, even at 10M concurrent users. What is the actual bottleneck?",
        explanation:
          "Each regional feed contains only ~2,000 articles (~2MB of data), which easily fits in a single Redis instance. The bottleneck is read throughput (requests/second), not data size. Read replicas solve the throughput problem without data partitioning because every replica holds the complete dataset.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Each regional feed is only ~2,000 articles (~2MB), which fits easily in a single instance. The bottleneck is read throughput, not data volume. Read replicas solve this by distributing query load while each replica holds the full dataset.",
          acceptableAnswers: [
            "read throughput",
            "read replicas",
            "data fits",
            "small dataset",
            "not data volume",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "RSS limitation and mitigation",
      type: "question",
      sectionId: "sec_q_ingestion",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Name two fundamental limitations of RSS-only content ingestion for a news aggregator and state the corresponding mitigation for each.",
        explanation:
          "Limitation 1: RSS is pull-based, so there is always a delay between publication and discovery (up to the polling interval). Mitigation: publisher webhooks for real-time push. Limitation 2: Not all publishers have RSS feeds, especially newer digital-native outlets. Mitigation: web scraping with CSS selectors and content fingerprinting.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "1. RSS is pull-based with inherent delay — mitigated by publisher webhooks for push. 2. Not all publishers have RSS feeds — mitigated by web scraping.",
          acceptableAnswers: ["pull-based", "delay", "webhooks", "not all publishers", "scraping"],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match system components to their responsibilities",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content:
          "Match each system component to its primary responsibility in the Google News architecture:",
        explanation:
          "The Data Collection Service handles all content ingestion from publishers. The Feed Service serves user-facing read requests. The API Gateway handles cross-cutting concerns like auth and rate limiting. Object Storage stores binary files (thumbnails) that should never go in the database.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Data Collection Service",
              right: "Polls publisher RSS feeds, downloads articles and thumbnails",
            },
            {
              id: "p2",
              left: "Feed Service",
              right: "Handles user feed requests, queries cache/database for articles",
            },
            {
              id: "p3",
              left: "API Gateway",
              right: "Routes requests, handles authentication and rate limiting",
            },
            {
              id: "p4",
              left: "Object Storage (S3)",
              right: "Stores article thumbnail images for CDN delivery",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match pagination approach to its primary weakness",
      type: "question",
      sectionId: "sec_q_pagination",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each pagination approach to its primary weakness in a news feed context:",
        explanation:
          "Offset-based: articles shift when new content is added, causing duplicates. Timestamp cursors: articles with identical timestamps are missed at page boundaries. Composite cursors: slightly more complex encoding/decoding. ULIDs: must be planned at system inception — migrating from random UUIDs requires data migration.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Offset-based (OFFSET/LIMIT)",
              right: "Pagination drift — new articles cause duplicates and missed content",
            },
            {
              id: "p2",
              left: "Timestamp cursors",
              right: "Articles with identical timestamps are missed at page boundaries",
            },
            {
              id: "p3",
              left: "Composite cursors (timestamp + ID)",
              right: "Slightly more complex cursor encoding and query logic",
            },
            {
              id: "p4",
              left: "Monotonic IDs (ULIDs)",
              right: "Must be planned upfront — migrating from random UUIDs is costly",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match caching strategy to its failure mode",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each caching and scaling strategy to the specific failure mode it prevents in a news aggregator:",
        explanation:
          "CDC prevents stale feeds from TTL expiration delays. Redis read replicas prevent throughput bottleneck when a single instance cannot handle peak QPS. Regional deployment prevents one region's spike from cascading globally. CDN prevents high latency for users geographically far from the origin S3 bucket.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "CDC-based cache updates",
              right: "Stale feeds from TTL expiration + thundering herd on cache miss",
            },
            {
              id: "p2",
              left: "Redis read replicas",
              right: "Single instance throughput cap (~100K RPS) exceeded during spikes",
            },
            {
              id: "p3",
              left: "Regional infrastructure deployment",
              right: "Traffic spike in one region cascading to affect all regions",
            },
            {
              id: "p4",
              left: "CloudFront CDN for thumbnails",
              right: "High latency for users far from the origin S3 bucket",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Feed latency target",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "A news aggregator like Google News should have feed load times under _____ milliseconds to meet user experience requirements.",
        explanation:
          "The non-functional requirement specifies sub-200ms feed load times. This target drives the need for in-memory caching (Redis) and CDN-based media delivery, since database queries alone cannot consistently achieve this latency at scale.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "A news aggregator like Google News should have feed load times under {{blank1}} milliseconds to meet user experience requirements.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "200",
              acceptableAnswers: ["200", "200ms"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "CAP theorem choice for news",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "For a news platform, _____ is prioritized over _____ in the CAP theorem, because users prefer slightly outdated content over no content at all.",
        explanation:
          "Availability is prioritized over consistency. A news feed that shows articles from 5 minutes ago is acceptable, but a blank page or error message is not. Since network partitions are unavoidable in distributed systems, the real choice is between availability and consistency.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "For a news platform, {{blank1}} is prioritized over {{blank2}} in the CAP theorem, because users prefer slightly outdated content over no content at all.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "availability",
              acceptableAnswers: ["availability", "Availability"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "consistency",
              acceptableAnswers: ["consistency", "Consistency"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "CDC cache maintenance commands",
      type: "question",
      sectionId: "sec_q_caching",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "In the CDC-based caching approach, Feed Generation Workers use Redis _____ to add articles with timestamp scores and _____ to remove the oldest articles beyond the size limit.",
        explanation:
          "ZADD adds elements to a sorted set with a score (the article timestamp). ZREMRANGEBYRANK removes elements by their rank position, used to cap the sorted set at a maximum size (e.g., 2,000 articles) by removing the lowest-ranked (oldest) entries.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "In the CDC-based caching approach, Feed Generation Workers use Redis {{blank1}} to add articles with timestamp scores and {{blank2}} to remove the oldest articles beyond the size limit.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "ZADD",
              acceptableAnswers: ["ZADD", "zadd"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "ZREMRANGEBYRANK",
              acceptableAnswers: ["ZREMRANGEBYRANK", "zremrangebyrank"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Redis instances needed for traffic spike",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "During a breaking news event, a single region experiences 10 million concurrent users making feed requests. If each Redis instance handles approximately 100,000 requests per second, how many Redis instances (master + replicas) are needed in that region to handle the load?",
        explanation:
          "10,000,000 concurrent users ÷ 100,000 requests per second per instance = 100 Redis instances. This is the total across the cluster — typically 1 master for writes and 99 read replicas. In practice, you would over-provision slightly for headroom.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 100,
          tolerance: 10,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Daily feed requests estimation",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A news aggregator has 100 million DAU, each refreshing their feed an average of 7 times per day. What is the average feed requests per second (RPS) the system must handle? Round to the nearest thousand.",
        explanation:
          "Total daily requests = 100,000,000 × 7 = 700,000,000. Seconds per day = 86,400. Average RPS = 700,000,000 ÷ 86,400 ≈ 8,102. Rounded to the nearest thousand = 8,000 RPS. Peak traffic (10-100x average) would require 80K-800K RPS, justifying aggressive caching.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 8102,
          tolerance: 500,
        },
      },
    },
  ],
};
