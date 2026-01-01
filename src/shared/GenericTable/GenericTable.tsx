import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {   Pagination, Stack, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RowTable from './RowTable';
import type { ReactNode } from 'react';



export interface IColumn<T>{
    label:string,
    key: keyof T,
    render?:(val:unknown,row:T)=>ReactNode
}
interface ITable<T>{
    columns:IColumn<T>[],
    data:T[],
    actions?:IActions<T>[],
    onView?:(row:T)=>void,
    paginated?:boolean,
    totalCount?:number,
  onPageChange: (event: React.ChangeEvent<unknown> | null, newPage: number) => void;

}
export interface IActions<T>{
  Icon:React.ElementType,
  label:string,
  handler:(row:T)=>void
}

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#E2E5EB',
    color: theme.palette.primary.dark,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


export default function GenericTable<T>({columns,data,actions,paginated,totalCount,onPageChange}:ITable<T>) {
  const {t}=useTranslation()
  
  return (
    <>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map(({label},index)=>            <StyledTableCell  align={index===0?"left":"center"} key={index}>{label}</StyledTableCell>
)}
{actions&&         <StyledTableCell  align={"center"} >{t("users.actions")}</StyledTableCell>
}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row:T,index)=> <RowTable<T> index={index} row={row} actions={actions} columns={columns}/>
     
            

          )}
      
        </TableBody>
      </Table>
    </TableContainer>
    {paginated&&   <Stack direction={'row'}  justifyContent={'end'} sx={{mt:2,direction:"ltr"}}>
      <Pagination onChange={onPageChange} sx={{"& .MuiPaginationItem-root.Mui-selected": {
      backgroundColor: "primary.main",
      color: "#fff",
    
    },}} count={Math.ceil((totalCount??0)/5)} variant="outlined" shape="rounded" />
    </Stack>}
    </>
  )
}
