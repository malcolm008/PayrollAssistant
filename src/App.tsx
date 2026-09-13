import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { AppRouter } from "./routes/AppRouter";
import { ThemeProvider } from "./context/ThemeProvider";
import { AdvanceProvider } from "./context/AdvanceProvider";
import { AllowanceTypeProvider } from "./context/AllowanceTypeProvider";
import { DeductionTypeProvider } from "./context/DedectionTypeProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AllowanceTypeProvider>
            <DeductionTypeProvider>
              <AdvanceProvider>
                <AppRouter />
              </AdvanceProvider>
            </DeductionTypeProvider>
          </AllowanceTypeProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;