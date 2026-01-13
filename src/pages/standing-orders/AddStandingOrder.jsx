import React, { useEffect, useState } from 'react'
import MainCard from 'components/MainCard';
import { openSnackbar } from 'api/snackbar';
import { fetcher } from 'utils/axios';
import SearchableSelect from 'components/common/SearchableSelect';
import TripDetail from 'components/pages/reimbursement-trips/trip-detail';
import { Call, ShieldTick, Sms, User } from 'iconsax-react';
import CircularLoader from 'components/common/loader/CircularLoader';
import AddTripForm from './form';

export const AddStandingOrder = () => {
    const [selected, setSelected] = useState(null);
    const [patientsData, setPatientsData] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const getPatients = async () => {
        setIsLoading(true)
        try {
            const response = await fetcher(["/search-trip-patients"]);
            if (response?.status === true) {
                setPatientsData(response?.data);
                setIsLoading(false)
            } else {
                openSnackbar({
                    open: true,
                    message: response?.message || 'Failed to fetch patients.',
                    variant: 'alert',
                    alert: { color: 'error' }
                });
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: error?.message || 'Something went wrong. Please try again.',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
    };
    const filteredPatient = patientsData.filter((item) => item.id === selected?.value)
    // const filteredPatient = await fetcher(["/search-trip-patients", {term : selected?.value}]);

    useEffect(() => {
        getPatients();
    }, [])

    const mappedPatients = patientsData?.map((patient) => ({
        value: patient.id,
        iconPairs: [
            {
                icon: <User size="16" />,
                label: patient.name
            },
            {
                icon: <Sms size="16" />,
                label: patient.email
            },
            {
                icon: <Call size="16" />,
                label: patient.patient_detail?.phone_number || 'N/A'
            },
            {
                icon: <ShieldTick size="16" />,
                label: patient.patient_detail?.social_security_number || 'N/A'
            }
        ]
    }));
    const SelectedPatient = filteredPatient[0];
    return (
        <MainCard title={`Add New Trip`}>
            {SelectedPatient?.status && SelectedPatient?.status !== 'active' && (
                <p style={{ color: 'red', position:'absolute', top:'7px', left:'115px'}}>
                    (Trips can only be added for active patients)
                </p>
            )}
            {isLoading ?
                <CircularLoader height='100%' />
                :
                <>
                    <SearchableSelect options={mappedPatients} placeholder="Select Patient" selected={selected} setSelected={setSelected} />
                    <TripDetail filteredPatient={filteredPatient} setShowForm={setShowForm} buttonText="Add Trip" />
                    {showForm &&
                        <AddTripForm mappedPatients={SelectedPatient} />
                    }
                </>
            }
        </MainCard>
    )
}
