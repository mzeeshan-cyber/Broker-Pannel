import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetcher, fetcherDelete } from 'utils/axios';
import { isDeleting, loading, providerDocumentData, providerDocumentDataAfterDelete, providerDocumentPaginationData } from 'store/reducers/provideDocumentSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/providers/registration-docs/registrationDocsTableColumns';
import RegistrationButtoonsOnTable from 'components/pages/providers/registration-docs/RegistrationButtoonsOnTable';
import ProviderPersonalInfo from 'components/pages/providers/provider-personal-info/provider-personal-info';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function RegistrationDocs() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [providerData, setProviderData] = useState({});
  const dispatch = useDispatch();
  const { provider_id } = useParams();
  const [filters, setFilters] = useState({});

  const getProviderDocumentData = async (values = {}) => {
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
      dispatch(loading(false));
    }
  }

  const handleDeleteDocument = async (id) => {
    dispatch(isDeleting(true));
    const response = await fetcherDelete([`/delete-provider-register-document/${id}`]);
    if (response.status === 200) {
      dispatch(providerDocumentDataAfterDelete({ id }))
      openSnackbar({
        open: true,
        message: response.message || 'Provider Document deleted successfuly!',
        variant: 'alert',
        
        alert: {
          color: 'success'
        }
      });
      dispatch(isDeleting(false));
    }
  }
  const providerDocumentState = useSelector(state => state?.providerDocument)
  const Loading = providerDocumentState?.loading;
  const DocumentsData = providerDocumentState?.providerDocumentData;

  useEffect(() => { getProviderDocumentData(); FetchSingleProvider() }, [])
  return (
    <Grid>
      {Loading ?
        <CircularLoader text='Loading Documents..' />
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
            handleDelete={handleDeleteDocument}
            stackontable={<RegistrationButtoonsOnTable />}
            tableName="provider registration docs"
          />
        </>
      }
    </Grid>
  );
}
