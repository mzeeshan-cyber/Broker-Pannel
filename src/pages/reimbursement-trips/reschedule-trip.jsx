import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Formik } from 'formik';
import { Button, CircularProgress } from '@mui/material';
import { openSnackbar } from 'api/snackbar';
import { fetcherPost } from 'utils/axios';
import MultiDates from 'components/common/MultiDates';
import { useTheme } from '@emotion/react';

export default function RescheduleTrip({ tripId, setOpenRescheduleModal }) {
    const theme = useTheme()
    const handleRescheduleTrip = async (values, { setSubmitting, setErrors }) => {
        const response = await fetcherPost(['/re-schedule-reimbursement-trip', { id: tripId, departure_dates: values?.departure_dates }]);
        if (response.status === true) {
            openSnackbar({
                open: true,
                message: response.message || 'Reimbursement trip rescheduled successfully!',
                variant: 'alert',
                alert: { color: 'success' }
            });
            setOpenRescheduleModal(false)
        } else {
            setErrors(response.errors || {});
        }
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={{
                departure_dates: [],
            }}
            validationSchema={Yup.object().shape({
                departure_dates: Yup.array()
                    .of(Yup.string().required("Each date must be valid"))
                    .min(1, "Schedule dates are required"),

            })}
            onSubmit={handleRescheduleTrip}
        >
            {({ errors, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                return (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3} gridColumn={12} sx={{ width: '560px' }}>
                            <Grid item xs={12} sx={{ minHeight: '280px' }}>
                                <MultiDates
                                    id="departure_dates"
                                    label="Repeating Dates"
                                    values={values.departure_dates}
                                    setFieldValue={setFieldValue}
                                    touched={touched.departure_dates}
                                    errors={errors.departure_dates}
                                    inputProps={{ min: new Date().toISOString().split("T")[0] }}
                                />
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
                                        ) : 'Reschedule Reimbursement Trip'}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                );
            }}
        </Formik>
    );
}
