import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/ui/Header.jsx";
import { Star } from "lucide-react";

const categoryTranslations = {
  memory: "Memoria",
  organization: "Organización",
  emotions: "Autorregulación emocional",
  selfcontrol: "Resolución de conflictos"
};

export default function LevelsPage() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [levels, setLevels] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const token = localStorage.getItem("token");
                // Set game information
                const response = await axios.get(`/api/games/info-game/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
                });
                setGame(response.data);
                // Set levels
                const levelsResponse = await axios.get(`/api/games/levels/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLevels(levelsResponse.data);
            } catch (err) {
                setError("No se pudieron cargar los niveles");
            }
        };
        fetchLevels();
    }, [id]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!game) return <p className="text-gray-500">Cargando...</p>;

    return (
        <div className="min-h-screen flex flex-col">
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
                {/* Levels Section */}
                <div className="w-full py-6 px-6">
                    <h2 className="text-lg font-semibold text-primary mb-3">Niveles disponibles</h2>
                    {levels.length === 0 && <p className="text-gray-500">No hay niveles disponibles para este juego.</p>}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {levels.map((level) => (
                            <div key={level.id} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center"
                                onClick={() => navigate(`/${game.category}/${level.id}`)}>
                                <h2 className="font-bold mb-2">Nivel {level.level_number}</h2>
                                <div className="flex justify-center space-x-1">
                                    {[1, 2, 3].map((i) => (
                                        <Star key={i} className={`w-5 h-5 ${level.score >= i ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}