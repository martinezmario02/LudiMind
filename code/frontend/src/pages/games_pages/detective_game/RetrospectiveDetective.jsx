import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import CharacterSpeech from "../CharacterSpeech";

export default function RetrospectiveDetective() {
    const { id } = useParams();
    const [levelData, setLevelData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const result = await axios.get(`/api/games/result/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                setLevelData(result.data);
            } catch (err) {
                console.error("Error fetching task:", err);
            }
        };
        fetchLevelData();
    }, [id]);

    if (!levelData) return <p className="text-center">Cargando misión...</p>;
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow" onClick={() => navigate(`/games`)}>
                <CharacterSpeech
                    text={levelData?.game_levels?.level_number <= 3 ? (
                        <>
                            ¡Lo tendré en cuenta!
                            <br />
                            {levelData?.score === 3 ? (
                                <>Estoy de acuerdo con todo lo que hemos discutido.</>
                            ) : (
                                <>Me da la sensación de que no hemos tomado las mejores decisiones...</>
                            )}
                            <br />
                            Te entrego esto como agradecimiento:
                            <br />
                            {/* Stars */}
                            {[1, 2, 3].map((n) => (
                                <span key={n} style={{ color: n <= (levelData?.score || 0) ? "gold" : "lightgray", fontSize: "1.5rem", marginRight: "4px" }}>★</span>
                            ))}
                        </>
                    ) : (
                        <>
                            Gracias por completar el nivel.
                            <br />
                            Has obtenido {levelData?.score} puntos en esta misión y el máximo era 3.
                        </>
                    )}
                    image="/imgs/avatar_monkey.png" showAvatar={levelData?.game_levels?.level_number <= 3} />
            </div>
        </div>
    );
}