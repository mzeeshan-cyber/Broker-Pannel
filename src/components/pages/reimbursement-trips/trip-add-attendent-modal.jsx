
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Button, CircularProgress, OutlinedInput } from '@mui/material';
import PhoneNumber from 'components/@extended/PhoneNumber';
import { useTheme } from '@emotion/react';

export default function TripAddAttendentModal({ mappedPatients, setOpenModal, AddAttendent, patientId }) {
    const theme = useTheme()

    return (
        <Formik
            initialValues={{
                patient_id: patientId ? patientId : mappedPatients?.id,
                attendant_name: '',
                phone_number: '',
                relationship: '',
                notes: '',
            }}
            validationSchema={Yup.object().shape({
                attendant_name: Yup.string().max(255).required('Attendent name is required'),
                phone_number: Yup.string()
                    .required("Phone is required")
                    .matches(
                        /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
                        "Enter a valid US phone number"
                    ),
                relationship: Yup.string().max(255).required('Relationship is required'),
            })}
            onSubmit={AddAttendent}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3} gridColumn={12}>

                        <Grid item xs={12} md={6} lg={4} xl={3}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="attendant_name">Attendent name</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    error={Boolean(touched.attendant_name && errors.attendant_name)}
                                    id="attendant_name"
                                    type="text"
                                    value={values.attendant_name}
                                    name="attendant_name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter attendent name"
                                    inputProps={{}}
                                />
                            </Stack>
                            {touched.attendant_name && errors.attendant_name && (
                                <FormHelperText error id="helper-text-attendant_name">
                                    {errors.attendant_name}
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
                                error={errors.phone_number} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} xl={3}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="relationship">Relationship</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    error={Boolean(touched.relationship && errors.relationship)}
                                    id="relationship"
                                    type="text"
                                    value={values.relationship}
                                    name="relationship"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter your relationship"
                                    inputProps={{}}
                                />
                            </Stack>
                            {touched.relationship && errors.relationship && (
                                <FormHelperText error id="helper-text-relationship">
                                    {errors.relationship}
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
                                <Button disableElevation disabled={isSubmitting} variant="contained" type='submit' sx={{
                                    '&.Mui-disabled': {
                                        bgcolor: theme.palette.primary.main,
                                    }
                                }}>
                                    {isSubmitting ? <CircularProgress sx={{ height: '20px !important', width: '20px !important', color: 'white' }} /> : 'Add Attendent'}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik>
    );
}
