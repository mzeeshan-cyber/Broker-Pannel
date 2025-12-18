import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
// import useAuth from 'hooks/useAuth';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';
import { CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { codeTimer, forgotEmail } from 'store/reducers/authSlice';
import SubmitButton from 'components/common/submit-button';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

export default function AuthForgotPassword() {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // const { isLoggedIn, resetPassword } = useAuth();
  const ForgotPassword = async (values, { setErrors, setSubmitting }) => {

    try {
      const response = await fetch(`${API_URL}request-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        openSnackbar({
          open: true,
          message: errorData.message,
          variant: 'alert',

          alert: {
            color: 'error'
          }
        });
        throw new Error(errorData.message || 'Failed');
      }
      dispatch(forgotEmail(values.email))
      dispatch(codeTimer(600))
      localStorage.setItem('codeTime', 600)
      setSubmitting(false);
      openSnackbar({
        open: true,
        message: 'Check mail for reset password link',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      setTimeout(() => {
        navigate('/verify-reset-code');
      }, 1500);

    } catch (err) {
      setErrors(err.message);
      setSubmitting(false);

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          user_type: 'broker'
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
        })}
        onSubmit={ForgotPassword}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-forgot">Email Address</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-forgot"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    inputProps={{}}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-forgot">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12} sx={{ mb: -2 }}>
                <Typography variant="caption">Do not forgot to check SPAM box.</Typography>
              </Grid>
              <Grid item xs={12}>
                <SubmitButton isSubmitting={isSubmitting} text="Send Password Reset Email" />
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
