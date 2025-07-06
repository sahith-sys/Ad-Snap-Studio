import React, { useState } from "react";
import default_imggen from "../assets/default_imggen.png";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import Navbar from "./Navbar";

export default function ImgGen() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(default_imggen);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const enhancedPrompt = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/features/prompt-enhance",
        { prompt: prompt }
      );
      console.log(response.data);
      if (response.data.success) {
        setPrompt(response.data.data["prompt variations"]);
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("Failed to enhance prompt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    setImageLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/features/img-generation",
        { prompt: prompt }
      );
      console.log(response.data.data.result[0].urls[0]);
      if (response.data.success) {
        setImage(response.data.data.result[0].urls[0]);
        toast.success("Image generated successfully..");
        toast.success("Please wait for a few seconds to load the image.");
      }
    } catch (error) {
      console.error("Error generating image", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setImageLoading(false);
      setPrompt("");
      setImageLoaded(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center my-10">
        <div className="w-100 bg-blue">
          <img src={image} alt="" />
          <ClipLoader
        color="#000000"
        className="mt-5"
        loading={imageLoading}
        cssOverride={{ display: "block", margin: "0 auto" }}
        speedMultiplier={1}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
        </div>
        
        {!imageLoaded ? (
          <>
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="e.g. A cat riding a Bicycle"
              className="w-1/2 p-4 border border-gray-300 rounded-md mt-5 resize-none"
              rows={4}
            ></textarea>

            <button
              onClick={enhancedPrompt}
              className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
            >
              {loading ? "Enhancing..." : "Enhance Prompt✨"}
            </button>

            <button
              className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300"
              onClick={generateImage}
            >
              {imageLoading ? "Generating..." : "Generate Image"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setImageLoaded(false)}
              className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
            >
              Generate More Images
            </button>

            <a
              href={image}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300 ml-4"
            >
              Download
            </a>
          </>
        )}
      </div>
    </>
  );
}
