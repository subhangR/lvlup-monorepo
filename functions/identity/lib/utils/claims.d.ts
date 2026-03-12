import type { MembershipClaimsInput, PlatformClaims } from '@levelup/shared-types';
/**
 * Build the minimal custom claims payload for a membership.
 * Claims are the hot-path data checked by Firestore security rules.
 *
 * Accepts `MembershipClaimsInput` (a subset of `UserMembership`) so callers
 * don't need unsafe double-casts when `createdAt`/`updatedAt` are still FieldValue sentinels.
 */
export declare function buildClaimsForMembership(membership: MembershipClaimsInput): PlatformClaims;
