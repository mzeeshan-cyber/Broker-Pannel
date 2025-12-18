import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import CardContent from '@mui/material/CardContent';
import MainCard from 'components/MainCard';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@emotion/react';

export default function TransitionsModal({ openModal, setOpenModal, title, children, handleSubmit, btnText = 'Submit', isSubmitting, noFooter }) {
  const handleClose = () => setOpenModal(false);
  const theme = useTheme()
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
          <Divider />
          {!noFooter &&
            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ px: 2.5, py: 2 }}>
              <Button color="error" size="small" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" size="small" onClick={handleSubmit} disabled={isSubmitting} sx={{
                '&.Mui-disabled': {
                  bgcolor: theme.palette.primary.main,
                }
              }}>
                {isSubmitting ? <CircularProgress sx={{ height: '20px !important', width: '20px !important', color: 'white' }} /> : btnText}
              </Button>
            </Stack>
          }
        </MainCard>
      </Fade>
    </Modal>
  );
}
