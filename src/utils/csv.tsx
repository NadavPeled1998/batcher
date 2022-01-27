import { IBatchItem } from "../store/batch";
import { NFT, nftsStore } from "../store/nfts";
import { TokenMetaData, tokensStore } from "../store/tokens";
import { isNative, isValidAddress } from "./address";
import csv from "csvtojson";
import { TokenType } from "../store/prices";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Code,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";

export const isCSV = (file: File) => {
  const fileType = file.type;
  const fileName = file.name;
  const fileNameParts = fileName.split(".");
  const fileExtension = fileNameParts[fileNameParts.length - 1];
  return fileType === "text/csv" && fileExtension === "csv";
};
export interface BatchItemFromCSV {
  recipient_address: string;
  token_address: string;
  token_id?: string;
  amount?: number;
  type: "native" | "erc20" | "erc721";
  row: {
    index: number;
    line: string;
    validation: IsCVSRowValidReturn;
  };
}

interface CSVBatchItem {
  "Recipient address": string;
  Amount?: string;
  "Token address"?: string;
  "Token ID"?: string;
}

export const convertBatchToCSV = (batch: IBatchItem[]) => {
  return batch.map((item) => {
    const csvItem: CSVBatchItem = {
      "Recipient address": item.address,
    };

    if (isNative(item.token.address)) {
      csvItem["Amount"] = item.amount.toString();
    } else if (item.token.type === "erc721") {
      const { token_address, id } = item.token as NFT;
      csvItem["Token address"] = token_address;
      csvItem["Token ID"] = id;
    } else {
      csvItem["Amount"] = item.amount.toString();
      csvItem["Token address"] = item.token.address;
    }
    return csvItem;
  });
};

function readFileAsync(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = reject;

    reader.readAsText(file, "UTF-8");
  });
}

enum CSVBatchPosition {
  RecipientAddress = 0,
  Amount = 1,
  TokenAddress = 2,
  TokenID = 3,
}
const isValidAmount = (amount?: string) => {
  return amount !== undefined && !isNaN(Number(amount)) && Number(amount) > 0;
};

const isCSVFieldValid = (field?: string) => {
  return field !== undefined && field !== "";
};

type IsCVSRowValidProps = {
  recipient_address: string;
  amount?: string;
  token_address?: string;
  token_id?: string;
  type: TokenType;
};

type IsCVSRowValidReturn = {
  valid: boolean;
  recipient_address: boolean;
  amount?: boolean;
  token_address?: boolean;
  token_id?: boolean;
};

const isCSVRowValid = (params: IsCVSRowValidProps): IsCVSRowValidReturn => {
  const recipient_address = isValidAddress(params.recipient_address);
  const amount = isValidAmount(params.amount);
  const token_address = isValidAddress(params.token_address);
  const token_id = isCSVFieldValid(params.token_id);

  const isNativeValid = recipient_address && amount;
  const isERC20Valid = recipient_address && token_address && amount;
  const isERC721Valid = recipient_address && token_address && token_id;

  switch (params.type) {
    case "native":
      return {
        valid: isNativeValid,
        recipient_address,
        amount,
      };
    case "erc20":
      return {
        valid: isERC20Valid,
        recipient_address,
        amount,
        token_address,
      };
    case "erc721":
      return {
        valid: isERC721Valid,
        recipient_address,
        token_address,
        token_id,
      };
  }
};
export class CSVErrors {
  constructor(public errors: CSVError[]) {}
}
export class CSVError {
  constructor(public row: BatchItemFromCSV["row"]) {}

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
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}> Row {this.row.index + 1} is invalid!</AlertTitle>
          <AlertDescription>Please check the CSV file.</AlertDescription>
        </Alert>
        <Code>
          {this.row.index + 1}: {this.row.line}
        </Code>
        <Text>
          Invalid fields:{" "}
          <Flex flexWrap="wrap" gap={2}>
            {this.inValidFields.map((field) => (
              <Code key={field}>{field}</Code>
            ))}
          </Flex>
        </Text>
      </Stack>
    );
  }
}

const getCSVTokenType = (
  token_address: string,
  token_id: string
): TokenType => {
  if (token_id) {
    return "erc721";
  } else if (!token_address || isNative(token_address)) {
    return "native";
  } else {
    return "erc20";
  }
};

const getCSVRowFields = (row: string[]) => {
  const fields = {
    recipient_address: row[CSVBatchPosition.RecipientAddress],
    amount: row[CSVBatchPosition.Amount],
    token_address: row[CSVBatchPosition.TokenAddress],
    token_id: row[CSVBatchPosition.TokenID],
  };

  return {
    ...fields,
    type: getCSVTokenType(fields.token_address, fields.token_id),
  };
};

export const convertCSVToBatch = async (file: File) => {
  const data = await readFileAsync(file);
  const rows = await csv({ noheader: true, output: "csv" }).fromString(data);
  const errors: CSVError[] = [];

  const base: BatchItemFromCSV[] = [];
  for (let i = 0; i < rows.length; i++) {
    const isFirstRow = i === 0;
    const row = rows[i];
    const fields = getCSVRowFields(row);

    if (isFirstRow && !isValidAddress(fields.recipient_address)) continue;

    const item = {
      recipient_address: fields.recipient_address,
      token_address: fields.token_address,
      token_id: fields.token_id,
      amount: fields.amount ? parseFloat(fields.amount) : undefined,
      type: fields.type,
      row: {
        index: i,
        line: row.join(","),
        validation: isCSVRowValid(fields),
      },
    };

    if (!item.row.validation.valid) {
      console.log('item.row.validation.valid:', item)
      errors.push(new CSVError(item.row));
    }

    base.push(item);
  }

  if (errors.length) throw new CSVErrors(errors);

  return {
    rawData: data,
    baseBatch: base,
  };
};
