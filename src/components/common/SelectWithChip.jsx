import React, { useState } from 'react';
import { Chip, MenuItem, Select } from '@mui/material';
import { providerStatuses } from 'constants/constants';

const SelectWithChip = ({id}) => {
    const [selectValue, setSelectValue] = useState('');
    const handleChange = (event) => {
        const newValue = event.target.value;
        setSelectValue(newValue)
    };
    return (
        <Select
            labelId="editable-select-label"
            sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
            id={`editable-select-${id}`}
            value={selectValue}
            onChange={(event) => handleChange(event)}
            size="small"
            placeholder='please select a value'
        >
            {providerStatuses.map((item, index) => (
                <MenuItem value={item.name} key={index}>
                    <Chip color={item.color} label={item.label} size="small" variant="light" />
                </MenuItem>
            ))}
        </Select>
    )
}

export default SelectWithChip