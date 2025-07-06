import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import default_bggen from "../assets/default_bggen.jpg";
import default_bggen_2 from "../assets/default_bggen_2.jpg";
import Navbar from "./Navbar";

const BgGen = () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [resultImageLoaded, setResultImageLoaded] = useState(false);
  const [resultImage, setResultImage] = useState(null);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const base64 = await convertToBase64(file);
      const pureBase64 = base64.split(",")[1];
      setUserImage(pureBase64);
    }
  }
  async function enhancedPrompt(prompt) {
    if (!prompt || !prompt.trim()) {
      toast.error("Prompt cannot be empty");
      return;
    }
    try {
      setLoading(true);
      const enhancePrompt = await axios.post(
        "http://localhost:5000/features/prompt-enhance",
        {
          prompt: prompt,
        }
      );
      if (enhancePrompt.data.success) {
        setPrompt(enhancePrompt.data.data["prompt variations"]);
        toast.success("Prompt enhanced successfully.");
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("Failed to enhance prompt. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const generateBackground = async () => {
    if (!userImage) {
      toast.error("Please upload an image first.");
      return;
    }

    if (!prompt || !prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    setImageLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/features/bg-generation",
        {
          prompt: prompt,
          file: userImage,
        }
      );

      if (response.data && response.data.images.length > 0) {
        setResultImage(response.data.images[0]);
        setResultImageLoaded(true);
        toast.success("Background generated successfully!");
      } else {
        toast.error("Background generation failed.");
      }
    } catch (error) {
      console.error("Error generating background:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center min-h-[200px] mt-10 p-4">
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="e.g. in a parking lot"
            className="w-100 h-20 p-4 border border-gray-300 rounded-md mt-5 resize-none"
            rows={4}
          ></textarea>

          <div className="flex flex-row items-center gap-4 mt-5">
            <button
              onClick={generateBackground}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 hover:shadow-xl transition-colors duration-300 cursor-pointer"
            >
              {imageLoading ? "Generating..." : "Generate Background"}
            </button>

            <button
              onClick={() => enhancedPrompt(prompt)}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 hover:shadow-xl transition-colors duration-300 cursor-pointer"
            >
              {loading ? "Enhancing..." : "Enhance Prompt"}
            </button>
          </div>
        </div>

        <div className="my-15 flex gap-35 flex-wrap justify-center">
          {/* User Uploaded Image */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Original Image</h3>
            <img
              src={preview ? preview : default_bggen}
              alt="Preview"
              className="w-[300px] h-auto rounded shadow-lg"
            />
          </div>

          {/* Generated Image */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Generated Background</h3>
            {imageLoading ? (
              <Skeleton
                width={300}
                height={80}
                count={4}
                baseColor="#FFFFFF"
                highlightColor="#e4e4e4"
              />
            ) : (
              <img
                src={resultImageLoaded ? resultImage : default_bggen_2}
                alt="Generated Result"
                className="w-[300px] h-auto rounded shadow-lg"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BgGen;
