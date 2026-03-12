export declare const listAnnouncements: import("firebase-functions/https").CallableFunction<any, Promise<{
    announcements: {
        id: string;
        title: any;
        body: any;
        authorName: any;
        scope: any;
        status: any;
        targetRoles: any;
        targetClassIds: any;
        publishedAt: any;
        archivedAt: any;
        expiresAt: any;
        createdAt: any;
        updatedAt: any;
    }[];
    nextCursor: string | undefined;
}>, unknown>;
