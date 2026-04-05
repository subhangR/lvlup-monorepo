import { StoryPointSeed, ItemSeed } from "../subhang-content";

// ── Payment System — HLD Interview Prep ──
// Source: HelloInterview — Payment System breakdown by Evan King
// 3 rich materials + 30 practice questions

export const paymentSystemContent: StoryPointSeed = {
  title: "Payment System",
  description:
    "Master the design of a payment processing system like Stripe — from core entities and API design through security, durability with CDC/event sourcing, idempotent transaction safety, and scaling to 10,000+ TPS.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_entities_api", title: "Core Entities & API Design", orderIndex: 1 },
    { id: "sec_q_security", title: "Security & Data Protection", orderIndex: 2 },
    { id: "sec_q_durability", title: "Durability, CDC & Event Sourcing", orderIndex: 3 },
    { id: "sec_q_transaction_safety", title: "Transaction Safety & Idempotency", orderIndex: 4 },
    { id: "sec_q_scaling", title: "Scaling & Webhook Architecture", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════

    // Material 1: Fundamentals — Requirements, Entities, API, High-Level Design
    {
      title: "Payment System Fundamentals",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Payment System Fundamentals",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is a Payment Processing System?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Payment processing systems like Stripe allow businesses (merchants) to accept payments from customers without building their own payment infrastructure. Customers input their payment details on the merchant's website, the merchant sends payment details to the payment processor, which processes the payment through external payment networks and returns the result.",
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
                  "Merchants should be able to initiate payment requests (charge a customer for a specific amount).",
                  "Users should be able to pay for products with credit/debit cards.",
                  "Merchants should be able to view status updates for payments (e.g., pending, success, failed).",
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
                  "Highly secure — protect merchant authentication and customer payment data.",
                  "Durability and auditability — no transaction data ever lost, even in case of failures.",
                  "Transaction safety and financial integrity despite asynchronous external payment networks.",
                  "Scalable to handle high transaction volume (10,000+ TPS) with potentially bursty traffic.",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 3 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Merchant: Stores business identity details, bank account information, and API keys.",
                  "PaymentIntent: Represents the merchant's intention to collect a specific amount. Owns the state machine: created → authorized → captured / canceled / refunded. Enforces idempotency for retries.",
                  "Transaction: A polymorphic money-movement record linked to one PaymentIntent. Types include Charge, Refund, Dispute, and Payout. Relationship is one-to-many: a single PaymentIntent can have multiple Transactions (retries, partial payments, refunds).",
                ],
              },
            },
            {
              id: "b9",
              type: "heading",
              content: "API Design",
              metadata: { level: 3 },
            },
            {
              id: "b10",
              type: "code",
              content:
                '// 1. Create PaymentIntent\nPOST /payment-intents -> paymentIntentId\n{\n  "amountInCents": 2499,\n  "currency": "usd",\n  "description": "Order #1234"\n}\n\n// 2. Process Payment (charge)\nPOST /payment-intents/{paymentIntentId}/transactions\n{\n  "type": "charge",\n  "card": { "number": "4242...", "exp_month": 12, "exp_year": 2025, "cvc": "123" }\n}\n\n// 3. Check payment status\nGET /payment-intents/{paymentIntentId} -> PaymentIntent\n\n// 4. Webhook callback (push-based)\nPOST {merchant_webhook_url}\n{\n  "type": "payment.succeeded",\n  "data": { "paymentId": "pay_123", "amountInCents": 2499, "status": "succeeded" }\n}',
              metadata: { language: "text" },
            },
            {
              id: "b11",
              type: "heading",
              content: "High-Level Architecture",
              metadata: { level: 3 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "The core architecture involves three main components: (1) API Gateway — entry point handling authentication, rate limiting, and request routing; (2) Payment Service — creates and manages PaymentIntents, interfaces with the database; (3) Transaction Service — receives card details, manages transaction records, and interfaces directly with external payment networks (Visa, Mastercard, banking systems).",
            },
            {
              id: "b13",
              type: "heading",
              content: "Payment Processing Flow",
              metadata: { level: 3 },
            },
            {
              id: "b14",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  'Merchant creates a PaymentIntent via POST /payment-intents. Status: "created". No actual charge occurs yet.',
                  "Customer enters card details on merchant's website. Merchant sends data to Transaction Service with PaymentIntent ID.",
                  'Transaction Service creates a transaction record (status: "pending"), sends authorization request to external payment network.',
                  "Payment network responds (approval/decline). Transaction Service updates records and continues listening for callbacks (settlement, chargeback).",
                  "Transaction Service updates PaymentIntent status as the transaction progresses through its lifecycle.",
                  "Merchant checks status via GET endpoint or receives webhook notifications for real-time updates.",
                ],
              },
            },
            {
              id: "b15",
              type: "quote",
              content:
                '"Payment processing is a perfect example of the multi-step processes pattern. A single payment goes through multiple stages: authorization, capture, settlement, and potentially refunds or disputes. Each step can fail independently and may require retries or compensation." — Evan King, HelloInterview',
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Deep Dives — Security, Durability, Transaction Safety
    {
      title: "Security, Durability & Transaction Safety",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Security, Durability & Transaction Safety",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Deep Dive 1: Security",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "heading",
              content: "Merchant Authentication",
              metadata: { level: 3 },
            },
            {
              id: "d3",
              type: "paragraph",
              content:
                "Basic API key authentication (Authorization: Bearer pk_live_...) is simple but vulnerable to interception and replay attacks. The enhanced approach uses request signing with HMAC: merchants get a public API key for identification plus a private secret key for generating time-bound signatures. Each request includes a timestamp, nonce, and HMAC-SHA256 signature computed over the request body. The API Gateway recreates the signature, validates the timestamp window (5-15 min), and checks nonce uniqueness to prevent replay attacks.",
            },
            {
              id: "d4",
              type: "code",
              content:
                '// Enhanced request signing\n{\n  "headers": {\n    "Authorization": "Bearer pk_live_51NzQRt...",  // Public API key\n    "X-Request-Timestamp": "2023-10-15T14:22:31Z",\n    "X-Request-Nonce": "a1b2c3d4-e5f6-...",\n    "X-Signature": "sha256=7f83b1657ff1..."        // HMAC of body\n  }\n}\n\n// Server-side verification:\n// 1. Retrieve secret key from API key lookup\n// 2. Recompute HMAC over request body\n// 3. Compare signatures\n// 4. Validate timestamp within acceptable window\n// 5. Ensure nonce hasn\'t been used before',
              metadata: { language: "javascript" },
            },
            {
              id: "d5",
              type: "heading",
              content: "Protecting Customer Payment Data",
              metadata: { level: 3 },
            },
            {
              id: "d6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Bad: Server-side collection — card data touches merchant servers, massive PCI compliance burden, every merchant becomes an attack target.",
                  "Good: Client-side iFrame isolation — JS SDK loads an iframe from the payment processor's domain. Browser same-origin policy prevents merchant code from accessing card data. Data goes directly to processor servers.",
                  "Great: iFrame + Client-side Encryption — SDK encrypts card data using the processor's public key before it leaves the customer's browser. Even if the iframe is compromised, attackers only get encrypted data. Private key stored in HSMs (Hardware Security Modules) for decryption. Multi-layered: encryption at rest + HTTPS in transit.",
                ],
              },
            },
            {
              id: "d7",
              type: "heading",
              content: "Deep Dive 2: Durability & Auditability",
              metadata: { level: 2 },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "Every transaction represents real money. Regulations (PCI-DSS, SOX) require complete, immutable records of every payment attempt, success, and failure. When a customer disputes a charge six months later, you must prove exactly what happened.",
            },
            {
              id: "d9",
              type: "heading",
              content: "Approaches to Durability",
              metadata: { level: 3 },
            },
            {
              id: "d10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Bad: Single database with current state only — UPDATE overwrites history. No way to prove sequence of events. Fails audit requirements.",
                  "Good: Separate audit tables — append-only audit log alongside operational tables within the same transaction. Preserves history but relies on application code remembering to write both records.",
                  "Great: Database + Change Data Capture (CDC) + Event Stream — CDC monitors the database WAL/oplog, capturing every committed change as an event published to Kafka. Guarantees nothing is missed since it operates at the database level, not application level. Specialized consumers handle audit, analytics, reconciliation, and webhooks independently.",
                ],
              },
            },
            {
              id: "d11",
              type: "code",
              content:
                '// CDC event example (published to Kafka)\n{\n  "op": "update",\n  "source": "payment_intents_db",\n  "table": "payment_intents",\n  "ts_ms": 1681234568901,\n  "before": { "payment_intent_id": "pi_123", "status": "created" },\n  "after":  { "payment_intent_id": "pi_123", "status": "authorized" }\n}\n\n// Consumers:\n// - Audit Service: immutable history for compliance\n// - Reconciliation: correlate with external payment network events\n// - Webhook Delivery: track merchant notifications\n// - Analytics: denormalized views for BI',
              metadata: { language: "javascript" },
            },
            {
              id: "d12",
              type: "heading",
              content: "Deep Dive 3: Transaction Safety & Idempotency",
              metadata: { level: 2 },
            },
            {
              id: "d13",
              type: "paragraph",
              content:
                'Payment networks are fundamentally asynchronous. A payment we consider "timed out" might still be processing. The most dangerous risk is double-charging: customer clicks pay, we timeout, merchant retries, customer gets charged twice. The opposite risk: payment succeeds at the bank but we never know, so merchant never ships the product.',
            },
            {
              id: "d14",
              type: "heading",
              content: "Approaches to Transaction Safety",
              metadata: { level: 3 },
            },
            {
              id: "d15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Bad: Assume timeouts mean failure — silent double-charges when bank approved but response was lost.",
                  'Good: Pending states with manual reconciliation — "pending_verification" state for timeouts, idempotency keys prevent duplicate charges, but manual reconciliation becomes a bottleneck during peak periods.',
                  "Great: Event-driven safety with automated reconciliation — Record attempt before calling payment network. Handle success/timeout/failure as CDC events. Reconciliation service consumes timeout events and proactively queries payment networks. Batch reconciliation files from networks serve as authoritative truth.",
                ],
              },
            },
            {
              id: "d16",
              type: "heading",
              content: "Two-Phase Event Model (Stripe Pattern)",
              metadata: { level: 3 },
            },
            {
              id: "d17",
              type: "paragraph",
              content:
                'Production systems like Stripe use a two-phase event model: (1) Transaction Created Event — emitted when processing begins, before the DB write completes. If this fails, the transaction enters a locked/failed state. (2) Transaction Completed Event — emitted after the DB write succeeds. If this fails, updates are blocked until the completion event is emitted. During retries, the system compares "created" event data with actual DB state to determine if only the completion event needs re-emission.',
            },
            {
              id: "d18",
              type: "quote",
              content:
                '"The key to handling asynchronous payment networks is accepting that uncertainty is inevitable and building systems designed for eventual consistency. The best distributed systems don\'t fight the nature of external dependencies — they embrace and design for them." — Evan King, HelloInterview',
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Scaling & Webhooks
    {
      title: "Scaling & Webhook Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Scaling & Webhook Architecture",
          blocks: [
            {
              id: "e1",
              type: "heading",
              content: "Deep Dive 4: Scaling to 10,000+ TPS",
              metadata: { level: 2 },
            },
            {
              id: "e2",
              type: "heading",
              content: "Stateless Services",
              metadata: { level: 3 },
            },
            {
              id: "e3",
              type: "paragraph",
              content:
                "Each service (Payment Service, Transaction Service, Webhook Service) is stateless and scales horizontally with load balancers distributing traffic. This is the baseline — no special architecture needed.",
            },
            {
              id: "e4",
              type: "heading",
              content: "Kafka Partitioning Strategy",
              metadata: { level: 3 },
            },
            {
              id: "e5",
              type: "paragraph",
              content:
                "Kafka can handle millions of messages/second at the cluster level, but each partition handles roughly 5,000-10,000 msg/s. For 10k TPS, we need 3-5 partitions. Critical design decision: partition by payment_intent_id to guarantee ordering for all events within a single PaymentIntent (created → authorized → captured), while allowing parallel processing across different PaymentIntents. Replication factor of 3 across brokers for fault tolerance.",
            },
            {
              id: "e6",
              type: "heading",
              content: "Database Scaling",
              metadata: { level: 3 },
            },
            {
              id: "e7",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Write scaling: ~10k writes/second is at the edge of an optimized PostgreSQL instance. Shard by merchant_id to distribute write load.",
                  "Data growth: ~500 bytes/row × 10k TPS ≈ 5 MB/s ≈ 500 GB/day ≈ 180 TB/year. Requires data retention and archiving strategy.",
                  "Cold storage: Move transactions older than 3-6 months to S3/GCS. Still accessible for compliance but doesn't impact operational DB.",
                  "Read scaling: Read replicas for status checks and reports. Redis/Memcached caching layer for frequently accessed recent payment statuses.",
                ],
              },
            },
            {
              id: "e8",
              type: "heading",
              content: "Webhook System Architecture",
              metadata: { level: 2 },
            },
            {
              id: "e9",
              type: "paragraph",
              content:
                "Webhooks provide push-based server-to-server notifications (NOT websockets or SSE, which are server-to-client). Merchants register a callback URL and subscribed event types. The system proactively POSTs event payloads when payment statuses change.",
            },
            {
              id: "e10",
              type: "heading",
              content: "Webhook Flow",
              metadata: { level: 3 },
            },
            {
              id: "e11",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Database changes trigger CDC events published to Kafka event stream.",
                  "Webhook Service consumes events, checks if merchant has configured a webhook for that event type.",
                  "Service prepares payload, signs it with a shared secret for verification, and attempts delivery.",
                  "Delivery attempts are recorded. Failed deliveries trigger exponential backoff retries (5s, 25s, 125s, ... up to 1 hour).",
                  "Merchant verifies signature, processes payload, returns 2xx to acknowledge receipt.",
                ],
              },
            },
            {
              id: "e12",
              type: "code",
              content:
                '// Webhook payload example\n{\n  "id": "evt_1JklMnOpQrStUv",\n  "type": "payment.succeeded",\n  "created": 1633031234,\n  "data": {\n    "object": {\n      "id": "pay_1AbCdEfGhIjKlM",\n      "amountInCents": 2499,\n      "currency": "usd",\n      "status": "succeeded"\n    }\n  }\n}',
              metadata: { language: "javascript" },
            },
            {
              id: "e13",
              type: "heading",
              content: "What Staff+ Candidates Demonstrate",
              metadata: { level: 3 },
            },
            {
              id: "e14",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Recognize event sourcing with reconciliation aligns with how financial systems fundamentally work.",
                  "Explain multi-layered security (tokenization + client-side encryption) as defense-in-depth.",
                  "Proactively address edge cases: payment network outages, fallback processing paths, eventual consistency with external networks.",
                  "Understand CDC as a potential SPOF and discuss mitigations: multiple independent CDC instances, monitoring for lag, application-level fallbacks.",
                ],
              },
            },
            {
              id: "e15",
              type: "quote",
              content:
                '"Identifying where to spend more and less time in a system design interview based on where the challenges are is an important skill. Spending time on simple, auxiliary, or otherwise less important parts of the system is a recipe for running out of time." — Evan King, HelloInterview',
            },
          ],
          readingTime: 8,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // QUESTIONS (30 total)
    // MCQ: 8, MCAQ: 4, Paragraph: 6, Text: 4, Matching: 3,
    // Fill-blanks: 3, Numerical: 2
    // ═══════════════════════════════════════════════════════════

    // ── MCQ (8) ──────────────────────────────────────────────

    // MCQ 1 — easy
    {
      title: "PaymentIntent vs Transaction relationship",
      type: "question",
      sectionId: "sec_q_entities_api",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the relationship between a PaymentIntent and a Transaction in a payment processing system like Stripe?",
        explanation:
          "A PaymentIntent represents the merchant's intention to collect a specific amount and tracks the overall lifecycle. A single PaymentIntent can have multiple Transactions — for example, if the first charge attempt fails and is retried, or if a refund is issued later. Each Transaction is a discrete money-movement record linked back to one PaymentIntent. This is a one-to-many relationship: one PaymentIntent, many possible Transactions.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Many-to-one: multiple PaymentIntents share a single Transaction",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Many-to-many: PaymentIntents and Transactions have no fixed relationship",
              isCorrect: false,
            },
            {
              id: "c",
              text: "One-to-many: a single PaymentIntent can have multiple Transactions (retries, refunds, partial payments)",
              isCorrect: true,
            },
            {
              id: "d",
              text: "One-to-one: each PaymentIntent maps to exactly one Transaction",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why card data should not touch merchant servers",
      type: "question",
      sectionId: "sec_q_security",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is it critical that raw credit card data never touches the merchant's servers in a payment system?",
        explanation:
          "PCI-DSS (Payment Card Industry Data Security Standard) mandates strict controls on how payment data is handled. If card data touches merchant servers, those servers, networks, and all connected services fall under PCI compliance scope — an enormous security and compliance burden. By using techniques like iFrame isolation, card data goes directly from the customer's browser to the payment processor, keeping merchants out of PCI scope.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Merchant servers cannot encrypt data, so it would be transmitted in plaintext",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It would make the payment processing slower due to additional network hops",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Payment networks refuse to process transactions from merchant IP addresses",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It brings the merchant's entire infrastructure into PCI compliance scope, creating massive security and liability requirements",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Webhooks vs WebSockets for payment notifications",
      type: "question",
      sectionId: "sec_q_entities_api",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "For notifying merchants about payment status changes, payment systems like Stripe use webhooks rather than WebSockets. What is the key architectural reason?",
        explanation:
          "Webhooks are server-to-server HTTP callbacks — the payment system POSTs events to the merchant's server endpoint. WebSockets and SSE are server-to-client technologies designed for browser/mobile connections. Payment status notifications need to reach the merchant's backend systems (to trigger fulfillment, update inventory, etc.), not a browser. Webhooks are the standard for system-to-system communication in this context.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Webhooks provide stronger encryption than WebSocket connections",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Webhooks are server-to-server communication, while WebSockets are server-to-client — merchants need backend notifications, not browser updates",
              isCorrect: true,
            },
            {
              id: "c",
              text: "WebSockets cannot handle the volume of payment events at scale",
              isCorrect: false,
            },
            {
              id: "d",
              text: "WebSockets require merchants to keep connections open permanently, which is technically impossible",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "CDC advantage over application-level audit logging",
      type: "question",
      sectionId: "sec_q_durability",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A payment system uses Change Data Capture (CDC) on the database WAL instead of application-level audit logging. What is the most critical advantage of this approach?",
        explanation:
          "CDC operates at the database level by monitoring the write-ahead log (WAL). Every committed change is automatically captured as an event, regardless of which application code made the change. Application-level audit logging depends on developers remembering to add audit writes alongside every data mutation — if a developer forgets, or a bug skips the audit insert, history is silently lost. CDC eliminates this class of bugs entirely because it captures changes at the storage layer.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "CDC allows multiple consumers without needing a message queue",
              isCorrect: false,
            },
            {
              id: "b",
              text: "CDC is faster because it writes to Kafka instead of a database",
              isCorrect: false,
            },
            {
              id: "c",
              text: "CDC guarantees no changes are missed because it captures at the database level, not the application level",
              isCorrect: true,
            },
            {
              id: "d",
              text: "CDC automatically encrypts audit records for compliance",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Idempotency key purpose in payment retries",
      type: "question",
      sectionId: "sec_q_transaction_safety",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When a merchant retries a payment request after a timeout, the system uses an idempotency key. What does this key primarily prevent?",
        explanation:
          "An idempotency key (typically a unique constraint on merchant_id + idempotency_key) ensures that retrying the same logical payment request returns the existing record instead of creating a new one. Without this, a timeout followed by a retry could create two charge attempts for the same purchase, resulting in a double charge. The idempotency key makes the operation safe to retry — the same input always produces the same output without side effects.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Unauthorized merchants from submitting payment requests",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Double-charging the customer when the original request actually succeeded but the response was lost",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Replay attacks where an attacker re-submits a captured payment request",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Payment network latency from exceeding acceptable thresholds",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Kafka partitioning strategy for payment events",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When partitioning Kafka topics for a payment system processing 10,000 TPS, what is the correct partitioning key and why?",
        explanation:
          "Partitioning by payment_intent_id ensures all events for a given PaymentIntent (created → authorized → captured) land on the same partition and are processed in order. This is critical because consumers need to see state transitions sequentially to maintain consistency. Partitioning by merchant_id would mix events from different PaymentIntents, potentially causing ordering issues. Random partitioning destroys all ordering guarantees. Timestamp-based partitioning doesn't help with logical grouping.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Random partitioning — maximizes throughput by distributing events evenly",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Partition by payment_intent_id — guarantees ordering of all state transitions for a single payment while enabling parallelism across payments",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Partition by timestamp — ensures chronological processing of all events globally",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Partition by merchant_id — groups all merchant activity for efficient batch processing",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Two-phase event model failure handling",
      type: "question",
      sectionId: "sec_q_transaction_safety",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'In Stripe\'s two-phase event model, a "Transaction Created" event is emitted before the database write, and a "Transaction Completed" event after. If the completed event fails to emit, what happens and why is this design superior to a single-event approach?',
        explanation:
          'When the completed event fails, the transaction enters a locked/failed state where further updates are blocked until the completion event is successfully emitted. During retries, the system compares the "created" event data with the actual database state. If the DB write already occurred, only the completion event needs re-emission (no need to retry the full transaction). This is superior to single-event because it separates "intention" from "confirmation," enabling intelligent retry logic that avoids duplicate side effects. A single event can\'t distinguish between "the write never happened" and "the write happened but notification failed."',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The created event is replayed, causing the entire transaction to be re-processed from scratch",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The system falls back to polling the payment network for the final status",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The transaction is automatically rolled back and the customer is refunded",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The transaction is locked until the completion event is emitted; retries compare created-event data with DB state to determine if only the event (not the write) needs retrying",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "CDC as single point of failure — mitigation",
      type: "question",
      sectionId: "sec_q_durability",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A savvy interviewer points out that CDC is a single point of failure in your payment system — if CDC stops, events stop flowing to Kafka even though database writes continue. Which mitigation strategy best addresses this for a financial system?",
        explanation:
          "Running multiple independent CDC instances reading from the same database and writing to different Kafka clusters provides true redundancy. Combined with monitoring that alerts within seconds if CDC lag increases and recovery procedures to replay missed events from database logs, this creates defense-in-depth. Application-level fallbacks that write directly to Kafka if CDC hasn't confirmed within a timeframe add another safety layer. Simply adding more Kafka replicas doesn't help if CDC itself fails. Read replicas address read scaling, not CDC failure. Periodic health checks without redundancy leave a window of data loss.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Add database read replicas that can take over CDC responsibilities",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Increase Kafka replication factor to 5 so events are never lost",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Run multiple independent CDC instances writing to different Kafka clusters, with sub-second lag monitoring and application-level fallback writes",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Implement periodic health checks that restart CDC if it becomes unresponsive",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4) ─────────────────────────────────────────────

    // MCAQ 1 — easy
    {
      title: "Valid PaymentIntent states",
      type: "question",
      sectionId: "sec_q_entities_api",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL valid states in the PaymentIntent lifecycle:",
        explanation:
          'A PaymentIntent progresses through: created (initial state after merchant creates it), processing (payment details received and being processed), succeeded (payment completed), and failed (processing failed with reason). "Queued" is not a standard PaymentIntent state — the intent is created immediately, not queued for later creation.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "processing", isCorrect: true },
            { id: "b", text: "created", isCorrect: true },
            { id: "c", text: "queued", isCorrect: false },
            { id: "d", text: "failed", isCorrect: true },
            { id: "e", text: "succeeded", isCorrect: true },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Benefits of iFrame isolation for payment forms",
      type: "question",
      sectionId: "sec_q_security",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL benefits of using iFrame isolation for collecting payment card details:",
        explanation:
          "iFrame isolation ensures card data never touches merchant servers (reducing PCI scope), leverages browser same-origin policy to prevent merchant JavaScript from accessing the card form, and sends data directly to the payment processor's domain. However, iFrames do NOT protect against network-level attacks like MITM — that's what HTTPS/TLS provides. iFrame isolation is about protecting data from the merchant's own code, not from network attackers.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Browser same-origin policy prevents merchant JavaScript from accessing card data inside the frame",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Data is transmitted directly from customer's browser to the payment processor's domain",
              isCorrect: true,
            },
            {
              id: "c",
              text: "iFrames inherently encrypt all data, making HTTPS unnecessary",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Card data never reaches the merchant's servers, reducing their PCI compliance scope",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Components that consume CDC event stream",
      type: "question",
      sectionId: "sec_q_durability",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "In a CDC-based payment architecture, select ALL services that would consume events from the Kafka event stream:",
        explanation:
          "The CDC event stream is consumed by: the Audit Service (maintains immutable history for compliance), Reconciliation Service (correlates internal events with external payment network records), Webhook Service (sends push notifications to merchants), and Analytics Service (builds BI views). The API Gateway does NOT consume from the event stream — it handles incoming HTTP requests and routes them to microservices. It operates synchronously on the request path, not as an event consumer.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "API Gateway", isCorrect: false },
            { id: "b", text: "Audit Service", isCorrect: true },
            { id: "c", text: "Reconciliation Service", isCorrect: true },
            { id: "d", text: "Webhook Service", isCorrect: true },
            { id: "e", text: "Analytics Service", isCorrect: true },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Preventing double-charges in payment systems",
      type: "question",
      sectionId: "sec_q_transaction_safety",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL mechanisms that work together to prevent double-charging in a robust payment system:",
        explanation:
          "Preventing double-charges requires multiple complementary mechanisms: (1) Idempotency keys with unique DB constraints ensure retries return existing records instead of creating duplicates. (2) Recording attempt records before calling the payment network creates an audit trail of intentions. (3) Automated reconciliation with payment network settlement files provides the authoritative truth about what actually happened. Rate limiting prevents abuse but doesn't address the double-charge problem — a legitimate retry after a timeout could still cause a double charge without idempotency.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Automated reconciliation with payment network settlement files",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Rate limiting on the payment API to prevent rapid successive requests",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Recording attempt records before calling the payment network",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Idempotency keys with unique database constraints on merchant_id + idempotency_key",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── Paragraph (6) ────────────────────────────────────────

    // Paragraph 1 — medium
    {
      title: "Explain the PaymentIntent lifecycle",
      type: "question",
      sectionId: "sec_q_entities_api",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Describe the complete lifecycle of a PaymentIntent from creation to successful capture. Include the state transitions, which services are involved at each step, and how the merchant is kept informed of progress.",
        explanation:
          'A strong answer covers: (1) Merchant POSTs to /payment-intents, Payment Service creates record with status "created" and returns paymentIntentId. (2) Customer enters card details on merchant site, merchant sends to Transaction Service with PaymentIntent ID. Transaction created with status "pending." (3) Transaction Service sends authorization to external payment network. On approval, status moves to "authorized." (4) Capture phase: funds are settled, status moves to "captured/succeeded." (5) Throughout, merchant can poll GET /payment-intents/{id} or receive webhook callbacks for real-time status changes. Key insight: payment processing is inherently asynchronous — the authorization response is just the first step in a process that can take minutes or days.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Paragraph 2 — medium
    {
      title: "Compare audit durability approaches",
      type: "question",
      sectionId: "sec_q_durability",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare three approaches to ensuring durability and auditability in a payment system: (1) single database with current state only, (2) separate audit tables, and (3) CDC + event stream. For each, explain the approach and its key weakness.",
        explanation:
          "A strong answer covers: (1) Single DB: UPDATE in place overwrites history. Weakness: no way to prove sequence of events, fails compliance audits, application bugs silently corrupt data. (2) Audit tables: append-only audit log alongside operational tables in the same transaction. Weakness: relies on developers always writing both records — if forgotten, history is silently lost; also couples audit storage growth with operational DB. (3) CDC + Event Stream: monitors DB WAL, publishes all changes to Kafka, specialized consumers handle audit/reconciliation/webhooks independently. Weakness: CDC itself is a potential SPOF (mitigated by running multiple instances). This is the recommended approach because it captures at the database level (can't be forgotten), separates concerns for independent scaling, and provides an immutable event stream.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the reconciliation flow for payment timeouts",
      type: "question",
      sectionId: "sec_q_transaction_safety",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A payment request to an external network times out after 30 seconds. Describe the complete event-driven reconciliation flow that determines the actual outcome, prevents double-charging, and ensures eventual consistency. Include the role of CDC, Kafka, the reconciliation service, and payment network settlement files.",
        explanation:
          'A staff-level answer includes: (1) Before calling the network, an attempt record is written to the DB with status "pending" and the network reference ID. CDC captures this as an event. (2) On timeout, the attempt status is updated to "timeout" — CDC publishes this to Kafka. (3) The Reconciliation Service consumes timeout events and proactively queries the payment network using the recorded reference ID for real-time verification. (4) For batch verification, payment networks deliver settlement files (daily/hourly) — comprehensive records of all processed transactions. The Reconciliation Service correlates these with internal attempts. (5) Idempotency keys (unique constraint on merchant_id + idempotency_key) prevent duplicate charges during merchant retries. (6) The two-phase event model (created + completed events) ensures that retries can distinguish between "the write never happened" and "the write happened but notification failed." This architecture accepts uncertainty as inevitable and builds for eventual consistency.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 4 — hard
    {
      title: "Multi-layered security design for payment data",
      type: "question",
      sectionId: "sec_q_security",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a multi-layered security architecture for a payment system that protects both merchant authentication and customer card data. Explain at least three distinct security layers and how they complement each other (defense-in-depth).",
        explanation:
          "A staff-level answer covers: Layer 1 — Merchant Authentication: Public API key for identification + private secret key for HMAC request signing. Each request includes timestamp and nonce to prevent replay attacks. API Gateway validates by recomputing HMAC and checking timestamp window. Layer 2 — iFrame Isolation: JS SDK loads payment form in an iframe from the processor's domain. Browser same-origin policy prevents merchant code from accessing card data. Card data never touches merchant servers, keeping them out of PCI scope. Layer 3 — Client-side Encryption: SDK encrypts card data with processor's public key before it leaves the customer's browser. Even if the iframe is compromised, attackers only get data they can't decrypt. Private key stored in HSMs. Layer 4 — Transport Security: HTTPS/TLS for all communication (now protecting already-encrypted data). Layer 5 — Private Network Connections: Payment networks use dedicated connections through HSMs, mutual TLS, leased lines, and VPN tunnels with proprietary protocols (ISO 8583). These layers are complementary: if any single layer fails, others continue protecting the data.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 5 — hard
    {
      title: "Database scaling strategy for 10K TPS",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Your payment system must handle 10,000 TPS with 180TB/year data growth. Design a complete database scaling strategy covering write scaling, read scaling, data lifecycle management, and how you maintain query performance as data grows.",
        explanation:
          "A complete answer includes: Write Scaling — Shard by merchant_id to distribute write load. 10k writes/s is at the edge of a single PostgreSQL instance, so sharding is needed for headroom. Choose merchant_id because it distributes load evenly and keeps a merchant's data co-located for efficient queries. Read Scaling — Deploy read replicas for status checks, reports, and dashboards. Add Redis/Memcached caching layer for frequently accessed recent payment statuses. Most payment queries are reads (checking status). Data Lifecycle — At 500 bytes/row × 10k TPS ≈ 500 GB/day ≈ 180 TB/year. Implement time-based partitioning. Move transactions older than 3-6 months to cold storage (S3/GCS) via scheduled jobs. Archived data remains accessible for compliance. Performance — Proper indexing on payment_intent_id, merchant_id, and status columns. Time-range partitioning enables efficient pruning of queries. Separate operational and analytical workloads (CDC consumers handle analytics without impacting operational DB).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 6 — hard
    {
      title: "Webhook delivery reliability design",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a reliable webhook delivery system for a payment processor. Address: how events flow from payment state changes to merchant endpoints, how you handle delivery failures, how merchants verify authenticity, and what happens during extended merchant outages.",
        explanation:
          "A complete answer covers: Event Flow — Database state changes are captured by CDC and published to Kafka. Webhook Service consumes events, checks merchant's configured webhook endpoint and subscribed event types, prepares payload. Authenticity — Payload is signed with a shared secret (HMAC). Merchants verify the signature before processing, preventing spoofed webhooks. Delivery & Retries — Each delivery attempt is recorded with status. Failed deliveries use exponential backoff (5s, 25s, 125s, ... up to 1 hour max interval). Include idempotency keys in payloads so merchants can safely handle duplicate deliveries. Merchant Acknowledgment — Merchants must return 2xx to confirm receipt. Non-2xx or timeout triggers retry. Extended Outages — Queue undeliverable events with TTL. Provide a merchant dashboard to view and replay missed webhooks. Consider circuit breaker pattern: if a merchant's endpoint fails repeatedly, pause delivery and alert the merchant rather than overwhelming their recovering systems.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // ── Text (4) ─────────────────────────────────────────────

    // Text 1 — medium
    {
      title: "Name the protocol used by payment networks",
      type: "question",
      sectionId: "sec_q_security",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Payment networks like Visa and Mastercard use a specific message format standard for financial transactions over their private networks. What is the name or number of this standard?",
        explanation:
          "ISO 8583 is the international standard for financial transaction card-originated messages. Unlike typical REST APIs, payment networks use binary protocols with this specific message format, transmitted over leased lines and VPN tunnels with mutual TLS authentication. Understanding that payment networks operate on entirely separate infrastructure from the public internet — with proprietary protocols, HSMs, and formal certification requirements — is an important detail for staff-level candidates.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "ISO 8583",
        },
      },
    },

    // Text 2 — medium
    {
      title: "What hardware stores encryption private keys",
      type: "question",
      sectionId: "sec_q_security",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In the most secure payment data protection approach, client-side encryption uses a public key to encrypt card data before it leaves the browser. Where is the corresponding private key stored for decryption on the server side?",
        explanation:
          "Hardware Security Modules (HSMs) are specialized tamper-resistant hardware devices designed to securely store and manage cryptographic keys. In a payment system, the private key used to decrypt card data is stored in HSMs rather than in software or configuration files. HSMs provide physical security guarantees — they can detect and respond to tampering attempts, and the keys never leave the hardware in plaintext. This is a PCI-DSS requirement for handling encryption keys in payment systems.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Hardware Security Modules (HSMs)",
        },
      },
    },

    // Text 3 — hard
    {
      title: "Identify the failure mode: timeout then retry",
      type: "question",
      sectionId: "sec_q_transaction_safety",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'A customer clicks "pay" for a $50 purchase. The bank approves and debits the account, but the response is lost due to network congestion. Your system times out and marks the payment as "failed." The merchant retries, creating a second charge. What is the specific name for this failure mode?',
        explanation:
          "This is a double-charge (or duplicate charge). It occurs when the system incorrectly assumes a timeout means failure, when in reality the payment network had already approved and debited the customer. The retry creates a second legitimate charge for the same purchase. This is the most dangerous failure mode in payment systems and is precisely why idempotency keys, pending verification states, and reconciliation with payment network settlement files are essential safety mechanisms.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Double-charge",
        },
      },
    },

    // Text 4 — hard
    {
      title: "Name the database feature CDC monitors",
      type: "question",
      sectionId: "sec_q_durability",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Change Data Capture (CDC) monitors a specific database-level log to capture every committed change. In PostgreSQL, what is this log called?",
        explanation:
          "The Write-Ahead Log (WAL) in PostgreSQL (called oplog in MongoDB, binlog in MySQL) is a sequential record of all changes committed to the database. CDC tools like Debezium read the WAL to capture every insert, update, and delete as it happens, publishing them as events. This is why CDC operates at the database level rather than the application level — the WAL is the authoritative record of all committed changes, making it impossible to miss a mutation.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Write-Ahead Log (WAL)",
        },
      },
    },

    // ── Matching (3) ─────────────────────────────────────────

    // Matching 1 — easy
    {
      title: "Match payment system components to responsibilities",
      type: "question",
      sectionId: "sec_q_entities_api",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each payment system component to its primary responsibility:",
        explanation:
          "API Gateway handles authentication, rate limiting, and routing — it's the entry point for all merchant requests. Payment Service manages the PaymentIntent lifecycle (creation, status tracking). Transaction Service interfaces with external payment networks to process actual charges. The Reconciliation Service correlates internal records with payment network settlement files to resolve uncertain states like timeouts.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            { left: "API Gateway", right: "Authentication, rate limiting, request routing" },
            { left: "Payment Service", right: "Creating and managing PaymentIntents" },
            { left: "Transaction Service", right: "Interfacing with external payment networks" },
            {
              left: "Reconciliation Service",
              right: "Correlating internal records with settlement files",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match security approaches to their threat models",
      type: "question",
      sectionId: "sec_q_security",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each security mechanism to the primary threat it mitigates:",
        explanation:
          "HMAC request signing prevents replay attacks by including timestamps and nonces that make each request unique. iFrame isolation prevents merchant code from accessing card data by leveraging browser same-origin policy. Client-side encryption prevents compromised iFrames from exposing usable card data since only the payment processor holds the private key. Nonce validation prevents reuse of captured requests by ensuring each nonce is accepted only once within the valid time window.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            { left: "HMAC request signing", right: "Tampered or forged API requests" },
            { left: "iFrame isolation", right: "Merchant JavaScript accessing card data" },
            {
              left: "Client-side encryption",
              right: "Compromised iframe exposing usable card data",
            },
            { left: "Nonce validation", right: "Replay attacks reusing captured requests" },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match durability approaches to failure modes",
      type: "question",
      sectionId: "sec_q_durability",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each durability/auditability approach to the critical failure mode it does NOT protect against:",
        explanation:
          "Single DB with current state only: UPDATE overwrites history, so a faulty deployment that corrupts statuses loses the original values forever — the data is silently corrupted with no way to detect or recover. Separate audit tables: if a developer forgets the audit INSERT, the history for that mutation is silently lost — the approach depends on application code correctness. CDC + single instance: if the single CDC instance fails, events stop flowing to Kafka even though DB writes continue, creating a gap in the audit trail. Application-level event publishing: a bug in the event publishing code path can silently skip events since it operates at the application layer, not the database layer.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              left: "Single DB, current state only",
              right: "Faulty deployment silently corrupts data with no recovery",
            },
            {
              left: "Separate audit tables",
              right: "Developer forgets to write audit record for a code path",
            },
            {
              left: "CDC with single instance",
              right: "CDC process failure creates gap in event stream",
            },
            {
              left: "Application-level event publishing",
              right: "Bug in publish code silently skips events",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3) ──────────────────────────────────────

    // Fill-blanks 1 — easy
    {
      title: "Payment entity that owns the state machine",
      type: "question",
      sectionId: "sec_q_entities_api",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The {{blank1}} entity owns the state machine from created → authorized → captured / canceled / refunded, and enforces {{blank2}} for retries.",
        explanation:
          "The PaymentIntent represents the merchant's intention to collect a specific amount and tracks the overall payment lifecycle. It owns the state machine and enforces idempotency for retries — meaning the same retry request produces the same result without creating duplicate charges. Transactions are the individual money-movement records linked to a PaymentIntent.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "blank1", correctAnswer: "PaymentIntent" },
            { id: "blank2", correctAnswer: "idempotency" },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "CDC event stream technology",
      type: "question",
      sectionId: "sec_q_durability",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Change Data Capture publishes database changes to an immutable {{blank1}} event stream, typically implemented with {{blank2}}, which provides configurable replication across multiple brokers and availability zones.",
        explanation:
          "CDC publishes changes to an append-only (immutable) event stream, most commonly implemented with Apache Kafka. Kafka provides configurable replication (typically 3x) across multiple brokers and availability zones for fault tolerance. Events are retained for a configurable period (7-30 days) on disk, with older events archived to object storage like S3 for permanent retention.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "blank1", correctAnswer: "append-only" },
            { id: "blank2", correctAnswer: "Kafka" },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Database sharding key for payments",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "To scale the payment database beyond a single PostgreSQL instance at 10,000 TPS, we shard by {{blank1}}, while Kafka topics are partitioned by {{blank2}} to guarantee ordering of state transitions within a single payment.",
        explanation:
          "The database is sharded by merchant_id because it distributes write load evenly across shards and keeps a merchant's data co-located for efficient queries. Kafka topics are partitioned by payment_intent_id because all events for a single PaymentIntent (created → authorized → captured) must be processed in order. These are different keys because they optimize for different access patterns: the DB optimizes for merchant-scoped queries, while Kafka optimizes for payment-scoped event ordering.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            { id: "blank1", correctAnswer: "merchant_id" },
            { id: "blank2", correctAnswer: "payment_intent_id" },
          ],
        },
      },
    },

    // ── Numerical (2) ────────────────────────────────────────

    // Numerical 1 — medium
    {
      title: "Kafka partition count for 10K TPS",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "Each Kafka partition handles approximately 5,000-10,000 messages per second under normal production conditions. For a payment system processing 10,000 TPS that needs throughput headroom and fault tolerance, what is the minimum number of partitions you should provision?",
        explanation:
          "At 10k TPS with each partition handling 5k-10k msg/s, you need at minimum 2 partitions at peak capacity. However, for production systems you need headroom for traffic spikes and fault tolerance (if a partition becomes temporarily unavailable). The recommended range is 3-5 partitions. With 3 partitions, each handles ~3,333 msg/s under normal load, leaving significant headroom. This also allows for rebalancing if a consumer fails.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 3,
          tolerance: 2,
          unit: "partitions",
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Daily storage growth estimate",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A payment system processes 10,000 transactions per second. Each transaction record is approximately 500 bytes. Estimate the daily storage growth in gigabytes (GB). Assume 86,400 seconds in a day and use 1 GB = 1,000,000,000 bytes for simplicity.",
        explanation:
          "Calculation: 10,000 TPS × 500 bytes = 5,000,000 bytes/s = 5 MB/s. Daily: 5 MB/s × 86,400 s/day = 432,000 MB = 432 GB/day. The source material rounds to ~500 GB/day using ~100,000 seconds as an approximation for seconds in a day. Either 432 or 500 is acceptable — the key insight is that this represents massive data growth (~150-180 TB/year) requiring careful data lifecycle management with cold storage archival for older transactions.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 432,
          tolerance: 68,
          unit: "GB",
        },
      },
    },
  ],
};
