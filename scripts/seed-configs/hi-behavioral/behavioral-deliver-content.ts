/**
 * Behavioral — Deliver: Telling a Good Story
 * Based on HelloInterview extract
 * Covers: CARL framework, story structure, delivery techniques, pacing, specificity, follow-up prep
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const behavioralDeliverContent: StoryPointSeed = {
  title: "Deliver: Telling a Good Story",
  description:
    "Master the CARL framework and the art of delivering compelling, signal-rich stories in behavioral interviews — including structure, pacing, detail calibration, audience adaptation, and follow-up preparation.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: The CARL Framework & Story Structure
    {
      title: "The CARL Framework — Structuring Behavioral Stories",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "The CARL Framework — Structuring Behavioral Stories",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Why Stories Matter in Interviews",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "Our brains are hardwired for stories. When we hear a story, specialized brain regions perform mental time travel, trigger empathy, and run simulations. Unlike a list of accomplishments, stories capture attention, slip past critical defenses, and are easy to remember long after the interview ends. This makes stories potent tools for demonstrating your capabilities.",
            },
            {
              id: "b3",
              type: "heading",
              content: "STAR vs CARL",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                "The STAR method (Situation, Task, Actions, Results) is widely taught but has drawbacks for senior candidates. Situation and Task often blur together, causing wasted prep time. More critically, STAR omits reflection — there is no explicit place for what you learned. For senior roles, learnings demonstrate scope, self-awareness, and growth.",
            },
            {
              id: "b5",
              type: "heading",
              content: "The CARL Framework",
              metadata: { level: 2 },
            },
            {
              id: "b6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Context: The overall situation, including how you were involved. Combines STAR's Situation and Task into one flexible section. Keep it to 30-45 seconds.",
                  "Actions: The concrete steps you took — what you did, how you did it, and why you chose that approach. This is the centerpiece where behavioral signal lives.",
                  "Results: The outcome of your actions — what changed, what impact you made on the business. Quantify when possible.",
                  "Learnings: What you learned or reflections on choices made. Like Aesop's fables ending with a moral — demonstrates depth of wisdom and self-awareness.",
                ],
              },
            },
            {
              id: "b7",
              type: "heading",
              content: "Context Best Practices",
              metadata: { level: 3 },
            },
            {
              id: "b8",
              type: "paragraph",
              content:
                'Include company context, the problem or opportunity, and the stakes. Stakes matter enormously — compare "I worked on a performance project" (weak) vs "Our checkout flow had a 40% abandonment rate, costing us an estimated $2M per quarter" (strong). Keep context to 30-45 seconds maximum.',
            },
            {
              id: "b9",
              type: "heading",
              content: "Context Mistakes to Avoid",
              metadata: { level: 3 },
            },
            {
              id: "b10",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'The project history lesson: Don\'t narrate the full timeline ("built in 2018, refactored in 2019, reorged in 2020..."). Start where you started.',
                  "Unnecessary org chart details: Skip reporting structures unless directly relevant to your actions.",
                  "Explaining well-known technology: Don't define Kubernetes at a tech company interview. Assume technical literacy.",
                ],
              },
            },
            {
              id: "b11",
              type: "heading",
              content: "Actions — Where Signal Lives",
              metadata: { level: 3 },
            },
            {
              id: "b12",
              type: "paragraph",
              content:
                'Use "I" statements consistently — not "we decided" but "I proposed and the team agreed." Include both technical and non-technical actions: scoping, stakeholder communication, mentoring, conflict resolution. Be specific: not "I talked to stakeholders" but "I scheduled weekly syncs with the PM and wrote a one-pager for the director." Show repeatable behaviors that prove you would succeed again in similar circumstances.',
            },
            {
              id: "b13",
              type: "heading",
              content: "Results — Prove Your Actions Mattered",
              metadata: { level: 3 },
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                'Think across dimensions: business impact (revenue, cost savings), user impact (satisfaction, reduced friction), and team impact (velocity, reduced on-call burden). Quantify when possible — "Reduced p99 latency by 85%, from 800ms to 120ms" beats "Improved performance." When metrics aren\'t available, compare before/after states, use qualitative feedback, reference time/effort savings, or describe what became possible.',
            },
            {
              id: "b15",
              type: "heading",
              content: "Learnings — Show Growth",
              metadata: { level: 3 },
            },
            {
              id: "b16",
              type: "paragraph",
              content:
                'Go beyond the generic ("communication is important"). Be specific: "When working with a remote team, I need to over-document decisions because hallway conversations don\'t happen." Be honest about mistakes: "I should have pushed back on scope earlier — I knew we couldn\'t hit the deadline, but I didn\'t want to say no." If you describe everything as perfect with no room for improvement, that\'s a red flag.',
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 2: Delivery Techniques — Detail, Pacing, Adaptation
    {
      title: "Delivery Techniques — Detail, Pacing & Audience Adaptation",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Delivery Techniques — Detail, Pacing & Audience Adaptation",
          blocks: [
            {
              id: "dt1",
              type: "heading",
              content: "The Value of Detail in Actions",
              metadata: { level: 2 },
            },
            {
              id: "dt2",
              type: "paragraph",
              content:
                "The appropriate level of detail depends on your role, audience, the question, and where you are in the conversation. Use detail to (1) make the story understandable and (2) establish credibility. Once credibility is established, additional details waste precious time. If you haven't moved on to your next action after about 30 seconds, you're probably going too deep on that point.",
            },
            {
              id: "dt3",
              type: "heading",
              content: "What to Include in Actions",
              metadata: { level: 3 },
            },
            {
              id: "dt4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'The alternatives you considered: "I evaluated three approaches: microservices, a modular monolith, or refactoring our existing monolith..."',
                  'Your reasoning: "I chose the modular monolith because our team of 8 couldn\'t support 15 microservices..."',
                  'Specific technical decisions: "I implemented a hexagonal architecture pattern with clear boundaries..."',
                  'How you navigated challenges: "When the VP questioned the timeline, I created a phased rollout plan..."',
                  'Collaboration and influence: "I paired with our Principal Engineer to validate the approach..."',
                ],
              },
            },
            {
              id: "dt5",
              type: "heading",
              content: "Categories of Actions",
              metadata: { level: 3 },
            },
            {
              id: "dt6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Designing: product/architectural decisions, alternatives considered",
                  "Aligning: building consensus, stakeholder management, negotiation",
                  "Communicating: documentation, presentations, difficult conversations",
                  "Implementing: technical execution, resource allocation, risk mitigation",
                  "Iterating: feedback loops, measurement, course corrections",
                  "Testing & Debugging: QA processes, problem diagnosis, optimization",
                  "Releasing: deployment strategies, monitoring, post-launch support",
                  "Thinking & Deciding: cognitive work, analysis, strategic choices",
                ],
              },
            },
            {
              id: "dt7",
              type: "heading",
              content: "Adapting to the Question",
              metadata: { level: 2 },
            },
            {
              id: "dt8",
              type: "paragraph",
              content:
                "Think of your stories like Hollywood trailers for the same movie. The same story can answer multiple questions by foregrounding different parts. A chatbot project could demonstrate Perseverance (learning ML from scratch, reverse-engineering legacy systems), Ownership (self-initiated project, pitched the solution), Communication (stakeholder meetings, data-driven buy-in), or Influence Without Authority (negotiating a pilot with a skeptical director). Emphasize the requested signal early, then mention other signals as footnotes for follow-up.",
            },
            {
              id: "dt9",
              type: "heading",
              content: "Adapting to the Audience",
              metadata: { level: 2 },
            },
            {
              id: "dt10",
              type: "paragraph",
              content:
                'Read the room in real time. Watch for signs you\'re losing them: eyes glazing over, no follow-up questions on technical details, looking like they want to speak, stopping note-taking, frequent "yeah" or "hmm" (sounds like active listening but in interviews signals they want to move on). If you see these signs, you\'ve gone too deep — adjust. Talk architecture with backend engineers, decisions and trade-offs with hiring managers.',
            },
            {
              id: "dt11",
              type: "heading",
              content: "Telling Complex Stories",
              metadata: { level: 2 },
            },
            {
              id: "dt12",
              type: "paragraph",
              content:
                'For long stories (multi-month projects, staff-level deep dives), provide a "Table of Contents" after your Context. Example: "This project happened in three phases: getting alignment, technical implementation, and rollout. Let me walk through each." This helps the interviewer track your narrative, signals organized thinking (a senior-level skill itself), and keeps you on track.',
            },
            {
              id: "dt13",
              type: "quote",
              content:
                "\"Include takeaways for your themes, not just topics. Compare 'Technical design' versus 'Working with the TL to design around complex constraints.' The second one is much more informative and gives the interviewer a reason to hire you.\"",
            },
            {
              id: "dt14",
              type: "heading",
              content: "Front-Loading Results in Long Stories",
              metadata: { level: 3 },
            },
            {
              id: "dt15",
              type: "paragraph",
              content:
                'If a story is sufficiently long, you may never get to the Results before the interviewer takes you down follow-up rabbit holes. Consider stating the Results and even a condensed Learnings right at the top: "I saw an opportunity to build an AI chatbot... we reduced resolution time by 35% after 3 months of effort." This anchors the so-what immediately.',
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Follow-Up Questions & Story Examples
    {
      title: "Preparing for Follow-Up Questions & Level-Calibrated Examples",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Preparing for Follow-Up Questions & Level-Calibrated Examples",
          blocks: [
            {
              id: "fu1",
              type: "heading",
              content: "Common Follow-Up Question Categories",
              metadata: { level: 2 },
            },
            {
              id: "fu2",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'About the Challenge: "What was the hardest part?" "What constraints were you under?"',
                  'About Your Role: "What were your specific contributions?" "How much was your idea vs assigned?"',
                  'About Decisions: "How did you make that decision?" "What alternatives did you consider?"',
                  'About Results: "How did you measure success?" "What was the long-term impact?" "What would you do differently?"',
                  'About Relationships: "How did others respond?" "What feedback did you receive?"',
                ],
              },
            },
            {
              id: "fu3",
              type: "heading",
              content: "The Four Must-Prepare Follow-Ups",
              metadata: { level: 3 },
            },
            {
              id: "fu4",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  '"What would you do differently?" — Tests depth of understanding and mistake awareness. CARL\'s Learnings section prepares you for this.',
                  '"What was the hardest part?" — Gets at technical depth. Be ready with a specific understanding of challenges overcome.',
                  '"How did you measure success?" — Even if you mentioned results, be ready to describe how you established measurable goals.',
                  '"What happened after?" — Did the project have lasting impact? Is it still running? Were there follow-ups?',
                ],
              },
            },
            {
              id: "fu5",
              type: "heading",
              content: "Story Examples by Level",
              metadata: { level: 2 },
            },
            {
              id: "fu6",
              type: "heading",
              content: "Junior Engineer Pattern",
              metadata: { level: 3 },
            },
            {
              id: "fu7",
              type: "paragraph",
              content:
                "Focus on: individual technical problem-solving, debugging methodology, documentation. Example signal: \"I volunteered to take a fresh look at intermittent 500 errors. Correlated timestamps with deploy logs, added targeted logging, SSH'd into a specific server, found a deploy script bug. Result: zero incidents over the next month. Learning: widen debugging scope early — don't assume the obvious explanation.\"",
            },
            {
              id: "fu8",
              type: "heading",
              content: "Senior Engineer (L5) Pattern",
              metadata: { level: 3 },
            },
            {
              id: "fu9",
              type: "paragraph",
              content:
                'Focus on: cross-team coordination, initiative ownership, influence without authority. Example signal: "I proposed a cross-team performance initiative, profiled the startup path myself, created a breakdown, scheduled 1:1s with five tech leads. For teams without bandwidth, I offered to write PRs myself. Result: 60% cold start improvement, 15% drop in first-session uninstalls. Learning: meet people where they are — offering to do the work turns blockers into collaborators."',
            },
            {
              id: "fu10",
              type: "heading",
              content: "Staff Engineer Pattern",
              metadata: { level: 3 },
            },
            {
              id: "fu11",
              type: "paragraph",
              content:
                'Focus on: organizational influence, technical strategy, multi-audience communication, making change safe. Example signal: "I mapped six teams\' data pipelines, wrote an RFC for consolidation with a backward-compatible adapter layer. Different conversations for different audiences: maintenance costs for eng leadership, cross-product analytics for product, backward compatibility for individual teams. Result: 40% maintenance reduction, first cross-product dashboard in 3 months. Learning: the adapter layer was the key to political viability — make change feel safe."',
            },
            {
              id: "fu12",
              type: "heading",
              content: "Timing Your Stories",
              metadata: { level: 2 },
            },
            {
              id: "fu13",
              type: "paragraph",
              content:
                "Target 2-4 minutes for a complete CARL story told aloud. If you're going over, you're probably including too much context or too many action details. Practice timing yourself. For each core story, write out the full CARL structure and prepare responses to the four must-prepare follow-up questions.",
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
      title: "CARL vs STAR — key addition",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the primary advantage of the CARL framework over STAR for senior-level behavioral interviews?",
        explanation:
          "CARL adds an explicit Learnings component that STAR lacks. For senior candidates, demonstrating what you learned from an experience shows self-awareness, growth mindset, and the ability to extract reusable wisdom — all qualities interviewers evaluate at the senior+ level. CARL also combines Situation and Task into a single flexible Context, but the Learnings addition is the primary advantage.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "CARL includes an explicit Learnings component that demonstrates self-awareness and growth",
              isCorrect: true,
            },
            {
              id: "b",
              text: "CARL requires longer stories to demonstrate thoroughness",
              isCorrect: false,
            },
            {
              id: "c",
              text: "CARL eliminates the need for quantified results",
              isCorrect: false,
            },
            {
              id: "d",
              text: "CARL focuses exclusively on technical actions",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Ideal context length",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "How long should the Context section of a CARL story typically last when told aloud?",
        explanation:
          "The Context should be kept to 30-45 seconds — just enough to orient the interviewer on the situation, your involvement, and the stakes. Many candidates spend 1-3 minutes on background before getting to their actions, at which point the interviewer has checked out. The Context exists to make the Actions comprehensible, not to tell the full project history.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "30-45 seconds",
              isCorrect: true,
            },
            {
              id: "b",
              text: "2-3 minutes",
              isCorrect: false,
            },
            {
              id: "c",
              text: "5-10 seconds",
              isCorrect: false,
            },
            {
              id: "d",
              text: "As long as needed to fully explain the project history",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: 'Using "I" vs "we" statements',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'In the Actions section of a behavioral response, why should you use "I" statements instead of "we" statements?',
        explanation:
          'Interviewers need to evaluate YOUR specific contributions. "We decided" obscures who actually drove the decision. "I proposed and the team agreed" or "I convinced my tech lead to..." makes your individual contribution clear. You can acknowledge others\' contributions without removing all agency on your part — teams are built of individual actors.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "To make your specific individual contributions clear so the interviewer can evaluate your impact",
              isCorrect: true,
            },
            {
              id: "b",
              text: "To signal that you prefer working alone",
              isCorrect: false,
            },
            {
              id: "c",
              text: "To take credit for the entire team's work",
              isCorrect: false,
            },
            {
              id: "d",
              text: "To keep the story shorter by avoiding mentions of teammates",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "When to front-load results",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A candidate is preparing a CARL story about a 6-month infrastructure migration. They're worried the interviewer will derail into follow-ups before they reach the Results. What is the best strategy?",
        explanation:
          'For sufficiently long stories, front-loading results immediately after Context ensures the interviewer hears the impact even if the conversation gets derailed by follow-up questions. This anchors the "so-what" immediately and gives the interviewer the frame they need to understand why your actions mattered. The full CARL structure is still maintained, but the Results preview creates a stronger narrative hook.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Front-load the Results right after Context — state the outcome and condensed learnings at the top to anchor the "so-what" immediately',
              isCorrect: true,
            },
            {
              id: "b",
              text: "Talk faster through the Actions section to ensure they reach Results before time runs out",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Skip the Actions section entirely and focus only on Context and Results",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Choose a different, shorter story instead — 6-month projects are too long for behavioral interviews",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Detecting audience disengagement",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'During a behavioral interview, the interviewer keeps saying "yeah" and "hmm" while you\'re describing technical implementation details. They\'ve stopped taking notes. What does this most likely signal and what should you do?',
        explanation:
          'Frequent "yeah" and "hmm" sounds like active listening in normal conversation, but in an interview context it typically signals the interviewer wants to shift topics or you\'ve gone too deep. Combined with stopped note-taking, this is a clear sign of disengagement. The correct response is to wrap your current point and move to the next part of your story or offer to go deeper if they\'re interested.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "They want to move on — wrap your current point quickly and shift to the next action or offer to go deeper if they're interested",
              isCorrect: true,
            },
            {
              id: "b",
              text: "They are highly engaged — continue providing more technical detail",
              isCorrect: false,
            },
            {
              id: "c",
              text: "They didn't understand — restart the explanation from the beginning with more context",
              isCorrect: false,
            },
            {
              id: "d",
              text: "They are testing your stamina — keep going at the same pace to show thoroughness",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Detail calibration in actions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When describing actions in a behavioral story, what is the right heuristic for how much detail to include on a single point before moving on?",
        explanation:
          'Detail serves two purposes: making the story understandable and establishing credibility. Once you\'ve established credibility on a particular point (which usually takes around 30 seconds), additional details provide diminishing returns and waste precious interview time. The 30-second heuristic helps you maintain pacing while still demonstrating depth. You can always offer to go deeper ("I can talk more about that if you like") and move on.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "About 30 seconds — enough to establish understanding and credibility, then move to the next action",
              isCorrect: true,
            },
            {
              id: "b",
              text: "As much detail as possible to prove you actually did the work",
              isCorrect: false,
            },
            {
              id: "c",
              text: "One sentence per action to keep the story under 2 minutes",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Match the detail level of whoever you are interviewing with",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Table of Contents technique — purpose",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'When telling a complex, multi-phase story in a behavioral interview, a candidate provides a "Table of Contents" after their Context: "I contributed in four key ways: establishing the architecture, mentoring two juniors, managing stakeholders across three teams, and owning post-launch metrics." Why is this technique particularly effective at the Staff+ level?',
        explanation:
          "The Table of Contents technique serves triple duty. First, it helps the interviewer track the narrative. Second, it keeps the candidate on track. But most importantly at Staff+ level, it demonstrates organized thinking — the ability to structure complex information clearly is itself a core competency being evaluated. Senior roles require communicating complex technical work to diverse audiences, and how you tell your story reinforces that you can do this on the job. Including takeaways (not just topics) further strengthens this signal.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "It demonstrates organized thinking — a Staff+ competency — while helping both the interviewer track the story and the candidate stay on point",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It allows the candidate to fit more content into the same time by previewing everything upfront",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It signals seniority by making the story as long and detailed as possible",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It prevents the interviewer from asking follow-up questions by covering all topics in advance",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Story reuse across signal areas",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'A candidate has a strong story about building an AI chatbot. They are asked "Tell me about a time you demonstrated ownership." The same story also has strong Perseverance and Communication signals. What is the optimal delivery strategy?',
        explanation:
          'The key insight is to foreground the requested signal (Ownership) early in the response — "Nobody asked me to do this. I identified the problem and pitched the solution to my manager." This directly answers the question. For the other signals (Perseverance through learning ML, Communication through stakeholder updates), mention them in passing like footnotes — enough that the interviewer knows the material exists, but without spending precious time on signals they didn\'t ask about. This lets the interviewer choose to follow up on those signals if interested.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Lead with the Ownership signal early, then mention Perseverance and Communication in passing as available follow-up threads",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Tell the story chronologically and let the interviewer identify which signals apply",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Focus exclusively on Ownership and omit all other signals to avoid confusion",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Give equal time to all three signals to show the breadth of the story",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Components of the CARL framework",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL components that belong to the CARL framework for structuring behavioral interview responses:",
        explanation:
          'CARL stands for Context, Actions, Results, and Learnings. "Task" and "Situation" are components of the STAR method, which CARL improves upon by combining them into "Context" and adding "Learnings."',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Context",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Actions",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Results",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Learnings",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Task",
              isCorrect: false,
            },
            {
              id: "f",
              text: "Situation",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Signs of interviewer disengagement",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL behaviors that typically signal your interviewer has disengaged or wants you to wrap up a point:",
        explanation:
          'All five are disengagement signals. Eyes glazing over and stopping note-taking are obvious. Frequent "yeah"/"hmm" sounds like active listening but in interviews signals impatience. Unmuting or opening their mouth means they want to interject. Not asking follow-ups on technical details means they\'re not interested in going deeper there. Leaning forward and asking clarifying questions would indicate genuine engagement.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Eyes glazing over or looking away",
              isCorrect: true,
            },
            {
              id: "b",
              text: 'Saying "yeah" or "hmm" frequently',
              isCorrect: true,
            },
            {
              id: "c",
              text: "Stopping note-taking",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Unmuting themselves or opening their mouth to speak",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Not asking follow-up questions on technical details",
              isCorrect: true,
            },
            {
              id: "f",
              text: "Leaning forward and asking clarifying questions",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Effective results when metrics are unavailable",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "When a project lacks quantifiable metrics, select ALL valid approaches for articulating impact in the Results section:",
        explanation:
          "All four approaches effectively communicate impact without hard metrics: comparing before/after states makes the change tangible, qualitative feedback from stakeholders carries weight, time/effort comparisons quantify the improvement indirectly, and describing unlocked capabilities shows strategic value. Inventing approximate numbers without data is dishonest and risks credibility if the interviewer probes further.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Compare before and after states: "Deploying required 3 people over 4 hours; after, any engineer could deploy in 15 minutes"',
              isCorrect: true,
            },
            {
              id: "b",
              text: 'Use qualitative feedback: "The PM told me this was the first time she felt engineering understood her priorities"',
              isCorrect: true,
            },
            {
              id: "c",
              text: 'Reference time or effort savings: "Development with the old API took weeks; after refactoring, new features took days"',
              isCorrect: true,
            },
            {
              id: "d",
              text: 'Describe what became possible: "We could now test mobile features without submitting a new build"',
              isCorrect: true,
            },
            {
              id: "e",
              text: "Invent approximate numbers that sound reasonable to fill the gap",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Staff-level behavioral story signals",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL elements that distinguish a Staff Engineer behavioral story from a Senior Engineer story:",
        explanation:
          "Staff-level stories demonstrate organizational influence (not just team-level), multi-audience communication (tailoring the message for engineering, product, and individual teams differently), making change politically viable (the adapter layer pattern — extra engineering work that reduces resistance), and extracting cross-cutting learnings applicable beyond the immediate project. Solving individual technical problems and hitting deadlines are strong signals at the Senior level but don't differentiate at Staff.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Influencing technical direction across multiple teams or the organization",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Tailoring communication for different audiences (eng leadership vs product vs individual teams)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Making change safe and politically viable through architectural decisions like backward-compatible adapters",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Extracting learnings that generalize beyond the specific project context",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Solving a particularly difficult individual technical problem",
              isCorrect: false,
            },
            {
              id: "f",
              text: "Delivering a project on time and within scope",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Reframe a story for a different signal",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Imagine you built an internal tool that automated a manual deployment process. The project involved: learning a new CI/CD platform, convincing your skeptical team lead, writing the tool over 3 weekends, training the team, and reducing deployment time from 4 hours to 15 minutes. Write two different CARL opening statements (Context + first sentence of Actions) — one optimized for a "Perseverance" question and one for an "Ownership" question.',
        explanation:
          "A strong answer foregrounds the relevant signal in each version. The Perseverance version should lead with the obstacles (new platform, skeptical lead, weekend work). The Ownership version should lead with the self-initiated nature (nobody asked, identified the problem, pitched the solution). Both should include stakes and results preview.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Perseverance version: "Our team was spending 4 hours on every deployment, requiring three people to coordinate manually. I saw an opportunity to automate this, but it meant learning an entirely new CI/CD platform I\'d never touched, and my tech lead was skeptical it was worth the effort. I decided to build a proof of concept on my own time to demonstrate the value — the first of several obstacles I\'d need to push through."\n\nOwnership version: "Nobody asked me to fix our deployment process, but watching three engineers spend 4 hours coordinating a manual deployment felt like a problem worth solving. I brought the idea to my tech lead with a concrete proposal — I\'d build an automated pipeline using our new CI/CD platform and have a working prototype within two weeks. My first action was scheduling a meeting to walk through the manual process step by step so I could identify every automation opportunity."',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Fix a weak context section",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'A candidate gives this Context in a behavioral interview: "So at my last company, we had this legacy system that was originally built back in 2017 by a team that no longer exists. It went through two major refactors, one in 2019 and another in 2021. I reported to Sarah, who reported to the VP of Platform, and the product manager was on a different team that reported to the Head of Product. The system used Java with Spring Boot and PostgreSQL. The team was about 12 people." Identify all the problems with this Context and rewrite it in under 45 seconds of speaking time (~100 words).',
        explanation:
          "A strong answer identifies: (1) project history lesson (full timeline is irrelevant), (2) unnecessary org chart (reporting structure not relevant), (3) explaining technology the interviewer knows, (4) missing stakes (why should anyone care?), (5) too long. The rewrite should orient the listener with the problem, stakes, and candidate's role in ~100 words.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Problems identified:\n1. Project history lesson: The 2017/2019/2021 timeline is irrelevant — the interviewer only needs to know where the candidate started.\n2. Unnecessary org chart: Sarah, the VP, and the Head of Product are not relevant unless the candidate\'s actions involved those reporting relationships.\n3. Explaining known technology: "Java with Spring Boot and PostgreSQL" at a tech company interview adds nothing.\n4. Missing stakes: There\'s no reason to care — no business impact, no urgency, no problem to solve.\n5. Way too long: This would take 60-90 seconds to say, well over the 30-45 second target.\n\nRewritten Context (~90 words):\n"At my last company, we had a legacy platform handling all our customer transactions — about $30M per quarter flowing through it. The system had accumulated significant technical debt, and we were seeing reliability issues: roughly two outages per month, each costing us about 4 hours of engineering time and measurable customer churn. As one of the senior engineers on the platform team, I identified that the root cause was scattered across multiple services, and I proposed a focused reliability initiative to address it."',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Craft a complete CARL response — conflict scenario",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Using the CARL framework, write a complete behavioral response to: "Tell me about a time you had a disagreement with a colleague about a technical approach." Your scenario: You wanted to use microservices for a new product, your senior colleague insisted on a monolith, and ultimately the monolith was the right call. Include all four CARL sections with appropriate pacing and detail.',
        explanation:
          "A strong CARL answer has: Context (30-45s equivalent) with stakes, Actions showing both technical reasoning AND interpersonal skill (how you handled the disagreement, not just the technical debate), Results with impact, and honest Learnings about what you misjudged. The twist — that the colleague was right — should be handled with maturity and genuine reflection, not defensiveness.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Context: \"We were building a new customer-facing product at [Company] that needed to integrate with three existing services. We had a 3-month deadline and a team of 5 engineers. I was advocating for a microservices architecture because I'd seen the benefits at my previous company, but our most senior engineer, Alex, was firmly pushing for a monolith. The stakes were real — our approach would shape this product's trajectory for years.\"\n\nActions: \"I put together a comparison doc with three architectures: full microservices, modular monolith, and a hybrid approach. I included deployment complexity estimates, team ramp-up time, and operational overhead for each. When I presented it to the team, Alex pushed back specifically on my operational estimates — he pointed out that our team of 5 couldn't realistically maintain 6-8 separate services with CI/CD pipelines, monitoring, and on-call rotations.\n\nI initially pushed back, but then I did something that I think was important — I actually modeled out the operational overhead: deploy pipelines, monitoring dashboards, on-call rotation across services. When I ran the numbers honestly, Alex was right. Our team couldn't support it.\n\nI went back to the team and said, 'I think Alex's instinct is correct. Here's the operational analysis that convinced me.' I proposed we go with a modular monolith that would let us extract services later if we grew the team. Alex and I collaborated on the module boundaries to ensure clean separation.\"\n\nResults: \"We shipped the product on time — actually two weeks early because we didn't have the deployment complexity overhead. The modular boundaries held up well, and when we doubled the team six months later, we were able to extract two modules into services cleanly because the interfaces were already well-defined.\"\n\nLearnings: \"I learned that architectural preferences can become biases. I was pattern-matching from my previous company where we had a 30-person platform team — very different from a 5-person startup team. Now, when I evaluate architectures, I always start with team size and operational capacity before considering the technical ideals. Alex also taught me the value of designing for where you are, not where you hope to be.\"",
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Provide a strong Learnings section",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'A candidate ends their CARL story with: "I learned that communication is important and that working with teams across the organization can be challenging." Explain why this Learnings section is weak and write three alternative Learnings statements that would be appropriate for a Senior or Staff engineer, demonstrating genuine depth and specificity.',
        explanation:
          "A strong answer identifies the problems (generic, obvious, no specificity, no actionable insight) and provides learnings that are specific to the candidate's experience, actionable, and demonstrate genuine reflection. Good learnings include what specifically they would change, what they now understand about a nuanced topic, or a mental model they developed.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Why it\'s weak:\n- "Communication is important" is universally obvious — it tells the interviewer nothing about THIS candidate\'s specific growth.\n- "Cross-org work can be challenging" is equally generic — every engineer knows this.\n- Neither statement shows what the candidate specifically learned or what they would do differently.\n- A Learnings section this shallow is a red flag — it suggests the candidate didn\'t genuinely reflect on the experience, or worse, doesn\'t think they have room for improvement.\n\nThree strong alternatives:\n\n1. "I learned that when working with a remote team, I need to over-document decisions in writing because hallway conversations don\'t happen. After this project, I started writing decision logs for every cross-team meeting — not just action items, but the reasoning behind each decision, including options we rejected and why. This has saved me from re-litigating decisions multiple times since."\n\n2. "If I did this again, I would have involved the support team in the design phase, not after the prototype was built. I brought them in for feedback on a working system, but their input on tone, terminology, and edge cases was so valuable that incorporating it earlier would have eliminated two weeks of iteration. Now I identify end users before writing any code and schedule a design input session."\n\n3. "I realized that offering to do the work yourself is a more powerful influence tool than escalation. Two teams said they didn\'t have bandwidth for the performance fixes. Rather than escalating to their managers, I offered to write the PRs if they\'d review them. This turned potential blockers into collaborators — they felt respected, I got the changes merged, and I built relationships that made the next cross-team project much smoother."',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Structure a complex multi-phase story",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You need to tell a story about a year-long data platform migration you led as a Staff Engineer. The project involved: (1) a 1-month discovery phase mapping 6 teams' existing pipelines, (2) writing an RFC and getting buy-in from eng and product leadership, (3) building a backward-compatible adapter layer, (4) running office hours to help 6 teams migrate over 4 months, and (5) measuring outcomes. Write the full opening of this story (Context + Table of Contents + front-loaded Results) optimized for a 45-minute deep-dive behavioral interview.",
        explanation:
          "A staff-level answer demonstrates: front-loaded results (anchor the impact immediately), a clear Table of Contents with takeaway-oriented themes (not just topic labels), and a Context that efficiently sets up the problem with stakes. The opening should be under 2 minutes of speaking time and set up the interviewer to ask follow-up questions on any of the themes.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Context (~40 seconds):\n"When I joined [Company], each of our six product teams had built their own data pipeline for analytics — different technologies, different schemas, different reliability levels. Product managers couldn\'t get consistent metrics across products, and we estimated engineering was spending 40% of data-related time on pipeline maintenance rather than insights. I led the consolidation from six pipelines to one unified streaming platform."\n\nFront-loaded Results (~20 seconds):\n"To give you the punchline: over the year, we reduced pipeline maintenance costs by an estimated 40% in engineering time and shipped our first cross-product analytics dashboard within three months of completing the migration — something that would have taken 6+ months before."\n\nTable of Contents (~30 seconds):\n"I contributed in four key phases, and I\'ll walk through each:\nFirst, building a complete map of what existed and why — understanding six teams\' reasonable but divergent decisions.\nSecond, designing a consolidation approach that eliminated resistance — the backward-compatible adapter layer that made migration feel safe.\nThird, getting buy-in by tailoring the pitch differently for engineering leadership, product leadership, and individual teams.\nAnd fourth, running the migration itself — office hours, hands-on support, and measuring outcomes.\n\nLet me start with the discovery phase..."',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Prepare follow-up responses for a core story",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You just told a CARL story about leading a cross-team performance initiative that reduced mobile app cold start time from 8 seconds to 3.2 seconds. Write prepared responses to these four common follow-up questions: (1) "What was the hardest part?" (2) "What would you do differently?" (3) "How did you measure success?" (4) "What happened after?"',
        explanation:
          'Strong follow-up responses are specific, honest, and add new information not already in the main story. "What was the hardest part?" should reveal technical depth. "What would you do differently?" should show genuine reflection, not a humble-brag. "How did you measure success?" should show metric selection and goal-setting. "What happened after?" should demonstrate lasting impact.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            '1. "What was the hardest part?"\n"Getting the third-party SDK vendor to prioritize an optimized initialization path. I couldn\'t just write a PR for their codebase. I had to build a compelling case using our profiling data showing their SDK was responsible for 30% of cold start time, affecting millions of users. I shared the data in a format their engineering team could reproduce, and I offered to beta test the optimized version. It took three back-and-forth cycles over six weeks before they shipped the change."\n\n2. "What would you do differently?"\n"I\'d establish shared performance budgets upfront with each team, not just a single target number. I set one goal — 3-second cold start — but didn\'t break it down by team responsibility. This meant teams didn\'t know if their individual changes were sufficient until we measured the aggregate. A budget approach (\'your initialization must complete in under 400ms\') would have made progress more visible and accountability clearer."\n\n3. "How did you measure success?"\n"I defined three metrics before starting: p50 and p95 cold start time from our client-side performance SDK, first-session uninstall rate from our app analytics, and engineering hours spent on startup-related bugs from our ticketing system. I set up a shared Grafana dashboard tracking all three, updated daily. Our targets were: cold start under 4 seconds at p95, uninstall rate reduction of at least 10%, and the initiative was successful if these held for 30 days post-rollout."\n\n4. "What happened after?"\n"The approach became a template for cross-team performance work at the company. The next quarter, another engineer used the same playbook — profiling, per-team breakdown, offer-to-write-PRs — to tackle our API response times. I was also asked to present the methodology at our quarterly engineering all-hands, which led to performance budgets being added to our team launch checklist."',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Name the framework",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What is the name of the behavioral story framework that improves on STAR by combining Situation and Task into a single section and adding an explicit reflection component?",
        explanation:
          "CARL (Context, Actions, Results, Learnings) improves on STAR by combining Situation and Task into Context (eliminating artificial separation) and adding Learnings (providing a platform for demonstrating self-awareness and growth). The Learnings component is particularly valuable for senior candidates.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "CARL",
          acceptableAnswers: [
            "CARL",
            "carl",
            "Carl",
            "CARL framework",
            "CARL Framework",
            "the CARL framework",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Story technique for complex narratives",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What narrative technique should you use after the Context section of a complex, multi-phase story to help the interviewer track your narrative and signal organized thinking?",
        explanation:
          'A "Table of Contents" — listing the themes or phases of your story upfront — helps the interviewer know what is coming and keeps you on track. It also signals organized thinking, which is itself a Staff+ competency being evaluated. Themes should include takeaways, not just topic labels.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Table of Contents",
          acceptableAnswers: [
            "Table of Contents",
            "table of contents",
            "TOC",
            "roadmap",
            "Roadmap",
            "outline",
            "agenda",
            "Table of contents",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Target story duration",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "When practicing a CARL story out loud, what is the recommended target duration range (in minutes) for a complete story before follow-up questions? If you consistently exceed this, what is the likely cause?",
        explanation:
          "The target is 2-4 minutes for a complete CARL story. Going over usually means too much context (spending over 45 seconds on background) or too many action details (not moving on after establishing credibility on a point). Practicing aloud with timing is essential — stories always take longer to tell than candidates expect.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "2-4 minutes",
          acceptableAnswers: [
            "2-4 minutes",
            "2 to 4 minutes",
            "2-4 min",
            "2-4",
            "two to four minutes",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Primary CARL section for behavioral signal",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'In the CARL framework, which section is described as "the centerpiece" where behavioral signal lives — i.e., the core of what you are being evaluated on? What two types of content should be included in this section beyond technical execution?',
        explanation:
          "Actions is the centerpiece where behavioral signal lives. Beyond technical execution, candidates should include non-technical actions (scoping, stakeholder communication, mentoring, conflict resolution) and decision rationale (alternatives considered, reasoning for choices made). The difference between a Senior and Staff story often lies in the non-technical actions described.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Actions",
          acceptableAnswers: ["Actions", "actions", "Action", "action", "The Actions section"],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match CARL component to its purpose",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each CARL component to its primary purpose in a behavioral response:",
        explanation:
          "Context orients the listener with situation, role, and stakes. Actions demonstrate your specific behaviors and decision-making — the core signal. Results prove your actions had measurable impact. Learnings show self-awareness, growth, and extractable wisdom for future application.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Context",
              right: "Orient the listener with situation, role, and stakes",
            },
            {
              id: "p2",
              left: "Actions",
              right: "Demonstrate specific behaviors and decision-making (core signal)",
            },
            {
              id: "p3",
              left: "Results",
              right: "Prove your actions had measurable impact",
            },
            {
              id: "p4",
              left: "Learnings",
              right: "Show self-awareness, growth, and extractable wisdom",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match story level to distinguishing signal",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each engineering level to the distinguishing behavioral signal pattern in their CARL stories:",
        explanation:
          "Junior stories focus on individual technical problem-solving and learning. Senior stories demonstrate cross-team initiative ownership and influence without direct authority. Staff stories show organizational strategy influence, multi-audience communication, and making change politically viable through architectural decisions. Each level builds on the previous one.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Junior Engineer",
              right:
                "Individual debugging methodology, documentation, widening investigation scope",
            },
            {
              id: "p2",
              left: "Senior Engineer (L5)",
              right:
                "Cross-team initiative, influence without authority, turning blockers into collaborators",
            },
            {
              id: "p3",
              left: "Staff Engineer",
              right:
                "Organizational influence, multi-audience RFC communication, making change feel safe",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match context mistake to its correction",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each common Context section mistake to the correct fix:",
        explanation:
          "The project history lesson (full timeline) should be replaced by starting where you started and what you did — the interviewer doesn't need backstory before your involvement. Org chart details should only be mentioned if your actions directly involved navigating that structure. Technology explanations should be dropped at tech companies — assume technical literacy. Missing stakes should be fixed by adding quantified business impact to create urgency and importance.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Narrating the full project timeline from years before your involvement",
              right: "Start where you started — only include history that explains your actions",
            },
            {
              id: "p2",
              left: "Describing reporting structures and org charts",
              right:
                "Only mention roles if your actions directly involved navigating those relationships",
            },
            {
              id: "p3",
              left: "Explaining well-known technologies like Kubernetes or PostgreSQL",
              right:
                "Assume technical literacy at tech companies — mention technology names without definitions",
            },
            {
              id: "p4",
              left: "No mention of why the project matters",
              right: "Add quantified stakes: cost impact, user metrics, or business risk",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "CARL framework acronym",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content: "The CARL framework stands for Context, Actions, Results, and _____.",
        explanation:
          "CARL stands for Context, Actions, Results, and Learnings. The Learnings component is what differentiates CARL from STAR — it provides an explicit place for reflection, demonstrating self-awareness and growth. Think of it like Aesop's fables ending with a moral.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The CARL framework stands for Context, Actions, Results, and {{blank1}}.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Learnings",
              acceptableAnswers: ["Learnings", "learnings", "Learning", "learning"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Context duration target",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The Context section of a CARL story should be kept to _____ seconds to avoid losing the interviewer's attention before reaching your Actions.",
        explanation:
          "Keep Context to 30-45 seconds. Many candidates spend 1-3 minutes on background before reaching their actions, by which point the interviewer has disengaged. The Context exists to make Actions comprehensible — provide the minimum setup for the listener to understand what you did and why it mattered.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The Context section of a CARL story should be kept to {{blank1}} seconds to avoid losing the interviewer's attention before reaching your Actions.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "30-45",
              acceptableAnswers: ["30-45", "30 to 45", "30–45", "30 - 45", "45"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Action statement pattern",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          'In the Actions section, use "___" statements consistently to make your specific contribution clear — not "we decided" but "I proposed and the team agreed."',
        explanation:
          'Using "I" statements ensures the interviewer can evaluate your specific contributions. "We" language obscures individual agency. You can still acknowledge team contributions: "I proposed the approach, and my colleague Sarah implemented the monitoring piece." The goal is clarity about your role, not claiming sole credit.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            'In the Actions section, use "{{blank1}}" statements consistently to make your specific contribution clear — not "we decided" but "I proposed and the team agreed."',
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
