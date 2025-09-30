import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import CharacterSpeech from "../CharacterSpeech";

export default function ClueMetro() {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`/api/metro/tasks/${id}`);
                const taskData = response.data;
                setTask(taskData);
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
            <div className="flex-grow" onClick={() => navigate(`/memory/${id}/lines`)}>
                <CharacterSpeech 
                    text={
                        <>
                        Vamos a utilizar una frase para que recuerdes por donde pasar.<br/>
                        Deberás memorizarla antes de continuar al siguiente paso:<br/>
                        <span className="font-extrabold text-primary">"{task.clue}"</span>
                        </>
                    } 
                    image="/imgs/avatar_panda.png" 
                />
            </div>
        </div>
    );
}