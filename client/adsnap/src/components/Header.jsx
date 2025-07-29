import React from "react";
import mockup_3 from "../assets/mockup_3.png";
import { delay, motion } from "motion/react";

function Header() {
  return (
    <div>
      <motion.div
        className="flex flex-col items-center justify-center text-center my-10 px-4"
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="bg-white p-2 rounded-full border border-neutral-500 px-5 sm:px-6 md:px-7 text-stone-600 text-sm sm:text-base"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Craft Images from Text with AI Precision✨
        </motion.div>

        <div className="flex flex-col items-center text-center w-full max-w-[650px] px-4">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-5 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.5 }}
          >
            Transform Ideas into{" "}
            <span className="text-blue-600">Stunning Visuals</span> with AI
          </motion.h1>

          <div className="w-full max-w-[580px]">
            <motion.p
              className="text-base sm:text-lg md:text-xl mt-6 sm:mt-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Unleash your creativity with our AI-powered image generation tool.
              Create unique visuals in seconds.
            </motion.p>
          </div>

          <a href={"#features"}>
            <motion.button
              className="mt-6 sm:mt-7 bg-black px-6 sm:px-8 md:px-10 py-2 text-white rounded-full text-lg sm:text-xl md:text-2xl cursor-pointer hover:scale-105 transition-all duration-300"
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                default: { duration: 0.5 },
                opacity: { delay: 0.8, duration: 1 },
              }}
            >
              Explore
              <i
                className="fa-solid fa-angle-down ms-2 mt-1"
                style={{ color: "#ffffff" }}
              ></i>
            </motion.button>
          </a>
        </div>

        <motion.div
          className="flex flex-col items-center justify-center mt-10 sm:mt-12 md:mt-16 w-full max-w-[600px] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <img
            src={mockup_3}
            className="w-full h-auto object-contain"
            alt="MockUp"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Header;
