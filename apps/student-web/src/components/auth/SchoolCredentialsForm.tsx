import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@levelup/shared-stores";
import { Button, Input, Tabs, TabsList, TabsTrigger } from "@levelup/shared-ui";
import { Loader2 } from "lucide-react";

type LoginMethod = "email" | "roll-number";

interface SchoolCredentialsFormProps {
  schoolCode: string;
  schoolName: string;
  onBack: () => void;
}

export function SchoolCredentialsForm({
  schoolCode,
  schoolName,
  onBack,
}: SchoolCredentialsFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithSchoolCode, loading, error, clearError } = useAuthStore();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("roll-number");
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await loginWithSchoolCode(schoolCode.trim(), credential, password);
      navigate(from, { replace: true });
    } catch {
      // Error is already set in the store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-muted rounded-md p-3 text-sm">
        <span className="font-medium">{schoolName}</span>
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={() => {
            clearError();
            onBack();
          }}
          className="ml-2"
        >
          Change
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">{error}</div>
      )}

      <Tabs
        value={loginMethod}
        onValueChange={(v) => {
          setLoginMethod(v as LoginMethod);
          setCredential("");
        }}
      >
        <TabsList className="w-full">
          <TabsTrigger value="roll-number" className="flex-1">
            Roll Number
          </TabsTrigger>
          <TabsTrigger value="email" className="flex-1">
            Email
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <label htmlFor="credential" className="text-sm font-medium">
          {loginMethod === "roll-number" ? "Roll Number" : "Email"}
        </label>
        <Input
          id="credential"
          type={loginMethod === "email" ? "email" : "text"}
          required
          autoFocus
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          placeholder={
            loginMethod === "roll-number" ? "Enter your roll number" : "student@school.com"
          }
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
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
  );
}
