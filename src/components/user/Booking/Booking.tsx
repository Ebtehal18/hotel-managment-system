import { useEffect, useState, type ReactNode } from "react";
import {
  getDataMyBooking,
  useGetMyBooking,
  type Booking,
} from "../../../hooks/useGetUserBooking";
import { useQueryClient } from "@tanstack/react-query";
import type { IColumn } from "../../../shared/GenericTable/GenericTable";
import { useTranslation } from "react-i18next";
import SkeletonTable from "../../../shared/GenericTable/SkeletonTable";
import GenericTable from "../../../shared/GenericTable/GenericTable";
import {
  Box,
  Breadcrumbs,
  Chip,
  Typography,
  useTheme,
  Link,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useGetRoomDetails } from "../../../hooks/UseGetRoomDetails";
import BedIcon from "@mui/icons-material/Bed";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Link as RouterDom } from "react-router-dom";
import BookingsIcon from "@mui/icons-material/BookOnline";
import PendingIcon from "@mui/icons-material/PendingActions";
import DoneIcon from "@mui/icons-material/CheckCircle";
import { UseAuth } from "../../../context/AuthContext";
export default function UserBooking() {
  const [page, setPage] = useState(1);
   const { isAuthenticated ,isUser} = UseAuth();
const enabledFav=!!isAuthenticated&&!!isUser

  const { data, isLoading } = useGetMyBooking(page,enabledFav);
  console.log(data?.data.myBooking);
  // const {data:roomDatils}=useGetRoomDetails(data?.data.myBooking)
  const theme = useTheme();
  const { t } = useTranslation();
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
          queryKey: ["myBooking", page + 1],
          queryFn: () => getDataMyBooking(page + 1),
        });
      }
    }
  }, [page, queryClient, data]);

  const RoomCell = ({ roomId }: { roomId: string }) => {
    const { data } = useGetRoomDetails(roomId);
    return (
      data?.data.room.roomNumber ?? <BedIcon sx={{ color: "primary.main" }} />
    );
  };
  const columns: IColumn<Booking>[] = [
    {
      key: "room",
      label: t("user.room"),
      render: (val) => <RoomCell roomId={val as string} />,
    },
    {
      key: "startDate",
      label: t("user.startDate"),
      render: (val) => {
        const time = val as string;
        return new Date(time).toLocaleDateString();
      },
    },
    {
      key: "endDate",
      label: t("user.endDate"),
      render: (val) => {
        const time = val as string;
        return new Date(time).toLocaleDateString();
      },
    },
    {
      key: "totalPrice",
      label: t("user.totalPrice"),
      render: (val) => {
        const price = val as string;
        return `${price} ${t("user.egp")}`;
      },
    },
    {
      key: "status",
      label: t("user.status"),
      render: (val) => {
        const status = val as string;
        switch (status) {
          case "pending":
            return (
              <Chip
                sx={{
                  bgcolor: "#ed6c02",
                  color: "#fff",
                }}
                label={t("user.pending")}
              />
            );
          case "completed":
            return (
              <Chip
                sx={{
                  bgcolor: "#2e7d32",
                  color: "#fff",
                }}
                label={t("user.completed")}
              />
            );
        }
      },
    },

    {
      key: "_id",
      label: t("user.payNow"),
      render: (val, row) => {
        const pay = val as ReactNode;
        const data = row as Booking;
        return (
          <>
            {data.status === "pending" ? (
              <Link
                component={RouterDom}
                to={`/checkOut/${pay}`}
                underline="none"
                sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
              >
                <PaymentsIcon />
                {t("user.payNow")}
              </Link>
            ) : null}
          </>
        );
      },
    },
  ];
  //  "completed"
  const totalBookings = data?.data.myBooking.length ?? 0;
  const numOfPending =
    data?.data.myBooking.filter((b) => b.status === "pending").length ?? 0;
  const numOfCompleted =
    data?.data.myBooking.filter((b) => b.status === "completed").length ?? 0;

  // Better: Use accurate counts when backend provides them
  // const numOfPending = stats?.pending ?? 0;
  // const numOfCompleted = stats?.completed ?? 0;

  const pendingPercentage =
    totalBookings > 0 ? (numOfPending / totalBookings) * 100 : 0;
  const completedPercentage =
    totalBookings > 0 ? (numOfCompleted / totalBookings) * 100 : 0;

  const cards = [
    {
      icon: <BookingsIcon fontSize="large" />,
      text: "Total Bookings",
      desc: "All bookings you have made",
      bg: "#1976d2",
      val: totalBookings,
      iconBg:
        "linear-gradient(135deg, rgba(25, 118, 210, 0.2) 0%, rgba(25, 118, 210, 0.1) 100%)",
      // No progress bar for total
    },
    {
      icon: <PendingIcon fontSize="large" />,
      text: "Pending",
      desc: "Bookings awaiting payment",
      bg: "#ed6c02",
      val: numOfPending,
      iconBg:
        "linear-gradient(135deg, rgba(237, 108, 2, 0.2) 0%, rgba(237, 108, 2, 0.1) 100%)",
      progress: pendingPercentage,
      progressColor: "#ed6c02",
    },
    {
      icon: <DoneIcon fontSize="large" />,
      text: "Completed",
      desc: "Successfully paid bookings",
      bg: "#2e7d32",
      val: numOfCompleted,
      iconBg:
        "linear-gradient(135deg, rgba(46, 125, 50, 0.32) 0%, rgba(46, 125, 50, 0.1) 100%)",
      progress: completedPercentage,
      progressColor: "#2e7d32",
    },
  ];
  return (
    <>
      <Box sx={{ p: 5, mt: 3 }}>
        <Typography
          sx={{
            textAlign: "center",
            color: theme.palette.text.disabled,
            fontSize: "26px",
            fontWeight: 600,
          }}
        >
          {t("user.myBooking")}
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
            {t("user.myBooking")}
          </Link>
        </Breadcrumbs>
        <Grid container spacing={3} sx={{ my: 2 }}>
          {cards.map((card, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                sx={{
                  bgcolor: "#fff",
                  color: card.bg,
                  borderRadius: 3,
                  boxShadow: 3,
                  height:220
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "8px",
                        backgroundImage: card.iconBg,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography variant="h6">{card.text}</Typography>
                  </Box>

                  <Typography variant="h4" mt={2} fontWeight="bold">
                    {card.val}
                  </Typography>

                  <Typography variant="body2" mt={1} sx={{ opacity: 0.9 }}>
                    {card.desc}
                  </Typography>
                  {card.progress !== undefined && (
                    <Box mt={3}>
                      <Box
                        sx={{
                          height: 8,
                          width: "100%",
                          backgroundColor: "#e0e0e0",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${card.progress}%`,
                            backgroundColor: card.progressColor,
                            borderRadius: 4,
                            transition: "width 0.6s ease-in-out",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={0.5}
                      >
                        {card.progress.toFixed(1)}% of total bookings
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {isLoading ? (
          <SkeletonTable />
        ) : (
          <GenericTable
            paginated
            // onView={onView}
            columns={columns}
            data={data?.data.myBooking ?? []}
            onPageChange={handleChangePage}
            // actions={actions}
            totalCount={data?.data.totalCount ?? 0}
          />
        )}
      </Box>
    </>
  );
}
