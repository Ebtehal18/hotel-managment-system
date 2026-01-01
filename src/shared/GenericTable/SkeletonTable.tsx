import { Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export default function SkeletonTable({ rows = 5, columns = 5 }: SkeletonTableProps) {
  return (
    <Table>
      <TableHead >
        <TableRow >
          {Array.from({ length: columns }).map((_, i) => (
            <TableCell align="center" key={i}>
              <Skeleton variant="text" width="60%"  sx={{ mx: "auto" }}   />
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {Array.from({ length: rows }).map((_, r) => (
          <TableRow key={r}>
            {Array.from({ length: columns }).map((_, c) => (
              <TableCell key={c}>
                <Skeleton variant="rectangular" height={28} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
