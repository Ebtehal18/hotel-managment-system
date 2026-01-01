import { useQueryClient } from '@tanstack/react-query'
import { UseFilter } from '../../../context/FilterContex'
import { useGetAvailableRooms } from '../../../hooks/useGetAvaliableRooms'
import { useEffect, useState } from 'react'
import { getDataRooms } from '../../../hooks/useGetAvaliableRooms'
import { Box, Breadcrumbs, Grid, Link, Pagination, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterDom } from 'react-router-dom'
import roomImg from '../../../assets/room.webp'

export default function Explore() {
  const {endDate,capacity,startDate}=UseFilter()
    const [page,setPage]=useState(1)
  const {t}=useTranslation()
  const capacityParam = capacity === 0? undefined : capacity;
  console.log(capacityParam)
  const {data,isLoading}=useGetAvailableRooms(page,8,startDate,endDate,capacityParam)
  const theme = useTheme();

  const rooms=data?.data.rooms
  console.log(rooms)
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
          queryKey: ["avaliableRooms", page + 1],
          queryFn: () => getDataRooms(page + 1,8,startDate,endDate,capacity),
        });
      }
    }
  }, [page, queryClient, data]);
  return (
    <Box sx={{p:5,mt:3}}>
      
    <Typography sx={{textAlign:"center",color:theme.palette.text.disabled,fontSize:"26px",fontWeight:600}}>{t("user.ExploreALLRooms")}</Typography>
       <Breadcrumbs maxItems={2} aria-label="breadcrumb">
        <Link component={RouterDom} underline="hover" color="inherit" to={'/'} sx={{fontWeight:600}}>
        {t("user.home")}
        </Link>
        <Link underline="hover" color="inherit" sx={{color:theme.palette.text.disabled,fontWeight:600}}>
          {t("user.explore")}
        </Link>
      </Breadcrumbs>
      <Typography sx={{my:3,color:theme.palette.text.disabled,fontWeight:600,fontSize:"20px"}}>{t("user.allRooms")}</Typography>
      {/* Loading */}
      {isLoading && (
        <Typography textAlign="center" sx={{ py: 8 }}>
          Loading rooms...
        </Typography>
      )}

      {/* Empty State - when array is empty */}
      {!isLoading && rooms?.length === 0 && (
        <Stack alignItems="center" justifyContent="center" spacing={3} sx={{ py: 10, textAlign: 'center' }}>
          <Box
            component="img"
            src="https://uploads.toptal.io/blog/image/128036/toptal-blog-image-1548744910796-4fb846dad056fa8c97d5c53dafcea381.png"
            alt="No rooms found"
            sx={{ maxWidth: { xs: '80%', md: 400 }, width: '100%' }}
          />
          <Typography variant="h5" color="text.primary" fontWeight={600}>
            {t('user.noRoomsAvailable') || 'No rooms available'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your dates, capacity, or remove some filters.
          </Typography>
        </Stack>
      )}
    <Grid container spacing={2}  >
{rooms?.map(room=><Grid size={{xs:12,sm:6,md:3}} key={room._id}>
<Box>
  <Box component={'img'} src={room.images[0]??roomImg} sx={{width:"100%",borderRadius:"15px",height:215,objectFit:"cover"}}/>
</Box>
</Grid>)}
    </Grid>
    <Stack direction={'row'}  justifyContent={'center'} sx={{mt:2,direction:"ltr"}}>
      <Pagination onChange={handleChangePage} sx={{"& .MuiPaginationItem-root.Mui-selected": {
      backgroundColor: "primary.main",
      color: "#fff",
    
    },}} count={Math.ceil((data?.data.totalCount??0)/8)} variant="outlined" shape="rounded" />
    </Stack>
    </Box>
  )
}
