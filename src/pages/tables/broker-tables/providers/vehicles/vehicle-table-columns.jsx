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
                <IconButton color={'primary'} onClick={() => navigate(`/providers/${provider_id}/vehicles/${row?.original.id}/detail`)}>
                    <Eye variant="Outline" />
                </IconButton>
            </Tooltip>
        </Stack>
    );
}

export const columns =
    [
        // {
        //     id: 'image',
        //     header: 'Image 54',
        //     accessorKey: 'image',
        //     enableColumnFilter: false,
        //     enableGrouping: false,
        //     cell: (cell) => <Avatar alt={cell.getValue()} size="sm" src={getImageUrl(`avatar-${cell.getValue()}.png`, ImagePath.USERS)} />,
        //     meta: { className: 'cell-center' }
        // },
        {
            id: 'car_name',
            header: 'Car Name',
            footer: 'Car Name',
            accessorKey: 'car_name',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'asset_miles',
            header: 'Asset miles',
            footer: 'Asset miles',
            accessorKey: 'asset_miles',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'model_year',
            header: 'Model year',
            footer: 'Model year',
            accessorKey: 'model_year',
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
            id: 'color',
            header: 'color',
            footer: 'color',
            accessorKey: 'color',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'plate_no',
            header: 'plate no',
            footer: 'plate no',
            accessorKey: 'plate_no',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'capacity',
            header: 'capacity',
            footer: 'capacity',
            accessorKey: 'capacity',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'vehicle_status',
            header: 'Vehicle status',
            footer: 'Vehicle status',
            accessorKey: 'vehicle_status',
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