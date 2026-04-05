/**
 * Tinder — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: recommendation feed, swiping consistency, geospatial indexing, match detection, bloom filters
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const tinderContent: StoryPointSeed = {
  title: "Tinder",
  description:
    "Design a location-based dating app that serves personalized profile feeds, handles billions of daily swipes with strong consistency for match detection, and uses geospatial indexing with pre-computation for sub-300ms feed latency at 20M DAU.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements & API Design", orderIndex: 1 },
    { id: "sec_q_consistency", title: "Swipe Consistency & Match Detection", orderIndex: 2 },
    { id: "sec_q_feed", title: "Feed Generation & Geospatial Indexing", orderIndex: 3 },
    { id: "sec_q_dedup", title: "Deduplication & Bloom Filters", orderIndex: 4 },
    { id: "sec_q_scaling", title: "Scaling & Architecture Tradeoffs", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Design
    {
      title: "Tinder — Requirements & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Tinder — Requirements & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Tinder?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Tinder is a mobile dating app that helps people connect by allowing users to swipe right to like or left to pass on profiles. It uses location data and user-specified filters to suggest potential matches nearby. The core system design challenge centers on the recommendation feed, swiping at scale, and real-time match detection.",
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
                  "Users can create a profile with preferences (age range, interests) and specify a maximum distance.",
                  "Users can view a stack of potential matches in line with their preferences and within max distance of their current location.",
                  'Users can swipe right/left on profiles one-by-one to express "yes" or "no" on other users.',
                  "Users get a match notification if they mutually swipe on each other.",
                ],
              },
            },
            {
              id: "b5",
              type: "paragraph",
              content:
                "Out of scope: uploading pictures, DM chat after matching, super swipes, premium features, fake profile detection. The question focuses on the recommendation feed and swiping experience — the functionality that makes the app unique and most complex.",
            },
            {
              id: "b6",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b7",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Strong consistency for swiping: if User A swipes "yes" on User B who already swiped "yes" on them, they must get a match notification.',
                  "Scale to 20M daily active users with ~100 swipes/user/day on average (2B swipes/day).",
                  "Load the potential matches stack with low latency (< 300ms).",
                  "Avoid showing user profiles that the user has previously swiped on.",
                ],
              },
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
                  "User: Represents both a user using the app and a profile that might be shown to others. Includes preferences, location, and profile data.",
                  'Swipe: Expression of "yes" or "no" on a profile; belongs to a swiping_user and references a target_user.',
                  'Match: A connection between 2 users as a result of them both swiping "yes" on each other.',
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
                '// Create/update profile with match preferences\nPOST /profile\n{\n  "age_min": 20, "age_max": 30,\n  "distance": 10,\n  "interestedIn": "female" | "male" | "both"\n}\n\n// Get feed of potential matches (location passed client-side)\nGET /feed?lat={}&long={}&distance={} -> User[]\n\n// Record a swipe decision\nPOST /swipe/{userId}\n{ "decision": "yes" | "no" }',
              metadata: { language: "typescript" },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "All endpoints require authentication via JWT or session token in headers. Location is passed client-side because it changes frequently, unlike preferences stored server-side. The feed endpoint does not need pagination — the app simply requests more recommendations when the current stack is exhausted.",
            },
            {
              id: "b13",
              type: "heading",
              content: "High-Level Design Walkthrough",
              metadata: { level: 2 },
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                "The system has three main service boundaries, each scaling independently: (1) Profile Service handles profile CRUD and stores preferences in a relational/document DB. (2) Feed/Recommendation Service generates the swipe stack using geospatial queries, backed by Elasticsearch for indexed lookups and a cache layer for pre-computed feeds. (3) Swipe Service handles swipe writes and match detection, using Cassandra for durable swipe storage and Redis for atomic match checking.",
            },
            {
              id: "b15",
              type: "heading",
              content: "Why Separate Services?",
              metadata: { level: 3 },
            },
            {
              id: "b16",
              type: "paragraph",
              content:
                "Profile creation happens far less frequently than swiping. With 20M DAU × 100 swipes/day × ~100 bytes/swipe, we generate ~200GB of swipe data per day. This write-heavy workload benefits from Cassandra's LSM-tree architecture and needs to scale independently from the read-heavy feed service. Separating services also enables swipe-specific caching and optimization strategies.",
            },
            {
              id: "b17",
              type: "heading",
              content: "Match Notification Flow",
              metadata: { level: 3 },
            },
            {
              id: "b18",
              type: "paragraph",
              content:
                'When Person B swipes right on Person A (who previously swiped right on Person B): (1) The server detects the mutual swipe. (2) Person B sees an immediate "You Matched!" UI. (3) Person A receives a push notification via APNS (iOS) or FCM (Android). Device-native push notifications handle the asynchronous notification path without requiring us to maintain persistent connections.',
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 2: Deep Dives — Consistency, Feed Generation, Dedup
    {
      title: "Deep Dives — Swipe Consistency, Feed Latency & Deduplication",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Swipe Consistency, Feed Latency & Deduplication",
          blocks: [
            {
              id: "dd1",
              type: "heading",
              content: "Deep Dive 1: Ensuring Consistent, Low-Latency Swiping",
              metadata: { level: 2 },
            },
            {
              id: "dd2",
              type: "paragraph",
              content:
                "The critical failure scenario: Person A and Person B both swipe right at nearly the same time. Without consistency guarantees, both swipes could be saved but neither match is detected — true love lost forever. A reconciliation process could catch this eventually, but the interviewer typically wants you to solve for immediate consistency.",
            },
            {
              id: "dd3",
              type: "heading",
              content: "Bad: Database Polling for Matches",
              metadata: { level: 3 },
            },
            {
              id: "dd4",
              type: "paragraph",
              content:
                "Periodically polling the database for reciprocal swipes introduces latency between polls and fails the requirement for immediate match notification. It also places unnecessary load on the database and hurts user engagement by delaying the dopamine hit of an instant match.",
            },
            {
              id: "dd5",
              type: "heading",
              content: "Good: Cassandra Lightweight Transactions",
              metadata: { level: 3 },
            },
            {
              id: "dd6",
              type: "paragraph",
              content:
                "Cassandra's lightweight transactions (LWT) use Paxos consensus for linearizable consistency, but only within a single partition. They don't support multi-partition atomicity, isolation levels, or rollbacks. The performance overhead (multiple round trips for consensus) makes them impractical at 2B swipes/day across many partitions.",
            },
            {
              id: "dd7",
              type: "heading",
              content: "Great: Sharded Cassandra with Single-Partition Transactions",
              metadata: { level: 3 },
            },
            {
              id: "dd8",
              type: "code",
              content:
                'CREATE TABLE swipes (\n    user_pair text,      -- partition key: smaller_id:larger_id\n    from_user uuid,      -- clustering key\n    to_user uuid,        -- clustering key\n    direction text,\n    created_at timestamp,\n    PRIMARY KEY ((user_pair), from_user, to_user)\n);\n\n-- Sorting IDs ensures (A→B) and (B→A) land in same partition\ndef get_user_pair(user_a, user_b):\n    sorted_ids = sorted([user_a, user_b])\n    return f"{sorted_ids[0]}:{sorted_ids[1]}"',
              metadata: { language: "sql" },
            },
            {
              id: "dd9",
              type: "paragraph",
              content:
                "By using a compound partition key of sorted user IDs (smaller_id:larger_id), all swipes between two users land in the same partition. Cassandra's single-partition transactions can then atomically check for matches. Challenge: partition sizes grow with swipe history, and highly active users create hot partitions. A cleanup/archival strategy is needed.",
            },
            {
              id: "dd10",
              type: "heading",
              content: "Great: Redis for Atomic Match Detection (Recommended)",
              metadata: { level: 3 },
            },
            {
              id: "dd11",
              type: "code",
              content:
                '# Redis key: "swipes:123:456" (sorted IDs)\n# Value: Hash { "123_swipe": "right", "456_swipe": "left" }\n\ndef handle_swipe(from_user, to_user, direction):\n    key = get_key(from_user, to_user)  # sorted\n    \n    # Lua script executes atomically in Redis\n    script = """\n    redis.call(\'HSET\', KEYS[1], ARGV[1], ARGV[2])\n    return redis.call(\'HGET\', KEYS[1], ARGV[3])\n    """\n    other_swipe = redis.eval(script,\n        keys=[key],\n        args=[f"{from_user}_swipe", direction, f"{to_user}_swipe"]\n    )\n    if direction == \'right\' and other_swipe == \'right\':\n        create_match(from_user, to_user)',
              metadata: { language: "python" },
            },
            {
              id: "dd12",
              type: "paragraph",
              content:
                "Redis Lua scripts execute atomically, providing the consistency guarantee we need. The in-memory nature gives sub-millisecond latency. Cassandra remains the durable storage layer. Consistent hashing ensures related swipes land on the same Redis node. If a Redis node fails, only very recent swipes are lost — users can re-swipe, and Cassandra retains the historical record. This hybrid approach gives the best of both worlds.",
            },
            {
              id: "dd13",
              type: "heading",
              content: "Deep Dive 2: Low-Latency Feed Generation",
              metadata: { level: 2 },
            },
            {
              id: "dd14",
              type: "paragraph",
              content:
                "The naive approach queries the user DB directly with WHERE clauses on age, interests, and location. At scale, this is far too slow — especially geospatial bounding-box queries without proper indexing.",
            },
            {
              id: "dd15",
              type: "heading",
              content: "Good: Elasticsearch / OpenSearch with Geospatial Index",
              metadata: { level: 3 },
            },
            {
              id: "dd16",
              type: "paragraph",
              content:
                "A search-optimized database like Elasticsearch handles complex multi-field queries with geospatial indexing efficiently. Use Change Data Capture (CDC) to sync profile updates from the primary DB. Challenge: maintaining consistency between the transactional DB and the search index, and Elasticsearch is read-optimized, not write-optimized.",
            },
            {
              id: "dd17",
              type: "heading",
              content: "Good: Pre-Computation and Caching",
              metadata: { level: 3 },
            },
            {
              id: "dd18",
              type: "paragraph",
              content:
                "Background jobs pre-compute feeds and cache them for instant retrieval. Challenge: active users exhaust cached feeds quickly, and pre-computed feeds become stale as users change location, preferences, or profiles.",
            },
            {
              id: "dd19",
              type: "heading",
              content: "Great: Combined Pre-Computation + Indexed Database",
              metadata: { level: 3 },
            },
            {
              id: "dd20",
              type: "paragraph",
              content:
                "Pre-compute and cache initial feeds for instant access. When users exhaust the cached stack, seamlessly fall back to real-time Elasticsearch queries. Trigger background refresh when a user has a few profiles left, creating the illusion of an infinite stack. Handle stale feeds with short TTLs (< 1 hour), re-computation only for active users, and event-triggered refreshes when a user changes location or preferences. The system has tunable parameters (TTL, cache size, user activity threshold) that operators can adjust without redesigning the system.",
            },
            {
              id: "dd21",
              type: "heading",
              content: "Deep Dive 3: Avoiding Re-Shown Profiles",
              metadata: { level: 2 },
            },
            {
              id: "dd22",
              type: "heading",
              content: "Bad: DB Query + Contains Check",
              metadata: { level: 3 },
            },
            {
              id: "dd23",
              type: "paragraph",
              content:
                "Query the swipe DB for all previously-swiped profiles and filter them out. Problems: eventual consistency means some swipes may not have replicated yet, and users with extensive swipe histories make the contains check progressively more expensive.",
            },
            {
              id: "dd24",
              type: "heading",
              content: "Great: Client-Side Cache + Server-Side Filter",
              metadata: { level: 3 },
            },
            {
              id: "dd25",
              type: "paragraph",
              content:
                "Store the K most recent swipes on the client device as a local cache. The client filters out recently-swiped profiles from new feed batches. This leverages the single-device assumption of dating apps. When the user nears the end of their stack (~profile 150 of 200), the client requests a new feed in the background and locally filters any overlap.",
            },
            {
              id: "dd26",
              type: "heading",
              content: "Great: Bloom Filter for Large Swipe Histories",
              metadata: { level: 3 },
            },
            {
              id: "dd27",
              type: "paragraph",
              content:
                'For users with very large swipe histories, build and cache a Bloom filter. A Bloom filter never produces false negatives (will never say "not swiped" for a swiped profile), ensuring we never re-show a profile. It may produce false positives (occasionally hiding an unswiped profile), but the error rate is tunable. This trades a tiny number of missed recommendations for constant-time O(k) lookups regardless of swipe history size.',
            },
          ],
          readingTime: 15,
        },
      },
    },

    // Material 3: Technology Choices & Interview Expectations
    {
      title: "Technology Choices & Interview Level Expectations",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Technology Choices & Interview Level Expectations",
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
                  "Profile Database: PostgreSQL or DynamoDB — relational or document store for user profile and preference data.",
                  "Swipe Storage: Cassandra — LSM-tree based, append-only writes, optimized for the 2B swipes/day write throughput.",
                  "Match Detection: Redis Cluster — sub-millisecond atomic Lua scripts, consistent hashing for co-located swipe pairs.",
                  "Feed Generation: Elasticsearch / OpenSearch — geospatial indexing, multi-field filtering, real-time querying.",
                  "Feed Cache: Redis or Memcached — pre-computed feed stacks with short TTLs for active users.",
                  "Push Notifications: APNS (iOS) + FCM (Android) — device-native push for asynchronous match alerts.",
                  "Dedup: Client-side cache + server-side Bloom filters — prevent re-showing previously swiped profiles.",
                ],
              },
            },
            {
              id: "kt3",
              type: "heading",
              content: "Why Cassandra for Swipes?",
              metadata: { level: 3 },
            },
            {
              id: "kt4",
              type: "paragraph",
              content:
                "With 20M DAU × 100+ swipes/day, we generate ~2B swipe events daily. Cassandra's write path (commit log → memtable → SSTable) is optimized for exactly this pattern. Partitioning by swiping_user_id gives fast access to a user's swipe history. The tradeoff is eventual consistency, which is why Redis handles the atomic match-detection layer.",
            },
            {
              id: "kt5",
              type: "heading",
              content: "Why Elasticsearch for Feed Generation?",
              metadata: { level: 3 },
            },
            {
              id: "kt6",
              type: "paragraph",
              content:
                "Tinder's feed query involves multi-dimensional filtering (age, gender preference, interests) combined with geospatial proximity. Elasticsearch's inverted index and geo_distance queries handle this combination efficiently. The challenge is keeping the search index in sync with the primary DB via CDC — batching updates reduces write pressure since Elasticsearch is read-optimized.",
            },
            {
              id: "kt7",
              type: "heading",
              content: "Bloom Filter Properties",
              metadata: { level: 3 },
            },
            {
              id: "kt8",
              type: "paragraph",
              content:
                "A Bloom filter is a probabilistic data structure with zero false negatives and a tunable false positive rate. For swipe dedup: a false negative would re-show a swiped profile (never happens), while a false positive hides an unswiped profile (rare, acceptable). With a 1% false positive rate, a Bloom filter for 10,000 swipes requires only ~12KB — far more efficient than storing 10,000 user IDs.",
            },
            {
              id: "kt9",
              type: "heading",
              content: "Interview Level Expectations",
              metadata: { level: 2 },
            },
            {
              id: "kt10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mid-level (E4): Clearly define API endpoints and data model. Build a functional HLD for feed creation, swiping, and matching. Design a solution supporting traditional and geo-spatial filters. Address profile dedup.",
                  "Senior (E5): Speed through initial HLD. Discuss feed generation scalability, cache staleness, and trade-offs in depth. Demonstrate knowledge of geospatial indexing. Be proactive about identifying bottlenecks.",
                  "Staff+ (E6+): Deep tradeoff analysis on consistency models (Cassandra LWT vs Redis atomics). Drive the conversation independently. Discuss tunable system parameters. Treat the interviewer as a peer with practical experience-backed decisions.",
                ],
              },
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
      title: "Why separate Swipe Service from Profile Service?",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In the Tinder system design, the Swipe Service is separated from the Profile Service into its own microservice with a dedicated database. What is the primary architectural reason for this separation?",
        explanation:
          "Swiping generates ~2B events/day (20M DAU × 100 swipes) versus far fewer profile creates/updates. This massive write disparity means the swipe path needs a write-optimized database (Cassandra) that can scale independently, while the profile service can use a relational or document store optimized for reads.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Swipe data must be encrypted differently than profile data for privacy compliance",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Microservices are always preferred over monoliths in system design interviews",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Different teams own different services, so they must be separated for organizational reasons",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Swipe writes vastly outnumber profile writes, requiring independent scaling and a write-optimized database",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Location parameter in feed endpoint",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "The Tinder feed endpoint is designed as GET /feed?lat={}&long={}&distance={}. Why is location passed as a query parameter rather than stored server-side like other preferences (age range, interests)?",
        explanation:
          "Unlike preferences (age range, interests) which change infrequently and are set once in settings, a user's physical location changes constantly as they move. Passing it client-side on each request ensures the feed reflects the user's current position without requiring constant location update writes to the server.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Storing location server-side would violate GDPR privacy regulations",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Location changes frequently as users move, so it should reflect the current position on each request",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Query parameters are faster to process than database lookups for all types of data",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The API gateway cannot access server-side stored preferences",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Push notification for async match alerts",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When Person A swiped right on Person B weeks ago, and Person B finally swipes right on Person A today, how does Person A get notified of the match?",
        explanation:
          "Person A may not be actively using the app, so the system uses device-native push notification services (APNS for iOS, FCM for Android) to send an asynchronous notification. Person B gets the match result immediately in the swipe response. This avoids the need for persistent server connections to offline users.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Person A is only notified the next time they open the app and poll the server",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Via device-native push notifications (APNS/FCM) sent asynchronously",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Via email notification since the user is not actively in the app",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Via a WebSocket connection that the app maintains at all times",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Cassandra partition key for swipe consistency",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'To enable single-partition transactions for match detection in Cassandra, swipes are stored with a partition key of "smaller_user_id:larger_user_id". Why is sorting the two user IDs before creating the key essential?',
        explanation:
          'Sorting ensures that swipe A→B and swipe B→A produce the same partition key, placing both records in the same Cassandra partition. Without sorting, the two swipes would generate different keys ("A:B" vs "B:A") and land on different partitions, making atomic match detection via single-partition transactions impossible.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "It prevents duplicate swipe records from being created in the same partition",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It guarantees both A→B and B→A swipes land in the same partition, enabling atomic match checks",
              isCorrect: true,
            },
            {
              id: "c",
              text: "It reduces the total number of partitions needed in the cluster",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Cassandra requires partition keys to be lexicographically sorted for efficient lookups",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Why not use Cassandra LWT at scale?",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Cassandra's Lightweight Transactions (LWT) seem like a natural choice for ensuring swipe consistency. Why are they considered inadequate for Tinder's scale of 2 billion swipes per day?",
        explanation:
          "LWTs use a Paxos consensus protocol requiring multiple round trips between nodes, adding 10-100x latency overhead compared to normal writes. They only support single-partition atomicity — no multi-partition operations, no rollbacks, no isolation levels. At 2B swipes/day, this overhead and limitation make LWTs impractical for the swipe matching workflow.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "LWTs use Paxos consensus with significant performance overhead and only support single-partition atomicity",
              isCorrect: true,
            },
            {
              id: "b",
              text: "LWTs require all data to fit on a single node, which is impossible at this scale",
              isCorrect: false,
            },
            {
              id: "c",
              text: "LWTs are deprecated in modern versions of Cassandra",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Cassandra does not support any form of transactions or consistency guarantees",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Feed staleness triggers",
      type: "question",
      sectionId: "sec_q_feed",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Pre-computed feed caches can become stale. Which of the following is the BEST strategy for managing cache staleness in Tinder's feed system?",
        explanation:
          "Short TTLs combined with event-triggered refreshes provide the best balance. TTLs ensure all caches eventually expire, while event triggers (location change, preference update) immediately invalidate specific caches. Only warming caches for active users avoids wasted computation. Fixed hourly recomputation for all users is wasteful, and real-time-only queries sacrifice the low-latency benefit of pre-computation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Use long TTLs (24 hours) and rely on users manually refreshing the app to get new profiles",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Recompute all user feeds every hour regardless of activity to ensure freshness",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Short TTLs (< 1 hour), event-triggered refreshes on location/preference changes, and cache warming only for active users",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Never cache feeds — always generate them in real-time from Elasticsearch",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Redis vs Cassandra for match detection",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "The recommended architecture uses Redis for atomic match detection and Cassandra for durable swipe storage. A team member proposes eliminating Redis and using only Cassandra with the sorted user-pair partition key. What is the most significant risk of this simplification?",
        explanation:
          "While the sorted partition key approach works in theory, Cassandra's BATCH statements cannot include SELECT queries per official documentation. You would need to use SERIAL consistency level reads after LWT writes, which adds ~10-100x latency overhead per operation. At 2B swipes/day, this is prohibitively slow. Redis Lua scripts provide true atomic read-modify-write in sub-millisecond time, making the hybrid approach necessary for meeting latency requirements.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Redis is required for all push notification delivery and cannot be removed from the architecture",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Cassandra does not support any form of partitioning, making co-located swipes impossible",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Cassandra BATCH cannot include SELECT statements, and SERIAL consistency reads add prohibitive latency at 2B swipes/day",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Cassandra cannot store swipe data at all because it lacks support for string-type partition keys",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Redis node failure impact on match detection",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In the hybrid Redis + Cassandra architecture, a Redis node in the consistent hashing ring fails and is replaced. What is the actual impact on the system and what is the correct recovery strategy?",
        explanation:
          "Since Cassandra is the durable storage layer and Redis serves as the fast atomic match-detection layer, a Redis node failure means only very recent swipes (not yet flushed to Cassandra) lose their match-detection capability. Users can simply re-swipe, and matches will be detected on the new node. The system degrades gracefully because no permanent data is lost — the critical invariant (no missed matches for durable swipes) can be restored by replaying recent Cassandra data to warm the new Redis node.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Only very recent match detections are lost; Cassandra retains all swipe data, and new Redis node can be warmed from Cassandra",
              isCorrect: true,
            },
            {
              id: "b",
              text: "All swipe history is permanently lost and users must re-create their profiles",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The entire system goes down because Redis is a single point of failure",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Cassandra automatically takes over match detection with no impact on latency",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Core entities in Tinder system design",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are core entities in the Tinder system design? Select ALL that apply.",
        explanation:
          "The three core entities are User (represents both the app user and their profile shown to others), Swipe (an expression of yes/no on a profile, linking swiping_user to target_user), and Match (a connection between two users who both swiped yes). Message and Payment are out of scope for this design — chat/DM and premium features are explicitly excluded from the functional requirements.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Message", isCorrect: false },
            { id: "b", text: "Match", isCorrect: true },
            { id: "c", text: "User", isCorrect: true },
            { id: "d", text: "Swipe", isCorrect: true },
            { id: "e", text: "Payment", isCorrect: false },
          ],
          multiSelect: true,
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Causes of stale feed profiles",
      type: "question",
      sectionId: "sec_q_feed",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          'Pre-computed feed caches can contain "stale" profiles that no longer match the user\'s criteria. Which of the following can cause a cached profile to become stale? Select ALL that apply.',
        explanation:
          "All four options cause staleness. A suggested user moving locations may push them outside the distance filter. A suggested user changing their profile/preferences may no longer match criteria. The feed consumer changing their own filter criteria invalidates existing cached matches. The feed consumer relocating means cached profiles based on the old location are no longer relevant. All of these are real scenarios that the system must handle via TTLs, event-triggered refreshes, and background re-computation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "A suggested user changes their location and is no longer within distance",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The Elasticsearch cluster performs a scheduled index refresh",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The requesting user moves to a significantly different location",
              isCorrect: true,
            },
            {
              id: "d",
              text: "A suggested user updates their profile and no longer matches filter criteria",
              isCorrect: true,
            },
            {
              id: "e",
              text: "The requesting user changes their own filter preferences",
              isCorrect: true,
            },
          ],
          multiSelect: true,
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Properties of Bloom filters for swipe dedup",
      type: "question",
      sectionId: "sec_q_dedup",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "A Bloom filter is used to prevent re-showing previously-swiped profiles. Which of the following statements about Bloom filters are correct in this context? Select ALL that apply.",
        explanation:
          'Bloom filters guarantee zero false negatives — they will never say "not swiped" for a profile that was swiped, so no re-shown profiles. They can produce false positives — occasionally marking an unswiped profile as swiped, hiding it unnecessarily. The false positive rate is tunable by adjusting filter size. Elements cannot be removed from a standard Bloom filter (counting Bloom filters support deletion but add complexity). Bloom filters are NOT 100% accurate — their probabilistic nature is the fundamental tradeoff for space efficiency.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "They may produce false positives — occasionally hiding an unswiped profile",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Elements can be easily removed from a standard Bloom filter",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The false positive rate is tunable by adjusting the filter size",
              isCorrect: true,
            },
            {
              id: "d",
              text: "They are 100% accurate with no tradeoffs compared to a hash set",
              isCorrect: false,
            },
            {
              id: "e",
              text: "They guarantee zero false negatives — a swiped profile will never be re-shown",
              isCorrect: true,
            },
          ],
          multiSelect: true,
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Redis Lua script atomic guarantees",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Redis Lua scripts are used for atomic match detection in the Tinder system. Which of the following are TRUE about Redis Lua scripts in this context? Select ALL that apply.",
        explanation:
          "Redis is single-threaded, so Lua scripts execute atomically — no other command can interleave during execution. They can perform multiple operations (HSET + HGET) as a single atomic unit, which is exactly what match detection needs (write swipe + check for reciprocal). They execute in-memory for sub-millisecond latency. However, Lua scripts operate on a single Redis node — they cannot span multiple nodes in a cluster. They also do not persist to Cassandra; that's handled by the application layer separately.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "They can atomically span multiple Redis nodes in a cluster",
              isCorrect: false,
            },
            {
              id: "b",
              text: "They execute in-memory, providing sub-millisecond latency for match detection",
              isCorrect: true,
            },
            {
              id: "c",
              text: "They execute atomically because Redis is single-threaded — no interleaving possible",
              isCorrect: true,
            },
            {
              id: "d",
              text: "They automatically persist swipe data to Cassandra as a side effect",
              isCorrect: false,
            },
            {
              id: "e",
              text: "They can combine HSET and HGET into a single atomic operation for write-then-check",
              isCorrect: true,
            },
          ],
          multiSelect: true,
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Explain the race condition in swipe matching",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Describe the race condition that can occur when two users swipe right on each other at nearly the same time. Walk through the exact sequence of events that leads to a missed match, and explain why this is problematic from a user experience perspective.",
        explanation:
          "A strong answer describes: (1) Person A's swipe hits the server; server checks for inverse swipe from B → finds nothing. (2) Person B's swipe hits the server; server checks for inverse swipe from A → finds nothing (A's write hasn't committed yet). (3) Both swipes are saved to the DB, but neither triggered a match check at the right time. (4) Both users are now unaware they matched. This is devastating for UX — the core value proposition of the app (finding mutual interest) is broken. The \"dopamine hit\" of instant match notification is critical to engagement.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          minWords: 50,
          maxWords: 300,
          sampleAnswer:
            "When Person A and Person B both swipe right at nearly the same time, the following race condition can occur: (1) Person A's swipe request reaches the server, which checks the database for a reciprocal swipe from Person B — none exists yet. (2) Simultaneously, Person B's swipe request also reaches the server and checks for Person A's swipe — the write hasn't committed yet, so none is found. (3) Both swipes are saved to the database, but neither triggered a match detection. The result: both users liked each other but neither is ever notified. This is catastrophic for UX because the instant match notification is the core engagement loop of the app. Without it, users lose trust that their swipes are being processed correctly, and potential matches are permanently lost.",
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Compare pre-computation vs real-time feed generation",
      type: "question",
      sectionId: "sec_q_feed",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare pure pre-computation (cached feeds) versus pure real-time querying (Elasticsearch) for Tinder's feed generation. What are the strengths and weaknesses of each approach, and why is a hybrid approach superior?",
        explanation:
          "A strong answer covers: Pre-computation gives instant load times but suffers from staleness (location changes, preference updates) and is expensive for inactive users. Real-time Elasticsearch gives always-fresh results but can't meet the < 300ms latency requirement under load. The hybrid serves cached feeds instantly for the first interaction, then falls back to real-time queries when the cache is exhausted or stale, combining low latency with freshness.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          minWords: 60,
          maxWords: 350,
          sampleAnswer:
            "Pre-computation caches feeds via background jobs, providing instant access when users open the app. However, cached feeds become stale as users and profiles change locations/preferences, and computing feeds for inactive users wastes resources. Pure real-time querying via Elasticsearch always returns fresh results matching current criteria, but complex multi-field + geospatial queries at scale cannot consistently meet the < 300ms latency target, especially during peak hours. The hybrid approach serves pre-computed cached feeds for the initial stack (instant load), then seamlessly transitions to real-time Elasticsearch queries when the cache is exhausted. Background refresh triggers when ~75% of the cached stack is consumed, creating an infinite-scroll illusion. Short TTLs and event-triggered invalidation handle staleness. This gives the best of both worlds: sub-300ms initial load with always-fresh fallback.",
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the Redis + Cassandra hybrid swipe architecture",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the complete data flow for a swipe event in the hybrid Redis + Cassandra architecture. Cover: (1) how the swipe is received, (2) how match detection works atomically, (3) how durable storage is handled, and (4) what happens if the Redis node fails after the atomic check but before Cassandra write completes.",
        explanation:
          "A complete answer covers: Swipe request → Swipe Service constructs sorted key (smaller_id:larger_id) → Redis Lua script atomically sets the swipe and checks for reciprocal → if match detected, trigger notifications → asynchronously write to Cassandra for durability. On Redis failure after atomic check but before Cassandra write: the user can re-swipe (idempotent operation), and the new Redis node can be warmed from recent Cassandra data. The key insight is that Redis is the fast path for match detection, Cassandra is the durable record of truth, and the system is designed to recover gracefully from partial failures.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          minWords: 80,
          maxWords: 400,
          sampleAnswer:
            'The data flow: (1) Client sends POST /swipe/{userId} with decision "yes"/"no". The Swipe Service receives this and constructs a Redis key by sorting both user IDs: "swipes:min(A,B):max(A,B)". (2) A Redis Lua script executes atomically: HSET the current user\'s swipe direction, then HGET the other user\'s swipe. Since Redis is single-threaded, no interleaving is possible. If both swipes are "yes", it\'s a match. (3) The Swipe Service writes the swipe to Cassandra (partitioned by swiping_user_id) for durable storage. If a match was detected, it writes a Match record and triggers notifications — immediate UI for the current swiper, APNS/FCM push for the other user. (4) If the Redis node fails after atomic check but before Cassandra write: the swipe data in Redis is lost, but no false match was created. The user can simply swipe again. When a replacement Redis node joins the cluster, it can be warmed by replaying recent Cassandra swipe data for the partitions it now owns. The worst case is a temporary inability to detect matches for recent swipes — never a false match or permanent data loss.',
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Bloom filter sizing and tradeoff analysis",
      type: "question",
      sectionId: "sec_q_dedup",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A power user has swiped on 50,000 profiles. Design the Bloom filter configuration for their swipe dedup. Include: (1) the size of the Bloom filter, (2) the number of hash functions, (3) the expected false positive rate, and (4) the tradeoff between false positives and memory usage. Compare this to storing all 50,000 user IDs directly.",
        explanation:
          "A strong answer applies the Bloom filter formula: m = -n*ln(p) / (ln2)^2 where n=50000 and p=0.01 gives ~60KB. Optimal hash functions k = (m/n)*ln2 ≈ 7. Direct storage of 50,000 UUIDs (16 bytes each) = 800KB. The Bloom filter is ~13x more space efficient at a 1% false positive rate. The tradeoff: lowering p to 0.1% requires ~90KB (still much less than 800KB), while raising p to 5% requires only ~40KB but hides ~2500 profiles unnecessarily.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          minWords: 60,
          maxWords: 400,
          sampleAnswer:
            "For n=50,000 swipes with a target false positive rate p=1%: Bloom filter size m = -n*ln(p)/(ln2)^2 ≈ 479,253 bits ≈ 60KB. Optimal hash functions k = (m/n)*ln2 ≈ 6.6, so use k=7. Expected false positive rate: ~1%, meaning roughly 1 in 100 unswiped profiles gets incorrectly filtered out — acceptable for a dating app. Comparison: storing 50,000 UUIDs at 16 bytes each = 800KB, plus hash set overhead ≈ 1.2MB. The Bloom filter is ~13-20x more space efficient. Tradeoff analysis: reducing p to 0.1% increases filter size to ~90KB (still far less than direct storage) but reduces hidden profiles to ~50. Increasing p to 5% reduces filter size to ~40KB but hides ~2,500 profiles unnecessarily, degrading the matching pool. The 1% sweet spot balances memory, accuracy, and user experience. For a platform with 20M DAU, even 60KB per user × millions of users requires careful memory management — only build Bloom filters for users exceeding a swipe threshold (e.g., 10,000+).",
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Geospatial indexing strategy for Tinder",
      type: "question",
      sectionId: "sec_q_feed",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain why a naive SQL query with latitude/longitude bounding box conditions is insufficient for Tinder's feed generation at scale. Describe how Elasticsearch's geospatial indexing solves this, and discuss the data synchronization challenge between the primary database and Elasticsearch.",
        explanation:
          "A strong answer explains: Bounding-box queries (WHERE lat BETWEEN x1 AND x2 AND long BETWEEN y1 AND y2) require full table scans or B-tree indexes that handle each dimension independently — very inefficient for 2D proximity. Elasticsearch uses geospatial data structures (geo_point fields with geohash-based indexing or BKD trees) that efficiently handle proximity queries. The sync challenge: CDC (Change Data Capture) pipelines must propagate profile updates to Elasticsearch. Since ES is read-optimized, updates should be batched. Staleness between primary DB and ES is acceptable for short windows but must be bounded.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          minWords: 60,
          maxWords: 400,
          sampleAnswer:
            "A naive SQL query like SELECT * FROM users WHERE lat BETWEEN x1 AND x2 AND long BETWEEN y1 AND y2 performs poorly at scale because B-tree indexes handle each dimension independently. The database must scan one index for latitude, another for longitude, and intersect the results — an O(n) operation when the bounding box contains millions of users. Adding compound indexes helps marginally but doesn't solve the fundamental 2D proximity problem. Elasticsearch solves this with geo_point field types that use geohash-based or BKD-tree indexing, enabling efficient geo_distance queries that find all users within a radius. Combined with inverted indexes for age, gender, and interest filters, ES can execute the full multi-dimensional feed query efficiently. The sync challenge: profile data lives in the primary transactional DB (PostgreSQL/DynamoDB), but ES needs a copy for querying. CDC mechanisms (Debezium, DynamoDB Streams) capture changes and push them to ES. Since ES is read-optimized and segment-based, frequent small writes are expensive — batch updates at short intervals (seconds to minutes). The acceptable staleness window means a brand-new profile might not appear in feeds for a few seconds, which is fine for a dating app.",
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Staff-level discussion: eventual consistency alternative",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "The article mentions an alternative approach: instead of strong consistency for swipe matching, use eventual consistency with a periodic reconciliation process to detect missed matches. Discuss the tradeoffs of this approach versus the Redis atomic approach. When might the eventual consistency approach be acceptable?",
        explanation:
          "A staff-level answer recognizes: The reconciliation approach trades immediate match notification for simpler architecture (no Redis layer, just Cassandra). Missed matches are detected by a background job scanning for reciprocal swipes, and both users are notified retroactively — they assume the other person just swiped. This is acceptable if: (1) the reconciliation interval is very short (seconds to minutes), (2) the business prioritizes system simplicity and availability over the immediate match UX, or (3) the platform is early-stage with lower DAU where the race condition is rare. The Redis approach is necessary when immediate match notification is a hard UX requirement and scale makes race conditions frequent.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          minWords: 60,
          maxWords: 400,
          sampleAnswer:
            "The eventual consistency + reconciliation approach eliminates the Redis layer entirely. Swipes are written to Cassandra, and a periodic background job scans for reciprocal swipes that weren't caught in real-time, sending both users a match notification retroactively. Users don't know the difference — they just see a match appear. Tradeoffs: (Pro) Simpler architecture — no Redis cluster to manage, no Lua scripts, no consistent hashing ring rebalancing. Single durable store reduces operational complexity. (Pro) Higher availability — no dependency on Redis for the critical path. (Con) Match notifications are delayed by the reconciliation interval, degrading the \"instant dopamine hit\" UX. (Con) At 2B swipes/day with 20M DAU, the race condition is frequent enough that many matches would be delayed. (Con) The reconciliation job itself is expensive at scale — scanning billions of swipes for unmatched pairs. Acceptable when: the platform is early-stage with lower DAU (race conditions are rare), the business prioritizes system simplicity, or the reconciliation interval can be kept very short (< 30 seconds) using event-driven triggers rather than polling. At Tinder's scale, the Redis approach is worth the operational complexity because immediate match detection is the core engagement driver.",
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Swipe data volume estimation",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Given 20M daily active users doing an average of 100 swipes per day, with each swipe record being approximately 100 bytes, how much raw swipe data is generated per day? Show your calculation.",
        explanation:
          "20M users × 100 swipes/user × 100 bytes/swipe = 200,000,000,000 bytes = 200GB per day. This volume justifies using Cassandra (write-optimized) over a relational database and motivates the need for separate swipe storage from profile data.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          maxLength: 200,
          sampleAnswer:
            "20M × 100 swipes × 100 bytes = 200 billion bytes = 200GB per day. At this volume, a write-optimized database like Cassandra is essential.",
        },
      },
    },

    // Text 2 — medium
    {
      title: "Client-side cache justification",
      type: "question",
      sectionId: "sec_q_dedup",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Why is it valid to use a client-side cache (on the mobile device) for storing recent swipe history in Tinder's dedup system? What fundamental assumption about dating apps makes this work?",
        explanation:
          "The key assumption is that dating apps are used on a single device per user. Since there is no multi-device scenario to worry about, the client device can reliably track recent swipes. This avoids the cost of a server-side cache for dedup while providing immediate filtering of already-swiped profiles from new feed batches.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          maxLength: 200,
          sampleAnswer:
            "Dating apps like Tinder are used on a single mobile device per user. This single-device assumption means the client can reliably track recent swipes locally without cross-device sync issues, avoiding the cost of server-side dedup caching.",
        },
      },
    },

    // Text 3 — hard
    {
      title: "Hot partition problem with sorted user pair key",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "The sorted user-pair partition key (smaller_id:larger_id) in Cassandra solves the consistency problem but introduces a potential hot partition issue. Describe the scenario and suggest a mitigation strategy.",
        explanation:
          "Highly popular users (celebrities, influencers) will appear as one half of many user-pair keys, causing their partitions to receive disproportionate write traffic. Mitigation: archive old swipe pairs aggressively (most matches are determined within hours), implement TTL-based cleanup, or add a time-bucket suffix to the partition key to spread writes across smaller partitions while keeping the consistency window short.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          maxLength: 300,
          sampleAnswer:
            "A highly popular user (celebrity/influencer) appears in millions of user-pair keys, causing those partitions to receive disproportionate traffic. Since the partition key is smaller_id:larger_id, all swipes involving this popular user are spread across many partitions, but each partition containing their ID grows large. Mitigation: aggressive TTL-based cleanup of processed swipe pairs, time-bucketed partition keys (e.g., smaller_id:larger_id:day), or moving match detection to Redis entirely and using Cassandra only for durable storage with per-user partitioning.",
        },
      },
    },

    // Text 4 — hard
    {
      title: "CDC sync delay impact",
      type: "question",
      sectionId: "sec_q_feed",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "When using Change Data Capture (CDC) to sync profile data from the primary database to Elasticsearch, there is an inherent sync delay. What specific user-facing issue can this cause in Tinder, and is it acceptable?",
        explanation:
          "A newly created profile may not appear in other users' feeds for the duration of the CDC sync delay (seconds to minutes). Similarly, a user who just changed their preferences or moved cities might still appear in feeds matching their old criteria. This is generally acceptable: a few seconds of delay in a dating app is imperceptible to users, and the system can bound the staleness window through batching configuration.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          maxLength: 300,
          sampleAnswer:
            "A newly created or updated profile may not appear in (or be removed from) other users' feeds during the sync delay. For example, a user who moves to a new city might still appear in feeds at their old location for seconds to minutes. This is acceptable for a dating app — the delay is imperceptible and the tradeoff is worthwhile for the architectural benefit of decoupling the write-optimized primary store from the read-optimized search index.",
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match system components to responsibilities",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content:
          "Match each system component to its primary responsibility in the Tinder architecture.",
        explanation:
          "Each component has a distinct role: Cassandra provides durable, high-throughput swipe storage. Redis provides atomic match detection via Lua scripts. Elasticsearch powers the feed with geospatial and multi-field queries. APNS/FCM handles asynchronous push notifications to offline users.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Cassandra",
              right: "Durable swipe storage with high write throughput",
            },
            { id: "p2", left: "Redis", right: "Atomic match detection via Lua scripts" },
            {
              id: "p3",
              left: "Elasticsearch",
              right: "Geospatial feed generation with multi-field filtering",
            },
            {
              id: "p4",
              left: "APNS / FCM",
              right: "Asynchronous push notifications to offline users",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match feed generation approaches to tradeoffs",
      type: "question",
      sectionId: "sec_q_feed",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each feed generation strategy to its primary weakness.",
        explanation:
          "Each approach has a characteristic weakness: naive SQL queries are fundamentally slow for geospatial proximity at scale. Pure pre-computation suffers from stale cached profiles. Pure real-time ES queries can't consistently meet latency targets under peak load. The hybrid approach's main complexity is managing the transition between cached and real-time modes and handling cache invalidation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Naive SQL bounding-box query",
              right: "Prohibitively slow geospatial lookups at scale",
            },
            {
              id: "p2",
              left: "Pure pre-computation + cache",
              right: "Stale profiles when users move or change preferences",
            },
            {
              id: "p3",
              left: "Pure real-time Elasticsearch",
              right: "Cannot consistently meet < 300ms latency under peak load",
            },
            {
              id: "p4",
              left: "Hybrid pre-computation + ES fallback",
              right: "Complexity of cache invalidation and transition logic",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match swipe consistency approaches to failure modes",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each swipe consistency approach to the specific failure mode or limitation that makes it insufficient (or its key tradeoff).",
        explanation:
          "Database polling fails on immediacy — users don't get instant match notifications. Cassandra LWT fails on scale — Paxos consensus adds 10-100x latency overhead per operation. Sharded Cassandra with single-partition transactions has the operational challenge of unbounded partition growth for active user pairs. Redis atomic operations have the tradeoff of being volatile — node failures lose recent match-detection state (recovered from Cassandra).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Database polling for matches",
              right: "Inherent latency between polls prevents instant match notification",
            },
            {
              id: "p2",
              left: "Cassandra lightweight transactions",
              right: "Paxos consensus adds 10-100x latency, impractical at 2B swipes/day",
            },
            {
              id: "p3",
              left: "Sharded Cassandra single-partition txn",
              right: "Partition sizes grow unbounded for active user pairs",
            },
            {
              id: "p4",
              left: "Redis atomic Lua scripts",
              right: "Volatile storage — node failure loses recent match detection state",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "Cassandra write path components",
      type: "question",
      sectionId: "sec_q_dedup",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Cassandra's write-optimized storage engine writes first to an append-only ___1___ on disk for durability, then to an in-memory ___2___. These are periodically flushed to disk as ___3___.",
        explanation:
          "Cassandra's LSM-tree (Log-Structured Merge-tree) write path: (1) Commit Log — an append-only file on disk ensuring durability. (2) Memtable — an in-memory sorted data structure for fast writes. (3) SSTables (Sorted String Tables) — immutable on-disk files created when memtables are flushed. This architecture is what makes Cassandra ideal for high-throughput write workloads like swipe storage.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            {
              id: "b1",
              answer: "commit log",
              acceptableAnswers: ["commit log", "commitlog", "write-ahead log", "WAL"],
            },
            {
              id: "b2",
              answer: "memtable",
              acceptableAnswers: ["memtable", "mem table", "memory table"],
            },
            {
              id: "b3",
              answer: "SSTables",
              acceptableAnswers: ["SSTables", "sstables", "Sorted String Tables", "SS tables"],
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Tinder scale numbers",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Tinder's system is designed for ___1___ million daily active users, each performing approximately ___2___ swipes per day, generating a total of approximately ___3___ billion swipes per day.",
        explanation:
          "The non-functional requirements specify 20M DAU with ~100 swipes/user/day on average. 20M × 100 = 2 billion swipes per day. These numbers drive all the scaling decisions: separate swipe service, Cassandra for writes, Redis for atomic operations, and pre-computed feeds.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "b1", answer: "20", acceptableAnswers: ["20", "20M", "twenty"] },
            { id: "b2", answer: "100", acceptableAnswers: ["100", "one hundred", "~100"] },
            { id: "b3", answer: "2", acceptableAnswers: ["2", "2B", "two", "2 billion"] },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Redis consistent hashing for swipe pairs",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "In the Redis-based match detection system, the key is constructed by ___1___ both user IDs and joining them with a separator. This ensures that swipe A→B and swipe B→A map to the ___2___ Redis key and land on the ___3___ Redis node via consistent hashing.",
        explanation:
          "Sorting the user IDs ensures deterministic key construction regardless of which user swipes first. The same key means both swipes are stored in the same Redis hash, enabling atomic match detection via Lua scripts. Consistent hashing routes the same key to the same Redis node, so the Lua script can read and write both swipes atomically.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            {
              id: "b1",
              answer: "sorting",
              acceptableAnswers: [
                "sorting",
                "ordering",
                "alphabetically sorting",
                "lexicographically sorting",
              ],
            },
            { id: "b2", answer: "same", acceptableAnswers: ["same", "identical", "exact same"] },
            {
              id: "b3",
              answer: "same",
              acceptableAnswers: ["same", "identical", "single", "exact same"],
            },
          ],
        },
      },
    },

    // --- Numerical (2 questions) ---

    // Numerical 1 — medium
    {
      title: "Daily swipe storage estimation",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "Tinder has 20 million daily active users, each performing 100 swipes per day. Each swipe record is approximately 100 bytes. How many gigabytes (GB) of raw swipe data are generated per day?",
        explanation:
          "Calculation: 20,000,000 users × 100 swipes × 100 bytes = 200,000,000,000 bytes = 200 GB/day. This is ~73 TB/year of raw swipe data, which is why Cassandra (with its write-optimized LSM-tree storage) and separate swipe storage are necessary. This volume also motivates the cleanup/archival strategy for old swipe data.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          answer: 200,
          unit: "GB",
          tolerance: 10,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Peak swipe throughput estimation",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "Tinder has 20 million DAU each doing 100 swipes per day. Assume swipes are concentrated in an 8-hour active window and peak traffic is 3× the average during that window. What is the peak swipe throughput in swipes per second?",
        explanation:
          "Total swipes per day: 20M × 100 = 2B. Over an 8-hour active window: 2B / (8 × 3600) = 2B / 28,800 ≈ 69,444 swipes/second average. Peak at 3× average: 69,444 × 3 ≈ 208,333 swipes/second. This is approximately 208K swipes/second at peak. This throughput demands horizontal scaling of the Swipe Service, Cassandra cluster, and Redis cluster.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          answer: 208333,
          unit: "swipes/second",
          tolerance: 20000,
        },
      },
    },

    // --- True/False (2 questions) ---

    // True/False 1 — easy (bonus)
    {
      title: "Feed pagination in Tinder",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "True or False: The Tinder feed endpoint requires pagination (offset/limit or cursor-based) to handle large result sets, just like a social media feed.",
        explanation:
          'FALSE. Unlike social media feeds where users scroll through a timeline, Tinder generates recommendations. There is no "page 2" of results. When the current stack is exhausted, the app simply requests a new batch of recommendations. This is a recommendation engine, not a paginated list — a subtle but important distinction in the API design.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "False — Tinder generates recommendations, not paginated lists; the app requests a new batch when exhausted",
              isCorrect: true,
            },
            {
              id: "b",
              text: "True — pagination is needed to handle the large pool of potential matches",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // True/False 2 — medium (bonus)
    {
      title: "Bloom filter false negative guarantee",
      type: "question",
      sectionId: "sec_q_dedup",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "True or False: A Bloom filter used for swipe dedup can incorrectly tell the system that a user HAS been swiped on when they haven't, but it will NEVER tell the system that a user has NOT been swiped on when they actually have.",
        explanation:
          "TRUE. This is the fundamental property of Bloom filters: zero false negatives, tunable false positives. In the swipe dedup context, a false positive means occasionally hiding an unswiped profile (minor UX impact), while a false negative would mean re-showing a swiped profile (unacceptable UX). The Bloom filter guarantees the unacceptable case never happens.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "False — Bloom filters can produce both false positives and false negatives",
              isCorrect: false,
            },
            {
              id: "b",
              text: "True — Bloom filters have zero false negatives but may produce false positives",
              isCorrect: true,
            },
          ],
        },
      },
    },
  ],
};
