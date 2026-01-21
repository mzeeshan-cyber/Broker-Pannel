import React, { useEffect, useState } from 'react'
import MainCard from 'components/MainCard';
import { openSnackbar } from 'api/snackbar';
import { fetcher } from 'utils/axios';
import { useParams } from 'react-router';
import CircularLoader from 'components/common/loader/CircularLoader';
import UpdateForm from './UpdateForm';

export const UpdateStandingOrder = () => {
    const [standingOrdersData, setStandingOrdersData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { id } = useParams();

    const FetchSingleTrip = async () => {
        try {
            setIsLoading(true);
            const response = await fetcher(`/standing-order/${id}`);
            if (response.status === true) {
                setStandingOrdersData(response?.data);
                setIsLoading(false);
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
        <MainCard title="Update Standing Order">
            {isLoading ?
                <CircularLoader text='Loading data...' height='40vh' />
                :
                <UpdateForm standingOrdersData={standingOrdersData} />
            }
        </MainCard>
    )
}
