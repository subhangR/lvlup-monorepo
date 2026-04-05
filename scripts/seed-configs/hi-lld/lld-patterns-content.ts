/**
 * Design Patterns — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: Creational (Factory, Builder, Singleton), Structural (Decorator, Facade),
 * Behavioral (Strategy, Observer, State Machine) patterns with tradeoffs and real usage
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldPatternsContent: StoryPointSeed = {
  title: "Design Patterns for LLD Interviews",
  description:
    "Master the 8 design patterns that actually matter in modern LLD interviews — Factory, Builder, Singleton, Decorator, Facade, Strategy, Observer, and State Machine. Learn when to use each, when NOT to, and how to reason about pattern selection under interview pressure.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Creational Patterns
    {
      title: "Creational Patterns — Factory, Builder, Singleton",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Creational Patterns — Factory, Builder, Singleton",
          blocks: [
            {
              id: "a1",
              type: "heading",
              content: "What Are Creational Patterns?",
              metadata: { level: 2 },
            },
            {
              id: "a2",
              type: "paragraph",
              content:
                "Creational patterns control how objects get created. They hide construction details, let you swap implementations, and keep your code from being tightly coupled to specific classes. In interviews, you will encounter Factory most frequently, Builder occasionally for complex configurations, and Singleton rarely.",
            },
            {
              id: "a3",
              type: "heading",
              content: "Factory Method",
              metadata: { level: 2 },
            },
            {
              id: "a4",
              type: "paragraph",
              content:
                'A factory is a helper that makes the right kind of object for you so you don\'t have to decide which one to create. Factories hide creation logic and keep your code flexible when the exact type you need can change. Factory shows up regularly in interviews when requirements say "support different notification types" or "handle multiple payment methods." Instead of writing `new EmailNotification()` throughout your code, you call `notificationFactory.create(type)`. Now when you add SMS notifications, you update the factory — the rest of your code never changes.',
            },
            {
              id: "a5",
              type: "code",
              content:
                'class Notification(ABC):\n    @abstractmethod\n    def send(self, message: str) -> None:\n        pass\n\nclass EmailNotification(Notification):\n    def send(self, message: str) -> None:\n        # Email sending logic\n        pass\n\nclass SMSNotification(Notification):\n    def send(self, message: str) -> None:\n        # SMS sending logic\n        pass\n\nclass NotificationFactory:\n    @staticmethod\n    def create(notification_type: str) -> Notification:\n        if notification_type == "email":\n            return EmailNotification()\n        elif notification_type == "sms":\n            return SMSNotification()\n        raise ValueError("Unknown type")\n\n# Usage\nnotif = NotificationFactory.create("email")\nnotif.send("Hello")',
              metadata: { language: "python" },
            },
            {
              id: "a6",
              type: "quote",
              content:
                'This is technically called Simple Factory, not the Gang of Four Factory Method pattern. The GoF version uses abstract factory classes with subclasses that override a factory method. It\'s more complex and rarely shows up in real code or interviews. What we show here is what people actually build and what interviewers expect when they say "use a factory."',
            },
            {
              id: "a7",
              type: "heading",
              content: "Factory — Key Insight",
              metadata: { level: 3 },
            },
            {
              id: "a8",
              type: "paragraph",
              content:
                "Factory controls WHICH object gets instantiated. It makes the decision once and returns the right type. This is different from Strategy, which decides which BEHAVIOR to use after the object already exists. Factory is about creation; Strategy is about delegation.",
            },
            {
              id: "a9",
              type: "heading",
              content: "Builder",
              metadata: { level: 2 },
            },
            {
              id: "a10",
              type: "paragraph",
              content:
                "A builder lets you create a complex object step by step without worrying about the order or messy construction details. Use it when an object has many optional parts or configuration choices. This shows up when designing things like HTTP requests, database queries, or configuration objects. Instead of a constructor with ten parameters where half are null, you build the object incrementally.",
            },
            {
              id: "a11",
              type: "code",
              content:
                'class HttpRequest:\n    def __init__(self):\n        self.url = None\n        self.method = None\n        self.headers = {}\n        self.body = None\n\n    class Builder:\n        def __init__(self):\n            self._request = HttpRequest()\n\n        def url(self, url: str) -> \'HttpRequest.Builder\':\n            self._request.url = url\n            return self\n\n        def method(self, method: str) -> \'HttpRequest.Builder\':\n            self._request.method = method\n            return self\n\n        def header(self, key: str, value: str) -> \'HttpRequest.Builder\':\n            self._request.headers[key] = value\n            return self\n\n        def body(self, body: str) -> \'HttpRequest.Builder\':\n            self._request.body = body\n            return self\n\n        def build(self) -> \'HttpRequest\':\n            if self._request.url is None:\n                raise ValueError("URL is required")\n            return self._request\n\n# Usage\nrequest = (HttpRequest.Builder()\n    .url("https://api.example.com")\n    .method("POST")\n    .header("Content-Type", "application/json")\n    .body(\'{"key": "value"}\')\n    .build())',
              metadata: { language: "python" },
            },
            {
              id: "a12",
              type: "paragraph",
              content:
                "Builder most commonly shows up in LLD interviews when designing API clients or complex configurations, but is rarely needed in other contexts. If the interviewer didn't describe a complex object with lots of optional details, Builder probably isn't needed. Most interview problems involve simple domain objects with 2-4 required fields where a normal constructor works fine.",
            },
            {
              id: "a13",
              type: "heading",
              content: "Singleton",
              metadata: { level: 2 },
            },
            {
              id: "a14",
              type: "paragraph",
              content:
                "Singleton ensures only one instance of a class exists. Use it when you need exactly one shared resource like a configuration manager, connection pool, or logger. Most of the time you don't actually need a Singleton — you can just pass shared objects through constructors instead. It's clearer and easier to test. Singletons hide dependencies and make testing harder.",
            },
            {
              id: "a15",
              type: "code",
              content:
                "class DatabaseConnection:\n    _instance = None\n\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\n    def query(self, sql: str) -> None:\n        # Database operations\n        pass\n\n# Usage — both point to the same instance\ndb1 = DatabaseConnection()\ndb2 = DatabaseConnection()\nassert db1 is db2  # True",
              metadata: { language: "python" },
            },
            {
              id: "a16",
              type: "quote",
              content:
                'In interviews, know what Singleton is and when NOT to use it. If an interviewer asks "should this be a Singleton?", the answer is usually no unless they explicitly want a single shared instance across the entire system.',
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 2: Structural Patterns
    {
      title: "Structural Patterns — Decorator & Facade",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Structural Patterns — Decorator & Facade",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What Are Structural Patterns?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Structural patterns deal with how objects connect to each other. They help you build flexible relationships between classes without creating tight coupling or messy dependencies.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Decorator",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                'A decorator adds behavior to an object without changing its class. Use it when you need to layer on extra functionality at runtime. You might need this when requirements say things like "add logging to specific operations" or "encrypt certain messages." Instead of creating subclasses for every combination (LoggedEmailNotification, EncryptedEmailNotification, LoggedEncryptedEmailNotification), you wrap the base object with decorators. If you see words like "optional features," "stack behaviors," or "combine multiple enhancements," think Decorator.',
            },
            {
              id: "b5",
              type: "code",
              content:
                'class DataSource(ABC):\n    @abstractmethod\n    def write_data(self, data: str) -> None: pass\n\n    @abstractmethod\n    def read_data(self) -> str: pass\n\nclass FileDataSource(DataSource):\n    def __init__(self, filename: str):\n        self.filename = filename\n\n    def write_data(self, data: str) -> None:\n        # Write to file\n        pass\n\n    def read_data(self) -> str:\n        return "data from file"\n\nclass EncryptionDecorator(DataSource):\n    def __init__(self, source: DataSource):\n        self._wrapped = source\n\n    def write_data(self, data: str) -> None:\n        encrypted = self._encrypt(data)\n        self._wrapped.write_data(encrypted)  # Delegate\n\n    def read_data(self) -> str:\n        return self._decrypt(self._wrapped.read_data())\n\nclass CompressionDecorator(DataSource):\n    def __init__(self, source: DataSource):\n        self._wrapped = source\n\n    def write_data(self, data: str) -> None:\n        self._wrapped.write_data(self._compress(data))\n\n    def read_data(self) -> str:\n        return self._decompress(self._wrapped.read_data())\n\n# Usage — stack decorators in any order\nsource = FileDataSource("data.txt")\nsource = EncryptionDecorator(source)\nsource = CompressionDecorator(source)\nsource.write_data("sensitive info")\n# Data gets compressed, then encrypted, then written',
              metadata: { language: "python" },
            },
            {
              id: "b6",
              type: "heading",
              content: "Decorator vs Subclass — When to Choose",
              metadata: { level: 3 },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "Use Decorator when behavior depends on runtime conditions (wrap with logging only in debug mode, add caching only for certain requests). Use normal subclasses when the new behavior is fixed at design time and represents a stable variation. Each decorator adds one piece of functionality and can be stacked in any order. In real systems, order often affects behavior — compression then encryption produces different results than encryption then compression.",
            },
            {
              id: "b8",
              type: "heading",
              content: "Facade",
              metadata: { level: 2 },
            },
            {
              id: "b9",
              type: "paragraph",
              content:
                "A facade is a coordinator class that hides complexity behind a simple interface. You're probably already building facades in every LLD interview without calling them that. Your Game class in Tic Tac Toe? That's a facade. Any orchestrator that coordinates multiple components behind a clean interface? Also a facade. The pattern name just describes what good orchestrator design looks like.",
            },
            {
              id: "b10",
              type: "code",
              content:
                'class Game:  # This IS a facade\n    def __init__(self):\n        self.board = Board()\n        self.player_x = Player("X")\n        self.player_o = Player("O")\n        self.current_player = self.player_x\n        self.state = GameState.IN_PROGRESS\n\n    def make_move(self, row: int, col: int) -> bool:\n        # Coordinates board, player, and state logic\n        # Caller doesn\'t understand internal details\n        if self.state != GameState.IN_PROGRESS:\n            return False\n        if not self.board.place_mark(row, col,\n                self.current_player.get_mark()):\n            return False\n        if self.board.check_win(row, col):\n            self.state = GameState.WON\n        elif self.board.is_full():\n            self.state = GameState.DRAW\n        else:\n            self._switch_player()\n        return True\n\n# Usage — simple interface hides coordination\ngame = Game()\ngame.make_move(0, 0)\ngame.make_move(1, 1)',
              metadata: { language: "python" },
            },
            {
              id: "b11",
              type: "quote",
              content:
                "Almost nobody names Facade in interviews. Build clean orchestrators naturally and name the pattern afterward if it helps communicate. Don't worry about announcing it by name.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Behavioral Patterns
    {
      title: "Behavioral Patterns — Strategy, Observer, State Machine",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Behavioral Patterns — Strategy, Observer, State Machine",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "What Are Behavioral Patterns?",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "Behavioral patterns control how objects interact and distribute responsibilities. They are about the flow of control and communication between objects. Strategy, Observer, and State Machine are the three behavioral patterns that actually matter in LLD interviews.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Strategy",
              metadata: { level: 2 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "Strategy replaces conditional logic with polymorphism. Use it when you have different ways of doing the same thing and you want to swap them at runtime. Strategy is the single most common pattern in LLD interviews because it directly tests whether you understand polymorphism and composition over inheritance. When you see a pile of if/else or switch statements based on type, that's a Strategy pattern waiting to happen. If you learn one pattern, make it this one.",
            },
            {
              id: "c5",
              type: "code",
              content:
                'class PaymentStrategy(ABC):\n    @abstractmethod\n    def pay(self, amount: float) -> bool:\n        pass\n\nclass CreditCardPayment(PaymentStrategy):\n    def __init__(self, card_number: str):\n        self.card_number = card_number\n\n    def pay(self, amount: float) -> bool:\n        print(f"Paid {amount} with credit card")\n        return True\n\nclass PayPalPayment(PaymentStrategy):\n    def __init__(self, email: str):\n        self.email = email\n\n    def pay(self, amount: float) -> bool:\n        print(f"Paid {amount} with PayPal")\n        return True\n\nclass ShoppingCart:\n    def __init__(self):\n        self.payment_strategy = None\n\n    def set_payment_strategy(self, strategy: PaymentStrategy):\n        self.payment_strategy = strategy\n\n    def checkout(self, amount: float):\n        self.payment_strategy.pay(amount)\n\n# Usage — swap behavior at runtime\ncart = ShoppingCart()\ncart.set_payment_strategy(CreditCardPayment("1234-5678"))\ncart.checkout(100.00)\ncart.set_payment_strategy(PayPalPayment("user@example.com"))\ncart.checkout(50.00)',
              metadata: { language: "python" },
            },
            {
              id: "c6",
              type: "heading",
              content: "Strategy vs Factory — The Critical Distinction",
              metadata: { level: 3 },
            },
            {
              id: "c7",
              type: "paragraph",
              content:
                "Factory decides which TYPE to instantiate — it makes the creation decision. Strategy decides which BEHAVIOR to use after the object already exists — it makes the delegation decision. Strategy swaps behavior at runtime through composition. The cart holds a reference to a strategy and delegates to it. A common interview mistake is confusing the two.",
            },
            {
              id: "c8",
              type: "heading",
              content: "Observer",
              metadata: { level: 2 },
            },
            {
              id: "c9",
              type: "paragraph",
              content:
                'Observer lets objects subscribe to events and get notified when something happens. Use it when changes in one object need to trigger updates in other objects. This shows up when designing systems where multiple components care about state changes — a stock price changes and multiple displays need to update, or a user places an order and inventory, notifications, and analytics all need to know. If the problem involves the words "notify" or "update multiple components," you\'re probably looking at Observer.',
            },
            {
              id: "c10",
              type: "code",
              content:
                'class Observer(ABC):\n    @abstractmethod\n    def update(self, symbol: str, price: float) -> None:\n        pass\n\nclass Subject(ABC):\n    @abstractmethod\n    def attach(self, observer: Observer) -> None: pass\n\n    @abstractmethod\n    def detach(self, observer: Observer) -> None: pass\n\n    @abstractmethod\n    def notify_observers(self) -> None: pass\n\nclass Stock(Subject):\n    def __init__(self, symbol: str):\n        self._observers: list[Observer] = []\n        self.symbol = symbol\n        self.price = 0.0\n\n    def attach(self, observer: Observer) -> None:\n        self._observers.append(observer)\n\n    def detach(self, observer: Observer) -> None:\n        self._observers.remove(observer)\n\n    def set_price(self, price: float) -> None:\n        self.price = price\n        self.notify_observers()  # Price changed, tell everyone\n\n    def notify_observers(self) -> None:\n        for observer in self._observers:\n            observer.update(self.symbol, self.price)\n\nclass PriceDisplay(Observer):\n    def update(self, symbol: str, price: float) -> None:\n        print(f"Display: {symbol} = ${price}")\n\nclass PriceAlert(Observer):\n    def __init__(self, threshold: float):\n        self.threshold = threshold\n\n    def update(self, symbol: str, price: float) -> None:\n        if price > self.threshold:\n            print(f"Alert! {symbol} exceeded ${self.threshold}")\n\n# Usage\nstock = Stock("AAPL")\nstock.attach(PriceDisplay())\nstock.attach(PriceAlert(150.00))\nstock.set_price(155.00)  # Both observers notified',
              metadata: { language: "python" },
            },
            {
              id: "c11",
              type: "heading",
              content: "State Machine",
              metadata: { level: 2 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                "A state machine handles state transitions cleanly. Use it when an object's behavior changes based on its internal state and you have complex transition rules. If there's a state machine in your solution, the interview is probably organized around it — it's the most important thing to talk through. This shows up when designing vending machines, document workflows, or game states. Instead of scattered conditionals checking current state everywhere, you encapsulate each state's behavior in its own class.",
            },
            {
              id: "c13",
              type: "code",
              content:
                'class VendingMachineState(ABC):\n    @abstractmethod\n    def insert_coin(self, machine: \'VendingMachine\'): pass\n\n    @abstractmethod\n    def select_product(self, machine: \'VendingMachine\'): pass\n\n    @abstractmethod\n    def dispense(self, machine: \'VendingMachine\'): pass\n\nclass NoCoinState(VendingMachineState):\n    def insert_coin(self, machine):\n        print("Coin inserted")\n        machine.set_state(HasCoinState())\n\n    def select_product(self, machine):\n        print("Insert coin first")\n\n    def dispense(self, machine):\n        print("Insert coin first")\n\nclass HasCoinState(VendingMachineState):\n    def insert_coin(self, machine):\n        print("Coin already inserted")\n\n    def select_product(self, machine):\n        print("Product selected")\n        machine.set_state(DispenseState())\n\n    def dispense(self, machine):\n        print("Select product first")\n\nclass DispenseState(VendingMachineState):\n    def insert_coin(self, machine):\n        print("Please wait, dispensing")\n\n    def select_product(self, machine):\n        print("Please wait, dispensing")\n\n    def dispense(self, machine):\n        print("Dispensing product")\n        machine.set_state(NoCoinState())\n\nclass VendingMachine:\n    def __init__(self):\n        self._state = NoCoinState()\n\n    def set_state(self, state: VendingMachineState):\n        self._state = state\n\n    def insert_coin(self): self._state.insert_coin(self)\n    def select_product(self): self._state.select_product(self)\n    def dispense(self): self._state.dispense(self)',
              metadata: { language: "python" },
            },
            {
              id: "c14",
              type: "heading",
              content: "When to Draw a State Diagram",
              metadata: { level: 3 },
            },
            {
              id: "c15",
              type: "paragraph",
              content:
                "Drawing a state diagram is one of the best ways to communicate a state machine design in an interview. Show the states as circles, transitions as arrows labeled with actions. Interviewers appreciate the visual — it shows you're thinking clearly about the problem. If \"state\" appears multiple times in the requirements, you're probably looking at a state machine.",
            },
            {
              id: "c16",
              type: "heading",
              content: "Pattern Selection Cheat Sheet",
              metadata: { level: 2 },
            },
            {
              id: "c17",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Factory → "support different types" or "handle multiple methods" → centralizes creation logic',
                  'Builder → "lots of optional fields" or "complex configuration" → step-by-step construction',
                  'Singleton → "exactly one shared instance" (rare) → global access point',
                  'Decorator → "optional features" or "stack behaviors" → layered runtime enhancement',
                  'Facade → "coordinate multiple components" → clean orchestrator interface',
                  'Strategy → "if/else on type" or "swap behaviors" → polymorphic delegation',
                  'Observer → "notify" or "update multiple components" → event-driven decoupling',
                  'State Machine → "behavior depends on state" or "complex transitions" → state-encapsulated behavior',
                ],
              },
            },
            {
              id: "c18",
              type: "quote",
              content:
                "Most interview-ready designs use no patterns, or at most one or two. If you're reaching for three or more, you're probably forcing it and over-engineering. Patterns arise from good design decisions rather than driving them.",
            },
          ],
          readingTime: 15,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "Factory vs new keyword",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "A system needs to send notifications via email, SMS, or push. Which is the primary benefit of using a Factory to create notification objects instead of calling `new EmailNotification()` directly throughout the codebase?",
        explanation:
          "The Factory centralizes creation logic in one place. When you add a new notification type (e.g., push), you modify only the factory. All callers continue to use `factory.create(type)` — they never need to know about the new class. Direct instantiation scatters knowledge of concrete classes throughout the codebase, so adding a type means finding and updating every call site.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Adding a new notification type requires changing only the factory — callers remain untouched because they depend on the abstraction, not concrete classes",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Factories make objects immutable, preventing accidental state modification after creation",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Factories are faster at runtime because they cache previously created instances",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Factories ensure thread safety by synchronizing all object creation",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "When Builder is appropriate",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "You're designing a class to represent a database query. The query has a required table name, optional WHERE clause, optional ORDER BY, optional LIMIT, and optional JOIN. Which pattern is most appropriate for constructing this object?",
        explanation:
          "Builder is designed for objects with many optional parameters. Instead of a constructor with five parameters where most are null, Builder lets you set only what you need in a readable, step-by-step manner. Factory would help choose WHICH query type to create, not HOW to construct one. Strategy is about swappable behaviors, not object construction. Singleton has nothing to do with construction complexity.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Builder — the object has many optional fields, making step-by-step construction more readable than a parameter-heavy constructor",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Factory — we need to decide which concrete query type to instantiate",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Strategy — we need to swap between different query execution algorithms",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Singleton — there should only be one query builder instance to avoid conflicts",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Identifying the Strategy pattern",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Which code smell is the strongest signal that the Strategy pattern should be applied?",
        explanation:
          "A growing chain of if/else or switch statements that branch on type to execute different behaviors is the classic signal for Strategy. Each branch represents a strategy that should be its own class, with the context delegating to the current strategy via polymorphism. This eliminates the conditional logic entirely. Deep inheritance is an unrelated smell. Multiple constructors suggest Builder. Unused interface methods suggest Interface Segregation, not Strategy.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A growing if/else or switch chain that branches on type to execute different behaviors for the same operation",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A deep inheritance hierarchy where subclasses only override a single method",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A class with multiple constructors accepting different parameter combinations",
              isCorrect: false,
            },
            {
              id: "d",
              text: "An interface with methods that many implementations leave empty",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Strategy vs Factory distinction",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A ShoppingCart uses a PaymentStrategy for checkout, and a NotificationFactory creates notification objects. What is the fundamental difference between what these two patterns control?",
        explanation:
          "Factory controls object creation — it decides WHICH concrete type to instantiate and returns it. Strategy controls behavior delegation — an already-existing context object holds a reference to a strategy and delegates work to it at runtime. Factory makes a creation decision (which class?). Strategy makes a behavioral decision (which algorithm?). Both use polymorphism, but at different lifecycle points.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Factory decides which TYPE to instantiate (creation). Strategy decides which BEHAVIOR to delegate to after the object already exists (runtime delegation).",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Factory is for creational concerns while Strategy is for structural concerns — they operate in different pattern categories",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Factory returns new objects each time while Strategy reuses the same object — the difference is in memory allocation",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Factory uses inheritance (subclass overrides factory method) while Strategy uses composition (context holds a reference) — they are structurally different",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Decorator stacking order matters",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'Given `source = FileDataSource("f.txt")`, `source = EncryptionDecorator(source)`, `source = CompressionDecorator(source)`, in what order are operations applied when you call `source.write_data("hello")`?',
        explanation:
          "Decorators wrap from inside out, so when write_data is called on the outermost CompressionDecorator, it compresses first, then delegates to EncryptionDecorator which encrypts, then delegates to FileDataSource which writes. The outermost decorator executes first on write. On read_data, the order reverses — read from file, then decrypt, then decompress. This is why stacking order matters in real systems.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Compress → Encrypt → Write to file (outermost decorator processes first on write)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Encrypt → Compress → Write to file (innermost decorator processes first on write)",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Write to file → Encrypt → Compress (base writes first, then decorators post-process)",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The order is undefined — decorators can execute in any sequence",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Observer pattern coupling direction",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In the Observer pattern, a Stock (Subject) notifies PriceDisplay and PriceAlert (Observers) on price changes. What is the coupling direction, and why does it matter?",
        explanation:
          "The Subject knows it has observers (it holds the list and calls update()), but it does not know what any specific observer does with the data. Observers know the Subject's data interface (they receive symbol and price) but have no coupling to each other. This means you can add new observers (e.g., TradingBot) without modifying Stock or existing observers — the Subject is oblivious to who is listening. This is the key extensibility benefit.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Subject depends on the Observer interface (not concrete observers) — new observers can be added without modifying the Subject or existing observers",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Observers depend on each other through the Subject — removing one observer can break others that rely on execution order",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The coupling is bidirectional — Subject references Observers and Observers reference the Subject, creating a potential circular dependency",
              isCorrect: false,
            },
            {
              id: "d",
              text: "There is no coupling — the Subject and Observers communicate through a message queue middleware",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "State Machine vs if/else state checking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'A vending machine has 4 states and 3 actions per state. A junior developer implements it with if/elif chains checking `self.state` in each method. A senior developer uses the State pattern (each state is a class). Beyond readability, what is the senior approach\'s critical advantage when the interviewer says "now add a MAINTENANCE state"?',
        explanation:
          "With the State pattern, adding MAINTENANCE means creating one new class that implements the three action methods — all existing state classes are untouched. The new class compiles independently and gets plugged in. With if/elif chains, you must find and modify every method to add a new branch, and you must ensure every method handles the new state (easy to miss one). The State pattern makes it impossible to forget — the abstract base class forces you to implement all methods. This is the Open/Closed Principle in action.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Adding a state means creating one new class — existing state classes are untouched, and the abstract base class forces all actions to be implemented (Open/Closed Principle)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The State pattern prevents invalid transitions at compile time, while if/elif chains allow any state to transition to any other state",
              isCorrect: false,
            },
            {
              id: "c",
              text: "State classes can be unit tested in isolation, while if/elif methods require testing all 12 state-action combinations in a single test",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The State pattern uses polymorphic dispatch which is O(1), while if/elif chains are O(n) where n is the number of states",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Pattern over-engineering in interviews",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "You're designing a Parking Lot system. The requirements mention: vehicles of different sizes (car, truck, motorcycle), a single fee calculation method, and tracking occupancy. A candidate proposes using Factory for vehicle creation, Strategy for fee calculation, Observer for occupancy tracking, and Decorator for premium parking features. What is wrong with this approach?",
        explanation:
          "Using four patterns for a straightforward Parking Lot is classic over-engineering. Vehicle types map naturally to an enum or simple class hierarchy — no Factory needed. A single fee formula doesn't need Strategy (no runtime swapping). Occupancy is a simple counter, not an event system requiring Observer. Premium features aren't stackable runtime behaviors requiring Decorator. Most interview-ready designs use zero to two patterns. Reaching for three or more signals you're forcing patterns rather than solving the problem. The fix: simple inheritance for vehicles, a direct calculation for fees, a counter for occupancy.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "It's over-engineered — four patterns for a simple domain signals forcing patterns rather than solving the problem. Most good LLD answers use 0-2 patterns.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The patterns are individually correct but conflict with each other — Factory and Strategy can't coexist in the same design",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The candidate missed the Singleton pattern for the ParkingLot itself, which is the most important pattern for this problem",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Observer is the wrong pattern for occupancy — the Mediator pattern should be used instead for component communication",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Behavioral patterns identification",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL patterns that belong to the Behavioral category (patterns that control how objects interact and distribute responsibilities):",
        explanation:
          "Strategy (swappable algorithms), Observer (event subscription), and State Machine (state-dependent behavior) are all behavioral patterns — they control object interaction and communication flow. Factory is creational (controls object creation). Decorator is structural (controls object composition).",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Strategy — replaces conditional logic with polymorphic delegation",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Observer — lets objects subscribe to events and get notified on changes",
              isCorrect: true,
            },
            {
              id: "c",
              text: "State Machine — encapsulates state-dependent behavior in state classes",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Factory — centralizes object creation logic in one place",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Decorator — layers optional behaviors on objects at runtime",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid reasons to avoid Singleton",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid reasons why Singleton is generally discouraged in modern software design and rarely the right choice in interviews:",
        explanation:
          "Singleton hides dependencies (callers access it globally instead of declaring it as a parameter), makes unit testing harder (can't easily substitute a mock), and creates global mutable state that can lead to surprising interactions. Passing shared objects through constructors is clearer and more testable. However, Singleton does NOT inherently violate SRP (it manages its own instance lifecycle) and does NOT prevent subclassing in all languages.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Hides dependencies — callers access it globally instead of declaring it as a constructor parameter",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Makes unit testing harder — you can't easily substitute a mock or test double",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Creates global mutable state — any code anywhere can change the Singleton's state, leading to surprising interactions",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Violates Single Responsibility Principle — managing instance lifecycle is a separate concern",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Prevents subclassing entirely — Singleton classes cannot be extended",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Situations that call for Observer",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL scenarios where the Observer pattern is the most appropriate solution:",
        explanation:
          "Observer fits when one state change triggers updates in multiple independent components: stock price → multiple displays, order placement → multiple subsystems, auction bid → multiple watchers. A single fee calculation doesn't have multiple listeners — it's just a computation. A configuration file loaded at startup is a one-time read, not an event stream.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "A stock price changes and multiple displays, alert systems, and trading bots must react",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A user places an order and inventory, notifications, analytics, and billing must all be updated",
              isCorrect: true,
            },
            {
              id: "c",
              text: "An auction receives a new bid and all active watchers need to see the updated highest bid",
              isCorrect: true,
            },
            {
              id: "d",
              text: "A parking lot needs to calculate the fee for a single vehicle based on its duration and type",
              isCorrect: false,
            },
            {
              id: "e",
              text: "A system needs to load a configuration file at startup and share the values across modules",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Decorator pattern properties",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content: "Select ALL statements that are true about the Decorator pattern:",
        explanation:
          "Decorators implement the same interface as the wrapped object (so they're interchangeable), can be stacked in any order (each decorator wraps another DataSource), and add behavior without modifying the original class (open/closed). However, decorators do NOT require the wrapped object to be aware of decoration (it's transparent to the inner object), and stacking order CAN affect the output — compress-then-encrypt produces different results than encrypt-then-compress.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Decorators implement the same interface as the object they wrap, making them interchangeable with the original",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Multiple decorators can be stacked on the same object, each adding one piece of functionality",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Decorators add behavior without modifying the original class — they follow the Open/Closed Principle",
              isCorrect: true,
            },
            {
              id: "d",
              text: 'The wrapped object must implement a special "decoratable" interface for the pattern to work',
              isCorrect: false,
            },
            {
              id: "e",
              text: "Decorator stacking order never affects behavior — compress-then-encrypt always equals encrypt-then-compress",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Explain when to use Strategy vs inheritance",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "A ride-sharing app has different pricing algorithms: standard pricing, surge pricing, and subscription-based pricing. The pricing algorithm can change per ride based on demand. A junior developer proposes using a Ride base class with StandardRide, SurgeRide, and SubscriptionRide subclasses. Explain why Strategy is a better fit than inheritance here, and describe the class design you would use.",
        explanation:
          "Must address: pricing varies per ride at runtime (not fixed at creation), inheritance ties pricing to identity, Strategy allows composition where pricing can be swapped. Should show PricingStrategy interface with concrete implementations and Ride holding a strategy reference.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'The inheritance approach fails because pricing is not an identity — it\'s a behavior that changes at runtime based on demand. A ride doesn\'t become a "SurgeRide" permanently; the same ride request might switch from surge to standard if demand drops while being processed.\n\nWith inheritance, the Ride type is fixed at creation. You\'d need to create a new SurgeRide object and copy all fields when pricing changes, which is awkward and error-prone. Worse, if you later add a "pool pricing" variant, you need a fourth subclass — and if pricing and vehicle type both vary, you get a combinatorial explosion (StandardCarRide, SurgeCarRide, StandardBikeRide, SurgeBikeRide...).\n\nWith Strategy, pricing is a composable behavior:\n\n```\nclass PricingStrategy(ABC):\n    @abstractmethod\n    def calculate(self, distance: float, duration: float) -> float:\n        pass\n\nclass StandardPricing(PricingStrategy):\n    def calculate(self, distance, duration) -> float:\n        return distance * 1.5 + duration * 0.25\n\nclass SurgePricing(PricingStrategy):\n    def __init__(self, multiplier: float):\n        self.multiplier = multiplier\n\n    def calculate(self, distance, duration) -> float:\n        return (distance * 1.5 + duration * 0.25) * self.multiplier\n\nclass Ride:\n    def __init__(self, pricing: PricingStrategy):\n        self.pricing = pricing\n\n    def set_pricing(self, pricing: PricingStrategy):\n        self.pricing = pricing\n\n    def get_fare(self, distance, duration) -> float:\n        return self.pricing.calculate(distance, duration)\n```\n\nNow pricing can be swapped mid-ride, new pricing types require one new class with zero changes to Ride, and vehicle types can vary independently.',
          minLength: 150,
          maxLength: 2500,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Observer vs direct method calls",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "An e-commerce system needs to react when an order is placed: update inventory, send a confirmation email, record analytics, and notify the warehouse. A developer writes `placeOrder()` that directly calls `inventory.update()`, `emailService.send()`, `analytics.record()`, and `warehouse.notify()`. Explain the problems with this approach and how Observer solves them.",
        explanation:
          "Must identify: tight coupling (Order knows all downstream systems), adding new reactions requires modifying placeOrder, removing a system requires editing the method. Observer decouples the Order from its listeners via a subscription mechanism.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Problems with direct calls:\n\n1. **Tight coupling**: The Order class directly depends on InventoryService, EmailService, AnalyticsService, and WarehouseService. It imports and knows about all four systems. If any of their APIs change, Order must be modified.\n\n2. **Open/Closed violation**: When the team adds a fifth reaction (e.g., update the loyalty points system), someone must modify placeOrder() to add `loyaltyService.update()`. Every new downstream system requires editing the core order logic.\n\n3. **Fragile ordering**: If `emailService.send()` throws an exception, `analytics.record()` and `warehouse.notify()` never execute. The order placement is entangled with every downstream operation.\n\n4. **Testing burden**: Unit testing placeOrder() requires mocking four unrelated services.\n\nObserver solution:\n\n```python\nclass OrderEventSubject:\n    def __init__(self):\n        self._observers = []\n\n    def attach(self, observer): self._observers.append(observer)\n    def detach(self, observer): self._observers.remove(observer)\n\n    def notify_order_placed(self, order):\n        for observer in self._observers:\n            observer.on_order_placed(order)\n```\n\nNow `placeOrder()` calls `self.notify_order_placed(order)` — one line instead of four. Each downstream system registers as an observer. Adding loyalty points means creating a LoyaltyObserver and calling `attach()` — zero changes to Order. Removing a system means calling `detach()`. Order is completely decoupled from who is listening.",
          minLength: 150,
          maxLength: 2500,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design a document workflow with State Machine",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a document approval workflow using the State Machine pattern. The document has four states: DRAFT, UNDER_REVIEW, APPROVED, and REJECTED. From DRAFT it can be submitted (→ UNDER_REVIEW). From UNDER_REVIEW it can be approved (→ APPROVED) or rejected (→ REJECTED). From REJECTED it can be revised (→ DRAFT). APPROVED is a terminal state. Show the class hierarchy and explain why the State Machine pattern is preferable to if/elif chains for this problem.",
        explanation:
          "Must show: abstract DocumentState with submit/approve/reject/revise methods, four concrete state classes with transitions, Document context class. Must explain: State pattern prevents invalid transitions at design time and makes adding states (e.g., NEEDS_REVISION) a single new class with no changes to existing states.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Class hierarchy:\n\n```\nclass DocumentState(ABC):\n    @abstractmethod\n    def submit(self, doc: Document) -> None: pass\n\n    @abstractmethod\n    def approve(self, doc: Document) -> None: pass\n\n    @abstractmethod\n    def reject(self, doc: Document) -> None: pass\n\n    @abstractmethod\n    def revise(self, doc: Document) -> None: pass\n\nclass DraftState(DocumentState):\n    def submit(self, doc):\n        doc.set_state(UnderReviewState())\n\n    def approve(self, doc):\n        raise InvalidTransition("Cannot approve a draft")\n\n    def reject(self, doc):\n        raise InvalidTransition("Cannot reject a draft")\n\n    def revise(self, doc):\n        raise InvalidTransition("Draft is already editable")\n\nclass UnderReviewState(DocumentState):\n    def submit(self, doc):\n        raise InvalidTransition("Already under review")\n\n    def approve(self, doc):\n        doc.set_state(ApprovedState())\n\n    def reject(self, doc):\n        doc.set_state(RejectedState())\n\n    def revise(self, doc):\n        raise InvalidTransition("Cannot revise while under review")\n\nclass ApprovedState(DocumentState):\n    def submit(self, doc): raise InvalidTransition("Already approved")\n    def approve(self, doc): raise InvalidTransition("Already approved")\n    def reject(self, doc): raise InvalidTransition("Already approved")\n    def revise(self, doc): raise InvalidTransition("Already approved")\n\nclass RejectedState(DocumentState):\n    def submit(self, doc):\n        raise InvalidTransition("Submit via revise first")\n\n    def approve(self, doc):\n        raise InvalidTransition("Cannot approve rejected")\n\n    def reject(self, doc):\n        raise InvalidTransition("Already rejected")\n\n    def revise(self, doc):\n        doc.set_state(DraftState())\n\nclass Document:\n    def __init__(self):\n        self._state = DraftState()\n\n    def set_state(self, state: DocumentState):\n        self._state = state\n\n    def submit(self): self._state.submit(self)\n    def approve(self): self._state.approve(self)\n    def reject(self): self._state.reject(self)\n    def revise(self): self._state.revise(self)\n```\n\nWhy State Machine over if/elif:\n\n1. **Invalid transitions are impossible to miss**: The abstract class forces every state to handle every action. With if/elif, forgetting to add a branch for REJECTED in the approve() method means a silent bug — the action does nothing.\n\n2. **Adding states is additive**: If the interviewer says "add a NEEDS_REVISION state," you create one new class and update transitions in UnderReviewState. No existing state logic is modified — Open/Closed Principle.\n\n3. **State-specific behavior is co-located**: Everything about how UnderReview behaves lives in one class. With if/elif, that behavior is scattered across four separate method bodies, making it hard to reason about "what can happen in this state?"',
          minLength: 200,
          maxLength: 3500,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Decorator vs subclass explosion analysis",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A notification system needs to support: Email, SMS, and Push channels. Each can optionally have: logging, retry logic, and rate limiting. Using subclasses, how many classes would you need to cover all combinations? How does the Decorator pattern solve this? What tradeoff does Decorator introduce?",
        explanation:
          "Must calculate: 3 base types × 2^3 optional combinations = 24 classes with subclassing, vs 3 base + 3 decorators = 6 classes. Must explain: Decorator's tradeoff is runtime complexity — debugging a deeply wrapped chain is harder, and the execution path is non-obvious.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Subclass explosion analysis:\n\n3 base channels (Email, SMS, Push) × 8 optional feature combinations (each of logging, retry, rate-limiting can be present or absent = 2³ = 8) = 24 classes:\n- EmailNotification, EmailWithLogging, EmailWithRetry, EmailWithRateLimit, EmailWithLoggingRetry, EmailWithLoggingRateLimit, EmailWithRetryRateLimit, EmailWithLoggingRetryRateLimit... × 3 channels = 24 classes.\n\nAnd if you add a fourth optional feature (e.g., encryption), it becomes 3 × 2⁴ = 48 classes. Each new optional feature doubles the class count.\n\nDecorator solution — 6 classes total:\n\n```python\n# 3 base classes\nclass EmailNotification(Notification): ...\nclass SMSNotification(Notification): ...\nclass PushNotification(Notification): ...\n\n# 3 decorators (work with ANY notification type)\nclass LoggingDecorator(Notification):\n    def __init__(self, wrapped: Notification):\n        self._wrapped = wrapped\n    def send(self, msg):\n        log(f"Sending: {msg}")\n        self._wrapped.send(msg)\n\nclass RetryDecorator(Notification): ...\nclass RateLimitDecorator(Notification): ...\n\n# Compose at runtime\nnotif = EmailNotification()\nnotif = LoggingDecorator(notif)\nnotif = RetryDecorator(notif)\n# Email with logging and retry — no new class needed\n```\n\nAdding a fourth feature (encryption) means ONE new class — EncryptionDecorator. Total: 7 classes instead of 48.\n\nTradeoffs of Decorator:\n1. **Debugging complexity**: A `RateLimitDecorator(RetryDecorator(LoggingDecorator(EmailNotification())))` has a 4-level call stack. Stack traces show nested delegate calls that are harder to follow than a single concrete class.\n2. **Order sensitivity**: Retry-then-RateLimit behaves differently from RateLimit-then-Retry. The compose order is implicit — callers must know which order is correct.\n3. **Identity confusion**: `isinstance(decorated, EmailNotification)` returns False because the outermost object is a decorator. Type checks break unless you add forwarding logic.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Pattern selection for a real LLD problem",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You're designing a movie ticket booking system. Requirements: (1) multiple payment methods (credit card, UPI, wallet), (2) booking state transitions (PENDING → CONFIRMED → CANCELLED or PENDING → EXPIRED), (3) seat selection with different pricing (regular, premium, VIP). Identify which design patterns apply, justify each choice, and identify which aspects do NOT need a pattern.",
        explanation:
          "Must identify: Strategy for payment, State Machine for booking lifecycle. Must argue: seat pricing is a simple data attribute (not a pattern), and seat selection is straightforward logic. Should discuss the danger of applying too many patterns.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Pattern analysis for each requirement:\n\n**1. Multiple payment methods → Strategy**\nPayment methods are interchangeable behaviors: the booking calls `paymentStrategy.pay(amount)` and doesn't care whether it's credit card, UPI, or wallet. A customer can change their payment method for each booking. This is the textbook Strategy use case — different algorithms for the same operation, swappable at runtime.\n\n```python\nclass PaymentStrategy(ABC):\n    @abstractmethod\n    def pay(self, amount: float) -> bool: pass\n\nclass CreditCardPayment(PaymentStrategy): ...\nclass UPIPayment(PaymentStrategy): ...\nclass WalletPayment(PaymentStrategy): ...\n```\n\n**2. Booking state transitions → State Machine**\nBookings have clear states (PENDING, CONFIRMED, CANCELLED, EXPIRED) with rules about which transitions are valid. PENDING can become CONFIRMED or EXPIRED. CONFIRMED can become CANCELLED. EXPIRED is terminal. Invalid transitions should be rejected (you can't cancel an expired booking). This is exactly when State Machine shines — state-dependent behavior with transition validation.\n\n```python\nclass BookingState(ABC):\n    @abstractmethod\n    def confirm(self, booking): pass\n    @abstractmethod\n    def cancel(self, booking): pass\n    @abstractmethod\n    def expire(self, booking): pass\n```\n\n**3. Seat pricing (regular, premium, VIP) → NO PATTERN NEEDED**\nDifferent seat prices are just data — a seat has a type and a price multiplier. This is a simple enum or class attribute, not a behavioral variation:\n```python\nclass SeatType(Enum):\n    REGULAR = 1.0\n    PREMIUM = 1.5\n    VIP = 2.5\n```\nNo Strategy, no Factory — just a price lookup. Applying a pattern here would be over-engineering.\n\n**Summary**: 2 patterns (Strategy + State Machine) for a moderately complex system. The seat pricing doesn't need a pattern — recognizing this is just as important as identifying where patterns belong. Forcing a third pattern would signal over-engineering to an interviewer.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Compare Strategy and State patterns structurally",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Strategy and State patterns have almost identical class structures — a context holds a reference to an interface, and concrete implementations provide different behaviors. Explain the key differences in intent, who triggers the swap, and how you would decide between them when both seem applicable.",
        explanation:
          "Must distinguish: Strategy is chosen externally (caller selects algorithm), State transitions are triggered internally (current state decides next state). Strategy is stateless algorithm swap; State carries transition logic. Decision heuristic: if the behavior depends on accumulated state/history, use State; if it depends on external selection, use Strategy.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Strategy and State have near-identical UML diagrams but differ fundamentally in intent and control flow:\n\n**Intent:**\n- Strategy: Replace one algorithm with another. The algorithms are independent and don't know about each other. `CreditCardPayment` has no concept of `PayPalPayment`.\n- State: Model state-dependent behavior where the current state determines valid actions AND the next state. `HasCoinState` knows about `DispenseState` because it triggers the transition.\n\n**Who triggers the swap:**\n- Strategy: External — the caller (client code) selects which strategy to use. `cart.set_payment_strategy(new CreditCardPayment(...))` is called by the application.\n- State: Internal — the current state class decides the next state. `HasCoinState.select_product()` calls `machine.set_state(new DispenseState())`. The context doesn't know or decide its next state.\n\n**Awareness of other implementations:**\n- Strategy implementations are independent. They share an interface but have no references to each other.\n- State implementations reference each other. Each state class instantiates the states it can transition to.\n\n**Decision heuristic:**\n1. Does the behavior depend on accumulated history or a lifecycle? → **State**. A vending machine has been through NoCoin → HasCoin → Dispense — its history determines its behavior.\n2. Does the behavior depend on an external choice with no concept of transitions? → **Strategy**. A payment method is chosen by the user, not determined by the previous payment method.\n3. Can multiple behaviors be valid simultaneously? → **Strategy** (you could have a primary and fallback payment method). State is always exactly one active state.\n\nWhen both seem applicable: if objects transition between behaviors automatically based on internal events, choose State. If behaviors are selected by external agents and don't affect each other, choose Strategy.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Name the pattern from the symptom",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'A ShoppingCart class has a checkout() method with a growing if/elif chain: `if payment_type == "credit": ... elif payment_type == "paypal": ... elif payment_type == "crypto": ...`. Name the design pattern that eliminates this conditional logic and explain in one sentence how it works.',
        explanation:
          "Strategy pattern — define a PaymentStrategy interface with a pay() method, implement each payment type as a concrete strategy, and have the ShoppingCart delegate to the current strategy instead of branching on type. This replaces conditional logic with polymorphic dispatch.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Strategy — extract each payment branch into a class implementing a common interface, and have the cart delegate to the current strategy via polymorphism.",
          acceptableAnswers: ["Strategy", "strategy", "Strategy pattern"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Facade in disguise",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In an LLD interview for a Tic Tac Toe game, your Game class coordinates Board, Player, and GameState components behind a simple make_move() method. What design pattern does the Game class naturally represent, even if you never name it?",
        explanation:
          "Facade — the Game class hides the complexity of coordinating Board, Player, and GameState behind a clean, simple interface (make_move). Callers don't need to understand the internal component interactions. Most LLD orchestrator classes are facades without explicitly being named as such.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Facade — it coordinates multiple internal components (Board, Player, GameState) behind a simple public interface.",
          acceptableAnswers: ["Facade", "facade", "Façade"],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Decorator vs Python decorator syntax",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "The Decorator design pattern and Python's @decorator syntax share a name but are fundamentally different. Explain the key distinction in 1-2 sentences.",
        explanation:
          "The Decorator design pattern is an object composition pattern — you wrap one object inside another that shares the same interface to add behavior at runtime. Python's @decorator is a language-level syntax for function/class modification at definition time — it transforms a function by passing it through another function. They're different mechanisms despite the shared name.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "The Decorator design pattern uses object composition at runtime (wrapping objects that share an interface). Python's @decorator is a function transformation at definition time (passing a function through another function).",
          acceptableAnswers: [
            "composition",
            "runtime",
            "object",
            "function transformation",
            "definition time",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Simple Factory vs GoF Factory Method",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'What interviewers call "Factory" is technically Simple Factory. The GoF Factory Method is different. In 1-2 sentences, explain the structural difference between them.',
        explanation:
          "Simple Factory is a single class with a create() method that uses conditionals to decide which type to return. GoF Factory Method uses an abstract creator class with subclasses that override a factory method to return different types — the creation decision is deferred to subclasses via inheritance rather than centralized in conditionals.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Simple Factory uses one class with conditionals in a create() method. GoF Factory Method uses an abstract creator with subclasses that override the factory method — creation is deferred to subclasses via inheritance.",
          acceptableAnswers: [
            "subclass",
            "override",
            "abstract creator",
            "inheritance",
            "deferred",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match patterns to their categories",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each design pattern to its correct category:",
        explanation:
          "Factory and Singleton are creational (control object creation). Decorator is structural (controls object composition). Strategy and Observer are behavioral (control object interaction). The three categories organize patterns by what aspect of the system they address.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Factory",
              right: "Creational — controls which concrete object gets instantiated",
            },
            {
              id: "p2",
              left: "Decorator",
              right: "Structural — adds behavior by wrapping objects that share an interface",
            },
            {
              id: "p3",
              left: "Strategy",
              right: "Behavioral — swaps algorithms at runtime via polymorphic delegation",
            },
            {
              id: "p4",
              left: "Observer",
              right: "Behavioral — notifies subscribers when state changes occur",
            },
            {
              id: "p5",
              left: "Singleton",
              right: "Creational — ensures only one instance of a class exists",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match requirement keywords to patterns",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each interview requirement keyword/phrase to the design pattern it most strongly signals:",
        explanation:
          '"Support different types" signals Factory (creation routing). "Optional features that can be combined" signals Decorator (stackable wrappers). "Notify all subscribers" signals Observer (event broadcasting). "Behavior depends on current state" signals State Machine (state-encapsulated transitions). "Swap algorithms at runtime" signals Strategy (polymorphic delegation).',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: '"Support different notification types"',
              right: "Factory — centralizes creation routing based on type",
            },
            {
              id: "p2",
              left: '"Optional features that can be combined"',
              right: "Decorator — stackable runtime behavior wrappers",
            },
            {
              id: "p3",
              left: '"Notify all subscribers when price changes"',
              right: "Observer — event subscription and broadcasting",
            },
            {
              id: "p4",
              left: '"Behavior depends on current state"',
              right: "State Machine — state-encapsulated transition logic",
            },
            {
              id: "p5",
              left: '"Swap between different pricing algorithms"',
              right: "Strategy — interchangeable algorithms via composition",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match patterns to their primary tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each design pattern to its most significant tradeoff or limitation:",
        explanation:
          'Singleton hides dependencies and makes testing hard. Decorator creates deep call chains that are hard to debug. Observer can cause unexpected cascading updates. State Machine requires every state to handle every action (even invalid ones). Factory can become a "god class" if it accumulates too many creation paths.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Singleton",
              right:
                "Hidden dependencies — any code can access it, making coupling invisible and testing difficult",
            },
            {
              id: "p2",
              left: "Decorator",
              right:
                "Deep nesting complexity — debugging a 4-layer wrapped chain produces confusing stack traces",
            },
            {
              id: "p3",
              left: "Observer",
              right:
                "Cascading updates — one notification can trigger observers that trigger further notifications, creating hard-to-trace chains",
            },
            {
              id: "p4",
              left: "State Machine",
              right:
                "Forced exhaustiveness — every state must handle every action, even when most are invalid (raises exceptions)",
            },
            {
              id: "p5",
              left: "Factory",
              right:
                "God class risk — accumulating many creation paths makes the factory a change hotspot that violates Open/Closed",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Pattern categories",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Design patterns fit into three categories: _____ patterns control how objects are created, _____ patterns control how objects connect to each other, and behavioral patterns control how objects interact.",
        explanation:
          "The three GoF categories are Creational (Factory, Builder, Singleton), Structural (Decorator, Facade), and Behavioral (Strategy, Observer, State). Each addresses a different aspect of object-oriented design.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Design patterns fit into three categories: {{blank1}} patterns control how objects are created, {{blank2}} patterns control how objects connect to each other, and behavioral patterns control how objects interact.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "creational",
              acceptableAnswers: ["creational", "Creational"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "structural",
              acceptableAnswers: ["structural", "Structural"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Strategy pattern core mechanism",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The Strategy pattern replaces conditional logic (if/else chains) with _____, allowing you to swap behaviors at _____ through composition.",
        explanation:
          "Strategy uses polymorphism to eliminate type-checking conditionals. Instead of branching on type, each behavior is a class implementing a common interface. The context holds a reference and delegates to it, allowing the behavior to be swapped at runtime without modifying the context.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The Strategy pattern replaces conditional logic (if/else chains) with {{blank1}}, allowing you to swap behaviors at {{blank2}} through composition.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "polymorphism",
              acceptableAnswers: ["polymorphism", "polymorphic dispatch", "polymorphic delegation"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "runtime",
              acceptableAnswers: ["runtime", "run time", "run-time"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Observer pattern terminology",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "In the Observer pattern, the object being watched is called the _____, and objects that subscribe to changes are called _____. When state changes, the subject calls _____ to push updates to all registered listeners.",
        explanation:
          "The Subject (or Observable) maintains a list of Observers and calls notify_observers() (or notifyAll/notifyObservers) when its state changes. This push-based notification decouples the subject from knowing what observers do with the data.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "In the Observer pattern, the object being watched is called the {{blank1}}, and objects that subscribe to changes are called {{blank2}}. When state changes, the subject calls {{blank3}} to push updates to all registered listeners.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Subject",
              acceptableAnswers: [
                "Subject",
                "subject",
                "Observable",
                "observable",
                "Publisher",
                "publisher",
              ],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "Observers",
              acceptableAnswers: [
                "Observers",
                "observers",
                "Subscribers",
                "subscribers",
                "Listeners",
                "listeners",
              ],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "notify_observers",
              acceptableAnswers: [
                "notify_observers",
                "notifyObservers",
                "notify",
                "notifyAll",
                "notify_all",
              ],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
