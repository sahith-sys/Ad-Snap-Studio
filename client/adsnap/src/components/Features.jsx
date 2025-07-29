import React from "react";
import { Link } from "react-router-dom";

function Features() {
  const features = [
    {
      id: 1,
      title: "HD Image Generation",
      description:
        "Generate high-quality, stunning images from your enhanced text prompts with full control over resolution, aspect ratio, and style.",
      icon: "Image",
      link: "/imggen",
    },
    {
      id: 2,
      title: "Background Generation",
      description:
        "Easily generate stunning backgrounds with a single click using advanced AI techniques.",
      icon: "ImagePlus",
      link: "/bggen",
    },
    {
      id: 3,
      title: "Product Packshot Creator",
      description:
        "Quickly create professional product packshots with customizable shadows, clean backgrounds, and perfect framing.",
      icon: "Box",
      link: "/product-editing",
    },
    {
      id: 4,
      title: "Lifestyle Shot Generator",
      description:
        "Place your product in various environments using text prompts or reference images to create unique, marketing-ready visuals.",
      icon: "Camera",
      link: "/product-editing",
    },
    {
      id: 5,
      title: "Generative Fill",
      description:
        "Modify or add parts of an image seamlessly using AI-powered inpainting tools for creative freedom.",
      icon: "Brush",
      link: "/coming-soon",
    },
    {
      id: 6,
      title: "Vector Graphics",
      description:
        "Create and edit vector graphics or logos with precision using our advanced tools.",
      icon: "VectorSquare",
      link: "/vector-graphics",
    },
  ];

  return (
    <section id="features">
      <div className="my-10 px-4 sm:px-10 md:px-14 lg:px-28">
        <div className="flex flex-col items-center justify-center text-center my-10">
          <div className="bg-white p-2 rounded-full border border-neutral-500 px-7 mb-8">
            Explore Our Features
          </div>
          <h1 className="text-4xl font-bold mb-5">Why Choose AdSnap?</h1>
          <p className="text-xl mb-5">
            Discover the powerful features that make AdSnap your go-to AI image
            generation tool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
          {features.map((feature) => (
            <div
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              key={feature.id}
            >
              <h2 className="text-2xl font-semibold mb-4">{feature.title}</h2>
              <p>{feature.description}</p>
              <Link to={feature.link}>
                <button className="bg-black text-white my-3 w-20 rounded-full py-1 cursor-pointer">
                  Try✨
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
