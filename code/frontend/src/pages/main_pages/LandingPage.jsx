import Button from "../../components/ui/Button.jsx"
import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            <header className="container mx-auto px-4 py-6">
                <nav className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Brain className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold text-foreground">LudiMind</span>
                    </div>
                    <div className="flex space-x-4">
                        <Button asChild variant="outline" size="lg" className="text-foreground hover:text-foreground2">
                            <Link to="/login">Iniciar Sesión</Link>
                        </Button>
                        <Button asChild size="lg" className="bg-foreground hover:bg-foreground2 text-white">
                            <Link to="/register">Registrarse Ahora</Link>
                        </Button>
                    </div>
                </nav>
            </header>
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12 mt-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-sans">
                        LudiMind
                    </h1>
                    <p className="text-xl text-foreground mb-8 font-sans max-w-2xl mx-auto">
                        Una plataforma educativa diseñada especialmente para ayudar a estudiantes con TDAH
                        a desarrollar sus habilidades a través del juego
                    </p>
                    <p className="text-xl text-foreground mb-8 font-sans max-w-2xl mx-auto mt-6">
                        ¿Quieres más información?{" "}
                        <Link to="/info" className="text-foreground2 underline">
                            Haz click aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}