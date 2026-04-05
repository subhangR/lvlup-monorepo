/**
 * Strava (Fitness Tracking App) — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: activity tracking, offline-first client design, GPS route storage,
 * scaling writes, real-time activity sharing, and leaderboard design with Redis Sorted Sets
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const stravaContent: StoryPointSeed = {
  title: "Design a Fitness Tracking App (Strava)",
  description:
    "Master the system design of a fitness tracking platform — covering offline-first client architecture, GPS activity tracking, scaling writes for 10M concurrent activities, real-time sharing via polling, and leaderboard design with Redis Sorted Sets.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements, Entities & API Design", orderIndex: 1 },
    { id: "sec_q_offline", title: "Offline-First Client Architecture", orderIndex: 2 },
    {
      id: "sec_q_realtime_scaling",
      title: "Real-time Sharing & Scaling Strategies",
      orderIndex: 3,
    },
    { id: "sec_q_leaderboard", title: "Leaderboard Design with Redis", orderIndex: 4 },
    { id: "sec_q_tradeoffs", title: "Architecture Tradeoffs & Staff Thinking", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements, Entities, API & High-Level Design
    {
      title: "Strava — Requirements, Entities & High-Level Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Strava — Requirements, Entities & High-Level Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Strava?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Strava is a fitness tracking application that allows users to record and share physical activities, primarily running and cycling. It provides detailed analytics on performance and routes, and enables social interactions among athletes. The system design challenge centers on handling GPS data at scale, offline functionality, and real-time sharing.",
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
                  "Users should be able to start, pause, stop, and save their runs and rides.",
                  "While running or cycling, users should be able to view activity data including route, distance, and time.",
                  "Users should be able to view details about their own completed activities as well as the activities of their friends.",
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
                  "High availability: availability >> consistency.",
                  "Offline support: the app must function in remote areas without network connectivity.",
                  "Accurate local statistics: the athlete must see up-to-date data during the activity.",
                  "Scale: support 10 million concurrent activities.",
                ],
              },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "A critical observation is that this system is write-heavy during activities (continuous GPS coordinates) but becomes read-heavy when users browse completed activities. The key insight that reshapes the entire design is that most write-side work can be offloaded to the client device.",
            },
            {
              id: "b8",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 2 },
            },
            {
              id: "b9",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "User: Profile information and settings.",
                  "Activity: Type (run/ride), start time, end time, route data, distance, duration, and state.",
                  "Route: Collection of GPS coordinates with timestamps recorded during an activity.",
                  "Friend: Bi-directional connection between users for sharing activities.",
                ],
              },
            },
            {
              id: "b10",
              type: "heading",
              content: "API Design",
              metadata: { level: 2 },
            },
            {
              id: "b11",
              type: "code",
              content:
                '// Create a new activity\nPOST /activities -> Activity\n{ type: "RUN" | "RIDE" }\n\n// Update activity state (pause, resume, complete)\nPATCH /activities/:activityId -> Activity\n{ state: "STARTED" | "PAUSED" | "COMPLETE" }\n\n// Add GPS coordinates to an activity\'s route\nPOST /activities/:activityId/routes -> Activity\n{ location: GPSCoordinate }\n\n// List activities (own or friends\')\nGET /activities?mode={USER|FRIENDS}&page={page}&pageSize={pageSize} -> Partial<Activity>[]\n\n// Get full activity details\nGET /activities/:activityId -> Activity',
              metadata: { language: "text" },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "PATCH is used instead of PUT because we only update a subset of fields. The same PATCH endpoint handles pause, resume, and completion by changing the state field. This keeps the API clean and RESTful.",
            },
            {
              id: "b13",
              type: "heading",
              content: "High-Level Architecture",
              metadata: { level: 2 },
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                "The basic architecture is a simple client-server setup: Client App → Activity Service → Database. Users interact through a mobile app. The Activity Service handles creating, updating, and querying activities. The database stores all activity data including routes.",
            },
            {
              id: "b15",
              type: "heading",
              content: "Handling Pause/Resume Time Accurately",
              metadata: { level: 3 },
            },
            {
              id: "b16",
              type: "paragraph",
              content:
                'A naive approach using a single startTimestamp would miscalculate elapsed time when the user pauses. Instead, maintain a log of status-timestamp pairs: [{status: "STARTED", timestamp: T1}, {status: "PAUSED", timestamp: T2}, {status: "RESUMED", timestamp: T3}, {status: "STOPPED", timestamp: T4}]. The elapsed time is calculated by summing durations between pairs, excluding pauses. This also enables features like "total time" vs "active time" breakdown.',
            },
            {
              id: "b17",
              type: "heading",
              content: "GPS Tracking & Distance Calculation",
              metadata: { level: 3 },
            },
            {
              id: "b18",
              type: "paragraph",
              content:
                "GPS coordinates are recorded at constant intervals — typically every 2 seconds for cycling and 5 seconds for running. The distance is calculated incrementally using the Haversine formula, which computes the great-circle distance between two GPS points on a sphere. Each new coordinate updates the route and the cumulative distance.",
            },
            {
              id: "b19",
              type: "heading",
              content: "Viewing Completed Activities",
              metadata: { level: 3 },
            },
            {
              id: "b20",
              type: "paragraph",
              content:
                "The activity list page shows basic info (distance, duration, date) using a paginated GET endpoint. For the friends feed, a JOIN on the friends table retrieves activities from connected users. When a user clicks an activity, a second request fetches full details including route data for map rendering via a mapping API like Google Maps.",
            },
            {
              id: "b21",
              type: "code",
              content:
                '-- User\'s own activities\nSELECT * FROM activities\nWHERE state = "COMPLETE" AND userId = :userId\nLIMIT :pageSize OFFSET (:page - 1) * :pageSize\n\n-- Friends\' activities\nSELECT * FROM activities\nWHERE state = "COMPLETE"\nAND userId IN (SELECT friendId FROM friends WHERE userId = :userId)\nLIMIT :pageSize OFFSET (:page - 1) * :pageSize',
              metadata: { language: "sql" },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Deep Dives — Offline Support & Scaling Writes
    {
      title: "Deep Dives — Offline Support & Scaling to 10M Concurrent Activities",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Offline Support & Scaling to 10M Concurrent Activities",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "The Key Insight: Client as Active Participant",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "The most important realization in this design is that — as long as we don't need real-time sharing — we can record all activity data locally on the client device and only sync to the server when the activity completes or the user is back online. This insight reshapes the entire system and is what separates a strong answer from a mediocre one.",
            },
            {
              id: "c3",
              type: "paragraph",
              content:
                "Modern smartphones have GPS sensors, substantial memory and processing power, and significant local storage. Many candidates overlook the client's capabilities, focusing solely on server-side solutions. For systems like Strava, Dropbox, or Spotify, the client often plays a critical role — enabling offline functionality, reducing server load, and improving user experience.",
            },
            {
              id: "c4",
              type: "heading",
              content: "Offline Tracking Architecture",
              metadata: { level: 2 },
            },
            {
              id: "c5",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Use on-device location services (iOS: CLLocationManager, Android: FusedLocationProviderClient) to record GPS coordinates at constant intervals.",
                  "Store coordinate-timestamp pairs in an in-memory buffer (array).",
                  "Periodically persist the buffer to local storage every ~10 seconds to prevent data loss from device shutdown or battery depletion.",
                  "On app reopen, check local storage for saved data and load it into memory before continuing.",
                  "Once the activity completes and the device is online, send all accumulated data in a single request.",
                  "For very long activities, implement chunking to handle large data payloads.",
                  "Optionally implement background sync that uploads periodically when a connection becomes available.",
                  "Upon server confirmation, delete the local buffer.",
                ],
              },
            },
            {
              id: "c6",
              type: "quote",
              content:
                "This approach ensures that even if the device unexpectedly shuts down, we lose at most 10 seconds of activity data. The maximum data loss window equals the local persistence interval.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Why No Microservices (Yet)?",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "After offloading tracking to the client, the backend has minimal work. There is no significant read/write skew across different paths that would justify splitting into microservices. The Activity Service can simply scale horizontally when memory, CPU, or network limits are reached. If Meta can manage a monolithic codebase, so can Strava.",
            },
            {
              id: "c9",
              type: "heading",
              content: "Scaling to 10M Concurrent Activities",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "By tracking activities locally, we cut backend requests by ~100x — data is sent once on completion instead of every few seconds. This dramatically simplifies scaling. But we still need to handle the write volume from completed activities.",
            },
            {
              id: "c11",
              type: "heading",
              content: "Storage Estimation",
              metadata: { level: 3 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                "With ~100M DAU doing one activity per day: Basic metadata (status, userId, timestamps): ~100 bytes per activity. Route data (30-minute average, GPS every ~3 seconds): 600 points × (8B lat + 8B lng + 8B timestamp) = ~15KB per activity. Total: 15KB × 100M/day × 365 = ~547.5 TB per year. This is substantial but manageable with proper data management.",
            },
            {
              id: "c13",
              type: "heading",
              content: "Scaling Strategies",
              metadata: { level: 3 },
            },
            {
              id: "c14",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Database sharding: Shard by activity completion time since most queries target recent activities.",
                  "Data tiering: Hot (recent) → fast storage, Warm (3-12 months) → slower storage, Cold (>1 year) → archival storage like S3.",
                  "Caching: Introduce Redis if read throughput becomes an issue, though it should be low priority given the client-side architecture.",
                  "Horizontal scaling: Scale the Activity Service horizontally when resource limits are reached.",
                ],
              },
            },
            {
              id: "c15",
              type: "heading",
              content: "Database Choice",
              metadata: { level: 3 },
            },
            {
              id: "c16",
              type: "quote",
              content:
                "Hot take: the database choice doesn't really matter. This is large but totally manageable data; there is no extreme read or write throughput, and data is relational but not heavily so. All popular major database technologies would work great here. Pick whatever you have production experience with.",
            },
          ],
          readingTime: 9,
        },
      },
    },

    // Material 3: Deep Dives — Real-time Sharing & Leaderboard
    {
      title: "Deep Dives — Real-time Sharing & Leaderboard Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Real-time Sharing & Leaderboard Design",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Real-time Activity Sharing with Friends",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                'A common follow-up question: "What if friends want to follow along with activities in real-time?" Friends don\'t just see statistics after completion — they can watch mid-run, seeing stats and routes update in near real-time.',
            },
            {
              id: "d3",
              type: "heading",
              content: "Why Not WebSockets?",
              metadata: { level: 3 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "The instinctive answer is WebSockets or SSE, but this is likely over-engineering. Two key insights suggest a simpler polling mechanism: (1) Updates are predictable — unlike Messenger or Live Comments, we know the next update comes in 2-5 seconds, allowing efficient polling intervals. (2) Real-time precision isn't critical — a few seconds delay is acceptable and doesn't significantly impact the experience.",
            },
            {
              id: "d5",
              type: "paragraph",
              content:
                "With real-time sharing enabled, we reintroduce periodic server updates during activities. The client sends location updates every 2-5 seconds while maintaining local logic for user-facing data. The server persists these updates and makes them available for friends' clients to poll.",
            },
            {
              id: "d6",
              type: "heading",
              content: "Smart Buffering for Smooth UX",
              metadata: { level: 3 },
            },
            {
              id: "d7",
              type: "paragraph",
              content:
                'Intentionally lag the displayed location data by 1-2 update intervals (5-10 seconds). By buffering, we create a smoother continuous animation of the athlete\'s movement, eliminating jarring position jumps. The athlete appears in constant motion, creating a "live-stream-like" experience. The intentional lag also compensates for network latency, ensuring consistency across different network conditions.',
            },
            {
              id: "d8",
              type: "heading",
              content: "Leaderboard Design",
              metadata: { level: 2 },
            },
            {
              id: "d9",
              type: "paragraph",
              content:
                "Another natural extension is a leaderboard of top athletes by activity type and distance, filterable by country, region, or city. There are three approaches with increasing sophistication.",
            },
            {
              id: "d10",
              type: "heading",
              content: "Bad: Naive SQL Aggregation",
              metadata: { level: 3 },
            },
            {
              id: "d11",
              type: "paragraph",
              content:
                'Query the database directly: SELECT u.name, SUM(a.distance) FROM activities a JOIN users u ON a.userId = u.userId WHERE a.state = "COMPLETE" GROUP BY u.userId ORDER BY total_distance DESC. This runs an aggregation over millions of activities for every request — slow, expensive, and non-scalable.',
            },
            {
              id: "d12",
              type: "heading",
              content: "Good: Periodic Aggregation",
              metadata: { level: 3 },
            },
            {
              id: "d13",
              type: "paragraph",
              content:
                "Create a separate leaderboard table with pre-calculated totals. A background job runs daily to update aggregates. Leaderboard queries become a simple sorted SELECT. Tradeoff: eventual consistency — the latest activity might not be reflected immediately. The challenge is choosing the update frequency: too frequent strains resources, too infrequent shows stale data.",
            },
            {
              id: "d14",
              type: "heading",
              content: "Great: Redis Sorted Sets for Real-time Leaderboard",
              metadata: { level: 3 },
            },
            {
              id: "d15",
              type: "paragraph",
              content:
                "Use Redis Sorted Sets with user IDs as members and total distances as scores. When a new activity is logged, use ZINCRBY to atomically increment the user's score. To query the top N athletes, use ZRANGE with DESC ordering — Redis performs this in O(log N + M) time where M is the result count.",
            },
            {
              id: "d16",
              type: "code",
              content:
                '# Increment distance for a user\nredis.zincrby("leaderboard:run:global", distance, user_id)\nredis.zincrby("leaderboard:run:USA", distance, user_id)\n\n# Get top athletes\nredis.zrange("leaderboard:run:global", 0, -1, desc=True, withscores=True)',
              metadata: { language: "python" },
            },
            {
              id: "d17",
              type: "heading",
              content: "Filtering by Country & Time Range",
              metadata: { level: 3 },
            },
            {
              id: "d18",
              type: "paragraph",
              content:
                'For country filtering, create separate sorted sets per country (e.g., "leaderboard:run:USA"). Update both global and country-specific sets on each activity. For time-range filtering, combine sorted sets (activity IDs scored by timestamp) with hashes (activity ID → userId + distance). Use ZRANGEBYSCORE for the time window, retrieve distances from hashes, aggregate by user in-memory, and sort. Cache results with a short TTL to limit in-memory aggregation while ensuring freshness.',
            },
            {
              id: "d19",
              type: "heading",
              content: "Leaderboard Challenges",
              metadata: { level: 3 },
            },
            {
              id: "d20",
              type: "paragraph",
              content:
                "The main challenge is data consistency between Redis and the primary database. Implement robust failure handling and retries when updating Redis. Consider Redis memory limitations — storing leaderboards for all combinations of activity types, time ranges, and geographies could consume significant memory. Keep frequently accessed leaderboards in Redis and calculate less common ones on-demand.",
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
      title: "PATCH vs PUT for activity state updates",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why does the Strava API design use PATCH instead of PUT for updating activity state (e.g., pausing or completing an activity)?",
        explanation:
          "PATCH is used because we only update a subset of the activity's fields (just the state), not the entire resource. PUT requires sending the complete resource representation, which is unnecessary overhead when only changing one field. While functionally equivalent in an interview context, PATCH is more semantically correct and efficient for partial updates.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "PATCH automatically handles concurrency conflicts through versioning",
              isCorrect: false,
            },
            {
              id: "b",
              text: "PATCH is faster than PUT because it uses a different transport protocol",
              isCorrect: false,
            },
            {
              id: "c",
              text: "PATCH updates only a subset of fields, which is more efficient when only the state changes",
              isCorrect: true,
            },
            {
              id: "d",
              text: "PUT cannot be used with JSON payloads in RESTful APIs",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Distance calculation formula for GPS tracking",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Which mathematical formula is used to calculate the distance between consecutive GPS coordinates during activity tracking?",
        explanation:
          "The Haversine formula calculates the great-circle distance between two points on a sphere given their latitude and longitude. It accounts for the curvature of the Earth, making it appropriate for GPS-based distance calculations. Euclidean distance would be inaccurate because the Earth is not flat. Manhattan distance measures grid-based paths. Dijkstra's algorithm finds shortest paths in graphs, not point-to-point distances.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Dijkstra's algorithm — shortest path between two graph nodes",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Manhattan distance — sum of absolute differences in coordinates",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Euclidean distance — straight-line distance using Pythagorean theorem",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Haversine formula — computes great-circle distance between two points on a sphere",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Friends table design for bi-directional relationships",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When modeling bi-directional friendships in a friends table, what is the recommended approach?",
        explanation:
          'For bi-directional friendships, insert two rows per relationship: (userA, userB) and (userB, userA). Use a composite primary key on (userId, friendId) and add an index on userId. This makes querying "all friends of user X" a simple WHERE clause on userId, which is efficient with the index. A single row per friendship would require OR conditions in queries, complicating indexing.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A single row with a JSON array column storing all friend IDs",
              isCorrect: false,
            },
            {
              id: "b",
              text: "A separate table per user storing their friends as rows",
              isCorrect: false,
            },
            {
              id: "c",
              text: "One row per friendship with userId as the primary key",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Two rows per friendship with composite PK (userId, friendId) and an index on userId",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why local GPS tracking instead of server-side",
      type: "question",
      sectionId: "sec_q_offline",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "What is the primary architectural insight that drives tracking GPS data locally on the client device rather than sending each coordinate to the server in real-time?",
        explanation:
          "The key insight is that without real-time sharing, all GPS tracking can happen client-side and only sync on completion. This simultaneously solves offline support (no network needed during activity), reduces server load by ~100x (one batch upload vs. updates every few seconds), and provides accurate real-time local statistics (synchronous device computation). The 10M concurrent activities scale requirement becomes much easier when the server only handles completed activity uploads.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "GPS APIs on mobile devices cannot send data over the network while tracking location",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Without real-time sharing, local tracking solves offline support, reduces server load by ~100x, and ensures accurate local stats simultaneously",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Regulatory requirements mandate that GPS data must be processed locally before transmission",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Server-side GPS processing is computationally expensive and requires specialized hardware",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Local data persistence interval tradeoff",
      type: "question",
      sectionId: "sec_q_offline",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The client persists GPS data from the in-memory buffer to local storage every ~10 seconds. What tradeoff does this interval represent?",
        explanation:
          "The persistence interval balances data loss risk against battery consumption. With a 10-second interval, a device shutdown loses at most 10 seconds of data. Shorter intervals mean less data loss but more disk writes, which consume battery — a critical concern for long activities. Longer intervals save battery but risk losing more data. Network bandwidth is not involved since this is local storage. The interval doesn't affect GPS accuracy, which is determined by the GPS sampling rate.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Local storage capacity limits vs. number of concurrent activities",
              isCorrect: false,
            },
            {
              id: "b",
              text: "GPS accuracy vs. processing power required for Haversine calculations",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Network bandwidth usage vs. server storage costs",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Maximum data loss on crash (10 seconds) vs. battery consumption from frequent disk writes",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Polling vs WebSockets for real-time sharing",
      type: "question",
      sectionId: "sec_q_realtime_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When implementing real-time activity sharing with friends, why is polling preferred over WebSockets for this specific use case?",
        explanation:
          "Polling is preferred because: (1) updates arrive at predictable intervals (every 2-5 seconds), so polling can be tuned to match, and (2) a few seconds of delay is acceptable for watching a friend's run. WebSockets are ideal when updates are unpredictable in timing (chat messages) or when sub-second latency is critical. For Strava, the predictability of updates and tolerance for slight delays make the complexity of WebSocket connection management unnecessary.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Polling uses less bandwidth than WebSockets for all use cases",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Updates are predictable (every 2-5 seconds) and a few seconds of delay is acceptable — no need for WebSocket complexity",
              isCorrect: true,
            },
            {
              id: "c",
              text: "WebSockets cannot handle more than 1000 concurrent connections per server",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Mobile operating systems do not support WebSocket connections",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Sharding strategy for activity data",
      type: "question",
      sectionId: "sec_q_realtime_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "When sharding the activities database (547.5 TB/year), the design recommends sharding by activity completion time. What is the primary risk of this approach, and how does it differ from sharding by activity ID?",
        explanation:
          "Time-based sharding creates hot shards because the most recent shard receives all current writes and the majority of reads (users mostly view recent activities). However, this is acceptable here because the client-side architecture dramatically reduces write throughput — activities only write once on completion, not continuously. Sharding by activity ID distributes writes evenly but makes chronological queries (the most common access pattern) expensive because they span all shards. The tradeoff favors time-based sharding because read patterns are strongly recency-biased.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Time-based sharding creates hot shards for recent data, but this is acceptable because client-side tracking reduces write throughput and reads are recency-biased",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Time-based sharding prevents efficient JOIN operations, making the friends feed impossible to query",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Sharding by activity ID is always superior because it evenly distributes both reads and writes",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Time-based sharding requires global clock synchronization across all database nodes",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Redis Sorted Set leaderboard with time-range filtering",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'For a time-range filtered leaderboard (e.g., "top runners this week"), the design combines Redis sorted sets and hashes. Why can\'t a single sorted set with user IDs as members and distances as scores support time-range queries?',
        explanation:
          'A single sorted set with user IDs as members stores only the current cumulative score — it has no temporal dimension. You cannot "subtract" last week\'s activities from the total because the sorted set only maintains the aggregate. To support time-range filtering, you need activity-level granularity: store individual activities with timestamps (in a sorted set) and their details (in hashes), then aggregate distances for the desired time window on-demand. This is fundamentally a denormalization-for-query-pattern problem.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "ZRANGEBYSCORE only works with integer scores, not with timestamps",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Redis sorted sets cannot store floating-point scores, so distances must be stored elsewhere",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A single sorted set is limited to 1 million members, which is insufficient for all users",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The sorted set stores only cumulative scores with no temporal dimension — individual activity timestamps are lost in the aggregation",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Benefits of offline-first client architecture",
      type: "question",
      sectionId: "sec_q_offline",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL benefits of tracking activity data locally on the client device instead of streaming it to the server:",
        explanation:
          "Local tracking provides three major benefits: (1) Offline support — activities work without network connectivity. (2) Reduced server load — data is sent once on completion instead of every few seconds, cutting requests by ~100x. (3) Accurate local statistics — data is computed synchronously on the device with no network latency. However, local tracking does NOT eliminate the need for a database — completed activities must still be persisted server-side for the friends feed and historical viewing.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Real-time local statistics are accurate with no network latency",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The system no longer needs a server-side database for activity data",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Activities work in remote areas with no network connectivity",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Server request volume is reduced by approximately 100x",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid data tiering strategies for activity storage",
      type: "question",
      sectionId: "sec_q_realtime_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "With ~547.5 TB of activity data per year, which of the following are valid data tiering strategies? Select ALL that apply:",
        explanation:
          "Hot/warm/cold tiering is standard: recent data stays in fast storage, older data moves to cheaper tiers. Sharding by completion time aligns with recency-biased access patterns. Archival storage (S3) for cold data reduces costs significantly. However, deleting GPS route data after 30 days would destroy a core product feature — users expect to view historical routes indefinitely. Compressing or downsampling old route data would be a better approach than deletion.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Move warm data (3-12 months) to slower, cheaper storage while keeping it queryable",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Delete GPS route data after 30 days to keep storage costs manageable",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Shard the database by activity completion time to optimize recency-biased queries",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Hot tier (recent activities) in fast SSD storage, cold tier (>1 year) in S3 archival",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Correct elements of pause/resume time tracking",
      type: "question",
      sectionId: "sec_q_offline",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "When handling activity time with pauses and resumes, which design elements are correct? Select ALL that apply:",
        explanation:
          'The status-timestamp log approach is correct: maintain an ordered log of state changes with timestamps and sum the active durations. This naturally enables "active time" vs "total time" breakdowns. However, storing elapsed time as a running counter on the server is problematic because it requires continuous server communication and breaks offline functionality. The server should calculate elapsed time from the log on demand or on activity completion.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Maintain a log of status-timestamp pairs (STARTED, PAUSED, RESUMED, STOPPED)",
              isCorrect: true,
            },
            {
              id: "b",
              text: 'The log enables "active time" vs "total time" breakdown as a natural extension',
              isCorrect: true,
            },
            {
              id: "c",
              text: "Calculate elapsed time by summing durations between active pairs, excluding pauses",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Store elapsed time as a running counter that the server increments every second",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Staff-level considerations for Strava system design",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following demonstrate Staff-level thinking in a Strava system design interview? Select ALL that apply:",
        explanation:
          "Staff-level candidates recognize: (1) the client as an active participant, not just a thin UI — this insight reshapes the entire design. (2) That the monolithic backend is intentional, not a shortcut — there's no read/write skew requiring microservices after offloading to the client. (3) Smart buffering to smooth the UX of real-time sharing despite network jitter. However, requiring strong consistency for the friends feed would be over-engineering — the system explicitly favors availability over consistency, and a few seconds of feed delay is acceptable.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Using smart buffering (intentional lag) to smooth real-time sharing UX",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Requiring strong consistency for the friends activity feed to ensure no stale data",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Justifying why a monolithic backend is appropriate here despite the scale requirements",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Proactively identifying the client as an active participant that reshapes the backend design",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Compare server-side vs client-side GPS tracking architectures",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare and contrast two architectures for GPS activity tracking: (1) streaming every GPS coordinate to the server in real-time, and (2) recording locally on the client and syncing on completion. Discuss the tradeoffs in terms of offline support, server load, data durability, and real-time sharing capability.",
        explanation:
          "A strong answer covers: server-streaming provides real-time sharing capability and server-side data durability but fails offline, generates massive write throughput (100x more requests), and requires the backend to handle 10M concurrent activity streams. Client-local tracking solves offline, reduces server load dramatically, and provides better local UX, but sacrifices real-time sharing and risks data loss on device failure (mitigated by periodic local persistence). The optimal design starts with client-local and adds server streaming only when real-time sharing is needed.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Server-side streaming architecture: The client sends GPS coordinates to the server every 2-5 seconds. Advantages: real-time sharing with friends is straightforward, data is immediately durable on the server. Disadvantages: fails completely offline (a deal-breaker for athletes in remote areas), generates enormous write load (~10M concurrent activities × update every 3s = ~3.3M writes/second), and requires sophisticated backend scaling.\n\nClient-local architecture: GPS data is recorded in an in-memory buffer, periodically persisted to local storage (~10s intervals), and batch-uploaded on completion. Advantages: works fully offline, reduces server requests by ~100x (one upload per activity instead of hundreds), provides accurate real-time local stats with no latency. Disadvantages: no real-time sharing capability, risk of data loss on device failure (max 10 seconds with periodic persistence).\n\nThe optimal approach starts with client-local tracking as the default and adds periodic server updates (every 2-5 seconds) only when real-time sharing is enabled. This preserves all the benefits of local tracking while selectively enabling real-time features. The local device continues to be the source of truth for the athlete's own display.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the smart buffering technique for real-time sharing",
      type: "question",
      sectionId: "sec_q_realtime_scaling",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Explain the "smart buffering" technique for displaying a friend\'s live activity. Why does intentionally lagging the display by 5-10 seconds improve the user experience? What specific UX problems does it solve?',
        explanation:
          "A strong answer explains: without buffering, position updates appear as discrete jumps every 2-5 seconds, creating a jarring experience. Smart buffering accumulates 1-2 updates ahead and animates between known positions, creating smooth continuous motion. This also absorbs network jitter — if one update arrives 1 second late, the buffer masks it. The tradeoff is slightly stale positioning data (5-10 seconds behind reality), which is acceptable for watching a friend's run.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Smart buffering intentionally delays the displayed position by 1-2 update intervals (5-10 seconds behind real-time). Here\'s why this improves UX:\n\n1. Smooth animation: Without buffering, the friend\'s position would "teleport" every 2-5 seconds when a new GPS coordinate arrives. With a buffer of upcoming positions, the client can interpolate and animate smooth movement between known coordinates, creating a "live-stream-like" continuous motion effect.\n\n2. Network jitter absorption: If updates arrive at irregular intervals (2s, then 7s, then 1s) due to network conditions, the buffer masks these inconsistencies. The viewer sees constant-speed movement regardless of actual packet timing.\n\n3. Handling missed updates: If one GPS update is dropped or severely delayed, the buffer provides a grace period. The animation continues at the predicted trajectory until the next update arrives, rather than freezing.\n\nThe tradeoff: The viewer sees the athlete\'s position from ~5-10 seconds ago. For the use case of watching a friend run, this is perfectly acceptable — nobody needs sub-second accuracy when the athlete is running a 30-minute route. The perceived quality of the experience (smooth, continuous, reliable) far outweighs the cost of slight staleness.',
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the complete offline activity sync flow",
      type: "question",
      sectionId: "sec_q_offline",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the complete data flow for recording an activity offline and syncing it to the server. Cover: GPS recording, in-memory buffering, local persistence, app crash recovery, network reconnection, data upload, and server confirmation. What is the maximum data loss window and how is it configurable?",
        explanation:
          "A complete answer traces the full lifecycle: GPS sampling → in-memory buffer → periodic local persistence → crash recovery → network detection → batch upload → server ACK → local cleanup. Must discuss the data loss window (equal to persistence interval, default ~10 seconds), recovery from app crashes (load from local storage on reopen), chunking for long activities, and idempotent uploads to handle retry scenarios.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Complete offline activity flow:\n\n1. Activity Start: User taps "Start" → client creates a local activity record with status STARTED, timestamp, and type (RUN/RIDE).\n\n2. GPS Recording: On-device location services (CLLocationManager on iOS, FusedLocationProviderClient on Android) emit GPS coordinates at constant intervals — every 2 seconds for cycling, every 5 seconds for running.\n\n3. In-Memory Buffer: Each coordinate + timestamp pair is appended to an in-memory array. Distance is incrementally calculated using the Haversine formula and displayed to the user in real-time.\n\n4. Local Persistence (every ~10 seconds): The in-memory buffer is serialized and written to local storage (iOS: Core Data or UserDefaults; Android: Room or SharedPreferences). This creates a checkpoint.\n\n5. Crash Recovery: On app reopen, the client checks local storage for saved activity data. If found, it loads the buffer into memory and resumes tracking from the last checkpoint. Maximum data loss = persistence interval (~10 seconds).\n\n6. Activity Completion: User taps "Stop" → final buffer is persisted locally, state set to COMPLETE.\n\n7. Network Detection: The client monitors connectivity. When online, it initiates the upload.\n\n8. Data Upload: All accumulated data (route coordinates, status log, distance, duration) is sent in a single POST or batch request. For very long activities (e.g., 8-hour hike = ~9,600 points), implement chunking — upload in segments of ~1000 coordinates each.\n\n9. Server Processing: The Activity Service validates the data, creates the activity record in the database, stores all route points, and returns a success ACK with the activity ID.\n\n10. Local Cleanup: Upon receiving the ACK, the client deletes the local buffer and checkpoint data.\n\n11. Retry Handling: If the upload fails, the data remains in local storage. A background sync mechanism retries when connectivity is restored. Uploads must be idempotent — use a client-generated activity ID to prevent duplicates on retry.\n\nConfigurable data loss window: The persistence interval (default 10 seconds) is the maximum data loss on unexpected shutdown. This can be decreased (e.g., to 5 seconds) for higher durability at the cost of more battery-consuming disk writes, or increased for longer battery life.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Design a leaderboard that supports both country and time-range filtering",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Design a leaderboard system for Strava that supports filtering by both country and time range. Use Redis as your primary data store. Explain the data structures needed, how updates flow when a new activity is logged, and how queries for "top runners in USA this week" are served.',
        explanation:
          'Must describe: separate sorted sets per country ("leaderboard:run:USA"), ZINCRBY on activity completion, and for time-range: sorted set of activity IDs scored by timestamp + hash per activity with userId and distance. Query flow: ZRANGEBYSCORE for time window → HGETALL for each activity → in-memory aggregation by user → sort. Should discuss caching computed results with short TTL and the memory implications of maintaining many sorted sets.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Redis Leaderboard Design:\n\nData Structures:\n1. Global sorted sets per activity type: "leaderboard:run:global", "leaderboard:ride:global" — members are user IDs, scores are cumulative distances.\n2. Country-specific sorted sets: "leaderboard:run:USA", "leaderboard:run:UK", etc.\n3. For time-range support: a sorted set "activities:timestamps" with activity IDs as members and completion timestamps as scores.\n4. Hash per activity: "activity:{id}" containing fields: user_id, distance, type, country.\n\nUpdate Flow (new activity logged):\n1. Generate activity ID, store activity hash: HSET "activity:abc123" user_id "user42" distance "10.5" type "run" country "USA"\n2. Update global leaderboard: ZINCRBY "leaderboard:run:global" 10.5 "user42"\n3. Update country leaderboard: ZINCRBY "leaderboard:run:USA" 10.5 "user42"\n4. Add to timestamp index: ZADD "activities:timestamps" 1711065600 "abc123"\n\nQuery: "Top runners in USA this week":\n1. Calculate time bounds: week_start = current_timestamp - 7*86400, week_end = current_timestamp\n2. Get activities in time range: ZRANGEBYSCORE "activities:timestamps" week_start week_end\n3. For each activity ID, fetch details: HGETALL "activity:{id}"\n4. Filter by type="run" and country="USA"\n5. Aggregate distances by user_id in application memory\n6. Sort by total distance descending → top N users\n7. Cache the result with TTL of 5-10 minutes to avoid repeated computation\n\nMemory considerations: The global and country sorted sets are compact (userId + score per user). The timestamp sorted set grows with total activities (100M/day). Implement TTL-based cleanup for old activity hashes and trim the timestamp sorted set periodically.\n\nTradeoff: Time-range queries require in-memory aggregation, which is O(activities in range). For a week with 700M activities, this is expensive. Mitigate with: (1) pre-computed weekly/monthly leaderboards via background jobs, (2) caching results with short TTL, (3) combining country filter in step 2 by using per-country timestamp sorted sets.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Justify why a monolithic backend is appropriate for Strava",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Many system design candidates instinctively split services into microservices. Explain why a monolithic Activity Service is a valid (and arguably better) choice for this Strava design. Under what conditions would you consider splitting into microservices?",
        explanation:
          "A strong answer argues: after offloading GPS tracking to the client, the backend has minimal differentiated workloads. There is no significant read/write skew across different paths that would justify independent scaling. A monolith is simpler to deploy, test, and debug. Split into microservices only when: (1) different features have wildly different scaling needs, (2) team size requires organizational boundaries, or (3) specific components (e.g., leaderboard) have distinct data stores or resource profiles.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Why a monolith works here:\n\n1. No significant read/write skew: After offloading GPS tracking to the client, the backend handles two main operations: (a) receiving completed activity uploads and (b) serving activity feeds. Both have moderate, comparable throughput — there is no 1000:1 asymmetry like in a URL shortener that would demand separate services.\n\n2. Reduced backend complexity: The client-side architecture cut backend requests by ~100x. The remaining workload (accept completed activities, serve feeds) is straightforward and doesn't justify the operational overhead of service meshes, inter-service communication, distributed tracing, and independent deployments.\n\n3. Simpler operations: A single service is easier to deploy, monitor, debug, and reason about. One deployment pipeline, one set of logs, one health check.\n\n4. Horizontal scaling suffices: When CPU, memory, or network limits are reached, simply add more instances behind a load balancer. All instances are identical and stateless.\n\nWhen to split:\n- If real-time sharing becomes a major feature, a separate Real-time Tracking Service might be warranted since it has different scaling characteristics (persistent connections, higher throughput).\n- If the leaderboard becomes complex with many filter dimensions, a dedicated Leaderboard Service with its own Redis cluster could be justified.\n- If the engineering team grows beyond ~20-30 engineers, organizational boundaries (Conway's Law) may drive service separation.\n- If analytics/reporting workloads threaten to starve the activity serving path, separate them.\n\nThe meta-lesson: microservices are not inherently better. They solve specific problems (independent scaling, team autonomy, failure isolation) at the cost of distributed system complexity. Start with a monolith and split only when the pain points justify the tradeoffs.",
          minLength: 150,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Handle data consistency between Redis leaderboard and primary database",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "The leaderboard uses Redis Sorted Sets while activity data lives in a relational database. Describe the consistency challenges between these two systems and design a strategy to handle failures during leaderboard updates. What happens if Redis goes down? What if the database write succeeds but the Redis update fails?",
        explanation:
          "Must address: dual-write problem (DB succeeds, Redis fails = leaderboard shows stale data), Redis downtime (leaderboard unavailable but core functionality unaffected), recovery strategies (replay from DB, background reconciliation job). Staff-level: discuss whether to update Redis synchronously (simpler, higher latency) or asynchronously (via event/queue — more resilient but eventually consistent).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Consistency Challenges:\n\nThe fundamental problem is dual-writes: when a new activity is saved, we must update both the relational database and Redis. These are two independent systems with no shared transaction boundary, so partial failures are inevitable.\n\nFailure Scenarios:\n\n1. Database write succeeds, Redis update fails:\n- The activity is saved but the leaderboard is stale (missing this activity's distance).\n- Mitigation: Implement a retry queue. After DB success, enqueue the Redis update. A background worker processes the queue with exponential backoff. If Redis is temporarily down, updates accumulate and are applied when it recovers.\n\n2. Redis update succeeds, database write fails:\n- The leaderboard reflects an activity that doesn't exist. This is worse than scenario 1.\n- Prevention: Always write to the database FIRST. Only update Redis after DB confirmation.\n\n3. Redis goes down entirely:\n- The leaderboard feature becomes unavailable, but core functionality (activity tracking, viewing, sharing) is unaffected since these use the primary database.\n- Recovery: When Redis restarts, run a reconciliation job that scans the activities table and rebuilds the sorted sets: for each user, SUM their distances grouped by activity type and country, then ZADD into the appropriate sorted sets.\n\nDesign Strategy:\n- Synchronous approach: Update Redis in the same request path as the DB write. Simpler but adds latency to activity uploads and couples availability.\n- Asynchronous approach (recommended): After DB write, publish an event (via Kafka or an internal queue). A consumer updates Redis independently. This decouples the systems: activity uploads are fast and reliable, leaderboard updates are eventually consistent (seconds of delay).\n- Periodic reconciliation: Run a daily background job that compares DB aggregates with Redis scores and fixes any drift. This is the safety net for any events lost in the pipeline.\n\nThe leaderboard is inherently an eventually consistent feature — users don't expect their leaderboard position to update instantly. A few seconds or even minutes of staleness is acceptable, which makes the async approach well-suited.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Maximum data loss on unexpected device shutdown",
      type: "question",
      sectionId: "sec_q_offline",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In the offline-first architecture, the client persists GPS data to local storage every 10 seconds. What is the maximum amount of activity data (in seconds) that can be lost if the device unexpectedly shuts down?",
        explanation:
          "The maximum data loss equals the persistence interval — 10 seconds. The in-memory buffer is written to local storage every 10 seconds, so the worst case is a shutdown happening just before the next persistence. All data from the last checkpoint (up to 10 seconds) would be lost. Data before the last checkpoint is safely in local storage.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "10 seconds — equal to the local persistence interval",
          acceptableAnswers: ["10", "10 seconds", "ten seconds", "10s"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Redis command for leaderboard score increment",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Name the Redis command used to atomically increment a user's distance score in a leaderboard sorted set when a new activity is logged.",
        explanation:
          "ZINCRBY atomically increments the score of a member in a sorted set. Usage: ZINCRBY key increment member. If the member doesn't exist, it's added with the increment as its score. This is ideal for leaderboards because it handles both new and existing users in a single atomic operation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "ZINCRBY",
          acceptableAnswers: ["ZINCRBY", "zincrby"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Why no microservices after client-side offloading",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In 1-2 sentences, explain why the Strava backend does not need to be split into microservices despite supporting 10 million concurrent activities.",
        explanation:
          "After offloading GPS tracking to the client, the backend receives completed activities only (not real-time streams), reducing request volume by ~100x. There is no significant read/write skew across different paths that would justify independently scaled microservices — the monolithic Activity Service can simply scale horizontally.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Client-side tracking reduces backend requests by ~100x (completed activities only), and there is no read/write skew requiring independent scaling — horizontal scaling of a monolith suffices.",
          acceptableAnswers: [
            "client-side",
            "offload",
            "100x",
            "no read/write skew",
            "horizontal scaling",
            "monolith",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Naive leaderboard query scalability problem",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In one sentence, explain why a naive SQL query with GROUP BY and SUM to compute the leaderboard is unacceptable at Strava scale.",
        explanation:
          "The query must aggregate over millions (or billions) of activity rows for every leaderboard request, requiring a full table scan with GROUP BY and SUM. At 36.5B activities per year, this aggregation would take seconds to minutes, making real-time leaderboard queries impractical.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "It runs an aggregation (GROUP BY + SUM) over millions/billions of activity rows for every request, making it prohibitively slow at scale.",
          acceptableAnswers: [
            "aggregation",
            "GROUP BY",
            "millions",
            "billions",
            "full table scan",
            "slow",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match Strava entities to their descriptions",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each core Strava entity to its primary purpose:",
        explanation:
          "User stores profile information. Activity captures the metadata for a single run or ride (type, times, state, distance). Route is the collection of GPS coordinates recorded during an activity. Friend represents the bi-directional connection between users that enables the social feed.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            { id: "p1", left: "User", right: "Profile information, settings, and identity" },
            {
              id: "p2",
              left: "Activity",
              right: "Single run/ride with type, timestamps, distance, duration, and state",
            },
            {
              id: "p3",
              left: "Route",
              right: "Collection of GPS coordinates with timestamps from an activity",
            },
            {
              id: "p4",
              left: "Friend",
              right: "Bi-directional connection between users for social sharing",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match leaderboard approaches to their primary weakness",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each leaderboard implementation approach to its primary weakness:",
        explanation:
          "The naive SQL approach aggregates over millions of rows per request — unacceptably slow. Periodic aggregation shows stale data between update intervals (e.g., a daily job means today's activities aren't reflected). Redis Sorted Sets require maintaining consistency between Redis and the primary database, with potential data divergence on failures.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Naive SQL (GROUP BY + SUM)",
              right: "Aggregates millions of rows per request — prohibitively slow at scale",
            },
            {
              id: "p2",
              left: "Periodic Aggregation (background job)",
              right: "Eventual consistency — leaderboard shows stale data between update intervals",
            },
            {
              id: "p3",
              left: "Redis Sorted Sets (real-time)",
              right: "Data consistency challenges between Redis and the primary database",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match real-time communication protocols to appropriate Strava use cases",
      type: "question",
      sectionId: "sec_q_realtime_scaling",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each real-time communication approach to the Strava feature where it is most appropriate:",
        explanation:
          "Polling is best for live activity tracking because updates are predictable (every 2-5 seconds) and slight delay is acceptable. WebSockets would be appropriate if Strava had real-time chat during activities — unpredictable message timing requires server-push. SSE is best for one-directional notifications like activity completion alerts to friends. Batch upload (single request) is used for syncing completed offline activities since there is no real-time requirement.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Short polling (2-5 second intervals)",
              right:
                "Friends watching a live activity — predictable updates, slight delay acceptable",
            },
            {
              id: "p2",
              left: "WebSockets (persistent connection)",
              right: "Hypothetical in-activity chat feature — unpredictable message timing",
            },
            {
              id: "p3",
              left: "Server-Sent Events (SSE)",
              right: "One-directional notifications when a friend completes an activity",
            },
            {
              id: "p4",
              left: "Batch upload (single HTTP request)",
              right: "Syncing completed offline activity data to the server",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "GPS sampling interval for cycling",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "For GPS tracking, coordinates are recorded every _____ seconds for cycling and every _____ seconds for running.",
        explanation:
          "Cycling uses a 2-second interval because cyclists move faster, requiring more frequent sampling for accurate route tracking. Running uses a 5-second interval because runners move slower, so less frequent sampling still captures the route accurately while conserving battery.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "For GPS tracking, coordinates are recorded every {{blank1}} seconds for cycling and every {{blank2}} seconds for running.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "2",
              acceptableAnswers: ["2", "two"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "5",
              acceptableAnswers: ["5", "five"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Server request reduction factor",
      type: "question",
      sectionId: "sec_q_offline",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "By tracking GPS data locally on the client and only uploading on activity completion, server requests are reduced by approximately _____x compared to streaming each coordinate.",
        explanation:
          "Instead of sending a GPS coordinate every few seconds throughout a 30-minute activity (hundreds of requests), the client sends all data in a single batch on completion — roughly a 100x reduction in server requests. This is the key insight that makes scaling to 10M concurrent activities feasible.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "By tracking GPS data locally on the client and only uploading on activity completion, server requests are reduced by approximately {{blank1}}x compared to streaming each coordinate.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "100",
              acceptableAnswers: ["100", "100x", "hundred"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Strava availability vs consistency",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "Strava's non-functional requirements explicitly state that _____ should take priority over _____, meaning the system should remain operational even if some data is temporarily stale.",
        explanation:
          'The system design states "availability >> consistency" — high availability is prioritized over strong consistency. This is appropriate because: (1) a few seconds of feed staleness is acceptable, (2) athletes must always be able to track activities (availability is critical), and (3) the leaderboard is inherently eventually consistent.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "Strava's non-functional requirements explicitly state that {{blank1}} should take priority over {{blank2}}, meaning the system should remain operational even if some data is temporarily stale.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "availability",
              acceptableAnswers: ["availability", "high availability"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "consistency",
              acceptableAnswers: ["consistency", "strong consistency"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Route data storage per activity",
      type: "question",
      sectionId: "sec_q_realtime_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "An average activity lasts 30 minutes with GPS coordinates recorded every 3 seconds. Each route point stores latitude (8 bytes), longitude (8 bytes), and timestamp (8 bytes). How many kilobytes of route data does a single average activity generate? (Round to the nearest whole number)",
        explanation:
          "Number of GPS points: 30 minutes × 60 seconds ÷ 3 seconds = 600 points. Size per point: 8 + 8 + 8 = 24 bytes. Total: 600 × 24 = 14,400 bytes ≈ 14 KB. The article rounds up to ~15KB to account for additional overhead (point IDs, indexing metadata, etc.).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 14,
          tolerance: 2,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Annual storage estimation for activity data",
      type: "question",
      sectionId: "sec_q_realtime_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "With 100 million DAU each producing one activity per day, and each activity generating ~15KB of route data plus ~100 bytes of metadata, how many terabytes of total activity data are generated per year? (Round to the nearest whole number. 1 TB = 10^12 bytes)",
        explanation:
          "Per activity: 15,000 bytes (route) + 100 bytes (metadata) ≈ 15,100 bytes ≈ 15 KB. Per day: 100,000,000 × 15,100 = 1.51 × 10^12 bytes ≈ 1.51 TB. Per year: 1.51 TB × 365 ≈ 551 TB. The article estimates ~547.5 TB, which aligns with this calculation. This is substantial but manageable with sharding and data tiering.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 551,
          tolerance: 30,
        },
      },
    },
  ],
};
