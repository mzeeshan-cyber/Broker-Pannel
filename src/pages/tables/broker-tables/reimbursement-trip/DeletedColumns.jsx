import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from 'components/@extended/IconButton';
import { ArrowDown2, ArrowRight2, CloseCircle, RefreshCircle } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Typography } from '@mui/material';
import { IndeterminateCheckbox } from 'components/third-party/react-table';

function EditAction({ row, table }) {
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='Restore Reimbursement Trip'>
                <IconButton color={'error'} onClick={handleOpenModal}>
                    <RefreshCircle variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Restore Reimbursement Trip" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Yes' >
                <Typography id="modal-modal-description">Are you sure, you want to restore this Reimbursement Trip?</Typography>
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
            id: 'trip_id',
            header: 'Trip Id',
            footer: 'Trip Id',
            accessorKey: 'id',
            dataType: 'text',
            enableGrouping: false
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
            header: 'PatientName',
            footer: 'PatientName',
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
            id: 'edit',
            header: 'Actions',
            cell: EditAction,
            enableGrouping: false,
            meta: { className: 'cell-center' }
        },
    ]