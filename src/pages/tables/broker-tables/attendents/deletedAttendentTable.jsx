import PropTypes from 'prop-types';
import { Fragment, useEffect, useMemo, useState } from 'react';

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
import Tooltip from '@mui/material/Tooltip';
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
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import {
    CSVExport,
    DebouncedInput,
    EmptyTable,
    Filter,
    HeaderSort,
    IndeterminateCheckbox,
    RowSelection,
    TablePagination,
    RowEditable,
    DraggableRow,
    DraggableColumnHeader,
    SelectColumnVisibility
} from 'components/third-party/react-table';

import { getImageUrl, ImagePath } from 'utils/getImageUrl';

//assets
import { ArrowDown2, ArrowRight2, CloseCircle, Command, TableDocument, RefreshCircle } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Button, Chip, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { ThemeMode } from 'config';
import { AttendentStatus, reimbursementDriverStatuses } from 'constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { deletedDriversData, resetFilter } from 'store/reducers/driverSlice';
import { openSnackbar } from 'api/snackbar';
import { fetcher } from 'utils/axios';
import ExpandingUserDetail from './ExpandingUserDetail';

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

// ==============================|| REACT TABLE - EDIT ACTION ||============================== //

function EditAction({ row, table }) {
    const meta = table?.options?.meta;

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='Restore Patient'>
                <IconButton color={'error'} onClick={handleOpenModal}>
                    <RefreshCircle variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Restore patient attendent" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Yes' >
                <Typography id="modal-modal-description">Are you sure, you want to restore this patient's attendent?</Typography>
            </TransitionsModal>
        </Stack>
    );
}

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ defaultColumns, handleDelete, handleUpdate, handleRestoreMultiple }) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [grouping, setGrouping] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});

    const [columns] = useState(() => [...defaultColumns]);

    const [columnOrder, setColumnOrder] = useState(
        // must start out with populated columnOrder so we can splice
        columns.map((column) => column.id)
    );
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const driverStateData = useSelector(state => state?.driver)
    const driverPaginationData = driverStateData?.driversPaginationData;
    let data = driverStateData?.deletedDriversData;

    const patientId = useParams()
    const dispatch = useDispatch()



    const handleChangePagination = async (event, value) => {
        const eventValue = event.target.value;
        setPage(eventValue ? eventValue : value);

        const response = await fetcher([`/deleted-patient-attendants?patient_id=${patientId.id}&page=${eventValue ? eventValue : value}`]);
        if (response.status === true) {
            dispatch(deletedDriversData(response?.data?.data))
            dispatch(resetFilter(false))
            openSnackbar({
                open: true,
                message: response.message || 'data is fetched',
                variant: 'alert',
                alert: { color: 'success' }
            });
        }
    };

    const handleChange = async (event) => {
        setPageSize(Number(event.target.value));
        const per_page = Number(event.target.value);

        const response = await fetcher([`/deleted-patient-attendants?patient_id=${patientId.id}&per_page=${per_page}`]);
        if (response.status === true) {
            dispatch(deletedDriversData(response?.data?.data))
            dispatch(resetFilter(false))
            openSnackbar({
                open: true,
                message: response.message || 'data is fetched',
                variant: 'alert',
                alert: { color: 'success' }
            });
        }
    };

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

    const backColor = alpha(theme.palette.primary.light, 0.1);

    let headers = [];
    table.getVisibleLeafColumns().map(
        (columns) =>
            // @ts-ignore
            columns.columnDef.accessorKey &&
            headers.push({
                label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
                // @ts-ignore
                key: columns.columnDef.accessorKey
            })
    );

    const seletedPateints = [...Object.keys(rowSelection)];

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }

    return (
        <MainCard content={false}>
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
                        disabled={seletedPateints.length <= 0}
                        onClick={handleOpenModal}
                    >
                        {`Restore Drivers ${seletedPateints.length > 0 ? `(${seletedPateints.length})` : ''}`}
                    </Button>
                </Stack>
            </Stack>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Restore patient attendents" handleSubmit={() => handleRestoreMultiple(seletedPateints)} btnText='Restore' >
                <Typography id="modal-modal-description">Are you sure, you want to restore these patient attendents?</Typography>
            </TransitionsModal>

            <ScrollX>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {/* <TableCell /> */}
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
                                                    <ExpandingUserDetail data={row.original} />
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
                <Box sx={{ p: 2 }}>
                    <TablePagination
                        totalRecords={driverPaginationData?.total}
                        page={page}
                        pageSize={pageSize}
                        handleChangePagination={handleChangePagination}
                        handleChange={handleChange}
                    />
                </Box>
            </ScrollX>

        </MainCard>
    );
}

// ==============================|| REACT TABLE - UMBRELLA ||============================== //

export default function DeletedAttendentTable({ handleDelete, handleUpdate, handleRestoreMultiple }) {
    const columns = useMemo(
        () => [
            {
                id: 'expander',
                enableGrouping: false,
                header: () => null,
                cell: ({ row }) => {
                    return row.getCanExpand() ? (
                        <IconButton color={row.getIsExpanded() ? 'primary' : 'secondary'} onClick={row.getToggleExpandedHandler()} size="small">
                            {row.getIsExpanded() ? <ArrowDown2 size="32" variant="Outline" /> : <ArrowRight2 size="32" variant="Outline" />}
                        </IconButton>
                    ) : (
                        <IconButton color="secondary" size="small" disabled>
                            <CloseCircle />
                        </IconButton>
                    );
                }
            },
            {
                id: 'select',
                enableGrouping: false,
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler()
                        }}
                    />
                ),
                cell: ({ row }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler()
                        }}
                    />
                )
            },
            {
                id: 'avatar',
                header: 'Avatar',
                accessorKey: 'driver_image',
                enableColumnFilter: false,
                enableGrouping: false,
                cell: (cell) => <Avatar alt={cell.getValue()} size="sm" src={getImageUrl(`avatar-${cell.getValue()}.png`, ImagePath.USERS)} />,
                meta: { className: 'cell-center' }
            },
            {
                id: 'attendant_name',
                header: 'Attendent Name',
                footer: 'Attendent Name',
                accessorKey: 'attendant_name',
                dataType: 'text',
                enableGrouping: false
            },
            {
                id: 'phone',
                title: 'Phone',
                header: 'Phone',
                accessorKey: 'phone_number',
                dataType: 'text',
                enableColumnFilter: false,
                enableGrouping: false,
                meta: { className: 'cell-center' }
            },
            {
                id: 'relationship',
                title: 'Relationship',
                header: 'Relationship',
                accessorKey: 'relationship',
                dataType: 'text',
                enableColumnFilter: false,
                enableGrouping: false,
                meta: { className: 'cell-center' }
            },
            {
                id: 'edit',
                header: 'Actions',
                cell: EditAction,
                enableGrouping: false,
                meta: { className: 'cell-center' }
            }
        ],
        []
    );

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <ReactTable {...{ defaultColumns: columns, handleDelete, handleUpdate, handleRestoreMultiple }} />
        </DndProvider>
    );
}

EditAction.propTypes = { row: PropTypes.object, table: PropTypes.object };

ReactTable.propTypes = { defaultColumns: PropTypes.array, data: PropTypes.array, setData: PropTypes.any };
