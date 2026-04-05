/**
 * Adapting to Big Tech — Behavioral Interview Prep Content
 * Based on HelloInterview extract
 * Covers: how scale and culture at FAANG+ shape behavioral expectations,
 *         reframing experience for Big Tech interviewers, Silicon Valley myths,
 *         adapting responses by background, Big Tech interview structure
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const behavioralAdaptingContent: StoryPointSeed = {
  title: "Adapting to Big Tech Behaviorals",
  description:
    "Learn how scale and culture at FAANG+ companies shape behavioral expectations, understand the six Silicon Valley myths that drive interviewer values, and master reframing your experience to resonate with Big Tech interviewers regardless of your background.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════════════

    // Material 1: The Shift in Scale
    {
      title: "How Scale Changes Everything at Big Tech",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "How Scale Changes Everything at Big Tech",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "Why Scale Is the Core Challenge",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                '"Because of the scale" is the top reason candidates cite for wanting to join FAANG+. But scale changes everything about how work gets done. What looks like the same work at different companies can be radically different in practice. Even if you\'re technically skilled enough, moving to FAANG+ presents two core challenges: scale and culture.',
            },
            {
              id: "b3",
              type: "heading",
              content: "Four Dimensions of Scale",
              metadata: { level: 3 },
            },
            {
              id: "b4",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Users and Systems: Serving billions of users is fundamentally different from serving tens of thousands. At a startup, "handling traffic" might mean 10,000 DAU, but at Google, a "small experiment" affects millions. The complexity of interlocking systems is sometimes extreme.',
                  "Organizational Complexity: Serving billions requires a lot of employees, so decisions propagate through tens or hundreds of thousands of people. A feature that takes two engineers a week at a startup might require coordinating across five teams and a six-month timeline at Amazon.",
                  "Pace: Big Tech pays for the best employees and expects them to deliver fast. Each individual handles multiple projects with aggressive timetables. Product experiments run hourly with massive sample sizes, but getting a new API endpoint approved might take months.",
                  "Measurement and Impact: Big Tech companies measure everything. Success is expressed through metrics and decisions are expected to be rigorously data-driven. You need baseline metrics, success criteria, experiment design, and statistical significance — all before you write code.",
                ],
              },
            },
            {
              id: "b5",
              type: "heading",
              content: "Adapting Your Responses for Scale",
              metadata: { level: 2 },
            },
            {
              id: "b6",
              type: "paragraph",
              content:
                "You don't need to have worked at Big Tech scale to demonstrate that you can. What matters is showing that you think in ways that would translate well to their environment.",
            },
            {
              id: "b7",
              type: "heading",
              content: "Before and After Reframing Examples",
              metadata: { level: 3 },
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Show familiarity with modern patterns — Before: "We just queried the database directly." After: "We queried the database directly, but I abstracted the data access layer in a way that would make it straightforward to introduce a caching tier or read replicas if traffic grew."',
                  'Express systems thinking — Before: "I built a feature that lets users upload profile photos." After: "I built the profile photo upload feature with asynchronous processing and multiple image sizes, anticipating that as our user base grew, we\'d want to optimize for different contexts."',
                  'Emphasize working with others — Before: "I implemented the feature." After: "I coordinated across design, product, and engineering to ensure alignment on user experience and technical feasibility before implementing."',
                  'Use data-driven language — Before: "I improved our deployment process." After: "I reduced deployment time from 2 hours to 15 minutes, which would have saved our 20-person engineering team about 40 hours per month."',
                  'Use Big Tech terminology — Rather than "We tried out a new feature," describe "A/B testing the new user experience." This subtle shift shows familiarity with how decisions get made at scale.',
                ],
              },
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: The Six Silicon Valley Myths
    {
      title: "The Six Silicon Valley Myths That Shape Interviewer Values",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "The Six Silicon Valley Myths That Shape Interviewer Values",
          blocks: [
            {
              id: "myth1",
              type: "heading",
              content: "Understanding the Cultural Layer",
              metadata: { level: 2 },
            },
            {
              id: "myth2",
              type: "paragraph",
              content:
                "The practicalities of scale alone don't explain why candidates struggle. Even with the right technical and organizational experience, their stories often don't resonate because FAANG+ culture prioritizes certain behaviors, attitudes, language, and ways of working. These shared narratives — \"myths\" — define what these companies value. Understanding them lets you present your experiences in ways that naturally resonate.",
            },
            {
              id: "myth3",
              type: "heading",
              content: "Myth #1: Out of the Garage",
              metadata: { level: 3 },
            },
            {
              id: "myth4",
              type: "paragraph",
              content:
                'HP, Google, and Amazon famously started in garages. That scrappy, "build with what you have" mentality is still prized even at 100,000+ employee companies. They look for engineers who are owners and entrepreneurs. Even in a top-down business, interviewers look for when you found ways to get started despite resistance. Frame vendor decisions as strategic choices you made, not processes you followed. Frame resource requests as investments you justified, not forms you submitted.',
            },
            {
              id: "myth5",
              type: "heading",
              content: "Myth #2: The Lone Hacker",
              metadata: { level: 3 },
            },
            {
              id: "myth6",
              type: "paragraph",
              content:
                'The "10x engineer" and "lone hacker" archetypes persist in Big Tech — Linus Torvalds building Linux, Zuckerberg building Facebook from a dorm room. Personal initiative is rated highly, even in team environments. Say "I took on this feature" not "My manager assigned me." Say "I worked with the platform team to fix our performance bottlenecks" not "We leveraged cross-functional synergies to ideate solutions." Show you took action without worrying too much about the rules, but don\'t suggest you worked alone.',
            },
            {
              id: "myth7",
              type: "heading",
              content: "Myth #3: Move Fast and Break Things",
              metadata: { level: 3 },
            },
            {
              id: "myth8",
              type: "paragraph",
              content:
                'Steve Jobs pushed the Mac team to ship imperfect software because "Real artists ship." Gmail stayed in beta for five years while continuously shipping improvements. Valley companies value a bias for action over careful analysis. The greatest risk is sitting on an idea while polishing it. Even if you decided to wait, frame it as a deliberate tradeoff: "We weighed the impact of delaying vs shipping as-is, but the potential for brand damage was too great."',
            },
            {
              id: "myth9",
              type: "heading",
              content: "Myth #4: Fail Fast",
              metadata: { level: 3 },
            },
            {
              id: "myth10",
              type: "paragraph",
              content:
                "YouTube started as a dating site, Pinterest began as a shopping app, Slack emerged from a failed gaming company. These companies pivoted quickly when their original vision wasn't working. Interviewers look for engineers who can acknowledge failures, surface problems early, and pivot quickly. You need failure stories. \"I've never failed anything significant\" signals you haven't tried anything big enough.",
            },
            {
              id: "myth11",
              type: "heading",
              content: "Myth #5: Embrace Conflict",
              metadata: { level: 3 },
            },
            {
              id: "myth12",
              type: "paragraph",
              content:
                'Silicon Valley\'s formative years coincided with the countercultural movement. Challenging power structures and anti-hierarchical thinking got deeply ingrained. Successful engineers initiate difficult conversations, bring data and prototypes to settle disputes, and believe good ideas can emerge from anywhere. Say "I scheduled a meeting to present my alternative with supporting data" not "We escalated to management for resolution." You need constructive conflict stories.',
            },
            {
              id: "myth13",
              type: "heading",
              content: "Myth #6: Change the World",
              metadata: { level: 3 },
            },
            {
              id: "myth14",
              type: "paragraph",
              content:
                'Steve Jobs wanted to "put a dent in the universe." Google organized the world\'s information. Valley companies frame their work in terms of global impact. Frame your impact broadly: instead of "The automation project eliminated manual tasks and increased team efficiency," say "I automated these workflows to eliminate the repetitive work that was burning out our engineers, so they could focus on building features that directly impact users." Same work, different framing.',
            },
          ],
          readingTime: 10,
        },
      },
    },

    // Material 3: Your Path to Big Tech & Interview Structure
    {
      title: "Adapting by Background & Big Tech Interview Structure",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Adapting by Background & Big Tech Interview Structure",
          blocks: [
            {
              id: "path1",
              type: "heading",
              content: "Identify the Interviewer's Concerns About You",
              metadata: { level: 2 },
            },
            {
              id: "path2",
              type: "paragraph",
              content:
                "Your background shapes what concerns the interviewer has about you. Identify the 2-3 biggest concerns they might have, then make sure your prepared stories proactively address those concerns.",
            },
            {
              id: "path3",
              type: "heading",
              content: "Coming from a Startup",
              metadata: { level: 3 },
            },
            {
              id: "path4",
              type: "paragraph",
              content:
                "If you're coming from a startup, the concern is whether you can handle the scale. Can you work across multiple teams? Can you navigate organizational and codebase complexity?",
            },
            {
              id: "path5",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Emphasize: times you coordinated across teams, projects built for scale or anticipated growth, balancing speed with quality, cross-functional collaboration, data-driven decisions",
                  "Your strength: you've worn many hats, made decisions quickly, and had direct impact on the product — make sure that shines through",
                ],
              },
            },
            {
              id: "path6",
              type: "heading",
              content: "Coming from a Non-Tech Company",
              metadata: { level: 3 },
            },
            {
              id: "path7",
              type: "paragraph",
              content:
                "If you're coming from a traditional company (insurance, media, etc.), the concern is that you're too slow, too process-heavy, too risk-averse. Can you move fast? Can you take ownership without waiting for permission? They may also worry about technical currency with older frameworks or legacy systems.",
            },
            {
              id: "path8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Emphasize: times you took initiative and moved quickly, situations where you cut through bureaucracy, examples of bias for action and owner mentality, resourcefulness",
                  "Your strength: you've worked on systems at significant scale, navigated complex organizations, dealt with production systems that couldn't fail",
                ],
              },
            },
            {
              id: "path9",
              type: "heading",
              content: "The Shift in Structure",
              metadata: { level: 2 },
            },
            {
              id: "path10",
              type: "paragraph",
              content:
                "Big Tech has employed PhDs in industrial psychology to formalize their behavioral assessments. They identify signal areas the company cares about, then translate those into rubrics for interviewers to follow.",
            },
            {
              id: "path11",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Get the rubric from the recruiter if you can. Many companies publish their leadership principles or values publicly — these often map directly to interview rubrics.",
                  "They may interrupt you or change topics abruptly to cover all required signals. This can feel like you're failing — you're not. Stay focused and roll with it.",
                  'Be ready to start immediately. They may skip small talk or "Tell me about yourself" entirely.',
                  "Provide context proactively. They may not have read your resume carefully.",
                  "Your interviewer may not be your hiring manager. At Big Tech, interviewers are often from a pool across the company, and ICs often conduct behaviorals.",
                ],
              },
            },
            {
              id: "path12",
              type: "heading",
              content: "Avoid Underselling Yourself",
              metadata: { level: 2 },
            },
            {
              id: "path13",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  'Never use disclaimers like "This was just a small project, but..." or "I know this isn\'t as big as what you do at Google, but..."',
                  'Avoid defensive language: "We didn\'t have the tools that big companies have"',
                  "Don't emphasize bureaucracy you navigated — emphasize obstacles you overcame",
                  'Never hint at "That\'s not my job" attitudes in your narratives',
                  "If you drove real impact at your scale, own it. A well-executed project affecting 50,000 users demonstrates the same fundamental skills as one affecting 50 million.",
                ],
              },
            },
            {
              id: "path14",
              type: "quote",
              content:
                "\"The interviewer knows you haven't worked at Big Tech before. That's on your resume. They're looking for evidence that you can learn to work there. Show them the fundamentals. Show them the mindset. And give your work the respect it deserves.\"",
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
      title: "Core challenges for non-FAANG candidates",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "When candidates from smaller or traditional companies move to FAANG+ interviews, what are the two core challenges they face even if they are technically skilled enough?",
        explanation:
          "The two core challenges are scale and culture. Scale manifests in users/systems, organizational complexity, pace, and measurement rigor. Culture manifests through Silicon Valley's shared myths and values — the \"Out of the Garage\" mentality, bias for action, failure-positive attitudes, and conflict embrace. Technical competence alone doesn't translate these gaps.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Scale and culture — how work gets done at billion-user companies and the values those companies prize",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Algorithm speed and system design — FAANG expects faster code and larger architectures",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Resume formatting and networking — getting past the screening stage is the real barrier",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Years of experience and educational pedigree — FAANG requires top-tier credentials",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why data-driven language matters",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'When reframing behavioral responses for Big Tech, why is it important to use data-driven language like "reduced deployment time from 2 hours to 15 minutes, saving 40 hours per month" rather than "improved our deployment process"?',
        explanation:
          "Big Tech companies measure everything. Success is expressed through metrics and decisions are expected to be rigorously data-driven. Using quantified impact language signals that you think in the same way — you measure baselines, track outcomes, and understand the downstream effects of your work. The vague version gives the interviewer nothing to anchor their assessment on.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Big Tech is metrics-obsessed — quantified impact signals you think the same way and gives interviewers concrete evidence to assess",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Interviewers have scorecards that require specific numbers from candidates",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Data-driven language makes you sound more senior regardless of the actual impact",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Big Tech only hires data scientists, so all candidates must show quantitative skills",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: 'The "Out of the Garage" myth',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'The "Out of the Garage" myth prizes scrappy, entrepreneurial thinking even at large companies. Which reframing best demonstrates this value?',
        explanation:
          'The "Out of the Garage" myth values ownership and entrepreneurial framing. The first option reframes a vendor procurement process as a strategic decision the candidate owned — they chose the vendor for time-to-market and compliance advantages, rather than following a prescribed process. This shows the candidate as an owner and entrepreneur in their space, which is what Big Tech interviewers look for regardless of the actual context.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: '"I decided going with a vendor would let us get to market faster in exchange for some UX limitations, with the bonus of a headstart on SOC2 compliance."',
              isCorrect: true,
            },
            {
              id: "b",
              text: '"We evaluated vendor solutions and selected the enterprise platform recommended by our procurement process, due to SOC2 requirements."',
              isCorrect: false,
            },
            {
              id: "c",
              text: '"I submitted a detailed RFP for three vendors and created a comparison matrix following our IT governance framework."',
              isCorrect: false,
            },
            {
              id: "d",
              text: '"I built the entire solution from scratch instead of using a vendor, because real engineers build their own tools."',
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: 'The "Lone Hacker" myth balance',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'The "Lone Hacker" myth values personal initiative, but the article warns against taking it too far. What is the correct balance this myth actually calls for in behavioral responses?',
        explanation:
          'The Lone Hacker myth values showing that YOU took action and initiative — using direct, non-corporate language — but it doesn\'t mean you worked alone. Big Tech still values collaboration. The key is to show personal agency ("I took on," "I worked with") rather than passive reception ("My manager assigned me") or corporate-speak ("We leveraged cross-functional synergies"). You should demonstrate initiative within a collaborative context.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Show you personally took action and initiative with direct language, but within a collaborative context — not that you worked alone",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Always describe working independently, then mention the team contributed at the end",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Emphasize teamwork first, then mention your specific contributions",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Focus entirely on solo achievements to demonstrate 10x engineer capability",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Move Fast and Break Things nuance",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'A candidate tells this story: "We postponed the launch by two weeks to address all remaining edge cases and polish the user interface." How should this be reframed to align with the "Move Fast and Break Things" value, even though the decision was to delay?',
        explanation:
          'The myth doesn\'t mean you should never delay — it means every decision should show deliberate tradeoff reasoning and a bias for action. Saying you "thought about the impact of delaying vs shipping as-is" and made a judgment call shows you actively weighed speed against risk. The original framing implies perfectionism was the default, not a deliberate choice. Even delaying can be framed as a bias-for-action decision if you show the tradeoff analysis.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: '"We weighed the impact of delaying vs shipping as-is, but the potential for brand damage was too great" — showing deliberate tradeoff reasoning, not perfectionism',
              isCorrect: true,
            },
            {
              id: "b",
              text: "Remove the delay from the story entirely and claim you shipped on time",
              isCorrect: false,
            },
            {
              id: "c",
              text: '"We shipped it broken and fixed it later, because real companies move fast"',
              isCorrect: false,
            },
            {
              id: "d",
              text: '"My manager decided to delay, and I disagreed but had to comply"',
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Why interviewers interrupt you",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "During a Big Tech behavioral interview, the interviewer interrupts you mid-story and abruptly changes topics. Based on how structured behavioral interviews work, what is the most likely reason?",
        explanation:
          "Big Tech uses formalized rubrics with multiple signal areas that must be covered in limited time. Interviewers are trained to get signal efficiently. When they interrupt and change topics, it typically means they've gotten enough signal on that area and need to move on to cover other required dimensions. A trained interviewer who lets you ramble for 20 minutes might not get the signal coverage they need. Frequent interruptions can actually be a positive sign.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "They've gathered enough signal on that rubric area and need to cover other required dimensions in limited time",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Your answer is wrong and they're trying to save you from further embarrassment",
              isCorrect: false,
            },
            {
              id: "c",
              text: "They're poorly trained and don't know proper interview etiquette",
              isCorrect: false,
            },
            {
              id: "d",
              text: "They're testing how you react to being interrupted as a conflict assessment",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Startup candidate's biggest risk in Big Tech behavioral",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "A candidate from a 15-person startup is interviewing at Amazon. They have strong stories about wearing many hats and making fast decisions. Despite having great content, what is the most likely concern the Amazon interviewer will try to validate, and how should the candidate proactively address it?",
        explanation:
          "For startup candidates, the primary concern isn't speed or initiative (they have that) — it's whether they can handle organizational and codebase complexity at scale. Amazon coordinates across hundreds of teams. The candidate should proactively emphasize any cross-team coordination, even if those \"teams\" were just different roles at their startup. They should also show they built for scale or anticipated growth, used data-driven decision making, and understand organizational dynamics — not just small-team velocity.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Can they navigate organizational complexity at scale — proactively include cross-team coordination, building for scalability, and data-driven decisions in their stories",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Are they too fast and reckless — they should slow down and emphasize process compliance in their stories",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Do they have enough years of experience — they should emphasize how many years they spent at the startup",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Can they handle the slower pace at Amazon — they should show patience and willingness to wait for approvals",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: 'Why "I\'ve never failed" is a red flag',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'An interviewer asks about a time something didn\'t go as planned. The candidate responds: "Honestly, I\'ve been fortunate — all my major projects have been successful." Why is this response damaging in a Big Tech behavioral, and what does the "Fail Fast" myth reveal about the interviewer\'s deeper assessment?',
        explanation:
          "The \"Fail Fast\" myth (YouTube pivoted from dating, Slack from gaming) means Big Tech values engineers who can acknowledge failures, surface problems early, and pivot. Saying you've never failed signals two things: (1) you haven't attempted anything ambitious enough to risk failure, and (2) you may lack the self-awareness to recognize and learn from setbacks. The interviewer is assessing whether you'll hide problems or surface them early — a critical behavior at scale where hidden issues compound exponentially.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "It signals you haven't tried anything ambitious enough to fail AND that you might hide problems — the interviewer needs to know you'll surface issues early at scale",
              isCorrect: true,
            },
            {
              id: "b",
              text: "It sounds arrogant and interviewers prefer humble candidates who admit weaknesses",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Every engineer fails, so the interviewer knows you're lying and marks you as dishonest",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Big Tech wants employees who fail frequently because it generates more data for their experiment culture",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- MCAQ (4 questions) ---

    // MCAQ 1 — easy
    {
      title: "Dimensions of scale at Big Tech",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL dimensions through which scale manifests at Big Tech companies, affecting how behavioral responses should be framed:",
        explanation:
          "Scale at Big Tech manifests through: (1) Users and systems — billions of users with interlocking systems, (2) Organizational complexity — decisions propagate through thousands of people, (3) Pace — aggressive timetables with multiple parallel projects, (4) Measurement and impact — everything is measured with rigorous metrics. Interview question difficulty and compensation bands are not dimensions of scale — they're consequences of it.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Users and systems — serving billions requires fundamentally different approaches",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Organizational complexity — decisions propagate through tens of thousands of employees",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Pace — aggressive timetables with multiple parallel projects per engineer",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Measurement and impact — success is expressed through rigorous data-driven metrics",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Interview question difficulty — questions are harder because of scale",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Silicon Valley myths that shape interview values",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          'Select ALL cultural "myths" described in the material that shape what Big Tech interviewers value in behavioral responses:',
        explanation:
          'The six myths are: Out of the Garage (scrappy entrepreneurial ownership), The Lone Hacker (personal initiative and direct communication), Move Fast and Break Things (bias for action over analysis), Fail Fast (acknowledge failures and pivot quickly), Embrace Conflict (challenge ideas with data regardless of hierarchy), Change the World (frame impact broadly). "Follow the Process" is the opposite of what these myths value — it represents traditional corporate culture.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Out of the Garage — scrappy, entrepreneurial ownership mentality",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The Lone Hacker — personal initiative and direct communication",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Move Fast and Break Things — bias for action over careful analysis",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Fail Fast — acknowledge failures, surface problems early, pivot quickly",
              isCorrect: true,
            },
            {
              id: "e",
              text: "Follow the Process — demonstrate adherence to established procedures",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "What startup candidates should emphasize",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          "A candidate from a 30-person startup is preparing for a Meta behavioral interview. Select ALL areas they should emphasize to address the likely interviewer concerns about their background:",
        explanation:
          'The main concern about startup candidates is whether they can handle scale — organizational complexity, cross-team coordination, and structured processes. They should emphasize: cross-team coordination (even if "teams" were different roles), projects built for scale or anticipated growth, balancing speed with quality, and data-driven decisions. Their startup strength (fast decisions, wearing many hats, direct product impact) will come through naturally. Demonstrating they built only for the current sprint contradicts the scale concern.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Times they coordinated across teams or different roles",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Projects where they built for scale or anticipated future growth",
              isCorrect: true,
            },
            {
              id: "c",
              text: "How they balanced speed with quality in decision-making",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Data-driven decision making with measurable outcomes",
              isCorrect: true,
            },
            {
              id: "e",
              text: "How they built only what was needed for the current sprint to move fast",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Self-undermining language patterns to avoid",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Select ALL language patterns that candidates should eliminate from their Big Tech behavioral responses because they undermine credibility:",
        explanation:
          'All of the first four options are self-undermining patterns: disclaimers ("just a small project"), scale comparisons ("not as big as Google"), defensive language ("didn\'t have the tools"), and scope limitations ("that\'s not my job"). These all signal either insecurity or limited ownership. The last option — framing decisions as strategic choices — is the correct reframing technique, not something to eliminate. If you drove real impact at your scale, own it. A well-executed project affecting 50,000 users demonstrates the same fundamental skills as one affecting 50 million.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: 'Disclaimers that diminish your work: "This was just a small project, but..."',
              isCorrect: true,
            },
            {
              id: "b",
              text: 'Scale comparisons: "I know this isn\'t as big as what you do at Google, but..."',
              isCorrect: true,
            },
            {
              id: "c",
              text: 'Defensive language: "We didn\'t have the tools that big companies have"',
              isCorrect: true,
            },
            {
              id: "d",
              text: 'Scope limitations: "That wasn\'t really my responsibility" attitudes in narratives',
              isCorrect: true,
            },
            {
              id: "e",
              text: 'Strategic framing: "I decided that going with this approach would allow us to..."',
              isCorrect: false,
            },
          ],
        },
      },
    },

    // --- Paragraph (6 questions) ---

    // Paragraph 1 — medium
    {
      title: "Reframe a story for scale",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'A candidate from a small company has this story: "I built a feature that lets users upload profile photos. I stored them in S3 and displayed them on their profile page." Using the principles of adapting for Big Tech scale, reframe this story to demonstrate systems thinking, anticipation of growth, and collaboration. Write the improved version.',
        explanation:
          "A strong reframing adds: systems thinking (async processing, multiple image sizes, optimization for different contexts), anticipation of growth (designed for scale), collaboration language (coordinated with teams), and broader impact consideration (moderation, edge cases). The key is showing the candidate thinks beyond the immediate feature.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            "Improved version:\n\n\"I designed and built the profile photo upload system. I worked with product to understand our growth trajectory, then implemented asynchronous processing with a job queue so uploads wouldn't block the user experience. I generated multiple image sizes (thumbnail, medium, full) anticipating that as our user base grew, we'd need to optimize for different contexts — feed previews, profile pages, and admin views.\n\nI also coordinated with our platform team on CDN caching strategy to handle traffic spikes, and built a reporting workflow so users could flag inappropriate photos — something I raised proactively since I knew content moderation would become critical at scale.\n\nThe system processed 15,000 uploads in the first month with zero failed jobs, and the moderation flow caught 200+ policy violations before any were reported by other users. I learned that the biggest leverage in feature development isn't the happy path — it's anticipating the failure modes and abuse cases that emerge at scale.\"\n\nKey changes: (1) systems thinking — async processing, multiple sizes, CDN caching; (2) collaboration — worked with product, coordinated with platform team; (3) anticipation of scale — designed for growth contexts; (4) data-driven results — specific metrics; (5) broader impact — proactive moderation; (6) learnings component showing systems-level thinking.",
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Map Silicon Valley myths to a single story",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          "You have a story about convincing your team to abandon a six-month project that wasn't getting traction and pivot to a simpler solution that shipped in three weeks. Identify which Silicon Valley myths (Out of the Garage, Lone Hacker, Move Fast and Break Things, Fail Fast, Embrace Conflict, Change the World) this story could demonstrate, and explain how you would emphasize each relevant myth through specific language choices.",
        explanation:
          "A strong answer identifies at least 3-4 applicable myths and provides concrete language for each. The pivot story naturally maps to Fail Fast (acknowledging the project wasn't working and pivoting quickly), Move Fast (shipping in three weeks), Embrace Conflict (convincing the team, which implies disagreement), and Out of the Garage (scrappy, pragmatic solution).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'This story maps to at least four myths:\n\n1. Fail Fast — "I recognized early that our original approach wasn\'t gaining traction. Rather than doubling down on sunk costs, I proposed killing the project and reallocating our effort to a more promising direction." Language: "recognized," "killed the project," "reallocated" — shows willingness to acknowledge failure and pivot decisively.\n\n2. Move Fast and Break Things — "We shipped the simpler solution in three weeks instead of waiting six months for the comprehensive one. I scoped it to the core value proposition and deferred the nice-to-haves." Language: "shipped in three weeks," "scoped to core value," "deferred" — shows bias for action and pragmatic tradeoff-making.\n\n3. Embrace Conflict — "When I proposed abandoning the project, there was pushback from the team lead who had championed the original architecture. I scheduled a working session where I presented usage data showing declining engagement and a prototype of the simpler approach. The data made the decision clear." Language: "proposed abandoning," "pushback," "presented data," "scheduled a working session" — shows initiating difficult conversations with evidence.\n\n4. Out of the Garage — "Instead of the enterprise-grade solution we\'d been building, I proposed a scrappy version that solved the core problem with one-tenth of the codebase. I built the prototype over a weekend to prove it could work." Language: "scrappy version," "one-tenth the codebase," "built the prototype" — shows entrepreneurial, resourceful thinking.\n\n5. Change the World (possible stretch) — "The simpler solution actually served users better — they didn\'t need the complexity we were building. We freed up the team to focus on features that directly impacted customer retention." Language: frame the impact in terms of user value and team leverage.',
          minLength: 150,
          maxLength: 2500,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Adapt the same story for Amazon vs Meta",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'You have a story about cutting through bureaucracy at a large traditional company to ship a customer-facing feature faster. The original version is: "I submitted the request for additional server capacity from our infrastructure team to handle the increased load." Write two versions of this story — one optimized for an Amazon interviewer and one optimized for a Meta interviewer. Explain which myths and cultural values you\'re targeting in each version and why the emphasis differs.',
        explanation:
          "A staff-level answer demonstrates deep understanding of how company culture shapes behavioral response strategy: Amazon values data-driven ownership, customer obsession, and bias for action (LP-driven). Meta values moving fast, direct communication, and shipping iteratively. The same story gets different verbs, emphasis, and framing.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Amazon version:\n"I identified that our customer-facing checkout flow was experiencing 3-second latency spikes during peak hours, directly impacting conversion rates. I dove deep into the metrics and found our database was the bottleneck — we needed additional server capacity. Rather than submitting a standard infrastructure request that would take 6 weeks to process, I built a cost-benefit analysis showing that each day of delay was costing us $12,000 in lost conversions. I convinced the infrastructure team to expedite by demonstrating the ROI: the server investment would pay for itself in 8 days. I also proposed a phased approach — start with the minimum viable capacity increase, measure the impact, then scale up — which reduced their risk concern. Result: we cut latency by 75% and saw a 15% improvement in checkout completion within the first week."\n\nTargeted values: Customer Obsession (starts with customer impact), Bias for Action (bypassed standard process), Dive Deep (root cause analysis, metrics), Frugality (cost-benefit, phased approach), Ownership (took personal initiative on infrastructure issue).\n\nMeta version:\n"Our checkout was slow and it was killing conversions. I didn\'t want to wait 6 weeks for the standard infra request, so I pulled the latency data, walked over to the infrastructure team lead, and said — look, we\'re losing $12K a day. They approved an emergency capacity bump that afternoon. I shipped the config change same day and we saw conversion jump 15% by end of week. I also set up a latency alert so we\'d catch this proactively next time."\n\nTargeted values: Move Fast (same-day resolution, no process worship), Direct Communication ("walked over and said"), Ship and Iterate (emergency bump first, alerts for future), Impact (quantified outcome). Meta framing is shorter, more direct, and emphasizes speed of resolution over thoroughness of analysis.\n\nKey difference: Amazon wants to see the rigorous analysis and LP mapping. Meta wants to see that you moved fast, communicated directly, and shipped. Same story, different emphasis — Amazon gets the business case narrative, Meta gets the "I just went and fixed it" narrative.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Non-tech background strategy",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "A senior engineer at a Fortune 500 insurance company is preparing for a Google Staff Engineer behavioral interview. They have 12 years of experience with large-scale Java systems but have never worked at a tech company. What are the 2-3 biggest concerns the Google interviewer will have about this candidate, and how should they structure their story catalog to proactively address each concern? Provide specific reframing strategies.",
        explanation:
          "A staff-level answer identifies the interviewer's concerns (pace/risk-aversion, technical currency, cultural fit), maps each to specific myths/values, and provides concrete reframing strategies with example language.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Top 3 interviewer concerns and strategies:\n\n1. Pace and Risk Aversion — "Is this candidate too slow and process-heavy for Google?"\nThe myths at play: Move Fast, Out of the Garage.\nReframing strategy: Include 2-3 stories where you cut through bureaucracy, took initiative without waiting for approval, or shipped faster than expected. Language: "I convinced my director to skip the standard 3-month approval cycle by presenting a prototype that demonstrated viability" not "I followed our standard change management process." For the insurance context, highlight times you pushed back against excessive compliance review when the risk was manageable.\n\n2. Technical Currency — "Will their legacy Java skills translate to Google\'s modern stack?"\nReframing strategy: Show forward-thinking even within legacy constraints. Language: "I refactored our monolithic claims processor into domain-bounded services with well-defined API contracts, anticipating our eventual move to microservices" not "I maintained our legacy Java application." Include stories about introducing modern practices (CI/CD, observability, automated testing) into a traditional environment. Emphasize learning velocity — how quickly you\'ve picked up new technologies.\n\n3. Cultural Fit — "Will they thrive in Google\'s consensus-driven, technically rigorous, relatively flat culture?"\nThe myths at play: Embrace Conflict, Lone Hacker.\nReframing strategy: Insurance companies have hierarchy. Show you operated above your position. Language: "I proposed an alternative architecture to the VP-sponsored approach during our design review and presented benchmark data showing 3x better throughput" — this shows you\'ll bring data to disagreements regardless of hierarchy. Include stories about technical design discussions where you drove decisions through evidence, not authority.\n\nStory catalog structure: 8-10 stories with at least 3 that explicitly address pace (shipped fast, cut process), 2-3 that show technical evolution (modernized legacy, introduced new patterns), and 2-3 that demonstrate flat-culture behaviors (constructive disagreement, peer influence). Every story should include the "your strength" reframing: working on systems at significant scale that couldn\'t fail, navigating complex organizations, and handling production-critical systems.',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: 'Reframe a "process follower" story',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'A candidate\'s natural way of telling their best story is: "Due to changing market conditions, we had to adjust our timeline and deliverables. I submitted the request for additional resources through proper channels and we eventually got approval after the quarterly review. We then followed the standard migration procedure." Rewrite this story applying at least four of the six Silicon Valley myths, and explain which myth each change addresses.',
        explanation:
          "A strong answer transforms passive, process-oriented language into active, ownership-oriented language while maintaining authenticity. Each reframing should be tied to a specific myth with clear explanation.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Reframed version:\n\n"I recognized early that our original approach wasn\'t going to work — the market had shifted and our six-month timeline was going to deliver a product nobody wanted anymore. [Fail Fast: acknowledging failure early, using "I recognized" not passive "conditions changed"]\n\nRather than waiting for the quarterly review cycle, I built a two-week prototype of the alternative approach and presented it to the director with data showing the market shift. I made the case that every month we continued on the original path was a month of wasted engineering investment. [Out of the Garage: entrepreneurial initiative, building a prototype as proof rather than waiting for process; Move Fast: bypassing the quarterly cycle]\n\nThere was pushback from the original project champion who\'d invested significant political capital in the approved plan. I scheduled a working session where we compared the two approaches against current market data, not the six-month-old market analysis the original plan was based on. The data made the decision clear. [Embrace Conflict: initiating the difficult conversation, using data to resolve disagreement, not escalating to management]\n\nI reallocated resources to the new approach and we shipped a focused version in five weeks. It captured 30% of the new market segment in the first quarter — which meant our team\'s work directly contributed to the division\'s pivot strategy. [Change the World: framing impact broadly in terms of business strategy, not just task completion; Move Fast: shipped in five weeks, focused scope]\n\nI learned that market signals should trigger re-evaluation of any plan, regardless of how much has been invested. I\'ve since built quarterly market-check reviews into all my project plans." [Growth mindset, systemic improvement]\n\nMyths addressed:\n1. Fail Fast — killed the original plan based on early recognition\n2. Out of the Garage — built a prototype as proof, didn\'t wait for formal approval\n3. Move Fast — bypassed quarterly cycle, shipped in five weeks\n4. Embrace Conflict — confronted project champion with data\n5. Change the World — framed as strategic business impact\n\nKey transformation: every passive construction became active, every process reference became an initiative reference, and every "we had to" became "I chose to."',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Design an adaptation strategy for your background",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Choose a background (startup, non-tech enterprise, or government/military) and design a complete adaptation strategy for a FAANG behavioral interview. Include: (1) the 2-3 concerns the interviewer will have, (2) which Silicon Valley myths are most important to demonstrate, (3) which myths your background already covers naturally, (4) specific language patterns to adopt and avoid, and (5) how you would structure your opening "Tell me about yourself" to preemptively address the gaps.',
        explanation:
          "A staff-level answer shows strategic self-awareness: identifying how your background is perceived, which gaps exist, and how to proactively address them through language, story selection, and framing — all while leveraging genuine strengths rather than fabricating experience.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Background chosen: Government/Military\n\n1. Interviewer concerns:\n   a. Pace: "Government moves slowly. Can this person move at tech speed?"\n   b. Innovation: "Government follows prescribed processes. Can this person think entrepreneurially?"\n   c. Culture: "Military hierarchy is the opposite of flat tech culture. Can they work without clear chain of command?"\n\n2. Most important myths to demonstrate:\n   - Move Fast and Break Things (directly counters pace concern)\n   - Out of the Garage (directly counters innovation concern)\n   - Embrace Conflict (directly counters hierarchy concern)\n   - The Lone Hacker (shows personal initiative despite institutional constraints)\n\n3. Myths already covered naturally:\n   - Change the World: Military/government work often has massive scope and direct impact on millions of people. This is a genuine strength.\n   - Fail Fast (partially): Military after-action reviews are a sophisticated version of retrospectives. Frame this connection explicitly.\n\n4. Language patterns:\n   ADOPT: "I took ownership of..." / "I proposed..." / "I shipped..." / "I built a prototype to prove..." / "The data showed..." / "I measured the impact..."\n   AVOID: "Per regulation..." / "The standard operating procedure required..." / "My commanding officer directed..." / "We followed the established protocol..." / "The review board approved..."\n   REFRAME: "I navigated the regulatory environment" → "I found a way to ship within the constraints while pushing for faster approval paths"\n\n5. "Tell me about yourself" opening:\n   "I spent 8 years building mission-critical systems in government where failure wasn\'t an option — systems serving millions of users with zero-downtime requirements. What drives me toward [company] is bringing that reliability mindset into an environment where I can also move fast and innovate. In my last role, I introduced agile practices to a team that had never worked outside waterfall, cutting our delivery cycle from 18 months to 6 weeks. I found that the best part of my work was the scrappy problem-solving — finding ways to build what users needed despite institutional constraints. I\'m ready to apply that same problem-solving energy without the constraints."\n\nThis opening: preemptively addresses pace (mentions cutting cycles), signals cultural fit (mentions agile, scrappy), leverages strengths (reliability, scale, mission-critical), and creates a bridge narrative (constraints → no constraints = excited, not confused).',
          minLength: 250,
          maxLength: 3000,
        },
      },
    },

    // --- Text (4 questions) ---

    // Text 1 — medium
    {
      title: "Name the myth — personal initiative",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "Which Silicon Valley myth values personal initiative, direct communication (not corporate-speak), and taking action without worrying too much about the rules — but does NOT mean working alone?",
        explanation:
          'The Lone Hacker myth values individual initiative and direct communication. It\'s inspired by figures like Linus Torvalds and Mark Zuckerberg. The key nuance is that it values showing YOU took action (say "I took on this feature" not "My manager assigned me"), but Big Tech still values collaboration. The point is initiative within a team context.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "The Lone Hacker",
          acceptableAnswers: ["The Lone Hacker", "Lone Hacker", "lone hacker", "the lone hacker"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Concern about non-tech candidates",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "When a candidate comes from a traditional non-tech company (like insurance or media), what is the primary behavioral concern the Big Tech interviewer will likely have? Answer in a short phrase.",
        explanation:
          'The primary concern is that candidates from traditional companies are too slow, too process-heavy, and too risk-averse. The interviewer wants to know: can you move fast? Can you take ownership without waiting for permission? These concerns stem from the cultural gap between traditional corporate culture and Silicon Valley values like "Move Fast" and "Out of the Garage."',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer: "Too slow and process-heavy",
          acceptableAnswers: [
            "Too slow and process-heavy",
            "too slow",
            "too process-heavy",
            "too slow and risk-averse",
            "risk-averse",
            "slow and risk-averse",
            "process-heavy",
            "can they move fast",
            "pace and risk aversion",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "The startup company that pivoted from a dating site",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'The "Fail Fast" myth is illustrated by famous pivot stories. Name the company that started as a dating site before becoming one of the world\'s largest video platforms, demonstrating the value of acknowledging failure and pivoting quickly.',
        explanation:
          'YouTube started as a video dating site called "Tune In, Hook Up" before the founders realized the broader video-sharing use case was far more valuable. This is one of the canonical Silicon Valley pivot stories, alongside Pinterest (started as a shopping app) and Slack (emerged from a failed gaming company called Tiny Speck/Glitch). These stories reinforce the cultural value of recognizing when something isn\'t working and pivoting quickly.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "YouTube",
          acceptableAnswers: ["YouTube", "youtube", "Youtube"],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Identifying the myth from a reframing",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          'A candidate reframes "The automation project eliminated manual tasks and increased team efficiency" to "I automated these workflows to eliminate the repetitive work that was burning out our engineers, so they could focus on building features that directly impact users." Which Silicon Valley myth does this reframing align with?',
        explanation:
          'The "Change the World" myth, inspired by Steve Jobs wanting to "put a dent in the universe" and Google organizing the world\'s information. The reframing shifts from a cost-saving measure (team efficiency) to enabling people to do more meaningful work that directly impacts users. Both describe the same work, but the second version frames impact in terms of its broadest human effect — exactly what this myth values.',
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer: "Change the World",
          acceptableAnswers: [
            "Change the World",
            "change the world",
            "Change the world",
            "Myth #6",
            "myth 6",
          ],
          caseSensitive: false,
        },
      },
    },

    // --- Matching (3 questions) ---

    // Matching 1 — easy
    {
      title: "Match the myth to its origin story",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content:
          "Match each Silicon Valley myth to the historical example or figure that inspired it:",
        explanation:
          "Out of the Garage is inspired by HP, Google, and Amazon starting in literal garages. The Lone Hacker references Linus Torvalds building Linux and Zuckerberg building Facebook from a dorm room. Move Fast and Break Things was Zuckerberg's motto plastered on Facebook's walls. Fail Fast is exemplified by YouTube starting as a dating site and pivoting to video sharing.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Out of the Garage",
              right: "HP, Google, and Amazon starting in literal garages",
            },
            {
              id: "p2",
              left: "The Lone Hacker",
              right: "Linus Torvalds building Linux as a student",
            },
            {
              id: "p3",
              left: "Move Fast and Break Things",
              right: "Zuckerberg's motto on Facebook's walls",
            },
            {
              id: "p4",
              left: "Fail Fast",
              right: "YouTube starting as a dating site and pivoting",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: 'Match the "before" framing to its myth-aligned "after"',
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          'Match each weak "before" framing to the myth-aligned "after" reframing that would resonate with a Big Tech interviewer:',
        explanation:
          '"My manager assigned me" becomes "I took on this feature" (Lone Hacker — personal initiative). "We escalated to management" becomes "I scheduled a meeting to present my alternative with data" (Embrace Conflict — direct resolution). "We selected the vendor per procurement" becomes "I decided going with a vendor would get us to market faster" (Out of the Garage — entrepreneurial ownership). "We adjusted timeline and deliverables" becomes "I recognized the approach wasn\'t working and killed the project" (Fail Fast — decisive pivot).',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: '"My manager assigned me the feature..."',
              right: '"I took on this feature..." (Lone Hacker)',
            },
            {
              id: "p2",
              left: '"We escalated to management for resolution"',
              right:
                '"I scheduled a meeting to present my alternative with supporting data" (Embrace Conflict)',
            },
            {
              id: "p3",
              left: '"We selected the vendor per procurement process"',
              right:
                '"I decided going with a vendor would get us to market faster" (Out of the Garage)',
            },
            {
              id: "p4",
              left: '"Due to changing conditions, we adjusted our timeline"',
              right:
                '"I recognized our approach wasn\'t working, so I killed the project and reallocated" (Fail Fast)',
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match candidate background to the interviewer's primary concern",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content:
          "Match each candidate background to the primary concern a Big Tech interviewer will likely investigate during the behavioral round:",
        explanation:
          "Startup candidates raise concerns about handling organizational complexity and scale (they've been in small, flat teams). Non-tech enterprise candidates raise concerns about pace and risk tolerance (traditional companies are process-heavy and slow). Government/military candidates raise concerns about operating without hierarchy (military has rigid chain of command). FAANG IC moving to management raises concerns about people leadership (they've been individual contributors). Each background has genuine strengths that should be leveraged while proactively addressing the gap.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "Engineer from a 20-person startup",
              right:
                "Can they handle organizational complexity and navigate cross-team coordination at scale?",
            },
            {
              id: "p2",
              left: "Engineer from a Fortune 500 insurance company",
              right: "Can they move fast, take ownership, and operate without heavy process?",
            },
            {
              id: "p3",
              left: "Engineer from government/military",
              right: "Can they thrive in flat, consensus-driven culture without rigid hierarchy?",
            },
            {
              id: "p4",
              left: "Senior FAANG IC interviewing for EM role",
              right:
                "Can they lead, develop, and motivate people rather than just deliver technically?",
            },
          ],
        },
      },
    },

    // --- Fill-blanks (3 questions) ---

    // Fill-blanks 1 — easy
    {
      title: "Two core challenges for FAANG transition",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Moving to FAANG+ presents two core challenges: _____ and _____. The first changes how work gets done, and the second shapes what interviewers value in your responses.",
        explanation:
          "Scale and culture are the two core challenges. Scale manifests through users/systems, organizational complexity, pace, and measurement. Culture manifests through the shared myths and values of Silicon Valley — the garage mentality, bias for action, failure-positive attitudes, and emphasis on conflict resolution and broad impact.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Moving to FAANG+ presents two core challenges: {{blank1}} and {{blank2}}. The first changes how work gets done, and the second shapes what interviewers value in your responses.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "scale",
              acceptableAnswers: ["scale", "Scale"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "culture",
              acceptableAnswers: ["culture", "Culture"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Bias for action motto",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          'The Silicon Valley myth "_____ Fast and _____ Things" values a bias for action over careful and deliberate analysis, because the greatest risk is sitting on an idea while it\'s polished.',
        explanation:
          '"Move Fast and Break Things" was famously Mark Zuckerberg\'s motto, plastered on Facebook\'s walls. It represents the Valley\'s cultural preference for shipping and iterating over perfecting before launch. Even when the motto was later changed to "Move Fast with Stable Infra," the underlying value of speed and action remained central to how these companies hire.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            'The Silicon Valley myth "{{blank1}} Fast and {{blank2}} Things" values a bias for action over careful and deliberate analysis, because the greatest risk is sitting on an idea while it\'s polished.',
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Move",
              acceptableAnswers: ["Move", "move"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "Break",
              acceptableAnswers: ["Break", "break"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Startup candidate emphasis areas",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "A startup candidate interviewing at Big Tech should emphasize cross-team _____, projects built for _____, and _____-driven decision making to address concerns about handling organizational complexity.",
        explanation:
          "Startup candidates need to emphasize cross-team coordination (showing they can work across organizational boundaries), projects built for scale (showing they think beyond the current user base), and data-driven decision making (showing they use rigorous metrics rather than gut feel). These directly address the interviewer's concern that startup engineers may struggle with the organizational and systems complexity of Big Tech.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "A startup candidate interviewing at Big Tech should emphasize cross-team {{blank1}}, projects built for {{blank2}}, and {{blank3}}-driven decision making to address concerns about handling organizational complexity.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "coordination",
              acceptableAnswers: ["coordination", "Coordination", "collaboration", "Collaboration"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "scale",
              acceptableAnswers: ["scale", "Scale", "scalability", "growth"],
              caseSensitive: false,
            },
            {
              id: "blank3",
              correctAnswer: "data",
              acceptableAnswers: ["data", "Data", "metric", "metrics"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
