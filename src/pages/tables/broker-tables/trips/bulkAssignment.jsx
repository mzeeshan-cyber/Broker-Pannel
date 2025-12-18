import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { fetcher } from 'utils/axios';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/trips/providersCoulmns';
import { decryptToken } from 'utils/tokenUtils';
import CircularLoader from 'components/common/loader/CircularLoader';
import CountCard from 'components/common/count-card';
import {
    FiActivity,
} from 'react-icons/fi';
import { FaCarSide, FaShuttleVan, FaWheelchair } from 'react-icons/fa';
import { capitalize } from 'lodash';
import { useLocation, useNavigate } from 'react-router';
import TimeWindow from './timeWindow';
import { Box, IconButton, Typography } from '@mui/material';
import { IoClose } from 'react-icons/io5';

export default function BulkAssignment() {
    const [errorMsg, setErrorMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ providers: [], mobilityCount: [], tripIds: [] });
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const location = useLocation();
    const ids = location.state?.seletedRows || [];
    const counts = location.state?.counts || {};
    const timeWindow = location.state?.timeWindow || {};
    const navigate = useNavigate()

    const mobilityListFromCounts = counts
        ? Object.entries(counts).map(([key, value]) => ({
            mobility: key,
            total: value,
        }))
        : null;

    const mobilitySource =
        mobilityListFromCounts?.length > 0
            ? mobilityListFromCounts
            : data?.mobilityCount || [];

    const allMobilityTypes = ["sedan", "wheelchair", "minivan"];

    const mobilityMap = {};
    mobilitySource.forEach(item => {
        mobilityMap[item.mobility] = item.total;
    });

    const finalMobilitySource = allMobilityTypes.map(type => ({
        mobility: type,
        total: mobilityMap[type] || 0,
    }));

    const getProviders = async () => {
        setIsLoading(true);
        try {
            const response = await fetcher(["/trips/assignments/get-providers"]);
            if (response.status === true) {
                setData({
                    providers: response?.data.providers,
                    mobilityCount: response?.data.trip_mobilities,
                    tripIds: response?.data.trip_ids
                });
            }
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            openSnackbar({
                open: true,
                message: response.message || error.message || 'Server Error',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
        finally {
            setIsLoading(false);
        }
    };

    const restoreProvider = async (id) => {
        try {
            const response = await fetch(`${API_URL}provider/${id}/restore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
            });

            if (!response.ok) {
                const errorData = response.json();
                setErrorMsg(errorData);
                openSnackbar({
                    open: true,
                    message: errorData ? errorMsg?.message : 'Provider is not restored!',
                    variant: 'alert',

                    alert: {
                        color: 'error'
                    }
                });
                throw new Error(errorData || 'failed!');
            }
            openSnackbar({
                open: true,
                message: 'Provider restored successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });

        } catch (err) {
            setErrorMsg(err);
        } finally {
            getProviders()
        }
    }
    const assignMultipleProviders = async (tripIds, providerIds) => {
        try {
            const response = await fetch(`${API_URL}trips/assignments/next-7-days`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
                body: JSON.stringify({
                    'trip_ids': tripIds,
                    'provider_ids': providerIds,
                }),
            });
            const data = await response.json();
            if (!data.status) {
                openSnackbar({
                    open: true,
                    autoHideDuration: 5000,
                    variant: 'alert',
                    alert: { color: 'error' },
                    message: (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <Box>
                                <Typography variant="h5" fontWeight={700}>Trips Assignment</Typography>
                                <Typography>Assigned trips count {data.data.assigned_trip_ids?.length || 0}</Typography>
                                <Typography>Unassigned trips count {data.data.unassigned_trip_ids?.length || 0}</Typography>
                            </Box>
                            <IconButton size="small" onClick={() => openSnackbar({ open: false })}>
                                <IoClose color="white" />
                            </IconButton>
                        </Box>
                    ),
                });
                return;
            }

            openSnackbar({
                open: true,
                autoHideDuration: 5000,
                variant: 'alert',
                alert: { color: 'success' },
                message: (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Box>
                            <Typography variant="h5" fontWeight={700}>Trips Assignment</Typography>
                            <Typography>Assigned trips count {data.data.assigned_trip_ids?.length || 0}</Typography>
                            <Typography>Unassigned trips count {data.data.unassigned_trip_ids?.length || 0}</Typography>
                        </Box>
                        <IconButton size="small" onClick={() => openSnackbar({ open: false })}>
                            <IoClose color="white" />
                        </IconButton>
                    </Box>
                ),
            });

        } catch (err) {
            setErrorMsg(err);
            openSnackbar({
                open: true,
                autoHideDuration: 5000,
                variant: 'alert',
                alert: {
                    color: 'error',
                },
                message: (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: 2
                        }}
                    >
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Trips Assignment
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                {err.message}
                            </Typography>
                        </Box>

                        <IconButton
                            size="small"
                            onClick={() => openSnackbar({ open: false })}
                        >
                            <IoClose color='white' />
                        </IconButton>
                    </Box>
                )
            });
        } finally {
            navigate('/approved-trips')
        }
    }

    useEffect(() => { getProviders() }, [])

    return (
        <Grid>
            {isLoading ?
                <CircularLoader text='Loading..' />
                :
                <>
                    {timeWindow === true && <TimeWindow />}
                    <Grid container spacing={1} mb={3} mt={1}>
                        {finalMobilitySource.map((item, index) => (
                            <Grid key={index} item xs={12} sm={6} md={3}>
                                <CountCard
                                    title={capitalize(item.mobility)}
                                    color={
                                        item.mobility === "sedan"
                                            ? "primary"
                                            : item.mobility === "wheelchair"
                                                ? "success"
                                                : item.mobility === "minivan"
                                                    ? "warning"
                                                    : "error"
                                    }
                                    iconPrimary={
                                        item.mobility === "sedan" ? (
                                            <FaCarSide size={24} />
                                        ) : item.mobility === "wheelchair" ? (
                                            <FaWheelchair size={24} />
                                        ) : item.mobility === "minivan" ? (
                                            <FaShuttleVan size={24} />
                                        ) : (
                                            <FiActivity size={24} />
                                        )
                                    }
                                    count={item.total}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12} sm={6} md={3}>
                            <CountCard
                                title="Total Trips"
                                color="error"
                                iconPrimary={<FiActivity size={24} />}
                                count={mobilitySource.reduce((acc, item) => acc + item.total, 0) || 0}
                            />
                        </Grid>
                    </Grid>
                    <CommonTable
                        data={data.providers}
                        defaultColumns={columns}
                        handleDelete={restoreProvider}
                        handleRestoreMultiple={assignMultipleProviders}
                        tableType={'assignment'}
                        tableName="bulk-assignment"
                        noPagination={true}
                        tripIds={ids?.length ? ids : data.tripIds}
                    />
                </>
            }
        </Grid>
    );
}
