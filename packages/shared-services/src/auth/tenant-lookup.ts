import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseServices } from '../firebase';
import type { TenantCodeIndex, Tenant } from '@levelup/shared-types';

/**
 * Look up a tenant by its short code (e.g. "SPR001").
 * Reads /tenantCodes/{code} → /tenants/{tenantId}.
 * Returns null if the code does not exist.
 */
export async function lookupTenantByCode(
  code: string,
): Promise<Tenant | null> {
  const { db } = getFirebaseServices();
  const normalised = code.toUpperCase().trim();

  // 1. Resolve code → tenantId
  const codeSnap = await getDoc(doc(db, 'tenantCodes', normalised));
  if (!codeSnap.exists()) return null;

  const { tenantId } = codeSnap.data() as TenantCodeIndex;

  // 2. Fetch the tenant document
  const tenantSnap = await getDoc(doc(db, 'tenants', tenantId));
  if (!tenantSnap.exists()) return null;

  return tenantSnap.data() as Tenant;
}

/**
 * Derive a synthetic email address for a student from their roll number.
 * Mirrors the server-side logic in `functions/identity/src/utils/auth-helpers.ts`.
 *
 * Example: rollNumber="STU-001", tenantId="abc123"
 *   → "stu-001@abc123.levelup.internal"
 */
export function deriveStudentEmail(
  rollNumber: string,
  tenantId: string,
): string {
  const sanitised = rollNumber
    .replace(/[^a-zA-Z0-9\-_]/g, '')
    .toLowerCase();
  return `${sanitised}@${tenantId}.levelup.internal`;
}
