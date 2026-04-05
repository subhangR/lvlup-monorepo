/**
 * Web Crawler — HLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: requirements, high-level design, fault tolerance, politeness, scaling, deduplication
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const webCrawlerContent: StoryPointSeed = {
  title: "Web Crawler",
  description:
    "Design a web crawler that efficiently traverses 10 billion pages in under 5 days, handling fault tolerance, politeness (robots.txt, rate limiting), URL and content deduplication, and multi-stage pipeline architecture for LLM training data extraction.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_q_architecture", title: "Requirements & Core Architecture", orderIndex: 1 },
    { id: "sec_q_fault_tolerance", title: "Fault Tolerance & Pipeline Design", orderIndex: 2 },
    { id: "sec_q_politeness", title: "Politeness & Rate Limiting", orderIndex: 3 },
    { id: "sec_q_scaling", title: "Scaling, DNS & Capacity Planning", orderIndex: 4 },
    { id: "sec_q_dedup_traps", title: "Deduplication & Crawler Traps", orderIndex: 5 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Requirements & High-Level Design
    {
      title: "Web Crawler — Requirements & High-Level Architecture",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Web Crawler — Requirements & High-Level Architecture",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is a Web Crawler?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "A web crawler is a program that automatically traverses the web by downloading web pages and following links from one page to another. It is used to index the web for search engines, collect data for research, or monitor websites for changes. For our design, the goal is to extract text data from the web to train an LLM — similar to how OpenAI trains GPT-4, Google trains Gemini, or Meta trains LLaMA.",
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
                  "Crawl the web starting from a given set of seed URLs.",
                  "Extract text data from each web page and store it for later processing.",
                ],
              },
            },
            {
              id: "b5",
              type: "paragraph",
              content:
                "Out of scope: Actual LLM training/processing, non-text data (images, videos), dynamic JavaScript-rendered content, authentication-required pages. It is generally accepted that you cannot crawl every page on the internet — small sites in the dark corners of the web will be missed.",
            },
            {
              id: "b6",
              type: "heading",
              content: "Non-Functional Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "We assume 10 billion pages on the web, with an average size of 2MB per page (total transfer size including HTML and inline resources; HTML alone is typically ~30KB). The data must be available for training within 5 days of starting the crawl.",
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Fault tolerance: Handle failures gracefully and resume crawling without losing progress.",
                  "Politeness: Adhere to robots.txt and do not overload website servers.",
                  "Efficiency: Crawl the web in under 5 days.",
                  "Scalability: Handle 10 billion pages.",
                ],
              },
            },
            {
              id: "b9",
              type: "heading",
              content: "System Interface & Data Flow",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Input: Seed URLs to start crawling from.",
                  "Output: Text data extracted from web pages (stored in S3).",
                  "Flow: Take seed URL from frontier → resolve DNS → fetch HTML → extract text data → store in S3 → extract linked URLs → add to frontier → repeat.",
                ],
              },
            },
            {
              id: "b11",
              type: "heading",
              content: "High-Level Design Components",
              metadata: { level: 2 },
            },
            {
              id: "b12",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Frontier Queue: The queue of URLs to crawl. Start with seed URLs, add discovered URLs. Could use Kafka, Redis, or SQS.",
                  "Crawler: Fetches web pages, extracts text data, discovers new URLs to add to the frontier.",
                  "DNS: Resolves domain names to IP addresses. At scale, DNS resolution is a major bottleneck — the Mercator crawler paper found DNS lookups accounted for up to 70% of elapsed time.",
                  "S3 Text Data: Blob storage for extracted text. Highly scalable, durable, and cost-effective.",
                ],
              },
            },
            {
              id: "b13",
              type: "quote",
              content:
                '"It\'s wise to ask your interviewer about the seed URLs. Are they provided to you, or do you need to come up with them yourself? This question shows you are thinking holistically about the problem."',
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Deep Dives — Fault Tolerance & Politeness
    {
      title: "Deep Dives — Fault Tolerance & Politeness",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Deep Dives — Fault Tolerance & Politeness",
          blocks: [
            {
              id: "dd1",
              type: "heading",
              content: "Fault Tolerance: Multi-Stage Pipeline",
              metadata: { level: 2 },
            },
            {
              id: "dd2",
              type: "paragraph",
              content:
                "The single crawler doing everything (DNS, fetching, parsing, URL extraction) is fragile. If any task fails, all progress is lost. The solution is to break it into pipelined stages: (1) URL Fetcher — fetches HTML and stores in blob storage, (2) Text & URL Extraction — parses HTML, extracts text and new URLs. Each stage can be retried independently without losing progress from other stages. This also enables independent scaling and optimization per stage.",
            },
            {
              id: "dd3",
              type: "heading",
              content: "Retry Strategies for Failed Fetches",
              metadata: { level: 3 },
            },
            {
              id: "dd4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Bad: In-memory timer — not robust; if crawler dies, timer is lost. No exponential backoff.",
                  "Good: Kafka with manual exponential backoff — implement retry topic with backoff delay in message. Works but complex.",
                  "Great: SQS with visibility timeout — use ChangeMessageVisibility API to dynamically adjust timeout based on ApproximateReceiveCount. After maxReceiveCount failures (e.g., 5), message auto-moves to dead-letter queue (DLQ).",
                ],
              },
            },
            {
              id: "dd5",
              type: "heading",
              content: "Handling Crawler Failures",
              metadata: { level: 3 },
            },
            {
              id: "dd6",
              type: "paragraph",
              content:
                "If a crawler goes down, we spin up a new one. The URL stays in the queue until confirmed processed. In Kafka, crawlers track progress via offsets — unconfirmed offsets mean the next crawler picks up where the last left off. In SQS, messages remain until explicitly deleted; the visibility timeout hides messages from other crawlers, and if the original crawler fails, the message becomes visible again after timeout.",
            },
            {
              id: "dd7",
              type: "heading",
              content: "Metadata DB",
              metadata: { level: 3 },
            },
            {
              id: "dd8",
              type: "paragraph",
              content:
                "A Metadata DB (DynamoDB, PostgreSQL, or MySQL) stores URL records with links to blob storage for both raw HTML and extracted text. Queue messages contain only the URL ID — storing raw HTML in the queue is an anti-pattern because queues are not optimized for large payloads. This also enables requirements changes (e.g., adding image alt text extraction) without re-fetching.",
            },
            {
              id: "dd9",
              type: "heading",
              content: "Politeness: robots.txt",
              metadata: { level: 2 },
            },
            {
              id: "dd10",
              type: "paragraph",
              content:
                'robots.txt tells crawlers which pages they can/cannot crawl and how frequently. Example: "User-agent: * / Disallow: /private/ / Crawl-delay: 10". The Crawl-delay directive (wait N seconds between requests) is not part of the official standard and is ignored by some major crawlers like Googlebot, but respecting it demonstrates good crawling etiquette.',
            },
            {
              id: "dd11",
              type: "heading",
              content: "Implementing Politeness",
              metadata: { level: 3 },
            },
            {
              id: "dd12",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Fetch and store robots.txt for each domain in the Metadata DB.",
                  "Before crawling: check if URL is disallowed → if yes, ack and skip.",
                  "Check Crawl-delay: add a Domain table tracking last crawl time per domain.",
                  "If delay not elapsed, use ChangeMessageVisibility to defer reprocessing.",
                  "Use atomic operations (Redis SET with NX + TTL) for per-domain locking to prevent parallel crawlers from hitting the same domain simultaneously.",
                ],
              },
            },
            {
              id: "dd13",
              type: "heading",
              content: "Rate Limiting Across Domains",
              metadata: { level: 3 },
            },
            {
              id: "dd14",
              type: "paragraph",
              content:
                "Industry standard: 1 request per second per domain. Use a centralized Redis store with a sliding window algorithm to track request counts per domain per second. Add jitter (random delay) to prevent synchronized retry behavior when multiple crawlers wait for the same rate limit window to reset.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Scaling, Efficiency & Deduplication
    {
      title: "Scaling, Efficiency & Deduplication",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Scaling, Efficiency & Deduplication",
          blocks: [
            {
              id: "se1",
              type: "heading",
              content: "Scaling to 10B Pages in Under 5 Days",
              metadata: { level: 2 },
            },
            {
              id: "se2",
              type: "paragraph",
              content:
                "This is an I/O-intensive task. A network-optimized AWS instance (c6in.32xlarge) can handle ~200 Gbps. At 2MB/page: 200 Gbps / 8 bits/byte / 2MB ≈ 12,500 pages/second theoretically. Practically, with server latency, DNS resolution, rate limiting, politeness, and retries, we estimate ~30% utilization = 3,750 pages/second per machine.",
            },
            {
              id: "se3",
              type: "paragraph",
              content:
                "How can one machine do thousands of pages/second with a 1 req/s/domain rate limit? The key insight: we crawl millions of different domains in parallel. Each crawler maintains thousands of concurrent connections to different sites simultaneously. Any single domain sees at most 1 req/s, but aggregate throughput across all domains is very high.",
            },
            {
              id: "se4",
              type: "heading",
              content: "Back-of-Envelope Calculation",
              metadata: { level: 3 },
            },
            {
              id: "se5",
              type: "paragraph",
              content:
                "10B pages / 3,750 pages/sec ≈ 2,666,667 seconds ≈ 30.9 days for a single machine. This scales linearly: 30.9 days / 8 machines ≈ 3.9 days — under the 5-day requirement. The estimations are hand-wavy, but in an interview it is about showing you can reason through the problem, not about being exactly right.",
            },
            {
              id: "se6",
              type: "heading",
              content: "Scaling Parser Workers",
              metadata: { level: 3 },
            },
            {
              id: "se7",
              type: "paragraph",
              content:
                "Parser workers just download HTML from blob storage, extract text, and store it back. Scale dynamically based on the Further Processing Queue depth using Lambda, ECS on Fargate, or other auto-scaling compute.",
            },
            {
              id: "se8",
              type: "heading",
              content: "DNS Bottleneck",
              metadata: { level: 3 },
            },
            {
              id: "se9",
              type: "paragraph",
              content:
                'At thousands of requests/second across millions of unique domains, DNS resolution is a real bottleneck. The Mercator crawler paper found DNS lookups accounted for up to 70% of thread elapsed time. Mitigations: (1) DNS caching — all URLs for the same domain reuse one lookup, (2) Multiple DNS providers with round-robin to distribute load and avoid rate limits. Using multiple DNS providers is a practical, real-world solution that breaks out of "academic answer" thinking.',
            },
            {
              id: "se10",
              type: "heading",
              content: "URL-Level Deduplication",
              metadata: { level: 2 },
            },
            {
              id: "se11",
              type: "paragraph",
              content:
                "Before enqueuing a URL, check the Metadata DB. If the URL already exists in the URL table, skip it. This is the first line of defense against redundant work.",
            },
            {
              id: "se12",
              type: "heading",
              content: "Content-Level Deduplication",
              metadata: { level: 2 },
            },
            {
              id: "se13",
              type: "paragraph",
              content:
                'Different URLs can serve identical content (e.g., http://example.com vs http://www.example.com). Two great approaches: (1) Hash content and store in Metadata DB with an index — look up hash to detect duplicates; modern DB indexes handle this efficiently even at scale. (2) Bloom filter (Redis with RedisBloom) — probabilistic structure that definitively says "not seen" or "probably seen" with configurable false positive rate. The index approach is simpler and more practical; Bloom filters are a bit overkill here but candidates always bring them up.',
            },
            {
              id: "se14",
              type: "heading",
              content: "Crawler Traps",
              metadata: { level: 2 },
            },
            {
              id: "se15",
              type: "paragraph",
              content:
                "Crawler traps are pages designed to keep crawlers on the site indefinitely (self-referencing links, infinite link trees). Solution: implement a maximum depth — track the number of link hops from a seed URL (not URL path segments). Seed URLs start at depth 0, linked pages at depth 1, etc. Stop crawling a branch when depth exceeds a threshold (15-20). Store the depth field in the URL table in the Metadata DB.",
            },
            {
              id: "se16",
              type: "heading",
              content: "Interview Level Expectations",
              metadata: { level: 2 },
            },
            {
              id: "se17",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Mid-level (E4): Understand high-level data flow, build a simple working system, discuss basics of robots.txt and politeness. Surface-level scaling awareness.",
                  "Senior (E5): Discuss HLD then dive into politeness details, robots.txt implementation, scaling calculations, and efficient crawling within the 5-day timeframe.",
                  "Staff+ (E6+): Deep dive into 3+ areas — fault tolerance pipelines, retry strategies, DNS optimization, deduplication (hash index vs Bloom filter), crawler traps. Teach the interviewer something new.",
                ],
              },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════════════

    // --- MCQ (8 questions) ---

    // MCQ 1 — easy
    {
      title: "Purpose of the frontier queue",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "What is the primary role of the Frontier Queue in a web crawler architecture?",
        explanation:
          "The Frontier Queue holds the URLs that need to be crawled. It starts with seed URLs and grows as the crawler discovers new URLs from parsed pages. It acts as the work queue that drives the entire crawling process. It does not store HTML content, DNS results, or deduplicated content — those are handled by other components.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It caches DNS resolution results to speed up lookups",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It stores the raw HTML content downloaded from web pages",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It holds deduplicated content hashes for comparison",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It holds the list of URLs that need to be crawled, starting with seed URLs and growing as new URLs are discovered",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why use S3 for extracted text storage",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is blob storage (like S3) chosen over a relational database for storing extracted text data from crawled web pages?",
        explanation:
          "S3 is designed for storing large amounts of data cheaply with high durability and scalability. At 10 billion pages, storing multi-KB text blobs in a relational database would be impractical — RDBs are optimized for structured queries, not bulk unstructured blob storage. S3 handles the volume and cost requirements naturally.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Blob storage is highly scalable, durable, and cost-effective for storing large volumes of unstructured data",
              isCorrect: true,
            },
            {
              id: "b",
              text: "S3 offers faster read latency than any database",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Relational databases cannot store text data",
              isCorrect: false,
            },
            {
              id: "d",
              text: "S3 provides built-in text extraction capabilities",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Why break crawler into pipeline stages",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Why is breaking the monolithic crawler into separate pipeline stages (URL Fetcher and Text & URL Extraction) the recommended approach for fault tolerance?",
        explanation:
          "Pipelining isolates failures to individual stages. If the URL fetch fails, you can retry just the fetch without re-doing text extraction for previously fetched pages. If text extraction fails, you do not need to re-fetch the HTML. This also enables independent scaling — you can scale fetchers and parsers differently based on their respective bottlenecks.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It reduces the total number of network requests needed",
              isCorrect: false,
            },
            {
              id: "b",
              text: "It eliminates the need for a queue between stages",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Failures in one stage can be retried without losing progress in other stages, and each stage can scale independently",
              isCorrect: true,
            },
            {
              id: "d",
              text: "It ensures all pages are crawled exactly once without deduplication",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "SQS vs Kafka for retry with exponential backoff",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "Why is SQS with ChangeMessageVisibility considered a better choice than Kafka for implementing exponential backoff retries in a web crawler?",
        explanation:
          "SQS provides the ChangeMessageVisibility API which can dynamically adjust how long a message stays hidden, and the ApproximateReceiveCount attribute tracks retry attempts. Combined with automatic dead-letter queue (DLQ) support via redrive policies, this makes exponential backoff straightforward. Kafka requires building all of this manually — separate retry topics, custom backoff logic, and DLQ routing — adding significant implementation and maintenance complexity.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Kafka cannot handle message retries at all",
              isCorrect: false,
            },
            {
              id: "b",
              text: "SQS provides ChangeMessageVisibility, ApproximateReceiveCount, and automatic DLQ support — primitives that make exponential backoff straightforward without custom code",
              isCorrect: true,
            },
            {
              id: "c",
              text: "SQS automatically retries failed fetches without any application logic",
              isCorrect: false,
            },
            {
              id: "d",
              text: "SQS has higher throughput than Kafka for web crawling workloads",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Per-domain locking mechanism",
      type: "question",
      sectionId: "sec_q_politeness",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'Multiple parallel crawlers could simultaneously pull URLs from the same domain and both see a stale "last crawl time," violating the crawl delay. What mechanism prevents this race condition?',
        explanation:
          "An atomic Redis SET with NX (set-if-not-exists) and a TTL matching the crawl delay acts as a per-domain distributed lock. If a crawler cannot acquire the lock, it defers the message using ChangeMessageVisibility. This is a standard distributed locking pattern that prevents concurrent access to the same domain. A simple timestamp check has a TOCTOU race condition; a database row lock would be too slow at this scale.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Redis SET with NX flag and a TTL matching the crawl delay — an atomic per-domain lock",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Using a global mutex in shared memory across all crawlers",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Assigning each domain to exactly one crawler permanently",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Checking the last crawl timestamp in the Metadata DB before each request",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Why queue messages should not contain HTML",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In the multi-stage pipeline, queue messages contain only URL IDs that reference the Metadata DB, rather than the raw HTML content. What is the primary reason for this design?",
        explanation:
          "Queues (SQS, Kafka) are not optimized for large payloads. SQS has a 256KB message size limit, and even Kafka recommends keeping messages small for throughput. Storing HTML (averaging ~30KB but up to 2MB with resources) directly in queue messages would be expensive, slow, and hit size limits. The URL ID acts as a pointer to blob storage where the HTML lives, keeping queue messages tiny and the system decoupled.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "It is required for SQS dead-letter queue functionality to work",
              isCorrect: false,
            },
            {
              id: "b",
              text: "HTML content cannot be serialized into queue message formats",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Queues are not optimized for large payloads — storing HTML in messages is expensive and may exceed size limits",
              isCorrect: true,
            },
            {
              id: "d",
              text: "It prevents the parser from reading the HTML until the crawler confirms success",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Hash index vs Bloom filter for content dedup",
      type: "question",
      sectionId: "sec_q_dedup_traps",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'For content-level deduplication, a team debates between (A) storing content hashes in the Metadata DB with a database index and (B) using a Bloom filter in Redis. Both are considered "great" solutions. What is the strongest argument for choosing the hash index approach over the Bloom filter in a production web crawler?',
        explanation:
          'The hash index approach is simpler and more practical. Modern databases handle large indexes efficiently — the concern about index write overhead is "overly pessimistic" for modern systems. The Bloom filter introduces probabilistic false positives (crawling a page we already have), requires tuning filter size and hash function count, and adds Redis as an additional dependency. For a production system, simplicity and determinism (zero false positives) often win over marginal performance gains. The Bloom filter is "a bit overkill" per the source material.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The hash index is deterministic (zero false positives), simpler to operate, and modern DB indexes handle even large-scale dedup efficiently — the Bloom filter adds complexity for marginal benefit",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Bloom filters cannot be distributed across multiple Redis instances",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The hash index approach is always faster for lookups than a Bloom filter",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Bloom filters require storing the full page content in memory",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Crawler depth vs URL path depth",
      type: "question",
      sectionId: "sec_q_dedup_traps",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'To prevent crawler traps, the system implements a maximum "depth" threshold. A candidate proposes limiting URLs with more than 5 path segments (e.g., /a/b/c/d/e/f). Why is this the wrong interpretation of "depth" in this context?',
        explanation:
          "Depth in the crawler trap context means the number of link hops from a seed URL, not the number of segments in the URL path. A seed URL is depth 0, a page linked from the seed is depth 1, pages linked from those are depth 2, and so on. URL path segments are arbitrary and do not indicate crawl distance from the seed. A trap could use flat URLs (e.g., /page?id=1, /page?id=2, ...) that appear shallow but are infinitely deep in terms of link hops. This distinction is critical for actually preventing traps.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Both interpretations are equivalent because longer paths always correspond to deeper link chains",
              isCorrect: false,
            },
            {
              id: "b",
              text: "URL path segments are more reliable because they are part of the HTTP standard",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Depth means link hops from the seed URL, not URL path segments — a trap can use flat URLs (/page?id=N) that have few path segments but infinite link depth",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Limiting path segments is correct but the threshold should be higher than 5",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Core non-functional requirements for web crawler",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL valid non-functional requirements for a web crawler designed to extract LLM training data from 10B pages:",
        explanation:
          "Fault tolerance, politeness (robots.txt), efficiency (5-day target), and scalability (10B pages) are all core NFRs explicitly stated in the requirements. Sub-second query latency is not relevant — this is a data collection pipeline, not a user-facing query system. Real-time indexing for search is explicitly out of scope.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Sub-second query latency for downstream consumers",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Politeness to adhere to robots.txt and not overload servers",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Real-time indexing for search engine results",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Fault tolerance to handle failures and resume without losing progress",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Scalability to handle 10 billion pages",
              isCorrect: true,
            },
            {
              id: "f",
              text: "Efficiency to crawl the web in under 5 days",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid DNS optimization strategies",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "DNS resolution is a major bottleneck at crawler scale. Select ALL valid strategies to mitigate DNS bottlenecks:",
        explanation:
          "DNS caching reuses lookups for the same domain across URLs. Using multiple DNS providers with round-robin distributes load and avoids hitting single-provider rate limits. Both are practical optimizations. Running a custom DNS resolver adds enormous complexity for marginal gain when caching and multi-provider strategies exist. Pre-resolving all 10B URLs is impossible — you do not know all URLs upfront, and most domains will be discovered during crawling.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Cache DNS lookups in crawlers so all URLs for the same domain reuse one resolution",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Pre-resolve all 10 billion URLs before starting the crawl",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Run a custom DNS resolver from scratch to avoid third-party rate limits",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Use multiple DNS providers and round-robin between them to distribute load",
              isCorrect: true,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Benefits of the multi-stage pipeline",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL benefits of breaking the crawler into a multi-stage pipeline (URL Fetcher → Text & URL Extraction):",
        explanation:
          "Pipelining provides: failure isolation (retry one stage without losing others), independent scaling (more fetchers if I/O-bound, more parsers if CPU-bound), and adaptability to requirement changes (e.g., change text extraction logic without re-fetching). It does NOT eliminate the need for a queue — it actually requires a queue between stages. It does NOT guarantee exactly-once processing — that requires separate dedup logic.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Extraction logic can be changed without re-fetching pages",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Each stage can be scaled independently based on its bottleneck",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Failures in one stage can be retried independently",
              isCorrect: true,
            },
            {
              id: "d",
              text: "It guarantees exactly-once processing of every URL",
              isCorrect: false,
            },
            {
              id: "e",
              text: "It eliminates the need for a message queue in the architecture",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "What happens when a crawler goes down mid-fetch",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "A crawler node crashes while fetching a URL. Select ALL true statements about how SQS and Kafka handle this failure:",
        explanation:
          "In SQS, messages remain until explicitly deleted; the visibility timeout hides messages temporarily, and if the crawler fails before confirming success, the message reappears after timeout. In Kafka, offsets are not committed until processing completes, so the next consumer picks up from the uncommitted offset. Both ensure no URL is lost on crash. Neither requires manual intervention — both have automatic recovery mechanisms. The message is NOT permanently lost in either system.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "In SQS, the message is permanently lost and must be re-enqueued manually",
              isCorrect: false,
            },
            {
              id: "b",
              text: "In SQS, the message becomes visible again after the visibility timeout expires, allowing another crawler to pick it up",
              isCorrect: true,
            },
            {
              id: "c",
              text: "In both systems, the half-finished URL is automatically retried without manual intervention",
              isCorrect: true,
            },
            {
              id: "d",
              text: "In Kafka, the offset is not committed, so the next consumer reads from the last committed offset",
              isCorrect: true,
            },
            {
              id: "e",
              text: "In Kafka, a separate coordinator must detect the failure and reassign the message",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Politeness implementation walkthrough",
      type: "question",
      sectionId: "sec_q_politeness",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Walk through the complete sequence of steps a crawler takes to ensure politeness when it pulls a URL from the queue. Cover robots.txt checking, crawl delay enforcement, and rate limiting. What distributed state is needed?",
        explanation:
          "A strong answer covers the 7-step robots.txt checking process, the Domain table for tracking last crawl time, Redis per-domain locking with SET NX + TTL, ChangeMessageVisibility for deferring, and the sliding window rate limiting with jitter to prevent synchronized retries.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "When a crawler pulls a URL from the queue, it follows these steps:\n\n1. Look up the robots.txt rules for the URL's domain in the Metadata DB (fetched and stored on first encounter).\n2. Check if the URL path is disallowed. If yes, acknowledge the message and move to the next URL.\n3. Check the Crawl-delay directive from robots.txt.\n4. Query the Domain table in the Metadata DB for the last crawl time of this domain.\n5. Attempt to acquire a per-domain lock using Redis SET with NX flag and a TTL matching the crawl delay. This prevents race conditions where multiple crawlers see stale last-crawl timestamps.\n6. If the lock cannot be acquired (another crawler is active on this domain) or the crawl delay has not elapsed, use SQS ChangeMessageVisibility to defer the message — making it invisible for a calculated delay period.\n7. If the lock is acquired and crawl delay has passed, proceed to crawl and update the last crawl time.\n\nFor rate limiting across all crawlers, a centralized Redis store tracks request counts per domain per second using a sliding window algorithm. Jitter (random delay) is added to prevent synchronized behavior when multiple crawlers wait for the same rate limit window to reset and all retry simultaneously.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "URL vs content deduplication",
      type: "question",
      sectionId: "sec_q_dedup_traps",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Explain why URL-level deduplication alone is insufficient for a web crawler. Describe two approaches for content-level deduplication and compare their tradeoffs.",
        explanation:
          "A strong answer explains that different URLs can serve identical content (www vs non-www, different domains with same content), then compares hash-indexed Metadata DB (deterministic, simpler) vs Bloom filter (probabilistic, potentially faster lookups but false positives).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'URL-level deduplication — checking if a URL already exists in the Metadata DB before enqueuing — is the first line of defense but is insufficient because different URLs can serve identical content. For example, http://example.com and http://www.example.com may return the same page. It is also common for entirely different domains to host identical content.\n\nApproach 1 — Hash Index in Metadata DB: After fetching a page, hash its content (e.g., SHA-256) and store the hash in the URL table. Before parsing, look up the hash using a database index. If found, skip the page. Modern databases handle even very large indexes efficiently, making this approach practical. It provides deterministic results — zero false positives.\n\nApproach 2 — Bloom Filter in Redis: Store content hashes in a Bloom filter (using Redis with RedisBloom module, BF.ADD and BF.EXISTS). A Bloom filter definitively says "not seen" but only probabilistically says "probably seen." This trades a small false positive rate for lower memory usage and potentially faster lookups.\n\nThe hash index approach is generally preferred for production: it is simpler to operate, has zero false positives, and modern DB indexes perform well at scale. The Bloom filter is elegant but adds an additional dependency (Redis) and requires tuning filter size and hash function count.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design the retry and failure recovery system",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a comprehensive retry and failure recovery system for the URL Fetcher stage. Address: (1) transient failures (server temporarily down), (2) permanent failures (site no longer exists), (3) crawler node crashes. Explain which queue technology you would use and why.",
        explanation:
          "A staff-level answer chooses SQS and justifies with ChangeMessageVisibility for exponential backoff, ApproximateReceiveCount for tracking retries, automatic DLQ for permanent failures after maxReceiveCount, and visibility timeout for handling crawler crashes. It should contrast with Kafka's manual approach.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "I would use SQS because it provides the primitives needed for all three failure modes without custom infrastructure.\n\nTransient failures (server temporarily down):\nWhen a fetch fails, the crawler does not delete the message from SQS. Instead, it uses the ChangeMessageVisibility API to set a new visibility timeout calculated from the ApproximateReceiveCount attribute: timeout = base_delay * 2^(receive_count - 1). This implements exponential backoff natively. The message stays hidden until the timeout expires, then becomes visible for another crawler to attempt. This is superior to in-memory timers (which are lost if the crawler crashes) and simpler than Kafka's manual retry topic approach.\n\nPermanent failures (site no longer exists):\nAfter a configured number of retry attempts (maxReceiveCount in the redrive policy, e.g., 5), SQS automatically moves the message to a dead-letter queue (DLQ). The DLQ can be monitored — these represent permanently unreachable sites that we accept we cannot crawl. This avoids infinite retry loops without any custom DLQ routing logic.\n\nCrawler node crashes:\nSQS messages remain in the queue until explicitly deleted. The visibility timeout hides a message from other crawlers while one is processing it. If the crawler crashes before deleting the message (confirming success), the message automatically becomes visible again after the visibility timeout expires. Another crawler picks it up with no data loss and no manual intervention.\n\nCompared to Kafka, which requires building separate retry topics, manual offset management, custom DLQ routing, and failure detection — SQS provides all of this as managed primitives, significantly reducing operational complexity.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Scaling calculation and architecture",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Walk through the back-of-envelope calculation to determine how many crawler machines are needed to crawl 10B pages in 5 days. Explain the key assumption about how a single machine achieves thousands of pages per second despite the 1 req/s/domain rate limit. Address DNS and parser worker scaling.",
        explanation:
          "A staff-level answer includes: 200 Gbps bandwidth / 2MB per page = 12,500 theoretical pages/s, 30% practical utilization = 3,750 pages/s, 10B / 3,750 = 30.9 days for one machine, 30.9/8 = 3.9 days for 8 machines. The key insight is crawling millions of domains in parallel. DNS caching and multi-provider strategies. Dynamic parser scaling.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Starting with a single network-optimized AWS instance (c6in.32xlarge) with 200 Gbps bandwidth:\n\nTheoretical max: 200 Gbps / 8 bits/byte / 2MB per page ≈ 12,500 pages/second.\nPractical utilization: Accounting for server latency, DNS resolution, rate limiting, politeness, and retries, we estimate ~30% utilization = 3,750 pages/second.\n\nKey insight — how 3,750 pages/s is possible with 1 req/s/domain: We are crawling millions of different domains in parallel. Each crawler maintains thousands of concurrent connections to different sites simultaneously. Any single domain sees at most 1 request per second, but the aggregate throughput across all domains is very high.\n\nTotal time for one machine: 10,000,000,000 / 3,750 ≈ 2,666,667 seconds ≈ 30.9 days.\nThis scales linearly: 30.9 days / 8 machines ≈ 3.9 days — under the 5-day requirement.\n\nDNS scaling: At thousands of requests/second across millions of unique domains, DNS is a real bottleneck (Mercator paper: 70% of thread time was DNS). Mitigate with: (1) DNS caching so all URLs for one domain share a lookup, (2) multiple DNS providers with round-robin to distribute load.\n\nParser worker scaling: Parsers just download HTML from blob storage, extract text, and store it back. Rather than pre-calculating how many are needed, scale them dynamically based on the Further Processing Queue depth using Lambda, ECS on Fargate, or similar auto-scaling compute. This ensures parsers keep pace with crawlers without over-provisioning.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Metadata DB schema design",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design the Metadata DB schema for the web crawler. What tables do you need, what fields does each table have, and how do they support the system's non-functional requirements (fault tolerance, politeness, efficiency)?",
        explanation:
          "A staff-level answer designs at least a URL table (url, status, html_blob_ref, text_blob_ref, content_hash, depth, created_at) and a Domain table (domain, robots_txt, last_crawl_time, crawl_delay). It explains how each field supports specific NFRs: content_hash for dedup, depth for crawler traps, robots_txt and crawl_delay for politeness, blob refs for fault tolerance.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Two main tables:\n\n**URL Table:**\n- url (PK): The full URL string\n- url_hash (indexed): Hash of the URL for fast lookup during URL-level dedup\n- content_hash (indexed): Hash of the page content for content-level dedup\n- domain: The domain of the URL (for joining with Domain table)\n- depth: Number of link hops from the nearest seed URL — used to enforce max depth threshold (15-20) against crawler traps\n- status: enum (pending, fetching, fetched, parsed, failed, dead_lettered)\n- html_blob_ref: S3 path to the stored raw HTML — enables re-parsing without re-fetching\n- text_blob_ref: S3 path to extracted text data\n- created_at: Timestamp for tracking crawl progress\n- retry_count: Number of fetch attempts\n\n**Domain Table:**\n- domain (PK): The domain name\n- robots_txt: Cached robots.txt content or parsed rules\n- crawl_delay: Parsed Crawl-delay value from robots.txt (seconds)\n- last_crawl_time: Timestamp of last successful crawl to this domain — used with crawl_delay for politeness enforcement\n- disallowed_paths: Parsed list of disallowed URL patterns\n\nHow these support NFRs:\n- Fault tolerance: html_blob_ref allows re-parsing without re-fetching. Status tracking enables pipeline recovery.\n- Politeness: robots_txt, crawl_delay, last_crawl_time, and disallowed_paths enforce rate limiting and access rules.\n- Efficiency: url_hash and content_hash indexes enable fast dedup, preventing redundant work. depth prevents crawler traps from wasting resources.\n\nDatabase choice: DynamoDB for the URL table (high write throughput at scale) or PostgreSQL for simpler querying. The Domain table is much smaller and can use either.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Staff-level interview walkthrough",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You are in a Staff Engineer system design interview. The interviewer asks you to design a web crawler. Walk through how you would structure your 45-minute interview: what do you cover first, how do you allocate time, and which 3+ deep dives would you choose and why?",
        explanation:
          "A staff-level answer demonstrates interview meta-strategy: quick requirements/scope and data flow, efficient HLD, then 60% of time on carefully chosen deep dives that showcase depth and teach the interviewer something new.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "First 5 minutes — Requirements & Data Flow:\nQuickly confirm functional requirements (crawl from seeds, extract text, store for LLM training) and non-functional requirements (fault tolerance, politeness, 5-day efficiency target, 10B page scale). Define the system interface: Input = seed URLs, Output = text in S3. Sketch the 6-step data flow: seed URL → DNS → fetch HTML → extract text → store → discover URLs → repeat. Clarify scope exclusions (no JS rendering, no auth pages).\n\nMinutes 5-12 — High-Level Design (breadth):\nDraw the simple architecture: Frontier Queue (SQS) → Crawler → DNS → S3. Briefly mention Metadata DB. Don't linger — move to deep dives quickly.\n\nMinutes 12-40 — Deep Dives (60% of time):\n\n1. Fault tolerance via multi-stage pipeline (8 min): Break the monolithic crawler into URL Fetcher and Text & URL Extraction stages. Explain why: failure isolation, independent scaling, adaptable to requirement changes. Design the SQS retry strategy with ChangeMessageVisibility for exponential backoff and automatic DLQ after 5 retries. Contrast with Kafka's manual approach — showing I know the tradeoffs.\n\n2. Politeness — robots.txt and rate limiting (8 min): Walk through the 7-step politeness checking sequence. Introduce the Domain table for tracking crawl times. Design the Redis per-domain lock with SET NX + TTL. Explain the sliding window rate limiter with jitter to prevent thundering herd.\n\n3. Scaling and efficiency (8 min): Run the BOE calculation (200 Gbps → 3,750 pages/s → 8 machines for 3.9 days). Explain the key insight about parallelizing across millions of domains. Address DNS bottleneck with caching and multi-provider round-robin.\n\n4. Deduplication and crawler traps (4 min): URL-level dedup via Metadata DB lookup, content-level dedup via hash index, and depth-based crawler trap prevention. Briefly mention Bloom filter as an alternative.\n\nMinutes 40-45 — Additional topics if time permits: dynamic content (headless browsers), priority crawling (multiple SQS queues), URL Scheduler for continual re-crawling.",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "SQS retry tracking attribute",
      type: "question",
      sectionId: "sec_q_politeness",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What SQS message attribute tracks how many times a message has been received, enabling the implementation of exponential backoff?",
        explanation:
          "ApproximateReceiveCount is an SQS message attribute that tracks the number of times a message has been received (dequeued). The crawler uses this count to calculate exponential backoff delays: delay = base * 2^(count-1). When the count exceeds maxReceiveCount in the redrive policy, the message is automatically moved to the DLQ.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "ApproximateReceiveCount",
          acceptableAnswers: [
            "ApproximateReceiveCount",
            "approximateReceiveCount",
            "approximate receive count",
            "Approximate Receive Count",
            "receiveCount",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "SQS API for deferring message reprocessing",
      type: "question",
      sectionId: "sec_q_politeness",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What SQS API is used to defer reprocessing of a message — for example, when a domain's crawl delay has not elapsed yet?",
        explanation:
          "ChangeMessageVisibility adjusts how long an already-received SQS message stays hidden from other consumers. By setting a new visibility timeout, the crawler can defer reprocessing until the crawl delay has elapsed. This is used for both exponential backoff on failures and politeness enforcement.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "ChangeMessageVisibility",
          acceptableAnswers: [
            "ChangeMessageVisibility",
            "changeMessageVisibility",
            "change message visibility",
            "Change Message Visibility",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Probabilistic dedup data structure",
      type: "question",
      sectionId: "sec_q_dedup_traps",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "What probabilistic data structure can tell you definitively if an element is NOT in a set, but only probabilistically if it IS? It is sometimes proposed for content-level deduplication in web crawlers.",
        explanation:
          'A Bloom filter is a space-efficient probabilistic data structure. It can definitively say "not in set" (no false negatives) but only "probably in set" (possible false positives). For web crawlers, this means if the Bloom filter says a page has not been crawled, that is guaranteed correct. If it says the page has been crawled, there is a small chance it is wrong (false positive), meaning we might skip a page we have not actually seen.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Bloom filter",
          acceptableAnswers: [
            "Bloom filter",
            "bloom filter",
            "Bloom Filter",
            "bloomfilter",
            "Bloom",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Crawler research paper DNS finding",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Which famous web crawler research paper found that DNS lookups accounted for up to 70% of each thread's elapsed time before they built a custom resolver?",
        explanation:
          "The Mercator crawler paper documented that DNS resolution was the dominant bottleneck in web crawling, consuming up to 70% of each crawling thread's time. This finding motivated the development of custom DNS resolvers, DNS caching, and multi-provider strategies that are still relevant in modern crawler design.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Mercator",
          acceptableAnswers: [
            "Mercator",
            "mercator",
            "Mercator crawler",
            "The Mercator crawler",
            "Mercator paper",
          ],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match component to role in the crawler",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each component to its role in the web crawler architecture:",
        explanation:
          "SQS acts as the frontier queue holding URLs to crawl. S3 stores extracted text and raw HTML as blob storage. The Metadata DB (DynamoDB/PostgreSQL) tracks URL status, content hashes, and domain rules. Redis provides distributed locking for per-domain rate limiting.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            { id: "p1", left: "SQS", right: "Frontier queue holding URLs to be crawled" },
            { id: "p2", left: "S3", right: "Blob storage for extracted text and raw HTML" },
            {
              id: "p3",
              left: "Metadata DB",
              right: "Tracks URL status, content hashes, and domain rules",
            },
            { id: "p4", left: "Redis", right: "Per-domain distributed lock for rate limiting" },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match failure type to recovery mechanism",
      type: "question",
      sectionId: "sec_q_fault_tolerance",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each failure scenario to its recovery mechanism in the web crawler:",
        explanation:
          "Transient fetch failures use SQS exponential backoff via ChangeMessageVisibility. Permanently unreachable sites are routed to the DLQ after maxReceiveCount retries. Crawler node crashes are handled by the visibility timeout — messages reappear automatically. Parser worker overload is handled by auto-scaling based on queue depth.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Server temporarily down (transient failure)",
              right: "SQS exponential backoff via ChangeMessageVisibility",
            },
            {
              id: "p2",
              left: "Site permanently unreachable",
              right: "Automatic routing to dead-letter queue after max retries",
            },
            {
              id: "p3",
              left: "Crawler node crashes mid-fetch",
              right: "SQS visibility timeout expires, message reappears for another crawler",
            },
            {
              id: "p4",
              left: "Parser workers falling behind fetchers",
              right: "Auto-scale parsers based on processing queue depth",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match dedup strategy to what it prevents",
      type: "question",
      sectionId: "sec_q_dedup_traps",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each deduplication or efficiency strategy to the specific problem it addresses:",
        explanation:
          "URL-level dedup (check Metadata DB before enqueuing) prevents re-crawling the same URL. Content-level dedup (content hash comparison) catches different URLs serving identical content. Max depth tracking prevents crawler traps. Jitter on rate limit retries prevents the thundering herd problem where all crawlers retry simultaneously.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "URL-level dedup (check Metadata DB before enqueuing)",
              right: "Prevents re-crawling a URL already in the system",
            },
            {
              id: "p2",
              left: "Content hash comparison after fetching",
              right: "Catches different URLs that serve identical page content",
            },
            {
              id: "p3",
              left: "Maximum depth threshold (15-20 hops)",
              right: "Prevents infinite crawling from crawler trap pages",
            },
            {
              id: "p4",
              left: "Adding jitter to rate limit retry delays",
              right: "Prevents thundering herd when crawlers wait on the same domain",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "Queue anti-pattern",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Storing raw _____ directly in queue messages is an anti-pattern because queues are not optimized for large payloads.",
        explanation:
          "HTML content can be quite large (up to 2MB with inline resources). Queues like SQS have message size limits (256KB) and are designed for small, lightweight messages. The correct pattern is to store HTML in blob storage (S3) and put only a reference (URL ID) in the queue message.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Storing raw {{blank1}} directly in queue messages is an anti-pattern because queues are not optimized for large payloads.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "HTML",
              acceptableAnswers: ["HTML", "html", "Html", "HTML content", "web page content"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Politeness file name",
      type: "question",
      sectionId: "sec_q_architecture",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The _____ file tells web crawlers which pages they are allowed to crawl and how frequently they can make requests.",
        explanation:
          "robots.txt is the standard file used by websites to communicate crawling rules to web crawlers. It contains User-agent directives (which crawler the rules apply to), Disallow directives (which paths are off-limits), and optionally Crawl-delay (seconds between requests).",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The {{blank1}} file tells web crawlers which pages they are allowed to crawl and how frequently they can make requests.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "robots.txt",
              acceptableAnswers: ["robots.txt", "Robots.txt", "ROBOTS.TXT", "robots"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Synchronized retry prevention",
      type: "question",
      sectionId: "sec_q_politeness",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "To prevent multiple crawlers from retrying simultaneously when a rate limit window resets, we add random _____ to the retry delay.",
        explanation:
          "Jitter is a small amount of randomness added to timing-sensitive operations to prevent synchronized behavior. Without jitter, all crawlers waiting on the same domain's rate limit would retry at the exact same moment, causing only one to succeed and repeating the problem. Adding random jitter spreads retries over a time window, dramatically reducing contention.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "To prevent multiple crawlers from retrying simultaneously when a rate limit window resets, we add random {{blank1}} to the retry delay.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "jitter",
              acceptableAnswers: ["jitter", "Jitter", "JITTER", "delay jitter", "random jitter"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // --- Numerical (2 questions) ---

    // Numerical 1 — medium
    {
      title: "Number of crawler machines needed",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "medium",
      payload: {
        questionType: "numerical",
        content:
          "A single network-optimized machine can practically crawl 3,750 pages/second. To crawl 10 billion pages in under 5 days, how many machines are needed? (Round up to the nearest whole number)",
        explanation:
          "Time for one machine: 10,000,000,000 / 3,750 = 2,666,667 seconds ≈ 30.86 days. 5 days = 432,000 seconds. Machines needed = 2,666,667 / 432,000 ≈ 6.17 → round up to 7. However, the source material uses 8 machines for safety margin (30.9 / 8 ≈ 3.9 days). Both 7 and 8 are acceptable.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: 8,
          tolerance: 1,
        },
      },
    },

    // Numerical 2 — hard
    {
      title: "Theoretical max pages per second",
      type: "question",
      sectionId: "sec_q_scaling",
      difficulty: "hard",
      payload: {
        questionType: "numerical",
        content:
          "A network-optimized AWS instance has 200 Gbps bandwidth. If the average page size is 2MB (total transfer size), what is the theoretical maximum number of pages per second this machine can fetch? (Ignore practical limitations)",
        explanation:
          "Convert 200 Gbps to bytes: 200 * 10^9 bits/sec / 8 bits/byte = 25 * 10^9 bytes/sec = 25 GB/sec. At 2MB per page: 25,000 MB/sec / 2 MB/page = 12,500 pages/second. This is the theoretical maximum before accounting for server latency, DNS, rate limiting, etc.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: 12500,
          tolerance: 500,
        },
      },
    },
  ],
};
