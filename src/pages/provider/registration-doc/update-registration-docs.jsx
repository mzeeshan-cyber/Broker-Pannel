// material-ui
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';

// project-imports
import MainCard from 'components/MainCard';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Button, CircularProgress } from '@mui/material';
import { openSnackbar } from 'api/snackbar';
import { useNavigate, useParams } from 'react-router';
import { fetcher } from 'utils/axios';
import InputField from 'components/common/InputField';
import { registrationDocumentsStatusForm } from 'constants/constants';
import SelectDropDown from 'components/common/SelectDropDown';
import { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import { decryptToken } from 'utils/tokenUtils';
import { useTheme } from '@emotion/react';

export default function UpdateRegistrationDocument() {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const navigate = useNavigate();
    const { provider_id, document_id } = useParams();
    const [documentData, setDocumentData] = useState({})
    const [loading, setLoading] = useState(false)
    const theme = useTheme()
    const params = {
        id: document_id,
        provider_id: provider_id,
    }
    const FetchSingleProviderDocument = async () => {
        setLoading(true);
        const response = await fetcher(["/get-provider-register-document-by-id", { params }]);
        if (response.status === true) {
            setDocumentData(response.data)
            openSnackbar({
                open: true,
                message: response.message || 'data is fetched',
                variant: 'alert',
                alert: { color: 'success' }
            });
            setLoading(false);
        }
        else {
            openSnackbar({
                open: true,
                message: response.message || 'data is not fetched',
                variant: 'alert',
                alert: { color: 'error' }
            });
            setLoading(false);

        }
    }

    const UpdateProviderDocument = async (values, { setSubmitting, setErrors }) => {
        try {
            const formData = new FormData();
            formData.append('id', values.id);
            formData.append('provider_id', values.provider_id);
            formData.append('document_name', values.document_name);
            formData.append('file_path', values?.file_path || '');
            formData.append('issue_date', values.issue_date);
            formData.append('expiry_date', values.expiry_date);
            formData.append('status', values.status);
            const response = await fetch(`${API_URL}update-provider-register-document/${document_id}`, {
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
                    message: errorData.message || 'Provider document is not updated!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            openSnackbar({
                open: true,
                message: 'Provider document updated Successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
            setTimeout(() => {
                navigate(`/providers/${provider_id}/registration-documents`)
            }, 1500);

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

    useEffect(() => {
        FetchSingleProviderDocument()
    }, [])

    return (
        <Formik
            initialValues={{
                id: document_id,
                provider_id: provider_id,
                document_name: documentData?.document_name,
                file_path: '',
                issue_date: documentData?.issue_date,
                expiry_date: documentData?.expiry_date,
                status: documentData?.status,
            }}
            validationSchema={Yup.object().shape({
                id: Yup.number().required(),
                provider_id: Yup.number().required(),
                document_name: Yup.string()
                    .max(255)
                    .required('Document name is required'),

                issue_date: Yup.date()
                    .max(new Date(), 'Issue date cannot be in the future'),

                expiry_date: Yup.date()
                    .min(Yup.ref('issue_date'), 'Expiry date must be after or equal to issue date'),

                status: Yup.string()
                    .required('Status is required')
            })}
            enableReinitialize
            onSubmit={UpdateProviderDocument}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {

                return (
                    <form noValidate onSubmit={handleSubmit}>
                        {loading
                            ?
                            <Loader />
                            :
                            <MainCard title="Update Registration Document">
                                <Grid container spacing={3} gridColumn={12}>
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <InputField
                                            id="document_name"
                                            label="Document Name"
                                            type="text"
                                            touched={touched.document_name}
                                            errors={errors.document_name}
                                            values={values.document_name}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                        />
                                        {touched.document_name && errors.document_name && (
                                            <FormHelperText error id="helper-text-document_name">
                                                {errors.document_name}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <InputField
                                            id="file_path"
                                            label="Document File"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            handleBlur={handleBlur}
                                            touched={touched.file_path}
                                            errors={errors.file_path}
                                            handleChange={(e) => {
                                                setFieldValue('file_path', e.currentTarget.files[0])
                                            }}
                                        />
                                        {touched.file_path && errors.file_path && (
                                            <FormHelperText error id="helper-text-file_path">
                                                {errors.file_path}
                                            </FormHelperText>
                                        )}
                                        <FormHelperText error>{errors?.errors?.file_path}</FormHelperText>

                                        {/* Display existing file name if available */}
                                        {documentData?.file_path && typeof documentData.file_path === 'string' && (
                                            <FormHelperText sx={{ mt: 1 }}>
                                                Previous File: <strong>{documentData.file_path.split('/').pop()}</strong>
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <InputField
                                            id="issue_date"
                                            label="Issue Date"
                                            type="date"
                                            touched={touched.issue_date}
                                            errors={errors.issue_date}
                                            values={values.issue_date}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                        />
                                        {touched.issue_date && errors.issue_date && (
                                            <FormHelperText error id="helper-text-issue_date">
                                                {errors.issue_date}
                                            </FormHelperText>
                                        )}
                                        <FormHelperText error>
                                            {errors?.errors?.issue_date}
                                        </FormHelperText>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <InputField
                                            id="expiry_date"
                                            label="Expiry Date"
                                            type="date"
                                            touched={touched.expiry_date}
                                            errors={errors.expiry_date}
                                            values={values.expiry_date}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                        />
                                        {touched.expiry_date && errors.expiry_date && (
                                            <FormHelperText error id="helper-text-expiry_date">
                                                {errors.expiry_date}
                                            </FormHelperText>
                                        )}
                                        <FormHelperText error>
                                            {errors?.errors?.expiry_date}
                                        </FormHelperText>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <SelectDropDown
                                            options={registrationDocumentsStatusForm}
                                            id="status"
                                            label="Document Status"
                                            touched={touched}
                                            setFieldValue={setFieldValue}
                                            errors={errors}
                                            values={values.status}
                                        />
                                        {touched.status && errors.status && (
                                            <FormHelperText error id="helper-text-status">
                                                {errors.status}
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
                                                    'Update Registration Document'
                                                )}
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        }
                    </form>
                );
            }}
        </Formik>
    );
}
