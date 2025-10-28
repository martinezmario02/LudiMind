import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import CharacterSpeech from "../CharacterSpeech";

export default function IntroMetro() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/metro/tasks/${id}`);
        const taskData = response.data;
        setTask(taskData);

        if (taskData?.path?.length >= 2) {
          const startStationId = taskData.path[0];
          const endStationId = taskData.path[taskData.path.length - 1];
          const [startRes, endRes] = await Promise.all([
            axios.get(`/api/metro/stations/${startStationId}`),
            axios.get(`/api/metro/stations/${endStationId}`)
          ]);

          setStart(startRes.data);
          setEnd(endRes.data);
        }
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };
    fetchTask();
  }, [id]);

  if (!task) return <p className="text-center">Cargando misión...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow" onClick={() => navigate(`/memory/${id}/clue`)}>
        <CharacterSpeech 
          text={task.level_number <= 3
            ? `Actualmente me encuentro en la parada ${start.name} (${start.emoji}) y necesito llegar a ${end.name} (${end.emoji}). ¿Podrías ayudarme a llegar?`
            : `Debes planificar tu trayecto desde ${start.name} hasta ${end.name} de manera eficiente.`} 
          image="/imgs/avatar_panda.png" showAvatar={task.level_number <= 3} />
      </div>
    </div>
  );
}