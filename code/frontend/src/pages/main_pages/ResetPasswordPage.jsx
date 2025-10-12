import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const response = await axios.post(
                "/api/auth/reset-password",
                { email },
                { headers: { "Content-Type": "application/json" } }
            );
            setMessage("Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.");
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || "Error al restablecer la contraseña");
            } else if (error.request) {
                setError("No se pudo conectar con el servidor");
            } else {
                setError("Error inesperado: " + error.message);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-background">
            <div className="text-center mb-12 mt-8">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-sans">
                    LudiMind
                </h1>
                <p className="text-xl text-muted-foreground mb-8 font-sans max-w-2xl mx-auto">
                    ¿Has olvidado tu contraseña?
                    <br />
                    Introduce tu correo electrónico para recibir un enlace de restablecimiento de contraseña.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
                    {message && <p className="text-green-500 mb-2">{message}</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <Button type="submit" className="w-full">Enviar Correo</Button>
                </form>
            </div>
        </div>
    );
}