import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AddCircle } from 'iconsax-react';
import { Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeMode } from 'config';
import SharedFilters from './sharedFilters';
import { capitalize } from 'lodash';

const ManageSharedTripButtonsOnTable = ({ handleGetData, activeFilters, removeSingleFilter }) => {
    const theme = useTheme();

    return (
        <Stack flexDirection="row" alignItems="center" gap="10px">
            <Stack direction="row" spacing={1} flexWrap="wrap">
                {Object.entries(activeFilters).map(([key, value]) => (
                    <Chip
                        key={key}
                        label={`${capitalize(key.replace("_", " "))}: ${capitalize(value.replace("_", " "))}`}
                        onDelete={key === "date" ? undefined : () => removeSingleFilter(key)}
                        sx={{
                            bgcolor: "secondary.light",
                            color: "secondary.dark",
                            fontWeight: 500
                        }}
                    />
                ))}

            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
                <SharedFilters handleGetBySearch={handleGetData} />

                <Link to={`/add-trip`}>
                    <Button
                        variant="contained"
                        color="primary"
                        type='button'
                        sx={{
                            fontWeight: 500,
                            color: 'secondary.lighter',
                            '&:hover': {
                                color: 'secondary.lighter'
                            }
                        }}
                    >
                        <AddCircle size="32" />
                        <Box sx={{ marginLeft: '5px' }}>Add Trip</Box>
                    </Button>
                </Link>
            </Stack>
        </Stack>
    );
};


export default ManageSharedTripButtonsOnTable