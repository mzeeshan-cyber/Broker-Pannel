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

export default function RegistrationDocs() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [providerData, setProviderData] = useState({});
  const dispatch = useDispatch();
  const { provider_id } = useParams();
  const [filters, setFilters] = useState({});

  const getProviderData = async (values = {}) => {
    dispatch(loading(true));
    const query = {
      provider_id: provider_id,
      page,
      per_page: pageSize
    };
    setFilters(query);
    const response = await fetcher([
      "/get-provider-register-document",
      { params: query }
    ]);
    if (response.status === true) {
      dispatch(loading(false));
      dispatch(providerDocumentData(response?.data?.data));
      dispatch(providerDocumentPaginationData(response?.data));
    }
  };
  const handleChangePerPage = async (event) => {
    const per_page = Number(event.target.value);

    setPageSize(per_page);
    setPage(1);

    const response = await fetcher([
      "/get-provider-register-document",
      { params: { ...filters, page: 1, per_page } }
    ]);

    if (response.status === true) {
      dispatch(providerDocumentData(response?.data?.data));
      dispatch(providerDocumentPaginationData(response?.data));
    }
  };
  const handleChangePagination = async (event, value) => {
    setPage(value);

    const response = await fetcher([
      "/get-provider-register-document",
      { params: { ...filters, page: value, per_page: pageSize } }
    ]);

    if (response.status === true) {
      dispatch(providerDocumentData(response?.data?.data));
      dispatch(providerDocumentPaginationData(response?.data));
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
          <ProviderPersonalInfo providerData={providerData} />
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
