/**
 * LLD Concurrency — Coordination — Interview Prep Content
 * Based on HelloInterview extract
 * Covers: producer-consumer coordination, busy-waiting anti-patterns,
 * condition variables, blocking queues, actor model, async processing, bursty traffic
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldConcurrencyCoordinationContent: StoryPointSeed = {
  title: "Concurrency — Coordination",
  description:
    "Master thread coordination patterns — condition variables, blocking queues, and the actor model. Learn to design producer-consumer systems with efficient waiting, backpressure, and thread safety for async processing and bursty traffic.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: The Coordination Problem & Shared State Coordination
    {
      title: "The Coordination Problem & Shared State Solutions",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "The Coordination Problem & Shared State Solutions",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Why Coordination Matters",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Coordination is about threads communicating and handing off work. One thread produces tasks, another consumes them. A service sends a request, another processes it. The fundamental challenge: how do independent execution paths signal each other without burning CPU or corrupting state?",
            },
            {
              id: "b3",
              type: "paragraph",
              content:
                "Consider a task scheduler for a web app. API handlers produce background tasks (welcome emails, image resizing, report generation), and a pool of worker threads processes them asynchronously. The architecture is simple in concept, but cracks appear at the edges.",
            },
            {
              id: "b4",
              type: "heading",
              content: "Anti-Pattern: Busy-Waiting",
              metadata: { level: 2 },
            },
            {
              id: "b5",
              type: "code",
              content:
                "while True:\n    if queue:\n        task = queue.pop(0)\n        execute(task)",
              metadata: { language: "python" },
            },
            {
              id: "b6",
              type: "paragraph",
              content:
                "Busy-waiting is disastrous. Each worker spins in a tight loop, burning CPU while doing no useful work. With eight workers on an eight-core machine, you consume 100% CPU just checking an empty queue. When tasks finally arrive, there is no CPU left to run them.",
            },
            {
              id: "b7",
              type: "heading",
              content: "Anti-Pattern: Sleep-Polling",
              metadata: { level: 2 },
            },
            {
              id: "b8",
              type: "code",
              content:
                "import time\n\nwhile True:\n    if queue:\n        task = queue.pop(0)\n        execute(task)\n    else:\n        time.sleep(0.1)",
              metadata: { language: "python" },
            },
            {
              id: "b9",
              type: "paragraph",
              content:
                "Sleep-polling reduces CPU usage but trades waste for latency. A task arriving 1ms after a worker sleeps waits nearly 100ms. Sleep longer and the system feels sluggish. Sleep shorter and you are back to burning CPU. Neither extreme is acceptable.",
            },
            {
              id: "b10",
              type: "heading",
              content: "The Three Problems to Solve",
              metadata: { level: 2 },
            },
            {
              id: "b11",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Efficient waiting — consumers should sleep when idle, waking immediately when work arrives",
                  "Backpressure — producers should slow down when consumers cannot keep up, preventing memory exhaustion",
                  "Thread safety — the coordination mechanism must handle concurrent access without corruption",
                ],
              },
            },
            {
              id: "b12",
              type: "heading",
              content: "Wait/Notify (Condition Variables)",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "Condition variables solve the polling problem. A thread calls wait() on a condition variable, which atomically releases the lock and puts the thread to sleep — consuming zero CPU. When another thread changes shared state, it calls notify() to wake waiting threads. The waiting thread reacquires the lock before resuming execution.",
            },
            {
              id: "b14",
              type: "code",
              content:
                "with condition:\n    while not condition_is_met():\n        condition.wait()  # Releases lock, sleeps until notified\n    do_work()\n    condition.notify_all()  # Wakes all waiting threads",
              metadata: { language: "python" },
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "The while loop around wait() is essential. A thread must recheck the condition after waking because another thread may have already consumed the resource between notification and lock reacquisition. The JVM can also wake threads spuriously without any notify() call, so you always verify the condition still holds.",
            },
            {
              id: "b16",
              type: "heading",
              content: "notify() vs notify_all() — The Thundering Herd Problem",
              metadata: { level: 3 },
            },
            {
              id: "b17",
              type: "paragraph",
              content:
                'If producers and consumers share one condition variable, notify() might wake the wrong thread type. A consumer finishing work might wake another consumer instead of a producer waiting for space. The safe fix is notify_all(), but waking 50 threads when only one can proceed wastes context switches. The best solution: use separate condition variables — "not_empty" for consumers and "not_full" for producers — so signals reach only the correct waiters.',
            },
            {
              id: "b18",
              type: "heading",
              content: "Blocking Queues",
              metadata: { level: 2 },
            },
            {
              id: "b19",
              type: "paragraph",
              content:
                "A blocking queue wraps all of the wait/notify complexity in a clean API. When the queue is empty, take() blocks the calling thread until an item arrives. When the queue is full, put() blocks the caller until space frees up. Backpressure is built in. Efficient waiting is automatic. Thread safety is handled internally.",
            },
            {
              id: "b20",
              type: "code",
              content:
                "import queue\nfrom typing import Callable\n\nclass TaskScheduler:\n    def __init__(self):\n        self._queue = queue.Queue(maxsize=1000)\n\n    def submit_task(self, task: Callable) -> None:\n        self._queue.put(task)  # Blocks if queue is full\n\n    def worker_loop(self) -> None:\n        while True:\n            task = self._queue.get()  # Blocks if queue is empty\n            task()",
              metadata: { language: "python" },
            },
            {
              id: "b21",
              type: "heading",
              content: "Critical: Always Bound the Queue",
              metadata: { level: 3 },
            },
            {
              id: "b22",
              type: "paragraph",
              content:
                "An unbounded queue reintroduces the memory exhaustion problem. If producers are faster than consumers, the queue grows until OutOfMemoryError crashes the entire service. Always pass a capacity. Size it based on burst tolerance: if workers handle 100 tasks/sec and you want to absorb a 10-second spike, you need capacity for 1,000 tasks.",
            },
            {
              id: "b23",
              type: "heading",
              content: "Handling Full Queues",
              metadata: { level: 3 },
            },
            {
              id: "b24",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Block with put() — use for internal pipelines where slowing down is acceptable",
                  'Timeout with offer(timeout) — use on request paths; return 503 "try again later"',
                  "Drop and log with offer() (no timeout) — use for lossy workloads like analytics events",
                ],
              },
            },
            {
              id: "b25",
              type: "heading",
              content: "Graceful Shutdown Strategies",
              metadata: { level: 3 },
            },
            {
              id: "b26",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Interrupt worker threads — blocked take() throws InterruptedException, worker catches it and exits cleanly",
                  "Poll with timeout — use poll(timeout) instead of take(), check a shutdown flag periodically",
                  "Poison pill pattern — submit a special sentinel task per worker; on receiving it, the worker exits its loop",
                ],
              },
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 2: Message Passing — The Actor Model
    {
      title: "Message Passing Coordination — The Actor Model",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Message Passing Coordination — The Actor Model",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Shared State vs Message Passing",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "There are two fundamentally different approaches to coordination. Shared state coordination uses data structures that multiple threads access directly, like a blocking queue. Message passing coordination avoids shared state entirely — each component has its own private state and communicates by sending messages.",
            },
            {
              id: "c3",
              type: "heading",
              content: "The Actor Model",
              metadata: { level: 2 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "An actor is an independent unit of computation with three properties: it has a mailbox (queue of incoming messages), it processes messages one at a time, and it can send messages to other actors. No shared state. No locks. Each actor is single-threaded internally, so there is no concurrent access to worry about within an actor.",
            },
            {
              id: "c5",
              type: "code",
              content:
                "import threading\nimport queue\nfrom abc import ABC, abstractmethod\n\nclass Actor(ABC):\n    def __init__(self):\n        self.mailbox = queue.Queue()\n        self.running = True\n        self.thread = threading.Thread(target=self._run)\n        self.thread.start()\n\n    def _run(self):\n        while self.running:\n            try:\n                message = self.mailbox.get(timeout=0.1)\n                self.on_receive(message)\n            except queue.Empty:\n                continue\n\n    def send(self, message):\n        self.mailbox.put(message)\n\n    @abstractmethod\n    def on_receive(self, message):\n        pass\n\n    def stop(self):\n        self.running = False\n        self.thread.join()",
              metadata: { language: "python" },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "Notice there are no locks in the message handler. The actor processes one message at a time, so on_receive() never runs concurrently with itself. Mutable state inside an actor is accessed sequentially. The mailbox queue handles all concurrent access internally — all synchronization is centralized at one well-defined boundary.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Actor-Based Email Service",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "code",
              content:
                'class EmailActor(Actor):\n    def __init__(self):\n        super().__init__()\n        self.email_client = EmailClient()\n\n    def on_receive(self, request):\n        self.email_client.send(request.to, request.subject, request.body)\n\n\nclass SignupHandler:\n    def __init__(self, user_repository):\n        self.email_actor = EmailActor()\n        self.user_repository = user_repository\n\n    def handle_signup(self, request):\n        user = self.user_repository.save(User(request.email))\n        # Send message to actor — returns immediately\n        self.email_actor.send(EmailRequest(\n            to=user.email,\n            subject="Welcome!",\n            body="Thanks for signing up..."\n        ))',
              metadata: { language: "python" },
            },
            {
              id: "c9",
              type: "heading",
              content: "When to Use Actors",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "Actors shine when you have many independent entities that occasionally communicate: chat user sessions, game rooms, trading order books. The model scales well — actors can be distributed across machines because they only interact through messages. Erlang and Akka build entire distributed systems on this property.",
            },
            {
              id: "c11",
              type: "quote",
              content:
                'Rule of thumb: If your problem is "process these tasks in the background," use a blocking queue. If your problem is "coordinate many independent entities with their own state," consider actors.',
            },
            {
              id: "c12",
              type: "heading",
              content: "Actor Model Challenges",
              metadata: { level: 2 },
            },
            {
              id: "c13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mailbox overflow — mailboxes can fill up if producers outpace the actor. Configure size limits and overflow behavior.",
                  "Message ordering — messages from A to B arrive in order, but interleaving across senders is undefined. Global ordering is hard.",
                  "Debugging — tracing a request through multiple actors is harder than stepping through a single call stack.",
                  'Request-response patterns — actors are inherently async; synchronous "ask" patterns must be built on top, adding complexity.',
                ],
              },
            },
            {
              id: "c14",
              type: "heading",
              content: "Blocking Queue vs Actor: Decision Framework",
              metadata: { level: 2 },
            },
            {
              id: "c15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Simple producer-consumer (email, image processing) → Blocking Queue",
                  "Many stateful entities communicating (chat, game servers, trading) → Actors",
                  "Need distributed coordination → Actors (natural distribution via message passing)",
                  "Background task processing → Blocking Queue + worker pool",
                ],
              },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Common Coordination Patterns
    {
      title: "Common Coordination Patterns — Async Processing & Bursty Traffic",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Common Coordination Patterns — Async Processing & Bursty Traffic",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Pattern 1: Process Requests Asynchronously",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "The most common coordination pattern: users make requests that need slow work done, but that work does not belong on the request path. The API handler is the producer — it does minimal work, hands off a task, and responds immediately. Workers are consumers — they process tasks asynchronously.",
            },
            {
              id: "d3",
              type: "code",
              content:
                'import queue\nfrom dataclasses import dataclass\n\n@dataclass\nclass EmailTask:\n    recipient: str\n    template: str\n    data: str\n\nclass EmailService:\n    def __init__(self):\n        self._email_queue = queue.Queue(maxsize=10000)\n\n    # API handler (producer)\n    def signup(self, email: str, name: str) -> None:\n        user_repository.save(email, name)   # Fast\n        self._email_queue.put(EmailTask(email, "welcome", name))  # Fast\n        # Return immediately — user sees instant response\n\n    # Worker thread (consumer)\n    def email_worker(self) -> None:\n        while True:\n            task = self._email_queue.get()\n            email_client.send(task.recipient, task.template, task.data)',
              metadata: { language: "python" },
            },
            {
              id: "d4",
              type: "heading",
              content: "Real-World Examples",
              metadata: { level: 3 },
            },
            {
              id: "d5",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Image Upload Service — save original, enqueue resize/compress/S3 upload, return success immediately",
                  "Payment Processing — save order, enqueue card charge + receipt + inventory update + shipping label",
                  'Report Generation — save "pending" record, enqueue generation task, respond "report is being generated"',
                ],
              },
            },
            {
              id: "d6",
              type: "heading",
              content: "Pattern 2: Handle Bursty Traffic",
              metadata: { level: 2 },
            },
            {
              id: "d7",
              type: "paragraph",
              content:
                "Bursty traffic comes in waves: a news spike, Black Friday, concert ticket drops. The naive approach is scaling workers to peak load — wasteful 99% of the time. Instead, size workers for normal load and let the queue absorb spikes. Requests pile up during bursts, workers drain them at sustainable rate, and everything returns to normal after the burst ends.",
            },
            {
              id: "d8",
              type: "code",
              content:
                'class TicketService:\n    def __init__(self):\n        # Sized for 10-second burst at 10,000 req/s\n        self._purchase_queue = queue.Queue(maxsize=100000)\n\n    def purchase_ticket(self, user_id: str, event_id: str, quantity: int) -> None:\n        request = PurchaseRequest(user_id, event_id, quantity)\n        try:\n            self._purchase_queue.put(request, timeout=0.1)\n        except queue.Full:\n            raise ServiceUnavailableException("Too many requests, try again")\n\n    def purchase_worker(self) -> None:\n        while True:\n            request = self._purchase_queue.get()\n            process_purchase(request)',
              metadata: { language: "python" },
            },
            {
              id: "d9",
              type: "heading",
              content: "Queue Sizing for Bursts",
              metadata: { level: 3 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "Size the queue based on expected burst duration and peak rate. If workers handle 100 tasks/sec and you want to absorb a 10-second spike at 10,000 req/s, you need capacity for approximately 100,000 tasks (incoming rate minus processing rate times duration). During normal load the queue stays near empty; during bursts it fills but does not overflow.",
            },
            {
              id: "d11",
              type: "heading",
              content: "Coordination Decision Tree (Interview)",
              metadata: { level: 2 },
            },
            {
              id: "d12",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Is there async work? → Yes → Use coordination",
                  "Is it simple producer-consumer? → Yes → Bounded BlockingQueue with put()/take()",
                  "Many independent stateful entities? → Yes → Consider the Actor Model",
                  "Queue filling up? → Size based on burst duration; use offer(timeout) on request paths",
                  "Need graceful shutdown? → Interrupt threads, poll with timeout, or poison pill",
                ],
              },
            },
            {
              id: "d13",
              type: "quote",
              content:
                "In interviews, BlockingQueue is your default answer for producer-consumer problems. When the interviewer asks about alternatives or the problem involves many stateful entities, mention actors. The key insight: actors eliminate shared state by design — each actor owns its data exclusively and processes messages sequentially.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "Why busy-waiting is harmful",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is busy-waiting (spinning in a tight loop checking for work) a disastrous approach for worker threads in a producer-consumer system?",
        explanation:
          "Busy-waiting consumes 100% CPU on each worker thread even when no work is available. With 8 workers on an 8-core machine, all CPU capacity is burned just checking an empty queue — leaving no resources to actually process tasks when they arrive. The CPU waste is the primary problem, not memory, context switches, or lock contention.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Each worker burns CPU in a tight loop, leaving no compute capacity to process tasks when they arrive",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It causes excessive memory allocation from repeated queue checks",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It forces the OS to create too many context switches between threads",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It leads to lock contention because all workers try to acquire the queue lock simultaneously",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Blocking queue default for producer-consumer",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In an interview, what is the recommended default coordination mechanism for a simple producer-consumer problem (e.g., API handler enqueuing background emails)?",
        explanation:
          "A bounded blocking queue is the standard answer for producer-consumer problems. It provides thread-safe put/take operations, efficient waiting (no CPU waste), and built-in backpressure through bounded capacity. Condition variables are the underlying mechanism but too low-level to use directly. Actors add unnecessary abstraction for simple task handoff. Polling loops are anti-patterns.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A bounded blocking queue with put() for producers and take() for consumers",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A condition variable with manual lock management around a shared list",
              isCorrect: false,
            },
            {
              id: "c",
              text: "An actor system where each email is processed by its own actor",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A sleep-polling loop with a short sleep interval (10ms)",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Why the while loop around wait() is essential",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When using condition variables, why must the wait() call be placed inside a while loop that rechecks the condition?",
        explanation:
          "Between notification and lock reacquisition, another thread may have already consumed the resource. The JVM can also wake threads spuriously. The while loop ensures the thread re-verifies the condition is still true before proceeding. An if-check would let the thread proceed on stale state. The issue is not about multiple notifications or deadlocks — it is about another thread acting on the shared state before the woken thread reacquires the lock.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Another thread may consume the resource between notification and lock reacquisition, and spurious wakeups can occur",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The wait() call may return before the lock is released, so you need to retry",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Multiple notifications can queue up, requiring the loop to drain them all",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The while loop prevents deadlocks that would occur with a single if-check",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Unbounded queue danger",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A developer creates a task queue without specifying a maximum capacity. During a traffic spike, 50,000 tasks are enqueued in 500ms while workers process only 100/second. What is the most likely failure mode?",
        explanation:
          'An unbounded queue accepts every task, growing the heap until the JVM runs out of memory and throws OutOfMemoryError, crashing the entire service — not just background processing, but the API as well. The queue does not "slow down" or "drop tasks" on its own. Deadlock is unrelated to queue capacity. CPU is not the bottleneck here — memory is, because every queued task is a heap object.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "OutOfMemoryError — every queued task consumes heap memory, and the unbounded queue grows until the entire service crashes",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The queue automatically starts dropping tasks once memory pressure is detected",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Deadlock — producers and consumers compete for the same lock and block each other",
              isCorrect: false,
            },
            {
              id: "d",
              text: "CPU exhaustion — the workers spin faster trying to drain the growing queue",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Notify vs notify_all tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A system uses a single condition variable shared between producers (waiting for space) and consumers (waiting for items). A consumer finishes processing and calls notify() instead of notify_all(). What can go wrong?",
        explanation:
          'With a single condition variable shared by both producers and consumers, notify() wakes an arbitrary waiter. It might wake another consumer (who needs items, not space) instead of a producer (who needs space). That consumer sees an empty queue and goes back to sleep. The producer who actually needs the signal stays asleep. The result is a livelock-like situation where no progress is made despite available resources. The fix: use separate condition variables for "not empty" and "not full".',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "notify() may wake a consumer instead of a producer — the consumer sees an empty queue and re-sleeps, while producers with pending work stay blocked",
              isCorrect: true,
            },
            {
              id: "b",
              text: "notify() always wakes the oldest waiting thread, which will always be a producer",
              isCorrect: false,
            },
            {
              id: "c",
              text: "notify() causes a deadlock because the notifying thread still holds the lock",
              isCorrect: false,
            },
            {
              id: "d",
              text: "notify() is always correct — notify_all() is only needed for performance optimization",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Choosing offer(timeout) vs put()",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "An API endpoint handles user purchases. It enqueues a fulfillment task to a bounded blocking queue. Should the API handler use put() (block until space) or offer(timeout) (return false if full within timeout)?",
        explanation:
          'On a request path where a user is waiting for a response, you cannot block indefinitely — the user would see a frozen request or timeout. offer(timeout) allows you to wait briefly, then return a 503 "Service Unavailable" with "try again later" if the queue is full. put() is appropriate for internal pipelines where slowing producers is acceptable (batch jobs, data pipelines). The distinction is whether the caller can tolerate being blocked.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "offer(timeout) — blocking the API thread indefinitely is unacceptable; return 503 if the queue is full",
              isCorrect: true,
            },
            {
              id: "b",
              text: "put() — backpressure should propagate to the user so they stop sending requests",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Neither — bypass the queue and process the task inline on the request thread",
              isCorrect: false,
            },
            {
              id: "d",
              text: "put() with a global rate limiter to prevent the queue from ever filling up",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Actor model synchronization boundary",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "The actor model claims to eliminate the need for locks. Where does synchronization actually occur in an actor-based system, and why does the claim hold within business logic?",
        explanation:
          "Synchronization is centralized at the mailbox boundary — the BlockingQueue used as the mailbox internally uses locks to handle concurrent send() calls from multiple threads. However, within the actor's on_receive() handler, no synchronization is needed because the actor processes exactly one message at a time. The actor's internal state is accessed sequentially. This means business logic inside the actor is lock-free — synchronization is pushed to a single, well-tested boundary (the queue implementation) rather than scattered throughout application code.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Synchronization occurs at the mailbox (queue) boundary, which uses locks internally — but on_receive() is lock-free because the actor processes one message at a time",
              isCorrect: true,
            },
            {
              id: "b",
              text: "There is truly no synchronization — the OS scheduler ensures actors never run concurrently",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Each actor uses an internal ReentrantLock that is acquired before on_receive() and released after",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Message passing uses copy-on-write semantics, so no shared memory exists at any level",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "InterruptedException handling in blocking queues",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A worker thread is blocked on take() when another thread calls interrupt() on it. The worker catches InterruptedException. What is the correct way to handle it, and what is the worst thing the worker could do?",
        explanation:
          "The worst response is to swallow the exception (catch and ignore it). This destroys the interrupt signal — code further up the call stack never knows the thread was interrupted, preventing graceful shutdown. The correct approach is either to let the exception propagate (declare throws InterruptedException) or, if you must catch it, restore the interrupt status by calling Thread.currentThread().interrupt() so the signal is preserved. Retrying take() in a loop would fight the shutdown attempt. Calling System.exit() is too aggressive — other threads may need to clean up.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Let the exception propagate or restore interrupt status with Thread.currentThread().interrupt(). Never catch and ignore it — that swallows the shutdown signal.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Catch the exception and retry take() — the interrupt was likely a transient OS signal",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Catch the exception and call System.exit(1) to shut down the entire JVM immediately",
              isCorrect: false,
            },
            {
              id: "d",
              text: "InterruptedException only occurs due to bugs — it is safe to catch and log it without further action",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Properties of a blocking queue",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL properties that a bounded blocking queue provides out of the box:",
        explanation:
          "A bounded blocking queue provides: (1) thread-safe concurrent access — multiple producers/consumers can operate safely, (2) backpressure — put() blocks when full, preventing memory exhaustion, (3) efficient waiting — take() blocks with zero CPU usage when empty, waking immediately on item arrival. It does NOT provide task priority ordering — that requires a PriorityBlockingQueue, which is a different data structure.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Thread-safe concurrent access for multiple producers and consumers",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Backpressure — producers block when the queue is full",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Efficient waiting — consumers sleep with zero CPU usage when the queue is empty",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Automatic task priority ordering based on urgency",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid graceful shutdown strategies",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid strategies for gracefully shutting down worker threads that are blocked on a blocking queue's take() method:",
        explanation:
          "Three strategies work: (1) Interrupt the thread — take() throws InterruptedException, the worker catches it and exits. (2) Use poll(timeout) instead of take() — the worker periodically checks a shutdown flag. (3) Poison pill — submit a special sentinel task per worker that signals it to exit. Calling Thread.stop() is deprecated and unsafe — it can leave shared state in an inconsistent state because it forcefully terminates the thread without giving it a chance to release locks or clean up resources.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Interrupt the thread — take() throws InterruptedException and the worker exits its loop",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Use poll(timeout) and check a shutdown flag after each timeout",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Submit a poison pill (sentinel task) per worker — each worker exits when it processes the sentinel",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Call Thread.stop() on each worker to terminate it immediately",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "When actors are appropriate",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL scenarios where the actor model is a better fit than a simple blocking queue with a worker pool:",
        explanation:
          "Actors excel when you have many independent stateful entities that communicate: (1) a chat system with per-user session state, (2) a game server with per-room game state, (3) a trading system with per-instrument order books. Each entity processes its own events sequentially. A batch image resizer, however, is a straightforward producer-consumer problem with no per-entity state — a blocking queue with a worker pool is simpler and more appropriate.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "A chat system where each user session maintains its own connection state and message history",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A game server where each game room tracks its own board state and player turns",
              isCorrect: true,
            },
            {
              id: "c",
              text: "A trading platform where each stock has its own order book processing buy/sell events",
              isCorrect: true,
            },
            {
              id: "d",
              text: "A batch image resizer that pulls upload tasks from a queue and writes results to S3",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Actor model challenges in production",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content: "Select ALL genuine challenges when using the actor model in a production system:",
        explanation:
          "Real actor model challenges: (1) Mailbox overflow — if producers are faster than the actor, the mailbox grows unboundedly unless configured with limits. (2) Cross-sender message ordering is undefined — messages from A→B arrive in order, but interleaving of messages from A and C to B is non-deterministic. (3) Debugging is harder — tracing a request through multiple actors is more complex than a single call stack. Race conditions on an actor's internal state are NOT a challenge — the single-threaded processing model eliminates this by design.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Mailbox overflow when producers send messages faster than the actor can process them",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Undefined message ordering when multiple senders send to the same actor concurrently",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Difficulty tracing and debugging request flows that span multiple actors",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Race conditions on the actor's internal state due to concurrent on_receive() execution",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Design a background email service using coordination",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Design a background email service for a user signup flow. The current implementation sends the welcome email inline during the signup API call, causing 500ms latency. Explain your coordination approach, the data structures involved, how workers process tasks, and how you handle the case where the email service is temporarily down.",
        explanation:
          "A strong answer describes: (1) a bounded BlockingQueue between the API handler and worker threads, (2) the API handler enqueuing an EmailTask and returning immediately, (3) a pool of worker threads calling take() in a loop, (4) retry logic or dead-letter queue for failed sends, (5) queue capacity sizing rationale.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "I would decouple the email sending from the signup path using a bounded blocking queue.\n\nArchitecture:\n- API handler (producer): saves the user to the database, creates an EmailTask object (recipient, template, data), calls queue.put(task), and returns HTTP 201 immediately. Total latency: ~10ms instead of 500ms.\n- Worker pool (consumers): N worker threads each run a loop calling queue.get() (blocks if empty), then call the email client to send the email.\n- Queue: bounded BlockingQueue with capacity sized for burst tolerance. If normal signup rate is 10/sec and we want to handle a 30-second marketing spike at 100/sec, capacity should be ~2,700 (burst surplus = (100-10) × 30).\n\nHandling email service outages:\n- Wrap the email send in a retry loop with exponential backoff (e.g., 3 attempts with 1s, 5s, 25s delays).\n- After max retries, move the task to a dead-letter queue for manual inspection or later reprocessing.\n- Do NOT re-enqueue failed tasks to the main queue — this risks infinite retry loops that starve normal tasks.\n\nGraceful shutdown: use the poison pill pattern — submit one sentinel task per worker. Each worker exits when it processes the sentinel, ensuring in-flight emails complete before shutdown.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Compare shared state and message passing coordination",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare shared state coordination (blocking queues) and message passing coordination (actor model). For each approach, explain the mental model, where synchronization occurs, and give one concrete system where that approach is the better fit. What is the decision rule for choosing between them?",
        explanation:
          "A strong answer covers: (1) blocking queue mental model — shared data + synchronization primitives, (2) actor mental model — private state + message passing, (3) where sync occurs in each (queue locks vs mailbox boundary), (4) concrete examples, (5) the decision rule: background tasks → queue, stateful entities → actors.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Shared State Coordination (Blocking Queue):\n- Mental model: Multiple threads share a data structure (the queue). Producers write to it, consumers read from it. The queue implementation handles all synchronization internally using locks and condition variables.\n- Synchronization: Happens inside the queue on every put() and take() call. Multiple workers may also need external synchronization if they access shared resources beyond the queue.\n- Best fit: An email service where API handlers enqueue tasks and a worker pool sends emails. No per-task state is maintained — workers are interchangeable and stateless.\n\nMessage Passing Coordination (Actor Model):\n- Mental model: Each entity owns its state privately. Communication is explicit — through messages. No thread ever accesses another entity\'s state directly.\n- Synchronization: Centralized at the mailbox boundary (the internal queue). Within the actor\'s message handler, no synchronization is needed because messages are processed sequentially.\n- Best fit: A chat system where each user session is an actor maintaining its own connection state, message history, and typing indicators. Each session processes events (incoming messages, disconnects, typing notifications) sequentially without locks.\n\nDecision rule: If the problem is "process these tasks in the background," use a blocking queue. If the problem is "coordinate many independent entities with their own state," consider actors. The key distinction is whether the processing units (workers/actors) need to maintain per-entity state.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design coordination for bursty ticket sales",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are designing a concert ticket sales system. Normal load is 100 requests/sec, but when popular tickets go on sale, you expect 10,000 requests/sec for the first 60 seconds. Your backend can sustainably process 500 purchases/sec. Design the coordination layer — explain queue sizing, what happens to excess requests during the spike, how you communicate status to users, and how you ensure the system recovers after the burst.",
        explanation:
          "Must address: (1) queue capacity calculation based on burst surplus, (2) offer(timeout) with 503 response for overflow, (3) user-facing status (queued confirmation, polling/webhooks for result), (4) post-burst drain time calculation, (5) why workers are NOT scaled to peak.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Queue sizing:\n- During the 60-second burst: incoming rate = 10,000/sec, processing rate = 500/sec, surplus = 9,500/sec.\n- Total surplus over 60 seconds: 9,500 × 60 = 570,000 tasks.\n- Set queue capacity to 600,000 (with headroom). Each PurchaseRequest is ~200 bytes, so total memory = 600K × 200B = 120MB — very manageable.\n\nHandling excess requests:\n- Use offer(request, timeout=200ms) on the API path. If the queue accepts it within 200ms, return HTTP 202 Accepted with a ticket_request_id for status polling.\n- If offer() times out (queue is full), return HTTP 503 Service Unavailable with Retry-After: 30 header. This is honest backpressure to the client.\n\nUser communication:\n- On successful enqueue: return 202 with { "status": "queued", "request_id": "abc123", "estimated_wait": "~2 minutes" }.\n- Provide a GET /purchase-status/{request_id} endpoint for polling. Workers update the status (queued → processing → confirmed/failed) in a fast store (Redis).\n- Optionally push status via WebSocket or SSE for real-time updates.\n\nPost-burst recovery:\n- After the spike ends (t=60s), the queue holds ~570K tasks. Workers drain at 500/sec, so drain time = 570,000 / 500 = 1,140 seconds ≈ 19 minutes.\n- During drain, new requests at normal rate (100/sec) are still accepted because workers process 500/sec — 400/sec surplus now drains the queue.\n- Net drain rate once normal traffic resumes: 500 - 100 = 400/sec. Adjusted drain time: 570,000 / 400 = 1,425 seconds ≈ 24 minutes.\n\nWhy not scale workers to 10K/sec? You would need 20x the infrastructure (database connections, payment gateway capacity) that sits idle 99.9% of the time. The queue-based approach handles the same spike with 20x less infrastructure cost.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Implement condition variables with separate signals",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Explain how you would implement a bounded buffer using condition variables with separate "not_empty" and "not_full" conditions. Walk through the put() and take() operations step by step, including lock acquisition, condition checking, waiting, signaling, and lock release. Why is this approach superior to using a single condition variable with notify_all()?',
        explanation:
          "Must cover: (1) two separate condition variables on the same lock, (2) put() acquires lock, waits on not_full while queue is full, adds item, signals not_empty, (3) take() acquires lock, waits on not_empty while queue is empty, removes item, signals not_full, (4) while-loop guard on both waits, (5) comparison with single CV + notify_all showing reduced wasted wakeups.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Bounded buffer with two condition variables:\n\nSetup:\n- One lock protecting the buffer\n- Condition not_empty = lock.newCondition()  // consumers wait here\n- Condition not_full = lock.newCondition()    // producers wait here\n- buffer = circular array of capacity N\n- count = 0 (current items)\n\nput(item):\n1. Acquire lock\n2. While count == N: not_full.wait()   // releases lock, sleeps until signaled\n3. buffer[writeIndex] = item; writeIndex = (writeIndex + 1) % N; count++\n4. not_empty.signal()                  // wake ONE consumer waiting for items\n5. Release lock\n\ntake():\n1. Acquire lock\n2. While count == 0: not_empty.wait()  // releases lock, sleeps until signaled\n3. item = buffer[readIndex]; readIndex = (readIndex + 1) % N; count--\n4. not_full.signal()                   // wake ONE producer waiting for space\n5. Release lock\n6. Return item\n\nCritical details:\n- Both waits use while loops (not if) to handle spurious wakeups and the race between notification and lock reacquisition.\n- signal() wakes exactly one thread, not all. Since each condition variable has only one type of waiter, the woken thread is always the right kind.\n\nWhy this beats single CV + notify_all():\n- With one CV, notify_all() wakes ALL waiters (both producers and consumers). If 50 threads are waiting and only one can proceed, 49 wake up, check the condition, and go back to sleep — wasting 49 context switches.\n- With separate CVs, signal() wakes exactly one thread of the correct type. A producer completing → signals not_full → wakes exactly one producer. Zero wasted wakeups.\n- The performance difference grows linearly with the number of waiting threads. At scale (hundreds of workers), separate CVs can be orders of magnitude more efficient.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Actor-based game server design",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a multiplayer game server using the actor model. Each game room has its own state (board, player turns, timers). Players send moves, and the server validates them, updates game state, and broadcasts results. Explain your actor hierarchy, how messages flow, how you handle a player disconnecting mid-game, and what challenges arise that would not exist with a blocking queue approach.",
        explanation:
          "Must cover: (1) actor hierarchy — GameRoomActor per room, possibly PlayerActor per connection, (2) message types (JoinGame, MakeMove, PlayerDisconnect), (3) sequential processing within each room eliminates race conditions on game state, (4) disconnect handling via timeout detection + message to room actor, (5) challenges unique to actors: cross-room communication ordering, debugging message flows, mailbox overflow during rapid moves.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Actor hierarchy:\n- GameManagerActor: singleton that creates/destroys rooms, routes players to rooms\n- GameRoomActor: one per active game. Owns all room state: board, player list, whose turn it is, game clock. Processes one message at a time — no locks needed on game state.\n- ConnectionActor (optional): one per WebSocket connection, translates network events into game messages\n\nMessage flow for a move:\n1. Player sends a move via WebSocket → ConnectionActor receives raw bytes\n2. ConnectionActor parses and sends MakeMove(playerId, move) to the GameRoomActor\n3. GameRoomActor validates the move (correct player's turn, legal move on current board)\n4. If valid: update board state, switch turn, send GameUpdate(newState) to all players' ConnectionActors\n5. If invalid: send MoveRejected(reason) back to the requesting ConnectionActor\n\nBecause GameRoomActor processes one message at a time, two simultaneous moves from different players are serialized — no race condition on whose turn it is.\n\nDisconnect handling:\n- ConnectionActor detects WebSocket close → sends PlayerDisconnected(playerId) to GameRoomActor\n- GameRoomActor starts a reconnection timer (e.g., 30 seconds). If the player reconnects within the window, resume. Otherwise, forfeit or pause the game.\n- The timer is just another message: schedule a TimeoutExpired message to self after 30 seconds.\n\nChallenges unique to actors vs blocking queue:\n1. Cross-room communication: tournament brackets, global leaderboards, or spectating require messages between room actors. Ordering across actors is non-deterministic — a leaderboard update might arrive before the game result it is based on.\n2. Debugging: a bug in move validation requires tracing messages across Connection → Room → back to Connection. No single call stack to step through.\n3. Mailbox overflow: a room with rapid-fire moves (speed chess) could overwhelm the room actor. Need to configure mailbox limits and drop/reject excess messages.\n4. Request-response: asking \"what rooms are available?\" requires an ask pattern (send query, wait for response message) rather than a simple function call.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Queue capacity sizing and backpressure strategy",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are designing a webhook processing system that normally receives 200 events/sec but can spike to 5,000 events/sec for up to 30 seconds when a flash sale triggers on a partner's platform. Your workers process 300 events/sec sustainably. Derive the queue capacity, explain your backpressure strategy, and discuss the tradeoffs of three different approaches when the queue is full: blocking, timeout-and-reject, and drop-and-log.",
        explanation:
          "Must include: (1) queue capacity math — surplus = (5000-300) × 30 = 141,000 tasks, (2) memory estimation, (3) analysis of three full-queue strategies with their tradeoffs, (4) which strategy fits this webhook use case.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Queue capacity derivation:\n- Normal load: 200 events/sec. Processing capacity: 300 events/sec. Under normal load, queue stays empty (300 > 200).\n- During spike: 5,000 events/sec for 30 seconds. Net surplus per second: 5,000 - 300 = 4,700.\n- Total surplus over 30 seconds: 4,700 × 30 = 141,000 events.\n- With 20% headroom: queue capacity = ~170,000.\n- Memory: assuming 500 bytes per webhook event, 170K × 500B = 85MB — trivial.\n\nPost-spike drain time: 141,000 events / (300 - 200) = 1,410 seconds ≈ 23.5 minutes (assuming normal traffic resumes immediately). This is the latency users see for events received at the end of the spike.\n\nThree full-queue strategies:\n\n1. Block with put():\n- Producer thread blocks until space frees up.\n- Pro: no data loss. Every webhook is eventually processed.\n- Con: the webhook sender's HTTP request hangs. Most webhook senders have a 30-second timeout — if your queue blocks longer, they will timeout and retry, potentially causing duplicates. Not suitable for webhook ingestion.\n\n2. Timeout-and-reject with offer(timeout):\n- Wait briefly (e.g., 100ms). If no space, return HTTP 503 to the webhook sender.\n- Pro: the sender knows delivery failed and can retry with its own backoff logic. Most webhook systems have built-in retry with exponential backoff.\n- Con: events are temporarily \"lost\" from your perspective until the sender retries. You depend on the sender's retry reliability.\n- Best for webhooks: this is the standard approach. Webhook senders expect 503s and will retry.\n\n3. Drop-and-log with offer() (no timeout):\n- Immediately reject if full. Log the dropped event for auditing.\n- Pro: zero latency impact on the ingestion endpoint. Simplest to implement.\n- Con: permanent data loss unless you have a secondary mechanism to recover. If the webhook sender does not retry, the event is gone forever.\n- Best for lossy workloads (analytics, telemetry) where individual event loss is acceptable.\n\nRecommendation for this system: offer(timeout=100ms) with HTTP 503 response. Webhook senders universally implement retry-with-backoff. This gives us backpressure without data loss, because the sender handles retries. Log all 503 responses for monitoring so we can detect if spikes exceed our queue capacity.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Sleep-polling tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In a sleep-polling approach, the worker sleeps for 100ms between checks. What specific tradeoff does this create compared to busy-waiting, and what is the maximum added latency for a task that arrives just after the worker goes to sleep?",
        explanation:
          "Sleep-polling reduces CPU usage compared to busy-waiting but introduces latency. A task arriving 1ms after the worker sleeps waits up to ~99ms before being picked up. The maximum added latency equals the sleep interval minus 1ms, so approximately 100ms. You are trading CPU waste for processing latency — neither extreme is acceptable, which is why condition variables are the correct solution.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Trades CPU waste for latency. Maximum added latency is ~100ms (the sleep interval). A task arriving right after sleep starts waits the full interval.",
          acceptableAnswers: ["100ms", "~100ms", "latency", "sleep interval"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Poison pill pattern purpose",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'What is the "poison pill" pattern in the context of blocking queues, and how many poison pills must you submit for a pool of N workers?',
        explanation:
          "A poison pill is a special sentinel task that tells a worker to shut down. When the worker dequeues the sentinel, it exits its processing loop instead of processing a real task. You need exactly N poison pills — one per worker — because each worker takes exactly one item from the queue and must encounter its own poison pill to exit.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "A sentinel task that signals a worker to exit its loop. Submit N poison pills for N workers — each worker consumes one and shuts down.",
          acceptableAnswers: ["sentinel", "N", "one per worker", "shutdown signal"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Actor model mailbox ordering guarantee",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In the actor model, what ordering guarantee exists for messages, and what ordering is NOT guaranteed? Explain why this matters for systems that depend on global event ordering.",
        explanation:
          "Messages from actor A to actor B arrive in the order they were sent (per-sender FIFO). However, if actors A and C both send messages to actor B, the interleaving of A's and C's messages is undefined. This means global ordering across senders is not guaranteed. Systems requiring total ordering (e.g., an event log where every event must be processed in global timestamp order) cannot rely on actors alone — they need an external ordering mechanism like a Kafka topic with a single partition.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Per-sender FIFO is guaranteed (A→B messages arrive in order). Cross-sender ordering is NOT guaranteed (interleaving of A→B and C→B is undefined). Systems needing global ordering need an external mechanism.",
          acceptableAnswers: [
            "per-sender FIFO",
            "FIFO per sender",
            "cross-sender undefined",
            "interleaving",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Why actors eliminate locks in business logic",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Explain in one or two sentences why an actor's on_receive() method never needs locks to protect the actor's internal state, even though multiple external threads may be sending messages to it concurrently.",
        explanation:
          "The actor processes exactly one message at a time. The mailbox (a blocking queue) serializes all incoming messages into a single-threaded processing loop. Even though many threads call send() concurrently (which is thread-safe via the queue), the actor's internal state is only ever accessed by the single thread running on_receive(). This eliminates the need for locks within business logic — synchronization is pushed to the mailbox boundary.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "The actor processes one message at a time on a single thread, so on_receive() is never called concurrently. The mailbox serializes concurrent sends into sequential processing, pushing synchronization to the queue boundary.",
          acceptableAnswers: [
            "one message at a time",
            "single-threaded",
            "sequential processing",
            "mailbox serializes",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match coordination anti-patterns to their problems",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each coordination approach to the problem it causes:",
        explanation:
          "Busy-waiting burns CPU by spinning in a tight loop checking for work. Sleep-polling adds latency because tasks arriving during sleep wait for the interval to expire. An unbounded queue risks memory exhaustion when producers outpace consumers. A single shared condition variable with notify() risks waking the wrong thread type, causing stalled progress.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Busy-waiting (tight loop check)",
              right: "Burns 100% CPU on idle workers, leaving no compute for actual tasks",
            },
            {
              id: "p2",
              left: "Sleep-polling (sleep between checks)",
              right: "Adds up to the sleep interval in latency for arriving tasks",
            },
            {
              id: "p3",
              left: "Unbounded queue",
              right: "Memory exhaustion and OutOfMemoryError under sustained load",
            },
            {
              id: "p4",
              left: "Single condition variable with notify()",
              right: "May wake the wrong thread type, causing stalled progress",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match full-queue strategies to use cases",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each full-queue handling strategy to its most appropriate use case:",
        explanation:
          "put() (block indefinitely) suits internal pipelines like batch ETL where slowing the producer is acceptable. offer(timeout) suits API request paths where blocking the user is unacceptable — return 503 after timeout. offer() (immediate return) suits lossy workloads like analytics events where dropping under load is acceptable. poll(timeout) on the consumer side is used for graceful shutdown — it allows periodic checks of a shutdown flag.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "put() — block indefinitely",
              right: "Internal batch pipeline where slowing the producer is acceptable",
            },
            {
              id: "p2",
              left: "offer(timeout) — wait briefly, then reject",
              right: "API request path where the user cannot be blocked",
            },
            {
              id: "p3",
              left: "offer() — immediate return, no wait",
              right: "Analytics events where dropping under load is acceptable",
            },
            {
              id: "p4",
              left: "poll(timeout) — consumer-side timeout",
              right: "Worker shutdown — periodically check a stop flag between poll attempts",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match coordination patterns to system characteristics",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each coordination pattern to the system characteristic that makes it the right choice:",
        explanation:
          "A bounded blocking queue is the right tool for simple task handoff between producers and consumers. The actor model fits systems with many independent stateful entities that communicate via messages. Separate condition variables (not_empty/not_full) are needed when producers and consumers share a lock but need targeted wake-up signaling. The poison pill pattern is best for systems where interrupt-based shutdown is not possible or where workers should finish their current task before stopping.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Bounded BlockingQueue + worker pool",
              right: "Stateless background task processing (emails, image resize, reports)",
            },
            {
              id: "p2",
              left: "Actor model with per-entity actors",
              right: "Many independent entities each maintaining their own mutable state",
            },
            {
              id: "p3",
              left: "Separate not_empty/not_full condition variables",
              right: "Single lock shared by producers and consumers needing targeted wake signals",
            },
            {
              id: "p4",
              left: "Poison pill shutdown pattern",
              right:
                "Workers that must complete current task before stopping and cannot be interrupted",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Three coordination requirements",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Thread coordination must solve three problems: _____ waiting (consumers sleep when idle), _____ (producers slow down when consumers cannot keep up), and thread _____ (no corruption from concurrent access).",
        explanation:
          "The three requirements are: (1) Efficient waiting — consumers should consume zero CPU when idle and wake immediately when work arrives. (2) Backpressure — producers must slow down to prevent memory exhaustion from unbounded queue growth. (3) Thread safety — the coordination mechanism must handle concurrent access without corrupting shared state.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Thread coordination must solve three problems: {{blank1}} waiting (consumers sleep when idle), {{blank2}} (producers slow down when consumers cannot keep up), and thread {{blank3}} (no corruption from concurrent access).",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "efficient",
              acceptableAnswers: ["efficient", "Efficient"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "backpressure",
              acceptableAnswers: ["backpressure", "back-pressure", "back pressure"],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "safety",
              acceptableAnswers: ["safety", "safe"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Actor model three properties",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "An actor has three properties: it has a _____ (a queue of incoming messages), it processes messages _____ at a time, and it can send messages to other _____.",
        explanation:
          "An actor has: (1) a mailbox — a queue that holds incoming messages until the actor is ready to process them. (2) It processes messages one at a time — this single-threaded processing is what eliminates the need for locks on internal state. (3) It can send messages to other actors — this is how actors communicate, replacing shared state with explicit message passing.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "An actor has three properties: it has a {{blank1}} (a queue of incoming messages), it processes messages {{blank2}} at a time, and it can send messages to other {{blank3}}.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "mailbox",
              acceptableAnswers: ["mailbox", "inbox", "message queue"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "one",
              acceptableAnswers: ["one", "1", "one message"],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "actors",
              acceptableAnswers: ["actors", "actor"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Condition variable wait behavior",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "When a thread calls wait() on a condition variable, two things happen atomically: the thread _____ the lock and goes to _____. When another thread calls notify(), the waiting thread must _____ the lock before it can resume execution.",
        explanation:
          "The wait() operation atomically: (1) releases the lock — so other threads can acquire it and modify shared state. (2) Puts the thread to sleep — it consumes zero CPU until explicitly notified. When notified, the thread must reacquire the lock before continuing. This is why the while-loop recheck is essential — between notification and lock reacquisition, another thread may have changed the state.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "When a thread calls wait() on a condition variable, two things happen atomically: the thread {{blank1}} the lock and goes to {{blank2}}. When another thread calls notify(), the waiting thread must {{blank3}} the lock before it can resume execution.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "releases",
              acceptableAnswers: ["releases", "drops", "gives up", "unlocks"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "sleep",
              acceptableAnswers: ["sleep", "a sleep state", "sleep state", "blocked"],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "reacquire",
              acceptableAnswers: ["reacquire", "re-acquire", "acquire", "obtain", "get"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
