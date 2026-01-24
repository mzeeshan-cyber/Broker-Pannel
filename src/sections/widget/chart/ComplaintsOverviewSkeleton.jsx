import { Stack, Skeleton, Box } from '@mui/material';
import React from 'react';

export default function ComplaintsOverviewSkeleton() {
  return (
    <Stack spacing={2}>
      {/* Header Skeleton */}
      <Stack spacing={0.5}>
        <Skeleton variant="text" width={200} height={30} />
        <Skeleton variant="text" width={150} height={20} />
      </Stack>

      {/* Donut & Legend Skeleton */}
      <Stack direction="row" spacing={3} justifyContent="flex-end" alignItems="flex-end">
        {/* Donut Skeleton */}
        <Skeleton
          variant="circular"
          width={220}
          height={220}
          sx={{ alignSelf: 'center' }}
        />

        {/* Legend Skeleton */}
        <Stack spacing={1}>
          {[...Array(2)].map((_, index) => (
            <Stack
              key={index}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width={120} // same as legend width
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Skeleton variant="circular" width={10} height={10} />
                <Skeleton variant="text" width={60} height={20} />
              </Stack>
              <Skeleton variant="text" width={20} height={20} />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
