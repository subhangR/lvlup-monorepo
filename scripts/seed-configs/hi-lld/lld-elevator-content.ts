/**
 * Elevator System — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: entity modeling, Request class design, dispatch strategies,
 * SCAN movement algorithm, direction-aware stopping, extensibility
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldElevatorContent: StoryPointSeed = {
  title: "Design an Elevator System (LLD)",
  description:
    "Master the low-level design of an elevator control system — covering entity modeling, dispatch strategies, the SCAN movement algorithm, direction-aware request handling, and extensibility for express elevators and concurrency.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements, Entities & Class Design
    {
      title: "Elevator System — Requirements, Entities & Class Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Elevator System — Requirements, Entities & Class Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is an Elevator System?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "An elevator system manages multiple elevators serving different floors in a building. When someone requests an elevator (hall call), the system decides which one to dispatch. Once inside, passengers select their destination floors. The system needs to move elevators efficiently while handling multiple concurrent requests. This is a classic LLD interview problem that tests state machine design, dispatch algorithms, and OOP modeling.",
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
                'Before designing, ask the interviewer: Is this a simulation (step/tick-based) or real control software? How many elevators and floors? Are hall calls directional (up/down buttons) or destination dispatch? What is in scope vs out of scope? Asking "simulation vs. control software" is a senior-level insight — it prevents you from designing motor controllers and sensor callbacks when they want a tick-based simulation.',
            },
            {
              id: "b5",
              type: "heading",
              content: "Final Requirements",
              metadata: { level: 3 },
            },
            {
              id: "b6",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "System manages 3 elevators serving 10 floors (0-9).",
                  "Users can request an elevator from any floor (hall call with UP or DOWN direction). System decides which elevator to dispatch.",
                  "Once inside, users can select one or more destination floors.",
                  "Simulation runs in discrete time steps via a step() or tick() call.",
                  "Two types of stops: Hall calls (direction-aware) and Destinations (no direction).",
                  "Invalid requests (out-of-range floors) are rejected. Requests for current floor are no-ops.",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "Out of Scope",
              metadata: { level: 3 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Weight capacity and passenger limits",
                  "Door open/close mechanics",
                  "Emergency stop functionality",
                  "Dynamic floor/elevator configuration",
                  "UI/rendering layer",
                ],
              },
            },
            {
              id: "b9",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "paragraph",
              content:
                "Scan requirements for nouns with state or behavior. Floor stays an integer — it has no behavior. Request is debatable (we'll revisit). Elevator clearly maintains state (position, direction, stops). ElevatorController is the orchestrator — it owns hall call dispatch and the step() function that advances time.",
            },
            {
              id: "b11",
              type: "heading",
              content: "ElevatorController — The Orchestrator",
              metadata: { level: 3 },
            },
            {
              id: "b12",
              type: "code",
              content:
                "class ElevatorController:\n    - elevators: List<Elevator>\n\n    + ElevatorController()       // initializes 3 elevators\n    + requestElevator(floor, type) -> boolean\n    + step() -> void             // advances all elevators one tick",
              metadata: { language: "text" },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "The controller immediately dispatches hall calls to an elevator, keeping itself stateless beyond the elevator list. requestElevator takes a RequestType (PICKUP_UP or PICKUP_DOWN), not Direction — hall calls are never IDLE, so using RequestType makes invalid states unrepresentable at the type level. step() simply tells each elevator to advance one tick.",
            },
            {
              id: "b14",
              type: "heading",
              content: "Why Request Needs to Be a Class",
              metadata: { level: 3 },
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "Storing just floor numbers (Set<Integer>) seems simpler, but creates a critical bug: if an elevator going UP has floor 7 in its stops and someone on floor 7 presses DOWN, the elevator stops going UP. The passenger sees an UP elevator and either gets on (wrong direction) or waits confused. With a Request class containing (floor, type), Request(7, PICKUP_UP) ≠ Request(7, PICKUP_DOWN) ≠ Request(7, DESTINATION). The elevator only stops for matching requests — it passes floor 7 going UP, reverses, and picks up the DOWN passenger correctly.",
            },
            {
              id: "b16",
              type: "code",
              content:
                "enum RequestType:\n    PICKUP_UP      // Hall call going up\n    PICKUP_DOWN    // Hall call going down\n    DESTINATION    // Inside elevator (stop regardless of direction)\n\nclass Request:\n    - floor: int\n    - type: RequestType\n    + equals() and hashCode() based on floor + type",
              metadata: { language: "text" },
            },
            {
              id: "b17",
              type: "heading",
              content: "Elevator — Movement & State",
              metadata: { level: 3 },
            },
            {
              id: "b18",
              type: "code",
              content:
                "enum Direction: UP, DOWN, IDLE\n\nclass Elevator:\n    - currentFloor: int          // starts at 0\n    - direction: Direction       // UP, DOWN, or IDLE\n    - requests: Set<Request>     // direction-aware stops\n\n    + addRequest(request) -> boolean\n    + step() -> void\n    + getCurrentFloor() -> int\n    + getDirection() -> Direction\n    + hasRequestsAhead(dir) -> boolean\n    + hasRequestsAtOrBeyond(floor, dir) -> boolean",
              metadata: { language: "text" },
            },
            {
              id: "b19",
              type: "paragraph",
              content:
                'Why does Direction need IDLE? Without it, an elevator with no requests would keep drifting. IDLE explicitly represents "not moving." A common trap is trying to share an interface between ElevatorController.requestElevator() and Elevator.addRequest() because they both "add a request." Don\'t — they do fundamentally different things (coordination vs. state mutation). Save interfaces for real polymorphism.',
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 2: Dispatch Strategies & SCAN Movement Algorithm
    {
      title: "Dispatch Strategies & SCAN Movement Algorithm",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Dispatch Strategies & SCAN Movement Algorithm",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Dispatch Strategy: selectBestElevator()",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "The dispatch strategy determines which elevator handles a hall call. There are three levels of sophistication, each addressing a specific flaw in the previous approach.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Bad: Nearest Elevator (Ignore Direction)",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "Pick the closest elevator regardless of direction. Simple but flawed: someone on floor 5 presses UP, nearest elevator is on floor 6 going DOWN to floor 1. It passes floor 5 going the wrong way, goes all the way to 1, reverses, then comes back up. Poor passenger experience.",
            },
            {
              id: "c5",
              type: "heading",
              content: "Good: Direction-Aware (Basic)",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "code",
              content:
                "selectBestElevator(request):\n  Priority 1: Elevators moving toward the floor in the right direction\n  Priority 2: Idle elevators (pick nearest)\n  Priority 3: Any elevator (pick nearest)",
              metadata: { language: "text" },
            },
            {
              id: "c7",
              type: "paragraph",
              content:
                "Checks direction AND position. But has a subtle flaw: an elevator at floor 3 going UP with only a stop at floor 4 looks like a match for a floor 7 UP request — it's going UP and below floor 7. But it will reach floor 4, reverse, and come back DOWN. We're not checking whether existing requests will actually take it to the requested floor.",
            },
            {
              id: "c8",
              type: "heading",
              content: "Great: Direction-Aware with Request Queue Analysis",
              metadata: { level: 3 },
            },
            {
              id: "c9",
              type: "paragraph",
              content:
                'Add hasRequestsAtOrBeyond(floor, dir) — checks if the elevator\'s queued requests will actually take it to or past the requested floor before reversing. This prevents dispatching an elevator that will reverse before reaching the caller. In interviews, implement the "good" version and proactively mention this limitation to show you understand the edge case without burning time coding it.',
            },
            {
              id: "c10",
              type: "quote",
              content:
                "The Strategy pattern applies naturally here: different buildings might need different scheduling strategies (minimize wait time vs. energy efficiency). Each implements the same selectBestElevator(request) interface but picks elevators differently.",
            },
            {
              id: "c11",
              type: "heading",
              content: "Movement Algorithms",
              metadata: { level: 2 },
            },
            {
              id: "c12",
              type: "heading",
              content: "Bad: FIFO (First-In-First-Out)",
              metadata: { level: 3 },
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                "Service requests in arrival order. Elevator at floor 5 with queue [8, 3, 7]: goes 5→8 (3 up), then 8→3 (5 down), then 3→7 (4 up) = 12 floors traveled. Constant direction changes create long wait times and confused passengers.",
            },
            {
              id: "c14",
              type: "heading",
              content: "Good: Nearest-First",
              metadata: { level: 3 },
            },
            {
              id: "c15",
              type: "paragraph",
              content:
                "Always head to the nearest stop. Same scenario: 5→3 (2 down), 3→7 (4 up), 7→8 (1 up) = 7 floors. Better, but still changes direction unnecessarily. A passenger at floor 7 watches the elevator go down to 3 first, even though 7 is right above.",
            },
            {
              id: "c16",
              type: "heading",
              content: "Great: SCAN (Continue Until Clear, Then Reverse)",
              metadata: { level: 3 },
            },
            {
              id: "c17",
              type: "paragraph",
              content:
                "Continue in the current direction, servicing all stops along the way, and only reverse when there are no more stops ahead. Same scenario going UP: 5→7 (stop), 7→8 (stop), 8→3 (reverse, 5 down, stop) = 8 floors. One more floor than nearest-first, but far superior: minimal direction changes, predictable behavior, no thrashing. The passenger at floor 7 sees the elevator coming and it arrives. This is the same principle used in real elevators and disk scheduling algorithms.",
            },
            {
              id: "c18",
              type: "heading",
              content: "SCAN step() Implementation",
              metadata: { level: 2 },
            },
            {
              id: "c19",
              type: "code",
              content:
                "step():\n  Case 1: No requests → direction = IDLE, return\n  Case 2: IDLE with requests → pick direction toward nearest request\n  Case 3: Stop at current floor?\n    - Check for PICKUP matching direction + DESTINATION\n    - Remove matching requests, return (don't move on stop tick)\n    - If no requests left → IDLE\n  Case 4: No requests ahead → reverse direction, return\n  Case 5: Move one floor in current direction",
              metadata: { language: "text" },
            },
            {
              id: "c20",
              type: "heading",
              content: "Critical Implementation Details",
              metadata: { level: 3 },
            },
            {
              id: "c21",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Direction-aware stopping: Going UP → only stop for PICKUP_UP and DESTINATION at current floor. PICKUP_DOWN at current floor survives for the return trip.",
                  "Don't move on stop ticks: When you stop, return immediately. Moving after stopping creates bugs.",
                  "Don't move on reversal ticks: After reversing, return so next tick can check for stops in the new direction.",
                  "hasRequestsAhead() checks ANY request regardless of type: traveling is not direction-aware, only stopping is. The elevator must travel toward all requests even if it won't stop for some until after reversing.",
                  "Don't hardcode boundary checks (if floor == 9 then DOWN). Let hasRequestsAhead() handle it naturally.",
                  "Never use iterator().next() on a HashSet — order is non-deterministic. Always use a deterministic tiebreaker (nearest, lowest floor).",
                ],
              },
            },
            {
              id: "c22",
              type: "heading",
              content: "addRequest() Implementation",
              metadata: { level: 3 },
            },
            {
              id: "c23",
              type: "code",
              content:
                "addRequest(request):\n    if request.floor < 0 || request.floor > 9\n        return false        // invalid floor\n    if request.floor == currentFloor\n        return true          // already here, no-op\n    return requests.add(request)  // Set handles dedup via equals()",
              metadata: { language: "text" },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Extensibility & Concurrency
    {
      title: "Extensibility, Concurrency & Interview Expectations",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Extensibility, Concurrency & Interview Expectations",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Express / Priority Elevators",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "Add an isExpress flag and expressFloors set to Elevator. Express elevators only accept floors in the set (e.g., 0, 5, 9). The controller checks if the request is for an express floor and dispatches the express elevator if idle. The Request class doesn't change — the elevator validates which floors it accepts in addRequest(). This shows you can extend without restructuring.",
            },
            {
              id: "d3",
              type: "heading",
              content: "Undo / Cancel Floor Request",
              metadata: { level: 2 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "Add removeRequest(request) to Elevator. It removes the request from the set. If the elevator hasn't arrived yet, it skips the floor. If it already stopped, the request is already gone — removeRequest is a no-op. The core step() logic doesn't change because the design already isolated state changes to a few methods.",
            },
            {
              id: "d5",
              type: "heading",
              content: "Concurrent Hall Calls",
              metadata: { level: 2 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Two problems arise: (1) two hall calls both dispatch to the same idle elevator (select + add must be atomic), and (2) step() iterates requests while addRequest() modifies them (concurrent modification).",
            },
            {
              id: "d7",
              type: "heading",
              content: "Solution 1: Lock-Based",
              metadata: { level: 3 },
            },
            {
              id: "d8",
              type: "code",
              content:
                "requestElevator(floor, type):\n    lock.acquire()\n    // ... dispatch logic ...\n    lock.release()\n\nstep():\n    lock.acquire()\n    // ... movement logic ...\n    lock.release()",
              metadata: { language: "text" },
            },
            {
              id: "d9",
              type: "heading",
              content: "Solution 2: Concurrent Queue",
              metadata: { level: 3 },
            },
            {
              id: "d10",
              type: "code",
              content:
                "addRequest(request):\n    pendingRequests.enqueue(request)  // thread-safe queue\n\nstep():\n    while !pendingRequests.isEmpty():\n        activeRequests.add(pendingRequests.dequeue())\n    // all logic uses activeRequests only",
              metadata: { language: "text" },
            },
            {
              id: "d11",
              type: "paragraph",
              content:
                "The concurrent queue approach separates writers from the step loop — no contention. The lock approach is simpler to explain. Either is a good interview answer.",
            },
            {
              id: "d12",
              type: "heading",
              content: "What Interviewers Expect at Each Level",
              metadata: { level: 2 },
            },
            {
              id: "d13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Junior: Basic Elevator class with position/direction, simple nearest dispatch, basic up/down movement. Edge cases like invalid floors handled.",
                  "Mid-level: Clean SCAN behavior (continue-then-reverse) with minimal hints. Direction-aware stopping. Clean IDLE/UP/DOWN state transitions. Organized code separating controller coordination from elevator movement.",
                  "Senior: Ask simulation vs. hardware upfront. Tight entity design. Direction-aware Request class. Proactively mention dispatch limitations. Discuss tradeoffs (immediate dispatch vs. queue, Set<Integer> vs. Set<Request>). Sketch express elevators without restructuring.",
                ],
              },
            },
            {
              id: "d14",
              type: "quote",
              content:
                "Senior candidates produce a design that demonstrates real systems thinking. They ask the simulation vs. hardware question upfront, proactively mention limitations of their dispatch algorithm, and can sketch extensibility without fundamentally restructuring existing classes.",
            },
          ],
          readingTime: 7,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "Why Request needs to be a class, not just a floor number",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In the elevator system design, why is Request modeled as a class with (floor, type) rather than just storing floor numbers as integers?",
        explanation:
          "With just floor numbers, Request(7) is the same whether someone pressed UP or DOWN on floor 7. An elevator going UP would stop at floor 7 for a DOWN passenger — wrong direction. With Request(floor, type), Request(7, PICKUP_UP) ≠ Request(7, PICKUP_DOWN), enabling direction-aware stopping. The elevator passes floor 7 going UP and picks up the DOWN passenger on the return trip.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "To enable direction-aware stopping — the elevator can distinguish between UP and DOWN hall calls at the same floor",
              isCorrect: true,
            },
            {
              id: "b",
              text: "To support priority queuing so VIP passengers are served first",
              isCorrect: false,
            },
            {
              id: "c",
              text: "To track which passenger made each request for billing purposes",
              isCorrect: false,
            },
            {
              id: "d",
              text: "To implement the Observer pattern for notifying passengers when the elevator arrives",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Purpose of the IDLE direction state",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "Why does the Direction enum include an IDLE state in addition to UP and DOWN?",
        explanation:
          'IDLE explicitly represents "not moving." Without it, an elevator with no requests would still have a direction (UP or DOWN) and the movement logic would keep drifting. IDLE prevents the elevator from moving when there are no requests and allows step() to handle the "no work to do" case cleanly.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: 'To represent "not moving" when the elevator has no requests, preventing drift in the movement logic',
              isCorrect: true,
            },
            {
              id: "b",
              text: "To indicate the elevator doors are open and passengers are boarding",
              isCorrect: false,
            },
            {
              id: "c",
              text: "To signal that the elevator is undergoing maintenance and should not accept requests",
              isCorrect: false,
            },
            {
              id: "d",
              text: "To optimize energy consumption by shutting down the motor between requests",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Where dispatch logic belongs in the class design",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In the elevator system design, which class should contain the logic for deciding which elevator handles a hall call?",
        explanation:
          "ElevatorController is the orchestrator that has a system-wide view of all elevators. It receives hall calls and dispatches to the best elevator. Individual Elevator instances don't know about each other and shouldn't make system-level decisions. Putting dispatch logic in Elevator would violate the Single Responsibility Principle and couple elevators to each other.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "ElevatorController — it has the system-wide view needed to compare all elevators",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Elevator — each elevator should decide whether it can handle the request",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Request — the request should find the best elevator using a callback",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A separate DispatchService class that both controller and elevator depend on",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "SCAN algorithm behavior at floor boundaries",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "An elevator at floor 9 going UP has requests at floors 7 and 3. What happens on the next step() call?",
        explanation:
          'hasRequestsAhead(UP) returns false because no requests are above floor 9. The elevator reverses to DOWN and returns without moving. On the next tick, it checks for stops at floor 9 (none), confirms hasRequestsAhead(DOWN) is true (floors 7 and 3 are below), and moves to floor 8. Boundary handling falls out naturally from hasRequestsAhead() — no explicit "if floor == 9" check needed.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "It reverses to DOWN (no requests ahead going UP) but does not move this tick",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It stays at floor 9 and sets direction to IDLE since it cannot go higher",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It immediately moves down to floor 8 and reverses direction in the same tick",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It stops at floor 9 and removes all requests since they are in the opposite direction",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Why the elevator does not move on a stop tick",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In the SCAN algorithm's step() implementation, why does the elevator return immediately after stopping at a floor (Case 3) instead of also moving one floor?",
        explanation:
          "If the elevator stopped and moved in the same tick, it would skip the stopping action from the caller's perspective — passengers need time to board. More critically, after removing a request, the elevator might need to reverse (if no requests ahead), which Case 4 handles on the next tick. Moving and reversing in the same tick creates race conditions in the state machine. Each tick should perform exactly one action: stop, reverse, or move.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Each tick should perform exactly one action — stopping and moving in the same tick creates state machine bugs and skips reversal checks",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Moving after stopping would exceed the physical speed limit of the elevator motor",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The step function must maintain O(1) time complexity by limiting to one operation per call",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It allows the controller to check if other elevators need to be reassigned during the stop",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Nearest dispatch flaw with request queue",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "An elevator is at floor 3 going UP with a single stop at floor 4. A hall call comes from floor 7 (UP). The basic direction-aware dispatch selects this elevator because it's going UP and below floor 7. Why is this a bad dispatch decision?",
        explanation:
          "The elevator's only queued stop is at floor 4. After reaching floor 4, hasRequestsAhead(UP) returns false, so it reverses to DOWN. It never reaches floor 7 on this sweep. The hall call gets added, but the elevator must go 4→reverse→back up to 7, creating unnecessary delay. The fix is hasRequestsAtOrBeyond() which checks if existing requests will actually take the elevator past the requested floor.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The elevator will reverse at floor 4 before reaching floor 7 — its existing requests do not extend to the requested floor",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The elevator cannot handle more than one request at a time while moving",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Floor 7 is outside the elevator's service zone in a multi-zone building",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The SCAN algorithm does not support adding new requests while the elevator is in motion",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Why hasRequestsAhead checks ALL request types",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In the SCAN implementation, hasRequestsAhead(direction) checks for ANY request in the given direction, regardless of RequestType. The stopping logic (Case 3) only stops for direction-matching pickups and destinations. Why is this asymmetry correct?",
        explanation:
          "Stopping is direction-aware: only stop for passengers going your direction (PICKUP_UP when going UP). But traveling must consider ALL requests because even a PICKUP_DOWN ahead of us requires the elevator to travel past that floor. Example: elevator at floor 4 going UP with Request(6, PICKUP_DOWN) and Request(8, DESTINATION). It must travel past floor 6 (without stopping) to reach floor 8. If hasRequestsAhead only checked matching types, it would reverse at floor 4 (no PICKUP_UP or DESTINATION ahead in the UP direction would be wrong if only checking those types) and never reach floor 8.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Traveling must consider all requests to avoid premature reversal, but stopping should only serve passengers going the elevator's direction",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It is a performance optimization — checking all types is faster than filtering by direction",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The elevator should actually stop for all request types in its direction — the asymmetry is a design flaw",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It prevents the elevator from going IDLE when there are still unserved requests in either direction",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Why not share an interface between controller and elevator requests",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'ElevatorController.requestElevator(floor, type) and Elevator.addRequest(request) both accept floor/type parameters and "add a request." A candidate proposes extracting a shared IRequestHandler interface. Why is this a design trap?',
        explanation:
          "These methods perform fundamentally different operations: requestElevator is a coordination operation (picks which elevator, cross-elevator decision) while addRequest is a simple state mutation (adds to one elevator's set). The controller is not a type of elevator, and they're never used interchangeably (no polymorphism). Forcing a shared interface creates a false abstraction — just because two methods accept similar parameters doesn't mean they share behavior. Interfaces should represent substitutable implementations, not parameter similarity.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "They perform fundamentally different operations (coordination vs. state mutation) with no polymorphic substitution — interfaces should represent substitutable behavior",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The controller needs access to private elevator state, which an interface would hide",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Interfaces add runtime overhead from virtual dispatch that would slow down the simulation",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The Request class already serves as the shared contract, making an additional interface redundant",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Entities that should be classes in the elevator design",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "In the elevator system LLD, which of the following should be modeled as classes (not just primitives)? Select ALL that apply.",
        explanation:
          "Elevator maintains state (floor, direction, requests) and has behavior (step, addRequest). ElevatorController coordinates dispatch and time advancement. Request holds floor + type with custom equality semantics. Floor is just an integer — it has no state or behavior. Direction is best modeled as an enum, not a class, since it has no instance-level state.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Elevator — maintains position, direction, and request queue state",
              isCorrect: true,
            },
            {
              id: "b",
              text: "ElevatorController — coordinates dispatch and system-wide tick advancement",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Request — stores floor + type with custom equals/hashCode",
              isCorrect: true,
            },
            { id: "d", text: "Floor — represents a position in the building", isCorrect: false },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Correct behaviors when elevator stops at a floor",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "An elevator going UP arrives at floor 7. Which of the following requests at floor 7 should be removed (serviced) in this tick? Select ALL that apply.",
        explanation:
          "When going UP, the elevator services PICKUP_UP requests (passengers wanting to go up — same direction) and DESTINATION requests (passengers inside who pressed floor 7 — direction doesn't matter). PICKUP_DOWN requests at floor 7 are NOT serviced — those passengers want to go down and should wait for the elevator's return trip. This is the core of direction-aware stopping.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Request(7, PICKUP_UP) — passenger wants to go up, matches elevator direction",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Request(7, DESTINATION) — passenger inside pressed floor 7, direction irrelevant",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Request(7, PICKUP_DOWN) — passenger wants to go down, will be served on return trip",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Valid concurrency solutions for elevator system",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "When adding concurrency support to the elevator system, which approaches correctly handle simultaneous hall calls and step() execution? Select ALL valid solutions.",
        explanation:
          "A shared lock around both requestElevator and step prevents concurrent access to the elevator's request set. A concurrent queue (pendingRequests) separates writers from the step loop — addRequest writes to a thread-safe queue, and step drains it into the working set at the start of each tick. Using a ConcurrentHashSet is insufficient because the dispatch logic needs atomic select-then-add (two operations), not just thread-safe individual operations. Making Elevator immutable would mean creating new elevator objects on every tick, which is impractical.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Lock-based: same lock around requestElevator() and step()",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Concurrent queue: addRequest writes to a thread-safe queue, step() drains it at tick start",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Use a ConcurrentHashSet for requests — thread-safe collections solve everything",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Make Elevator immutable and create new instances on each tick",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Cases where SCAN outperforms nearest-first",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "In which scenarios does the SCAN algorithm outperform the nearest-first approach? Select ALL that apply.",
        explanation:
          "SCAN excels in busy buildings with constant requests because it naturally batches stops in one direction, preventing thrashing. Passengers see predictable behavior — the elevator sweeps in one direction before reversing. Multiple nearby requests in the same direction are efficiently served in a single sweep. However, for a building with only one request at a time, nearest-first and SCAN produce identical behavior — both go directly to the single request.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Busy buildings with continuous concurrent requests — SCAN prevents direction thrashing",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Passenger perception — predictable sweep behavior is less confusing than direction changes",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Multiple requests clustered in the same direction — SCAN serves them in a single sweep",
              isCorrect: true,
            },
            {
              id: "d",
              text: "A building with only one request at a time — both algorithms behave identically",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Compare Set<Integer> vs Set<Request> for elevator stops",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare using Set<Integer> (just floor numbers) versus Set<Request> (floor + type) for storing elevator stops. Describe a concrete scenario where Set<Integer> produces incorrect behavior and explain how Set<Request> fixes it.",
        explanation:
          "A strong answer describes the floor 7 scenario: elevator going UP with stop at floor 7, person on floor 7 presses DOWN. With Set<Integer>, floor 7 is already in the set. Elevator stops going UP, person boards wrong direction. With Set<Request>, Request(7, PICKUP_UP) and Request(7, PICKUP_DOWN) are distinct. Elevator passes floor 7 going UP, reverses at top, picks up DOWN passenger correctly.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Set<Integer> stores which floors to visit without tracking why. This creates a direction-aware stopping bug.\n\nConcrete scenario: Elevator at floor 5 going UP with requests = {7, 8}. Someone on floor 7 presses DOWN. With Set<Integer>, we call requests.add(7) — but 7 is already there, so nothing changes. When the elevator reaches floor 7 going UP, it stops. The person waiting to go DOWN sees an UP elevator and faces an awkward choice: board and ride the wrong way, or wait.\n\nWith Set<Request>: requests = {Request(7, PICKUP_UP), Request(8, DESTINATION)}. Adding Request(7, PICKUP_DOWN) creates a distinct entry because equals() compares both floor AND type. When the elevator reaches floor 7 going UP, step() checks for Request(7, PICKUP_UP) — found, removed. It does NOT check Request(7, PICKUP_DOWN). That request survives. The elevator continues to 8, reverses to DOWN, returns to floor 7, and now finds Request(7, PICKUP_DOWN) — stops correctly.\n\nThe tradeoff is slight additional complexity (a new class, equals/hashCode), but the benefit — correct directional behavior — is essential for any non-trivial elevator system.",
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain the SCAN algorithm step-by-step with a scenario",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "An elevator is at floor 5 going UP with requests: Request(3, PICKUP_DOWN), Request(7, PICKUP_UP), and Request(8, DESTINATION). Trace the SCAN algorithm tick-by-tick until all requests are serviced. For each tick, state: currentFloor, direction, action taken, and remaining requests.",
        explanation:
          "A strong answer traces: Tick 0: floor 5 UP, move up. Tick 1: floor 6 UP, move up. Tick 2: floor 7 UP, stop for PICKUP_UP, remove it. Tick 3: floor 7 UP, move up. Tick 4: floor 8 UP, stop for DESTINATION, remove it. Then reverse, sweep down to floor 3 for PICKUP_DOWN. Must show that floor 3 is NOT serviced on the way up because it's a PICKUP_DOWN.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Initial state: currentFloor=5, direction=UP, requests={Request(3, PICKUP_DOWN), Request(7, PICKUP_UP), Request(8, DESTINATION)}\n\nTick 0: Floor 5, UP. Not at a stop (no PICKUP_UP or DESTINATION at 5). hasRequestsAhead(UP)? Yes (7, 8). Move up.\nTick 1: Floor 6, UP. Not at a stop. Move up.\nTick 2: Floor 7, UP. Check Request(7, PICKUP_UP) — found! Remove it. Requests = {Request(3, PICKUP_DOWN), Request(8, DESTINATION)}. Return (don't move on stop tick).\nTick 3: Floor 7, UP. Not at a stop. hasRequestsAhead(UP)? Yes (floor 8). Move up.\nTick 4: Floor 8, UP. Check Request(8, DESTINATION) — found! Remove it. Requests = {Request(3, PICKUP_DOWN)}. Still have requests, stay UP? No — hasRequestsAhead(UP) is false. But we're in Case 3 (stopped), so direction isn't changed here. Return.\nTick 5: Floor 8, UP. Not at a stop. hasRequestsAhead(UP)? No. Reverse to DOWN. Return.\nTick 6: Floor 8, DOWN. Not at a stop (no PICKUP_DOWN or DESTINATION at 8). Move down.\nTick 7: Floor 7, DOWN. Not at a stop. Move down.\n...continues moving down...\nTick 10: Floor 4, DOWN. Move down.\nTick 11: Floor 3, DOWN. Check Request(3, PICKUP_DOWN) — found! Remove it. Requests = {}. Go IDLE. Return.\n\nKey observation: Request(3, PICKUP_DOWN) was NOT serviced on the upward sweep even though the elevator started at floor 5 and floor 3 is below. The SCAN algorithm correctly continued UP first, sweeping through 7 and 8, then reversed and served floor 3 on the way DOWN.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design express elevator extension without restructuring",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'The interviewer asks: "How would you add an express elevator that only stops at floors 0, 5, and 9?" Describe the class changes needed. Explain which classes change and which stay the same, and why this demonstrates good design.',
        explanation:
          "A strong answer shows minimal changes: add isExpress flag and expressFloors set to Elevator, modify addRequest to reject non-express floors, modify controller dispatch to prefer the express elevator for express floors. Request class does NOT change. step() does NOT change. This demonstrates OCP and encapsulation — the core movement algorithm is untouched because validation was already separated in addRequest().",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Changes needed:\n\n1. Elevator class additions:\n   - Add isExpress: boolean flag\n   - Add expressFloors: Set<int> = {0, 5, 9}\n   - Modify addRequest(): if isExpress && !expressFloors.contains(request.floor), return false\n\n2. ElevatorController changes:\n   - Track which elevator is express: expressElevator reference\n   - Modify selectBestElevator(): if request floor is in {0, 5, 9} and expressElevator is IDLE, dispatch to it; otherwise fall through to normal selection\n\n3. Unchanged classes:\n   - Request: still stores floor + type, no express concept needed\n   - Elevator.step(): movement algorithm is unchanged — the express elevator moves the same way, it just accepts fewer floors\n   - All enums (Direction, RequestType): no changes\n\nWhy this shows good design:\n- The validation happens in addRequest(), which is the natural boundary for \"should I accept this floor?\" The movement logic in step() never knew about floor validity — it trusts the request set contains only valid stops.\n- The Request class is a data carrier with no knowledge of elevator types. It shouldn't need to know about express floors.\n- ElevatorController's dispatch logic gains a new priority tier but doesn't change its structure.\n- This is the Open-Closed Principle in action: we extend behavior by adding new state and a check, without modifying existing algorithms.",
          minLength: 150,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Compare FIFO, nearest-first, and SCAN movement algorithms",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Compare the three elevator movement algorithms (FIFO, nearest-first, and SCAN) using this scenario: elevator at floor 5, requests at floors 8, 3, and 7. Analyze total floors traveled, number of direction changes, and passenger experience for each algorithm. Which would you recommend and why?",
        explanation:
          "A strong answer calculates: FIFO: 5→8→3→7 = 12 floors, 2 reversals. Nearest: 5→3→7→8 = 7 floors, 1 reversal. SCAN (going UP): 5→7→8→3 = 8 floors, 1 reversal. Should argue SCAN is best despite traveling 1 more floor than nearest because of predictable behavior and less passenger confusion. Should mention SCAN's advantage in busy buildings with continuous requests.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Scenario: Elevator at floor 5, requests at floors 8, 3, 7.\n\n**FIFO (arrival order: 8, 3, 7):**\n- Path: 5→6→7→8 (stop) → 7→6→5→4→3 (stop) → 4→5→6→7 (stop)\n- Total: 3 up + 5 down + 4 up = 12 floors\n- Direction changes: 2 (UP→DOWN→UP)\n- Passenger experience: Terrible. Person at floor 7 watches the elevator go to 8, come all the way down to 3, then back up. Feels random.\n\n**Nearest-first:**\n- From 5, nearest is 3 (2 away). Then from 3, nearest is 7 (4 away). Then 8 (1 away).\n- Path: 5→4→3 (stop) → 4→5→6→7 (stop) → 8 (stop)\n- Total: 2 down + 4 up + 1 up = 7 floors\n- Direction changes: 1 (DOWN→UP)\n- Passenger experience: Better distance, but person at floor 7 sees the elevator go down to 3 first even though floor 7 is directly above.\n\n**SCAN (currently going UP):**\n- Continue UP: 5→6→7 (stop) → 8 (stop). No requests ahead, reverse.\n- Continue DOWN: 8→7→6→5→4→3 (stop).\n- Total: 3 up + 5 down = 8 floors\n- Direction changes: 1 (UP→DOWN)\n- Passenger experience: Best. Person at floor 7 sees the elevator coming toward them and it arrives. Predictable sweep behavior.\n\n**Recommendation: SCAN.** Despite traveling 1 more floor than nearest-first, SCAN provides predictable behavior that matches passenger intuition. In busy buildings with continuous requests, SCAN prevents thrashing (bouncing between nearby floors) and naturally batches stops. This is why real elevator systems and disk scheduling algorithms use SCAN.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Handle concurrent hall calls in the elevator system",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "The current elevator simulation is single-threaded. If we need to support concurrent hall calls in a real system, describe the two main concurrency problems that arise and propose two different solutions with their tradeoffs.",
        explanation:
          "A strong answer identifies: (1) race condition in dispatch — two calls see the same idle elevator and both dispatch to it, and (2) concurrent modification — step() iterating requests while addRequest modifies the set. Solutions: lock-based (simple but blocks, contention) and concurrent queue (no contention but adds a drain step). Should discuss tradeoffs clearly.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Two concurrency problems:\n\n**Problem 1: Dispatch race condition.** Two hall calls arrive simultaneously. Both call selectBestElevator(), both see the same idle elevator, both dispatch to it. The select + add operation is not atomic — a classic TOCTOU (time-of-check-to-time-of-use) bug.\n\n**Problem 2: Concurrent modification.** step() iterates over the requests set removing entries, while addRequest() is adding to the same set. In Java, this throws ConcurrentModificationException. In other languages, it causes undefined behavior or missed/duplicate entries.\n\n**Solution 1: Lock-based.**\nAcquire the same lock around both requestElevator() and step(). Simple and correct — no concurrent access to any shared state.\n- Tradeoff: Hall calls block while step() runs and vice versa. In a real building with 3 elevators and moderate traffic, this contention is negligible. But in a high-traffic skyscraper with 50 elevators, lock contention could become a bottleneck.\n\n**Solution 2: Concurrent queue.**\naddRequest() writes to a thread-safe queue (BlockingQueue in Java, Queue in Python). At the start of each tick, step() drains the queue into the working set. Writers only touch the queue; step() only touches the set.\n- Tradeoff: More elegant — zero contention between hall calls and step(). But adds complexity: a two-phase data structure and the drain step. Also, requests submitted mid-tick are delayed until the next tick.\n\n**Recommendation:** Start with the lock approach. It's simpler to implement and debug. Only switch to the concurrent queue if profiling shows lock contention is actually a problem — premature optimization is the root of all evil.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Justify simulation vs. hardware control architecture",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the difference between a simulation-based elevator system (with step/tick) and actual elevator control software. Why do LLD interviews almost always use the simulation model? What key question should you ask the interviewer, and what does it signal about your seniority?",
        explanation:
          'A strong answer distinguishes simulation (step() controls time, deterministic, testable) from hardware (motor controllers, floor sensors, asynchronous callbacks). Should mention why simulation is preferred in interviews: tractable in 35 minutes, testable, focuses on algorithms not hardware. Asking "simulation or control software?" signals understanding of the distinction — a senior/staff insight.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "**Simulation model:** Time advances via an explicit step() function. Each call represents one unit of time. The code directly increments currentFloor, checks conditions, and updates state deterministically. No hardware interaction — everything is synchronous and predictable.\n\n**Hardware control model:** Motor controllers physically move the car. Floor sensors fire interrupts on arrival (onFloorReached(floor) callbacks). Control flow is asynchronous, driven by hardware events. You'd see event handlers, state machines with timeouts, and safety interlocks. No step() function — time is real.\n\n**Why interviews use simulation:**\n1. Tractable in 35 minutes: Hardware involves motor control, sensor calibration, and safety systems that are irrelevant to OOP design.\n2. Deterministic and testable: Same inputs always produce the same outputs. You can verify behavior tick by tick.\n3. Focus on algorithms: The interesting part is dispatch strategy and movement logic, not interrupt handling.\n4. Common pattern: Elevators, parking lots, vending machines, traffic lights — all use the same simulation pattern in interviews.\n\n**The key question:** \"Are we building a simulation where I control time with step(), or modeling actual control software that interfaces with hardware?\"\n\n**What it signals:** This question shows you understand the distinction between simulation and control software — that real elevators don't have a step() function, they have motor controllers and sensor interrupts. Nine times out of ten, the interviewer wants simulation, and you can confidently focus on object modeling. But asking demonstrates senior-level awareness of the design space and prevents going down the wrong path. It's one of the highest-signal clarifying questions you can ask in this type of LLD interview.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Name the movement algorithm used in elevator systems",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What is the name of the elevator movement algorithm that continues in the current direction until no more stops remain, then reverses? This algorithm is also used in a well-known area of operating systems.",
        explanation:
          "The SCAN algorithm (also called the Elevator algorithm) continues in one direction servicing all stops, then reverses when no stops remain ahead. It's famously used in disk scheduling — the disk head sweeps in one direction across the platter, servicing I/O requests, then reverses. The elevator problem is literally the namesake of this disk scheduling algorithm.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "SCAN (also used in disk scheduling / disk I/O scheduling)",
          acceptableAnswers: [
            "SCAN",
            "scan",
            "elevator algorithm",
            "SCAN algorithm",
            "disk scheduling",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "What design pattern fits swappable dispatch strategies",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "If different buildings need different elevator dispatch strategies (minimize wait time, minimize energy, etc.), which design pattern would you use to make the selectBestElevator() logic swappable?",
        explanation:
          "The Strategy pattern encapsulates each dispatch algorithm (nearest, direction-aware, energy-efficient) behind a common interface. The ElevatorController holds a reference to the strategy and delegates selectBestElevator() calls to it. New strategies can be added without modifying the controller.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Strategy pattern",
          acceptableAnswers: ["strategy", "Strategy", "strategy pattern", "Strategy Pattern"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Explain why boundary floor checks are unnecessary",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'Why is adding explicit boundary checks like "if currentFloor == 9 then direction = DOWN" a bug, not a feature? What mechanism handles floor boundaries correctly in the SCAN implementation?',
        explanation:
          "Explicit boundary checks create a bug: if the elevator is at floor 9 going UP with a valid stop at floor 9 itself, the forced reversal would bypass the stop check. hasRequestsAhead() handles boundaries naturally — at floor 9 going UP, it returns false (nothing above 9), triggering a reversal through Case 4. This handles all boundary cases without special-casing, and the stop check (Case 3) runs before the reversal check (Case 4).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "hasRequestsAhead() handles boundaries naturally — at floor 9 going UP, it returns false, triggering reversal. Explicit checks would bypass the stop check at boundary floors.",
          acceptableAnswers: [
            "hasRequestsAhead",
            "no requests ahead",
            "naturally",
            "bypass stop check",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Identify the concurrency bug in dispatch",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Two hall calls arrive simultaneously. Both call selectBestElevator() and both see the same idle elevator. Both dispatch to it. Name the class of concurrency bug this represents and the atomicity requirement it reveals.",
        explanation:
          "This is a TOCTOU (Time-of-Check-to-Time-of-Use) bug. The check (select best elevator) and the use (add request to it) are not atomic. Between the check and the add, another thread can make the same selection. The fix is making select + add atomic — either with a lock or by using a concurrent queue that drains at tick boundaries.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "TOCTOU (Time-of-Check-to-Time-of-Use) — the select and add operations must be atomic.",
          acceptableAnswers: [
            "TOCTOU",
            "time of check time of use",
            "time-of-check-to-time-of-use",
            "race condition",
            "check-then-act",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match elevator entities to their responsibilities",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each entity in the elevator system to its primary responsibility:",
        explanation:
          "ElevatorController is the orchestrator that dispatches hall calls and advances time. Elevator encapsulates movement logic and its own request queue. Request stores floor + type enabling direction-aware stopping. Direction is an enum representing the elevator's movement state (UP, DOWN, IDLE).",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "ElevatorController",
              right: "Dispatches hall calls to elevators and advances system time via step()",
            },
            {
              id: "p2",
              left: "Elevator",
              right: "Maintains position, direction, and request queue; executes movement logic",
            },
            {
              id: "p3",
              left: "Request",
              right: "Stores floor + type (PICKUP_UP/DOWN, DESTINATION) with custom equality",
            },
            {
              id: "p4",
              left: "Direction enum",
              right: "Represents movement state: UP, DOWN, or IDLE",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match movement algorithms to their primary weakness",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each elevator movement algorithm to its primary weakness:",
        explanation:
          'FIFO causes constant direction changes because it services requests in arrival order regardless of position. Nearest-first avoids some direction changes but still creates unpredictable behavior — passengers see the elevator go the "wrong way" before coming to them. SCAN is optimal for multi-request scenarios but may travel more total distance than nearest-first for small request sets. Nearest dispatch (ignoring direction) sends elevators to nearby but wrong-direction callers.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "FIFO movement",
              right: "Constant direction changes — bounces between distant floors",
            },
            {
              id: "p2",
              left: "Nearest-first movement",
              right:
                "Unpredictable direction changes — passengers see elevator go the wrong way first",
            },
            {
              id: "p3",
              left: "SCAN movement",
              right: "May travel more total distance than nearest-first for small request sets",
            },
            {
              id: "p4",
              left: "Nearest dispatch (no direction)",
              right: "Sends elevator going the wrong direction past the caller",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match step() cases to the problems they prevent",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each case in the SCAN step() implementation to the bug it prevents:",
        explanation:
          "Case 1 (empty requests → IDLE) prevents drift: without it, an idle elevator falls through to movement logic and keeps moving. Case 2 (IDLE → pick direction) prevents the elevator from checking for stops without knowing which direction it's going — pickup type depends on direction. Case 3 (return after stop) prevents moving on the same tick as stopping, which would skip reversal checks. Case 4 (reverse when no requests ahead) prevents the elevator from overshooting past all its remaining requests.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Case 1: Empty requests → IDLE",
              right: "Prevents idle elevator from drifting in its last direction",
            },
            {
              id: "p2",
              left: "Case 2: IDLE → pick direction",
              right:
                "Prevents stop-check from running without knowing which pickup type to look for",
            },
            {
              id: "p3",
              left: "Case 3: Return after stopping",
              right: "Prevents moving and stopping in the same tick, which skips reversal logic",
            },
            {
              id: "p4",
              left: "Case 4: Reverse when no requests ahead",
              right: "Prevents elevator from overshooting past all remaining requests",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Elevator Request types",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The RequestType enum has three values: _____ for hall calls going up, _____ for hall calls going down, and DESTINATION for buttons pressed inside the elevator.",
        explanation:
          "PICKUP_UP represents a hall call from someone wanting to go up. PICKUP_DOWN represents a hall call from someone wanting to go down. DESTINATION represents a floor button pressed inside the elevator — it has no direction because the elevator stops regardless of which way it's going.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The RequestType enum has three values: {{blank1}} for hall calls going up, {{blank2}} for hall calls going down, and DESTINATION for buttons pressed inside the elevator.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "PICKUP_UP",
              acceptableAnswers: ["PICKUP_UP", "pickup_up", "PickupUp"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "PICKUP_DOWN",
              acceptableAnswers: ["PICKUP_DOWN", "pickup_down", "PickupDown"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Elevator initial state",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content: "All elevators start at floor _____ with direction set to _____.",
        explanation:
          "Elevators initialize at floor 0 (ground floor) with direction IDLE. Starting at floor 0 is the convention for the ground floor. IDLE means the elevator has no requests and is not moving in any direction.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "All elevators start at floor {{blank1}} with direction set to {{blank2}}.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "0",
              acceptableAnswers: ["0", "zero", "ground floor"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "IDLE",
              acceptableAnswers: ["IDLE", "idle"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Request equality semantics",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "The Request class implements equals() and hashCode() based on both _____ and _____, so that Request(7, PICKUP_UP) and Request(7, PICKUP_DOWN) are stored as distinct entries in a HashSet.",
        explanation:
          "Request equality is based on floor AND type (RequestType). If equals() only compared floor, all requests for the same floor would be considered identical regardless of direction, breaking direction-aware stopping. Both fields must be included in hashCode() as well for correct Set/Map behavior.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "The Request class implements equals() and hashCode() based on both {{blank1}} and {{blank2}}, so that Request(7, PICKUP_UP) and Request(7, PICKUP_DOWN) are stored as distinct entries in a HashSet.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "floor",
              acceptableAnswers: ["floor", "floor number"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "type",
              acceptableAnswers: ["type", "RequestType", "request type"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
