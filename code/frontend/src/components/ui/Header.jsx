import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Gamepad2, ClipboardCheck, Target, User, LogOut } from "lucide-react";
import axios from "axios";

export default function Header() {
  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me", {
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
    <header className="bg-header text-card py-6 shadow-md">
      <div className="container mx-auto flex flex-col items-center px-4">
        <h1 className="text-4xl font-extrabold mb-6">LudiMind</h1>

        <div className="w-full flex items-center justify-center relative">
          <nav className="flex space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-accent">
              <Home size={20} /><span>Inicio</span>
            </Link>
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
            <button className="flex items-center space-x-1 hover:text-red-500 text-red-400" onClick={handleLogout}>
              <LogOut size={20} /><span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}