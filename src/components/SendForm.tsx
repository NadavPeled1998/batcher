import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { AlertTriangle, ArrowUp, Layers } from "react-feather";
import { useMoralis } from "react-moralis";
import { FeatherWallet } from "../assets/FeatherWallet";
import { TokenPicker } from "../components/TokenPicker/TokenPicker";
import { useBatchListFocuser } from "../hooks/useBatchListFocuser";
import { useSendForm } from "../hooks/useSendForm";
import { store } from "../store";
import { AssetType } from "../store/form";
// import { convertBatchToCSV } from "../utils/csv";
import { formatNumber } from "../utils/currency";
import { networkConfigs } from "../utils/network";
import { AddressInput } from "./AddressInput";
import { ApproveModal } from "./ApproveModal";
import { BatchList } from "./BatchList/BatchList";
import { EstimatedGas } from "./EstimatedGas";
import { ImportCSVButton } from "./ImportCSV/ImportCSVButton";
import { NFTPicker } from "./NFTPicker/NFTPicker";
import { Permissable } from "./Permissable";
import { SelectedTokenBalance } from "./SelectedTokenBalance";
import { InputType, TokenAmountInput } from "./TokenAmountInput";
import { Totals } from "./Totals";

export const SendForm: FC = observer(() => {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);
  const { batchListRef } = useBatchListFocuser();

  const {
    submit,
    amountController,
    addressController,
    tokenController,
    nftController,
    formState: { errors },
    sendTransaction,
    approveAll,
    gasFee,
    externalGasFee,
  } = useSendForm();

  const { authenticate, isAuthenticated, account, chainId } = useMoralis();

  const isConnected = isAuthenticated && account;

  useEffect(() => {
    if (store.commands.approveCommand.done) setIsApproveModalOpen(false);
  }, [store.commands.approveCommand.done]);

  return (
    <Flex
      as="form"
      direction={["column", "column", "column", "row"]}
      gap={8}
      bg="gray.900"
      p={[7]}
      h="auto"
      rounded="40px"
      maxW="full"
      mx="auto"
      onSubmit={submit}
      borderTopWidth={1}
      borderTopColor="gray.700"
      // borderBottomWidth={1}
      borderBottomColor="primary.500"
      boxShadow="2xl"
    >
      <Flex
        alignItems="center"
        direction="column"
        w="sm"
        maxW="full"
        gap={8}
        position="relative"
        bg="gray.900"
      >
        <ImportCSVButton
          alignSelf="flex-end"
          position="absolute"
          cursor="pointer"
          top={0}
          right={0}
        />
        <FormControl colorScheme="primary" isInvalid={Boolean(errors.address)}>
          <FormLabel
            fontSize="sm"
            textAlign="center"
            htmlFor="address"
            color="gray.500"
          >
            {/* {account} <br /> */}
            Recipient Address
          </FormLabel>
          <AddressInput {...addressController} />
          <FormErrorMessage>
            <Text textAlign="center" mx="auto">
              {errors.address && errors.address.message}
            </Text>
          </FormErrorMessage>
        </FormControl>
        <Tabs
          w="auto"
          colorScheme="primary"
          rounded="full"
          size="sm"
          bg="gray.800"
          p="1"
          borderWidth="1px"
          borderColor="gray.700"
          index={store.form.assetType}
          variant="solid-rounded"
          color="white"
          onChange={(index) => store.form.setAssetType(index)}
        >
          <TabList>
            <Tab py={1}>
              <Text color="white">Token</Text>
            </Tab>
            <Tab py={1}>
              <Text color="white">NFT</Text>
            </Tab>
          </TabList>
        </Tabs>

        <FormControl
          d="grid"
          alignContent="center"
          gap={1}
          gridTemplateAreas={`
          "label"
          "picker"
          "amount"
          "error"
          "usd"
          "toggle"
          "divider"
        `}
          textAlign="center"
          colorScheme="primary"
          fontWeight={500}
          isInvalid={Boolean(errors.amount)}
        >
          {/* <FormLabel
            textAlign="center"
            gridArea="label"
            fontSize="sm"
            htmlFor="address"
            color="gray.500"
            hidden={store.form.assetType === AssetType.NFT}
          >
            Select token
          </FormLabel> */}
          {store.form.assetType === AssetType.Token && (
            <Flex direction="column" alignItems="center" gridArea="toggle">
              <Tabs
                colorScheme="primary"
                mx="auto"
                mt="4"
                p="0.5"
                index={store.form.amountInputType}
                style={
                  !store.form.canInputFiat
                    ? {
                        pointerEvents: "none",
                        opacity: 0.5,
                      }
                    : {}
                }
                bg="gray.800"
                borderWidth="1px"
                borderColor="gray.700"
                rounded="full"
                variant="solid-rounded"
                size="sm"
                color="white"
                onChange={(type) => store.form.setAmountInputType(type)}
              >
                {}
                <TabList>
                  <Tab py="0.5" px="4">
                    <Text color="white">{tokenController.value?.symbol}</Text>
                  </Tab>
                  <Tab py="0.5" px="4">
                    <Text color="white">USD</Text>
                  </Tab>
                </TabList>
              </Tabs>
              <Permissable>
                <Text
                  mt="2"
                  d="flex"
                  gap={1}
                  alignItems="center"
                  hidden={store.form.canInputFiat}
                  fontSize="xs"
                >
                  <AlertTriangle
                    color="var(--chakra-colors-orange-400)"
                    size="1em"
                  />{" "}
                  Couldn't fetch USD rate for {tokenController.value?.symbol}
                </Text>
              </Permissable>
            </Flex>
          )}
          <Flex
            direction="column"
            alignItems="center"
            gridArea="picker"
            mx="auto"
            w="full"
            gap={2}
          >
            {store.form.assetType === AssetType.Token ? (
              <>
                <TokenPicker {...tokenController} />
                <Permissable>
                  <SelectedTokenBalance />
                </Permissable>
              </>
            ) : (
              <NFTPicker {...nftController} my="auto" />
            )}
          </Flex>
          {store.form.assetType === AssetType.Token && (
            <>
              <Box gridArea="amount">
                <TokenAmountInput
                  placeholder={
                    store.form.amountInputType === InputType.Token
                      ? "0.00"
                      : "$0.00"
                  }
                  inputType={store.form.amountInputType}
                  {...amountController}
                  style={{
                    background: "none",
                    outline: "none",
                    fontSize: "2.5em",
                    flex: 1,
                    textAlign: "center",
                    width: "100%",
                  }}
                />
              </Box>
              <Text gridArea="usd" fontSize="sm" color="gray.500">
                <Permissable>
                  {store.form.amountInputType === InputType.Token
                    ? !store.form.canInputFiat
                      ? "unknown USD"
                      : formatNumber(store.form.usd) + " USD"
                    : formatNumber(store.form._amount, 6) +
                      " " +
                      tokenController.value?.symbol}
                </Permissable>
                <Permissable condition="notConnected">0.00 USD</Permissable>
              </Text>
            </>
          )}
          <FormErrorMessage
            d="flex"
            flexDir="column"
            gridArea="error"
            textAlign="center"
          >
            <ArrowUp size="1.2em" />
            <Text mx="auto" d="flex" alignItems="center">
              {errors.amount && errors.amount.message}
            </Text>
          </FormErrorMessage>
        </FormControl>
        {isConnected ? (
          <Button
            type="submit"
            colorScheme="primary"
            w={32}
            mx="auto"
            mt="auto"
            variant="ghost"
            rounded="full"
            disabled={
              Boolean(errors.address) ||
              !networkConfigs[chainId as string]?.chainName
            }
            leftIcon={<Layers />}
          >
            Batch
          </Button>
        ) : (
          <Button
            colorScheme="primary"
            mx="auto"
            mt="auto"
            variant="ghost"
            rounded="full"
            size="lg"
            disabled={Boolean(errors.address)}
            leftIcon={<FeatherWallet size="1.2em" />}
            onClick={async () => await authenticate()}
          >
            Connect wallet
          </Button>
        )}
      </Flex>
      <Center
        hidden={!store.batch.items.length}
        height={["0", "0", "0", "430px"]}
      >
        <Divider orientation="vertical" h="full" borderColor="gray.700" />
      </Center>
      <Flex
        ref={batchListRef}
        hidden={!store.batch.items.length}
        direction="column"
        w={["full", "full", "full", "xs"]}
        gap={8}
        bg="gray.900"
      >
        <BatchList />
        <Totals />
        <EstimatedGas gasFee={gasFee} externalGasFee={externalGasFee} />
        <ApproveModal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onSubmit={approveAll}
        />
        <Button
          hidden={!store.batch.items.length}
          rounded="full"
          colorScheme="primary"
          disabled={Boolean(errors.address)}
          size="lg"
          variant="outline"
          onClick={() =>
            Object.keys(store.batch.needsApproveMap).length
              ? setIsApproveModalOpen(true)
              : sendTransaction()
          }
        >
          {store.batch.items.length === 1
            ? "Send"
            : `Send Batch (${store.batch.items.length})`}
        </Button>
      </Flex>
    </Flex>
  );
});
