import { Button, CircularProgress, Grid, InputAdornment, InputLabel, OutlinedInput, Stack, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import React from 'react';
import { Autocomplete as CustomAutocomplete } from '@mui/material';
import { fundingSources, genders, mobilities } from 'constants/constants';
import { ArrowDown2 } from 'iconsax-react';

const FiltersForm = ({values, handleBlur, handleChange, isSubmitting, filter, setFieldValue}) => {
    return (
        <MainCard title="">
            <Grid container spacing={1} gridColumn={12}>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <OutlinedInput
                            fullWidth
                            id="name"
                            type="test"
                            value={values.name}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Search name"
                            inputProps={{}}
                            size='small'
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
                            placeholder="Search phone"
                            inputProps={{}}
                            size='small'
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="social_security_number">Social Security Number</InputLabel>
                        <OutlinedInput
                            fullWidth
                            id="social_security_number"
                            type="text"
                            value={values.social_security_number}
                            name="social_security_number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Search SSN"
                            inputProps={{}}
                            size='small'
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="medicaid_number">Medicaid Number</InputLabel>
                        <OutlinedInput
                            fullWidth
                            id="medicaid_number"
                            type="text"
                            value={values.medicaid_number}
                            name="medicaid_number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Search medicaid number"
                            inputProps={{}}
                            size='small'
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="funding_source">Funding Source</InputLabel>
                        <CustomAutocomplete
                            fullWidth
                            value={values.funding_source || { value: '', label: '' }} // Ensure it is not undefined
                            disableClearable
                            onChange={(event, newValue) => {

                                let newLabelValue;

                                // If newValue is an object (the selected option)
                                if (newValue && typeof newValue === 'object') {
                                    newLabelValue = newValue;
                                } else if (typeof newValue === 'string') {
                                    // If it's a string (freeSolo), create an object with the string as both value and label
                                    newLabelValue = { value: newValue, label: newValue };
                                } else {
                                    // Handle the case where newValue is neither an object nor a string (maybe null or undefined)
                                    newLabelValue = { value: '', label: '' };
                                }


                                setFieldValue('funding_source', newLabelValue); // Set the value
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const { inputValue } = params;
                                const isExisting = options.some((option) => inputValue === option.label); // Match by label here
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({ value: inputValue, label: `Add "${inputValue}"` });
                                }
                                return filtered;
                            }}
                            selectOnFocus
                            clearOnBlur
                            autoHighlight
                            handleHomeEndKeys
                            id="funding_source"
                            options={fundingSources}
                            getOptionLabel={(option) => {
                                return option?.label;
                            }}
                            freeSolo
                            renderInput={(params) => (
                                <TextField
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            padding: '6px 9px',
                                        },
                                    }}
                                    {...params}
                                    name="funding_source"
                                    placeholder="Select funding source"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <ArrowDown2 />
                                            </InputAdornment>
                                        ),
                                    }}
                                    size='small'
                                />
                            )}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="city">City</InputLabel>
                        <OutlinedInput
                            fullWidth
                            id="city"
                            type="text"
                            value={values.city}
                            name="city"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Search city"
                            inputProps={{}}
                            size='small'
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="mobility">Mobility</InputLabel>
                        <CustomAutocomplete
                            fullWidth
                            value={values.mobility || { value: '', label: '' }} // Ensure it is not undefined
                            disableClearable
                            onChange={(event, newValue) => {

                                let newLabelValue;

                                // If newValue is an object (the selected option)
                                if (newValue && typeof newValue === 'object') {
                                    newLabelValue = newValue;
                                } else if (typeof newValue === 'string') {
                                    // If it's a string (freeSolo), create an object with the string as both value and label
                                    newLabelValue = { value: newValue, label: newValue };
                                } else {
                                    // Handle the case where newValue is neither an object nor a string (maybe null or undefined)
                                    newLabelValue = { value: '', label: '' };
                                }


                                setFieldValue('mobility', newLabelValue); // Set the value
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const { inputValue } = params;
                                const isExisting = options.some((option) => inputValue === option.label); // Match by label here
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({ value: inputValue, label: `Add "${inputValue}"` });
                                }
                                return filtered;
                            }}
                            selectOnFocus
                            clearOnBlur
                            autoHighlight
                            handleHomeEndKeys
                            id="mobility"
                            options={mobilities}
                            getOptionLabel={(option) => {
                                return option?.label;
                            }}
                            freeSolo
                            renderInput={(params) => (
                                <TextField
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            padding: '6px 9px',
                                        },
                                    }}
                                    {...params}
                                    name="mobility"
                                    placeholder="Select mobility"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <ArrowDown2 />
                                            </InputAdornment>
                                        ),
                                    }}
                                    size='small'
                                />
                            )}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <InputLabel htmlFor="gender">Gender</InputLabel>
                        <CustomAutocomplete
                            fullWidth
                            value={values.gender || { value: '', label: '' }} // Ensure it is not undefined
                            disableClearable
                            onChange={(event, newValue) => {

                                let newLabelValue;

                                // If newValue is an object (the selected option)
                                if (newValue && typeof newValue === 'object') {
                                    newLabelValue = newValue;
                                } else if (typeof newValue === 'string') {
                                    // If it's a string (freeSolo), create an object with the string as both value and label
                                    newLabelValue = { value: newValue, label: newValue };
                                } else {
                                    // Handle the case where newValue is neither an object nor a string (maybe null or undefined)
                                    newLabelValue = { value: '', label: '' };
                                }


                                setFieldValue('gender', newLabelValue); // Set the value
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const { inputValue } = params;
                                const isExisting = options.some((option) => inputValue === option.label); // Match by label here
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({ value: inputValue, label: `Add "${inputValue}"` });
                                }
                                return filtered;
                            }}
                            selectOnFocus
                            clearOnBlur
                            autoHighlight
                            handleHomeEndKeys
                            id="gender"
                            options={genders}
                            getOptionLabel={(option) => {
                                return option?.label;
                            }}
                            freeSolo
                            renderInput={(params) => (
                                <TextField
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            padding: '6px 9px',
                                        },
                                    }}
                                    {...params}
                                    name="gender"
                                    placeholder="Select gender"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <ArrowDown2 />
                                            </InputAdornment>
                                        ),
                                    }}
                                    size='small'
                                />
                            )}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 1 }}>
                        <Button disableElevation disabled={isSubmitting} variant="contained" type='submit'>
                            {isSubmitting ? <CircularProgress sx={{ height: '20px !important', width: '20px !important' }} /> : 'Search'}
                        </Button>
                    </Stack>
                </Grid>

            </Grid>
        </MainCard>
    )
}

export default FiltersForm