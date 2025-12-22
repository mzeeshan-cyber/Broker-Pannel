// material-ui
import BasicTabs from 'sections/components-overview/tabs/BasicTabs';
import AdditionalInfoTab from './additional-info-tab';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { openSnackbar } from 'api/snackbar';
import { fetcher, fetcherPost } from 'utils/axios';
import Objections from './objections';
import { Box, Button } from '@mui/material';
import { Add } from 'iconsax-react';
import AddObjection from 'components/pages/providers/objections/add-objection';
import ObjectionModal from 'sections/components-overview/modal/OjbectionModal';
import Loader from 'components/Loader';
import Drivers from './drivers';
import ProviderPersonalInfo from 'components/pages/providers/provider-personal-info/provider-personal-info';

export default function VehicleDetailPage() {
  const { provider_id, detail_id } = useParams();
  const [vehicleData, setVehicleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openModalObjection, setOpenModalObjection] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [providerData, setProviderData] = useState({});

  function handleOpenModalObjection() {
    setOpenModalObjection(preState => !preState)
  }

  const getDetails = async () => {
    setLoading(true);
    const response = await fetcher([`/get-single-provider-vehicle?provider_id=${provider_id}&vehicle_id=${detail_id}`]);
    if (response.status === true) {
      setLoading(true);
      setVehicleData(response?.data);
      openSnackbar({
        open: true,
        message: response.message || 'data is fetched',
        variant: 'alert',
        alert: { color: 'success' }
      });
      setLoading(false);
    }
    else {
      openSnackbar({
        open: true,
        message: response.message || 'data is not fetched',
        variant: 'alert',
        alert: { color: 'error' }
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

  const CreateObjecion = async (values, str) => {
    const response = await fetcherPost([`/create-update-provider-vehicle-objection`, values])
    if (response.status === true) {
      openSnackbar({
        open: true,
        message: response.message,
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    }
    // mutate array
    const newId = Date.now();
    if (str === 'new-objection') {
      vehicleData?.provider_vehicle_objections.push({
        ...values,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "objection"
      });
    } else {
      vehicleData?.provider_vehicle_objections.forEach((item) => {
        if (item.id === values?.id) {
          item.objection_reason = values?.objection_reason;
        }
        if (item.id === values?.id && str === 're-object') {
          item.objection_reason = values?.objection_reason;
          item.resolve_remarks = '';
          item.status = 'objection';
        }
      });
    }
    setOpenModal(false)
    setOpenModalObjection(false)

  }

  const Objection = vehicleData?.provider_vehicle_objections?.find(u => u.status === 'objection' || u.status === 'resolved')
  useEffect(() => {
    getDetails();
    FetchSingleProvider();
  }, [])
  const tabsData = [
    {
      label: 'Additional Vehicle Details',
      icon: '',
      content: <AdditionalInfoTab data={vehicleData} loading={loading} />
    },
    {
      label: `Driver`,
      content: <Drivers data={vehicleData} loading={loading} />
    },
    {
      label: 'Vehicle Objections',
      content: <Objections data={vehicleData} UpdateObjecion={CreateObjecion} getDetails={getDetails} setOpenModal={setOpenModal} openModal={openModal} />
    },
  ];
  return (
    <>
      {loading ? <Loader /> :
        <>
          <ProviderPersonalInfo providerData={providerData} />
          <Box sx={{ position: 'relative' }}>
            {!Objection &&
              <Button onClick={handleOpenModalObjection} sx={{ display: 'flex', gap: '5px', position: 'absolute', zIndex: '1', right: '25px', top: '20px' }} variant='contained'>
                <Add /> objection
              </Button>
            }
            <BasicTabs tabs={tabsData} />
            <ObjectionModal openModal={openModalObjection} setOpenModal={setOpenModalObjection} title={`Create Objection`} btnText='Create Objection' >
              <AddObjection CreateObjecion={CreateObjecion} type='vehicleModule'/>
            </ObjectionModal>
          </Box>
        </>
      }
    </>
  );
}
