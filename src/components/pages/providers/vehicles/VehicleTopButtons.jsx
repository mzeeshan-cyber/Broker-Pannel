// material-ui
import Stack from '@mui/material/Stack';
import Filters from './filters';

const VehicleButton = ({ handleGetData, filterValue }) => {
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Filters handleGetBySearch={handleGetData} filterValue={filterValue}/>
        </Stack>
    )
}

export default VehicleButton