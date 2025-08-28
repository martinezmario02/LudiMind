import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/ui/Header.jsx";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card.jsx";

export default function GamesPage() {
  const [newGames, setNewGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewGames = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/games/new-games", {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        
        setNewGames(response.data);     
      } catch (err) {
        console.error("Error completo:", err);
        setError("No se pudieron cargar los juegos");
      }
    };
    fetchNewGames();
  }, []);

  return (
    <div>
      <Header />
      <main className="p-4">
        {error && <p className="text-red-500">{error}</p>}
        {/* New games */}
        <h1 className="text-2xl font-bold mb-4">Nuevos juegos</h1>
        <div className="flex space-x-3 overflow-x-auto py-2">
          {newGames.map((game) => (
            <Card key={game.id} className="hover:shadow-lg transition-shadow min-w-[300px] max-w-[320px] flex-shrink-0">
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
      </main>
    </div>
  );
}