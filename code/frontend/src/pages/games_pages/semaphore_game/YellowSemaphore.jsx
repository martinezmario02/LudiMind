import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";

export default function YellowSemaphore() {
    const { id } = useParams();
    const [levelData, setLevelData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    if (!token) return;

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
                const response = await axios.get(`/api/semaphore/actions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setLevelData(response.data);
            } catch (err) {
                console.error("Error fetching task:", err);
            }
        };
        fetchLevelData();
    }, [id]);

    const handleSelectAction = async (action) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.post(
                "/api/semaphore/check-action",
                {
                    level_id: id,
                    scenario_id: levelData.id,
                    chosen_action_id: action.id,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/selfcontrol/${id}/yellow-retrospective`);
        } catch (err) {
            console.error("Error checking action:", err);
        }
    };

    if (!levelData) return <p className="text-center">Cargando misión...</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center pt-8 px-4">
                <h2 className="text-2xl font-extrabold text-center mb-3 drop-shadow-md text-yellow-600">
                    Piensa...
                </h2>
                <h2 className="text-2xl font-extrabold text-center mb-1 drop-shadow-md text-yellow-600">
                    ¿Qué opciones tienes?
                </h2>
                <img src="/imgs/semaphore_yellow.png" alt="yellow" className="mx-auto my-6 max-h-[200px]" />

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
                    {levelData.actions?.map((action) => (
                        <button
                            key={action.id}
                            className="bg-white border-2 border-yellow-400 text-yellow-600 font-semibold text-xl py-6 rounded-2xl shadow-md hover:bg-yellow-100 transition"
                            onClick={() => handleSelectAction(action)}
                        >
                            {action.text}
                        </button>
                    ))}
                </div>

                {/* Distractors */}
                <div className="absolute left-1/4 -translate-x-1/2 animate-floatUp" style={{ bottom: "-10%", animationDuration: "15s" }}>
                    <img src="/imgs/distractor_bubble.png" alt="burbuja" className="w-40 h-40 drop-shadow-lg opacity-90" />
                </div>
                <div className="absolute left-3/4 -translate-x-1/2 animate-floatUp" style={{ bottom: "-10%", animationDuration: "10s" }}>
                    <img src="/imgs/distractor_bubble.png" alt="burbuja" className="w-40 h-40 drop-shadow-lg opacity-90" />
                </div>
            </div>
        </div>
    );
}