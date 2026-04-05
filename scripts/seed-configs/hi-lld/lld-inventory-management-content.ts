/**
 * Inventory Management System — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: requirements gathering, entity identification, class design,
 * concurrency (race conditions, atomic transfers, deadlock prevention),
 * alert system (Observer pattern, threshold crossing), and extensibility
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldInventoryManagementContent: StoryPointSeed = {
  title: "Design Inventory Management System (LLD)",
  description:
    "Master the low-level design of a multi-warehouse inventory management system — covering entity identification, class design, thread-safe operations, atomic transfers with deadlock prevention, Observer-pattern alert systems, and extensibility with reservations and in-transit tracking.",
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
      title: "Inventory Management — Requirements & Entity Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Inventory Management — Requirements & Entity Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is an Inventory Management System?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "An inventory management system tracks product stock across multiple warehouse locations. When inventory arrives, the system records it. When orders ship, the system deducts stock. The system can also transfer inventory between locations and alert managers when stock runs low.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Clarifying Questions & Final Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                "Before writing code, spend 3-5 minutes asking structured questions around four areas: what operations does the system support, what can go wrong, what's in scope, and what might we extend later. Key clarifications: warehouses are a fixed set configured at startup. Low-stock alerts are per product per warehouse with configurable thresholds. The alert mechanism should be pluggable (callback interface). Negative inventory is rejected. Concurrent access must be handled safely.",
            },
            {
              id: "b5",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Track inventory for products across multiple warehouses",
                  "Add stock to a specific warehouse (receiving shipments)",
                  "Remove stock from a specific warehouse (fulfilling orders)",
                  "Check availability: given a product and quantity, return which warehouses can fulfill it",
                  "Transfer stock between warehouses",
                  "Low-stock alerts: per product per warehouse, with configurable thresholds and pluggable listeners",
                  "Reject operations that would result in negative inventory",
                  "System must be thread-safe to handle concurrent operations",
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
                  "Product catalog management (products exist externally)",
                  "Order processing / payment / serviceability",
                  "Persistence / database layer",
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
                "Scan requirements for nouns that represent things with behavior or state. Apply a simple filter: if something maintains changing state or enforces rules, it likely deserves to be its own entity. If it's just information attached to something else, it's probably just a field.",
            },
            {
              id: "b10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Product — NOT an entity. We just need "how many units of product X are in warehouse Y." Product is a key (string) that identifies what we\'re counting, not a class with behavior.',
                  'Warehouse — YES. Holds inventory for multiple products, tracks quantities, enforces "no negative stock" rule, manages alert configurations, and fires notifications when thresholds are crossed.',
                  "InventoryManager — YES. The orchestrator. Coordinates cross-warehouse operations like transfers and availability queries. Entry point for all operations.",
                  "AlertConfig — YES. A value object pairing a threshold with a listener. Keeps the relationship explicit.",
                  "AlertListener — YES. An interface defining the callback contract for low-stock notifications. Implementations handle email, webhook, logging, etc.",
                ],
              },
            },
            {
              id: "b11",
              type: "quote",
              content:
                "A common mistake is creating a Product class. Ask yourself: what behavior would Product have? In our system, products are external — the only thing we need is a string ID as a map key. Don't create entities for concepts that have no behavior in your system.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Class Design & Concurrency
    {
      title: "Class Design, Concurrency & Implementation",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Class Design, Concurrency & Implementation",
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
                "class InventoryManager:\n    - warehouses: Map<string, Warehouse>\n\n    + InventoryManager(warehouseIds)\n    + addStock(warehouseId, productId, quantity) -> void\n    + removeStock(warehouseId, productId, quantity) -> boolean\n    + transfer(productId, fromWarehouseId, toWarehouseId, quantity) -> boolean\n    + getWarehousesWithAvailability(productId, quantity) -> List<string>\n    + setLowStockAlert(warehouseId, productId, threshold, listener) -> void\n\nclass Warehouse:\n    - id: string\n    - inventory: Map<string, int>\n    - alertConfigs: Map<string, List<AlertConfig>>\n\n    + Warehouse(id)\n    + addStock(productId, quantity) -> void\n    + removeStock(productId, quantity) -> boolean\n    + getStock(productId) -> int\n    + checkAvailability(productId, quantity) -> boolean\n    + setLowStockAlert(productId, threshold, listener) -> void\n    - getAlertsToFire(productId, previousQty, newQty) -> List<AlertListener>\n\nclass AlertConfig:\n    - threshold: int\n    - listener: AlertListener\n\ninterface AlertListener:\n    + onLowStock(warehouseId, productId, currentQuantity) -> void",
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
                  "addStock returns void (you can always receive more inventory). removeStock returns boolean (can fail if insufficient stock). This asymmetry is intentional.",
                  "InventoryManager uses Map<string, Warehouse> for O(1) warehouse lookup by ID. String IDs are more flexible than integers for real systems.",
                  "Warehouse.alertConfigs maps productId to List<AlertConfig> — a product can have multiple alerts at different thresholds (warning at 20, urgent at 5, critical at 0).",
                  "AlertListener is an interface (Observer pattern) so the system is decoupled from notification delivery. This follows the Dependency Inversion Principle.",
                  "InventoryManager is the facade — external code only interacts with it. Warehouse handles actual inventory tracking.",
                ],
              },
            },
            {
              id: "c5",
              type: "heading",
              content: "Concurrency: The Transfer Problem",
              metadata: { level: 2 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "Transfer is the most interesting method because it must coordinate operations across two warehouses atomically. There are three approaches, each with different correctness guarantees.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Bad: Check Availability Then Transfer (TOCTOU Bug)",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Check if source has enough stock, then remove from source and add to destination. This has a classic time-of-check-time-of-use (TOCTOU) race condition. Between checking availability and actually removing stock, another thread can remove that inventory. Thread A checks 50 units available, Thread B removes 50 units, Thread A proceeds to remove 50 units — stock goes negative or phantom inventory appears.",
            },
            {
              id: "c9",
              type: "heading",
              content: "Good: Check Return Value from removeStock",
              metadata: { level: 3 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "Skip the availability check and just try to remove stock, respecting what removeStock tells us. removeStock validates while holding the warehouse lock. This fixes the TOCTOU bug, but there's a semantic gap: between removing from source and adding to destination, inventory is in an intermediate state (temporarily missing from the system).",
            },
            {
              id: "c11",
              type: "heading",
              content: "Great: Lock Both Warehouses (Atomic Transfer)",
              metadata: { level: 3 },
            },
            {
              id: "c12",
              type: "code",
              content:
                "transfer(productId, fromWarehouseId, toWarehouseId, quantity)\n    if quantity <= 0\n        return false\n\n    fromWarehouse = warehouses[fromWarehouseId]\n    toWarehouse = warehouses[toWarehouseId]\n\n    if fromWarehouse == null || toWarehouse == null\n        return false\n\n    // Lock in consistent order to prevent deadlock\n    firstLock = min(fromWarehouseId, toWarehouseId)\n    secondLock = max(fromWarehouseId, toWarehouseId)\n\n    synchronized (warehouses[firstLock])\n        synchronized (warehouses[secondLock])\n            if !fromWarehouse.removeStock(productId, quantity)\n                return false\n            toWarehouse.addStock(productId, quantity)\n            return true",
              metadata: { language: "text" },
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                "Lock ordering is critical: always lock the warehouse with the lower ID first. Without consistent ordering, Thread A locks warehouse 1 then tries to lock warehouse 2, while Thread B locks warehouse 2 then tries to lock warehouse 1 — deadlock. This approach assumes reentrant locks (like Java's synchronized). With non-reentrant locks, you'd need internal non-locking helper methods.",
            },
            {
              id: "c14",
              type: "heading",
              content: "Concurrency: Warehouse Operations",
              metadata: { level: 2 },
            },
            {
              id: "c15",
              type: "paragraph",
              content:
                "Every public method that touches warehouse state must be synchronized. The read-modify-write sequence in addStock/removeStock must be atomic. Critical pattern: collect alerts inside the synchronized block, but fire listener callbacks OUTSIDE the lock. If listeners do network I/O while holding the lock, you block all warehouse operations and risk deadlock if the listener calls back into the warehouse.",
            },
            {
              id: "c16",
              type: "code",
              content:
                "addStock(productId, quantity)\n    alertsToFire = null\n\n    synchronized(this)\n        currentQty = inventory[productId] ?: 0\n        newQty = currentQty + quantity\n        inventory[productId] = newQty\n        alertsToFire = getAlertsToFire(productId, currentQty, newQty)\n\n    // Fire alerts OUTSIDE the synchronized block\n    if alertsToFire != null\n        for alert in alertsToFire\n            alert.listener.onLowStock(id, productId, newQty)",
              metadata: { language: "text" },
            },
            {
              id: "c17",
              type: "heading",
              content: "Alert Threshold Crossing Logic",
              metadata: { level: 2 },
            },
            {
              id: "c18",
              type: "paragraph",
              content:
                'The "great" approach: fire an alert only when stock crosses the threshold from above to below. The condition is: previousQty >= threshold AND newQty < threshold. This prevents alert spam (no duplicates while stock stays low) and naturally resets when stock recovers above the threshold. No state tracking or hasFired flags needed.',
            },
            {
              id: "c19",
              type: "code",
              content:
                "getAlertsToFire(productId, previousQty, newQty)\n    configs = alertConfigs[productId]\n    if configs == null\n        return null\n\n    alertsToFire = []\n    for config in configs\n        if previousQty >= config.threshold && newQty < config.threshold\n            alertsToFire.add({config.listener, productId, newQty})\n\n    return alertsToFire.isEmpty() ? null : alertsToFire",
              metadata: { language: "text" },
            },
          ],
          readingTime: 15,
        },
      },
    },

    // Material 3: Extensibility & Level Expectations
    {
      title: "Extensibility & What Distinguishes Each Level",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Extensibility & What Distinguishes Each Level",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Extensibility: Reservation System",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                'The most natural extension: add a reservation system to prevent overselling during checkout. The problem — between "customer clicks buy" and "payment succeeds" (30-60 seconds), inventory isn\'t locked. Two customers see "1 item available," both start checkout, one gets an error after filling out payment details.',
            },
            {
              id: "d3",
              type: "code",
              content:
                "class Warehouse (extended):\n    - reserved: Map<string, int>\n    - reservations: Map<string, Reservation>\n\n    + reserveStock(productId, quantity, reservationId, timeoutMs) -> boolean\n    + confirmReservation(reservationId) -> boolean\n    + releaseReservation(reservationId) -> void\n\nclass Reservation:\n    - productId: string\n    - quantity: int\n    - expiresAt: long\n\ncheckAvailability now computes: available = inventory[productId] - reserved[productId]",
              metadata: { language: "text" },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "Reservations require a background cleanup task for abandoned carts. Timeout tuning is a business decision: too short (30s) cancels legitimate checkouts, too long (10min) locks inventory while customers browse. Most e-commerce sites use 5-15 minutes.",
            },
            {
              id: "d5",
              type: "heading",
              content: "Extensibility: In-Transit Inventory",
              metadata: { level: 2 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "The atomic transfer assumes inventory teleports instantly. In reality, shipments take 3-5 days. The elegant solution: treat Transfer as a first-class entity that can hold inventory, implementing the same InventoryHolder interface as Warehouse. Remove stock from source, create a Transfer object holding it, complete the transfer when shipment arrives by adding to destination.",
            },
            {
              id: "d7",
              type: "code",
              content:
                "interface InventoryHolder:\n    + addStock(productId, quantity) -> void\n    + removeStock(productId, quantity) -> boolean\n    + getStock(productId) -> int\n    + checkAvailability(productId, quantity) -> boolean\n\nclass Transfer implements InventoryHolder:\n    - id, productId, quantity, fromWarehouseId, toWarehouseId, createdAt\n\ninitiateTransfer(productId, from, to, quantity)\n    fromWarehouse.removeStock(productId, quantity)\n    transfer = Transfer(id, productId, quantity, from, to)\n    transfers[transfer.id] = transfer\n    return transfer.id\n\ncompleteTransfer(transferId)\n    toWarehouse.addStock(transfer.productId, transfer.quantity)\n    transfers.remove(transferId)",
              metadata: { language: "text" },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "This keeps inventory fully accounted for. At any moment, total system inventory = sum across warehouses + sum across in-transit transfers. In-transit stock doesn't count as available for orders but every unit is tracked.",
            },
            {
              id: "d9",
              type: "heading",
              content: "What Distinguishes Each Level",
              metadata: { level: 2 },
            },
            {
              id: "d10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Junior: Identify InventoryManager and Warehouse. Implement addStock/removeStock correctly with "no negative stock" validation. Basic error handling. May need hints about concurrency.',
                  "Mid-level: Clean separation of concerns between InventoryManager and Warehouse. Recognize need for synchronization. Implement basic locking. Handle transfer carefully. AlertListener interface decouples notification logic. Might miss TOCTOU race condition without a hint.",
                  "Senior: Handle concurrency correctly without prompting. Proactively discuss race conditions in transfer. Explain atomic dual-lock with ordering to prevent deadlock. Discuss coarse-grained vs fine-grained locking tradeoffs. Fire alerts outside synchronized blocks. Propose reservation or in-transit extensions.",
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
      title: "Why Product is not a class",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        points: 10,
        question:
          "When designing the Inventory Management System, why should Product NOT be modeled as its own class?",
        options: [
          {
            id: "a",
            text: "Our system only needs a product ID as a map key — Product would have no behavior or state transitions in our domain",
          },
          {
            id: "b",
            text: "Product is too simple to be a class — it should be an enum with predefined product types",
          },
          {
            id: "c",
            text: "Product already exists in the external catalog system, so creating a duplicate class would violate DRY",
          },
          {
            id: "d",
            text: "Having a Product class would create a bidirectional dependency between Product and Warehouse",
          },
        ],
        correctOptionId: "a",
        explanation:
          "Product has no behavior in our system. We only need to know \"how many units of product X are in warehouse Y.\" Product is just a string key that identifies what we're counting — it doesn't maintain state, enforce rules, or have methods. The fact that products exist externally is not the reason to skip the class; the reason is that Product would have zero behavior in OUR domain. Don't create entities for concepts that have no behavior in your system.",
      },
    },

    // MCQ 2 — easy
    {
      title: "InventoryManager role in the system",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        points: 10,
        question:
          "What is the InventoryManager class's primary role in the Inventory Management System design?",
        options: [
          {
            id: "a",
            text: "Orchestrator — it is the system's public API, routing operations to the correct warehouse and coordinating cross-warehouse operations like transfers and availability queries",
          },
          {
            id: "b",
            text: "Data store — it directly holds all product quantities and alert configurations in its own maps",
          },
          {
            id: "c",
            text: "Validator — its sole purpose is to validate inputs before passing them to Warehouse objects",
          },
          {
            id: "d",
            text: "Observer — it watches warehouses for state changes and reacts to low-stock events",
          },
        ],
        correctOptionId: "a",
        explanation:
          "InventoryManager is the facade and orchestrator. External code interacts only with it to add stock, remove stock, transfer, check availability, and configure alerts. It owns the collection of warehouses (Map<string, Warehouse>) and routes operations to the correct warehouse. For cross-warehouse operations like transfer, it coordinates between multiple warehouses. It does NOT directly hold inventory data — each Warehouse manages its own inventory map.",
      },
    },

    // MCQ 3 — easy
    {
      title: "Why removeStock returns boolean but addStock returns void",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        points: 10,
        question:
          "In the class design, addStock() returns void while removeStock() returns boolean. What is the reason for this asymmetry?",
        options: [
          {
            id: "a",
            text: "addStock always succeeds (you can always receive more inventory), but removeStock can fail if there is insufficient stock — the boolean communicates success or failure",
          },
          {
            id: "b",
            text: "addStock modifies state in-place and doesn't need a return value, while removeStock creates a new inventory snapshot that must be returned",
          },
          {
            id: "c",
            text: "It's a design convention — all mutating operations that increase state return void, while decreasing operations return boolean",
          },
          {
            id: "d",
            text: "addStock is always called inside a try-catch block, making a return value redundant",
          },
        ],
        correctOptionId: "a",
        explanation:
          'The asymmetry is intentional and meaningful. Adding stock always succeeds — you can always receive more inventory, so there\'s nothing to report. Removing stock can fail because of the "no negative inventory" invariant: if you try to remove 100 units but only have 50, the operation must be rejected. The boolean return tells the caller whether the removal succeeded, which is critical for operations like transfer that depend on the outcome.',
      },
    },

    // MCQ 4 — medium
    {
      title: "TOCTOU race condition in transfer",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        points: 15,
        question:
          "A candidate implements transfer() by first calling checkAvailability() on the source warehouse, then calling removeStock() and addStock(). What is the fundamental flaw?",
        options: [
          {
            id: "a",
            text: "Time-of-check-time-of-use (TOCTOU) race condition — between checking availability and removing stock, another thread can deplete the inventory",
          },
          {
            id: "b",
            text: "The double method call is inefficient — it should be a single atomic decrement operation",
          },
          {
            id: "c",
            text: "checkAvailability acquires a read lock that conflicts with the write lock needed by removeStock, causing deadlock",
          },
          {
            id: "d",
            text: "The check is redundant because removeStock already validates internally, so it just adds unnecessary latency",
          },
        ],
        correctOptionId: "a",
        explanation:
          "This is a classic TOCTOU race condition. checkAvailability and removeStock happen in separate synchronized blocks. The source warehouse's lock is released after the check, giving other threads a window to modify state. Thread A checks 50 units available (passes), Thread B removes 50 units (succeeds), Thread A proceeds to remove 50 units — stock goes negative or removeStock fails. The fix: skip the check and use removeStock's return value, or better yet, lock both warehouses atomically.",
      },
    },

    // MCQ 5 — medium
    {
      title: "Alert firing outside synchronized block",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        points: 15,
        question:
          "In the Warehouse implementation, alerts are collected inside the synchronized block but fired outside it. What is the primary reason for this split?",
        options: [
          {
            id: "a",
            text: "Listener callbacks may do slow I/O (email, webhook), blocking all other warehouse operations while the lock is held — and could deadlock if the listener calls back into the warehouse",
          },
          {
            id: "b",
            text: "Alert listeners run on a different thread, so they cannot access the lock from the original thread context",
          },
          {
            id: "c",
            text: "Synchronized blocks cannot invoke interface methods — the JVM restricts virtual dispatch inside monitors",
          },
          {
            id: "d",
            text: "It allows alert processing to be parallelized across multiple CPU cores for better throughput",
          },
        ],
        correctOptionId: "a",
        explanation:
          "The critical section should only do fast in-memory operations. If listener callbacks do network I/O (sending emails, calling webhooks), they can take seconds. While the listener executes inside the synchronized block, the warehouse lock is held, blocking ALL other operations on that warehouse. Worse, if the listener tries to call back into the warehouse (e.g., to check current stock for a richer alert message), you get a deadlock. The pattern is: capture events under lock, dispatch notifications outside the lock.",
      },
    },

    // MCQ 6 — medium
    {
      title: "Coarse-grained vs fine-grained locking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        points: 15,
        question:
          "A developer proposes per-product locks instead of a single warehouse lock. When does this optimization justify the added complexity?",
        options: [
          {
            id: "a",
            text: "Only with high contention on different products simultaneously — for typical warehouse operations with short critical sections, coarse-grained locking has negligible contention and is simpler to reason about",
          },
          {
            id: "b",
            text: "Always — finer granularity always means better throughput, so per-product locks are strictly superior",
          },
          {
            id: "c",
            text: "Never — per-product locks require ConcurrentHashMap which is slower than HashMap for all workloads",
          },
          {
            id: "d",
            text: "Only when the warehouse has fewer than 100 products — beyond that, the lock map consumes too much memory",
          },
        ],
        correctOptionId: "a",
        explanation:
          "Each warehouse operation is a few map lookups plus iterating a small alert config list — microseconds of lock hold time. Even with hundreds of operations per second, contention on the coarse-grained lock is low because critical sections are so short. Per-product locking adds infrastructure (ConcurrentHashMap, lock lifecycle management) and creates new problems: transfers between products need consistent lock ordering, and the productLocks map grows monotonically. The optimization matters only with extreme throughput where different products have genuinely concurrent high-frequency operations.",
      },
    },

    // MCQ 7 — hard
    {
      title: "Deadlock prevention in atomic transfer",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        points: 25,
        question:
          "The atomic transfer implementation locks both warehouses by sorting their IDs and always acquiring the lower ID's lock first. What happens if we remove the sorting and just lock fromWarehouse then toWarehouse?",
        options: [
          {
            id: "a",
            text: "Deadlock becomes possible — Thread A transfers from W1→W2 (locks W1, waits for W2) while Thread B transfers from W2→W1 (locks W2, waits for W1), creating a circular wait",
          },
          {
            id: "b",
            text: "The transfer becomes non-atomic — inventory briefly disappears from both warehouses during the operation",
          },
          {
            id: "c",
            text: "Performance degrades because the JVM cannot optimize nested synchronized blocks without deterministic ordering",
          },
          {
            id: "d",
            text: "Nothing changes functionally — lock ordering is only a performance optimization for cache line alignment",
          },
        ],
        correctOptionId: "a",
        explanation:
          "Without consistent lock ordering, you get a classic deadlock via circular wait. Thread A transfers from warehouse 1→2: acquires lock on W1, then tries to acquire lock on W2. Thread B transfers from warehouse 2→1: acquires lock on W2, then tries to acquire lock on W1. Both threads are stuck — A holds W1 and waits for W2, B holds W2 and waits for W1. By always locking the warehouse with the smaller ID first, we eliminate the circular wait condition. This is a textbook deadlock prevention technique: impose a total ordering on resources and always acquire locks in that order.",
      },
    },

    // MCQ 8 — hard
    {
      title: "Reentrant lock requirement in transfer",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        points: 25,
        question:
          "In the atomic transfer, InventoryManager holds both warehouse locks and then calls fromWarehouse.removeStock() and toWarehouse.addStock(), which are themselves synchronized methods. What concurrency requirement does this impose?",
        options: [
          {
            id: "a",
            text: "Locks must be reentrant — the same thread must be able to re-acquire a lock it already holds, otherwise removeStock/addStock will deadlock trying to acquire their own warehouse lock",
          },
          {
            id: "b",
            text: "The locks must be read-write locks — transfer needs a write lock while addStock/removeStock only need read locks",
          },
          {
            id: "c",
            text: "removeStock and addStock must be non-blocking — they should use compare-and-swap operations instead of locks",
          },
          {
            id: "d",
            text: "The transfer must release the outer locks before calling removeStock/addStock to avoid priority inversion",
          },
        ],
        correctOptionId: "a",
        explanation:
          "When InventoryManager.transfer() acquires both warehouse locks and then calls fromWarehouse.removeStock(), that method will try to acquire the same warehouse lock again (synchronized(this)). With reentrant locks (like Java's synchronized), the same thread can acquire a lock it already holds — the lock count increments and the thread proceeds. Without reentrancy, the thread would deadlock waiting for a lock it already owns. In languages without reentrant locks, you'd expose internal non-locking helper methods (e.g., _removeStockUnsafe) that the manager calls during atomic transfers.",
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Valid entities for the Inventory Management System",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        points: 10,
        question:
          "Select ALL valid entities (classes or interfaces with meaningful behavior) for the Inventory Management System:",
        options: [
          { id: "a", text: "InventoryManager — orchestrates cross-warehouse operations" },
          { id: "b", text: "Warehouse — tracks inventory, enforces rules, manages alerts" },
          { id: "c", text: "AlertListener — interface defining notification callback contract" },
          {
            id: "d",
            text: "Product — represents a physical product with name, price, and category",
          },
          { id: "e", text: "Order — represents a customer purchase order" },
        ],
        correctOptionIds: ["a", "b", "c"],
        explanation:
          "InventoryManager (orchestrator), Warehouse (inventory tracking with concurrency), and AlertListener (notification interface via Observer pattern) are all valid entities with distinct responsibilities. Product has no behavior in our system — we only need a string ID as a map key. Order is explicitly out of scope — order processing happens upstream.",
      },
    },

    // MCAQ 2 — medium
    {
      title: "Methods that must be synchronized on Warehouse",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        points: 15,
        question:
          "Which Warehouse methods MUST be wrapped in synchronized blocks for thread safety? Select ALL that apply.",
        options: [
          { id: "a", text: "addStock — read-modify-write on the inventory map" },
          { id: "b", text: "removeStock — read-validate-modify-write on the inventory map" },
          { id: "c", text: "setLowStockAlert — modifies the alertConfigs map" },
          {
            id: "d",
            text: "getStock / checkAvailability — read-only operations on the inventory map",
          },
          {
            id: "e",
            text: "getAlertsToFire — private helper called from within already-synchronized methods",
          },
        ],
        correctOptionIds: ["a", "b", "c", "d"],
        explanation:
          "addStock, removeStock, and setLowStockAlert all mutate shared state and must be synchronized. But read-only methods (getStock, checkAvailability) must also be synchronized to ensure they see consistent state — without proper memory barriers, unsynchronized reads can return stale data. getAlertsToFire does NOT need its own synchronization because it is a private method only called from within already-synchronized methods — making it separately synchronized would be redundant.",
      },
    },

    // MCAQ 3 — medium
    {
      title: "Correct behaviors of the threshold crossing alert",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        points: 15,
        question:
          "The alert system uses threshold crossing logic: fire only when previousQty >= threshold AND newQty < threshold. Which of the following behaviors are correct for this approach? Select ALL that apply.",
        options: [
          { id: "a", text: "An alert fires when stock drops from 12 to 8 with threshold 10" },
          {
            id: "b",
            text: "No alert fires when stock drops from 8 to 5 with threshold 10 (already below)",
          },
          {
            id: "c",
            text: "No alert fires when stock rises from 5 to 15 with threshold 10 (recovering)",
          },
          {
            id: "d",
            text: "An alert fires again when stock drops from 15 to 9 with threshold 10 (re-crossed after recovery)",
          },
          {
            id: "e",
            text: "An alert fires when stock drops from 8 to 3 with threshold 10 (further below)",
          },
        ],
        correctOptionIds: ["a", "b", "c", "d"],
        explanation:
          "The crossing check inherently handles all these cases: (a) 12→8 with threshold 10: prev=12 >= 10 AND new=8 < 10 → fires. (b) 8→5: prev=8 < 10, condition false → no duplicate. (c) 5→15: new=15 >= 10, condition false → no alert on recovery. (d) 15→9: prev=15 >= 10 AND new=9 < 10 → fires again (naturally reset by recovery). (e) 8→3: prev=8 < 10, condition false → no alert (already below). Option (e) is incorrect because previousQty=8 is NOT >= threshold=10.",
      },
    },

    // MCAQ 4 — hard
    {
      title: "Senior-level design considerations for Inventory Management",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        points: 25,
        question:
          "Which of the following are considerations that distinguish a Senior-level answer from a Mid-level answer in an Inventory Management LLD interview? Select ALL that apply.",
        options: [
          {
            id: "a",
            text: "Proactively discussing the TOCTOU race condition in the naive transfer and implementing atomic dual-lock with ordering",
          },
          {
            id: "b",
            text: "Firing alert callbacks outside synchronized blocks to prevent I/O blocking and potential deadlock",
          },
          {
            id: "c",
            text: "Discussing tradeoffs between coarse-grained (per-warehouse) and fine-grained (per-product) locking strategies",
          },
          {
            id: "d",
            text: "Proposing reservation system or in-transit tracking as natural extensibility without being prompted",
          },
          {
            id: "e",
            text: "Implementing a distributed consensus protocol (Raft/Paxos) for cross-warehouse inventory consistency",
          },
        ],
        correctOptionIds: ["a", "b", "c", "d"],
        explanation:
          "Senior candidates proactively: (1) identify the TOCTOU bug in naive transfer and solve it with atomic dual-lock + ordering; (2) recognize that alert callbacks must fire outside locks to avoid I/O blocking and re-entrant deadlock; (3) discuss when coarse vs fine-grained locking is appropriate; (4) propose extensibility like reservations or in-transit tracking. However, implementing Raft/Paxos is over-engineering — this is an in-memory, single-machine system. Distributed consensus belongs in system design, not LLD.",
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Explain the entity identification process",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        points: 15,
        question:
          "Walk through the entity identification process for the Inventory Management System. For each noun in the requirements (Product, Warehouse, InventoryManager, AlertConfig, AlertListener), explain whether it should be a class/interface and justify your decision based on whether it has meaningful behavior.",
        sampleAnswer:
          'Entity identification starts by extracting nouns from requirements and evaluating each against one key criterion: does this concept maintain changing state or enforce rules?\n\nProduct — NOT an entity. Our system only needs a product ID as a map key to track "how many units of product X are in warehouse Y." Product would have zero methods — no state transitions, no rules to enforce. It\'s just a string identifier.\n\nWarehouse — YES, a core entity. It maintains an inventory map (productId → quantity), enforces the "no negative stock" invariant, manages alert configurations per product, and fires notifications when thresholds are crossed. Clear state and behavior.\n\nInventoryManager — YES, the orchestrator. It owns the collection of all warehouses (Map<string, Warehouse>) and coordinates operations that span multiple warehouses: transfers (atomic removal from source + addition to destination), availability queries (aggregate across all warehouses), and routing single-warehouse operations to the correct Warehouse. It\'s the only public API for the system.\n\nAlertConfig — YES, a value object. It pairs a threshold (int) with a listener (AlertListener) as a single configuration unit. While simple, modeling it explicitly makes List<AlertConfig> self-documenting compared to Map<int, AlertListener>.\n\nAlertListener — YES, an interface. It defines the notification contract: onLowStock(warehouseId, productId, currentQuantity). Different implementations handle email, webhook, logging, etc. This decouples "stock is low" from "what to do about it" — the Dependency Inversion Principle in action.',
        rubric:
          "Strong answer evaluates each candidate entity against a clear criterion (behavior/state). Must explain why Product fails the test. Must describe InventoryManager as orchestrator, Warehouse as the entity that actually tracks inventory, AlertConfig as value object, AlertListener as interface. Should mention specific data structures and the decoupling benefit.",
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the alert threshold crossing approach",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        points: 15,
        question:
          "Compare two approaches for firing low-stock alerts: (1) fire every time stock is below threshold, and (2) fire only when stock crosses the threshold from above to below. Trace through a concrete example showing how each approach behaves when stock drops, stays low, recovers, and drops again.",
        sampleAnswer:
          "Approach 1 (fire when below threshold): After every inventory change, check if currentQty < threshold. Fire alert if true.\n\nApproach 2 (fire on threshold crossing): Check if previousQty >= threshold AND newQty < threshold. Fire only when the boundary is crossed downward.\n\nExample trace with threshold = 10:\n\nStock drops from 15 to 8:\n- Approach 1: 8 < 10 → Alert fires ✓\n- Approach 2: prev=15 >= 10 AND new=8 < 10 → Alert fires ✓\n\nStock drops from 8 to 5:\n- Approach 1: 5 < 10 → Alert fires AGAIN (spam!)\n- Approach 2: prev=8 < 10, condition false → No alert (correct, no duplicate)\n\nStock recovers from 5 to 15:\n- Approach 1: 15 >= 10 → No alert ✓\n- Approach 2: new=15 >= 10 → No alert ✓\n\nStock drops from 15 to 9:\n- Approach 1: 9 < 10 → Alert fires ✓\n- Approach 2: prev=15 >= 10 AND new=9 < 10 → Alert fires ✓ (naturally reset by recovery)\n\nApproach 1 creates alert spam — every single operation while stock is below threshold generates a notification. In a busy warehouse, this means hundreds of alerts per hour for the same low-stock situation. Approach 2 fires exactly once per threshold crossing, resets automatically when stock recovers, and requires no state tracking (no hasFired flags). The crossing check is the clear winner.",
        rubric:
          "Must trace through at least 3 operations showing divergent behavior between approaches. Must identify the spam problem in approach 1. Must demonstrate natural reset behavior in approach 2. Should note that approach 2 needs no state tracking.",
      },
    },

    // Paragraph 3 — hard
    {
      title: "Trace through atomic transfer with locking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        points: 30,
        question:
          'Warehouse EAST has 7 widgets and warehouse WEST has 0 widgets. Trace through transfer("WIDGET", "EAST", "WEST", 5) step by step, showing: (1) lock acquisition order and why, (2) the remove and add operations with quantities, (3) final state. Then describe what would happen if a concurrent thread tried to transfer("WIDGET", "WEST", "EAST", 3) simultaneously.',
        sampleAnswer:
          'transfer("WIDGET", "EAST", "WEST", 5):\n\n1. Lock acquisition:\n- Compare warehouse IDs: "EAST" < "WEST" alphabetically\n- firstLock = "EAST", secondLock = "WEST"\n- Acquire lock on EAST warehouse\n- Acquire lock on WEST warehouse\n- Both warehouses are now locked — no other thread can touch either one\n\n2. Operations while holding both locks:\n- EAST.removeStock("WIDGET", 5):\n  - currentQty = 7\n  - 7 >= 5 → sufficient stock\n  - inventory["WIDGET"] = 7 - 5 = 2\n  - getAlertsToFire("WIDGET", 7, 2) → check alert configs\n  - return true\n- removeStock succeeded, proceed:\n- WEST.addStock("WIDGET", 5):\n  - currentQty = 0\n  - inventory["WIDGET"] = 0 + 5 = 5\n  - getAlertsToFire("WIDGET", 0, 5) → check alert configs\n\n3. Release both locks. Fire any collected alerts.\n\nFinal state: EAST = 2 widgets, WEST = 5 widgets. Total = 7 (conserved).\n\nConcurrent transfer("WIDGET", "WEST", "EAST", 3):\n- Compare IDs: "EAST" < "WEST" → firstLock = "EAST", secondLock = "WEST"\n- Same lock ordering as the first transfer!\n- Thread B tries to acquire EAST lock → blocked (Thread A holds it)\n- Thread B waits until Thread A releases both locks\n- Thread B then acquires EAST, then WEST, and proceeds with its transfer\n- No deadlock possible because both threads lock EAST before WEST\n\nWithout consistent ordering: Thread A locks EAST, Thread B locks WEST. Thread A tries to lock WEST (blocked). Thread B tries to lock EAST (blocked). Deadlock — both threads wait forever.',
        rubric:
          "Must show correct lock ordering derivation. Must trace quantities through remove and add. Must verify inventory conservation. Must explain that the concurrent transfer uses the SAME lock order (preventing deadlock). Must describe the deadlock scenario that consistent ordering prevents.",
      },
    },

    // Paragraph 4 — hard
    {
      title: "Compare three transfer implementations",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        points: 30,
        question:
          "Compare the three transfer implementations: (1) check availability then transfer, (2) check removeStock return value, and (3) atomic dual-lock. For each, analyze: correctness (can it produce invalid state?), atomicity (can observers see intermediate states?), and performance implications.",
        sampleAnswer:
          "Implementation 1 — Check availability then transfer:\n- Correctness: BROKEN. TOCTOU race condition. Between checkAvailability and removeStock, another thread can deplete inventory. If we ignore removeStock's return value, stock goes negative or phantom inventory appears.\n- Atomicity: None. Three separate operations (check, remove, add) with no coordination.\n- Performance: Good concurrency (no cross-warehouse locking) but wrong results.\n- Verdict: Never acceptable — it has a correctness bug, not just a performance tradeoff.\n\nImplementation 2 — Check removeStock return value:\n- Correctness: Correct for the source warehouse. removeStock validates while holding its lock, so no TOCTOU.\n- Atomicity: Partial. Between removing from source and adding to destination, inventory is in an intermediate state — it's missing from both warehouses. If another thread queries total system inventory during this window, the numbers don't add up.\n- Performance: Good. Only one warehouse locked at a time. Operations on unrelated warehouses proceed in parallel.\n- Verdict: Acceptable if brief intermediate states are tolerable. Most production systems with eventual consistency use this approach.\n\nImplementation 3 — Atomic dual-lock:\n- Correctness: Correct. Both warehouses locked throughout the entire operation.\n- Atomicity: Full. No observer can see the intermediate state. Total system inventory is always consistent.\n- Performance: Reduced concurrency. While holding both locks, no other thread can touch either warehouse, even for unrelated products. Bottleneck if there are many transfers between the same warehouse pairs.\n- Verdict: Required when strict inventory consistency matters. Lock ordering by warehouse ID prevents deadlock.\n\nThe lock ordering detail separates a good answer from a great one.",
        rubric:
          "Must analyze all three implementations across correctness, atomicity, and performance. Must identify the TOCTOU bug in implementation 1. Must explain the intermediate state problem in implementation 2. Must describe deadlock prevention in implementation 3. Should express that implementation 1 is never acceptable while 2 and 3 have legitimate use cases.",
      },
    },

    // Paragraph 5 — hard
    {
      title: "Design the reservation system extension",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        points: 30,
        question:
          'The interviewer asks: "How do you prevent overselling when checkout takes 30-60 seconds?" Design a reservation system extension. Show the new state, new methods, how checkAvailability changes, and how you handle abandoned reservations.',
        sampleAnswer:
          'Problem: Between "customer clicks buy" and "payment succeeds," inventory isn\'t locked. Two customers see "1 item available," both start checkout, one gets an error after wasting time.\n\nNew state on Warehouse:\n- reserved: Map<string, int> — reserved quantities per product\n- reservations: Map<string, Reservation> — active reservation records\n\nNew class:\n```\nclass Reservation:\n    - productId: string\n    - quantity: int\n    - expiresAt: long\n```\n\nNew methods on Warehouse:\n- reserveStock(productId, quantity, reservationId, timeoutMs) → boolean: Check available = inventory[productId] - reserved[productId]. If sufficient, create Reservation, increment reserved count.\n- confirmReservation(reservationId) → boolean: Deduct from inventory, decrement reserved count, remove reservation. Reject if reservation expired.\n- releaseReservation(reservationId) → void: Decrement reserved count, remove reservation.\n\ncheckAvailability changes:\n```\navailableQty = inventory[productId] - reserved[productId]\nreturn availableQty >= quantity\n```\n\nAbandoned reservation handling: Background cleanup task runs every minute, scans reservations for expired ones, calls releaseReservation. Without this, abandoned carts permanently lock inventory.\n\nTimeout tuning is a business decision: too short (30s) cancels legitimate checkouts, too long (10min) locks inventory while customers browse. Most e-commerce sites use 5-15 minutes.\n\nTradeoff: Reservation system prioritizes fairness (no wasted checkout time) over conversion optimization. Some high-volume retailers (Amazon, Walmart) prefer optimistic strategies — accept orders with uncertain inventory, handle stockouts via substitutions or refunds — to maximize sales.',
        rubric:
          "Must introduce reserved map and Reservation class. Must show how checkAvailability changes to subtract reserved quantities. Must describe the three lifecycle methods (reserve, confirm, release). Must address abandoned reservation cleanup with background task. Should discuss timeout tuning as a business decision.",
      },
    },

    // Paragraph 6 — hard
    {
      title: "Design the in-transit inventory extension",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        points: 30,
        question:
          'The interviewer asks: "How would you handle inventory that\'s being shipped between warehouses (3-5 day transit)?" Design an extension that tracks in-transit inventory. Show the new entities, how the transfer flow changes, and how total system inventory is computed.',
        sampleAnswer:
          "Problem: The atomic transfer assumes inventory teleports instantly. In reality, units spend days on a truck — they're not available at either location during transit but haven't disappeared from the system.\n\nKey insight: Treat Transfer as a first-class entity that can hold inventory, just like a Warehouse.\n\nNew interface:\n```\ninterface InventoryHolder:\n    + addStock(productId, quantity) → void\n    + removeStock(productId, quantity) → boolean\n    + getStock(productId) → int\n    + checkAvailability(productId, quantity) → boolean\n```\n\nBoth Warehouse and Transfer implement InventoryHolder.\n\nNew entity:\n```\nclass Transfer implements InventoryHolder:\n    - id, productId, quantity, fromWarehouseId, toWarehouseId, createdAt\n```\n\nNew flow — initiateTransfer:\n1. Remove stock from source warehouse\n2. Create Transfer object holding the inventory\n3. Store in transfers map, return transfer ID\n\nNew flow — completeTransfer (when shipment arrives):\n1. Add stock to destination warehouse\n2. Remove Transfer object\n\nTotal system inventory = Σ(warehouse.getStock(productId)) + Σ(transfer.getStock(productId))\n\nBenefits:\n- Inventory is fully accounted for at all times\n- In-transit stock doesn't count as \"available\" for orders (only warehouse stock does)\n- If a shipment is cancelled, return quantity to source warehouse\n- Queryable: \"where is every unit of product X right now?\"\n\nThe 'aha moment' is that making Transfer a first-class entity with the same interface as Warehouse gives a much more accurate model of how physical inventory systems actually work.",
        rubric:
          "Must introduce InventoryHolder interface that both Warehouse and Transfer implement. Must describe the two-phase flow (initiate, complete). Must explain how total system inventory is computed by summing across warehouses and transfers. Should mention that in-transit stock is tracked but not available for orders.",
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Design pattern in the alert system",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        points: 15,
        question:
          "Which design pattern does the AlertListener interface implement in the Inventory Management System? Name the pattern and explain in one sentence how it applies.",
        correctAnswer:
          "Observer pattern — Warehouses notify registered AlertListener implementations when stock crosses a threshold, decoupling the event (low stock) from the response (email, webhook, logging).",
        explanation:
          "The AlertListener interface defines the Observer pattern. Warehouses are the subjects that detect low-stock events, and AlertListener implementations are the observers that react. The Warehouse doesn't know or care which implementation gets used — it just calls listener.onLowStock() when the threshold is crossed. This also demonstrates the Dependency Inversion Principle: the high-level Warehouse depends on the AlertListener abstraction, not on concrete notification mechanisms.",
      },
    },

    // Text 2 — medium
    {
      title: "Why warehouses map uses string keys",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        points: 15,
        question:
          "InventoryManager stores warehouses as Map<string, Warehouse> using string IDs. What is the primary design advantage of string IDs over integer IDs for warehouse identification in this system?",
        correctAnswer:
          'Strings allow meaningful identifiers like "WAREHOUSE_CALIFORNIA" or "DC_NY_01" that are self-documenting and compatible with external systems where warehouse IDs are typically already strings.',
        explanation:
          'String IDs are more flexible for real systems. You can use meaningful identifiers like "WAREHOUSE_CALIFORNIA" or "DC_NY_01" instead of arbitrary numbers. In production, these IDs often come from external systems or databases where they\'re already strings. String IDs also enable the consistent lock ordering in the atomic transfer (alphabetical comparison), which would need a separate ordering scheme with integers.',
      },
    },

    // Text 3 — hard
    {
      title: "Why read methods need synchronization",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        points: 25,
        question:
          "getStock() and checkAvailability() are read-only methods — they don't modify state. Why must they still be wrapped in synchronized blocks?",
        correctAnswer:
          "Without synchronization, reads can return stale data due to missing memory barriers. Java's memory model does not guarantee visibility of writes from other threads unless proper synchronization is used.",
        explanation:
          "Even read-only methods must be synchronized to ensure they see consistent state. Without proper memory barriers, unsynchronized reads can return stale data — a thread may read from its CPU cache rather than from main memory, missing writes from other threads. In Java's memory model, synchronization provides both mutual exclusion and memory visibility. A read of getStock() during a concurrent addStock() could see partially-updated state if neither method is synchronized.",
      },
    },

    // Text 4 — hard
    {
      title: "Why getAlertsToFire does not need synchronization",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        points: 25,
        question:
          "The private getAlertsToFire() method is NOT synchronized even though it reads from alertConfigs. Why is this safe, and what would happen if you made it separately synchronized with non-reentrant locks?",
        correctAnswer:
          "getAlertsToFire is only called from within already-synchronized methods (addStock, removeStock), so the caller already holds the lock. Making it separately synchronized is redundant with reentrant locks, and would cause deadlock with non-reentrant locks.",
        explanation:
          "getAlertsToFire is a private method only called from within addStock and removeStock, which are both synchronized. The caller already holds the warehouse lock, so getAlertsToFire inherits that protection — no other thread can access the shared state while it runs. Making it separately synchronized would be redundant (the lock is already held). With non-reentrant locks, adding synchronization to getAlertsToFire would cause deadlock — the calling method holds the lock, and getAlertsToFire would try to acquire the same lock, blocking forever.",
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match entities to their responsibilities",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        points: 10,
        question: "Match each Inventory Management entity to its primary responsibility:",
        pairs: [
          {
            id: "p1",
            left: "InventoryManager",
            right: "Orchestrates cross-warehouse operations and serves as the system's public API",
          },
          {
            id: "p2",
            left: "Warehouse",
            right:
              "Tracks per-product quantities, enforces no-negative-stock invariant, manages alerts",
          },
          {
            id: "p3",
            left: "AlertConfig",
            right: "Value object pairing a threshold integer with an AlertListener callback",
          },
          {
            id: "p4",
            left: "AlertListener",
            right:
              "Interface defining onLowStock() notification contract for pluggable implementations",
          },
        ],
        explanation:
          "InventoryManager is the facade that routes operations. Warehouse is where actual inventory tracking happens with all the concurrency concerns. AlertConfig is a simple value object — just threshold + listener paired together. AlertListener is the Observer pattern interface that makes the notification system pluggable (email, webhook, logging, etc.).",
      },
    },

    // Matching 2 — medium
    {
      title: "Match concurrency problems to their solutions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        points: 15,
        question:
          "Match each concurrency problem in the Inventory Management System to its solution:",
        pairs: [
          {
            id: "p1",
            left: "Read-modify-write race on inventory quantities",
            right: "Wrap addStock/removeStock in synchronized(this) blocks",
          },
          {
            id: "p2",
            left: "TOCTOU in naive transfer (check then remove)",
            right: "Use removeStock's return value or lock both warehouses atomically",
          },
          {
            id: "p3",
            left: "Deadlock when two transfers lock warehouses in opposite order",
            right: "Always acquire locks in consistent order (sort by warehouse ID)",
          },
          {
            id: "p4",
            left: "Alert listener I/O blocks all warehouse operations",
            right: "Collect alerts under lock, fire callbacks outside the synchronized block",
          },
        ],
        explanation:
          "Each concurrency problem has a specific solution: coarse-grained locking for basic read-modify-write races, return-value checking or atomic dual-lock for TOCTOU, consistent lock ordering for deadlock prevention, and separating event collection from dispatch for I/O blocking.",
      },
    },

    // Matching 3 — hard
    {
      title: "Match transfer implementations to their critical weakness",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        points: 25,
        question: "Match each transfer implementation to its most critical weakness:",
        pairs: [
          {
            id: "p1",
            left: "Check availability then remove+add (naive)",
            right: "TOCTOU race condition — inventory can go negative or produce phantom stock",
          },
          {
            id: "p2",
            left: "Check removeStock return value (defensive)",
            right:
              "Non-atomic — observers see intermediate state where inventory is missing from both warehouses",
          },
          {
            id: "p3",
            left: "Atomic dual-lock with ordering (correct)",
            right: "Reduced concurrency — both warehouses blocked for all products during transfer",
          },
          {
            id: "p4",
            left: "Atomic dual-lock WITHOUT ordering",
            right: "Deadlock — threads lock warehouses in opposite order creating circular wait",
          },
        ],
        explanation:
          "The naive approach has a correctness bug (TOCTOU). The defensive approach is correct but non-atomic (intermediate state visible). The atomic approach with ordering is correct but reduces concurrency. The atomic approach without ordering is the worst — it introduces deadlock, a fatal concurrency bug that hangs the system.",
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Entity identification heuristic",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        points: 10,
        question:
          "When identifying entities for an LLD problem, look for _____ in the requirements and evaluate whether each candidate maintains changing _____ or enforces rules.",
        blanks: [
          {
            id: "blank1",
            correctAnswer: "nouns",
          },
          {
            id: "blank2",
            correctAnswer: "state",
          },
        ],
        explanation:
          "Look for nouns in the requirements as entity candidates. The key filter is whether the candidate maintains changing state (like Warehouse tracking quantities) or enforces rules (like the no-negative-stock invariant). Concepts that are just data or keys (like Product ID) don't need their own class.",
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Warehouse inventory data structure",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        points: 10,
        question:
          "The Warehouse class stores its inventory as a Map from _____ to _____, allowing O(1) lookup of any product's current quantity.",
        blanks: [
          {
            id: "blank1",
            correctAnswer: "product ID",
          },
          {
            id: "blank2",
            correctAnswer: "quantity",
          },
        ],
        explanation:
          "The inventory map uses product ID (string) as the key and quantity (integer) as the value. This provides O(1) lookup for any product's current stock level. Products not in the map implicitly have zero stock — we don't need to initialize entries for products we've never received.",
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Alert crossing condition",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        points: 15,
        question:
          "The threshold crossing alert fires only when _____ >= threshold AND _____ < threshold, ensuring alerts are not duplicated while stock stays below the threshold.",
        blanks: [
          {
            id: "blank1",
            correctAnswer: "previousQty",
          },
          {
            id: "blank2",
            correctAnswer: "newQty",
          },
        ],
        explanation:
          "The condition previousQty >= threshold AND newQty < threshold detects a downward crossing of the threshold boundary. It fires exactly once when stock drops below the threshold, prevents duplicates while stock stays low (because previousQty will be < threshold), and naturally resets when stock recovers above the threshold.",
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Calculate remaining stock after operations",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        points: 15,
        question:
          'Warehouse EAST starts with 0 widgets. The following operations execute in order: addStock("WIDGET", 50), removeStock("WIDGET", 15), addStock("WIDGET", 10), removeStock("WIDGET", 20). What is the final quantity of widgets in EAST?',
        correctAnswer: 25,
        tolerance: 0,
        explanation:
          "Starting at 0: +50 = 50, -15 = 35, +10 = 45, -20 = 25. Each removeStock succeeds because there is always sufficient stock (35 >= 15, 45 >= 20). The final quantity is 25 widgets.",
      },
    },

    // Numerical 2 — hard
    {
      title: "Count alert fires in a sequence",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        points: 25,
        question:
          "A warehouse has 30 units of product X with an alert threshold at 10. The following operations execute in order: removeStock(X, 25), addStock(X, 20), removeStock(X, 18), removeStock(X, 2). Using the threshold crossing approach (fire only when previousQty >= threshold AND newQty < threshold), how many times does the alert fire?",
        correctAnswer: 2,
        tolerance: 0,
        explanation:
          "Trace: Start=30. (1) remove 25 → 30→5: prev=30 >= 10 AND new=5 < 10 → FIRE (1st crossing). (2) add 20 → 5→25: going up, no downward crossing → NO fire. (3) remove 18 → 25→7: prev=25 >= 10 AND new=7 < 10 → FIRE (2nd crossing — threshold naturally reset by recovery in step 2). (4) remove 2 → 7→5: prev=7 < 10, condition false → NO fire (already below). Total = 2 fires. The key insight is that the crossing check auto-resets when stock recovers above the threshold, allowing a second alert when it drops below again.",
      },
    },
  ],
};
