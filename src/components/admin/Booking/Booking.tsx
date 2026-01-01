import { useQueryClient } from "@tanstack/react-query";
import {
  getDataBooking,
  useGetBooking,
  type IBooking,
  type IRoomBooking,
} from "../../../hooks/useGetBooking";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from "react-i18next";
import type { IColumn } from "../../../shared/GenericTable/GenericTable";
import SkeletonTable from "../../../shared/GenericTable/SkeletonTable";
import GenericTable from "../../../shared/GenericTable/GenericTable";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import SharedHeader from "../../../shared/SharedHeader";
import GenericDialog from "../../../shared/GenericDialog/GenericDialog";
import deleteImg from "../../../assets/delete.png";
import { useDeleteBooking } from "../../../hooks/useDeleteBooking";
import toast from "react-hot-toast";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventIcon from "@mui/icons-material/Event";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";

export default function Booking() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetBooking(page);
  console.log(data?.data.booking);
  const { t } = useTranslation();
  const theme = useTheme();
  const [openView, setOpenView] = useState(false);
  const queryClient = useQueryClient();

  const [openDelete, setOpenDelete] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<null | IBooking>(null);

  const handleCloseView = () => setOpenView(false);
  const handleOpenView = () => setOpenView(true);

  const handelCloseDelete = () => {
    setOpenDelete(false);
    setSelectedBooking(null);
  };
  const handelOpenDelete = () => setOpenDelete(true);
  //open modal and set the sate
  const handelDelete = (row: IBooking) => {
    handelOpenDelete();
    setSelectedBooking(row);
  };
  const { mutate: delteBooking, isPending: isDeleteing } = useDeleteBooking(
    selectedBooking?._id ?? null
  );

  //fun to delete the facility
  const handelDeleteFacility = () => {
    delteBooking(selectedBooking?._id ?? null, {
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries({
          queryKey: ["booking"],
        });
        handelCloseDelete();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message ?? "Something went wrong");
      },
    });
  };

  const columns: IColumn<IBooking>[] = [
    {
      key: "room",
      label: t("booking.roomNumber"),
      render: (val) => {
        const room = val as IRoomBooking;
        return room?.roomNumber;
      },
    },

    {
      key: "startDate",
      label: t("booking.startDate"),
      render: (val) => {
        const time = val as string;
        return new Date(time).toLocaleDateString();
      },
    },
    {
      key: "endDate",
      label: t("booking.endDate"),
      render: (val) => {
        const time = val as string;
        return new Date(time).toLocaleDateString();
      },
    },
    {
      key: "totalPrice",
      label: t("booking.totalPrice"),
      render: (val) => {
        const price = val as string;
        return `${price} EGP`;
      },
    },

    {
      key: "status",
      label: t("booking.status"),
      render: (val) => {
        const status = val as string;
        return status === "completed" ? (
          <Chip label={status} color="success" />
        ) : (
          <Chip
            label={status}
            sx={{
              backgroundColor: "#ea7d25",
              color: theme.palette.primary.contrastText,
            }}
          />
        );
      },
    },
  ];
  //open modal and set the sate
  const handelView = (row: IBooking) => {
    console.log(row);
    handleOpenView();
    setSelectedBooking(row);
  };
  const actions = [
    {
      Icon: VisibilityIcon,
      label: t("users.view"),
      handler: (row: IBooking) => {
        console.log(row);
        handelView(row);
        // setSelectedRoom(row);
      },
    },

    {
      Icon: DeleteIcon,
      label: t("users.delete"),
      handler: (row: IBooking) => {
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
  useEffect(() => {
    if (data) {
      if (page < data?.data?.totalCount) {
        queryClient.prefetchQuery({
          queryKey: ["booking", page + 1],
          queryFn: () => getDataBooking(page + 1),
        });
      }
    }
  }, [page, queryClient, data]);
  return (
    <>
      <SharedHeader title={t("dashboard.bookings")} />
      <Box sx={{ mt: 2 }}>
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <GenericTable
            paginated
            // onView={onView}
            columns={columns}
            data={data?.data.booking ?? []}
            onPageChange={handleChangePage}
            actions={actions}
            totalCount={data?.data.totalCount ?? 0}
          />
        )}
      </Box>
      {/* deLETE modal*/}

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
                {t("booking.deleteThisBooking")}
              </Typography>
              <Typography sx={{ color: theme.palette.secondary.main }}>
                {t("facilities.areYouSure")}
              </Typography>
            </Stack>
            <Stack direction={"row"} justifyContent={"end"} gap={2}>
              <Button
                variant="contained"
                onClick={handelDeleteFacility}
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
      {/* view mo */}
      <GenericDialog
        handleClose={handleCloseView}
        open={openView}
        backgroundImage="linear-gradient(to right, #3252DF, #35C2FD)"
        title={
          <Stack alignItems={"center"} sx={{ flex: 1, pb: 1.5 }}>
            <Typography
              sx={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}
            >
              {t("booking.bookingInfo")}
            </Typography>
            <Stack
              direction={"row"}
              flexWrap={"wrap"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={2}
              sx={{ mt: 2 }}
            >
              <Chip
                icon={
                  selectedBooking?.status === "completed" ? (
                    <CheckCircleIcon sx={{ color: "#fff !important" }} />
                  ) : (
                    <WarningAmberIcon sx={{ color: "#fff !important" }} />
                  )
                }
                label={<Typography>{selectedBooking?.status}</Typography>}
                sx={{
                  backgroundColor:
                    selectedBooking?.status === "completed"
                      ? "#2e7d32" // success
                      : "#ea7d25", // warning
                  color: "white",
                }}
              />

              <Chip
                icon={<MeetingRoomIcon sx={{ color: "#fff !important" }} />}
                label={
                  <Typography>
                    {t("booking.roomNumber")}:{" "}
                    {selectedBooking?.room.roomNumber}
                  </Typography>
                }
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              />

              <Chip
                icon={<PersonIcon sx={{ color: "#fff !important" }} />}
                label={
                  <Typography>
                    {t("booking.user")}: {selectedBooking?.user.userName}
                  </Typography>
                }
                sx={{
                  backgroundColor: "#9c27b0",
                  color: "white",
                }}
              />
            </Stack>
          </Stack>
        }
        children={
          <Grid container spacing={2}>
            {/* Start Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayIcon fontSize="small" color="primary" />
                <Typography>
                  {t("booking.startDate")}:{" "}
                  {selectedBooking
                    ? new Date(selectedBooking.startDate).toLocaleDateString()
                    : "-"}
                </Typography>
              </Stack>
            </Grid>

            {/* End Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EventIcon fontSize="small" color="primary" />
                <Typography>
                  {t("booking.endDate")}:{" "}
                  {selectedBooking
                    ? new Date(selectedBooking.endDate).toLocaleDateString()
                    : "-"}
                </Typography>
              </Stack>
            </Grid>

            {/* Total Price */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AttachMoneyIcon fontSize="small" color="primary" />
                <Typography>
                  {t("booking.totalPrice")}: {selectedBooking?.totalPrice}{" "}
                  {t("booking.egp")}
                </Typography>
              </Stack>
            </Grid>

            {/* Created At */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon fontSize="small" color="primary" />
                <Typography>
                  {t("booking.createdAt")}:{" "}
                  {selectedBooking
                    ? new Date(selectedBooking.createdAt).toLocaleDateString()
                    : "-"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        }
        maxWidth="sm"
      />
    </>
  );
}
