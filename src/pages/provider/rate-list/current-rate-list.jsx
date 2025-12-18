import React from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { Location } from 'iconsax-react'
import { columns } from 'pages/tables/broker-tables/providers/ratelist/ratelist-columns'
import CommonTable from 'pages/tables/react-table/common-table'
import error404 from 'assets/images/maintenance/img-error-404.svg';

const CurrentRateList = ({ data }) => {
    return (
        <div>
            {data.length === 0 &&
                <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                        <Stack direction="row" sx={{width:'100%', display:'flex', justifyContent:'center' }}>
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
                            <CommonTable
                                data={item.rates}
                                defaultColumns={columns}
                                noPagination={true}
                            />
                        </Box>
                    </Box>
                )
            })}
        </div>
    )
}

export default CurrentRateList