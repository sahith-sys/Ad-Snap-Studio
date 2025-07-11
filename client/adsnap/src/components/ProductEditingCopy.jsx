import React from "react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@/components/ui/button";
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
function ProductEditingCopy() {
  const [color, setColor] = useState("#FFFFFF");
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [resultImageLoaded, setResultImageLoaded] = useState(false);
  const [option, setOption] = useState("Product Packshot");
  const [prompt, setPrompt] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);

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
    <div>
      <div className="flex rounded-lg align-center border mt-10 w-140 shadow-xl h-95 mx-90 bg-white">
        <div className="px-6 mt-3 w-full m-0">
          <h1 className="text-2xl font-bold mb-2">Product Editing</h1>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-50 border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
              {option}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              {[
                "Product Packshot",
                "Product Shadow",
                "Life style product shot by Text",
                "Life style product shot by Image",
              ].map((r) => (
                <DropdownMenuItem key={r} onSelect={() => setOption(r)}>
                  {r}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {option === "Product Packshot" && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mt-1">
                Upload a product image (JPG, PNG)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
              <input type="color" />
            </div>
          )}
          {option === "Product Shadow" && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mt-1">
                Upload a product image (JPG, PNG)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
              <input type="color" />
              <RadioGroup defaultValue="regular">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="regular" id="r1" />
                  <Label htmlFor="r1">Regular</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="float" id="r2" />
                  <Label htmlFor="r2">Float</Label>
                </div>
              </RadioGroup>
              <p className="text-stone-600 ps-2">
                Shadow Intensity
              </p>
              <Slider
                value={[shadowIntensity]}
                min={0}
                max={100}
                step={2}
                className="mt-4 w-70 cursor-pointer"
                onValueChange={([val]) => setShadowIntensity(val)}
              />
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="e.g. A cat riding a Bicycle"
              className="w-120 p-4 mt-2 border border-gray-300 rounded-md resize-none"
              rows={3}
            ></textarea>
            <Button
              variant="secondary"
              className="border border-gray-300 hover:text-white hover:bg-black transistion-all duration-500 cursor-pointer mt-2"
              onClick={enhancedPrompt}
            >
              {promptLoading ? "Enhancing..." : "Enhance Prompt✨"}
            </Button>
          </div>
          <div>
            <div className="w-100 flex align-center justify-between mt-2">
              <p className="text-stone-600 ps-2">
                Select no. of Images (upto 4)
              </p>
              <Slider
                value={[noImages]}
                min={1}
                max={4}
                step={1}
                className="mt-4 w-70 cursor-pointer"
                onValueChange={([val]) => setNoImages(val)}
              />
              <div className="mt-4 ms-4">{noImages}</div>
            </div>

            <Button
              className="cursor-pointer mt-5 w-125 ms-1"
              onClick={generateBackground}
            >
              {!imageLoading ? "Generate Background" : "Generating..."}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className="my-15 flex gap-35 flex-wrap justify-center">
          {imageLoading ? (
            <p className="text-lg font-semibold">Generating Images...</p>
          ) : preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-[300px] h-auto rounded shadow-lg"
            />
          ) : (
            images.map((image, index) => (
              <div key={index} className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Generated Image</h3>
                <img
                  src={image[0]}
                  alt={`Generated ${index + 1}`}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductEditingCopy;
