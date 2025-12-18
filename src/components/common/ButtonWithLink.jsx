import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
//assets
import { AddCircle } from 'iconsax-react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeMode } from 'config';

const ButtonWithLink = ({ name, link, sx }) => {
    const theme = useTheme();
    return (
        <Box sx={sx}>
            <Link to={link}>
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
                    <Box sx={{ marginLeft: '5px' }}>{name}</Box>
                </Button>
            </Link>
        </Box>
    )
}

export default ButtonWithLink