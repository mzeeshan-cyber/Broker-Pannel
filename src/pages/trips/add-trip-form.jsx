import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import MainCard from 'components/MainCard';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, CircularProgress, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { openSnackbar } from 'api/snackbar';
import { fetcher } from 'utils/axios';
import { repeating, mobility, gender, hospitalDischarge, pickupFacilityNamesAddTrip, dropoffFacilityNamesAddTrip, tripAttendant, tripBoasterSeats } from 'constants/constants';
import SelectDropDown from 'components/common/SelectDropDown';
import PhoneNumber from 'components/@extended/PhoneNumber';
import axios from 'axios';
import { decryptToken } from 'utils/tokenUtils';
import AddressField from 'components/common/AddressField';

import { useNavigate } from 'react-router';
import GoogleMapWithPolylineWithoutMatrixApi from 'components/common/map/google-map-without-matrix-api';
import TimePicker24 from 'components/common/TimePicker24';
import { useTheme } from '@emotion/react';

export default function AddTripForm({ mappedPatients }) {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const [hospitalsData, setHospitalsData] = useState([]);
    const [loacationData, setLoacationData] = useState({});
    const [showMap, setShowMap] = useState(false);
    const navigate = useNavigate();
    const formikRef = useRef();
    const theme = useTheme()

    const getLatLng = async (pickup, dropoff) => {
        try {
            const response = await axios.post(`${API_URL}origin-to-destination-details`, { origin: pickup, destination: dropoff }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
            });
            if (response.status === 200) {
                setLoacationData(response.data.data)
            }

        } catch (error) {
            openSnackbar({
                open: true,
                message: error.response.data.message || 'Server issue!',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
    }
    const getHospitals = async () => {
        const response = await fetcher(["/trips/hospitals"]);
        if (response.status === true) {
            setHospitalsData(
                response?.data?.map((item) => ({
                    label: item?.name,
                    value: item?.id,
                    address: item.address,
                }))
            );

        }
        else {
            setHospitalsData(
                {
                    label: 'Api/Server Issue',
                    value: ''
                }
            );
        }
    };
    const AddTrip = async (values, { setErrors, setSubmitting }) => {
        try {
            const response = await axios.post(`${API_URL}trips/store`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
            });

            if (response.status === 200) {
                openSnackbar({
                    open: true,
                    message: 'Trip added successfully!',
                    variant: 'success',
                    alert: { color: 'success' }
                });
                navigate('/approved-trips');
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setSubmitting(false);
        }
    };
    function calculatePickupTime(appointmentTime, durationSeconds) {
        // Split appointment time
        const [hours, minutes] = appointmentTime.split(':').map(Number);

        // Convert to total seconds
        const appointmentInSeconds = hours * 3600 + minutes * 60;

        // Subtract (duration * 1.5)
        let pickupInSeconds = appointmentInSeconds - durationSeconds * 1.5;

        // Normalize to within 0–86399 seconds (handle multi-day wrap)
        pickupInSeconds = ((pickupInSeconds % (24 * 3600)) + (24 * 3600)) % (24 * 3600);

        // Convert back to HH:mm
        const pickupHours = Math.floor(pickupInSeconds / 3600);
        const pickupMinutes = Math.floor((pickupInSeconds % 3600) / 60);

        // Format with leading zeros
        const formattedTime = `${String(pickupHours).padStart(2, '0')}:${String(pickupMinutes).padStart(2, '0')}`;

        return formattedTime;
    }

    function calculateAppointmentTime(pickupTime, durationSeconds) {
        if (!pickupTime || !durationSeconds) return '';

        // Split pickup time
        const [hours, minutes] = pickupTime.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return '';

        // Convert to total seconds
        const pickupInSeconds = hours * 3600 + minutes * 60;

        // Add (duration * 1.5)
        let appointmentInSeconds = pickupInSeconds + durationSeconds * 1.5;

        // Handle overflow (next day wrap)
        if (appointmentInSeconds >= 24 * 3600) {
            appointmentInSeconds -= 24 * 3600;
        }

        // Convert back to HH:mm
        const appointmentHours = Math.floor(appointmentInSeconds / 3600);
        const appointmentMinutes = Math.floor((appointmentInSeconds % 3600) / 60);

        // Format with leading zeros
        return `${String(appointmentHours).padStart(2, '0')}:${String(appointmentMinutes).padStart(2, '0')}`;
    }

    useEffect(() => {
        getHospitals();
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMap(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const validationSchema = Yup.object().shape({
        service_date: Yup.date()
            .required("Service date is required")
            .min(new Date(), "Service date must be today or later"),

        mobility: Yup.string()
            .required("Mobility is required")
            .oneOf(["minivan", "sedan", "wheelchair"], "Invalid mobility type"),

        driver_gender: Yup.string().min(1).required("Driver gender is required"),
        is_two_way: Yup.string().required("This field is required"),
        is_bariatric: Yup.string().required("This field is required"),

        pickup_facility_name: Yup.string().required("This field is required"),
        pickup_phone: Yup.string()
            .required("This field is required")
            .matches(
                /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
                "Enter a valid US phone number"
            ),
        pickup_time: Yup.string().required("This field is required"),
        appointment_time: Yup.string().required("This field is required"),
        pickup_address: Yup.string().required("This field is required"),
        dropoff_facility_name: Yup.string().required("This field is required"),
        dropoff_phone: Yup.string()
            .required("This field is required")
            .matches(
                /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
                "Enter a valid US phone number"
            ),

        dropoff_address: Yup.string().required("This field is required"),
        hospital_discharge: Yup.string().required("This field is required"),

        pickup_hospital_id: Yup.string().when("pickup_facility_name", {
            is: (val) => val?.toLowerCase() === "hospital",
            then: (schema) => schema.required("Pickup hospital is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

        dropoff_hospital_id: Yup.string().when("dropoff_facility_name", {
            is: (val) => val?.toLowerCase() === "hospital",
            then: (schema) => schema.required("Dropoff hospital is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        pet_animal: Yup.string().required('Required'),
        is_shared: Yup.string()
            .required('Required')
            .test(
                'pet-animal-shared-rule',
                'Shared trips are not allowed when pet animal is selected.',
                function (value) {
                    const { pet_animal } = this.parent;
                    if (pet_animal === '1' && value !== '0') {
                        return false;
                    }
                    return true;
                }
            ),

        // ---------------- attendants and booster_seats ----------------
        attendants: Yup.string()
            .required("This field is required")
            .test("mobility-limit-attendants", null, function (value) {
                const { mobility, booster_seats, is_shared } = this.parent;
                const a = parseInt(value ?? "0", 10);
                const b = parseInt(booster_seats ?? "0", 10);

                if (is_shared === "1") {
                    if (a !== 0) {
                        return this.createError({
                            path: "attendants",
                            message: "Attendants must be 0 when trip is shared",
                        });
                    }
                    return true;
                }

                const total = a + b;
                const limits = { minivan: 5, sedan: 3, wheelchair: 2 };
                const limit = limits[mobility] ?? 5;

                if (mobility && total > limit) {
                    return this.createError({
                        path: "attendants",
                        message: `Total attendants + booster seats cannot exceed ${limit} for ${mobility}`,
                    });
                }

                return true;
            }),

        booster_seats: Yup.string()
            .required("This field is required")
            .test("mobility-limit-booster", null, function (value) {
                const { mobility, attendants, is_shared } = this.parent;
                const a = parseInt(attendants ?? "0", 10);
                const b = parseInt(value ?? "0", 10);

                if (is_shared === "1") {
                    if (b !== 0) {
                        return this.createError({
                            path: "booster_seats",
                            message: "Booster seats must be 0 when trip is shared",
                        });
                    }
                    return true;
                }

                const total = a + b;
                const limits = { minivan: 5, sedan: 3, wheelchair: 2 };
                const limit = limits[mobility] ?? 5;

                if (mobility && total > limit) {
                    return this.createError({
                        path: "booster_seats",
                        message: `Total attendants + booster seats cannot exceed ${limit} for ${mobility}`,
                    });
                }

                return true;
            }),
    });

    return (
        <Formik
            innerRef={formikRef}
            initialValues={{
                patient_id: mappedPatients?.id,
                service_date: '',
                mobility: '',
                driver_gender: 'any',
                attendants: '0',
                booster_seats: '0',
                pet_animal: '0',
                is_shared: '0',
                is_two_way: '0',
                is_bariatric: '0',
                pickup_facility_name: '',
                pickup_time: '',
                pickup_phone: '',
                pickup_address: '',
                pickup_directions: '',
                dropoff_facility_name: '',
                dropoff_phone: '',
                dropoff_address: '',
                dropoff_directions: '',
                hospital_discharge: '0',
                pickup_hospital_id: '',
                dropoff_hospital_id: '',
                appointment_time: '',
                // return trip fields (consistent naming)
                return_pickup_facility_name: '',
                return_pickup_phone: '',
                return_pickup_time: '',
                return_pickup_address: '',
                return_pickup_hospital_id: '',
                return_pickup_directions: '',
                return_dropoff_facility_name: '',
                return_dropoff_phone: '',
                return_dropoff_time: '',
                return_dropoff_address: '',
                return_dropoff_hospital_id: '',
                return_dropoff_directions: '',
            }}

            validationSchema={validationSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={AddTrip}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue, setErrors }) => {
                const isHospitalPickup = values.pickup_facility_name?.toLowerCase() === 'hospital';
                const isHospitalDropoff = values.dropoff_facility_name?.toLowerCase() === 'hospital';
                const isRoundtrip = values.is_two_way?.toLowerCase() == '1';

                useEffect(() => {
                    if (values.pickup_address && values.dropoff_address) {
                        getLatLng(values.pickup_address, values.dropoff_address);
                    }
                }, [values.pickup_address, values.dropoff_address]);

                useEffect(() => {
                    if (!isRoundtrip) return;

                    // --- Outbound Dropoff → Return Pickup ---
                    if (values.dropoff_facility_name) {
                        setFieldValue('return_pickup_facility_name', values.dropoff_facility_name);
                    }
                    if (values.dropoff_phone) {
                        setFieldValue('return_pickup_phone', values.dropoff_phone);
                    }
                    if (values.dropoff_hospital_id) {
                        setFieldValue('return_pickup_hospital_id', values.dropoff_hospital_id);
                    }
                    if (values.dropoff_address) {
                        setFieldValue('return_pickup_address', values.dropoff_address);
                    }

                    // --- Outbound Pickup → Return Dropoff ---
                    if (values.pickup_facility_name) {
                        setFieldValue('return_dropoff_facility_name', values.pickup_facility_name);
                    }
                    if (values.pickup_phone) {
                        setFieldValue('return_dropoff_phone', values.pickup_phone);
                    }
                    if (values.pickup_hospital_id) {
                        setFieldValue('return_dropoff_hospital_id', values.pickup_hospital_id);
                    }
                    if (values.pickup_address) {
                        setFieldValue('return_dropoff_address', values.pickup_address);
                    }
                }, [
                    isRoundtrip,
                    values.pickup_facility_name,
                    values.pickup_phone,
                    values.pickup_time,
                    values.pickup_hospital_id,
                    values.pickup_address,
                    values.dropoff_facility_name,
                    values.dropoff_phone,
                    values.appointment_time,
                    values.dropoff_hospital_id,
                    values.dropoff_address,
                ]);
                const pickupTime = calculatePickupTime(values?.appointment_time, loacationData?.details?.duration_seconds);
                const appointmentTime = calculateAppointmentTime(values?.return_pickup_time, loacationData?.details?.duration_seconds);
                useEffect(() => {
                    if (values?.appointment_time && loacationData?.details?.duration_seconds) {
                        if (pickupTime) {
                            setFieldValue('pickup_time', pickupTime);
                        }
                    }
                }, [pickupTime]);

                useEffect(() => {
                    if (values?.return_pickup_time && loacationData?.details?.duration_seconds) {
                        if (appointmentTime) {
                            setFieldValue('return_dropoff_time', appointmentTime);
                        }
                    }
                }, [appointmentTime]);

                return (
                    <form noValidate onSubmit={handleSubmit}>
                        <MainCard title="" sx={{ marginTop: '20px' }}>
                            <Grid container spacing={3} gridColumn={12}>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <InputLabel sx={{ marginBottom: '4px' }} htmlFor="service_date">Service Date</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.service_date && errors.service_date)}
                                        id="service_date"
                                        type="date"
                                        value={values.service_date}
                                        name="service_date"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{ min: new Date().toISOString().split("T")[0] }}
                                    />
                                    {touched.service_date && errors.service_date && (
                                        <FormHelperText error id="helper-text-service_date">
                                            {errors.service_date}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <SelectDropDown
                                        label="Gender"
                                        id="driver_gender"
                                        values={values.driver_gender}
                                        options={gender}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    {touched.driver_gender && errors.driver_gender && (
                                        <FormHelperText error id="helper-text-driver_gender">
                                            {errors.driver_gender}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <SelectDropDown
                                        label="Hospital Discharge"
                                        id="hospital_discharge"
                                        values={values.hospital_discharge}
                                        options={hospitalDischarge}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    {touched.hospital_discharge && errors.hospital_discharge && (
                                        <FormHelperText error id="helper-text-hospital_discharge">
                                            {errors.hospital_discharge}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <SelectDropDown
                                        label="Is Bariotric"
                                        id="is_bariatric"
                                        values={values.is_bariatric}
                                        options={repeating}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    {touched.is_bariatric && errors.is_bariatric && (
                                        <FormHelperText error id="helper-text-is_bariatric">
                                            {errors.is_bariatric}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <SelectDropDown
                                        label="Pet Animal"
                                        id="pet_animal"
                                        values={values.pet_animal}
                                        options={repeating}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    {touched.pet_animal && errors.pet_animal && (
                                        <FormHelperText error id="helper-text-pet_animal">
                                            {errors.pet_animal}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <SelectDropDown
                                        label="Shared Trip"
                                        id="is_shared"
                                        values={values.is_shared}
                                        options={repeating}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    {touched.is_shared && errors.is_shared && (
                                        <FormHelperText error id="helper-text-is_shared">
                                            {errors.is_shared}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <SelectDropDown
                                        label="Round Trip"
                                        id="is_two_way"
                                        values={values.is_two_way}
                                        options={repeating}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    {touched.is_two_way && errors.is_two_way && (
                                        <FormHelperText error id="helper-text-is_two_way">
                                            {errors.is_two_way}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sx={{ borderRadius: '10px', background: '#f7f7f794', border: '1px solid #e0e0e0ff', padding: '10px 25px 30px 10px', marginLeft: "25px", marginTop: '30px' }}>
                                    <Grid container spacing={3} gridColumn={12}>
                                        <Grid item xs={12} md={6} lg={4}>
                                            <SelectDropDown
                                                label="Mobility"
                                                id="mobility"
                                                values={values.mobility}
                                                options={mobility}
                                                setFieldValue={setFieldValue}
                                                touched={touched}
                                                errors={errors}
                                            />
                                            {touched.mobility && errors.mobility && (
                                                <FormHelperText error id="helper-text-mobility">
                                                    {errors.mobility}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4}>
                                            <SelectDropDown
                                                label="Boaster Seat"
                                                id="booster_seats"
                                                values={values.booster_seats}
                                                options={tripBoasterSeats}
                                                setFieldValue={setFieldValue}
                                                touched={touched}
                                                errors={errors}
                                            />
                                            {touched.booster_seats && errors.booster_seats && (
                                                <FormHelperText error id="helper-text-booster_seats">
                                                    {errors.booster_seats}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4}>
                                            <Box sx={{ position: 'relative' }}>
                                                <Box sx={{ flex: '1' }}>
                                                    <SelectDropDown
                                                        label="Attendants"
                                                        id="attendants"
                                                        values={values.attendants}
                                                        options={tripAttendant}
                                                        setFieldValue={setFieldValue}
                                                        touched={touched}
                                                        errors={errors}
                                                    />
                                                    {touched.attendants && errors.attendants && (
                                                        <FormHelperText error id="helper-text-attendants">
                                                            {errors.attendants}
                                                        </FormHelperText>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Box sx={isRoundtrip ? { background: '#f1f1f1ff', marginTop: '20px', marginLeft: '25px', padding: '20px', width: "100%", borderRadius: '20px' } : { marginLeft: '0px', width: "98%" }}>
                                    {isRoundtrip &&
                                        <Typography variant='h4'>Round Trip</Typography>
                                    }
                                    <Grid container spacing={3} sx={isRoundtrip ? { margin: '0 -25px' } : { margin: '0 auto' }}>
                                        <Grid item xs={12} md={6}>
                                            <MainCard
                                                title={`Pickup Address`}
                                                sx={{ marginTop: '0px' }}
                                            >
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6} lg={4}>
                                                        <SelectDropDown
                                                            label="Facility Name"
                                                            id={`pickup_facility_name`}
                                                            values={values.pickup_facility_name}
                                                            options={pickupFacilityNamesAddTrip}
                                                            setFieldValue={setFieldValue}
                                                            touched={touched.pickup_facility_name}
                                                            errors={errors.pickup_facility_name}
                                                        />
                                                        {touched.pickup_facility_name &&
                                                            errors.pickup_facility_name && (
                                                                <FormHelperText error>
                                                                    {errors.pickup_facility_name}
                                                                </FormHelperText>
                                                            )}
                                                    </Grid>
                                                    <Grid item xs={12} md={6} lg={4}>
                                                        <PhoneNumber
                                                            id={`pickup_phone`}
                                                            value={values.pickup_phone}
                                                            onChange={(phone) =>
                                                                setFieldValue(`pickup_phone`, phone)
                                                            }
                                                            onBlur={handleBlur}
                                                            touched={touched.pickup_phone}
                                                            error={errors.pickup_phone}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6} lg={4}>
                                                        <TimePicker24
                                                            id="pickup_time"
                                                            label="Pickup Time"
                                                            type="time"
                                                            touched={touched.pickup_time}
                                                            errors={errors.pickup_time}
                                                            values={values.pickup_time}
                                                            handleBlur={handleBlur}
                                                            handleChange={handleChange}
                                                            disabled={!values?.appointment_time || !loacationData?.details?.duration_seconds}
                                                        />
                                                    </Grid>
                                                    {isHospitalPickup && hospitalsData && (
                                                        <Grid item xs={12} md={6} lg={6}>
                                                            <SelectDropDown
                                                                label="Hospitals"
                                                                id="pickup_hospital_id"
                                                                values={values.pickup_hospital_id}
                                                                options={hospitalsData}
                                                                setFieldValue={(field, val) => {
                                                                    setFieldValue(field, val);
                                                                    const selectedHospital = hospitalsData.find(h => h.value === val);
                                                                    if (selectedHospital) {
                                                                        setFieldValue("pickup_address", selectedHospital.address);
                                                                    } else {
                                                                        setFieldValue("pickup_address", "");
                                                                    }
                                                                }}
                                                                touched={touched.pickup_hospital_id}
                                                                errors={errors.pickup_hospital_id}
                                                            />
                                                            {touched.pickup_hospital_id && errors.pickup_hospital_id && (
                                                                <FormHelperText error>
                                                                    {errors.pickup_hospital_id}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>
                                                    )}
                                                    <Grid item xs={12} md={isHospitalPickup ? 6 : 12}>
                                                        <AddressField
                                                            id={`pickup_address`}
                                                            label="Pickup Address"
                                                            placeholder="Enter Address"
                                                            touched={touched.pickup_address}
                                                            errors={errors.pickup_address}
                                                            values={values.pickup_address}
                                                            handleBlur={handleBlur}
                                                            setFieldValue={setFieldValue}
                                                            disabled={isHospitalPickup}
                                                        />
                                                        {touched.pickup_address &&
                                                            errors.pickup_address && (
                                                                <FormHelperText error>
                                                                    {errors.pickup_address}
                                                                </FormHelperText>
                                                            )}
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Stack spacing={1}>
                                                            <InputLabel htmlFor={`pickup_directions`}>
                                                                Notes
                                                            </InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                error={Boolean(
                                                                    touched.pickup_directions &&
                                                                    errors.pickup_directions
                                                                )}
                                                                id={`pickup_directions`}
                                                                name={`pickup_directions`}
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                value={values.pickup_directions || ''}
                                                                placeholder="Enter your note"
                                                                multiline
                                                                rows={4}
                                                                variant="outlined"
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </MainCard>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <MainCard
                                                title={`Dropoff Address`}
                                                sx={{ marginTop: '0px' }}
                                            >
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6} lg={4}>
                                                        <SelectDropDown
                                                            label="Facility Name"
                                                            id={`dropoff_facility_name`}
                                                            values={values.dropoff_facility_name}
                                                            options={dropoffFacilityNamesAddTrip}
                                                            setFieldValue={setFieldValue}
                                                            touched={touched.dropoff_facility_name}
                                                            errors={errors.dropoff_facility_name}
                                                        />
                                                        {touched.dropoff_facility_name &&
                                                            errors.dropoff_facility_name && (
                                                                <FormHelperText error>
                                                                    {errors.dropoff_facility_name}
                                                                </FormHelperText>
                                                            )}
                                                    </Grid>
                                                    <Grid item xs={12} md={6} lg={4}>
                                                        <PhoneNumber
                                                            id={`dropoff_phone`}
                                                            value={values.dropoff_phone}
                                                            onChange={(phone) =>
                                                                setFieldValue(`dropoff_phone`, phone)
                                                            }
                                                            onBlur={handleBlur}
                                                            touched={touched.dropoff_phone}
                                                            error={errors.dropoff_phone}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6} lg={4}>
                                                        <TimePicker24
                                                            id="appointment_time"
                                                            label="App/Dropoff Time"
                                                            type="time"
                                                            touched={touched.appointment_time}
                                                            errors={errors.appointment_time}
                                                            values={values.appointment_time}
                                                            handleBlur={handleBlur}
                                                            handleChange={handleChange}
                                                        />
                                                    </Grid>
                                                    {isHospitalDropoff && hospitalsData && (
                                                        <Grid item xs={12} md={6} lg={6}>
                                                            <SelectDropDown
                                                                label="Hospitals"
                                                                id="dropoff_hospital_id"
                                                                values={values.dropoff_hospital_id}
                                                                options={hospitalsData}
                                                                setFieldValue={(field, val) => {
                                                                    setFieldValue(field, val);
                                                                    const selectedHospital = hospitalsData.find(h => h.value === val);
                                                                    if (selectedHospital) {
                                                                        setFieldValue("dropoff_address", selectedHospital.address);
                                                                    } else {
                                                                        setFieldValue("dropoff_address", "");
                                                                    }
                                                                }}
                                                                touched={touched.dropoff_hospital_id}
                                                                errors={errors.dropoff_hospital_id}
                                                            />
                                                            {touched.dropoff_hospital_id && errors.dropoff_hospital_id && (
                                                                <FormHelperText error>
                                                                    {errors.dropoff_hospital_id}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>
                                                    )}
                                                    <Grid item xs={12} md={isHospitalDropoff ? 6 : 12}>
                                                        <AddressField
                                                            id={`dropoff_address`}
                                                            label="Dropoff Address"
                                                            placeholder="Enter Address"
                                                            touched={touched.dropoff_address}
                                                            errors={errors.dropoff_address}
                                                            values={values.dropoff_address}
                                                            handleBlur={handleBlur}
                                                            setFieldValue={setFieldValue}
                                                            disabled={isHospitalDropoff}
                                                        />
                                                        {touched.dropoff_address &&
                                                            errors.dropoff_address && (
                                                                <FormHelperText error>
                                                                    {errors.dropoff_address}
                                                                </FormHelperText>
                                                            )}
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Stack spacing={1}>
                                                            <InputLabel htmlFor={`dropoff_directions`}>
                                                                Notes
                                                            </InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                error={Boolean(
                                                                    touched.dropoff_directions &&
                                                                    errors.dropoff_directions
                                                                )}
                                                                id={`dropoff_directions`}
                                                                name={`dropoff_directions`}
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                value={values.dropoff_directions || ''}
                                                                placeholder="Enter your note"
                                                                multiline
                                                                rows={4}
                                                                variant="outlined"
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </MainCard>
                                        </Grid>
                                        {isRoundtrip && (
                                            <>
                                                {/* Return - Pickup (this should mirror outbound Dropoff) */}
                                                <Grid item xs={12} md={6}>
                                                    <MainCard title="Pickup Address" sx={{ marginTop: '0px' }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={6} lg={4}>
                                                                <SelectDropDown
                                                                    label="Facility Name"
                                                                    id="return_pickup_facility_name"
                                                                    values={values.return_pickup_facility_name}
                                                                    options={dropoffFacilityNamesAddTrip}
                                                                    setFieldValue={setFieldValue}
                                                                    touched={touched.return_pickup_facility_name}
                                                                    errors={errors.return_pickup_facility_name}
                                                                />
                                                                {touched.return_pickup_facility_name && errors.return_pickup_facility_name && (
                                                                    <FormHelperText error>{errors.return_pickup_facility_name}</FormHelperText>
                                                                )}
                                                            </Grid>

                                                            <Grid item xs={12} md={6} lg={4}>
                                                                <PhoneNumber
                                                                    id="return_pickup_phone"
                                                                    value={values.return_pickup_phone}
                                                                    onChange={(phone) => setFieldValue('return_pickup_phone', phone)}
                                                                    onBlur={handleBlur}
                                                                    touched={touched.return_pickup_phone}
                                                                    error={errors.return_pickup_phone}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} md={6} lg={4}>
                                                                <TimePicker24
                                                                    id="return_pickup_time"
                                                                    label="Pickup Time"
                                                                    type="time"
                                                                    touched={touched.return_pickup_time}
                                                                    errors={errors.return_pickup_time}
                                                                    values={values.return_pickup_time}
                                                                    handleBlur={handleBlur}
                                                                    handleChange={handleChange}
                                                                />
                                                            </Grid>

                                                            {isHospitalDropoff && hospitalsData && (
                                                                <Grid item xs={12} md={6} lg={6}>
                                                                    <SelectDropDown
                                                                        label="Hospitals"
                                                                        id="return_pickup_hospital_id"
                                                                        values={values.return_pickup_hospital_id}
                                                                        options={hospitalsData}
                                                                        setFieldValue={(field, val) => {
                                                                            setFieldValue(field, val);
                                                                            const selectedHospital = hospitalsData.find((h) => h.value === val);
                                                                            if (selectedHospital) {
                                                                                setFieldValue('return_pickup_address', selectedHospital.address);
                                                                            } else {
                                                                                setFieldValue('return_pickup_address', '');
                                                                            }
                                                                        }}
                                                                        touched={touched.return_pickup_hospital_id}
                                                                        errors={errors.return_pickup_hospital_id}
                                                                    />
                                                                    {touched.return_pickup_hospital_id && errors.return_pickup_hospital_id && (
                                                                        <FormHelperText error>{errors.return_pickup_hospital_id}</FormHelperText>
                                                                    )}
                                                                </Grid>
                                                            )}

                                                            <Grid item xs={12} md={isHospitalDropoff ? 6 : 12}>
                                                                <AddressField
                                                                    id="return_pickup_address"
                                                                    label="Pickup Address"
                                                                    placeholder="Enter Address"
                                                                    touched={touched.return_pickup_address}
                                                                    errors={errors.return_pickup_address}
                                                                    values={values.return_pickup_address}
                                                                    handleBlur={handleBlur}
                                                                    setFieldValue={setFieldValue}
                                                                    disabled={isHospitalDropoff}
                                                                />
                                                                {touched.return_pickup_address && errors.return_pickup_address && (
                                                                    <FormHelperText error>{errors.return_pickup_address}</FormHelperText>
                                                                )}
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="return_pickup_directions">Notes</InputLabel>
                                                                    <TextField
                                                                        fullWidth
                                                                        error={Boolean(touched.return_pickup_directions && errors.return_pickup_directions)}
                                                                        id="return_pickup_directions"
                                                                        name="return_pickup_directions"
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        value={values.return_pickup_directions || ''}
                                                                        placeholder="Enter your note"
                                                                        multiline
                                                                        rows={4}
                                                                        variant="outlined"
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </MainCard>
                                                </Grid>

                                                {/* Return - Dropoff (this should mirror outbound Pickup) */}
                                                <Grid item xs={12} md={6}>
                                                    <MainCard title="Dropoff Address" sx={{ marginTop: '0px' }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={6} lg={4}>
                                                                <SelectDropDown
                                                                    label="Facility Name"
                                                                    id="return_dropoff_facility_name"
                                                                    values={values.return_dropoff_facility_name}
                                                                    options={pickupFacilityNamesAddTrip}
                                                                    setFieldValue={setFieldValue}
                                                                    touched={touched.return_dropoff_facility_name}
                                                                    errors={errors.return_dropoff_facility_name}
                                                                />
                                                                {touched.return_dropoff_facility_name && errors.return_dropoff_facility_name && (
                                                                    <FormHelperText error>{errors.return_dropoff_facility_name}</FormHelperText>
                                                                )}
                                                            </Grid>

                                                            <Grid item xs={12} md={6} lg={4}>
                                                                <PhoneNumber
                                                                    id="return_dropoff_phone"
                                                                    value={values.return_dropoff_phone}
                                                                    onChange={(phone) => setFieldValue('return_dropoff_phone', phone)}
                                                                    onBlur={handleBlur}
                                                                    touched={touched.return_dropoff_phone}
                                                                    error={errors.return_dropoff_phone}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} md={6} lg={4}>
                                                                <TimePicker24
                                                                    id="return_dropoff_time"
                                                                    label="Dropoff Time"
                                                                    type="time"
                                                                    touched={touched.return_dropoff_time}
                                                                    errors={errors.return_dropoff_time}
                                                                    values={values.return_dropoff_time}
                                                                    handleBlur={handleBlur}
                                                                    handleChange={handleChange}
                                                                    disabled={!values?.return_pickup_time || !loacationData?.details?.duration_seconds}
                                                                />
                                                            </Grid>

                                                            {isHospitalPickup && hospitalsData && (
                                                                <Grid item xs={12} md={6} lg={6}>
                                                                    <SelectDropDown
                                                                        label="Hospitals"
                                                                        id="return_dropoff_hospital_id"
                                                                        values={values.return_dropoff_hospital_id}
                                                                        options={hospitalsData}
                                                                        setFieldValue={(field, val) => {
                                                                            setFieldValue(field, val);
                                                                            const selectedHospital = hospitalsData.find((h) => h.value === val);
                                                                            if (selectedHospital) {
                                                                                setFieldValue('return_dropoff_address', selectedHospital.address);
                                                                            } else {
                                                                                setFieldValue('return_dropoff_address', '');
                                                                            }
                                                                        }}
                                                                        touched={touched.return_dropoff_hospital_id}
                                                                        errors={errors.return_dropoff_hospital_id}
                                                                    />
                                                                    {touched.return_dropoff_hospital_id && errors.return_dropoff_hospital_id && (
                                                                        <FormHelperText error>{errors.return_dropoff_hospital_id}</FormHelperText>
                                                                    )}
                                                                </Grid>
                                                            )}

                                                            <Grid item xs={12} md={isHospitalPickup ? 6 : 12}>
                                                                <AddressField
                                                                    id="return_dropoff_address"
                                                                    label="Dropoff Address"
                                                                    placeholder="Enter Address"
                                                                    touched={touched.return_dropoff_address}
                                                                    errors={errors.return_dropoff_address}
                                                                    values={values.return_dropoff_address}
                                                                    handleBlur={handleBlur}
                                                                    setFieldValue={setFieldValue}
                                                                    disabled={isHospitalPickup}
                                                                />
                                                                {touched.return_dropoff_address && errors.return_dropoff_address && (
                                                                    <FormHelperText error>{errors.return_dropoff_address}</FormHelperText>
                                                                )}
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="return_dropoff_directions">Notes</InputLabel>
                                                                    <TextField
                                                                        fullWidth
                                                                        error={Boolean(touched.return_dropoff_directions && errors.return_dropoff_directions)}
                                                                        id="return_dropoff_directions"
                                                                        name="return_dropoff_directions"
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        value={values.return_dropoff_directions || ''}
                                                                        placeholder="Enter your note"
                                                                        multiline
                                                                        rows={4}
                                                                        variant="outlined"
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </MainCard>
                                                </Grid>
                                            </>
                                        )}

                                    </Grid>
                                </Box>

                                <Grid item xs={12}>
                                    {showMap && values.pickup_address && values.dropoff_address &&
                                        <>
                                            <GoogleMapWithPolylineWithoutMatrixApi data={loacationData} />
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg">Distances & Durations:</h3>
                                                <ul className="list-disc pl-5">
                                                    <li className="mb-2">
                                                        From <strong>{loacationData?.pickup?.address}</strong> to <strong>{loacationData?.dropoff?.address}</strong>: <br />
                                                        🚗 <b>{loacationData?.details?.distance} miles</b> – 🕒 <b>{loacationData?.details?.duration}</b>
                                                    </li>
                                                </ul>
                                            </div>
                                        </>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 4 }}>
                                        <Button disableElevation disabled={isSubmitting} variant="contained" type="submit" sx={{
                                                    '&.Mui-disabled': {
                                                        bgcolor: theme.palette.primary.main,
                                                    }
                                                }}>
                                            {isSubmitting ? (
                                                <CircularProgress sx={{ height: '20px !important', width: '20px !important', color:'white' }} />
                                            ) : (
                                                'Add Trip'
                                            )}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </form>
                );
            }}
        </Formik>
    );
}
