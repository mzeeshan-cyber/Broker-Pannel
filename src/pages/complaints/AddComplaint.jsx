import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Button, CircularProgress, FormHelperText, Grid, InputLabel, Stack, TextField } from '@mui/material';
import { Formik } from 'formik';
import { complaintsPriority, targetRoles } from 'constants/constants';
import InputField from 'components/common/InputField';
import { useTheme } from '@emotion/react';
import SelectDropDown from 'components/common/SelectDropDown';
import DebouncedDropdown from './TripDropdown';
import { openSnackbar } from 'api/snackbar';
import { decryptToken } from 'utils/tokenUtils';
import { useNavigate } from 'react-router';

export default function AddComplaint() {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const [selectedTrip, setSelectedTrip] = useState({});
    const theme = useTheme();
    const navigate = useNavigate();

    const AddProviderSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await fetch(`${API_URL}store-complaint`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: JSON.stringify({
                    ...values,
                    trip_id: values.trip_id?.value || '',
                    provider_id: values.provider_id?.value || '',
                    target_id: values.target_role === 'driver'
                        ? values['target_id (driver)']?.value || ''
                        : values.target_id?.value || ''
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData);
                openSnackbar({ open: true, message: errorData.message || 'Complaint is not added!', variant: 'alert', alert: { color: 'error' } });
                throw new Error(errorData || 'failed!');
            }

            openSnackbar({ open: true, message: 'Complaint added Successfully!', variant: 'alert', alert: { color: 'success' } });
            setTimeout(() => navigate('/complaints'), 1500);

        } catch (error) {
            openSnackbar({ open: true, message: `${error?.message} || Server error`, variant: 'alert', alert: { color: 'error' } });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{
                trip_id: null,
                subject: '',
                description: '',
                priority: '',
                target_id: null,
                target_role: '',
                provider_id: null,
            }}
            validationSchema={Yup.object().shape({
                subject: Yup.string().max(255).required('Subject is required'),
                description: Yup.string().min(8).max(255).required('Description should minimum 8 characters'),
            })}
            onSubmit={AddProviderSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {

                useEffect(() => {
                    if (!selectedTrip || !values.target_role) return;
                    if (values.target_role === 'provider') setFieldValue('target_id', selectedTrip.provider_id || '');
                    if (values.target_role === 'driver') setFieldValue('target_id', selectedTrip.provider_driver_id || '');
                }, [selectedTrip, values.target_role]);

                useEffect(() => {
                    if (!values.trip_id) {
                        setSelectedTrip({});
                        setFieldValue('target_id', null);
                        setFieldValue('provider_id', null);
                    } else {
                        if (values.target_role === 'provider') setFieldValue('target_id', selectedTrip.provider_id || null);
                        if (values.target_role === 'driver') setFieldValue('target_id', selectedTrip.provider_driver_id || null);
                    }
                }, [values.trip_id]);

                return (
                    <form noValidate onSubmit={handleSubmit}>
                        <MainCard title="Add New Complaint">
                            <Grid container spacing={3}>

                                <Grid item xs={12}>
                                    <DebouncedDropdown
                                        label="Trip Id"
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        apiEndpoint="/get-trips"
                                        extraDataMapper={setSelectedTrip}
                                        displayKeys={['id', 'patient.name', 'service_date']}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <InputField
                                        id="subject"
                                        label="Subject"
                                        type="text"
                                        touched={touched.subject}
                                        errors={errors.subject}
                                        values={values.subject}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                    {touched.subject && errors.subject && <FormHelperText error>{errors.subject}</FormHelperText>}
                                </Grid>

                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <SelectDropDown
                                        label="Target Role"
                                        id="target_role"
                                        values={values.target_role}
                                        options={targetRoles}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                </Grid>

                                {values.target_role === 'driver' && !values.trip_id && (
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <DebouncedDropdown
                                            label="Provider Id"
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            apiEndpoint="/providers"
                                            displayKeys={['name', 'id']}
                                        />
                                    </Grid>
                                )}

                                {values.target_id ? (
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <InputField
                                            id="target_id"
                                            label={`Target Id (${values.target_role})`}
                                            type="text"
                                            values={values.target_role === 'driver' ? selectedTrip.provider_driver_id : selectedTrip.provider_id}
                                            disabled={true}
                                        />
                                    </Grid>
                                ) : (
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <DebouncedDropdown
                                            label={`Target Id (${values.target_role})`}
                                            fieldName="target_id"
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            apiEndpoint="/get-provider-drivers"
                                            displayKeys={['id', 'name', 'email']}
                                            queryParams={{ provider_id: values.provider_id?.value }}
                                            key={values.provider_id?.value || 'no-provider'}
                                        />
                                    </Grid>
                                )}

                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <SelectDropDown
                                        label="Priority"
                                        id="priority"
                                        values={values.priority}
                                        options={complaintsPriority}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="description">Description</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="description"
                                            name="description"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.description}
                                            placeholder="Enter description"
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                        />
                                        {touched.description && errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 4 }}>
                                        <Button disableElevation disabled={isSubmitting} variant="contained" type="submit" sx={{ '&.Mui-disabled': { bgcolor: theme.palette.primary.main } }}>
                                            {isSubmitting ? <CircularProgress sx={{ height: 20, width: 20, color: 'white' }} /> : 'Add Complaint'}
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
