// material-ui
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// project-imports
import MainCard from 'components/MainCard';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Button, CircularProgress, OutlinedInput } from '@mui/material';
import { useState } from 'react';
import { ArrowDown2 } from 'iconsax-react';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Autocomplete as CustomAutocomplete } from '@mui/material';
import Autocomplete from "react-google-autocomplete";
import { openSnackbar } from 'api/snackbar';
import { useNavigate } from 'react-router';
import { fundingSources, genders, mobilities } from 'constants/constants';
import 'react-phone-input-2/lib/style.css';
import PhoneNumber from 'components/@extended/PhoneNumber';
import { decryptToken } from 'utils/tokenUtils';
import { useTheme } from '@emotion/react';

// ==============================|| LAYOUTS -  COLUMNS ||============================== //

export default function AddPatient() {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate()
    const theme = useTheme()
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);

    const filter = createFilterOptions();

    const fields = ["address", "date_of_birth", "social_security_number", "gender", "phone_number", "routing_number", "mobility", "funding_source"];
    const errorsMessage = fields.reduce((acc, field) => {
        const key = `${field}Error`;
        acc[key] = errorMsg?.errors?.[field] ?? null;
        return acc;
    }, {});

    const AddPatient = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await fetch(`${API_URL}store-patient`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setErrorMsg(errorData);
                openSnackbar({
                    open: true,
                    message: errorData ? errorMsg?.message : 'Patient is not added!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            openSnackbar({
                open: true,
                message: 'Patient added Successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
            setTimeout(() => {
                navigate('/patients')
            }, 1500);

        } catch (error) {
            openSnackbar({
                open: true,
                message: error ? error?.message : 'Server error',
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
                address: '',
                date_of_birth: '',
                gender: '',
                phone_number: '',
                social_security_number: '',
                mobility: '',
                medicaid_number: '',
                account_number: '',
                routing_number: '',
                identifier_number: '',
                funding_source: '',
                notes: '',
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string().max(255).required('Name is required'),
                address: Yup.string().max(255).required('Address is required'),
                date_of_birth: Yup.string().max(255).required('Date of birth is required'),
                gender: Yup.string().max(255).required('Gender is required'),
                phone_number: Yup.string().max(255).required('Phone number is required'),
                mobility: Yup.string().max(255).required('Mobility is required'),
                funding_source: Yup.string().max(255).required('Funding source is required'),
                social_security_number: Yup.string().matches(/^\d{0,11}$/, "Must be up to 11 digits only"),

            })}
            onSubmit={AddPatient}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <MainCard title="Add New Patient">
                        <Grid container spacing={3} gridColumn={12}>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">Name</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.name && errors.name)}
                                        id="name"
                                        type="test"
                                        value={values.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^[A-Za-z\s]*$/.test(val)) {
                                                setFieldValue("name", val);
                                            }
                                        }}
                                        placeholder="Enter your name"
                                        inputProps={{}}
                                    />
                                </Stack>
                                {touched.name && errors.name && (
                                    <FormHelperText error id="helper-text-name">
                                        {errors.name}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
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
                                                placeholder="Enter address"
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
                                        <span>{errors.address || errorsMessage.addressError}</span>
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="date_of_birth">Date of birth</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.date_of_birth && errors.date_of_birth)}
                                        id="date_of_birth"
                                        type="date"
                                        value={values.date_of_birth}
                                        name="date_of_birth"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter your date of birth"
                                        inputProps={{
                                            max: new Date(Date.now() - 86400000).toISOString().split("T")[0]
                                        }}
                                    />
                                </Stack>
                                {touched.date_of_birth && errors.date_of_birth && (
                                    <FormHelperText error id="helper-text-date_of_birth">
                                        {errors.date_of_birth || errorsMessage.date_of_birthError}
                                    </FormHelperText>
                                )}
                                <FormHelperText error >
                                    {errorsMessage.date_of_birthError}
                                </FormHelperText>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="gender">Gender</InputLabel>
                                    <CustomAutocomplete
                                        fullWidth
                                        value={values.gender ? { value: values.gender, label: values.gender.charAt(0).toUpperCase() + values.gender.slice(1) } : { value: '', label: '' }}
                                        disableClearable
                                        onChange={(event, newValue) => {
                                            let newLabelValue;

                                            // If newValue is an object (selected option)
                                            if (newValue && typeof newValue === 'object') {
                                                newLabelValue = newValue.value; // Set the selected value (string)
                                            } else if (typeof newValue === 'string') {
                                                // If it's a string (freeSolo input), treat it as the value
                                                newLabelValue = newValue;
                                            } else {
                                                // Handle the case where newValue is null or undefined
                                                newLabelValue = '';
                                            }

                                            setFieldValue('gender', newLabelValue); // Set the value (string, not object)
                                        }}
                                        filterOptions={(options, params) => {
                                            const filtered = filter(options, params);
                                            const { inputValue } = params;
                                            const isExisting = options.some((option) => inputValue === option.label);
                                            if (inputValue !== '' && !isExisting) {
                                                filtered.push({ value: inputValue, label: `Add "${inputValue}"` }); // Show custom value in dropdown
                                            }
                                            return filtered;
                                        }}
                                        selectOnFocus
                                        clearOnBlur
                                        autoHighlight
                                        handleHomeEndKeys
                                        id="gender"
                                        options={genders}
                                        getOptionLabel={(option) => option?.label}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        padding: '6px 9px',
                                                    },
                                                }}
                                                {...params}
                                                name="gender"
                                                placeholder="Select gender"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <ArrowDown2 />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </Stack>
                                {touched.gender && errors.gender && (
                                    <FormHelperText error id="helper-text-gender">
                                        {errors.gender}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <PhoneNumber
                                    id="phone_number"
                                    value={values.phone_number}
                                    onChange={(phone) => setFieldValue('phone_number', phone)}
                                    onBlur={handleBlur}
                                    touched={touched.phone_number}
                                    error={errors.phone_number}
                                />
                                {errors.phone_numberError && (
                                    <FormHelperText error id="helper-text-phone_number">
                                        {errors.phone_numberError}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="mobility">Mobility</InputLabel>
                                    <CustomAutocomplete
                                        fullWidth
                                        value={values.mobility ? { value: values.mobility, label: values.mobility.charAt(0).toUpperCase() + values.mobility.slice(1) } : { value: '', label: '' }}
                                        disableClearable
                                        onChange={(event, newValue) => {
                                            let newLabelValue;

                                            // If newValue is an object (selected option)
                                            if (newValue && typeof newValue === 'object') {
                                                newLabelValue = newValue.label; // Set the selected value (string)
                                            } else if (typeof newValue === 'string') {
                                                // If it's a string (freeSolo input), treat it as the value
                                                newLabelValue = newValue;
                                            } else {
                                                // Handle the case where newValue is null or undefined
                                                newLabelValue = '';
                                            }

                                            setFieldValue('mobility', newLabelValue); // Set the value (string, not object)
                                        }}
                                        filterOptions={(options, params) => {
                                            const filtered = filter(options, params);
                                            const { inputValue } = params;
                                            const isExisting = options.some((option) => inputValue === option.label);
                                            if (inputValue !== '' && !isExisting) {
                                                filtered.push({ value: inputValue, label: `Add "${inputValue}"` }); // Show custom value in dropdown
                                            }
                                            return filtered;
                                        }}
                                        selectOnFocus
                                        clearOnBlur
                                        autoHighlight
                                        handleHomeEndKeys
                                        id="mobility"
                                        options={mobilities}
                                        getOptionLabel={(option) => option?.label}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        padding: '6px 9px',
                                                    },
                                                }}
                                                {...params}
                                                name="mobility"
                                                placeholder="Select mobility"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <ArrowDown2 />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </Stack>
                                {touched.mobility && errors.mobility && (
                                    <FormHelperText error id="helper-text-mobility">
                                        {errors.mobility}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="funding_source">Funding Source</InputLabel>
                                    <CustomAutocomplete
                                        fullWidth
                                        value={values.funding_source ? { value: values.funding_source, label: values.funding_source.charAt(0).toUpperCase() + values.funding_source.slice(1) } : { value: '', label: '' }}
                                        disableClearable
                                        onChange={(event, newValue) => {
                                            let newLabelValue;

                                            // If newValue is an object (selected option)
                                            if (newValue && typeof newValue === 'object') {
                                                newLabelValue = newValue.label; // Set the selected value (string)
                                            } else if (typeof newValue === 'string') {
                                                // If it's a string (freeSolo input), treat it as the value
                                                newLabelValue = newValue;
                                            } else {
                                                // Handle the case where newValue is null or undefined
                                                newLabelValue = '';
                                            }

                                            setFieldValue('funding_source', newLabelValue); // Set the value (string, not object)
                                        }}
                                        filterOptions={(options, params) => {
                                            const filtered = filter(options, params);
                                            const { inputValue } = params;
                                            const isExisting = options.some((option) => inputValue === option.label);
                                            if (inputValue !== '' && !isExisting) {
                                                filtered.push({ value: inputValue, label: `Add "${inputValue}"` }); // Show custom value in dropdown
                                            }
                                            return filtered;
                                        }}
                                        selectOnFocus
                                        clearOnBlur
                                        autoHighlight
                                        handleHomeEndKeys
                                        id="funding_source"
                                        options={fundingSources}
                                        getOptionLabel={(option) => option?.label}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        padding: '6px 9px',
                                                    },
                                                }}
                                                {...params}
                                                name="funding_source"
                                                placeholder="Select funding_source"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <ArrowDown2 />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </Stack>
                                {touched.funding_source && errors.funding_source && (
                                    <FormHelperText error id="helper-text-funding_source">
                                        {errors.funding_source}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <MainCard title="For Reimbursemnet Trips">
                                    <Grid container spacing={3} gridColumn={12}>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="social_security_number">Social Security Number</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    id="social_security_number"
                                                    type="text"
                                                    value={values.social_security_number}
                                                    name="social_security_number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Enter your social security number"
                                                    inputProps={{ maxLength: 11 }}
                                                />
                                            </Stack>
                                            {touched.social_security_number && errors.social_security_number && (
                                                <FormHelperText error id="helper-text-social_security_number">
                                                    {errors.social_security_number}
                                                </FormHelperText>
                                            )}
                                            <FormHelperText error id="helper-text-social_security_number">
                                                {errorsMessage.social_security_numberError}
                                            </FormHelperText>
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="medicaid_number">Medicaid Number</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    id="medicaid_number"
                                                    type="text"
                                                    value={values.medicaid_number}
                                                    name="medicaid_number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Enter your medicaid number"
                                                    inputProps={{}}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="account_number">Account Number</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    id="account_number"
                                                    type="text"
                                                    value={values.account_number}
                                                    name="account_number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Enter your account number"
                                                    inputProps={{}}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="routing_number">Routing Number</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    id="routing_number"
                                                    type="text"
                                                    value={values.routing_number}
                                                    name="routing_number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Enter your routing number"
                                                    inputProps={{ maxLength: 9 }}
                                                />
                                            </Stack>
                                            {touched.routing_number && errors.routing_number && (
                                                <FormHelperText error id="helper-text-routing_number">
                                                    {errors.routing_number}
                                                </FormHelperText>
                                            )}
                                            <FormHelperText error id="helper-text-routing_number">
                                                {errorsMessage.routing_numberError}
                                            </FormHelperText>
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="identifier_number">Identifier Number</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    id="identifier_number"
                                                    type="text"
                                                    value={values.identifier_number}
                                                    name="identifier_number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Enter your identifier number"
                                                    inputProps={{}}
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </MainCard>
                            </Grid>
                            <Grid item xs={12} >
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="notes">Notes</InputLabel>
                                    <TextField
                                        fullWidth
                                        error={Boolean(touched.notes && errors.notes)}
                                        id="notes"
                                        type="text"
                                        value={values.notes}
                                        name="notes"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter your notes"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        inputProps={{}}
                                    />

                                </Stack>
                                {touched.notes && errors.notes && (
                                    <FormHelperText error id="helper-text-notes">
                                        {errors.notes}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 4 }}>
                                    <Button variant="outlined" color="secondary" F>
                                        Cancel
                                    </Button>
                                    <Button disableElevation disabled={isSubmitting} variant="contained" type='submit' sx={{
                                        '&.Mui-disabled': {
                                            bgcolor: theme.palette.primary.main,
                                        }
                                    }}>
                                        {isSubmitting ? <CircularProgress sx={{ height: '20px !important', width: '20px !important', color: 'white' }} /> : 'Add Patient'}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </MainCard>
                </form>
            )}
        </Formik>
    );
}
