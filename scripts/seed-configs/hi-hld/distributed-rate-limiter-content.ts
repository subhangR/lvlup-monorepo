import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const distributedRateLimiterContent: StoryPointSeed = {
  title: "Distributed Rate Limiter",
  description:
    "Design a distributed rate limiter for a social media platform handling 1M requests/second. Covers rate limiting algorithms, Redis-based state management, sharding strategies, fault tolerance, and dynamic configuration.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_fundamentals", title: "Fundamentals & API Design", orderIndex: 1 },
    { id: "sec_q_algorithms", title: "Rate Limiting Algorithms", orderIndex: 2 },
    { id: "sec_q_redis", title: "Redis Implementation & Atomicity", orderIndex: 3 },
    { id: "sec_q_scaling", title: "Scaling & Sharding", orderIndex: 4 },
    { id: "sec_q_availability", title: "Availability, Fault Tolerance & Tradeoffs", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Problem Understanding & Architecture
    {
      title: "Rate Limiter — Problem & Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Distributed Rate Limiter — Problem & Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is a Rate Limiter?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                'A rate limiter controls how many requests a client can make within a specific timeframe. It acts like a traffic controller for your API — allowing, for example, 100 requests per minute from a user, then rejecting excess requests with an HTTP 429 "Too Many Requests" response. Rate limiters prevent abuse, protect servers from being overwhelmed by bursts of traffic, and ensure fair usage across all users.',
            },
            {
              id: "b3",
              type: "heading",
              content: "Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "heading",
              content: "Functional Requirements",
              metadata: { level: 3 },
            },
            {
              id: "b5",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Identify clients by user ID, IP address, or API key to apply appropriate limits.",
                  "Limit HTTP requests based on configurable rules (e.g., 100 API requests per minute per user).",
                  "When limits are exceeded, reject requests with HTTP 429 and include helpful headers (rate limit remaining, reset time).",
                ],
              },
            },
            {
              id: "b6",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 3 },
            },
            {
              id: "b7",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Minimal latency overhead (< 10ms per request check).",
                  "Highly available — eventual consistency is acceptable as slight delays in limit enforcement across nodes are tolerable.",
                  "Handle 1M requests/second across 100M daily active users.",
                ],
              },
            },
            {
              id: "b8",
              type: "heading",
              content: "System Interface",
              metadata: { level: 2 },
            },
            {
              id: "b9",
              type: "code",
              content:
                "isRequestAllowed(clientId, ruleId) -> {\n  passes: boolean,\n  remaining: number,\n  resetTime: timestamp\n}",
              metadata: { language: "typescript" },
            },
            {
              id: "b10",
              type: "paragraph",
              content:
                "This method takes a client identifier (user ID, IP address, or API key) and a rule identifier, then returns whether the request should be allowed based on current usage. It also provides information for response headers like X-RateLimit-Remaining and X-RateLimit-Reset.",
            },
            {
              id: "b11",
              type: "heading",
              content: "Where to Place the Rate Limiter",
              metadata: { level: 2 },
            },
            {
              id: "b12",
              type: "heading",
              content: "Option 1: In-Process (Bad)",
              metadata: { level: 3 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "Each application server has rate limiting built into the application code, using local in-memory counters. Fast (no network calls), but each server only knows about its own traffic. With 5 servers behind a load balancer, a user could get 5× the intended limit because each server sees only a fraction of traffic. Limits become unpredictable when routing changes.",
            },
            {
              id: "b14",
              type: "heading",
              content: "Option 2: Dedicated Service (Good)",
              metadata: { level: 3 },
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "The rate limiter becomes its own microservice. Application servers call it before processing requests. Provides precise global enforcement and rich context (user tier, endpoint, etc.), but adds a network round trip to every request and introduces another point of failure. You must decide whether to fail-open or fail-closed if the service goes down.",
            },
            {
              id: "b16",
              type: "heading",
              content: "Option 3: API Gateway / Load Balancer (Great)",
              metadata: { level: 3 },
            },
            {
              id: "b17",
              type: "paragraph",
              content:
                "The rate limiter runs at the edge, integrated into the API gateway. Incoming requests hit the limiter first — blocked requests never reach application servers. This is the most popular production approach: conceptually simple, strong protection. The limitation is context — the gateway only sees HTTP-level information (headers, URL, IP, JWT tokens), not deeper business logic.",
            },
            {
              id: "b18",
              type: "heading",
              content: "Client Identification",
              metadata: { level: 2 },
            },
            {
              id: "b19",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "User ID — From JWT in Authorization header. Best for authenticated APIs.",
                  "IP Address — From X-Forwarded-For header. Good for public APIs, but watch out for NAT/corporate firewalls.",
                  "API Key — From X-API-Key header. Common for developer APIs.",
                  "In practice, layer multiple rules: per-user, per-IP, global, and endpoint-specific limits.",
                ],
              },
            },
            {
              id: "b20",
              type: "quote",
              content:
                "The rate limiter should check all applicable rules and enforce the most restrictive one. If Alice has remaining user quota but her IP has hit its limit, she gets blocked.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Algorithms & Implementation
    {
      title: "Rate Limiting Algorithms & Redis Implementation",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Rate Limiting Algorithms & Redis Implementation",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Rate Limiting Algorithms",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "heading",
              content: "1. Fixed Window Counter",
              metadata: { level: 3 },
            },
            {
              id: "c3",
              type: "paragraph",
              content:
                "Divides time into fixed windows (e.g., 1-minute buckets) and counts requests per window. Simple to implement — just a hash table mapping client IDs to (counter, window_start_time) pairs. The main problem is boundary effects: a user could make 100 requests at 12:00:59, then another 100 at 12:01:00, effectively getting 200 requests in 2 seconds.",
            },
            {
              id: "c4",
              type: "code",
              content:
                '// Fixed window state example\n{\n  "alice:12:00:00": 100,\n  "alice:12:01:00": 5,\n  "bob:12:00:00": 20\n}',
              metadata: { language: "json" },
            },
            {
              id: "c5",
              type: "heading",
              content: "2. Sliding Window Log",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "Keeps a log of individual request timestamps per user. On each new request, remove timestamps older than the window, then check if the remaining count exceeds the limit. Perfect accuracy with no boundary effects, but high memory usage — storing 1000 timestamps for a user making 1000 req/min. Does not scale well to millions of users.",
            },
            {
              id: "c7",
              type: "heading",
              content: "3. Sliding Window Counter",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "A clever hybrid: maintains counters for the current and previous window. Estimates the sliding window count using a weighted sum based on how far into the current window you are. For example, 30% through the current minute → count 70% of previous window + 100% of current window. Much better accuracy than fixed windows with only two counters per client. The trade-off is that it assumes traffic is evenly distributed within windows.",
            },
            {
              id: "c9",
              type: "heading",
              content: "4. Token Bucket (Recommended)",
              metadata: { level: 3 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "Each client has a bucket with a maximum capacity (burst limit) and a steady refill rate. Each request consumes one token. If no tokens are available, the request is rejected. A bucket holding 100 tokens with a refill rate of 10/minute allows bursts of up to 100 requests while maintaining a steady rate of 10/minute. This is used by companies like Stripe because it naturally accommodates bursty API traffic.",
            },
            {
              id: "c11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "State per client: (current_tokens, last_refill_time) — very memory efficient.",
                  "Handles both sustained load (refill rate) and temporary bursts (bucket capacity).",
                  "Challenge: choosing the right bucket size and refill rate; handling cold-start scenarios.",
                ],
              },
            },
            {
              id: "c12",
              type: "heading",
              content: "Why Redis for Shared State?",
              metadata: { level: 2 },
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                "If each gateway stores buckets in local memory, we are back to the in-process problem — each gateway sees only its fraction of traffic. Redis provides centralized state that all gateways access: sub-millisecond responses, automatic cleanup via EXPIRE, high availability through replication, and atomic operations via Lua scripts.",
            },
            {
              id: "c14",
              type: "heading",
              content: "Token Bucket with Redis — Step by Step",
              metadata: { level: 3 },
            },
            {
              id: "c15",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Request arrives at Gateway A for user alice.",
                  "Gateway calls Redis: HMGET alice:bucket tokens last_refill.",
                  "Gateway calculates tokens to add based on elapsed time and refill rate (capped at max capacity).",
                  "Gateway updates state atomically via Lua script (not MULTI/EXEC — see race condition below).",
                  "If tokens >= 1, allow request and decrement. Otherwise, reject with 429.",
                ],
              },
            },
            {
              id: "c16",
              type: "heading",
              content: "Race Condition: Why Lua Scripts, Not MULTI/EXEC",
              metadata: { level: 3 },
            },
            {
              id: "c17",
              type: "paragraph",
              content:
                "MULTI/EXEC only makes the write atomic, but the read (HMGET) happens outside the transaction. Two simultaneous requests read the same token count, both calculate they can proceed, both update — allowing 2 requests when only 1 token was available. The fix: a Lua script that reads, calculates, and updates in a single atomic step. Lua scripts in Redis execute atomically, eliminating the race condition entirely.",
            },
            {
              id: "c18",
              type: "code",
              content:
                '-- Redis Lua script for atomic token bucket\nlocal key = KEYS[1]\nlocal max_tokens = tonumber(ARGV[1])\nlocal refill_rate = tonumber(ARGV[2])\nlocal now = tonumber(ARGV[3])\n\nlocal data = redis.call("HMGET", key, "tokens", "last_refill")\nlocal tokens = tonumber(data[1]) or max_tokens\nlocal last_refill = tonumber(data[2]) or now\n\n-- Calculate refill\nlocal elapsed = now - last_refill\nlocal new_tokens = math.min(max_tokens, tokens + elapsed * refill_rate)\n\nif new_tokens >= 1 then\n  redis.call("HMSET", key, "tokens", new_tokens - 1, "last_refill", now)\n  redis.call("EXPIRE", key, 3600)\n  return {1, new_tokens - 1}  -- allowed, remaining\nelse\n  return {0, 0}  -- rejected\nend',
              metadata: { language: "lua" },
            },
            {
              id: "c19",
              type: "heading",
              content: "HTTP 429 Response",
              metadata: { level: 2 },
            },
            {
              id: "c20",
              type: "paragraph",
              content:
                'When limits are exceeded, return HTTP 429 with headers: X-RateLimit-Limit (ceiling), X-RateLimit-Remaining (requests left), X-RateLimit-Reset (Unix timestamp when limit resets), and optionally Retry-After (seconds to wait). Well-behaved clients use these headers for proper backoff. Always reject excess requests immediately ("fail fast") rather than queuing them — queues consume memory, create unpredictable latency, and users retry anyway.',
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Scaling Deep Dives
    {
      title: "Scaling, Availability & Advanced Topics",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Scaling, Availability & Advanced Topics",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Scaling to 1M Requests/Second",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "A single Redis instance handles ~100K–200K ops/second. Each rate limit check requires multiple operations, so realistically ~50K–100K checks/second per instance. At 1M req/s, we need ~10 Redis shards. The key challenge: all requests for a given client must hit the same shard, or their rate limiting state gets split and becomes useless.",
            },
            {
              id: "d3",
              type: "heading",
              content: "Sharding Strategy",
              metadata: { level: 3 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "Use consistent hashing to map client identifiers to Redis shards. Hash user IDs for authenticated users, IP addresses for anonymous users, API keys for developer access. Each API gateway has routing logic: extract identifier → apply hash → route to correct shard. The Token Bucket algorithm stays the same, just talking to different Redis instances.",
            },
            {
              id: "d5",
              type: "paragraph",
              content:
                'In production, Redis Cluster handles this automatically. It divides keys across 16,384 hash slots distributed across nodes. When you store "alice:bucket", Redis Cluster determines the correct node from the key\'s hash slot — no custom consistent hashing logic needed in your gateways.',
            },
            {
              id: "d6",
              type: "heading",
              content: "High Availability & Fault Tolerance",
              metadata: { level: 2 },
            },
            {
              id: "d7",
              type: "heading",
              content: "Failure Modes",
              metadata: { level: 3 },
            },
            {
              id: "d8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Fail-Closed: Reject all requests when Redis is down. Safest for security but effectively takes your API offline. Good for financial/payment systems.",
                  "Fail-Open: Allow all requests through when Redis is down. Keeps API available but temporarily loses rate limiting protection. Dangerous during traffic spikes — can cause cascading failures.",
                ],
              },
            },
            {
              id: "d9",
              type: "paragraph",
              content:
                "For a social media platform, fail-closed is often preferred: rate limiting failures often coincide with traffic spikes (viral events), and failing open during those moments can cause complete platform collapse. Brief rejected requests are preferable to cascading system failure.",
            },
            {
              id: "d10",
              type: "heading",
              content: "Redis Replication & Automatic Failover",
              metadata: { level: 3 },
            },
            {
              id: "d11",
              type: "paragraph",
              content:
                "Each Redis shard gets one or more read replicas that continuously sync with the master. When the master fails, a replica is promoted automatically. Redis Cluster has built-in failover that detects master failures and promotes replicas without manual intervention. Trade-offs: increased infrastructure cost and replica synchronization lag (though typically very fast).",
            },
            {
              id: "d12",
              type: "heading",
              content: "Minimizing Latency",
              metadata: { level: 2 },
            },
            {
              id: "d13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Connection Pooling: Maintain persistent connections to Redis, eliminating TCP handshake overhead (20–50ms per new connection). Most Redis clients handle this automatically.",
                  "Geographic Distribution: Deploy API gateways and Redis clusters in multiple regions close to users. Tokyo users talk to local Redis, not Virginia. Accept eventual consistency across regions for lower latency.",
                  "Lua Scripts / Pipelining: Batch operations to reduce round trips. Usually unnecessary if connection pooling and geo-distribution are handled.",
                ],
              },
            },
            {
              id: "d14",
              type: "heading",
              content: "Hot Keys",
              metadata: { level: 2 },
            },
            {
              id: "d15",
              type: "paragraph",
              content:
                "A single user/IP generating tens of thousands of requests per second can overwhelm a Redis shard. Handle legitimate high-volume clients with client-side rate limiting (SDKs that respect server headers), request batching, and premium tiers. Handle abusive traffic with automatic blocking (add to blocklist after repeated limit hits) and DDoS protection services (Cloudflare, AWS Shield).",
            },
            {
              id: "d16",
              type: "heading",
              content: "Dynamic Rule Configuration",
              metadata: { level: 2 },
            },
            {
              id: "d17",
              type: "heading",
              content: "Poll-Based (Good)",
              metadata: { level: 3 },
            },
            {
              id: "d18",
              type: "paragraph",
              content:
                "Store rules in a database. Gateways poll every ~30 seconds and cache locally. Simple to implement, but updates have a propagation delay. Problematic for emergency limit reductions during attacks.",
            },
            {
              id: "d19",
              type: "heading",
              content: "Push-Based with ZooKeeper (Great)",
              metadata: { level: 3 },
            },
            {
              id: "d20",
              type: "paragraph",
              content:
                "Use ZooKeeper (or Redis pub/sub) for real-time push notifications. When an operator changes a rule, all connected gateways update within seconds. More complex — must handle connection failures, partial updates, and fallback mechanisms. Justified only when very fast rule propagation is required (security incidents, high-frequency trading).",
            },
            {
              id: "d21",
              type: "heading",
              content: "Interview Level Expectations",
              metadata: { level: 2 },
            },
            {
              id: "d22",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mid-Level: Explain one algorithm (Token Bucket), place at API Gateway, use Redis for shared state, recognize need to shard.",
                  "Senior: Discuss tradeoffs between algorithms, understand consistent hashing, atomic operations (Lua scripts), fail-open vs fail-closed, proactively identify hot keys and latency concerns.",
                  "Staff+: Deep production experience — multi-region deployments, data consistency across geographies, observability, gradual rollouts, operational procedures. Spend most time on failure modes and system integration.",
                ],
              },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (28 questions)
    // ═══════════════════════════════════════════════════════

    // ─── MCQ (8 questions) ─────────────────────────────────

    // MCQ 1 — easy
    {
      title: "Best placement for a production rate limiter",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "For a large-scale production API, where is the most common and recommended placement for a rate limiter?",
        explanation:
          "The API Gateway/Load Balancer approach is the most popular in production. It intercepts requests at the edge before they reach application servers, provides centralized control, and ensures blocked requests never consume backend resources. In-process rate limiting cannot enforce global limits across multiple servers, and a dedicated service adds an extra network hop to every request.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "As a dedicated microservice called by each app server",
              isCorrect: false,
            },
            { id: "b", text: "At the API Gateway / Load Balancer", isCorrect: true },
            { id: "c", text: "In each application server's process memory", isCorrect: false },
            { id: "d", text: "In the database layer as stored procedures", isCorrect: false },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "HTTP status code for rate limit exceeded",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What HTTP status code should a rate limiter return when a client exceeds their limit?",
        explanation:
          'HTTP 429 "Too Many Requests" is the standard status code defined in RFC 6585 specifically for rate limiting. 503 is for service unavailable (server overload), 403 is for forbidden (authorization failure), and 408 is for request timeout.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "408 Request Timeout", isCorrect: false },
            { id: "b", text: "403 Forbidden", isCorrect: false },
            { id: "c", text: "429 Too Many Requests", isCorrect: true },
            { id: "d", text: "503 Service Unavailable", isCorrect: false },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Primary disadvantage of in-process rate limiting",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the primary disadvantage of implementing rate limiting in-process (within each application server)?",
        explanation:
          "In-process rate limiting means each server only tracks its own traffic. With N servers behind a load balancer, the effective global limit becomes N × the intended limit, because each server independently allows up to the full limit. This makes rate limiting essentially useless for protecting against abuse at scale.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "It requires a paid Redis license", isCorrect: false },
            { id: "b", text: "It is too slow due to memory access", isCorrect: false },
            {
              id: "c",
              text: "Each server only sees its own traffic, so global limits cannot be enforced",
              isCorrect: true,
            },
            { id: "d", text: "It cannot identify clients by IP address", isCorrect: false },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why Lua scripts over MULTI/EXEC for token bucket",
      type: "question",
      sectionId: "sec_q_redis",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In a Redis-based token bucket implementation, why are Lua scripts preferred over MULTI/EXEC transactions?",
        explanation:
          "MULTI/EXEC makes writes atomic, but the initial read (HMGET) happens before the transaction begins. Two concurrent requests can both read the same token count, both decide to allow, and both write — a classic TOCTOU (time-of-check-to-time-of-use) race condition. Lua scripts execute the entire read-calculate-update sequence atomically within Redis, eliminating this race.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Lua scripts support complex data types that MULTI/EXEC cannot handle",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The read happens outside MULTI/EXEC, creating a race condition between read and write",
              isCorrect: true,
            },
            { id: "c", text: "MULTI/EXEC does not support HMGET commands", isCorrect: false },
            {
              id: "d",
              text: "Lua scripts are faster because they bypass network I/O",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Token bucket vs sliding window counter memory",
      type: "question",
      sectionId: "sec_q_algorithms",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A system serves 10 million unique users who each make ~500 requests per minute. Which rate limiting algorithm uses the MOST memory per user?",
        explanation:
          "Sliding Window Log stores individual timestamps for every request within the window. At 500 requests per minute, that is 500 timestamps (each ~8 bytes) per user — about 4KB per user. Fixed Window Counter and Sliding Window Counter store only 1–2 counters per user (~16 bytes). Token Bucket stores 2 values (tokens + last_refill) per user (~16 bytes). At 10M users, the log-based approach requires ~40GB versus ~160MB for the others.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "Sliding Window Counter", isCorrect: false },
            { id: "b", text: "Token Bucket", isCorrect: false },
            { id: "c", text: "Fixed Window Counter", isCorrect: false },
            { id: "d", text: "Sliding Window Log", isCorrect: true },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Fail-closed vs fail-open during traffic spikes",
      type: "question",
      sectionId: "sec_q_availability",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A social media platform's Redis rate-limiting cluster goes down during a viral event. What is the biggest risk of choosing fail-open (allow all requests)?",
        explanation:
          "Rate limiting failures often coincide with traffic spikes. During a viral event, traffic is already elevated. If the rate limiter fails open, the entire uncontrolled flood of requests hits backend services simultaneously — databases, caches, and application servers. This can trigger cascading failures across the entire platform, turning a rate limiter outage into complete system collapse.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Redis will permanently lose all stored rate limiting data",
              isCorrect: false,
            },
            { id: "b", text: "API keys will expire and need to be rotated", isCorrect: false },
            {
              id: "c",
              text: "Users will see inconsistent rate limit headers in responses",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The surge of unthrottled traffic can cascade into complete platform failure",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Fixed window boundary burst problem",
      type: "question",
      sectionId: "sec_q_algorithms",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A rate limiter uses Fixed Window Counter with a limit of 100 requests per minute. An attacker sends 100 requests at 12:00:59 and 100 requests at 12:01:00. How many of these 200 requests will be ALLOWED?",
        explanation:
          'Fixed Window Counter resets at window boundaries. The first 100 requests fall in the 12:00:00–12:00:59 window (exactly at the limit, all allowed). The next 100 fall in the new 12:01:00–12:01:59 window (counter resets to 0, all allowed). So 200 requests pass in 2 seconds despite a 100/minute limit. This "boundary burst" problem is the main weakness of Fixed Window Counter — effectively doubling the allowed rate at window transitions.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            { id: "a", text: "150 — the second window gets a partial allowance", isCorrect: false },
            {
              id: "b",
              text: "101 — the first request of the new window is free, rest rejected",
              isCorrect: false,
            },
            { id: "c", text: "100 — the second batch is entirely rejected", isCorrect: false },
            {
              id: "d",
              text: "200 — all requests are allowed because they span two windows",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Redis Cluster hash slot distribution",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "Your distributed rate limiter uses Redis Cluster with 16,384 hash slots across 10 nodes. A specific IP address generates 50,000 rate-limit checks per second. What problem does this create, and why can't Redis Cluster's built-in sharding solve it?",
        explanation:
          'Redis Cluster assigns each key to exactly one hash slot on one node. All checks for the same client ID (IP address) hash to the same slot and therefore the same node. With 50K ops/second from one IP, that single node becomes a hot shard — potentially exceeding its capacity (~100K–200K ops/s total) while other nodes sit idle. Redis Cluster distributes keys across nodes but cannot split a single key\'s load across multiple nodes. This is the "hot key" problem.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Redis Cluster rebalances hash slots dynamically, so there is no problem",
              isCorrect: false,
            },
            {
              id: "b",
              text: "All checks for one key hit the same node, creating a hot shard that Redis Cluster cannot distribute",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The hash slot count (16,384) is too small for 10 nodes to distribute evenly",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Redis Cluster rounds-robin requests across nodes for the same key",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ─── MCAQ (4 questions) ────────────────────────────────

    // MCAQ 1 — easy
    {
      title: "Valid client identifiers for rate limiting",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid client identifiers that can be used by an API Gateway rate limiter to apply per-client limits:",
        explanation:
          "User ID (from JWT in Authorization header), IP address (from X-Forwarded-For), and API key (from X-API-Key header) are all standard identifiers available in HTTP requests. Session cookies could technically work but are not a standard rate limiting identifier — they are per-session rather than per-client and can be easily rotated. Database row IDs are internal to the application layer and not available at the gateway.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Client IP address from X-Forwarded-For header", isCorrect: true },
            { id: "b", text: "Database row ID from the application layer", isCorrect: false },
            { id: "c", text: "User ID extracted from JWT token", isCorrect: true },
            { id: "d", text: "API key from X-API-Key header", isCorrect: true },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Benefits of token bucket algorithm",
      type: "question",
      sectionId: "sec_q_algorithms",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL advantages of the Token Bucket algorithm over Fixed Window Counter for rate limiting:",
        explanation:
          "Token Bucket supports controlled bursts (up to bucket capacity) while maintaining a steady average rate (refill rate) — Fixed Window allows uncontrolled bursts at window boundaries. Token Bucket has no boundary burst problem since it does not use time windows. Both algorithms have similar memory efficiency (2 values per client). However, Token Bucket is slightly more complex to implement correctly, especially the refill calculation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "No boundary burst problem at window transitions", isCorrect: true },
            {
              id: "b",
              text: "Supports controlled burst traffic up to a configurable limit",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Enforces both a burst limit and a steady average rate simultaneously",
              isCorrect: true,
            },
            { id: "d", text: "Uses significantly less memory per client", isCorrect: false },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Redis properties valuable for rate limiting",
      type: "question",
      sectionId: "sec_q_redis",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL Redis properties that make it well-suited for distributed rate limiting state storage:",
        explanation:
          "Redis provides sub-millisecond response times (speed), automatic key expiry via EXPIRE to clean up inactive buckets (cleanup), master-replica replication with automatic failover (availability), and atomic Lua script execution for race-free read-modify-write operations (atomicity). Redis is eventually consistent by default with async replication, not strongly consistent — this is actually acceptable for rate limiting but is not a reason to choose it.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Atomic Lua script execution for race-free operations",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Sub-millisecond response times for simple operations",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Strong consistency guarantees across all replicas",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Automatic key expiry via EXPIRE removes inactive user buckets",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Strategies for hot key mitigation",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "A single IP address is generating 40,000 rate-limit checks per second, overwhelming one Redis shard. Select ALL strategies that would effectively mitigate this hot key problem:",
        explanation:
          "Client-side rate limiting in SDKs reduces the total number of checks reaching the server. Automatic IP blocking after repeated limit violations prevents the IP from continuing to generate checks. DDoS protection services (Cloudflare/Shield) can block abusive traffic before it reaches your infrastructure. Increasing the number of Redis shards does NOT help because consistent hashing maps this IP to exactly one shard — adding more shards just redistributes other keys.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Automatically block the IP after repeated limit violations",
              isCorrect: true,
            },
            { id: "b", text: "Encourage client-side rate limiting in API SDKs", isCorrect: true },
            { id: "c", text: "Add more Redis shards to redistribute the load", isCorrect: false },
            {
              id: "d",
              text: "Deploy DDoS protection (Cloudflare/AWS Shield) upstream",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ─── Paragraph (6 questions) ───────────────────────────

    // Paragraph 1 — medium
    {
      title: "Compare rate limiting algorithms",
      type: "question",
      sectionId: "sec_q_algorithms",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare the Fixed Window Counter and Token Bucket rate limiting algorithms. For each, describe how it works, its memory footprint, and its key weakness. Then explain why Token Bucket is generally preferred for production APIs.",
        explanation:
          "A strong answer covers: Fixed Window divides time into buckets and counts per window (weakness: boundary burst allows 2× the limit in 2 seconds). Token Bucket tracks tokens and a refill rate (weakness: choosing parameters). Both use ~2 values per client. Token Bucket is preferred because it handles bursty traffic naturally, has no boundary effects, and companies like Stripe use it for this reason.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Fixed Window Counter divides time into fixed windows (e.g., 1-minute buckets) and counts requests per window. It stores one counter and one timestamp per client — very memory efficient. However, it has a critical boundary burst problem: a user can send 100 requests at the end of one window and 100 at the start of the next, getting 200 requests through in 2 seconds despite a 100/minute limit.\n\nToken Bucket gives each client a bucket with a maximum capacity (burst limit) that refills at a steady rate. It stores two values per client (current tokens and last refill time) — equally memory efficient. Its weakness is that choosing the right bucket size and refill rate requires tuning, and idle clients start with full buckets (cold start).\n\nToken Bucket is preferred for production APIs because it naturally handles bursty traffic (common in real API usage), eliminates boundary effects entirely, and simultaneously enforces both a burst limit and an average rate. Companies like Stripe use it because API traffic is inherently bursty.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Fail-open vs fail-closed analysis",
      type: "question",
      sectionId: "sec_q_availability",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "When the Redis cluster backing your rate limiter goes down, you must choose between fail-open and fail-closed. Describe each approach, give a scenario where each is appropriate, and explain which you would choose for a social media platform and why.",
        explanation:
          "A strong answer explains both modes with concrete scenarios and makes a justified choice for the social media context.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Fail-closed means rejecting all requests when Redis is unavailable — no request gets through unless we can verify it is within limits. This is appropriate for financial/payment systems where uncontrolled access is worse than downtime (e.g., a payment gateway that must prevent duplicate charges).\n\nFail-open means allowing all requests through, effectively disabling rate limiting. This keeps the API available but removes protection. It suits internal APIs where availability matters more than abuse prevention.\n\nFor a social media platform, I would choose fail-closed. Rate limiter failures often coincide with traffic spikes (viral events). If Redis fails during a viral moment and we fail open, the entire unthrottled flood hits backend databases and services, potentially causing cascading failures across the whole platform. Brief periods of rejected requests (503s) are far better than total system collapse. Combined with Redis master-replica replication and automatic failover, actual downtime windows should be very short.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the Redis sharding strategy",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You need to scale your rate limiter from a single Redis instance to handle 1M requests/second. Design the sharding strategy. Address: (1) why a single Redis instance is insufficient, (2) how you would partition rate limiting data across shards, (3) how API gateways route to the correct shard, and (4) what happens when you need to add or remove shards.",
        explanation:
          "A staff-level answer covers Redis throughput limits, consistent hashing, gateway routing logic, and the rebalancing challenge.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "A single Redis instance handles ~100K-200K operations/second. Each rate limit check involves multiple operations (read state + update state), so realistically one instance supports ~50K-100K checks/second. At 1M req/s, we need approximately 10-20 shards.\n\nPartitioning: Use consistent hashing on the client identifier. For authenticated users, hash the user ID; for anonymous users, hash the IP; for developer access, hash the API key. This ensures all requests from a given client always hit the same shard, keeping their rate limiting state intact.\n\nGateway routing: Each API gateway extracts the client identifier from the request, applies the consistent hash function, and routes the rate limit check to the determined shard. The Token Bucket Lua script runs on that specific shard.\n\nIn production, Redis Cluster handles this automatically using 16,384 hash slots distributed across nodes. Adding a shard triggers slot migration — Redis moves a portion of hash slots (and their keys) to the new node. During migration, there may be brief periods where rate limiting state for migrated keys is reset, but for rate limiting this is acceptable since it only temporarily allows slightly more requests.\n\nAdding/removing shards with manual consistent hashing requires a rehashing step. Consistent hashing minimizes key redistribution (only ~1/N keys move when adding the Nth shard), but you must handle the transition period where some clients briefly lose their rate limiting state.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Race condition deep dive",
      type: "question",
      sectionId: "sec_q_redis",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the race condition that occurs in a Redis-based token bucket implementation when using separate read and write operations (even with MULTI/EXEC). Describe: (1) the exact sequence of events that causes incorrect behavior, (2) why MULTI/EXEC does not solve it, and (3) how Lua scripts fix the problem.",
        explanation:
          "A strong answer walks through the exact TOCTOU race, explains why MULTI/EXEC only protects writes, and describes how Lua atomicity covers the entire read-modify-write cycle.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The race condition is a classic Time-Of-Check-To-Time-Of-Use (TOCTOU) problem:\n\n1. Gateway A reads Alice's bucket: HMGET alice:bucket tokens last_refill → gets tokens=1, last_refill=T0.\n2. Gateway B reads Alice's bucket simultaneously: HMGET alice:bucket tokens last_refill → also gets tokens=1, last_refill=T0.\n3. Both gateways independently calculate: \"Alice has 1 token, allow the request, decrement to 0.\"\n4. Gateway A writes: MULTI; HSET alice:bucket tokens 0; HSET alice:bucket last_refill T1; EXEC.\n5. Gateway B writes: MULTI; HSET alice:bucket tokens 0; HSET alice:bucket last_refill T1; EXEC.\n\nResult: Two requests were allowed when only one token was available. The MULTI/EXEC transaction only ensures that the write commands execute atomically — but the read (step 1-2) happens before the transaction. Both gateways read stale state.\n\nLua scripts fix this because Redis executes the entire script atomically — no other command can interleave. The script reads the current state, calculates the new token count, and writes the update all within one atomic execution. Gateway B's Lua script would see the already-decremented token count left by Gateway A's script, and correctly reject the second request.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Multi-region rate limiting design",
      type: "question",
      sectionId: "sec_q_availability",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are deploying your rate limiter across 3 geographic regions (US-East, EU-West, Asia-Pacific). Describe your approach to multi-region rate limiting. Address: (1) where Redis clusters are deployed, (2) how you handle cross-region consistency, (3) the tradeoff between global accuracy and latency, and (4) a strategy for users who make requests from multiple regions.",
        explanation:
          "A staff-level answer addresses per-region Redis clusters, eventual consistency trade-offs, and practical strategies for cross-region users.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Deploy a Redis cluster in each region so users hit local infrastructure (sub-millisecond latency vs. 100-200ms cross-region).\n\nFor cross-region consistency, use eventual consistency with periodic synchronization. Each region enforces limits against its local Redis, and regions periodically share aggregated usage counts (e.g., every 5-10 seconds via async replication or a message bus). This means a user\'s global rate limit may temporarily be exceeded by a small margin across regions.\n\nThe fundamental tradeoff: strong global accuracy requires cross-region coordination on every request (adding 100-200ms latency — unacceptable for a <10ms budget), while local-only enforcement sacrifices accuracy for speed. For rate limiting, eventual consistency is explicitly acceptable per our requirements.\n\nFor users spanning regions: allocate a fraction of the global limit to each region (e.g., 40% US, 30% EU, 30% APAC based on traffic patterns). If a user exhausts their regional allocation, the region can request a "token transfer" from another region asynchronously. Alternatively, use a simpler approach: set per-region limits that sum to the global limit, accepting that a user who splits requests evenly across 3 regions effectively gets the full limit. The slight over-allowance at region boundaries is acceptable given the alternative of 100ms+ latency per check.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "End-to-end rate limiter interview walkthrough",
      type: "question",
      sectionId: "sec_q_availability",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are in a Staff Engineer interview. Walk through how you would design a distributed rate limiter for 1M req/s. Structure your answer as: (1) requirements gathering, (2) core entities and API, (3) high-level architecture, (4) algorithm selection with tradeoffs, (5) two deep dives you would propose to your interviewer and a brief preview of each.",
        explanation:
          "This tests the candidate's ability to structure a complete system design answer at Staff level, demonstrating breadth and depth.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "1. Requirements: Functional — identify clients (user ID/IP/API key), enforce configurable limits, return 429 with rate limit headers. Non-functional — <10ms latency overhead, 1M req/s, 100M DAU, high availability, eventual consistency acceptable.\n\n2. Core Entities: Rules (limit definitions per client type/endpoint), Clients (identified by user ID, IP, or API key), Requests (incoming traffic with context). API: isRequestAllowed(clientId, ruleId) → {passes, remaining, resetTime}.\n\n3. Architecture: Rate limiter at the API Gateway layer. All gateways share state via Redis. Requests hit the gateway first; blocked requests never reach backend servers. Fail-closed when Redis is unavailable.\n\n4. Algorithm: Token Bucket — stores (tokens, last_refill) per client. Handles bursty traffic naturally, no boundary effects like Fixed Window. Memory efficient. Implemented as a Redis Lua script for atomic read-modify-write. Companies like Stripe use this approach.\n\n5. Deep Dives:\n   A) Scaling to 1M req/s: Single Redis handles ~100K ops/s. Shard across ~10-20 nodes using consistent hashing on client ID. Redis Cluster with 16,384 hash slots handles automatic routing. Each gateway extracts client ID → hashes → routes to correct shard.\n   B) High Availability & Fault Tolerance: Master-replica replication per shard with automatic failover. Fail-closed policy (reject during outages to prevent cascade failures). Connection pooling to eliminate TCP overhead. Geographic distribution for latency — Redis cluster per region with eventual consistency sync.",
          minLength: 300,
          maxLength: 4000,
        },
      },
    },

    // ─── Text (4 questions) ────────────────────────────────

    // Text 1 — medium
    {
      title: "Name the rate condition type",
      type: "question",
      sectionId: "sec_q_redis",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Two API gateways simultaneously read a token bucket's state from Redis, both see 1 token available, and both allow a request. What is this type of race condition called?",
        explanation:
          'This is a TOCTOU (Time-Of-Check-To-Time-Of-Use) race condition. The "check" (reading the token count) and the "use" (decrementing and allowing the request) are not atomic, allowing another process to interleave between them.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "TOCTOU",
          acceptableAnswers: [
            "TOCTOU",
            "Time-of-check-to-time-of-use",
            "Time of check time of use",
            "TOCTTOU",
            "check-then-act",
            "read-modify-write race",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Redis feature for automatic bucket cleanup",
      type: "question",
      sectionId: "sec_q_redis",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What Redis command is used to automatically delete inactive user token buckets after a period of inactivity, preventing memory leaks?",
        explanation:
          "The EXPIRE command sets a time-to-live (TTL) on a Redis key. After the specified duration, Redis automatically deletes the key. In rate limiting, we typically set EXPIRE to 1 hour (3600 seconds) on each bucket update, so inactive users' buckets are automatically cleaned up.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "EXPIRE",
          acceptableAnswers: ["EXPIRE", "expire", "TTL", "EXPIREAT", "PEXPIRE"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Technology for push-based config updates",
      type: "question",
      sectionId: "sec_q_availability",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Name the distributed coordination service commonly used for push-based rate limit configuration updates, providing real-time notifications to all API gateways when rules change.",
        explanation:
          "ZooKeeper is a distributed coordination service designed for configuration management with real-time notifications. It maintains configuration data and immediately notifies all connected clients (API gateways) when configuration changes. Other acceptable answers include etcd and Consul which serve similar roles.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "ZooKeeper",
          acceptableAnswers: ["ZooKeeper", "zookeeper", "Apache ZooKeeper", "etcd", "Consul"],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Number of Redis Cluster hash slots",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Redis Cluster divides the keyspace into a fixed number of hash slots distributed across nodes. How many hash slots does Redis Cluster use?",
        explanation:
          "Redis Cluster uses exactly 16,384 hash slots. Each key is mapped to one of these slots using CRC16(key) mod 16384. The slots are distributed across cluster nodes, and when nodes are added or removed, slots (and their keys) are migrated between nodes.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "16384",
          acceptableAnswers: ["16384", "16,384", "16K"],
          caseSensitive: false,
        },
      },
    },

    // ─── Matching (3 questions) ────────────────────────────

    // Matching 1 — easy
    {
      title: "Match rate limit headers to their purpose",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each HTTP rate limit header to its purpose:",
        explanation:
          "X-RateLimit-Limit tells the client their total allowed requests in the window. X-RateLimit-Remaining shows how many requests they have left. X-RateLimit-Reset provides the Unix timestamp when the limit resets. Retry-After tells the client how many seconds to wait before trying again.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            { id: "p1", left: "X-RateLimit-Limit", right: "Total allowed requests in window" },
            {
              id: "p2",
              left: "X-RateLimit-Remaining",
              right: "Requests left before hitting limit",
            },
            { id: "p3", left: "X-RateLimit-Reset", right: "Unix timestamp when limit resets" },
            { id: "p4", left: "Retry-After", right: "Seconds to wait before retrying" },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match algorithm to its key characteristic",
      type: "question",
      sectionId: "sec_q_algorithms",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each rate limiting algorithm to its defining characteristic:",
        explanation:
          "Fixed Window Counter is known for boundary burst vulnerability. Sliding Window Log provides perfect accuracy but at high memory cost. Sliding Window Counter is a memory-efficient approximation using weighted previous+current window counts. Token Bucket natively supports controlled burst capacity via the bucket size parameter.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Fixed Window Counter",
              right: "Vulnerable to boundary bursts at window edges",
            },
            {
              id: "p2",
              left: "Sliding Window Log",
              right: "Perfect accuracy but O(n) memory per client",
            },
            {
              id: "p3",
              left: "Sliding Window Counter",
              right: "Approximation using weighted window counts",
            },
            {
              id: "p4",
              left: "Token Bucket",
              right: "Native burst capacity with steady refill rate",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match scaling challenge to solution",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each distributed rate limiter challenge to the primary solution:",
        explanation:
          "Single Redis throughput bottleneck is solved by sharding across multiple nodes with consistent hashing. The TOCTOU race condition is solved by Redis Lua scripts that atomically execute read-modify-write. Redis master failure requires automatic failover via replica promotion. TCP handshake latency (20-50ms) is eliminated by maintaining persistent connection pools.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Single Redis throughput bottleneck",
              right: "Consistent hashing across shards",
            },
            {
              id: "p2",
              left: "TOCTOU race between read and write",
              right: "Atomic Lua scripts in Redis",
            },
            {
              id: "p3",
              left: "Redis master node failure",
              right: "Replica promotion with automatic failover",
            },
            {
              id: "p4",
              left: "Connection setup overhead per request",
              right: "Persistent connection pooling",
            },
          ],
        },
      },
    },

    // ─── Fill-blanks (3 questions) ─────────────────────────

    // Fill-blanks 1 — easy
    {
      title: "Token bucket state components",
      type: "question",
      sectionId: "sec_q_algorithms",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "A Token Bucket stores two values per client: the current number of _____ and the _____ timestamp.",
        explanation:
          "The Token Bucket algorithm tracks two pieces of state per client: the current token count (how many requests the client can still make) and the last refill timestamp (used to calculate how many new tokens to add based on elapsed time).",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "A Token Bucket stores two values per client: the current number of {{blank1}} and the {{blank2}} timestamp.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "tokens",
              acceptableAnswers: ["tokens", "available tokens", "remaining tokens"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "last refill",
              acceptableAnswers: ["last refill", "last_refill", "last update", "last refresh"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Rate limiter response code",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          'When a client exceeds their rate limit, the server returns HTTP status code _____ with the message "Too Many _____".',
        explanation:
          'HTTP 429 "Too Many Requests" is the standard response for rate limit violations, defined in RFC 6585. The response should also include rate limit headers to help clients understand their current usage and when they can retry.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            'When a client exceeds their rate limit, the server returns HTTP status code {{blank1}} with the message "Too Many {{blank2}}".',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "429",
              acceptableAnswers: ["429"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "Requests",
              acceptableAnswers: ["Requests", "requests"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Redis Cluster key distribution",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "Redis Cluster distributes keys across _____ hash slots using the _____ hash function.",
        explanation:
          "Redis Cluster uses 16,384 hash slots. Each key is assigned to a slot using CRC16(key) mod 16384. These slots are distributed across cluster nodes, enabling automatic data partitioning and routing.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "Redis Cluster distributes keys across {{blank1}} hash slots using the {{blank2}} hash function.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "16384",
              acceptableAnswers: ["16384", "16,384"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "CRC16",
              acceptableAnswers: ["CRC16", "crc16", "CRC-16"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ─── Numerical (2 questions) ───────────────────────────

    // Numerical 1 — medium
    {
      title: "Redis shards needed for target throughput",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "A single Redis instance can handle 100,000 rate limit checks per second. How many Redis shards are needed to handle 1,000,000 rate limit checks per second?",
        explanation:
          "This is a straightforward capacity calculation: 1,000,000 / 100,000 = 10 shards. In practice, you might add 1-2 extra shards for headroom and failover capacity, but the minimum is 10.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 10,
          tolerance: 0,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Fixed window boundary burst calculation",
      type: "question",
      sectionId: "sec_q_algorithms",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A rate limiter uses Fixed Window Counter with a limit of 500 requests per 60-second window. An attacker times their requests to exploit the boundary burst vulnerability, sending the maximum allowed requests in the last 1 second of one window and the first 1 second of the next. What is the maximum number of requests the attacker can get through in those 2 seconds?",
        explanation:
          "Due to the Fixed Window Counter boundary burst problem, the attacker can send 500 requests in the last second of window N (exhausting that window's quota) and 500 requests in the first second of window N+1 (using the fresh window's full quota). That is 500 + 500 = 1,000 requests in just 2 seconds, despite a nominal limit of 500 per 60 seconds. The effective burst rate is 500× the intended rate (1000/2s = 500/s vs. the intended ~8.3/s average).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 1000,
          tolerance: 0,
        },
      },
    },

    // ─── True/False (2 bonus questions) ────────────────────

    // True/False 1 — easy (bonus to reach 28)
    {
      title: "Redis MULTI/EXEC prevents all race conditions",
      type: "question",
      sectionId: "sec_q_redis",
      difficulty: "easy",
      payload: {
        questionType: "true-false",
        content:
          "Using Redis MULTI/EXEC transactions is sufficient to prevent all race conditions in a distributed token bucket rate limiter.",
        explanation:
          "False. MULTI/EXEC only makes the write operations atomic. The initial read (HMGET) happens before the transaction, creating a TOCTOU race condition where two gateways can read the same state and both allow a request when only one token is available. Lua scripts are needed to make the entire read-calculate-write sequence atomic.",
        basePoints: 10,
        difficulty: "easy",
        questionData: { correctAnswer: false },
      },
    },

    // True/False 2 — medium (bonus to reach 28)
    {
      title: "Eventual consistency is acceptable for rate limiting",
      type: "question",
      sectionId: "sec_q_availability",
      difficulty: "medium",
      payload: {
        questionType: "true-false",
        content:
          "For a distributed rate limiter, eventual consistency across nodes is acceptable because slight delays in limit enforcement are tolerable, and the alternative (strong consistency) would add unacceptable latency.",
        explanation:
          "True. Rate limiting is a use case where eventual consistency is explicitly acceptable. Enforcing strong consistency across distributed nodes would require coordination (like distributed locks or consensus protocols) on every request, adding significant latency that violates the <10ms requirement. Small windows where a user slightly exceeds their limit due to propagation delays are a worthwhile tradeoff for low-latency checks.",
        basePoints: 15,
        difficulty: "medium",
        questionData: { correctAnswer: true },
      },
    },
  ],
};
