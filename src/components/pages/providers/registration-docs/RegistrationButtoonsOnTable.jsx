// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

//assets
import { AddCircle } from 'iconsax-react';
import { Button } from '@mui/material';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { ThemeMode } from 'config';

const RegistrationButtoonsOnTable = () => {
    const theme = useTheme();
    const {provider_id} = useParams()
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Link to={`/providers/${provider_id}/registration-documents/add`}>
            
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
                    <Box sx={{ marginLeft: '5px' }}>Registration Documents</Box>
                </Button>
            </Link>
        </Stack>
    )
}

export default RegistrationButtoonsOnTable