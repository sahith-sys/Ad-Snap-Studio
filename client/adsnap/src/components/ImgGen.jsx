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
    console.log(prompt, ratio, medium, noImages);
    if (!prompt || !prompt.trim()) {
      toast.error("Please enter a valid prompt to generate images.");
      return;
    }
    setImageLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to generate images.");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/features/img-generation",
        {
          prompt: prompt,
          aspect_ratio: ratio,
          medium: medium,
          num_results: noImages,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      console.log(response.data.data.result);
      if (response.data.success) {
        setImages(response.data.data.result);
        setPrompt("");
        toast.success("Images generated successfully..");
        toast.success("Please wait for a few seconds to load the image.");
      }
    } catch (error) {
      console.error("Error generating image", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setImageLoading(false);
      setImageLoaded(true);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row rounded-lg border mt-20 w-full max-w-140 shadow-xl p-6 mx-auto bg-[#FFFFFF]">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4">Image Generation</h1>

          <div className="flex flex-col gap-3">
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="e.g. A cat riding a Bicycle"
              className="w-full p-4 border border-gray-300 rounded-md resize-none"
              rows={3}
            ></textarea>

            <Button
              variant="secondary"
              className="border border-gray-300 hover:text-white hover:bg-black transition-all duration-500 cursor-pointer"
              onClick={enhancedPrompt}
            >
              {loading ? "Enhancing..." : "Enhance Prompt✨"}
            </Button>
          </div>

          <div className="mt-6">
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-stone-600">Select no. of Images (up to 4)</p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Slider
                  value={[noImages]}
                  min={1}
                  max={4}
                  step={1}
                  className="w-full sm:w-72 cursor-pointer"
                  onValueChange={([val]) => setNoImages(val)}
                />
                <div>{noImages}</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-6 mt-6">
              <div className="w-full md:w-1/2">
                <p className="text-stone-600 mb-2">Aspect Ratio</p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
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

              <div className="w-full md:w-1/2">
                <p className="text-stone-600 mb-2">Style</p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full border rounded-md py-2 px-4 bg-gray-50 text-center cursor-pointer">
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
              className="cursor-pointer mt-6 w-full"
              onClick={generateImage}
            >
              {!imageLoading ? "Generate Images" : "Generating..."}
            </Button>
          </div>
        </div>
      </div>

      <div className="my-10 flex flex-wrap gap-10 justify-center">
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
                className="bg-black text-white px-6 py-2 rounded-full mt-5 hover:bg-gray-800 transition-colors duration-300"
              >
                Download
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ImgGen_copy;
