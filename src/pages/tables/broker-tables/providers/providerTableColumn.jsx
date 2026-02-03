import React, { useState } from 'react';
// material-ui
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
// project import
import IconButton from 'components/@extended/IconButton';
//assets
import { ArrowDown2, ArrowRight2, CloseCircle, Edit2, Bag } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Chip, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { providerStatuses } from 'constants/constants';
import { updateProviderStatus } from 'store/reducers/providerSlice';
import { decryptToken } from 'utils/tokenUtils';

const changeStatus = async (id, status, dispatch) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    try {
        const response = await fetch(`${API_URL}provider/${id}/status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
                'Content-Type': 'application/json',  // Ensure JSON content type
            },
            body: JSON.stringify({ status }), // Send JSON body
        });
        const data = await response.json(); // Parse JSON response
        if (response.ok) {
            dispatch(updateProviderStatus({ id, status }));
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
    const Loader = useSelector(state => state?.provider?.loading);
    const navigate = useNavigate()

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }


    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='Edit'>
                <IconButton color={'primary'} onClick={() => navigate(`/providers/${row?.original.id}/update`)}>
                    <Edit2 variant="Outline" />
                </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
                <IconButton color="error" onClick={handleOpenModal}>
                    <Bag variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Delete provider" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Delete' isSubmitting={Loader}>
                <Typography id="modal-modal-description">Are you sure, you want to delete a provider?</Typography>
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
            id: 'name',
            header: 'Provider Name',
            footer: 'Provider Name',
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
            id: 'address',
            header: 'Address',
            footer: 'Address',
            accessorKey: 'address',
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
                        value={row.original.status} // Use row-specific value
                        onChange={(event) => handleChange(event, row.original.id)}
                        size="small"
                    >
                        {providerStatuses.map((item, index) => (
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
        },
    ]