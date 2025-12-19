// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

// project import
import IconButton from 'components/@extended/IconButton';

//assets
import { Trash, AddCircle } from 'iconsax-react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { ThemeMode } from 'config';
import Filters from './filters';

const ProviderButtonsOnTable = ({ handleGetData, filters }) => {
    const theme = useTheme();
    const navigate = useNavigate()
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Filters handleGetBySearch={handleGetData} filters={filters}/>
            <Link to={`/providers/add`}>
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
                    <Box sx={{ marginLeft: '5px' }}>Provider</Box>
                </Button>
            </Link>

            <Tooltip title='Deleted Payees'>
                <IconButton color={'error'} onClick={() => navigate(`/providers/deleted`)}>
                    <Trash
                        variant="Bold"
                    />
                </IconButton>
            </Tooltip>
        </Stack>
    )
}

export default ProviderButtonsOnTable