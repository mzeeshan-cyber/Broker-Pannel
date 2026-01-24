import {
    Box,
    Stack,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Card,
    CardContent,
} from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import {
    Chart,
    HomeTrendUp,
    Clock,
    TickCircle,
    CloseCircle,
    UserRemove,
    UserTick
} from 'iconsax-react';
import { StatusItem } from './StatusItem';


const InvoiceCharts = ({ stats }) => {
    return (
        <Grid sx={{ height: '100%' }}>
            <Grid item xs={12}>
                <Box sx={{ height: '100%' }}>
                    <Box>
                        <Card variant="outlined">
                            <CardContent>
                                <List disablePadding sx={{ '& .MuiListItem-root': { py: 1, px:0} }}>
                                    <ListItem
                                        divider
                                        secondaryAction={
                                            <Stack spacing={0.25} alignItems="flex-end">
                                                <Typography variant="subtitle1">{stats.total_invoices}</Typography>
                                            </Stack>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                                                <Chart />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography color="text.secondary">Total Invoices</Typography>}
                                        />
                                    </ListItem>
                                    <ListItem
                                        divider
                                        secondaryAction={<Typography variant="subtitle1">$ {stats.total_cost}</Typography>}
                                    >
                                        <ListItemAvatar>
                                            <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                                                <HomeTrendUp />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography color="text.secondary">Total Cost</Typography>}
                                        />
                                    </ListItem>
                                </List>
                                <Typography variant="subtitle1" sx={{ my: 2 }}>
                                    Trips Stats
                                </Typography>

                                <Grid container spacing={2}>
                                    <StatusItem
                                        label="Pending"
                                        value={stats?.trips?.pending}
                                        icon={<Clock />}
                                        color="warning.main"
                                        bgcolor="warning.lighter"
                                    />
                                    <StatusItem
                                        label="Completed"
                                        value={stats?.trips?.completed}
                                        icon={<TickCircle />}
                                        color="success.main"
                                        bgcolor="success.lighter"
                                    />
                                    <StatusItem
                                        label="Cancelled"
                                        value={stats?.trips?.cancelled}
                                        icon={<CloseCircle />}
                                        color="error.main"
                                        bgcolor="error.lighter"
                                    />
                                    <StatusItem
                                        label="No Show"
                                        value={stats?.trips?.no_show}
                                        icon={<UserRemove />}
                                        color="text.secondary"
                                        bgcolor="text.lighter"
                                    />
                                    <StatusItem
                                        label="Assigned"
                                        value={stats?.trips?.assigned}
                                        icon={<UserTick />}
                                        color="primary.main"
                                        bgcolor="primary.lighter"
                                    />
                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default InvoiceCharts