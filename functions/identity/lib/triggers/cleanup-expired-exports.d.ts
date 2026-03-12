/**
 * Scheduled trigger: runs every 30 minutes to delete expired credential export files.
 * Files are tagged with `deleteAfter` metadata during bulk import.
 */
export declare const cleanupExpiredExports: import("firebase-functions/scheduler").ScheduleFunction;
