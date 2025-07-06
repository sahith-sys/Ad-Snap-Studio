import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const enhancedPrompt = async () => {
    if (!prompt || !prompt.trim()) {
      toast.error("Prompt cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/features/prompt-enhance",
        {
          prompt: prompt,
        }
      );

      console.log(response.data);

      if (response.data.success) {
        setPrompt(response.data.data["prompt variations"]);
        toast.success("Prompt enhanced successfully.");
      } else {
        toast.error("Failed to enhance prompt.");
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("Failed to enhance prompt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    prompt,
    setPrompt,
    loading,
    setLoading,
    enhancedPrompt,
  };

  return (
    <AppContext.Provider value={{value}}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
