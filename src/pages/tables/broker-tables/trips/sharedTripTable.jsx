import React, { useEffect, useState } from 'react';
// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
// third-party
import { DndProvider } from 'react-dnd';
import { isMobile } from 'react-device-detect';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedMinMaxValues,
    getFacetedUniqueValues,
    getPaginationRowModel,
    getSortedRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    flexRender,
    useReactTable,
    sortingFns
} from '@tanstack/react-table';
import { compareItems, rankItem } from '@tanstack/match-sorter-utils';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';

import {
    DebouncedInput,
    HeaderSort,
    TablePagination,
    RowEditable,
    DraggableColumnHeader,
    EmptyTable,
} from 'components/third-party/react-table';

//assets
import { Command, TableDocument } from 'iconsax-react';
import { Button, Typography } from '@mui/material';
import { ThemeMode } from 'config';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import TripsExpandingDetails from 'components/pages/trips/tripsExpandingDetails';
import { fetcherPost } from 'utils/axios';
import { openSnackbar } from 'api/snackbar';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta(itemRank);
    return itemRank.passed;
};

export const fuzzySort = (rowA, rowB, columnId) => {
    let dir = 0;
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(rowA.columnFiltersMeta[columnId], rowB.columnFiltersMeta[columnId]);
    }
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export default function SharedTripTable({ isSubmitting, data, handleDelete, handleUpdate, stackontable, defaultColumns, handleGetData, tableName, handleChangePerPage, handleChangePagination, paginationData, pageSize, page, handleRestoreMultiple, noPagination }) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedShareIds, setSelectedShareIds] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [grouping, setGrouping] = useState([]);
    const [originalData, setOriginalData] = useState(() => [...data]);
    const [selectedRow, setSelectedRow] = useState({});
    const [columns] = useState(() => [...defaultColumns]);
    const [columnOrder, setColumnOrder] = useState(
        // must start out with populated columnOrder so we can splice
        columns.map((column) => column.id)
    );

    const [columnVisibility, setColumnVisibility] = useState({});

    const table = useReactTable({
        data,
        columns,
        defaultColumn: { cell: RowEditable },
        manualPagination: true,
        state: {
            rowSelection,
            columnFilters,
            globalFilter,
            sorting,
            grouping,
            // columnOrder,
            columnVisibility
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onGroupingChange: setGrouping,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnOrderChange: setColumnOrder,
        onColumnVisibilityChange: setColumnVisibility,
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        globalFilterFn: fuzzyFilter,
        getRowId: (row) => row.id.toString(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
        meta: {
            selectedRow,
            setSelectedRow,
            updateData: async (id, newData) => {
                handleUpdate(id, data)
            },
            deleteRow: async (id) => {
                handleDelete(id)
            },

        }
    });

    useEffect(() => setColumnVisibility({ id: false }), []);
    useEffect(() => setOpenModal(false), [data]);

    const backColor = alpha(theme.palette.primary.light, 0.1);

    const [openModal, setOpenModal] = useState(false);
    const [openRemoveSharedModal, setOpenRemoveSharedModal] = useState(false);
    const parentTripColors = {};
    const colors = ['#FFEBEE', '#E3F2FD', '#E8F5E9', '#FFF3E0', '#F3E5F5'];

    data.forEach((trip) => {
        if (trip.parent_trip_id) {
            if (!parentTripColors[trip.parent_trip_id]) {
                const colorIndex = Object.keys(parentTripColors).length % colors.length;
                parentTripColors[trip.parent_trip_id] = colors[colorIndex];
            }
        }
    });
    const groupedData = {};
    table.getRowModel().rows.forEach((row) => {
        const parentId = row.original.parent_trip_id;
        if (!groupedData[parentId]) groupedData[parentId] = [];
        groupedData[parentId].push(row);
    });

    const handleMakeShareTrips = async (ids) => {
        const response = await fetcherPost([`/trips/shared/make`, { trip_ids: ids }])
        if (response.status === true) {
            openSnackbar({
                open: true,
                message: response.message || 'Trip are shared successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
        }
        handleGetData()
    };
    const handleRemoveSharedTrips = async (ids) => {
        const response = await fetcherPost([`/trips/shared/remove`, { trip_ids: ids }])
        if (response.status === true) {
            openSnackbar({
                open: true,
                message: response.message || 'Trip are removed from shared successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
        }
        handleGetData()
    };
    const groupLengthMap = {};
    data.forEach(trip => {
        const key = trip.trip_ids.slice().sort((a, b) => a - b).join('-');
        if (!groupLengthMap[key]) {
            groupLengthMap[key] = data.filter(t => {
                const tKey = t.trip_ids.slice().sort((a, b) => a - b).join('-');
                return tKey === key;
            }).length;
        }
    });
    const allTrips = data.map(item => item.id)

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <MainCard content={false} sx={{ overflow: 'visible !important', }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="space-between"
                    sx={{ padding: 2, ...(matchDownSM && { '& .MuiOutlinedInput-root, & .MuiFormControl-root': { width: '100%' } }) }}
                >
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onFilterChange={(value) => setGlobalFilter(String(value))}
                        placeholder={`Search ${data.length} records...`}
                    />
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={'10px'}>
                        {stackontable}
                        <Button
                            variant="contained"
                            color="success"
                            type="button"
                            onClick={() => {
                                setSelectedShareIds(allTrips || []);
                                setOpenModal(true);
                            }}
                            sx={{
                                '&.Mui-disabled': {
                                    bgcolor: theme.palette.action.disabledBackground,
                                    color: theme.palette.text.disabled
                                }
                            }}
                            disabled
                        >
                            Make All Trips Share
                        </Button>
                    </Box>
                </Stack>

                <ScrollX>
                    <TableContainer component={Paper}>
                        <Table sx={{ position: 'relative' }}>
                            <TableHead sx={{ position: 'relative' }}>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                                                Object.assign(header.column.columnDef.meta, {
                                                    className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                                                });
                                            }
                                            const key = `${headerGroup.id}-${header.id}`;
                                            return (
                                                <DraggableColumnHeader key={key} header={header} table={table}>
                                                    <>
                                                        {header.isPlaceholder ? null : (
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                {header.column.getCanGroup() && (
                                                                    <IconButton
                                                                        color={header.column.getIsGrouped() ? 'error' : 'primary'}
                                                                        onClick={header.column.getToggleGroupingHandler()}
                                                                        size="small"
                                                                        sx={{ p: 0, width: 24, height: 24, fontSize: '1rem', mr: 0.75 }}
                                                                    >
                                                                        {header.column.getIsGrouped() ? (
                                                                            <Command size="32" color="#FF8A65" variant="Bold" />
                                                                        ) : (
                                                                            <TableDocument size="32" variant="Outline" />
                                                                        )}
                                                                    </IconButton>
                                                                )}
                                                                <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                                                                {header.column.getCanSort() && <HeaderSort column={header.column} sort />}
                                                            </Stack>
                                                        )}
                                                    </>
                                                </DraggableColumnHeader>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody>
                                {data.map((tripGroup, groupIndex) => {
                                    // Determine which type of group this is
                                    const trips = Array.isArray(tripGroup.round_trip)
                                        ? tripGroup.round_trip
                                        : Array.isArray(tripGroup.shared_trip)
                                            ? tripGroup.shared_trip
                                            : Array.isArray(tripGroup.shared_return_trip)
                                                ? tripGroup.shared_return_trip
                                                : Array.isArray(tripGroup.round_shared_trip)
                                                    ? tripGroup.round_shared_trip
                                                    : [tripGroup.single_trip || tripGroup];

                                    const firstTrip = trips[0];
                                    const tripType = firstTrip.trip_type?.toLowerCase();
                                    const isDarkMode = theme.palette.mode === 'dark';


                                    const colorMap = {
                                        single: {
                                            bg: isDarkMode ? alpha(theme.palette.primary.dark, 0.3) : '#E3F2FD',
                                            text: isDarkMode ? '#b4b4b4ff' : '#1565C0',
                                            label: 'Single Trip',
                                            rowBg: isDarkMode ? alpha(theme.palette.primary.dark, 0.4) : '#F7FBFF',
                                        },
                                        'round trip': {
                                            bg: isDarkMode ? alpha(theme.palette.success.light, 0.1) : '#DAF7DD',
                                            text: isDarkMode ? '#a4a7acff' : '#2E7D32',
                                            label: 'Round Trip',
                                            rowBg: isDarkMode ? alpha(theme.palette.success.light, 0.1) : '#F1F8F3',
                                        },
                                        shared: {
                                            bg: isDarkMode ? alpha(theme.palette.warning.light, 0.1) : '#FFF3E0',
                                            text: isDarkMode ? '#a66a00ff' : '#FF9800',
                                            label: 'Shared Trip',
                                            rowBg: isDarkMode ? alpha(theme.palette.warning.light, 0.2) : '#FFF8E1',
                                        },
                                        'shared return trip': {
                                            bg: isDarkMode ? alpha(theme.palette.info.light, 0.1) : '#E1F5FE',
                                            text: isDarkMode ? '#0277BD' : '#0288D1',
                                            label: 'Shared Return Trip',
                                            rowBg: isDarkMode ? alpha(theme.palette.info.light, 0.2) : '#E1F5FE',
                                        },
                                        'round_shared_trip': {
                                            bg: isDarkMode ? alpha(theme.palette.error.light, 0.1) : '#FFE0E0',
                                            text: isDarkMode ? '#CC0000' : '#D32F2F',
                                            label: 'Round Shared',
                                            rowBg: isDarkMode ? alpha(theme.palette.error.light, 0.2) : '#FFF2F2',
                                        },

                                    };

                                    const color = colorMap[tripType] || {
                                        bg: '#ECEFF1',
                                        text: '#37474F',
                                        label: 'Unknown',
                                        rowBg: '#F9FAFB',
                                    };

                                    return trips.map((trip, index) => {
                                        const row = table.getRow(trip.id);
                                        if (!row) return null;
                                        const tripKey = trip.id ?? `trip-${groupIndex}-${index}`;
                                        const fragmentKey = `group-${groupIndex}-trip-${tripKey}-idx-${index}`;

                                        return (
                                            <React.Fragment key={fragmentKey}>
                                                <TableRow
                                                    sx={{
                                                        backgroundColor: color.rowBg,
                                                        '&:hover': { backgroundColor: `${color.rowBg} !important` },
                                                    }}
                                                >

                                                    {row.original.isFirstInGroup && (
                                                        <TableCell
                                                            rowSpan={groupLengthMap[trip.trip_ids.slice().sort((a, b) => a - b).join('-')]}
                                                            style={{
                                                                backgroundColor: color.bg,
                                                                color: color.text,
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 600,
                                                                fontSize: '13px',
                                                                borderRight: '1px solid #ddd',
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <span>{color.label}</span>
                                                                <span style={{ fontSize: '12px', fontWeight: 400 }}>
                                                                    {firstTrip.service_date
                                                                        ? new Date(firstTrip.service_date).toLocaleDateString()
                                                                        : '—'}
                                                                </span>
                                                            </Box>
                                                        </TableCell>
                                                    )}

                                                    {row.getVisibleCells().map((cell) => {
                                                        if (cell.column.id === 'tripType') return null;
                                                        return (
                                                            <TableCell key={`cell-${tripKey}-${groupIndex}-${index}-${cell.id}`}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        );
                                                    })}

                                                    {row.original.isFirstInGroup && (
                                                        <TableCell
                                                            rowSpan={groupLengthMap[trip.trip_ids.slice().sort((a, b) => a - b).join('-')]}
                                                            style={{
                                                                backgroundColor: '',
                                                                color: color.text,
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 600,
                                                                fontSize: '13px',
                                                                borderRight: '1px solid #ddd',
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                {row?.original?.trip_ids.length > 1 && row.original.trip_type === 'shared' ?
                                                                    (row?.original?.shared_trip_ids?.shared_trips?.length > 0 ?
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="error"
                                                                            type='button'
                                                                            onClick={() => {
                                                                                setSelectedShareIds(row.original.trip_ids || []);
                                                                                setOpenRemoveSharedModal(true);
                                                                            }}
                                                                        >
                                                                            Remove Share
                                                                        </Button>
                                                                        :
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="success"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setSelectedShareIds(row.original.trip_ids || []);
                                                                                setOpenModal(true);
                                                                            }}
                                                                        >
                                                                            Make Share
                                                                        </Button>
                                                                    ) :
                                                                    row?.original?.trip_ids.length > 3 && row.original.trip_type === 'round_shared_trip'
                                                                        ?
                                                                        (row?.original?.shared_trip_ids?.shared_trips?.length > 0 ?
                                                                            <Button
                                                                                variant="outlined"
                                                                                color="error"
                                                                                type='button'
                                                                                onClick={() => {
                                                                                    setSelectedShareIds(row.original.trip_ids || []);
                                                                                    setOpenRemoveSharedModal(true);
                                                                                }}
                                                                            >
                                                                                Remove Share
                                                                            </Button>
                                                                            :
                                                                            <Button
                                                                                variant="outlined"
                                                                                color="success"
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setSelectedShareIds(row.original.trip_ids || []);
                                                                                    setOpenModal(true);
                                                                                }}
                                                                            >
                                                                                Make Share
                                                                            </Button>
                                                                        )
                                                                        :
                                                                        'No match yet'
                                                                }

                                                            </Box>
                                                        </TableCell>
                                                    )}
                                                </TableRow>

                                                {/*  Expanded details row */}
                                                {row.getIsExpanded() && (
                                                    <TableRow key={`${fragmentKey}-expanded`} sx={{ backgroundColor: color.rowBg }}>
                                                        <TableCell colSpan={table.getAllColumns().length + 1}>
                                                            <TripsExpandingDetails data={row.original} />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        );
                                    });
                                })}

                                {/*  Empty state */}
                                {data.length < 1 && (
                                    <TableRow>
                                        <TableCell colSpan={table.getAllColumns().length + 1}>
                                            <EmptyTable msg="No Data" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    </TableContainer>
                    <Divider />
                    {noPagination ? `` :
                        <Box sx={{ p: 2 }}>
                            <TablePagination
                                totalRecords={paginationData?.total || 0}
                                page={page}
                                pageSize={pageSize}
                                handleChangePagination={handleChangePagination}
                                handleChange={handleChangePerPage}
                            />
                        </Box>
                    }
                </ScrollX>
                <TransitionsModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    title={`Make share ${tableName.replace("_", " ")}`}
                    handleSubmit={() => handleMakeShareTrips(selectedShareIds)}
                    btnText="Yes"
                    isSubmitting={isSubmitting}
                >
                    <Typography>
                        Are you sure you want to make these trips shared?
                    </Typography>
                </TransitionsModal>
                <TransitionsModal
                    openModal={openRemoveSharedModal}
                    setOpenModal={setOpenRemoveSharedModal}
                    title={`Remove from share ${tableName.replace("_", " ")}`}
                    handleSubmit={() => handleRemoveSharedTrips(selectedShareIds)}
                    btnText="Yes"
                    isSubmitting={isSubmitting}
                >
                    <Typography>
                        Are you sure you want to remove these trips from shared?
                    </Typography>
                </TransitionsModal>

            </MainCard>
        </DndProvider>
    );
}
