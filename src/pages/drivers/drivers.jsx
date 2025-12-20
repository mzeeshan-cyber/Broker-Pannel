// material-ui
import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher } from 'utils/axios';
import { loading, providerDriverData, providerDriverPaginationData } from 'store/reducers/providerDriversSlice';
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
  const [filters, setFilters] = useState({});

  const getProvidersDriverData = async (values = {}) => {
    dispatch(loading(true));
    const query = {
      status: values?.status,
      provider_id: provider_id,
      vehicle_assigned: values?.vehicle_assigned,
      page,
      per_page: pageSize
    };
    setFilters(query);
    const response = await fetcher([
      "/get-provider-drivers",
      { params: query }
    ]);
    if (response.status === true) {
      dispatch(loading(false));
      dispatch(providerDriverData(response?.data?.data));
      dispatch(providerDriverPaginationData(response?.data));
    }
  };
  const handleChangePerPage = async (event) => {
    const per_page = Number(event.target.value);

    setPageSize(per_page);
    setPage(1);

    const response = await fetcher([
      "/get-provider-drivers",
      { params: { ...filters, page: 1, per_page } }
    ]);

    if (response.status === true) {
      dispatch(providerDriverData(response?.data?.data));
      dispatch(providerDriverPaginationData(response?.data));
    }
  };
  const handleChangePagination = async (event, value) => {
    setPage(value);

    const response = await fetcher([
      "/get-provider-drivers",
      { params: { ...filters, page: value, per_page: pageSize } }
    ]);

    if (response.status === true) {
      dispatch(providerDriverData(response?.data?.data));
      dispatch(providerDriverPaginationData(response?.data));
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
          <ProviderPersonalInfo providerData={providerData} />
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
