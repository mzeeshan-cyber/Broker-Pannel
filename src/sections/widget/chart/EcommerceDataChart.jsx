import { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function EcommerceDataChart({ color, height = 50, data = [], type, filterType, fromDate, toDate }) {

  function generateLabels(fromDate, toDate, filterType) {
    const start = new Date(fromDate);
    const end = new Date(toDate);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const labels = [];

    if (filterType === "yearly") {
      // Generate months from fromDate to toDate
      let current = new Date(start.getFullYear(), start.getMonth(), 1);
      while (current <= end) {
        labels.push(monthNames[current.getMonth()]);
        current.setMonth(current.getMonth() + 1);
      }
    } else if (filterType === "monthly") {
      // Show days for monthly data
      let current = new Date(start);
      while (current <= end) {
        labels.push(`${monthNames[current.getMonth()]} ${current.getDate()}`);
        current.setDate(current.getDate() + 1);
      }
    } else if (filterType === "weekly") {
      // Show weekdays for weekly data
      return weekDays;
    }

    return labels;
  }

  // Generate labels for the tooltip
  // Generate chartLabels aligned with data
  const chartLabels = useMemo(() => {
    const labels = generateLabels(fromDate, toDate, filterType);
    console.log(labels)

    if (!Array.isArray(data) || data.length === 0) return labels;

    // Map labels to data points
    return data.map((d, index) => {
      const val = typeof d === 'number' ? d : d?.count ?? 0;

      // For zero values, still keep the label from `labels`
      return labels[index] ?? '';
    });
  }, [fromDate, toDate, filterType, data]);


  // Normalize data
  const normalizedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [0];
    return data.map(d => {
      const val = typeof d === 'number' ? d : d?.count ?? 0;
      return val === 0 ? 0.06 : val; // tiny bar for zero
    });
  }, [data]);

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
        const value = normalizedData[dataPointIndex] ?? 0;
        const label = chartLabels[dataPointIndex] ?? '';
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
            <strong>${label}</strong>: ${type} ${value < 1 ? 0 :value}
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
