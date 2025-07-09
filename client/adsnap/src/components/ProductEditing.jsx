import React from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { useState } from "react";
import { toast } from "react-toastify";
function ProductEditing() {
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [resultImageLoaded, setResultImageLoaded] = useState(false);

  async function generatePackshot() {
    if (userImage === null) {
      toast.error("Please upload image");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/features/product-packshot",
        {
          file: userImage,
          bg_color: "#FFFFFF",
        }
      );
      if (response.data.success) {
        setResultImage(response.data.data);
        setResultImageLoaded(true);
        toast.success("Packshot generated successfully!");
      }
    } catch (error) {
      console.error("Error generating Packshot");
      toast.error("An error occurred while generating the packshot.");
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const base64 = await convertToBase64(file);
      const pureBase64 = base64.split(",")[1];
      setUserImage(pureBase64);
    }
  }
  function convertToBase64(files) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[200px] mt-25 p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className=""
      />
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={generatePackshot}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 hover:shadow-xl transition-colors duration-300 cursor-pointer"
        >
          {loading ? "Generating..." : "Generate Packshot"}
        </button>
      </div>

      <div className="my-15 flex gap-35 flex-wrap justify-center">
        {/* User Uploaded Image */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Original Image</h3>
          <img
            src={
              preview
                ? preview
                : "https://bria.ai/hs-fs/hubfs/BRIA_LP_Ecommers_new-03-1.png?width=846&height=375&name=BRIA_LP_Ecommers_new-03-1.png"
            }
            alt="Preview"
            className="w-[300px] h-auto rounded shadow-lg"
          />
        </div>

        {/* Generated Image */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Generated Background</h3>
          {loading ? (
            <Skeleton
              width={300}
              height={80}
              count={4}
              baseColor="#FFFFFF"
              highlightColor="#e4e4e4"
            />
          ) : (
            <img
              src={
                resultImageLoaded
                  ? resultImage
                  : "https://bria.ai/hs-fs/hubfs/BRIA_LP_Ecommers_new-03-1.png?width=846&height=375&name=BRIA_LP_Ecommers_new-03-1.png"
              }
              alt="Generated Result"
              className="w-[300px] h-auto rounded shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductEditing;
