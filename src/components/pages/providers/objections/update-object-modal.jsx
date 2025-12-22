import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Box, Button, Divider, FormHelperText } from '@mui/material';
import { useParams } from 'react-router';

const validationSchema = Yup.object({
    objection_reason: Yup.string().required('Objection reason is required!'),
});

const UpdateObjectionModal = ({ objectionById, UpdateObjecion, type }) => {
    const { provider_id, detail_id } = useParams()
    const initialValues = {
        provider_id: provider_id,
        ...(type === 'driverModule'
            ? { driver_id: detail_id }
            : { provider_vehicle_id: detail_id }),
        id: objectionById?.[0]?.id,
        objection_reason: objectionById?.[0]?.objection_reason || '',
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={UpdateObjecion}
            enableReinitialize
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
                                <Button type='submit' variant='contained'>Update Objection</Button>
                            </Box>
                        </Grid>
                    </form>
                );
            }}
        </Formik>
    );
};

export default UpdateObjectionModal;



