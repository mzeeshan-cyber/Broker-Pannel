import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';
import LogoPart from './logo-part';


// ================================|| LOGIN ||================================ //

export default function Login() {

  return (
    <AuthWrapper>
      <Stack direction="row" justifyContent="space-between">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ pt: { xs: 2, sm: 3, md: 4, xl: 5 }, px: { xs: 2, sm: 3, md: 4, xl: 5 }, mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">Login</Typography>
              <Typography
                component={Link}
                to={ '/register'}
                variant="body1"
                sx={{ textDecoration: 'none' }}
                color="primary"
              >
                Don&apos;t have an account?
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <AuthLogin />
          </Grid>
        </Grid>
        <LogoPart/>
      </Stack>
    </AuthWrapper>
  );
}
