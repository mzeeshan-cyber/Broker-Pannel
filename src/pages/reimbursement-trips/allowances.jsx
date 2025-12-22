import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import MainCard from 'components/MainCard';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, CircularProgress } from '@mui/material';
import { openSnackbar } from 'api/snackbar';
import { fetcher, fetcherPost } from 'utils/axios';
import InputField from 'components/common/InputField';
import { BiDollar } from "react-icons/bi";
import SelectDropDown from 'components/common/SelectDropDown';
import { allowanceType } from 'constants/constants';
import { useEffect, useState } from 'react';
import CircularLoader from 'components/common/loader/CircularLoader';
import TimePicker24 from 'components/common/TimePicker24';
import { toString } from 'lodash';
import { useTheme } from '@emotion/react';

export default function Allowances() {
    const [allowance, setAllowance] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme()
    const handleGetAllowance = async () => {
        setIsLoading(true);
        try {
            const response = await fetcher('fetch-allowances');

            if (response.status === true) {
                setAllowance(response.data);
            } else {
                openSnackbar({
                    open: true,
                    message: response.message || 'No allowances found.',
                    variant: 'alert',
                    alert: { color: 'warning' }
                });
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    'No allowances or Something went wrong while fetching allowances',
                variant: 'alert',
                alert: { color: 'error' }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAllowance = async (values, { setSubmitting, setErrors }) => {
        const response = await fetcherPost(['/store-update-allowances', values]);
        if (response.status === true) {
            openSnackbar({
                open: true,
                message: response.message || 'Allowanced added successfully!',
                variant: 'alert',
                alert: { color: 'success' }
            });
        } else {
            setErrors(response.errors || {});
        }
        setSubmitting(false);
    };

    useEffect(() => {
        handleGetAllowance()
    }, [])
    return (
        <>
            {isLoading ?
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center", height: '40vh' }}>
                    <CircularLoader text='Loading Allowances..' />
                </Box>
                :
                <Formik
                    initialValues={{
                        allowance_breakfast: allowance?.allowance_breakfast || '',
                        time_breakfast: allowance?.time_breakfast?.slice(0, 5) || '',
                        allowance_lunch: allowance?.allowance_lunch || '',
                        time_lunch_from: allowance?.time_lunch_from?.slice(0, 5) || '',
                        time_lunch_to: allowance?.time_lunch_to?.slice(0, 5) || '',
                        allowance_dinner: allowance?.allowance_dinner || '',
                        time_dinner: allowance?.time_dinner?.slice(0, 5) || '',
                        allowance_lodging: allowance?.allowance_lodging || '',
                        time_lodging_before: allowance?.time_lodging_before?.slice(0, 5) || '',
                        time_lodging_after: allowance?.time_lodging_after?.slice(0, 5) || '',
                        min_est_trip_hours: allowance?.min_est_trip_hours || '',
                        allow_attendant: toString(allowance?.allow_attendant) || '',
                    }}
                    validationSchema={Yup.object().shape({
                        allowance_breakfast: Yup.string()
                            .max(255)
                            .required('Breakfast allowance is required'),

                        time_breakfast: Yup.string()
                            .required('Breakfast time is required'),

                        allowance_lunch: Yup.string()
                            .max(255)
                            .required('Lunch allowance is required'),

                        time_lunch_from: Yup.string()
                            .required('Lunch start time is required'),

                        time_lunch_to: Yup.string()
                            .required('Lunch end time is required')
                            .test(
                                'is-after',
                                'Lunch end time must be after or equal to lunch start time',
                                function (value) {
                                    const { time_lunch_from } = this.parent;
                                    if (!time_lunch_from || !value) return true;
                                    return value >= time_lunch_from;
                                }
                            ),

                        allowance_dinner: Yup.string()
                            .max(255)
                            .required('Dinner allowance is required'),

                        time_dinner: Yup.string()
                            .required('Dinner time is required'),

                        allowance_lodging: Yup.string()
                            .max(255)
                            .required('Lodging allowance is required'),

                        time_lodging_before: Yup.string()
                            .required('Lodging before time is required'),

                        time_lodging_after: Yup.string()
                            .required('Lodging after time is required')
                            .test(
                                'is-after',
                                'Lodging after time must be after or equal to Lodging before time',
                                function (value) {
                                    const { time_lodging_before } = this.parent;
                                    if (!time_lodging_before || !value) return true;
                                    return value >= time_lodging_before;
                                }
                            ),

                        min_est_trip_hours: Yup.string()
                            .required('Minimum estimated trip hours is required'),

                        allow_attendant: Yup.string()
                            .required('Attendant field is required')
                    })}
                    enableReinitialize={true}
                    onSubmit={handleAddAllowance}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {

                        return (
                            <form noValidate onSubmit={handleSubmit}>
                                <MainCard title="Allowances (add / update)">
                                    <Grid container spacing={3} gridColumn={12}>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <InputField
                                                id="allowance_breakfast"
                                                label="Breakfast allowance"
                                                type="number"
                                                touched={touched.allowance_breakfast}
                                                errors={errors.allowance_breakfast}
                                                values={values.allowance_breakfast}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                icon={<BiDollar />}
                                            />
                                            {touched.allowance_breakfast && errors.allowance_breakfast && (
                                                <FormHelperText error id="helper-text-allowance_breakfast">
                                                    {errors.allowance_breakfast}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <TimePicker24
                                                id="time_breakfast"
                                                label="Breakfast time"
                                                type="time"
                                                touched={touched.time_breakfast}
                                                errors={errors.time_breakfast}
                                                values={values.time_breakfast}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <InputField
                                                id="allowance_lunch"
                                                label="lunch allowance"
                                                type="number"
                                                touched={touched.allowance_lunch}
                                                errors={errors.allowance_lunch}
                                                values={values.allowance_lunch}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                icon={<BiDollar />}
                                            />
                                            {touched.allowance_lunch && errors.allowance_lunch && (
                                                <FormHelperText error id="helper-text-allowance_lunch">
                                                    {errors.allowance_lunch}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <TimePicker24
                                                id="time_lunch_from"
                                                label="Lunch time from"
                                                type="time"
                                                touched={touched.time_lunch_from}
                                                errors={errors.time_lunch_from}
                                                values={values.time_lunch_from}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <TimePicker24
                                                id="time_lunch_to"
                                                label="Lunch time to"
                                                type="time"
                                                touched={touched.time_lunch_to}
                                                errors={errors.time_lunch_to}
                                                values={values.time_lunch_to}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <InputField
                                                id="allowance_dinner"
                                                label="Dinner allowance"
                                                type="number"
                                                touched={touched.allowance_dinner}
                                                errors={errors.allowance_dinner}
                                                values={values.allowance_dinner}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                icon={<BiDollar />}
                                            />
                                            {touched.allowance_dinner && errors.allowance_dinner && (
                                                <FormHelperText error id="helper-text-allowance_dinner">
                                                    {errors.allowance_dinner}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <TimePicker24
                                                id="time_dinner"
                                                label="Dinner time"
                                                type="time"
                                                touched={touched.time_dinner}
                                                errors={errors.time_dinner}
                                                values={values.time_dinner}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <InputField
                                                id="allowance_lodging"
                                                label="Lodging allowance"
                                                type="number"
                                                touched={touched.allowance_lodging}
                                                errors={errors.allowance_lodging}
                                                values={values.allowance_lodging}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                icon={<BiDollar />}
                                            />
                                            {touched.allowance_lodging && errors.allowance_lodging && (
                                                <FormHelperText error id="helper-text-allowance_lodging">
                                                    {errors.allowance_lodging}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <TimePicker24
                                                id="time_lodging_before"
                                                label="Lodging Time From"
                                                type="time"
                                                touched={touched.time_lodging_before}
                                                errors={errors.time_lodging_before}
                                                values={values.time_lodging_before}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <TimePicker24
                                                id="time_lodging_after"
                                                label="Lodging Time To"
                                                type="time"
                                                touched={touched.time_lodging_after}
                                                errors={errors.time_lodging_after}
                                                values={values.time_lodging_after}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <InputField
                                                id="min_est_trip_hours"
                                                label="Estimated trip hours to avail these allowances"
                                                type="number"
                                                touched={touched.min_est_trip_hours}
                                                errors={errors.min_est_trip_hours}
                                                values={values.min_est_trip_hours}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                            />
                                            {touched.min_est_trip_hours && errors.min_est_trip_hours && (
                                                <FormHelperText error id="helper-text-min_est_trip_hours">
                                                    {errors.min_est_trip_hours}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <SelectDropDown
                                                id="allow_attendant"
                                                label="Attendant Allowance"
                                                touched={touched}
                                                errors={errors}
                                                values={values?.allow_attendant}
                                                options={allowanceType}
                                                setFieldValue={setFieldValue}
                                            />
                                            {touched.allow_attendant && errors.allow_attendant && (
                                                <FormHelperText error id="helper-text-allow_attendant">
                                                    {errors.allow_attendant}
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
                                                        allowance ? 'Update Allowance' :
                                                            'Add Allowance'
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
