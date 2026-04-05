import { StoryPointSeed, ItemSeed } from "../subhang-content";

// ── GoPuff (Local Delivery Service) — HLD Interview Prep ──
// Source: HelloInterview — Local Delivery Service breakdown by Stefan Mai
// 3 rich materials + 28 practice questions

export const gopuffContent: StoryPointSeed = {
  title: "GoPuff — Local Delivery Service",
  description:
    "Design a local delivery service like GoPuff — covering inventory availability across micro distribution centers, order placement with strong consistency, geospatial DC lookup, and scaling reads with caching and partitioning.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements, Entities & API Design", orderIndex: 1 },
    { id: "sec_q_geospatial", title: "Geospatial Lookup & Nearby Service", orderIndex: 2 },
    { id: "sec_q_ordering", title: "Order Consistency & Transactions", orderIndex: 3 },
    { id: "sec_q_scaling", title: "Caching, Partitioning & Read Scaling", orderIndex: 4 },
    { id: "sec_q_tradeoffs", title: "Tradeoffs, Capacity & System Evolution", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════

    // Material 1: Problem Setup — Requirements, Entities, API
    {
      title: "GoPuff System Design — Problem Setup",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "GoPuff System Design — Problem Setup",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is GoPuff?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "GoPuff delivers convenience store goods via rapid delivery using 500+ micro distribution centers (DCs). The core engineering challenge is aggregating inventory availability across nearby DCs and placing orders without double-booking physical items — all at scale with sub-100ms availability lookups and 10 million orders per day.",
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
                  "Customers query availability of items deliverable within 1 hour by location. Effective availability is the union of all inventory across nearby DCs.",
                  "Customers can order multiple items simultaneously.",
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
                  "Payments and purchases processing",
                  "Driver routing and deliveries",
                  "Search functionality and catalog APIs",
                  "Cancellations and returns",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 3 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Availability requests must be fast (<100ms) to support search-like use cases.",
                  "Ordering must be strongly consistent — two customers must not purchase the same physical product.",
                  "Support 10k DCs and 100k items in the catalog across DCs.",
                  "Order volume: O(10M orders/day).",
                ],
              },
            },
            {
              id: "b9",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 3 },
            },
            {
              id: "b10",
              type: "paragraph",
              content:
                'A critical distinction is between Item and Inventory — think Class vs Instance in OOP. An Item (e.g., "Cheetos") is what customers see in the catalog. An Inventory record is a physical instance of that item at a specific DC. DistributionCenter tracks physical locations. Order represents a collection of inventory items purchased by a user.',
            },
            {
              id: "b11",
              type: "heading",
              content: "API Design",
              metadata: { level: 3 },
            },
            {
              id: "b12",
              type: "code",
              content:
                "// Get availability by location\nGET /availability?lat={lat}&lng={lng}&keyword={keyword}&page={page}\n→ Returns: [{ itemId, name, description, quantity }]\n\n// Place an order\nPOST /orders\nBody: { lat, lng, items: [{ itemId, quantity }] }\n→ Returns: { orderId, status }",
              metadata: { language: "text" },
            },
            {
              id: "b13",
              type: "quote",
              content:
                '"By starting with the most concrete physical or business entities and working your way up to more abstract entities, you can ensure that you don\'t miss any important entities." — Stefan Mai, HelloInterview',
            },
          ],
          readingTime: 6,
        },
      },
    },

    // Material 2: High-Level Design — Availability + Ordering
    {
      title: "High-Level Design — Availability & Ordering",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "High-Level Design — Availability & Ordering",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Availability Query Flow",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "The availability query involves two steps: (1) Find DCs close enough to deliver within 1 hour, and (2) Query inventory across those DCs and return the union to the user. Both steps must complete within the 100ms latency budget.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Nearby Service",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "The Nearby Service takes a latitude and longitude, then returns DCs within 1-hour delivery range. A primitive approach uses Euclidean or Haversine distance on DC coordinates stored in a database. A better approach syncs DC locations to in-memory and uses a Travel Time Estimation Service — first pruning to candidates within a 60-mile radius, then calling the external service only on those candidates.",
            },
            {
              id: "c5",
              type: "heading",
              content: "Inventory Lookup",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "Once nearby DCs are identified, the Availability Service queries a Postgres database joining Inventory and Item tables to get item names, descriptions, and aggregate quantities across those DCs. In production, the catalog would typically be separated from inventory due to different access patterns and workloads.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Ordering — The Double-Booking Problem",
              metadata: { level: 2 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                'Orders require strong consistency to prevent two users from purchasing the same physical item. This is the classic "double-booking" problem that appears across many system design interviews (Ticketmaster, hotel booking, etc.).',
            },
            {
              id: "c9",
              type: "heading",
              content: "Good Solution: Two Data Stores + Distributed Lock",
              metadata: { level: 3 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "Separate databases for orders and inventory. Lock inventory records, create order, decrement inventory, release lock. Allows using the best data store for each use case, but has nasty failure modes: service crash between order creation and inventory update leaves inconsistent state, and overlapping inventory requirements across orders can cause deadlocks.",
            },
            {
              id: "c11",
              type: "heading",
              content: "Great Solution: Single Postgres Transaction",
              metadata: { level: 3 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                'By colocating orders and inventory in the same Postgres database, we leverage ACID properties. A single SERIALIZABLE transaction checks inventory > 0, marks inventory as "ordered", and creates the Order/OrderItems records atomically. If any item is unavailable, the entire transaction rolls back. This avoids the failure modes of distributed locking entirely.',
            },
            {
              id: "c13",
              type: "code",
              content:
                'BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n-- 1. Check inventory for items A, B, C > 0\n-- 2. If any out of stock → ROLLBACK\n-- 3. Update inventory status to "ordered"\n-- 4. INSERT into Orders and OrderItems tables\nCOMMIT;',
              metadata: { language: "sql" },
            },
            {
              id: "c14",
              type: "heading",
              content: "Architecture Summary",
              metadata: { level: 3 },
            },
            {
              id: "c15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Availability Service: handles user requests, calls Nearby Service, queries inventory read replicas.",
                  "Orders Service: writes to Postgres leader using atomic SERIALIZABLE transactions.",
                  "Nearby Service: shared service that syncs DC locations and integrates with Travel Time Estimation.",
                  "Singular Postgres database: partitioned by region, with read replicas for availability and leader for orders.",
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 3: Deep Dives — Travel Time, Caching, Scaling
    {
      title: "Deep Dives — Scaling Availability & Travel Time",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Scaling Availability & Travel Time",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Deep Dive 1: Travel Time & Drive Time",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "Simple distance calculations (Euclidean or Haversine) fail when DCs are across rivers, borders, or congested routes. The system must account for actual drive times including traffic. The solution evolves through three approaches.",
            },
            {
              id: "d3",
              type: "heading",
              content: "Bad: Simple SQL Distance",
              metadata: { level: 3 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "Query DC table with Haversine formula and threshold. Ignores traffic, road conditions, and real-world obstacles. A DC 5 miles away across a river might take 45 minutes via bridge.",
            },
            {
              id: "d5",
              type: "heading",
              content: "Bad: Travel Time Against ALL DCs",
              metadata: { level: 3 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Sync DCs to memory, call travel time API for every DC. Too many API calls — most DCs are nowhere near the user. With 10k DCs, this is wildly inefficient.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Great: Travel Time Against Nearby DCs Only",
              metadata: { level: 3 },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "Sync DCs to memory periodically (every ~5 minutes). First prune candidates with a fixed radius (e.g., 60 miles — the most optimistic 1-hour drive). Then call the Travel Time Estimation Service only for those candidates. This reduces API calls by orders of magnitude while still accounting for real traffic conditions.",
            },
            {
              id: "d9",
              type: "heading",
              content: "Deep Dive 2: Scaling Availability Reads",
              metadata: { level: 2 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "Availability queries vastly outnumber orders. Back-of-envelope: 10M orders/day ÷ 100k seconds/day × 10 pages per user ÷ 0.05 conversion rate = ~20k queries/second. This is a classic scaling reads problem that requires caching and partitioning.",
            },
            {
              id: "d11",
              type: "heading",
              content: "Great Solution: Redis Cache Layer",
              metadata: { level: 3 },
            },
            {
              id: "d12",
              type: "paragraph",
              content:
                "Add Redis between the Availability Service and Postgres. Cache inventory results with a short TTL (e.g., 1 minute) since inventory changes relatively slowly compared to query volume. On cache miss, read from database and populate cache. The Order Service must invalidate affected cache entries when inventory changes.",
            },
            {
              id: "d13",
              type: "heading",
              content: "Great Solution: Postgres Read Replicas + Partitioning",
              metadata: { level: 3 },
            },
            {
              id: "d14",
              type: "paragraph",
              content:
                "Partition inventory by region ID (e.g., first 3 digits of zip code) so queries hit only 1-2 partitions instead of the full dataset. Use read replicas for availability queries since slight staleness is acceptable. Orders requiring strong consistency go to the Postgres leader.",
            },
            {
              id: "d15",
              type: "heading",
              content: "GoPuff vs Ticketmaster: A Key Distinction",
              metadata: { level: 2 },
            },
            {
              id: "d16",
              type: "paragraph",
              content:
                'Unlike Ticketmaster (scarce, uniquely identifiable seats), GoPuff deals with mass-quantity fungible items. The chance of going to zero between cart-add and checkout is low. Retailers often accept occasional stock-outs in exchange for simpler architecture. This is why a single Postgres transaction is "great" here, whereas Ticketmaster needs Redis-based distributed locks with TTL for seat reservation.',
            },
            {
              id: "d17",
              type: "quote",
              content:
                '"Using quantitative estimation where you\'ve spotted a potential bottleneck can significantly improve your interview performance. It gives you and your interviewer a common set of data from which to weigh tradeoffs." — Stefan Mai, HelloInterview',
            },
          ],
          readingTime: 10,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // MCQ: 8, MCAQ: 4, Paragraph: 6, Text: 4, Matching: 3,
    // Fill-blanks: 3, Numerical: 2
    // ═══════════════════════════════════════════════════════════

    // ── MCQ (8) ──────────────────────────────────────────────

    // MCQ 1 — easy
    {
      title: "Core entities in a delivery system",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'In GoPuff\'s system design, what is the key distinction between an "Item" and an "Inventory" entity?',
        explanation:
          'An Item represents a type of product (e.g., "Cheetos") — the catalog entry customers see. Inventory represents a physical instance of that item at a specific Distribution Center. This is analogous to Class vs Instance in OOP. The distinction is critical because availability is computed by summing Inventory counts across DCs for a given Item. Without this separation, you cannot track where physical goods are located.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Item is a single physical product, Inventory is the total count across all warehouses",
              isCorrect: false,
            },
            {
              id: "b",
              text: "They are synonymous — both represent products in the catalog",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Item is a catalog entry (product type), Inventory is a physical instance at a specific DC",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Item is a user's cart entry, Inventory is the database record",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Availability query latency requirement",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why does the GoPuff system require availability lookups to complete in under 100ms?",
        explanation:
          "Availability lookups power search-like experiences where users browse products. High latency in search results directly impacts user experience and conversion rates. Orders, by contrast, are infrequent and users tolerate higher latency for checkout flows. The 100ms target ensures the availability API can be called as part of search, filtering, and pagination without perceptible delay.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "To support search-like use cases where users browse products interactively",
              isCorrect: true,
            },
            {
              id: "b",
              text: "To match the latency of the payment processing system",
              isCorrect: false,
            },
            {
              id: "c",
              text: "To synchronize inventory across all DCs in real time",
              isCorrect: false,
            },
            {
              id: "d",
              text: "To ensure orders are processed before inventory changes",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Haversine formula limitation",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the primary limitation of using the Haversine formula to determine which DCs can deliver within 1 hour?",
        explanation:
          'The Haversine formula calculates great-circle distance between two points on a sphere. It gives "as the crow flies" distance but ignores real-world obstacles: roads, rivers, bridges, traffic, and terrain. A DC 5 miles away across a river might require a 30-minute drive via bridge. For delivery time estimation, actual drive time with traffic is what matters, not geodesic distance.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It calculates straight-line distance and ignores roads, traffic, and terrain",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It only works for distances under 10 miles",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It cannot handle coordinates in the Southern Hemisphere",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It requires a distributed database to compute efficiently",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why single Postgres transaction over distributed lock",
      type: "question",
      sectionId: "sec_q_ordering",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "For GoPuff's order placement, why is a single Postgres SERIALIZABLE transaction preferred over two data stores with a distributed lock?",
        explanation:
          "The distributed lock approach has dangerous failure modes: if the service crashes between creating the order and decrementing inventory, the system is left in an inconsistent state. Deadlocks can occur when two orders lock overlapping inventory in different orders. A single SERIALIZABLE transaction in Postgres leverages ACID guarantees — the entire operation either succeeds or rolls back atomically, eliminating these failure modes entirely. The trade-off is coupling orders and inventory in one database.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "It allows using different data stores for orders and inventory",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It provides lower write latency than any distributed lock",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It eliminates the need for read replicas entirely",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It eliminates failure modes like crash-induced inconsistency and deadlocks by using ACID atomicity",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Cache invalidation on order placement",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When a Redis cache is added in front of the inventory database for availability queries, what must the Order Service do when an order is placed?",
        explanation:
          "When an order decrements inventory, the cached availability data becomes stale. If the Order Service does not invalidate affected cache entries, subsequent availability queries may show items that are no longer in stock. The TTL provides a safety net (data refreshes within 1 minute), but explicit invalidation on writes prevents serving known-stale data. Simply relying on TTL alone creates a window where users see phantom inventory.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Flush the entire Redis cache to guarantee consistency",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Invalidate (expire) the affected cache entries so availability reflects updated inventory",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Write the new inventory count directly to Redis, bypassing Postgres",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Nothing — the 1-minute TTL will handle eventual consistency automatically",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Region-based partitioning benefit",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "GoPuff partitions its inventory table by region ID (first 3 digits of zip code). What is the primary benefit of this partitioning strategy?",
        explanation:
          "Since availability queries are always scoped to nearby DCs (within a geographic region), partitioning by region ensures each query touches only 1-2 partitions rather than scanning the entire inventory table. This dramatically reduces I/O and query time. The partition key aligns with the access pattern — queries naturally filter by geographic proximity, making region-based partitioning ideal. Random partitioning (e.g., by item ID) would scatter geographically-related data across all partitions.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "It eliminates the need for caching since partitioned reads are always fast enough",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Queries hit only 1-2 partitions because availability is always scoped to nearby DCs",
              isCorrect: true,
            },
            {
              id: "c",
              text: "It ensures every partition has exactly equal data volume",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It enables the system to use a different database engine per region",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Distributed lock deadlock scenario",
      type: "question",
      sectionId: "sec_q_ordering",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'In the "two data stores with distributed lock" approach, User1 orders items A and B, while User2 simultaneously orders items B and A. User1 acquires the lock on A, User2 acquires the lock on B. What happens next and what is this called?',
        explanation:
          "This is a classic deadlock: User1 holds lock A and needs lock B, while User2 holds lock B and needs lock A. Neither can proceed. The system is stuck until a timeout or external intervention releases the locks. This is one of the key reasons the single Postgres transaction approach is preferred — SERIALIZABLE transactions in Postgres use Serializable Snapshot Isolation (SSI) which detects and resolves serialization conflicts by aborting one transaction, avoiding deadlocks.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Deadlock — neither user can proceed because each holds a lock the other needs",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Livelock — both users repeatedly release and reacquire locks without progress",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Starvation — User2's order is permanently blocked while User1 completes",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Race condition — both orders succeed with double-booked inventory",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Separating catalog from inventory",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In a production GoPuff system, the product catalog is typically stored separately from inventory. What is the primary architectural reason for this separation?",
        explanation:
          "Catalog data (product names, descriptions, images) is read-heavy and rarely changes — ideal for Elasticsearch or a CDN-backed API. Inventory data changes frequently (orders, restocking) and requires strong consistency for writes. Co-locating them couples their scaling characteristics: you cannot scale catalog reads without also scaling the inventory database, and vice versa. Separating them allows each to use the optimal data store and scaling strategy for its access pattern.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "It allows the catalog to use eventual consistency while inventory uses strong consistency",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Postgres cannot store both product metadata and inventory counts in the same schema",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Different access patterns and workloads — catalog is read-heavy/static while inventory is write-heavy/dynamic",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Regulatory requirements mandate storing product data in a different jurisdiction",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4) ─────────────────────────────────────────────

    // MCAQ 1 — easy
    {
      title: "Components in availability query flow",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following components are involved in processing an availability query in the GoPuff system? Select ALL that apply.",
        explanation:
          "The availability query flow involves: (1) Availability Service receives the request, (2) Nearby Service determines which DCs are within delivery range, and (3) Inventory database (via read replicas) provides stock counts. The Order Service is only involved when placing orders, not querying availability. All three selected components work together within the 100ms latency budget.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Inventory database (read replicas)", isCorrect: true },
            { id: "b", text: "Nearby Service", isCorrect: true },
            { id: "c", text: "Order Service", isCorrect: false },
            { id: "d", text: "Availability Service", isCorrect: true },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Failure modes of distributed lock ordering",
      type: "question",
      sectionId: "sec_q_ordering",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "When using two separate data stores with distributed locks for order placement, which of the following are genuine failure modes? Select ALL that apply.",
        explanation:
          "Service crash between order creation and inventory update: the order exists but inventory was never decremented — the next user could order the same item. Deadlock with overlapping inventory: if two orders need the same items and acquire locks in different order, neither can proceed. These are the two primary failure modes cited. Cache staleness is a concern for the availability read path, not the order write path with locks.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Service crashes after creating order but before decrementing inventory",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Lock expiry before transaction completes under heavy load",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Cache invalidation failure causing stale reads",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Deadlock when two orders have overlapping inventory requirements",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Strategies for scaling availability reads",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Which strategies are effective for scaling availability reads to handle 20k queries/second in the GoPuff system? Select ALL that apply.",
        explanation:
          "Redis caching with short TTL absorbs the majority of repeated queries. Postgres read replicas distribute database load for cache misses. Region-based partitioning ensures queries only touch relevant data. Switching orders to eventual consistency would compromise the strong consistency requirement for order placement and does not help with read scaling.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "Postgres read replicas", isCorrect: true },
            {
              id: "b",
              text: "Switching the Order Service to use eventual consistency",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Partitioning inventory by region ID",
              isCorrect: true,
            },
            { id: "d", text: "Redis cache with short TTL (e.g., 1 minute)", isCorrect: true },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Advantages of Postgres SERIALIZABLE for orders",
      type: "question",
      sectionId: "sec_q_ordering",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are genuine advantages of using a single Postgres SERIALIZABLE transaction for order placement over a distributed lock approach? Select ALL that apply.",
        explanation:
          "ACID atomicity means the entire transaction succeeds or rolls back — no partial state. No distributed coordination eliminates network round-trips to a lock service. Deadlock handling is built into Postgres via SSI (Serializable Snapshot Isolation) which automatically aborts one conflicting transaction. However, horizontal write scaling is actually harder with a single database — this is a trade-off, not an advantage.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Easier to horizontally scale writes across multiple database nodes",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Built-in deadlock detection and resolution via SSI",
              isCorrect: true,
            },
            {
              id: "c",
              text: "No network round-trips to an external lock service",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Atomic rollback eliminates partial-failure inconsistency",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── Paragraph (6) ────────────────────────────────────────

    // Paragraph 1 — medium
    {
      title: "Design the availability query flow",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Walk through the complete flow of an availability query from the moment a user sends their location to when they receive a list of available items. Include all services involved and explain how each step contributes to meeting the <100ms latency requirement.",
        explanation:
          "A strong answer covers: (1) User sends lat/lng to Availability Service. (2) Availability Service calls Nearby Service with the coordinates. (3) Nearby Service checks in-memory DC list, prunes by 60-mile radius, optionally calls Travel Time API for the candidates, returns qualifying DC IDs. (4) Availability Service queries Redis cache with DC IDs. On cache hit, returns immediately. On cache miss, queries Postgres read replica joining Inventory and Item tables filtered by DC IDs. (5) Results are cached with 1-minute TTL and returned to user. Key latency optimizations: in-memory DC lookup (~1ms), Redis cache hit (~2ms), partitioned Postgres read replica (~10-20ms for cache miss), region-based partitioning ensures minimal data scanned.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Paragraph 2 — medium
    {
      title: "GoPuff vs Ticketmaster ordering approaches",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Compare and contrast the order placement approaches appropriate for GoPuff (convenience delivery) vs Ticketmaster (event tickets). Why is a single Postgres transaction "great" for GoPuff but not necessarily for Ticketmaster? Discuss the nature of the inventory in each case.',
        explanation:
          "A strong answer covers: GoPuff deals with fungible, mass-quantity items (e.g., 200 bags of Cheetos across DCs). The probability of going to zero between cart-add and checkout is low. A single Postgres transaction provides simplicity and ACID guarantees — if a rare stock-out occurs, the business can offer substitutions. Ticketmaster deals with scarce, uniquely identifiable resources (specific seats). A seat is binary: available(1) or not(0). The reservation period is long (minutes during checkout) and abandonment rates are high. Redis-based distributed locks with TTL are needed to hold seat reservations without permanently locking inventory. The key insight is that inventory characteristics (fungible vs unique, abundant vs scarce, short vs long hold times) drive architectural decisions.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Paragraph 3 — hard
    {
      title: "Saga pattern for order processing",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "If GoPuff needed to separate its Order and Inventory databases onto different hosts for independent scaling, describe how you would implement the Saga pattern to maintain consistency across the two services. Include compensation logic for failure scenarios.",
        explanation:
          'A strong answer covers: Step 1: ReserveInventory(itemId, dcId, quantity) — marks inventory as reserved. Step 2: CreateOrder(items, userId) with status "InProgress" and an expiry timestamp. Step 3: On success of both, update order status to "Confirmed". Compensation: If CreateOrder fails, call ReleaseInventory (must be idempotent — use a compensated_reservations table to track). If the Saga coordinator crashes mid-flow, a scheduled job queries orders stuck in "InProgress" past their expiry and triggers compensation. Idempotency for ReleaseInventory: check compensated_reservations table before modifying inventory. Trade-offs vs single transaction: supports independent database scaling but adds significant complexity (scheduler, compensation logic, idempotency requirements, eventual consistency window).',
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 4 — hard
    {
      title: "Designing the Nearby Service for accuracy",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the Nearby Service that determines which DCs can deliver within 1 hour. Explain the two-phase approach (distance pruning + travel time estimation), how DC data is kept current, and how you would handle the external Travel Time API being slow or unavailable.",
        explanation:
          "A strong answer covers: Phase 1 — Prune by radius: Sync DC coordinates into memory every ~5 minutes. On request, compute Haversine distance and filter to candidates within 60 miles (most optimistic 1-hour drive). This reduces 10k DCs to ~10-20 candidates. Phase 2 — Travel time: Call external Travel Time Estimation Service with candidate DCs and user location, filtering to those truly within 60-minute drive time. Fallback for API failures: degrade gracefully to distance-based results with a conservative radius (e.g., 30 miles instead of 60), log an alert, and serve potentially imprecise but usable results. Caching travel times: For repeated queries in the same area, cache travel time results with 5-10 minute TTL. Advanced: pre-compute a travel time matrix for DC pairs during off-peak hours.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 5 — hard
    {
      title: "Handling the entire order failing atomically",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "In the single Postgres transaction approach, if any item in a multi-item order is out of stock, the entire order fails. Discuss the trade-offs of this behavior, propose an alternative approach that allows partial fulfillment, and analyze the complexity it introduces.",
        explanation:
          'A strong answer covers: Current behavior: all-or-nothing is simpler and prevents nonsensical orders (e.g., device without battery). Trade-off: user frustration when a low-priority item blocks the entire order. Alternative — partial fulfillment: Modify the transaction to mark unavailable items as "out of stock" but proceed with available items. Requires: (1) UI to show partial order confirmation, (2) business logic for minimum viable order (shipping costs may not justify 1 item), (3) refund/credit for unavailable items, (4) the transaction becomes more complex with conditional logic. Further alternative — soft reservation: Reserve items in cart with short TTL, validate at checkout, offer substitutions for unavailable items. This is closest to real-world grocery delivery apps. Complexity: substitution logic, inventory holds without hard locks, timeout management.',
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 6 — hard
    {
      title: "Staff-level system evolution",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "As a Staff engineer, how would you evolve the GoPuff system from the interview design to production? Identify at least 3 areas that would need significant additional work and explain the architectural decisions you would make for each.",
        explanation:
          "A strong answer covers at least 3 of: (1) Search & Discovery: Add Elasticsearch for full-text search, faceted filtering, and relevance ranking on the catalog. Separate catalog service from inventory. (2) Event-Driven Architecture: Use Kafka/CDC for inventory change events → cache invalidation, analytics, alerting for low stock. Decouples services. (3) Multi-Region: Deploy services and databases across regions for latency and disaster recovery. Postgres with streaming replication across regions, region-aware routing. (4) Observability: Distributed tracing (OpenTelemetry) across Availability → Nearby → DB calls. p99 latency dashboards, inventory anomaly detection. (5) Rate Limiting & Abuse: Protect availability API from bots/scrapers. Token bucket or sliding window rate limiter. (6) Supply Chain Integration: Real-time inventory feeds from DCs, restocking prediction, demand forecasting feeding into the Nearby Service.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // ── Text (4) ─────────────────────────────────────────────

    // Text 1 — medium
    {
      title: "Transaction isolation level for orders",
      type: "question",
      sectionId: "sec_q_ordering",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What Postgres transaction isolation level is used for the GoPuff order placement transaction, and why is this level chosen over READ COMMITTED?",
        explanation:
          "SERIALIZABLE isolation level. It is chosen because order placement must prevent two users from purchasing the same physical inventory. READ COMMITTED allows non-repeatable reads — between checking inventory > 0 and decrementing it, another transaction could have already claimed that inventory. SERIALIZABLE ensures the transaction executes as if it were the only transaction running, using Serializable Snapshot Isolation (SSI) to detect and abort conflicting transactions.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Text 2 — medium
    {
      title: "Cache TTL rationale",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Why is a short TTL (e.g., 1 minute) chosen for the Redis cache in front of inventory lookups? What would go wrong with a TTL of 1 hour?",
        explanation:
          "A 1-minute TTL balances performance (high cache hit rate — inventory for a region changes slowly) with freshness (users see reasonably current stock). A 1-hour TTL would cause users to see items as available long after they have been sold out, leading to failed orders, user frustration, and wasted delivery attempts. Conversely, a TTL of 1 second would provide minimal caching benefit. The 1-minute sweet spot absorbs the 20k queries/second load while ensuring inventory accuracy within a tolerable window.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Text 3 — hard
    {
      title: "Candidate pruning radius justification",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "The Nearby Service uses a 60-mile radius to prune candidate DCs before calling the Travel Time API. Why 60 miles specifically, and what are the risks of setting this value too high or too low?",
        explanation:
          "60 miles represents the most optimistic distance drivable in 1 hour (roughly 60 mph on a highway with no traffic). Too low (e.g., 20 miles): eliminates DCs that could actually deliver within 1 hour via highway, reducing available inventory and user experience. Too high (e.g., 200 miles): sends too many candidates to the Travel Time API, increasing latency and cost (each API call has a price). The 60-mile value is a conservative upper bound — any DC beyond 60 miles cannot physically be reached in 1 hour even under ideal conditions, so it safely prunes without false negatives.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Text 4 — hard
    {
      title: "Read replica consistency trade-off",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Why is it acceptable to use Postgres read replicas (with potential replication lag) for availability queries, but NOT for order placement?",
        explanation:
          "Availability queries are informational — showing a quantity of 47 when the true count is 45 has minimal business impact. Users understand that displayed availability is approximate and may change by checkout. Order placement, however, must guarantee that the inventory exists before committing the purchase. Reading from a stale replica during order placement could show inventory > 0 when it has already been claimed, resulting in double-booking. Orders must read from and write to the Postgres leader within a SERIALIZABLE transaction to ensure consistency.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // ── Matching (3) ─────────────────────────────────────────

    // Matching 1 — easy
    {
      title: "Services to responsibilities",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each service in the GoPuff architecture to its primary responsibility.",
        explanation:
          "The Availability Service handles user-facing queries about what items are in stock nearby. The Nearby Service resolves geographic coordinates to a list of DCs within delivery range. The Order Service processes purchases using atomic transactions. Understanding service boundaries is fundamental to discussing the system's design.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          leftItems: [
            { id: "l1", text: "Availability Service" },
            { id: "l2", text: "Nearby Service" },
            { id: "l3", text: "Order Service" },
          ],
          rightItems: [
            { id: "r1", text: "Returns item stock counts from nearby DCs to users" },
            { id: "r2", text: "Resolves lat/lng to DCs within 1-hour delivery range" },
            { id: "r3", text: "Places orders via atomic SERIALIZABLE transactions" },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r1" },
            { leftId: "l2", rightId: "r2" },
            { leftId: "l3", rightId: "r3" },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Scaling techniques to what they address",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each scaling technique used in GoPuff to the specific problem it addresses.",
        explanation:
          "Redis caching absorbs the 20k queries/second read load by serving repeated queries from memory. Region-based partitioning ensures each availability query scans only relevant inventory data (1-2 partitions vs full table). Read replicas distribute database read load across multiple Postgres instances. In-memory DC sync eliminates database queries for DC lookup, which would otherwise add latency to every availability request.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          leftItems: [
            { id: "l1", text: "Redis cache with short TTL" },
            { id: "l2", text: "Region-based partitioning" },
            { id: "l3", text: "Postgres read replicas" },
            { id: "l4", text: "In-memory DC sync" },
          ],
          rightItems: [
            { id: "r1", text: "Absorb repeated inventory queries at 20k qps" },
            { id: "r2", text: "Ensure queries scan only geographically relevant data" },
            { id: "r3", text: "Distribute database read load across instances" },
            { id: "r4", text: "Eliminate DB round-trip for DC location lookup" },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r1" },
            { leftId: "l2", rightId: "r2" },
            { leftId: "l3", rightId: "r3" },
            { leftId: "l4", rightId: "r4" },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Nearby DC approach quality to characteristics",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each Nearby DC resolution approach to its defining characteristic.",
        explanation:
          "Simple SQL Distance uses Haversine/Euclidean math — fast but ignores real-world driving constraints. Travel Time against ALL DCs calls the external API for every DC — accurate but makes thousands of unnecessary API calls (10k DCs). Travel Time against nearby DCs first prunes by distance radius, then calls the API only for candidates — balances accuracy with efficiency. The pruning step is the key insight that makes this approach practical.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          leftItems: [
            { id: "l1", text: "Simple SQL Distance" },
            { id: "l2", text: "Travel Time against ALL DCs" },
            { id: "l3", text: "Travel Time against nearby DCs" },
          ],
          rightItems: [
            { id: "r1", text: "Fast but ignores roads, traffic, and terrain" },
            { id: "r2", text: "Accurate but makes thousands of unnecessary API calls" },
            { id: "r3", text: "Prunes by radius first, then uses API only for candidates" },
          ],
          correctPairs: [
            { leftId: "l1", rightId: "r1" },
            { leftId: "l2", rightId: "r2" },
            { leftId: "l3", rightId: "r3" },
          ],
        },
      },
    },

    // ── Fill-blanks (3) ──────────────────────────────────────

    // Fill-blanks 1 — easy
    {
      title: "ACID property for order atomicity",
      type: "question",
      sectionId: "sec_q_ordering",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "GoPuff uses a single Postgres transaction with _____ isolation level to ensure that checking inventory, creating the order, and updating inventory all happen _____.",
        explanation:
          'SERIALIZABLE isolation ensures the transaction behaves as if no other transactions were running concurrently. "Atomically" means all steps succeed together or all roll back together — there is no intermediate state where an order exists but inventory has not been decremented.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "blank1", correctAnswer: "SERIALIZABLE" },
            { id: "blank2", correctAnswer: "atomically" },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Availability read scaling pattern",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In GoPuff, availability queries use Postgres _____ for reads because slight staleness is acceptable, while orders use the Postgres _____ for writes because strong consistency is required.",
        explanation:
          "Read replicas receive asynchronous updates from the leader and may serve slightly stale data (replication lag). This is acceptable for availability queries where showing quantity 47 vs 45 has minimal impact. The leader is the single source of truth for writes — order transactions must go through the leader to maintain SERIALIZABLE guarantees and prevent double-booking.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "blank1", correctAnswer: "read replicas" },
            { id: "blank2", correctAnswer: "leader" },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Capacity estimation formula",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "To estimate availability query throughput: 10M orders/day ÷ 100k seconds/day × _____ pages per user ÷ _____ conversion rate = approximately 20k queries/second.",
        explanation:
          "Each purchasing user views approximately 10 pages (search results, homepage, product pages) before buying. Only about 5% (0.05) of users who view availability actually make a purchase — the rest are browsing. These multipliers convert the 10M orders/day into the much larger number of availability queries that drive the system's read load.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            { id: "blank1", correctAnswer: "10" },
            { id: "blank2", correctAnswer: "0.05" },
          ],
        },
      },
    },

    // ── Numerical (2) ────────────────────────────────────────

    // Numerical 1 — medium
    {
      title: "Availability queries per second",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "GoPuff processes 10 million orders per day. Assuming 100k seconds in a day, 10 page views per purchasing user, and a 5% purchase conversion rate, how many availability queries per second must the system handle?",
        explanation:
          "Calculation: (10,000,000 orders/day) ÷ (100,000 seconds/day) = 100 orders/second. Each ordering user views 10 pages, and only 5% of viewers order: 100 × 10 ÷ 0.05 = 20,000 queries/second. This back-of-envelope calculation reveals that availability reads dominate the system's traffic by 200:1 over orders, making read scaling the critical architectural challenge.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 20000,
          tolerance: 1000,
          unit: "queries/second",
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Candidate DCs after radius pruning",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "GoPuff has 10,000 DCs spread across the United States (approximately 3.8 million square miles). The Nearby Service prunes candidates using a 60-mile radius circle (area ≈ π × 60² ≈ 11,310 square miles). Assuming uniform DC distribution, approximately how many candidate DCs remain after radius pruning for a single query?",
        explanation:
          "DC density: 10,000 DCs ÷ 3,800,000 sq miles ≈ 0.00263 DCs per sq mile. Area of 60-mile radius circle: π × 60² ≈ 11,310 sq miles. Expected candidates: 11,310 × 0.00263 ≈ 29.7 ≈ 30 DCs. This shows the pruning step reduces the Travel Time API calls from 10,000 to roughly 30 — a 300x reduction. In practice, DC distribution is not uniform (concentrated in urban areas), so the number varies, but the order of magnitude demonstrates why pruning is essential.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 30,
          tolerance: 10,
          unit: "DCs",
        },
      },
    },

    // ── True-False (2 bonus) ─────────────────────────────────

    // True-False 1 — easy (replaces to hit 30 items)
    {
      title: "Read replica for orders",
      type: "question",
      sectionId: "sec_q_ordering",
      difficulty: "easy",
      payload: {
        questionType: "true-false",
        content:
          "In the GoPuff architecture, the Order Service can safely read inventory from a Postgres read replica when placing an order.",
        explanation:
          "False. Read replicas may have replication lag, meaning they could show inventory as available when it has already been claimed. Order placement requires strong consistency to prevent double-booking, so the Order Service must use the Postgres leader for both reads and writes within a SERIALIZABLE transaction.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          correctAnswer: false,
        },
      },
    },

    // True-False 2 — medium
    {
      title: "DC sync frequency rationale",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "medium",
      payload: {
        questionType: "true-false",
        content:
          "The Nearby Service syncs DC locations into memory every 5 minutes because Distribution Centers are physical buildings that change rarely, making frequent database queries unnecessary.",
        explanation:
          "True. DCs are physical warehouses — they are added or closed very infrequently (weeks/months apart). Syncing every 5 minutes is far more frequent than necessary for detecting changes, but keeps the in-memory data fresh enough. This eliminates a database query on every availability request, which would otherwise add latency and load to the database. The 5-minute interval provides a good balance between freshness and efficiency.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: true,
        },
      },
    },
  ],
};
