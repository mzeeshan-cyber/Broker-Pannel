import React from 'react';
import { Box, Grid, List, ListItem, ListItemAvatar, Card, CardContent, Skeleton } from '@mui/material';

const StatusItemSkeleton = () => (
  <Grid item xs={6} sm={4}>
    <Box
      sx={{
        height: '70px',
        borderRadius: 2,
        display: 'flex',
      }}
    >
      {/* Icon */}
      <Skeleton variant="rounded" width={45} height={45} sx={{ mr: 1 }} />
      {/* Text content */}
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
    </Box>
  </Grid>
);

const InvoiceChartsSkeleton = () => {
  return (
    <Grid container spacing={2} sx={{ height: '100%' }}>
      {/* Top list skeleton */}
      <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 }, width:'100%' }}>
        {[...Array(2)].map((_, idx) => (
          <ListItem key={idx} divider>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={60} height={20} />
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Trips Stats Card Skeleton */}
      <Grid item xs={12}>
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardContent>
            {/* Card title */}
            <Skeleton variant="text" width={150} height={20} sx={{ mb: 2 }} />

            {/* StatusItems */}
            <Grid container spacing={2}>
              {[...Array(5)].map((_, i) => (
                <StatusItemSkeleton key={i} />
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default InvoiceChartsSkeleton;
