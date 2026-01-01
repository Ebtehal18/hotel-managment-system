import { FormControl, FormHelperText, InputLabel, MenuItem, Select,  useTheme,  type SelectProps, } from "@mui/material";
// import { useTranslation } from "react-i18next";

type SelectInputProps =SelectProps & {
  label: string;
  errorMsg?:string ;
options:{id:string|boolean,name:string}[]|null,
// fullWidth?:boolean
}

export default function SelectInput({
  label,
//   fullWidth,
  errorMsg,
options,
  ...rest // more than one prop  ← this collects all *remaining* props
 // value: "",
  // onChange: ƒ,
  // onBlur: ƒ,
  // name: "email",
  // ref: ƒ,
}: 
 SelectInputProps
) {
//   const {i18n}=useTranslation()
const theme=useTheme()
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
                 error={!!errorMsg}
          {...rest}       
            label={label}
            value={rest.value ?? ""}
  MenuProps={{
  PaperProps: {
    sx: {
      maxHeight: 250,

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
    },
  },
}}

        >
            {options?.map(({id,name},index)=>          <MenuItem key={index} value={String(id)}>{name}</MenuItem>
)}
     
        </Select>
                <FormHelperText sx={{color:'rgb(235, 81, 72)',fontSize:"1rem"}}>{errorMsg}</FormHelperText>

      </FormControl>
   
    </>
  );
}
