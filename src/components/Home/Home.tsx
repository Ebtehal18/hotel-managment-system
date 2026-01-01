import { useEffect, useState } from "react"
import type { IDash } from "../../types/dashboard"
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import BusinessIcon from '@mui/icons-material/Business';
import { axiosPrivateInstance } from "../../services/api/apiInstance";
import { Admin } from "../../services/api/apiConfig";
import {   Box, Grid, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [chartData,setChartData]=useState<null|IDash>(null)
  const [isLoading,setIsLoading]=useState(false)
    const theme=useTheme()
  const {t}=useTranslation()

  const cards=[
    {
Icon:BedroomParentIcon,
val:chartData?.rooms,
name:t("dashboard.rooms")
    },
    {
Icon:BusinessIcon,
val:chartData?.facilities,
name:t("dashboard.facilities")


    },
    {
Icon:FeaturedVideoIcon,
val:chartData?.ads,
name:t("dashboard.ads")


    }
  ]
  const bookingData = {
  labels: [t("dashboard.pending"), t("dashboard.completed")],
  datasets: [
    {
      data: [chartData?.bookings.pending, chartData?.bookings.completed],
      backgroundColor:   [theme.palette.primary[100], // "#5368F0"
        theme.palette.primary[900],] // "#9D57D5",
    },
  ],
};
  const usersData = {
  labels: [t("dashboard.user"), t("dashboard.admin")],
  datasets: [
    {
      data: [chartData?.users.user, chartData?.users.admin],
      backgroundColor:   [theme.palette.primary[200], // "#5368F0"
        theme.palette.warning.main,] // "#9D57D5",
    },
  ],
};
  const getChartData=async()=>{
    setIsLoading(true)
    try {
      const res=await axiosPrivateInstance.get(Admin.dashboard)
    setChartData(res.data.data)
    } catch (error) { 
      console.log(error)
     }finally{
      setIsLoading(false)
     }
  }
useEffect(()=>{
getChartData()
},[])
const CardSkeleton=()=> {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        backgroundColor: theme.palette.primary.dark,
        height: 155,
        borderRadius: "0.75rem",
        p: 3,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack direction="column" spacing={1}>
        <Skeleton
          variant="text"
          width={80}
          height={40}
          sx={{
            bgcolor: theme.palette.primary.light, 
            borderRadius: 1,
          }}
        />
        <Skeleton
          variant="text"
          width={100}
          height={20}
          sx={{
            bgcolor: theme.palette.primary.light,
            borderRadius: 1,
          }}
        />
      </Stack>

      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: theme.palette.info.light,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="circular"
          width={36}
          height={36}
          sx={{ bgcolor: theme.palette.info.main }}
        />
      </Box>
    </Stack>
  );
}
  return (
    <>
    <Grid container spacing={2} sx={{mt:{sm:5}}}>
      {isLoading?Array(3)
      .fill(0)
      .map((_, i) => (
        <Grid key={i} size={{xs:12,sm:6,md:4}}>
          <CardSkeleton />
        </Grid>
      )):cards.map(({Icon,val,name},index)=>  <Grid key={index} alignItems={'center'} size={{xs:12,sm:6,md:4}}>
        <Stack sx={{backgroundColor:theme.palette.primary.dark,height:155,borderRadius:"0.75rem",p:3}} alignItems={'center'} direction={'row'} justifyContent={'space-between'}  >
     <Stack direction={'column'}>
           <Typography sx={{color:theme.palette.primary.contrastText,fontweight:500,fontSize:"2.125rem"}}>          {val}
</Typography>
          <Typography sx={{color:theme.palette.primary.contrastText}}>          {name}
</Typography>
     </Stack>

<Stack sx={{width:64,height:64,borderRadius:"50%",backgroundColor:theme.palette.info.light}} justifyContent={'center'} alignItems={'center'}>
       <Icon sx={{width:36,height:36,color:theme.palette.info.main}}/>

</Stack>
        </Stack>
  </Grid>)}

 
</Grid>
{/* pie chart */}
   <Grid  container spacing={2} justifyContent={'center'} sx={{mt:5,p:3}}>
  
    <Grid  alignItems={'center'} size={{xs:12,sm:4}} justifyContent={'center'}>

        <Doughnut data={bookingData} />


    </Grid>
 <Grid
  container
  size={{xs:12,sm:4}}
  justifyContent="center"
  alignItems="center"
>
  <Stack
    justifyContent="center"
    alignItems="center"
    sx={{
      p: 4,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      borderRadius: "1rem",
   width: "100%",     
    maxWidth: 380,     
    }}
  >
    <Box sx={{ width: 110, height: 110 }}>
      <Doughnut
        data={usersData}
        
        options={{
          
          cutout: "90%",
          plugins: {
            legend: { display: false },
          },
        }}
        />
        </Box>

    <Box sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Box
          sx={{
            width: 12,
            height: 12,
            backgroundColor: theme.palette.warning.main,
            borderRadius: "50%",
          }}
        />
        <Typography>
          {t("dashboard.admin")}: {chartData?.users.admin}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" gap={1}>
        <Box
          sx={{
            width: 12,
            height: 12,
            backgroundColor: theme.palette.primary[200],
            borderRadius: "50%",
          }}
        />
        <Typography>
          {t("dashboard.user")}: {chartData?.users.user}
        </Typography>
      </Stack>
    </Box>
  </Stack>
</Grid>

   </Grid>
 
    </>
  )
}
