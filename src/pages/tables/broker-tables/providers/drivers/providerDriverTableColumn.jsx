import React from 'react';
// material-ui
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
// project import
import IconButton from 'components/@extended/IconButton';
//assets
import { Eye } from 'iconsax-react';
import { Avatar } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';


function EditAction({ row }) {
    const { provider_id } = useParams()
    const navigate = useNavigate()

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='View'>
                <IconButton color={'primary'} onClick={() => navigate(`/providers/${provider_id}/drivers/${row?.original.id}/detail`)}>
                    <Eye variant="Outline" />
                </IconButton>
            </Tooltip>
        </Stack>
    );
}

export const columns =
    [
        {
            id: 'image',
            header: 'Image',
            accessorKey: 'image',
            enableColumnFilter: false,
            enableGrouping: false,
            cell: (cell) => <Avatar alt={cell.getValue()} size="sm" src={getImageUrl(`avatar-${cell.getValue()}.png`, ImagePath.USERS)} />,
            meta: { className: 'cell-center' }
        },
        {
            id: 'name',
            header: 'Driver Name',
            footer: 'Driver Name',
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
            id: 'vehicle_assigned',
            header: 'Vehicle Assigned',
            footer: 'Vehicle Assigned',
            accessorFn: row => row.provider_driver_additional_details?.vehicle_assigned === 0 ? 'No' : 'Yes',
            cell: ({ row }) => row.original.provider_driver_additional_details?.vehicle_assigned === 0 ? 'No' : 'Yes',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'objections',
            header: 'Objections',
            footer: 'Objections',
            accessorFn: row => row.provider_driver_additional_details?.vehicle_assigned === 0 ? 'No' : 'Yes',
            cell: ({ row }) => row.original.provider_driver_additional_details?.vehicle_assigned === 0 ? 'No' : 'Yes',
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