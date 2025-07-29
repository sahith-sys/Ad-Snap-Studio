const GeneratedImage = ({ src, index }) => (
  <div className="flex flex-col items-center">
    <h3 className="text-lg font-semibold mb-2">Generated Image</h3>
    <img src={src} alt={`Generated ${index + 1}`} className="w-[300px] h-auto rounded shadow-lg" />
    <a
      href={src}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="bg-black text-white px-6 py-2 rounded-full mt-4 hover:bg-gray-800 transition"
    >
      Download
    </a>
  </div>
);
export default GeneratedImage;