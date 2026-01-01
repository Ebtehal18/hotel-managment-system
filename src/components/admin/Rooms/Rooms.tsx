import { useEffect, useState } from "react";
import {
  getDataRooms,
  useGetRooms,
  type IRoom,
} from "../../../hooks/useGetRooms";
import GenericTable, {
  type IColumn,
} from "../../../shared/GenericTable/GenericTable";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useQueryClient } from "@tanstack/react-query";
import SkeletonTable from "../../../shared/GenericTable/SkeletonTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericDialog from "../../../shared/GenericDialog/GenericDialog";
import ImageGallery from "react-image-gallery";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SharedHeader from "../../../shared/SharedHeader";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import type { IFacility } from "../../../hooks/useGetFacilities";
import deleteImg from "../../../assets/delete.png";
import { useDeleteRoom } from "../../../hooks/useDeleteRoom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { data, isLoading } = useGetRooms(page);
  const [open, setOpen] = useState(false);
  const [room, setSelectedRoom] = useState<null | IRoom>(null);
  const theme = useTheme();
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onView = () => {
    handleClickOpen();
  };
  const handelCloseDelete = () => {
    setOpenDelete(false);
    setSelectedRoom(null);
  };
  const handelOpenDelete = () => setOpenDelete(true);
  //open modal and set the sate
  const handelDelete = (row: IRoom) => {
    console.log(row);
    handelOpenDelete();
    setSelectedRoom(row);
  };
  const queryClient = useQueryClient();
  const { mutate: deleteRoom, isPending: isDeleteing } = useDeleteRoom(
    room?._id ?? null
  );
  //fun to delete the facility
  const handelDeleteRoom = () => {
    deleteRoom(room?._id, {
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries({
          queryKey: ["rooms"],
        });
        handelCloseDelete();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message ?? "Something went wrong");
      },
    });
  };
  const columns: IColumn<IRoom>[] = [
    { key: "roomNumber", label: t("rooms.roomNumber") },
    {
      key: "images",
      label: t("rooms.images"),
      render: (val) => {
        const imageSrcs = val as string[];
        return (
          <Stack justifyContent="center" alignItems="center">
            {imageSrcs.length ? (
              <Box
                component={"img"}
                sx={{ width: 56, height: 56, borderRadius: "0.5rem" }}
                src={imageSrcs[0]}
              />
            ) : (
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "0.5rem",
                  backgroundColor: theme.palette.secondary.light,
                }}
              />
            )}
          </Stack>
        );
      },
    },
    { key: "price", label: t("rooms.price") },
    { key: "capacity", label: t("rooms.capacity") },
    {
      key: "discount",
      label: t("rooms.discount"),
      render: (val) => {
        return <Typography>{val as string}%</Typography>;
      },
    },
    {
      key: "facilities",
      label: t("rooms.facilities"),
      render: (val) => {
        const facilities = val as IFacility[];
        return (
          <>
            <Typography
              sx={{
                color: facilities?.length > 0 ? "" : theme.palette.error.main,
              }}
            >
              {facilities.length > 0
                ? facilities?.map((f) => f.name).join(", ")
                : t("rooms.Nofacilitiesavailable")}
            </Typography>
          </>
        );
      },
    },
  ];
  // const [selectedRoom,setSelectedRoom]=useState<null|IRoom>(null)

  const navigate = useNavigate();
  const actions = [
    {
      Icon: VisibilityIcon,
      label: t("users.view"),
      handler: (row: IRoom) => {
        console.log(row);
        handleClickOpen();
        setSelectedRoom(row);
      },
    },
    {
      Icon: EditIcon,
      label: t("users.edit"),
      handler: (row: IRoom) => {
        navigate(`/dashboard/rooms-data/${row._id}`);
        // setSelectedUser(row);
      },
    },
    {
      Icon: DeleteIcon,
      label: t("users.delete"),
      handler: (row: IRoom) => {
        console.log(row);
        handelDelete(row);
      },
    },
  ];

  const handleChangePage = (
    _event: React.ChangeEvent<unknown> | null,
    newPage: number
  ) => {
    console.log(newPage);
    setPage(newPage);
  };

  const query = useQueryClient();
  useEffect(() => {
    if (data) {
      if (page < data?.data?.totalCount) {
        query.prefetchQuery({
          queryKey: ["rooms", page + 1],
          queryFn: () => getDataRooms(page + 1),
        });
      }
    }
  }, [page, query, data]);
  return (
    <Box sx={{ mt: 2 }}>
      <SharedHeader
        title={t("dashboard.rooms")}
        to="/dashboard/rooms-data"
        btnText={t("dashboard.addNewRoom")}
      />
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <GenericTable
          paginated
          onView={onView}
          columns={columns}
          data={data?.data.rooms ?? []}
          onPageChange={handleChangePage}
          actions={actions}
          totalCount={data?.data.totalCount ?? 0}
        />
      )}
      <GenericDialog
        open={open}
        backgroundImage="linear-gradient(to right, #3252DF, #35C2FD)"
        maxWidth={room?.images.length ? "md" : "sm"}
        handleClose={handleClose}
        title={
          <Stack alignItems={"center"} sx={{ flex: 1 }}>
            <Typography
              sx={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}
            >
              {t("rooms.roomInfo")}
            </Typography>
          </Stack>
        }
        children={
          <>
            <Box
              sx={{
                "& .image-gallery-image": {
                  height: "400px !important",
                  objectFit: "cover !important",
                },
                "& .image-gallery-thumbnail .image-gallery-thumbnail-image": {
                  height: "80px !important",
                  objectFit: "cover !important",
                },
                "& .image-gallery-content.fullscreen .image-gallery-image": {
                  height: "100vh !important",
                  objectFit: "cover !important",
                },
              }}
            >
              <ImageGallery
                showPlayButton={false}
                showNav={false}
                disableKeyDown={true}
                items={
                  room?.images.map((img) => ({
                    original: img,
                    thumbnail: img,
                  })) ?? []
                }
              />
            </Box>
            <Stack spacing={2} sx={{ mt: 3 }}>
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AttachMoneyRoundedIcon
                      sx={{ color: theme.palette.error.main }}
                    />
                    <Typography
                      sx={{
                        textDecoration:
                          room && room.discount > 0 ? "line-through" : "none",
                        color:
                          room && room.discount > 0
                            ? theme.palette.error.main
                            : "text.primary",
                        opacity: room && room.discount > 0 ? 0.6 : 1,
                      }}
                    >
                      {t("ads.price")}: {room?.price} {t("booking.egp")}
                    </Typography>
                  </Stack>
                </Grid>
                {/* Discount */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocalOfferIcon color="primary" />
                    <Typography>
                      <strong>{t("rooms.discount")}:</strong> {room?.discount}%
                    </Typography>
                  </Stack>
                </Grid>
                {/* Final Price - Highlighted */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PaidRoundedIcon sx={{ color: "#3252DF" }} />{" "}
                    {/* primary.main */}
                    <Typography fontWeight="bold" sx={{ color: "#3252DF" }}>
                      {t("ads.finalPrice")}:{" "}
                      {room
                        ? (
                            room.price -
                            (room.price * room.discount) / 100
                          ).toFixed(2)
                        : "-"}{" "}
                      {t("booking.egp")}
                    </Typography>
                  </Stack>
                </Grid>
                {/* Capacity */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PeopleIcon color="primary" />
                    <Typography>
                      <strong>{t("rooms.capacity")}:</strong> {room?.capacity}
                    </Typography>
                  </Stack>
                </Grid>

                {/* Created By */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon color="primary" />
                    <Typography>
                      <strong>{t("rooms.createdBy")}:</strong>{" "}
                      {room?.createdBy.userName}
                    </Typography>
                  </Stack>
                </Grid>

                {/* Facilities */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon color="primary" sx={{ mt: "3px" }} />
                    <Typography sx={{ lineHeight: 1.6 }}>
                      <strong>{t("rooms.facilities")}:</strong>{" "}
                      <Typography
                        sx={{
                          color: room?.facilities?.length
                            ? ""
                            : theme.palette.error.main,
                        }}
                        component={"span"}
                      >
                        {room?.facilities.length
                          ? room?.facilities?.map((f) => f.name).join(", ")
                          : t("rooms.Nofacilitiesavailable")}
                      </Typography>
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </>
        }
      />

      {/* /* deLETE modal*/}

      <GenericDialog
        handleClose={handelCloseDelete}
        open={openDelete}
        title=""
        children={
          <Stack alignItems={"center"} direction={"column"} gap={2}>
            <Box component={"img"} src={deleteImg} width={128} height={128} />
            <Stack sx={{ textAlign: "center" }}>
              <Typography
                sx={{ color: theme.palette.error.main, fontWeight: "bold" }}
              >
                {t("ads.deleteThisAd")}
              </Typography>
              <Typography sx={{ color: theme.palette.secondary.main }}>
                {t("facilities.areYouSure")}
              </Typography>
            </Stack>
            <Stack direction={"row"} justifyContent={"end"} gap={2}>
              <Button
                variant="contained"
                onClick={handelDeleteRoom}
                sx={{ backgroundColor: theme.palette.error.main }}
                disabled={isDeleteing}
              >
                {isDeleteing ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{ color: "white", mr: 1 }}
                    />
                    {t("facilities.deleting")}
                  </>
                ) : (
                  t("facilities.delete")
                )}
              </Button>
              <Button variant="outlined" onClick={handelCloseDelete}>
                {t("facilities.cancel")}
              </Button>
            </Stack>
          </Stack>
        }
        maxWidth="sm"
      />
    </Box>
  );
}
