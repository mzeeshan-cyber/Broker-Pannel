import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher } from 'utils/axios';
import { columns } from 'pages/tables/broker-tables/trips/completedTripColumn';
import { resetFilter } from 'store/reducers/tripsSlice';
import { tripsData, paginationData } from 'store/reducers/tripsSlice';
import CircularLoader from 'components/common/loader/CircularLoader';
import ManageSharedTripButtonsOnTable from 'components/pages/trips/manageSharedTripButtonsOnTable';
import CompletedTripTable from 'pages/tables/broker-tables/trips/completedTripTable';

export default function NoShowTrips() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [normalizedTrips, setNormalizedTrips] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});

  const getTripsData = async (values) => {
    const today = new Date().toISOString().split("T")[0];
    let params;
    if (values) {
      params = values;
    } else if (Object.keys(activeFilters).length > 0) {
      params = activeFilters;
    } else {
      params = { date: today };
    }
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([key, value]) => value !== "" && value !== null)
    );
    setActiveFilters(cleanParams);
    try {
      setIsLoading(true);
      const response = await fetcher(["/trips/noshow", { params: cleanParams }]);
      if (response.status === true) {
        setIsLoading(false);
        dispatch(tripsData(response?.data?.trips?.data));
        dispatch(paginationData(response?.data?.trips));
      }
      else {
        setIsLoading(false);
        openSnackbar({
          open: true,
          message: response.message || 'data is fetched',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    }
    catch (error) {
      setIsLoading(false);
      openSnackbar({
        open: true,
        message: error.message || 'Server Error',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };
  const removeSingleFilter = (key) => {
    const updated = { ...activeFilters };
    delete updated[key];
    setActiveFilters(updated);
    getTripsData(updated);
  };

  // Pagination
  const handleChangePerPage = async (event) => {
    const per_page = Number(event.target.value);
    setPageSize(per_page);
    const response = await fetcher([
      "/trips/noshow",
      {
        params: {
          ...activeFilters,
          per_page
        }
      }
    ]);
    if (response.status === true) {
      dispatch(tripsData(response?.data?.trips?.data))
      dispatch(resetFilter(false))
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };
  const handleChangePagination = async (event, value) => {
    const currentPage = event.target.value ? event.target.value : value;
    setPage(currentPage);
    const response = await fetcher([
      "/trips/noshow",
      {
        params: {
          ...activeFilters,
          page: currentPage
        }
      }
    ]);
    if (response.status === true) {
      dispatch(tripsData(response?.data?.trips?.data))
      dispatch(resetFilter(false))
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };

  const TripState = useSelector(state => state?.trips)
  const tripsNewData = TripState?.tripsData;
  useEffect(() => {
    if (!tripsNewData) return;
    const normalized = tripsNewData.flatMap((item) => {
      // ------------------- SINGLE TRIP -------------------
      if (item.single_trip) {
        return [
          {
            ...item.single_trip,
            trip_type: 'single',
            trip_ids: [item.single_trip.id],
            isFirstInGroup: true
          }
        ];
      }
      // ------------------- ROUND TRIP -------------------
      else if (item.round_trip) {
        const allTripIds = item.round_trip.map(t => t.id);
        return item.round_trip.map((trip, index) => ({
          ...trip,
          trip_type: 'round trip',
          round_index: index,
          parent_trip_id: item.round_trip[0].id,
          trip_ids: allTripIds,
          isFirstInGroup: index === 0
        }));
      }
      // ------------------- SHARED TRIP -------------------
      else if (item.shared_trip) {
        const allTripIds = item.shared_trip.map(t => t.id);
        return item.shared_trip.map((trip, index) => ({
          ...trip,
          trip_type: 'shared',
          shared_index: index,
          parent_trip_id: item.shared_trip[0].id,
          trip_ids: allTripIds,
          isFirstInGroup: index === 0
        }));
      }
      // ------------------- SHARED RETURN TRIP -------------------
      else if (item.shared_return_trip) {
        const allTripIds = item.shared_return_trip.map(t => t.id);
        return item.shared_return_trip.map((trip, index) => ({
          ...trip,
          trip_type: 'shared_return_trip',
          shared_index: index,
          parent_trip_id: item.shared_return_trip[0].id,
          trip_ids: allTripIds,
          isFirstInGroup: index === 0
        }));
      }
      // ------------------- ROUND SHARED TRIP (4 TRIPS) -------------------
      else if (item.round_shared_trip) {
        const allTripIds = item.round_shared_trip.map(t => t.id);
        return item.round_shared_trip.map((trip, index) => ({
          ...trip,
          trip_type: 'round_shared_trip',
          parent_trip_id: item.round_shared_trip[0].id,
          shared_index: index,
          trip_ids: allTripIds,
          isFirstInGroup: index === 0
        }));
      }
      return [];
    });


    setNormalizedTrips(normalized);
  }, [tripsNewData]);

  useEffect(() => { getTripsData() }, [])

  return (
    <Grid>
      {isLoading ?
        <CircularLoader height='50vh' text='Loading trips...' />
        :
        <CompletedTripTable
          data={[...normalizedTrips]}
          paginationData={TripState?.paginationData}
          defaultColumns={columns}
          setPageSize={setPageSize}
          pageSize={pageSize}
          page={page}
          handleChangePerPage={handleChangePerPage}
          handleChangePagination={handleChangePagination}
          stackontable={<ManageSharedTripButtonsOnTable handleGetData={getTripsData} tableType="trips" activeFilters={activeFilters} removeSingleFilter={removeSingleFilter} />}
          tableName="noshow"
          getTripsData={getTripsData}
        />
      }
    </Grid>
  );
}
