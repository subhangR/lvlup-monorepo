import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  documentId,
} from "firebase/firestore";
import { getFirebaseServices } from "@levelup/shared-services";
import type { Submission, Exam } from "@levelup/shared-types";

export function useChildSubmissions(
  tenantId: string | null,
  studentIds: string[] | undefined,
) {
  return useQuery<(Submission & { examTitle?: string; examSubject?: string })[]>({
    queryKey: ["tenants", tenantId, "childSubmissions", studentIds],
    queryFn: async () => {
      if (!tenantId || !studentIds?.length) return [];
      const { db } = getFirebaseServices();
      const allSubmissions: Submission[] = [];

      for (let i = 0; i < studentIds.length; i += 30) {
        const batch = studentIds.slice(i, i + 30);
        const colRef = collection(db, `tenants/${tenantId}/submissions`);
        const q = query(
          colRef,
          where("studentId", "in", batch),
          where("resultsReleased", "==", true),
          orderBy("createdAt", "desc"),
        );
        const snap = await getDocs(q);
        allSubmissions.push(
          ...snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Submission),
        );
      }

      const uniqueExamIds = [...new Set(allSubmissions.map((s) => s.examId).filter(Boolean))];
      const examCache: Record<string, { title: string; subject: string }> = {};

      for (let i = 0; i < uniqueExamIds.length; i += 30) {
        const batch = uniqueExamIds.slice(i, i + 30);
        try {
          const colRef = collection(db, `tenants/${tenantId}/exams`);
          const q = query(colRef, where(documentId(), "in", batch));
          const snap = await getDocs(q);
          for (const d of snap.docs) {
            const examData = d.data() as Exam;
            examCache[d.id] = { title: examData.title, subject: examData.subject };
          }
        } catch {
          await Promise.all(
            batch.map(async (examId) => {
              if (examCache[examId]) return;
              try {
                const examDoc = await getDoc(doc(db, `tenants/${tenantId}/exams`, examId));
                if (examDoc.exists()) {
                  const examData = examDoc.data() as Exam;
                  examCache[examId] = { title: examData.title, subject: examData.subject };
                }
              } catch {
                // Ignore individual fetch errors
              }
            }),
          );
        }
      }

      return allSubmissions.map((sub) => ({
        ...sub,
        examTitle: examCache[sub.examId]?.title,
        examSubject: examCache[sub.examId]?.subject,
      }));
    },
    enabled: !!tenantId && !!studentIds?.length,
    staleTime: 60 * 1000,
  });
}
