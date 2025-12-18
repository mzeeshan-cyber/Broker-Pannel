import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import MainCard from 'components/MainCard';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, CircularProgress } from '@mui/material';
import { openSnackbar } from 'api/snackbar';
import { useNavigate } from 'react-router';
import { fetcher, fetcherPost } from 'utils/axios';
import InputField from 'components/common/InputField';
import { BiDollar } from "react-icons/bi";
import { useEffect, useState } from 'react';
import CircularLoader from 'components/common/loader/CircularLoader';
import { useTheme } from '@emotion/react';

export default function ReimbursementRates() {
    const navigate = useNavigate();
    const theme = useTheme()
    const [reimburementRate, setReimburementRate] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const handleGetReimbursementRate = async () => {
        try {
            const response = await fetcher('fetch-reimbuirsement-trip-setting');
            if (response.status === true) {
                setReimburementRate(response.data)
                setIsLoading(false)
            }
        }
        catch (error) {
            setIsLoading(false)
        }
    };
    const handleAddReimbursementRate = async (values, { setSubmitting, setErrors }) => {
        const response = await fetcherPost(['/store-update-reimbursement-trip-setting', values]);
        if (response.status === true) {
            openSnackbar({
                open: true,
                message: response.message || 'Allowanced added successfully!',
                variant: 'alert',
                alert: { color: 'success' }
            });

            setTimeout(() => {
                // navigate(`/reimbursement-trips`);
            }, 1500);
        } else {
            setErrors(response.errors || {});
        }
        setSubmitting(false);
    };

    useEffect(() => {
        handleGetReimbursementRate()
    }, [])
    return (
        <>
            {isLoading ?
                <CircularLoader text='Loading data...' height='40vh' />
                :
                <Formik
                    initialValues={{
                        per_mile_rate: reimburementRate?.per_mile_rate || '',
                        claim_duration: reimburementRate?.claim_span || ''
                    }}
                    validationSchema={Yup.object().shape({
                        per_mile_rate: Yup.string()
                            .max(255)
                            .required('Per mile rate is required'),
                        claim_duration: Yup.string()
                            .max(255)
                            .required('Reimbursement claim duration is required'),
                    })}
                    enableReinitialize={true}
                    onSubmit={handleAddReimbursementRate}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {

                        return (
                            <form noValidate onSubmit={handleSubmit}>
                                <MainCard title="Reimbursement rates (add / update)">
                                    <Grid container spacing={3} gridColumn={12}>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <InputField
                                                id="per_mile_rate"
                                                label="Reimbursement per mile rate"
                                                type="number"
                                                touched={touched.per_mile_rate}
                                                errors={errors.per_mile_rate}
                                                values={values.per_mile_rate}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                icon={<BiDollar />}
                                            />
                                            {touched.per_mile_rate && errors.per_mile_rate && (
                                                <FormHelperText error id="helper-text-per_mile_rate">
                                                    {errors.per_mile_rate}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <InputField
                                                id="claim_duration"
                                                label="Reimbursement Claim Duration"
                                                type="number"
                                                touched={touched.claim_duration}
                                                errors={errors.claim_duration}
                                                values={values.claim_duration}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                icon={<>Days</>}
                                            />
                                            {touched.claim_duration && errors.claim_duration && (
                                                <FormHelperText error id="helper-text-claim_duration">
                                                    {errors.claim_duration}
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
                                                        <CircularProgress sx={{ height: '20px !important', width: '20px !important', color:'white' }} />
                                                    ) : (
                                                        reimburementRate ? 'Update Reimbursement Settings' :
                                                            'Add Reimbursement Settings '
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
