import React from 'react';
import TextField from '@mui/material/TextField';
import { InputLabel, Stack, InputAdornment } from '@mui/material';
import USAICON from '../../assets/images/icons/united-states.svg'

const PhoneNumber = ({ id, value, error, touched, onChange, onBlur, label="Phone Number" }) => {
    const formatPhoneNumber = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 10);
        const area = digits.slice(0, 3);
        const middle = digits.slice(3, 6);
        const last = digits.slice(6, 10);

        if (digits.length > 6) return `(${area}) ${middle}-${last}`;
        if (digits.length > 3) return `(${area}) ${middle}`;
        if (digits.length > 0) return `(${area}`;
        return '';
    };

    const handleFormattedChange = (e) => {
        const rawInput = e.target.value;
        const formatted = formatPhoneNumber(rawInput);
        onChange(formatted); // update Formik
    };

    return (
        <Stack spacing={1}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <TextField
                id={id}
                variant="outlined"
                fullWidth
                value={value}
                onChange={handleFormattedChange}
                onBlur={onBlur}
                placeholder="(123) 456-7890"
                inputProps={{ maxLength: 14 }}
                error={Boolean(touched && error)}
                helperText={touched && error ? error : ''}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <img src={USAICON} alt="usa" width="24" height="16" />
                        </InputAdornment>
                    ),
                    sx: {
                        '& input': {
                            paddingLeft: 0
                        }
                    }
                }}
            />
        </Stack>
    );
};

export default PhoneNumber;
