/**
 * LLD Design Principles — Interview Prep Content
 * Based on HelloInterview extract
 * Covers: KISS, DRY, YAGNI, Separation of Concerns, Law of Demeter,
 * SOLID (SRP, OCP, LSP, ISP, DIP), and tradeoffs between principles
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldDesignPrinciplesContent: StoryPointSeed = {
  title: "Design Principles (SOLID, DRY, KISS & more)",
  description:
    "Master the design principles that guide clean, extensible, and maintainable code — general principles (KISS, DRY, YAGNI, Separation of Concerns, Law of Demeter) and SOLID (SRP, OCP, LSP, ISP, DIP). Learn when to apply them, when they conflict, and how to reason about tradeoffs in LLD interviews.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: General Software Design Principles
    {
      title: "General Software Design Principles — KISS, DRY, YAGNI & More",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "General Software Design Principles",
          blocks: [
            {
              id: "a1",
              type: "heading",
              content: "Why Design Principles Matter in LLD Interviews",
              metadata: { level: 2 },
            },
            {
              id: "a2",
              type: "paragraph",
              content:
                "Design principles guide your decision-making when creating classes, choosing patterns, and structuring code. In an LLD interview, you constantly face choices: Should this be a separate class? Should I use inheritance here? Is this abstraction worth it? Principles give you a framework to make those calls and explain them. Interviewers care that you apply the lessons, not that you recite acronyms.",
            },
            {
              id: "a3",
              type: "heading",
              content: "KISS — Keep It Simple, Stupid",
              metadata: { level: 2 },
            },
            {
              id: "a4",
              type: "paragraph",
              content:
                "The simplest solution that works is usually the right one. If you can solve the problem with a simple conditional instead of a Strategy pattern, do that. If a single class handles the job without getting messy, don't split it up. This is the principle most commonly violated in LLD interviews — candidates over-engineer to show off design pattern knowledge, introducing factories, builders, and decorators when a basic class would suffice.",
            },
            {
              id: "a5",
              type: "quote",
              content:
                "The time to add complexity is when simplicity stops working. If your single class grows to 500 lines with ten different responsibilities, that's when you refactor. Start simple, and let the problem's complexity drive your design choices.",
            },
            {
              id: "a6",
              type: "heading",
              content: "DRY — Don't Repeat Yourself",
              metadata: { level: 2 },
            },
            {
              id: "a7",
              type: "paragraph",
              content:
                "When you find yourself writing the same logic in multiple places, pull it into one place. If three classes all validate email addresses the same way, create a shared validation method. The benefit is maintenance — when validation rules change, you update one method instead of hunting through the codebase.",
            },
            {
              id: "a8",
              type: "paragraph",
              content:
                "But don't take DRY too far. If two pieces of code look similar but serve different purposes, sometimes duplication is fine. Forcing them to share code creates artificial coupling where changes to one break the other. The key is whether the logic is conceptually the same, not just textually similar. DRY also conflicts with KISS — sometimes the simplest solution is to duplicate code in two places rather than build an abstraction.",
            },
            {
              id: "a9",
              type: "heading",
              content: "YAGNI — You Aren't Gonna Need It",
              metadata: { level: 2 },
            },
            {
              id: "a10",
              type: "paragraph",
              content:
                "Build what you need now, not what you might need later. In interviews, when designing a parking lot system, don't add support for valet parking and EV charging unless the requirements specifically mention them. The problem with building for future requirements is you usually guess wrong — you add complexity for scenarios that never happen. Design with extension in mind, but only implement what's needed now.",
            },
            {
              id: "a11",
              type: "heading",
              content: "Separation of Concerns",
              metadata: { level: 2 },
            },
            {
              id: "a12",
              type: "paragraph",
              content:
                "Different parts of your code should handle different responsibilities and should not know about each other's internals. Your UI layer shouldn't contain business logic. Your business logic shouldn't know how data is stored.",
            },
            {
              id: "a13",
              type: "code",
              content:
                '# Bad: Violates Separation of Concerns\nclass TicTacToe:\n    def play(self):\n        while True:\n            for row in self.board:     # Display mixed with game logic\n                print(row)\n            row = int(input())          # Input handling mixed in\n            col = int(input())\n            self.board[row][col] = "X"\n            if self.board[0][0] == self.board[1][1]:  # Win checking mixed in\n                print("Winner!")\n                break\n\n# Good: Follows Separation of Concerns\nclass TicTacToe:\n    def __init__(self, board, display, input_handler):\n        self.board = board\n        self.display = display\n        self.input_handler = input_handler\n\n    def play(self):\n        while not self.board.has_winner():\n            self.display.render(self.board)\n            move = self.input_handler.get_next_move()\n            self.board.make_move(move)\n        self.display.show_winner(self.board.get_winner())',
              metadata: { language: "python" },
            },
            {
              id: "a14",
              type: "heading",
              content: "Law of Demeter (Principle of Least Knowledge)",
              metadata: { level: 2 },
            },
            {
              id: "a15",
              type: "paragraph",
              content:
                "A method should only talk to its immediate friends, not reach through objects to access distant parts of the system. Code like order.getCustomer().getAddress().getZipCode() violates this principle — your code now knows the internal structure of three different objects. Instead, put a method on Order called getCustomerZipCode() that handles the navigation internally.",
            },
            {
              id: "a16",
              type: "paragraph",
              content:
                'Method chaining itself is not the problem. Fluent interfaces like builder.setName("John").setAge(30).build() are fine because they return the same object type. The issue is when chaining leaks internal structure by traversing multiple different object types.',
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: SOLID Principles
    {
      title: "SOLID Principles — SRP, OCP, LSP, ISP, DIP",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Object-Oriented Design Principles (SOLID)",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "SOLID in Context",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "SOLID principles apply specifically to class design and relationships. They come from Java's era of deep inheritance hierarchies. Modern languages often favor simpler approaches — composition over hierarchies, functions over interfaces. Don't break KISS by forcing SOLID patterns where simpler solutions work fine. Apply these principles when the problem calls for them, but recognize when you're adding complexity for its own sake.",
            },
            {
              id: "b3",
              type: "heading",
              content: "SRP — Single Responsibility Principle",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                "A class should have one reason to change. If a class mixes multiple concerns, split them. This is the foundation of good class design.",
            },
            {
              id: "b5",
              type: "code",
              content:
                "# Bad: Report handles content, formatting, AND storage\nclass Report:\n    def generate_content(self) -> str: ...\n    def print_to_pdf(self) -> None: ...   # PDF formatting\n    def save_to_file(self) -> None: ...   # file I/O\n\n# Good: Each class has one responsibility\nclass Report:\n    def generate_content(self) -> str: ...\n\nclass PDFPrinter:\n    def print(self, report: Report) -> None: ...\n\nclass FileStorage:\n    def save(self, content: str) -> None: ...",
              metadata: { language: "python" },
            },
            {
              id: "b6",
              type: "heading",
              content: "OCP — Open/Closed Principle",
              metadata: { level: 2 },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "Classes should be open for extension but closed for modification. Add new behavior by writing new classes that implement interfaces, not by modifying existing code. Every time you modify existing code, you risk breaking things that already work.",
            },
            {
              id: "b8",
              type: "code",
              content:
                '# Bad: Adding crypto requires modifying this method\nclass PaymentProcessor:\n    def process(self, payment_type: str, amount: float) -> None:\n        if payment_type == "credit": ...\n        elif payment_type == "paypal": ...\n\n# Good: Add new payment types without touching existing code\nclass PaymentMethod(ABC):\n    @abstractmethod\n    def process(self, amount: float) -> None: ...\n\nclass CreditCardPayment(PaymentMethod):\n    def process(self, amount: float) -> None: ...\n\nclass CryptoPayment(PaymentMethod):   # NEW — no existing code changed\n    def process(self, amount: float) -> None: ...\n\nclass PaymentProcessor:\n    def process(self, method: PaymentMethod, amount: float) -> None:\n        method.process(amount)',
              metadata: { language: "python" },
            },
            {
              id: "b9",
              type: "heading",
              content: "LSP — Liskov Substitution Principle",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "paragraph",
              content:
                "Subclasses must work wherever the base class works. If your code uses a parent class, it should work with any subclass without knowing which one it is. When a subclass throws an exception for a method the parent provides, or forces callers to add special-case logic (if bird instanceof Penguin), you've violated LSP.",
            },
            {
              id: "b11",
              type: "code",
              content:
                "# Bad: Penguin breaks the expectation that all birds can fly\nclass Bird:\n    def fly(self) -> None: ...\n\nclass Penguin(Bird):\n    def fly(self) -> None:\n        raise NotImplementedError(\"Penguins can't fly\")\n\n# Good: Separate flying behavior into its own interface\nclass Bird(ABC):\n    @abstractmethod\n    def eat(self) -> None: ...\n\nclass FlyingBird(Bird):\n    @abstractmethod\n    def fly(self) -> None: ...\n\nclass Sparrow(FlyingBird):   # Can fly ✓\n    def eat(self): ...\n    def fly(self): ...\n\nclass Penguin(Bird):          # Cannot fly, doesn't claim to ✓\n    def eat(self): ...",
              metadata: { language: "python" },
            },
            {
              id: "b12",
              type: "heading",
              content: "ISP — Interface Segregation Principle",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "Prefer small, focused interfaces over large, general-purpose ones. Don't force classes to implement methods they don't need. Fat interfaces lead to empty implementations or methods that throw exceptions — both are code smells.",
            },
            {
              id: "b14",
              type: "code",
              content:
                "# Bad: Robot must implement eat() and sleep() it doesn't need\nclass Worker:\n    def work(self): ...\n    def eat(self): ...\n    def sleep(self): ...\n\nclass Robot(Worker):\n    def work(self): pass\n    def eat(self): pass    # robots don't eat\n    def sleep(self): pass  # robots don't sleep\n\n# Good: Small, focused interfaces\nclass Workable:\n    def work(self): ...\n\nclass Feedable:\n    def eat(self): ...\n\nclass Restable:\n    def sleep(self): ...\n\nclass Human(Workable, Feedable, Restable): ...\nclass Robot(Workable): ...  # Only implements what it needs",
              metadata: { language: "python" },
            },
            {
              id: "b15",
              type: "heading",
              content: "DIP — Dependency Inversion Principle",
              metadata: { level: 2 },
            },
            {
              id: "b16",
              type: "paragraph",
              content:
                'Depend on abstractions, not concrete implementations. The "inversion" refers to who defines the contract: your business logic defines an interface based on what it needs, and implementations conform to that interface — not the other way around. This matters for testability (inject mocks) and flexibility (swap implementations).',
            },
            {
              id: "b17",
              type: "code",
              content:
                "# Bad: Tightly coupled to a specific implementation\nclass NotificationService:\n    def __init__(self) -> None:\n        self.email_sender = EmailSender()  # hard dependency\n    def notify(self, message: str) -> None:\n        self.email_sender.send(message)\n\n# Good: Depends on abstraction, implementation injected\nclass MessageSender(ABC):\n    @abstractmethod\n    def send(self, message: str) -> None: ...\n\nclass EmailSender(MessageSender):\n    def send(self, message: str) -> None: ...\n\nclass NotificationService:\n    def __init__(self, sender: MessageSender) -> None:\n        self.sender = sender  # injected abstraction\n    def notify(self, message: str) -> None:\n        self.sender.send(message)",
              metadata: { language: "python" },
            },
            {
              id: "b18",
              type: "paragraph",
              content:
                "Note: DIP is a design principle, while dependency injection (passing dependencies through the constructor) is a technique for achieving it. They are related but not the same thing.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Principle Tradeoffs & Cheat Sheet
    {
      title: "Principle Tradeoffs & Interview Cheat Sheet",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Balancing Competing Principles",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "When Principles Conflict",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "Design principles are not absolute rules — they are tools for thinking. They frequently conflict with each other, and recognizing these tensions is what separates senior candidates from junior ones.",
            },
            {
              id: "c3",
              type: "heading",
              content: "DRY vs KISS",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                'Sometimes the simplest solution is to duplicate code in two places rather than build an abstraction. A strong interview answer: "I expect this validation logic to appear in multiple places, but I\'m going to keep it here to avoid unnecessary complexity early. If we see it duplicated three or four times, we can pull it into a shared validator." This shows you can balance competing principles instead of blindly following rules.',
            },
            {
              id: "c5",
              type: "heading",
              content: "YAGNI vs OCP",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "YAGNI says build only what you need now. OCP says design for extension. These seem contradictory, but the resolution is: design with extension points in mind (use interfaces, keep coupling low), but don't implement features you don't need yet. When interviewers ask \"how would you extend this?\", describe how you'd modify the design — but don't build it in your initial design.",
            },
            {
              id: "c7",
              type: "heading",
              content: "SOLID vs KISS",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "SOLID principles come from Java's era of deep inheritance hierarchies. Outside of Java and C#, excessive SOLID is falling out of fashion. Modern languages favor simpler approaches — composition over class hierarchies, functions over interfaces. Don't break KISS by forcing SOLID patterns where simpler solutions work fine.",
            },
            {
              id: "c9",
              type: "heading",
              content: "Quick Reference Cheat Sheet",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "heading",
              content: "General Principles",
              metadata: { level: 3 },
            },
            {
              id: "c11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "KISS → Start simple, add complexity only when needed",
                  "DRY → Reduce duplication, simplify maintenance",
                  "YAGNI → Build for today, not hypothetical futures",
                  "Separation of Concerns → Enable independent testing and changes",
                  "Law of Demeter → Reduce coupling, hide internal structure",
                ],
              },
            },
            {
              id: "c12",
              type: "heading",
              content: "SOLID Principles",
              metadata: { level: 3 },
            },
            {
              id: "c13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "SRP → Keep classes focused on one responsibility",
                  "OCP → Support future requirements without modifying existing code",
                  "LSP → Prevent brittle hierarchies that break at runtime",
                  "ISP → Keep interfaces clean and focused",
                  "DIP → Decouple business logic from implementation details",
                ],
              },
            },
            {
              id: "c14",
              type: "quote",
              content:
                "Focus on the reasoning behind your choices. The principles will show through naturally. Don't name-drop principles constantly — use them to guide decisions and reference them briefly when explaining tradeoffs.",
            },
          ],
          readingTime: 6,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "Most commonly violated principle in LLD interviews",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "According to experienced interviewers, which design principle is most commonly violated by candidates in LLD interviews?",
        explanation:
          "KISS is the most commonly violated principle. Candidates over-engineer to show off their knowledge of design patterns — introducing factories, builders, and decorators when a basic class would work fine. Interviewers want to see that you can distinguish between problems that need sophisticated solutions and problems that need simple ones.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "KISS — candidates over-engineer with unnecessary patterns to impress the interviewer",
              isCorrect: true,
            },
            {
              id: "b",
              text: "DRY — candidates duplicate code in too many places",
              isCorrect: false,
            },
            {
              id: "c",
              text: "SRP — candidates always put too many responsibilities in one class",
              isCorrect: false,
            },
            {
              id: "d",
              text: "LSP — candidates create broken inheritance hierarchies",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "When to pull shared logic into a utility method (DRY)",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Two classes each validate email addresses. The validation logic looks identical in both places. What is the best approach?",
        explanation:
          "The right approach is to evaluate whether the duplication is conceptual (same purpose) or incidental (looks similar but serves different concerns). If conceptually the same, extract to a shared utility — but do so only once you have enough duplication to justify the abstraction. If the two classes might evolve their validation differently, keeping them separate avoids artificial coupling.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Keep duplicated for now; extract to a shared validator only if duplication reaches 3-4 places and the logic is conceptually the same",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Immediately extract to a shared utility — DRY should always be followed without exception",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Create a base class with the validation and have both classes inherit from it",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Leave the duplication permanently since changing it later would be too risky",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "YAGNI in an interview context",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "You're designing a parking lot system. The requirements mention standard and handicapped parking spots. A candidate also adds support for valet parking, EV charging stations, and motorcycle spots. What principle does this violate?",
        explanation:
          "This violates YAGNI (You Aren't Gonna Need It). The candidate is building for future requirements that weren't asked for. This adds complexity without value and often leads to guessing wrong about future needs. The correct approach is to design with extensibility in mind but only implement what the requirements specify.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "YAGNI — building features not mentioned in the requirements adds unnecessary complexity",
              isCorrect: true,
            },
            {
              id: "b",
              text: "KISS — the overall system is too complex",
              isCorrect: false,
            },
            {
              id: "c",
              text: "ISP — the parking spot interface has too many methods",
              isCorrect: false,
            },
            {
              id: "d",
              text: "SRP — the parking lot class has too many responsibilities",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Law of Demeter violation identification",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'Which of the following code examples violates the Law of Demeter?\n\nA: order.getCustomer().getAddress().getZipCode()\nB: builder.setName("John").setAge(30).build()\nC: user.getDisplayName()\nD: logger.info("message")',
        explanation:
          "Option A violates the Law of Demeter because it reaches through Order → Customer → Address → ZipCode, coupling the calling code to the internal structure of three different object types. If any of them change how they organize data, this code breaks. Option B (fluent builder) is fine because it returns the same object type. Options C and D only talk to immediate friends.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "A — it traverses through three different object types, coupling to all their internal structures",
              isCorrect: true,
            },
            {
              id: "b",
              text: "B — method chaining always violates Law of Demeter",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Both A and B — any method chain longer than one call violates the principle",
              isCorrect: false,
            },
            {
              id: "d",
              text: "None of them — Law of Demeter only applies to inheritance, not method calls",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "DIP vs dependency injection distinction",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'A colleague says: "I\'m following DIP because I inject EmailSender through the constructor instead of creating it with new EmailSender()." Is this statement accurate?',
        explanation:
          "Constructor injection alone does not satisfy DIP. Even though the dependency is injected (not hard-coded), NotificationService still depends on the concrete EmailSender class. DIP requires depending on an abstraction (interface), not a concrete type. Dependency injection is a technique for achieving DIP, but you must also introduce an abstraction. They are related but not the same thing.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Partially correct — injection helps but DIP requires depending on an abstraction (interface), not a concrete type like EmailSender",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Fully correct — constructor injection is exactly what DIP means",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Incorrect — DIP has nothing to do with how dependencies are provided",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Incorrect — DIP only applies to database and network dependencies, not classes like EmailSender",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Recognizing a Liskov Substitution Principle violation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "You have a base class Shape with a method area() that returns a positive number. A subclass InfiniteRay extends Shape but throws NotImplementedError in area() because rays don't have an area. Which SOLID principle does this violate?",
        explanation:
          "This violates LSP (Liskov Substitution Principle). Any code that accepts a Shape and calls area() expects a positive number. Passing an InfiniteRay would throw an unexpected exception, breaking the contract established by Shape. The fix is to separate shapes-with-area from shapes-without-area using different base classes or interfaces, similar to the Bird/FlyingBird pattern.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "LSP — the subclass breaks the contract of the parent (area() should return a positive number, not throw)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "SRP — the Shape class has too many responsibilities",
              isCorrect: false,
            },
            {
              id: "c",
              text: "OCP — adding InfiniteRay modified the Shape base class",
              isCorrect: false,
            },
            {
              id: "d",
              text: "ISP — the Shape interface is too large",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "When SOLID conflicts with KISS in practice",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "You're designing a notification system that currently only sends emails. A candidate creates MessageSender interface, EmailSender implementation, NotificationServiceFactory, and a DI container — all for a single notification channel. What is the best assessment?",
        explanation:
          "This is over-engineering (violating KISS) in the name of SOLID. Creating an interface and factory for a single implementation adds complexity with no current benefit. The right approach is to start with a simple EmailNotificationService class. If a second channel (SMS, push) is needed later, refactor to introduce the abstraction then. SOLID principles from Java's era should not override the more fundamental KISS principle.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Over-engineered — an interface, factory, and DI container for one implementation violates KISS without providing current value",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Correctly designed — following DIP and OCP now prevents costly refactoring later",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Only the factory is unnecessary — the interface and DI container are always justified",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Under-engineered — should also add a StrategySelector to choose between notification channels at runtime",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "ISP vs inheritance in real class design",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "You're designing an employee system with HumanEmployee and RobotWorker. Both need to work, but only humans need to eat and sleep. A candidate creates a single Employee base class with work(), eat(), and sleep() methods. What is the most architecturally sound fix?",
        explanation:
          "The best fix is to decompose the fat interface into small, focused interfaces (ISP): Workable, Feedable, Restable. HumanEmployee implements all three; RobotWorker implements only Workable. This avoids empty implementations or exceptions, follows ISP, and avoids fragile multiple inheritance of concrete classes. A single Workable interface would lose the eat/sleep modeling for humans.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Split into small interfaces (Workable, Feedable, Restable) — Human implements all three, Robot implements only Workable",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Remove eat() and sleep() from the base class and add them only to HumanEmployee",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Keep the fat interface but have Robot throw UnsupportedOperationException for eat() and sleep()",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Use a single Workable interface — eating and sleeping are not relevant to the system",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Benefits of Separation of Concerns",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid benefits of following Separation of Concerns in your class design:",
        explanation:
          "Separation of Concerns enables: (1) independent testing — you can test Board, Display, and InputHandler separately, (2) isolated changes — modifying the display doesn't affect game logic, (3) component swapping — replace ConsoleDisplay with GUIDisplay without touching game logic. It does NOT eliminate the need for integration testing — components still need to be tested together to verify correct interaction.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Each component can be tested independently", isCorrect: true },
            {
              id: "b",
              text: "Changes to one concern (e.g., display) don't affect other concerns (e.g., game logic)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Components can be swapped (e.g., console input → GUI input) without modifying other classes",
              isCorrect: true,
            },
            {
              id: "d",
              text: "It eliminates the need for integration testing since each concern is fully isolated",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Red flags that indicate an LSP violation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL code patterns that indicate a Liskov Substitution Principle violation:",
        explanation:
          "All three correct options are LSP violation indicators: (1) throwing NotImplementedError means the subclass can't fulfill the parent's contract, (2) instanceof checks in client code mean the abstraction is leaking — clients need to know the specific subclass, (3) empty/no-op implementations mean the subclass silently violates expectations. Adding new public methods is NOT an LSP violation — subclasses are allowed to extend the parent's behavior as long as they don't break existing contracts.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "A subclass method throws NotImplementedError for a method the parent defines",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Client code uses instanceof/type checks to handle specific subclasses differently",
              isCorrect: true,
            },
            {
              id: "c",
              text: "A subclass provides a no-op (empty) implementation for a parent method that has expected behavior",
              isCorrect: true,
            },
            {
              id: "d",
              text: "A subclass adds new public methods not present in the parent class",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Valid applications of the Open/Closed Principle",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL scenarios where applying the Open/Closed Principle provides genuine value:",
        explanation:
          "OCP is valuable when: (1) a payment processor needs new payment methods regularly — interface-based design avoids modifying stable code, (2) a notification system needs new channels — same pattern. OCP is NOT justified when: a class has a single fixed implementation that will never change (KISS wins), or when applied preemptively to every class regardless of change likelihood (YAGNI wins).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "A payment processor that regularly adds new payment methods (credit, PayPal, crypto, etc.)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A notification system that needs to support new channels (email, SMS, push, Slack)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "A logging utility with a single fixed output format that will never change",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Every class in the codebase, regardless of whether it will ever need extension",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Correct statements about DRY and premature abstraction",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL statements that correctly describe the relationship between DRY, premature abstraction, and KISS:",
        explanation:
          'Correct: (1) DRY applies when logic is conceptually the same, not just textually similar — textual similarity can be coincidental. (2) Premature DRY abstraction can create artificial coupling where changes to one consumer break the other. (3) Acknowledging the tension between DRY and KISS in an interview (e.g., "I\'ll keep it here for now and extract if we see 3-4 duplications") demonstrates senior-level judgment. Incorrect: "two occurrences always justify abstraction" — the Rule of Three exists because two similar pieces may diverge.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Code that looks identical but serves different purposes is NOT a DRY violation — the key is conceptual similarity",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Premature DRY abstraction can create artificial coupling where changes for one consumer break the other",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Acknowledging the DRY vs KISS tension in an interview demonstrates senior-level design judgment",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Two occurrences of similar code always justify extracting a shared abstraction",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Explain SRP and its application to a Report class",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "A Report class has three methods: generate_content(), print_to_pdf(), and save_to_file(). Explain which SOLID principle this violates, why it is problematic, and how you would refactor it. Describe the resulting class structure.",
        explanation:
          "Must identify SRP violation. Should explain: the class has three reasons to change (content logic, PDF formatting, file I/O). Refactoring splits into Report (content), PDFPrinter (formatting), FileStorage (persistence). Each change is then isolated to one class.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "This violates the Single Responsibility Principle (SRP). The Report class has three distinct reasons to change: (1) when the report content structure changes, (2) when the PDF formatting library or rendering logic changes, and (3) when the storage mechanism changes (e.g., switching from local files to cloud storage).\n\nThis is problematic because: changes to PDF rendering could accidentally break content generation; testing report content requires setting up file I/O dependencies; swapping storage backends requires modifying a class that should only care about content.\n\nRefactored structure:\n- Report: Only responsible for generate_content(). Single reason to change: content logic.\n- PDFPrinter: Accepts a Report and handles PDF formatting. Single reason to change: rendering logic.\n- FileStorage: Saves content to disk. Single reason to change: storage mechanism.\n\nNow, when the PDF library changes, only PDFPrinter is touched. When you switch to database storage, only FileStorage changes. Each class can be tested in isolation.",
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Explain how OCP applies to a payment processing system",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "A PaymentProcessor class uses if/elif chains to process different payment types (credit, PayPal). When a new payment type (crypto) is added, the existing method must be modified. Explain which SOLID principle this violates, what risks the current design creates, and how you would redesign it to allow adding new payment types without modifying existing code.",
        explanation:
          "Must identify OCP violation. Should explain: modification risk (changing existing code can break working payments), and show the interface-based refactoring with PaymentMethod ABC, concrete implementations, and a PaymentProcessor that delegates.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "This violates the Open/Closed Principle (OCP). The PaymentProcessor is not closed for modification — every new payment type requires changing the process() method by adding another elif branch.\n\nRisks: (1) Each modification could introduce bugs in existing payment flows that already work. (2) The method grows linearly with each new type, becoming harder to test and maintain. (3) Multiple developers adding different payment types will create merge conflicts in the same method.\n\nRedesigned solution:\n1. Define an abstract PaymentMethod interface with a process(amount) method.\n2. Create concrete implementations: CreditCardPayment, PayPalPayment, CryptoPayment — each implementing the interface.\n3. PaymentProcessor accepts a PaymentMethod and delegates: method.process(amount).\n\nNow adding cryptocurrency support means creating a new CryptoPayment class. The existing PaymentProcessor, CreditCardPayment, and PayPalPayment code never changes. The system is open for extension (new payment types) but closed for modification (existing code untouched).",
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Navigate the DRY vs KISS tradeoff in an interview scenario",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You're designing a system where both UserValidator and OrderValidator need to check email format. The validation logic is identical. In an interview, how would you reason about whether to extract a shared utility or keep the duplication? Explain both sides of the tradeoff and what you would say to the interviewer.",
        explanation:
          "A strong answer: (1) identifies the DRY vs KISS tension explicitly, (2) considers whether the duplication is conceptual (same email rules) or incidental (might diverge), (3) proposes a specific approach with reasoning, (4) demonstrates the verbal framing that shows senior judgment to the interviewer.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "This is a classic DRY vs KISS tradeoff, and how you reason through it matters more than the specific choice.\n\nCase for DRY (extract shared utility):\n- The email validation logic is conceptually the same — both classes validate the same format against the same rules.\n- If email validation rules change (e.g., new TLD support), duplicating the fix in two places is error-prone.\n- A shared EmailValidator utility is a small, focused abstraction with low coupling risk.\n\nCase for KISS (keep duplication):\n- With only two occurrences, the abstraction may be premature — \"Rule of Three\" suggests waiting.\n- User email validation might diverge from Order email validation (e.g., users require verified domains, orders accept any format).\n- The abstraction adds a dependency — both classes now couple to EmailValidator.\n\nWhat I would say in an interview:\n\"I notice both classes validate emails identically. For now, I'll keep the validation in each class to avoid adding a premature abstraction. The logic is simple and only appears in two places. If we add a third validator or the rules become more complex, I'll extract a shared EmailValidator utility. This balances DRY with KISS — I'm not ignoring the duplication, I'm deferring the abstraction until it's clearly justified.\"\n\nThis framing shows the interviewer you understand competing principles and can make deliberate tradeoff decisions.",
          minLength: 150,
          maxLength: 2500,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Design a class hierarchy that satisfies LSP",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You're designing a Vehicle class hierarchy. Some vehicles can fly (Helicopter, Airplane), some can drive (Car, Truck), and some can do both (FlyingCar). A naive approach puts both fly() and drive() on a base Vehicle class. Explain why this violates SOLID principles, and design a class hierarchy that correctly handles this using proper abstraction. Show the class structure.",
        explanation:
          "Must identify both LSP (subclasses forced to implement inapplicable methods) and ISP (fat interface). Solution should use interface segregation: Flyable and Drivable as separate interfaces. FlyingCar implements both. Must not force Car to implement fly() or Helicopter to implement drive().",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "The naive approach violates two SOLID principles:\n\n1. LSP violation: A Car subclass would need to implement fly(), either throwing an exception or returning a no-op. Code that iterates over Vehicle objects and calls fly() would break at runtime when it encounters a Car.\n\n2. ISP violation: The Vehicle base class forces all subclasses to implement methods they don't need (a fat interface).\n\nCorrected design using interface segregation:\n\n```python\nclass Vehicle(ABC):\n    @abstractmethod\n    def get_speed(self) -> float: ...\n    # Only shared behavior ALL vehicles have\n\nclass Flyable(ABC):\n    @abstractmethod\n    def fly(self) -> None: ...\n    @abstractmethod\n    def get_altitude(self) -> float: ...\n\nclass Drivable(ABC):\n    @abstractmethod\n    def drive(self) -> None: ...\n    @abstractmethod\n    def get_lane(self) -> int: ...\n\nclass Car(Vehicle, Drivable):\n    def get_speed(self): ...\n    def drive(self): ...\n    def get_lane(self): ...\n\nclass Helicopter(Vehicle, Flyable):\n    def get_speed(self): ...\n    def fly(self): ...\n    def get_altitude(self): ...\n\nclass FlyingCar(Vehicle, Drivable, Flyable):\n    def get_speed(self): ...\n    def drive(self): ...\n    def get_lane(self): ...\n    def fly(self): ...\n    def get_altitude(self): ...\n```\n\nNow, code that needs flying vehicles accepts Flyable, not Vehicle. No class is forced to implement methods it can't fulfill. FlyingCar correctly composes both capabilities through multiple interface inheritance. LSP is satisfied because every class fulfills its declared contracts.",
          minLength: 150,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Apply Dependency Inversion to make a service testable",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'A NotificationService creates an EmailSender directly in its constructor (this.email_sender = EmailSender()). This makes it impossible to unit test without sending real emails. Apply the Dependency Inversion Principle to make this service testable. Explain the "inversion" in DIP — what exactly is being inverted? Show the before and after class structure.',
        explanation:
          'Must show: (1) the problem — hard-coded dependency prevents testing and swapping implementations, (2) introduce MessageSender interface defined by what the business logic needs, (3) inject implementation through constructor, (4) explain "inversion" — normally implementation defines the contract, with DIP the business logic defines the contract and implementations conform to it.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'BEFORE (violates DIP):\n```python\nclass NotificationService:\n    def __init__(self):\n        self.email_sender = EmailSender()  # hard dependency\n    def notify(self, message):\n        self.email_sender.send(message)\n```\nProblems: (1) Cannot unit test without sending real emails. (2) Cannot swap to SMS without modifying NotificationService. (3) The high-level module (NotificationService) depends on a low-level module (EmailSender).\n\nAFTER (follows DIP):\n```python\nclass MessageSender(ABC):\n    @abstractmethod\n    def send(self, message: str) -> None: ...\n\nclass EmailSender(MessageSender):\n    def send(self, message): # send email\n\nclass SMSSender(MessageSender):\n    def send(self, message): # send SMS\n\nclass NotificationService:\n    def __init__(self, sender: MessageSender):\n        self.sender = sender\n    def notify(self, message):\n        self.sender.send(message)\n```\n\nThe "Inversion" explained:\nNormally, high-level modules conform to whatever interface low-level modules provide (NotificationService adapts to EmailSender\'s API). With DIP, this is inverted: the HIGH-LEVEL module (NotificationService) defines the interface it needs (MessageSender), and LOW-LEVEL modules (EmailSender, SMSSender) conform to that interface. The contract flows from business logic downward, not from implementation upward.\n\nTestability: In tests, inject a MockSender that records calls without sending real messages. The business logic is completely decoupled from the delivery mechanism.',
          minLength: 150,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Refactor a class that violates multiple SOLID principles",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Consider this class:\n\n```python\nclass OrderService:\n    def __init__(self):\n        self.db = MySQLDatabase()\n        self.mailer = GmailSender()\n    \n    def place_order(self, order):\n        self.db.insert("orders", order)\n        self.mailer.send(order.customer_email, "Order confirmed")\n        if order.type == "express":\n            self.schedule_express_delivery(order)\n        elif order.type == "standard":\n            self.schedule_standard_delivery(order)\n```\n\nIdentify ALL SOLID principles this class violates and explain how to refactor it. Show the resulting class structure.',
        explanation:
          "Must identify: SRP (order placement + notification + delivery scheduling), OCP (if/elif for delivery types), DIP (hard-coded MySQL and Gmail dependencies). Should refactor into: OrderService (orchestration only), OrderRepository interface + MySQLOrderRepository, NotificationService interface + EmailNotificationService, DeliveryScheduler interface + ExpressDeliveryScheduler + StandardDeliveryScheduler.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'This class violates three SOLID principles:\n\n1. SRP violation: OrderService has three responsibilities — persistence (db.insert), notification (mailer.send), and delivery scheduling. Each of these changes for different reasons.\n\n2. DIP violation: The constructor creates concrete MySQLDatabase and GmailSender directly. The class cannot be tested without a real MySQL instance and Gmail account. It cannot switch to PostgreSQL or SendGrid without modification.\n\n3. OCP violation: The if/elif chain for delivery types must be modified every time a new delivery type is added (e.g., "same-day", "international").\n\nRefactored design:\n\n```python\n# Abstractions\nclass OrderRepository(ABC):\n    @abstractmethod\n    def save(self, order) -> None: ...\n\nclass Notifier(ABC):\n    @abstractmethod\n    def send(self, recipient: str, message: str) -> None: ...\n\nclass DeliveryScheduler(ABC):\n    @abstractmethod\n    def schedule(self, order) -> None: ...\n\n# Concrete implementations\nclass MySQLOrderRepository(OrderRepository): ...\nclass EmailNotifier(Notifier): ...\nclass ExpressDeliveryScheduler(DeliveryScheduler): ...\nclass StandardDeliveryScheduler(DeliveryScheduler): ...\n\n# Refactored OrderService — orchestration only\nclass OrderService:\n    def __init__(self, repo: OrderRepository, notifier: Notifier, scheduler: DeliveryScheduler):\n        self.repo = repo\n        self.notifier = notifier\n        self.scheduler = scheduler\n\n    def place_order(self, order):\n        self.repo.save(order)\n        self.notifier.send(order.customer_email, "Order confirmed")\n        self.scheduler.schedule(order)\n```\n\nThe delivery type selection is resolved by the caller providing the correct DeliveryScheduler implementation — the if/elif is eliminated. Each class has one responsibility, depends on abstractions, and new delivery types are added by creating new classes.',
          minLength: 200,
          maxLength: 3500,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Name the SOLID principle for focused interfaces",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "A Robot class is forced to implement eat() and sleep() methods from a Worker interface even though robots don't eat or sleep. Which SOLID principle does this violate? Name the principle and its one-sentence definition.",
        explanation:
          "This violates the Interface Segregation Principle (ISP): prefer small, focused interfaces over large, general-purpose ones. Don't force classes to implement methods they don't need. The fix is to split Worker into Workable, Feedable, and Restable interfaces.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Interface Segregation Principle (ISP) — prefer small, focused interfaces over large ones; don't force classes to implement methods they don't need.",
          acceptableAnswers: ["ISP", "Interface Segregation Principle", "interface segregation"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Fix a Law of Demeter violation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "The code order.getCustomer().getAddress().getZipCode() violates the Law of Demeter. Suggest a one-method fix that preserves the same functionality.",
        explanation:
          "Add a method getCustomerZipCode() directly on Order that handles the navigation internally. This encapsulates the chain and only exposes the needed data. If Customer or Address restructures its internals, only Order's implementation changes — callers are unaffected.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Add order.getCustomerZipCode() that internally navigates through Customer and Address, hiding the chain from callers.",
          acceptableAnswers: [
            "getCustomerZipCode",
            "get_customer_zip_code",
            "getShippingZipCode",
            "wrapper method",
            "delegate method",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Distinguish DIP from dependency injection",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In one or two sentences, explain the difference between Dependency Inversion Principle (DIP) and dependency injection. Why is the distinction important?",
        explanation:
          "DIP is a design principle — depend on abstractions, not concrete implementations. Dependency injection is a technique — pass dependencies through the constructor instead of creating them internally. You can use injection without DIP (inject a concrete class) and you can follow DIP without injection (service locator pattern). The distinction matters because injection alone doesn't give you DIP's benefits of decoupling.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "DIP is a design principle (depend on abstractions, not concretions). Dependency injection is a technique (pass dependencies via constructor). You can inject a concrete class without following DIP — both are needed for true decoupling.",
          acceptableAnswers: [
            "principle vs technique",
            "abstraction",
            "DIP is a principle",
            "injection is a technique",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "When does YAGNI override OCP",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "A candidate creates an abstract NotificationChannel interface, a NotificationChannelFactory, and a ChannelRegistry — but the system currently only sends emails. In one sentence, explain which two principles are in tension and which one should win.",
        explanation:
          'YAGNI and KISS are in tension with OCP. YAGNI/KISS should win here — building abstractions for a single implementation adds complexity with no current value. When a second channel is needed, refactoring to add the interface is straightforward. Over-engineering "just in case" is the most common mistake candidates make in LLD interviews.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "YAGNI/KISS conflicts with OCP — YAGNI should win because building interfaces, factories, and registries for a single implementation adds complexity with no current benefit.",
          acceptableAnswers: ["YAGNI", "KISS", "YAGNI wins", "KISS wins", "over-engineering"],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match general design principles to their core rule",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each general design principle to its core rule:",
        explanation:
          "KISS guides toward simplicity as the default. DRY targets duplicated logic (but only when conceptually the same). YAGNI prevents premature feature building. Separation of Concerns isolates responsibilities. Law of Demeter limits knowledge of internal structures.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "KISS",
              right: "The simplest solution that works is usually the right one",
            },
            {
              id: "p2",
              left: "DRY",
              right: "Pull repeated logic into one place to simplify maintenance",
            },
            {
              id: "p3",
              left: "YAGNI",
              right: "Build what you need now, not what you might need later",
            },
            {
              id: "p4",
              left: "Law of Demeter",
              right: "A method should only talk to its immediate friends",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match SOLID principles to the problem they solve",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each SOLID principle to the specific design problem it addresses:",
        explanation:
          "SRP prevents classes with multiple reasons to change. OCP prevents requiring code modification to add new behavior. LSP prevents subclasses that break parent class contracts at runtime. ISP prevents classes from being forced to implement irrelevant methods. DIP prevents tight coupling between business logic and implementation details.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            { id: "p1", left: "SRP", right: "A class that changes for multiple unrelated reasons" },
            {
              id: "p2",
              left: "OCP",
              right: "Adding new behavior requires modifying existing code",
            },
            {
              id: "p3",
              left: "LSP",
              right: "Subclass throws NotImplementedError for a parent method",
            },
            { id: "p4", left: "ISP", right: "Classes forced to implement methods they don't use" },
            {
              id: "p5",
              left: "DIP",
              right: "Business logic creates concrete dependencies directly",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match code smells to the principle they violate",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each code smell to the design principle it primarily violates:",
        explanation:
          "An if/elif chain adding new types means existing code must be modified (OCP). A 500-line class with 10 concerns has many reasons to change (SRP). order.getCustomer().getAddress().getCity() reaches through multiple object internals (Law of Demeter). Creating Factory + Registry + DI container for a single implementation adds unneeded complexity (KISS/YAGNI). A Robot implementing eat() = no-op to satisfy a fat interface means the interface forces irrelevant methods (ISP).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "if/elif chain for each new payment type",
              right: "Open/Closed Principle (OCP)",
            },
            {
              id: "p2",
              left: "500-line class handling UI, logic, and persistence",
              right: "Single Responsibility Principle (SRP)",
            },
            {
              id: "p3",
              left: "order.getCustomer().getAddress().getCity()",
              right: "Law of Demeter",
            },
            {
              id: "p4",
              left: "Factory + Registry + DI container for one implementation",
              right: "KISS / YAGNI",
            },
            {
              id: "p5",
              left: "Robot.eat() returns no-op to satisfy Worker interface",
              right: "Interface Segregation Principle (ISP)",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "SOLID acronym expansion",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          'The "S" in SOLID stands for _____ Responsibility Principle, and the "D" stands for Dependency _____ Principle.',
        explanation:
          'S = Single Responsibility Principle — a class should have one reason to change. D = Dependency Inversion Principle — depend on abstractions, not concrete implementations. The "inversion" means the business logic defines the interface, and implementations conform to it.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            'The "S" in SOLID stands for {{blank1}} Responsibility Principle, and the "D" stands for Dependency {{blank2}} Principle.',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Single",
              acceptableAnswers: ["Single", "single"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "Inversion",
              acceptableAnswers: ["Inversion", "inversion"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "OCP core definition",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The Open/Closed Principle states that classes should be open for _____ but closed for _____.",
        explanation:
          "Open for extension means you can add new behavior (e.g., a new PaymentMethod implementation). Closed for modification means existing code does not need to change when new behavior is added. This is typically achieved through interfaces and polymorphism.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The Open/Closed Principle states that classes should be open for {{blank1}} but closed for {{blank2}}.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "extension",
              acceptableAnswers: ["extension", "extending"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "modification",
              acceptableAnswers: ["modification", "modifying", "changes"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Law of Demeter and coupling",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "The Law of Demeter says a method should only talk to its _____ friends. Violating it by chaining through multiple objects creates tight _____ between your code and distant objects' internal structure.",
        explanation:
          "A method should talk to its immediate (direct) friends — its own fields, parameters, and locally created objects. Chaining through multiple different object types creates tight coupling — if any intermediate object changes its structure, your code breaks. The fix is to provide higher-level methods that hide the navigation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "The Law of Demeter says a method should only talk to its {{blank1}} friends. Violating it by chaining through multiple objects creates tight {{blank2}} between your code and distant objects' internal structure.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "immediate",
              acceptableAnswers: ["immediate", "direct", "close", "nearest"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "coupling",
              acceptableAnswers: ["coupling", "dependencies", "dependency"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
