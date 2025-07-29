import React from "react";
import axios from "axios";
import { useState } from "react";
import Navbar from "./Navbar";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Pointer } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";

function VectorGraphics() {
  const [prompt, setPrompt] = useState("");
  const [enhancedprompt, setEnhancedPrompt] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  async function downloadAllImagesAsZip(imageUrls) {
    if (!imageUrls.length) return;

    const zip = new JSZip();
    const folder = zip.folder("vector_images");

    for (let i = 0; i < imageUrls.length; i++) {
      const [url, , filename] = imageUrls[i];
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        folder.file(filename || `image_${i + 1}.jpg`, blob);
      } catch (err) {
        console.error(`Failed to download image ${url}`, err);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "vector_graphics.zip");
    });
  }

  const enhancePrompt = async () => {
    if (!prompt) {
      toast.error("Please Enter the Prompt to enhance");
    }
    setLoading(true);
    try {
      const responce = await axios.post(
        "http://localhost:5000/features/prompt-enhance",
        {
          prompt,
        }
      );
      console.log(responce.data);
      if (responce.data.success) {
        setPrompt(responce.data.data["prompt variations"]);
      }
    } catch (error) {
      console.error("Error enhancing prompt", error);
      toast.error("Failed to enhance prompt. Please try again");
    } finally {
      setLoading(false);
    }
  };

  async function generateImage() {
    if (!prompt) {
      toast.error("Please enter the prompt to generate");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if(!token){
        toast.error("User Login Required");
        return;
      }
      setImageLoading(true);
      const responce = await axios.post(
        "http://localhost:5000/features/vector-graphics",
        {
          prompt,
        },
        {
          headers:{
            token: token,
          },
        },
      );
      console.log(responce.data);
      if (responce.data.success) {
        setImageUrls(responce.data.images);
        console.log(responce.data.images);
        toast.success("Images generated successfully..");
        setImageLoaded(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in Generating Images", error);
      toast.error("Something went wrong. try again later");
    }
  }

  return (
    <>
  <div className="bg-white w-full max-w-140 mx-auto my-10 p-6 rounded-lg shadow-xl">
    <h1 className="text-xl font-bold">Vector Graphics</h1>
    <p className="text-gray-600 mt-2">
      Generate stunning vector graphics from text prompts.
    </p>
    <textarea
      name="prompt"
      id="prompt"
      placeholder="Enter your prompt here..."
      className="w-full p-2 border border-gray-300 rounded-md mt-2 resize-none"
      rows={4}
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
    ></textarea>
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2">
      <Button onClick={enhancePrompt} className="w-full sm:w-1/2">
        <ClipLoader
          color="#ffffffff"
          className=""
          loading={loading}
          cssOverride={{ display: "block" }}
          speedMultiplier={1}
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        {!loading ? "Enhance Prompt" : "Enhancing..."}
      </Button>
      <Button onClick={generateImage} className="w-full sm:w-1/2 mt-2 sm:mt-0">
        {imageLoading && (
          <ClipLoader
            color="#ffffffff"
            className=""
            loading={imageLoading}
            cssOverride={{ display: "block" }}
            speedMultiplier={1}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
        {imageLoading ? "Generating Image" : "Generate Image"}
      </Button>
    </div>
  </div>

  {imageLoaded && imageUrls.length > 0 && (
    <div className="flex flex-wrap gap-6 justify-center px-4">
      {imageUrls.map((item, index) => (
        <div key={index} className="my-4 max-w-xs w-full">
          <img
            src={item.urls[0]}
            alt={`Generated ${index + 1}`}
            className="w-full h-auto mx-auto mb-3 rounded shadow"
          />
          <a
            href={item.urls[0]}
            download
            className="text-white bg-black px-6 py-2 mt-5 rounded text-sm block text-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  )}
</>

  );
}

export default VectorGraphics;
