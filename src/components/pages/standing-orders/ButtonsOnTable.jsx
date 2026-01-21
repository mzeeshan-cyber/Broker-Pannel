import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AddCircle, Trash } from 'iconsax-react';
import { Button, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeMode } from 'config';
import Filters from './Filters';
import IconButton from 'components/@extended/IconButton';

const ButtonsOnTable = ({ handleGetData, filters }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Filters handleGetBySearch={handleGetData} filters={filters} />
            <Link to={`/standing-orders/add`}>
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
                    <Box sx={{ marginLeft: '5px' }}>Standing Orders</Box>
                </Button>
            </Link>
            <Tooltip title='Deleted Standing Orders'>
                <IconButton color={'error'} onClick={() => navigate(`/standing-orders/deleted`)}>
                    <Trash
                        variant="Bold"
                    />
                </IconButton>
            </Tooltip>
        </Stack>
    )
}

export default ButtonsOnTable