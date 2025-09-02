import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/ui/Header.jsx";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card.jsx";

export default function GamesPage() {
  const [newGames, setNewGames] = useState([]);
  const [usedGames, setUsedGames] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("token");
        const newGames = await axios.get("/api/games/new-games", {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        setNewGames(newGames.data);

        const usedGames = await axios.get("/api/games/used-games", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsedGames(usedGames.data);
      } catch (err) {
        console.error("Error completo:", err);
        setError("No se pudieron cargar los juegos");
      }
    };
    fetchGames();
  }, []);

  return (
    <div>
      <Header />
      <main className="p-4">
        {error && <p className="text-red-500">{error}</p>}

        {/* Used games */}
        <div className="m-6">
          <h1 className="text-2xl font-bold mb-4 mt-4">Continuar jugando</h1>
          {usedGames.length === 0 ? (
            <p className="text-gray-500">No has jugado ningún juego todavía</p>
          ) : (
            <div className="flex space-x-3 overflow-x-auto py-2">
              {usedGames.map((game) => (
                <Card key={game.id} className="hover:shadow-lg transition-shadow min-w-[300px] max-w-[320px] flex-shrink-0"
                  onClick={() => navigate(`/games/${game.id}`)}>
                  <CardHeader>
                    <CardTitle className="text-primary font-sans">{game.name}</CardTitle>
                    <CardDescription>{game.slogan}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-24 bg-accent/20 rounded-lg mb-2 flex items-center justify-center">
                      {game.image_url && (
                        <img src={game.image_url} alt={game.name} className="w-full h-24 object-cover rounded-md"/>
                      )}
                    </div>
                    <CardDescription>{game.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* New games */}
        <div className="m-6">
          <h1 className="text-2xl font-bold mb-4 mt-4">Descubrir nuevos juegos</h1>
          {newGames.length === 0 ? (
            <p className="text-gray-500">No hay juegos nuevos disponibles</p>
          ) : (
            <div className="flex space-x-3 overflow-x-auto py-2">
              {newGames.map((game) => (
                <Card key={game.id} className="hover:shadow-lg transition-shadow min-w-[300px] max-w-[320px] flex-shrink-0"
                  onClick={() => navigate(`/games/${game.id}`)}>
                  <CardHeader>
                    <CardTitle className="text-primary font-sans">{game.name}</CardTitle>
                    <CardDescription>{game.slogan}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-24 bg-accent/20 rounded-lg mb-2 flex items-center justify-center">
                      {game.image_url && (
                        <img src={game.image_url} alt={game.name} className="w-full h-24 object-cover rounded-md"/>
                      )}
                    </div>
                    <CardDescription>{game.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}