import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedLevels, setCompletedLevels] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    if (!token) return;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("/api/auth/me-visual", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
                const levelsRes = await axios.get("/api/games/completed-levels-global", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCompletedLevels(levelsRes.data.completedLevels);
                const pointsRes = await axios.get("/api/games/total-global-score", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalPoints(pointsRes.data.totalGlobalScore);
            } catch (err) {
                console.error("Error loading profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Cargando perfil...</p>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="flex-grow px-6 pt-8 max-w-6xl mx-auto w-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-foreground">
                        Mi Perfil
                    </h1>

                    <Button onClick={() => navigate("/profile/edit")}>
                        Editar perfil
                    </Button>
                </div>

                {/* Profile card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-28 h-28 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
                        {user.name?.charAt(0)}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold">{user.name}</h2>

                        <div className="flex flex-wrap gap-3 mt-3 mb-3 justify-center md:justify-start">
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                                Edad: {new Date().getFullYear() - user.birthdate} años
                            </span>
                            {/* <span className="px-3 py-1 rounded-full bg-gray-200 text-sm">
                                Nivel {user.level}
                            </span> */}
                        </div>

                        <Button onClick={() => navigate("/profile/achievements")}>
                            Ver mis logros
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatBox title="Niveles completados" value={completedLevels} />
                    <StatBox title="Puntos conseguidos" value={totalPoints} />
                    <StatBox title="Tiempo jugado" value={"32min"} />
                </div>
            </div>
        </div>
    );
}

function StatBox({ title, value }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-sm font-bold mb-1">{title}</p>
            <p className="text-3xl font-bold text-primary">{value}</p>
        </div>
    );
}