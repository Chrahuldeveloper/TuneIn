"use client";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";

const Readme = () => {
  return (
    <div className="my-10 ">
      <motion.div
        className="w-full  max-w-3xl mx-auto bg-[#0d1117] rounded-2xl shadow-lg border border-gray-800 p-7 relative "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 text-sm text-gray-400">README.md</span>
        </div>

        <h1 className="text-lg text-white font-bold mb-4">
          Hi there! <span className="animate-wave inline-block">👋</span>
        </h1>

        <motion.div
          className="bg-green-900/40 rounded-xl p-4 flex items-center justify-between border border-green-700/40"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-lg text-black">
              <FaPlay size={14} />
            </div>
            <div>
              <p className="text-sm text-gray-300">Currently playing</p>
              <p className="text-white font-semibold">Bohemian Rhapsody</p>
              <p className="text-gray-400 text-sm">Queen</p>
            </div>
          </div>

          <div className="flex gap-1 items-end">
            <span className="w-1 h-3 bg-green-400 animate-pulse"></span>
            <span className="w-1 h-5 bg-green-400 animate-pulse delay-100"></span>
            <span className="w-1 h-2 bg-green-400 animate-pulse delay-200"></span>
          </div>
        </motion.div>

        <p className="mt-4 text-gray-300 text-sm">
          I'm a developer who loves music and coding! 🎵💻
        </p>
      </motion.div>
    </div>
  );
};

export default Readme;
