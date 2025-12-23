import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { ThemeMode } from 'config';
import { Button, Chip, CircularProgress, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { FilterSearch } from 'iconsax-react';
import { Formik } from 'formik';
import SelectDropDown from 'components/common/SelectDropDown';
import { TripInvoicesStatusDropdown, vehicleStatus } from 'constants/constants';
import { capitalize } from 'lodash';
import { useSelector } from 'react-redux';
import { fetcher } from 'utils/axios';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function Filters({ handleGetBySearch }) {
    const theme = useTheme();
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [providersData, setProvidersData] = useState([]);
    const tripsInvoices = useSelector(state => state.tripsInvoices)

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleDeleteFilter = (key) => {
        const updatedFilters = { ...tripsInvoices.filterValue };
        delete updatedFilters[key];
        handleGetBySearch(updatedFilters);
    };

    const getProviderData = async () => {
        setIsFetching(true)
        const query = {
            page: 'all',
        };
        const response = await fetcher([
            "/providers",
            { params: query }
        ]);
        if (response.status === true) {
            setProvidersData(response?.data.data)
            setIsFetching(false)
        }
    };

    const AllProviders = providersData.map((item, index) => {
        return {
            value: item.id,
            label: item.name
        };
    });

    useEffect(() => {
        getProviderData()
    }, [])

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            {tripsInvoices.filterValue &&
                Object.entries(tripsInvoices.filterValue).map(([key, value]) => {
                    let displayValue = value?.value || value;
                    const displayLabel = value?.label || key;

                    if (key === 'provider_id') {
                        const provider = AllProviders.find(p => p.value === displayValue);
                        displayValue = provider?.label || displayValue;
                    }

                    if (!displayValue) return null;

                    return (
                        <Chip
                            key={key}
                            label={`${displayLabel === 'provider_id' ? 'Provider Name' : capitalize(displayLabel.replace('_', ' '))} : ${capitalize(displayValue)}`}
                            size="small"
                            color="error"
                            onDelete={() => handleDeleteFilter(key)}
                            sx={{ marginRight: '10px', marginBottom: '5px' }}
                        />
                    );
                })
            }

            <Button
                variant="contained"
                color="primary"
                type='button'
                sx={{
                    fontWeight: 500,
                    bgcolor: 'primary',
                    color: 'secondary.lighter',
                    '&:hover': {
                        color: 'secondary.lighter',
                        ...(theme.palette.mode === ThemeMode.DARK && {
                            bgcolor: 'primary.darker',
                            color: 'secondary.darker'
                        })
                    }
                }}
                aria-label="open filters"
                ref={anchorRef}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <FilterSearch size="32" />
                <Box sx={{ marginLeft: '5px' }}>Filters</Box>
            </Button>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 9] } }] }}
                sx={{ zIndex: 9 }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="grow" position="top-right" in={open} {...TransitionProps} >
                        <Paper
                            sx={{
                                boxShadow: theme.customShadows.z1,
                                width: 390,
                                minWidth: 240,
                                maxWidth: 390,
                                [theme.breakpoints.down('md')]: { maxWidth: 250 },
                                borderRadius: 1.5,
                                border: '1px solid rgb(242, 242, 242)'
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                {isFetching ?
                                <CircularLoader text='Loading Providers...'/> 
                                : 
                                <Formik
                                    initialValues={{
                                        provider_id: '',
                                        submission_date: '',
                                        paid_date: '',
                                        status: '',


                                    }}
                                    onSubmit={async (values, { setSubmitting }) => {
                                        try {
                                            await handleGetBySearch(values);
                                            handleClose();
                                        } catch (error) {
                                            console.error("Error fetching patients:", error);
                                        } finally {
                                            setSubmitting(false);
                                        }
                                    }}
                                >
                                    {({ handleBlur, handleChange, handleSubmit, isSubmitting, values, setFieldValue, touched, errors }) => (
                                        <form noValidate onSubmit={handleSubmit}>
                                            <MainCard title="">
                                                <Grid container spacing={1} gridColumn={12}>
                                                    <Grid item xs={12} md={6}>
                                                        <SelectDropDown
                                                            label="Provider Name"
                                                            id="provider_id"
                                                            values={values.provider_id}
                                                            setFieldValue={setFieldValue}
                                                            options={AllProviders}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={1}>
                                                            <InputLabel htmlFor="name">Submission Date</InputLabel>
                                                            <OutlinedInput
                                                                fullWidth
                                                                id="submission_date"
                                                                type="date"
                                                                value={values.submission_date}
                                                                name="submission_date"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                placeholder="Enter submission date"
                                                                inputProps={{}}
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={1}>
                                                            <InputLabel htmlFor="name">Paid Date</InputLabel>
                                                            <OutlinedInput
                                                                fullWidth
                                                                id="paid_date"
                                                                type="date"
                                                                value={values.paid_date}
                                                                name="paid_date"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                placeholder="Enter paid date"
                                                                inputProps={{}}
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <SelectDropDown
                                                            label="Status"
                                                            id="status"
                                                            values={values.status}
                                                            setFieldValue={setFieldValue}
                                                            options={TripInvoicesStatusDropdown}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 1 }}>
                                                            <Button variant="outlined" color="secondary" onClick={() => setOpen(false)}>
                                                                Cancel
                                                            </Button>
                                                            <Button disableElevation disabled={isSubmitting} variant="contained" type='submit'>
                                                                {isSubmitting ? <CircularProgress sx={{ height: '20px !important', width: '20px !important' }} /> : 'Search'}
                                                            </Button>
                                                        </Stack>
                                                    </Grid>

                                                </Grid>
                                            </MainCard>
                                        </form>
                                    )}
                                </Formik>
                                }
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
}