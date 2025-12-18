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
  DebouncedInput,
  EmptyTable,
  HeaderSort,
  RowSelection,
  TablePagination,
  RowEditable,
  DraggableRow,
  DraggableColumnHeader,
} from 'components/third-party/react-table';

import { getImageUrl, ImagePath } from 'utils/getImageUrl';

//assets
import { ArrowDown2, ArrowRight2, CloseCircle, Command, Edit2, Bag, Send, TableDocument, Trash, AddCircle } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Button, Chip, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { ThemeMode } from 'config';
import Filters from 'components/pages/drivers/filters';
import { reimbursementDriverStatuses, userStatuses } from 'constants/constants';
import { openSnackbar } from 'api/snackbar';
import ExpandingUserDetail from './expanding-details-reimburdement-driver';
import { useDispatch, useSelector } from 'react-redux';
import { driversData, resetFilter, updateDriverStatus } from 'store/reducers/driverSlice';
import { fetcher } from 'utils/axios';
import { decryptToken } from 'utils/tokenUtils';


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

  const Loader = useSelector(state => state?.driver.loader);

  const navigate = useNavigate()
  const { id } = useParams()

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(prevState => !prevState)
  }


  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title='Edit'>
        <IconButton color={'primary'} onClick={() => navigate(`/patients/${id}/reimbursement-drivers/${row.original.id}/update`)}>
          <Edit2 variant="Outline" />
        </IconButton>
      </Tooltip>
      <Tooltip title='Delete'>
        <IconButton color="error" onClick={handleOpenModal}>
          <Bag variant="Outline" />
        </IconButton>
      </Tooltip>
      <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Delete reimbursement driver" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Delete' Loader={Loader}>
        <Typography id="modal-modal-description">Are you sure, you want to delete a reimbursement driver?</Typography>
      </TransitionsModal>
    </Stack>
  );
}

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ defaultColumns, handleDelete, handleUpdate, handleGetBySearch, handleChangePagination, handleChange, pageSize, page }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const driverStateData = useSelector(state => state?.driver)
  const driverPaginationData = driverStateData?.driversPaginationData;
  let data = driverStateData?.driversData;

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

  const navigate = useNavigate()

  const [columnVisibility, setColumnVisibility] = useState({});

  const { id, reimbursement_drivers } = useParams()

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
  return (
    <MainCard content={false} sx={{ overflow: 'visible !important' }}>
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
          <Filters handleGetBySearch={handleGetBySearch} />
          <Link to={`/patients/${id}/reimbursement-drivers/add`}>
            <Button
              variant="contained"
              color="primary"
              type='button'
              sx={{
                fontWeight: 500,
                bgcolor: 'primary',
                color: 'secondary.lighter',
                '&:hover': {
                  color: 'secondary.lighter',
                  ...(theme.palette.mode === ThemeMode.DARK && {
                    bgcolor: 'primary.darker',
                    color: 'secondary.darker'
                  })
                }
              }}
            >
              <AddCircle size="32" />
              <Box sx={{ marginLeft: '5px' }}>Reimbursement driver</Box>
            </Button>
          </Link>

          <Tooltip title='Deleted Reimbursement Driver'>
            <IconButton color={'error'} onClick={() => navigate(`/patients/${id}/reimbursement-drivers/deleted`)}>
              <Trash
                variant="Bold"
              />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <ScrollX>
        <RowSelection selected={Object.keys(rowSelection).length} />
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

export default function ReimbursementTable({ handleDelete, handleUpdate, handleGetBySearch, handleChangePagination, handleChange, pageSize, page }) {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const encryptedFromStorage = localStorage.getItem("token");
  const decryptedToken = decryptToken(encryptedFromStorage);
  const dispatch = useDispatch()

  const changeReimbursementDriverStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}reimbursement-driver/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${decryptedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }), 
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(updateDriverStatus({ id, status }));
        openSnackbar({
          open: true,
          message: data.message || "Status successfully changed",
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        openSnackbar({
          open: true,
          message: data.message || "An unexpected error occurred",
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: error.message || "An unexpected error occurred",
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
  };
  
  const handleChangeStatus = (event, rowId) => {
    const newValue = event.target.value;
    changeReimbursementDriverStatus(rowId, newValue)
  };

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
        id: 'avatar',
        header: 'Avatar',
        accessorKey: 'driver_image',
        enableColumnFilter: false,
        enableGrouping: false,
        cell: (cell) => <Avatar alt={cell.getValue()} size="sm" src={getImageUrl(`avatar-${cell.getValue()}.png`, ImagePath.USERS)} />,
        meta: { className: 'cell-center' }
      },
      {
        id: 'name',
        header: 'Driver Name',
        footer: 'Name',
        accessorKey: 'driver_name',
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
        id: 'address',
        title: 'Address',
        header: 'Address',
        accessorKey: 'address',
        dataType: 'text',
        enableColumnFilter: false,
        enableGrouping: false,
        meta: { className: 'cell-center' }
      },
      {
        id: 'status',
        header: 'Status',
        footer: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {

          return (
            <Select
              labelId="editable-select-label"
              sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
              id={`editable-select-${row.original.id}`}
              value={row.original.status} // Use row-specific value
              onChange={(event) => handleChangeStatus(event, row.original.id)}
              size="small"
            >
              {reimbursementDriverStatuses.map((item, index) => (
                <MenuItem value={item.name} key={index}>
                  <Chip color={item.color} label={item.label} size="small" variant="light" />
                </MenuItem>
              ))}
            </Select>
          );
        },
        dataType: 'select',
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
      <ReactTable {...{ defaultColumns: columns, handleDelete, handleUpdate, handleGetBySearch, handleChangePagination, handleChange, pageSize, page }} />
    </DndProvider>
  );
}

EditAction.propTypes = { row: PropTypes.object, table: PropTypes.object };

ReactTable.propTypes = { defaultColumns: PropTypes.array, data: PropTypes.array, setData: PropTypes.any };
