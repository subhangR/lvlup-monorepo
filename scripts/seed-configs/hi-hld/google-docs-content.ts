/**
 * Google Docs — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: collaborative editing, OT vs CRDTs, WebSocket scaling, consistent hashing, storage compaction
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const googleDocsContent: StoryPointSeed = {
  title: "Google Docs",
  description:
    "Design a real-time collaborative document editor supporting concurrent editing by up to 100 users per document, eventual consistency via Operational Transformation, WebSocket scaling to millions of connections, and storage compaction for billions of documents.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements & Communication Protocols", orderIndex: 1 },
    { id: "sec_q_consistency", title: "OT, CRDTs & Consistency Models", orderIndex: 2 },
    { id: "sec_q_architecture", title: "Architecture & Data Flow", orderIndex: 3 },
    { id: "sec_q_scaling", title: "Scaling & WebSocket Infrastructure", orderIndex: 4 },
    { id: "sec_q_compaction", title: "Storage Compaction & Interview Strategy", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Requirements & Core Entities
    {
      title: "Google Docs — Requirements & Collaborative Editing Fundamentals",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Google Docs — Requirements & Collaborative Editing Fundamentals",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Google Docs?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Google Docs is a browser-based collaborative document editor. Users create rich text documents and collaborate with others in real-time. The core design challenge is achieving consistency when multiple users concurrently edit the same document at high frequency.",
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
                  "Users should be able to create new documents.",
                  "Multiple users should be able to edit the same document concurrently.",
                  "Users should be able to view each other's changes in real-time.",
                  "Users should be able to see cursor position and presence of other users.",
                ],
              },
            },
            {
              id: "b5",
              type: "paragraph",
              content:
                "Out of scope: sophisticated document structure (assume simple text), permissions and collaboration levels, document history and versioning.",
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
                  "Documents should be eventually consistent — all users should eventually see the same document state.",
                  "Updates should be low latency (< 100ms).",
                  "Scale to millions of concurrent users across billions of documents.",
                  "No more than 100 concurrent editors per document.",
                  "Documents should be durable and available even if the server restarts.",
                ],
              },
            },
            {
              id: "b8",
              type: "quote",
              content:
                '"Limiting concurrent editors per document means we can avoid worrying about massive throughput on a single document and instead focus on the core consistency problem. Google Docs also made this choice — beyond a certain number, everyone new can only join as readers."',
            },
            {
              id: "b9",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Editor: A user editing a document.",
                  "Document: A collection of text managed by editors.",
                  "Edit: A change made to the document by an editor (insert, delete operations).",
                  "Cursor: The position of the editor's cursor and their presence in the document.",
                ],
              },
            },
            {
              id: "b11",
              type: "heading",
              content: "API Design",
              metadata: { level: 2 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "REST APIs manage document metadata (POST /docs to create). The collaborative editing experience uses WebSocket connections (WS /docs/{docId}) for bi-directional communication. Messages include insert, delete, updateCursor (sent by clients) and update (received by clients from server).",
            },
            {
              id: "b13",
              type: "heading",
              content: "Why Naive Approaches Fail",
              metadata: { level: 2 },
            },
            {
              id: "b14",
              type: "heading",
              content: "Sending Snapshots (Wrong)",
              metadata: { level: 3 },
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "If each edit sends the entire document, it is incredibly inefficient (100s of KB per keystroke) and introduces race conditions. Whichever user's edit arrives last completely overwrites the other's changes. Concurrent edits are entirely lost.",
            },
            {
              id: "b16",
              type: "heading",
              content: "Sending Raw Edits (Insufficient)",
              metadata: { level: 3 },
            },
            {
              id: "b17",
              type: "paragraph",
              content:
                'Transmitting operations like INSERT(5, ", world") and DELETE(6) is more efficient. But edits are contextual — they reference positions in a specific document state. If User A inserts text before User B\'s deletion point, the deletion operates on the wrong position. The critical missing piece is that each edit must be reinterpreted against the current document state.',
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: OT vs CRDTs & High-Level Architecture
    {
      title: "Collaborative Editing — OT vs CRDTs & System Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Collaborative Editing — OT vs CRDTs & System Architecture",
          blocks: [
            {
              id: "ot1",
              type: "heading",
              content: "Operational Transformation (OT)",
              metadata: { level: 2 },
            },
            {
              id: "ot2",
              type: "paragraph",
              content:
                "OT reinterprets or transforms each edit before applying it. A central server collects all edits and, in batches, transforms each edit based on the edits that preceded it. Example: If User A's INSERT(5, \", world\") arrives before User B's DELETE(6), OT transforms User B's DELETE(6) to DELETE(13) so it deletes the correct character.",
            },
            {
              id: "ot3",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Advantages: Low memory, efficient for text, well-suited to centralized architectures.",
                  "Challenges: Requires a central server for ordering, tricky to implement correctly, limits scalability to small numbers of collaborators per document.",
                ],
              },
            },
            {
              id: "ot4",
              type: "heading",
              content: "Conflict-free Replicated Data Types (CRDTs)",
              metadata: { level: 2 },
            },
            {
              id: "ot5",
              type: "paragraph",
              content:
                "CRDTs make every edit commutative — applicable in any order while producing the same result. They use unique, infinitely subdivisible position identifiers and tombstones for deletions (text is never actually removed). Regardless of operation arrival order, all clients converge on the same document.",
            },
            {
              id: "ot6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Advantages: No central server needed, supports peer-to-peer (e.g., WebRTC), excellent for offline use (buffer edits locally, merge on reconnect).",
                  "Challenges: Higher memory (tombstones mean document only grows, never shrinks), less computationally efficient, conflict handling can be inelegant.",
                  "Open-source implementation: Yjs — recommended for lightweight collaborative apps.",
                ],
              },
            },
            {
              id: "ot7",
              type: "heading",
              content: "Design Choice: Why OT for Google Docs",
              metadata: { level: 2 },
            },
            {
              id: "ot8",
              type: "paragraph",
              content:
                "Google Docs uses OT because it requires low memory, is more adaptable to text, and benefits from a centralized server architecture. CRDTs would be chosen for larger collaborator counts, peer-to-peer systems (WebRTC), or offline-first applications. Figma is a notable example of a production CRDT implementation with practical compromises.",
            },
            {
              id: "ot9",
              type: "heading",
              content: "High-Level Architecture",
              metadata: { level: 2 },
            },
            {
              id: "ot10",
              type: "paragraph",
              content:
                "The system consists of: (1) An API Gateway fronting a Document Metadata Service backed by Postgres for document CRUD. (2) A Document Service that maintains WebSocket connections, applies OT, and stores operations. (3) A Document Operations DB (Cassandra, partitioned by docId, ordered by timestamp) for durable, append-only operation storage.",
            },
            {
              id: "ot11",
              type: "heading",
              content: "Read Path",
              metadata: { level: 2 },
            },
            {
              id: "ot12",
              type: "paragraph",
              content:
                "When a user first connects, the WebSocket connection loads all previous operations from the Document Operations DB and pushes them to the client. Since all connections go to the same server, all clients start from the same base state. When another editor makes a change, the server broadcasts the transformed operation to all connected clients via their WebSocket connections.",
            },
            {
              id: "ot13",
              type: "heading",
              content: "Client-Side OT",
              metadata: { level: 2 },
            },
            {
              id: "ot14",
              type: "paragraph",
              content:
                "Users expect to see their own edits immediately (applied locally first, then sent to server). If another user lands an edit on the server between local application and server acknowledgement, the client must also perform OT. Regardless of perceived operation ordering at each site (Server sees Ea,Eb; User A sees Ea,Eb; User B sees Eb,Ea), OT guarantees all users converge on the same document.",
            },
            {
              id: "ot15",
              type: "heading",
              content: "Cursor Presence & Awareness",
              metadata: { level: 2 },
            },
            {
              id: "ot16",
              type: "paragraph",
              content:
                "Cursor position and user presence are ephemeral — only relevant while the user is connected. They are stored in-memory on the Document Service (not persisted to DB), broadcast to other users via the same WebSocket, and cleaned up on disconnect. This avoids unnecessary storage and keeps the critical path lightweight.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Deep Dives — Scaling & Storage
    {
      title: "Deep Dives — WebSocket Scaling, Consistent Hashing & Storage Compaction",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — WebSocket Scaling, Consistent Hashing & Storage Compaction",
          blocks: [
            {
              id: "dd1",
              type: "heading",
              content: "Scaling to Millions of WebSocket Connections",
              metadata: { level: 2 },
            },
            {
              id: "dd2",
              type: "paragraph",
              content:
                "A single Document Service server cannot handle millions of concurrent users. We must horizontally scale Document Service servers. The key constraint: all editors of the same document must connect to the same server (for OT to work with in-memory state). This is the real-time updates pattern.",
            },
            {
              id: "dd3",
              type: "heading",
              content: "Solution: Consistent Hash Ring",
              metadata: { level: 3 },
            },
            {
              id: "dd4",
              type: "paragraph",
              content:
                "Each Document Service server joins a consistent hash ring coordinated by Apache ZooKeeper. When a client connects: (1) HTTP request to any server (via round robin) with the documentId. (2) That server checks the hash ring — if it's not responsible for the docId's hash range, it responds with a redirect to the correct server. (3) The correct server upgrades the HTTP connection to a WebSocket. (4) Document operations are loaded from the DB if not already in memory.",
            },
            {
              id: "dd5",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Consistent hashing minimizes connection redistribution when adding or removing servers.",
                  "During scaling events, displaced connections must reconnect to the correct server (server disconnects them and they auto-reconnect).",
                  "Must track old and new hash rings during transitions; some requests may need to be sent to multiple servers.",
                  "Server failures trigger quick redistribution and hash ring updates via ZooKeeper.",
                  "Client-side reconnection logic is essential for handling server unavailability.",
                ],
              },
            },
            {
              id: "dd6",
              type: "heading",
              content: "WebSocket Architecture Insight",
              metadata: { level: 3 },
            },
            {
              id: "dd7",
              type: "quote",
              content:
                '"Because the statefulness of WebSockets is a pain, it can be useful to handle them at the edge of your design. By terminating WebSockets early and exposing an internal API, other systems retain statelessness."',
            },
            {
              id: "dd8",
              type: "heading",
              content: "Keeping Storage Under Control",
              metadata: { level: 2 },
            },
            {
              id: "dd9",
              type: "paragraph",
              content:
                "With billions of documents at ~50KB each, that's ~50TB of storage. Documents with millions of operations are expensive to transfer to new clients. Active documents must be held in memory on the Document Service. Solution: periodically snapshot/compact operations, collapsing many operations into fewer (or one INSERT).",
            },
            {
              id: "dd10",
              type: "heading",
              content: "Good: Offline Compaction Service",
              metadata: { level: 3 },
            },
            {
              id: "dd11",
              type: "paragraph",
              content:
                "A separate Compaction Service reads operations from the Document Operations DB, compacts them into a single insert, writes under a new documentVersionId, and tells the Document Service to flip the version. A documentVersionId in the Document Metadata DB provides document-level atomicity (Cassandra only supports row-level transactions). The Document Service can reject flips for actively-edited documents to prevent corruption.",
            },
            {
              id: "dd12",
              type: "heading",
              content: "Great: Online Compaction in Document Service",
              metadata: { level: 3 },
            },
            {
              id: "dd13",
              type: "paragraph",
              content:
                "The Document Service itself compacts operations when the last client disconnects — it already has all operations in memory and exclusive ownership. Compaction runs in a separate, low-priority process to avoid impacting P99 latency. Results are written to a new documentVersionId and the metadata DB is updated. This eliminates the coordination complexity of a separate service.",
            },
            {
              id: "dd14",
              type: "heading",
              content: "Additional Deep Dive Topics",
              metadata: { level: 2 },
            },
            {
              id: "dd15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Read-Only Mode: Millions of readers can view the same document without interfering with editors — how to scale reads separately.",
                  "Versioning: Extending the snapshot/compact approach to support version history.",
                  "Memory Optimization: Reducing the memory footprint of active documents on the Document Service.",
                  "Offline Mode: Allowing clients to edit offline and merge on reconnect — CRDTs become attractive here.",
                ],
              },
            },
            {
              id: "dd16",
              type: "heading",
              content: "Interview Level Expectations",
              metadata: { level: 2 },
            },
            {
              id: "dd17",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mid-level: Create a high-level design, think through consistency problems with assistance, show ability to reason about solutions with a growing toolbox.",
                  "Senior: Immediately grasp consistency and durability challenges, proactively identify bottlenecks, discuss database tradeoffs, complete 1-2 deep dives.",
                  "Staff: Mastery over the problem — familiarity with CRDTs, expertise in scaling socket services, consistency tradeoffs, serialization, transactions. Complete all deep dives and add extra depth.",
                ],
              },
            },
          ],
          readingTime: 12,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════════════

    // --- MCQ (8 questions) ---

    // MCQ 1 — easy
    {
      title: "Why WebSockets for collaborative editing?",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why are WebSocket connections preferred over HTTP polling for a collaborative document editor like Google Docs?",
        explanation:
          "WebSockets provide bi-directional, persistent connections that allow the server to push updates to clients immediately. HTTP polling requires clients to repeatedly ask for updates, introducing latency proportional to the polling interval. For real-time editing at sub-100ms latency, polling is impractical — you would need to poll every few milliseconds, creating enormous unnecessary load.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "WebSockets use less bandwidth because they compress data automatically",
              isCorrect: false,
            },
            {
              id: "b",
              text: "WebSockets allow bi-directional communication so the server can push updates immediately without polling overhead",
              isCorrect: true,
            },
            {
              id: "c",
              text: "WebSockets are required because browsers cannot send HTTP requests from JavaScript",
              isCorrect: false,
            },
            {
              id: "d",
              text: "WebSockets guarantee message ordering, which HTTP cannot",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why sending full snapshots fails",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In a collaborative editor, why is sending the entire document to the server on every keystroke a fundamentally broken approach?",
        explanation:
          "The most critical problem is that concurrent edits from different users result in a \"last write wins\" scenario — whichever user's snapshot arrives last completely overwrites the other's changes. This makes collaboration impossible. The bandwidth concern (100s of KB per keystroke) is real but secondary to the data loss problem.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Servers cannot parse full document snapshots at high frequency",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Concurrent edits cause last-write-wins, silently discarding one user's changes entirely",
              isCorrect: true,
            },
            {
              id: "c",
              text: "WebSockets have a message size limit that prevents sending full documents",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Full snapshots cannot be stored in a database efficiently",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Cursor presence storage strategy",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Where should cursor position and user presence data be stored in a Google Docs-like system?",
        explanation:
          "Cursor position and presence are inherently ephemeral — they only matter while the user is connected and become meaningless after disconnection. Storing them in-memory on the Document Service and broadcasting via WebSocket avoids unnecessary database writes. They are cleaned up automatically when the socket disconnects.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "In the Document Operations DB alongside edit operations",
              isCorrect: false,
            },
            {
              id: "b",
              text: "In a Redis cache with a 5-minute TTL",
              isCorrect: false,
            },
            {
              id: "c",
              text: "In the Document Metadata DB for persistence across sessions",
              isCorrect: false,
            },
            {
              id: "d",
              text: "In-memory on the Document Service — ephemeral data that is only relevant while the user is connected",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "OT central server requirement",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Why does Operational Transformation (OT) require a central server, and how does this constraint impact the system architecture?",
        explanation:
          'OT transforms operations based on a canonical ordering established by the server. Without a central authority determining the "true" order of operations, different clients could apply different transformations and diverge. This is why all editors of the same document must connect to the same server — it is the single source of truth for operation ordering.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "OT requires a central server only for performance reasons — it could work without one, but would be slower",
              isCorrect: false,
            },
            {
              id: "b",
              text: "OT needs a canonical operation ordering from a single authority; all document editors must connect to the same server",
              isCorrect: true,
            },
            {
              id: "c",
              text: "OT operations are too computationally expensive for clients, so they must be centralized",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The server stores the OT transformation matrix which is too large to distribute to clients",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Consistent hashing for WebSocket routing",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When horizontally scaling the Document Service, a consistent hash ring is used to route WebSocket connections. What happens when a client initially connects to the wrong server?",
        explanation:
          "The client can connect to any server initially via round-robin HTTP. That server checks the hash ring configuration for the documentId. If it's not responsible for that hash range, it responds with a redirect to the correct server's address. The client then connects directly to the right server, which upgrades the connection to a WebSocket. This avoids routing all traffic through a proxy.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The connection is rejected and the client must retry with a different server address",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The server responds with a redirect to the correct server, and the client connects directly to that server for the WebSocket upgrade",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The server forwards the document operations to the correct server via an internal message bus",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The server proxies all WebSocket traffic to the correct server, acting as a transparent relay",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Why Cassandra for document operations",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Why is Cassandra chosen for the Document Operations DB rather than a relational database like PostgreSQL?",
        explanation:
          "Document operations are append-only, high-frequency writes partitioned by documentId — a perfect fit for Cassandra's LSM-tree based architecture. Cassandra excels at append-only writes with predictable partitioning. PostgreSQL is used for the Document Metadata DB where flexible querying is needed, but it would struggle with the write throughput required for real-time operations across millions of documents.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Cassandra provides stronger consistency guarantees than PostgreSQL",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Operations are append-only, high-frequency writes partitioned by docId — ideal for Cassandra's LSM-tree write path",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Cassandra is the only database that supports time-ordered data",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Cassandra supports multi-document transactions needed for OT consistency",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Client-side OT necessity",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In an OT-based collaborative editor, the client also performs Operational Transformation — not just the server. Why is client-side OT necessary even though the server already transforms operations?",
        explanation:
          "Users apply their own edits immediately to their local document (optimistic update) for instant feedback. If another user's edit is confirmed by the server while the local edit is still in-flight, the local document state has diverged from the server's operation history. The client must transform the incoming remote operation against its locally-applied-but-unconfirmed operation to ensure convergence. Without client-side OT, the client would see a corrupted document state until it reloads.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Client-side OT is optional — it only improves perceived latency but is not required for correctness",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Client-side OT reduces server load by offloading transformation work",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The server only transforms operations for storage; clients need separate transforms for display",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Local edits are applied optimistically before server confirmation; incoming remote operations must be transformed against unconfirmed local operations to maintain convergence",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Online vs offline compaction tradeoffs",
      type: "question",
      sectionId: "sec_q_compaction",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "An engineering team is debating between offline compaction (separate Compaction Service) and online compaction (Document Service compacts when last client disconnects). What is the strongest advantage of online compaction?",
        explanation:
          "When the last client disconnects, the Document Service has exclusive ownership of the document and all operations already loaded in memory. This eliminates the distributed coordination problem entirely — no need for documentVersionId flips, no risk of corrupting an active editing session, and no separate service to monitor. The tradeoff is increased CPU load on the Document Service at the tail (P99 latency risk), mitigated by running compaction in a lower-priority process.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Online compaction is faster because it uses the Document Service's powerful hardware",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The Document Service has exclusive ownership and in-memory state after disconnect, eliminating distributed coordination entirely",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Online compaction produces better compression ratios than offline compaction",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Online compaction can compact documents while users are still editing, whereas offline compaction cannot",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Core non-functional requirements for Google Docs",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid non-functional requirements for a Google Docs-like collaborative editor:",
        explanation:
          "Eventual consistency, low latency updates, horizontal scalability, and document durability are all core NFRs. Strong consistency is not required — eventual consistency is explicitly stated. Unlimited concurrent editors is explicitly capped at 100 to simplify the architecture.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Unlimited concurrent editors per document",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Updates should have low latency (< 100ms)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Documents should be eventually consistent across all users",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Documents should be durable and available even if the server restarts",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Strong consistency — every read must return the most recent write",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "CRDT advantages over OT",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL advantages that CRDTs have over Operational Transformation for collaborative editing:",
        explanation:
          "CRDTs do not require a central server (operations are commutative by design), natively support peer-to-peer architectures, and handle offline editing gracefully (buffer edits locally, merge on reconnect). CRDTs actually use MORE memory (tombstones mean documents only grow, never shrink) and are less computationally efficient than OT, not more.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "More computationally efficient than OT for text operations",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Better suited for offline editing — edits can be buffered locally and merged on reconnect",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Native support for peer-to-peer architectures (e.g., WebRTC)",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Lower memory usage because CRDTs compress operations efficiently",
              isCorrect: false,
            },
            {
              id: "e",
              text: "No central server required — operations can be applied in any order",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Challenges when scaling the hash ring",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL challenges that arise when adding or removing servers from the consistent hash ring in the Google Docs architecture:",
        explanation:
          "Scaling events require tracking old and new hash rings simultaneously, transferring both WebSocket connections and document state, implementing client-side reconnection logic, and monitoring for connection distribution hotspots. The hash ring is managed by ZooKeeper, not Cassandra.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Must track both old and new hash rings during transitions",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Connection distribution must be monitored to prevent server hotspots",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Displaced users must be disconnected and forced to reconnect to the correct server",
              isCorrect: true,
            },
            {
              id: "d",
              text: "The Cassandra database must be rebalanced whenever the hash ring changes",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Client-side reconnection logic must handle server unavailability gracefully",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Properties needed for offline compaction safety",
      type: "question",
      sectionId: "sec_q_compaction",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL properties that the offline Compaction Service must satisfy to safely compact document operations without corrupting active editing sessions:",
        explanation:
          "The Compaction Service writes under a new documentVersionId (document-level atomicity). The Document Service must reject flips for actively-loaded documents (no corruption of live sessions). All version flips go through the Document Service (central coordination). The Compaction Service must be throttled to avoid overloading the database. Clients do NOT need notification — they always load via the latest documentVersionId on their next connection.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Connected clients must be notified to reload when compaction completes",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The Document Service can reject version flips for actively-loaded documents",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The Compaction Service must be throttled to avoid overloading the DB with reads/writes",
              isCorrect: true,
            },
            {
              id: "d",
              text: "All documentVersionId flips are coordinated through the Document Service",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Compact operations are written under a new documentVersionId for atomicity",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "OT vs CRDT tradeoff analysis",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare Operational Transformation (OT) and Conflict-free Replicated Data Types (CRDTs) for a collaborative document editor. Discuss memory usage, architectural requirements, offline support, and when each approach is more appropriate.",
        explanation:
          "A strong answer covers: OT requires central server but has low memory; CRDTs are decentralized but use more memory (tombstones). OT is better for centralized, low-collaborator-count apps; CRDTs for P2P, offline-first, or large-collaborator-count apps.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Operational Transformation (OT) transforms operations against preceding edits on a central server. It uses low memory because operations can be discarded after application, and is well-suited to text editing. However, it requires a central authority for canonical ordering, limiting it to a small number of collaborators per server, and offline support is complicated.\n\nCRDTs make operations commutative using unique position identifiers and tombstones. They require no central server, enabling peer-to-peer (WebRTC) and offline editing (buffer locally, merge on reconnect). However, tombstones mean documents only grow in size, increasing memory usage. They are less computationally efficient, though optimized implementations like Yjs mitigate this.\n\nChoose OT for: centralized architectures with moderate collaborator counts (like Google Docs with ≤100 editors), where low memory and text optimization matter.\n\nChoose CRDTs for: peer-to-peer applications, offline-first use cases, or systems needing massive collaborator counts. Figma is a notable example that uses CRDTs with practical compromises for production use.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "WebSocket vs polling for real-time updates",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain why Google Docs uses WebSocket connections rather than HTTP long-polling or server-sent events (SSE). Discuss the architecture implications of using WebSockets, including how they affect the statefulness of the Document Service.",
        explanation:
          "A strong answer explains the bi-directional requirement, discusses statefulness implications, and mentions the strategy of terminating WebSockets at the edge.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Google Docs requires bi-directional, low-latency communication. Users send edits to the server AND the server pushes other users' edits back. SSE only supports server-to-client communication, so edits would still need separate HTTP requests. Long-polling introduces latency between each poll cycle and creates overhead from repeated connection setup.\n\nWebSockets provide persistent, bi-directional connections with minimal overhead after the initial handshake. This enables sub-100ms update latency.\n\nThe architecture implication is that WebSockets make the Document Service stateful — each server must maintain active socket connections in memory. This complicates horizontal scaling because you can't simply load-balance requests to any server. All editors of the same document must connect to the same server instance.\n\nA best practice is to terminate WebSockets at the \"edge\" of the design, exposing an internal API to backend services. This way, only the Document Service deals with WebSocket statefulness, while other systems (metadata service, compaction service) remain stateless and simpler to scale.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the consistent hashing scaling strategy",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the scaling strategy for the Document Service using consistent hashing. Explain the connection flow when a new client joins, how ZooKeeper is used, and the challenges during scaling events when servers are added or removed.",
        explanation:
          "A staff-level answer covers the full connection flow (HTTP → hash ring check → redirect → WebSocket upgrade), ZooKeeper's role in hash ring coordination, and the detailed challenges of scaling events including connection migration, dual ring tracking, and capacity planning.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Connection flow:\n1. Client opens an HTTP connection to any Document Service server (via round-robin load balancer) with the documentId.\n2. That server hashes the documentId and checks the consistent hash ring (configuration maintained in ZooKeeper) to determine the responsible server.\n3. If the server is not responsible, it responds with a redirect containing the correct server's address.\n4. The client connects to the correct server, which upgrades the HTTP connection to a WebSocket.\n5. The server loads document operations from Cassandra (if not cached in memory) and pushes them to the client.\n6. The server maintains a map of documentId → list of WebSocket connections for broadcasting.\n\nZooKeeper's role:\n- Maintains the hash ring configuration (which servers own which ranges).\n- Servers periodically check ZooKeeper for ring changes.\n- Provides leader election and coordination during membership changes.\n- Detects server failures via ephemeral nodes.\n\nScaling challenges:\n- Must track both old and new hash rings simultaneously during transitions.\n- Displaced connections must be gracefully closed (the server disconnects affected clients, who auto-reconnect to the new correct server).\n- Document operations state must transfer to the new owner — either the new server loads from DB, or state is directly transferred.\n- Server failures require immediate hash ring updates and quick connection redistribution.\n- Must monitor connection distribution to prevent hotspots (popular documents could skew load).\n- Capacity planning must ensure each server has sufficient memory/CPU for its connection load.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Storage compaction design",
      type: "question",
      sectionId: "sec_q_compaction",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a storage compaction strategy for the Document Operations DB. Compare the offline Compaction Service approach with the online Document Service approach. Address the coordination challenges, atomicity guarantees, and impact on tail latency.",
        explanation:
          "A staff-level answer discusses both approaches in depth, explains the documentVersionId mechanism for atomicity, addresses the coordination risks of offline compaction, and discusses the P99 latency risk of online compaction.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The Document Operations DB (Cassandra) stores every edit as an append-only operation. Over time, documents accumulate millions of operations, consuming storage and making document loading slow for new clients.\n\nOffline Compaction Service:\nA separate service periodically reads operations for a document, compacts them into a single insert operation, writes them under a new documentVersionId, and requests the Document Service to flip the version. The documentVersionId in the Metadata DB provides document-level atomicity (since Cassandra only offers row-level transactions).\n\nCoordination challenges: The Document Service must reject version flips for actively-edited documents to avoid corrupting live sessions. All flips go through the Document Service as a coordination point. The Compaction Service can generate significant read/write load and must be throttled to avoid impacting production traffic.\n\nOnline Compaction (Document Service):\nWhen the last client disconnects from a document, the Document Service already has all operations in memory and exclusive ownership. It offloads compaction to a low-priority subprocess, writes results under a new documentVersionId, and updates the Metadata DB.\n\nAdvantages: No distributed coordination needed — the Document Service knows definitively whether a document is active. Eliminates race conditions between compaction and live editing.\n\nTail latency risk: Running compaction in the Document Service risks increasing P99 latency for concurrent editing operations. Mitigation: run compaction in a separate OS process with lower CPU nice priority (not just a thread — a separate process with OS-level priority isolation).\n\nRecommendation: Online compaction for most documents (simple, safe). Offline compaction as a fallback for documents that are always active and never have zero connections.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "End-to-end data flow for a single edit",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Trace the complete lifecycle of a single character insertion from keystroke to all collaborators seeing the change. Include client-side OT, server-side OT, persistence, and broadcast. Explain what happens if another user's edit arrives at the server first.",
        explanation:
          "A staff-level answer traces: local apply → WebSocket send → server receives → server OT transforms against pending ops → persist to Cassandra → ACK to sender → broadcast transformed op to other clients → other clients apply OT locally.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Complete lifecycle of User A typing \"x\" at position 5:\n\n1. Client-side (User A): The keystroke is immediately applied to User A's local document (optimistic update). The operation INSERT(5, \"x\") is sent over the WebSocket to the Document Service. User A sees the change instantly.\n\n2. Server receives: The Document Service receives INSERT(5, \"x\") from User A. It places the operation in the document's operation queue.\n\n3. Server-side OT: The server applies OT against any operations that have been confirmed since User A's last acknowledged operation. For example, if User B's DELETE(3) was confirmed while User A's edit was in transit, the server transforms User A's INSERT(5, \"x\") to INSERT(4, \"x\") (shifted left by one due to the deletion before position 5).\n\n4. Persistence: The transformed operation is appended to the Document Operations DB (Cassandra), partitioned by documentId and ordered by timestamp.\n\n5. ACK to User A: The server sends an acknowledgement to User A, including the server's version number. User A updates its local state to reflect the server-confirmed version.\n\n6. Broadcast: The server sends the transformed operation to all other connected clients (User B, User C, etc.) via their WebSocket connections.\n\n7. Client-side OT (other users): Each receiving client applies OT to the incoming operation. If User B has unconfirmed local edits (applied optimistically but not yet ACKed by the server), User B's client transforms the incoming operation against those pending local edits before applying it. This ensures all clients converge on the same document regardless of the local ordering of operations.\n\nIf User B's edit arrives first: The server processes User B's operation first, confirming it at a certain version. When User A's operation arrives, the server detects it was based on an older version and transforms it against all operations confirmed since that version (including User B's). The result is the same final document regardless of arrival order — this is the core guarantee of OT.",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Staff-level interview walkthrough",
      type: "question",
      sectionId: "sec_q_compaction",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are in a Staff Engineer system design interview. The interviewer asks you to design Google Docs. Walk through how you would structure your 45-minute interview: what you cover first, how you allocate time, and which 2-3 deep dives you would choose and why.",
        explanation:
          "A staff-level answer shows interview meta-strategy: fast requirements/scope, efficient HLD with OT/CRDT discussion, then deep dives on WebSocket scaling and storage compaction that showcase real experience.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "First 5 minutes — Requirements & Scope:\nQuickly establish functional requirements (create docs, concurrent editing, real-time updates, cursor presence) and non-functional requirements (eventual consistency, <100ms latency, millions of concurrent users, ≤100 editors per document, durability). Clarify out-of-scope items (rich text formatting, permissions, versioning). Define core entities: Editor, Document, Edit, Cursor.\n\nMinutes 5-15 — High-Level Design:\nSketch the architecture: API Gateway → Document Metadata Service (Postgres) for CRUD. Document Service for WebSocket connections and OT. Document Operations DB (Cassandra) for append-only operation storage. Walk through the three approaches (snapshots → raw edits → OT/CRDT) quickly, establish that OT is the right choice for this problem, and explain why with a brief worked example. Show the write path (client → WS → OT → Cassandra → ACK + broadcast) and read path (connect → load ops → push to client). Cover cursor presence as in-memory ephemeral state.\n\nMinutes 15-40 — Deep Dives (60% of time):\n\n1. Scaling WebSocket connections with consistent hashing (12 min): Walk through the hash ring with ZooKeeper coordination, connection flow with redirect, and the detailed challenges during scaling events. This demonstrates understanding of stateful service scaling — a rare and valuable skill.\n\n2. Storage compaction strategies (8 min): Compare offline vs online compaction, explain documentVersionId for atomicity, discuss the P99 latency implications. Proactively identify that online compaction is simpler and safer, with offline as fallback.\n\n3. Client-side OT and convergence guarantees (5 min): Explain why the client needs OT too, walk through the case where local optimistic edits conflict with incoming remote operations. This shows depth of understanding beyond the typical server-side-only explanation.\n\nMinutes 40-45 — Extensions:\nBriefly discuss read-only mode scaling (separate read replicas, no OT needed), offline mode (where CRDTs become attractive), and versioning (snapshots as version checkpoints).",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Name the consistency approach",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What is the name of the approach used by Google Docs where a central server reinterprets each edit based on preceding edits to maintain consistency across concurrent editors?",
        explanation:
          "Operational Transformation (OT) transforms each operation against preceding operations to account for concurrent edits. It requires a central server for canonical ordering and is used by Google Docs for its low memory and text-editing advantages.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Operational Transformation",
          acceptableAnswers: [
            "Operational Transformation",
            "OT",
            "operational transformation",
            "Operational transformation",
            "operational Transformation",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Coordination service for hash ring",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What distributed coordination service is used to maintain the consistent hash ring configuration and coordinate between Document Service servers?",
        explanation:
          "Apache ZooKeeper maintains the hash ring configuration, detects server failures, and coordinates membership changes. It provides the centralized coordination needed for servers to agree on which hash ranges they are responsible for.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Apache ZooKeeper",
          acceptableAnswers: [
            "Apache ZooKeeper",
            "ZooKeeper",
            "zookeeper",
            "Zookeeper",
            "apache zookeeper",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "CRDT deletion mechanism",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In a CRDT-based collaborative editor, what mechanism is used instead of actually removing deleted text from the document? (This is a key reason why CRDT documents only grow in size.)",
        explanation:
          "CRDTs use tombstones — deleted text is marked as deleted rather than physically removed. This is necessary because the deletion must be applied consistently regardless of operation order. Tombstones mean the document data structure only grows, never shrinks, which is a major memory disadvantage compared to OT.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Tombstones",
          acceptableAnswers: [
            "Tombstones",
            "tombstones",
            "tombstone",
            "Tombstone",
            "soft delete",
            "soft deletes",
            "tombstone markers",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Atomicity mechanism for compaction",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "What identifier is stored in the Document Metadata DB to provide document-level atomicity for compaction operations, given that Cassandra only supports row-level transactions?",
        explanation:
          'The documentVersionId provides document-level atomicity for the compaction process. Before loading a document, the Document Service retrieves the current documentVersionId to know which operations to load. Compaction writes new operations under a new documentVersionId, and the "flip" to the new version is an atomic metadata update that switches which operations are active.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "documentVersionId",
          acceptableAnswers: [
            "documentVersionId",
            "document version ID",
            "document version id",
            "documentversionid",
            "version ID",
            "versionId",
          ],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match components to their storage backend",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content:
          "Match each system component to its storage backend in the Google Docs architecture:",
        explanation:
          "Document metadata (title, permissions, versionId) goes to Postgres for flexible querying. Document operations (append-only edits) go to Cassandra for high write throughput. Cursor position and presence are ephemeral and stored in-memory on the Document Service.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            { left: "Document metadata (title, versionId)", right: "PostgreSQL" },
            { left: "Document operations (edit history)", right: "Cassandra" },
            { left: "Cursor position & user presence", right: "In-memory (Document Service)" },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match collaborative editing approach to characteristic",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each collaborative editing approach to its defining characteristic:",
        explanation:
          "OT transforms operations on a central server to maintain a canonical order. CRDTs use commutative operations with unique position IDs so order doesn't matter. Snapshot-based editing is the naive approach where last-write-wins. Yjs is the most popular open-source CRDT library for JavaScript.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              left: "Operational Transformation",
              right: "Central server transforms edits against preceding operations",
            },
            {
              left: "CRDTs",
              right: "Commutative operations using unique position identifiers and tombstones",
            },
            {
              left: "Snapshot-based editing",
              right: "Last-write-wins race condition — concurrent edits are lost",
            },
            {
              left: "Yjs",
              right: "Open-source CRDT library for lightweight collaborative applications",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match scaling concern to solution",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each scaling concern in the Google Docs architecture to its solution:",
        explanation:
          "Millions of WebSocket connections are handled by consistent hashing to distribute documents across servers. Growing operation history is managed by periodic compaction (snapshot/compact). Coordinating hash ring membership uses ZooKeeper. Reducing document load time for new clients uses documentVersionId-based compaction to collapse operations into a single snapshot.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              left: "Millions of concurrent WebSocket connections",
              right: "Consistent hash ring distributing documents across servers",
            },
            {
              left: "Ever-growing operation history in Cassandra",
              right: "Periodic snapshot/compaction collapsing operations",
            },
            {
              left: "Coordinating server membership changes",
              right: "Apache ZooKeeper maintaining hash ring configuration",
            },
            {
              left: "Slow document loading for new clients",
              right: "DocumentVersionId-based compaction reducing operation count",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "Collaborative editing consistency model",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Google Docs requires documents to be _____ consistent, meaning all users should _____ see the same document state.",
        explanation:
          "The system uses eventual consistency — all users will eventually converge on the same document state, but at any given moment they may see slightly different states due to in-flight operations. This is the right consistency model for a collaborative editor where low latency is prioritized over immediate consistency.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            {
              id: "blank1",
              correctAnswer: "eventually",
              acceptableAnswers: ["eventually"],
            },
            {
              id: "blank2",
              correctAnswer: "eventually",
              acceptableAnswers: ["eventually"],
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Max concurrent editors",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The system limits concurrent editors per document to _____, and users beyond this limit can only join as _____.",
        explanation:
          "Limiting to 100 concurrent editors per document is an explicit non-functional requirement. Beyond this limit, additional users join as readers. This constraint simplifies the architecture — you don't need to worry about massive single-document throughput, only per-document consistency.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            {
              id: "blank1",
              correctAnswer: "100",
              acceptableAnswers: ["100", "one hundred"],
            },
            {
              id: "blank2",
              correctAnswer: "readers",
              acceptableAnswers: ["readers", "read-only users", "viewers"],
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "OT operation transformation",
      type: "question",
      sectionId: "sec_q_consistency",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "In OT, if User A's INSERT(5, \", world\") arrives before User B's DELETE(6), the server transforms User B's operation to DELETE(_____) to account for the _____ characters inserted before the deletion point.",
        explanation:
          "User A inserted \", world\" (7 characters) at position 5. User B's DELETE(6) was intended to delete position 6 in the original document. After User A's insert, the character at original position 6 has shifted to position 13 (6 + 7 = 13). OT transforms DELETE(6) to DELETE(13) so it deletes the correct character.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            {
              id: "blank1",
              correctAnswer: "13",
              acceptableAnswers: ["13"],
            },
            {
              id: "blank2",
              correctAnswer: "7",
              acceptableAnswers: ["7", "seven"],
            },
          ],
        },
      },
    },

    // --- Numerical (2 questions) ---

    // Numerical 1 — medium
    {
      title: "Storage estimation for document corpus",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "If the system stores 1 billion documents with an average size of 50 KB per document, how many terabytes of raw document storage is needed? (Answer in TB)",
        explanation:
          "1 billion documents × 50 KB = 50 × 10^9 KB = 50 × 10^6 MB = 50 × 10^3 GB = 50 TB. This doesn't include operation history, which can be significantly larger before compaction.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 50,
          tolerance: 5,
          unit: "TB",
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "WebSocket server capacity planning",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "If the system must support 10 million concurrent WebSocket connections, and each Document Service server can handle 50,000 concurrent connections, how many Document Service servers are needed at minimum? (Assume no replication overhead)",
        explanation:
          "10,000,000 concurrent connections ÷ 50,000 connections per server = 200 servers. In practice you would provision more for headroom, failure handling, and uneven distribution from consistent hashing. But the minimum is 200.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 200,
          tolerance: 10,
          unit: "servers",
        },
      },
    },
  ],
};
