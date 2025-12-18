// material-ui
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';

// project-imports
import MainCard from 'components/MainCard';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Button, CircularProgress } from '@mui/material';
import { openSnackbar } from 'api/snackbar';
import { useNavigate } from 'react-router';
import InputField from 'components/common/InputField';
import PasswordField from 'components/common/PasswordField';
import AddressField from 'components/common/AddressField';
import { decryptToken } from 'utils/tokenUtils';
import { useTheme } from '@emotion/react';

export default function AddProvider() {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const navigate = useNavigate();
    const theme = useTheme()

    const AddProviderSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await fetch(`${API_URL}store-provider`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData);
                openSnackbar({
                    open: true,
                    message: errorData.message || 'Provider is not added!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            openSnackbar({
                open: true,
                message: 'Provider added Successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
            setTimeout(() => {
                navigate('/providers')
            }, 1500);

        } catch (error) {
            openSnackbar({
                open: true,
                message: `${error?.message} || Server error`,
                variant: 'alert',

                alert: {
                    color: 'error'
                }
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Formik
            initialValues={{
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                address: '',
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string().max(255).required('Provider name is required'),
                password: Yup.string()
                    .min(8, 'Password must be at least 8 characters')
                    .max(255, 'Password cannot exceed 255 characters')
                    .required('Password is required'),

                password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').max(255).required('Password confirmation is required'),
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                address: Yup.string().max(255).required('Address his required'),
            })}


            onSubmit={AddProviderSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {

                return (
                    <form noValidate onSubmit={handleSubmit}>
                        <MainCard title="Add New Provider">
                            <Grid container spacing={3} gridColumn={12}>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <InputField
                                        id="name"
                                        label="Provider Name"
                                        type="text"
                                        touched={touched.name}
                                        errors={errors.name}
                                        values={values.name}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                    {touched.name && errors.name && (
                                        <FormHelperText error id="helper-text-name">
                                            {errors.name}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <InputField
                                        id="email"
                                        label="Email"
                                        type="email"
                                        touched={touched.email}
                                        errors={errors.email}
                                        values={values.email}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="helper-text-email">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                    <FormHelperText error>
                                        {errors?.errors?.email}
                                    </FormHelperText>
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <PasswordField
                                        id="password"
                                        label="Password"
                                        type="password"
                                        touched={touched.password}
                                        errors={errors.password}
                                        values={values.password}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="password">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <PasswordField
                                        id="password_confirmation"
                                        label="Password Confirmation"
                                        type="password_confirmation"
                                        touched={touched.password_confirmation}
                                        errors={errors.password_confirmation}
                                        values={values.password_confirmation}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                    {touched.password_confirmation && errors.password_confirmation && (
                                        <FormHelperText error id="password_confirmation">
                                            {errors.password_confirmation}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <AddressField
                                        id="address"
                                        label="Address"
                                        placeholder="Enter Address"
                                        touched={touched.address}
                                        errors={errors.address}
                                        values={values.address}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                        setFieldValue={setFieldValue}

                                    />
                                    {touched.address && errors.address && (
                                        <FormHelperText error id="address">
                                            {errors.address}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 4 }}>
                                        <Button disableElevation disabled={isSubmitting} variant="contained" type="submit" sx={{
                                            '&.Mui-disabled': {
                                                bgcolor: theme.palette.primary.main,
                                            }
                                        }}>
                                            {isSubmitting ? (
                                                <CircularProgress sx={{ height: '20px !important', width: '20px !important', color: 'white' }} />
                                            ) : (
                                                'Add Provider'
                                            )}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </form>
                );
            }}
        </Formik>
    );
}
