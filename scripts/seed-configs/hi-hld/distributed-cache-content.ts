import { StoryPointSeed, ItemSeed } from "../subhang-content";

// ── Distributed Cache — HLD Interview Prep ──
// Source: HelloInterview — Distributed Cache breakdown by Evan King
// 2 rich materials + 28 practice questions

export const distributedCacheContent: StoryPointSeed = {
  title: "Distributed Cache",
  description:
    "Master the design of a distributed caching system — from single-node LRU cache internals to cluster-wide sharding, replication, and hot key mitigation strategies.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_cache_internals", title: "Cache Internals & Data Structures", orderIndex: 1 },
    { id: "sec_q_sharding", title: "Data Distribution & Consistent Hashing", orderIndex: 2 },
    { id: "sec_q_replication", title: "Replication & Fault Tolerance", orderIndex: 3 },
    { id: "sec_q_hot_keys", title: "Hot Keys & Performance Optimization", orderIndex: 4 },
    { id: "sec_q_scaling", title: "Scaling, Capacity & Architecture", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════

    // Material 1: Fundamentals — Requirements, API, Data Structures
    {
      title: "Distributed Cache Fundamentals",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Distributed Cache Fundamentals",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is a Distributed Cache?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "A distributed cache is a system that stores data as key-value pairs in memory across multiple machines in a network. Unlike single-node caches that are limited by the resources of one machine, distributed caches scale horizontally across many nodes to handle massive workloads. The cache cluster works together to partition and replicate data, ensuring high availability and fault tolerance when individual nodes fail.",
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
                  "Users should be able to set, get, and delete key-value pairs.",
                  "Users should be able to configure the expiration time (TTL) for key-value pairs.",
                  "Data should be evicted according to Least Recently Used (LRU) policy when the cache is full.",
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
                  "High availability — eventual consistency is acceptable.",
                  "Low latency — sub-10ms for get and set operations.",
                  "Scalable to 1TB of data and 100k requests per second.",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "API Design",
              metadata: { level: 3 },
            },
            {
              id: "b8",
              type: "code",
              content:
                '// Setting a key-value pair\nPOST /:key\n{ "value": "...", "ttl": 3600 }\n\n// Getting a key-value pair\nGET /:key -> { "value": "..." }\n\n// Deleting a key-value pair\nDELETE /:key',
              metadata: { language: "text" },
            },
            {
              id: "b9",
              type: "heading",
              content: "Core Data Structures: Hash Table + Doubly Linked List",
              metadata: { level: 3 },
            },
            {
              id: "b10",
              type: "paragraph",
              content:
                "At its core, a cache is a hash table providing O(1) lookups and inserts. To support LRU eviction, we combine it with a doubly linked list that tracks access order. The head of the list holds the most recently used items; the tail holds the least recently used. When the cache is full, we evict from the tail. Both get and set remain O(1).",
            },
            {
              id: "b11",
              type: "code",
              content:
                "class Node:\n    key, value, expiry\n    prev, next  # doubly linked list pointers\n\nclass Cache:\n    data = {}          # hash table: key -> Node\n    head, tail         # dummy sentinel nodes\n    capacity, size\n\n    get(key):\n        node = data[key]\n        if node.expiry and now() > node.expiry:\n            remove(node)\n            return null\n        move_to_front(node)\n        return node.value\n\n    set(key, value, ttl):\n        expiry = now() + ttl if ttl else null\n        if key in data:\n            node = data[key]\n            node.value = value\n            node.expiry = expiry\n            move_to_front(node)\n        else:\n            node = Node(key, value, expiry)\n            data[key] = node\n            add_to_front(node)\n            if size > capacity:\n                lru = tail.prev\n                remove(lru)\n                del data[lru.key]",
              metadata: { language: "python" },
            },
            {
              id: "b12",
              type: "heading",
              content: "TTL and Expiry Cleanup",
              metadata: { level: 3 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                'Expired keys are removed lazily on access (check expiry during get) and eagerly via a background "janitor" process that periodically scans for and removes expired entries. The trade-off is CPU usage (scanning) vs. memory efficiency (prompt removal). Most production systems combine both strategies.',
            },
            {
              id: "b14",
              type: "quote",
              content:
                '"Identifying where to spend more and less time in a system design interview based on where the challenges are is an important skill. Spending time on simple, auxiliary, or otherwise less important parts of the system is a recipe for running out of time." — Evan King, HelloInterview',
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Scaling Deep Dives — Replication, Sharding, Hot Keys
    {
      title: "Scaling a Distributed Cache",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Scaling a Distributed Cache",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "From Single Node to Distributed System",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "A single-node LRU cache satisfies functional requirements, but cannot handle 1TB of data or 100k req/s. The deep dives transform this into a production-grade distributed system by addressing high availability, scalability, data distribution, and hot key mitigation.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Replication for High Availability",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "To survive node failures, we replicate data across multiple nodes. Three approaches exist, each with different trade-offs:",
            },
            {
              id: "c5",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Synchronous Replication: Writes wait for ALL replicas to acknowledge. Strong consistency but high write latency and reduced availability if any replica is slow/down. Not ideal for caches prioritizing availability.",
                  "Asynchronous Replication: Writes acknowledge after primary confirms. Replicas update in background. Better write performance and availability. Trade-off: replicas may temporarily serve stale data. Best fit for eventual consistency requirements.",
                  "Peer-to-Peer Replication: All nodes are equal; reads and writes go to any node. Changes propagate via gossip protocol. Maximum scalability and no SPOF, but complex conflict resolution and stronger eventual consistency semantics.",
                ],
              },
            },
            {
              id: "c6",
              type: "quote",
              content:
                '"Redis uses asynchronous replication by default, though it provides a WAIT command for semi-synchronous behavior when clients need replica acknowledgement."',
            },
            {
              id: "c7",
              type: "heading",
              content: "Sharding with Consistent Hashing",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "To store 1TB across ~50 nodes, we partition keys using consistent hashing. Nodes and keys are mapped onto a circular hash ring. A key is assigned to the first node encountered when walking clockwise from the key's hash position. When a node is added or removed, only keys in that node's range need remapping — unlike modulo hashing (hash(key) % N) which would redistribute nearly all keys.",
            },
            {
              id: "c9",
              type: "heading",
              content: "Capacity Estimation",
              metadata: { level: 3 },
            },
            {
              id: "c10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Throughput: A single node handles ~20k req/s → 100k / 20k = 5 nodes minimum (plan ~8 with buffer).",
                  "Storage: 32GB RAM instance → ~24GB usable for cache → 1024GB / 24GB ≈ 43 nodes (plan ~50 with buffer).",
                  "Storage requirement dominates → provision 50 nodes, which also provides ample throughput headroom.",
                ],
              },
            },
            {
              id: "c11",
              type: "heading",
              content: "Hot Key Mitigation",
              metadata: { level: 3 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                "Hot keys occur when certain keys receive disproportionate traffic (e.g., viral content, flash sales). Hot reads and hot writes require different strategies:",
            },
            {
              id: "c13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Hot Reads — Copies of Hot Keys: Selectively replicate only hot keys across multiple nodes with suffixed copies (user:123#1, user:123#2, ...). Clients randomly pick a suffix to spread read load. Much more targeted than full read replicas.",
                  "Hot Writes — Write Batching: Buffer writes for 50-100ms and apply as single atomic update. Reduces write pressure by orders of magnitude. Trade-off: slight delay in write visibility.",
                  "Hot Writes — Key Sharding with Suffixes: Split one hot key into N sub-keys (views:video123:1 through views:video123:10). Writes go to random shard; reads aggregate all shards. Effective for decomposable operations like counters.",
                ],
              },
            },
            {
              id: "c14",
              type: "heading",
              content: "Performance Optimizations",
              metadata: { level: 3 },
            },
            {
              id: "c15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Request Batching: Bundle multiple operations into single network round-trips to reduce latency.",
                  "Consistent Hashing for Routing: Clients compute the target node locally — no central routing service needed, saving a network hop.",
                  "Connection Pooling: Maintain persistent connections between clients and cache nodes to eliminate TCP handshake overhead and reduce tail latencies (p95/p99).",
                ],
              },
            },
            {
              id: "c16",
              type: "heading",
              content: "Final Architecture Summary",
              metadata: { level: 3 },
            },
            {
              id: "c17",
              type: "paragraph",
              content:
                "Each node contains a hash table + doubly linked list for LRU. The cluster uses: asynchronous replication for HA and hot-read distribution; consistent hashing for sharding and routing; random suffixes for hot-write distribution; write batching and connection pooling for reducing network overhead.",
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
      title: "Data structures behind an LRU cache",
      type: "question",
      sectionId: "sec_q_cache_internals",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Which combination of data structures gives O(1) time complexity for both lookup and eviction in an LRU cache?",
        explanation:
          "A hash table provides O(1) key lookup, while a doubly linked list provides O(1) removal and insertion to track access order. Together they enable O(1) get, set, and eviction. A singly linked list would require O(n) to remove a node from the middle. A BST gives O(log n) lookups. A min-heap evicts by priority but not by recency in O(1).",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Hash table + min-heap",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Hash table + singly linked list",
              isCorrect: false,
            },
            { id: "c", text: "Hash table + doubly linked list", isCorrect: true },
            {
              id: "d",
              text: "Binary search tree + queue",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Lazy vs eager TTL expiry",
      type: "question",
      sectionId: "sec_q_cache_internals",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In a cache with TTL support, what is the primary drawback of relying solely on lazy expiry (checking TTL only on access)?",
        explanation:
          'Lazy expiry only removes a key when it is accessed after its TTL has passed. Keys that are never accessed again remain in memory indefinitely, wasting space. A background "janitor" process is needed to proactively scan and remove expired entries to reclaim memory.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It causes higher read latency for all keys",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Expired but unaccessed keys remain in memory indefinitely",
              isCorrect: true,
            },
            {
              id: "c",
              text: "It prevents the LRU eviction policy from working",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It requires a distributed lock for every read",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Why consistent hashing over modulo",
      type: "question",
      sectionId: "sec_q_sharding",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is consistent hashing preferred over simple modulo hashing (hash(key) % N) for distributing keys across cache nodes?",
        explanation:
          "With modulo hashing, changing N (adding/removing a node) redistributes nearly all keys, causing a massive cache miss storm. Consistent hashing maps nodes and keys to a ring, so only keys in the affected range need remapping — typically 1/N of all keys.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It guarantees strong consistency across all nodes",
              isCorrect: false,
            },
            {
              id: "b",
              text: "When nodes are added or removed, only a small fraction of keys need remapping",
              isCorrect: true,
            },
            {
              id: "c",
              text: "It eliminates the need for replication entirely",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It produces a more uniform hash distribution than modulo",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Replication strategy for eventual-consistency cache",
      type: "question",
      sectionId: "sec_q_replication",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "You are designing a distributed cache that requires high availability and accepts eventual consistency. Which replication strategy best fits these requirements?",
        explanation:
          "Asynchronous replication acknowledges writes after the primary confirms, then propagates to replicas in the background. This gives low write latency and high availability (writes succeed even if replicas are temporarily down), at the cost of brief staleness — exactly matching eventual consistency requirements. Synchronous replication blocks on all replicas (low availability). Peer-to-peer is also valid but introduces conflict resolution complexity. No replication provides no fault tolerance.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "Asynchronous replication", isCorrect: true },
            { id: "b", text: "No replication (single copy)", isCorrect: false },
            { id: "c", text: "Synchronous replication", isCorrect: false },
            {
              id: "d",
              text: "Two-phase commit across all replicas",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Hot read key — best mitigation",
      type: "question",
      sectionId: "sec_q_hot_keys",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A single cache key receives 100k reads/second but only 1 write/second during a flash sale. Which strategy most efficiently handles this hot read without wasting resources?",
        explanation:
          "Copies of hot keys selectively replicate only the hot key across multiple nodes (e.g., product:iphone#1 through #4), distributing reads while minimizing resource overhead. Full read replicas copy entire nodes, which is overkill for a single hot key. Vertical scaling upgrades all nodes regardless of actual load. Write batching addresses hot writes, not hot reads.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Vertically scale all nodes in the cluster",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Implement write batching for the key",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Create suffixed copies of just the hot key across multiple nodes",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Add full read replicas of the entire shard",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Synchronous replication drawback",
      type: "question",
      sectionId: "sec_q_replication",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "What is the most significant drawback of synchronous replication in a distributed cache?",
        explanation:
          "Synchronous replication requires confirmation from ALL replicas before acknowledging a write. If any replica is slow or unavailable, the entire write operation is blocked, directly harming both latency and availability. This compounds as more replicas are added. While it does use more network bandwidth and is more complex, the core issue is the availability/latency penalty.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Replicas may temporarily serve stale data",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It requires a gossip protocol for propagation",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It cannot replicate data across different data centers",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Write availability degrades if any replica is slow or unavailable",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Key sharding for hot writes — read trade-off",
      type: "question",
      sectionId: "sec_q_hot_keys",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "When using key sharding with suffixes (e.g., views:video123:1 through :10) to handle hot writes, what is the primary trade-off?",
        explanation:
          "Key sharding distributes write load across N nodes by splitting a key into N sub-keys. However, reads now require aggregating values from all N shards, increasing read latency and complexity. This effectively trades write performance for read performance. The number of shards must be carefully chosen — too few don't distribute load enough, too many make reads unnecessarily complex.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The cache loses the ability to apply TTL to the sharded key",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Write throughput decreases because of distributed coordination",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Consistent hashing can no longer be used for routing",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Read operations become more expensive because they must aggregate across all shards",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Peer-to-peer replication conflict scenario",
      type: "question",
      sectionId: "sec_q_replication",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In a peer-to-peer replicated cache using gossip protocol, two nodes simultaneously receive writes for the same key with different values. What is the fundamental challenge this creates?",
        explanation:
          'Peer-to-peer replication allows any node to accept writes. When two nodes receive conflicting writes for the same key concurrently, there is no single authority to determine the "correct" value. The system must have a conflict resolution strategy (e.g., last-writer-wins with vector clocks, CRDTs). This is fundamentally different from primary-replica systems where the primary serializes all writes and eliminates conflicts by design.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Both writes are automatically rejected until a leader is elected",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The gossip protocol will fail to propagate either write",
              isCorrect: false,
            },
            {
              id: "c",
              text: "There is no authoritative ordering, so the system must resolve conflicting values without a single source of truth",
              isCorrect: true,
            },
            {
              id: "d",
              text: "The consistent hashing ring becomes invalid until rebalanced",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4) ─────────────────────────────────────────────

    // MCAQ 1 — easy
    {
      title: "Valid cache eviction policies",
      type: "question",
      sectionId: "sec_q_cache_internals",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL valid cache eviction policies:",
        explanation:
          "LRU (Least Recently Used), LFU (Least Frequently Used), and FIFO (First In First Out) are all well-known cache eviction policies. LIFO is a stack-based ordering and not a standard cache eviction policy — it would evict the most recently added items, defeating the purpose of caching frequently accessed data.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "LFU (Least Frequently Used)", isCorrect: true },
            { id: "b", text: "LIFO (Last In, First Out)", isCorrect: false },
            { id: "c", text: "LRU (Least Recently Used)", isCorrect: true },
            { id: "d", text: "FIFO (First In, First Out)", isCorrect: true },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Advantages of asynchronous replication",
      type: "question",
      sectionId: "sec_q_replication",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL advantages of asynchronous replication over synchronous replication for a distributed cache:",
        explanation:
          "Async replication confirms writes faster (no waiting for replicas), maintains write availability when replicas are down, and scales better with additional replicas since they don't impact write latency. However, it does NOT guarantee strong consistency — replicas may temporarily serve stale data, which is the core trade-off.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Writes succeed even when replicas are temporarily down",
              isCorrect: true,
            },
            { id: "b", text: "Lower write latency", isCorrect: true },
            {
              id: "c",
              text: "Better scalability as more replicas are added",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Guarantees strong consistency across all replicas",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Techniques to reduce network latency in distributed caches",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL techniques that reduce network latency between a client and a distributed cache cluster:",
        explanation:
          "Request batching reduces round trips by combining multiple operations. Connection pooling eliminates repeated TCP handshake overhead. Consistent hashing enables client-side routing, removing the need for a central routing service (saving a hop). Synchronous replication adds latency by waiting for multiple replica acknowledgements — it is not a latency reduction technique.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Synchronous replication to all nodes",
              isCorrect: false,
            },
            { id: "b", text: "Request batching", isCorrect: true },
            {
              id: "c",
              text: "Client-side routing via consistent hashing",
              isCorrect: true,
            },
            { id: "d", text: "Connection pooling", isCorrect: true },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "When hot key copies become problematic",
      type: "question",
      sectionId: "sec_q_hot_keys",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          'Select ALL scenarios where the "copies of hot keys" strategy (user:123#1, user:123#2, ...) becomes problematic or counterproductive:',
        explanation:
          "Hot key copies work by replicating read load. If the key is write-heavy, every write must update ALL copies, amplifying write load. If most keys are hot, this degenerates into full replication with extra overhead. If the hot key stores a large blob, each copy consumes significant memory across nodes. Reads on a single node are not a distributed problem — the strategy is specifically for distributing load across nodes.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The hot key receives high read traffic from a single client",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The hot key stores a large blob (e.g., 10MB)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "A large percentage of all keys are hot simultaneously",
              isCorrect: true,
            },
            {
              id: "d",
              text: "The hot key has a high write-to-read ratio",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── PARAGRAPH (6) ────────────────────────────────────────

    // Paragraph 1 — medium
    {
      title: "Compare replication strategies",
      type: "question",
      sectionId: "sec_q_replication",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare synchronous replication, asynchronous replication, and peer-to-peer replication for a distributed cache. For each, explain when you would choose it and the key trade-off.",
        explanation:
          "A strong answer covers all three strategies with concrete trade-offs: synchronous gives strong consistency but hurts availability/latency; asynchronous balances availability with eventual consistency; peer-to-peer maximizes scalability/availability but requires conflict resolution. Should mention that the choice depends on consistency requirements.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Synchronous replication waits for ALL replicas to acknowledge before confirming a write. Choose it when strong consistency is required (e.g., financial data cache). Trade-off: write latency increases with each replica, and availability suffers if any replica is down.\n\nAsynchronous replication confirms writes after the primary acknowledges, propagating to replicas in the background. Choose it for most cache use cases where eventual consistency is acceptable. Trade-off: replicas may temporarily serve stale data, and if the primary fails before propagation, recent writes can be lost.\n\nPeer-to-peer replication treats all nodes as equals — any node can accept reads and writes, with changes propagated via gossip protocol. Choose it when maximum availability and scalability are paramount with no single point of failure. Trade-off: concurrent writes to the same key on different nodes create conflicts that require resolution strategies (e.g., vector clocks, CRDTs).",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain consistent hashing with node addition",
      type: "question",
      sectionId: "sec_q_sharding",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain how consistent hashing works for a distributed cache. Specifically describe what happens when a new node is added to a 50-node cluster and contrast this with what would happen using modulo-based hashing.",
        explanation:
          "Answer should explain the hash ring concept, how keys map to nodes by walking clockwise, and that adding a node only remaps keys in the affected range (~1/N of total). Should contrast with modulo where changing N causes nearly all keys to remap, creating a massive cache miss storm.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Consistent hashing maps both nodes and keys onto a circular hash ring (e.g., using MurmurHash). To find which node stores a key, hash the key to a position on the ring and walk clockwise until you encounter the first node — that node is responsible for the key.\n\nWhen a 51st node is added to a 50-node cluster, it takes a position on the ring and assumes responsibility for keys between itself and the preceding node. Only keys in that specific range (roughly 1/50 = 2% of all keys) need to be remigrated to the new node. All other keys remain on their current nodes.\n\nWith modulo hashing (hash(key) % N), changing N from 50 to 51 would change the result for nearly every key. For example, a key with hash 101 maps to node 1 with %50 but node 50 with %51. This causes a massive cache miss storm where almost all keys appear to be on the wrong node, requiring nearly complete redistribution.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design hot key detection and mitigation pipeline",
      type: "question",
      sectionId: "sec_q_hot_keys",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a pipeline for detecting and mitigating hot keys in a distributed cache. Cover: (1) how you detect hot keys, (2) your strategy for hot reads vs hot writes, (3) the lifecycle of a hot key copy (creation, consistency, removal), and (4) what the client needs to know.",
        explanation:
          "A staff-level answer should cover monitoring/metrics for detection (access counters, threshold alerts), distinguish between read-heavy (key copies) and write-heavy (key sharding/batching) strategies, explain how copies are created and eventually garbage-collected when traffic normalizes, and address the client library's role in routing to suffixed copies.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Detection: Each node tracks per-key access counts in a sliding window (e.g., 1-minute). When a key exceeds a threshold (e.g., 10x the average per-key QPS), it is flagged as hot and reported to a metadata service.\n\nHot reads: The system creates suffixed copies (key#1 through key#K) across K different nodes via consistent hashing. K is chosen based on traffic volume. The client library randomly selects a suffix for each read, spreading load across K nodes.\n\nHot writes: Use key sharding — split the value into N sub-keys (key:1 through key:N). Writes go to a randomly selected shard. Reads aggregate all shards. For counters, write batching can further reduce per-shard load by buffering updates for 50-100ms.\n\nLifecycle: When a key becomes hot, the controller creates copies/shards and notifies client libraries via a metadata push or config refresh. Writes to the original key propagate to all copies asynchronously (eventual consistency is acceptable). When traffic drops below threshold for a cooldown period (e.g., 5 minutes), copies are consolidated back to a single key and the suffixed entries are garbage-collected.\n\nClient awareness: The client library (not the end user) handles all complexity — it receives the hot key map from the metadata service, applies suffixing/sharding logic transparently, and routes requests accordingly.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Failure recovery in async-replicated cache",
      type: "question",
      sectionId: "sec_q_replication",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "In an asynchronously replicated distributed cache, the primary node for a shard fails. Describe the complete recovery process: how the failure is detected, how a new primary is promoted, and how data consistency is restored. What writes might be lost and why?",
        explanation:
          "Answer should cover: failure detection (heartbeats/health checks), leader election or promotion from replicas, replication lag meaning some recent writes are lost, re-syncing the promoted replica with other replicas, and updating the consistent hash ring to redirect traffic.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Failure detection: Cache nodes exchange heartbeats. If a primary misses several consecutive heartbeats (e.g., 3 missed over 3 seconds), the monitoring system (e.g., ZooKeeper, etcd) declares it failed.\n\nPromotion: The most up-to-date replica (smallest replication lag) is promoted to primary. The cluster metadata is updated so the consistent hashing ring routes the failed primary's key range to the new primary.\n\nData loss: Any writes that the old primary acknowledged but had not yet propagated to replicas are lost. This is the fundamental trade-off of asynchronous replication — we accept potential data loss in exchange for lower write latency. For a cache (not a database), this is usually acceptable since the source of truth exists elsewhere.\n\nConsistency restoration: The new primary syncs with remaining replicas to ensure they have consistent state. Any keys that were in-flight during the failure are treated as cache misses — clients will re-fetch from the backing store. The old primary's node is replaced, joins as a new replica, and receives a full data sync from the current primary.\n\nDuring the failover window (typically seconds), requests to the affected shard may experience higher latency or temporary failures until routing converges.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Capacity planning for distributed cache",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You need to design a distributed cache to store 2TB of data with a peak of 200k requests per second. Walk through your capacity planning process. How many nodes do you need? What factors would change your estimate?",
        explanation:
          "Should demonstrate structured estimation: compute storage-based nodes (2TB / usable memory per node), throughput-based nodes (200k / per-node throughput), take the maximum, add buffer for replication and growth. Should discuss factors like replication factor, value size distribution, read/write ratio, and instance type selection.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Throughput estimation: Assuming ~20k requests/second per node, we need 200k / 20k = 10 nodes minimum. Adding 50% buffer for spikes and failures: ~15 nodes.\n\nStorage estimation: With 64GB RAM instances, ~48GB usable for cache data after system overhead. We need 2048GB / 48GB ≈ 43 nodes. With 32GB instances (~24GB usable): 2048 / 24 ≈ 86 nodes.\n\nReplication: With replication factor of 3 (1 primary + 2 replicas), multiply storage nodes by 3: 43 × 3 = 129 nodes (64GB instances) or 86 × 3 = 258 nodes (32GB instances).\n\nFinal estimate: Using 64GB instances with RF=3, provision ~130 nodes minimum, plan for ~150 with growth buffer.\n\nFactors that change the estimate: (1) Average value size — larger values reduce effective capacity per node. (2) Read/write ratio — write-heavy workloads may need more nodes for throughput. (3) Hot key distribution — may need additional capacity for hot key copies. (4) Network bandwidth — large values may be network-bound before being memory-bound. (5) Replication factor — higher RF means more nodes but better availability. (6) Expected growth rate — plan for 6-12 months of data growth.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Interview-level answer: distributed cache architecture",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You are in a Staff Engineer interview and asked to "Design a distributed cache." Outline the structure of your answer using the HelloInterview delivery framework: (1) requirements gathering, (2) API and entity design, (3) high-level design, (4) deep dives. For each phase, explain what you would cover and where you would spend the most time.',
        explanation:
          "The answer should demonstrate interview awareness — knowing to rush through trivial parts (API, entities) and spend time on the LRU implementation, then deep dives on replication, sharding, and hot keys. Should show the candidate understands what differentiates a senior from staff answer: depth of tradeoff analysis and operational awareness.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Phase 1 — Requirements (2-3 min): Confirm functional requirements (get/set/delete, TTL, eviction policy). Clarify NFRs with interviewer: target scale (storage size, QPS), consistency model (eventual vs strong), availability requirements. This drives all subsequent design decisions. Mention explicitly: "We are choosing eventual consistency for higher availability."\n\nPhase 2 — API & Entities (1-2 min, rushed): Key-value pairs are the only entity. Three REST endpoints: GET /:key, POST /:key, DELETE /:key. Signal to the interviewer: "These are straightforward — I\'ll move quickly to the high-level design where the interesting challenges are."\n\nPhase 3 — High-Level Design (8-10 min): Build an MVP single-node cache. Show the hash table + doubly linked list combination for O(1) LRU. Write pseudocode for get/set showing TTL checks and LRU maintenance. Add the cleanup janitor for expired keys. This section may involve more code than a typical HLD — acknowledge the blend.\n\nPhase 4 — Deep Dives (15-20 min, MOST TIME HERE): This is where you differentiate. Cover: (a) Replication for HA — compare sync, async, and P2P with clear trade-offs, recommend async for our requirements. (b) Sharding with consistent hashing — explain the ring, virtual nodes, what happens on add/remove. Capacity estimation for 50 nodes. (c) Hot keys — distinguish hot reads (key copies) from hot writes (sharding with suffixes, write batching). (d) Performance — connection pooling, request batching, client-side routing.\n\nThe staff-level differentiator: operational awareness. Discuss monitoring (how do you detect hot keys?), failure recovery (what happens when a primary fails?), and deployment (how do you add capacity without downtime?).',
          minLength: 250,
          maxLength: 4000,
        },
      },
    },

    // ── TEXT (4) ──────────────────────────────────────────────

    // Text 1 — medium
    {
      title: "Name the janitor process role",
      type: "question",
      sectionId: "sec_q_cache_internals",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'In a cache with TTL support, what is the role of the background "janitor" or cleanup process? Answer in one sentence.',
        explanation:
          "The janitor process periodically scans for and removes expired entries that have not been accessed (and thus not lazily evicted), preventing the cache from filling with stale, unaccessed data.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "It periodically scans for and removes expired keys that have not been accessed, preventing memory waste from stale entries.",
          acceptableAnswers: [
            "It removes expired keys that were not lazily evicted",
            "Background process that cleans up expired entries",
            "Scans and removes keys past their TTL",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "What fails with modulo hashing on node change",
      type: "question",
      sectionId: "sec_q_sharding",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In a cache cluster using hash(key) % N for routing, what happens when you add one more node (N → N+1)? Answer in one sentence.",
        explanation:
          "Changing N causes nearly all keys to hash to different nodes, resulting in a massive cache miss storm where almost every request misses the cache and must be served from the backing store.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Nearly all keys remap to different nodes, causing a massive cache miss storm.",
          acceptableAnswers: [
            "Almost all keys are redistributed",
            "Most keys map to different nodes causing cache misses",
            "A cache miss storm occurs as keys are remapped",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Why connection pooling reduces tail latency",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Explain in one sentence why connection pooling specifically improves p95/p99 tail latencies for cache clients.",
        explanation:
          "Without pooling, some requests must establish a new TCP connection (3-way handshake), adding significant latency at the tail. Pooling ensures a ready-to-use connection is always available, eliminating the handshake penalty that causes tail latency spikes.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "It eliminates the TCP handshake overhead that causes latency spikes for requests that would otherwise need to establish a new connection.",
          acceptableAnswers: [
            "Avoids TCP handshake overhead on tail requests",
            "Pre-established connections remove connection setup latency",
            "Persistent connections prevent handshake-induced tail latency",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Write batching trade-off in one sentence",
      type: "question",
      sectionId: "sec_q_hot_keys",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "What is the fundamental trade-off of write batching in a distributed cache? Answer in one sentence.",
        explanation:
          "Write batching trades write visibility delay (50-100ms) for dramatically reduced write pressure on cache nodes, which is acceptable for use cases like counters and metrics where the final state matters more than individual updates.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "It reduces write pressure by orders of magnitude but introduces a small delay (50-100ms) before writes become visible.",
          acceptableAnswers: [
            "Trades write visibility delay for reduced write load",
            "Lower write throughput needed but writes are delayed",
            "Batching window adds latency but reduces per-node write load",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── MATCHING (3) ─────────────────────────────────────────

    // Matching 1 — easy
    {
      title: "Match cache operation to time complexity",
      type: "question",
      sectionId: "sec_q_cache_internals",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content:
          "Match each LRU cache operation to its time complexity (using hash table + doubly linked list):",
        explanation:
          "With a hash table + doubly linked list, all core LRU operations are O(1): get uses hash lookup + list move; set uses hash insert + list insert; eviction removes the tail node and its hash entry; TTL cleanup scans the list from tail, which is O(n) since it must check all entries.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            { id: "p1", left: "get(key)", right: "O(1)" },
            { id: "p2", left: "set(key, value)", right: "O(1)" },
            { id: "p3", left: "LRU eviction", right: "O(1)" },
            { id: "p4", left: "Full TTL cleanup scan", right: "O(n)" },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match replication strategy to characteristic",
      type: "question",
      sectionId: "sec_q_replication",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each replication strategy to its defining characteristic:",
        explanation:
          "Synchronous replication blocks until all replicas confirm (strong consistency). Asynchronous replication confirms on primary only (low write latency). Peer-to-peer has no designated primary (no single point of failure). Each characteristic is the key differentiator for that strategy.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Synchronous replication",
              right: "Writes block until all replicas acknowledge",
            },
            {
              id: "p2",
              left: "Asynchronous replication",
              right: "Writes confirm after primary only",
            },
            {
              id: "p3",
              left: "Peer-to-peer replication",
              right: "No single point of failure; any node accepts writes",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match hot key problem to mitigation strategy",
      type: "question",
      sectionId: "sec_q_hot_keys",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each hot key scenario to the most appropriate mitigation strategy:",
        explanation:
          "A viral tweet (read-heavy) is best handled by creating suffixed copies across nodes. A real-time vote counter (write-heavy, decomposable) benefits from key sharding with suffixes. A flash sale inventory (write-heavy, bursty) benefits from write batching to reduce per-operation overhead. A globally popular config value (read-heavy, rarely changes) is best handled with a local in-process cache on each application server.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Viral tweet: 1M reads/s, 0 writes/s",
              right: "Copies of hot key across nodes",
            },
            {
              id: "p2",
              left: "Real-time vote counter: 50k writes/s",
              right: "Key sharding with random suffixes",
            },
            {
              id: "p3",
              left: "Flash sale inventory: 10k bursty writes/s",
              right: "Write batching (buffer + flush)",
            },
            {
              id: "p4",
              left: "Global config: 500k reads/s, 1 write/day",
              right: "Local in-process cache on each app server",
            },
          ],
        },
      },
    },

    // ── FILL-BLANKS (3) ──────────────────────────────────────

    // Fill-blanks 1 — easy
    {
      title: "LRU eviction data structure",
      type: "question",
      sectionId: "sec_q_cache_internals",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "An LRU cache uses a hash table for O(1) lookups and a _____ for O(1) eviction of the least recently used item.",
        explanation:
          "A doubly linked list allows O(1) insertion at the head and O(1) removal from the tail (or any node, given a pointer to it). Combined with a hash table that maps keys to list nodes, this enables O(1) LRU tracking.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "An LRU cache uses a hash table for O(1) lookups and a {{blank1}} for O(1) eviction of the least recently used item.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "doubly linked list",
              acceptableAnswers: [
                "doubly linked list",
                "doubly-linked list",
                "double linked list",
                "dll",
              ],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Consistent hashing ring direction",
      type: "question",
      sectionId: "sec_q_sharding",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In consistent hashing, to find which node stores a key, you hash the key to a position on the ring and walk _____ until you find the first node.",
        explanation:
          "The standard consistent hashing algorithm maps keys and nodes to positions on a circular ring. From a key's hash position, you traverse clockwise to find the first node, which is responsible for that key.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "In consistent hashing, to find which node stores a key, you hash the key to a position on the ring and walk {{blank1}} until you find the first node.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "clockwise",
              acceptableAnswers: ["clockwise", "forward", "cw"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Replication propagation method in P2P",
      type: "question",
      sectionId: "sec_q_replication",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "In peer-to-peer replication, changes are propagated to other nodes using a _____ protocol, where nodes periodically exchange state with randomly selected peers.",
        explanation:
          "The gossip protocol (also called epidemic protocol) propagates information by having each node periodically share its state with a few randomly chosen peers. Over time, information spreads to all nodes in the cluster, similar to how gossip spreads in a social network.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "In peer-to-peer replication, changes are propagated to other nodes using a {{blank1}} protocol, where nodes periodically exchange state with randomly selected peers.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "gossip",
              acceptableAnswers: ["gossip", "epidemic", "gossip-based"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── NUMERICAL (2) ────────────────────────────────────────

    // Numerical 1 — medium
    {
      title: "Minimum storage nodes calculation",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "You need to store 1TB (1024GB) of cache data. Each node has 32GB RAM with ~24GB usable for cache. How many nodes do you need at minimum for storage alone (no replication)?",
        explanation:
          "Storage nodes = total data / usable memory per node = 1024GB / 24GB ≈ 42.67, rounded up to 43 nodes. In practice you would add a buffer (plan for ~50), but the minimum mathematical answer is 43.",
        basePoints: 15,
        difficulty: "medium",
        questionData: { correctAnswer: 43, tolerance: 1 },
      },
    },

    // Numerical 2 — hard
    {
      title: "Keys remapped on node addition with consistent hashing",
      type: "question",
      sectionId: "sec_q_sharding",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A distributed cache cluster has 50 nodes and stores 10 million keys with perfectly even distribution via consistent hashing. When a 51st node is added, approximately how many keys (in thousands) need to be remapped?",
        explanation:
          "With consistent hashing, adding a node remaps approximately 1/N of all keys, where N is the new number of nodes. So: 10,000,000 / 51 ≈ 196,078 keys, or approximately 196 thousand. The new node takes over a portion of the ring from one existing node, only affecting keys in that range.",
        basePoints: 25,
        difficulty: "hard",
        questionData: { correctAnswer: 196, tolerance: 10 },
      },
    },
  ],
};
