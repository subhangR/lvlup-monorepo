import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@levelup/shared-stores";
import { Button, Input } from "@levelup/shared-ui";
import { Loader2 } from "lucide-react";

interface ConsumerLoginFormProps {
  onSwitchToSignup: () => void;
  onSwitchToSchool: () => void;
}

export function ConsumerLoginForm({ onSwitchToSignup, onSwitchToSchool }: ConsumerLoginFormProps) {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loading, error, clearError } = useAuthStore();

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(credential, password);
      navigate("/consumer", { replace: true });
    } catch {
      // Error is already set in the store
    }
  };

  const handleGoogle = async () => {
    clearError();
    try {
      await loginWithGoogle();
      navigate("/consumer", { replace: true });
    } catch {
      // Error is already set in the store
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">{error}</div>
        )}

        <div className="space-y-2">
          <label htmlFor="consumerEmail" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="consumerEmail"
            type="email"
            required
            autoFocus
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="consumerPassword" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="consumerPassword"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card text-muted-foreground px-2">or</span>
        </div>
      </div>

      <Button variant="outline" onClick={handleGoogle} disabled={loading} className="w-full gap-2">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign in with Google
      </Button>

      <div className="mt-4 flex flex-col items-center gap-2">
        <Button variant="link" onClick={onSwitchToSignup}>
          Create an account
        </Button>
        <Button variant="link" onClick={onSwitchToSchool} className="text-muted-foreground">
          Back to school login
        </Button>
      </div>
    </>
  );
}
