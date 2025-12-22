import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
    Box,
    Typography,
    Tooltip,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Grid,
    Card,
    Divider
} from '@mui/material';
import { FaCalendarDay, FaRegCalendarCheck, FaTrash } from 'react-icons/fa';
import { format, getDate, getMonth } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { fetcher, fetcherDelete, fetcherPost } from 'utils/axios';
import { openSnackbar } from 'api/snackbar';
import CircularLoader from 'components/common/loader/CircularLoader';
import { Formik } from 'formik';
import EmptyCityCard from 'components/common/empty-card';

export default function Holidays() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [holidays, setHolidays] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toggleHolidays, setToggleHolidays] = useState(false);
    const [holidayToDelete, setHolidayToDelete] = useState(null);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const formatHolidayDate = (date) => {
        const month = String(getMonth(date) + 1).padStart(2, '0');
        const day = String(getDate(date)).padStart(2, '0');
        return `${month}-${day}`;
    };

    const isHoliday = (date) => holidays.find(
        (h) => getMonth(date) === h.month && getDate(date) === h.day
    );

    const getHolidays = async () => {
        setIsLoading(true)
        const response = await fetcher(["/fetch-federal-holidays"]);
        if (response.status === true) {
            setIsLoading(false)
            const mappedHolidays = response.data.map(h => {
                const [month, day] = h.date.split('-').map(Number);
                return { month: month - 1, day, name: h.title, id: h.id };
            });
            setHolidays(mappedHolidays);
        }
    };
    const addHoliday = async (values, { setErrors, setSubmitting, resetForm }) => {
        const payload = {
            title: values.title,
            date: formatHolidayDate(values.date),
        };

        try {
            const response = await fetcherPost([
                '/store-federal-holiday',
                payload,
            ]);

            if (response.status === true) {
                openSnackbar({
                    open: true,
                    message: response.message || 'Holiday added successfully!',
                    variant: 'alert',
                    alert: { color: 'success' },
                });

                resetForm();
                setDialogOpen(false);
                getHolidays();
            }
        } catch (error) {
            if (error.response?.status === 422) {
                const backendErrors = Object.fromEntries(
                    Object.entries(error.response.data.errors).map(([key, value]) => [
                        key,
                        value,
                    ])
                );
                setErrors(backendErrors);
            }
        } finally {
            setSubmitting(false);
        }

    };

    const confirmDeleteHoliday = (holiday) => {
        setHolidayToDelete(holiday);
        setDeleteDialogOpen(true);
    };

    const deleteHoliday = async () => {
        setIsDeleting(true)
        const response = await fetcherDelete(`/delete-federal-holiday/${holidayToDelete.id}`)
        if (response.status === 200) {
            openSnackbar({
                open: true,
                message: response.message || 'Holiday deleted successfuly!',
                variant: 'alert',
                alert: {
                    color: 'success'
                }
            });
            setHolidays(holidays.filter(
                (h) =>
                    !(h.month === holidayToDelete.month &&
                        h.day === holidayToDelete.day &&
                        h.name === holidayToDelete.name)
            ));
            setIsDeleting(false)
            setHolidayToDelete(null);
            setDeleteDialogOpen(false);
        }
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const holiday = isHoliday(date);
            if (holiday) {
                return (
                    <Tooltip title={holiday.name}>
                        <Box
                            sx={{
                                mt: 0.5,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'red',
                                position: 'relative',
                            }}
                        >
                            <FaRegCalendarCheck />
                            <FaTrash
                                style={{
                                    position: 'absolute',
                                    top: -22,
                                    right: 2,
                                    cursor: 'pointer',
                                    color: 'darkred',
                                }}
                                size={10}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDeleteHoliday(holiday);
                                }}
                            />
                        </Box>
                    </Tooltip>
                );
            }
        }
        return null;
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && isHoliday(date)) {
            return 'holiday-tile';
        }
        return null;
    };
    const handleShowAllHolidays = () => {
        setToggleHolidays(preState => !preState)
    }

    useEffect(() => {
        getHolidays();
    }, [])

    return (
        <>
            {isLoading ? <CircularLoader text="Loading Holidays.." /> :
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px' }}>
                        <Typography variant='h4'>Federal Holidays</Typography>
                        {holidays?.length > 0 &&
                            <Button variant="contained" onClick={() => setDialogOpen(true)}>
                                Add Holiday
                            </Button>
                        }
                    </Box>
                    <Grid container spacing={4} sx={{ height: '100%' }}>
                        <Grid item xs={12} md={toggleHolidays ? 12 : 6} sx={{ display: 'flex' }}>
                            <Card sx={{ p: 2, boxShadow: 1, borderRadius: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}
                                >
                                    <FaCalendarDay /> Calendar
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Calendar
                                        onChange={setSelectedDate}
                                        value={selectedDate}
                                        tileContent={tileContent}
                                        tileClassName={tileClassName}
                                        className="full-width-calendar"
                                    />
                                </Box>
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <Typography variant="subtitle1" color="primary">
                                        Selected Date: {format(selectedDate, 'PPP')}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>

                        {/* Right: Holiday List */}
                        <Grid item xs={12} md={toggleHolidays ? 12 : 6} sx={{ display: 'flex' }}>
                            <Card sx={{ p: 2, boxShadow: 1, borderRadius: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    All Holidays  {holidays.length > 0 && `(${holidays.length})`}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                                    {toggleHolidays ?
                                        <List>
                                            {holidays
                                                .sort((a, b) => a.month - b.month || a.day - b.day)
                                                .map((h, idx) => (
                                                    <ListItem
                                                        key={idx}
                                                        sx={{
                                                            mb: 1,
                                                            borderRadius: 2,
                                                            bgcolor: isDark ? '#3f4952ff' : '#f5f5f5',
                                                            '&:hover': { bgcolor: isDark ? '#3f4952e8' : '#e0f7fa' },
                                                        }}
                                                        secondaryAction={
                                                            <IconButton
                                                                edge="end"
                                                                aria-label="delete"
                                                                onClick={() => confirmDeleteHoliday(h)}
                                                                sx={{ color: 'error.main' }}
                                                            >
                                                                <FaTrash />
                                                            </IconButton>
                                                        }
                                                    >
                                                        <ListItemText
                                                            primary={`${format(new Date(selectedDate.getFullYear(), h.month, h.day), 'MMM dd')} - ${h.name}`}
                                                            primaryTypographyProps={{ fontWeight: 500 }}
                                                        />
                                                    </ListItem>
                                                ))
                                            }
                                        </List>
                                        :
                                        <List>
                                            {holidays.length > 0 ? holidays
                                                .sort((a, b) => a.month - b.month || a.day - b.day)
                                                .slice(0, 6)
                                                .map((h, idx) => (
                                                    <ListItem
                                                        key={idx}
                                                        sx={{
                                                            mb: 1,
                                                            borderRadius: 2,
                                                            bgcolor: isDark ? '#3f4952ff' : '#f5f5f5',
                                                            '&:hover': { bgcolor: isDark ? '#3f4952e8' : '#e0f7fa' },
                                                        }}
                                                        secondaryAction={
                                                            <IconButton
                                                                edge="end"
                                                                aria-label="delete"
                                                                onClick={() => confirmDeleteHoliday(h)}
                                                                sx={{ color: 'error.main' }}
                                                            >
                                                                <FaTrash />
                                                            </IconButton>
                                                        }
                                                    >
                                                        <ListItemText
                                                            primary={`${format(new Date(selectedDate.getFullYear(), h.month, h.day), 'MMM dd')} - ${h.name}`}
                                                            primaryTypographyProps={{ fontWeight: 500 }}
                                                        />
                                                    </ListItem>
                                                )) :
                                                <EmptyCityCard message="No Holiday found" description="There is no holiday in this year, add new" button={<Button variant="contained" color='success' onClick={() => setDialogOpen(true)}>
                                                    Add Holiday
                                                </Button>} buttonText="Add New" />
                                            }
                                        </List>
                                    }
                                    {holidays.length > 6 &&
                                        <Button onClick={handleShowAllHolidays}>
                                            {toggleHolidays ? 'Show Less...' : 'Show All...'}
                                        </Button>
                                    }
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            }

            {/* Add Holiday Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Add Holiday</DialogTitle>
                <Formik
                    initialValues={{
                        title: '',
                        date: new Date(),
                    }}
                    onSubmit={addHoliday}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                        setErrors,
                        isSubmitting,
                    }) => {

                        const clearFieldError = (field) => {
                            if (errors[field]) {
                                setErrors(prev => ({ ...prev, [field]: undefined }));
                            }
                        };

                        return (
                            <form onSubmit={handleSubmit}>
                                <DialogContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        mt: 1,
                                        minWidth: '320px',
                                    }}
                                >
                                    <TextField
                                        name="title"
                                        placeholder="Holiday Name"
                                        value={values.title}
                                        onChange={(e) => {
                                            handleChange(e);
                                            clearFieldError('title');
                                        }}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.title && errors.title)}
                                        helperText={touched.title && errors.title}
                                        fullWidth
                                    />

                                    <TextField
                                        type="date"
                                        value={format(values.date, 'yyyy-MM-dd')}
                                        onChange={(e) => {
                                            setFieldValue('date', new Date(e.target.value));
                                            clearFieldError('date');
                                        }}
                                        onBlur={() => handleBlur({ target: { name: 'date' } })}
                                        error={Boolean(touched.date && errors.date)}
                                        helperText={touched.date && errors.date}
                                        fullWidth
                                    />
                                </DialogContent>

                                <DialogActions>
                                    <Button onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                                        Add
                                    </Button>
                                </DialogActions>
                            </form>
                        );
                    }}
                </Formik>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Holiday</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete "{holidayToDelete?.name}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button disabled={isDeleting} onClick={deleteHoliday} variant="contained" color="error">{isDeleting ? 'Deleting..' : 'Delete'}</Button>
                </DialogActions>
            </Dialog>
            <style>
                {`
                    .react-calendar {
                    background-color: ${isDark ? '#3f4952ff' : '#fff'} !important;
                    color: ${isDark ? '#f5f5f5' : '#000'} !important;
                    border: none;
                    width: 100%;
                    }

                    /* All tiles: rounded + dark mode hover fix */
                    .react-calendar__tile {
                    background-color: ${isDark ? '#3f4952ff' : 'inherit'};
                    color: ${isDark ? '#f5f5f5' : 'inherit'};
                    border-radius: 8px; /* Rounded corners */
                    transition: background-color 0.2s ease;
                    }

                    /* Hover effect: dark mode friendly */
                    .react-calendar__tile:hover {
                    background-color: ${isDark ? '#22292eff !important' : '#e6f0ff'};
                    color: ${isDark ? '#f5f5f5' : 'inherit'};
                    }

                    /* Selected tile */
                    .react-calendar__tile--active {
                    background-color: ${isDark ? '#3f4952ff' : '#006edc'} !important;
                    color: #fff !important;
                    border-radius: 8px;
                    }

                    /* Holiday tile */
                    .holiday-tile {
                    background-color: ${isDark ? '#9e6464ff' : '#ffe0e0'} !important;
                    color: ${isDark ? '#fff' : 'red'} !important;
                    border-radius: 8px; /* Rounded corners */
                    }

                    /* Holiday tile when selected */
                    .holiday-tile.react-calendar__tile--active {
                    background-color: ${isDark ? '#272c33ff' : '#ff7f7f'} !important;
                    color: #fff !important;
                    border-radius: 8px;
                    }
                `}
            </style>
        </>
    );
}
