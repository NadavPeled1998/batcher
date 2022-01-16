import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useTable, Column } from "react-table";
import { TokenIcon } from "../components/TokenPicker/TokenIcon";
import { Token } from "../hooks/useERC20Balance";
import { store } from "../store";
import { TransactionHistoryListItem } from "../store/history";
import { genDefaultETHToken } from "../utils/defaults";
type Col = {
  col1: string;
  col2: Token;
};
export const History = observer(() => {
  const columns = useMemo(
    (): Column<TransactionHistoryListItem>[] => [
      {
        Header: "Batch transaction",
        accessor: "batch",
        Cell: (props) => (
          <Flex gap={2} alignItems={"center"}>
            <TokenIcon token="ETH" size="20" />
            <Text>Total transactions: {props.value.length}</Text>
          </Flex>
        ),
      },
      {
        Header: "Date",
        accessor: "transaction",
        Cell: (props) => (
          <Flex gap={2} alignItems={"center"}>
            <TokenIcon token="ETH" size="20" />
            <Text>{new Date(props.value.block_timestamp).toLocaleString()} </Text>
          </Flex>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: store.history.list });

  return (
    <Flex
      direction="column"
      bg="gray.900"
      w="1024px"
      mx="auto"
      p="8"
      gap="8"
      overflow="auto"
      //   rounded="40px"
    >
      <Table {...getTableProps()} whiteSpace="nowrap" size="sm">
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Flex>
  );
});
