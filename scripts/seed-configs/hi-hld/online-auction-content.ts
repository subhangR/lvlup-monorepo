/**
 * Online Auction — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: bid consistency (OCC, row locking, caching), real-time updates (SSE, long polling),
 * fault tolerance (Kafka), scaling (sharding, pub/sub), and auction lifecycle management
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const onlineAuctionContent: StoryPointSeed = {
  title: "Design an Online Auction System",
  description:
    "Master the system design of an online auction platform — covering bid consistency with optimistic concurrency control, real-time bid broadcasting via SSE, fault tolerance with Kafka, and scaling to 10M concurrent auctions.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_architecture", title: "Architecture & Core Components", orderIndex: 1 },
    { id: "sec_q_consistency", title: "Bid Consistency & Concurrency Control", orderIndex: 2 },
    { id: "sec_q_fault_tolerance", title: "Fault Tolerance & Kafka", orderIndex: 3 },
    { id: "sec_q_realtime", title: "Real-Time Updates & Scaling", orderIndex: 4 },
    { id: "sec_q_tradeoffs", title: "Deep Dives & Design Tradeoffs", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Design
    {
      title: "Online Auction — Requirements & High-Level Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Online Auction — Requirements & High-Level Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is an Online Auction System?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "An online auction service lets users list items for sale while others compete to purchase them by placing increasingly higher bids until the auction ends, with the highest bidder winning the item. This problem tests your ability to handle bid contention, real-time updates, fault tolerance, and scaling — all critical skills for a Staff-level system design interview.",
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
                  "Users should be able to post an item for auction with a starting price and end date.",
                  "Users should be able to bid on an item. Bids are accepted only if they are higher than the current highest bid.",
                  "Users should be able to view an auction, including the current highest bid.",
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
                  "Strong consistency for bids: All users must see the same highest bid — no two bids can simultaneously be marked as the highest.",
                  "Fault tolerance and durability: We cannot drop any bids. A lost winning bid would be catastrophic for platform trust.",
                  "Real-time display: The current highest bid should update in real-time so users know what they are bidding against.",
                  "Scale: Support 10M concurrent auctions.",
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
                  "Auction: Starting price, end date, current max bid, and the item being auctioned.",
                  "Item: Name, description, and image of the item. Normalized separately from Auction for reuse (e.g., relisting unsold items).",
                  "Bid: Amount, user placing the bid, auction being bid on, and status (accepted/rejected).",
                  "User: A user who either starts an auction or places bids.",
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
                "// Create an auction\nPOST /auctions -> Auction & Item\n{\n    item: Item,\n    startDate: Date,\n    endDate: Date,\n    startingPrice: number\n}\n\n// Place a bid\nPOST /auctions/:auctionId/bids -> Bid\n{\n    amount: number\n}\n\n// View an auction\nGET /auctions/:auctionId -> Auction & Item",
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
                "The architecture separates into two services: an Auction Service (handles creation and viewing of auctions — basic CRUD) and a Bidding Service (handles bid placement, validation, and real-time broadcasting). Bidding is separated for three key reasons: (1) Independent scaling — bidding traffic is ~100x higher than auction creation. (2) Isolation of concerns — bidding has complex business logic around race conditions and real-time updates. (3) Performance optimization — the bidding service can be optimized specifically for high-throughput writes.",
            },
            {
              id: "b13",
              type: "heading",
              content: "Why a Separate Bids Table?",
              metadata: { level: 3 },
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                "Many candidates suggest storing just a maxBidPrice field on the Auction entity. While simpler, this violates a core principle: never destroy historical data. Without a complete bid history, you cannot audit the bidding process, investigate disputes, or analyze bidding patterns. When a user complains their bid was not recorded, you need the full audit trail to prove them right or wrong.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Deep Dives — Bid Consistency & Fault Tolerance
    {
      title: "Deep Dives — Bid Consistency & Fault Tolerance",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Bid Consistency & Fault Tolerance",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Ensuring Strong Consistency for Bids",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                'The core challenge: when multiple users bid simultaneously, race conditions can cause two bids to both be "accepted" as the highest. For example, if the current max is $10, User A bids $100, and User B bids $20 — without proper concurrency control, both could be accepted because User B read stale data showing $10 instead of $100.',
            },
            {
              id: "c3",
              type: "heading",
              content: "Bad: Row Locking on Bids Table",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "Using SELECT ... FOR UPDATE on all bid rows for an auction. Problems: (1) It doesn't actually prevent concurrent inserts — FOR UPDATE locks existing rows but doesn't block new inserts. (2) Performance degrades as bid count grows — you lock more rows per bid. (3) Long lock durations cause timeouts. Rule: lock as few rows as possible, for as short a duration as possible.",
            },
            {
              id: "c5",
              type: "heading",
              content: "Good: External Cache (Redis) for Max Bid",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "Cache the max bid in Redis. Use a Lua script for atomic compare-and-set: read current max, compare new bid, update if higher — all in one atomic operation (Redis is single-threaded). Challenge: you now have a consistency problem between Redis and the database. Options: (1) Accept Redis as source of truth during the auction, write to DB asynchronously. (2) Write to DB first, update cache second. (3) Optimistic concurrency with retry logic. The fundamental issue: there is no clean way to make Redis and a relational database transactionally consistent — Redis doesn't support two-phase commit.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Great: Max Bid Stored in Auction Row (OCC)",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Store max_bid directly on the Auction table row. Use Optimistic Concurrency Control (OCC): (1) Read the auction row and get current max_bid. (2) Validate the new bid is higher. (3) UPDATE auctions SET max_bid = :new_bid WHERE id = :auction_id AND max_bid = :original_max_bid. (4) If the update succeeds (rows affected = 1), insert the bid record. If it fails (rows affected = 0), retry from step 1. OCC is ideal because bid conflicts are relatively rare — most bids don't happen simultaneously on the same auction. This avoids locks entirely while maintaining consistency, at the cost of occasional retries.",
            },
            {
              id: "c9",
              type: "heading",
              content: "Fault Tolerance with Kafka",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                'Dropping a bid is a non-starter — telling a user they lost because their winning bid was "lost" would destroy platform trust. Introduce a durable message queue (Kafka) as the entry point for all bids. Benefits: (1) Durable storage — even if the Bid Service crashes, bids are safely stored in Kafka. (2) Buffering against load spikes — final minutes of popular auctions may see thousands of bids/second. The queue absorbs surges without dropping bids or crashing. (3) Ordering — partition by auctionId so all bids for the same auction are processed in order on the same partition.',
            },
            {
              id: "c11",
              type: "paragraph",
              content:
                'Flow: User submits bid → API Gateway writes to Kafka → Kafka acknowledges (user told "bid received") → Bid Service consumes from Kafka at its own pace → validates and writes to DB. If the Bid Service fails, the bid remains in Kafka for retry. Tradeoff: this adds 2-10ms latency, but the durability guarantee is worth it.',
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Real-Time Updates & Scaling
    {
      title: "Real-Time Updates & Scaling to 10M Auctions",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Real-Time Updates & Scaling to 10M Auctions",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Real-Time Bid Broadcasting",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "Users viewing an auction need to see the current highest bid in real-time. Without this, they bid based on stale data and get frustrated when their bid is rejected. Simple polling works but is wasteful — most polls return unchanged data.",
            },
            {
              id: "d3",
              type: "heading",
              content: "Good: Long Polling",
              metadata: { level: 3 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                'The client opens a connection that remains open until either the max bid changes or a timeout occurs (30-60 seconds). Server responds to all waiting requests when a new bid is accepted. Better than regular polling, but has challenges: server must maintain open connections for all watchers, "thundering herd" when all clients reconnect simultaneously after an update, and scaling requires coordination infrastructure across servers.',
            },
            {
              id: "d5",
              type: "heading",
              content: "Great: Server-Sent Events (SSE)",
              metadata: { level: 3 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "SSE establishes a unidirectional channel from server to client. The server pushes updated max bid values whenever they change through a persistent connection. More efficient than long polling — no reconnection overhead. Client implementation is trivial: new EventSource('/api/auctions/{id}/bid-stream'). Server maintains a map of active SSE connections per auction and broadcasts to all connections when a new bid is accepted. SSE is preferred over WebSockets here because communication is unidirectional (server→client) and SSE is lighter weight.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Scaling Challenge: Cross-Server SSE Coordination",
              metadata: { level: 3 },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "With multiple servers, User 1 on Server A and User 2 on Server B may both watch the same auction. When a bid arrives at Server A, Server B has no way to notify User 2. Solution: Pub/Sub (Redis Pub/Sub or Kafka). When Server A receives a new bid, it publishes to the pub/sub channel. All Bid Service instances subscribe and push updates to their connected clients if relevant.",
            },
            {
              id: "d9",
              type: "heading",
              content: "Scaling to 10M Concurrent Auctions",
              metadata: { level: 2 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "Throughput estimation: 10M auctions × 100 bids/auction over 7 days = 140M bids/day ≈ 1,400 bids/sec average. At 10x peak = ~15K bids/sec. Message queue: Kafka with partitioning by auctionId handles 15K writes/sec easily. Services: Bid Service and Auction Service are stateless — horizontally scale with auto-scaling. Database: 10M × 52 = 520M auctions/year. At 1KB/auction + 500B × 100 bids = 25TB/year of storage. Sharding by auction_id is needed for write throughput at 15K writes/sec.",
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
                "Staff candidates lead the conversation, proactively surfacing challenges. They discuss dynamic auction end times (extending auctions after late bids using delayed task schedulers), the nuance of eventual vs strong consistency (arguing that accepting all bids and reconciling later is valid if client-side rendering handles it), fraud prevention, Kafka partition strategy at 10M auctions, and cross-server SSE coordination via pub/sub — all without being prompted.",
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
      title: "Why separate Auction and Bidding services",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the primary reason for separating the Bidding Service from the Auction Service in an online auction system?",
        explanation:
          "Bidding traffic is typically ~100x higher than auction creation. A dedicated Bidding Service allows independent scaling of the write-heavy bidding infrastructure without over-provisioning the Auction Service. Isolation of concerns and performance optimization are secondary benefits.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "The Auction Service and Bidding Service use different programming languages",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Bidding traffic is ~100x higher than auction creation, requiring independent scaling",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Microservices are always better than monoliths for any application",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Separate services allow the system to use different databases per service, which is always required",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why maintain a bids table instead of just maxBidPrice",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why should you store individual bids in a separate bids table rather than just updating a maxBidPrice field on the Auction entity?",
        explanation:
          "A bids table preserves the complete history of all bids — essential for auditing disputes, detecting fraud, and analyzing bidding patterns. Overwriting maxBidPrice with each new bid permanently destroys historical data. When a user claims they placed a winning bid that was not recorded, you need the full audit trail.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A maxBidPrice field on the Auction entity cannot be indexed for fast lookups",
              isCorrect: false,
            },
            {
              id: "b",
              text: "A bids table provides better query performance than a single field on the Auction entity",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Relational databases require all data to be in separate tables for normalization",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A bids table preserves the full audit trail for dispute resolution, fraud detection, and bidding analysis",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "SSE vs WebSockets for bid updates",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is Server-Sent Events (SSE) arguably a better fit than WebSockets for broadcasting bid updates to users viewing an auction?",
        explanation:
          "Bid broadcasting is a server-to-client push only — users receive bid updates but do not send data through this channel (they place bids through the REST API). SSE is designed for unidirectional server→client communication and is lighter weight than WebSockets, which support full-duplex communication that is unnecessary here.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "SSE supports higher throughput than WebSockets for large messages",
              isCorrect: false,
            },
            {
              id: "b",
              text: "SSE provides built-in encryption that WebSockets lack",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Communication is unidirectional (server→client only), and SSE is lighter weight for this use case",
              isCorrect: true,
            },
            {
              id: "d",
              text: "WebSockets are not supported by modern browsers, while SSE is universally supported",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why row locking on bids table fails",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A candidate proposes using SELECT ... FOR UPDATE on all bid rows for an auction to ensure consistency. What is the most critical flaw in this approach?",
        explanation:
          "SELECT ... FOR UPDATE locks existing rows but does NOT prevent other transactions from inserting new rows. Two concurrent transactions could both read the same max bid, both pass the validation check, and both insert — exactly the race condition you're trying to prevent. Additionally, locking all bid rows degrades as the number of bids grows, but the correctness issue is the primary flaw.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Row locking prevents all other queries on the table, not just the locked rows",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The lock duration is limited to 1 second by the database engine, which is too short",
              isCorrect: false,
            },
            {
              id: "c",
              text: "FOR UPDATE is not supported by most relational databases",
              isCorrect: false,
            },
            {
              id: "d",
              text: "FOR UPDATE locks existing rows but doesn't block concurrent inserts, so two transactions can both insert winning bids",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Redis Lua script for atomic bid comparison",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When caching the max bid in Redis, why must you use a Lua script for the compare-and-set operation instead of Redis MULTI/EXEC?",
        explanation:
          "Redis MULTI/EXEC executes commands atomically but cannot read a value and conditionally write based on it within the same transaction — it queues all commands upfront. A Lua script runs on the Redis server as a single atomic operation and CAN read a value, perform conditional logic, and write — all without interruption. This is necessary for the compare-and-set pattern.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Lua scripts support distributed transactions across multiple Redis instances, while MULTI/EXEC does not",
              isCorrect: false,
            },
            {
              id: "b",
              text: "MULTI/EXEC queues commands upfront and cannot conditionally write based on a value read within the same transaction",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Lua scripts are faster than MULTI/EXEC because they bypass the Redis event loop",
              isCorrect: false,
            },
            {
              id: "d",
              text: "MULTI/EXEC does not guarantee atomicity — commands can be interleaved with other clients",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Kafka partition strategy for bid ordering",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content: "Why should the Kafka topic for bids be partitioned by auctionId?",
        explanation:
          "Kafka guarantees message ordering only within a single partition. By partitioning by auctionId, all bids for the same auction land on the same partition and are processed in order. This ensures fairness: if two users bid the same amount, the first bid wins. Bids for different auctions can be processed in parallel across partitions. Note: you use hash(auctionId) % N partitions, not one partition per auction.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Kafka guarantees ordering only within a partition — partitioning by auctionId ensures bids for the same auction are processed in order",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Partitioning by auctionId allows Kafka to compress bids for the same auction more efficiently",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Partitioning by auctionId ensures that each bid is stored on exactly three Kafka brokers for redundancy",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Kafka requires each auction to have its own dedicated partition for performance reasons",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "OCC vs pessimistic locking for auction bids",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "The recommended approach stores max_bid on the Auction row and uses Optimistic Concurrency Control (OCC): UPDATE auctions SET max_bid = :new_bid WHERE id = :auction_id AND max_bid = :original_max_bid. Why is OCC preferred over pessimistic locking (SELECT ... FOR UPDATE on the Auction row) for this system?",
        explanation:
          "OCC is preferred because bid conflicts are relatively rare — most bids don't happen simultaneously on the same auction. OCC avoids the overhead of acquiring and holding locks, which matters at 15K bids/sec. When a conflict does occur, the retry cost is low (just re-read and re-attempt the UPDATE). Pessimistic locking would serialize all bids on the same auction, creating unnecessary contention for the common non-conflict case.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Bid conflicts are rare, so OCC avoids unnecessary lock overhead for the common case while handling conflicts with cheap retries",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Pessimistic locking is not supported when using Kafka as a message queue upstream",
              isCorrect: false,
            },
            {
              id: "c",
              text: "OCC guarantees that no two transactions ever conflict, eliminating the need for retries entirely",
              isCorrect: false,
            },
            {
              id: "d",
              text: "OCC works with eventually consistent databases, while pessimistic locking requires strong consistency",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Cross-system consistency between Redis and database",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'When caching the max bid in Redis (the "good" approach), the core challenge is maintaining consistency between Redis and the database. What is the fundamental reason this is difficult?',
        explanation:
          'Redis does not support distributed transaction protocols like two-phase commit. There is no atomic way to ensure that a Redis update and a database write both succeed or both fail. If Redis is updated but the DB write fails, the cache shows a max bid that doesn\'t exist in the database. This is why the "great" solution moves max_bid into the Auction table itself — keeping everything in one system.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The database cannot read from Redis, so the two systems cannot communicate directly",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Redis doesn't support two-phase commit, so there's no atomic way to make Redis and the database transactionally consistent",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Redis is single-threaded, so it cannot handle concurrent updates from multiple Bid Service instances",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Redis data is stored in memory and is lost on restart, making it inherently inconsistent with persistent storage",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Core non-functional requirements for an online auction",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid non-functional requirements for a production online auction system:",
        explanation:
          "Strong bid consistency is essential — two bids cannot simultaneously be marked as highest. Fault tolerance/durability ensures no bids are ever lost. Real-time updates keep users informed. However, eventual consistency for auction creation is NOT a core NFR — auction creation is straightforward CRUD and does not have contention issues.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Real-time display of the current highest bid to all users viewing an auction",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Eventual consistency for auction creation to handle worldwide replication lag",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Fault tolerance — no bid can ever be dropped, even during system failures",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Strong consistency for bids to prevent two users from both believing they have the highest bid",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Benefits of Kafka for bid processing",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid benefits of introducing Kafka as a message queue for bid processing:",
        explanation:
          "Kafka provides durability (bids survive service crashes), buffering against load spikes (final auction minutes), and ordering within a partition (by auctionId). However, Kafka does NOT guarantee that bids are valid — it stores them for later processing by the Bid Service which performs validation. Invalid bids are still written to Kafka.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Load buffering — absorbs bid surges during popular auction endings without dropping messages",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Validation — Kafka ensures only bids higher than the current max are forwarded to the Bid Service",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Durability — bids are persisted to disk and survive Bid Service crashes",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Ordering — partitioning by auctionId ensures bids for the same auction are processed in order",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Challenges with long polling for bid updates",
      type: "question",
      sectionId: "sec_q_realtime",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content: "Select ALL valid challenges of using long polling for real-time bid updates:",
        explanation:
          "Long polling requires maintaining open connections (resource-intensive), creates thundering herd problems when all clients reconnect after an update, and scaling horizontally requires coordination across servers. However, long polling does NOT cause message loss — if a bid comes in during reconnection, the client picks it up on the next request. The issue is latency, not data loss.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Horizontal scaling requires coordination infrastructure (e.g., Redis) across servers",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Bids can be permanently lost if they arrive during the brief reconnection window",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Thundering herd — all clients reconnect simultaneously after receiving an update",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Server must maintain open connections for all clients watching an auction, consuming resources",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Staff-level considerations for auction design",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following topics distinguish a Staff-level answer from a Senior-level answer when designing an online auction system? Select ALL that apply.",
        explanation:
          "Staff candidates proactively discuss: (1) Dynamic auction end times and the distributed scheduling complexity they introduce (clock drift, concurrent termination, delayed task schedulers). (2) The valid argument that strong consistency might be unnecessary if client-side rendering handles eventual consistency properly. (3) Cross-server SSE coordination using pub/sub for real-time broadcasting at scale. However, implementing a blockchain for bid verification is over-engineering — the database provides sufficient integrity guarantees.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Implementing a blockchain-based bid ledger for immutable, decentralized bid verification",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Cross-server SSE coordination via pub/sub (Redis Pub/Sub or Kafka) for real-time bid broadcasting",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Dynamic auction end times using delayed task schedulers, handling clock drift and concurrent termination",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Arguing that eventual consistency is valid if client-side rendering handles bid reconciliation properly",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Compare three approaches to bid consistency",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare the three approaches to ensuring bid consistency: (1) Row locking on the bids table, (2) Caching the max bid in Redis, (3) Storing max bid on the Auction row with OCC. For each approach, explain the mechanism and its primary weakness.",
        explanation:
          "A strong answer explains: Row locking fails because FOR UPDATE doesn't prevent concurrent inserts and degrades with bid count growth. Redis caching works atomically (Lua scripts) but introduces cross-system consistency problems since Redis doesn't support 2PC. OCC on the Auction row is the best because it locks only one row for a short duration (or avoids locks entirely with the WHERE clause trick), keeping everything in one transactional system.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "1. Row locking on the bids table (Bad): Uses SELECT ... FOR UPDATE to lock all existing bid rows while checking the max. Mechanism: Begin transaction → lock all bids → query max → insert new bid → commit. Primary weakness: FOR UPDATE only locks existing rows — it cannot prevent concurrent INSERT operations. Two transactions can both read the same max, both pass the check, and both insert. Additionally, locking all bid rows degrades as the auction grows, creating latency.\n\n2. Redis cache for max bid (Good): Caches the max bid in Redis and uses an atomic Lua script for compare-and-set. Mechanism: Read max from Redis → if new bid higher, atomically update Redis → write bid to DB. Primary weakness: Cross-system consistency. Redis doesn't support two-phase commit, so there's no atomic way to ensure both Redis and the database are updated. If the DB write fails after Redis updates, the cache is inconsistent.\n\n3. Max bid on Auction row with OCC (Great): Stores max_bid directly on the Auction table and uses optimistic concurrency. Mechanism: Read auction row → validate bid → UPDATE WHERE max_bid = :original_max_bid → retry on failure. Primary weakness: Retries under high contention — though bid conflicts are rare, a very popular auction ending could see many retries. This is the best approach because everything stays in one transactional system.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the race condition in concurrent bidding",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Walk through a concrete example of how a race condition occurs when two users bid on the same auction without proper concurrency control. Include specific dollar amounts and the sequence of reads/writes that leads to an inconsistent state.",
        explanation:
          "A strong answer provides a step-by-step timeline showing interleaved reads and writes: User A reads $10 max → User B reads $10 max (stale) → User A writes $100 (accepted) → User B writes $20 (incorrectly accepted because it compared against stale $10). The result is two users both believing they have the highest bid.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Example: The current highest bid for Auction #42 is $10.\n\n1. User A reads the current max bid: $10\n2. User A submits a bid of $100. The system compares $100 > $10 → accepts the bid. Max bid is now $100.\n3. User B reads the current max bid. Due to a delay (stale read, slow replication, or network lag), User B still sees $10 instead of $100.\n4. User B submits a bid of $20. The system compares $20 > $10 (stale value) → incorrectly accepts the bid.\n\nResult: Both bids are marked as "accepted." User A thinks their $100 bid is winning. User B thinks their $20 bid is winning. The auction now has two users who believe they have the highest bid.\n\nThe correct behavior: User B\'s bid should have been compared against $100 (the updated max) and rejected. This requires either: (a) locking to serialize the read-check-write cycle, (b) atomic compare-and-set in a cache, or (c) optimistic concurrency control on the auction row.',
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the complete bid placement flow with Kafka and OCC",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the end-to-end flow when a user places a bid, from the client through Kafka, the Bid Service, and the database with OCC. Include what the user sees at each stage and how failures are handled at each point.",
        explanation:
          'A complete answer covers: Client → API Gateway → Kafka producer (ack to user: "bid received") → Kafka consumer (Bid Service) → Read auction row → OCC UPDATE → Insert bid record → SSE broadcast. Must handle: Kafka write failure (return error to user), Bid Service failure (message stays in Kafka for retry), OCC conflict (retry from read), and DB write failure (Kafka redelivery).',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Complete bid placement flow:\n\n1. Client → API Gateway: User clicks "Place Bid" for $150 on Auction #42. Request routed through API Gateway which handles authentication and rate limiting.\n\n2. API Gateway → Kafka Producer: The bid is immediately written to the Kafka topic, partitioned by auctionId. Kafka acknowledges the write.\n   - User sees: "Bid received" confirmation. This is fast (2-10ms) and guarantees durability.\n   - Failure: If Kafka write fails, return error to user — "Please try again." The bid is NOT lost because it was never persisted.\n\n3. Kafka → Bid Service Consumer: The Bid Service consumes the message at its own pace. If the Bid Service is down, the message remains in Kafka indefinitely and will be processed when the service recovers.\n\n4. Bid Service → Database (OCC):\n   a. Read the Auction row: SELECT id, max_bid FROM auctions WHERE id = 42 → max_bid = $100\n   b. Validate: $150 > $100 → bid is valid\n   c. Attempt OCC update: UPDATE auctions SET max_bid = 150 WHERE id = 42 AND max_bid = 100\n   d. If rows_affected = 1 (success): INSERT INTO bids (auction_id, user_id, amount, status) VALUES (42, user_id, 150, \'accepted\')\n   e. If rows_affected = 0 (conflict): Another bid was placed between our read and write. Retry from step (a) — re-read the new max and compare again.\n\n5. SSE Broadcast: After successful bid insertion, publish the new max bid to the pub/sub channel. All Bid Service instances receive it and push updates to their connected SSE clients watching Auction #42.\n   - User sees: Real-time update showing new highest bid of $150.\n\nFailure handling:\n- Bid Service crashes mid-processing: Kafka consumer offset was not committed, so the message is redelivered. The OCC check prevents double-processing.\n- Database down: Bid stays in Kafka. Bid Service retries with backoff until DB recovers.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Design dynamic auction end times",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Some auctions should end dynamically: the auction extends by one hour after each new bid, ending only when an hour passes with no bids. Design this feature, considering distributed systems challenges like clock drift, concurrent termination attempts, and interaction with the bidding system.",
        explanation:
          "A strong answer proposes: update the auction end time on each new bid (simple but imprecise with cron-based checking) or use a delayed task scheduler. Must address: clock drift across servers, concurrent termination (two servers both decide to end the same auction), and race between a late bid and the termination task.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Dynamic auction end times with \"extend by 1 hour after each bid\":\n\nSimple approach: Update auction.end_time = NOW() + 1 hour on each accepted bid. A cron job runs every minute scanning for auctions where end_time < NOW(). This is simple but imprecise — auctions may run up to 1 minute past their true end time.\n\nBetter approach — Delayed Task Scheduler:\n1. When a new bid is accepted, schedule a \"check auction end\" task to fire in 1 hour (using Redis sorted sets with timestamps, a database-backed job queue, or AWS Step Functions with a Wait state).\n2. When the task fires, check if this bid is still the latest. If yes → end the auction. If a newer bid exists → do nothing (a newer task was already scheduled).\n\nDistributed challenges:\n- Clock drift: Use a centralized time source (the database's NOW()) rather than server-local clocks for all end_time comparisons. Servers may have different local times, but the database timestamp is authoritative.\n- Concurrent termination: Two servers might both detect the auction has ended. Use OCC: UPDATE auctions SET status = 'ended' WHERE id = :id AND status = 'active'. Only one succeeds.\n- Race between late bid and termination: A bid arrives at the exact moment the termination task fires. The OCC pattern handles this naturally — if the bid updates max_bid first, the termination task's conditional update fails (status already changed or max_bid changed), and the new bid schedules a fresh termination task.\n\nImplementation detail: The scheduled task should be idempotent — if it runs twice, the second execution is a no-op because the auction is already ended.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Explain SSE scaling with pub/sub",
      type: "question",
      sectionId: "sec_q_realtime",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "When using Server-Sent Events for real-time bid updates, explain the scaling problem that arises with multiple servers and how pub/sub solves it. Include a concrete example with named servers and users.",
        explanation:
          "A complete answer shows: User 1 on Server A, User 2 on Server B, both watching Auction X. Bid arrives at Server A — without pub/sub, Server B has no way to notify User 2. With pub/sub: Server A publishes the new bid to a channel. Server B (subscribed) receives it and pushes to User 2. Must mention: Redis Pub/Sub or Kafka as the coordination layer.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The scaling problem:\nWith a single server, SSE is straightforward — the server maintains a map of auction → connected clients, and broadcasts new bids to all connections for that auction. But with multiple servers behind a load balancer, clients watching the same auction may be connected to different servers.\n\nConcrete example:\n- User Alice is connected to Server A watching Auction #42\n- User Bob is connected to Server B watching Auction #42\n- User Charlie places a bid on Auction #42 — the request is routed to Server A\n\nWithout pub/sub: Server A processes the bid and pushes the SSE update to Alice (connected to Server A). But Server A has no knowledge of Bob's connection on Server B. Bob never receives the update and sees stale data.\n\nWith pub/sub (e.g., Redis Pub/Sub):\n1. All Bid Service instances subscribe to a \"bid_updates\" channel in Redis\n2. When Server A processes Charlie's bid, it publishes {auctionId: 42, maxBid: $200} to the Redis channel\n3. Server B receives this message from Redis\n4. Server B checks its local SSE connection map — finds Bob is watching Auction #42\n5. Server B pushes the SSE event to Bob's connection\n6. Both Alice and Bob see the updated bid in real-time\n\nWhy Redis Pub/Sub: It's lightweight, supports fan-out to all subscribers, and the message format is small (just auctionId + new max bid). At 15K bids/sec, Redis Pub/Sub handles this throughput easily. Alternative: use a separate Kafka topic for bid broadcasts, which also provides durability if a server misses a message during restart.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Argue for eventual consistency over strong consistency",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Some Staff candidates argue that strong consistency for bids is unnecessary. Present this argument, explain how it simplifies the system, and describe what additional client-side and server-side mechanisms are needed to make it work. Then explain why most interviewers still expect a strong consistency solution.",
        explanation:
          'The argument: it doesn\'t matter if we temporarily accept multiple bids — the final outcome is the same. User A with $100 wins regardless of whether User B\'s $20 was "accepted" temporarily. Simplification: remove OCC/locking entirely. But requires: client-side rendering of "your bid may be outbid," server-side reconciliation process, and a waiting period before declaring winners. Interviewers prefer strong consistency because it tests the harder problem.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'The eventual consistency argument:\nStrong consistency for bids may be unnecessary. Consider: if User A bids $100 and User B bids $20, the final auction result is identical regardless of the order they\'re processed. User A wins with $100 either way. The only thing that matters is the final state, not intermediate states.\n\nSimplification: We can accept ALL bids without checking against the current max. The system simply records every bid and periodically (or lazily) determines the current highest. This eliminates: OCC retries, row locking, the max_bid field on the Auction row, and the entire concurrency control mechanism.\n\nAdditional mechanisms needed:\n- Client-side: Show "Your bid of $20 was received" instead of "You are the highest bidder." Update the display when newer bids arrive via SSE. Show "You\'ve been outbid" when a higher bid is confirmed.\n- Server-side: A reconciliation process that runs before declaring the auction winner — waits for eventual consistency to settle (e.g., processes all remaining Kafka messages for that auction), then computes the true max from the bids table.\n- Edge case: Two identical bid amounts — need a tiebreaker rule (e.g., earliest timestamp wins), which requires ordering guarantees.\n\nWhy interviewers still expect strong consistency:\n1. It tests the harder problem — concurrency control, OCC, and database-level consistency are core distributed systems skills\n2. The eventual consistency approach "dodges the complexity" — it\'s a valid architectural choice but doesn\'t demonstrate mastery of the underlying challenge\n3. Real auction platforms (eBay, Christie\'s) do enforce strong consistency because the user experience of "you won... actually you didn\'t" erodes trust',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "What does the OCC WHERE clause check",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'In the OCC-based bid update query "UPDATE auctions SET max_bid = :new_bid WHERE id = :auction_id AND max_bid = :original_max_bid", what does the AND max_bid = :original_max_bid condition accomplish?',
        explanation:
          'The condition ensures the update only succeeds if the max_bid hasn\'t changed since we read it. If another transaction updated max_bid between our read and write, this UPDATE affects 0 rows, telling us a conflict occurred and we need to retry. This is the "optimistic" check — we optimistically assume no conflict, and detect it at write time.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "It ensures the max_bid hasn't changed since we read it. If another bid was placed in between, the UPDATE affects 0 rows, signaling a conflict that requires a retry.",
          acceptableAnswers: [
            "conflict detection",
            "hasn't changed",
            "compare-and-set",
            "optimistic check",
            "0 rows",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Why partition Kafka by auctionId not userId",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In one sentence, explain why the Kafka bid topic should be partitioned by auctionId rather than userId.",
        explanation:
          "Partitioning by auctionId ensures all bids for the same auction land on the same partition, guaranteeing ordering for fairness. Partitioning by userId would scatter bids for the same auction across multiple partitions, losing ordering guarantees and requiring additional coordination to serialize bid processing per auction.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Partitioning by auctionId keeps all bids for the same auction on one partition, guaranteeing processing order for fairness; userId would scatter them.",
          acceptableAnswers: ["ordering", "same partition", "fairness", "guarantee order"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Redis vs database for max bid storage",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Explain in 1-2 sentences why storing the max bid on the Auction table row is superior to caching it in Redis, even though Redis is faster.",
        explanation:
          "Storing max_bid in the Auction row keeps everything in one transactional system, enabling atomic consistency via OCC. Redis caching introduces a cross-system consistency problem that's fundamentally unsolvable because Redis doesn't support distributed transactions (2PC). Speed matters less than correctness for the max bid — it's a low-volume operation (one read per bid).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "The Auction row keeps max bid in the same transactional system as the bids table, enabling atomic consistency via OCC. Redis introduces a cross-system consistency problem with no clean solution since it lacks 2PC support.",
          acceptableAnswers: [
            "same transactional system",
            "no two-phase commit",
            "cross-system consistency",
            "single system",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Kafka failure recovery for bids",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "If the Bid Service crashes while processing a bid from Kafka, what prevents the bid from being lost, and what prevents it from being processed twice?",
        explanation:
          "The bid is not lost because Kafka retains the message until the consumer commits its offset — since the Bid Service crashed before committing, the message is redelivered. Double-processing is prevented by the OCC check: the UPDATE ... WHERE max_bid = :original_max_bid is idempotent — if the bid was already applied, the WHERE clause fails and the retry is a no-op.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Lost prevention: Kafka retains the message until the consumer offset is committed. Double-processing prevention: OCC makes the update idempotent — replaying the same bid fails the WHERE max_bid check.",
          acceptableAnswers: [
            "offset not committed",
            "redelivered",
            "idempotent",
            "OCC prevents double",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match auction components to their responsibilities",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content:
          "Match each component in the online auction architecture to its primary responsibility:",
        explanation:
          "The API Gateway handles authentication, rate limiting, and routing. The Auction Service manages auction creation and viewing (CRUD). The Bidding Service handles bid validation, consistency enforcement, and real-time broadcasting. Kafka provides durable message storage for bid fault tolerance.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "API Gateway",
              right: "Authentication, rate limiting, and routing requests to services",
            },
            {
              id: "p2",
              left: "Auction Service",
              right: "Creating and viewing auctions (CRUD operations)",
            },
            {
              id: "p3",
              left: "Bidding Service",
              right: "Bid validation, OCC consistency, and real-time broadcasting",
            },
            { id: "p4", left: "Kafka", right: "Durable message storage ensuring no bids are lost" },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match bid consistency approaches to their weaknesses",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each bid consistency approach to its primary weakness:",
        explanation:
          "Row locking on bids doesn't prevent concurrent inserts (correctness flaw). External Redis cache creates cross-system consistency issues since Redis lacks 2PC. Max bid on Auction row with OCC requires retries under contention (acceptable tradeoff). Simple maxBidPrice field without history destroys audit data.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Row locking (SELECT ... FOR UPDATE on bids)",
              right: "Doesn't prevent concurrent inserts — race condition remains",
            },
            {
              id: "p2",
              left: "External Redis cache for max bid",
              right: "Cross-system consistency — Redis lacks two-phase commit",
            },
            {
              id: "p3",
              left: "OCC on Auction row (max_bid field)",
              right: "Requires retries under high contention (rare but possible)",
            },
            {
              id: "p4",
              left: "Simple maxBidPrice field (no bids table)",
              right: "Destroys historical data needed for auditing and disputes",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match real-time update approaches to their tradeoffs",
      type: "question",
      sectionId: "sec_q_realtime",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each real-time update approach to its key tradeoff in the context of an online auction:",
        explanation:
          "Regular polling is simple but wastes bandwidth and adds latency. Long polling reduces wasted requests but creates thundering herd problems. SSE is efficient for unidirectional push but requires pub/sub for multi-server coordination. WebSockets provide full-duplex but are heavier than needed since bid updates are server→client only.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Regular polling",
              right: "Wastes bandwidth — most requests return unchanged data",
            },
            {
              id: "p2",
              left: "Long polling",
              right: "Thundering herd when all clients reconnect after an update",
            },
            {
              id: "p3",
              left: "Server-Sent Events (SSE)",
              right: "Requires pub/sub infrastructure for multi-server coordination",
            },
            {
              id: "p4",
              left: "WebSockets",
              right: "Full-duplex overhead unnecessary for server→client-only bid updates",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Bidding traffic ratio",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Bidding traffic is approximately _____ times higher than auction creation traffic, which is the primary reason for separating them into independent services.",
        explanation:
          "Bidding traffic is approximately 100x higher than auction creation. For every auction created, there are roughly 100 bids placed over its lifetime. This asymmetry justifies separating the Bidding Service for independent scaling.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Bidding traffic is approximately {{blank1}} times higher than auction creation traffic, which is the primary reason for separating them into independent services.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "100",
              acceptableAnswers: ["100", "100x", "one hundred", "~100"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "OCC update mechanism",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Optimistic Concurrency Control works by reading the current max bid, then attempting an UPDATE with a _____ clause that checks the max bid hasn't changed. If the update affects _____ rows, a conflict occurred and the operation must retry.",
        explanation:
          "OCC uses a WHERE clause to conditionally update — the condition checks that the value hasn't changed since the read. If the UPDATE affects 0 rows, it means another transaction modified the value between our read and write, so we need to retry.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Optimistic Concurrency Control works by reading the current max bid, then attempting an UPDATE with a {{blank1}} clause that checks the max bid hasn't changed. If the update affects {{blank2}} rows, a conflict occurred and the operation must retry.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "WHERE",
              acceptableAnswers: ["WHERE", "where", "conditional WHERE"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "0",
              acceptableAnswers: ["0", "zero", "no"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "SSE communication direction",
      type: "question",
      sectionId: "sec_q_realtime",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "Server-Sent Events (SSE) provides a _____ channel from server to client, making it lighter weight than _____ which supports full-duplex communication. For bid broadcasting, the _____ direction is sufficient.",
        explanation:
          "SSE is unidirectional (server→client). WebSockets support full-duplex (bidirectional) communication. For bid broadcasting, only the server→client direction is needed — users receive bid updates passively and place bids through the REST API, not through the SSE channel.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "Server-Sent Events (SSE) provides a {{blank1}} channel from server to client, making it lighter weight than {{blank2}} which supports full-duplex communication. For bid broadcasting, the {{blank3}} direction is sufficient.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "unidirectional",
              acceptableAnswers: ["unidirectional", "one-way", "one way", "uni-directional"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "WebSockets",
              acceptableAnswers: ["WebSockets", "websockets", "WebSocket", "websocket", "WS"],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "server-to-client",
              acceptableAnswers: [
                "server-to-client",
                "server to client",
                "server→client",
                "server->client",
                "unidirectional",
              ],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Peak bid throughput estimation",
      type: "question",
      sectionId: "sec_q_realtime",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "With 10M concurrent auctions, each receiving ~100 bids over a 7-day lifetime, the average bid rate is ~1,400 bids/sec. If peak traffic is 10x the average, what is the peak bids per second the system must handle? (Answer as a whole number)",
        explanation:
          "Average: 10M × 100 bids / 7 days / 86,400 sec ≈ 1,653 bids/sec (rounded to ~1,400 in the problem). Peak at 10x = 1,400 × 10 = 14,000 ≈ 15,000 bids/sec. This peak throughput drives the need for Kafka buffering and database sharding — a single Postgres instance cannot handle 15K writes/sec.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 14000,
          tolerance: 2000,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Annual storage estimation for auctions and bids",
      type: "question",
      sectionId: "sec_q_realtime",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "If 10M auctions run concurrently and the average auction lasts 7 days, that gives ~520M auctions per year. Each auction is ~1KB, each bid is ~500 bytes, and each auction has ~100 bids. What is the total storage per year in terabytes? (1 TB = 10^12 bytes, round to nearest whole number)",
        explanation:
          "Auctions: 520M × 1KB = 520GB. Bids: 520M × 100 bids × 500B = 26TB. Total = 520GB + 26TB ≈ 26.5TB ≈ 27TB. This is substantial but manageable with sharding. Modern SSDs handle 100+ TB. The key insight is that this system is write-throughput bound, not storage bound.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 27,
          tolerance: 3,
        },
      },
    },
  ],
};
