import { Controller, useForm } from "react-hook-form";
import TextInput from "../../../shared/TextInput";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Dropzone from "react-dropzone";
import {
  getCapacityDiscount,
  getDiscountValidation,
  getFacilitiesValidation,
  getPriceValidation,
  getRoomNumberValidation,
} from "../../../services/validation";
import { useGetFacilities } from "../../../hooks/useGetFacilities";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import { useAddRoom, type IRoomCreate } from "../../../hooks/useAddRoom";
import { useQueryClient } from "@tanstack/react-query";
import { useGetRoom } from "../../../hooks/useGetRoom";
import { useUpdateRoom } from "../../../hooks/useUpdateRoom";
import type { AxiosError } from "axios";

// Type for images in preview
type ImageItem =
  | { type: "existing"; url: string; name: string }
  | { type: "new"; file: File; name: string };

export default function RoomData() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    reset,
  } = useForm<IRoomCreate>({
    defaultValues: {
      facilities: [],
      imgs: [],
    },
  });

  // const theme = useTheme();
  const { id } = useParams();
  const { data: roomData } = useGetRoom(id ?? null);
  const { t, i18n } = useTranslation();

  register("imgs", {
    required: i18n.language === "ar" ? "الصور مطلوبة" : "Images are required",
  });

  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useGetFacilities(1, 9999);

  const facilities = facilitiesData?.data.facilities?.map((facility) => ({
    name: facility.name,
    id: facility._id,
  }));

  // Separate states for existing and new images
  const [existingImgs, setExistingImgs] = useState<string[]>([]);
  const [newImgs, setNewImgs] = useState<File[]>([]);

  // Load room data when editing
  useEffect(() => {
    if (id && roomData) {
      reset({
        capacity: String(roomData?.data.room.capacity),
        price: String(roomData?.data.room.price),
        discount: String(roomData?.data.room.discount),
        roomNumber: roomData?.data.room.roomNumber,
        facilities: roomData.data.room.facilities.map((f) => f._id),
      });

      // Load existing image URLs directly
      if (roomData?.data.room.images.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExistingImgs(roomData.data.room.images);
      }
    }
  }, [id, roomData, reset]);

  // Handle new file uploads
  const handleUploadFile = (acceptedFiles: File[]) => {
    setNewImgs((prev) => [...prev, ...acceptedFiles]);
    setValue("imgs", [...newImgs, ...acceptedFiles], { shouldValidate: true });
  };

  // Delete a new uploaded image
  const handleDeleteNew = (index: number) => {
    const updated = newImgs.filter((_, i) => i !== index);
    setNewImgs(updated);
    setValue("imgs", updated, { shouldValidate: true });
  };

  // Delete an existing image (removes from preview; backend keeps it unless you implement deletion)
  const handleDeleteExisting = (index: number) => {
    const updated = existingImgs.filter((_, i) => i !== index);
    setExistingImgs(updated);
  };

  const { mutate: addRoom, isPending: isAdding } = useAddRoom();
  const { mutate: updateRoom, isPending: isUpdating } = useUpdateRoom(id ?? null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit = (data: IRoomCreate) => {
    const formData = new FormData();

    // Append other fields
    (Object.keys(data) as (keyof IRoomCreate)[]).forEach((key) => {
      if (key === "facilities") {
        data.facilities?.forEach((id) => formData.append("facilities", id));
      } else if (key !== "imgs") {
        formData.append(key, data[key] as string);
      }
    });

    // Only append new images
    newImgs.forEach((img) => formData.append("imgs", img));

    if (!id) {
      // Create new room
      addRoom(formData, {
        onSuccess: (res) => {
          toast.success(res.message);
          queryClient.invalidateQueries({ queryKey: ["rooms"] });
          navigate("/dashboard/rooms");
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message ?? "Something went wrong");
        },
      });
    } else {
      // Update existing room
      updateRoom(formData, {
        onSuccess: (res) => {
          toast.success(res.message);
          queryClient.invalidateQueries({ queryKey: ["rooms"] });
          queryClient.invalidateQueries({ queryKey: ["room", id] });
          navigate("/dashboard/rooms");
        },
        onError: (error) => {
          const err = error as AxiosError<{ message: string }>;
          toast.error(err?.response?.data?.message ?? "Something went wrong");
        },
      });
    }
  };

  // Combine existing and new images for preview
  const allImages: ImageItem[] = [
    ...existingImgs.map((url,i) => ({
      type: "existing" as const,
      url,
      name: url.split("/").pop() || `image-${i}`,
    })),
    ...newImgs.map((file) => ({
      type: "new" as const,
      file,
      name: file.name,
    })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        spacing={2}
        sx={{ width: { xs: "100%", sm: "60%" }, mx: "auto", pt: 5, mt: 5 }}
        justifyContent="center"
      >
        {/* Room Number */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="roomNumber"
            rules={getRoomNumberValidation(i18n.language as "en" | "ar")}
            control={control}
            render={({ field }) => (
              <TextInput
                errorMsg={errors.roomNumber?.message}
                {...field}
                label={t("rooms.roomNumber")}
                value={field.value ?? ""}
                placeholder="0"
              />
            )}
          />
        </Grid>

        {/* Price */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="price"
            rules={getPriceValidation(i18n.language as "en" | "ar")}
            control={control}
            render={({ field }) => (
              <TextInput
                errorMsg={errors.price?.message}
                {...field}
                label={t("rooms.price")}
                value={field.value ?? ""}
                placeholder="0.00"
              />
            )}
          />
        </Grid>

        {/* Capacity */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="capacity"
            rules={getCapacityDiscount(i18n.language as "en" | "ar")}
            control={control}
            render={({ field }) => (
              <TextInput
                errorMsg={errors.capacity?.message}
                {...field}
                label={t("rooms.capacity")}
                value={field.value ?? ""}
                type="number"
                placeholder="0"
              />
            )}
          />
        </Grid>

        {/* Discount */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="discount"
            rules={getDiscountValidation(i18n.language as "en" | "ar")}
            control={control}
            render={({ field }) => (
              <TextInput
                errorMsg={errors.discount?.message}
                {...field}
                label={t("rooms.discount")}
                value={field.value ?? ""}
                type="number"
                placeholder="0%"
              />
            )}
          />
        </Grid>

        {/* Facilities */}
        <Grid size={{ xs: 12, sm: 6 }}>
          {isLoadingFacilities ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <Controller
              name="facilities"
              rules={getFacilitiesValidation(i18n.language as "en" | "ar")}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.facilities}>
                  <InputLabel id="facilities-label">
                    {t("rooms.facilities")}
                  </InputLabel>
                  <Select
                    labelId="facilities-label"
                    multiple
                    fullWidth
                    dir={i18n.language === "ar" ? "rtl" : "ltr"}
                    {...field}
                    input={<OutlinedInput label={t("rooms.facilities")} />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[])?.map((value) => {
                          const facility = facilities?.find((f) => f.id === value);
                          return (
                            <Chip
                              key={value}
                              label={facility?.name}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                              onDelete={() => {
                                field.onChange(
                                  field.value.filter((id: string) => id !== value)
                                );
                              }}
                              deleteIcon={<CancelIcon />}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {facilities?.map(({ id, name }) => (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.facilities && (
                    <FormHelperText>
                      {errors.facilities.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          )}
        </Grid>

        {/* Image Upload & Preview */}
        <Grid size={{ xs: 12 }}>
          <Dropzone maxFiles={5} multiple onDrop={handleUploadFile}>
            {({ getRootProps, getInputProps }) => (
              <Box
                {...getRootProps()}
                sx={{
                  backgroundColor: "#F1FFF0",
                  textAlign: "center",
                  height: 145,
                  p: 2,
                  display: "flex",
                  borderRadius: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px dashed ${errors.imgs ? "#d32f2f" : "#009247"}`,
                  cursor: "pointer",
                }}
              >
                <input {...getInputProps()} />
                <p style={{ color: "#121212" }}>{t("rooms.roomDarg")}</p>
              </Box>
            )}
          </Dropzone>

          {errors.imgs && (
            <Typography color="error">{errors.imgs.message}</Typography>
          )}

          {/* Image Previews */}
          <Grid container spacing={1} sx={{ mt: 2 }} justifyContent="center">
            {allImages.map((item, index) => {
              const isExisting = item.type === "existing";
              const actualIndex = isExisting
                ? index
                : index - existingImgs.length;

              return (
                <Grid key={`${item.type}-${index}`} size={{ xs: 6, sm: 2.4 }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: { xs: "100%", sm: 150 },
                      height: 100,
                      borderRadius: "8px",
                      overflow: "hidden",
                      "&:hover .delete-btn": { opacity: 1 },
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        item.type === "existing"
                          ? item.url
                          : URL.createObjectURL(item.file)
                      }
                      alt={item.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <IconButton
                      className="delete-btn"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        transform: "translate(50%, -50%)",
                        bgcolor: "rgba(0,0,0,0.6)",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                        zIndex: 1,
                        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                      }}
                      onClick={() =>
                        isExisting
                          ? handleDeleteExisting(actualIndex)
                          : handleDeleteNew(actualIndex)
                      }
                    >
                      <DeleteIcon sx={{ color: "#fff" }} />
                    </IconButton>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Buttons */}
        <Stack
          direction="row"
          gap={2}
          justifyContent="end"
          sx={{ width: "100%" }}
        >
          <Button variant="outlined" component={Link} to="/dashboard/rooms">
            {t("rooms.cancel")}
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={isAdding || isUpdating}
          >
            {isUpdating || isAdding ? (
              <>
                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                {isUpdating
                  ? t("facilities.editing")
                  : t("facilities.saving")}
              </>
            ) : id ? (
              t("facilities.edit")
            ) : (
              t("facilities.save")
            )}
          </Button>
        </Stack>
      </Grid>
    </form>
  );
}