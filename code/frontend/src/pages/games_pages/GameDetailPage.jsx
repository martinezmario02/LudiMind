import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/ui/Header.jsx";

const categoryTranslations = {
  memory: "Memoria",
  organization: "Organización",
  emotions: "Autorregulación emocional",
  selfcontrol: "Resolución de conflictos"
};

export default function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [completedLevels, setCompletedLevels] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const token = localStorage.getItem("token");
        // Set game information
        const response = await axios.get(`/api/games/info-game/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGame(response.data);
        // Set completed levels
        const levelsResponse = await axios.get(`/api/games/completed-levels/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompletedLevels(levelsResponse.data.completedLevels);
        // Set total score
        const scoreResponse = await axios.get(`/api/games/total-score/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalScore(scoreResponse.data.totalScore);
      } catch (err) {
        setError("No se pudo cargar el juego");
      }
    };
    fetchGame();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!game) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="w-full max-w-3xl min-w-[400px] mx-auto my-8 shadow-lg rounded-xl overflow-hidden bg-white">
        {/* Image */}
        <div className="w-full h-32 md:h-40 overflow-hidden">
          {game.image_url && (
            <img src={game.image_url} alt={game.name} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Main Section */}
        <div className="bg-gray-100 w-full py-6 px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {game.name}
          </h1>
          <p className="text-md text-gray-600">
            Categoría: <span className="font-semibold">{categoryTranslations[game.category]}</span>
          </p>
        </div>

        {/* Description Section */}
        <div className="w-full py-6 px-6">
          <h2 className="text-lg font-semibold text-primary mb-3">
            {game.slogan}
          </h2>
          <p className="text-gray-700 leading-relaxed">{game.description}</p>
        </div>

        {/* Progress Section */}
        <div className="w-full grid grid-cols-2 divide-x divide-gray-200 text-center bg-gray-50 py-6 px-6">
          <div>
            <p className="font-bold text-gray-800">Niveles completados</p>
            <p className="text-2xl text-primary font-semibold mt-2">{completedLevels ?? 0}</p>
          </div>
          <div>
            <p className="font-bold text-gray-800">Puntos conseguidos</p>
            <p className="text-2xl text-primary font-semibold mt-2">{totalScore ?? 0}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4 px-6 py-6 bg-white">
          <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition">
            Tutorial
          </button>
          <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition"
            onClick={() => navigate(`/games/${game.id}/levels`)}>
            Jugar
          </button>
        </div>
      </div>
    </div>
  );
}
