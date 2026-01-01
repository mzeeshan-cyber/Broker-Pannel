import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { ThemeMode } from 'config';

export default function EcommerceDataChart({ color, height, data, type }) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const [options, setOptions] = useState({
    chart: {
      id: 'new-stack-chart',
      type: 'bar',
      sparkline: { enabled: true },
      toolbar: { show: false },
      offsetX: 0
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%',
        distributed: data?.length === 1
      }
    },
    xaxis: {
      crosshairs: { width: 1 },
      labels: { show: false } // hide X-axis labels
    },
    yaxis: {
      min: 0,
      max: Math.max(...(data || [0])) * 1.2,
      labels: { show: false } // hide Y-axis labels
    },
    tooltip: {
      fixed: { enabled: false },
      x: { show: false }
    }
  });

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [color],
      plotOptions: {
        ...prevState.plotOptions,
        bar: {
          ...prevState.plotOptions.bar,
          distributed: data?.length === 1,
          columnWidth: data?.length === 1 ? '40%' : '80%' // narrower if single bar
        }
      },
      yaxis: {
        min: 0,
        max: Math.max(...(data || [0])) * 1.2,
        labels: { show: false }
      },
      xaxis: {
        ...prevState.xaxis,
        labels: { show: false }
      },
      theme: { mode: mode === ThemeMode.DARK ? 'dark' : 'light' }
    }));
  }, [color, mode, data]);

  const series = [{ name: type, data: data || [] }];

  return <ReactApexChart options={options} series={series} type="bar" height={height || 50} />;
}

EcommerceDataChart.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
  data: PropTypes.array,
  type: PropTypes.string
};
