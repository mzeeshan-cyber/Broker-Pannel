import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

export default function SearchableSelect({ options, placeholder, selected, setSelected }) {
    const [inputValue, setInputValue] = React.useState('');

    return (
        <Autocomplete
            disablePortal
            options={options}
            value={selected}
            inputValue={inputValue}
            onInputChange={(event, newInputValue, reason) => {
                if (reason !== 'reset') {
                    setInputValue(newInputValue);
                }
            }}
            onChange={(e, newValue) => {
                setSelected(newValue);
                setInputValue('');
            }}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            getOptionLabel={(option) =>
                option?.iconPairs?.map((pair) => pair.label).join(' ') || ''
            }
            renderOption={(props, option) => {
                const { key, ...rest } = props;
                return (
                    <li key={key} {...rest} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {option.iconPairs.map((pair, index) => (
                            <span
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    marginRight: 8
                                }}
                            >
                                {pair.icon}
                                <span>:</span>
                                <span>{pair.label}</span>
                            </span>
                        ))}
                    </li>
                );
            }}
            renderInput={(params) => {
                const showIcons = selected?.iconPairs?.length > 0 && !inputValue;

                return (
                    <TextField
                        {...params}
                        placeholder={placeholder}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: showIcons ? (
                                <InputAdornment position="start" sx={{ gap: 1 }}>
                                    {selected.iconPairs.map((pair, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 4,
                                                marginRight: 8
                                            }}
                                        >
                                            {pair.icon}
                                            <span>:</span>
                                            <span>{pair.label}</span>
                                        </span>
                                    ))}
                                </InputAdornment>
                            ) : null
                        }}
                    />
                );
            }}
        />
    );
}
