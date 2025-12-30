// material-ui
import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { filterValue, resetFilter } from 'store/reducers/driverSlice';
import ReimbursementTable from 'pages/tables/broker-tables/drivers/reimbursementTable';
import { useParams } from 'react-router';
import { driversData, driversPaginationData } from 'store/reducers/driverSlice';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import CircularLoader from 'components/common/loader/CircularLoader';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function ReimbursementDrivers() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({});
  const { id } = useParams();

  const getDriversBySearch = async (values) => {
    setIsLoading(true);
    const params = {
      patient_id: id || '',
      driver_name: values?.driver_name || '',
      phone_number: values?.phone_number || '',
      status: values?.status || '',
      license_state: values?.license_state || '',
      page:1,
      per_page: pageSize

    }
    setFilters(params);
    setPage(1);
    const response = await fetcher(["/reimbursement-drivers", { params }]);

    if (response.status === true) {
      setIsLoading(false);
      dispatch(filterValue(values));
      dispatch(driversData(response?.data?.data || []));
      dispatch(driversPaginationData(response?.data));
    }
  };
  const handleChangePagination = async (event, value) => {
    const pageNumber = event?.target?.value
      ? Number(event.target.value)
      : value;
    setPage(pageNumber);
    const response = await fetcher([
      "/reimbursement-drivers",
      { params: { ...filters, page: pageNumber, per_page: pageSize } }
    ]);
    if (response.status === true) {
      dispatch(driversData(response?.data?.data))
      dispatch(driversPaginationData(response.data));
    }
  };

  const handleChange = async (event) => {
    const per_page = Number(event.target.value);
    setPageSize(per_page);
    setPage(1);
    const response = await fetcher([
      "/reimbursement-drivers",
      { params: { ...filters, page: 1, per_page } }
    ]);
    if (response.status === true) {
      dispatch(driversData(response?.data?.data))
      dispatch(driversPaginationData(response.data));
    }
  };
  const deleteReimbursementDrivers = async (id) => {
    setIsLoading(true);
    const response = await fetcherDelete([`/reimbursement-driver/${id}`]);
    if (response.status === 200) {
      getDriversBySearch()
      openSnackbar({
        open: true,
        message: 'Patient deleted successfuly!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      setIsLoading(false);

    }
  }
  const updateReimbursementDriver = async (id, data) => {
    const response = await fetcherUpdate(`/patient/${id}`, JSON.stringify(data))
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: 'Driver updated successfuly!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    }
  }

  useEffect(() => { getDriversBySearch() }, [])

  return (
    <Grid>
      {isLoading ?
        <CircularLoader text='Loading reimbursement drivers..' />
        :
        <ReimbursementTable handleDelete={deleteReimbursementDrivers} handleUpdate={updateReimbursementDriver} handleGetBySearch={getDriversBySearch} handleChangePagination={handleChangePagination} handleChange={handleChange} pageSize={pageSize} page={page} />
      }
    </Grid>
  );
}
