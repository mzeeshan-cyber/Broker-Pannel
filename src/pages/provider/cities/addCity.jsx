import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import MainCard from 'components/MainCard';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Button, CircularProgress } from '@mui/material';
import { openSnackbar } from 'api/snackbar';
import { useNavigate, useParams } from 'react-router';
import { decryptToken } from 'utils/tokenUtils';
import AddressField from 'components/common/AddressField';
import { useEffect, useState } from 'react';
import { fetcher } from 'utils/axios';
import CityInfoCard from './cityInfoCard';
import CircularLoader from 'components/common/loader/CircularLoader';
import { useTheme } from '@emotion/react';

export default function AddCity() {
    const { provider_id } = useParams();
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cityDetail, setCityDetail] = useState({});
    const theme = useTheme()

    const AddCitySubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await fetch(`${API_URL}provider-operational-cities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: JSON.stringify({
                    ...values,
                    city: cityDetail?.city,
                    state_short: cityDetail?.state_short,
                    state_full: cityDetail?.state_full,
                    county: cityDetail?.county,
                    zip_codes: cityDetail?.zip_codes
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData);
                openSnackbar({
                    open: true,
                    message: errorData.message || 'City is not added!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            openSnackbar({
                open: true,
                message: 'City added Successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
            setTimeout(() => {
                navigate(-1)
            }, 1500);

        } catch (error) {
            openSnackbar({
                open: true,
                message:  `${response.message}`|| `${error?.message}` || `Server error`,
                variant: 'alert',

                alert: {
                    color: 'error'
                }
            });
        } finally {
            setSubmitting(false);
        }
    }
    const getSingleCityDetail = async (placeId) => {
        setLoading(true);
        try {
            const response = await fetcher(`/provider-operational-cities/city-details?place_id=${placeId}`);
            if (response.status === true) {
                setCityDetail(response?.data);
            } else {
                openSnackbar({
                    open: true,
                    message: response.message || 'Data is not fetched',
                    variant: 'alert',
                    alert: { color: 'error' }
                });
            }
        } catch (err) {
            openSnackbar({
                open: true,
                message: 'Error fetching single city detail',
                variant: 'alert',
                alert: { color: 'error' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Formik
            initialValues={{
                provider_id: provider_id,
                address: '',
                address_place_id: ''
            }}
            validationSchema={Yup.object().shape({
                address: Yup.string().max(255).required('Address his required'),
            })}
            onSubmit={AddCitySubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                const placeId = values.address_place_id;
                useEffect(() => {
                    if (placeId) {
                        getSingleCityDetail(placeId)
                    }
                }, [placeId])

                return (
                    <form noValidate onSubmit={handleSubmit}>
                        <MainCard title="Add New City">
                            <Grid container spacing={3} gridColumn={12}>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <AddressField
                                        id={`address`}
                                        label="Address"
                                        placeholder="Enter Address"
                                        touched={touched.address}
                                        errors={errors.address}
                                        values={values.address}
                                        handleBlur={handleBlur}
                                        setFieldValue={setFieldValue}
                                    />
                                    {touched.address &&
                                        errors.address && (
                                            <FormHelperText error>
                                                {errors.address}
                                            </FormHelperText>
                                        )}
                                </Grid>
                                {cityDetail && placeId &&
                                    <Grid item xs={12}>
                                        {loading ? 
                                        <CircularLoader/>
                                        : 
                                        <CityInfoCard data={[cityDetail]} noStatus={true}/>
                                        }
                                    </Grid>
                                }
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
                                                'Add City'
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
