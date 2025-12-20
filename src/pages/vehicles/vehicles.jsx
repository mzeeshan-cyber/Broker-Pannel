import Grid from '@mui/material/Grid';
import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { fetcher } from 'utils/axios';
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
  const { provider_id } = useParams();
  const [filters, setFilters] = useState({});
  const [filterValue, setFilterValue] = useState({});

  const getProvidersVehicleData = async (values = {}) => {
    setIsLoading(true);
    const query = {
      vehicle_status: values?.vehicle_status || '',
      vehicle_type: values?.vehicle_type || '',
      inspection_type: values?.inspection_type || '',
      provider_id: provider_id,
      page,
      per_page: pageSize
    };
    setFilters(query);
    const response = await fetcher([
      "/get-provider-vehicles",
      { params: query }
    ]);
    if (response.status === true) {
      setIsLoading(false);
      setFilterValue(values);
      setVehicleData(response?.data?.data);
      setPaginationData(response?.data);
    }
  };
  const handleChangePerPage = async (event) => {
    const per_page = Number(event.target.value);

    setPageSize(per_page);
    setPage(1);

    const response = await fetcher([
      "/get-provider-vehicles",
      { params: { ...filters, page: 1, per_page } }
    ]);

    if (response.status === true) {
      setVehicleData(response?.data?.data);
      setPaginationData(response?.data);
    }
  };
  const handleChangePagination = async (event, value) => {
    setPage(value);

    const response = await fetcher([
      "/get-provider-vehicles",
      { params: { ...filters, page: value, per_page: pageSize } }
    ]);

    if (response.status === true) {
      setVehicleData(response?.data?.data);
      setPaginationData(response?.data);
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

  useEffect(() => { getProvidersVehicleData(); FetchSingleProvider(); }, [])

  return (
    <Grid>
      {isLoading ?
        <CircularLoader text='Loading Vehicles..' />
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
            stackontable={<VehicleButton handleGetData={getProvidersVehicleData} filterValue={filterValue}/>}

          />
        </>
      }
    </Grid>
  );
}
