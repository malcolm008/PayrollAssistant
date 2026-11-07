import {
  ArrowLeft,
  Eye,
  EyeOff,
  LogIn,
  ShieldAlert,
  ShieldLock,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";

interface LoginPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function LoginPage({
  onBack,
  onSuccess,
}: LoginPageProps) {
  const { company, login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const success = await login(username, password);

      if (!success) {
        setError(
          "Unable to sign in. Please check your credentials.",
        );
      } else {
        onSuccess();
      }
    } catch {
      setError(
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
      >
        <ArrowLeft size={14} />
        Change company
      </button>

      <Card className="overflow-hidden">
        <div className="border-b border-[var(--color-border)] px-6 py-7">
          {/* Flex row container to align the icon and the text block side-by-side */}
          <div className="flex items-center gap-4">
            
            {/* Icon Container (Stays exactly as it was) */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <ShieldLock size={21} />
            </div>

            {/* Text Container (Keeps the original layout and styling for company and title) */}
            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
                {company?.name}
              </p>

              <h1 className="mt-0.5 text-xl font-semibold text-[var(--color-text)]">
                Payroll Assistant
              </h1>
            </div>

          </div>
        </div>

        <form
          className="space-y-5 p-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="flex gap-3 rounded-lg border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/[0.05] p-3">
              <ShieldAlert
                size={17}
                className="mt-0.5 shrink-0 text-[var(--color-danger)]"
              />

              <p className="text-xs leading-5 text-[var(--color-danger)]">
                {error}
              </p>
            </div>
          )}

          <Input
            id="username"
            label="Username / Employee ID"
            placeholder=""
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            autoComplete="username"
          />

          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              className="pr-11"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((value) => !value)
              }
              className="absolute right-3 top-[30px] flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full"
          >
            {!loading && <LogIn size={16} />}
            Sign In
          </Button>
        </form>

        <div className="border-t border-[var(--color-border)] px-6 py-4 text-[10px] text-[var(--color-text-disabled)]">
          Access is restricted to authorized personnel.
        </div>
      </Card>
    </div>
  );
}