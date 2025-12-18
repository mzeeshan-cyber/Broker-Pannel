import { capitalize } from "lodash";

export const columns =
    [
        {
            id: 'rate_type',
            header: 'rate type',
            footer: 'rate type',
            accessorKey: 'rate_type',
            cell: ({ row }) => `${capitalize(row?.original?.rate_type)}`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'vehicle_type',
            header: 'vehicle type',
            footer: 'vehicle type',
            accessorKey: 'vehicle_type',
            cell: ({ row }) => `${capitalize(row?.original?.vehicle_type)}`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'base_fare',
            header: 'base fare',
            footer: 'base fare',
            accessorKey: 'base_fare',
            cell: ({ row }) => `$ ${row?.original?.base_fare}`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'fare_per_mile',
            header: 'fare per mile',
            footer: 'fare per mile',
            accessorKey: 'fare_per_mile',
            cell: ({ row }) => `$ ${row?.original?.fare_per_mile}`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'bariatric',
            header: 'bariatric',
            footer: 'bariatric',
            accessorKey: 'bariatric',
            cell: ({ row }) => `$ ${row?.original?.bariatric}`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'hospital_discharge',
            header: 'hospital discharge',
            footer: 'hospital discharge',
            accessorKey: 'hospital_discharge',
            cell: ({ row }) => `$ ${row?.original?.hospital_discharge}`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'weekend_saturday',
            header: 'saturday',
            footer: 'saturday',
            accessorKey: 'weekend_saturday',
            cell: ({ row }) => `$ ${row?.original?.weekend_saturday}`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'weekend_sunday',
            header: 'sunday',
            footer: 'sunday',
            accessorKey: 'weekend_sunday',
            cell: ({ row }) => `$ ${row?.original?.weekend_sunday}`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'federal_holiday',
            header: 'federal holiday',
            footer: 'federal holiday',
            accessorKey: 'federal_holiday',
            cell: ({ row }) => `$ ${row?.original?.federal_holiday}`,
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'non_scheduled',
            header: 'non scheduled',
            footer: 'non scheduled',
            accessorKey: 'non_scheduled',
            cell: ({ row }) => `$ ${row?.original?.non_scheduled}`,
            dataType: 'text',
            enableGrouping: false
        }
    ]