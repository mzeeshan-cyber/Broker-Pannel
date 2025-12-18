import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


// project import
import MainCard from 'components/MainCard';

// ==============================|| EXPANDING TABLE - USER DETAILS ||============================== //

export default function PayeeExpandingDetails({ data }) {
    const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12}>
                <Stack spacing={2.5}>
                    <MainCard title="Account Details">
                        <List sx={{ py: 0 }}>
                            {(data.bank_name || data.account_number) &&
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        {data.bank_name &&
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                    <Typography color="secondary">Bank Name</Typography>
                                                    <Typography>
                                                        {data.bank_name}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        }
                                        {data.account_number &&
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                    <Typography color="secondary">Account Number</Typography>
                                                    <Typography>
                                                        {data.account_number}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        }
                                    </Grid>
                                </ListItem>
                            }
                            {(data.payment_email || data.phone_number) &&
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        {data.payment_email &&
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                    <Typography color="secondary">Payment Email</Typography>
                                                    <Typography>
                                                        {data.payment_email}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        }
                                        {data.phone_number &&
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                    <Typography color="secondary">Phone Number</Typography>
                                                    <Typography>
                                                        {data.phone_number}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        }
                                    </Grid>
                                </ListItem>
                            }
                            {(data.routing_number || data.tax_id) &&
                                <ListItem divider={!matchDownMD}>
                                    <Grid container spacing={3}>
                                        {data.routing_number &&
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                    <Typography color="secondary">Routing Number</Typography>
                                                    <Typography>
                                                        {data.routing_number}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        }
                                        {data.tax_id &&
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={0.5}>
                                                    <Typography color="secondary">Tax Id</Typography>
                                                    <Typography>
                                                        {data.tax_id}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        }
                                    </Grid>
                                </ListItem>
                            }
                        </List>
                    </MainCard>
                </Stack>
            </Grid>
            {data?.notes &&
                <Grid item xs={12}>
                    <MainCard title="Notes">
                        <Typography color="secondary">
                            {data?.notes}
                        </Typography>
                    </MainCard>
                </Grid>
            }
        </Grid >
    );
}

PayeeExpandingDetails.propTypes = { data: PropTypes.any };
