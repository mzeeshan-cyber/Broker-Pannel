import React, { useState } from 'react';
// material-ui
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
// project import
import IconButton from 'components/@extended/IconButton';
//assets
import { ArrowDown2, ArrowRight2, CloseCircle, RefreshCircle } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Typography } from '@mui/material';
import { IndeterminateCheckbox } from 'components/third-party/react-table';
import { useSelector } from 'react-redux';

function EditAction({ row, table }) {
    const [openModal, setOpenModal] = useState(false);
    const loader = useSelector(state => state?.provider.loading);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='Restore Provider'>
                <IconButton color={'error'} onClick={handleOpenModal}>
                    <RefreshCircle variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Restore provider" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Yes' isSubmitting={loader}>
                <Typography id="modal-modal-description">Are you sure, you want to restore this provider?</Typography>
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
            id: 'edit',
            header: 'Actions',
            cell: EditAction,
            enableGrouping: false,
            meta: { className: 'cell-center' }
        },
    ]