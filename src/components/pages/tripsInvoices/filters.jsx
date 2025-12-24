import { useEffect, useRef, useState, useCallback } from 'react';
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
import { TripInvoicesStatusDropdown } from 'constants/constants';
import { capitalize, debounce } from 'lodash';
import { useSelector } from 'react-redux';
import { fetcher } from 'utils/axios';

function ProviderDropdown({ values, setFieldValue }) {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [providersData, setProvidersData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFetching, setIsFetching] = useState(false);

    const anchorRef = useRef(null);

    const getProviderData = async (page = 1, search = '') => {
        setIsFetching(true);
        try {
            const response = await fetcher(['/providers', { params: { page, search } }]);
            if (response.status === true) {
                const newData = response?.data?.data || [];
                setProvidersData(prev => page === 1 ? newData : [...prev, ...newData]);
                setHasMore(newData.length > 0);
            }
        } finally {
            setIsFetching(false);
        }
    };

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 5 && hasMore && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    const handleSearch = useCallback(
        debounce((value) => {
            setProvidersData([]);
            setHasMore(true);
            setPage(1);
            setSearchTerm(value);
        }, 300),
        []
    );

    useEffect(() => {
        getProviderData(page, searchTerm);
    }, [page, searchTerm]);

    useEffect(() => {
        return () => handleSearch.cancel();
    }, [handleSearch]);

    const providers = providersData.map(p => ({
        value: p.id,
        label: p.name
    }));

    return (
        <Stack spacing={1}>
            <InputLabel>Provider Name</InputLabel>

            <Box
                ref={anchorRef}
                onClick={() => setOpenDropdown(prev => !prev)}
                sx={{
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    p: 1.5,
                    cursor: 'pointer'
                }}
            >
                {values.provider_id?.label || 'Select Provider'}
            </Box>

            <Popper
                open={openDropdown}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                sx={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
            >
                <Paper sx={{ maxHeight: 260, overflowY: 'auto' }} onScroll={handleScroll}>
                    <Box p={1}>
                        <OutlinedInput
                            fullWidth
                            size="small"
                            placeholder="Search provider"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Box>

                    {providers.map(p => (
                        <Box
                            key={p.value}
                            sx={{ p: 1, cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                            onClick={() => {
                                setFieldValue('provider_id', p);
                                setOpenDropdown(false);
                            }}
                        >
                            {p.label}
                        </Box>
                    ))}

                    {isFetching && (
                        <Box textAlign="center" p={1}>
                            <CircularProgress size={20} />
                        </Box>
                    )}
                </Paper>
            </Popper>
        </Stack>
    );
}

export default function Filters({ handleGetBySearch }) {
    const theme = useTheme();
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const tripsInvoices = useSelector(state => state.tripsInvoices);

    const handleDeleteFilter = (key) => {
        const updated = { ...tripsInvoices.filterValue };
        delete updated[key];
        handleGetBySearch(updated);
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            {tripsInvoices.filterValue &&
                Object.entries(tripsInvoices.filterValue).map(([key, value]) => {
                    const displayValue = key === 'provider_id' ? value?.label : value?.label ?? value?.value ?? value;
                    console.log(value, key)
                    if (!displayValue) return null;

                    return (
                        <Chip
                            key={key}
                            label={`${key === 'provider_id'
                                ? 'Provider Name'
                                : capitalize(key.replace('_', ' '))
                                } : ${capitalize(String(displayValue))}`}
                            size="small"
                            color="error"
                            onDelete={() => handleDeleteFilter(key)}
                            sx={{ mr: 1, mb: 0.5 }}
                        />
                    );
                })
            }

            <Button
                ref={anchorRef}
                variant="contained"
                onClick={() => setOpen(prev => !prev)}
                sx={{
                    fontWeight: 500,
                    bgcolor: 'primary',
                    color: 'secondary.lighter',
                    '&:hover': {
                        ...(theme.palette.mode === ThemeMode.DARK && {
                            bgcolor: 'primary.darker'
                        })
                    }
                }}
            >
                <FilterSearch size="32" />
                <Box ml={1}>Filters</Box>
            </Button>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-end"
                transition
                sx={{ zIndex: 9 }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="grow" position="top-right" {...TransitionProps}>
                        <Paper sx={{ width: 390, borderRadius: 1.5 }}>
                            <ClickAwayListener onClickAway={() => setOpen(false)}>
                                <Formik
                                    initialValues={{
                                        provider_id: '',
                                        submission_date: '',
                                        paid_date: '',
                                        status: ''
                                    }}
                                    onSubmit={(values) => {
                                        handleGetBySearch({
                                            ...values,
                                            provider_id: values.provider_id
                                        });
                                        setOpen(false);
                                    }}
                                >
                                    {({ handleSubmit, handleBlur, handleChange, isSubmitting, values, setFieldValue }) => (
                                        <form onSubmit={handleSubmit}>
                                            <MainCard>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12} md={6}>
                                                        <ProviderDropdown values={values} setFieldValue={setFieldValue} />
                                                    </Grid>

                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={1}>
                                                            <InputLabel>Submission Date</InputLabel>
                                                            <OutlinedInput
                                                                type="date"
                                                                name="submission_date"
                                                                value={values.submission_date}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                        </Stack>
                                                    </Grid>

                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={1}>
                                                            <InputLabel>Paid Date</InputLabel>
                                                            <OutlinedInput
                                                                type="date"
                                                                name="paid_date"
                                                                value={values.paid_date}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
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
                                                        <Stack direction="row" justifyContent="flex-end" spacing={2}>
                                                            <Button onClick={() => setOpen(false)} variant="outlined">
                                                                Cancel
                                                            </Button>
                                                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                                                {isSubmitting ? <CircularProgress size={20} /> : 'Search'}
                                                            </Button>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </MainCard>
                                        </form>
                                    )}
                                </Formik>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
}
