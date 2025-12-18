// material-ui
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import CardContent from '@mui/material/CardContent';

// project-imports
import MainCard from 'components/MainCard';

export default function ObjectionModal({openModal, setOpenModal, title, children}) {
  
  const handleClose = () => setOpenModal(false);

  return (

    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
    >
      <Fade in={openModal}>
        <MainCard title={title} modal darkTitle content={false}>
          <CardContent>
            {children}
          </CardContent>
        </MainCard>
      </Fade>
    </Modal>
  );
}
