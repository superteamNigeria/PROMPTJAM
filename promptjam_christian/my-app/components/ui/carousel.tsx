'use client';

import React from 'react';
import CarouselSlider from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface CarouselProps {
  responsive: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  children: React.ReactNode;
}

const Carousel = ({ responsive, children }: CarouselProps) => {
  return (
    <CarouselSlider
      additionalTransfrom={0}
      autoPlaySpeed={3000}
      centerMode={false}
      containerClass="w-full h-full"
      itemClass="w-full h-full"
      draggable={true}
      focusOnSelect={false}
      infinite
      keyBoardControl={true}
      minimumTouchDrag={80}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      responsive={{
        desktop: {
          breakpoint: {
            max: 3000,
            min: 1024
          },
          items: responsive.desktop,
          partialVisibilityGutter: 40
        },
        mobile: {
          breakpoint: {
            max: 464,
            min: 0
          },
          items: responsive.mobile,
          partialVisibilityGutter: 30
        },
        tablet: {
          breakpoint: {
            max: 1024,
            min: 464
          },
          items: responsive.tablet,
          partialVisibilityGutter: 30
        }
      }}
      sliderClass="h-full"
      slidesToSlide={1}
      swipeable={true}
      autoPlay={false}
      showDots
    >
      {children}
    </CarouselSlider>
  );
};

export default Carousel;
