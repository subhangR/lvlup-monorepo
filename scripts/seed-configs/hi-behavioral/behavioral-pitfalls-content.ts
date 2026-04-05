/**
 * Common Pitfalls in Behavioral Interviews — Behavioral Interview Prep Content
 * Based on HelloInterview extract
 * Covers: 7 core pitfalls (missing assessment, not enough actions, context overload,
 *         "we" disease, wrong stories, fairy tale endings, not practicing),
 *         pitfalls by signal area, and senior-candidate-specific pitfalls
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const behavioralPitfallsContent: StoryPointSeed = {
  title: "Common Pitfalls in Behavioral Interviews",
  description:
    "Identify and avoid the most frequent behavioral interview mistakes — from missing the underlying assessment to fairy tale endings — plus pitfalls by signal area and level-specific traps for senior candidates.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: The 7 Core Pitfalls
    {
      title: "The 7 Core Behavioral Interview Pitfalls",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "The 7 Core Behavioral Interview Pitfalls",
          blocks: [
            {
              id: "cp1",
              type: "heading",
              content: "Why These Pitfalls Matter",
              metadata: { level: 2 },
            },
            {
              id: "cp2",
              type: "paragraph",
              content:
                "After coaching hundreds of candidates through behavioral interviews, the same mistakes appear over and over. Most candidates have strong experiences and compelling stories, but certain weaknesses in how they approach prep or tell their stories hold them back from a hire decision. The good news is that these pitfalls are entirely avoidable — most can be addressed simply by being aware of them.",
            },
            {
              id: "cp3",
              type: "heading",
              content: "Pitfall #1: Missing the Underlying Assessment",
              metadata: { level: 2 },
            },
            {
              id: "cp4",
              type: "paragraph",
              content:
                "Every behavioral question tests something specific. Interviewers aren't asking random questions because they're curious about your life. They're probing for specific signal areas: Ownership, Perseverance, Communication, Conflict Resolution, and others. If you miss what they're actually testing, your entire answer goes off-target, no matter how well you tell the story.",
            },
            {
              id: "cp5",
              type: "paragraph",
              content:
                'Consider "Tell me about a challenging project." The word "challenging" is doing heavy lifting — the interviewer wants to hear about Perseverance. But many candidates spend three minutes on the technical architecture and thirty seconds on the actual challenge. They forget the question wasn\'t "Tell me about an interesting system design."',
            },
            {
              id: "cp6",
              type: "quote",
              content:
                '"Pause for a few seconds after hearing the question. Ask yourself: what signal are they actually looking for? Then select your story accordingly. It\'s ok to spend some time to think."',
            },
            {
              id: "cp7",
              type: "heading",
              content: "Pitfall #2: Not Enough Actions",
              metadata: { level: 2 },
            },
            {
              id: "cp8",
              type: "paragraph",
              content:
                "Actions are the center of any behavioral interview story. That's where the signal lives and that's what goes into interviewer notes. Everything else — Context, Results, Learnings — is supporting material. Interviewers look for repeatable actions to see how they would play out on their team if they hired you.",
            },
            {
              id: "cp9",
              type: "paragraph",
              content:
                'A weak response sounds like: "We had a tight deadline at my fintech company to add a search filter. I built the filter, after a couple weeks of testing, and shipped it on time. The customers liked it." This tells the interviewer almost nothing about what you actually did, how you made decisions, or what obstacles you overcame.',
            },
            {
              id: "cp10",
              type: "paragraph",
              content:
                'A strong response sounds like: "I improved our service\'s performance by identifying N+1 queries on our product listing page. Every product triggered a separate database call for reviews. I refactored this to use a single JOIN query with eager loading, which reduced p95 response time from 3.2s to 400ms. Customer support tickets about slow loading dropped by 60%."',
            },
            {
              id: "cp11",
              type: "heading",
              content: "The 30-Second Rule",
              metadata: { level: 3 },
            },
            {
              id: "cp12",
              type: "paragraph",
              content:
                "If you've been talking for thirty seconds without sharing an action that moves the story forward, you're providing too much detail on something that isn't the point. Actions extend beyond building: designing, aligning, communicating, implementing, iterating, debugging, and analyzing all count.",
            },
            {
              id: "cp13",
              type: "heading",
              content: "Pitfall #3: Context Overload",
              metadata: { level: 2 },
            },
            {
              id: "cp14",
              type: "paragraph",
              content:
                "Context should be the minimum needed to understand your actions and why they mattered. The most critical aspect is establishing the stakes: why the work was important to the organization and its customers. A feature that prevents customer churn carries different weight than a nice-to-have enhancement.",
            },
            {
              id: "cp15",
              type: "paragraph",
              content:
                "Target about 10% of your story on context. For a three-minute story, that's roughly twenty seconds. If you're explaining background for more than thirty seconds, stop and ask: does the interviewer actually need this to understand my actions? Include context details only if they (1) establish the stakes, or (2) make your actions understandable.",
            },
            {
              id: "cp16",
              type: "heading",
              content: 'Pitfall #4: The "We" Disease',
              metadata: { level: 2 },
            },
            {
              id: "cp17",
              type: "paragraph",
              content:
                '"We built a new caching layer." "We decided to go with Redis." "We shipped it in three weeks." Who is "we"? What did YOU do? Every "we" is a missed opportunity to demonstrate a specific contribution. This is especially prevalent among candidates who genuinely work well in teams — they\'re so accustomed to thinking collectively that they describe work collectively.',
            },
            {
              id: "cp18",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Instead of "We decided to use Redis" → "I proposed Redis because our read-to-write ratio was 100:1 and we needed sub-millisecond response times"',
                  'Instead of "We built a new service" → "I designed the service architecture, implemented the core endpoints, and wrote the integration tests"',
                  'Instead of "We shipped on time" → "I coordinated the release across three teams, managing the dependency chain and running the deploy"',
                ],
              },
            },
            {
              id: "cp19",
              type: "heading",
              content: "Pitfall #5: Picking the Wrong Stories",
              metadata: { level: 2 },
            },
            {
              id: "cp20",
              type: "paragraph",
              content:
                "The interviewer only hears the stories you tell, so selection matters a lot. Prioritize: (1) Scope first — choose the project with the largest scope in breadth of actions, timescale, complexity, and business impact. (2) Relevance second — the story needs to deliver the requested signal. (3) Uniqueness third — if you've already used a story, consider covering new ground. (4) Recency fourth — more recent stories represent your current capabilities.",
            },
            {
              id: "cp21",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Scope mismatch: Don't choose a bug-fixing story for a senior role (unless it was a genuinely hard debugging challenge).",
                  "Too old: Stories from five years ago make the interviewer wonder what you've been doing since. Stick to 0-3 years ago.",
                  "Not your project: If your actual contribution was attending meetings and providing input, the interviewer will see through it.",
                ],
              },
            },
            {
              id: "cp22",
              type: "heading",
              content: "Pitfall #6: Fairy Tale Endings",
              metadata: { level: 2 },
            },
            {
              id: "cp23",
              type: "paragraph",
              content:
                '"We shipped on time, metrics improved across the board, stakeholders loved it, and everyone lived happily ever after." Interviewers hear this and think: "You must not have been close enough to the action to see problems, or you\'re hiding something, or you\'re not self-aware enough to see the weaknesses." Real projects have real problems.',
            },
            {
              id: "cp24",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Include obstacles: "We hit a performance regression in staging that took a week to debug."',
                  'Include mistakes and recoveries: "I initially underestimated cross-team dependencies, causing a two-week delay. Once I recognized this, I set up daily syncs."',
                  'Include imperfections: "We shipped on time, but test coverage wasn\'t where I wanted it. I added those tests in the following sprint."',
                ],
              },
            },
            {
              id: "cp25",
              type: "paragraph",
              content:
                'The most compelling learnings show clear application to future situations. "This experience fundamentally changed how I approach X" is more powerful than "I learned that Y is important." Even better: point to a subsequent project where you applied the learning.',
            },
            {
              id: "cp26",
              type: "heading",
              content: "Pitfall #7: Not Practicing",
              metadata: { level: 2 },
            },
            {
              id: "cp27",
              type: "paragraph",
              content:
                "Candidates who know their stories on paper but haven't practiced out loud consistently underperform candidates with slightly weaker experiences who've rehearsed. The cognitive load of real-time storytelling is large, and practice closes the gap between what you mean to communicate and what actually comes out under pressure.",
            },
            {
              id: "cp28",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Stories that run long (5-6 minutes instead of 2-3)",
                  "Losing your place and backtracking",
                  "Tangential details because you haven't decided what to cut",
                  'Verbal fillers ("um," "like," "you know," "basically")',
                  "Pacing issues — rushing through important parts or lingering too long on setup",
                ],
              },
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 2: Pitfalls by Signal Area
    {
      title: "Pitfalls by Signal Area",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Pitfalls by Signal Area",
          blocks: [
            {
              id: "sa1",
              type: "heading",
              content: "Signal-Specific Mistakes",
              metadata: { level: 2 },
            },
            {
              id: "sa2",
              type: "paragraph",
              content:
                "Each signal area has its own common mistakes. Responses targeting a particular signal tend to fail in predictable ways. Review these to audit your own stories before your interview.",
            },
            {
              id: "sa3",
              type: "heading",
              content: "Scope",
              metadata: { level: 3 },
            },
            {
              id: "sa4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Are your projects representative of your target level?",
                  'Can you articulate the "so what" — business outcomes and user impact?',
                  "Do you communicate complexity: number of teams, timeline, components affected?",
                  "Are you demonstrating the scope expected for your target role?",
                ],
              },
            },
            {
              id: "sa5",
              type: "heading",
              content: "Ownership",
              metadata: { level: 3 },
            },
            {
              id: "sa6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Watch for passive language throughout your responses — avoid the "we" disease.',
                  "Show bias for action — how you considered ways to quickly get started.",
                  "Describe how you measured results and why you chose those particular metrics.",
                  'The difference between "I was asked to improve search" and "I identified search was causing user drop-off and proposed a fix" is a huge difference in proactivity.',
                ],
              },
            },
            {
              id: "sa7",
              type: "heading",
              content: "Perseverance",
              metadata: { level: 3 },
            },
            {
              id: "sa8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Are you selling why the challenge was actually difficult — time, technical, or people constraints?",
                  "Show how the issue was discovered. Did you find it yourself?",
                  "Demonstrate sustained effort over time, not just quick wins.",
                  "Include follow-up actions you took to prevent the challenge from recurring.",
                ],
              },
            },
            {
              id: "sa9",
              type: "heading",
              content: "Ambiguity",
              metadata: { level: 3 },
            },
            {
              id: "sa10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Are you quantifying the ambiguity: scope uncertainty? technical unknowns? unclear success criteria?",
                  "Show structured thinking: prototyping, stakeholder interviews, phased rollout.",
                  "Demonstrate course-correction as you learned more.",
                  "Highlight how you clarified ambiguity for others, not just yourself.",
                ],
              },
            },
            {
              id: "sa11",
              type: "heading",
              content: "Communication",
              metadata: { level: 3 },
            },
            {
              id: "sa12",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Highlight methods and reasons: was it verbal or written? Who needed it? What happened after?",
                  "Demonstrate communication at multiple levels: across (peers), up (managers), and down (ICs under your direction).",
                  "Show two-way understanding: you checked comprehension or gathered feedback and adapted.",
                ],
              },
            },
            {
              id: "sa13",
              type: "heading",
              content: "Conflict Resolution",
              metadata: { level: 3 },
            },
            {
              id: "sa14",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Choose a conflict reflective of your level: peer disagreement is lower level than partner-team conflict.",
                  "Be sure YOU were directly involved in resolving it — not observing from the sidelines.",
                  "Show empathy. If you're making the other person look bad, the interviewer knows you're not being charitable.",
                  "Frame the resolution as a win-win as much as possible.",
                  "Show the relationship afterward — did you build respect and repair trust?",
                ],
              },
            },
            {
              id: "sa15",
              type: "heading",
              content: "Growth",
              metadata: { level: 3 },
            },
            {
              id: "sa16",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Share a real mistake — not "I work too much."',
                  "Make sure the mistake isn't too obvious from the beginning what you should have done.",
                  "Show you internalized the learning with specific behavior changes.",
                  "Point to subsequent situations where you applied the learning.",
                ],
              },
            },
            {
              id: "sa17",
              type: "heading",
              content: "Leadership",
              metadata: { level: 3 },
            },
            {
              id: "sa18",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Show how you influenced others and created conditions for them to do their best work.",
                  "Demonstrate how you slowed down to think and created clarity when there was chaos or ambiguity.",
                  "Mention how you mentored or developed other team members through teaching, code reviews, etc.",
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 3: Pitfalls for Senior Candidates
    {
      title: "Pitfalls for Senior Candidates",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Pitfalls for Senior Candidates",
          blocks: [
            {
              id: "sc1",
              type: "heading",
              content: "Why Senior Interviews Are Harder",
              metadata: { level: 2 },
            },
            {
              id: "sc2",
              type: "paragraph",
              content:
                "Senior candidates face additional challenges because their stories are richer and more complex, and also because interviewers tend to scrutinize more closely. The following pitfalls are specific to Staff+ level interviews.",
            },
            {
              id: "sc3",
              type: "heading",
              content: "Too Verbose",
              metadata: { level: 2 },
            },
            {
              id: "sc4",
              type: "paragraph",
              content:
                "Senior candidates have rich, complex stories that are harder to tell in a short timeframe. Having richer stories is a good thing, but you have to decide what is actually useful for the interviewer to hear.",
            },
            {
              id: "sc5",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Use the Table of Contents structure: "I contributed in three key ways: the technical architecture, the stakeholder alignment, and the team mentoring. Let me walk through each."',
                  "For each theme, prioritize the 3-4 most important actions.",
                  "Include details only to establish credibility — once you've done that, keep moving.",
                  "Consider pausing after your Table of Contents to allow for questions, avoiding the monologue feeling.",
                ],
              },
            },
            {
              id: "sc6",
              type: "heading",
              content: "Leaving Out Frameworks",
              metadata: { level: 2 },
            },
            {
              id: "sc7",
              type: "paragraph",
              content:
                "Senior candidates describe what they did but often not HOW they thought about what they did — the reasoning behind their choices. At Staff and above, the interviewer wants to know your process.",
            },
            {
              id: "sc8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  '"I prioritized the work" → How? What framework? What dimensions did you score on?',
                  '"I made the technical decision" → What tradeoffs? What criteria?',
                  '"I mentored the junior engineer" → What approach? What techniques?',
                ],
              },
            },
            {
              id: "sc9",
              type: "quote",
              content:
                '"Example: I prioritized the roadmap based on a combination of customer impact, engineering effort, and strategic alignment. I scored each initiative on those dimensions and presented the tradeoffs to leadership. — The interviewer wants evidence that your decision-making process will transfer to their context."',
            },
            {
              id: "sc10",
              type: "heading",
              content: "Not Thinking Defensively",
              metadata: { level: 2 },
            },
            {
              id: "sc11",
              type: "paragraph",
              content:
                "Interviewers for senior candidates are risk-averse — bringing in senior leaders has wide organizational impact. Because of this risk aversion, interviewers fill any gaps in your narrative with negative assumptions about you or your actions.",
            },
            {
              id: "sc12",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  '"My manager assigned me this project" → Interviewer wonders: Do you not seek out work yourself?',
                  '"It took me three months" → Interviewer wonders: Is that reasonable? Did you consider alternatives?',
                  "\"The codebase had no test coverage\" → Interviewer wonders: If you're senior enough to notice, why didn't you fix it?",
                ],
              },
            },
            {
              id: "sc13",
              type: "paragraph",
              content:
                'To address this, either elide the problematic parts ("I took on this high-impact task") or proactively frame them ("The three months included building a feature-flagged migration path so we could ship incremental improvements every sprint").',
            },
            {
              id: "sc14",
              type: "heading",
              content: "Not Steering the Interview",
              metadata: { level: 2 },
            },
            {
              id: "sc15",
              type: "paragraph",
              content:
                "The temptation is to let the interviewer drive the conversation entirely. But it's actually your job to guide the interviewer toward your most important stories and the most important parts of those stories.",
            },
            {
              id: "sc16",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Start in TMAY: Mention a complex project in "Tell Me About Yourself" — the interviewer will likely ask about it next, guiding them to your strongest material.',
                  'Breadcrumbs: Brief mentions of interesting sub-topics invite follow-up questions. "I also had to navigate stakeholder concerns, but the key technical challenge was..." signals there\'s a good conflict story available.',
                  'The menu technique: "I have two examples of conflict: one involving a technical architecture decision and one involving cross-team alignment. Which would be more useful?" Now the interviewer picks based on the signal they need.',
                ],
              },
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
      title: "Identifying the underlying assessment",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'An interviewer asks "Tell me about a challenging project." A candidate responds by spending three minutes explaining the system architecture and thirty seconds on the actual challenge. What pitfall does this illustrate?',
        explanation:
          'This is Pitfall #1: Missing the Underlying Assessment. The word "challenging" signals the interviewer is looking for Perseverance — how you hit a real wall and pushed through it. By focusing on the technical architecture instead, the candidate treats it as a system design question rather than addressing what the interviewer actually wants: how they maintained motivation, tried alternative approaches, and adapted their strategy under difficulty.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Missing the Underlying Assessment — they focused on architecture instead of addressing the Perseverance signal the interviewer was testing",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Context Overload — they spent too much time on background information",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Not Enough Actions — they didn't describe specific steps they took",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Fairy Tale Ending — they made the project sound too easy",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "The 30-second rule",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: 'What is the "30-second rule" in behavioral interview storytelling?',
        explanation:
          "The 30-second rule states: if you've been talking for thirty seconds without sharing an action that moves the story forward, you're providing too much detail on something that isn't the point. This is a self-check mechanism to prevent Context Overload and ensure your response stays focused on the Actions — where the interviewer's signal lives.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "If you've been talking for 30 seconds without sharing an action that moves the story forward, you're dwelling on non-essential detail",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Your entire behavioral answer should be no longer than 30 seconds",
              isCorrect: false,
            },
            {
              id: "c",
              text: "You should wait 30 seconds before answering any behavioral question",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Each section of your CARL response should take exactly 30 seconds",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Context allocation in a story",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "According to best practices, approximately what percentage of your behavioral story should be spent on context (setup)?",
        explanation:
          "Context should be about 10% of your story. For a three-minute story, that's roughly twenty seconds. Context should establish the stakes (why the work mattered) and make your actions understandable — nothing more. Spending more than thirty seconds on context setup is a sign of Context Overload. The remaining 90% should focus on Actions (the bulk), Results, and Learnings.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "About 10% — roughly twenty seconds in a three-minute story",
              isCorrect: true,
            },
            {
              id: "b",
              text: "About 25% — equal to Actions, Results, and Learnings",
              isCorrect: false,
            },
            {
              id: "c",
              text: "About 40% — context needs to be thorough so the interviewer understands everything",
              isCorrect: false,
            },
            {
              id: "d",
              text: "About 50% — context should be equal to the rest of the story combined",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: 'Why the "we" disease is harmful',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'A candidate says: "We decided to use Redis, we built a new service, and we shipped on time." This exhibits the "we" disease. Why is this especially problematic, even though the candidate genuinely works collaboratively?',
        explanation:
          'The core issue is that every "we" is a missed opportunity to demonstrate a specific individual contribution. The interviewer is evaluating the candidate — not their team. Using "we" leaves the interviewer unable to determine what this specific person actually did. The fix isn\'t to claim you did everything alone, but to be specific: "I proposed Redis because our read-to-write ratio was 100:1" instead of "We decided to use Redis." You can acknowledge teamwork while being clear about your role.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Every "we" is a missed opportunity to demonstrate a specific individual contribution — the interviewer cannot determine what this person actually did',
              isCorrect: true,
            },
            {
              id: "b",
              text: "It makes the candidate seem like they can't work independently and always need a team",
              isCorrect: false,
            },
            {
              id: "c",
              text: 'Interviewers interpret "we" as the candidate taking credit for others\' work',
              isCorrect: false,
            },
            {
              id: "d",
              text: 'Using "we" signals the candidate was a junior team member who only did what they were told',
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Passive language and ownership signal",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'A candidate says: "I was assigned this project by my manager, and the ticket came to me." Why does passive language like this specifically hurt the Ownership signal?',
        explanation:
          'Passive language like "I was assigned" and "the ticket came to me" makes it sound like work happens TO the candidate rather than the candidate driving the work. For the Ownership signal, interviewers look for bias for action and proactive problem identification. The difference between "I was asked to improve search" and "I identified that search was causing user drop-off and proposed a fix" is a massive difference in demonstrated proactivity. Even if you were assigned something, focus on what you chose to do once you had it.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "It makes the candidate sound reactive — work happens to them rather than them driving work — which undermines the bias-for-action signal interviewers need",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It reveals that the candidate's manager doesn't trust them with important decisions",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It shows the candidate only works on assigned tasks and never does anything extra",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Passive language is grammatically weak and makes the candidate sound less intelligent",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Story selection priority for senior roles",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A senior engineer candidate has two stories for a Conflict Resolution question: (A) a recent bug-fixing disagreement with a peer that was resolved quickly, and (B) a year-old cross-team architecture disagreement that took weeks to resolve. Which should they choose and why?",
        explanation:
          'Story B is the better choice for two reasons. First, scope: a cross-team architecture disagreement is much higher scope than a peer bug-fix disagreement, and scope is the #1 priority in story selection. Second, level-appropriateness: the raw content explicitly states that "disagreeing with a peer is a lower level conflict than disagreeing with a partner team." The recency advantage of Story A is outweighed by the scope advantage of Story B. The selection priority is: scope → relevance → uniqueness → recency.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Story B — cross-team scope is higher than peer scope, and scope is the #1 selection priority; "disagreeing with a peer is a lower level conflict than disagreeing with a partner team"',
              isCorrect: true,
            },
            {
              id: "b",
              text: "Story A — recency is more important because it shows current capability",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Story A — a quick resolution shows better conflict resolution skills",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Story B — longer conflicts are always better because they show perseverance",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Defensive thinking for senior candidates",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'A Staff Engineer candidate says in an interview: "The codebase had no test coverage when I joined." According to the principle of "thinking defensively," what is the most likely negative assumption the interviewer will make about this statement?',
        explanation:
          'The principle of defensive thinking warns that interviewers for senior candidates are risk-averse and will fill narrative gaps with negative assumptions. When a Staff Engineer says the codebase had no test coverage, the interviewer wonders: "If you\'re senior enough to notice this problem, why didn\'t you fix it?" This implies either the candidate lacked ownership to address a clear quality gap, or they weren\'t actually operating at a staff level. The fix: either omit it, or proactively frame it ("I inherited a codebase with no tests, so my first initiative was establishing a testing strategy").',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "\"If you're senior enough to notice it, why didn't you fix it?\" — implying a lack of ownership at Staff level",
              isCorrect: true,
            },
            {
              id: "b",
              text: '"This person exaggerates problems to make their contributions look bigger"',
              isCorrect: false,
            },
            {
              id: "c",
              text: '"This person blames their team for low code quality instead of taking responsibility"',
              isCorrect: false,
            },
            {
              id: "d",
              text: '"No test coverage means this person was at a bad company and may have learned poor practices"',
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Framework omission at Staff level",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'A Staff Engineer says: "I prioritized the roadmap and made the technical decision to go with microservices." The interviewer rates this response poorly despite the correct outcome. What critical element is missing that separates Staff-level answers from Senior-level answers?',
        explanation:
          'At Staff and above, the interviewer wants to know your PROCESS — the frameworks and reasoning behind your decisions. "I prioritized the roadmap" needs to become "I prioritized based on customer impact, engineering effort, and strategic alignment — I scored each initiative on those dimensions and presented the tradeoffs to leadership." The outcome matters, but the decision-making framework matters more because interviewers are assessing whether your process will transfer to their organization. They want evidence of repeatable good judgment, not just one correct decision.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The decision-making framework — HOW they thought about the decision (criteria, tradeoffs, scoring dimensions), not just WHAT they decided",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Technical details — they should have described the microservices architecture in depth",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Team context — they didn't mention how many people were involved",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Timeline — they didn't say how long the implementation took",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Signs of insufficient practice",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL symptoms that indicate a candidate has not practiced their behavioral stories enough:",
        explanation:
          "All five are classic signs of insufficient practice: stories running 5-6 minutes (should be 2-3), losing your place and backtracking, tangential details (haven't decided what to cut), verbal fillers, and pacing issues. These are all caused by the cognitive load of real-time storytelling without rehearsal. Having prepared stories in writing but never spoken them aloud is NOT sufficient — the gap between written and spoken delivery is significant.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Stories that run 5-6 minutes instead of 2-3 minutes",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Losing your place in the narrative and backtracking",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Including tangential details because you haven't decided what to cut",
              isCorrect: true,
            },
            {
              id: "d",
              text: 'Excessive verbal fillers ("um," "like," "you know," "basically")',
              isCorrect: true,
            },
            {
              id: "e",
              text: "Answering every question with a different story instead of reusing your best one",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Ways to make fairy tale endings credible",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          'Select ALL techniques that make behavioral story endings more credible and avoid the "fairy tale ending" pitfall:',
        explanation:
          'Including obstacles, mistakes with recoveries, and imperfections all make stories credible because real projects have real problems. Showing learning application demonstrates growth. However, ending with "everything went perfectly" is the fairy tale pitfall itself — interviewers suspect you weren\'t close enough to the action to see problems, are hiding something, or lack self-awareness. Similarly, blaming the team undermines the empathy signal.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Include obstacles: "We hit a performance regression in staging that took a week to debug"',
              isCorrect: true,
            },
            {
              id: "b",
              text: 'Include mistakes and recoveries: "I underestimated the cross-team dependencies, causing a delay. I then set up daily syncs."',
              isCorrect: true,
            },
            {
              id: "c",
              text: 'Include imperfections: "We shipped on time, but test coverage wasn\'t where I wanted it. I added tests in the following sprint."',
              isCorrect: true,
            },
            {
              id: "d",
              text: "Show that a learning was applied in a subsequent project",
              isCorrect: true,
            },
            {
              id: "e",
              text: 'End with "everything went perfectly and all stakeholders were happy"',
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Action categories beyond building",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          'Actions in behavioral stories extend beyond "building things." Select ALL categories of actions that count as meaningful behavioral actions:',
        explanation:
          "Actions encompass designing (architecture, APIs), aligning (stakeholder consensus, negotiating priorities), communicating (documentation, presentations, difficult conversations), iterating (gathering feedback, course corrections), and debugging/analyzing (root cause analysis, performance optimization). Attending meetings without contributing is passive — it's not an action. Setting up infrastructure is valuable but falls under implementing, which is already covered by the general concept of building.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Designing: system design choices, API specifications, architecture decisions",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Aligning: building consensus, negotiating priorities, coordinating across functions",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Communicating: documentation, presentations, difficult conversations, translating for different audiences",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Iterating: gathering feedback, measuring results, course corrections based on new information",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Attending: sitting in meetings, being present for discussions, observing decisions being made",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Interview steering techniques for senior candidates",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL techniques that senior candidates can use to steer the interview toward their strongest material:",
        explanation:
          'Three steering techniques are recommended: (1) Seeding TMAY — mentioning a complex project in "Tell Me About Yourself" so the interviewer asks about it. (2) Breadcrumbs — brief mentions that invite follow-ups ("I also had to navigate stakeholder concerns, but..."). (3) The menu technique — offering two examples and letting the interviewer choose. However, asking to skip a question signals poor preparation and lack of adaptability. Answering a different question than the one asked is evasive and will raise red flags.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Seed TMAY: Mention a complex project in "Tell Me About Yourself" so the interviewer asks about it next',
              isCorrect: true,
            },
            {
              id: "b",
              text: "Breadcrumbs: Brief mentions of interesting sub-topics that invite follow-up questions",
              isCorrect: true,
            },
            {
              id: "c",
              text: 'The menu technique: "I have two examples — one about X and one about Y. Which would be more useful?"',
              isCorrect: true,
            },
            {
              id: "d",
              text: 'Ask to skip: "I don\'t have a good story for that — can we do a different question?"',
              isCorrect: false,
            },
            {
              id: "e",
              text: "Redirect: Answer a completely different question that showcases your strongest story",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Diagnose pitfalls in a sample response",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Read this candidate response and identify ALL pitfalls present:\n\n"Tell me about a time you improved team productivity."\n\n"So at my previous company, we had this legacy monolith that was built in 2018 by the original founding team, and my manager had been there since the beginning, and the org was structured into three pods — Platform, Growth, and Core — and I was on Core which handled the main product features. My manager asked me to look into why our sprint velocity was declining. We looked at the CI pipeline and decided to parallelize the test suite. We built it, we tested it, and we shipped it. Sprint velocity improved and everyone was happy."',
        explanation:
          'A strong analysis identifies multiple pitfalls: Context Overload (org history, pod structure, manager background — none needed to understand the actions), Passive Language/Ownership ("my manager asked me"), The "We" Disease (every action uses "we"), Not Enough Actions (no specifics on what was done), and Fairy Tale Ending ("everyone was happy"). Missing the Underlying Assessment is also arguable — "improved team productivity" signals Ownership/Scope but the response doesn\'t demonstrate proactive problem identification.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'This response contains at least 5 major pitfalls:\n\n1. **Context Overload**: The candidate spends over half the response on background — the founding team, the manager\'s tenure, the org structure into three pods. None of this is needed to understand the actions. Context should be ~10% and should only establish stakes or make actions understandable.\n\n2. **Passive Language / Ownership Deficit**: "My manager asked me to look into why sprint velocity was declining" signals reactive behavior. For the Ownership signal, they should say: "I noticed sprint velocity was declining and investigated the root cause."\n\n3. **The "We" Disease**: "We looked at the CI pipeline," "We decided to parallelize," "We built it, we tested it, we shipped it." The interviewer cannot determine what THIS candidate specifically did. Every "we" should become a specific "I" action.\n\n4. **Not Enough Actions**: The entire action sequence is "looked at CI → decided to parallelize → built, tested, shipped." No details about debugging approach, technical decisions, tradeoffs considered, or how they implemented the parallelization. The 30-second rule is violated in context, and actions get 5 seconds.\n\n5. **Fairy Tale Ending**: "Sprint velocity improved and everyone was happy" is exactly the fairy tale pattern. No obstacles mentioned, no imperfections, no learnings. A credible version: "Sprint velocity improved 30%, but we discovered the parallelized tests had race conditions in 2 suites that needed refactoring. I spent the next sprint stabilizing those."',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: 'Rewrite a "we" disease response',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Rewrite the following response to eliminate the "we" disease while keeping the collaborative spirit intact. The rewrite should make the candidate\'s specific contributions clear without claiming they did everything alone.\n\nOriginal: "We decided to migrate from MySQL to PostgreSQL. We evaluated the options, we built a migration plan, we executed the migration over a weekend, and we validated everything Monday morning. We hit our deadline and the stakeholders were pleased."',
        explanation:
          "A good rewrite replaces each \"we\" with a specific individual contribution while naturally acknowledging teamwork. It should show what the candidate's role was — perhaps they led the evaluation, designed the migration plan, coordinated the weekend execution, etc. The key insight is that specificity about your role doesn't mean claiming solo credit.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Rewritten response:\n\n"I led the evaluation of PostgreSQL vs MySQL for our scaling needs. I benchmarked both engines against our query patterns and presented the performance data to the team — PostgreSQL\'s JSON support and window functions gave us a 3x improvement on our analytics queries. I designed the migration plan with a three-phase approach: shadow writes first, then read switching with a rollback flag, then full cutover.\n\nFor the weekend execution, I coordinated the runbook across our backend team and the DBA. I personally handled the schema migration scripts and data validation queries, while our DBA managed the replication cutover. Monday morning, I ran our integration test suite and compared query outputs between the old and new databases to validate correctness.\n\nWe hit our deadline, but I should note — the shadow write phase revealed three ORM queries that relied on MySQL-specific syntax, which I hadn\'t caught in my initial audit. I fixed those before the cutover, and this taught me to always run production query analysis before planning a database migration, not just benchmark synthetic queries."\n\nNotice: teamwork is acknowledged naturally ("our backend team," "while our DBA managed"), but every action has a clear owner. The fairy tale ending is also fixed with an honest imperfection and a learning.',
          minLength: 150,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Evaluate a growth story for pitfalls",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'An interviewer asks "Tell me about a mistake you made." The candidate responds: "My biggest weakness is that I work too hard. Sometimes I care so much about the product that I stay late and my teammates have to tell me to go home. I\'ve learned to set better boundaries." Identify every pitfall in this response, explain why each one would cause a negative evaluation, and write a brief example of what a strong Growth signal response looks like.',
        explanation:
          'A comprehensive answer identifies: (1) not a real mistake — "I work too hard" is a humblebrag, (2) no genuine learning — boundaries are vague, (3) violates the Growth signal rules — need a real mistake where the right answer wasn\'t obvious from the start, (4) no specific behavior change or subsequent application. A strong response includes a genuine error, clear accountability, and demonstrated behavior change.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Pitfalls in this response:\n\n1. **Not a real mistake**: "I work too hard" is the classic humblebrag that interviewers universally see through. The Growth signal requires sharing a genuine mistake — something you actually needed to learn. The pitfall guide explicitly says: "Share a real mistake — not \'I work too much.\'""\n\n2. **Too obvious from the start**: A good mistake story should not make it immediately clear what the candidate should have done. "I work too hard" has an obvious solution (work less), so it demonstrates no real learning or judgment growth.\n\n3. **No specific behavior change**: "I\'ve learned to set better boundaries" is vague. The Growth signal requires showing specific behavior changes you internalized — concrete new practices or approaches.\n\n4. **No subsequent application**: There\'s no mention of a later situation where the learning was applied. The most compelling growth stories point to "a subsequent project where you applied the learning."\n\n5. **Fairy Tale framing**: The response frames the "mistake" as a virtue (caring about the product), which is dishonest and undermines credibility.\n\nA strong Growth signal response:\n\n"Early in my tech lead role, I made a database schema decision without consulting our DBA. I chose a normalized schema optimized for write performance, but 60% of our traffic was reads. When we hit production, our p99 latency spiked to 8 seconds. I had to lead an emergency migration to a denormalized read-optimized schema, which cost us a two-week delay.\n\nWhat I learned: my mistake wasn\'t technical — it was process. I was so focused on shipping fast that I skipped cross-functional review. I created a technical decision template that requires sign-off from at least one domain expert before any schema or architecture change. In my next project — a payments system redesign — I used that template and caught a similar performance mismatch during review, saving us from the same class of error.\n\nThe deeper learning was that speed without consultation creates more delay than consultation itself."',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Apply defensive thinking to a narrative",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'A Staff Engineer candidate plans to tell this story: "My manager assigned me a migration project. The codebase had no test coverage. It took me three months to complete. The old system was poorly designed." For each statement, identify the negative assumption an interviewer will likely make, and rewrite the statement to proactively address the concern.',
        explanation:
          "A strong answer maps each statement to a negative interviewer assumption and provides a reframed version that either omits the problematic element or proactively addresses it with positive framing.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Defensive thinking analysis:\n\n**"My manager assigned me a migration project"**\n- Negative assumption: "Do you not seek out work yourself? Are you just a task-taker at the Staff level?"\n- Rewrite: "I identified that our legacy payment system was creating reliability risks and proposed a migration to the team. After scoping it, I took ownership of the project." (Shows proactive problem identification)\n\n**"The codebase had no test coverage"**\n- Negative assumption: "If you\'re senior enough to notice, why didn\'t you fix it? You\'re at Staff level — this should have been something you addressed."\n- Rewrite: "I inherited a codebase with no test infrastructure, so my first step was establishing a testing strategy — I set up the test framework, wrote integration tests for the critical paths, and created a testing guide for the team." (Turns the problem into a demonstration of ownership)\n\n**"It took me three months"**\n- Negative assumption: "Is that reasonable? Did you consider faster approaches? Three months seems long — were you inefficient?"\n- Rewrite: "The migration took three months, which included building a feature-flagged dual-write system so we could ship incremental improvements to users every sprint while maintaining the rollback path. I prioritized zero-downtime over speed because this was a payment system handling $2M in daily transactions." (Justifies the timeline with engineering rigor)\n\n**"The old system was poorly designed"**\n- Negative assumption: "This person throws their predecessors under the bus. What will they say about US if they leave?"\n- Rewrite: "The original system was built for 10x lower scale and had served us well, but our growth had outpaced its architecture." (Charitable framing that respects the original builders while establishing why change was needed)\n\nThe pattern: either elide the problematic element entirely, or proactively frame it to demonstrate the exact quality the interviewer would otherwise doubt.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Build a Table of Contents response structure",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You\'re a Staff Engineer answering "Tell me about the most impactful project you\'ve led." Your project involved redesigning a payment processing system. Demonstrate how to use the "Table of Contents" technique to structure your response. Write the Table of Contents itself and briefly outline what you would cover under each heading. Explain why this technique is superior to chronological storytelling for senior candidates.',
        explanation:
          "A strong answer shows the ToC technique organizing a complex story into 3-4 thematic pillars, with a brief outline for each. It should explain the benefits: prevents rambling, signals organized thinking, allows the interviewer to ask about what interests them, and avoids the monologue trap.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "**Table of Contents delivery:**\n\n\"This was a payment processing redesign that I led from problem identification through production rollout. I contributed in three key areas: the technical architecture, the cross-team coordination, and the risk management strategy. Let me walk through each — or if one of these is more interesting to you, I'm happy to dive deeper there.\"\n\n[Pause — allow the interviewer to direct if they want]\n\n**Pillar 1: Technical Architecture**\n- Identified that our monolithic payment flow had a single point of failure at the gateway level\n- Designed an event-driven architecture with saga pattern for distributed transactions\n- Made key tradeoff: eventual consistency vs strong consistency — chose eventual with compensation flows\n- 3-4 specific actions: designed the system, built the prototype, validated with production traffic replay\n\n**Pillar 2: Cross-Team Coordination**\n- Aligned 4 teams (payments, platform, fraud, compliance) on migration timeline\n- Created a technical decision document that got VP-level buy-in\n- Ran weekly architecture reviews to surface integration issues early\n- 3-4 specific actions: stakeholder mapping, decision doc, review cadence, escalation handling\n\n**Pillar 3: Risk Management**\n- Implemented feature-flagged dual-write system for zero-downtime migration\n- Designed canary deployment with automatic rollback on error rate threshold\n- Built monitoring dashboard for payment success rates during migration\n- 3-4 specific actions: rollback strategy, monitoring setup, runbook creation, incident simulation\n\n**Why ToC beats chronological storytelling for senior candidates:**\n\n1. **Prevents verbosity**: Senior stories are complex with multiple threads. Chronological telling tends to ramble because you follow the timeline rather than the themes. ToC lets you prioritize the most important actions within each theme.\n\n2. **Signals organized thinking**: Starting with a clear structure demonstrates the kind of organized communication expected at Staff level. It mirrors how you'd present to leadership.\n\n3. **Creates interaction**: Pausing after the ToC invites the interviewer to direct the conversation, transforming a monologue into a dialogue. This gives you signal about what they care about.\n\n4. **Enables depth control**: If the interviewer is most interested in cross-team coordination (maybe they're the hiring manager), you can go deep on Pillar 2 and lighter on the others. Chronological storytelling doesn't offer this flexibility.",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Audit a story across all 7 pitfalls",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Choose one of your real professional experiences (or create a realistic hypothetical one). First, write a brief version of the story that intentionally contains at least 4 of the 7 core pitfalls. Then rewrite the same story avoiding all pitfalls, following the CARL framework with proper context allocation, specific individual actions, a credible ending, and clear learnings. Label each pitfall you intentionally included and explain how your rewrite fixes it.",
        explanation:
          'A strong answer demonstrates mastery of all 7 pitfalls by both creating and fixing them. The "before" should contain identifiable pitfalls, and the "after" should demonstrate proper CARL structure with ~10% context, specific actions, honest results, and actionable learnings.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            '**Before (intentionally pitfall-laden):**\n\n"At my last company, which was a Series C fintech startup founded in 2019, we had about 200 engineers organized into domain teams, and my team was responsible for the payments domain, which was one of the most critical. [CONTEXT OVERLOAD] My manager asked me to lead a reliability improvement initiative. [PASSIVE LANGUAGE] We analyzed the incidents, we designed a circuit breaker pattern, we implemented it, and we deployed it. [WE DISEASE + NOT ENOUGH ACTIONS] After deploying, everything worked perfectly, we had zero incidents for the rest of the quarter, and the VP of Engineering was impressed. [FAIRY TALE ENDING]"\n\n**After (pitfall-free CARL response):**\n\n**Context** (~15 seconds): "Our payment processing service was experiencing weekly production incidents that cost us an average of $50K per outage in failed transactions. This was our highest-revenue flow."\n\n**Actions** (bulk of response): "I initiated an incident retrospective analysis across the previous quarter — I categorized 23 incidents and found that 80% were caused by downstream service failures cascading into our payment flow. Based on this analysis, I designed a circuit breaker pattern with three states: closed (normal), open (failing fast), and half-open (testing recovery). I chose Resilience4j over building custom because our team needed to ship within two sprints, and I didn\'t want to maintain custom infrastructure.\n\nI implemented the circuit breaker on our three highest-risk integrations first, wrote comprehensive integration tests that simulated each failure mode, and created a runbook for oncall engineers explaining the new failure behaviors. I also partnered with our observability team to build a dashboard showing circuit breaker state across all services."\n\n**Results**: "Cascading failures dropped from weekly to one in the next quarter. But honestly, our initial thresholds were too aggressive — the circuit breaker tripped on normal latency spikes twice in the first week, which temporarily blocked legitimate transactions. I had to tune the failure rate threshold from 50% to 70% and add a minimum request volume before the breaker activates."\n\n**Learnings**: "I learned that failure mode design needs production traffic patterns, not just theoretical analysis. Now I always deploy circuit breakers in monitoring-only mode for a week before enabling the actual breaking behavior. I applied this approach to our notification service migration three months later and caught a threshold issue before it impacted users."\n\n**Pitfalls fixed:**\n1. Context Overload → Reduced to two sentences establishing stakes\n2. Passive language → "I initiated" instead of "my manager asked"\n3. "We" disease → Every action has a clear individual owner\n4. Not enough actions → Detailed steps: analysis, design, implementation, testing, partnership, documentation\n5. Fairy tale ending → Included the threshold tuning issue honestly',
          minLength: 300,
          maxLength: 4000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Name the context inclusion criteria",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "According to the pitfalls framework, context details should be included in your behavioral story only if they serve one of two specific purposes. What are these two purposes?",
        explanation:
          "Context details should only be included if they (1) establish the stakes of the problem, or (2) make your actions understandable. If a detail doesn't serve one of these two purposes, it should be cut. This two-part test prevents Context Overload while ensuring the interviewer has enough information to appreciate your actions.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Establish the stakes, or make your actions understandable",
          acceptableAnswers: [
            "Establish the stakes, or make your actions understandable",
            "establish stakes, make actions understandable",
            "stakes and understandable actions",
            "establish the stakes of the problem, make your actions understandable",
            "establish stakes, understand actions",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Story selection priority order",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "When picking a story for a behavioral question, what are the four selection criteria in priority order?",
        explanation:
          "The priority order is: (1) Scope first — choose the project with the largest scope. (2) Relevance second — the story needs to match the question and deliver the requested signal. (3) Uniqueness third — prefer stories you haven't already told. (4) Recency fourth — more recent stories represent current capabilities. Scope is #1 because it's the strongest signal for leveling.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Scope, Relevance, Uniqueness, Recency",
          acceptableAnswers: [
            "Scope, Relevance, Uniqueness, Recency",
            "scope, relevance, uniqueness, recency",
            "Scope Relevance Uniqueness Recency",
            "scope relevance uniqueness recency",
            "highest scope, most relevant, most unique, most recent",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "The senior candidate verbal technique",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'What is the name of the storytelling technique where a senior candidate organizes their response into 3-4 thematic pillars and presents them upfront before diving into details? (Example: "I contributed in three key ways: the technical architecture, the stakeholder alignment, and the team mentoring.")',
        explanation:
          "The Table of Contents technique is specifically recommended for senior candidates whose stories are rich and complex. By presenting themes upfront, the candidate prevents verbosity, signals organized thinking, and gives the interviewer an opportunity to direct the conversation toward what interests them most. This transforms a potential monologue into an interactive dialogue.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Table of Contents",
          acceptableAnswers: [
            "Table of Contents",
            "table of contents",
            "Table of contents",
            "ToC",
            "TOC",
            "Table of Contents structure",
            "the Table of Contents",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "The menu technique",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'What is the name of the interview steering technique where a candidate offers the interviewer a choice between two examples? (Example: "I have two examples of conflict: one involving a technical architecture decision and one involving cross-team alignment. Which would be more useful?")',
        explanation:
          'The "menu technique" is one of three steering strategies for senior candidates (alongside seeding TMAY and breadcrumbs). By offering a choice, the candidate guides the interviewer toward their prepared material while letting the interviewer pick based on the signal they need. This is a powerful way to maintain control of the narrative without being pushy.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "The menu technique",
          acceptableAnswers: [
            "The menu technique",
            "menu technique",
            "Menu technique",
            "the menu technique",
            "menu",
          ],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match pitfall to its description",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each behavioral interview pitfall to its description:",
        explanation:
          'Missing the Underlying Assessment means you don\'t identify what signal the question is testing. The "We" Disease means using collective language instead of specific individual contributions. Context Overload means spending too much of your story on background setup. Fairy Tale Endings means concluding with unrealistically perfect outcomes that lack credibility.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Missing the Underlying Assessment",
              right: "Not identifying what signal area the question is actually testing",
            },
            {
              id: "p2",
              left: 'The "We" Disease',
              right: "Using collective language that hides your specific individual contributions",
            },
            {
              id: "p3",
              left: "Context Overload",
              right: "Spending too much of your story on background and setup information",
            },
            {
              id: "p4",
              left: "Fairy Tale Endings",
              right:
                "Concluding stories with unrealistically perfect outcomes that lack credibility",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match signal area to its common pitfall",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each signal area to the most common pitfall candidates make when telling stories for that signal:",
        explanation:
          'Ownership stories fail when candidates use passive language ("I was assigned") instead of showing proactive problem identification. Growth stories fail when candidates share fake mistakes ("I work too hard") instead of genuine learning experiences. Conflict Resolution stories fail when candidates make the other person look bad instead of showing empathy. Perseverance stories fail when candidates only describe quick wins instead of demonstrating sustained effort through real difficulty.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Ownership",
              right:
                'Using passive language ("I was assigned") instead of showing proactive initiative',
            },
            {
              id: "p2",
              left: "Growth",
              right:
                'Sharing a fake mistake like "I work too hard" instead of a genuine learning experience',
            },
            {
              id: "p3",
              left: "Conflict Resolution",
              right:
                "Making the other person look bad instead of showing empathy and win-win resolution",
            },
            {
              id: "p4",
              left: "Perseverance",
              right:
                "Only describing quick wins instead of demonstrating sustained effort through difficulty",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match senior pitfall to its interviewer assumption",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each statement a senior candidate might make to the negative assumption the interviewer is likely to form:",
        explanation:
          'Defensive thinking means anticipating how interviewers fill narrative gaps. "My manager assigned me" triggers doubts about self-direction at senior levels. "It took three months" triggers doubts about efficiency without justification. "The codebase had no tests" triggers doubts about why a senior person didn\'t fix an obvious quality gap. "We shipped on time" without specifics triggers doubts about the candidate\'s closeness to the actual execution.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: '"My manager assigned me this project"',
              right: '"Do you not seek out work yourself at the Staff level?"',
            },
            {
              id: "p2",
              left: '"It took me three months"',
              right: '"Is that reasonable? Did you consider faster approaches?"',
            },
            {
              id: "p3",
              left: '"The codebase had no test coverage"',
              right: "\"If you're senior enough to notice, why didn't you fix it?\"",
            },
            {
              id: "p4",
              left: '"We shipped on time and stakeholders were happy"',
              right: '"Were you close enough to the action to actually see problems?"',
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "The 30-second rule",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "If you've been talking for _____ seconds without sharing an action that moves the story forward, you're providing too much detail on something that isn't the point.",
        explanation:
          "The 30-second rule is a self-check: if thirty seconds pass without a story-advancing action, you're spending too long on context, technical details, or other non-action elements. This prevents Context Overload and keeps the focus on the Actions section where the interviewer's signal lives.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "If you've been talking for {{blank1}} seconds without sharing an action that moves the story forward, you're providing too much detail on something that isn't the point.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "30",
              acceptableAnswers: ["30", "thirty", "Thirty"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Context percentage target",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Target about _____% of your behavioral story on context. For a three-minute story, that's roughly _____ seconds.",
        explanation:
          "Context should take about 10% of your story — roughly twenty seconds in a three-minute story. This minimal context should establish the stakes and make your actions understandable. Any background detail that doesn't serve one of these two purposes should be cut.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Target about {{blank1}}% of your behavioral story on context. For a three-minute story, that's roughly {{blank2}} seconds.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "10",
              acceptableAnswers: ["10", "ten", "Ten"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "20",
              acceptableAnswers: ["20", "twenty", "Twenty"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Defensive thinking principle",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "Interviewers for senior candidates are _____ because bringing in senior leaders has wide organizational impact. Because of this, interviewers will fill any _____ in your narrative with negative assumptions about you.",
        explanation:
          "Interviewers for senior candidates are risk-averse because senior hires have wide organizational impact. Due to this risk aversion, they fill any gaps in your narrative with negative assumptions. This is why defensive thinking is crucial: you must either address potential concerns proactively or omit problematic details entirely.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "Interviewers for senior candidates are {{blank1}} because bringing in senior leaders has wide organizational impact. Because of this, interviewers will fill any {{blank2}} in your narrative with negative assumptions about you.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "risk-averse",
              acceptableAnswers: ["risk-averse", "risk averse", "Risk-averse", "Risk averse"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "gaps",
              acceptableAnswers: ["gaps", "Gaps", "gap"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
