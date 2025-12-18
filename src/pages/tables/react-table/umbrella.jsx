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
import TableFooter from '@mui/material/TableFooter';
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
import makeData from 'data/react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import ExpandingUserDetail from 'sections/tables/react-table/ExpandingUserDetail';

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
import { ArrowDown2, ArrowRight2, CloseCircle, Command, Edit2, Bag, Send, TableDocument, Trash } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Button, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { ThemeMode } from 'config';

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

  const navigate = useNavigate()

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(prevState => !prevState)
  }

  const setSelectedRow = (e) => {
    meta?.setSelectedRow((old) => ({
      ...old,
      [row.id]: !old[row.id]
    }));

    // @ts-ignore
    meta?.revertData(row.index, e?.currentTarget.name === 'cancel');
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title='Edit'>
        <IconButton color={'primary'} onClick={() => navigate(`/update-patient/${row.original.id}`)}>
          <Edit2 variant="Outline" />
        </IconButton>
      </Tooltip>
      <Tooltip title='Delete'>
        <IconButton color="error" onClick={handleOpenModal}>
          <Bag variant="Outline" />
        </IconButton>
      </Tooltip>
      <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Delete Patient" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Delete' isSubmitting="" >
        <Typography id="modal-modal-description">Are you sure, you want to delete a patient?</Typography>
      </TransitionsModal>
    </Stack>
  );
}

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ defaultColumns, data, setData, handleDelete, handleUpdate }) {
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

  const navigate = useNavigate()


  const reorderRow = (draggedRowIndex, targetRowIndex) => {
    data.splice(targetRowIndex, 0, data.splice(draggedRowIndex, 1)[0]);
    setData([...data]);
  };

  const [columnVisibility, setColumnVisibility] = useState({});


  const table = useReactTable({
    data,
    columns,
    defaultColumn: { cell: RowEditable },
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
        setData((oldData) =>
          oldData.map((row) => (row.id === id ? { ...row, ...newData } : row))
        );
        handleUpdate(id, data)
      },
      deleteRow: async (id) => {
        setData((old) => old.filter((row) => row.id !== id))
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
          {/* <SelectColumnVisibility
            {...{
              getVisibleLeafColumns: table.getVisibleLeafColumns,
              getIsAllColumnsVisible: table.getIsAllColumnsVisible,
              getToggleAllColumnsVisibilityHandler: table.getToggleAllColumnsVisibilityHandler,
              getAllColumns: table.getAllColumns
            }}
          /> */}
          <Link to={'/add-patient'}>
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
              Add New Patient
            </Button>
          </Link>
          {/* <CSVExport
            {...{
              data:
                table.getSelectedRowModel().flatRows.map((row) => row.original).length === 0
                  ? data
                  : table.getSelectedRowModel().flatRows.map((row) => row.original),
              headers,
              filename: 'data.csv'
            }}
          /> */}

          <Tooltip title='Deleted Patients'>
            <IconButton color={'error'} onClick={() => navigate(`/deleted-patients`)}>
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
            {/* <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <TableCell />
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.column.getCanFilter() && <Filter column={header.column} table={table} />}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead> */}
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <DraggableRow row={row} reorderRow={reorderRow}>
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
            {...{
              setPageSize: table.setPageSize,
              setPageIndex: table.setPageIndex,
              getState: table.getState,
              getPageCount: table.getPageCount
            }}
          />
        </Box>
      </ScrollX>

    </MainCard>
  );
}

// ==============================|| REACT TABLE - UMBRELLA ||============================== //

export default function UmbrellaTable({ data, setData, handleDelete, handleUpdate }) {

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
        accessorKey: 'avatar',
        enableColumnFilter: false,
        enableGrouping: false,
        cell: (cell) => <Avatar alt={cell.getValue()} size="sm" src={getImageUrl(`avatar-${cell.getValue()}.png`, ImagePath.USERS)} />,
        meta: { className: 'cell-center' }
      },
      {
        id: 'name',
        header: 'Name',
        footer: 'Name',
        accessorKey: 'name',
        dataType: 'text',
        enableGrouping: false
      },
      {
        id: 'email',
        header: 'Email',
        footer: 'Email',
        accessorKey: 'email',
        dataType: 'text',
        enableGrouping: false
      },
      {
        id: 'phone',
        title: 'Phone',
        header: 'Phone',
        accessorKey: 'patient_detail.phone_number',
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
            <Chip label={row.original?.status} variant="filled" color={row.original?.status === 'active' ? 'success' : 'primary'} size='small' />
          )
        },
        dataType: 'select'
      },
      // {
      //   id: 'progress',
      //   header: 'Profile Progress',
      //   footer: 'Profile Progress',
      //   accessorKey: 'progress',
      //   dataType: 'progress',
      //   enableGrouping: false
      // },
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
      <ReactTable {...{ data, defaultColumns: columns, setData, handleDelete, handleUpdate }} />
    </DndProvider>
  );
}

EditAction.propTypes = { row: PropTypes.object, table: PropTypes.object };

ReactTable.propTypes = { defaultColumns: PropTypes.array, data: PropTypes.array, setData: PropTypes.any };
