import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ────────────────────────────────────────────────────────────
const {
  mockUpdate,
  mockSet,
  mockDocGet,
  mockCollectionGet,
  mockBatchUpdate,
  mockBatchCommit,
  fakeServerTimestamp,
  fakeDelete,
  mockGetSubmission,
  mockGetQuestionSubmissions,
  mockGetExamQuestions,
} = vi.hoisted(() => ({
  mockUpdate: vi.fn().mockResolvedValue(undefined),
  mockSet: vi.fn().mockResolvedValue(undefined),
  mockDocGet: vi.fn(),
  mockCollectionGet: vi.fn(),
  mockBatchUpdate: vi.fn(),
  mockBatchCommit: vi.fn().mockResolvedValue(undefined),
  fakeServerTimestamp: { _type: 'serverTimestamp' },
  fakeDelete: { _type: 'delete' },
  mockGetSubmission: vi.fn(),
  mockGetQuestionSubmissions: vi.fn(),
  mockGetExamQuestions: vi.fn(),
}));

vi.mock('firebase-admin', () => {
  const docFn = (..._args: any[]) => ({
    id: 'mock-doc-id',
    set: mockSet,
    update: mockUpdate,
    get: mockDocGet,
  });

  const colFn = (..._args: any[]) => ({
    doc: docFn,
    get: mockCollectionGet,
  });

  const firestoreFn: any = () => ({
    collection: colFn,
    doc: docFn,
    batch: () => ({
      update: mockBatchUpdate,
      commit: mockBatchCommit,
    }),
    runTransaction: vi.fn(async (fn: Function) => {
      const txn = {
        get: mockCollectionGet,
        update: mockUpdate,
      };
      await fn(txn);
    }),
  });

  firestoreFn.FieldValue = {
    serverTimestamp: () => fakeServerTimestamp,
    delete: () => fakeDelete,
  };

  return {
    default: {
      initializeApp: vi.fn(),
      firestore: firestoreFn,
    },
    firestore: firestoreFn,
  };
});

vi.mock('firebase-functions/v2/https', () => ({
  onCall: (_opts: any, handler: Function) => handler,
  HttpsError: class HttpsError extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
    }
  },
}));

vi.mock('../../utils/assertions', () => ({
  getCallerMembership: vi.fn(() => ({
    uid: 'teacher-uid',
    tenantId: 'tenant-1',
    role: 'teacher',
    permissions: { canGradeSubmissions: true },
  })),
  assertAutogradePermission: vi.fn(),
}));

vi.mock('../../utils/firestore-helpers', () => ({
  getSubmission: (...args: any[]) => mockGetSubmission(...args),
  getQuestionSubmissions: (...args: any[]) => mockGetQuestionSubmissions(...args),
  getExamQuestions: (...args: any[]) => mockGetExamQuestions(...args),
}));

vi.mock('../../utils/grading-helpers', () => ({
  calculateSubmissionSummary: vi.fn(() => ({
    totalScore: 8,
    maxScore: 10,
    percentage: 80,
    grade: 'A',
    questionsGraded: 1,
    totalQuestions: 1,
  })),
}));

import { gradeQuestion } from '../../callable/grade-question';

function makeRequest(data: any) {
  return {
    data,
    auth: { uid: 'teacher-uid', token: { tenantId: 'tenant-1', role: 'teacher' } },
  };
}

