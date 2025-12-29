import Stack from '@mui/material/Stack';
import Filters from './filters';
import DetailPageFilters from './detailPageFilters';
import ReusableDrawer from 'components/common/ReusableDrawer';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import ManageRisk from './manageRisk';
import { fetcher } from 'utils/axios';
import RiskFactorCard from './RiskFactorCard';

const TripButtonsOnTable = ({ handleGetData, pageTitle, riskData, setRiskData }) => {
    const [open, setOpen] = useState(false);
    const handleToggle = () => setOpen(!open);
    const getRiskData = async () => {
         if (typeof setRiskData !== 'function') return;
        const response = await fetcher(["/get-trip-margin-data"]);
        if (response.status === true) {
            setRiskData(response?.data?.data)
        }
    };

    useEffect(() => {
        if(pageTitle ==="invoice-view"){
            getRiskData();
        }
    }, [open, pageTitle])
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {pageTitle === 'invoice-view' ?
                <>
                    <RiskFactorCard riskData={riskData}/>
                    <DetailPageFilters handleGetBySearch={handleGetData} />
                    <Button onClick={handleToggle} variant='outlined' color='error'>Manage Risk Factor</Button>
                    <ReusableDrawer
                        open={open}
                        onClose={handleToggle}
                        title="Manage Risk Factor"
                    >
                        <ManageRisk setOpen={setOpen} riskData={riskData} />
                    </ReusableDrawer>
                </>
                :
                <>
                    <Filters handleGetBySearch={handleGetData} />
                </>
            }
        </Stack>
    )
}

export default TripButtonsOnTable