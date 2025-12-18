// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthCodeVerification from 'sections/auth/auth-forms/AuthCodeVerification';
import LogoPart from './logo-part';
import { useSelector } from 'react-redux';

// ================================|| CODE VERIFICATION ||================================ //

export default function CodeVerification() {
  const  data  = useSelector((state) => state?.auth?.user);


  let email = window.localStorage.getItem('email');
  let finalArr = [];

  if (email) {
    let emailSplit = email.split('');
    let len = emailSplit.indexOf('@');
    emailSplit.forEach((item, pos) => {
      pos >= 1 && pos <= len - 2 ? finalArr.push('*') : finalArr.push(emailSplit[pos]);
    });
  }
  return (
    <AuthWrapper>
      <Stack direction="row" justifyContent="space-between">
        <Grid container spacing={3} sx={{ pt: { xs: 2, sm: 3, md: 4, xl: 5 }, px: { xs: 2, sm: 3, md: 4, xl: 5 }, mb: { xs: -0.5, sm: 0.5 } }}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography variant="h3">Enter Verification Code</Typography>
              <Typography color="secondary">We send you on mail.</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{display:'flex', gap:'5px'}}>We have send you code on <Typography sx={{fontWeight:'600'}}>{data?.email}</Typography></Typography>
          </Grid>
          <Grid item xs={12}>
            <AuthCodeVerification />
          </Grid>
        </Grid>
        <LogoPart/>
      </Stack>
    </AuthWrapper>
  );
}
