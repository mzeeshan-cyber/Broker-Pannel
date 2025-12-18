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
import { useSelector, useDispatch } from 'react-redux';
import { resetPasswordVerificationCode } from 'store/reducers/authSlice';
import { decryptToken } from 'utils/tokenUtils';

// ============================|| STATIC - CODE VERIFICATION ||============================ //

export default function AuthVerifyResetCode() {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const { forgotEmail } = useSelector((state) => state?.auth);
  const theme = useTheme();
  const [otp, setOtp] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resend, setResend] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[200] : theme.palette.secondary.light;
  // 
  // Load timeLeft from localStorage or set initial time
  //   const initialTime = parseInt(localStorage.getItem("codeTime")) || 600

  // console.log(initialTime)
  //   const [timeLeft, setTimeLeft] = useState(initialTime);

  //   useEffect(() => {
  //     const endTime = parseInt(localStorage.getItem("codeTime"));

  //     if (endTime) {
  //       const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  //       setTimeLeft(remaining);
  //     } else {
  //       localStorage.setItem("codeTime", Date.now() + timeLeft * 1000);
  //     }

  //     const timer = setInterval(() => {
  //       const remaining = Math.max(0, Math.floor((parseInt(localStorage.getItem("codeTime")) - Date.now()) / 1000));
  //       setTimeLeft(remaining);

  //       if (remaining <= 0) {
  //         localStorage.removeItem("codeTime");
  //         clearInterval(timer);
  //       }
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }, []);

  //   const minutes = Math.floor(timeLeft / 60);
  //   const seconds = timeLeft % 60;


  // Post Request
  const encryptedFromStorage = localStorage.getItem("token");
  const decryptedToken = decryptToken(encryptedFromStorage);
  const sendOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    const data = { email: forgotEmail, user_type: 'broker', token: otp };
    try {
      const response = await axios.post(`${API_URL}verify-reset-code`, data);

      if (response.status === 200) {
        setIsSubmitting(false)
        openSnackbar({
          open: true,
          message: 'Reset code verified successfully.',
          variant: 'alert',

          alert: {
            color: 'success'
          }
        });
        dispatch(resetPasswordVerificationCode(otp))
        setTimeout(() => {
          navigate('/reset-password');
        }, 1500);
      }
    } catch (error) {
      setIsSubmitting(false)
      openSnackbar({
        open: true,
        message: !decryptedToken ? 'User is not loged in' : error.response?.data?.message || error.message,
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
            color: 'error'
          }
        });
      }
      setResend(false)
      openSnackbar({
        open: true,
        message: 'Code sended.',
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
        {/* <Grid item xs={12}>

          {minutes > 0 && seconds > 0 ? <Typography sx={{color:'red'}}>Code will expire after <strong>{minutes} : {seconds < 10 ? `0${seconds}` : seconds}</strong> </Typography> : <Typography sx={{fontWeight:'600'}}>Code is expired!</Typography>}

        </Grid> */}
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
    </form >
  );
}
