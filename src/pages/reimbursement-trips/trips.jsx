import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { loading, reimbursementTripData, paginationData, reimbursementTripDataAfterDelete } from 'store/reducers/reimbursementTripSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/reimbursement-trip/ReimbursementTripColumn';
import TripButtonsOnTable from 'components/pages/reimbursement-trips/TripButtonsOnTable';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function ReimbursementTrips() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const getReimbursementData = async (values = {}) => {
    setIsLoading(true);
    const query = {
      name: values?.name || '',
      phone_number: values?.phone_number || '',
      email: values?.email || '',
      page,
      per_page: pageSize
    };
    setFilters(query);
    const response = await fetcher([
      "/fetch-reimbursement-trip",
      { params: query }
    ]);
    if (response.status === true) {
      setIsLoading(false);
      dispatch(reimbursementTripData(response?.data?.data));
      dispatch(paginationData(response?.data));
    }
  };
  const handleChangePerPage = async (event) => {
    const per_page = Number(event.target.value);

    setPageSize(per_page);
    setPage(1);

    const response = await fetcher([
      "/fetch-reimbursement-trip",
      { params: { ...filters, page: 1, per_page } }
    ]);

    if (response.status === true) {
      dispatch(reimbursementTripData(response?.data?.data));
      dispatch(paginationData(response?.data));
    }
  };
  const handleChangePagination = async (event, value) => {
    setPage(value);

    const response = await fetcher([
      "/fetch-reimbursement-trip",
      { params: { ...filters, page: value, per_page: pageSize } }
    ]);

    if (response.status === true) {
      dispatch(reimbursementTripData(response?.data?.data));
      dispatch(paginationData(response?.data));
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
