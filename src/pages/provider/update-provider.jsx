// material-ui
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
// project-imports
import MainCard from 'components/MainCard';
// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { openSnackbar } from 'api/snackbar';
import { useNavigate, useParams } from 'react-router';
import { fetcher, fetcherPost } from 'utils/axios';
import { loading } from 'store/reducers/patientSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import { Button, CircularProgress } from '@mui/material';
import InputField from 'components/common/InputField';
import PasswordField from 'components/common/PasswordField';
import AddressField from 'components/common/AddressField';
import { useTheme } from '@emotion/react';

export default function UpdateProvider() {
    const navigate = useNavigate()
    const [providerData, setProviderData] = useState({});
    const { provider_id } = useParams();
    const dispatch = useDispatch()
    const theme = useTheme()
    const Loading = useSelector(state => state.patient.loading)

    const FetchSingleProvider = async () => {
        dispatch(loading(true));
        const response = await fetcher(`/provider/${provider_id}`);
        if (response.status === true) {
            setProviderData(response?.data);
            openSnackbar({
                open: true,
                message: response.message || 'data is fetched',
                variant: 'alert',
                alert: { color: 'success' }
            });
            dispatch(loading(false));
        }
    }
    useEffect(() => {
        FetchSingleProvider();
    }, [])

    const UpdatePatientProvider = async (values, { setSubmitting, setErrors }) => {
        const response = await fetcherPost([`/provider/${provider_id}`, values])
        if (response.status === true) {
            openSnackbar({
                open: true,
                message: response.message || 'Provider updated successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
            navigate(`/providers`)
        }
    };

    return (
        <>
            {Loading ? <Loader /> :
                <Formik
                    initialValues={{
                        name: providerData?.name,
                        email: providerData?.email,
                        password: '',
                        password_confirmation: '',
                        address: providerData?.address,
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

                    enableReinitialize={true}
                    onSubmit={UpdatePatientProvider}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {

                        return (
                            <form noValidate onSubmit={handleSubmit}>
                                <MainCard title="Update Provider">
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
                                                        'update Provider'
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
            }
        </>
    );
}
