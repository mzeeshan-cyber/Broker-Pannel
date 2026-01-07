import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { ThemeMode } from 'config';

export default function EcommerceDataChart({ filterType = 'monthly', data = [], fromDate, toDate, color, type }) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const formatMonthlyTooltip = (day) => {
    const date = new Date(fromDate);
    date.setDate(Number(day));

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  const formatWeeklyTooltip = (dayLabel, dataPointIndex) => {
    const date = new Date(fromDate);
    date.setDate(date.getDate() + dataPointIndex);

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      weekday: 'short'
    });
  };

  // Dynamically generate categories based on filterType and data
  const categories = useMemo(() => {
    if (!data || data.length === 0) return [];

    const from = new Date(fromDate);
    const to = new Date(toDate);

    switch (filterType) {
      case 'weekly': {
        const result = [];
        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
          result.push(d.toLocaleDateString('en-US', { weekday: 'short' })); // Mon, Tue...
        }
        return result;
      }

      case 'monthly': {
        const daysInMonth = to.getDate();
        return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      }

      case 'yearly': {
        const monthsDiff = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
        const result = [];
        let current = new Date(from.getFullYear(), from.getMonth(), 1); // day = 1
        for (let i = 0; i < monthsDiff; i++) {
          result.push(current.toLocaleString('default', { month: 'short', year: 'numeric' }));
          current = new Date(current.getFullYear(), current.getMonth() + 1, 1); // next month, day = 1
        }
        return result;
      }

      default:
        return [];
    }
  }, [filterType, data, fromDate, toDate]);

  // Map API counts to chart series
  const seriesData = useMemo(() => {
    if (!data || data.length === 0) return [];

    switch (filterType) {
      case 'weekly':
      case 'monthly':
        return data.map(d => d ?? 0);

      case 'yearly': {
        return data.map(d => d ?? 0);
      }

      default:
        return [];
    }
  }, [data, filterType]);

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent'
    },
    tooltip: {
      x: {
        formatter: (value, { dataPointIndex }) => {
          if (filterType === 'monthly') {
            return formatMonthlyTooltip(value);
          }

          if (filterType === 'weekly') {
            return formatWeeklyTooltip(value, dataPointIndex);
          }

          return value;
        }
      }
    }
    ,
    dataLabels: { enabled: false },
    stroke: { show: false },
    fill: { type: 'solid', colors: [color || theme.palette.primary.main] },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 1
      }
    },
    grid: { strokeDashArray: 4, borderColor: line },
    xaxis: {
      categories,
      labels: {
        show: filterType !== 'monthly',
        style: { colors: categories.map(() => secondary) }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { style: { colors: [secondary] } }
    },
    theme: { mode: mode === ThemeMode.DARK ? 'dark' : 'light' }
  });

  // Update options when categories or theme changes
  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      xaxis: {
        ...prev.xaxis,
        categories,
        labels: { style: { colors: categories.map(() => secondary) } }
      },
      fill: { ...prev.fill, colors: [color || theme.palette.primary.main] },
      grid: { ...prev.grid, borderColor: line },
      theme: { mode: mode === ThemeMode.DARK ? 'dark' : 'light' }
    }));
  }, [categories, secondary, line, theme, color, mode]);

  return <ReactApexChart options={options} series={[{ name: type, data: seriesData }]} type="bar" height={160} />;
}
