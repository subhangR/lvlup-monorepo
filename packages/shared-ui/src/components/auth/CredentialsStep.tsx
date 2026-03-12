import * as React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface CredentialsStepProps {
  schoolName: string;
  onBack: () => void;
  onSubmit: (credential: string, password: string) => Promise<void>;
  showRollNumberToggle?: boolean;
}

export function CredentialsStep({
  schoolName,
  onBack,
  onSubmit,
  showRollNumberToggle = false,
}: CredentialsStepProps) {
  const [loginMethod, setLoginMethod] = React.useState<"email" | "roll-number">(
    showRollNumberToggle ? "roll-number" : "email"
  );
  const [credential, setCredential] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(credential, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
        <span className="font-medium">{schoolName}</span>
        <button
          type="button"
          onClick={onBack}
          className="text-primary underline-offset-4 hover:underline"
        >
          Change
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {showRollNumberToggle && (
        <div className="flex gap-2 rounded-md bg-muted p-1">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("roll-number");
              setCredential("");
            }}
            className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
              loginMethod === "roll-number"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Roll Number
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("email");
              setCredential("");
            }}
            className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
              loginMethod === "email"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Email
          </button>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="credential">
          {loginMethod === "roll-number" ? "Roll Number" : "Email"}
        </Label>
        <Input
          id="credential"
          type={loginMethod === "email" ? "email" : "text"}
          required
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          placeholder={
            loginMethod === "roll-number"
              ? "Enter your roll number"
              : "Enter your email"
          }
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm">
        <button
          type="button"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Forgot password?
        </button>
      </p>
    </form>
  );
}
