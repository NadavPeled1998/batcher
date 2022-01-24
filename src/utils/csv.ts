import { IBatchItem } from "../store/batch";
import { NFT, nftsStore } from "../store/nfts";
import { TokenMetaData, tokensStore } from "../store/tokens";
import { isNative, isValidAddress } from "./address";
import csv from "csvtojson";

export const isCSV = (file: File) => {
  const fileType = file.type;
  const fileName = file.name;
  const fileNameParts = fileName.split(".");
  const fileExtension = fileNameParts[fileNameParts.length - 1];
  return fileType === "text/csv" && fileExtension === "csv";
};
export interface BaseBatchItem {
  recipient_address: string;
  token_address: string;
  token_id?: string;
  amount?: number;
  type: "native" | "erc20" | "erc721";
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

export const convertCSVToBatch = async (file: File) => {
  const data = await readFileAsync(file);
  const rows = await csv({ noheader: true, output: "csv" }).fromString(data);

  const base: BaseBatchItem[] = [];
  for (let i = 0; i < rows.length; i++) {
    const isFirstRow = i === 0;
    const row = rows[i];
    const recipientAddress = row[CSVBatchPosition.RecipientAddress];
    const amount = row[CSVBatchPosition.Amount];
    const tokenAddress = row[CSVBatchPosition.TokenAddress];
    const tokenID = row[CSVBatchPosition.TokenID];

    if (isFirstRow && !isValidAddress(recipientAddress)) continue;

    base.push({
      recipient_address: recipientAddress,
      token_address: tokenAddress,
      token_id: tokenID,
      amount: amount ? parseFloat(amount) : undefined,
      type: tokenID
        ? "erc721"
        : isNative(tokenAddress) || !tokenAddress
        ? "native"
        : "erc20",
    });
  }

  return {
    rawData: data,
    baseBatch: base,
  };
};
