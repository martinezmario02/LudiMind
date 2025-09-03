import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CharacterSpeech from "../CharacterSpeech";

export default function IntroMetro() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

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
    <CharacterSpeech text={`Actualmente me encuentro en la parada ${start.name} (${start.emoji}) 
      y necesito llegar a ${end.name} (${end.emoji}). ¿Podrías ayudarme a llegar?`} image="/imgs/avatar_panda.png"/>
  );
}