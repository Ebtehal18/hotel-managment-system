import {
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import home from "../../../assets/home.png";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
// import { UseFilter } from "../../../context/FilterContex";
import MostPopularAds from "./MostPopularAds";
import Houses from "./Houses";
import Hotels from "./Hotels";
import HappyFamliy from "./HappyFamliy";
import { DateRangePicker, InputGroup, type PickerHandle } from "rsuite";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useRef, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
// import dayjs from "dayjs";
export default function UserHome() {
  const { t } = useTranslation();
  const theme = useTheme();
     const [capacity,setCapacity]=useState<number>(0)
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
   const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const navigate = useNavigate();
  const handelExplore = () => {
   if (!startDate || !endDate) return;

  const params = new URLSearchParams();
  params.set("start", startDate.format("YYYY-MM-DD"));
  params.set("end", endDate.format("YYYY-MM-DD"));
  if (capacity > 0) {
    params.set("capacity", capacity.toString());
  }

  navigate(`/explore?${params.toString()}`);
  };
  const pickerRef = useRef<PickerHandle>(null);

  const openCalendar = () => {
    if (pickerRef.current) {
      pickerRef.current.open?.();
    }
  };

  const handelPick = (value: Date[] | null) => {
    if (!value) {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    const [start, end] = value;
 const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

   const startStr = formatLocalDate(start);
  const endStr = end ? formatLocalDate(end) : null;
  
  setStartDate(dayjs(startStr));
  setEndDate(endStr ? dayjs(endStr) : null);
  };
  return (
    <Box sx={{ p: {xs:0,md:4}, mt: 2 }}>
      <Grid container spacing={2} justifyContent={"space-between"}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ p: {xs:2,md:3}}}>
          <Stack sx={{ alignItems: { xs: "center", md: "start" } }}>
            <Stack justifyContent={"center"}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "42px",
                  color: theme.palette.text.disabled,
                }}
              >
                {t("user.forget")}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "42px",
                  color: theme.palette.text.disabled,
                }}
              >
                {t("user.startNext")}
              </Typography>
            </Stack>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                width: { xs: "100%", sm: "65%" },
              }}
            >
              {t("user.desc")}
            </Typography>

            <Typography
              sx={{
                mt: 3,
                fontSize: "20px",
                fontWeight: 500,
                color: theme.palette.text.disabled,
              }}
            >
              {t("user.startBooking")}
            </Typography>
            <Paper
              elevation={2}
              sx={{ mt: 2, p: 3, width: { xs: "100%", sm: "80%" }}}
            >
              <Stack gap={1.5}>
                {/* date */}
                <InputLabel sx={{ color: theme.palette.text.disabled }}>
                  {t("user.pick")}
                </InputLabel>
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {/* // Wrap with InputGroup for left icon + bg */}
                  <InputGroup inside style={{ width: "100%", height: 60 }}>
                    {/* Left Calendar Icon with Background */}
                    <InputGroup.Addon
                      onClick={openCalendar}
                      style={{
                        cursor: "pointer",
                        backgroundColor: theme.palette.primary.main,
                        height: "100%",
                        display: "flex",
                        borderRadius: "8px 0 0 8px",
                        padding: "16px",
                        alignItems: "center",
                        justifyContent: "center",
                        // margin: '6px 12px',
                      }}
                    >
                      <CalendarMonthIcon
                        style={{ color: "#fff", fontSize: 24 }}
                      />
                    </InputGroup.Addon>

                    {/* DateRangePicker */}
                    <DateRangePicker
                      ref={pickerRef}
                      onChange={handelPick}
                      placeholder="Check-in ~ Check-out"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        fontFamily: "Rubik",
                      }}
                      caretAs={null}
                      className="custom-range-picker"
                    />
                  </InputGroup>
                </Stack>
                {/* capacity */}
                <InputLabel sx={{ color: theme.palette.text.disabled }}>
                  {t("user.capacity")}
                </InputLabel>
                <Box sx={{ position: "relative" }}>
                  <IconButton
                    disabled={capacity === 0}
                    onClick={() =>
                      setCapacity((prev) => {
                        if (Number(prev) > 1) {
                          return Number(prev) - 1;
                        } else {
                          return 1;
                        }
                      })
                    }
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      borderRadius: "8px 0 0 8px",
                      height: "100%",
                      p: 2,
                      bgcolor: theme.palette.error.main,
                      color: "#fff",
                      zIndex: 1,
                      "&:hover": {
                        bgcolor: theme.palette.error.dark,
                      },
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <TextField
                    fullWidth
                    value={capacity}
                    InputProps={{ readOnly: true }}
                    placeholder="1"
                    disabled
                    sx={{
                      borderRadius: "8px",
                      "& input": {
                        textAlign: "center",
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => setCapacity((prev) => prev + 1)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      borderRadius: "0  8px 8px 0",
                      height: "100%",
                      p: 2,
                      bgcolor: theme.palette.success.main,
                      color: "#fff",
                      zIndex: 1,
                      "&:hover": {
                        bgcolor: theme.palette.success.dark,
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <Button
                  disabled={!startDate || !endDate}
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handelExplore}
                >
                  {t("user.explore")}
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, sm: 1 }}>
          <Stack justifyContent="center" alignItems="center" sx={{ p: {xs:4,md:3} }}>
            <Box
              sx={{
                position: "relative",
                width: "fit-content",
              }}
            >
              {/* Frame */}
              <Box
                sx={{
                  position: "absolute",
                  top: {xs:20,md:40},
                  left: {xs:15,md:32},
                  width: "100%",
                  height: "100%",
                  border: "2px solid #E5E5E5",
                  transition: "all 0.4s ease",
                  borderRadius: "15px",
                  zIndex: 0,
                }}
                className="frame"
              />

              {/* Image */}
              <Box
                component="img"
                src={home}
                sx={{
                  height: 450,
                  position: "relative",
                  width:{xs:'85%',md:"100%"},
                  zIndex: 1,
                  transition: "all 0.4s ease",
                }}
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
     <Box sx={{ p: { xs: 2, md: 3 } }}>
  <MostPopularAds />

  {/* Houses: hidden on mobile */}
  <Box sx={{ display: { xs: "none", md: "block" } }}>
    <Houses />
  </Box>

  {/* Hotels: hidden on mobile */}
  <Box sx={{ display: { xs: "none", md: "block" } }}>
    <Hotels />
  </Box>

  {/* Testimonials always visible */}
  <HappyFamliy />
</Box>
    </Box>
  );
}
