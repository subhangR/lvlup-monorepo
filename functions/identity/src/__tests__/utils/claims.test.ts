import { describe, it, expect } from 'vitest';
import { buildClaimsForMembership } from '../../utils/claims';
import type { UserMembership } from '@levelup/shared-types';

const ts = { seconds: 0, nanoseconds: 0, toDate: () => new Date(), toMillis: () => 0 };

function makeMembership(overrides: Partial<UserMembership>): UserMembership {
  return {
    id: 'uid1_tenant1',
    uid: 'uid1',
    tenantId: 'tenant1',
    tenantCode: 'TST001',
    role: 'student',
    status: 'active',
    joinSource: 'admin_created',
    createdAt: ts,
    updatedAt: ts,
    ...overrides,
  } as UserMembership;
}

describe('buildClaimsForMembership', () => {
  it('should set base claims for all roles', () => {
    const claims = buildClaimsForMembership(makeMembership({}));
    expect(claims.role).toBe('student');
    expect(claims.tenantId).toBe('tenant1');
    expect(claims.tenantCode).toBe('TST001');
  });

  it('should set studentId for student role', () => {
    const claims = buildClaimsForMembership(
      makeMembership({ role: 'student', studentId: 'stu1' }),
    );
    expect(claims.studentId).toBe('stu1');
    expect(claims.teacherId).toBeUndefined();
  });

  it('should set teacherId and classIds for teacher role', () => {
    const claims = buildClaimsForMembership(
      makeMembership({
        role: 'teacher',
        teacherId: 'tch1',
        permissions: { managedClassIds: ['c1', 'c2', 'c3'] },
      }),
    );
    expect(claims.teacherId).toBe('tch1');
    expect(claims.classIds).toEqual(['c1', 'c2', 'c3']);
    expect(claims.classIdsOverflow).toBe(false);
  });

  it('should cap classIds at 15 and set overflow flag', () => {
    const manyClassIds = Array.from({ length: 20 }, (_, i) => `class_${i}`);
    const claims = buildClaimsForMembership(
      makeMembership({
        role: 'teacher',
        teacherId: 'tch1',
        permissions: { managedClassIds: manyClassIds },
      }),
    );
    expect(claims.classIds).toHaveLength(15);
    expect(claims.classIdsOverflow).toBe(true);
  });

  it('should set parentId and studentIds for parent role', () => {
    const claims = buildClaimsForMembership(
      makeMembership({
        role: 'parent',
        parentId: 'par1',
        parentLinkedStudentIds: ['stu1', 'stu2'],
      }),
    );
    expect(claims.parentId).toBe('par1');
    expect(claims.studentIds).toEqual(['stu1', 'stu2']);
    expect(claims.classIds).toBeUndefined();
  });

  it('should set scannerId for scanner role', () => {
    const claims = buildClaimsForMembership(
      makeMembership({ role: 'scanner', scannerId: 'scan1' }),
    );
    expect(claims.scannerId).toBe('scan1');
  });

  it('should not set classIds for tenantAdmin', () => {
    const claims = buildClaimsForMembership(
      makeMembership({ role: 'tenantAdmin' }),
    );
    expect(claims.role).toBe('tenantAdmin');
    expect(claims.classIds).toBeUndefined();
    expect(claims.classIdsOverflow).toBeUndefined();
  });

  it('should handle empty managedClassIds', () => {
    const claims = buildClaimsForMembership(
      makeMembership({
        role: 'teacher',
        teacherId: 'tch1',
        permissions: { managedClassIds: [] },
      }),
    );
    expect(claims.classIds).toEqual([]);
    expect(claims.classIdsOverflow).toBe(false);
  });

  it('should handle undefined permissions for teacher', () => {
    const claims = buildClaimsForMembership(
      makeMembership({
        role: 'teacher',
        teacherId: 'tch1',
        permissions: undefined,
      }),
    );
    expect(claims.classIds).toEqual([]);
    expect(claims.classIdsOverflow).toBe(false);
  });

  it('should handle exactly 15 classIds without overflow', () => {
    const classIds = Array.from({ length: 15 }, (_, i) => `class_${i}`);
    const claims = buildClaimsForMembership(
      makeMembership({
        role: 'student',
        studentId: 'stu1',
        permissions: { managedClassIds: classIds },
      }),
    );
    expect(claims.classIds).toHaveLength(15);
    expect(claims.classIdsOverflow).toBe(false);
  });

  it('should default parentLinkedStudentIds to empty array', () => {
    const claims = buildClaimsForMembership(
      makeMembership({
        role: 'parent',
        parentId: 'par1',
        parentLinkedStudentIds: undefined,
      }),
    );
    expect(claims.studentIds).toEqual([]);
  });
});
