/**
 * Why the Behavioral Matters — Behavioral Interview Prep Content
 * Based on HelloInterview extract by Austen McDonald (former Meta hiring committee chair)
 * Covers: why behaviorals cause rejections/downleveling, the Decode-Select-Deliver loop,
 *         assessment frameworks, common misconceptions, and preparation strategies
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const behavioralWhyBehavioralContent: StoryPointSeed = {
  title: "Why the Behavioral Matters",
  description:
    "Understand why behavioral interviews cause more rejections and downleveling than candidates expect, learn the Decode-Select-Deliver framework, and master the assessment dimensions interviewers actually evaluate.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Why Behavioral Interviews Matter
    {
      title: "Why Behavioral Interviews Cause Rejections and Downleveling",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Why Behavioral Interviews Cause Rejections and Downleveling",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What Are Behavioral Interviews?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                'The behavioral interview is a non-technical round where the interviewer — often the hiring manager — discusses your previous experience to assess your fitness for the role. It\'s the culture fit interview, the soft skills interview, the "Tell me about a time when..." interview.',
            },
            {
              id: "b3",
              type: "paragraph",
              content:
                "Behavioral interviewers are forecasters. They know that with people, unlike investments, past performance is a predictor of future results. Technical skills can be taught, but who you are as a person — how you think, how you act, and how you interact — emerges over years and changes slowly.",
            },
            {
              id: "b4",
              type: "quote",
              content:
                "\"When an interviewer asks 'Tell me about a time you had a conflict with a teammate,' they're not actually interested in the plot of the story you tell them. Instead they're forecasting, assessing your judgment, emotional intelligence, and relationship management skills.\"",
            },
            {
              id: "b5",
              type: "heading",
              content: "Why Behavioral Interviews Matter More Than Ever",
              metadata: { level: 2 },
            },
            {
              id: "b6",
              type: "heading",
              content: "Soft Skills Distinguish Senior from Junior",
              metadata: { level: 3 },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "Behavioral interviews determine who gets hired into senior roles. Engineers who operate at a senior level own business problems end-to-end, learn new technologies quickly, navigate organizational complexity, build trust with stakeholders, and drive impact beyond their immediate team. All of these capabilities are evaluated in the behavioral round.",
            },
            {
              id: "b8",
              type: "heading",
              content: "AI Is Making Soft Skills More Important, Not Less",
              metadata: { level: 3 },
            },
            {
              id: "b9",
              type: "paragraph",
              content:
                "As AI handles more implementation work, your ability to communicate judgment, leadership, and problem-solving becomes the primary way companies distinguish senior from junior talent. Now that anyone can build working solutions using everyday language, organizations have shifted attention from how to build toward what to build. Skills like understanding business context, driving alignment, and communicating vision are now essential for all builders.",
            },
            {
              id: "b10",
              type: "heading",
              content: "Companies Are Ruthlessly Selective",
              metadata: { level: 3 },
            },
            {
              id: "b11",
              type: "paragraph",
              content:
                "In a competitive job market, the behavioral is where you stand out. Companies get dozens of candidates who can pass the technical bar, so the behavioral is how they decide between equals. Your experience and personality can shine through concrete details, genuine enthusiasm, and self-awareness.",
            },
            {
              id: "b12",
              type: "heading",
              content: "Real Candidate Feedback",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  '"I got rejected after all the successful interviews at the hiring committee stage, even though I felt pretty confident about it."',
                  '"HR told me I passed all technical interviews, but the manager didn\'t like me."',
                  '"I was downleveled to E4 from E5 on behavioral round feedback."',
                  '"I did the best I can with system design and behavioral but was told both were weak for IC5 level but expected for IC4."',
                  '"The behavioral seemed very important. They didn\'t want someone who was just a tech wiz, but someone who could work in a dynamic environment with complex teams."',
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: The Decode-Select-Deliver Framework
    {
      title: "The Behavioral Interview Cycle: Decode, Select, Deliver",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "The Behavioral Interview Cycle: Decode, Select, Deliver",
          blocks: [
            {
              id: "dsd1",
              type: "heading",
              content: "Three Skills You Need",
              metadata: { level: 2 },
            },
            {
              id: "dsd2",
              type: "paragraph",
              content:
                "To present yourself as the right fit for a role, demonstrating both your capabilities and your alignment with the company's needs, you need three things: (1) an understanding of what interviewers actually evaluate, (2) clarity on your own professional story, and (3) compelling delivery.",
            },
            {
              id: "dsd3",
              type: "heading",
              content: "The Decode-Select-Deliver Loop",
              metadata: { level: 2 },
            },
            {
              id: "dsd4",
              type: "paragraph",
              content:
                "These three skills form a repeatable cycle — a loop that runs in your head as you hear a question, consider your options, and formulate your answer:",
            },
            {
              id: "dsd5",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Decode: Understand what the interviewer is really asking. The question behind the question is where the real assessment lives.",
                  "Select: Choose the right story from your catalog. Prioritize by: highest scope → most relevant → most unique → most recent.",
                  "Deliver: Tell your story clearly using the CARL framework (Context, Actions, Results, Learnings). CARL is a refinement of STAR that better captures what interviewers actually need to hear.",
                ],
              },
            },
            {
              id: "dsd6",
              type: "heading",
              content: "CARL vs STAR",
              metadata: { level: 3 },
            },
            {
              id: "dsd7",
              type: "paragraph",
              content:
                'STAR (Situation, Task, Action, Result) is the well-known response framework. CARL (Context, Actions, Results, Learnings) improves on STAR in two key ways: (1) it replaces "Situation/Task" with a single "Context" to keep setup concise, and (2) it adds "Learnings" — what you took away from the experience — which demonstrates self-awareness, growth mindset, and coachability. These qualities are highly valued by interviewers, especially at senior levels.',
            },
            {
              id: "dsd8",
              type: "heading",
              content: "Frameworks Interviewers Use to Assess You",
              metadata: { level: 2 },
            },
            {
              id: "dsd9",
              type: "paragraph",
              content:
                "There are three frameworks every behavioral interviewer applies to your responses, sometimes consciously and sometimes unconsciously:",
            },
            {
              id: "dsd10",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Signal Areas: A structured set of competencies like Ownership, Perseverance, and Conflict Resolution (8 key areas). These form the structured rubric.",
                  "Company Values: Qualities the company believes represent their most successful employees (e.g., Amazon's Leadership Principles, Meta's \"Move Fast\").",
                  "Cultural Assessment: Unwritten rules about functioning within their company's specific approach to work — how decisions are made, how conflict is handled, what pace is expected.",
                ],
              },
            },
            {
              id: "dsd11",
              type: "paragraph",
              content:
                "Understanding these dimensions means you can be strategic in your communication. Map the question to a signal area or company value, choose the story that best represents that concept, and tilt the content and language toward what the interviewer wants to hear.",
            },
            {
              id: "dsd12",
              type: "heading",
              content: "Story Selection Priority",
              metadata: { level: 2 },
            },
            {
              id: "dsd13",
              type: "paragraph",
              content:
                "When choosing which story to tell, prioritize in this order: (1) Highest scope — stories where you operated at or above the level you're interviewing for. (2) Most relevant — stories that directly map to the signal area being assessed. (3) Most unique — stories that differentiate you from other candidates. (4) Most recent — recency signals current capability.",
            },
          ],
          readingTime: 7,
        },
      },
    },

    // Material 3: Common Misconceptions & Preparation Strategy
    {
      title: "Common Misconceptions & How to Prepare",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Common Misconceptions & How to Prepare",
          blocks: [
            {
              id: "cm1",
              type: "heading",
              content: "Misconceptions That Hold Candidates Back",
              metadata: { level: 2 },
            },
            {
              id: "cm2",
              type: "heading",
              content: '"No prep required, just be yourself"',
              metadata: { level: 3 },
            },
            {
              id: "cm3",
              type: "paragraph",
              content:
                "You should be authentic and honest, but also intentional about what you share. Walking in and saying whatever comes to mind means missing opportunities to showcase your impact and unique contributions. Authenticity and preparation are not opposites.",
            },
            {
              id: "cm4",
              type: "heading",
              content: '"I need to find and memorize questions the company will ask"',
              metadata: { level: 3 },
            },
            {
              id: "cm5",
              type: "paragraph",
              content:
                "Behavioral interviewers vary a lot, even within the same company. Unlike coding interviews where you might drill specific questions, you should prepare bottom-up — starting with your own career accomplishments and building stories from there. Better to understand what interviewers are looking for and know how to tell key stories than prep for specific scenarios.",
            },
            {
              id: "cm6",
              type: "heading",
              content: '"The STAR method is all I need"',
              metadata: { level: 3 },
            },
            {
              id: "cm7",
              type: "paragraph",
              content:
                "Applying STAR puts you ahead of someone with no prep, but a simple story structure doesn't tell you which stories to choose, how to position yourself for a top-tier company, or how to adjust your approach for different contexts. STAR is a starting point, not a complete strategy.",
            },
            {
              id: "cm8",
              type: "heading",
              content: '"The manager is just looking for social fit"',
              metadata: { level: 3 },
            },
            {
              id: "cm9",
              type: "paragraph",
              content:
                "When a hiring team member conducts your behavioral, they do want to see if you'll mesh with the team. But they're also trying to predict how you'll perform in the role. They're looking for repeatable patterns of behavior that predict success. Focusing on those patterns ensures you're giving them the evidence they need to extend an offer.",
            },
            {
              id: "cm10",
              type: "heading",
              content: "How to Stand Out",
              metadata: { level: 2 },
            },
            {
              id: "cm11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Concrete details over vague claims: "I improved team efficiency" is forgettable. "I noticed our standups were running 25 minutes and people were zoning out, so I proposed a new format where we only flagged blockers. We got them down to 8 minutes and engineers told me they actually looked forward to them" is memorable.',
                  "Genuine enthusiasm: When you talk about work you actually cared about, it shows. Interviewers remember candidates who light up when describing their projects.",
                  "Self-awareness: Candidates who can articulate what they learned, what they'd do differently, and how they've grown stick in interviewers' minds. It signals maturity and coachability.",
                ],
              },
            },
            {
              id: "cm12",
              type: "heading",
              content: "Preparation Timeline",
              metadata: { level: 2 },
            },
            {
              id: "cm13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Full preparation: 1-2 weeks spread out. Time is needed to journal about past experiences and build high-quality responses.",
                  "Familiar with core concepts: A few days to refine stories and practice delivery.",
                  'Short on time: Focus on (1) the Decode-Select-Deliver framework, (2) your "Big Three" answers (Tell me about yourself, favorite project, a conflict), and (3) Common Pitfalls.',
                ],
              },
            },
            {
              id: "cm14",
              type: "heading",
              content: "The Key Takeaway",
              metadata: { level: 2 },
            },
            {
              id: "cm15",
              type: "quote",
              content:
                "\"Most people who struggle with behavioral interviews don't lack experience. Your stories are probably enough. What's missing is a framework for presenting them clearly.\"",
            },
          ],
          readingTime: 6,
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════════════

    // --- MCQ (8 questions) ---

    // MCQ 1 — easy
    {
      title: "What behavioral interviewers are really doing",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'When a behavioral interviewer asks "Tell me about a time you had a conflict with a teammate," what are they primarily trying to do?',
        explanation:
          "Behavioral interviewers are forecasters. They use your past behavior to predict your future performance. They're not interested in the plot of the story — they're assessing your judgment, emotional intelligence, and relationship management skills. The specific conflict details matter less than the behavioral patterns you demonstrate.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Forecasting your future behavior based on how you handled past situations",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Checking if the conflict was resolved and no damage was done",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Evaluating whether you or your teammate was right in the conflict",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Testing your memory for specific workplace events",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why candidates get downleveled",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "A candidate passes all technical interviews at the E5 level but receives an E4 offer. Based on how behavioral interviews work at top tech companies, what is the most likely cause?",
        explanation:
          "Behavioral interviews are the primary mechanism for determining seniority level. Technical screens assess whether you can do the work, but behaviorals assess the scope and impact at which you operate. The candidate likely demonstrated E4-level scope, ownership, and influence patterns rather than E5-level ones during the behavioral round.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Their behavioral responses demonstrated E4-level scope and impact rather than E5",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The company ran out of E5 headcount",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Their technical skills were borderline E5",
              isCorrect: false,
            },
            {
              id: "d",
              text: "They did not have enough years of experience for E5",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "CARL framework components",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "The CARL framework is recommended over STAR for behavioral responses. What does CARL stand for, and what is the key improvement over STAR?",
        explanation:
          'CARL stands for Context, Actions, Results, Learnings. The key improvements are: (1) it merges "Situation" and "Task" into a single "Context" to keep the setup concise, and (2) it adds "Learnings" — what you took away from the experience. The Learnings component demonstrates self-awareness, growth mindset, and coachability, which are highly valued at senior levels.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Context, Actions, Results, Learnings — adds a Learnings component that demonstrates self-awareness and growth",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Challenge, Approach, Result, Leadership — emphasizes leadership over individual contribution",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Context, Analysis, Response, Leverage — adds a quantitative analysis component",
              isCorrect: false,
            },
            {
              id: "d",
              text: 'Context, Actions, Results, Learnings — the main improvement is using "Context" instead of "Situation"',
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Story selection priority order",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'When choosing a story to answer a behavioral question, the recommended priority order is: (1) Highest scope, (2) Most relevant, (3) Most unique, (4) Most recent. Why is "highest scope" prioritized over "most relevant"?',
        explanation:
          "Scope is prioritized because it's the strongest signal of level. A story where you operated at or above the target level — even if it's only partially relevant to the question — demonstrates that you can function at that scope. A perfectly relevant story at a lower scope actually works against you because it reinforces the wrong level. Interviewers use scope as the primary signal for leveling decisions.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Scope is the strongest signal for leveling — a high-scope story, even if less directly relevant, demonstrates you operate at the target level",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Higher scope stories are naturally more impressive and interesting to the interviewer",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Relevant stories are too easy to fabricate, so interviewers prefer hearing about large-scale work",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Scope indicates technical difficulty, which is the most important factor in behavioral assessment",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Misconception about behavioral prep",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'A candidate preparing for FAANG interviews says: "I found a list of 50 behavioral questions that Google asks and I\'m memorizing answers to each one." What is the fundamental problem with this strategy?',
        explanation:
          "Behavioral interviewers vary significantly, even within the same company. Unlike coding interviews where questions are often repeated, behavioral questions are much less predictable. The correct approach is bottom-up: start with your own career accomplishments, build a catalog of stories, and understand what signals interviewers look for. Then you can adapt any story to any question using the Decode-Select-Deliver framework.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Behavioral questions vary widely across interviewers — bottom-up preparation from your own stories is more effective than top-down question memorization",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Google has far more than 50 behavioral questions in their bank",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Memorized answers sound robotic and interviewers can always tell",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Behavioral interviews are unstructured, so preparation is counterproductive",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Assessment framework layers",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'An interviewer asks about a time you disagreed with your manager\'s technical direction. You know this is a "Conflict Resolution" signal area question. According to the three assessment frameworks, what else should inform your response beyond demonstrating conflict resolution skills?',
        explanation:
          "Beyond signal areas, interviewers also evaluate through company values and cultural assessment lenses. For example, at Amazon you'd want to invoke \"Have Backbone; Disagree and Commit,\" while at Meta you'd emphasize moving fast and not getting bogged down in process. Cultural assessment means understanding how the company handles disagreements — some value direct confrontation, others expect more consensus-building. Your language and framing should adapt accordingly.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Company values (e.g., Amazon\'s "Disagree and Commit") and cultural norms (how the target company handles disagreements)',
              isCorrect: true,
            },
            {
              id: "b",
              text: "The technical correctness of your position in the disagreement",
              isCorrect: false,
            },
            {
              id: "c",
              text: "How many people were involved in the conflict and its organizational impact",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Whether you ultimately agreed with or overruled your manager",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Why AI increases behavioral importance",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'The argument that "AI makes soft skills more important" is increasingly used in hiring. Which reasoning most precisely captures why this shifts the evaluation bar in behavioral interviews specifically?',
        explanation:
          "As AI democratizes implementation ability, the differentiating skills shift upward in the value chain. When anyone can build working solutions, the premium moves to deciding what to build, aligning stakeholders, communicating vision, and exercising judgment — all traditionally PM/leadership skills that are now expected of ICs. Behavioral interviews are the only round that assesses these capabilities, making them the primary differentiator between candidates who can all pass the technical bar.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "When implementation is commoditized, the differentiating skills (vision, alignment, judgment) are exactly what behaviorals assess — making them the primary distinguishing round",
              isCorrect: true,
            },
            {
              id: "b",
              text: "AI will eventually replace all technical interviews, so only behavioral will remain",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Companies need to verify candidates can work alongside AI tools, which is tested behaviorally",
              isCorrect: false,
            },
            {
              id: "d",
              text: "AI-generated code requires stronger code review skills, which are assessed in behavioral rounds",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Decode step: reading the real question",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'An interviewer at a Series B startup asks: "Tell me about a time you had to deliver results with limited resources." A candidate decodes this as testing "Perseverance." While partially correct, what deeper assessment is the interviewer more likely running, given the company context?',
        explanation:
          "The Decode step requires reading both the question and the context. At a Series B startup, \"limited resources\" isn't just about perseverance — it's about startup fitness. They're assessing whether you can operate in ambiguity, make scope tradeoffs, be scrappy with what you have, and still deliver. The cultural assessment framework tells us startups value resourcefulness and bias-to-action over process adherence. A candidate who tells a story about escalating for more resources would fail, even if they showed perseverance.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Startup fitness — whether you can make scope tradeoffs, be resourceful, and deliver without depending on organizational support structures",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Whether you are willing to work extra hours to compensate for limited headcount",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Your ability to estimate resource requirements and plan projects accurately",
              isCorrect: false,
            },
            {
              id: "d",
              text: "How well you document decisions made under constraints for future reference",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Qualities that help candidates stand out",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL qualities that help candidates stand out in behavioral interviews according to experienced interviewers:",
        explanation:
          "Concrete details make stories memorable and credible. Genuine enthusiasm shows authentic engagement and is hard to fake. Self-awareness (articulating learnings and growth) signals maturity and coachability. However, using the most advanced vocabulary does not help — it can make responses feel rehearsed. Similarly, having the most senior title is irrelevant if the behaviors demonstrated don't match the target level.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Concrete details over vague claims (specific numbers, actions, outcomes)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Genuine enthusiasm when describing projects you cared about",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Self-awareness about what you learned and what you'd do differently",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Using the most advanced vocabulary and technical jargon possible",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Having the most senior job title among all candidates",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Three assessment frameworks",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL frameworks that behavioral interviewers apply (consciously or unconsciously) when evaluating your responses:",
        explanation:
          "Interviewers evaluate through three lenses: (1) Signal areas — structured competencies like Ownership, Perseverance, Conflict Resolution. (2) Company values — qualities the company believes represent their most successful employees (e.g., Amazon's Leadership Principles). (3) Cultural assessment — unwritten rules about how work happens at the company. Algorithm complexity and system design capacity estimation are assessed in technical rounds, not behavioral.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Signal areas (structured competencies like Ownership, Perseverance, Conflict Resolution)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Company values (qualities representing the company's most successful employees)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Cultural assessment (unwritten rules about how the company operates)",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Algorithm complexity analysis (Big-O reasoning under pressure)",
              isCorrect: false,
            },
            {
              id: "e",
              text: "System design capacity estimation (back-of-envelope calculations)",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Valid behavioral preparation approaches",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL preparation approaches that are recommended for behavioral interviews:",
        explanation:
          "Bottom-up story building (starting from your own accomplishments), understanding assessment frameworks, and progressive practice (solo → AI → peer → professional mocks) are all recommended. Memorizing top-N questions is explicitly called out as a misconception — behavioral questions are too variable. Skipping practice entirely and just reading material is also discouraged, as candidates who consume material without practicing often stumble during actual interviews.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Build a story catalog bottom-up from your career accomplishments",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Learn the assessment frameworks to understand what interviewers are looking for",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Progressive practice: solo → AI tools → peer mocks → professional mocks",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Memorize answers to the company's top 20 most-asked behavioral questions",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Read material thoroughly but skip practice since it creates rehearsed responses",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Why behavioral interviews determine senior leveling",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL reasons why behavioral interviews are the primary mechanism for senior-level (E5+) hiring decisions:",
        explanation:
          "Senior engineers must own business problems end-to-end, navigate organizational complexity, build stakeholder trust, and drive impact beyond their immediate team — all assessed behaviorally. AI commoditizing implementation makes these skills the primary differentiator. Many candidates pass the technical bar, so the behavioral breaks ties. However, behavioral interviews do not evaluate system design depth (that's the system design round) and they don't assess speed of algorithm implementation (that's the coding round).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Senior capabilities (ownership, stakeholder management, cross-team influence) can only be assessed through past behavior",
              isCorrect: true,
            },
            {
              id: "b",
              text: "As AI handles implementation, the differentiating skills shift to judgment, alignment, and vision — which are assessed behaviorally",
              isCorrect: true,
            },
            {
              id: "c",
              text: "In competitive markets, many candidates clear the technical bar, so behavioral is the tiebreaker",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Behavioral interviews evaluate system design depth at a higher level than the technical round",
              isCorrect: false,
            },
            {
              id: "e",
              text: "They assess speed of algorithm implementation under pressure",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Explain CARL vs STAR with an example",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Compare the CARL and STAR response frameworks. Using a real or hypothetical example of answering "Tell me about a time you improved a process," demonstrate how a CARL response differs from a STAR response. Explain why the difference matters for senior-level interviews.',
        explanation:
          "A strong answer shows: (1) STAR gives a solid structure but ends at the Result, (2) CARL adds Learnings which demonstrates self-awareness and growth, (3) the Learnings component is what separates senior from junior responses because it shows you extract patterns from experience and apply them going forward.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'STAR provides: Situation (context), Task (what needed doing), Action (what you did), Result (outcome). For the process improvement question, a STAR response might end with: "The result was a 40% reduction in deployment time."\n\nCARL restructures this as: Context (merges Situation and Task to keep it concise), Actions (what you did — plural, emphasizing multiple steps), Results (quantified outcomes), Learnings (what you took away). The CARL response would add: "I learned that the biggest leverage for process improvement isn\'t the tooling itself, but getting buy-in from the three most skeptical engineers first. They became advocates and adoption happened organically. I\'ve since applied this pattern to two other process changes."\n\nThe Learnings component matters for senior-level interviews because: (1) It shows you don\'t just execute — you extract reusable patterns from experience. (2) It demonstrates self-awareness and a growth mindset, which interviewers associate with coachability. (3) It signals that you\'ll bring this behavior to the new role, not just the specific skills from one project. At the staff level, interviewers want evidence that you\'re a "learning machine" — someone who compounds their effectiveness over time.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Decode a behavioral question",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'You\'re interviewing at Amazon and the interviewer asks: "Tell me about a time you made a decision without having all the data you needed." Walk through the Decode step: What signal area(s) does this map to? Which Amazon Leadership Principle(s) does this invoke? What is the interviewer really trying to assess, and how should that influence your story selection?',
        explanation:
          "A strong answer identifies the signal area (Ambiguity / Decision-Making), maps to relevant LPs (Bias for Action, potentially Have Backbone), identifies the deeper assessment (can you move forward with incomplete information and manage risk), and explains why the story should show decisive action with a risk-mitigation strategy, not just any decision.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Decode analysis:\n\nSignal Area: This maps primarily to "Handling Ambiguity" — the ability to make progress when the path is unclear. Secondary signal: "Decision-Making" — quality of judgment under uncertainty.\n\nAmazon Leadership Principles: "Bias for Action" is the primary LP — "Speed matters in business. Many decisions and actions are reversible and do not need extensive study. We value calculated risk taking." Secondary: "Are Right, A Lot" — they want people who make good calls even with imperfect information.\n\nWhat the interviewer really wants to see: Not just that you made a decision, but HOW you decided. Did you identify what information was missing? Did you assess whether the decision was reversible? Did you set up mechanisms to validate your decision after the fact? Did you move fast without being reckless?\n\nStory selection implications: Choose a story where you (1) identified the information gap explicitly, (2) made a reasoned judgment call with a clear rationale, (3) took action while setting up guardrails (metrics, rollback plans, check-ins), and (4) the outcome validated your approach — or if it didn\'t, you learned and course-corrected quickly. Avoid stories where you waited until you had all the data — that signals the opposite of what Amazon values.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design your story catalog strategy",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You have 2 weeks to prepare for a Staff Engineer behavioral interview at Meta. Design your story catalog strategy: How many stories do you need? How do you map them to signal areas? How do you handle the "Big Three" questions? What\'s your practice progression? Address the tradeoff between breadth of stories and depth of preparation.',
        explanation:
          "A staff-level answer demonstrates meta-strategy about behavioral preparation: story count (6-10 core stories), mapping to signal areas for coverage, Big Three special treatment, progressive practice, and the insight that depth (having 2-3 deeply practiced stories you can adapt) beats breadth (15 shallow stories).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Story catalog strategy for Staff Engineer at Meta:\n\n1. Story count and coverage: I need 8-10 core stories that cover the 8 signal areas with some overlap. Each story should map to 2-3 signal areas so I can adapt it. At the staff level, stories should demonstrate cross-team influence, technical vision, and organizational impact.\n\n2. Signal area mapping: Create a matrix — stories as rows, signal areas as columns. Mark primary and secondary coverage. Identify gaps. I need at least one strong story for: Ownership, Conflict Resolution, Ambiguity, Growth/Learning, Perseverance, Cross-functional Leadership, Technical Vision, Mentorship.\n\n3. Big Three preparation: "Tell me about yourself" (2-minute career arc emphasizing the trajectory toward staff-level scope), "Favorite project" (my highest-impact, most technically complex project with clear staff-level behaviors), "A conflict" (a nuanced interpersonal situation with no clear villain, showing EQ and resolution skills). These three get extra practice time because they appear in nearly every loop.\n\n4. Practice progression (over 2 weeks):\n   - Days 1-3: Journal and identify candidate stories. Write rough CARL outlines.\n   - Days 4-6: Refine stories solo. Record yourself and review for filler, pacing, clarity.\n   - Days 7-9: Practice with AI tools for rapid iteration.\n   - Days 10-12: Peer mock interviews for realistic pressure and feedback.\n   - Days 13-14: One professional mock if possible. Otherwise, final solo run-through of Big Three.\n\n5. Breadth vs depth tradeoff: Depth wins. I\'d rather have 6 stories I can tell flawlessly and adapt to any question than 15 stories I stumble through. The Decode-Select-Deliver framework means any well-prepared story can be tilted to address different signal areas. My 3-4 deepest stories will cover 80% of questions through reframing.\n\n6. Meta-specific adjustments: Emphasize "Move Fast" culture — stories should show bias for action and pragmatic tradeoffs. Highlight cross-functional collaboration (Meta values ICs who partner with PM and design). Reference impact metrics quantitatively.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Behavioral interview as a leveling mechanism",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Explain how behavioral interviews function as the primary leveling mechanism in FAANG hiring. A candidate who aces all coding rounds and the system design round still gets downleveled from E5 to E4. What specific behavioral signals separate an E4 response from an E5 response for the same question? Use "Tell me about a time you improved something on your team" as the example question.',
        explanation:
          "A strong answer explains the scope/impact gradient across levels, gives concrete examples of how the same question would be answered differently at E4 vs E5, and connects this to the three assessment frameworks.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Behavioral interviews are the leveling mechanism because they\'re the only round that reveals the scope at which you operate. Technical rounds establish a pass/fail bar, but behaviorals determine the level.\n\nE4 response to "Tell me about a time you improved something on your team":\n"I noticed our code reviews were slow, so I created a checklist for common issues and shared it with the team. Review time dropped from 2 days to same-day. My manager liked it and asked me to present it at the team meeting."\n\nThis demonstrates: individual execution, solving a problem you were given or noticed, impact limited to your immediate team, and passive recognition (manager noticed).\n\nE5 response to the same question:\n"I identified that our team\'s deployment velocity was 40% below sister teams. I investigated root causes — our CI pipeline had 3 flaky test suites, our review process created bottlenecks, and we had no deployment SLOs. I proposed a 3-sprint initiative: I personally fixed the flaky tests, designed a tiered review process (P1 changes need 2 reviewers, P3 changes need 1), and established a deployment SLO that I tracked in our weekly metrics review. I also partnered with the platform team to get our pipeline prioritized for their migration to the new build system. Over 2 months, we went from 40% below to 10% above the org average. More importantly, I documented the playbook and two other teams adopted it."\n\nThis demonstrates: proactive problem identification at team scope, root cause analysis across multiple dimensions, multi-stakeholder coordination (platform team), setting up measurement systems (SLOs), and cross-team impact (playbook adoption).\n\nKey E4→E5 signal differences:\n- Scope: own task → own team + adjacent teams\n- Initiative: solve given problems → identify and scope problems independently\n- Impact: local improvement → systemic improvement with documentation\n- Influence: individual execution → influencing others and creating leverage\n- Measurement: anecdotal outcomes → quantified impact with tracking systems',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Adapting behavioral responses across companies",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "You have the same story about resolving a cross-team technical disagreement. Explain how you would tell this story differently at Amazon vs Meta vs Google, referencing each company's cultural expectations and values. What specific language, framing, and emphasis would change?",
        explanation:
          "A staff-level answer demonstrates understanding of the cultural assessment framework: Amazon values data-driven ownership and bias for action (LP-focused), Meta values moving fast and shipping iteratively, Google values consensus-building and technical rigor. The same story should be reframed with different language and emphasis for each.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Same story, three framings:\n\nThe story: I disagreed with a partner team\'s API design choice that I believed would create performance issues at scale. I gathered data, proposed an alternative, and we reached a resolution.\n\nAmazon framing (LP-driven):\n- Language: "I had conviction that the design wouldn\'t scale" (Have Backbone), "I created a proof-of-concept in two days rather than waiting for the next planning cycle" (Bias for Action), "I wrote a one-pager with load test data showing the 10x latency difference" (Dive Deep).\n- Emphasis: Data-driven decision-making, willingness to disagree openly, customer impact ("this would have added 200ms to the customer-facing API"), and then committing fully once the decision was made.\n- Avoid: Don\'t emphasize consensus-seeking or extended deliberation — Amazon values decisive action.\n\nMeta framing (Move Fast, Open Culture):\n- Language: "I didn\'t want to block their timeline" (Move Fast), "I posted my analysis in our internal group for open discussion" (Open/Transparent), "We shipped a compromise in the same sprint and validated with production data" (Impact).\n- Emphasis: Speed of resolution, shipping something and iterating, direct communication without politics, quantified impact on product metrics.\n- Avoid: Don\'t emphasize long deliberation processes or formal documentation — Meta values moving fast and fixing things.\n\nGoogle framing (Consensus, Technical Rigor):\n- Language: "I presented my analysis at the design review" (peer review culture), "I proposed running both approaches through a formal benchmark suite" (technical rigor), "We built consensus by letting the data speak" (data-driven consensus).\n- Emphasis: Thoroughness of technical analysis, building agreement across stakeholders, peer review process, long-term architectural implications.\n- Avoid: Don\'t emphasize unilateral decisions or moving without consensus — Google values collective technical judgment.\n\nIn all three framings, the facts are the same. What changes: the verbs you use, which parts you emphasize (speed vs rigor vs data), and the cultural lens you apply. The Decode step tells you which cultural lens to activate.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Behavioral preparation advice for a junior engineer",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A junior engineer with 2 years of experience says: \"I don't have impressive stories for behavioral interviews. I haven't led any projects, resolved any big conflicts, or driven any major initiatives. What do I even talk about?\" Using the principles from this material, advise them on how to approach behavioral preparation. Address the misconception and provide a concrete strategy.",
        explanation:
          'A strong answer addresses the core insight that "your stories are probably enough," reframes what interviewers look for at junior levels, and provides a concrete excavation strategy for finding impactful stories in seemingly routine work.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'First, the key insight: "Most people who struggle with behavioral interviews don\'t lack experience. Your stories are probably enough. What\'s missing is a framework for presenting them clearly."\n\nThe misconception: You\'re comparing yourself to senior/staff engineers and thinking you need their caliber of stories. You don\'t. Interviewers calibrate expectations to the level you\'re applying for. For a junior-to-mid role, they\'re looking for different signals:\n\n1. Learning velocity: How quickly do you pick up new things? Story: "I was assigned a bug in a service I\'d never touched. I spent a day reading the codebase, identified the root cause was a race condition in the caching layer, and shipped a fix with tests. My tech lead said it would have taken them the same amount of time." This demonstrates initiative and technical learning.\n\n2. Ownership at your scope: Did you take responsibility for your work? Story: "I noticed my PR review turnaround was slowing down the team, so I set a personal SLO of reviewing within 4 hours. I also started leaving more detailed comments explaining my reasoning, and a teammate told me my reviews were the most helpful on the team."\n\n3. Collaboration and communication: How do you work with others? Even daily standups, pair programming sessions, or asking good questions count.\n\nExcavation strategy:\n- Journal for 3 days. Write down everything you did at work that required a decision, a conversation, or overcoming an obstacle.\n- For each entry, ask: What did I learn? What would I do differently? What was my specific contribution?\n- You\'ll find that "routine" work contains rich behavioral signals when examined through the CARL framework.\n- Focus on the Actions and Learnings components — these are where junior engineers consistently undersell themselves.\n\nRemember: concrete details over vague claims. "I fixed a bug" is forgettable. The specific story with the caching race condition is memorable. You have these stories. You just need to excavate them.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Name the response framework",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What is the name of the response framework that improves on STAR by merging Situation/Task into a single element and adding a component that captures what you learned from the experience?",
        explanation:
          'CARL (Context, Actions, Results, Learnings) improves on STAR by keeping the setup concise with a single "Context" element and adding "Learnings" to demonstrate self-awareness and growth mindset.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "CARL",
          acceptableAnswers: [
            "CARL",
            "carl",
            "Carl",
            "CARL framework",
            "The CARL framework",
            "Context Actions Results Learnings",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "The behavioral interview loop",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What is the name of the three-step cycle (loop) that runs in your head as you hear a behavioral question, consider your options, and formulate your answer? List the three steps in order.",
        explanation:
          "The Decode, Select, Deliver loop: (1) Decode what the interviewer is really asking, (2) Select the right story from your catalog (prioritizing scope, then relevance, then uniqueness, then recency), (3) Deliver using the CARL framework.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Decode, Select, Deliver",
          acceptableAnswers: [
            "Decode, Select, Deliver",
            "Decode Select Deliver",
            "decode, select, deliver",
            "decode select deliver",
            "DSD",
            "Decode-Select-Deliver",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Story selection top priority",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "When selecting which story to tell in a behavioral interview, what is the #1 priority criterion — the attribute you should optimize for first before considering relevance, uniqueness, or recency? Explain in one sentence why this is the top priority.",
        explanation:
          "Highest scope is the #1 priority because scope is the strongest signal for leveling. A story demonstrating that you operated at or above the target level — even if only partially relevant — is more valuable than a perfectly relevant story at a lower scope. Leveling decisions are heavily influenced by the scope patterns you demonstrate.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Highest scope",
          acceptableAnswers: [
            "Highest scope",
            "highest scope",
            "Scope",
            "scope",
            "High scope",
            "high scope",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "The Big Three behavioral questions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'What are the "Big Three" behavioral questions that come up in nearly every interview loop and deserve special preparation time? List all three.',
        explanation:
          'The Big Three are: (1) "Tell me about yourself" — your career narrative and positioning, (2) "Tell me about your favorite project" — your highest-impact, most engaging work, (3) "Tell me about a conflict" — your interpersonal and emotional intelligence. These appear so frequently that they deserve dedicated practice beyond your general story catalog.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "Tell me about yourself, Tell me about your favorite project, Tell me about a conflict",
          acceptableAnswers: [
            "Tell me about yourself, Tell me about your favorite project, Tell me about a conflict",
            "about yourself, favorite project, conflict",
            "yourself, favorite project, a conflict",
            "Tell me about yourself; favorite project; a conflict",
          ],
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
        content: "Match each CARL framework component to what it should communicate:",
        explanation:
          "Context sets up the situation concisely (replacing STAR's separate Situation and Task). Actions describe the specific steps you personally took. Results quantify the outcome and impact. Learnings demonstrate what you extracted from the experience — showing self-awareness and growth mindset.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Context",
              right: "Concise setup of the situation and what needed to be done",
            },
            {
              id: "p2",
              left: "Actions",
              right: "The specific steps you personally took to address the situation",
            },
            {
              id: "p3",
              left: "Results",
              right: "Quantified outcomes and measurable impact of your actions",
            },
            {
              id: "p4",
              left: "Learnings",
              right: "What you took away and how you've applied it since",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match misconception to why it fails",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each common behavioral interview misconception to the reason it leads to poor outcomes:",
        explanation:
          '"Just be yourself" fails because you miss opportunities to showcase impact. "Memorize questions" fails because behavioral questions vary too much across interviewers. "STAR is enough" fails because it doesn\'t tell you which stories to choose or how to adapt to context. "Manager just wants social fit" fails because they\'re also evaluating repeatable behavior patterns that predict job performance.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: '"No prep required, just be yourself"',
              right: "You miss opportunities to strategically showcase impact and contributions",
            },
            {
              id: "p2",
              left: '"Memorize the company\'s most-asked questions"',
              right: "Behavioral questions vary too much across interviewers to predict",
            },
            {
              id: "p3",
              left: '"The STAR method is all I need"',
              right:
                "Story structure alone doesn't address story selection or contextual adaptation",
            },
            {
              id: "p4",
              left: '"The manager is just looking for social fit"',
              right:
                "They're also evaluating repeatable behavior patterns that predict role performance",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match assessment framework to what it reveals",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each assessment framework to the type of information the interviewer extracts from it:",
        explanation:
          "Signal areas provide structured competency scores (e.g., \"Strong Hire on Ownership\"). Company values map candidate behaviors to what predicts success at that specific company. Cultural assessment evaluates whether the candidate will function effectively within the company's specific operating model. The Decode-Select-Deliver loop is the candidate's internal process, not an interviewer framework — it helps the candidate map questions to the right framework and story.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Signal Areas",
              right:
                "Structured competency ratings across 8 dimensions (Ownership, Perseverance, etc.)",
            },
            {
              id: "p2",
              left: "Company Values",
              right: "Alignment with qualities that predict success at this specific company",
            },
            {
              id: "p3",
              left: "Cultural Assessment",
              right: "Whether you'll function within the company's unwritten operating norms",
            },
            {
              id: "p4",
              left: "Decode-Select-Deliver",
              right: "Candidate's internal framework for mapping questions to the right story",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "CARL Learnings component",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The CARL framework adds a _____ component that STAR lacks, which demonstrates self-awareness and growth mindset to the interviewer.",
        explanation:
          "The Learnings component is the key addition in CARL over STAR. It captures what you took away from the experience and how you've applied it since. This signals maturity, coachability, and the ability to extract reusable patterns from experience — all valued at senior levels.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "The CARL framework adds a {{blank1}} component that STAR lacks, which demonstrates self-awareness and growth mindset to the interviewer.",
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
      title: "Behavioral interviewers as forecasters",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Behavioral interviewers are _____. They use your past behavior to predict your future performance in the role.",
        explanation:
          "Behavioral interviewers are forecasters. Unlike investments where past performance doesn't predict future results, with people, past behavior is a reliable predictor of future behavior. This is the fundamental premise underlying all behavioral interviewing.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Behavioral interviewers are {{blank1}}. They use your past behavior to predict your future performance in the role.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "forecasters",
              acceptableAnswers: ["forecasters", "Forecasters", "predictors"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Story selection priority",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "When selecting a behavioral story, the priority order is: highest _____, then most relevant, then most unique, then most _____.",
        explanation:
          "The priority order is: highest scope (because scope is the strongest signal for leveling), most relevant (directly maps to the signal area), most unique (differentiates you from other candidates), most recent (signals current capability). Scope comes first because even a partially relevant story at the right scope demonstrates you operate at the target level.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "When selecting a behavioral story, the priority order is: highest {{blank1}}, then most relevant, then most unique, then most {{blank2}}.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "scope",
              acceptableAnswers: ["scope", "Scope"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "recent",
              acceptableAnswers: ["recent", "Recent"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
