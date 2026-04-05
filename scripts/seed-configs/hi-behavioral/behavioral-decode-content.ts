/**
 * Behavioral Interview — Decode: How Interviews Work
 * Based on HelloInterview extract
 * Covers: three evaluation frameworks (signal areas, company values, cultural assessment),
 *         three question types, eight signal area deep dives, decoding strategy
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const behavioralDecodeContent: StoryPointSeed = {
  title: "Decode: How Behavioral Interviews Work",
  description:
    "Understand the three evaluation frameworks interviewers use — signal areas, company values, and cultural assessment — so you can decode what any behavioral question is really asking.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Why Behavioral Interviews Are Hard & The Three Evaluation Frameworks
    {
      title: "Decoding Behavioral Interviews — The Three Evaluation Frameworks",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Decoding Behavioral Interviews — The Three Evaluation Frameworks",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Why Behavioral Interviews Are Hard",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "The hardest part of behavioral interview prep is knowing if your answers are any good. Unlike a coding interview, you can't execute your answers and test them against expected output. That changes once you understand how behavioral interviews are actually evaluated.",
            },
            {
              id: "b3",
              type: "paragraph",
              content:
                "Behavioral interviewers are forecasters. They want to know not just whether you can do the work, but whether you'll do it the way it needs to be done at their company. A great engineer from a startup might struggle in a Big Tech behavioral, and vice versa — not because either lacks skill, but because the behaviors that lead to success look different in each environment.",
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                "The Behavioral Interview Cycle is: Decode → Select → Deliver. Before you can pick the right story or deliver it well, you need to understand what's actually being asked. This article focuses on the Decode step.",
            },
            {
              id: "b5",
              type: "heading",
              content: "The Three Evaluation Frameworks",
              metadata: { level: 2 },
            },
            {
              id: "b6",
              type: "paragraph",
              content:
                "When you sit down for a behavioral interview, your interviewer evaluates you through three different lenses, sometimes consciously, sometimes not:",
            },
            {
              id: "b7",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Signal Areas — Core competencies that companies have identified as valuable. Observable, repeatable behaviors like how you communicate, handle ambiguity, and navigate disagreements.",
                  "Company Values — Organization-specific principles (e.g., Amazon's Leadership Principles, Google's \"Focus on the user\") that repackage universal signal areas with company-specific language and priorities.",
                  "Cultural Assessment — Pattern-matching against successful engineers at that company. How you approach authority, communicate impact, balance speed vs. quality, and handle failure.",
                ],
              },
            },
            {
              id: "b8",
              type: "heading",
              content: "The Eight Signal Areas",
              metadata: { level: 2 },
            },
            {
              id: "b9",
              type: "paragraph",
              content:
                "Almost all behavioral questions map back to eight core signal areas. A single question can lead to collecting signal across multiple areas — your best stories will touch several at once.",
            },
            {
              id: "b10",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  'Scope — The "size of the box" you can operate in. Does your past impact match the level being hired for?',
                  "Ownership — You don't just flag issues, you drive solutions end-to-end until they're done.",
                  "Ambiguity — Your ability to navigate unclear requirements and create clarity from chaos.",
                  "Perseverance — What you do when things get hard. Includes knowing when to quit.",
                  "Conflict Resolution — How you handle disagreements directly and professionally.",
                  "Growth — Whether you learn from mistakes, seek feedback, and are coachable.",
                  "Communication — How you adapt your style for different audiences and choose appropriate channels.",
                  "Leadership — Influencing without authority, mentoring, driving cross-team initiatives.",
                ],
              },
            },
            {
              id: "b11",
              type: "heading",
              content: "Company Values vs. Signal Areas",
              metadata: { level: 2 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                'Company values rarely replace the core signal areas — they repackage them. Amazon\'s "Ownership" maps directly to the Ownership signal area. Google\'s "Focus on the user" connects to Ownership and Communication. Meta\'s "Move Fast" relates to Ownership and Perseverance.',
            },
            {
              id: "b13",
              type: "quote",
              content:
                "\"Many candidates make the mistake of trying to memorize company values and awkwardly insert them into every response. Interviewers call this 'value-dropping' and see through it immediately.\"",
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                "At Amazon, knowing the specific Leadership Principles language matters because they reference them in daily work. At most other companies, the underlying behaviors matter more than vocabulary matching.",
            },
            {
              id: "b15",
              type: "heading",
              content: "Cultural Assessment",
              metadata: { level: 2 },
            },
            {
              id: "b16",
              type: "paragraph",
              content:
                'Beyond signal areas and values, interviewers pattern-match you against successful engineers they\'ve worked with. Cultural signals include how you approach authority, communicate impact, balance speed vs. quality, and handle failure. There is no universally "right" behavior — only "right for that company."',
            },
            {
              id: "b17",
              type: "paragraph",
              content:
                "Moving between company types (e.g., enterprise to Big Tech) creates cultural mismatch risk. You need to proactively translate your experience so interviewers don't misunderstand it.",
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: The Three Question Types & Decoding Strategy
    {
      title: "The Three Question Types & How to Decode Them",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "The Three Question Types & How to Decode Them",
          blocks: [
            {
              id: "qt1",
              type: "heading",
              content: "The Three Question Types",
              metadata: { level: 2 },
            },
            {
              id: "qt2",
              type: "paragraph",
              content:
                "Interviewers use three different question formats to collect signal. Recognizing which type you face helps you calibrate your response.",
            },
            {
              id: "qt3",
              type: "heading",
              content: '"Tell me about a time..." (Behavioral)',
              metadata: { level: 3 },
            },
            {
              id: "qt4",
              type: "paragraph",
              content:
                "The most common format. Asks for specific past behavior because what you've actually done is the strongest predictor of what you'll do next. The interviewer wants a concrete story with real details — not a hypothetical or generalization. Most of your prep should focus here.",
            },
            {
              id: "qt5",
              type: "heading",
              content: "Hypotheticals",
              metadata: { level: 3 },
            },
            {
              id: "qt6",
              type: "paragraph",
              content:
                'Scenario-based questions you may not have encountered: "What would you do if your manager asked you to cut a critical feature to meet a deadline?" These test your judgment and cultural alignment when past experience is limited. They probe how you think, not just what you\'ve done.',
            },
            {
              id: "qt7",
              type: "heading",
              content: "Values Questions",
              metadata: { level: 3 },
            },
            {
              id: "qt8",
              type: "paragraph",
              content:
                'Philosophical questions like "What does ownership mean to you?" or "How do you define success?" Interviewers use these to understand your mindset and philosophy — looking for alignment between your values and the company\'s culture.',
            },
            {
              id: "qt9",
              type: "heading",
              content: "Why Decoding Matters",
              metadata: { level: 2 },
            },
            {
              id: "qt10",
              type: "paragraph",
              content:
                "Each question is designed to collect signal in one or more signal areas. When you hear \"Tell me about a time you solved a problem that wasn't your responsibility,\" the interviewer is primarily looking for Ownership signal — but they'll also note any Communication, Leadership, or Scope signal you reveal.",
            },
            {
              id: "qt11",
              type: "paragraph",
              content:
                "Decoding means identifying which signal areas a question targets so you can: (1) select the right story from your catalog, (2) emphasize the right details during delivery, and (3) avoid accidentally underselling yourself by focusing on the wrong dimension.",
            },
          ],
          readingTime: 6,
        },
      },
    },

    // Material 3: Signal Area Deep Dives — What Interviewers Actually Look For
    {
      title: "Signal Area Deep Dives — What Interviewers Actually Look For",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Signal Area Deep Dives — What Interviewers Actually Look For",
          blocks: [
            {
              id: "sd1",
              type: "heading",
              content: "Scope",
              metadata: { level: 2 },
            },
            {
              id: "sd2",
              type: "paragraph",
              content:
                'Scope assesses the "size of the box" you operate in. Interviewers ask: does your past impact match the level we\'re hiring for? Behaviors include managing long timescales, delivering business value, handling technical and organizational complexity, and making high-consequence decisions. Scope is communicated through story choice, breadth of actions, timescale, and quality of reflections.',
            },
            {
              id: "sd3",
              type: "quote",
              content:
                "\"Responses that target this signal area are often reasons to downlevel candidates. Using junior-level examples for senior roles immediately signals you don't understand the target position's expectations.\"",
            },
            {
              id: "sd4",
              type: "heading",
              content: "Ownership",
              metadata: { level: 2 },
            },
            {
              id: "sd5",
              type: "paragraph",
              content:
                "Ownership means proactively identifying problems, driving solutions end-to-end, measuring business outcomes, and taking responsibility beyond your immediate role. Strong signal: you noticed the problem, took action, followed through to real user value, and measured whether it worked.",
            },
            {
              id: "sd6",
              type: "quote",
              content:
                "\"Use 'I' more in your stories. 'I talked to the manager' and 'I built the proof of concept' shows you were in the room. 'We solved the problem' erases your ownership signal.\"",
            },
            {
              id: "sd7",
              type: "heading",
              content: "Ambiguity",
              metadata: { level: 2 },
            },
            {
              id: "sd8",
              type: "paragraph",
              content:
                "Ambiguity tolerance correlates directly with seniority and compensation. Key behaviors: breaking vague problems into concrete pieces, making and documenting assumptions, gathering information from multiple sources, starting with partial information, and prioritizing when everything seems important.",
            },
            {
              id: "sd9",
              type: "paragraph",
              content:
                "Two things candidates miss: (1) How they actually created clarity — did you collect data, talk to the right people, rely on past experience? (2) How they validated assumptions — adjusting course and acknowledging uncertainty shows mature judgment.",
            },
            {
              id: "sd10",
              type: "heading",
              content: "Perseverance",
              metadata: { level: 2 },
            },
            {
              id: "sd11",
              type: "paragraph",
              content:
                'What you do when things get hard. Includes pushing through obstacles, trying multiple approaches, maintaining team morale, and adapting strategy while staying focused. Important nuances: knowing when to quit is wisdom (not failure), and martyr stories ("I worked nights and weekends") can read as poor planning.',
            },
            {
              id: "sd12",
              type: "heading",
              content: "Conflict Resolution",
              metadata: { level: 2 },
            },
            {
              id: "sd13",
              type: "paragraph",
              content:
                'Tech companies value direct, healthy conflict. "I\'m not one to create conflicts" is one of the worst opening lines. Key behaviors: initiating difficult conversations, using data to support positions, seeking to understand before advocating, finding compromises, maintaining relationships afterward, and escalating when necessary.',
            },
            {
              id: "sd14",
              type: "paragraph",
              content:
                "Scope of conflict matters: an interpersonal conflict with a peer on your team may be too junior for a Staff interview. Better: conflict with a manager, partner team, or across organizational lines.",
            },
            {
              id: "sd15",
              type: "heading",
              content: "Growth",
              metadata: { level: 2 },
            },
            {
              id: "sd16",
              type: "paragraph",
              content:
                "Growth signal tells interviewers whether you'll improve over time and whether you're coachable. Behaviors: acknowledging mistakes honestly, extracting specific learnings and applying them, seeking feedback, mentoring others, and demonstrating changed behavior. Two failure modes: humble-brag weaknesses (\"I care too much\") and level-inappropriate mistakes.",
            },
            {
              id: "sd17",
              type: "heading",
              content: "Communication",
              metadata: { level: 2 },
            },
            {
              id: "sd18",
              type: "paragraph",
              content:
                'The entire interview is a communication assessment. Beyond that, stories should show adapting style for different audiences, choosing appropriate channels, proactive information sharing, facilitating discussions, and ensuring alignment. Describe the "when" and "how" of communication, not just the "what."',
            },
            {
              id: "sd19",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Weak: "We agreed on the architecture proposal I suggested."',
                  'Strong: "I drafted a proposal and first messaged the tech lead directly since there were sensitive choices around moving to a new database. After incorporating their feedback, I presented in the team meeting so everyone was aligned."',
                ],
              },
            },
            {
              id: "sd20",
              type: "heading",
              content: "Leadership",
              metadata: { level: 2 },
            },
            {
              id: "sd21",
              type: "paragraph",
              content:
                "Leadership matters even for individual contributors. Behaviors include influencing through expertise or vision, building consensus, mentoring, taking ownership of organization-wide improvements, and making decisions that affect others. Senior candidates often forget to mention the leadership threads in their project stories — convincing a manager, helping a junior engineer, running a meeting that unstuck the team.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════════════

    // --- MCQ (8 questions) ---

    // MCQ 1 — easy
    {
      title: "Primary purpose of behavioral interviews",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'What is the primary reason companies conduct behavioral interviews according to the "forecaster" framework?',
        explanation:
          "Behavioral interviewers are forecasters. They use past behavior to predict future behavior in their specific environment. It's not about testing knowledge or verifying resume claims — it's about predicting whether you'll succeed at doing the work the way their company needs it done.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "To predict whether a candidate will exhibit the right behaviors in their specific company environment",
              isCorrect: true,
            },
            {
              id: "b",
              text: "To verify that the candidate's resume is accurate",
              isCorrect: false,
            },
            {
              id: "c",
              text: "To test the candidate's knowledge of software engineering best practices",
              isCorrect: false,
            },
            {
              id: "d",
              text: "To assess the candidate's personality type for team fit",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Relationship between company values and signal areas",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "How do company-specific values (like Amazon's Leadership Principles) typically relate to the eight universal signal areas?",
        explanation:
          'Company values rarely replace the core signal areas. They repackage them with company-specific language and priorities. Amazon\'s "Ownership" maps directly to the Ownership signal area. Google\'s "Focus on the user" connects to Ownership and Communication. Understanding this mapping simplifies preparation significantly.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "They repackage the same underlying signal areas with company-specific language and priorities",
              isCorrect: true,
            },
            {
              id: "b",
              text: "They are completely independent evaluation criteria that require separate preparation",
              isCorrect: false,
            },
            {
              id: "c",
              text: "They replace the signal areas entirely at companies that publish values",
              isCorrect: false,
            },
            {
              id: "d",
              text: "They are only used at Amazon and have no relevance at other companies",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Most common behavioral question format",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Which question format dominates behavioral interviews and should receive the most preparation time?",
        explanation:
          "\"Tell me about a time...\" questions ask for specific past behavior because what you've actually done is the strongest predictor of what you'll do next. They require concrete stories with real details, not hypotheticals or generalizations. This format vastly outnumbers hypotheticals and values questions.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: '"Tell me about a time..." questions that ask for specific past behavior',
              isCorrect: true,
            },
            {
              id: "b",
              text: 'Hypothetical scenario questions ("What would you do if...")',
              isCorrect: false,
            },
            {
              id: "c",
              text: 'Values questions ("What does ownership mean to you?")',
              isCorrect: false,
            },
            {
              id: "d",
              text: "Technical trivia questions embedded in behavioral context",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why scope stories cause downleveling",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A senior engineer (L5) candidate interviewing for a Staff (L6) role tells a story about debugging a tricky production bug over a weekend. The bug was complex and the fix was clever. Why might this story cause a downlevel recommendation?",
        explanation:
          'Scope is about the "size of the box" you operate in. A bug fix, no matter how clever, signals individual contributor work at a senior level — not the multi-team, multi-month, strategically impactful work expected at Staff level. Story choice itself communicates scope. A 2-week sprint vs an 18-month initiative demonstrates different scope. The candidate needed a story showing organizational complexity, strategic decision-making, and broader impact.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The scope of a single bug fix — even a complex one — signals L5 impact, not the multi-team strategic impact expected at L6",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Weekend work shows poor work-life balance, which is a red flag",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Bug fixes are never appropriate stories for behavioral interviews",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The interviewer wanted to hear about a project the candidate initiated, not a reactive fix",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: 'Danger of "value-dropping"',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'A candidate preparing for a Google interview memorizes Google\'s values and inserts phrases like "I always focus on the user" into every answer. What is the most likely interviewer reaction?',
        explanation:
          'This is "value-dropping" — interviewers see through it immediately. They are trained to evaluate underlying behaviors and signal areas, not whether candidates can recite company values. Forced value references feel inauthentic and can actually hurt the candidate by signaling that they are performing rather than genuinely demonstrating competence. Company values should inform story selection and natural language, not be awkwardly inserted.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: 'The interviewer sees through the "value-dropping" as performative — it signals inauthenticity rather than genuine alignment',
              isCorrect: true,
            },
            {
              id: "b",
              text: "The interviewer is impressed by the candidate's preparation and knowledge of company culture",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The interviewer ignores the value references and focuses only on technical depth",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The interviewer appreciates it at Google but would penalize it at Amazon",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: 'What "I" vs "We" language signals',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'A candidate consistently uses "we" language throughout their stories: "We identified the problem," "We built the solution," "We measured the results." What signal does this pattern most likely erode?',
        explanation:
          'Excessive "we" language and passive constructions erases Ownership signal. The interviewer is hiring the candidate, not their team. "I talked to the manager" and "I built the proof of concept" show the candidate was in the room driving outcomes. "We solved the problem" makes it impossible for the interviewer to assess the candidate\'s individual contribution and ownership.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Ownership — the interviewer can't assess the candidate's individual contribution and initiative",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Leadership — it suggests the candidate was not leading the team",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Communication — it shows poor storytelling ability",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Scope — it implies the project was small enough that one person could own it",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Decoding a multi-signal question",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'An interviewer asks: "Tell me about a time you had to convince a skeptical senior leader to invest in a technical initiative that you believed was critical but wasn\'t on the roadmap." Which combination of signal areas is the interviewer PRIMARILY targeting?',
        explanation:
          'This question is a masterful multi-signal probe. "Convince a skeptical senior leader" targets Leadership (influencing without authority) and Communication (adapting style for a senior audience). "Invest in... not on the roadmap" targets Ownership (proactively identifying problems beyond your role). The key word "convince" makes Leadership the primary target. While Scope and Ambiguity may surface in a strong answer, they are secondary signals here.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Leadership (influencing without authority), Ownership (proactive problem identification), and Communication (adapting for senior audience)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Conflict Resolution (disagreement with leadership), Perseverance (pushing through resistance), and Scope (company-wide impact)",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Ambiguity (uncertain outcome), Growth (learning from the experience), and Communication (presentation skills)",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Scope (strategic initiative), Conflict Resolution (navigating disagreement), and Ambiguity (unclear ROI)",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Cultural assessment trap for company switchers",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A candidate from a traditional enterprise company interviews at a Big Tech company. Their conflict resolution story describes escalating a disagreement to their VP, who made the final decision. The story demonstrates genuine conflict and a good outcome. Why might this still result in a negative signal?",
        explanation:
          "Cultural assessment is about pattern-matching against what success looks like at the target company. In Big Tech, engineers are expected to resolve conflicts directly — escalating to a VP rather than resolving peer-to-peer signals deference to hierarchy, which is a cultural mismatch. The candidate needs to proactively translate their experience: framing the escalation as appropriate given enterprise culture while demonstrating they understand and can operate in a more autonomous, flat-hierarchy environment.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Escalating to a VP signals deference to hierarchy — a cultural mismatch for Big Tech where direct peer resolution is expected",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The story involves too many people, making it hard for the interviewer to track",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Big Tech companies don't consider conflict resolution an important signal area",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Enterprise experience is always viewed negatively at Big Tech companies",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "The eight signal areas",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL that are among the eight standardized signal areas that behavioral interviewers assess:",
        explanation:
          'The eight signal areas are: Scope, Ownership, Ambiguity, Perseverance, Conflict Resolution, Growth, Communication, and Leadership. "Technical Depth" is assessed in coding and system design rounds, not behavioral. "Speed of Execution" is not a standalone signal area — it may surface as part of Ownership or Perseverance.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Scope",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Ownership",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Conflict Resolution",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Growth",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Technical Depth",
              isCorrect: false,
            },
            {
              id: "f",
              text: "Speed of Execution",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Strong ownership behaviors in stories",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL behaviors that demonstrate strong Ownership signal in a behavioral interview story:",
        explanation:
          "Strong Ownership signal includes proactively identifying problems without being asked, driving solutions end-to-end (not just flagging), measuring business outcomes (not just task completion), and taking responsibility beyond your immediate role. Delegating to the team (even if appropriate in practice) and waiting for clear direction are anti-patterns for Ownership signal.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Proactively identifying a problem without being asked",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Driving a solution end-to-end rather than just flagging the issue",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Measuring and tracking business outcomes after the solution shipped",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Taking responsibility for results beyond your immediate role",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Delegating the problem to the appropriate team and following up later",
              isCorrect: false,
            },
            {
              id: "f",
              text: "Waiting for clear direction from your manager before taking action",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Dimensions that communicate scope",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL dimensions through which Scope signal is communicated in a behavioral interview story:",
        explanation:
          "Scope is communicated through: story choice itself (bug fix vs company-wide refactor), breadth of actions (just technical work vs planning/communication/stakeholder management), timescale (2-week sprint vs 18-month initiative), and quality of reflections (what you learned signals engagement depth). Lines of code and number of technologies are implementation details, not scope indicators.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Story choice — a company-wide refactor vs a bug fix signals different scope",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Breadth of actions — handling planning, communication, and stakeholders vs just technical work",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Timescale — an 18-month initiative vs a 2-week sprint demonstrates different complexity",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Quality of reflections — depth of learnings signals how deeply you engaged",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Lines of code changed — more code indicates larger scope",
              isCorrect: false,
            },
            {
              id: "f",
              text: "Number of technologies used — more tools indicates higher scope",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Failure modes in growth signal",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          'An interviewer asks "Tell me about a mistake you made." Select ALL responses that represent common failure modes candidates should avoid:',
        explanation:
          "\"I care too much\" is a humble-brag weakness — it's not a real failure if you don't describe actual downsides. A mistake that should have been obvious at your level raises doubts about maturity. Blaming external factors entirely avoids the honest acknowledgment that strong Growth signal requires. In contrast, describing a genuine mistake with specific learnings (even if they are uncomfortable) and taking ownership of a failure (even if others contributed) are exactly what strong Growth signal looks like.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: '"My biggest weakness is that I care too much about code quality" — without describing actual negative consequences',
              isCorrect: true,
            },
            {
              id: "b",
              text: "Describing a mistake that would be obviously avoidable at the candidate's experience level",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Attributing the failure entirely to external factors (the team, the timeline, the tools)",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Describing a genuine technical mistake and explaining specific process changes made afterward",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Taking ownership of a failure even when other team members also contributed to it",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: 'Decode a "Tell me about a time" question',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'An interviewer asks: "Tell me about a time you had to work with unclear requirements." Decode this question: what signal areas is the interviewer targeting? What specific behaviors will they look for in your answer? What are two things most candidates miss?',
        explanation:
          "A strong answer identifies Ambiguity as the primary signal area, lists specific target behaviors (breaking problems down, making assumptions, gathering info, starting without full clarity), and names the two commonly missed elements: how you created clarity and how you validated assumptions.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "This question primarily targets the Ambiguity signal area — the interviewer wants to assess your tolerance for uncertainty and your process for creating order from chaos.\n\nSpecific behaviors they will look for:\n- Breaking a large, vague problem into concrete, actionable pieces\n- Making reasonable assumptions and documenting them\n- Gathering information from multiple sources to reduce uncertainty\n- Starting work with partial information rather than waiting for complete clarity\n- Prioritizing effectively when everything seems important\n\nTwo things most candidates miss:\n1. How they actually created clarity — candidates describe the ambiguous situation and the final outcome but skip the critical middle: did you collect data? Talk to the right people? Rely on past experience? The interviewer wants to know your specific process for turning chaos into order.\n2. How they validated their assumptions — following up when things were wrong, adjusting course, and acknowledging uncertainty shows mature judgment. Most candidates present their initial assumptions as if they were always correct.",
          minLength: 120,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Translate enterprise experience for Big Tech",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "You spent 5 years at a traditional enterprise company and are interviewing at a Big Tech company. Using the cultural assessment framework, explain what cultural mismatches might arise in your behavioral answers and how you would proactively address them.",
        explanation:
          "A strong answer identifies specific cultural differences (hierarchy vs flat, process-heavy vs move-fast, consensus vs autonomy) and describes concrete translation strategies — not hiding enterprise experience, but framing it in terms Big Tech interviewers value.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Cultural assessment is about pattern-matching against successful engineers at the target company. Moving from enterprise to Big Tech creates several potential mismatches:\n\n1. Authority and hierarchy: Enterprise stories may involve decisions escalated to VPs or formal approval chains. Big Tech values direct resolution and autonomous decision-making. Translation: acknowledge the enterprise context but emphasize moments where I acted independently or influenced upward rather than waiting for direction.\n\n2. Speed vs. quality: Enterprise culture often prioritizes process compliance and thorough documentation. Big Tech (especially Meta) values speed and iteration. Translation: highlight moments where I chose pragmatic solutions over perfect ones, or pushed to ship faster despite organizational inertia.\n\n3. Impact measurement: Enterprise may measure success through project completion or customer satisfaction surveys. Big Tech wants quantified business metrics. Translation: frame outcomes in terms of measurable impact — revenue, latency reduction, user engagement.\n\n4. Scope of initiative: Enterprise culture may expect proposals to go through formal channels. Translation: show examples of grassroots initiatives or skunkworks projects that demonstrate the ownership and self-direction Big Tech expects.\n\nThe key is not to hide enterprise experience but to proactively translate it — showing awareness that different environments require different behaviors and demonstrating readiness to operate in the target culture.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Map company values to signal areas",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You are preparing for an Amazon interview. Map the following three Leadership Principles to their underlying signal areas: (1) "Customer Obsession," (2) "Bias for Action," and (3) "Have Backbone; Disagree and Commit." For each, explain what behaviors the interviewer is really looking for and how knowing the underlying signal area helps you prepare.',
        explanation:
          "A staff-level answer demonstrates deep understanding of how company-specific language maps to universal behavioral patterns, identifies the underlying signal areas correctly, and explains how this mapping simplifies preparation by allowing reuse of stories across companies.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            '1. "Customer Obsession" → Ownership + Communication\nAmazon frames this as starting with the customer and working backward. The underlying signals are Ownership (proactively identifying customer pain points and driving solutions without being asked) and Communication (gathering customer feedback and translating technical decisions into user value). The interviewer wants stories where you noticed something wasn\'t right for the customer and took action — not where you were assigned customer work.\n\nPreparing with signal areas: My Ownership stories where I identified user-facing problems and measured outcomes can be adapted by using Amazon\'s "customer" language naturally.\n\n2. "Bias for Action" → Ambiguity + Perseverance\nThis principle is about making decisions with incomplete information — a direct mapping to Ambiguity tolerance. It also maps to Perseverance in the sense of not being paralyzed by analysis. The interviewer wants to see that you started work with partial information rather than waiting for complete clarity, that you made reasonable assumptions, and that you adjusted course as you learned more.\n\nPreparing with signal areas: Any story about navigating unclear requirements or tight timelines where I made assumptions and acted works here — just frame it with Amazon\'s "speed matters" language.\n\n3. "Have Backbone; Disagree and Commit" → Conflict Resolution + Leadership\nThis maps directly to Conflict Resolution (initiating difficult conversations, using data to support your position) with a strong Leadership component (influencing without authority). The "commit" part is uniquely Amazon — once a decision is made, you execute fully even if you disagreed. The interviewer wants stories showing direct disagreement backed by data, followed by wholehearted commitment to the chosen direction.\n\nPreparing with signal areas: My conflict stories need to emphasize the "commit" ending — I didn\'t just disagree, I also executed the final decision with full ownership. This is where understanding Amazon\'s specific emphasis adds value beyond generic conflict prep.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Build a multi-signal story",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "The strongest behavioral stories touch multiple signal areas simultaneously. Describe a real or hypothetical project story that naturally demonstrates at least four signal areas. For each signal area, identify the specific moment in the story that generates that signal.",
        explanation:
          "A staff-level answer creates a coherent narrative — not a checklist — where different signal areas emerge naturally at different points. The best answers show awareness of how a single story can be told differently depending on which signal area the question targets.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Story: Leading a cross-team migration from a monolithic auth system to a microservice-based identity platform.\n\nOwnership (moment: identifying the problem): I noticed increasing auth-related incidents — 3 outages in 2 months — and realized they all traced to the monolith\'s session management. This wasn\'t my team\'s responsibility, but I wrote a proposal for a migration after analyzing the incident patterns. "I noticed the problem and took action without being asked."\n\nLeadership (moment: building buy-in): The platform team was skeptical because they\'d considered this migration before and rejected it. I scheduled 1:1s with their tech lead and manager, presented incident data alongside a phased migration plan that minimized their team\'s burden, and offered to own the first phase myself. I also mentored a junior engineer on my team through the session management redesign. "I influenced without authority and developed others."\n\nAmbiguity (moment: navigating unknowns): The migration had no precedent at the company. I couldn\'t predict which services would break during the transition. I created a risk matrix, ran a shadow mode for 2 weeks comparing old and new auth responses, and made documented assumptions about backward compatibility that I validated incrementally. "I created clarity from uncertainty and validated assumptions along the way."\n\nCommunication (moment: coordinating the rollout): I adapted my communication for different audiences — technical RFC for engineers, executive summary with business impact for the VP, and a Slack channel with daily migration status updates for dependent teams. When the platform team misunderstood the backward compatibility guarantee, I caught it in a sync meeting and clarified immediately. "I chose the right channel and message for each audience."\n\nScope (demonstrated throughout): This was an 8-month initiative spanning 3 teams, affecting every service that touched authentication. The business impact was measurable: auth-related incidents dropped to zero in the 6 months after completion.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Conflict story scope and level matching",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You\'re interviewing for a Staff Engineer role. Explain why a conflict story about a disagreement with a peer on your own team might result in a "downlevel" signal, and describe what kind of conflict story would be more appropriate for the Staff level. Include specific characteristics that differentiate an L5-appropriate conflict from an L6-appropriate one.',
        explanation:
          "A staff-level answer demonstrates understanding that conflict resolution stories must match the target level's expected scope. It contrasts the dimensions (relationship scope, organizational impact, stakes, resolution complexity) between levels and provides concrete examples.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "A peer conflict on your own team is an L5-appropriate story because it involves:\n- Limited organizational scope (one team)\n- Direct relationship where you have daily rapport\n- Lower stakes (internal team decision, easily reversible)\n- Resolution through direct conversation — which is expected at any level\n\nFor a Staff (L6) interview, the conflict story needs to demonstrate scope matching the level's expected operating sphere:\n\nL6-appropriate conflict characteristics:\n- Cross-organizational scope: conflict with a partner team's lead, a product manager from a different org, or your own manager/director\n- Higher stakes: architectural decisions affecting multiple teams, resource allocation conflicts, priority disagreements that impact business goals\n- Power dynamics: influencing without authority when the other party has organizational leverage over you\n- Complex resolution: not just \"we talked it through\" but navigating politics, finding creative compromises, or knowing when to disagree and commit\n- Lasting impact: the resolution set a precedent, established a process, or changed how teams collaborate\n\nExample L6 conflict: You disagreed with the platform team's tech lead about whether to build a shared service or let each team build their own. You were advocating for the shared approach based on maintenance cost data, while they wanted team autonomy. You presented data to both VPs, facilitated a design review with all stakeholders, and ultimately the decision went the other way — but you committed fully and even helped optimize the per-team approach.\n\nThe key difference: an L5 conflict resolves within your comfort zone; an L6 conflict forces you to navigate organizational complexity and power dynamics while maintaining professional relationships.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Decode and prepare for a hypothetical question",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'An interviewer asks: "Your team just shipped a feature that\'s getting negative user feedback, but your manager wants to move on to the next sprint. What do you do?" Decode this question: identify the signal areas being tested, explain what the interviewer is looking for, describe how this differs from a "Tell me about a time..." question, and outline a strong response strategy.',
        explanation:
          "A staff-level answer recognizes this as a hypothetical that tests Ownership (user advocacy vs moving on), Conflict Resolution (disagreeing with manager), and Communication (how to frame the conversation). It explains that hypotheticals probe judgment rather than experience, and the response should still be grounded in concrete reasoning.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Signal areas being tested:\n1. Ownership — Will you take responsibility for the user experience or just move to the next task? Do you measure success or just ship?\n2. Conflict Resolution — Can you respectfully disagree with your manager using data rather than just complying?\n3. Communication — How do you frame the conversation with your manager? Do you come with data and a proposal, or just a complaint?\n\nWhat the interviewer is looking for:\nThey want to see your judgment process — not just "I\'d fix the bug" but HOW you\'d navigate the tension between user needs and sprint commitments. A strong answer shows you can:\n- Quantify the negative feedback (is it 5 users or 500?)\n- Assess severity (annoying UX vs data loss?)\n- Propose a balanced solution (not "drop everything" or "ignore it")\n- Frame it to your manager in terms of business impact\n\nHow this differs from "Tell me about a time...":\nHypothetical questions test judgment and cultural alignment when past experience may be insufficient. The interviewer can\'t verify your answer — there\'s no "did this actually happen?" — so they\'re evaluating your reasoning process, not your experience. You should still be concrete ("I would pull up the feedback data, categorize the issues by severity, and...") rather than abstract ("I think it\'s important to listen to users").\n\nStrong response strategy:\n1. Acknowledge the manager\'s perspective — sprint commitments matter.\n2. Gather data — pull user feedback, categorize severity, estimate impact on retention or support tickets.\n3. Propose a tradeoff — "Can we spend 2 days on the critical issues and defer cosmetic fixes to next sprint?"\n4. Escalate appropriately if needed — if the manager refuses and the issue is serious, describe how you would escalate with data, not emotion.\n5. Demonstrate ownership by offering to handle the fix personally to minimize impact on the team\'s sprint velocity.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Name the behavioral interview cycle",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What are the three steps of the Behavioral Interview Cycle, in order? (Separate with commas)",
        explanation:
          "The Behavioral Interview Cycle is Decode → Select → Deliver. First you decode what the question is really asking (identify target signal areas), then you select the right story from your catalog, then you deliver it effectively. Most candidates skip straight to delivery without properly decoding or selecting.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Decode, Select, Deliver",
          acceptableAnswers: [
            "Decode, Select, Deliver",
            "decode, select, deliver",
            "Decode Select Deliver",
            "decode select deliver",
            "Decode → Select → Deliver",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Anti-pattern for conflict resolution opening",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'According to the source material, what is described as "one of the worst ways" to start an answer about conflict resolution?',
        explanation:
          '"I\'m not one to create conflicts" signals conflict avoidance, which is the opposite of what tech companies want. They value direct, healthy conflict — the ability to initiate difficult conversations, support your position with data, and resolve disagreements professionally. Starting with this phrase immediately tells the interviewer you avoid confrontation.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "I'm not one to create conflicts",
          acceptableAnswers: [
            "I'm not one to create conflicts",
            "I'm not one to create conflict",
            "not one to create conflicts",
            "I don't create conflicts",
            "I'm not someone who creates conflicts",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Signal area most correlated with seniority",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'Which signal area is described as correlating "directly with seniority and compensation" — meaning the more of it you demonstrate, the more valuable and senior you appear?',
        explanation:
          'Ambiguity tolerance correlates directly with seniority and compensation. Higher-level work involves more people, more pressure, and higher stakes — all of which create uncertainty. The more ambiguous the situation you can navigate, the more valuable you are. This is why "Tell me about a time with unclear requirements" questions are so common and so important to nail.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Ambiguity",
          acceptableAnswers: [
            "Ambiguity",
            "ambiguity",
            "Ambiguity tolerance",
            "ambiguity tolerance",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Name the anti-pattern for company values",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "What term is used to describe the anti-pattern where candidates awkwardly insert company value references into every behavioral answer?",
        explanation:
          '"Value-dropping" is the term used for candidates who memorize company values and force them into every response. Interviewers see through it immediately because it feels performative rather than genuine. Company values should inform story selection and natural language, not be awkwardly inserted as buzzwords.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "value-dropping",
          acceptableAnswers: [
            "value-dropping",
            "Value-dropping",
            "value dropping",
            "Value dropping",
          ],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match question type to its purpose",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content:
          "Match each behavioral question type to what the interviewer is primarily assessing:",
        explanation:
          '"Tell me about a time..." questions use past behavior to predict future behavior — the strongest predictor available. Hypotheticals test judgment and cultural alignment when direct experience is limited. Values questions probe mindset and philosophical alignment with company culture.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: '"Tell me about a time..."',
              right: "Past behavior as predictor of future behavior",
            },
            {
              id: "p2",
              left: "Hypothetical scenarios",
              right: "Judgment and cultural alignment without direct experience",
            },
            {
              id: "p3",
              left: "Values questions",
              right: "Mindset and philosophical alignment with company culture",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match signal area to its characteristic question",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each signal area to the behavioral question that most directly targets it:",
        explanation:
          '"Most impactful project" directly probes Scope — the size and significance of your work. "Problem not your responsibility" directly probes Ownership — going beyond your role. "Unclear requirements" directly probes Ambiguity tolerance. "Influenced without authority" directly probes Leadership — driving outcomes without positional power.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Scope",
              right: '"Tell me about your most impactful project"',
            },
            {
              id: "p2",
              left: "Ownership",
              right: '"Tell me about a time you solved a problem that wasn\'t your responsibility"',
            },
            {
              id: "p3",
              left: "Ambiguity",
              right: '"Describe a time when you had to work with unclear requirements"',
            },
            {
              id: "p4",
              left: "Leadership",
              right: '"Tell me about a time you influenced without authority"',
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match company value to underlying signal areas",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each company value to the underlying signal areas it primarily maps to:",
        explanation:
          'Amazon\'s "Ownership" is a direct mapping to the Ownership signal area. Google\'s "Focus on the user" connects to Ownership (proactive user advocacy) and Communication (translating technical decisions into user value). Meta\'s "Move Fast" relates to Ownership (bias for action) and Perseverance (not being paralyzed by obstacles). OpenAI\'s "Creativity over control" is a blend of Ownership (taking initiative) and Perseverance (creative problem-solving).',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: 'Amazon\'s "Ownership"',
              right: "Ownership (direct mapping)",
            },
            {
              id: "p2",
              left: 'Google\'s "Focus on the user"',
              right: "Ownership + Communication",
            },
            {
              id: "p3",
              left: 'Meta\'s "Move Fast"',
              right: "Ownership + Perseverance",
            },
            {
              id: "p4",
              left: 'OpenAI\'s "Creativity over control"',
              right: "Ownership + Perseverance (creative solution finding)",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "The behavioral interview cycle",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The Behavioral Interview Cycle is: _____, Select, Deliver. Before you can pick the right story, you must first understand what's actually being asked.",
        explanation:
          "The first step is Decode — understanding what the interviewer is really asking by identifying which signal areas, company values, and cultural signals the question targets. Without decoding first, candidates select inappropriate stories and deliver irrelevant details.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The Behavioral Interview Cycle is: {{blank1}}, Select, Deliver. Before you can pick the right story, you must first understand what's actually being asked.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Decode",
              acceptableAnswers: ["Decode", "decode", "DECODE"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Behavioral interviewers as forecasters",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Behavioral interviewers are _____. They use past behavior to predict whether you'll succeed at doing the work the way their company needs it done.",
        explanation:
          'The term "forecasters" captures the essence of behavioral interviewing — interviewers are predicting future performance based on past behavioral evidence. This framing helps candidates understand that behavioral interviews are not tests of personality or trivia, but evidence-based forecasting of on-the-job behavior.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Behavioral interviewers are {{blank1}}. They use past behavior to predict whether you'll succeed at doing the work the way their company needs it done.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "forecasters",
              acceptableAnswers: ["forecasters", "Forecasters", "FORECASTERS"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Pronoun usage in ownership stories",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          'To demonstrate strong Ownership signal, candidates should use "_____" more in their stories rather than "we" or passive constructions, because the interviewer is hiring the individual, not their previous team.',
        explanation:
          'Using "I" language — "I talked to the manager," "I built the proof of concept" — demonstrates individual ownership and shows the candidate was personally driving outcomes. "We" language and passive constructions like "the experiment was performed" erase ownership signal because the interviewer cannot determine the candidate\'s individual contribution.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            'To demonstrate strong Ownership signal, candidates should use "{{blank1}}" more in their stories rather than "we" or passive constructions, because the interviewer is hiring the individual, not their previous team.',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "I",
              acceptableAnswers: ["I", "i"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
