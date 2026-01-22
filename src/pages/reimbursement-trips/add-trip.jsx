import React, { useEffect, useState } from 'react'
import MainCard from 'components/MainCard';
import { openSnackbar } from 'api/snackbar';
import { fetcher } from 'utils/axios';
import TripDetail from 'components/pages/reimbursement-trips/trip-detail';
import AddTripForm from './add-trip-form';
import CircularLoader from 'components/common/loader/CircularLoader';
import EmptyCityCard from 'components/common/empty-card';
import { HiOutlineShieldExclamation } from "react-icons/hi";
import { Formik } from 'formik';
import DebouncedDropdown from 'pages/standing-orders/PatientDropDown';

export const AddReimbursementTrip = () => {
    const [selected, setSelected] = useState(null);
    const [patientsData, setPatientsData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allowance, setAllowance] = useState();
    const [selectedTrip, setSelectedTrip] = useState({});

    const getPatients = async () => {
        setIsLoading(true)
        try {
            const response = await fetcher(["/search-trip-patients"]);
            if (response?.status === true) {
                setPatientsData(response?.data?.data);
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
    useEffect(() => {
        handleGetAllowance();
        getPatients();
    }, [])
    const active = filteredPatient[0]?.status === 'active';
    return (
        isLoading || !allowance ?
            <CircularLoader text='Loading patients...' height='40vh' /> :
            <MainCard title="Add New Trip">
                {allowance ?
                    <>
                        <Formik
                            initialValues={{
                                // trip_id: null,
                            }}
                        >
                            {({ handleSubmit, values, setFieldValue }) => {
                                return (
                                    <form noValidate onSubmit={handleSubmit}>
                                        <DebouncedDropdown
                                            label="Patient"
                                            values={values}
                                            setFieldValue={(field, value) => {
                                                setFieldValue(field, value);
                                                setSelected(value);
                                            }}
                                            apiEndpoint="/search-trip-patients"
                                            extraDataMapper={(item) => setSelectedTrip(item)}
                                            valueKey="id"
                                            displayKeys={[
                                                'name',
                                                'patient_detail.phone_number',
                                                'patient_detail.social_security_number',
                                                'patient_detail.medicaid_number',
                                                'city',
                                                'patient_detail.gender',
                                                'patient_detail.mobility',
                                                'patient_detail.funding_source'
                                            ]}
                                            searchPararm={true}
                                        />
                                    </form>
                                );
                            }}
                        </Formik>
                        <TripDetail filteredPatient={filteredPatient} setShowForm={setShowForm} />
                        {showForm && active &&
                            <AddTripForm mappedPatients={selectedTrip} allowance={allowance} />
                        }
                    </>
                    :
                    <EmptyCityCard message="No Allowances found!" description="To add new Trip first and allowances." icon={<HiOutlineShieldExclamation size={24} />} buttonText="Add allowances" link="/reimbursement-trips/allowances" />
                }
            </MainCard>
    )
}
