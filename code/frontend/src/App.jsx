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
import ChooseDetective from "./pages/games_pages/detective_game/ChooseDetective";
import ButtonsDetective from "./pages/games_pages/detective_game/ButtonsDetective";
import RetrospectiveDetective from "./pages/games_pages/detective_game/RetrospectiveDetective";
import IntroSemaphore from "./pages/games_pages/semaphore_game/IntroSemaphore";
import RedSemaphore from "./pages/games_pages/semaphore_game/RedSemaphore";
import RedRetroSemaphore from "./pages/games_pages/semaphore_game/RedRetroSemaphore";
import YellowSemaphore from "./pages/games_pages/semaphore_game/YellowSemaphore";
import YellowRetroSemaphore from "./pages/games_pages/semaphore_game/YellowRetroSemaphore";
import GreenSemaphore from "./pages/games_pages/semaphore_game/GreenSemaphore";
import ProfilePage from "./pages/profile_pages/ProfilePage";
import EvaluationPage from "./pages/evaluation_pages/EvaluationPage";
import ProfileEditPage from "./pages/profile_pages/ProfileEditPage";

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
          <Route path="/emotions/:id/choose" element={<ChooseDetective />} />
          <Route path="/emotions/:id/buttons" element={<ButtonsDetective />} />
          <Route path="/emotions/:id/retrospective" element={<RetrospectiveDetective />} />

          <Route path="/selfcontrol/:id" element={<IntroSemaphore />} />
          <Route path="/selfcontrol/:id/red" element={<RedSemaphore />} />
          <Route path="/selfcontrol/:id/red-retrospective" element={<RedRetroSemaphore />} />
          <Route path="/selfcontrol/:id/yellow" element={<YellowSemaphore />} />
          <Route path="/selfcontrol/:id/yellow-retrospective" element={<YellowRetroSemaphore />} />
          <Route path="/selfcontrol/:id/green" element={<GreenSemaphore />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/evaluation" element={<EvaluationPage />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}