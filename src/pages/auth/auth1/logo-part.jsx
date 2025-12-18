import { Grid, Stack } from '@mui/material'
import React from 'react'

const LogoPart = () => {
    return (
        <Grid sx={{
            display: { xs: 'none', md: 'block' },
            minWidth: { xs: '50%' },
            backgroundImage: 'url(https://cnavigator.tech/provider/images/regisBG.jpg)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }}>
            <Stack display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
                <img src="https://cnavigator.tech/provider/images/logo-01.png" alt="logo" />
            </Stack>
        </Grid>
    )
}

export default LogoPart