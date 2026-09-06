import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { AppRouter } from "./routes/AppRouter";
import { ThemeProvider } from "./context/ThemeProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppRouter />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;