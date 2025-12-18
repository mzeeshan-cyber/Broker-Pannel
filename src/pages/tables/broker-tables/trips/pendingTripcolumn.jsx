import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from 'components/@extended/IconButton';
import { ArrowDown2, ArrowRight2, CloseCircle, Edit2, Bag } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Chip, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
// import { openSnackbar } from 'api/snackbar';
import { useDispatch, useSelector } from 'react-redux';
// import { PendingTripStatuses } from 'constants/constants';
// import { updatePendingStatusAndRemove } from 'store/reducers/tripsSlice';
// import { decryptToken } from 'utils/tokenUtils';
import { IndeterminateCheckbox } from 'components/third-party/react-table';

// const changeStatus = async (id, status) => {
//     const API_URL = import.meta.env.VITE_APP_API_URL;
//     const encryptedFromStorage = localStorage.getItem("token");
//     const decryptedToken = decryptToken(encryptedFromStorage);

//     try {
//         const response = await fetch(`${API_URL}update-trip/${id}/status`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${decryptedToken}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ trip_status: status }),
//         });

//         const data = await response.json();

//         if (response.ok) {
//             openSnackbar({
//                 open: true,
//                 message: data.message || "Status successfully changed",
//                 variant: 'alert',
//                 alert: { color: 'success' },
//             });
//             return true; // indicate success
//         } else {
//             openSnackbar({
//                 open: true,
//                 message: data.message || "An unexpected error occurred",
//                 variant: 'alert',
//                 alert: { color: 'error' },
//             });
//             return false;
//         }
//     } catch (error) {
//         openSnackbar({
//             open: true,
//             message: error.message || "An unexpected error occurred",
//             variant: 'alert',
//             alert: { color: 'error' },
//         });
//         return false;
//     }
// };


function EditAction({ row, table }) {
    const stateData = useSelector(state => state?.trips)
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }
    const selectedCount = table.getSelectedRowModel().rows.length;

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='Edit'>
                <IconButton disabled={selectedCount > 0} color={'primary'} onClick={() => navigate(`/trips/${row?.original.id}/update`)}>
                    <Edit2 variant="Outline" />
                </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
                <IconButton disabled={selectedCount > 0} color="error" onClick={handleOpenModal}>
                    <Bag variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Delete Trip" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Delete' isSubmitting={stateData.loading}>
                <Typography id="modal-modal-description">Are you sure, you want to delete a Trip?</Typography>
            </TransitionsModal>
        </Stack>
    );
}

