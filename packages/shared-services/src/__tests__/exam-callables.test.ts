import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock Firebase modules
// ---------------------------------------------------------------------------
const mockCallable = vi.fn();

vi.mock('firebase/functions', () => ({
  httpsCallable: vi.fn(() => mockCallable),
}));

vi.mock('../firebase', () => ({
  getFirebaseServices: () => ({
    functions: { app: {}, region: 'us-central1' },
  }),
}));

import { httpsCallable } from 'firebase/functions';
import { callSaveExam, callGradeQuestion, callUploadAnswerSheets } from '../autograde/exam-callables';

describe('exam-callables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // callSaveExam
  // ---------------------------------------------------------------------------
  describe('callSaveExam', () => {
    it('calls the saveExam callable and returns data', async () => {
      mockCallable.mockResolvedValue({ data: { id: 'exam-1', success: true } });

      const result = await callSaveExam({ tenantId: 't1', title: 'Test Exam' } as any);

      expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'saveExam');
      expect(result).toEqual({ id: 'exam-1', success: true });
    });

    it('propagates errors from the callable', async () => {
      mockCallable.mockRejectedValue(new Error('Permission denied'));
      await expect(callSaveExam({} as any)).rejects.toThrow('Permission denied');
    });
  });

  // ---------------------------------------------------------------------------
  // callGradeQuestion
  // ---------------------------------------------------------------------------
  describe('callGradeQuestion', () => {
    it('calls the gradeQuestion callable and returns data', async () => {
      mockCallable.mockResolvedValue({ data: { score: 8, maxScore: 10 } });

      const result = await callGradeQuestion({ questionId: 'q1' } as any);

      expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'gradeQuestion');
      expect(result).toEqual({ score: 8, maxScore: 10 });
    });
  });

  // ---------------------------------------------------------------------------
  // callUploadAnswerSheets
  // ---------------------------------------------------------------------------
  describe('callUploadAnswerSheets', () => {
    it('calls the uploadAnswerSheets callable and returns submission ID', async () => {
      mockCallable.mockResolvedValue({ data: { submissionId: 'sub-123' } });

      const result = await callUploadAnswerSheets({
        tenantId: 't1',
        examId: 'e1',
        studentId: 's1',
        classId: 'c1',
        imageUrls: ['url1', 'url2'],
      });

      expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'uploadAnswerSheets');
      expect(result.submissionId).toBe('sub-123');
    });
  });
});
