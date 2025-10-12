import { useState } from "react";

const VisualLogin = ({ images, onSubmit }) => {
  const [sequence, setSequence] = useState([]);

  const handleClick = (img) => {
    setSequence([...sequence, img]);
  };

  const handleReset = () => setSequence([]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl mb-4 font-bold">Selecciona tu secuencia secreta</h2>
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={() => handleClick(img)}
            className="w-24 h-24 object-cover rounded-2xl cursor-pointer hover:scale-105 transition"
          />
        ))}
      </div>
      <div className="mt-6">
        <button
          onClick={() => onSubmit(sequence)}
          className="bg-blue-500 text-white px-6 py-2 rounded-xl mr-3"
        >
          Iniciar sesión
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-300 px-6 py-2 rounded-xl"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
};

export default VisualLogin;