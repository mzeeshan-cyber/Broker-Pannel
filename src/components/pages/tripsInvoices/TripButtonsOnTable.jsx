import Stack from '@mui/material/Stack';
import Filters from './filters';

const TripButtonsOnTable = ({ handleGetData }) => {
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Filters handleGetBySearch={handleGetData} />
        </Stack>
    )
}

export default TripButtonsOnTable