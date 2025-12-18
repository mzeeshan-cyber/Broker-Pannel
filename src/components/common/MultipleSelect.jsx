import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import { ArrowDown2 } from 'iconsax-react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



export default function MultipleSelectCheckmarks({
  label,
  name,
  touched,
  errors,
  values = [],
  handleChange,
  handleBlur,
  options,
}) {
  const safeValues = Array.isArray(values) ? values : [];

  const hasError = touched?.[name] && Boolean(errors?.[name]);

  const getDayById = (id) => options.find((item) => item.value === id)?.label;
  return (
    <>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <FormControl sx={{ mt: '4px', width: '100%' }} error={hasError}>
        <Select
          labelId={`${name}-label`}
          id={name}
          name={name}
          multiple
          value={safeValues}
          onChange={handleChange}
          onBlur={handleBlur}
          input={
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  <ArrowDown2 />
                </InputAdornment>
              }
            />
          }
          displayEmpty
          IconComponent={() => null}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <span style={{ color: '#aaa' }}>{`Select ${label}`}</span>;
            }
            return selected.map(getDayById).join(', ');
          }}
          MenuProps={MenuProps}
        >
          {options.map((item) => (
            <MenuItem key={item.value} value={item.value} disabled={item.disabled}>
              <Checkbox checked={safeValues.includes(item.value)} />
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        </Select>
        {hasError && (
          <FormHelperText>{errors[name]}</FormHelperText>
        )}
      </FormControl>
    </>
  );
}
