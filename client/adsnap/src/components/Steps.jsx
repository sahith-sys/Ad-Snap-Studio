import { Pencil, Sparkles, Download } from "lucide-react";
import { delay, motion } from "motion/react";

export default function Steps() {
  const steps = [
    {
      icon: <Pencil className="w-6 h-6 text-indigo-600" />,
      title: "Describe Your Vision",
      description:
        "Start with your imagination. Type a phrase, sentence, or detailed description of the image you want to bring to life.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      title: "Watch AI Work Its Magic",
      description:
        "Our advanced AI engine instantly enhances your prompt, generates high-quality visuals, and gives you full control to customize your image.",
    },
    {
      icon: <Download className="w-6 h-6 text-green-600" />,
      title: "Download, Edit & Share",
      description:
        "Download your creation, edit it with powerful AI tools, or share your stunning visuals directly from our platform.",
    },
  ];

  return (
    <section className="py-16 px-4 ">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-gray-500 mb-12">
          Create, Edit, and Elevate Images with AI-Powered Simplicity
        </p>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-start bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300 cursor-pointer"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="mr-4">{step.icon}</div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
