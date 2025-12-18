import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import defaultImages from 'assets/images/users/default.png';
import { Car, Clock, Gps, Sms } from 'iconsax-react';
import { Link } from 'react-router-dom';
import Loader from 'components/Loader';
import DriverDocuments from './driver-documents';
import { FormLabel } from '@mui/material';
import { getStatusColor } from 'constants/constants';
import { capitalize } from 'lodash';

export default function Drivers({ data, loading }) {
    const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

    function timeAgo(dateString) {
        // Automatically detect user's timezone
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Convert current time to user's detected timezone
        const nowString = new Date().toLocaleString("en-US", { timeZone: userTimeZone });
        const now = new Date(nowString);

        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        const units = [
            { label: "year", seconds: 365 * 24 * 60 * 60 },
            { label: "month", seconds: 30 * 24 * 60 * 60 },
            { label: "week", seconds: 7 * 24 * 60 * 60 },
            { label: "day", seconds: 24 * 60 * 60 },
            { label: "hour", seconds: 60 * 60 },
            { label: "minute", seconds: 60 },
            { label: "second", seconds: 1 }
        ];

        for (const unit of units) {
            const interval = Math.floor(diffInSeconds / unit.seconds);
            if (interval >= 1) {
                return `${interval} ${unit.label}${interval !== 1 ? "s" : ""} ago`;
            }
        }

        return "just now";
    }

    return (
        <>
            {
                loading ? <Loader /> :
                    <Grid container spacing={3}>
                        {data?.driver ?
                            <>
                                <Grid item xs={12} sm={5} md={4} xl={3}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <MainCard>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <Stack direction="row" justifyContent="flex-end">
                                                            <Chip label={data?.driver?.status} size="small" color={getStatusColor(data?.driver?.status)} />
                                                        </Stack>
                                                        <Stack spacing={2.5} alignItems="center">
                                                            <Avatar alt="Avatar 1" size="xl" src={data?.driver?.image || defaultImages} />
                                                            <Stack spacing={0.5} alignItems="center">
                                                                <Typography variant="h5">{capitalize(data?.driver?.name)}</Typography>
                                                                <Typography color="secondary" sx={{ textAlign: 'center' }}>{data?.driver?.address}</Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Stack direction="row" justifyContent="space-around" alignItems="center">
                                                            <Stack spacing={0.5} alignItems="center">
                                                                <Typography variant="h5">{data?.driver?.provider_driver_additional_details?.work_start_time}</Typography>
                                                                <Typography color="secondary">Start time</Typography>
                                                            </Stack>
                                                            <Divider orientation="vertical" flexItem />
                                                            <Stack spacing={0.5} alignItems="center">
                                                                <Typography variant="h5">{data?.driver?.provider_driver_additional_details?.work_end_time}</Typography>
                                                                <Typography color="secondary">End time</Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Divider />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <Sms size={18} />
                                                                </ListItemIcon>
                                                                <ListItemSecondaryAction>
                                                                    <Typography align="right">{data?.driver?.email}</Typography>
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <Clock size={18} />
                                                                </ListItemIcon>
                                                                <ListItemSecondaryAction>
                                                                    <Typography align="right">
                                                                        {timeAgo(data?.driver?.provider_driver_additional_details?.last_seen || 'No last activity')}
                                                                    </Typography>
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <Gps size={18} />
                                                                </ListItemIcon>
                                                                <ListItemSecondaryAction>
                                                                    <Typography align="right">{(data?.driver?.provider_driver_additional_details?.current_latitude || data?.driver?.provider_driver_additional_details?.current_longitude) ? <Link target="_blank" to={`https://www.google.com/maps?q=${data?.driver?.provider_driver_additional_details?.current_latitude},${data?.driver?.provider_driver_additional_details?.current_longitude}`}>View last location</Link> : 'Location not available'}</Typography>
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <Car size={18} />
                                                                </ListItemIcon>
                                                                <ListItemSecondaryAction>
                                                                    {data?.driver?.provider_driver_additional_details?.vehicle_assigned === 0 ? "No vehicle assigned" : "Vehicle assigned"}
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                        </List>
                                                    </Grid>
                                                </Grid>
                                            </MainCard>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={7} md={8} xl={9}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <MainCard title="Driver's additional details">
                                                <List sx={{ py: 0 }}>
                                                    <ListItem divider={!matchDownMD}>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Nick name</Typography>
                                                                    <Typography>{data?.driver?.provider_driver_additional_details?.nick_name}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Phone number</Typography>
                                                                    <Typography>{data?.driver?.provider_driver_additional_details?.phone}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                    <ListItem divider={!matchDownMD}>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Gender</Typography>
                                                                    <Typography>{data?.driver?.provider_driver_additional_details?.gender}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Date of birth</Typography>
                                                                    <Typography>{data?.driver?.provider_driver_additional_details?.dob}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                    <ListItem divider={!matchDownMD}>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Emergency contact name</Typography>
                                                                    <Typography>{data?.driver?.provider_driver_additional_details?.emergency_contact_name}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Emergency contact relationship</Typography>
                                                                    <Typography>{data?.driver?.provider_driver_additional_details?.emergency_contact_relationship}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                    <ListItem divider={!matchDownMD}>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Emergency contact number</Typography>
                                                                    <Typography>{data?.driver?.provider_driver_additional_details?.emergency_contact_number}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Country</Typography>
                                                                    <Typography>{data?.driver?.country}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                    <ListItem divider={!matchDownMD}>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Gas card number</Typography>
                                                                    <Typography>{data?.driver?.provider_driver_additional_details?.gas_card_number || 'Not available'}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Parking permit number</Typography>
                                                                    <Typography>{data?.driver?.provider_driver_additional_details?.parking_permit_number || 'Not available'}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                    <ListItem divider={!matchDownMD}>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Parking permit issue</Typography>
                                                                    <Typography>{data?.driver?.provider_driver_additional_details?.parking_permit_issue_date || 'Not available'}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Stack spacing={0.5}>
                                                                    <Typography color="secondary">Parking permit expiry</Typography>
                                                                    <Typography>{data?.driver?.provider_driver_additional_details?.parking_permit_expiry_date || 'Not available'}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                </List>
                                            </MainCard>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                            :
                            <Grid item xs={12} sx={{textAlign:'center'}}>
                                This driver has no details
                            </Grid>}
                        <Grid item xs={12}>
                            <FormLabel sx={{ display: 'block', marginBottom: '15px', fontSize: '0.875rem', fontWeight: '600', color: 'secondary' }}>Documents</FormLabel>
                            <DriverDocuments data={data?.driver?.provider_driver_documents || []} loading={loading} />
                        </Grid>
                        <Grid item xs={12}>
                            <MainCard title="Notes">
                                <Typography color="secondary">
                                    {data?.driver?.provider_driver_additional_details?.notes || "Not available"}
                                </Typography>
                            </MainCard>
                        </Grid>
                    </Grid>
            }
        </>
    );
}
