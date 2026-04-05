/**
 * Practicing Behavioral Interviews — Behavioral Interview Prep Content
 * Based on HelloInterview extract
 * Covers: progressive practice roadmap (solo → AI → peer → professional),
 *         recording techniques, Big Three mastery, Decode-Select-Deliver drills,
 *         peer mock setup, professional mock strategy, and 4-week practice plan
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const behavioralPracticingContent: StoryPointSeed = {
  title: "Practicing Behavioral Interviews",
  description:
    "A progressive practice plan from solo recording to AI tools to peer mocks to professional coaching, with scripts and exercises to build interview confidence and close the gap between what you mean to communicate and what actually comes out under pressure.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: Progressive Practice & Solo Techniques
    {
      title: "Progressive Practice & Solo Recording Techniques",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Progressive Practice & Solo Recording Techniques",
          blocks: [
            {
              id: "pp1",
              type: "heading",
              content: "Why Practice Matters",
              metadata: { level: 2 },
            },
            {
              id: "pp2",
              type: "paragraph",
              content:
                "Once you have a story catalog and you've learned to decode questions and select the right responses, the step that will really make a difference is practicing. In the moment, in the interview, there can be a lot of cognitive load to select the right details, organize them, adapt to the interviewer's reactions, all while trying to sound natural. Practice helps you close the gap between what you mean to communicate and what actually comes out under pressure.",
            },
            {
              id: "pp3",
              type: "paragraph",
              content:
                "Some candidates fear this kind of practice will make them sound robotic or rehearsed. If you do it right — by drilling the key points to get across instead of exactly what to say — it won't. Instead it will instill confidence.",
            },
            {
              id: "pp4",
              type: "heading",
              content: "The Progressive Practice Roadmap",
              metadata: { level: 2 },
            },
            {
              id: "pp5",
              type: "paragraph",
              content:
                "The key to efficient preparation is progressive practice: start with controlled, low-pressure environments where you can focus purely on content and structure, then gradually introduce the complexity and pressure of real interview conditions.",
            },
            {
              id: "pp6",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Practice by yourself: Get your core stories and basic delivery down in private.",
                  "Practice with AI: Test yourself with unpredictable questions and get immediate feedback.",
                  "Practice with peer mock interviewers: Experience real conversation dynamics and human feedback.",
                  "Polish with professional mock interviewers: Calibrate against experts in company expectations.",
                ],
              },
            },
            {
              id: "pp7",
              type: "paragraph",
              content:
                "Each stage serves a purpose, and skipping stages tends to waste both time and money.",
            },
            {
              id: "pp8",
              type: "heading",
              content: "Solo Practice: Recording Your Core Stories",
              metadata: { level: 2 },
            },
            {
              id: "pp9",
              type: "paragraph",
              content:
                "When you're practicing by yourself, set up your phone or laptop to record video of yourself, then deliver each story in CARL format as if speaking to an interviewer. Don't worry about perfection on your first take. The goal is to start putting in reps.",
            },
            {
              id: "pp10",
              type: "heading",
              content: "What to Watch for in Recordings",
              metadata: { level: 3 },
            },
            {
              id: "pp11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Pacing: Are you rushing through actions or lingering too long on context? Aim for 10% Context, 60% Actions, 30% Results and Learnings. If you're three minutes in and haven't described a single action, that's a problem.",
                  'Clarity of ownership: Count how many times you say "I" versus "we." Are your specific actions clear, or do they disappear into team accomplishments?',
                  'Verbal fillers: Notice patterns — "Um," "like," "you know," "basically." Everyone has them, but excessive fillers signal nervousness and reduce credibility.',
                  "Energy and engagement: Do you sound genuinely interested in your own story? If you're boring yourself, you'll definitely bore an interviewer.",
                  "Organization: Can you follow your own narrative? A clear beginning, middle, and end makes a huge difference.",
                ],
              },
            },
            {
              id: "pp12",
              type: "paragraph",
              content:
                "Record yourself 2 to 3 times for each core story, applying lessons from each review. You'll notice dramatic improvement by the third take as you build fluency.",
            },
            {
              id: "pp13",
              type: "quote",
              content:
                "\"Watch your recordings at 1.5x speed. You'll get through them faster and you'll still catch all the important issues with pacing and filler words.\"",
            },
            {
              id: "pp14",
              type: "heading",
              content: "Mastering the Big Three",
              metadata: { level: 2 },
            },
            {
              id: "pp15",
              type: "paragraph",
              content:
                'Your responses to "Tell Me About Yourself," "Tell me about your favorite project," and "Tell me about a conflict" deserve extra attention since they appear in virtually every interview loop. Practice these until you can deliver them conversationally without notes.',
            },
            {
              id: "pp16",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Your TMAY opening: The first 20 seconds establish your first impression. Do you sound confident and engaging?",
                  "Transitions in your project story: Are you clearly calling out the most important contributions?",
                  "Emotional tone in your conflict story: Are you balancing professionalism with whatever real emotional content is in the story?",
                ],
              },
            },
            {
              id: "pp17",
              type: "heading",
              content: "Practicing Decode, Select, Deliver",
              metadata: { level: 2 },
            },
            {
              id: "pp18",
              type: "paragraph",
              content:
                "Once your core stories and Big Three feel solid, practice the pattern-matching you'll do in real interviews: hearing a question and quickly selecting the best story to answer it. Pull up a list of behavioral questions and for each one: Decode (what signal area is this testing?), Select (which story from your catalog fits best?), Deliver (give the full CARL response out loud).",
            },
            {
              id: "pp19",
              type: "paragraph",
              content:
                "This exercise reveals gaps in your preparation. Look for signal areas where you don't have ready-made stories. If you hit a question about stakeholder management and realize you don't have a good story for that, return to your story identification process and fill that hole before your interview.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: AI Practice & Peer Mock Interviews
    {
      title: "AI Practice & Peer Mock Interviews",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "AI Practice & Peer Mock Interviews",
          blocks: [
            {
              id: "ai1",
              type: "heading",
              content: "Practicing with AI",
              metadata: { level: 2 },
            },
            {
              id: "ai2",
              type: "paragraph",
              content:
                "Large language models are available all the time and never get tired of practicing with you. After you've done your solo practice, AI tools should be your next stop.",
            },
            {
              id: "ai3",
              type: "heading",
              content: "How to Use AI Effectively",
              metadata: { level: 3 },
            },
            {
              id: "ai4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Test yourself with unfamiliar questions: After practicing standard question banks, prompt an AI to identify additional questions based on your target company's values.",
                  "Generate follow-up questions for your stories: Share your stories and ask about common follow-ups. This is incredibly valuable because follow-ups are where most candidates get tripped up.",
                  "Simulate company-specific interview styles: Prompt AI to roleplay as an interviewer for a specific company and signal area.",
                ],
              },
            },
            {
              id: "ai5",
              type: "heading",
              content: "AI's Limitations",
              metadata: { level: 3 },
            },
            {
              id: "ai6",
              type: "paragraph",
              content:
                "AI can't replicate nonverbal feedback (facial expressions, body language), can't simulate the conversational flow of a real interview with interruptions and tangents, can't create genuine pressure, and can't evaluate how you're coming across emotionally. These limitations are why you also need mock interviews with a human.",
            },
            {
              id: "ai7",
              type: "heading",
              content: "Peer Mock Interviews",
              metadata: { level: 2 },
            },
            {
              id: "ai8",
              type: "paragraph",
              content:
                "Unlike coding problems, behavioral interviews are fundamentally subjective, so your next step should be feedback from another human. When you practice with a real interviewer, even a peer mock, it gives you several unique benefits:",
            },
            {
              id: "ai9",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Pressure: Telling stories on the spot, to a real human who's evaluating you, is fundamentally different from any other practice. The experience of sitting across from someone creates pressure that no solo practice can replicate.",
                  "Follow-ups: A real person will push you on the parts of your story that seem weak or unclear.",
                  'Coaching: A good mock interviewer gives actionable feedback — not just "that was good" but specific observations.',
                  "Accountability: If you have more than one mock scheduled, you'll be held accountable to make changes between sessions.",
                  "Encouragement: Having a human who cares about you express interest in your process provides genuine support during a stressful time.",
                ],
              },
            },
            {
              id: "ai10",
              type: "heading",
              content: "Finding Peer Interviewers",
              metadata: { level: 3 },
            },
            {
              id: "ai11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Leverage your network: Reach out to friends or former colleagues at target companies. Many people are happy to help if you ask directly.",
                  "Mock interview communities: Online communities pair you with other people who are also preparing — you trade off as interviewer and candidate.",
                  "Phone a friend: Even a non-technical friend can ask questions from standard lists. The pressure of answering on the spot is valuable on its own.",
                ],
              },
            },
            {
              id: "ai12",
              type: "heading",
              content: "Preparing Your Peer Interviewer",
              metadata: { level: 3 },
            },
            {
              id: "ai13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Cover the signal areas: Provide questions that span different areas rather than clustering around one type.",
                  "Create a feedback framework: Give your peer a simple 1-5 rubric across dimensions — Structure, Story choice, Story depth, Delivery.",
                  'Have them ask follow-ups: "Why did you make that decision?" "What would you do differently?" These are where real interviews get interesting.',
                  'Request honest feedback: "That was great" doesn\'t help you improve. "I got lost when you were explaining the architecture" does.',
                  "Record sessions (with permission): Watching yourself can reveal habits neither you nor your peer noticed in the moment.",
                ],
              },
            },
          ],
          readingTime: 7,
        },
      },
    },

    // Material 3: Professional Mocks & Practice Plan
    {
      title: "Professional Mocks & Building Your Practice Plan",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Professional Mocks & Building Your Practice Plan",
          blocks: [
            {
              id: "pm1",
              type: "heading",
              content: "Professional Mock Interviews",
              metadata: { level: 2 },
            },
            {
              id: "pm2",
              type: "paragraph",
              content:
                "While peers are valuable, a professional mock interviewer offers calibration you can't get anywhere else. A professional interviewer is someone who works as a hiring manager in tech or interviews for your target company. They've seen enough candidates to know what \"good\" looks like.",
            },
            {
              id: "pm3",
              type: "heading",
              content: "Benefits of Professional Mocks",
              metadata: { level: 3 },
            },
            {
              id: "pm4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Calibration: They know what a strong Senior story looks like versus a weak one. They know what will fly at Amazon versus Google. They've seen enough candidates to pattern-match your performance against people who got hired.",
                  "Expert follow-ups: An experienced manager knows what other managers will ask when they hear your story. They probe the spots where you're weakest.",
                  "Pattern recognition: After tens or hundreds of sessions, they've seen every common mistake and every effective technique.",
                  "Confidence: Having someone who's made real hiring decisions tell you \"you're ready\" does something for your nerves on interview day.",
                ],
              },
            },
            {
              id: "pm5",
              type: "heading",
              content: "Getting the Most from Professional Mocks",
              metadata: { level: 3 },
            },
            {
              id: "pm6",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Set clear goals: Discuss your objectives before you begin. Maybe you want feedback on whether scope is right for the target level.",
                  "Plan for at least two sessions: Session 1 covers the Big Three and storytelling structure. Session 2 covers company values and on-the-fly story selection.",
                  "Apply feedback between sessions: Schedule mocks with enough time between them (at least a couple of days) to implement feedback.",
                  "Record and review: Ask if you can record the session and get written feedback to reference later.",
                ],
              },
            },
            {
              id: "pm7",
              type: "heading",
              content: "The 4-Week Practice Plan",
              metadata: { level: 2 },
            },
            {
              id: "pm8",
              type: "heading",
              content: "Week 1: Solo Foundation",
              metadata: { level: 3 },
            },
            {
              id: "pm9",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Record your 3-5 core stories and Big Three",
                  "Review recordings and do 2-3 takes of each",
                  "Practice Decode, Select, Deliver with 10-15 random questions",
                ],
              },
            },
            {
              id: "pm10",
              type: "heading",
              content: "Week 2: AI Extension",
              metadata: { level: 3 },
            },
            {
              id: "pm11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Use AI to generate company-specific questions",
                  "Practice responding to unexpected follow-ups",
                  "Identify and fill any gaps in your story catalog",
                ],
              },
            },
            {
              id: "pm12",
              type: "heading",
              content: "Week 3: Human Practice",
              metadata: { level: 3 },
            },
            {
              id: "pm13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Schedule at least one peer mock interview",
                  "Apply feedback and refine stories",
                  "Schedule a second peer mock if needed",
                ],
              },
            },
            {
              id: "pm14",
              type: "heading",
              content: "Week 4: Final Polish",
              metadata: { level: 3 },
            },
            {
              id: "pm15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Book two professional mock sessions (if budget allows)",
                  "Apply feedback between sessions",
                  "Final review and confidence building",
                ],
              },
            },
            {
              id: "pm16",
              type: "quote",
              content:
                '"If you have less time, compress the stages but don\'t skip them. Even a single day of solo practice is better than jumping straight to mocks. Even a 30-minute peer mock is better than going in cold."',
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
      title: "Purpose of progressive practice",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "What is the primary rationale behind progressive practice — starting solo, then AI, then peers, then professionals?",
        explanation:
          "Progressive practice starts with controlled, low-pressure environments where you focus purely on content and structure, then gradually introduces the complexity and pressure of real interview conditions. Solo practice builds muscle memory for stories. AI adds unpredictability. Peers add human pressure and follow-ups. Professionals add calibration. Each stage builds on the previous one, and skipping stages wastes time and money because you haven't built the foundation the next stage requires.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Start in low-pressure environments to build content and structure, then gradually introduce complexity and real interview pressure",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Professional coaches are expensive, so you should save money by delaying their involvement",
              isCorrect: false,
            },
            {
              id: "c",
              text: "AI tools are newer and less reliable, so you should use older methods first",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Interviewers can tell if you practiced alone versus with a mock, so you need the peer credential",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Ideal time allocation in CARL delivery",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When reviewing your recorded practice stories, what is the recommended time allocation across CARL components?",
        explanation:
          "The recommended allocation is approximately 10% Context, 60% Actions, and 30% Results and Learnings. Most candidates spend too much time on setup (Context) and not enough on what they actually did (Actions). If you find yourself three minutes into a story and haven't described a single action, that's a clear sign you're over-indexing on Context.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "10% Context, 60% Actions, 30% Results and Learnings",
              isCorrect: true,
            },
            {
              id: "b",
              text: "25% Context, 25% Actions, 25% Results, 25% Learnings",
              isCorrect: false,
            },
            {
              id: "c",
              text: "30% Context, 40% Actions, 30% Results and Learnings",
              isCorrect: false,
            },
            {
              id: "d",
              text: "5% Context, 45% Actions, 45% Results, 5% Learnings",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Most common solo practice mistake",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When candidates record themselves delivering behavioral stories during solo practice, what is the single most common problem they discover?",
        explanation:
          "The most common issue is spending way too much time setting up the situation (Context) and not enough on what they actually did (Actions). Candidates often narrate extensive background, team structure, and project scope while their concrete personal actions get compressed into a few sentences. The fix is to aim for 10% Context, 60% Actions.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Spending too much time on context/setup and not enough time describing their specific actions",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Speaking too quietly and lacking vocal projection",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Using too many technical terms that a non-technical interviewer wouldn't understand",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Making their stories too short and not providing enough detail",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Why follow-ups trip candidates up",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'Follow-up questions are described as "where most candidates get tripped up" in behavioral interviews. Using AI to generate follow-ups for your stories is called "incredibly valuable." What is the deeper reason follow-ups are so challenging?',
        explanation:
          'Candidates rehearse their initial stories but haven\'t anticipated what comes after. Follow-ups like "What would you do differently?" or "How did you measure success?" probe the edges of your story — the parts you didn\'t pre-plan. They reveal whether you truly understand the situation or just memorized a narrative. AI-generated follow-ups help because they force you to think beyond your rehearsed script before the real interview.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Candidates rehearse the initial story but haven\'t thought through the questions that probe the edges — the "What would you do differently?" and "How did you measure success?" territory',
              isCorrect: true,
            },
            {
              id: "b",
              text: "Follow-ups are designed to catch candidates who are lying about their experience",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Interviewers use follow-ups to test technical depth, which requires different preparation",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Follow-up questions are always about weaknesses and failures, which candidates avoid practicing",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Peer mock vs AI practice distinction",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'A candidate has been practicing with AI for two weeks and feels confident. They ask: "Why do I need a peer mock if AI can already ask me questions and give feedback?" What is the strongest argument for why peer mocks add value that AI cannot?',
        explanation:
          "AI cannot create genuine interpersonal pressure — the experience of sitting across from a real human who is evaluating you while you formulate answers on the spot. This pressure is fundamentally different from typing responses to an AI. AI also cannot provide nonverbal feedback (facial expressions, body language), simulate conversational flow with natural interruptions and tangents, or evaluate how you're coming across emotionally. These gaps mean peer mocks serve a distinct purpose in the progressive practice pipeline.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "AI can't replicate the genuine interpersonal pressure of answering a real human who's evaluating you on the spot — this pressure is fundamentally different and must be practiced",
              isCorrect: true,
            },
            {
              id: "b",
              text: "AI gives inaccurate feedback and peers are more reliable evaluators",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Peer mocks are free, while AI tools require expensive subscriptions",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Interviewers ask about whether you've done peer mocks, so it's a credential you need",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Optimal professional mock session strategy",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When scheduling professional mock interviews, the recommended approach is to book at least two sessions with specific focus areas for each. What should Session 1 versus Session 2 focus on, and why is the sequencing important?",
        explanation:
          "Session 1 should cover the Big Three and overall storytelling structure because these are the most frequently asked questions and foundational skills. You need structural feedback before anything else. Session 2 should focus on company values and on-the-fly story selection — the closest simulation to a real interview. The gap between sessions is critical: you need time (at least a couple of days) to implement Session 1 feedback before Session 2 tests your improved performance.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Session 1: Big Three and storytelling structure (foundational skills). Session 2: Company values and on-the-fly story pairing. The gap allows implementing Session 1 feedback.",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Session 1: Easy questions for warmup. Session 2: Hard questions for challenge. The sequencing builds difficulty.",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Session 1: Technical behavioral questions. Session 2: Leadership behavioral questions. This covers both domains.",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Both sessions should cover the same material to measure improvement across identical conditions.",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Why practice doesn't create robotic delivery",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'Candidates often worry that extensive practice will make them "sound robotic or rehearsed." The material argues this fear is misplaced if practice is done correctly. What is the critical distinction between practice that creates natural delivery versus practice that creates robotic delivery?',
        explanation:
          "The key distinction is drilling key points to get across versus memorizing exact words. When you practice the key points and structure, you build fluency with the content while your specific language varies naturally each time — much like how a skilled musician knows the piece but each performance has subtle variations. When you memorize exact phrasing, any deviation causes hesitation and the delivery feels scripted. This is why recording 2-3 takes of each story (not scripting one perfect version) is recommended.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Drilling key points to communicate (natural) versus memorizing exact wording (robotic) — practicing what to convey versus how to say it",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Practicing alone (natural) versus practicing with others (robotic) — social pressure creates memorization",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Practicing for under a week (natural) versus over two weeks (robotic) — there's a diminishing returns threshold",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Using bullet points (natural) versus full scripts (robotic) — the note format determines delivery style",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Decode-Select-Deliver gap identification",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "During Decode-Select-Deliver drills, a candidate consistently freezes when hitting questions about stakeholder management and cross-functional influence. They can decode the signal area but can't select a strong story. What does this reveal, and what is the correct next step?",
        explanation:
          "The Decode-Select-Deliver drill is explicitly designed to reveal gaps like this. When you can decode the question but can't select a story, it means you have a hole in your story catalog for that signal area. The correct response is not to practice more with the stories you have — it's to return to the story identification process and mine your experience for stories that cover stakeholder management and cross-functional influence. This is a preparation gap, not a practice gap.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "It reveals a gap in their story catalog for that signal area — they need to return to story identification and mine their experience for stories covering those competencies",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It means they lack the real-world experience and should focus on other signal areas where they're stronger",
              isCorrect: false,
            },
            {
              id: "c",
              text: "They should practice the Decode step more until they can reframe stakeholder questions into signal areas where they have stories",
              isCorrect: false,
            },
            {
              id: "d",
              text: "They need to move to peer mocks immediately because solo Decode-Select-Deliver drills aren't realistic enough to reveal true readiness",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Elements to watch in self-recordings",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL elements you should watch for when reviewing your recorded behavioral practice stories:",
        explanation:
          'When reviewing recordings, watch for: Pacing (rushing actions vs lingering on context), Clarity of ownership ("I" vs "we"), Verbal fillers ("um," "like," "basically"), Energy and engagement (sounding interested in your own story), and Organization (clear narrative flow). Technical accuracy is less relevant here — this is about delivery quality, not content correctness. Similarly, eye contact with the camera is not one of the recommended review criteria.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Pacing — whether you rush through actions or linger too long on context",
              isCorrect: true,
            },
            {
              id: "b",
              text: 'Clarity of ownership — counting "I" versus "we" usage',
              isCorrect: true,
            },
            {
              id: "c",
              text: 'Verbal fillers — patterns of "um," "like," "you know," "basically"',
              isCorrect: true,
            },
            {
              id: "d",
              text: "Energy and engagement — whether you sound genuinely interested in your story",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Eye contact with the camera to simulate looking at an interviewer",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Unique benefits of peer mock interviews",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL benefits that peer mock interviews provide which AI practice cannot replicate:",
        explanation:
          "Peer mocks uniquely provide: genuine interpersonal pressure (a real human evaluating you creates pressure no AI can replicate), human follow-ups that probe weak or unclear parts of your story, accountability between sessions to actually implement changes, and emotional encouragement during a stressful preparation period. AI can technically give actionable feedback text, but the quality differs — peers notice emotional tone, body language, and conversational flow that AI misses. Typing speed assessment is irrelevant to behavioral interviews.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Genuine interpersonal pressure from being evaluated by a real human on the spot",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Human follow-ups that push on parts of your story that seem weak or unclear",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Accountability to make changes between scheduled sessions",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Emotional encouragement and support during stressful preparation",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Assessment of your typing speed and written communication quality",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "Preparing your peer interviewer effectively",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL recommended steps for preparing your peer interviewer before a mock session:",
        explanation:
          "To maximize mock value, you should: provide questions spanning different signal areas (not clustering around one type), create a feedback rubric (1-5 scale across Structure, Story choice, Story depth, Delivery), train them to ask follow-up questions, request honest feedback (give explicit permission to be critical), and record sessions (with permission). Telling them your target answers would undermine the purpose — you need them to react naturally. Limiting to one signal area reduces coverage.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Provide questions spanning different signal areas rather than clustering around one type",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Give them a simple feedback rubric (1-5 scale across Structure, Story choice, Story depth, Delivery)",
              isCorrect: true,
            },
            {
              id: "c",
              text: 'Train them to ask follow-up questions like "Why did you make that decision?" and "What would you do differently?"',
              isCorrect: true,
            },
            {
              id: "d",
              text: 'Give them explicit permission to be critical — "That was great" doesn\'t help you improve',
              isCorrect: true,
            },
            {
              id: "e",
              text: "Share your target answers in advance so they can evaluate accuracy of your delivery",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Professional mock advantages over peers",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL advantages that professional mock interviewers provide beyond what peers can offer:",
        explanation:
          "Professional interviewers offer: calibration (they know what a strong Senior story looks like versus weak, and what works at Amazon vs Google because they've seen enough candidates to pattern-match), expert follow-ups (they know what managers will ask when they hear your story and probe your weakest spots), pattern recognition (after tens or hundreds of sessions they spot issues you can't see yourself), and confidence (having someone who makes real hiring decisions tell you \"you're ready\"). They don't provide insider question banks (questions vary across interviewers) and they don't guarantee offers.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Calibration — they can pattern-match your performance against people who got hired versus rejected at specific companies",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Expert follow-ups — they know what other managers will think and ask when hearing your story",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Pattern recognition — after hundreds of sessions, they spot issues and offer fixes that actually work",
              isCorrect: true,
            },
            {
              id: "d",
              text: 'Confidence — having a real decision-maker say "you\'re ready" affects interview-day nerves',
              isCorrect: true,
            },
            {
              id: "e",
              text: "Access to the company's actual question bank so you can prepare exact answers",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Evaluate a practice recording",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'A candidate records themselves answering "Tell me about a time you improved something on your team." Their 4-minute response breaks down as: 2.5 minutes describing the team structure, tech stack, and how the problem emerged; 1 minute describing what they did; 0.5 minutes on the result ("it worked and the team was happy"). Using the solo practice review criteria, identify all the issues in this recording and explain how they should fix each one.',
        explanation:
          'A strong answer identifies multiple issues: extreme context over-indexing (62% on context vs recommended 10%), minimal action detail (25% vs recommended 60%), missing Learnings entirely, lack of ownership clarity (no mention of "I" vs "we"), vague result with no metrics, and provides specific fix strategies for each issue.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'Issues identified:\n\n1. Pacing / Context over-indexing: 2.5 minutes of 4 (62%) is spent on context. The recommended split is 10% Context, 60% Actions, 30% Results & Learnings. The candidate should condense the setup to 20-30 seconds: "I was on a 6-person backend team. Our deployment pipeline was slow — deploys took 4 hours and failed 30% of the time, which meant engineers avoided deploying."\n\n2. Insufficient Actions detail: Only 1 minute (25%) on actions versus the recommended 60%. They need to expand with specific, repeatable actions: What did they investigate? What solutions did they consider and why did they choose one? What steps did they personally take? Did they involve others?\n\n3. Missing Learnings: The CARL framework requires a Learnings component, which is entirely absent. They should add what they took away — a principle, pattern, or skill they\'ve applied since.\n\n4. Vague result — "it worked and the team was happy": No quantified outcome. Fix: "Deploy time dropped from 4 hours to 20 minutes, failure rate went from 30% to under 2%, and the team went from deploying twice a week to daily."\n\n5. Likely ownership issue: With so much time on team structure and problem emergence, the candidate probably uses "we" extensively. They need to audit "I" vs "we" and ensure their specific contributions are clear.\n\nFixed time allocation for a 4-minute answer: ~25 seconds Context, ~2.5 minutes Actions, ~1 minute Results and Learnings.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Design an AI practice session",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "You are preparing for a behavioral interview at a specific FAANG company of your choice. Design a 30-minute AI-assisted practice session. Include: what prompts you would give the AI, how you would structure the session, what specific value you expect to get from AI versus what AI cannot help with, and how you would identify gaps in your preparation.",
        explanation:
          "A strong answer demonstrates understanding of AI's strengths (generating company-specific questions, follow-ups, and unlimited availability) and limitations (no nonverbal feedback, no real pressure, no emotional evaluation), and shows a structured approach to using the 30 minutes effectively.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Target company: Amazon\n\n30-minute AI practice session structure:\n\nMinutes 1-5: Company-specific question generation\nPrompt: \"You are a behavioral interviewer at Amazon. Generate 8 behavioral questions that map to Amazon's Leadership Principles, focusing on Ownership, Bias for Action, and Dive Deep. Include a mix of standard and unusual phrasings.\"\nValue: AI can generate company-specific questions I haven't seen, pushing me out of my comfort zone.\n\nMinutes 5-20: Timed Decode-Select-Deliver practice\nFor each question, I give myself 30 seconds to decode the LP and select a story, then deliver the CARL response aloud (3-4 minutes each). After each response, I type a summary into the AI.\nPrompt after each response: \"I just answered a question about [LP]. Here's my summary: [response]. What follow-up questions would an Amazon interviewer likely ask? What parts of my answer might seem weak?\"\nValue: AI generates follow-ups I haven't anticipated, revealing edges of my stories I need to prepare.\n\nMinutes 20-25: Gap identification\nPrompt: \"Based on the 5 responses I've given, which Amazon Leadership Principles have I NOT demonstrated? What signal areas might I be weak in?\"\nValue: AI can cross-reference my stories against the full LP list and identify coverage gaps.\n\nMinutes 25-30: Reflection and planning\nNote which questions caused me to freeze (story catalog gaps). Note which follow-ups I couldn't answer (story depth gaps). Plan tomorrow's practice to address these gaps.\n\nWhat AI CANNOT help with: Whether I sound confident or nervous, my body language, the real pressure of a human evaluating me, whether my emotional tone in conflict stories lands appropriately. These require peer or professional mocks.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Design a peer mock feedback rubric",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Design a comprehensive feedback rubric that you would give to a peer before a mock behavioral interview. The rubric should have 4-5 evaluation dimensions with clear criteria for scoring 1-5 on each. Explain what makes the difference between a 3 (adequate) and a 5 (exceptional) on each dimension, and why these dimensions map to what real interviewers evaluate.",
        explanation:
          "A staff-level answer creates a practical rubric with dimensions that map to real interviewer evaluation criteria (Structure, Story Choice, Depth, Delivery, and potentially Signal Coverage), with clear behavioral anchors that a non-expert peer can apply consistently.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Peer Mock Interview Feedback Rubric\n\n1. Structure (CARL Execution)\n- Score 1: No discernible framework. Rambles without clear beginning, middle, end.\n- Score 3: Uses CARL but unevenly — Context is too long, Actions are vague, or Learnings are absent. You can follow the story but it requires effort.\n- Score 5: Tight Context (under 30 seconds), rich and specific Actions (clear "I" ownership), quantified Results, and genuine Learnings that show growth. Story flows naturally without feeling rehearsed.\n- Why it matters: Interviewers use structure as a proxy for communication skills. A well-structured answer signals organized thinking — a critical senior engineer trait.\n\n2. Story Choice & Scope\n- Score 1: Story is trivial, doesn\'t match the question, or demonstrates the wrong level (e.g., fixing a typo for a Senior role).\n- Score 3: Story is relevant but the scope is modest — individual contribution without cross-team or organizational impact.\n- Score 5: Story demonstrates operating at or above the target level. Cross-team influence, strategic thinking, and scope that matches the role\'s expectations. Story was clearly selected because it\'s the best match from a catalog, not the first thing that came to mind.\n- Why it matters: Story choice is the #1 factor in leveling decisions. A high-scope story, even if imperfectly told, signals more than a perfectly delivered low-scope story.\n\n3. Depth & Specificity\n- Score 1: Vague generalities. "I improved things." No specific actions, numbers, or concrete details.\n- Score 3: Some specific actions and outcomes, but key decisions aren\'t explained. Missing the "why" behind choices.\n- Score 5: Rich with specific, repeatable actions. Explains reasoning behind decisions. Results are quantified. You could replicate what they did from this description alone.\n- Why it matters: Interviewers distinguish real experience from inflated claims through depth of detail. Candidates who actually did the work can go as deep as the interviewer probes.\n\n4. Delivery & Presence\n- Score 1: Monotone, disengaged, excessive fillers, reads from notes.\n- Score 3: Adequate delivery but some fillers, uneven energy, or moments where confidence dips.\n- Score 5: Conversational and engaging. Genuine enthusiasm visible. Good pacing. Feels like talking to a colleague, not watching a presentation.\n- Why it matters: Interviewers remember candidates who light up when describing their work. Energy and engagement are hard to fake and signal genuine passion.\n\n5. Follow-up Handling\n- Score 1: Gets flustered or contradicts the main story. Can\'t go deeper.\n- Score 3: Handles basic follow-ups but gets uncomfortable with "What would you do differently?" or "What went wrong?"\n- Score 5: Handles follow-ups smoothly, adds new detail that enriches the story, shows self-awareness in reflection questions. Doesn\'t get defensive.\n- Why it matters: Follow-ups test whether you truly lived the experience. Real interviews are conversations, not monologues.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Compressed practice plan",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "The standard practice plan is 4 weeks. You have exactly 5 days before your Meta Staff Engineer behavioral interview. Design a compressed practice plan that preserves the progressive practice principles without skipping any stage. Explain what you would cut, what you would keep, and why. Address the tradeoff between breadth and depth given extreme time pressure.",
        explanation:
          "A staff-level answer demonstrates strategic thinking about practice optimization: compresses stages without skipping them, prioritizes depth over breadth, focuses on the Big Three, makes hard choices about what to cut, and shows understanding of diminishing returns at each stage.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Compressed 5-Day Plan for Meta Staff Engineer:\n\nGuiding principles: "Compress the stages but don\'t skip them." Depth beats breadth. The Big Three are non-negotiable.\n\nDay 1 (Solo — 3 hours):\n- Morning: Write CARL outlines for my 5 strongest stories and the Big Three (2 hours). Focus exclusively on Staff-level scope: cross-org impact, technical vision, mentorship, ambiguity handling.\n- Afternoon: Record each Big Three answer once. Review for pacing (10% Context target), ownership clarity ("I" audit), and energy. Re-record once with fixes. Skip the third take — good enough beats perfect. (1 hour)\n- Cut: I won\'t record all 5 core stories — only the Big Three get recordings. I rely on CARL outlines for the other 5.\n\nDay 2 (Solo + AI — 3 hours):\n- Morning: Practice Decode-Select-Deliver with 15 random questions. Focus on speed of selection and identifying catalog gaps. (1 hour)\n- Afternoon: AI practice session focused on Meta. Prompt: "Act as a Meta behavioral interviewer focused on Move Fast and Impact. Ask me questions and generate follow-ups based on my responses." Practice 4-5 questions with follow-ups. (1.5 hours)\n- Evening: Fill any catalog gaps identified — write CARL outlines for missing signal areas. (30 min)\n- Cut: I skip the company-specific question generation phase — I use AI directly as an interviewer instead.\n\nDay 3 (Peer Mock — 1.5 hours):\n- Schedule one peer mock (45-60 minutes) using a practice script covering Big Three + 4 signal-area questions. Brief my peer with the simple 1-5 rubric.\n- Debrief: 30 minutes reviewing feedback and adjusting stories.\n- Cut: Only one peer mock instead of two. I compensate by requesting brutally honest feedback.\n\nDay 4 (Professional Mock + Refinement — 2 hours):\n- If budget allows, book one professional mock focused on the Big Three and Meta values. Tell the coach: "I interview in 1 day. Focus feedback on the 2-3 highest-impact changes I can make."\n- If no professional available, do a second peer mock with a different peer for fresh perspective.\n- Evening: Implement top 2 feedback items only. Don\'t try to fix everything.\n- Cut: Only one professional session instead of two.\n\nDay 5 (Final Polish — 1 hour):\n- Morning: One final run-through of the Big Three aloud. Not recording — just speaking naturally to build conversational fluency.\n- Quick Decode-Select-Deliver drill with 5 Meta-values questions to keep the muscle warm.\n- Rest. Mental state matters as much as preparation.\n\nBreadth vs Depth decision: With 5 days, I go deep on 5 stories instead of shallow on 10. My Big Three are extremely polished. My other 5 have solid CARL outlines that I can deliver adequately. The Decode-Select-Deliver framework means I can adapt my 5 deep stories to cover most questions. At Staff level, depth of tradeoff analysis in my answers matters more than having a story for every possible question.\n\nWhat I absolutely don\'t cut: Solo recording (builds baseline), at least one human mock (creates pressure), and the Big Three (guaranteed to be asked).',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Diagnose a struggling candidate",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A candidate has completed two peer mock sessions and received consistent feedback: \"Your stories are good but something feels off — I can't quite put my finger on it. It's like I believe the story but I wouldn't hire you for a senior role based on it.\" Using the practice review criteria and assessment frameworks, diagnose the three most likely root causes and prescribe fixes for each.",
        explanation:
          'A strong answer goes beyond surface-level issues to identify subtle but critical problems: likely scope mismatch (telling IC4 stories for IC5 roles), missing ownership signals ("we" language obscuring personal contributions), and missing Learnings that would demonstrate senior-level self-awareness. The fix requires returning to story selection and structure, not just better delivery.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'The feedback "good stories but wouldn\'t hire for senior" is a classic scope and signal mismatch. Three most likely root causes:\n\n1. Scope mismatch — telling stories at the wrong level\nDiagnosis: The stories are solid but demonstrate IC4-level scope for an IC5 role. The candidate probably describes individual contributions well but the stories don\'t show cross-team influence, strategic thinking, or operating beyond their immediate team. The peer senses this as "something\'s off" but can\'t articulate it because they\'re not calibrated to detect leveling signals.\nFix: Audit each story against the target level\'s expectations. For Senior: Are you describing problems you identified yourself (not assigned)? Impact beyond your team? Influencing without authority? If not, either find higher-scope stories or restructure existing ones to emphasize the senior-level behaviors that were present but unstated.\n\n2. Ownership dilution — "we" language masking personal contribution\nDiagnosis: The candidate may be saying "we decided," "we built," "we shipped" when the interviewer needs to hear what they specifically did. Collaborative candidates often feel uncomfortable claiming credit, but this makes their individual contribution invisible. The peer believes the story is real but can\'t identify what the candidate specifically did that was senior-level.\nFix: Do an "I" vs "we" audit on recordings. Every "we" should be followed by the candidate\'s specific role: "We decided to migrate the service — I proposed the migration strategy and owned the rollout plan." The team context can be "we" but the actions must be "I."\n\n3. Missing Learnings — no demonstration of meta-cognition\nDiagnosis: The candidate tells complete Situation-Action-Result stories but doesn\'t include what they learned or how they\'ve applied it since. At junior levels, executing well is sufficient. At senior levels, interviewers expect evidence that you extract patterns from experience and compound your effectiveness. Without Learnings, the candidate sounds like a capable executor, not a senior leader.\nFix: Add a genuine Learnings component to every story. Not "I learned that teamwork is important" but "I learned that getting buy-in from the 2-3 most skeptical stakeholders first creates organic adoption — I\'ve applied this pattern to three subsequent initiatives." The specificity of the learning signals seniority.\n\nBonus diagnosis: The candidate may also lack emotional engagement. If they\'re delivering technically correct but emotionally flat stories, the peer feels the disconnect between "good content" and "not compelling." Fix: Practice with genuine enthusiasm — talk about why the work mattered to them personally.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Practice plan for a career changer",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A product manager with 5 years of experience is transitioning to software engineering. They passed a coding bootcamp and can do the technical interviews, but they're worried about behavioral interviews: \"All my stories are about PM work, not engineering. How do I practice behavioral interviews when my experience doesn't match the role?\" Design a practice strategy that addresses this challenge, referencing the progressive practice framework and the Decode-Select-Deliver methodology.",
        explanation:
          "A staff-level answer recognizes that behavioral interviews assess transferable competencies (ownership, conflict resolution, ambiguity handling), not job-title-specific experience. PM stories can be extremely powerful for engineering behaviorals if decoded and reframed correctly.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'The candidate\'s worry is based on a misconception: behavioral interviews assess competencies and behavioral patterns, not job-title-specific experience. PM experience is actually a goldmine for engineering behavioral interviews if reframed correctly.\n\nStep 1: Reframe the narrative (Solo practice, Day 1-2)\nPM work maps directly to senior engineering competencies:\n- Stakeholder management → Cross-functional leadership (signal area)\n- Prioritization and tradeoffs → Decision-making under ambiguity (signal area)\n- Shipping products → Ownership and delivery (signal area)\n- Working with engineering teams → Collaboration and influence (signal area)\n- Handling customer escalations → Conflict resolution (signal area)\n\nThe Decode step is their superpower: they already understand what interviewers are testing because they\'ve been on the other side of the table as a PM.\n\nStep 2: Build a hybrid story catalog (Solo practice, Day 2-3)\nCreate three categories of stories:\n1. PM stories reframed for engineering competencies (3-4 stories): "When I was a PM, I identified a data pipeline bottleneck that the engineering team hadn\'t noticed. I wrote a technical analysis using SQL queries to quantify the impact, proposed a solution architecture, and collaborated with the tech lead to implement it."\n2. Bootcamp/personal project stories (2-3 stories): Technical stories from the bootcamp, open-source contributions, or side projects that demonstrate engineering execution.\n3. Transition story itself (1 story): "Why engineering?" is a behavioral question in disguise — it tests self-awareness, learning velocity, and genuine passion.\n\nStep 3: Practice the Select step specifically (AI practice, Day 3-4)\nThe candidate\'s biggest challenge is the Select step — they need practice quickly evaluating whether a PM story or an engineering story better answers each question. Use AI to generate 20 engineering behavioral questions and practice rapid selection.\n\nKey insight: For most behavioral questions, the PM story told with engineering framing is stronger than a bootcamp story, because PM stories have higher scope and real-world stakes.\n\nStep 4: Peer mock with a software engineer (Day 4-5)\nCritical: The peer should be a software engineer, not another PM. They need to hear whether the stories land for someone in the engineering hiring seat. Key feedback question: "Did my PM background feel like an asset or a liability in these answers?"\n\nStep 5: Practice the "why engineering" bridge (Throughout)\nEvery response should subtly reinforce the transition narrative: "As a PM, I loved the technical aspects so much that I decided to build things myself." This isn\'t a weakness to hide — it\'s a differentiator. PMs-turned-engineers have rare cross-functional awareness that pure engineers don\'t.\n\nWhat to avoid: Don\'t apologize for PM experience. Don\'t say "I know it\'s not engineering." Frame every PM story as evidence of the behavioral competencies that make great engineers.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Name the four practice stages",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "List the four stages of progressive behavioral interview practice in the correct order, from lowest pressure to highest calibration.",
        explanation:
          "The four stages are: Solo, AI, Peer, Professional. Each stage adds a dimension that the previous one lacks. Solo builds content fluency. AI adds unpredictability. Peer adds human pressure. Professional adds expert calibration. Skipping stages wastes time and money because each builds on the foundation of the previous one.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Solo, AI, Peer, Professional",
          acceptableAnswers: [
            "Solo, AI, Peer, Professional",
            "solo, ai, peer, professional",
            "Solo, AI, Peer mock, Professional mock",
            "Solo practice, AI practice, Peer mocks, Professional mocks",
            "solo ai peer professional",
            "Solo → AI → Peer → Professional",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Key ownership indicator in recordings",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "When reviewing your practice recordings for clarity of ownership, what specific word-usage pattern should you audit to ensure your personal contributions are clearly visible?",
        explanation:
          'You should count how many times you say "I" versus "we." Collaborative candidates often default to "we" language, which causes their personal actions to disappear into team accomplishments. Interviewers need to know what you did, not what your team accomplished. Every "we" in the Actions section should be examined — if you personally did it, say "I."',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "I versus we",
          acceptableAnswers: [
            "I versus we",
            "I vs we",
            '"I" versus "we"',
            '"I" vs "we"',
            "I vs. we",
            "I and we",
            "counting I versus we",
            "how many times you say I versus we",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "The Big Three questions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'What are the "Big Three" questions that deserve extra practice attention because they appear in virtually every interview loop? List all three question topics.',
        explanation:
          'The Big Three are: "Tell me about yourself" (TMAY — career narrative and first impression), "Tell me about your favorite project" (highest-impact work), and "Tell me about a conflict" (interpersonal and emotional intelligence). These three are so common that you can essentially guarantee you\'ll face them, which means they deserve more preparation than any other questions.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Tell me about yourself, favorite project, a conflict",
          acceptableAnswers: [
            "Tell me about yourself, favorite project, a conflict",
            "TMAY, favorite project, conflict",
            "about yourself, favorite project, conflict",
            "Tell me about yourself, Tell me about your favorite project, Tell me about a conflict",
            "yourself, project, conflict",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "What the DSD drill reveals",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "When practicing the Decode-Select-Deliver exercise with random questions, what specific type of preparation gap does this exercise reveal that other practice methods do not?",
        explanation:
          "The Decode-Select-Deliver exercise specifically reveals gaps in your story catalog — signal areas where you don't have ready-made stories. When you can decode a question and identify the signal area but can't find a matching story in your catalog, it means you need to return to story identification to fill that hole. This is a preparation gap (missing stories) rather than a delivery gap (poor execution of existing stories).",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Gaps in your story catalog for specific signal areas",
          acceptableAnswers: [
            "Gaps in your story catalog for specific signal areas",
            "story catalog gaps",
            "gaps in story catalog",
            "signal areas where you don't have stories",
            "missing stories for signal areas",
            "catalog gaps",
            "story gaps",
          ],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match practice stage to its unique benefit",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each progressive practice stage to the unique benefit it provides:",
        explanation:
          "Solo practice builds content fluency and muscle memory in a safe, low-pressure environment. AI practice provides unpredictable questions and follow-ups with unlimited availability. Peer mocks introduce genuine human pressure and natural conversational dynamics. Professional mocks offer expert calibration against real hiring standards and company-specific expectations.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Solo practice",
              right: "Build content fluency and muscle memory in a low-pressure environment",
            },
            {
              id: "p2",
              left: "AI practice",
              right:
                "Test yourself with unpredictable questions and generate follow-ups at any time",
            },
            {
              id: "p3",
              left: "Peer mock",
              right: "Experience genuine human pressure and natural conversational dynamics",
            },
            {
              id: "p4",
              left: "Professional mock",
              right:
                "Calibrate your performance against real hiring standards and company expectations",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match recording review criterion to what it reveals",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each self-recording review criterion to the underlying issue it helps you detect:",
        explanation:
          'Pacing reveals whether you\'re over-indexing on context at the expense of actions — the most common structural problem. "I" vs "we" audit reveals whether your personal contributions are invisible behind team language. Verbal filler patterns reveal nervousness and can undermine your credibility. Energy and engagement levels reveal whether you\'re connecting emotionally with your own story — a signal interviewers heavily weight.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Pacing analysis",
              right: "Whether you over-index on context at the expense of your specific actions",
            },
            {
              id: "p2",
              left: '"I" vs "we" audit',
              right: "Whether your personal contributions are invisible behind team-level language",
            },
            {
              id: "p3",
              left: "Verbal filler count",
              right: "Patterns of nervousness that reduce your credibility with the interviewer",
            },
            {
              id: "p4",
              left: "Energy assessment",
              right: "Whether you emotionally connect with your story or sound disengaged",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match peer feedback dimension to interviewer evaluation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each peer mock rubric dimension to the real interviewer evaluation criterion it maps to:",
        explanation:
          "The peer rubric dimensions directly map to how real interviewers evaluate candidates. Structure maps to communication skills — interviewers use your ability to organize a coherent narrative as a proxy for how you'll communicate in the role. Story choice maps to leveling — the scope of stories you choose is the primary signal interviewers use for level calibration. Depth maps to credibility — specific, repeatable actions prove you actually did the work versus inflating contributions. Follow-up handling maps to authentic experience — interviewers use follow-ups to verify you truly lived the situation and can think beyond rehearsed narratives.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Structure (CARL execution)",
              right:
                "Communication skills — organized narrative signals organized thinking for the role",
            },
            {
              id: "p2",
              left: "Story choice and scope",
              right:
                "Leveling — the scope of your stories is the primary signal for level calibration",
            },
            {
              id: "p3",
              left: "Depth and specificity",
              right: "Credibility — specific, repeatable actions prove you actually did the work",
            },
            {
              id: "p4",
              left: "Follow-up handling",
              right:
                "Authentic experience — ability to go deeper proves you truly lived the situation",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "Recommended pacing for context",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "When delivering a CARL response, you should spend approximately ___% of your time on Context, ___% on Actions, and ___% on Results and Learnings.",
        explanation:
          "The recommended split is 10% Context, 60% Actions, 30% Results and Learnings. Most candidates over-index on Context (spending 50%+ on setup) and under-invest in Actions, which is where interviewers learn the most about what you actually did.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "When delivering a CARL response, you should spend approximately {{blank1}}% of your time on Context, {{blank2}}% on Actions, and {{blank3}}% on Results and Learnings.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "10",
              acceptableAnswers: ["10", "ten"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "60",
              acceptableAnswers: ["60", "sixty"],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "30",
              acceptableAnswers: ["30", "thirty"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Practice avoids robotic delivery when...",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Practice will not make you sound robotic if you drill the key _____ to get across instead of memorizing exactly what to _____.",
        explanation:
          "You should drill the key points to get across, not the exact words to say. When you practice key points and structure, your specific language varies naturally each time — producing conversational delivery. When you memorize exact wording, any deviation causes hesitation and the delivery feels scripted.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Practice will not make you sound robotic if you drill the key {{blank1}} to get across instead of memorizing exactly what to {{blank2}}.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "points",
              acceptableAnswers: ["points", "ideas", "themes", "messages"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "say",
              acceptableAnswers: ["say", "say word-for-word", "recite"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Peer mock feedback rubric dimensions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "The recommended peer mock feedback rubric uses a 1-5 scale across four dimensions: _____, Story choice, Story _____, and Delivery.",
        explanation:
          "The four rubric dimensions are: Structure (was the CARL framework used effectively?), Story choice (did the story match the question and demonstrate appropriate scope?), Story depth (were there enough specific, repeatable actions and quantifiable results?), and Delivery (how was the energy, pacing, and overall presence?). These dimensions map to the real evaluation criteria interviewers use.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "The recommended peer mock feedback rubric uses a 1-5 scale across four dimensions: {{blank1}}, Story choice, Story {{blank2}}, and Delivery.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Structure",
              acceptableAnswers: ["Structure", "structure"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "depth",
              acceptableAnswers: ["depth", "Depth"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
