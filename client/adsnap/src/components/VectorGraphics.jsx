import React from "react";
import axios from "axios";
import { useState } from "react";
import Navbar from "./Navbar";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Pointer } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
    }
    setImageLoading(true);
    try {
      const responce = await axios.post(
        "http://localhost:5000/features/vector-graphics",
        {
          prompt,
        }
      );
      console.log(responce.data);
      if (responce.data.success) {
        setImageUrls(responce.data.images);
        console.log(responce.data.images);
        toast.success("Images generated successfully..");
        setImageLoaded(true);
        setImageLoading(false);
      }
    } catch (error) {
      console.error("Error in Generating Images", error);
      toast.error("Something went wrong. try again later");
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center my-10">
        <div className=" flex gap-5 w-100 bg-blue">
          {imageUrls.map((item, index) => (
            <div key={index} className="my-4">
              <img
                src={item.urls[0]} // image URL
                alt={`Generated ${index + 1}`}
                className="w-140 h-auto mx-auto rounded shadow"
              />
              <a
                href={item.urls[0]}
                download={item.urls[0]} // file name
                className="text-blue-500 underline text-sm"
                target="_blank"
                style={{ cursor: Pointer }}
                rel="noopener noreferrer"
              >
                Download {item[2]}
              </a>
            </div>
          ))}
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
              placeholder="e.g. an eagle icon for feathers company the eagle body is brown and with thick beak with wings wide open"
              className="w-1/2 p-4 border border-gray-300 rounded-md mt-5 resize-none"
              rows={4}
            ></textarea>

            <button
              onClick={enhancePrompt}
              className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
            >
              {loading ? "Enhancing..." : "Enhance Prompt✨"}
            </button>

            <button
              className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300"
              onClick={generateImage}
            >
              {imageLoading ? "Generating..." : "Generate Images"}
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

            <button
              onClick={() => downloadAllImagesAsZip(imageUrls)}
              className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
            >
              Download All
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default VectorGraphics;
