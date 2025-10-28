import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LandingPage from "./pages/main_pages/LandingPage";
import InfoPage from "./pages/main_pages/InfoPage";
import LoginPage from "./pages/main_pages/LoginPage";
import RegisterPage from "./pages/main_pages/RegisterPage";
import ResetPasswordPage from "./pages/main_pages/ResetPasswordPage";
import SetPasswordPage from "./pages/main_pages/SetPasswordPage";
import VisualLoginPage from "./pages/main_pages/VisualLoginPage.jsx";
import VisualRegisterPage from "./pages/main_pages/VisualRegisterPage.jsx";
import GamesPage from "./pages/games_pages/GamesPage";
import GameDetailPage from "./pages/games_pages/GameDetailPage";
import GameLevelsPage from "./pages/games_pages/GameLevelsPage";
import IntroMetro from "./pages/games_pages/metro_game/IntroMetro";
import ClueMetro from "./pages/games_pages/metro_game/ClueMetro";
import LinesMetro from "./pages/games_pages/metro_game/LinesMetro";
import RetrospectiveMetro from "./pages/games_pages/metro_game/RetrospectiveMetro";
import IntroDrawer from "./pages/games_pages/drawer_game/IntroDrawer";
import OrganizationDrawer from "./pages/games_pages/drawer_game/OrganizationDrawer";
import ContentDrawer from "./pages/games_pages/drawer_game/ContentDrawer";
import RetrospectiveDrawer from "./pages/games_pages/drawer_game/RetrospectiveDrawer";
import IntroDetective from "./pages/games_pages/detective_game/IntroDetective";
import SituationDetective from "./pages/games_pages/detective_game/SituationDetective";

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/set-password" element={<SetPasswordPage />} />
          <Route path="/visual-login" element={<VisualLoginPage />} />
          <Route path="/visual-register" element={<VisualRegisterPage />} />

          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/games/:id/levels" element={<GameLevelsPage />} />

          <Route path="/memory/:id" element={<IntroMetro />} />
          <Route path="/memory/:id/clue" element={<ClueMetro />} />
          <Route path="/memory/:id/lines" element={<LinesMetro />} />
          <Route path="/memory/:id/retrospective" element={<RetrospectiveMetro />} />

          <Route path="/organization/:id" element={<IntroDrawer />} />
          <Route path="/organization/:id/level" element={<OrganizationDrawer />} />
          <Route path="/organization/content/:id" element={<ContentDrawer />} />
          <Route path="/organization/:id/retrospective" element={<RetrospectiveDrawer />} />

          <Route path="/emotions/:id" element={<IntroDetective />} />
          <Route path="/emotions/:id/situation" element={<SituationDetective />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}