import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { ThemeMode } from 'config';
import { Button, Chip, CircularProgress, Grid, Stack } from '@mui/material';
import { FilterSearch } from 'iconsax-react';
import { Formik } from 'formik';
import SelectDropDown from 'components/common/SelectDropDown';
import { inspectionType, vehicleStatus, vehicleType } from 'constants/constants';
import { capitalize } from 'lodash';

export default function Filters({ handleGetBySearch, filterValue }) {
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

    const handleDeleteFilter = (key) => {
        const updatedFilters = { ...filterValue };
        delete updatedFilters[key];
        handleGetBySearch(updatedFilters);
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            {filterValue &&
                Object.entries(filterValue).map(([key, value]) => {
                    const displayValue = value?.value || value;

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
                                        vehicle_status: '',
                                        vehicle_type: '',
                                        inspection_type: '',


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
                                                            label="Vehicle Status"
                                                            id="vehicle_status"
                                                            values={values}
                                                            setFieldValue={setFieldValue}
                                                            options={vehicleStatus}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <SelectDropDown
                                                            label="Vehicle Type"
                                                            id="vehicle_type"
                                                            values={values}
                                                            setFieldValue={setFieldValue}
                                                            options={vehicleType}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <SelectDropDown
                                                            label="Inspection Type"
                                                            id="inspection_type"
                                                            values={values}
                                                            setFieldValue={setFieldValue}
                                                            options={inspectionType}
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
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
}