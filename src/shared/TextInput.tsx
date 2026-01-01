import { InputLabel, TextField, type TextFieldProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

type TextInputProps =TextFieldProps & {
  label?: string;
  errorMsg?:string 
}

export default function TextInput({
  label,
  fullWidth=true,
  type,
  errorMsg,
  placeholder,
  ...rest // more than one prop  ← this collects all *remaining* props
 // value: "",
  // onChange: ƒ,
  // onBlur: ƒ,
  // name: "email",
  // ref: ƒ,
}: 
 TextInputProps
) {
  const {i18n}=useTranslation()
  const location=useLocation()
  return (
    <>
    {location.pathname.includes("/auth")?      <InputLabel >{label}</InputLabel>
:""}
      <TextField
      type={type}
      label={location.pathname.includes("/auth")?"": label}
        inputProps={{
    step: "0.01", // allows floats
  }}
        id="outlined-basic" 
        fullWidth={fullWidth}
        placeholder={placeholder}
        {...rest}
        error={!!errorMsg}
        helperText={errorMsg}
        //changing the direction based on the lng direction
         FormHelperTextProps={{
    dir: i18n.language === "ar" ? "rtl" : "ltr",
    style: { textAlign: i18n.language === "ar" ? "right" : "left",fontSize:"14px" },
  }}
      />
    </>
  );
}
