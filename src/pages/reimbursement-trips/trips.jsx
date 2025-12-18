import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { loading, reimbursementTripData, paginationData, reimbursementTripDataAfterDelete } from 'store/reducers/reimbursementTripSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/reimbursement-trip/ReimbursementTripColumn';
import { resetFilter } from 'store/reducers/patientSlice';
import TripButtonsOnTable from 'components/pages/reimbursement-trips/TripButtonsOnTable';
import CircularLoader from 'components/common/loader/CircularLoader';
import { Box } from '@mui/material';

export default function ReimbursementTrips() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const getReimbursementData = async (values) => {
    setIsLoading(true);
    const params = {
      name: values?.name,
      phone_number: values?.phone_number,
      email: values?.email,
    }
    try {
      const response = await fetcher(["/fetch-reimbursement-trip", { params }]);
      if (response.status === true) {
        setIsLoading(false);
        dispatch(reimbursementTripData(response?.data?.data));
        dispatch(paginationData(response?.data));

        if (values) {
          dispatch(resetFilter(true));
        }
      } else {
        setIsLoading(false);
        openSnackbar({
          open: true,
          message: response.message || 'Failed to fetch data',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    } catch (error) {
      setIsLoading(false);
      openSnackbar({
        open: true,
        message: error.message || 'Something went wrong',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }

  };
  const deleteReimbursementTrip = async (id) => {
    dispatch(loading(true));
    const response = await fetcherDelete([`/delete-reimbursement-trip/${id}`]);
    if (response.status === 200) {
      dispatch(loading(false));
      dispatch(reimbursementTripDataAfterDelete(id));
      openSnackbar({
        open: true,
        message: 'Reimbursement Trip deleted successfuly!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    }
  }
  const updateReimbursementTrip = async (id, data) => {
    const response = await fetcherUpdate(`/update-reimbursement-trip/${id}`, JSON.stringify(data))
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: 'Reimbursement Trip updated successfuly!',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
    }
  }

  // Pagination
  const handleChangePerPage = async (event) => {
    setPageSize(Number(event.target.value));
    const per_page = Number(event.target.value);
    setIsLoading(true);
    try {
      const response = await fetcher([`/fetch-reimbursement-trip?per_page=${per_page}`]);
      if (response.status === true) {
        dispatch(reimbursementTripData(response?.data?.data))
        dispatch(resetFilter(false))
        setIsLoading(false);
      }
      else {
        setIsLoading(false);
        openSnackbar({
          open: true,
          message: response.message || 'Failed to fetch data',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    } catch (error) {
      setIsLoading(false);
      openSnackbar({
        open: true,
        message: error.message || 'Something went wrong',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };
  const handleChangePagination = async (event, value) => {
    const eventValue = event.target.value;
    setPage(eventValue ? eventValue : value);
    setIsLoading(true);
    try {
      const response = await fetcher([`/fetch-reimbursement-trip?page=${eventValue ? eventValue : value}`]);
      if (response.status === true) {
        dispatch(reimbursementTripData(response?.data?.data))
        dispatch(resetFilter(false))
        setIsLoading(false);
      }
      else {
        setIsLoading(false);
        openSnackbar({
          open: true,
          message: response.message || 'Failed to fetch data',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    } catch (error) {
      setIsLoading(false);
      openSnackbar({
        open: true,
        message: error.message || 'Something went wrong',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };

  const TripState = useSelector(state => state?.reimmbursementTrip)
  const reimbursementTripsData = TripState?.reimbursementTripData;

  useEffect(() => { getReimbursementData() }, [])

  return (
    <Grid>
      {isLoading ?
        <CircularLoader text='Loading data...' height='40vh' />
        :
        <CommonTable
          data={[...reimbursementTripsData].reverse()}
          paginationData={TripState?.paginationData}
          defaultColumns={columns}
          setPageSize={setPageSize}
          pageSize={pageSize}
          page={page}
          handleChangePerPage={handleChangePerPage}
          handleChangePagination={handleChangePagination}
          handleDelete={deleteReimbursementTrip}
          handleUpdate={updateReimbursementTrip}
          stackontable={<TripButtonsOnTable handleGetData={getReimbursementData} tableType="reimbursement-trip" />}
          tableName="reimbursement-trip"
        />
      }
    </Grid>
  );
}
