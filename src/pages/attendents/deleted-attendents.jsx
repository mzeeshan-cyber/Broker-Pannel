import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { fetcher } from 'utils/axios';
import DeletedAttendentTable from 'pages/tables/broker-tables/attendents/deletedAttendentTable';
import { decryptToken } from 'utils/tokenUtils';
import CircularLoader from 'components/common/loader/CircularLoader';
import { attendantsPaginationData, deletedAttendantsData, loading, restoreData, restoreMultipleData } from 'store/reducers/attendantSlice';

export default function DeletedAttendents() {
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
    const getDeteledAttendents = async () => {
        setIsLoading(true);
        const response = await fetcher(["/deleted-patient-attendants", { params }]);

        if (response.status === true) {
            dispatch(deletedAttendantsData(response?.data?.data || []));
            dispatch(attendantsPaginationData(response?.data));
            setIsLoading(false);
        }
    };

    const restoreAttendent = async (id) => {
        dispatch(loading(true));
        try {
            const response = await fetch(`${API_URL}patient-attendants/${id}/restore`, {
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
                    message: errorData ? errorMsg?.message : 'Attendent is not restored!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            openSnackbar({
                open: true,
                message: 'Attendent restored successfuly!',
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
    const restoreMultipleAttendents = async (restoreIds) => {
        dispatch(loading(true));
        try {
            const response = await fetch(`${API_URL}restore-patient-attendants`, {
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
                    message: errorData ? errorMsg?.message : 'Attendents is not restored!',
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
                    message: 'Attendents restored successfuly!',
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

    useEffect(() => { getDeteledAttendents() }, [])

    return (
        <Grid>
            {isLoading ?
                <CircularLoader text='Loading deleted attendants..' />
                :
                <DeletedAttendentTable handleDelete={restoreAttendent} handleRestoreMultiple={restoreMultipleAttendents} />
            }
        </Grid>
    );
}
