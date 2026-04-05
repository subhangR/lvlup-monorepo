/**
 * Rate Limiter — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: requirements gathering, entity identification, class design,
 * Factory & Strategy patterns, Token Bucket, Sliding Window Log,
 * per-key state, extensibility (dynamic config, thread safety, memory eviction)
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldRateLimiterContent: StoryPointSeed = {
  title: "Design a Rate Limiter (LLD)",
  description:
    "Master the low-level design of an in-memory API rate limiter — covering entity identification, Factory and Strategy patterns, Token Bucket and Sliding Window Log algorithms, per-key state management, and extensibility for thread safety, dynamic config, and memory eviction.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements & Entity Design
    {
      title: "Rate Limiter — Requirements & Entity Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Rate Limiter — Requirements & Entity Design",
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
                "A rate limiter controls how many requests a client can make to an API within a specific time window. When a request comes in, the rate limiter checks if the client has exceeded their quota. If they're under the limit, the request proceeds. If they've hit the cap, the request gets rejected. This protects APIs from abuse and ensures fair resource allocation across clients.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Clarifying Questions & Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                'The interview prompt: "You\'re building an in-memory rate limiter for an API gateway. The system receives configuration from an external service that provides rate limiting rules per endpoint. Each endpoint can have its own limit with a specific algorithm." Before coding, spend 3-5 minutes asking structured questions around core operations, scope boundaries, and configuration semantics.',
            },
            {
              id: "b5",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Configuration is provided at startup (loaded once, not hot-reloaded).",
                  "System receives requests with (clientId: string, endpoint: string).",
                  'Each endpoint has a configuration specifying: algorithm to use (e.g., "TokenBucket", "SlidingWindowLog") and algorithm-specific parameters (e.g., capacity, refillRatePerSecond for Token Bucket).',
                  "System enforces rate limits by checking clientId against the endpoint's configuration.",
                  "Return structured result: (allowed: boolean, remaining: int, retryAfterMs: long | null).",
                  "If endpoint has no configuration, use a default limit.",
                ],
              },
            },
            {
              id: "b6",
              type: "heading",
              content: "Out of Scope",
              metadata: { level: 3 },
            },
            {
              id: "b7",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Distributed rate limiting (Redis, coordination across servers)",
                  "Dynamic configuration updates (hot-reloading)",
                  "Metrics and monitoring",
                  "Config validation beyond basic checks",
                ],
              },
            },
            {
              id: "b8",
              type: "heading",
              content: "Entity Identification",
              metadata: { level: 2 },
            },
            {
              id: "b9",
              type: "paragraph",
              content:
                "Scan the requirements for nouns that represent things with behavior or state. Evaluate each candidate: does it have its own behavior, or is it just data that lives on another entity?",
            },
            {
              id: "b10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Request — NOT an entity. The request is external. We receive (clientId, endpoint) as strings and immediately use them for lookup. This stays as method parameters, not a class.",
                  "Client — NOT an entity. The client ID is just a key we use to track per-client state. We don't manage client lifecycles or properties.",
                  "Endpoint — NOT an entity. Just a label string we use to look up which algorithm to apply.",
                  "Rate Limiting Algorithm (Limiter interface) — YES. Each algorithm has algorithm-specific config, per-key state, and its own allow/deny logic. Different algorithms = different classes implementing a common interface.",
                  "RateLimiter — YES. The orchestrator and entry point. Looks up the endpoint's config, picks the right algorithm instance, and delegates to it.",
                  "RateLimitResult — YES. A value object packaging the decision (allowed, remaining, retryAfterMs). Immutable once created.",
                ],
              },
            },
            {
              id: "b11",
              type: "quote",
              content:
                "A common mistake is modeling Request or Client as classes. Ask yourself: what behavior would they have? In our system, clientId is just a lookup key and endpoint is just a routing label. Don't create entities for concepts that have no behavior in your system.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Class Design & Implementation
    {
      title: "Class Design & Algorithm Implementation",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Class Design & Algorithm Implementation",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Final Class Design",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "code",
              content:
                "class RateLimiter:\n    - limiters: Map<string, Limiter>\n    - defaultLimiter: Limiter\n\n    + RateLimiter(configs, defaultConfig)\n    + allow(clientId, endpoint) -> RateLimitResult\n\nclass LimiterFactory:\n    + create(configData) -> Limiter\n\ninterface Limiter:\n    + allow(key) -> RateLimitResult\n\nclass RateLimitResult:\n    - allowed: boolean\n    - remaining: int\n    - retryAfterMs: long | null\n\n    + RateLimitResult(allowed, remaining, retryAfterMs)\n    + isAllowed() -> boolean\n    + getRemaining() -> int\n    + getRetryAfterMs() -> long | null",
              metadata: { language: "text" },
            },
            {
              id: "c3",
              type: "heading",
              content: "Key Design Decisions",
              metadata: { level: 2 },
            },
            {
              id: "c4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Factory Pattern: LimiterFactory handles heterogeneous config — reads the algorithm discriminator, extracts algo-specific parameters from the nested algoConfig object, and instantiates the correct Limiter. Centralizes creation logic in one place.",
                  "Strategy Pattern: Each Limiter implementation (TokenBucket, SlidingWindowLog) encapsulates its own algorithm and per-key state. RateLimiter delegates to the appropriate strategy without knowing the algorithm details.",
                  "Interface over abstract class: Different algorithms need fundamentally different per-key state (Token Bucket: tokens + lastRefillTime; Sliding Window Log: Queue<timestamp>). No common structure to share in a base class.",
                  "Eager instantiation: All limiters created at startup. For typical scales (dozens of endpoints), memory overhead is negligible. Avoids synchronized lazy creation complexity.",
                ],
              },
            },
            {
              id: "c5",
              type: "heading",
              content: "Implementation: LimiterFactory",
              metadata: { level: 2 },
            },
            {
              id: "c6",
              type: "code",
              content:
                'create(externalConfig)\n    algorithm = externalConfig["algorithm"]\n    algoConfig = externalConfig["algoConfig"]\n    \n    switch algorithm\n        case "TokenBucket":\n            return new TokenBucketLimiter(\n                algoConfig["capacity"],\n                algoConfig["refillRatePerSecond"]\n            )\n        case "SlidingWindowLog":\n            return new SlidingWindowLogLimiter(\n                algoConfig["maxRequests"],\n                algoConfig["windowMs"]\n            )\n        default:\n            throw new IllegalArgumentException("Unknown algorithm: " + algorithm)',
              metadata: { language: "text" },
            },
            {
              id: "c7",
              type: "heading",
              content: "Implementation: RateLimiter",
              metadata: { level: 2 },
            },
            {
              id: "c8",
              type: "code",
              content:
                'RateLimiter(configs, defaultConfig)\n    factory = new LimiterFactory()\n    limiters = new HashMap()\n    for externalConfig in configs\n        endpoint = externalConfig["endpoint"]\n        limiter = factory.create(externalConfig)\n        limiters[endpoint] = limiter\n    defaultLimiter = factory.create(defaultConfig)\n\nallow(clientId, endpoint)\n    limiter = limiters.get(endpoint)\n    if limiter == null\n        limiter = defaultLimiter\n    return limiter.allow(clientId)',
              metadata: { language: "text" },
            },
            {
              id: "c9",
              type: "heading",
              content: "Token Bucket Algorithm",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "Token Bucket provides smooth traffic shaping. Each client has a bucket holding a certain number of tokens that refill at a constant rate. Each request consumes one token. If tokens are available, the request proceeds. If the bucket is empty, the request is denied. This allows bursts up to bucket capacity while maintaining an average rate. Companies like Stripe use this approach.",
            },
            {
              id: "c11",
              type: "code",
              content:
                "class TokenBucketLimiter implements Limiter:\n    capacity: int\n    refillRatePerSecond: int\n    buckets: Map<string, TokenBucket>\n\n    allow(key)\n        bucket = getOrCreateBucket(key)\n        \n        now = currentTimeMillis()\n        elapsed = now - bucket.lastRefillTime\n        tokensToAdd = (elapsed * refillRatePerSecond) / 1000\n        bucket.tokens = min(capacity, bucket.tokens + tokensToAdd)\n        bucket.lastRefillTime = now\n        \n        if bucket.tokens >= 1\n            bucket.tokens -= 1\n            return RateLimitResult(true, floor(bucket.tokens), null)\n        else\n            tokensNeeded = 1 - bucket.tokens\n            retryAfterMs = ceil((tokensNeeded * 1000) / refillRatePerSecond)\n            return RateLimitResult(false, 0, retryAfterMs)\n\nclass TokenBucket:\n    tokens: double\n    lastRefillTime: long",
              metadata: { language: "text" },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                "Key insight: No background thread refills buckets. Instead, tokens are refilled on-demand when a request arrives by calculating elapsed time since the last refill. This is simpler and more efficient for sparse traffic patterns. New buckets start full (capacity tokens), giving first-time clients their full burst capacity immediately.",
            },
            {
              id: "c13",
              type: "heading",
              content: "Sliding Window Log Algorithm",
              metadata: { level: 2 },
            },
            {
              id: "c14",
              type: "paragraph",
              content:
                "Sliding Window Log provides precise rate limiting by tracking the exact timestamp of each request in a rolling window. When a new request arrives, stale timestamps outside the window are removed, then remaining timestamps are counted. If under the limit, the request is allowed and its timestamp is added. If at the limit, the request is denied. This gives perfect accuracy but uses more memory (one stored timestamp per request within the window).",
            },
            {
              id: "c15",
              type: "code",
              content:
                "class SlidingWindowLogLimiter implements Limiter:\n    maxRequests: int\n    windowMs: long\n    logs: Map<string, RequestLog>\n\n    allow(key)\n        log = getOrCreateLog(key)\n        now = currentTimeMillis()\n        cutoff = now - windowMs\n        \n        // Remove stale timestamps\n        while log.timestamps.isNotEmpty() && log.timestamps.peek() < cutoff\n            log.timestamps.poll()\n        \n        if log.timestamps.size() < maxRequests\n            log.timestamps.add(now)\n            return RateLimitResult(true, maxRequests - log.timestamps.size(), null)\n        else\n            oldestTimestamp = log.timestamps.peek()\n            retryAfterMs = (oldestTimestamp + windowMs) - now\n            return RateLimitResult(false, 0, retryAfterMs)\n\nclass RequestLog:\n    timestamps: Queue<long>   // FIFO — oldest at front",
              metadata: { language: "text" },
            },
            {
              id: "c16",
              type: "paragraph",
              content:
                "Uses a queue (not a list) because we only ever add to the end and remove from the front — classic FIFO. Queue gives O(1) for both operations. The retry time calculation uses the oldest timestamp: that's the first one to age out of the window, at which point capacity opens up.",
            },
          ],
          readingTime: 15,
        },
      },
    },

    // Material 3: Extensibility & Tradeoffs
    {
      title: "Extensibility, Thread Safety & Tradeoffs",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Extensibility, Thread Safety & Tradeoffs",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Algorithm Comparison",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Token Bucket — Per-key state: (tokens, lastRefillTime). Allows bursts up to capacity, smooth refill. Memory efficient: 2 fields per client.",
                  "Sliding Window Log — Per-key state: List<timestamp>. Perfect accuracy. High memory: stores every request timestamp in the window.",
                  "Fixed Window Counter — Per-key state: (count, windowStart). Simplest but has boundary effects: a burst at the window boundary can allow 2x the limit.",
                  "Sliding Window Counter — Per-key state: (currentCount, prevCount, windowStart). Balances accuracy and memory by interpolating between two fixed windows.",
                ],
              },
            },
            {
              id: "d3",
              type: "heading",
              content: "Extension 1: Adding a New Algorithm",
              metadata: { level: 2 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "Two steps: (1) Implement the Limiter interface with the algorithm's logic and a constructor taking its parameters. (2) Add one case to the factory switch. The RateLimiter orchestrator doesn't change. Existing limiters don't change. This is the Open-Closed Principle in action — adding new algorithms without modifying existing code (except the factory dispatch).",
            },
            {
              id: "d5",
              type: "heading",
              content: "Extension 2: Dynamic Configuration Updates",
              metadata: { level: 2 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Good solution: Add a reloadConfig() method that tears down all existing limiters and creates new ones. Simple, uses the same factory logic as startup, and the atomic swap prevents inconsistent state. Downside: all per-key state is lost — clients get fresh quotas.\n\nGreat solution: Add an updateConfig() method to the Limiter interface. Each algorithm updates its parameters while preserving per-key state. Token Bucket can adjust capacity/refill rate while keeping existing token counts. More complex but preserves rate-limiting history across config changes.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Extension 3: Thread Safety",
              metadata: { level: 2 },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "Without thread safety, two threads can read the same bucket state simultaneously and both allow a request when only one should be allowed. The solution is per-key locking: use a ConcurrentHashMap for the buckets map and synchronize on the bucket object itself. Client A and Client B can be checked concurrently — they only block each other if they're the same client.",
            },
            {
              id: "d9",
              type: "code",
              content:
                "allow(key)\n    // Atomically get or create bucket\n    bucket = buckets.computeIfAbsent(key, k -> new TokenBucket(capacity, now()))\n    \n    synchronized(bucket)\n        // All refill + check + consume logic runs under per-key lock\n        // ...\n    \n    return new RateLimitResult(allowed, remaining, retryAfterMs)",
              metadata: { language: "text" },
            },
            {
              id: "d10",
              type: "heading",
              content: "Extension 4: Memory Growth & Eviction",
              metadata: { level: 2 },
            },
            {
              id: "d11",
              type: "paragraph",
              content:
                "As more clients make requests, the buckets/logs maps grow without bound. Solutions: (1) Track last access time per key and periodically evict entries not accessed within a timeout (e.g., 1 hour). (2) Use an LRU cache with fixed capacity — evict least recently used clients when the limit is hit. When a client's state is evicted, their next request looks like a first-time request with full burst capacity. This is acceptable for inactive clients.",
            },
            {
              id: "d12",
              type: "heading",
              content: "What Distinguishes Each Level",
              metadata: { level: 2 },
            },
            {
              id: "d13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Junior: Identify the need for RateLimiter, Limiter interface, and RateLimitResult. Implement one algorithm correctly with proper per-client state tracking. Factory extracts parameters from config.",
                  "Mid-level: Clean separation of concerns without guidance. Recognize config flows as raw data through the factory. Handle edge cases: unknown algorithms, retry time calculation. Justify design decisions when asked.",
                  "Senior: Proactively discuss tradeoffs (factory switch vs registry, on-demand vs background refill, per-key vs global locking). Catch edge cases yourself (massive elapsed time, integer overflow). Discuss multiple extensibility approaches with tradeoffs.",
                ],
              },
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
      title: "Why Request is not an entity",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When designing the Rate Limiter system, why should Request NOT be modeled as its own class?",
        explanation:
          "Request has no behavior in our system. We receive (clientId, endpoint) as strings and immediately use them for lookup — there is no request object to maintain, no lifecycle to manage, and no rules to enforce about requests themselves. Creating a Request class would add an entity with no methods, violating the principle that classes should encapsulate both data and behavior. The values stay as method parameters to RateLimiter.allow().",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "The request is external — clientId and endpoint are just lookup strings with no behavior, so they stay as method parameters",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Request is too simple to be a class — it should be modeled as a struct instead",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Request already exists in the API gateway framework, so modeling it again would create a conflict",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Having a Request class would create a circular dependency with RateLimiter",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Purpose of the RateLimiter class",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "What is the RateLimiter class's primary role in the rate limiter design?",
        explanation:
          "RateLimiter is the orchestrator — the system's single public entry point. External code calls allow(clientId, endpoint) and gets back a RateLimitResult. Internally, it holds a map from endpoint strings to Limiter instances, looks up the right one (or falls back to default), and delegates the rate-limiting decision. It does NOT implement any algorithm logic itself.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Orchestrator — it receives requests, looks up the endpoint's limiter, and delegates the rate-limiting decision",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Algorithm — it implements Token Bucket and Sliding Window logic directly",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Factory — it creates and manages the lifecycle of Limiter objects at runtime",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Data store — it persists rate-limiting state to an external database for durability",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Why interface over abstract class for Limiter",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "Why is Limiter designed as an interface rather than an abstract base class?",
        explanation:
          "Different algorithms need fundamentally different per-key state. Token Bucket tracks (tokens: double, lastRefillTime: long). Sliding Window Log tracks (timestamps: Queue<long>). Fixed Window Counter tracks (count, windowStart). There is no common state or shared helper methods to pull into a base class. An abstract base class with no fields and no shared methods is just an interface with extra complexity.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Algorithms need fundamentally different per-key state — there is no common structure to share in a base class",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Interfaces allow multiple inheritance while abstract classes do not",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Abstract classes cannot define method signatures without implementations",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Using an interface improves runtime performance due to JIT optimizations",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Token Bucket on-demand refill advantage",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The Token Bucket implementation refills tokens on-demand when a request arrives (calculating elapsed time) instead of using a background timer thread. What is the primary advantage of this approach?",
        explanation:
          "A timer-based approach would iterate through ALL buckets periodically, even for clients who haven't made any requests. This is wasteful for sparse traffic patterns. The on-demand approach only does work when requests actually arrive — if a client is inactive, their bucket is never touched. This is simpler to implement, more efficient, and what most production systems (including Stripe) actually use. No background thread management, no timer coordination, no wasted CPU cycles.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "It only does work when requests actually arrive — no wasted CPU iterating idle buckets, simpler than managing a background thread",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It allows token values to be fractional (e.g., 0.5 tokens), which a timer-based approach cannot support",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It eliminates the need for a per-key map since refill state is computed rather than stored",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It makes the system automatically thread-safe since there are no concurrent timer callbacks",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Token Bucket retry time calculation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A Token Bucket has capacity=100, refillRatePerSecond=10, and a client's bucket currently has 0.3 tokens after refill. The request is denied. How is retryAfterMs calculated?",
        explanation:
          "We need 1 token to allow a request. We currently have 0.3. So tokensNeeded = 1 - 0.3 = 0.7. At a refill rate of 10 tokens/second, it takes 0.7/10 = 0.07 seconds = 70ms. The formula is: retryAfterMs = ceil((tokensNeeded * 1000) / refillRatePerSecond) = ceil((0.7 * 1000) / 10) = ceil(70) = 70ms. We use ceil() to avoid telling a client to retry too soon.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "tokensNeeded = 1 - 0.3 = 0.7, retryAfterMs = ceil((0.7 × 1000) / 10) = 70ms",
              isCorrect: true,
            },
            {
              id: "b",
              text: "retryAfterMs = capacity / refillRatePerSecond × 1000 = 10000ms (full refill time)",
              isCorrect: false,
            },
            {
              id: "c",
              text: "retryAfterMs = 1000 / refillRatePerSecond = 100ms (time for one token)",
              isCorrect: false,
            },
            {
              id: "d",
              text: "retryAfterMs = (1 - 0.3) × 1000 = 700ms (tokens needed × 1 second)",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Sliding Window Log retry time logic",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In the Sliding Window Log algorithm, when a request is denied, retryAfterMs is calculated using the oldest timestamp in the queue. Why the oldest, not the newest?",
        explanation:
          "The oldest timestamp in the queue is the first one that will age out of the sliding window. Once it falls outside the window (and is removed), the count drops below maxRequests and we have capacity for a new request. The newest timestamp is the last one added and will be the last to age out — telling the client to wait for that would be telling them to wait until the entire window clears, which is far longer than necessary.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The oldest timestamp is the first to age out of the window — once it does, capacity opens up for a new request",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The oldest timestamp represents the slowest request, which determines when the system can process the next one",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Using the newest would cause an infinite loop since it keeps advancing with each denied request",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The oldest timestamp is easier to access because queues only allow reading from the front",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Thread safety race condition",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "Without thread safety, two threads process Token Bucket allow() for the same client simultaneously. Thread A reads bucket.tokens = 1, Thread B reads bucket.tokens = 1. Both see a token available and both decrement. What is the correct threading solution and why?",
        explanation:
          "Per-key locking synchronizes on the bucket object itself. This allows Client A and Client B to be checked concurrently (different locks) while ensuring two requests for the same client are serialized (same lock). A global lock would serialize ALL requests across ALL clients — massively reducing throughput. AtomicInteger doesn't work because the refill-check-consume sequence is not a single atomic operation. Lock-free CAS could work but is significantly more complex to implement correctly.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Per-key locking — synchronize on the bucket object itself. Different clients proceed concurrently; only same-client requests are serialized.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Global lock on the entire limiter — simple and prevents all race conditions",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Replace the tokens field with an AtomicInteger to make the decrement thread-safe",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Use a single-threaded event loop (like Redis) to serialize all rate-limiting checks",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Dynamic config reload: state preservation tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "Two approaches exist for dynamic configuration updates: (A) tear down all limiters and recreate from config, or (B) add updateConfig() to Limiter interface to preserve per-key state. When would approach A's state loss actually be dangerous rather than acceptable?",
        explanation:
          "When decreasing limits in response to detected abuse, resetting all state gives abusers a clean slate — exactly defeating the purpose. If Client X has consumed 95/100 tokens and you reload config to lower the limit to 50, their bucket resets to 50 available tokens instead of being blocked. Approach B preserves the token count at 5, which correctly reflects their remaining capacity. For increases or rare config deployments, state loss from approach A is acceptable.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "When lowering limits to combat active abuse — resetting state gives abusers a fresh quota instead of keeping them throttled",
              isCorrect: true,
            },
            {
              id: "b",
              text: "When the system handles more than 1000 endpoints — recreating all limiters takes too long",
              isCorrect: false,
            },
            {
              id: "c",
              text: "When using Sliding Window Log — timestamps are expensive to regenerate while Token Bucket state is cheap to reset",
              isCorrect: false,
            },
            {
              id: "d",
              text: "When the system is multi-threaded — recreating limiters while handling requests causes deadlocks",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Valid entities for the Rate Limiter system",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid entities (classes/interfaces with meaningful behavior) for the Rate Limiter system:",
        explanation:
          "RateLimiter (orchestrator), Limiter interface (rate-limiting contract), and RateLimitResult (structured return value) are all valid entities with distinct responsibilities. Request has no behavior — clientId and endpoint are just method parameters. Client has no behavior — the client ID is just a lookup key used to index per-client state within each algorithm.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "RateLimiter — orchestrates endpoint lookup and delegates to the right algorithm",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Limiter (interface) — defines the allow(key) contract for all rate-limiting algorithms",
              isCorrect: true,
            },
            {
              id: "c",
              text: "RateLimitResult — packages the decision with remaining quota and retry timing",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Request — represents the incoming API request with clientId and endpoint",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Client — represents the API consumer with their identity and permissions",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid Token Bucket per-key state fields",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Which fields are needed in the per-key state (TokenBucket) for the Token Bucket algorithm? Select ALL that are necessary.",
        explanation:
          "tokens (double) tracks how many tokens are currently available. lastRefillTime (long) records when we last calculated token refill, enabling on-demand refill. capacity and refillRatePerSecond are configuration shared across ALL clients and belong on the TokenBucketLimiter class, not on individual buckets. A requestCount field is not needed — the token count itself captures the rate-limiting state.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "tokens: double — how many tokens are currently available (fractional because refill is continuous)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "lastRefillTime: long — when we last recalculated the token count, for on-demand refill",
              isCorrect: true,
            },
            {
              id: "c",
              text: "capacity: int — maximum number of tokens this bucket can hold",
              isCorrect: false,
            },
            {
              id: "d",
              text: "refillRatePerSecond: int — how fast tokens replenish",
              isCorrect: false,
            },
            {
              id: "e",
              text: "requestCount: int — total number of requests made by this client",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Design patterns used in the Rate Limiter",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Which design patterns are used in the Rate Limiter system design? Select ALL that apply.",
        explanation:
          "Factory Pattern: LimiterFactory creates the correct Limiter implementation based on the algorithm discriminator in the config. Strategy Pattern: Each Limiter implementation encapsulates a different algorithm — TokenBucketLimiter and SlidingWindowLogLimiter are interchangeable strategies that RateLimiter delegates to. Observer Pattern is not used — there are no event subscriptions or notifications. Singleton Pattern is not used — multiple RateLimiter instances could exist.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Factory Pattern — LimiterFactory creates the correct Limiter from heterogeneous config data",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Strategy Pattern — each Limiter implementation is an interchangeable algorithm that RateLimiter delegates to",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Observer Pattern — Limiter instances notify RateLimiter when rate limits are exceeded",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Singleton Pattern — RateLimiter ensures only one instance exists per process",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Senior-level design considerations for Rate Limiter",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are considerations that distinguish a Senior-level answer from a Mid-level answer in a Rate Limiter LLD interview? Select ALL that apply.",
        explanation:
          "Senior candidates proactively discuss: (1) per-key locking vs global locking tradeoffs for concurrency, (2) on-demand refill vs background timer thread and why on-demand wins for sparse traffic, (3) memory growth from unbounded client maps and eviction strategies. However, implementing distributed consensus (Raft/Paxos) for rate limiting state is over-engineering — this is explicitly an in-memory, single-process problem.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Proactively discussing per-key locking vs global locking and why per-key is better for throughput",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Explaining why on-demand token refill is preferred over background timer threads for sparse traffic patterns",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Identifying the memory leak from unbounded client maps and proposing eviction strategies (LRU, TTL-based)",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Implementing Raft consensus to synchronize rate-limiting state across multiple servers",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Explain entity identification for Rate Limiter",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Walk through the entity identification process for the Rate Limiter system. For each noun candidate (Request, Client, Endpoint, Rate Limiting Algorithm, RateLimiter, RateLimitResult), explain whether it should be a class/interface and justify based on whether it has meaningful behavior.",
        explanation:
          "A strong answer evaluates each candidate against a clear criterion: does it have behavior (methods) in our system? Request, Client, and Endpoint fail — they are just parameters or lookup keys. Algorithm (Limiter), RateLimiter, and RateLimitResult each have distinct responsibilities.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Entity identification starts by extracting nouns from requirements and evaluating each: does this concept have meaningful behavior in our system?\n\nRequest — NOT an entity. We receive (clientId, endpoint) as strings and immediately use them for lookup. There is no request lifecycle to manage, no rules to enforce about requests themselves. These stay as method parameters to allow().\n\nClient — NOT an entity. The client ID is just a key we use to track per-client state (like remaining tokens). We don't manage client lifecycles, permissions, or properties.\n\nEndpoint — NOT an entity. Just a label string we use to look up which algorithm to apply. It has no behavior.\n\nRate Limiting Algorithm (Limiter interface) — YES. Each algorithm (Token Bucket, Sliding Window Log) has: algorithm-specific configuration, per-key state that varies by algorithm, and its own allow/deny logic. Different algorithms are different classes implementing a common interface.\n\nRateLimiter — YES, the orchestrator. It is the system's single public API entry point. External code calls allow(clientId, endpoint). It holds a map from endpoints to Limiter instances, handles fallback to a default limiter, and delegates the actual decision.\n\nRateLimitResult — YES, a value object. It packages three pieces of data: allowed (boolean), remaining (int), and retryAfterMs (long | null). Immutable once created. Without it, we'd be juggling loose primitives or returning a map with string keys.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the Factory Pattern in Rate Limiter",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain why the Factory Pattern is used in the Rate Limiter design. What problem does LimiterFactory solve? What would happen without it? When might you evolve the factory into a registry pattern?",
        explanation:
          "A strong answer explains: (1) the heterogeneous config problem — same JSON structure but different algorithm-specific parameters, (2) why creation logic needs to be centralized, (3) the concrete mechanics of the switch dispatch, and (4) when registry > factory.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "LimiterFactory solves the heterogeneous configuration problem. Each endpoint's config has the same outer structure (endpoint, algorithm, algoConfig) but the algoConfig parameters differ by algorithm. Token Bucket needs capacity and refillRatePerSecond. Sliding Window Log needs maxRequests and windowMs. The factory reads the algorithm discriminator, extracts the correct parameters, and instantiates the right class.\n\nWithout the factory, this creation logic would be scattered wherever limiters are created — in RateLimiter's constructor today, potentially in a reload method tomorrow. If you add a new algorithm, you'd need to find and update every creation site. The factory centralizes it.\n\nThe factory uses a switch-based dispatch: read the algorithm field, match it to a case, extract algo-specific params, call the constructor. Unknown algorithms fail fast with a clear error.\n\nYou'd evolve to a registry pattern (Map<String, AlgorithmConstructor>) if algorithms become pluggable at runtime — for example, if third parties can register custom algorithms. Instead of modifying a switch statement, you register a constructor function: registry.put(\"MyCustomAlgo\", config -> new MyCustomLimiter(config)). For two algorithms in an interview, the switch is clearer and more direct.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Token Bucket walkthrough with state tracking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'A Token Bucket limiter has capacity=10 and refillRatePerSecond=1. Client "user123" makes requests. Trace through the following sequence showing bucket state (tokens, lastRefillTime) after each operation: (1) Request at t=0, (2) Request at t=500ms, (3) 10 rapid requests depleting the bucket, (4) Request when bucket has 0.1 tokens at t=1100ms with lastRefillTime=1000ms.',
        explanation:
          "Must trace all state changes precisely including fractional token values, on-demand refill calculations, and retry time computation for denied requests.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Request 1 at t=0:\n- getOrCreateBucket("user123") creates bucket: tokens=10, lastRefillTime=0\n- now=0, elapsed=0, tokensToAdd=(0 × 1)/1000 = 0\n- bucket.tokens = min(10, 10+0) = 10 (no change)\n- tokens >= 1: consume one. bucket.tokens = 9\n- Return RateLimitResult(allowed=true, remaining=9, retryAfterMs=null)\n- State: {tokens: 9, lastRefillTime: 0}\n\nRequest 2 at t=500ms:\n- Bucket exists: tokens=9, lastRefillTime=0\n- now=500, elapsed=500, tokensToAdd=(500 × 1)/1000 = 0.5\n- bucket.tokens = min(10, 9+0.5) = 9.5\n- bucket.lastRefillTime = 500\n- tokens >= 1: consume one. bucket.tokens = 8.5\n- Return RateLimitResult(allowed=true, remaining=8, retryAfterMs=null)\n- State: {tokens: 8.5, lastRefillTime: 500}\n\n10 rapid requests:\nAfter 10 more requests in quick succession (minimal elapsed time, near-zero refill), bucket is nearly depleted. ~0 tokens remain.\n\nRequest when bucket has 0.1 tokens at t=1100ms (lastRefillTime=1000ms):\n- now=1100, elapsed=100, tokensToAdd=(100 × 1)/1000 = 0.1\n- bucket.tokens = min(10, 0.1+0.1) = 0.2\n- bucket.lastRefillTime = 1100\n- tokens < 1: DENIED\n- tokensNeeded = 1 - 0.2 = 0.8\n- retryAfterMs = ceil((0.8 × 1000) / 1) = 800ms\n- Return RateLimitResult(allowed=false, remaining=0, retryAfterMs=800)\n\nThis verifies refill logic, consumption, fractional tokens, and retry calculation all work correctly.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Compare Token Bucket vs Sliding Window Log",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Compare Token Bucket and Sliding Window Log algorithms across four dimensions: (1) per-key state and memory usage, (2) accuracy of rate limiting, (3) burst handling, and (4) scenarios where each is the better choice. Include specific examples.",
        explanation:
          "A strong answer goes beyond listing differences — it explains the tradeoffs with specific examples and when each algorithm is the better choice.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Per-key state & memory:\nToken Bucket stores exactly 2 fields per client: tokens (double) and lastRefillTime (long). Memory is O(1) per client regardless of request rate. Sliding Window Log stores a queue of timestamps — one entry per request within the window. A client making 1000 requests/minute stores 1000 timestamps. Memory is O(requests per window) per client.\n\nAccuracy:\nSliding Window Log provides perfect accuracy — it tracks every request timestamp and knows exactly how many requests occurred in any sliding window. Token Bucket approximates — it allows bursts up to capacity and then rate-limits to refillRate. Two clients with the same rate limit can have different effective rates depending on their traffic pattern.\n\nBurst handling:\nToken Bucket explicitly allows bursts up to capacity. A bucket with capacity=100 and refillRate=10/s allows 100 requests instantly, then 10/s steady state. This is a feature — APIs often want to allow short bursts. Sliding Window Log has no burst concept — it simply counts requests in the window. 100 requests/minute means exactly 100, whether spread evenly or in a burst.\n\nWhen to choose each:\nToken Bucket: When burst tolerance is desired (e.g., Stripe's API — allow a merchant to make many requests quickly when processing a batch of charges, then throttle). Memory-constrained environments. When you want smooth traffic shaping.\nSliding Window Log: When exact rate enforcement matters (e.g., regulatory compliance requiring exactly N operations per time period). When request timestamps need to be auditable. When the request rate per client is low enough that memory isn't a concern.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Dynamic config update approaches and tradeoffs",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "The rate limiter currently loads config at startup. Your team wants to add dynamic configuration updates without restarts. Describe two approaches (simple reload vs state-preserving update), their tradeoffs, and when you would choose each. What happens when the algorithm type itself changes for an endpoint?",
        explanation:
          "A strong answer describes both approaches in detail, gives concrete examples of when state loss matters, and addresses the algorithm-switch edge case.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Approach 1 — Tear down and rebuild (reloadConfig):\nAdd a reloadConfig(configs, defaultConfig) method that creates a new HashMap of limiters using the same factory logic as the constructor, then atomically swaps it with the old map. Simple, reuses existing code, and the atomic swap prevents inconsistent state.\n\nTradeoff: All per-key state is lost. Every client gets a fresh start. This is acceptable when increasing limits during a traffic spike (fresh quotas are fine) or when config changes are rare (once per deployment). It is DANGEROUS when decreasing limits to combat abuse — abusers get a clean slate instead of remaining throttled.\n\nApproach 2 — State-preserving update (updateConfig on Limiter):\nAdd updateConfig(configData) to the Limiter interface. Each algorithm updates its parameters while preserving per-key state. TokenBucketLimiter updates capacity and refillRatePerSecond, then clamps existing bucket tokens to the new capacity. SlidingWindowLogLimiter updates maxRequests or windowMs without clearing the timestamp history.\n\nTradeoff: More complex — each algorithm needs custom update logic. But it preserves rate-limiting history, enabling gradual rollout and accurate enforcement across config changes.\n\nAlgorithm type change (e.g., TokenBucket → SlidingWindowLog for /search):\nState preservation is impossible — the algorithms have incompatible state (tokens vs timestamp queues). You must replace the limiter entirely. The updateEndpointConfig method should detect when the algorithm type has changed and fall back to creating a new limiter via the factory. Only same-algorithm config changes can preserve state.\n\nChoice: Use Approach 1 for simple deployments with infrequent changes. Use Approach 2 for production systems where rate-limiting continuity matters (paid API keys, abuse prevention).",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Explain per-key locking strategy for thread safety",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the per-key locking strategy for making the Token Bucket rate limiter thread-safe. Why is per-key locking better than a global lock? Walk through how two concurrent requests for the same client are handled, and two concurrent requests for different clients.",
        explanation:
          "A strong answer explains the race condition, the per-key locking mechanism, the use of ConcurrentHashMap with computeIfAbsent, and demonstrates understanding through concrete scenarios.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'The race condition: Without locking, Thread A reads bucket.tokens = 1 for client X, Thread B also reads bucket.tokens = 1 for client X. Both see a token available, both decrement, both return "allowed." We\'ve permitted 2 requests when only 1 token was available.\n\nPer-key locking solution:\n1. Use ConcurrentHashMap for the buckets map — this allows thread-safe get/put without a global lock.\n2. Use computeIfAbsent(key, ...) to atomically get-or-create the bucket — this prevents two threads from creating duplicate buckets for the same key.\n3. Synchronize on the bucket object itself for the refill-check-consume operation.\n\nSame client, two threads (Client X):\n- Thread A calls computeIfAbsent("X") → gets bucketX.\n- Thread B calls computeIfAbsent("X") → gets the SAME bucketX.\n- Thread A acquires synchronized(bucketX) — enters the critical section, refills, checks, consumes.\n- Thread B tries to acquire synchronized(bucketX) — BLOCKS until Thread A releases.\n- Thread A completes, releases the lock.\n- Thread B acquires the lock, now sees the updated token count (1 fewer), and makes its decision based on the correct state.\n\nDifferent clients (Client X and Client Y):\n- Thread A gets bucketX, Thread B gets bucketY — different objects.\n- Thread A acquires synchronized(bucketX), Thread B acquires synchronized(bucketY) — no contention.\n- Both proceed concurrently without blocking each other.\n\nThis is why per-key locking beats a global lock: a global lock would serialize ALL requests, even for unrelated clients. Per-key locking allows maximum concurrency — only requests for the same client are serialized, which is exactly the semantic we need for rate limiting.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Name the pattern for algorithm selection",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What design pattern does the Rate Limiter use to allow different rate-limiting algorithms (Token Bucket, Sliding Window Log) to be interchangeable behind a common Limiter interface?",
        explanation:
          "The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. RateLimiter delegates to a Limiter without knowing which algorithm it is. Each Limiter implementation (TokenBucketLimiter, SlidingWindowLogLimiter) encapsulates its algorithm and per-key state.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Strategy Pattern",
        },
      },
    },

    // Text 2 — medium
    {
      title: "Identify the memory leak",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "The Token Bucket implementation creates per-client buckets on demand using getOrCreateBucket(). What is the hidden memory issue with this approach as the system runs over time?",
        explanation:
          "Buckets are created for each new client ID but never removed from the map. As more unique clients make requests, the buckets map grows without bound. Inactive clients' buckets remain in memory indefinitely. This is a memory leak that would eventually exhaust available memory in a long-running system serving many unique clients.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Buckets are never removed from the map. The map grows without bound as more unique clients make requests, leaking memory for inactive clients.",
        },
      },
    },

    // Text 3 — hard
    {
      title: "Fixed Window Counter boundary problem",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'The Fixed Window Counter algorithm is simpler than Token Bucket and Sliding Window Log but has a well-known "boundary effect" problem. Describe this problem with a concrete example showing how a client could exceed the intended rate limit.',
        explanation:
          "Fixed Window Counter resets at window boundaries. A client could make max requests at the end of window N and max requests at the start of window N+1, effectively getting 2x the rate limit within a short period spanning the window boundary. For example, with a limit of 100 requests per 60-second window, a client makes 100 requests in the last second of window 1 and 100 requests in the first second of window 2 — 200 requests in 2 seconds.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "A client makes max requests at the end of one window and max requests at the start of the next window. Example: 100 requests/min limit — client sends 100 requests in the last second of window 1 and 100 in the first second of window 2, achieving 200 requests in 2 seconds (effectively 2x the rate limit near the boundary).",
        },
      },
    },

    // Text 4 — hard
    {
      title: "Why tokens is a double not an int",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In the Token Bucket implementation, the tokens field is a double (floating-point) rather than an int. Why is this necessary? What would go wrong if it were an integer?",
        explanation:
          "Tokens refill continuously. If 100ms has passed and the refill rate is 10 tokens/second, tokensToAdd = (100 × 10) / 1000 = 1.0. But if 50ms has passed, tokensToAdd = (50 × 10) / 1000 = 0.5. With an integer, this would truncate to 0, meaning short intervals would never refill any tokens. Over many small intervals, the accumulated error would cause the limiter to be significantly more restrictive than configured.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Tokens refill continuously — fractional amounts like 0.5 tokens are valid states. With integers, small time intervals would always truncate to 0 tokens refilled, making the limiter significantly more restrictive than configured because the accumulated fractional refill is lost.",
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match classes to responsibilities",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content:
          "Match each class/interface in the Rate Limiter design to its primary responsibility:",
        explanation:
          "RateLimiter is the orchestrator that maps endpoints to limiter instances and delegates. LimiterFactory creates the correct Limiter from heterogeneous config. Limiter interface defines the algorithm contract. RateLimitResult packages the decision as an immutable value object.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "RateLimiter",
              right:
                "Orchestrates endpoint lookup and delegates to the appropriate algorithm instance",
            },
            {
              id: "p2",
              left: "LimiterFactory",
              right: "Parses config data and instantiates the correct Limiter implementation",
            },
            {
              id: "p3",
              left: "Limiter (interface)",
              right: "Defines the allow(key) → RateLimitResult contract for all algorithms",
            },
            {
              id: "p4",
              left: "RateLimitResult",
              right: "Immutable value object packaging allowed, remaining, and retryAfterMs",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match algorithms to per-key state",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each rate-limiting algorithm to the per-key state it maintains for each client:",
        explanation:
          "Each algorithm uses fundamentally different per-key state, which is why Limiter is an interface rather than an abstract class. Token Bucket tracks tokens and refill time. Sliding Window Log tracks a queue of timestamps. Fixed Window Counter tracks a count and window boundary. Sliding Window Counter tracks counts for current and previous windows.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Token Bucket",
              right:
                "(tokens: double, lastRefillTime: long) — 2 fields, constant memory per client",
            },
            {
              id: "p2",
              left: "Sliding Window Log",
              right: "(timestamps: Queue<long>) — one timestamp per request in the window",
            },
            {
              id: "p3",
              left: "Fixed Window Counter",
              right: "(count: int, windowStart: long) — 2 fields, resets at window boundaries",
            },
            {
              id: "p4",
              left: "Sliding Window Counter",
              right:
                "(currentCount, prevCount, windowStart) — interpolates between two fixed windows",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match extensibility concerns to solutions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each Rate Limiter extensibility concern to its recommended solution:",
        explanation:
          "Adding a new algorithm is handled by the Factory pattern (implement interface + add factory case). Thread safety uses per-key locking (ConcurrentHashMap + synchronized on bucket). Memory growth uses eviction (LRU cache or TTL-based cleanup). Dynamic config uses atomic swap (rebuild all limiters) or state-preserving update (updateConfig on Limiter interface).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Adding a new algorithm",
              right: "Implement Limiter interface + add one case to LimiterFactory switch",
            },
            {
              id: "p2",
              left: "Thread-safe concurrent access",
              right: "ConcurrentHashMap + synchronized on the per-key bucket/log object",
            },
            {
              id: "p3",
              left: "Unbounded memory growth",
              right: "LRU cache with fixed capacity or TTL-based eviction of inactive client state",
            },
            {
              id: "p4",
              left: "Dynamic configuration updates",
              right:
                "Atomic swap (simple) or updateConfig() on Limiter interface (state-preserving)",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Token Bucket refill formula",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In the Token Bucket algorithm, when a request arrives, the tokens to add are calculated as: tokensToAdd = (___1___ × refillRatePerSecond) / ___2___. The bucket is then capped: bucket.tokens = min(___3___, bucket.tokens + tokensToAdd).",
        explanation:
          "elapsed is the time since lastRefillTime in milliseconds. We divide by 1000 to convert milliseconds to seconds (since refillRate is per second). The bucket is capped at capacity so it can never hold more than the maximum.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "b1", correctAnswer: "elapsed" },
            { id: "b2", correctAnswer: "1000" },
            { id: "b3", correctAnswer: "capacity" },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Sliding Window Log cleanup condition",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In the Sliding Window Log, stale timestamps are removed with: cutoff = now - ___1___. While the queue is not empty and the front element is less than ___2___, we remove it with poll(). After cleanup, a request is allowed if the queue size is less than ___3___.",
        explanation:
          "windowMs defines the sliding window size. cutoff is the earliest timestamp we care about. We compare against cutoff (the calculated boundary). maxRequests is the configured limit for how many requests are allowed within the window.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "b1", correctAnswer: "windowMs" },
            { id: "b2", correctAnswer: "cutoff" },
            { id: "b3", correctAnswer: "maxRequests" },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "RateLimiter allow() delegation logic",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "In RateLimiter.allow(clientId, endpoint), we first look up the limiter: limiter = ___1___.get(endpoint). If limiter is null, we use ___2___. Then we delegate: return limiter.allow(___3___).",
        explanation:
          "limiters is the Map<string, Limiter> holding per-endpoint limiter instances. defaultLimiter is the fallback when an endpoint has no specific config. clientId is passed as the key to the Limiter's allow() method for per-client rate limiting.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            { id: "b1", correctAnswer: "limiters" },
            { id: "b2", correctAnswer: "defaultLimiter" },
            { id: "b3", correctAnswer: "clientId" },
          ],
        },
      },
    },
  ],
};
