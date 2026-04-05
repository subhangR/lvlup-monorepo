/**
 * WhatsApp (Real-time Messaging) — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: WebSocket architecture, pub/sub message routing, offline delivery,
 * media handling, multi-device support, heartbeats, and scaling to billions of users
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const whatsappContent: StoryPointSeed = {
  title: "Design WhatsApp (Real-time Messaging)",
  description:
    "Master the system design of a real-time messaging platform — covering WebSocket connections, pub/sub message routing, offline message delivery, media handling via pre-signed URLs, multi-device support, and scaling to billions of concurrent users.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_requirements", title: "Requirements & Core Architecture", orderIndex: 1 },
    { id: "sec_q_scaling", title: "Scaling & Pub/Sub Routing", orderIndex: 2 },
    { id: "sec_q_delivery", title: "Message Delivery & Reliability", orderIndex: 3 },
    { id: "sec_q_advanced", title: "Multi-Device, Data Model & Advanced Topics", orderIndex: 4 },
    { id: "sec_q_capacity", title: "Capacity Estimation & Performance", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Design
    {
      title: "WhatsApp — Requirements & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "WhatsApp — Requirements & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is WhatsApp?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "WhatsApp is a messaging service that allows users to send and receive encrypted messages and calls from their phones and computers. It is famously built on Erlang and renowned for handling high scale with limited engineering and infrastructure outlay. Designing WhatsApp tests your understanding of real-time communication, durable message delivery, and scaling persistent connections.",
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
                  "Users should be able to start group chats with multiple participants (limit 100).",
                  "Users should be able to send/receive messages in real-time.",
                  "Users should be able to receive messages sent while they were offline (up to 30 days).",
                  "Users should be able to send/receive media (images, video) in their messages.",
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
                  "Low latency: Messages should be delivered to available users in < 500ms.",
                  "Deliverability: Every message must eventually reach the recipient — no message loss.",
                  "Scale: Support billions of users with high throughput (~100K writes/second).",
                  "Minimal server-side storage: Messages stored on centralized servers no longer than necessary.",
                  "Resilience: System should tolerate failures of individual components.",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 2 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "User: A registered person with one or more devices.",
                  "Chat: A conversation between 2–100 participants.",
                  "Message: Text or media sent within a chat.",
                  "Client: A specific device belonging to a user (phone, tablet, laptop).",
                ],
              },
            },
            {
              id: "b9",
              type: "heading",
              content: "API Design — WebSocket Commands",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "paragraph",
              content:
                "Unlike REST-based systems, a chat app requires high-frequency bi-directional updates. WebSockets (over TLS) provide persistent connections for low-latency message exchange. Users connect and exchange commands over the socket.",
            },
            {
              id: "b11",
              type: "code",
              content:
                '// Client → Server commands\ncreateChat({ participants: [], name: "" }) → { chatId: "" }\nsendMessage({ chatId: "", message: "", attachments: [] }) → { status: "SUCCESS"|"FAILURE", messageId: "" }\nmodifyChatParticipants({ chatId: "", userId: "", operation: "ADD"|"REMOVE" }) → "SUCCESS"|"FAILURE"\n\n// Server → Client commands (client must ACK)\nchatUpdate({ chatId: "", participants: [] }) → "RECEIVED"\nnewMessage({ chatId: "", userId: "", message: "", attachments: [] }) → "RECEIVED"',
              metadata: { language: "text" },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "The client ACK mechanism is crucial — by forcing clients to acknowledge received messages, the server knows for certain whether a message has been delivered. Unacknowledged messages remain in the Inbox for later delivery.",
            },
            {
              id: "b13",
              type: "heading",
              content: "Data Model — DynamoDB Tables",
              metadata: { level: 2 },
            },
            {
              id: "b14",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Chat table: Primary key = chatId. Stores chat metadata.",
                  'ChatParticipant table: Composite key (chatId, participantId). GSI on participantId for "all chats for a user" queries.',
                  "Message table: Stores message content. Looked up by messageId.",
                  "Inbox table: Per-user (or per-client) queue of undelivered message IDs. Entries deleted after client ACK.",
                ],
              },
            },
            {
              id: "b15",
              type: "heading",
              content: "High-Level Message Flow (Single Server)",
              metadata: { level: 2 },
            },
            {
              id: "b16",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Sender sends a sendMessage command to the Chat Server over WebSocket.",
                  "Chat Server looks up all participants via the ChatParticipant table.",
                  "Chat Server writes the message to the Message table and creates an Inbox entry for each recipient.",
                  "Chat Server returns SUCCESS/FAILURE to the sender.",
                  "Chat Server looks up WebSocket connections for each participant and delivers the message.",
                  "Connected clients send ACK → Chat Server deletes their Inbox entry.",
                  "Offline clients receive messages when they reconnect and sync from Inbox.",
                ],
              },
            },
            {
              id: "b17",
              type: "paragraph",
              content:
                "Items in the Inbox and Message tables have a TTL of 30 days, after which they are automatically cleaned up. This ensures messages are not stored on centralized servers longer than necessary.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Deep Dives — Scaling & Pub/Sub
    {
      title: "Deep Dives — Scaling to Billions & Pub/Sub Routing",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Scaling to Billions & Pub/Sub Routing",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "The Scaling Problem",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "With 1B users and ~200M connected simultaneously (WhatsApp famously served 1–2M per host), we need hundreds of Chat Servers. The core problem: sender and recipient may be on different servers. User A on Chat Server 1 sends a message to User C on Chat Server 2 — how does the message get routed?",
            },
            {
              id: "c3",
              type: "heading",
              content: "Bad: Naive Horizontal Scaling",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "Simply adding Chat Servers behind a load balancer does not work. A server receiving a sendMessage may not have WebSocket connections to all recipients. Messages cannot be delivered. Similarly, creating a Kafka topic per user fails — Kafka is not built for billions of topics (~50KB overhead per topic = 50TB+ for 1B users).",
            },
            {
              id: "c5",
              type: "heading",
              content: "Good: Consistent Hashing",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "Assign users to specific Chat Servers based on their userId via consistent hashing. A central registry (ZooKeeper/etcd) tracks server assignments. When Chat Server 1 needs to deliver to a user on Chat Server 2, it connects directly. Downside: servers must maintain connections to each other (mesh), scaling the number of servers requires careful connection draining to avoid thundering herds, and you must dual-publish during rebalancing to prevent message loss.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Great: Redis Pub/Sub",
              metadata: { level: 2 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Redis Pub/Sub provides lightweight in-memory message routing without the overhead of persistent storage. When a user connects, their Chat Server subscribes to a Redis channel for that userId. To deliver a message, the server publishes to the recipient's channel. Redis forwards it to whichever Chat Server is subscribed.",
            },
            {
              id: "c9",
              type: "paragraph",
              content:
                'Redis Pub/Sub is "at most once" — if no subscriber is listening or Redis has a transient failure, the message is lost. This is acceptable because we write to the Inbox and Message tables BEFORE publishing to Pub/Sub. The durable write path: (1) Write to Message table + create Inbox entries, (2) Return success to sender, (3) Publish to Pub/Sub for real-time delivery (best-effort). If step 3 fails, the message is still durably stored and recipients get it when they reconnect via Inbox sync.',
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "Pub/Sub channels are extremely lightweight compared to Kafka topics — they are essentially in-memory pointers to subscriber connections with no message persistence or disk I/O. Canva benchmarked 100,000 messages/second on a single Redis host at 27% utilization. In practice, shard across a Redis cluster partitioned by userId.",
            },
            {
              id: "c11",
              type: "heading",
              content: "Partition by User vs. by Chat",
              metadata: { level: 2 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                "Should Pub/Sub channels be per-user or per-chat? For WhatsApp (dominated by 1:1 chats), per-user is better. If a user has 250 chats with 1 other participant each, per-chat means 250 subscriptions per user vs. 1 subscription per user with per-user partitioning. Per-chat wins only when chats have many participants (publishing to 1 chat channel vs. 99 user channels). For a hybrid approach, use per-user channels by default and switch to per-chat channels for groups above a threshold (e.g., 25 participants).",
            },
            {
              id: "c13",
              type: "heading",
              content: "L4 vs. L7 Load Balancer",
              metadata: { level: 2 },
            },
            {
              id: "c14",
              type: "paragraph",
              content:
                "An L4 (transport layer) load balancer is sufficient and preferred for WebSocket connections. L7 load balancers shine for HTTP path/header-based routing and spreading HTTP requests across servers — neither applies to long-lived WebSocket connections. L4 is also generally higher performance than L7 for this use case.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Reliability, Multi-Device & Advanced Topics
    {
      title: "Reliability, Multi-Device Support & Advanced Topics",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Reliability, Multi-Device Support & Advanced Topics",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Media Handling via Pre-Signed URLs",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "Storing media in the database is a bad solution — databases are not optimized for large binary blobs and it wastes Chat Server bandwidth. The best approach: clients request a pre-signed URL from the Chat Server, upload directly to blob storage (S3), then send the attachment URL as an opaque reference in the message. Recipients download media directly from blob storage using another pre-signed URL. Media gets a 30-day TTL matching the message retention policy.",
            },
            {
              id: "d3",
              type: "heading",
              content: "Detecting Dead WebSocket Connections",
              metadata: { level: 2 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "TCP keepalives take minutes to detect dead connections — far too slow for a chat app. The best solution is application-level heartbeats: the Chat Server sends periodic pings (every 10–30 seconds) over the WebSocket. Clients must respond with a pong within a timeout (e.g., 5 seconds). If no response, the server closes the connection. With a 10s interval and 5s timeout, any dead connection is detected within 15 seconds. With 200M connected users and a 10s interval, that is 20M ping/pong exchanges per second — tiny messages, easily handled.",
            },
            {
              id: "d5",
              type: "heading",
              content: "Handling Missed Pub/Sub Messages",
              metadata: { level: 2 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Since Redis Pub/Sub is at-most-once, connected clients can miss messages. Three strategies work together: (1) Periodic polling — clients sync every 30–60s, checking Inbox for undelivered messages. (2) Sequence numbers per chat — each message gets a monotonic sequence number; clients detect gaps and request re-sync. (3) Piggyback sequence on heartbeats (best) — the server includes the user's current global sequence number in heartbeat pings. If the client's local sequence is behind, it immediately syncs. This detects missed messages within one heartbeat interval with minimal overhead.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Multi-Device Support",
              metadata: { level: 2 },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "Users may have multiple devices (phone, tablet, laptop). Changes needed: (1) A Clients table tracks devices per user. (2) The Inbox becomes per-client instead of per-user — each device tracks delivery independently. (3) When sending messages, deliver to ALL connected clients for a user. (4) On the Pub/Sub side, nothing changes — Chat Servers subscribe per-userId and forward to all connected client sockets. Limit to ~3 clients per account to bound storage and throughput.",
            },
            {
              id: "d9",
              type: "heading",
              content: "Message Ordering",
              metadata: { level: 2 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                'Strict ordering in distributed systems requires expensive coordination. WhatsApp takes the pragmatic approach: stamp each message with the server-received timestamp (Chat Servers sync via NTP). Clients display messages ordered by this timestamp. Occasionally a message may appear "above" an earlier one — users find this acceptable. This avoids the complexity of reordering buffers (like Flink\'s watermark strategy) for the chat use case.',
            },
            {
              id: "d11",
              type: "heading",
              content: '"Last Seen" Functionality',
              metadata: { level: 2 },
            },
            {
              id: "d12",
              type: "paragraph",
              content:
                'Writing to the database on every heartbeat creates massive write amplification (200M users × heartbeat every 10–30s = millions of writes/second). Better approach: maintain a LastSeen table that records the timestamp only when a user disconnects. For "last seen" queries, check (1) the LastSeen table for the stored disconnect time, and (2) via Pub/Sub, ask the target user\'s Chat Server if the user is currently connected. Merge responses: if the server reports "ONLINE", show green; otherwise show the last disconnect time. This reduces writes to one per disconnect event.',
            },
            {
              id: "d13",
              type: "heading",
              content: "What Distinguishes Staff-Level Answers",
              metadata: { level: 2 },
            },
            {
              id: "d14",
              type: "quote",
              content:
                "Staff candidates quickly recognize the single-server limitation and proactively propose pub/sub routing. They discuss per-user vs. per-chat partitioning tradeoffs, adaptive channel strategies for large groups, heartbeat-based gap detection, multi-device inbox management, and the interaction between at-most-once pub/sub and durable inbox writes — all without being prompted. They go 2–3 levels deep on failure modes, bottlenecks, and regional deployment.",
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
      title: "Protocol choice for real-time chat",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Which protocol is most appropriate for a real-time chat application like WhatsApp, and why?",
        explanation:
          "WebSockets provide a persistent, bi-directional connection between client and server, enabling low-latency message exchange in both directions. HTTP polling wastes bandwidth and adds latency. Server-Sent Events are unidirectional (server-to-client only). gRPC streaming could work but adds unnecessary complexity for this use case and has limited browser support.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Short polling every 500ms — simple and works with standard HTTP infrastructure",
              isCorrect: false,
            },
            {
              id: "b",
              text: "HTTP long polling — the client holds an open request until the server has data",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Server-Sent Events (SSE) — the server pushes updates to the client over HTTP",
              isCorrect: false,
            },
            {
              id: "d",
              text: "WebSockets — persistent bi-directional connection enabling low-latency send and receive",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Load balancer layer for WebSocket connections",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When placing a load balancer in front of Chat Servers that use WebSocket connections, which layer is preferred and why?",
        explanation:
          "An L4 (transport layer) load balancer is sufficient because we do not need HTTP path/header-based routing for long-lived WebSocket connections. L7 load balancers shine for request-level routing and distributing HTTP requests across servers, but neither capability is needed here. L4 is also generally higher performance.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "L7 — necessary for TLS termination which cannot be done at L4",
              isCorrect: false,
            },
            {
              id: "b",
              text: "L7 (application layer) — required to inspect WebSocket frames and route messages",
              isCorrect: false,
            },
            {
              id: "c",
              text: "No load balancer is needed — consistent hashing handles all routing",
              isCorrect: false,
            },
            {
              id: "d",
              text: "L4 (transport layer) — no need for HTTP-level routing; WebSocket connections are long-lived and L4 is higher performance",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Purpose of client ACK in message delivery",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why does the WhatsApp design require clients to send an ACK (acknowledgement) after receiving a message?",
        explanation:
          "The ACK confirms the message has been delivered all the way to the client. Without it, the server cannot distinguish between a delivered message and one lost in transit. Once ACKed, the server deletes the message from the Inbox table. Unacknowledged messages remain for later delivery.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "To maintain message ordering across distributed servers",
              isCorrect: false,
            },
            {
              id: "b",
              text: "To prevent duplicate message delivery by deduplicating at the client",
              isCorrect: false,
            },
            {
              id: "c",
              text: "To provide read receipts (blue checkmarks) to the sender",
              isCorrect: false,
            },
            {
              id: "d",
              text: "To confirm delivery and allow the server to safely remove the message from the Inbox",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why Kafka fails for per-user message routing",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A candidate proposes creating a Kafka topic per user to route messages between Chat Servers. Why does this approach fail at WhatsApp scale?",
        explanation:
          "Kafka maintains significant per-topic overhead (~50KB for partition metadata, disk segments, consumer offsets). With 1 billion users, this means 50TB+ of overhead just for topic metadata — completely impractical. Kafka is designed for a moderate number of high-throughput topics, not billions of lightweight channels. Redis Pub/Sub channels, by contrast, are in-memory pointers with no disk persistence overhead.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Kafka has ~50KB overhead per topic (metadata, partitions, consumer offsets) — at 1B users this means 50TB+ of storage just for topic management",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Kafka has a hard limit of 10,000 topics per cluster that cannot be exceeded",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Kafka topics cannot be dynamically created and destroyed as users come online and go offline",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Kafka does not support pub/sub semantics — it only supports point-to-point queuing",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Redis Pub/Sub durability tradeoff",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'Redis Pub/Sub provides "at most once" delivery. Why is this acceptable for WhatsApp\'s real-time message routing?',
        explanation:
          "The design writes messages to the durable Message table and Inbox entries BEFORE publishing to Pub/Sub. Pub/Sub is a best-effort real-time delivery layer on top of guaranteed durable storage. If Pub/Sub fails, messages are still safely persisted and will be delivered when the client reconnects and syncs from the Inbox.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The WebSocket ACK mechanism retries indefinitely until Pub/Sub successfully delivers",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Messages are durably written to Message + Inbox tables before Pub/Sub publish — Pub/Sub is a best-effort real-time layer on top of guaranteed storage",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Chat messages are inherently ephemeral — losing some messages is acceptable user experience",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Redis Pub/Sub actually provides exactly-once delivery when configured correctly",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Media attachment architecture decision",
      type: "question",
      sectionId: "sec_q_delivery",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "What is the best approach for handling media attachments (images, video) in a WhatsApp-like system?",
        explanation:
          "The best approach is pre-signed URL upload. The client requests a pre-signed URL from the Chat Server, uploads directly to blob storage (S3), then sends the attachment URL as part of the message. This keeps media traffic off the Chat Servers entirely. Recipients download via their own pre-signed URL. Routing media through the Chat Server wastes bandwidth on dumb storage/retrieval. Storing blobs in DynamoDB is terrible — databases are not optimized for large binary data.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Store media blobs directly in the DynamoDB Message table alongside message text",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Client sends media over the WebSocket to the Chat Server, which forwards it to blob storage",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Use a separate HTTP media service that accepts uploads and returns CDN URLs for distribution",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Client uploads directly to blob storage via pre-signed URL, then sends the URL as a message attachment reference",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Consistent hashing vs Pub/Sub tradeoff",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In the consistent hashing approach for Chat Server routing, what is the primary operational challenge that makes Redis Pub/Sub a superior alternative?",
        explanation:
          "With consistent hashing, each Chat Server must maintain direct connections to every other Chat Server (mesh topology). Scaling the number of servers requires careful connection draining — abruptly reassigning users causes a thundering herd of reconnections. During rebalancing, messages must be dual-published to both old and new servers to prevent message loss. Redis Pub/Sub eliminates this by decoupling servers through an intermediary — servers only connect to Redis, not to each other.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "ZooKeeper introduces a single point of failure that invalidates the entire routing scheme",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Consistent hashing requires all messages to pass through a coordinator node, adding latency",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Server-to-server mesh connections require careful rebalancing to avoid thundering herds and dual-publishing during scaling events",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Consistent hashing cannot handle more than 100 Chat Servers due to hash space fragmentation",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Heartbeat-based gap detection mechanism",
      type: "question",
      sectionId: "sec_q_delivery",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'The "piggyback sequence on heartbeats" approach combines heartbeats with sequence numbers. What specific advantage does this have over sequence-number gap detection alone?',
        explanation:
          "Sequence number gap detection only triggers when a new message arrives — if a message is missed and no subsequent messages come, the gap is never detected. Piggybacking the global sequence number on heartbeats means the client checks its sequence against the server's on every heartbeat (every 10-30s), detecting missed messages even during quiet periods. Periodic polling serves as a final backstop.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "It guarantees exactly-once delivery by combining ACKs with sequence validation",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It detects missed messages even during quiet chat periods, since heartbeats fire regardless of message activity",
              isCorrect: true,
            },
            {
              id: "c",
              text: "It reduces Redis Pub/Sub load by batching messages with heartbeats",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It eliminates the need for the durable Inbox table entirely",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Core entities in a WhatsApp system design",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL correct core entities that should be identified when designing WhatsApp:",
        explanation:
          'User, Chat, Message, and Client (device) are all core entities. A User can have multiple Clients (phone, tablet, laptop), Chats contain 2–100 participants, and Messages belong to Chats. "Channel" is a Redis Pub/Sub concept, not a core business entity. It is an implementation detail of the routing layer.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Chat — a conversation between 2–100 participants", isCorrect: true },
            {
              id: "b",
              text: "Client — a specific device (phone, tablet, laptop) belonging to a user",
              isCorrect: true,
            },
            {
              id: "c",
              text: "User — a registered person who sends and receives messages",
              isCorrect: true,
            },
            { id: "d", text: "Message — text or media sent within a chat", isCorrect: true },
            {
              id: "e",
              text: "Channel — a pub/sub topic that messages are routed through",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "DynamoDB table design for ChatParticipant",
      type: "question",
      sectionId: "sec_q_advanced",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "The ChatParticipant table needs to support two access patterns: (1) all participants for a given chat, and (2) all chats for a given user. Select ALL correct design choices:",
        explanation:
          'Using chatId as partition key and participantId as sort key gives efficient "all participants for chat X" queries via Query on the partition key. A GSI with participantId as partition key enables "all chats for user Y" queries. DynamoDB automatically keeps GSIs in sync. A separate table per user would create billions of tables. Scan operations on the entire table would be prohibitively slow.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Create a Global Secondary Index (GSI) with participantId as partition key and chatId as sort key",
              isCorrect: true,
            },
            {
              id: "b",
              text: "DynamoDB automatically keeps the GSI in sync with the base table",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Create a separate table for each user to store their chat memberships",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Use a composite primary key with chatId as partition key and participantId as sort key",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Strategies for detecting missed Pub/Sub messages",
      type: "question",
      sectionId: "sec_q_delivery",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Since Redis Pub/Sub is at-most-once, messages can be missed. Select ALL valid strategies for detecting and recovering from missed messages:",
        explanation:
          'Periodic polling checks the Inbox for undelivered messages. Sequence numbers per chat allow gap detection when new messages arrive. Piggybacking the global sequence on heartbeats detects gaps even during quiet periods. Upgrading Redis to "exactly-once" is not possible — Redis Pub/Sub fundamentally provides at-most-once semantics. If you need exactly-once, you need a different system (Redis Streams), but the Inbox-based design makes this unnecessary.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Configure Redis Pub/Sub for exactly-once delivery mode to guarantee no messages are lost",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Piggyback global sequence on heartbeats — server includes current sequence in pings for client comparison",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Periodic polling — clients sync every 30–60s by checking the Inbox for undelivered messages",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Sequence numbers per chat — clients detect gaps (e.g., received #5 but last saw #3) and request re-sync",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Multi-device support design changes",
      type: "question",
      sectionId: "sec_q_advanced",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Supporting multiple devices per user (phone, tablet, laptop) requires several design changes. Select ALL that are correct:",
        explanation:
          "A Clients table tracks devices per user. The Inbox must become per-client (not per-user) because each device tracks delivery independently — your phone may have received a message but your laptop was off. Messages must be sent to all connected clients. However, Pub/Sub channels do NOT need to change — they remain per-userId. The Chat Server subscribes once per user and forwards to all that user's connected client sockets locally.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Limit to ~3 clients per account to bound storage and throughput",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Send messages to ALL connected clients for a user, not just one",
              isCorrect: true,
            },
            { id: "c", text: "Add a Clients table to track devices by userId", isCorrect: true },
            {
              id: "d",
              text: "Change the Inbox to be per-client instead of per-user",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Create separate Pub/Sub channels per client (e.g., userId_phone, userId_tablet)",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Compare message routing approaches",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare and contrast three approaches for routing messages between multiple Chat Servers: (1) naive horizontal scaling, (2) consistent hashing, and (3) Redis Pub/Sub. For each, explain the core mechanism and its primary limitation.",
        explanation:
          "A strong answer covers: Naive scaling fails because a server may not have connections to all recipients. Consistent hashing deterministically assigns users to servers but requires server-to-server mesh connections and complex rebalancing. Redis Pub/Sub decouples routing through an intermediary with lightweight channels, but provides at-most-once delivery requiring a durable backup (Inbox).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Three approaches for routing messages across Chat Servers:\n\n1. Naive horizontal scaling: Place Chat Servers behind a load balancer. Mechanism: requests are distributed randomly. Limitation: A server receiving a sendMessage has no way to reach recipients connected to other servers. Messages cannot be delivered. This fundamentally does not work.\n\n2. Consistent hashing: Assign users to specific Chat Servers based on userId hash. A central registry (ZooKeeper/etcd) maps hash ranges to servers. When Server A needs to deliver to a user on Server B, it connects directly. Limitation: Requires server-to-server mesh connections. Scaling up/down requires careful connection draining to avoid thundering herds. During rebalancing, must dual-publish to old and new servers to prevent message loss.\n\n3. Redis Pub/Sub: Decouple routing through Redis. When a user connects, their Chat Server subscribes to a Redis channel for that userId. To deliver, publish to the recipient's channel. Limitation: At-most-once delivery — if no subscriber is listening or Redis fails, the message is lost. This is acceptable because messages are durably written to the Inbox before publishing, so they are eventually delivered via Inbox sync.\n\nRedis Pub/Sub is preferred because it avoids the mesh topology and rebalancing complexity of consistent hashing, while the Inbox handles its delivery gap.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the durable write path and why Pub/Sub loss is acceptable",
      type: "question",
      sectionId: "sec_q_delivery",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the complete write path when a user sends a message in WhatsApp. Specifically, describe the order of operations and explain why it is acceptable that Redis Pub/Sub may lose messages.",
        explanation:
          "Key insight: durability is achieved BEFORE Pub/Sub publish. The write path: (1) write to Message + Inbox tables (durable), (2) return success to sender, (3) publish to Pub/Sub (best-effort). If step 3 fails, messages are still safe. Recipients get them on reconnect via Inbox sync or through polling/heartbeat gap detection.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "The write path when a user sends a message:\n\n1. Sender sends sendMessage over WebSocket to their Chat Server.\n2. Chat Server looks up all participants via the ChatParticipant table.\n3. Chat Server writes the message to the Message table AND creates an Inbox entry for each recipient. This is the durable write — once complete, the message is guaranteed to eventually reach all recipients.\n4. Chat Server returns SUCCESS to the sender with the messageId.\n5. Chat Server publishes the message to Redis Pub/Sub channels for each recipient (best-effort real-time delivery).\n6. If a recipient's Chat Server receives the Pub/Sub message, it forwards to the client's WebSocket.\n7. Client sends ACK → server deletes the Inbox entry.\n\nWhy Pub/Sub loss is acceptable:\nThe critical insight is that steps 3-4 (durable write + success response) happen BEFORE step 5 (Pub/Sub publish). If Pub/Sub fails — no subscribers, Redis transient failure, network partition — the message is safely persisted in the Inbox. Recipients will receive it through:\n- Reconnection sync (offline clients query Inbox on connect)\n- Periodic polling (every 30-60s)\n- Heartbeat gap detection (server includes sequence numbers in pings)\n\nPub/Sub is an optimization layer for real-time delivery, not the source of truth. The Inbox is the source of truth.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Per-user vs per-chat Pub/Sub partitioning analysis",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Should Redis Pub/Sub channels be partitioned per-user or per-chat? Analyze both approaches using two scenarios: (1) users have 250 chats with 1 other participant each, and (2) users have 1 chat with 100 participants. Recommend an approach for WhatsApp and explain the "celebrity problem" optimization.',
        explanation:
          "Must analyze subscription count and publish count for both scenarios under both partitioning schemes. Per-user wins for 1:1-dominated workloads (1 subscription vs 250). Per-chat wins for large groups (1 publish vs 99). WhatsApp is 1:1-dominated, so per-user is correct. The celebrity problem: adaptively switch to per-chat channels for groups above a threshold (e.g., 25 participants).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Analysis of Pub/Sub partitioning:\n\nScenario 1: 250 chats, 1 other participant each (1:1 dominated)\n- Per-chat: 250 channels per user pair (125 unique since shared). Each server subscribes to 250 channels per connected user. Sending = 1 publish.\n- Per-user: 1 channel per user. Each server subscribes to 1 channel per connected user. Sending = 1 publish (to the recipient's channel).\n→ Per-user wins: 1 subscription vs 250.\n\nScenario 2: 1 chat, 100 participants\n- Per-chat: 1 channel shared by all 100. Each server subscribes to 1 channel. Sending = 1 publish.\n- Per-user: 1 channel per user. Each server subscribes to 1 channel. Sending = 99 publishes (one per other participant).\n→ Per-chat wins: 1 publish vs 99.\n\nRecommendation for WhatsApp: Per-user, because WhatsApp is dominated by 1:1 chats. The group chat limit of 100 caps the worst case for publish fan-out.\n\nCelebrity problem optimization: Large groups disproportionately impact the system. Solution: adaptively switch partitioning based on group size. When a user connects, identify chats above a threshold (e.g., 25 participants) and subscribe to per-chat channels for those. For messages in large groups, publish to the chat channel instead of individual user channels. Edge case: when a chat crosses the threshold, briefly dual-publish to both channel types while servers transition subscriptions.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Design the offline-to-online sync flow",
      type: "question",
      sectionId: "sec_q_advanced",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A user has been offline for 3 days and reconnects. Design the complete sync flow from connection establishment to message delivery. Include WebSocket setup, Inbox querying, message delivery, ACK handling, and how the system transitions to real-time mode. Consider the interaction between Inbox sync and Pub/Sub subscription timing.",
        explanation:
          "Must address: WebSocket establishment, Pub/Sub subscription, Inbox query for undelivered messages, delivery + ACK flow, TTL cleanup, and the race condition between Inbox sync and Pub/Sub subscription. A strong answer notes that Pub/Sub subscription should happen BEFORE Inbox sync to avoid missing messages that arrive during the sync window.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Complete offline-to-online sync flow:\n\n1. Connection establishment:\n   - Client opens a WebSocket to a Chat Server (assigned via L4 load balancer).\n   - Chat Server registers the client's connection in its local connection map.\n\n2. Pub/Sub subscription (BEFORE Inbox sync):\n   - Chat Server subscribes to the Redis Pub/Sub channel for this userId.\n   - Critical: this must happen before Inbox sync to avoid a race condition — if a new message arrives between Inbox query and Pub/Sub subscription, it would be missed by both.\n\n3. Inbox sync:\n   - Chat Server queries the Inbox table for all undelivered message IDs for this client.\n   - For each message ID, fetch the full message from the Message table.\n   - Batch-deliver messages to the client over the WebSocket, ordered by server timestamp.\n\n4. ACK handling:\n   - Client processes each message and sends ACK for each.\n   - Chat Server deletes the corresponding Inbox entries.\n   - Messages older than 30 days may have been TTL-expired from both Inbox and Message tables — these are gone and will not be delivered.\n\n5. Transition to real-time:\n   - After Inbox sync completes, the client is caught up. New messages arrive via Pub/Sub in real-time.\n   - Heartbeat mechanism starts: server sends pings every 10-30s with the user's current global sequence number.\n   - Client compares local sequence to detect any gaps from Pub/Sub failures.\n\n6. Deduplication:\n   - Messages that arrived via Pub/Sub during Inbox sync may be duplicates. Client deduplicates by messageId.\n\nEdge case: If the Inbox contains thousands of messages (3 days offline), deliver in batches to avoid overwhelming the WebSocket connection. Use pagination on the Inbox query.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Design last seen with minimal write amplification",
      type: "question",
      sectionId: "sec_q_advanced",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Design a "last seen" feature that shows when a user was last online. The naive approach (writing to DB on every heartbeat) creates millions of writes per second. Describe a solution that minimizes write amplification while providing accurate last-seen information for both online and offline users.',
        explanation:
          "Must cover: LastSeen table updated only on disconnect (not every heartbeat), the getLastSeen flow using both DB lookup and Pub/Sub ping to check if target is currently online, merging responses, and using DynamoDB conditional expressions to prevent race conditions between Chat Servers.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Last-seen design with minimal writes:\n\nProblem: Naive approach writes to DB on every heartbeat. 200M users × heartbeat every 10-30s = millions of writes/second. Wasteful and expensive.\n\nSolution architecture:\n\n1. LastSeen table: Single record per user with their last disconnect timestamp. Updated ONLY when a user disconnects (heartbeat timeout, explicit close, or server failure). Use DynamoDB conditional expressions ("only update if new timestamp > existing") to handle race conditions between Chat Servers.\n\n2. Query flow for getLastSeen(targetUserId):\n   a) Chat Server checks the LastSeen table for the target user\'s disconnect timestamp.\n   b) Simultaneously, Chat Server publishes a getLastSeen message to the target user\'s Pub/Sub channel.\n   c) If the target user\'s Chat Server receives the message and the user is connected, it publishes an updateLastSeen response with status "ONLINE" to the requesting user\'s channel.\n   d) Client merges responses: if "ONLINE" response arrives, show green bubble. If only DB response arrives, show "last seen at [disconnect time]". Wait a brief window before displaying to allow the Pub/Sub response to arrive.\n\nWrite analysis:\n- Writes = 1 per user disconnect event (not per heartbeat)\n- With 200M connected users, if average session is 30 minutes, that\'s ~110K disconnects/second — orders of magnitude less than the heartbeat approach\n\nEdge cases:\n- Chat Server crash: Users reconnect shortly, triggering a new disconnect event on the new server. For extra safety, also write on connect.\n- Multiple servers: DynamoDB conditional writes prevent older timestamps from overwriting newer ones.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Back-of-envelope capacity estimation",
      type: "question",
      sectionId: "sec_q_capacity",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Perform a back-of-the-envelope capacity estimation for WhatsApp. Given 1B total users, 200M concurrent connections, ~20 messages/user/day, and average message size of 100 bytes: estimate (1) total messages per second, (2) write throughput to the database, (3) number of Chat Servers needed (at 2M connections each), and (4) Inbox storage requirements for 30-day retention.",
        explanation:
          "Must show clear calculations. Messages/sec ≈ 40K-100K. DB writes include Message + Inbox entries. Chat Servers ≈ 100-200. Inbox storage depends on undelivered messages, which is a fraction of total since most are delivered quickly. Staff-level answers note that most Inbox entries are cleared within seconds (via ACK) so steady-state storage is small.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Capacity estimation:\n\n1. Messages per second:\n   - 1B active users × 20 messages/day = 20B messages/day\n   - But most chats are 1:1, so ~50% are sent, ~50% received\n   - Unique messages: ~10B/day\n   - 10B / 86,400s ≈ 115K messages/second\n   - With peak at 3-5x average: ~350K-575K messages/second peak\n\n2. Write throughput:\n   - Each message requires: 1 write to Message table + 1 write to Inbox per recipient\n   - For 1:1 chats (majority): 2 writes per message (1 Message + 1 Inbox)\n   - ~115K messages/sec × 2 ≈ 230K writes/second average\n   - With group messages factored in: ~300K writes/second average\n   - Well within DynamoDB capabilities with proper partitioning (userId as partition key)\n\n3. Chat Servers needed:\n   - 200M concurrent connections ÷ 2M connections per server = 100 Chat Servers minimum\n   - With headroom for failover and deployment rolling updates: ~150-200 servers\n   - Each server: 2M WebSocket connections ≈ 16-32GB RAM just for connection state\n\n4. Inbox storage:\n   - Most messages are ACKed within seconds (real-time delivery) → Inbox entry exists briefly\n   - Worst case: offline users accumulate messages\n   - If 10% of users are offline at any time: 100M offline users\n   - 20 messages/day × 30 days × 100 bytes = 60KB per offline user\n   - 100M × 60KB = 6TB total Inbox storage (worst case)\n   - In practice, much less: median offline period is hours, not days\n\nKey insight: The system is connection-bound (200M persistent WebSockets) more than storage-bound. Chat Servers and Redis Pub/Sub cluster sizing are the primary scaling concerns.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Dead connection detection upper bound",
      type: "question",
      sectionId: "sec_q_delivery",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "If the server sends heartbeat pings every 10 seconds and the client timeout is 5 seconds, what is the maximum time before a dead WebSocket connection is detected?",
        explanation:
          "In the worst case, the connection dies immediately after a successful heartbeat. The server waits 10 seconds for the next ping, then 5 seconds for the pong timeout. Maximum detection time = 10s (interval) + 5s (timeout) = 15 seconds.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "15 seconds (10s heartbeat interval + 5s pong timeout)",
          acceptableAnswers: ["15", "15 seconds", "15s", "10 + 5 = 15"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Why not strict message ordering",
      type: "question",
      sectionId: "sec_q_advanced",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "WhatsApp does NOT guarantee strict message ordering in distributed delivery. In one or two sentences, explain the approach used instead and why it is acceptable.",
        explanation:
          'Messages are stamped with the server-received timestamp (synced via NTP). Clients display messages ordered by this timestamp. Occasionally a message appears "above" an earlier one, but users prefer seeing messages quickly over waiting for guaranteed ordering. This avoids the complexity of reordering buffers.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Messages are stamped with server-received timestamp (NTP-synced) and clients display them in timestamp order. Users prefer fast delivery over strict ordering.",
          acceptableAnswers: ["timestamp", "NTP", "server time", "display order"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Pub/Sub channel overhead comparison",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Explain in one or two sentences why Redis Pub/Sub can handle billions of channels while Kafka cannot handle billions of topics.",
        explanation:
          "Redis Pub/Sub channels are in-memory pointers to subscriber connections with no message persistence, disk I/O, or consumer offset tracking. Kafka topics require ~50KB each for partition metadata, disk segments, consumer offsets, and replication — at billions of topics, this means tens of terabytes of overhead.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Redis Pub/Sub channels are lightweight in-memory pointers with no disk persistence. Kafka topics carry ~50KB overhead each (partitions, offsets, disk segments), making billions of topics require tens of TB.",
          acceptableAnswers: [
            "in-memory",
            "no persistence",
            "no disk",
            "lightweight",
            "50KB overhead",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Race condition in reconnection sync",
      type: "question",
      sectionId: "sec_q_delivery",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "When a client reconnects, there is a potential race condition between Inbox sync and Pub/Sub subscription. Describe the race condition and how to prevent it.",
        explanation:
          "If Inbox sync happens before Pub/Sub subscription, a message arriving between the Inbox query and the subscription would be missed by both — it was not in the Inbox when queried, and the subscription was not active when it was published. Prevention: subscribe to Pub/Sub BEFORE querying the Inbox, and deduplicate messages by messageId on the client.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "If Inbox is queried before Pub/Sub subscribes, messages arriving in the gap are missed by both. Fix: subscribe to Pub/Sub first, then sync Inbox, then deduplicate by messageId.",
          acceptableAnswers: [
            "subscribe first",
            "pub/sub before inbox",
            "deduplicate",
            "race condition",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match DynamoDB tables to their purpose",
      type: "question",
      sectionId: "sec_q_advanced",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each DynamoDB table to its purpose in the WhatsApp design:",
        explanation:
          "The Chat table stores chat metadata (name, creation time). ChatParticipant maps users to chats with a GSI for reverse lookups. The Message table stores actual message content. The Inbox table holds undelivered message IDs per user/client, deleted after ACK.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Chat",
              right: "Stores chat metadata (name, creation date, settings)",
            },
            {
              id: "p2",
              left: "ChatParticipant",
              right: "Maps users to chats with GSI for reverse lookups",
            },
            { id: "p3", left: "Message", right: "Stores actual message content and attachments" },
            {
              id: "p4",
              left: "Inbox",
              right: "Holds undelivered message IDs per client, deleted after ACK",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match scaling approaches to their failure mode",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each message routing approach to its primary failure mode:",
        explanation:
          "Naive scaling fails because messages cannot cross server boundaries. Kafka per-user creates unsustainable storage overhead. Consistent hashing has complex rebalancing with thundering herd risk. Redis Pub/Sub has at-most-once delivery where messages can be silently lost.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Naive horizontal scaling",
              right: "Messages cannot be delivered to users on other servers",
            },
            {
              id: "p2",
              left: "Kafka topic per user",
              right: "50KB/topic × 1B users = 50TB+ of metadata overhead",
            },
            {
              id: "p3",
              left: "Consistent hashing",
              right: "Complex rebalancing risks thundering herds and message loss during scaling",
            },
            {
              id: "p4",
              left: "Redis Pub/Sub",
              right: "At-most-once delivery — messages silently lost if no subscriber is listening",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match reliability mechanisms to the problem they solve",
      type: "question",
      sectionId: "sec_q_delivery",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each reliability mechanism to the specific problem it addresses:",
        explanation:
          "Application-level heartbeats detect dead WebSocket connections faster than TCP keepalives. The Inbox table guarantees durability when Pub/Sub fails or clients are offline. Sequence numbers on heartbeats detect missed messages during quiet periods. DynamoDB conditional writes prevent Chat Server races from overwriting newer LastSeen timestamps with older ones.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Application-level heartbeats (ping/pong)",
              right: "Detect dead WebSocket connections within seconds instead of minutes",
            },
            {
              id: "p2",
              left: "Inbox table with TTL",
              right: "Guarantee message delivery when Pub/Sub fails or clients are offline",
            },
            {
              id: "p3",
              left: "Global sequence piggybacked on heartbeats",
              right: "Detect missed Pub/Sub messages even during quiet chat periods",
            },
            {
              id: "p4",
              left: "DynamoDB conditional expressions",
              right:
                "Prevent race conditions when multiple Chat Servers update LastSeen timestamps",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "WhatsApp message delivery guarantee",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Redis Pub/Sub provides _____ delivery semantics, which means messages may be lost if no subscriber is listening.",
        explanation:
          'Redis Pub/Sub provides "at most once" (or "at-most-once") delivery. If there are no subscribers on a channel when a message is published, or if Redis has a transient failure, the message is simply dropped. This is why the design writes to durable storage before publishing.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Redis Pub/Sub provides {{blank1}} delivery semantics, which means messages may be lost if no subscriber is listening.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "at most once",
              acceptableAnswers: ["at most once", "at-most-once", "at most once delivery"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "WhatsApp protocol choice",
      type: "question",
      sectionId: "sec_q_requirements",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "For real-time bidirectional communication in a chat app, _____ connections are preferred over HTTP because they maintain a persistent channel for both sending and receiving messages.",
        explanation:
          "WebSocket connections provide a persistent, bi-directional communication channel. Unlike HTTP (which is request-response), WebSockets allow both client and server to send messages at any time over a single long-lived connection.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "For real-time bidirectional communication in a chat app, {{blank1}} connections are preferred over HTTP because they maintain a persistent channel for both sending and receiving messages.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "WebSocket",
              acceptableAnswers: ["WebSocket", "websocket", "WebSockets", "websockets", "WS"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "WhatsApp connection scale",
      type: "question",
      sectionId: "sec_q_capacity",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "WhatsApp famously served _____ concurrent connections per host. With 200M concurrent users, this requires approximately _____ Chat Servers minimum.",
        explanation:
          "WhatsApp served 1–2 million connections per host using Erlang. With 200M concurrent users at 2M per host, you need a minimum of 100 Chat Servers. In practice, 150-200 for headroom during deployments and failover.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "WhatsApp famously served {{blank1}} concurrent connections per host. With 200M concurrent users, this requires approximately {{blank2}} Chat Servers minimum.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "1-2 million",
              acceptableAnswers: [
                "1-2 million",
                "1-2M",
                "2 million",
                "2M",
                "1 to 2 million",
                "1M-2M",
              ],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "100",
              acceptableAnswers: ["100", "~100", "one hundred", "100-200"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Write throughput estimation",
      type: "question",
      sectionId: "sec_q_capacity",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "With 200M active users sending an average of 20 messages per day, and the vast majority of chats being 1:1, estimate the message write throughput in writes per second. For each message in a 1:1 chat, count 1 write to the Message table and 1 write to the Inbox. (Answer in thousands, e.g., enter 100 for 100,000 writes/sec)",
        explanation:
          "Total messages/day = 200M × 20 = 4B messages/day. Messages/second = 4B / 86,400 ≈ 46,296. For 1:1 chats: 2 writes per message (1 Message + 1 Inbox) = ~92,592 writes/second ≈ 93K. Accounting for some group chats adds ~7K, bringing total to ~100K writes/second.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 93,
          tolerance: 15,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Heartbeat overhead calculation",
      type: "question",
      sectionId: "sec_q_capacity",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "With 200M connected users and heartbeat pings sent every 10 seconds, how many ping/pong round-trips per second does the system need to handle? (Answer in millions, e.g., enter 20 for 20,000,000)",
        explanation:
          "200,000,000 connected users ÷ 10 seconds per heartbeat = 20,000,000 ping/pong round-trips per second. Each is a tiny message (~few bytes), so this is easily handled by the Chat Server fleet. Across 100-200 servers, that is 100K-200K heartbeats per server per second.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 20,
          tolerance: 2,
        },
      },
    },
  ],
};
