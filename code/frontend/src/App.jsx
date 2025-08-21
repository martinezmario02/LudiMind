import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    // Usa clases de Tailwind para centrar el contenido y dar un fondo oscuro
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="flex space-x-8 mb-8">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="w-24 h-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="w-24 h-24 animate-spin-slow" alt="React logo" />
        </a>
      </div>
      
      {/* Aplica estilos de texto y márgenes */}
      <h1 className="text-4xl font-bold mb-4">Vite + React con Tailwind</h1>
      
      <div className="card p-6 bg-gray-800 rounded-lg shadow-lg">
        {/* Estilos para el botón, con efecto hover */}
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-400">
          Edita <code>src/App.jsx</code> y guarda para probar HMR
        </p>
      </div>
      
      {/* Estilos para el pie de página */}
      <p className="mt-8 text-sm text-gray-500">
        Haz clic en los logos para aprender más
      </p>
    </div>
  )
}

export default App