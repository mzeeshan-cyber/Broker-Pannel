import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AddCircle } from 'iconsax-react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeMode } from 'config';
import Filters from './Filters';

const ButtonsOnTable = ({ handleGetData, filters }) => {
    const theme = useTheme();
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Filters handleGetBySearch={handleGetData} filters={filters}/>
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
        </Stack>
    )
}

export default ButtonsOnTable