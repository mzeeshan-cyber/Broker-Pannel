import React from 'react';
import IconButton from 'components/@extended/IconButton';
import { ArrowDown2, ArrowRight2, CloseCircle } from 'iconsax-react';

export const columns =
    [
        {
            id: 'tripType',
            header: 'Trip Type',
            headerStyle: { textAlign: 'center' },
        },
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
            id: 'trip_id',
            header: 'Trip Id',
            footer: 'Trip Id',
            accessorKey: 'id',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'pickup_time',
            header: '(PU - App) Time',
            footer: 'Pick up - Appointment',
            accessorFn: row => `${row.pickup_time} - ${row.appointment_time}`,
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
    ]