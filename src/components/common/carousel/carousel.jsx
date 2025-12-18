import React, { useState } from 'react';
import Slider from 'react-slick';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import {
  ArrowLeft2,
  ArrowRight2,
} from 'iconsax-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const Carousel = ({images}) => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.up('lg'));
  const [selected, setSelected] = useState(images[0]);

  const lgNo = matchDownLG ? 5 : 4;

  const ArrowLeft = ({ className, style, onClick }) => (
    <Box
      className={className}
      onClick={onClick}
      sx={{
        '&::before, &::after': {
          display: 'none'
        },
        position: 'relative',
        zIndex: 2,
        cursor: 'pointer',
        left: 0
      }}
      style={style}
    >
      <ArrowLeft2
        size={24}
        color={theme.palette.text.primary}
        style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0 }}
      />
    </Box>
  );
  

  const ArrowRight = ({ className, style, onClick }) => (
    <Box
      className={className}
      onClick={onClick}
      sx={{
        '&::before, &::after': {
          display: 'none' 
        },
        position: 'relative',
        zIndex: 2,
        cursor: 'pointer',
        right: 0
      }}
      style={style}
    >
      <ArrowRight2
        size={24}
        color={theme.palette.text.primary}
        style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 0 }}
      />
    </Box>
  );
  

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: images.length > 3 ? lgNo : images.length,
    slidesToScroll: 1,
    focusOnSelect: true,
    swipeToSlide: true,
    centerMode: true,
    centerPadding: '0px',
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              position: 'relative',
              bgcolor: '#f4f4f4',
              borderRadius: 2,
              overflow: 'hidden',
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TransformWrapper initialScale={1}>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <TransformComponent
                    wrapperStyle={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <img
                      src={selected}
                      alt="Main View"
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </Box>
        </Grid>

        {/* Thumbnails */}
        <Grid item xs={12}>
          <Slider {...settings}>
            {images.map((img, idx) => (
              <Box
                key={idx}
                onClick={() => setSelected(img)}
                sx={{ px: 1, cursor: 'pointer' }}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  style={{
                    height: 80,
                    width: '100px',
                    borderRadius: 8,
                    border:
                      selected === img
                        ? `2px solid ${theme.palette.primary[400]}`
                        : '2px solid transparent'
                  }}
                />
              </Box>
            ))}
          </Slider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Carousel;
