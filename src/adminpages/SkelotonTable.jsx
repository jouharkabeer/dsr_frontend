// import "./styles.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import range from "underscore/modules/range";

export default function Skeletonpage() {
  return (
    <SkeletonTheme color="red" highlightColor="#000">
      <TableSkeleton colCount={3} rowsCount={5} />
    </SkeletonTheme>
  );
}

const TableSkeleton = ({ colCount, rowsCount }) => {
  const columns = range(colCount).map((i) => {
    return (
      <th key={i}>
        <h1 style={{ margin: "0px" }}>
          <Skeleton />
        </h1>
      </th>
    );
  });

  const rowColumns = range(colCount).map((i) => {
    return (
      <td key={i}>
        <Skeleton />
      </td>
    );
  });

  const rows = range(rowsCount).map((i) => {
    return <tr key={i}>{rowColumns}</tr>;
  });

  return (
    <table width="100%">
      <thead>
        <tr>{columns}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
