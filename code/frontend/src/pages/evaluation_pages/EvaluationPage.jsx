import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "../../components/ui/Card";
import { Star } from "lucide-react";

const categoryTranslations = {
    memory: "Memoria",
    organization: "Organización",
    emotions: "Autorregulación emocional",
    selfcontrol: "Resolución de conflictos"
};

export default function EvaluationPage() {
    const [games, setGames] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");
    if (!token) return;

    useEffect(() => {
        const fetchEvaluation = async () => {
            try {
                // Get games
                const allGames = await axios.get("/api/games/all-games");
                setGames(allGames.data);

                // Get skills
                const skillsMap = {};

                allGames.data.forEach(game => {
                    const category = game.category;
                    if (!skillsMap[category]) {
                        skillsMap[category] = {
                            name: categoryTranslations[category] || category,
                            category,
                            points: 0,
                            maxPoints: 15,
                            successRate: 0,
                            gameIds: []
                        };
                    }
                    skillsMap[category].gameIds.push(game.id);
                });

                // Calculate success rates and points
                for (const category of Object.keys(skillsMap)) {
                    for (const gameId of skillsMap[category].gameIds) {
                        try {
                            const scoreResponse = await axios.get(`/api/games/total-score/${gameId}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            skillsMap[category].points += scoreResponse.data.totalScore || 0;
                            skillsMap[category].successRate = Math.round(skillsMap[category].points*100/skillsMap[category].maxPoints * 100) / 100;
                        } catch (scoreErr) {
                            console.error(`Error getting score for game ${gameId}:`, scoreErr);
                        }
                    }
                }
                setSkills(Object.values(skillsMap));
            } catch (err) {
                console.error("Error completo:", err);
                setError("No se pudieron cargar los juegos");
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluation();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Cargando evaluación...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="flex-grow max-w-6xl mx-auto w-full px-6 pt-8">
                <h1 className="text-4xl font-extrabold mb-6">Evaluación</h1>
                <div className="flex border rounded-lg overflow-hidden mb-8">
                    <Button className="flex-1">Habilidades</Button>
                    <Button className="flex-1" variant="secondary">
                        Historial de intentos
                    </Button>
                </div>

                <div className="space-y-6">
                    {skills.map(skill => (
                        <Card key={skill.category}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{skill.name}</CardTitle>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">
                                            {skill.successRate}%
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Tasa de éxito
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="flex gap-1">
                                    {Array.from({ length: skill.maxPoints }).map((_, i) => (
                                        <Star key={i} className={`h-5 w-5 ${i < skill.points ? "fill-amber-400 text-amber-400" : "fill-amber-100 text-amber-100" }`}/>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}