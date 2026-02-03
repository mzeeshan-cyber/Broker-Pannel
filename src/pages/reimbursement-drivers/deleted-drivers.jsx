import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import DeletedDriversTable from 'pages/tables/broker-tables/drivers/deletedDriverTable';
import { useDispatch } from 'react-redux';
import { deletedDriversData, driversPaginationData, loading, restoreData, restoreMultipleData } from 'store/reducers/driverSlice';
import { fetcher } from 'utils/axios';
import { decryptToken } from 'utils/tokenUtils';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function DeletedDrivers() {
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
    const getDeteledReimbursementDrivers = async () => {
        setIsLoading(true);
        const response = await fetcher(["/reimbursement-drivers/deleted", { params }]);

        if (response.status === true) {
            dispatch(deletedDriversData(response?.data?.data || []));
            dispatch(driversPaginationData(response?.data));
            //   if (values) {
            //       dispatch(resetFilter(true))
            //   }
            setIsLoading(false);
        }
    };

    const restoreDriver = async (id) => {
         dispatch(loading(true));
        try {
            const response = await fetch(`${API_URL}reimbursement-driver/${id}/restore`, {
                method: 'PATCH',
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
                    message: errorData ? errorMsg?.message : 'Reimbursement driver is not restored!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            dispatch(restoreData(id));
            openSnackbar({
                open: true,
                message: 'Reimbursement driver restored successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });

        } catch (err) {
            setErrorMsg(err);
        } finally {
            dispatch(loading(false));
        }
    }
    const restoreMultipleDrivers = async (restoreIds) => {
        dispatch(loading(true));
        try {
            const response = await fetch(`${API_URL}reimbursement-drivers/restore`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: JSON.stringify({
                    'driver_ids': restoreIds,
                }),
            });
            if (!response.status === true) {
                const errorData = response.json();
                setErrorMsg(errorData);
                openSnackbar({
                    open: true,
                    message: errorData ? errorMsg?.message : 'Driver is not restored!',
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
                    message: 'Driver restored successfuly!',
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


    useEffect(() => { getDeteledReimbursementDrivers() }, [])

    return (
        <Grid>
            {isLoading ?
                <CircularLoader text='Loading deleted reimbursement drivers..'/>
                :
                <DeletedDriversTable handleDelete={restoreDriver} handleRestoreMultiple={restoreMultipleDrivers} />
            }
        </Grid>
    );
}
