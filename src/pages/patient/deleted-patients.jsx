// material-ui
import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { deletedPatientsData } from 'store/reducers/patientSlice';
import { useDispatch } from 'react-redux';
import DeletedPatientsTable from 'pages/tables/broker-tables/patients/deletedPatientsTable';
import { decryptToken } from 'utils/tokenUtils';
import CircularLoader from 'components/common/loader/CircularLoader';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DeletedPatient() {
  const [pagination, setPagination] = useState({});
  const [errorMsg, setErrorMsg] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const encryptedFromStorage = localStorage.getItem("token");
  const decryptedToken = decryptToken(encryptedFromStorage);

  const dispatch = useDispatch()

  const getDeteledPatients = async () => {
    try {
      setIsSubmitting(true)
      const response = await axios.get(`${API_URL}deleted-patients`, {
        headers: {
          'Authorization': `Bearer ${decryptedToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 && response.data?.status) {
        dispatch(deletedPatientsData(response.data?.data?.data));
        setPagination(response.data);

      } else {
        openSnackbar({
          open: true,
          message: response.data?.message || "An unexpected error occurred",
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || "An unexpected error occurred",
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
    finally {
      setIsSubmitting(false)
    }
  };
  const restoreMultiplePatient = async (restoreIds) => {
    try {
      const response = await fetch(`${API_URL}restore-multiple-patients`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${decryptedToken}`,
        },
        body: JSON.stringify({
          'patient_ids': restoreIds,
        }),
      });
      if (!response.status === true) {
        const errorData = response.json();
        setErrorMsg(errorData);
        openSnackbar({
          open: true,
          message: errorData ? errorMsg?.message : 'Patient is not restored!',
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
          message: 'Patient restored successfuly!',
          variant: 'alert',

          alert: {
            color: 'success'
          }
        });
      }

    } catch (err) {
      setErrorMsg(err);
    } finally {
      setIsSubmitting(false);
      getDeteledPatients();
    }
  }


  useEffect(() => { getDeteledPatients() }, [])

  return (
    <Grid>
      {isSubmitting ?
        <CircularLoader text='Loading deleted patients..'/>
        :
        <DeletedPatientsTable restoreMultiplePatient={restoreMultiplePatient} pagination={pagination} />
      }
    </Grid>
  );
}
