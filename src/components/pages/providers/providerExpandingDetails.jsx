import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// project import
import MainCard from 'components/MainCard';
import { Avatar, Button, Chip, Divider, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@mui/material';
import { capitalize } from 'lodash';
import { getStatusColor } from 'constants/constants';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';
import { Car, DocumentCode, Driver, ElementPlus, User } from 'iconsax-react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router';
import { FaCity, FaListAlt } from 'react-icons/fa';

export default function ProviderExpandingDetails({ data }) {
    const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const providerDetail = data?.provider_detail;

    return (
        <Grid container spacing={2.5} >
            {providerDetail ?
                <>
                    <Grid item xs={12} sm={6} md={6} xl={6}>
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
                                    <Stack spacing={2.5} alignItems="center">
                                        <Avatar alt={data.name} size="xl" src={getImageUrl(`avatar-${data.avatar}.png`, ImagePath.USERS)} />
                                        <Stack spacing={0.5} alignItems="center">
                                            <Typography variant="h5">
                                                {providerDetail?.company_name}
                                            </Typography>
                                            <Typography variant="h6">
                                                {providerDetail?.company_website}
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
                                            <Typography variant="h5">{providerDetail?.company_work_start_time}</Typography>
                                            <Typography color="secondary">Work Starts (Time)</Typography>
                                        </Stack>
                                        <Divider orientation="vertical" flexItem />
                                        <Stack spacing={0.5} alignItems="center">
                                            <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>{providerDetail?.company_work_end_time}</Typography>
                                            <Typography color="secondary">Work Ends (Time)</Typography>
                                        </Stack>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0 } }}>
                                        <ListItem sx={{ marginBottom: '10px' }}>
                                            <ListItemIcon>
                                                <Driver size="15" />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography color="secondary">General Information</Typography>} />
                                            <ListItemSecondaryAction>
                                                {providerDetail === null || providerDetail === undefined ?
                                                <Button color='primary' onClick={() => { navigate(`/providers/${providerDetail?.provider_id}/general-info`) }}>  <Box sx={{ marginRight: '5px' }}>Add</Box></Button>
                                                :
                                                <Button color='primary' onClick={() => { navigate(`/providers/${providerDetail?.provider_id}/general-info/update`) }}>  <Box sx={{ marginRight: '5px' }}>update</Box></Button>
                                                }
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem sx={{ marginBottom: '10px' }}>
                                            <ListItemIcon>
                                                <DocumentCode size="15" />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography color="secondary">Provider Registration Documents</Typography>} />
                                            <ListItemSecondaryAction>
                                                <Button color='primary' onClick={() => { navigate(`/providers/${providerDetail?.provider_id}/registration-documents`) }}>  <Box sx={{ marginRight: '5px' }}>View</Box>
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem sx={{ marginBottom: '10px' }}>
                                            <ListItemIcon>
                                                <User size="15" />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography color="secondary">Provider Drivers</Typography>} />
                                            <ListItemSecondaryAction>
                                                <Button color='primary' onClick={() => { navigate(`/providers/${providerDetail?.provider_id}/drivers`) }}>  <Box sx={{ marginRight: '5px' }}>View</Box>
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem sx={{ marginBottom: '10px' }}>
                                            <ListItemIcon>
                                                <Car size="15" />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography color="secondary">Provider Vehicles</Typography>} />
                                            <ListItemSecondaryAction>
                                                <Button color='primary' onClick={() => { navigate(`/providers/${providerDetail?.provider_id}/vehicles`) }}>  <Box sx={{ marginRight: '5px' }}>View</Box>
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem sx={{ marginBottom: '10px' }}>
                                            <ListItemIcon>
                                                <FaListAlt size="15" />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography color="secondary">Provider Rate List</Typography>} />
                                            <ListItemSecondaryAction>
                                                <Button color='primary' onClick={() => { navigate(`/providers/${providerDetail?.provider_id}/ratelist`) }}>  <Box sx={{ marginRight: '5px' }}>View</Box>
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem sx={{ marginBottom: '10px' }}>
                                            <ListItemIcon>
                                                <FaCity size="15" />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography color="secondary">Provider Operational Cities</Typography>} />
                                            <ListItemSecondaryAction>
                                                <Button color='primary' onClick={() => { navigate(`/providers/${providerDetail?.provider_id}/cities`) }}>  <Box sx={{ marginRight: '5px' }}>View</Box>
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} xl={6} sx={{ position: 'relative' }}>
                        <Button sx={{ position: 'absolute', right: '20px', top: '35px', zIndex: 1 }} color='primary' onClick={() => { navigate(`/providers/${providerDetail?.provider_id}/general-info/update`) }}>  <Box sx={{ marginRight: '5px' }}>Update General Info</Box>
                                {/* icon  */}
                        </Button>
                        <MainCard title="General Informations" sx={{ minHeight: '100%' }}>
                            <List sx={{ py: 0 }}>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Company Address</Typography>
                                                <Typography>
                                                    {providerDetail?.company_address}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Company Phone Number</Typography>
                                                <Typography>
                                                    {providerDetail?.company_phone}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Tax ID/EIN</Typography>
                                                <Typography>
                                                    {providerDetail?.company_tax_id}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">On Demand Video Tracking IP Address</Typography>
                                                <Typography>
                                                    {providerDetail?.account_number}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Tracking User Name</Typography>
                                                <Typography>
                                                    {providerDetail?.bank_name}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Company Admin Name</Typography>
                                                <Typography>
                                                    {providerDetail?.company_admin_name}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Company Admin Email</Typography>
                                                <Typography>
                                                    {providerDetail?.company_admin_email}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Company Admin Phone</Typography>
                                                <Typography>
                                                    {providerDetail?.company_admin_phone}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Company Owner Name</Typography>
                                                <Typography>
                                                    {providerDetail?.company_owner_name}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Company Owner Email</Typography>
                                                <Typography>
                                                    {providerDetail?.company_owner_email}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Company Owner Phone</Typography>
                                                <Typography>
                                                    {providerDetail?.company_owner_phone}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Company Zip Code</Typography>
                                                <Typography>
                                                    {providerDetail?.company_zip_code}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </List>
                        </MainCard>
                    </Grid>
                    <Grid item xs={12}>
                        <MainCard title="Notes">
                            <Typography color="secondary">
                                {data?.notes || 'No data'}
                            </Typography>
                        </MainCard>
                    </Grid>
                </>
                :
                <Grid item xs={12}>
                    <MainCard title="">
                        <Stack sx={{ alignItems: 'center', color: '#f04134e6' }}>No General Information</Stack>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                            <Button color='success' onClick={() => { navigate(`/providers/${data?.id}/general-info`) }}>  <Box sx={{ marginRight: '5px' }}>Add General Info</Box>
                                <ElementPlus />
                            </Button>
                        </Box>
                    </MainCard>
                </Grid>
            }

        </Grid >
    );
}
