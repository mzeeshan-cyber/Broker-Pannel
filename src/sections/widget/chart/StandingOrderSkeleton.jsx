import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MainCard from 'components/MainCard';

const StandingOrdersSkeleton = () => {
    return (
        <MainCard
            title={
                <Skeleton variant="text" width={220} height={28} />
            }
        >
            <Grid container spacing={1.5}>
                <Grid item xs={12}>
                    <List>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <ListItemButton
                                key={item}
                                sx={{ flexWrap: 'wrap', rowGap: 1 }}
                            >
                                <ListItemIcon>
                                    <Skeleton variant="circular" width={10} height={10} />
                                </ListItemIcon>

                                <ListItemText
                                    primary={
                                        <Skeleton variant="text" width="60%" height={22} />
                                    }
                                />

                                <Skeleton
                                    variant="rounded"
                                    width={40}
                                    height={22}
                                    sx={{ borderRadius: 1 }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default StandingOrdersSkeleton;
