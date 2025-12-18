import IconButton from 'components/@extended/IconButton';
import { ArrowDown2, ArrowRight2, CloseCircle } from 'iconsax-react';
import React from 'react';
const DOC_URL = import.meta.env.VITE_SERVER_IMAGE_PATH;
export const columns =
    [{
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
        id: 'car_name',
        header: 'Car name',
        footer: 'Car name',
        accessorKey: 'car_name',
        dataType: 'text',
        enableGrouping: false
    },
    {
        id: 'asset_miles',
        header: 'Miles',
        footer: 'Miles',
        accessorKey: 'asset_miles',
        dataType: 'text',
        enableGrouping: false
    },
    {
        id: 'capacity',
        header: 'Capacity',
        footer: 'Capacity',
        accessorKey: 'capacity',
        dataType: 'text',
        enableGrouping: false
    },
    {
        id: 'color',
        header: 'Color',
        footer: 'Color',
        accessorKey: 'color',
        dataType: 'text',
        enableGrouping: false
    },
    {
        id: 'active_status',
        header: 'Status',
        footer: 'Status',
        accessorKey: 'active_status',
        dataType: 'text',
        enableGrouping: false
    }
    ]