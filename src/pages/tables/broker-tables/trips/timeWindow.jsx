import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { FiClock } from 'react-icons/fi';

const timeWindows = [
    { start: '00:00', end: '03:00' },
    { start: '06:00', end: '09:00' },
    { start: '12:00', end: '15:00' },
    { start: '18:00', end: '21:00' },
];

function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
}

const TimeWindow = () => {
    const [currentWindow, setCurrentWindow] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            let foundWindow = null;

            for (let i = 0; i < timeWindows.length; i++) {
                const window = timeWindows[i];
                const start = parseTime(window.start);
                const end = parseTime(window.end);

                if (now >= start && now <= end) {
                    foundWindow = { ...window, status: 'Current Window' };
                    break;
                }
            }

            if (!foundWindow) {
                const upcomingWindow = timeWindows.find((window) => parseTime(window.start) > now);
                foundWindow = upcomingWindow
                    ? { ...upcomingWindow, status: 'Upcoming Window' }
                    : { ...timeWindows[0], status: 'Upcoming Window (Tomorrow)' };
            }

            setCurrentWindow(foundWindow);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!currentWindow) return null;

    const isCurrent = currentWindow.status === 'Current Window';

    return (
        <Card
            sx={{
                mx: 'auto',
                borderRadius: 2,
                boxShadow: 0,
                bgcolor: isCurrent ? '#e0f7fa' : '#fff3e0',
                transition: '0.3s',
            }}
        >
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap="5px">
                        <Typography variant="h6" fontWeight="bold" color={isCurrent ? 'primary.main' : 'warning.main'}>
                            {currentWindow.status}
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? theme.palette.grey[800]
                                    : theme.palette.text.secondary
                        }}>
                            {isCurrent
                                ? '(You are currently within this time window. Your trips will assign in this window)'
                                : '(The upcoming window will open shortly. Your trips will be assigned to that window.)'}
                        </Typography>
                    </Box>
                    <Chip
                        label={isCurrent ? 'NOW' : 'SOON'}
                        color={isCurrent ? 'primary' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <Box display="flex" alignItems="center" mt={1} gap={2}>
                    <FiClock size={28} color={isCurrent ? '#1976d2' : '#ff9800'} />
                    <Typography variant="h5" fontWeight="bold" sx={{
                        color: (theme) =>
                            theme.palette.mode === 'dark'
                                ? theme.palette.grey[800]
                                : theme.palette.text.secondary 
                    }}>
                        {currentWindow.start} - {currentWindow.end}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TimeWindow;
