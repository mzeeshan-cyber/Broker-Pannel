import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack
} from '@mui/material';

const StatusItemSkeleton = () => (
  <Grid item xs={6}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Skeleton variant="rounded" width={40} height={40} />
      <Stack spacing={0.5}>
        <Skeleton variant="text" width={40} height={20} />
        <Skeleton variant="text" width={60} height={14} />
      </Stack>
    </Stack>
  </Grid>
);

const StatListItemSkeleton = () => (
  <ListItem divider>
    <ListItemAvatar>
      <Skeleton variant="rounded" width={40} height={40} />
    </ListItemAvatar>

    <ListItemText
      primary={<Skeleton width={120} />}
    />

    <Stack spacing={0.5} alignItems="flex-end">
      <Skeleton width={50} />
    </Stack>
  </ListItem>
);

const TripSkeleton = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ p: 3, pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Skeleton width={180} height={24} />
            <Skeleton variant="rounded" width={90} height={32} />
          </Stack>
        </Box>

        {/* Tabs */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Stack direction="row" spacing={2}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rounded" width={90} height={32} />
            ))}
          </Stack>
        </Box>
        <Box sx={{ px: 3 }}>
          <Skeleton variant="rectangular" height={300} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TripSkeleton;
