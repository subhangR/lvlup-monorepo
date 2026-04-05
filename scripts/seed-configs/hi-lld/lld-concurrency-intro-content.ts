/**
 * LLD Concurrency Introduction — Interview Prep Content
 * Based on HelloInterview extract
 * Covers: concurrency fundamentals, threads vs processes, shared memory,
 * concurrency primitives (atomics, locks, semaphores, condition variables, blocking queues),
 * and the three problem types (correctness, coordination, scarcity)
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldConcurrencyIntroContent: StoryPointSeed = {
  title: "Concurrency — Introduction",
  description:
    "Learn the fundamentals of concurrency in low-level design interviews — threads, shared memory, concurrency primitives (locks, atomics, semaphores, condition variables, blocking queues), and the three problem types: correctness, coordination, and scarcity.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Concurrency Fundamentals — Threads, Processes, Shared Memory
    {
      title: "Concurrency Fundamentals — Threads, Processes & Shared Memory",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Concurrency Fundamentals — Threads, Processes & Shared Memory",
          blocks: [
            {
              id: "a1",
              type: "heading",
              content: "What is Concurrency?",
              metadata: { level: 2 },
            },
            {
              id: "a2",
              type: "paragraph",
              content:
                "Concurrency is what happens when multiple things try to happen at the same time. Two users book the same flight seat. Three threads update the same counter. A dozen requests hit your cache while it is mid-refresh. The code that worked perfectly in testing suddenly produces impossible results in production.",
            },
            {
              id: "a3",
              type: "paragraph",
              content:
                "Low-level design interviews focus on single-process systems, so the concurrency here is all threads and shared memory within one program. System design interviews deal with concurrency across multiple servers — that is a different beast. In LLD interviews, concurrency shows up in two ways: a classic question gets harder (e.g., a parking lot with two cars racing for the same spot) or the prompt is built around concurrency from the start (thread pools, rate limiters, connection pools, schedulers).",
            },
            {
              id: "a4",
              type: "heading",
              content: "Processes and Threads",
              metadata: { level: 2 },
            },
            {
              id: "a5",
              type: "paragraph",
              content:
                "When a program runs, the operating system creates a process — an isolated container with its own address space and resources. Inside that process, the OS or language runtime can create one or more threads. A thread is an independent execution path with its own program counter, registers, and stack, but it shares the heap, globals, and open resources with other threads in the same process.",
            },
            {
              id: "a6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Process: Isolated container with its own address space, file descriptors, and heap memory.",
                  "Thread: Lightweight execution path within a process. Has its own stack and program counter but shares the process's heap and globals.",
                  "Shared memory: The heap, global variables, and open resources that all threads in a process can read and write.",
                ],
              },
            },
            {
              id: "a7",
              type: "heading",
              content: "Concurrency vs Parallelism",
              metadata: { level: 2 },
            },
            {
              id: "a8",
              type: "paragraph",
              content:
                "Concurrency exists whenever multiple threads can make progress independently and their execution can overlap. On multi-core machines, threads may run in parallel — true simultaneous execution. On a single core, the OS rapidly switches between threads and interleaves their instructions. From the program's point of view, both cases are the same: operations from different threads can interleave in unpredictable ways.",
            },
            {
              id: "a9",
              type: "quote",
              content:
                "Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once. Concurrency is a design concern; parallelism is an execution concern. — Rob Pike",
            },
            {
              id: "a10",
              type: "heading",
              content: "Why Concurrency Bugs are Hard",
              metadata: { level: 2 },
            },
            {
              id: "a11",
              type: "paragraph",
              content:
                "Code that looks atomic at the source level is often multiple machine instructions. The statement counter += 1 actually involves three steps: read the current value, add one, write the result back. If two threads execute this simultaneously, they can both read the same value, both add one, and both write back — losing one increment entirely. This is called a race condition.",
            },
            {
              id: "a12",
              type: "paragraph",
              content:
                "That unpredictability is the root of concurrency bugs. The outcome can depend on timing, scheduling, or load. This is why concurrency bugs are often nondeterministic — they work 99% of the time in testing but fail in production under load. Most production languages (Java, C++, Go, Rust, C#, Python) run code concurrently by default. Concurrency should be assumed any time shared state exists.",
            },
            {
              id: "a13",
              type: "heading",
              content: "Language-Specific Threading Models",
              metadata: { level: 3 },
            },
            {
              id: "a14",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Java/C++/Go/Rust/C#: True multi-threading with shared-memory concurrency. Threads run on OS-level threads or lightweight green threads (Go goroutines).",
                  "Python: Has threads but the Global Interpreter Lock (GIL) prevents true CPU parallelism. I/O-bound code still benefits from threads. Use multiprocessing for CPU-bound parallelism.",
                  "JavaScript/TypeScript: Single-threaded event loop. Concurrency is expressed through async/await and callbacks, not shared-memory threads. Web Workers provide limited multi-threading.",
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: The Concurrency Toolbox — Primitives
    {
      title: "The Concurrency Toolbox — Primitives & Language Reference",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "The Concurrency Toolbox — Primitives & Language Reference",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Concurrency Primitives Overview",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Concurrency problems are solved with a small set of primitives that every language provides in some form. You do not need to invent new synchronization mechanisms — you only need to recognize which existing tool fits the problem and how to apply it. The five core primitives handle the vast majority of interview scenarios.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Atomics",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                "Atomics provide thread-safe operations on single variables without locks. Under the hood, they use CPU instructions like compare-and-swap (CAS) that complete in one uninterruptible step. Use atomics for counters, flags, and simple statistics. They are fast but limited to single variables — the moment you need to update two things together, atomics no longer help.",
            },
            {
              id: "b5",
              type: "code",
              content:
                "# Python lacks native atomics — use a lock to protect the counter\nimport threading\n\nlock = threading.Lock()\ncounter = 0\n\nwith lock:\n    counter += 1  # Protected increment",
              metadata: { language: "python" },
            },
            {
              id: "b6",
              type: "heading",
              content: "Locks (Mutexes)",
              metadata: { level: 2 },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "Locks provide mutual exclusion. When a thread holds a lock, other threads trying to acquire it block until the first thread releases. This creates a critical section where only one thread executes at a time. Locks are your default tool for protecting shared state. Key variants: coarse-grained (one lock for everything — simple but limits concurrency), fine-grained (per-resource locks — more concurrency but deadlock risk), and read-write (multiple readers OR one writer — optimal for read-heavy workloads).",
            },
            {
              id: "b8",
              type: "code",
              content:
                "import threading\n\nlock = threading.Lock()\n\nwith lock:\n    # Only one thread can be here at a time\n    balance += amount",
              metadata: { language: "python" },
            },
            {
              id: "b9",
              type: "heading",
              content: "Semaphores",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "paragraph",
              content:
                "Semaphores are counting locks. Instead of binary locked/unlocked, a semaphore has N permits. Threads acquire permits before proceeding and release them when done. When permits hit zero, threads block until someone releases. Use semaphores to limit concurrent operations — like when you can have at most 5 downloads or at most 10 API calls at a given time.",
            },
            {
              id: "b11",
              type: "code",
              content:
                "import threading\n\npermits = threading.Semaphore(5)  # Allow 5 concurrent operations\npermits.acquire()  # Block if no permits available\ntry:\n    do_work()\nfinally:\n    permits.release()  # Always release, even on exception",
              metadata: { language: "python" },
            },
            {
              id: "b12",
              type: "heading",
              content: "Condition Variables",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "Condition variables let threads wait efficiently for a condition to become true. A thread acquires a lock, checks a condition, and if not satisfied, waits — this atomically releases the lock and puts the thread to sleep. When another thread signals, waiters wake up and re-check. They are the building block for blocking queues, but you rarely use them directly in interviews.",
            },
            {
              id: "b14",
              type: "code",
              content:
                "import threading\n\ncondition = threading.Condition()\n\nwith condition:\n    while not ready:\n        condition.wait()  # Release lock and sleep\n    # Condition is now true, proceed",
              metadata: { language: "python" },
            },
            {
              id: "b15",
              type: "heading",
              content: "Blocking Queues",
              metadata: { level: 2 },
            },
            {
              id: "b16",
              type: "paragraph",
              content:
                "Blocking queues combine a queue with condition variables to provide thread-safe producer-consumer handoff. Producers call put() to add items; if full, they block. Consumers call take() to remove items; if empty, they block. The queue handles all synchronization internally, making it your go-to tool for handing work between threads.",
            },
            {
              id: "b17",
              type: "code",
              content:
                "import queue\n\nq = queue.Queue(maxsize=100)\nq.put(task)   # Blocks if queue is full\nt = q.get()   # Blocks if queue is empty",
              metadata: { language: "python" },
            },
            {
              id: "b18",
              type: "heading",
              content: "Language Reference Table",
              metadata: { level: 2 },
            },
            {
              id: "b19",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Lock/Mutex: Java → synchronized/ReentrantLock | Python → threading.Lock | Go → sync.Mutex | C++ → std::mutex | C# → lock/Monitor",
                  "Read-Write Lock: Java → ReentrantReadWriteLock | Go → sync.RWMutex | C++ → std::shared_mutex | C# → ReaderWriterLockSlim",
                  "Condition Variable: Java → Object.wait/notify | Python → threading.Condition | Go → sync.Cond | C++ → std::condition_variable | C# → Monitor.Wait/Pulse",
                  "Semaphore: Java → Semaphore | Python → threading.Semaphore | Go → x/sync/semaphore | C++ → std::counting_semaphore | C# → SemaphoreSlim",
                  "Blocking Queue: Java → LinkedBlockingQueue | Python → queue.Queue | Go → buffered channel | C# → BlockingCollection",
                  "Atomic Integer: Java → AtomicInteger | Go → sync/atomic | C++ → std::atomic<int> | C# → Interlocked",
                  "Concurrent Map: Java → ConcurrentHashMap | Go → sync.Map | C++ → tbb::concurrent_hash_map | C# → ConcurrentDictionary",
                ],
              },
            },
            {
              id: "b20",
              type: "heading",
              content: "Important Language Notes",
              metadata: { level: 3 },
            },
            {
              id: "b21",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Python's GIL: CPU-bound code does not benefit from threads, but I/O-bound code does. Use multiprocessing for CPU parallelism.",
                  "Go channels: Replace blocking queues and condition variables idiomatically. When in doubt, use a channel.",
                  "C++: Often requires manual composition of primitives. Consider Intel TBB for higher-level abstractions.",
                ],
              },
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Three Problem Types
    {
      title: "The Three Concurrency Problem Types",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "The Three Concurrency Problem Types",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Pattern Recognition: The Key Skill",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "Most concurrency problems in interviews fall into three categories. The surface details change — inventory systems, booking systems, rate limiters — but the underlying failure modes do not. Learning to see past the domain and into the problem type is the key skill. Once you classify the problem, the solution pattern follows naturally.",
            },
            {
              id: "c3",
              type: "heading",
              content: "1. Correctness Problems",
              metadata: { level: 2 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                'Correctness problems happen when shared state gets corrupted. Two threads both check that a seat is available, both see "yes", both book it — one booking gets lost. The classic failure modes are check-then-act (checking a condition and acting on it non-atomically) and read-modify-write (reading, computing, and writing back non-atomically).',
            },
            {
              id: "c5",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "What breaks: Shared state is updated concurrently without protection.",
                  "Solutions: Locks (mutual exclusion), atomics (for single variables), thread confinement (no sharing).",
                  "Common patterns: Check-then-act, read-modify-write, lost updates, dirty reads.",
                  "Interview examples: Parking lot (two cars race for last spot), inventory system (two orders fight over last item), bank account (concurrent deposits/withdrawals).",
                ],
              },
            },
            {
              id: "c6",
              type: "heading",
              content: "2. Coordination Problems",
              metadata: { level: 2 },
            },
            {
              id: "c7",
              type: "paragraph",
              content:
                "Coordination problems happen when threads need to hand off work or wait for each other. A producer adds tasks to a queue, consumers process them. If the queue is empty, consumers need to wait efficiently without burning CPU (busy-waiting). If the queue is full, producers need to slow down (backpressure).",
            },
            {
              id: "c8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "What breaks: Threads need ordering or handoff but have no coordination mechanism.",
                  "Solutions: Blocking queues, actors (message-passing), event loops.",
                  "Common patterns: Producer-consumer, async request processing, bursty traffic smoothing.",
                  "Interview examples: Thread pool executor, task scheduler, request queue with worker threads.",
                ],
              },
            },
            {
              id: "c9",
              type: "heading",
              content: "3. Scarcity Problems",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "Scarcity problems happen when resources are limited. You have 10 database connections but 100 concurrent requests. Some requests must wait. The key challenge is managing access to a finite resource pool without deadlocking, starving, or wasting resources.",
            },
            {
              id: "c11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "What breaks: Resources are limited and demand exceeds supply.",
                  "Solutions: Semaphores (counting permits), resource pools (object reuse), rate limiters.",
                  "Common patterns: Connection pooling, concurrent operation limits, resource budgets.",
                  "Interview examples: Database connection pool, rate limiter, download manager with concurrent limits.",
                ],
              },
            },
            {
              id: "c12",
              type: "heading",
              content: "How Problems Combine",
              metadata: { level: 2 },
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                "Most interview questions start with correctness. Coordination and scarcity often appear as follow-ups once shared state exists or throughput increases. Real systems frequently involve more than one category — for example, a connection pool (scarcity) whose connections must be returned correctly (correctness) and where idle threads should wait efficiently for a free connection (coordination). Separating concerns makes it easier to reason about each in isolation.",
            },
            {
              id: "c14",
              type: "heading",
              content: "Quick Decision Framework",
              metadata: { level: 2 },
            },
            {
              id: "c15",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Identify shared mutable state → Correctness concern. Reach for locks or atomics.",
                  "Identify threads that need to wait for or hand off to other threads → Coordination concern. Reach for blocking queues.",
                  "Identify limited resources with more demand than supply → Scarcity concern. Reach for semaphores or pools.",
                ],
              },
            },
            {
              id: "c16",
              type: "quote",
              content:
                "The interviewer wants to see if you can reason about what breaks when actions overlap and fix it without overcomplicating things. Start simple, add synchronization only where needed, and explain why each primitive was chosen.",
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
      title: "Thread vs process memory sharing",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "What memory is shared between threads in the same process?",
        explanation:
          "Threads within the same process share the heap (dynamically allocated memory), global variables, and open file descriptors. Each thread has its own stack and program counter (registers). The stack is thread-private because each thread has its own execution context and function call chain. The heap is shared because it is allocated per-process, not per-thread.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Heap memory, global variables, and open file descriptors — but each thread has its own stack and registers",
              isCorrect: true,
            },
            {
              id: "b",
              text: "All memory including stack, heap, and registers is shared between threads",
              isCorrect: false,
            },
            {
              id: "c",
              text: "No memory is shared — threads communicate via message passing only",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Only the program counter is shared; each thread has its own heap and stack",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why concurrency bugs are nondeterministic",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why are concurrency bugs typically nondeterministic — working in testing but failing in production?",
        explanation:
          'Concurrency bugs depend on the exact interleaving of thread execution, which varies with CPU scheduling, system load, and timing. In testing, low thread counts and consistent timing often produce a single "lucky" interleaving. In production, higher load and more threads increase the chance of hitting a problematic interleaving. The bug exists in both environments — it just manifests less often under test conditions.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "The outcome depends on thread scheduling and timing, which vary with system load — testing typically has less contention",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Production uses different compilers that optimize away synchronization",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Testing frameworks automatically add locks that prevent race conditions",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Production servers have more CPU cores, which creates different memory models",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Default tool for protecting shared state",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When multiple threads need to update a shared data structure (e.g., a HashMap of user sessions), what is the default concurrency primitive to reach for?",
        explanation:
          "A lock (mutex) is the default tool for protecting shared state involving multiple fields or complex data structures. Atomics only work on single variables. Semaphores are for limiting concurrency, not mutual exclusion on data structures. Condition variables are for waiting on conditions, not for direct data protection. When in doubt, start with a lock — you can optimize to finer-grained solutions later.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A lock (mutex) — provides mutual exclusion so only one thread accesses the structure at a time",
              isCorrect: true,
            },
            {
              id: "b",
              text: "An atomic variable — makes all operations on the data structure thread-safe",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A semaphore with 1 permit — more flexible than a lock for data structure protection",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A condition variable — threads wait until the data structure is available",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Atomics limitation: multi-variable updates",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A bank account class has two fields: balance and lastTransactionTimestamp. When processing a withdrawal, both must be updated together. Why can't atomics solve this?",
        explanation:
          "Atomics only guarantee atomicity for a single variable. If you use an atomic for balance and a separate atomic for lastTransactionTimestamp, another thread could observe a state where the balance has been updated but the timestamp has not — an inconsistent intermediate state. A lock is required to make the update of both fields appear as a single atomic operation. This is the fundamental limitation of atomics: they work on one variable at a time.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Atomics operate on single variables — two separate atomic updates can be observed in an inconsistent intermediate state",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Atomics are too slow for financial transactions that need sub-microsecond latency",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Atomics cannot be used with timestamp types, only with integer counters",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Atomics do not support compare-and-swap on floating-point balance values",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Read-write lock advantage over mutex",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A configuration cache is read by 50 threads concurrently but only updated by 1 thread every 10 seconds. Why is a read-write lock preferable to a standard mutex here?",
        explanation:
          "A read-write lock allows multiple readers to hold the lock simultaneously, only blocking when a writer acquires exclusive access. With a standard mutex, only one reader could read at a time — even though concurrent reads are perfectly safe since no data is being modified. In this scenario, a mutex would serialize 50 read threads unnecessarily, destroying throughput. A read-write lock lets all 50 readers proceed in parallel, only pausing them briefly every 10 seconds when the writer needs exclusive access.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "A read-write lock allows all 50 readers to proceed in parallel — a mutex would serialize them unnecessarily since concurrent reads are safe",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A read-write lock is faster because it uses hardware-level CAS instructions instead of OS-level blocking",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A mutex cannot be held for longer than a few milliseconds, which is insufficient for read operations",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A read-write lock prevents the writer from starving, whereas a mutex has no starvation guarantees",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Condition variable wait loop pattern",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When using a condition variable, why must the wait be placed inside a while loop that re-checks the condition, rather than a simple if statement?",
        explanation:
          "Spurious wakeups are a well-documented behavior in most threading implementations — a thread waiting on a condition variable can be woken up even when no other thread signaled. Additionally, between the signal and the woken thread re-acquiring the lock, another thread may have already consumed the resource (stolen wakeup). The while loop ensures the condition is re-verified after waking, making the code correct regardless of spurious or stolen wakeups. Using an if statement would cause the thread to proceed on a false condition.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Spurious wakeups can occur (thread wakes without a signal), and another thread may consume the resource between signal and lock re-acquisition",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The while loop is needed because condition.wait() does not actually release the lock in most implementations",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The while loop prevents deadlock by retrying the lock acquisition if it fails on the first attempt",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It is only a convention — an if statement works correctly but the while loop improves performance",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Coarse-grained vs fine-grained locking tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "An elevator system has 8 elevators. A single global lock protects all elevator state. Under high load, the system becomes a bottleneck. You propose switching to per-elevator locks. What new risk does this introduce, and under what condition does it occur?",
        explanation:
          "Per-elevator (fine-grained) locks introduce the risk of deadlock. If any operation needs to lock two or more elevators simultaneously (e.g., transferring a passenger assignment from elevator A to elevator B, or load-balancing decisions that compare two elevators), and threads acquire these locks in different orders, a circular wait can form — Thread 1 holds lock A and waits for lock B, while Thread 2 holds lock B and waits for lock A. This cannot happen with a single global lock because there is only one lock to acquire. The solution is to impose a consistent lock ordering (always lock the lower-numbered elevator first).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Deadlock risk — if any operation acquires multiple elevator locks in inconsistent order, threads can form a circular wait",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Starvation risk — elevators with more traffic will monopolize CPU time, starving quieter elevators",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Memory overhead — 8 locks use 8x the memory of a single lock, which is prohibitive at scale",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Priority inversion — low-priority elevator threads will block high-priority ones indefinitely",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Python GIL impact on concurrency design",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "You are designing a concurrent image processing pipeline in Python. Each image requires heavy CPU computation (resizing, filtering) and also I/O (reading from disk, writing results). How should you structure the concurrency, and why?",
        explanation:
          "Python's GIL prevents true CPU parallelism with threads — only one thread executes Python bytecode at a time. However, threads CAN run I/O operations in parallel because the GIL is released during I/O system calls. The optimal strategy combines multiprocessing for CPU-bound work (each process has its own GIL) with threading for I/O-bound work (reading/writing files). Using only threads would serialize the CPU work. Using only multiprocessing would work but waste resources on I/O waiting since processes are heavier than threads.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Use multiprocessing for CPU-bound resizing/filtering (bypasses GIL) and threads for I/O-bound disk reads/writes (GIL released during I/O)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Use only threads — the GIL is released during all operations, so threads are always sufficient in Python",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Use only multiprocessing — threads cannot do any useful concurrent work in Python due to the GIL",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Use async/await for both CPU and I/O work — asyncio avoids the GIL entirely",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Resources shared between threads",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL resources that are shared between threads in the same process:",
        explanation:
          "Threads in the same process share: the heap (dynamically allocated memory), global/static variables, and open file descriptors (sockets, files). Each thread has its own stack — the stack stores local variables and function call frames, which must be thread-private for independent execution. The program counter is also thread-private since each thread is at a different point in the code.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Heap memory (dynamically allocated objects)", isCorrect: true },
            { id: "b", text: "Global and static variables", isCorrect: true },
            { id: "c", text: "Open file descriptors and sockets", isCorrect: true },
            { id: "d", text: "Thread stack (local variables and call frames)", isCorrect: false },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid approaches to prevent race conditions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "A counter variable is being incremented by 10 threads simultaneously, causing lost updates. Select ALL approaches that would correctly prevent this:",
        explanation:
          "All three correct options eliminate the race condition: (1) An atomic increment uses a hardware CAS instruction that reads, increments, and writes in one indivisible step. (2) A mutex makes the read-modify-write a critical section — only one thread at a time. (3) Thread confinement (each thread has its own counter, merged at the end) eliminates sharing entirely. Volatile does NOT help — it only ensures visibility (the latest write is seen) but does not make the read-modify-write atomic. Two threads can still read the same value, both increment, and both write back.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Use an atomic increment operation (e.g., AtomicInteger.incrementAndGet() in Java)",
              isCorrect: true,
            },
            { id: "b", text: "Protect the increment with a mutex lock", isCorrect: true },
            {
              id: "c",
              text: "Use thread-local counters and merge the results after all threads complete",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Declare the counter as volatile — this ensures all threads see the latest value",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Concurrency primitives for scarcity problems",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "You need to limit a download manager to at most 5 concurrent downloads. Select ALL primitives that could be used to implement this constraint:",
        explanation:
          'A semaphore with 5 permits is the textbook solution — each download acquires a permit, and when all 5 are taken, additional downloads block until one completes. A blocking queue of 5 "download tokens" works similarly — downloads take() a token before starting and put() it back when done. A simple mutex is not correct because it would limit to 1 concurrent download, not 5. An atomic counter could track the count but cannot make a thread block and wait — it has no built-in waiting mechanism, so you would need to busy-wait or add a condition variable, making it an incomplete solution on its own.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "A semaphore initialized with 5 permits", isCorrect: true },
            {
              id: "b",
              text: 'A blocking queue pre-filled with 5 "download tokens"',
              isCorrect: true,
            },
            {
              id: "c",
              text: "A mutex lock that each download thread acquires before starting",
              isCorrect: false,
            },
            {
              id: "d",
              text: "An atomic counter that tracks the number of active downloads",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Properties of blocking queue that make it ideal for producer-consumer",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL properties that make a blocking queue the preferred tool for producer-consumer patterns in concurrent systems:",
        explanation:
          "Blocking queues provide: (1) Thread-safe insertion and removal — internal locks/CAS ensure no data corruption. (2) Automatic blocking on empty (consumers wait without busy-looping) and on full (producers slow down, providing backpressure). (3) Decoupling — producers and consumers operate independently at different rates without direct knowledge of each other. However, blocking queues do NOT guarantee FIFO ordering across multiple consumers — while the queue itself is FIFO, when multiple consumers dequeue simultaneously, the order in which they complete processing their items is nondeterministic.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Thread-safe insertion and removal without external synchronization",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Automatic blocking when empty (consumers wait) and when full (producers wait, providing backpressure)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Decouples producers and consumers — they operate independently at different rates",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Guarantees that items are processed in strict FIFO order across multiple consumers",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Explain why counter += 1 is not thread-safe",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain in detail why the statement `counter += 1` is not thread-safe. Describe the exact sequence of events that leads to a lost update when two threads execute this statement concurrently.",
        explanation:
          "A complete answer must: (1) Break counter += 1 into its three machine-level steps: read, increment, write. (2) Show a specific interleaving where both threads read the same initial value, both compute the same new value, and both write it back — resulting in one increment being lost. (3) Mention that this is the classic read-modify-write race condition.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "The statement counter += 1 looks atomic in source code but is actually three separate machine-level operations:\n\n1. READ: Load the current value of counter from memory into a CPU register\n2. MODIFY: Add 1 to the register value\n3. WRITE: Store the result back to memory\n\nHere is a specific interleaving that loses an update (assume counter starts at 0):\n\n- Thread A: READ counter → gets 0\n- Thread B: READ counter → gets 0 (Thread A hasn't written yet)\n- Thread A: MODIFY → computes 0 + 1 = 1\n- Thread B: MODIFY → computes 0 + 1 = 1\n- Thread A: WRITE → stores 1 to counter\n- Thread B: WRITE → stores 1 to counter\n\nFinal value: 1 (expected: 2). Thread A's increment is completely lost.\n\nThis is the read-modify-write race condition. It occurs because the three steps are not atomic — the OS can context-switch between any of them. The fix is either an atomic increment (hardware-level CAS that does all three steps in one instruction) or a mutex that prevents interleaving entirely.",
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Compare concurrency vs parallelism with examples",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the difference between concurrency and parallelism. Provide a concrete example of each, and explain why concurrency bugs can occur on a single-core machine even though no truly parallel execution happens.",
        explanation:
          "Must distinguish: concurrency = dealing with multiple things at once (design), parallelism = doing multiple things at once (execution). Single-core: OS interleaves threads — no true parallelism, but race conditions still occur because interleaving is unpredictable. Key insight: from the program's perspective, single-core and multi-core concurrency bugs are identical — the issue is unpredictable interleaving, not simultaneous execution.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Concurrency is a design property — it means a program is structured to handle multiple tasks that can make progress independently. Parallelism is an execution property — it means tasks are literally running at the same instant on different CPU cores.\n\nConcrete examples:\n- Concurrency without parallelism: A single-core machine running a web server. The OS time-slices between handling request A and request B. Both make progress, but only one executes at any given instant.\n- Parallelism with concurrency: A multi-core machine running two threads of a matrix multiplication. Both threads execute simultaneously on different cores, each computing a portion of the result.\n\nWhy concurrency bugs occur on single-core machines:\nEven though only one thread runs at a time, the OS scheduler can preempt a thread at ANY point — including between the READ and WRITE of a counter increment. If Thread A reads counter=0, gets preempted, Thread B reads counter=0, increments to 1, writes 1, then Thread A resumes and writes its stale computation of 1 — the update is lost. The interleaving is unpredictable because the scheduler makes decisions based on time slices, priority, and I/O events that the programmer cannot control.\n\nKey insight: from the program's perspective, interleaved execution (single-core) and parallel execution (multi-core) produce the same concurrency hazards. The problem is not simultaneous execution — it is unpredictable ordering of operations on shared state.",
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Classify a parking lot concurrency scenario into problem types",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A parking lot system manages 100 spots. Cars arrive concurrently, check for availability, and park. During peak hours, a queue forms at the entrance. The lot also has a valet service limited to 3 concurrent valets. Identify ALL concurrency problem types present, explain what specific failure modes each introduces, and propose the appropriate primitive for each.",
        explanation:
          "Must identify all three types: (1) Correctness — two cars checking the same spot simultaneously (check-then-act race), fix with locks. (2) Coordination — cars queuing at the entrance need to wait without busy-looping, fix with blocking queue. (3) Scarcity — only 3 valets available, fix with semaphore. Bonus: explain how the problems interact.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'This scenario contains all three concurrency problem types:\n\n1. CORRECTNESS — Shared state corruption:\n   - Failure mode: Two cars simultaneously check if spot #42 is available, both see "available", both attempt to park there. One car\'s assignment is lost (check-then-act race condition).\n   - Primitive: Lock (mutex) around the spot assignment logic. Acquire lock → check availability → assign spot → release lock. For better throughput, use fine-grained locks (per-spot or per-section) instead of one global lock.\n\n2. COORDINATION — Thread ordering and handoff:\n   - Failure mode: During peak hours, cars arriving faster than spots free up need to wait efficiently. Without coordination, they either busy-wait (wasting CPU) or miss available spots.\n   - Primitive: Blocking queue at the entrance. When the lot is full, arriving cars call queue.put() and block. When a car leaves, the system calls queue.take() to wake the next waiting car. This provides FIFO fairness and efficient waiting.\n\n3. SCARCITY — Limited resources:\n   - Failure mode: Only 3 valets are available but 10 cars request valet service simultaneously. Without limits, the system might try to assign non-existent valets or crash.\n   - Primitive: Semaphore(3) for the valet pool. Each valet request acquires a permit; when all 3 are taken, additional requests block until a valet becomes free.\n\nHow they interact: A car arriving at a full lot (coordination) eventually gets a spot (correctness — must assign atomically), and may optionally request a valet (scarcity). The correctness lock and the semaphore are independent concerns — no need to hold both simultaneously. The blocking queue feeds into the correctness-protected assignment logic.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Design a thread-safe bank account with compound operations",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a thread-safe bank account class that supports deposit(), withdraw(), and transfer(from, to, amount). Explain why atomics are insufficient, why a naive lock approach can deadlock during transfers, and how to prevent it.",
        explanation:
          'Must cover: (1) Why atomics fail — transfer needs to atomically debit one account and credit another (two variables). (2) Naive approach — lock each account separately; transfer locks "from" then "to". Deadlock if Thread 1 transfers A→B while Thread 2 transfers B→A. (3) Fix: consistent lock ordering (always lock the lower-numbered account first) breaks the circular wait.',
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Thread-safe bank account design:\n\nWhy atomics are insufficient:\ndeposit() and withdraw() on a single account could use atomics for the balance field. But transfer() must atomically debit the source AND credit the destination — two separate variables. Atomic operations only guarantee atomicity on a single variable, so using atomic balance on each account allows an intermediate state where money has been debited but not yet credited (or vice versa).\n\nNaive lock approach and the deadlock:\nGive each account its own lock. For deposit/withdraw: lock the account, modify, unlock.\nFor transfer(A, B, amount): lock A → debit A → lock B → credit B → unlock both.\n\nDeadlock scenario:\n- Thread 1: transfer(A, B, 100) — acquires lock A, waiting for lock B\n- Thread 2: transfer(B, A, 50) — acquires lock B, waiting for lock A\n→ Circular wait. Neither thread can proceed.\n\nSolution — consistent lock ordering:\nAssign each account a unique ID. Always acquire the lock on the lower-ID account first.\n\ntransfer(from, to, amount):\n  first = min(from.id, to.id)\n  second = max(from.id, to.id)\n  lock(first) → lock(second)\n  → debit from, credit to\n  → unlock(second) → unlock(first)\n\nNow Thread 1 (A→B) and Thread 2 (B→A) both lock min(A,B) first. One thread gets the first lock; the other blocks. No circular wait is possible.\n\nAlternative: Use a single global lock for all transfers (simpler but limits concurrency to one transfer at a time). This is fine if transfer throughput is low but unacceptable under high load.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "When to choose each concurrency primitive",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You are in an LLD interview and the interviewer says: "Now add concurrency." Walk through your decision framework. For each of the five concurrency primitives (atomics, locks, semaphores, condition variables, blocking queues), describe the specific scenario where it is the RIGHT first choice and one scenario where it is the WRONG choice despite seeming plausible.',
        explanation:
          "Must demonstrate clear understanding of when each primitive applies and common misapplications. Show systematic thinking — not memorized definitions but actual decision criteria based on the structure of the problem.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'My concurrency decision framework:\n\n1. ATOMICS\n   Right choice: A hit counter or feature flag that needs thread-safe increment/read. Single variable, no relationship to other state. Hardware CAS is fastest.\n   Wrong choice: Updating a user profile (name + email + lastModified). Three fields need to change together — atomics on each field leave inconsistent intermediate states visible.\n\n2. LOCKS (MUTEX)\n   Right choice: An inventory system where checking stock and decrementing must be atomic (check-then-act). The critical section involves reading and writing multiple fields. Default starting point for shared state protection.\n   Wrong choice: A simple counter being incremented. A lock works but is heavier than an atomic — involves OS-level blocking, context switching, and potential priority inversion. Use atomics for single-variable updates.\n\n3. SEMAPHORES\n   Right choice: A connection pool with 10 connections serving 100 threads. Semaphore(10) perfectly models "N permits available." Threads acquire before using a connection and release after.\n   Wrong choice: Protecting a shared data structure. A semaphore(1) technically works as a mutex but obscures intent, and semaphores lack ownership semantics — any thread can release, not just the one that acquired. Use a proper mutex.\n\n4. CONDITION VARIABLES\n   Right choice: A custom bounded buffer where you need fine-grained control over the waiting condition (e.g., "wait until buffer is less than half full" or "wait until a specific item type is available"). Condition variables give you the flexibility to define arbitrary predicates.\n   Wrong choice: A standard producer-consumer queue. Condition variables are the building block but too low-level — use a blocking queue that wraps them with correct wait-loop semantics. Direct use invites the "if vs while" bug.\n\n5. BLOCKING QUEUES\n   Right choice: Producer-consumer pattern — web server dispatching requests to a thread pool. The queue handles all synchronization, backpressure (blocks producers when full), and efficient waiting (blocks consumers when empty).\n   Wrong choice: A shared cache where threads need random-access reads/writes by key. A queue is sequential — you cannot look up a specific item. Use a ConcurrentHashMap or a locked HashMap instead.',
          minLength: 250,
          maxLength: 4000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Explain thread confinement and when it eliminates the need for synchronization",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the concept of thread confinement as a concurrency strategy. Describe at least two forms of thread confinement (with concrete examples), explain when it is preferable to locks, and identify its key limitation.",
        explanation:
          "Should cover: (1) Thread confinement means keeping data accessible to only one thread, eliminating the need for synchronization entirely. (2) Forms: stack confinement (local variables), ThreadLocal storage, actor model (each actor owns its state). (3) Advantages: zero synchronization overhead, no deadlock risk. (4) Limitation: when threads must share state (e.g., a transfer between two accounts), confinement is impossible.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Thread confinement is the strategy of ensuring that data is only ever accessed by a single thread, eliminating the need for any synchronization. If data is not shared, there are no race conditions — period.\n\nForms of thread confinement:\n\n1. Stack confinement: Data exists only as local variables within a method. Each thread has its own stack, so local variables are automatically thread-confined. Example: a request handler that creates a local StringBuilder, builds a response, and returns it. No other thread can access that StringBuilder.\n\n2. ThreadLocal storage: Each thread gets its own copy of a variable. Example: SimpleDateFormat in Java is not thread-safe. Instead of synchronizing access, use ThreadLocal<SimpleDateFormat> — each thread gets its own formatter instance. Zero contention.\n\n3. Actor model (ownership-based confinement): Each actor owns a set of data and processes messages sequentially on its own thread. Other actors interact only through messages, never by directly accessing the data. Example: Akka actors in Scala/Java, or Go goroutines communicating exclusively through channels ("Don\'t communicate by sharing memory; share memory by communicating").\n\nWhen it is preferable to locks:\n- When data can be naturally partitioned per thread (e.g., per-request state in a web server)\n- When the overhead of synchronization is unacceptable (high-frequency trading systems)\n- When deadlock risk must be completely eliminated\n\nKey limitation:\nThread confinement is impossible when multiple threads MUST operate on the same data. A bank transfer between two accounts requires reading and writing both balances — you cannot confine them to a single thread. At that point, you need locks or other synchronization. Thread confinement works best when data can be naturally partitioned or when sharing can be deferred (e.g., compute locally, merge results later).',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Name for the check-then-act bug pattern",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Two threads both check if a parking spot is available (true), then both assign a car to it — one assignment is silently lost. What is the name of this concurrency bug pattern?",
        explanation:
          'This is the check-then-act (or TOCTOU — Time Of Check to Time Of Use) race condition. The check ("is the spot available?") and the act ("assign the car") are not performed atomically, allowing another thread to change the state between the check and the act. The fix is to make the check-then-act a critical section using a lock.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Check-then-act (also known as TOCTOU — Time Of Check to Time Of Use)",
          acceptableAnswers: [
            "check-then-act",
            "TOCTOU",
            "time of check to time of use",
            "race condition",
            "check then act",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Go concurrency idiom",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In Go, what replaces blocking queues and condition variables as the idiomatic concurrency primitive? Name the construct.",
        explanation:
          "Go channels (buffered channels specifically) replace blocking queues and condition variables. Go's concurrency philosophy is \"Don't communicate by sharing memory; share memory by communicating.\" A buffered channel of capacity N is semantically equivalent to a blocking queue — sends block when full, receives block when empty.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Channels (buffered channels)",
          acceptableAnswers: [
            "channels",
            "channel",
            "buffered channel",
            "buffered channels",
            "go channels",
            "chan",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Deadlock prevention via lock ordering",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Thread 1 locks resource A then B. Thread 2 locks resource B then A. This can deadlock. In one sentence, state the general principle that prevents this type of deadlock.",
        explanation:
          "The principle is consistent lock ordering (also called lock hierarchy): always acquire multiple locks in the same global order (e.g., by resource ID). This breaks the circular wait condition, which is one of the four necessary conditions for deadlock (Coffman conditions). If all threads lock A before B, no circular wait can form.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Impose a consistent global lock ordering — always acquire locks in the same order (e.g., by resource ID) to break circular wait.",
          acceptableAnswers: [
            "lock ordering",
            "consistent lock ordering",
            "lock hierarchy",
            "acquire locks in the same order",
            "total ordering on locks",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Why volatile does not fix race conditions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In Java, why does declaring a shared counter as `volatile` NOT prevent lost updates from concurrent increments? What does volatile actually guarantee?",
        explanation:
          "Volatile guarantees visibility (all threads see the latest write) and prevents instruction reordering, but it does NOT guarantee atomicity of compound operations. counter++ is still three steps (read, increment, write) even with volatile. Between the read and write, another thread can read the same value. Volatile prevents stale reads but not interleaved read-modify-write sequences.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Volatile guarantees visibility (latest write is seen) but NOT atomicity. counter++ is still three steps (read, increment, write) that can interleave.",
          acceptableAnswers: [
            "visibility not atomicity",
            "not atomic",
            "does not make compound operations atomic",
            "volatile only guarantees visibility",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match concurrency primitives to their descriptions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each concurrency primitive to its description:",
        explanation:
          "Atomics use hardware CAS for single-variable thread safety. Locks (mutexes) provide mutual exclusion for critical sections. Semaphores are counting locks with N permits. Blocking queues provide thread-safe producer-consumer handoff with built-in blocking.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Atomic",
              right:
                "Thread-safe operation on a single variable using hardware CAS — no lock needed",
            },
            {
              id: "p2",
              left: "Lock (Mutex)",
              right: "Mutual exclusion — only one thread in the critical section at a time",
            },
            {
              id: "p3",
              left: "Semaphore",
              right: "Counting lock with N permits — blocks when all permits are taken",
            },
            {
              id: "p4",
              left: "Blocking Queue",
              right: "Thread-safe queue that blocks on empty (consumers) and full (producers)",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match concurrency problem types to their failure modes",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each concurrency problem type to the specific failure mode it causes:",
        explanation:
          "Correctness problems cause data corruption through races on shared state. Coordination problems cause busy-waiting (wasted CPU) when threads have no efficient waiting mechanism. Scarcity problems cause resource exhaustion — too many consumers for limited resources. Deadlock is a cross-cutting concern that results from incorrect lock usage, typically with fine-grained locking without consistent ordering.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Correctness",
              right: "Two threads both book the same seat — one booking is silently lost",
            },
            {
              id: "p2",
              left: "Coordination",
              right:
                "Consumer threads spin-loop checking an empty queue, burning 100% CPU while waiting",
            },
            {
              id: "p3",
              left: "Scarcity",
              right:
                "100 requests compete for 10 database connections — 90 requests must wait or fail",
            },
            {
              id: "p4",
              left: "Deadlock",
              right:
                "Thread A holds lock 1 waiting for lock 2; Thread B holds lock 2 waiting for lock 1 — both freeze",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match interview scenarios to primary concurrency problem type and solution",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each LLD interview scenario to its PRIMARY concurrency problem type:",
        explanation:
          "Inventory last-item is a correctness problem — two orders racing for the same item (check-then-act). Thread pool executor is a coordination problem — worker threads need to wait efficiently for tasks. Rate limiter is a scarcity problem — limited request budget must be shared. Connection pool with idle recycling involves all three but primarily scarcity — managing a finite pool of connections with fair allocation.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Two orders fight over the last item in inventory",
              right: "Correctness — check-then-act race on shared stock count, use locks",
            },
            {
              id: "p2",
              left: "Worker threads in a thread pool wait for tasks",
              right: "Coordination — threads must wait efficiently for work, use blocking queue",
            },
            {
              id: "p3",
              left: "Rate limiter allowing 100 requests/second",
              right:
                "Scarcity — limited request budget shared across callers, use semaphore or token bucket",
            },
            {
              id: "p4",
              left: "Database connection pool serving concurrent queries",
              right:
                "Scarcity — finite connections with more demand than supply, use semaphore + pool",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Thread memory model basics",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Threads within the same process share the _____ and global variables, but each thread has its own _____ and program counter.",
        explanation:
          "Threads share the heap (dynamically allocated memory) and globals, but each thread has its own stack for local variables and function call frames. The stack must be private because each thread has its own execution context. The program counter must be private because each thread is at a different point in the code.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Threads within the same process share the {{blank1}} and global variables, but each thread has its own {{blank2}} and program counter.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "heap",
              acceptableAnswers: ["heap", "heap memory", "the heap"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "stack",
              acceptableAnswers: ["stack", "call stack", "thread stack"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Three concurrency problem types",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The three categories of concurrency problems are _____ (shared state gets corrupted), _____ (threads need ordering or handoff), and _____ (resources are limited).",
        explanation:
          "The three categories are: Correctness (shared state corruption from race conditions), Coordination (threads need to wait for or hand off work to each other), and Scarcity (more demand than available resources). Most interview questions start with correctness; coordination and scarcity appear as follow-ups.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The three categories of concurrency problems are {{blank1}} (shared state gets corrupted), {{blank2}} (threads need ordering or handoff), and {{blank3}} (resources are limited).",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "correctness",
              acceptableAnswers: ["correctness", "Correctness"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "coordination",
              acceptableAnswers: ["coordination", "Coordination"],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "scarcity",
              acceptableAnswers: ["scarcity", "Scarcity"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Atomics hardware mechanism",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "Atomic operations use the CPU instruction called _____ (abbreviated CAS) to read, compare, and write in one uninterruptible step. They are fast but limited to _____ variable(s) at a time.",
        explanation:
          "Compare-and-swap (CAS) is the hardware instruction behind atomics. It reads the current value, compares it to an expected value, and writes a new value — all in one atomic step. If the comparison fails (another thread changed the value), the operation retries. CAS only works on a single memory location, which is why atomics cannot protect multi-variable updates.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "Atomic operations use the CPU instruction called {{blank1}} (abbreviated CAS) to read, compare, and write in one uninterruptible step. They are fast but limited to {{blank2}} variable(s) at a time.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "compare-and-swap",
              acceptableAnswers: ["compare-and-swap", "compare and swap", "Compare-And-Swap"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "one",
              acceptableAnswers: ["one", "1", "a single", "single"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Lost updates with concurrent increments",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "A shared counter starts at 0. Thread A and Thread B each increment it 1000 times (counter += 1) without any synchronization. In the WORST case interleaving, what is the minimum possible final value of the counter? (Hint: consider the maximum number of lost updates.)",
        explanation:
          "In the worst case, every increment from one thread can be completely lost. Consider: Thread A reads 0, Thread B performs all 1000 increments (counter = 1000), Thread A writes 1 (overwriting 1000 with 1). Then Thread B reads 1, Thread A performs 999 more increments (counter = 1000), Thread B writes 2 (overwriting 1000 with 2). In the absolute worst case with maximally adversarial interleaving, the minimum final value is 2 — each thread successfully writes at least its last increment.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 2,
          tolerance: 0,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Semaphore throughput calculation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A download manager uses a semaphore with 5 permits. Each download takes exactly 10 seconds. If 20 downloads are queued simultaneously, how many seconds until ALL downloads complete? (Assume zero overhead for semaphore acquire/release.)",
        explanation:
          "With 5 permits, 5 downloads run concurrently. 20 downloads in groups of 5: first 5 complete at t=10, next 5 at t=20, next 5 at t=30, last 5 at t=40. Total: 20 downloads ÷ 5 concurrency = 4 batches × 10 seconds = 40 seconds. Without the semaphore limit, all 20 could run in parallel and finish in 10 seconds.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 40,
          tolerance: 0,
        },
      },
    },
  ],
};
