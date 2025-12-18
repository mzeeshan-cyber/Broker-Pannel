import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from 'components/@extended/IconButton';
import { ArrowDown2, ArrowRight2, CloseCircle, RefreshCircle } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Chip, Typography } from '@mui/material';
import { IndeterminateCheckbox } from 'components/third-party/react-table';
import { useSelector } from 'react-redux';

function EditAction({ row, table }) {
    const [openModal, setOpenModal] = useState(false);
    const stateData = useSelector(state => state?.trips)
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='Restore Trip'>
                <IconButton color={'error'} onClick={handleOpenModal}>
                    <RefreshCircle variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Restore Trip" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Yes' isSubmitting={stateData.loading} >
                <Typography id="modal-modal-description">Are you sure, you want to restore this Trip?</Typography>
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
            id: 'service_date',
            header: 'Service Date',
            footer: 'Service Date',
            accessorFn: row => row?.service_date?.split("T")[0] || '—',
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
            id: 'is_two_way',
            header: 'Is Two Way Trip',
            footer: 'Is Two Way',
            accessorFn: row => row?.is_two_way === true ? <Chip sx={{borderRadius:"5px"}} size='small' label="Two Way Trip" variant="outlined" color="info" /> : <Chip sx={{borderRadius:"5px"}} size='small' label="Single Trip" variant="outlined" color="secondary" />,
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
            id: 'edit',
            header: 'Actions',
            cell: EditAction,
            enableGrouping: false,
            meta: { className: 'cell-center' }
        },
    ]