import React, { type ReactNode } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { IconButton, Stack, Typography, useTheme } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

interface IDialog{
open:boolean,handleClose:()=>void,actions?:boolean,title?:string|ReactNode,children:ReactNode;
maxWidth?:'xs'| 'sm'| 'md'| 'lg'| 'xl',
showClose?:boolean,
backgroundImage?:string

}
export default function GenericDialog({open,handleClose,title,children,maxWidth='md',showClose=true,backgroundImage}:IDialog) {
const theme=useTheme()

  return (
    <>
        <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={maxWidth}
 PaperProps={{
    sx: {
      borderRadius: "15px",   // <-- works!
      overflow: "hidden"  ,     // optional: prevents children from overflowing the radius

       /* Chrome / Edge / Safari */
      '&::-webkit-scrollbar': {
        width: 8,
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#1976d2',
        borderRadius: 8,
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#1565c0',
      },

      /* Firefox */
      // scrollbarWidth: 'thin',
      scrollbarColor: `${theme.palette.primary.main} #f1f1f1`,
    
    }}
  }
        fullWidth
      >
           <Stack direction="row"  justifyContent={"space-between" }alignItems="center" sx={{px:3,py:2,backgroundImage}}>
       {typeof title==='string'?   <Typography variant="h6" component="h2">
            {title}
          </Typography>:title}
     {showClose&&     <IconButton onClick={handleClose} sx={{alignSelf:"start"}}>
            <CloseIcon />
          </IconButton>}
        </Stack>
      
        <DialogContent >
      {children}
        </DialogContent>
      
      </Dialog>
    </React.Fragment> 
    </>
  )
}
