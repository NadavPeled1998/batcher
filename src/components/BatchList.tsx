import { FC } from "react";

interface BatchItem {
  address: string;
  amount: number;
  token: string;
}

interface BatchListProps {
  items: BatchItem[];
}
export const BatchList: FC<BatchListProps> = ({ items }) => {
  return <div>{JSON.stringify(items)}</div>;
};
