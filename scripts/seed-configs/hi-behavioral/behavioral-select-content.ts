/**
 * Behavioral Interview — Select: Choosing Responses Strategically
 * Based on HelloInterview extract
 * Covers: story catalog building, selection criteria (Scope, Relevance, Uniqueness, Recency),
 *         menu technique, values questions, hypothetical questions, honesty in interviews
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const behavioralSelectContent: StoryPointSeed = {
  title: "Select: Choosing Responses Strategically",
  description:
    "Build a story catalog, learn the four-criteria selection framework (Scope, Relevance, Uniqueness, Recency), and master techniques for choosing the right story for any behavioral question.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Story Catalog — Why and How
    {
      title: "Building Your Story Catalog",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Building Your Story Catalog",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Why You Need a Story Catalog",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                'Scrambling to think of examples on the spot costs you time and mental bandwidth you cannot afford. Your working memory is already occupied with impression management, reading the interviewer\'s reactions, and structuring your responses clearly. Adding "search through my entire career history" to that cognitive load is a recipe for mediocre answers. The solution is to identify stories in advance, organize them, and map them to signal areas so you can quickly select the best story for any question.',
            },
            {
              id: "b3",
              type: "heading",
              content: "Two Types of Stories",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Core Stories (3-5): Your most significant projects that demonstrate multiple signal areas and represent the peak of your capabilities. These are the stories you would most want to tell a hiring manager in a few minutes.",
                  "Additional Stories (5-7): Fill coverage gaps across signal areas. Maybe your core stories are all about technical complexity, but you need examples of conflict resolution or leadership.",
                ],
              },
            },
            {
              id: "b5",
              type: "heading",
              content: "Finding Stories Through Journaling",
              metadata: { level: 2 },
            },
            {
              id: "b6",
              type: "paragraph",
              content:
                "Start by noting the biggest stories you already know. Then use these categories to trigger memory: high-impact projects (major launches, refactors, migrations), challenging situations (tight deadlines, conflicts, ambiguity), leadership moments (mentoring, cross-team initiatives), learning experiences (mistakes that led to growth, critical feedback), and career transitions (promotions, role expansions).",
            },
            {
              id: "b7",
              type: "heading",
              content: "Documenting Each Story (CARL Format)",
              metadata: { level: 2 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Context: Situation, your role, why it mattered to the business. Establish the stakes — a churn-prevention feature carries different weight than a nice-to-have enhancement.",
                  'Actions: What YOU specifically did (not "we"). Include ideation, planning, architecture, implementation, rollout. Think across dimensions: Designing, Aligning, Communicating, Implementing, Iterating, Releasing.',
                  "Results: Quantifiable impact is best (revenue, performance, adoption). Non-quantifiable results also matter at senior levels: increased scope, people developed, culture changes.",
                  "Learnings: Technical learnings (new tools/approaches), process learnings (project management), people learnings (team dynamics), strategic learnings (business impact understanding).",
                ],
              },
            },
            {
              id: "b9",
              type: "heading",
              content: "The 8 Signal Areas",
              metadata: { level: 2 },
            },
            {
              id: "b10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Scope: Largest projects owned end-to-end, work above your level.",
                  "Ownership: Problems solved that were not technically your responsibility.",
                  "Ambiguity: Moving forward with incomplete or conflicting information.",
                  "Perseverance: Overcoming serious technical or organizational obstacles.",
                  "Conflict Resolution: Disagreements with managers, teammates, or cross-functional partners.",
                  "Communication: Adapting for different audiences, handling miscommunications.",
                  "Growth: Biggest mistakes, critical feedback that changed your approach.",
                  "Leadership: Influencing without authority, helping colleagues grow.",
                ],
              },
            },
            {
              id: "b11",
              type: "heading",
              content: "Filling Coverage Gaps",
              metadata: { level: 3 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                'After identifying core stories, go signal area by signal area and find additional stories using targeted questions. Leverage past career artifacts (performance reviews, old presentations, RFCs, commit histories), interview former coworkers ("What project do you remember me being most involved in?"), and use sensory memory triggers (visiting past locations, listening to music from those periods).',
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: The Four-Criteria Selection Framework
    {
      title: "The Four-Criteria Selection Framework",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "The Four-Criteria Selection Framework",
          blocks: [
            {
              id: "sf1",
              type: "heading",
              content: "Choosing Stories During the Interview",
              metadata: { level: 2 },
            },
            {
              id: "sf2",
              type: "paragraph",
              content:
                "With your catalog in hand, you need a process for picking the right story for each question. Prioritize according to four criteria, in this order: Scope → Relevance → Uniqueness → Recency.",
            },
            {
              id: "sf3",
              type: "heading",
              content: "1. Scope (Highest Priority)",
              metadata: { level: 2 },
            },
            {
              id: "sf4",
              type: "paragraph",
              content:
                'Choose the story with the largest "box" you operated in. Scope encompasses breadth of actions (did you write code, plan, communicate, resolve conflicts, and measure impact?), timescale (two-week sprint vs year-long initiative), complexity (technical and organizational — did you coordinate across teams?), and business impact (revenue, performance, user satisfaction). Don\'t save your best stories for some hypothetical later moment — lead with them.',
            },
            {
              id: "sf5",
              type: "heading",
              content: "2. Relevance",
              metadata: { level: 2 },
            },
            {
              id: "sf6",
              type: "paragraph",
              content:
                'The story must match the question and deliver the signal the interviewer is asking for. Consider relevance on a spectrum. Strong match for "Tell me about a failure": "My recommendation to rebuild authentication from scratch was wrong, and we rolled back after two months." Weak match: "Our sprint velocity was lower than planned." Also consider relevance to the specific company, role, and interviewer.',
            },
            {
              id: "sf7",
              type: "heading",
              content: "3. Uniqueness",
              metadata: { level: 2 },
            },
            {
              id: "sf8",
              type: "paragraph",
              content:
                "Prefer stories you haven't told yet in this interview. This becomes more important as the interview progresses. Early on, lead with your absolute best stories regardless of repetition. Later, factor in variety. If you have already told a technically complex story, choose an organizationally complex one. But never sacrifice scope or relevance just for variety — your third-best conflict story is not better than reusing your best technical story.",
            },
            {
              id: "sf9",
              type: "heading",
              content: "4. Recency (Lowest Priority)",
              metadata: { level: 2 },
            },
            {
              id: "sf10",
              type: "paragraph",
              content:
                "More recent stories reflect current capabilities and carry more weight. This matters more early in your career when skills change rapidly. Senior engineers have more flexibility — a standout leadership story from two years ago outweighs a mediocre recent example. Avoid stories from 6+ years ago unless you are very senior (VP or above).",
            },
            {
              id: "sf11",
              type: "heading",
              content: "Why This Priority Order Matters",
              metadata: { level: 2 },
            },
            {
              id: "sf12",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Scope > Relevance: Even if another story is slightly more relevant to the literal question, your highest-scope story provides the most valuable signal — it gives the interviewer the most insight into why to hire you.",
                  "Scope > Recency: Interviewers assess your high-water mark. A two-year-old project with significant technical leadership beats last month's straightforward feature.",
                  "Relevance > Recency: A story that directly demonstrates the requested signal area, even if older, beats a recent story that only tangentially relates.",
                  "Uniqueness increases in importance as the interview progresses — early on, focus purely on scope and relevance.",
                ],
              },
            },
            {
              id: "sf13",
              type: "heading",
              content: "The Menu Technique",
              metadata: { level: 2 },
            },
            {
              id: "sf14",
              type: "paragraph",
              content:
                'When you have two strong options, offer the interviewer a choice: "I could tell you about two different approaches — one involved a technical architecture disagreement with another team, and another was about resource allocation with my manager. Which would you prefer?" This shows you have multiple relevant examples, ensures you give them the signal they want, and buys you a moment to collect your thoughts. Don\'t overuse it.',
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 3: Special Question Types & Honesty
    {
      title: "Handling Values Questions, Hypotheticals & Edge Cases",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Handling Values Questions, Hypotheticals & Edge Cases",
          blocks: [
            {
              id: "vq1",
              type: "heading",
              content: "When You Don't Have a Relevant Story",
              metadata: { level: 2 },
            },
            {
              id: "vq2",
              type: "paragraph",
              content:
                'Get as close as possible. If they ask about leading a major initiative but you have only contributed to large projects, tell that story and be honest: "While the senior engineer made the final decisions on architecture, I drove the proof-of-concept that informed our approach." The interviewer is looking for repeatable behaviors, not perfect answers. If you truly have nothing, treat it as a hypothetical: "I haven\'t led a project of that scale yet, but here\'s how I would approach it based on my experience..."',
            },
            {
              id: "vq3",
              type: "heading",
              content: "Why You Must Never Fabricate",
              metadata: { level: 2 },
            },
            {
              id: "vq4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Lying damages your character and creates impostor syndrome even if you get the job.",
                  "Lying is hard — experienced interviewers notice when details get vague, timelines seem unrealistic, or confidence drops under probing.",
                  "Lying is risky — you could be rejected on principle or damage your industry reputation.",
                  'Instead: reframe contributions honestly. Replace "I led the migration" with "I drove the initial proof-of-concept that informed the team\'s approach."',
                ],
              },
            },
            {
              id: "vq5",
              type: "heading",
              content: "Responding to Values Questions",
              metadata: { level: 2 },
            },
            {
              id: "vq6",
              type: "paragraph",
              content:
                'Questions like "What is your approach to cross-team communication?" are NOT "Tell me about a time..." questions. They require you to demonstrate a generalized framework. Your maturity in articulating and justifying this approach signals scope. Construct a 2-3 layer framework by asking: What varies? Pick variations, name your approach for each, add one insight about when to use each.',
            },
            {
              id: "vq7",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Communication: Segment by frequency vs formality (ad-hoc, regular, formal).",
                  "Prioritization: Impact vs effort, or customer value vs technical risk.",
                  "Conflict: Scale by stakes (low, medium, bet-the-company).",
                  "Quality: Speed/quality/scope triangle.",
                ],
              },
            },
            {
              id: "vq8",
              type: "quote",
              content:
                '"Always share an example immediately after presenting your framework. You\'re not lying — you just formalized it after you used it."',
            },
            {
              id: "vq9",
              type: "heading",
              content: "Responding to Hypothetical Questions",
              metadata: { level: 2 },
            },
            {
              id: "vq10",
              type: "paragraph",
              content:
                'Questions like "What would you do if a project was behind schedule?" require structured thinking. Choose 1-2 clarifying questions that would genuinely change your approach (good: "Is this B2B or B2C?" / bad: "What do you mean by difficult?"). Build a framework by abstracting the core challenge, scanning your experience for similar tensions, and extracting transferable principles. Then ground it with a real story.',
            },
            {
              id: "vq11",
              type: "heading",
              content: "Personal & School Stories",
              metadata: { level: 2 },
            },
            {
              id: "vq12",
              type: "paragraph",
              content:
                "Always prefer work stories. Academic projects are acceptable only for junior candidates, as long as they demonstrate the same behaviors — initiative, complex problem-solving, collaboration. Personal stories should focus on situations that translate to workplace skills: leadership, problem-solving, collaboration. Avoid overly personal topics.",
            },
          ],
          readingTime: 7,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════════════

    // --- MCQ (8 questions) ---

    // MCQ 1 — easy
    {
      title: "Recommended number of core stories",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "You are building your behavioral interview story catalog. How many core stories should you aim to have prepared?",
        explanation:
          "Core stories are your most significant projects that demonstrate multiple signal areas at once. 3-5 is the recommended range — enough to cover most questions without overwhelming your preparation. Too few and you risk gaps; too many and you dilute your preparation depth.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "1-2 stories, polished to perfection",
              isCorrect: false,
            },
            {
              id: "b",
              text: "3-5 core stories covering multiple signal areas",
              isCorrect: true,
            },
            {
              id: "c",
              text: "8-10 stories to guarantee full coverage",
              isCorrect: false,
            },
            {
              id: "d",
              text: "As many as possible — more is always better",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Highest-priority selection criterion",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When choosing which story to tell in a behavioral interview, which criterion should you prioritize first?",
        explanation:
          'The four-criteria framework prioritizes: Scope → Relevance → Uniqueness → Recency. Scope comes first because your highest-scope story provides the most insight into your capabilities. Even if another story is slightly more relevant to the question, the story that demonstrates the largest "box" you operated in gives the interviewer the strongest hiring signal.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Recency — always tell your most recent story",
              isCorrect: false,
            },
            {
              id: "b",
              text: "Relevance — the story must match the question exactly",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Scope — choose the story with the largest impact and breadth",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Uniqueness — never repeat a story you have already told",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Purpose of additional stories",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'What is the primary purpose of "additional stories" (beyond core stories) in your interview catalog?',
        explanation:
          "Additional stories (5-7 recommended) fill coverage gaps that core stories leave. If all your core stories demonstrate technical complexity but none show conflict resolution, additional stories ensure you have coverage across all 8 signal areas and provide variety when you have already used a core story.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "To have backup stories in case you forget your core stories",
              isCorrect: false,
            },
            {
              id: "b",
              text: "To fill coverage gaps across signal areas that core stories miss",
              isCorrect: true,
            },
            {
              id: "c",
              text: "To demonstrate that you have a long career history",
              isCorrect: false,
            },
            {
              id: "d",
              text: "To use exclusively in the later parts of the interview",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Scope vs relevance tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'An interviewer asks: "Tell me about your favorite project." You have two options: (A) A 6-month platform migration where you coordinated across 4 teams, redesigned the data pipeline, and saved $2M/year — but it was grueling, not your "favorite." (B) A 2-week hackathon project you personally enjoyed that resulted in a fun internal tool. Which should you choose, and why?',
        explanation:
          'The selection framework says Scope > Relevance. "Favorite project" should not be interpreted as personal affinity (like a favorite movie). Instead, choose the project that best represents your largest achievement — the migration. It gives the interviewer the most insight into your capabilities (breadth of actions, coordination complexity, business impact). The hackathon has limited scope even though it matches "favorite" more literally.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Story A — scope trumps literal relevance; the interviewer wants your highest-impact work, not personal preference",
              isCorrect: true,
            },
            {
              id: "b",
              text: 'Story B — the question explicitly says "favorite" so personal enjoyment is the correct lens',
              isCorrect: false,
            },
            {
              id: "c",
              text: "Story B — shorter stories are easier to tell well within the time limit",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Either is fine — both demonstrate engineering capability equally",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "When recency matters most",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "For which candidate profile does recency matter MOST when selecting interview stories?",
        explanation:
          "Recency matters more early in your career because skills are changing rapidly. A story from last year is much more valuable than one from three years ago for a junior engineer. Senior engineers have more flexibility because their core capabilities are more stable — a standout leadership story from two years ago can outweigh a more recent but less impressive example.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "A junior engineer (1-3 years experience) whose skills are evolving rapidly",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A staff engineer with 15 years of stable expertise",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A VP-level executive interviewing for a C-suite role",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Recency matters equally at all levels",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Values question vs behavioral question",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'An interviewer asks: "What is your approach to prioritizing technical debt?" What type of question is this and what is the best response strategy?',
        explanation:
          'This is a "values question" — it asks for your generalized framework, not a specific story. The best approach is to present a structured framework (e.g., segment tech debt by customer impact vs engineering velocity cost, then use severity tiers), then immediately ground it with a brief example from your career showing the framework in action. Just telling a story misses the framework component; just giving a framework without an example feels abstract.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "A values question — present a structured framework, then immediately ground it with a specific example from your career",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A behavioral question — use CARL to tell a story about a time you dealt with tech debt",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A hypothetical — ask 3-4 clarifying questions before answering",
              isCorrect: false,
            },
            {
              id: "d",
              text: "A trick question — redirect to a story about a more interesting topic",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Complex multi-criteria selection",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "You are in question 7 of 10 in a behavioral interview. The interviewer asks about conflict resolution. You have three options: (A) A high-scope conflict from 4 years ago involving a VP disagreement over architecture — you have not told it yet. (B) A medium-scope conflict from last month with a product manager over prioritization — you have not told it. (C) Your highest-scope story about leading a system migration — you already told it for question 2 but it had a strong conflict element. Which do you choose?",
        explanation:
          "At question 7 of 10, all four criteria matter. Story A has highest scope and is untold (good uniqueness), but 4 years old (borderline recency). Story B is recent and untold, but medium scope. Story C has the highest scope but repeating at question 7 hurts uniqueness badly. The framework says Scope first — Story A has the strongest scope among untold options. While it is 4 years old, Scope > Recency. Story B would only win if Story A were truly stale (6+ years). Story C fails uniqueness this late in the interview.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Story A — it has the highest scope among untold stories, and 4 years is within the acceptable recency window",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Story B — recency should be weighted higher at question 7",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Story C — always lead with your highest-scope story regardless of repetition",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Story B — medium scope with high recency beats high scope with low recency",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Adapting to interviewer context",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "You are interviewing for a frontend-focused role. Your interviewer is a frontend tech lead. You have two equally-scoped stories about conflict: (A) A conflict with a backend team about API contract design that resulted in a better developer experience for frontend consumers. (B) A conflict with a product manager about a complex UI interaction that you resolved through user research and prototyping. Both are recent and untold. Which do you choose?",
        explanation:
          "When scope is equal, relevance becomes the tiebreaker. Relevance includes not just matching the question (both show conflict resolution), but also matching the role and interviewer context. Story B resonates more with a frontend tech lead because it demonstrates frontend-specific judgment (UI interactions, user research, prototyping) and shows you can navigate product/engineering tensions on their turf. Story A is valid but the backend-facing framing may miss the specific signal this interviewer values.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Story B — it demonstrates frontend-specific reasoning and resonates more with a frontend tech lead interviewer",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Story A — API contract design shows cross-team collaboration which is more impressive",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Either — since scope is equal, it does not matter",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Use the menu technique and offer both to the interviewer",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Components of scope in story selection",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          'Which of the following are dimensions of "scope" when evaluating which story to select? (Select ALL that apply.)',
        explanation:
          'Scope encompasses breadth of actions (did you plan, communicate, implement, and measure?), timescale (sprint vs year-long initiative), complexity (technical AND organizational — cross-team coordination), and business impact (revenue, performance, user satisfaction). Storytelling style is about delivery (the "Deliver" phase), not selection. Number of technologies used is a detail that falls under complexity, but is not a standalone scope dimension.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Breadth of actions taken (plan, communicate, implement, measure)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Timescale of the project",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Technical and organizational complexity",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Business impact on revenue, performance, or users",
              isCorrect: true,
            },
            {
              id: "e",
              text: "How engaging your storytelling style is",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid sources for surfacing forgotten stories",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "You are struggling to remember stories from earlier in your career. Which of the following are recommended techniques for surfacing forgotten experiences? (Select ALL that apply.)",
        explanation:
          'All career-artifact approaches are recommended: performance reviews, old presentations/RFCs, commit histories with meaningful messages, and meeting/retrospective notes. Interviewing former coworkers is specifically recommended ("What project do you remember me being most involved in?"). Even sensory memory triggers (visiting past locations, listening to music from those periods) are mentioned as unconventional but effective. Reviewing Glassdoor reviews about yourself is not mentioned and would not be a reliable source of your own stories.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Reviewing past performance reviews and self-reviews",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Interviewing former coworkers about projects they remember you leading",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Reviewing old RFCs, PRDs, and technical documents you authored",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Using sensory triggers like visiting past work locations or listening to music from that period",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Reviewing Glassdoor company reviews for memory prompts",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "When to use the menu technique",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          'The "menu technique" — offering the interviewer a choice between two stories — is appropriate in which scenarios? (Select ALL that apply.)',
        explanation:
          "The menu technique works when you genuinely have multiple strong, relevant options and cannot determine which signal the interviewer wants. It shows depth and lets the interviewer guide the conversation. However, it should not be overused (using it for every question makes you seem indecisive) and should not be used when one story is clearly superior on scope — in that case, just tell the better story.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "You have two stories with similar scope that demonstrate different aspects of the signal area",
              isCorrect: true,
            },
            {
              id: "b",
              text: "You are unsure which of two strong stories better matches what the interviewer is looking for",
              isCorrect: true,
            },
            {
              id: "c",
              text: "You want to buy a moment to collect your thoughts while appearing prepared",
              isCorrect: true,
            },
            {
              id: "d",
              text: "You should use this technique for every question to show depth of experience",
              isCorrect: false,
            },
            {
              id: "e",
              text: "One story is clearly higher-scope but you want the interviewer to feel involved",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Effective clarifying questions for hypotheticals",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          'An interviewer asks: "What would you do if you inherited a team that was underperforming?" Which of the following are GOOD clarifying questions to ask before answering? (Select ALL that apply.)',
        explanation:
          'Good clarifying questions genuinely change your approach and show nuanced understanding. Team size matters (2-person team vs 20-person team requires different strategies). Whether you have hiring/firing authority is a critical constraint. Whether performance issues are technical or cultural shapes the entire response. Asking to define "underperforming" is too basic and deflects. Asking 5+ questions before providing value frustrates interviewers — stick to 1-2 questions that would most change your answer.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: '"How large is the team?" — because strategies differ fundamentally for 3 people vs 30',
              isCorrect: true,
            },
            {
              id: "b",
              text: '"Do I have hiring and performance management authority?" — because constraints shape strategy',
              isCorrect: true,
            },
            {
              id: "c",
              text: '"Are the issues primarily technical skill gaps or team culture/process problems?" — because the intervention differs completely',
              isCorrect: true,
            },
            {
              id: "d",
              text: '"What do you mean by underperforming?" — this is too basic and delays value',
              isCorrect: false,
            },
            {
              id: "e",
              text: '"What is the company culture like? What are the team dynamics? What tools do they use? What is the sprint cadence? What is the tech stack?" — thorough questions show diligence',
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Build a mini story catalog",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Describe 3 core stories from your career (real or hypothetical) that you would include in your story catalog. For each, provide: a one-sentence context, which signal areas it covers, and why it qualifies as a "core" story rather than an "additional" story.',
        sampleAnswer:
          "Story 1: Led a 6-month migration of our payment processing system from a monolith to microservices, coordinating across 3 teams and reducing transaction failures by 40%. Covers: Scope, Ownership, Communication, Leadership. Core because it demonstrates breadth across multiple dimensions (technical depth, cross-team coordination, business impact) at the highest level of my career.\n\nStory 2: Identified and resolved a data consistency bug in our real-time analytics pipeline that had been silently corrupting reports for 2 months, requiring coordination with the data science team and a careful rollout. Covers: Ownership, Perseverance, Communication. Core because it shows investigative depth, cross-functional collaboration, and direct business impact (restored trust in analytics).\n\nStory 3: Proposed and implemented a new code review process after noticing our defect escape rate was climbing, gathering buy-in from skeptical senior engineers through data and piloting. Covers: Leadership, Growth, Communication. Core because it demonstrates influence without authority and shows a repeatable leadership pattern.\n\nThese qualify as core stories because each demonstrates 3+ signal areas simultaneously, represents significant scope, and would be compelling in a short conversation with a hiring manager.",
        explanation:
          "A strong answer identifies stories that cover multiple signal areas each, explains the scope clearly, and articulates why these represent peak capabilities. Core stories should be projects you would most want a hiring manager to hear about — they should demonstrate the breadth and depth of your capabilities.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Paragraph 2 — medium
    {
      title: "Applying the selection framework",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'An interviewer asks: "Tell me about a time you had to make a difficult technical decision under uncertainty." You have three stories: (1) Choosing between building vs buying an ML pipeline — high scope, 2 years ago, already told earlier in this interview. (2) Deciding on a database migration strategy with incomplete performance data — medium scope, last month, untold. (3) Selecting a deployment strategy for a critical launch with conflicting stakeholder requirements — high scope, 3 years ago, untold. Walk through your decision using the four-criteria framework.',
        sampleAnswer:
          'Applying the framework in priority order:\n\nScope (highest priority): Stories 1 and 3 are both high-scope. Story 2 is medium-scope. This eliminates Story 2 from top consideration.\n\nRelevance: All three match "difficult technical decision under uncertainty." Stories 1 and 3 are equally relevant — both involve making consequential technical choices with incomplete information.\n\nUniqueness: Story 1 was already told earlier, so it loses on uniqueness. Story 3 is untold. Since we are later in the interview, uniqueness carries more weight.\n\nRecency: Story 3 is 3 years old, which is within the acceptable window (avoid 6+ years). Story 1 is 2 years old but was already used.\n\nDecision: Story 3. It has high scope, strong relevance, uniqueness (untold), and acceptable recency. Story 1 would be the strongest answer if we had not already told it. Story 2 loses on scope despite being the most recent.',
        explanation:
          "The answer should methodically apply each criterion in order (Scope → Relevance → Uniqueness → Recency), eliminate weaker options at each step, and arrive at a justified choice. The key insight is that Story 1's repetition makes it suboptimal despite its strengths, and Story 2's recency cannot overcome its lower scope.",
        basePoints: 30,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Paragraph 3 — hard
    {
      title: "Construct a values-question framework",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'An interviewer asks: "What is your approach to mentoring junior engineers?" Construct a 2-3 layer framework for your answer and include a brief grounding example. Explain why a framework-first approach is more effective than jumping straight into a story.',
        sampleAnswer:
          'Framework: I segment mentoring by the engineer\'s development stage.\n\nLayer 1 — Onboarding (first 30-60 days): Focused pairing sessions, establishing a safe space for questions, gradually increasing PR complexity. Goal: build confidence and codebase familiarity.\n\nLayer 2 — Growth (months 2-6): Shift from pairing to design review. Assign projects with increasing ambiguity. Provide weekly 1:1 feedback focused on both technical and communication skills. Goal: build independent problem-solving.\n\nLayer 3 — Transition to Peer (6+ months): Gradually reduce direct mentoring. Encourage them to mentor others. Create opportunities for them to present at team meetings and drive small initiatives. Goal: develop leadership habits.\n\nGrounding Example: When I mentored a junior engineer last year, I started with daily pairing on a contained feature (Layer 1). After a month, I shifted to reviewing her design docs and giving her ownership of a small data migration project (Layer 2). Within 4 months, she was onboarding another new hire herself (Layer 3).\n\nWhy framework-first: A values question tests systematic thinking and maturity. Jumping into a story would answer "Tell me about a time you mentored someone" — a different question. The framework signals that you have a repeatable, thoughtful approach, not just one anecdote. The example then proves the framework is grounded in practice.',
        explanation:
          "A strong answer constructs a multi-layered framework with clear differentiating criteria, immediately grounds it with a specific example, and explains why frameworks demonstrate higher scope than individual stories for values questions. The framework should be specific enough to be actionable but general enough to be repeatable.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 4 — hard
    {
      title: "Honest reframing of limited experience",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'An interviewer asks: "Tell me about a time you led an organization-wide technical initiative." You have never led anything beyond your own team. Write a response that honestly reframes your experience without fabricating. Explain which story selection principles you are applying.',
        sampleAnswer:
          "Response: \"I haven't led an organization-wide initiative yet, but I drove the closest equivalent within my scope. Last year, I identified that our team's deployment process had a 40% failure rate. I built a proof-of-concept CI/CD pipeline, gathered data on time saved, and presented the results to our director. While the senior staff engineer ultimately owned the org-wide rollout, I was the driving force behind the initial investigation, proof-of-concept, and the data that justified the investment. The initiative eventually reduced deployment failures across 4 teams by 60%.\"\n\nPrinciples applied:\n1. Honesty over fabrication: I did not claim to lead the org-wide initiative. I was transparent that a senior engineer took over the broader rollout.\n2. Scope maximization: I chose my highest-scope adjacent story — one where I initiated and drove the proof-of-concept that led to org-wide impact, even though I did not own the final rollout.\n3. Focus on repeatable behaviors: I emphasized actions the interviewer can extrapolate — identifying problems proactively, building evidence-based proposals, driving proof-of-concepts. These are the behaviors that scale to org-wide leadership.\n4. Relevance: I chose the story closest to the spirit of the question rather than deflecting to an unrelated strength.",
        explanation:
          "The key insight is that interviewers look for repeatable behaviors, not perfect title matches. A strong answer is honest about scope limitations, maximizes the scope of what the candidate actually did, focuses on transferable behaviors, and demonstrates self-awareness. Fabricating org-wide leadership would risk vague details under probing and damage credibility.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 5 — hard
    {
      title: "Gap analysis of a story catalog",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A candidate has three core stories: (1) Migrated a monolith to microservices (Scope, Ownership, Communication), (2) Debugged a production outage affecting 1M users (Ownership, Perseverance, Communication), (3) Built a new feature from RFC to launch (Scope, Leadership). Analyze the catalog's coverage gaps and recommend what types of additional stories this candidate should find.",
        sampleAnswer:
          "Coverage Analysis:\n- Well-covered: Scope (stories 1, 3), Ownership (stories 1, 2), Communication (stories 1, 2)\n- Partially covered: Leadership (story 3 only), Perseverance (story 2 only)\n- NOT covered: Ambiguity, Conflict Resolution, Growth\n\nCritical Gaps:\n1. Conflict Resolution: No story demonstrates disagreement with a manager, teammate, or cross-functional partner. This is a frequently asked signal area. Recommendation: Find a story about a technical disagreement (e.g., architecture debate), a resource allocation conflict, or a cross-team dependency dispute.\n\n2. Ambiguity: No story shows navigating incomplete or conflicting information. Recommendation: Find a story about building something with changing requirements, entering a new domain without documentation, or making decisions with limited data.\n\n3. Growth: No story demonstrates learning from mistakes or incorporating critical feedback. This is especially important for senior roles where self-awareness is a key differentiator. Recommendation: Find a story about a significant mistake and its aftermath, or feedback that fundamentally changed an approach.\n\nSecondary Gaps:\n4. Leadership diversity: Story 3 shows leadership through project ownership, but no story demonstrates influence without authority or people development. Recommendation: Find a mentoring story or a cross-team influence story.\n\nThe candidate should journal through their career with targeted prompts for each gap area and aim for at least one additional story per uncovered signal area.",
        explanation:
          "A strong gap analysis maps each existing story to signal areas, identifies which areas have zero or single coverage, prioritizes the most critical gaps (Conflict Resolution and Growth are among the most frequently asked), and provides specific prompts for finding stories to fill each gap. The analysis should be actionable, not just diagnostic.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Paragraph 6 — hard
    {
      title: "Hypothetical question response strategy",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'An interviewer asks: "What would you do if you discovered that a feature your team shipped last month is causing data corruption for 5% of users, but fixing it would require pulling engineers off a critical deadline?" Walk through your complete response strategy: clarifying questions, framework construction, and grounding with a real story.',
        sampleAnswer:
          'Clarifying Questions (pick 1-2 that genuinely change approach):\n1. "Is the data corruption recoverable, or are we losing data permanently?" — This fundamentally changes urgency. Permanent loss may require immediate all-hands, while recoverable corruption allows a more measured response.\n2. "Is the critical deadline externally committed (e.g., customer contract) or internal?" — This determines how much flexibility exists.\n\nFramework (abstract the core challenge: urgency vs competing priorities):\nI approach production incidents with a severity-based response model:\n- Severity 1 (permanent data loss, growing blast radius): Immediately pull engineers off the deadline. No deadline justifies ongoing data loss. Communicate the trade-off to stakeholders with data.\n- Severity 2 (recoverable corruption, contained blast radius): Stand up a small tiger team (2-3 engineers) to investigate and implement a mitigation (e.g., feature flag to disable the corrupted path). Remaining team stays on the deadline.\n- Severity 3 (edge case, minimal user impact): Schedule a fix in the next sprint. Monitor closely. Communicate timeline to affected users.\n\nIn all cases: immediately notify stakeholders about the issue, the severity assessment, and the plan. Over-communicate during incidents.\n\nGrounding Example: "This is similar to something I experienced last quarter. We shipped a caching optimization that introduced stale reads for ~3% of users. I classified it as Severity 2 — data was eventually consistent, so no permanent loss. I pulled two engineers to investigate while keeping the rest on our quarterly deliverable. We deployed a hotfix in 48 hours using a feature flag to disable the cache path. I kept our PM and director informed with hourly updates during the first day. The lesson I took away was to add data integrity checks to our launch checklist, which has caught two similar issues since."\n\nThis grounds the hypothetical in real experience while demonstrating a systematic, repeatable approach.',
        explanation:
          "A strong answer follows the complete hypothetical response strategy: (1) asks 1-2 clarifying questions that would genuinely change the approach, (2) constructs a framework that shows systematic thinking about the core tension, (3) grounds it immediately with a relevant real story. The framework should demonstrate senior-level judgment — understanding severity gradients, stakeholder communication, and trade-off reasoning.",
        basePoints: 30,
        difficulty: "hard",
        questionData: {},
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Correct selection criteria order",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "List the four story selection criteria in the correct priority order (highest to lowest), separated by arrows (→).",
        correctAnswer: "Scope → Relevance → Uniqueness → Recency",
        explanation:
          "The framework prioritizes: Scope → Relevance → Uniqueness → Recency. Scope comes first because your highest-scope story provides the most valuable signal to the interviewer. Relevance ensures the story matches the question. Uniqueness prevents repetition (increasingly important as the interview progresses). Recency is lowest because a standout older story beats a mediocre recent one.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Text 2 — medium
    {
      title: "Name the two story types in a catalog",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "A complete story catalog consists of two types of entries. Name both types and the recommended count for each.",
        correctAnswer: "Core stories (3-5) and Additional stories (5-7)",
        explanation:
          "Core stories represent your most significant projects — the stories you would most want to tell a hiring manager. Each demonstrates multiple signal areas. Additional stories fill coverage gaps across signal areas that core stories miss and provide variety when you have already used a core story in the interview.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {},
      },
    },

    // Text 3 — hard
    {
      title: "Story recency guidelines",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "According to the selection framework, at what age (in years) should you generally avoid using a story, and what is the exception?",
        correctAnswer:
          "Avoid stories from 6+ years ago, unless you are very senior (VP or above) or there are extenuating circumstances like career breaks",
        explanation:
          "Stories from 3-5 years ago should be used with care. Stories from 6+ years ago should generally be avoided because they do not reflect current capabilities. The exception is for very senior candidates (VP or above) whose early career stories may demonstrate exceptional scope not available at lower levels, or candidates with extenuating circumstances like career breaks where older stories represent their most relevant professional experience.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // Text 4 — hard
    {
      title: "On-the-fly framework construction",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "When caught off-guard by a values question, what is the 3-step method recommended for constructing a credible framework on the fly?",
        correctAnswer:
          'Ask yourself "What varies?" (stakeholders, time, resources, risk), pick 2-3 variations, name your approach for each variation, and add one insight about when to use each one',
        explanation:
          'The on-the-fly framework construction method is: (1) Identify the variable dimension ("What varies?") — this could be stakeholders, time, resources, risk, or scope. (2) Pick 2-3 variations along that dimension and name your approach for each. (3) Add one practical insight about when each approach applies. Then immediately share an example to ground the framework. The key is to keep it simple — 2-3 layers, not an elaborate taxonomy.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {},
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match signal areas to example questions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each signal area to the behavioral question that best tests it.",
        explanation:
          "Conflict Resolution is directly tested by questions about disagreements. Growth is tested by questions about mistakes and what you learned. Ambiguity is tested by questions about operating with incomplete information. Ownership is tested by questions about going beyond your defined responsibilities. Understanding which signal area a question targets is essential for selecting the right story from your catalog.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              left: "Conflict Resolution",
              right: "Tell me about a time you disagreed with your manager",
            },
            {
              left: "Growth",
              right: "What is the biggest mistake you have made, and what happened next?",
            },
            {
              left: "Ambiguity",
              right: "Describe a project where requirements kept changing",
            },
            {
              left: "Ownership",
              right: "When did you solve a problem that was not your responsibility?",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match question type to response strategy",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each question type to the recommended response strategy.",
        explanation:
          'Behavioral ("Tell me about a time...") calls for the CARL framework — a structured story with Context, Actions, Results, Learnings. Values ("What is your approach to...") calls for a framework first, then an illustrating example. Hypothetical ("What would you do if...") calls for 1-2 clarifying questions, then a framework grounded with a real story. The Menu Technique is specifically for situations where you have 2+ equally strong stories and want the interviewer to choose which signal they prefer.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              left: '"Tell me about a time when..."',
              right: "Select a story using the four-criteria framework and deliver using CARL",
            },
            {
              left: '"What is your approach to..."',
              right: "Present a structured framework, then immediately ground with an example",
            },
            {
              left: '"What would you do if..."',
              right:
                "Ask 1-2 clarifying questions, build a framework, then ground with a real story",
            },
            {
              left: '"I could tell you about two approaches..."',
              right: "The menu technique — used when you have 2+ equally strong relevant stories",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match selection pitfalls to corrections",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each common story selection mistake to the principle that corrects it.",
        explanation:
          'Saving your best story "for later" violates Scope-first — you should lead with your highest-scope stories early. Picking a recent but small story over an older but impactful one violates Scope > Recency — interviewers assess your high-water mark. Fabricating details to match a question violates the honesty principle — reframe contributions honestly instead. Using the same story 4 times violates Uniqueness — which increases in importance as the interview progresses.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              left: 'Saving your best story for a "better" question later',
              right: "Scope-first: Lead with your highest-scope stories, don't hold them back",
            },
            {
              left: "Choosing last week's small bug fix over a year-old system migration",
              right: "Scope > Recency: Your high-water mark matters more than currency",
            },
            {
              left: 'Exaggerating your role from "contributor" to "leader"',
              right:
                "Honesty: Reframe contributions honestly — focus on repeatable behaviors you actually demonstrated",
            },
            {
              left: "Telling the same story for the 4th time in question 8",
              right:
                "Uniqueness: Increasingly important later in the interview — choose an untold story with sufficient scope",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "Story catalog components",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "For each story in your catalog, document: ___, Actions, ___, and Learnings. This structure ensures you capture the situation, what you did, the impact, and your growth.",
        explanation:
          "The four components of a documented story follow the CARL framework: Context (situation, role, business stakes), Actions (what YOU specifically did), Results (quantifiable or qualitative impact), and Learnings (technical, process, people, and strategic insights). This structure ensures every story is interview-ready with all the elements interviewers evaluate.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: ["Context", "Results"],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Selection criteria priority",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The four-criteria selection framework prioritizes: ___ first (largest impact), then Relevance, then ___ (avoid repetition), and finally Recency.",
        explanation:
          "Scope is the highest priority because it reveals the most about your capabilities. Uniqueness is third — it prevents repetition and becomes increasingly important as the interview progresses. This leaves Relevance second (story must match the question) and Recency last (a standout older story beats a mediocre recent one).",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: ["Scope", "Uniqueness"],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Values question technique",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          'When constructing a framework on the fly for a values question, first ask yourself "What ___?", then pick 2-3 variations, and always share an ___ immediately after to ground the framework in practice.',
        explanation:
          "The on-the-fly technique starts with identifying what varies in the scenario (stakeholders, time, resources, risk). After constructing the framework with 2-3 layers, you immediately share an example from your career to prove the framework is grounded in real experience. The example converts an abstract framework into credible, demonstrated expertise.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: ["varies", "example"],
        },
      },
    },
  ],
};
