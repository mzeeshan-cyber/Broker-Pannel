import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from 'components/@extended/IconButton';
import { ArrowDown2, ArrowRight2, CloseCircle, Edit2, Bag } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Box, Chip, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { TripStatuses } from 'constants/constants';
import { updateStatus } from 'store/reducers/reimbursementTripSlice';
import { decryptToken } from 'utils/tokenUtils';
import { orderColumns } from '@tanstack/react-table';
import { FaPlaneDeparture } from 'react-icons/fa';
import RescheduleTrip from 'pages/reimbursement-trips/reschedule-trip';

const changeStatus = async (id, status, dispatch) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    try {
        const response = await fetch(`${API_URL}update-reimbursement-trip/${id}/status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tripStatus: status }),
        });
        const data = await response.json();
        if (response.ok) {
            dispatch(updateStatus({ id, status }));
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

function EditAction({ row, table }) {
    const stateData = useSelector(state => state?.reimmbursementTrip)
    const navigate = useNavigate()

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }
    const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
    const handleOpenRescheduleModal = () => {
        setOpenRescheduleModal(prevState => !prevState)
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="start">
            {row.original.tripStatus === 'completed' || row.original.tripStatus === 'approved' || row.original.tripStatus === 'pending_for_review' || row.original.tripStatus === 'return_to_patient_for_rebilling' ?
                <>
                    <Tooltip title='Reschedule Trip'>
                        <IconButton color="secondary" onClick={handleOpenRescheduleModal}>
                            <FaPlaneDeparture variant="Outline" />
                        </IconButton>
                    </Tooltip>
                    <TransitionsModal openModal={openRescheduleModal} setOpenModal={setOpenRescheduleModal} title="Reschedule Reimbursement Trip" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Reschedule Trip' isSubmitting={stateData.loading} noFooter={true}>
                        <RescheduleTrip tripId={row.original.id} setOpenRescheduleModal={setOpenRescheduleModal}/>
                    </TransitionsModal>
                </> : <Box sx={{paddingLeft:'36px'}}/>
            }
            <Tooltip title='Edit'>
                <IconButton color={'primary'} onClick={() => navigate(`/reimbursement-trips/${row?.original.id}/update`)}>
                    <Edit2 variant="Outline" />
                </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
                <IconButton color="error" onClick={handleOpenModal}>
                    <Bag variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Delete Reimbursement Trip" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Delete' isSubmitting={stateData.loading}>
                <Typography id="modal-modal-description">Are you sure, you want to delete a Reimbursement Trip?</Typography>
            </TransitionsModal>
        </Stack>
    );
}

const StatusTransitions = {
    cancel_by_broker: ["approved", "rejected", "pending", "cancel_by_broker"],
    cancel_by_patient: ["approved", "rejected", "pending", "cancel_by_patient"],
    pending: ["approved", "rejected", "pending"],
    rejected: ["approved", "rejected", "pending", "cancel_by_patient", "cancel_by_broker"],
    approved: ["approved", "rejected", "pending", "completed", "cancel_by_patient", "cancel_by_broker"],
    completed: ["return_to_patient_for_rebilling", "completed"],
    pending_for_review: ["completed", "return_to_patient_for_rebilling","pending_for_review"],
    return_to_patient_for_rebilling: ["return_to_patient_for_rebilling", "completed"]
};

export const columns =
    [
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
            enableGrouping: false,
        },
        {
            id: 'departure_date',
            header: 'Departure Date',
            footer: 'Departure Date',
            accessorKey: 'departure_date',
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
            id: 'app_time',
            header: 'Appointment time',
            footer: 'Appointment time',
            accessorKey: 'app_time',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'tripStatus',
            header: 'Status',
            footer: 'Status',
            accessorKey: 'tripStatus',

            cell: ({ row }) => {
                const dispatch = useDispatch();
                const currentStatus = row.original.tripStatus;

                const handleChange = (event, rowId) => {
                    const newValue = event.target.value;
                    changeStatus(rowId, newValue, dispatch);
                };

                // Get allowed statuses for current status
                const allowed = StatusTransitions[currentStatus] || TripStatuses.map(item => item.name);

                // Filter TripStatuses based on allowed list
                const filteredStatuses = TripStatuses.filter(item => allowed.includes(item.name));

                return (
                    <Select
                        labelId="editable-select-label"
                        sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
                        id={`editable-select-${row.original.id}`}
                        value={currentStatus}
                        onChange={(event) => handleChange(event, row.original.id)}
                        size="small"
                    >
                        {filteredStatuses.map((item, index) => (
                            <MenuItem value={item.name} key={index}>
                                <Chip
                                    color={item.color}
                                    label={item.label}
                                    size="small"
                                    variant="light"
                                />
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
        },
    ]