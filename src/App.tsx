import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { AppRouter } from "./routes/AppRouter";
import { ThemeProvider } from "./context/ThemeProvider";
import { AdvanceProvider } from "./context/AdvanceProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AdvanceProvider>
            <AppRouter />
          </AdvanceProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;