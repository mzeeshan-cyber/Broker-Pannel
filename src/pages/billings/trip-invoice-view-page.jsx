import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { loading, tripsInvoicesData, paginationData, tripsInvoicesAfterDelete, filterValue } from 'store/reducers/tripsInvoicesSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/billings/tripInvoiceViewPageColumn';
import TripButtonsOnTable from 'components/pages/tripsInvoices/TripButtonsOnTable';
import CircularLoader from 'components/common/loader/CircularLoader';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router';

export default function TripsInvoiceViewPage() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const {invoice_id} = useParams()

  const getTripsInvoices = async (values = {}) => {
    setIsLoading(true);
    const query = {
      invoice_id: invoice_id,
      service_date:values.date,
      mobility:values.mobility,
      page,
      per_page: pageSize
    };
    setFilters(query);
    const response = await fetcher([
      "/get-invoice-trips",
      { params: query }
    ]);
    if (response.status === true) {
      setIsLoading(false);
      dispatch(filterValue(values));
      dispatch(tripsInvoicesData(response?.data?.data));
      dispatch(paginationData(response?.data));
    }
  };
  const handleChangePerPage = async (event) => {
    const per_page = Number(event.target.value);

    setPageSize(per_page);
    setPage(1);

    const response = await fetcher([
      "/get-invoice-trips",
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
      "/get-invoice-trips",
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
        <>
        <Box display="flex" alignItems="center" gap="10px" mb={1}>
        <Typography variant='h4'>Invoice Number :</Typography>
        <Typography variant='h6'>Invoice Number</Typography>
        </Box>
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
          stackontable={<TripButtonsOnTable handleGetData={getTripsInvoices} pageTitle="invoice-view"/>}
          tableName="trip-invoices"
        />
        </>
      }
    </Grid>
  );
}
