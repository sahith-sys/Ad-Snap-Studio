import React from "react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
function ProductEditing() {
  {
    /* Global States */
  }
  const [userImage, setUserImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [option, setOption] = useState("Product Packshot");
  const [loading, setLoading] = useState(false);

  {
    /* Product Packshot States */
  }
  const [color, setColor] = useState("#FFFFFF");
  const [resultImage, setResultImage] = useState(null);

  {
    /* Product Shadow States */
  }
  const [shadowIntensity, setShadowIntensity] = useState(60);
  const [shadowType, setShadowType] = useState("regular");
  const [resultImage1, setResultImage1] = useState(null);

  {
    /* Life Style Product Shot by Text States */
  }
  const [noImages, setNoImages] = useState(2);
  const [type, setType] = useState("original");
  const [prompt, setPrompt] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);
  const [optimize_description, setOptimizeDescription] = useState(false);
  const [ratio, setRatio] = useState(null);
  const [resultImages, setResultImages] = useState([]);
  const [manualPlacements, setManualPlacements] = useState(["upper_center"]);
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

  {
    /* Function to handle image upload */
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

  {
    /* Function to generate Packshot */
  }
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
          bg_color: color,
        }
      );
      if (response.data.success) {
        setResultImage(response.data.data);
        toast.success("Packshot generated successfully!");
      }
    } catch (error) {
      console.error("Error generating Packshot");
      toast.error("An error occurred while generating the packshot.");
    } finally {
      setLoading(false);
    }
  }
  {
    /* Function to generate Product Shadow */
  }
  async function generateShadow() {
    if (userImage === null) {
      toast.error("Please upload image");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/features/generate-shadow",
        {
          file: userImage,
          shadow_type: shadowType,
          shadow_intensity: shadowIntensity,
          shadow_color: color,
        }
      );
      if (response.data.success) {
        setResultImage1(response.data.data);
        toast.success("Shadow generated successfully!");
      }
    } catch (error) {
      console.error("Error generating shadow");
      toast.error("An error occurred while generating the shadow.");
    } finally {
      setLoading(false);
    }
  }

  {
    /* Functions to generate Life Style Shot by Text */
  }
  function togglePlacement(placement) {
    setManualPlacements((prev) =>
      prev.includes(placement)
        ? prev.filter((p) => p !== placement)
        : [...prev, placement]
    );
  }
  useEffect(() => {
    if (type !== "automatic_aspect_ratio") {
      setRatio(null);
    }
  }, [type]);
  useEffect(() => {
    if (preview) {
      setPreview(null);
      setUserImage(null);
    }
  }, [option]);
  async function generateLifeStyleShotByText() {
    if (!prompt || !prompt.trim()) {
      toast.error("Please enter a valid prompt to generate images.");
      return;
    }
    setLoading(true);
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
          manual_placements: manualPlacements,
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
      setLoading(false);
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
      setPromptLoading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-20 justify-center mt-25">
        <div className="flex items-center justify-center  rounded-lg shadow-inner">
          {preview != null && (
            <img
              src={preview}
              alt="Preview"
              className="w-120 h-120 object-cover rounded-lg shadow-md"
            />
          )}
        </div>

        <div className="p-5 rounded-lg align-center border m-10 w-145 shadow-xl bg-white">
          <h1 className="text-2xl font-bold mb-2">Product Editing</h1>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-80 border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
              {option}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              {[
                "Product Packshot",
                "Product Shadow",
                "Life style product shot by Text",
              ].map((r) => (
                <DropdownMenuItem key={r} onSelect={() => setOption(r)}>
                  {r}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {option === "Product Packshot" && (
            <div className="m-0">
              <div className=" flex justify-center align-center mt-3 w-full mt-4">
                <div className="border p-4 rounded-lg w-full">
                  <p className="text-sm text-black-500 mt-1">
                    Upload a product image (JPG, PNG)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer text-gray-500 mt-2"
                  />
                </div>
                <div className="m-0 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mt-1">
                    Select a background color
                  </p>
                  <input
                    type="color"
                    className="cursor-pointer"
                    color={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="cursor-pointer mt-5 w-125 ms-1"
                onClick={generatePackshot}
                disabled={loading}
              >
                {!loading ? "Generate Background" : "Generating..."}
              </Button>
            </div>
          )}
          {option === "Product Shadow" && (
            <div className="mt-4">
              <div className="border p-4 rounded-lg">
                <p className="text-sm text-black-500 mt-1">
                  Upload a product image (JPG, PNG)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer text-gray-500 mt-2"
                />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mt-1">
                    Select Shadow color
                  </p>
                  <input
                    type="color"
                    className="cursor-pointer"
                    color={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
                <div className="p-4 ms-30">
                  <p>Select Shadow type</p>
                  <RadioGroup
                    defaultValue="regular"
                    onChange={(e) => setShadowType(e.target.value)}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="regular" id="r1" />
                      <Label htmlFor="r1">Regular</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="float" id="r2" />
                      <Label htmlFor="r2">Float</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-stone-600 ps-2">Shadow Intensity</p>
                <div className="flex">
                  <Slider
                    value={[shadowIntensity]}
                    min={0}
                    max={100}
                    step={2}
                    className="mt-4 ms-2 w-70 cursor-pointer"
                    onValueChange={([val]) => setShadowIntensity(val)}
                  />
                  <div className="mt-2 ms-4">{shadowIntensity}</div>
                </div>
              </div>
              <Button
                className="cursor-pointer mt-7 w-125 ms-1"
                onClick={generateShadow}
                disabled={loading}
              >
                {!loading ? "Generate Shadow" : "Generating..."}
              </Button>
            </div>
          )}
          {option === "Life style product shot by Text" && (
            <div>
              <div className="mt-2">
                <div className="border p-4 rounded-lg w-120">
                  <p className="text-sm text-black-500 mt-1">
                    Upload a product image (JPG, PNG)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer text-gray-500 mt-2"
                  />
                </div>
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
                          "manual_placement",
                        ].map((r) => (
                          <DropdownMenuItem key={r} onSelect={() => setType(r)}>
                            {r}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {type === "automatic_aspect_ratio" && (
                    <div className="mt-4 ms-10">
                      <p className="text-stone-600 ps-2 mb-2">Aspect Ratio</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-60 border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
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
                            <DropdownMenuItem
                              key={r}
                              onSelect={() => setRatio(r)}
                            >
                              {r}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  {type === "manual_placement" && (
                    <div className="mt-4 ms-10">
                      <p className="text-stone-600 mb-2">Select Placement(s)</p>
                      <div className="grid grid-cols-2 gap-2">
                        {placements.map((placement) => (
                          <div
                            key={placement}
                            className="flex items-center gap-2"
                          >
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
                    className="cursor-pointer mt-5 w-130 ms-1"
                    onClick={generateLifeStyleShotByText}
                    disabled={loading}
                  >
                    {!loading ? "Generate Images" : "Generating..."}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {option === "Life style product shot by Text" && (
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
      )}
      {option === "Product Packshot" && (
        <div className="my-15 flex gap-35 flex-wrap justify-center">
          {resultImage && (
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2">Generated Image</h3>
              <img
                src={resultImage}
                alt="Generated Image"
                className="w-[300px] h-auto rounded shadow-lg"
              />
              <a
                href={resultImage}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300 ml-4"
              >
                Download
              </a>
            </div>
          )}
        </div>
      )}
      {option === "Product Shadow" && (
        <div className="my-15 flex gap-35 flex-wrap justify-center">
          {resultImage1 && (
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2">Generated Image</h3>
              <img
                src={resultImage1}
                alt="Generated Image"
                className="w-[300px] h-auto rounded shadow-lg"
              />
              <a
                href={resultImage1}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300 ml-4"
              >
                Download
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductEditing;
