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
import { LeaveTypeProvider } from "./context/LeaveTypeProvider";
import { LoanTypeProvider } from "./context/LoanTypeProvider";
import { BankProvider } from "./context/BankProvider";
import { GLAccountProvider } from "./context/GLAccountProvider";
import { CostCenterProvider } from "./context/CostCenterProvider";
import { AccountAllocationProvider } from "./context/AccountAllocationProvider";
import { PaymentMethodProvider } from "./context/PaymentMethodProvider";
import { EmployeeProvider } from "./context/EmployeeProvider";

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
                        <LeaveTypeProvider>
                          <LoanTypeProvider>
                            <PaymentMethodProvider>
                              <BankProvider>
                                <GLAccountProvider>
                                  <CostCenterProvider>
                                    <AccountAllocationProvider>
                                      <BankProvider>
                                        <EmployeeProvider>
                                          <AppRouter />
                                        </EmployeeProvider>
                                      </BankProvider>
                                    </AccountAllocationProvider>
                                  </CostCenterProvider>                                
                                </GLAccountProvider>                  
                              </BankProvider>
                            </PaymentMethodProvider>
                          </LoanTypeProvider>
                        </LeaveTypeProvider>
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