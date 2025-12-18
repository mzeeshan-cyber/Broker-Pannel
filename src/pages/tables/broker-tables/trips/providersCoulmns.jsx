import React from 'react';
import { IndeterminateCheckbox } from 'components/third-party/react-table';

export const columns =
    [
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
            id: 'vehicles',
            header: 'Vehicles',
            footer: 'Vehicles',
            accessorFn: row => row?.drivers?.length || '0',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'previous_trips',
            header: 'Previous Trips',
            footer: 'Previous Trips',
            accessorFn: row => row?.provider_trips?.length || '0',
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
    ]