import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// ==============================|| EXPANDING TABLE - USER DETAILS ||============================== //

export default function ExpandingUserDetail({ data }) {

    return (
        <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
            <Grid item xs={12}>
                <MainCard title="Notes">
                    <Typography color="secondary">
                        {data.notes || '---'}
                    </Typography>
                </MainCard>
            </Grid>
        </Grid>
    );
}

ExpandingUserDetail.propTypes = { data: PropTypes.any };
