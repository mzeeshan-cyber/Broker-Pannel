import { Box, Button, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { openSnackbar } from 'api/snackbar';
import { ThemeMode } from 'config';
import React, { useState } from 'react';
import { fetcherPost } from 'utils/axios';
import { useDispatch } from 'react-redux';
import { tripDataAfterApprove } from 'store/reducers/tripsSlice';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { useNavigate } from 'react-router';
import { IoClose } from 'react-icons/io5';

const AssignAndMerge = ({ seletedRows, tripType, clearSelection, getTripsData, counts, tripIds }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [actionType, setActionType] = useState(null);

    const handleOpenModal = (type) => {
        setActionType(type);
        setOpenModal(true);
    };
    const handleApproveAll = async () => {
        setIsLoading(true);

        const data = {
            trip_ids: seletedRows,
            from_status: [tripType],
            to_status: 'approved'
        };

        try {
            const response = await fetcherPost([`/trips/status/bulk-update`, data]);
            if (response.status === true) {
                await getTripsData();
                dispatch(tripDataAfterApprove(seletedRows));
                clearSelection();
                openSnackbar({
                    open: true,
                    message: 'Trips approved!',
                    variant: 'alert',
                    alert: { color: 'success' }
                });
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || 'Trips not approved!',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }

        setIsLoading(false);
        setOpenModal(false);
    };

    const handleRejectedAll = async () => {
        setIsLoading(true);

        const data = {
            trip_ids: seletedRows,
            from_status: [tripType],
            to_status: 'rejected'
        };

        try {
            const response = await fetcherPost([`/trips/status/bulk-update`, data]);
            if (response.status === true) {
                await getTripsData();
                dispatch(tripDataAfterApprove(seletedRows));
                clearSelection();

                openSnackbar({
                    open: true,
                    message: 'Trips rejected!',
                    variant: 'alert',
                    alert: { color: 'success' }
                });
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || 'Trips not rejected!',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }

        setIsLoading(false);
        setOpenModal(false);
    };

    const handleDeleteAll = async () => {
        setIsLoading(true);

        const data = {
            trip_id: seletedRows
        };

        try {
            const response = await fetcherPost([`/trips/delete-multiple`, data]);
            if (response.status === true) {
                await getTripsData();
                dispatch(tripDataAfterApprove(seletedRows));
                clearSelection();

                openSnackbar({
                    open: true,
                    message: 'Trips deleted permanently!',
                    variant: 'alert',
                    alert: { color: 'success' }
                });
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || 'Trips not deleted!',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
        setIsLoading(false);
        setOpenModal(false);
    };
    const handleAssignAll = async () => {
        setIsLoading(true);
        try {
            const response = await fetcherPost([`/trips/assignments/next-7-days`]);
            if (response.status === true) {
                clearSelection();
                openSnackbar({
                    open: true,
                    message: response.message || 'Trips are assigned permanently!',
                    variant: 'alert',
                    alert: { color: 'success' }
                });
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || 'Trips not assigned!',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
        setIsLoading(false);
        setOpenModal(false);
    };
    const handleRevertToPendingAll = async () => {
        setIsLoading(true);
        const data = {
            trip_ids: seletedRows,
            from_status: tripType === 'rejected' || tripType === 'cancel_by_broker' ? ['rejected', 'cancel_by_broker '] : [tripType],
            to_status: "pending"
        };

        try {
            const response = await fetcherPost([`trips/status/bulk-update`, data]);
            if (response.status === true) {
                await getTripsData();
                dispatch(tripDataAfterApprove(seletedRows));
                clearSelection();

                openSnackbar({
                    open: true,
                    message: 'Trips updated successfully!',
                    variant: 'alert',
                    alert: { color: 'success' }
                });
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || 'Trips not updated!',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
        setIsLoading(false);
        setOpenModal(false);
    };
    const handleCancelAll = async () => {
        setIsLoading(true);

        const data = {
            trip_ids: seletedRows,
            from_status: [tripType],
            to_status: "cancel_by_broker"
        };

        try {
            const response = await fetcherPost([`trips/status/bulk-update`, data]);
            if (response.status === true) {
                await getTripsData();
                dispatch(tripDataAfterApprove(seletedRows));
                clearSelection();

                openSnackbar({
                    open: true,
                    message: 'Trips updated successfully!',
                    variant: 'alert',
                    alert: { color: 'success' }
                });
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || 'Trips not updated!',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
        setIsLoading(false);
        setOpenModal(false);
    };
    const handleAssignment = async (tripIds) => {
        try {
            const response = await fetcherPost([`trips/assignments/direct-to-providers`, {
                'trip_ids': tripIds,
                'provider_ids': seletedRows,
            },
            ]);
            if (response.status === true) {
                openSnackbar({
                    open: true,
                    autoHideDuration: 5000,
                    variant: 'alert',
                    alert: {
                        color: 'success',
                    },
                    message: (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: 2
                            }}
                        >
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    Trips Assignment
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    Assigned trips count {response.data.assigned_trip_ids.length}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    un assigned trips count {response.data.unassigned_trip_ids.length}
                                </Typography>
                            </Box>

                            <IconButton
                                size="small"
                                onClick={() => openSnackbar({ open: false })}
                            >
                                <IoClose color='white' />
                            </IconButton>
                        </Box>
                    )
                });
                navigate('/approved-trips')
                clearSelection();
            }
        } catch (error) {
            openSnackbar({
                open: true,
                autoHideDuration: 5000,
                variant: 'alert',
                alert: {
                    color: 'error',
                },
                message: (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: 2
                        }}
                    >
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Trips Assignment
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                Assigned trips count {response.data.assigned_trip_ids.length}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                un assigned trips count {response.data.unassigned_trip_ids.length}
                            </Typography>
                        </Box>

                        <IconButton
                            size="small"
                            onClick={() => openSnackbar({ open: false })}
                        >
                            <IoClose color='white' />
                        </IconButton>
                    </Box>
                )
            });
        }
    };

    const handleConfirmAction = async () => {
        if (actionType === "approve") return handleApproveAll();
        if (actionType === "reject") return handleRejectedAll();
        if (actionType === "delete") return handleDeleteAll();
        if (actionType === "assign") return handleAssignAll();
        if (actionType === "pending") return handleRevertToPendingAll();
        if (actionType === "cancel_by_broker") return handleCancelAll(actionType);
        if (actionType === "bulk-assignment") return handleAssignment(tripIds);
    };

    return (
        <>
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    width: 'max-content',
                    position: 'sticky',
                    bottom: '42%',
                    left: '100%',
                    background: theme.palette.mode === ThemeMode.DARK
                        ? theme.palette.background.paper
                        : '#e7e7e7ff',
                    boxShadow: theme.palette.mode === ThemeMode.DARK ? '' : '1px 2px 4px #c4c4c4ff',
                    borderRadius: '10px',
                    zIndex: 10,
                    padding: '10px 20px'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '30px' }}>
                    <Typography>
                        {seletedRows.length} item{seletedRows.length > 1 ? 's' : ''} selected:
                    </Typography>
                </Box>
                {tripType === 'assigned' &&
                    <>
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => handleOpenModal("assign")}
                            disabled={isLoading}
                        >
                            Unassign {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleOpenModal("cancel_by_broker")}
                            disabled={isLoading}
                        >
                            cancel {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleOpenModal("delete")}
                            disabled={isLoading}
                        >
                            Delete {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                    </>
                }
                {tripType === 'approved' &&
                    <>
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => navigate('/approved-trips/assignment', {
                                state: { seletedRows, counts }
                            })
                            }
                            disabled={isLoading}
                        >
                            Assign {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => handleOpenModal("pending")}
                            disabled={isLoading}
                        >
                            Pending {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleOpenModal("reject")}
                            disabled={isLoading}
                        >
                            Reject {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleOpenModal("cancel_by_broker")}
                            disabled={isLoading}
                        >
                            cancel {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleOpenModal("delete")}
                            disabled={isLoading}
                        >
                            Delete {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                    </>
                }
                {tripType === 'pending' &&
                    <>
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => handleOpenModal("approve")}
                            disabled={isLoading}
                        >
                            Approve {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleOpenModal("reject")}
                            disabled={isLoading}
                        >
                            Reject {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleOpenModal("delete")}
                            disabled={isLoading}
                        >
                            Delete {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                    </>
                }
                {tripType === 'cancel_by_broker' &&
                    <>
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => handleOpenModal("pending")}
                            disabled={isLoading}
                        >
                            Revert back to Pending {seletedRows.length > 1 ? "All" : ""}
                        </Button>
                    </>
                }
                {tripType === 'bulk-assignment' &&
                    <>
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => handleOpenModal("bulk-assignment")}
                            disabled={isLoading}
                        >
                            Assign Trips to Selected Provider{seletedRows.length > 1 ? "s" : ""}
                        </Button>
                    </>
                }
            </Stack >

            <TransitionsModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                title="Confirmation"
                handleSubmit={handleConfirmAction}
                btnText="Yes"
                isSubmitting={isLoading}
            >
                <Typography id="modal-modal-description">
                    Are you sure you want to {actionType === 'bulk-assignment' ? 'assign' : actionType} {seletedRows.length} trip(s)?
                </Typography>
            </TransitionsModal>
        </>
    );
};

export default AssignAndMerge;
