import React from 'react';
import { useField, useFormikContext } from 'formik';
import {
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { Box } from '@mui/system';

const TimeInput = ({ label, id }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(id);
  const [hour = '00', minute = '00'] = (field.value || '').split(':');

  const generateOptions = (range) =>
    Array.from({ length: range }, (_, i) => i.toString().padStart(2, '0'));

  const isError = meta.touched && Boolean(meta.error);

  const handleHourChange = (e) => {
    const newTime = `${e.target.value}:${minute}`;
    setFieldValue(id, newTime);
  };

  const handleMinuteChange = (e) => {
    const newTime = `${hour}:${e.target.value}`;
    setFieldValue(id, newTime);
  };

  return (
    <Box sx={{ maxWidth: '130px', position: 'relative' }}>
      <InputLabel>{label}</InputLabel>

      <Box sx={{ position: 'relative', display: 'flex', mt: '4px' }}>
        <FormControl
          fullWidth
          error={isError}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderRight: 'none',
              maxWidth: '100px'
            },
            '& .MuiOutlinedInput-root': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              pr: 0,
              pl: 0,
              py: 0.5,
            },
            '& .MuiSelect-icon': {
              display: 'none',
            },
          }}
        >
          <Select
            value={hour}
            onChange={handleHourChange}
            size="small"
            displayEmpty
            sx={{
              textAlign: 'center',
              display:'flex',
              justifyContent:'center'
            }}
          >
            {generateOptions(24).map((h) => (
              <MenuItem key={h} value={h}>
                {h}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>:</Box>

        <FormControl
          fullWidth
          error={isError}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderLeft: 'none',
              maxWidth: '100px',
            },
            '& .MuiOutlinedInput-root': {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              pl: 0.1,
              pr: 0.1,
              py: 0.5,
              borderLeft: 'none',
            },
            '& .MuiSelect-icon': {
              display: 'none',
            },
          }}
        >
          <Select
            value={minute}
            onChange={handleMinuteChange}
            size="small"
            displayEmpty
            sx={{
              textAlign: 'center',
            }}
            
          >
            {generateOptions(60).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isError && (
        <FormHelperText error id={`${id}-helper`}>
          {meta.error}
        </FormHelperText>
      )}
    </Box>
  );
};

export default TimeInput;
