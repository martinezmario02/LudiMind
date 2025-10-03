import Button from "../../components/ui/Button.jsx"
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12 mt-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-sans">
                        LudiMind
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 font-sans max-w-2xl mx-auto">
                        Una plataforma educativa diseñada especialmente para ayudar a estudiantes con TDAH
                        a desarrollar sus habilidades a través del juego
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="text-lg px-8 py-3">
                            <Link to="/register">Registrarse Ahora</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                            <Link to="/login">Iniciar Sesión</Link>
                        </Button>
                    </div>
                    <p className="text-xl text-muted-foreground mb-8 font-sans max-w-2xl mx-auto mt-6">
                        ¿Quieres más información?{" "}
                        <Link to="/info" className="text-blue-600 underline">
                            Haz click aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}