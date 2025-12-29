import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from 'components/@extended/IconButton';
import { toLower } from 'lodash';
import ReusableDrawer from 'components/common/ReusableDrawer';
import Conversation from 'pages/billings/Conversation';
import { Box } from '@mui/material';
import { BsChatSquare } from "react-icons/bs";

function BrokerComment({ row }) {
    const commentCount = row?.original?.comments?.filter(item => item.user_type === 'provider')?.filter(item => item.is_read === 0).length;
    const [open, setOpen] = useState(false);
    const handleToggle = () => setOpen(!open);
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='View Comments'>
                <IconButton color={'primary'} onClick={handleToggle}>
                    <BsChatSquare variant="Outline" color='green' size={30} />
                    {commentCount > 0 &&
                        <Box sx={{ position: 'absolute', top: 0, background: '#008000ff', borderRadius: '20px', fontSize: '10px', padding: '3px', right: '-5px', color: 'white', minWidth: '18px' }}>{commentCount ?? commentCount}</Box>
                    }
                </IconButton>
            </Tooltip>
            <ReusableDrawer
                open={open}
                onClose={handleToggle}
                title="Conversation B/W Broker and Provider"
            >
                <Conversation comments={row.original} open={open}/>
            </ReusableDrawer>
        </Stack >
    );
}
export const columns =
    [
        {
            id: 'trip_id',
            header: 'Trip ID',
            accessorFn: row => row?.trip?.id || '-',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'service_date',
            header: 'Date',
            accessorFn: row => row?.trip?.service_date || '-',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'mobility',
            header: 'Vehicle Type',
            accessorFn: row => row?.trip?.mobility || '—',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'pickup_city',
            header: 'Start City',
            accessorFn: row => row?.trip?.pickup_city || '—',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'rate_category',
            header: 'AH',
            accessorFn: row => row?.rate_category === 'regular' ? 'No' : 'Yes',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'bariatric_fare',
            header: 'BRT',
            accessorKey: 'bariatric_fare',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'hospital_discharge',
            header: 'HD',
            accessorKey: 'hospital_discharge',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'weekend_saturday',
            header: 'SAT',
            accessorKey: 'weekend_saturday',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'weekend_sunday',
            header: 'SUN',
            accessorKey: 'weekend_sunday',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'federal_holiday',
            header: 'FH',
            accessorKey: 'federal_holiday',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'shared_priority',
            header: 'SH',
            accessorFn: row => row?.trip?.shared_priority === null ? 'No' : 'Yes',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'shared_priority_fs',
            header: '(F)(S)',
            accessorFn: row => toLower(row?.trip?.shared_priority) === 'frc' ? 'FRC' : row?.trip?.shared_priority === null | undefined ? '-': 'SRC',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'fare_per_mile',
            header: 'Mile Rate',
            accessorKey: 'fare_per_mile',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'base_fare',
            header: 'Base Rate',
            accessorKey: 'base_fare',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'actual_cost',
            header: 'Actual Cost',
            accessorFn: row => Number(row?.actual_cost?.toFixed(2)) || '-',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'estimated_cost',
            header: 'Estimated Cost',
            accessorFn: row => Number(Number(row?.trip?.estimated_cost)?.toFixed(2)) || '-',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'total_miles',
            header: 'Actual Miles',
            accessorKey: 'total_miles',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'trip_distance',
            header: 'RL Miles',
            accessorFn: row => row?.trip?.trip_distance || '-',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'broker_comment',
            header: 'Comments',
            cell: BrokerComment,
            dataType: 'text',
            enableGrouping: false
        },
    ]