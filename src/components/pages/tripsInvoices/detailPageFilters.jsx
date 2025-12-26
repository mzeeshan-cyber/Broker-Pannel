import { useRef, useState } from 'react';
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
import { capitalize } from 'lodash';
import { useSelector } from 'react-redux';

export default function DetailPageFilters({ handleGetBySearch }) {
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
                                } : `}
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
                                        date: '',
                                        mobility: ''
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
                                                        <Stack spacing={1}>
                                                            <InputLabel>Service Date</InputLabel>
                                                            <OutlinedInput
                                                                type="date"
                                                                name="date"
                                                                value={values.date}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                        </Stack>
                                                    </Grid>

                                                    <Grid item xs={12} md={6}>
                                                        <SelectDropDown
                                                            label="Mobility"
                                                            id="mobility"
                                                            values={values.mobility}
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
