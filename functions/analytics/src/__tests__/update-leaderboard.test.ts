/**
 * Tests for updateLeaderboard trigger.
 *
 * Covers:
 *  1. Tenant-wide leaderboard updates
 *  2. Per-space leaderboard updates from spaceProgress
 *  3. Tier count computation (diamond, platinum, gold, silver)
 *  4. Deletion handling — removes leaderboard entries
 *  5. Score scaling (overallScore * 1000 for integer ranking)
 *  6. Handling missing/partial data gracefully
 *  7. Atomic RTDB multi-path updates
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockFirestore } from '../../../test-utils/mock-firestore';

// ── Mock firebase-admin ──────────────────────────────────────────────────

const mockFirestore = createMockFirestore();

const rtdbUpdates: Record<string, any>[] = [];
const rtdbRemovals: string[] = [];

const mockRtdbRefForPath = vi.fn();
const mockRtdbRef = {
  update: vi.fn(async (updates: Record<string, any>) => {
    rtdbUpdates.push(updates);
  }),
  remove: vi.fn(async () => {}),
};

vi.mock('firebase-admin', () => {
  const dbFn: any = () => ({
    ref: vi.fn((path?: string) => {
      if (path) {
        return {
          remove: vi.fn(async () => { rtdbRemovals.push(path); }),
        };
      }
      return mockRtdbRef;
    }),
  });
  dbFn.ServerValue = { TIMESTAMP: { '.sv': 'timestamp' } };

  return {
    firestore: () => mockFirestore.db,
    database: dbFn,
    initializeApp: vi.fn(),
  };
});

vi.mock('firebase-functions/v2/firestore', () => ({
  onDocumentWritten: (_opts: any, handler: Function) => handler,
}));

// ── Import under test (after mocks) ─────────────────────────────────────

import { updateLeaderboard } from '../triggers/update-leaderboard';

// ── Helpers ──────────────────────────────────────────────────────────────

const handler = updateLeaderboard as unknown as (event: any) => Promise<void>;

function makeEvent(
  afterData: Record<string, any> | null,
  params: Record<string, string> = {},
) {
  return {
    data: {
      before: { data: () => null },
      after: { data: () => afterData },
    },
    params: { tenantId: 'tenant-1', studentId: 'student-1', ...params },
  };
}

// ── Tests ────────────────────────────────────────────────────────────────

describe('updateLeaderboard — deletion handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rtdbUpdates.length = 0;
    rtdbRemovals.length = 0;
  });

  it('should remove tenant leaderboard entry when summary is deleted', async () => {
    const event = makeEvent(null);
    await handler(event);

    expect(rtdbRemovals).toContain('tenantLeaderboard/tenant-1/student-1');
    expect(mockRtdbRef.update).not.toHaveBeenCalled();
  });

  it('should use correct tenant and student IDs from params', async () => {
    const event = makeEvent(null, { tenantId: 'org-2', studentId: 'user-42' });
    await handler(event);

    expect(rtdbRemovals).toContain('tenantLeaderboard/org-2/user-42');
  });
});

describe('updateLeaderboard — tenant leaderboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rtdbUpdates.length = 0;
    rtdbRemovals.length = 0;

    // Default: no space progress docs
    mockFirestore.seedCollection('tenants/tenant-1/spaceProgress', []);
  });

  it('should update tenant leaderboard with scaled score', async () => {
    const event = makeEvent({
      overallScore: 0.78,
      isAtRisk: false,
      autograde: { averagePercentage: 80 },
      levelup: { averageCompletion: 75, totalPointsEarned: 150, streakDays: 7 },
    });
    await handler(event);

    expect(mockRtdbRef.update).toHaveBeenCalled();
    const updates = rtdbUpdates[0];
    const entry = updates['tenantLeaderboard/tenant-1/student-1'];
    expect(entry).toBeDefined();
    expect(entry.score).toBe(780); // 0.78 * 1000
    expect(entry.overallScore).toBe(0.78);
    expect(entry.examAvg).toBe(80);
    expect(entry.spaceCompletion).toBe(75);
    expect(entry.totalPoints).toBe(150);
    expect(entry.streakDays).toBe(7);
    expect(entry.isAtRisk).toBe(false);
  });

  it('should handle missing autograde and levelup gracefully', async () => {
    const event = makeEvent({ overallScore: 0.5 });
    await handler(event);

    const entry = rtdbUpdates[0]['tenantLeaderboard/tenant-1/student-1'];
    expect(entry.examAvg).toBe(0);
    expect(entry.spaceCompletion).toBe(0);
    expect(entry.totalPoints).toBe(0);
    expect(entry.streakDays).toBe(0);
    expect(entry.isAtRisk).toBe(false);
  });

  it('should default overallScore to 0 when missing', async () => {
    const event = makeEvent({
      autograde: { averagePercentage: 50 },
      levelup: { averageCompletion: 40 },
    });
    await handler(event);

    const entry = rtdbUpdates[0]['tenantLeaderboard/tenant-1/student-1'];
    expect(entry.score).toBe(0);
    expect(entry.overallScore).toBe(0);
  });
});

describe('updateLeaderboard — per-space leaderboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rtdbUpdates.length = 0;
    rtdbRemovals.length = 0;
  });

  it('should update per-space leaderboard from spaceProgress docs', async () => {
    mockFirestore.seedCollection('tenants/tenant-1/spaceProgress', [
      {
        id: 'prog-1',
        data: {
          userId: 'student-1',
          spaceId: 'space-a',
          pointsEarned: 80,
          totalPoints: 100,
          percentage: 80,
          status: 'in_progress',
        },
      },
      {
        id: 'prog-2',
        data: {
          userId: 'student-1',
          spaceId: 'space-b',
          pointsEarned: 50,
          totalPoints: 50,
          percentage: 100,
          status: 'completed',
        },
      },
    ]);

    const event = makeEvent({
      overallScore: 0.85,
      autograde: { averagePercentage: 90 },
      levelup: { averageCompletion: 80, totalPointsEarned: 130, streakDays: 5 },
    });
    await handler(event);

    const updates = rtdbUpdates[0];

    const spaceA = updates['courseLeaderboard/space-a/student-1'];
    expect(spaceA).toBeDefined();
    expect(spaceA.score).toBe(80);
    expect(spaceA.totalPoints).toBe(100);
    expect(spaceA.percentage).toBe(80);
    expect(spaceA.status).toBe('in_progress');

    const spaceB = updates['courseLeaderboard/space-b/student-1'];
    expect(spaceB).toBeDefined();
    expect(spaceB.score).toBe(50);
    expect(spaceB.status).toBe('completed');
  });

  it('should handle zero space progress docs', async () => {
    mockFirestore.seedCollection('tenants/tenant-1/spaceProgress', []);

    const event = makeEvent({ overallScore: 0.5 });
    await handler(event);

    const updates = rtdbUpdates[0];
    // Only tenant leaderboard should be present, no courseLeaderboard keys
    const courseKeys = Object.keys(updates).filter((k) => k.startsWith('courseLeaderboard'));
    expect(courseKeys).toHaveLength(0);
  });

  it('should handle missing fields in space progress gracefully', async () => {
    mockFirestore.seedCollection('tenants/tenant-1/spaceProgress', [
      { id: 'prog-1', data: { userId: 'student-1', spaceId: 'space-x' } },
    ]);

    const event = makeEvent({ overallScore: 0.3 });
    await handler(event);

    const entry = rtdbUpdates[0]['courseLeaderboard/space-x/student-1'];
    expect(entry.score).toBe(0);
    expect(entry.totalPoints).toBe(0);
    expect(entry.percentage).toBe(0);
    expect(entry.status).toBe('not_started');
  });
});

describe('updateLeaderboard — tier counts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rtdbUpdates.length = 0;
    rtdbRemovals.length = 0;
    mockFirestore.seedCollection('tenants/tenant-1/spaceProgress', []);
  });

  it('should compute tier counts from subject breakdown', async () => {
    const event = makeEvent({
      overallScore: 0.8,
      levelup: {
        averageCompletion: 80,
        totalPointsEarned: 200,
        streakDays: 10,
        subjectBreakdown: {
          Mathematics: { avgCompletion: 95 },    // diamond (>= 90)
          Science: { avgCompletion: 82 },         // platinum (>= 75)
          English: { avgCompletion: 55 },          // gold (>= 50)
          History: { avgCompletion: 30 },          // silver (>= 25)
          Art: { avgCompletion: 10 },              // below silver threshold
        },
      },
    });
    await handler(event);

    const entry = rtdbUpdates[0]['tenantLeaderboard/tenant-1/student-1'];
    expect(entry.countsByTier).toBeDefined();
    expect(entry.countsByTier.diamond).toBe(1);
    expect(entry.countsByTier.platinum).toBe(1);
    expect(entry.countsByTier.gold).toBe(1);
    expect(entry.countsByTier.silver).toBe(1);
  });

  it('should not include tier counts when no subject breakdown exists', async () => {
    const event = makeEvent({
      overallScore: 0.5,
      levelup: { averageCompletion: 50 },
    });
    await handler(event);

    const entry = rtdbUpdates[0]['tenantLeaderboard/tenant-1/student-1'];
    expect(entry.countsByTier).toBeUndefined();
  });

  it('should return all zeros when subjects are below threshold', async () => {
    const event = makeEvent({
      overallScore: 0.2,
      levelup: {
        averageCompletion: 15,
        subjectBreakdown: {
          Math: { avgCompletion: 10 },
          English: { avgCompletion: 5 },
        },
      },
    });
    await handler(event);

    const entry = rtdbUpdates[0]['tenantLeaderboard/tenant-1/student-1'];
    expect(entry.countsByTier.diamond).toBe(0);
    expect(entry.countsByTier.platinum).toBe(0);
    expect(entry.countsByTier.gold).toBe(0);
    expect(entry.countsByTier.silver).toBe(0);
  });

  it('should handle boundary values correctly', async () => {
    const event = makeEvent({
      overallScore: 0.7,
      levelup: {
        averageCompletion: 70,
        subjectBreakdown: {
          SubjectA: { avgCompletion: 90 },  // exactly diamond
          SubjectB: { avgCompletion: 75 },  // exactly platinum
          SubjectC: { avgCompletion: 50 },  // exactly gold
          SubjectD: { avgCompletion: 25 },  // exactly silver
          SubjectE: { avgCompletion: 24 },  // below silver
        },
      },
    });
    await handler(event);

    const entry = rtdbUpdates[0]['tenantLeaderboard/tenant-1/student-1'];
    expect(entry.countsByTier.diamond).toBe(1);
    expect(entry.countsByTier.platinum).toBe(1);
    expect(entry.countsByTier.gold).toBe(1);
    expect(entry.countsByTier.silver).toBe(1);
  });
});

describe('updateLeaderboard — atomicity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rtdbUpdates.length = 0;
    rtdbRemovals.length = 0;
  });

  it('should write all updates in a single RTDB call', async () => {
    mockFirestore.seedCollection('tenants/tenant-1/spaceProgress', [
      { id: 'p1', data: { userId: 'student-1', spaceId: 's1', pointsEarned: 10, totalPoints: 20, percentage: 50, status: 'in_progress' } },
      { id: 'p2', data: { userId: 'student-1', spaceId: 's2', pointsEarned: 30, totalPoints: 30, percentage: 100, status: 'completed' } },
    ]);

    const event = makeEvent({
      overallScore: 0.9,
      autograde: { averagePercentage: 90 },
      levelup: { averageCompletion: 90, totalPointsEarned: 40, streakDays: 14 },
    });
    await handler(event);

    // Should be exactly one RTDB update call with all paths
    expect(mockRtdbRef.update).toHaveBeenCalledTimes(1);
    const updates = rtdbUpdates[0];
    expect(Object.keys(updates)).toContain('tenantLeaderboard/tenant-1/student-1');
    expect(Object.keys(updates)).toContain('courseLeaderboard/s1/student-1');
    expect(Object.keys(updates)).toContain('courseLeaderboard/s2/student-1');
  });
});
