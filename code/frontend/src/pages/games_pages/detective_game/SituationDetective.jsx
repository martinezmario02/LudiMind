import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import Message from "../../auditory_distractions/Message";

export default function SituationDetective() {
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
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow" onClick={() => navigate(`/emotions/${id}/choose`)}>
                <img src={levelData.image_url} alt="situation" className="mx-auto my-6 max-h-[800px]"  />
            </div>

            {/* Distractors */}
            <Message silence={3000} volume={0.6} />
        </div>
    );
}