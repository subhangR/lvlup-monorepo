"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoEvaluateSubmission = autoEvaluateSubmission;
const firestore_1 = require("firebase-admin/firestore");
/**
 * Auto-evaluate a submission for deterministic question types.
 * Returns null if the question type requires AI evaluation.
 */
function autoEvaluateSubmission(item, submission, answerKey) {
  const qType = submission.questionType;
  const payload = item.payload;
  const qData = answerKey ?? payload?.questionData;
  if (!qData) return null;
  const maxScore = item.meta?.totalPoints ?? payload?.basePoints ?? 1;
  switch (qType) {
    case "mcq":
      return evaluateMCQ(submission.answer, qData, maxScore);
    case "mcaq":
      return evaluateMCAQ(submission.answer, qData, maxScore);
    case "true-false":
      return evaluateTrueFalse(submission.answer, qData, maxScore);
    case "numerical":
      return evaluateNumerical(submission.answer, qData, maxScore);
    case "fill-blanks":
      return evaluateFillBlanks(submission.answer, qData, maxScore);
    case "fill-blanks-dd":
      return evaluateFillBlanksDD(submission.answer, qData, maxScore);
    case "matching":
      return evaluateMatching(submission.answer, qData, maxScore);
    case "jumbled":
      return evaluateJumbled(submission.answer, qData, maxScore);
    case "group-options":
      return evaluateGroupOptions(submission.answer, qData, maxScore);
    default:
      return null; // Requires AI evaluation
  }
}
function buildResult(score, maxScore, correct) {
  return {
    score,
    maxScore,
    correctness: maxScore > 0 ? score / maxScore : 0,
    percentage: maxScore > 0 ? (score / maxScore) * 100 : 0,
    strengths: correct ? ["Correct answer"] : [],
    weaknesses: correct ? [] : ["Incorrect answer"],
    missingConcepts: [],
    confidence: 1,
    mistakeClassification: correct ? "None" : undefined,
    gradedAt: firestore_1.Timestamp.now(),
  };
}
function evaluateMCQ(answer, qData, maxScore) {
  const correctOption = qData.options?.find((o) => o.isCorrect);
  const isCorrect = correctOption && answer === correctOption.id;
  return buildResult(isCorrect ? maxScore : 0, maxScore, !!isCorrect);
}
function evaluateMCAQ(answer, qData, maxScore) {
  const correctIds = new Set((qData.options || []).filter((o) => o.isCorrect).map((o) => o.id));
  const selectedIds = new Set(Array.isArray(answer) ? answer : []);
  if (correctIds.size === 0) return buildResult(0, maxScore, false);
  let correctSelections = 0;
  for (const id of selectedIds) {
    if (correctIds.has(id)) correctSelections++;
  }
  // Deduct for wrong selections
  const wrongSelections = selectedIds.size - correctSelections;
  const score = Math.max(0, (correctSelections - wrongSelections) / correctIds.size) * maxScore;
  const isCorrect = correctSelections === correctIds.size && wrongSelections === 0;
  return buildResult(Math.round(score * 100) / 100, maxScore, isCorrect);
}
function evaluateTrueFalse(answer, qData, maxScore) {
  const isCorrect = answer === qData.correctAnswer;
  return buildResult(isCorrect ? maxScore : 0, maxScore, isCorrect);
}
function evaluateNumerical(answer, qData, maxScore) {
  const studentAnswer = parseFloat(answer);
  if (isNaN(studentAnswer)) return buildResult(0, maxScore, false);
  const correctAnswer = qData.correctAnswer;
  const tolerance = qData.tolerance ?? 0;
  const isCorrect = Math.abs(studentAnswer - correctAnswer) <= tolerance;
  return buildResult(isCorrect ? maxScore : 0, maxScore, isCorrect);
}
function evaluateFillBlanks(answer, qData, maxScore) {
  const blanks = qData.blanks || [];
  if (blanks.length === 0) return buildResult(0, maxScore, false);
  const answerMap = answer;
  let correctCount = 0;
  for (const blank of blanks) {
    const studentAnswer = answerMap?.[blank.id] ?? "";
    const caseSensitive = blank.caseSensitive ?? false;
    const normalize = (s) => (caseSensitive ? s.trim() : s.trim().toLowerCase());
    const acceptable = [blank.correctAnswer, ...(blank.acceptableAnswers || [])].map(normalize);
    if (acceptable.includes(normalize(String(studentAnswer)))) {
      correctCount++;
    }
  }
  const score = (correctCount / blanks.length) * maxScore;
  return buildResult(Math.round(score * 100) / 100, maxScore, correctCount === blanks.length);
}
function evaluateFillBlanksDD(answer, qData, maxScore) {
  const blanks = qData.blanks || [];
  if (blanks.length === 0) return buildResult(0, maxScore, false);
  const answerMap = answer;
  let correctCount = 0;
  for (const blank of blanks) {
    if (answerMap?.[blank.id] === blank.correctOptionId) {
      correctCount++;
    }
  }
  const score = (correctCount / blanks.length) * maxScore;
  return buildResult(Math.round(score * 100) / 100, maxScore, correctCount === blanks.length);
}
function evaluateMatching(answer, qData, maxScore) {
  const answerMap = answer;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const legacy = qData;
  // Legacy leftItems/rightItems/correctPairs format (from seed data)
  if (Array.isArray(legacy.leftItems) && Array.isArray(legacy.correctPairs)) {
    const correctPairs = legacy.correctPairs;
    if (correctPairs.length === 0) return buildResult(0, maxScore, false);
    let correctCount = 0;
    for (const cp of correctPairs) {
      if (answerMap?.[cp.leftId] === cp.rightId) correctCount++;
    }
    const score = (correctCount / correctPairs.length) * maxScore;
    return buildResult(
      Math.round(score * 100) / 100,
      maxScore,
      correctCount === correctPairs.length
    );
  }
  // Standard pairs format: answer maps leftPairId → rightPairId (same pair = correct)
  const pairs = qData.pairs || [];
  if (pairs.length === 0) return buildResult(0, maxScore, false);
  let correctCount = 0;
  for (const pair of pairs) {
    if (answerMap?.[pair.id] === pair.id) correctCount++;
  }
  const score = (correctCount / pairs.length) * maxScore;
  return buildResult(Math.round(score * 100) / 100, maxScore, correctCount === pairs.length);
}
function evaluateJumbled(answer, qData, maxScore) {
  const correctOrder = qData.correctOrder || [];
  const studentOrder = Array.isArray(answer) ? answer : [];
  if (correctOrder.length === 0) return buildResult(0, maxScore, false);
  const isCorrect =
    correctOrder.length === studentOrder.length &&
    correctOrder.every((id, i) => id === studentOrder[i]);
  return buildResult(isCorrect ? maxScore : 0, maxScore, isCorrect);
}
function evaluateGroupOptions(answer, qData, maxScore) {
  const groups = qData.groups || [];
  if (groups.length === 0) return buildResult(0, maxScore, false);
  let totalItems = 0;
  let correctItems = 0;
  let wrongItems = 0;
  const answerMap = answer;
  for (const group of groups) {
    const correctSet = new Set(group.correctItems || []);
    totalItems += correctSet.size;
    const studentItems = answerMap?.[group.id] || [];
    for (const item of studentItems) {
      if (correctSet.has(item)) {
        correctItems++;
      } else {
        wrongItems++;
      }
    }
  }
  if (totalItems === 0) return buildResult(0, maxScore, false);
  // Deduct for items placed in wrong groups
  const score = Math.max(0, (correctItems - wrongItems) / totalItems) * maxScore;
  const isCorrect = correctItems === totalItems && wrongItems === 0;
  return buildResult(Math.round(score * 100) / 100, maxScore, isCorrect);
}
//# sourceMappingURL=auto-evaluate.js.map
