// material-ui
import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import { useDispatch } from 'react-redux';
import { fetcher } from 'utils/axios';
import { resetFilter } from 'store/reducers/patientSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/providers/vehicles/vehicle-table-columns';
import { useParams } from 'react-router';
import VehicleButton from 'components/pages/providers/vehicles/VehicleTopButtons';
import ProviderPersonalInfo from 'components/pages/providers/provider-personal-info/provider-personal-info';
import CircularLoader from 'components/common/loader/CircularLoader';

export default function Vehicles() {
  const [vehicleData, setVehicleData] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [providerData, setProviderData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const {provider_id} = useParams()

  const getProvidersVehicleData = async (values) => {
    setIsLoading(true);
    const params = {
        vehicle_status: values?.vehicle_status,
        vehicle_type: values?.vehicle_type,
        inspection_type: values?.inspection_type,
    }
    const response = await fetcher([`/get-provider-vehicles?provider_id=${provider_id}&per_page=${pageSize}`, {params}]);
    if (response.status === true) {
      setIsLoading(false);
      setVehicleData(response?.data?.data);
      setPaginationData(response?.data);
      if (values) {
        dispatch(resetFilter(true))
      }
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

  // Pagination
  const handleChangePerPage = async (event) => {
    setPageSize(Number(event.target.value));
    const per_page = Number(event.target.value);
    const response = await fetcher([`/get-provider-vehicles?provider_id=${provider_id}&per_page=${per_page}`]);
    if (response.status === true) {
      setVehicleData(response?.data?.data)
      dispatch(resetFilter(false))
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };
  const handleChangePagination = async (event, value) => {
    const eventValue = event.target.value;
    setPage(eventValue ? eventValue : value);
    const response = await fetcher([`/get-provider-vehicles?provider_id=${provider_id}&page=${eventValue ? eventValue : value}`]);
    if (response.status === true) {
      setVehicleData(response?.data?.data)
      dispatch(resetFilter(false))
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };

  useEffect(() => { getProvidersVehicleData(); FetchSingleProvider(); }, [])

  return (
    <Grid>
      {isLoading ?
        <CircularLoader text='Loading Vehicles..'/>
        :
        <>
        <ProviderPersonalInfo providerData={providerData} />
        <CommonTable
          data={vehicleData}
          paginationData={paginationData}
          defaultColumns={columns}
          setPageSize={setPageSize}
          pageSize={pageSize}
          page={page}
          handleChangePerPage={handleChangePerPage}
          handleChangePagination={handleChangePagination}
          stackontable={<VehicleButton handleGetData={getProvidersVehicleData}/>}
          
        />
        </>
      }
    </Grid>
  );
}
