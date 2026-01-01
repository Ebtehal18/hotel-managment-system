import { useTranslation } from "react-i18next";
import TextInput from "../../shared/TextInput";
import { Button, CircularProgress, Grid, Stack, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { axiosPublicInstance } from "../../services/api/apiInstance";
import { Auth } from "../../services/api/apiConfig";
import {
  getConfirmPasswordValidation,
  getEmailValidation,
  getPassValidation,
} from "../../services/validation";
import { useEffect } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
interface IReset {
  email: string;
  password: string;
  confirmPassword: string;
  seed: string;
}
export default function Reset() {
  const { t, i18n } = useTranslation();
  const { state } = useLocation();

  const theme = useTheme();
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<IReset>({
    defaultValues: {
      email: state?.email ?? "", 
      seed: "",
      password: "",
      confirmPassword: "",
    },
  });
  const navigate = useNavigate();
  //submit the form
  // const {setUser}=UseAuth()
  const submitReset = async (data: IReset) => {
    console.log(data);
    try {
      const response = await axiosPublicInstance.post(Auth.reset, data);
      toast.success(response?.data?.message);
      // setUser(response.data?.data?.user)
      navigate("/auth/login");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>; // the response data.?
      toast.error(
        axiosError?.response?.data?.message || "There something went wrong"
      );
    }
  };
  // if you want to re-run validation immediately on language change
  // trigger("email") forces RHF to re-run validation immediately on the current value of the field.
  // Since the rules object has changed (because you call getEmailValidation(i18n.language) in your render), the new validation messages are used.
  // This is why the helper text updates to the new language without changing the field value.
  useEffect(() => {
    if (errors.email) trigger("email");
    if (errors.password) trigger("password");
  }, [i18n.language, trigger, errors]);
  return (
    <>
      <form onSubmit={handleSubmit(submitReset)}>
        <Stack direction={"column"} gap={3}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
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
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {/* otp  */}
              <Controller
                control={control}
                name="seed"
                rules={{
                  required: t("reset.otpRequired"),
                  pattern: {
                    value: /^\d{4,8}$/,
                    message: t("reset.invalidOtp"),
                  },
                }}
                render={({ field }) => {
                  return (
                    <TextInput
                      label={t("reset.otp")}
                      fullWidth
                      type={"text"}
                      errorMsg={errors?.seed?.message}
                      {...field}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>

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
                  type={"password"}
                  {...field}
                  errorMsg={errors.password?.message}
                />
              );
            }}
          ></Controller>
          {/*comfirm- password */}
          <Controller
            control={control}
            name="confirmPassword"
            rules={getConfirmPasswordValidation(
              i18n.language as "en" | "ar",
              watch("password")
            )}
            render={({ field }) => {
              return (
                <TextInput
                  label={t("reset.confirmPassword")}
                  fullWidth
                  type={"password"}
                  {...field}
                  errorMsg={errors.confirmPassword?.message}
                />
              );
            }}
          ></Controller>
        </Stack>

        {/* btn submit */}
        <Button
          disabled={isSubmitting}
          type="submit"
          fullWidth
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.light,
            boxShadow: theme.customShadows?.btn,
            mt: 4,
            py: 1,
            px: 2,
            "&.Mui-disabled": {
              backgroundColor: "transparent",
              color: theme.palette.action.disabled,
              border: `1px solid ${theme.palette.primary.main}`,
              boxShadow: "none",
              cursor: "not-allowed",
            },
          }}
        >
          {isSubmitting ? (
            <>
              {" "}
              <CircularProgress size={20} sx={{ mr: 1 }} />
              {t("reset.resetting")}
            </>
          ) : (
            t("reset.resetPass")
          )}
        </Button>
      </form>
    </>
  );
}
