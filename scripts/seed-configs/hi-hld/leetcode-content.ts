import { StoryPointSeed, ItemSeed } from "../subhang-content";

// ── LeetCode (Code Execution Platform) — HLD Story Point ──

export const leetcodeContent: StoryPointSeed = {
  title: "LeetCode — Code Execution Platform System Design",
  description:
    "Design a coding practice platform like LeetCode that supports browsing problems, submitting code in multiple languages, secure sandboxed execution, and live competition leaderboards. Covers containerized code execution, async task processing, Redis sorted sets, and horizontal scaling.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_execution", title: "Sandboxed Code Execution", orderIndex: 1 },
    { id: "sec_q_architecture", title: "System Architecture & API Design", orderIndex: 2 },
    { id: "sec_q_leaderboard", title: "Leaderboard & Redis Optimization", orderIndex: 3 },
    { id: "sec_q_scaling", title: "Scaling & Async Processing", orderIndex: 4 },
    { id: "sec_q_tradeoffs", title: "Design Tradeoffs & Comparisons", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIAL 1: Problem Understanding & High-Level Design
    // ═══════════════════════════════════════════════════════
    {
      title: "LeetCode — Problem Understanding & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "LeetCode — Problem Understanding & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is LeetCode?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "LeetCode is a platform that helps software engineers prepare for coding interviews. It offers a vast collection of coding problems, ranging from easy to hard, and provides a platform for users to submit solutions and get feedback. They also run periodic coding competitions with live leaderboards.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Users should be able to view a list of coding problems",
                  "Users should be able to view a given problem and code a solution in multiple languages",
                  "Users should be able to submit their solution and get instant feedback",
                  "Users should be able to view a live leaderboard for competitions",
                ],
              },
            },
            {
              id: "b5",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "The system should prioritize availability over consistency",
                  "The system should support isolation and security when running user code",
                  "The system should return submission results within 5 seconds",
                  "The system should scale to support competitions with 100,000 users",
                ],
              },
            },
            {
              id: "b7",
              type: "quote",
              content:
                "LeetCode only has a few hundred thousand users and roughly 4,000 problems. Relative to most system design interviews, this is a small-scale system. This has a significant impact on design — a monolithic architecture may be more appropriate than microservices.",
            },
            {
              id: "b8",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 2 },
            },
            {
              id: "b9",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Problem — stores the problem statement, test cases, code stubs per language, and expected output",
                  "Submission — stores the user's code submission and the result of running the code against the test cases",
                  "Leaderboard — stores competition rankings based on problems solved and solve time",
                ],
              },
            },
            {
              id: "b10",
              type: "heading",
              content: "API Design",
              metadata: { level: 2 },
            },
            {
              id: "b11",
              type: "code",
              content: `// Browse problems with pagination
GET /problems?page=1&limit=100 → Partial<Problem>[]

// View a specific problem with code stub
GET /problems/:id?language={language} → Problem

// Submit a solution
POST /problems/:id/submit → Submission
  Body: { code: string, language: string }
  // userId from session/JWT, NOT from client body

// View live leaderboard
GET /leaderboard/:competitionId?page=1&limit=100 → Leaderboard`,
              metadata: { language: "text" },
            },
            {
              id: "b12",
              type: "heading",
              content: "Problem Schema",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "code",
              content: `{
  id: string,
  title: string,
  question: string,
  level: string,
  tags: string[],
  codeStubs: {
    python: string,
    javascript: string,
    typescript: string,
    ...
  },
  testCases: {
    type: string,     // e.g., "tree", "array", "string"
    input: JSON,
    output: JSON
  }[]
}`,
              metadata: { language: "json" },
            },
            {
              id: "b14",
              type: "heading",
              content: "High-Level Architecture: Monolith vs Microservices",
              metadata: { level: 2 },
            },
            {
              id: "b15",
              type: "paragraph",
              content:
                "Most systems in interviews use microservices. However, LeetCode is small enough that a simple client-server (monolithic) architecture is more appropriate. The overhead of managing multiple services is not worth it for this scale. A simple API server backed by a database (NoSQL like DynamoDB works well since test cases can be nested as subdocuments) handles problem browsing and submission management, while containerized code execution handles the CPU-intensive work.",
            },
            {
              id: "b16",
              type: "heading",
              content: "Code Execution Design Evolution",
              metadata: { level: 2 },
            },
            {
              id: "b17",
              type: "paragraph",
              content:
                "Bad: Run code directly on the API server — massive security risk (malicious code, crypto mining, DDoS), performance issues (CPU intensive), and no isolation (crash takes down the server). Good: Run code in a VM — isolated and secure, but VMs are resource intensive and slow to start up, expensive to manage lifecycle. Great: Run code in Docker containers — lightweight, fast startup, isolated from host. Share the host OS kernel but use security measures (read-only filesystem, CPU/memory limits, network disabled, seccomp) for protection. Each language gets a pre-built container image. Also Great: Serverless functions (Lambda) — auto-scaling, managed, but cold start latency can hurt the 5-second requirement.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // MATERIAL 2: Deep Dives — Execution, Leaderboard, Scaling
    // ═══════════════════════════════════════════════════════
    {
      title: "LeetCode — Deep Dives: Code Execution, Leaderboard & Scaling",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "LeetCode — Deep Dives: Code Execution, Leaderboard & Scaling",
          blocks: [
            {
              id: "dd1",
              type: "heading",
              content: "Deep Dive 1: Container Security & Isolation",
              metadata: { level: 2 },
            },
            {
              id: "dd2",
              type: "paragraph",
              content:
                "Running user code is inherently dangerous. Containers provide isolation, but additional security layers are essential. These measures collectively create a sandboxed environment where user code has minimal ability to affect the host or other users.",
            },
            {
              id: "dd3",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Read-Only Filesystem — mount the code directory as read-only; output goes to a temporary directory deleted after completion",
                  "CPU and Memory Bounds — enforce hard limits; container is killed if exceeded, preventing resource exhaustion",
                  "Explicit Timeout — wrap user code in a 5-second timeout; kill the process if it exceeds the limit (handles infinite loops)",
                  "Network Access Disabled — prevent all outbound/inbound traffic using VPC Security Groups and NACLs; users cannot exfiltrate data or launch attacks",
                  "Seccomp Profiles — restrict system calls the container can make; prevent privilege escalation or kernel-level exploits",
                ],
              },
            },
            {
              id: "dd4",
              type: "heading",
              content: "Deep Dive 2: Async Execution with Queue",
              metadata: { level: 2 },
            },
            {
              id: "dd5",
              type: "paragraph",
              content:
                "For synchronous execution, the API server sends code directly to a container and waits. This works at low scale but becomes problematic during competitions. Adding a queue (SQS) between the API server and worker containers makes the system asynchronous: the API server enqueues submissions, workers pull and process them. The client polls GET /check/:id every second to check results. This buffers traffic spikes, enables retries on container failure, and prevents submission loss.",
            },
            {
              id: "dd6",
              type: "heading",
              content: "Pattern: Managing Long-Running Tasks",
              metadata: { level: 3 },
            },
            {
              id: "dd7",
              type: "paragraph",
              content:
                "Code execution in LeetCode demonstrates the long-running tasks pattern. APIs immediately return a job ID while background workers handle time-consuming operations. This pattern applies broadly — video transcoding, report generation, data processing. The client polls for results rather than holding an open connection. Some candidates propose WebSockets here, but polling at 1-second intervals is simpler and perfectly adequate given the modest user base.",
            },
            {
              id: "dd8",
              type: "heading",
              content: "Deep Dive 3: Leaderboard Optimization",
              metadata: { level: 2 },
            },
            {
              id: "dd9",
              type: "paragraph",
              content:
                "Bad: Poll the database every 5 seconds, querying all submissions for a competition, grouping by user, and sorting — enormous database load with 100k users. Good: Cache the leaderboard in Redis, update periodically (every 30 seconds) from the database — reduces DB load but stale data and still has polling overhead. Great: Redis Sorted Set with real-time updates. Use ZADD to update scores on each submission, ZRANGE with REV to fetch top N. Clients poll every 5 seconds but the server returns pre-computed results from Redis — no expensive DB queries.",
            },
            {
              id: "dd10",
              type: "code",
              content: `// Redis Sorted Set for leaderboard
// Key: competition:leaderboard:{competitionId}
// Score: composite of problems solved + solve time
// Member: userId

// Update on submission:
ZADD competition:leaderboard:{compId} {score} {userId}

// Fetch top 100:
ZRANGE competition:leaderboard:{compId} 0 99 REV WITHSCORES

// Note: ZREVRANGE is deprecated since Redis 6.2
// Use ZRANGE with REV flag instead`,
              metadata: { language: "text" },
            },
            {
              id: "dd11",
              type: "heading",
              content: "Deep Dive 4: Scaling for 100k Competition Users",
              metadata: { level: 2 },
            },
            {
              id: "dd12",
              type: "paragraph",
              content:
                "Bad: Vertical scaling — even the largest AWS instances top out at a few hundred vCPUs. With 10k concurrent submissions × 100 test cases × 100ms each = ~1,667 CPU cores needed to process within one minute. A single machine cannot handle this. Great: Dynamic horizontal scaling with ECS Auto Scaling — spin up container instances based on CPU utilization and queue depth. Even better: add a queue to buffer submissions, preventing overload and enabling retries. Workers pull from the queue at their own pace. Pre-scale before known competitions based on registration numbers.",
            },
            {
              id: "dd13",
              type: "heading",
              content: "Deep Dive 5: Running Test Cases Across Languages",
              metadata: { level: 2 },
            },
            {
              id: "dd14",
              type: "paragraph",
              content:
                'You cannot write separate test cases per language — that does not scale. Instead, store test cases in a standardized serialization format (JSON). Each language runtime has a test harness that deserializes inputs into language-specific data structures (e.g., array [3,9,20,null,null,15,7] → TreeNode object), executes the user function, and compares output. For example, a "tree" type test case serializes as BFS-level-order array. Each language container has pre-installed helper classes (TreeNode, ListNode) and a deserialization layer.',
            },
          ],
          readingTime: 14,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // MATERIAL 3: Interview Expectations & Tradeoff Summary
    // ═══════════════════════════════════════════════════════
    {
      title: "LeetCode — Interview Expectations by Level",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "LeetCode — Interview Expectations by Level",
          blocks: [
            {
              id: "ie1",
              type: "heading",
              content: "What Interviewers Expect at Each Level",
              metadata: { level: 2 },
            },
            {
              id: "ie2",
              type: "heading",
              content: "Mid-Level (IC4)",
              metadata: { level: 3 },
            },
            {
              id: "ie3",
              type: "paragraph",
              content:
                "80% breadth, 20% depth. Clearly define API endpoints and data model. Land on a functional high-level design that meets functional requirements. Should understand the need for security and isolation when running user code and propose containers, VMs, or serverless functions. Not expected to proactively identify deep design issues — interviewer guides deep dives.",
            },
            {
              id: "ie4",
              type: "heading",
              content: "Senior (IC5)",
              metadata: { level: 3 },
            },
            {
              id: "ie5",
              type: "paragraph",
              content:
                '60% breadth, 40% depth. Speed through the initial high-level design to spend time discussing code execution security in detail. Should compare containers vs VMs vs serverless with clear pros and cons. Must be able to "break out of box drawing mode" and explain how to actually run test cases against user code across languages. Proactively identify bottlenecks in the leaderboard design.',
            },
            {
              id: "ie6",
              type: "heading",
              content: "Staff+ (IC6)",
              metadata: { level: 3 },
            },
            {
              id: "ie7",
              type: "paragraph",
              content:
                "40% breadth, 60% depth. Drive the entire conversation. Proactively identify issues and propose solutions. Design a simple system free of over-engineering but with a clear path to scale. Articulate why WebSockets are overkill for this scale. Know when a queue adds value (retries, buffering) vs when it adds unnecessary complexity. Treat the interviewer as a peer.",
            },
            {
              id: "ie8",
              type: "heading",
              content: "Key Tradeoff Summary",
              metadata: { level: 2 },
            },
            {
              id: "ie9",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Monolith vs Microservices: Monolith is appropriate for LeetCode's modest scale — avoid over-engineering",
                  "Containers vs VMs vs Serverless: Containers win on startup speed and resource efficiency; serverless adds cold start risk",
                  "Sync vs Async execution: Sync works for low scale; async with queue adds buffering, retries, and graceful degradation",
                  "DB queries vs Redis Sorted Set for leaderboard: Redis eliminates expensive DB queries; ZADD/ZRANGE are O(log N)",
                  "WebSocket vs Polling: 5-second polling is adequate for leaderboard; WebSockets add complexity without meaningful benefit at this scale",
                  "Queue vs No Queue: Queue adds retries and spike buffering but introduces async complexity; justified mainly for competition surges",
                  "Fixed test cases per language vs Standardized serialization: Standardized JSON + per-language harness scales to any language",
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS — 28 total
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — Easy
    {
      title: "Best approach for running user-submitted code",
      type: "question",
      sectionId: "sec_q_execution",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In a LeetCode-like system, what is the most appropriate way to run user-submitted code?",
        explanation:
          "Docker containers provide lightweight isolation with fast startup times. Unlike VMs, containers share the host OS kernel, making them much more resource-efficient. They can be secured with read-only filesystems, CPU/memory limits, disabled network access, and seccomp profiles. Running code on the API server is a massive security risk, and VMs are too resource-intensive for this use case.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Run the code directly on the API server process", isCorrect: false },
            { id: "b", text: "Send the code to a third-party API for execution", isCorrect: false },
            {
              id: "c",
              text: "Run the code in the user's browser using WebAssembly",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Run the code in isolated Docker containers with security restrictions",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 2 — Easy
    {
      title: "Why monolith over microservices for LeetCode",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why might a monolithic architecture be more appropriate than microservices for a LeetCode-like system?",
        explanation:
          "LeetCode has a few hundred thousand users and ~4,000 problems — relatively small scale. The overhead of managing multiple services (network latency, deployment complexity, distributed tracing) outweighs the benefits at this scale. A single codebase is simpler to develop, deploy, and debug. Staff-level candidates recognize when NOT to use microservices.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Docker containers only work with monolithic applications",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Microservices cannot handle code execution workloads",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Monolithic architectures are always faster than microservices",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The system is small enough that microservices overhead is not justified",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 3 — Easy
    {
      title: "Why userId should not be in the request body",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When designing the submission API (POST /problems/:id/submit), why should userId NOT be included in the request body?",
        explanation:
          "Any data sent from the client can be easily manipulated. A malicious user could change the userId to submit code on behalf of another user. The userId should always come from the server-side session or JWT, which the client cannot forge. Similarly, timestamps should be server-generated. This is a security red flag that interviewers watch for.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "It makes the request body too large", isCorrect: false },
            { id: "b", text: "It violates REST conventions for POST endpoints", isCorrect: false },
            {
              id: "c",
              text: "Client-sent data can be manipulated; userId must come from the session/JWT",
              isCorrect: true,
            },
            { id: "d", text: "The API server does not need to know the userId", isCorrect: false },
          ],
        },
      },
    },

    // MCQ 4 — Medium
    {
      title: "Container vs VM key architectural difference",
      type: "question",
      sectionId: "sec_q_execution",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "What is the fundamental architectural difference between running user code in a Docker container vs a Virtual Machine that makes containers faster to start?",
        explanation:
          "VMs run on a hypervisor and include a full OS kernel, the application, binaries, and libraries — adding significant overhead. Containers share the host OS kernel and only package the application and its dependencies, making them extremely lightweight. This is why containers start in milliseconds while VMs take seconds to minutes. The tradeoff: containers provide less isolation than VMs since they share the kernel.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Containers compress the application code before execution",
              isCorrect: false,
            },
            {
              id: "b",
              text: "VMs require manual configuration while containers auto-configure",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Containers share the host OS kernel instead of running their own full OS",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Containers use hardware acceleration while VMs do not",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — Medium
    {
      title: "Why polling beats WebSockets for LeetCode leaderboard",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Many candidates propose WebSockets for the live leaderboard. Why is 5-second polling with Redis a better choice for a LeetCode-like system?",
        explanation:
          "WebSockets maintain persistent connections and add connection management complexity (reconnection, heartbeats, state management). For LeetCode with ~100k competition users and a 5-second acceptable delay, polling is vastly simpler. The Redis Sorted Set returns results in O(log N), making each poll trivially fast. Staff candidates demonstrate expertise by choosing simpler solutions and articulating why the complex option is overkill.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "WebSockets cannot be used with Redis", isCorrect: false },
            {
              id: "b",
              text: "WebSockets add connection management complexity without meaningful benefit at this scale",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Polling is always more efficient than WebSockets for any real-time system",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The browser limits the number of WebSocket connections to 5",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — Medium
    {
      title: "Redis Sorted Set operation for leaderboard update",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When a user successfully solves a competition problem, which Redis command updates their leaderboard position in the sorted set?",
        explanation:
          "ZADD adds or updates a member in a sorted set with a given score. If the userId already exists, ZADD updates the score. This is an O(log N) operation, making it extremely fast even with 100k users. ZRANGE (with REV) retrieves the top N users. ZINCRBY would increment a score but we need to set a composite score (problems solved + time), not just increment.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "HSET competition:leaderboard:{compId} {userId} {score}",
              isCorrect: false,
            },
            {
              id: "b",
              text: "ZADD competition:leaderboard:{compId} {score} {userId}",
              isCorrect: true,
            },
            { id: "c", text: "LPUSH competition:leaderboard:{compId} {userId}", isCorrect: false },
            {
              id: "d",
              text: "SET competition:leaderboard:{compId}:{userId} {score}",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — Hard
    {
      title: "Why queue improves reliability for code execution",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "Adding an SQS queue between the API server and code execution workers introduces async complexity. What is the strongest justification for this added complexity in a LeetCode-like system?",
        explanation:
          "The queue's strongest value is enabling retries on container failure and preventing submission loss during traffic spikes. If a container crashes while processing a submission, the message returns to the queue and another worker picks it up. Without a queue, a container failure means the submission is lost. The buffer also absorbs sudden spikes (competition start/end) without overwhelming containers. The async complexity (polling via GET /check/:id) is a worthwhile tradeoff.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Queues eliminate the need for horizontal scaling of worker containers",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Queues make the system synchronous, reducing latency",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Queues are required for Docker containers to receive work",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Queues enable automatic retries on container failure and buffer traffic spikes",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 8 — Hard
    {
      title: "Handling test case execution across languages",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A LeetCode problem requires a TreeNode input. The system stores test cases in a language-agnostic JSON format. How should the system convert [3,9,20,null,null,15,7] into a TreeNode for the user's Python solution?",
        explanation:
          'Each language container includes pre-installed helper classes (TreeNode, ListNode, etc.) and a deserialization layer (test harness). The test case specifies its type ("tree") and the harness uses the appropriate deserializer to convert the BFS-level-order array into a language-native TreeNode object. This architecture means test cases are written once in JSON and work across all supported languages, avoiding the maintenance nightmare of per-language test suites.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Write separate test cases for each language with native TreeNode objects",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Convert all test inputs to strings and pass them as command-line arguments",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Pass the raw JSON array and let the user's code handle deserialization",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A per-language test harness in the container deserializes the JSON array into a native TreeNode",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — Easy
    {
      title: "Container security measures for user code",
      type: "question",
      sectionId: "sec_q_execution",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL security measures that should be applied when running user-submitted code in Docker containers:",
        explanation:
          "All five measures are essential: read-only filesystem prevents data tampering, CPU/memory limits prevent resource exhaustion, timeouts prevent infinite loops, disabled networking prevents exfiltration/attacks, and seccomp prevents dangerous system calls. However, compiling code on the API server would defeat the purpose of containerization — compilation must happen inside the container.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "Explicit timeout to kill long-running processes", isCorrect: true },
            {
              id: "b",
              text: "CPU and memory hard limits that kill the container if exceeded",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Compile user code on the API server before sending to container",
              isCorrect: false,
            },
            { id: "d", text: "Seccomp profiles to restrict system calls", isCorrect: true },
            {
              id: "e",
              text: "Disable all network access via VPC Security Groups",
              isCorrect: true,
            },
            {
              id: "f",
              text: "Read-only filesystem with temporary output directory",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 2 — Medium
    {
      title: "Problems with running code directly on API server",
      type: "question",
      sectionId: "sec_q_execution",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL problems that arise from running user-submitted code directly on the API server:",
        explanation:
          "Running user code on the API server is catastrophic: (1) Security — malicious code can delete data, mine crypto, launch DDoS attacks, or exfiltrate data. (2) Performance — code execution is CPU intensive and can crash the server. (3) Isolation — a crash takes down the entire server, blocking all other requests. (4) No timeout control — infinite loops consume resources indefinitely. However, the issue is NOT about language support — any language can be installed on the server.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "CPU-intensive code execution can crash the server", isCorrect: true },
            {
              id: "b",
              text: "The API server cannot install multiple programming languages",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Infinite loops consume resources with no kill mechanism",
              isCorrect: true,
            },
            { id: "d", text: "A code crash takes down the entire API server", isCorrect: true },
            {
              id: "e",
              text: "Malicious code could compromise the server or exfiltrate data",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — Medium
    {
      title: "Benefits of async queue-based execution",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL benefits of adding a message queue (SQS) between the API server and code execution workers:",
        explanation:
          "The queue provides: (1) buffering during traffic spikes, (2) automatic retries when containers crash, (3) no submission loss even during failures, (4) decoupled scaling — workers can be scaled independently of the API server. The queue does NOT make execution faster — it actually adds a small amount of latency. The tradeoff is reliability and resilience vs added async complexity.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Buffers submissions during traffic spikes without overwhelming workers",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Prevents submission loss during infrastructure issues",
              isCorrect: true,
            },
            { id: "c", text: "Enables automatic retries on container failure", isCorrect: true },
            {
              id: "d",
              text: "Allows workers to be scaled independently of the API server",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Makes code execution faster by pre-processing submissions",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — Hard
    {
      title: "Reasons Redis Sorted Set suits leaderboard",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL reasons why a Redis Sorted Set is well-suited for a competition leaderboard compared to direct database queries:",
        explanation:
          "Redis Sorted Sets are ideal because: (1) In-memory data structure provides microsecond reads. (2) ZADD is O(log N), enabling real-time score updates. (3) ZRANGE with REV returns top N in O(log N + M) where M is the result size — no GROUP BY/ORDER BY overhead. (4) Updates are atomic. However, Redis is NOT persistent by default — it's a cache. The primary database remains the source of truth, and Redis can be rebuilt from it if needed.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "ZRANGE with REV retrieves top N without expensive DB sort operations",
              isCorrect: true,
            },
            {
              id: "b",
              text: "In-memory storage provides microsecond read latency",
              isCorrect: true,
            },
            { id: "c", text: "ZADD updates scores in O(log N) time", isCorrect: true },
            {
              id: "d",
              text: "Score updates are atomic, preventing race conditions",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Redis Sorted Sets provide durable persistence, replacing the database",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — Medium
    {
      title: "Explain the code submission flow end-to-end",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Trace the complete flow when a user submits code on LeetCode, from the moment they click "Submit" to seeing their results. Cover the API server, queue (if used), container execution, and result delivery.',
        explanation:
          "Step 1: Client sends POST /problems/:id/submit with code and language. Step 2: API server validates the request and enqueues the submission to SQS (or sends directly to the container for sync execution). Returns a submission ID immediately. Step 3: A worker picks the message from the queue, spins up (or reuses) the appropriate language container, mounts the user code, and executes it against all test cases. The container runs with security restrictions (read-only FS, CPU/memory limits, timeout, no network). Step 4: Worker reads output from the container, stores results in the database (pass/fail, runtime, memory). Step 5: Client polls GET /check/:id every ~1 second. When results are available, the server returns them.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          rubric: [
            "Describes the API endpoint and initial request handling",
            "Explains the queue-based async flow (or sync alternative)",
            "Covers container execution with security measures",
            "Mentions result storage in the database",
            "Describes client-side polling for results",
          ],
        },
      },
    },

    // Paragraph 2 — Medium
    {
      title: "Compare code execution environments",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Compare three approaches for running user-submitted code: directly on the API server, in a Virtual Machine, and in a Docker container. For each, explain the key advantage and the critical weakness.",
        explanation:
          "API Server: Advantage — simplest to implement (save code, exec, read output). Weakness — devastating security risk (malicious code can compromise the entire server, delete data, launch attacks) and no isolation (crash kills the server for all users). VM: Advantage — strong isolation (full OS boundary; even kernel exploits are contained). Weakness — resource intensive (each VM runs a full OS) and slow startup (seconds to minutes), making it expensive to manage at scale. Docker Container: Advantage — lightweight isolation with fast startup (share host kernel, package only app + deps). Weakness — weaker isolation than VMs (shared kernel means a kernel exploit could escape); must add seccomp, read-only FS, network restrictions to compensate.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          rubric: [
            "Correctly identifies the security risk of API server execution",
            "Explains VM isolation strength but resource overhead weakness",
            "Explains container advantages (lightweight, fast) and kernel-sharing risk",
            "Mentions mitigation strategies for container weaknesses",
          ],
        },
      },
    },

    // Paragraph 3 — Hard
    {
      title: "Design the leaderboard system for competitions",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a leaderboard system for LeetCode competitions with up to 100,000 users. Cover the scoring model, data storage, real-time updates, and explain why your approach is better than querying the database directly. Include the specific Redis data structures and commands you would use.",
        explanation:
          "Scoring: rank by number of distinct problems solved (DESC), tie-break by earliest last solve time (ASC). A composite score encodes both dimensions. Storage: Redis Sorted Set with key competition:leaderboard:{compId}, score = composite, member = userId. Updates: On each successful submission, update Redis with ZADD (O(log N)) and also persist to the main database. Retrieval: ZRANGE key 0 99 REV WITHSCORES returns top 100 in O(log N + 100). Clients poll every 5 seconds. Why not DB: direct SQL (GROUP BY userId, ORDER BY count DESC) on every poll with 100k users and frequent submissions would crush the database. The query scans all submissions, groups, and sorts — O(N log N) per request, multiplied by thousands of concurrent polls. Redis pre-computes the ranking in-memory, making each poll trivially cheap.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          rubric: [
            "Defines a clear scoring model with tiebreaking logic",
            "Describes Redis Sorted Set with specific key schema and commands (ZADD, ZRANGE REV)",
            "Explains dual write to both Redis and the main database",
            "Quantifies the database cost of direct querying vs Redis approach",
            "Describes the client polling mechanism and acceptable delay",
          ],
        },
      },
    },

    // Paragraph 4 — Hard
    {
      title: "Design the test case execution architecture",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain how LeetCode runs the same test cases across multiple programming languages. How are test inputs serialized, how does each language container deserialize them, and what does the test harness look like? Use a concrete example (e.g., binary tree problem).",
        explanation:
          'Test cases are stored in a standardized JSON format: { type: "tree", input: [3,9,20,null,null,15,7], output: 3 }. The "type" field indicates the data structure and determines the deserialization strategy. Each language container contains: (1) Pre-installed helper classes (TreeNode, ListNode, etc.) that match the provided code stubs. (2) A test harness that reads the JSON test case, deserializes the input based on type (e.g., for "tree", BFS-level-order array → TreeNode using a queue-based reconstruction), calls the user\'s function with the deserialized input, and compares the return value to the expected output. For the binary tree example: the Python harness would use a queue to build the tree from [3,9,20,null,null,15,7], create a TreeNode(3) root, attach children level by level, then call solution.maxDepth(root) and assert the result equals 3. This way, one set of test cases works across Python, Java, JavaScript, etc.',
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          rubric: [
            "Describes standardized JSON test case format with type field",
            "Explains per-language container with helper classes and test harness",
            "Uses a concrete example (e.g., tree deserialization from BFS array)",
            "Explains why per-language test cases would not scale",
            "Mentions serialization strategy (BFS for trees, arrays for lists, etc.)",
          ],
        },
      },
    },

    // Paragraph 5 — Hard
    {
      title: "Scaling code execution for competition surges",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "During a LeetCode competition, 10,000 users submit solutions simultaneously. Each submission runs ~100 test cases, each taking ~100ms. Calculate the required compute capacity and design a scaling strategy. Explain why vertical scaling fails and how you would use horizontal scaling with a queue.",
        explanation:
          "Capacity math: 10k submissions × 100 test cases × 100ms = 100,000 seconds of CPU time. To process within 1 minute: 100,000 / 60 ≈ 1,667 CPU cores needed. The largest AWS instances have ~100-400 vCPUs — vertical scaling cannot meet this. Horizontal scaling strategy: Use ECS with Auto Scaling groups. Pre-scale before competitions based on registration numbers. Add SQS queue between API server and workers: API server enqueues submissions (returns job ID immediately), workers pull at their own pace. Queue absorbs spikes, enables retries, prevents loss. Workers auto-scale based on queue depth and CPU utilization. Progressive polling: poll more frequently (2s) in the last minutes of competition, less (10s) at other times. Key insight: even the queue may be overkill for 100k users if you pre-scale, but it provides a safety net for unexpected spikes.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          rubric: [
            "Shows the math: 10k × 100 × 100ms = 100,000s CPU time, ~1,667 cores for 1 min",
            "Explains why vertical scaling fails (max vCPUs < required cores)",
            "Describes horizontal scaling with ECS Auto Scaling",
            "Explains the queue-based architecture for buffering and retries",
            "Mentions pre-scaling strategy based on competition registration",
          ],
        },
      },
    },

    // Paragraph 6 — Hard
    {
      title: "Argue for or against queue-based architecture",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'A candidate proposes adding an SQS queue for code execution in a LeetCode-like system. The interviewer asks: "Isn\'t this over-engineering?" Make a Staff-level argument for AND against the queue, then state your recommendation with clear justification.',
        explanation:
          "Against the queue: LeetCode has modest scale (~100k competition users). If competitions require registration, we know expected load in advance and can pre-scale containers. Sync execution is simpler — API server sends code to container, waits, returns result. No polling needed. Fewer moving parts = easier to debug and maintain. The queue adds async complexity (client must poll, message visibility timeout management, dead-letter queues). For the queue: It enables automatic retries on container failure (message returns to queue). It buffers unexpected traffic spikes without dropping submissions. It decouples API server throughput from execution throughput. Even if traffic is predictable, container crashes are not — the queue provides resilience. Recommendation: Include the queue. The main justification is NOT volume handling (pre-scaling covers that) but reliability — automatic retries on container failure and guaranteed no submission loss. The async complexity (1-second polling via GET /check/:id) is a small price for this resilience. This is exactly what LeetCode actually does — you can see the polling in the network tab when you submit.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          rubric: [
            "Presents a genuine argument against the queue (not a strawman)",
            "Presents a genuine argument for the queue",
            "Makes a clear recommendation with explicit justification",
            "Identifies reliability (retries) as the primary queue benefit, not just throughput",
            "Demonstrates awareness of the tradeoff between simplicity and resilience",
          ],
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — Medium
    {
      title: "Name the async execution pattern",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "When the API server returns a job ID immediately and the client polls for results, what is this distributed systems pattern called? Name one other use case besides code execution.",
        explanation:
          'This is the "Long-Running Tasks" (or "Async Job Processing") pattern. The API accepts the request, returns a job/task ID, and background workers process the task. The client polls a status endpoint for completion. Other use cases: video transcoding, report generation, data processing pipelines, image processing, PDF generation.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Long-running tasks (async job processing) pattern. Other uses: video transcoding, report generation, data processing.",
        },
      },
    },

    // Text 2 — Medium
    {
      title: "Redis command for retrieving top N leaderboard",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What Redis command retrieves the top 100 users from a competition leaderboard stored in a sorted set? Note: ZREVRANGE is deprecated since Redis 6.2.",
        explanation:
          "ZRANGE competition:leaderboard:{compId} 0 99 REV WITHSCORES. The REV flag reverses the order (highest scores first). WITHSCORES includes the score values in the response. ZREVRANGE is deprecated since Redis 6.2 in favor of ZRANGE with the REV flag.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "ZRANGE key 0 99 REV WITHSCORES",
        },
      },
    },

    // Text 3 — Hard
    {
      title: "Why containers share kernel is a security concern",
      type: "question",
      sectionId: "sec_q_execution",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Docker containers share the host OS kernel. Explain in 1-2 sentences why this is a security concern for running untrusted user code, and name the Linux kernel feature used to restrict system calls as mitigation.",
        explanation:
          "Since containers share the host kernel, a kernel exploit in user code could theoretically escape the container and compromise the host system and all other containers. Seccomp (Secure Computing Mode) is the Linux kernel feature used to restrict which system calls a container can make, limiting the attack surface for kernel-level exploits.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Shared kernel means kernel exploits could escape the container. Seccomp restricts system calls to mitigate this.",
        },
      },
    },

    // Text 4 — Hard
    {
      title: "Competition leaderboard SQL query",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Write the SQL query to compute a competition leaderboard from the submissions table. Rank users by number of distinct problems solved (descending), with ties broken by earliest last solve time.",
        explanation:
          "SELECT userId, COUNT(DISTINCT problemId) AS numSolved, MAX(submittedAt) AS lastSolveTime FROM submissions WHERE competitionId = :compId AND passed = true GROUP BY userId ORDER BY numSolved DESC, lastSolveTime ASC. The COUNT(DISTINCT problemId) handles multiple submissions for the same problem. MAX(submittedAt) gives the time of the last solve, used as tiebreaker. This query becomes expensive at scale with frequent polling — motivating the Redis Sorted Set approach.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "SELECT userId, COUNT(DISTINCT problemId) AS numSolved, MAX(submittedAt) AS lastSolveTime FROM submissions WHERE competitionId = :compId AND passed = true GROUP BY userId ORDER BY numSolved DESC, lastSolveTime ASC",
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — Easy
    {
      title: "Match LeetCode components to responsibilities",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each LeetCode architecture component to its primary responsibility:",
        explanation:
          "The API Server handles HTTP requests, validates input, and coordinates between components. Docker containers execute user code in isolation. The Database (DynamoDB) stores problems, submissions, and results. Redis maintains the real-time leaderboard using sorted sets. Understanding the role of each component is foundational to discussing the design.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              left: "API Server",
              right: "Handles HTTP requests, validates input, coordinates workflow",
            },
            { left: "Docker Container", right: "Executes user code in an isolated sandbox" },
            { left: "Database (DynamoDB)", right: "Stores problems, submissions, and results" },
            { left: "Redis Sorted Set", right: "Maintains real-time competition leaderboard" },
          ],
        },
      },
    },

    // Matching 2 — Medium
    {
      title: "Match code execution approach to key limitation",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each code execution approach to its most critical limitation:",
        explanation:
          "Direct API server execution has catastrophic security risks. VMs are resource-heavy and slow to start. Serverless functions suffer from cold start latency which threatens the 5-second requirement. Containers have weaker isolation than VMs due to shared kernel. Each approach has distinct tradeoffs that a senior candidate must articulate clearly.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              left: "Run on API Server",
              right: "Massive security risk — no isolation from production",
            },
            {
              left: "Virtual Machine",
              right: "Resource intensive and slow startup (seconds to minutes)",
            },
            {
              left: "Serverless Function",
              right: "Cold start latency threatens 5-second response target",
            },
            { left: "Docker Container", right: "Shared kernel provides weaker isolation than VMs" },
          ],
        },
      },
    },

    // Matching 3 — Hard
    {
      title: "Match leaderboard approach to scalability characteristic",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each leaderboard implementation to its scalability characteristic with 100k concurrent users polling every 5 seconds:",
        explanation:
          "Direct DB polling runs an expensive GROUP BY + ORDER BY on every request — O(N log N) per poll with full table scans under load. Periodic cache refresh reduces DB queries to every 30s but data can be stale and there are still polling round trips. Redis Sorted Set provides O(log N) reads (ZRANGE) and updates (ZADD) with in-memory speed — trivial per-request cost even with 100k users.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              left: "Direct DB query on each poll",
              right: "O(N log N) per request, database bottleneck at scale",
            },
            {
              left: "Periodic cache refresh from DB",
              right: "Reduced DB load but stale data up to 30 seconds",
            },
            {
              left: "Redis Sorted Set with real-time ZADD",
              right: "O(log N) reads and updates, microsecond latency",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — Easy
    {
      title: "Container isolation fill-in-the-blank",
      type: "question",
      sectionId: "sec_q_execution",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Docker _____ share the host OS kernel and isolate application processes, making them more lightweight than Virtual Machines which run a full _____.",
        explanation:
          "Docker containers share the host OS kernel and isolate application processes using namespaces and cgroups, making them more lightweight than VMs. Virtual Machines run a full operating system (OS) on top of a hypervisor, including the kernel, which adds significant overhead.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "b1", correctAnswer: "containers", position: 0 },
            { id: "b2", correctAnswer: "operating system", position: 1 },
          ],
        },
      },
    },

    // Fill-blanks 2 — Easy
    {
      title: "Redis sorted set fill-in-the-blank",
      type: "question",
      sectionId: "sec_q_leaderboard",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "A Redis _____ _____ is an in-memory data structure that stores members with associated scores, allowing efficient ranking and retrieval of top-N elements.",
        explanation:
          "A Redis Sorted Set (also called ZSET) stores unique members with a floating-point score. It supports O(log N) insertion and O(log N + M) range queries, making it ideal for leaderboards, rankings, and priority queues.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "b1", correctAnswer: "sorted", position: 0 },
            { id: "b2", correctAnswer: "set", position: 1 },
          ],
        },
      },
    },

    // Fill-blanks 3 — Medium
    {
      title: "Async execution pattern fill-in-the-blank",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "In the async code execution flow, the API server enqueues submissions to _____ and returns a job ID. Workers pull submissions and execute them. The client _____ the server using GET /check/:id every second to retrieve results.",
        explanation:
          "SQS (Simple Queue Service) buffers submissions between the API server and workers. The client polls the server — sending repeated GET requests at intervals to check if results are ready. This is the standard long-running tasks pattern used when immediate synchronous response is not possible.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            { id: "b1", correctAnswer: "SQS", position: 0 },
            { id: "b2", correctAnswer: "polls", position: 1 },
          ],
        },
      },
    },

    // ── Numerical (2 questions) ──

    // Numerical 1 — Medium
    {
      title: "Calculate CPU cores needed for competition",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "During a competition, 10,000 users submit solutions simultaneously. Each submission runs 100 test cases, each taking 100ms. How many CPU cores (approximately) are needed to process all submissions within 1 minute?",
        explanation:
          "Total CPU time: 10,000 submissions × 100 test cases × 0.1 seconds = 100,000 CPU-seconds. To complete in 60 seconds: 100,000 / 60 ≈ 1,667 CPU cores. This calculation demonstrates why vertical scaling (max ~400 vCPUs per instance) is insufficient and horizontal scaling across many machines is required.",
        basePoints: 15,
        difficulty: "medium",
        questionData: { correctAnswer: 1667, tolerance: 50 },
      },
    },

    // Numerical 2 — Hard
    {
      title: "Calculate leaderboard DB query cost vs Redis",
      type: "question",
      sectionId: "sec_q_tradeoffs",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A competition has 100,000 users. With direct database polling, each leaderboard request queries all submissions (assume 500,000 rows) with GROUP BY and ORDER BY. If 20,000 users poll every 5 seconds, how many database queries per second does this generate? Compare this to Redis where ZRANGE takes 0.1ms — how many total milliseconds does Redis spend per second on the same load?",
        explanation:
          "20,000 users / 5 seconds = 4,000 database queries per second. Each query scans 500k rows with GROUP BY and ORDER BY — an extremely expensive operation 4,000 times per second. With Redis: 4,000 ZRANGE calls/second × 0.1ms each = 400ms of Redis CPU time per second. Redis handles this trivially on a single core while the database would be completely overwhelmed. This is a ~1000x reduction in computational cost per request.",
        basePoints: 25,
        difficulty: "hard",
        questionData: { correctAnswer: 400, tolerance: 50 },
      },
    },
  ],
};
