"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildClaimsForMembership = buildClaimsForMembership;
const shared_types_1 = require("@levelup/shared-types");
/**
 * Build the minimal custom claims payload for a membership.
 * Claims are the hot-path data checked by Firestore security rules.
 *
 * Accepts `MembershipClaimsInput` (a subset of `UserMembership`) so callers
 * don't need unsafe double-casts when `createdAt`/`updatedAt` are still FieldValue sentinels.
 */
function buildClaimsForMembership(membership) {
    const classIds = membership.permissions?.managedClassIds ?? [];
    const claims = {
        role: membership.role,
        tenantId: membership.tenantId,
        tenantCode: membership.tenantCode,
    };
    switch (membership.role) {
        case 'teacher':
            claims.teacherId = membership.teacherId;
            claims.classIds = classIds.slice(0, shared_types_1.MAX_CLAIM_CLASS_IDS);
            claims.classIdsOverflow = classIds.length > shared_types_1.MAX_CLAIM_CLASS_IDS;
            // Include teacher permissions in claims for autograde access checks
            if (membership.permissions) {
                claims.permissions = {
                    canCreateExams: membership.permissions.canCreateExams ?? false,
                    canEditRubrics: membership.permissions.canEditRubrics ?? false,
                    canManuallyGrade: membership.permissions.canManuallyGrade ?? false,
                    canViewAllExams: membership.permissions.canViewAllExams ?? false,
                    canCreateSpaces: membership.permissions.canCreateSpaces ?? false,
                    canManageContent: membership.permissions.canManageContent ?? false,
                    canViewAnalytics: membership.permissions.canViewAnalytics ?? false,
                    canConfigureAgents: membership.permissions.canConfigureAgents ?? false,
                };
            }
            break;
        case 'student':
            claims.studentId = membership.studentId;
            claims.classIds = classIds.slice(0, shared_types_1.MAX_CLAIM_CLASS_IDS);
            claims.classIdsOverflow = classIds.length > shared_types_1.MAX_CLAIM_CLASS_IDS;
            break;
        case 'parent':
            claims.parentId = membership.parentId;
            claims.studentIds = membership.parentLinkedStudentIds ?? [];
            break;
        case 'staff':
            claims.staffId = membership.staffId;
            if (membership.staffPermissions) {
                claims.staffPermissions = {
                    canManageUsers: membership.staffPermissions.canManageUsers ?? false,
                    canManageClasses: membership.staffPermissions.canManageClasses ?? false,
                    canManageBilling: membership.staffPermissions.canManageBilling ?? false,
                    canViewAnalytics: membership.staffPermissions.canViewAnalytics ?? false,
                    canManageSettings: membership.staffPermissions.canManageSettings ?? false,
                    canExportData: membership.staffPermissions.canExportData ?? false,
                };
            }
            break;
        case 'scanner':
            claims.scannerId = membership.scannerId;
            break;
        case 'tenantAdmin':
            // TenantAdmin has full access — no classIds needed
            break;
    }
    return claims;
}
//# sourceMappingURL=claims.js.map