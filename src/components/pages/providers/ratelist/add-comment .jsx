import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import { Stack, TextField, Button, Box, Divider } from '@mui/material';
import { useParams } from 'react-router';

export default function AddCommentForm({ handleAdd, rateList }) {
    const { provider_id } = useParams();

    return (
        <Formik
            initialValues={{
                provider_id,
                rate_list_id: rateList?.id,
                broker_notes: '',
            }}
            validationSchema={Yup.object().shape({
                broker_notes: Yup.string()
                    .max(255)
                    .required('Comment is required'),
            })}
            onSubmit={handleAdd}
        >
            {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values
            }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Grid item xs={12} sx={{ minWidth: '420px' }}>
                        <Stack spacing={2}>
                            {rateList.provider_notes &&
                                <Stack>
                                    <label htmlFor="">Provider Notes</label>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        value={rateList.provider_notes}
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                    />
                                </Stack>
                            }
                            <Stack>
                                <label htmlFor="">Broker Notes</label>
                                <TextField
                                    fullWidth
                                    error={Boolean(touched.broker_notes && errors.broker_notes)}
                                    id="broker_notes"
                                    name="broker_notes"
                                    type="text"
                                    value={values.broker_notes}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter your comments"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                />
                                {touched.broker_notes && errors.broker_notes && (
                                    <FormHelperText error>
                                        {errors.broker_notes}
                                    </FormHelperText>
                                )}

                            </Stack>
                            <Box>
                                <Divider />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                <Button type="submit" variant="contained" color="primary">
                                    Add Comment
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>
                </form>
            )}
        </Formik>
    );
}
