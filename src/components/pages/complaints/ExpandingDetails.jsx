import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { Chip, Divider, ListItemIcon, ListItemText } from '@mui/material';
import { capitalize } from 'lodash';
import { getStatusColor } from 'constants/constants';
import { FiMapPin, FiClock } from "react-icons/fi";
import { MdPeople, MdWheelchairPickup } from "react-icons/md";

export default function ComplaintsExpandingDetails({ data }) {

    const tripData = data?.trip;
    const items = [
        { icon: <MdPeople />, label: "Patient", value: tripData?.patient.name },
        { icon: <FiMapPin />, label: "Pickup Address", value: tripData?.pickup_address },
        { icon: <FiMapPin />, label: "Dropoff Address", value: tripData?.dropoff_address },
        { icon: <MdWheelchairPickup />, label: "Mobility", value: tripData?.mobility },
        { icon: <FiClock />, label: "Pickup Time", value: tripData?.pickup_time },
        { icon: <FiClock />, label: "Service Date", value: tripData?.service_date },
    ];

    return (
        <Grid container spacing={2.5} >
            {data ?
                <>
                    <Grid item xs={12}>
                        <MainCard title="Trip Detail">
                            <Chip
                                label={capitalize(tripData?.trip_status)}
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    right: -1,
                                    top: -1,
                                    borderRadius: '0 4px 0 4px'
                                }}
                                color={getStatusColor(tripData?.trip_status)}
                            />
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack direction="row" justifyContent="space-around" alignItems="center">
                                        <Stack spacing={0.5} alignItems="center">
                                            <Typography variant="h5">{tripData?.pickup_time}</Typography>
                                            <Typography color="secondary">Pickup (Time)</Typography>
                                        </Stack>
                                        <Divider orientation="vertical" flexItem />
                                        <Stack spacing={0.5} alignItems="center">
                                            <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>{tripData?.appointment_time}</Typography>
                                            <Typography color="secondary">Appointment (Time)</Typography>
                                        </Stack>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        {items.map((item, index) => (
                                            <Grid item xs={12} sm={6} lg={4} key={index}>
                                                <ListItem
                                                    sx={{
                                                        p: 1.5,
                                                        border: "1px solid #eee",
                                                        borderRadius: 2,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 30, color: "primary.main" }}>
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body2" color="textSecondary">
                                                                {item.label}
                                                            </Typography>
                                                        }
                                                        secondary={<Typography variant="body1">{item.value}</Typography>}
                                                    />
                                                </ListItem>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                        <MainCard title="Complaint Notes">
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={0.5}>
                                        <Typography>
                                            {data?.description || 'Nothing'}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                </>
                :
                <Grid item xs={12}>-</Grid>
            }
        </Grid >
    );
}
