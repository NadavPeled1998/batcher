import { Button, Flex, FormLabel, Input } from "@chakra-ui/react";
import { Outlet } from "react-location";
import { Layers } from "react-feather";

export const Home = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
