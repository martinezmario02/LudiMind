import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import Button from "../../../components/ui/Button";
import Slider from "../../../components/ui/Slider";
import Message from "../../auditory_distractions/Message";

export default function EmotionBars() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scenario, setScenario] = useState(null);
  const [values, setValues] = useState({
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    disgust: 0,
  });

  const [selected, setSelected] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState(null);

  const EMOTIONS = [
    { name: "Alegría", key: "joy", emoji: "😊", color: "joy" },
    { name: "Tristeza", key: "sadness", emoji: "😢", color: "sadness" },
    { name: "Ira", key: "anger", emoji: "😡", color: "anger" },
    { name: "Miedo", key: "fear", emoji: "😨", color: "fear" },
    { name: "Incomodidad", key: "disgust", emoji: "🤢", color: "disgust" },
  ];

  const token = localStorage.getItem("token");

  // Get scenario data
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const res = await axios.get(`/api/detective/info-level/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setScenario(res.data);
      } catch (err) {
        console.error("Error fetching emotion scenario:", err);
      }
    };
    fetchScenario();
  }, [id]);

  // Select an emotion to set its value
  const handleSelect = (emotionKey) => {
    setSelected(emotionKey);
    setValues((prev) => ({
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      disgust: 0,
      [emotionKey]: prev[emotionKey],
    }));
  };

  // Handle slider value change
  const handleChange = (emotionKey, newValue) => {
    if (emotionKey === selected) {
      setValues({
        joy: 0,
        sadness: 0,
        anger: 0,
        fear: 0,
        disgust: 0,
        [emotionKey]: newValue[0],
      });
    }
  };

  // Submit the selected emotion and its intensity
  const handleSubmit = async () => {
    if (!selected) {
      alert("Selecciona una emoción antes de comprobar.");
      return;
    }

    try {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      const res = await axios.post(
        `/api/detective/check/${id}`,
        {
          selectedEmotion: selected,
          intensity: values[selected],
          attempt: newAttempts,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { isCorrect, finished, message } = res.data;
      setResult(message);
      if (!isCorrect) alert(`❌ Incorrecto: Te quedan ${3 - newAttempts} intentos`);
      if (finished) navigate(`/emotions/${id}/buttons`);
    } catch (err) {
      console.error("Error al comprobar emoción:", err);
    }
  };

  if (!scenario) return <p className="text-center mt-10">Cargando nivel...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col items-center pt-8 px-4">
        <h2 className="text-2xl font-extrabold text-center mb-4 drop-shadow-md">
          ¿Cómo crees que se siente el niño?
        </h2>
        <p className="text-center mb-6">
          Solo una emoción puede tener un valor distinto de cero.
        </p>

        <div className="flex flex-col gap-6 w-full max-w-2xl">
          {EMOTIONS.map((emotion) => (
            <div key={emotion.key} className={`p-4 rounded-2xl shadow-sm border transition cursor-pointer ${
              selected === emotion.key
                ? "border-2 border-blue-500 bg-blue-50"
                : "border-gray-200"
              }`} onClick={() => handleSelect(emotion.key)} >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg"> {emotion.emoji} {emotion.name}</span>
                <span className="font-medium">{values[emotion.key]}</span>
              </div>
              <Slider value={[values[emotion.key]]} onValueChange={(v) => handleChange(emotion.key, v)} disabled={selected !== emotion.key} color={emotion.color} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button className="px-6 py-3 text-lg font-semibold" onClick={handleSubmit}>Comprobar</Button>
        </div>

        {/* Distractors */}
        <Message silence={3000} volume={0.6} />
      </div>
    </div>
  );
}
