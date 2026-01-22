import React, { useEffect, useState } from 'react'
import MainCard from 'components/MainCard';
import { openSnackbar } from 'api/snackbar';
import { fetcher } from 'utils/axios';
import TripDetail from 'components/pages/reimbursement-trips/trip-detail';
import AddTripForm from './add-trip-form';
import CircularLoader from 'components/common/loader/CircularLoader';
import { Formik } from 'formik';
import DebouncedDropdown from 'pages/standing-orders/PatientDropDown';

export const AddTrip = () => {
    const [selected, setSelected] = useState(null);
    const [patientsData, setPatientsData] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedTrip, setSelectedTrip] = useState({});
    const getPatients = async () => {
        setIsLoading(true)
        try {
            const response = await fetcher(["/search-trip-patients"]);
            if (response?.status === true) {
                setPatientsData(response?.data?.data);
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
    const SelectedPatient = filteredPatient[0];

    useEffect(() => {
        getPatients();
    }, [])

    return (
        <MainCard title={`Add New Trip`}>
            {SelectedPatient?.status && SelectedPatient?.status !== 'active' && (
                <p style={{ color: 'red', position: 'absolute', top: '7px', left: '115px' }}>
                    (Trips can only be added for active patients only)
                </p>
            )}
            {isLoading ?
                <CircularLoader height='100%' />
                :
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
                    <TripDetail filteredPatient={filteredPatient} setShowForm={setShowForm} buttonText="Add Trip" />
                    {showForm && SelectedPatient?.status === 'active' && <AddTripForm mappedPatients={SelectedPatient} />}
                </>
            }
        </MainCard>
    )
}
