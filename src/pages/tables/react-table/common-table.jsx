import { Fragment, useEffect, useState } from 'react';
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
    DraggableRow,
    DraggableColumnHeader,
} from 'components/third-party/react-table';

//assets
import { ArrowDown2, ArrowRight2, Command, TableDocument } from 'iconsax-react';
import { Button, Typography } from '@mui/material';
import { ThemeMode } from 'config';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import PayeeExpandingDetails from 'components/pages/payees/PayeeExpandingDetails';
import ProviderExpandingDetails from 'components/pages/providers/providerExpandingDetails';
import DriverVehicleExpandingDetails from 'components/pages/providers/driver-vehicles/expanding-details';
import PendigRateList from 'components/pages/providers/ratelist/expanding-details';
import ReimbursementTripExpandingDetails from 'components/pages/reimbursement-trips/reimbursement-trip-detail';
import { replace } from 'lodash';
import TripsExpandingDetails from 'components/pages/trips/tripsExpandingDetails';
import AssignAndMerge from 'components/pages/trips/assignAndMerge';
import ExpandingDetails from 'components/pages/tripsInvoices/ExpandingDetails';

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

export default function CommonTable({ isSubmitting, data, tripIds, handleDelete, handleUpdate, stackontable, defaultColumns, tableType, tableName, handleChangePerPage, handleChangePagination, paginationData, pageSize, page, handleRestoreMultiple, noPagination, noSearch }) {
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
        pageCount: Math.ceil((paginationData?.total || 0) / pageSize),
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
        // getPaginationRowModel: getPaginationRowModel(), client side pagination
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        globalFilterFn: fuzzyFilter,
        getRowId: (row) => row?.id?.toString(), // good to have guaranteed unique row ids/keys for rendering
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
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }

    const ExpandingDetail = ({ row }) => {
        switch (tableName) {
            case "payee":
                return <PayeeExpandingDetails data={row} />
            case "provider":
                return <ProviderExpandingDetails data={row} />
            case "driver-vehicles":
                return <DriverVehicleExpandingDetails data={row} />
            case "panding-rate-list":
                return <PendigRateList data={row} />
            case "reimbursement-trip":
                return <ReimbursementTripExpandingDetails data={row} />
            case "trips":
                return <TripsExpandingDetails data={row} />
            case "trip-invoices":
                return <ExpandingDetails data={row} />
            default:
                return ''
        }
    };

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <MainCard content={false} sx={{ overflow: 'visible !important' }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={!noSearch ? 2 : 0}
                    justifyContent="space-between"
                    sx={{ padding: !noSearch ? 2 : 0, ...(matchDownSM && { '& .MuiOutlinedInput-root, & .MuiFormControl-root': { width: '100%' } }) }}
                >
                    {!noSearch &&
                        <DebouncedInput
                            value={globalFilter ?? ''}
                            onFilterChange={(value) => setGlobalFilter(String(value))}
                            placeholder={`Search ${data.length} records...`}
                        />
                    }
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
                    {tableType === 'assignment' &&
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
                                        color="success"
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
                                        disabled={seletedRows.length > 0}
                                        onClick={handleOpenModal}
                                    >
                                        {`Assign Trips to All Providers`}
                                    </Button>
                                </Stack>
                            </Stack>
                            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title={`Assign Trips To All The Providers`} handleSubmit={() => handleRestoreMultiple(tripIds, data.map(item => item.id))} btnText='Yes' isSubmitting={isSubmitting}>
                                <Typography id="modal-modal-description">{`Are you sure, you want to bulk assign these trips?`}</Typography>
                            </TransitionsModal>
                        </>
                    }
                </Stack>

                <ScrollX>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
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
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <Fragment key={row.id}>
                                            <DraggableRow row={row}>
                                                <>
                                                    {row.getVisibleCells().map((cell) => {
                                                        let bgcolor = 'background.paper';
                                                        if (cell.getIsGrouped()) bgcolor = 'primary.lighter';
                                                        if (cell.getIsAggregated()) bgcolor = 'warning.lighter';
                                                        if (cell.getIsPlaceholder()) bgcolor = 'error.lighter';

                                                        if (cell.column.columnDef.meta !== undefined && cell.column.getCanSort()) {
                                                            Object.assign(cell.column.columnDef.meta, {
                                                                style: { backgroundColor: bgcolor }
                                                            });
                                                        }

                                                        return (
                                                            <TableCell
                                                                key={cell.id}
                                                                {...cell.column.columnDef.meta}
                                                                sx={{ bgcolor }}
                                                                {...(cell.getIsGrouped() &&
                                                                    cell.column.columnDef.meta === undefined && {
                                                                    style: { backgroundColor: bgcolor }
                                                                })}
                                                            >
                                                                {cell.getIsGrouped() ? (
                                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                                        <IconButton
                                                                            color="secondary"
                                                                            onClick={row.getToggleExpandedHandler()}
                                                                            size="small"
                                                                            sx={{ p: 0, width: 24, height: 24 }}
                                                                        >
                                                                            {row.getIsExpanded() ? (
                                                                                <ArrowDown2 size="32" variant="Outline" />
                                                                            ) : (
                                                                                <ArrowRight2 size="32" variant="Outline" />
                                                                            )}
                                                                        </IconButton>
                                                                        <Box>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Box> <Box>({row.subRows.length})</Box>
                                                                    </Stack>
                                                                ) : cell.getIsAggregated() ? (
                                                                    flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())
                                                                ) : cell.getIsPlaceholder() ? null : (
                                                                    flexRender(cell.column.columnDef.cell, cell.getContext())
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </>
                                            </DraggableRow>
                                            {row.getIsExpanded() && !row.getIsGrouped() && (
                                                <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` } }}>
                                                    <TableCell colSpan={row.getVisibleCells().length + 2}>
                                                        <ExpandingDetail row={row?.original} />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Fragment>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={table.getAllColumns().length}>
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
            {tableName === 'bulk-assignment' && seletedRows.length > 0 && <AssignAndMerge seletedRows={seletedRows} tripType={tableName} clearSelection={() => setRowSelection({})} tripIds={tripIds} />}
        </DndProvider>
    );
}
