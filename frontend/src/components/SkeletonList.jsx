import React from 'react';
import { Skeleton, Box } from '@mui/material';

const getRandomWidth = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
  
const SkeletonList = ({ length, random }) => {
    if(random) {    
        const skeletons = Array.from({ length }, (_, index) => (
            <Skeleton key={index} variant='text' width={`${getRandomWidth(20, 40)}%`} />
        ));

        return <Box>{skeletons}</Box>;
    } else {
        const skeletons = Array.from({ length }, (_, index) => (
            <Skeleton key={index} variant='text' />
        ));
    
        return <Box>{skeletons}</Box>;
    }
};

export default SkeletonList;
