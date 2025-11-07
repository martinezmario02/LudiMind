import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import CharacterSpeech from "../CharacterSpeech";

export default function IntroSemaphore() {
    const { id } = useParams();
    const [levelData, setLevelData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const response = await axios.get(`/api/semaphore/info-level/${id}`, { headers: { Authorization: `Bearer ${token}` } });
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
            <div className="flex-grow" onClick={() => navigate(`/selfcontrol/${id}/red`)}>
                <CharacterSpeech
                    text={levelData.text}
                    image="/imgs/avatar_cat.png"
                    showAvatar={levelNumber <= 3}
                />
            </div>
        </div>
    );
}