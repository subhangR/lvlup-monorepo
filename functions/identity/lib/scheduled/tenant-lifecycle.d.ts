/**
 * Tenant Lifecycle Automation — Daily trial expiry check.
 *
 * Runs daily at 00:00 UTC:
 * 1. Transitions trial tenants past expiresAt → expired
 * 2. Flags long-expired tenants (>30 days, no activity) for admin review
 */
export declare const tenantLifecycleCheck: import("firebase-functions/scheduler").ScheduleFunction;
