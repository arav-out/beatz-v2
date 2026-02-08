import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useAuthToken } from "@/stores/useAuthtokenstore";

const TokenLoader = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const setToken = useAuthToken((s) => s.setToken);

  useEffect(() => {
    if (!isLoaded) return;

    const load = async () => {
      if (isSignedIn) {
        const token = await getToken();
        setToken(token || null);
      } else {
        setToken(null);
      }
    };

    load();
  }, [isSignedIn, isLoaded]);

  return null;
};

export default TokenLoader;
