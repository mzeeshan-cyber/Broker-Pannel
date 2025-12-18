import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { fetcher } from 'utils/axios';
import ProviderPersonalInfo from 'components/pages/providers/provider-personal-info/provider-personal-info';
import CityInfoCard from './cityInfoCard';
import CircularLoader from 'components/common/loader/CircularLoader';
import EmptyCard from 'components/common/empty-card';
import { MdLocationCity } from "react-icons/md";
import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { allProviderCities } from 'store/reducers/providerCitiesSlice';

export default function Cities() {
    const [providerData, setProviderData] = useState({});
    const { provider_id } = useParams();
    const [loadingCount, setLoadingCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLoading = loadingCount > 0;

    const getProvidersCityData = async () => {
        setLoadingCount((prev) => prev + 1);
        try {
            const response = await fetcher([`/provider-operational-cities/${provider_id}`]);
            if (response.status === true) {
                dispatch(allProviderCities(response.data));
            } else {
                openSnackbar({
                    open: true,
                    message: response.message || 'Data is not fetched',
                    variant: 'alert',
                    alert: { color: 'error' }
                });
            }
        } catch (err) {
            openSnackbar({
                open: true,
                message: 'Error fetching provider cities',
                variant: 'alert',
                alert: { color: 'error' }
            });
        } finally {
            setLoadingCount((prev) => prev - 1);
        }
    };

    const fetchSingleProvider = async () => {
        setLoadingCount((prev) => prev + 1);
        try {
            const response = await fetcher(`/provider/${provider_id}`);
            if (response.status === true) {
                setProviderData(response?.data);
            } else {
                openSnackbar({
                    open: true,
                    message: response.message || 'Data is not fetched',
                    variant: 'alert',
                    alert: { color: 'error' }
                });
            }
        } catch (err) {
            openSnackbar({
                open: true,
                message: 'Error fetching provider data',
                variant: 'alert',
                alert: { color: 'error' }
            });
        } finally {
            setLoadingCount((prev) => prev - 1);
        }
    };

    const CityState = useSelector(state => state.cities);

    useEffect(() => {
        getProvidersCityData();
        fetchSingleProvider();
    }, [provider_id]);

    // Filter cities based on search query
    const filteredCities = CityState?.allProviderCities?.filter(city =>
        city.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Grid>
            {isLoading ? (
                <CircularLoader />
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <ProviderPersonalInfo providerData={providerData} />
                        </Box>
                        <Button
                            variant="contained"
                            color="success"
                            type='button'
                            sx={{ maxHeight: 'fit-content' }}
                            onClick={() => { navigate(`/providers/${provider_id}/cities/add`) }}
                        >
                            Add New City
                        </Button>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label=""
                            placeholder='Search City'
                            variant="outlined"
                            size="large"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Box>

                    {filteredCities?.length > 0 ? (
                        <Grid container spacing={2} gridColumn={12} sx={{ my: 1 }}>
                            <CityInfoCard data={filteredCities} />
                        </Grid>
                    ) : (
                        <EmptyCard
                            link={`/providers/${provider_id}/cities/add`}
                            message='No operational cities found'
                            description='Please add operational cities for this provider.'
                            icon={<MdLocationCity size={32} color="#1976d2" />}
                        />
                    )}
                </>
            )}
        </Grid>
    );
}
