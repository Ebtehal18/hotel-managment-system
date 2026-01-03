import { useQueryClient } from "@tanstack/react-query";
import { useGetAvailableRooms } from "../../../hooks/useGetAvaliableRooms";
import { useEffect, useState } from "react";
import { getDataRooms } from "../../../hooks/useGetAvaliableRooms";
import {
  Box,
  Breadcrumbs,
  Grid,
  IconButton,
  Link,
  Pagination,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterDom, useNavigate, useSearchParams } from "react-router-dom";
import roomImg from "../../../assets/room.webp";
import empty from "../../../assets/empty-1-Cp9p7e3t.svg";
import { UseFavorite } from "../../../context/FavaContext";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";

import toast from "react-hot-toast";

export default function Explore() {
  // const { endDate, capacity, startDate} = UseFilter();
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

const startDateParam = searchParams.get("start") || undefined;
const endDateParam = searchParams.get("end") || undefined;
const capacityParam = searchParams.get("capacity")
  ? Number(searchParams.get("capacity"))
  : undefined;
  // const capacityParam = capacity === 0 ? undefined : capacity;
  // console.log(capacityParam);
  // const startDateParam = startDate ? startDate.format("YYYY-MM-DD") : undefined;
  // const endDateParam = endDate ? endDate.format("YYYY-MM-DD") : undefined;

  const { data, isLoading } = useGetAvailableRooms(
    page,
    8,
    startDateParam,
    endDateParam,
    capacityParam
  );
  const theme = useTheme();

  const rooms = data?.data.rooms;
  console.log(rooms);
  const handleChangePage = (
    _event: React.ChangeEvent<unknown> | null,
    newPage: number
  ) => {
    console.log(newPage);
    setPage(newPage);
  };

  const { toggleFav, isFav } = UseFavorite();
  const handelToggle = (id: string) => {
    if (!localStorage.getItem("token")) {
              toast.error(t("user.please"));
      
      return;
    }
    toggleFav(id);
  };

  const queryClient = useQueryClient();
  useEffect(() => {
    if (data) {
      if (page < data?.data?.totalCount) {
        queryClient.prefetchQuery({
          queryKey: ["avaliableRooms", page + 1],
          queryFn: () =>
            getDataRooms(page + 1, 8, startDateParam, endDateParam, capacityParam),
        });
      }
    }
  }, [page, queryClient, data, capacityParam, startDateParam, endDateParam]);
  const navigate = useNavigate();

 
  const handelDetail = (id: string) => {
    navigate(`/room-detail/${id}`);
  };
  return (
    <Box sx={{ p: 5, mt: 3 }}>
      <Typography
        sx={{
          textAlign: "center",
          color: theme.palette.text.disabled,
          fontSize: "26px",
          fontWeight: 600,
        }}
      >
        {t("user.ExploreALLRooms")}
      </Typography>
      <Breadcrumbs maxItems={2} aria-label="breadcrumb">
        <Link
          component={RouterDom}
          underline="hover"
          color="inherit"
          to={"/"}
          sx={{ fontWeight: 600 }}
        >
          {t("user.home")}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          sx={{ color: theme.palette.text.disabled, fontWeight: 600 }}
        >
          {t("user.explore")}
        </Link>
      </Breadcrumbs>
      <Typography
        sx={{
          my: 3,
          color: theme.palette.text.disabled,
          fontWeight: 600,
          fontSize: "20px",
        }}
      >
        {t("user.allRooms")}
      </Typography>

      {/* Empty State - when array is empty */}
      {!isLoading && rooms?.length === 0 && (
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={3}
          sx={{ py: 10, textAlign: "center" }}
        >
          <Box
            component="img"
            src={empty}
            alt="No rooms found"
            sx={{ maxWidth: { xs: "80%", md: 400 }, width: "100%" }}
          />
          <Typography variant="h5" color="text.primary" fontWeight={600}>
            {t("user.noRoomsAvailable") || "No rooms available"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("user.try")}
          </Typography>
        </Stack>
      )}
      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={215}
                  sx={{ borderRadius: "15px" }}
                />
              </Grid>
            ))
          : rooms?.map((room) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={room._id}>
                <Box
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    width: "100%",
                    height: "100%",
                    borderRadius: "15px",
                    overflow: "hidden",
                    "&:hover .overlay": {
                      bottom: 0,
                    },
                    "&:hover .image": {
                      scale: 1.1,
                    },
                  }}
                >
                  <Box
                    component={"img"}
                    src={room.images[0] ?? roomImg}
                    sx={{
                      width: "100%",
                      borderRadius: "15px",
                      height: 215,
                      objectFit: "cover",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "#FF498B",
                      color: "#fff",
                      borderRadius: "10px",
                      px: 2,
                      py: 1,
                      zIndex: 2,
                    }}
                  >
                    <Typography component="span" sx={{ fontWeight: 600 }}>
                      {room.price}
                    </Typography>{" "}
                    {t("user.egp")} {t("user.pernight")}
                  </Box>
                  <Stack sx={{ position: "absolute", bottom: 10, left: 10 }}>
                    <Typography sx={{ color: "#fff", fontSize: "20px" }}>
                      {room.roomNumber}
                    </Typography>
                  </Stack>
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      left: 0,
                      bottom: "-100%",
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      transition: "all 0.3s ease",
                      borderRadius: "15px",
                      zIndex: 3,
                    }}
                  >
                    <IconButton
                      sx={{ p: 0 }}
                      onClick={() => handelToggle(room._id)}
                    >
                      {isFav(room._id) ? (
                        <FavoriteIcon color="error" sx={{ fontSize: 32 }} />
                      ) : (
                        <FavoriteBorderIcon
                          sx={{ color: "#fff", fontSize: 32 }}
                        />
                      )}
                    </IconButton>
                    <IconButton
                      onClick={() => handelDetail(room._id)}
                      sx={{ p: 0 }}
                    >
                      {" "}
                      <VisibilityIcon sx={{ color: "#fff", fontSize: 32 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
      </Grid>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        sx={{ mt: 2, direction: "ltr" }}
      >
        <Pagination
          onChange={handleChangePage}
          sx={{
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "primary.main",
              color: "#fff",
            },
          }}
          count={Math.ceil((data?.data.totalCount ?? 0) / 8)}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </Box>
  );
}
