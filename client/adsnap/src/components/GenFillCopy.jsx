import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import html2canvas from "html2canvas";
import axios from "axios";
import { Slider } from "@/components/ui/slider";

function GenFill() {
  const [imageBase64, setImageBase64] = useState(null);
  const [maskBase64, setMaskBase64] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [resultImage, setResultImage] = useState([]);
  const canvasWrapperRef = useRef(null);
  const canvasRef = useRef();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);
  const [stroke, setStroke] = useState(10);
  const [isDirty, setIsDirty] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const captureMask = async () => {
    if (!canvasWrapperRef.current) return;
    const canvasImage = await html2canvas(canvasWrapperRef.current, {
      backgroundColor: "#000",
      useCORS: true,
    });
    const dataURL = canvasImage.toDataURL("image/png");
    const maskbase64 = dataURL.split(",")[1];
    setMaskBase64(maskbase64);
    return maskbase64;
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
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/features/generative-fill`,
        payload
      );
      const resultUrl = res.data;
      if (resultUrl.success) {
        setResultImage(resultUrl.images);
      } else {
        console.error("Result URL missing");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      alert("Something went wrong. Try again later");
    } finally {
      setLoading(false);
    }
  };

  const clearMask = () => {
    canvasRef.current.clearCanvas();
    setIsDirty(false);
  };

  const handleReset = () => {
    setImageBase64(null);
    setPrompt("");
    setResultImage([]);
    setMaskBase64(null);
    setImageSize({ width: 0, height: 0 });
    clearMask();
  };

  return (
    <>
      <div className="p-4 flex flex-col md:flex-row max-w-6xl justify-center mx-auto gap-15">
        <div>
          {imageBase64 && (
            <div
              ref={canvasWrapperRef}
              className="relative my-4 max-w-full mx-auto rounded overflow-hidden bg-gray-100"
              style={{
                width: `${imageSize.width}px`,
                height: `${imageSize.height}px`,
              }}
            >
              <img
                src={imageBase64}
                alt="input"
                onLoad={(e) => {
                  const maxWidth = 600;
                  const ratio = e.target.naturalWidth / e.target.naturalHeight;
                  const width =
                    e.target.naturalWidth > maxWidth
                      ? maxWidth
                      : e.target.naturalWidth;
                  setImageSize({
                    width,
                    height: width / ratio,
                  });
                }}
                className="max-w-full mx-auto rounded"
              />
              <div className="absolute top-0 left-0 pointer-events-auto mx-auto rounded">
                <ReactSketchCanvas
                  ref={canvasRef}
                  width={imageSize.width}
                  height={imageSize.height}
                  strokeWidth={stroke}
                  strokeColor="white"
                  canvasColor="transparent"
                  withTimestamp={false}
                  onStroke={() => setIsDirty(true)}
                  style={{
                    pointerEvents: "auto",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4  mt-10 bg-white p-4 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold">Bria Generative Fill</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-2"
          />
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            className="border p-2 w-full h-24 resize-none"
            placeholder="Enter prompt here..."
            rows={3}
            value={prompt}
          ></textarea>
          {imageBase64 && (
            <div className="mt-4">
              <p className="text-stone-600 ps-2">Stroke Width</p>
              <div className="flex items-center">
                <Slider
                  value={[stroke]}
                  min={1}
                  max={100}
                  step={2}
                  className="mt-2 ms-2 w-[200px] md:w-[300px] cursor-pointer"
                  onValueChange={([val]) => setStroke(val)}
                />
                <div className="mt-2 ms-4 font-semibold text-sm">{stroke}</div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
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
              disabled={!isDirty}
              className={`px-4 py-2 rounded text-white ${
                !isDirty
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-600"
              }`}
            >
              Clear Mask
            </button>

            <button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      <div className="px-4">
        {resultImage.length > 0 && (
          <div className="mt-6 max-w-6xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">Result Images:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {resultImage.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Result ${index + 1}`}
                  className="w-full h-auto rounded shadow"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default GenFill;
