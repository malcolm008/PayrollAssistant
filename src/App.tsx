import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { AppRouter } from "./routes/AppRouter";
import { ThemeProvider } from "./context/ThemeProvider";
import { AdvanceProvider } from "./context/AdvanceProvider";
import { AllowanceTypeProvider } from "./context/AllowanceTypeProvider";
import { DeductionTypeProvider } from "./context/DeductionTypeProvider";
import { CompanyProvider } from "./context/CompanyProvider";
import { JobTitleProvider } from "./context/JobTitleProvider";
import { DepartmentProvider } from "./context/DepartmentProvider";
import { EmploymentTypeProvider } from "./context/EmploymentTypeProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AllowanceTypeProvider>
            <DeductionTypeProvider>
              <AdvanceProvider>
                <CompanyProvider>
                  <JobTitleProvider>
                    <DepartmentProvider>
                      <EmploymentTypeProvider>
                        <AppRouter />
                      </EmploymentTypeProvider>
                    </DepartmentProvider>
                  </JobTitleProvider>
                </CompanyProvider>
              </AdvanceProvider>
            </DeductionTypeProvider>
          </AllowanceTypeProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;