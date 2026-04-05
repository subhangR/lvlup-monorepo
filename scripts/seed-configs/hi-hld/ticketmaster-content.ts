import { StoryPointSeed, ItemSeed } from "../subhang-content";

// ── Ticketmaster — HLD Interview Prep ──
// Source: HelloInterview — Ticketmaster breakdown by Evan King
// 3 rich materials + 28 practice questions

export const ticketmasterContent: StoryPointSeed = {
  title: "Ticketmaster",
  description:
    "Master the design of a ticket booking platform — from handling contention and double-booking prevention to scaling reads for millions of concurrent users and real-time seat map updates.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_architecture", title: "Architecture, API & Data Model", orderIndex: 1 },
    { id: "sec_q_reservation", title: "Ticket Reservation & Contention Handling", orderIndex: 2 },
    { id: "sec_q_booking_flow", title: "Booking Flow & Failure Modes", orderIndex: 3 },
    { id: "sec_q_search", title: "Search & Data Synchronization", orderIndex: 4 },
    { id: "sec_q_scaling", title: "Scaling, Real-Time Updates & Virtual Queue", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════

    // Material 1: Requirements, Entities, API, and High-Level Design
    {
      title: "Ticketmaster Fundamentals — Requirements to High-Level Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Ticketmaster Fundamentals — Requirements to High-Level Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Ticketmaster?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Ticketmaster is an online platform that allows users to purchase tickets for concerts, sports events, theater, and other live entertainment. The core system design challenge revolves around handling massive read traffic for event discovery, preventing double-bookings under extreme contention, and providing real-time seat availability updates during high-demand on-sales.",
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
                  "Users should be able to view events (details, venue, seat map with availability).",
                  "Users should be able to search for events (by keyword, date, location, performer).",
                  "Users should be able to book tickets to events (with no double-booking).",
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
                  "Prioritize availability for search and view; prioritize consistency for booking (no double-booking).",
                  "Scalable to handle 10 million users for a single popular event.",
                  "Low latency search (< 500ms).",
                  "Read-heavy system with ~100:1 read-to-write ratio.",
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
                  "Event — date, description, type, performer. Central point of information for each event.",
                  "User — the individual interacting with the system.",
                  "Performer — name, description, links. General enough to cover artists, teams, companies.",
                  "Venue — address, capacity, seat map (JSON structure defining sections, rows, seats with coordinates).",
                  "Ticket — eventId, seat details (section, row, number), price, status (available/reserved/sold). Created for each seat when an event is added.",
                  "Booking — userId, list of ticketIds, total price, status (in-progress/confirmed). Groups multiple tickets in a single purchase.",
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
                '// View event (returns event details + venue + performer + tickets for seat map)\nGET /events/:eventId -> Event & Venue & Performer & Ticket[]\n\n// Search events\nGET /events/search?keyword={keyword}&start={start_date}&end={end_date}&pageSize={page_size}&page={page_number} -> Event[]\n\n// Book tickets (evolves into reserve + confirm later)\nPOST /bookings/:eventId -> bookingId\n  { "ticketIds": string[], "paymentDetails": ... }',
              metadata: { language: "text" },
            },
            {
              id: "b11",
              type: "heading",
              content: "High-Level Design — View & Search",
              metadata: { level: 3 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "The high-level design uses a microservices architecture behind an API Gateway. The Event Service handles view requests, fetching event/venue/performer data from an Events DB (PostgreSQL). The Search Service handles search queries against the same database (later upgraded to Elasticsearch). A Booking Service handles ticket purchases, interfacing with both the database and a Payment Processor (Stripe). All services are stateless and horizontally scalable behind load balancers.",
            },
            {
              id: "b13",
              type: "heading",
              content: "High-Level Design — Booking Flow",
              metadata: { level: 3 },
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                'When booking, we need ACID transactions to prevent double-booking. PostgreSQL is chosen for its transaction support. The Booking Service checks ticket availability, updates status to "booked", and creates a booking record — all within a single transaction. A Payment Processor (Stripe) handles the financial side. If the transaction fails because another user booked the ticket concurrently, the server returns a failure response.',
            },
            {
              id: "b15",
              type: "quote",
              content:
                "\"You may notice multiple services share the same database. The 'database per service' rule is not hard-and-fast. Many of the world's largest companies share databases across services when data is tightly coupled and ACID transactions are needed. Weigh the tradeoffs instead of parroting architectural dogma.\" — Evan King, HelloInterview",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Ticket Reservation — Handling Contention
    {
      title: "Handling Contention — Ticket Reservation Deep Dive",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Handling Contention — Ticket Reservation Deep Dive",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "The Problem: User Experience During Checkout",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                'Without reservation, users can spend 5 minutes filling out payment details only to find the ticket was booked by someone else. The solution is to temporarily reserve (lock) tickets while a user is checking out, with automatic release if they abandon the process. This is the classic "contention" pattern that appears in many system design interviews.',
            },
            {
              id: "c3",
              type: "heading",
              content: "Bad Solution: Long-Running Database Locks",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "Using SELECT FOR UPDATE to hold a database lock for the entire checkout duration (5-10 minutes) is a bad approach. Database locks are designed for near-instant transactions, not minutes-long holds. Long-running locks strain database resources, increase contention and deadlock risk, and scale poorly under high load. Application crashes or network issues can leave locks in uncertain states.",
            },
            {
              id: "c5",
              type: "heading",
              content: "Good Solution: Status + Expiration with Cron",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                'Add a status field (available/reserved/booked) and expiration time to the Ticket table. When a user selects a ticket, set status to "reserved" with a timestamp. A cron job periodically queries for reserved tickets past their expiration and sets them back to "available". The downside: lag between actual expiry and cron execution means tickets may remain unavailable longer than necessary, especially problematic for popular events.',
            },
            {
              id: "c7",
              type: "heading",
              content: "Great Solution: Implicit Status with Expiration",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                'Instead of relying on a cron job, treat the ticket status as a computed value. A ticket is "available" if its status is AVAILABLE or if its status is RESERVED but the reservation has expired. Short transactions update the status and expiration. The check-and-reserve is atomic within a transaction: BEGIN → check if AVAILABLE or (RESERVED AND expired) → set RESERVED with expiration now+10min → COMMIT. Read operations filter on two values (slight overhead), mitigable with materialized views and compound indexes.',
            },
            {
              id: "c9",
              type: "heading",
              content: "Great Solution: Distributed Lock with TTL (Redis)",
              metadata: { level: 3 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                'Use Redis as a distributed lock with TTL. When a user selects a ticket, acquire a Redis lock using SET ticketId userId NX EX 600 (atomic, only one client succeeds). If the user completes purchase, release the lock and mark the ticket as "sold" in PostgreSQL. If the TTL expires, Redis auto-releases the lock. The Ticket table only needs two states: available and booked. Redis handles reservation state entirely.',
            },
            {
              id: "c11",
              type: "code",
              content:
                '// Booking flow with distributed lock:\n// 1. User selects seat → POST /bookings\n// 2. Booking Service acquires Redis lock: SET ticket:{id} user:{id} NX EX 600\n// 3. If lock acquired → create booking record (status: in-progress), return bookingId\n// 4. Client routes to payment page with 10-min countdown\n// 5. If user abandons → TTL expires → lock auto-released\n// 6. User completes payment → Stripe webhook fires\n// 7. Webhook: BEGIN TX → update ticket to "sold", booking to "confirmed" → COMMIT\n//    Release Redis lock manually\n\n// Multi-ticket booking:\n// Acquire locks sequentially per ticket\n// If any lock fails → release all acquired locks → return error\n// (Lua script can make multi-lock atomic if tickets hash to same Redis node)',
              metadata: { language: "text" },
            },
            {
              id: "c12",
              type: "heading",
              content: "Edge Cases and Failure Modes",
              metadata: { level: 3 },
            },
            {
              id: "c13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Redis failure: UX degrades (users may see errors after payment) but double-booking is still prevented by PostgreSQL OCC/row-level locking. This is an acceptable degradation.",
                  "TTL expiry during payment: If User A's lock expires at minute 10 but payment completes at minute 11, User B could grab the lock. The DB transaction will fail for one user (OCC). Issue automatic refund via Stripe. Set TTL generously and extend the lock when payment is initiated.",
                  'Read-path complexity: Event Service needs to show reserved seats as unavailable. Options: query Redis set event:{eventId}:reserved, or write-through "reserved" status to DB with periodic sweep.',
                  "Stripe webhook idempotency: Stripe retries failed webhooks, so the handler must be idempotent. Use bookingId as idempotency key and check booking status before updating.",
                ],
              },
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Scaling — Caching, Search, and Real-Time Updates
    {
      title: "Scaling Reads, Search, and Real-Time Updates",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Scaling Reads, Search, and Real-Time Updates",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Scaling Event Views for Millions of Users",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "Event pages get hammered when tickets go on sale — thousands of users refreshing the same page. The strategy combines caching, load balancing, and horizontal scaling. Event details, performer bios, and venue info change infrequently, making them ideal for aggressive caching with Redis or Memcached using a read-through strategy. Cache keys like eventId:eventObject serve frequently accessed data with minimal DB load.",
            },
            {
              id: "d3",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Cache Invalidation: DB triggers notify the caching system of changes. Long TTLs for static data (venue info), short TTLs for dynamic data (availability).",
                  "Load Balancing: Round Robin or Least Connections across horizontally scaled, stateless Event Service instances.",
                  "Horizontal Scaling: Event Service is stateless — add instances and load balance to meet demand.",
                ],
              },
            },
            {
              id: "d4",
              type: "heading",
              content: "Search: From SQL to Elasticsearch",
              metadata: { level: 3 },
            },
            {
              id: "d5",
              type: "paragraph",
              content:
                "Basic SQL search with LIKE '%keyword%' requires full table scans and is unacceptably slow at scale. The progression: (1) SQL indexes on frequently searched columns — faster but poor for partial string matches. (2) Full-text indexes (PostgreSQL tsvector + GIN indexes) — better for keyword search but limited. (3) Elasticsearch — the ideal solution. Elasticsearch uses inverted indexes for fast full-text search, supports fuzzy matching (handling typos like \"Tayler Swift\"), and handles high-volume traffic efficiently.",
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Data synchronization from PostgreSQL to Elasticsearch uses Change Data Capture (CDC) for real-time or near-real-time sync. Search result caching uses Elasticsearch's built-in shard-level query/request caches, plus Redis for frequently repeated queries, plus CDN edge caching for non-personalized results.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Real-Time Seat Map Updates",
              metadata: { level: 3 },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "During popular events, the seat map goes stale quickly. Users repeatedly click on seats that have already been booked. Server-Sent Events (SSE) push seat status updates to the client in real-time without page refreshes. SSE is unidirectional (server-to-client), which is sufficient since we only need to push updates. This works well for moderately popular events.",
            },
            {
              id: "d9",
              type: "heading",
              content: "Virtual Waiting Queue for Extremely Popular Events",
              metadata: { level: 3 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                'For "Taylor Swift"-level events, even SSE cannot provide a good experience — seats vanish instantly. The staff-level solution is a virtual waiting queue: users are placed in a queue before seeing the booking page. Backed by Redis sorted sets (timestamp-ordered), with SSE/WebSocket connections for position updates. Users are dequeued in batches, admitted to an Redis set (admitted:{eventId}) with TTL, and only admitted users can make reservation requests. This prevents system overload and provides a fair, manageable experience.',
            },
            {
              id: "d11",
              type: "quote",
              content:
                '"Sometimes the best solution is not technically more challenging. The mark of a senior/staff engineer is their ability to solve business problems by thinking outside the box of presumed constraints." — Evan King, HelloInterview',
            },
            {
              id: "d12",
              type: "heading",
              content: "Interview Level Expectations",
              metadata: { level: 3 },
            },
            {
              id: "d13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mid-level (E4): Clear API endpoints and data model. Functional HLD for viewing and booking. Solve double-booking with at least the status+cron approach. 80% breadth, 20% depth.",
                  "Senior (E5): Speed through initial HLD. Detailed discussion of Elasticsearch for search, distributed lock for reservation, and scaling strategies. 60% breadth, 40% depth.",
                  "Staff+ (E6+): Deep dive into 2-3 areas with innovative thinking. Virtual waiting queue, TTL edge cases, CDC pipeline design, capacity estimation. The interviewer should learn something new. 40% breadth, 60% depth.",
                ],
              },
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
      title: "Database choice for booking consistency",
      type: "question",
      sectionId: "sec_q_reservation",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When designing the booking service for a ticket platform, which database property is most critical to prevent double-booking of the same ticket?",
        explanation:
          "ACID transactions (specifically Atomicity and Isolation) ensure that concurrent booking attempts for the same ticket are serialized, preventing two users from purchasing the same seat. PostgreSQL, MySQL, and DynamoDB all support ACID transactions. Eventual consistency (offered by some NoSQL stores) would risk double-booking since concurrent reads could both see the ticket as available.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "High write throughput with eventual consistency",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Schema-less document storage for flexibility",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Built-in full-text search capabilities",
              isCorrect: false,
            },
            {
              id: "d",
              text: "ACID transaction support with proper isolation levels",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why not long-running database locks",
      type: "question",
      sectionId: "sec_q_reservation",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is using SELECT FOR UPDATE to hold a database lock for the entire 5-10 minute checkout process a bad approach for ticket reservation?",
        explanation:
          "Database locks are designed for near-instant operations (milliseconds to seconds). Holding a lock for minutes strains database connection pools, increases contention risk, and can cause deadlocks. Application crashes leave locks in uncertain states. While it technically prevents double-booking, it does not scale. The other options describe issues that are either not primary concerns or are incorrect.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "SELECT FOR UPDATE does not actually prevent concurrent reads of the same row",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Database locks cannot span multiple tables in a single transaction",
              isCorrect: false,
            },
            {
              id: "c",
              text: "PostgreSQL does not support row-level locking with SELECT FOR UPDATE",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Long-running locks strain database resources, risk deadlocks, and scale poorly under high concurrency",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Read-through cache strategy for event data",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Event details, performer bios, and venue information rarely change. Which caching strategy is most appropriate for serving this data under heavy read traffic?",
        explanation:
          "Read-through caching checks the cache first; on a miss, it reads from the database and populates the cache. This is ideal for read-heavy, infrequently-changing data like event details. Write-through updates the cache on every write (unnecessary overhead for rarely-changing data). Write-behind batches cache writes to DB (not relevant here). Cache-aside requires the application to manage cache population explicitly, adding complexity.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Read-through cache with long TTLs",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Write-through cache with short TTLs",
              isCorrect: false,
            },
            {
              id: "c",
              text: "No caching — rely on database read replicas only",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Write-behind cache with no TTL",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Redis SET NX EX atomicity for ticket locking",
      type: "question",
      sectionId: "sec_q_reservation",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The Ticketmaster booking service uses Redis SET ticket:{id} user:{id} NX EX 600 to reserve tickets. What does the NX flag guarantee in this context?",
        explanation:
          "NX (Not eXists) makes the SET operation succeed only if the key does not already exist. Combined with EX (expiry in seconds), this is atomic — only one client can successfully set the key. If two users try to reserve the same ticket simultaneously, exactly one will succeed and the other will get a nil response. This is the foundation of the distributed lock pattern.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The key is only set if it does not already exist, ensuring exactly one user can acquire the lock",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The key is added to a sorted set for FIFO queue ordering",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The SET operation is replicated to all Redis nodes before returning",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The key is set with a non-expiring TTL that must be manually released",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Elasticsearch vs SQL for event search",
      type: "question",
      sectionId: "sec_q_search",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Why is Elasticsearch preferred over standard SQL indexes for Ticketmaster's event search at scale?",
        explanation:
          "Elasticsearch uses inverted indexes that map every word to the documents containing it, enabling fast full-text search including fuzzy matching (e.g., \"Tayler\" → \"Taylor\"). Standard SQL indexes (B-tree) are efficient for exact matches and range queries but perform poorly with LIKE '%keyword%' which requires full table scans. PostgreSQL's tsvector/GIN indexes help but lack Elasticsearch's fuzzy matching, ranking, and horizontal scaling capabilities.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "SQL databases cannot create indexes on text columns at all",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Inverted indexes enable fast full-text search with fuzzy matching, unlike B-tree indexes which require full table scans for partial matches",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Elasticsearch provides stronger ACID guarantees than PostgreSQL for search operations",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Elasticsearch eliminates the need for a primary database since it can serve as the source of truth",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "SSE vs WebSocket for seat map updates",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "For pushing real-time seat availability updates to the client during an on-sale event, why is Server-Sent Events (SSE) a better fit than WebSocket?",
        explanation:
          "SSE is a unidirectional protocol (server → client), which perfectly matches the seat map update use case — the server pushes availability changes, and the client only needs to receive them. WebSocket provides bidirectional communication, which adds unnecessary complexity and resource overhead here. SSE also has built-in reconnection, uses standard HTTP (easier to cache/proxy), and is simpler to implement. WebSocket would be appropriate if the client needed to send frequent messages to the server.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "WebSocket cannot push data from server to client without a client request",
              isCorrect: false,
            },
            {
              id: "b",
              text: "SSE is unidirectional (server-to-client only), matching the one-way nature of seat updates, with simpler setup and built-in reconnection",
              isCorrect: true,
            },
            {
              id: "c",
              text: "SSE supports higher message throughput than WebSocket",
              isCorrect: false,
            },
            {
              id: "d",
              text: "SSE works over UDP which is faster than WebSocket's TCP connection",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "TTL expiry during payment race condition",
      type: "question",
      sectionId: "sec_q_booking_flow",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In the Redis distributed lock approach, User A reserves a ticket with a 10-minute TTL. At minute 10, the TTL expires. At minute 10:30, User B acquires the lock. At minute 11, User A's payment completes. What prevents a double-booking?",
        explanation:
          "The database transaction in the Stripe webhook handler uses Optimistic Concurrency Control (OCC) or row-level locking to update the ticket status. When User A's webhook fires, it checks the ticket status and attempts to set it to \"sold\" within a transaction. If User B has already committed their booking, User A's transaction will fail (the ticket is no longer in an available/reserved state). The system then issues an automatic refund to User A via Stripe. This is why the Redis lock is a performance optimization, not the sole consistency mechanism — PostgreSQL is the ultimate source of truth.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Stripe prevents charging two users for the same ticket through its built-in deduplication",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The PostgreSQL transaction with OCC/row-level locking ensures only one booking succeeds; the other gets an automatic refund",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The API Gateway deduplicates the requests based on the ticket ID",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Redis automatically extends the TTL when it detects an in-flight payment",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Virtual waiting queue admission control",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In the virtual waiting queue design for extremely popular events, why is it critical to verify user admission in the Booking Service (checking the admitted:{eventId} Redis set) rather than relying solely on the client being routed to the booking page?",
        explanation:
          "Without server-side admission verification, malicious users could bypass the queue entirely by directly calling the booking API endpoint. The admitted:{eventId} set with TTL in Redis serves as a server-side gate — every reservation request must verify the user's session ID exists in this set before proceeding. This prevents both queue-skipping and abuse from automated bots. Client-side routing is a UX convenience, not a security mechanism.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Redis sorted sets cannot maintain ordering without periodic verification",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Users could bypass the queue by directly calling the booking API, so server-side admission verification prevents queue-skipping and bot abuse",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The client-side queue position counter can become out of sync with the server",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The SSE connection automatically drops after 5 minutes, requiring re-admission",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4) ─────────────────────────────────────────────

    // MCAQ 1 — easy
    {
      title: "Components in the Ticketmaster high-level design",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL components that are part of the Ticketmaster high-level design:",
        explanation:
          "The design includes an API Gateway (routing, auth, rate limiting), Event Service (view events), Booking Service (reserve and purchase tickets), and a PostgreSQL Events DB (stores events, venues, performers, tickets, bookings). A GraphQL Federation Layer is not part of this design — the system uses REST endpoints.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "GraphQL Federation Layer", isCorrect: false },
            { id: "b", text: "Event Service", isCorrect: true },
            { id: "c", text: "API Gateway", isCorrect: true },
            { id: "d", text: "Booking Service", isCorrect: true },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid approaches to prevent double-booking",
      type: "question",
      sectionId: "sec_q_reservation",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid approaches to prevent double-booking of the same ticket in a Ticketmaster-style system:",
        explanation:
          'Database transactions with row-level locking (SELECT FOR UPDATE in short transactions) directly prevent concurrent modifications. Optimistic Concurrency Control (OCC) with version checks detects conflicts at commit time. Redis distributed locks with TTL prevent concurrent reservation attempts. All three are valid and complementary. Eventual consistency with last-writer-wins would allow double-booking since two users could both "win" the same ticket.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Optimistic Concurrency Control (OCC) with version column",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Database transactions with row-level locking",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Eventual consistency with last-writer-wins conflict resolution",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Redis distributed lock with TTL for reservation",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Strategies for scaling event search",
      type: "question",
      sectionId: "sec_q_search",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL strategies that improve search performance and reduce latency for a ticket platform:",
        explanation:
          "SQL indexes speed up queries on specific columns. Elasticsearch provides fast full-text search with inverted indexes. Redis/Memcached caching stores frequently repeated query results. All three are valid strategies discussed in the design. Sharding the search index by user ID makes no sense for event search since all users search the same events — you would shard by event attributes or time range instead.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Elasticsearch with inverted indexes and CDC sync",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Sharding the search index by user ID",
              isCorrect: false,
            },
            {
              id: "c",
              text: "SQL indexes on frequently searched columns",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Redis caching of repeated search query results",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Redis failure impact on the booking system",
      type: "question",
      sectionId: "sec_q_booking_flow",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "If the Redis instance used for distributed ticket locks goes down completely, select ALL consequences:",
        explanation:
          "Without Redis locks, users cannot acquire reservations, so the reservation flow breaks. However, PostgreSQL's OCC/row-locking still prevents double-booking at the database level — the distributed lock is a UX optimization, not the sole consistency mechanism. Users may fill out payment and then get an error if someone else booked first. The waiting queue (if backed by the same Redis) also fails. The Event Service's read path for event details is unaffected — it uses the database and its own cache layer.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Double-booking becomes possible since there is no consistency mechanism",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Users may get errors after completing payment if someone else booked the ticket first",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The virtual waiting queue stops functioning if backed by the same Redis",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Ticket reservation (locking) stops working, degrading user experience",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── PARAGRAPH (6) ────────────────────────────────────────

    // Paragraph 1 — medium
    {
      title: "Compare ticket reservation strategies",
      type: "question",
      sectionId: "sec_q_reservation",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare three approaches to ticket reservation: (1) long-running database locks, (2) status field + cron job, and (3) Redis distributed lock with TTL. For each, explain the approach and its key limitation.",
        explanation:
          "A strong answer covers all three with concrete trade-offs: DB locks are simple but strain resources and risk deadlocks at scale; status+cron avoids long locks but has delay between expiry and cleanup; Redis TTL is the best but adds infrastructure complexity and requires handling Redis failure gracefully.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Long-running database locks: Use SELECT FOR UPDATE to lock the ticket row for the entire checkout duration. Limitation: Database locks are designed for millisecond transactions, not minutes-long holds. Prolonged locks strain connection pools, increase deadlock risk, and create bottlenecks under high concurrency. Application crashes can leave locks in uncertain states.\n\nStatus field + cron job: Add status (available/reserved/booked) and expiration fields to the Ticket table. A cron job periodically scans for expired reservations and resets them to "available". Limitation: There is inherent delay between actual expiration and cron execution. For popular events, this means tickets remain unavailable longer than necessary, and if the cron fails, reservations are never released.\n\nRedis distributed lock with TTL: Use SET ticketId userId NX EX 600 for atomic lock acquisition. Redis auto-releases expired locks. Limitation: Adds Redis as infrastructure dependency. If Redis fails, reservation UX degrades (though PostgreSQL OCC still prevents double-booking). TTL can expire during payment processing, requiring refund logic. Read path needs additional Redis queries to show reserved seats.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the booking flow end-to-end",
      type: "question",
      sectionId: "sec_q_booking_flow",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Walk through the complete booking flow from when a user selects a seat to when the booking is confirmed. Include the role of Redis, PostgreSQL, and Stripe at each step.",
        explanation:
          "Answer should trace the full flow: seat selection → Redis lock → booking record creation → payment page → Stripe tokenization → PaymentIntent → webhook → DB transaction → confirmation. Should mention what happens on failure at each step.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Step 1 — Seat Selection: User clicks a seat on the interactive seat map, triggering POST /bookings with the ticketId.\n\nStep 2 — Lock Acquisition: The Booking Service executes SET ticket:{id} user:{id} NX EX 600 in Redis. If successful, the ticket is reserved for 10 minutes. If the lock fails (another user has it), return an error immediately.\n\nStep 3 — Booking Record: Create a new row in the Bookings table with status "in-progress". Return the bookingId to the client.\n\nStep 4 — Payment Page: The client routes to the checkout page with a 10-minute countdown. If the user abandons, the Redis TTL expires and the lock is auto-released.\n\nStep 5 — Payment Tokenization: The client uses Stripe.js to tokenize card details (our server never sees raw card numbers for PCI compliance). The client sends the payment token + bookingId to our server.\n\nStep 6 — Payment Processing: Our server creates a Stripe PaymentIntent with the bookingId in metadata. Stripe processes the payment.\n\nStep 7 — Webhook Confirmation: Stripe sends a webhook confirming payment success. The handler retrieves the bookingId from metadata, then executes a database transaction: update Ticket status to "sold", update Booking status to "confirmed". The Redis lock is manually released.\n\nStep 8 — The ticket is booked. The handler is idempotent (checks booking status before updating) to handle Stripe webhook retries safely.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the virtual waiting queue system",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a virtual waiting queue system for extremely popular events (e.g., Taylor Swift concert). Cover: (1) how users enter and are ordered in the queue, (2) how they are admitted to the booking page, (3) how you prevent queue-bypassing, and (4) how you communicate queue position to users.",
        explanation:
          "A staff-level answer should cover Redis sorted sets for queue ordering, SSE for real-time position updates, server-side admission verification via Redis admitted set, batch dequeuing strategy, and handling edge cases like connection drops and admitted user timeouts.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Queue Entry: When a user requests the booking page for a queue-enabled event, they are added to a Redis sorted set (queue:{eventId}) with their timestamp as the score. A persistent SSE connection is established for real-time updates.\n\nAdmission: A background process periodically dequeues N users from the front of the sorted set (ZPOPMIN). N is calibrated based on current booking throughput and available capacity. Dequeued users are added to an admitted:{eventId} Redis set with a TTL (e.g., 15 minutes). They receive an SSE event notifying them to proceed to the booking page.\n\nQueue-bypass Prevention: The Booking Service checks the admitted:{eventId} set before processing any reservation request. If the user's session ID is not in the set, the request is rejected with a 403. This is critical — client-side routing is a UX convenience, not a security mechanism. Automated bots or direct API calls cannot skip the queue.\n\nPosition Communication: Each user's SSE connection receives periodic updates: their current position (ZRANK), estimated wait time (position / admission rate), and the total queue size. When admitted, they receive a final \"proceed\" event with an admission token.\n\nEdge cases: If an SSE connection drops, the user retains their queue position (stored server-side). Upon reconnection, they rejoin the SSE stream at their existing position. If an admitted user's TTL expires without booking, they must rejoin the queue.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "CDC pipeline for Elasticsearch sync",
      type: "question",
      sectionId: "sec_q_search",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain how you would implement a Change Data Capture (CDC) pipeline to keep Elasticsearch synchronized with the PostgreSQL Events database. Address: (1) how changes are captured, (2) how they are delivered to Elasticsearch, (3) how you handle failures, and (4) what consistency guarantees you can provide.",
        explanation:
          "Should cover WAL-based CDC (e.g., Debezium + Kafka), event-driven indexing in Elasticsearch, at-least-once delivery semantics, idempotent index operations, and eventual consistency trade-offs. Should mention lag monitoring and backfill strategies.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Change Capture: Use a WAL-based CDC tool like Debezium connected to PostgreSQL's logical replication slot. Debezium reads the write-ahead log and converts each INSERT, UPDATE, DELETE into a change event without impacting database performance (no triggers or polling).\n\nDelivery: Change events are published to Kafka topics (one per table or entity type). A consumer service reads from Kafka and applies changes to Elasticsearch indexes. Kafka provides ordering guarantees within a partition, so events for the same entity are processed in order.\n\nFailure Handling: Kafka provides at-least-once delivery — if the consumer crashes, it resumes from the last committed offset and reprocesses events. Elasticsearch index operations are idempotent (indexing the same document twice produces the same result). For transient Elasticsearch failures, the consumer retries with exponential backoff. Dead letter queues capture events that fail after max retries for manual investigation.\n\nConsistency Guarantees: The pipeline provides eventual consistency — there is a small lag (typically seconds) between a database change and its reflection in Elasticsearch. This is acceptable for search (users won't notice a few seconds of delay for new events). Monitor consumer lag metrics and alert if lag exceeds a threshold. For initial setup or schema changes, support full reindexing by reading directly from PostgreSQL.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Shared database vs database-per-service",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "The Ticketmaster design has multiple services (Event Service, Search Service, Booking Service) sharing the same PostgreSQL database. Argue for why this is the right choice here, and explain when you would split into separate databases.",
        explanation:
          "Should argue that shared DB is justified by tightly coupled data (bookings reference tickets reference events), ACID transaction needs across entities, and the added complexity of distributed transactions if split. Should identify when to split: when services need independent scaling, different data models, or when the shared DB becomes a bottleneck.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Why shared database is right here: The data is tightly coupled — bookings reference tickets, tickets reference events, events reference venues. A booking transaction must atomically check ticket availability and update both the Ticket and Booking tables. With separate databases, this would require distributed transactions (2PC or saga pattern), adding significant complexity, latency, and failure modes for no real benefit.\n\nThe services have overlapping read patterns: the Event Service reads events/venues/performers, the Booking Service reads and writes tickets/bookings that reference events, and the Search Service reads events for indexing. A shared schema with proper table ownership conventions keeps things simple.\n\nScaling is manageable: PostgreSQL supports read replicas for the read-heavy Event and Search services, while writes are concentrated in the Booking Service. Connection pooling (PgBouncer) manages concurrent connections from multiple services.\n\nWhen to split: (1) When a service needs a fundamentally different data model — Search already uses Elasticsearch, which is effectively a separate data store. (2) When a service needs independent scaling beyond what read replicas provide. (3) When team ownership boundaries require independent deployment and schema evolution. (4) When the shared database connection pool becomes a bottleneck despite pooling. (5) When regulatory requirements mandate data isolation (e.g., payment data in a separate PCI-compliant store).",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Staff-level answer structure for Ticketmaster",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You are in a Staff Engineer interview and asked to "Design Ticketmaster." Outline the structure of your answer: (1) how you would gather requirements, (2) what you would rush through, (3) where you would spend the most time, and (4) what deep dives would differentiate your answer.',
        explanation:
          "Should demonstrate interview awareness — rush through basic CRUD (view/search), spend time on contention handling (distributed lock), scaling (caching + Elasticsearch), and real-time updates (SSE + virtual queue). Should mention explicit prioritization and communication with interviewer.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Requirements (2-3 min): Confirm functional requirements (view events, search events, book tickets). Establish non-functional priorities explicitly: "We prioritize availability for reads but consistency for bookings." Clarify scale: 10M users for popular events, 100:1 read/write ratio. Mention out-of-scope items (dynamic pricing, admin tools) to show product thinking.\n\nRush through (3-5 min): Core entities (Event, Venue, Performer, Ticket, Booking) — a simple list. REST API endpoints — three standard endpoints. Basic HLD — Event Service, Search Service, Booking Service behind API Gateway, shared PostgreSQL database. Signal: "These are straightforward microservices — the interesting challenges are in the deep dives."\n\nDeep dives (20-25 min, MOST TIME HERE): This is where staff candidates differentiate.\n\n(a) Contention and Reservation (8 min): Walk through the progression from bad (long DB locks) → good (status+cron) → great (Redis distributed lock with TTL). Discuss the complete booking flow including Stripe webhook, idempotency, and the TTL-expiry-during-payment edge case. Explain why PostgreSQL OCC is the ultimate safety net.\n\n(b) Scaling Reads and Search (8 min): Caching strategy with Redis (read-through, TTL-based invalidation). Elasticsearch with CDC from PostgreSQL. Multi-layer caching: Elasticsearch query cache → Redis → CDN for non-personalized results.\n\n(c) Real-Time Updates and Virtual Queue (6 min): SSE for seat map updates. Virtual waiting queue with Redis sorted sets for extremely popular events. Server-side admission verification. This is the staff-level differentiator — recognizing that the technical solution (SSE) is insufficient for extreme scenarios and proposing a product-level solution (queue).\n\nThe key: demonstrate that your depth comes from experience, not memorization. Discuss failure modes you have encountered, trade-offs you have made, and why you chose one approach over another.',
          minLength: 250,
          maxLength: 4000,
        },
      },
    },

    // ── TEXT (4) ──────────────────────────────────────────────

    // Text 1 — medium
    {
      title: "Why separate Booking entity from Ticket",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Why is a separate Booking entity useful instead of folding booking data directly into the Ticket entity? Answer in one sentence.",
        explanation:
          "A separate Booking entity groups multiple tickets purchased in a single transaction under one order with shared payment status and total price, enabling multi-ticket purchases and unified order management.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "A separate Booking groups multiple tickets under a single order with shared payment status and total price, supporting multi-ticket purchases.",
          acceptableAnswers: [
            "It groups multiple tickets in one transaction",
            "Supports purchasing multiple tickets in a single order",
            "Tracks a single transaction across multiple tickets",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "What is implicit status in ticket reservation",
      type: "question",
      sectionId: "sec_q_reservation",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'In the "implicit status" reservation approach, how is a ticket considered "available" even if its status field says "reserved"? Answer in one sentence.',
        explanation:
          "A ticket is treated as available if its status is AVAILABLE or if its status is RESERVED but the reservation expiration timestamp has passed, eliminating the need for a cron job to explicitly release expired reservations.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "A reserved ticket is considered available if its reservation expiration timestamp has passed, making the status a computed value combining status field and current time.",
          acceptableAnswers: [
            "If the reservation has expired based on the expiration timestamp",
            "When the current time exceeds the reservation expiration",
            "Status is computed from both the status field and expiration time",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Why Stripe webhook must be idempotent",
      type: "question",
      sectionId: "sec_q_booking_flow",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Explain in one sentence why the Stripe webhook handler for booking confirmation must be idempotent.",
        explanation:
          "Stripe retries failed webhook deliveries, so the handler may receive the same payment confirmation event multiple times. Without idempotency (checking booking status before updating), duplicate processing could cause data corruption or double state transitions.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Stripe retries failed webhooks, so the handler may receive the same event multiple times — it must check booking status before updating to prevent duplicate state changes.",
          acceptableAnswers: [
            "Stripe retries webhooks on failure so the same event can arrive multiple times",
            "Webhook retries require idempotent handling to avoid duplicate processing",
            "Processing the same payment event twice without idempotency could corrupt booking state",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Why Redis lock failure does not cause double-booking",
      type: "question",
      sectionId: "sec_q_booking_flow",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "If the Redis distributed lock goes down entirely, explain in one sentence why double-booking is still prevented.",
        explanation:
          "PostgreSQL's ACID transactions with OCC or row-level locking serve as the ultimate consistency mechanism — even without Redis locks, the database transaction ensures only one booking succeeds for each ticket. Redis is a UX optimization, not the sole consistency guarantee.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "PostgreSQL's ACID transactions with OCC or row-level locking ensure only one booking succeeds per ticket — Redis is a UX optimization, not the sole consistency mechanism.",
          acceptableAnswers: [
            "The database transactions still prevent concurrent bookings",
            "PostgreSQL OCC ensures only one write succeeds per ticket",
            "ACID transactions in the database are the ultimate consistency guarantee",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── MATCHING (3) ─────────────────────────────────────────

    // Matching 1 — easy
    {
      title: "Match service to responsibility",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each service in the Ticketmaster design to its primary responsibility:",
        explanation:
          "The API Gateway handles routing, authentication, and rate limiting as the entry point. The Event Service fetches and returns event, venue, and performer data. The Booking Service manages ticket reservation, payment coordination, and booking confirmation. The Search Service handles parameterized queries for event discovery.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "API Gateway",
              right: "Routes requests, handles auth and rate limiting",
            },
            {
              id: "p2",
              left: "Event Service",
              right: "Fetches event, venue, and performer data for display",
            },
            {
              id: "p3",
              left: "Booking Service",
              right: "Manages ticket reservation and payment coordination",
            },
            {
              id: "p4",
              left: "Search Service",
              right: "Handles parameterized event discovery queries",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match reservation approach to key limitation",
      type: "question",
      sectionId: "sec_q_reservation",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each ticket reservation approach to its primary limitation:",
        explanation:
          "Long-running DB locks hold connections for minutes, straining the database. Status+cron has inherent delay between expiry and cleanup. Implicit status requires filtering on two values, adding read overhead. Redis distributed lock adds infrastructure dependency and read-path complexity for showing reserved seats.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Long-running database locks",
              right: "Strains connection pools, risks deadlocks at scale",
            },
            {
              id: "p2",
              left: "Status + cron job",
              right: "Delay between expiry and actual ticket release",
            },
            {
              id: "p3",
              left: "Implicit status with expiration",
              right: "Slower reads due to two-value filtering",
            },
            {
              id: "p4",
              left: "Redis distributed lock",
              right: "Additional infrastructure + read-path complexity",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match scaling strategy to the problem it solves",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each scaling strategy to the specific problem it addresses in the Ticketmaster system:",
        explanation:
          "Redis caching reduces repeated database load for static event data. Elasticsearch enables fast full-text search with fuzzy matching that SQL LIKE cannot provide at scale. SSE pushes seat availability changes to clients in real-time. The virtual waiting queue controls user flow during extreme demand, preventing system overload.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Redis caching with long TTLs",
              right: "Millions of users viewing the same event page simultaneously",
            },
            {
              id: "p2",
              left: "Elasticsearch with CDC",
              right: "Slow full-text search with LIKE '%keyword%' on SQL",
            },
            {
              id: "p3",
              left: "Server-Sent Events (SSE)",
              right: "Seat map showing stale availability data",
            },
            {
              id: "p4",
              left: "Virtual waiting queue",
              right: "System overload when 10M users rush to book at once",
            },
          ],
        },
      },
    },

    // ── FILL-BLANKS (3) ──────────────────────────────────────

    // Fill-blanks 1 — easy
    {
      title: "Redis atomic lock command",
      type: "question",
      sectionId: "sec_q_reservation",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "To acquire a distributed lock in Redis, the command SET key value _____ EX 600 ensures only one client can set the key.",
        explanation:
          "The NX flag (Not eXists) makes the SET command succeed only if the key does not already exist. Combined with EX (expiry in seconds), this creates an atomic lock acquisition — exactly one client will succeed, and the lock automatically expires after the TTL.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "To acquire a distributed lock in Redis, the command SET key value {{blank1}} EX 600 ensures only one client can set the key.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "NX",
              acceptableAnswers: ["NX", "nx"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Search engine for full-text queries",
      type: "question",
      sectionId: "sec_q_search",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "To replace slow SQL LIKE queries for event search, the Ticketmaster design introduces _____ which uses inverted indexes for fast full-text search.",
        explanation:
          "Elasticsearch is a search engine built on inverted indexes that map every word to the documents containing it. It excels at full-text search, fuzzy matching, and handling high-volume traffic — all critical for event search at scale.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "To replace slow SQL LIKE queries for event search, the Ticketmaster design introduces {{blank1}} which uses inverted indexes for fast full-text search.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Elasticsearch",
              acceptableAnswers: ["Elasticsearch", "elasticsearch", "elastic search", "ES"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Data sync mechanism for search",
      type: "question",
      sectionId: "sec_q_search",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "To keep Elasticsearch synchronized with PostgreSQL in real-time, the system uses _____ to capture database changes from the write-ahead log.",
        explanation:
          "Change Data Capture (CDC) reads the PostgreSQL write-ahead log (WAL) to detect inserts, updates, and deletes without impacting database performance. Tools like Debezium implement CDC and publish change events to message brokers like Kafka for downstream consumers.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "To keep Elasticsearch synchronized with PostgreSQL in real-time, the system uses {{blank1}} to capture database changes from the write-ahead log.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Change Data Capture",
              acceptableAnswers: [
                "Change Data Capture",
                "change data capture",
                "CDC",
                "cdc",
                "Debezium",
                "debezium",
              ],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── NUMERICAL (2) ────────────────────────────────────────

    // Numerical 1 — medium
    {
      title: "Tickets created for a new event",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "A venue has 4 sections with 50 rows each, and each row has 20 seats. When a new event is created at this venue, how many ticket records must be generated?",
        explanation:
          'Total tickets = sections × rows × seats = 4 × 50 × 20 = 4,000. Each ticket represents one seat and is created with status "available" when the event is added to the system. The seat map from the Venue entity defines the structure.',
        basePoints: 15,
        difficulty: "medium",
        questionData: { correctAnswer: 4000, tolerance: 0 },
      },
    },

    // Numerical 2 — hard
    {
      title: "Redis lock entries for a popular event",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A venue has 80,000 seats. During an on-sale, all seats sell out in 10 minutes. The Redis TTL for ticket locks is 10 minutes. Assume that on average each ticket is reserved 3 times before being purchased (due to abandoned checkouts). At peak, approximately what percentage of seats could have active Redis locks simultaneously? Express as a whole number.",
        explanation:
          "If all seats sell out in 10 minutes and the TTL is 10 minutes, at peak essentially all seats that have not yet been sold could have active locks (from current reservations). Since each ticket is reserved ~3 times on average, at any given moment during peak, nearly every unsold ticket has an active reservation. The peak occurs around the middle of the on-sale when ~50% of seats are sold and the remaining ~50% all have active reservations. At absolute peak (early in the sale), up to 100% of seats could have active locks since the TTL equals the total sale duration. The answer is approximately 100%.",
        basePoints: 25,
        difficulty: "hard",
        questionData: { correctAnswer: 100, tolerance: 10 },
      },
    },
  ],
};
