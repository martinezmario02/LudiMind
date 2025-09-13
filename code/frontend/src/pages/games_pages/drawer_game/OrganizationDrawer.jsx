import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  OBJECT: "object",
};

// 🔹 Componente draggable (objeto)
function DraggableObject({ obj, onDropSuccess }) {
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

// 🔹 Componente drop zone (cajón)
function DroppableDrawer({ drawer, onObjectDropped }) {
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
      className={`bg-[url('/imgs/wood_texture.jpg')] bg-cover bg-center rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center h-64 w-64 hover:scale-105 transform transition ${
        isOver ? "ring-4 ring-yellow-400" : ""
      }`}
    >
      <h2 className="text-xl font-bold text-white">{drawer.name}</h2>
    </div>
  );
}

export default function OrganizationDrawer() {
  const { id } = useParams();
  const [drawers, setDrawers] = useState([]);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`/api/drawer/drawers-info/${id}`);
        setDrawers(response.data);

        const objectIds = response.data.flatMap((drawer) =>
          drawer.solutions?.flatMap((sol) => sol.object_ids) || []
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

  // 🔹 Handler al soltar objeto
  const handleObjectDropped = useCallback(async (objectId, drawerId) => {
    try {
      await axios.post(`/api/drawer/add-object`, { objectId, drawerId });
      setObjects((prev) => prev.filter((obj) => obj.id !== objectId));
    } catch (err) {
      console.error("Error al guardar objeto en cajón:", err);
    }
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando desván mágico...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col items-center pt-8 px-4">
        <h2 className="text-4xl font-extrabold text-primary text-center mb-8 drop-shadow-md">
          Mi Desván Mágico
        </h2>

        {/* Cajones */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center mb-8">
          {drawers.map((drawer) => (
            <DroppableDrawer key={drawer.id} drawer={drawer} onObjectDropped={handleObjectDropped} />
          ))}
        </div>

        {/* Objetos */}
        <div className="w-full max-w-5xl overflow-x-auto flex space-x-4 py-4 px-2 bg-background rounded-xl">
          {objects.map((obj) => (
            <DraggableObject key={obj.id} obj={obj} />
          ))}
        </div>
      </div>
    </div>
  );
}
