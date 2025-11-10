import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import Button from "../../../components/ui/Button";

export default function MetroMap() {
    const [lines, setLines] = useState([]);
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [selectedStations, setSelectedStations] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLines = async () => {
            try {
                const res = await axios.get(`/api/metro/lines-stations?levelId=${id}`);
                setLines(res.data);

                const response = await axios.get(`/api/metro/tasks/${id}`);
                setTask(response.data);
            } catch (err) {
                console.error("Error fetching metro lines:", err);
            }
        };
        fetchLines();
    }, []);

    if (lines.length === 0) return <p className="text-center mt-10">Cargando mapa...</p>;

    // Check if the new station is contiguous to the last selected station
    const isContiguous = (stationId) => {
        if (selectedStations.length === 0) return true;

        const lastStationId = selectedStations[selectedStations.length - 1];
        for (const line of lines) {
            const idx = line.stations.findIndex((s) => s.id === lastStationId);
            if (idx !== -1) {
                const prev = line.stations[idx - 1]?.id;
                const next = line.stations[idx + 1]?.id;
                if (stationId === prev || stationId === next) return true;
            }
        }
        return false;
    };

    const handleStationClick = (stationId) => {
        if (selectedStations.includes(stationId)) return;
        if (!isContiguous(stationId)) {
            alert("Debes seleccionar una estación contigua a la anterior.");
            return;
        }
        setSelectedStations([...selectedStations, stationId]);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            const res = await axios.post(
                `/api/metro/tasks/${id}/check`,
                {
                    sequence: selectedStations,
                    game_id: "f4512460-eb79-4449-a145-c910c2d41da9",
                    attempt: newAttempts
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );


            if (!res.data.isCorrect) alert(`❌ Incorrecto: Te quedan ${3 - newAttempts} intentos`);
            setSelectedStations([]);
            if (res.data.finished) navigate("/memory/" + id + "/retrospective");
        } catch (err) {
            console.error("Error submitting sequence:", err);
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center pt-8 px-4">
                <h2 className="text-2xl font-extrabold text-center mb-8 drop-shadow-md"> Selecciona, una a una, las paradas por las que deberá pasar. </h2>

                {/* Metro map */}
                <div className="rounded-xl shadow-lg p-6 flex justify-center items-center">
                    <svg width="800" height="600" style={{ border: "1px solid #ccc" }}>
                        {/* Show lines */}
                        {lines.map((line) => (
                            <polyline key={line.id} points={line.stations.map((s) => `${s.x * 150 + 50},${s.y * 150 + 50}`).join(" ")}
                                stroke={line.color} strokeWidth="8" fill="none" strokeLinecap="round" />
                        ))}

                        {/* Show stations */}
                        {lines.flatMap((line) =>
                            line.stations.map((station) => {
                                const cx = station.x * 150 + 50;
                                const cy = station.y * 150 + 50;
                                const paddingX = 24;
                                const paddingY = 20;
                                const textWidth = Math.max(station.name.length * 8, 24);
                                const rectWidth = paddingX * 2 + textWidth;
                                const rectHeight = paddingY * 2 + 24;
                                const isSelected = selectedStations.includes(station.id);

                                return (
                                    <g key={station.id} onClick={() => handleStationClick(station.id)} style={{ cursor: "pointer" }}>
                                        <rect x={cx - rectWidth / 2} y={cy - rectHeight / 2} width={rectWidth} height={rectHeight}
                                            rx={12} ry={12} fill={isSelected ? "#00ff99" : station.is_transfer ? "#eeeeeeff" : "#fff"}
                                            stroke={line.color} strokeWidth={station.is_transfer ? 4 : 3} />
                                        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="26"> {station.emoji} </text>
                                        <text x={cx} y={cy + 20} textAnchor="middle" fontSize="20" fill="#333"> {station.name} </text>
                                    </g>
                                );
                            })
                        )}
                    </svg>
                </div>
                <div className="mt-8">
                    <Button className="px-6 py-3 text-lg font-semibold" onClick={handleSubmit}>Comprobar</Button>
                </div>

                {/* Distractors */}
                <div className="absolute left-3/4 -translate-x-1/2 animate-floatUp" style={{ bottom: "-10%", animationDuration: "15s" }}>
                    <img src="/imgs/distractor_globe.png" alt="globo" className="w-40 h-40 drop-shadow-lg opacity-90" />
                </div>
            </div>
        </div>
    );
}