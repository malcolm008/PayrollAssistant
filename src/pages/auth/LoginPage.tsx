import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldAlert,
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
        className="mb-6 flex items-center gap-2 text-xs text-[#666666] transition-colors hover:text-[#f5f5f5]"
      >
        <ArrowLeft size={14} />
        Change company
      </button>

      <Card className="overflow-hidden">
        <div className="border-b border-[#202020] px-6 py-7">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
            <LockKeyhole size={21} />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
            {company?.name}
          </p>

          <h1 className="mt-2 text-xl font-semibold">
            Sign in to Payroll Core
          </h1>

          <p className="mt-2 text-xs leading-5 text-[#666666]">
            Enter your credentials to access your payroll
            workspace.
          </p>
        </div>

        <form
          className="space-y-5 p-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="flex gap-3 rounded-lg border border-[#ff4d4f]/20 bg-[#ff4d4f]/[0.05] p-3">
              <ShieldAlert
                size={17}
                className="mt-0.5 shrink-0 text-[#ff4d4f]"
              />

              <p className="text-xs leading-5 text-[#ff7777]">
                {error}
              </p>
            </div>
          )}

          <Input
            id="username"
            label="Username or employee ID"
            placeholder="Enter your username"
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
              placeholder="Enter your password"
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
              className="absolute right-3 top-[30px] flex h-8 w-8 items-center justify-center rounded-md text-[#555555] hover:text-[#f5f5f5]"
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
              className="text-xs text-[#d4af37] hover:text-[#f0c75e]"
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

        <div className="border-t border-[#202020] px-6 py-4 text-[10px] text-[#555555]">
          Access is restricted to authorized personnel.
        </div>
      </Card>
    </div>
  );
}