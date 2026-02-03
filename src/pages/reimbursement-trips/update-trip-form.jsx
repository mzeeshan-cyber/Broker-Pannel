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
import { tripAllowances, days, facilityNames, fundingSources, reimbursementAllowances, repeating, TripStatusesUPdate, tickets, travelThrough } from 'constants/constants';
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
import { calculateEndTime, convertMinutesToHHMM, convertToMinutes, getAllowanceAvailability, getStartTime } from 'constants/utilities';
import { useNavigate, useParams } from 'react-router';
import TimePicker24 from 'components/common/TimePicker24';
import CircularLoader from 'components/common/loader/CircularLoader';
import IconButton from 'components/@extended/IconButton';
import { useTheme } from '@emotion/react';

export default function UpdateTripForm({ tripData }) {
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
    const [distances, setDistances] = useState([]);
    const [locationPointsData, setLocationPointsData] = useState([]);
    const [loadingMap, setLoadingMap] = useState(false);
    const navigate = useNavigate();
    const { trip_id } = useParams();
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
        const params = { patient_id: tripData?.patient?.id, per_page: "all", };
        const response = await fetcher(["/patient-payees", { params }]);
        if (response.status === true) setPayeeData(response?.data);
    };
    const getAttendentsData = async () => {
        const params = { patient_id: tripData?.patient?.id, per_page: "all", };
        const response = await fetcher(["/patient-attendants", { params }]);
        if (response.status === true) setAttendantsData(response?.data);
    };
    const getDriversData = async () => {
        const params = { patient_id: tripData?.patient?.id, per_page: "all", };
        const response = await fetcher(["/reimbursement-drivers", { params }]);
        if (response.status === true) setReimbursementDriverData(response?.data);
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
            setOpenModalPayee(false);
            getPayeeData();
        }
    };
    const AddAttendent = async (values) => {
        const response = await fetcherPost([`/patient-attendants`, values]);
        if (response.status === true) {
            openSnackbar({
                open: true,
                message: response.message || 'Attendant added successfully!',
                variant: 'alert',
                alert: { color: 'success' }
            });
            setOpenModalAttendent(false);
            getAttendentsData();
        }
    };

    let ticketFiles = [];
    try {
        const parsed = typeof tripData.ticket_file === 'string'
            ? JSON.parse(tripData.ticket_file)
            : Array.isArray(tripData.ticket_file)
                ? tripData.ticket_file
                : [];
        ticketFiles = parsed;
    } catch (e) {
        console.error('Invalid ticket_file JSON', tripData.ticket_file);
    }

    const UpdateReimbursementTrip = async (values) => {
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
        formData.append('trip_status', values.trip_status);
        formData.append('tickets', values.tickets);
        formData.append('tickets_cost', values.tickets_cost);

        values.attendants_id.forEach((id, index) => {
            formData.append(`attendants[${index}][id]`, id);
        });

        formData.append('extra_amount', values.extra_amount);
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

        for (let index = 0; index < values.ticket_file.length; index++) {
            const file = values.ticket_file[index];

            if (file instanceof File) {
                formData.append(`ticket_file[${index}]`, file);
            } else if (typeof file === 'string') {
                formData.append(`old_ticket_file[${index}]`, file);
            }
        }

        values.allowances.forEach((item, index) => {
            formData.append(`allowances[${index}]`, item);
        });
        try {
            const response = await axios.post(`${API_URL}update-reimbursement-trip/${trip_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
            });
            if (response.status === 200) {
                openSnackbar({
                    open: true,
                    message: 'Reimbursement Trip updated successfully!',
                    variant: 'success',
                    alert: { color: 'success' }
                });
                navigate('/reimbursement-trips');
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: error?.response?.data?.message || 'Reimbursement Trip not updated!',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
    };
    const getLatLng = async (pickup, dropoff) => {
        setLoadingMap(true)
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
                setLoadingMap(false)
                return response.data.data;
            }
        } catch (error) {
            setLoadingMap(false)
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
        if (tripData?.patient?.id) {
            getPayeeData();
            getAttendentsData();
            getDriversData();
        }
    }, [tripData?.patient?.id]);

    useEffect(() => {
        const timer = setTimeout(() => setShowMap(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const payeeList = payeeData.map(item => ({ value: item.id, label: item.account_holder_name }));
    const driverList = reimbursementDriverData.map(item => ({ value: item.id, label: item.driver_name }));
    return (
        <Formik
            initialValues={{
                patient_id: tripData.patient_id || '',
                departure_date: tripData.departure_date?.split('T')[0] || '',
                app_time: tripData.app_time || '',
                mobility: tripData.mobility || [],
                reimbursement_driver_id: tripData.reimbursement_driver_id || '',
                funding_source: tripData.funding_source || '',
                repeating: typeof tripData.repeating === 'number'
                    ? String(tripData.repeating)
                    : tripData.repeating || '0',

                repeat_day: tripData.repeat_day || [],
                repeat_date: tripData.repeat_date || [],
                payee_id: tripData?.payee?.id || '',
                attendants: tripData.attendants || [],
                attendants_id: (tripData.attendants || []).map(a => a.id),
                ticket_file: ticketFiles,
                extra_amount: tripData.extra_amount || '',
                extra_allowance: tripData.extra_allowance || '',
                reason: tripData.reason || '',
                trip_status: tripData.tripStatus,
                tickets: tripData?.tickets || [],
                location_points: (tripData?.location_points || []).map((point) => ({
                    address: point?.address?.replace(/:$/, '') || '',
                    city: point?.city?.replace(/:$/, '') || '',
                    state: point?.state?.replace(/:$/, '') || '',
                    zipCode: point?.zipCode?.replace(/:$/, '') || '',
                    country: point?.country?.replace(/:$/, '') || '',
                    latlng: { lat: point?.latlng?.lat || '', lng: point?.latlng?.lng || '' },
                    facility_name: point?.facility_name?.replace(/:$/, '') || '',
                    travel_through: point?.travel_through?.replace(/:$/, '') || '',
                    phone: point?.phone?.replace(/:$/, '') || '',
                    note: point?.note === 'undefined' ? '' : point?.note || '',
                })),
                tickets_cost: tripData.tickets_cost,
                allowances: tripData.allowances || [],
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
                tickets_cost: Yup.number()
                    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
                    .when("mobility", {
                        is: (mobility) => Array.isArray(mobility) && mobility.includes("bus_ticket"),
                        then: (schema) =>
                            schema.required("Ticket cost is required").typeError("Ticket cost must be a number"),
                        otherwise: (schema) => schema.notRequired(),
                    }),
                location_points: Yup.array()
                    .of(
                        Yup.object().shape({
                            address: Yup.string().required("Address is required"),
                            facility_name: Yup.string().required("Facility name is required"),
                            phone: Yup.string().required("Phone is required"),
                            // note: Yup.string(),
                        })
                    )
                    .test(
                        "must-have-pickup",
                        "At least one Pickup is required",
                        (location_points) => location_points?.some(loc => loc.facility_name === "pickup")
                    )
                    .test(
                        "only-one-appointment",
                        "Only one Appointment is allowed",
                        (location_points) => location_points.filter(loc => loc.facility_name === "appointment").length <= 1
                    ),

            })}
            enableReinitialize={true}
            onSubmit={UpdateReimbursementTrip}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {

                const isRepeating = ["1"]?.includes(values.repeating);
                const isTickets = values?.mobility?.includes("bus_ticket");
                const isPersonalDriver = values?.mobility?.includes("personal_driver");
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
                                        // update current point (pickup-like)
                                        setFieldValue(`location_points[${i}]`, {
                                            ...values.location_points[i],
                                            city: distanceData.pickup?.city || values.location_points[i].city,
                                            state: distanceData.pickup?.state || values.location_points[i].state,
                                            zipCode: distanceData.pickup?.zipCode || values.location_points[i].zipCode,
                                            country: distanceData.pickup?.country || values.location_points[i].country,
                                            latlng: distanceData.pickup?.latlng || values.location_points[i].latlng,
                                        });

                                        // update next point (dropoff-like)
                                        setFieldValue(`location_points[${i + 1}]`, {
                                            ...values.location_points[i + 1],
                                            city: distanceData.dropoff?.city || values.location_points[i + 1].city,
                                            state: distanceData.dropoff?.state || values.location_points[i + 1].state,
                                            zipCode: distanceData.dropoff?.zipCode || values.location_points[i + 1].zipCode,
                                            country: distanceData.dropoff?.country || values.location_points[i + 1].country,
                                            latlng: distanceData.dropoff?.latlng || values.location_points[i + 1].latlng,
                                        });

                                        // store segment distance
                                        distances.push({
                                            from: i,
                                            to: i + 1,
                                            ...distanceData,
                                        });
                                    }
                                }
                            }
                        }

                        // store full trip distances
                        setFieldValue("trip_details", distances);
                        setLocationPointsData(distances);
                    };

                    const handler = setTimeout(fetchDistancesForAllPoints, 500);

                    return () => clearTimeout(handler);
                }, [
                    JSON.stringify(
                        values.location_points.map((p) => p?.address?.trim() || "")
                    ),
                ]);
                useEffect(() => {
                    if (isRepeating && values.mobility?.includes("bus_ticket")) {
                        setFieldValue(
                            "mobility",
                            values.mobility.filter((m) => m !== "bus_ticket")
                        );
                    }
                }, [isRepeating, values.mobility, setFieldValue]);
                const maxSelection = 2;

                const attendentList = attendantsData.map(item => ({
                    value: item.id,
                    label: item.attendant_name,
                    disabled:
                        values.attendants_id?.length >= maxSelection &&
                        !values.attendants_id.includes(item.id)
                }));
                return (
                    !tripData?.patient?.id ? 'Loading...' :
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3} gridColumn={12}>
                                <Grid item xs={12} md={6} lg={4} xl={3}>
                                    <InputLabel sx={{ marginBottom: '4px' }} htmlFor="departure_date">Departure Date</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.departure_date && errors.departure_date)}
                                        id="departure_date"
                                        type="date"
                                        value={values?.departure_date}
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
                                            <TripAddPayeeModal mappedPatients={tripData?.patient} AddPayee={AddPayee} />
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
                                            <TripAddAttendentModal mappedPatients={tripData?.patient} AddAttendent={AddAttendent} />
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
                                                                <TripReimbursementDriver mappedPatients={tripData?.patient} setOpenModal={setOpenModalDriver} getDriversData={getDriversData} />
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
                                                                facility_name: '',
                                                                phone: '',
                                                                notes: ''
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
                                    {!loadingMap && showMap ?
                                        <GoogleMapWithPolyline location_points={locationPointsData} distances={distances} setDistances={setDistances} />
                                        :
                                        <CircularLoader text='Please wait calculating distance...' height='40vh' />
                                    }
                                </Grid>
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
                                    {durationInMins >= 240 &&
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
                                        </>}
                                </Grid>
                                <Grid item xs={12} md={6} lg={4}>
                                    <SelectDropDown
                                        label="Trip Status"
                                        id="trip_status"
                                        values={values.trip_status}
                                        options={TripStatusesUPdate}
                                        setFieldValue={setFieldValue}
                                        touched={touched}
                                        errors={errors}
                                    />
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
                                                'Update Trip'
                                            )}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                );
            }}
        </Formik>
    )
}
