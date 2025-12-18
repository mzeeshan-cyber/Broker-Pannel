import React, { useState } from 'react';
// material-ui
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
// project import
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';
//assets
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
            <Tooltip title='Restore Payee'>
                <IconButton color={'error'} onClick={handleOpenModal}>
                    <RefreshCircle variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Restore patient payee" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Yes' >
                <Typography id="modal-modal-description">Are you sure, you want to restore this patient's payee?</Typography>
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
                    id: 'account_holder_name',
                    header: 'Payee Name',
                    footer: 'Payee Name',
                    accessorKey: 'account_holder_name',
                    dataType: 'text',
                    enableGrouping: false
                },
                {
                    id: 'payment_method',
                    header: 'Payment Method',
                    footer: 'Payment Method',
                    accessorKey: 'payment_method',
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