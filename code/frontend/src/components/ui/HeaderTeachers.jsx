import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Gamepad2, ClipboardCheck, Target, User, LogOut } from "lucide-react";
import axios from "axios";
import { Brain } from "lucide-react";

export default function Header() {
  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(response.data.name);
      } catch (err) {
        console.error("No se pudo obtener el usuario", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="bg-foreground text-card py-6 shadow-md">
      <div className="container mx-auto flex flex-col items-center px-4">
        <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-background" />
            <span className="text-2xl font-bold text-card">LudiMind</span>
        </div>

        <div className="w-full flex items-center justify-center relative">
          <nav className="flex space-x-6">
            <Link to="/games" className="flex items-center space-x-1 hover:text-accent">
              <Gamepad2 size={20} /><span>Juegos</span>
            </Link>
            <Link to="/evaluation" className="flex items-center space-x-1 hover:text-accent">
              <ClipboardCheck size={20} /><span>Evaluación</span>
            </Link>
            <Link to="/missions" className="flex items-center space-x-1 hover:text-accent">
              <Target size={20} /><span>Misiones</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 hover:text-accent">
              <User size={20} /><span>Perfil</span>
            </Link>
          </nav>

          <div className="absolute right-0 flex flex-col items-end mb-12">
            <span className="mb-2 font-medium">Hola, {userName}</span>
            <button className="flex items-center space-x-1 hover:text-card text-foreground2" onClick={handleLogout}>
              <LogOut size={20} /><span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}