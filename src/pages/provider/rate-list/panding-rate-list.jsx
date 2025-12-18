import React from 'react'
import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material'
import { Location } from 'iconsax-react'
import { columns } from 'pages/tables/broker-tables/providers/ratelist/panding-rates-list-columns'
import PandingRateListTable from 'pages/tables/react-table/panding-ratelist-table'
import { useParams } from 'react-router'
import { openSnackbar } from 'api/snackbar'
import { decryptToken } from 'utils/tokenUtils'
import { useDispatch } from 'react-redux'
import { updateRateListStatusBulk } from 'store/reducers/ratelistSlice'
import { ThemeMode } from 'config'
import error404 from 'assets/images/maintenance/img-error-404.svg';
import axios from 'axios'

const PandingRateList = ({ data }) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const { provider_id } = useParams();
    const dispatch = useDispatch();
    const theme = useTheme();
    const handleApproveMultiple = async (ids, setOpenModal) => {
        try {
            const response = await fetch(`${API_URL}bulk-approved-rate-list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: JSON.stringify({
                    'rate_list_ids': ids,
                    'provider_id': provider_id,

                }),
            });
            if (response.status === 200) {
                openSnackbar({
                    open: true,
                    message: response.message || 'Rate list are approved successfuly!',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                });
                dispatch(updateRateListStatusBulk({ ids: ids.map(Number) }))
                setOpenModal(false)
            }
            else {
                openSnackbar({
                    open: true,
                    message: response.message || 'Rate lists are not approved!',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                });
            }

        } catch (err) {
            openSnackbar({
                open: true,
                message: response.message || 'Rate lists are not approved!',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            });
        }
    }
    const handleReplaeApprovedRatelists = async () => {
        try {
            const response = await axios.post(
                `${API_URL}replace-approved-rate-list`,
                { provider_id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${decryptedToken}`,
                    }
                }
            );
            openSnackbar({
                open: true,
                message: response?.data?.message || 'Rate lists replaced successfully!',
                variant: 'alert',
                alert: { color: 'success' },
            });

        }
        catch (error) {
            openSnackbar({
                open: true,
                message: error.response?.data?.message || 'All records must be approved before proceeding.',
                variant: 'alert',
                alert: { color: 'error' },
            });
        }

    };

    return (
        <Box sx={{ position: 'relative' }}>
            {data.length > 0 &&
                <Button
                    variant="contained"
                    color="primary"
                    type='button'
                    sx={{
                        fontWeight: 500,
                        bgcolor: 'error',
                        color: 'white',
                        position: 'absolute',
                        right: 0,
                        top: -10,
                        '&:hover': {
                            color: 'secondary.lighter',
                            ...(theme.palette.mode === ThemeMode.DARK && {
                                bgcolor: 'error.lighter',
                                color: ''
                            })
                        }
                    }}
                    onClick={handleReplaeApprovedRatelists}
                >
                    {`Replace Approved Ratelists`}
                </Button>
            }
            {data.length === 0 &&
                <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                        <Stack direction="row" sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Grid item>
                                <Box sx={{ width: { xs: 250, sm: 590 }, height: { xs: 130, sm: 300 } }}>
                                    <img src={error404} alt="error 404" style={{ width: '100%', height: '100%' }} />
                                </Box>
                            </Grid>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={2} justifyContent="center" alignItems="center">
                            <Typography color="text.secondary" align="center" sx={{ width: { xs: '73%', sm: '61%' } }}>
                                No data found
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>}
            {data?.map((item, index) => {
                return (
                    <Box key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '40px', paddingBottom: '10px' }}>
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <Location />
                                <Typography variant='h5'>Source City:</Typography>
                                <Typography variant='h5'>{item.operational_city.name || 'All'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <Location />
                                <Typography variant='h5'>Destination City:</Typography>
                                <Typography variant='h5'>{item.destination_city.name || 'All'}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ marginBottom: '20px' }}>
                            <PandingRateListTable
                                data={item.rates}
                                defaultColumns={columns}
                                handleApproveMultiple={handleApproveMultiple}
                            />
                        </Box>
                    </Box>
                )
            })}
        </Box>
    )
}

export default PandingRateList