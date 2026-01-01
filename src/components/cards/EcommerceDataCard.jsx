import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { Tooltip } from '@mui/material';
import { useTheme } from '@emotion/react';

export default function EcommerceDataCard({
  title,
  count,
  countTotal,
  color,
  iconPrimary,
  children,
  toDate,
  fromDate,
  selectedType,
  onTypeChange,
  onPrev,
  onNext,
  disableNext
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar variant="rounded" color={color}>
                {iconPrimary}
              </Avatar>
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="subtitle1">{title}</Typography>
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="subtitle1" fontSize={12}>{count}</Typography>
                  <Typography variant="subtitle1" fontSize={12} margin={'0 2px'}>/</Typography>
                  <Typography variant="subtitle1" fontSize={12}>{countTotal}</Typography>
                </Stack>
              </Stack>
            </Stack>

            {/* Interval Type Menu */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                color="secondary"
                id="wallet-button"
                aria-controls={open ? 'wallet-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <MoreIcon />
              </IconButton>
              <Menu
                id="wallet-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'wallet-button',
                  sx: { p: 1.25, minWidth: 150 }
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <ListItemButton onClick={() => { handleClose(); onTypeChange('weekly'); }}>Weekly</ListItemButton>
                <ListItemButton onClick={() => { handleClose(); onTypeChange('monthly'); }}>Monthly</ListItemButton>
                <ListItemButton onClick={() => { handleClose(); onTypeChange('yearly'); }}>Yearly</ListItemButton>
              </Menu>
            </Stack>
          </Stack>
        </Grid>

        {/* Chart Section */}
        <Grid item xs={12}>
          <MainCard content={false} border={false} sx={{ bgcolor: theme.palette.mode === 'dark' ? '#161f29ff' : '#F5F8FF' }}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  {children}
                </Grid>
              </Grid>
            </Box>
          </MainCard>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} spacing={1} paddingTop={'10px'}>
            <Stack direction={'row'} alignItems={'center'} gap={'5px'}>
              <Typography fontSize="12px" sx={{ textTransform: 'capitalize' }}>
                {selectedType}
              </Typography>
              <Tooltip title='Previus Interval'>
                <IconButton color="primary" onClick={onPrev} sx={{ p: 0, height: '15px', width: '15px' }}>
                  <MdOutlineArrowBackIos size={5}/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Next Interval">
                <IconButton color="primary" onClick={onNext} disabled={disableNext} sx={{ p: 0, height: '15px', width: '15px' }}>
                  <MdOutlineArrowForwardIos size={5}/>
                </IconButton>
              </Tooltip>
            </Stack>
            <Typography fontSize={'10px'}>
              {fromDate} To {toDate}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}