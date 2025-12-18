import React from 'react'
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ArrowDown2 } from 'iconsax-react';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Autocomplete as CustomAutocomplete } from '@mui/material';


const SelectDropDown = ({ label, id, values, setFieldValue, touched, errors, options, onValueChange }) => {
  const filter = createFilterOptions();

  const handleChange = (event, newValue) => {
    let finalValue = '';

    if (typeof newValue === 'string') {
      finalValue = newValue;
    } else if (newValue && newValue.value) {
      finalValue = newValue.value;
    }

    setFieldValue(id, finalValue);

    if (onValueChange) {
      onValueChange(finalValue);
    }
  };
  return (
    <>
      <Stack spacing={1}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <CustomAutocomplete
          fullWidth
          value={options.find((option) => String(option.value) === String(values)) || null}
          disableClearable
          onChange={handleChange}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            const isExisting = options.some((option) => inputValue === option.label);
            if (inputValue !== '' && !isExisting) {
              filtered.push({ value: inputValue, label: `Add "${inputValue}"` });
            }
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          autoHighlight
          handleHomeEndKeys
          id={id}
          options={options}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.label
          }
          freeSolo
          renderInput={(params) => (
            <TextField
            sx={{
              '& .MuiOutlinedInput-root': {
                padding: '6px 9px',
              },
            }}
            {...params}
              name={id}
              placeholder={`Select ${label}`}
              // error={Boolean(touched && errors)}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <ArrowDown2 />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Stack>
    </>
  );
};


export default SelectDropDown