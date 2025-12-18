import React, { Fragment, useEffect, useState } from 'react';
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
    EmptyTable,
    HeaderSort,
    RowSelection,
    TablePagination,
    RowEditable,
    DraggableColumnHeader,
} from 'components/third-party/react-table';

//assets
import { Command, TableDocument } from 'iconsax-react';
import { Button, Typography } from '@mui/material';
import { ThemeMode } from 'config';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import TripsExpandingDetails from 'components/pages/trips/tripsExpandingDetails';
import AssignAndMerge from 'components/pages/trips/assignAndMerge';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
    // rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // store the ranking info
    addMeta(itemRank);

    // return if the item should be filtered in/out
    return itemRank.passed;
};

export const fuzzySort = (rowA, rowB, columnId) => {
    let dir = 0;

    // only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(rowA.columnFiltersMeta[columnId], rowB.columnFiltersMeta[columnId]);
    }

    // provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export default function CommonTable({ isSubmitting, data, handleDelete, handleUpdate, stackontable, defaultColumns, tableType, tableName, handleChangePerPage, handleChangePagination, paginationData, pageSize, page, handleRestoreMultiple, noPagination }) {
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
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        globalFilterFn: fuzzyFilter,
        getRowId: (row) => row.id.toString(), // good to have guaranteed unique row ids/keys for rendering
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
    const seletedRows = [...Object.keys(rowSelection)];

    const [openModal, setOpenModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [openTripModals, setOpenTripModals] = useState({});
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }

    const handleCloseActionsModal = (trip) => {
        const key = trip.parent_trip_id || trip.id;
        setOpenTripModals((prev) => ({
            ...prev,
            [key]: false,
        }));
    };


    const ExpandingDetail = ({ row }) => {
        switch (tableName) {
            case "trips":
                return <TripsExpandingDetails data={row} />
            default:
                return ''
        }
    };
    // create parent trip color map (already in your code)
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
                    {/*  on the base on table type restore data */}
                    {tableType === 'deletedTable' &&
                        <>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                justifyContent="space-between"
                                sx={{ ...(matchDownSM && { '& .MuiOutlinedInput-root, & .MuiFormControl-root': { width: '100%' } }) }}
                            >

                                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        type='button'
                                        sx={{
                                            fontWeight: 500,
                                            bgcolor: 'error',
                                            color: 'white',
                                            '&.Mui-disabled': {
                                                bgcolor: theme.palette.action.disabledBackground,
                                                color: theme.palette.text.disabled
                                            }
                                        }}
                                        disabled={seletedRows.length <= 0}
                                        onClick={handleOpenModal}
                                    >
                                        {`Restore All ${seletedRows.length > 0 ? `(${seletedRows.length})` : ''}`}
                                    </Button>
                                </Stack>
                            </Stack>
                            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title={`Restore ${tableName.replace("_", " ")}`} handleSubmit={() => handleRestoreMultiple(seletedRows)} btnText='Yes' isSubmitting={isSubmitting}>
                                <Typography id="modal-modal-description">{`Are you sure, you want to restore these patient's ${tableName}s?`}</Typography>
                            </TransitionsModal>
                        </>
                    }
                </Stack>
                {/* {seletedRows.length > 0 && <AssignAndMerge seletedRows={seletedRows} />} */}

                <ScrollX>
                    <TableContainer component={Paper}>
                        <Table>
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
                                {Object.values(groupedData).map((groupRows) => {
                                    const totalRows = groupRows.length;
                                    const firstRow = groupRows[0];
                                    const tripType = firstRow.original.trip_type?.toLowerCase();

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
                                            bg: isDarkMode ? alpha(theme.palette.warning.light, 0.3) : '#FFF3E0',
                                            text: isDarkMode ? theme.palette.warning.dark : '#EF6C00',
                                            label: 'Shared Trips',
                                            rowBg: isDarkMode ? alpha(theme.palette.warning.light, 0.3) : '#FFF8E5',
                                        },
                                    };


                                    const color = colorMap[tripType] || {
                                        bg: '#ECEFF1',
                                        text: '#37474F',
                                        label: 'Unknown',
                                        rowBg: '#F9FAFB',
                                    };

                                    // Handle "Single" separately (no grouping)
                                    if (tripType === 'single') {
                                        return groupRows.map((row) => (
                                            <React.Fragment key={row.id}>
                                                <TableRow
                                                    sx={{
                                                        backgroundColor: color.rowBg,
                                                        '&:hover': { backgroundColor: `${color.rowBg} !important` },
                                                    }}
                                                >
                                                    {/* Trip Type column */}
                                                    <TableCell
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
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span>{color.label}</span>
                                                            <span style={{ fontSize: '12px', fontWeight: 400, }}>
                                                                {groupRows[0]?.original?.service_date
                                                                    ? new Date(groupRows[0].original.service_date).toLocaleDateString()
                                                                    : '—'}
                                                            </span>
                                                        </Box>
                                                    </TableCell>

                                                    {/* Remaining columns */}
                                                    {row.getVisibleCells().map((cell) => {
                                                        if (cell.column.id === 'tripType') return null;
                                                        return (
                                                            <TableCell key={cell.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>

                                                {/* Expanded row */}
                                                {row.getIsExpanded() && (
                                                    <TableRow sx={{ backgroundColor: color.rowBg }}>
                                                        <TableCell colSpan={row.getVisibleCells().length + 1}>
                                                            <ExpandingDetail row={row.original} />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ));
                                    }
                                    if (tripType === 'shared') {
                                        return groupRows.map((row, index) => (
                                            <React.Fragment key={row.id}>
                                                <TableRow
                                                    sx={{
                                                        backgroundColor: color.rowBg,
                                                        '&:hover': { backgroundColor: `${color.rowBg} !important` },
                                                    }}
                                                >
                                                    {/* Merged trip type column */}
                                                    {index === 0 && (
                                                        <TableCell
                                                            rowSpan={totalRows}
                                                            style={{
                                                                backgroundColor: color.bg,
                                                                color: color.text,
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 600,
                                                                fontSize: '13px',
                                                                borderRight: '1px solid #ddd',
                                                                // writingMode: 'vertical-rl',
                                                                // transform: 'rotate(180deg)',
                                                                letterSpacing: '2px',
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                                                <span>{color.label}</span>
                                                                <span style={{ fontSize: '12px', fontWeight: 400, }}>
                                                                    {groupRows[0]?.original?.service_date
                                                                        ? new Date(groupRows[0].original.service_date).toLocaleDateString()
                                                                        : '—'}
                                                                    {openTripModals[groupRows[0].original.parent_trip_id || groupRows[0].original.id] && (
                                                                        <AssignAndMerge
                                                                            selectedTrip={groupRows[0].original}
                                                                            onClose={() => handleCloseActionsModal(groupRows[0].original)}
                                                                        />
                                                                    )}



                                                                </span>
                                                            </Box>
                                                        </TableCell>
                                                    )}

                                                    {/* Other columns */}
                                                    {row.getVisibleCells().map((cell) => {
                                                        if (cell.column.id === 'tripType') return null;
                                                        return (
                                                            <TableCell key={cell.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>

                                                {/* Expanded row */}
                                                {row.getIsExpanded() && (
                                                    <TableRow sx={{ backgroundColor: color.rowBg }}>
                                                        <TableCell colSpan={row.getVisibleCells().length + 1}>
                                                            <ExpandingDetail row={row.original} />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ));
                                    }
                                    if (tripType === 'round trip') {
                                        return groupRows.map((row, index) => (
                                            <React.Fragment key={row.id}>
                                                <TableRow
                                                    sx={{
                                                        backgroundColor: color.rowBg,
                                                        '&:hover': { backgroundColor: `${color.rowBg} !important` },
                                                    }}
                                                >
                                                    {/* Merged trip type column */}
                                                    {index === 0 && (
                                                        <TableCell
                                                            rowSpan={totalRows}
                                                            style={{
                                                                backgroundColor: color.bg,
                                                                color: color.text,
                                                                textAlign: 'center',
                                                                verticalAlign: 'middle',
                                                                fontWeight: 600,
                                                                fontSize: '13px',
                                                                borderRight: '1px solid #ddd',
                                                                // writingMode: 'vertical-rl',
                                                                // transform: 'rotate(180deg)',
                                                                letterSpacing: '2px',
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                                                <span>{color.label}</span>
                                                                <span style={{ fontSize: '12px', fontWeight: 400, }}>
                                                                    {groupRows[0]?.original?.service_date
                                                                        ? new Date(groupRows[0].original.service_date).toLocaleDateString()
                                                                        : '—'}
                                                                    {openTripModals[groupRows[0].original.parent_trip_id || groupRows[0].original.id] && (
                                                                        <AssignAndMerge
                                                                            selectedTrip={groupRows[0].original}
                                                                            onClose={() => handleCloseActionsModal(groupRows[0].original)}
                                                                        />
                                                                    )}


                                                                </span>
                                                            </Box>
                                                        </TableCell>
                                                    )}

                                                    {/* Other columns */}
                                                    {row.getVisibleCells().map((cell) => {
                                                        if (cell.column.id === 'tripType') return null;
                                                        return (
                                                            <TableCell key={cell.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>

                                                {/* Expanded row */}
                                                {row.getIsExpanded() && (
                                                    <TableRow sx={{ backgroundColor: color.rowBg }}>
                                                        <TableCell colSpan={row.getVisibleCells().length + 1}>
                                                            <ExpandingDetail row={row.original} />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ));
                                    }
                                })}
                                {table.getRowModel().rows.length < 1 &&
                                    <TableRow>
                                        <TableCell colSpan={table.getAllColumns().length}>
                                            <EmptyTable msg="No Data" />
                                        </TableCell>
                                    </TableRow>
                                }
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
        </DndProvider>
    );
}
