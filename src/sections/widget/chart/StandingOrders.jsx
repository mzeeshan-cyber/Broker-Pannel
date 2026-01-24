import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';
import { useEffect, useState } from 'react';
import { fetcher } from 'utils/axios';
import StandingOrdersSkeleton from './StandingOrderSkeleton';

export default function StandingOrders() {
    const [isLoading, setIsLoading] = useState(false);
    const [standingOrderData, setStandingOrderData] = useState({});

    const getStandingOrdersData = async () => {
        setIsLoading(true);
        try {
            const response = await fetcher([
                "/standing-orders-stats"
            ]);
            if (response.status === true) {
                setIsLoading(false);
                setStandingOrderData(response.data)
                console.log(response)
            }
        }
        catch (error) { }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getStandingOrdersData()
    }, [])
    if (isLoading) {
        return <StandingOrdersSkeleton />;
    }
    return (
        <MainCard title="Standing Orders OverView" sx={{height:'100%'}}>
            <Grid container spacing={1.5}>
                <Grid item xs={12}>
                    <List>
                        <ListItemButton sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                            <ListItemIcon>
                                <Dot color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Active Standing Orders" />
                            <Chip
                                label={
                                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, '& svg': { width: 12, height: 12 } }}>
                                        {standingOrderData.active}
                                    </Typography>
                                }
                                size="small"
                                sx={{ borderRadius: 1 }}
                            />
                        </ListItemButton>
                        <ListItemButton sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                            <ListItemIcon>
                                <Dot color="warning" />
                            </ListItemIcon>
                            <ListItemText primary="Pending Standing Orders" />
                            <Chip
                                label={
                                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, '& svg': { width: 12, height: 12 } }}>
                                        {standingOrderData.pending}
                                    </Typography>
                                }
                                size="small"
                                sx={{ borderRadius: 1 }}
                            />
                        </ListItemButton>
                        <ListItemButton sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                            <ListItemIcon>
                                <Dot />
                            </ListItemIcon>
                            <ListItemText primary="Paused Standing Orders" />
                            <Chip
                                label={
                                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, '& svg': { width: 12, height: 12 } }}>
                                        {standingOrderData.paused}
                                    </Typography>
                                }
                                size="small"
                                sx={{ borderRadius: 1 }}
                            />
                        </ListItemButton>
                        <ListItemButton sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                            <ListItemIcon>
                                <Dot color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Completed Standing Orders" />
                            <Chip
                                label={
                                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, '& svg': { width: 12, height: 12 } }}>
                                        {standingOrderData.completed}
                                    </Typography>
                                }
                                size="small"
                                sx={{ borderRadius: 1 }}
                            />
                        </ListItemButton>
                        <ListItemButton sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                            <ListItemIcon>
                                <Dot color="error" />
                            </ListItemIcon>
                            <ListItemText primary="Cancelled Standing Orders" />
                            <Chip
                                label={
                                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, '& svg': { width: 12, height: 12 } }}>
                                        {standingOrderData.cancelled}
                                    </Typography>
                                }
                                size="small"
                                sx={{ borderRadius: 1 }}
                            />
                        </ListItemButton>
                    </List>
                </Grid>
            </Grid>
        </MainCard>
    );
}
