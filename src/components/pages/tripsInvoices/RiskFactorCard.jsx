import { Box, Typography, Divider, Stack } from '@mui/material';
import { Warning2 } from 'iconsax-react';

const RiskFactorCard = ({ riskData }) => {
    const data = riskData?.[0];

    return (
        <Box
            sx={{
                px: 2.2,
                py: 1.5,
                borderRadius: '14px',
                maxWidth: 320,
                minWidth:200,
                position: 'absolute',
                top: '-120px',
                right: 0,
                background: '#da3c3cff',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 32px rgba(192, 108, 108, 0.6)'
                }
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.2} mb={1}>
                <Warning2 size="22" color="#FFD54F" />
                <Typography variant="subtitle1" fontWeight={700}>
                    Risk Factor
                </Typography>
            </Stack>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mb: 1.2 }} />

            <Stack spacing={0.8}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        Amount
                    </Typography>
                    <Typography fontWeight={700}>
                        {data?.amount ?? '--'}
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        Miles
                    </Typography>
                    <Typography fontWeight={700}>
                        {data?.miles ?? '--'}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
};

export default RiskFactorCard;
