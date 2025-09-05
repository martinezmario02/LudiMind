import { motion } from "framer-motion";

export default function CharacterSpeech({ text, image }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-10 mt-10">
      {/* Bocadillo */}
      <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative bg-white text-gray-900 rounded-3xl shadow-xl px-8 py-6 max-w-2xl text-center">
        <p className="text-3xl font-extrabold leading-snug">{text}</p>
        {/* Triángulo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-20px] w-0 h-0 border-l-[20px] 
          border-r-[20px] border-t-[20px] border-transparent border-t-white"></div>
      </motion.div>

      {/* Avatar */}
      <motion.img src={image} alt="Avatar" className="w-48 h-48 object-contain drop-shadow-lg"
        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} />
    </div>
  );
}