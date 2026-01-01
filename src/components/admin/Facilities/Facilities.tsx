import { useEffect, useState } from "react";
import {
  getDataFacilities,
  useGetFacilities,
} from "../../../hooks/useGetFacilities";
import { useQueryClient } from "@tanstack/react-query";
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
import SkeletonTable from "../../../shared/GenericTable/SkeletonTable";
import GenericTable, {
  type IColumn,
} from "../../../shared/GenericTable/GenericTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from "react-i18next";
import type { IFacility } from "../../../hooks/useGetFacilities";
import SharedHeader from "../../../shared/SharedHeader";
import GenericDialog from "../../../shared/GenericDialog/GenericDialog";
import FaciliyiesData from "./FaciliyiesData";
import deleteImg from "../../../assets/delete.png";
import { useDeleteFacility } from "../../../hooks/useDeleteFacility";
import toast from "react-hot-toast";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EventIcon from "@mui/icons-material/Event";
import UpdateIcon from "@mui/icons-material/Update";
import BusinessIcon from "@mui/icons-material/Business";

export default function Facilities() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetFacilities(page);
  const { t } = useTranslation();
  const theme = useTheme();
  const [isEdit, setIsEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<null | IFacility>(
    null
  );

  const handleCloseView = () => setOpenView(false);
  const handleOpenView = () => setOpenView(true);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setSelectedFacility(null);
  };

  const handelCloseDelete = () => {
    setOpenDelete(false);
    setSelectedFacility(null);
  };
  const handelOpenDelete = () => setOpenDelete(true);

  const { mutate: delteFacility, isPending: isDeleteing } = useDeleteFacility(
    selectedFacility?._id ?? null
  );

  const handleChangePage = (
    _event: React.ChangeEvent<unknown> | null,
    newPage: number
  ) => {
    console.log(newPage);
    setPage(newPage);
  };

  const queryClient = useQueryClient();
  useEffect(() => {
    if (data) {
      if (page < data?.data?.totalCount) {
        queryClient.prefetchQuery({
          queryKey: ["facilities", page + 1],
          queryFn: () => getDataFacilities(page + 1),
        });
      }
    }
  }, [page, queryClient, data]);
  const handelEditing = (row: IFacility) => {
    setIsEdit(true);
    handleOpenAdd();
    setSelectedFacility(row);
  };
  const handelAdding = () => {
    setIsEdit(false);
    handleOpenAdd();
  };
  //open modal and set the sate
  const handelDelete = (row: IFacility) => {
    handelOpenDelete();
    setSelectedFacility(row);
  };
  //fun to delete the facility
  const handelDeleteFacility = () => {
    delteFacility(selectedFacility?._id ?? null, {
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.invalidateQueries({
          queryKey: ["facilities"],
        });
        handelCloseDelete();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message ?? "Something went wrong");
      },
    });
  };

  //open modal and set the sate
  const handelView = (row: IFacility) => {
    console.log(row);
    handleOpenView();
    setSelectedFacility(row);
  };
  const actions = [
    {
      Icon: VisibilityIcon,
      label: t("users.view"),
      handler: (row: IFacility) => {
        handelView(row);
      },
    },
    {
      Icon: EditIcon,
      label: t("users.edit"),
      handler: (row: IFacility) => {
        handelEditing(row);
      },
    },
    {
      Icon: DeleteIcon,
      label: t("users.delete"),
      handler: (row: IFacility) => {
        handelDelete(row);
      },
    },
  ];
  //cols
  const columns: IColumn<IFacility>[] = [
    { key: "name", label: t("facilities.name") },
    {
      key: "createdAt",
      label: t("facilities.createdAt"),
      render: (val) => {
        const time = val as string;
        return new Date(time).toLocaleDateString();
      },
    },
  ];

  return (
    <>
      <SharedHeader
        title={t("dashboard.facilities")}
        btnText={t("dashboard.addNewFacility")}
        onClick={handelAdding}
      />
      <Box sx={{ mt: 2 }}>
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <GenericTable
            paginated
            // onView={onView}
            columns={columns}
            data={data?.data.facilities ?? []}
            onPageChange={handleChangePage}
            actions={actions}
            totalCount={data?.data.totalCount ?? 0}
          />
        )}
      </Box>
      {/* in case of editing and adding  */}
      <GenericDialog
        title={
          isEdit ? t("facilities.editFacility") : t("dashboard.addNewFacility")
        }
        children={
          <FaciliyiesData
            handleCloseAdd={handleCloseAdd}
            isEditing={isEdit}
            selectedFacility={selectedFacility}
          />
        }
        actions
        handleClose={handleCloseAdd}
        open={openAdd}
        maxWidth="sm"
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
                {t("facilities.deleteThisFacility")}: {""}
                {selectedFacility?.name}
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
              {t("facilities.facilityInfo")}
            </Typography>
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              <Chip
                icon={<PersonIcon sx={{ color: "#fff !important" }} />}
                label={
                  <Typography>
                    {t("facilities.createdBy")}:{" "}
                    {selectedFacility?.createdBy.userName}
                  </Typography>
                }
                sx={{
                  backgroundColor: "#9c27b0",

                  color: "#fff",
                  mt: 1,
                }}
              />
            </Stack>
          </Stack>
        }
        children={
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonOutlineIcon fontSize="small" color="primary" />
                <Typography>
                  {t("facilities.createdBy")}:{" "}
                  {selectedFacility?.createdBy.userName}
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BusinessIcon fontSize="small" color="primary" />
                <Typography>
                  <Typography>
                    {t("facilities.name")}:{selectedFacility?.name}
                  </Typography>
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EventIcon fontSize="small" color="primary" />
                <Typography>
                  {t("facilities.createdAt")}:{" "}
                  {selectedFacility
                    ? new Date(selectedFacility.createdAt).toLocaleDateString()
                    : "-"}
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <UpdateIcon fontSize="small" color="primary" />
                <Typography>
                  {t("facilities.updatedAt")}:{" "}
                  {selectedFacility
                    ? new Date(selectedFacility.updatedAt).toLocaleDateString()
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
