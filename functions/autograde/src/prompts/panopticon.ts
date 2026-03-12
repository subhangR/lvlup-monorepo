/**
 * Panopticon scouting prompt — maps answer sheet pages to questions.
 *
 * Uses Gemini's large context window to view the entire question paper
 * and answer sheet simultaneously and build a routing map.
 */

export const PANOPTICON_SYSTEM_PROMPT = `You are Panopticon, a perfect visual pattern recognition system for mapping handwritten answer sheet pages to exam questions.

Your task: Given a question paper and answer sheets, determine which answer sheet pages contain the answer to each question.

Rules:
- Use 0-based page INDICES for the answer sheet pages (not page labels/numbers written on the pages).
- If a student's answer for one question spans multiple pages, include all page indices.
- Apply the "Sandwich Rule": if a question appears on pages 2 and 5, and no other question is identified on pages 3 and 4, infer that pages 3-4 also belong to that question.
- If a question has no answer at all, map it to an empty array [].
- Assign a confidence score (0–1) for each mapping.
- Add notes for ambiguous or unusual cases.
- Students may answer questions out of order. Look at the actual content, not just the position.
- Look for question numbers, labels, or headings written by the student.
- Return ONLY valid JSON.`;

export function buildPanopticonUserPrompt(questionIds: string[]): string {
  return `Map each exam question to the answer sheet page(s) that contain the student's response.

Questions to map: ${JSON.stringify(questionIds)}

Return a JSON object with this exact schema:
{
  "routing_map": {
    "Q1": [0, 1],
    "Q2": [2],
    "Q3": [3, 4]
  },
  "confidence": {
    "Q1": 0.95,
    "Q2": 0.88,
    "Q3": 0.92
  },
  "notes": {
    "Q1": "Answer spans 2 pages",
    "Q2": "Partial answer only"
  }
}

The images are provided in this order:
1. QUESTION PAPER pages (for reference)
2. ANSWER SHEET pages (to be mapped)

Map answer sheet pages using 0-based indices relative to the ANSWER SHEET images only (not the question paper pages).`;
}

export interface PanopticonResult {
  routing_map: Record<string, number[]>;
  confidence: Record<string, number>;
  notes?: Record<string, string>;
}

/**
 * Parse and validate Panopticon scouting response.
 */
export function parsePanopticonResponse(
  text: string,
  questionIds: string[],
  totalAnswerPages: number,
): PanopticonResult {
  const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
  const parsed = JSON.parse(cleaned) as PanopticonResult;

  if (!parsed.routing_map) {
    throw new Error('Missing routing_map in Panopticon response.');
  }

  // Apply sandwich rule
  for (const qId of questionIds) {
    const pages = parsed.routing_map[qId];
    if (!pages || pages.length < 2) continue;

    const sorted = [...pages].sort((a, b) => a - b);
    const filled: number[] = [];
    for (let i = sorted[0]; i <= sorted[sorted.length - 1]; i++) {
      // Only fill gaps that aren't claimed by another question
      const claimedByOther = questionIds.some(
        (otherId) =>
          otherId !== qId && parsed.routing_map[otherId]?.includes(i),
      );
      if (!claimedByOther) {
        filled.push(i);
      }
    }
    parsed.routing_map[qId] = filled;
  }

  // Validate page indices are in range
  for (const [qId, pages] of Object.entries(parsed.routing_map)) {
    for (const p of pages) {
      if (p < 0 || p >= totalAnswerPages) {
        throw new Error(
          `Invalid page index ${p} for question ${qId}. Total answer pages: ${totalAnswerPages}.`,
        );
      }
    }
  }

  return parsed;
}
