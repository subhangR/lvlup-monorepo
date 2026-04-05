/**
 * LLD Concurrency — Scarcity — Interview Prep Content
 * Based on HelloInterview extract
 * Covers: resource scarcity, semaphores, resource pooling with blocking queues,
 * concurrent operation limiting, aggregate consumption throttling, object reuse,
 * maximizing utilization, timeouts, fairness, work stealing, batching
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldConcurrencyScarcityContent: StoryPointSeed = {
  title: "Concurrency — Scarcity",
  description:
    "Master resource scarcity patterns — semaphores for concurrency limiting, blocking queues for object pooling, aggregate consumption throttling, and utilization maximization. Learn to design connection pools, download managers, and bandwidth limiters with proper timeouts, fairness, and failure handling.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: The Scarcity Problem & Semaphores
    {
      title: "The Scarcity Problem & Semaphores",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "The Scarcity Problem & Semaphores",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Resource Scarcity?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Scarcity is about managing limited resources when demand exceeds supply. You have finite database connections, limited memory for buffers, or expensive resources that should only be created once. The constraint is not correctness — it is that there simply are not enough resources for everyone who wants one. You have N threads and M resources where M < N, so some threads must wait.",
            },
            {
              id: "b3",
              type: "heading",
              content: "The Connection Pool Problem",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                "Consider a connection pool with 5 database connections. Each query needs a connection, and connections are expensive — they consume database memory, hold file descriptors, and take time to establish. Five requests run simultaneously, each using one connection. The sixth request must wait. But what if a request grabs a connection and never gives it back? Every new request blocks indefinitely waiting for a connection that never returns. The database is fine, but your service is dead. Monitoring shows zero errors because nothing crashed — requests are just stuck.",
            },
            {
              id: "b5",
              type: "heading",
              content: "Two Core Solutions",
              metadata: { level: 2 },
            },
            {
              id: "b6",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Semaphores — limit how many threads can hold a resource simultaneously (counting permits)",
                  "Resource Pooling with Blocking Queue — hand out actual resource objects, not just permission",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "Semaphores",
              metadata: { level: 2 },
            },
            {
              id: "b8",
              type: "paragraph",
              content:
                "A semaphore is a counter that limits how many threads can do something at once. Create it with a permit count (say 5). Threads call acquire() before starting work — the semaphore decrements the counter. When they finish, they call release() — the counter increments. If the counter hits zero, the next thread trying to acquire blocks until someone releases a permit.",
            },
            {
              id: "b9",
              type: "quote",
              content:
                "The nightclub analogy: The club holds 100 people. The bouncer has 100 tokens. When you enter, you take a token. When you leave, you return it. If all tokens are out, you wait. The bouncer never lets you in until someone leaves.",
            },
            {
              id: "b10",
              type: "code",
              content:
                "import threading\n\nclass APIClient:\n    def __init__(self):\n        self._semaphore = threading.Semaphore(5)\n\n    def make_request(self, endpoint: str):\n        with self._semaphore:  # acquire on entry, release on exit\n            return self._http_client.get(endpoint)",
              metadata: { language: "python" },
            },
            {
              id: "b11",
              type: "paragraph",
              content:
                "Python's context manager pattern (with) automatically acquires on entry and releases on exit — even if an exception is thrown. This eliminates explicit try/finally blocks. The same pattern works for download managers, image processors, and parking lot systems.",
            },
            {
              id: "b12",
              type: "heading",
              content: "Critical Bug: Forgetting to Release",
              metadata: { level: 3 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "The #1 interview bug: writing semaphore code without a finally block (or context manager). If an exception is thrown before release(), the permit is leaked forever. Always use try/finally or context managers. Interviewers will absolutely call this out.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Resource Pooling with Blocking Queue
    {
      title: "Resource Pooling with Blocking Queues",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Resource Pooling with Blocking Queues",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Why Semaphores Are Not Enough",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "Connection pools need to hand out actual connection objects — each with an open socket, authentication credentials, and transaction state. A semaphore only limits how many operations run, not which specific object each thread gets. That is where a blocking queue comes in.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Blocking Queue Pattern",
              metadata: { level: 2 },
            },
            {
              id: "c4",
              type: "code",
              content:
                "import queue\n\nclass ConnectionPool:\n    def __init__(self, pool_size: int):\n        self._pool = queue.Queue(maxsize=pool_size)\n        for _ in range(pool_size):\n            self._pool.put(self._create_connection())\n\n    def acquire(self):\n        return self._pool.get()  # Blocks if empty\n\n    def release(self, conn):\n        self._pool.put(conn)\n\n    def execute_query(self, query: str):\n        conn = self.acquire()\n        try:\n            conn.execute(query)\n        finally:\n            self.release(conn)",
              metadata: { language: "python" },
            },
            {
              id: "c5",
              type: "paragraph",
              content:
                "When all connections are checked out, the queue is empty. The next thread calling acquire() hits get() on an empty queue and blocks efficiently until the OS wakes it when a connection is returned. No spinning, no polling.",
            },
            {
              id: "c6",
              type: "heading",
              content: "Timeouts: Preventing Indefinite Blocking",
              metadata: { level: 2 },
            },
            {
              id: "c7",
              type: "code",
              content:
                'import queue\n\nclass ConnectionPoolWithTimeout:\n    def __init__(self, pool_size: int, timeout_sec: float):\n        self._pool = queue.Queue(maxsize=pool_size)\n        self._timeout = timeout_sec\n        for _ in range(pool_size):\n            self._pool.put(self._create_connection())\n\n    def acquire(self):\n        try:\n            return self._pool.get(timeout=self._timeout)\n        except queue.Empty:\n            raise RuntimeError(f"No connection available within {self._timeout}s")',
              metadata: { language: "python" },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Blocking forever on request paths is dangerous. Use poll/get with a timeout. If the timeout expires, throw an exception and return a 503 to the caller. Timeout tuning: set it to a buffer above expected operation time (e.g., 500ms for 100ms queries). Stay under your load balancer timeout.",
            },
            {
              id: "c9",
              type: "heading",
              content: "Key Design Decisions",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Eager vs Lazy Initialization: Eager creates all connections at startup (simpler, predictable). Lazy creates on demand up to max (faster startup, race condition risk). Prefer eager in interviews.",
                  "Connection Validation: Stale connections may be dead. Test before handing out — if dead, discard and create new.",
                  "Bounded Queue: Always specify maxsize. An unbounded queue grows forever and leads to OOM errors.",
                  "Fairness: When multiple threads wait, which gets the connection first? Approximate FIFO is usually fine. Strict fairness costs throughput.",
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 3: Common Scarcity Patterns & Maximizing Utilization
    {
      title: "Scarcity Patterns & Utilization Maximization",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Scarcity Patterns & Utilization Maximization",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Four Scarcity Patterns",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Limit Concurrent Operations — semaphore with N permits (download managers, API rate limiters)",
                  "Limit Aggregate Consumption — semaphore with permits = resource units (bandwidth, memory budgets)",
                  "Reuse Expensive Objects — blocking queue of actual objects (connection pools, GPU schedulers)",
                  "Maximize Utilization — work stealing, batching, adaptive sizing (keep resources fully busy)",
                ],
              },
            },
            {
              id: "d3",
              type: "heading",
              content: "Pattern 1: Limit Concurrent Operations",
              metadata: { level: 2 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                'When the interviewer says "limit to N concurrent X," use a semaphore. Download manager capping 3 concurrent downloads? Semaphore(3). API client respecting 10 concurrent request limit? Semaphore(10). Image processor preventing CPU saturation at 5 parallel transformations? Semaphore(5). No actual resource objects to hand out — just limiting how many operations run at once.',
            },
            {
              id: "d5",
              type: "heading",
              content: "Pattern 2: Limit Aggregate Consumption",
              metadata: { level: 2 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Sometimes the constraint is not how many operations run, but the total amount of resource they collectively consume. Operations have different sizes — a 50MB upload consumes more bandwidth budget than a 5MB upload. Use a semaphore where each permit represents a unit of the resource (e.g., 1 MB). Before consuming, acquire permits equal to what you will use. After completion, release them back.",
            },
            {
              id: "d7",
              type: "code",
              content:
                "import threading\nfrom pathlib import Path\n\nclass DiskWriter:\n    MB = 1024 * 1024\n\n    def __init__(self):\n        self._lock = threading.Lock()\n        self._condition = threading.Condition(self._lock)\n        self._available = 100  # 100 MB budget\n\n    def write_file(self, data: bytes, path: Path):\n        permits = max(1, (len(data) + self.MB - 1) // self.MB)\n        with self._condition:\n            while self._available < permits:\n                self._condition.wait()\n            self._available -= permits\n        try:\n            path.write_bytes(data)\n        finally:\n            with self._condition:\n                self._available += permits\n                self._condition.notify_all()",
              metadata: { language: "python" },
            },
            {
              id: "d8",
              type: "heading",
              content: "Pattern 3: Reuse Expensive Objects",
              metadata: { level: 2 },
            },
            {
              id: "d9",
              type: "paragraph",
              content:
                "When the scarce resource has state (database connections, GPU contexts, file handles), use a blocking queue. Each object is expensive to create — open sockets, loaded model weights, authenticated sessions. Threads take an object, use it, and return it in a finally block. The queue handles blocking and waking automatically.",
            },
            {
              id: "d10",
              type: "heading",
              content: "Pattern 4: Maximizing Utilization",
              metadata: { level: 2 },
            },
            {
              id: "d11",
              type: "paragraph",
              content:
                "Beyond governance, some interviews (infrastructure, trading, AI) care about keeping resources maximally busy. Three techniques: (1) Work Stealing — each worker has its own queue, steals from others when empty. Handles uneven task distribution. Java ForkJoinPool uses this. (2) Batching — acquire one connection, write 100 rows, release. Amortizes coordination overhead. Trades latency for throughput. (3) Adaptive Sizing — grow pool when utilization is high, shrink when idle. HikariCP and pgbouncer support this.",
            },
            {
              id: "d12",
              type: "heading",
              content: "Scarcity Decision Tree",
              metadata: { level: 2 },
            },
            {
              id: "d13",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Do you need actual resource objects? → YES: Use a Blocking Queue (connection pool pattern)",
                  "Do you need actual resource objects? → NO: Is consumption variable per operation? → YES: Semaphore with permits = resource units",
                  "Do you need actual resource objects? → NO: Is consumption variable per operation? → NO: Semaphore with N permits (simple concurrency limit)",
                  "After choosing a mechanism: Add timeouts (never block forever), use try/finally (never leak permits), consider fairness under high contention",
                ],
              },
            },
            {
              id: "d14",
              type: "heading",
              content: "Common Bugs to Watch For",
              metadata: { level: 2 },
            },
            {
              id: "d15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Forgetting to release in a finally block — leaks permits forever",
                  "Creating unbounded queues — leads to OOM errors",
                  "Blocking indefinitely on request paths — causes user-visible timeouts",
                  "Check-then-act without locks — lets threads exceed limits",
                  "Acquiring multi-unit permits one at a time in a loop — risks deadlock when two threads each hold partial permits",
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
      title: "Semaphore vs mutex: core difference",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the fundamental difference between a semaphore and a mutex in the context of resource scarcity?",
        explanation:
          "A mutex allows exactly one thread to access a resource (binary lock), while a semaphore allows up to N threads to hold permits simultaneously. This makes semaphores ideal for scarcity problems where multiple threads can use a shared resource pool concurrently, up to a capacity limit. A mutex is just a special case of a semaphore with N=1.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A semaphore allows up to N threads to hold permits simultaneously; a mutex allows exactly one",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A mutex is faster because it uses hardware instructions; semaphores use software-only primitives",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A semaphore can only be released by the thread that acquired it; a mutex can be released by any thread",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Mutexes work across processes; semaphores work only within a single process",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why use a blocking queue over a semaphore for connection pools",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is a blocking queue preferred over a plain semaphore for implementing a database connection pool?",
        explanation:
          "A semaphore only controls how many operations can proceed — it hands out permission, not objects. A connection pool must hand out actual connection objects (with open sockets, auth credentials, transaction state). A blocking queue stores and dispenses these objects directly. Threads call get() to receive a specific connection and put() to return it.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A blocking queue stores and dispenses actual connection objects; a semaphore only grants permission to proceed",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A blocking queue is faster than a semaphore for high contention scenarios",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Semaphores cannot block threads when no permits are available",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Blocking queues automatically validate connections; semaphores cannot",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Correct pattern for semaphore-guarded operations",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Which code pattern correctly prevents permit leaks when using a semaphore to limit concurrent API requests?",
        explanation:
          "The try/finally pattern (or context manager) ensures the permit is released even if the operation throws an exception. Without it, an exception before release() leaks the permit permanently, gradually reducing available capacity to zero. Acquiring inside the try block is wrong because the finally would release a permit that was never acquired if acquire() itself fails.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Acquire the semaphore, then wrap the operation in try/finally with release in finally",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Wrap both acquire and the operation in a single try block with release in finally",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Call release() at the end of the operation without any try/finally",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Use a daemon thread to periodically check for and reclaim leaked permits",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Timeout strategy for connection pool acquisition",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Your connection pool serves HTTP requests with a 5-second load balancer timeout. Database queries typically complete in 100ms. What is the best timeout value for connection acquisition, and why?",
        explanation:
          "The acquisition timeout must be well under the load balancer timeout (5s) so you can return a proper 503 error rather than letting the load balancer time out first. A 500ms timeout gives a 5x buffer over typical 100ms queries while staying comfortably under the 5s boundary. Too short (50ms) fails requests that could have succeeded with a brief wait. Too long (4.5s) risks the load balancer disconnecting before you respond. No timeout blocks forever if something goes wrong.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "~500ms — buffers above the 100ms query time while staying well under the 5s load balancer timeout",
              isCorrect: true,
            },
            {
              id: "b",
              text: "4.5 seconds — use as much of the load balancer budget as possible to maximize success rate",
              isCorrect: false,
            },
            {
              id: "c",
              text: "50ms — fail fast so the client can retry elsewhere",
              isCorrect: false,
            },
            {
              id: "d",
              text: "No timeout — a well-designed pool should always return connections eventually",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Eager vs lazy pool initialization tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In a connection pool design, what is the primary tradeoff between eager initialization (all connections created at startup) and lazy initialization (connections created on demand)?",
        explanation:
          "Eager initialization creates all connections during construction — slow startup but predictable performance after. Lazy initialization creates connections as needed up to the limit — fast startup but the first requests are slower and you risk race conditions when multiple threads try to create connections simultaneously. For interviews, prefer eager initialization because it is simpler and avoids concurrency bugs.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Eager has slow startup but predictable runtime; lazy has fast startup but risks race conditions during concurrent creation",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Eager uses more memory overall; lazy creates and destroys connections per request saving memory",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Lazy is always superior because it avoids creating connections that may never be used",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Eager requires a separate thread for initialization; lazy initializes on the main thread only",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Identifying the correct scarcity pattern",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "You are designing a service that uploads files to S3. Each upload consumes bandwidth proportional to the file size, and you want to limit total in-flight data to 200MB. Which scarcity pattern applies?",
        explanation:
          'This is "Limit Aggregate Consumption" because operations consume different amounts of the shared resource (bandwidth). A 50MB upload consumes more than a 5MB upload. Use a semaphore where each permit represents 1MB. Before uploading a 15MB file, acquire 15 permits. If only 10 are available, the thread blocks until in-flight uploads complete. This is distinct from "limit concurrent operations" (which counts operations, not their sizes) and "reuse expensive objects" (which manages stateful objects).',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Limit Aggregate Consumption — use permits proportional to file size to cap total in-flight bytes",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Limit Concurrent Operations — use a semaphore to cap the number of uploads regardless of size",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Reuse Expensive Objects — pool S3 client connections in a blocking queue",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Maximize Utilization — use work stealing to keep upload threads busy",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Multi-unit permit acquisition deadlock",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A developer implements aggregate bandwidth limiting by acquiring permits one at a time in a loop: for each MB needed, call semaphore.acquire(). Two threads each need 80 permits from a semaphore with 100 total. What problem can occur?",
        explanation:
          "If Thread A acquires 60 permits and Thread B acquires 40 permits, both have partially fulfilled their requests but neither can get the remaining permits they need. Thread A needs 20 more (only 0 available) and Thread B needs 40 more (only 0 available). Both block forever — classic deadlock from partial acquisition. The fix is to acquire all needed permits atomically (check-and-deduct under a lock using a condition variable) rather than one at a time.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Deadlock — both threads hold partial permits and block waiting for permits the other holds",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Starvation — one thread always gets all permits first, the other waits indefinitely",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Data corruption — the semaphore counter goes negative due to race conditions",
              isCorrect: false,
            },
            {
              id: "d",
              text: "No problem — semaphores handle multi-unit acquisition automatically",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Work stealing vs single-queue architecture",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "You have a GPU inference service with 4 GPUs. Tasks vary from 1ms (embedding lookups) to 500ms (full model passes). A single shared queue feeds all 4 GPU workers. Under what conditions does switching to per-worker queues with work stealing improve throughput?",
        explanation:
          "Work stealing helps when task durations are highly variable and load balancing with a single queue causes head-of-line blocking. With a single queue, a GPU stuck on a 500ms task means its queue position is blocked. With per-worker queues, idle workers steal from the queues of busy workers, keeping all GPUs utilized. If tasks are uniform in duration, work stealing adds complexity with no benefit — simple round-robin from a single queue is sufficient.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "When task durations vary widely, causing idle workers while others are stuck on long tasks",
              isCorrect: true,
            },
            {
              id: "b",
              text: "When the number of GPUs exceeds 8, making a single queue a bottleneck",
              isCorrect: false,
            },
            {
              id: "c",
              text: "When all tasks are the same duration but arrive in bursts",
              isCorrect: false,
            },
            {
              id: "d",
              text: "When memory is constrained and each GPU queue reduces buffer requirements",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Valid use cases for semaphores",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL scenarios where a counting semaphore is the appropriate concurrency primitive:",
        explanation:
          "Semaphores are appropriate when you need to limit how many operations run concurrently without managing specific resource objects. A download manager (cap 3 downloads), an API rate limiter (cap 10 in-flight requests), and an image processor (cap 5 concurrent transforms) all fit this pattern. A connection pool requires handing out specific connection objects, which needs a blocking queue.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A download manager that limits to 3 concurrent downloads",
              isCorrect: true,
            },
            {
              id: "b",
              text: "An API client respecting a 10-concurrent-request limit from an external service",
              isCorrect: true,
            },
            {
              id: "c",
              text: "A database connection pool that hands out specific connection objects",
              isCorrect: false,
            },
            {
              id: "d",
              text: "An image processor capping parallel transformations to 5 to avoid CPU saturation",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Consequences of unbounded blocking queue",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "You create a connection pool using a LinkedBlockingQueue without specifying a maximum capacity. Select ALL problems this can cause:",
        explanation:
          "An unbounded queue can grow without limit. If connections are created lazily on demand, the pool can create more connections than the database can handle, overwhelming it. The growing queue consumes memory, potentially causing OOM. The pool also loses its purpose — it no longer enforces a capacity limit, which was the entire point. Deadlocks from circular dependencies are unrelated to queue capacity.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Memory grows unbounded as new connections are created and added without limit, risking OOM",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The pool can exceed the intended connection limit, overwhelming the database server",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The pool loses its scarcity-enforcement purpose — it no longer caps concurrent access",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Threads will deadlock due to circular queue dependencies",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Benefits of timeout-based pool acquisition",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL benefits of using poll(timeout) instead of take() when acquiring from a connection pool:",
        explanation:
          "Timeouts prevent threads from blocking forever when all connections are occupied by slow queries. They allow returning proper error responses (503) to clients instead of letting load balancers disconnect. They free threads to handle other work or fail gracefully. However, timeouts do not reduce the total number of connections in the pool — that is determined by pool size.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Prevents threads from blocking indefinitely when connections are stuck on slow queries",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Allows returning a proper 503 error to the client before the load balancer times out",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Frees threads to do other work or fail gracefully instead of hanging",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Reduces the total number of connections in the pool to save database resources",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Techniques for maximizing resource utilization",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "A GPU inference cluster has 4 GPUs processing requests of widely varying durations (1ms to 500ms). Which techniques will improve utilization beyond a basic round-robin queue? Select ALL that apply:",
        explanation:
          "Work stealing lets idle GPUs grab tasks from busy GPUs queues — directly addresses variable task duration. Batching groups small inference requests to amortize GPU kernel launch overhead, improving throughput. Adaptive pool sizing (auto-scaling GPU instances) matches capacity to demand. Strict FIFO fairness actually hurts utilization because it prevents task reordering that could fill idle GPU time.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Per-GPU queues with work stealing so idle GPUs grab tasks from overloaded GPUs",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Request batching to group small inference calls and amortize GPU kernel launch overhead",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Adaptive sizing to scale GPU instances up/down based on queue depth and latency",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Strict FIFO fairness to ensure every request is processed in exact arrival order",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Design a connection pool with timeout handling",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Design a connection pool for a web service handling 1000 RPS with 20 database connections. Describe the data structure, acquisition/release flow, timeout strategy, and how you handle the case where a connection is returned in a broken state.",
        sampleAnswer:
          "Use a BlockingQueue of size 20, eagerly initialized with 20 connections at startup. On acquire: call queue.get(timeout=500ms). If timeout expires, raise a RuntimeError and return 503 to the caller. On release: wrap the operation in try/finally — the finally block always returns the connection to the queue. For broken connections: before returning to the pool, validate the connection (e.g., run a lightweight ping query). If validation fails, discard the broken connection, create a fresh one, and add it to the pool instead. This ensures the pool never shrinks below 20. Timeout of 500ms is chosen because queries average ~50ms, so 500ms provides 10x buffer while staying well under typical HTTP timeouts (30s). At 1000 RPS with 20 connections, each connection handles 50 requests/second, or ~20ms per request cycle — well within the 50ms average.",
        rubric:
          "Must mention: (1) BlockingQueue as the data structure, (2) eager initialization, (3) timeout-based acquisition with specific rationale, (4) try/finally for release, (5) broken connection detection and replacement. Bonus: capacity math showing 20 connections handle 1000 RPS.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the scarcity decision tree",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Given a new scarcity problem in an interview, describe the step-by-step decision process for choosing between a semaphore and a blocking queue. Provide one real-world example for each branch of your decision tree.",
        sampleAnswer:
          "Step 1: Do you need to hand out actual resource objects (connections, GPU contexts, file handles)? If YES → use a Blocking Queue. Example: database connection pool where each thread needs a specific Connection object with an open socket and auth state. Step 2 (if NO): Does each operation consume a variable amount of the shared resource? If YES → use a Semaphore where permits represent resource units. Example: bandwidth limiter where a 50MB upload acquires 50 permits and a 5MB upload acquires 5 permits from a 200-permit semaphore. Step 3 (if NO to both): Use a Semaphore with N permits for simple concurrency capping. Example: download manager limiting to 3 concurrent downloads — Semaphore(3), acquire before download, release after. In all cases: always release in a finally block, add timeouts for user-facing paths, and specify bounded queue capacity.",
        rubric:
          "Must correctly distinguish: (1) blocking queue for stateful objects, (2) multi-permit semaphore for variable consumption, (3) simple semaphore for concurrency cap. Must provide a concrete example for each. Must mention finally/timeout as cross-cutting concerns.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design an aggregate bandwidth limiter",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a file upload service that limits total in-flight data to 200MB across all concurrent uploads. Files range from 1MB to 100MB. Describe the concurrency primitive, acquisition logic, the potential deadlock when acquiring permits one-at-a-time, and how you solve it.",
        sampleAnswer:
          "Use a condition variable protecting a shared counter initialized to 200 (representing 200MB). Each upload calculates permits needed = ceil(fileSize / 1MB), minimum 1. Acquisition must be atomic: under the lock, check if available >= permits. If not, wait on the condition variable. When notified, recheck (spurious wakeup protection). If sufficient, deduct all permits atomically. The one-at-a-time deadlock: if two 150MB uploads each acquire permits in a loop (one at a time), Thread A might hold 120 and Thread B holds 80, totaling 200. Neither can acquire more — deadlock. The fix is atomic check-and-deduct: acquire all N permits at once under a lock, never partially. Release: in a finally block, re-acquire the lock, add permits back, and notify_all() so all waiting threads recheck their conditions. This avoids deadlock because a thread either gets all permits or none.",
        rubric:
          "Must cover: (1) condition variable with shared counter, (2) atomic check-and-deduct under lock, (3) explicit description of the one-at-a-time deadlock scenario, (4) notify_all on release for waiting threads, (5) try/finally for permit release. Bonus: mention spurious wakeup protection with while loop.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 4 — hard
    {
      title: "GPU task scheduler with work stealing",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a GPU inference scheduler for 4 GPUs where tasks range from 1ms (embeddings) to 500ms (full model passes). Explain how work stealing improves utilization over a single shared queue, and describe the synchronization needed for stealing.",
        sampleAnswer:
          "Architecture: 4 GPUs, each with its own deque (double-ended queue). New tasks are assigned round-robin to per-GPU deques. Each GPU pops tasks from the front of its own deque. When a GPU's deque is empty, it becomes a \"thief\" and steals from the back of another GPU's deque. Why this works: with a single shared queue and variable task durations, a GPU stuck on a 500ms task blocks its position while other GPUs finish quickly and idle. With work stealing, idle GPUs steal pending tasks from the busy GPU's deque, keeping all 4 GPUs utilized. Synchronization: each deque needs a lock (or lock-free CAS) on the steal end. The owning GPU pops from the front without contention. Thieves lock the back end — contention is low because stealing only happens when a GPU is idle. Use a spin-then-park strategy: thieves first spin briefly (few microseconds), then park on a condition variable. When a new task is enqueued, notify one parked thief. This avoids both busy-waiting and latency from sleeping.",
        rubric:
          "Must explain: (1) per-GPU deques with owner-pops-front/thief-steals-back, (2) why variable task duration causes idle workers with single queue, (3) synchronization on the steal end (lock or CAS), (4) wakeup mechanism for idle workers. Bonus: mention locality benefits (owner processes recently enqueued tasks) and reduced contention vs single queue.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 5 — hard
    {
      title: "Compare semaphore fairness strategies under contention",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Your connection pool serves a mix of analytics queries (holding connections for 2-5 seconds) and OLTP queries (holding connections for 5-50ms). Under high contention, OLTP queries are starving. Explain the fairness problem, two strategies to address it, and the tradeoffs of each.",
        sampleAnswer:
          'The problem: analytics queries hold connections 100x longer than OLTP queries. When a connection is released, all waiting threads compete for it. Under non-fair ordering, whichever thread the OS schedules first wins — this can arbitrarily delay OLTP queries that would complete quickly and free the connection for others. Strategy 1: Priority queues — maintain separate queues for OLTP (high priority) and analytics (low priority). When a connection is returned, serve OLTP queue first. Tradeoff: analytics queries can starve if OLTP traffic is constant. Need a "maximum wait time" promotion to prevent indefinite starvation. Strategy 2: Separate pools — allocate 15 connections to OLTP and 5 to analytics. Each pool is independently managed. Tradeoff: static partitioning underutilizes connections — if analytics is idle, OLTP cannot use those 5 connections. Can mitigate with "overflow borrowing" where OLTP temporarily takes from analytics pool when its pool is empty and analytics has spares. Both strategies add complexity. For many services, the simplest fix is to move analytics queries to read replicas, eliminating the contention entirely.',
        rubric:
          "Must identify: (1) the root cause — long-held connections block short queries, (2) two distinct strategies with concrete mechanics, (3) tradeoffs for each (starvation risk, underutilization), (4) practical consideration like read replicas or workload separation.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 6 — hard
    {
      title: "Diagnose a connection pool leak in production",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Your service has a 10-connection pool. Over 24 hours, response times gradually increase from 50ms to 30s, then requests start timing out entirely. Monitoring shows the database is healthy with low CPU/memory. Diagnose the likely issue, explain the root cause, and describe how to fix it and prevent recurrence.",
        sampleAnswer:
          'Diagnosis: This is a connection leak. Some code path acquires a connection but does not return it — likely a missing finally block on an error path. Over 24 hours, connections leak one by one until all 10 are permanently checked out. New requests wait for connections that never return, causing timeouts. The database is fine because the leaked connections are idle — they are held by application threads that finished but forgot to release. Root cause: a code path like `conn = pool.acquire(); conn.execute(query); pool.release(conn)` without try/finally. If execute() throws an exception, release() is never called. Fix: (1) Immediate — restart the service to reset the pool. (2) Code fix — wrap ALL connection usage in try/finally or context managers. (3) Prevention — add a "connection lease timeout" that forcibly reclaims connections held longer than 30 seconds (configurable). Log a warning with the stack trace of the original acquire() call to identify the leaking code path. (4) Monitoring — track pool utilization metrics (checked-out count over time). Alert when utilization exceeds 80% for more than 5 minutes.',
        rubric:
          "Must identify: (1) connection leak as the root cause, (2) missing try/finally as the mechanism, (3) why database appears healthy (leaked connections are idle), (4) immediate fix (restart), (5) code fix (try/finally), (6) prevention (lease timeout, monitoring). Bonus: stack trace capture for leak identification.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Name the scarcity pattern for a parking lot",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'A parking lot system has 500 spaces. Cars enter and exit. When full, new cars must wait. What concurrency primitive and scarcity pattern should you use? Answer in the format: "Pattern: [name], Primitive: [name]".',
        correctAnswer: "Pattern: Limit Concurrent Operations, Primitive: Semaphore",
        explanation:
          'A parking lot tracks occupied spots — a count, not specific objects. You do not hand out specific "parking space objects" to cars (any open spot works). A semaphore with 500 permits directly models this: acquire a permit when entering, release when leaving. If all permits are taken, the next car blocks. This is the "Limit Concurrent Operations" pattern because you are capping how many cars (operations) occupy the lot simultaneously.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Text 2 — medium
    {
      title: "Identify the bug in this pool code",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What is the critical bug in this code?\n\ndef execute_query(pool, query):\n    conn = pool.acquire()\n    result = conn.execute(query)\n    pool.release(conn)\n    return result",
        correctAnswer:
          "Missing try/finally — if conn.execute(query) throws an exception, pool.release(conn) is never called, permanently leaking the connection.",
        explanation:
          "Without a try/finally block, any exception during execute() causes the method to exit without releasing the connection. Over time, this leaks all connections in the pool, causing every subsequent request to block indefinitely. The fix is: conn = pool.acquire(); try: result = conn.execute(query); finally: pool.release(conn).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Text 3 — hard
    {
      title: "Why does this bandwidth limiter deadlock?",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "A bandwidth limiter has 100 permits (1 per MB). Thread A needs 80MB and Thread B needs 80MB. Each acquires permits one at a time in a loop. Explain in one sentence why this deadlocks.",
        correctAnswer:
          "Both threads acquire partial permits (e.g., A gets 60, B gets 40, totaling 100), then both block waiting for permits the other holds, creating a circular dependency.",
        explanation:
          'When permits are acquired one at a time, two threads can each grab a partial set, exhausting all available permits between them. Neither thread can complete its acquisition because the remaining permits are held by the other. This is the classic "partial resource acquisition" deadlock. The solution is atomic all-or-nothing acquisition: check if enough permits are available under a lock, and only deduct if the full amount is available.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Text 4 — hard
    {
      title: "Adaptive pool sizing risk",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "An adaptive connection pool grows from 10 to 50 connections during a traffic spike. What is the primary risk of growing too aggressively, and what guardrail prevents it?",
        correctAnswer:
          "Risk: overwhelming the database server with too many concurrent connections. Guardrail: a hard maximum cap (e.g., max_pool_size) that the pool cannot exceed regardless of demand.",
        explanation:
          "Databases have finite capacity for concurrent connections. Each connection consumes memory, file descriptors, and processing resources on the database server. An uncapped adaptive pool can create so many connections during a spike that it overwhelms the database — turning a traffic spike into a database outage. The guardrail is a hard max_pool_size that the pool never exceeds, combined with connection-per-instance limits in multi-instance deployments.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match scarcity patterns to real-world systems",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each scarcity pattern to the real-world system it best describes:",
        explanation:
          "Download Manager caps concurrent operations (semaphore with N permits). Database Connection Pool reuses expensive stateful objects (blocking queue). Bandwidth Limiter throttles aggregate consumption where each operation uses a variable amount (multi-permit semaphore). ForkJoinPool maximizes utilization through work stealing across worker threads.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Download Manager (3 concurrent downloads)",
              right: "Limit Concurrent Operations",
            },
            {
              id: "p2",
              left: "Database Connection Pool",
              right: "Reuse Expensive Objects",
            },
            {
              id: "p3",
              left: "Network Bandwidth Limiter (200MB cap)",
              right: "Limit Aggregate Consumption",
            },
            {
              id: "p4",
              left: "Java ForkJoinPool",
              right: "Maximize Utilization",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match concurrency primitives to their capabilities",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each concurrency primitive to the capability that distinguishes it for scarcity problems:",
        explanation:
          'A counting semaphore controls how many threads proceed (permits = capacity). A blocking queue stores and dispenses actual objects. A condition variable enables atomic check-and-wait on complex conditions (e.g., "are 80 permits available?"). A mutex provides mutual exclusion for exactly one thread — the degenerate case of a semaphore with 1 permit.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Counting Semaphore",
              right: "Controls how many threads can proceed simultaneously",
            },
            {
              id: "p2",
              left: "Blocking Queue",
              right: "Stores and dispenses actual resource objects to threads",
            },
            {
              id: "p3",
              left: "Condition Variable",
              right: "Enables atomic check-and-wait on complex resource conditions",
            },
            {
              id: "p4",
              left: "Mutex",
              right: "Provides exclusive access for exactly one thread at a time",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match pool failure symptoms to root causes",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each production failure symptom to the most likely connection pool root cause:",
        explanation:
          'Gradual latency increase → connection leak (missing finally block slowly drains the pool). Immediate OOM on startup → unbounded queue creating connections without limit. Intermittent "stale connection" errors → no validation of returned connections (database closed them during inactivity). All threads blocked, zero errors → indefinite blocking without timeouts (take() instead of poll(timeout)).',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Response times degrade slowly over 24 hours until timeout",
              right: "Connection leak — missing try/finally on error paths",
            },
            {
              id: "p2",
              left: "OOM crash shortly after deployment under moderate load",
              right: "Unbounded queue — no maxsize specified on the pool",
            },
            {
              id: "p3",
              left: 'Intermittent "connection reset" errors on idle connections',
              right: "No connection validation — stale connections handed out",
            },
            {
              id: "p4",
              left: "All request threads blocked, zero errors in logs, service unresponsive",
              right: "No acquisition timeout — using take() instead of poll(timeout)",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Semaphore API basics",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "A semaphore is initialized with a ___1___ count. Threads call ___2___ before starting work (decrementing the counter) and ___3___ when finished (incrementing it back). If the counter reaches zero, the next thread blocks until a permit is ___4___.",
        explanation:
          "A semaphore manages a counter of permits. acquire() decrements the counter (taking a permit), release() increments it (returning a permit). When the counter is zero, no permits are available and the next acquire() call blocks the thread until another thread calls release().",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "b1", correctAnswer: "permit" },
            { id: "b2", correctAnswer: "acquire" },
            { id: "b3", correctAnswer: "release" },
            { id: "b4", correctAnswer: "released" },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Connection pool data structure",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "A connection pool uses a ___1___ to store available connection objects. Threads call ___2___ to obtain a connection (blocking if none available) and ___3___ to return it. The queue must have a ___4___ to prevent unbounded growth.",
        explanation:
          "A BlockingQueue (or Queue with maxsize) stores connection objects. get() retrieves a connection (blocking if empty), put() returns one. Setting maxsize in the constructor prevents the queue from growing beyond the pool size, which would defeat the purpose of pooling.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "b1", correctAnswer: "blocking queue" },
            { id: "b2", correctAnswer: "get" },
            { id: "b3", correctAnswer: "put" },
            { id: "b4", correctAnswer: "maxsize" },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Aggregate consumption permits",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "To limit aggregate disk I/O to 100MB, create a semaphore-like mechanism with 100 permits where each permit represents ___1___. Before writing a 15MB file, acquire ___2___ permits. To avoid ___3___ when acquiring multi-unit permits, all permits must be acquired ___4___ (not one at a time in a loop).",
        explanation:
          "Each permit represents 1MB of I/O capacity. A 15MB file needs 15 permits. Acquiring permits one at a time risks deadlock when multiple threads each hold partial permits. All permits must be acquired atomically (check-and-deduct under a lock) to prevent deadlock.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            { id: "b1", correctAnswer: "1 MB" },
            { id: "b2", correctAnswer: "15" },
            { id: "b3", correctAnswer: "deadlock" },
            { id: "b4", correctAnswer: "atomically" },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Connection pool utilization calculation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "A service handles 500 requests per second. Each request acquires a database connection for 20ms on average. What is the minimum number of connections needed in the pool to avoid any request waiting? (Assume requests arrive uniformly.)",
        correctAnswer: 10,
        tolerance: 0,
        explanation:
          "At 500 RPS with 20ms hold time per connection: each connection handles 1000ms / 20ms = 50 requests/second. To serve 500 RPS: 500 / 50 = 10 connections needed. With fewer than 10, some requests would have to wait for a connection to be released. In practice, you would add a buffer (e.g., 15-20 connections) to handle variance in query times.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Numerical 2 — hard
    {
      title: "Bandwidth limiter permit calculation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A bandwidth limiter uses permits where 1 permit = 1MB. The total budget is 200 permits. At peak, there are 5 concurrent uploads: three 20MB files and two 50MB files. How many permits remain available for new uploads?",
        correctAnswer: 40,
        tolerance: 0,
        explanation:
          "Three 20MB files: 3 x 20 = 60 permits. Two 50MB files: 2 x 50 = 100 permits. Total consumed: 60 + 100 = 160 permits. Remaining: 200 - 160 = 40 permits available. A new 50MB upload would block (needs 50, only 40 available), but a new 30MB upload could proceed immediately.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },
  ],
};
