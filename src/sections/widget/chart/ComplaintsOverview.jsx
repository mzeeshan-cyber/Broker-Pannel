import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ReactApexChart from 'react-apexcharts';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import ComplaintsOverviewSkeleton from './ComplaintsOverviewSkeleton';
import { fetcher } from 'utils/axios';
import { Box } from '@mui/system';

function ComplaintsDonutChart({ series, labels, colors }) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [options, setOptions] = useState({
    chart: {
      type: 'donut',
      background: 'transparent',
      toolbar: { show: false }
    },
    labels,
    colors,
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    fill: { type: 'solid' },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.9
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '58%',
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: -4,
              fontSize: '13px',
              fontWeight: 500,
              color: theme.palette.text.secondary
            },
            value: {
              show: true,
              offsetY: 6,
              fontSize: '22px',
              fontWeight: 700,
              color: theme.palette.text.primary
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              fontWeight: 500,
              color: theme.palette.text.secondary,
              formatter: (w) =>
                w.globals.seriesTotals.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`
      }
    }
  });

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode]);

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      height={220}
    />
  );
}

ComplaintsDonutChart.propTypes = {
  series: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired
};

export default function ComplaintsOverview() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const getDateBeforeDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  const getComplaints = async () => {
    setIsLoading(true);

    const query = {
      from_date: getDateBeforeDays(40),
      to_date: new Date().toISOString().split('T')[0]
    };

    const response = await fetcher([
      '/complaints/summary',
      { params: query }
    ]);

    if (response?.status) {
      setData(response.data.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getComplaints();
  }, []);

  const totalResolved = data.reduce((sum, item) => sum + item.resolved, 0);
  const totalPending = data.reduce((sum, item) => sum + item.pending, 0);

  if (isLoading) return <ComplaintsOverviewSkeleton />;

  return (
    <MainCard>
      {/* HEADER */}
      <Stack spacing={0.5}>
        <Typography variant="h5">Complaints Overview</Typography>
        <Typography variant="body2" color="text.secondary">
          Last 40 days summary
        </Typography>
      </Stack>
      <Stack spacing={0} justifyContent="flex-end">
        {/* DONUT */}
        <ComplaintsDonutChart
          series={[totalResolved, totalPending]}
          labels={['Resolved', 'Pending']}
          colors={[theme.palette.primary.main, theme.palette.error.main]}
        />

        {/* LEGEND */}
        <Stack spacing={1} justifyContent="flex-end">
          {[
            { label: 'Resolved', value: totalResolved, color: theme.palette.primary.main },
            { label: 'Pending', value: totalPending, color: theme.palette.error.main }
          ].map((item) => (
            <Stack
              key={item.label}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: item.color
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
              </Stack>

              <Typography variant="h6">{item.value}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

    </MainCard>
  );
}
