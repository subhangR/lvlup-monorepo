/**
 * Concurrency — Correctness — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: race conditions, coarse-grained locking, fine-grained locking,
 * atomic variables, thread confinement, check-then-act, read-modify-write
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldConcurrencyCorrectnessContent: StoryPointSeed = {
  title: "Concurrency — Correctness",
  description:
    "Learn how to prevent data corruption when multiple threads access shared state. Covers locking strategies, atomic operations, thread confinement, and the two critical bug patterns — check-then-act and read-modify-write.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: The Correctness Problem & Coarse-Grained Locking
    {
      title: "Correctness Problems & Coarse-Grained Locking",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Correctness Problems & Coarse-Grained Locking",
          blocks: [
            {
              id: "a1",
              type: "heading",
              content: "What Is a Correctness Problem?",
              metadata: { level: 2 },
            },
            {
              id: "a2",
              type: "paragraph",
              content:
                "Correctness is about preventing data corruption when multiple threads access shared state. Two threads book the same seat. A counter that should be 1000 reads 847. A bank balance goes missing deposits. The danger is not deadlock or performance — it is silently producing wrong results.",
            },
            {
              id: "a3",
              type: "heading",
              content: "The Ticket Booking Example",
              metadata: { level: 3 },
            },
            {
              id: "a4",
              type: "paragraph",
              content:
                'Alice wants seat 7A. Bob also wants seat 7A. In a correct system, one gets the seat and the other gets an error. But in a concurrent environment, both check availability before either completes their booking, both see the seat as available, and both proceed to book it. Bob\'s write overwrites Alice\'s. This is a race condition — the check ("is the seat available?") and the action ("book it") happened as two separate steps, and another thread snuck in between them.',
            },
            {
              id: "a5",
              type: "paragraph",
              content:
                "This pattern appears throughout LLD interviews: rate limiters checking if under the limit before allowing a request, connection pools checking if a connection is free, caches checking if there is room. Whenever the validity of a check can change before you act on it, you have a correctness problem.",
            },
            {
              id: "a6",
              type: "heading",
              content: "Coarse-Grained Locking",
              metadata: { level: 2 },
            },
            {
              id: "a7",
              type: "paragraph",
              content:
                "A lock ensures that when one thread acquires it, every other thread trying to acquire the same lock must wait. Coarse-grained locking uses a single lock to guard all operations on shared state. The check and the update happen together inside a critical section with no possibility of interleaving.",
            },
            {
              id: "a8",
              type: "code",
              content:
                "import threading\n\nclass TicketBooking:\n    def __init__(self):\n        self._lock = threading.Lock()\n        self._seat_owners = {}\n\n    def book_seat(self, seat_id: str, visitor_id: str) -> bool:\n        with self._lock:\n            if seat_id in self._seat_owners:\n                return False\n            self._seat_owners[seat_id] = visitor_id\n            return True",
              metadata: { language: "python" },
            },
            {
              id: "a9",
              type: "heading",
              content: "Common Mistakes with Coarse-Grained Locking",
              metadata: { level: 3 },
            },
            {
              id: "a10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Releasing the lock too early: Locking only the check, releasing, then doing the update outside the lock completely breaks atomicity.",
                  "Using different lock objects: Two separate locks for the check and update means no actual coordination — threads can hold them simultaneously.",
                  "Rule: All operations that maintain an invariant must be protected by the SAME lock. If you hold the lock during the check, you must still hold it during the update.",
                ],
              },
            },
            {
              id: "a11",
              type: "heading",
              content: "When to Use Coarse-Grained Locking",
              metadata: { level: 3 },
            },
            {
              id: "a12",
              type: "paragraph",
              content:
                "Coarse-grained locking is the right choice when the critical section is short (milliseconds, not seconds) and contention is moderate. For most interview problems — ticket booking, parking lots, rate limiters — where a human triggers the operation, this is the right answer. The tradeoff is throughput: with a single lock, Bob waits even when booking a different seat than Alice.",
            },
            {
              id: "a13",
              type: "heading",
              content: "Read-Write Locks",
              metadata: { level: 3 },
            },
            {
              id: "a14",
              type: "paragraph",
              content:
                "A read-write lock (shared-exclusive lock) has two modes: read (shared) and write (exclusive). Multiple threads can hold the read lock simultaneously since they cannot corrupt each other's view. But the write lock is exclusive — when a writer wants to write, it waits for all readers to finish. This shines when reads vastly outnumber writes (e.g., a cache queried thousands of times per second but updated once a minute). If reads and writes are roughly 50/50, a simple mutex is usually faster.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Fine-Grained Locking, Atomics & Thread Confinement
    {
      title: "Fine-Grained Locking, Atomics & Thread Confinement",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Fine-Grained Locking, Atomics & Thread Confinement",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Fine-Grained Locking",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Fine-grained locking uses multiple locks, each protecting a smaller piece of state. Instead of one lock for the entire venue, you have one lock per seat. Threads only block each other when competing for the same resource. Alice booking seat 7A and Bob booking seat 12B proceed simultaneously.",
            },
            {
              id: "b3",
              type: "code",
              content:
                "class TicketBookingFineGrained:\n    def __init__(self):\n        self._locks_lock = threading.Lock()\n        self._seat_locks = {}\n        self._seat_owners = {}\n\n    def _get_lock(self, seat_id: str) -> threading.Lock:\n        with self._locks_lock:\n            if seat_id not in self._seat_locks:\n                self._seat_locks[seat_id] = threading.Lock()\n            return self._seat_locks[seat_id]\n\n    def book_seat(self, seat_id: str, visitor_id: str) -> bool:\n        with self._get_lock(seat_id):\n            if seat_id in self._seat_owners:\n                return False\n            self._seat_owners[seat_id] = visitor_id\n            return True",
              metadata: { language: "python" },
            },
            {
              id: "b4",
              type: "heading",
              content: "Deadlock Risk with Fine-Grained Locking",
              metadata: { level: 3 },
            },
            {
              id: "b5",
              type: "paragraph",
              content:
                'When swapping seats, you need to lock both seats atomically. If Alice swaps 7A↔12B while Bob swaps 12B↔7A, Alice locks 7A and waits for 12B, Bob locks 12B and waits for 7A — deadlock. The fix: always acquire locks in a consistent order (e.g., alphabetical by seat ID). Both threads try to lock the "smaller" seat ID first, so one gets it and the other waits.',
            },
            {
              id: "b6",
              type: "heading",
              content: "When to Use Fine-Grained Locking",
              metadata: { level: 3 },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "If a human triggers the operation, coarse-grained locking is almost always fine. Fine-grained locking matters for machine-generated traffic at scale — connection pools handling thousands of queries/second, caches serving tens of thousands of requests/second. The extra throughput comes at a cost of complexity: dynamic lock creation, potential deadlocks, and harder reasoning about which lock guards which data.",
            },
            {
              id: "b8",
              type: "heading",
              content: "Atomic Variables",
              metadata: { level: 2 },
            },
            {
              id: "b9",
              type: "paragraph",
              content:
                'Atomic variables use special CPU instructions (compare-and-swap / CAS) to perform read-modify-write in a single uninterruptible step without a lock. CAS says "set this variable to the new value, but only if it currently equals the expected value." If another thread changed the value, CAS fails and you retry. This is called optimistic concurrency — you optimistically assume no interference and only retry on conflict.',
            },
            {
              id: "b10",
              type: "heading",
              content: "Limitation of Atomics",
              metadata: { level: 3 },
            },
            {
              id: "b11",
              type: "paragraph",
              content:
                "Atomics only work for single variables. You cannot atomically update two separate atomic references (e.g., booking two adjacent seats). The moment your correctness depends on multiple variables staying in sync, atomics cannot help and you must fall back to locks. Rule of thumb: atomics are great for statistics (counters, flags). For business rules, use locks.",
            },
            {
              id: "b12",
              type: "heading",
              content: "Thread Confinement (Shared Nothing)",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "The simplest way to avoid synchronization bugs is to avoid sharing data between threads entirely. Partition data so each thread owns its slice — Thread 1 handles sections A-M, Thread 2 handles N-Z. No sharing means no locks needed. Examples include Dragonfly (Redis alternative) partitioning keyspace across threads, actor systems like Akka confining state to individual actors, and database connection pools giving each thread its own connection.",
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                "The tradeoff: operations spanning multiple partitions still require coordination, load imbalance can emerge, and confinement must be strictly enforced — accidentally accessing another partition reintroduces all race conditions. For most LLD interviews, thread confinement is overkill, but worth mentioning when the interviewer pushes on scalability.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Common Bug Patterns — Check-Then-Act & Read-Modify-Write
    {
      title: "Common Bug Patterns — Check-Then-Act & Read-Modify-Write",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Common Bug Patterns — Check-Then-Act & Read-Modify-Write",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Check-Then-Act",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "You check a condition, make a decision, then act on it. The bug occurs when another thread invalidates the check between the read and the action. The seat booking problem is check-then-act: check if available, then book. Rate limiters (check count, then allow), connection pools (check if free, then hand out), and LRU caches (check size, then add) all follow this pattern.",
            },
            {
              id: "c3",
              type: "code",
              content:
                "# BROKEN: check and update not atomic\nclass RateLimiterBroken:\n    def allow_request(self, user_id: str) -> bool:\n        count = self._request_counts.get(user_id, 0)\n        if count < self._max_requests:\n            self._request_counts[user_id] = count + 1\n            return True\n        return False\n\n# FIXED: wrap check + action in same lock\nclass RateLimiter:\n    def allow_request(self, user_id: str) -> bool:\n        with self._lock:\n            count = self._request_counts.get(user_id, 0)\n            if count < self._max_requests:\n                self._request_counts[user_id] = count + 1\n                return True\n            return False",
              metadata: { language: "python" },
            },
            {
              id: "c4",
              type: "heading",
              content: "Check-Then-Act Examples in Interviews",
              metadata: { level: 3 },
            },
            {
              id: "c5",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Connection Pool: Two threads see connection #7 as free, both hand it out — two requests share one connection, corrupting queries.",
                  "LRU Cache: Two threads see size as 999, both add an item — cache exceeds its 1000-item limit.",
                  "File Download Manager: Two threads see a file is not downloading, both start downloads — wasted bandwidth and potential corruption.",
                  'Parking Lot: Two threads see spot #42 as empty, both assign their car to it — two cars "own" one spot.',
                ],
              },
            },
            {
              id: "c6",
              type: "heading",
              content: "Read-Modify-Write",
              metadata: { level: 2 },
            },
            {
              id: "c7",
              type: "paragraph",
              content:
                "Read-modify-write is simpler: you read a value, compute from it, and write back. No conditional branching — you always write. The bug: two threads read the same value, both compute from it, both write back, and one update is lost. The classic example is count++ — it is three operations (read, add, write) that can interleave. Two threads both read 5, both compute 6, both write 6. One increment is lost.",
            },
            {
              id: "c8",
              type: "code",
              content:
                "# BROKEN: += is not atomic\nclass RequestCounterBroken:\n    def on_request(self):\n        self._request_count += 1  # read, increment, write\n\n# FIXED: use a lock\nclass RequestCounter:\n    def on_request(self):\n        with self._lock:\n            self._request_count += 1",
              metadata: { language: "python" },
            },
            {
              id: "c9",
              type: "heading",
              content: "Read-Modify-Write Examples",
              metadata: { level: 3 },
            },
            {
              id: "c10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Hit Counter: Two requests read 1000, both write 1001 instead of 1002 — lost page views. Use an atomic increment.",
                  "Bank Account: Phone deposit ($50) and direct deposit ($500) both read $100. Phone writes $150, direct deposit writes $600. Final is $600 instead of $650 — $50 vanished.",
                  "Metrics Aggregator: Two responses read sum=5000, count=100. Both add their times. sum=5050 and count=101 instead of 5100 and 102.",
                  "Inventory System: Two buyers read quantity=1, both subtract 1, both write 0. You oversold — this combines check-then-act with read-modify-write.",
                ],
              },
            },
            {
              id: "c11",
              type: "heading",
              content: "Decision Tree",
              metadata: { level: 2 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                "When you spot shared mutable state: (1) Is it a single counter/flag? Use atomics. (2) Is human-triggered with moderate contention? Use coarse-grained locking. (3) Machine-generated traffic needing throughput? Use fine-grained locking. (4) Can you partition data so threads do not share? Use thread confinement. For most interview problems, you land on coarse-grained locking.",
            },
            {
              id: "c13",
              type: "quote",
              content:
                'When writing concurrent code, ask yourself: "What happens if two threads execute this at the exact same moment?" If the answer involves lost updates, double-booking, or corrupted state — wrap the dangerous section in a lock.',
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
      title: "Identifying the core concurrency correctness problem",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        points: 10,
        question:
          "Two users simultaneously try to book the same concert seat. Both check availability, both see the seat as free, and both complete the booking. What category of concurrency bug is this?",
        options: [
          {
            id: "a",
            text: "A race condition — specifically a check-then-act violation where the check result becomes stale before the action executes",
          },
          {
            id: "b",
            text: "A deadlock — both threads are waiting for resources held by the other",
          },
          { id: "c", text: "A livelock — both threads keep retrying but never succeed" },
          { id: "d", text: "A starvation problem — one thread monopolizes the resource" },
        ],
        correctOptionId: "a",
        explanation:
          'This is a race condition, specifically a check-then-act bug. The check ("is the seat available?") and the action ("book it") happen as two separate steps, and another thread invalidates the check between them. Deadlock involves circular lock dependencies. Livelock involves threads that actively retry without progress. Starvation means a thread never gets access to a resource it needs.',
      },
    },

    // MCQ 2 — easy
    {
      title: "Purpose of a critical section",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        points: 10,
        question:
          'In the context of coarse-grained locking, what does a "critical section" guarantee?',
        options: [
          {
            id: "a",
            text: "Only one thread can execute the code block at a time, preventing interleaving of check-and-update operations",
          },
          { id: "b", text: "The code block runs faster because the JVM optimizes locked regions" },
          { id: "c", text: "Multiple threads can read simultaneously but only one can write" },
          { id: "d", text: "The code block is retried automatically if it throws an exception" },
        ],
        correctOptionId: "a",
        explanation:
          "A critical section is a code block protected by a lock where only one thread can execute at a time. This prevents interleaving — no other thread can sneak in between a check and its corresponding update. Option C describes a read-write lock, not a basic critical section. Options B and D are incorrect — locks provide no performance optimization or automatic retry.",
      },
    },

    // MCQ 3 — easy
    {
      title: "Default locking strategy for interview problems",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        points: 10,
        question:
          'A parking lot system has at most one car entering every few seconds. Which locking strategy is most appropriate for protecting the "assign car to spot" operation?',
        options: [
          {
            id: "a",
            text: "Coarse-grained locking — contention is low enough that a single lock is simple and sufficient",
          },
          {
            id: "b",
            text: "Fine-grained locking with per-spot locks — needed to handle the throughput",
          },
          {
            id: "c",
            text: "Lock-free programming with CAS operations — avoids the overhead of mutexes",
          },
          {
            id: "d",
            text: "Thread confinement — partition spots across threads to avoid locks entirely",
          },
        ],
        correctOptionId: "a",
        explanation:
          "With human-triggered operations (a car every few seconds), contention is extremely low. Coarse-grained locking is simple, correct, and more than fast enough. Fine-grained locking adds complexity (deadlock risk, dynamic lock management) for no benefit at this contention level. Lock-free CAS cannot protect multi-step invariants. Thread confinement is architectural overkill for a parking lot.",
      },
    },

    // MCQ 4 — medium
    {
      title: "Broken locking pattern identification",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        points: 15,
        question:
          'Consider this code: the check "is seat available?" is performed inside lock A, and the update "mark seat booked" is performed inside lock B (a different lock object). Why is this broken?',
        options: [
          {
            id: "a",
            text: "Two different locks provide no coordination — threads can hold lock A and lock B simultaneously, so the check-then-act is not atomic",
          },
          { id: "b", text: "Using two locks always causes deadlock" },
          {
            id: "c",
            text: "Lock B will throw an exception because lock A is already held by the same thread",
          },
          {
            id: "d",
            text: "The second lock is redundant — only the first lock matters for thread safety",
          },
        ],
        correctOptionId: "a",
        explanation:
          "When two different lock objects protect the check and the update, they provide no mutual exclusion between those operations. Thread 1 can hold lock A (checking availability) while Thread 2 holds lock B (performing the update). The check and update are not atomic — another thread can interleave between them. This does not necessarily cause deadlock (option B), nor does holding one lock prevent acquiring a different lock (option C).",
      },
    },

    // MCQ 5 — medium
    {
      title: "When to choose fine-grained over coarse-grained locking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        points: 15,
        question:
          "A database connection pool serves 10,000 query requests per second. Each request needs to check out a connection, use it, and return it. Which locking strategy is most appropriate and why?",
        options: [
          {
            id: "a",
            text: "Fine-grained locking (per-connection locks) — machine-generated traffic at high throughput means coarse-grained locking becomes a bottleneck since operations on different connections do not conflict",
          },
          {
            id: "b",
            text: "Coarse-grained locking — simplicity outweighs throughput in all cases",
          },
          { id: "c", text: "No locking needed — connection pools are inherently thread-safe" },
          { id: "d", text: "Atomic variables — use CAS to atomically swap the connection status" },
        ],
        correctOptionId: "a",
        explanation:
          "At 10,000 QPS of machine-generated traffic, a single lock would serialize all connection checkout/return operations, creating a bottleneck. Per-connection locks allow concurrent checkouts of different connections while still protecting individual connection state. Coarse-grained locking (B) is fine for human-triggered operations but not at this scale. Connection pools are NOT inherently thread-safe (C). Atomics (D) cannot protect the multi-step check-then-act of verifying a connection is free and marking it in-use.",
      },
    },

    // MCQ 6 — medium
    {
      title: "Deadlock prevention in fine-grained locking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        points: 15,
        question:
          'Thread A needs to lock seat "7A" then seat "12B" for a swap. Thread B needs to lock seat "12B" then seat "7A" for the reverse swap. What technique prevents deadlock?',
        options: [
          {
            id: "a",
            text: 'Always acquire locks in a consistent global order (e.g., alphabetical by seat ID) so both threads lock "12B" before "7A"',
          },
          {
            id: "b",
            text: "Use tryLock with a timeout — if the second lock is not available, release the first and retry",
          },
          {
            id: "c",
            text: "Use a single coarse-grained lock instead of per-seat locks to eliminate the problem entirely",
          },
          { id: "d", text: "All of the above are valid deadlock prevention strategies" },
        ],
        correctOptionId: "d",
        explanation:
          'All three are valid approaches. (A) Consistent lock ordering is the classic solution — if both threads always lock the alphabetically smaller seat first, they cannot form a cycle. (B) TryLock with timeout breaks the "hold and wait" condition by releasing acquired locks on failure. (C) Falling back to a coarse-grained lock eliminates the multi-lock scenario entirely, at the cost of throughput. In interviews, consistent ordering is the most commonly expected answer, but all three are correct.',
      },
    },

    // MCQ 7 — hard
    {
      title: "Atomics limitation for multi-field invariants",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        points: 25,
        question:
          "A metrics aggregator tracks response times with two fields: totalSum and requestCount. A developer proposes using two separate AtomicLong variables instead of a lock. Why does this fail?",
        options: [
          {
            id: "a",
            text: "Atomic variables are per-variable — updating totalSum and requestCount are two independent atomic operations that can be observed in an inconsistent intermediate state by another thread reading between the two updates",
          },
          { id: "b", text: "AtomicLong does not support addition, only compare-and-swap" },
          { id: "c", text: "Atomic operations are slower than locks for numeric types" },
          {
            id: "d",
            text: "AtomicLong variables cannot be used with floating-point response times",
          },
        ],
        correctOptionId: "a",
        explanation:
          "Each AtomicLong update is individually atomic, but updating two AtomicLongs is NOT atomic as a pair. A reader thread could observe the new totalSum but the old requestCount (or vice versa), computing an incorrect average. Atomics only guarantee single-variable atomicity. When multiple fields must stay in sync (a multi-field invariant), you need a lock to make all updates appear as a single atomic operation. AtomicLong does support addAndGet (B is false), atomics are generally faster than locks (C is false), and the type issue (D) is irrelevant to the core problem.",
      },
    },

    // MCQ 8 — hard
    {
      title: "Read-write lock tradeoff analysis",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        points: 25,
        question:
          "A configuration store is read on every request (5,000 RPS) and updated once per minute. A developer replaces the mutex with a ReadWriteLock. Under what condition would this change HURT performance?",
        options: [
          {
            id: "a",
            text: "If the read-to-write ratio drops to near 1:1, the overhead of the ReadWriteLock (managing reader counts, upgrading/downgrading) makes it slower than a simple mutex",
          },
          { id: "b", text: "If the configuration store contains more than 1,000 keys" },
          { id: "c", text: "If readers hold the lock for more than 10 milliseconds each" },
          {
            id: "d",
            text: "ReadWriteLock never hurts performance — it is always at least as fast as a mutex",
          },
        ],
        correctOptionId: "a",
        explanation:
          "ReadWriteLocks have bookkeeping overhead — tracking active readers, coordinating read-to-write transitions, and handling writer starvation prevention. When reads vastly outnumber writes (like the 5,000:1 scenario), this overhead is amortized across many concurrent readers. But if the ratio drops to near 1:1, readers constantly compete with writers for the lock, and the extra bookkeeping makes it slower than a simple mutex. The number of keys (B) and read duration (C) do not affect the lock strategy choice in this way. Option D is demonstrably false.",
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Valid solutions for the check-then-act pattern",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        points: 10,
        question:
          "A rate limiter checks the current request count and increments it if under the limit. Select ALL valid approaches to make this thread-safe.",
        options: [
          {
            id: "a",
            text: "Wrap the check and increment in a single synchronized block (coarse-grained lock)",
          },
          {
            id: "b",
            text: "Use a per-user lock so different users do not block each other (fine-grained lock)",
          },
          { id: "c", text: "Lock only the check, release, then lock the increment separately" },
          {
            id: "d",
            text: "Assign each user to a dedicated thread that handles all their requests (thread confinement)",
          },
        ],
        correctOptionIds: ["a", "b", "d"],
        explanation:
          "Options A, B, and D are all valid. (A) Coarse-grained locking ensures the check and increment are atomic. (B) Fine-grained per-user locks allow concurrency across users while protecting per-user state. (D) Thread confinement eliminates sharing entirely. Option C is BROKEN — releasing the lock between the check and the increment allows another thread to sneak in and invalidate the check, which is the exact bug we are trying to prevent.",
      },
    },

    // MCAQ 2 — medium
    {
      title: "Scenarios where atomics are sufficient",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        points: 15,
        question:
          "Select ALL scenarios where an atomic variable (AtomicInteger / AtomicLong) is a sufficient synchronization mechanism, without needing a lock.",
        options: [
          { id: "a", text: "Incrementing a global page-view counter" },
          { id: "b", text: "Tracking whether a singleton has been initialized (boolean flag)" },
          { id: "c", text: "Booking a seat — checking availability and marking it booked" },
          { id: "d", text: "Updating a running average (totalSum and count must stay consistent)" },
          {
            id: "e",
            text: "Tracking the maximum concurrent connections ever observed (single max value)",
          },
        ],
        correctOptionIds: ["a", "b", "e"],
        explanation:
          "Atomics work for single-variable operations: (A) incrementing a counter is a single atomic add, (B) a boolean flag is a single CAS on one variable, (E) tracking a max is a CAS loop on one variable. Seat booking (C) requires checking one variable and updating another (or checking and conditionally setting a map entry) — a multi-step invariant that atomics cannot protect. Running average (D) requires updating two fields (sum and count) that must be consistent — two separate atomic updates can be observed in an inconsistent intermediate state.",
      },
    },

    // MCAQ 3 — medium
    {
      title: "Characteristics of fine-grained locking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        points: 15,
        question:
          "Select ALL true statements about fine-grained locking compared to coarse-grained locking.",
        options: [
          {
            id: "a",
            text: "It allows higher throughput because non-conflicting operations proceed in parallel",
          },
          {
            id: "b",
            text: "It introduces the risk of deadlock when multiple locks must be acquired simultaneously",
          },
          {
            id: "c",
            text: "It is simpler to reason about because each lock protects a smaller piece of state",
          },
          { id: "d", text: "It requires careful management of dynamic lock creation and cleanup" },
          {
            id: "e",
            text: "It is always faster than coarse-grained locking regardless of contention level",
          },
        ],
        correctOptionIds: ["a", "b", "d"],
        explanation:
          "Fine-grained locking allows higher throughput (A) since non-conflicting operations do not block each other. It introduces deadlock risk (B) when operations need multiple locks simultaneously (e.g., seat swaps). It requires managing lock lifecycle (D) — creating locks on demand and potentially cleaning up unused ones. It is NOT simpler to reason about (C) — tracking which lock guards which data is harder than having one lock for everything. It is NOT always faster (E) — under low contention, the overhead of managing many locks can make it slower than a single mutex.",
      },
    },

    // MCAQ 4 — hard
    {
      title: "Thread confinement real-world applications",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        points: 25,
        question:
          "Thread confinement (shared-nothing architecture) eliminates synchronization by ensuring each piece of data is owned by exactly one thread. Select ALL systems or patterns that use this approach.",
        options: [
          {
            id: "a",
            text: "Dragonfly (Redis alternative) partitioning the keyspace across threads",
          },
          { id: "b", text: "Java ConcurrentHashMap with striped locking" },
          { id: "c", text: "Akka actor systems confining state to individual actors" },
          { id: "d", text: "Node.js event loop processing all I/O callbacks on a single thread" },
          { id: "e", text: "Go goroutines with shared mutex-protected maps" },
        ],
        correctOptionIds: ["a", "c", "d"],
        explanation:
          "Dragonfly (A) assigns each key to exactly one thread — no sharing, no locking for most operations. Akka actors (C) encapsulate state within an actor and process messages sequentially — true thread confinement. Node.js (D) uses a single-threaded event loop where all application state is confined to that thread. ConcurrentHashMap (B) uses striped fine-grained locking — data IS shared between threads, protected by locks, not confined. Go goroutines with mutexes (E) explicitly share state and use locks — the opposite of confinement.",
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Design a thread-safe connection pool",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        points: 30,
        question:
          "Design a thread-safe connection pool with a fixed number of connections. Describe (1) the concurrency bug pattern involved in checking out connections, (2) your locking strategy choice with justification, and (3) what happens when all connections are in use.",
        sampleAnswer:
          "The connection pool checkout is a check-then-act problem: a thread checks if a connection is free and then marks it as in-use. Without synchronization, two threads could see the same connection as free and both check it out, leading to shared connection corruption.\n\nFor a connection pool serving thousands of queries/second (machine-generated traffic), I would use fine-grained locking with per-connection locks. This allows concurrent checkouts of different connections while protecting individual connection state. Operations on connection #3 do not need to block operations on connection #7.\n\nWhen all connections are in use, the checkout method should block the calling thread using a condition variable (wait/notify). When a connection is returned to the pool, the returning thread signals the condition variable, waking one waiting thread. Alternatively, we could use a bounded blocking queue (like a semaphore) that naturally blocks when empty and unblocks when a connection is returned.",
        rubric:
          "Award full marks for: (1) correctly identifying check-then-act as the bug pattern with a concrete example of the race, (2) choosing fine-grained locking with valid justification based on throughput requirements OR coarse-grained with acknowledgment of the tradeoff, (3) describing a blocking mechanism (condition variable, semaphore, or blocking queue) for the exhausted pool case. Partial credit for identifying the concurrency issue without naming the pattern or for incomplete blocking strategy.",
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain coarse-grained locking tradeoffs",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        points: 30,
        question:
          "Explain the tradeoffs of coarse-grained locking. When is it the right choice? When does it become a bottleneck? How do you decide when to move to fine-grained locking?",
        sampleAnswer:
          "Coarse-grained locking uses a single lock to protect all related shared state. Its main advantage is simplicity — one lock, easy to reason about, impossible to get the lock ordering wrong. The check and update are guaranteed atomic because they happen under the same lock.\n\nThe tradeoff is throughput. With a single lock, all operations serialize even when they do not conflict. Bob booking seat 12B must wait for Alice to finish booking seat 7A, even though those operations are independent.\n\nCoarse-grained locking is the right choice when operations are human-triggered (low contention) and the critical section is short (milliseconds). A parking lot with a car every few seconds, a ticket booking system, or a rate limiter handling user requests all fit this profile. Even 10,000 concurrent users produce only a few dozen lock contentions per microsecond — trivial for a modern mutex.\n\nIt becomes a bottleneck under machine-generated traffic at scale — connection pools at 10,000 QPS, caches at 50,000 RPS. The decision to move to fine-grained locking should be driven by measured contention, not premature optimization. Senior engineers know that premature fine-grained locking introduces deadlock risk and complexity that is harder to debug than throughput limits.",
        rubric:
          "Full marks for: (1) clearly articulating the simplicity vs throughput tradeoff, (2) giving concrete examples of when coarse-grained is sufficient (human-triggered, low contention), (3) giving concrete examples of when fine-grained is needed (machine traffic, high QPS), (4) mentioning that the decision should be data-driven, not premature. Deduct for vague answers or incorrect claim that coarse-grained locking is always bad.",
      },
    },

    // Paragraph 3 — hard
    {
      title: "Analyze a broken concurrent inventory system",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        points: 30,
        question:
          "An e-commerce inventory system has this logic: read current quantity, check if > 0, decrement and save. Two customers simultaneously buy the last item (quantity = 1). (1) Explain exactly what goes wrong at the thread-interleaving level. (2) Identify BOTH concurrency bug patterns present. (3) Propose a fix and explain why it works.",
        sampleAnswer:
          "Thread interleaving: Thread A reads quantity=1. Thread B reads quantity=1. Thread A checks 1>0 (true), computes 1-1=0, writes quantity=0. Thread B checks 1>0 (true — it read before A wrote), computes 1-1=0, writes quantity=0. Both threads succeed, but we sold two items when only one existed. The database shows quantity=0, but two orders were placed.\n\nThis involves BOTH bug patterns: (1) Check-then-act — checking quantity>0 and then decrementing are separate operations; the check becomes stale before the action. (2) Read-modify-write — reading the quantity, subtracting 1, and writing back is a three-step operation where one update overwrites the other.\n\nFix: Wrap the read, check, and write in a single synchronized block using a lock.\n\n```python\ndef purchase(self, item_id):\n    with self._lock:\n        if self._inventory[item_id] > 0:\n            self._inventory[item_id] -= 1\n            return True\n        return False\n```\n\nThis works because the lock ensures only one thread executes the entire read-check-write sequence at a time. When Thread A holds the lock and decrements to 0, Thread B cannot read until A releases the lock. B then reads 0, fails the check, and returns False — correctly rejecting the second purchase.",
        rubric:
          "Full marks for: (1) precise thread interleaving showing both threads reading the same stale value, (2) correctly identifying BOTH check-then-act AND read-modify-write patterns with explanation of each, (3) correct fix using a lock that wraps the entire read-check-write sequence, (4) explaining WHY the fix works in terms of preventing interleaving. Deduct if only one bug pattern is identified or if the fix does not cover the entire critical section.",
      },
    },

    // Paragraph 4 — hard
    {
      title: "Design concurrency strategy for a multi-resource booking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        points: 30,
        question:
          "A movie theater booking system must support booking multiple adjacent seats in a single transaction (e.g., seats 5A, 5B, 5C together). Design the concurrency strategy. Address: (1) why coarse-grained locking may be insufficient, (2) how to use fine-grained locking without deadlock, (3) how to handle partial failures (seat 5A available, 5B already taken).",
        sampleAnswer:
          "Coarse-grained locking works correctly here — a single lock around the entire multi-seat check-and-book operation. However, it serializes ALL bookings across the entire theater. If the system handles high throughput (e.g., 1000s of concurrent mobile users during a popular release), this becomes a bottleneck since users booking seats in different rows must wait for each other.\n\nFine-grained locking with per-seat locks requires acquiring multiple locks simultaneously, which risks deadlock. If Thread A locks seats [5A, 5B] and Thread B locks seats [5B, 5C], A holds 5A waiting for 5B while B holds 5B waiting for 5C — potential deadlock if another thread creates a cycle. The fix: always acquire seat locks in a globally consistent order (e.g., sorted by seat ID string). Both threads would lock 5A, then 5B, then 5C in order. No circular dependency is possible.\n\nFor partial failures: the entire multi-seat booking must be all-or-nothing. Under the fine-grained approach, acquire all seat locks in sorted order, then check availability of ALL seats before modifying ANY. If any seat is taken, release all locks and return failure. Do not book the available ones — partial bookings leave users with separated seats.\n\n```python\ndef book_seats(self, seat_ids, visitor_id):\n    sorted_ids = sorted(seat_ids)\n    locks = [self._get_lock(sid) for sid in sorted_ids]\n    for lock in locks:\n        lock.acquire()\n    try:\n        if all(sid not in self._owners for sid in sorted_ids):\n            for sid in sorted_ids:\n                self._owners[sid] = visitor_id\n            return True\n        return False\n    finally:\n        for lock in locks:\n            lock.release()\n```",
        rubric:
          "Full marks for: (1) explaining why coarse-grained locking is correct but may bottleneck at scale, (2) proposing consistent lock ordering for deadlock prevention with concrete example, (3) all-or-nothing semantics for multi-seat booking — check all before modifying any, (4) proper cleanup on failure (release all locks). Partial credit for correct strategy without code or for identifying issues without full solutions.",
      },
    },

    // Paragraph 5 — hard
    {
      title: "Compare optimistic vs pessimistic concurrency control",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        points: 30,
        question:
          "Compare pessimistic concurrency control (locking) with optimistic concurrency control (CAS / compare-and-swap). For each approach, explain: (1) how it works, (2) when it performs well, (3) when it performs poorly. Use concrete examples from LLD interview problems.",
        sampleAnswer:
          'Pessimistic concurrency (locking) assumes conflicts are likely. A thread acquires a lock before accessing shared state, blocking all other threads. It works by preventing interleaving entirely — no other thread can execute the critical section until the lock is released.\n\nPessimistic performs well under high contention (many threads competing for the same data). Example: a ticket booking system during a concert sale where thousands of users target the same popular seats. Since conflicts are frequent, blocking upfront avoids wasted computation.\n\nPessimistic performs poorly under low contention because threads block even when no conflict would have occurred. The overhead of acquiring/releasing locks and parking/unparking threads adds latency when conflicts are rare.\n\nOptimistic concurrency (CAS) assumes conflicts are unlikely. A thread reads the current value, computes the update, and attempts to write only if the value has not changed. If another thread modified the value, the CAS fails and the thread retries. No lock is ever held.\n\nOptimistic performs well under low contention — most CAS attempts succeed on the first try. Example: tracking the maximum concurrent connections with an AtomicInteger. Under normal load, few threads update simultaneously, so CAS almost never retries.\n\nOptimistic performs poorly under high contention because many threads read the same value, compute, and all attempt CAS — all but one fail and must retry. This creates a "thundering herd" of retries that wastes CPU. Example: a hot counter incremented by thousands of threads would cause most CAS operations to fail and loop.',
        rubric:
          "Full marks for: (1) clear explanation of both mechanisms, (2) correct identification that pessimistic suits high contention and optimistic suits low contention, (3) concrete LLD examples for each, (4) explaining the failure mode of each under the wrong contention level. Deduct for claiming one approach is always superior or for missing the retry/spinning overhead of CAS under contention.",
      },
    },

    // Paragraph 6 — hard
    {
      title: "Thread confinement design for high-throughput cache",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        points: 30,
        question:
          "You are designing a high-throughput in-memory cache serving 100,000 requests/second. Fine-grained locking is still creating contention hotspots. Propose a thread confinement solution. Address: (1) how to partition requests, (2) how to handle cross-partition operations, (3) what new failure modes this introduces.",
        sampleAnswer:
          "Partition the key space across N worker threads. Each key is deterministically assigned to exactly one thread (e.g., hash(key) % N). All read and write operations for a key are dispatched to that key's owning thread via a lock-free message queue. The owning thread processes operations sequentially from its queue — no locks needed because no data is shared.\n\nCross-partition operations (e.g., a bulk delete across many keys, or computing statistics across all cache entries) require coordination. Options: (1) scatter-gather — send the operation to all partition threads, collect results, and aggregate. (2) Use a dedicated coordinator thread that sends targeted requests to each partition. (3) For rare cross-partition operations, fall back to a global lock that pauses all partition threads.\n\nNew failure modes: (1) Load imbalance — popular keys may cluster on one partition (hot partition), causing that thread to become a bottleneck while others idle. Mitigate with consistent hashing and virtual nodes. (2) Queue overflow — if a partition thread falls behind, its queue grows unbounded. Need backpressure (reject or block senders). (3) Ordering guarantees — operations across partitions have no global ordering, which can matter for cache invalidation patterns. (4) Strictly enforcing confinement — accidentally accessing another partition's data reintroduces race conditions. This must be enforced architecturally, not just by convention.",
        rubric:
          "Full marks for: (1) clear partitioning strategy with deterministic key-to-thread assignment, (2) concrete approach for cross-partition operations, (3) identifying at least 2 new failure modes with mitigations (hot partitions, queue overflow, ordering). Partial credit for identifying the approach conceptually without addressing failure modes.",
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Name the bug pattern",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        points: 15,
        question:
          "A rate limiter reads the request count, checks if it is under the limit, and increments it. Under concurrency, two threads both read count=99 and both allow the request. Name this bug pattern and state the core invariant that is violated.",
        correctAnswer:
          "Check-then-act. The invariant violated is that the check result must remain valid when the action executes — but another thread can change the count between the check and the increment, making the check stale.",
        explanation:
          'This is check-then-act because the action (allowing the request and incrementing) depends on the check (count < limit) still being true. When Thread A reads 99 and Thread B also reads 99 before either increments, both see the check as passing. The invariant — "if I saw count < limit, no one else has changed count since I read it" — is broken by interleaving. The fix is to make the check and the increment atomic using a lock.',
      },
    },

    // Text 2 — medium
    {
      title: "Lost update in a counter",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        points: 15,
        question:
          "Thread A and Thread B both execute counter++ on a shared counter whose current value is 42. After both complete, the counter shows 43 instead of 44. Name this bug pattern and explain the three CPU-level steps that cause it.",
        correctAnswer:
          "Read-modify-write. The three steps: (1) Read the current value from memory, (2) Add 1 to it in a register, (3) Write the result back to memory. Both threads read 42, both compute 43, both write 43 — one increment is lost.",
        explanation:
          "counter++ is not a single operation. It decomposes into read (load counter into CPU register), modify (add 1 in register), and write (store register back to memory). When two threads interleave these three steps, both read 42, both compute 43 independently, and both write 43. The second write overwrites the first — a lost update. The fix is to use an atomic increment (lock-free CAS) or wrap the operation in a lock.",
      },
    },

    // Text 3 — hard
    {
      title: "Identify the synchronization fix",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        points: 25,
        question:
          'A developer locks only the "check if seat available" step but releases the lock before the "mark seat as booked" step, thinking this reduces lock contention. In one sentence, explain exactly why this is broken and state the rule it violates.',
        correctAnswer:
          "Releasing the lock between the check and the update allows another thread to book the seat between those steps, breaking atomicity. The rule: all operations that maintain an invariant must be protected by the same lock, held continuously.",
        explanation:
          "The developer's intent to reduce lock hold time is understandable but fatal. After releasing the lock, the seat's availability can change before the update executes. Thread A checks under lock, releases, then Thread B acquires the lock, checks (sees available), releases, and both proceed to book — double booking. The rule is simple: the check and the action must happen under the same lock, continuously held, because the check is meaningless if the state can change before the action.",
      },
    },

    // Text 4 — hard
    {
      title: "Atomic CAS failure behavior",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        points: 25,
        question:
          "In a CAS (compare-and-swap) loop used to track the maximum concurrent connections, explain what happens when the CAS operation fails, why it fails, and what the thread does next.",
        correctAnswer:
          "CAS fails when the current value no longer matches the expected value — another thread updated it between the read and the CAS attempt. On failure, the thread re-reads the current value, recomputes whether its value is still the new maximum, and retries the CAS. This loop continues until the CAS succeeds or the thread's value is no longer the maximum.",
        explanation:
          'CAS says "set to new value only if current == expected." If another thread wrote a different value between the read and the CAS, current != expected, so CAS returns false without modifying anything. The thread must then re-read the actual current value. If its proposed maximum is still greater, it retries CAS with the new expected value. If someone else already wrote a higher maximum, the thread stops — its value is no longer relevant. This is optimistic concurrency: assume no interference, detect and retry on conflict.',
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match locking strategy to scenario",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        points: 10,
        question:
          "Match each concurrency scenario to the most appropriate synchronization strategy.",
        pairs: [
          {
            id: "m1",
            left: "Parking lot with a car entering every few seconds",
            right: "Coarse-grained locking",
          },
          {
            id: "m2",
            left: "Connection pool serving 10,000 queries per second",
            right: "Fine-grained locking (per-connection)",
          },
          {
            id: "m3",
            left: "Global page-view counter incremented by web servers",
            right: "Atomic variable (AtomicLong)",
          },
          {
            id: "m4",
            left: "Redis-like cache partitioned across CPU cores",
            right: "Thread confinement (shared nothing)",
          },
        ],
        explanation:
          "Parking lot: human-triggered, low contention → coarse-grained lock is simple and sufficient. Connection pool: machine traffic at 10K QPS, operations on different connections are independent → per-connection fine-grained locks. Page-view counter: single variable, no multi-field invariant → atomic increment is ideal. Partitioned cache: data is divided so each core owns its partition → thread confinement, no locks needed.",
      },
    },

    // Matching 2 — medium
    {
      title: "Match bug pattern to real-world example",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        points: 15,
        question: "Match each concurrency bug example to its primary bug pattern.",
        pairs: [
          {
            id: "m1",
            left: "Two threads check a seat is free, both book it",
            right: "Check-then-act",
          },
          {
            id: "m2",
            left: "Two deposits read balance=$100, one writes $150, other writes $600, final is $600 not $650",
            right: "Read-modify-write",
          },
          {
            id: "m3",
            left: "Two threads see cache size as 999, both add items, size exceeds 1000 limit",
            right: "Check-then-act",
          },
          {
            id: "m4",
            left: "Two threads increment counter from 5, both write 6 instead of 7",
            right: "Read-modify-write",
          },
        ],
        explanation:
          "Seat booking and cache size limit are check-then-act — a condition is checked, and the action depends on that condition still being true. Bank deposits and counter increments are read-modify-write — a value is read, transformed, and written back, with no conditional branching. The key distinction: check-then-act has a conditional gate; read-modify-write unconditionally overwrites.",
      },
    },

    // Matching 3 — hard
    {
      title: "Match concurrency concept to its tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        points: 25,
        question: "Match each concurrency mechanism to the primary tradeoff it introduces.",
        pairs: [
          {
            id: "m1",
            left: "Coarse-grained locking",
            right:
              "Simplicity at the cost of throughput — all operations serialize even when independent",
          },
          {
            id: "m2",
            left: "Fine-grained locking",
            right:
              "Higher throughput at the cost of deadlock risk and complexity of managing many locks",
          },
          {
            id: "m3",
            left: "Atomic variables (CAS)",
            right:
              "Lock-free speed for single variables at the cost of inability to protect multi-field invariants",
          },
          {
            id: "m4",
            left: "Thread confinement",
            right:
              "Zero synchronization overhead at the cost of cross-partition coordination complexity",
          },
        ],
        explanation:
          "Each mechanism trades one dimension for another. Coarse-grained locks are dead simple but bottleneck under high concurrency. Fine-grained locks unlock parallelism but introduce deadlock risk and management overhead. Atomics are fast and lock-free but fundamentally limited to single-variable operations. Thread confinement eliminates synchronization entirely but cross-partition operations become architecturally complex.",
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Concurrency correctness fundamentals",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        points: 10,
        question:
          "A ___1___ condition occurs when two threads access shared state and the result depends on the ___2___ of their execution. The fix is to make the check and action ___3___ by wrapping them in a lock.",
        blanks: [
          { id: "1", correctAnswer: "race" },
          { id: "2", correctAnswer: "timing" },
          { id: "3", correctAnswer: "atomic" },
        ],
        explanation:
          "A race condition occurs when the correctness of a program depends on the relative timing (or interleaving) of concurrent operations. Making operations atomic — indivisible and non-interruptible — prevents other threads from observing or modifying intermediate states.",
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Compare-and-swap operation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        points: 10,
        question:
          "Compare-and-swap (CAS) sets a variable to a new value only if its ___1___ value equals the ___2___ value. If another thread changed it, CAS ___3___ and the thread retries.",
        blanks: [
          { id: "1", correctAnswer: "current" },
          { id: "2", correctAnswer: "expected" },
          { id: "3", correctAnswer: "fails" },
        ],
        explanation:
          "CAS is a CPU-level instruction that atomically compares the current value in memory against an expected value. If they match, the new value is written. If they do not match (because another thread modified it), the operation fails without writing, and the calling thread re-reads and retries.",
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Locking rule for invariants",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        points: 15,
        question:
          "All operations that maintain an ___1___ must be protected by the ___2___ lock. If you hold the lock during the check, you must ___3___ hold it during the update.",
        blanks: [
          { id: "1", correctAnswer: "invariant" },
          { id: "2", correctAnswer: "same" },
          { id: "3", correctAnswer: "still" },
        ],
        explanation:
          'An invariant is a condition that must always hold true (e.g., "each seat has at most one owner"). All operations that read or modify state involved in an invariant must use the same lock. Releasing the lock between steps allows another thread to break the invariant between the check and the update.',
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Lost updates calculation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        points: 15,
        question:
          "A counter starts at 0. Thread A and Thread B each execute counter++ exactly 500 times. Due to a read-modify-write race condition, some increments are lost. What is the MINIMUM possible final value of the counter? (Assume worst-case interleaving where maximum updates are lost.)",
        correctAnswer: 2,
        tolerance: 0,
        explanation:
          "In the absolute worst case, every pair of increments from Thread A and Thread B can interleave such that one is lost. However, the theoretical minimum is 2 — one final write from each thread must persist. Here is why: at the very end, Thread A performs its last read-modify-write and Thread B performs its last read-modify-write. In the worst case, Thread A reads 0, Thread B reads 0, A writes 1, B writes 1. Then A reads 1, writes 2... but actually the absolute minimum is 2: the last increment from each thread must produce a write. In the worst interleaving: both threads alternate reading and writing such that every write from one thread is overwritten by the other, except the very last writes. The minimum final counter value with two threads each doing N increments is 2.",
      },
    },

    // Numerical 2 — hard
    {
      title: "Fine-grained locking throughput improvement",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        points: 25,
        question:
          "A concert venue has 1000 seats. Under coarse-grained locking, booking throughput is limited to 1 booking per millisecond (sequential). With fine-grained per-seat locking and 100 concurrent booking requests spread uniformly across all 1000 seats, approximately how many bookings per millisecond can be processed in parallel? Assume each booking takes 1ms and locks are uncontended.",
        correctAnswer: 100,
        tolerance: 5,
        explanation:
          "With 100 concurrent requests spread uniformly across 1000 seats, the probability of two requests targeting the same seat is very low. Under fine-grained locking, each request acquires only its seat's lock, so all 100 requests can proceed in parallel since they hold different locks. With coarse-grained locking, all 100 must serialize through one lock → 1 per ms. With fine-grained locking and no contention, all 100 proceed simultaneously → approximately 100 per ms. This represents a ~100x throughput improvement.",
      },
    },
  ],
};
