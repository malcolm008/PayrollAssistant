import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { AuthLayout } from "../layouts/AuthLayout";
import { AppLayout } from "../layouts/AppLayout";
import { CompanySelectPage } from "../pages/auth/CompanySelectPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { EmployeesPage } from "../pages/employees/EmployeesPage";
import SettingsPage from "../pages/settings/SettingsPage";
import { PayrollPage } from "../pages/payroll/PayrollPage";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/company" replace />;
  }

  return children;
}

function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}

export function AppRouter() {
  const navigate = useNavigate();

  const {
    company,
    selectCompany,
  } = useAuth();

  return (
    <Routes>

      {/* ========================= */}
      {/* AUTHENTICATION             */}
      {/* ========================= */}

      <Route
        path="/company"
        element={
          <AuthLayout>
            <CompanySelectPage
              onSelect={(selectedCompany) => {
                selectCompany(selectedCompany);
                navigate("/login");
              }}
            />
          </AuthLayout>
        }
      />

      <Route
        path="/login"
        element={
          company ? (
            <AuthLayout>
              <LoginPage
                onBack={() => navigate("/company")}
                onSuccess={() => navigate("/dashboard")}
              />
            </AuthLayout>
          ) : (
            <Navigate to="/company" replace />
          )
        }
      />

      {/* ========================= */}
      {/* PROTECTED APPLICATION      */}
      {/* ========================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <DashboardPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <EmployeesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payroll"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <PayrollPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <SettingsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* FALLBACK                   */}
      {/* ========================= */}

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}