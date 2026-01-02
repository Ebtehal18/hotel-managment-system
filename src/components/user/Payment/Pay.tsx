import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Breadcrumbs,
  CircularProgress,
  Link,
  Paper,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterDom, useParams } from "react-router-dom";
import {
  AddressElement,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { usePay } from "../../../hooks/usePay";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Pay() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const { bookingId } = useParams();
  console.log(bookingId);
  const { t } = useTranslation();
  const theme = useTheme();
  const steps = [t("user.billing"), t("user.pay"), t("user.Confirmation")];
  const elements = useElements();
  const stripe = useStripe();
  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };
  // console.log(activeStep)
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const { mutate: Pay, isPending } = usePay(bookingId ?? "");
  const queryClient = useQueryClient();
  const submitPaymentHandler = async () => {
    if (!elements || !stripe) return;
    const cardElement = elements.getElement("card");
    const { token, error } = await stripe.createToken(cardElement!);
    if (error) return;
    console.log(token?.id);
    Pay(
      { token: token.id },
      {
        onSuccess: (res) => {
          console.log(res);
          setActiveStep(2);
          queryClient.invalidateQueries({
            queryKey: ["myBooking"],
          });
          // toast.success(res.data.)
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Something Went Wrong");
        },
      }
    );
  };

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
          {t("user.Payment")}
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
            {t("user.Payment")}
          </Link>
        </Breadcrumbs>
      </Box>
      <Paper sx={{ width: { xs: "90%", md: "50%" }, mx: "auto", p: 5, mb: 3 }}>
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 2,

            "& .MuiStepIcon-root": {
              fontSize: 40, // size of the ball
              color: "grey.400", // inactive color
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: "primary.main", // active color
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: "success.main", // completed color
            },
            "& .MuiStepLabel-root": {
              flexDirection: "column",
              alignItems: "center",
            },
            "& .MuiStepLabel-labelContainer": {
              textAlign: "center",
              marginTop: 1,
            },
            "& .MuiStepLabel-label": {
              color: "grey.500", // inactive text color
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: "primary.main", // active text
              fontWeight: 600,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "success.main", // completed text
            },
          }}
        >
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {activeStep === 0 && (
              <AddressElement options={{ mode: "billing" }} />
            )}
            {activeStep === 1 && (
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                  backgroundColor: "#fff",
                  // maxWidth: "400px",
                  margin: "auto",
                }}
              >
                <CardElement />
              </Box>
            )}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                variant="outlined"
              >
                {t("user.back")}
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {activeStep === 0 && (
                <Button variant="contained" onClick={handleNext}>
                  {t("user.next")}
                </Button>
              )}
              {activeStep === 1 && (
                <Button
                  variant="contained"
                  disabled={isPending}
                  onClick={submitPaymentHandler}
                >
                  {isPending ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />

                      {t("user.confirming")}
                    </>
                  ) : (
                    t("user.confirm")
                  )}
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </Paper>
    </>
  );
}
