// material-ui
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';

// project-imports
import MainCard from 'components/MainCard';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, CircularProgress, InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { openSnackbar } from 'api/snackbar';
import { useNavigate, useParams } from 'react-router';
import InputField from 'components/common/InputField';
import PasswordField from 'components/common/PasswordField';
import AddressField from 'components/common/AddressField';
import PhoneNumber from 'components/@extended/PhoneNumber';
import ImageUploader from 'components/common/ImageUploader';
import { useDispatch, useSelector } from 'react-redux';
import { loading } from 'store/reducers/providerSlice';
import { fetcher } from 'utils/axios';
import { decryptToken } from 'utils/tokenUtils';
import ProviderPersonalInfo from 'components/pages/providers/provider-personal-info/provider-personal-info';
import { useTheme } from '@emotion/react';

export default function UpdateProviderGeneralInfo() {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const IMAGE_URL = import.meta.env.VITE_SERVER_IMAGE_PATH;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const theme = useTheme()
    const navigate = useNavigate();
    const { provider_id } = useParams();
    const [companyLogo, setCompanyLogo] = useState(null);
    const [providerData, setProviderData] = useState({});
    const dispatch = useDispatch()
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

    const UpdateProviderGeneralInfo = async (values, { setSubmitting, setErrors }) => {
        try {
            const formData = new FormData();
            formData.append('company_logo', companyLogo);
            Object.keys(values).forEach(key => {
                formData.append(key, values[key]);
            });
            const response = await fetch(`${API_URL}update-provider-detail/${providerData?.provider_detail?.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData);
                openSnackbar({
                    open: true,
                    message: errorData.message || 'Provider general info is not updated!',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            else {
                openSnackbar({
                    open: true,
                    message: 'Provider general info updated Successfuly!',
                    variant: 'alert',

                    alert: {
                        color: 'success'
                    }
                });
                setTimeout(() => {
                    navigate('/providers')
                }, 1500);
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: 'Server error',
                variant: 'alert',

                alert: {
                    color: 'error'
                }
            });
        } finally {
            setSubmitting(false);
        }
    }

    function formatTime(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        return `${hours}:${minutes}`;
    }

    return (
        <>
            {Loading ? <Loader /> :
                <>
                    <ProviderPersonalInfo providerData={providerData} />
                    <Formik
                        initialValues={{
                            id: providerData?.provider_detail?.id,
                            provider_id: provider_id,
                            company_name: providerData?.provider_detail?.company_name,
                            company_logo: providerData?.provider_detail?.company_logo,
                            company_website: providerData?.provider_detail?.company_website,
                            address: providerData?.provider_detail?.company_address,
                            company_phone: providerData?.provider_detail?.company_phone,
                            company_tax_id: providerData?.provider_detail?.company_tax_id,
                            company_work_start_time: formatTime(providerData?.provider_detail?.company_work_start_time),
                            company_work_end_time: formatTime(providerData?.provider_detail?.company_work_end_time),
                            company_dashcam_ip: providerData?.provider_detail?.company_dashcam_ip,
                            company_dashcam_username: providerData?.provider_detail?.company_dashcam_username,
                            company_dashcam_password: providerData?.provider_detail?.company_dashcam_password,
                            company_owner_name: providerData?.provider_detail?.company_owner_name,
                            company_owner_email: providerData?.provider_detail?.company_owner_email,
                            company_owner_phone: providerData?.provider_detail?.company_owner_phone,
                            company_admin_name: providerData?.provider_detail?.company_admin_name,
                            company_admin_email: providerData?.provider_detail?.company_admin_email,
                            company_admin_phone: providerData?.provider_detail?.company_admin_phone,
                        }}
                        validationSchema={Yup.object().shape({
                            company_name: Yup.string().max(255).required('Comapny name is required'),
                            company_admin_name: Yup.string().max(255).required('Company Admin name is required'),
                            company_owner_name: Yup.string().max(255).required('Company Owner name is required'),
                            company_work_end_time: Yup.string().max(255).required('Company work end time is required'),
                            company_work_start_time: Yup.string().max(255).required('Company work start time is required'),
                            company_dashcam_password: Yup.string()
                                .min(8, 'Password must be at least 8 characters')
                                .max(255, 'Password cannot exceed 255 characters'),
                            // .required('Password is required'),
                            company_owner_email: Yup.string().email('Must be a valid email').max(255).required('Company Owner email is required'),
                            company_admin_email: Yup.string().email('Must be a valid email').max(255).required('Company Admin email is required'),
                            address: Yup.string().max(255).required('Address is required'),
                        })}
                        enableReinitialize={true}

                        onSubmit={UpdateProviderGeneralInfo}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                            return (
                                <form noValidate onSubmit={handleSubmit}>
                                    <MainCard title="Add Provider General Information">
                                        <Grid container spacing={3} gridColumn={12}>
                                            <Grid item xs={12} sx={{ display: 'flex', gap: '60px' }}>
                                                <Box>
                                                    <ImageUploader image={companyLogo} setImage={setCompanyLogo} label="New Company Logo" />
                                                    <FormHelperText error id="helper-text-company_logo">
                                                        {errors?.errors?.company_logo}
                                                    </FormHelperText>
                                                </Box>
                                                <Box>
                                                    <InputLabel>Company Previous Logo</InputLabel>
                                                    <Box sx={{ marginTop: '8px', borderRadius: '50%', height: '170px', width: '170' }}>
                                                        <img src={`${IMAGE_URL}${providerData?.provider_detail?.company_logo}`} alt="Previos Logo" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <InputField
                                                    id="company_name"
                                                    label="Company Name"
                                                    type="text"
                                                    touched={touched.company_name}
                                                    errors={errors.company_name}
                                                    values={values.company_name}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_name && errors.company_name && (
                                                    <FormHelperText error id="helper-text-company_name">
                                                        {errors.company_name}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error id="helper-text-company_name">
                                                    {errors?.errors?.company_name}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <InputField
                                                    id="company_website"
                                                    label="Company Website"
                                                    type="text"
                                                    touched={touched.company_website}
                                                    errors={errors.company_website}
                                                    values={values.company_website}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_website && errors.company_website && (
                                                    <FormHelperText error id="helper-text-company_website">
                                                        {errors.company_website}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error id="helper-text-company_website">
                                                    {errors?.errors?.company_website}
                                                </FormHelperText>
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
                                                <FormHelperText error id="helper-text-address">
                                                    {errors?.errors?.address}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <PhoneNumber
                                                    id="company_phone"
                                                    value={values.company_phone}
                                                    label="Company Phone"
                                                    onChange={(phone) => setFieldValue('company_phone', phone)}
                                                    onBlur={handleBlur}
                                                    touched={touched.company_phone}
                                                    error={errors.company_phone}
                                                />
                                                <FormHelperText error id="helper-text-company_phone">
                                                    {errors?.errors?.company_phone}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <InputField
                                                    id="company_tax_id"
                                                    label="Company tax id"
                                                    type="text"
                                                    touched={touched.company_tax_id}
                                                    errors={errors.company_tax_id}
                                                    values={values.company_tax_id}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_tax_id && errors.company_tax_id && (
                                                    <FormHelperText error id="helper-text-company_tax_id">
                                                        {errors.company_tax_id}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error id="helper-text-company_tax_id">
                                                    {errors?.errors?.company_tax_id}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <InputField
                                                    id="company_work_start_time"
                                                    label="Company work start time"
                                                    type="time"
                                                    touched={touched.company_work_start_time}
                                                    errors={errors.company_work_start_time}
                                                    values={values.company_work_start_time}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_work_start_time && errors.company_work_start_time && (
                                                    <FormHelperText error id="helper-text-company_work_start_time">
                                                        {errors.company_work_start_time}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error id="helper-text-company_work_start_time">
                                                    {errors?.errors?.company_work_start_time}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <InputField
                                                    id="company_work_end_time"
                                                    label="Company work end time"
                                                    type="time"
                                                    touched={touched.company_work_end_time}
                                                    errors={errors.company_work_end_time}
                                                    values={values.company_work_end_time}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_work_end_time && errors.company_work_end_time && (
                                                    <FormHelperText error id="helper-text-company_work_end_time">
                                                        {errors.company_work_end_time}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error id="helper-text-company_work_end_time">
                                                    {errors?.errors?.company_work_end_time}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <InputField
                                                    id="company_dashcam_ip"
                                                    label="Company dashcam ip"
                                                    placeholder="Enter dashcam ip i.e (192.168.0.0)"
                                                    type="text"
                                                    touched={touched.company_dashcam_ip}
                                                    errors={errors.company_dashcam_ip}
                                                    values={values.company_dashcam_ip}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_dashcam_ip && errors.company_dashcam_ip && (
                                                    <FormHelperText error id="helper-text-company_dashcam_ip">
                                                        {errors.company_dashcam_ip}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error id="helper-text-company_dashcam_ip">
                                                    {errors?.errors?.company_dashcam_ip}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <InputField
                                                    id="company_dashcam_username"
                                                    label="Company dashcam username"
                                                    type="text"
                                                    touched={touched.company_dashcam_username}
                                                    errors={errors.company_dashcam_username}
                                                    values={values.company_dashcam_username}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_dashcam_username && errors.company_dashcam_username && (
                                                    <FormHelperText error id="helper-text-company_dashcam_username">
                                                        {errors.company_dashcam_username}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error id="helper-text-company_dashcam_username">
                                                    {errors?.errors?.company_dashcam_username}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <PasswordField
                                                    id="company_dashcam_password"
                                                    label="Company dashcam password"
                                                    type="password"
                                                    touched={touched.company_dashcam_password}
                                                    errors={errors.company_dashcam_password}
                                                    values={values.company_dashcam_password}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_dashcam_password && errors.company_dashcam_password && (
                                                    <FormHelperText error id="company_dashcam_password">
                                                        {errors.company_dashcam_password}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error id="helper-text-company_dashcam_password">
                                                    {errors?.errors?.company_dashcam_password}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <InputField
                                                    id="company_owner_name"
                                                    label="Company owner name"
                                                    type="text"
                                                    touched={touched.company_owner_name}
                                                    errors={errors.company_owner_name}
                                                    values={values.company_owner_name}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_owner_name && errors.company_owner_name && (
                                                    <FormHelperText error id="helper-text-company_owner_name">
                                                        {errors.company_owner_name}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error id="helper-text-company_owner_name">
                                                    {errors?.errors?.company_owner_name}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <InputField
                                                    id="company_owner_email"
                                                    label="Company owner email"
                                                    type="email"
                                                    touched={touched.company_owner_email}
                                                    errors={errors.company_owner_email}
                                                    values={values.company_owner_email}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_owner_email && errors.company_owner_email && (
                                                    <FormHelperText error id="helper-text-company_owner_email">
                                                        {errors.company_owner_email}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error>
                                                    {errors?.errors?.company_owner_email}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <PhoneNumber
                                                    id="company_owner_phone"
                                                    value={values.company_owner_phone}
                                                    label="Company Owner Phone"
                                                    onChange={(phone) => setFieldValue('company_owner_phone', phone)}
                                                    onBlur={handleBlur}
                                                    touched={touched.company_owner_phone}
                                                    error={errors.company_owner_phone}
                                                />
                                                <FormHelperText error id="helper-text-company_owner_phone">
                                                    {errors?.errors?.company_owner_phone}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <InputField
                                                    id="company_admin_name"
                                                    label="Company admin name"
                                                    type="text"
                                                    touched={touched.company_admin_name}
                                                    errors={errors.company_admin_name}
                                                    values={values.company_admin_name}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_admin_name && errors.company_admin_name && (
                                                    <FormHelperText error id="helper-text-company_admin_name">
                                                        {errors.company_admin_name}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error id="helper-text-company_admin_name">
                                                    {errors?.errors?.company_admin_name}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <InputField
                                                    id="company_admin_email"
                                                    label="Company admin email"
                                                    type="email"
                                                    touched={touched.company_admin_email}
                                                    errors={errors.company_admin_email}
                                                    values={values.company_admin_email}
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                />
                                                {touched.company_admin_email && errors.company_admin_email && (
                                                    <FormHelperText error id="helper-text-company_admin_email">
                                                        {errors.company_admin_email}
                                                    </FormHelperText>
                                                )}
                                                <FormHelperText error>
                                                    {errors?.errors?.company_admin_email}
                                                </FormHelperText>
                                            </Grid>
                                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                                <PhoneNumber
                                                    id="company_admin_phone"
                                                    value={values.company_admin_phone}
                                                    label="Company Admin Phone"
                                                    onChange={(phone) => setFieldValue('company_admin_phone', phone)}
                                                    onBlur={handleBlur}
                                                    touched={touched.company_admin_phone}
                                                    error={errors.company_admin_phone}
                                                />
                                                <FormHelperText error id="helper-text-company_admin_phone">
                                                    {errors?.errors?.company_admin_phone}
                                                </FormHelperText>
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
                                                            'Update Provider General Info'
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
                </>
            }
        </>
    );
}
