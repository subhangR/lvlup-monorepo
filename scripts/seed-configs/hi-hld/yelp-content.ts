import { StoryPointSeed, ItemSeed } from "../subhang-content";

// ── Yelp (Proximity Search) — HLD Interview Prep ──
// Source: HelloInterview — Yelp breakdown by Evan King
// 3 rich materials + 27 practice questions

export const yelpContent: StoryPointSeed = {
  title: "Yelp",
  description:
    "Design a Yelp-like business discovery platform — covering geospatial search with Elasticsearch/PostGIS, average rating computation with optimistic locking, unique review constraints, and predefined location search via polygons.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_architecture", title: "Architecture & Service Design", orderIndex: 1 },
    { id: "sec_q_ratings", title: "Ratings Computation & Concurrency", orderIndex: 2 },
    { id: "sec_q_geospatial", title: "Geospatial Search & Indexing", orderIndex: 3 },
    { id: "sec_q_elasticsearch", title: "Elasticsearch & Data Synchronization", orderIndex: 4 },
    { id: "sec_q_tradeoffs", title: "Scaling Decisions & Trade-offs", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════

    // Material 1: Requirements, Entities, API, High-Level Design
    {
      title: "Yelp System Design — Requirements & Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Yelp System Design — Requirements & Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Yelp?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Yelp is an online platform that allows users to search for and review local businesses, restaurants, and services. The core challenge is building a system that supports efficient geospatial search across millions of businesses while maintaining accurate aggregate ratings updated in real time.",
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
                listType: "unordered",
                items: [
                  "Users should be able to search for businesses by name, location (lat/long), and category.",
                  "Users should be able to view businesses and their reviews.",
                  "Users should be able to leave reviews on businesses (mandatory 1-5 star rating, optional text).",
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
                  "Low latency for search operations (< 500ms).",
                  "Highly available — eventual consistency is acceptable.",
                  "Scalable to handle 100M daily users and 10M businesses.",
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
                  "Business: Name, location (lat/long), category, average rating, num_reviews.",
                  "User: Profile data for searching and leaving reviews.",
                  "Review: User ID, business ID, 1-5 star rating, optional text.",
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
                "// Search for businesses\nGET /businesses?query&location&category&page -> Business[]\n\n// View business details\nGET /businesses/:businessId -> Business\n\n// View reviews for a business\nGET /businesses/:businessId/reviews?page= -> Review[]\n\n// Leave a review\nPOST /businesses/:businessId/reviews\n{ rating: number, text?: string }",
              metadata: { language: "text" },
            },
            {
              id: "b11",
              type: "heading",
              content: "High-Level Architecture",
              metadata: { level: 3 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "The architecture separates read-heavy search and view operations from write operations. A Client communicates through an API Gateway that routes to two services: a Business Service (handles search and view — read-heavy) and a Review Service (handles review creation — write-light). Both share a single database initially, since 10M businesses × 100 reviews × 1KB = ~1TB fits easily in a modern database. Separating the services allows them to scale independently based on their very different read/write patterns.",
            },
            {
              id: "b13",
              type: "heading",
              content: "Why One Database?",
              metadata: { level: 3 },
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                "Despite having separate services, sharing a single database is justified here: the data is small (~1TB), businesses and reviews are tightly coupled (JOINs are needed), and fault isolation can be achieved via read replicas. Adding a separate database for reviews introduces operational complexity without clear benefit at this scale. This bias toward simplicity is a hallmark of strong staff-level answers.",
            },
            {
              id: "b15",
              type: "quote",
              content:
                '"Calling out that the write throughput is tiny and thus we don\'t need a message queue is the hallmark of a staff candidate and is a perfect example of where simplicity actually demonstrates seniority." — Evan King, HelloInterview',
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Deep Dives — Ratings & Constraints
    {
      title: "Yelp Deep Dives — Average Ratings & Review Constraints",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Average Ratings & Review Constraints",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Deep Dive 1: Efficient Average Rating Calculation",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "heading",
              content: "Bad: Naive JOIN on Every Query",
              metadata: { level: 3 },
            },
            {
              id: "c3",
              type: "paragraph",
              content:
                "Computing AVG(rating) via a JOIN between businesses and reviews on every search query is simple but disastrous at scale. As reviews grow, the query becomes increasingly expensive, is wastefully recalculated even when nothing changed, and slows down all other read operations.",
            },
            {
              id: "c4",
              type: "heading",
              content: "Good: Periodic Cron Job",
              metadata: { level: 3 },
            },
            {
              id: "c5",
              type: "paragraph",
              content:
                "Pre-compute the average rating using a cron job that runs periodically and stores it in an average_rating column on the Business table. Downside: ratings are stale between cron runs. If a business has few reviews and receives a 5-star rating, the user expects to see the average change immediately — but it may not update for hours.",
            },
            {
              id: "c6",
              type: "heading",
              content: "Great: Synchronous Update with Optimistic Locking",
              metadata: { level: 3 },
            },
            {
              id: "c7",
              type: "paragraph",
              content:
                "Add a num_reviews column to the Business table. On each new review, compute: new_avg = (old_avg × num_reviews + new_rating) / (num_reviews + 1). This is O(1) computation — just a few CPU cycles.",
            },
            {
              id: "c8",
              type: "heading",
              content: "The Concurrency Problem",
              metadata: { level: 3 },
            },
            {
              id: "c9",
              type: "paragraph",
              content:
                "If two reviews arrive simultaneously: User 1 reads num_reviews=100, avg=4.0. User 2 also reads num_reviews=100, avg=4.0. User 1 writes avg=4.01, num=101. User 2 overwrites with avg=3.99, num=101. User 1's review is lost from the average. Solution: optimistic locking — check that num_reviews hasn't changed since you read it. If it has, re-read and retry.",
            },
            {
              id: "c10",
              type: "heading",
              content: "Why Not a Message Queue?",
              metadata: { level: 3 },
            },
            {
              id: "c11",
              type: "paragraph",
              content:
                "With 100M users and a 1000:1 read:write ratio, write volume is only ~100K reviews/day or ~1 write/second. Modern databases handle thousands of writes/second. A message queue adds complexity with no tangible benefit. Recognizing this is a staff-level insight.",
            },
            {
              id: "c12",
              type: "heading",
              content: "Deep Dive 2: One Review Per Business Per User",
              metadata: { level: 2 },
            },
            {
              id: "c13",
              type: "heading",
              content: "Bad: Application-Level Check",
              metadata: { level: 3 },
            },
            {
              id: "c14",
              type: "paragraph",
              content:
                "Query existing reviews before inserting. Problems: race conditions (two concurrent submits both pass the check), and the constraint is invisible to other services, data engineers running backfills, etc.",
            },
            {
              id: "c15",
              type: "heading",
              content: "Great: Database Unique Constraint",
              metadata: { level: 3 },
            },
            {
              id: "c16",
              type: "code",
              content:
                "ALTER TABLE reviews\nADD CONSTRAINT unique_user_business UNIQUE (user_id, business_id);",
              metadata: { language: "sql" },
            },
            {
              id: "c17",
              type: "paragraph",
              content:
                "Enforcing the constraint at the database level is robust: it's impossible to violate regardless of which service or script writes to the table. In concurrent submissions, the database serializes the writes — the second attempt throws a unique constraint error. The general principle: enforce data constraints as close to the persistence layer as possible.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 3: Deep Dives — Search Optimization & Location Names
    {
      title: "Yelp Deep Dives — Search Optimization & Geospatial Queries",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Search Optimization & Geospatial Queries",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Deep Dive 3: Efficient Search",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "Searching by latitude/longitude with simple inequality comparisons (WHERE lat > X AND lat < Y AND lon > A AND lon < B) requires a full table scan. Adding a B-tree composite index on (lat, lon) doesn't help much either — B-trees are optimized for single-dimensional range queries and lack spatial awareness for 2D data.",
            },
            {
              id: "d3",
              type: "heading",
              content: "Three Indexing Needs",
              metadata: { level: 3 },
            },
            {
              id: "d4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Location: Geospatial index (geohash, quadtree, or R-tree).",
                  "Name: Full-text search index (inverted index).",
                  "Category: Simple B-tree index.",
                ],
              },
            },
            {
              id: "d5",
              type: "heading",
              content: "Option A: Elasticsearch",
              metadata: { level: 3 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Elasticsearch supports all three indexing strategies natively: geo_distance queries for location, full-text match for names, and term filters for categories. A single compound query handles multi-faceted search efficiently.",
            },
            {
              id: "d7",
              type: "code",
              content:
                '{\n  "query": {\n    "bool": {\n      "must": [\n        { "match": { "name": "coffee" } },\n        { "geo_distance": {\n            "distance": "10km",\n            "location": { "lat": 40.7128, "lon": -74.0060 }\n          }\n        },\n        { "term": { "category": "coffee shop" } }\n      ]\n    }\n  }\n}',
              metadata: { language: "json" },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "However, Elasticsearch should NOT be used as a primary database — it lacks full ACID compliance and transactional integrity. Data must be synced from the primary database using Change Data Capture (CDC): all DB changes are captured as events, written to a queue/stream, and consumed by a process that applies them to Elasticsearch.",
            },
            {
              id: "d9",
              type: "heading",
              content: "Option B: PostgreSQL with Extensions",
              metadata: { level: 3 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "PostGIS for geospatial queries and pg_trgm for full-text search avoid introducing a separate system entirely, eliminating consistency concerns. Given the data size (10M businesses × 1KB = 10GB + reviews = ~1TB), Postgres handles this comfortably without sharding. This is a perfectly valid — even preferred — solution for this scale.",
            },
            {
              id: "d11",
              type: "heading",
              content: "Geospatial Indexing: Geohash vs Quadtree",
              metadata: { level: 3 },
            },
            {
              id: "d12",
              type: "paragraph",
              content:
                "If the interviewer asks you to avoid Elasticsearch, they typically want you to discuss geospatial indexing strategies. Geohashes encode location into a string prefix — nearby points share prefixes. Quadtrees recursively subdivide 2D space into four quadrants. For Yelp, quadtrees are preferred because businesses are clustered in densely populated areas (like NYC) and updates are extremely infrequent, so rebuild cost is negligible.",
            },
            {
              id: "d13",
              type: "heading",
              content: "Second-Pass Filtering with Haversine",
              metadata: { level: 3 },
            },
            {
              id: "d14",
              type: "paragraph",
              content:
                "Geospatial indexes return candidates in a bounding region, but users want results within an exact radius. After retrieving candidates, compute the precise distance using the Haversine formula (Pythagorean theorem optimized for a sphere) and filter out businesses beyond the desired radius.",
            },
            {
              id: "d15",
              type: "heading",
              content: "Filter Sequencing",
              metadata: { level: 3 },
            },
            {
              id: "d16",
              type: "paragraph",
              content:
                "Apply the most restrictive filter first to shrink the search space quickly. Distance is typically most restrictive (businesses within 10km), followed by category and name. This cascading approach minimizes the dataset at each step.",
            },
            {
              id: "d17",
              type: "heading",
              content: "Deep Dive 4: Searching by Location Names",
              metadata: { level: 2 },
            },
            {
              id: "d18",
              type: "paragraph",
              content:
                'Users search "Pizza in NYC" — but cities and neighborhoods are not circles. They have irregular polygon boundaries. The solution has two parts: (1) map location names to polygons stored in a locations table (sourced from GeoJSON/Geoapify), and (2) use geo_shape queries (Elasticsearch) or PostGIS polygon containment to find businesses within the polygon.',
            },
            {
              id: "d19",
              type: "heading",
              content: "Pre-Computing Location Tags",
              metadata: { level: 3 },
            },
            {
              id: "d20",
              type: "paragraph",
              content:
                'Rather than computing polygon containment on every request, pre-compute which locations each business belongs to at creation time. Store as an array: location_names: ["bay_area", "san_francisco", "mission_district"]. Create an inverted index on this field. Now "Pizza in Mission District" becomes a simple keyword filter — no geospatial computation at query time.',
            },
            {
              id: "d21",
              type: "quote",
              content:
                '"Staff candidates are able to acknowledge what a complex solution could be and under what conditions it may be necessary, but articulate why, in this situation, the simple option suffices." — Evan King, HelloInterview',
            },
          ],
          readingTime: 10,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // QUESTIONS (27 total)
    // MCQ: 8, MCAQ: 4, Paragraph: 6, Text: 4, Matching: 3,
    // Fill-blanks: 3, Numerical: 2
    // ═══════════════════════════════════════════════════════════

    // ── MCQ (8) ──────────────────────────────────────────────

    // MCQ 1 — easy
    {
      title: "Service separation rationale",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In a Yelp-like system, why is the Review Service separated from the Business Service?",
        explanation:
          "The Business Service is read-heavy (users search and view businesses constantly), while the Review Service is write-light (relatively few users leave reviews). Separating them allows each to scale independently based on its distinct usage pattern. They share a database because the data is tightly coupled and small enough. Separation is not about different data models, security, or geographic isolation.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "They must use different databases for ACID compliance",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Their usage patterns are significantly different — search is read-heavy while reviews are write-light",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Reviews contain sensitive data requiring a separate security boundary",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Microservices should always have one service per entity as a best practice",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Unique review enforcement",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the most robust way to enforce the constraint that each user can leave only one review per business?",
        explanation:
          "A UNIQUE constraint on (user_id, business_id) at the database level is enforced by the database engine regardless of which service, script, or backfill writes the data. Application-level checks have race conditions and are invisible to other writers. Rate limiting controls frequency, not uniqueness. Frontend validation is trivially bypassed.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A database UNIQUE constraint on (user_id, business_id)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Rate limiting API requests to one per user per business",
              isCorrect: false,
            },
            {
              id: "c",
              text: "An application-level check before inserting the review",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Frontend validation that disables the review button after submission",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Why B-tree fails for geospatial search",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is a standard B-tree composite index on (latitude, longitude) ineffective for finding businesses within a geographic area?",
        explanation:
          "B-tree indexes are optimized for single-dimensional range queries. A composite B-tree on (lat, lon) can efficiently narrow by latitude, but then must scan all matching latitude rows to filter by longitude. It treats lat and lon as independent dimensions and has no understanding of 2D spatial relationships. Specialized structures like R-trees, quadtrees, or geohash-based indexes are needed.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "B-trees treat latitude and longitude as independent dimensions and lack spatial awareness for 2D range queries",
              isCorrect: true,
            },
            {
              id: "b",
              text: "B-trees can only hold a maximum of 1 million entries",
              isCorrect: false,
            },
            {
              id: "c",
              text: "B-trees are write-optimized and too slow for read queries",
              isCorrect: false,
            },
            {
              id: "d",
              text: "B-trees cannot index floating-point numbers like coordinates",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Optimistic locking for average rating",
      type: "question",
      sectionId: "sec_q_ratings",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When updating a business's average rating synchronously on each new review, what problem does optimistic locking solve?",
        explanation:
          "Without locking, two concurrent reviews can both read the same num_reviews value, compute their updates independently, and one overwrites the other — making the final average incorrect. Optimistic locking detects this by checking that num_reviews has not changed since the initial read. If it has, the operation retries with fresh data. This prevents lost updates without the performance penalty of pessimistic locks.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The average rating calculation overflows for businesses with millions of reviews",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Concurrent reviews can read the same num_reviews, and one update overwrites the other, losing a review from the average",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Users can submit reviews with ratings outside the 1-5 range",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The database can run out of connections when too many reviews are submitted",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Elasticsearch consistency challenge",
      type: "question",
      sectionId: "sec_q_elasticsearch",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When using Elasticsearch as a search index alongside a primary relational database, what is the primary consistency challenge and its standard solution?",
        explanation:
          "Elasticsearch is not an ACID-compliant primary store — it's optimized for search. Data written to the primary DB must be replicated to ES, creating a consistency gap. The standard solution is Change Data Capture (CDC): capture database changes as events in a stream (e.g., Debezium + Kafka), and have a consumer apply them to ES. Dual-write from the application is fragile (one write can fail). ES has no native CDC. Manual sync scripts are not real-time.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "ES does not support pagination; add a caching layer between ES and the client",
              isCorrect: false,
            },
            {
              id: "b",
              text: "ES requires schema migrations; use dual-write from the application to keep both in sync",
              isCorrect: false,
            },
            {
              id: "c",
              text: "ES has higher write latency; solve by writing to ES first and syncing to the DB",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Data can become stale in ES; use Change Data Capture (CDC) to stream changes from the primary DB",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Quadtree vs geohash for Yelp",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "For a Yelp-like system with 10M businesses, why might quadtrees be preferred over geohashes for geospatial indexing?",
        explanation:
          "Quadtrees recursively subdivide space and naturally adapt to data density — denser areas like NYC get finer subdivisions while sparse areas stay coarse. Since businesses in Yelp are heavily clustered in populated regions and business locations rarely change, the rebuild cost of quadtrees is negligible. Geohashes use fixed-size cells regardless of density, which can be wasteful in sparse areas and insufficient in dense areas.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Quadtrees have faster write performance for real-time location updates",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Businesses are clustered in densely populated areas, and quadtrees adapt subdivision to data density",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Geohashes cannot represent locations south of the equator",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Quadtrees natively support full-text search whereas geohashes do not",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Staff-level simplicity vs complexity",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A candidate proposes using a Kafka message queue between the Review Service and a separate Rating Aggregation Service to compute average ratings asynchronously. In a Yelp system with 100M daily users, what is the strongest counter-argument to this design?",
        explanation:
          "With a 1000:1 read:write ratio and 100M users, the system handles roughly 100K reviews/day or ~1 write per second. Modern databases handle thousands of writes/second easily. The message queue adds infrastructure complexity (Kafka cluster, consumer service, monitoring, failure handling) for a write volume that a single database UPDATE can handle trivially. This is the core staff-level insight: simplicity is preferred when the problem doesn't demand complexity.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Message queues cannot handle numerical aggregation operations",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Kafka cannot guarantee exactly-once delivery for rating updates",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The write volume (~1 review/second) is trivially small — a synchronous DB update handles it without infrastructure overhead",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Asynchronous processing always violates eventual consistency requirements",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Pre-computed location tags trade-off",
      type: "question",
      sectionId: "sec_q_elasticsearch",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'Instead of running geospatial polygon queries at search time, you pre-compute location tags (e.g., ["san_francisco", "mission_district"]) for each business at creation time. What is the key operational trade-off of this approach?',
        explanation:
          "Pre-computed tags turn expensive geospatial queries into cheap keyword lookups at query time. However, if location boundaries change (e.g., a neighborhood's official border is redrawn), ALL businesses must be reprocessed to update their tags. Since business creation is rare and boundary changes are even rarer, this trade-off strongly favors the pre-computation approach. It doesn't increase storage meaningfully (a few string tags), doesn't prevent new polygon additions, and doesn't require Elasticsearch specifically.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "If location boundaries change, all businesses must be reprocessed to update their tags",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Pre-computed tags are only compatible with Elasticsearch, not relational databases",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Storing tag arrays significantly increases database storage costs",
              isCorrect: false,
            },
            {
              id: "d",
              text: "New location polygons cannot be added without restarting the system",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4) ─────────────────────────────────────────────

    // MCAQ 1 — easy
    {
      title: "Valid geospatial indexing strategies",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL valid geospatial indexing strategies for proximity search:",
        explanation:
          "Geohashes encode locations into string prefixes where nearby points share prefixes. Quadtrees recursively subdivide 2D space. R-trees group nearby objects into bounding rectangles. All three are established geospatial indexing strategies. A B+ tree is a one-dimensional index and is not spatially aware — it cannot efficiently answer 2D proximity queries.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Geohash", isCorrect: true },
            { id: "b", text: "R-tree", isCorrect: true },
            { id: "c", text: "Quadtree", isCorrect: true },
            { id: "d", text: "B+ tree", isCorrect: false },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Problems with application-level uniqueness check",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          'Select ALL problems with enforcing "one review per user per business" at the application level instead of the database level:',
        explanation:
          "Application-level checks have multiple failure modes: (1) Race conditions — two concurrent requests both pass the check before either writes. (2) Other services or scripts writing directly to the DB bypass the check entirely. (3) Data engineers running backfills or migrations may violate the constraint unknowingly. Application checks do NOT cause deadlocks — that's a concern with pessimistic locking, not read-then-write checks.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Data backfills and migrations may violate the constraint unknowingly",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Application-level checks cause database deadlocks under high load",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Race conditions allow duplicate reviews under concurrent submissions",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Other services writing directly to the database can bypass the check",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "What Elasticsearch provides for Yelp search",
      type: "question",
      sectionId: "sec_q_elasticsearch",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL capabilities that Elasticsearch provides which are useful for a Yelp search system:",
        explanation:
          "Elasticsearch provides: geo_distance queries for location-based search, full-text search via inverted indexes for name matching, and term filters for exact category matching. However, Elasticsearch does NOT provide ACID transactions — it is not designed as a transactional primary store, which is precisely why a separate primary database is needed.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Full-text search with inverted indexes",
              isCorrect: true,
            },
            {
              id: "b",
              text: "ACID-compliant transactions for review creation",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Term-based filtering for categories",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Geospatial queries (geo_distance, geo_shape)",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Justifications for shared database",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "In the Yelp design, the Business Service and Review Service share a single database. Select ALL valid justifications for this decision:",
        explanation:
          "Sharing a database is justified because: (1) the total data is small (~1TB — modern databases handle this easily); (2) businesses and reviews require JOINs for view queries; (3) fault isolation can be achieved via read replicas without database separation. However, shared databases do NOT reduce write contention — in fact, writes to the same database can contend more than writes to separate databases.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Fault isolation is achievable via read replicas without database separation",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Businesses and reviews are tightly coupled and require JOINs",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Total data (~1TB) fits comfortably in a single database instance",
              isCorrect: true,
            },
            {
              id: "d",
              text: "A shared database reduces write contention between the services",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── PARAGRAPH (6) ────────────────────────────────────────

    // Paragraph 1 — medium
    {
      title: "Compare average rating calculation approaches",
      type: "question",
      sectionId: "sec_q_ratings",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare three approaches for calculating a business's average rating in a Yelp-like system: (1) computing on-the-fly via JOIN, (2) periodic cron job, and (3) synchronous update with optimistic locking. For each, explain the trade-off and when it breaks down.",
        explanation:
          "A strong answer identifies the specific failure mode of each approach: JOIN is O(reviews) per query and kills read performance at scale; cron job creates staleness windows; synchronous update is O(1) but requires concurrency handling. Should justify why synchronous is best given the low write volume.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "On-the-fly JOIN: Computes AVG(rating) by joining businesses and reviews tables on every search query. Trade-off: simple to implement but performance degrades linearly with review count. Breaks down at scale — with popular businesses having thousands of reviews, the JOIN becomes expensive and blocks other reads.\n\nPeriodic cron job: Pre-computes average ratings and stores them in an average_rating column. Trade-off: eliminates query-time computation but introduces staleness. Breaks down for businesses with few reviews where a single new rating should noticeably change the average — users expect immediate feedback.\n\nSynchronous update with optimistic locking: On each new review, computes new_avg = (old_avg × num_reviews + new_rating) / (num_reviews + 1) — an O(1) operation. Trade-off: requires handling concurrent updates via optimistic locking (check-and-retry). Best for Yelp because the write volume is extremely low (~1 review/second), making retries rare and the synchronous approach trivially efficient.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain CDC pipeline for Elasticsearch sync",
      type: "question",
      sectionId: "sec_q_elasticsearch",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain how you would keep an Elasticsearch search index consistent with a primary PostgreSQL database in a Yelp system. Describe the full pipeline and explain why dual-write from the application is not recommended.",
        explanation:
          "Should describe the CDC pipeline: DB changes captured via WAL/Debezium → published to Kafka → consumed by indexer service → applied to ES. Should explain why dual-write is fragile: if one write succeeds and the other fails, the systems diverge, and there is no transactional guarantee across two different stores.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Pipeline: Use Change Data Capture (CDC) to stream changes from PostgreSQL to Elasticsearch. A tool like Debezium monitors the PostgreSQL Write-Ahead Log (WAL) and captures every INSERT, UPDATE, and DELETE as an event. These events are published to a Kafka topic. A consumer service reads from Kafka and applies the corresponding operations to Elasticsearch documents.\n\nThis provides near-real-time consistency (typically seconds of lag) and is resilient to transient failures — Kafka retains events until the consumer acknowledges them.\n\nWhy not dual-write: If the application writes to both PostgreSQL and ES directly, several problems arise: (1) If the DB write succeeds but the ES write fails (network timeout, ES node down), the systems diverge. (2) There is no distributed transaction spanning both systems. (3) Retrying the ES write risks duplication or ordering issues. (4) Every service that writes to the DB must also know about ES, coupling concerns. CDC solves all of these by making the database the single source of truth and deriving the ES state from it.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the search filter pipeline",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'A user searches for "pizza" within 5km of their location in the "restaurants" category. Design the multi-stage filtering pipeline that processes this query. Explain: (1) which filter to apply first and why, (2) how each filter works at the index level, and (3) where the Haversine formula fits in.',
        explanation:
          "Staff-level answer should justify filter ordering by selectivity (distance first as most restrictive), explain the index type backing each filter (geospatial for distance, inverted for name, B-tree for category), and position Haversine as a post-index second-pass refinement step that converts bounding-box candidates into exact-radius results.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Stage 1 — Distance filter (most restrictive, applied first): Use the geospatial index (quadtree/geohash/R-tree) to find all businesses within a bounding box around the user\'s coordinates. This dramatically reduces the candidate set — from 10M businesses to perhaps a few thousand in the local area. The index enables this in O(log n) rather than a full table scan.\n\nStage 2 — Category filter: From the reduced candidate set, apply a B-tree index lookup on category = "restaurants". This further narrows results to businesses of the correct type. B-trees are ideal for exact-match or enum-like filters.\n\nStage 3 — Name filter: Apply full-text search using an inverted index to match "pizza" against business names and descriptions. The inverted index maps terms to document IDs, enabling sub-millisecond lookups even across large text corpora.\n\nStage 4 — Haversine second-pass: The geospatial index returns candidates in a bounding box (rectangular region), but the user wants results within an exact 5km radius (circular region). For each remaining candidate, compute the precise great-circle distance using the Haversine formula and filter out any business beyond 5km. This is a CPU-bound computation on a small candidate set, so it\'s fast.\n\nStage 5 — Ranking: Sort remaining results by relevance (combining text match score, distance, and average rating) and paginate.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Justify simplicity over complexity at scale",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You are in a Staff Engineer interview designing Yelp. The interviewer asks: "Why not use Elasticsearch, a message queue for ratings, sharding, and separate databases for each service?" Provide a staff-level response that justifies simpler alternatives while acknowledging when the complex solutions would become necessary.',
        explanation:
          "The answer should demonstrate the staff-level ability to quantify requirements and match solutions to actual scale. Should cover: data size (1TB — no sharding needed), write volume (1 write/sec — no queue needed), data coupling (businesses + reviews — shared DB), and Postgres extensions as ES alternative. Must acknowledge inflection points where complexity becomes justified.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "For this system at this scale, simpler alternatives are not just acceptable — they're preferred.\n\nElasticsearch vs Postgres extensions: Our data is ~10GB of businesses + ~1TB of reviews. PostGIS handles geospatial queries excellently at this scale, and pg_trgm provides solid full-text search. Adding Elasticsearch introduces a separate system that must stay consistent with our primary DB via CDC — operational overhead that's justified only when Postgres can't keep up. If we grew to 100M+ businesses or needed real-time relevance tuning, ES would become worthwhile.\n\nMessage queue for ratings: With a 1000:1 read:write ratio and 100M daily users, we get ~100K reviews/day or ~1 write/second. A single Postgres instance handles thousands of writes/second. Adding Kafka + a consumer service + monitoring for 1 write/second is pure overhead. The queue becomes justified if reviews grow to 10K+ writes/second or if we need to fan out review events to multiple downstream consumers.\n\nSharding: 1TB fits comfortably in a single database with read replicas. Sharding adds cross-shard query complexity, distributed JOINs, and operational burden. It becomes necessary when data exceeds single-node capacity (typically 5-10TB+) or write throughput saturates a single primary.\n\nSeparate databases: Businesses and reviews are tightly coupled — viewing a business requires both. Splitting them forces cross-service JOINs or data duplication. Separate databases make sense when services have truly independent data access patterns and don't need JOINs.",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Design location name search with polygons",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'A user searches "Pizza in Mission District, San Francisco". Explain how your system resolves this query end-to-end: (1) translating the location name to a geographic boundary, (2) finding businesses within that boundary, and (3) an optimization that avoids repeated polygon computations.',
        explanation:
          "Should cover the locations table mapping names to polygons, geo_shape queries or PostGIS ST_Contains, and the pre-computation optimization of tagging businesses with location identifiers at creation time for inverted index lookups.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Step 1 — Location name resolution: Maintain a locations table mapping names to geographic polygons. Schema: (name: "mission_district", type: "neighborhood", polygon: GeoJSON). When the user searches "Mission District", we look up the name (indexed for fast retrieval) and retrieve the polygon representing that neighborhood\'s irregular boundary.\n\nStep 2 — Geospatial containment: Use the polygon to find businesses within it. With PostGIS: SELECT * FROM businesses WHERE ST_Contains(polygon, ST_MakePoint(business.lon, business.lat)). With Elasticsearch: use a geo_shape query with the polygon as the filter. Then apply additional filters (category, name match for "pizza") on the resulting candidate set.\n\nStep 3 — Pre-computation optimization: Running polygon containment queries on every search is expensive. Instead, when a business is created (or a new location polygon is added), pre-compute which locations contain that business and store the result as an array: location_names: ["bay_area", "san_francisco", "mission_district"]. Create an inverted index on this field.\n\nNow, "Pizza in Mission District" becomes: filter by location_names contains "mission_district" (keyword lookup) + match name "pizza" (full-text search) — no geospatial computation at query time. Since business locations and neighborhood boundaries rarely change, the pre-computation cost is negligible.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Full interview walkthrough for Yelp",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You are in a Staff Engineer interview asked to "Design Yelp." Outline the structure of your answer: (1) requirements, (2) entities and API, (3) high-level design, (4) deep dives. For each phase, explain what you would cover and where you would spend the most time. What distinguishes your answer from a senior-level answer?',
        explanation:
          "The answer should show interview strategy: rush through straightforward parts (entities, API), invest time on search deep dive and tradeoff discussions. Should explicitly contrast staff vs senior: staff candidates justify simplicity with quantified reasoning, recognize when complexity becomes warranted, and demonstrate operational awareness.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Phase 1 — Requirements (2-3 min): Quickly align on functional requirements (search, view, review). Proactively identify NFRs: low latency search (<500ms), high availability with eventual consistency. Establish scale: 100M daily users, 10M businesses. Identify key constraint: one review per user per business.\n\nPhase 2 — Entities & API (2 min, rushed): Three entities: Business, User, Review. Four endpoints: GET /businesses (search), GET /businesses/:id (view), GET /businesses/:id/reviews (reviews), POST /businesses/:id/reviews (create review). Add pagination where applicable. Signal this is straightforward: "Let me move to the architecture."\n\nPhase 3 — High-Level Design (5-8 min): Two services: Business Service (search + view, read-heavy) and Review Service (review creation, write-light). Shared database — justify explicitly with data size (~1TB) and coupling (JOINs needed). API Gateway for routing. Mention read replicas for availability.\n\nPhase 4 — Deep Dives (20+ min, MOST TIME HERE): This is where staff answers diverge from senior. Cover: (a) Average rating — walk through all three approaches, land on synchronous update with optimistic locking. Quantify: ~1 write/second, no queue needed. (b) Unique review constraint — database UNIQUE constraint, not application check. (c) Search optimization — this gets the most time. Discuss the three indexing needs (geospatial, full-text, category), compare Elasticsearch vs PostGIS, discuss quadtree vs geohash trade-offs, explain Haversine second-pass filtering, and filter sequencing. (d) Location name search — polygons, pre-computed tags.\n\nStaff vs Senior distinction: A senior engineer uses the correct technologies (ES, PostGIS) and builds a working design. A staff engineer quantifies the actual load, recognizes that the problem is simpler than it appears (1 write/sec, 1TB data), and deliberately chooses simpler solutions — justifying each decision with numbers. Staff answers demonstrate that complexity is a cost, not a feature.',
          minLength: 250,
          maxLength: 4000,
        },
      },
    },

    // ── TEXT (4) ──────────────────────────────────────────────

    // Text 1 — medium
    {
      title: "Haversine formula purpose",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In the context of geospatial search, what is the Haversine formula used for? Answer in one sentence.",
        explanation:
          "The Haversine formula calculates the great-circle distance between two points on a sphere given their latitude and longitude. It's used as a second-pass filter to convert bounding-box candidates from a geospatial index into exact-radius results.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "It calculates the great-circle distance between two points on a sphere to determine exact distance between a user and a business.",
          acceptableAnswers: [
            "Calculates precise distance between two lat/lon coordinates on a sphere",
            "Computes great-circle distance for second-pass distance filtering",
            "Used to filter geospatial candidates to an exact radius",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Why enforce constraints at persistence layer",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'Why should data constraints (like "one review per user per business") be enforced at the database level rather than the application level? Answer in one sentence.',
        explanation:
          "Database constraints are enforced by the database engine regardless of which service, script, or process writes the data, making them robust against bypasses, race conditions, and future changes to the system.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Database constraints are enforced regardless of which service or process writes the data, preventing bypasses and race conditions.",
          acceptableAnswers: [
            "The database enforces the constraint for all writers, not just one application",
            "It prevents race conditions and is respected by all services and scripts",
            "Application checks can be bypassed by other services or concurrent requests",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Read:write ratio insight for Yelp",
      type: "question",
      sectionId: "sec_q_ratings",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "With 100M daily users and a 1000:1 read:write ratio, approximately how many reviews per second does a Yelp system receive? Explain why this number matters for architectural decisions.",
        explanation:
          "About 1 review per second (100M / 1000 = 100K reviews/day ÷ 86400 ≈ 1.2/sec). This tiny write volume means a message queue, separate write database, or write sharding are all unnecessary complexity — a synchronous database UPDATE handles it trivially.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Approximately 1 review per second. This means complex write-scaling solutions like message queues or write sharding are unnecessary overhead.",
          acceptableAnswers: [
            "About 1-2 reviews per second, making async processing and queues unnecessary",
            "Roughly 1 write/sec, so synchronous DB updates are sufficient",
            "~100K reviews/day or ~1/sec, no need for write scaling infrastructure",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Why not use Elasticsearch as primary DB",
      type: "question",
      sectionId: "sec_q_elasticsearch",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Why should Elasticsearch NOT be used as the primary database in a Yelp system? Answer in one or two sentences.",
        explanation:
          "Elasticsearch lacks full ACID compliance — it does not guarantee transactional data integrity and its fault tolerance mechanisms require careful configuration to avoid data loss during node failures. It is optimized for search and analytics, not as a system of record.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Elasticsearch is not ACID-compliant and is not optimized for transactional data integrity. Its fault tolerance can lead to data loss during node failures without careful configuration.",
          acceptableAnswers: [
            "ES lacks ACID transactions and can lose data during failures",
            "It is a search engine, not a transactional database",
            "No ACID compliance and risk of data loss makes it unsuitable as primary store",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── MATCHING (3) ─────────────────────────────────────────

    // Matching 1 — easy
    {
      title: "Match search filter to index type",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each search filter type to the appropriate indexing strategy:",
        explanation:
          "Location-based search requires geospatial indexes (geohash, quadtree, R-tree) that understand 2D spatial relationships. Name/text search requires inverted indexes that map terms to documents. Category filtering uses exact-match lookups best served by B-tree indexes. Average rating sorting uses a standard numeric index.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Search by location (lat/long)",
              right: "Geospatial index (geohash, quadtree, R-tree)",
            },
            {
              id: "p2",
              left: "Search by business name",
              right: "Inverted index (full-text search)",
            },
            {
              id: "p3",
              left: "Filter by category",
              right: "B-tree index",
            },
            {
              id: "p4",
              left: "Sort by average rating",
              right: "Numeric index",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match rating approach to weakness",
      type: "question",
      sectionId: "sec_q_ratings",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each average rating calculation approach to its primary weakness:",
        explanation:
          "On-the-fly JOIN degrades read performance as review count grows. Cron job creates staleness — ratings lag behind reality. Application-level cache requires manual invalidation logic and can serve stale values. Synchronous update needs optimistic locking to handle concurrent reviews correctly.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "On-the-fly AVG() with JOIN",
              right: "Performance degrades linearly with review count",
            },
            {
              id: "p2",
              left: "Periodic cron job pre-computation",
              right: "Ratings are stale between cron runs",
            },
            {
              id: "p3",
              left: "Synchronous update per review",
              right: "Requires concurrency control for simultaneous reviews",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match Yelp design decision to staff-level justification",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each Yelp architectural decision to the quantified justification that makes it a staff-level answer:",
        explanation:
          "Staff engineers justify decisions with specific numbers: no queue because write volume is ~1/sec, no sharding because data is ~1TB, shared DB because businesses and reviews need JOINs and data is small, PostGIS over ES because it eliminates the consistency problem at this scale.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "No message queue for rating updates",
              right: "~1 write/sec — DB handles it trivially",
            },
            {
              id: "p2",
              left: "No database sharding",
              right: "~1TB total data — fits in a single instance",
            },
            {
              id: "p3",
              left: "Shared database for Business + Review services",
              right: "Tightly coupled data requiring JOINs, small enough for one DB",
            },
            {
              id: "p4",
              left: "PostGIS over Elasticsearch",
              right: "Eliminates CDC consistency pipeline at this scale",
            },
          ],
        },
      },
    },

    // ── FILL-BLANKS (3) ──────────────────────────────────────

    // Fill-blanks 1 — easy
    {
      title: "Optimistic locking check field",
      type: "question",
      sectionId: "sec_q_ratings",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "When using optimistic locking to update a business's average rating, the system checks whether the _____ has changed since the initial read before committing the update.",
        explanation:
          "The num_reviews column serves as the version indicator for optimistic locking. If num_reviews has changed between the read and the write, another review was processed concurrently and the update must be retried with fresh data.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "When using optimistic locking to update a business's average rating, the system checks whether the {{blank1}} has changed since the initial read before committing the update.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "num_reviews",
              acceptableAnswers: [
                "num_reviews",
                "number of reviews",
                "review count",
                "num reviews",
                "version number",
              ],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "CDC data flow",
      type: "question",
      sectionId: "sec_q_elasticsearch",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "To keep Elasticsearch consistent with the primary database, a _____ system captures changes from the database and streams them to the search index.",
        explanation:
          "Change Data Capture (CDC) is the standard technique for keeping derived data stores (like search indexes) in sync with a primary database. Tools like Debezium monitor the database's write-ahead log and publish changes as events.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "To keep Elasticsearch consistent with the primary database, a {{blank1}} system captures changes from the database and streams them to the search index.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Change Data Capture",
              acceptableAnswers: ["Change Data Capture", "CDC", "change data capture", "cdc"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "PostGIS extension name",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "To enable geospatial queries in PostgreSQL without introducing a separate search engine, you can install the _____ extension for location queries and the _____ extension for full-text search.",
        explanation:
          "PostGIS is the standard PostgreSQL extension for geospatial data types and queries. pg_trgm (trigram) is a PostgreSQL extension that provides fast similarity matching and full-text search capabilities based on trigram decomposition of strings.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "To enable geospatial queries in PostgreSQL without introducing a separate search engine, you can install the {{blank1}} extension for location queries and the {{blank2}} extension for full-text search.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "PostGIS",
              acceptableAnswers: ["PostGIS", "postgis", "POSTGIS"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "pg_trgm",
              acceptableAnswers: ["pg_trgm", "pgtrgm", "trigram", "pg_trigram"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── NUMERICAL (2) ────────────────────────────────────────

    // Numerical 1 — medium
    {
      title: "Estimated review write volume",
      type: "question",
      sectionId: "sec_q_ratings",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "A Yelp-like system has 100M daily active users. Assuming a 1000:1 read-to-write ratio, approximately how many reviews are submitted per day (in thousands)?",
        explanation:
          "100M daily users / 1000 (read:write ratio) = 100,000 reviews per day = 100 thousand. This is the key number that justifies avoiding message queues and complex write-scaling infrastructure.",
        basePoints: 15,
        difficulty: "medium",
        questionData: { correctAnswer: 100, tolerance: 10 },
      },
    },

    // Numerical 2 — hard
    {
      title: "Total data size estimation",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A Yelp system has 10M businesses, each averaging 100 reviews. Each review is approximately 1KB. What is the total review data size in terabytes (TB)?",
        explanation:
          "Total reviews = 10M businesses × 100 reviews = 1 billion reviews. Total size = 1,000,000,000 × 1KB = 1,000,000,000 KB = 1,000,000 MB = 1,000 GB = 1 TB. This ~1TB total is small enough for a single database instance, justifying the decision not to shard.",
        basePoints: 25,
        difficulty: "hard",
        questionData: { correctAnswer: 1, tolerance: 0.1 },
      },
    },
  ],
};
