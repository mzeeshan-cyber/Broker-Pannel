import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PatternFormat } from 'react-number-format';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';
import { Home } from 'iconsax-react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { patientById } from 'store/reducers/patientSlice';
import { getStatusColor } from 'constants/constants';
import { capitalize } from 'lodash';

export default function ExpandingUserDetail({ data }) {
    const dispatch = useDispatch()
    const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

    useEffect(() => {
        dispatch(patientById(data))
    }, [data])

    const LicenceExpiry = new Date(data.license_expiry).toISOString().split("T")[0];

    return (
        <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12} sm={5} md={4} xl={3.5}>
                <MainCard sx={{ minHeight: '100%' }}>
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
                            <Stack spacing={2.5} alignItems="center">
                                <Avatar alt={data.name} size="xl" src={getImageUrl(`avatar-${data.avatar}.png`, ImagePath.USERS)} />
                                <Stack spacing={0.5} alignItems="center">
                                    <Typography variant="h5">
                                        {data.name}
                                    </Typography>
                                    <Typography color="secondary">{data.role}</Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" justifyContent="space-around" alignItems="center">
                                <Stack spacing={0.5} alignItems="center">
                                    <Typography variant="h5">{data.account_no}</Typography>
                                    <Typography color="secondary">Account number</Typography>
                                </Stack>
                                <Divider orientation="vertical" flexItem />
                                <Stack spacing={0.5} alignItems="center">
                                    <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>{data.city}</Typography>
                                    <Typography color="secondary">City</Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0 } }}>
                                <ListItem>
                                    <ListItemIcon>
                                        <Home size="15" />
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography color="secondary">Country</Typography>} />
                                    <ListItemSecondaryAction>
                                        <Typography align="right">{data.country}</Typography>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={7} md={8} xl={8.5}>
                <Stack spacing={2.5}>
                    <MainCard title="Personal Details">
                        <List sx={{ py: 0 }}>
                            <ListItem divider={!matchDownMD}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={0.5}>
                                            <Typography color="secondary">License state</Typography>
                                            <Typography>
                                                {data.license_state}
                                            </Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={0.5}>
                                            <Typography color="secondary">License expiry</Typography>
                                            <Typography>
                                                {LicenceExpiry}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem divider={!matchDownMD}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={0.5}>
                                            <Typography color="secondary">License number</Typography>
                                            <Typography>
                                                {data.license_number}
                                            </Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={0.5}>
                                            <Typography color="secondary">User id</Typography>
                                            <Typography>
                                                {data.user_id}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem divider={!matchDownMD}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={0.5}>
                                            <Typography color="secondary">State</Typography>
                                            <Typography>{data.state}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={0.5}>
                                            <Typography color="secondary">Zip Code</Typography>
                                            <Typography>
                                                <PatternFormat displayType="text" format="### ###" mask="_" defaultValue={data.zip || '-'} />
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                    </MainCard>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <MainCard title="Notes">
                    <Typography color="secondary">
                        {data.notes}
                    </Typography>
                </MainCard>
            </Grid>
        </Grid>
    );
}

ExpandingUserDetail.propTypes = { data: PropTypes.any };
