import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { Box, Chip, Divider, ListItemIcon, ListItemText } from '@mui/material';
import { capitalize } from 'lodash';
import { getStatusColor } from 'constants/constants';
import { FiRepeat, FiPhone } from "react-icons/fi";
import { MdEventSeat, MdAccessibilityNew } from "react-icons/md";

export default function StandingOrdersExpandingDetails({ data }) {
    const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const items = [
        { icon: <MdEventSeat />, label: "Booster Seat", value: data?.booster_seats ? "Yes" : "No" },
        { icon: <MdAccessibilityNew />, label: "Is Bariatric", value: data?.is_bariatric ? "Yes" : "No" },
        { icon: <FiRepeat />, label: "Two Way Trip", value: data?.is_two_way ? "Yes" : "No" },
        { icon: <FiPhone />, label: "Pickup Phone Number", value: data?.pickup_phone },
        { icon: <FiPhone />, label: "Dropoff Phone Number", value: data?.dropoff_phone },
    ];

    const patient = data?.patient;
    return (
        <Grid container spacing={2.5} >
            {data ?
                <>
                    <Grid item xs={12} sm={6} md={6} lg={4} sx={{ position: 'relative' }}>
                        <MainCard title="Patient Detail" sx={{ minHeight: '100%' }}>
                            <List sx={{ py: 0 }}>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Patient Name</Typography>
                                                <Typography>
                                                    {patient?.name}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography color="secondary">Patient Status</Typography>
                                            <Chip
                                                label={capitalize(patient?.status)}
                                                size="small"
                                                sx={{
                                                    borderRadius: '4px'
                                                }}
                                                color={getStatusColor(patient?.status)}
                                            />
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Patient Email Address</Typography>
                                                <Typography>
                                                    {patient?.email}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Patient Address</Typography>
                                                <Typography>
                                                    {patient?.address}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </List>
                        </MainCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={8}>
                        <MainCard >
                            <Chip
                                label={capitalize(data.status)}
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    right: -1,
                                    top: -1,
                                    borderRadius: '0 4px 0 4px'
                                }}
                                color={getStatusColor(data?.status)}
                            />
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack direction="row" justifyContent="space-around" alignItems="center">
                                        <Stack spacing={0.5} alignItems="center">
                                            <Typography variant="h5">{data?.pickup_time}</Typography>
                                            <Typography color="secondary">Pickup (Time)</Typography>
                                        </Stack>
                                        <Divider orientation="vertical" flexItem />
                                        <Stack spacing={0.5} alignItems="center">
                                            <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>{data?.appointment_time}</Typography>
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
                                <Grid item xs={12}>
                                    <Typography color="secondary" mb={1}>
                                        Standing Order Dates
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 1.2,
                                        }}
                                    >
                                        {data?.dates?.length > 0 ? (
                                            data.dates.map((item, index) => (
                                                <Chip
                                                    key={index}
                                                    label={item.date}
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{
                                                        fontWeight: 500,
                                                        borderRadius: "16px",
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <Typography color="text.secondary" fontSize={14}>
                                                No dates available
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                            </Grid>
                        </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                        <MainCard title="Notes">
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">Pickup Notes</Typography>
                                        <Typography>
                                            {data?.pickup_directions || 'Nothing'}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">Dropoff Notes</Typography>
                                        <Typography>
                                            {data?.dropoff_directions || 'Nothing'}
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
