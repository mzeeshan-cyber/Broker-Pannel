// material-ui
import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { driversData, driversPaginationData, filterValue } from 'store/reducers/driverSlice';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { loading, resetFilter } from 'store/reducers/patientSlice';
import AttendentTable from 'pages/tables/broker-tables/attendents/attendentTable';
import CircularLoader from 'components/common/loader/CircularLoader';


export default function Attendents() {
  const dispatch = useDispatch();
  const { patient_id } = useParams();
  const Loading = useSelector(state => state.patient.loading)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({});

  const getAttendentsBySearch = async (values) => {
    dispatch(loading(true));
    const params = {
      patient_id: patient_id || '',
      attendant_name: values?.attendant_name || '',
      phone_number: values?.phone_number || '',
      relationship: values?.relationship || '',
      status: values?.status || '',
      page:1,
      per_page: pageSize
    }
    setFilters(params)
    setPage(1)
    const response = await fetcher(["/patient-attendants", { params }]);
    if (response.status === true) {
      dispatch(loading(false));
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
      "/patient-attendants",
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
      "/patient-attendants",
      { params: { ...filters, page: 1, per_page } }
    ]);
    if (response.status === true) {
      dispatch(driversData(response?.data?.data))
      dispatch(driversPaginationData(response.data));
    }
  };
  const deleteAttendents = async (id) => {
    dispatch(loading(true));
    const response = await fetcherDelete([`/patient-attendants/${id}`]);
    if (response.status === 200) {
      getAttendentsBySearch()
      openSnackbar({
        open: true,
        message: 'Attendent deleted successfuly!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      dispatch(loading(false));

    }
  }
  const updateAttendents = async (id, data) => {
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

  useEffect(() => { getAttendentsBySearch() }, [])

  return (
    <Grid>
      {Loading ?
        <CircularLoader text='Loading patient attendants..' />
        :
        <AttendentTable handleDelete={deleteAttendents} handleUpdate={updateAttendents} handleGetBySearch={getAttendentsBySearch} handleChangePagination={handleChangePagination} handleChange={handleChange} pageSize={pageSize} page={page}/>
      }
    </Grid>
  );
}
