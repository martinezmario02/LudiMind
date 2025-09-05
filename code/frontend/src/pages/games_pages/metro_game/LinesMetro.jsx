import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";

export default function MetroMap() {
    const [lines, setLines] = useState([]);
    const { id } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchLines = async () => {
            try {
                const res = await axios.get("/api/metro/lines-stations");
                setLines(res.data);
                const response = await axios.get(`/api/metro/tasks/${id}`);
                const taskData = response.data;
                setTask(taskData);
            } catch (err) {
                console.error("Error fetching metro lines:", err);
            }
        };
        fetchLines();
    }, []);

    if (lines.length === 0) return <p className="text-center mt-10">Cargando mapa...</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center pt-8 px-4">
                <h2 className="text-4xl font-extrabold text-primary text-center mb-8 drop-shadow-md"> "{task?.clue}"" </h2>

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
                                const paddingX = 12;
                                const paddingY = 12;
                                const textWidth = Math.max(station.name.length * 8, 24);
                                const rectWidth = paddingX * 2 + textWidth;
                                const rectHeight = paddingY * 2 + 24;

                                return (
                                    <g key={station.id} onClick={() => alert(`Has clicado en ${station.name}`)} style={{ cursor: "pointer" }}>
                                        <rect x={cx - rectWidth / 2} y={cy - rectHeight / 2} width={rectWidth} height={rectHeight}
                                            rx={12} ry={12} fill={station.is_transfer ? "#FFD700" : "#fff"}
                                            stroke={line.color} strokeWidth={station.is_transfer ? 4 : 3} />
                                        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18"> {station.emoji} </text>
                                        <text x={cx} y={cy + 15} textAnchor="middle" fontSize="14" fill="#333"> {station.name} </text>
                                    </g>
                                );
                            })
                        )}
                    </svg>
                </div>
            </div>
        </div>
    );
}