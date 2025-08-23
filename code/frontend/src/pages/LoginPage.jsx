import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Error al iniciar sesión");
            }

            const data = await response.json();
            // localStorage.setItem("token", data.session.access_token);
            // navigate("/");
        } catch (error) {
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12 mt-8">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-sans">
                    LudiMind
                </h1>
                <p className="text-xl text-muted-foreground mb-8 font-sans max-w-2xl mx-auto">
                    Inicia sesión para acceder a tu cuenta y comenzar a mejorar tus habilidades
                </p>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Contraseña</label>
                        <Input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <Button type="submit" className="w-full">Iniciar Sesión</Button>
                </form>
            </div>
        </div>
    );
}