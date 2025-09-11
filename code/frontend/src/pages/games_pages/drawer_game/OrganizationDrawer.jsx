import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";

export default function OrganizationDrawer() {
    const { id } = useParams(); // level_id
    const [drawers, setDrawers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrawers = async () => {
            try {
                const response = await axios.get(`/api/drawer/drawers-info/${id}`);
                setDrawers(response.data);
            } catch (err) {
                console.error("Error fetching drawers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDrawers();
    }, [id]);

    if (loading) return <p className="text-center mt-10">Cargando desván mágico...</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center pt-8 px-4">
                <h1 className="text-4xl font-extrabold text-primary text-center mb-8 drop-shadow-md">Mi Desván Mágico</h1>

                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    {drawers.map((drawer) => (
                        <div key={drawer.id} className="bg-[url('/imgs/wood_texture.jpg')] bg-cover bg-center rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center h-64 w-64 hover:scale-105 transform transition">
                            <h2 className="text-xl font-bold mb-2 text-white">{drawer.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
