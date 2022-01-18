import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { ChevronsDown, PlusCircle } from "react-feather";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";
import { LottieArrowDown } from "../assets/lottie-animations/LottieArrowDown/LottieArrowDown";
import { BatchItem } from "../components/BatchList/BatchItem";
import { store } from "../store";
import { IBatchItem } from "../store/batch";

const CustomToast = ({ batch }: { batch: IBatchItem }) => (
  <Flex gap={2} alignItems="center">
    <Flex direction="column">
      <BatchItem item={batch} readonly />
    </Flex>
    <Box ml="auto">
      <LottieArrowDown style={{ width: 25 }} />
    </Box>
  </Flex>
);

export const useBatchListFocuser = () => {
  const {
    ref: batchListRef,
    inView,
    entry,
  } = useInView({
    threshold: 0.2,
  });

  useEffect(() => {
    const batchLength = store.batch.items.length;
    const batchLastItem = store.batch.items[batchLength - 1];
    if (batchLength === 1) {
      entry?.target.scrollIntoView({ behavior: "smooth" });
    } else if (batchLength > 1 && !inView) {
      toast(<CustomToast batch={batchLastItem} />, {
        position: "bottom-center",
        onClick: () => entry?.target.scrollIntoView({ behavior: "smooth" }),
        autoClose: batchLength > 2 ? 1500 : 4000,
        closeButton: false,
      });
    }
  }, [store.batch.items.length]);

  return {
    batchListRef,
  };
};
