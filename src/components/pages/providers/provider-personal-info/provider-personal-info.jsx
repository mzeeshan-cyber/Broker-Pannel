import { Box, Typography } from '@mui/material'
import React from 'react'

const ProviderPersonalInfo = (providerData) => {
    return (
        <>
            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <Typography >Provider name : </Typography>
                <Typography variant='h5'>{providerData?.providerData?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <Typography>Company name : </Typography>
                <Typography variant='h5'>{providerData?.providerData?.provider_detail?.company_name}</Typography>
            </Box>
        </>
    )
}

export default ProviderPersonalInfo