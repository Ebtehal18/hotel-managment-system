import { useTranslation } from "react-i18next";
import TextInput from "../../shared/TextInput";
import { Box, Button, CircularProgress, Stack,  useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { axiosPublicInstance } from "../../services/api/apiInstance";
import { Auth } from "../../services/api/apiConfig";
import {
  getEmailValidation,
} from "../../services/validation";
// import { useEffect } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import {  useNavigate } from "react-router-dom";


export default function Forget() {
   const { t, i18n } = useTranslation();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{email:string}>();
  const navigate=useNavigate()
const submitForget=async(data:{email:string})=>{
console.log(data)
 try {
      const response =await axiosPublicInstance.post(Auth.forget, data);
      toast.success(response?.data?.message);
      navigate('/auth/reset',{state:{email:data.email}})
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>; 
      toast.error(
        axiosError?.response?.data?.message || "There something went wrong"
      );
 
    }
}

  return (
    <>
         <form onSubmit={handleSubmit(submitForget)}>
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
     
        
        </Stack>
        <Box sx={{display:"flex",justifyContent:"flex-end",mt:2}}>      

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
        {isSubmitting?
          <>                      <CircularProgress size={20} sx={{  mr: 1 }}  />
       { t("forgot.sending")}
          </>
        :
        t("forgot.sendMail")}
          </Button>
      </form>
    </>
  )
}
