import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import { X } from "lucide-react";

export default function ContentDrawer() {
  const { id } = useParams();
  const [drawer, setDrawer] = useState(null);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) return;

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const res = await axios.get(`/api/drawer/content/${id}`, { headers: { Authorization: `Bearer ${token}` },});
        setObjects(res.data);
        const drawer = await axios.get(`/api/drawer/drawer-info/${id}`, { headers: { Authorization: `Bearer ${token}` },});
        setDrawer(drawer.data);
      } catch (err) {
        console.error("Error fetching objects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchObjects();
  }, [id]);

  const removeObject = async (objectId) => {
    try {
      await axios.post("/api/drawer/remove-object", {
        drawerId: id, objectId,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setObjects(objects.filter(obj => obj.id !== objectId));
    } catch (err) {
      console.error("Error removing object:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando cajón...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col items-center pt-8 px-4">
        <h2 className="text-4xl font-extrabold text-primary text-center mb-8 drop-shadow-md">
          Objetos en el Cajón "{drawer.name || ''}"
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {objects.map(obj => (
            <div key={obj.id} className="relative w-60 h-50 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center">
              <button onClick={() => removeObject(obj.id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-800">
                <X size={16} />
              </button>
              <img src={obj.image_url} alt={obj.name} className="w-28 h-28 object-contain mb-2" />
              <span className="text-m font-bold text-center">{obj.name}</span>
            </div>
          ))}
        </div>

        <button onClick={() => navigate(-1)} className="mt-8 px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-dark">
          Volver
        </button>
      </div>
    </div>
  );
}
