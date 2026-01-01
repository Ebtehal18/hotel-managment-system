import {
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useGetMostPopularAds } from "../../../hooks/useGetMostPopularAds";
import { useTranslation } from "react-i18next";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { UseFavorite } from "../../../context/FavaContext";
import FavoriteIcon from '@mui/icons-material/Favorite';
import toast from "react-hot-toast";

export default function MostPopularAds() {
  const { data: ads, isLoading } = useGetMostPopularAds();
  // console.log(ads?.data.ads)
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const handelDetail = (id: string) => {
    navigate(`/room-detail/${id}`);
  };

 
  const { toggleFav,isFav } = UseFavorite();
  const handelToggle=(id:string)=>{
   if(!localStorage.getItem("token")){
      toast.error("please login fisrst to add th room to fav list ")
      return
    } 
    toggleFav(id)
  }
  return (
    <>
      <Typography
        sx={{
          fontSize: "24px",
          color: theme.palette.text.disabled,
          fontWeight: 500,
          mb: 2,
        }}
      >
        {t("user.Mostpopularads")}
      </Typography>

      <Grid container spacing={2}>
        {/* Column 1 – Big image (always the first ad if exists) */}
        <Grid size={{ xs: 12, md: 4 }}>
          {ads?.data?.ads?.[0] ? (
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
                className="image"
                component="img"
                src={ads.data.ads[0].room.images?.[0]}
                alt="Popular ad"
                sx={{
                  width: "100%",
                  height: "100%",
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
                  {ads.data.ads[0].room.price}
                </Typography>{" "}
                {t("user.egp")} {t("user.pernight")}
              </Box>
              <Stack sx={{ position: "absolute", bottom: 10, left: 10 }}>
                <Typography sx={{ color: "#fff", fontSize: "20px" }}>
                  {ads.data.ads[0].room.roomNumber}
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
                <IconButton sx={{p:0}} onClick={() => handelToggle(ads.data.ads[0].room._id)}>
                  {isFav(ads.data.ads[0].room._id)?<FavoriteIcon color="error" sx={{fontSize:32}}/>:
                  
                  <FavoriteBorderIcon sx={{ color: "#fff", fontSize: 32 }} />
              }
                </IconButton>
                <IconButton
                  onClick={() => handelDetail(ads.data.ads[0].room._id)}
                  sx={{p:0}}
                >
                  {" "}
                  <VisibilityIcon sx={{ color: "#fff", fontSize: 32 }} />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
                borderRadius: "15px",
              }}
            >
              <Typography color="text.secondary">{t("user.noads")}</Typography>
            </Box>
          )}
        </Grid>

        {/* Column 2 – ads[1] and ads[2] */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            {[1, 2].map((index) => {
              const ad = ads?.data?.ads?.[index];
              return ad ? (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: "100%",
                    borderRadius: "15px",
                    overflow: "hidden",
                      "&:hover .overlay": {
                  bottom: 0,
                },
                "&:hover .image": {
                  scale: 1.1,
                },
                    height: 240,
                  }}
                >
                  <Box
                    component="img"

                                    className="image"

                    src={ad.room.images?.[0]}
                    alt="Popular ad"
                    sx={{ width: "100%", height: "100%", objectFit: "cover",                  transition: "all 0.3s ease",
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
                      {ad.room.price}
                    </Typography>{" "}
                    {t("user.egp")} {t("user.pernight")}
                  </Box>
                   <Stack sx={{ position: "absolute", bottom: 10, left: 10 }}>
                <Typography sx={{ color: "#fff", fontSize: "20px" }}>
                  {ad.room.roomNumber}
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
                <IconButton sx={{p:0}} onClick={() => handelToggle(ad.room._id)}>
                        {isFav(ad.room._id)?<FavoriteIcon color="error" sx={{fontSize:32}}/>:
                  
                  <FavoriteBorderIcon sx={{ color: "#fff", fontSize: 32 }} />
              }
                </IconButton>
                <IconButton
                  onClick={() => handelDetail(ad.room._id)}
                  sx={{p:0}}
                >
                  {" "}
                  <VisibilityIcon sx={{ color: "#fff", fontSize: 32 }} />
                </IconButton>
              </Box>
                </Box>
              ) : null; // Don't render anything if no ad
            })}
          </Stack>
        </Grid>

        {/* Column 3 – ads[3] and ads[4] */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            {[3, 4].map((index) => {
              const ad = ads?.data?.ads?.[index];
              return ad ? (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: "100%",
                    borderRadius: "15px",
                    overflow: "hidden",
                    height: 240,
                          "&:hover .overlay": {
                  bottom: 0,
                },
                "&:hover .image": {
                  scale: 1.1,
                },
                  }}
                >
                  <Box
                    component="img"
                    className="image"
                    src={ad.room.images?.[0]}
                    alt="Popular ad"
                    sx={{ width: "100%", height: "100%", objectFit: "cover",  transition: "all 0.3s ease" }}
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
                      {ad.room.price}
                    </Typography>{" "}
                    {t("user.egp")} {t("user.pernight")}
                  </Box>
                         <Stack sx={{ position: "absolute", bottom: 10, left: 10 }}>
                <Typography sx={{ color: "#fff", fontSize: "20px" }}>
                  {ad.room.roomNumber}
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
                <IconButton sx={{p:0}} onClick={() => handelToggle(ad.room._id)}>
                        {isFav(ad.room._id)?<FavoriteIcon color="error" sx={{fontSize:32}}/>:
                  
                  <FavoriteBorderIcon sx={{ color: "#fff", fontSize: 32 }} />
              }
                </IconButton>
                <IconButton
                  onClick={() => handelDetail(ad.room._id)}
                  sx={{p:0}}
                >
                  {" "}
                  <VisibilityIcon sx={{ color: "#fff", fontSize: 32 }} />
                </IconButton>
              </Box>
                </Box>
              ) : null;
            })}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
