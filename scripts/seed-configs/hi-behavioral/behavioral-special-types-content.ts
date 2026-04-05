/**
 * Special Interview Types — Behavioral Interview Prep Content
 * Based on HelloInterview extract
 * Covers: recruiter screens, screening interviews, leadership interviews,
 *         deep dives/project retrospectives, cross-functional interviews,
 *         follow-up interviews, hiring manager chats and team matching
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const behavioralSpecialTypesContent: StoryPointSeed = {
  title: "Special Interview Types",
  description:
    "Learn how to adapt your behavioral preparation for recruiter screens, leadership interviews, deep dives, cross-functional rounds, follow-ups, and team matching conversations — each format has different rules, expectations, and strategies.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Recruiter Screens & Screening Interviews
    {
      title: "Recruiter Screens & Screening Interviews",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Recruiter Screens & Screening Interviews",
          blocks: [
            {
              id: "rs1",
              type: "heading",
              content: "Recruiter Screens: Your First Impression",
              metadata: { level: 2 },
            },
            {
              id: "rs2",
              type: "paragraph",
              content:
                "In a screening call at the very beginning of a company's process, the recruiter's job is to assess basic qualifications and cultural fit — not to dive deep into your capabilities or leadership philosophy. They're determining whether you should move forward, checking qualifications, and making sure you're roughly the right level for the role.",
            },
            {
              id: "rs3",
              type: "heading",
              content: "Put the TMAY to Work",
              metadata: { level: 3 },
            },
            {
              id: "rs4",
              type: "paragraph",
              content:
                'Your "Tell Me About Yourself" response is one of the most important tools in a recruiter screen. Deploy it to make a compelling case for passing through to the next round. Focus on connecting your past experience directly to the job description. Mirror the language from the job posting — if they want "cross-functional collaboration," use that exact phrase when describing your experience. Keep it tight: 60 to 90 seconds.',
            },
            {
              id: "rs5",
              type: "quote",
              content:
                '"I\'ve worked on everything from payment processing systems to machine learning infrastructure, led teams ranging from 3 to 15 engineers, and collaborated across product, design, and data science." — Example of the Halo Effect: efficiently listing accomplishments that demonstrate breadth.',
            },
            {
              id: "rs6",
              type: "heading",
              content: "Subject Matter Screening",
              metadata: { level: 3 },
            },
            {
              id: "rs7",
              type: "paragraph",
              content:
                "Some recruiters ask basic questions to verify foundational skills. The recruiter likely isn't experienced enough to evaluate nuances, but they can assess whether you sound credible and knowledgeable. Frame your experience in terms relevant to the target company: fintech → financial systems and security; startup → comfort with ambiguity and rapid iteration.",
            },
            {
              id: "rs8",
              type: "heading",
              content: "Gather Intelligence",
              metadata: { level: 3 },
            },
            {
              id: "rs9",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  '"What does the interview process look like after this call?"',
                  '"Who will I be meeting with and what do they value?"',
                  '"What signal areas are most important for this role\'s behavioral interviews?"',
                  '"What are the main reasons candidates fail the onsite rounds?"',
                  '"What causes candidates to get down-leveled?"',
                ],
              },
            },
            {
              id: "rs10",
              type: "paragraph",
              content:
                "Ask questions the recruiter can actually answer: process, team structure, company trajectory, role context. Save technical depth questions (technical debt, on-call rotations) for team members or the hiring manager.",
            },
            {
              id: "rs11",
              type: "heading",
              content: "Screening Interviews with Hiring Managers",
              metadata: { level: 2 },
            },
            {
              id: "rs12",
              type: "paragraph",
              content:
                "Sometimes the first call with a hiring manager is a behavioral screening. Common at smaller companies where cultural fit is crucial, or for leadership positions. The primary goal is a quick assessment across three areas: (1) Are you the right fit for this specific role? (2) Are you at the appropriate level? (3) Should you enter the standard interview loop or a specialized track?",
            },
            {
              id: "rs13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "TMAY should make it clear you're a fit for the role.",
                  "Keep responses short — screening interviews involve many shallow questions to assess breadth, not depth.",
                  "Prepare thoughtful questions — the screener evaluates every part of the interview, including what you ask.",
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Leadership Interviews & Deep Dives
    {
      title: "Leadership Interviews & Deep Dives",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Leadership Interviews & Deep Dives",
          blocks: [
            {
              id: "li1",
              type: "heading",
              content: "Leadership Interviews: Higher Stakes, More Variability",
              metadata: { level: 2 },
            },
            {
              id: "li2",
              type: "paragraph",
              content:
                "Leadership interviews — whether for senior ICs (Principal+) or management roles — carry higher stakes with more of the hiring decision based on behavioral signals. The structure varies widely: project deep dives, rapid-fire leadership scenarios, philosophical discussions about management style, people management focus, or cross-functional relationship assessment. This unpredictability means you need modular stories you can adapt on the fly.",
            },
            {
              id: "li3",
              type: "heading",
              content: "Additional Signal Areas for Leadership",
              metadata: { level: 3 },
            },
            {
              id: "li4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Driving Impact: Orchestrating outcomes across multiple people and workstreams. Setting vision, aligning stakeholders, removing blockers, tracking measurable goals.",
                  "People Management: Hiring, coaching, performance management, team organization (managers). Mentoring and influence capabilities (senior ICs).",
                  "Cross-Functional Relationships: Working effectively across engineering, PM, design, data science, marketing, and sales. Translating between organizational languages.",
                ],
              },
            },
            {
              id: "li5",
              type: "heading",
              content: "Know Your Audience",
              metadata: { level: 3 },
            },
            {
              id: "li6",
              type: "paragraph",
              content:
                "Adjust your emphasis based on the interviewer: a VP of Design cares about business impact and quality-velocity tradeoffs; a Product Manager focuses on cross-functional partnership and technical communication; a Principal Engineer dives into decision-making frameworks, architectural decisions, and mentoring approaches.",
            },
            {
              id: "li7",
              type: "heading",
              content: "Handling Interruptions and Pivots",
              metadata: { level: 3 },
            },
            {
              id: "li8",
              type: "paragraph",
              content:
                'Senior interviewers (VPs, directors, senior principals) will interrupt mid-story to probe decisions, alternatives, or team dynamics. This is a sign of engagement, not failure. Answer the follow-up, then guide the conversation back: "That decision ended up being crucial. The next major challenge we faced was..." Prepare stories as modular components you can expand or condense based on interest.',
            },
            {
              id: "li9",
              type: "heading",
              content: "Values and Philosophy Questions",
              metadata: { level: 3 },
            },
            {
              id: "li10",
              type: "paragraph",
              content:
                'Leadership interviews often include questions like "What\'s your management philosophy?" or "What makes a great engineering culture?" These require a genuine point of view. Share a simple framework or belief structure, then follow with a concrete example: "I\'ve found that the most effective teams share three characteristics, and I can walk you through how I applied that thinking..."',
            },
            {
              id: "li11",
              type: "heading",
              content: "Think Defensively",
              metadata: { level: 3 },
            },
            {
              id: "li12",
              type: "paragraph",
              content:
                "Leadership interviewers are risk-averse because hiring a misaligned leader has cascading effects across teams. Every gap in your narrative gets filled with assumptions — usually not in your favor. Review stories for weak points: waiting too long to address a performance challenge, allowing technical debt to persist, describing a problem without explaining how it developed, or failing to convince a stakeholder.",
            },
            {
              id: "li13",
              type: "heading",
              content: "Deep Dives and Project Retrospectives",
              metadata: { level: 2 },
            },
            {
              id: "li14",
              type: "paragraph",
              content:
                "Deep dives are extended conversations focusing on a single project. Common flavors: Technical (architecture decisions, scaling challenges), Leadership (team organization, conflict navigation, hiring), and Organizational (work structure, dependencies, process). The interviewer might let you present for 10-15 minutes then drill into specifics, or interrupt frequently turning it into a guided dialogue.",
            },
            {
              id: "li15",
              type: "heading",
              content: "Choosing Your Deep Dive Project",
              metadata: { level: 3 },
            },
            {
              id: "li16",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "High impact: Business metrics you can quantify.",
                  "Large scope: Duration, complexity, size of organization involved.",
                  "Strong personal contribution: You drove it, not just participated.",
                  "Leadership complexity: Multiple teams, ambiguous requirements, significant risk.",
                ],
              },
            },
            {
              id: "li17",
              type: "heading",
              content: "Organizing Long-Form Conversations",
              metadata: { level: 3 },
            },
            {
              id: "li18",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Use the Table of Contents approach: list the most relevant themes upfront as your structure.",
                  'Add only key details that demonstrate scope and judgment (e.g., "coordinating across 12 engineers in 4 time zones").',
                  "Leave out details that result in redundant takeaways — don't reinforce the same signal three times.",
                  'Front-load impact: include Results in your opening. "This project reduced deployment time by 80% across our 200-person org. Here\'s how we got there."',
                ],
              },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Cross-Functional, Follow-Up & Hiring Manager Rounds
    {
      title: "Cross-Functional, Follow-Up & Hiring Manager Rounds",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Cross-Functional, Follow-Up & Hiring Manager Rounds",
          blocks: [
            {
              id: "xf1",
              type: "heading",
              content: "Cross-Functional Interviews",
              metadata: { level: 2 },
            },
            {
              id: "xf2",
              type: "paragraph",
              content:
                "Cross-functional (XFN) interviews pair you with someone from a different discipline — e.g., an engineer interviewed by a product manager. The presence of an XFN interview signals the role requires substantial communication, alignment, and partnership across functions. These interviews assess whether you can translate between organizational languages, build productive relationships with people who think differently, navigate competing objectives while maintaining trust, and advocate for your perspective while respecting others' constraints.",
            },
            {
              id: "xf3",
              type: "heading",
              content: "XFN Interview Strategies",
              metadata: { level: 3 },
            },
            {
              id: "xf4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Choose stories focused on Communication, Conflict Resolution, and Leadership signal areas.",
                  'Drop the jargon: Instead of "I implemented a CQRS pattern with event sourcing," say "I separated our read and write systems so we could scale them independently."',
                  'Never portray cross-functional partners as adversaries. Frame conflicts as differences in perspective: "The PM was responding to shifting market data, which meant our scope evolved, and I needed to help them understand the engineering tradeoffs."',
                  "Use the interview as an opportunity — the interviewer is outside your reporting chain and may be more candid about the company.",
                ],
              },
            },
            {
              id: "xf5",
              type: "quote",
              content:
                "\"The interviewer is from that other function. If you portray their discipline negatively in the interview, then you've answered their question about whether you'll be pleasant to work with.\"",
            },
            {
              id: "xf6",
              type: "heading",
              content: "Follow-Up Interviews",
              metadata: { level: 2 },
            },
            {
              id: "xf7",
              type: "paragraph",
              content:
                "Getting a follow-up behavioral interview is a sign the company is still interested — don't panic. Try to assess why you're being brought back through the recruiter. It could be an inexperienced interviewer, logistical issues, or performance concerns.",
            },
            {
              id: "xf8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Review your story choice and delivery — consider getting a professional mock interview to evaluate your approach.",
                  'Consider offering alternative stories: "In the previous interview, I used a story about a backend refactor. Would you prefer I elaborate, or should I share a different example?"',
                  "Be ready for targeted questions — the interviewer may skip context-setting and jump directly to specific signal probes.",
                ],
              },
            },
            {
              id: "xf9",
              type: "heading",
              content: "Hiring Manager Chats & Team Matching",
              metadata: { level: 2 },
            },
            {
              id: "xf10",
              type: "paragraph",
              content:
                'Hiring manager chats happen late in the process as a final fit evaluation. Unlike a screen (where the bar is "Does this person deserve a closer look?"), the bar here is "Do I want to hire this person?" At large companies like Google and Meta, this may be formalized as Team Matching — a series of meetings with managers to choose a final team assignment.',
            },
            {
              id: "xf11",
              type: "heading",
              content: "Preparing for Hiring Manager Conversations",
              metadata: { level: 3 },
            },
            {
              id: "xf12",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Ensure your resume accurately presents your experience. Ask the recruiter to update it before it reaches hiring managers.",
                  "Research the team and manager in advance — infrastructure vs product team, experienced vs new manager.",
                  "Polish and extend your TMAY. This is a get-to-know-you session, so spending extra time is fine.",
                  "Prepare for questions about how your experience aligns with the team's specific challenges.",
                  "Connect as a person. The hiring manager will work with you 8+ hours a day — they want a positive cultural force. Be energetic, positive, and genuine.",
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════════════

    // --- MCQ (8 questions) ---

    // MCQ 1 — easy
    {
      title: "Recruiter screen primary purpose",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the primary purpose of a recruiter screening call at the beginning of a company's interview process?",
        explanation:
          "The recruiter's job in an initial screen is to assess basic qualifications and cultural fit — not to evaluate technical depth or leadership philosophy. They're determining whether you should move forward in the process, checking qualifications, and verifying you're roughly the right level for the role.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Assess basic qualifications and cultural fit to decide if you should advance to the next round",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Deeply evaluate your technical capabilities and system design skills",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Test your knowledge of the company's specific tech stack and internal tools",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Negotiate your compensation package and start date",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "TMAY in recruiter screens",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'How should you deploy your "Tell Me About Yourself" (TMAY) response in a recruiter screen?',
        explanation:
          "In a recruiter screen, your TMAY should make a compelling case for passing through to the next round. The key strategy is to mirror language from the job posting and connect your experience directly to what they're looking for. Keep it to 60-90 seconds since the recruiter has many questions to ask and this is a quick conversation.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Mirror the job posting language and connect past experience to the role requirements in 60-90 seconds",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Give a comprehensive 5-minute career history from your first job to the present",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Focus entirely on your most recent role and describe every project in detail",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Skip the TMAY and ask the recruiter to describe the role first so you can tailor your response",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Hiring manager chat vs screening interview",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "How does a late-stage hiring manager chat differ from an early-stage screening interview in terms of the bar being applied?",
        explanation:
          'A screening interview asks "Does this person deserve a closer look?" — it\'s about filtering candidates into the pipeline. A late-stage hiring manager chat asks "Do I want to hire this person?" — it\'s a final fit evaluation where the manager is deciding whether to work with you every day. The stakes and evaluation criteria are fundamentally different.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Screening asks "Should we look closer?" while the hiring manager chat asks "Do I want to hire this person?"',
              isCorrect: true,
            },
            {
              id: "b",
              text: "There is no difference — both evaluate the same behavioral signals",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Hiring manager chats are easier because the technical evaluation is already complete",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Screening interviews are more important because first impressions determine everything",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why leadership interviewers interrupt",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "During a leadership interview, the VP interviewer interrupts your story mid-way to ask about a specific decision you barely mentioned. What does this behavior most likely indicate, and what is the best response strategy?",
        explanation:
          "Senior interviewers (VPs, directors, senior principals) interrupt because they're engaged and want to go deeper on something that caught their attention. This is a positive signal, not a sign of failure. The best strategy is to answer the follow-up thoroughly, then guide the conversation back to your main narrative to ensure you cover all key points. Don't get flustered or abandon your story structure.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The interviewer is engaged and wants depth — answer the follow-up, then guide back to your narrative",
              isCorrect: true,
            },
            {
              id: "b",
              text: "You're providing too much detail — shorten your responses significantly",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The interviewer is testing your ability to handle pressure and conflict",
              isCorrect: false,
            },
            {
              id: "d",
              text: "You should abandon your current story and let the interviewer drive the entire conversation",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "XFN interview jargon translation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "In a cross-functional interview with a product manager, you need to describe a technical achievement. Which approach best serves you?",
        explanation:
          "In XFN interviews, a non-engineer is evaluating you, so how well you communicate is part of the evaluation. Dropping jargon and explaining technical concepts in terms of user/business impact demonstrates the cross-functional communication skills the interview is designed to assess. Using heavy technical language would actually hurt you by showing you can't translate across disciplines.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Translate technical details into user and business impact — "I separated read and write systems so we could scale independently without affecting user experience"',
              isCorrect: true,
            },
            {
              id: "b",
              text: 'Use full technical details to demonstrate depth — "I implemented CQRS with event sourcing and eventual consistency guarantees"',
              isCorrect: false,
            },
            {
              id: "c",
              text: "Avoid discussing technical details entirely since the PM won't understand them",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Ask the PM if they want the technical or non-technical version before answering",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Deep dive project selection criteria",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "You're preparing for a deep dive interview for a Staff Engineering role. Which project selection strategy best maximizes your evaluation?",
        explanation:
          "For a deep dive at the staff level, you need a project at the intersection of high impact (quantifiable metrics), large scope (duration, complexity, org size), and strong personal contribution (you drove it). Additionally, staff-level deep dives should demonstrate leadership complexity across multiple dimensions: technical leadership, people leadership, process leadership, and strategic leadership. A project with only one dimension (even if excellent) won't cover enough ground.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Choose a project with high impact, large scope, strong personal contribution, AND leadership complexity across technical, people, and strategic dimensions",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Choose your most technically impressive project regardless of scope or leadership elements",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Choose your most recent project since recency signals current capability",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Choose the project with the best business outcome numbers regardless of your role in it",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Defensive storytelling for leadership interviews",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A Director candidate tells a story about a team reorganization where they describe a period of poor team performance. They explain the steps they took to improve it, resulting in significantly better metrics. Despite the positive outcome, the interviewer might rate this story negatively. Why?",
        explanation:
          'Leadership interviewers think defensively because hiring the wrong leader has cascading effects. Every gap in your narrative gets filled with unfavorable assumptions. If you describe a period of poor team performance without explaining how it got that way, the interviewer may assume YOU created the problem — especially if you were the leader. The candidate needed to front-load the context: did they inherit the situation? Was it caused by external factors? Without that context, "I fixed a broken team" becomes "Why was the team broken on your watch?"',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "The candidate described a team problem without explaining how it developed — the interviewer may assume the candidate created it",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Reorganization stories always signal poor management skills regardless of outcome",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The interviewer expects Director candidates to prevent performance issues, not fix them",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Discussing team struggles is too vulnerable for a leadership interview",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Adapting to interviewer background in leadership rounds",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "You're in a leadership interview and discover your interviewer is a VP of Design. You had planned to emphasize technical architecture decisions in your stories. How should you recalibrate, and what is the underlying principle?",
        explanation:
          'The underlying principle is "Know Your Audience." A VP of Design cares most about business impact, organizational alignment, and quality-velocity tradeoffs — not architectural specifics. You should pivot to emphasize how your technical decisions enabled product quality and business outcomes, how you aligned with design partners, and the tradeoffs you navigated between shipping quickly and maintaining quality. The principle is that leadership candidates must read the room and modulate their emphasis based on what the specific interviewer values.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Pivot to emphasize business impact, organizational alignment, and quality-velocity tradeoffs — the principle is modulating emphasis based on the interviewer's priorities",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Keep your technical emphasis but explain architecture decisions in simpler terms — consistency shows confidence",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Switch entirely to design-focused stories — show the VP you understand their domain",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Ask the VP what they'd like to hear about — senior leaders appreciate candidates who defer to their preferences",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Good questions to ask recruiters",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL questions that are appropriate to ask a recruiter during a screening call:",
        explanation:
          "Recruiters can answer questions about process (interview structure, timelines), people (who you'll meet), priorities (what the team values), and common failure modes. They have templates and talking points about these topics. However, questions about technical debt strategy or on-call rotation specifics are beyond their knowledge — save those for team members or the hiring manager.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: '"What does the interview process look like after this call?"',
              isCorrect: true,
            },
            {
              id: "b",
              text: '"What are the main reasons candidates fail the onsite rounds?"',
              isCorrect: true,
            },
            {
              id: "c",
              text: '"Who will I be meeting with and what do they value?"',
              isCorrect: true,
            },
            {
              id: "d",
              text: '"What is the team\'s technical debt reduction strategy for this quarter?"',
              isCorrect: false,
            },
            {
              id: "e",
              text: '"How does the on-call rotation work and what\'s the average page frequency?"',
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "XFN interview assessment dimensions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content: "Select ALL capabilities that cross-functional interviews are designed to assess:",
        explanation:
          "XFN interviews assess the full range of cross-disciplinary collaboration skills: translating between organizational languages, building relationships with people who think differently, navigating competing objectives while maintaining trust, and advocating for your perspective while respecting constraints. They do not assess algorithm implementation speed (that's the coding round) or solo project execution (XFN rounds specifically focus on partnership).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Translating between different organizational languages and priorities",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Building productive relationships with people who think differently",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Navigating competing objectives while maintaining trust",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Implementing algorithms optimally under time pressure",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Executing solo technical projects without needing help from others",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Leadership interview additional signal areas",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Beyond the core behavioral competencies, select ALL additional dimensions that leadership interviews (Principal+/management) assess:",
        explanation:
          "Leadership interviews add three key signal areas: (1) Driving Impact — moving beyond individual execution to orchestrating outcomes across people and workstreams, (2) People Management — hiring, coaching, performance management for managers; mentoring and influence for senior ICs, and (3) Cross-Functional Relationships — working effectively across disciplines and translating between organizational languages. Algorithm optimization is assessed in technical rounds, not leadership behavioral rounds.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Driving Impact — orchestrating outcomes across multiple people and workstreams",
              isCorrect: true,
            },
            {
              id: "b",
              text: "People Management — hiring, coaching, performance management, team organization",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Cross-Functional Relationships — fluency across disciplines and translating between organizational languages",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Algorithm Optimization — solving complex coding problems more efficiently than other candidates",
              isCorrect: false,
            },
            {
              id: "e",
              text: "System Architecture Whiteboarding — designing distributed systems from scratch",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Deep dive narrative weak points to defend",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL narrative weak points that leadership interviewers may fill with unfavorable assumptions if left unaddressed in your deep dive:",
        explanation:
          "Leadership interviewers are risk-averse and will fill narrative gaps with negative assumptions. Waiting too long to address performance issues suggests conflict avoidance. Allowing technical debt to persist suggests poor technical judgment. Describing a team problem without origin context implies you created it. Failing to convince a stakeholder implies weak influence skills. However, delegating implementation to your team is expected at the leadership level — not addressing this would not create a negative assumption.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "You waited too long to address a performance challenge on your team",
              isCorrect: true,
            },
            {
              id: "b",
              text: "You allowed technical debt or product direction misalignment to persist too long",
              isCorrect: true,
            },
            {
              id: "c",
              text: "You described a team problem without explaining how it got that way, implying you created it",
              isCorrect: true,
            },
            {
              id: "d",
              text: "You were unable to convince a stakeholder, implying weak influence skills",
              isCorrect: true,
            },
            {
              id: "e",
              text: "You delegated the implementation work to your team instead of coding it yourself",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Design your recruiter screen strategy",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'You have a recruiter screen tomorrow for a Senior Backend Engineer role at a fintech company. The job posting emphasizes "building scalable payment systems," "working with compliance teams," and "owning services end-to-end." Design your complete recruiter screen strategy: How do you prepare your TMAY? What intelligence do you want to gather? How do you frame your past experience?',
        explanation:
          "A strong answer demonstrates: (1) TMAY tailored with exact job posting language, (2) experience framed in fintech terms, (3) strategic intelligence-gathering questions, (4) awareness that the recruiter is a gatekeeper, not a deep evaluator.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'TMAY Preparation (60-90 seconds):\nI\'d mirror the job posting language directly: "I\'ve spent the last 4 years building and owning scalable backend systems end-to-end. At [Company], I designed a payment processing service handling 50M+ transactions monthly, worked closely with compliance and legal teams on PCI-DSS requirements, and led the migration from a monolith to microservices. I\'m drawn to [FinTech] because I want to apply my payment systems experience at a company that\'s solving [specific problem]."\n\nKey language mirrors: "scalable," "payment systems," "compliance teams," "owning end-to-end" — all pulled directly from the job posting.\n\nExperience Framing:\nSince it\'s fintech, I\'d emphasize: financial system reliability, regulatory compliance experience, security awareness, and data integrity. Even if my payment experience is limited, I\'d frame adjacent work in financial terms: "handling sensitive user data" becomes "managing PII with compliance-grade access controls."\n\nIntelligence to Gather:\n1. "What does the rest of the interview process look like?" (plan my preparation)\n2. "Who will I be meeting with — are the interviewers more focused on system design or behavioral?" (tailor prep)\n3. "What signal areas matter most for this behavioral round?" (direct preparation signal)\n4. "What are the most common reasons candidates don\'t pass the onsite?" (avoid common mistakes)\n5. "Is there a team matching phase or is this for a specific team?" (understand process)\n\nI would NOT ask about technical debt strategy, on-call rotation specifics, or engineering culture details — those are beyond the recruiter\'s expertise.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Handle an XFN interview conflict story",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "You're in a cross-functional interview with a Product Manager. They ask: \"Tell me about a time you disagreed with a product decision.\" You have a story where you strongly disagreed with a PM's feature prioritization. Explain how you would frame this story for a PM interviewer specifically, and identify the key framing mistakes you must avoid.",
        explanation:
          "A strong answer shows empathetic framing (not adversarial), translates engineering concerns into business/user impact, and acknowledges the PM's perspective — since the interviewer IS a PM who will evaluate whether you'd be pleasant to work with.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Framing Strategy for a PM Interviewer:\n\nCritical principle: The interviewer IS a product manager. If I portray PMs negatively, I\'ve answered their question about whether I\'ll be pleasant to work with — and the answer is no.\n\nEmpathetic framing:\nInstead of: "The PM kept changing requirements and didn\'t understand the engineering cost"\nI\'d say: "The PM was responding to shifting market data, which meant our scope evolved, and I needed to help them understand the engineering tradeoffs of each change so we could make the best decision together."\n\nStory structure:\n- Context: Describe the business situation and why the PM\'s prioritization made sense from their perspective. Acknowledge their constraints.\n- Actions: Frame my disagreement as a collaborative process: "I brought data showing the technical risk" not "I told them they were wrong." Emphasize that I translated engineering constraints into product language — impact on users, revenue, timeline.\n- Results: Show a collaborative outcome where both perspectives contributed to a better decision.\n- Learnings: "I learned that PMs and engineers often have the same goal but different information. Creating shared context early prevents most disagreements."\n\nKey mistakes to avoid:\n1. Adversarial framing — never say the PM "didn\'t understand" or "kept changing their mind"\n2. Using engineering jargon to explain why I was right\n3. Positioning myself as the hero who saved the project from bad product decisions\n4. Failing to acknowledge the PM\'s perspective and constraints\n5. Ending the story with "and they agreed I was right" — this still positions me as adversarial',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Prepare a deep dive Table of Contents",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You're preparing for a deep dive interview for a Staff Engineer role. Choose a real or hypothetical project that spanned 6+ months with multiple teams. Create a Table of Contents for your deep dive: list 4-5 themes, explain what each covers and what signal it provides, and describe how you would front-load impact. Also explain why traditional CARL formatting breaks down for deep dives and how the Table of Contents approach addresses this.",
        explanation:
          "A staff-level answer demonstrates understanding of the Table of Contents technique, ability to structure complex narratives, front-loading impact, and awareness of why linear CARL doesn't scale for extended deep dives.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Project: Platform Migration — Moving 200+ microservices from on-premise Kubernetes to cloud-native infrastructure over 9 months, coordinating across 6 teams.\n\nFront-loaded Impact Opening (30 seconds):\n"This project reduced infrastructure costs by 40%, improved deployment frequency from weekly to multiple times daily, and eliminated 3 categories of production incidents that had caused $2M in revenue impact. It involved 6 teams, 45 engineers, and I was the technical lead driving architecture decisions, team coordination, and execution strategy. Let me walk you through the key dimensions."\n\nTable of Contents (4 themes):\n\n1. Technical Architecture & Risk Management\nCovers: How I evaluated migration approaches (lift-and-shift vs re-architect), designed the incremental migration strategy, identified and mitigated the top 5 technical risks (data consistency during dual-write, service discovery during transition, etc.).\nSignal: Technical vision, decision-making under uncertainty, risk management.\n\n2. Organizational Coordination & Stakeholder Alignment\nCovers: How I aligned 6 team leads and their managers on the migration roadmap, negotiated resource allocation with the VP, created the communication cadence, handled the team that resisted migrating their service.\nSignal: Cross-functional leadership, influence without authority, stakeholder management.\n\n3. Execution & Course Corrections\nCovers: How we discovered the database migration approach wouldn\'t work at week 6, the pivot I led to a dual-write strategy, the production incident during the third wave and how we responded, the scope cut I recommended at month 5.\nSignal: Perseverance, adaptability, judgment under pressure, ownership.\n\n4. People Development & Knowledge Transfer\nCovers: How I onboarded 3 teams who had no cloud-native experience, the mentoring structure I set up, the runbook and training program I created, the engineer I coached through their first architecture review.\nSignal: Mentorship, team building, creating leverage through others.\n\nWhy CARL Breaks Down for Deep Dives:\nTraditional CARL is linear (Context → Actions → Results → Learnings) which works for 5-minute stories. But a 6-month project spanning multiple teams has too many contexts, too many actions, and too many results to deliver linearly. The interviewer would get lost or bored before you reach the most impactful parts. The Table of Contents approach solves this by: (1) letting the interviewer choose what to explore, (2) ensuring you cover multiple signal areas instead of getting stuck in one, (3) front-loading impact so key results are communicated even if the conversation gets redirected, and (4) creating natural pivot points when the interviewer wants to go deeper on specific themes.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Navigate a follow-up behavioral interview",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You\'ve just been told you have a follow-up behavioral interview at a FAANG company. The recruiter says "the team wanted to explore a few more areas." You suspect your first behavioral round may have been weak on the Leadership signal area. Design your complete preparation strategy: How do you diagnose the issue? How do you prepare differently? How do you handle the opening of the follow-up interview, including whether to reuse or switch stories?',
        explanation:
          "A strong answer demonstrates the ability to diagnose interview weaknesses, strategically prepare for follow-ups, and handle the meta-conversation about reusing vs switching stories.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Diagnosis Phase:\n\n1. Extract information from the recruiter: "The team wanted to explore a few more areas" is vague. I\'d probe: "Can you share which competency areas they\'d like to focus on?" and "Was there anything from the first round they\'d like me to elaborate on?" Recruiters may not share everything, but they often give hints.\n\n2. Self-assessment: Review my first round stories. Did I demonstrate leadership scope or default to individual contributor stories? Did I describe driving outcomes or just executing tasks? If my stories focused on "I built X" rather than "I led the initiative that resulted in X," that\'s the gap.\n\n3. Consider alternatives: It might not be my performance — could be an inexperienced first-round interviewer, or they want to test additional signal areas. But I should prepare as if leadership was the gap.\n\nPreparation Strategy:\n\n1. Story audit: Identify 3-4 stories that emphasize leadership behaviors — driving alignment, mentoring, making team-level decisions, influencing without authority. These should be different from first-round stories if possible.\n\n2. Reframe existing stories: If my best leadership evidence is in stories I already told, prepare expanded versions that emphasize the leadership dimensions I may have underplayed: "In my first conversation I focused on the technical aspects of this project, but the leadership challenge was actually the more interesting part."\n\n3. Practice targeted delivery: Focus CARL responses on Leadership signal area — Actions should emphasize coaching, aligning, delegating, and influencing. Results should include team outcomes, not just personal outcomes.\n\nHandling the Opening:\n\nI\'d address the elephant in the room proactively but diplomatically: "Thank you for the opportunity to continue our conversation. I understand the team wanted to explore additional areas — I\'m happy to discuss any aspect of my experience." This signals self-awareness without appearing anxious.\n\nStory Reuse Strategy:\nI\'d offer the interviewer a choice: "In the previous interview, I discussed [X project] focusing on the technical challenges. I could share more about the leadership and organizational dimensions of that same project, or I could discuss a different initiative where I [specific leadership behavior]. Which would be most valuable?" This shows I have depth AND breadth, and gives the interviewer control.\n\nBe ready for targeted questions: The interviewer may skip context-setting entirely and jump to "Tell me about a time you had to persuade a reluctant stakeholder." Prepare for direct, signal-specific probes without warm-up.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Values and philosophy question strategy",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'A VP interviewer asks: "What\'s your engineering leadership philosophy?" This is a values and philosophy question common in leadership interviews. Craft a strong response using the recommended approach: state a framework or belief structure, then support it with a concrete example. Also explain why generic answers like "I believe in servant leadership" fail and what makes a philosophy answer compelling at the staff+ level.',
        explanation:
          "A strong answer demonstrates a genuine point of view with a clear framework backed by a real example. It avoids generic platitudes and shows how the philosophy translates into concrete behaviors and decisions.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "My response:\n\n\"I've found that the most effective engineering teams I've built share three characteristics: clear ownership boundaries, rapid feedback loops, and psychological safety to disagree.\n\nLet me give you a concrete example. When I took over the platform team at [Company], the team had vague ownership — three services had overlapping responsibilities and nobody felt accountable for reliability. I restructured ownership so each engineer had a clear domain, established on-call rotations tied to ownership (so you were paged for the services you owned), and set up weekly architecture reviews where anyone could challenge any design decision — including mine.\n\nThe result was a 70% reduction in MTTR because the right person was always on call, and our architecture review became the team's most valued meeting because people felt safe pushing back. One junior engineer disagreed with my caching strategy and was right — her approach saved us $50K/month in compute costs.\n\nMy philosophy in one sentence: give people ownership, give them fast feedback, and make it safe to be wrong — including safe to tell me I'm wrong.\"\n\nWhy Generic Answers Fail:\n\n\"I believe in servant leadership\" fails for three reasons:\n1. No differentiation: Every candidate says some version of this. It tells the interviewer nothing about how YOU specifically lead.\n2. No evidence: A philosophy without a supporting example is just a slogan. Interviewers are forecasters — they need behavioral data, not declarations.\n3. No specificity: \"Servant leadership\" doesn't tell the interviewer what you'll actually do on Monday morning. Will you run 1:1s? How will you handle underperformance? What's your approach to technical decisions?\n\nWhat makes a philosophy answer compelling at staff+ level:\n1. A simple, memorable framework (3 characteristics, not 10)\n2. Immediate concrete evidence showing the philosophy in action\n3. Quantified results demonstrating the philosophy works\n4. Self-awareness — including an example where your philosophy was challenged or where you were wrong\n5. Specificity that reveals genuine thinking, not borrowed platitudes",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Team matching preparation strategy",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You've passed Google's interview loop and are entering the team matching phase, where you'll meet with 3-4 hiring managers across different teams. Design your complete strategy: How do you research each team? How do you adapt your TMAY for each conversation? What questions do you prepare? How do you evaluate which team is right for you while simultaneously convincing each manager to hire you?",
        explanation:
          "A strong answer shows strategic preparation for team matching, including research tactics, TMAY adaptation, two-way evaluation, and the dual challenge of selling yourself while evaluating fit.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Team Matching Strategy:\n\n1. Pre-Meeting Research (for each team):\n- Ask the recruiter: team mission, manager background, team size, current challenges, and what type of engineer they\'re looking for.\n- LinkedIn research on the manager: their background tells you what they value. An infrastructure-background manager evaluates differently than a product-background one.\n- Research the team\'s product area: recent launches, public blog posts, open-source contributions, conference talks by team members.\n- Understand if it\'s an infrastructure team (stability, reliability emphasis), product team (shipping velocity, user impact), or new initiative (ambiguity comfort, 0-to-1 skills).\n\n2. Adaptive TMAY:\nBase TMAY stays the same career arc, but I pivot the emphasis for each team:\n- Infrastructure team: "I\'ve designed systems handling 500M+ requests/day with 99.99% uptime, and I love the challenge of building reliable foundations that other teams depend on."\n- Product team: "I\'ve shipped features used by 10M+ users and love the rapid iteration cycle of product engineering — seeing user impact within days of deployment."\n- New initiative: "I built [X] from zero to production in 4 months. I thrive in ambiguity and love the 0-to-1 phase where you\'re defining the problem as much as solving it."\nExtend the TMAY beyond the usual 60-90 seconds — this is a get-to-know-you session, so 2-3 minutes is fine.\n\n3. Two-Way Evaluation Questions:\nI need to evaluate them while they evaluate me. Questions that serve both purposes:\n- "What does success look like for someone in this role in the first 6 months?" (reveals expectations AND shows I\'m thinking about impact)\n- "What\'s the biggest technical challenge your team is facing right now?" (reveals team health AND shows my interest)\n- "How does the team handle disagreements about technical direction?" (reveals culture AND shows I value healthy conflict)\n- "What made you decide to join this team?" (builds personal connection AND gives me genuine signal)\n\n4. Balancing Selling vs Evaluating:\nThe dual challenge is appearing enthusiastic about each team (you want options) while genuinely assessing fit. My approach:\n- Be genuinely curious about each team — authentic interest comes through.\n- Identify what makes ME successful on a team and ask directly about those aspects.\n- After each meeting, write down: (a) What excited me, (b) What concerned me, (c) Would I want this manager as my skip-level in 2 years?\n- Remember the hiring manager is also evaluating: "Do I want to work with this person 8+ hours a day?" Be energetic, positive, and connect as a person.\n\n5. Post-Meeting:\nUpdate the recruiter on preferences. Be honest about which teams interested you most — recruiters often have insight into which managers were most excited about you, and can help match accordingly.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "TMAY timing for recruiter screens",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'How long should your "Tell Me About Yourself" response be in a recruiter screen? Give the recommended time range.',
        explanation:
          "The recommended TMAY length for a recruiter screen is 60 to 90 seconds. This is a quick conversation and the recruiter has many questions to cover, so you need to make your case concisely. Longer responses eat into the recruiter's question time and can signal poor communication skills.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "60 to 90 seconds",
          acceptableAnswers: [
            "60 to 90 seconds",
            "60-90 seconds",
            "60 to 90",
            "60-90",
            "1-1.5 minutes",
            "1 to 1.5 minutes",
            "one to one and a half minutes",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Deep dive presentation technique",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What narrative technique is recommended for organizing complex deep dive interviews where a traditional CARL format breaks down? Name the approach.",
        explanation:
          "The Table of Contents technique is recommended for deep dives. You identify the most relevant themes that demonstrate your impact and list them at the beginning, then use those themes as the structure for the rest of the conversation. This works better than linear CARL for complex, multi-month projects because it gives the interviewer a roadmap and lets them guide which areas to explore.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Table of Contents",
          acceptableAnswers: [
            "Table of Contents",
            "table of contents",
            "Table of contents",
            "TOC",
            "toc",
            "The Table of Contents",
            "the table of contents",
            "Table of Contents approach",
            "Table of Contents technique",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "XFN framing principle",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In a cross-functional interview, why should you never portray cross-functional partners as adversaries? State the key insight about who your interviewer is in one sentence.",
        explanation:
          "The key insight is that the interviewer IS from that other function. If you portray their discipline negatively during the interview, you've directly answered their question about whether you'll be pleasant to work with — and the answer is no. This is why empathetic framing (differences in perspective) must replace adversarial framing (they didn't understand).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "The interviewer is from that other function — portraying their discipline negatively answers their question about whether you'll be pleasant to work with.",
          acceptableAnswers: [
            "The interviewer is from that other function",
            "the interviewer is from that function",
            "The interviewer is from the same function as the partners in your story",
            "Your interviewer belongs to the discipline you'd be criticizing",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Hiring manager chat evaluation bar",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'Complete this distinction: In a screening interview, the bar is "Does this person deserve a closer look?" In a hiring manager chat, the bar is "___?"',
        explanation:
          'The hiring manager chat bar is "Do I want to hire this person?" This is fundamentally different from a screen because the manager is making a final fit evaluation — they\'re deciding whether to work with you daily for months. This higher bar means you need to connect as a person, not just demonstrate qualifications.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Do I want to hire this person?",
          acceptableAnswers: [
            "Do I want to hire this person?",
            "Do I want to hire this person",
            "do I want to hire this person",
            "Do I want to hire them",
            "Do I want to hire this candidate",
          ],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match interview type to primary purpose",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each special interview type to its primary purpose:",
        explanation:
          'Recruiter screens filter candidates based on basic qualifications and cultural fit. Screening interviews assess fit, level, and routing (standard loop vs specialized track). Cross-functional interviews evaluate partnership skills across disciplines. Hiring manager chats serve as the final fit evaluation — "Do I want to hire this person?"',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Recruiter Screen",
              right: "Filter candidates based on basic qualifications and cultural fit",
            },
            {
              id: "p2",
              left: "Screening Interview",
              right: "Quick assessment of role fit, level appropriateness, and loop routing",
            },
            {
              id: "p3",
              left: "Cross-Functional Interview",
              right: "Evaluate partnership and communication skills across disciplines",
            },
            {
              id: "p4",
              left: "Hiring Manager Chat",
              right: "Final fit evaluation — deciding whether to work with you daily",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match interviewer background to emphasis priority",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "In a leadership interview, match each interviewer background to what they're most likely to prioritize:",
        explanation:
          'Leadership interviewers evaluate through the lens of their own expertise. A VP of Design prioritizes business impact and quality-velocity tradeoffs. A Product Manager focuses on cross-functional partnership and technical communication. A Principal Engineer dives into technical decision-making and mentoring. Understanding this helps you modulate your emphasis — the "Know Your Audience" principle.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "VP of Design",
              right: "Business impact, organizational alignment, and quality-velocity tradeoffs",
            },
            {
              id: "p2",
              left: "Product Manager",
              right:
                "Cross-functional partnership, balancing engineering constraints with product vision",
            },
            {
              id: "p3",
              left: "Principal Engineer",
              right:
                "Technical decision-making frameworks, architectural decisions, and mentoring approach",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match deep dive flavor to what it explores",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Deep dive interviews come in different flavors. Match each type to the dimensions it explores:",
        explanation:
          "Technical deep dives probe architecture, technology choices, scaling, and technical debt. Leadership deep dives focus on people — team organization, conflicts, stakeholder alignment, hiring, and performance management. Organizational deep dives assess process thinking — work structure, dependencies, resourcing, operational leadership, and best practices. A staff+ candidate should be prepared for all three, often within the same interview.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Technical Deep Dive",
              right:
                "Architecture decisions, technology choices, scaling challenges, technical debt management",
            },
            {
              id: "p2",
              left: "Leadership Deep Dive",
              right:
                "Team organization, conflict navigation, stakeholder alignment, hiring and performance management",
            },
            {
              id: "p3",
              left: "Organizational Deep Dive",
              right:
                "Work structure, dependencies, resourcing, process and operational leadership, establishing best practices",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "Halo Effect in recruiter screens",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The _____ Effect is a technique for recruiter screens where you efficiently list accomplishments or past roles that demonstrate breadth of experience.",
        explanation:
          'The Halo Effect is a technique where you briefly list a range of impressive accomplishments to create an overall positive impression. For example: "I\'ve worked on payment processing systems to ML infrastructure, led teams of 3 to 15, and collaborated across product, design, and data science." This efficiently signals breadth without spending time on detail.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The {{blank1}} Effect is a technique for recruiter screens where you efficiently list accomplishments or past roles that demonstrate breadth of experience.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Halo",
              acceptableAnswers: ["Halo", "halo"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Front-loading impact in deep dives",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In deep dive interviews, you should front-load _____ in your opening because senior interviewers may interrupt with follow-ups and you might never reach the end of your narrative.",
        explanation:
          'Front-loading impact (Results) means including the key outcomes at the very beginning of your deep dive. For example: "This project reduced deployment time by 80% across our 200-person engineering org. Here\'s how we got there." This ensures the interviewer knows your impact even if the conversation gets redirected.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "In deep dive interviews, you should front-load {{blank1}} in your opening because senior interviewers may interrupt with follow-ups and you might never reach the end of your narrative.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "impact",
              acceptableAnswers: [
                "impact",
                "Impact",
                "results",
                "Results",
                "the results",
                "the impact",
              ],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Leadership interview risk aversion",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "Leadership interviewers are especially risk-averse because hiring a bad _____ or misaligned principal engineer can have _____ effects across teams.",
        explanation:
          "Leadership interviewers tend to be more risk-averse because hiring leaders is a powerful way to change an organization — for better or worse. A bad manager or misaligned principal engineer doesn't just affect their own work; the negative effects cascade across every team they touch, every hire they make, and every decision they influence.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "Leadership interviewers are especially risk-averse because hiring a bad {{blank1}} or misaligned principal engineer can have {{blank2}} effects across teams.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "manager",
              acceptableAnswers: ["manager", "Manager", "leader", "Leader"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "cascading",
              acceptableAnswers: ["cascading", "Cascading", "ripple", "Ripple"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
