/**
 * Behavioral: The Big Three Questions — Interview Prep Content
 * Based on HelloInterview extract
 * Covers: TMAY (Tell Me About Yourself), Favorite Project, Conflict Resolution,
 * plus the bonus "Do you have any questions?" preparation
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const behavioralBigThreeContent: StoryPointSeed = {
  title: "Preparing for the Big Three Questions",
  description:
    "Master the three most common and highest-impact behavioral interview questions: Tell Me About Yourself (TMAY), Tell Me About Your Favorite Project, and Tell Me About a Time You Resolved a Conflict. Includes preparation strategies, story selection, and common mistakes to avoid.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: TMAY — Tell Me About Yourself
    {
      title: "Tell Me About Yourself (TMAY) — Structure & Strategy",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Tell Me About Yourself (TMAY) — Structure & Strategy",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Why TMAY Matters",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                'TMAY (pronounced "tee-may") is the most ubiquitous interview question across all rounds — from recruiter screens to behavioral loops. It appears in casual networking, hiring manager conversations, and formal behavioral interviews. Nailing TMAY sets the tone for the entire session and accomplishes four critical goals: breaking the ice, setting your scope and context, steering the conversation toward your strongest stories, and expressing genuine passion for the role.',
            },
            {
              id: "b3",
              type: "heading",
              content: "The Three-Part TMAY Structure",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                "Keep your TMAY between 30 seconds and 2 minutes. The ideal response covers three parts: a Personal Summary, key Accomplishments, and a Forward-Looking Statement.",
            },
            {
              id: "b5",
              type: "heading",
              content: "1. Personal Summary",
              metadata: { level: 3 },
            },
            {
              id: "b6",
              type: "paragraph",
              content:
                "Start with a couple of sentences introducing yourself — think of it as a condensed LinkedIn About section. Mention your role (e.g., backend engineer, full-stack developer), years of experience and title, and a unique trait or focus that sets you apart. Tailor this to the job: if the role is frontend, don't introduce yourself as a backend specialist.",
            },
            {
              id: "b7",
              type: "heading",
              content: "2. Accomplishments (2–3)",
              metadata: { level: 3 },
            },
            {
              id: "b8",
              type: "paragraph",
              content:
                "Highlight key achievements that showcase core skills and business impact, align with the target role, and ideally can be expanded upon in later questions (creating natural hooks for deeper discussion). Each accomplishment should be one concise sentence with a touch of technical detail and business impact. This isn't the time for full STAR/CARL stories — keep it high level and intriguing. Your goal is to pique interest, not exhaust it.",
            },
            {
              id: "b9",
              type: "heading",
              content: "3. Forward-Looking Statement",
              metadata: { level: 3 },
            },
            {
              id: "b10",
              type: "paragraph",
              content:
                "End with a sentence or two connecting your past to the role you're pursuing and what you're hoping for in the future. This wraps up your TMAY and hands the conversation back to the interviewer. Help the interviewer see the thread between your past work and the role — if they see this as both the ideal next step for you and the right background for them, you're off to a solid start.",
            },
            {
              id: "b11",
              type: "heading",
              content: "TMAY Scales with Seniority",
              metadata: { level: 2 },
            },
            {
              id: "b12",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'New Grad: Prioritize work experience over personal/school projects. Highlight key features as "business impact" since real-world metrics may not exist.',
                  "Mid-Level (4-5 yrs): Establish who you are and what you care about. Accomplishments should have quantified impact. Connect experience to this specific opportunity.",
                  "Senior (10+ yrs): Talk about scope spanning teams, organizational migrations, and mentoring. Signals of leadership beyond individual contribution.",
                  "People Manager: Focus on team building, engineering culture, and scaling organizations. Make stronger statements about the value you bring.",
                ],
              },
            },
            {
              id: "b13",
              type: "heading",
              content: "Handling Complex Career Situations",
              metadata: { level: 2 },
            },
            {
              id: "b14",
              type: "paragraph",
              content:
                'If your career includes layoffs, gaps, or short stints, address them proactively and concisely. Set the narrative yourself to avoid misinterpretation. Brief, honest, forward-looking — then move on. For gaps: address skill atrophy concerns ("I took six months to upskill in cloud architecture"). For layoffs: address performance concerns ("the entire Growth team was cut"). For short stints: address commitment concerns ("early-stage startups accelerated my growth but none found product-market fit").',
            },
            {
              id: "b15",
              type: "heading",
              content: "Common TMAY Mistakes",
              metadata: { level: 2 },
            },
            {
              id: "b16",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "The History Lesson: Chronological walkthrough of every job. Makes older experience seem equally important as recent work. Focus on highlights instead.",
                  'The Childhood Origin Story: "I\'ve been coding since age 6..." — share professionally relevant aspects, not your biography.',
                  "Less Is Not More: Omitting accomplishments entirely. Many interviewers haven't read your resume — guide them toward your best stories.",
                  "Being Negative About Former Employers: \"My current company has poor engineering...\" makes the listener wonder if you're the problem. Frame motivation positively toward what you're headed for.",
                ],
              },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 2: Favorite Project & Conflict Resolution
    {
      title: "Favorite Project & Conflict Resolution — Choosing and Delivering Your Core Stories",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title:
            "Favorite Project & Conflict Resolution — Choosing and Delivering Your Core Stories",
          blocks: [
            {
              id: "fp1",
              type: "heading",
              content: "Tell Me About Your Favorite Project",
              metadata: { level: 2 },
            },
            {
              id: "fp2",
              type: "paragraph",
              content:
                'This question — whether phrased as "favorite project," "most impactful project," or "a time you solved an ambiguous problem" — is a major signal in behavioral interviews. Interviewers want to understand the scope you\'ve operated at and how you accomplish things end to end. The answer alone often predicts the interview outcome. It doesn\'t matter how the question is phrased — respond with the same well-prepared story that presents the most complete picture of your career.',
            },
            {
              id: "fp3",
              type: "heading",
              content: "Choosing Your Flagship Story: Three Dimensions",
              metadata: { level: 3 },
            },
            {
              id: "fp4",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Impact: Choose work that moved meaningful business metrics — revenue, retention, performance, cost savings. Quantifiable results with specific numbers are ideal.",
                  "Scope: Look for projects spanning weeks/months with cross-functional collaboration, requiring both technical and non-technical problem-solving. Ensure it relates to your target role.",
                  "Personal Contribution: You must be a primary driver, not just a participant. Clear ownership of significant decisions and actions that influenced the outcome.",
                ],
              },
            },
            {
              id: "fp5",
              type: "paragraph",
              content:
                "The sweet spot is where all three intersect. If you can't find a project scoring highly on all three, prioritize personal contribution — a smaller project where you led everything is better than a massive initiative where your role was peripheral.",
            },
            {
              id: "fp6",
              type: "heading",
              content: "Delivering Your Flagship Story",
              metadata: { level: 3 },
            },
            {
              id: "fp7",
              type: "paragraph",
              content:
                'Since you\'re discussing a project of meaningful size, organize your response into themes (groups of Actions) and use the Table of Contents technique — signpost the themes upfront so the interviewer can follow your narrative. Prepare for the common follow-ups that always come: "Were there any conflicts?" "What was the hardest part?" "What would you do differently?" Never let a follow-up catch you off guard on your flagship story.',
            },
            {
              id: "fp8",
              type: "heading",
              content: "Tell Me About a Time You Resolved a Conflict",
              metadata: { level: 2 },
            },
            {
              id: "fp9",
              type: "paragraph",
              content:
                "Conflict resolution ability is a key indicator of seniority. If there's a red flag on this question, you are very likely not to get hired. Many companies refuse to hire people who can't navigate conflict constructively, no matter how brilliant they are. Conflict isn't something to be avoided — it's a sign of being involved in meaningful work with other smart coworkers. \"I don't have conflicts with coworkers\" is a red flag because it doesn't fit with modern perceptions of healthy workplace dynamics.",
            },
            {
              id: "fp10",
              type: "heading",
              content: "Types of Workplace Conflicts",
              metadata: { level: 3 },
            },
            {
              id: "fp11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Technical disagreements: "My teammate wanted NoSQL; I pushed for PostgreSQL due to ACID transaction needs."',
                  'Prioritization conflicts: "Product wanted three new features; I advocated spending half the sprint on tech debt causing daily on-call issues."',
                  'Timeline pushback: "Leadership wanted to ship immediately; I insisted on adding input validation after showing security vulnerabilities."',
                  'Resource allocation: "Infra team couldn\'t provision until Q2; I worked with them on a temporary solution using existing capacity."',
                  'Process changes: "I wanted TypeScript to reduce production bugs; senior engineers were concerned about migration overhead."',
                ],
              },
            },
            {
              id: "fp12",
              type: "heading",
              content: "Choosing the Right Conflict Story",
              metadata: { level: 3 },
            },
            {
              id: "fp13",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "High stakes: The scope of your conflicts is a reliable indicator of your level. System design conflicts > code formatting conflicts.",
                  "Deeply involved: You must be a central player who took action to bring about resolution.",
                  "You were right (at least partially): Prefer stories where your position was vindicated. When asked about being wrong, choose situations where your initial position was reasonable given available information.",
                ],
              },
            },
            {
              id: "fp14",
              type: "heading",
              content: "Elements of Successful Conflict Stories",
              metadata: { level: 2 },
            },
            {
              id: "fp15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Be proactive in raising concerns — confront conflicts directly with coworkers.",
                  "Only start constructive conflicts — what you care about reflects on your maturity.",
                  "Seek to understand before being understood — gather more information first.",
                  "Choose the right communication channels — PR comments are rarely effective for conflict resolution.",
                  "Demonstrate empathy — express understanding of the other party's position.",
                  "Use data to make decisions — collect evidence and build proof-of-concepts where possible.",
                  "Involve the right coworkers at the right time — not too early (drama) or too late (stalled).",
                  "Come to a clear resolution — even if the outcome wasn't what you wanted.",
                  "Preserve relationships — coworkers should still want to work with you after the conflict.",
                ],
              },
            },
            {
              id: "fp16",
              type: "heading",
              content: "The Result Includes the Relationship",
              metadata: { level: 3 },
            },
            {
              id: "fp17",
              type: "paragraph",
              content:
                "When presenting the Result of a conflict story, always include the state of the relationships afterward. Cite evidence of future successful collaborations when possible. If relationships were damaged, tread carefully and explain why the interviewer should still trust your conflict resolution skills. Don't sanitize emotional content — if someone yelled at you, say that. But maintain an even, professional, journalistic tone focused on facts.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Bonus — Questions to Ask & Pulling It All Together
    {
      title: "Bonus: Questions to Ask Interviewers & Pulling It All Together",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Bonus: Questions to Ask Interviewers & Pulling It All Together",
          blocks: [
            {
              id: "qa1",
              type: "heading",
              content: 'The Question Everyone Forgets: "Do You Have Questions for Me?"',
              metadata: { level: 2 },
            },
            {
              id: "qa2",
              type: "paragraph",
              content:
                "\"No, I think you covered everything\" is a massive missed opportunity. Having thoughtful questions shows genuine interest, engagement, and that you're evaluating the company as seriously as they're evaluating you. Prepare 3-5 questions for each type of interviewer: hiring managers, peers, skip-levels, and cross-functional partners.",
            },
            {
              id: "qa3",
              type: "heading",
              content: "Good Questions by Category",
              metadata: { level: 3 },
            },
            {
              id: "qa4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Role-specific: "What does success look like in the first 90 days?" or "What\'s the most important problem you\'re hoping this hire will solve?"',
                  'Team dynamics: "How does the team handle disagreements on technical decisions?" or "How do engineers collaborate with product managers here?"',
                  'Growth: "What opportunities are there for learning and development?"',
                  'Challenges: "What\'s the biggest challenge the team is facing right now?"',
                  'Culture: "What do you personally enjoy most about working here?"',
                ],
              },
            },
            {
              id: "qa5",
              type: "heading",
              content: "Questions to Avoid",
              metadata: { level: 3 },
            },
            {
              id: "qa6",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Anything easily Googleable — "What does your company do?" shows you didn\'t prepare.',
                  "Compensation and benefits — save these for the recruiter, not your interviewers.",
                  "Questions that sound like pre-offer negotiating.",
                  '"How did I do?" — puts the interviewer in an awkward position with no useful answer.',
                ],
              },
            },
            {
              id: "qa7",
              type: "heading",
              content: "Tailor Questions to the Interviewer",
              metadata: { level: 3 },
            },
            {
              id: "qa8",
              type: "paragraph",
              content:
                "Ask the hiring manager about team challenges. Ask peers about day-to-day work. Ask leadership about company direction. Senior candidates should ask more strategic questions — show you can be an expert partner in leading their organization.",
            },
            {
              id: "qa9",
              type: "heading",
              content: "Your Big Three Preparation Checklist",
              metadata: { level: 2 },
            },
            {
              id: "qa10",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Write your TMAY using the three-part structure (Personal Summary → Accomplishments → Forward-Looking Statement). Time yourself: target 30 seconds to 1 minute.",
                  "Identify your Flagship Story. Does it optimize for Impact, Scope, and Personal Contribution? Write a Table of Contents structure. Prepare for common follow-ups.",
                  "Prepare your Conflict Story. High stakes? Deeply involved? Were you right? Write the full CARL with emphasis on resolution actions.",
                  "Write 3+ questions you'll ask interviewers — at least one for each interviewer type you'll encounter.",
                ],
              },
            },
            {
              id: "qa11",
              type: "quote",
              content:
                "\"These four preparations will serve you in virtually every behavioral interview you do. Since you know they're coming, you have an opportunity to prepare polished, practiced responses you can deliver confidently even when you're nervous.\"",
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
      title: "Ideal TMAY length",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the recommended length for a Tell Me About Yourself (TMAY) response in a behavioral interview?",
        explanation:
          "The ideal TMAY is 30 seconds to 2 minutes. Interviewers want enough context to orient themselves but are eager to dive into their more substantive questions. Going too long eats into time that should be spent delivering signal through stories — the content that actually gets you hired.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "30 seconds to 2 minutes",
              isCorrect: true,
            },
            {
              id: "b",
              text: "5 to 10 minutes — cover your full career history",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Under 10 seconds — just your name and title",
              isCorrect: false,
            },
            {
              id: "d",
              text: "3 to 5 minutes — include detailed CARL stories for each accomplishment",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "TMAY three-part structure",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content: "What is the recommended three-part structure for a strong TMAY response?",
        explanation:
          'The recommended structure is Personal Summary → Accomplishments (2-3) → Forward-Looking Statement. This structure introduces who you are, highlights your best work, and connects your past to the role you\'re pursuing. It avoids the "history lesson" anti-pattern and keeps the response concise and impactful.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Personal Summary → Accomplishments → Forward-Looking Statement",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Education → Work History → Hobbies",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Childhood Origin Story → Career Timeline → Why I Want This Job",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Technical Skills → Projects → References",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: 'Why "I don\'t have conflicts" is a red flag',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'Why does saying "I don\'t have conflicts with coworkers" raise a red flag for interviewers at tech companies?',
        explanation:
          "In modern tech company culture, conflict is viewed as a natural and healthy result of smart people caring deeply about outcomes. Saying you never have conflicts suggests you either avoid disagreement, don't care enough about outcomes, or lack the self-awareness to recognize conflicts you've been part of. All of these are negative signals for seniority and collaboration.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "It suggests you either avoid necessary disagreements or lack self-awareness about workplace dynamics",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It shows you're too junior to have encountered real problems",
              isCorrect: false,
            },
            {
              id: "c",
              text: "It means you haven't worked at a large enough company",
              isCorrect: false,
            },
            {
              id: "d",
              text: "It proves you can't work on a team",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Prioritizing flagship story dimensions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'When selecting your flagship "favorite project" story, you should optimize for Impact, Scope, and Personal Contribution. If you cannot find a project that scores highly on all three, which dimension should you prioritize above the others?',
        explanation:
          "Personal contribution is the most critical dimension because the interviewer wants to understand what YOU specifically did. A smaller project where you led everything is more convincing than a massive initiative where your role was peripheral. Impact and scope can be impressive, but if you can't clearly demonstrate your own ownership and decision-making, the interviewer has no signal to evaluate.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Personal Contribution — a smaller project where you led everything outweighs a massive initiative with a peripheral role",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Impact — the bigger the business result, the more the interviewer will be impressed",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Scope — larger scope demonstrates you can handle complex systems",
              isCorrect: false,
            },
            {
              id: "d",
              text: "All three are equally important — never compromise on any dimension",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "TMAY accomplishment depth level",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When listing accomplishments in your TMAY, what level of detail should each accomplishment have?",
        explanation:
          "TMAY accomplishments should be one concise sentence each with a touch of technical detail and business impact — enough to pique interest but not exhaust it. Full STAR/CARL stories are for later questions. The goal is to create natural hooks that the interviewer will want to explore deeper, steering the conversation toward your strongest material.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "One concise sentence per accomplishment with a touch of technical detail and business impact — pique interest, don't exhaust it",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Full STAR/CARL response for each accomplishment to demonstrate thoroughness",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Just the project name and your title — let the interviewer ask for details",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Only technical details — business impact is irrelevant for engineering roles",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Conflict story: including emotional content",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When telling a conflict resolution story, should you include negative emotional content (e.g., someone yelling, anger, vindictiveness)?",
        explanation:
          "Don't sanitize negative emotional content from your conflict stories. If someone yelled at you, say that. If an executive was threatening, describe how it affected you and your team. Present it in an even, professional, journalistic tone focused on facts. This shows your conflict resolution skills extend to handling emotionally charged situations — which is precisely the signal the interviewer is evaluating.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Yes — include it factually in a professional, journalistic tone to show you handle emotionally charged situations",
              isCorrect: true,
            },
            {
              id: "b",
              text: "No — remove all negative emotions to appear calm and professional",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Only if the interviewer explicitly asks about emotional conflicts",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Yes — emphasize how upset you were to show you care deeply about the work",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Strategic TMAY for career gaps",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "You were laid off 8 months ago. For the last 6 months, you completed a cloud architecture certification and built an open-source project. Which TMAY approach best handles this situation?",
        explanation:
          "The best approach proactively addresses the gap, reframes it as deliberate skill development, and connects the learning to the target role. This addresses the interviewer's real concern (skill atrophy) head-on while maintaining a positive, forward-looking tone. Omitting the gap invites uncomfortable questions later. Being negative about the former employer casts doubt on your professionalism. Oversharing the layoff details makes it the focus instead of your capabilities.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Briefly mention the layoff context, highlight the certification and project as deliberate upskilling, and connect those new skills to the target role",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Omit the gap entirely and focus only on your previous roles and accomplishments",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Explain in detail why the layoff wasn't your fault and describe the company's poor management decisions",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Start with the certification as if it were a planned career move, never mentioning the layoff at all",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Conflict story: choosing when you were wrong",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'When an interviewer asks "Tell me about a time you were wrong," what kind of story should you choose?',
        explanation:
          "The key nuance is choosing a story where your initial position was reasonable given the information available at the time. This demonstrates humility and growth without looking like someone with poor judgment. If the interviewer can immediately see the flaw in your position, it undermines confidence in your decision-making ability. The goal is to show you can update your beliefs with new information — not that you made an obviously bad call.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "A situation where your initial position was reasonable given available information, but you changed your mind when new data emerged",
              isCorrect: true,
            },
            {
              id: "b",
              text: "A dramatic failure that shows maximum humility — the bigger the mistake, the more growth it demonstrates",
              isCorrect: false,
            },
            {
              id: "c",
              text: "A minor formatting or style preference disagreement to minimize risk",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Any conflict story where you eventually compromised, regardless of whether your initial position was defensible",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Goals of a strong TMAY",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content: "Select ALL goals that a well-delivered TMAY accomplishes:",
        explanation:
          "A strong TMAY breaks the ice and leaves a great first impression, sets context and scope (especially important when the interviewer hasn't reviewed your resume), steers the conversation toward your strongest stories, and expresses genuine passion. It should NOT try to cover your complete career history — that's the \"history lesson\" anti-pattern. Flattery like \"It's been my life's dream to interview here\" wastes precious time better spent on signal delivery.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Break the ice and leave a great first impression",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Set your context and scope, especially when the interviewer hasn't read your resume",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Steer the conversation toward topics that showcase the best of your career",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Express genuine passion for your role and the company",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Cover your complete career history from education to present day",
              isCorrect: false,
            },
            {
              id: "f",
              text: "Flatter the interviewer about the company to build rapport",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Elements of successful conflict resolution stories",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL elements that are hallmarks of a successful conflict resolution story in a behavioral interview:",
        explanation:
          "Successful conflict stories include proactive confrontation, seeking to understand before being understood, choosing the right communication channel, using data to inform decisions, and preserving relationships after resolution. Going to the other person's manager first (triangulating) is an anti-pattern — companies want to see you go directly to the source. Avoiding emotional content sanitizes the story and removes the evidence of your emotional composure.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "You sought to understand the other person's perspective before advocating your own",
              isCorrect: true,
            },
            {
              id: "b",
              text: "You used data or proof-of-concepts to support your position",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Relationships were preserved — coworkers still want to work with you",
              isCorrect: true,
            },
            {
              id: "d",
              text: "You chose the right communication channel rather than debating in PR comments",
              isCorrect: true,
            },
            {
              id: "e",
              text: "You went directly to the other person's manager to get the conflict resolved quickly",
              isCorrect: false,
            },
            {
              id: "f",
              text: "You removed all emotional content from the story to appear composed",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Good questions to ask interviewers",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL questions that are appropriate to ask your interviewer at the end of a behavioral interview:",
        explanation:
          'Good questions show genuine interest and help you evaluate the role. Asking about success metrics, team dynamics for disagreements, biggest challenges, and personal enjoyment are all strong choices. Asking about compensation should be saved for the recruiter. Asking "How did I do?" puts the interviewer in an awkward position. Asking what the company does suggests you didn\'t prepare.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: '"What does success look like in the first 90 days?"',
              isCorrect: true,
            },
            {
              id: "b",
              text: '"How does the team handle disagreements on technical decisions?"',
              isCorrect: true,
            },
            {
              id: "c",
              text: '"What\'s the biggest challenge the team is facing right now?"',
              isCorrect: true,
            },
            {
              id: "d",
              text: '"What do you personally enjoy most about working here?"',
              isCorrect: true,
            },
            {
              id: "e",
              text: '"What\'s the salary range for this position?"',
              isCorrect: false,
            },
            {
              id: "f",
              text: '"How did I do in this interview?"',
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Traits companies look for in conflict resolution",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL best practices that tech companies look for in how candidates handle conflict:",
        explanation:
          "Tech companies value assertiveness (speaking up regardless of power structures), going directly to the source (not triangulating), staying emotionally in control, focusing on outcomes over personal gain, and making data-driven decisions. Deferring to the most senior person violates meritocracy of ideas. Avoiding conflict with senior stakeholders signals inability to push back when needed. These traits are especially important at higher levels where navigating competing interests is a core part of the job.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Be assertive — disregard power structures when the greater good is at stake",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Go directly to the source — don't triangulate around conflicts or hide behind management",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Stay focused on outcomes — prioritize the organization/product/user over personal gain",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Make data-driven decisions — use fact-based persuasion and let data change your mind",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Defer to the most senior person in the room to show respect for the hierarchy",
              isCorrect: false,
            },
            {
              id: "f",
              text: "Avoid conflicts with senior stakeholders to protect your position",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Write your TMAY",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Write a complete TMAY (Tell Me About Yourself) response for a Senior Software Engineer applying to a mid-stage startup building developer tools. Use the three-part structure (Personal Summary, Accomplishments, Forward-Looking Statement). Target 30 seconds to 1 minute when spoken aloud.",
        explanation:
          "A strong TMAY has a clear personal summary establishing role and differentiator, 2-3 concise accomplishments with technical detail and business impact, and a forward-looking statement connecting past experience to the target role. Each accomplishment should be one sentence that piques interest without exhausting the topic.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "I'm a Senior Software Engineer with 8 years of experience specializing in backend systems and developer tooling. I'm passionate about building internal platforms that make engineering teams more productive.\n\nAt DataFlow, I led the design of a shared CI/CD pipeline framework that reduced deployment times by 60% across 12 microservices and was adopted by three other teams. Before that, at ScaleTech, I built an internal feature flag system that eliminated the need for release coordination meetings and cut our rollback frequency by 75%.\n\nI'm excited about bringing my platform engineering experience to a team where developer tools are the core product, not just internal infrastructure. The problems you're solving at [Company] around simplifying cloud deployments resonate with exactly the kind of challenges I want to tackle next.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Evaluate a TMAY for mistakes",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "Evaluate the following TMAY and identify the mistakes:\n\n\"I've been interested in coding since I was 8, when my dad got me my first computer. I started at Company A as a junior developer, then moved to Company B where I was a mid-level engineer, and now I'm at Company C as a senior. At Company A I worked on the billing system. At Company B I worked on the search feature. At Company C I'm working on infrastructure. My current company has really poor engineering practices and the codebase is a mess, which is why I'm looking for something new.\"",
        explanation:
          "The candidate should identify multiple anti-patterns: the Childhood Origin Story (irrelevant personal history), the History Lesson (chronological walkthrough of every job), accomplishments without impact metrics, and being negative about the current employer. A strong evaluation explains why each is problematic and suggests fixes.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'This TMAY contains four major mistakes:\n\n1. The Childhood Origin Story: Opening with "interested in coding since I was 8" wastes time on personally interesting but professionally irrelevant details. Start with who you are now.\n\n2. The History Lesson: The chronological walkthrough (Company A → B → C) makes older experience seem equally important as recent work. Instead, focus on the 2-3 most impactful highlights.\n\n3. No Impact or Detail in Accomplishments: "Worked on the billing system" tells the interviewer nothing about what was accomplished or why it mattered. Each accomplishment needs technical specificity and business impact (e.g., "redesigned the billing pipeline to reduce payment failures by 30%").\n\n4. Being Negative About the Current Employer: Criticizing the codebase and engineering practices makes the listener wonder if the candidate is the problem. It also exposes a lack of leadership initiative — why didn\'t you drive technical improvement? Instead, frame the motivation positively: "I\'m looking for a team tackling larger-scale infrastructure challenges."',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Flagship conflict story using CARL",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Tell a conflict resolution story using the CARL framework about a technical disagreement with a senior engineer over a major architectural decision. Include: high stakes, multiple resolution actions, data-driven decision-making, and the state of the relationship afterward.",
        explanation:
          "A staff-level answer demonstrates multiple conflict resolution actions (understanding the other side, gathering data, proposing compromise, involving the right people at the right time), maintains a professional tone even when describing emotionally charged moments, shows data-driven persuasion, reaches a clear resolution, and explicitly addresses the post-conflict relationship.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Context: Our team was building a new order management system for a growing e-commerce platform. The principal engineer advocated for a microservices architecture from day one, while I believed we should start with a modular monolith and extract services only when we had clear domain boundaries. The stakes were high — this system would process $2M in daily transactions and the architectural decision would be difficult to reverse.\n\nActions: First, I scheduled a 1-on-1 with the principal engineer rather than debating in the architecture review. I wanted to understand his perspective — he had experienced painful monolith-to-microservices migrations and wanted to avoid that debt. I acknowledged that was a valid concern.\n\nNext, I gathered data. I analyzed our team size (6 engineers), our deployment cadence (weekly), and our domain model maturity. I built a simple prototype showing how a modular monolith with clear bounded contexts could be structured for later extraction, and compared it to the microservices setup showing the operational overhead we\'d take on immediately (service mesh, distributed tracing, 12 separate deployment pipelines for 6 engineers).\n\nI presented this to both the principal engineer and our engineering manager, framing it as "right architecture, wrong timing" rather than "wrong architecture." I proposed clear extraction criteria: when any module exceeds a defined request rate or requires independent scaling, we extract it.\n\nResult: The principal engineer agreed to the modular monolith approach with extraction criteria documented in our ADR. Six months later, we extracted the payment processing module when it hit our defined thresholds — and the extraction took 2 weeks instead of an estimated 2 months because the boundaries were clean. The principal engineer specifically cited this experience in a tech talk about evolutionary architecture, and we continued collaborating closely on subsequent projects.\n\nLearning: Framing disagreements as "timing and sequencing" rather than "right vs wrong" preserves relationships and leaves room for both perspectives to be validated over time.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Analyze the fintech conflict example",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'A candidate tells this conflict story: "My PM wanted to ship a fraud detection model with questionable training data before our Series B. I said the data quality was poor and we needed more time. She disagreed, so I went to the CTO who overruled her and gave me an extra month."\n\nThis is a weak version of what could be a strong story. Identify what\'s missing, what signals it fails to deliver, and rewrite the key actions to make it effective.',
        explanation:
          "The weak version skips data-driven persuasion (no quantified risk analysis), triangulates around the PM by going to the CTO instead of working directly with her, shows no empathy for the business pressure, proposes no compromise, and doesn't address the post-conflict relationship. A strong revision includes all of these elements.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'What\'s missing from this weak version:\n\n1. No data-driven persuasion: "The data quality was poor" is a vague assertion. A strong version would include quantified risk analysis — for example, running a baseline model to measure false positive rates and calculating the dollar impact of blocking legitimate transactions.\n\n2. Triangulating around the PM: Going straight to the CTO to overrule the PM is a major anti-pattern. It damages the relationship, undermines the PM\'s authority, and signals you can\'t resolve conflicts at your level. The CTO should be involved only after direct resolution attempts have been exhausted.\n\n3. No empathy for business pressure: The PM was under pressure from sales and investors. Acknowledging that pressure shows maturity and makes your technical argument more credible because it shows you understand the tradeoffs.\n\n4. No compromise proposed: "Give me more time" is a demand, not a solution. A strong version proposes a creative middle ground — perhaps parallel-tracking data cleanup alongside infrastructure work, or launching with conservative thresholds.\n\n5. Missing relationship outcome: The story ends with "the CTO overruled her." What happened to the working relationship with the PM? A strong story shows the relationship was preserved or strengthened.\n\nRewritten key actions: (a) Quantify the risk — train a baseline model, measure 23% false positive rate, calculate $2M/month in blocked legitimate transactions. (b) Present data to the PM directly, acknowledge business pressure. (c) Propose compromise: 10 days of data cleaning while engineering builds serving infrastructure, launch with conservative thresholds. (d) When PM is still hesitant, bring in customer success to corroborate the support ticket data — involving the right ally, not the PM\'s boss. (e) End with the PM presenting stronger metrics to investors and the relationship intact.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Prepare a flagship project with follow-ups",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Choose a hypothetical flagship project for a Staff Engineer candidate. Outline the Table of Contents structure for the response, and write prepared answers for the three most common follow-up questions: "Were there any conflicts?" "What was the hardest part?" and "What would you do differently?"',
        explanation:
          "A strong answer chooses a project with clear Impact, Scope, and Personal Contribution. The Table of Contents should organize the story into 3-4 themes rather than a chronological narrative. Follow-up answers should be concise, demonstrate self-awareness, and connect back to learnings.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Flagship Project: Leading the migration of a monolithic payment processing system to an event-driven microservices architecture at a fintech company, reducing transaction failures by 40% and enabling 3x throughput growth.\n\nTable of Contents:\n"I\'ll walk through this in three parts: first, how we identified and scoped the problem; second, the technical approach and key architectural decisions; and third, how we measured success and rolled it out safely."\n\n1. Problem Identification & Scoping: Payment failures were causing $500K/month in lost revenue. I analyzed failure patterns, identified the monolith\'s connection pool exhaustion as the root cause, and convinced leadership to invest 2 quarters in a migration rather than patching.\n\n2. Technical Approach & Key Decisions: Designed event-driven architecture using Kafka for async payment processing. Made the critical decision to use the strangler fig pattern for incremental migration rather than a big-bang rewrite. Led a team of 4 engineers.\n\n3. Measurement & Safe Rollout: Implemented dual-write pattern with shadow traffic comparison. Rolled out via percentage-based traffic splitting. Transaction failure rate dropped from 2.3% to 1.4%.\n\nFollow-up: "Were there any conflicts?"\nThe platform team wanted us to use their existing message queue (RabbitMQ) instead of Kafka. I understood their concern about operational overhead of a new system. I ran a comparison showing Kafka\'s replay capability was critical for our payment reconciliation needs. We compromised by having the platform team own the Kafka cluster while we owned the consumer applications.\n\nFollow-up: "What was the hardest part?"\nMaintaining data consistency during the migration window when both old and new systems were processing payments. We discovered edge cases where the dual-write pattern produced inconsistent states during network partitions. I designed a reconciliation job that ran every 5 minutes comparing results, which caught 99.7% of discrepancies within the SLA.\n\nFollow-up: "What would you do differently?"\nI would invest more upfront in observability tooling. We built our monitoring dashboards reactively as issues emerged, which meant our first two weeks in production were stressful. Starting with comprehensive distributed tracing and anomaly detection would have given us confidence earlier and reduced the manual verification work.',
          minLength: 300,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "TMAY adaptation across seniority levels",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Explain how a TMAY response should differ between a new grad, a mid-level engineer, and a senior/staff engineer. For each level, describe what the personal summary emphasizes, what types of accomplishments to highlight, and how the forward-looking statement changes in tone and scope.",
        explanation:
          "A complete answer shows how scope, ownership language, and strategic framing scale with seniority. New grads highlight learning and potential. Mid-level engineers show individual impact with metrics. Senior/staff engineers demonstrate organizational influence, technical leadership, and team-level outcomes.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'New Grad:\n- Personal Summary: Emphasizes educational background, focus area, and enthusiasm for learning. Uses phrases like "passionate about solving challenging problems." No title-inflation — "recent graduate with a focus on backend development."\n- Accomplishments: Draws from internships (preferred), capstone projects, and open-source contributions. Since real-world metrics may not exist, highlights key features as "business impact" (e.g., "built a real-time collaboration feature"). 1-2 accomplishments is sufficient.\n- Forward-Looking: Deferential and eager — "excited to bring my learning and enthusiasm to [Company]." Connects academic focus to the company\'s technical domain.\n\nMid-Level Engineer (4-5 years):\n- Personal Summary: Establishes specialization and what they care about — "specializing in frontend development and creating intuitive user interfaces." Shows identity beyond just "I write code."\n- Accomplishments: 2-3 accomplishments with quantified business impact — "reduced UI development time by 30%," "integrated ML model for real-time insights." Each demonstrates individual ownership of meaningful work.\n- Forward-Looking: Connects experience to the specific opportunity — "looking for a space in healthcare where I can solve tough problems with a user-centric lens and [Company] seemed like a perfect fit." Shows they\'ve researched the company and have intentional career direction.\n\nSenior/Staff Engineer (10+ years):\n- Personal Summary: Broader scope — "expertise lies in designing architectures that work across a large array of teams and use cases." Implies organizational influence, not just individual contribution.\n- Accomplishments: Talks about team outcomes, migrations affecting the whole organization, and mentoring. Uses ownership language — "spearheaded," "led" — and describes scope spanning multiple teams. Accomplishments demonstrate leadership beyond writing code.\n- Forward-Looking: Makes confident, non-deferential statements about the value they bring — "To continue using and grow my experience with large-scale systems." Implies partnership rather than supplication. References specific interactions with the company that demonstrate insider knowledge and mutual evaluation.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Name the TMAY anti-pattern",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "What is the name of the TMAY anti-pattern where a candidate gives a chronological walkthrough of every job they've had, making older experience seem equally important as recent work?",
        explanation:
          'The "History Lesson" is a common TMAY anti-pattern where candidates list every position chronologically. This is tedious for the interviewer and dilutes the impact of recent, more relevant experience. Instead, candidates should focus on 2-3 highlights from their most impactful roles.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "History Lesson",
          acceptableAnswers: [
            "History Lesson",
            "history lesson",
            "The History Lesson",
            "the history lesson",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Favorite project: prioritization dimension",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'When selecting your flagship "favorite project" story, you optimize for three dimensions: Impact, Scope, and ___. Which dimension should be prioritized above the others if you can\'t maximize all three?',
        explanation:
          "Personal Contribution is the most important dimension. The interviewer needs to understand what YOU specifically did — your ownership of significant actions and decisions that influenced the outcome. A smaller project where you led everything is better than a massive initiative where your role was peripheral.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Personal Contribution",
          acceptableAnswers: [
            "Personal Contribution",
            "personal contribution",
            "Personal contribution",
            "contribution",
            "Contribution",
            "personal ownership",
            "ownership",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Conflict anti-pattern: indirect escalation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "What is the term for the conflict anti-pattern where you go around the other person (e.g., to their manager or to other team members) instead of addressing the conflict directly with them?",
        explanation:
          'Triangulating is the anti-pattern of going around a conflict rather than addressing it directly with the person involved. Companies explicitly look for people who "go directly to the source" and "do not triangulate around conflicts or hide behind management." Triangulating is a red flag because it creates drama, damages trust, and signals an inability to handle direct confrontation.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Triangulating",
          acceptableAnswers: [
            "Triangulating",
            "triangulating",
            "Triangulation",
            "triangulation",
            "triangulate",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Flagship story delivery technique",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "When delivering your flagship project story, what technique should you use to organize a complex, multi-faceted response into signposted themes so the interviewer can follow your narrative?",
        explanation:
          'The Table of Contents technique involves signposting the themes of your response upfront (e.g., "I\'ll walk through this in three parts: how we identified the problem, the technical approach, and how we measured success"). This helps the interviewer follow a complex narrative, demonstrates structured thinking, and lets you organize by theme rather than chronology.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Table of Contents",
          acceptableAnswers: [
            "Table of Contents",
            "table of contents",
            "Table of contents",
            "TOC",
            "signposting",
            "Signposting",
          ],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match TMAY section to its purpose",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each TMAY section to its primary purpose:",
        explanation:
          "The Personal Summary orients the interviewer on who you are professionally. Accomplishments create hooks for the interviewer to explore your best stories deeper. The Forward-Looking Statement connects your past to the target role, showing alignment. Each section serves a distinct purpose in the 30-second to 2-minute window.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Personal Summary",
              right: "Orient the interviewer on your role, experience level, and differentiator",
            },
            {
              id: "p2",
              left: "Accomplishments",
              right: "Create hooks that steer the interviewer toward your strongest stories",
            },
            {
              id: "p3",
              left: "Forward-Looking Statement",
              right: "Connect your past experience to the target role and show alignment",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match conflict type to example scenario",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content: "Match each conflict type to the correct example scenario:",
        explanation:
          'Technical disagreements involve choices about tools, databases, or architecture. Prioritization conflicts involve tradeoffs between feature work and other needs (like tech debt). Timeline pushback involves resisting pressure to ship before the work is ready. Resource allocation involves working around infrastructure or staffing constraints. Recognizing conflict types helps you search your experience for stories you might not have identified as "conflicts."',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Technical disagreement",
              right:
                "Teammate wanted NoSQL; you pushed for PostgreSQL due to ACID transaction needs",
            },
            {
              id: "p2",
              left: "Prioritization conflict",
              right:
                "Product wanted new features; you advocated spending time on tech debt causing on-call issues",
            },
            {
              id: "p3",
              left: "Timeline pushback",
              right:
                "Leadership wanted to ship immediately; you insisted on adding input validation first",
            },
            {
              id: "p4",
              left: "Resource allocation",
              right:
                "Infra team couldn't provision until Q2; you found a temporary solution using existing capacity",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match TMAY mistake to what it signals to the interviewer",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each TMAY mistake to the negative signal it sends to the interviewer:",
        explanation:
          "Each TMAY mistake sends a specific negative signal. The History Lesson signals poor prioritization and communication skills. The Childhood Origin Story signals lack of professional focus. Being negative about a former employer signals that you may be the problem and lack leadership ability to drive change. Omitting accomplishments deprives the interviewer of the information they need to evaluate you, since many haven't read your resume.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "History Lesson (chronological walkthrough)",
              right:
                "Poor prioritization — candidate can't distinguish what's important from what's not",
            },
            {
              id: "p2",
              left: "Childhood Origin Story",
              right:
                "Lack of professional focus — candidate doesn't understand what's relevant to the role",
            },
            {
              id: "p3",
              left: "Being negative about former employer",
              right: "Candidate may be the problem — lacks leadership ability to drive change",
            },
            {
              id: "p4",
              left: 'Omitting accomplishments ("Less is Not More")',
              right: "Interviewer has no signal to evaluate — many haven't read the resume",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "TMAY acronym meaning",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content: 'TMAY stands for "Tell Me About ___" and is pronounced "tee-may."',
        explanation:
          'TMAY is the acronym for "Tell Me About Yourself," the most ubiquitous interview question that appears across all interview rounds. Having its own acronym reflects how frequently it comes up in interview preparation circles.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: ["Yourself"],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Three most common behavioral questions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "The Big Three behavioral interview questions are: Tell Me About ___, Tell Me About Your Favorite ___, and Tell Me About a Time You Resolved a ___.",
        explanation:
          "These three questions (or their variants) appear so consistently and carry so much weight that preparing them thoroughly pays off every time. Since you know they're coming, you can prepare polished, practiced responses to deliver confidently even when nervous.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          blanks: ["Yourself", "Project", "Conflict"],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Flagship story selection criteria",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "When selecting your flagship project story, optimize for three key dimensions: ___, Scope, and Personal ___. If you can't maximize all three, prioritize the third dimension.",
        explanation:
          "Impact (meaningful business metrics), Scope (breadth/duration of the project), and Personal Contribution (your ownership of significant actions and decisions) are the three dimensions. Personal Contribution is the top priority because the interviewer needs to understand what you specifically did — not just what the team achieved.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          blanks: ["Impact", "Contribution"],
        },
      },
    },
  ],
};
