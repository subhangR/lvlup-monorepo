import type { PlatformActivityAction } from '@levelup/shared-types';
/**
 * Write a platform-wide activity log entry.
 * Collection: /platformActivityLog/{autoId}
 */
export declare function writePlatformActivity(action: PlatformActivityAction, actorUid: string, metadata?: Record<string, unknown>, tenantId?: string): Promise<void>;
