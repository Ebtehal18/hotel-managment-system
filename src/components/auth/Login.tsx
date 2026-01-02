import { useTranslation } from "react-i18next";
import TextInput from "../../shared/TextInput";
import { Box, Button, CircularProgress, Stack,  useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import type { ILogin } from "../../types/login";
import { axiosPublicInstance } from "../../services/api/apiInstance";
import { Auth } from "../../services/api/apiConfig";
import {
  getEmailValidation,
  getPassValidation,
} from "../../services/validation";
import { useEffect } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { UseAuth } from "../../context/AuthContext";
// import { UseAuth } from "../../context/AuthContext";


export default function Login() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ILogin>();
  const navigate=useNavigate()
  //submit the form
  const {getImageNameUser}=UseAuth()
 const submitLogin = async (data: ILogin) => {
  try {
    const response = await axiosPublicInstance.post(Auth.login, data);
    toast.success(response?.data?.message || "Login successful!");

    // 1. Save the token
    localStorage.setItem("token", response.data.data.token);

    // 2. IMPORTANT: Wait for the user profile to be fetched BEFORE navigating
    await getImageNameUser();

    // 3. Now navigate — fillData is guaranteed to be populated
    const userRole = response.data.data.user.role;
    if (userRole === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  } catch (error) {
    console.error("Login error:", error);
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(
      axiosError?.response?.data?.message || "Something went wrong. Please try again."
    );
  }
};
  // if you want to re-run validation immediately on language change
  // trigger("email") forces RHF to re-run validation immediately on the current value of the field.
  // Since the rules object has changed (because you call getEmailValidation(i18n.language) in your render), the new validation messages are used.
  // This is why the helper text updates to the new language without changing the field value.
  
  useEffect(() => {
    if (errors.email) trigger("email");
  if(errors.password)    trigger("password");

  }, [i18n.language, trigger, errors]);
  return (
    <>
      <form onSubmit={handleSubmit(submitLogin)}>
        <Stack direction={"column"} gap={3} >
          {/* email address  */}
          <Controller
            control={control}
            name="email"
            rules={getEmailValidation(i18n.language as "en" | "ar")}
            render={({ field }) => {
              return (
                <TextInput
                  label={t("login.email")}
                  fullWidth
                  type={"email"}
                  errorMsg={errors?.email?.message}
                  {...field}
                />
              );
            }}
          />
          {/* password */}
          <Controller
            control={control}
            name="password"
            rules={getPassValidation(i18n.language as "en" | "ar")}
            render={({ field }) => {
              return (
                <TextInput
                  label={t("login.password")}
                  fullWidth
                  type={"text"}
                  {...field}
                  errorMsg={errors.password?.message}
                />
              );
            }}
          ></Controller>
        
        </Stack>
        <Box sx={{display:"flex",justifyContent:"flex-end",mt:2}}>      
            <Link  to={'/auth/forgot'}   style={{ textDecoration: "none", color: theme.palette.secondary.main, cursor: "pointer" }}
>{t("login.forgotPasswordQ")}</Link>
</Box>
          {/* btn submit */}
          <Button
            disabled={isSubmitting}
            type="submit"
            fullWidth
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.light,
              boxShadow:theme.customShadows?.btn,
              mt:4,
                   py:1,
              px:2,
              '&.Mui-disabled': {
      backgroundColor: 'transparent',
      color: theme.palette.action.disabled,
      border:`1px solid ${theme.palette.primary.main}`,
      boxShadow: 'none',
      cursor: 'not-allowed',
    },
            }}
          >
        {isSubmitting?<>
                      <CircularProgress size={20} sx={{  mr: 1 }}  />
        
      {  t("login.loading")}
        </>
        :
        t("login.login")}
          </Button>
      </form>
    </>
  );
}
