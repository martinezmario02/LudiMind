import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import Button from "../../../components/ui/Button";
import Message from "../../distractors/Message";

export default function ButtonsDetective() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [choices, setChoices] = useState([]);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchChoices = async () => {
            try {
                const res = await axios.get(`/api/detective/choices/${id}`);
                setChoices(res.data);
            } catch (err) {
                console.error("Error fetching emotion choices:", err);
            }
        };
        fetchChoices();
    }, [id]);

    const handleChoice = async (choiceId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(`/api/detective/check-choice/${choiceId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setResult(res.data.message);
            navigate(`/emotions/${id}/retrospective`);
        } catch (err) {
            console.error("Error checking reaction choice:", err);
        }
    };

    if (choices.length === 0) return <p className="text-center mt-10">Cargando opciones...</p>;
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center px-6 py-10">
                <h2 className="text-2xl font-extrabold text-center mb-8 drop-shadow-md">
                    ¿Qué harías tú en esta situación?
                </h2>
                <div className="flex flex-col gap-12 w-full max-w-lg">
                    {choices.map((choice) => (
                        <Button key={choice.id} className="py-9 text-2xl font-semibold w-full rounded-xl shadow-sm" onClick={() => handleChoice(choice.id)}>
                            {choice.text}
                        </Button>
                    ))}
                </div>
            </div>
            {/* Distractors */}
            <Message silence={3000} volume={0.6} />
        </div>
    );
}
