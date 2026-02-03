// material-ui
import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { filterValue, loading, providerData, providerPaginationData, providersDataAfterDelete } from 'store/reducers/providerSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/providers/providerTableColumn';
import ProviderButtonsOnTable from 'components/pages/providers/ProviderButtonsOnTable';
import CircularLoader from 'components/common/loader/CircularLoader';


export default function Provider() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});
  const [isFetching, setIsFetching] = useState(false);

  const getProviderData = async (values = {}) => {
    setIsFetching(true);
    const query = {
      name: values?.name || '',
      company_phone: values?.phone_number || '',
      email: values?.email || '',
      page:1,
      per_page: pageSize
    };
    setFilters(query);
    setPage(1)
    const response = await fetcher([
      "/providers",
      { params: query }
    ]);
    if (response.status === true) {
      dispatch(providerData(response.data.data));
      dispatch(filterValue(values));
      dispatch(providerPaginationData(response.data));
      setIsFetching(false);
    }
  };
  const handleChangePerPage = async (event) => {
    const per_page = Number(event.target.value);

    setPageSize(per_page);
    setPage(1);

    const response = await fetcher([
      "/providers",
      { params: { ...filters, page: 1, per_page } }
    ]);

    if (response.status === true) {
      dispatch(providerData(response.data.data));
      dispatch(providerPaginationData(response.data));
    }
  };
  const handleChangePagination = async (event, value) => {
    setPage(value);

    const response = await fetcher([
      "/providers",
      { params: { ...filters, page: value, per_page: pageSize } }
    ]);

    if (response.status === true) {
      dispatch(providerData(response.data.data));
      dispatch(providerPaginationData(response.data));
    }
  };

  const deleteProvider = async (id) => {
    dispatch(loading(true));
    const response = await fetcherDelete([`/provider/${id}`]);
    if (response.status === 200) {
      dispatch(providersDataAfterDelete({ id }))
      openSnackbar({
        open: true,
        message: 'Provider deleted successfuly!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      dispatch(loading(false));
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
  const providerState = useSelector(state => state?.provider);
  const providerStateData = providerState.providerData;

  useEffect(() => {
    getProviderData({}, page, pageSize);
  }, []);

  return (
    <Grid>
      {isFetching ?
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
          stackontable={<ProviderButtonsOnTable handleGetData={getProviderData} tableType="provider" filters={filters} />}
          tableName="provider"
        />
      }
    </Grid>
  );
}
