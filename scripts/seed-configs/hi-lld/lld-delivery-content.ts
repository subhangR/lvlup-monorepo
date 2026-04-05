/**
 * LLD Delivery Framework — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: the 5-phase LLD interview framework — requirements gathering,
 * entity identification, class design, implementation, and extensibility
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldDeliveryContent: StoryPointSeed = {
  title: "LLD Interview Delivery Framework",
  description:
    "Master the step-by-step framework for structuring your low-level design interview — from requirements clarification through entity identification, class design, implementation, and extensibility discussions.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements & Entity Identification
    {
      title: "Phase 1-2: Requirements & Entity Identification",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Phase 1-2: Requirements & Entity Identification",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "The LLD Interview Framework",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Low-level design interviews move fast. You have roughly thirty-five minutes to clarify requirements, define your object model, design class APIs, and walk through the core logic. The failure modes are predictable: some candidates dive straight into code and get bogged down in edge cases, while others spend too long on setup and run out of time before showing meaningful design. A structured delivery framework solves both problems by giving you a clear sequence and pacing.",
            },
            {
              id: "b3",
              type: "heading",
              content: "The Five Phases",
              metadata: { level: 3 },
            },
            {
              id: "b4",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Requirements (~5 minutes) — Turn the minimal prompt into a clear spec.",
                  "Entities and Relationships (~3 minutes) — Identify core objects and their ownership.",
                  "Class Design (~10-15 minutes) — Define state and behavior for each entity.",
                  "Implementation (~10 minutes) — Pseudo-code the key methods.",
                  "Extensibility (~5 minutes) — Show your design handles extensions cleanly.",
                ],
              },
            },
            {
              id: "b5",
              type: "heading",
              content: "Phase 1: Requirements (~5 minutes)",
              metadata: { level: 2 },
            },
            {
              id: "b6",
              type: "paragraph",
              content:
                'Every LLD interview begins with an intentionally minimal prompt like "Design Tic Tac Toe" or "Design a parking lot system." Your job is to turn this into a spec you can design around. Spend the first few minutes asking structured questions across four themes to make the prompt unambiguous.',
            },
            {
              id: "b7",
              type: "heading",
              content: "The Four Requirement Themes",
              metadata: { level: 3 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Primary capabilities — What operations must this system support?",
                  "Rules and completion — What conditions define success, failure, or state transitions?",
                  "Error handling — How should the system respond when inputs or actions are invalid?",
                  "Scope boundaries — What is in scope (core logic, business rules) and what is out (UI, storage, networking, concurrency)?",
                ],
              },
            },
            {
              id: "b9",
              type: "paragraph",
              content:
                "Use your answers to form a clear spec that you confirm with your interviewer. If you identify areas explicitly out of scope, write those down too — it prevents scope creep and shows mature engineering thinking.",
            },
            {
              id: "b10",
              type: "code",
              content:
                "Example Requirements (Tic Tac Toe):\n1. Two players alternate placing X and O on a 3x3 grid.\n2. A player wins by completing a row, column, or diagonal.\n3. The game ends in a draw if all nine cells are filled with no winner.\n4. Invalid moves should be rejected (occupied cell, game already over).\n5. System should provide game state queries and reset.\n\nOut of Scope:\n- UI/rendering layer\n- AI opponent or move suggestions\n- Networked multiplayer\n- Variable board sizes (NxN grids)\n- Undo/redo functionality",
              metadata: { language: "text" },
            },
            {
              id: "b11",
              type: "heading",
              content: "Phase 2: Entities and Relationships (~3 minutes)",
              metadata: { level: 2 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "Scan your requirements and pull out the meaningful nouns — these are candidate entities. Apply a simple filter: if something maintains changing state or enforces rules, it deserves to be its own entity. If it is just information attached to something else, it is probably just a field on another class.",
            },
            {
              id: "b13",
              type: "heading",
              content: "Defining Relationships",
              metadata: { level: 3 },
            },
            {
              id: "b14",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Which entity is the orchestrator — the one driving the main workflow?",
                  "Which entities own durable state?",
                  "How do they depend on each other? (has-a, uses, contains)",
                  "Where should specific rules logically live?",
                ],
              },
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "Don't overthink whiteboard notation. A simple list of entities with a few arrows showing ownership is more than enough. You are not drawing a full UML diagram — you are communicating structure that you can build on in the next phase. Simple boxes, arrows, and labels work fine.",
            },
            {
              id: "b16",
              type: "quote",
              content:
                "A common mistake is promoting every noun to an entity. Ask yourself: does this noun have its own behavior, or is it just data that lives on another entity? Not every noun in the prompt needs a dedicated class.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Class Design & Implementation
    {
      title: "Phase 3-4: Class Design & Implementation",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Phase 3-4: Class Design & Implementation",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Phase 3: Class Design (~10-15 minutes)",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "This is the heart of the interview. Turn each entity into a class outline by answering two questions: What does this class need to remember (state)? What does this class need to do (behavior)? Work top-down — start with the orchestrator, then move to supporting entities.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Deriving State From Requirements",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "For each entity, go back to your requirements list and ask: which requirements does this entity own? What information does it need to track to satisfy those responsibilities? Build a mental table mapping requirements to state fields.",
            },
            {
              id: "c5",
              type: "code",
              content:
                'Requirement → What Game must track:\n\n"Two players alternate placing X and O" → playerX, playerO, currentPlayer\n"Game ends when won or drawn"          → state (IN_PROGRESS, WON, DRAW), winner\n"Plays happen on a 3x3 grid"           → board: Board\n\nclass Game:\n  - board: Board\n  - playerX: Player\n  - playerO: Player\n  - currentPlayer: Player\n  - state: GameState (IN_PROGRESS, WON, DRAW)\n  - winner: Player? (null if no winner)',
              metadata: { language: "text" },
            },
            {
              id: "c6",
              type: "heading",
              content: "Deriving Behavior From Requirements",
              metadata: { level: 3 },
            },
            {
              id: "c7",
              type: "paragraph",
              content:
                "For each class, ask what operations the outside world needs and which requirements those operations satisfy. Aim for a small, focused API where each method corresponds to a real action or question implied by the problem.",
            },
            {
              id: "c8",
              type: "code",
              content:
                "Requirement → Method on Game:\n\nPlayers make moves     → makeMove(player, row, col) -> bool\nWhose turn is it?      → getCurrentPlayer() -> Player\nIs game over?          → getGameState() -> GameState\nWho won?               → getWinner() -> Player?\nShow the board         → getBoard() -> Board",
              metadata: { language: "text" },
            },
            {
              id: "c9",
              type: "heading",
              content: "The Encapsulation Principle",
              metadata: { level: 3 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                'Keep rules with the entity that owns the relevant state. This is "Tell, Don\'t Ask" — objects should manage their own state and expose behavior, not getters for callers to make decisions. Workflow rules (can this operation run?) belong in the orchestrator. Data-specific rules (is this cell occupied?) belong in the entity that owns that data.',
            },
            {
              id: "c11",
              type: "quote",
              content:
                "When something breaks, you know exactly which class to check. The orchestrator handles lifecycle and workflow. Supporting entities handle their own data validation. This separation keeps APIs small and makes the design predictable.",
            },
            {
              id: "c12",
              type: "heading",
              content: "Phase 4: Implementation (~10 minutes)",
              metadata: { level: 2 },
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                "Implement the major methods — the ones that truly define system behavior. Ask your interviewer what level of detail they prefer: pseudo-code (most common), near-complete code in a specific language, or a verbal walkthrough. Focus on the most interesting methods that show how classes cooperate, how state transitions occur, and how edge cases are handled.",
            },
            {
              id: "c14",
              type: "heading",
              content: "Happy Path First, Then Edge Cases",
              metadata: { level: 3 },
            },
            {
              id: "c15",
              type: "paragraph",
              content:
                "Start with the happy path — the normal flow when everything goes right. This makes the method's purpose and structure clear. Then enumerate failure modes: invalid inputs, illegal operations, out-of-range values, calls that violate the current system state.",
            },
            {
              id: "c16",
              type: "code",
              content:
                "makeMove(player, row, col)\n    // Edge cases first (guard clauses)\n    if state != IN_PROGRESS\n        return false\n    if player != currentPlayer\n        return false\n    if !board.canPlace(row, col)\n        return false\n\n    // Happy path\n    board.placeMark(row, col, player.mark)\n\n    // State transition logic\n    if board.checkWin(row, col, player.mark)\n        state = WON\n        winner = player\n    else if board.isFull()\n        state = DRAW\n    else\n        currentPlayer = (player == playerX) ? playerO : playerX\n\n    return true",
              metadata: { language: "text" },
            },
            {
              id: "c17",
              type: "heading",
              content: "Verification: Walk Through a Scenario",
              metadata: { level: 3 },
            },
            {
              id: "c18",
              type: "paragraph",
              content:
                "After implementing, take 1-2 minutes to trace through a concrete example. Pick a simple but non-trivial scenario and step through it tick by tick: initial state, what happens on each operation, how state changes, and where transitions fire. This catches logical errors before the interviewer finds them and demonstrates your ability to verify your own code.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Extensibility & Common Mistakes
    {
      title: "Phase 5: Extensibility & Interview Anti-Patterns",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Phase 5: Extensibility & Interview Anti-Patterns",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Phase 5: Extensibility (~5 minutes)",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "If time remains after your core implementation, the interview shifts to extensions. The interviewer proposes a twist — your job is to show how your design handles it without major restructuring. Stay high level: you are pointing to parts of your design that make the change clean, not rewriting code.",
            },
            {
              id: "d3",
              type: "heading",
              content: "How Extensions Vary by Level",
              metadata: { level: 3 },
            },
            {
              id: "d4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Junior candidates — may get little or no extensibility discussion.",
                  "Mid-level candidates — one or two small follow-ups.",
                  'Senior candidates — several "what if we…" questions testing design resilience.',
                ],
              },
            },
            {
              id: "d5",
              type: "heading",
              content: "Example: Adding Undo Functionality",
              metadata: { level: 3 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "\"All state transitions flow through a single action method — makeMove in this case. To add undo, I'd introduce a command history stack. Each successful action records the previous state before modifying anything. An undo() method pops the stack, reverts to that state, and the rest of the system doesn't need to change.\" This works because state mutations are isolated. The interviewer sees your design has clean boundaries.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Common LLD Interview Anti-Patterns",
              metadata: { level: 2 },
            },
            {
              id: "d8",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Diving into code without requirements — You build the wrong thing because you never clarified what the right thing was.",
                  "Over-engineering entities — Creating a class for every noun leads to a bloated object model. If it has no behavior, it should not be a class.",
                  "Skipping entity relationships — Going straight from requirements to code means your classes end up with tangled responsibilities.",
                  "Spending too long on setup — Perfectionist requirements or detailed UML diagrams eat into implementation time.",
                  "Ignoring edge cases in implementation — Happy path only does not demonstrate production thinking.",
                  "Forcing design patterns — Patterns like Singleton, Factory, Builder should emerge from the problem. Forcing them where they add no value is over-engineering.",
                  "Fighting the interviewer — If they redirect you, follow their lead. Gently guide back to ensure coverage, but do not resist.",
                ],
              },
            },
            {
              id: "d9",
              type: "heading",
              content: "UML: When (Not) to Use It",
              metadata: { level: 2 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "UML is outdated and rarely used in production systems. Engineers at modern companies design in code — they stub out classes, use interfaces in design reviews, or have AI fill in the details. Microsoft removed UML tooling from Visual Studio in 2016 because usage had dropped to zero. If an interviewer asks for UML, request whether simplified class notation is acceptable — it is faster to write and easier to discuss.",
            },
            {
              id: "d11",
              type: "heading",
              content: "What Separates Senior from Staff Answers",
              metadata: { level: 2 },
            },
            {
              id: "d12",
              type: "quote",
              content:
                "Staff-level candidates demonstrate clean encapsulation where rules live with the entity that owns the state. They proactively discuss extensibility during class design (not after), handle edge cases naturally within guard clauses, and verify their implementation by tracing through concrete scenarios without being prompted.",
            },
            {
              id: "d13",
              type: "heading",
              content: "Key Takeaways",
              metadata: { level: 2 },
            },
            {
              id: "d14",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "The framework is a guide, not a straitjacket — adapt to your interviewer's flow.",
                  "Anchor every design decision back to your requirements.",
                  "State belongs with the entity that owns it. Behavior belongs with the entity that has the data to execute it.",
                  "Derive state and behavior systematically — don't guess.",
                  "Show your work by tracing through scenarios.",
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "Time allocation for requirements phase",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In a 35-minute LLD interview, approximately how much time should you spend on the requirements phase?",
        explanation:
          "The requirements phase should take approximately 5 minutes. This is enough time to ask structured questions across the four themes (primary capabilities, rules and completion, error handling, scope boundaries) and form a clear spec. Spending more than 5 minutes risks eating into the critical class design and implementation phases.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "~5 minutes — enough to clarify the prompt into a spec without eating into design time",
              isCorrect: true,
            },
            {
              id: "b",
              text: "~10 minutes — you need exhaustive requirements before any design work",
              isCorrect: false,
            },
            {
              id: "c",
              text: "~2 minutes — just ask one or two quick questions and start coding",
              isCorrect: false,
            },
            {
              id: "d",
              text: "~15 minutes — requirements are the most important phase and deserve the most time",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Entity identification heuristic",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When identifying entities from your requirements, which heuristic best determines whether a noun should become its own class?",
        explanation:
          'The key filter is whether a noun maintains changing state or enforces rules. If it does, it deserves its own entity. If it is just information attached to something else, it is probably a field on another class. For example, in Amazon Locker, "Package" is not an entity because our system only cares about the package\'s size — a simple input parameter — while "Compartment" is an entity because it manages its own occupancy state.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "If it maintains changing state or enforces rules, it should be an entity",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Every noun in the requirements should become its own class",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Only nouns that appear more than once in the requirements should be entities",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Only nouns that represent physical objects should become entities",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Which phase gets the most time",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Which phase of the LLD delivery framework should receive the most interview time?",
        explanation:
          "Class Design receives 10-15 minutes — the most of any phase. This is the heart of the interview where you define state and behavior for each entity, demonstrate encapsulation, and show your design thinking. Implementation gets 10 minutes, while requirements (5 min), entities (3 min), and extensibility (5 min) get less time.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Class Design (~10-15 minutes)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Requirements (~5 minutes)",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Implementation (~10 minutes)",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Extensibility (~5 minutes)",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Where validation rules should live",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'In a Tic Tac Toe design, the rule "a player cannot place a mark on an occupied cell" is a data-specific rule. According to the encapsulation principle, which class should enforce this rule?',
        explanation:
          'Data-specific rules belong in the entity that owns the relevant data. The Board class owns the grid data, so it should enforce cell occupancy checks via a method like canPlace(row, col). The Game class (the orchestrator) calls board.canPlace() but does not inspect the grid directly. This is the "Tell, Don\'t Ask" principle — the Board manages its own state and exposes behavior, not raw data for callers to check.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Board — it owns the grid data, so it should enforce cell occupancy",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Game — the orchestrator should handle all validation logic",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Player — the player should check if their move is valid before submitting",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A separate Validator class — validation should be separated from business logic",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Orchestrator vs supporting entity responsibilities",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'In the framework, "workflow and lifecycle rules belong in the orchestrator" while "data-specific rules belong in the entity that owns that data." In a Parking Lot design, which class should enforce the rule "the parking lot is full and cannot accept more vehicles"?',
        explanation:
          'The ParkingLot is the orchestrator — it manages the overall workflow of vehicles entering and leaving. The "lot is full" rule is a workflow/lifecycle rule: it determines whether the enterVehicle operation can proceed. Individual spots know whether they are occupied (data-specific), but the lot-level capacity check is an orchestration concern.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "ParkingLot (orchestrator) — lot capacity is a workflow/lifecycle rule",
              isCorrect: true,
            },
            {
              id: "b",
              text: "ParkingSpot — each spot should know the total lot capacity",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Vehicle — the vehicle should check availability before entering",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A CapacityManager service — capacity rules need their own class",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Implementation order during class design",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When designing classes in an LLD interview, the framework recommends a specific order. Which approach is correct?",
        explanation:
          "The framework recommends working top-down: start with the orchestrator (the entity driving the main workflow), then move to supporting entities. This ensures the main flow is clear before you define the details. Starting with the orchestrator also helps you discover what the supporting entities need to provide, so you do not design them in isolation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Top-down: start with the orchestrator, then design supporting entities",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Bottom-up: start with the smallest entities and build up to the orchestrator",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Alphabetical order by class name for consistency",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Design all classes in parallel — state for all entities first, then behavior for all",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Tell Don't Ask principle applied",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "Consider an Elevator System design where the Elevator class has a currentFloor field. A candidate writes this code in the ElevatorController:\n\n```\nif elevator.getCurrentFloor() == targetFloor:\n    elevator.openDoors()\n```\n\nWhich design principle does this violate, and what is the correct approach?",
        explanation:
          'This violates "Tell, Don\'t Ask." The controller asks the elevator for its state (getCurrentFloor) and then makes a decision externally. The correct approach is to tell the elevator what to do: elevator.goToFloor(targetFloor) — the Elevator class internally handles the floor comparison, door opening, and state transitions. Objects should manage their own state and expose behavior, not getters for callers to make decisions.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Tell, Don't Ask — the controller should call elevator.goToFloor(targetFloor) and let the elevator manage its own state transitions",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Single Responsibility — the controller should not be responsible for door operations",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Open/Closed Principle — the controller should use an interface instead of calling methods directly",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Dependency Inversion — the controller should depend on an ElevatorInterface, not a concrete class",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Design pattern inclusion decision",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "The LLD delivery framework warns about a common pitfall with design patterns. A candidate designing a Coffee Machine creates a Singleton for the CoffeeMachine class, a Factory for creating different Beverage types, a Builder for configuring drink options, and an Observer to notify when the drink is ready — all in the initial design. What is the primary issue?",
        explanation:
          "The framework explicitly warns that candidates more often over-engineer by forcing patterns where they don't add value than miss patterns when they're required. Introducing four patterns upfront suggests pattern-first rather than problem-first thinking. A coffee machine likely needs the State pattern (for machine states) and possibly Factory (for beverages), but adding Builder and Observer before the requirements demand them adds complexity without value. Patterns should emerge from the problem, not be imposed on it.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Over-engineering — patterns should emerge from the problem, not be forced onto it. Most of these add complexity without solving actual requirements.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Under-engineering — four patterns is not enough; the candidate should also include Strategy and Decorator",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Wrong pattern choice — the candidate should use Strategy instead of Factory for beverages",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Incorrect Singleton usage — CoffeeMachine should not be a Singleton because there could be multiple machines",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Requirement clarification themes",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are among the four requirement clarification themes recommended by the LLD delivery framework? Select ALL that apply.",
        explanation:
          'The four themes are: (1) Primary capabilities — what operations the system must support, (2) Rules and completion — conditions for success, failure, or state transitions, (3) Error handling — how the system responds to invalid inputs, and (4) Scope boundaries — what is in scope vs. out of scope. "Performance requirements" and "Database design" are not part of the LLD requirement themes — performance is typically an HLD concern, and database design is explicitly out of scope for most LLD interviews.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Primary capabilities", isCorrect: true },
            { id: "b", text: "Rules and completion", isCorrect: true },
            { id: "c", text: "Error handling", isCorrect: true },
            { id: "d", text: "Scope boundaries", isCorrect: true },
            { id: "e", text: "Performance requirements", isCorrect: false },
            { id: "f", text: "Database schema design", isCorrect: false },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Entity relationship analysis questions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "When defining relationships between entities, which of the following questions should you answer? Select ALL that apply.",
        explanation:
          'All four are recommended by the framework: (1) identifying the orchestrator (which entity drives the workflow), (2) which entities own durable state, (3) dependency relationships (has-a, uses, contains), and (4) where specific rules should logically live. "How many instances exist" is an implementation detail, not a relationship concern. "Which entities need persistence" is a storage concern — typically out of scope for LLD.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Which entity is the orchestrator driving the main workflow?",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Which entities own durable state?",
              isCorrect: true,
            },
            {
              id: "c",
              text: "How do entities depend on each other (has-a, uses, contains)?",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Where should specific rules logically live?",
              isCorrect: true,
            },
            {
              id: "e",
              text: "How many instances of each entity will exist at runtime?",
              isCorrect: false,
            },
            {
              id: "f",
              text: "Which entities need database persistence?",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "What implementation should demonstrate",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "When selecting which methods to implement during the Implementation phase, you should pick methods that demonstrate which of the following? Select ALL that apply.",
        explanation:
          "The framework says to pick methods that show: (1) how classes cooperate — demonstrating the interaction between your entities, (2) how state transitions occur — showing lifecycle management, (3) how edge cases are handled — demonstrating production thinking, and (4) how logic is isolated in the right classes — proving your encapsulation decisions. Getter methods and constructor logic are typically trivial and don't demonstrate design skill.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "How classes cooperate with each other",
              isCorrect: true,
            },
            {
              id: "b",
              text: "How state transitions occur",
              isCorrect: true,
            },
            {
              id: "c",
              text: "How edge cases are handled cleanly",
              isCorrect: true,
            },
            {
              id: "d",
              text: "How logic is isolated in the right classes",
              isCorrect: true,
            },
            {
              id: "e",
              text: "How getter/setter methods are written",
              isCorrect: false,
            },
            {
              id: "f",
              text: "How constructors initialize default values",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Common LLD interview anti-patterns",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "A candidate is designing a Movie Ticket Booking system. They take the following actions:\n1. Skip requirements and immediately start listing classes\n2. Create separate classes for Movie, Theater, Screen, Show, Seat, Booking, User, Payment, Notification, Receipt, and Ticket\n3. Draw a detailed UML diagram with full cardinality notation\n4. Run out of time before implementing any methods\n\nWhich of these are anti-patterns identified by the LLD delivery framework? Select ALL that apply.",
        explanation:
          "Actions 1, 2, 3, and 4 are all anti-patterns: (1) Diving into code without requirements — you build the wrong thing. (2) Over-engineering entities — creating 11 classes means many (like Receipt, Notification) have no behavior in the core system and should be fields or out of scope. (3) Spending time on formal UML — the framework says UML is outdated and slows you down; simplified notation is sufficient. (4) Running out of time before implementation is the natural consequence of the previous anti-patterns. Not implementing any methods is a severe issue because the Implementation phase is where you demonstrate how your design actually works.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Skipping requirements and jumping into class listing",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Creating too many entities — many nouns (Receipt, Notification) have no behavior in the core system",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Spending time on detailed UML with formal notation instead of simple boxes and arrows",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Running out of time before implementing any methods",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Including Seat and Booking as entities — these should be fields on other classes",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Requirements spec for a Library System",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'You are given the LLD prompt: "Design a Library Management System." Using the four requirement themes from the delivery framework, write a complete requirements spec including both in-scope requirements and out-of-scope items. Explain your reasoning for scope decisions.',
        sampleAnswer:
          "Requirements:\n1. Primary Capabilities: Members can search books, check out available books, return books. Librarians can add/remove books and manage member accounts.\n2. Rules and Completion: A member can hold at most 5 books simultaneously. Books have a 14-day lending period. Overdue books incur a fine calculated per day. A book can only be checked out if at least one copy is available.\n3. Error Handling: Attempting to check out an unavailable book returns an error. Attempting to check out when at the member's book limit returns an error. Returning a book not associated with the member returns an error.\n4. Scope Boundaries: In scope — core checkout/return workflow, book inventory, member management, overdue tracking. Out of scope — payment processing for fines (just track the amount), reservation/hold queue, digital/e-book lending, notification system, search indexing algorithm, UI.\n\nScope decisions: Payment processing is excluded because it's an integration concern, not core library logic. Reservations add significant complexity (queue management, priority) that would be better as an extension. The notification system is a delivery mechanism, not business logic.",
        rubric:
          'Award full marks for: (1) addressing all four themes — primary capabilities, rules/completion, error handling, scope boundaries (5pts), (2) specific and testable requirements, not vague statements (5pts), (3) reasonable scope decisions with justification showing mature engineering judgment (5pts), (4) out-of-scope items that show the candidate considered and deliberately excluded them (5pts), (5) requirements that are detailed enough to drive class design — quantities, limits, and conditions specified (5pts). Deduct points for: vague requirements like "system should be fast", missing error handling, no out-of-scope section, or requirements that cannot be verified.',
        basePoints: 30,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Paragraph 2 — medium
    {
      title: "Entity identification for a Vending Machine",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Given the prompt "Design a Vending Machine," identify the entities and non-entities from these nouns: VendingMachine, Product, Coin, Inventory, Display, Slot, Transaction, User, Button. For each noun, explain whether it should be an entity (its own class) or not, applying the framework\'s heuristic: "If it maintains changing state or enforces rules, it\'s an entity. Otherwise, it\'s a field."',
        sampleAnswer:
          "Entities (should be classes):\n- VendingMachine: YES — the orchestrator. Drives the main workflow (accept money, select product, dispense). Manages overall state (idle, accepting money, dispensing).\n- Inventory: YES — maintains changing state (quantity per product). Enforces rules (is product available? decrement on dispense). Could be a Map<Product, int> inside VendingMachine, but having its own class with addStock() and isAvailable() keeps the VendingMachine from becoming bloated.\n- Transaction: YES — represents an in-progress purchase. Tracks inserted amount, selected product, change to return. Has state transitions (in progress → completed/cancelled).\n\nNot Entities (fields or parameters):\n- Product: NOT an entity — it's just data (name, price). No behavior, no changing state. A simple data class or enum.\n- Coin: NOT an entity — just a denomination value. An enum (PENNY, NICKEL, DIME, QUARTER) or a value, not a class with behavior.\n- Display: NOT an entity — out of scope (UI layer). The vending machine can have a getDisplayMessage() method instead.\n- Slot: NOT an entity — just an inventory slot. Represented as a mapping in Inventory.\n- User: NOT an entity — the user is external. Our system receives inputs (insert coin, select product) but does not model the user.\n- Button: NOT an entity — UI/hardware concern, out of scope.",
        rubric:
          'Award full marks for: (1) correctly applying the "changing state or enforces rules" heuristic (8pts), (2) clear justification for each decision, not just yes/no (8pts), (3) identifying the orchestrator (VendingMachine) and explaining why (4pts), (4) correctly identifying at least 3 non-entities with reasoning that shows understanding of the principle (5pts), (5) not over-engineering — keeping the entity count lean (5pts). Deduct points for: making every noun an entity, missing the orchestrator identification, or providing no reasoning.',
        basePoints: 30,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Paragraph 3 — hard
    {
      title: "Deriving state and behavior for an Elevator class",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Given these requirements for an Elevator System:\n1. Multiple elevators serve a building with N floors.\n2. Users press up/down buttons on a floor to request an elevator.\n3. Users press a floor button inside the elevator to set a destination.\n4. Elevators move up or down, stopping at requested floors.\n5. Doors open when an elevator arrives at a requested floor.\n\nUsing the framework's systematic approach, derive the state and behavior for the Elevator class by mapping each requirement to what the Elevator must track and what methods it must expose. Show the requirement-to-state and requirement-to-behavior tables.",
        sampleAnswer:
          'State derivation:\nRequirement → What Elevator must track:\n- "Elevators serve N floors" → currentFloor: int, minFloor/maxFloor or building reference\n- "Users set destinations inside elevator" → destinationFloors: Set<int> (internal requests)\n- "Elevators move up or down" → direction: Direction (UP, DOWN, IDLE)\n- "Stopping at requested floors" → assignedPickups: List<FloorRequest> (external requests assigned by the controller)\n- "Doors open on arrival" → doorState: DoorState (OPEN, CLOSED)\n- Implicit: state: ElevatorState (MOVING, STOPPED, IDLE, MAINTENANCE)\n\nBehavior derivation:\nRequirement → Method on Elevator:\n- Users set destinations → addDestination(floor: int) — validates floor is in range, adds to destination set\n- Elevators move → step() or update() — moves one floor in current direction, checks if should stop\n- Stopping at floors → shouldStop(floor: int) -> bool — checks if current floor is in destinations or assigned pickups\n- Doors open → openDoors() / closeDoors() — manages door state transitions\n- Query state → getCurrentFloor(), getDirection(), isIdle() — read-only state access\n\nNote: The Elevator does NOT handle request dispatching. That is the ElevatorController\'s job (orchestrator). The Elevator manages its own movement, doors, and destination list. The "which elevator to send" decision lives in the controller, following the encapsulation principle.',
        rubric:
          "Award full marks for: (1) systematic requirement-to-state mapping — each requirement produces specific state fields (8pts), (2) systematic requirement-to-behavior mapping — each requirement produces specific methods (8pts), (3) correct encapsulation — Elevator manages its own state, dispatching lives in the controller (6pts), (4) identifying implicit state like ElevatorState enum and DoorState (4pts), (5) clean API design — methods correspond to real actions, not unnecessary getters (4pts). Deduct for: putting dispatching logic in Elevator, missing destination tracking, no separation of internal vs external requests.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 4 — hard
    {
      title: "Implementation with happy path and edge cases",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are designing a Parking Lot system with these classes: ParkingLot (orchestrator), ParkingSpot, Vehicle, and Ticket. Write the pseudo-code implementation for the parkVehicle(vehicle) method on ParkingLot, following the framework's approach: guard clauses for edge cases first, then the happy path, then state transition logic. Include a brief scenario verification trace.",
        sampleAnswer:
          'parkVehicle(vehicle):\n    // Guard clauses (edge cases)\n    if vehicle is null:\n        throw InvalidInputError("Vehicle cannot be null")\n    if vehicle already has active ticket:\n        throw DuplicateEntryError("Vehicle already parked")\n    \n    // Find available spot matching vehicle size\n    spot = findAvailableSpot(vehicle.size)\n    if spot is null:\n        throw NoSpaceError("No available spot for " + vehicle.size)\n    \n    // Happy path\n    spot.occupy(vehicle)          // spot manages its own state\n    ticket = new Ticket(vehicle, spot, currentTime())\n    activeTickets[vehicle.id] = ticket\n    availableSpotCount[vehicle.size] -= 1\n    \n    return ticket\n\nfindAvailableSpot(size):\n    // Try exact size first, then larger sizes (size fallback)\n    for spotSize in [size, ...largerSizes(size)]:\n        if availableSpots[spotSize] is not empty:\n            return availableSpots[spotSize].removeFirst()\n    return null\n\nVerification trace:\n- Initial: Lot has 2 compact spots, 1 large spot. All empty.\n- parkVehicle(compactCar1) → finds compact spot #1, creates ticket T1, available compact = 1\n- parkVehicle(compactCar2) → finds compact spot #2, creates ticket T2, available compact = 0\n- parkVehicle(compactCar3) → no compact spots, falls back to large spot #1, creates ticket T3\n- parkVehicle(compactCar4) → no spots at all → throws NoSpaceError ✓\n- parkVehicle(compactCar1) → already parked → throws DuplicateEntryError ✓',
        rubric:
          "Award full marks for: (1) guard clauses before happy path — null check, duplicate check, no space check (6pts), (2) clean happy path that delegates to supporting entities (spot.occupy) instead of directly manipulating state (6pts), (3) proper state transitions — ticket creation, spot count update (5pts), (4) findAvailableSpot with size fallback logic (5pts), (5) concrete verification trace showing at least 3 operations including edge cases (8pts). Deduct for: missing guard clauses, violating Tell/Don't Ask by checking spot.isOccupied externally, no verification trace, or trace that doesn't test edge cases.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 5 — hard
    {
      title: "Extensibility discussion for a Rate Limiter",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You have designed a Rate Limiter with classes: RateLimiter (orchestrator using a fixed-window counter), WindowCounter (tracks request counts per time window), and Config (stores max requests per window). The interviewer asks: "How would you extend this to support sliding window and token bucket algorithms?" Using the extensibility phase approach, explain how your design accommodates this without major restructuring.',
        sampleAnswer:
          'The extension is clean because the core rate-limiting logic is isolated behind a well-defined interface. Here is how I would approach it:\n\n1. Extract a Strategy interface: The RateLimiter currently uses WindowCounter directly. I would introduce a RateLimitStrategy interface with a single method: isAllowed(clientId) -> bool. WindowCounter becomes FixedWindowStrategy implementing this interface.\n\n2. Add new strategies:\n   - SlidingWindowStrategy: Instead of resetting at window boundaries, it uses a weighted combination of the current and previous window counts. The formula is: count = previousWindow * overlapPercentage + currentWindow. Same interface — isAllowed(clientId) -> bool.\n   - TokenBucketStrategy: Maintains a bucket with a maximum capacity that refills at a constant rate. Each request consumes one token. isAllowed(clientId) checks if tokens > 0, decrements, and returns true. Refill logic runs on each check based on elapsed time.\n\n3. What doesn\'t change: The RateLimiter orchestrator still calls strategy.isAllowed(clientId). Config is extended to include strategyType. Client-facing API remains identical. This is the Strategy pattern, but it emerges naturally from the problem rather than being forced — the interviewer asked "how would you support multiple algorithms?" and the answer is: swap the algorithm behind a stable interface.\n\n4. Why this works: State mutations are isolated within each strategy. The orchestrator does not inspect strategy internals. Adding a new algorithm means implementing one interface — no changes to RateLimiter or any calling code.',
        rubric:
          "Award full marks for: (1) identifying the Strategy pattern as emerging from the requirement, not forced (6pts), (2) clean interface extraction with a stable contract (6pts), (3) correct explanation of sliding window and token bucket at a conceptual level (6pts), (4) showing what does NOT change — demonstrating design resilience (6pts), (5) staying high-level as the framework recommends — pointing to design structure rather than rewriting code (6pts). Deduct for: proposing to rewrite the entire system, incorrect algorithm descriptions, or not connecting the extension back to the original design.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 6 — hard
    {
      title: "Critique a flawed LLD interview approach",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A candidate receives the prompt \"Design a Chess Game.\" They immediately start writing a ChessPiece class hierarchy (King, Queen, Rook, Bishop, Knight, Pawn) with all movement rules. After 20 minutes on the piece hierarchy, they realize they haven't designed the Board, Game, or Turn logic. They rush through those in the final 10 minutes and don't implement any methods. Using the LLD delivery framework, critique this approach and explain what they should have done differently at each phase.",
        sampleAnswer:
          'Critique using the framework:\n\n1. Requirements Phase (skipped): The candidate dove straight into code. They should have spent 5 minutes clarifying: What constitutes a valid move? How does check/checkmate work? Is castling/en passant in scope? What about game ending conditions (resign, draw, timeout)? Without requirements, they\'re guessing what to build.\n\n2. Entities Phase (skipped): They should have identified entities first: Game (orchestrator), Board, Player, Piece (abstract), and specific piece types. The relationships would show Game owns Board and two Players, Board contains Pieces. This 3-minute exercise would have revealed that Game and Board are more important than the piece hierarchy.\n\n3. Class Design Phase (misallocated): The candidate spent 20 minutes on piece movement rules — a detail-heavy area. The framework says to work top-down starting with the orchestrator. They should have designed Game first (state: board, players, currentTurn, gameState; behavior: makeMove, isInCheck, isCheckmate) and Board next (state: grid; behavior: movePiece, getPieceAt, isPathClear). Only then should they outline the Piece hierarchy, and even then, each piece\'s movement validation is a single method — not 20 minutes of code.\n\n4. Implementation Phase (rushed): With 10 minutes left for everything, they couldn\'t implement any methods. Had they followed the framework, they would have 10 minutes for the most important methods: Game.makeMove() showing how all classes cooperate, Board.isPathClear() showing spatial logic, and Piece.isValidMove() for one or two pieces as examples.\n\n5. Extensibility Phase (missed): No time left. A well-paced interview would leave 5 minutes for extensions like "add undo" or "add move history."\n\nCore mistake: Bottom-up design. They started with the most detailed, least important entities and worked up. The framework prescribes top-down: orchestrator first, supporting entities next, details last.',
        rubric:
          "Award full marks for: (1) identifying the skipped requirements phase and what should have been asked (5pts), (2) identifying the skipped entity identification phase (5pts), (3) diagnosing the class design misallocation — too much time on detail, not enough on orchestrator (5pts), (4) explaining the correct top-down order (Game → Board → Piece hierarchy) (5pts), (5) describing what methods should have been implemented and what they would demonstrate (5pts), (6) naming the core mistake as bottom-up vs top-down design (5pts). Deduct for: not referencing the framework phases, vague criticism without constructive alternatives.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Name the encapsulation principle",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'The LLD framework describes a principle: "Objects should manage their own state and expose behavior, not getters for callers to make decisions." What is the common name for this principle?',
        correctAnswer: "Tell, Don't Ask",
        explanation:
          'The "Tell, Don\'t Ask" principle states that objects should manage their own state and expose behavior rather than exposing state through getters for callers to inspect and make decisions about. Instead of asking an object for its state and acting on it externally, you tell the object what to do and let it handle the logic internally. This keeps rules co-located with the state they operate on.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Text 2 — medium
    {
      title: "First entity to design in class design phase",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "When entering the Class Design phase, the framework recommends working top-down. What type of entity should you design first, and what is this entity's role?",
        correctAnswer: "The orchestrator — the entity driving the main workflow",
        explanation:
          "The framework says to start with the orchestrator — the entity that drives the main workflow. For Tic Tac Toe, this is the Game class. For a Parking Lot, it's the ParkingLot class. For Amazon Locker, it's the Locker class. Starting with the orchestrator ensures the main flow is clear before you define supporting entity details, and it helps you discover what the supporting entities need to provide.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Text 3 — hard
    {
      title: "Why the framework says to avoid UML",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "The LLD delivery framework explicitly recommends against using UML diagrams in interviews. Provide the two key reasons given for this recommendation.",
        correctAnswer:
          "UML is outdated and rarely used in production systems, and the added formality slows you down without adding clarity in an interview setting where you need to iterate and react to feedback in real time.",
        explanation:
          "The framework argues that (1) UML is outdated — engineers at modern companies design in code, not UML diagrams. Microsoft removed UML tooling from Visual Studio in 2016 because usage had dropped to zero. (2) In an interview context, where you are thinking out loud, iterating on a design, and reacting to feedback in real time, the added formality of UML slows you down without adding clarity. Simple class notation showing structure, relationships, and key methods works better.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Text 4 — hard
    {
      title: "Purpose of scenario verification",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'After implementing core methods, the framework recommends a "verification" step. What is the purpose of this step and what specific things should you trace through?',
        correctAnswer:
          "The purpose is to catch logical errors before the interviewer finds them and demonstrate your ability to verify your own code. You trace through: initial state, what happens on each operation, how state changes at each step, and edge cases or transitions.",
        explanation:
          "The verification step involves picking a simple but non-trivial scenario and stepping through it tick by tick: (1) initial state, (2) what happens on each operation, (3) how state changes at each step, and (4) edge cases or transitions (like going from in-progress to completed). The goal is not to find syntax issues but to catch logical errors before the interviewer discovers them. Many interviewers explicitly test verification as part of their rubric. Finding and fixing a bug during this walkthrough is a positive signal.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match framework phases to time allocations",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content:
          "Match each phase of the LLD delivery framework to its recommended time allocation.",
        pairs: [
          { id: "p1", left: "Requirements", right: "~5 minutes" },
          {
            id: "p2",
            left: "Entities and Relationships",
            right: "~3 minutes",
          },
          { id: "p3", left: "Class Design", right: "~10-15 minutes" },
          { id: "p4", left: "Implementation", right: "~10 minutes" },
          { id: "p5", left: "Extensibility", right: "~5 minutes" },
        ],
        explanation:
          "The LLD interview is approximately 35 minutes. Requirements (5 min) turns the prompt into a spec. Entities and Relationships (3 min) identifies the core objects and their ownership. Class Design (10-15 min) is the heart of the interview — defining state and behavior. Implementation (10 min) is where you write pseudo-code for key methods. Extensibility (5 min, if time allows) shows your design handles changes cleanly.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {},
      },
    },

    // Matching 2 — medium
    {
      title: "Match rule types to responsible entities",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "In a Tic Tac Toe design, match each rule to the entity that should enforce it according to the encapsulation principle.",
        pairs: [
          {
            id: "p1",
            left: "Is the game still in progress?",
            right: "Game (orchestrator — workflow rule)",
          },
          {
            id: "p2",
            left: "Is it this player's turn?",
            right: "Game (orchestrator — lifecycle rule)",
          },
          {
            id: "p3",
            left: "Is the target cell unoccupied?",
            right: "Board (data-specific — owns the grid)",
          },
          {
            id: "p4",
            left: "Has a player completed a row/col/diagonal?",
            right: "Board (data-specific — owns the grid)",
          },
          {
            id: "p5",
            left: "Are all cells filled (draw condition)?",
            right: "Board (data-specific — owns the grid)",
          },
        ],
        explanation:
          'Workflow and lifecycle rules (game state, turn management) belong in the orchestrator (Game). Data-specific rules (cell occupancy, win detection, full board check) belong in the entity that owns the data (Board). Game calls Board methods to check these conditions, but Board is the one that inspects and manages the grid. This separation is the "Tell, Don\'t Ask" principle in action.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Matching 3 — hard
    {
      title: "Match anti-patterns to consequences",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each LLD interview anti-pattern to its likely consequence.",
        pairs: [
          {
            id: "p1",
            left: "Diving into code without requirements",
            right: "Building the wrong system — missed or wrong features",
          },
          {
            id: "p2",
            left: "Over-engineering entities (too many classes)",
            right: "Bloated object model with classes that have no behavior",
          },
          {
            id: "p3",
            left: "Spending too long on formal UML",
            right: "Running out of time before implementation",
          },
          {
            id: "p4",
            left: "Forcing design patterns that don't fit",
            right: "Unnecessary complexity that obscures the core logic",
          },
          {
            id: "p5",
            left: "Happy path only — no edge case handling",
            right: "Fails to demonstrate production thinking",
          },
        ],
        explanation:
          "Each anti-pattern has a predictable consequence: (1) No requirements means you solve the wrong problem. (2) Too many entities means most classes are empty shells — they have names but no behavior. (3) UML diagrams eat into the time you need for implementation — the most impactful phase. (4) Forced patterns add accidental complexity — the interviewer sees ceremony, not understanding. (5) Happy-path-only code looks like a toy, not production software.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Entity identification filter",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "When identifying entities, apply this filter: If something maintains _____ or enforces _____, it deserves to be its own entity. If it's just information attached to something else, it's probably just a _____ on another class.",
        blanks: [
          { id: "blank1", correctAnswer: "changing state" },
          { id: "blank2", correctAnswer: "rules" },
          { id: "blank3", correctAnswer: "field" },
        ],
        explanation:
          "The entity identification heuristic is: if something maintains changing state or enforces rules, it deserves its own entity. Otherwise, it is just a field on another class. This prevents the common mistake of creating too many micro-objects while ensuring you capture the pieces that actually need encapsulation.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {},
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Two questions for each entity",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "For each entity in the Class Design phase, answer two questions: _____ — What does this class need to remember? _____ — What does this class need to do?",
        blanks: [
          { id: "blank1", correctAnswer: "State" },
          { id: "blank2", correctAnswer: "Behavior" },
        ],
        explanation:
          "The two fundamental questions for each entity are State (what does it need to remember to enforce the requirements?) and Behavior (what operations or queries does it need to support?). If you tie both back to your requirements list, you avoid guessing and bloat.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {},
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Implementation approach order",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "When implementing a method, start with the _____ — the normal flow when everything goes right. Then enumerate the _____: invalid inputs, illegal operations, and calls that violate the current system state.",
        blanks: [
          { id: "blank1", correctAnswer: "happy path" },
          { id: "blank2", correctAnswer: "edge cases" },
        ],
        explanation:
          "The framework recommends starting with the happy path to make the method's purpose and structure clear before introducing complexity. Then enumerate edge cases and failure modes to demonstrate production thinking. In practice, edge case guards often appear as guard clauses at the top of the method, but conceptually you think about the happy path first.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },
  ],
};
