import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import CharacterSpeech from "../CharacterSpeech";

export default function RedRetroSemaphore() {
    const { id } = useParams();
    const [levelData, setLevelData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const response = await axios.get(`/api/semaphore/result-feeling/${id}`, { headers: { Authorization: `Bearer ${token}` } });
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
            <div className="flex-grow" onClick={() => navigate(`/selfcontrol/${id}/yellow`)}>
                <CharacterSpeech
                    text={levelData.support_phrase}
                    image="/imgs/avatar_cat.png"
                    showAvatar={levelNumber <= 3}
                />

                {/* Distractors */}
                <div className="absolute left-1/4 -translate-x-1/2 animate-floatUp" style={{ bottom: "-10%", animationDuration: "15s" }}>
                    <img src="/imgs/distractor_bubble.png" alt="burbuja" className="w-40 h-40 drop-shadow-lg opacity-90" />
                </div>
            </div>
        </div>
    );
}