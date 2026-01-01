import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import EcommerceDataCard from 'components/cards/EcommerceDataCard';
import WelcomeBanner from 'sections/dashboard/default/WelcomeBanner';
import ProjectAnalytics from 'sections/widget/chart/ProjectAnalytics';
import ProjectOverview from 'sections/widget/chart/ProjectOverview';
import AssignUsers from 'sections/widget/statistics/AssignUsers';
import { Personalcard, UserAdd } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { fetcherPost } from 'utils/axios';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';

// Placeholder icons for new cards
import { CalendarTick, Money } from 'iconsax-react';

export default function DashboardDefault() {
  const theme = useTheme();

  // ==============================|| STATES ||============================== //
  const [patientsFilter, setPatientsFilter] = useState('monthly');
  const [providersFilter, setProvidersFilter] = useState('monthly');
  const [appointmentsFilter, setAppointmentsFilter] = useState('monthly');
  const [revenueFilter, setRevenueFilter] = useState('monthly');

  const [patientsDate, setPatientsDate] = useState(new Date());
  const [providersDate, setProvidersDate] = useState(new Date());
  const [appointmentsDate, setAppointmentsDate] = useState(new Date());
  const [revenueDate, setRevenueDate] = useState(new Date());

  const [patients, setPatients] = useState([]);
  const [chartPatients, setChartPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [chartProviders, setChartProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [chartAppointments, setChartAppointments] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [chartRevenue, setChartRevenue] = useState([]);

  // ==============================|| INTERVAL LOGIC ||============================== //
  const getIntervalRange = (base, type) => {
  const today = new Date();
  let from = new Date(base);
  let to = new Date(base);

  switch (type) {
    case 'weekly':
      const dayOfWeek = from.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      from.setDate(from.getDate() + diffToMonday);
      to = new Date(from);
      to.setDate(from.getDate() + 6);
      break;

    case 'monthly':
      from = new Date(from.getFullYear(), from.getMonth(), 1);
      to = new Date(from.getFullYear(), from.getMonth() + 1, 0);
      break;

    case 'yearly':
      from = new Date(from.getFullYear(), 0, 1);
      to = new Date(from.getFullYear(), 11, 31);
      break;
  }

  // Clamp 'to' to today
  if (to > today) to = today;

  // Ensure from is never after to
  if (from > to) from = new Date(to);

  return {
    from_date: from.toISOString().split('T')[0],
    to_date: to.toISOString().split('T')[0],
    isFutureDisabled: to >= today
  };
};

  // ==============================|| AGGREGATE CHART DATA ||============================== //
  const aggregateChartData = (data = [], filter, fromDate, toDate) => {
    if (filter === 'weekly') {
      const from = new Date(fromDate);
      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(from);
        day.setDate(from.getDate() + i);
        return data
          .filter(d => d.date && new Date(d.date).toDateString() === day.toDateString())
          .reduce((sum, d) => sum + (d.count ?? 0), 0);
      });
    }

    if (filter === 'monthly') {
      const from = new Date(fromDate);
      const daysInMonth = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const dayNum = i + 1;
        return data
          .filter(d => d.date && new Date(d.date).getDate() === dayNum)
          .reduce((sum, d) => sum + (d.count ?? 0), 0);
      });
    }

    if (filter === 'yearly') {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const monthsDiff = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
      const result = Array(monthsDiff).fill(0);

      data.forEach(d => {
        if (!d.month) return;
        const [y, m] = d.month.trim().split('-').map(Number);
        const monthDate = new Date(y, m - 1, 1);
        if (monthDate >= from && monthDate <= to) {
          const index = (y - from.getFullYear()) * 12 + (m - 1 - from.getMonth());
          result[index] += d.count ?? 0;
        }
      });

      const allZeros = result.every(num => num === 0);
      if (allZeros) return data.map(item => item.count);
      return result;
    }

    return [];
  };

  // ==============================|| FETCH DATA FUNCTIONS ||============================== //
  const fetchData = async (endpoint, date, filter, setData, setChart) => {
    const { from_date, to_date } = getIntervalRange(date, filter);
    const payload = { from_date, to_date, type: filter };
    const response = await fetcherPost([endpoint, payload]);
    const resData = response?.status ? response.data : { data: [], total_count: 0, filter_count: 0 };
    setData(resData);
    setChart(aggregateChartData(resData.data, filter, from_date, to_date));
  };

  // ==============================|| EFFECTS ||============================== //
  useEffect(() => { fetchData('/patient-filters', patientsDate, patientsFilter, setPatients, setChartPatients); }, [patientsDate, patientsFilter]);
  useEffect(() => { fetchData('/provider-filters', providersDate, providersFilter, setProviders, setChartProviders); }, [providersDate, providersFilter]);
  useEffect(() => { fetchData('/appointment-filters', appointmentsDate, appointmentsFilter, setAppointments, setChartAppointments); }, [appointmentsDate, appointmentsFilter]);
  useEffect(() => { fetchData('/revenue-filters', revenueDate, revenueFilter, setRevenue, setChartRevenue); }, [revenueDate, revenueFilter]);

  // ==============================|| INTERVAL HANDLERS ||============================== //
  const createPrevHandler = (dateState, setDate, filter) => () => {
    const date = new Date(dateState);
    if (filter === 'weekly') date.setDate(date.getDate() - 7);
    else if (filter === 'monthly') date.setMonth(date.getMonth() - 1);
    else if (filter === 'yearly') date.setFullYear(date.getFullYear() - 1);
    setDate(date);
  };

  const createNextHandler = (dateState, setDate, filter) => () => {
    const date = new Date(dateState);
    if (filter === 'weekly') date.setDate(date.getDate() + 7);
    else if (filter === 'monthly') date.setMonth(date.getMonth() + 1);
    else if (filter === 'yearly') date.setFullYear(date.getFullYear() + 1);

    const { to_date } = getIntervalRange(date, filter);
    if (new Date(to_date) > new Date()) return;
    setDate(date);
  };

  // ==============================|| RENDER ||============================== //
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}><WelcomeBanner /></Grid>

      {/* Patients Card */}
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Patients"
          count={patients?.filter_count}
          countTotal={patients?.total_count}
          iconPrimary={<Personalcard />}
          toDate={getIntervalRange(patientsDate, patientsFilter).to_date}
          fromDate={getIntervalRange(patientsDate, patientsFilter).from_date}
          selectedType={patientsFilter}
          onTypeChange={setPatientsFilter}
          onPrev={createPrevHandler(patientsDate, setPatientsDate, patientsFilter)}
          onNext={createNextHandler(patientsDate, setPatientsDate, patientsFilter)}
          disableNext={getIntervalRange(patientsDate, patientsFilter).isFutureDisabled}
        >
          <EcommerceDataChart color={theme.palette.primary.main} data={chartPatients} type={patientsFilter} />
        </EcommerceDataCard>
      </Grid>

      {/* Providers Card */}
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Providers"
          count={providers?.filter_count}
          countTotal={providers?.total_count}
          iconPrimary={<UserAdd />}
          toDate={getIntervalRange(providersDate, providersFilter).to_date}
          fromDate={getIntervalRange(providersDate, providersFilter).from_date}
          selectedType={providersFilter}
          onTypeChange={setProvidersFilter}
          onPrev={createPrevHandler(providersDate, setProvidersDate, providersFilter)}
          onNext={createNextHandler(providersDate, setProvidersDate, providersFilter)}
          disableNext={getIntervalRange(providersDate, providersFilter).isFutureDisabled}
        >
          <EcommerceDataChart color={theme.palette.warning.main} data={chartProviders} type={providersFilter} />
        </EcommerceDataCard>
      </Grid>

      {/* Appointments Card */}
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Appointments"
          count={appointments?.filter_count}
          countTotal={appointments?.total_count}
          iconPrimary={<CalendarTick />}
          toDate={getIntervalRange(appointmentsDate, appointmentsFilter).to_date}
          fromDate={getIntervalRange(appointmentsDate, appointmentsFilter).from_date}
          selectedType={appointmentsFilter}
          onTypeChange={setAppointmentsFilter}
          onPrev={createPrevHandler(appointmentsDate, setAppointmentsDate, appointmentsFilter)}
          onNext={createNextHandler(appointmentsDate, setAppointmentsDate, appointmentsFilter)}
          disableNext={getIntervalRange(appointmentsDate, appointmentsFilter).isFutureDisabled}
        >
          <EcommerceDataChart color={theme.palette.warning.main} data={chartAppointments} type={appointmentsFilter} />
        </EcommerceDataCard>
      </Grid>

      {/* Revenue Card */}
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Revenue"
          count={revenue?.filter_count}
          countTotal={revenue?.total_count}
          iconPrimary={<Money />}
          toDate={getIntervalRange(revenueDate, revenueFilter).to_date}
          fromDate={getIntervalRange(revenueDate, revenueFilter).from_date}
          selectedType={revenueFilter}
          onTypeChange={setRevenueFilter}
          onPrev={createPrevHandler(revenueDate, setRevenueDate, revenueFilter)}
          onNext={createNextHandler(revenueDate, setRevenueDate, revenueFilter)}
          disableNext={getIntervalRange(revenueDate, revenueFilter).isFutureDisabled}
        >
          <EcommerceDataChart color={theme.palette.error.main} data={chartRevenue} type={revenueFilter} />
        </EcommerceDataCard>
      </Grid>

      {/* Other Dashboard Sections */}
      <Grid item xs={12}><ProjectAnalytics /></Grid>
      <Grid item xs={12} md={8} lg={9}><ProjectOverview /></Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Stack spacing={3} sx={{ height: '100%' }}>
          <AssignUsers />
        </Stack>
      </Grid>
    </Grid>
  );
}
