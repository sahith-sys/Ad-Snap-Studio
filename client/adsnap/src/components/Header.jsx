import React from "react";
import mockup_3 from "../assets/mockup_3.png";
import { delay, motion } from "motion/react";

function Header() {
  return (
    <div>
      <motion.div
        className="flex  flex-col items-center justify-center text-center my-10"
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="bg-white p-2 rounded-full border border-neutral-500 px-7 text-stone-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 1 }}
          transition={{delay: 0.2, duration: 0.8 }}
        >
          Craft Images from Text with AI Precision✨
        </motion.div>

        <div className="flex flex-col items-center text-center w-[650px]">
          <motion.h1 className="text-6xl mt-5"
          initial={{opacity:0}}
          animate={{opacity:1}}
          transition={{delay:0.4, duration:1.5}}
          >
            Transform Ideas into{" "}
            <span className="text-blue-600">Stunning Visuals</span> with AI
          </motion.h1>
          <div className="w-[580px]">
            <motion.p className="text-xl mt-7"
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{delay:0.6,duration:0.8}}
            >
              Unleash your creativity with our AI-powered image generation tool.
              Create unique visuals in seconds.
            </motion.p>
          </div>
          <motion.button className="mt-7 bg-black px-15 py-2 text-white rounded-full text-2xl cursor-pointer hover:scale-105 transistion-all duration-300"
          
          whileTap={{scale:0.95}}
          initial={{opacity:0}}
          animate={{opacity:1}}
          transition={{default:{duration:0.5},opacity:{delay:0.8, duration:1}}}
          >
            Explore
          </motion.button>
        </div>
        <motion.div className="flex flex-col items-center justify-center mt-15 w-150"
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:1, duration:1}}
        >
          <img src={mockup_3} className="" alt="MockUp" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Header;
