// material-ui
import BasicTabs from 'sections/components-overview/tabs/BasicTabs';
import AdditionalInfoTab from './additional-info-tab';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { openSnackbar } from 'api/snackbar';
import { fetcher, fetcherPost } from 'utils/axios';
import DriverDocuments from './driver-documents';
import Objections from './objections';
import { Box, Button, Typography } from '@mui/material';
import { Add } from 'iconsax-react';
import AddObjection from 'components/pages/providers/objections/add-objection';
import ObjectionModal from 'sections/components-overview/modal/OjbectionModal';
import Loader from 'components/Loader';
import Vehicles from './vehicles';
import ProviderPersonalInfo from 'components/pages/providers/provider-personal-info/provider-personal-info';

export default function DriverDetailPage() {
  const { provider_id, detail_id } = useParams();
  const [driverData, setDriverData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openModalObjection, setOpenModalObjection] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [providerData, setProviderData] = useState({});

  function handleOpenModalObjection() {
    setOpenModalObjection(preState => !preState)
  }

  const getDriverDetails = async () => {
    setLoading(true);
    const response = await fetcher([`/get-single-provider-driver?provider_id=${provider_id}&driver_id=${detail_id}`]);
    if (response.status === true) {
      setLoading(true);
      setDriverData(response?.data);
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
  const CreateObjecion = async (values, str) => {
    const response = await fetcherPost([`/create-update-provider-driver-objection`, values])
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
      driverData?.provider_driver_objections.push({
        ...values,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "objection"
      });
    } else {
      driverData?.provider_driver_objections.forEach((item) => {
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

  const Objection = driverData?.provider_driver_objections?.find(u => u.status === 'objection' || u.status === 'resolved')
  useEffect(() => {
    getDriverDetails();
    FetchSingleProvider();
  }, [])
  const tabsData = [
    {
      label: 'Additional Driver Details',
      icon: '',
      content: <AdditionalInfoTab data={driverData} loading={loading} />
    },
    {
      label: 'Driver Documents',
      icon: '',
      content: <DriverDocuments data={driverData?.provider_driver_documents} loading={loading} />
    },
    {
      label: 'Driver Objections',
      content: <Objections data={driverData} UpdateObjecion={CreateObjecion} getDriverDetails={getDriverDetails} setOpenModal={setOpenModal} openModal={openModal} />
    },
    {
      label: 'Driver Vehicles',
      content: <Vehicles data={driverData?.driver_vehicles} loading={loading} />
    },
  ];
  return (
    <>
      {loading ? <Loader /> :
        <>
          <ProviderPersonalInfo providerData={providerData} />
          <Box sx={{display:'flex', alignItems:'center', gap:'5px'}}>
            <Typography>Driver name : </Typography>
            <Typography variant='h5' sx={{textTransform:'capitalize'}}>{driverData?.name}</Typography>
          </Box>
          <Box sx={{ position: 'relative' }}>
            {!Objection &&
              <Button onClick={handleOpenModalObjection} sx={{ display: 'flex', gap: '5px', position: 'absolute', zIndex: '1', right: '25px', top: '20px' }} variant='contained'>
                <Add /> objection
              </Button>
            }
            <BasicTabs tabs={tabsData} />
            <ObjectionModal openModal={openModalObjection} setOpenModal={setOpenModalObjection} title={`Create Objection`} btnText='Create Objection' >
              <AddObjection CreateObjecion={CreateObjecion} />
            </ObjectionModal>
          </Box>
        </>
      }
    </>
  );
}
