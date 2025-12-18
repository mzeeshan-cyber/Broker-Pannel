// material-ui
import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { loading, resetFilter } from 'store/reducers/patientSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import PayeeButtonsOnTable from 'components/pages/payees/payeeButtonsOnTable';
import { columns } from 'pages/tables/broker-tables/payee/payeeTableColumns';
import { payeesData, payeesPaginationData } from 'store/reducers/payeeSlice';
import CircularLoader from 'components/common/loader/CircularLoader';
        
// ==============================|| DASHBOARD - DEFAULT ||============================== //
export default function Payees() { 
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const {patient_id} = useParams();
  const Loading = useSelector(state => state.patient.loading)

  const getPayeeData = async (values) => {
    dispatch(loading(true));
    const params = {
      patient_id: patient_id,
      attendant_name: values?.attendant_name,
      phone_number: values?.phone_number,
      relationship: values?.relationship,
      status: values?.status,
    }
    const response = await fetcher(["/patient-payees", { params }]);
    if (response.status === true) {
      dispatch(loading(false));
      dispatch(payeesData(response?.data?.data));
      dispatch(payeesPaginationData(response?.data));
      if (values) {
        dispatch(resetFilter(true))
      }
    }
  };
  const deletePayees = async (id) => {
    dispatch(loading(true));
    const response = await fetcherDelete([`/patient-payees/${id}`]);
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: 'Payee deleted successfuly!',
        variant: 'alert',
        
        alert: {
          color: 'success'
        }
      });
      dispatch(loading(false));
      getPayeeData()

    }
  }
  const updatePayee = async (id, data) => {
    const response = await fetcherUpdate(`/patient/${id}`, JSON.stringify(data))
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: 'Payee updated successfuly!',
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
    const response = await fetcher([`/patient-payees?patient_id=${patient_id}&per_page=${per_page}`]);
    if (response.status === true) {
      dispatch(payeesData(response?.data?.data))
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
    const response = await fetcher([`/patient-payees?patient_id=${patient_id}&page=${eventValue ? eventValue : value}`]);
    if (response.status === true) {
      dispatch(payeesData(response?.data?.data))
      dispatch(resetFilter(false))
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };

  const payeeState = useSelector(state => state?.payee)
  const PayeeData = payeeState?.payeesData.map(item => ({
    ...item,
    payment_method: item.payment_method
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  }));
  
  useEffect(() => { getPayeeData() }, [])

  
  return (
    <Grid>
      {Loading ?
        <CircularLoader text='Loading payees..'/>
        :
        <CommonTable
          data={PayeeData}
          paginationData={payeeState?.payeesPaginationData}
          defaultColumns={columns}
          setPageSize={setPageSize}
          pageSize={pageSize} 
          page={page}
          handleChangePerPage={handleChangePerPage}
          handleChangePagination={handleChangePagination}
          handleDelete={deletePayees}
          handleUpdate={updatePayee}
          stackontable={<PayeeButtonsOnTable handleGetData={getPayeeData} tableType="payee" />}
          tableName="payee"
        />
      }
    </Grid>
  );
}
