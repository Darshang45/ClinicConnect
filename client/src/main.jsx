import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/theme.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AppointmentBookingProvider } from "./context/AppointmentBookingContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AppointmentBookingProvider>
          <App />
        </AppointmentBookingProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
