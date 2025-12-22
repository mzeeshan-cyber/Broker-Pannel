import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher } from 'utils/axios';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/trips/tripDeletesColumn';
import { deletedData, loading, paginationData, restoreData, restoreMultipleData } from 'store/reducers/tripsSlice';
import { decryptToken } from 'utils/tokenUtils';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function DeletedReimbursementTrips() {
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [errorMsg, setErrorMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const dispatch = useDispatch();
    const patientId = useParams();
    const [filters, setFilters] = useState({});

    const getDeteledTrips = async (values = {}) => {
        setIsLoading(true);
        const query = {
            page,
            per_page: pageSize
        };
        setFilters(query);
        const response = await fetcher([
            "/trips/trashed",
            { params: query }
        ]);
        if (response.status === true) {
            dispatch(deletedData(response?.data?.data));
            dispatch(paginationData(response?.data));
            setIsLoading(false);
        }
    };

    const restoreTrip = async (id) => {
        dispatch(loading(true));
        try {
            const response = await fetch(`${API_URL}trips/restore/${id}`, {
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
                dispatch(loading(false));
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
            dispatch(loading(false));
        }
    }
    const restoreMultipleTrips = async (restoreIds) => {
        dispatch(loading(true));
        try {
            const response = await fetch(`${API_URL}trips/restore-multiple`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: JSON.stringify({
                    ids: restoreIds,
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
                dispatch(loading(false));
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
            dispatch(loading(false));
            setErrorMsg(err);
        }
    }

    const handleChangePerPage = async (event) => {
        const per_page = Number(event.target.value);

        setPageSize(per_page);
        setPage(1);

        const response = await fetcher([
            `/trips/trashed?patient_id=${patientId.id}`,
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
            `/trips/trashed?patient_id=${patientId.id}`,
            { params: { ...filters, page: value, per_page: pageSize } }
        ]);

        if (response.status === true) {
            dispatch(deletedData(response?.data?.data));
            dispatch(paginationData(response?.data));
        }
    };

    useEffect(() => { getDeteledTrips() }, [])

    const stateData = useSelector(state => state?.trips)

    return (
        <Grid>
            {isLoading ?
                <CircularLoader text='Loading data...' height='40vh' />
                :
                <CommonTable
                    isSubmitting={stateData?.loading}
                    data={stateData?.deletedData}
                    paginationData={stateData?.paginationData}
                    defaultColumns={columns}
                    setPageSize={setPageSize}
                    pageSize={pageSize}
                    page={page}
                    handleChangePerPage={handleChangePerPage}
                    handleChangePagination={handleChangePagination}
                    handleDelete={restoreTrip}
                    handleRestoreMultiple={restoreMultipleTrips}
                    tableType={'deletedTable'}
                    tableName="trips"
                />
            }
        </Grid>
    );
}
