import { useMoralis } from "react-moralis";

export const useAuth = () => {
  const {
    authenticate: moralisAuthenticate,
    isAuthenticated,
    logout,
  } = useMoralis();

  const authenticate = async () => {
    const token = await moralisAuthenticate();
  };
  return {
    authenticate,
    isAuthenticated,
  };
};
