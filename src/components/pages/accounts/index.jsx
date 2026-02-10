import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import TabSettings from 'components/account/TabSettings';

export default function AccountProfile() {
  return (
    <>
      <MainCard border={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
            <TabSettings/>
        </Box>
      </MainCard>
    </>
  );
}
