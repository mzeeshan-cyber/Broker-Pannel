import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

const statusColors = {
  pending: '#FFA726',
  completed: '#66BB6A',
  cancelled: '#EF5350',
  no_show: '#AB47BC',
  assigned: '#29B6F6'
};

export default function TripsChart({ apiData, status, range }) {
  const theme = useTheme();
  let categories = [];
  if (range === 'weekly') {
    categories = apiData.map(item => dayjs(item.date).format('ddd'));
  } else if (range === 'monthly') {
    categories = apiData.map(item => dayjs(item.date).format('DD MMM'));
  } else if (range === 'yearly') {
    categories = apiData.map(item => dayjs(item.month).format('MMM YYYY'));
  }

  const series = [
    {
      name: status.replace('_', ' ').toUpperCase(),
      data: apiData.map(item => (range === 'yearly' ? item.trips[status] : item.trips[status]) || 0)
    }
  ];

  const options = {
    chart: { type: 'line', toolbar: { show: false } },
    stroke: { width: 3, curve: 'smooth' },
    colors: [statusColors[status]],
    xaxis: {
      categories,
      labels: { style: { colors: theme.palette.text.secondary } }
    },
    yaxis: {
      labels: { style: { colors: theme.palette.text.secondary } }
    },
    grid: { borderColor: theme.palette.divider },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      shared: true,
      style: {
        fontSize: '12px',
        color: theme.palette.mode === 'dark' ? '#fff' : '#000'
      },
      x: {
        formatter: function (val, opts) {
          if (range === 'weekly') {
            const idx = opts.dataPointIndex;
            const date = apiData[idx].date;
            return dayjs(date).format('DD MMM, dddd');
          }
          if (range === 'monthly') {
            const idx = opts.dataPointIndex;
            const date = apiData[idx].date;
            return dayjs(date).format('DD MMM, dddd');
          }
          if (range === 'yearly') {
            const idx = opts.dataPointIndex;
            const month = apiData[idx].month;
            return dayjs(month).format('MMM YYYY');
          }
          return val;
        }
      },
      y: {
        formatter: val => `${val} trips`
      }
    }
  };

  return <ReactApexChart options={options} series={series} type="line" height={280} />;
}
