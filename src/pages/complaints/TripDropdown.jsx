import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Stack, InputLabel, Popper, Paper, CircularProgress, InputBase, IconButton, ClickAwayListener } from '@mui/material';
import debounce from 'lodash/debounce';
import { MdOutlineClear } from 'react-icons/md';
import { fetcher } from 'utils/axios';
import { User, Call, Sms, ShieldTick } from 'iconsax-react';

function DebouncedDropdown({
    label,
    values,
    setFieldValue,
    apiEndpoint,
    valueKey = 'id',
    displayKeys = ['id'],
    extraDataMapper = null,
    queryParams = {},
    searchPararm
}) {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const anchorRef = useRef(null);

    const getData = async (page = 1, search = '') => {
        setIsFetching(true);
        try {
            const params = {
                page,
                ...(searchPararm ? { name: search } : { search }),
                ...queryParams
            };
            const response = await fetcher([apiEndpoint, { params }]);
            if (response.status === true) {
                const newData = response?.data?.data || [];
                setData(prev => page === 1 ? newData : [...prev, ...newData]);
                setHasMore(newData.length > 0);
            }
        } finally {
            setIsFetching(false);
        }
    };

    const handleSearch = useCallback(
        debounce((value) => {
            setPage(1);
            setData([]);
            setHasMore(true);
            if (value) getData(1, value);
        }, 300),
        []
    );

    const onInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        handleSearch(value);
        setFieldValue(label.toLowerCase().replace(' ', '_'), null);
        setOpenDropdown(true);
    };

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 5 && hasMore && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (page > 1 && inputValue) getData(page, inputValue);
    }, [page]);

    useEffect(() => {
        return () => handleSearch.cancel();
    }, [handleSearch]);

    const clearSelection = () => {
        setFieldValue(label.toLowerCase().replace(' ', '_'), null);
        setInputValue('');
        setData([]);
        setPage(1);
        setHasMore(true);
    };
    const formatKey = (key) =>
        key
            .replace(/[._]/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());

    const mappedData = data.map((item) => {
        const nameField = item.name || item.full_name || item.driver_name || item.provider_name || item.email || item.id;
        return {
            value: item[valueKey],
            displayLabel: nameField,
            completeData: item,
            label: (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                        {displayKeys.map((k, i) => (
                            <Box key={i} sx={{ fontSize: 13, color: 'text.secondary' }}>
                                {formatKey(k)}: {k.split('.').reduce((o, key) => (o ? o[key] : ''), item)}
                            </Box>
                        ))}
                    </Box>
                </Box>
            )

        };
    });

    return (
        <ClickAwayListener onClickAway={() => setOpenDropdown(false)}>
            <Stack spacing={1}>
                <InputLabel>{label}</InputLabel>
                <Box
                    ref={anchorRef}
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        px: 1,
                        minHeight: 48,
                        cursor: 'text'
                    }}
                    onClick={() => setOpenDropdown(true)}
                >
                    <InputBase
                        value={values[label.toLowerCase().replace(' ', '_')]?.displayLabel || inputValue}
                        placeholder={`Select or Search ${label}`}
                        onChange={onInputChange}
                        sx={{ flex: 1 }}
                    />
                    {(values[label.toLowerCase().replace(' ', '_')]?.displayLabel || inputValue) && (
                        <IconButton size="small" onClick={clearSelection}>
                            <MdOutlineClear fontSize="small" />
                        </IconButton>
                    )}
                </Box>

                <Popper
                    open={openDropdown}
                    anchorEl={anchorRef.current}
                    placement="bottom-start"
                    sx={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
                >
                    <Paper sx={{ maxHeight: 260, overflowY: 'auto' }} onScroll={handleScroll}>
                        {mappedData.map((item, index) => (
                            <Box
                                key={`${item.value}-${index}`}
                                sx={{ p: 1, cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' }, borderBottom: '1px solid #eee' }}
                                onClick={() => {
                                    setFieldValue(label.toLowerCase().replace(' ', '_'), { value: item.value, displayLabel: item.displayLabel });
                                    setInputValue(item.displayLabel);
                                    setOpenDropdown(false);
                                    if (extraDataMapper) extraDataMapper(item.completeData);
                                }}
                            >
                                {item.label}
                            </Box>
                        ))}

                        {isFetching && (
                            <Box textAlign="center" p={1}>
                                <CircularProgress />
                            </Box>
                        )}

                        {data.length === 0 && !isFetching && (
                            <Box textAlign="center" p={1} color="grey.500">
                                No {label.toLowerCase()} found
                            </Box>
                        )}
                    </Paper>
                </Popper>
            </Stack>
        </ClickAwayListener>
    );
}

export default DebouncedDropdown;
