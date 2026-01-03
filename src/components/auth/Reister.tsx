// import { useTheme } from "@emotion/react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { IRegister } from "../../types/login";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  getConfirmPasswordValidation,
  getCountryValidation,
  getEgyptianPhoneValidation,
  getEmailValidation,
  getPassValidation,
  getUsernameValidation,
} from "../../services/validation";
import TextInput from "../../shared/TextInput";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosPublicInstance } from "../../services/api/apiInstance";
import { Auth } from "../../services/api/apiConfig";
import Dropzone from "react-dropzone";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Register() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    // trigger,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IRegister>();
  const navigate = useNavigate();
  const [imgs, setImgs] = useState<null | File>(null);
  register("profileImage", {
    required: i18n.language === "ar" ? "الصور مطلوبة" : "Images are required",
  });

  //uploading imgs
  const handelUploadFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      setValue("profileImage", file, { shouldValidate: true });
      setImgs(file);
    }
  };
  const handelDelete = () => {
    setImgs(null);
    setValue("profileImage", null, { shouldValidate: true });
  };
  const submitLogin = async (data: IRegister) => {
    const formData = new FormData();

    // Append all text fields
    formData.append("userName", data.userName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("country", data.country);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("role", "user");

    // Append the image only if it exists
    if (data.profileImage) {
      formData.append("profileImage", data?.profileImage); // File object
    }
    try {
      const response = await axiosPublicInstance.post(Auth.register, formData);
      toast.success(response?.data?.message);
      // setUser(response.data?.data?.user)
      navigate("/auth/login");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        axiosError?.response?.data?.message || "There something went wrong"
      );
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(submitLogin)}>
        <Stack direction={"column"} gap={3}>
          {/* userName */}
          <Controller
            control={control}
            name="userName"
            rules={getUsernameValidation(i18n.language as "en" | "ar")}
            render={({ field }) => {
              return (
                <TextInput
                  label={t("user.userName")}
                  fullWidth
                  // type={"email"}
                  errorMsg={errors?.userName?.message}
                  {...field}
                />
              );
            }}
          />

          <Grid container spacing={2}>
            {/* phone */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                control={control}
                name="phoneNumber"
                rules={getEgyptianPhoneValidation(i18n.language as "en" | "ar")}
                render={({ field }) => {
                  return (
                    <TextInput
                      label={t("user.phoneNumber")}
                      fullWidth
                      type={"text"}
                      {...field}
                      errorMsg={errors.phoneNumber?.message}
                    />
                  );
                }}
              ></Controller>
            </Grid>
            {/* country */}
            <Grid size={{ xs: 12, md: 6 }}>
              {/* country */}
              <Controller
                control={control}
                name="country"
                rules={getCountryValidation(i18n.language as "en" | "ar")}
                render={({ field }) => {
                  return (
                    <TextInput
                      label={t("user.country")}
                      fullWidth
                      type={"text"}
                      {...field}
                      errorMsg={errors.country?.message}
                    />
                  );
                }}
              ></Controller>
            </Grid>
          </Grid>

          {/* email */}
          <Controller
            control={control}
            name="email"
            rules={getEmailValidation(i18n.language as "en" | "ar")}
            render={({ field }) => {
              return (
                <TextInput
                  label={t("login.email")}
                  fullWidth
                  type={"text"}
                  {...field}
                  errorMsg={errors.email?.message}
                />
              );
            }}
          ></Controller>
          <Grid container spacing={2}>
            {/* password */}
            <Grid size={{ xs: 12, md: 6 }}>
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
            </Grid>
            {/* comfirm pass */}
            <Grid size={{ xs: 12, md: 6 }}>
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
                      label={t("user.comfirmPass")}
                      fullWidth
                      type={"text"}
                      {...field}
                      errorMsg={errors.confirmPassword?.message}
                    />
                  );
                }}
              ></Controller>
            </Grid>
          </Grid>

          <Dropzone
            maxFiles={5}
            multiple
            onDrop={(file) => handelUploadFile(file)}
          >
            {({ getRootProps, getInputProps }) => (
              <>
                <Box
                  {...getRootProps()}
                  sx={{
                    backgroundColor: "#F1FFF0",
                    textAlign: "center",
                    height: 145,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px dashed ${
                      errors.profileImage ? "#d32f2f" : "#009247"
                    }`,
                    cursor: "pointer",
                  }}
                >
                  <input {...getInputProps()} />
                  {!imgs && <p style={{ color: "#121212" }}>{t("user.userImage")}</p>}
                  {imgs && (
                    <Box sx={{ position: "relative", width: 80, height: 80 }}>
                      <Box
                        component="img"
                        src={URL.createObjectURL(imgs)}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          display: "block",
                        }}
                      />

                      <IconButton
                        size="small"
                        onClick={handelDelete}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          p: "2px",
                          backgroundColor: "white",
                          boxShadow: 1,
                          zIndex: 1,
                          "&:hover": {
                            backgroundColor: "white",
                          },
                        }}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: "#d32f2f" }}
                        />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Dropzone>
          {errors.profileImage && (
            <Typography color="error">{errors.profileImage.message}</Typography>
          )}
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
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
                <CircularProgress size={20} sx={{ mr: 1 }} />

                {t("user.loading")}
              </>
            ) : (
              t("user.register")
            )}
          </Button>
        </Box>
      </form>
    </>
  );
}
