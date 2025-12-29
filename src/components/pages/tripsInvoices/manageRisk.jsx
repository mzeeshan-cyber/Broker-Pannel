import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import MainCard from 'components/MainCard';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Button, CircularProgress } from '@mui/material';
import { openSnackbar } from 'api/snackbar';
import InputField from 'components/common/InputField';
import { decryptToken } from 'utils/tokenUtils';
import { useTheme } from '@emotion/react';

export default function ManageRisk({setOpen, riskData}) {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const theme = useTheme()

    const AddRiskFactor = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await fetch(`${API_URL}save-trip-margin-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: JSON.stringify(values),
            });
            const res = await response.json();
            if (!response.ok) {
                setErrors(res);
                openSnackbar({
                    open: true,
                    message: res.message || 'Risk is not added!',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(res || 'failed!');
            }
            openSnackbar({
                open: true,
                message: res.message  || 'Risk added Successfuly!',
                variant: 'alert',
                alert: {
                    color: 'success'
                }
            });
            setOpen(false)

        } catch (error) {
            openSnackbar({
                open: true,
                message: `${error?.message} || Server error`,
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
                amount: riskData?.[0]?.amount,
                miles: riskData?.[0]?.miles,
            }}
            validationSchema={Yup.object().shape({
                amount: Yup.string().max(255).required('Amount is required'),
                miles: Yup.string().max(255).required('Miles are required'),
            })}
            enableReinitialize
            onSubmit={AddRiskFactor}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => {

                return (
                    <form noValidate onSubmit={handleSubmit}>
                        <MainCard>
                            <Grid container spacing={3} gridColumn={12}>
                                <Grid item xs={12}>
                                    <InputField
                                        id="amount"
                                        label="Amount"
                                        type="number"
                                        touched={touched.amount}
                                        errors={errors.amount}
                                        values={values.amount}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                    {touched.amount && errors.amount && (
                                        <FormHelperText error id="helper-text-amount">
                                            {errors.amount}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <InputField
                                        id="miles"
                                        label="Miles"
                                        type="number"
                                        touched={touched.miles}
                                        errors={errors.miles}
                                        values={values.miles}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                    {touched.miles && errors.miles && (
                                        <FormHelperText error id="helper-text-miles">
                                            {errors.miles}
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
                                                riskData?.length > 0 ?'Update Risk Factor' :'Add Risk Factor'
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
    );
}