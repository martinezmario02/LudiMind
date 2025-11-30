import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import CharacterSpeech from "../CharacterSpeech";

const categoryLevel = {
  utility: "utilidad",
  type: "tipo",
  size: "tamaño",
  season: "estación del año",
  hat: "tipo de sombrero",
  food: "tipo de comida"
};

export default function IntroDrawer() {
    const { id } = useParams();
    const [levelData, setLevelData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
            const token = localStorage.getItem("token");
            if (!token) return;
            await axios.post(`/api/drawer/reset-level/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            const response = await axios.get(`/api/drawer/info-level/${id}`, { headers: { Authorization: `Bearer ${token}` } });

            const mapped = response.data.map((item) => ({
                ...item,
                level_number: item.game_levels?.level_number ?? item.level_number,
                category: item.game_levels?.category ?? item.category,
            }));

            setLevelData(mapped);
            } catch (err) {
            console.error("Error fetching task:", err);
            }
        };
        fetchLevelData();
    }, [id]);

    if (!levelData || !levelData[0]?.category) return <p className="text-center">Cargando misión...</p>;

    const level = levelData[0];
    const categoryText = categoryLevel[level.category] || level.category;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow" onClick={() => navigate(`/organization/${id}/level`)}>
            <CharacterSpeech
                text={level.level_number <= 3
                ? `Necesito organizar mi desván mágico en función de su ${categoryText}. ¿Podrías ayudarme?`
                : level.level_number === 4
                ? `Debes organizar los objetos del desván en función de su ${categoryText}.`
                : "¡Cuidado! Este nivel es diferente al resto. Solamente deberás colocar los objetos que no sean de ninguno de los materiales indicados en el cajón 'Resto'. ¡El resto de objetos deberán quedarse sin organizar!"}
                image="/imgs/avatar_goat.png"
                showAvatar={level.level_number <= 3}
            />
            </div>
        </div>
    );

}