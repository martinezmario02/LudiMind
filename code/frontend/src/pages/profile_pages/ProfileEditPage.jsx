import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";

export default function ProfileEditPage() {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const res = await axios.get("/api/auth/me-visual", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setName(res.data.name || "");
            } catch (err) {
                console.error("Error loading profile:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            await axios.post("/api/auth/change-name", { name }, { headers: { Authorization: `Bearer ${token}` } });
            navigate("/profile");
        } catch (error) {
            console.error("Error al cambiar el nombre:", error);
        }
    };

    const deleteAccount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            await axios.post("/api/auth/delete-account", {}, { headers: { Authorization: `Bearer ${token}` } });
            localStorage.removeItem("token");
            navigate("/");
        } catch (error) {
            console.error("Error al eliminar la cuenta:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="flex-grow max-w-4xl mx-auto w-full px-6 pt-8">
                <h1 className="text-4xl font-extrabold mb-6"> Modificación del perfil </h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Datos personales</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">
                                Nombre
                            </label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)}
                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={handleSave}> Guardar cambios </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Delete profile */}
                <div className="mt-6">
                    <p className="text-sm text-muted-foreground">
                        ¿Quieres eliminar tu cuenta?
                    </p>
                    <button className="text-sm font-medium text-primary underline mt-1" onClick={deleteAccount}>
                        Haz click aquí
                    </button>
                </div>
            </div>
        </div>
    );
}