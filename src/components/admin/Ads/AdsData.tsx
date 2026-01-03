import SelectInput from "../../../shared/SelectInput";
import { useTranslation } from "react-i18next";
import { useGetRooms } from "../../../hooks/useGetRooms";
import { Box, Button, CircularProgress, Skeleton, Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useAddAds, type Idata } from "../../../hooks/useAddAds";
import TextInput from "../../../shared/TextInput";
import {
  getDiscountValidation,
  getIsActiveValidation,
  getRoomValidation,
} from "../../../services/validation";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { IAds } from "../../../hooks/useGetAds";
import { useUpdateAds } from "../../../hooks/useUpdateAds";
import { useEffect } from "react";

export default function AdsData({
  handleClose,
  isEditing,
  selectedAds,
}: {
  handleClose: () => void;
  isEditing: boolean;
  selectedAds: IAds | null;
}) {
  console.log(isEditing);
  const { t, i18n } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Idata>();
  const { data: roomsData, isLoading: isLoadingRooms } = useGetRooms(1, 9999, {
    enabled: !isEditing,
  });
  const rooms = roomsData?.data.rooms.map((room) => ({
    id: room._id,
    name: room.roomNumber,
  }));
  console.log(rooms)
  const status = [
    { id: "false", name: "inActive" },
    { id: "true", name: "Active" },
  ];
  const { mutate: addAds, isPending: isAdding } = useAddAds();
  const { mutate: editAds, isPending: isEditingAds } = useUpdateAds(
    selectedAds?._id ?? null
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isEditing && selectedAds) {
      reset({
        discount: selectedAds.room.discount ?? "",
        isActive: selectedAds.isActive,
      });
    }
  }, [isEditing, selectedAds, reset]);

  const onSubmit = (data: Idata) => {
    console.log(data);

    if (!isEditing) {
      addAds(data, {
        onSuccess: (res) => {
          toast.success(res.message);
          queryClient.invalidateQueries({
            queryKey: ["ads"],
          });
          handleClose();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message ?? "Something went wrong");
        },
      });
    } else {
      editAds(data, {
        onSuccess: (res) => {
          toast.success(res.message);
          queryClient.invalidateQueries({
            queryKey: ["ads"],
          });
          handleClose();
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message ?? "Something went wrong");
        },
      });
    }
  };

  return (
    <Stack
      component="form"
      direction={"column"}
      gap={2}
      onSubmit={handleSubmit(onSubmit)}
    >
      {isLoadingRooms ? (
        <Skeleton height={60} variant="rectangular" />
      ) : (
        !isEditing && (
          <Controller
            control={control}
            rules={getRoomValidation(i18n.language as "en" | "ar")}
            name="room"
            render={({ field }) => (
              <SelectInput
                {...field}
                label={t("ads.roomNumber")}
                options={rooms ?? []}
                errorMsg={errors.room?.message}
              />
            )}
          />
        )
      )}
      <Controller
        control={control}
        name="discount"
        rules={getDiscountValidation(i18n.language as "en" | "ar")}
        render={({ field }) => (
          <TextInput
            label={t("ads.discount")}
            {...field}
            placeholder="0.00"
            type="number"
            errorMsg={errors.discount?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="isActive"
        rules={getIsActiveValidation(i18n.language as "en" | "ar")}
        render={({ field }) => {
          // console.log("isActive field value:", field.value, typeof field.value);
          return (
            <SelectInput
              {...field}
              label={t("ads.status")}
              errorMsg={errors.isActive?.message}
              options={status}
            />
          );
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isAdding || isEditingAds}
        >
          {isEditingAds || isAdding ? (
            <>
              <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />

              {isEditingAds ? t("facilities.editing") : t("facilities.saving")}
            </>
          ) : isEditing ? (
            t("facilities.edit")
          ) : (
            t("facilities.save")
          )}
        </Button>
      </Box>{" "}
    </Stack>
  );
}
