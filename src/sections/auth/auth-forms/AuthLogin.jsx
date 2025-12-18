import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { CircularProgress } from '@mui/material';
import { loginSuccess, token } from "store/reducers/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'api/snackbar';
import { encryptToken } from 'utils/tokenUtils';
import SubmitButton from 'components/common/submit-button';
// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin() {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loginVerificationCode } = useSelector(state => state.auth)

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const handleLogin = async (values, { setSubmitting, setErrors }) => {

    try {
      const response = await fetch(`${API_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed!');
      }

      const data = await response.json();
      dispatch(loginSuccess(data?.data?.user));
      dispatch(token(encryptToken(data?.data?.token)));
      const encrypted = encryptToken(data.data.token);
      localStorage.setItem("token", encrypted);
      openSnackbar({
        open: true,
        message: 'Login Successful!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      setTimeout(() => {
        navigate(`${loginVerificationCode ? '/dashboard' : '/code-verification'}`)
      }, 1500);

    } catch (err) {
      setErrors({ apiError: err.message });
      openSnackbar({
        open: true,
        message: err.message || 'Invalid credentials',
        variant: 'alert',

        alert: {
          color: 'error',
        }
      });

    } finally {
      setSubmitting(false);
    }
  }



  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={handleLogin}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <Eye /> : <EyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
                  {/* <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  /> */}

                  {/* <Link variant="h6" component={RouterLink} to={`${isAuthenticated ? `/forgot-password` : `/login`}`} color="text.primary"> */}
                  <Link variant="h6" component={RouterLink} to={`/forgot-password`} color="text.primary">
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              <Grid item xs={12} sx={{ position: 'relative' }}>
                <SubmitButton isSubmitting={isSubmitting} text="login"/>
              </Grid>
            </Grid>

          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { forgot: PropTypes.string };
