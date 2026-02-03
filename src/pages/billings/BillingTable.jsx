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
    TablePagination,
    RowEditable,
    DraggableColumnHeader,
} from 'components/third-party/react-table';

//assets
import { Command, TableDocument } from 'iconsax-react';

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

export default function CommonTable({ isSubmitting, data, tripIds, handleDelete, handleUpdate, stackontable, defaultColumns, tableName, handleChangePerPage, handleChangePagination, paginationData, pageSize, page, noPagination, noSearch, riskData }) {
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
        getRowId: (row) => row?.id?.toString(),
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
                                {table.getRowModel().rows.length > 0 ?
                                    table.getRowModel().rows.map((row) => {
                                        const { amount: amountStr = 0, miles: milesStr = 0 } = riskData?.[0] || {};
                                        const { trip = {}, total_miles: totalMilesStr = 0, actual_cost: actualCostStr = 0 } = row.original;
                                        const { trip_distance: tripDistanceStr = 0, estimated_cost: estimatedCostStr = 0 } = trip;
                                        const amount = Number(amountStr) || 0;
                                        const miles = Number(milesStr) || 0;
                                        const total_miles = Number(totalMilesStr) || 0;
                                        const actual_cost = Number(actualCostStr) || 0;
                                        const trip_distance = Number(tripDistanceStr) || 0;
                                        const estimated_cost = Number(estimatedCostStr) || 0;
                                        const differenceMiles = total_miles - trip_distance;
                                        const differenceCost = actual_cost - estimated_cost;
                                        const highlightRow = differenceMiles > miles || differenceCost > amount;

                                        return (
                                            <TableRow
                                                key={row.id}
                                                sx={(theme) => ({
                                                    backgroundColor: highlightRow
                                                        ? theme.palette.mode === 'dark'
                                                            ? 'rgba(255, 160, 122, 0.15)'
                                                            : 'rgba(238, 215, 212, 1)'   
                                                        : 'transparent',
                                                    '&:hover': {
                                                        backgroundColor: highlightRow
                                                            ? theme.palette.mode === 'dark'
                                                                ? 'rgba(255, 160, 122, 0.15)'
                                                                : 'rgba(238, 215, 212, 1)'
                                                            : 'transparent',
                                                        cursor: 'default'
                                                    }
                                                })}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>


                                        );
                                    })
                                    :
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
                </ScrollX>
            </MainCard>
        </DndProvider>
    );
}
