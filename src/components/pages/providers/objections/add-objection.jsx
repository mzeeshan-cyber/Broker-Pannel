import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import { Box, Button, Divider, Stack, TextField } from '@mui/material';
import { useParams } from 'react-router';

export default function AddObjection({ CreateObjecion }) {
    const { provider_id, detail_id } = useParams()

    return (
        <Formik
            initialValues={{
                provider_id: provider_id,
                provider_vehicle_id: detail_id,
                objection_reason: '',
            }}
            validationSchema={Yup.object().shape({
                objection_reason: Yup.string()
                    .max(255)
                    .required('Objection reason is required'),
            })}
            onSubmit={CreateObjecion}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {

                return (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid item xs={12} sx={{ minWidth: '420px' }}>
                            <Stack spacing={1}>
                                <TextField
                                    fullWidth
                                    error={Boolean(touched.objection_reason && errors.objection_reason)}
                                    id="objection_reason"
                                    type="text"
                                    value={values.objection_reason}
                                    name="objection_reason"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter objection reason"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    inputProps={{}}
                                />

                            </Stack>
                            {touched.objection_reason && errors.objection_reason && (
                                <FormHelperText error id="helper-text-objection_reason">
                                    {errors.objection_reason}
                                </FormHelperText>
                            )}
                            <Box sx={{ margin: '20px 0' }}>
                                <Divider />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
                                <Button type='submit' variant='contained' onClick={()=>CreateObjecion(values, `new-objection`)}>Create Objection</Button>
                            </Box>
                        </Grid>
                    </form>
                );
            }}
        </Formik>
    );
}