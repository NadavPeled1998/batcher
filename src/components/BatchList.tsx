import { FC } from "react";

export interface IBatchItem {
  address: string;
  amount: number;
  token: string;
}

export interface BatchListProps {
  items: IBatchItem[];
}
export const BatchList: FC<BatchListProps> = ({ items }) => {
  return <div>{JSON.stringify(items)}</div>;
};
