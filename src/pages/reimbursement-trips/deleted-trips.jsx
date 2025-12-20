import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher } from 'utils/axios';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/reimbursement-trip/DeletedColumns';
import { deletedData, loading, paginationData, restoreData, restoreMultipleData } from 'store/reducers/reimbursementTripSlice';
import { decryptToken } from 'utils/tokenUtils';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function DeletedReimbursementTrips() {
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [errorMsg, setErrorMsg] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({});

    const getDeteledReimbursemnetTrips = async (values = {}) => {
        dispatch(loading(true));
        const query = {
            page,
            per_page: pageSize
        };
        setFilters(query);
        const response = await fetcher([
            "/get-deleted-reimbursement-trips",
            { params: query }
        ]);
        if (response.status === true) {
            dispatch(deletedData(response?.data?.data));
            dispatch(paginationData(response?.data));
            dispatch(loading(false));
        }
    };
    const handleChangePerPage = async (event) => {
        const per_page = Number(event.target.value);

        setPageSize(per_page);
        setPage(1);

        const response = await fetcher([
            "/get-deleted-reimbursement-trips",
            { params: { ...filters, page: 1, per_page } }
        ]);

        if (response.status === true) {
            dispatch(deletedData(response?.data?.data));
            dispatch(paginationData(response?.data));
        }
    };
    const handleChangePagination = async (event, value) => {
        setPage(value);

        const response = await fetcher([
            "/get-deleted-reimbursement-trips",
            { params: { ...filters, page: value, per_page: pageSize } }
        ]);

        if (response.status === true) {
            dispatch(deletedData(response?.data?.data));
            dispatch(paginationData(response?.data));
        }
    };

    const restoreReimbursementTrip = async (id) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}reimbursement-trip/${id}/restore`, {
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
                    message: errorData ? errorMsg?.message : 'Trip is not restored!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            else {
                setIsSubmitting(false)
                dispatch(restoreData(id));
                openSnackbar({
                    open: true,
                    message: 'Trip restored successfuly!',
                    variant: 'alert',

                    alert: {
                        color: 'success'
                    }
                });
            }

        } catch (err) {
            setErrorMsg(err);
            setIsSubmitting(false)
        }
    }
    const restoreMultipleReimbursementTrips = async (restoreIds) => {
        setIsSubmitting(true)
        try {
            const response = await fetch(`${API_URL}reimbursement-trip/restore-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: JSON.stringify({
                    'ids': restoreIds,
                }),
            });
            if (response.status !== 200) {
                const errorData = response.json();
                setErrorMsg(errorData);
                openSnackbar({
                    open: true,
                    message: errorData ? errorMsg?.message : 'Trips are not restored!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            else {
                setIsSubmitting(false)
                dispatch(restoreMultipleData(restoreIds));
                openSnackbar({
                    open: true,
                    message: 'Trips restored successfuly!',
                    variant: 'alert',

                    alert: {
                        color: 'success'
                    }
                });
            }

        } catch (err) {
            setIsSubmitting(false)
            setErrorMsg(err);
        }
    }

    useEffect(() => { getDeteledReimbursemnetTrips() }, [])

    const stateData = useSelector(state => state?.reimmbursementTrip)

    return (
        <Grid>
            {stateData.loading ?
                <CircularLoader text='Loading data...' height='40vh' />
                :
                <CommonTable
                    isSubmitting={isSubmitting}
                    data={stateData?.deletedData}
                    paginationData={stateData?.paginationData}
                    defaultColumns={columns}
                    setPageSize={setPageSize}
                    pageSize={pageSize}
                    page={page}
                    handleChangePerPage={handleChangePerPage}
                    handleChangePagination={handleChangePagination}
                    handleDelete={restoreReimbursementTrip}
                    handleRestoreMultiple={restoreMultipleReimbursementTrips}
                    tableType={'deletedTable'}
                    tableName="reimbursement-trip"
                />
            }
        </Grid>
    );
}
