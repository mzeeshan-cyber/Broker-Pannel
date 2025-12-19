import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import MainCard from 'components/MainCard';
import * as Yup from 'yup';
import { FieldArray, Formik } from 'formik';
import { Box, Button, CircularProgress, InputLabel, OutlinedInput, TextField, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { openSnackbar } from 'api/snackbar';
import { fetcher, fetcherPost } from 'utils/axios';
import { tripAllowances, days, facilityNames, fundingSources, reimbursementAllowances, repeating, tickets, travelThrough } from 'constants/constants';
import SelectDropDown from 'components/common/SelectDropDown';
import InputField from 'components/common/InputField';
import MultipleSelectCheckmarks from 'components/common/MultipleSelect';
import MultiDates from 'components/common/MultiDates';
import DropzonePage from './select-files';
import { Add, Trash } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import TripAddPayeeModal from 'components/pages/reimbursement-trips/trip-add-payee-modal';
import TripAddAttendentModal from 'components/pages/reimbursement-trips/trip-add-attendent-modal';
import TripReimbursementDriver from 'components/pages/reimbursement-trips/trip-reimbursement-driver';
import { BiDollar } from 'react-icons/bi';
import PhoneNumber from 'components/@extended/PhoneNumber';
import axios from 'axios';
import { decryptToken } from 'utils/tokenUtils';
import AddressField from 'components/common/AddressField';
import GoogleMapWithPolyline from 'components/common/map/google-map-with-poly-line';
import { calculateEndTime, convertMinutesToHHMM, getAllowanceAvailability, getStartTime } from 'constants/utilities';
import { useNavigate } from 'react-router';
import TimePicker24 from 'components/common/TimePicker24';
import { toNumber } from 'lodash';
import CircularLoader from 'components/common/loader/CircularLoader';
import IconButton from 'components/@extended/IconButton';
import { useTheme } from '@emotion/react';

export default function AddTripForm({ mappedPatients, allowance }) {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const [openModalPayee, setOpenModalPayee] = useState(false);
    const [openModalAttendent, setOpenModalAttendent] = useState(false);
    const [openModalDriver, setOpenModalDriver] = useState(false);
    const [payeeData, setPayeeData] = useState([]);
    const [attendantsData, setAttendantsData] = useState([]);
    const [reimbursementDriverData, setReimbursementDriverData] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [loadingMap, setLoadingMap] = useState(false);
    const [distances, setDistances] = useState([]);
    const navigate = useNavigate()
    const [tripData, setTripData] = useState([]);
    const theme = useTheme()


    function parseDurationToMinutes(durationStr) {
        let totalMinutes = 0;

        // Match "X day(s)"
        const dayMatch = durationStr.match(/(\d+)\s*day/);
        if (dayMatch) {
            totalMinutes += parseInt(dayMatch[1], 10) * 24 * 60;
        }

        // Match "X hour(s)"
        const hourMatch = durationStr.match(/(\d+)\s*hour/);
        if (hourMatch) {
            totalMinutes += parseInt(hourMatch[1], 10) * 60;
        }

        // Match "X min(s)"
        const minMatch = durationStr.match(/(\d+)\s*min/);
        if (minMatch) {
            totalMinutes += parseInt(minMatch[1], 10);
        }

        return totalMinutes;
    }
    const result = distances.map(item => ({
        ...item,
        duration_minutes: parseDurationToMinutes(item.duration)
    }));
    const durationInMins = result.reduce((sum, item) => sum + item.duration_minutes, 0);


    const getPayeeData = async () => {
        const params = {
            patient_id: mappedPatients?.id,
            per_page: "all",
        }
        const response = await fetcher(["/patient-payees", { params }]);
        if (response.status === true) {
            setPayeeData(response?.data);
        }
    };
    const getAttendentsData = async () => {
        const params = {
            patient_id: mappedPatients?.id,
            per_page: "all",
        }
        const response = await fetcher(["/patient-attendants", { params }]);
        if (response.status === true) {
            setAttendantsData(response?.data);
        }
    };
    const getDriversData = async () => {
        const params = {
            patient_id: mappedPatients?.id,
            per_page: "all",
        }
        const response = await fetcher(["/reimbursement-drivers", { params }]);
        if (response.status === true) {
            setReimbursementDriverData(response?.data);
        }
    };
    const AddPayee = async (values) => {
        const response = await fetcherPost(['/patient-payees', values]);
        if (response.status === true) {
            openSnackbar({
                open: true,
                message: response.message || 'Payee added successfully!',
                variant: 'alert',
                alert: { color: 'success' }
            });
            setOpenModalPayee(false)
            getPayeeData()
        }
    };
    const AddAttendent = async (values) => {
        const response = await fetcherPost([`/patient-attendants`, values])
        if (response.status === true) {
            openSnackbar({
                open: true,
                message: response.message || 'Attendent added successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
            setOpenModalAttendent(false)
            getAttendentsData()
        }
    };
    const AddTrip = async (values) => {
        const formData = new FormData();
        const safeAppend = (formData, key, value) => {
            if (value === null || value === undefined) return;
            formData.append(key, value);
        };

        formData.append('patient_id', values.patient_id);
        formData.append('departure_date', values.departure_date);
        formData.append('app_time', values.app_time);
        formData.append('reimbursement_driver_id', values.reimbursement_driver_id);
        formData.append('funding_source', values.funding_source);
        formData.append('repeating', values.repeating);
        formData.append('payee_id', values.payee_id);
        formData.append('tickets', values.tickets);
        formData.append('is_allowance', allowance?.allow_attendant);
        formData.append('tickets_cost', toNumber(values.tickets_cost));
        values.attendants_id.forEach((id, index) => {
            formData.append(`attendants[${index}][id]`, id);
        });
        formData.append('extra_amount', toNumber(values.extra_amount));
        formData.append('reason', values.reason);
        values.repeat_date.forEach((item, index) => {
            formData.append(`repeat_date[${index}]`, item);
        });
        values.mobility.forEach((item, index) => {
            formData.append(`mobility[${index}]`, item);
        });
        if (values.repeating === '1' && Array.isArray(values.repeat_day)) {
            values.repeat_day.forEach((day, index) => {
                formData.append(`repeat_day[${index}]`, day);
            });
        }
        values.location_points.forEach((point, index) => {
            formData.append(`location_points[${index}][address]`, point.address);
            formData.append(`location_points[${index}][facility_name]`, point.facility_name);
            formData.append(`location_points[${index}][phone]`, point.phone);
            formData.append(`location_points[${index}][note]`, point.note);
            formData.append(`location_points[${index}][city]`, point.city);
            formData.append(`location_points[${index}][state]`, point.state);
            formData.append(`location_points[${index}][zipCode]`, point.zipCode);
            safeAppend(formData, `location_points[${index}][travel_through]`, point.travel_through);
            formData.append(`location_points[${index}][country]`, point.country);
            if (point.latlng) {
                if (point.latlng) {
                    safeAppend(formData, `location_points[${index}][latlng][lat]`, Number(point.latlng.lat));
                    safeAppend(formData, `location_points[${index}][latlng][lng]`, Number(point.latlng.lng));
                }

            }

        });
        const trips = values.trip_details;
        const locations = values.location_points;

        const personalDriverDistances = locations
            .map((loc, i) => {
                if (i === 0) return null;
                if (loc.travel_through === "personal_driver") {
                    return trips[i - 1]?.details?.distance;
                }
                return null;
            })
            .filter(Boolean);
        const totalDistance = personalDriverDistances.reduce((sum, val) => sum + val, 0);
        formData.append("personal_driver_millage", totalDistance);

        const totalDetails = values.trip_details.reduce(
            (acc, trip) => {
                if (trip.details) {
                    acc.distance += trip.details.distance || 0;
                    acc.actual_distance += trip.details.actual_distance || 0;
                    acc.duration_seconds += trip.details.duration_seconds || 0;
                }
                return acc;
            },
            { distance: 0, actual_distance: 0, duration_seconds: 0 }
        );

        // Optionally convert seconds to hours/minutes string
        const hours = Math.floor(totalDetails.duration_seconds / 3600);
        const minutes = Math.floor((totalDetails.duration_seconds % 3600) / 60);
        totalDetails.duration = `${hours} hours ${minutes} mins`;

        // Send as single object
        formData.append("trip_distance", (totalDetails?.distance));
        formData.append("duration", (totalDetails?.duration));
        formData.append("duration_seconds", (totalDetails?.duration_seconds));
        values.ticket_file.forEach((file, index) => {
            if (file instanceof File) {
                formData.append(`ticket_file[${index}]`, file);
            }
        });
        values.allowances.forEach((item, index) => {
            formData.append(`allowances[${index}]`, item);
        });

        // If using react-dropzone, and file has a file property inside:
        // formData.append(`ticket_file[${index}]`, file.file);

        try {
            const response = await axios.post(`${API_URL}store-reimbursement-trip`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
            });
            if (response.status === 200) {
                openSnackbar({
                    open: true,
                    message: 'Reimbursement Trip added successfully!',
                    variant: 'alert',
                    alert: { color: 'success' }
                });
                navigate('/reimbursement-trips');
            }

        } catch (error) {
            openSnackbar({
                open: true,
                message: error.response.data.message || 'Reimbursement Trip not added!',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
    };
    const getLatLng = async (pickup, dropoff) => {
        setLoadingMap(true);
        try {
            const response = await axios.post(
                `${API_URL}origin-to-destination-details`,
                { origin: pickup, destination: dropoff },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${decryptedToken}`,
                    },
                }
            );
            if (response.status === 200) {
                setLoadingMap(false);
                return response.data.data;
            }
        } catch (error) {
            setLoadingMap(false);
            openSnackbar({
                open: true,
                message: error.response?.data?.message || 'Server issue!',
                variant: 'alert',
                alert: { color: 'error' }
            });
            return null;
        }
    };

    useEffect(() => {
        getPayeeData();
        getAttendentsData();
        getDriversData()
    }, [mappedPatients?.id])

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMap(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const payeeList = payeeData.map(item => ({
        value: item.id,
        label: item.account_holder_name
    }));
    const driverList = reimbursementDriverData.map(item => ({
        value: item.id,
        label: item.driver_name
    }));
    return (
        <Formik
            initialValues={{
                patient_id: mappedPatients?.id,
                departure_date: '',
                app_time: '',
                mobility: [],
                reimbursement_driver_id: '',
                funding_source: '',
                repeating: '',
                repeat_day: '',
                repeat_date: [],
                payee_id: '',
                attendants: [{ id: null }],
                attendants_id: [],
                ticket_file: [],
                tickets: [],
                tickets_cost: '',
                extra_amount: '',
                reason: '',
                trip_distance: '',
                duration: '',
                duration_seconds: '',
                location_points: [
                    {
                        address: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: '',
                        latlng: { lat: '', lng: '' },
                        facility_name: "pickup",
                        travel_through: '',
                        phone: '',
                        note: ''
                    },
                    {
                        address: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: '',
                        latlng: { lat: '', lng: '' },
                        facility_name: '',
                        travel_through: '',
                        phone: '',
                        note: ''
                    },
                ],
                allowances: [],
            }}
            validationSchema={Yup.object().shape({
                departure_date: Yup.string().max(255).required('Departure date is required'),
                app_time: Yup.string().max(255).required('Appointment time is required'),
                mobility: Yup.array().min(1).required('Mobility is required'),
                repeating: Yup.string().max(255).required('Repeating is required'),
                payee_id: Yup.string().max(255).required('Payee is required'),
                funding_source: Yup.string().max(255).required('Funding source is required'),
                repeat_day: Yup.array()
                    .when('repeating', {
                        is: (repeating) => repeating === '1',
                        then: (schema) =>
                            schema
                                .min(1, 'Repeat Day is required')
                                .required('Repeat Day is required'),
                        otherwise: (schema) => schema.notRequired(),
                    }),
                repeat_date: Yup.array()
                    .when('repeating', {
                        is: (repeating) => repeating === '1',
                        then: (schema) =>
                            schema
                                .min(1, 'Repeat Date is required')
                                .required('Repeat Date is required'),
                        otherwise: (schema) => schema.notRequired(),
                    }),
                location_points: Yup.array().of(
                    Yup.object().shape({
                        address: Yup.string().required("Address is required"),
                        facility_name: Yup.string().required("Facility name is required"),
                        phone: Yup.string()
                            .required("Phone is required")
                            .matches(
                                /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
                                "Enter a valid US phone number"
                            ),
                        travel_through: Yup.string().test(
                            "travel-through-validation",
                            "Travel through is required",
                            function (value) {
                                const { path, createError } = this;
                                const indexMatch = path.match(/\d+/);
                                const index = indexMatch ? Number(indexMatch[0]) : -1;

                                if (index === 0) return true; // skip first index

                                if (!value || value.trim() === "") {
                                    return createError({
                                        path: `${path}`, // attach error directly to travel_through
                                        message: "Travel through is required",
                                    });
                                }

                                return true;
                            }
                        ),
                    })
                ),
                ticket_file: Yup.array().when("mobility", {
                    is: (mobility) => Array.isArray(mobility) && mobility.includes("bus_ticket"),
                    then: (schema) =>
                        schema
                            .min(1, "Please upload at least one file.")
                            .required("Please upload at least one file."),
                    otherwise: (schema) => schema.notRequired(),
                }),
                tickets_cost: Yup.number()
                    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
                    .when("mobility", {
                        is: (mobility) => Array.isArray(mobility) && mobility.includes("bus_ticket"),
                        then: (schema) =>
                            schema.required("Ticket cost is required").typeError("Ticket cost must be a number"),
                        otherwise: (schema) => schema.notRequired(),
                    }),
                reimbursement_driver_id: Yup.string()
                    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
                    .when("mobility", {
                        is: (mobility) => Array.isArray(mobility) && mobility.includes("personal_driver"),
                        then: (schema) =>
                            schema.required("Reimbursement driver is required").typeError("Reimbursement driver must be a number"),
                        otherwise: (schema) => schema.notRequired(),
                    }),
            })}
            onSubmit={AddTrip}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                const isRepeating = ["1"].includes(values.repeating);
                const isTickets = values.mobility.includes("bus_ticket");
                const isPersonalDriver = values.mobility.includes("personal_driver");

                useEffect(() => {
                    const fetchDistancesForAllPoints = async () => {
                        const points = values.location_points || [];
                        const distances = [];

                        if (points.length > 1) {
                            for (let i = 0; i < points.length - 1; i++) {
                                const origin = points[i]?.address?.trim();
                                const destination = points[i + 1]?.address?.trim();

                                if (origin && destination) {
                                    const distanceData = await getLatLng(origin, destination);

                                    if (distanceData) {
                                        // Update pickup location point
                                        setFieldValue(`location_points[${i}]`, {
                                            ...values.location_points[i],
                                            city: distanceData.pickup.city,
                                            state: distanceData.pickup.state,
                                            zipCode: distanceData.pickup.zipCode,
                                            country: distanceData.pickup.country,
                                            latlng: distanceData.pickup.latlng
                                        });

                                        // Update dropoff location point
                                        setFieldValue(`location_points[${i + 1}]`, {
                                            ...values.location_points[i + 1],
                                            city: distanceData.dropoff.city,
                                            state: distanceData.dropoff.state,
                                            zipCode: distanceData.dropoff.zipCode,
                                            country: distanceData.dropoff.country,
                                            latlng: distanceData.dropoff.latlng
                                        });

                                        distances.push(distanceData);
                                    }
                                }
                            }
                        }
                        setFieldValue("trip_details", distances); // store distances for the trip
                        setTripData(distances); // keep local state for UI
                    };

                    const handler = setTimeout(fetchDistancesForAllPoints, 500);

                    return () => clearTimeout(handler);
                }, [JSON.stringify(values.location_points.map(p => p.address))]);

                const maxSelection = 2;
                const attendentList = attendantsData.map(item => ({
                    value: item.id,
                    label: item.attendant_name,
                    disabled:
                        values.attendants_id?.length >= maxSelection &&
                        !values.attendants_id.includes(item.id)
                }));

                useEffect(() => {
                    if (isRepeating && values.mobility?.includes("bus_ticket")) {
                        setFieldValue(
                            "mobility",
                            values.mobility.filter((m) => m !== "bus_ticket")
                        );
                    }
                }, [isRepeating, values.mobility, setFieldValue]);

                return (
                    <form noValidate onSubmit={handleSubmit}>
                        <MainCard title="" sx={{ marginTop: '20px' }}>
                            <Grid container spacing={3} gridColumn={12}>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <InputLabel sx={{ marginBottom: '4px' }} htmlFor="departure_date">Departure Date</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.departure_date && errors.departure_date)}
                                        id="departure_date"
                                        type="date"
                                        value={values.departure_date}
                                        name="departure_date"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{ min: new Date().toISOString().split("T")[0] }}
                                    />
                                    {touched.departure_date && errors.departure_date && (
                                        <FormHelperText error id="helper-text-departure_date">
                                            {errors.departure_date}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <SelectDropDown
                                        label="Funding Source"
                                        id="funding_source"
                                        values={values.funding_source}
                                        options={fundingSources}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    {touched.funding_source && errors.funding_source && (
                                        <FormHelperText error id="helper-text-funding_source ">
                                            {errors.funding_source}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Box sx={{ flex: '1' }}>
                                            <SelectDropDown
                                                label="Payee Name"
                                                id="payee_id"
                                                values={values.payee_id}
                                                options={payeeList}
                                                setFieldValue={setFieldValue}
                                                touched={touched}
                                                errors={errors}
                                            />
                                            {touched.payee_id && errors.payee_id && (
                                                <FormHelperText error id="helper-text-payee_id">
                                                    {errors.payee_id}
                                                </FormHelperText>
                                            )}
                                        </Box>
                                        <Box sx={{ position: 'absolute', top: '-5px', right: '0' }}>
                                            <Button type='button' variant='text' size='small' onClick={() => setOpenModalPayee(prevState => !prevState)}><Add /> Payee</Button>
                                        </Box>
                                        <TransitionsModal
                                            openModal={openModalPayee} setOpenModal={setOpenModalPayee} title={'Add Payee'} noFooter={true}
                                        >
                                            <TripAddPayeeModal mappedPatients={mappedPatients} AddPayee={AddPayee} />
                                        </TransitionsModal>

                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <SelectDropDown
                                        label="Repeating"
                                        id="repeating"
                                        values={values.repeating}
                                        options={repeating}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    {touched.repeating && errors.repeating && (
                                        <FormHelperText error id="helper-text-repeating">
                                            {errors.repeating}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                {isRepeating &&
                                    <>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <MultipleSelectCheckmarks
                                                name="repeat_day"
                                                label="Repeating Day"
                                                values={values.repeat_day}
                                                touched={touched}
                                                errors={errors}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                options={days}
                                            />

                                        </Grid>
                                        <Grid item xs={12} md={6} lg={4} xl={3}>
                                            <MultiDates
                                                id="repeat_date"
                                                label="Repeating Dates"
                                                values={values.repeat_date}
                                                setFieldValue={setFieldValue}
                                                touched={touched.repeat_date}
                                                errors={errors.repeat_date}
                                                inputProps={{ min: new Date().toISOString().split("T")[0] }}
                                            />
                                        </Grid>
                                    </>
                                }
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Box sx={{ flex: '1' }}>
                                            <MultipleSelectCheckmarks
                                                name="attendants_id"
                                                label="Attendent Name"
                                                values={values.attendants_id}
                                                touched={touched}
                                                errors={errors}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                options={attendentList}
                                            />
                                            {touched.attendants_id && errors.attendants_id && (
                                                <FormHelperText error id="helper-text-attendants_id">
                                                    {errors.attendants_id}
                                                </FormHelperText>
                                            )}
                                        </Box>
                                        <Box sx={{ position: 'absolute', top: '-5px', right: '0' }}>
                                            <Button type='button' variant='text' size='small' onClick={() => setOpenModalAttendent(prevState => !prevState)}><Add /> Attendent</Button>
                                        </Box>
                                        <TransitionsModal
                                            openModal={openModalAttendent} setOpenModal={setOpenModalAttendent} title={'Add Attendent'} noFooter={true}
                                        >
                                            <TripAddAttendentModal mappedPatients={mappedPatients} AddAttendent={AddAttendent} />
                                        </TransitionsModal>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <InputField
                                        id="extra_amount"
                                        label="Extra Allowance"
                                        type="number"
                                        touched={touched.extra_amount}
                                        errors={errors.extra_amount}
                                        values={values.extra_amount}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                        icon={<BiDollar />}
                                    />
                                    {touched.extra_amount && errors.extra_amount && (
                                        <FormHelperText error id="helper-text-extra_amount">
                                            {errors.extra_amount}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <InputField
                                        id="reason"
                                        label="Reason"
                                        type="text"
                                        touched={touched.reason}
                                        errors={errors.reason}
                                        values={values.reason}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                    {touched.reason && errors.reason && (
                                        <FormHelperText error id="helper-text-reason">
                                            {errors.reason}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid container spacing={3} sx={{ margin: '0 auto' }}>
                                    <Grid item xs={12}>
                                        <MainCard title="Mobility Section" sx={{ marginTop: '0px' }}>
                                            <Grid container spacing={3} gridColumn={12}>
                                                <Grid item xs={12} md={6} lg={6} xl={6}>
                                                    <MultipleSelectCheckmarks
                                                        name="mobility"
                                                        label="Mobility"
                                                        values={values.mobility}
                                                        touched={touched}
                                                        errors={errors}
                                                        handleChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        options={reimbursementAllowances(isRepeating)}
                                                    />
                                                </Grid>
                                                {isPersonalDriver &&
                                                    <Grid item xs={12} md={6}>
                                                        <Box sx={{ position: 'relative' }}>
                                                            <Box sx={{ flex: '1' }}>
                                                                <SelectDropDown
                                                                    label="Reimbursement Driver"
                                                                    id="reimbursement_driver_id"
                                                                    values={values.reimbursement_driver_id}
                                                                    options={driverList}
                                                                    setFieldValue={setFieldValue}
                                                                    touched={touched}
                                                                    errors={errors}
                                                                />
                                                                {touched.reimbursement_driver_id && errors.reimbursement_driver_id && (
                                                                    <FormHelperText error id="helper-text-reimbursement_driver_id">
                                                                        {errors.reimbursement_driver_id}
                                                                    </FormHelperText>
                                                                )}
                                                            </Box>
                                                            <Box sx={{ position: 'absolute', top: '-5px', right: '0' }}>
                                                                <Button type='button' variant='text' size='small' color='primary' onClick={() => setOpenModalDriver(prevState => !prevState)}><Add /> Driver</Button>
                                                            </Box>
                                                            <TransitionsModal
                                                                openModal={openModalDriver} setOpenModal={setOpenModalDriver} title={'Add Reimbursement Driver'} noFooter={true}
                                                            >
                                                                <TripReimbursementDriver mappedPatients={mappedPatients} setOpenModal={setOpenModalDriver} getDriversData={getDriversData} />
                                                            </TransitionsModal>
                                                        </Box>
                                                    </Grid>
                                                }
                                                {isTickets && !isRepeating &&
                                                    <>
                                                        <Grid item xs={12} md={6} lg={6} xl={6}>
                                                            <MultipleSelectCheckmarks
                                                                name="tickets"
                                                                label="Tickets"
                                                                values={values.tickets}
                                                                touched={touched}
                                                                errors={errors}
                                                                handleChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                options={tickets}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <InputField
                                                                id="tickets_cost"
                                                                label="Tickets Cost"
                                                                type="number"
                                                                touched={touched.tickets_cost}
                                                                errors={errors.tickets_cost}
                                                                values={values.tickets_cost}
                                                                handleBlur={handleBlur}
                                                                handleChange={handleChange}
                                                                icon={<BiDollar />}
                                                            />
                                                            {touched.tickets_cost && errors.tickets_cost && (
                                                                <FormHelperText error id="helper-text-tickets_cost">
                                                                    {errors.tickets_cost}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <DropzonePage
                                                                id="ticket_file"
                                                                label="Ticket File"
                                                                values={values.ticket_file}
                                                                setFieldValue={setFieldValue}
                                                                touched={touched.ticket_file}
                                                                errors={errors.ticket_file}
                                                            />
                                                        </Grid>
                                                    </>
                                                }
                                            </Grid>
                                        </MainCard>
                                    </Grid>
                                </Grid>
                                {!loadingMap ?
                                    <>
                                        <Grid container spacing={3} sx={{ margin: '0 auto' }}>
                                            <FieldArray name="location_points">
                                                {({ push, remove }) => (
                                                    <>
                                                        {values.location_points.map((_, index) => (
                                                            <Grid key={index} item xs={12} md={6}>
                                                                <MainCard title={`${index === 0 ? 'Pickup Address' : `Location Point ${index + 1}`}`} sx={{ marginTop: '0px' }} secondary={index > 1 && (
                                                                    <Tooltip title='Remove Location Point'>
                                                                        <IconButton color={'error'} onClick={() => remove(index)}>
                                                                            <Trash variant="Bold" />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                )}>
                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={12} md={6} lg={6}>
                                                                            <AddressField
                                                                                id={`location_points[${index}].address`}
                                                                                label="Address"
                                                                                placeholder="Enter Address"
                                                                                touched={touched.location_points?.[index]?.address}
                                                                                errors={errors.location_points?.[index]?.address}
                                                                                values={values.location_points[index].address}
                                                                                handleBlur={handleBlur}
                                                                                setFieldValue={setFieldValue}
                                                                            />
                                                                            {touched.location_points?.[index]?.address && errors.location_points?.[index]?.address && (
                                                                                <FormHelperText error>
                                                                                    {errors.location_points[index].address}
                                                                                </FormHelperText>
                                                                            )}
                                                                        </Grid>
                                                                        <Grid item xs={12} md={6} lg={6}>
                                                                            <SelectDropDown
                                                                                label="Facility Name"
                                                                                id={`location_points[${index}].facility_name`}
                                                                                values={values.location_points?.[index]?.facility_name}
                                                                                options={
                                                                                    facilityNames
                                                                                        .filter(opt => {
                                                                                            if (opt.value === "pickup") {
                                                                                                return values.location_points.every(
                                                                                                    (loc, i) => i === index || loc.facility_name !== "pickup"
                                                                                                );
                                                                                            }
                                                                                            if (opt.value === "appointment") {
                                                                                                return values.location_points.every(
                                                                                                    (loc, i) => i === index || loc.facility_name !== "appointment"
                                                                                                );
                                                                                            }
                                                                                            return true;
                                                                                        })
                                                                                }
                                                                                setFieldValue={setFieldValue}
                                                                                touched={touched.location_points?.[index]?.facility_name}
                                                                                errors={errors.location_points?.[index]?.facility_name}
                                                                            />

                                                                            {touched.location_points?.[index]?.facility_name && errors.location_points?.[index]?.facility_name && (
                                                                                <FormHelperText error>
                                                                                    {errors.location_points?.[index]?.facility_name}
                                                                                </FormHelperText>
                                                                            )}
                                                                        </Grid>
                                                                        {index > 0 &&
                                                                            <Grid item xs={12} md={6} lg={6}>
                                                                                <SelectDropDown
                                                                                    label="Travel Through"
                                                                                    id={`location_points[${index}].travel_through`}
                                                                                    values={values.location_points?.[index]?.travel_through}
                                                                                    options={travelThrough(values?.mobility)}
                                                                                    setFieldValue={setFieldValue}
                                                                                    touched={touched.location_points?.[index]?.travel_through}
                                                                                    errors={errors.location_points?.[index]?.travel_through}
                                                                                />

                                                                                {touched.location_points?.[index]?.travel_through && errors.location_points?.[index]?.travel_through && (
                                                                                    <FormHelperText error>
                                                                                        {errors.location_points?.[index]?.travel_through}
                                                                                    </FormHelperText>
                                                                                )}
                                                                            </Grid>
                                                                        }

                                                                        <Grid item xs={12} md={12} lg={index === 0 ? 12 : 6}>
                                                                            <PhoneNumber
                                                                                id={`location_points[${index}].phone`}
                                                                                value={values.location_points[index].phone}
                                                                                onChange={(phone) => setFieldValue(`location_points[${index}].phone`, phone)}
                                                                                onBlur={handleBlur}
                                                                                touched={touched.location_points?.[index]?.phone}
                                                                                error={errors.location_points?.[index]?.phone}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Stack spacing={1}>
                                                                                <InputLabel htmlFor={`location_points[${index}].note`}>Notes</InputLabel>
                                                                                <TextField
                                                                                    fullWidth
                                                                                    error={Boolean(touched.location_points?.[index]?.note && errors.location_points?.[index]?.note)}
                                                                                    id={`location_points[${index}].note`}
                                                                                    name={`location_points[${index}].note`}
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    value={values.location_points[index].note || ''}
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
                                                        ))}

                                                        <Grid item xs={12}>
                                                            <Button
                                                                variant="contained"
                                                                startIcon={<Add />}
                                                                onClick={() =>
                                                                    push({
                                                                        address: '',
                                                                        city: '',
                                                                        state: '',
                                                                        zipCode: '',
                                                                        country: '',
                                                                        latlng: { lat: '', lng: '' },
                                                                        facility_name: '',
                                                                        travel_through: '',
                                                                        phone: '',
                                                                        note: ''
                                                                    })
                                                                }
                                                            >
                                                                Add Another Location
                                                            </Button>
                                                        </Grid>
                                                    </>
                                                )}
                                            </FieldArray>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {(showMap && tripData.length >= 1) ?
                                                <GoogleMapWithPolyline location_points={tripData} distances={distances} setDistances={setDistances} />
                                                : ''
                                            }
                                        </Grid>
                                    </>
                                    :
                                    <CircularLoader text='please wait calculatig distance...' height='40vh' />
                                }
                                <Grid item xs={12} md={6} lg={4} >
                                    <TimePicker24
                                        id="app_time"
                                        label="Appointment Time"
                                        type="time"
                                        touched={touched.app_time}
                                        errors={errors.app_time}
                                        values={values.app_time}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} lg={4}>
                                    {durationInMins >= 240 ?
                                        <>
                                            <MultipleSelectCheckmarks
                                                name="allowances"
                                                label="Pick Allowances"
                                                values={values.allowances}
                                                touched={touched}
                                                errors={errors}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                options={tripAllowances.map(opt => ({
                                                    ...opt,
                                                    disabled: !getAllowanceAvailability({
                                                        startTime: getStartTime(values?.app_time ?? '', distances[0]?.duration ?? ''),
                                                        endTime: calculateEndTime(getStartTime(values?.app_time ?? '', distances[0]?.duration ?? ''), convertMinutesToHHMM(durationInMins)),
                                                        duration: durationInMins
                                                    })[opt.value]
                                                }))}
                                            />

                                            {touched.allowances && errors.allowances && (
                                                <FormHelperText error id="helper-text-allowances">
                                                    {errors.allowances}
                                                </FormHelperText>
                                            )}
                                        </>
                                        : ''}
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 4 }}>
                                        <Button disableElevation disabled={isSubmitting} variant="contained" type="submit" sx={{
                                            '&.Mui-disabled': {
                                                bgcolor: theme.palette.primary.main,
                                            }
                                        }}>
                                            {isSubmitting ? (
                                                <CircularProgress sx={{ height: '20px !important', width: '20px !important', color: 'white' }} />
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
