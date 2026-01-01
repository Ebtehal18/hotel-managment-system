import { Grid, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const theme = useTheme();
  
  return (
 <>
  <Grid container spacing={4} sx={{p:5}}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Typography sx={{fontSize:"20px"}}>
          {t("Staycation")
            .split("\n")
            .map((t, i) => (
              <span
              key={i}
                style={{
                  color:
                    i === 0
                      ? theme.palette.primary.main
                      : theme.palette.text.disabled,
                }}
              >
                {t}
              </span>
            ))}
        </Typography>
        <Typography sx={{color:"#b0b0b0"}}>
          {t('user.fDesc')}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3}}>
        <Typography sx={{color:theme.palette.text.disabled}}>
         {t("user.ForBeginners")}
        </Typography>
        <Stack sx={{mt:2}} gap={2}>
          <Typography sx={{color:"#b0b0b0"}}>
          {t('user.NewAccount')}
        </Typography>
        <Typography sx={{color:"#b0b0b0"}}>
          {t('user.StartBookingaRoom')}
        </Typography>
        <Typography sx={{color:"#b0b0b0"}}>
          {t('user.UsePayments')}
        </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3}}>
        <Typography sx={{color:theme.palette.text.disabled}}>
         {t("user.ExploreUs")}
        </Typography>
        <Stack sx={{mt:2}} gap={2}>
          <Typography sx={{color:"#b0b0b0"}}>
          {t('user.OurCareers')}
        </Typography>
        <Typography sx={{color:"#b0b0b0"}}>
          {t('user.Privacy')}
        </Typography>
        <Typography sx={{color:"#b0b0b0"}}>
          {t('user.TermsConditions')}
        </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3}}>
        <Typography sx={{color:theme.palette.text.disabled}}>
         {t("user.ConnectUs")}
        </Typography>
        <Stack sx={{mt:2}} gap={2}>
          <Typography sx={{color:"#b0b0b0"}}>
         support@staycation.id
        </Typography>
        <Typography sx={{color:"#b0b0b0"}}>
         021 - 2208 - 1996
        </Typography>
        <Typography sx={{color:"#b0b0b0"}}>
          Staycation, Kemang, Jakarta
        </Typography>
        </Stack>
      </Grid>
  
    </Grid>
    <Typography sx={{color:"#b0b0b0",textAlign:"center"}} >{t("user.copy")}</Typography>
    </>
  );
}
