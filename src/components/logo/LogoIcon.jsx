// material-ui
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';

export default function LogoIcon() {
  const theme = useTheme();

  return (
    <Box sx={{paddingTop:'20px'}}>
      <img src={theme.palette.mode === ThemeMode.DARK ? 'https://test.cnavigator.tech/broker/images/main-broker/Logo.png' : 'https://cnavigator.tech/website/images/logo.png'} alt="icon logo" width="100" />
    </Box>
  );
}
