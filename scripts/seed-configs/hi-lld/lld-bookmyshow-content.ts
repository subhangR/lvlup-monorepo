/**
 * BookMyShow (Movie Ticket Booking) — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: entity modeling, class design, booking flow, concurrency control,
 * seat management, reservation routing, and extensibility patterns
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldBookmyshowContent: StoryPointSeed = {
  title: "LLD: Movie Ticket Booking (BookMyShow)",
  description:
    "Master the low-level design of a movie ticket booking system — covering entity modeling, class relationships, synchronized booking with concurrency control, seat availability tracking, reservation routing via back-references, and extensibility patterns like temporary seat holds.",
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
      title: "Requirements, Entities & Class Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Movie Ticket Booking — Requirements, Entities & Class Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is a Movie Ticket Booking System?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "A movie ticket booking system (like BookMyShow or Fandango) lets users search for movies, browse theaters and showtimes, select specific seats from a seat map, and reserve tickets. The system manages seat availability across multiple theaters, each with multiple screens, and prevents two people from booking the same seat. This is a classic LLD problem that tests entity modeling, concurrency control, and clean separation of responsibilities.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Final Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Users can search for movies by title (case-insensitive substring matching)",
                  "Users can browse movies playing at a given theater",
                  "Theaters have multiple screens; all screens share the same seat layout (rows A-Z, seats 0-20 = 546 seats)",
                  "Users can view available seats for a showtime and select specific ones",
                  "Users can book multiple seats in a single reservation; booking returns a confirmation ID",
                  "Concurrent booking of the same seat: exactly one succeeds",
                  "Users can cancel a reservation by confirmation ID, releasing the seats",
                ],
              },
            },
            {
              id: "b5",
              type: "heading",
              content: "Out of Scope",
              metadata: { level: 3 },
            },
            {
              id: "b6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Payment processing (assume payment always succeeds)",
                  "Variable seat layouts or seat types (all seats identical)",
                  "Rescheduling (cancel and rebook instead)",
                  "UI / rendering",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "Entity Identification & Responsibilities",
              metadata: { level: 2 },
            },
            {
              id: "b8",
              type: "paragraph",
              content:
                'A good heuristic for whether something deserves its own class: does it connect other entities, get queried against, or need its own behavior? Movie is a class because users search by it and it ties showtimes together across theaters. Screen is just a label telling the customer which room to walk into — demoted to a string field on Showtime. Seat is just an identifier like "A5" — a string with built-in equality and hashing.',
            },
            {
              id: "b9",
              type: "code",
              content:
                'Entity            | Responsibility                                              | Type\n─────────────────────────────────────────────────────────────────────────────────────\nBookingSystem     | Orchestrator. Owns theaters. Entry point for search/queries  | Class\nMovie             | Searchable entity. Title + ID. Ties showtimes across theaters| Class\nTheater           | Named location. Owns a list of showtimes                    | Class\nShowtime          | A specific screening. Tracks seat availability & concurrency | Class\nReservation       | Booking reference. Stores confirmation ID & seat list        | Class\nSeat              | Identifier for a specific seat, e.g. "A5"                   | String\nScreen            | Label identifying which room, e.g. "Screen 3"               | String field',
              metadata: { language: "text" },
            },
            {
              id: "b10",
              type: "heading",
              content: "Key Relationships",
              metadata: { level: 2 },
            },
            {
              id: "b11",
              type: "code",
              content:
                'BookingSystem → List<Theater>\nTheater → List<Showtime>\nShowtime → Theater          (back-reference for navigation)\nShowtime → Movie            (reference)\nShowtime → List<Reservation> (booking records)\nReservation → Showtime       (back-reference for cancellation routing)\nReservation → List<string>   (e.g., ["A5", "A6"])',
              metadata: { language: "text" },
            },
            {
              id: "b12",
              type: "heading",
              content: "Final Class Design",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "code",
              content:
                "class BookingSystem:\n    - theaters: List<Theater>\n    + searchMovies(title: string) → List<Showtime>\n    + getShowtimesAtTheater(theater: Theater) → List<Showtime>\n    + book(showtimeId: string, seatIds: List<string>) → Reservation\n    + cancelReservation(confirmationId: string)\n\nclass Theater:\n    - id: string\n    - name: string\n    - showtimes: List<Showtime>\n    + getShowtimes() → List<Showtime>\n    + getShowtimesForMovie(movie: Movie) → List<Showtime>\n\nclass Showtime:\n    - id: string\n    - theater: Theater\n    - datetime: DateTime\n    - screenLabel: string\n    - movie: Movie\n    - reservations: List<Reservation>\n    + isAvailable(seatId: string) → boolean\n    + getAvailableSeats() → List<string>\n    + book(reservation: Reservation)\n    + cancel(reservation: Reservation)\n\nclass Movie:\n    - id: string\n    - title: string\n    + getTitle() → string\n    + getId() → string\n\nclass Reservation:\n    - confirmationId: string\n    - showtime: Showtime\n    - seatIds: List<string>\n    + getConfirmationId() → string\n    + getSeatIds() → List<string>\n    + getShowtime() → Showtime\n\nConstants:\n    SEAT_LAYOUT: rows A-Z, seats 0-20 (546 seats per showtime)",
              metadata: { language: "text" },
            },
            {
              id: "b14",
              type: "heading",
              content: "Key Design Decisions",
              metadata: { level: 2 },
            },
            {
              id: "b15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "BookingSystem is a pure orchestrator — holds theaters, provides cross-theater queries, routes booking and cancellation requests.",
                  'Showtime owns both seat state and reservations. The reservations list IS the seat state — booking adds to it, cancellation removes from it. No separate "bookedSeats" tracker needed.',
                  "Reservation is a data record with a back-reference to its Showtime for routing cancellations. Without it, you'd search through every theater/showtime/reservation to find the right one.",
                  "No cancel() on Reservation itself — cancellation modifies Showtime's state, so the logic lives on Showtime to avoid two objects mutating the same data.",
                ],
              },
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 2: Implementation — Booking Flow, Concurrency & Cancellation
    {
      title: "Implementation — Booking Flow & Concurrency Control",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Implementation — Booking Flow, Concurrency & Cancellation",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "BookingSystem: Index-Based Routing",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "The BookingSystem constructor pre-builds lookup indexes for O(1) routing: moviesById, showtimesByMovieId, showtimesById, and reservationsById (initially empty). This avoids O(t × s) scans on every search/book/cancel operation. Three indexes are built from one loop over all theaters and showtimes. The reservationsById index grows as bookings are made, giving cancellation O(1) lookup by confirmation ID.",
            },
            {
              id: "c3",
              type: "code",
              content:
                "BookingSystem(theaters)\n    this.theaters = theaters\n    this.moviesById = {}\n    this.showtimesByMovieId = {}\n    this.showtimesById = {}\n    this.reservationsById = {}  // populated as bookings come in\n\n    for theater in theaters\n        for showtime in theater.getShowtimes()\n            movie = showtime.getMovie()\n            moviesById[movie.getId()] = movie\n            showtimesById[showtime.getId()] = showtime\n            if !showtimesByMovieId.contains(movie.getId())\n                showtimesByMovieId[movie.getId()] = []\n            showtimesByMovieId[movie.getId()].add(showtime)",
              metadata: { language: "text" },
            },
            {
              id: "c4",
              type: "heading",
              content: "The Booking Orchestration Flow",
              metadata: { level: 2 },
            },
            {
              id: "c5",
              type: "code",
              content:
                "book(showtimeId, seatIds)\n    // 1. Validate inputs\n    if showtimeId == null or seatIds == null or seatIds.isEmpty()\n        throw InvalidRequestException\n\n    // 2. Route to correct showtime via index\n    showtime = showtimesById[showtimeId]\n    if showtime == null → throw ShowtimeNotFoundException\n\n    // 3. Create reservation (data object, no state change yet)\n    reservation = Reservation(generateConfirmationId(), showtime, seatIds)\n\n    // 4. Hand to showtime for atomic validation + storage\n    showtime.book(reservation)\n\n    // 5. Register in routing index for cancellation\n    reservationsById[reservation.getConfirmationId()] = reservation\n\n    return reservation",
              metadata: { language: "text" },
            },
            {
              id: "c6",
              type: "heading",
              content: "Concurrency: The Check-Then-Act Race Condition",
              metadata: { level: 2 },
            },
            {
              id: "c7",
              type: "paragraph",
              content:
                "The naive approach — check if seats are available, then store the reservation — is a classic race condition. Between checking and storing, another thread can claim the same seats. Thread A checks A5 (available), Thread B checks A5 (still available!), Thread A stores, Thread B stores → double-booking. The fix: wrap the entire check-and-book sequence in a synchronized block.",
            },
            {
              id: "c8",
              type: "heading",
              content: "Synchronized Booking (Per-Showtime Lock)",
              metadata: { level: 2 },
            },
            {
              id: "c9",
              type: "code",
              content:
                "Showtime.book(reservation)\n    synchronized(this)  // Per-showtime lock\n        seatIds = reservation.getSeatIds()\n\n        // Validate all seats exist in the layout\n        for seatId in seatIds\n            if !isValidSeatId(seatId)\n                throw InvalidSeatException(seatId)\n\n        // Check ALL seats are available before booking any\n        for seatId in seatIds\n            if !isAvailable(seatId)\n                throw SeatUnavailableException(seatId)\n\n        // All checks passed — store reservation (atomic)\n        reservations.add(reservation)",
              metadata: { language: "text" },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "The synchronized(this) block ensures only one thread executes booking logic at a time for THIS showtime. Two users booking different showtimes don't block each other. The all-or-nothing validation checks every requested seat before modifying any state — if A6 is taken but A5 and A7 are free, the entire booking fails with no partial state change.",
            },
            {
              id: "c11",
              type: "heading",
              content: "Per-Seat Locking (Alternative for High Contention)",
              metadata: { level: 2 },
            },
            {
              id: "c12",
              type: "paragraph",
              content:
                "For massively popular showtimes (opening night of a Marvel movie), per-showtime locking forces all booking attempts to serialize even when they want different seats. Per-seat locking allows parallel booking of non-conflicting seats. Each seat needs its own lock, promoting Seat from a string to a class with a lock and bookedBy field. Critical: acquire locks in sorted order to prevent deadlock (Thread A locks A5 then A6, Thread B locks A6 then A5 → deadlock). Tradeoff: higher throughput but significantly more complexity — two representations of booking state that must stay in sync.",
            },
            {
              id: "c13",
              type: "heading",
              content: "Cancellation Flow",
              metadata: { level: 2 },
            },
            {
              id: "c14",
              type: "code",
              content:
                "BookingSystem.cancelReservation(confirmationId)\n    reservation = reservationsById[confirmationId]  // O(1) lookup\n    if reservation == null → throw ReservationNotFoundException\n\n    showtime = reservation.getShowtime()  // Follow back-reference\n    showtime.cancel(reservation)          // Atomic removal\n    reservationsById.remove(confirmationId)\n\nShowtime.cancel(reservation)\n    synchronized(this)\n        reservations.remove(reservation)\n    // Seats automatically become available — isAvailable derives from reservations list",
              metadata: { language: "text" },
            },
            {
              id: "c15",
              type: "heading",
              content: "Seat Availability — Derived State",
              metadata: { level: 2 },
            },
            {
              id: "c16",
              type: "paragraph",
              content:
                'isAvailable(seatId) scans the reservations list — if no reservation claims the seat, it is available. getAvailableSeats() collects all booked seats into a Set, then walks the constant 546-seat layout and keeps anything not in the set. This "derived state" approach means there is only one mutable data structure (the reservations list), simplifying concurrency. An alternative bookedSeats Set provides O(1) checks but creates a second mutable field that must stay in sync.',
            },
          ],
          readingTime: 15,
        },
      },
    },

    // Material 3: Extensibility & Level Expectations
    {
      title: "Extensibility Patterns & Interview Level Expectations",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Extensibility Patterns & What Each Level Should Demonstrate",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Temporary Seat Holds During Checkout",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                'In a real system, there is a gap between "user selects seats" and "payment completes." Without holds, another user could grab the same seats during checkout. The fix: when a user selects seats, reserve them for a limited time (5 minutes). Seats become available → held → booked. This requires a holds Map<string, SeatHold> on Showtime alongside the reservations list, and isAvailable must now check both reservations AND non-expired holds.',
            },
            {
              id: "d3",
              type: "code",
              content:
                "class SeatHold:\n    - seatIds: List<string>\n    - holdId: string\n    - expiresAt: long\n\nholdSeats(seatIds, timeoutMs)\n    synchronized(this)\n        for seatId in seatIds\n            if !isAvailable(seatId)  // checks both reservations AND holds\n                throw SeatUnavailableException(seatId)\n        hold = SeatHold(seatIds, generateHoldId(), currentTime() + timeoutMs)\n        holds[hold.holdId] = hold\n        return hold.holdId\n\nconfirmHold(holdId, reservation)\n    synchronized(this)\n        hold = holds[holdId]\n        if hold == null → throw HoldNotFoundException\n        if currentTime() > hold.expiresAt\n            holds.remove(holdId) → throw HoldExpiredException\n        holds.remove(holdId)\n        reservations.add(reservation)",
              metadata: { language: "text" },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "A background cleanup task periodically scans for expired holds and removes them. The hold timeout is a business decision: too short (30s) and you cancel holds during payment entry; too long (15min) and you lock seats for users who have moved on. Most systems use 5-10 minutes. This fits cleanly into the existing per-showtime synchronization model.",
            },
            {
              id: "d5",
              type: "heading",
              content: "Dynamic Addition/Removal of Showtimes",
              metadata: { level: 2 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "Adding is straightforward: an addShowtime method updates every index the constructor populated (showtimesById, showtimesByMovieId, moviesById, theater's showtime list). Removing is harder because entities reference each other — deleting a showtime with active reservations leaves dangling references. The cleanest approach: reject removal if active reservations exist. Cancel all reservations first, then remove. The movie cleanup at the end must verify no other showtime still references the movie before removing it from the index.",
            },
            {
              id: "d7",
              type: "heading",
              content: "What Each Level Should Demonstrate",
              metadata: { level: 2 },
            },
            {
              id: "d8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Junior: Identify core entities, build a working book/cancel flow, basic validation (reject invalid seats, handle seat-already-taken). May need hints for concurrency.",
                  "Mid-level: Clean separation of orchestrator (BookingSystem) vs state owner (Showtime). Reservations list as single source of truth. Working synchronized booking. Lookup indexes for efficient routing.",
                  "Senior: Proactively explain the check-then-act race condition. Discuss per-showtime vs per-seat locking tradeoffs (deadlock prevention via sorted lock acquisition). Back-references for cancellation routing as a natural design choice. Comfortable discussing seat holds extensibility.",
                ],
              },
            },
            {
              id: "d9",
              type: "quote",
              content:
                "The key insight for this problem is that the reservations list on Showtime IS the seat state. Booking adds to it, cancellation removes from it, and availability is derived from it. One mutable data structure, one lock, no cross-object consistency to maintain.",
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
      title: "Why Screen is demoted to a string field",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In the BookMyShow LLD, Screen is not a separate class but a string field on Showtime. What is the primary reason?",
        explanation:
          "The interviewer confirmed all screens share the same seat layout (rows A-Z, seats 0-20). Without variable layouts, Screen doesn't track state, enforce rules, or own data that differs across screens. It's just a label like \"Screen 3\" for wayfinding. Creating a class for it would add indirection with no benefit.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "All screens share the same seat layout, so Screen has no unique state or behavior — it's just a label",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Screen objects would consume too much memory in a multi-theater system",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Screens never change, so they should be constants rather than objects",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The Showtime class already inherits screen behavior from Theater",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Source of truth for seat availability",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In the BookMyShow design, what is the single source of truth for which seats are booked in a given showtime?",
        explanation:
          "The reservations list on Showtime is the single source of truth. Each reservation holds a list of seat IDs. To check if a seat is taken, scan all reservations. To get available seats, collect booked seats and subtract from the constant layout. There is no separate bookedSeats set or availability flags — the reservations ARE the seat state.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "The reservations list on Showtime — each reservation contains its booked seat IDs",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A separate bookedSeats Set maintained on each Showtime",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A boolean isBooked flag on each Seat object",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The BookingSystem's reservationsById map which tracks all reservations globally",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Why Reservation has no cancel() method",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "Why does Reservation NOT have its own cancel() method in this design?",
        explanation:
          "Cancellation needs to release seats back into the available pool, which means modifying Showtime's reservation list. If Reservation could modify Showtime's state directly, two objects would mutate the same data, making concurrency harder to reason about. So the cancellation logic lives on Showtime, which removes the reservation from its list under a synchronized block.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Cancellation modifies Showtime's state — having two objects mutate the same data makes concurrency harder",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Reservation is an immutable value object and cannot have mutation methods",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The cancel operation is too complex to fit in a single method",
              isCorrect: false,
            },
            {
              id: "d",
              text: "BookingSystem already handles cancellation, so adding it to Reservation would violate DRY",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why the back-reference from Reservation to Showtime exists",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Reservation holds a back-reference to its Showtime. What problem does this solve and what is the alternative without it?",
        explanation:
          "When a user cancels by confirmation ID, BookingSystem needs to route the cancel to the correct Showtime. The back-reference provides O(1) routing: reservation → showtime → cancel(). Without it, you would need to search through every theater, every showtime, and every reservation to find where the cancelled reservation lives — O(t × s × r) in the worst case.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "It enables O(1) cancellation routing; without it, BookingSystem must search all theaters/showtimes to find the reservation",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It prevents the garbage collector from cleaning up the Showtime while a Reservation references it",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It allows Reservation to directly modify seat availability on its parent Showtime",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It is needed for the booking flow to validate that the reservation belongs to the correct showtime",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "All-or-nothing multi-seat booking behavior",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A user tries to book seats A5, A6, and A7 for a showtime where A6 is already taken. What is the correct behavior?",
        explanation:
          "The booking validates ALL seats before modifying any state. Even though A5 and A7 are available, the booking fails entirely because A6 is taken. No reservation is stored, no seats are claimed, and the exception propagates back to BookingSystem. This all-or-nothing behavior prevents partial bookings where a user ends up with non-adjacent seats they didn't want.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The entire booking fails — no seats are claimed (A5 and A7 remain available). All-or-nothing.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A5 and A7 are booked successfully, and A6 returns an error separately",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The system automatically finds an alternative for A6 (e.g., A8) and completes the booking",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A5 is booked but A7 is not, because the validation stops at the first failure (A6)",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Why BookingSystem builds indexes at construction time",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "BookingSystem builds four lookup maps in its constructor (moviesById, showtimesByMovieId, showtimesById, reservationsById). What problem does this solve?",
        explanation:
          "Without indexes, every search, booking, and cancellation requires scanning all theaters and their showtimes — O(t × s) per operation. With pre-built indexes, searchMovies scans only matching movies, book() looks up the showtime in O(1), and cancelReservation finds the reservation in O(1). This is a classic tradeoff: denormalized data makes reads faster but writes more error-prone because multiple data structures must stay in sync.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Avoids O(t × s) full scans on every operation — enables O(1) lookup for booking and cancellation routing",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Prevents duplicate movies or showtimes from being added to the system",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Ensures thread safety by making all data structures immutable after construction",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Allows the system to persist state to disk for crash recovery",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Per-showtime vs per-seat locking tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "When switching from per-showtime locking to per-seat locking, which statement correctly describes the most critical new requirement?",
        explanation:
          "Per-seat locking requires acquiring multiple locks (one per seat in the booking). If Thread A locks A5 then tries A6, while Thread B locks A6 then tries A5, you get a deadlock. The fix: sort seat IDs and always acquire locks in the same order. This is a well-known deadlock prevention technique. Additionally, Seat must be promoted from a string to a class with a lock and bookedBy field, creating two representations of booking state that must stay in sync.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Locks must be acquired in a consistent sorted order across all threads to prevent deadlock on multi-seat bookings",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Each seat lock must have a timeout to prevent indefinite waiting during high contention",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A global lock manager must coordinate all seat locks across all showtimes in the system",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Per-seat locking requires the Showtime class to be split into separate read and write classes",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Removing a showtime with active reservations",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'An interviewer asks: "How do you handle removing a showtime that has active reservations?" What is the correct approach?',
        explanation:
          "Removing a showtime with active reservations leaves dangling references — reservation.getShowtime() points at nothing, confirmation IDs lead nowhere. The cleanest approach is to reject removal if active reservations exist. The theater must cancel all reservations first (notifying customers), then remove the showtime. This avoids complex cascading delete logic and maintains referential integrity. After removal, a movie cleanup step checks if any other showtime still references the movie before removing it from the index.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Reject removal if active reservations exist — cancel all reservations first, then remove the showtime",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Cascade delete: automatically cancel all reservations and remove the showtime in one transaction",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Soft-delete the showtime by marking it inactive, allowing existing reservations to remain valid",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Use a garbage collector pattern to clean up orphaned reservations after showtime removal",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Valid reasons Seat is a string, not a class",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          'Select ALL valid reasons why Seat is modeled as a string (e.g., "A5") instead of a separate class in the base design:',
        explanation:
          "Seat doesn't change state (it's just an identifier), doesn't enforce rules, and doesn't maintain behavior. Strings have built-in equality and hashing for set/map operations. Making Seat a class would add indirection with no benefit in the base design. However, if per-seat locking is needed (for high-contention scenarios), Seat MUST be promoted to a class to carry a lock.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Seat has no state changes, no rules to enforce, and no behavior — just an identifier",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Strings have built-in equality and hashing, which is all we need for set/map lookups",
              isCorrect: true,
            },
            {
              id: "c",
              text: "All seats are identical (no types or pricing tiers), so no per-seat attributes needed",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Using strings prevents memory leaks that would occur with Seat objects",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "What synchronized(this) on Showtime.book() guarantees",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL guarantees provided by the synchronized(this) block in Showtime.book():",
        explanation:
          "The synchronized block ensures: (1) Only one thread executes booking logic for this showtime at a time — preventing the check-then-act race condition. (2) The check (isAvailable) and modification (reservations.add) are atomic — no thread can slip between them. (3) All-or-nothing for multi-seat bookings — if any seat fails, no state changes occur. However, it does NOT prevent concurrent bookings on DIFFERENT showtimes — the lock is per-showtime, not global.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The availability check and reservation storage are atomic — no thread can slip between them",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Only one thread can execute booking logic for THIS showtime at a time",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Multi-seat bookings fail entirely if any seat is unavailable (all-or-nothing)",
              isCorrect: true,
            },
            {
              id: "d",
              text: "No two users can book seats on any showtime in the entire system simultaneously",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Complexity costs of per-seat locking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL additional complexities introduced when switching from per-showtime to per-seat locking:",
        explanation:
          "Per-seat locking requires: (1) Seat promoted from string to a class with lock + bookedBy field. (2) Sorted lock acquisition to prevent deadlock. (3) Two representations of booking state (per-seat bookedBy AND reservations list) that must stay perfectly in sync. (4) Cancellation must re-acquire all seat locks before clearing bookedBy state. However, it does NOT require a global lock coordinator — locks are still local to each showtime's seat objects.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Seat must be promoted from a string to a class carrying a lock and bookedBy field",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Locks must be acquired in sorted order across all threads to prevent deadlock",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Two mutable representations of booking state (per-seat bookedBy + reservations list) must stay in sync",
              isCorrect: true,
            },
            {
              id: "d",
              text: "A global lock coordinator service must manage all seat locks across the entire system",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "What changes when adding temporary seat holds",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "When extending the design to support temporary seat holds (for checkout), which of the following correctly describe required changes? Select ALL that apply.",
        explanation:
          "Seat holds require: (1) A new SeatHold class and holds map on Showtime. (2) isAvailable must check both reservations AND non-expired holds. (3) The booking flow splits into holdSeats → confirmHold instead of a single book(). (4) A background cleanup task for expired holds. However, the locking strategy does NOT change — holdSeats and confirmHold run inside the same synchronized(this) block, fitting cleanly into the existing per-showtime model.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "isAvailable must now check both confirmed reservations AND non-expired holds",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The single book() call splits into holdSeats() and confirmHold() with a time gap between them",
              isCorrect: true,
            },
            {
              id: "c",
              text: "A background cleanup task is needed to remove expired holds and release seats",
              isCorrect: true,
            },
            {
              id: "d",
              text: "The per-showtime locking strategy must be changed to a distributed lock to handle hold timeouts",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Explain why the reservations list IS the seat state",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "In the BookMyShow LLD, the Showtime class uses a single reservations list as the source of truth for seat availability instead of maintaining a separate bookedSeats data structure. Explain this design decision, its advantages, and its tradeoffs.",
        explanation:
          "A strong answer covers: (1) Each reservation holds its seat list, so scanning all reservations reveals all booked seats. (2) Advantages: one mutable structure simplifies concurrency — booking adds, cancellation removes, no cross-object consistency. (3) Tradeoff: isAvailable is O(total reservations) per check instead of O(1). (4) For a typical showtime with dozens of reservations, this is fast enough. A bookedSeats set is equally defensible but creates a second mutable field.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "The reservations list serves dual duty: it stores booking records AND defines seat availability. Since each Reservation holds a list of its booked seat IDs, scanning all reservations tells you exactly which seats are taken.\n\nAdvantages:\n1. Single source of truth: Only one mutable data structure to manage. Booking appends a reservation, cancellation removes one. No secondary structure to keep in sync.\n2. Simplified concurrency: With one mutable field, the synchronized block only needs to guard one data structure. No risk of reservations and bookedSeats getting out of sync.\n3. Simpler cancel: Removing a reservation automatically frees its seats — no separate cleanup step.\n\nTradeoff: isAvailable(seatId) requires scanning all reservations — O(total reservations × avg seats per reservation). For a typical showtime with ~50 reservations, this is negligible. If performance became an issue, you could maintain a bookedSeats HashSet that provides O(1) lookups, but you'd need to update it atomically alongside the reservations list on every book and cancel.\n\nThe key insight is that at this scale, simplicity trumps micro-optimization. One mutable structure with one lock is easier to reason about than two structures that must stay in sync.",
          minLength: 100,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Walk through the concurrent booking scenario",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Two users (Thread A and Thread B) simultaneously try to book seat A5 for the same showtime. Walk through the exact execution sequence showing how the synchronized booking approach ensures exactly one succeeds. Include the state of the reservations list at each step.",
        explanation:
          "Must show: Thread A enters synchronized block, Thread B waits. Thread A checks A5 (available), stores reservation, exits block. Thread B enters, checks A5 (now taken by Thread A's reservation), throws SeatUnavailableException. Thread B's reservation was created but never persisted. Final state has exactly one reservation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Initial state: showtime.reservations = [] (empty)\n\nBoth threads call BookingSystem.book("showtime-123", ["A5"]) and each creates a Reservation object. Both then call showtime.book(reservation).\n\n1. Thread A enters the synchronized(this) block on the Showtime.\n2. Thread B arrives at the synchronized block and WAITS — only one thread can hold the lock.\n\n3. Thread A (inside lock):\n   - Validates "A5": isValidSeatId("A5") → true\n   - Checks availability: isAvailable("A5") scans reservations → empty list → true\n   - Stores: reservations.add(reservationA)\n   - State: reservations = [reservationA] (contains seat "A5")\n   - Exits synchronized block\n\n4. Thread A (back in BookingSystem): registers reservationA in reservationsById, returns success.\n\n5. Thread B NOW enters the synchronized block:\n   - Validates "A5": isValidSeatId("A5") → true\n   - Checks availability: isAvailable("A5") scans reservations → finds reservationA claims "A5" → false\n   - Throws SeatUnavailableException("A5")\n\n6. Exception propagates to BookingSystem. Thread B\'s reservation is never registered.\n\nFinal state:\n- showtime.reservations = [reservationA]\n- reservationsById = {"conf-A" → reservationA}\n- Exactly one thread succeeded. Requirement R6 satisfied.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the temporary seat hold extension",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "In the base design, booking is instantaneous (check + store). In reality, users spend time during checkout (entering payment, etc.). Design a temporary seat hold mechanism. Describe the new data structures, the modified availability check, the hold-then-confirm flow, and how expired holds are cleaned up. Explain how this fits into the existing concurrency model.",
        explanation:
          "Must cover: SeatHold class with seatIds/holdId/expiresAt. Holds map on Showtime. Modified isAvailable checking both reservations and non-expired holds. holdSeats + confirmHold replacing single book(). Background cleanup for expired holds. Key insight: fits into existing synchronized(this) without changing the locking strategy.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "New data structures:\n- SeatHold class: { seatIds: List<string>, holdId: string, expiresAt: timestamp }\n- Showtime gains a holds: Map<string, SeatHold> alongside the existing reservations list\n\nModified availability check:\nisAvailable(seatId) now checks both confirmed reservations AND active (non-expired) holds:\n1. Scan reservations — if any reservation claims the seat, return false\n2. Scan holds — if any hold with expiresAt > now claims the seat, return false\n3. Otherwise return true\n\nHold-then-confirm flow:\n1. holdSeats(seatIds, timeoutMs): Inside synchronized(this), check all seats are available (checking both reservations and holds), create a SeatHold with expiration = now + timeout, add to holds map, return holdId.\n2. User completes payment (5-minute window)\n3. confirmHold(holdId, reservation): Inside synchronized(this), look up the hold, verify it hasn't expired, remove from holds map, add reservation to reservations list. If expired: remove hold, throw HoldExpiredException.\n\nExpired hold cleanup:\nA background task runs periodically (e.g., every 30 seconds) calling cleanupExpiredHolds() which scans the holds map inside synchronized(this) and removes entries where now > expiresAt. Alternatively, expired holds are naturally ignored by isAvailable (which checks expiresAt), so cleanup is an optimization for memory, not correctness.\n\nConcurrency model: Both holdSeats and confirmHold run inside synchronized(this), same as book and cancel. The per-showtime lock serializes holds and bookings against each other. No change to the locking strategy — the extension fits cleanly into the existing model.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Compare per-showtime and per-seat locking approaches",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Compare per-showtime locking and per-seat locking for the Showtime.book() method. For each approach, describe the mechanism, its throughput characteristics, and its complexity costs. When would you recommend each?",
        explanation:
          "Must cover: Per-showtime = synchronized(this), simple, no deadlock risk, serializes all bookings for a showtime. Per-seat = individual locks per seat, sorted acquisition to prevent deadlock, Seat promoted to class, two mutable state representations. Recommend per-showtime for most cases (short critical section), per-seat only when measured bottleneck on extremely popular showtimes.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Per-Showtime Locking:\n- Mechanism: synchronized(this) wraps the entire check-and-store sequence. One thread at a time per showtime.\n- Throughput: All booking attempts for the same showtime serialize, even for non-conflicting seats. Alice booking A5-A6 blocks Bob booking M12-M13.\n- Complexity: Minimal. Seat stays a string. One mutable data structure (reservations). No deadlock risk.\n- When to use: Default choice. The critical section is fast (scan reservations + list append), so even on popular showtimes, threads wait briefly.\n\nPer-Seat Locking:\n- Mechanism: Each seat has its own Lock object. Multi-seat bookings acquire locks in sorted order (A5 before A6, always) to prevent deadlock.\n- Throughput: Non-conflicting bookings proceed in parallel. Alice booking A5-A6 doesn't block Bob booking M12-M13.\n- Complexity: High. Seat promoted from string to class with Lock + bookedBy field. Two mutable state representations (per-seat bookedBy + reservations list) must stay in sync. Cancellation must re-acquire all seat locks.\n- When to use: Only when per-showtime locking becomes a measured bottleneck — e.g., opening night of a Marvel movie with hundreds of concurrent bookings for the same showtime.\n\nRecommendation: Start with per-showtime. It's simpler, sufficient for 95% of cases, and easier to reason about for correctness. Per-seat locking is the optimization you reach for when the simpler approach is demonstrably too slow — not before.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Explain the BookingSystem orchestration pattern",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "BookingSystem acts as an orchestrator while Showtime owns the booking state. Explain this separation of responsibilities using the booking and cancellation flows as examples. Why doesn't BookingSystem own the reservations directly? What would go wrong if it did?",
        explanation:
          "Must cover: BookingSystem validates, creates reservation object, routes to Showtime, registers in index. Showtime validates seats and stores atomically. If BookingSystem owned reservations, it would need to coordinate with Showtime's seat state — two-phase commit problem for every booking. Collocating state and behavior on Showtime means one lock, one data structure, one object handles the atomic check-and-store.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Separation of responsibilities:\n\nBookingSystem (orchestrator):\n- Validates inputs (non-null showtime ID, non-empty seat list)\n- Routes to correct Showtime via index (showtimesById lookup)\n- Creates the Reservation data object (generates confirmation ID)\n- Hands the reservation to Showtime for atomic validation + storage\n- Maintains the routing index (reservationsById) for cancellation lookup\n- Does NOT modify any booking state directly\n\nShowtime (state owner):\n- Validates seat IDs exist in the layout\n- Checks all seats are available (scans its own reservations list)\n- Stores the reservation atomically under a synchronized block\n- Handles cancellation by removing the reservation\n- Owns the single source of truth for seat state\n\nWhy not have BookingSystem own reservations?\nIf BookingSystem stored all reservations globally, booking would require coordinating between BookingSystem's reservation storage and Showtime's seat availability. You'd face a two-phase problem: \"update Showtime's state\" and \"register in BookingSystem\" must both succeed or both fail. With a network boundary (or even just two locks), this is hard to make atomic.\n\nBy collocating reservations with the entity that checks seat availability (Showtime), the check-and-store happens on a single object under a single lock. No cross-object consistency problem. BookingSystem's reservationsById index is secondary — if the booking fails, nothing is registered. If it succeeds, the index update is a simple map put with no atomicity concern.",
          minLength: 150,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Design dynamic showtime addition with index consistency",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "The current design assumes all theaters, movies, and showtimes are configured at construction time. Design an addShowtime(theater, showtime) method that supports dynamic additions. What data structures must be updated? What thread safety concerns arise? How do you handle the movie index if this is a brand new movie?",
        explanation:
          "Must update: theater.showtimes, showtimesById, showtimesByMovieId, moviesById (idempotent for existing movies). Thread safety: need a write lock on BookingSystem for structural changes, separate from per-showtime booking locks. New movie is handled naturally by idempotent map writes. Should mention the classic tradeoff with denormalized data: reads get faster, but writes must update every index.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "addShowtime(theater, showtime) must update every data structure the constructor populated:\n\n1. theater.getShowtimes().add(showtime) — so getShowtimes and getShowtimesForMovie return it\n2. showtimesById[showtime.getId()] = showtime — so book() can route by ID\n3. movie = showtime.getMovie()\n   moviesById[movie.getId()] = movie — idempotent: overwrites if existing, adds if new\n4. if !showtimesByMovieId.contains(movie.getId()):\n       showtimesByMovieId[movie.getId()] = []\n   showtimesByMovieId[movie.getId()].add(showtime) — so searchMovies finds it\n\nNew movies are handled naturally: the idempotent map write adds the movie to moviesById, and a new list is created in showtimesByMovieId. No special case needed.\n\nThread safety: addShowtime modifies BookingSystem-level indexes that search and booking operations read. If a showtime is added while a search is iterating moviesById.values(), we get a ConcurrentModificationException. Options:\n- ReadWriteLock on BookingSystem: searches acquire read lock, addShowtime acquires write lock. Searches run concurrently, structural changes are exclusive.\n- ConcurrentHashMap for all indexes: allows concurrent reads during writes without locking.\n- Important: this lock is independent of per-showtime synchronized blocks. A new showtime has no reservations, so there's no contention with the booking path.\n\nTradeoff: Every index the constructor populates needs a corresponding update in addShowtime. If you later add a new index, you must remember to update it here too. This is the classic cost of denormalized data: fast reads, but writes must maintain consistency across multiple structures.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Total seats per showtime calculation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Given the constant seat layout (rows A through Z, seats 0 through 20), how many total seats does each showtime have? Show your calculation.",
        explanation:
          "Rows A through Z = 26 rows. Seats 0 through 20 = 21 seats per row. 26 × 21 = 546 seats per showtime. This is a fixed constant used by getAvailableSeats() to enumerate all possible seats.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "546 seats (26 rows × 21 seats per row)",
          acceptableAnswers: ["546", "546 seats", "26 × 21 = 546", "26 * 21 = 546"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Why cancel() is synchronized",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Showtime.cancel() simply removes a reservation from the list. Why does it still need to be wrapped in a synchronized block?",
        explanation:
          "Without the lock, a concurrent booking could scan reservations in the middle of the removal, seeing a partially modified list. The synchronized block ensures the removal is atomic with respect to any concurrent booking attempts. A booking thread checking isAvailable would see either the pre-cancel or post-cancel state, never an inconsistent in-between.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Without synchronization, a concurrent booking could scan the reservations list during partial removal, seeing inconsistent state.",
          acceptableAnswers: [
            "concurrent",
            "race condition",
            "partially modified",
            "atomic",
            "inconsistent state",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Deadlock scenario with per-seat locking",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Describe a concrete deadlock scenario that occurs with per-seat locking if locks are NOT acquired in a consistent order. Use two threads and two seats.",
        explanation:
          "Thread A locks seat A5, then tries to lock A6. Thread B locks A6, then tries to lock A5. Thread A holds A5 and waits for A6 (held by B). Thread B holds A6 and waits for A5 (held by A). Neither can proceed — deadlock. The fix: sort seat IDs before acquiring locks, so both threads would lock A5 first, then A6.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Thread A locks A5 then waits for A6. Thread B locks A6 then waits for A5. Each holds what the other needs — deadlock. Fix: sort seat IDs before acquiring locks.",
          acceptableAnswers: [
            "deadlock",
            "circular wait",
            "holds what the other needs",
            "sorted order",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Why Reservation uses defensive copies",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "The Reservation constructor stores a defensive copy of seatIds, and getSeatIds() returns a copy. Why is this important for the booking system's correctness?",
        explanation:
          "Without defensive copies, the caller retains a reference to the original list. If they modify it after construction (add or remove seats), the reservation's seat list changes without going through Showtime's synchronized booking logic. This could corrupt seat availability state — seats could appear booked without a proper booking, or booked seats could disappear without a proper cancellation.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Without defensive copies, external code could modify the seat list after booking, corrupting seat availability state without going through Showtime's synchronized logic.",
          acceptableAnswers: [
            "defensive copy",
            "external modification",
            "corrupting",
            "mutate",
            "bypass synchronized",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match entities to their primary responsibility",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each entity to its primary responsibility in the BookMyShow system:",
        explanation:
          "BookingSystem is the orchestrator that routes operations and provides cross-theater queries. Theater is a container for showtimes at a physical location. Showtime owns seat state and handles booking concurrency. Reservation is a data record holding the confirmation ID and booked seats, with a back-reference for cancellation routing.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "BookingSystem",
              right: "Orchestrator: routes operations, provides cross-theater search and browse",
            },
            {
              id: "p2",
              left: "Theater",
              right: "Container for showtimes at a named physical location",
            },
            {
              id: "p3",
              left: "Showtime",
              right: "Owns seat state, stores reservations, handles booking concurrency",
            },
            {
              id: "p4",
              left: "Reservation",
              right:
                "Data record: confirmation ID, seat list, and back-reference for cancel routing",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match BookingSystem indexes to the operations they optimize",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each BookingSystem index to the operation it primarily optimizes:",
        explanation:
          "moviesById allows searchMovies to scan only movie objects (not all showtimes). showtimesByMovieId groups showtimes by movie for returning search results. showtimesById gives O(1) lookup when book() receives a showtime ID. reservationsById gives O(1) lookup when cancelReservation receives a confirmation ID.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "moviesById",
              right: "searchMovies — scan movies instead of all showtimes",
            },
            {
              id: "p2",
              left: "showtimesByMovieId",
              right: "searchMovies — return all showtimes for matching movies",
            },
            {
              id: "p3",
              left: "showtimesById",
              right: "book() — O(1) routing from showtime ID to Showtime object",
            },
            {
              id: "p4",
              left: "reservationsById",
              right: "cancelReservation — O(1) lookup by confirmation ID",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match concurrency approaches to their tradeoff profiles",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each concurrency approach for Showtime.book() to its tradeoff profile:",
        explanation:
          "No synchronization allows double-booking (classic TOCTOU race). Per-showtime locking (synchronized(this)) is simple with no deadlock risk but serializes all bookings for a showtime. Per-seat locking with sorted acquisition achieves maximum parallelism but adds significant complexity (Seat class, two state representations, deadlock prevention). Per-seat locking without sorted acquisition risks deadlock from circular wait.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "No synchronization",
              right: "Check-then-act race condition: two users can book the same seat",
            },
            {
              id: "p2",
              left: "synchronized(this) on Showtime",
              right: "Simple, no deadlock risk, but serializes all bookings for this showtime",
            },
            {
              id: "p3",
              left: "Per-seat locks with sorted acquisition",
              right:
                "Max parallelism for non-conflicting seats, but high complexity and two state representations",
            },
            {
              id: "p4",
              left: "Per-seat locks without sorted acquisition",
              right: "Deadlock risk from circular wait when booking multiple seats",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Seat layout constant",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In the BookMyShow design, all screens share the same seat layout: rows _____ through _____, seats 0 through 20.",
        explanation:
          "The interviewer confirmed all screens use the same layout: rows A through Z (26 rows), seats 0 through 20 (21 seats per row). This standardization eliminated the need for a separate Screen class and per-screen configuration.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "In the BookMyShow design, all screens share the same seat layout: rows {{blank1}} through {{blank2}}, seats 0 through 20.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "A",
              acceptableAnswers: ["A", "a"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "Z",
              acceptableAnswers: ["Z", "z"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Concurrency race condition name",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The booking race condition where two threads both check seat availability and then both store reservations is called a _____ race condition.",
        explanation:
          "This is a check-then-act (also known as TOCTOU — Time of Check to Time of Use) race condition. The availability check and the state modification happen in separate steps without atomicity, allowing another thread to slip between them.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The booking race condition where two threads both check seat availability and then both store reservations is called a {{blank1}} race condition.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "check-then-act",
              acceptableAnswers: [
                "check-then-act",
                "check then act",
                "TOCTOU",
                "time of check to time of use",
                "toctou",
              ],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Bidirectional relationship setup",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "Showtime has a _____ reference to Theater for navigation, while Theater has a showtimes list. The _____ is the aggregate root, and the bidirectional link is established once during setup and never changes.",
        explanation:
          "Showtime has a theater back-reference so users can navigate from reservation → showtime → theater. Theater is the aggregate root — it owns the lifecycle of its showtimes. The bidirectional link is established at construction time. Theater's showtimes list is the canonical collection; Showtime's theater reference is purely for navigation, not mutation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "Showtime has a {{blank1}} reference to Theater for navigation, while Theater has a showtimes list. The {{blank2}} is the aggregate root, and the bidirectional link is established once during setup and never changes.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "theater",
              acceptableAnswers: ["theater", "back", "back-reference", "parent"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "Theater",
              acceptableAnswers: ["Theater", "theater"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — medium
    {
      title: "Maximum reservations per showtime",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "If every reservation books exactly 2 seats, what is the maximum number of reservations possible for a single showtime? (Seat layout: rows A-Z, seats 0-20)",
        explanation:
          "Total seats = 26 rows × 21 seats = 546 seats. With exactly 2 seats per reservation: 546 / 2 = 273 reservations maximum. This is the theoretical maximum assuming perfect packing. In practice, odd seat counts or non-adjacent bookings could leave one seat unbooked (272 reservations + 1 orphan seat).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 273,
          tolerance: 0,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Index memory overhead estimation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A city has 50 theaters, each with 10 screens showing 5 showtimes per screen per day. BookingSystem builds the showtimesById index at construction. How many entries does the showtimesById map contain? (Answer the total number of showtimes indexed)",
        explanation:
          "50 theaters × 10 screens × 5 showtimes = 2,500 showtime entries in the showtimesById map. Each entry is a string key (showtime ID) mapped to a Showtime object reference. This is a small map — HashMap lookup remains O(1) with negligible memory overhead.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 2500,
          tolerance: 0,
        },
      },
    },
  ],
};