export const columns =
    [
        {
            id: 'tripType',
            header: ({ table }) => (
                <>
                    <IndeterminateCheckbox
                        {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler()
                        }}
                    />
                    <span>Type</span>
                </>
            ),
            cell: ({ row, table }) => {
                const { trip_type, parent_trip_id, id } = row.original;
                const allRows = table.getRowModel().rows;

                // Group rows for shared or round trip
                let groupRows = [];
                if (['round trip'].includes(trip_type?.toLowerCase())) {
                    groupRows = allRows.filter(
                        (r) =>
                            r.original.parent_trip_id === parent_trip_id ||
                            r.original.id === parent_trip_id
                    );
                } else {
                    groupRows = [row];
                }

                const firstRow = groupRows[0];
                const isFirstRow = firstRow.id === row.id;
                const rowSpan = groupRows.length;

                const colorMap = {
                    single: { bg: '#E3F2FD', text: '#1565C0', label: 'Single' },
                    'round trip': { bg: '#E8F5E9', text: '#2E7D32', label: 'Round Trip' },
                    shared: { bg: '#FFF3E0', text: '#EF6C00', label: 'Shared' },
                };

                const color = colorMap[trip_type?.toLowerCase()] || {
                    bg: '#ECEFF1',
                    text: '#37474F',
                    label: 'Unknown',
                };

                //  Handle checkbox click
                const handleSelect = (e) => {
                    const isSelected = e.target.checked;
                    row.toggleSelected(isSelected);

                    const currentTrip = row.original;

                    // Auto-select paired round trip
                    if (currentTrip.trip_type?.toLowerCase() === 'round trip' && currentTrip.other_trip_id) {
                        const pairedRow = allRows.find(
                            (r) => r.original.id === currentTrip.other_trip_id
                        );
                        if (pairedRow) pairedRow.toggleSelected(isSelected);
                    }

                    // If this is return trip, select parent
                    if (currentTrip.parent_trip_id) {
                        const pairedRow = allRows.find(
                            (r) => r.original.id === currentTrip.parent_trip_id
                        );
                        if (pairedRow) pairedRow.toggleSelected(isSelected);
                    }
                };

                // Skip repeated rows for round/shared types
                if (!isFirstRow && trip_type?.toLowerCase() !== 'single') return null;

                return (
                    <td
                        rowSpan={trip_type?.toLowerCase() === 'single' ? 1 : rowSpan}
                        style={{
                            backgroundColor: color.bg,
                            color: color.text,
                            fontWeight: 600,
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            borderRight: '1px solid #ddd',
                        }}
                    >
                        <Stack direction="column" spacing={1} alignItems="center" justifyContent="center">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {color.label}
                            </Typography>

                            <IndeterminateCheckbox
                                {...{
                                    checked: row.getIsSelected(),
                                    disabled: !row.getCanSelect(),
                                    indeterminate: row.getIsSomeSelected(),
                                    onChange: handleSelect
                                }}
                            />
                        </Stack>
                    </td>
                );
            },
        },
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
            id: 'trip_id',
            header: 'Trip Id',
            footer: 'Trip Id',
            accessorKey: 'id',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'pickup_time',
            header: '(PU - App) Time',
            footer: 'Pick up - Appointment',
            accessorFn: row => `${row.pickup_time} - ${row.appointment_time}`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'patient.name',
            header: 'Patient Name',
            footer: 'Patient Name',
            accessorFn: row => row?.patient?.name || '—',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'pickup_address',
            header: 'Pickup Address',
            footer: 'Pickup Address',
            accessorKey: 'pickup_address',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'dropoff_address',
            header: 'Dropoff Address',
            footer: 'Dropoff Address',
            accessorKey: 'dropoff_address',
            dataType: 'text',
            enableGrouping: false
        },
        // {
        //     id: 'trip_status',
        //     header: 'Status',
        //     footer: 'Status',
        //     accessorKey: 'trip_status',
        //     cell: ({ row, table }) => {
        //         const dispatch = useDispatch();
        //         const handleChange = async (event, rowData) => {
        //             const newValue = event.target.value;
        //             const { id, other_trip_id, trip_type } = rowData;
        //             const success = await changeStatus(id, newValue);

        //             if (!success) return;

        //             if (trip_type?.toLowerCase() === 'round trip' && other_trip_id) {
        //                 dispatch(updatePendingStatusAndRemove({ id, other_trip_id, status: newValue }));
        //             } else {
        //                 dispatch(updatePendingStatusAndRemove({ id, status: newValue }));
        //             }
        //         };

        //         const selectedCount = table.getSelectedRowModel().rows.length;
        //         return (
        //             <Select
        //                 labelId="editable-select-label"
        //                 sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
        //                 id={`editable-select-${row.original.id}`}
        //                 value={row.original.trip_status}
        //                 onChange={(event) => handleChange(event, row.original)}
        //                 size="small"
        //                 disabled={selectedCount > 0}
        //             >
        //                 {PendingTripStatuses.map((item, index) => (
        //                     <MenuItem value={item.name} key={index}>
        //                         <Chip color={item.color} label={item.label} size="small" variant="light" />
        //                     </MenuItem>
        //                 ))}
        //             </Select>
        //         );
        //     },
        //     dataType: 'select',
        // },
        {
            id: 'edit',
            header: 'Actions',
            cell: EditAction,
            enableGrouping: false,
            meta: { className: 'cell-center' }
        },
    ]