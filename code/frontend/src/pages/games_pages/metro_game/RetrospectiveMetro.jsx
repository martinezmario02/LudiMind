import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import CharacterSpeech from "../CharacterSpeech";

export default function RetrospectiveMetro() {
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
                    text={
                    <>
                        ¡Muchas gracias por tu ayuda!
                        <br />
                        {levelData?.score === 0 ? (
                            <>No hemos conseguido llegar al destino, la próxima vez será...</>
                        ) : (
                            <>
                                He conseguido llegar a mi destino.
                                <br />
                                Te entrego esto como agradecimiento:
                                <br />
                                {/* Stars */}
                                {[1, 2, 3].map((n) => (
                                    <span key={n} style={{ color: n <= (levelData?.score || 0) ? "gold" : "lightgray", fontSize: "1.5rem", marginRight: "4px" }}>★</span>
                                ))}
                            </>
                        )}
                    </>
                    } image="/imgs/avatar_panda.png"/>
            </div>
        </div>
    );
}