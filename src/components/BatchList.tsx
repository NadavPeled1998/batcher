import { FC } from "react";
import { Token } from "../hooks/useERC20Balance";

export interface IBatchItem {
  address: string;
  amount: number;
  token: Token;
}

export interface BatchListProps {
  items: IBatchItem[];
}
export const BatchList: FC<BatchListProps> = ({ items }) => {
  return <div>{JSON.stringify(items)}</div>;
};
