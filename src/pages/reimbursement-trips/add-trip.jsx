import React, { useEffect, useState } from 'react'
import MainCard from 'components/MainCard';
import { openSnackbar } from 'api/snackbar';
import { fetcher } from 'utils/axios';
import SearchableSelect from 'components/common/SearchableSelect';
import TripDetail from 'components/pages/reimbursement-trips/trip-detail';
import { Call, ShieldTick, Sms, User } from 'iconsax-react';
import AddTripForm from './add-trip-form';
import CircularLoader from 'components/common/loader/CircularLoader';
import EmptyCityCard from 'components/common/empty-card';
import { HiOutlineShieldExclamation } from "react-icons/hi";

export const AddReimbursementTrip = () => {
    const [selected, setSelected] = useState(null);
    const [patientsData, setPatientsData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allowance, setAllowance] = useState();

    const getPatients = async () => {
        setIsLoading(true)
        try {
            const response = await fetcher(["/search-trip-patients"]);
            if (response?.status === true) {
                setPatientsData(response?.data);
                setIsLoading(false)
            } else {
                setIsLoading(false)
                openSnackbar({
                    open: true,
                    message: response?.message || 'Failed to fetch patients.',
                    variant: 'alert',
                    alert: { color: 'error' }
                });
            }
        } catch (error) {
            setIsLoading(false)
            openSnackbar({
                open: true,
                message: error?.message || 'Something went wrong. Please try again.',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
    };
    const handleGetAllowance = async () => {
        try {
            const response = await fetcher('fetch-allowances');
            if (response.status === true) {
                setAllowance(response.data)
            }
            else {
                openSnackbar({
                    open: true,
                    message: 'Allowances are not fetched!',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                });
            }
        }
        catch (error) {
            openSnackbar({
                open: true,
                message: error.message || 'Allowances are not found, Add allownces!',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            });
        }
    };
    const filteredPatient = patientsData.filter((item) => item.id === selected?.value)
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
    useEffect(() => {
        handleGetAllowance();
        getPatients();
    }, [])
    return (
        isLoading || !allowance ?
            <CircularLoader text='Loading patients...' height='40vh' /> :
            <MainCard title="Add New Trip">
                {allowance?
                    <>
                        <SearchableSelect options={mappedPatients} placeholder="Select Patient" selected={selected} setSelected={setSelected} />
                        <TripDetail filteredPatient={filteredPatient} setShowForm={setShowForm} />
                        {showForm &&
                            <AddTripForm mappedPatients={SelectedPatient} allowance={allowance} />
                        }
                    </>
                    :
                    <EmptyCityCard message = "No Allowances found!" description="To add new Trip first and allowances." icon={<HiOutlineShieldExclamation size={24} />} buttonText="Add allowances" link="/reimbursement-trips/allowances"/>
                }
            </MainCard>
    )
}
