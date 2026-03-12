import { useState } from "react";
import { useCurrentTenantId } from "@levelup/shared-stores";
import { useStudents } from "@levelup/shared-hooks";
import { Search, Users } from "lucide-react";
import {
  Input,
  StatusBadge,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Skeleton,
} from "@levelup/shared-ui";

export default function StudentsPage() {
  const tenantId = useCurrentTenantId();
  const { data: students = [], isLoading, error } = useStudents(tenantId);
  const [search, setSearch] = useState("");

  const filtered = students.filter(
    (s) =>
      (s.displayName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      s.uid.toLowerCase().includes(search.toLowerCase()) ||
      (s.rollNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.admissionNumber ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-sm text-muted-foreground">
          Students enrolled in your classes ({students.length} total)
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, roll number, or admission number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 py-16">
          <p className="text-sm text-destructive">
            Failed to load students. Please try again later.
          </p>
        </div>
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Users className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {search ? "No students match your search" : "No students found"}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Admission No.</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.displayName ?? student.uid}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {student.rollNumber ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.admissionNumber ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.grade ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.section ?? "-"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={student.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
