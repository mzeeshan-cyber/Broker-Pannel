import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthForgotPassword from 'sections/auth/auth-forms/AuthForgotPassword';
import LogoPart from './logo-part';

// ================================|| FORGOT PASSWORD ||================================ //

export default function ForgotPassword() {

  return (
    <AuthWrapper>
      
      <Stack direction="row" justifyContent="space-between">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ pt: { xs: 2, sm: 3, md: 4, xl: 5 }, px: { xs: 2, sm: 3, md: 4, xl: 5 }, mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Forgot Password</Typography>
            <Typography
              component={Link}
              to={'/login'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              Back to Login
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthForgotPassword />
        </Grid>
      </Grid>
        <LogoPart/>
      </Stack>
    </AuthWrapper>
  );
}
