import {  IconButton, Menu, MenuItem, styled, TableRow } from "@mui/material";
import { useState } from "react";
import { StyledTableCell, type IActions, type IColumn } from "./GenericTable";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
export default function RowTable<T>({
  index,
  row,
  actions,
  columns,
}: {
  index: number;
  row: T;
  actions?: IActions<T>[];
  columns: IColumn<T>[];
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <StyledTableRow
        key={index}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        {columns.map(({ key, render }, index) => (
          <StyledTableCell
            align={index === 0 ? "left" : "center"}
            key={index}
            component="th"
            scope="row"
          >
            {render
              ? render(row[key] as string,row as T)
              : (row[key] as React.ReactNode)}
          </StyledTableCell>
        ))}
        {actions && (
          <StyledTableCell align="center">
            <IconButton onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {actions.map(({ label, Icon, handler }, index: number) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    handler(row);
                    handleClose();
                  }}
                  sx={{display:"flex",alignItems:"center",gap:2}}
                >
                  <Icon  sx={{color:'primary.main'}}/>
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </StyledTableCell>
        )}
      </StyledTableRow>
    </>
  );
}
