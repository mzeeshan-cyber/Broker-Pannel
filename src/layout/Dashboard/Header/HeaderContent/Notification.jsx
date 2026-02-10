import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MainCard from "components/MainCard";
import IconButton from "components/@extended/IconButton";
import Transitions from "components/@extended/Transitions";
import Avatar from "components/@extended/Avatar";
import { Notification, Gift } from "iconsax-react";
import { fetcher } from "utils/axios";
import { decryptToken } from "utils/tokenUtils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Pusher from "pusher-js";
import { useSnackbar } from "notistack";

dayjs.extend(relativeTime);

const notificationSoundUrl =
  "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

export default function NotificationPage() {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();

  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const token = decryptToken(localStorage.getItem("token"));

  const auth = JSON.parse(localStorage.getItem("persist:auth"));
  const user = JSON.parse(auth.user);
  const userId = user.id;


  const getNotifications = async () => {
    try {
      const response = await fetcher(["/fetch-notifications"]);

      if (response.status) {
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sorted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNotifications();

    let echo;

    import("laravel-echo").then(({ default: Echo }) => {
      window.Pusher = Pusher;

      echo = new Echo({
        broadcaster: "pusher",
        key: "4e017ba9b87695367738",
        cluster: "ap2",
        forceTLS: true,
        authEndpoint:
          "http://192.168.18.26:6060/api/broker/broadcasting/auth",
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      });

      echo.private(`user.${userId}`)
        .listen("InstantNotificationEvent", (data) => {
          setNotifications((prev) => [data, ...prev]);
          enqueueSnackbar(data.message || "New Notification", {
            variant: "info"
          });
          new Audio(notificationSoundUrl).play();
        });
    });

    return () => {
      if (echo) {
        echo.leave(`user.${userId}`);
        echo.disconnect();
      }
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const markRead = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, read_at: dayjs().format("YYYY-MM-DD HH:mm:ss") }
          : n
      )
    );
  };

  const markAllRead = () => {
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
    setNotifications(prev =>
      prev.map(n => ({ ...n, read_at: n.read_at || now }))
    );
  };

  const handleClick = (item) => {
    markRead(item.id);
    if (item.action_url) window.open(item.action_url, "_blank");
  };

  const handleToggle = () => setOpen(prev => !prev);
  const handleClose = (e) => {
    if (anchorRef.current?.contains(e.target)) return;
    setOpen(false);
  };

  return (
    <Box sx={{ ml: 0.5 }}>
      <IconButton
        ref={anchorRef}
        onClick={handleToggle}
        size="large"
      >
        <Badge badgeContent={unreadCount} color="error">
          <Notification variant="Bold" />
        </Badge>
      </IconButton>

      <Popper
        placement={matchesXs ? "bottom" : "bottom-end"}
        open={open}
        anchorEl={anchorRef.current}
        transition
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper sx={{ maxWidth: '440px' }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false}>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography variant="h5">
                      Notifications
                    </Typography>

                    <Link component="button" onClick={markAllRead}>
                      Mark all read
                    </Link>
                  </Stack>

                  <List sx={{
                    height: "420px",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}>
                    {notifications.map((item) => {
                      const unread = !item.read_at;
                      const created = dayjs(item.created_at);

                      return (
                        <ListItemButton
                          key={item.id}
                          onClick={() => handleClick(item)}
                          sx={{
                            mb: 1,
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor: unread
                              ? theme.palette.primary.light + "30"
                              : "transparent",
                            alignItems: "flex-start",
                            '&:hover': {
                              bgcolor: unread
                                ? theme.palette.primary.light + "50"
                                : theme.palette.action.hover
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <Gift size={18} />
                            </Avatar>
                          </ListItemAvatar>

                          {/* CONTENT AREA */}
                          <Box sx={{ flex: 1 }}>
                            {/* TOP ROW */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 2
                              }}
                            >
                              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                                {item.message}
                              </Typography>

                              <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                                {created.format("h:mm A")}
                              </Typography>
                            </Box>

                            {/* SECONDARY TIME */}
                            <Typography variant="caption" color="text.secondary">
                              {created.fromNow()}
                            </Typography>
                          </Box>
                        </ListItemButton>

                      );
                    })}
                  </List>
                  <Stack sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '10px' }}>
                    <Link to="#" sx={{ cursor: "pointer" }}>View All</Link>
                  </Stack>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
