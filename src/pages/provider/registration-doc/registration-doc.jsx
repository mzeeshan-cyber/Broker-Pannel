// material-ui
import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetcher } from 'utils/axios';
import { loading, providerDocumentData, providerDocumentPaginationData } from 'store/reducers/provideDocumentSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/providers/registration-docs/registrationDocsTableColumns';
import RegistrationButtoonsOnTable from 'components/pages/providers/registration-docs/RegistrationButtoonsOnTable';
import ProviderPersonalInfo from 'components/pages/providers/provider-personal-info/provider-personal-info';

// ==============================|| DASHBOARD - DEFAULT ||============================== //
export default function RegistrationDocs() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [providerData, setProviderData] = useState({});
  const dispatch = useDispatch();
  const { provider_id } = useParams();

  const params = {
    provider_id: provider_id,
  }
  const getProviderData = async () => {
    dispatch(loading(true));
    const response = await fetcher(["/get-provider-register-document", { params }]);
    if (response.status === true) {
      dispatch(loading(false));
      dispatch(providerDocumentData(response?.data?.data));
      dispatch(providerDocumentPaginationData(response?.data));
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
    const response = await fetcher([`/get-provider-register-document?per_page=${per_page}`, { params }]);
    if (response.status === true) {
      dispatch(providerDocumentData(response?.data?.data))
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
    const response = await fetcher([`/get-provider-register-document?page=${eventValue ? eventValue : value}`, { params }]);
    if (response.status === true) {
      dispatch(providerDocumentData(response?.data?.data))
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };

  const providerDocumentState = useSelector(state => state?.providerDocument)
  const Loading = providerDocumentState?.loading;
  const DocumentsData = providerDocumentState?.providerDocumentData;

  useEffect(() => { getProviderData(); FetchSingleProvider() }, [])
  return (
    <Grid>
      {Loading ?
        <Loader />
        :
        <>
        <ProviderPersonalInfo providerData={providerData}/>
        <CommonTable
          data={DocumentsData}
          paginationData={providerDocumentState?.providerDocumentPaginationData}
          defaultColumns={columns}
          setPageSize={setPageSize}
          pageSize={pageSize}
          page={page}
          handleChangePerPage={handleChangePerPage}
          handleChangePagination={handleChangePagination}
          stackontable={<RegistrationButtoonsOnTable />}
          tableName="provider registration docs"
        />
        </>
      }
    </Grid>
  );
}
