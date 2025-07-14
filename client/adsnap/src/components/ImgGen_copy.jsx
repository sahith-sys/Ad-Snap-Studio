import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { toast } from "react-toastify";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function ImgGen_copy() {
  const [noImages, setNoImages] = useState(2);
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [medium, setMedium] = useState("photography");
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const enhancedPrompt = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/features/prompt-enhance",
        { prompt: prompt }
      );
      console.log(response.data);
      if (response.data.success) {
        setPrompt(response.data.data["prompt variations"]);
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("Failed to enhance prompt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    setImageLoading(true);
    console.log(prompt, ratio, medium, noImages);
    if (!prompt || !prompt.trim()) {
      toast.error("Please enter a valid prompt to generate images.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/features/img-generation",
        {
          prompt: prompt,
          aspect_ratio: ratio,
          medium: medium,
          num_results: noImages,
        }
      );
      console.log(response.data.data.result);
      if (response.data.success) {
        setImages(response.data.data.result);
        toast.success("Images generated successfully..");
        toast.success("Please wait for a few seconds to load the image.");
      }
    } catch (error) {
      console.error("Error generating image", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setImageLoading(false);
      setPrompt("");
      setImageLoaded(true);
    }
  };

  return (
    <div>
      <div className="flex rounded-lg align-center border mt-20 w-140 shadow-xl h-115 mx-90 bg-[#FFFFFF]">
        <div className="px-6 mt-3 w-full m-0">
          <h1 className="text-2xl font-bold mb-4">Image Generation</h1>
          <div>
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="e.g. A cat riding a Bicycle"
              className="w-120 p-4 border border-gray-300 rounded-md resize-none"
              rows={3}
            ></textarea>
            <Button
              variant="secondary"
              className="border border-gray-300 hover:text-white hover:bg-black transistion-all duration-500 cursor-pointer mt-2"
              onClick={enhancedPrompt}
            >
              {loading ? "Enhancing..." : "Enhance Prompt✨"}
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
            <div className="flex  mt-4">
              <div className="mt-4">
                <p className="text-stone-600 ps-2 mb-2">Aspect Ratio</p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-50 border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
                    {ratio}
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
              <div className="mt-4 ms-20">
                <p className="text-stone-600 ps-2 mb-2">Style</p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-50 border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
                    {medium}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    {["photography", "art"].map((m) => (
                      <DropdownMenuItem key={m} onSelect={() => setMedium(m)}>
                        {m}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Button
              className="cursor-pointer mt-5 w-125 ms-1"
              onClick={generateImage}
            >
              {!imageLoading ? "Generate Images" : "Generating..."}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className="my-15 flex gap-35 flex-wrap justify-center">
          {imageLoading ? (
            <p className="text-lg font-semibold">Generating Images...</p>
          ) : (
            images.map((image, index) => (
              <div key={index} className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Generated Image</h3>
                <img
                  src={image.urls[0]}
                  alt={`Generated ${index + 1}`}
                  className="w-[300px] h-auto rounded shadow-lg"
                />
                <a
                  href={image.urls[0]}
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

export default ImgGen_copy;
