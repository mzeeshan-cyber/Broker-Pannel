import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';

export default function AdditionalInfoTab({ data, loading }) {
    const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <>
            {
                loading ? <Loader /> :
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <MainCard title="General Information" sx={{ minHeight: '100%' }}>
                                        <List sx={{ py: 0 }}>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Company assign no</Typography>
                                                            <Typography>
                                                                {data?.company_assign_no}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Car Name</Typography>
                                                            <Typography>
                                                                {data?.car_name}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Manufacturer</Typography>
                                                            <Typography>
                                                                {data?.manufacturer}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Vin number</Typography>
                                                            <Typography>
                                                                {data?.vin_number}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Mobility</Typography>
                                                            <Typography>
                                                                {data?.mobility}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Model year</Typography>
                                                            <Typography>
                                                                {data?.model_year}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Asset miles</Typography>
                                                            <Typography>
                                                                {data?.asset_miles}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Plate no</Typography>
                                                            <Typography>
                                                                {data?.plate_no}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Color</Typography>
                                                            <Typography>
                                                                {data?.color}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Capacity</Typography>
                                                            <Typography>
                                                                {data?.capacity}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Vehicle parking address</Typography>
                                                            <Typography>
                                                                {data?.vehicle_parking_address}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Vehicle base address</Typography>
                                                            <Typography>
                                                                {data?.vehicle_base_address}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        </List>
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MainCard title="Gas card and Dashcam" sx={{ minHeight: '100%' }}>
                                        <List sx={{ py: 0 }}>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Gas card number</Typography>
                                                            <Typography>
                                                                {data?.gas_card_number}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Dashcam device no</Typography>
                                                            <Typography>
                                                                {data?.dashcam_device_no}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        </List>
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MainCard title="Inspection" sx={{ minHeight: '100%' }}>
                                        <List sx={{ py: 0 }}>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Last inspection type</Typography>
                                                            <Typography>
                                                                {data?.last_inspection_type}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Last inspection date</Typography>
                                                            <Typography>
                                                                {data?.last_inspection_date}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        </List>
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MainCard title="Vehicle Registration" sx={{ minHeight: '100%' }}>
                                        <List sx={{ py: 0 }}>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Vehicle registration document</Typography>
                                                            <Typography>
                                                                {data?.vehicle_registration_document || 'No'}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Vehicle issue date</Typography>
                                                            <Typography>
                                                                {data?.vehicle_issue_date}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Vehicle expiry date</Typography>
                                                            <Typography>
                                                                {data?.vehicle_expiry_date}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        </List>
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MainCard title="Insurance" sx={{ minHeight: '100%' }}>
                                        <List sx={{ py: 0 }}>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Vehicle insurance document</Typography>
                                                            <Typography>
                                                                {data?.vehicle_insurance_document || 'No'}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Vehicle insurance issue date</Typography>
                                                            <Typography>
                                                                {data?.vehicle_insurance_issue_date}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Vehicle insurance expiry date</Typography>
                                                            <Typography>
                                                                {data?.vehicle_insurance_expiry_date}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        </List>
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MainCard title="Maintenance" sx={{ minHeight: '100%' }}>
                                        <List sx={{ py: 0 }}>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Oil change date</Typography>
                                                            <Typography>
                                                                {data?.oil_change_date}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Last oil change reading</Typography>
                                                            <Typography>
                                                                {data?.last_oil_change_reading}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Last service mileage</Typography>
                                                            <Typography>
                                                                {data?.last_service_mileage}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Engine hours</Typography>
                                                            <Typography>
                                                                {data?.engine_hours}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Last service engine hours</Typography>
                                                            <Typography>
                                                                {data?.last_service_engine_hours}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Last service date</Typography>
                                                            <Typography>
                                                                {data?.last_service_date}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        </List>
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MainCard title="Device Information" sx={{ minHeight: '100%' }}>
                                        <List sx={{ py: 0 }}>
                                            <ListItem divider={!matchDownMD}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Company assign device number</Typography>
                                                            <Typography>
                                                                {data?.company_assign_device_number}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Device company</Typography>
                                                            <Typography>
                                                                {data?.device_company}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Imei no</Typography>
                                                            <Typography>
                                                                {data?.imei_details?.imei_no}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">E sim</Typography>
                                                            <Typography>
                                                                {data?.imei_details?.e_sim}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={0.5}>
                                                            <Typography color="secondary">Sim number</Typography>
                                                            <Typography>
                                                                {data?.imei_details?.sim_number}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        </List>
                                    </MainCard>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <MainCard title="Notes">
                                <Typography color="secondary">
                                    {data?.notes || "Not available"}
                                </Typography>
                            </MainCard>
                        </Grid>
                    </Grid>
            }
        </>
    );
}
