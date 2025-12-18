import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText';
import DatePicker from 'react-multi-date-picker';
import { Calendar } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';

const MultiDates = ({
  id,
  label,
  values,
  setFieldValue,
  touched,
  errors,
  inputProps
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Stack spacing={1}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <DatePicker
        inputProps={inputProps}
        multiple
        value={values}
        minDate={new Date()}
        onOpen={() => setIsFocused(true)}
        onClose={() => setIsFocused(false)}
        onChange={(dateArray) =>
          setFieldValue(
            id,
            dateArray.map((date) => date.format('YYYY-MM-DD'))
          )
        }
        format="YYYY-MM-DD"
        placeholder={`Select ${label}`}
        render={(value, openCalendar) => (
          <div
            onClick={() => {
              openCalendar();
              setIsFocused(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              color: value.length ? (isDarkMode ? '#fff' : '#000') : '#999',
              backgroundColor: isDarkMode ? 'transparent' : '#fff',
              border: touched && errors
                ? '1px solid red'
                : `1px solid ${isFocused
                  ? theme.palette.primary.main
                  : isDarkMode
                    ? 'rgba(255, 255, 255, 0.23)'
                    : 'rgba(0, 0, 0, 0.23)'
                }`,
              transition: 'border-color 0.2s ease',
            }}
          >
            {value.length ? value : `Select ${label}`}
            <Calendar size="20" color={isDarkMode ? '#fff' : '#999'} />
          </div>
        )}
      />

      {touched && errors && (
        <FormHelperText error id={`helper-text-${id}`}>
          {errors}
        </FormHelperText>
      )}
    </Stack>
  );
};

export default MultiDates;
