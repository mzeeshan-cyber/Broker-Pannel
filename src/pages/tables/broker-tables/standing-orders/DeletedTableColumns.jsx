import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from 'components/@extended/IconButton';
import { ArrowDown2, ArrowRight2, CloseCircle, RefreshCircle } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Typography } from '@mui/material';
import { IndeterminateCheckbox } from 'components/third-party/react-table';
import { capitalize } from 'lodash';
import { useSelector } from 'react-redux';

function EditAction({ row, table }) {
    const [openModal, setOpenModal] = useState(false);
    const Loader = useSelector(state => state.standingOrders.loading);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='Restore Standing Order'>
                <IconButton color={'error'} onClick={handleOpenModal}>
                    <RefreshCircle variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Restore Standing Order" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Yes' isSubmitting={Loader}>
                <Typography id="modal-modal-description">Are you sure, you want to restore this Standing Order?</Typography>
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
            accessorFn: row => capitalize(row.is_two_way ? 'Yes' : 'No'),
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