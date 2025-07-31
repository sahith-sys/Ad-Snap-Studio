import React, { useState } from "react";
import { useEffect } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import Navbar from "./Navbar";
import { Slider } from "@/components/ui/slider";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@/components/ui/button";

const BgGen = () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [resultImageLoaded, setResultImageLoaded] = useState(false);
  const [images, setImages] = useState([]);
  const [noImages, setNoImages] = useState(1);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const base64 = await convertToBase64(file);
      const pureBase64 = base64.split(",")[1];
      setUserImage(pureBase64);
    }
  }
  async function enhancedPrompt() {
    if (!prompt) {
      toast.error("Prompt cannot be empty");
      return;
    }
    try {
      setPromptLoading(true);
      const enhancePrompt = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/features/prompt-enhance`,
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
      setPromptLoading(false);
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

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to generate images.");
        return;
      }
      setImageLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/features/bg-generation`,
        {
          prompt: prompt,
          file: userImage,
          num_results: noImages,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data && response.data.images.length > 0) {
        setImages(response.data.images);
        setResultImageLoaded(true);
        toast.success("Background generated successfully!");
      } else {
        toast.error("Background generation failed.");
      }
    } catch (error) {
      console.log("Error generating background:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row rounded-lg border mt-10 w-full max-w-140 mx-auto shadow-xl bg-white p-6">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4">Background Generation</h1>
          <div className="flex flex-col gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="e.g. A cat riding a Bicycle"
              className="w-full p-4 border border-gray-300 rounded-md resize-none"
              rows={3}
            ></textarea>
            <Button
              variant="secondary"
              className="border border-gray-300 hover:text-white hover:bg-black transition-all duration-500 cursor-pointer"
              onClick={enhancedPrompt}
            >
              {promptLoading ? "Enhancing..." : "Enhance Prompt✨"}
            </Button>
          </div>

          <div className="mt-6">
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-stone-600">Select no. of Images (up to 4)</p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Slider
                  value={[noImages]}
                  min={1}
                  max={4}
                  step={1}
                  className="w-full sm:w-72 cursor-pointer"
                  onValueChange={([val]) => setNoImages(val)}
                />
                <div>{noImages}</div>
              </div>
            </div>

            <Button
              className="cursor-pointer mt-5 w-full sm:w-auto"
              onClick={generateBackground}
            >
              {!imageLoading ? "Generate Background" : "Generating..."}
            </Button>
          </div>
        </div>
      </div>

      <div className="my-10 flex flex-wrap justify-center gap-8">
        {imageLoading ? (
          <p className="text-lg font-semibold">Generating Images...</p>
        ) : !resultImageLoaded && preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-[300px] h-auto rounded shadow-lg"
          />
        ) : (
          images.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2">Generated Image</h3>
              <img
                src={image[0]}
                alt={`Generated ${index + 1}`}
                className="w-[300px] h-auto rounded shadow-lg"
              />
              <a
                href={image[0]}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300"
              >
                Download
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BgGen;
