import { IconButton, Stack, Tooltip, Chip, MenuItem, Select } from "@mui/material";
import { openSnackbar } from "api/snackbar";
import AddCommentForm from "components/pages/providers/ratelist/add-comment ";
import { AddSquare, ArrowDown2, ArrowRight2, CloseCircle } from "iconsax-react";
import { capitalize } from "lodash";
import { useState } from "react";
import ObjectionModal from "sections/components-overview/modal/OjbectionModal";
import { fetcherPost } from "utils/axios";
import { useDispatch } from 'react-redux';
import { ratelistStatuses } from 'constants/constants';
import { decryptToken } from 'utils/tokenUtils';
import { useParams } from "react-router";
import { updateRateListStatus } from "store/reducers/ratelistSlice";
import { IndeterminateCheckbox } from "components/third-party/react-table";

const changeStatus = async (id, status, dispatch, provider_id, broker_notes) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    try {
        const response = await fetch(`${API_URL}rate-list-update-status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rate_list_id: id,
                provider_id: provider_id,
                status: status
            }),
        });
        const data = await response.json();
        if (data.status === true) {
            dispatch(updateRateListStatus({ id, status, broker_notes }));
            openSnackbar({
                open: true,
                message: data.message || "Status successfully changed",
                variant: 'alert',
                alert: { color: 'success' }
            });
        }
        else {
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

function EditAction({ row }) {
    const rateList = row?.original;
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const { provider_id } = useParams();
    const AddCommentHandler = async (values) => {
        const response = await fetcherPost(['/store-broker-note', values]);
        const broker_notes = values?.broker_notes;
        if (response.status === true || response.status === 200) {
            openSnackbar({
                open: true,
                message: response.message,
                variant: 'alert',
                alert: { color: 'success' }
            });
            const id = rateList?.id;
            await changeStatus(id, "rejected", dispatch, provider_id, broker_notes);
            setOpenModal(false);
        }
    };

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            {rateList?.status === 'approved' || rateList?.status === 'assigned' ? '' :
                <Tooltip title="Add Comment">
                    <IconButton color="primary" onClick={() => setOpenModal(true)}>
                        <AddSquare variant="Outline" />
                    </IconButton>
                </Tooltip>
            }
            <ObjectionModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                title="Add a comment"
            >
                <AddCommentForm handleAdd={AddCommentHandler} rateList={rateList} />
            </ObjectionModal>
        </Stack>
    );
}

export const columns = [
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
        id: 'rate_type',
        header: 'rate type',
        accessorKey: 'rate_type',
        cell: ({ row }) => `${capitalize(row?.original?.rate_type)}`,
        enableGrouping: false,
    },
    {
        id: 'vehicle_type',
        header: 'vehicle type',
        accessorKey: 'vehicle_type',
        enableGrouping: false,
        cell: ({ row }) => `${capitalize(row?.original?.vehicle_type)}`,
    },
    {
        id: 'base_fare',
        header: 'base fare',
        accessorKey: 'base_fare',
        enableGrouping: false,
        cell: ({ row }) => `$ ${row?.original?.base_fare}`,
    },
    {
        id: 'fare_per_mile',
        header: 'fare per mile',
        accessorKey: 'fare_per_mile',
        enableGrouping: false,
        cell: ({ row }) => `$ ${row?.original?.fare_per_mile}`,
    },
    {
        id: 'bariatric',
        header: 'bariatric',
        accessorKey: 'bariatric',
        enableGrouping: false,
        cell: ({ row }) => `$ ${row?.original?.bariatric}`,
    },
    {
        id: 'hospital_discharge',
        header: 'hospital discharge',
        accessorKey: 'hospital_discharge',
        enableGrouping: false,
        cell: ({ row }) => `$ ${row?.original?.hospital_discharge}`,
    },
    {
        id: 'weekend_saturday',
        header: 'saturday',
        accessorKey: 'weekend_saturday',
        enableGrouping: false,
        cell: ({ row }) => `$ ${row?.original?.weekend_saturday}`,
    },
    {
        id: 'weekend_sunday',
        header: 'sunday',
        accessorKey: 'weekend_sunday',
        enableGrouping: false,
        cell: ({ row }) => `$ ${row?.original?.weekend_sunday}`,
    },
    {
        id: 'federal_holiday',
        header: 'federal holiday',
        accessorKey: 'federal_holiday',
        enableGrouping: false,
        cell: ({ row }) => `$ ${row?.original?.federal_holiday}`,
    },
    {
        id: 'non_scheduled',
        header: 'non scheduled',
        accessorKey: 'non_scheduled',
        enableGrouping: false,
        cell: ({ row }) => `$ ${row?.original?.non_scheduled}`,
    },
    {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        enableGrouping: false,
        cell: ({ row }) => {
            const dispatch = useDispatch();
            const { provider_id } = useParams();
            const rowData = row?.original;

            const handleChange = (event) => {
                const newValue = event.target.value;
                changeStatus(rowData.id, newValue, dispatch, provider_id);
            };

            return (
                <>
                    {
                        rowData.status === 'assigned' ?
                            <Chip color="info" label="Assigned" size="small" variant="light" />
                            : rowData.status === 'rejected' ? 
                            <Chip color="error" label="Rejected" size="small" variant="light" />
                            :
                            <Select
                                sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
                                value={rowData.status}
                                onChange={handleChange}
                                size="small"
                            >
                                {ratelistStatuses.map((item, index) => (
                                    <MenuItem value={item.name} key={index}>
                                        <Chip color={item.color} label={item.label} size="small" variant="light" />
                                    </MenuItem>
                                ))}
                            </Select>
                    }
                </>
            );
        }
    },
    {
        id: 'edit',
        header: 'Comments',
        cell: EditAction,
    },
];
