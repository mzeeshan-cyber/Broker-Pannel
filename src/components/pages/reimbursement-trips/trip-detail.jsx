import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import MainCard from 'components/MainCard';
import { Button, Chip } from '@mui/material';
import error404 from 'assets/images/maintenance/img-error-404.svg';
import { capitalize } from 'lodash';
import { getStatusColor } from 'constants/constants';

export default function TripDetail({ filteredPatient, setShowForm, buttonText, description = 'To add a trip first select a patient from above drop down.' }) {
    const SelectedPatient = filteredPatient[0];
    const IMAGE_URL = import.meta.env.VITE_SERVER_IMAGE_PATH;

    return (
        <MainCard content={false} sx={{ marginTop: "20px" }}>
            {SelectedPatient ?
                <Stack spacing={2.5}>
                    <Box sx={{ p: 2.5 }}>
                        <Grid container spacing={2.5}>
                            <Grid item xs={12}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                                    <Stack spacing={0.5}>
                                        <Stack direction="row" spacing={2} alignItems={'center'}>
                                            <Box sx={{ border: '1px solid lightgray', height: '50px', width: '50px', borderRadius: '100%' }}>
                                                {SelectedPatient?.image ? (
                                                    <img
                                                        src={`${IMAGE_URL}${SelectedPatient.image}`}
                                                        alt={SelectedPatient?.name}
                                                        style={{
                                                            height: '100%',
                                                            width: '100%',
                                                            objectFit: 'contain',
                                                            borderRadius: '100%'
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            height: '100%',
                                                            width: '100%',
                                                            borderRadius: '100%',
                                                            backgroundColor: '#ccc',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize: '20px',
                                                            color: '#fff'
                                                        }}
                                                    >
                                                        {SelectedPatient?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </Box>
                                            <Box>
                                                <Typography color="info" variant='h5'>{SelectedPatient?.name}</Typography>
                                                <Typography color="secondary">{SelectedPatient?.email}</Typography>
                                            </Box>
                                            <Chip
                                                label={capitalize(SelectedPatient?.status)}
                                                size="small"
                                                color={getStatusColor(SelectedPatient?.status)}
                                            />
                                        </Stack>
                                    </Stack>
                                    <Box>
                                        {SelectedPatient?.status === 'active' &&
                                            <Box sx={{ display: 'flex', justifyContent: 'end', gap: '10px', marginBottom: '10px' }}>
                                                <Button variant='outlined' color='secondary' onClick={() => { setShowForm(true) }}>{buttonText ?? 'Add reimbursement trip'}</Button>
                                            </Box>
                                        }
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Typography>Pending:</Typography>
                                            <Typography color="info" variant="subtitle1">{SelectedPatient?.pending_trips_count}</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Typography>Completed:</Typography>
                                            <Typography color="primary" variant="subtitle1">{SelectedPatient?.completed_trips_count}</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Typography>Cancel:</Typography>
                                            <Typography color="error" variant="subtitle1">{SelectedPatient?.cancelled_trips_count}</Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MainCard>
                                    <Stack spacing={1}>
                                        <FormControl sx={{ width: '100%' }}>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Social Security No:</Typography>
                                                <Typography color="secondary">{SelectedPatient?.patient_detail.social_security_number}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Identifier No:</Typography>
                                                <Typography color="secondary">{SelectedPatient?.patient_detail.identifier_number}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Routing No:</Typography>
                                                <Typography color="secondary">{SelectedPatient?.patient_detail.routing_number}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Account No:</Typography>
                                                <Typography color="secondary">{SelectedPatient?.patient_detail.account_number}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Medicate No:</Typography>
                                                <Typography color="secondary">{SelectedPatient?.patient_detail.medicaid_number}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Funding Source:</Typography>
                                                <Typography color="secondary">{SelectedPatient?.patient_detail.funding_source}</Typography>
                                            </Box>
                                        </FormControl>
                                    </Stack>
                                </MainCard>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MainCard>
                                    <Stack spacing={1}>
                                        <FormControl sx={{ width: '100%' }}>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Mobility:</Typography>
                                                <Typography color="secondary">{SelectedPatient?.patient_detail.mobility}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Date of Birth:</Typography>
                                                <Typography color="secondary">{SelectedPatient?.patient_detail.date_of_birth}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Phone No:</Typography>
                                                <Typography color="secondary">{SelectedPatient?.patient_detail.phone_number}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Gender:</Typography>
                                                <Typography color="secondary">{SelectedPatient?.patient_detail.gender}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Status</Typography>
                                                <Typography color="secondary">{SelectedPatient?.status}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                                <Typography color="info" variant='subtitle1'>Address</Typography>
                                                <Typography color="secondary">{SelectedPatient?.address}</Typography>
                                            </Box>
                                        </FormControl>
                                    </Stack>
                                </MainCard>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1}>
                                    <Typography color="secondary">Notes: </Typography>
                                    <Typography>
                                        {SelectedPatient?.patient_detail.notes}
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Stack>
                :
                <Grid
                    container
                    spacing={10}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ minHeight: '60vh', pt: 2, pb: 1, overflow: 'hidden' }}
                >
                    <Grid item xs={12}>
                        <Stack direction="row">
                            <Grid item>
                                <Box sx={{ width: { xs: 250, sm: 590 }, height: { xs: 130, sm: 300 } }}>
                                    <img src={error404} alt="error 404" style={{ width: '100%', height: '100%' }} />
                                </Box>
                            </Grid>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={2} justifyContent="center" alignItems="center">
                            <Typography variant="h1">Select Patient</Typography>
                            <Typography color="text.secondary" align="center" sx={{ width: { xs: '73%', sm: '61%' } }}>
                                {description}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            }
        </MainCard>
    );
}

