// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthResetPassword from 'sections/auth/auth-forms/AuthResetPassword';
import LogoPart from './logo-part';

// ================================|| RESET PASSWORD ||================================ //

export default function ResetPassword() {
  return (
    <AuthWrapper>

      <Stack direction="row" justifyContent="space-between">
        <Grid container spacing={3} sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 }, mb: { xs: -0.5, sm: 0.5 } }}>
          <Grid item xs={12}>
            <Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
              <Typography variant="h3">Reset Password</Typography>
              <Typography color="secondary">Please choose your new password</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <AuthResetPassword />
          </Grid>
        </Grid>
        <LogoPart />
      </Stack>
    </AuthWrapper>
  );
}
