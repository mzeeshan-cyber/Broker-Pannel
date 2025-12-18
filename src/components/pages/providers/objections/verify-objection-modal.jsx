import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Box, Button, Divider, FormHelperText, InputLabel } from '@mui/material';
import { useParams } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import { fetcherPost } from 'utils/axios';

const validationSchema = Yup.object({
  objection_reason: Yup.string().required('Objection reason is required!'),
});

const VerifyObjectionModal = ({ objectionById, UpdateObjecion, getDetails }) => {
  const { provider_id, detail_id } = useParams()
  const initialValues = {
    provider_id: provider_id,
    provider_vehicle_id: detail_id,
    id: objectionById?.[0]?.id,
    objection_reason: objectionById?.[0]?.objection_reason || '',
  };

  const verifyObjection = async () => {
      const response = await fetcherPost([`/resolve-provider-vehicle-objection`, {provider_id: provider_id, provider_vehicle_id: detail_id}])
      if (response.status === true) {
        openSnackbar({
          open: true,
          message: response.message || 'Objection verified successfuly!',
          variant: 'alert',
  
          alert: {
            color: 'success'
          }
        });
        getDetails()
      }
    }

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
            <Grid sx={{ minWidth: '420px' }}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="notes">Objection reason</InputLabel>
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
                <Box sx={{ display: 'flex', justifyContent: 'end', gap: '10px', margin: '15px 0' }}>
                  <Button type='button' variant='contained' onClick={()=>UpdateObjecion(values, 're-object')}>Re Objection</Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="notes">Provider remarks</InputLabel>
                  <Typography>{objectionById?.[0]?.resolve_remarks}</Typography>
                </Stack>
              </Grid>
              <Box sx={{ margin: '20px 0' }}>
                <Divider />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
                <Button type='button' variant='contained' onClick={verifyObjection}>Verify objection</Button>
              </Box>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
};

export default VerifyObjectionModal;



