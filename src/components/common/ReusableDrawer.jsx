import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Add } from 'iconsax-react';

const ReusableDrawer = ({
    open,
    onClose,
    title,
    children,
    width = { xs: 350, sm: 474 },
    actions
}) => {
    return (
        <Drawer
            sx={{ zIndex: 2001 }}
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width,
                    transition: 'transform 300ms ease-in-out'
                }
            }}
            ModalProps={{
                keepMounted: true
            }}
        >
            <MainCard
                content={false}
                sx={{
                    border: 'none',
                    borderRadius: 0,
                    height: '100vh'
                }}
            >
                <SimpleBar
                    sx={{
                        height: '100%',
                        '& .simplebar-content': {
                            display: 'flex',
                            flexDirection: 'column'
                        }
                    }}
                >
                    <Box sx={{ p: 2.5 }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1.5}
                        >
                            <Typography variant="h5">{title}</Typography>

                            <IconButton color="secondary" sx={{ p: 0 }} onClick={onClose}>
                                <Add size={28} style={{ transform: 'rotate(45deg)' }} />
                            </IconButton>

                            {actions &&
                                actions.map((action, idx) => (
                                    <Box key={idx}>{action}</Box>
                                ))}
                        </Stack>

                        <Box sx={{ mt: 2 }}>{children}</Box>
                    </Box>
                </SimpleBar>
            </MainCard>
        </Drawer>
    );
};


export default ReusableDrawer;
