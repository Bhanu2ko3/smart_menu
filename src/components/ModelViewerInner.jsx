import "@google/model-viewer";
import { useRef } from "react";
import { motion } from "framer-motion";
import { FiRotateCw, FiMaximize, FiDownload } from "react-icons/fi";

export default function ModelViewerInner({ src }) {
  const modelRef = useRef();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.95 }
  };

  const handleFullscreen = () => {
    if (modelRef.current) {
      modelRef.current.enterFullscreen();
    }
  };

  const handleAutoRotate = () => {
    if (modelRef.current) {
      modelRef.current.autoRotate = !modelRef.current.autoRotate;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center gap-4"
    >
      <motion.div 
        className="relative w-full max-w-3xl h-[500px] rounded-xl shadow-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
        whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      >
        <model-viewer
          ref={modelRef}
          src={src}
          ar
          ar-modes="scene-viewer webxr"
          environment-image="neutral"
          auto-rotate
          camera-controls
          className="w-full h-full"
          exposure="1.0"
          shadow-intensity="1"
          loading="eager"
        />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleAutoRotate}
            className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-md backdrop-blur-sm bg-opacity-70"
            aria-label="Toggle rotation"
          >
            <FiRotateCw className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleFullscreen}
            className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-md backdrop-blur-sm bg-opacity-70"
            aria-label="Fullscreen"
          >
            <FiMaximize className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        className="text-center text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p>Drag to rotate • Scroll to zoom • Click to interact</p>
      </motion.div>
    </motion.div>
  );
}