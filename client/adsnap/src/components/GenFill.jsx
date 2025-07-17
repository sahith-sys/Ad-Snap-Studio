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
    console.log("Payload for Generative Fill:", payload);

    try {
      const res = await axios.post(
        "http://localhost:5000/features/generative-fill",
        payload
      );
      const resultUrl = res.data;
      if (resultUrl.success) {
        console.log("Setting result URL:", resultUrl);
        setResultImage(resultUrl.images);
      } else {
        console.error("Result URL missing");
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
          className="relative my-4 max-w-full max-h-[600px] mx-auto rounded overflow-hidden bg-gray-100"
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
            className="max-w-full max-h-[600px] mx-auto rounded"
          />
          <div className="absolute top-0 left-0 pointer-events-auto max-w-full max-h-[600px] mx-auto rounded">
            <ReactSketchCanvas
              ref={canvasRef}
              width={imageSize.width}
              height={imageSize.height}
              strokeWidth={stroke}
              strokeColor="white"
              canvasColor="transparent"
              withTimestamp={false}
              style={{
                pointerEvents: "auto",
              }}
            />
          </div>
          <div className="mt-2">
            <p className="text-stone-600 ps-2">Shadow Intensity</p>
            <div className="flex">
              <Slider
                value={[stroke]}
                min={0}
                max={100}
                step={2}
                className="mt-4 ms-2 w-70 cursor-pointer"
                onValueChange={([val]) => setStroke(val)}
              />
              <div className="mt-2 ms-4">{stroke}</div>
            </div>
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
  );
}

export default GenFill;
