// material-ui
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

// project-imports
import MainCard from 'components/MainCard';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, CircularProgress, FormLabel, OutlinedInput, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ArrowDown2, Camera } from 'iconsax-react';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Autocomplete as CustomAutocomplete } from '@mui/material';
import Autocomplete from "react-google-autocomplete";
import { openSnackbar } from 'api/snackbar';
import { useNavigate, useParams } from 'react-router';
import { usStates } from 'constants/constants';
import Avatar from 'components/@extended/Avatar';
import { ThemeMode } from 'config';
import PhoneNumber from 'components/@extended/PhoneNumber';
import { decryptToken } from 'utils/tokenUtils';

// ==============================|| LAYOUTS -  COLUMNS ||============================== //

export default function UpdateReimbursementDriver() {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const IMAGE_PATH = import.meta.env.VITE_SERVER_IMAGE_PATH;
    const navigate = useNavigate()
    const theme = useTheme()
    const [errorMsg, setErrorMsg] = useState(null);
    const [data, setData] = useState({});
    const [driverImage, setDriverImage] = useState(null);
    const [licenseFrontImage, setLicenseFrontImage] = useState(null);
    const [licenseBackImage, setLicenseBackImage] = useState(null);

    // Preview images (optional)
    const [previewAvatar, setPreviewAvatar] = useState();
    const [previewAvatar1, setPreviewAvatar1] = useState();
    const [previewAvatar2, setPreviewAvatar2] = useState();

    useEffect(() => {
        if (data?.driver_image) setPreviewAvatar(IMAGE_PATH + data.driver_image);
        if (data?.license_front_image) setPreviewAvatar1(IMAGE_PATH + data.license_front_image);
        if (data?.license_back_image) setPreviewAvatar2(IMAGE_PATH + data.license_back_image);
    }, [data]);



    const handleImageChange = (event, setImage, setPreview) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const filter = createFilterOptions();

    const { reimbursement_drivers } = useParams()
    const expiry = data?.license_expiry
        ? new Date(data.license_expiry).toISOString().split('T')[0]
        : '';


    const fields = ["patient_id", "phone_number", "license_number", "license_expiry", "driver_image", "license_front_image", "license_back_image"];
    const errorsMessage = fields.reduce((acc, field) => {
        const key = `${field}Error`;
        acc[key] = errorMsg?.errors?.[field] ?? null;
        return acc;
    }, {});

    const FetchReimbursementDriver = async () => {
        try {
            const response = await fetch(`${API_URL}reimbursement-driver/${reimbursement_drivers}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                openSnackbar({
                    open: true,
                    message: errorData ? errorData?.message : 'reimbursement driver is not fetched!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            const data = await response.json();
            setData(data?.data)


        } catch (err) {
            setErrorMsg(err);
        }
    }
    useEffect(() => {
        FetchReimbursementDriver();
    }, [])

    const UpdateReimbursementDriver = async (values, { setSubmitting, setErrors }) => {
        try {
            // Create FormData for file upload
            const formData = new FormData();
            if (driverImage) formData.append('driver_image', driverImage);
            if (licenseFrontImage) formData.append('license_front_image', licenseFrontImage);
            if (licenseBackImage) formData.append('license_back_image', licenseBackImage);


            formData.append('reimbursement_driver_id', reimbursement_drivers);
            formData.append('user_id', data.user_id);

            // Append form values (text data)
            Object.keys(values).forEach(key => {
                if (values[key] !== null && values[key] !== undefined) { // Avoid appending null/undefined fields
                    formData.append(key, values[key]);
                }
            });

            const response = await fetch(`${API_URL}update-reimbursement-driver`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMsg(errorData)
                openSnackbar({
                    open: true,
                    message: errorData?.message || 'Failed to update driver!',
                    variant: 'alert',
                    alert: { color: 'error' }
                });
                throw new Error(errorData?.message || 'Request failed');
            }

            openSnackbar({
                open: true,
                message: 'Driver updated successfully!',
                variant: 'alert',
                alert: { color: 'success' }
            });

            setTimeout(() => {
                navigate(`/patients/${data.user_id}/reimbursement-drivers`);
            }, 1500);

        } catch (error) {
            openSnackbar({
                open: true,
                message: error?.message || 'Server error',
                variant: 'alert',
                alert: { color: 'error' }
            });
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <Formik
            initialValues={{
                driver_image: null,
                license_front_image: null,
                license_back_image: null,
                driver_name: data?.driver_name,
                patient_id: data?.user_id,
                phone_number: data?.phone_number,
                license_number: data?.license_number,
                license_state: data?.license_state,
                license_expiry: expiry,
                account_no: data?.account_no,
                address: data?.address,
                notes: data?.notes,
            }}
            validationSchema={Yup.object().shape({
                driver_name: Yup.string().max(255).required('Driver name is required'),
                patient_id: Yup.string().max(255).required('Patient id is required'),
                phone_number: Yup.string().max(255).required('Phone number is required'),
                license_number: Yup.string().max(255).required('License number is required'),
                license_state: Yup.string().max(255).required('License state is required'),
                license_expiry: Yup.string().max(255).required('Date of birth is required'),
                account_no: Yup.string().max(255).required('Account number is required'),
                address: Yup.string().max(255).required('Address is required'),
            })}
            enableReinitialize={true}
            onSubmit={UpdateReimbursementDriver}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <MainCard title="Add New Reimbursement Driver">
                        <Grid container spacing={3} gridColumn={12}>
                            <Grid item xs={12} sx={{ display: 'flex', gap: '40px' }}>
                                <Box>
                                    <InputLabel htmlFor="driver_image">Driver image</InputLabel>
                                    <Stack direction="row" sx={{ mt: 1 }}>
                                        <FormLabel
                                            htmlFor="change-avtar"
                                            sx={{
                                                position: 'relative',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                '&:hover .MuiBox-root': { opacity: 1 },
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Avatar alt="" src={previewAvatar} sx={{ width: 172, height: 172, border: '1px dashed' }} />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                                                    width: '100%',
                                                    height: '100%',
                                                    opacity: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Stack spacing={0.5} alignItems="center">
                                                    <Camera style={{ color: theme.palette.secondary.light, fontSize: '2rem' }} />
                                                    <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                                                </Stack>
                                            </Box>
                                        </FormLabel>
                                        <TextField
                                            type="file"
                                            id="change-avtar"
                                            placeholder="Outlined"
                                            variant="outlined"
                                            sx={{ display: 'none' }}
                                            onChange={(e) => handleImageChange(e, setDriverImage, setPreviewAvatar)}
                                        />
                                    </Stack>
                                    <FormHelperText error id="helper-text-driver_image">
                                        {errorsMessage.driver_imageError}
                                    </FormHelperText>

                                </Box>
                                <Box>
                                    <InputLabel htmlFor="license_front_image">License front image</InputLabel>
                                    <Stack direction="row" sx={{ mt: 1 }}>
                                        <FormLabel
                                            htmlFor="license_front_image"
                                            sx={{
                                                position: 'relative',
                                                borderRadius: '5px',
                                                overflow: 'hidden',
                                                '&:hover .MuiBox-root': { opacity: 1 },
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Avatar alt="" src={previewAvatar1} sx={{ width: 272, height: 272, border: '1px dashed', borderRadius: "5px" }} />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, 0.98)' : 'rgba(0,0,0,.65)',
                                                    width: '100%',
                                                    height: '100%',
                                                    opacity: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: "5px"
                                                }}
                                            >
                                                <Stack spacing={0.5} alignItems="center">
                                                    <Camera style={{ color: theme.palette.secondary.light, fontSize: '2rem' }} />
                                                    <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                                                </Stack>
                                            </Box>
                                        </FormLabel>
                                        <TextField
                                            type="file"
                                            id="license_front_image"
                                            placeholder="Outlined"
                                            variant="outlined"
                                            sx={{ display: 'none' }}
                                            onChange={(e) => handleImageChange(e, setLicenseFrontImage, setPreviewAvatar1)}
                                        />
                                    </Stack>
                                    <FormHelperText error id="helper-text-license_front_image">
                                        {errorsMessage.license_front_imageError}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                    <InputLabel htmlFor="license_back_image">License back image</InputLabel>
                                    <Stack direction="row" sx={{ mt: 1 }}>
                                        <FormLabel
                                            htmlFor="license_back_image"
                                            sx={{
                                                position: 'relative',
                                                borderRadius: '5px',
                                                overflow: 'hidden',
                                                '&:hover .MuiBox-root': { opacity: 1 },
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Avatar alt="" src={previewAvatar2} sx={{ width: 272, height: 272, border: '1px dashed', borderRadius: "5px" }} />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, 0.98)' : 'rgba(0,0,0,.65)',
                                                    width: '100%',
                                                    height: '100%',
                                                    opacity: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: "5px"
                                                }}
                                            >
                                                <Stack spacing={0.5} alignItems="center">
                                                    <Camera style={{ color: theme.palette.secondary.light, fontSize: '2rem' }} />
                                                    <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                                                </Stack>
                                            </Box>
                                        </FormLabel>
                                        <TextField
                                            type="file"
                                            id="license_back_image"
                                            placeholder="Outlined"
                                            variant="outlined"
                                            sx={{ display: 'none' }}
                                            onChange={(e) => handleImageChange(e, setLicenseBackImage, setPreviewAvatar2)}
                                        />
                                    </Stack>
                                    <FormHelperText error id="helper-text-license_back_image">
                                        {errorsMessage.license_front_imageError}
                                    </FormHelperText>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="driver_name">Driver name</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.driver_name && errors.driver_name)}
                                        id="driver_name"
                                        type="text"
                                        value={values.driver_name}
                                        name="driver_name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter driver name"
                                        inputProps={{}}
                                    />
                                </Stack>
                                {touched.driver_name && errors.driver_name && (
                                    <FormHelperText error id="helper-text-driver_name">
                                        {errors.driver_name}
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
                                <FormHelperText error id="helper-text-phone_number">
                                    {errorsMessage.phone_numberError}
                                </FormHelperText>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="license_number">License number</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.license_number && errors.license_number)}
                                        id="license_number"
                                        type="text"
                                        value={values.license_number}
                                        name="license_number"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        inputProps={{}}
                                    />
                                </Stack>
                                {touched.license_number && errors.license_number && (
                                    <FormHelperText error id="helper-text-license_number">
                                        {errors.license_number}
                                    </FormHelperText>
                                )}
                                <FormHelperText error id="helper-text-license_number">
                                    {errorsMessage.license_numberError}
                                </FormHelperText>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="license_state">License state</InputLabel>
                                    <CustomAutocomplete
                                        fullWidth
                                        value={values.license_state ? { value: values.license_state, label: values.license_state.charAt(0).toUpperCase() + values.license_state.slice(1) } : { value: '', label: '' }}
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

                                            setFieldValue('license_state', newLabelValue); // Set the value (string, not object)
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
                                        id="license_state"
                                        options={usStates}
                                        getOptionLabel={(option) => option?.label}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField
                                                error={Boolean(touched.license_state && errors.license_state)}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        padding: '6px 9px',
                                                    },
                                                }}
                                                {...params}
                                                name="license_state"
                                                placeholder="Select state"
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
                                {touched.license_state && errors.license_state && (
                                    <FormHelperText error id="helper-text-license_state">
                                        {errors.license_state}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="license_expiry">License expiry</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.license_expiry && errors.license_expiry)}
                                        id="license_expiry"
                                        type="date"
                                        value={values.license_expiry}
                                        name="license_expiry"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter your date of birth"
                                        inputProps={{}}
                                    />
                                </Stack>
                                {touched.license_expiry && errors.license_expiry && (
                                    <FormHelperText error id="helper-text-license_expiry">
                                        {errors.license_expiry}
                                    </FormHelperText>
                                )}
                                <FormHelperText error>
                                    {errorsMessage.license_expiryError}
                                </FormHelperText>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="account_no">Account Number</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.account_no && errors.account_no)}
                                        id="account_no"
                                        type="text"
                                        value={values.account_no}
                                        name="account_no"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter your account number"
                                        inputProps={{}}
                                    />
                                </Stack>
                                {touched.account_no && errors.account_no && (
                                    <FormHelperText error id="helper-text-account_no">
                                        {errors.account_no}
                                    </FormHelperText>
                                )}
                                {/* <FormHelperText error id="helper-text-account_no">
                                    {errorsMessage.account_noError}
                                </FormHelperText> */}
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
                                        <span>{errors.address}</span>
                                    </FormHelperText>
                                )}
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
                                        {isSubmitting ? <CircularProgress sx={{ height: '20px !important', width: '20px !important', color: 'white' }} /> : 'Update Driver'}
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
