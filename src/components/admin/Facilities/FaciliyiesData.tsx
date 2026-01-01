import { Controller, useForm } from "react-hook-form";
import TextInput from "../../../shared/TextInput";
import { useTranslation } from "react-i18next";
import { getFacilityNameValidation } from "../../../services/validation";
import { Box, Button, CircularProgress } from "@mui/material";
import { useAddFacility } from "../../../hooks/useAddFacility";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from "react";
import type { IFacility } from "../../../hooks/useGetFacilities";
import { useUpdateFacility } from "../../../hooks/useUpdateFacility";

export default function FacilitiesData({
  handleCloseAdd,
  isEditing,
  selectedFacility,
}: {
  handleCloseAdd?: () => void;
  isEditing?: boolean;
  selectedFacility?: IFacility | null;
}) {
  console.log(isEditing);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<{ name: string }>();
  const { t, i18n } = useTranslation();
  const { mutate: addFacility, isPending: isAdding } = useAddFacility();
  // const id=selectedFacility
  const { mutate: editFacility, isPending: isEditingFacility } =
    useUpdateFacility(selectedFacility?._id ?? null);

  console.log(selectedFacility);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(isEditing);
    if (isEditing) {
      reset({
        name: selectedFacility?.name,
      });
    }
  }, [isEditing, reset, selectedFacility?.name]);

  const onSubmit = (data: { name: string }) => {
    console.log(data);
    if (!isEditing) {
      addFacility(data, {
        onSuccess: (res) => {
          toast.success(res.message);
          queryClient.invalidateQueries({
            queryKey: ["facilities"],
          });
          handleCloseAdd?.();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message ?? "Something went wrong");
        },
      });
    } else {
      editFacility(data, {
        onSuccess: (res) => {
          toast.success(res.message);
          queryClient.invalidateQueries({
            queryKey: ["facilities"],
          });
          handleCloseAdd?.();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message ?? "Something went wrong");
        },
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        rules={getFacilityNameValidation(i18n.language as "en" | "ar")}
        render={({ field }) => {
          return (
            <TextInput
              placeholder={t("facilities.name")}
              fullWidth
              type={"text"}
              errorMsg={errors?.name?.message}
              {...field}
            />
          );
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isAdding || isEditingFacility}
        >
          {isEditingFacility || isAdding ? (
            <>
              <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />

              {isEditingFacility
                ? t("facilities.editing")
                : t("facilities.saving")}
            </>
          ) : isEditing ? (
            t("facilities.edit")
          ) : (
            t("facilities.save")
          )}
        </Button>
      </Box>{" "}
    </form>
  );
}
