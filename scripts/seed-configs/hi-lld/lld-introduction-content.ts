/**
 * Introduction to Low-Level Design — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: what LLD is, LLD vs System Design, interview variants,
 * assessment criteria, delivery framework, and common mistakes
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldIntroductionContent: StoryPointSeed = {
  title: "Introduction to Low-Level Design",
  description:
    "Understand what LLD interviews test, how they differ from system design, regional format variations, the five assessment axes interviewers use, and the delivery framework for structuring your answer.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: What is LLD & LLD vs System Design
    {
      title: "What is Low-Level Design?",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "What is Low-Level Design?",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Low-Level Design Interviews",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Low-level design interviews test your ability to structure code for a self-contained problem. You'll be given a system — a connect-four game, an elevator controller, a parking lot system — and asked to design the classes, interfaces, and relationships that make it work. The focus is on code organization: What are the right objects? How do they interact? What methods do they expose? Can the design be extended without rewriting everything?",
            },
            {
              id: "b3",
              type: "paragraph",
              content:
                'You may hear this called "Object-Oriented Design" (OOD) instead of "Low-Level Design" (LLD). They\'re the same interview, just a different name. If your recruiter mentions either, this is the guide for you.',
            },
            {
              id: "b4",
              type: "heading",
              content: "What Makes This Guide Different",
              metadata: { level: 2 },
            },
            {
              id: "b5",
              type: "paragraph",
              content:
                "Most LLD content online reads like a textbook — abstract principles, exhaustive pattern catalogs, and heavily academic versions of object-oriented design. Much of it is outdated, and almost none of it is optimized for making fast, correct decisions in an interview. Modern production systems favor composition over inheritance, simple state over deep hierarchies, and pragmatism over pattern worship. You'll still learn the patterns that matter, but only the ones that actually show up in real interviews and real codebases.",
            },
            {
              id: "b6",
              type: "heading",
              content: "LLD vs System Design: Completely Different Interviews",
              metadata: { level: 2 },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "Despite the similar names, these interviews have almost nothing in common. System design is about architecture at scale — traffic, storage, consistency, caching, sharding, and the tradeoffs behind each choice. It is usually done on a shared whiteboard where you sketch boxes and arrows to represent a distributed system. There is no coding in system design and almost no discussion of classes, methods, or interfaces.",
            },
            {
              id: "b8",
              type: "paragraph",
              content:
                "Low-level design, on the other hand, is about defining objects, modeling data, and shaping the interactions that make a single feature or service work. Instead of boxes and arrows, you work through classes, methods, relationships, and state transitions.",
            },
            {
              id: "b9",
              type: "heading",
              content: "The Ride-Sharing Example",
              metadata: { level: 3 },
            },
            {
              id: "b10",
              type: "paragraph",
              content:
                "Consider a ride-sharing backend. In a system design interview, you draw a matching service, a pricing service, a location service, a datastore, a queue, and show how data flows between them. You discuss scaling each piece, handling load spikes, keeping data consistent, and making the system reliable.",
            },
            {
              id: "b11",
              type: "paragraph",
              content:
                "In a low-level design interview, instead of drawing services, you write the code structure for a single part of the system. You might design the Trip class, the TripState enum, the PricingCalculator interface, and how these objects collaborate. The discussion is about methods, relationships, data models, and state transitions — not how to scale the fleet to millions of users.",
            },
            {
              id: "b12",
              type: "code",
              content:
                'class Trip:\n    def __init__(self, id, rider, pickup, dropoff):\n        self.id = id\n        self.rider = rider\n        self.driver = None\n        self.pickup_location = pickup\n        self.dropoff_location = dropoff\n        self.state = TripState.REQUESTED\n        self.fare = 0.0\n\n    def assign_driver(self, driver):\n        if self.state != TripState.REQUESTED:\n            raise ValueError("Cannot assign driver in state: " + self.state)\n        self.driver = driver\n        self.state = TripState.DRIVER_ASSIGNED\n\n    def start_trip(self):\n        if self.state != TripState.DRIVER_ASSIGNED:\n            raise ValueError("Cannot start trip in state: " + self.state)\n        self.state = TripState.IN_PROGRESS\n\n    def complete_trip(self, calculator):\n        if self.state != TripState.IN_PROGRESS:\n            raise ValueError("Cannot complete trip in state: " + self.state)\n        self.fare = calculator.calculate_fare(self)\n        self.state = TripState.COMPLETED\n\n    def cancel_trip(self):\n        if self.state == TripState.COMPLETED:\n            raise ValueError("Cannot cancel completed trip")\n        self.state = TripState.CANCELLED',
              metadata: { language: "python" },
            },
            {
              id: "b13",
              type: "quote",
              content:
                "System design is the map. Low-level design is the blueprint for a building on the map.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Interview Variants & Assessment Criteria
    {
      title: "Interview Variants & Assessment Criteria",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Interview Variants & Assessment Criteria",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Variants of LLD Interviews",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "LLD interviews follow the same core idea everywhere, but the format shifts enough across companies and regions that you should know the major patterns.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Pseudocode vs Real Code",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "US Big Tech leans toward partial code in a real language — class definitions, method signatures, and a bit of logic in something that looks like Java, Python, or C++, even if you're not compiling it. Interviews in India or Asia often expect structured pseudocode — outlining classes and interactions without committing to exact syntax.",
            },
            {
              id: "c5",
              type: "heading",
              content: "Design Patterns Emphasis",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "At Big Tech, interviewers care more about reasoning than vocabulary. You only bring up a pattern when it naturally applies. Smaller and mid-size companies (especially in India and Asia) ask about patterns more directly and may expect you to name them. You don't need to force patterns, but you should recognize when a common pattern is the cleanest fit.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Ambiguity Level",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "paragraph",
              content:
                "Requirements tend to be vaguer in India and Asia — you're expected to ask grounding questions, extract constraints, and drive the solution. US interviews are slightly more defined, but the same principle holds: interviewers want to see how you establish scope before designing.",
            },
            {
              id: "c9",
              type: "heading",
              content: "The Five Assessment Axes",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "While each company uses its own scoring rubric, LLD interviews evaluate the same core skills. Understanding these axes helps you allocate your interview time and know what signals the interviewer is looking for.",
            },
            {
              id: "c11",
              type: "heading",
              content: "1. Problem Analysis",
              metadata: { level: 3 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                "Can you understand what you're building before touching code? Strong candidates extract the key entities and responsibilities, ask clarifying questions to lock down scope, and frame the problem. Jumping into code without understanding the problem is the most common red flag.",
            },
            {
              id: "c13",
              type: "heading",
              content: "2. Class Design",
              metadata: { level: 3 },
            },
            {
              id: "c14",
              type: "paragraph",
              content:
                "How do you design the main classes and their interactions? This includes choosing the right responsibilities, shaping method signatures, defining clear ownership, and keeping boundaries clean. Good class design makes the rest of the interview feel natural. Weak class design makes everything downstream harder.",
            },
            {
              id: "c15",
              type: "heading",
              content: "3. Code Quality",
              metadata: { level: 3 },
            },
            {
              id: "c16",
              type: "paragraph",
              content:
                "This combines OOP fundamentals with code hygiene. Interviewers want to see encapsulation, well-managed state, sensible use of composition or inheritance, and clear separation of concerns. They also look at naming, consistency, and dependency direction. Even in pseudocode, the goal is code that reflects disciplined thinking.",
            },
            {
              id: "c17",
              type: "heading",
              content: "4. Extensibility & Maintainability",
              metadata: { level: 3 },
            },
            {
              id: "c18",
              type: "paragraph",
              content:
                "Most interviews include a follow-up requirement to see if your design can absorb new functionality without being rewritten. Strong candidates build flexible structures with clean boundaries. Interviewers reward designs that adapt easily — not designs that anticipate every possible future.",
            },
            {
              id: "c19",
              type: "heading",
              content: "5. Communication",
              metadata: { level: 3 },
            },
            {
              id: "c20",
              type: "paragraph",
              content:
                "Interviewers want a clear narrative, thoughtful reasoning, and the ability to adjust when probed. A structured explanation often signals confidence and maturity more than perfectly written code. Talk out loud and walk them through your thought process as you go.",
            },
            {
              id: "c21",
              type: "heading",
              content: "The LLD Delivery Framework",
              metadata: { level: 2 },
            },
            {
              id: "c22",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Clarify Requirements (3-5 min): Ask structured questions around core operations, failure scenarios, scope boundaries, and future extensibility. Establish what is in scope and what is not.",
                  "Identify Entities (3-5 min): Extract nouns from requirements. For each, ask: does this have behavior in our system, or is it just data on another entity? Not every noun deserves to be a class.",
                  "Design Classes & Relationships (10-15 min): For each entity, determine state (what it remembers) and behavior (what operations it supports). Define method signatures, establish ownership, and draw out relationships.",
                  "Implement Core Logic (10-15 min): Write the main workflows — typically the happy path first, then error cases. Walk through each line of pseudocode explaining your decisions.",
                  "Discuss Extensibility (5-10 min): Address the follow-up requirement. Show that your design absorbs new functionality with minimal changes. Discuss tradeoffs of your approach.",
                ],
              },
            },
            {
              id: "c23",
              type: "quote",
              content:
                "The most common mistake is jumping into code without spending 5 minutes understanding the problem. Interviewers report this as the #1 red flag that separates failing candidates from passing ones.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Common Mistakes & What Distinguishes Levels
    {
      title: "Common Mistakes & Level Expectations",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Common Mistakes & Level Expectations",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Top Mistakes in LLD Interviews",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Jumping straight into code: Skipping requirements clarification signals you don't understand what you're building. Always spend 3-5 minutes asking questions.",
                  "Creating classes for everything: Not every noun in the requirements deserves its own class. If a concept has no behavior in your system, it should be a field or parameter, not a class.",
                  'Pattern worship: Force-fitting design patterns to show you know the vocabulary. Use patterns only when they naturally apply. If the interviewer asks "is there a pattern here?" and there isn\'t, say so.',
                  "Deep inheritance hierarchies: Modern production code favors composition over inheritance. If your design has 3+ levels of inheritance, rethink it.",
                  "Ignoring error cases: Only implementing the happy path shows a lack of production awareness. Handle the key failure modes: invalid input, state violations, resource exhaustion.",
                  'Over-engineering: Anticipating every possible future requirement instead of designing for what\'s needed now. Extensibility means "easy to change later," not "already handles everything."',
                  "Silent coding: Writing code without explaining your thought process. The interview is as much about communication as code quality.",
                ],
              },
            },
            {
              id: "d3",
              type: "heading",
              content: "What Distinguishes Each Level",
              metadata: { level: 2 },
            },
            {
              id: "d4",
              type: "heading",
              content: "Junior / New Grad (L3-L4)",
              metadata: { level: 3 },
            },
            {
              id: "d5",
              type: "paragraph",
              content:
                "Identify the core entities and implement the happy path. It's okay to get stuck on entity design as long as you can reason through it. Clean method signatures and basic encapsulation are sufficient. Getting prompted by the interviewer is expected.",
            },
            {
              id: "d6",
              type: "heading",
              content: "Mid-Level (L4-L5)",
              metadata: { level: 3 },
            },
            {
              id: "d7",
              type: "paragraph",
              content:
                "Recognize which nouns do NOT deserve to be entities. Clean separation of concerns. Handle key edge cases (invalid inputs, state violations, resource limits). Explain design choices when asked. Minimal prompting needed from the interviewer.",
            },
            {
              id: "d8",
              type: "heading",
              content: "Senior / Staff (L5-L6)",
              metadata: { level: 3 },
            },
            {
              id: "d9",
              type: "paragraph",
              content:
                "Drive the design with minimal prompting. Proactively discuss tradeoffs: state placement, alternative approaches, when simple entities would need to evolve. Anticipate interviewer follow-ups before they ask. Demonstrate GRASP principles (Information Expert, Low Coupling) without being asked. The design should feel like it was built by someone who has shipped production code.",
            },
            {
              id: "d10",
              type: "heading",
              content: "Modern LLD Philosophy",
              metadata: { level: 2 },
            },
            {
              id: "d11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Composition over inheritance: Prefer composing behaviors through interfaces and delegation rather than building deep class hierarchies.",
                  "Simple state over deep hierarchies: A flat enum with clear transitions beats a complex state pattern for most interview problems.",
                  "Pragmatism over pattern worship: Use patterns when they solve a real problem, not to demonstrate vocabulary.",
                  "Single source of truth: Every piece of state should have exactly one owner. Derived state is fine for reads but dangerous for writes.",
                  "Design for the current requirement: Build clean, extensible code for what you need now. Don't build for hypothetical futures.",
                ],
              },
            },
          ],
          readingTime: 7,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (25 total)
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "What LLD interviews test",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "What is the primary focus of a Low-Level Design (LLD) interview?",
        explanation:
          "LLD interviews test your ability to structure code for a self-contained problem — choosing the right objects, designing their interactions, defining method signatures, and ensuring the design can be extended. It is NOT about distributed systems, scaling, or algorithm optimization.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Designing classes, interfaces, and relationships that make a self-contained system work — focusing on code organization and extensibility",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Optimizing algorithms for time and space complexity, similar to a coding interview with data structures",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Drawing architecture diagrams showing distributed services, databases, caches, and message queues",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Writing production-ready, fully compilable code with unit tests and deployment configuration",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "LLD vs System Design scope",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "For a ride-sharing backend, what would you design in an LLD interview vs a System Design interview?",
        explanation:
          "In LLD, you design the Trip class, TripState enum, PricingCalculator interface — the code structure for one part of the system. In System Design, you sketch the major services (matching, pricing, location), datastores, queues, and how data flows between them at scale. LLD is the blueprint for a building; System Design is the map.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "LLD: Trip class, TripState enum, PricingCalculator interface and their interactions. System Design: matching service, pricing service, location service, datastores, and data flow at scale.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "LLD: The database schema and SQL queries. System Design: The API endpoints and REST contracts.",
              isCorrect: false,
            },
            {
              id: "c",
              text: "LLD: Microservices deployment on Kubernetes. System Design: Monolithic application architecture.",
              isCorrect: false,
            },
            {
              id: "d",
              text: "LLD and System Design test the same skills but at different levels of seniority — junior candidates do LLD, senior candidates do System Design.",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "First step in an LLD interview",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "What should you do FIRST when given an LLD interview problem?",
        explanation:
          "The most common red flag in LLD interviews is jumping straight into code. Strong candidates spend 3-5 minutes asking structured questions about core operations, failure scenarios, scope boundaries, and extensibility. This shows you understand problem decomposition and think before you build.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Ask clarifying questions to understand requirements, scope boundaries, and failure scenarios before touching any code",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Start writing the main class immediately to show you can move quickly and code under pressure",
              isCorrect: false,
            },
            {
              id: "c",
              text: "List all applicable design patterns and decide which ones to use before understanding the problem",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Draw a system architecture diagram showing services, databases, and communication protocols",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Entity identification criterion",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "During entity identification in an LLD interview, what is the key criterion for deciding whether a noun from the requirements should become its own class?",
        explanation:
          'The key question is: does this noun have meaningful behavior (methods) in our system? A concept that only contributes data should be a field on another entity or an input parameter. For example, in the Amazon Locker problem, "Package" is a noun but should NOT be a class because our system only needs its size — Package has no behavior in the locker domain.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Whether the concept has meaningful behavior (methods) in the system — not just data that could be a field or parameter",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Whether the concept appears as a noun in the requirements — every noun should be a class for thorough modeling",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Whether the concept maps to a real-world physical object — physical things should always be classes",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Whether the concept has at least three attributes — classes need sufficient state to justify their existence",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Composition vs inheritance in modern LLD",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A candidate designs a parking system with Vehicle as a base class, then Car extends Vehicle, Truck extends Vehicle, and Motorcycle extends Vehicle. Each subclass only overrides a getSize() method. What is the modern LLD critique of this design?",
        explanation:
          "If the only variation is a single property (size), inheritance is overkill. A Size enum on a single Vehicle class achieves the same result with less complexity. Modern LLD favors composition over inheritance — use inheritance only when subclasses have genuinely different behavior, not just different data. Three levels of hierarchy for one field is a textbook example of premature abstraction.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Inheritance is overkill for a single property variation — a Size enum on a single Vehicle class is simpler and achieves the same result",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The hierarchy should be deeper — Vehicle should also extend a base Transportation class",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The design is correct — each vehicle type is a distinct real-world concept and deserves its own class",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The issue is that Vehicle should be an interface, not a class — always prefer interfaces over abstract classes",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Design patterns in Big Tech vs mid-size companies",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "How do Big Tech companies typically differ from mid-size companies in their expectation around design patterns during LLD interviews?",
        explanation:
          "Big Tech interviewers care about the reasoning — they want to see you naturally arrive at a pattern when it fits, not name-drop patterns to show vocabulary. Mid-size companies (especially in India/Asia) are more likely to ask about patterns directly and expect you to name them. The underlying skill being tested is the same: knowing when a pattern is the cleanest solution.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Big Tech cares about reasoning over vocabulary — use patterns when they naturally fit. Mid-size companies may ask you to name patterns directly.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Big Tech requires implementing Gang of Four patterns from memory, while mid-size companies accept pseudocode descriptions",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Big Tech never asks about patterns — they consider design patterns outdated. Mid-size companies still test them heavily.",
              isCorrect: false,
            },
            {
              id: "d",
              text: "There is no meaningful difference — all companies expect the same level of pattern knowledge regardless of size or region",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "State management and single source of truth",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A candidate designs an elevator system where floor requests are stored in both the Elevator object (a priority queue) and the ElevatorController (a hash set for O(1) lookup). When a floor is reached, the Elevator removes it from its queue but the Controller also needs to update its set. What fundamental LLD principle does this violate, and what is the likely failure mode?",
        explanation:
          "This violates the Single Source of Truth principle — every piece of state should have exactly one owner. With dual storage, any bug in synchronization (forgetting to update one data structure, race condition, exception between the two updates) causes the system to have contradictory views of pending requests. The likely failure mode is phantom stops (elevator stops at a floor nobody requested) or missed stops (a request exists in one structure but was removed from the other). The fix is to choose one canonical data structure and derive any secondary views from it.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Single Source of Truth — dual storage creates synchronization risk. Likely failure: phantom stops or missed stops when the two structures diverge.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Open/Closed Principle — the design is not open for extension. Likely failure: cannot add new floor types without modifying both structures.",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Liskov Substitution — the Controller cannot be substituted for the Elevator. Likely failure: the system crashes when swapping implementations.",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Dependency Inversion — the Elevator depends on a concrete Controller. Likely failure: tight coupling makes unit testing impossible.",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Extensibility vs over-engineering boundary",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "During an LLD interview for a parking lot system, a candidate introduces a PaymentStrategyFactory, a NotificationObserver, a VehicleTypeVisitor, and an AbstractParkingSpaceBuilder — all for a system with 3 vehicle types and flat-rate pricing. How should an interviewer evaluate this?",
        explanation:
          'This is classic over-engineering. Each abstraction adds complexity that is not justified by the current requirements. A Strategy pattern for flat-rate pricing (one implementation) adds indirection with no benefit. An Observer for notifications that aren\'t in scope is speculative. A Visitor for 3 vehicle types is heavier than a switch/enum. A Builder for a simple ParkingSpace is ceremony over substance. In LLD interviews, interviewers penalize unnecessary abstraction because it signals the candidate cannot distinguish between "extensible" and "over-engineered." Extensibility means clean boundaries that are easy to change — not pre-built abstractions for hypothetical requirements.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Negative signal — this is over-engineering. None of these patterns are justified by current requirements. Extensibility means clean boundaries, not pre-built abstractions.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Positive signal — showing awareness of multiple patterns demonstrates breadth of knowledge, which is the primary goal of an LLD interview.",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Neutral — pattern usage is always a matter of personal style. The interviewer should not penalize for using more patterns than necessary.",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Depends on seniority — this level of abstraction is expected for Staff-level candidates but would be over-engineering for Mid-level.",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "LLD interview assessment axes",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL of the core assessment axes that LLD interviewers evaluate:",
        explanation:
          "LLD interviews evaluate five core axes: Problem Analysis (understanding the problem), Class Design (entity structure and relationships), Code Quality (OOP fundamentals and hygiene), Extensibility & Maintainability (absorbing new requirements), and Communication (clear reasoning). Algorithm complexity analysis and distributed systems knowledge are tested in coding interviews and system design interviews, respectively.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Problem Analysis — understanding the problem and establishing scope before coding",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Class Design — choosing responsibilities, method signatures, ownership, and boundaries",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Code Quality — encapsulation, state management, separation of concerns, naming",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Extensibility & Maintainability — absorbing new requirements without rewriting",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Communication — clear narrative, reasoning, and ability to adjust when probed",
              isCorrect: true,
            },
            {
              id: "f",
              text: "Algorithm Complexity — proving O(log n) time with formal mathematical proofs",
              isCorrect: false,
            },
            {
              id: "g",
              text: "Distributed Systems — CAP theorem, consensus protocols, and horizontal scaling",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Modern LLD philosophy principles",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following reflect the modern LLD philosophy that interviewers at top companies expect? Select ALL that apply.",
        explanation:
          'Modern LLD favors composition over inheritance (flexible, flat hierarchies), simple state over deep state patterns (enum + transitions > State pattern for most problems), and pragmatism over pattern worship (patterns only when they solve a real problem). Using inheritance for all "is-a" relationships leads to brittle hierarchies. Implementing every GoF pattern shows vocabulary, not judgment.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Composition over inheritance — prefer interfaces and delegation over deep class hierarchies",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Simple state over deep hierarchies — a flat enum with clear transitions beats a complex state pattern for most problems",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Pragmatism over pattern worship — use patterns only when they naturally solve a real problem",
              isCorrect: true,
            },
            {
              id: "d",
              text: 'Always use inheritance when a real-world "is-a" relationship exists between entities',
              isCorrect: false,
            },
            {
              id: "e",
              text: "Implement at least 3 GoF design patterns per interview to demonstrate depth of knowledge",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Common LLD interview mistakes",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following are considered common mistakes in LLD interviews? Select ALL that apply.",
        explanation:
          "All of the first four options are classic LLD mistakes. Jumping into code skips problem analysis. Creating classes for every noun leads to entity bloat. Silent coding misses the communication axis. Over-engineering with premature patterns shows poor judgment. However, asking clarifying questions before coding is the recommended first step, not a mistake.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Jumping straight into code without understanding the requirements",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Creating a class for every noun in the requirements, even ones with no behavior",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Writing code silently without explaining your thought process",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Force-fitting design patterns to demonstrate vocabulary rather than solving real problems",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Asking 3-5 clarifying questions before starting to design",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Senior-level LLD differentiators",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which behaviors distinguish a Senior/Staff-level LLD answer from a Mid-level answer? Select ALL that apply.",
        explanation:
          "Senior/Staff candidates: (1) drive the design proactively with minimal interviewer prompting, (2) discuss tradeoffs of alternative approaches without being asked, (3) anticipate follow-up questions before the interviewer asks them, and (4) demonstrate principles like Information Expert naturally through their design choices. However, using every design pattern from the GoF catalog is over-engineering, not a sign of seniority — it shows poor judgment about when patterns add value.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Driving the design proactively with minimal prompting from the interviewer",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Proactively discussing tradeoffs of alternative approaches without being asked",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Anticipating interviewer follow-up questions and addressing them preemptively",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Naturally demonstrating GRASP principles (Information Expert, Low Coupling) through design choices",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Using every applicable GoF design pattern to show comprehensive pattern mastery",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Explain LLD vs System Design with an example",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Using a specific example (e.g., a food delivery app or a chat application), explain how the same product would be approached differently in a Low-Level Design interview vs a System Design interview. Be specific about what artifacts each interview produces.",
        explanation:
          "A strong answer picks a concrete system and contrasts the artifacts: LLD produces classes, enums, interfaces, method signatures, and pseudocode for one part of the system. System Design produces an architecture diagram with services, databases, caches, queues, and data flow. The answer should demonstrate understanding that these are fundamentally different interviews testing different skills.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Consider a food delivery app like UberEats.\n\nIn a System Design interview, I would sketch the architecture: an API gateway handling user requests, an Order Service managing order lifecycle, a Restaurant Service for menu management, a Delivery Matching Service that assigns drivers, a Location Service tracking driver positions via WebSocket, a Payment Service processing transactions, and a Notification Service for push notifications. I\'d discuss the database choices (SQL for orders, Redis for driver locations), message queues between services (Kafka for order events), and how to handle peak dinner-hour traffic with auto-scaling. The deliverable is an architecture diagram with boxes and arrows.\n\nIn an LLD interview, I would zoom into one piece — say, the Order class and its lifecycle. I\'d design: an Order class with fields (id, customer, restaurant, items, state, driver), an OrderState enum (PLACED → CONFIRMED → PREPARING → READY → PICKED_UP → DELIVERED → CANCELLED), an OrderItem class (menuItemId, quantity, specialInstructions), and an OrderManager orchestrator. I\'d write the state transition methods (confirmOrder, assignDriver, markDelivered) with validation guards that prevent invalid transitions. The deliverable is pseudocode with class definitions, method signatures, and core logic.\n\nThe key difference: System Design asks "how do all the parts fit together at scale?" LLD asks "how should this one part be structured in code?" System Design is the map; LLD is the blueprint for one building on that map.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "LLD delivery framework walkthrough",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Describe the recommended delivery framework for structuring an LLD interview answer. For each phase, explain what you should do, how long it should take, and what signal it sends to the interviewer.",
        explanation:
          "A strong answer covers all five phases with time allocations and interviewer signals: Requirements (3-5 min, shows problem decomposition), Entity Identification (3-5 min, shows abstraction skill), Class Design (10-15 min, shows OOP maturity), Implementation (10-15 min, shows code quality), Extensibility (5-10 min, shows design foresight).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "The LLD delivery framework has five phases:\n\n1. Clarify Requirements (3-5 minutes): Ask structured questions about core operations, failure scenarios, scope boundaries, and extensibility. Explicitly call out what is in and out of scope. Signal: Shows you think before you build. The #1 red flag is jumping into code — this phase prevents that.\n\n2. Identify Entities (3-5 minutes): Extract nouns from the requirements. For each noun, ask: does it have behavior in our system, or is it just data on another entity? Eliminate nouns that are parameters or fields, not classes. Signal: Shows you can distinguish meaningful abstractions from data. Recognizing what should NOT be a class is as important as identifying what should.\n\n3. Design Classes & Relationships (10-15 minutes): For each entity, determine state (what it remembers) and behavior (what operations it supports). Define method signatures, establish ownership of data and operations, and draw out relationships between classes. Signal: This is the core of the evaluation — it shows OOP maturity, understanding of responsibility assignment, and ability to create clean boundaries.\n\n4. Implement Core Logic (10-15 minutes): Write the main workflows in pseudocode — happy path first, then error handling. Walk through each line explaining decisions. Signal: Shows code quality, state management discipline, and ability to handle edge cases. Talking through your code shows communication skill.\n\n5. Discuss Extensibility (5-10 minutes): Address the follow-up requirement. Show your design absorbs new functionality with minimal changes. Discuss tradeoffs. Signal: Shows your design has clean extension points and you understand the cost of different design choices.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Evaluate a junior candidate's design",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A junior candidate is asked to design a library management system. They create these classes: Book (title, author, isbn), Library (books list, addBook, removeBook), User (name, id, borrowedBooks), and LibraryCard (cardNumber, expiryDate). They did not create a BorrowTransaction class, did not define a Librarian class, and have no return logic. As an interviewer, evaluate this design across the five assessment axes. What is strong, what is weak, and what follow-up questions would you ask?",
        explanation:
          "A strong evaluation assesses all 5 axes: Problem Analysis (incomplete — no requirements phase), Class Design (decent entity identification but missing transaction logic), Code Quality (clean naming but no state management), Extensibility (untestable without follow-up), Communication (unknown). The evaluator should identify that BorrowTransaction is a likely missing entity and that Librarian may or may not be needed depending on scope.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Assessment across the five axes:\n\n**Problem Analysis (Weak):** The candidate jumped into class design without clarifying requirements. We don\'t know if they asked: What operations does the library support? Are there late fees? Can books be reserved? What happens when a borrowed book is overdue? Skipping this phase is the #1 red flag.\n\n**Class Design (Mixed):** Strengths: Book, Library, and User are solid entities with clear purposes. Book has data that belongs together. Library is a natural orchestrator. User owns their borrowed books. Weaknesses: (1) LibraryCard is questionable — does it have behavior, or is it just a cardNumber field on User? Unless card validation or card-level operations exist, this is over-modeling. (2) Missing BorrowTransaction — borrowing has state (borrow date, due date, return date, overdue status) and behavior (calculateLateFee, isOverdue, markReturned). Attaching this to User.borrowedBooks flattens important temporal data. (3) Librarian: Probably NOT needed unless librarian-specific operations exist. Admin actions can live on Library.\n\n**Code Quality (Insufficient data):** The candidate defined classes and fields but we have no method implementations. We can\'t evaluate encapsulation, state transitions, or error handling. The naming is clean, which is a positive signal.\n\n**Extensibility (Unknown):** Without implementation or a follow-up, we can\'t assess this. A good follow-up: "What if we add a reservation system — a user can reserve a book that\'s currently checked out?" This tests whether their design absorbs a new workflow.\n\n**Communication (Unknown from description):** We need to know if they explained their decisions.\n\n**Follow-up questions I would ask:**\n1. "Walk me through what happens when a user borrows a book — what methods are called, in what order?"\n2. "What if the same user tries to borrow a book they already have?"\n3. "How would you add late fees — which class owns that logic?"\n4. "Does LibraryCard have any methods? What would happen if you removed it and put cardNumber on User?"',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "When inheritance helps vs hurts",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Give one concrete LLD example where inheritance is the right choice and one where it's the wrong choice. For each, explain why — not just what the code looks like, but what goes wrong (or right) when requirements change.",
        explanation:
          "A strong answer provides specific examples with concrete evolution scenarios. Good inheritance: genuinely different behaviors (e.g., different pricing strategies). Bad inheritance: only data variation (e.g., vehicle types that differ only in size). The key insight is that inheritance locks in behavior at compile time, making it brittle when the taxonomy changes.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            '**Good use of inheritance: PricingStrategy in a ride-sharing system**\n\nFlatRatePricing, SurgePricing, and SubscriptionPricing all implement PricingStrategy.calculateFare(trip). Each has genuinely different algorithms — FlatRate uses distance × base rate, Surge multiplies by a dynamic factor, Subscription applies monthly-plan discounts. When a new pricing model is added (e.g., TimedPricing that charges per minute), you add a new subclass without modifying existing ones. This works because the variation is in behavior (different algorithms), not data. The interface boundary is clean: each strategy takes a Trip and returns a fare.\n\nWhen requirements change: "Add a promotional discount layer." Because pricing is behind an interface, you can wrap any strategy with a PromotionalPricingDecorator without touching existing implementations. Inheritance (via interface) made this evolution clean.\n\n**Bad use of inheritance: Vehicle hierarchy in a parking lot**\n\nCar extends Vehicle, Truck extends Vehicle, Motorcycle extends Vehicle. Each overrides getSize() to return SMALL, MEDIUM, or LARGE. This is wrong because the only variation is a data field (size), not behavior. A single Vehicle class with a Size enum achieves the same thing with no hierarchy.\n\nWhen requirements change: "Add electric vehicles that need charging spots." Now you need ElectricCar, ElectricTruck, ElectricMotorcycle — a combinatorial explosion. With the enum approach, you add a boolean needsCharging or a FuelType enum to Vehicle. With inheritance, you either create 6 classes or introduce multiple inheritance (which most languages don\'t support cleanly).\n\nThe principle: Use inheritance when subclasses have genuinely different behavior (algorithms, workflows, state machines). Use composition/enums when the variation is in data (a field value, a configuration parameter). Ask yourself: "If I add a new dimension of variation, does my hierarchy survive or explode?"',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Scope definition and out-of-scope reasoning",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You are given the LLD prompt: "Design a movie ticket booking system." Walk through your requirements clarification phase. List the questions you would ask, the scope you would establish (in-scope and out-of-scope), and explain why explicitly calling out out-of-scope items is valuable in an interview.',
        explanation:
          "A strong answer demonstrates structured questioning across four areas (core operations, failures, scope, extensibility), explicitly defines in/out scope boundaries, and explains that calling out out-of-scope items shows you considered them without over-engineering.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            '**Clarifying questions across four areas:**\n\nCore Operations:\n- "Can users browse available shows, select seats, and book tickets?" (confirms the happy path)\n- "Is seat selection by specific seat, or general admission?" (determines if Seat needs its own class)\n- "Do we support multiple screens/halls in a single theater?" (determines if Theater is an orchestrator or if we need a Cinema class above it)\n\nFailure Scenarios:\n- "What happens if two users try to book the same seat simultaneously?" (concurrency — likely out of scope for intro, but worth flagging)\n- "Can a booking be cancelled? If so, does the seat become available immediately?" (state lifecycle)\n- "What happens if payment fails after seat selection?" (determines if we need a reservation phase)\n\nScope Boundaries:\n- "Are we designing the booking workflow for a single theater, or a multi-theater chain?" (constrains the orchestrator\'s scope)\n- "Does the system handle payments, or do we just model the booking state and delegate payment externally?" (avoids designing a payment system)\n\nExtensibility:\n- "Are there VIP/premium seats with different pricing?" (tests if our Seat/Pricing design is extensible)\n- "Do we need to support group bookings or bulk reservations?" (tests if Booking can scale)\n\n**In-scope:** Browse shows → select seats → create booking → confirm/cancel booking. Single theater with multiple screens. Seat-specific selection. Basic pricing.\n\n**Out-of-scope:** Payment processing (we model BookingState, not payment flows). User authentication. Notification/emails. Search and recommendation. Multi-theater chain management. Concurrency control (flag it as a follow-up discussion).\n\n**Why calling out out-of-scope matters:** It sends three signals to the interviewer: (1) You considered these features — you\'re not naive about the real system\'s complexity. (2) You made a deliberate decision to exclude them — showing prioritization and scope management. (3) You can circle back if the interviewer wants to explore one — it becomes a natural extensibility discussion. Saying "payment is out of scope, but I\'d design Booking to accept a PaymentResult callback so we can plug it in later" shows you\'re thinking ahead without over-engineering.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "State placement: entity vs orchestrator",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "In LLD, a recurring design decision is where to place state: on the entity itself or in the orchestrator. Using two different LLD problems as examples, explain the tradeoff and describe scenarios where each approach is more appropriate. Include a case where the choice is genuinely ambiguous.",
        explanation:
          "A strong answer distinguishes physical state (intrinsic to entity) from relational state (system-managed), gives concrete examples, and identifies a genuinely ambiguous case where both placements are defensible.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            '**The Core Tradeoff:**\nState on the entity means the entity manages its own condition. State in the orchestrator means a centralized manager tracks relationships and assignments. The choice depends on whether the state is intrinsic to the entity or describes a system-managed relationship.\n\n**Example 1: Elevator system — state on entity is clearly right**\nAn Elevator has a currentFloor, direction, and doorStatus. These are physical states of the hardware — they exist whether or not an ElevatorController is running. Placing currentFloor in the Controller would be nonsensical: the elevator is physically on a floor regardless of what the software thinks. The entity owns its intrinsic physical state.\n\n**Example 2: Task management system — state in orchestrator is clearly right**\nA Task can be "assigned to Developer X." This assignment is a system-managed relationship — it doesn\'t exist in nature, only in our software. A TaskBoard (orchestrator) should own assignee mappings because: (1) re-assignment is a board operation, not a task operation, (2) querying "all tasks assigned to Developer X" is natural from the board, and (3) if a developer leaves, cleanup happens in one place.\n\n**Ambiguous case: Parking lot — occupancy**\nIs a ParkingSpot\'s "occupied" flag physical state (a car is physically there) or relational state (the system assigned this spot to that vehicle)? Both are defensible:\n\n- Physical: "There is a car in this spot" is a fact about the spot\'s condition, like a sensor reading. Put an occupied boolean on ParkingSpot. Advantage: single source of truth, no synchronization needed.\n\n- Relational: "The system assigned vehicle V to spot S" is a management relationship. Put a Map<Spot, Vehicle> on ParkingLot. Advantage: easy to query by vehicle, easy to find all available spots, no state on entities.\n\nNeither is wrong. What matters is having a rationale you can defend and keeping state in exactly one place. The interview signal is showing you\'ve considered both options and can articulate why you chose one.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "OOD vs LLD naming",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What is the other common name for a Low-Level Design (LLD) interview? Explain in one sentence why both names refer to the same interview.",
        explanation:
          "Object-Oriented Design (OOD). Both names refer to the same interview because the core task is identical: designing classes, interfaces, and their relationships for a self-contained problem. The name varies by company and region, but the format, evaluation criteria, and preparation are the same.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Object-Oriented Design (OOD) — both names refer to the same interview format: designing classes, interfaces, and relationships for a self-contained problem.",
          acceptableAnswers: [
            "OOD",
            "Object-Oriented Design",
            "Object Oriented Design",
            "object oriented design",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Number one red flag in LLD interviews",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "According to LLD interviewers, what is the single most common red flag that separates failing candidates from passing ones?",
        explanation:
          "Jumping straight into code without understanding the problem is the #1 red flag. Interviewers want to see you spend 3-5 minutes asking clarifying questions, establishing scope, and framing the problem before writing any code. Skipping this phase signals that you build before you think.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Jumping straight into code without spending time understanding the problem through clarifying questions and scope definition.",
          acceptableAnswers: [
            "jumping into code",
            "coding without understanding",
            "skipping requirements",
            "not asking questions",
            "jumping straight into code",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Map vs blueprint metaphor",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'Complete the metaphor and explain what it reveals about scope: "System design is the _____. Low-level design is the _____ for a building on the _____." What does this imply about how the two interview types relate when building a real product?',
        explanation:
          "System design is the map. Low-level design is the blueprint for a building on the map. This implies that in a real product, system design comes first (defining which services exist and how they interact), and LLD zooms into one of those services to design its internal code structure. They are complementary at different zoom levels — you need both to build a real system, but they test completely different skills.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "System design is the map. Low-level design is the blueprint for a building on the map. They are complementary — system design defines which services exist, LLD designs the internal structure of one service.",
          acceptableAnswers: ["map", "blueprint", "map and blueprint"],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Why extensibility is not anticipation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'In one sentence, explain the difference between a design that is "extensible" and a design that "anticipates every possible future." Why does LLD penalize the latter?',
        explanation:
          "An extensible design has clean boundaries that are easy to change when new requirements arrive. A design that anticipates futures pre-builds abstractions for hypothetical requirements, adding complexity now for uncertain benefit later. LLD penalizes the latter because it signals the candidate cannot distinguish between necessary flexibility and speculative over-engineering — unnecessary abstractions increase cognitive load, maintenance burden, and code complexity without proven value.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Extensible means clean boundaries that are easy to change later; anticipating futures means pre-building abstractions for hypothetical requirements. LLD penalizes the latter because it adds complexity for unproven benefit.",
          acceptableAnswers: [
            "clean boundaries",
            "easy to change",
            "over-engineering",
            "unnecessary complexity",
            "premature abstraction",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match interview type to its focus",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each interview type to what it primarily evaluates:",
        explanation:
          "LLD focuses on classes, interfaces, and code structure for a single component. System Design focuses on distributed architecture and scaling at a system level. Coding interviews focus on algorithms and data structures. Behavioral interviews assess soft skills, leadership, and collaboration. Each tests a distinct dimension of engineering ability.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Low-Level Design (LLD)",
              right:
                "Classes, interfaces, relationships, and code organization for a self-contained problem",
            },
            {
              id: "p2",
              left: "System Design (HLD)",
              right:
                "Distributed architecture, scaling, consistency, and data flow between services",
            },
            {
              id: "p3",
              left: "Coding Interview",
              right:
                "Algorithm design, data structure selection, and time/space complexity optimization",
            },
            {
              id: "p4",
              left: "Behavioral Interview",
              right:
                "Leadership, conflict resolution, collaboration, and past experience assessment",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match LLD delivery phases to their signals",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each phase of the LLD delivery framework to the primary signal it sends to the interviewer:",
        explanation:
          "Clarify Requirements shows you think before building. Identify Entities shows abstraction skill. Design Classes shows OOP maturity. Implement Core Logic shows code quality. Discuss Extensibility shows design foresight. Each phase targets a different assessment axis.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Clarify Requirements (3-5 min)",
              right: "Problem decomposition — you think before you build",
            },
            {
              id: "p2",
              left: "Identify Entities (3-5 min)",
              right: "Abstraction skill — distinguishing real entities from data fields",
            },
            {
              id: "p3",
              left: "Design Classes (10-15 min)",
              right: "OOP maturity — responsibility assignment, ownership, clean boundaries",
            },
            {
              id: "p4",
              left: "Implement Core Logic (10-15 min)",
              right: "Code quality — encapsulation, state management, error handling",
            },
            {
              id: "p5",
              left: "Discuss Extensibility (5-10 min)",
              right: "Design foresight — clean extension points and tradeoff reasoning",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match seniority level to expected behaviors",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each seniority level to the expected behavior in an LLD interview:",
        explanation:
          "Junior: Identify core entities and implement happy path with some prompting. Mid-level: Recognize entity vs non-entity, handle edge cases, explain choices. Senior/Staff: Drive proactively, discuss tradeoffs unprompted, anticipate follow-ups, demonstrate GRASP principles naturally. Each level builds on the previous one.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Junior (L3-L4)",
              right:
                "Identify core entities, implement happy path, clean method signatures — prompting from interviewer is expected",
            },
            {
              id: "p2",
              left: "Mid-level (L4-L5)",
              right:
                "Recognize non-entities, handle edge cases, explain design choices — minimal prompting needed",
            },
            {
              id: "p3",
              left: "Senior/Staff (L5-L6)",
              right:
                "Drive design proactively, discuss tradeoffs unprompted, anticipate follow-ups, demonstrate GRASP principles naturally",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "LLD vs System Design artifacts",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In a system design interview, you draw _____ and _____ to represent a distributed system. In a low-level design interview, you work through classes, methods, and _____.",
        explanation:
          "System design uses boxes and arrows to represent services and data flow in a distributed system. LLD works through classes, methods, and state transitions (or relationships) to design the internal structure of a single component.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "In a system design interview, you draw {{blank1}} and {{blank2}} to represent a distributed system. In a low-level design interview, you work through classes, methods, and {{blank3}}.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "boxes",
              acceptableAnswers: ["boxes", "components", "services"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "arrows",
              acceptableAnswers: ["arrows", "lines", "connections"],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "state transitions",
              acceptableAnswers: [
                "state transitions",
                "relationships",
                "interactions",
                "interfaces",
              ],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Modern LLD favors",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Modern production systems favor _____ over inheritance, simple state over deep _____, and pragmatism over pattern _____.",
        explanation:
          "Modern LLD favors composition over inheritance (flexible delegation vs rigid hierarchies), simple state over deep hierarchies (flat enums vs complex state patterns), and pragmatism over pattern worship (use patterns when they solve real problems, not to show vocabulary).",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Modern production systems favor {{blank1}} over inheritance, simple state over deep {{blank2}}, and pragmatism over pattern {{blank3}}.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "composition",
              acceptableAnswers: ["composition"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "hierarchies",
              acceptableAnswers: ["hierarchies", "class hierarchies", "hierarchy"],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "worship",
              acceptableAnswers: ["worship", "obsession", "overuse"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Entity identification heuristic",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "When identifying entities, extract _____ from the requirements and ask: does this concept have meaningful _____ in the system? If the answer is no, it should be a _____ on another entity or an input parameter, not its own class.",
        explanation:
          "Extract nouns from the requirements as entity candidates. The key filter: does it have meaningful behavior (methods)? If no behavior, it should be a field (or attribute/property) on another entity or an input parameter to a method. This prevents entity bloat from over-modeling.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "When identifying entities, extract {{blank1}} from the requirements and ask: does this concept have meaningful {{blank2}} in the system? If the answer is no, it should be a {{blank3}} on another entity or an input parameter, not its own class.",
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
            {
              id: "blank3",
              correctAnswer: "field",
              acceptableAnswers: ["field", "attribute", "property", "data field"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
