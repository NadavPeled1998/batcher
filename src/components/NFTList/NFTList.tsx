import { observer } from "mobx-react-lite";
import { FC } from "react";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Grid,
  GridCellRenderer,
} from "react-virtualized";
import { store } from "../../store";
import { NFT } from "../../store/nfts";

export type NFTListItem = { isSelected?: boolean; nft: NFT };
export interface NFTListProps {
  items: NFTListItem[];
  renderer: (props: {
    key: string;
    style: React.CSSProperties;
    item: NFTListItem;
  }) => JSX.Element;
}

const chunk = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export const NFTList: FC<NFTListProps> = ({ items, renderer }) => {
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  });

  const chunks = chunk(items, 5);

  const cellRenderer: GridCellRenderer = ({
    columnIndex,
    key,
    parent,
    rowIndex,
    style,
  }) => {
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        {renderer({
          key,
          style,
          item: chunks[rowIndex][columnIndex],
        })}
      </CellMeasurer>
    );
  };

  if (!store.nfts.list.length) return <div>Loading...</div>;
  return (
    <AutoSizer style={{ width: "100%", height: "100%", overflowX: "hidden" }}>
      {({ height, width }) => (
        <Grid
          cellRenderer={cellRenderer}
          columnCount={chunks[0].length}
          columnWidth={width / chunks[0].length}
          height={height}
          rowCount={chunks.length}
          rowHeight={350}
          width={width}
          style={{
            overflowX: "hidden",
          }}
        />
      )}
    </AutoSizer>
  );
};
