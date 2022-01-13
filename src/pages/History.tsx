import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTable, Column } from "react-table";
import { TokenIcon } from "../components/TokenPicker/TokenIcon";
import { Token } from "../hooks/useERC20Balance";
import { genDefaultETHToken } from "../utils/defaults";
type Col = {
  col1: string;
  col2: Token;
};
export const History = () => {
  const data = useMemo(
    (): Col[] => [
      {
        col1: "Hello",
        col2: genDefaultETHToken(),
      },
      {
        col1: "react-table",
        col2: genDefaultETHToken(),
      },
      {
        col1: "whatever",
        col2: genDefaultETHToken(),
      },
    ],
    []
  );

  const columns = useMemo(
    (): Column<Col>[] => [
      {
        Header: "Column 1",
        accessor: "col1", // accessor is the "key" in the data
        Cell: (props) => (
          <Flex gap={2} alignItems={"center"}>
            <TokenIcon token="ETH" size="20" />
            <Text>{props.value} &gt; custom render</Text>
          </Flex>
        ),
      },
      {
        Header: "Column 2",
        accessor: "col2",
        Cell: (props) => (
          <Flex gap={2} alignItems={"center"}>
            <TokenIcon token="ETH" size="20" />
            <Text>{props.value.balance} &gt; custom render</Text>
          </Flex>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

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
};
