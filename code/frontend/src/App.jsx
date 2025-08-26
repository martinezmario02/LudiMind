import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/main_pages/LandingPage";
import LoginPage from "./pages/main_pages/LoginPage";
import RegisterPage from "./pages/main_pages/RegisterPage";
import ResetPasswordPage from "./pages/main_pages/ResetPasswordPage";
import SetPasswordPage from "./pages/main_pages/SetPasswordPage";
import GamesPage from "./pages/games_pages/GamesPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/games" element={<GamesPage />} />
      </Routes>
    </Router>
  );
}