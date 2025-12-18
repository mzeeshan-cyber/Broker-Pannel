
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Button, CircularProgress, InputLabel, TextField } from '@mui/material';
import PhoneNumber from 'components/@extended/PhoneNumber';
import { paymentMethods } from 'constants/constants';
import SelectDropDown from 'components/common/SelectDropDown';
import InputField from 'components/common/InputField';
import { useTheme } from '@emotion/react';

export default function TripAddPayeeModal({ mappedPatients, AddPayee }) {
    const theme = useTheme()
    return (
        <Formik
            initialValues={{
                patient_id: mappedPatients?.id,
                account_holder_name: '',
                payment_method: '',
                payment_email: '',
                phone_number: '',
                bank_name: '',
                account_number: '',
                routing_number: '',
                tax_id: '',
                notes: '',
            }}
            validationSchema={Yup.object().shape({
                account_holder_name: Yup.string().max(255).required('Account holder name is required'),
                payment_method: Yup.string().max(255).required('Payment Method is required'),
                payment_email: Yup.string()
                    .email('Must be a valid email')
                    .max(255)
                    .when('payment_method', {
                        is: (val) => ['paypal', 'stripe', 'zelle', 'google_pay', 'apple_pay'].includes(val),
                        then: (schema) => schema.required('Payment Email is required'),
                        otherwise: (schema) => schema.notRequired()
                    }),

                phone_number: Yup.string()
                    .max(20)
                    .when('payment_method', {
                        is: (val) => ['cashapp', 'venmo', 'zelle'].includes(val),
                        then: (schema) => schema.required('Phone Number is required').matches(
                            /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
                            "Enter a valid US phone number"
                        ),
                        otherwise: (schema) => schema.notRequired()
                    }),

                bank_name: Yup.string()
                    .max(255)
                    .when('payment_method', {
                        is: (val) => ['check', 'bank_transfer'].includes(val),
                        then: (schema) => schema.required('Bank Name is required'),
                        otherwise: (schema) => schema.notRequired()
                    }),

                account_number: Yup.string()
                    .max(255)
                    .when('payment_method', {
                        is: (val) => ['check', 'bank_transfer'].includes(val),
                        then: (schema) => schema.required('Account Number is required'),
                        otherwise: (schema) => schema.notRequired()
                    }),
            })}

            onSubmit={AddPayee}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                const isBank = ['check', 'bank_transfer'].includes(values.payment_method);
                const isEmail = ['paypal', 'stripe', 'zelle', 'google_pay', 'apple_pay'].includes(values.payment_method);
                const isPhone = ['cashapp', 'venmo', 'zelle'].includes(values.payment_method);

                return (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3} gridColumn={12}>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <InputField
                                    id="account_holder_name"
                                    label="Account Holder Name"
                                    type="text"
                                    touched={touched.payment_method}
                                    errors={errors.payment_method}
                                    values={values.account_holder_name}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                />
                                {touched.account_holder_name && errors.account_holder_name && (
                                    <FormHelperText error id="helper-text-account_holder_name">
                                        {errors.account_holder_name}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <SelectDropDown
                                    label="Payment Method"
                                    id="payment_method"
                                    values={values.payment_method}
                                    options={paymentMethods}
                                    setFieldValue={setFieldValue}
                                    touched={touched}
                                    errors={errors}
                                />
                                {touched.payment_method && errors.payment_method && (
                                    <FormHelperText error id="helper-text-payment_method">
                                        {errors.payment_method}
                                    </FormHelperText>
                                )}
                            </Grid>

                            {isBank && (
                                <>
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <InputField
                                            id="bank_name"
                                            label="Bank Name"
                                            type="text"
                                            touched={touched.bank_name}
                                            errors={errors.bank_name}
                                            values={values.bank_name}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                        />
                                        {touched.bank_name && errors.bank_name && (
                                            <FormHelperText error id="helper-text-bank_name">
                                                {errors.bank_name}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={4} xl={3}>
                                        <InputField
                                            id="account_number"
                                            label="Account Number"
                                            touched={touched.account_number}
                                            errors={errors.account_number}
                                            values={values.account_number}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                        />
                                        {touched.account_number && errors.account_number && (
                                            <FormHelperText error id="helper-text-account_number">
                                                {errors.account_number}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </>
                            )}

                            {isEmail && (
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <InputField
                                        id="payment_email"
                                        label="Payment Email"
                                        type="email"
                                        touched={touched.payment_email}
                                        errors={errors.payment_email}
                                        values={values.payment_email}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                    {touched.payment_email && errors.payment_email && (
                                        <FormHelperText error id="helper-text-payment_email">
                                            {errors.payment_email}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            )}

                            {isPhone && (
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
                            )}
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <InputField
                                    id="tax_id"
                                    label="Tax Id"
                                    touched={touched.tax_id}
                                    errors={errors.tax_id}
                                    values={values.tax_id}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} xl={3}>
                                <InputField
                                    id="routing_number"
                                    label="Routing Number"
                                    touched={touched.routing_number}
                                    errors={errors.routing_number}
                                    values={values.routing_number}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                />
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
                                            'Add Payee'
                                        )}
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
