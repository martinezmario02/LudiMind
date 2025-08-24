import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(
                "/auth/register",
                { name, birthdate, email, password, confirmPassword },
                { headers: { "Content-Type": "application/json" } }
            );
            navigate("/login");
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || "Error al registrar usuario");
            } else if (error.request) {
                setError("No se pudo conectar con el servidor");
            } else {
                setError("Error inesperado: " + error.message);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12 mt-8">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-sans">
                    LudiMind
                </h1>
                <p className="text-xl text-muted-foreground mb-8 font-sans max-w-2xl mx-auto">
                    Crea tu propia cuenta para comenzar a mejorar tus habilidades de manera divertida y efectiva
                </p>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre</label>
                        <Input type="text" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Fecha de Nacimiento</label>
                        <Input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Contraseña</label>
                        <Input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
                        <Input type="password" placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <Button type="submit" className="w-full">Registrarse</Button>
                </form>
            </div>
        </div>
    );
}