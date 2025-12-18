import { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';

// project-imports
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

import { ThemeMode } from 'config';
import { Button, Chip, CircularProgress, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { FilterSearch } from 'iconsax-react';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { capitalize } from 'lodash';


// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Filters({ handleGetBySearch }) {
    const theme = useTheme();
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const driverState = useSelector(state => state.driver)
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
        const updatedFilters = { ...driverState.filterValue };
        delete updatedFilters[key];
        handleGetBySearch(updatedFilters);
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            {driverState.filterValue &&
                Object.entries(driverState.filterValue).map(([key, value]) => {
                    const displayValue =
                        typeof value === 'object'
                            ? value?.label || value?.value || ''
                            : value;
                    if (!displayValue) return null;

                    return (
                        <Chip
                            key={key}
                            label={capitalize(displayValue)}
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
                                <Formik
                                    initialValues={{
                                        patient_id: '',
                                        attendant_name: '',
                                        phone_number: '',
                                        relationship: '',


                                    }}
                                    onSubmit={(values) => handleGetBySearch(values)}
                                >
                                    {({ handleBlur, handleChange, handleSubmit, isSubmitting, values, setFieldValue }) => (
                                        <form noValidate onSubmit={handleSubmit}>
                                            <MainCard title="">
                                                <Grid container spacing={1} gridColumn={12}>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={1}>
                                                            <InputLabel htmlFor="attendant_name">Attendent name</InputLabel>
                                                            <OutlinedInput
                                                                fullWidth
                                                                size='small'
                                                                id="attendant_name"
                                                                type="text"
                                                                value={values.attendant_name}
                                                                name="attendant_name"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                placeholder="Enter attendent name"
                                                                inputProps={{}}
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={1}>
                                                            <InputLabel htmlFor="phone_number">Phone Number</InputLabel>
                                                            <OutlinedInput
                                                                fullWidth
                                                                size='small'
                                                                id="phone_number"
                                                                type="text"
                                                                value={values.phone_number}
                                                                name="phone_number"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                placeholder="Enter phone number"
                                                                inputProps={{}}
                                                            />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Stack spacing={1}>
                                                            <InputLabel htmlFor="relationship">Relationship</InputLabel>
                                                            <OutlinedInput
                                                                fullWidth
                                                                size='small'
                                                                id="relationship"
                                                                type="text"
                                                                value={values.relationship}
                                                                name="relationship"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                placeholder="Enter your relationship"
                                                                inputProps={{}}
                                                            />
                                                        </Stack>
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
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
}