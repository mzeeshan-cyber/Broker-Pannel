import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from 'components/@extended/IconButton';
import { ArrowDown2, ArrowRight2, CloseCircle, Edit2, Bag, Slash } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Chip, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { complaintsStatuses } from 'constants/constants';
import { decryptToken } from 'utils/tokenUtils';
import { capitalize } from 'lodash';
import { updateComplaintStatus } from 'store/reducers/complaintsSlide';
import { BsChatSquare } from 'react-icons/bs';
import ReusableDrawer from 'components/common/ReusableDrawer';
import Conversation from 'pages/complaints/Conversation';

const changeStatus = async (id, status, dispatch) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    try {
        const response = await fetch(`${API_URL}update-status/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        const data = await response.json();
        if (response.ok) {
            dispatch(updateComplaintStatus({ id, status }));
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

function handleComments({ row }) {
    const commentCount = row?.original?.comments_history?.filter(item => item.type === 'provider')?.filter(item => item.is_read === 0).length;
    const [open, setOpen] = useState(false);
    const handleToggle = () => setOpen(!open);
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='View Comments'>
                <IconButton color={'primary'} onClick={handleToggle}>
                    <BsChatSquare variant="Outline" color='green' size={30} />
                    {commentCount > 0 &&
                        <Box sx={{ position: 'absolute', top: 0, background: '#008000ff', borderRadius: '20px', fontSize: '10px', padding: '3px', right: '-5px', color: 'white', minWidth: '18px' }}>{commentCount ?? commentCount}</Box>
                    }
                </IconButton>
            </Tooltip>
            <ReusableDrawer
                open={open}
                onClose={handleToggle}
                title="Conversation B/W Broker and Provider"
            >
                <Conversation comments={row.original} open={open} />
            </ReusableDrawer>
        </Stack >
    );
}

function EditAction({ row, table }) {
    const Loader = useSelector(state => state?.complaints.loading);
    const navigate = useNavigate()

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }
    if (row.original.status === 'pending' && row.original.raised_by_role === 'broker') {
        return (
            <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title='Update Complaint'>
                    <IconButton color={'primary'} onClick={() => navigate(`/complaints/${row?.original.id}/update`)}>
                        <Edit2 variant="Outline" />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Delete'>
                    <IconButton color="error" onClick={handleOpenModal}>
                        <Bag variant="Outline" />
                    </IconButton>
                </Tooltip>
                <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Delete Complaint" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Delete' Loader={Loader}>
                    <Typography id="modal-modal-description">Are you sure, you want to delete this complaint?</Typography>
                </TransitionsModal>
            </Stack>
        );
    }
    else {
        return (
            <Tooltip title="No actions available for this status or user">
                <Stack direction="row" spacing={1} alignItems="center" sx={{ opacity: 0.5 }}>
                    <IconButton color="error">
                        <Slash variant="Outline" />
                    </IconButton>
                </Stack>
            </Tooltip>
        )
    }
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
            id: 'complaint_number',
            header: 'Complaint Number',
            footer: 'Complaint Number',
            accessorKey: 'complaint_number',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'subject',
            header: 'Complaint',
            footer: 'Complaint',
            accessorFn: row => capitalize(row.subject),
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'raised_by_role',
            header: 'Reported By',
            footer: 'Reported By',
            accessorFn: row => capitalize(row.raised_by_role),
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'target_role',
            header: 'Reported Against',
            footer: 'Reported Against',
            accessorFn: row => `${capitalize(row.target.name)} (${capitalize(row.target_role)})`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'assigned_role',
            header: 'Complaint Handler',
            footer: 'Complaint Handler',
            accessorFn: row => `${capitalize(row.assigned.name)} (${capitalize(row.assigned_role)})`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'priority',
            header: 'Priority',
            footer: 'Priority',
            accessorKey: 'priority',
            cell: ({ row }) => {
                return (
                    <Chip color={
                        row.original.priority === 'low' ? 'info' :
                            row.original.priority === 'medium' ? 'warning' :
                                row.original.priority === 'high' ? 'error' :
                                    row.original.priority === 'critical' ? 'error' :
                                        'default'}
                        label={capitalize(row.original.priority)} size="small" variant="light" />
                );
            },
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
                        {complaintsStatuses.map((item, index) => (
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
            id: 'comments',
            header: 'Comments',
            cell: handleComments,
            enableGrouping: false,
            meta: { className: 'cell-center' }
        },
        {
            id: 'edit',
            header: 'Actions',
            cell: EditAction,
            enableGrouping: false,
            meta: { className: 'cell-center' }
        },
    ]