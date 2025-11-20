import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import CharacterSpeech from "../CharacterSpeech";

export default function GreenSemaphore() {
    const { id } = useParams();
    const [levelData, setLevelData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    if (!token) return;

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
                const response = await axios.post(
                    `/api/semaphore/save-score/${id}`,
                    { id }, 
                    { headers: { Authorization: `Bearer ${token}` } } 
                );
                setLevelData(response.data);
            } catch (err) {
                console.error("Error fetching task:", err);
            }
        };
        fetchLevelData();
    }, [id]);

    if (!levelData) return <p className="text-center">Cargando misión...</p>;
    const levelNumber = levelData.level_number;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center pt-8 px-4" onClick={() => navigate(`/games`)}>
                <h2 className="text-2xl font-extrabold text-center mb-3 drop-shadow-md text-green-600">
                    ¡Actúa!
                </h2>
                <h2 className="text-2xl font-extrabold text-center mb-1 drop-shadow-md text-green-600">
                    ¿Cuáles serán los resultados de tus acciones?
                </h2>
                <img src="/imgs/semaphore_green.png" alt="green" className="mx-auto my-6 max-h-[200px]" />

                <CharacterSpeech
                    text={levelData?.level_number <= 3 ? (
                        <>
                            ¡Muchas gracias por tu ayuda!
                            <br />
                            {levelData?.totalScore === 3 ? (
                                <>Hemos conseguido identificar las emociones del usuario y actuar de la manera adecuada.</>
                            ) : (
                                <>Me da la sensación de que no lo hemos hecho de la mejor manera...</>
                            )}
                            <br />
                            Te entrego esto como agradecimiento:
                            <br />
                            {/* Stars */}
                            {[1, 2, 3].map((n) => (
                                <span key={n} style={{ color: n <= (levelData?.totalScore || 0) ? "gold" : "lightgray", fontSize: "1.5rem", marginRight: "4px" }}>★</span>
                            ))}
                        </>
                    ) : (
                        <>
                            Gracias por completar el nivel.
                            <br />
                            Has obtenido {levelData?.totalScore} puntos en esta misión y el máximo era 3.
                        </>
                    )}
                    image="/imgs/avatar_cat.png" showAvatar={levelNumber <= 3}
                />

                {/* Distractors */}
                <div className="absolute left-3/4 -translate-x-1/2 animate-floatUp" style={{ bottom: "-10%", animationDuration: "10s" }}>
                    <img src="/imgs/distractor_bubble.png" alt="burbuja" className="w-40 h-40 drop-shadow-lg opacity-90" />
                </div>
                <div className="absolute left-1/4 -translate-x-1/2 animate-floatUp" style={{ bottom: "-10%", animationDuration: "15s" }}>
                    <img src="/imgs/distractor_bubble.png" alt="burbuja" className="w-40 h-40 drop-shadow-lg opacity-90" />
                </div>
            </div>
        </div>
    );
}