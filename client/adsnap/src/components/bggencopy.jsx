import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import default_bggen from "../assets/default_bggen.jpg";
import default_bggen_2 from "../assets/default_bggen_2.jpg";
import { useContext } from "react";
import { AppContext } from "./AppContext";

const BgGen = () => {
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [resultImageLoaded, setResultImageLoaded] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [prompt, setPrompt] = useState("");

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));

      await convertToBase64(file).then((base64) => {
        const pureBase64 = base64.split(",")[1];
        setUserImage(pureBase64);
      });
    }
  }

  function convertToBase64(file){
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };


  const generateBackground = async () => {
    if (!userImage) {
      toast.error("Please upload an image first.");
      return;
    }
    if( !prompt || !prompt.trim()){
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/features/bg-generation",
        {prompt: prompt, file: userImage,});

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
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[200px] mt-25 p-4">
      <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className=""
        />
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="e.g. in a parking lot"
              className="w-100 h-20 p-4 border border-gray-300 rounded-md mt-5 resize-none"
              rows={4}
            ></textarea>
        <button
          onClick={generateBackground}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 hover:shadow-xl transition-colors duration-300 cursor-pointer"
        >
          {loading ? "Generating..." : "Generate Background"}
        </button>
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
        <div>
          <h3 className="text-lg font-semibold mb-2">Generated Background</h3>
          {loading ? (
            <Skeleton width={300} height={80} count={4} baseColor="#FFFFFF" highlightColor="#e4e4e4" />
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
  );
};

export default BgGen;
