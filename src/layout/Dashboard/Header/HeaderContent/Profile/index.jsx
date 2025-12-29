import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project-imports
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import IconButton from 'components/@extended/IconButton';

import { ThemeMode } from 'config';

// assets
import avatar1 from 'assets/images/users/avatar-6.png';
import { Setting2, Profile, Logout } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { openSnackbar } from 'api/snackbar';
import { useDispatch } from 'react-redux';
import { logout } from 'store/reducers/authSlice';
import { decryptToken } from 'utils/tokenUtils';
import { capitalize } from 'lodash';


// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
      sx={{ p: 1 }}
    >
      {value === index && children}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function ProfilePage() {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const encryptedFromStorage = localStorage.getItem("token");
  const decryptedToken = decryptToken(encryptedFromStorage);
  console.log(decryptedToken)
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('persist:auth');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const user = parsedData.user ? JSON.parse(parsedData.user) : null;
      setData({ ...parsedData, user });
    }
  }, []);

  const handleLogout = async () => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`${API_URL}logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${decryptedToken}`,
        },
        body: JSON.stringify({ logout_type: 'all' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setIsSubmitting(true)
        throw new Error(errorData.message || 'Logout failed!');
      }
      localStorage.setItem('token', '');
      dispatch(logout())
      openSnackbar({
        open: true,
        message: 'Logout Successful!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      setTimeout(() => {
        setIsSubmitting(false)
        navigate(`/login`)
      }, 1500);

    } catch (err) {
      setIsSubmitting(false)
      openSnackbar({
        open: true,
        message: 'Logout Failed',
        variant: 'alert',

        alert: {
          color: 'error',
        }
      });

    }
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleOpenModal = () => {
    setOpenModal(prevState => !prevState)
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          borderRadius: 1,
          '&:hover': { bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.lighter' },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2
          }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Avatar alt="profile user" src={avatar1} />
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: 290,
                minWidth: 240,
                maxWidth: 290,
                [theme.breakpoints.down('md')]: { maxWidth: 250 },
                borderRadius: 1.5
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar alt="profile user" src={avatar1} />
                          <Stack>
                            <Typography variant="subtitle1">{capitalize(data.user.name)}</Typography>
                            <Typography variant="body2" color="secondary">
                              {data.user.email}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Logout">
                          <IconButton size="large" color="error" sx={{ p: 1 }} onClick={handleOpenModal}>
                            <Logout variant="Bulk" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>

                  {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                      <Tab
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textTransform: 'capitalize'
                        }}
                        icon={<Profile size={18} style={{ marginBottom: 0, marginRight: '10px' }} />}
                        label="Profile"
                        {...a11yProps(0)}
                      />
                      <Tab
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textTransform: 'capitalize'
                        }}
                        icon={<Setting2 size={18} style={{ marginBottom: 0, marginRight: '10px' }} />}
                        label="Setting"
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box> */}
                  {/* <TabPanel value={value} index={0} dir={theme.direction}>
                    <ProfileTab handleLogout={handleOpenModal} />
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <SettingTab />
                  </TabPanel> */}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
      <TransitionsModal setOpenModal={setOpenModal} openModal={openModal} title="Logout Modal" btnText="Logout" handleSubmit={handleLogout} isSubmitting={isSubmitting}>
        <Typography id="modal-modal-description">Are you sure, you want to logout?</Typography>
      </TransitionsModal>
    </Box>
  );
}

TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.number, index: PropTypes.number, other: PropTypes.any };
