import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";

export default function RedSemaphore() {
    const { id } = useParams();
    const [levelData, setLevelData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    if (!token) return;

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
                const response = await axios.get(`/api/semaphore/feelings/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setLevelData(response.data);
            } catch (err) {
                console.error("Error fetching task:", err);
            }
        };
        fetchLevelData();
    }, [id]);

    const handleSelectFeeling = async (feeling) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.post(
                "/api/semaphore/check-feeling",
                {
                    level_id: id,
                    scenario_id: levelData.id,
                    chosen_feeling_id: feeling.id,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/selfcontrol/${id}/red-retrospective`);
        } catch (err) {
            console.error("Error checking feeling:", err);
        }
    };

    if (!levelData) return <p className="text-center">Cargando misión...</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center pt-8 px-4">
                <h2 className="text-2xl font-extrabold text-center mb-3 drop-shadow-md text-red-600">
                    ¡ALTO!
                </h2>
                <h2 className="text-2xl font-extrabold text-center mb-1 drop-shadow-md text-red-600">
                    ¿Qué sientes?
                </h2>
                <img src="/imgs/semaphore_red.png" alt="red" className="mx-auto my-6 max-h-[200px]" />

                {/* Feeling buttons */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
                    {levelData.feelings?.map((feeling) => (
                        <button
                            key={feeling.id}
                            className="bg-white border-2 border-red-400 text-red-600 font-semibold py-3 rounded-2xl shadow-md hover:bg-red-100 transition"
                            onClick={() => handleSelectFeeling(feeling)}
                        >
                            {feeling.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}