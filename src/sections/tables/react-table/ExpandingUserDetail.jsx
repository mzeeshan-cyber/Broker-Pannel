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

// third-party
import { PatternFormat } from 'react-number-format';

// project import
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';

// assets
import { Add, AddSquare, Call, Driver, Location, Send2, Sms, User } from 'iconsax-react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { patientById } from 'store/reducers/patientSlice';
import { getStatusColor } from 'constants/constants';
import { capitalize } from 'lodash';
import { minHeight } from '@mui/system';

// ==============================|| EXPANDING TABLE - USER DETAILS ||============================== //

export default function ExpandingUserDetail({ data }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  useEffect(() => {
    dispatch(patientById(data))
  }, [data])


  return (
    <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
      <Grid item xs={12} sm={5} md={4} xl={3.5}>
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
                    {data.name}
                  </Typography>
                  <Typography variant="h6">
                    {data.email}
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
                  <Typography variant="h5">{data.patient_detail.mobility}</Typography>
                  <Typography color="secondary">Mobility</Typography>
                </Stack>
                <Divider orientation="vertical" flexItem />
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>{data.patient_detail.gender}</Typography>
                  <Typography color="secondary">Gender</Typography>
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
                  <ListItemText primary={<Typography color="secondary">Reimbursement drivers</Typography>} />
                  <ListItemSecondaryAction>
                    <Button color='success' onClick={() => { navigate(`/patients/${data?.id}/reimbursement-drivers`) }}>  <Box sx={{ marginRight: '5px' }}>View all</Box>
                      <Send2 />
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ marginBottom: '10px' }}>
                  <ListItemIcon>
                    <AddSquare size="15" />
                  </ListItemIcon>
                  <ListItemText primary={<Typography color="secondary">Payee</Typography>} />
                  <ListItemSecondaryAction>
                    <Button color='success' onClick={() => { navigate(`/patients/${data?.id}/payee`) }}>  <Box sx={{ marginRight: '5px' }}>View all</Box>
                      <Send2 />
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem sx={{ marginBottom: '10px' }}>
                  <ListItemIcon>
                    <User size="15" />
                  </ListItemIcon>
                  <ListItemText primary={<Typography color="secondary">Attendent</Typography>} />
                  <ListItemSecondaryAction>
                    <Button color='success' onClick={() => { navigate(`/patients/${data?.id}/attendent`) }}>  <Box sx={{ marginRight: '5px' }}>View all</Box>
                      <Send2 />
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={7} md={8} xl={8.5}>
        {/* <Stack spacing={2.5}> */}
          <MainCard title="Personal Details" sx={{minHeight:'100%'}}>
            <List sx={{ py: 0 }}>
              <ListItem divider={!matchDownMD}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Account Number</Typography>
                      <Typography>
                        {data.patient_detail.account_number}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Identifier Number</Typography>
                      <Typography>{data.patient_detail.identifier_number}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem divider={!matchDownMD}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Funding Source</Typography>
                      <Typography>
                        {data.patient_detail.funding_source}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Date of Birth</Typography>
                      <Typography>{data.patient_detail.date_of_birth}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem divider={!matchDownMD}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Routing Number</Typography>
                      <Typography>
                        {data.patient_detail.routing_number}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Social Security Number</Typography>
                      <Typography>{data.patient_detail.social_security_number}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem divider={!matchDownMD}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Medicaid Number</Typography>
                      <Typography>{data.patient_detail.medicaid_number}</Typography>
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
              <ListItem>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Phone Number</Typography>
                      <Typography>{data.patient_detail.phone_number}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">Address</Typography>
                      <Typography>{data.address}</Typography>
                    </Stack>
                  </Grid>
                </Grid>

              </ListItem>
            </List>
          </MainCard>
        {/* </Stack> */}
      </Grid>
      <Grid item xs={12}>
        <MainCard title="Notes">
          <Typography color="secondary">
            {data.patient_detail.notes}
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}

ExpandingUserDetail.propTypes = { data: PropTypes.any };
