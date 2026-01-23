import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import EcommerceDataCard from 'components/cards/EcommerceDataCard';
import WelcomeBanner from 'sections/dashboard/default/WelcomeBanner';
import ProjectAnalytics from 'sections/widget/chart/ProjectAnalytics';
import { useCallback, useEffect, useState } from 'react';
import { fetcherPost } from 'utils/axios';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';
import { Car, People, SmartCar, Personalcard } from 'iconsax-react';
import SkeletonCard from 'components/pages/dashboard/skeletonCard';
import ComplaintsOverview from 'sections/widget/chart/ComplaintsOverview';
import StandingOrders from 'sections/widget/chart/StandingOrders';
import InvoiceCharts from 'sections/widget/chart/InvoiceCharts';
import InvoiceChartsSkeleton from 'sections/widget/chart/InvoiceChartSkeleton';

export default function DashboardDefault() {
  const theme = useTheme();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const getInitialDateByFilter = useCallback((filter) => {
    const d = new Date();
    if (filter === 'weekly') d.setDate(d.getDate() - 7);
    else if (filter === 'monthly') d.setMonth(d.getMonth() - 1);
    else if (filter === 'yearly') d.setFullYear(d.getFullYear() - 1);
    return d;
  }, []);

  const formatLocalDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [patientsFilter, setPatientsFilter] = useState('weekly');
  const [providersFilter, setProvidersFilter] = useState('weekly');
  const [tripsFilter, setTripsFilter] = useState('weekly');
  const [reimbursementTripsFilter, setReimbursementreTripsFilter] = useState('weekly');
  const [patientsDate, setPatientsDate] = useState(
    getInitialDateByFilter(patientsFilter)
  );
  const [providersDate, setProvidersDate] = useState(
    getInitialDateByFilter(providersFilter)
  );
  const [tripsDate, setTripsDate] = useState(
    getInitialDateByFilter(tripsFilter)
  );
  const [reimbursementDate, setReimbursementDate] = useState(
    getInitialDateByFilter(reimbursementTripsFilter)
  );


  const [patients, setPatients] = useState([]);
  const [chartPatients, setChartPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [chartProviders, setChartProviders] = useState([]);
  const [trips, setTrips] = useState([]);
  const [chartTrips, setChartTrips] = useState([]);
  const [reimbursementTrips, setReimbursementTrips] = useState([]);
  const [chartReimbursementTrips, setChartReimbursementTrips] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [reimbursementLoading, setReimbursementLoading] = useState(false);

  // ==============================|| INTERVAL LOGIC ||============================== //

  const getIntervalRange = (base, type) => {
    const today = new Date();

    switch (type) {
      case 'weekly': {
        const baseCopy = new Date(base);
        const today = new Date();

        const dayOfWeek = baseCopy.getDay(); // 0 = Sunday
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        const from = new Date(baseCopy);
        from.setDate(baseCopy.getDate() + diffToMonday);

        const to = new Date(from);
        to.setDate(from.getDate() + 6);

        return {
          from_date: formatLocalDate(from),
          to_date: formatLocalDate(to > today ? today : to),
          isFutureDisabled: to >= today
        };
      }


      case 'monthly': {
        const from = new Date(base.getFullYear(), base.getMonth(), 1);
        const monthEnd = new Date(base.getFullYear(), base.getMonth() + 1, 0);
        const to = monthEnd > today ? today : monthEnd;

        return {
          from_date: formatLocalDate(from),
          to_date: formatLocalDate(to),
          isFutureDisabled: to >= today
        };
      }

      case 'yearly': {
        const from = new Date(base.getFullYear(), 0, 1);
        const yearEnd = new Date(base.getFullYear(), 11, 31);
        const to = yearEnd > today ? today : yearEnd;

        return {
          from_date: formatLocalDate(from),
          to_date: formatLocalDate(to),
          isFutureDisabled: to >= today
        };
      }

      default:
        throw new Error(`Unknown interval type: ${type}`);
    }
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
  const fetchData = async (endpoint, date, filter, setData, setChart, setLoading) => {
    setLoading(true);

    const { from_date, to_date } = getIntervalRange(date, filter);
    const payload = { from_date, to_date, type: filter };

    try {
      const response = await fetcherPost([endpoint, payload]);
      const resData = response?.status
        ? response.data
        : { data: [], total_count: 0, filter_count: 0 };

      setData(resData);
      setChart(aggregateChartData(resData.data, filter, from_date, to_date));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  // ==============================|| EFFECTS ||============================== //
  useEffect(() => {
    fetchData(
      '/patient-filters',
      patientsDate,
      patientsFilter,
      setPatients,
      setChartPatients,
      setPatientsLoading
    );
  }, [patientsDate, patientsFilter]);

  useEffect(() => {
    fetchData(
      '/provider-filters',
      providersDate,
      providersFilter,
      setProviders,
      setChartProviders,
      setProvidersLoading
    );
  }, [providersDate, providersFilter]);

  useEffect(() => {
    fetchData(
      '/trip-filters',
      tripsDate,
      tripsFilter,
      setTrips,
      setChartTrips,
      setTripsLoading
    );
  }, [tripsDate, tripsFilter]);

  useEffect(() => {
    fetchData(
      '/reimbursment-trip-filters',
      reimbursementDate,
      reimbursementTripsFilter,
      setReimbursementTrips,
      setChartReimbursementTrips,
      setReimbursementLoading
    );
  }, [reimbursementDate, reimbursementTripsFilter]);

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

  const patientsInterval = getIntervalRange(patientsDate, patientsFilter);
  const providersInterval = getIntervalRange(providersDate, providersFilter);
  const tripsInterval = getIntervalRange(tripsDate, tripsFilter);
  const reimbursementInterval = getIntervalRange(reimbursementDate, reimbursementTripsFilter);


  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}><WelcomeBanner /></Grid>

      {/* Patients Card */}
      <Grid item xs={12} sm={6} lg={3}>
        {patientsLoading ? <SkeletonCard /> :
          <EcommerceDataCard
            title="Patients"
            count={patients?.filter_count}
            countTotal={patients?.total_count}
            iconPrimary={<Personalcard />}
            color={'primary'}
            toDate={patientsInterval.to_date}
            fromDate={patientsInterval.from_date}
            selectedType={patientsFilter}
            // onTypeChange={setPatientsFilter}
            onTypeChange={(newFilter) => {
              setPatientsFilter(newFilter);
              setPatientsDate(getInitialDateByFilter(newFilter));
            }}
            onPrev={createPrevHandler(patientsDate, setPatientsDate, patientsFilter)}
            onNext={createNextHandler(patientsDate, setPatientsDate, patientsFilter)}
            disableNext={patientsInterval.isFutureDisabled}
          >
            <EcommerceDataChart
              color={theme.palette.primary.main}
              data={chartPatients}
              type={'Patients'}
              toDate={patientsInterval.to_date}
              fromDate={patientsInterval.from_date}
              filterType={patientsFilter}
            />
          </EcommerceDataCard>
        }
      </Grid>

      {/* Providers Card */}
      <Grid item xs={12} sm={6} lg={3}>
        {providersLoading ? <SkeletonCard /> :
          <EcommerceDataCard
            title="Providers"
            count={providers?.filter_count}
            countTotal={providers?.total_count}
            iconPrimary={<People />}
            color={'warning'}
            toDate={providersInterval.to_date}
            fromDate={providersInterval.from_date}
            selectedType={providersFilter}
            onTypeChange={(newFilter) => {
              setProvidersFilter(newFilter);
              setProvidersDate(getInitialDateByFilter(newFilter));
            }}

            onPrev={createPrevHandler(providersDate, setProvidersDate, providersFilter)}
            onNext={createNextHandler(providersDate, setProvidersDate, providersFilter)}
            disableNext={providersInterval.isFutureDisabled}
          >
            <EcommerceDataChart
              color={theme.palette.warning.main}
              data={chartProviders}
              type={'Providers'}
              toDate={providersInterval.to_date}
              fromDate={providersInterval.from_date}
              filterType={providersFilter} />
          </EcommerceDataCard>
        }
      </Grid>

      {/* trips Card */}
      <Grid item xs={12} sm={6} lg={3}>
        {tripsLoading ? <SkeletonCard /> :
          <EcommerceDataCard
            title="Trips"
            count={trips?.filter_count}
            countTotal={trips?.total_count}
            iconPrimary={<SmartCar />}
            color={'success'}
            toDate={tripsInterval.to_date}
            fromDate={tripsInterval.from_date}
            selectedType={tripsFilter}
            onTypeChange={(newFilter) => {
              setTripsFilter(newFilter);
              setTripsDate(getInitialDateByFilter(newFilter));
            }}
            onPrev={createPrevHandler(tripsDate, setTripsDate, tripsFilter)}
            onNext={createNextHandler(tripsDate, setTripsDate, tripsFilter)}
            disableNext={tripsInterval.isFutureDisabled}
          >
            <EcommerceDataChart
              color={theme.palette.success.main}
              data={chartTrips} type={'Trips'}
              toDate={tripsInterval.to_date}
              fromDate={tripsInterval.from_date}
              filterType={tripsFilter}
            />
          </EcommerceDataCard>
        }
      </Grid>

      {/* reimbursementTrips Card */}
      <Grid item xs={12} sm={6} lg={3}>
        {reimbursementLoading ? <SkeletonCard /> :
          <EcommerceDataCard
            title="Reimbursement Trips"
            count={reimbursementTrips?.filter_count}
            countTotal={reimbursementTrips?.total_count}
            iconPrimary={<Car />}
            color={'error'}
            toDate={reimbursementInterval.to_date}
            fromDate={reimbursementInterval.from_date}
            selectedType={reimbursementTripsFilter}
            onTypeChange={(newFilter) => {
              setReimbursementreTripsFilter(newFilter);
              setReimbursementDate(getInitialDateByFilter(newFilter));
            }}
            onPrev={createPrevHandler(reimbursementDate, setReimbursementDate, reimbursementTripsFilter)}
            onNext={createNextHandler(reimbursementDate, setReimbursementDate, reimbursementTripsFilter)}
            disableNext={reimbursementInterval.isFutureDisabled}
          >
            <EcommerceDataChart
              color={theme.palette.error.main}
              data={chartReimbursementTrips}
              type={'Reimbursement Trips'}
              toDate={reimbursementInterval.to_date}
              fromDate={reimbursementInterval.from_date}
              filterType={reimbursementTripsFilter}
            />
          </EcommerceDataCard>
        }
      </Grid>

      {/* Other Dashboard Sections */}
      <Grid item xs={12} md={4}>
        <ComplaintsOverview />
      </Grid>
      <Grid item xs={12} md={4}>
        <Stack spacing={3} sx={{ height: '100%' }}>
          <StandingOrders />
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        {loading ?
          <InvoiceChartsSkeleton />
          :
          <InvoiceCharts loading={loading} setLoading={setLoading} stats={stats} setStats={setStats} />
        }
      </Grid>
      <Grid item xs={12}><ProjectAnalytics loading={loading} setLoading={setLoading} stats={stats} setStats={setStats} /></Grid>
    </Grid>
  );
}
