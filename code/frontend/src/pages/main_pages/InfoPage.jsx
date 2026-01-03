import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card.jsx"
import Button from "../../components/ui/Button.jsx"
import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

export default function InfoPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="container mx-auto px-4 py-6">
                <nav className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Brain className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold text-foreground">LudiMind</span>
                </div>
                <div className="flex space-x-4">
                    <Button asChild variant="outline" size="lg" className="text-foreground hover:text-foreground2">
                        <Link to="/visual-login">Iniciar Sesión</Link>
                    </Button>
                    <Button asChild size="lg" className="bg-foreground hover:bg-foreground2 text-white">
                        <Link to="/visual-register">Registrarse Ahora</Link>
                    </Button>
                </div>
                </nav>
            </header>
            {/* Main section */}
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12 mt-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-sans">
                        LudiMind
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 font-sans max-w-2xl mx-auto">
                        Una aplicación educativa diseñada especialmente para ayudar a estudiantes con TDAH
                        a desarrollar sus habilidades a través del juego
                    </p>
                    <Button asChild size="lg" className="text-lg px-8 py-3">
                        <Link to="/">Volver al inicio</Link>
                    </Button>
                </div>

                {/* Games preview section */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-primary font-sans">Metro de la Memoria</CardTitle>
                            <CardDescription>Mejora tu memoria y concentración</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-32 bg-accent/20 rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-4xl">🚇</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Recuerda secuencias y patrones en este divertido juego del metro
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-primary font-sans">Desván Mágico</CardTitle>
                            <CardDescription>Organiza y clasifica objetos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-32 bg-accent/20 rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-4xl">🏠</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Encuentra y organiza objetos en un desván lleno de sorpresas
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-primary font-sans">Detective Emociones</CardTitle>
                            <CardDescription>Reconoce y comprende emociones</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-32 bg-accent/20 rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-4xl">🕵️</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Conviértete en detective y descubre diferentes emociones
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-primary font-sans">Semáforo Emocional</CardTitle>
                            <CardDescription>Aprende autocontrol emocional</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-32 bg-accent/20 rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-4xl">🚦</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Usa el semáforo para gestionar tus emociones y reacciones
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Features section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-8 font-sans">
                        Características Especiales
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 font-sans">Seguimiento de Progreso</h3>
                            <p className="text-muted-foreground">
                                Monitorea el desarrollo de habilidades y celebra los logros
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🧩</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 font-sans">Aprender Jugando</h3>
                            <p className="text-muted-foreground">
                                Desarrollo de habilidades y conocimientos a través de juegos interactivos y divertidos
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🏆</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 font-sans">Sistema de Recompensas</h3>
                            <p className="text-muted-foreground">
                                Incentivos positivos que motivan el aprendizaje continuo
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}