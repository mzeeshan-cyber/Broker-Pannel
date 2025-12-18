import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import { InputAdornment, OutlinedInput } from '@mui/material';

const InputField = ({
    id,
    label,
    touched,
    errors,
    values,
    handleBlur,
    handleChange,
    type = 'text',
    placeholder,
    accept,
    icon
}) => {
    // Prevent typing negative numbers
    const handleKeyDown = (e) => {
        if (type === 'number' && e.key === '-') {
            e.preventDefault();
        }
    };

    // Prevent pasting negative numbers
    const handleCustomChange = (e) => {
        if (type === 'number' && e.target.value < 0) {
            e.target.value = 0;
        }
        handleChange(e);
    };

    return (
        <Stack spacing={1}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <OutlinedInput
                fullWidth
                error={Boolean(touched && errors)}
                id={id}
                type={type}
                value={values}
                name={id}
                onBlur={handleBlur}
                onChange={handleCustomChange}
                onKeyDown={handleKeyDown}
                placeholder={`${placeholder || `Enter ${label}`}`}
                startAdornment={
                    icon ? (
                        <InputAdornment position="start">
                            {icon}
                        </InputAdornment>
                    ) : null
                }
                inputProps={{
                    ...(type === 'number' ? { min: 0 } : {}),
                    ...(type === 'file' ? { accept: accept } : {}),
                }}

                sx={{
                    ...(icon && {
                        '& .MuiInputBase-inputAdornedStart': {
                            paddingLeft: 0,
                        },
                    }),
                }}
            />
        </Stack>
    )
}

export default InputField
