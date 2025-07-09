import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import html2canvas from "html2canvas";
import axios from "axios";

function GenFill() {
  const [imageBase64, setImageBase64] = useState(null);
  const [maskBase64, setMaskBase64] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const canvasWrapperRef = useRef(null);
  const canvasRef = useRef();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const captureMask = async () => {
    if (!canvasWrapperRef.current) return;

    const canvasImage = await html2canvas(canvasWrapperRef.current, {
      backgroundColor: "#000",
      useCORS: true,
    });
    const dataURL = canvasImage.toDataURL("image/png");
    setMaskBase64(dataURL);
    return dataURL;
  };

  const handleSubmit = async () => {
    if (!imageBase64 || !prompt) {
      alert("Please upload image and enter prompt");
      return;
    }
    setLoading(true);
    const maskData = await captureMask();

    const payload = {
      file: imageBase64,
      mask_file: maskData,
      prompt,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/features/generative-fill",
        payload
      );
      const resultUrl = res.data.images[0];
      if (resultUrl) {
        console.log("✅ Setting result URL:", resultUrl);
        setResultImage(resultUrl);
      } else {
        console.error("❌ Result URL missing");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      toast.error("Something went wrong. Try again later");
    } finally {
      setLoading(false);
    }
  };

  const clearMask = () => {
    canvasRef.current.clearCanvas();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Bria Generative Fill</h2>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {imageBase64 && (
        <div
          ref={canvasWrapperRef}
          className="relative my-4"
          style={{
            width: `${imageSize.width}px`,
            height: `${imageSize.height}px`,
          }}
        >
          <img
            src={imageBase64}
            alt="input"
            onLoad={(e) => {
              setImageSize({
                width: e.target.naturalWidth,
                height: e.target.naturalHeight,
              });
            }}
            className=""
          />
          <div className="absolute top-0 left-0 pointer-events-auto">
            <ReactSketchCanvas
              ref={canvasRef}
              width={imageSize.width}
              height={imageSize.height}
              strokeWidth={20}
              strokeColor="white"
              canvasColor="transparent"
              withTimestamp={false}
              style={{
                pointerEvents: "auto",
              }}
            />
          </div>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter prompt (e.g., 'a red balloon')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border p-2 w-full max-w-lg mb-2"
        />
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-700" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          <button
            onClick={clearMask}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Mask
          </button>
        </div>
      </div>

      {resultImage && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Generated Output</h3>
          <img
            src={resultImage}
            alt="Result"
            onError={() => console.error("⚠️ Failed to load result image")}
            className="w-[512px] rounded shadow"
          />
        </div>
      )}
    </div>
  );
}

export default GenFill;
