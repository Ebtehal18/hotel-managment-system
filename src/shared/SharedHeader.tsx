import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function SharedHeader({title,onClick,to,btnText}:{title:string,onClick?:()=>void,to?:string,btnText?:string}) {
    const {t}=useTranslation()
    const theme=useTheme()
  return (
    <>
<Box sx={{display:"flex",justifyContent:"space-between",mb:2,flexDirection:{xs:"column",sm:"row"},gap:{xs:1,sm:0}}}>
  <Stack>
   <Typography sx={{fontWeight:500,fontSize:"1.25rem"}}>

          {title} {t('dashboard.tableDetails')}
        </Typography> 
        <Typography sx={{fontSize:"0.875rem",color:theme.palette.secondary.main}}> {t('dashboard.Youcancheck')}</Typography>
</Stack>
{to&&<Button component={Link} to={to} variant='contained' sx={{"&:hover":{color:"#fff"}}}>
        { btnText} 
        </Button>}
{onClick&&<Button onClick={onClick} variant='contained'>
        { btnText} 
        </Button>}
</Box>

</> 
  )
}
