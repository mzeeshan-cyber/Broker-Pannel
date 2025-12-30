import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { FaMapMarkerAlt, FaPhoneAlt, FaStickyNote } from "react-icons/fa";
import { Divider, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import PatientCard from 'components/pages/reimbursement-trips/PatientCard';
import BasicTabs from 'sections/components-overview/tabs/BasicTabs';
import PayeeCard from './PayeeCard';
import AttendentCard from './AttendentCard';
import InvoiceDetail from 'components/common/invoice-detail';

export default function ReimbursementTripExpandingDetails({ data }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const tabsData = [
        {
            label: 'Patient Deatils',
            icon: '',
            content: <PatientCard data={data?.patient} />
        },
        {
            label: 'Payee Details',
            icon: '',
            content: <PayeeCard data={data?.payee} />
        },
        {
            label: 'Attendent Details',
            content: <AttendentCard data={data?.attendants} />
        }
    ];
    return (
        <Grid container spacing={2.5} >
            <>
                <Grid item xs={12} md={6} lg={6} sx={{ position: 'relative' }}>
                    <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column', gap: '30px' } }}>
                        <BasicTabs tabs={tabsData} mainCard={false} />
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 3,
                            }}
                        >
                            {Object.entries(data?.location_points).map(([key, point], index) => (
                                <Box
                                    key={key}
                                    sx={{
                                        flex: "1 1 47%",
                                        p: 2,
                                        border: isDark ? '1px solid #343c44de':"1px solid #e0e0e0",
                                        borderRadius: 2,
                                        backgroundColor: isDark? '18222cff': "#fafafa",
                                        
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                                        <FaMapMarkerAlt color="#1976d2" />
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Location Point {index + 1} ({point.facility_name})
                                        </Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 1.5 }} />
                                    <Stack direction="row" spacing={1} mb={1}>
                                        <FaMapMarkerAlt color="#616161" />
                                        <Typography variant="body2" color="text.primary">
                                            {point.address} – {point.city}, {point.state}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} mb={1}>
                                        <FaPhoneAlt color="#4caf50" />
                                        <Typography variant="body2" color="text.primary">
                                            {point.phone || "No phone provided"}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1}>
                                        <FaStickyNote color="#ff9800" />
                                        <Typography variant="body2" color="text.secondary">
                                            {point.note && point.note !== "undefined"
                                                ? point.note
                                                : "No notes are given"}
                                        </Typography>
                                    </Stack>
                                </Box>
                            ))}
                        </Box>
                    </MainCard>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{ position: 'relative' }}>
                    <MainCard title="Trip Information" sx={{ minHeight: '100%' }}>
                        <InvoiceDetail data={data} />
                    </MainCard>
                </Grid>
                {data?.cancel_reason &&
                    <Grid item xs={12}>
                        <MainCard title="Cancel Reason">
                            <Typography color="secondary">
                                {data?.cancel_reason || ''}
                            </Typography>
                        </MainCard>
                    </Grid>
                }
            </>
        </Grid >
    );
}
