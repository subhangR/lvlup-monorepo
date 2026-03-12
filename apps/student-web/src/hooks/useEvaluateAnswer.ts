import { useMutation } from '@tanstack/react-query';
import { callEvaluateAnswer } from '@levelup/shared-services';

export function useEvaluateAnswer() {
  return useMutation({
    mutationFn: async (params: {
      tenantId: string;
      spaceId: string;
      storyPointId: string;
      itemId: string;
      answer: unknown;
      mode: 'practice' | 'quiz';
    }) => {
      return callEvaluateAnswer(params);
    },
  });
}
