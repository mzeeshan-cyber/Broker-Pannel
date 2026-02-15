import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import MainCard from 'components/MainCard';
import { fetcher, fetcherPost } from 'utils/axios';
import { openSnackbar } from 'api/snackbar';

const mapApiToState = (data = []) => {
  return data.reduce((acc, item) => {
    acc[item.id] = {
      label: item.label,
      email: item.email ?? false,
      sms: item.sms ?? false,
      panel: item.panel ?? false
    };
    return acc;
  }, {});
};


export default function TabSettings() {
  const [settings, setSettings] = useState({});
  const [isFetching, setIsFetching] = useState(true);

  const getNotifications = async () => {
    try {
      const response = await fetcher(["/get-notification-settings"]);
      if (response.status === true) {
        setSettings(mapApiToState(response.data));
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const handleChange = (type, channel) => (e) => {
    setSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [channel]: e.target.checked
      }
    }));
  };
  const preparePayload = (settings) => {
    return Object.entries(settings).map(([id, value]) => ({
      id,
      label: value.label,
      email: value.email,
      sms: value.sms,
      panel: value.panel
    }))
  };

  const handleSubmit = async () => {
    const payload = preparePayload(settings);
    try {
      const response = await fetcherPost([
        "/notification-settings",
        payload 
      ]);

      if (response.status === true) {
        openSnackbar({
          open: true,
          message: 'Notification settings updated',
          variant: 'alert',
          alert: { color: 'success' }
        });
      }
    } catch (err) {
      openSnackbar({
        open: true,
        message: 'Notification settings not updated',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard title="Updates from System Notification">
          <Stack spacing={2.5}>

            <Typography variant="subtitle1">
              Patient Notifications
            </Typography>

            {isFetching ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {Object.entries(settings).map(([id, item]) => (
                  <ListItem key={id} sx={{ py: 1 }}>
                    <ListItemText
                      primary={
                        <Typography color="secondary">
                          {item.label}
                        </Typography>
                      }
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.email}
                            onChange={handleChange(id, 'email')}
                          />
                        }
                        label="Email"
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.sms}
                            onChange={handleChange(id, 'sms')}
                          />
                        }
                        label="SMS"
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.panel}
                            onChange={handleChange(id, 'panel')}
                          />
                        }
                        label="Panel"
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
        </MainCard>
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isFetching}
        >
          Update Notifications
        </Button>
      </Grid>
    </Grid>
  );
}
