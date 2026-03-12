import * as React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface SchoolCodeStepProps {
  onSchoolResolved: (school: { id: string; name: string; code: string }) => void;
  onConsumerClick?: () => void;
  lookupTenantByCode: (code: string) => Promise<{ id: string; name: string; status: string; code: string } | null>;
}

export function SchoolCodeStep({
  onSchoolResolved,
  onConsumerClick,
  lookupTenantByCode,
}: SchoolCodeStepProps) {
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const tenant = await lookupTenantByCode(code);
      if (!tenant) {
        setError("Invalid school code. Please try again.");
        return;
      }
      if (tenant.status !== "active") {
        setError("This school is not currently active.");
        return;
      }
      onSchoolResolved({ id: tenant.id, name: tenant.name, code });
    } catch {
      setError("Failed to look up school code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="schoolCode">School Code</Label>
        <Input
          id="schoolCode"
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your school code"
          autoFocus
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Validating..." : "Continue"}
      </Button>

      {onConsumerClick && (
        <p className="text-center text-sm text-muted-foreground">
          Don't have a code?{" "}
          <button
            type="button"
            onClick={onConsumerClick}
            className="text-primary underline-offset-4 hover:underline"
          >
            Login as consumer
          </button>
        </p>
      )}
    </form>
  );
}
