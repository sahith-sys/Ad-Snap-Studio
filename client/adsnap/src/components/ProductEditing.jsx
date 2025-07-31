import React from "react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";
import GeneratedImage from "./GeneratedImage";
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

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to generate images.");
        return;
      }
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/features/product-packshot`,
        {
          file: userImage,
          bg_color: color,
        },
        {
          headers: {
            token: token,
          },
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

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to generate images.");
        return;
      }
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/features/generate-shadow`,
        {
          file: userImage,
          shadow_type: shadowType,
          shadow_intensity: shadowIntensity,
          shadow_color: color,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.data.success) {
        setResultImage1(response.data.data);
        toast.success("Shadow generated successfully!");
      }
    } catch (error) {
      console.log("Error generating shadow:", error);
      toast.error(
        error.message || "An error occurred while generating the shadow."
      );
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

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to generate images.");
        return;
      }
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/features/lifestyle-shot-by-text`,
        {
          file: userImage,
          prompt,
          num_results: noImages,
          optimize_description,
          ratio,
          type,
          manual_placements: manualPlacements,
        },
        {
          headers: {
            token: token,
          },
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

  return (
    <div className="px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row gap-10 justify-center mt-10">
        {/* Preview Image */}
        <div className="flex justify-center">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full max-w-[300px] h-auto object-cover rounded-lg shadow-md"
            />
          )}
        </div>

        {/* Options Panel */}
        <div className="p-5 rounded-lg border shadow-xl bg-white w-full max-w-130">
          <h1 className="text-2xl font-bold mb-4">Product Editing</h1>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
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
            <div className="mt-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 border p-4 rounded-lg">
                  <p className="text-sm">Upload a product image (JPG, PNG)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2 text-gray-500"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm">Select background color</p>
                  <input
                    type="color"
                    className="mt-2 w-12 h-10"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={generatePackshot}
                disabled={loading}
              >
                {!loading ? "Generate Background" : "Generating..."}
              </Button>
            </div>
          )}

          {option === "Product Shadow" && (
            <div className="mt-4 space-y-4">
              <div className="border p-4 rounded-lg">
                <p className="text-sm">Upload a product image (JPG, PNG)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2 text-gray-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div>
                  <p className="text-sm">Select Shadow color</p>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
                <div>
                  <p>Select Shadow type</p>
                  <RadioGroup
                    defaultValue="regular"
                    onChange={(e) => setShadowType(e.target.value)}
                  >
                    <div className="flex items-center gap-2 mt-2">
                      <RadioGroupItem value="regular" id="r1" />
                      <Label htmlFor="r1">Regular</Label>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <RadioGroupItem value="float" id="r2" />
                      <Label htmlFor="r2">Float</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div>
                <p className="text-sm">Shadow Intensity</p>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[shadowIntensity]}
                    min={0}
                    max={100}
                    step={2}
                    onValueChange={([val]) => setShadowIntensity(val)}
                    className="w-full max-w-md"
                  />
                  <span>{shadowIntensity}</span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={generateShadow}
                disabled={loading}
              >
                {!loading ? "Generate Shadow" : "Generating..."}
              </Button>
            </div>
          )}

          {option === "Life style product shot by Text" && (
            <div className="mt-4 space-y-4">
              <div className="border p-4 rounded-lg">
                <p className="text-sm">Upload a product image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2 text-gray-500"
                />
              </div>
              <textarea
                className="w-full p-3 border rounded-md"
                placeholder="e.g. A cat on a table"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <Slider
                    value={[noImages]}
                    min={1}
                    max={4}
                    step={1}
                    onValueChange={([val]) => setNoImages(val)}
                    className="w-40"
                  />
                  <span>{noImages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="optimize"
                    checked={optimize_description}
                    onCheckedChange={setOptimizeDescription}
                  />
                  <Label htmlFor="optimize">Optimize Description</Label>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full">
                  <p className="text-sm mb-2">Placement Type</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
                      {type}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-60">
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
                  <div className="w-full">
                    <p className="text-sm mb-2">Aspect Ratio</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
                        {ratio || "Select Ratio"}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-60">
                        {["1:1", "2:3", "3:2", "4:3", "16:9"].map((r) => (
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
                  <div className="w-full">
                    <p className="text-sm mb-2">Manual Placements</p>
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

              <Button
                className="w-full mt-2"
                onClick={generateLifeStyleShotByText}
                disabled={loading}
              >
                {!loading ? "Generate Images" : "Generating..."}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Generated Results */}
      <div className="my-10 flex flex-wrap justify-center gap-8">
        {option === "Life style product shot by Text" &&
          resultImages.map((img, idx) => (
            <GeneratedImage key={idx} src={img[0]} index={idx} />
          ))}

        {option === "Product Packshot" && resultImage && (
          <GeneratedImage src={resultImage} index={0} />
        )}

        {option === "Product Shadow" && resultImage1 && (
          <GeneratedImage src={resultImage1} index={0} />
        )}
      </div>
    </div>
  );
}

export default ProductEditing;
