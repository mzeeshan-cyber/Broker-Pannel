import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import OtpInput from 'react18-input-otp';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import { ThemeMode } from 'config';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import { CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { loginVerificationCode } from 'store/reducers/authSlice';
import { decryptToken } from 'utils/tokenUtils';

// ============================|| STATIC - CODE VERIFICATION ||============================ //

export default function AuthCodeVerification() {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const theme = useTheme();
  const [otp, setOtp] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resend, setResend] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[200] : theme.palette.secondary.light;

  // Post Request
  const encryptedFromStorage = localStorage.getItem("token");
  const decryptedToken = decryptToken(encryptedFromStorage);
  const sendOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    const data = { code: otp };
    try {
      const response = await axios.post(`${API_URL}verify-2fa`, data, {
        headers: {
          'Authorization': `Bearer ${decryptedToken}`,
        }
      });
      if (response.status === 200) {
        setIsSubmitting(false)
        openSnackbar({
          open: true,
          message: 'Verified two-factor code',
          variant: 'alert',

          alert: {
            color: 'success'
          }
        });
        dispatch(loginVerificationCode(otp))
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      setIsSubmitting(false)
      openSnackbar({
        open: true,
        message: error.response?.data?.message || error.message,
        variant: 'alert',

        alert: {
          color: 'error'
        }
      });
    }
    finally {
      setIsSubmitting(false)
    }
  };
  const reSendOTP = async (e) => {
    e.preventDefault();
    setResend(true)
    try {
      const response = await axios.post(`${API_URL}resend-2fa`, {}, {
        headers: {
          'Authorization': `Bearer ${decryptedToken}`,
        }
      });
      if (!response.statusText === 200) {
        setResend(false)
        openSnackbar({
          open: true,
          message: error.response?.data?.message || error.message,
          variant: 'alert',

          alert: {
            color: 'secondary'
          }
        });
      }
      setResend(false)
      openSnackbar({
        open: true,
        message: 'Resended two-factor code',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });

    } catch (error) {
      setResend(false)
      openSnackbar({
        open: true,
        message: error.response?.data?.message || error.message,
        variant: 'alert',

        alert: {
          color: 'error'
        }
      });
    }
    finally {
      setResend(false)
    }
  };



  return (
    <form onSubmit={sendOTP}>
      <Grid container spacing={3} sx={{ py: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
        <Grid item xs={12}>
          <OtpInput
            value={otp}
            onChange={(otp) => setOtp(otp)}
            numInputs={6}
            containerStyle={{ justifyContent: 'space-between' }}
            inputStyle={{
              width: '100%',
              margin: '8px',
              padding: '10px',
              border: '1px solid',
              borderColor: { borderColor },
              borderRadius: 4,
              ':hover': { borderColor: theme.palette.primary.main }
            }}
            focusStyle={{
              outline: 'none',
              boxShadow: theme.customShadows.primary,
              border: '1px solid',
              borderColor: theme.palette.primary.main
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <AnimateButton>
            <Button disableElevation fullWidth size="large" type="submit" variant="contained" sx={{
              '&.Mui-disabled': {
                bgcolor: theme.palette.primary.main,
              }
            }}>

              {isSubmitting ?
                <CircularProgress sx={{ height: '20px !important', width: '20px !important', color: 'white' }} />
                :
                <span>Continue</span>
              }
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography>Not received Code?</Typography>
            <Typography variant="body1" type="button" sx={{
              minWidth: 85, ml: 2, textDecoration: 'none', cursor: 'pointer', '&.Mui-disabled': {
                bgcolor: theme.palette.primary.main,
              }
            }} color="primary" onClick={reSendOTP}>
              {resend ?
                <CircularProgress sx={{ height: '20px !important', width: '20px !important', color: 'white' }} />
                :
                <span>Resend code</span>
              }
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
