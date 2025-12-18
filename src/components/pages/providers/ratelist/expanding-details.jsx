import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';

export default function PendigRateList({ data }) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <MainCard title="Broker Notes" sx={{ minHeight: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={0.5}>
                                <Typography>
                                    {data?.broker_notes || 'No comments'}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <MainCard title="Provider Notes" sx={{ minHeight: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={0.5}>
                                <Typography>
                                    {data?.provider_notes || 'No comments'}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
        </Grid>
    );
}
