import { useMoralis } from "react-moralis";

export const useAuth = () => {
  const { isAuthenticated } = useMoralis();

  return {
    isAuthenticated,
  };
};
