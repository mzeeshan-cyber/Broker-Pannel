export const columns = [
  {
    id: 'funding_source',
    header: 'Funding Source',
    footer: 'Funding Source',
    accessorKey: 'funding_source',
    dataType: 'text',
    enableGrouping: false,
    meta: {
      style: {
        width: '100%',        // take remaining width
        minWidth: 150,        // optional minimum
      },
    },
  },
  {
    id: 'trips',
    header: 'No of Trips',
    footer: 'No of Trips',
    accessorKey: 'trips',
    dataType: 'text',
    enableGrouping: false,
    meta: {
      style: {
        width: '130px !important',          // shrink to content
        whiteSpace: 'nowrap', // prevent wrapping
      },
    },
  },
  {
    id: 'miles',
    header: 'Miles',
    footer: 'Miles',
    accessorKey: 'miles',
    dataType: 'text',
    enableGrouping: false,
    meta: {
      style: {
        width: '120px !important',
        whiteSpace: 'nowrap',
      },
    },
  },
  {
    id: 'amount',
    header: '$ Price',
    footer: '$ Price',
    accessorKey: 'amount',
    dataType: 'text',
    enableGrouping: false,
    meta: {
      style: {
        width: '82px !important',
        whiteSpace: 'nowrap',
      },
    },
  },
];
