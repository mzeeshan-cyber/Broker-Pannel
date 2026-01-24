import { Avatar, Grid, Stack, Typography } from '@mui/material';

export const StatusItem = ({ label, value, icon, color, bgcolor }) => (
  <Grid item xs={6}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: `${bgcolor}`,
          color
        }}
      >
        {icon}
      </Avatar>

      <Stack>
        <Typography variant="subtitle1">{value ?? 0}</Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Stack>
    </Stack>
  </Grid>
);
