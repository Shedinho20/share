import React from 'react';
import { pin } from '../Feed/Feed';
import Masonry from 'react-masonry-css';
import { Pin } from '../Pin/Pin';

type masonryProps = {
  pins: pin[];
};

const breakpoint = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1
};
export const MasonryLayout = ({ pins }: masonryProps) => {
  return (
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpoint}>
      {pins?.map(pin => (
        <Pin key={pin._id} pin={pin} />
      ))}
    </Masonry>
  );
};

// className="w-max"
