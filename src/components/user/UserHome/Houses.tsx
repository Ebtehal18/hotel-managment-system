import { Box,  Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import house1 from '../../../assets/house-1.png';
import house2 from '../../../assets/house-2.png';
import house3 from '../../../assets/house-3.png';
import house4 from '../../../assets/house-4.png';
import Slider from 'react-slick';

export default function Houses() {
  const theme = useTheme();
  const { t } = useTranslation();

  const houses = [
    {
      image: house1,
      title: 'Tabby Town',
      location: 'Gunung Batu, Indonesia',
    },
    {
      image: house2,
      title: 'Anggana',
      location: 'Bogor, Indonesia',
    },
    {
      image: house3,
      title: 'Seattle Rain',
      location: 'Jakarta, Indonesia',
    },
    {
      image: house4,
      title: 'Wodden Pit',
      location: 'Wonosobo, Indonesia',
    },
  ];

const settings = {
dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 2000,    // ← Time between slides (3000ms = 3 seconds) — adjust as you like
  speed: 2000,             // ← How fast the slide animation is (800ms feels smooth & natural)
  cssEase: "linear", // ← Smooth start/end (much better than "linear")
  
  slidesToShow: 3.9,      // Keeps almost 4 visible
  slidesToScroll: 1,      // Smooth one-by-one movement
  
  arrows: true,           // ← THIS IS THE KEY: enables left/right arrows!
  pauseOnHover: true,     // Optional: stops autoplay when hovering

  responsive: [
    {
      breakpoint: 1536, // 2xl screens and up → 4 slides
      settings: {
        slidesToShow: 4,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 1280, // xl → 3 slides
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1024, // lg → 3 slides
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 900,  // md → 2 slides
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,  // sm → 1 slide
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,   // optional: hide arrows on mobile
      },
    },
  ],
};

  return (
    <>
      <Typography
        sx={{
          fontSize: '24px',
          color: theme.palette.text.disabled,
          fontWeight: 500,
          mt:5,
          mb: 2,
        }}
      >
        {t('user.Houseswithbeautybackyard')}
      </Typography>

      <Slider {...settings}>
     
        {houses.map((house, i) => (
          <Box key={i} sx={{ position: 'relative' ,px:2}}> 
            <Box
              component="img"
              src={house.image}
              alt={house.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '15px',
              }}
            />

         
              <Typography sx={{color:theme.palette.text.disabled,fontSize:"20px",mt:1}} fontWeight={500}>
                {house.title}
              </Typography>
              <Typography sx={{color:"#B0B0B0",fontSize:"15px"}}>{house.location}</Typography>
            </Box>
        ))}
      </Slider>
    </>
  );
}