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
import { CallCalling, CardCoin, DocumentText, Sms } from 'iconsax-react';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { capitalize } from 'lodash';
import { Chip } from '@mui/material';
import { getStatusColor } from 'constants/constants';


export default function PayeeCard({ data }) {
  return (
    <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
      <Grid id="print" container spacing={2.25}>
        <Grid item xs={12}>
          <List sx={{ width: 1, p: 0 }}>
            <ListItem
              disablePadding
            >
              <ListItemAvatar>
                <Avatar
                  alt={data?.name}
                  src={getImageUrl(`avatar-${!data?.image ? 1 : data?.image}.png`, ImagePath.USERS)}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">{capitalize(data?.account_holder_name) || '--'}</Typography>}
                secondary={<Typography color="text.secondary">{data?.country || '--'}</Typography>}
              />
              <Chip
                label={capitalize(data?.status)}
                size="small"
                color={getStatusColor(data?.status)}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography>{data?.notes || 'No notes'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} direction={{ xs: 'column', md: 'row' }}>
            <Grid item xs={12}>
              <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 }, '& .MuiListItemIcon-root': { minWidth: 28 } }}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <Sms size={18} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography color="text.secondary">{data?.payment_email || 'No email provided'}</Typography>} />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <CallCalling size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography color="text.secondary">
                        <PatternFormat displayType="text" format="+1 (###) ###-####" defaultValue={data?.phone_number} />
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <CardCoin size={18} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography color="text.secondary">{capitalize(data?.payment_method)}</Typography>} />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <DocumentText size={18} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography color="text.secondary">{capitalize(data?.routing_number) || 'No routing number'}</Typography>} />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
}
