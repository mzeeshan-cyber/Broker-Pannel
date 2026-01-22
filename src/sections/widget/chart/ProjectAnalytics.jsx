import { useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Stack,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { decryptToken } from 'utils/tokenUtils';
import TripsChart from './TripsChart';
import {
  ArrowDown,
  ArrowUp,
  Chart,
  HomeTrendUp,
  Clock,
  TickCircle,
  CloseCircle,
  UserRemove,
  UserTick
} from 'iconsax-react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { useTheme } from '@emotion/react';
import TripSkeleton from './TripSkeleton';
import { StatusItem } from './StatusItem';


const API_URL = import.meta.env.VITE_APP_API_URL;
const encryptedFromStorage = localStorage.getItem("token");
const decryptedToken = decryptToken(encryptedFromStorage);

const tripTabs = [
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'No Show', value: 'no_show' },
  { label: 'Assigned', value: 'assigned' }
];

export default function ProjectAnalytics() {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [range, setRange] = useState('monthly'); // weekly/monthly/yearly
  const [apiData, setApiData] = useState([]);
  const [stats, setStats] = useState({});
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  // Calculate default from/to based on range
  const getFromTo = () => {
    if (range === 'monthly') {
      return {
        from_date: currentDate.startOf('month').format('YYYY-MM-DD'),
        to_date: currentDate.endOf('month').format('YYYY-MM-DD')
      };
    }
    if (range === 'weekly') {
      return {
        from_date: currentDate.startOf('week').format('YYYY-MM-DD'),
        to_date: currentDate.endOf('week').format('YYYY-MM-DD')
      };
    }
    if (range === 'yearly') {
      return {
        from_date: currentDate.startOf('year').format('YYYY-MM-DD'),
        to_date: currentDate.endOf('year').format('YYYY-MM-DD')
      };
    }
  };

  const fetchGraphData = async () => {
    const { from_date, to_date } = getFromTo();
    setLoading(true);
    try {
      const values = { from_date, to_date, type: range };

      const response = await axios.post(`${API_URL}trips/graph`, values, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${decryptedToken}`
        }
      });

      setStats(response.data.data.invoice);
      setApiData(response.data.data.data || []);
    } catch (error) {
      console.error('Graph API Error:', error);
      setApiData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, [range, currentDate]);

  const handlePrev = () => {
    setCurrentDate(prev => {
      if (range === 'monthly') return prev.subtract(1, 'month');
      if (range === 'weekly') return prev.subtract(1, 'week');
      if (range === 'yearly') return prev.subtract(1, 'year');
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      const next = range === 'monthly' ? prev.add(1, 'month') :
        range === 'weekly' ? prev.add(1, 'week') :
          prev.add(1, 'year');
      return next.isAfter(dayjs()) ? prev : next;
    });
  };

  // Disable next button if future
  const isNextDisabled = () => {
    if (range === 'monthly') return currentDate.add(1, 'month').isAfter(dayjs(), 'month');
    if (range === 'weekly') return currentDate.add(1, 'week').isAfter(dayjs(), 'week');
    if (range === 'yearly') return currentDate.add(1, 'year').isAfter(dayjs(), 'year');
  };
  return (
    <MainCard content={false}>
      {loading ?
        <TripSkeleton />
        :
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {/* Top Controls */}
            <Box sx={{ p: 3, pb: 1 }}>
              <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} justifyContent={'center'} alignItems={'center'}>
                  <Typography variant="subtitle1">
                    {range === 'monthly' && currentDate.format('MMMM YYYY')}
                    {range === 'weekly' && `${currentDate.startOf('week').format('ddd DD MMM')} - ${currentDate.endOf('week').format('ddd DD MMM YYYY')}`}
                    {range === 'yearly' && currentDate.format('YYYY')}
                  </Typography>
                  <Tooltip title="Previous Interval">
                    <Box
                      color={theme.palette.primary.main}
                      onClick={handlePrev}
                      sx={{
                        cursor: 'pointer',
                      }}
                    >
                      <MdOutlineArrowBackIos size={20} />
                    </Box>
                  </Tooltip>
                  <Tooltip title="Next Interval">
                    <Box
                      color={theme.palette.primary.main}
                      onClick={handleNext}
                      sx={{
                        cursor: isNextDisabled() ? 'not-allowed' : 'pointer',
                        opacity: isNextDisabled() ? 0.4 : 1,
                      }}
                      disabled={isNextDisabled()}
                    >
                      <MdOutlineArrowForwardIos size={20} />
                    </Box>
                  </Tooltip>
                </Stack>

                <FormControl size="small">
                  <Select value={range} onChange={(e) => setRange(e.target.value)}>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            {/* Status Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              <Tabs
                value={selectedTab}
                onChange={(e, v) => setSelectedTab(v)}
                variant="scrollable"
              >
                {tripTabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
            </Box>

            {/* Chart */}
            <Box sx={{ px: 3, pt: 3 }}>
              <Grid container minHeight={'300px'}>
                <Grid item xs={12}>
                  <TripsChart
                    apiData={apiData}
                    status={selectedTab}
                    loading={loading}
                    range={range}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ height: '100%', borderLeft: '1px solid #f1f1f1ff' }}>
              <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5, } }}>
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
                    // secondary={<Typography variant="subtitle1">{stats.total_invoices}</Typography>}
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
                    // secondary={<Typography variant="subtitle1">$ {stats.total_cost}</Typography>}
                  />
                </ListItem>
              </List>
              <Grid item xs={12}>
                <Box sx={{ height: '100%', borderLeft: '1px solid #f1f1f1ff' }}>
                  <Box>
                    <Card variant="outlined1">
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
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
            </Box>
          </Grid>
        </Grid>
      }
    </MainCard>
  );
}
