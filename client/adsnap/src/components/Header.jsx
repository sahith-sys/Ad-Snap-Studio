import React from 'react'
import mockup_3 from "../assets/mockup_3.png";

function Header() {
  return (
    <div>
        <div className="flex  flex-col items-center justify-center text-center my-10">
      <div className="bg-white p-2 rounded-full border border-neutral-500 px-7">
        Craft Images from Text with AI Precision✨
      </div>
      
      <div className="flex flex-col items-center text-center w-[650px]">
        <h1 className="text-6xl mt-5">
          Transform Ideas into{" "}
          <span className="text-blue-600">Stunning Visuals</span> with AI
        </h1>
        <div className="w-[580px]">
          <p className="text-xl mt-7">
            Unleash your creativity with our AI-powered image generation tool.
            Create unique visuals in seconds.
          </p>
        </div>
        <button className="mt-7 bg-black px-15 py-2 text-white rounded-full text-2xl cursor-pointer hover:scale-105 transistion-all duration-300">
          Explore
        </button>
      </div>
      <div className="flex flex-col items-center justify-center mt-15 w-150">
        <img src={mockup_3} className="" alt="MockUp" />
      </div>
    </div>
    </div>
  )
}

export default Header