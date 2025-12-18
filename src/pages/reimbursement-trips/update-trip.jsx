import React, { useEffect, useState } from 'react'
import MainCard from 'components/MainCard';
import { openSnackbar } from 'api/snackbar';
import { fetcher } from 'utils/axios';
import { useParams } from 'react-router';
import UpdateTripForm from './update-trip-form';
import { Box } from '@mui/material';
import CircularLoader from 'components/common/loader/CircularLoader';

export const UpdateReimbursementTrip = () => {
    const [reimbursementTripData, setReimbursementTripData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { trip_id } = useParams();

    const FetchSingleTrip = async () => {
        try {
            setIsLoading(true);
            const response = await fetcher(`/get-reimbursement-trip/${trip_id}`);
            if (response.status === true) {
                setReimbursementTripData(response?.data);
            } else {
                openSnackbar({
                    open: true,
                    message: response.message || 'Failed to fetch data',
                    variant: 'alert',
                    alert: { color: 'error' }
                });
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || 'Something went wrong while fetching trip',
                variant: 'alert',
                alert: { color: 'error' }
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        FetchSingleTrip();
    }, [])

    return (
        <MainCard title="Update Trip">
            {isLoading ?
                <CircularLoader text='Loading data...' height='40vh' />
                :
                <UpdateTripForm tripData={reimbursementTripData} />
            }
        </MainCard>
    )
}
