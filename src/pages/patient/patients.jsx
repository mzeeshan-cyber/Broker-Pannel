import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import PatientsTable from 'pages/tables/broker-tables/patients/patientsTable';
import { useDispatch, useSelector } from 'react-redux';
import { filterValue, loading, patientsData, patientsDataAfterDelete, patientsPaginationData, submitting } from 'store/reducers/patientSlice';
import { useNavigate } from 'react-router';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function Patient() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({});
  const FetchingData = useSelector(state => state?.patient?.loading)

  const getPatientsBySearch = async (values = {}) => {
    dispatch(loading(true));
    const query = {
      name: values?.name || '',
      phone_number: values?.phone_number || '',
      social_security_number: values?.social_security_number || '',
      medicaid_number: values?.medicaid_number || '',
      city: values?.city || '',
      gender: values?.gender?.value || '',
      mobility: values?.mobility?.value || '',
      funding_source: values?.funding_source?.value || '',
      page:1,
      per_page: pageSize
    };
    setFilters(query);
    setPage(1);
    const response = await fetcher([
      "/search-patients",
      { params: query }
    ]);
    if (response.status === true) {
      dispatch(loading(false));
      dispatch(filterValue(values));
      dispatch(patientsData(response.data.data || []));
      dispatch(patientsPaginationData(response.data));
    }
  };

  const handleChangePagination = async (event, value) => {
    const pageNumber = event?.target?.value
      ? Number(event.target.value)
      : value;
    setPage(pageNumber);
    const response = await fetcher([
      "/search-patients",
      { params: { ...filters, page: pageNumber, per_page: pageSize } }
    ]);
    if (response.status === true) {
      dispatch(patientsData(response.data.data));
      dispatch(patientsPaginationData(response.data));
    }
  };

  const handleChange = async (event) => {
    const per_page = Number(event.target.value);
    setPageSize(per_page);
    setPage(1);
    const response = await fetcher([
      "/search-patients",
      { params: { ...filters, page: 1, per_page } }
    ]);
    if (response.status === true) {
      dispatch(patientsData(response.data.data));
      dispatch(patientsPaginationData(response.data));
    }
  };

  const deletePatient = async (id) => {
    dispatch(submitting(true))
    const response = await fetcherDelete(`/patient/${id}`)
    if (response.status === 200) {
      dispatch(patientsDataAfterDelete({ id }))
      openSnackbar({
        open: true,
        message: 'Patient deleted successfuly!',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
      dispatch(submitting(false))
    }
  }

  const updatePatient = async (id, patientData) => {
    const response = await fetcherUpdate(`/patient/${id}`, patientData)
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: 'Patient updated successfuly!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      setTimeout(() => {
        navigate('/patients')
      }, 1500);
    }
  }

  useEffect(() => { getPatientsBySearch() }, [])

  return (
    <Grid>
      {FetchingData ?
        <CircularLoader text='Loading patients..' />
        :
        <PatientsTable handleDelete={deletePatient} handleUpdate={updatePatient} getPatientsBySearch={getPatientsBySearch} handleChangePagination={handleChangePagination} handleChange={handleChange} setPageSize={setPageSize} setPage={setPage} pageSize={pageSize} page={page} />
      }
    </Grid>
  );
}
