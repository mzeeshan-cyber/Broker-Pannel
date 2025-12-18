// material-ui
import Grid from '@mui/material/Grid';
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
import { useEffect, useState } from 'react';
import { openSnackbar } from 'api/snackbar';
import { useNavigate, useParams } from 'react-router';
import PhoneNumber from 'components/@extended/PhoneNumber';
import { fetcher, fetcherPost } from 'utils/axios';
import { loading } from 'store/reducers/patientSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'components/Loader';
import { useTheme } from '@emotion/react';
import CircularLoader from 'components/common/loader/CircularLoader';

// ==============================|| LAYOUTS -  COLUMNS ||============================== //

export default function UpdatePatientAttendent() {
    const navigate = useNavigate()
    const theme = useTheme()
    const [attendentData, setAttendentData] = useState({});
    const { attendent_id } = useParams()
    const dispatch = useDispatch()
    const Loading = useSelector(state => state.patient.loading)

    const FetchSingleAttendent = async () => {
        dispatch(loading(true));
        const response = await fetcher(`/patient-attendants/${attendent_id}`);
        if (response.status === true) {
            setAttendentData(response?.data);
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
        FetchSingleAttendent();
    }, [])

    const UpdatePatientAttendent = async (values, { setSubmitting, setErrors }) => {
        const response = await fetcherPost([`/patient-attendants/${attendentData?.id}`, values])
        if (response.status === true) {
            openSnackbar({
                open: true,
                message: response.message || 'Attendent updated successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
            navigate(`/patients/${attendentData?.patient_id}/attendent`)
        }
    };

    return (
        <>
            {Loading ? <CircularLoader/> :
                <Formik
                    initialValues={{
                        patient_id: attendentData?.patient_id,
                        attendant_name: attendentData?.attendant_name,
                        phone_number: attendentData?.phone_number,
                        relationship: attendentData?.relationship,
                        notes: attendentData?.notes,
                    }}
                    validationSchema={Yup.object().shape({
                        attendant_name: Yup.string().max(255).required('Attendent name is required'),
                        phone_number: Yup.string().max(255).required('Phone number is required'),
                        relationship: Yup.string().max(255).required('Relationship is required'),
                    })}
                    enableReinitialize={true}
                    onSubmit={UpdatePatientAttendent}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <MainCard title="Update Attendent">
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

                                        {errors.phone_numberError && (
                                            <FormHelperText error id="helper-text-phone_number">
                                                {errors.phone_numberError}
                                            </FormHelperText>
                                        )}
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
                                                {isSubmitting ? <CircularProgress sx={{ height: '20px !important', width: '20px !important', color:'white' }} /> : 'Update Attendent'}
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </form>
                    )}
                </Formik>
            }
        </>
    );
}
