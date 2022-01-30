import {
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Text,
  Code,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { HelpCircle } from "react-feather";
import { BatchItemFromCSV } from "./csv";
import { store } from "../store";

export class NotEnoughBalanceError {
  constructor(
    public message = "Not enough balance",
    public item: BatchItemFromCSV
  ) { }
  get rowNumber() {
    return this.item.row.index + 1;
  }
  get jsx() {
    let token: any = {}
    if (this.item.type === "native") {
      token = store.tokens.list[0];
    }
    if (this.item.type === "erc20") {
      token = store.tokens.list.find(
        (token) => token.token_address?.toLowerCase() === this.item.token_address?.toLowerCase()
      )
    }
    if (this.item.type === "erc721") {
      token = store.nfts.get(this.item.token_address?.toLowerCase(), this.item.token_id!);
    }
    return (
      <Stack divider={<Divider />} spacing={4}>
        <Stack>
          <Alert
            status="error"
            rounded="lg"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon />
            <AlertTitle mr={2}>{this.message}</AlertTitle>
            <AlertDescription>
              You don't have enough {token?.symbol} in your wallet
            </AlertDescription>
          </Alert>
          <Text></Text>
          <HStack color="gray.500" fontSize="sm">
            <HelpCircle />
            <Text>
              Or maybe your in a different network or connected with the wrong
              wallet?
            </Text>
          </HStack>
        </Stack>
      </Stack>
    );
  }
}

////////////////////
export class SendToYourselfError {
  constructor(
    public message = "Send to yourself",
    public item: BatchItemFromCSV
  ) { }
  get rowNumber() {
    return this.item.row.index + 1;
  }
  get jsx() {
    return (
      <Stack divider={<Divider />} spacing={4}>
        <Stack>
          <Alert
            status="error"
            rounded="lg"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon />
            <AlertTitle mr={2}>{this.message}</AlertTitle>
            <AlertDescription>
              You can't send to yourself, check
              row <Code rounded="lg">{this.rowNumber}</Code> in your CSV file.
            </AlertDescription>
          </Alert>
        </Stack>

        <Code rounded="lg" bg="gray.900">
          {this.rowNumber}: {this.item.row.line}
        </Code>
      </Stack>
    );
  }
}
//////////////////////////////////////
export class TokenNotFoundError {
  constructor(
    public message = "Token not found",
    public item: BatchItemFromCSV
  ) { }
  get rowNumber() {
    return this.item.row.index + 1;
  }
  get jsx() {
    return (
      <Stack divider={<Divider />} spacing={4}>
        <Stack>
          <Alert
            status="error"
            rounded="lg"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon />
            <AlertTitle mr={2}>{this.message}</AlertTitle>
            <AlertDescription>
              You don't have this token in your wallet, check
              row <Code rounded="lg">{this.rowNumber}</Code> in your CSV file.
            </AlertDescription>
          </Alert>
          <Text></Text>
          <HStack color="gray.500" fontSize="sm">
            <HelpCircle />
            <Text>
              Or maybe your in a different network or connected with the wrong
              wallet?
            </Text>
          </HStack>
        </Stack>

        <Code rounded="lg" bg="gray.900">
          {this.rowNumber}: {this.item.row.line}
        </Code>
      </Stack>
    );
  }
}

export class CSVErrors {
  constructor(public errors: CSVError[]) { }
}

export class CSVError {
  constructor(public row: BatchItemFromCSV["row"]) { }

  get inValidFields() {
    return Object.keys(this.row.validation).filter((key) => {
      if (key === "valid") return false;
      return !this.row.validation[
        key as keyof BatchItemFromCSV["row"]["validation"]
      ];
    });
  }

  get jsx() {
    return (
      <Stack>
        <Alert status="error" rounded="lg">
          <AlertIcon />
          <AlertTitle mr={2}> Row {this.row.index + 1} is invalid!</AlertTitle>
        </Alert>
        <Code rounded="lg" bg="gray.900">
          {this.row.index + 1}: {this.row.line}
        </Code>
        <Text fontSize="sm">Invalid fields: </Text>
        <Flex flexWrap="wrap" gap={2}>
          {this.inValidFields.map((field) => (
            <Code rounded="lg" bg="gray.900" key={field}>
              {field}
            </Code>
          ))}
        </Flex>
      </Stack>
    );
  }
}
