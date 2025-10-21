import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VisualLoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [selectedSequence, setSelectedSequence] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const IMAGES = [
        "https://xnqinddknjtajkgufbzr.supabase.co/storage/v1/object/public/password-images/cars.jpeg",
        "https://xnqinddknjtajkgufbzr.supabase.co/storage/v1/object/public/password-images/pikachu.png",
        "https://xnqinddknjtajkgufbzr.supabase.co/storage/v1/object/public/password-images/spiderman.jpeg",
        "https://xnqinddknjtajkgufbzr.supabase.co/storage/v1/object/public/password-images/stitch.jpg",
        "https://xnqinddknjtajkgufbzr.supabase.co/storage/v1/object/public/password-images/batman.jpeg",
        "https://xnqinddknjtajkgufbzr.supabase.co/storage/v1/object/public/password-images/hellokitty.jpg"
    ];

    const handleImageClick = (img) => {
        if (selectedSequence.length >= 4) return;
        setSelectedSequence([...selectedSequence, img]);
    };

    const handleRemove = (img) => {
        setSelectedSequence(selectedSequence.filter((i) => i !== img));
    };

    const handleReset = () => setSelectedSequence([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!username || selectedSequence.length === 0) {
            setError("Introduce tu nombre de usuario y selecciona una secuencia de imágenes.");
            return;
        }

        try {
            const res = await axios.post(
                "/api/auth/visual-login",
                { username, selectedSequence },
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data?.success && res.data?.token) {
                localStorage.setItem("token", res.data.token); 
                navigate("/games");
            } else {
                setError(res.data?.error || "Credenciales incorrectas");
            }
        } catch (err) {
            console.error(err);
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("Error al conectar con el servidor");
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="text-center container mx-auto px-4 py-8">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-sans">
                    LudiMind
                </h1>
                <p className="text-xl text-foreground mb-8 font-sans max-w-2xl mx-auto">
                    Inicia sesión para acceder a tu cuenta y comenzar a mejorar tus habilidades
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 w-90 mx-auto p-6 bg-white rounded-lg shadow">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre de usuario</label>
                        <Input type="text" placeholder="Ej: lucas_03" value={username} onChange={(e) => setUsername(e.target.value)} className="w-32 px-4 py-2 border rounded-md"/>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Selecciona tu secuencia</label>
                        <div className="flex flex-wrap justify-center gap-3">
                            {IMAGES.map((img, i) => (
                                <button type="button" key={i} onClick={() => handleImageClick(img)} className="w-32 h-32 rounded-md border border-gray-300 hover:border-primary transition bg-background2">
                                    <img src={img} alt={`op-${i}`} className="w-full h-full object-contain rounded-md" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected images */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Tu secuencia</label>
                        <div className="border border-gray-300 rounded-md py-3 flex justify-center gap-3 bg-background2 min-h-[80px]">
                            {selectedSequence.length === 0 ? (
                                <p className="text-muted-foreground text-sm self-center"> Aún no has elegido imágenes</p>
                            ) : (
                                selectedSequence.map((img, i) => (
                                    <button type="button" key={i} onClick={() => handleRemove(img)} className="w-32 h-32 border border-primary/50 rounded-md">
                                        <img src={img} alt={`sel-${i}`} className="w-full h-full object-contain rounded-md" />
                                    </button>
                                ))
                            )}
                        </div>
                        {selectedSequence.length > 0 && (
                            <button type="button" onClick={handleReset} className="mt-2 text-sm text-muted-foreground underline hover:text-foreground">
                                Borrar secuencia
                            </button>
                        )}
                    </div>

                    {/* Init button */}
                    <Button type="submit" className="w-full">
                        Iniciar Sesión
                    </Button>
                </form>
            </div>

            {/* Forgot sequence link */}
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    ¿Has olvidado tu secuencia?{" "}
                    <a href="/recover" className="text-blue-500 hover:underline">
                        Recupérala aquí
                    </a>
                </p>
            </div>
        </div>
    );
}