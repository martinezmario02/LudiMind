import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import CharacterSpeech from "../CharacterSpeech";

const categoryLevel = {
  utility: "utilidad",
  type: "tipo",
  size: "tamaño"
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
                const response = await axios.get(`/api/drawer/info-level/${id}`);
                const levelData = response.data;
                setLevelData(levelData);
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
            <div className="flex-grow" onClick={() => navigate(`/organization/${id}/level`)}>
                <CharacterSpeech text={`Necesito organizar mi desván mágico en función de su ${categoryLevel[levelData[0].category]}. ¿Podrías ayudarme?`} image="/imgs/avatar_goat.png" />
            </div>
        </div>
    );
}