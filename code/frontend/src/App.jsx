import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LandingPage from "./pages/main_pages/LandingPage";
import LoginPage from "./pages/main_pages/LoginPage";
import RegisterPage from "./pages/main_pages/RegisterPage";
import ResetPasswordPage from "./pages/main_pages/ResetPasswordPage";
import SetPasswordPage from "./pages/main_pages/SetPasswordPage";
import GamesPage from "./pages/games_pages/GamesPage";
import GameDetailPage from "./pages/games_pages/GameDetailPage";
import GameLevelsPage from "./pages/games_pages/GameLevelsPage";
import IntroMetro from "./pages/games_pages/metro_game/IntroMetro";
import ClueMetro from "./pages/games_pages/metro_game/ClueMetro";
import LinesMetro from "./pages/games_pages/metro_game/LinesMetro";
import IntroDrawer from "./pages/games_pages/drawer_game/IntroDrawer";
import OrganizationDrawer from "./pages/games_pages/drawer_game/OrganizationDrawer";

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/set-password" element={<SetPasswordPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/games/:id/levels" element={<GameLevelsPage />} />
          <Route path="/memory/:id" element={<IntroMetro />} />
          <Route path="/memory/:id/clue" element={<ClueMetro />} />
          <Route path="/memory/:id/lines" element={<LinesMetro />} />
          <Route path="/organization/:id" element={<IntroDrawer />} />
          <Route path="/organization/:id/level" element={<OrganizationDrawer />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}