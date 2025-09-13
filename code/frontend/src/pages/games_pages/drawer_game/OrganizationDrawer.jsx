import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = { OBJECT: "object" };

// Object component
function DraggableObject({ obj }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.OBJECT,
    item: { id: obj.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`flex-shrink-0 w-32 h-32 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-move transition ${
        isDragging ? "opacity-50 scale-95" : "opacity-100"
      }`}
    >
      <img src={obj.image_url} alt={obj.name} className="w-16 h-16 object-contain mb-2" />
      <span className="text-sm font-bold text-center">{obj.name}</span>
    </div>
  );
}

// Drawer component
function DroppableDrawer({ drawer, onObjectDropped }) {
  const navigate = useNavigate();
  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.OBJECT,
    drop: (item) => onObjectDropped(item.id, drawer.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef}
      onClick={() => navigate(`/organization/content/${drawer.id}`)}
      className={`bg-[url('/imgs/wood_texture.jpg')] bg-cover bg-center rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center h-64 w-64 hover:scale-105 transform transition ${
        isOver ? "ring-4 ring-yellow-400" : ""
      }`}
    >
      <h2 className="text-xl font-bold text-white">{drawer.name}</h2>
    </div>
  );
}

export default function OrganizationDrawer() {
  const { id } = useParams(); // level_id
  const [user, setUser] = useState(null);
  const [drawers, setDrawers] = useState([]);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener el usuario a partir del token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data); // res.data debería contener { id, name, ... }
      } catch (err) {
        console.error("Error getting user:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch drawers y objetos no asignados
  useEffect(() => {
    if (!user) return;

    const fetchInfo = async () => {
      try {
        const resDrawers = await axios.get(`/api/drawer/drawers-info/${id}`);
        setDrawers(resDrawers.data);

        const resObjects = await axios.get(`/api/drawer/unassigned-objects/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setObjects(resObjects.data);
      } catch (err) {
        console.error("Error fetching drawers or objects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [id, user]);

  const handleObjectDropped = useCallback(
    async (objectId, drawerId) => {
      try {
        await axios.post(
        "/api/drawer/add-object",
            { objectId, drawerId, levelId: id },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setObjects((prev) => prev.filter((obj) => obj.id !== objectId));
      } catch (err) {
        console.error("Error dropping object:", err);
      }
    },
    []
  );

  if (loading) return <p className="text-center mt-10">Cargando desván mágico...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col items-center pt-8 px-4">
        <h2 className="text-4xl font-extrabold text-primary text-center mb-8 drop-shadow-md">
          Mi Desván Mágico
        </h2>

        {/* Drawers */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center mb-8">
          {drawers.map((drawer) => (
            <DroppableDrawer key={drawer.id} drawer={drawer} onObjectDropped={handleObjectDropped} />
          ))}
        </div>

        {/* Unassigned Objects */}
        <div className="w-full max-w-5xl overflow-x-auto flex space-x-4 py-4 px-2 bg-background rounded-xl">
          {objects.map((obj) => (
            <DraggableObject key={obj.id} obj={obj} />
          ))}
        </div>
      </div>
    </div>
  );
}