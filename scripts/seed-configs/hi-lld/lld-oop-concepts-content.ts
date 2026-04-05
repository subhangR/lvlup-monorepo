/**
 * OOP Concepts — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: encapsulation, abstraction, polymorphism, inheritance,
 * composition over inheritance, and practical application in LLD interviews
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldOopConceptsContent: StoryPointSeed = {
  title: "OOP Concepts for LLD Interviews",
  description:
    "Master the four pillars of OOP — encapsulation, abstraction, polymorphism, and inheritance — with a focus on how they show up in low-level design interviews. Learn when to use each, when to prefer composition over inheritance, and how to apply these concepts naturally during class design.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Encapsulation & Abstraction
    {
      title: "Encapsulation & Abstraction",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Encapsulation & Abstraction",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Encapsulation",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Encapsulation means keeping an object's data private and letting the object control how that data is used. You interact with it through simple methods instead of reaching in and changing its internal details yourself.",
            },
            {
              id: "b3",
              type: "paragraph",
              content:
                "The benefit is predictability. When your Account class owns its balance field and only lets you modify it through deposit() and withdraw(), you can enforce rules in those methods — prevent negative balances, log transactions, update related state. If the balance was public and anyone could write to it directly, you'd have no guarantee those rules get followed.",
            },
            {
              id: "b4",
              type: "heading",
              content: "What Interviewers Look For",
              metadata: { level: 3 },
            },
            {
              id: "b5",
              type: "paragraph",
              content:
                "In interviews, encapsulation shows up as a basic hygiene check. Do your classes expose their fields directly, or do they provide methods? Are you returning references to mutable internal collections that callers can modify, or are you returning copies? Leaving fields public tells the interviewer you don't control invariants.",
            },
            {
              id: "b6",
              type: "heading",
              content: "Bad: No Encapsulation",
              metadata: { level: 3 },
            },
            {
              id: "b7",
              type: "code",
              content:
                "class ParkingLot:\n    def __init__(self):\n        self.spots: list[ParkingSpot] = []  # public, mutable\n\n# Anyone can do:\n# lot.spots.append(random_spot)\n# lot.spots.clear()\n# lot.spots = []",
              metadata: { language: "python" },
            },
            {
              id: "b8",
              type: "heading",
              content: "Good: Proper Encapsulation",
              metadata: { level: 3 },
            },
            {
              id: "b9",
              type: "code",
              content:
                "class ParkingLot:\n    def __init__(self):\n        self._spots: list[ParkingSpot] = []  # private\n\n    def park_vehicle(self, vehicle: Vehicle) -> bool:\n        spot = self._find_available_spot(vehicle)\n        if spot is None:\n            return False\n        spot.occupy(vehicle)\n        return True\n\n    def _find_available_spot(self, vehicle: Vehicle) -> Optional[ParkingSpot]:\n        return self._spots[0] if self._spots else None\n\n    @property\n    def spots(self) -> list[ParkingSpot]:\n        return list(self._spots)  # return a copy",
              metadata: { language: "python" },
            },
            {
              id: "b10",
              type: "quote",
              content:
                "If you're designing a class and wondering whether to expose a field or write a getter, write the getter. If you need to return a collection, return an unmodifiable view or a copy.",
            },
            {
              id: "b11",
              type: "heading",
              content: "Abstraction",
              metadata: { level: 2 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "Abstraction means exposing only what's essential and hiding implementation details behind clear interfaces. You define what something can do without revealing how it does it. An abstraction hides complexity.",
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "When your payment processing code depends on a PaymentMethod interface instead of concrete classes like CreditCardProcessor or PayPalProcessor, you can swap implementations without touching the code that uses them. The caller doesn't need to know whether you're hitting Stripe's API or storing payment tokens in a database. It just calls process() and gets a result.",
            },
            {
              id: "b14",
              type: "heading",
              content: "When to Introduce Abstraction",
              metadata: { level: 3 },
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "Abstraction typically appears where there's complexity in your system. When you encounter a complicated area of logic or state — something with lots of variations, rules, or messy details — abstractions help simplify it. In interviews, look for places where the logic feels tangled or the requirements suggest multiple approaches.",
            },
            {
              id: "b16",
              type: "heading",
              content: "Bad: No Abstraction (Tight Coupling)",
              metadata: { level: 3 },
            },
            {
              id: "b17",
              type: "code",
              content:
                "class OrderService:\n    def __init__(self, api_key: str):\n        self.api_key = api_key\n\n    def checkout(self, order: Order) -> None:\n        stripe = StripeAPI()\n        stripe.set_api_key(self.api_key)\n        stripe.create_charge(order.total, order.credit_card)",
              metadata: { language: "python" },
            },
            {
              id: "b18",
              type: "heading",
              content: "Good: Proper Abstraction",
              metadata: { level: 3 },
            },
            {
              id: "b19",
              type: "code",
              content:
                "from abc import ABC, abstractmethod\n\nclass PaymentMethod(ABC):\n    @abstractmethod\n    def process(self, amount: float) -> bool:\n        ...\n\nclass CreditCardPayment(PaymentMethod):\n    def process(self, amount: float) -> bool:\n        return True  # hit Stripe API\n\nclass PayPalPayment(PaymentMethod):\n    def process(self, amount: float) -> bool:\n        return True  # hit PayPal API\n\nclass OrderService:\n    def __init__(self, payment_method: PaymentMethod):\n        self.payment_method = payment_method\n\n    def checkout(self, order: Order) -> None:\n        self.payment_method.process(order.total)",
              metadata: { language: "python" },
            },
            {
              id: "b20",
              type: "quote",
              content:
                "The hard part is choosing the right level of abstraction. Too abstract and your interface becomes meaningless (doWork(), handleRequest()). Too specific and you haven't actually abstracted anything. Think about what operations the caller needs to perform, not how those operations happen internally.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Polymorphism & Inheritance
    {
      title: "Polymorphism & Inheritance",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Polymorphism & Inheritance",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Polymorphism",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                'Polymorphism is what replaces if (type == "credit") or switch (vehicleType) statements. Instead of checking types, you call the same method and let each object handle itself. Different objects respond to the same action in their own way.',
            },
            {
              id: "c3",
              type: "paragraph",
              content:
                "Polymorphism naturally follows from abstraction. Once you define an interface like PaymentMethod or Vehicle, each implementation can provide its own behavior. When you call a method on an interface, the actual implementation that runs depends on the concrete type you're working with. No type checking required.",
            },
            {
              id: "c4",
              type: "heading",
              content: "Bad: No Polymorphism (Type-Checking)",
              metadata: { level: 3 },
            },
            {
              id: "c5",
              type: "code",
              content:
                'class ParkingLot:\n    def park_vehicle(self, vehicle: Vehicle) -> bool:\n        if vehicle.type == "car":\n            spot = self._find_spot_by_size("regular")\n            return spot is not None\n        elif vehicle.type == "motorcycle":\n            spot = self._find_spot_by_size("motorcycle")\n            return spot is not None\n        elif vehicle.type == "truck":\n            spot = self._find_spot_by_size("large")\n            return spot is not None\n        return False',
              metadata: { language: "python" },
            },
            {
              id: "c6",
              type: "heading",
              content: "Good: Using Polymorphism",
              metadata: { level: 3 },
            },
            {
              id: "c7",
              type: "code",
              content:
                "class Vehicle:\n    def get_required_spot_size(self) -> SpotSize:\n        raise NotImplementedError\n\nclass Car(Vehicle):\n    def get_required_spot_size(self) -> SpotSize:\n        return SpotSize.REGULAR\n\nclass Motorcycle(Vehicle):\n    def get_required_spot_size(self) -> SpotSize:\n        return SpotSize.MOTORCYCLE\n\nclass Truck(Vehicle):\n    def get_required_spot_size(self) -> SpotSize:\n        return SpotSize.LARGE\n\nclass ParkingLot:\n    def park_vehicle(self, vehicle: Vehicle) -> bool:\n        required = vehicle.get_required_spot_size()\n        spot = self._find_spot_by_size(required)\n        return spot is not None",
              metadata: { language: "python" },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Now when you add a new vehicle type, you just create a new class that implements Vehicle. The ParkingLot code never changes. This is the Open/Closed Principle in action — open for extension (new vehicle types), closed for modification (ParkingLot logic).",
            },
            {
              id: "c9",
              type: "heading",
              content: "The Tradeoff: Traceability vs Extensibility",
              metadata: { level: 3 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "Highly polymorphic code can be difficult to trace and debug, especially as the number of implementations grows. Each company has a different tolerance. Some prefer clear, explicit branches; others embrace polymorphism's extensibility. In interviews, always be ready to explain the tradeoff. Polymorphism offers flexibility, but it can make code flows less obvious and harder to follow when debugging or onboarding new engineers.",
            },
            {
              id: "c11",
              type: "heading",
              content: "Inheritance",
              metadata: { level: 2 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                "Inheritance lets one class be a more specific version of another, automatically getting the parent's data and behavior. It's a tool for sharing implementation, but it comes with a big cost: tight coupling. When a subclass inherits the parent's fields and methods, any change in the parent can break every child. That's the \"fragile base class\" problem.",
            },
            {
              id: "c13",
              type: "heading",
              content: "When Inheritance Works",
              metadata: { level: 3 },
            },
            {
              id: "c14",
              type: "code",
              content:
                "class BankAccount:\n    def __init__(self):\n        self.balance = 0.0\n\n    def deposit(self, amount: float) -> None:\n        self.balance += amount\n\n    def withdraw(self, amount: float) -> bool:\n        if self.balance < amount:\n            return False\n        self.balance -= amount\n        return True\n\nclass SavingsAccount(BankAccount):\n    def __init__(self, interest_rate: float):\n        super().__init__()\n        self.interest_rate = interest_rate\n\nclass CheckingAccount(BankAccount):\n    def __init__(self, overdraft_limit: int):\n        super().__init__()\n        self.overdraft_limit = overdraft_limit",
              metadata: { language: "python" },
            },
            {
              id: "c15",
              type: "paragraph",
              content:
                "Inheritance makes sense here because the shared implementation is stable and meaningful. Both subclasses genuinely are forms of BankAccount, and they don't need to override the inherited behavior in ways that break the parent's contract.",
            },
            {
              id: "c16",
              type: "heading",
              content: "When Inheritance Breaks Down",
              metadata: { level: 3 },
            },
            {
              id: "c17",
              type: "code",
              content:
                "# BAD: Inheritance for behavior variation\nclass Car:\n    def start_engine(self) -> None:\n        # gasoline engine start logic\n        ...\n\nclass ElectricCar(Car):\n    def start_engine(self) -> None:\n        # electric motor startup — completely different!\n        ...\n\n# Electric cars don't have engines. They don't share useful\n# engine logic. When you add HybridCar, do you extend\n# Car or ElectricCar? Neither works cleanly.",
              metadata: { language: "python" },
            },
            {
              id: "c18",
              type: "paragraph",
              content:
                "The classic mistake is using inheritance to model behavior differences. If subclasses need to override methods to provide completely different implementations, that's a sign you're using the wrong tool.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Composition Over Inheritance & Putting It Together
    {
      title: "Composition Over Inheritance & Applying OOP",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Composition Over Inheritance & Applying OOP",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Composition Over Inheritance",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                "A safer alternative to inheritance is composition + interfaces. An interface defines the behavior, and each class implements it independently. You still get abstraction and polymorphism, but without forcing classes into a parent-child relationship or sharing state they shouldn't.",
            },
            {
              id: "d3",
              type: "heading",
              content: "Good: Composition for Behavior Variation",
              metadata: { level: 3 },
            },
            {
              id: "d4",
              type: "code",
              content:
                "from abc import ABC, abstractmethod\n\nclass Drivetrain(ABC):\n    @abstractmethod\n    def start(self) -> None:\n        ...\n\nclass GasEngine(Drivetrain):\n    def start(self) -> None:\n        # gas engine startup logic\n        ...\n\nclass ElectricMotor(Drivetrain):\n    def start(self) -> None:\n        # electric motor startup logic\n        ...\n\nclass Car:\n    def __init__(self, drivetrain: Drivetrain):\n        self.drivetrain = drivetrain\n\n    def start(self) -> None:\n        self.drivetrain.start()",
              metadata: { language: "python" },
            },
            {
              id: "d5",
              type: "paragraph",
              content:
                "Now you can model any kind of car without breaking a hierarchy. Want a hybrid? Give it two drivetrains, or create a HybridDrivetrain that composes a GasEngine and ElectricMotor. Want a hydrogen car? Add a new Drivetrain implementation. The Car class never changes.",
            },
            {
              id: "d6",
              type: "heading",
              content: "When to Choose Each Approach",
              metadata: { level: 3 },
            },
            {
              id: "d7",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Use inheritance when you have stable, shared implementation that multiple subclasses genuinely need. The "is-a" relationship is truly stable (SavingsAccount is-a BankAccount will always be true).',
                  'Use composition when behavior varies by type, when you need to combine behaviors flexibly, or when the "is-a" relationship might change. Default to composition — most LLD problems don\'t need inheritance at all.',
                  "The litmus test: if the subclass overrides most of the parent's methods, you're doing composition poorly through inheritance. Extract the varying behavior into its own interface.",
                ],
              },
            },
            {
              id: "d8",
              type: "heading",
              content: "Putting It All Together",
              metadata: { level: 2 },
            },
            {
              id: "d9",
              type: "paragraph",
              content:
                'You don\'t need to recite these terms during your interview. If you forget the word "polymorphism," it doesn\'t matter. What matters is that when you see requirements like "support multiple payment methods," you know to define an interface. When you\'re designing a class, you know to keep fields private and expose methods. When you see yourself writing type checks, you know to use an interface instead.',
            },
            {
              id: "d10",
              type: "heading",
              content: "Quick Reference",
              metadata: { level: 3 },
            },
            {
              id: "d11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Encapsulation: Hide state, expose behavior. Make fields private, provide methods for access.",
                  "Abstraction: Define interfaces for variations. Multiple payment methods? Different vehicle types? Create an interface.",
                  "Polymorphism: Let objects handle themselves. No type checking, no switch statements on types.",
                  "Inheritance: Compose behavior, don't inherit it. Reach for interfaces first, use inheritance only when sharing stable implementation.",
                ],
              },
            },
            {
              id: "d12",
              type: "heading",
              content: "How These Concepts Connect",
              metadata: { level: 3 },
            },
            {
              id: "d13",
              type: "paragraph",
              content:
                "These four concepts form a chain. Encapsulation protects state within objects. Abstraction hides implementation behind interfaces. Polymorphism allows different implementations to respond to the same interface. Inheritance (or composition) provides the mechanism for sharing or composing behavior. In a well-designed system, all four work together: private fields (encapsulation) behind interfaces (abstraction) with multiple implementations (polymorphism) composed through dependency injection (composition).",
            },
            {
              id: "d14",
              type: "heading",
              content: "Common Interview Signals",
              metadata: { level: 3 },
            },
            {
              id: "d15",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  'Requirement says "support multiple X" → define an interface for X (abstraction + polymorphism)',
                  "You're writing if/switch on a type field → replace with polymorphism",
                  "You're exposing internal collections → return a copy (encapsulation)",
                  "Subclass overrides everything → switch to composition",
                  "Two classes share stable implementation → consider inheritance",
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
      title: "Purpose of encapsulation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "A ParkingLot class has a public list of spots that external code can directly modify. What is the primary risk of this design?",
        explanation:
          "When the spots list is public, any code can append, remove, or clear spots without going through ParkingLot's methods. This means ParkingLot cannot enforce its own invariants — for example, it cannot ensure spots are valid, limit capacity, or maintain a count of available spots. Encapsulation exists to let the object control how its data changes, guaranteeing consistency.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "External code can modify spots without going through ParkingLot's methods, so invariants like capacity limits and availability counts cannot be enforced",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The list uses too much memory because it is allocated on the heap instead of the stack",
              isCorrect: false,
            },
            {
              id: "c",
              text: 'Other classes cannot extend ParkingLot because the field name "spots" might conflict with subclass fields',
              isCorrect: false,
            },
            {
              id: "d",
              text: "Public fields prevent the garbage collector from reclaiming the list, causing a memory leak",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Returning internal collections safely",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "A class stores an internal list of items. A getter method returns a reference to this list directly. What encapsulation problem does this create?",
        explanation:
          'Returning a direct reference to a mutable internal collection allows callers to modify it externally — adding, removing, or clearing elements without the owning class knowing. This is called "reference leaking." The fix is to return a copy (defensive copy) or an unmodifiable view, so the caller gets the data but cannot alter the internal state.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Callers can modify the internal collection through the returned reference, bypassing the class's control over its own state",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The getter creates a circular dependency between the caller and the class",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The list is garbage collected as soon as the getter returns, causing a null pointer exception",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The getter violates the Open/Closed Principle because it exposes implementation details",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Identifying when to use abstraction",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "An OrderService directly instantiates a StripeAPI object in its checkout method. The team now needs to add PayPal support. What is the core design problem?",
        explanation:
          "OrderService is tightly coupled to StripeAPI — it creates the concrete implementation inside its method. Adding PayPal means modifying OrderService, violating the Open/Closed Principle. The fix is to introduce a PaymentMethod interface that both StripePayment and PayPalPayment implement. OrderService depends on the interface, and the concrete implementation is injected at construction time.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "OrderService is tightly coupled to StripeAPI — adding PayPal requires modifying OrderService instead of just adding a new implementation",
              isCorrect: true,
            },
            {
              id: "b",
              text: "StripeAPI is a third-party library that cannot be unit tested",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The checkout method has too many parameters, violating the Interface Segregation Principle",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Creating StripeAPI inside the method causes a memory leak because the object is never freed",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Polymorphism eliminates type checking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'A ParkingLot.park_vehicle() method uses if/elif to check vehicle.type ("car", "motorcycle", "truck") and find an appropriate spot. A developer refactors by creating Car, Motorcycle, Truck classes each with get_required_spot_size(). What is the MOST important benefit of this refactoring?',
        explanation:
          "The most important benefit is that adding a new vehicle type (e.g., Bus) requires only creating a new class with get_required_spot_size() — ParkingLot's park_vehicle() never changes. This is the Open/Closed Principle enabled by polymorphism. While testability and readability improve too, the elimination of the need to modify existing code when adding new types is the primary value in a design interview context.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Adding new vehicle types requires only a new class — ParkingLot code never changes (Open/Closed Principle)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The code runs faster because polymorphic dispatch is O(1) while string comparison is O(n)",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Subclasses can now inherit park_vehicle logic from ParkingLot, reducing code duplication",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The refactored version uses less memory because strings are replaced with enum values",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Abstraction level tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A developer creates a Worker interface with a single method doWork(). Multiple classes implement it: EmailSender, PaymentProcessor, ReportGenerator. What is the problem with this abstraction?",
        explanation:
          "The interface is too abstract — doWork() tells the caller nothing about what the operation does, what inputs it needs, or what output it produces. Each implementation needs completely different parameters and return types, which means the interface doesn't actually abstract a common pattern. A good abstraction captures what the caller needs to do (e.g., PaymentMethod.process(amount) → bool) at the right level of specificity.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The interface is too abstract — doWork() carries no semantic meaning and each implementation needs different parameters and return types",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Having three implementations of one interface violates the Single Responsibility Principle",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The interface should be a concrete class with doWork() as a template method",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Using a single method violates the Interface Segregation Principle — each class should have its own interface",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Fragile base class problem",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A base class Collection has an addAll() method that internally calls add() in a loop. A subclass CountingCollection overrides add() to increment a counter before calling super().add(). When addAll() is called on CountingCollection, the count is double what's expected. What fundamental problem does this illustrate?",
        explanation:
          "This is the fragile base class problem — the subclass depends on the parent's internal implementation detail (that addAll() calls add() in a loop). If the parent changes how addAll() works, the subclass breaks. The subclass's override of add() is called both directly AND from within addAll(), causing double counting. This tight coupling between parent and child implementation is why composition is generally preferred over inheritance for behavior variation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The fragile base class problem — the subclass depends on the parent's internal implementation (addAll calls add), creating invisible coupling that causes the double count",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A thread safety issue — add() and addAll() are not synchronized, causing a race condition on the counter",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A Liskov Substitution violation — CountingCollection cannot be used wherever Collection is expected",
              isCorrect: false,
            },
            {
              id: "d",
              text: "An infinite recursion — super().add() calls CountingCollection.add() which calls super().add() again",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Composition vs inheritance for hybrid car",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In an inheritance-based design, Car has a start_engine() method for gasoline logic. ElectricCar extends Car and overrides start_engine() for electric motor logic. Now you need to model a HybridCar that uses both a gas engine and an electric motor. Why does this requirement fundamentally break the inheritance model?",
        explanation:
          "With inheritance, HybridCar would need to extend BOTH Car and ElectricCar to get both behaviors — that's multiple inheritance, which creates the diamond problem (which start_engine does it inherit?). Even in languages supporting multiple inheritance, the two start_engine implementations are mutually exclusive overrides, not composable behaviors. Composition solves this by making drivetrains injectable objects. HybridCar simply holds references to both a GasEngine and ElectricMotor, or uses a HybridDrivetrain that internally composes them.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "HybridCar needs behavior from both parents — inheritance forces a single parent chain, and even with multiple inheritance, start_engine() overrides are mutually exclusive rather than composable",
              isCorrect: true,
            },
            {
              id: "b",
              text: "start_engine() has different return types in Car and ElectricCar, so the compiler cannot resolve the override",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Java and C# don't support multiple inheritance, so HybridCar cannot exist in those languages",
              isCorrect: false,
            },
            {
              id: "d",
              text: "HybridCar violates the Liskov Substitution Principle because it is not truly a Car or an ElectricCar",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Polymorphism vs explicit branching tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'A senior engineer argues against replacing a 3-case switch statement with polymorphism in a critical payment processing path, saying "the explicit branches are easier to audit." Is this a valid concern, and what is the fundamental tradeoff?',
        explanation:
          "This is a legitimate tradeoff. Polymorphic dispatch hides the control flow — to understand what code runs, you must trace the type hierarchy. In security-critical or compliance-sensitive code, explicit branches let auditors see every case in one place. The tradeoff is traceability vs extensibility. With 3 cases that rarely change, the switch is arguably better — all logic is visible. With 20 cases or frequent additions, polymorphism wins. The answer depends on the system's constraints, not a universal rule.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Valid concern — polymorphism trades traceability (seeing all cases in one place) for extensibility (adding types without modifying existing code). For a small, stable set in audit-sensitive code, explicit branches can be preferable.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Invalid concern — polymorphism is always superior to switch statements, regardless of context. The engineer should learn to read polymorphic code.",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Valid concern, but only because switch statements are faster at runtime than virtual method dispatch",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Invalid concern — auditors should review unit tests, not source code, so code structure is irrelevant to auditability",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Encapsulation techniques",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are valid encapsulation techniques in OOP? Select ALL that apply.",
        explanation:
          "Making fields private and providing accessor methods (getters/setters) controls how data is modified. Returning defensive copies of mutable collections prevents callers from modifying internal state through a reference. Using private/protected helper methods hides implementation details. Making all methods static has nothing to do with encapsulation — static methods cannot access instance state at all, which defeats the purpose.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Making fields private and providing getter/setter methods with validation",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Returning a defensive copy of an internal mutable collection instead of the original reference",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Using private helper methods to hide implementation logic from callers",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Making all methods static so they cannot access instance fields",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "When polymorphism is the right tool",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "In which of the following scenarios should you use polymorphism (interface + multiple implementations) instead of conditional branching? Select ALL that apply.",
        explanation:
          "Polymorphism is the right tool when behavior varies by type and new types are expected. Multiple notification channels (email, SMS, push) each have different sending logic — perfect for a NotificationChannel interface. Multiple discount strategies (percentage, flat, buy-one-get-one) each have different calculation logic — perfect for a DiscountStrategy interface. However, checking if a number is positive/negative/zero is a simple mathematical condition, not a type hierarchy. And formatting a date is a single behavior with configuration options, not varying implementations.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "A system sends notifications via email, SMS, and push — each with different sending logic and configuration",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A checkout applies different discount strategies — percentage off, flat discount, or buy-one-get-one",
              isCorrect: true,
            },
            {
              id: "c",
              text: "A function checks if a number is positive, negative, or zero and returns a different message",
              isCorrect: false,
            },
            {
              id: "d",
              text: 'A date formatter converts a date to "MM/DD/YYYY" or "DD-MM-YYYY" format based on a config flag',
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Valid reasons to choose composition over inheritance",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are valid reasons to prefer composition over inheritance? Select ALL that apply.",
        explanation:
          "Composition avoids the fragile base class problem because classes don't depend on parent implementation details. Behaviors can be swapped at runtime by replacing the composed object (e.g., swapping a payment strategy). A class can compose multiple behaviors by holding references to multiple collaborators, unlike single inheritance. However, \"composition is always faster\" is false — there's no inherent performance difference, and in some cases virtual method dispatch through composition adds indirection.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Avoids the fragile base class problem — changes to a parent class cannot silently break child behavior",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Behaviors can be swapped at runtime by replacing the composed object (e.g., changing a strategy)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "A class can compose multiple behaviors from separate interfaces, unlike single-inheritance languages",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Composition is always faster than inheritance because it avoids virtual method table lookups",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Identifying OOP concepts in a class design",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          'A Locker class has private fields (_compartments, _tokenMap), depends on a CompartmentAllocator interface (with implementations FirstFitAllocator and SizeIndexedAllocator), and Compartment has a markOccupied() method instead of a public "occupied" field. Which OOP concepts are demonstrated? Select ALL that apply.',
        explanation:
          "Private fields with public methods = encapsulation. CompartmentAllocator interface hiding allocation details = abstraction. Multiple allocator implementations that Locker uses interchangeably = polymorphism. However, there is no inheritance described — Locker doesn't extend another class, and the allocators implement an interface (composition), not extend a base class. Composition is demonstrated by Locker holding a reference to CompartmentAllocator, but the question asks about the four OOP pillars.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Encapsulation — private fields (_compartments, _tokenMap) with controlled access through methods",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Abstraction — CompartmentAllocator interface hides allocation strategy details from Locker",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Polymorphism — Locker uses CompartmentAllocator without knowing if it's FirstFit or SizeIndexed",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Inheritance — Compartment inherits from a base Entity class that provides markOccupied()",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Explain encapsulation in a parking lot design",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "You are designing a ParkingLot class for an LLD interview. The interviewer notices you made the spots list public. Explain why this is a problem, what concrete bugs it could cause, and how you would fix the design.",
        explanation:
          "A strong answer identifies the specific problem (bypassing validation), gives concrete bug scenarios (adding invalid spots, clearing the list, exceeding capacity), and proposes the fix (private field, controlled methods, defensive copies).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Making spots public means any code can modify the list without going through ParkingLot's methods. This creates several concrete problems:\n\n1. Invariant violations: External code could add a ParkingSpot with an invalid size or duplicate ID. ParkingLot cannot enforce that spots meet its requirements.\n\n2. Capacity bypass: If ParkingLot has a capacity limit, external code can bypass it by directly appending to the list. The lot's internal count of available spots diverges from reality.\n\n3. State corruption: Calling lot.spots.clear() wipes all spots. If vehicles are currently parked, the lot loses track of them entirely — parked vehicles become phantom entries.\n\n4. Concurrency hazards: If the lot is used in a multi-threaded context, unsynchronized external modification could cause ConcurrentModificationException or worse — silent data corruption.\n\nFix: Make the field private (_spots). Provide park_vehicle() and add_spot() methods that enforce invariants. If a getter is needed, return a defensive copy: list(self._spots). This way ParkingLot controls all mutations to its own state.",
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Abstraction level decision",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'The HelloInterview content warns that abstractions can be "too abstract" (doWork()) or "too specific." Using the PaymentMethod example, explain how you decide the right level of abstraction for an interface. What questions do you ask yourself?',
        explanation:
          "A strong answer shows a systematic approach: think about what the caller needs, identify the common operation across implementations, and verify the interface is neither too broad nor too narrow.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "To decide the right level of abstraction, I ask three questions:\n\n1. What does the caller need to do? The caller (OrderService) needs to charge money for an order. It needs to pass an amount and know if the charge succeeded. That gives us process(amount: float) -> bool. The caller doesn't need to know about API keys, token storage, or webhook configuration — those are implementation details.\n\n2. Is this interface meaningful across all implementations? CreditCardPayment.process(amount) makes sense. PayPalPayment.process(amount) makes sense. CryptoPayment.process(amount) makes sense. If I had to force-fit an implementation (e.g., \"BarterPayment\" that doesn't involve an amount), the interface is wrong.\n\n3. Would adding a new implementation require changing the interface? If PayPalPayment needs an email address but process() only takes amount, I have two choices: add email to the interface (wrong — not all methods need it) or inject it through the constructor (right — it's PayPal-specific config). Configuration lives in the constructor; the interface method captures the common operation.\n\nThe doWork() example fails question 1 — it doesn't capture what the caller actually needs to do. EmailSender.doWork(), PaymentProcessor.doWork(), and ReportGenerator.doWork() have nothing in common operationally. They need different inputs and produce different outputs. The \"abstraction\" is just a naming convention, not a real contract.",
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Refactor type-checking code to use polymorphism",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You\'re given this code in an LLD interview:\n\ndef calculate_fee(vehicle_type: str, hours: int) -> float:\n    if vehicle_type == "car": return hours * 5.0\n    elif vehicle_type == "motorcycle": return hours * 2.0\n    elif vehicle_type == "truck": return hours * 10.0 + 20.0  # surcharge\n    else: raise ValueError("Unknown type")\n\nThe interviewer asks you to refactor using OOP principles. Walk through your refactoring step by step, explaining which OOP concepts you apply at each step and why.',
        explanation:
          "Must demonstrate: creating a Vehicle ABC with calculate_fee(), concrete implementations, eliminating the type check, and explain each concept applied. Bonus: discuss the tradeoff of readability vs extensibility.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Step 1 — Identify the abstraction (Abstraction)\nThe function calculates a fee that varies by vehicle type. "Calculate a parking fee" is the common operation; the formula varies per type. This maps to an interface: Vehicle with a calculate_fee(hours) method.\n\n```python\nfrom abc import ABC, abstractmethod\n\nclass Vehicle(ABC):\n    @abstractmethod\n    def calculate_fee(self, hours: int) -> float:\n        ...\n```\n\nStep 2 — Create concrete implementations (Polymorphism)\nEach vehicle type knows its own fee structure. The knowledge of how to calculate the fee moves from a central switch into each type.\n\n```python\nclass Car(Vehicle):\n    def calculate_fee(self, hours: int) -> float:\n        return hours * 5.0\n\nclass Motorcycle(Vehicle):\n    def calculate_fee(self, hours: int) -> float:\n        return hours * 2.0\n\nclass Truck(Vehicle):\n    def calculate_fee(self, hours: int) -> float:\n        return hours * 10.0 + 20.0  # surcharge\n```\n\nStep 3 — Update the caller (Polymorphic dispatch replaces branching)\nInstead of passing a type string, the caller passes a Vehicle object. The method dispatch happens automatically.\n\n```python\ndef calculate_fee(vehicle: Vehicle, hours: int) -> float:\n    return vehicle.calculate_fee(hours)\n```\n\nOr, more naturally, the caller just calls vehicle.calculate_fee(hours) directly — the standalone function may not even be needed.\n\nStep 4 — Encapsulation consideration\nIf Truck\'s surcharge could change, we might make it a private field: self._surcharge = 20.0. The fee formula is encapsulated within Truck and can change without affecting any caller.\n\nConcepts applied:\n- Abstraction: Vehicle interface defines the "what" (calculate fee) without the "how"\n- Polymorphism: Each type provides its own implementation; no type checking needed\n- Encapsulation: Fee parameters are internal to each class\n- Open/Closed Principle (consequence): Adding a Bus type means creating a new class, not modifying existing code\n\nTradeoff acknowledged: For 3 vehicle types that rarely change, the original switch is arguably more readable — all fee logic is visible in one place. As types grow beyond 5-6 or change frequently, the polymorphic version becomes clearly better.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Inheritance vs composition decision",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You are designing a notification system that supports Email, SMS, and Push notifications. Each has different delivery logic. A junior developer proposes a base Notification class with send() that Email, SMS, Push extend. You suggest composition instead. Explain: (1) what the inheritance design would look like, (2) what problems it creates, (3) your composition-based alternative, and (4) how it handles a new requirement: "notifications with retry logic."',
        explanation:
          "Must show: inheritance design, fragile base class / diamond problems, composition design with interface, and how retry composes cleanly as a decorator or wrapper rather than another level of inheritance.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            '(1) Inheritance design:\n```\nclass Notification:\n    def __init__(self, recipient, message):\n        self.recipient = recipient\n        self.message = message\n    def send(self):\n        raise NotImplementedError\n\nclass EmailNotification(Notification):\n    def send(self): # SMTP logic\nclass SMSNotification(Notification):\n    def send(self): # Twilio logic\nclass PushNotification(Notification):\n    def send(self): # Firebase logic\n```\n\n(2) Problems with inheritance:\n- No shared implementation: send() is completely different in each subclass. The base class only provides data storage (recipient, message), which doesn\'t justify a class hierarchy.\n- Rigid coupling: If EmailNotification needs an "attachments" field, do you add it to the base class (polluting SMS/Push) or only to Email (breaking uniform construction)?\n- New requirement pain: "Add retry logic." Do you create RetryEmailNotification extends EmailNotification, RetrySMSNotification extends SMSNotification? That\'s a class explosion. Or add retry to the base class? Now all notifications have retry fields even if they don\'t need them.\n- Diamond problem: "Add a notification that sends both Email and SMS." With inheritance, you\'d need multiple inheritance — EmailSMSNotification extends both EmailNotification and SMSNotification. Which send() wins?\n\n(3) Composition alternative:\n```python\nclass NotificationChannel(ABC):\n    @abstractmethod\n    def deliver(self, recipient: str, message: str) -> bool: ...\n\nclass EmailChannel(NotificationChannel):\n    def deliver(self, recipient, message) -> bool: # SMTP\n\nclass SMSChannel(NotificationChannel):\n    def deliver(self, recipient, message) -> bool: # Twilio\n\nclass PushChannel(NotificationChannel):\n    def deliver(self, recipient, message) -> bool: # Firebase\n\nclass NotificationService:\n    def __init__(self, channel: NotificationChannel):\n        self.channel = channel\n\n    def send(self, recipient: str, message: str) -> bool:\n        return self.channel.deliver(recipient, message)\n```\n\n(4) Adding retry logic with composition:\nUse the Decorator pattern — wrap any channel with retry behavior:\n```python\nclass RetryChannel(NotificationChannel):\n    def __init__(self, inner: NotificationChannel, max_retries: int = 3):\n        self.inner = inner\n        self.max_retries = max_retries\n\n    def deliver(self, recipient, message) -> bool:\n        for attempt in range(self.max_retries):\n            if self.inner.deliver(recipient, message):\n                return True\n        return False\n```\n\nUsage: RetryChannel(EmailChannel(), max_retries=3). Retry is composed with ANY channel, no class explosion. You can even stack decorators: RetryChannel(LoggingChannel(EmailChannel())).',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Explain polymorphism tradeoffs to an interviewer",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'An interviewer says: "I see you used polymorphism here with 3 vehicle types. Tell me the downsides." Give a thoughtful answer that demonstrates you understand both sides, including: traceability, debugging, when NOT to use polymorphism, and how team context affects the decision.',
        explanation:
          "A staff-level answer acknowledges that polymorphism is not always the right tool. It should discuss traceability costs, debugging challenges, team preferences, and give a clear heuristic for when to use or avoid it.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Polymorphism trades traceability for extensibility, and that tradeoff isn't always worth it.\n\nTraceability cost: With explicit if/elif branches, a reader sees every case in one place. With polymorphism, to understand what park_vehicle() actually does for a Truck, you have to find the Truck class, locate get_required_spot_size(), and verify there's no override chain above it. In a codebase with 20 vehicle types across multiple files, \"what happens when I park a vehicle?\" requires IDE tooling to answer.\n\nDebugging challenge: When a bug occurs in polymorphic code, the stack trace shows the interface method name, but you need to determine which concrete implementation was called. In a debugger this is straightforward, but in production logs or error reports, you often lack that context. With explicit branches, the branch itself tells you which code path executed.\n\nWhen NOT to use polymorphism:\n- Small, stable sets: If you have 3 types that haven't changed in 2 years, a switch statement is simpler, more readable, and the \"extensibility\" benefit is theoretical.\n- Performance-critical hot paths: Virtual dispatch has overhead — small, but measurable in tight loops (millions of calls/second). Most systems won't notice, but it matters in game engines or trading systems.\n- Audit-sensitive code: In payment processing or security code, explicit branches let auditors verify every path without navigating a type hierarchy.\n\nTeam context matters: Some teams have strong IDE tooling and are comfortable with \"Go to Implementation.\" Others work in dynamically typed languages where finding implementations is harder. A team of 3 senior engineers might embrace deep polymorphism; a team with frequent onboarding might prefer explicit code. In an interview, I'd default to polymorphism for extensibility, but I'd mention these tradeoffs unprompted to show I think about practical implications.",
          minLength: 150,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Design a class that demonstrates all four OOP concepts",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a simple PaymentProcessor system (3-4 classes) that naturally demonstrates all four OOP concepts: encapsulation, abstraction, polymorphism, and inheritance (or composition as an alternative). For each class and design choice, explicitly label which concept it demonstrates and why.",
        explanation:
          "Must create a coherent design where all four concepts appear naturally, not forced. Labels should show understanding of why each concept matters, not just what it is.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            '```python\nfrom abc import ABC, abstractmethod\nfrom datetime import datetime\n\n# ABSTRACTION: PaymentGateway defines what any payment processor must do\n# without revealing how. The caller only knows "charge(amount) -> receipt."\nclass PaymentGateway(ABC):\n    @abstractmethod\n    def charge(self, amount: float) -> str:\n        """Returns a receipt/transaction ID"""\n        ...\n\n# POLYMORPHISM: Each gateway implements charge() differently.\n# PaymentService calls gateway.charge() without knowing which one.\nclass StripeGateway(PaymentGateway):\n    def __init__(self, api_key: str):\n        self._api_key = api_key  # ENCAPSULATION: API key is private\n\n    def charge(self, amount: float) -> str:\n        # Hit Stripe API with self._api_key\n        return f"stripe_txn_{datetime.now().timestamp()}"\n\nclass PayPalGateway(PaymentGateway):\n    def __init__(self, client_id: str, secret: str):\n        self._client_id = client_id  # ENCAPSULATION: credentials private\n        self._secret = secret\n\n    def charge(self, amount: float) -> str:\n        # Hit PayPal API with OAuth token from _client_id + _secret\n        return f"paypal_txn_{datetime.now().timestamp()}"\n\n# ENCAPSULATION: PaymentService hides its transaction log and gateway.\n# External code cannot tamper with the log or swap the gateway after init.\nclass PaymentService:\n    def __init__(self, gateway: PaymentGateway):  # COMPOSITION over inheritance\n        self._gateway = gateway\n        self._transaction_log: list[dict] = []\n\n    def process_payment(self, order_id: str, amount: float) -> str:\n        if amount <= 0:\n            raise ValueError("Amount must be positive\")\n        receipt = self._gateway.charge(amount)  # POLYMORPHISM in action\n        self._transaction_log.append({\n            "order_id": order_id, "amount": amount,\n            "receipt": receipt, "timestamp": datetime.now()\n        })\n        return receipt\n\n    @property\n    def transactions(self) -> list[dict]:\n        return list(self._transaction_log)  # ENCAPSULATION: return copy\n```\n\nSummary of concepts:\n- Encapsulation: Private fields (_api_key, _secret, _transaction_log, _gateway) with controlled access. transactions property returns a defensive copy.\n- Abstraction: PaymentGateway interface defines "what" (charge money) without "how" (Stripe vs PayPal internals).\n- Polymorphism: PaymentService.process_payment() calls self._gateway.charge() — the actual implementation depends on which gateway was injected.\n- Composition (instead of inheritance): PaymentService holds a reference to PaymentGateway rather than extending it. This lets you swap gateways, test with mocks, or add decorators (logging, retry) without modifying PaymentService.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Name the anti-pattern in type-checking code",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "When you see code like \"if vehicle.type == 'car' ... elif vehicle.type == 'truck'\" in an LLD interview, what specific code smell does this indicate, and which OOP concept should replace it?",
        explanation:
          'This is the "type code" or "type checking" code smell — using string or enum types with conditional branching instead of letting objects handle their own behavior. The solution is polymorphism: define an interface with the varying behavior, and let each concrete type implement it. The conditional branches are replaced by polymorphic dispatch.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Type-checking code smell (conditional branching on type). Replace with polymorphism — define an interface and let each type implement its own behavior.",
          acceptableAnswers: [
            "type checking",
            "type code",
            "polymorphism",
            "type switch",
            "conditional on type",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Name the inheritance problem",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "When a change to a parent class unexpectedly breaks subclasses because they depended on the parent's internal implementation details, what is this problem called?",
        explanation:
          "This is the \"fragile base class\" problem. Subclasses that depend on the parent's implementation details (e.g., that addAll() calls add() in a loop) break when the parent's implementation changes. It's one of the strongest arguments for preferring composition over inheritance.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "The fragile base class problem — subclasses break when parent implementation details change because they depended on how the parent worked internally.",
          acceptableAnswers: [
            "fragile base class",
            "fragile base class problem",
            "fragile parent class",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Composition design for hybrid car",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In the Car/ElectricCar/HybridCar example, the composition solution extracts a Drivetrain interface. Explain in 1-2 sentences how you would model a HybridCar using this pattern, without creating a new inheritance hierarchy.",
        explanation:
          "A HybridCar holds a reference to a HybridDrivetrain that internally composes a GasEngine and an ElectricMotor. Alternatively, Car can hold a list of Drivetrain objects. The key insight is that combining behaviors happens through object references, not class hierarchies.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Create a HybridDrivetrain that implements Drivetrain and internally composes a GasEngine and ElectricMotor, delegating start() to whichever is appropriate. Car receives this HybridDrivetrain through its constructor.",
          acceptableAnswers: [
            "HybridDrivetrain",
            "compose",
            "composition",
            "delegate",
            "two drivetrains",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Litmus test for inheritance vs composition",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'What is the "litmus test" mentioned in the study material for deciding whether to use inheritance or composition? State the test and explain what the answer tells you.',
        explanation:
          "If the subclass overrides most of the parent's methods, you're doing composition poorly through inheritance — the subclass doesn't actually reuse the parent's implementation, it replaces it. This means the \"is-a\" relationship is a lie and you should extract the varying behavior into its own interface and compose it.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "If the subclass overrides most of the parent's methods, you're doing composition poorly through inheritance. The subclass doesn't reuse the parent — it replaces it. Extract the varying behavior into an interface and compose it instead.",
          acceptableAnswers: [
            "overrides most methods",
            "overrides most",
            "replaces parent",
            "composition poorly through inheritance",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match OOP concepts to their definitions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each OOP concept to its core purpose:",
        explanation:
          "Encapsulation protects internal state. Abstraction hides complexity behind interfaces. Polymorphism lets different types respond to the same method call. Inheritance shares implementation between parent-child classes. These four concepts form the foundation of object-oriented design.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Encapsulation",
              right: "Keep data private, control access through methods",
            },
            {
              id: "p2",
              left: "Abstraction",
              right: "Hide implementation details behind clear interfaces",
            },
            {
              id: "p3",
              left: "Polymorphism",
              right: "Let different objects respond to the same method call in their own way",
            },
            {
              id: "p4",
              left: "Inheritance",
              right: "Share stable implementation between parent and child classes",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match interview signals to OOP concepts",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each interview requirement signal to the OOP concept you should apply:",
        explanation:
          '"Support multiple X" signals that you need an interface with multiple implementations — abstraction. Type-checking if/elif blocks should be replaced with polymorphic dispatch. Public mutable collections need encapsulation (private field, defensive copies). Subclass overriding everything means the hierarchy should be replaced with composition.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: '"Support multiple payment methods"',
              right: "Abstraction — define a PaymentMethod interface",
            },
            {
              id: "p2",
              left: "if/elif on vehicle.type string",
              right: "Polymorphism — let each Vehicle subclass handle its own behavior",
            },
            {
              id: "p3",
              left: "Getter returns internal mutable list",
              right: "Encapsulation — return a defensive copy instead",
            },
            {
              id: "p4",
              left: "Subclass overrides every parent method",
              right: "Composition — extract the behavior into an interface and inject it",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match code problems to root causes",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each code problem to its OOP root cause:",
        explanation:
          "OrderService creating StripeAPI directly = missing abstraction (tight coupling). CountingCollection double-count = fragile base class from inheritance. lot.spots.clear() breaking state = missing encapsulation (public collection). Adding Bus requires modifying ParkingLot = missing polymorphism (type checks instead of interfaces).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "OrderService creates StripeAPI directly, can't add PayPal without modifying it",
              right:
                "Missing abstraction — no PaymentMethod interface to decouple from concrete implementations",
            },
            {
              id: "p2",
              left: "CountingCollection.addAll() double-counts because parent's addAll calls overridden add()",
              right:
                "Fragile base class — inheritance couples subclass to parent's internal implementation details",
            },
            {
              id: "p3",
              left: "External code calls lot.spots.clear() and wipes all parking data",
              right:
                "Missing encapsulation — mutable internal collection exposed through public field",
            },
            {
              id: "p4",
              left: "Adding a Bus vehicle type requires modifying ParkingLot.park_vehicle() switch statement",
              right:
                "Missing polymorphism — type checks instead of letting each Vehicle define its own spot requirements",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Four pillars of OOP",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The four core OOP concepts are: {{blank1}}, which keeps data private; {{blank2}}, which hides implementation behind interfaces; polymorphism, which lets objects handle themselves; and inheritance, which shares implementation between parent and child.",
        explanation:
          "The four pillars of OOP are encapsulation (data privacy), abstraction (interface contracts), polymorphism (type-specific behavior), and inheritance (implementation sharing). These are the building blocks of object-oriented design.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The four core OOP concepts are: {{blank1}}, which keeps data private; {{blank2}}, which hides implementation behind interfaces; polymorphism, which lets objects handle themselves; and inheritance, which shares implementation between parent and child.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "encapsulation",
              acceptableAnswers: ["encapsulation"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "abstraction",
              acceptableAnswers: ["abstraction"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Composition principle",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          'The principle "prefer {{blank1}} over {{blank2}}" advises using object references and interfaces to combine behavior, rather than parent-child class hierarchies, because it avoids tight coupling and the fragile base class problem.',
        explanation:
          '"Composition over inheritance" is a fundamental OOP principle. It advises defining interfaces and composing behavior through object references rather than inheriting from parent classes, which creates tight coupling.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            'The principle "prefer {{blank1}} over {{blank2}}" advises using object references and interfaces to combine behavior, rather than parent-child class hierarchies, because it avoids tight coupling and the fragile base class problem.',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "composition",
              acceptableAnswers: ["composition"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "inheritance",
              acceptableAnswers: ["inheritance"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Polymorphism eliminates branching",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "When you see if/elif branches checking a {{blank1}} field, this is a signal to use {{blank2}} instead — define an interface and let each concrete type implement the varying behavior.",
        explanation:
          "Type-checking code (branching on a type field or type string) is one of the most common code smells that polymorphism solves. Instead of the caller checking types and dispatching behavior, each type provides its own implementation through an interface.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "When you see if/elif branches checking a {{blank1}} field, this is a signal to use {{blank2}} instead — define an interface and let each concrete type implement the varying behavior.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "type",
              acceptableAnswers: ["type", "type_", "type field", "vehicle type"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "polymorphism",
              acceptableAnswers: ["polymorphism", "polymorphic dispatch", "an interface"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
