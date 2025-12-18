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
import { Button, CircularProgress, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { FilterRemove, FilterSearch } from 'iconsax-react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { resetFilter } from 'store/reducers/patientSlice';

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Filters({ handleGetBySearch }) {
    const theme = useTheme();
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    const patientState = useSelector(state => state.patient)

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        setOpen(false);
    };

    const handleResetFilter = () => {
        dispatch(resetFilter(false))
        handleGetBySearch();
    }

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            {patientState.resetFilter &&
                <Button color='error' sx={{ marginRight: '10px' }} onClick={handleResetFilter}>
                    <FilterRemove size="32" />
                    <Box sx={{ marginLeft: '5px' }}>Reset Filters</Box>
                </Button>
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
                                                            <Button variant="outlined" color="secondary" onClick={()=>setOpen(false)}>
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