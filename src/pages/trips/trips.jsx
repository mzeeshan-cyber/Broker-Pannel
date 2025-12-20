import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { loading, tripDataAfterDelete } from 'store/reducers/tripsSlice';
import { columns } from 'pages/tables/broker-tables/trips/TripsColumns';
import { resetFilter } from 'store/reducers/patientSlice';
import TripButtonsOnTable from 'components/pages/trips/tripButtonsOnTable';
import { tripsData, paginationData } from 'store/reducers/tripsSlice';
import CircularLoader from 'components/common/loader/CircularLoader';
import TripTable from 'pages/tables/broker-tables/trips/TripTable';

export default function Trips() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [normalizedTrips, setNormalizedTrips] = useState([]);

  const getTripsData = async (values) => {
    const params = {
      name: values?.name,
      phone_number: values?.phone_number,
      email: values?.email,
    }
    try {
      setIsLoading(true);
      const response = await fetcher(["/fetch-trips", { params }]);
      if (response.status === true) {
        setIsLoading(false);
        dispatch(tripsData(response?.data?.data));
        dispatch(paginationData(response?.data));
        if (values) {
          dispatch(resetFilter(true))
        }
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

  // Pagination
  const handleChangePerPage = async (event) => {
    setPageSize(Number(event.target.value));
    const per_page = Number(event.target.value);
    const response = await fetcher([`/fetch-trips?per_page=${per_page}`]);
    if (response.status === true) {
      dispatch(tripsData(response?.data?.data))
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
    const eventValue = event.target.value;
    setPage(eventValue ? eventValue : value);
    const response = await fetcher([`/fetch-trips?page=${eventValue ? eventValue : value}`]);
    if (response.status === true) {
      dispatch(tripsData(response?.data?.data))
      dispatch(resetFilter(false))
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };
  
  const deleteTrip = async (id) => {
    dispatch(loading(true));
    const response = await fetcherDelete([`/delete-trip/${id}`]);
    if (response.status === 200) {
      dispatch(loading(false));
      dispatch(tripDataAfterDelete(id));
      openSnackbar({
        open: true,
        message: 'Trip deleted successfuly!',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
    }
  }
  const updateTrip = async (id, data) => {
    try {
      const response = await fetcherUpdate(`/update-trip/${id}`, JSON.stringify(data))
      if (response.status === 200) {
        openSnackbar({
          open: true,
          message: 'Trip updated successfuly!',
          variant: 'alert',

          alert: {
            color: 'success'
          }
        });
      }
    }
    catch (error) {
      openSnackbar({
        open: true,
        message: error.message || 'Trip updated successfuly!',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    }
  }

  const TripState = useSelector(state => state?.trips)
  const tripsNewData = TripState?.tripsData;
  useEffect(() => {
    const normalized = tripsNewData.flatMap((item) => {
      if (item.single_trip) {
        return [{ ...item.single_trip, trip_type: 'single', isFirstInGroup: true }];
      } else if (item.round_trip) {
        return item.round_trip.map((trip, index) => ({
          ...trip,
          trip_type: 'round trip',
          round_index: index,
          parent_trip_id: item.round_trip[0].id,
          isFirstInGroup: index === 0,
        }));
      } else if (item.shared_trip) {
        return item.shared_trip.map((trip, index) => ({
          ...trip,
          trip_type: 'shared',
          shared_index: index,
          parent_trip_id: item.shared_trip[0].id,
          isFirstInGroup: index === 0,
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
        <TripTable
          data={[...normalizedTrips].reverse()}
          paginationData={TripState?.paginationData}
          defaultColumns={columns}
          setPageSize={setPageSize}
          pageSize={pageSize}
          page={page}
          handleChangePerPage={handleChangePerPage}
          handleChangePagination={handleChangePagination}
          handleDelete={deleteTrip}
          handleUpdate={updateTrip}
          stackontable={<TripButtonsOnTable handleGetData={getTripsData} tableType="trips" />}
          tableName="trips"
          nestedTable={true}
        />
      }
    </Grid>
  );
}
