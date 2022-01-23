import { IBatchItem } from "../store/batch";
import { NFT } from "../store/nfts";
import { TokenMetaData } from "../store/tokens";
import { isNative } from "./address";

export const isCSV = (file: File) => {
  const fileType = file.type;
  const fileName = file.name;
  const fileNameParts = fileName.split(".");
  const fileExtension = fileNameParts[fileNameParts.length - 1];
  return fileType === "text/csv" && fileExtension === "csv";
};
export interface TransformedBatchItem {
  recipient_address: string;
  token_address: string;
  token_id?: string;
  amount?: number;
  type: "native" | "erc20" | "erc721";
}

interface CSVBatchItem {
  "Recipient address": string;
  Amount?: string;
  "ERC20 token contract address"?: string;
  "ERC721 token contract address"?: string;
  "ERC721 token ID"?: string;
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
      csvItem["ERC721 token contract address"] = token_address;
      csvItem["ERC721 token ID"] = id;
    } else {
      csvItem["Amount"] = item.amount.toString();
      csvItem["ERC20 token contract address"] = item.token.address;
    }
    return csvItem;
  });
};

export const convertCSVToBatch = (csv: CSVBatchItem[]) => {
  return csv.map((item) => {});
};
