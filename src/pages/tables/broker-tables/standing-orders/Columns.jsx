import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from 'components/@extended/IconButton';
import { ArrowDown2, ArrowRight2, CloseCircle, Edit2, Bag } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Chip, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { standingOrderStatuses } from 'constants/constants';
import { decryptToken } from 'utils/tokenUtils';
import { capitalize } from 'lodash';
import { updateStandingOrderStatus } from 'store/reducers/standingOrderSlice';

const changeStatus = async (id, status, dispatch) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    try {
        const response = await fetch(`${API_URL}update-standing-order-status/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        const data = await response.json();
        if (response.ok) {
            dispatch(updateStandingOrderStatus({ id, status }));
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
    const Loader = useSelector(state => state?.complaints.loading);
    const navigate = useNavigate()

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='Update Complaint'>
                <IconButton color={'primary'} onClick={() => navigate(`/standing-orders/${row?.original.id}/update`)}>
                    <Edit2 variant="Outline" />
                </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
                <IconButton color="error" onClick={handleOpenModal}>
                    <Bag variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Delete Standing Order" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Delete' Loader={Loader}>
                <Typography id="modal-modal-description">Are you sure, you want to delete this standing order?</Typography>
            </TransitionsModal>
        </Stack>
    );
}

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
            id: 'so_id',
            header: 'Id',
            footer: 'Id',
            accessorKey: 'id',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'appointment_time',
            header: 'Appointment Time',
            footer: 'Appointment Time',
            accessorKey: 'appointment_time',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'mobility',
            header: 'Mobility',
            footer: 'Mobility',
            accessorKey: 'mobility',
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
        {
            id: 'is_two_way',
            header: 'Is Round',
            footer: 'Is Round',
            accessorFn: row => capitalize(row.is_two_way ? 'Yes': 'No'),
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'status',
            header: 'Status',
            footer: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => {
                const dispatch = useDispatch();
                const handleChange = (event, rowId) => {
                    const newValue = event.target.value;
                    changeStatus(rowId, newValue, dispatch)
                };
                return (
                    <Select
                        labelId="editable-select-label"
                        sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
                        id={`editable-select-${row.original.id}`}
                        value={row.original.status}
                        onChange={(event) => handleChange(event, row.original.id)}
                        size="small"
                    >
                        {standingOrderStatuses.map((item, index) => (
                            <MenuItem value={item.name} key={index}>
                                <Chip color={item.color} label={item.label} size="small" variant="light" />
                            </MenuItem>
                        ))}
                    </Select>
                );
            },
            dataType: 'select',
            enableGrouping: false
        },
        {
            id: 'edit',
            header: 'Actions',
            cell: EditAction,
            enableGrouping: false,
            meta: { className: 'cell-center' }
        },
    ]