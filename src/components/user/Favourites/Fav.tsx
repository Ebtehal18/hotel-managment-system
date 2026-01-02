import {
  Box,
  Breadcrumbs,
  Grid,
  Typography,
  useTheme,
  Link,
  Stack,
  IconButton,
  Skeleton,
} from "@mui/material";
import { useGetFav } from "../../../hooks/useGetFav";

// import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { Stack } from "rsuite";
import roomImg from "../../../assets/room.webp";
import { Link as RouterDom, useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { UseFavorite } from "../../../context/FavaContext";
import { UseAuth } from "../../../context/AuthContext";
import empty from "../../../assets/empty-1-Cp9p7e3t.svg";

export default function Fav() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated ,isUser} = UseAuth();
const enabledFav=!!isAuthenticated&&!!isUser
  const { data, isLoading } = useGetFav(enabledFav);
  const rooms = data?.data.favoriteRooms[0]?.rooms;
  console.log(rooms);
  const navigate = useNavigate();
  const handelDetail = (id: string) => {
    navigate(`/room-detail/${id}`);
  };

  const { toggleFav, isFav } = UseFavorite();



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
        {t("user.myFavRooms")}
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
          {t("user.myFavRooms")}
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
      {/* Empty State - when array is empty */}
      {!isLoading && rooms?.length === 0 && (
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={3}
          sx={{ textAlign: "center" }}
        >
          <Box
            component="img"
            src={empty}
            alt="No rooms found"
            sx={{
              maxWidth: { xs: "80%", md: 400 },
              width: "100%",
              borderRadius: "15px",
            }}
          />
          <Typography variant="h5" color="text.primary" fontWeight={600}>
            {t("user.noFavoriteRooms") || "No rooms available"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("user.goHome")}
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
                    className="image"
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
                      onClick={() => toggleFav(room._id)}
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
      {/* {(data?.data?.favoriteRooms[0]?.rooms?.length ?? 0) > 1 && (
        <Stack
          direction="row"
          justifyContent="center"
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
            count={Math.ceil((data?.data?.favoriteRooms[0]?.rooms?.length ?? 0) / 8)}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      )} */}
    </Box>
  );
}
