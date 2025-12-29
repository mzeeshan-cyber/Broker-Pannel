import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { Box, Divider } from '@mui/material';
import TripInvoicesTable from './invoiceTable';


export default function ExpandingDetails({ data }) {
    const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const totalAmount = data.invoice_trip_count.reduce((sum, item) => sum + item.amount, 0);

    return (
        <Grid container spacing={2.5} >
            {data ?
                <>
                    <Grid item xs={12} sm={6} md={6} lg={4} sx={{ position: 'relative' }}>
                        <MainCard title="Provider Details" sx={{ minHeight: '100%' }}>
                            <List sx={{ py: 0 }}>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Owner Name</Typography>
                                                <Typography>
                                                    {data?.provider.owner}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Contractor</Typography>
                                                <Typography>
                                                    {data?.provider.contractor}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Phone Number</Typography>
                                                <Typography>
                                                    {data?.provider.phone}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Stack spacing={0.5}>
                                                <Typography color="secondary">Address</Typography>
                                                <Typography>
                                                    {data?.provider.address}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </List>
                        </MainCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={8}>
                        <MainCard title="Price Breakdown">
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TripInvoicesTable data={data.invoice_trip_count} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display={'flex'} justifyContent={'end'} alignItems={'center'} gap={'5px'}>
                                        <Typography variant='h5'>Total :</Typography>
                                        <Typography>${totalAmount}</Typography>
                                    </Box>
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
