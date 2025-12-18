// material-ui
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// assets
import { CallCalling, Profile2User } from 'iconsax-react';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { capitalize } from 'lodash';
import { Chip } from '@mui/material';
import { getStatusColor } from 'constants/constants';

export default function AttendentCard({ data }) {
    return (
        <>
            {data.map((item, index) => (
                <MainCard
                    key={index}
                    sx={{
                        height: 1,
                        marginBottom: '10px',
                        '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' },
                    }}
                >
                    <Grid id="print" container spacing={2.25}>
                        <Grid item xs={12}>
                            <List sx={{ width: 1, p: 0 }}>
                                <ListItem disablePadding>
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={item.attendant_name}
                                            src={getImageUrl(`avatar-${!item.image ? 1 : item.image}.png`, ImagePath.USERS)}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1">{item?.attendant_name}</Typography>}
                                    />
                                    <Chip
                                        label={capitalize(item.status)}
                                        size="small"
                                        color={getStatusColor(item?.status)}
                                    />
                                </ListItem>
                            </List>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography>{item?.notes}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={1} direction={{ xs: 'column', md: 'row' }}>
                                <Grid item xs={12}>
                                    <List
                                        sx={{
                                            p: 0,
                                            overflow: 'hidden',
                                            '& .MuiListItem-root': { px: 0, py: 0.5 },
                                            '& .MuiListItemIcon-root': { minWidth: 28 },
                                        }}
                                    >

                                        <ListItem alignItems="flex-start">
                                            <ListItemIcon>
                                                <CallCalling size={18} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography color="text.secondary">
                                                        <PatternFormat
                                                            displayType="text"
                                                            format="+1 (###) ###-####"
                                                            defaultValue={item?.phone_number}
                                                        />
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>

                                        <ListItem alignItems="flex-start">
                                            <ListItemIcon>
                                                <Profile2User size={18} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography color="text.secondary">
                                                        {capitalize(item?.relationship)}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            ))}
        </>
    );
}

