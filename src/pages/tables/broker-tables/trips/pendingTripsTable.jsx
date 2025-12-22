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
import { Button, Checkbox, Typography } from '@mui/material';
import { ThemeMode } from 'config';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import TripsExpandingDetails from 'components/pages/trips/tripsExpandingDetails';
import AssignAndMerge from 'components/pages/trips/assignAndMerge';

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

export default function PendingTripTable({ isSubmitting, data, handleDelete, handleUpdate, stackontable, defaultColumns, tableType, tableName, handleChangePerPage, handleChangePagination, paginationData, pageSize, page, handleRestoreMultiple, noPagination, getTripsData }) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
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
        // getPaginationRowModel: getPaginationRowModel(),
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

    const backColor = alpha(theme.palette.primary.light, 0.1);
    const seletedRows = (() => {
        const selectedIds = Object.keys(rowSelection);
        const allSelected = new Set();

        selectedIds.forEach((id) => {
            const row = table.getRow(id);
            if (!row) return;

            if (row.original.parent_trip_id) {
                // It's part of a pair; select all trips with the same parent_trip_id
                data.forEach((trip) => {
                    if (trip.parent_trip_id === row.original.parent_trip_id) {
                        allSelected.add(trip.id.toString());
                    }
                });
            } else {
                // Single trip
                allSelected.add(row.id);
            }
        });

        return Array.from(allSelected);
    })();

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
    const groupLengthMap = {};
    data.forEach(trip => {
        const key = trip.trip_ids?.slice().sort((a, b) => a - b).join('-');
        if (!groupLengthMap[key]) {
            groupLengthMap[key] = data.filter(t => {
                const tKey = t.trip_ids?.slice().sort((a, b) => a - b).join('-');
                return tKey === key;
            }).length;
        }
    });

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
                    {stackontable}
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

                                            return (
                                                <DraggableColumnHeader key={header.id} header={header} table={table}>
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
                                    const parentId = tripGroup.parent_trip_id || tripGroup.id;
                                    const trips = Array.isArray(tripGroup.round_trip)
                                        ? tripGroup.round_trip
                                        : Array.isArray(tripGroup.shared_trip)
                                            ? tripGroup.shared_trip
                                            : Array.isArray(tripGroup.shared_return_trip)
                                                ? tripGroup.shared_return_trip
                                                : Array.isArray(tripGroup.round_shared_trip)
                                                    ? tripGroup.round_shared_trip
                                                    : [tripGroup.single_trip || tripGroup];
                                    // calculating length for the purpose of  row span 
                                    const tripsNewLngth = data.flatMap((tg) => {
                                        const groupTrips = tg.round_trip || tg.shared_trip || tg.shared_return_trip || [tg.single_trip || tg];
                                        return groupTrips.filter(t => (t.parent_trip_id || t.id) === parentId);
                                    });
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

                                    //  Manage group selection for round/shared trips
                                    const handleGroupSelect = (checked) => {
                                        trips.forEach((t) => {
                                            const row = table.getRow(t.id);
                                            if (row) row.toggleSelected(checked);
                                        });
                                    };

                                    const allSelected = trips.every((t) => table.getRow(t.id)?.getIsSelected());
                                    const partiallySelected =
                                        trips.some((t) => table.getRow(t.id)?.getIsSelected()) && !allSelected;

                                    return trips.map((trip, index) => {
                                        const row = table.getRow(trip.id);
                                        if (!row) return null;

                                        return (
                                            <React.Fragment key={trip.id}>
                                                <TableRow
                                                    sx={{
                                                        backgroundColor: color.rowBg,
                                                        '&:hover': { backgroundColor: `${color.rowBg} !important` },
                                                    }}
                                                >

                                                    {row.original.isFirstInGroup && (
                                                        <TableCell
                                                            rowSpan={tripType === 'single' ? 1 : tripsNewLngth.length}
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
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                                                <Checkbox
                                                                    sx={{ marginTop: '-7px' }}
                                                                    checked={tripType === 'single' ? row.getIsSelected?.() : allSelected}
                                                                    indeterminate={tripType !== 'single' && partiallySelected}
                                                                    onChange={(e) =>
                                                                        tripType === 'single'
                                                                            ? row.getToggleSelectedHandler?.()(e)
                                                                            : handleGroupSelect(e.target.checked)
                                                                    }
                                                                    inputProps={{ 'aria-label': 'Select trip group' }}
                                                                />
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                                    <span>{color.label}</span>
                                                                    <span style={{ fontSize: '12px', fontWeight: 400 }}>
                                                                        {firstTrip.service_date
                                                                            ? new Date(firstTrip.service_date).toLocaleDateString()
                                                                            : '—'}
                                                                    </span>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                    )}


                                                    {/* All other columns (unchanged) */}
                                                    {row.getVisibleCells().map((cell) => {
                                                        if (cell.column.id === 'tripType') return null;
                                                        return (
                                                            <TableCell key={cell.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>

                                                {/*  Expanded details row */}
                                                {row.getIsExpanded() && (
                                                    <TableRow sx={{ backgroundColor: color.rowBg }}>
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
            </MainCard>
            {seletedRows.length > 0 && <AssignAndMerge seletedRows={seletedRows} tripType={tableName} clearSelection={() => setRowSelection({})} getTripsData={getTripsData} />}
        </DndProvider>
    );
}
