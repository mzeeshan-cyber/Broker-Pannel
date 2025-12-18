import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { openSnackbar } from 'api/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { CircularProgress } from '@mui/material';

// 3rd party 
import Autocomplete from "react-google-autocomplete";
import { useTheme } from '@emotion/react';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme()
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };
  const changeConfirmPassword = (value) => {
  };

  useEffect(() => {
    changePassword('');
    changeConfirmPassword('')
  }, []);


  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch(`${API_URL}register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData);
        openSnackbar({
          open: true,
          message: errorData ? errorMsg?.message : 'Registeration failed!',
          variant: 'alert',

          alert: {
            color: 'error'
          }
        });
        throw new Error(errorData || 'Registration failed!');
      }
      openSnackbar({
        open: true,
        message: 'Registration Successful!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      setTimeout(() => {
        navigate('/login')
      }, 1500);

    } catch (err) {
      setErrors(err);
    } finally {
      setSubmitting(false);
    }
  }

  const fields = ["name", "email", "password", "address"];
  const errorsMessage = fields.reduce((acc, field) => {
    const key = `${field}Error`;
    acc[key] = errorMsg?.errors?.[field] ?? null;
    return acc;
  }, {});



  return (
    <>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          address: ''
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .max(255, 'Password cannot exceed 255 characters')
            .required('Password is required'),

          password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').max(255).required('Password confirmation is required'),
          address: Yup.string().max(255).required('Address is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <>
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3} sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name">Full Name*</InputLabel>
                    <OutlinedInput
                      id="name"
                      type="name"
                      value={values.name}
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="name"
                      fullWidth
                      error={Boolean(touched.name && errors.name)}
                    />
                  </Stack>
                  {touched.name && errors.name && (
                    <FormHelperText error id="name">
                      {errors.name || errorsMessage.nameError}
                    </FormHelperText>
                  )}
                  <FormHelperText error>
                    <span>{errorsMessage.nameError}</span>
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email">Email Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                      id="email"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="email address"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.email && errors.email && (
                    <FormHelperText error id="email">
                      {errors.email || errorsMessage.emailError}
                    </FormHelperText>
                  )}
                  <FormHelperText error>
                    <span>{errorsMessage.emailError}</span>
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        changePassword(e.target.value);
                      }}
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
                      placeholder="******"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.password && errors.password && (
                    <FormHelperText error id="password">
                      {errors.password || errorsMessage.passwordError}
                    </FormHelperText>
                  )}
                  <FormHelperText error>
                    <span>{errorsMessage.passwordError}</span>
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password_confirmation">Confirm Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password_confirmation && errors.password_confirmation)}
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.password_confirmation}
                      name="password_confirmation"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        changeConfirmPassword(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownConfirmPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showConfirmPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder="******"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.password_confirmation && errors.password_confirmation && (
                    <FormHelperText error id="password_confirmation">
                      {errors.password_confirmation || errorsMessage.passwordError}
                    </FormHelperText>
                  )}
                  <FormHelperText error id="adress">
                    <span>{errorsMessage.passwordError}</span>
                  </FormHelperText>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" fontSize="0.75rem">
                          {level?.label}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="address">Address</InputLabel>
                    <OutlinedInput
                      error={Boolean(touched.address && errors.address)}
                      id="address"
                      name="address"
                      onBlur={handleBlur}
                      value={values.address}
                      inputComponent={({ inputRef, ...inputProps }) => (
                        <Autocomplete
                          apiKey="AIzaSyD1-pjN6OGA80NaUTe8IS9McCWHlMvUcHA"
                          onPlaceSelected={(place) => {
                            const address = place.formatted_address;
                            setFieldValue("address", address);
                          }}
                          options={{
                            types: ["geocode"],
                            componentRestrictions: { country: "us" }
                          }}
                          defaultValue={values.address}
                          placeholder="address"
                          inputProps={{
                            ref: inputRef,
                            ...inputProps,
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            width: '100%',
                            color: 'currentColor',
                            padding: '16px',
                            outline: 'none',
                            boxShadow: 'none',
                          }}
                        />
                      )}
                    />

                  </Stack>
                  {touched.address && errors.address && (
                    <FormHelperText error id="adress">
                      <span>{errors.address}</span>
                    </FormHelperText>
                  )}
                </Grid>
                {/* <Grid item xs={12}>
                  <Typography variant="body2">
                    By Signing up, you agree to our &nbsp;
                    <Link variant="subtitle2" component={RouterLink} to="#">
                      Terms of Service
                    </Link>
                    &nbsp; and &nbsp;
                    <Link variant="subtitle2" component={RouterLink} to="#">
                      Privacy Policy
                    </Link>
                  </Typography>
                </Grid> */}
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary" sx={{
                      padding: '8px 22px', '&.Mui-disabled': {
                        bgcolor: theme.palette.primary.main,
                      }
                    }}>
                      {isSubmitting ?
                        <CircularProgress sx={{ height: '20px !important', width: '20px !important', color: 'white' }} />
                        :
                        <span>Create Account</span>
                      }
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
