import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CharacterSpeech from "../CharacterSpeech";

export default function IntroMetro() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [startName, setStartName] = useState("");
  const [endName, setEndName] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/metro/tasks/${id}`);
        const taskData = response.data;
        setTask(taskData);

        if (taskData?.correct_path?.length >= 2) {
          const startStationId = taskData.correct_path[0];
          const endStationId = taskData.correct_path[taskData.correct_path.length - 1];
          const [startRes, endRes] = await Promise.all([
            axios.get(`/api/metro/stations/${startStationId}`),
            axios.get(`/api/metro/stations/${endStationId}`)
          ]);

          setStartName(startRes.data.name);
          setEndName(endRes.data.name);
        }
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };
    fetchTask();
  }, [id]);

  if (!task) return <p className="text-center">Cargando misión...</p>;

  return (
    <CharacterSpeech text={`Actualmente me encuentro en la parada ${startName} 
      y necesito llegar a ${endName}. ¿Podrías ayudarme a llegar?`} image="/imgs/avatar_panda.png"/>
  );
}
