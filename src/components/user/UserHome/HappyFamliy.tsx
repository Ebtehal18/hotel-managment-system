import {
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import { useRef } from "react";

import happy1 from "../../../assets/picture.png";
import happy2 from "../../../assets/happ-2.jpg";
import happy3 from "../../../assets/haap-3.jpg";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";

export default function HappyFamliy() {
  const { t } = useTranslation();
  const theme = useTheme();
  const sliderRef = useRef<Slider>(null);
  //After the component mounts, sliderRef.current will hold the actual instance of the react-slick slider.
  const testimonials = [
    { img: happy1, title: t("user.happ1"), desc: t("user.desc1"), rating: 5 },
    { img: happy2, title: t("user.happ2"), desc: t("user.desc2"), rating: 4 },
    { img: happy3, title: t("user.happ3"), desc: t("user.desc3"), rating: 5 },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Box sx={{ mt: 7 }}>
      <Slider ref={sliderRef} {...settings}>
        {testimonials.map((item, index) => (
          <Box key={index}>
            <Grid container spacing={4} alignItems="center">
              {/* Image Side */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack
                  justifyContent={{ xs: "center", md: "flex-end" }}
                  //   alignItems="center"
                  direction="row"
                  // sx={{ height: "100%" }}
                  sx={{
                    height: "100%",
                    py: { xs: 0, md: 6 }, // Optional: extra left padding if needed for right shift
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    {/* Gray Frame */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: -20,
                        right: 32,
                        width: "100%",
                        height: "100%",
                        border: "2px solid #E5E5E5",
                        borderRadius: "15px",
                        zIndex: 0,
                      }}
                    />

                    {/* Actual Image */}
                    <Box
                      component="img"
                      src={item.img}
                      alt="Happy family"
                      sx={{
                        height: { xs: 350, md: 500 },
                        width: "auto",
                        maxWidth: 360,
                        objectFit: "cover",
                        borderRadius: "15px 15px 100px 15px",
                        position: "relative",
                        zIndex: 1,
                        boxShadow: 3,
                      }}
                    />
                  </Box>
                </Stack>
              </Grid>

              {/* Text + Arrows Side */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack justifyContent="center" sx={{ height: "100%" }} gap={3}>
                  <Typography
                    sx={{
                      color: theme.palette.text.disabled,
                      fontSize: "24px",
                      fontWeight: 500,
                    }}
                  >
                    {t("user.happyFamily")}
                  </Typography>

                  {/* Stars */}
                  <Stack direction="row">
                    {Array.from({ length: 5 }, (_, i) =>
                      i < item.rating ? (
                        <StarIcon key={i} sx={{ color: "#FFCC47" }} />
                      ) : (
                        <StarBorderIcon key={i} sx={{ color: "#FFCC47" }} />
                      )
                    )}
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.disabled,
                      width: { xs: "100%", md: "65%" },
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                    {item.desc}
                  </Typography>

                  {/* Arrows below text */}
                  <Stack direction="row" gap={3} sx={{ mt: 3 }}>
                    <IconButton
                      onClick={() => sliderRef.current?.slickPrev()}
                      sx={{
                        border: `4px solid ${theme.palette.info.main}`,
                        "&:hover": { backgroundColor: "transparent" },
                      }}
                    >
                      <WestIcon sx={{ color: theme.palette.info.main }} />
                    </IconButton>

                    <IconButton
                      onClick={() => sliderRef.current?.slickNext()}
                      sx={{
                        border: `4px solid ${theme.palette.info.main}`,
                        "&:hover": { backgroundColor: "transparent" },
                      }}
                    >
                      <EastIcon sx={{ color: theme.palette.info.main }} />
                    </IconButton>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
