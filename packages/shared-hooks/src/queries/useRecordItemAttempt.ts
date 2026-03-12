import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  callRecordItemAttempt,
  type RecordItemAttemptRequest,
  type RecordItemAttemptResponse,
} from '@levelup/shared-services';

/**
 * Mutation hook that wraps `callRecordItemAttempt`.
 * Records a single item attempt to Firestore spaceProgress and
 * invalidates the `useProgress` query cache on success so the UI
 * reflects the latest scores immediately.
 */
export function useRecordItemAttempt() {
  const queryClient = useQueryClient();

  return useMutation<RecordItemAttemptResponse, Error, RecordItemAttemptRequest>({
    mutationFn: async (params: RecordItemAttemptRequest) => {
      return callRecordItemAttempt(params);
    },
    onSuccess: (_data, variables) => {
      // Invalidate the useProgress query for this specific space
      // Query key pattern from useProgress.ts:
      //   ['tenants', tenantId, 'progress', studentId, spaceId ?? 'overall']
      // We don't know the studentId here (it's derived from auth), so
      // invalidate all progress queries for this tenant.
      queryClient.invalidateQueries({
        queryKey: ['tenants', variables.tenantId, 'progress'],
      });
    },
  });
}

export type { RecordItemAttemptRequest, RecordItemAttemptResponse };
