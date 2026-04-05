/**
 * Connect Four — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: OOP class design, game state modeling, board representation,
 * win detection algorithms, separation of concerns, extensibility patterns
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldConnectFourContent: StoryPointSeed = {
  title: "Design Connect Four (LLD)",
  description:
    "Master the low-level design of a Connect Four game — covering OOP class decomposition, enum-based state modeling, directional win detection, separation of concerns between Game/Board/Player, and extensibility patterns like undo and AI opponents.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements & Core Entities
    {
      title: "Connect Four — Requirements & Core Entities",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Connect Four — Requirements & Core Entities",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Understanding the Problem",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Connect Four is a two-player connection game where players take turns placing discs into a 7×6 grid. The first player to connect four discs in a row — vertically, horizontally, or diagonally — wins. This is a classic LLD interview problem that tests OOP decomposition, state management, and clean separation of concerns.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Clarifying Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                "Before jumping into class design, clarify ambiguity with the interviewer. Cover four areas: core actions, error handling, system boundaries, and future extensions. This mirrors real-world requirement gathering and shows structured thinking.",
            },
            {
              id: "b5",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Core action: Players choose a column (0–6), disc falls to lowest available row.",
                  "Win conditions: Four in a row (vertical, horizontal, diagonal) wins. Full board with no winner is a draw.",
                  "Error handling: Reject moves on full columns, out-of-turn moves, and moves after game is over. Return false or raise an error.",
                  "Scope: Single game, backend only, no move history, no undo, fixed 7×6 board.",
                ],
              },
            },
            {
              id: "b6",
              type: "heading",
              content: "Final Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b7",
              type: "code",
              content:
                "Requirements:\n1. Two players take turns dropping discs into a 7-column, 6-row board\n2. A disc falls to the lowest available row in the chosen column\n3. Game ends when:\n   - A player gets four discs in a row (vertical, horizontal, diagonal) → Win\n   - The board is full → Draw\n4. Invalid moves must be rejected:\n   - Dropping in a full column\n   - Moving out of turn\n   - Moving after game is over\n\nOut of scope:\n- UI support, concurrent games, move history, undo, board size configuration",
              metadata: { language: "text" },
            },
            {
              id: "b8",
              type: "heading",
              content: "Core Entities & Responsibilities",
              metadata: { level: 2 },
            },
            {
              id: "b9",
              type: "paragraph",
              content:
                "Identify entities by looking for nouns in requirements and assigning each a single, clear responsibility. A common mistake is putting everything in one giant class or splitting things unnecessarily.",
            },
            {
              id: "b10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Game: The orchestrator. Holds the Board, tracks whose turn it is, manages game state (in progress, won, draw), enforces turn-based rules. External code interacts only through Game.",
                  "Board: The 7×6 grid. Owns grid state, handles disc placement, knows how to check if a column is full, where a disc lands, and whether four discs are connected. Does NOT care about turns or who is winning.",
                  "Player: Simple data holder with a name and disc color. No game logic.",
                ],
              },
            },
            {
              id: "b11",
              type: "heading",
              content: "Modeling Game State: Boolean Flags vs Enum",
              metadata: { level: 2 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "A critical design decision is how to represent game state. Some candidates use boolean flags (isOver, hasWinner, isDraw) — this creates 8 possible combinations but the domain only has 3 valid states. Invalid states like isOver=false + hasWinner=true become possible. Instead, use a GameState enum with IN_PROGRESS, WON, and DRAW. The enum can only hold one value at a time, making invalid states unrepresentable by construction.",
            },
            {
              id: "b13",
              type: "code",
              content:
                "// BAD: Boolean flags — 3 booleans = 8 combinations, only 3 valid\nclass Game:\n  isOver: boolean\n  hasWinner: boolean\n  isDraw: boolean\n  // Possible invalid state: isOver=false, hasWinner=true\n\n// GOOD: Enum — exactly 3 states, no invalid combinations\nenum GameState:\n  IN_PROGRESS\n  WON\n  DRAW\n\nclass Game:\n  state: GameState  // One field, one truth",
              metadata: { language: "pseudocode" },
            },
            {
              id: "b14",
              type: "quote",
              content:
                '"Make invalid states unrepresentable. When your type structure matches your domain structure, whole classes of bugs disappear. The compiler enforces correctness for you."',
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Class Design & Implementation
    {
      title: "Class Design — Game, Board & Player Interfaces",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Class Design — Game, Board & Player Interfaces",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Top-Down Design Approach",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                'Start with Game (the orchestrator and entry point), then work down to Board and Player. For each entity, derive state from requirements ("What must this class track?") and methods from actions ("What does the outside world need to do?").',
            },
            {
              id: "c3",
              type: "heading",
              content: "Game Class",
              metadata: { level: 2 },
            },
            {
              id: "c4",
              type: "code",
              content:
                "class Game:\n  - board: Board\n  - player1: Player\n  - player2: Player\n  - currentPlayer: Player\n  - state: GameState        // IN_PROGRESS, WON, DRAW\n  - winner: Player?         // null if no winner yet or draw\n\n  + Game(player1, player2)\n  + makeMove(player, column) -> bool\n  + getCurrentPlayer() -> Player\n  + getGameState() -> GameState\n  + getWinner() -> Player?\n  + getBoard() -> Board",
              metadata: { language: "pseudocode" },
            },
            {
              id: "c5",
              type: "paragraph",
              content:
                "makeMove is the only method that mutates state. Everything else is read-only. The constructor sets board = Board(), currentPlayer = player1, state = IN_PROGRESS, winner = null.",
            },
            {
              id: "c6",
              type: "heading",
              content: "Board Class",
              metadata: { level: 2 },
            },
            {
              id: "c7",
              type: "code",
              content:
                "class Board:\n  - rows: int = 6\n  - cols: int = 7\n  - grid: DiscColor?[rows][cols]  // null = empty\n\n  + Board()\n  + canPlace(column) -> bool\n  + placeDisc(column, color) -> int   // returns row, or -1 on failure\n  + isFull() -> bool\n  + checkWin(row, column, color) -> bool\n  + getCell(row, column) -> DiscColor?",
              metadata: { language: "pseudocode" },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Board stores DiscColor (not Player) in the grid for better testability — simpler type, no need to mock Player objects. Board encapsulates all grid math; Game never scans for four-in-a-row directly.",
            },
            {
              id: "c9",
              type: "heading",
              content: "Player Class & Enums",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "code",
              content:
                "class Player:\n  - name: string\n  - color: DiscColor\n  + Player(name, color)\n  + getName() -> string\n  + getColor() -> DiscColor\n\nenum DiscColor:\n  RED\n  YELLOW\n\nenum GameState:\n  IN_PROGRESS\n  WON\n  DRAW",
              metadata: { language: "pseudocode" },
            },
            {
              id: "c11",
              type: "heading",
              content: "makeMove Implementation",
              metadata: { level: 2 },
            },
            {
              id: "c12",
              type: "code",
              content:
                "makeMove(player, column):\n  // Edge cases — reject before touching state\n  if state != IN_PROGRESS: return false\n  if player != currentPlayer: return false\n\n  // Delegate placement to Board\n  row = board.placeDisc(column, player.getColor())\n  if row == -1: return false    // invalid column or full\n\n  // Check outcomes\n  if board.checkWin(row, column, player.getColor()):\n    state = WON\n    winner = player\n  else if board.isFull():\n    state = DRAW\n  else:\n    currentPlayer = (player == player1) ? player2 : player1\n\n  return true",
              metadata: { language: "pseudocode" },
            },
            {
              id: "c13",
              type: "paragraph",
              content:
                "Game does NOT check column bounds or whether the column is full — that is Board's responsibility. placeDisc returns -1 for invalid moves, keeping concerns properly separated: Game handles game rules (turns, state), Board handles grid rules (bounds, placement).",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Win Detection & Extensibility
    {
      title: "Win Detection Algorithm & Extensibility Patterns",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Win Detection Algorithm & Extensibility Patterns",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Win Detection: Over-Engineering vs Clean Design",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                'A common mistake is creating separate WinChecker classes for each direction (HorizontalWinChecker, VerticalWinChecker, etc.). This looks "properly OOP" but is pattern abuse — Connect Four has exactly four fixed directions that will never change. The Strategy pattern is for behaviors that genuinely vary at runtime. Here, all four checks use identical logic with different parameters.',
            },
            {
              id: "d3",
              type: "heading",
              content: "Unified Directional Vector Approach",
              metadata: { level: 2 },
            },
            {
              id: "d4",
              type: "code",
              content:
                "checkWin(row, col, color):\n  if !inBounds(row, col) or grid[row][col] != color: return false\n\n  directions = [[0,1], [1,0], [1,1], [-1,1]]\n  // horizontal, vertical, diagonal-down-right, diagonal-up-right\n\n  for dr, dc in directions:\n    count = 1\n    count += countInDirection(row, col, dr, dc, color)\n    count += countInDirection(row, col, -dr, -dc, color)\n    if count >= 4: return true\n  return false\n\ncountInDirection(row, col, dr, dc, color):\n  count = 0\n  r = row + dr\n  c = col + dc\n  while inBounds(r, c) && grid[r][c] == color:\n    count++\n    r += dr\n    c += dc\n  return count",
              metadata: { language: "pseudocode" },
            },
            {
              id: "d5",
              type: "paragraph",
              content:
                "One method handles all four directions. The direction is just data — a (dr, dc) pair. Horizontal is (0,1), vertical is (1,0), diagonals are (1,1) and (-1,1). The counting logic is written once and reused. This separates data (direction vectors) from logic (counting algorithm). Bugs are fixed in one place.",
            },
            {
              id: "d6",
              type: "heading",
              content: "placeDisc & Helper Methods",
              metadata: { level: 2 },
            },
            {
              id: "d7",
              type: "code",
              content:
                "placeDisc(column, color):\n  if column < 0 || column >= cols: return -1\n  if !canPlace(column): return -1\n  for row = rows-1 down to 0:\n    if grid[row][column] == null:\n      grid[row][column] = color\n      return row\n  return -1\n\ncanPlace(column):\n  if column < 0 || column >= cols: return false\n  return grid[0][column] == null   // top row empty = space\n\nisFull():\n  for c = 0 to cols-1:\n    if canPlace(c): return false\n  return true",
              metadata: { language: "pseudocode" },
            },
            {
              id: "d8",
              type: "heading",
              content: "Extensibility: Undo / Move History",
              metadata: { level: 2 },
            },
            {
              id: "d9",
              type: "paragraph",
              content:
                "Undo belongs in Game because Game controls the lifecycle and turn order. Add a moveHistory stack. Each successful move pushes a Move record (player, row, column). Undo pops the last move, calls board.clearCell(row, col), reverts currentPlayer, and resets state to IN_PROGRESS. Board just needs a clearCell(row, col) helper — no other changes.",
            },
            {
              id: "d10",
              type: "heading",
              content: "Extensibility: Computer Opponent",
              metadata: { level: 2 },
            },
            {
              id: "d11",
              type: "paragraph",
              content:
                'Game rules do NOT change for a bot. Introduce a separate BotEngine with a chooseMove(game) -> int method. The game loop calls bot.chooseMove() for the bot player and passes the result to makeMove(). Player stays as simple data — making Player an interface with HumanPlayer/BotPlayer subclasses adds abstraction without value since players don\'t "do" anything. Separating identity from decision-making is cleaner.',
            },
            {
              id: "d12",
              type: "heading",
              content: "Extensibility: Configurable Board Size",
              metadata: { level: 2 },
            },
            {
              id: "d13",
              type: "paragraph",
              content:
                "Make rows and cols constructor parameters on Board. All placement and win logic already works for arbitrary dimensions because it uses rows, cols, and inBounds — no hardcoded 6 or 7 in the algorithm. Game just chooses what size board to construct.",
            },
            {
              id: "d14",
              type: "heading",
              content: "What Distinguishes Each Level",
              metadata: { level: 2 },
            },
            {
              id: "d15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Junior: Decompose into Board/Game/Player, implement working placement and basic win detection. Diagonal checking may need hints.",
                  "Mid-level: Clean separation of concerns, directional vector win detection, discuss extensibility without implementing.",
                  "Senior: Proactively justify design decisions (enum over booleans, DiscColor over Player in grid), elegant checkWin, discuss multiple extensibility approaches with tradeoffs. Finishes early.",
                ],
              },
            },
          ],
          readingTime: 12,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "Game state representation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Which approach is best for representing the state of a Connect Four game (in progress, won, draw)?",
        explanation:
          "A GameState enum with IN_PROGRESS, WON, and DRAW is the best approach. It allows exactly three states — matching the domain — and makes invalid states unrepresentable. Boolean flags (isOver, hasWinner, isDraw) create 8 combinations but only 3 are valid, allowing impossible states like isOver=false + hasWinner=true. A string field is error-prone with typos. An integer code sacrifices readability.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A GameState enum with IN_PROGRESS, WON, and DRAW — exactly 3 values matching 3 domain states",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Three boolean flags: isOver, hasWinner, isDraw — flexible and easy to check",
              isCorrect: false,
            },
            {
              id: "c",
              text: 'A single string field that holds "in_progress", "won", or "draw"',
              isCorrect: false,
            },
            {
              id: "d",
              text: "An integer state code: 0 for in progress, 1 for won, 2 for draw",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Board grid storage type",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "What should the Board's grid cells store, and why?",
        explanation:
          "Storing DiscColor (RED/YELLOW or null) is best because it keeps Board independently testable — you don't need to mock Player objects. Board only needs to know disc color to check wins and placement. Storing Player objects tightly couples Board to Player. Integers or characters sacrifice readability and type safety.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "DiscColor enum (RED, YELLOW, or null) — keeps Board testable without Player dependencies",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Player references — so Board knows which player placed each disc",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Integers (0 for empty, 1 for player 1, 2 for player 2) — minimal memory usage",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Characters ('R', 'Y', ' ') — human-readable for debugging",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Responsibility for column validation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In a well-designed Connect Four system, which class should validate whether a column is full before allowing disc placement?",
        explanation:
          "Board should own all grid-related validation because it owns the grid state. Game should NOT check column bounds or fullness — that would duplicate Board's responsibility and violate separation of concerns. Game validates game rules (turns, state), Board validates grid rules (bounds, placement). placeDisc returns -1 for invalid moves, and Game just checks the return value.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Board — it owns the grid state, so column validation belongs here",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Game — it orchestrates everything, so all validation goes through Game",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Player — the player should check if their chosen column is valid",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A separate Validator class — validation logic should be extracted",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why not Strategy pattern for win checking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A candidate creates separate HorizontalWinChecker, VerticalWinChecker, and DiagonalWinChecker classes implementing a WinChecker interface. What is the fundamental problem with this approach?",
        explanation:
          "All four win checkers do the exact same thing — count contiguous discs from a starting point in a direction. The only difference is the (dr, dc) direction values. Creating four classes turns parameters into types. This is YAGNI — Connect Four directions are fixed and will never change. The Strategy pattern is for behaviors that genuinely vary at runtime (like payment methods). A single countInDirection(dr, dc) method with a direction array is shorter, easier to test, and correct.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "All four checkers use identical logic with different direction parameters — this is parameterization, not polymorphism",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The WinChecker interface creates too many allocations per move, hurting performance",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The checkers need access to Board internals, violating encapsulation",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It prevents adding new win conditions in the future",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "makeMove return value design",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In Game.makeMove(player, column), what is the best practice for the order of validation checks, and why?",
        explanation:
          'The correct order is: (1) check if game is over, (2) check if it is the correct player\'s turn, (3) attempt placement via Board. This follows the principle of "reject before touching state." Game-level rules (state, turn) are checked first because they are cheap and catch the most common invalid calls. Board-level validation (column bounds, fullness) is delegated to placeDisc, keeping concerns separated. Checking turn first would give confusing errors when the game is already over.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Check game state → check turn → delegate to Board — reject at the cheapest, broadest level first",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Check turn → check game state → validate column — most specific check first",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Validate column bounds first → check turn → check game state — prevent invalid grid access",
              isCorrect: false,
            },
            {
              id: "d",
              text: "No specific order matters — all checks must pass anyway",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Where to place undo functionality",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "An interviewer asks you to add undo functionality. Where should the moveHistory stack and undoLastMove() method live?",
        explanation:
          "Undo belongs in Game because Game controls the lifecycle, turn order, and state transitions. Since all moves flow through Game.makeMove, Game is the natural choke point for recording and reversing moves. Board just needs a clearCell() helper — no new logic. Putting undo in Board would require Board to know about players and turns, violating its responsibility. A separate UndoManager adds unnecessary indirection for this scope.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Game — it controls the lifecycle and is the single choke point for all moves",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Board — it owns the grid state that needs to be undone",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A separate UndoManager class — follows Single Responsibility Principle",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Player — each player should track their own move history",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Bot opponent design approach",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "To add a computer opponent, a candidate proposes making Player an interface with HumanPlayer and BotPlayer subclasses, where BotPlayer internally uses AI to pick columns. What is the strongest argument against this approach?",
        explanation:
          'A human player doesn\'t "do" anything — Player is pure data (name + color). Making it an interface adds abstraction without value because the identity of a player (who they are) is separate from the decision-making (how they choose a column). A BotEngine that takes the game state and returns a column keeps concerns separated: identity in Player, strategy in BotEngine. Game still just calls makeMove(currentPlayer, column) regardless of source. This is the key insight: separate identity from behavior.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Player is pure data — it has no behavior to vary. Separating identity (Player) from decision-making (BotEngine) is cleaner.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Polymorphism is too slow for a real-time game — virtual dispatch adds latency per move",
              isCorrect: false,
            },
            {
              id: "c",
              text: "BotPlayer would need access to Game internals, creating circular dependencies",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The interface prevents serialization of Player objects for network multiplayer",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Algebraic data types for game state",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "Using a GameState enum plus a nullable winner field still allows the invalid state: state=WON, winner=null. Which language feature would eliminate this entirely, and when should you use it in an interview?",
        explanation:
          "Discriminated unions (or algebraic data types / sealed classes) let the WON variant carry the winner payload directly: WON(winner: Player). If state is WON, a winner must exist. If state is DRAW, there is no winner field to mess up. Rust, Swift, Kotlin (sealed classes), and TypeScript (discriminated unions) support this natively. However, Java, Python, C#, and Go lack elegant support. In interviews, mention the ideal exists to show depth, but use the simple enum + nullable winner for pseudocode — don't overcomplicate your design for a feature the language doesn't support well.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Discriminated unions / sealed classes where WON(winner) carries the payload — but only use in interviews to show depth, not as the primary design",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Generic types where GameState<T> enforces winner type based on state — use always for maximum type safety",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Runtime assertions in getWinner() that throw if state != WON — always implement this guard",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The Observer pattern where winning fires an event carrying the winner — use when UI integration is expected",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Valid responsibilities of the Game class",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL valid responsibilities of the Game class in a Connect Four design:",
        explanation:
          'Game is the orchestrator: it validates turns (check currentPlayer), tracks game state transitions (IN_PROGRESS → WON/DRAW), delegates disc placement to Board, and switches turns after valid moves. However, checking whether four discs are connected is Board\'s job — Board owns the grid and the win detection algorithm. Game just asks Board "did this move win?" and updates state accordingly.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Validating that it is the correct player's turn before accepting a move",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Tracking whether the game is in progress, won, or drawn",
              isCorrect: true,
            },
            { id: "c", text: "Switching turns after a successful move", isCorrect: true },
            {
              id: "d",
              text: "Scanning the grid to determine if four discs are connected",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid edge cases in makeMove",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL conditions that Game.makeMove() must reject BEFORE modifying any state:",
        explanation:
          "makeMove must reject three conditions before touching state: (1) game is already over (state != IN_PROGRESS), (2) wrong player's turn (player != currentPlayer), (3) invalid column or full column (delegated to Board via placeDisc returning -1). The draw condition is NOT a rejection — it is a game outcome determined AFTER a successful placement. A draw means the move was valid but resulted in a full board with no winner.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "Game state is WON or DRAW (game is already over)", isCorrect: true },
            {
              id: "b",
              text: "The calling player is not the current player (out of turn)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "The chosen column is full or out of bounds (via Board)",
              isCorrect: true,
            },
            {
              id: "d",
              text: "The move would result in a draw (board becomes full with no winner)",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Benefits of directional vector win checking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL benefits of the directional vector approach to win detection (using [dr,dc] pairs) over separate checker classes:",
        explanation:
          "The directional vector approach: (1) writes the counting logic once for all four directions, (2) means bugs are fixed in one place instead of four, (3) clearly separates data (direction vectors) from logic (counting algorithm). However, it is NOT faster at runtime — both approaches iterate the same cells. The advantage is code simplicity and maintainability, not performance.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Counting logic is written once and reused for all four directions",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Edge case bugs are fixed in one place instead of four separate classes",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Clearly separates data (direction vectors) from logic (counting algorithm)",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Runs faster than polymorphic dispatch because it avoids virtual method calls",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Design decisions that distinguish senior candidates",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following design decisions would a senior candidate proactively justify WITHOUT being prompted? Select ALL that apply.",
        explanation:
          "Senior candidates proactively explain: (1) why GameState is an enum — it makes invalid states unrepresentable, (2) why DiscColor is stored in the grid instead of Player — better testability and decoupling, (3) why Player is just data with no methods — the domain doesn't require it. However, discussing thread safety for concurrent game access is over-engineering since the requirements explicitly scope to a single game with turn-based access. A senior candidate knows WHAT to design for and what NOT to.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Why GameState is an enum rather than boolean flags — makes invalid states unrepresentable",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Why Board stores DiscColor instead of Player references — decouples grid from player objects for testability",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Why Player is a simple data class with no game logic — single responsibility, no behavior to warrant methods",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Why the Board needs thread safety for concurrent access — protecting grid state from race conditions",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Explain the separation of concerns between Game and Board",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the separation of concerns between the Game class and the Board class in a Connect Four design. What does each own, and why should Game NOT validate column bounds or check for full columns directly?",
        explanation:
          "A strong answer identifies that Game owns orchestration (turns, state transitions, win/draw determination) while Board owns grid mechanics (placement, bounds checking, win detection). Game delegates to Board because Board owns the grid state. If Game also validated columns, the same responsibility would exist in two places, creating coupling and maintenance risk.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Game and Board have distinct, non-overlapping responsibilities:\n\nGame (orchestrator): Validates turn order (is it this player's turn?), manages game state transitions (IN_PROGRESS → WON/DRAW), delegates disc placement to Board, switches turns after valid moves. Game is the single entry point for external code.\n\nBoard (grid engine): Owns the 7×6 grid state, validates column bounds and fullness, handles disc \"gravity\" (finding lowest empty row), detects four-in-a-row via directional scanning. Board doesn't know or care about turns, players, or game outcomes.\n\nGame should NOT validate column bounds because Board owns the grid state. If Game checked canPlace() before calling placeDisc(), the same validation would exist in two places. When Board's rules change (e.g., configurable board size), Game would also need updating. Instead, placeDisc() handles all grid-related validation internally and returns -1 on failure. Game just checks the return value — cleaner separation, single source of truth.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Compare boolean flags vs enum for game state",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare using multiple boolean flags (isOver, hasWinner, isDraw) versus a single GameState enum (IN_PROGRESS, WON, DRAW) for tracking Connect Four game state. Discuss the tradeoffs in terms of correctness, maintainability, and extensibility.",
        explanation:
          'A strong answer quantifies the invalid state problem (3 booleans = 8 combos, only 3 valid), explains how the enum makes invalid states unrepresentable, and discusses how adding new states (e.g., PAUSED) impacts each approach. Should mention the principle "make invalid states unrepresentable."',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Boolean flags approach: Three booleans (isOver, hasWinner, isDraw) create 2^3 = 8 possible combinations, but only 3 are valid domain states: (false, false, false) = in progress, (true, true, false) = won, (true, false, true) = draw. The remaining 5 combinations are invalid but representable — e.g., isOver=false + hasWinner=true (someone won but the game isn\'t over?). Every state update requires synchronizing all three flags correctly, and nothing in the type system prevents mistakes.\n\nEnum approach: GameState with IN_PROGRESS, WON, DRAW holds exactly one value at a time. The type system enforces that only valid states exist. Checking state is cleaner: `if (state == WON)` vs `if (isOver && hasWinner)`. Adding a new state like PAUSED means adding one enum value vs adding another boolean and updating all coordination logic.\n\nThe key principle is "make invalid states unrepresentable." When your type structure matches your domain structure, whole classes of bugs disappear — the compiler enforces correctness instead of relying on developer discipline.\n\nOne remaining gap: a separate nullable winner field still allows state=WON + winner=null. Languages with discriminated unions (Rust, TypeScript, Kotlin sealed classes) can encode WON(winner: Player) to eliminate even this — worth mentioning in interviews to show depth.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the complete makeMove flow",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Walk through the complete Game.makeMove(player, column) method step by step. Include all validation checks, the delegation to Board, win/draw detection, turn switching, and explain why each step happens in that specific order.",
        explanation:
          'A complete answer traces: (1) state != IN_PROGRESS check, (2) turn validation, (3) Board.placeDisc delegation, (4) checkWin after placement, (5) isFull check, (6) turn switch. Must explain the "reject before touching state" principle and why column validation is delegated to Board.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Game.makeMove(player, column) follows this exact sequence:\n\n1. Check game state: if state != IN_PROGRESS, return false. This is checked first because it is the broadest rejection — once the game is over, nothing else matters.\n\n2. Validate turn: if player != currentPlayer, return false. The caller must be the expected player. Checking this before touching the board prevents any state mutation from an unauthorized caller.\n\n3. Delegate to Board: row = board.placeDisc(column, player.getColor()). Board handles all grid validation — column bounds, column fullness, finding the lowest empty row. If the move is invalid, placeDisc returns -1 and we return false. Game does NOT pre-validate the column because Board owns that responsibility.\n\n4. Check for win: if board.checkWin(row, column, player.getColor()), set state = WON and winner = player. We pass the exact (row, column) where the disc landed so checkWin only scans from that position, not the entire board.\n\n5. Check for draw: else if board.isFull(), set state = DRAW. This is checked only if there is no win — a winning move on the last empty cell should be WON, not DRAW.\n\n6. Switch turn: else, set currentPlayer to the other player. The turn only switches if the game is still IN_PROGRESS (no win, no draw).\n\n7. Return true — the move was valid and processed.\n\nThe ordering principle is "reject before touching state": game-level rules (state, turn) are cheapest and broadest, checked first. Board-level rules (grid validity) involve the grid and are checked during placement. Post-placement outcomes (win, draw) are checked last because they depend on the new board state.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Design undo with move history",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "An interviewer asks you to add move history and undo to your Connect Four design. Describe the data structure, where it lives, and walk through the undoLastMove() implementation. Address how you handle reverting game state (especially from WON or DRAW back to IN_PROGRESS).",
        explanation:
          "Must describe: Move value object (player, row, col), moveHistory stack in Game, push on successful makeMove, undoLastMove pops + clearCell + revert currentPlayer + reset state. Should address the subtlety of reverting from WON/DRAW by simply resetting to IN_PROGRESS since the board state is authoritative.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Data structure: A Move value object holds player, row, and col. Game maintains a moveHistory: Stack<Move>.\n\nIntegration with makeMove: After board.placeDisc succeeds (returns a valid row), push Move(player, row, column) onto the stack before checking win/draw. This records every successful move.\n\nBoard addition: Add clearCell(row, col) that sets grid[row][col] = null. Board needs no other changes.\n\nundoLastMove() implementation:\n1. If moveHistory is empty, return false — nothing to undo.\n2. Pop the last Move from the stack.\n3. Call board.clearCell(last.row, last.col) to remove the disc.\n4. Set currentPlayer = last.player — the person who made the last move should now be the current player again.\n5. Reset state = IN_PROGRESS and winner = null.\n6. Return true.\n\nReverting from WON or DRAW: Setting state = IN_PROGRESS is correct because the board state is now authoritative. After removing the winning disc, the board no longer has four in a row, so IN_PROGRESS is the accurate state. Similarly, after removing a disc from a full board (DRAW), the board is no longer full, so IN_PROGRESS is correct.\n\nSubtlety: A production version might re-check if the previous state was also a win (multiple winning positions). But for an interview, the simple approach of always resetting to IN_PROGRESS after undo is sufficient and correct for single-undo semantics.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "When to use vs avoid design patterns in LLD",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Using the Connect Four win detection problem as an example, explain when the Strategy pattern is appropriate and when it is over-engineering. What criteria should you use to decide between polymorphism and parameterization?",
        explanation:
          "Must contrast: Strategy is for behaviors that vary at runtime or may be extended (e.g., payment methods). Connect Four directions are fixed and all use identical logic — parameterization (direction vectors) is correct. Criteria: Do behaviors differ in logic? Will new variants be added? Is the variation in data or in algorithm? If variation is in data, use parameters. If in algorithm, use polymorphism.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'The Strategy pattern is appropriate when:\n- Behaviors differ in their underlying logic (not just in parameters)\n- New variants may be added in the future (open for extension)\n- The behavior needs to be swapped at runtime\n- Example: Payment processing — CreditCardPayment, PayPalPayment, CryptoPayment have genuinely different APIs, error handling, and validation logic. Adding ApplePayPayment next quarter is realistic.\n\nThe Strategy pattern is over-engineering when:\n- All "strategies" use identical logic with different parameters\n- The set of variants is fixed and will never change\n- Example: Connect Four win checking — all four directions (horizontal, vertical, two diagonals) use the exact same algorithm: count contiguous discs from a starting point. The only difference is which direction to move — (0,1), (1,0), (1,1), (-1,1). These are parameters, not behaviors.\n\nThe decision criteria:\n1. Is the variation in DATA or in ALGORITHM? If data → parameterize. If algorithm → consider polymorphism.\n2. Will new variants be added? If the set is fixed (game geometry) → parameterize. If it grows (payment methods, file formats) → polymorphism.\n3. Does the code pass the "identical logic" test? If you can write one method that handles all cases by varying input values, then separate classes add complexity without value.\n\nIn Connect Four, four checker classes turn parameters into types. You gain nothing — the code is longer, harder to test (4 classes vs 1 method), and harder to maintain (fix a bug in 4 places vs 1). This is pattern abuse, not good design. Senior engineers know when NOT to use patterns as clearly as when to use them.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Extend the design for a computer opponent",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design how you would add a computer opponent to Connect Four. Should Player become an interface? Where does the AI strategy live? How does the game loop change? Justify your design choices.",
        explanation:
          "Must argue: Player stays as data, BotEngine is a separate component with chooseMove(game). Game rules don't change. The game loop checks currentPlayer type and routes to either user input or bot. Should discuss why Player-as-interface is wrong (Player has no behavior to vary) and why separating identity from decision-making is cleaner.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Design for computer opponent:\n\nPlayer stays as a simple data class. A human player doesn't \"do\" anything — it has a name and a color. Making Player an interface with HumanPlayer and BotPlayer adds abstraction without value. The key insight is separating identity (who you are) from decision-making (how you choose a column).\n\nBotEngine is a separate component:\n```\nclass BotEngine:\n  + chooseMove(game) -> int\n```\nA trivial implementation picks the first valid column. A smarter version evaluates board positions. Critically, BotEngine reads game state (getBoard(), getCurrentPlayer()) but never mutates it — all moves still go through Game.makeMove().\n\nGame and Board do NOT change at all. Game still enforces turns, validates moves, and checks wins. Board still manages the grid. The bot is just a different source for the column number.\n\nGame loop changes:\n```\nwhile game.getGameState() == IN_PROGRESS:\n  current = game.getCurrentPlayer()\n  if current == humanPlayer:\n    column = readFromUserInput()\n  else:\n    column = bot.chooseMove(game)\n  game.makeMove(current, column)\n```\n\nWhy not Player-as-interface? Player has no behavior to polymorphize. getName() and getColor() don't vary between human and bot. The only difference is HOW a column is chosen — which is external to Player. Forcing this into Player couples identity with strategy. If we later want multiple AI difficulty levels, we swap BotEngine implementations without touching Player at all.\n\nThis approach follows the Open/Closed Principle: we add new behavior (AI) without modifying existing classes (Game, Board, Player).",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Direction vectors for win detection",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "List the four (dr, dc) direction vectors used in Connect Four win detection, and state what direction each represents.",
        explanation:
          "The four direction vectors are: (0,1) = horizontal, (1,0) = vertical, (1,1) = diagonal down-right, (-1,1) = diagonal up-right. For each direction, the algorithm counts in both the positive and negative direction from the placed disc, so only four vectors (not eight) are needed.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "(0,1) horizontal, (1,0) vertical, (1,1) diagonal down-right, (-1,1) diagonal up-right",
          acceptableAnswers: [
            "(0,1)",
            "(1,0)",
            "(1,1)",
            "(-1,1)",
            "horizontal",
            "vertical",
            "diagonal",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Why placeDisc returns the row number",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In one sentence, explain why Board.placeDisc() returns the row number where the disc landed, rather than returning void or boolean.",
        explanation:
          "Returning the row lets Game pass the exact (row, column, color) coordinates directly into checkWin without needing to re-scan the board or column to figure out where the disc ended up. This avoids redundant computation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "It lets Game pass (row, column, color) directly into checkWin without re-scanning the column to find where the disc landed.",
          acceptableAnswers: [
            "checkWin",
            "avoid re-scanning",
            "pass to checkWin",
            "know where the disc landed",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "canPlace implementation for top-row check",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "The canPlace(column) method checks if a column has space by examining a single cell. Which cell does it check and why is that sufficient?",
        explanation:
          "canPlace checks grid[0][column] — the top row. If the top row is null (empty), the column has at least one space. If the top row is non-null, the column is completely full because discs fill from the bottom up. This is an O(1) check rather than scanning the entire column.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "grid[0][column] (the top row). If the top cell is empty, the column has space; if occupied, the column is full since discs fill bottom-up.",
          acceptableAnswers: ["top row", "row 0", "grid[0]", "first row"],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Invalid state with enum plus nullable winner",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Even with a GameState enum, what invalid state remains possible when using a separate nullable winner field, and which language feature eliminates it?",
        explanation:
          "The invalid state is state=WON with winner=null (or state=IN_PROGRESS with winner=somePlayer). Discriminated unions / algebraic data types / sealed classes eliminate this by making the WON variant carry the winner payload directly: WON(winner: Player). Supported natively in Rust, Swift, Kotlin (sealed classes), and TypeScript.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "state=WON with winner=null. Discriminated unions (algebraic data types / sealed classes) eliminate it by encoding the winner inside the WON variant.",
          acceptableAnswers: [
            "WON with winner=null",
            "discriminated union",
            "algebraic data type",
            "sealed class",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match classes to their responsibilities",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each Connect Four class/enum to its primary responsibility:",
        explanation:
          "Game orchestrates the entire flow — turns, state transitions, delegating to Board. Board owns the physical grid — disc placement, bounds checking, and win detection. Player is a simple data holder — name and color. GameState enum represents the three possible states. Each has exactly one responsibility, following the Single Responsibility Principle.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Game",
              right: "Orchestrates turns, state transitions, and delegates to Board",
            },
            {
              id: "p2",
              left: "Board",
              right: "Owns the 7×6 grid, handles placement and win detection",
            },
            { id: "p3", left: "Player", right: "Simple data holder with name and disc color" },
            {
              id: "p4",
              left: "GameState",
              right: "Enum with exactly three values: IN_PROGRESS, WON, DRAW",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match extensibility features to affected classes",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each extensibility feature to the class(es) that would primarily need changes:",
        explanation:
          "Undo/move history requires a moveHistory stack and undoLastMove() in Game, plus clearCell() in Board. Configurable board size only changes Board's constructor — all algorithms use rows/cols variables. Computer opponent adds a new BotEngine class but changes neither Game, Board, nor Player. Move history for replay adds tracking in Game with no Board changes. Each feature maps to specific, minimal changes because the design has clean separation of concerns.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Undo / move history",
              right: "Game (moveHistory stack + undoLastMove) + Board (clearCell helper)",
            },
            {
              id: "p2",
              left: "Configurable board size",
              right: "Board only — make rows/cols constructor parameters",
            },
            {
              id: "p3",
              left: "Computer opponent",
              right: "New BotEngine class only — Game, Board, Player unchanged",
            },
            {
              id: "p4",
              left: "Move replay / history export",
              right: "Game only — add Move recording, no Board changes",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match design principles to Connect Four decisions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each design principle to the specific Connect Four design decision that demonstrates it:",
        explanation:
          "Make Invalid States Unrepresentable: GameState enum instead of boolean flags eliminates impossible state combinations. YAGNI: Using direction vectors instead of a WinChecker class hierarchy avoids building extensibility for requirements that will never change. Single Responsibility: Board handles grid logic while Game handles orchestration — each has one reason to change. Separation of Concerns: Game delegates column validation to Board rather than checking grid state directly.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Make Invalid States Unrepresentable",
              right: "GameState enum instead of boolean flags",
            },
            {
              id: "p2",
              left: "YAGNI (You Aren't Gonna Need It)",
              right: "Direction vectors instead of WinChecker class hierarchy",
            },
            {
              id: "p3",
              left: "Single Responsibility Principle",
              right: "Board owns grid logic, Game owns orchestration",
            },
            {
              id: "p4",
              left: "Separation of Concerns",
              right: "Game delegates column validation to Board.placeDisc()",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Connect Four board dimensions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "A standard Connect Four board has _____ columns and _____ rows, and a player wins by connecting _____ discs in a row.",
        explanation:
          "The standard Connect Four board is 7 columns wide and 6 rows tall. A player wins by connecting 4 discs consecutively in any direction (horizontal, vertical, or diagonal).",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "A standard Connect Four board has {{blank1}} columns and {{blank2}} rows, and a player wins by connecting {{blank3}} discs in a row.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "7",
              acceptableAnswers: ["7", "seven"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "6",
              acceptableAnswers: ["6", "six"],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "4",
              acceptableAnswers: ["4", "four"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Boolean flag invalid state count",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Using three boolean flags for game state creates _____ possible combinations, but Connect Four only has _____ valid states.",
        explanation:
          "Three boolean flags (isOver, hasWinner, isDraw) create 2^3 = 8 possible combinations. But Connect Four has exactly 3 valid domain states: in progress, won, and draw. The remaining 5 combinations represent impossible states that the type system cannot prevent.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Using three boolean flags for game state creates {{blank1}} possible combinations, but Connect Four only has {{blank2}} valid states.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "8",
              acceptableAnswers: ["8", "eight"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "3",
              acceptableAnswers: ["3", "three"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Win detection direction count",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "The checkWin algorithm uses _____ direction vectors, but checks _____ total directions because it counts in both the positive and negative direction for each vector.",
        explanation:
          "There are 4 direction vectors: (0,1), (1,0), (1,1), (-1,1). But for each vector, the algorithm counts in both the positive and negative direction from the placed disc, effectively checking 8 directions. This is why only 4 vectors are needed, not 8 — each vector covers both ways.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "The checkWin algorithm uses {{blank1}} direction vectors, but checks {{blank2}} total directions because it counts in both the positive and negative direction for each vector.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "4",
              acceptableAnswers: ["4", "four"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "8",
              acceptableAnswers: ["8", "eight"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Maximum number of moves in a Connect Four game",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "What is the maximum number of moves (disc placements) possible in a single Connect Four game before it must end in either a win or a draw?",
        explanation:
          "A standard Connect Four board has 7 columns × 6 rows = 42 cells. If no player achieves four in a row, the board eventually fills up after 42 moves, resulting in a draw. Therefore 42 is the maximum number of moves before the game must end.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 42,
          tolerance: 0,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Number of possible four-in-a-row lines on the board",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "On a standard 7×6 Connect Four board, how many distinct four-in-a-row lines (positions where 4 consecutive cells exist) are there in total across all directions (horizontal, vertical, and both diagonals)?",
        explanation:
          "Horizontal: 4 positions per row × 6 rows = 24. Vertical: 3 positions per column × 7 columns = 21. Diagonal (down-right): 4 columns × 3 rows of starting positions = 12. Diagonal (up-right): 4 columns × 3 rows of starting positions = 12. Total = 24 + 21 + 12 + 12 = 69.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 69,
          tolerance: 0,
        },
      },
    },
  ],
};
