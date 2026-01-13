import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { Button, FormHelperText, Grid, InputLabel, Stack, TextField } from '@mui/material';
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

    const handleAddComplaint = async (values, { setSubmitting, setErrors }) => {
        try {
            let finalTargetId = '';
            if (values.trip_id) {
                finalTargetId = values.target_id?.value || '';
            } else {
                if (values.target_role === 'driver') finalTargetId = values['target_id (driver)']?.value || '';
                if (values.target_role === 'provider') finalTargetId = values['target_id (provider)']?.value || '';
            }

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
                    target_id: finalTargetId,
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
            openSnackbar({ open: true, message: `${response?.message} || Server error`, variant: 'alert', alert: { color: 'error' } });
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
                'target_id (driver)': null,
                'target_id (provider)': null,
            }}
            validationSchema={Yup.object().shape({
                subject: Yup.string().max(255).required('Subject is required'),
                description: Yup.string().min(10).max(255).required('Description should minimum 10 characters'),
                target_role: Yup.string().required('Target role is required'),
                priority: Yup.string().required('Priority is required'),
                trip_id: Yup.mixed().nullable(),
                target_id: Yup.mixed().when('trip_id', {
                    is: (trip_id) => !!trip_id,
                    then: (schema) => schema.required('Target is required'),
                    otherwise: (schema) => schema.nullable(),
                }),
                'target_id (driver)': Yup.mixed().when(['trip_id', 'target_role'], {
                    is: (trip_id, role) => !trip_id && role === 'driver',
                    then: (schema) => schema.required('Driver is required'),
                    otherwise: (schema) => schema.nullable(),
                }),
                'target_id (provider)': Yup.mixed().when(['trip_id', 'target_role'], {
                    is: (trip_id, role) => !trip_id && role === 'provider',
                    then: (schema) => schema.required('Provider is required'),
                    otherwise: (schema) => schema.nullable(),
                }),
                provider_id: Yup.mixed().when(['trip_id', 'target_role'], {
                    is: (trip_id, role) => !trip_id && role === 'driver',
                    then: (schema) => schema.required('Provider is required'),
                    otherwise: (schema) => schema.nullable(),
                }),
            })}
            onSubmit={handleAddComplaint}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {

                useEffect(() => {
                    if (!selectedTrip || !values.target_role) return;

                    if (values.target_role === 'provider') {
                        const targetValue = selectedTrip.provider ? { value: selectedTrip.provider.id, displayLabel: selectedTrip.provider.name } : null;
                        setFieldValue('target_id', targetValue);
                    }

                    if (values.target_role === 'driver') {
                        const targetValue = selectedTrip.provider_driver ? { value: selectedTrip.provider_driver.id, displayLabel: selectedTrip.provider_driver.name } : null;
                        setFieldValue('target_id', targetValue);
                    }
                }, [selectedTrip, values.target_role]);

                useEffect(() => {
                    if (!values.trip_id) {
                        setSelectedTrip({});
                        setFieldValue('target_id', null);
                        setFieldValue('provider_id', null);
                    }
                }, [values.trip_id]);

                useEffect(() => {
                    setFieldValue('target_id (driver)', null);
                    setFieldValue('target_id (provider)', null);
                    setFieldValue('provider_id', null);
                }, [values.target_role]);

                // Determine which target error to show
                const showTargetError = () => {
                    if (values.trip_id) return touched.target_id && errors.target_id;
                    if (!values.trip_id && values.target_role === 'driver') return touched['target_id (driver)'] && errors['target_id (driver)'];
                    if (!values.trip_id && values.target_role === 'provider') return touched['target_id (provider)'] && errors['target_id (provider)'];
                    return false;
                };

                const targetErrorMessage = () => {
                    if (values.trip_id) return errors.target_id;
                    if (!values.trip_id && values.target_role === 'driver') return errors['target_id (driver)'];
                    if (!values.trip_id && values.target_role === 'provider') return errors['target_id (provider)'];
                    return '';
                };

                return (
                    <form noValidate onSubmit={handleSubmit}>
                        <MainCard title="Add New Complaint">
                            <Grid container spacing={3}>

                                {/* Trip Dropdown */}
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

                                {/* Subject */}
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

                                {/* Target Role */}
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
                                    {touched.target_role && errors.target_role && <FormHelperText error>{errors.target_role}</FormHelperText>}
                                </Grid>

                                {/* When no trip is selected */}
                                {!values.trip_id && values.target_role === 'driver' && (
                                    <>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <DebouncedDropdown
                                                label="Provider Id"
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                apiEndpoint="/providers"
                                                displayKeys={['name', 'id']}
                                                searchPararm="name"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <DebouncedDropdown
                                                label="Target Id (driver)"
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                apiEndpoint="/get-provider-drivers"
                                                displayKeys={['name', 'id']}
                                                queryParams={{ provider_id: values?.provider_id?.value }}
                                                key={values.provider_id?.value || 'no-provider'}
                                                searchPararm="name"
                                            />
                                            {showTargetError() && <FormHelperText error>{targetErrorMessage()}</FormHelperText>}
                                        </Grid>
                                    </>
                                )}

                                {!values.trip_id && values.target_role === 'provider' && (
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <DebouncedDropdown
                                            label="Target Id (provider)"
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            apiEndpoint="/providers"
                                            displayKeys={['name', 'id']}
                                            searchPararm="name"
                                        />
                                        {showTargetError() && <FormHelperText error>{targetErrorMessage()}</FormHelperText>}
                                    </Grid>
                                )}

                                {/* When trip is selected */}
                                {values.trip_id && (
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <InputField
                                            id="target_id"
                                            label={`Target (${values.target_role})`}
                                            type="text"
                                            values={values.target_id?.displayLabel || ''}
                                            disabled={true}
                                        />
                                        {showTargetError() && <FormHelperText error>{targetErrorMessage()}</FormHelperText>}
                                    </Grid>
                                )}

                                {/* Priority */}
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
                                    {touched.priority && errors.priority && <FormHelperText error>{errors.priority}</FormHelperText>}
                                </Grid>

                                {/* Description */}
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

                                {/* Submit */}
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 4 }}>
                                        <Button disableElevation disabled={isSubmitting} variant="contained" type="submit" sx={{ '&.Mui-disabled': { bgcolor: theme.palette.primary.main } }}>
                                            {isSubmitting ? 'Adding....' : 'Add Complaint'}
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
