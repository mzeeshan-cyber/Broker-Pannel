import PropTypes from 'prop-types';
// material-ui
import Box from '@mui/material/Box';

// project-imports
import MainCard from 'components/MainCard';

// ==============================|| AUTHENTICATION - CARD ||============================== //

export default function AuthCard({ children, ...other }) {
  return (
    <MainCard
      sx={{
        maxWidth: { xs: 400, md: 880, lg: 1000, xl: 1300 },
        margin: { xs: 2.5, md: 3 },
        '& > *': {
          flexGrow: 1,
          flexBasis: '50%'
        }
      }}
      content={false}
      {...other}
    >
      <Box>{children}</Box>
    </MainCard>
  );
}

AuthCard.propTypes = { children: PropTypes.any, other: PropTypes.any };
