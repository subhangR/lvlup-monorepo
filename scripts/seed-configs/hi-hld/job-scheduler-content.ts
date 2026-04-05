import { StoryPointSeed, ItemSeed } from "../subhang-content";

// ── Job Scheduler — HLD Interview Prep ──
// Source: HelloInterview — Job Scheduler breakdown by Evan King
// 3 rich materials + 30 practice questions

export const jobSchedulerContent: StoryPointSeed = {
  title: "Job Scheduler",
  description:
    "Design a distributed job scheduler that handles immediate, scheduled, and recurring jobs at scale — covering two-phase scheduling, message queues, at-least-once execution, and idempotency.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_fundamentals", title: "Core Concepts & Data Model", orderIndex: 1 },
    { id: "sec_q_scheduling", title: "Two-Phase Scheduling & Queues", orderIndex: 2 },
    { id: "sec_q_fault_tolerance", title: "Fault Tolerance & Failure Detection", orderIndex: 3 },
    { id: "sec_q_idempotency", title: "Idempotency & At-Least-Once Semantics", orderIndex: 4 },
    { id: "sec_q_scaling", title: "Scaling & Interview Strategy", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════

    // Material 1: Fundamentals — Requirements, Entities, API, Data Model
    {
      title: "Job Scheduler Fundamentals",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Job Scheduler Fundamentals",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is a Job Scheduler?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                'A job scheduler is a program that automatically schedules and executes jobs at specified times or intervals. It automates repetitive tasks, runs scheduled maintenance, or executes batch processes. Two key terms: a Task is the abstract concept of work to be done (e.g., "send an email"), while a Job is an instance of a task — combining the task, schedule, and parameters (e.g., "send email to john@example.com at 10:00 AM Friday").',
            },
            {
              id: "b3",
              type: "heading",
              content: "Functional Requirements",
              metadata: { level: 3 },
            },
            {
              id: "b4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Users should be able to schedule jobs to be executed immediately, at a future date, or on a recurring schedule (e.g., "every day at 10:00 AM").',
                  "Users should be able to monitor the status of their jobs.",
                ],
              },
            },
            {
              id: "b5",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 3 },
            },
            {
              id: "b6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "High availability (availability > consistency).",
                  "Execute jobs within 2 seconds of their scheduled time.",
                  "Scalable to support up to 10k jobs per second.",
                  "At-least-once execution of jobs.",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "Core Entities",
              metadata: { level: 3 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Task: Represents a reusable unit of work to be executed.",
                  "Job: An instance of a task — includes the task reference, schedule, and execution parameters.",
                  "Schedule: Defines when a job runs — either a CRON expression or a specific DateTime.",
                  "User: Can schedule jobs and view the status of their jobs.",
                ],
              },
            },
            {
              id: "b9",
              type: "heading",
              content: "API Design",
              metadata: { level: 3 },
            },
            {
              id: "b10",
              type: "code",
              content:
                '// Create a job\nPOST /jobs\n{\n  "task_id": "send_email",\n  "schedule": "0 10 * * *",\n  "parameters": {\n    "to": "john@example.com",\n    "subject": "Daily Report"\n  }\n}\n\n// Query job status\nGET /jobs?user_id={user_id}&status={status}&start_time={start_time}&end_time={end_time}\n-> Job[]',
              metadata: { language: "text" },
            },
            {
              id: "b11",
              type: "heading",
              content: "Data Model: Separating Definition from Execution",
              metadata: { level: 3 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                "A key insight is separating job definitions from execution instances. Think of a calendar: you have an event that repeats every Monday, but you see individual instances on each Monday. The Jobs table stores definitions (job_id, user_id, task_id, schedule, parameters), while the Executions table tracks individual runs (time_bucket, execution_time, job_id, status, attempt).",
            },
            {
              id: "b13",
              type: "code",
              content:
                '// Jobs Table — stores job definitions\n{\n  "job_id": "123e4567-...",     // Partition key\n  "user_id": "user_123",\n  "task_id": "send_email",\n  "schedule": {\n    "type": "CRON",\n    "expression": "0 10 * * *"\n  },\n  "parameters": { "to": "john@example.com" }\n}\n\n// Executions Table — tracks individual runs\n{\n  "time_bucket": 1715547600,    // Partition key (Unix ts rounded to hour)\n  "execution_time": "1715548800-123e4567-...", // Sort key\n  "job_id": "123e4567-...",\n  "user_id": "user_123",\n  "status": "PENDING",\n  "attempt": 0\n}',
              metadata: { language: "json" },
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                "Using time_bucket (Unix timestamp rounded to nearest hour) as partition key enables efficient querying — we only need to scan 1-2 partitions to find all upcoming jobs. When a recurring job completes, the next occurrence is calculated and a new Executions entry is created.",
            },
            {
              id: "b15",
              type: "quote",
              content:
                "\"This pattern of separating the definition of something from its instances is common in system design. You'll see it in calendar systems, notification systems, and many other places. It's a powerful way to handle recurring or templated behaviors.\" — Evan King, HelloInterview",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Two-Phase Scheduling & Message Queues
    {
      title: "Two-Phase Scheduling Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Two-Phase Scheduling Architecture",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "The Precision Problem",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "paragraph",
              content:
                "Polling the database every few minutes to find due jobs creates an inherent upper bound on execution precision. Running the poll every 2 seconds to meet our 2s requirement means fetching ~20k jobs per query (10k/s × 2s), which creates prohibitive database load and processing overhead. The solution is a two-layered scheduler that marries durability with precision.",
            },
            {
              id: "c3",
              type: "heading",
              content: "Phase 1: Database Query",
              metadata: { level: 3 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                "A cron job runs every ~5 minutes to query the Executions table for jobs due in the next 5 minutes. This keeps database load minimal — just one query per 5 minutes instead of thousands.",
            },
            {
              id: "c5",
              type: "heading",
              content: "Phase 2: Message Queue with Delayed Delivery",
              metadata: { level: 3 },
            },
            {
              id: "c6",
              type: "paragraph",
              content:
                "Jobs from Phase 1 are pushed to a message queue with appropriate delay values, so they only become visible to workers at (or near) their scheduled execution time. Workers continuously poll the queue and process messages as they become visible, achieving sub-second precision.",
            },
            {
              id: "c7",
              type: "heading",
              content: "Queue Technology Options",
              metadata: { level: 3 },
            },
            {
              id: "c8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Redis Sorted Sets (Good): Uses execution timestamp as score for ordering. Sub-millisecond latency and atomic operations, but requires custom retry logic and careful replication management.",
                  "RabbitMQ (Good): TTL + Dead Letter Exchange pattern for delayed delivery. Mature but requires quorum queues for HA, and DLX-based delays add complexity.",
                  "Amazon SQS (Great): Native delayed delivery via DelaySeconds (up to 15 min). Fully managed, auto-scaling, built-in visibility timeouts and dead-letter queues. Best fit for this use case.",
                ],
              },
            },
            {
              id: "c9",
              type: "heading",
              content: "Handling Immediate Jobs (< 5 min)",
              metadata: { level: 3 },
            },
            {
              id: "c10",
              type: "paragraph",
              content:
                "Jobs scheduled to run in less than 5 minutes bypass the database-query phase and go directly to the message queue with the appropriate delay. This prevents them from being missed by the next cron cycle. Note: Kafka is unsuitable here because it processes messages in order within a partition — a new job would wait behind already-queued jobs regardless of its scheduled time.",
            },
            {
              id: "c11",
              type: "heading",
              content: "Complete Data Flow",
              metadata: { level: 3 },
            },
            {
              id: "c12",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "User creates a new job → written to the database.",
                  "Cron job runs every 5 min → queries database for jobs due in the next ~5 min.",
                  "Jobs pushed to SQS with appropriate delay values.",
                  "Workers continuously poll SQS and process messages as they become visible.",
                  "If a new job has scheduled_time < 5 min from now → sent directly to SQS.",
                ],
              },
            },
            {
              id: "c13",
              type: "quote",
              content:
                '"By running database queries just once every 5 minutes, we reduce database load while maintaining precision through the message queue. The message queue\'s high throughput means workers can pull and process jobs as fast as they become available." — Evan King, HelloInterview',
            },
          ],
          readingTime: 7,
        },
      },
    },

    // Material 3: Scaling, Fault Tolerance, and Idempotency
    {
      title: "Scaling, Fault Tolerance & Idempotency",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Scaling, Fault Tolerance & Idempotency",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Scaling to 10k Jobs/Second",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "heading",
              content: "Database Scaling",
              metadata: { level: 3 },
            },
            {
              id: "d3",
              type: "paragraph",
              content:
                "Jobs table is partitioned by job_id, distributing writes evenly. The Executions table uses time_bucket as partition key, but all writes for the current hour land on the same partition — a potential hot partition. Solution: write sharding by appending a random suffix (e.g., time_bucket#shard_3), spreading writes across multiple partitions. Workers query all shards in parallel for a given time bucket.",
            },
            {
              id: "d4",
              type: "heading",
              content: "Message Queue Capacity",
              metadata: { level: 3 },
            },
            {
              id: "d5",
              type: "paragraph",
              content:
                "Each 5-minute window processes ~3 million jobs (10k/s × 300s). With ~200-byte messages, that is 600MB per window. SQS Standard queues offer virtually unlimited throughput — 10k messages/s is well within capacity without special configuration. Multiple queues may be used for functional separation (priorities, job types) rather than scaling.",
            },
            {
              id: "d6",
              type: "heading",
              content: "Worker Layer: Containers vs Lambda",
              metadata: { level: 3 },
            },
            {
              id: "d7",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Containers (ECS/K8s): Cost-effective for steady workloads, maintain state, support long-running jobs. Require more operational overhead.",
                  "Lambda: Truly serverless, instant auto-scaling, minimal ops. But cold starts may impact 2s precision, and more expensive for steady high-volume workloads.",
                  "Recommendation: Containers with auto-scaling groups for this steady 10k/s workload. Use spot instances, scale on queue depth, pre-warm for baseline load.",
                ],
              },
            },
            {
              id: "d8",
              type: "heading",
              content: "At-Least-Once Execution & Failure Handling",
              metadata: { level: 2 },
            },
            {
              id: "d9",
              type: "heading",
              content: "Visible Failures (Task Code Bugs)",
              metadata: { level: 3 },
            },
            {
              id: "d10",
              type: "paragraph",
              content:
                "Wrap task code in try/catch, log error, update Executions status to RETRYING. Re-enqueue to SQS with exponential backoff (e.g., 5s → 25s → 125s) using DelaySeconds. After max retries (e.g., 3), mark as FAILED. SQS dead-letter queues catch messages that exceed the retry limit.",
            },
            {
              id: "d11",
              type: "heading",
              content: "Invisible Failures (Worker Crashes)",
              metadata: { level: 3 },
            },
            {
              id: "d12",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Health Checks (Bad): Monitoring service polls /health endpoints. Does not scale with thousands of workers, false positives from network issues, SPOF.",
                  "Job Leasing (Good): Workers acquire database leases with expiry timestamps, periodically renew them. If a worker crashes, the lease expires and another worker takes over. But 10k jobs/s → ~50k lease ops/s, plus clock skew and network partition issues.",
                  "SQS Visibility Timeout (Great): SQS natively makes messages invisible after pickup. If a worker crashes, the message reappears after the visibility timeout (e.g., 30s). Workers heartbeat via ChangeMessageVisibility API to extend timeout for long jobs. No extra infrastructure needed.",
                ],
              },
            },
            {
              id: "d13",
              type: "heading",
              content: "Idempotency",
              metadata: { level: 3 },
            },
            {
              id: "d14",
              type: "paragraph",
              content:
                "At-least-once execution means jobs may run more than once. The system must be idempotent. Three approaches:",
            },
            {
              id: "d15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "No Idempotency (Bad): Just execute every time. Leads to duplicate emails, double transfers, incorrect counters.",
                  "Deduplication Table (Good): Check a dedup table before executing. Adds DB overhead, needs cleanup, has race condition window.",
                  'Idempotent Job Design (Great): Design jobs to be naturally idempotent using idempotency keys and conditional operations. E.g., "set counter to X" instead of "increment counter". Each execution includes a unique ID for downstream deduplication.',
                ],
              },
            },
            {
              id: "d16",
              type: "heading",
              content: "Data Archival",
              metadata: { level: 3 },
            },
            {
              id: "d17",
              type: "paragraph",
              content:
                "Once a reasonable time has passed (e.g., 1 year), completed execution records can be moved to cheaper storage like S3. This keeps the Executions table lean and performant while preserving historical data for auditing or analytics.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // QUESTIONS (30 total)
    // MCQ: 8, MCAQ: 4, Paragraph: 6, Text: 4, Matching: 3,
    // Fill-blanks: 3, Numerical: 2
    // ═══════════════════════════════════════════════════════════

    // ── MCQ (8) ──────────────────────────────────────────────

    // MCQ 1 — easy
    {
      title: "Task vs Job distinction",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "In a job scheduler, what is the relationship between a Task and a Job?",
        explanation:
          'A Task is the abstract definition of work (e.g., "send an email"), while a Job is a specific instance of a task bound to a schedule and parameters (e.g., "send email to john@example.com every day at 10 AM"). Multiple jobs can reference the same task with different parameters and schedules. This separation enables reusability — you define the task logic once and create many jobs from it.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A Task is a scheduled item; a Job is the worker that executes it",
              isCorrect: false,
            },
            {
              id: "b",
              text: "A Task and a Job are interchangeable terms for the same concept",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A Task is a group of Jobs that run in sequence",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A Task is a reusable definition of work; a Job is an instance of a Task with a specific schedule and parameters",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why separate Jobs and Executions tables",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why does a job scheduler separate job definitions (Jobs table) from execution instances (Executions table)?",
        explanation:
          "If recurring jobs stored only a CRON expression in a single table, finding due jobs would require evaluating every CRON expression in the database — clearly not scalable. By materializing individual execution instances with concrete timestamps, we can efficiently query for upcoming jobs using time-based partition keys. The job definition stays the same while new execution instances are created for each occurrence.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It reduces storage costs by avoiding data duplication",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It is required by DynamoDB to support secondary indexes",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Recurring jobs would require evaluating every CRON expression to find due jobs; pre-materialized execution rows enable efficient time-based queries",
              isCorrect: true,
            },
            {
              id: "d",
              text: "It allows using different database engines for each table",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Time bucket partition key purpose",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "In the Executions table, the partition key is time_bucket (Unix timestamp rounded to nearest hour). What is the primary benefit of this design?",
        explanation:
          "By rounding execution times to hourly buckets, we only need to query 1-2 partitions (current hour and possibly next hour) to find all upcoming jobs. This is far more efficient than scanning the entire table. The trade-off is that all writes for a given hour concentrate on one partition, which can be addressed with write sharding.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It enforces that no two jobs can be scheduled for the same time",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It allows the database to automatically delete old execution records",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It guarantees even write distribution across all partitions",
              isCorrect: false,
            },
            {
              id: "d",
              text: "We only need to query 1-2 partitions to find all upcoming jobs, enabling efficient reads",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why Kafka is unsuitable for the priority queue",
      type: "question",
      sectionId: "sec_q_scheduling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A newly created job is scheduled to run in 30 seconds, but the message queue already has jobs queued for the next 5 minutes. Why is Kafka unsuitable as the message queue for this scenario?",
        explanation:
          "Kafka processes messages strictly in order within a partition. A new job added to a partition would go to the end and wait behind all already-queued jobs — even if it is scheduled sooner. This means the job cannot execute within its 2-second precision window. SQS, Redis sorted sets, or RabbitMQ with delayed delivery can handle this because they support priority or delay-based ordering rather than strict append-order.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Kafka processes messages in strict partition order, so the new job would wait behind all already-queued jobs regardless of its schedule",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Kafka does not support message persistence",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Kafka requires ZooKeeper which adds unacceptable latency",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Kafka cannot handle 10k messages per second",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "SQS visibility timeout for worker failure",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A worker picks up a job from SQS and crashes midway through execution. What happens to the job message?",
        explanation:
          "When a worker receives an SQS message, the message becomes invisible for the duration of the visibility timeout. If the worker processes it successfully, it deletes the message. If the worker crashes without deleting it, the visibility timeout expires and SQS automatically makes the message visible again for another worker to pick up. This provides at-least-once delivery without any custom failure detection infrastructure.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "SQS detects the worker crash and immediately re-queues the message",
              isCorrect: false,
            },
            {
              id: "b",
              text: "The message is permanently lost and must be re-created from the Executions table",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The message is moved directly to the dead-letter queue",
              isCorrect: false,
            },
            {
              id: "d",
              text: "After the visibility timeout expires, SQS makes the message visible again for another worker to process",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Hot partition in Executions table",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "The Executions table uses time_bucket as partition key. At 10k jobs/second, all writes for the current hour concentrate on a single partition. What is the best solution?",
        explanation:
          "Write sharding appends a random suffix to the partition key (e.g., time_bucket#shard_3), distributing writes across multiple partitions. Workers then query all shards for a given time bucket in parallel and merge the results. This is a standard DynamoDB pattern for hot partitions. Increasing provisioned capacity does not solve the per-partition limit. Switching to job_id would lose time-based locality. Reducing bucket size still concentrates writes.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Switch the partition key to job_id for even distribution",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Increase the DynamoDB provisioned write capacity units",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Reduce the time bucket from 1 hour to 1 minute",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Add write sharding by appending a random suffix to the partition key, then query all shards in parallel",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Two-phase scheduler — why not just poll frequently",
      type: "question",
      sectionId: "sec_q_scheduling",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "Instead of a two-phase scheduler, why not simply poll the database every 2 seconds to meet the 2-second precision requirement?",
        explanation:
          "At 10k jobs/second, each 2-second poll would fetch ~20k jobs, creating massive payloads. The query itself could take several hundred milliseconds with network latency and serialization. Repeated large queries every 2 seconds create prohibitive database load. After retrieval, distributing jobs to workers adds further delay, consuming the precision window. The two-phase approach solves this by querying once every 5 minutes (low DB load) and achieving precision through the message queue layer.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "It would violate the CAP theorem by requiring both consistency and availability",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Each poll fetches ~20k jobs, the query/transfer overhead alone consumes the precision window, and the repeated load would destabilize the database",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Workers cannot process jobs fast enough from database results",
              isCorrect: false,
            },
            {
              id: "d",
              text: "DynamoDB does not support queries more frequent than once per minute",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Job leasing — clock skew failure mode",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "In a job leasing system, Worker A acquires a lease on Job X with expiry at 10:30:15. Worker A's clock reads 10:30:00, but Worker B's clock reads 10:30:20 due to clock skew. What is the most likely failure mode?",
        explanation:
          "Worker B believes the lease has expired (10:30:20 > 10:30:15) and acquires the job, while Worker A still believes it has 15 seconds left and continues processing. This results in duplicate execution — two workers processing the same job simultaneously. This is a fundamental challenge with distributed leasing: clock synchronization across workers becomes critical. SQS visibility timeouts avoid this because the timeout is managed server-side by a single source of truth (AWS infrastructure).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Worker B rejects all jobs until clock sync completes",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Worker B steals the job while Worker A is still executing, causing duplicate execution",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Worker A's lease is automatically extended by the clock skew amount",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The database detects the conflict and aborts both workers",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4) ─────────────────────────────────────────────

    // MCAQ 1 — easy
    {
      title: "Valid job execution statuses",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL valid statuses for a job execution record in the Executions table:",
        explanation:
          "PENDING (waiting to run), IN_PROGRESS (currently executing), COMPLETED (finished successfully), FAILED (exceeded max retries), and RETRYING (failed but not yet exhausted retries) are all valid execution statuses. SCHEDULED is not needed — that information lives in the Jobs table. The Executions table only tracks the lifecycle of individual execution instances.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "SCHEDULED", isCorrect: false },
            { id: "b", text: "FAILED", isCorrect: true },
            { id: "c", text: "RETRYING", isCorrect: true },
            { id: "d", text: "PENDING", isCorrect: true },
            { id: "e", text: "COMPLETED", isCorrect: true },
            { id: "f", text: "IN_PROGRESS", isCorrect: true },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Benefits of SQS over job leasing for failure detection",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL advantages of using SQS visibility timeouts over a database-based job leasing pattern for handling worker failures:",
        explanation:
          "SQS visibility timeouts are managed server-side (no clock skew issues), require zero additional infrastructure (no lease management code or DB), and automatically handle dead-letter routing for messages that fail too many times. However, SQS does NOT guarantee exactly-once processing — it provides at-least-once delivery, meaning the same message could be delivered more than once.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Built-in dead-letter queue for messages that exceed retry limits",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Guarantees exactly-once processing of every job",
              isCorrect: false,
            },
            {
              id: "c",
              text: "No additional infrastructure to build or maintain",
              isCorrect: true,
            },
            {
              id: "d",
              text: "No clock synchronization issues — timeout is managed server-side",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Queue technologies supporting delayed delivery",
      type: "question",
      sectionId: "sec_q_scheduling",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL technologies that can serve as the priority/delay queue in the two-phase scheduler architecture:",
        explanation:
          "Redis Sorted Sets use execution timestamp as score for priority ordering. RabbitMQ achieves delayed delivery via TTL + Dead Letter Exchange. SQS has native DelaySeconds support. Kafka processes messages in strict append order within partitions and does not support delayed delivery or priority ordering, making it unsuitable for this use case.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            { id: "a", text: "Redis Sorted Sets", isCorrect: true },
            { id: "b", text: "Amazon SQS", isCorrect: true },
            { id: "c", text: "RabbitMQ with TTL + DLX", isCorrect: true },
            { id: "d", text: "Apache Kafka", isCorrect: false },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Consequences of at-least-once execution",
      type: "question",
      sectionId: "sec_q_idempotency",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "A job scheduler guarantees at-least-once execution. Select ALL consequences that the system or its job authors must account for:",
        explanation:
          "At-least-once means a job may execute multiple times. This requires idempotent job design (running twice produces the same outcome as once), deduplication at downstream services (using idempotency keys), and monitoring for duplicate executions. However, at-least-once does NOT mean every job will eventually succeed — jobs can still permanently fail after exhausting retries (e.g., if the task code has a bug or inputs are invalid).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Monitoring must track and alert on duplicate job executions",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Downstream services must support deduplication via idempotency keys",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Job implementations must be idempotent — running twice should produce the same result as once",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Every job is guaranteed to eventually complete successfully",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6) ────────────────────────────────────────

    // Paragraph 1 — medium
    {
      title: "Explain the two-phase scheduling architecture",
      type: "question",
      sectionId: "sec_q_scheduling",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain the two-phase scheduling architecture for a job scheduler. Why is it needed, and how does each phase contribute to meeting the 2-second execution precision requirement?",
        explanation:
          "A strong answer should cover: (1) The problem — polling the database every 2 seconds is infeasible at 10k jobs/s due to massive query payloads (~20k jobs per query), database load, and processing overhead. (2) Phase 1 — a cron job queries the Executions table every ~5 minutes for upcoming jobs, keeping database load low. (3) Phase 2 — jobs are pushed to a message queue (e.g., SQS) with delayed delivery so they become visible to workers at the right time. Workers continuously poll the queue for sub-second precision. (4) Edge case — jobs with scheduled_time < 5 minutes go directly to the queue, bypassing Phase 1.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          maxLength: 2000,
          rubric: [
            "Explains why frequent database polling fails at scale (query size, DB load, overhead)",
            "Describes Phase 1: periodic database query every ~5 minutes for upcoming jobs",
            "Describes Phase 2: message queue with delayed delivery for precision",
            "Mentions the edge case of jobs scheduled < 5 minutes from now",
            "Names a specific queue technology and why it fits (SQS, Redis sorted set, RabbitMQ)",
          ],
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Idempotency strategies comparison",
      type: "question",
      sectionId: "sec_q_idempotency",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Your job scheduler guarantees at-least-once execution, which means jobs may run more than once. Compare the three approaches to handling idempotency: no controls, deduplication table, and idempotent job design. Which is best and why?",
        explanation:
          'A strong answer covers: (1) No controls — jobs execute every time they are received, causing duplicate side effects (double charges, duplicate emails). Unacceptable for most real-world applications. (2) Deduplication table — check a table of completed execution IDs before running. Adds DB overhead, requires cleanup, has a race condition window between check and write. (3) Idempotent job design — use conditional operations and idempotency keys ("set counter to X" instead of "increment counter"). Most robust because idempotency is inherent in the operation itself. Best approach because it pushes deduplication to the edges and each execution is self-contained.',
        basePoints: 30,
        difficulty: "medium",
        questionData: {
          maxLength: 2000,
          rubric: [
            "Describes the problem: at-least-once means potential duplicate executions",
            "Explains no-controls approach and its dangers (duplicate side effects)",
            "Explains deduplication table with pros (straightforward) and cons (DB overhead, race conditions)",
            "Explains idempotent job design using conditional operations and idempotency keys",
            "Recommends idempotent design and explains why it is the most robust approach",
          ],
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the failure handling subsystem",
      type: "question",
      sectionId: "sec_q_idempotency",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the complete failure handling subsystem for a distributed job scheduler. Address both visible failures (task code errors) and invisible failures (worker crashes). Explain your retry strategy and how you ensure at-least-once execution.",
        explanation:
          "A staff-level answer should address: (1) Visible failures — try/catch around task execution, update status to RETRYING, re-enqueue with exponential backoff (e.g., 5s, 25s, 125s using DelaySeconds), mark FAILED after max retries, use DLQ for permanent failures. (2) Invisible failures — compare health checks (bad: single point of failure, scale issues), job leasing (good: but 50k lease ops/s, clock skew, network partition issues), and SQS visibility timeout (great: server-managed, no infrastructure, heartbeat via ChangeMessageVisibility). (3) End-to-end: workers delete messages only after successful completion, heartbeat during execution, DLQ catches exhausted retries, monitoring alerts on failure rates.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          maxLength: 3000,
          rubric: [
            "Distinguishes visible failures (task errors) from invisible failures (worker crashes)",
            "Describes retry strategy with exponential backoff",
            "Compares at least two approaches for invisible failure detection with trade-offs",
            "Recommends SQS visibility timeout with heartbeat mechanism",
            "Mentions dead-letter queue, max retries, and status tracking",
          ],
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Scale the job scheduler from 1k to 10k jobs/second",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Your job scheduler currently handles 1k jobs/second. Walk through the system left-to-right and identify every bottleneck you would address to scale it to 10k jobs/second. For each bottleneck, explain the specific solution and its trade-offs.",
        explanation:
          "A staff-level answer should systematically cover: (1) Job Creation API — horizontal scaling of stateless services, optionally buffering with a message queue (though this may be over-engineering). (2) Database — Jobs table is fine (job_id partition key distributes evenly), but Executions table time_bucket creates hot partitions → write sharding with random suffixes. (3) Message Queue — SQS Standard handles virtually unlimited throughput. Consider functional separation (priority queues). (4) Workers — containers with auto-scaling based on queue depth, spot instances for cost. Pre-warm for baseline load. (5) Data archival — move old executions to S3 to keep the hot table lean.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          maxLength: 3000,
          rubric: [
            "Identifies hot partition issue in Executions table and proposes write sharding",
            "Addresses worker scaling strategy (containers, auto-scaling, queue depth)",
            "Discusses job creation layer scaling approach",
            "Mentions message queue capacity and why SQS handles the load",
            "Considers data archival for long-term table health",
          ],
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Database choice justification",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Justify your database choice for a job scheduler. Compare DynamoDB/Cassandra vs PostgreSQL/MySQL for the Jobs and Executions tables. Under what circumstances would you choose each, and how does the choice affect your scaling strategy?",
        explanation:
          "A strong answer covers: (1) DynamoDB/Cassandra advantages: native partitioning, horizontal scaling without application changes, flexible schema for varying job parameters, partition key design maps naturally to access patterns (job_id for Jobs, time_bucket for Executions). (2) PostgreSQL/MySQL advantages: familiar, strong consistency if needed, rich query capabilities, joins for complex monitoring queries. (3) Trade-offs: with SQL you need to manage sharding/read replicas manually at scale, while NoSQL has limited query flexibility (need GSIs). (4) Recommendation: NoSQL for this use case because availability > consistency, data has few relationships, and the partition key design enables efficient access patterns. SQL works fine at lower scale or when the team has more SQL expertise.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          maxLength: 2500,
          rubric: [
            "Compares at least two database options with specific pros and cons",
            "Explains how partition key design maps to access patterns",
            "Discusses scaling implications of each choice",
            "Considers the availability > consistency requirement in the recommendation",
            "Acknowledges that SQL databases can work with additional scaling effort",
          ],
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Staff-level interview answer structure",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are in a Staff Engineer system design interview. The interviewer asks you to design a job scheduler. Outline how you would structure the first 10 minutes of your answer to differentiate yourself from a senior-level candidate.",
        explanation:
          "A staff answer structure should demonstrate: (1) Quick requirements clarification — immediately ask about scale (10k jobs/s), consistency model (availability > consistency), execution guarantees (at-least-once), and precision requirements. (2) Entity-first thinking — define Task, Job, Schedule, User entities and explain the separation of definition from execution instances as a general pattern. (3) Data flow before architecture — walk through the user journey end-to-end before committing to specific technologies. (4) Proactive identification of key challenges — point out hot partitions, precision vs. DB load tension, and failure modes before being asked. (5) Deep dive signposting — explain which areas have the most interesting trade-offs (two-phase scheduling, failure handling) and offer to go deeper. The key differentiator is autonomous leadership of the discussion rather than waiting for interviewer prompts.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {
          maxLength: 2500,
          rubric: [
            "Starts with targeted requirements clarification (scale, consistency, guarantees)",
            "Defines core entities before jumping into architecture",
            "Walks through data flow before committing to technologies",
            "Proactively identifies key challenges and bottlenecks",
            "Demonstrates autonomous interview leadership vs. reactive answering",
          ],
        },
      },
    },

    // ── Text (4) ─────────────────────────────────────────────

    // Text 1 — medium
    {
      title: "DelaySeconds limitation",
      type: "question",
      sectionId: "sec_q_scheduling",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What is the maximum delay that SQS DelaySeconds supports, and why does this constraint work well with the two-phase scheduler that queries the database every 5 minutes?",
        explanation:
          "SQS DelaySeconds supports a maximum of 15 minutes. This works perfectly with the two-phase scheduler because the cron job queries for jobs due in the next ~5 minutes — well within the 15-minute limit. Even with buffer time, all jobs from a single Phase 1 query can be enqueued with valid delay values.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          maxLength: 500,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Heartbeat mechanism purpose",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "In the context of SQS visibility timeouts, what is the purpose of the ChangeMessageVisibility (heartbeat) API call, and when is it necessary?",
        explanation:
          "Workers call ChangeMessageVisibility to extend the visibility timeout while still processing a job. This is necessary for long-running jobs that take longer than the default visibility timeout (e.g., 30 seconds). Without heartbeating, SQS would make the message visible again before the worker finishes, causing another worker to pick it up — leading to duplicate execution. By heartbeating every ~15 seconds, the worker maintains exclusive ownership while still allowing fast failure detection if it crashes.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          maxLength: 500,
        },
      },
    },

    // Text 3 — hard
    {
      title: "GSI design for user job monitoring",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'The Executions table is partitioned by time_bucket. How do you efficiently support the query "show me all executions for user X sorted by time"? Describe the specific DynamoDB mechanism and its trade-off.',
        explanation:
          "Add a Global Secondary Index (GSI) on the Executions table with partition key = user_id and sort key = execution_time + job_id. This allows efficient queries for all executions by a specific user, sorted by time, with pagination and optional status filtering. The trade-off is additional write overhead — every write to the base table must also update the GSI, increasing cost and write latency slightly. But this is worthwhile to avoid the alternative: scanning the Jobs table for a user's job_ids and then querying Executions for each.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          maxLength: 500,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Idempotent operation transformation",
      type: "question",
      sectionId: "sec_q_idempotency",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Give two specific examples of transforming a non-idempotent job operation into an idempotent one.",
        explanation:
          'Example 1: Instead of "increment counter by 1" (non-idempotent — running twice increments twice), use "set counter to X" (idempotent — running twice sets the same value). Example 2: Instead of "send welcome email" (non-idempotent — sends duplicates), first check if the welcome_email_sent flag is set in the user profile; only send if false, then set the flag atomically. The key principle is using conditional operations and idempotency keys so that repeated execution produces the same outcome.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          maxLength: 500,
        },
      },
    },

    // ── Matching (3) ─────────────────────────────────────────

    // Matching 1 — easy
    {
      title: "Match failure detection approaches to descriptions",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each worker failure detection approach to its description:",
        explanation:
          "Health Check Endpoints rely on a central monitor polling each worker — does not scale. Job Leasing uses database locks with expiry timestamps — workers must renew them. SQS Visibility Timeout is a server-managed mechanism where unacknowledged messages reappear automatically.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Health Check Endpoints",
              right: "Central monitoring service polls each worker; does not scale well",
            },
            {
              id: "p2",
              left: "Job Leasing",
              right: "Workers acquire database locks with expiry; must periodically renew",
            },
            {
              id: "p3",
              left: "SQS Visibility Timeout",
              right: "Server-managed: unprocessed messages reappear automatically after timeout",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match queue technology to key characteristic",
      type: "question",
      sectionId: "sec_q_scheduling",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each message queue technology to its key characteristic in the context of delayed job delivery:",
        explanation:
          "Redis Sorted Sets use the execution timestamp as score for O(log N) insertion and O(1) min retrieval. RabbitMQ achieves delay through TTL + Dead Letter Exchange routing, not native delay support. SQS provides a native DelaySeconds parameter (up to 15 min) — the simplest to use. Kafka processes messages in strict append order and does not support delayed delivery.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Redis Sorted Sets",
              right: "Uses execution timestamp as score for priority ordering",
            },
            {
              id: "p2",
              left: "RabbitMQ",
              right: "Achieves delay via TTL + Dead Letter Exchange pattern",
            },
            {
              id: "p3",
              left: "Amazon SQS",
              right: "Native DelaySeconds parameter up to 15 minutes",
            },
            {
              id: "p4",
              left: "Apache Kafka",
              right: "Strict partition ordering; no native delayed delivery support",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match system components to scaling strategies",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each job scheduler component to the scaling strategy that addresses its bottleneck at 10k jobs/second:",
        explanation:
          "The Executions table suffers from hot partitions (all current-hour writes to one partition) — solved by write sharding with random suffixes. The worker layer must scale elastically with load — auto-scaling based on queue depth handles this. The Job Creation API is stateless and can be scaled by adding more instances behind a load balancer. Old execution records bloat the table over time — archival to S3 keeps it lean.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Executions Table",
              right: "Write sharding with random partition key suffixes",
            },
            {
              id: "p2",
              left: "Worker Layer",
              right: "Container auto-scaling based on queue depth",
            },
            {
              id: "p3",
              left: "Job Creation API",
              right: "Horizontal scaling of stateless services behind load balancer",
            },
            {
              id: "p4",
              left: "Historical Execution Data",
              right: "Archival to S3 after retention period",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3) ──────────────────────────────────────

    // Fill-blanks 1 — easy
    {
      title: "Time bucket calculation",
      type: "question",
      sectionId: "sec_q_fundamentals",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The time_bucket partition key is calculated by rounding the execution timestamp down to the nearest {{blank1}}. The formula is: time_bucket = (execution_time // {{blank2}}) * {{blank3}}.",
        explanation:
          "The time_bucket groups executions into hourly intervals. Since one hour = 3600 seconds, the formula divides the Unix timestamp by 3600 (integer division rounds down), then multiplies by 3600 to get the start of the hour. For example, Unix timestamp 1715548800 → 1715548800 // 3600 = 476541 → 476541 * 3600 = 1715547600.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "blank1", answer: "hour" },
            { id: "blank2", answer: "3600" },
            { id: "blank3", answer: "3600" },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "At-least-once guarantee mechanism",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "To achieve at-least-once execution, SQS uses a {{blank1}} timeout. When a worker picks up a message, it becomes {{blank2}} to other workers. If the worker crashes, the message becomes {{blank3}} again after the timeout expires.",
        explanation:
          "SQS visibility timeout makes messages invisible after they are received. If the worker successfully processes the message, it deletes it. If the worker crashes, it cannot delete the message, so after the visibility timeout expires, the message becomes visible again and another worker can pick it up — guaranteeing at-least-once delivery.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: [
            { id: "blank1", answer: "visibility" },
            { id: "blank2", answer: "invisible" },
            { id: "blank3", answer: "visible" },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Exponential backoff retry formula",
      type: "question",
      sectionId: "sec_q_idempotency",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "When retrying failed jobs with exponential backoff using a base of 5 seconds, the delay for the 1st retry is {{blank1}} seconds, the 2nd retry is {{blank2}} seconds, and the 3rd retry is {{blank3}} seconds.",
        explanation:
          "Exponential backoff with base 5 seconds: 1st retry = 5^1 = 5 seconds, 2nd retry = 5^2 = 25 seconds, 3rd retry = 5^3 = 125 seconds. This gives increasingly longer intervals between retries, reducing load on downstream systems during sustained failures while still retrying promptly for transient errors.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: [
            { id: "blank1", answer: "5" },
            { id: "blank2", answer: "25" },
            { id: "blank3", answer: "125" },
          ],
        },
      },
    },

    // ── Numerical (2) ────────────────────────────────────────

    // Numerical 1 — medium
    {
      title: "Jobs per 5-minute window",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "If the system processes 10,000 jobs per second, how many job messages must the message queue handle in each 5-minute Phase 1 window?",
        explanation:
          "Jobs per window = 10,000 jobs/second × 300 seconds (5 minutes) = 3,000,000 jobs. This is the volume of messages that must flow through the queue in each Phase 1 cycle. With ~200-byte messages, this is approximately 600MB of data — well within SQS Standard queue capacity.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          answer: 3000000,
          tolerance: 0,
          unit: "jobs",
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Lease operations per second",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A job leasing system renews leases every 5 seconds for all in-progress jobs. If the system sustains 10,000 jobs/second and the average job takes 3 seconds to execute, approximately how many lease renewal operations per second does the database need to handle? (Assume steady state where ~30,000 jobs are in-progress at any time.)",
        explanation:
          "In steady state, approximately 30,000 jobs are in-progress at any time (10k/s × 3s avg duration). Each job renews its lease every 5 seconds. So lease renewals per second = 30,000 / 5 = 6,000 lease operations/second. Combined with initial lease acquisitions (10k/s) and completions (10k/s), the total database load from leasing alone approaches 26,000 operations/second — a significant overhead that makes the SQS visibility timeout approach attractive.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          answer: 6000,
          tolerance: 500,
          unit: "operations/second",
        },
      },
    },
  ],
};
