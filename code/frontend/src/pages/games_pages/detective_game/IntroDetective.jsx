import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import CharacterSpeech from "../CharacterSpeech";

export default function IntroDetective() {
    const { id } = useParams();
    const [levelData, setLevelData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const response = await axios.get(`/api/detective/info-level/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                const levelData = response.data;
                setLevelData(levelData);
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
            <div
                className="flex-grow"
                onClick={() => navigate(`/emotions/${id}/situation`)}
            >
                <CharacterSpeech
                    text={
                        levelNumber <= 3
                            ? "Tengo un amigo que está en la situación del siguiente chat."
                            : "Imagina la siguiente situación y describe cómo te sentirías."
                    }
                    image="/imgs/avatar_monkey.png"
                    showAvatar={levelNumber <= 3}
                />
            </div>
        </div>
    );
}