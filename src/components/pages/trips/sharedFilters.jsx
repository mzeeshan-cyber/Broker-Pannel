import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { ThemeMode } from 'config';
import { Button, CircularProgress, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { FilterSearch } from 'iconsax-react';
import { Formik } from 'formik';
import SelectDropDown from 'components/common/SelectDropDown';
import { mobility, tripTypeFilter } from 'constants/constants';
import InputWithSelect from 'components/common/inpputWithSelect';

export default function SharedFilters({ handleGetBySearch }) {
    const theme = useTheme();
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <ClickAwayListener onClickAway={handleClose}>
                <div>
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
                                    <Formik
                                        initialValues={{
                                            trip_type: '',
                                            mobility: '',
                                            date: '',
                                            patient_name: '',
                                            pickup_city: '',
                                            dropoff_city: '',
                                            miles: '',
                                        }}
                                        onSubmit={(values) => {
                                            const clean = Object.fromEntries(
                                                Object.entries(values).filter(([key, value]) => value)
                                            );
                                            handleGetBySearch(clean);
                                        }}

                                    >
                                        {({ handleBlur, handleChange, handleSubmit, isSubmitting, values, setFieldValue }) => (
                                            <form noValidate onSubmit={handleSubmit}>
                                                <MainCard title="">
                                                    <Grid container spacing={1} gridColumn={12}>
                                                        <Grid item xs={12} md={6}>
                                                            <SelectDropDown
                                                                label="Trip Type"
                                                                id="trip_type"
                                                                values={values.trip_type}
                                                                options={tripTypeFilter}
                                                                setFieldValue={setFieldValue}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <SelectDropDown
                                                                label="Mobility"
                                                                id="mobility"
                                                                values={values.mobility}
                                                                options={mobility}
                                                                setFieldValue={setFieldValue}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <Stack spacing={1}>
                                                                <InputLabel htmlFor="date">Service Date</InputLabel>
                                                                <OutlinedInput
                                                                    fullWidth
                                                                    id="date"
                                                                    type="date"
                                                                    value={values.date}
                                                                    name="date"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    placeholder="Search date"
                                                                    inputProps={{}}
                                                                />
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <Stack spacing={1}>
                                                                <InputLabel htmlFor="patient_name">Patient name</InputLabel>
                                                                <OutlinedInput
                                                                    fullWidth
                                                                    id="patient_name"
                                                                    type="text"
                                                                    value={values.patient_name}
                                                                    name="patient_name"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    placeholder="Search patient"
                                                                    inputProps={{}}
                                                                />
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <InputWithSelect
                                                                label="Pickup City"
                                                                apiUrl="trips/cities"
                                                                type="pickup_city"
                                                                onChange={(val) => setFieldValue("pickup_city", val?.value || "")}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <InputWithSelect
                                                                label="Dropoff City"
                                                                apiUrl="trips/cities"
                                                                type="dropoff_city"
                                                                onChange={(val) => setFieldValue("dropoff_city", val?.value || "")}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <Stack spacing={1}>
                                                                <InputLabel htmlFor="patient_name">Miles</InputLabel>
                                                                <OutlinedInput
                                                                    fullWidth
                                                                    id="miles"
                                                                    type="text"
                                                                    value={values.miles}
                                                                    name="miles"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    placeholder="Search miles"
                                                                    inputProps={{}}
                                                                />
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Stack direction="row" spacing={1} justifyContent="right" alignItems="center" sx={{ mt: 1 }}>
                                                                <Button variant='outlined' type='button' color='error' onClick={handleToggle}>Cancel</Button>
                                                                <Button disableElevation disabled={isSubmitting} variant="contained" type='submit'>
                                                                    {isSubmitting ? <CircularProgress sx={{ height: '20px !important', width: '20px !important' }} /> : 'Apply Filters'}
                                                                </Button>
                                                            </Stack>
                                                        </Grid>

                                                    </Grid>
                                                </MainCard>
                                            </form>
                                        )}
                                    </Formik>
                                </Paper>
                            </Transitions>
                        )}
                    </Popper>
                </div>
            </ClickAwayListener>
        </Box>
    );
}