import { Button, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import MainCard from 'components/MainCard';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DropzonePage from 'pages/reimbursement-trips/select-files';
import React from 'react';
import { openSnackbar } from 'api/snackbar';
import axios from 'axios';
import { decryptToken } from 'utils/tokenUtils';
import { useNavigate } from 'react-router';

const UploadVerificationForm = ({ tripId }) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const navigate = useNavigate();

    const uploadVerificationForm = async (values) => {
        const formData = new FormData();
        formData.append(`id`, tripId);
        formData.append(`reimbursement_form`, values.reimbursement_form[0]);
        try {
            const response = await axios.post(`${API_URL}submit-reimbursement-trip-form`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
            });
            if (response.status === 200) {
                openSnackbar({
                    open: true,
                    message: 'Reimbursement Trip verification form uploaded successfully!',
                    variant: 'alert',
                    alert: { color: 'success' }
                });
                navigate('/reimbursement-trips');
            }

        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || 'Reimbursement Trip verification form not uploaded!',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
    };
    return (
        <>
            <Box>
                <Typography variant="h4" fontWeight="bold">
                    APPOINTMENT VERIFICATION
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                    A verification form is provided below — you can download it using the button below.
                </Typography>
            </Box>
            <Formik
                initialValues={{
                    id: tripId,
                    reimbursement_form: [],
                }}
                validationSchema={Yup.object().shape({
                    reimbursement_form: Yup.array()
                        .min(1, "Please upload a verification form.")
                        .test(
                            'max-one',
                            'Only one file can be picked.',
                            (files) => !files || files.length <= 1
                        ),
                })}
                onSubmit={uploadVerificationForm}
            >
                {({ errors, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                    const handleSingleFileChange = (id, fileArray) => {
                        if (Array.isArray(fileArray) && fileArray.length > 0) {
                            // Always keep only the latest file
                            setFieldValue(id, [fileArray[fileArray.length - 1]]);
                        } else {
                            setFieldValue(id, []);
                        }
                    };

                    return (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <MainCard sx={{ marginTop: '20px' }}>
                                        <DropzonePage
                                            id="reimbursement_form"
                                            label="Verification Form"
                                            values={values.reimbursement_form}
                                            setFieldValue={(id, fileArray) =>
                                                handleSingleFileChange(id, fileArray)
                                            }
                                            touched={touched.reimbursement_form}
                                            errors={errors.reimbursement_form}
                                        />
                                    </MainCard>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} justifyContent="right" sx={{ mt: 4 }}>
                                        <Button
                                            disableElevation
                                            disabled={isSubmitting}
                                            variant="contained"
                                            type="submit"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Upload Verification Form'}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    );
                }}
            </Formik>
        </>
    );
};

export default UploadVerificationForm;
