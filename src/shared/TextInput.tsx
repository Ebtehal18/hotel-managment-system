import { InputLabel, TextField, type TextFieldProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

type TextInputProps = TextFieldProps & {
  label?: string;
  errorMsg?: string;
};

export default function TextInput({
  label,
  fullWidth = true,
  type,
  errorMsg,
  placeholder,
  ...rest
}: TextInputProps) {
  const { i18n } = useTranslation();
  const location = useLocation();

  const isArabic = i18n.language === "ar";
  const isAuthPage = location.pathname.includes("/auth");

  // Determine direction
  const dir = isArabic ? "rtl" : "ltr";

  return (
    <>
      {/* Show separate label only on auth pages, and align it correctly */}
      {isAuthPage && label && (
        <InputLabel
          sx={{
            textAlign: isArabic ? "right" : "left",
            width: "100%",
            mb: 1, // margin bottom for spacing
            fontSize: "14px",
          }}
        >
          {label}
        </InputLabel>
      )}

      <TextField
        type={type}
        label={isAuthPage ? "" : label} // Hide built-in label on auth pages
        placeholder={placeholder}
        fullWidth={fullWidth}
        dir={dir} // Main direction
        {...rest}
        error={!!errorMsg}
        helperText={errorMsg}
        inputProps={{
          ...rest.inputProps,
          step: type === "number" ? "0.01" : undefined,
          style: {
            ...rest.inputProps?.style,
            textAlign: isArabic ? "right" : "left", // Align input text
          },
        }}
        // Style the placeholder and input label
sx={{
  // Floating label position in RTL
  "& .MuiInputLabel-root": {
    left: "auto !important",
    right: isArabic ? "1.75rem !important" : "inherit", // adjust if needed (default ~28px)
    transformOrigin: "right !important",
    textAlign: "right",
  },
 
  // Placeholder alignment
  "& .MuiOutlinedInput-root": {
    "& input::placeholder": {
      textAlign: isArabic ? "right" : "left",
      opacity: 1,
    },
    // Input text padding – prevent "edge" hugging
    "& .MuiOutlinedInput-input": {
      padding: "18.5px 14px", // symmetric, or explicitly:
      // paddingLeft: isArabic ? "20px" : "14px",
      // paddingRight: isArabic ? "14px" : "20px",
      textAlign: isArabic ? "right" : "left",
    },
    // Adornments (icons) if you use them later
    "& .MuiInputAdornment-root": {
      marginLeft: isArabic ? "8px" : "inherit",
      marginRight: isArabic ? "inherit" : "8px",
    },
  },
  // Helper text
  "& .MuiFormHelperText-root": {
    textAlign: isArabic ? "right" : "left",
    fontSize: "14px",
  },
  // Critical: Move the notch/gap to the right side
  "& .MuiOutlinedInput-notchedOutline": {
    textAlign: isArabic ? "right !important" : "left",
  },
  "& legend": {
    textAlign: isArabic ? "right !important" : "left",
  },
}}
      />
    </>
  );
}