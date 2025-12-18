import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from 'components/@extended/IconButton';
import { Trash, AddCircle } from 'iconsax-react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { ThemeMode } from 'config';
// import Filters from './filters';

const TripButtonsOnTable = ({ handleGetData }) => {
    const theme = useTheme();
    const navigate = useNavigate()
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {/* <Filters handleGetBySearch={handleGetData} /> */}
            <Link to={`/reimbursement-trips/add`}>
                <Button
                    variant="contained"
                    color="primary"
                    type='button'
                    sx={{
                        fontWeight: 500,
                        bgcolor: 'primary',
                        color: 'secondary.lighter',
                        '&:hover': {
                            color: 'secondary.lighter',
                            ...(theme.palette.mode === ThemeMode.DARK && {
                                bgcolor: 'primary.darker',
                                color: 'secondary.darker'
                            })
                        }
                    }}
                >
                    <AddCircle size="32" />
                    <Box sx={{ marginLeft: '5px' }}>Add Reimbursement Trip</Box>
                </Button>
            </Link>

            <Tooltip title='Deleted Reimbursement Trips'>
                <IconButton color={'error'} onClick={() => navigate(`/reimbursement-trips/deleted`)}>
                    <Trash
                        variant="Bold"
                    />
                </IconButton>
            </Tooltip>
        </Stack>
    )
}

export default TripButtonsOnTable