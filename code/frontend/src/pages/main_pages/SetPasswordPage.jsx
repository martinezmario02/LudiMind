import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SetPasswordPage() {
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");
            if (accessToken && refreshToken) {
            setToken({ accessToken, refreshToken });
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(
                "/api/auth/set-password", {
                    password,
                    passwordConfirmation,
                    accessToken: token?.accessToken,
                    refreshToken: token?.refreshToken
                }
            );
            navigate("/login");
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
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12 mt-8">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-sans">
                    LudiMind
                </h1>
                <p className="text-xl text-muted-foreground mb-8 font-sans max-w-2xl mx-auto">
                    ¿Has olvidado tu contraseña?
                    <br />
                    Introduce tu nueva constraseña para guardarla.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
                        <Input type="password" placeholder="Nueva Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirmar Nueva Contraseña</label>
                        <Input type="password" placeholder="Confirmar Nueva Contraseña" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <Button type="submit" className="w-full">Restablecer Contraseña</Button>
                </form>
            </div>
        </div>
    );
}