describe('gradeQuestion callable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Validation ──────────────────────────────────────────────────────────

  it('rejects when tenantId is missing', async () => {
    await expect(
      (gradeQuestion as any)(makeRequest({ mode: 'manual' })),
    ).rejects.toThrow('Missing required fields');
  });

  it('rejects when mode is missing', async () => {
    await expect(
      (gradeQuestion as any)(makeRequest({ tenantId: 'tenant-1' })),
    ).rejects.toThrow('Missing required fields');
  });

  it('rejects invalid mode', async () => {
    await expect(
      (gradeQuestion as any)(makeRequest({
        tenantId: 'tenant-1',
        mode: 'invalid',
      })),
    ).rejects.toThrow("Invalid mode: 'invalid'");
  });

  // ── Manual grading ─────────────────────────────────────────────────────

  it('rejects manual mode without required fields', async () => {
    await expect(
      (gradeQuestion as any)(makeRequest({
        tenantId: 'tenant-1',
        mode: 'manual',
      })),
    ).rejects.toThrow('submissionId, questionId, score');
  });

  it('rejects manual grade without feedback', async () => {
    await expect(
      (gradeQuestion as any)(makeRequest({
        tenantId: 'tenant-1',
        mode: 'manual',
        submissionId: 's1',
        questionId: 'q1',
        score: 8,
      })),
    ).rejects.toThrow('feedback is required');
  });

  it('rejects manual grade when submission not found', async () => {
    mockGetSubmission.mockResolvedValue(null);

    await expect(
      (gradeQuestion as any)(makeRequest({
        tenantId: 'tenant-1',
        mode: 'manual',
        submissionId: 'missing',
        questionId: 'q1',
        score: 8,
        feedback: 'Good work',
      })),
    ).rejects.toThrow('Submission missing not found');
  });

  it('rejects manual grade when question not found', async () => {
    mockGetSubmission.mockResolvedValue({ id: 's1', examId: 'e1', pipelineStatus: 'grading' });
    mockGetExamQuestions.mockResolvedValue([{ id: 'q2', maxMarks: 10 }]);

    await expect(
      (gradeQuestion as any)(makeRequest({
        tenantId: 'tenant-1',
        mode: 'manual',
        submissionId: 's1',
        questionId: 'q1',
        score: 8,
        feedback: 'Good',
      })),
    ).rejects.toThrow('Question q1 not found');
  });

  it('rejects manual grade when score exceeds maxMarks', async () => {
    mockGetSubmission.mockResolvedValue({ id: 's1', examId: 'e1', pipelineStatus: 'grading' });
    mockGetExamQuestions.mockResolvedValue([{ id: 'q1', maxMarks: 10 }]);

    await expect(
      (gradeQuestion as any)(makeRequest({
        tenantId: 'tenant-1',
        mode: 'manual',
        submissionId: 's1',
        questionId: 'q1',
        score: 15,
        feedback: 'Overscored',
      })),
    ).rejects.toThrow('Score must be between 0 and 10');
  });

  it('rejects manual grade when score is negative', async () => {
    mockGetSubmission.mockResolvedValue({ id: 's1', examId: 'e1', pipelineStatus: 'grading' });
    mockGetExamQuestions.mockResolvedValue([{ id: 'q1', maxMarks: 10 }]);

    await expect(
      (gradeQuestion as any)(makeRequest({
        tenantId: 'tenant-1',
        mode: 'manual',
        submissionId: 's1',
        questionId: 'q1',
        score: -1,
        feedback: 'Negative',
      })),
    ).rejects.toThrow('Score must be between 0 and 10');
  });

  it('creates new question submission for manual grade when none exists', async () => {
    mockGetSubmission.mockResolvedValue({ id: 's1', examId: 'e1', pipelineStatus: 'grading' });
    mockGetExamQuestions.mockResolvedValue([{ id: 'q1', maxMarks: 10 }]);
    mockDocGet.mockResolvedValue({ exists: false });
    mockCollectionGet.mockResolvedValue({
      docs: [{ id: 'q1', data: () => ({ gradingStatus: 'manual', manualOverride: { score: 8 } }) }],
    });

    const result = await (gradeQuestion as any)(makeRequest({
      tenantId: 'tenant-1',
      mode: 'manual',
      submissionId: 's1',
      questionId: 'q1',
      score: 8,
      feedback: 'Well done',
    }));

    expect(result).toEqual({ success: true, updatedScore: 8 });
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        gradingStatus: 'manual',
        manualOverride: expect.objectContaining({
          score: 8,
          reason: 'Well done',
        }),
      }),
    );
  });

  it('overrides existing graded question submission', async () => {
    mockGetSubmission.mockResolvedValue({ id: 's1', examId: 'e1', pipelineStatus: 'grading' });
    mockGetExamQuestions.mockResolvedValue([{ id: 'q1', maxMarks: 10 }]);
    mockDocGet.mockResolvedValue({
      exists: true,
      data: () => ({ gradingStatus: 'graded', evaluation: { score: 5 } }),
    });
    mockCollectionGet.mockResolvedValue({
      docs: [{ id: 'q1', data: () => ({ gradingStatus: 'overridden', manualOverride: { score: 9 } }) }],
    });

    const result = await (gradeQuestion as any)(makeRequest({
      tenantId: 'tenant-1',
      mode: 'manual',
      submissionId: 's1',
      questionId: 'q1',
      score: 9,
      feedback: 'Adjusted score',
    }));

    expect(result).toEqual({ success: true, updatedScore: 9 });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        gradingStatus: 'overridden',
        manualOverride: expect.objectContaining({
          score: 9,
          originalScore: 5,
        }),
      }),
    );
  });

  // ── Retry mode ──────────────────────────────────────────────────────────

  it('rejects retry mode without submissionId', async () => {
    await expect(
      (gradeQuestion as any)(makeRequest({
        tenantId: 'tenant-1',
        mode: 'retry',
      })),
    ).rejects.toThrow('Retry mode requires: submissionId');
  });

  it('rejects retry when submission not found', async () => {
    mockGetSubmission.mockResolvedValue(null);

    await expect(
      (gradeQuestion as any)(makeRequest({
        tenantId: 'tenant-1',
        mode: 'retry',
        submissionId: 'missing',
      })),
    ).rejects.toThrow('not found');
  });

  it('rejects retry when submission is not grading_partial', async () => {
    mockGetSubmission.mockResolvedValue({ id: 's1', pipelineStatus: 'grading_complete' });

    await expect(
      (gradeQuestion as any)(makeRequest({
        tenantId: 'tenant-1',
        mode: 'retry',
        submissionId: 's1',
      })),
    ).rejects.toThrow("must be in 'grading_partial'");
  });

  it('retries all failed questions', async () => {
    mockGetSubmission.mockResolvedValue({ id: 's1', pipelineStatus: 'grading_partial' });
    mockGetQuestionSubmissions.mockResolvedValue([
      { id: 'qs1', questionId: 'q1', gradingStatus: 'failed' },
      { id: 'qs2', questionId: 'q2', gradingStatus: 'graded' },
      { id: 'qs3', questionId: 'q3', gradingStatus: 'failed' },
    ]);

    const result = await (gradeQuestion as any)(makeRequest({
      tenantId: 'tenant-1',
      mode: 'retry',
      submissionId: 's1',
    }));

    expect(result).toEqual({ success: true, retriedCount: 2 });
    expect(mockBatchUpdate).toHaveBeenCalledTimes(3); // 2 question resets + 1 submission status
    expect(mockBatchCommit).toHaveBeenCalled();
  });

  it('retries specific questionIds only', async () => {
    mockGetSubmission.mockResolvedValue({ id: 's1', pipelineStatus: 'grading_partial' });
    mockGetQuestionSubmissions.mockResolvedValue([
      { id: 'qs1', questionId: 'q1', gradingStatus: 'failed' },
      { id: 'qs2', questionId: 'q2', gradingStatus: 'failed' },
    ]);

    const result = await (gradeQuestion as any)(makeRequest({
      tenantId: 'tenant-1',
      mode: 'retry',
      submissionId: 's1',
      questionIds: ['q1'],
    }));

    expect(result).toEqual({ success: true, retriedCount: 1 });
  });

  it('rejects retry when no failed questions found', async () => {
    mockGetSubmission.mockResolvedValue({ id: 's1', pipelineStatus: 'grading_partial' });
    mockGetQuestionSubmissions.mockResolvedValue([
      { id: 'qs1', questionId: 'q1', gradingStatus: 'graded' },
    ]);

    await expect(
      (gradeQuestion as any)(makeRequest({
        tenantId: 'tenant-1',
        mode: 'retry',
        submissionId: 's1',
      })),
    ).rejects.toThrow('No failed questions found');
  });
});
