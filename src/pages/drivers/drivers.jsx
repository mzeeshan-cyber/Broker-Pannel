// material-ui
import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher } from 'utils/axios';
import { loading, providerDriverData, providerDriverPaginationData, resetFilter } from 'store/reducers/providerDriversSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/providers/drivers/providerDriverTableColumn';
import { useParams } from 'react-router';
import ProviderPersonalInfo from 'components/pages/providers/provider-personal-info/provider-personal-info';

export default function Drivers() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [providerData, setProviderData] = useState({});
  const dispatch = useDispatch();
  const { provider_id } = useParams()

  const getProvidersDriverData = async (values) => {
    dispatch(loading(true));
    const params = {
      status: values?.status,
      vehicle_assigned: values?.vehicle_assigned,
    }
    const response = await fetcher([`/get-provider-drivers?provider_id=${provider_id}&per_page=${pageSize}`, { params }]);
    if (response.status === true) {
      dispatch(loading(false));
      dispatch(providerDriverData(response?.data?.data));
      dispatch(providerDriverPaginationData(response?.data));
      if (values) {
        dispatch(resetFilter(true))
      }
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };

  const FetchSingleProvider = async () => {
    dispatch(loading(true));
    const response = await fetcher(`/provider/${provider_id}`);
    if (response.status === true) {
      setProviderData(response?.data);
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
      dispatch(loading(false));
    }
  }

  // Pagination
  const handleChangePerPage = async (event) => {
    setPageSize(Number(event.target.value));
    const per_page = Number(event.target.value);
    const response = await fetcher([`/providers?per_page=${per_page}`]);
    if (response.status === true) {
      dispatch(providerDriverData(response?.data?.data))
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
    const response = await fetcher([`/providers?page=${eventValue ? eventValue : value}`]);
    if (response.status === true) {
      dispatch(providerDriverData(response?.data?.data))
      dispatch(resetFilter(false))
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };

  const porvidersDriverState = useSelector(state => state?.providerDriver)
  const Loading = porvidersDriverState.loading;
  const providerDriversData = porvidersDriverState?.providerDriverData;

  useEffect(() => { getProvidersDriverData(); FetchSingleProvider(); }, [])

  return (
    <Grid>
      {Loading ?
        <Loader />
        :
        <>
          <ProviderPersonalInfo providerData={providerData}/>
          <CommonTable
            data={providerDriversData}
            paginationData={porvidersDriverState?.providerDriverPaginationData}
            defaultColumns={columns}
            setPageSize={setPageSize}
            pageSize={pageSize}
            page={page}
            handleChangePerPage={handleChangePerPage}
            handleChangePagination={handleChangePagination}
          />
        </>
      }
    </Grid>
  );
}
