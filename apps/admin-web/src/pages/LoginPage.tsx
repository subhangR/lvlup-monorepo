import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@levelup/shared-stores";
import { lookupTenantByCode } from "@levelup/shared-services";
import { Input, Button } from "@levelup/shared-ui";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithSchoolCode, loading, error, clearError } = useAuthStore();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
  const [step, setStep] = useState<"school-code" | "credentials">("school-code");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  const handleSchoolCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCodeError("");
    setCodeLoading(true);

    try {
      const code = schoolCode.trim();
      if (!code) {
        setCodeError("Please enter a school code.");
        return;
      }

      const tenant = await lookupTenantByCode(code);
      if (!tenant) {
        setCodeError("Invalid school code. Please try again.");
        return;
      }
      if (tenant.status !== "active") {
        setCodeError("This school is currently inactive.");
        return;
      }

      setSchoolName(tenant.name);
      setStep("credentials");
    } catch {
      setCodeError("Failed to look up school code. Please try again.");
    } finally {
      setCodeLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await loginWithSchoolCode(schoolCode.trim(), email, password);
      navigate(from, { replace: true });
    } catch {
      // Error is already set in the store
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-card">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">School Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to manage your school
        </p>
      </div>

      {step === "school-code" ? (
        <form onSubmit={handleSchoolCodeSubmit} className="space-y-4">
          {codeError && (
            <div id="schoolCode-error" role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {codeError}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="schoolCode" className="text-sm font-medium">
              School Code
            </label>
            <Input
              id="schoolCode"
              type="text"
              required
              autoFocus
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              placeholder="Enter your school code"
              aria-describedby={codeError ? "schoolCode-error" : undefined}
            />
          </div>

          <Button type="submit" className="w-full" disabled={codeLoading}>
            {codeLoading ? "Validating..." : "Continue"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="rounded-md bg-muted p-3 text-sm">
            <span className="font-medium">{schoolName}</span>
            <Button
              type="button"
              variant="link"
              className="ml-2 h-auto p-0"
              onClick={() => {
                setStep("school-code");
                clearError();
                setCodeError("");
              }}
            >
              Change
            </Button>
          </div>

          {error && (
            <div id="login-error" role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@school.com"
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                aria-describedby={error ? "login-error" : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      )}
    </div>
  );
}
