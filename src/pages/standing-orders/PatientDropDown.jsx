import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box,
    Stack,
    InputLabel,
    Popper,
    Paper,
    CircularProgress,
    InputBase,
    IconButton,
    ClickAwayListener,
    Typography,
    useTheme
} from '@mui/material';
import debounce from 'lodash/debounce';
import { MdOutlineClear } from 'react-icons/md';
import {
    MdPerson,
    MdPhone,
    MdLocationCity,
    MdBadge,
    MdAccessibilityNew,
    MdAttachMoney,
    MdWc,
    MdInfo
} from 'react-icons/md';
import { fetcher } from 'utils/axios';

/* ---------------- ICON MAP ---------------- */

const FIELD_ICONS = {
    name: <MdPerson />,
    phone_number: <MdPhone />,
    social_security_number: <MdBadge />,
    medicaid_number: <MdBadge />,
    city: <MdLocationCity />,
    gender: <MdWc />,
    mobility: <MdAccessibilityNew />,
    funding_source: <MdAttachMoney />
};

/* ---------------- ICON COLORS ---------------- */
const ICON_COLORS = {
    name: '#1976d2',
    phone_number: '#2e7d32',
    social_security_number: '#6a1b9a',
    medicaid_number: '#6a1b9a',
    city: '#0277bd',
    gender: '#ad1457',
    mobility: '#ef6c00',
    funding_source: '#2e7d32'
};

/* ---------------- HIGHLIGHT TEXT ---------------- */
const highlightText = (text, search) => {
    const theme = useTheme();
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    return text.split(regex).map((part, i) =>
        part.toLowerCase() === search.toLowerCase() ? (
            <span key={i} style={{
                backgroundColor: theme.palette.mode === 'dark'
                    ? '#4a3f00'
                    : '#fff59d'
            }}
            >
                {part}
            </span>
        ) : (
            part
        )
    );
};

function DebouncedDropdown({
    label,
    values,
    setFieldValue,
    apiEndpoint,
    valueKey = 'id',
    displayKeys = ['name'],
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

    const formKey = label.toLowerCase().replace(' ', '_');

    const getData = async (page = 1, search = '') => {
        setIsFetching(true);
        try {
            const params = {
                page,
                ...(searchPararm ? { term: search } : { search }),
                ...queryParams
            };
            const response = await fetcher([apiEndpoint, { params }]);
            if (response?.status === true) {
                const newData = response?.data?.data || [];
                setData(prev => (page === 1 ? newData : [...prev, ...newData]));
                setHasMore(newData.length > 0);
            }
        } finally {
            setIsFetching(false);
        }
    };

    const handleSearch = useCallback(
        debounce(value => {
            setPage(1);
            setData([]);
            setHasMore(true);
            if (value) getData(1, value);
        }, 300),
        []
    );

    const onInputChange = e => {
        const value = e.target.value;
        setInputValue(value);
        handleSearch(value);
        setFieldValue(formKey, null);
        setOpenDropdown(true);
    };

    const handleScroll = e => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (page > 1 && inputValue) getData(page, inputValue);
    }, [page]);

    useEffect(() => () => handleSearch.cancel(), [handleSearch]);

    const clearSelection = () => {
        setFieldValue(formKey, null);
        setInputValue('');
        setData([]);
        setPage(1);
        setHasMore(true);
    };

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
                        minHeight: 48
                    }}
                    onClick={() => setOpenDropdown(true)}
                >
                    <InputBase
                        value={values[formKey]?.displayLabel || inputValue}
                        placeholder={`Search ${label}`}
                        onChange={onInputChange}
                        sx={{ flex: 1 }}
                    />
                    {(values[formKey]?.displayLabel || inputValue) && (
                        <IconButton size="small" onClick={clearSelection}>
                            <MdOutlineClear />
                        </IconButton>
                    )}
                </Box>

                <Popper
                    open={openDropdown}
                    anchorEl={anchorRef.current}
                    placement="bottom-start"
                    sx={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
                >
                    <Paper sx={{ maxHeight: 300, overflowY: 'auto' }} onScroll={handleScroll}>
                        {data.map((item, index) => {
                            const displayLabel = item.name || item.email || item.id;

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 1.2,
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #eee',
                                        '&:hover': {
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'grey.800'
                                                    : 'grey.100'
                                        }
                                    }}
                                    onClick={() => {
                                        setFieldValue(formKey, {
                                            value: item[valueKey],
                                            displayLabel
                                        });
                                        setInputValue(displayLabel);
                                        setOpenDropdown(false);
                                        extraDataMapper?.(item);
                                    }}
                                >
                                    <Typography fontWeight={600} fontSize={14}>
                                        {highlightText(displayLabel, inputValue)}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: 0.8,
                                            mt: 0.5
                                        }}
                                    >
                                        {displayKeys.map((k, i) => {
                                            const key = k.split('.').pop();
                                            const value = k
                                                .split('.')
                                                .reduce((o, key) => (o ? o[key] : ''), item);

                                            if (!value) return null;

                                            return (
                                                <Box
                                                    key={i}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        fontSize: 12,
                                                        color: 'text.secondary'
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            color: ICON_COLORS[key] || '#555',
                                                            fontSize: 16
                                                        }}
                                                    >
                                                        {FIELD_ICONS[key] || <MdInfo />}
                                                    </Box>
                                                    <span>
                                                        <strong>
                                                            {key
                                                                .replace(/_/g, ' ')
                                                                .replace(/\b\w/g, c => c.toUpperCase())}
                                                            :
                                                        </strong>{' '}
                                                        {highlightText(String(value), inputValue)}
                                                    </span>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            );
                        })}

                        {isFetching && (
                            <Box textAlign="center" p={1}>
                                <CircularProgress size={22} />
                            </Box>
                        )}

                        {!isFetching && data.length === 0 && (
                            <Box textAlign="center" p={1} color="grey.500">
                                No results found
                            </Box>
                        )}
                    </Paper>
                </Popper>
            </Stack>
        </ClickAwayListener >
    );
}

export default DebouncedDropdown;
