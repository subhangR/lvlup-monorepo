import { StoryPointSeed, ItemSeed } from "../subhang-content";

// ── Uber (Ride-Sharing Platform) — HLD Interview Prep ──
// Source: HelloInterview — Uber breakdown by Evan King
// 3 rich materials + 28 practice questions

export const uberContent: StoryPointSeed = {
  title: "Uber",
  description:
    "Master the design of a ride-sharing platform — from fare estimation and real-time driver matching to geospatial indexing, distributed locking, durable execution workflows, and geo-sharded scaling.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements, API & Architecture", orderIndex: 1 },
    { id: "sec_q_geospatial", title: "Geospatial Indexing & Location", orderIndex: 2 },
    { id: "sec_q_consistency", title: "Distributed Locking & Consistency", orderIndex: 3 },
    {
      id: "sec_q_reliability",
      title: "Queuing, Durable Execution & Fault Tolerance",
      orderIndex: 4,
    },
    { id: "sec_q_scaling", title: "Scaling, Capacity & Surge Handling", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════

    // Material 1: Requirements, Entities, API Design, High-Level Architecture
    {
      title: "Uber System Design Fundamentals",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Uber System Design Fundamentals",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Uber?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Uber is a ride-sharing platform that connects passengers with drivers who offer transportation services in personal vehicles. Users book rides on-demand from their smartphones, and the system matches them with a nearby available driver who takes them from pickup to destination.",
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
                  "Riders should be able to input a start location and destination to get a fare estimate.",
                  "Riders should be able to request a ride based on the estimated fare.",
                  "Upon request, riders should be matched with a nearby available driver.",
                  "Drivers should be able to accept/decline a request and navigate to pickup/drop-off.",
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
                  "Low latency matching — under 1 minute to match or failure.",
                  "Strong consistency in ride matching — no driver assigned multiple rides simultaneously.",
                  "High throughput during peak hours or special events (100k requests from the same location).",
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
                  "Rider: User who requests rides — personal information, payment methods.",
                  "Driver: Registered driver — personal details, vehicle information, availability status.",
                  "Fare: Estimated fare for a ride — pickup/destination locations, estimated price, ETA.",
                  "Ride: An individual ride from request to completion — rider, driver, status, route, actual fare, timestamps.",
                  "Location: Real-time driver location — latitude, longitude, timestamp of last update.",
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
                "// Get fare estimate\nPOST /fare -> Fare\nBody: { pickupLocation, destination }\n\n// Request a ride (confirm fare)\nPOST /rides -> Ride\nBody: { fareId }\n\n// Update driver location (driverId from JWT)\nPOST /drivers/location -> Success/Error\nBody: { lat, long }\n\n// Accept or decline ride request\nPATCH /rides/:rideId -> Ride\nBody: { accept/deny }",
              metadata: { language: "text" },
            },
            {
              id: "b11",
              type: "quote",
              content:
                '"Always consider the security implications of your API. User data should be passed in the session or JWT, timestamps should be generated by the server, and fare estimates should be retrieved from the database — never passed in by the client." — Evan King, HelloInterview',
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
                "The system is composed of several microservices behind an API Gateway: (1) Ride Service handles fare estimation and ride state management, interacting with a Third-Party Mapping API (e.g., Google Maps) for distance/time calculations. (2) Location Service receives real-time location updates from drivers and stores them for proximity queries. (3) Ride Matching Service receives ride requests and matches riders with the best available driver based on proximity, availability, and other factors. (4) Notification Service dispatches real-time push notifications to drivers via APNs/FCM when matched with a ride request.",
            },
            {
              id: "b14",
              type: "heading",
              content: "Ride Lifecycle Flow",
              metadata: { level: 3 },
            },
            {
              id: "b15",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Rider enters pickup/destination → Ride Service calls mapping API → creates Fare entity with price/ETA.",
                  'Rider confirms fare → POST /rides creates a Ride entity with status "requested" → triggers matching flow.',
                  "Ride Matching Service queries Location Service for nearby available drivers → ranks them → sends push notification to top driver.",
                  'Driver receives notification → accepts (ride status → "accepted") or declines (next driver notified).',
                  "Driver navigates to pickup using client GPS → picks up rider → navigates to destination → ride completed.",
                ],
              },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Deep Dives — Geospatial Indexing, Adaptive Updates, Distributed Locking
    {
      title: "Uber Deep Dives: Location, Matching & Consistency",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Uber Deep Dives: Location, Matching & Consistency",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Deep Dive 1: Geospatial Driver Location",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "With ~10 million drivers sending location updates every 5 seconds, we face ~2 million writes/second. Traditional databases (PostgreSQL, DynamoDB) cannot handle this volume cost-effectively, and proximity queries on raw lat/long require inefficient full table scans even with B-tree indexes.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Solution Evolution",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Bad: Direct database writes + proximity queries on raw data. Does not scale with millions of drivers. Full table scans for proximity searches.",
                  "Good: Batch processing + specialized geospatial database (e.g., PostGIS with quad-tree indexing). Reduces write volume but introduces staleness from batching interval.",
                  "Great: Redis with geospatial data types. GEOADD stores driver locations as geohash-encoded sorted set members. GEOSEARCH finds nearby drivers in a radius. Handles real-time writes, automatic overwrites (always latest position), and 2M writes/sec in-memory throughput.",
                ],
              },
            },
            {
              id: "c5",
              type: "paragraph",
              content:
                "Redis uses geohashing to encode latitude/longitude into a 52-bit integer score within a sorted set. Each GEOADD overwrites the previous location for a driver, so we always have the most recent position. For stale data cleanup, a companion sorted set keyed by timestamp periodically removes drivers whose last update exceeds a threshold (e.g., 30 seconds).",
            },
            {
              id: "c6",
              type: "heading",
              content: "Deep Dive 2: Adaptive Location Update Intervals",
              metadata: { level: 2 },
            },
            {
              id: "c7",
              type: "paragraph",
              content:
                "Fixed 5-second intervals create unnecessary load. The solution is adaptive updates using on-device sensors: stationary/slow drivers update less frequently; fast-moving drivers or those near pending requests update more frequently. This reduces write volume while maintaining accuracy where it matters most.",
            },
            {
              id: "c8",
              type: "quote",
              content:
                '"Don\'t neglect the client when thinking about your design. In many cases, we need client-side logic to improve the efficiency and scalability of our system." — Evan King, HelloInterview',
            },
            {
              id: "c9",
              type: "heading",
              content: "Deep Dive 3: Preventing Double-Assignment with Distributed Locks",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "Strong consistency in ride matching means: (1) only one driver is requested at a time per ride, and (2) each driver receives only one ride request at a time. The driver has 10 seconds to accept or decline before we move to the next.",
            },
            {
              id: "c11",
              type: "heading",
              content: "Locking Solution Evolution",
              metadata: { level: 3 },
            },
            {
              id: "c12",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Bad: Application-level locking — race conditions across instances, no coordination, locks lost on crash.",
                  "Good: Database status update with timeout — solves coordination but in-memory timeouts are lost if the service crashes, leaving locks stuck indefinitely.",
                  "Great: Distributed lock with TTL in Redis. Acquire lock on driverId with 10-second TTL. If driver accepts, release lock and update ride. If TTL expires, lock auto-releases and driver becomes available. Survives service crashes because TTL is managed by Redis.",
                ],
              },
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                "This is nearly identical to the Ticketmaster seat reservation problem — a resource (driver) must be temporarily locked for a single consumer (ride request) with automatic expiration if the consumer does not act.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Queueing, Durable Execution, Scaling
    {
      title: "Uber Deep Dives: Reliability & Scale",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Uber Deep Dives: Reliability & Scale",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Deep Dive 4: Preventing Dropped Ride Requests",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "During peak demand, synchronous processing drops requests. If a Ride Matching Service instance crashes, in-flight requests are lost. The solution is a distributed message queue (e.g., Kafka) placed between the Ride Service and Ride Matching Service.",
            },
            {
              id: "d3",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Ride requests are enqueued; Ride Matching Service consumes from the queue.",
                  "Kafka consumer offsets are committed only after successful matching — if a service instance crashes, the message is reprocessed by another instance.",
                  "Queue partitioning by geographic region improves efficiency and locality.",
                  "Dynamic scaling: auto-scale Ride Matching Service instances based on queue depth.",
                  "FIFO ordering can cause head-of-line blocking — consider priority queues for high-value or urgent requests.",
                ],
              },
            },
            {
              id: "d4",
              type: "heading",
              content: "Deep Dive 5: Driver Timeout Handling",
              metadata: { level: 2 },
            },
            {
              id: "d5",
              type: "paragraph",
              content:
                "When a driver does not respond within the 10-second window, the system must automatically try the next driver. This is a human-in-the-loop multi-step process — one of the canonical use cases for durable execution.",
            },
            {
              id: "d6",
              type: "heading",
              content: "Approach: Durable Execution (Temporal)",
              metadata: { level: 3 },
            },
            {
              id: "d7",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Send ride request to the first driver in the ranked list.",
                  "Set a 10-second timeout via the workflow framework.",
                  "If driver accepts → complete the workflow.",
                  "If driver declines or times out → automatically move to the next driver.",
                  "Continue until a driver is found or all candidates are exhausted.",
                ],
              },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "Durable execution frameworks (Temporal, AWS Step Functions, Cadence — which Uber originally created) maintain workflow state persistently. Even if the service crashes, the workflow resumes from where it left off. This eliminates dropped requests, handles retries, and simplifies complex multi-step business logic. The alternative — delay queues — works but requires manual coordination between the queue and matching service to avoid race conditions.",
            },
            {
              id: "d9",
              type: "heading",
              content: "Deep Dive 6: Geo-Sharding for Global Scale",
              metadata: { level: 2 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "To reduce latency and increase throughput globally, the entire system is geo-sharded: services, message queues, Redis instances, and databases are all partitioned by geographic region. This reduces the distance between client and server, improving latency. The only cross-shard queries needed are proximity searches at region boundaries.",
            },
            {
              id: "d11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Each region runs an independent stack: Ride Service, Matching Service, Location Service, Redis, and Kafka.",
                  "Read replicas within each region serve read-heavy queries locally.",
                  "Boundary rides (pickup near a region edge) may require scatter-gather across adjacent shards.",
                  "Consistent hashing distributes data within each regional shard.",
                ],
              },
            },
            {
              id: "d12",
              type: "heading",
              content: "What is Expected at Each Level?",
              metadata: { level: 2 },
            },
            {
              id: "d13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Mid-level (E4): Clear API endpoints, functional high-level design, awareness that some spatial index is needed, at least a "good solution" for the locking problem.',
                  "Senior (E5): Speed through HLD to spend time on 2+ deep dives in detail — geospatial indexing, locking, or queueing. Articulate trade-offs clearly.",
                  "Staff+ (E6+): 3+ deep dives with innovative solutions, operational awareness (monitoring, failure recovery, deployment), and insights that teach the interviewer something new.",
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
      title: "Why POST for fare estimation endpoint",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In the Uber system design, why is the fare estimation endpoint designed as POST /fare rather than GET /fare?",
        explanation:
          "The fare estimation endpoint creates a new Fare entity in the database (with price, ETA, pickup/destination details). Since it creates a resource, POST is the correct HTTP method. GET is for retrieving existing resources without side effects. PUT replaces an existing resource. PATCH partially updates an existing resource.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "GET requests cannot include a request body in HTTP",
              isCorrect: false,
            },
            {
              id: "b",
              text: "POST provides better caching behavior for fare estimates",
              isCorrect: false,
            },
            {
              id: "c",
              text: "POST is always faster than GET for complex calculations",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It creates a new Fare entity in the database, making POST the semantically correct method",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why driverId is not in the request body",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When a driver updates their location via POST /drivers/location, the driverId is NOT included in the request body or URL. Why?",
        explanation:
          "The driverId is extracted from the session cookie or JWT token that accompanies the request. Including it in the body or URL params would be a security vulnerability — a malicious client could spoof another driver's ID and send fake location updates. Server-side extraction from authenticated sessions prevents this.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "The driverId is extracted from the JWT/session token to prevent client-side spoofing",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The driverId is sent as a custom HTTP header instead",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The server already knows every driver's ID from a cached lookup table",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Including the driverId would make the request body too large",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Why B-tree indexes fail for proximity search",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why are traditional B-tree indexes on latitude/longitude columns insufficient for finding nearby drivers efficiently?",
        explanation:
          "B-tree indexes are optimized for one-dimensional range queries. Proximity searches require filtering on two dimensions simultaneously (latitude AND longitude within a radius). A B-tree can efficiently filter one dimension but still requires scanning all matching rows in the other dimension. Specialized geospatial data structures like quad-trees or geohashes are designed for multi-dimensional proximity queries.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "B-trees cannot store floating-point values like latitude and longitude",
              isCorrect: false,
            },
            {
              id: "b",
              text: "B-trees are too slow for any read query on large datasets",
              isCorrect: false,
            },
            {
              id: "c",
              text: "B-trees are one-dimensional and cannot efficiently query two-dimensional geospatial data",
              isCorrect: true,
            },
            {
              id: "d",
              text: "B-trees require the data to be sorted alphabetically, not numerically",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Redis geospatial encoding technique",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "How does Redis store driver locations internally when using its geospatial data type?",
        explanation:
          "Redis encodes latitude/longitude as a 52-bit geohash integer and stores it as the score in a sorted set (ZSET), with the driverId as the member. This enables efficient range queries using the sorted set's ordered structure. GEOADD, GEOSEARCH, and other geo commands operate on this sorted set. It does not use a separate spatial index or R-tree — the sorted set IS the index.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "As hash fields with separate latitude and longitude entries",
              isCorrect: false,
            },
            {
              id: "b",
              text: "In a dedicated R-tree spatial index structure",
              isCorrect: false,
            },
            {
              id: "c",
              text: "As geohash-encoded 52-bit integer scores in a sorted set (ZSET)",
              isCorrect: true,
            },
            {
              id: "d",
              text: "As key-value pairs where the key is the driverId and value is a lat/long tuple",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Why distributed lock over database lock for driver assignment",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "For preventing double-assignment of drivers, why is a Redis distributed lock with TTL preferred over a database status update with an application-level timeout?",
        explanation:
          "The fundamental issue with application-level timeouts is that they are stored in the process memory of the Ride Matching Service. If that service instance crashes, the timeout is lost and the driver remains locked indefinitely. Redis TTL is managed by Redis itself — the lock expires automatically regardless of whether the service that created it is still running. This makes the system self-healing.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Redis is always faster than any database for write operations",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Database locks require schema changes that are difficult to deploy",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Distributed locks support optimistic concurrency control while database locks do not",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Redis TTL auto-expires the lock even if the service that created it crashes, preventing stuck locks",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Kafka offset commit strategy for ride matching",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In the ride matching queue, Kafka consumer offsets are committed only after a match is successfully found. What does this guarantee?",
        explanation:
          "By committing the offset only after successful processing, if the Ride Matching Service crashes mid-matching, the message remains uncommitted in Kafka. When a new consumer instance starts, it reads from the last committed offset, automatically re-processing the unmatched ride request. This provides at-least-once delivery semantics, ensuring no ride requests are lost.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "If the matching service crashes, the ride request will be reprocessed by another instance",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Each ride request is processed exactly once with no duplicates",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Ride requests are guaranteed to be processed in strict FIFO order",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The queue will automatically scale to handle more requests",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Durable execution vs delay queue for driver timeouts",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "For handling driver timeout and retry logic (10-second windows, cycling through ranked drivers), why does Temporal/durable execution outperform a delay queue approach?",
        explanation:
          "Durable execution frameworks persist workflow state. The entire multi-step process (send to driver → wait → timeout → next driver) is modeled as a single workflow that survives crashes. A delay queue requires manually coordinating between the queue and matching service — if a driver accepts after the delayed message is scheduled but before it is processed, a race condition can cause incorrect reassignment. Temporal handles this natively with workflow state.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Temporal processes messages faster than any message queue",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Delay queues cannot implement timeouts shorter than 30 seconds",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Durable execution eliminates the need for a Ride Matching Service entirely",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Workflow state survives crashes and eliminates race conditions between timeout messages and driver responses",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Geo-sharding boundary challenge",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "When geo-sharding the Uber system by geographic region, what is the primary operational challenge at region boundaries?",
        explanation:
          "When a rider is near the boundary between two geographic shards, drivers on the other side of the boundary are in a different shard. A single-shard proximity query would miss them, leading to suboptimal matches (or no match at all). The system must perform scatter-gather queries across adjacent shards for boundary rides, adding latency and cross-shard coordination complexity. This is the fundamental trade-off of geographic partitioning.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Drivers cannot physically cross region boundaries while on a ride",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Push notifications cannot be routed across geographic regions",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Proximity searches near boundaries must scatter-gather across adjacent shards to avoid missing nearby drivers",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Fare estimation requires global consensus across all shards",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4) ─────────────────────────────────────────────

    // MCAQ 1 — easy
    {
      title: "Components in Uber high-level architecture",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL services/components that are part of the Uber high-level architecture:",
        explanation:
          "The Uber architecture includes: API Gateway (routing, auth, rate limiting), Ride Service (fare estimation, ride state), Location Service (driver location updates), Ride Matching Service (matching riders to drivers), and Notification Service (push notifications via APNs/FCM). A Payment Service exists in the real system but is below the line for this interview scope.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Ride Matching Service", isCorrect: true },
            { id: "b", text: "API Gateway", isCorrect: true },
            { id: "c", text: "Content Delivery Network (CDN)", isCorrect: false },
            { id: "d", text: "Location Service", isCorrect: true },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid strategies for handling stale driver locations in Redis",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid strategies for handling stale driver location data in a Redis geospatial store when drivers go offline without explicitly signing out:",
        explanation:
          "A companion sorted set keyed by timestamp allows periodic cleanup of entries older than a threshold. GEOADD naturally overwrites previous locations, so active drivers always have fresh data. A periodic cleanup process can remove drivers whose last update exceeds 30 seconds. Redis key-level TTL cannot be applied to individual members of a sorted set — it applies to the entire key, which would delete ALL driver locations.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Run a periodic background process that removes drivers not updated within 30 seconds",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Maintain a companion sorted set keyed by timestamp and periodically remove stale entries",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Set a TTL on each individual driver's sorted set member",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Leverage GEOADD's overwrite behavior so active drivers always have current positions",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Problems with application-level locking for ride matching",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL problems with using application-level locking (in-process locks) for preventing double driver assignment across multiple Ride Matching Service instances:",
        explanation:
          "Application-level locks exist only within a single process. Multiple service instances have no shared state, causing race conditions. If an instance crashes, its locks vanish — there is no durable record. Scalability worsens as more instances increase the chance of uncoordinated conflicts. However, in-process locking is actually very fast (no network hop) — the issue is coordination, not speed.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Coordination problems worsen as the number of instances increases",
              isCorrect: true,
            },
            {
              id: "b",
              text: "If an instance crashes, its locks are lost and drivers remain locked indefinitely",
              isCorrect: true,
            },
            {
              id: "c",
              text: "No coordination across instances — two instances can lock the same driver simultaneously",
              isCorrect: true,
            },
            {
              id: "d",
              text: "In-process locks are too slow for the 10-second timeout window",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Benefits of durable execution for ride matching workflows",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL benefits that durable execution (e.g., Temporal) provides for the ride matching workflow compared to manual queue-based orchestration:",
        explanation:
          "Durable execution persists workflow state so it survives crashes. Built-in timeouts/retries simplify the timeout-and-retry-next-driver logic. Eliminates race conditions between delayed messages and driver responses since state is managed atomically within the workflow. However, it does NOT eliminate the need for Redis locks — the distributed lock prevents double-assignment across concurrent workflows, which is orthogonal to the timeout/retry logic.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Eliminates the need for Redis distributed locks on driver assignment",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Workflow state persists through service crashes and restarts",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Eliminates race conditions between timeout messages and driver acceptance",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Built-in timeout and retry semantics simplify the driver cycling logic",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── PARAGRAPH (6) ────────────────────────────────────────

    // Paragraph 1 — medium
    {
      title: "Compare geospatial storage approaches",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare the three approaches for storing and querying driver locations: (1) direct database writes, (2) batch processing with geospatial DB, and (3) Redis with geospatial data types. For each, explain the key trade-off.",
        explanation:
          "A strong answer covers all three approaches with specific trade-offs: direct DB fails at 2M writes/sec scale and requires full table scans; batch processing reduces writes but introduces staleness; Redis handles real-time throughput with low latency but trades durability (in-memory data loss risk).",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Direct database writes: Each of the ~2M location updates/second is written directly to PostgreSQL or DynamoDB. Proximity queries require full table scans on lat/long columns. Trade-off: simplest to implement but completely fails at scale — neither the write throughput nor query efficiency can handle millions of drivers.\n\nBatch processing with geospatial DB: Location updates are aggregated over short intervals (e.g., 5-10 seconds) and batch-written to a database with geospatial indexing (e.g., PostGIS with quad-tree indexes). Trade-off: dramatically reduces write volume and enables efficient proximity queries via spatial indexes, but the batching interval introduces staleness — driver positions in the DB may be seconds behind reality, leading to suboptimal matches.\n\nRedis with geospatial data types: Driver locations stored as geohash-encoded members in a Redis sorted set. GEOADD handles real-time writes at in-memory speed, GEOSEARCH performs sub-millisecond proximity queries. Trade-off: handles 2M writes/sec with always-current positions, but data is in-memory — a crash could lose location state. Mitigated by Redis persistence (RDB/AOF) and the fact that drivers re-send locations every 5 seconds, enabling rapid state recovery.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the ride matching consistency problem",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the consistency challenge in Uber's ride matching system. What invariant must be maintained, what can go wrong without it, and how does a Redis distributed lock with TTL solve it?",
        explanation:
          "Answer should explain the double-assignment invariant (one ride per driver at a time), describe race conditions from multiple matching instances, and show how Redis lock with TTL provides mutual exclusion with automatic expiration.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "The invariant: each driver must receive at most one ride request at a time, and each ride request must be sent to at most one driver at a time. Without this, two riders could be told the same driver is coming, leading to one being stranded.\n\nThe problem: multiple Ride Matching Service instances process ride requests concurrently. Without coordination, two instances could simultaneously query for nearby drivers, find the same driver at the top of their lists, and both send ride requests to that driver. The driver sees two requests and accepts one, leaving the other rider waiting for a match that will never come.\n\nThe solution: before sending a request to a driver, the Ride Matching Service acquires a distributed lock in Redis with the driverId as the key and a 10-second TTL. If the lock is already held, that driver is skipped and the next candidate is tried. If the driver accepts, the lock is released and the ride status is updated. If the driver declines or the 10-second TTL expires, the lock auto-releases and the driver becomes available for other requests. The TTL is critical — it makes the system self-healing even if the service that acquired the lock crashes.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design adaptive location update intervals",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design an adaptive location update system for Uber drivers. Explain: (1) what factors determine update frequency, (2) how the client implements this, (3) the impact on server-side infrastructure, and (4) potential risks of this approach.",
        explanation:
          "A staff-level answer should cover: contextual factors (speed, direction, proximity to pending rides, driver status), client-side sensor fusion, reduced write volume on the server, and risks like stale positions for fast-moving drivers with infrequent updates.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Factors determining update frequency: (1) Speed — stationary drivers update every 30-60s, slow-moving every 10-15s, fast-moving every 3-5s. (2) Direction changes — frequent turns trigger more updates to maintain accurate position. (3) Proximity to pending ride requests — drivers near active ride requests update more frequently for accurate matching. (4) Driver status — "available" drivers update more than "offline" or "on-trip" drivers. (5) Area density — drivers in high-demand areas update more frequently.\n\nClient implementation: The driver app uses on-device sensors (GPS, accelerometer, gyroscope) and algorithms to compute the optimal update interval. A state machine monitors speed, heading, and context to dynamically adjust the timer between location pings. The app batches updates when connectivity is poor and sends them when the connection is restored.\n\nServer-side impact: Instead of 10M drivers × 1 update/5s = 2M writes/sec, adaptive intervals might reduce this to 500k-800k writes/sec — a 60-75% reduction. This reduces Redis memory churn, network bandwidth, and battery usage on driver devices. The Location Service can handle more drivers per Redis instance.\n\nRisks: (1) A driver moving fast on a highway with infrequent updates could show a stale position, causing a bad match. Mitigation: enforce a maximum interval even for highway speeds. (2) Complex client-side logic increases app size and potential for bugs. (3) Different device capabilities may produce inconsistent behavior. (4) Battery-saving modes on phones may interfere with sensor access.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Design the complete ride matching workflow with Temporal",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the complete ride matching workflow using a durable execution framework like Temporal. Cover: (1) workflow steps, (2) how timeouts are handled, (3) what happens on service crash, (4) how it interacts with the Redis distributed lock, and (5) failure modes and mitigations.",
        explanation:
          "A staff-level answer should model the complete workflow with clear steps, show how Temporal's timer and signal mechanisms handle the timeout/accept flow, explain crash recovery, and distinguish the workflow's role from the distributed lock's role.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Workflow steps:\n1. Receive ride request (rideId, pickupLocation, destination).\n2. Query Location Service for ranked list of nearby available drivers.\n3. For each driver in the ranked list:\n   a. Attempt to acquire Redis lock on driverId (10s TTL).\n   b. If lock acquired: send push notification to driver via Notification Service.\n   c. Start a 10-second Temporal timer (workflow.sleep(10s)).\n   d. Wait for either: driver acceptance signal OR timer expiration.\n   e. On acceptance: release Redis lock, update ride status to "accepted", complete workflow.\n   f. On decline/timeout: Redis lock auto-expires (TTL), move to next driver.\n4. If all drivers exhausted: update ride status to "no_drivers_available", notify rider.\n\nTimeout handling: Temporal\'s workflow.sleep() is durable — the timer persists even through worker restarts. When the timer fires, the workflow resumes execution at the next step. This is fundamentally different from an in-memory setTimeout that would be lost on crash.\n\nCrash recovery: Temporal persists every workflow state transition to its database. If the worker crashes mid-workflow, Temporal detects the failed heartbeat and replays the workflow history on a new worker, resuming from the last completed step. No ride requests are lost.\n\nInteraction with Redis: The workflow and the distributed lock serve different purposes. The workflow manages the sequential retry logic (try driver A → wait → try driver B). The Redis lock prevents concurrent workflows from contacting the same driver. Both are needed — the workflow handles orchestration, the lock handles mutual exclusion.\n\nFailure modes: (1) Temporal itself goes down — workflows pause and resume when Temporal recovers (no data loss). (2) Redis goes down — locks cannot be acquired, matching stalls. Mitigate with Redis Sentinel for HA. (3) All drivers in range decline — workflow completes with "no match" and rider is notified to retry.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Uber system: peak demand scaling strategy",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A major concert ends and 100,000 ride requests flood in from the same location within 2 minutes. Walk through how the Uber system handles this surge: which components are stressed, what could fail, and how each deep dive (queue, geo-sharding, adaptive updates) contributes to surviving the spike.",
        explanation:
          "Should demonstrate end-to-end thinking about the surge through every component: API Gateway rate limiting, Kafka queue absorbing the burst, dynamic scaling of matching workers, Redis handling concentrated location queries, and the role of geo-sharding in isolating the blast radius.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The surge hits multiple components simultaneously:\n\nAPI Gateway: Receives 100k requests in 2 minutes (~833/sec). Rate limiting prevents individual abuse but must allow legitimate surge traffic. The gateway buffers requests and forwards them to the Ride Service.\n\nRide Service + Kafka queue: The Ride Service creates 100k Ride entities and enqueues matching requests into Kafka. The queue absorbs the burst — Kafka can handle millions of messages/sec. Queue depth spikes trigger auto-scaling of Ride Matching Service instances (from, say, 5 to 50 in the affected region).\n\nRedis (Location Service): All 100k requests query for drivers near the same coordinates. The GEOSEARCH command is efficient (O(N+log(M)) where N is results, M is total members), but concentrated queries on the same geohash range could stress a single Redis node. Mitigation: Redis read replicas distribute the read load.\n\nRide Matching: Even with 50 instances, there are far more riders than available drivers in the area. The ranking algorithm must handle scenarios where the top drivers are already locked (Redis TTL). Drivers further away are matched, increasing ETAs. The system should communicate realistic wait times to riders.\n\nGeo-sharding contribution: The surge is isolated to one geographic shard. Other regions are unaffected — their matching services, Redis instances, and Kafka partitions continue operating normally. This prevents a local event from causing global degradation.\n\nAdaptive updates: Drivers in the concert area who were idle (low update frequency) should switch to high-frequency updates as ride requests appear nearby, ensuring accurate positions for matching.\n\nPotential failures: (1) Kafka consumer lag — matching falls behind, riders wait. Mitigate with aggressive auto-scaling. (2) Redis lock contention — many workflows competing for the same drivers. Mitigate by expanding search radius to include drivers further away. (3) Notification service overload — thousands of push notifications simultaneously. Mitigate with batching and prioritization.",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Interview framework: structuring an Uber system design answer",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You are in a Staff Engineer interview asked to "Design Uber." Outline how you would structure your 45-minute answer using the HelloInterview delivery framework. For each phase, explain what you cover, how long you spend, and what distinguishes a Staff answer from a Senior answer.',
        explanation:
          "Should demonstrate interview meta-awareness: rushing through straightforward parts (API, entities) to maximize time on deep dives, proactively identifying issues rather than waiting for the interviewer, and bringing operational insights.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Phase 1 — Requirements (3-4 min): Quickly define 4 functional requirements (fare estimate, request ride, match driver, accept/decline) and 3 NFRs (low-latency matching, strong consistency in assignment, high throughput). Explicitly mark out-of-scope items (ratings, ride categories, scheduling). Staff differentiator: proactively noting that consistency in matching will be a key deep dive, signaling awareness of the hard problems.\n\nPhase 2 — Entities & API (2-3 min, RUSH): List 5 entities (Rider, Driver, Fare, Ride, Location). Define 4 endpoints. Call out the JWT security point for driverId. Staff differentiator: mention this quickly and confidently — the interviewer assumes you know REST basics. Don't spend time justifying HTTP methods.\n\nPhase 3 — High-Level Design (8-10 min): Walk through each functional requirement sequentially, adding components incrementally. Start with Ride Service + DB for fare estimation. Add Location Service + Ride Matching Service for matching. Add Notification Service for driver communication. Staff differentiator: as you draw the architecture, proactively flag issues — \"This direct-to-DB approach for locations won't scale, I'll address that in deep dives.\"\n\nPhase 4 — Deep Dives (25-30 min, MOST TIME): Cover 3-4 deep dives with good/great solution evolution. (a) Geospatial indexing: direct DB → batch + PostGIS → Redis GEOADD/GEOSEARCH. Show awareness of geohashing internals. (b) Distributed locking: app-level → DB status → Redis TTL lock. Connect to Ticketmaster pattern. (c) Queue for reliability: synchronous → Kafka with offset management + auto-scaling. (d) Durable execution: delay queue → Temporal workflow for timeout handling. (e) Geo-sharding for global scale.\n\nStaff vs Senior differentiators: A senior covers 2 deep dives well with interviewer guidance. A staff candidate proactively drives 3+ deep dives, references real-world systems (Uber created Cadence/Temporal), discusses operational concerns (monitoring queue lag, Redis failover), and provides insights the interviewer may not have considered — like using adaptive location updates to reduce write volume by 60-75%.",
          minLength: 250,
          maxLength: 4000,
        },
      },
    },

    // ── TEXT (4) ──────────────────────────────────────────────

    // Text 1 — medium
    {
      title: "What Redis command finds nearby drivers",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What Redis command is used to find all drivers within a given radius of a rider's location? Answer with the command name.",
        explanation:
          "GEOSEARCH (introduced in Redis 6.2) queries a geospatial sorted set for members within a specified radius or bounding box from given coordinates. It replaced the older GEORADIUS and GEORADIUSBYMEMBER commands with improved flexibility and performance.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "GEOSEARCH",
          acceptableAnswers: ["GEOSEARCH", "geosearch", "GEORADIUS", "georadius"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "What problem does Kafka solve in ride matching",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In one sentence, explain what problem introducing a Kafka queue between the Ride Service and Ride Matching Service solves.",
        explanation:
          "The Kafka queue decouples request ingestion from processing, absorbing demand spikes and ensuring no ride requests are lost if a Ride Matching Service instance crashes — unprocessed messages remain in the queue for another instance to pick up.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "It absorbs demand spikes and prevents ride requests from being lost if a matching service instance crashes, since unprocessed messages remain in the queue.",
          acceptableAnswers: [
            "Prevents dropped ride requests during peak demand or service crashes",
            "Decouples request ingestion from processing for reliability and scalability",
            "Ensures no ride requests are lost by buffering them in a durable queue",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Why Uber created Cadence",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Uber is the original creator of the open-source durable execution framework Cadence, which later inspired Temporal. In one sentence, explain the core problem that motivated its creation in the context of ride-sharing.",
        explanation:
          "Uber needed fault-tolerant orchestration of multi-step, human-in-the-loop workflows (like ride matching with driver timeouts and retries) that could survive service crashes without losing state or dropping requests. Manual queue-based orchestration was too error-prone and complex for mission-critical flows.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Uber needed to reliably orchestrate multi-step workflows (like ride matching with driver timeouts and retries) that survive service crashes without losing state.",
          acceptableAnswers: [
            "Fault-tolerant orchestration of multi-step processes with timeouts and retries",
            "Durable execution of human-in-the-loop workflows that survive crashes",
            "Reliable state management for complex business processes like ride matching",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Redis durability trade-off for location data",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Why is Redis's lack of durability an acceptable trade-off for storing driver locations, but would NOT be acceptable for storing ride records?",
        explanation:
          "Driver locations are ephemeral — they are overwritten every 5 seconds by new updates, so a crash loses at most 5 seconds of data that is quickly rebuilt. Ride records are transactional business data (payments, status, history) that cannot be reconstructed from subsequent events and must be persisted durably.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Driver locations are rebuilt within seconds from new GPS updates after a crash, but ride records contain irreplaceable transactional data (payments, status) that requires durable storage.",
          acceptableAnswers: [
            "Locations are ephemeral and refreshed every 5 seconds; ride records are permanent business data",
            "Location state is rebuilt quickly from new updates; ride data cannot be reconstructed",
            "Losing location data costs 5 seconds of staleness; losing ride data means lost transactions",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── MATCHING (3) ─────────────────────────────────────────

    // Matching 1 — easy
    {
      title: "Match Uber component to its responsibility",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each Uber system component to its primary responsibility:",
        explanation:
          "The Ride Service manages fare estimation and ride state. The Location Service receives and stores real-time driver positions. The Ride Matching Service runs the algorithm to match riders with optimal drivers. The Notification Service dispatches push notifications to drivers via APNs/FCM.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Ride Service",
              right: "Fare estimation and ride state management",
            },
            {
              id: "p2",
              left: "Location Service",
              right: "Receiving and storing real-time driver positions",
            },
            {
              id: "p3",
              left: "Ride Matching Service",
              right: "Finding optimal driver for a ride request",
            },
            {
              id: "p4",
              left: "Notification Service",
              right: "Push notifications to drivers via APNs/FCM",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match locking approach to its weakness",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each driver locking approach to its primary weakness:",
        explanation:
          "Application-level locks cannot coordinate across multiple service instances (race conditions). Database status with in-memory timeout loses the timeout if the service crashes (stuck locks). Redis lock with TTL depends on Redis availability (if Redis is down, locks cannot be acquired). Delay queue for retries is vulnerable to race conditions if a driver accepts after the retry message is scheduled.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Application-level locking",
              right: "No coordination across multiple service instances",
            },
            {
              id: "p2",
              left: "Database status + in-memory timeout",
              right: "Timeout lost on service crash, leaving locks stuck",
            },
            {
              id: "p3",
              left: "Redis distributed lock with TTL",
              right: "Depends on Redis availability for locking",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: 'Match deep dive problem to its "great" solution',
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: 'Match each Uber deep dive challenge to its recommended "great" solution:',
        explanation:
          "High-frequency location writes → Redis geospatial store (handles 2M writes/sec in-memory). Double driver assignment → distributed lock with TTL (auto-expiring mutual exclusion). Dropped requests during peak demand → Kafka queue with dynamic scaling (durable buffering + auto-scale consumers). Driver timeout handling → durable execution workflow (persistent state, automatic retries). Global latency reduction → geo-sharding (independent regional stacks).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "2M location writes/sec from drivers",
              right: "Redis in-memory geospatial store",
            },
            {
              id: "p2",
              left: "Double driver assignment race condition",
              right: "Redis distributed lock with TTL",
            },
            {
              id: "p3",
              left: "Dropped ride requests during surge",
              right: "Kafka queue with dynamic consumer scaling",
            },
            {
              id: "p4",
              left: "Driver timeout and retry orchestration",
              right: "Durable execution (Temporal/Cadence)",
            },
            {
              id: "p5",
              left: "Global latency and cross-region scale",
              right: "Geo-sharding with regional stacks",
            },
          ],
        },
      },
    },

    // ── FILL-BLANKS (3) ──────────────────────────────────────

    // Fill-blanks 1 — easy
    {
      title: "Redis geospatial command for adding locations",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In Redis, the _____ command adds a driver's latitude and longitude to a geospatial sorted set, overwriting any previous location for that driver.",
        explanation:
          "GEOADD is the Redis command for adding geospatial data. It stores the member (driverId) with its longitude and latitude, encoding them as a geohash score in a sorted set. If the member already exists, GEOADD overwrites the previous position.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "In Redis, the {{blank1}} command adds a driver's latitude and longitude to a geospatial sorted set, overwriting any previous location for that driver.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "GEOADD",
              acceptableAnswers: ["GEOADD", "geoadd"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Durable execution framework created by Uber",
      type: "question",
      sectionId: "sec_q_reliability",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Uber open-sourced a durable execution framework called _____, which later inspired the creation of Temporal.",
        explanation:
          "Cadence is the open-source durable execution framework originally created by Uber. Its core team later left to build Temporal, which is the leading durable execution framework today. Both are used for orchestrating multi-step, fault-tolerant workflows.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Uber open-sourced a durable execution framework called {{blank1}}, which later inspired the creation of Temporal.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Cadence",
              acceptableAnswers: ["Cadence", "cadence"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Geospatial data structure for proximity queries",
      type: "question",
      sectionId: "sec_q_geospatial",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "For efficient proximity searches on geographic coordinates, a specialized data structure called a _____ recursively partitions two-dimensional space into quadrants.",
        explanation:
          "A quad-tree is a tree data structure that recursively divides a 2D space into four quadrants. It is particularly well-suited for spatial data like geographic coordinates, enabling efficient range queries and nearest-neighbor searches. PostGIS and other geospatial databases use quad-trees (or similar spatial indexes) for proximity queries.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "For efficient proximity searches on geographic coordinates, a specialized data structure called a {{blank1}} recursively partitions two-dimensional space into quadrants.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "quad-tree",
              acceptableAnswers: ["quad-tree", "quadtree", "quad tree", "Quadtree"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── NUMERICAL (2) ────────────────────────────────────────

    // Numerical 1 — medium
    {
      title: "Calculate driver location write throughput",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "If Uber has 10 million active drivers and each sends a location update every 5 seconds, how many writes per second does the location service need to handle?",
        explanation:
          "Writes per second = total drivers / update interval = 10,000,000 / 5 = 2,000,000 writes per second. This is why a traditional database approach fails — 2M writes/sec is far beyond what PostgreSQL or DynamoDB can handle cost-effectively.",
        basePoints: 15,
        difficulty: "medium",
        questionData: { correctAnswer: 2000000, tolerance: 100000 },
      },
    },

    // Numerical 2 — hard
    {
      title: "Adaptive updates write reduction estimate",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "With adaptive location updates, assume 30% of drivers are stationary (update every 30s), 40% are moving slowly (every 10s), and 30% are moving fast (every 3s). With 10 million total drivers, what is the approximate total writes per second (in thousands)?",
        explanation:
          "Stationary: 3,000,000 / 30 = 100,000 writes/sec. Slow: 4,000,000 / 10 = 400,000 writes/sec. Fast: 3,000,000 / 3 = 1,000,000 writes/sec. Total: 100,000 + 400,000 + 1,000,000 = 1,500,000 writes/sec = 1,500 thousand. This is a 25% reduction from the fixed 2M writes/sec baseline.",
        basePoints: 25,
        difficulty: "hard",
        questionData: { correctAnswer: 1500, tolerance: 100 },
      },
    },
  ],
};
