import { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function EcommerceDataChart({ color, height = 50, data = [], type, filterType, fromDate, toDate }) {
  console.log(fromDate, toDate)

  // Normalize data: 0 → tiny bar
  const normalizedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [0];
    return data.map(d => {
      const val = typeof d === 'number' ? d : d?.count ?? 0;
      return val === 0 ? 0.06 : val; // tiny bar
    });
  }, [data]);

  // Tooltip labels
  const tooltipLabels = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map(d => {
      if (!d) return '';
      if (filterType === 'weekly') {
        const date = new Date(d.date ?? d);
        return date.toLocaleString('en-US', { weekday: 'short' });
      }
      if (filterType === 'monthly') {
        const date = new Date(d.date ?? d);
        return date.toLocaleString('en-US', { month: 'short' });
      }
      if (filterType === 'yearly') {
        return d.year ?? d.month?.split('-')[0] ?? d;
      }
      return '';
    });
  }, [data, filterType]);

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
        distributed: normalizedData.length === 1
      }
    },
    xaxis: { labels: { show: false }, crosshairs: { width: 1 } },
    yaxis: { min: 0, labels: { show: false } },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = Array.isArray(data) ? (data[dataPointIndex]?.count ?? data[dataPointIndex] ?? 0) : 0;
        const label = tooltipLabels[dataPointIndex] ?? '';
        return `
          <div style="
            background: white; 
            color: #0d161fff; 
            border-radius: 8px; 
            padding: 6px 10px; 
            font-size: 12px; 
            font-family: Inter, sans-serif;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          ">
            <strong>${type}</strong>: ${value}
          </div>
        `;
      }
    },
    colors: [color]
  });

  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      plotOptions: {
        ...prev.plotOptions,
        bar: {
          ...prev.plotOptions.bar,
          distributed: normalizedData.length === 1,
          columnWidth: normalizedData.length === 1 ? '40%' : '80%'
        }
      },
      yaxis: {
        min: 0,
        max: Math.max(...normalizedData, 1),
        labels: { show: false }
      }
    }));
  }, [color, normalizedData]);

  const series = [{ name: type, data: normalizedData }];

  return <ReactApexChart options={options} series={series} type="bar" height={height} />;
}
