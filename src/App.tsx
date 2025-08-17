import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ApiTest } from "./components/ApiTest";
import { AppLayout } from "./components/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Modules } from "./pages/Modules";
import { System } from "./pages/System";
import { theme } from "./theme";

const BASENAME = "/charlottes-magic-mirror";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={BASENAME}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="modules" element={<Modules />} />
            <Route path="system" element={<System />} />
            <Route path="test" element={<ApiTest />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
