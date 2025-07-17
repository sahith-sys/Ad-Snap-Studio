import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const value = {
    user,
    setUser,
    credits,
    setCredits,
  };

  useEffect(() => {
    const handleCredits = async () => {
      try {
        const resp = await axios.post(
          "http://localhost:5000/user/credits",
          {},
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        if (resp.data.success) {
          setCredits(resp.data.credits);
        }
      } catch (error) {
        console.log("Error fetching credits:", error);
      }
    };
    handleCredits();
  }, []);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
