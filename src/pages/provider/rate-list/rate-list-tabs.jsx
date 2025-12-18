// material-ui
import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { fetcher } from 'utils/axios';
import { useParams } from 'react-router';
import ProviderPersonalInfo from 'components/pages/providers/provider-personal-info/provider-personal-info';
import BasicTabs from 'sections/components-overview/tabs/BasicTabs';
import CurrentRateList from './current-rate-list';
import PandingRateList from './panding-rate-list';
import { useDispatch, useSelector } from 'react-redux';
import { rateListData } from 'store/reducers/ratelistSlice';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function RateListTabs() {
  const [rateList, setRateList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [providerData, setProviderData] = useState({});
  const { provider_id } = useParams()
  const dispatch = useDispatch();
  const pandingRateLists = useSelector((state) => state.rateList.rateLists);

  const getProvidersRateListData = async () => {
    setIsLoading(true);
    const response = await fetcher([`/get-rate-lists?provider_id=${provider_id}`]);
    if (response.status === true) {
      setIsLoading(false);
      setRateList(response?.data);
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };
  const getProvidersPandingRateListData = async () => {
    setIsLoading(true);
    const response = await fetcher([`/pending-rate-lists?provider_id=${provider_id}`]);
    if (response.status === true) {
      setIsLoading(false);
      dispatch(rateListData(response?.data))
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };
  const FetchSingleProvider = async () => {
    const response = await fetcher(`/provider/${provider_id}`);
    if (response.status === true) {
      setProviderData(response?.data);
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  }

  const tabsData = [
    {
      label: 'Current Rate List',
      icon: '',
      content: <CurrentRateList data={rateList} />
    },
    {
      label: 'Pending Rate List',
      icon: '',
      content: <PandingRateList data={pandingRateLists} />
    },
  ];
  useEffect(() => { getProvidersRateListData(); FetchSingleProvider(); getProvidersPandingRateListData(); }, [])
  return (
    <Grid>
      {isLoading ?
        <CircularLoader text='Loading Rate lists..' />
        :
        <>
          <ProviderPersonalInfo providerData={providerData} />
          <BasicTabs tabs={tabsData} />
        </>
      }
    </Grid>
  );
}
