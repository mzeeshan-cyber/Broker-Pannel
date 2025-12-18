import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { PDFDownloadLink } from '@react-pdf/renderer';

// project-imports
import MainCard from 'components/MainCard';
import LogoSection from 'components/logo';
import LoadingButton from 'components/@extended/LoadingButton';
import ExportPDFView from 'sections/apps/invoice/export-pdf';

// assets
import { List, ListItem, useMediaQuery } from '@mui/material';
import { capitalize, replace } from 'lodash';
import { openSnackbar } from 'api/snackbar';
import { fetcher } from 'utils/axios';
import ReusableDrawer from '../ReusableDrawer';
import RebillingConversation from './RebillingConversation';
import { useNavigate } from 'react-router';


export default function InvoiceDetail({ data }) {
  const theme = useTheme();
  const componentRef = useRef(null);
  const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [reimbursementTripRate, setReimbursementTripRate] = useState(null)
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen(!open);
  const navigate = useNavigate();
  const invoiceMaster = {
    country: { prefix: '$' }
  };
  const handleGetReimbursementRate = async () => {
    try {
      const response = await fetcher('fetch-reimbuirsement-trip-setting');
      if (response.status === true) {
        setReimbursementTripRate(response.data.per_mile_rate)
      }
      else {
        openSnackbar({
          open: true,
          message: response.message || 'Failed to fetch data',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    }
    catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Failed to fetch data',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };
  useEffect(() => {
    handleGetReimbursementRate();
  }, [])


  const today = new Date().toLocaleDateString('en-GB');
  const personal_driver_cost = Number(reimbursementTripRate) * Number(data?.personal_driver_millage);
  const total = Number(data.allowance_breakfast) + Number(data.allowance_dinner) + Number(data.allowance_lodging) + Number(data.allowance_lunch) + Number(data.extra_amount) + Number(data.tickets_cost) + Number(personal_driver_cost);
  return (
    <>
      <MainCard content={false}>
        <Stack spacing={2.5}>
          <Box sx={{ p: 2.5 }} id="print" ref={componentRef}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={2}>
                      <LogoSection />
                      <Chip label={capitalize(data.tripStatus)} variant="light" color={data.tripStatus === 'approved' || data.tripStatus === 'completed' ? 'success' : 'error'} size="small" />
                    </Stack>
                    <Typography color="secondary">#{`${data.id}-${data.patient.name}`}</Typography>
                  </Stack>
                  <Box>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Typography variant="subtitle1">Date</Typography>
                      <Typography color="secondary">{today}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
              <List sx={{ py: 0, width: '100%' }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Funding Source</Typography>
                        <Typography>
                          {capitalize(data?.funding_source)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Trip Duration</Typography>
                        <Typography>
                          {data?.duration || '0'}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Trip Distance</Typography>
                        <Typography>
                          {data?.trip_distance || '0'} miles
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Mobility</Typography>
                        {data.mobility.map((item, index) => {
                          return (
                            <Typography key={index}>
                              {index + 1} - {capitalize(replace(item, "_", " "))}
                            </Typography>
                          )
                        })}
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Personal Driver Millage</Typography>
                        <Typography>
                          {data?.personal_driver_millage || '0'} miles
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Personal Driver Per Mile Rate</Typography>
                        <Typography>
                          $ {reimbursementTripRate || '0'}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>

              <Grid item xs={12} sm={6}></Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color={theme.palette.secondary.main}>Personal Driver Cost:</Typography>
                    <Typography>{invoiceMaster.country.prefix + ` ${personal_driver_cost ?? ' 0.0'}`}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color={theme.palette.secondary.main}>Tickets Cost:</Typography>
                    <Typography>{invoiceMaster.country.prefix + ` ${data?.tickets_cost ?? ' 0.0'}`}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color={theme.palette.secondary.main}>Breakfast Allowance:</Typography>
                    <Typography>{invoiceMaster.country.prefix + `${data?.allowance_breakfast ?? ' 0.0'}`}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color={theme.palette.secondary.main}>Lodging Allowance:</Typography>
                    <Typography>{invoiceMaster.country.prefix + `${data?.allowance_lodging ?? ' 0.0'}`}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color={theme.palette.secondary.main}>Lunch Allowance:</Typography>
                    <Typography>{invoiceMaster.country.prefix + `${data?.allowance_lunch ?? ' 0.0'}`}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color={theme.palette.secondary.main}>Dinner Allowance:</Typography>
                    <Typography>{invoiceMaster.country.prefix + `${data?.allowance_dinner ?? ' 0.0'}`}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color={theme.palette.secondary.main}>Extra Amount:</Typography>
                    <Typography>{invoiceMaster.country.prefix + `${data?.extra_amount ?? ' 0.0'}`}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle1">Grand Total:</Typography>
                    <Typography variant="subtitle1">
                      {invoiceMaster.country.prefix + `${total.toFixed(2) ?? ' 0.0'}`}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="column" spacing={1}>
                  <Typography color="secondary">Notes:</Typography>
                  <Typography>
                    Thank you for choosing our services. We hope your trip was comfortable and look forward to serving you again.
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2.5 }}>
            <LoadingButton onClick={()=>{navigate('/reimbursement-trips/form');localStorage.setItem("tripId", data.id);}} color="success" variant="outlined">
              reimbursement trips form
            </LoadingButton>
            <LoadingButton onClick={handleToggle} color="secondary" variant="contained" sx={{ color: 'secondary.lighter' }}>
              Apply for rebilling
            </LoadingButton>
            <PDFDownloadLink document={<ExportPDFView data={data} reimbursementTripRate={reimbursementTripRate} personal_driver_cost={personal_driver_cost} />} fileName={`${data.id}-${data.patient.name}.pdf`}>
              <LoadingButton color="primary" variant="contained" sx={{ color: 'secondary.lighter' }}>
                Download
              </LoadingButton>
            </PDFDownloadLink>
          </Stack>
        </Stack>
      </MainCard>
      <ReusableDrawer
        open={open}
        onClose={handleToggle}
        title="Re-Billing Request"
      >
        <RebillingConversation trip_id={data?.id}/>
      </ReusableDrawer>
    </>
  );
}
