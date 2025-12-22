import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { Box, Button, useTheme } from '@mui/material';
import { IoCheckmarkDoneOutline, IoCloudDoneOutline } from "react-icons/io5";
import { useState } from 'react';
import VerifyObjectionModal from 'components/pages/providers/objections/verify-objection-modal';
import ObjectionModal from 'sections/components-overview/modal/OjbectionModal';
import UpdateObjectionModal from 'components/pages/providers/objections/update-object-modal';
import { dateFormate } from 'constants/constants';

export default function Objections({ data, UpdateObjecion, getDetails, openModal, setOpenModal }) {
    const matchDownMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const objectionData = data?.provider_vehicle_objections;
    const theme = useTheme();
    const primaryColor = theme?.palette.primary[400];
    const [modalType, setModalType] = useState('')
    const [objectionById, setObjectionById] = useState(null)

    function handleOpenModal(id, type) {
        setOpenModal(preState => !preState)
        setModalType(type)
        setObjectionById({ ...objectionData.filter((item) => item.id === id) })
    }

    function convertToPakistanTime(isoString) {
        const date = new Date(isoString);
        const options = {
            timeZone: 'Asia/Karachi',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const formatted = formatter.format(date).replace(',', '').replace(/\//g, '-');
        return formatted;
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={12} >
                        <MainCard title="Vehicle Objections">
                            {objectionData?.length <=0 && 'No objections'}
                            {objectionData?.slice().reverse().map((item, index) => (
                                <span key={index + 1}>
                                    <Box sx={{ fontWeight: 700, background: primaryColor, margin: '10px 0', padding: '10px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        Objection {index + 1}
                                    </Box>
                                    <List sx={{ py: 0 }}>
                                        {item?.resolve_remarks && item?.status === 'resolved' && (
                                            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                                <Button onClick={() => handleOpenModal(item?.id, 'verify')} sx={{ display: 'flex', gap: '5px', background: primaryColor, color: 'white' }}>
                                                    <IoCloudDoneOutline /> verify/re-objection
                                                </Button>
                                            </Box>
                                        )}
                                        {item?.status === 'objection' && (
                                            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '5px'}}>
                                                <Button onClick={() => handleOpenModal(item?.id, 'update')} variant='contained'>
                                                    Update objection
                                                </Button>
                                            </Box>
                                        )}
                                        {item?.status === 'verified' && (
                                            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '5px', color: primaryColor }}>
                                                <IoCheckmarkDoneOutline /> Resolved
                                            </Box>
                                        )}
                                        <ListItem divider={!matchDownMD}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary">Objection date</Typography>
                                                        <Typography>
                                                            {dateFormate(convertToPakistanTime(item?.created_at))}
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary">Status</Typography>
                                                        <Typography>{item?.status}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        <ListItem>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary">Objection</Typography>
                                                        <Typography>{item?.objection_reason}</Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={0.5}>
                                                        <Typography color="secondary">Provider remarks</Typography>
                                                        <Typography>{item?.resolve_remarks}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    </List>
                                </span>
                            ))}

                            {modalType === 'update' &&
                                <ObjectionModal openModal={openModal} setOpenModal={setOpenModal} title={`Update Objection`}>
                                    <UpdateObjectionModal objectionById={objectionById} UpdateObjecion={UpdateObjecion} type="vehicleModule"/>
                                </ObjectionModal>
                            }
                            {modalType === 'verify' &&
                                <ObjectionModal openModal={openModal} setOpenModal={setOpenModal} title={`Verify/Re Objection`}>
                                    <VerifyObjectionModal objectionById={objectionById} UpdateObjecion={UpdateObjecion} setOpenModal={setOpenModal} getDetails={getDetails} />
                                </ObjectionModal>
                            }
                        </MainCard>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
