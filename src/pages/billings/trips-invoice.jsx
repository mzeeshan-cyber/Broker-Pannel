import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { loading, tripsInvoicesData, paginationData, tripsInvoicesAfterDelete, filterValue } from 'store/reducers/tripsInvoicesSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/billings/tripsInvoicesColumns';
import TripButtonsOnTable from 'components/pages/tripsInvoices/TripButtonsOnTable';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function TripsInvoices() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const getTripsInvoices = async (values = {}) => {
    setIsLoading(true);
    const query = {
      provider_id: values?.provider_id || '',
      submission_date: values?.submission_date || '',
      paid_date: values?.paid_date || '',
      status: values?.status || '',
      page,
      per_page: pageSize
    };
    setFilters(query);
    try{
      const response = await fetcher([
        "/get-trip-invoices",
        { params: query }
      ]);
      if (response.status === true) {
        setIsLoading(false);
        dispatch(filterValue(values));
        dispatch(tripsInvoicesData(response?.data?.data));
        dispatch(paginationData(response?.data));
      }
    }
    catch(error){
      setIsLoading(false);
    }
  };
  const handleChangePerPage = async (event) => {
    const per_page = Number(event.target.value);

    setPageSize(per_page);
    setPage(1);

    const response = await fetcher([
      "/get-trip-invoices",
      { params: { ...filters, page: 1, per_page } }
    ]);

    if (response.status === true) {
      dispatch(tripsInvoicesData(response?.data?.data));
      dispatch(paginationData(response?.data));
    }
  };
  const handleChangePagination = async (event, value) => {
    setPage(value);

    const response = await fetcher([
      "/get-trip-invoices",
      { params: { ...filters, page: value, per_page: pageSize } }
    ]);

    if (response.status === true) {
      dispatch(tripsInvoicesData(response?.data?.data));
      dispatch(paginationData(response?.data));
    }
  };

  const deleteTripsInvoices = async (id) => {
    dispatch(loading(true));
    const response = await fetcherDelete([`/delete-reimbursement-trip/${id}`]);
    if (response.status === 200) {
      dispatch(loading(false));
      dispatch(tripsInvoicesAfterDelete(id));
      openSnackbar({
        open: true,
        message: 'Reimbursement Trip deleted successfuly!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    }
  }
  const updateTripsInvoices = async (id, data) => {
    const response = await fetcherUpdate(`/update-reimbursement-trip/${id}`, JSON.stringify(data))
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: 'Reimbursement Trip updated successfuly!',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
    }
  }

  const TripsInvoiceState = useSelector(state => state?.tripsInvoices)
  const tripsInvoiceData = TripsInvoiceState?.tripsInvoicesData;

  useEffect(() => { getTripsInvoices() }, [])

  return (
    <Grid>
      {isLoading ?
        <CircularLoader text='Loading data...' height='40vh' />
        :
        <CommonTable
          data={Array.isArray(tripsInvoiceData) ? [...tripsInvoiceData].reverse() : []}
          paginationData={TripsInvoiceState?.paginationData}
          defaultColumns={columns}
          setPageSize={setPageSize}
          pageSize={pageSize}
          page={page}
          handleChangePerPage={handleChangePerPage}
          handleChangePagination={handleChangePagination}
          handleDelete={deleteTripsInvoices}
          handleUpdate={updateTripsInvoices}
          stackontable={<TripButtonsOnTable handleGetData={getTripsInvoices} />}
          tableName="trip-invoices"
        />
      }
    </Grid>
  );
}
