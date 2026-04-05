/**
 * Robinhood (Stock Brokerage) — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: real-time stock prices, order management, SSE vs polling, order consistency,
 *         Redis pub/sub fan-out, NAT gateway pattern, fault-tolerant order workflows
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const robinhoodContent: StoryPointSeed = {
  title: "Robinhood",
  description:
    "Design a commission-free stock brokerage like Robinhood that streams real-time stock prices to 20M DAU via SSE, manages buy/sell orders with strong consistency, and minimizes exchange API connections through intelligent proxying and pub/sub fan-out.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_fundamentals", title: "Requirements & Core Concepts", orderIndex: 1 },
    { id: "sec_q_live_prices", title: "Live Price Updates & SSE", orderIndex: 2 },
    { id: "sec_q_order_management", title: "Order Dispatch & Consistency", orderIndex: 3 },
    { id: "sec_q_scaling", title: "Scaling, Pub/Sub & Trade Processing", orderIndex: 4 },
    { id: "sec_q_deep_dives", title: "Capacity Estimation & Interview Strategy", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Architecture
    {
      title: "Robinhood — Requirements & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Robinhood — Requirements & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Robinhood?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Robinhood is a commission-free trading platform for stocks, ETFs, options, and cryptocurrencies. Crucially, Robinhood is a brokerage, not an exchange. It routes trades through market makers (exchanges) and is compensated via payment for order flow. We are designing a brokerage system that facilitates customer orders and provides real-time stock data — we are NOT building the exchange itself.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Key Financial Terms",
              metadata: { level: 3 },
            },
            {
              id: "b4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Symbol (Ticker): Abbreviation uniquely identifying a stock (e.g., META, AAPL).",
                  "Market Order: Immediate buy/sell at current market price. Specifies only share count.",
                  "Limit Order: Buy/sell at a specified target price. Can sit on the exchange waiting to be filled or cancelled.",
                ],
              },
            },
            {
              id: "b5",
              type: "heading",
              content: "Exchange Interface (Given)",
              metadata: { level: 3 },
            },
            {
              id: "b6",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Order Processing: Synchronously places and cancels orders via request/response API.",
                  "Trade Feed: Subscribe to a trade feed for symbols. Pushes data (symbol, price per share, number of shares, orderId) every time a trade occurs.",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Users can see live prices of stocks.",
                  "Users can manage orders for stocks (market/limit orders, create/cancel).",
                ],
              },
            },
            {
              id: "b9",
              type: "paragraph",
              content:
                "Out of scope: after-hours trading, ETFs/options/crypto, viewing the order book in real time.",
            },
            {
              id: "b10",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "High consistency for order management — users must see up-to-date order information when making trades.",
                  "Scale to 20M daily active users, 5 trades/day average, 1000s of symbols.",
                  "Low latency: under 200ms for price updates and order placement.",
                  "Minimize active client connections to the external exchange API (exchange connections are expensive).",
                ],
              },
            },
            {
              id: "b12",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "User: A user of the system.",
                  "Symbol: A stock being traded (name, current price).",
                  "Order: A buy/sell order created by a user (position, symbol, price, shares, status).",
                ],
              },
            },
            {
              id: "b14",
              type: "heading",
              content: "API Design",
              metadata: { level: 2 },
            },
            {
              id: "b15",
              type: "code",
              content:
                'GET /symbol/:name          → Symbol (details + price)\nPOST /order                → Order\n  Body: { position: "buy", symbol: "META", priceInCents: 52210, numShares: 10 }\nDELETE /order/:id          → { ok: true }\nGET /orders                → Order[] (paginated)\n\n// Note: priceInCents avoids floating-point precision issues\n// User info passed via headers (JWT/session token), never in request body',
              metadata: { language: "text" },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Live Price Updates & Order Management Design
    {
      title: "Design Approaches — Live Prices & Order Management",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Design Approaches — Live Prices & Order Management",
          blocks: [
            {
              id: "dd1",
              type: "heading",
              content: "Live Stock Prices — Three Approaches",
              metadata: { level: 2 },
            },
            {
              id: "dd2",
              type: "heading",
              content: "Bad: Polling the Exchange Directly",
              metadata: { level: 3 },
            },
            {
              id: "dd3",
              type: "paragraph",
              content:
                "Each client polls the exchange every few seconds per symbol. Problems: (1) Redundant calls — 5000 clients requesting the same price wastes 5000 calls. (2) Slow updates — meeting the 200ms SLA would require polling every 200ms, which is unreasonable. (3) Violates the requirement to minimize exchange connections.",
            },
            {
              id: "dd4",
              type: "heading",
              content: "Good: Polling an Internal Cache",
              metadata: { level: 3 },
            },
            {
              id: "dd5",
              type: "paragraph",
              content:
                "A symbol price processor listens to the exchange trade feed and updates an internal cache (Redis). Clients poll a symbol service that reads from this cache. Reduces exchange connections to one, but clients still poll indiscriminately even when prices haven't changed, and the polling interval dictates worst-case update latency.",
            },
            {
              id: "dd6",
              type: "heading",
              content: "Great: Server-Sent Events (SSE)",
              metadata: { level: 3 },
            },
            {
              id: "dd7",
              type: "paragraph",
              content:
                "Clients open a GET /subscribe?symbols=META,AAPL SSE connection. The backend sends an initial price snapshot from cache, then pushes updates as they arrive from the symbol price processor. SSE is preferred over WebSockets because the communication is unidirectional (server→client) and SSE works over standard HTTP. This eliminates redundant polling and provides near-instant updates.",
            },
            {
              id: "dd8",
              type: "quote",
              content:
                '"SSE is a persistent connection similar to WebSockets but unidirectional and over HTTP. Since clients aren\'t sending price data back, SSE is the superior choice."',
            },
            {
              id: "dd9",
              type: "heading",
              content: "Order Management — Three Approaches",
              metadata: { level: 2 },
            },
            {
              id: "dd10",
              type: "heading",
              content: "Bad: Send Orders Directly to Exchange",
              metadata: { level: 3 },
            },
            {
              id: "dd11",
              type: "paragraph",
              content:
                "Clients interact directly with the exchange. Problems: (1) Creates too many exchange client connections. (2) No path for users to check order status without polling the exchange. (3) Client-only order tracking is unreliable (app uninstalls, device failures).",
            },
            {
              id: "dd12",
              type: "heading",
              content: "Good: Queue + Dispatch Service",
              metadata: { level: 3 },
            },
            {
              id: "dd13",
              type: "paragraph",
              content:
                "Orders go to an order service → queue → dispatch service → exchange. The queue prevents dispatch overload and enables elastic scaling. Problem: During high queue load (trading spikes), orders may take too long to dispatch, violating the 200ms SLA. For time-sensitive financial operations, queue latency is unacceptable.",
            },
            {
              id: "dd14",
              type: "heading",
              content: "Great: Order Gateway (NAT Gateway)",
              metadata: { level: 3 },
            },
            {
              id: "dd15",
              type: "paragraph",
              content:
                "Orders go from the order service directly to an order dispatch gateway (AWS NAT Gateway). The gateway makes requests appear to originate from a small set of elastic IPs while allowing the order service fleet to scale horizontally. The order service handles business logic, auto-scales aggressively (e.g., scale at 50% CPU), and can be over-provisioned to absorb trading spikes. No queue latency — orders reach the exchange synchronously.",
            },
            {
              id: "dd16",
              type: "heading",
              content: "Order Storage",
              metadata: { level: 2 },
            },
            {
              id: "dd17",
              type: "paragraph",
              content:
                "Orders are stored in a relational database (Postgres) partitioned by userId for consistent ACID guarantees. Each order tracks: position, symbol, price, shares, status (pending → submitted → filled/failed/cancelled), and externalOrderId from the exchange. A trade processor tails the exchange trade feed to update order statuses.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Deep Dives — Scaling, Order Consistency, Trade Processing
    {
      title: "Deep Dives — Scaling Prices, Order Consistency & Trade Processing",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Scaling Prices, Order Consistency & Trade Processing",
          blocks: [
            {
              id: "dp1",
              type: "heading",
              content: "Scaling Live Price Updates with Redis Pub/Sub",
              metadata: { level: 2 },
            },
            {
              id: "dp2",
              type: "paragraph",
              content:
                "The core problem: how do we route symbol price updates to the symbol service servers connected to users who care about those updates? Solution: Redis pub/sub. Each symbol has a Redis channel. Symbol service servers subscribe to channels for symbols their connected users care about.",
            },
            {
              id: "dp3",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "User subscribes via a symbol service server. Server tracks Symbol → Set<userId> mapping.",
                  "Server ensures it has an active Redis pub/sub subscription for each symbol its users care about.",
                  "When a symbol price changes, the symbol price processor publishes to the Redis channel. All subscribed symbol service servers receive the update and fan-out to connected users via SSE.",
                  "On user disconnect (detected via heartbeat), server removes user from sets. If no users remain for a symbol, unsubscribe from that Redis channel.",
                ],
              },
            },
            {
              id: "dp4",
              type: "paragraph",
              content:
                "This architecture is self-regulating: servers only subscribe to channels they need, and price updates are only pushed to servers with interested users. Load distributes evenly across the symbol service fleet.",
            },
            {
              id: "dp5",
              type: "heading",
              content: "Tracking Order Updates",
              metadata: { level: 2 },
            },
            {
              id: "dp6",
              type: "paragraph",
              content:
                "Problem: The trade processor receives trades from the exchange with externalOrderId, but the order DB is partitioned by userId — there's no efficient way to look up an order by externalOrderId across partitions.",
            },
            {
              id: "dp7",
              type: "paragraph",
              content:
                "Solution: Add a separate key-value store (RocksDB) mapping externalOrderId → (orderId, userId). Populated by the order service after exchange submission. The trade processor uses this to determine the correct partition and order to update.",
            },
            {
              id: "dp8",
              type: "heading",
              content: "Order Consistency — Create Flow",
              metadata: { level: 2 },
            },
            {
              id: "dp9",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  'Store order in DB with status "pending" (creates a record before exchange interaction).',
                  "Submit order to exchange synchronously → receive externalOrderId.",
                  'Write externalOrderId to KV store, update order status to "submitted".',
                  "Respond to client with success.",
                ],
              },
            },
            {
              id: "dp10",
              type: "heading",
              content: "Failure Scenarios — Create Flow",
              metadata: { level: 3 },
            },
            {
              id: "dp11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Failure storing order: Respond with failure, stop workflow. No side effects.",
                  'Failure submitting to exchange: Mark order as "failed", respond to client.',
                  'Failure after exchange submission: A cleanup job scans "pending" orders, queries the exchange using clientOrderId metadata, and either records the externalOrderId or marks as failed.',
                ],
              },
            },
            {
              id: "dp12",
              type: "heading",
              content: "Order Consistency — Cancel Flow",
              metadata: { level: 2 },
            },
            {
              id: "dp13",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  'Update order status to "pending_cancel" (enables resolving failed cancels later).',
                  "Submit cancellation to exchange.",
                  'Record cancellation in DB, update status to "cancelled".',
                  "Respond to client with success.",
                ],
              },
            },
            {
              id: "dp14",
              type: "paragraph",
              content:
                'For cancel failures at any step, a cleanup job scans "pending_cancel" orders and ensures they are actually cancelled on the exchange (or updates status if already cancelled). The key insight: always write intent to the DB first so failures can be recovered by background processes.',
            },
            {
              id: "dp15",
              type: "heading",
              content: "Interview Level Expectations",
              metadata: { level: 2 },
            },
            {
              id: "dp16",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mid-level (E4): Define API endpoints and data model clearly. Land on a functional HLD for price updates and ordering. Understand proxying the exchange to minimize connections.",
                  "Senior (E5): Speed through initial HLD. Discuss real-time price propagation and consistent order management in detail. Design a reasonable, scalable SSE solution and a good order workflow with consistency awareness.",
                  "Staff+ (E6+): Deep tradeoff analysis, practical tech experience. Proactively identify problems (e.g., hot symbols, order consistency edge cases). Treat the interviewer as a peer.",
                ],
              },
            },
          ],
          readingTime: 14,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════════════

    // --- MCQ (8 questions) ---

    // MCQ 1 — easy
    {
      title: "Robinhood's role in the financial system",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is Robinhood's role in the financial system, and why does this distinction matter for system design?",
        explanation:
          "Robinhood is a brokerage, not an exchange. This means it routes trades through external market makers rather than matching buyers and sellers itself. This is a critical design distinction: our system interfaces with an external exchange API for order execution and trade data, rather than building order-matching infrastructure. The exchange provides synchronous order placement and an asynchronous trade feed.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A payment processor that handles trade settlement",
              isCorrect: false,
            },
            {
              id: "b",
              text: "A market maker that sets bid/ask prices for all symbols",
              isCorrect: false,
            },
            {
              id: "c",
              text: "An exchange that matches buyers and sellers directly",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A brokerage that routes trades through exchanges — we design around an external exchange API, not order matching",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why SSE over WebSockets for price updates",
      type: "question",
      sectionId: "sec_q_live_prices",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "For streaming live stock prices to clients, the recommended approach uses SSE (Server-Sent Events) rather than WebSockets. What is the primary reason?",
        explanation:
          "SSE is preferred because the communication is unidirectional — the server pushes price updates to the client, and the client does not need to send data back. SSE works over standard HTTP, making it simpler to deploy behind existing infrastructure (load balancers, proxies). WebSockets would add unnecessary complexity for bidirectional communication that isn't needed here.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "WebSockets cannot handle more than 1000 concurrent connections",
              isCorrect: false,
            },
            {
              id: "b",
              text: "SSE supports binary data while WebSockets only support text",
              isCorrect: false,
            },
            {
              id: "c",
              text: "SSE has lower latency than WebSockets for all use cases",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Communication is unidirectional (server→client only), and SSE uses standard HTTP which simplifies infrastructure",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Why use priceInCents instead of price",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "The Robinhood API uses priceInCents (integer) instead of a decimal price field. What is the primary reason for this design choice?",
        explanation:
          "Floating-point arithmetic introduces precision errors that are unacceptable in financial applications. A price of $52.10 stored as a float might become 52.0999999... Representing prices in cents as integers (52210) eliminates rounding errors entirely. This is a standard practice in fintech to prevent financial discrepancies and potential fraud vectors.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Floating-point precision errors are unacceptable in financial applications — integers eliminate rounding issues",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The exchange API only accepts integer prices",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Databases index integers faster than decimals",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Integers are smaller in memory than floating-point numbers",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why not use a queue for order dispatch?",
      type: "question",
      sectionId: "sec_q_order_management",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A junior engineer proposes using a message queue between the order service and a dispatch service that sends orders to the exchange. Why does the team reject this in favor of a NAT Gateway approach?",
        explanation:
          "While queues handle load spikes well, they introduce latency — during high trading volume, orders can sit in the queue waiting for the dispatch service to process them. For financial operations with a 200ms SLA, this is unacceptable. A NAT Gateway allows the order service fleet to make synchronous requests to the exchange while appearing as a small set of IPs, eliminating queue latency entirely.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The exchange API does not support asynchronous order submission",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Queue latency during traffic spikes can violate the 200ms order SLA — synchronous dispatch via NAT Gateway eliminates this",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Message queues cannot handle the throughput of 100M trades per day",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Queues introduce message ordering issues that corrupt trade data",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Order DB partitioning choice",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The order database (Postgres) is horizontally partitioned by userId. What is the primary advantage of this partitioning strategy, and what problem does it create for trade processing?",
        explanation:
          "Partitioning by userId means all of a user's orders live on a single partition, making GET /orders queries fast (single-node lookup). However, the trade processor receives updates from the exchange with externalOrderId — and there's no efficient way to find which partition holds an order using externalOrderId. This necessitates a separate KV store (RocksDB) mapping externalOrderId → (orderId, userId).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Enables horizontal scaling, but loses the ability to enforce unique constraints on orderId",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Reduces write amplification, but increases read latency for individual orders",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Fast user-scoped queries (single partition), but requires a separate KV store to look up orders by externalOrderId from trade feeds",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Ensures ACID compliance per user, but prevents cross-user analytics",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Sticky sessions for SSE",
      type: "question",
      sectionId: "sec_q_live_prices",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The symbol service uses SSE connections for live price updates. What load balancer configuration is required to support SSE, and what challenge does it introduce?",
        explanation:
          "SSE connections are persistent — the server holds the connection open to push data. The load balancer must use sticky sessions so subsequent requests from a client go to the same server maintaining their SSE connection. This creates challenges: uneven load distribution (some servers may have more connections), reconnection handling on server failure, and capacity planning (each connection consumes server resources).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Connection pooling, which multiplexes multiple SSE streams over a single TCP connection",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Sticky sessions to maintain persistent connections, which can cause uneven load distribution across servers",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Round-robin routing, which evenly distributes SSE connections across all servers",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Layer 4 load balancing with no session affinity, since SSE is stateless",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: 'Why store order as "pending" before exchange submission',
      type: "question",
      sectionId: "sec_q_order_management",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'In the order creation workflow, the system stores an order with status "pending" in the database BEFORE submitting it to the exchange. A candidate questions this — why not submit to the exchange first and only store on success? What is the strongest argument for the current approach?',
        explanation:
          "If we submit to the exchange first and then fail to store the order, we have an outstanding order on the exchange with no record in our system. This is an irrecoverable inconsistency — we can't cancel what we don't know about. By storing \"pending\" first, every possible failure path has a recovery mechanism: the cleanup job can scan pending orders, query the exchange using clientOrderId metadata, and either complete or fail them. The order of operations ensures we always have a record to reconcile against.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The exchange requires a valid orderId from our system before accepting an order",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The database write is faster than the exchange API call, so it reduces overall latency",
              isCorrect: false,
            },
            {
              id: "c",
              text: "If exchange submission succeeds but DB write fails, we have an orphaned order on the exchange with no record to reconcile — storing first ensures every failure path is recoverable",
              isCorrect: true,
            },
            {
              id: "d",
              text: "It allows the client to optimistically see the order while the exchange processes it",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Redis pub/sub channel management",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In the scaled architecture, symbol service servers subscribe to Redis pub/sub channels for price updates. When a server has 10,000 connected users but only 500 unique symbols across all subscriptions, how many Redis channels should that server be subscribed to, and why is this self-regulating?",
        explanation:
          "The server subscribes to exactly 500 channels (one per unique symbol), not 10,000 (one per user). When a price update arrives on a channel, the server fans out to all connected users who subscribed to that symbol. This is self-regulating because: servers only subscribe to channels their users need, and when users disconnect, the server cleans up channels with no remaining subscribers. This prevents unnecessary network traffic and scales naturally with user distribution.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The number of channels is managed by Redis automatically based on load",
              isCorrect: false,
            },
            {
              id: "b",
              text: "500 channels (one per unique symbol) — the server fans out to users locally; channels with no subscribers are automatically unsubscribed",
              isCorrect: true,
            },
            {
              id: "c",
              text: "10,000 channels (one per user) — each user gets a dedicated channel for their symbols",
              isCorrect: false,
            },
            {
              id: "d",
              text: "1 channel — all price updates go through a single global channel and the server filters locally",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Problems with polling the exchange directly",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL problems with having clients poll the exchange directly for live stock prices:",
        explanation:
          "Polling the exchange directly has three fundamental problems: (1) Redundant calls — thousands of clients requesting the same price information. (2) Too many exchange connections, which are expensive. (3) Slow updates — meeting the 200ms SLA would require impractically frequent polling. However, the exchange does support concurrent connections (just expensively), and polling doesn't introduce data inconsistency — just inefficiency.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Polling intervals make it impossible to meet the 200ms update SLA efficiently",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The exchange API does not support concurrent client connections",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Polling introduces data inconsistency between clients",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Redundant exchange calls — thousands of clients requesting identical price data",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Too many exchange client connections, which are expensive",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Order consistency mechanisms",
      type: "question",
      sectionId: "sec_q_order_management",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content: "Select ALL mechanisms that ensure order consistency in the Robinhood system:",
        explanation:
          'Order consistency relies on: (1) Writing "pending" status before exchange submission creates a recoverable record. (2) The cleanup job scans outstanding pending/pending_cancel orders and reconciles with the exchange. (3) ACID guarantees from Postgres ensure order updates are atomic per partition. Two-phase commit across the order DB and exchange is NOT used — the cleanup job handles inconsistencies instead. Redis is used for price caching, not order consistency.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Background cleanup job that scans and resolves pending/pending_cancel orders",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Two-phase commit between the order DB and the exchange",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Redis distributed locks on each order during processing",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Using clientOrderId metadata to query exchange for order status during recovery",
              isCorrect: true,
            },
            {
              id: "e",
              text: "ACID guarantees from Postgres for atomic order updates",
              isCorrect: true,
            },
            {
              id: "f",
              text: "Writing order status to DB before exchange interaction (pending first)",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "SSE connection challenges",
      type: "question",
      sectionId: "sec_q_live_prices",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content: "Select ALL challenges introduced by using SSE for live price updates:",
        explanation:
          "SSE introduces several operational challenges: sticky sessions are needed for persistent connections, which complicates load balancing. Disconnect/reconnect handling must be implemented (heartbeat-based detection). Price update routing (which server gets which symbol updates) must be designed. However, SSE does not require a special protocol upgrade — it uses standard HTTP — and connection overhead per client is modest (one persistent HTTP connection).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Load balancer must support sticky sessions for persistent connections",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Each SSE connection requires a dedicated thread, limiting to 1000 connections per server",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Routing price updates to the correct symbol service servers requires pub/sub infrastructure",
              isCorrect: true,
            },
            {
              id: "d",
              text: "SSE requires a WebSocket protocol upgrade, adding infrastructure complexity",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Disconnect detection and reconnection handling must be implemented",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Failure recovery in order creation workflow",
      type: "question",
      sectionId: "sec_q_order_management",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "In the order creation workflow (1. store pending → 2. submit to exchange → 3. update DB → 4. respond), select ALL true statements about failure handling:",
        explanation:
          'Each failure point has a specific recovery path: Step 1 failure stops the workflow safely (no side effects). Step 2 failure marks the order as failed in the DB. Step 3 failure is the dangerous case — the order exists on the exchange but our DB still says "pending" — the cleanup job must reconcile using clientOrderId. The cleanup job is not optional; without it, post-exchange failures leave inconsistent state permanently.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "A distributed transaction across the DB and exchange eliminates the need for a cleanup job",
              isCorrect: false,
            },
            {
              id: "b",
              text: "If storing the order fails (step 1), the workflow stops safely with no side effects",
              isCorrect: true,
            },
            {
              id: "c",
              text: 'If exchange submission fails (step 2), the order is marked as "failed" in the DB',
              isCorrect: true,
            },
            {
              id: "d",
              text: "If DB update fails after exchange submission (step 3), the cleanup job uses clientOrderId to query the exchange and reconcile",
              isCorrect: true,
            },
            {
              id: "e",
              text: "The cleanup job is optional — eventual consistency will resolve step 3 failures without it",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "SSE vs WebSocket vs Polling tradeoff analysis",
      type: "question",
      sectionId: "sec_q_live_prices",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare three approaches for delivering live stock prices to clients: polling an internal cache, WebSockets, and Server-Sent Events (SSE). For each, discuss latency, infrastructure complexity, and suitability for this specific use case.",
        explanation:
          "A strong answer explains why SSE wins: unidirectional communication fits the use case, HTTP compatibility simplifies infrastructure, and push-based delivery provides near-instant updates. Polling wastes bandwidth and has latency issues. WebSockets add unnecessary bidirectional complexity.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Polling an internal cache: Clients make periodic HTTP GET requests to a symbol service backed by a Redis cache. Advantages: simple to implement, stateless servers, standard HTTP infrastructure. Disadvantages: wasted bandwidth (polls even when price hasn't changed), latency is bounded by the polling interval (e.g., 1-second polls mean worst-case 1-second staleness), and high request volume at scale.\n\nWebSockets: Full-duplex persistent connection. Advantages: real-time push from server, client can also send data. Disadvantages: uses a separate protocol (ws://), requiring WebSocket-aware load balancers and proxies. The bidirectional capability is unnecessary since clients only receive price data — they don't send it back.\n\nSSE (Server-Sent Events): Unidirectional persistent connection over standard HTTP. Advantages: push-based delivery with near-instant updates, works with existing HTTP infrastructure (load balancers, proxies), built-in reconnection with Last-Event-Id, simpler than WebSockets. Disadvantages: requires sticky sessions, connection management for disconnects.\n\nFor Robinhood price updates, SSE is the clear winner: the communication is strictly server→client, SSE uses standard HTTP, and it provides the push-based delivery needed for the 200ms update SLA without the complexity overhead of WebSockets.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "NAT Gateway order dispatch design",
      type: "question",
      sectionId: "sec_q_order_management",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the NAT Gateway approach for dispatching orders to the exchange. Why is it preferred over a queue-based approach? How does it satisfy both the low-latency SLA and the requirement to minimize exchange connections?",
        explanation:
          "A strong answer explains how the NAT Gateway (e.g., AWS NAT Gateway with elastic IPs) allows a horizontally scalable order service fleet to make synchronous requests to the exchange while appearing as a small set of IPs, satisfying both requirements simultaneously.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "The NAT Gateway approach routes orders from the order service directly to the exchange through an AWS NAT Gateway, which translates outbound requests from the order service fleet to originate from a small number of elastic IPs.\n\nWhy it beats the queue approach: A queue between order service and dispatch service introduces latency during traffic spikes. If the queue backs up (high trading volume before auto-scaling kicks in), orders wait in the queue, violating the 200ms SLA. For time-sensitive financial operations, this is unacceptable — imagine a user trying to quickly cancel an order.\n\nHow it satisfies low latency: The order service sends synchronous requests to the exchange through the NAT Gateway. No queue processing delay. The order service fleet can auto-scale aggressively (e.g., scale at 50% CPU) or be over-provisioned to absorb spikes.\n\nHow it minimizes exchange connections: The exchange sees a small number of IPs (elastic IPs on the NAT Gateway), even though many order service instances are making requests. This satisfies the exchange's IP-based rate limiting and connection restrictions without limiting our ability to scale horizontally.\n\nThe tradeoff: the order service now handles both client interaction and exchange communication, requiring careful implementation for efficiency (potentially batching orders).",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design Redis pub/sub price fan-out",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the price update fan-out system using Redis pub/sub. Explain the full workflow from exchange trade feed to user's screen, including how symbol service servers manage subscriptions, how they handle user connects/disconnects, and why this architecture is self-regulating.",
        explanation:
          "A staff-level answer describes the complete pipeline: symbol price processor → Redis pub/sub channels (per symbol) → symbol service servers (subscribed to relevant channels) → SSE fan-out to connected users. Should cover the Symbol → Set<userId> mapping, subscribe/unsubscribe lifecycle, and self-regulation.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Complete price update flow:\n\n1. Exchange → Symbol Price Processor: A fleet of processor machines tail the exchange trade feed. On each trade, the processor extracts the symbol and latest price, updates the Redis price cache, and publishes the price update to a Redis pub/sub channel named after the symbol (e.g., channel \"META\").\n\n2. Redis → Symbol Service Servers: Each symbol service server maintains a mapping: Symbol → Set<userId> for all connected users. The server subscribes to Redis channels only for symbols that have at least one interested user. When a price update arrives on a subscribed channel, the server looks up the set of connected users for that symbol and pushes the update to each via their SSE connection.\n\n3. User Subscribe Flow: When a user connects with GET /subscribe?symbols=META,AAPL, the symbol service server adds the userId to its Symbol → Set<userId> mapping for each requested symbol. If the server wasn't already subscribed to that symbol's Redis channel, it subscribes now. The server sends an initial price snapshot from the Redis cache.\n\n4. User Disconnect Flow: When a user disconnects (detected via heartbeat timeout or connection close), the server removes the userId from all symbol sets. For any symbol where the set becomes empty, the server unsubscribes from the Redis channel.\n\n5. Self-regulation: The system naturally adapts to user demand. Popular symbols (AAPL, TSLA) have subscriptions on many servers; obscure symbols may only be subscribed on one or two. No central coordination is needed — each server independently manages its Redis subscriptions based on its connected users. This distributes load evenly because user connections are load-balanced across the symbol service fleet.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Order consistency deep dive",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Walk through both the order creation and order cancellation workflows step by step. For each workflow, identify every possible failure point and explain the recovery mechanism. Why is the "cleanup job" essential, and what does it use to reconcile with the exchange?',
        explanation:
          'A staff-level answer systematically covers both workflows (4 steps each), identifies 3 failure points per workflow, and explains how the cleanup job uses clientOrderId metadata to query the exchange. Should emphasize the "write intent first" pattern.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Order Creation Workflow:\n1. Store order with status "pending" in DB → Failure: Respond with error, stop. No side effects.\n2. Submit order to exchange synchronously → Failure: Mark order as "failed" in DB, respond to client.\n3. Write externalOrderId to KV store + update order to "submitted" → Failure: Order exists on exchange but DB says "pending". Cleanup job must reconcile.\n4. Respond to client with success.\n\nOrder Cancellation Workflow:\n1. Update order status to "pending_cancel" → Failure: Respond with error, stop. No side effects.\n2. Submit cancellation to exchange → Failure: Respond with error. Order still says "pending_cancel" — cleanup job will retry cancellation.\n3. Record cancellation in DB, update to "cancelled" → Failure: Exchange cancelled but DB says "pending_cancel". Cleanup job verifies cancellation status.\n4. Respond to client with success.\n\nCleanup Job:\nThe cleanup job is a background process that periodically scans for orders in transitional states ("pending" or "pending_cancel"). For each:\n- "Pending" orders: Query the exchange using the clientOrderId metadata field (most exchange APIs support a client-provided identifier). If the order exists, record the externalOrderId and update status. If not, mark as "failed".\n- "Pending_cancel" orders: Check with exchange if the order is cancelled. Update status accordingly.\n\nThe key design principle is "write intent first" — always recording what we\'re about to do before doing it. This ensures every failure scenario has a recoverable database record. Without the cleanup job, failures between DB and exchange operations would cause permanent inconsistency: orders on the exchange with no record in our system, or orders marked for cancellation that are never actually cancelled.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Trade processor and externalOrderId mapping",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain why the trade processor needs a separate KV store (RocksDB) to map externalOrderId to (orderId, userId). What would happen without it? Why was RocksDB chosen over Redis for this use case?",
        explanation:
          "A strong answer explains the partition mismatch problem (DB partitioned by userId, but trade feed provides externalOrderId), the consequences of scanning all partitions, and the durability requirements that favor RocksDB over Redis.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The Problem:\nThe order database is horizontally partitioned by userId — this is optimal for user-facing queries (GET /orders goes to a single partition). However, the exchange trade feed sends updates identified by externalOrderId. Without a mapping, the trade processor would need to broadcast every trade update to ALL partitions to find the matching order. With thousands of partitions and millions of trades, this scatter-gather approach would be prohibitively expensive.\n\nThe Solution:\nA KV store mapping externalOrderId → (orderId, userId) is populated by the order service immediately after receiving externalOrderId from the exchange. The trade processor performs a single KV lookup, gets the userId (determines the partition) and orderId (locates the row), then makes a targeted update.\n\nWhy RocksDB over Redis:\n1. Durability: RocksDB is an embedded, persistent KV store (LSM-tree based). Limit orders can remain open for days — if Redis crashes before the order is filled, the mapping is lost and the trade processor can't update the order. RocksDB persists to disk.\n2. Cost: This mapping needs to persist as long as orders are active. Redis keeps everything in memory, which is expensive for potentially millions of open orders. RocksDB uses disk with an in-memory cache for hot data.\n3. Operational simplicity: RocksDB runs embedded within the trade processor — no separate cluster to manage.\n\nRedis could work with sentinel/cluster for HA, but RocksDB is more appropriate for a durable mapping that must survive restarts and doesn't require the sub-millisecond latency of Redis.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Staff-level interview walkthrough for Robinhood",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are in a Staff Engineer system design interview. The interviewer asks you to design Robinhood. Walk through how you would structure your 45-minute interview: what do you cover in the first 5 minutes, how do you allocate time between breadth and depth, and which 2-3 deep dives would you choose and why?",
        explanation:
          "A staff-level answer demonstrates interview meta-strategy: quick clarification of brokerage vs exchange, efficient HLD leveraging the exchange API, then 60% of time on carefully chosen deep dives that showcase real-world experience with financial systems.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "First 5 minutes — Requirements & Scope:\nClarify that Robinhood is a brokerage, not an exchange. Confirm the exchange API interface (synchronous orders, trade feed). Pin down functional requirements (live prices, order management) and non-functional requirements (20M DAU, 200ms SLA, consistency for orders, minimize exchange connections). Use priceInCents for financial precision. Establish core entities (User, Symbol, Order).\n\nMinutes 5-15 — High-Level Design (40% breadth):\nSketch the API endpoints quickly. For live prices: Symbol Price Processor → Redis cache → Symbol Service → SSE to clients. For orders: Client → Order Service → NAT Gateway → Exchange. Order DB (Postgres, partitioned by userId). Trade Processor tails exchange feed. Don't linger — demonstrate I can build a functional system quickly.\n\nMinutes 15-40 — Deep Dives (60% depth):\n\n1. Scaling live price updates with Redis pub/sub (10 min): This is the most architecturally interesting problem. Walk through the Symbol → Set<userId> mapping, Redis channel lifecycle, self-regulating subscription management, and fan-out pattern. Discuss handling \"hot symbols\" (AAPL, TSLA) where many servers are subscribed. This shows distributed systems expertise.\n\n2. Order consistency and fault tolerance (12 min): Walk through both create and cancel workflows step by step, proactively identifying failure points at each step. Design the cleanup job with clientOrderId reconciliation. Discuss why we write intent first. This shows experience with financial systems and understanding that consistency > availability for orders.\n\n3. Trade processor and the externalOrderId mapping (5 min): Proactively identify the partition mismatch problem, propose RocksDB, and explain why it's better than Redis for durable long-lived mappings.\n\nMinutes 40-45 — Extensions & wrap-up:\nBriefly mention additional considerations: excess price updates for volatile stocks (throttling/batching), live order updates to client via SSE, historical price data storage. Answer interviewer questions.",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Real-time update protocol choice",
      type: "question",
      sectionId: "sec_q_live_prices",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What protocol/technology is used for pushing live stock price updates from the symbol service to clients in the optimal Robinhood design?",
        explanation:
          "Server-Sent Events (SSE) is the preferred protocol. It provides unidirectional push from server to client over standard HTTP. Since clients only receive price data (they don't send prices back), SSE is simpler and more appropriate than WebSockets.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Server-Sent Events (SSE)",
          acceptableAnswers: [
            "SSE",
            "Server-Sent Events",
            "Server Sent Events",
            "server-sent events",
            "server sent events",
            "sse",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Pub/sub technology for price fan-out",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What technology is used as the pub/sub layer to route symbol price updates from the price processor to the correct symbol service servers?",
        explanation:
          "Redis pub/sub is used to publish price updates to channels named after symbols. Symbol service servers subscribe to channels for symbols their connected users care about. Redis is ideal because it provides low-latency publish/subscribe with simple channel management.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Redis pub/sub",
          acceptableAnswers: [
            "Redis pub/sub",
            "Redis",
            "redis pub/sub",
            "redis",
            "Redis Pub/Sub",
            "Redis pubsub",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "KV store for order-to-trade mapping",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "What key-value store is recommended for mapping externalOrderId to (orderId, userId) in the trade processor? Why is it preferred over Redis for this specific use case?",
        explanation:
          "RocksDB is recommended because it provides durable, persistent storage (LSM-tree based) without keeping everything in memory. Limit orders can remain open for days, and the mapping must survive crashes. Redis keeps data in memory (expensive for millions of mappings) and risks losing data on crashes, even with persistence options.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "RocksDB",
          acceptableAnswers: [
            "RocksDB",
            "rocksdb",
            "Rocks DB",
            "rocks db",
            "RocksDB (for durability)",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Order status before exchange submission",
      type: "question",
      sectionId: "sec_q_order_management",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'In the "write intent first" pattern used for order consistency, what status is an order stored with BEFORE being submitted to the exchange, and what design principle does this represent?',
        explanation:
          'The order is stored with status "pending" before exchange submission. This represents the "write intent first" (or "write-ahead") pattern: always record what you intend to do before doing it, so that failures at any subsequent step can be recovered by inspecting and reconciling the recorded intent.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "pending",
          acceptableAnswers: ["pending", "Pending", "PENDING", '"pending"', "status pending"],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match component to role in Robinhood architecture",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each component to its role in the Robinhood architecture:",
        explanation:
          "The symbol price processor listens to the exchange trade feed and updates the cache. Redis pub/sub routes price updates to the right symbol service servers. The NAT Gateway allows the order service fleet to reach the exchange under a small set of IPs. RocksDB maps externalOrderId to (orderId, userId) for trade processing.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Symbol Price Processor",
              right: "Listens to exchange trade feed and updates price cache",
            },
            {
              id: "p2",
              left: "Redis Pub/Sub",
              right: "Routes price updates to symbol service servers with interested users",
            },
            {
              id: "p3",
              left: "NAT Gateway",
              right: "Allows order service fleet to reach exchange under a small set of IPs",
            },
            {
              id: "p4",
              left: "RocksDB",
              right: "Maps externalOrderId to (orderId, userId) for trade processing",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match price update approach to its tradeoff",
      type: "question",
      sectionId: "sec_q_live_prices",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each live price update approach to its primary tradeoff:",
        explanation:
          "Polling the exchange directly creates too many exchange connections. Polling an internal cache reduces exchange load but polling intervals limit update speed. SSE provides instant updates but requires sticky sessions and connection management. Redis pub/sub enables scalable routing but adds infrastructure complexity.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Polling exchange directly",
              right: "Simple but wastes exchange connections and cannot meet 200ms SLA",
            },
            {
              id: "p2",
              left: "Polling internal cache",
              right: "Reduces exchange load but polling interval limits update freshness",
            },
            {
              id: "p3",
              left: "SSE connections",
              right: "Near-instant updates but requires sticky sessions and reconnection handling",
            },
            {
              id: "p4",
              left: "Redis pub/sub fan-out",
              right: "Scalable price routing but adds infrastructure dependency",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match failure scenario to recovery mechanism",
      type: "question",
      sectionId: "sec_q_order_management",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each failure scenario in the order workflow to the correct recovery mechanism:",
        explanation:
          "DB write failure before exchange: safe stop, no side effects. Exchange submission failure: mark failed in DB. Post-exchange DB failure: cleanup job queries exchange using clientOrderId. Cancel exchange failure: cleanup job scans pending_cancel orders and retries cancellation.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "DB write fails before exchange submission",
              right: "Respond with error and stop — no side effects to clean up",
            },
            {
              id: "p2",
              left: "Exchange submission fails",
              right: 'Mark order as "failed" in DB, respond to client',
            },
            {
              id: "p3",
              left: "DB update fails after successful exchange submission",
              right: "Cleanup job queries exchange using clientOrderId to reconcile",
            },
            {
              id: "p4",
              left: "Exchange cancellation request fails",
              right: "Cleanup job scans pending_cancel orders and retries cancellation",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "Financial price representation",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In financial APIs, prices are represented as _____ instead of floating-point decimals to avoid precision errors that could lead to financial discrepancies.",
        explanation:
          "Integer cents (e.g., $52.10 → 5210 or 52100) avoid floating-point precision issues entirely. This is a standard practice in fintech: represent the smallest currency unit as an integer to prevent rounding errors that could accumulate across millions of transactions.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "In financial APIs, prices are represented as {{blank1}} instead of floating-point decimals to avoid precision errors that could lead to financial discrepancies.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "integers (cents)",
              acceptableAnswers: [
                "integers",
                "integer cents",
                "cents",
                "integers (cents)",
                "integer values",
                "whole numbers",
              ],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Robinhood system type",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Robinhood is a _____, not an exchange. It routes trades through external market makers and is compensated via payment for order flow.",
        explanation:
          "Robinhood is a brokerage (also called a stock broker). This distinction is critical for system design because it means we interface with external exchange APIs rather than building order-matching infrastructure ourselves.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Robinhood is a {{blank1}}, not an exchange. It routes trades through external market makers and is compensated via payment for order flow.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "brokerage",
              acceptableAnswers: ["brokerage", "broker", "stock broker", "stock brokerage"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Order intent pattern",
      type: "question",
      sectionId: "sec_q_order_management",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          'The order service uses the "write _____ first" pattern — always recording the intended operation in the database before performing it on the exchange, so failures at any subsequent step can be recovered.',
        explanation:
          'The "write intent first" (or "write-ahead") pattern ensures that every external operation has a corresponding database record that can be reconciled later. For order creation, this means storing "pending" before exchange submission; for cancellation, "pending_cancel" before submitting the cancel request.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            'The order service uses the "write {{blank1}} first" pattern — always recording the intended operation in the database before performing it on the exchange, so failures at any subsequent step can be recovered.',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "intent",
              acceptableAnswers: ["intent", "Intent", "ahead"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // --- Numerical (2 questions) ---

    // Numerical 1 — medium
    {
      title: "Daily trade volume estimation",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "Robinhood has 20M daily active users and each user makes an average of 5 trades per day. How many trades per day does the system process? (Answer in millions)",
        explanation:
          "Total daily trades = 20,000,000 users × 5 trades/user = 100,000,000 = 100M trades per day. This helps size the order database, exchange API rate limits, and trade processor throughput.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 100,
          tolerance: 5,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Peak trades per second estimation",
      type: "question",
      sectionId: "sec_q_deep_dives",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "With 100M trades per day, assuming trading happens over an 8-hour window and peak traffic is 5x the average, what is the peak trades per second the order service must handle? (Round to nearest thousand)",
        explanation:
          "Average TPS = 100,000,000 / (8 × 3600) = 100,000,000 / 28,800 ≈ 3,472 TPS. Peak = 3,472 × 5 ≈ 17,361 TPS ≈ ~17,000 TPS. This informs how aggressively we need to scale the order service and size the NAT Gateway.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 17000,
          tolerance: 3000,
        },
      },
    },
  ],
};
