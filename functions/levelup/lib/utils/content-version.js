"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeContentVersion = writeContentVersion;
const admin = __importStar(require("firebase-admin"));
const v2_1 = require("firebase-functions/v2");
/**
 * Writes a ContentVersion document to track content changes.
 * Collection: /tenants/{tenantId}/spaces/{spaceId}/versions/{versionId}
 */
async function writeContentVersion(db, tenantId, spaceId, params) {
    const versionsPath = `tenants/${tenantId}/spaces/${spaceId}/versions`;
    // Get next version number
    const lastVersion = await db
        .collection(versionsPath)
        .where('entityType', '==', params.entityType)
        .where('entityId', '==', params.entityId)
        .orderBy('version', 'desc')
        .limit(1)
        .get();
    const nextVersion = lastVersion.empty ? 1 : (lastVersion.docs[0].data().version ?? 0) + 1;
    const versionRef = db.collection(versionsPath).doc();
    await versionRef.set({
        id: versionRef.id,
        version: nextVersion,
        entityType: params.entityType,
        entityId: params.entityId,
        changeType: params.changeType,
        changeSummary: params.changeSummary,
        changedBy: params.changedBy,
        changedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    v2_1.logger.info(`Wrote version ${nextVersion} for ${params.entityType}:${params.entityId}`);
    return versionRef.id;
}
//# sourceMappingURL=content-version.js.map