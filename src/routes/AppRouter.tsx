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
import { AttendancePage } from "../pages/attendance/AttendancePage";
import { ReportsPage } from "../pages/reports/ReportsPage";
import { AdvancesPage } from "../pages/advances/AdvancesPage";
import { AdvanceTypesPage } from "../pages/advances/AdvanceTypesPage";
import { DeductionTypesPage } from "../pages/settings/payroll/deduction-types/DeductionTypesPage";
import { AllowanceTypesPage } from "../pages/settings/payroll/allowance-types/AllowanceTypesPage";
import { CompanyInformationPage } from "../pages/settings/company/CompanyInformation";
import { EmploymentTypesPage } from "../pages/settings/company/EmploymentTypesPage";
import { LeaveTypesPage } from "../pages/settings/leave-types/LeaveTypesPage";
import { LoanTypesPage } from "../pages/settings/loan-types/LoanTypesPage";
import { DepartmentsPage } from "../pages/settings/departments/DepartmentsPage";

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
        path="/attendance"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <AttendancePage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/advances"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <AdvancesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/payroll/allowance-types"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <AllowanceTypesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/payroll/deduction-types"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <DeductionTypesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />   

      <Route
        path="/settings/payroll/advance-types"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <AdvanceTypesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/company"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <CompanyInformationPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/company/employment-types"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <EmploymentTypesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/payroll/leave-types"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <LeaveTypesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/payroll/loan-types"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <LoanTypesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <DepartmentsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ReportsPage />
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