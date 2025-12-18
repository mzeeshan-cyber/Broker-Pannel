import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress, InputLabel } from "@mui/material";
import { fetcher } from "utils/axios";

const InputWithSelect = ({
    label = "Select Option",
    placeholder = "Type to search...",
    apiUrl,
    type,
    params = {},
    onChange,
    defaultValue = null,
    minLength = 2,
    debounceDelay = 500,
    width = "100%",
}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim().length >= minLength) {
                fetchOptions(searchTerm);
            } else {
                setOptions([]);
            }
        }, debounceDelay);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);
    const fetchOptions = async (query) => {
        try {
            setLoading(true);

            const queryParams = { ...params, type, search: query };
            const data = await fetcher([apiUrl, { params: queryParams }]);
            const items = Array.isArray(data?.data) ? data.data : [];

            const normalized = items.map((item) => {
                if (typeof item === "string") return { label: item, value: item };
                if (typeof item === "object")
                    return { label: item.label || item.name, value: item.value || item.id };
                return { label: String(item), value: item };
            });

            setOptions(normalized);
        } catch (err) {
            console.error("Error fetching options:", err);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };


    const handleChange = (event, newValue) => {
        setSelectedValue(newValue);
        if (onChange) onChange(newValue);
    };

    return (
        <div style={{ width }}>
            {label && <InputLabel sx={{ mb: 0.5 }}>{label}</InputLabel>}
            <Autocomplete
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                options={options}
                loading={loading}
                value={selectedValue}
                onChange={handleChange}
                onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
                getOptionLabel={(option) => option?.label || ""}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={placeholder}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress color="inherit" size={20} />}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        </div>
    );
};

export default InputWithSelect;
