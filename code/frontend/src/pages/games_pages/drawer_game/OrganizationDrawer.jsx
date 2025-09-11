import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";

export default function OrganizationDrawer() {
    const { id } = useParams(); 
    const [drawers, setDrawers] = useState([]);
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                // Set drawers
                const response = await axios.get(`/api/drawer/drawers-info/${id}`);
                setDrawers(response.data);
                // Set objects
                const objectIds = response.data.flatMap(drawer => 
                    drawer.solutions?.flatMap(sol => sol.object_ids) || []
                );
                if (objectIds.length > 0) {
                    const { data: objectsData } = await axios.post(`/api/drawer/objects-info`, { ids: objectIds });
                    setObjects(objectsData);
                }
            } catch (err) {
                console.error("Error fetching drawers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, [id]);

    if (loading) return <p className="text-center mt-10">Cargando desván mágico...</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center pt-8 px-4">
                <h2 className="text-4xl font-extrabold text-primary text-center mb-8 drop-shadow-md">Mi Desván Mágico</h2>

            {/* Drawers */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center mb-8">
                {drawers.map((drawer) => (
                    <div
                        key={drawer.id}
                        className="bg-[url('/imgs/wood_texture.jpg')] bg-cover bg-center rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center h-64 w-64 hover:scale-105 transform transition"
                    >
                        <h2 className="text-xl font-bold text-white">{drawer.name}</h2>
                    </div>
                ))}
            </div>

            {/* Objects */}
            <div className="w-full max-w-5xl overflow-x-auto flex space-x-4 py-4 px-2 bg-background rounded-xl">
                {objects.map(obj => (
                    <div key={obj.id} className="flex-shrink-0 w-32 h-32 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center">
                        <img
                            src={obj.image_url}
                            alt={obj.name}
                            className="w-16 h-16 object-contain mb-2"
                        />
                        <span className="text-sm font-bold text-center">{obj.name}</span>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}
