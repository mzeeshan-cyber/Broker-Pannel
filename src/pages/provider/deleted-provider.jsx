import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher } from 'utils/axios';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/providers/deletedProviderColumns';
import { deletedProviderData, loading, providerPaginationData, restoreData, restoreMultipleData } from 'store/reducers/providerSlice';
import { decryptToken } from 'utils/tokenUtils';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function DeletedProvider() {
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [errorMsg, setErrorMsg] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const dispatch = useDispatch()
    const patientId = useParams()

    const getDeteledProviders = async () => {
        setIsSubmitting(true);
        const response = await fetcher(["/deleted-providers"]);

        if (response.status === true) {
            dispatch(deletedProviderData(response?.data?.data));
            dispatch(providerPaginationData(response?.data));
            setIsSubmitting(false);
        }
    };

    const restoreProvider = async (id) => {
        dispatch(loading(true));
        try {
            const response = await fetch(`${API_URL}provider/${id}/restore`, {
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
                    message: errorData ? errorMsg?.message : 'Provider is not restored!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            openSnackbar({
                open: true,
                message: 'Provider restored successfuly!',
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
    const restoreMultipleProviders = async (restoreIds) => {
        dispatch(loading(true));
        try {
            const response = await fetch(`${API_URL}restore-multiple-provider`, {
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
                    message: errorData ? errorMsg?.message : 'Providers are not restored!',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            else {
                openSnackbar({
                    open: true,
                    message: 'Providers restored successfuly!',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                });
                dispatch(restoreMultipleData(restoreIds));
            }

        } catch (err) {
            setErrorMsg(err);
        } finally {
            dispatch(loading(false));
        }
    }
    
    const handleChangePerPage = async (event) => {
        setPageSize(Number(event.target.value));
        const per_page = Number(event.target.value);
        const response = await fetcher([`/deleted-providers?patient_id=${patientId.id}&per_page=${per_page}`]);
        if (response.status === true) {
            dispatch(deletedProviderData(response?.data?.data))
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
        const response = await fetcher([`/deleted-providers?patient_id=${patientId.id}&page=${eventValue ? eventValue : value}`]);
        if (response.status === true) {
            dispatch(deletedProviderData(response?.data?.data))
            dispatch(resetFilter(false))
            openSnackbar({
                open: true,
                message: response.message || 'data is fetched',
                variant: 'alert',
                alert: { color: 'success' }
            });
        }
    };

    useEffect(() => { getDeteledProviders() }, [])

    const providerState = useSelector(state => state?.provider);

    return (
        <Grid>
            {isSubmitting ?
                <CircularLoader text='Loading Deleted Providers..' />
                :
                <CommonTable
                    isSubmitting={providerState.loading}
                    data={providerState?.deletedProviderData}
                    paginationData={providerState?.providerPaginationData}
                    defaultColumns={columns}
                    setPageSize={setPageSize}
                    pageSize={pageSize}
                    page={page}
                    handleChangePerPage={handleChangePerPage}
                    handleChangePagination={handleChangePagination}
                    handleDelete={restoreProvider}
                    handleRestoreMultiple={restoreMultipleProviders}
                    tableType={'deletedTable'}
                    tableName="provider"
                />
            }
        </Grid>
    );
}
