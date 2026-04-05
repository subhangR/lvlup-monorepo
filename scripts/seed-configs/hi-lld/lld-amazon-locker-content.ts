/**
 * Amazon Locker — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: requirements gathering, entity identification, class design,
 * access token management, compartment allocation, and extensibility
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldAmazonLockerContent: StoryPointSeed = {
  title: "Design Amazon Locker (LLD)",
  description:
    "Master the low-level design of a self-service package locker system — covering entity identification, class design, access token lifecycle, compartment allocation strategies, and extensibility patterns like size fallback and two-phase deposit.",
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
      title: "Amazon Locker — Requirements & Entity Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Amazon Locker — Requirements & Entity Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is Amazon Locker?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Amazon Locker is a self-service package pickup system. A delivery driver deposits a package into an available compartment, the system generates an access token, and the customer uses that code to retrieve their package. In an LLD interview, you design the core locker operations — not the delivery logistics or notification system.",
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
                "Before writing code, spend 3-5 minutes asking structured questions around four areas: core operations, failure scenarios, scope boundaries, and future extensibility. This is the conversation you would have with a PM or tech lead before writing a single line of code.",
            },
            {
              id: "b5",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Carrier deposits a package by specifying size (small, medium, large). System assigns an available compartment of matching size, opens it, and returns an access token — or returns an error if no space.",
                  "Upon successful deposit, an access token is generated and returned. One access token per package.",
                  "User retrieves package by entering access token. System validates the code, opens the compartment, and cleans up state. Throws specific errors for invalid or expired codes.",
                  "Access tokens expire after 7 days. Expired codes are rejected. Package remains in compartment until staff removes it.",
                  "Staff can open all expired compartments to manually handle packages — system opens all compartments with expired tokens.",
                  "Invalid access tokens are rejected with clear error messages — wrong code, already used, or expired.",
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
                  "Delivery logistics (how the package gets to the locker)",
                  "Notification (how the access token reaches the customer)",
                  "Lockout after failed attempts",
                  "UI/rendering layer",
                  "Multiple locker stations",
                  "Payment or pricing",
                ],
              },
            },
            {
              id: "b8",
              type: "paragraph",
              content:
                "Calling out features you considered and chose not to build (like lockout logic and notification) shows you think ahead without over-engineering. You can always circle back in the extensibility section.",
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
                "Look for nouns in the requirements and evaluate which ones deserve to be classes. Not every noun needs an entity — some are just fields or input parameters. The key question for each candidate: does this noun have its own behavior, or is it just data that lives on another entity?",
            },
            {
              id: "b11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Package — NOT an entity. Our system only cares about the package's size. That is just an input parameter to the deposit operation. Package tracking lives in Amazon's fulfillment system.",
                  "Compartment — YES. A physical container with a size and an ID. Manages its own occupancy state.",
                  "Locker — YES. The orchestrator. Owns all compartments and the access token lookup map. Handles deposit and pickup operations.",
                  "AccessToken — YES. Not just a string — it is a bearer token with an expiration time. Represents the right to open a specific compartment. Owns expiration logic.",
                ],
              },
            },
            {
              id: "b12",
              type: "quote",
              content:
                "A common mistake is creating a Package class. Ask yourself: what behavior would Package have? In our system, packages are external — the only thing we need is the size, which is an input parameter. Don't create entities for concepts that have no behavior in your system.",
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
                "For each class, trace back to requirements and ask two questions: what does this entity need to remember (state), and what operations does it support (public methods)? Start with the orchestrator (Locker), then work down to AccessToken and Compartment.",
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
                "class Locker:\n    - compartments: Compartment[]\n    - accessTokenMapping: Map<string, AccessToken>\n\n    + Locker(compartments)\n    + depositPackage(size) -> string | error\n    + pickup(tokenCode) -> void | error\n    + openExpiredCompartments() -> void\n\nclass AccessToken:\n    - code: string\n    - expiration: timestamp\n    - compartment: Compartment\n\n    + AccessToken(code, expiration, compartment)\n    + isExpired() -> boolean\n    + getCompartment() -> Compartment\n    + getCode() -> string\n\nclass Compartment:\n    - size: Size\n    - occupied: boolean\n\n    + Compartment(size)\n    + getSize() -> Size\n    + isOccupied() -> boolean\n    + markOccupied() -> void\n    + markFree() -> void\n    + open() -> void\n\nenum Size:\n    SMALL\n    MEDIUM\n    LARGE",
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
                  "depositPackage returns only the token code — the compartment opens physically, so the driver does not need a compartment number.",
                  "pickup returns void — the compartment door opens, which is the only feedback the customer needs. Errors throw with specific messages.",
                  "Occupancy is tracked on Compartment, not in a centralized set on Locker. Physical presence is intrinsic to the compartment. Both approaches are defensible.",
                  'AccessToken holds a reference to Compartment because a token "unlocks" a specific compartment. This is the Information Expert principle — the token knows which compartment it grants access to.',
                ],
              },
            },
            {
              id: "c7",
              type: "heading",
              content: "Where Does State Belong?",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Physical state (contains a package, is broken) lives on the entity because it describes the entity's condition. Relational state (assigned to this token, reserved by this user) lives in the orchestrator because it describes system-managed relationships. This distinction isn't always clear-cut — in the Parking Lot problem, occupancy is treated as relational state. The key is having a rationale you can defend.",
            },
            {
              id: "c9",
              type: "heading",
              content: "Implementation: depositPackage",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "code",
              content:
                'depositPackage(size)\n    compartment = getAvailableCompartment(size)\n    if compartment == null\n        throw Error("No available compartment of size " + size)\n\n    compartment.open()\n    compartment.markOccupied()\n    accessToken = generateAccessToken(compartment)\n    accessTokenMapping[accessToken.getCode()] = accessToken\n\n    return accessToken.getCode()\n\ngetAvailableCompartment(size)\n    for compartment in compartments\n        if compartment.size == size and !compartment.isOccupied()\n            return compartment\n    return null',
              metadata: { language: "text" },
            },
            {
              id: "c11",
              type: "heading",
              content: "Implementation: pickup",
              metadata: { level: 2 },
            },
            {
              id: "c12",
              type: "code",
              content:
                'pickup(tokenCode)\n    if tokenCode == null || tokenCode.isEmpty()\n        throw Error("Invalid access token code")\n\n    accessToken = accessTokenMapping[tokenCode]\n    if accessToken == null\n        throw Error("Invalid access token code")\n\n    if accessToken.isExpired()\n        throw Error("Access token has expired")\n\n    // Valid pickup - unlock door and clean up\n    compartment = accessToken.getCompartment()\n    compartment.open()\n    clearDeposit(accessToken)\n\nclearDeposit(accessToken)\n    compartment = accessToken.getCompartment()\n    compartment.markFree()\n    accessTokenMapping.remove(accessToken.getCode())',
              metadata: { language: "text" },
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                'Notice: "Invalid access token code" is returned for both codes that never existed and codes that were already used. Once picked up, the token is removed from the map. A second attempt looks identical to a random code. We do give specific feedback for expired codes because that is actionable — the user knows to contact support.',
            },
            {
              id: "c14",
              type: "heading",
              content: "Implementation: openExpiredCompartments",
              metadata: { level: 2 },
            },
            {
              id: "c15",
              type: "code",
              content:
                "openExpiredCompartments()\n    for tokenCode, accessToken in accessTokenMapping\n        if accessToken.isExpired()\n            compartment = accessToken.getCompartment()\n            compartment.open()",
              metadata: { language: "text" },
            },
            {
              id: "c16",
              type: "paragraph",
              content:
                "We do NOT call clearDeposit here because the compartments remain occupied until staff physically remove the packages. Once staff complete their work, they would call a separate method to mark packages as removed and free up compartments.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Allocation Strategies & Extensibility
    {
      title: "Allocation Strategies & Extensibility",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Allocation Strategies & Extensibility",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Compartment Allocation Strategies",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "heading",
              content: "Bad: Derive Availability from Access Tokens",
              metadata: { level: 3 },
            },
            {
              id: "d3",
              type: "paragraph",
              content:
                'Scanning the access token map to determine if a compartment is occupied seems elegant — derived state instead of stored state. However, it has a fundamental semantic problem. Expired tokens still reference compartments (needed for "code expired" feedback), but the package is physically still present. Token validity and physical occupancy can diverge — you cannot reliably derive one from the other.',
            },
            {
              id: "d4",
              type: "heading",
              content: "Good: Index Available Compartments by Size (O(1) Lookup)",
              metadata: { level: 3 },
            },
            {
              id: "d5",
              type: "code",
              content:
                "class Locker:\n    - availableCompartmentsBySize: Map<Size, Queue<Compartment>>\n\ngetAvailableCompartment(size)\n    queue = availableCompartmentsBySize[size]\n    if queue == null or queue.isEmpty()\n        return null\n    return queue.dequeue()  // O(1)",
              metadata: { language: "text" },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "O(1) lookup and allocation via hash map + queue. FIFO ordering distributes wear evenly across physical compartments. Downside: state lives in two places (compartments array and size queues), creating synchronization risk. For a typical locker with 20-50 compartments, O(n) iteration is negligible — prefer the simpler occupied-flag approach.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Best: Track Occupancy on Compartment (Chosen Approach)",
              metadata: { level: 3 },
            },
            {
              id: "d8",
              type: "paragraph",
              content:
                "Each Compartment tracks its own physical state with an occupied boolean. getAvailableCompartment iterates compartments and returns the first match. O(n) but simple, no synchronization risk, and follows Information Expert — physical presence is intrinsic to the compartment.",
            },
            {
              id: "d9",
              type: "heading",
              content: "Extensibility: Size Fallback",
              metadata: { level: 2 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "If all medium compartments are full, allow a smaller package to use a larger compartment. Change getAvailableCompartment to try the exact size first, then fall back to larger sizes. For MEDIUM: check MEDIUM first, then LARGE. Never fall back to a smaller size since the package won't fit.",
            },
            {
              id: "d11",
              type: "code",
              content:
                "getAvailableCompartment(requestedSize)\n    sizesInOrder = [SMALL, MEDIUM, LARGE]\n    startIndex = sizesInOrder.indexOf(requestedSize)\n\n    for i from startIndex to sizesInOrder.length\n        size = sizesInOrder[i]\n        for c in compartments\n            if c.getSize() == size && !c.isOccupied()\n                return c\n\n    return null  // No compartment available",
              metadata: { language: "text" },
            },
            {
              id: "d12",
              type: "heading",
              content: "Extensibility: Compartment Maintenance Status",
              metadata: { level: 2 },
            },
            {
              id: "d13",
              type: "code",
              content:
                "enum CompartmentStatus:\n    AVAILABLE\n    OCCUPIED\n    OUT_OF_SERVICE\n\nclass Compartment:\n    - size: Size\n    - status: CompartmentStatus\n\n    + isAvailable() -> boolean  // returns status == AVAILABLE\n    + markOccupied()\n    + markAvailable()\n    + markOutOfService()\n    + markInService()",
              metadata: { language: "text" },
            },
            {
              id: "d14",
              type: "paragraph",
              content:
                "Replace the simple occupied boolean with a status enum. The allocation logic automatically skips out-of-service compartments because isAvailable() returns false.",
            },
            {
              id: "d15",
              type: "heading",
              content: "Extensibility: Two-Phase Deposit",
              metadata: { level: 2 },
            },
            {
              id: "d16",
              type: "paragraph",
              content:
                "To verify the driver actually deposits the package, split into reserveCompartment and confirmDeposit. Add a RESERVED status. Include timeout logic — if the driver reserves but never confirms within 2-3 minutes, auto-cancel and free the compartment. This adds complexity but is essential in production for guaranteeing physical package presence.",
            },
            {
              id: "d17",
              type: "heading",
              content: "What Distinguishes Each Level",
              metadata: { level: 2 },
            },
            {
              id: "d18",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Junior: Identify the 3 core entities and implement deposit/pickup for the happy path. Getting stuck on entity design is fine if you can reason through it.",
                  "Mid-level: Recognize Package is not a useful entity. Clean separation of concerns. Handle key edge cases (invalid codes, expired codes, full compartments). Explain design choices.",
                  "Senior: Drive the design with minimal prompting. Demonstrate Information Expert. Proactively discuss tradeoffs: occupancy tracking, lazy vs eager token cleanup, when Package would become an entity. Anticipate interviewer questions.",
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
      title: "Why Package is not a class",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When designing the Amazon Locker system, why should Package NOT be modeled as its own class?",
        explanation:
          "Package has no behavior in our system. Our locker only needs the package's size, which is just an input parameter to depositPackage(). Package tracking, shipping info, and customer details live in Amazon's fulfillment system — external to our locker. Creating a Package class would add an entity with no methods, violating the principle that classes should encapsulate both data and behavior.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Our system only needs the package's size, which is an input parameter — Package would have no behavior in our domain",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Package is too simple to be a class — it should be a struct instead",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Package already exists in another system, so we cannot model it again",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Having a Package class would create a circular dependency with Compartment",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Locker role in the system",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "What is the Locker class's primary role in the Amazon Locker design?",
        explanation:
          "Locker is the orchestrator — the system's public API. External code interacts with it to deposit packages and pick them up. It owns all compartments and the access token lookup map, coordinates workflows between Compartment and AccessToken entities. It is NOT a data store for packages or an abstract factory.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Orchestrator — it is the system's entry point, coordinating deposit, pickup, and expiration workflows across entities",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Data store — it persists package data and access tokens to a database",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Factory — it creates and manages the lifecycle of Compartment objects",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Observer — it watches compartments for state changes and reacts accordingly",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Return type of depositPackage",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why does depositPackage() return only the access token code string, rather than also returning the compartment number?",
        explanation:
          "The compartment door opens physically when depositPackage() is called — the driver sees which door opened and deposits the package there. Returning the compartment number would be redundant information. The only thing that needs to be passed downstream is the access token code, which will be sent to the customer (by another system) for pickup.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "The compartment door opens physically — the driver sees which one opened. Only the token code needs to be sent to the customer.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Returning the compartment number would expose internal implementation details, violating encapsulation",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The compartment number is stored inside the access token, so it can always be retrieved later",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Returning multiple values from a method is bad practice in OOP design",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Occupancy tracking tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A candidate proposes deriving compartment availability from the access token map instead of tracking an occupied flag on Compartment. What is the fundamental flaw in this approach?",
        explanation:
          'Access tokens expire after 7 days, but expired tokens must remain in the map so the system can return "code expired" instead of "invalid code." During the window between token expiration and staff cleanup, the package is still physically present. If you count non-expired tokens as "occupied," expired compartments appear free when they aren\'t. If you count all tokens (including expired), compartments are locked permanently until staff cleanup. Token validity and physical occupancy are different states that can diverge.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Token validity and physical occupancy can diverge — expired tokens still reference occupied compartments, making derived state unreliable",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Iterating through the token map to check availability is O(n²), which is too slow",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The access token map might be stored in a different database table, making joins expensive",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Access tokens are immutable, so they cannot be used to track mutable occupancy state",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Error differentiation in pickup",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'In the pickup() implementation, the system returns "Invalid access token code" for both never-existed codes and already-used codes, but returns a different message ("Access token has expired") for expired codes. Why this asymmetry?',
        explanation:
          "Expired codes require different feedback because the information is actionable — the customer knows the package is still in the locker and can contact support. For never-existed vs already-used codes, the action is the same (nothing to do), so distinguishing them adds state management complexity (tracking used codes) with marginal UX benefit. Once a package is picked up, the token is removed from the map, so a reused code is indistinguishable from a random invalid code.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: '"Expired" is actionable feedback (package still in locker, contact support), while distinguishing "never existed" from "already used" adds state complexity for marginal UX benefit',
              isCorrect: true,
            },
            {
              id: "b",
              text: "Revealing whether a code was previously valid is a security vulnerability that could enable enumeration attacks",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The system physically cannot distinguish between never-existed and already-used codes due to hash collisions",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It is an implementation shortcut that should ideally be fixed — all three states should have distinct messages",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Queue vs flag for compartment allocation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A developer proposes maintaining a Map<Size, Queue<Compartment>> to achieve O(1) compartment allocation instead of iterating with an occupied flag. When is this optimization worth the added complexity?",
        explanation:
          "The indexed approach provides O(1) allocation but introduces synchronization risk — state lives in two places (compartments array and size queues). If you forget to enqueue on pickup or accidentally enqueue twice, the system corrupts. For a typical Amazon Locker with 20-50 compartments, O(50) iteration is negligible. The optimization only matters at scale (hundreds/thousands of compartments with frequent deposits). The simpler occupied-flag approach is preferred unless performance profiling reveals a bottleneck.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Only when there are hundreds/thousands of compartments with frequent deposits — for 20-50 compartments, O(n) is negligible and the simpler approach wins",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Always — O(1) is objectively better than O(n) and should be preferred in all cases",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Never — the synchronization risk of dual state storage makes it too dangerous for production",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Only in multi-threaded environments where lock contention on the compartments array is a bottleneck",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "openExpiredCompartments cleanup scope",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In the openExpiredCompartments() implementation, we open compartments with expired tokens but do NOT call clearDeposit(). What happens if we mistakenly call clearDeposit() inside this method?",
        explanation:
          'clearDeposit() marks the compartment as free (occupied = false) and removes the token from the map. If staff haven\'t physically removed the package yet, the compartment appears available for new deposits. A driver could deposit a new package into a compartment that still contains the old one. Additionally, removing the expired token means a customer trying their expired code gets "Invalid code" instead of "Code expired" — losing actionable feedback. The physical state and system state become desynchronized.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Compartments with unremoved packages appear available — new deposits could target occupied compartments, and expired-code feedback is lost",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A NullPointerException would occur because clearDeposit cannot process expired tokens",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The access token map would still retain references, preventing garbage collection of Compartment objects",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The method would deadlock because clearDeposit and openExpiredCompartments both iterate the token map",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Two-phase deposit design implications",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "The two-phase deposit extensibility (reserveCompartment → confirmDeposit) introduces a RESERVED status. What is the most critical new failure mode this creates, and how should it be handled?",
        explanation:
          "The most critical failure mode is a driver who reserves a compartment but never confirms — the compartment is stuck in RESERVED state indefinitely, effectively lost from the available pool. This must be handled with a timeout: if no confirmation arrives within 2-3 minutes, auto-cancel the reservation and return the compartment to AVAILABLE. Without this timeout, abandoned reservations silently reduce system capacity. This is the same pattern as database connection pool timeout or HTTP request timeout — resources held without progress must be reclaimed.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Abandoned reservations — a driver who reserves but never confirms locks the compartment forever. Handle with a 2-3 minute timeout that auto-cancels.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Race conditions — two drivers could reserve the same compartment simultaneously. Handle with a distributed lock.",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Token generation timing — generating the token before physical deposit means the customer could try to pick up before the package arrives.",
              isCorrect: false,
            },
            {
              id: "d",
              text: "State explosion — adding RESERVED means Compartment now has 4 states, making the state machine too complex to maintain.",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Valid entities for the Amazon Locker system",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid entities (classes with meaningful behavior) for the Amazon Locker system:",
        explanation:
          "Locker (orchestrator), Compartment (physical state management), and AccessToken (bearer token with expiration) are all valid entities with distinct responsibilities. Package has no behavior in our system — we only need the size as an input parameter. DeliveryDriver is out of scope — our system starts after the driver arrives at the locker.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Locker — orchestrates deposit, pickup, and expiration workflows",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Compartment — manages physical size and occupancy state",
              isCorrect: true,
            },
            {
              id: "c",
              text: "AccessToken — bearer token with expiration and compartment reference",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Package — represents the physical package with tracking info",
              isCorrect: false,
            },
            {
              id: "e",
              text: "DeliveryDriver — represents the carrier depositing the package",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "State that clearDeposit must clean up",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "When a customer successfully picks up a package, clearDeposit() must clean up all related state. Select ALL state changes that MUST happen in clearDeposit():",
        explanation:
          "clearDeposit must: (1) mark the compartment as free (occupied = false) so it becomes available for new deposits, and (2) remove the access token from the mapping so the code cannot be reused and the token is garbage-collected. Opening the compartment is NOT part of clearDeposit — that happens in pickup() before clearDeposit is called. Notifying the customer is explicitly out of scope.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Mark the compartment as free (compartment.markFree())",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Remove the access token from the accessTokenMapping",
              isCorrect: true,
            },
            { id: "c", text: "Open the compartment door (compartment.open())", isCorrect: false },
            {
              id: "d",
              text: "Send a notification to the customer confirming pickup",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Valid design decisions for occupancy tracking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are valid approaches for tracking compartment availability in the Amazon Locker system? Select ALL that apply.",
        explanation:
          "Both tracking via an occupied flag on Compartment and maintaining a Map<Size, Queue> index are valid approaches with different tradeoffs. The flag approach is simpler with a single source of truth. The queue approach provides O(1) allocation but introduces synchronization risk. Deriving from access tokens fails because token validity and physical occupancy can diverge when tokens expire. Using a database with SQL queries is out of scope for this in-memory LLD problem.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Boolean occupied flag on Compartment — simple, single source of truth, O(n) scan",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Map<Size, Queue<Compartment>> on Locker — O(1) lookup, but dual-state synchronization risk",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Derive from access token map — scan tokens to determine which compartments are in use",
              isCorrect: false,
            },
            {
              id: "d",
              text: "SQL query against a compartments database table with a WHERE available = true clause",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Senior-level design considerations",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are considerations that distinguish a Senior-level answer from a Mid-level answer in an Amazon Locker LLD interview? Select ALL that apply.",
        explanation:
          "Senior candidates proactively discuss: (1) where occupancy state belongs and can defend either choice with a rationale, (2) when Package WOULD become a real entity (e.g., multiple packages per compartment), (3) two-phase deposit for production reliability. However, implementing a distributed consensus protocol is over-engineering for an in-memory LLD problem — this is a single-machine system with no distributed state.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Proactively discussing where occupancy state belongs (on entity vs in orchestrator) with defensible rationale",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Identifying when Package would need to become a real entity (e.g., multi-package compartments)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Proposing two-phase deposit (reserve → confirm) for production reliability without being prompted",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Implementing Raft consensus for distributed compartment state management",
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
          "Walk through the entity identification process for the Amazon Locker system. For each noun in the requirements (Package, Compartment, Locker, AccessToken), explain whether it should be a class and justify your decision based on whether it has meaningful behavior in the system.",
        explanation:
          "A strong answer evaluates each candidate entity against a clear criterion: does it have behavior (methods) in our system? Package fails this test — size is just an input parameter. Compartment, Locker, and AccessToken each have distinct responsibilities and operations. The answer should demonstrate the Information Expert principle.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Entity identification starts by extracting nouns from requirements and evaluating each against one key criterion: does this concept have meaningful behavior (methods) in our system?\n\nPackage — NOT an entity. Our system only needs the package's size to allocate a compartment. Size is an input parameter to depositPackage(size), not an object. Package tracking, shipping info, and customer details live in Amazon's fulfillment system. A Package class would have no methods — it would be a data bag with no behavior, violating the principle that classes encapsulate both state and behavior.\n\nCompartment — YES, an entity. It represents a physical locker slot with a size and occupancy state. It has real behavior: open() triggers the hardware unlock, markOccupied()/markFree() manage physical state, and isOccupied() answers availability queries. Physical state (whether a package is present) is intrinsic to the compartment.\n\nLocker — YES, the orchestrator entity. It is the system's public API — external code calls depositPackage(), pickup(), and openExpiredCompartments(). It owns the compartments collection and the access token map, coordinating workflows between the other entities.\n\nAccessToken — YES, an entity. It is more than just a code string. It is a bearer token with an expiration timestamp and a reference to the compartment it unlocks. It has behavior: isExpired() enforces the 7-day TTL. Modeling it as a field on Compartment would scatter access-control logic across the system.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Physical vs relational state placement",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Explain the distinction between "physical state" and "relational state" in the context of the Amazon Locker design. Where should each type live, and why might reasonable engineers disagree on which category occupancy falls into?',
        explanation:
          "A strong answer defines both types, gives examples from the locker system, and explains why occupancy is a legitimate gray area. Physical state describes the entity's condition. Relational state describes system-managed relationships. The answer should acknowledge that both approaches are valid with different rationales.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Physical state describes an entity\'s intrinsic condition — things that would be true even if the system didn\'t exist. For a Compartment, "contains a package" is physical state. "Is broken" or "needs maintenance" are also physical states. Physical state naturally lives on the entity because it describes the entity\'s condition.\n\nRelational state describes system-managed relationships — things that only exist because the system tracks them. "Assigned to this access token" or "reserved by this user" are relational states. These live in the orchestrator (Locker) because they describe how the system has connected entities.\n\nOccupancy is the gray area: You can argue it\'s physical ("a package is physically present — that\'s the compartment\'s condition") and put an occupied flag on Compartment. Or you can argue it\'s relational ("the system assigned this compartment to a deposit — that\'s a relationship the system manages") and track it in a Set<Compartment> on Locker.\n\nIn the Parking Lot problem, occupancy is commonly treated as relational state tracked in the orchestrator. In Amazon Locker, we chose physical state on Compartment. Both are valid — what matters is having a rationale you can defend. "I put occupied on Compartment because physical presence is intrinsic to the compartment" is a good answer. "I used a Set in Locker because assignment is a relationship the system manages" is equally good.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Trace through deposit and pickup lifecycle",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A Locker has compartments A (SMALL), B (MEDIUM), C (LARGE), all initially unoccupied. Trace through the following sequence step by step, showing the system state (occupied flags, token map) after each operation: (1) Deposit a MEDIUM package, (2) Successful pickup with the valid code, (3) Attempt pickup with the same code again.",
        explanation:
          'Must trace all state changes precisely: deposit marks B occupied and adds token to map; pickup opens B, clears deposit (marks B free, removes token); second pickup with same code returns "Invalid" because the token was removed. The answer should highlight that after cleanup, a reused code is indistinguishable from a never-existed code.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Initial state: A(SMALL, free), B(MEDIUM, free), C(LARGE, free). Token map: {}\n\n(1) depositPackage(MEDIUM):\n- getAvailableCompartment(MEDIUM) scans compartments → finds B (size matches, not occupied)\n- B.open() → hardware unlocks door B\n- B.markOccupied() → B.occupied = true\n- generateAccessToken(B) → AccessToken("ABC123", expiration=now+7days, compartment=B)\n- accessTokenMapping["ABC123"] = token\n- Returns "ABC123"\n\nState after: A(SMALL, free), B(MEDIUM, occupied), C(LARGE, free). Token map: {"ABC123" → AccessToken(B)}\n\n(2) pickup("ABC123"):\n- accessTokenMapping.get("ABC123") → found, token exists\n- token.isExpired() → false (within 7 days)\n- token.getCompartment() → B\n- B.open() → hardware unlocks door B, customer retrieves package\n- clearDeposit(token):\n  - B.markFree() → B.occupied = false\n  - accessTokenMapping.remove("ABC123")\n\nState after: A(SMALL, free), B(MEDIUM, free), C(LARGE, free). Token map: {}\n\n(3) pickup("ABC123") again:\n- accessTokenMapping.get("ABC123") → null (token was removed in step 2)\n- Throws Error("Invalid access token code")\n\nKey insight: The system returns "Invalid access token code" — identical to what it would return for a completely random code. There is no distinction between "never existed" and "already used" because clearDeposit removes the token entirely. To distinguish them, you would need a separate usedTokens set, adding state management for marginal UX benefit.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Compare three allocation strategies",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Compare the three compartment allocation strategies discussed in Amazon Locker: (1) deriving availability from access tokens, (2) indexing by size with Map<Size, Queue>, and (3) tracking with an occupied flag on Compartment. For each, analyze time complexity, correctness, and synchronization risk. Which would you choose and why?",
        explanation:
          "Must cover: derive-from-tokens fails on correctness (token validity ≠ occupancy). Queue-based index is O(1) but has dual-state synchronization risk. Occupied flag is O(n) but simple with single source of truth. The answer should justify the choice based on system scale.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Strategy 1 — Derive from access tokens:\n- Time complexity: O(n×m) where n = compartments, m = tokens (nested scan)\n- Correctness: FAILS. Token validity and physical occupancy can diverge. Expired tokens still reference occupied compartments (package is still there). If you only count non-expired tokens, expired compartments appear free. If you count all tokens, compartments are locked until cleanup. Physical occupancy cannot be reliably derived from token state.\n- Synchronization risk: Low (single source), but the source is wrong.\n\nStrategy 2 — Map<Size, Queue<Compartment>> index:\n- Time complexity: O(1) for all operations (hash lookup + dequeue/enqueue)\n- Correctness: Correct if maintained properly.\n- Synchronization risk: HIGH. State lives in two places (compartments array and size queues). Forgetting to enqueue on pickup = compartment disappears. Double enqueue = compartment appears available when occupied. These bugs are subtle and hard to catch in testing.\n\nStrategy 3 — Occupied flag on Compartment:\n- Time complexity: O(n) scan for allocation\n- Correctness: Correct. Physical presence is directly tracked on the entity.\n- Synchronization risk: LOW. Single source of truth. No secondary data structures to maintain.\n\nMy choice: Strategy 3 (occupied flag). For a typical Amazon Locker (20-50 compartments), O(50) is negligible — the hardware unlock takes orders of magnitude longer. The simplicity and correctness guarantees outweigh the theoretical performance benefit of O(1). I would only switch to Strategy 2 if profiling showed allocation was a bottleneck at scale (hundreds of compartments with high-frequency deposits).",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Design the size fallback extension",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'The interviewer asks: "How would you handle size fallback — allowing a smaller package to use a larger compartment if no exact-size match is available?" Explain the design changes needed, the scanning logic, and any tradeoffs this introduces.',
        explanation:
          "Must describe: modifying getAvailableCompartment to iterate sizes from requested up to LARGE. Should mention: never fall back to smaller sizes, FIFO scanning within each size, and the tradeoff of reduced availability for larger packages when small packages consume large compartments.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Design change: Modify getAvailableCompartment to try the exact size first, then fall back to progressively larger sizes.\n\nScanning logic:\n```\ngetAvailableCompartment(requestedSize)\n    sizesInOrder = [SMALL, MEDIUM, LARGE]\n    startIndex = sizesInOrder.indexOf(requestedSize)\n    for i from startIndex to sizesInOrder.length\n        size = sizesInOrder[i]\n        for c in compartments\n            if c.getSize() == size && !c.isOccupied()\n                return c\n    return null\n```\n\nFor a MEDIUM package: check MEDIUM first, then LARGE. For SMALL: check SMALL → MEDIUM → LARGE. We NEVER fall back to a smaller size because the package physically won't fit.\n\nKey design properties:\n1. Only getAvailableCompartment changes — the rest of the design (deposit, pickup, token management) is untouched. This validates our encapsulation.\n2. The fallback order is implicit in the size enum ordering rather than maintained in a separate helper.\n3. The Size enum effectively defines a total ordering that represents physical size hierarchy.\n\nTradeoffs:\n- Resource waste: A SMALL package in a LARGE compartment wastes 2/3 of the space. In a system with limited LARGE compartments, this could block legitimate LARGE deposits.\n- Starvation: Frequent small-package fallback could exhaust larger compartments, causing LARGE deposits to fail even though the locker has available space.\n- Mitigation: Consider a configurable fallback policy — e.g., only fall back if more than 30% of the larger size remains available, or track utilization ratios.",
          minLength: 150,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Design the two-phase deposit extension",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'The interviewer asks: "How would you ensure packages are actually deposited before generating access tokens?" Design a two-phase deposit system. Show the class changes, new states, the reservation flow, and how you handle abandoned reservations.',
        explanation:
          "Must introduce: RESERVED status on Compartment, split depositPackage into reserveCompartment + confirmDeposit, a reservationMapping, timeout logic for abandoned reservations, and explain the tradeoff of added complexity vs production reliability.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Current problem: depositPackage() opens the compartment and immediately generates an access token, assuming the driver will deposit the package. If they walk away, we have a token for an empty compartment.\n\nSolution: Two-phase commit pattern.\n\nClass changes:\n```\nclass Locker:\n    + reserveCompartment(size) -> reservationId\n    + confirmDeposit(reservationId) -> tokenCode\n    + cancelReservation(reservationId) -> void\n    - reservationMapping: Map<string, Compartment>\n\nenum CompartmentStatus:\n    AVAILABLE, RESERVED, OCCUPIED, OUT_OF_SERVICE\n```\n\nPhase 1 — reserveCompartment(size):\n- Find available compartment of matching size\n- Set status to RESERVED (not OCCUPIED)\n- Open the compartment door\n- Generate a reservationId, store mapping\n- Return reservationId to the driver\n\nPhase 2 — confirmDeposit(reservationId):\n- Look up compartment from reservationMapping\n- Set status to OCCUPIED\n- Generate access token (NOW, not during reservation)\n- Store token in accessTokenMapping\n- Remove reservation from reservationMapping\n- Return token code\n\nAbandoned reservation handling:\n- Critical: A reservation timeout (2-3 minutes) is mandatory. Without it, abandoned reservations permanently reduce capacity.\n- Implementation: A background timer or scheduled check that scans reservationMapping for expired reservations, sets compartment status back to AVAILABLE, and removes the reservation entry.\n- Alternatively, check reservation freshness on every new reserve/deposit call (lazy cleanup).\n\nTradeoffs: Adds a new status, a new mapping, timeout management, and doubles the number of API calls per deposit. For interview scope, the single-phase approach is cleaner. For production with physical sensors or manual confirmation, two-phase is essential.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Information Expert principle application",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Which GRASP principle is demonstrated by having AccessToken own the isExpired() method instead of having Locker check expiration externally? Name the principle and explain in one sentence why it applies.",
        explanation:
          "Information Expert — the class that owns the data (expiration timestamp) should be the one that knows how to use it (check if expired). AccessToken owns the expiration timestamp, so it provides the isExpired() method. This keeps expiration logic co-located with the data it depends on.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Information Expert — AccessToken owns the expiration timestamp, so it should be responsible for checking if it is expired.",
          acceptableAnswers: ["Information Expert", "information expert", "Expert"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Access token code uniqueness",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In the generateAccessToken() implementation, what property of the generated code is most critical for system correctness, and what standard approach ensures it?",
        explanation:
          "Uniqueness is the most critical property — if two active tokens share the same code, a customer could open the wrong compartment. A cryptographically secure random generator (e.g., UUID, SecureRandom) provides sufficient entropy to make collisions statistically impossible within the active token space.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Uniqueness — ensured by using a cryptographically secure random generator (UUID or SecureRandom) to avoid code collisions among active tokens.",
          acceptableAnswers: [
            "uniqueness",
            "unique",
            "cryptographically secure",
            "UUID",
            "SecureRandom",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Expired token retention reason",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "After an access token expires, why must it be retained in the accessTokenMapping rather than immediately deleted? Give the specific user-facing consequence of premature deletion.",
        explanation:
          'Expired tokens must stay in the map so the system can return "Access token has expired" instead of "Invalid access token code." The expired message is actionable — the customer knows the package is still in the locker and can contact support. Premature deletion makes expired codes indistinguishable from random invalid codes, losing this actionable feedback.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            'To distinguish "expired" from "invalid" — if deleted, the customer gets "Invalid code" instead of "Code expired," losing the actionable feedback that their package is still in the locker.',
          acceptableAnswers: [
            "expired",
            "distinguish",
            "actionable",
            "feedback",
            "contact support",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Queue vs Set for indexed allocation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In the indexed allocation strategy (Map<Size, Queue<Compartment>>), why is a Queue preferred over a Set for the collection of available compartments? Consider physical hardware implications.",
        explanation:
          "A Queue provides FIFO ordering, which distributes wear evenly across physical compartments. If you always allocate the first available compartment (a Set with no ordering), the same few compartments handle most deposits, causing uneven wear on door mechanisms and locks. FIFO ensures each compartment gets roughly equal usage over time.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Queue provides FIFO ordering, distributing wear evenly across physical compartment hardware (doors, locks). A Set would cause uneven wear by always picking the same compartments.",
          acceptableAnswers: ["FIFO", "wear", "even distribution", "physical"],
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
        content: "Match each Amazon Locker entity to its primary responsibility:",
        explanation:
          "Locker is the orchestrator that coordinates all workflows. AccessToken manages access control with expiration. Compartment manages its own physical state. Size is an enum that classifies compartment dimensions. Each entity follows the Single Responsibility Principle.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Locker",
              right: "Orchestrates deposit, pickup, and expiration workflows across entities",
            },
            {
              id: "p2",
              left: "AccessToken",
              right: "Bearer token that enforces access control with a 7-day expiration",
            },
            {
              id: "p3",
              left: "Compartment",
              right: "Manages physical state — size, occupancy, and door mechanism",
            },
            {
              id: "p4",
              left: "Size (enum)",
              right: "Classifies compartment dimensions as SMALL, MEDIUM, or LARGE",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match methods to the classes that own them",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each method to the class it belongs to, based on Information Expert (the class with the data should own the behavior):",
        explanation:
          "depositPackage() belongs to Locker because it orchestrates the allocation workflow. isExpired() belongs to AccessToken because it owns the expiration timestamp. markOccupied() belongs to Compartment because it manages physical state. generateAccessToken() is a private helper on Locker because it coordinates token creation with compartment assignment.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "depositPackage(size)",
              right: "Locker — orchestrates allocation, token generation, and state updates",
            },
            {
              id: "p2",
              left: "isExpired()",
              right: "AccessToken — owns the expiration timestamp it needs to evaluate",
            },
            {
              id: "p3",
              left: "markOccupied()",
              right: "Compartment — manages its own physical occupancy state",
            },
            {
              id: "p4",
              left: "generateAccessToken(compartment)",
              right: "Locker (private) — coordinates token creation with compartment mapping",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match allocation strategies to their critical weakness",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each compartment allocation strategy to its most critical weakness:",
        explanation:
          "Deriving from tokens fails on correctness because token validity and occupancy can diverge. The Queue index has synchronization risk from dual-state storage. The occupied flag has O(n) scan time. Size fallback can cause starvation of larger compartments when small packages consume them.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Derive availability from access token map",
              right: "Correctness failure — token expiry and physical occupancy diverge",
            },
            {
              id: "p2",
              left: "Map<Size, Queue> index",
              right: "Synchronization risk — forgetting to enqueue/dequeue corrupts availability",
            },
            {
              id: "p3",
              left: "Occupied flag on Compartment",
              right: "O(n) scan for each allocation instead of O(1) lookup",
            },
            {
              id: "p4",
              left: "Size fallback (small in large)",
              right: "Larger compartment starvation when small packages consume them",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Access token expiration period",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In the Amazon Locker system, access tokens expire after _____ days. If a customer tries to use an expired code, the system rejects it, but the package remains in the compartment until _____ removes it.",
        explanation:
          "Access tokens expire after 7 days. Staff must physically remove packages from expired compartments — the system cannot do this automatically because it requires physical interaction. The openExpiredCompartments() method opens the doors, but staff complete the removal.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "In the Amazon Locker system, access tokens expire after {{blank1}} days. If a customer tries to use an expired code, the system rejects it, but the package remains in the compartment until {{blank2}} removes it.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "7",
              acceptableAnswers: ["7", "seven"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "staff",
              acceptableAnswers: ["staff", "an employee", "a worker", "personnel"],
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
          "When identifying entities for an LLD problem, look for _____ in the requirements and evaluate whether each candidate has meaningful _____ in the system, not just data.",
        explanation:
          "Look for nouns in the requirements as entity candidates. The key filter is whether the candidate has meaningful behavior (methods) — not just data (fields). A concept that only contributes data should be a field on another entity or an input parameter, not its own class.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "When identifying entities for an LLD problem, look for {{blank1}} in the requirements and evaluate whether each candidate has meaningful {{blank2}} in the system, not just data.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "nouns",
              acceptableAnswers: ["nouns", "noun"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "behavior",
              acceptableAnswers: ["behavior", "behaviour", "methods", "operations"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "State placement principle",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          'When deciding where state belongs, _____ state (e.g., "contains a package") lives on the entity because it describes the entity\'s condition, while _____ state (e.g., "assigned to this token") lives in the orchestrator because it describes system-managed relationships.',
        explanation:
          "Physical state describes intrinsic conditions of the entity. Relational state describes system-managed connections between entities. This distinction guides where to place state in OOP designs, though some concepts (like occupancy) can be argued either way.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            'When deciding where state belongs, {{blank1}} state (e.g., "contains a package") lives on the entity because it describes the entity\'s condition, while {{blank2}} state (e.g., "assigned to this token") lives in the orchestrator because it describes system-managed relationships.',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "physical",
              acceptableAnswers: ["physical", "intrinsic"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "relational",
              acceptableAnswers: ["relational", "relationship"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
