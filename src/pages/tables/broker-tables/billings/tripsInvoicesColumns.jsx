import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from 'components/@extended/IconButton';
import { ArrowDown2, ArrowRight2, CloseCircle, Eye } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Chip, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useNavigate } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import { useDispatch } from 'react-redux';
import { TripInvoicesStatus } from 'constants/constants';
import { decryptToken } from 'utils/tokenUtils';
import { updateStatus } from 'store/reducers/tripsInvoicesSlice';

const changeStatus = async (id, status, dispatch, paid_date = null) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);

    try {
        const response = await fetch(`${API_URL}trip-invoice/${id}/status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status,
                ...(paid_date && { paid_date })
            }),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch(updateStatus({ id, status, paid_date }));
            openSnackbar({
                open: true,
                message: data.message || "Status successfully changed",
                variant: 'alert',
                alert: { color: 'success' }
            });
        } else {
            throw new Error(data.message);
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

function EditAction({ row }) {
    const navigate = useNavigate()
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='View Trips'>
                <IconButton color={'primary'} onClick={() => navigate(`/trips-invoice/${row?.original.id}/view`)}>
                    <Eye variant="Outline" />
                </IconButton>
            </Tooltip>
        </Stack>
    );
}
const StatusTransitions = {
    paid: ["paid"],
    submitted: ["paid", "rejected", "submitted"],
    rejected: ["rejected",],
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
            id: 'title',
            header: 'Invoice',
            footer: 'Invoice',
            accessorKey: 'title',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'submission_date',
            header: 'Submission Date',
            footer: 'Submission Date',
            accessorKey: 'submission_date',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'paid_date',
            header: 'Paid Date',
            footer: 'Paid Date',
            accessorFn: row => row?.paid_date || '—',
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

                const [openPaidModal, setOpenPaidModal] = useState(false);
                const [paidDate, setPaidDate] = useState('');

                const currentStatus = row.original.status;
                const rowId = row.original.id;

                const handleChange = (event) => {
                    const newStatus = event.target.value;

                    if (newStatus === 'paid') {
                        setOpenPaidModal(true);
                    } else {
                        changeStatus(rowId, newStatus, dispatch);
                    }
                };

                const handlePaidSubmit = () => {
                    if (!paidDate) return;

                    changeStatus(rowId, 'paid', dispatch, paidDate);
                    setOpenPaidModal(false);
                    setPaidDate('');
                };

                const allowed = StatusTransitions[currentStatus] || TripInvoicesStatus.map(item => item.name);
                const filteredStatuses = TripInvoicesStatus.filter(item => allowed.includes(item.name));

                return (
                    <>
                        {currentStatus === 'submitted' ?
                            <Select
                                value={currentStatus}
                                onChange={handleChange}
                                size="small"
                                sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
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
                            :
                            <Chip
                                color={currentStatus === 'paid' ? 'success' : currentStatus === 'rejected' ? 'error' : 'info'}
                                label={currentStatus}
                                size="small"
                                variant="light"
                            />
                        }

                        {/* Paid Date Modal */}
                        <TransitionsModal
                            openModal={openPaidModal}
                            setOpenModal={setOpenPaidModal}
                            title="Mark Invoice as Paid"
                            handleSubmit={handlePaidSubmit}
                            btnText="Confirm"
                        >
                            <Stack spacing={1} sx={{ minWidth: '320px' }}>
                                <InputLabel>Paid Date</InputLabel>
                                <TextField
                                    type="date"
                                    value={paidDate}
                                    onChange={(e) => setPaidDate(e.target.value)}
                                    fullWidth
                                />
                            </Stack>
                        </TransitionsModal>
                    </>
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