/**
 * Parking Lot — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: requirements gathering, entity identification, class design,
 * occupancy tracking strategies, fee calculation, and extensibility
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldParkingLotContent: StoryPointSeed = {
  title: "Design a Parking Lot System (LLD)",
  description:
    "Master the low-level design of a parking lot system — covering entity identification, class design, occupancy tracking strategies, fee calculation placement, and extensibility patterns like multi-floor garages, per-type pricing, and concurrent access.",
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
      title: "Parking Lot — Requirements & Entity Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Parking Lot — Requirements & Entity Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is a Parking Lot System?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "A parking lot system manages vehicle parking across multiple spots. When a vehicle enters, the system assigns an available spot matching the vehicle type and issues a ticket. When the vehicle exits, the system calculates the parking fee based on time spent and frees up the spot for the next customer.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Clarifying Questions & Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                "Before writing code, spend a few minutes asking structured questions about what the system does, how it handles mistakes, what's in scope, and what might change. This turns a vague prompt into concrete requirements.",
            },
            {
              id: "b5",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "System supports three vehicle types: Motorcycle, Car, Large Vehicle (SUVs/vans).",
                  "When a vehicle enters, the system automatically assigns an available compatible spot and issues a ticket with a unique ID.",
                  "When a vehicle exits, user provides the ticket ID. System validates the ticket, calculates fee based on time spent (hourly, rounded up), and frees the spot.",
                  "Pricing is hourly with the same rate for all vehicles.",
                  "System rejects entry if no compatible spot is available.",
                  "System rejects exit if the ticket is invalid or already used.",
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
                  "Payment processing",
                  "Physical gate hardware",
                  "Security cameras or monitoring",
                  "UI/display systems",
                  "Reservations or pre-booking",
                ],
              },
            },
            {
              id: "b8",
              type: "paragraph",
              content:
                "When the interviewer says \"keep it simple,\" that's your signal to not over-engineer. Don't build a complex pricing engine with surge pricing and discounts unless they explicitly ask for it.",
            },
            {
              id: "b9",
              type: "heading",
              content: "Entity Identification",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "paragraph",
              content:
                "Look for nouns in the requirements and evaluate which ones deserve to be classes. Not every noun needs a class — some things are just data. The key question: does this noun have its own behavior, or is it just data that lives on another entity?",
            },
            {
              id: "b11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Vehicle — NOT an entity. The vehicle is external to our system. We only need its type (motorcycle, car, large) for spot matching. That's a single piece of classification data — keep it as an enum, not a class.",
                  "ParkingSpot — YES. A spot has an ID and a type to match vehicle types. It represents a physical parking space with intrinsic properties.",
                  "Ticket — YES. A record of a parking session created and managed by our system. It holds ticket ID, spot ID, vehicle type, and entry time.",
                  "ParkingLot — YES. The orchestrator. When a vehicle enters, it finds a spot, generates a ticket, and tracks occupancy. When a vehicle exits, it validates the ticket, calculates fees, and frees the spot.",
                ],
              },
            },
            {
              id: "b12",
              type: "quote",
              content:
                "A common mistake is creating a Vehicle class. Ask yourself: what behavior would Vehicle have? In our system, vehicles are external — the only thing we need is the type, which is an input parameter. Don't create entities for concepts that have no behavior in your system.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Class Design & Implementation
    {
      title: "Class Design & Implementation",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Class Design & Implementation",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Class Design Approach",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "For each class, ask two questions: What does this class need to remember (state)? What operations does it support (methods)? Work top-down — start with ParkingLot (the orchestrator), then drill into ParkingSpot and Ticket.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Final Class Design",
              metadata: { level: 2 },
            },
            {
              id: "c4",
              type: "code",
              content:
                "class ParkingLot:\n    - spots: List<ParkingSpot>\n    - occupiedSpotIds: Set<String>      // Occupancy index\n    - activeTickets: Map<String, Ticket>\n    - hourlyRateCents: long\n\n    + ParkingLot(spots, hourlyRateCents)\n    + enter(vehicleType) -> Ticket\n    + exit(ticketId) -> long\n\nclass ParkingSpot:\n    - id: String\n    - spotType: SpotType\n\n    + ParkingSpot(id, spotType)\n    + getSpotType() -> SpotType\n    + getId() -> String\n\nclass Ticket:\n    - id: String\n    - spotId: String\n    - vehicleType: VehicleType\n    - entryTime: long\n\n    + Ticket(id, spotId, vehicleType, entryTime)\n    + getId() -> String\n    + getSpotId() -> String\n    + getVehicleType() -> VehicleType\n    + getEntryTime() -> long\n\nenum SpotType:\n    MOTORCYCLE, CAR, LARGE\n\nenum VehicleType:\n    MOTORCYCLE, CAR, LARGE",
              metadata: { language: "text" },
            },
            {
              id: "c5",
              type: "heading",
              content: "Key Design Decisions",
              metadata: { level: 2 },
            },
            {
              id: "c6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "ParkingLot has only two public methods — enter() and exit(). The entire public API.",
                  "Occupancy is tracked via a Set<String> of occupied spot IDs in ParkingLot, not a boolean on ParkingSpot. This treats occupancy as relational state managed by the orchestrator.",
                  "Separate enums for SpotType and VehicleType even though they share values — keeps them semantically distinct for future flexibility.",
                  "Ticket stores spotId as a String, not a reference to ParkingSpot. Tickets are records, not navigational objects (Law of Demeter).",
                  "hourlyRateCents uses integers, not floats. Floats cannot represent decimal fractions exactly — store money as the smallest unit (cents) to avoid rounding errors.",
                ],
              },
            },
            {
              id: "c7",
              type: "heading",
              content: "Occupancy Tracking: Three Approaches",
              metadata: { level: 2 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "There are three defensible ways to track which spots are occupied. Each has different tradeoffs:",
            },
            {
              id: "c9",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Occupied flag on ParkingSpot: Simple and readable, but creates denormalization — occupancy is tracked both on the spot and implied by activeTickets. Must keep both in sync.",
                  "Derive occupancy from tickets: No redundancy at all. A spot is occupied iff an active ticket references it. Clean but recomputes on every entry, and harder to extend for concurrency.",
                  "Occupancy index (Set in ParkingLot): The chosen approach. A maintained index like a database index — must stay in sync, but gives O(1) lookups and a clean concurrency boundary.",
                ],
              },
            },
            {
              id: "c10",
              type: "heading",
              content: "Where Does Fee Calculation Belong?",
              metadata: { level: 2 },
            },
            {
              id: "c11",
              type: "paragraph",
              content:
                "A common mistake is putting calculateFee() on Ticket because it has the entry time. This violates Single Responsibility — Ticket becomes both a session record AND a pricing calculator. Pricing is a business policy that the lot enforces, not a property of a ticket. Keep Ticket as a pure data holder and put computeFee() in ParkingLot.",
            },
            {
              id: "c12",
              type: "heading",
              content: "Implementation: enter() and exit()",
              metadata: { level: 2 },
            },
            {
              id: "c13",
              type: "code",
              content:
                "enter(vehicleType)\n    spot = findAvailableSpot(vehicleType)\n    if spot == null\n        return error  // No compatible spot available\n\n    occupiedSpotIds.add(spot.id)\n\n    ticket = createTicket(\n        generateId(),\n        spot.id,\n        vehicleType,\n        currentTime()\n    )\n\n    activeTickets[ticket.id] = ticket\n    return ticket\n\nexit(ticketId)\n    if ticketId == null\n        return error\n\n    ticket = activeTickets[ticketId]\n    if ticket == null\n        return error  // Invalid or already used\n\n    exitTime = currentTime()\n    fee = computeFee(ticket.entryTime, exitTime)\n\n    occupiedSpotIds.remove(ticket.spotId)\n    activeTickets.remove(ticketId)\n\n    return fee",
              metadata: { language: "text" },
            },
            {
              id: "c14",
              type: "heading",
              content: "Implementation: Helper Methods",
              metadata: { level: 2 },
            },
            {
              id: "c15",
              type: "code",
              content:
                "findAvailableSpot(vehicleType)\n    requiredSpotType = mapVehicleTypeToSpotType(vehicleType)\n    for spot in spots\n        if spot.spotType == requiredSpotType\n           and spot.id not in occupiedSpotIds\n            return spot\n    return null\n\ncomputeFee(entryTime, exitTime)\n    durationMillis = exitTime - entryTime\n    durationHours = durationMillis / (1000 * 60 * 60)\n    if durationMillis % (1000 * 60 * 60) > 0\n        durationHours++  // Round up partial hour\n    return durationHours * hourlyRateCents",
              metadata: { language: "text" },
            },
            {
              id: "c16",
              type: "paragraph",
              content:
                'Note: We do not distinguish between "ticket never existed" and "ticket already used." Both return the same error. Tracking used tickets in a separate set would be needed to differentiate them, but for interview scope, treating both as "invalid ticket" is simpler and sufficient.',
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Extensibility & Concurrency
    {
      title: "Extensibility & Concurrency",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Extensibility & Concurrency",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Multi-Floor Parking Garage",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                'Introduce a ParkingFloor entity between ParkingLot and ParkingSpot. Each floor owns a collection of spots, and ParkingLot owns a collection of floors. Spot IDs become compound (e.g., "3-A15" for floor 3, section A, spot 15). The Ticket class does not change — spotId implicitly includes floor info.',
            },
            {
              id: "d3",
              type: "code",
              content:
                "class ParkingLot:\n    - floors: List<ParkingFloor>\n    - activeTickets: Map<String, Ticket>\n    - hourlyRateCents: long\n\nclass ParkingFloor:\n    - floorNumber: int\n    - spots: List<ParkingSpot>\n    + findAvailableSpot(spotType) -> ParkingSpot\n    + getAvailableSpotCount(spotType) -> int\n\n// Allocation strategies:\n// 1. Fill lower floors first (closer to entrance)\n// 2. Balance across floors (spread load)\n// 3. Proximity to destination (mall garage)",
              metadata: { language: "text" },
            },
            {
              id: "d4",
              type: "heading",
              content: "Per-Vehicle-Type Pricing",
              metadata: { level: 2 },
            },
            {
              id: "d5",
              type: "paragraph",
              content:
                "Replace the single hourlyRateCents with a Map<VehicleType, long> of rates. In computeFee(), look up the rate by vehicle type from the ticket. For complex pricing rules (surge pricing, discounts), introduce a PricingStrategy interface — but only when you have multiple pricing models. Don't build Strategy for a single, simple rule (YAGNI).",
            },
            {
              id: "d6",
              type: "code",
              content:
                "// Simple approach: Map of rates\nclass ParkingLot:\n    - hourlyRates: Map<VehicleType, long>\n\ncomputeFee(entryTime, exitTime, vehicleType)\n    durationHours = calculateDuration(entryTime, exitTime)\n    rate = hourlyRates[vehicleType]\n    return durationHours * rate\n\n// Strategy pattern (only when needed):\ninterface PricingStrategy:\n    calculateFee(ticket, exitTime) -> long\n\nclass HourlyPricing implements PricingStrategy:\n    - hourlyRateCents: long\n    calculateFee(ticket, exitTime) -> ...\n\nclass DynamicPricing implements PricingStrategy:\n    calculateFee(ticket, exitTime) -> ...",
              metadata: { language: "text" },
            },
            {
              id: "d7",
              type: "heading",
              content: "Concurrent Access: Multiple Entrances",
              metadata: { level: 2 },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "With multiple entrances, two vehicles entering simultaneously creates a race condition — both threads could find the same spot available and assign it. The window between checking availability and adding to occupiedSpotIds is where the race happens.",
            },
            {
              id: "d9",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Coarse-grained lock: Synchronize the entire enter() method. Only one vehicle enters at a time. Simple, correct, sufficient for most parking lots (10 vehicles/sec capacity vs 0.03/sec needed).",
                  "Fine-grained read-write lock: Multiple threads can search concurrently (read lock), but claiming a spot requires exclusive access (write lock). Double-check inside write lock and retry if the spot was taken.",
                ],
              },
            },
            {
              id: "d10",
              type: "code",
              content:
                '// Coarse-grained (Good — sufficient for most lots)\ndef enter(vehicle_type):\n    with self._lock:\n        spot = find_available_spot(vehicle_type)\n        if spot is None:\n            raise Exception("No available spots")\n        self._occupied_spot_ids.add(spot.id)\n        # ... create ticket\n        return ticket\n\n// Fine-grained with retry (Great — higher concurrency)\ndef enter(vehicle_type):\n    while True:\n        spot = find_available_spot(vehicle_type)  # read lock\n        if spot is None:\n            raise Exception("No available spots")\n        with self._write_lock:\n            if spot.id not in self._occupied_spot_ids:\n                self._occupied_spot_ids.add(spot.id)\n                return create_ticket(spot)\n        # Spot was claimed by another thread, retry',
              metadata: { language: "python" },
            },
            {
              id: "d11",
              type: "heading",
              content: "What Distinguishes Each Level",
              metadata: { level: 2 },
            },
            {
              id: "d12",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Junior: Identify the need for spots, tickets, and an orchestrator. Implement working enter/exit flows with basic error handling. It's fine if you need hints on pricing placement.",
                  "Mid-level: Clean separation of concerns. Recognize Vehicle is not a class. Justify design choices (Map for tickets, pricing in ParkingLot). Handle edge cases: full lot, invalid tickets, double exits.",
                  "Senior: Produce a design with systems thinking. Proactively discuss tradeoffs: occupied flag is controlled denormalization, separate SpotType/VehicleType enums for flexibility, occupancy index for concurrency. Discuss multiple extensibility approaches without prompting.",
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
      title: "Why Vehicle is not a class",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When designing the Parking Lot system, why should Vehicle NOT be modeled as its own class?",
        explanation:
          "Vehicle is external to our system. We don't manage it, track it, or care about its state. The only thing we need from a vehicle is its type (motorcycle, car, large) to match it with a compatible spot — that's a single piece of classification data, not an entity with behavior. Creating a Vehicle class would add an entity with no meaningful methods in our domain.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Our system only needs the vehicle's type for spot matching — Vehicle would have no behavior in our domain",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Vehicle is too simple to be a class — it should be a struct instead",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Having a Vehicle class would create a circular dependency with ParkingSpot",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Vehicle already exists in the DMV system, so we should reuse their class",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "ParkingLot public API",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the complete public API of the ParkingLot class in the base requirements?",
        explanation:
          "ParkingLot exposes exactly two methods: enter(vehicleType) which assigns a spot and returns a ticket, and exit(ticketId) which validates the ticket, calculates the fee, and frees the spot. Methods like getAvailableSpots() or getParkingStatus() violate encapsulation and aren't needed for the core workflow. Don't add them unless explicitly required.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "enter(vehicleType) -> Ticket and exit(ticketId) -> fee — just two methods",
              isCorrect: true,
            },
            {
              id: "b",
              text: "enter(), exit(), getAvailableSpots(), and getOccupancy() — four methods for full visibility",
              isCorrect: false,
            },
            {
              id: "c",
              text: "parkVehicle(), unparkVehicle(), calculateFee(), and findSpot() — four methods with separated concerns",
              isCorrect: false,
            },
            {
              id: "d",
              text: "enter(), exit(), and addSpot() — three methods including runtime spot management",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Why separate SpotType and VehicleType enums",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "SpotType and VehicleType have the same values (MOTORCYCLE, CAR, LARGE). Why create two separate enums instead of reusing one?",
        explanation:
          'A spot type and a vehicle type are semantically different concepts even though they share labels. If requirements later say "motorcycles can use car spots if motorcycle spots are full," having separate enums makes the cross-type allocation logic clearer — you\'re mapping from one domain concept to another. Reusing a single enum conflates two distinct concepts and makes such extensions awkward.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "They are semantically distinct concepts — separating them enables clean cross-type mapping logic (e.g., motorcycles using car spots)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It's a compile-time safety mechanism — using the wrong enum in the wrong method causes a type error",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Two enums use less memory than one because each is loaded independently",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It follows the Interface Segregation Principle — clients should not depend on enums they don't use",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Fee calculation ownership",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A candidate places the calculateFee() method on the Ticket class because Ticket has the entry time. What is the primary design problem with this approach?",
        explanation:
          "This violates Single Responsibility Principle. The Ticket becomes both a record of a parking session AND a pricing calculator, giving it two reasons to change. Pricing is a business policy — different lots charge different rates, rates may change, and future pricing models (surge, discounts) would all pile into Ticket. Keeping Ticket as a pure data holder and putting computeFee() in ParkingLot follows Separation of Concerns.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Violates SRP — Ticket becomes both a session record and pricing calculator. Pricing is a business policy that belongs in the orchestrator.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Ticket doesn't have access to the hourly rate, so it would need a dependency injection framework",
              isCorrect: false,
            },
            {
              id: "c",
              text: "calculateFee() is a pure function, so it should be a static utility method in a FeeUtils class",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Placing logic on Ticket violates the Open-Closed Principle because Ticket is a final/sealed class",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Occupancy tracking: flag vs index vs derive",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The Parking Lot design tracks occupancy using a Set<String> of occupied spot IDs in ParkingLot instead of an occupied boolean on ParkingSpot. What is the primary rationale for this choice?",
        explanation:
          'Occupancy in the parking lot is relational state — a spot becomes "occupied" when the system assigns it via a ticket at the entrance gate, before the car physically arrives. It represents an assignment relationship managed by the orchestrator, not a physical property of the spot. The Set maintains this as an index in one place. However, putting a boolean on ParkingSpot (as done in Amazon Locker) is also valid if you can defend the rationale.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Occupancy is relational state (assignment via ticket) managed by the orchestrator — the Set centralizes this and provides a clean concurrency boundary",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A Set provides O(1) lookup, which is faster than checking a boolean on ParkingSpot",
              isCorrect: false,
            },
            {
              id: "c",
              text: "ParkingSpot is an immutable value object and cannot have mutable state like a boolean flag",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Using a boolean would require ParkingSpot to know about Ticket, creating a bidirectional dependency",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Why activeTickets is a Map",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'The design initially uses a List<Ticket> for activeTickets but refines it to Map<String, Ticket>. A candidate argues "the performance difference is negligible for 200 tickets, so the List is fine." How should you respond?',
        explanation:
          'The candidate is correct that performance is irrelevant at parking-lot scale (1.8 microsecond difference). But the Map is still preferred because it makes the "lookup by ID" intent explicit — a map is semantically a lookup table, while a list requires explaining the scan. The choice is about code readability and intent signaling, not performance. Both are correct answers if you explain your reasoning.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Agree on performance but argue the Map makes "lookup by ID" intent explicit — it\'s about semantic clarity, not speed',
              isCorrect: true,
            },
            {
              id: "b",
              text: "Disagree — O(1) vs O(n) always matters, even at small scale, because it shows algorithmic awareness",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Agree completely — for 200 tickets, a List is simpler and there's no reason to use a Map",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Disagree — the Map is required because List doesn't support the remove() operation needed during exit",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Concurrency: choosing the right lock granularity",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A parking lot has 3 entrances processing vehicles concurrently. Each entry takes ~100ms. The lot has 200 spots with average turnover of once every 2 hours. A candidate proposes fine-grained read-write locking with retry logic. What is the best assessment?",
        explanation:
          "With 200 spots turning over every 2 hours, average entry rate is ~0.03 vehicles/second. A coarse-grained lock processing 10 vehicles/second gives 300x headroom. The fine-grained approach is correct but adds unnecessary complexity (retry logic, potential livelock, harder debugging) for marginal benefit. In interviews, the right answer is: explain the simple solution first, acknowledge the fine-grained option, and explain when you'd switch (much higher traffic, thousands of spots).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Over-engineered — coarse-grained lock handles 10 vehicles/sec (300x headroom over 0.03/sec actual demand). Fine-grained adds complexity for no practical benefit at this scale.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Correct choice — read-write locks should always be preferred over mutex because they allow concurrent reads",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Incorrect — parking lots should use lock-free algorithms (CAS) since any locking creates unacceptable latency for drivers",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Insufficient — with 3 entrances, you need distributed locking via Redis or ZooKeeper to coordinate across processes",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Intrinsic vs relational state across problems",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In Amazon Locker, occupancy is tracked as a boolean on the Compartment. In Parking Lot, occupancy is tracked as a Set<String> in the ParkingLot orchestrator. What is the underlying design reasoning for this different treatment of the same concept?",
        explanation:
          "In Amazon Locker, occupancy represents physical presence — a package is physically placed in the compartment, and even after the token expires, it's still there. That's intrinsic state. In Parking Lot, occupancy represents assignment — the ticket is issued at the gate before the car physically reaches the spot. The spot becomes \"occupied\" the moment it's assigned. That's relational state managed by the system. Both approaches are defensible for both problems — what matters is the rationale.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Amazon Locker: occupancy = physical presence (intrinsic). Parking Lot: occupancy = ticket assignment (relational). Different semantic meanings justify different state placement.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Amazon Locker uses flag because compartments are simple. Parking Lot uses Set because spots are complex with more state to manage.",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The designs were created by different engineers with different style preferences — either approach works identically for both problems.",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Amazon Locker doesn't need concurrency (single door), so a simple flag works. Parking Lot needs concurrency (multiple entrances), requiring a centralized Set.",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Valid entities for the Parking Lot system",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid entities (classes with meaningful roles) for the Parking Lot system:",
        explanation:
          "ParkingLot (orchestrator), ParkingSpot (physical spot with ID and type), and Ticket (session record with entry time) are valid entities. Vehicle has no behavior in our system — we only need its type as an input parameter. PaymentProcessor is explicitly out of scope per the requirements.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "ParkingLot — orchestrates entry, exit, and fee calculation",
              isCorrect: true,
            },
            {
              id: "b",
              text: "ParkingSpot — represents a physical parking space with ID and type",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Ticket — immutable record of a parking session with entry time",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Vehicle — represents the car/motorcycle/van entering the lot",
              isCorrect: false,
            },
            {
              id: "e",
              text: "PaymentProcessor — handles credit card charges upon exit",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "State that exit() must update",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "When a vehicle exits successfully, the exit() method must update all related state. Select ALL state changes that MUST happen:",
        explanation:
          "exit() must: (1) remove the spot ID from occupiedSpotIds so the spot becomes available for new vehicles, and (2) remove the ticket from activeTickets to prevent double exit with the same ticket. Returning the fee is the method's return value, not a state change. Notifying the driver is out of scope.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Remove the spot ID from occupiedSpotIds (frees the spot)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Remove the ticket from activeTickets (prevents double exit)",
              isCorrect: true,
            },
            { id: "c", text: "Return the computed fee to the caller", isCorrect: false },
            {
              id: "d",
              text: "Send a notification to the driver with the amount owed",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Valid occupancy tracking approaches",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are valid approaches for tracking spot occupancy in the Parking Lot system? Select ALL that apply.",
        explanation:
          "All three approaches are valid with different tradeoffs. The boolean flag on ParkingSpot is simple but creates denormalization with activeTickets. The Set index centralizes occupancy in the orchestrator. Deriving from activeTickets eliminates redundancy but recomputes on every entry. All are correct designs depending on your priorities.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Boolean occupied flag on ParkingSpot — simple, readable, but denormalized with activeTickets",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Set<String> occupiedSpotIds on ParkingLot — centralized index, O(1) lookup, clean concurrency boundary",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Derive from activeTickets — compute occupancy on demand, no redundancy, but recomputes every entry",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Database query with SELECT ... WHERE occupied = true — correct for an in-memory LLD design",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Senior-level design signals",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following behaviors distinguish a Senior-level answer from a Mid-level answer in a Parking Lot LLD interview? Select ALL that apply.",
        explanation:
          "Senior candidates: (1) proactively discuss occupancy tradeoffs without prompting, (2) explain when Strategy pattern is warranted vs YAGNI for pricing, (3) analyze concurrency with back-of-envelope math showing the simple lock has 300x headroom. However, implementing a distributed task queue is over-engineering for an in-memory LLD problem — there's no distributed state.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Proactively discussing the occupied-flag vs Set vs derive tradeoffs for occupancy tracking",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Explaining when PricingStrategy pattern is warranted (multiple models) vs YAGNI (single hourly rate)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Showing back-of-envelope math that coarse-grained locking provides 300x headroom for concurrent access",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Implementing a distributed task queue (Celery/SQS) for processing entrance requests asynchronously",
              isCorrect: false,
            },
          ],
        },
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
        content:
          "Walk through the entity identification process for the Parking Lot system. For each noun in the requirements (Vehicle, ParkingSpot, Ticket, ParkingLot), explain whether it should be a class and justify your decision based on whether it has meaningful behavior in the system.",
        explanation:
          "A strong answer evaluates each candidate entity against a clear criterion: does it have behavior (methods) in our system? Vehicle fails this test — type is just an input parameter. ParkingSpot, Ticket, and ParkingLot each have distinct responsibilities.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Entity identification starts by extracting nouns from requirements and filtering by a key criterion: does this concept have meaningful behavior in our system?\n\nVehicle — NOT an entity. The vehicle is external to our system. We don't manage it, track it, or care about its state beyond its type (motorcycle, car, large). That's a single classification value — an enum input parameter to enter(vehicleType). A Vehicle class would have no methods in our domain.\n\nParkingSpot — YES, an entity. It represents a physical parking space with an ID and a type (motorcycle, car, large). These are intrinsic properties that never change. It's a pure data holder for physical characteristics.\n\nTicket — YES, an entity. It's a record of a parking session that our system creates and manages. It holds ticket ID, spot ID, vehicle type, and entry time. All fields are read-only after construction, making it an immutable value object. Unlike Vehicle (external), Ticket is internal state.\n\nParkingLot — YES, the orchestrator. It's the system's entry point with two public methods: enter() and exit(). It owns all spots, tracks active tickets, manages occupancy, and enforces pricing. Everything flows through it.\n\nThe relationships are simple: ParkingLot owns ParkingSpots and creates Tickets. Three entities, clear separation of concerns.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Intrinsic vs relational state placement",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Explain the distinction between "intrinsic state" and "relational state" in the context of the Parking Lot design. Where should each type live, and why is occupancy treated as relational state in this problem but as intrinsic state in the Amazon Locker problem?',
        explanation:
          "A strong answer defines both types, gives examples, and explains the semantic difference in how occupancy arises. In Parking Lot, assignment happens at the gate (relational). In Amazon Locker, a package is physically placed (intrinsic). Both approaches are defensible for both problems.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Intrinsic state describes permanent properties of an entity — things that are true regardless of the system. ParkingSpot\'s ID and type are intrinsic. A spot\'s size doesn\'t change based on system operations. Intrinsic state naturally lives on the entity.\n\nRelational state describes system-managed relationships — things that exist because the system tracks them. "Currently assigned to ticket X" is relational. These live in the orchestrator because they describe how the system connects entities.\n\nIn the Parking Lot, occupancy is treated as relational state because it represents assignment. When a car gets a ticket at the entrance gate, the spot becomes "occupied" before the car physically arrives. The occupancy is about the ticket assignment, not the physical spot. So it lives as a Set in ParkingLot.\n\nIn Amazon Locker, occupancy is treated as intrinsic state because it represents physical presence. A package is physically placed in the compartment, then the token is generated. Even after the token expires, the package is still there. Physical presence is the compartment\'s condition.\n\nBoth approaches are valid for both problems. The heuristic is: ask "is this a property of the entity itself, or a relationship managed by the system?" The answer guides placement, but the distinction isn\'t absolute.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Trace through entry and exit lifecycle",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A ParkingLot has 3 spots: A (MOTORCYCLE), B (CAR), C (LARGE). OccupiedSpotIds is empty. No active tickets. Hourly rate is 500 cents ($5). Trace through the following sequence step by step, showing system state (occupiedSpotIds, activeTickets) after each operation:\n(1) A CAR enters at timestamp 1000000\n(2) The car exits 2.5 hours later\n(3) Someone tries to exit again with the same ticket ID",
        explanation:
          "Must trace all state changes precisely: enter finds spot B, adds to occupied set, creates ticket; exit computes fee (3 hours × 500 = 1500 cents), removes from set and map; second exit fails because ticket was removed.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Initial state: spots=[A(MOTO), B(CAR), C(LARGE)], occupiedSpotIds={}, activeTickets={}\n\n(1) enter(CAR) at timestamp 1000000:\n- findAvailableSpot(CAR): mapVehicleTypeToSpotType → CAR. Iterate spots: A is MOTORCYCLE (skip), B is CAR and not in occupiedSpotIds → return B.\n- occupiedSpotIds.add("B") → {"B"}\n- Create ticket: id="T123", spotId="B", vehicleType=CAR, entryTime=1000000\n- activeTickets["T123"] = ticket\n- Return ticket T123\n\nState: occupiedSpotIds={"B"}, activeTickets={"T123" → Ticket(B, CAR, 1000000)}\n\n(2) exit("T123") at exitTime = 1000000 + 9000000 = 10000000 (2.5 hours later):\n- activeTickets.get("T123") → found\n- computeFee(1000000, 10000000):\n  - durationMillis = 9000000\n  - durationHours = 9000000 / 3600000 = 2\n  - 9000000 % 3600000 = 1800000 > 0, so durationHours++ → 3\n  - fee = 3 × 500 = 1500 cents ($15)\n- occupiedSpotIds.remove("B") → {}\n- activeTickets.remove("T123") → {}\n- Return 1500\n\nState: occupiedSpotIds={}, activeTickets={}\n\n(3) exit("T123") again:\n- activeTickets.get("T123") → null (already removed in step 2)\n- Throw Error("Ticket not found or already used")\n\nKey insight: Double exit is prevented by removing the ticket from activeTickets. After removal, the used ticket ID is indistinguishable from a random invalid ID.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Compare three occupancy tracking strategies",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Compare the three occupancy tracking strategies for the Parking Lot: (1) boolean flag on ParkingSpot, (2) derive from activeTickets, (3) Set<String> index in ParkingLot. For each, analyze trade-offs around denormalization, performance, concurrency, and semantic clarity. Which would you choose and why?",
        explanation:
          "Must cover: flag creates denormalization risk, derive eliminates redundancy but recomputes, Set provides O(1) with clean concurrency boundary. The answer should justify the choice based on specific requirements.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Strategy 1 — Boolean flag on ParkingSpot:\n- Denormalization: YES. Occupancy is tracked both on the spot (flag) and in activeTickets (if a ticket references it, it's occupied). Must keep synchronized — forget to update either and you get bugs like double assignment.\n- Performance: O(n) scan, checking flag per spot. But O(1) per flag check.\n- Concurrency: Flag update and ticket creation are two separate state changes — must be atomic or you risk inconsistency.\n- Semantic clarity: Reads naturally (\"is this spot free?\"). Used in Amazon Locker.\n\nStrategy 2 — Derive from activeTickets:\n- Denormalization: NONE. Ticket's existence IS occupancy. Cleanest conceptually.\n- Performance: Must scan all tickets to build occupied set on every entry call. For 200 spots / 100 tickets: still microseconds.\n- Concurrency: Must lock the entire activeTickets map during reads AND writes — can't iterate while another thread modifies.\n- Semantic clarity: Eliminates the \"which is the source of truth?\" question entirely.\n\nStrategy 3 — Set<String> occupiedSpotIds in ParkingLot (chosen):\n- Denormalization: Technically redundant with ticket data, but maintained as a deliberate index.\n- Performance: O(1) contains-check per spot during allocation.\n- Concurrency: Provides a clean, narrow lock target. Can lock just the Set for atomic spot claiming without locking the entire tickets map.\n- Semantic clarity: Makes occupancy tracking explicit and centralized.\n\nMy choice: Strategy 3. It offers the best balance — O(1) lookups, centralized state, and clean concurrency boundaries. The denormalization risk is managed because occupiedSpotIds is updated in the same code paths as activeTickets (enter adds to both, exit removes from both). For an interview, I'd mention that Strategy 1 is equally valid if you prefer simplicity.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Design multi-floor parking garage extension",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'The interviewer asks: "How would you extend this to a multi-floor parking garage?" Describe the class changes needed, explain at least two spot allocation strategies, and discuss how the Ticket class is affected.',
        explanation:
          "Must introduce ParkingFloor between ParkingLot and ParkingSpot. Should describe at least two allocation strategies (lower-first, balanced). Must note that Ticket is unaffected — spotId implicitly includes floor info.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Class changes:\n- Introduce ParkingFloor between ParkingLot and ParkingSpot.\n- ParkingLot.spots becomes ParkingLot.floors: List<ParkingFloor>.\n- ParkingFloor has floorNumber, a list of spots, and methods: findAvailableSpot(spotType) and getAvailableSpotCount(spotType).\n- Spot IDs become compound: "3-A15" (floor 3, section A, spot 15).\n\nAllocation strategies:\n\n1. Fill lower floors first: Iterate floors in order, return first available spot. Simple — keeps customers closer to entrance/exit. This is what a naive loop gives you.\n```\nfor floor in floors:\n    spot = floor.findAvailableSpot(type)\n    if spot: return spot\n```\n\n2. Balance across floors: Pick the floor with the most available spots. Prevents congestion on any single floor.\n```\nbestFloor = max(floors, key=floor.getAvailableSpotCount(type))\nreturn bestFloor.findAvailableSpot(type)\n```\n\n3. Proximity-based: In a mall, assign floor closest to the customer\'s destination (e.g., food court is on floor 4).\n\nTicket impact: None. Ticket still stores spotId as a String. The compound ID "3-A15" includes floor info implicitly. The exit flow is identical — look up ticket, compute fee, free spot by ID. You could add a floor field to Ticket for explicit tracking, but it\'s not required.\n\nKey insight: This extension validates the design. Only ParkingLot\'s findAvailableSpot needs to change — the rest of the system (Ticket, fee calculation, exit flow) is untouched.',
          minLength: 150,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Design concurrent access with multiple entrances",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'The interviewer asks: "How would you handle multiple entrances with concurrent access?" Describe the race condition, explain the coarse-grained and fine-grained locking approaches, and use back-of-envelope math to justify which approach to use for a 200-spot parking lot.',
        explanation:
          "Must identify the race condition window (between checking availability and marking occupied). Must describe both lock granularities. Must show back-of-envelope math: 200 spots / 2hr turnover = 0.03 vehicles/sec vs 10/sec capacity with coarse lock = 300x headroom.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Race condition: With multiple entrances, two threads can simultaneously find the same spot available (it's not in occupiedSpotIds), then both try to add it. Both vehicles get tickets for the same spot.\n\nThe vulnerability window is between checking if the spot is available (read from occupiedSpotIds) and adding it to the set (write to occupiedSpotIds).\n\nCoarse-grained lock (recommended):\nSynchronize the entire enter() method with a mutex. Only one vehicle processes at a time.\n```python\ndef enter(vehicle_type):\n    with self._lock:\n        spot = find_available_spot(vehicle_type)\n        if not spot: raise Exception(\"Full\")\n        self._occupied.add(spot.id)\n        ticket = create_ticket(spot)\n        return ticket\n```\n\nFine-grained read-write lock:\nMultiple threads can search concurrently (read lock). Claiming requires exclusive access (write lock). Double-check inside write lock and retry.\n```python\ndef enter(vehicle_type):\n    while True:\n        spot = find_spot(vehicle_type)  # read lock\n        with write_lock:\n            if spot.id not in occupied:\n                occupied.add(spot.id)\n                return create_ticket(spot)\n        # Retry — spot was claimed\n```\n\nBack-of-envelope math:\n- 200 spots, average turnover 1× per 2 hours = 200/7200 ≈ 0.03 vehicles/sec demand\n- Each entry takes ~100ms with coarse lock → 10 vehicles/sec capacity\n- 10 / 0.03 = 300× headroom\n\nVerdict: Coarse-grained lock is the right choice. It's simple, correct, and has 300× headroom. Fine-grained locking adds retry logic, potential livelock, and debugging complexity for zero practical benefit at this scale. I would only switch to fine-grained if traffic exceeded ~5 vehicles/sec sustained.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Why money should be stored as integers",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Why does the Parking Lot design store hourlyRateCents as a long integer (e.g., 500 for $5.00) instead of a float (e.g., 5.00)? What specific problem does this avoid?",
        explanation:
          "Floating-point types use binary fractions internally and cannot represent decimal fractions like 0.1 exactly. This leads to tiny errors (e.g., 0.1 + 0.2 = 0.30000000000000004) that accumulate in calculations. Storing cents as integers keeps all arithmetic exact. You only convert to dollars for display.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Floats cannot represent decimal fractions exactly (e.g., 0.1 + 0.2 ≠ 0.3 in binary). Storing cents as integers keeps arithmetic exact, avoiding accumulated rounding errors in fee calculations.",
          acceptableAnswers: [
            "floating point",
            "rounding",
            "precision",
            "binary fraction",
            "exact",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Why Ticket stores spotId not ParkingSpot reference",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Ticket stores spotId as a String rather than holding a reference to the ParkingSpot object. Name the design principle this follows and explain why it matters.",
        explanation:
          "This follows the Law of Demeter (principle of least knowledge). Tickets are records, not navigational objects. Storing just the ID prevents tickets from accidentally calling methods on spots, keeping Ticket as a simple data holder. It also makes Ticket easier to serialize and test.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Law of Demeter — Ticket should not reach into the domain model. Storing just the ID prevents accidental coupling and keeps Ticket as a simple, serializable data holder.",
          acceptableAnswers: ["Law of Demeter", "Demeter", "least knowledge", "decoupling"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Double exit prevention mechanism",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'How does the Parking Lot system prevent a user from exiting twice with the same ticket? What would need to change if you wanted to distinguish between "ticket never existed" and "ticket already used"?',
        explanation:
          'The ticket is removed from activeTickets during exit. A second attempt finds null in the map and throws the same error as a non-existent ticket. To distinguish them, you would add a usedTickets: Set<String> that stores used ticket IDs. On exit, if not in activeTickets but in usedTickets, return "already used." This adds state complexity for marginal UX benefit.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            'Ticket is removed from activeTickets on exit, making reuse look identical to an invalid ID. To distinguish, add a usedTickets: Set<String> — if ticket is in usedTickets but not activeTickets, return "already used."',
          acceptableAnswers: ["removed", "activeTickets", "usedTickets", "Set"],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "PricingStrategy pattern: when to apply",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "When should you introduce a PricingStrategy interface for the Parking Lot, and why is it wrong to build it for the base requirements? Name the principle that advises against it.",
        explanation:
          "YAGNI (You Aren't Gonna Need It). The base requirements specify \"simple hourly pricing for all vehicles\" — a single pricing rule. Building a Strategy pattern for one implementation adds abstraction for future requirements that don't exist. Introduce PricingStrategy only when you actually have multiple pricing models (surge pricing, per-vehicle rates, discounts) or need to swap strategies at runtime.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "YAGNI — don't build Strategy for a single pricing rule. Introduce it only when you have multiple pricing models (surge, per-type rates, discounts) that need runtime swapping.",
          acceptableAnswers: [
            "YAGNI",
            "You Aren't Gonna Need It",
            "over-engineering",
            "single pricing",
          ],
          caseSensitive: false,
        },
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
        content: "Match each Parking Lot entity to its primary responsibility:",
        explanation:
          "ParkingLot is the orchestrator that coordinates entry, exit, occupancy, and pricing. ParkingSpot is a pure data holder with intrinsic physical properties. Ticket is an immutable session record created at entry. VehicleType is an enum classification, not an entity.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "ParkingLot",
              right: "Orchestrates entry/exit, tracks occupancy, and calculates fees",
            },
            {
              id: "p2",
              left: "ParkingSpot",
              right: "Pure data holder representing a physical space — ID and type only",
            },
            {
              id: "p3",
              left: "Ticket",
              right: "Immutable record of a parking session — ID, spot, vehicle type, entry time",
            },
            {
              id: "p4",
              left: "VehicleType (enum)",
              right: "Classification label for the type of vehicle entering the lot",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match design decisions to their rationale",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each design decision in the Parking Lot system to the principle or rationale behind it:",
        explanation:
          "computeFee() in ParkingLot follows SRP (Ticket stays a pure record). hourlyRateCents as long avoids floating-point precision errors. Ticket.spotId as String follows Law of Demeter. Separate enums maintain semantic distinction for future flexibility.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "computeFee() in ParkingLot, not Ticket",
              right:
                "Single Responsibility Principle — Ticket is a record, pricing is a business rule",
            },
            {
              id: "p2",
              left: "hourlyRateCents as long, not float",
              right:
                "Avoiding floating-point precision errors — binary fractions can't represent 0.1 exactly",
            },
            {
              id: "p3",
              left: "Ticket stores spotId string, not ParkingSpot reference",
              right: "Law of Demeter — records should not navigate into domain model objects",
            },
            {
              id: "p4",
              left: "Separate SpotType and VehicleType enums",
              right:
                "Semantic distinction — enables clean cross-type mapping for future extensions",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match extensibility scenarios to design patterns",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each Parking Lot extensibility scenario to the most appropriate design approach:",
        explanation:
          "Multi-floor adds a ParkingFloor entity in the hierarchy. Per-type pricing uses a simple Map — not Strategy, because it's still one rule with parameterized rates. Complex pricing models (surge, discounts, time-of-day) warrant Strategy pattern for runtime swapping. Concurrent access uses synchronized enter() method with coarse-grained locking.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Multi-floor parking garage",
              right: "Add ParkingFloor entity between ParkingLot and ParkingSpot",
            },
            {
              id: "p2",
              left: "Different rates per vehicle type",
              right:
                "Replace single rate with Map<VehicleType, long> — same computation, parameterized",
            },
            {
              id: "p3",
              left: "Surge pricing, discounts, time-of-day rules",
              right: "PricingStrategy interface with swappable implementations",
            },
            {
              id: "p4",
              left: "Multiple entrances processing simultaneously",
              right: "Coarse-grained lock on enter() — synchronized method serializes requests",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Parking Lot fee rounding rule",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In the Parking Lot system, fees are calculated hourly and any partial hour is rounded _____ to the nearest full hour. So a vehicle parked for 5 minutes is charged for _____ hour(s).",
        explanation:
          'The requirements specify "round up to the nearest hour." This means any partial hour counts as a full hour. A vehicle parked for 5 minutes gets charged for 1 hour. This eliminates the need for separate minimum-charge logic.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "In the Parking Lot system, fees are calculated hourly and any partial hour is rounded {{blank1}} to the nearest full hour. So a vehicle parked for 5 minutes is charged for {{blank2}} hour(s).",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "up",
              acceptableAnswers: ["up"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "1",
              acceptableAnswers: ["1", "one"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Entity identification heuristic",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          'When identifying entities, ask "Is this a property of the _____ itself, or a relationship managed by the _____?" to determine where state should live.',
        explanation:
          "Intrinsic state (ID, size, physical condition) is a property of the entity itself. Relational state (assigned to ticket, reserved by user) is managed by the system/orchestrator. This mental model guides state placement decisions.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            'When identifying entities, ask "Is this a property of the {{blank1}} itself, or a relationship managed by the {{blank2}}?" to determine where state should live.',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "entity",
              acceptableAnswers: ["entity", "object", "class"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "system",
              acceptableAnswers: ["system", "orchestrator", "manager"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Occupancy index terminology",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "The occupiedSpotIds Set is technically _____ with the ticket data (since a ticket references a spot, that spot is occupied). It acts as a maintained _____, similar to a database index, that must stay in sync with the source data.",
        explanation:
          "The Set is redundant with ticket data — you could derive occupancy from activeTickets. But it serves as a maintained index: like a database index, it duplicates information for faster lookups, at the cost of keeping it synchronized with the source.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "The occupiedSpotIds Set is technically {{blank1}} with the ticket data (since a ticket references a spot, that spot is occupied). It acts as a maintained {{blank2}}, similar to a database index, that must stay in sync with the source data.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "redundant",
              acceptableAnswers: ["redundant", "denormalized", "duplicate"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "index",
              acceptableAnswers: ["index", "cache"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
