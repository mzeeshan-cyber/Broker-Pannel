import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher } from 'utils/axios';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/payee/deletedpayeecolumns';
import { deletedPayeesData, loading, payeesPaginationData, resetFilter, restoreData, restoreMultipleData } from 'store/reducers/payeeSlice';
import { decryptToken } from 'utils/tokenUtils';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function DeletedPayees() {
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [errorMsg, setErrorMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const dispatch = useDispatch()
    const patientId = useParams()

    const params = {
        'patient_id': patientId.id,
    }
    const getDeteledPayees = async () => {
        setIsLoading(true);
        const response = await fetcher(["/deleted-patient-payees", { params }]);

        if (response.status === true) {
            dispatch(deletedPayeesData(response?.data?.data));
            dispatch(payeesPaginationData(response?.data));
            //   if (values) {
            //       dispatch(resetFilter(true))
            //   }
            setIsLoading(false);
        }
    };

    const restorePayee = async (id) => {
        dispatch(loading(true));
        try {
            const response = await fetch(`${API_URL}patient-payees/${id}/restore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
            });

            if (!response.ok) {
                const errorData = response.json();
                setErrorMsg(errorData);
                openSnackbar({
                    open: true,
                    message: errorData ? errorMsg?.message : 'Payee is not restored!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            openSnackbar({
                open: true,
                message: 'Payee restored successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
            dispatch(restoreData(id));

        } catch (err) {
            setErrorMsg(err);
        } finally {
            dispatch(loading(false));
        }
    }
    const restoreMultiplePayees = async (restoreIds) => {
        dispatch(loading(true));
        try {
            const response = await fetch(`${API_URL}restore-multiple-patient-payees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: JSON.stringify({
                    'ids': restoreIds,
                }),
            });
            if (!response.status === true) {
                const errorData = response.json();
                setErrorMsg(errorData);
                openSnackbar({
                    open: true,
                    message: errorData ? errorMsg?.message : 'Payees are not restored!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            else {
                dispatch(restoreMultipleData(restoreIds));
                openSnackbar({
                    open: true,
                    message: 'Payees restored successfuly!',
                    variant: 'alert',

                    alert: {
                        color: 'success'
                    }
                });
            }

        } catch (err) {
            setErrorMsg(err);
        } finally {
            dispatch(loading(false));
        }
    }

    // Pagination
    const handleChangePerPage = async (event) => {
        setPageSize(Number(event.target.value));
        const per_page = Number(event.target.value);
        const response = await fetcher([`/deleted-patient-payees?patient_id=${patientId.id}&per_page=${per_page}`]);
        if (response.status === true) {
            dispatch(deletedPayeesData(response?.data?.data))
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
        const response = await fetcher([`/deleted-patient-payees?patient_id=${patientId.id}&page=${eventValue ? eventValue : value}`]);
        if (response.status === true) {
            dispatch(deletedPayeesData(response?.data?.data))
            dispatch(resetFilter(false))
            openSnackbar({
                open: true,
                message: response.message || 'data is fetched',
                variant: 'alert',
                alert: { color: 'success' }
            });
        }
    };

    useEffect(() => { getDeteledPayees() }, [])

    const payeeState = useSelector(state => state?.payee)

    return (
        <Grid>
            {isLoading ?
                <CircularLoader text='Loading deleted payee..' />
                :
                <CommonTable
                    isSubmitting={payeeState.loading}
                    data={payeeState?.deletedPayeesData}
                    paginationData={payeeState?.payeesPaginationData}
                    defaultColumns={columns}
                    setPageSize={setPageSize}
                    pageSize={pageSize}
                    page={page}
                    handleChangePerPage={handleChangePerPage}
                    handleChangePagination={handleChangePagination}
                    handleDelete={restorePayee}
                    handleRestoreMultiple={restoreMultiplePayees}
                    tableType={'deletedTable'}
                    tableName="payee"
                />
            }
        </Grid>
    );
}
