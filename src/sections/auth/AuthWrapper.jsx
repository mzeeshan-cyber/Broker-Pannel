import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// project-imports
import AuthCard from './AuthCard';

// assets
import AuthBackground from 'assets/images/auth/AuthBackground';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
  return (
    <Box sx={{ maxHeight: '600px',
      height: '100%',
      backgroundImage:'linear-gradient(30deg, rgb(32 64 102) 28%, rgb(18 180 139) 98%)',
      position: 'absolute',
      right: '0',
      width: '100%',
      top: '0',
      backgroundRepeat:'no-repeat',
      backgroundSize:'contain',
      backgroundPosition:'center',
    }}
      >
      <AuthBackground />
      <Grid
        container
        direction="column"
        justifyContent="center"
        sx={{
          minHeight: '100vh'
        }}
      >
        <Grid item xs={12}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: { xs: 'calc(100vh - 210px)', sm: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
          >
            <Grid item>
              <AuthCard>{children}</AuthCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
