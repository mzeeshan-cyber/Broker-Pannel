import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from '@mui/material';

export default function CircularLoader({text= 'loading...', height = '40vh'}) {
  return (
    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center", height: {height} }}>
      <CircularProgress />
      <span>{text}</span>
    </Grid>
  );
}

