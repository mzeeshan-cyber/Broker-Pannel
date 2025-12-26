import Stack from '@mui/material/Stack';
import Filters from './filters';
import DetailPageFilters from './detailPageFilters';
import ReusableDrawer from 'components/common/ReusableDrawer';
import { useState } from 'react';
import { Button, Divider } from '@mui/material';
import ManageRisk from './manageRisk';

const TripButtonsOnTable = ({ handleGetData, pageTitle }) => {
    const [open, setOpen] = useState(false);
    const handleToggle = () => setOpen(!open);
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {pageTitle === 'invoice-view' ?
                <DetailPageFilters handleGetBySearch={handleGetData} />
                :
                <>
                    <Button onClick={handleToggle} variant='outlined' color='error'>Risk Factor</Button>
                    <Filters handleGetBySearch={handleGetData} />
                    <ReusableDrawer
                        open={open}
                        onClose={handleToggle}
                        title="Manage Risk Factor"
                    >
                        <Divider/>
                        <ManageRisk/>
                    </ReusableDrawer>
                </>
            }
        </Stack>
    )
}

export default TripButtonsOnTable