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
  useTheme,
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


export default function RoomData() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    reset
  } = useForm<  IRoomCreate>({
    defaultValues: {
      facilities: [],
      imgs: [],
    },
  });
  const theme = useTheme();
const {id}=useParams()
const {data:roomDaata}=useGetRoom(id??null)
  const { t, i18n } = useTranslation();

  register("imgs", {
    required: i18n.language === "ar" ? "الصور مطلوبة" : "Images are required",
  });

  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useGetFacilities(1, 9999,{
    // enabled:!Boolean(roomId)
    });
  const facilities = facilitiesData?.data.facilities?.map((faility) => ({
    name: faility.name,
    id: faility._id,
  }));

  const [imgs, setImgs] = useState<null | File[]>(null);

  //uploading imgs
  const handelUploadFile = (acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    setValue("imgs", acceptedFiles, { shouldValidate: true });
    setImgs(acceptedFiles);
  };




  useEffect(()=>{
if(id&&roomDaata){
  reset({
capacity:String(roomDaata?.data.room.capacity),
price:String(roomDaata?.data.room.price),
discount:String(roomDaata?.data.room.discount),
roomNumber:roomDaata?.data.room.roomNumber,
facilities:roomDaata.data.room.facilities.map((f)=>f._id),
// imgs:roomDaata?.data.room.images,
  })

if(roomDaata?.data.room.images.length>0){
 const loadImages = async () => {
    const imgFiles = await Promise.all(
      roomDaata.data.room.images.map(async (img, i) => {
        const response = await fetch(img);
        const blob = await response.blob();
        return new File([blob], `img-${i}`, { type: blob.type });
      })
    );
    setValue('imgs',imgFiles)
    setImgs(imgFiles)
  }
  loadImages();
   
}


}




  },[id,roomDaata])


  const { mutate: addRoom, isPending: isAdding } = useAddRoom();
  const { mutate: updateRoom, isPending:isUpdating } = useUpdateRoom(id??null);

  const navigate=useNavigate()
const queryClient=useQueryClient()

  const onSubmit = (data: IRoomCreate) => {
    console.log(data);

    const formData = new FormData();

    for (const key in data) {
      const k = key as keyof IRoomCreate;

      if (key === "facilities") {
        //facilities=['','']
        data.facilities?.forEach((id) => {
          formData.append("facilities[]", id);
        });
      } else if (key === "imgs") {
        imgs?.forEach((img) => {
          formData.append(key, img);
        });
      } else {
        formData.append(key, data[k] as string);
      }
    }
    
    if(!id){
      //add vase 
       addRoom(formData, {
        onSuccess: (res) => {
          console.log(res)
          toast.success(res.message);
          queryClient.invalidateQueries({
            queryKey: ["rooms"],
          });
          navigate('/dashboard/rooms')
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message ?? "Something went wrong");
        },
      }
       )}else{
 updateRoom(formData, {
        onSuccess: (res) => {
          console.log(res)
          toast.success(res.message);
          queryClient.invalidateQueries({
            queryKey: ['rooms'],
            
          });
          queryClient.invalidateQueries({ queryKey: ['room', id] }); // adjust if your key is different
          navigate('/dashboard/rooms')
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message ?? "Something went wrong");
        },
      })
       }
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
  };

  const handelDelete = (i: number) => {
    const newData = imgs?.filter((_, imgI) => imgI !== i) ?? [];
    setImgs(newData);
    setValue("imgs", newData, { shouldValidate: true });
    // console.log(i)
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        spacing={2}
        sx={{ width: { xs: "100%", sm: "60%" }, mx: "auto", pt: 5, mt: 5 }}
        justifyContent={"center"}
      >
        {/* room number */}
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
                value={field.value??''}
                // type="number"
                placeholder="0"
              />
            )}
          />
        </Grid>
        {/* price */}
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
                                value={field.value??''}

                // type="number"
                placeholder="0.00"
              />
            )}
          />
        </Grid>
        {/* capacity */}
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
                                value={field.value??''}

                type="number"
                placeholder="0"
              />
            )}
          />
        </Grid>
        {/* discount */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="discount"
            rules={getDiscountValidation(i18n.language as "en" | "ar")}
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                errorMsg={errors.discount?.message}
                label={t("rooms.discount")}
                                value={field.value??''}

                type="number"
                placeholder="0%"
              />
            )}
          />
        </Grid>
        {/* facilities */}
        <Grid size={{ xs: 12, sm: 6 }}>
          {isLoadingFacilities ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <Controller
              name="facilities"
              // defaultValue={[]}
              rules={getFacilitiesValidation(i18n.language as "en" | "ar")}
              control={control}
              render={({ field }) => (
                <FormControl sx={{ width: "100%" }} error={!!errors.facilities}>
                  <InputLabel id="demo-multiple-chip-label">
                    {t("rooms.facilities")}
                  </InputLabel>
                  <Select
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 250,

                          "&::-webkit-scrollbar": {
                            width: 8,
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: "#f1f1f1",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#1976d2",
                            borderRadius: 8,
                          },
                          "&::-webkit-scrollbar-thumb:hover": {
                            backgroundColor: "#1565c0",
                          },
                          scrollbarColor: `${theme.palette.primary.main} #f1f1f1`,
                        },
                      },
                    }}
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    {...field}
                    input={
                      <OutlinedInput
                        id="select-multiple-chip"
                        label={t("rooms.facilities")}
                      />
                    }
                    renderValue={(selected) => (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          width: "100%",
                        }}
                      >
                        {selected?.map((value) => {
                          const facility = facilities?.find(
                            (facility) => facility.id === value
                          );
                          // console.log(selected);
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
                                  field.value.filter((id) => id !== value)
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
        {/* image */}
        <Grid size={{ xs: 12 }}>
          <Dropzone
            maxFiles={5}
            multiple
            onDrop={(file) => handelUploadFile(file)}
          >
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
                <p>{t("rooms.roomDarg")}</p>
              </Box>
            )}
          </Dropzone>
          {errors.imgs && (
            <Typography color="error">{errors.imgs.message}</Typography>
          )}
          {/* 
       imgs preview */}
          <Grid
            container
            spacing={2}
            sx={{ mt: 2 }}
            justifyContent="center"
            alignItems={"center"}
          >
            {imgs?.map((img, index) => (
              <Grid
                key={img.name}
                size={{ xs: 6, sm: 2.4 }}
                justifyContent={"center"}
              >
                <Box
                  sx={{
                    position: "relative",

                    width: { xs: "100%", sm: 150 },
                    objectFit: "cover",
                    height: 100,
                    borderRadius: "8px",
                    "&:hover .delete-btn": {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={URL.createObjectURL(img)}
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px",
                      display: "block",
                      objectFit: "cover",
                    }}
                  />

                  <IconButton
                    className="delete-btn"
                    sx={{
                      position: "absolute",
                      top: 0,
                      width: 40,
                      height: 40,
                      right: 0,
                      transform: "translate(50%, -50%)",
                      bgcolor: "rgba(0,0,0,0.6)",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                      zIndex: 1,
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.8)",
                      },
                    }}
                    onClick={() => handelDelete(index)}
                  >
                    <DeleteIcon sx={{ color: "#fff" }} />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {/* btns */}
        <Stack
          direction={"row"}
          gap={2}
          justifyContent={"end"}
          sx={{ width: "100%" }}
        >
          <Button variant="outlined" component={Link} to={"/dashboard/rooms"}>
            {t("rooms.cancel")}
          </Button>
          <Button variant="contained" type="submit"           disabled={isAdding || isUpdating}
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
