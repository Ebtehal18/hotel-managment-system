import { useEffect, useState } from "react";
import {
  getDataAds,
  useGetAds,
  type IAds,
  type IRoomAds,
} from "../../../hooks/useGetAds";
import SkeletonTable from "../../../shared/GenericTable/SkeletonTable";
import GenericTable, {
  type IColumn,
} from "../../../shared/GenericTable/GenericTable";
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
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SharedHeader from "../../../shared/SharedHeader";
import GenericDialog from "../../../shared/GenericDialog/GenericDialog";
import AdsData from "./AdsData";
import { useDeleteAds } from "../../../hooks/useDeleteAds";
import toast from "react-hot-toast";
import deleteImg from "../../../assets/delete.png";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import PersonIcon from "@mui/icons-material/Person";
import ReactImageGallery from "react-image-gallery";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";

export default function Ads() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAds(page);
  const queryClient = useQueryClient();

  const { t } = useTranslation();
  const theme = useTheme();
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const handleCloseView = () => setOpenView(false);
  const handleOpenView = () => setOpenView(true);

  const handelOpenAddEdit = () => setOpenAddEdit(true);
  const handelCloseAddEdit = () => setOpenAddEdit(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAds, setSelectedAds] = useState<null | IAds>(null);
  const { mutate: deleteFacility, isPending: isDeleteing } = useDeleteAds(
    selectedAds?._id ?? null
  );

  const handelCloseDelete = () => {
    setOpenDelete(false);
    setSelectedAds(null);
  };
  const handelOpenDelete = () => {
    setOpenDelete(true);
  };
  //open modal and set the sate
  const handelDelete = (row: IAds) => {
    handelOpenDelete();
    setSelectedAds(row);
  };

  //fun to delete the facility
  const handelDeleteFacility = () => {
    deleteFacility(selectedAds?._id ?? null, {
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries({
          queryKey: ["ads"],
        });
        handelCloseDelete();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message ?? "Something went wrong");
      },
    });
  };
  const [isEdit, setIsEdit] = useState(false);

  //add
  const handelAdding = () => {
    setIsEdit(false);
    handelOpenAddEdit();
  };
  //update
  const handelEdit = (row: IAds) => {
    setIsEdit(true);
    handelOpenAddEdit();
    setSelectedAds(row);
  };
  //open modal and set the sate
  const handelView = (row: IAds) => {
    console.log(row);
    handleOpenView();
    setSelectedAds(row);
  };
  //cols
  const columns: IColumn<IAds>[] = [
    {
      key: "room",
      label: t("ads.roomNumber"),
      render: (val) => {
        const room = val as IRoomAds;
        return room.roomNumber;
      },
    },
    {
      key: "room",
      label: t("ads.price"),
      render: (val) => {
        const room = val as IRoomAds;
        return room.price;
      },
    },
    {
      key: "room",
      label: t("ads.capacity"),
      render: (val) => {
        const room = val as IRoomAds;
        return room.capacity;
      },
    },
    {
      key: "room",
      label: t("ads.discount"),
      render: (val) => {
        const room = val as IRoomAds;
        return `${room.discount}%`;
      },
    },
    {
      key: "isActive",
      label: t("ads.status"),
      render: (val) => {
        const isActive = val as boolean;

        return isActive ? (
          <Chip label={t("ads.Active")} color="success" />
        ) : (
          <Chip
            label={t("ads.inActive")}
            color="error"
            sx={{
              // backgroundColor: "primary.error",
              color: theme.palette.primary.contrastText,
            }}
          />
        );
      },
    },
  ];

  //  const handleClickOpen = () => {
  //   setOpen(true);
  // };
  const actions = [
    {
      Icon: VisibilityIcon,
      label: t("users.view"),
      handler: (row: IAds) => {
        handelView(row);
      },
    },
    {
      Icon: EditIcon,
      label: t("users.edit"),
      handler: (row: IAds) => {
        handelEdit(row);
      },
    },
    {
      Icon: DeleteIcon,
      label: t("users.delete"),
      handler: (row: IAds) => {
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
          queryKey: ["ads", page + 1],
          queryFn: () => getDataAds(page + 1),
        });
      }
    }
  }, [page, query, data]);
  return (
    <>
      <SharedHeader
        title={t("dashboard.ads")}
        btnText={t("dashboard.addNewAds")}
        onClick={handelAdding}
      />{" "}
      <Box sx={{ mt: 2 }}>
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <GenericTable
            paginated
            // onView={onView}
            columns={columns}
            data={data?.data.ads ?? []}
            onPageChange={handleChangePage}
            actions={actions}
            totalCount={data?.data.totalCount ?? 0}
          />
        )}
      </Box>
      <GenericDialog
        children={
          <AdsData
            handleClose={handelCloseAddEdit}
            isEditing={isEdit}
            selectedAds={selectedAds}
          />
        }
        title={!isEdit ? t("ads.addNewAds") : t("ads.editAds")}
        open={openAddEdit}
        handleClose={handelCloseAddEdit}
      />
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
                {t("ads.deleteThisAd")}
              </Typography>
              <Typography sx={{ color: theme.palette.text.disabled }}>
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
        // Updated gradient to match your primary blue + cyan accent
        backgroundImage="linear-gradient(to right, #3252DF, #35C2FD)"
        title={
          <Stack alignItems="center" sx={{ pb: 1.5, flex: 1 }}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {t("ads.adsInfo")}
            </Typography>

            <Stack
              direction={"row"}
              flexWrap={"wrap"}
              justifyContent={"center"}
              gap={2}
              sx={{ mt: 2 }}
            >
              {/* Status Chip - uses theme success/error */}
              <Chip
                icon={
                  selectedAds?.isActive ? (
                    <CheckCircleRoundedIcon sx={{ color: "#fff !important" }} />
                  ) : (
                    <CancelRoundedIcon sx={{ color: "#fff !important" }} />
                  )
                }
                label={
                  selectedAds?.isActive ? t("ads.active") : t("ads.inactive")
                }
                color={selectedAds?.isActive ? "success" : "error"}
              />

              {/* Room Number Chip - primary blue */}
              <Chip
                icon={<MeetingRoomIcon sx={{ color: "#fff !important" }} />}
                label={
                  <Typography variant="body2">
                    {t("booking.roomNumber")}: {selectedAds?.room.roomNumber}
                  </Typography>
                }
                sx={{
                  backgroundColor: theme.palette.primary.main, // theme primary.main
                  color: "white",
                  fontWeight: 500,
                }}
              />

              {/* Created By Chip - subtle purple accent from your primary.900 */}
              <Chip
                icon={<PersonIcon sx={{ color: "#fff !important" }} />}
                label={
                  <Typography variant="body2">
                    {t("ads.createdBy")}: {selectedAds?.createdBy.userName}
                  </Typography>
                }
                sx={{
                  backgroundColor: "#9D57D5", // primary.900 from your theme
                  color: "white",
                  fontWeight: 500,
                }}
              />
            </Stack>
          </Stack>
        }
        children={
          <>
            <Box
              sx={{
                "& .image-gallery-image": {
                  height: "300px !important",
                  objectFit: "cover !important",
                },
                "& .image-gallery-thumbnail .image-gallery-thumbnail-image": {
                  height: "50px !important",
                  objectFit: "cover !important",
                },
                "& .image-gallery-content.fullscreen .image-gallery-image": {
                  height: "100vh !important",
                  objectFit: "cover !important",
                },
              }}
            >
              <ReactImageGallery
                showPlayButton={false}
                showNav={false}
                disableKeyDown={true}
                items={
                  selectedAds?.room.images.map((img) => ({
                    original: img,
                    thumbnail: img,
                  })) ?? []
                }
              />
            </Box>
            <Grid container spacing={2} sx={{ mt: 3 }}>
              {/* Original Price */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AttachMoneyRoundedIcon
                    sx={{ color: theme.palette.error.main }}
                  />
                  <Typography
                    sx={{
                      textDecoration:
                        selectedAds && selectedAds?.room.discount > 0
                          ? "line-through"
                          : "none",
                      color:
                        selectedAds && selectedAds?.room.discount > 0
                          ? theme.palette.error.main
                          : "text.primary",
                      opacity:
                        selectedAds && selectedAds?.room.discount > 0 ? 0.6 : 1,
                    }}
                  >
                    {t("ads.price")}: {selectedAds?.room.price}{" "}
                    {t("booking.egp")}
                  </Typography>
                </Stack>
              </Grid>

              {/* Discount */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocalOfferRoundedIcon color="primary" />
                  <Typography>
                    {t("ads.discount")}: {selectedAds?.room.discount || 0}%
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
                    {selectedAds
                      ? (
                          selectedAds.room.price -
                          (selectedAds.room.price * selectedAds.room.discount) /
                            100
                        ).toFixed(2)
                      : "-"}{" "}
                    {t("booking.egp")}
                  </Typography>
                </Stack>
              </Grid>

              {/* Capacity */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <GroupsRoundedIcon color="primary" />
                  <Typography>
                    {t("ads.capacity")}: {selectedAds?.room.capacity}
                  </Typography>
                </Stack>
              </Grid>

              {/* Created At */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EventRoundedIcon color="primary" />
                  <Typography>
                    {t("ads.createdAt")}:{" "}
                    {selectedAds
                      ? new Date(selectedAds.createdAt).toLocaleDateString()
                      : "-"}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </>
        }
        maxWidth="md"
      />
    </>
  );
}
