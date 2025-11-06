import React from "react";
import { cva } from "class-variance-authority";

const sliderVariants = cva(
  "relative w-full appearance-none h-2 rounded-lg cursor-pointer transition-all bg-gray-300",
  {
    variants: {
      color: {
        joy: "accent-yellow-400",
        sadness: "accent-blue-400",
        anger: "accent-red-500",
        fear: "accent-purple-500",
        disgust: "accent-green-500",
        default: "accent-blue-500",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);

const Slider = ({
  value = [0],
  onValueChange = () => {},
  max = 2,
  step = 1,
  disabled = false,
  color = "default",
  className = "",
}) => {
  const handleChange = (e) => {
    onValueChange([parseInt(e.target.value)]);
  };

  // Generar las marcas visuales (0, 5, 10)
  const marks = Array.from({ length: max / step + 1 }, (_, i) => i * step);

  return (
    <div className="relative w-full">
      {/* Input principal */}
      <input
        type="range"
        min="0"
        max={max}
        step={step}
        value={value[0]}
        disabled={disabled}
        onChange={handleChange}
        className={`${sliderVariants({ color })} ${className}`}
      />

      {/* Marcas visuales */}
      <div className="absolute top-1/2 left-0 w-full flex justify-between px-1 pointer-events-none">
        {marks.map((m, idx) => (
          <div
            key={idx}
            className="w-[2px] h-3 bg-gray-500 rounded-full -translate-y-1/2"
          ></div>
        ))}
      </div>

      {/* Números debajo de las marcas */}
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        {marks.map((m, idx) => (
          <span key={idx}>{m}</span>
        ))}
      </div>
    </div>
  );
};

export default Slider;