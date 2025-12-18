import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { createFilterOptions } from '@mui/material/Autocomplete';
import Transitions from 'components/@extended/Transitions';
import { ThemeMode } from 'config';
import { Button, Chip } from '@mui/material';
import { FilterSearch } from 'iconsax-react';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import FiltersForm from './filtersForm';
import { capitalize } from 'lodash';

export default function Filters({ getPatientsBySearch }) {
    const theme = useTheme();
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const patientState = useSelector(state => state.patient)

    const filter = createFilterOptions();
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
        const updatedFilters = { ...patientState.filterValue };
        delete updatedFilters[key];
        getPatientsBySearch(updatedFilters);
    };

    return (
        <>
            <Box sx={{ flexShrink: 0, ml: 0.75 }}>
                {patientState.filterValue &&
                    Object.entries(patientState.filterValue).map(([key, value]) => {
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
                        <ClickAwayListener onClickAway={handleClose}>
                            <div>
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
                                                name: '',
                                                phone_number: '',
                                                social_security_number: '',
                                                medicaid_number: '',
                                                funding_source: '',
                                                city: '',
                                                mobility: '',
                                                gender: '',
                                            }}
                                            onSubmit={async (values, { setSubmitting }) => {
                                                try {
                                                    await getPatientsBySearch(values);
                                                    handleClose(); // Close the popper after fetching
                                                } catch (error) {
                                                    console.error("Error fetching patients:", error);
                                                } finally {
                                                    setSubmitting(false); // Update Formik's loader state
                                                }
                                            }}
                                        >
                                            {({ handleBlur, handleChange, handleSubmit, isSubmitting, values, setFieldValue }) => (
                                                <form noValidate onSubmit={handleSubmit}>
                                                    <FiltersForm
                                                        filter={filter}
                                                        values={values}
                                                        setFieldValue={setFieldValue}
                                                        handleBlur={handleBlur}
                                                        handleChange={handleChange}
                                                        isSubmitting={isSubmitting}
                                                    />
                                                </form>
                                            )}
                                        </Formik>
                                    </Paper>
                                </Transitions>
                            </div>
                        </ClickAwayListener>
                    )}
                </Popper>
            </Box>
        </>
    );
}