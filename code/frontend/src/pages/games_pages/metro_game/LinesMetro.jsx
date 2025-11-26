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
    const [showHelp, setShowHelp] = useState(false);
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

    // Check if the selected stations are possible
    const handleStationClick = (stationId) => {
        if (selectedStations.includes(stationId)) return;
        if (!isContiguous(stationId)) {
            alert("Debes seleccionar una estación contigua a la anterior.");
            return;
        }
        setSelectedStations([...selectedStations, stationId]);
    };

    // Check if the selected stations match the task sequence
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

    // Help button handler
    const handleHelp = async () => {
        const confirmUse = window.confirm("¿Seguro que quieres usar la ayuda? Se restará 1 punto al resultado.");
        if (!confirmUse) return;

        try {
            const token = localStorage.getItem("token");
            await axios.post(`/api/games/help/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setShowHelp(true);
        } catch (err) {
            console.error("Error updating help usage:", err);
            alert("Error al registrar la ayuda.");
        }
    };


    return (
        <div className="min-h-screen flex flex-col relative">
            <Header />

            {/* Help button */}
            <div className="mt-4 flex justify-end">
                <Button onClick={handleHelp} className="text-lg font-semibold mr-4"> Ayuda</Button>
            </div>

            <div className="flex-grow flex flex-col items-center px-4">
                <h2 className="text-2xl font-extrabold text-primary text-center mb-2 drop-shadow-md"> Selecciona, una a una, las paradas por las que deberá pasar. </h2>
                {showHelp && task && (
                    <h3 className="font-bold text-primary mb-2">Ayuda: {task.clue}</h3>
                )}

                {/* Metro map */}
                <div className="rounded-xl shadow-lg p-6 flex justify-center items-center">
                    <svg width="900" height="600" style={{ border: "1px solid #ccc" }}>
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