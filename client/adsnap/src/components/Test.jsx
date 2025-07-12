import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function Test() {
  const [noImages, setNoImages] = useState(2);
  const [type, setType] = useState("original");
  const [prompt, setPrompt] = useState("");
  const [optimize_description, setOptimizeDescription] = useState(false);
  const [ratio, setRatio] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [resultImages, setResultImages] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [manualPlacements, setManualPlacements] = useState(["upper_left"]);
  const placements = [
    "upper_left",
    "upper_right",
    "bottom_left",
    "bottom_right",
    "right_center",
    "left_center",
    "upper_center",
    "bottom_center",
    "center_vertical",
    "center_horizontal",
  ];

  function togglePlacement(placement) {
    setManualPlacements((prev) =>
      prev.includes(placement)
        ? prev.filter((p) => p !== placement)
        : [...prev, placement]
    );
  }

  async function generateLifeStyleShotByText() {
    if (!prompt || !prompt.trim()) {
      toast.error("Please enter a valid prompt to generate images.");
      return;
    }
    setImageLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/features/lifestyle-shot-by-text",
        {
          file: userImage,
          prompt,
          num_results: noImages,
          optimize_description,
          ratio,
          type,
        }
      );
      console.log("Generated images:", response.data);
      if (response.data.success) {
        setResultImages(response.data.data);
        toast.success("Images generated successfully!");
      }
    } catch (error) {
      console.error("Error generating images for you", error);
      toast.error(
        error.response?.data?.message || "Failed to generate images."
      );
    } finally {
      setImageLoading(false);
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

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  useEffect(() => {
    if (type !== "automatic_aspect_ratio") {
      setRatio(null);
    }
  }, [type]);

  return (
    <div>
      <div className="flex gap-20 justify-center mt-20">
        <div id="preview">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-120 mt-15 h-120 object-cover rounded-lg shadow-md"
            />
          )}
        </div>
        <div className="flex flex-col  bg-white w-140 m-15 p-5 rounded-lg shadow-xl">
          <h1 className="text-black text-lg" style={{ fontWeight: "bold" }}>
            Product Life style Shot by text
          </h1>
          <div className="mt-2">
            <p className="text-sm text-black-500 mt-1">
              Upload a product image (JPG, PNG)
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer text-gray-500 mt-2"
            />
            <p className="text-sm text-black-500 mt-1 mb-2">
              Enter Scene Description
            </p>
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="e.g. A cat riding a Bicycle"
              className="w-120 p-4 border border-gray-300 rounded-md resize-none"
              rows={3}
            ></textarea>
            <div className="flex items-center ">
              <div>
                <p className="text-sm text-black-500 mt-1">
                  Select number of images (up to 4)
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <Slider
                    value={[noImages]}
                    min={1}
                    max={4}
                    step={1}
                    className="mt-2 w-50 cursor-pointer"
                    onValueChange={([val]) => setNoImages(val)}
                  />
                  {noImages}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 ms-15">
                <Checkbox
                  id="terms"
                  checked={optimize_description}
                  onCheckedChange={setOptimizeDescription}
                />
                <Label htmlFor="terms">Optimize Description</Label>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mt-4">
                <p className="text-stone-600 ps-2 mb-2">Placement Type</p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-60 border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
                    {type}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-50">
                    {[
                      "original",
                      "automatic",
                      "automatic_aspect_ratio",
                      "manual_placement_selection",
                    ].map((r) => (
                      <DropdownMenuItem key={r} onSelect={() => setType(r)}>
                        {r}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {type === "automatic_aspect_ratio" && (
                <div className="mt-4 ms-20">
                  <p className="text-stone-600 ps-2 mb-2">Aspect Ratio</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-50 border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
                      {ratio != null ? ratio : "Select Ratio"}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      {[
                        "1:1",
                        "2:3",
                        "3:2",
                        "3:4",
                        "4:3",
                        "4:5",
                        "5:4",
                        "9:16",
                        "16:9",
                      ].map((r) => (
                        <DropdownMenuItem key={r} onSelect={() => setRatio(r)}>
                          {r}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {type === "manual_placement_selection" && (
                <div className="mt-4 ms-5">
                  <p className="text-stone-600 mb-2">Select Placement(s)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {placements.map((placement) => (
                      <div key={placement} className="flex items-center gap-2">
                        <Checkbox
                          id={placement}
                          checked={manualPlacements.includes(placement)}
                          onCheckedChange={() => togglePlacement(placement)}
                        />
                        <Label htmlFor={placement}>{placement}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <Button
                className="cursor-pointer mt-5 w-120 ms-1"
                onClick={generateLifeStyleShotByText}
                disabled={imageLoading}
              >
                {!imageLoading ? "Generate Images" : "Generating..."}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="my-15 flex gap-35 flex-wrap justify-center">
        {resultImages.map((image, index) => (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">Generated Image</h3>
            <img
              src={image[0]}
              alt={`Generated Image ${index + 1}`}
              className="w-[300px] h-auto rounded shadow-lg"
            />
            <a
              href={image[0]}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300 ml-4"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Test;
