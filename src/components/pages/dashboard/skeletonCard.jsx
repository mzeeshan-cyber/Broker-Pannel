import { Card, CardContent, Box, Stack, Skeleton, Grid } from '@mui/material';

export default function SkeletonCard() {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 1.5,
      }}
    >
      <CardContent>
        {/* ================= Header ================= */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Icon */}
            <Skeleton variant="rounded" width={40} height={40} />

            {/* Title + count */}
            <Skeleton variant="text" width={110} height={22} />
          </Stack>

          {/* More icon */}
          <Skeleton variant="circular" width={18} height={18} />
        </Stack>

        {/* ================= Chart Area ================= */}
        <Box
          sx={{
            borderRadius: 1.5,
            px: 3,
            py: 1.5,
            mb: 1.5,
            height:'180px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.04)'
          }}
        >
          {/* Fake bars */}
          <Stack direction="row" spacing={1} alignItems="flex-end">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width={6}
                height={Math.random() * 30 + 70}
              />
            ))}
          </Stack>
          <Skeleton variant="text" height={30} />
        </Box>

        {/* ================= Footer ================= */}
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Skeleton variant="text" width={60} height={18} />
          </Grid>

          <Grid item xs={8} display="flex" justifyContent="flex-end">
            <Skeleton variant="text" width={150} height={18} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
