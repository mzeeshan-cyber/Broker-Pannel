// material-ui
import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { loading, providerData, providerPaginationData } from 'store/reducers/providerSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/providers/providerTableColumn';
import ProviderButtonsOnTable from 'components/pages/providers/ProviderButtonsOnTable';
import { resetFilter } from 'store/reducers/patientSlice';
import CircularLoader from 'components/common/loader/CircularLoader';

// ==============================|| DASHBOARD - DEFAULT ||============================== //
export default function Provider() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const getProviderData = async (values) => {
    dispatch(loading(true));
    const params = {
      name: values?.name,
      company_phone: values?.phone_number,
      email: values?.email,
    }
    const response = await fetcher(["/providers", { params }]);
    if (response.status === true) {
      dispatch(loading(false));
      dispatch(providerData(response?.data?.data));
      dispatch(providerPaginationData(response?.data));
    }
  };
  const deleteProvider = async (id) => {
    dispatch(loading(true));
    const response = await fetcherDelete([`/provider/${id}`]);
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: 'Provider deleted successfuly!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      dispatch(loading(false));
      getProviderData()

    }
  }
  const updateProvider = async (id, data) => {
    const response = await fetcherUpdate(`/patient/${id}`, JSON.stringify(data))
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: 'Provider updated successfuly!',
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
    const response = await fetcher([`/providers?per_page=${per_page}`]);
    if (response.status === true) {
      dispatch(providerData(response?.data?.data))
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
    const response = await fetcher([`/providers?page=${eventValue ? eventValue : value}`]);
    if (response.status === true) {
      dispatch(providerData(response?.data?.data))
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };

  const providerState = useSelector(state => state?.provider)
  const isLoading = providerState.loading;
  const providerStateData = providerState.providerData;

  useEffect(() => { getProviderData() }, [])
  return (
    <Grid>
      {isLoading ?
        <CircularLoader text='Loading providers..' />
        :
        <CommonTable
          data={providerStateData}
          paginationData={providerState?.providerPaginationData}
          defaultColumns={columns}
          setPageSize={setPageSize}
          pageSize={pageSize}
          page={page}
          handleChangePerPage={handleChangePerPage}
          handleChangePagination={handleChangePagination}
          handleDelete={deleteProvider}
          handleUpdate={updateProvider}
          stackontable={<ProviderButtonsOnTable handleGetData={getProviderData} tableType="provider" />}
          tableName="provider"
          
        />
      }
    </Grid>
  );
}
