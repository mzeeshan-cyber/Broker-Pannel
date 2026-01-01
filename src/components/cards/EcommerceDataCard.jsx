import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { Button, Chip, Tooltip } from '@mui/material';
import { useTheme } from '@emotion/react';

export default function EcommerceDataCard({ 
  title,
  count,
  countTotal,
  percentage,
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
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar variant="rounded" color={color}>
                {iconPrimary}
              </Avatar>
              <Typography variant="subtitle1">{title}</Typography>
              <Typography variant="subtitle1">({countTotal})</Typography>
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
          <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
            <Box sx={{ p: 3, pb: 1.25 }}>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  {children}

                  {/* Interval Navigation */}
                  <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} paddingTop={'5px'}>
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      <Button size="small" variant="outlined" onClick={onPrev}>
                        <MdOutlineArrowBackIos />
                      </Button>
                      <Typography fontSize="12px" sx={{ textTransform: 'capitalize' }}>
                        {selectedType}
                      </Typography>
                      <Button size="small" variant="outlined" onClick={onNext} disabled={disableNext}>
                        <MdOutlineArrowForwardIos />
                      </Button>
                      <Typography fontSize={'10px'} color="#ffffffff">
                        {fromDate} To {toDate}
                      </Typography>
                    </Stack>

                    <Stack display={'flex'} justifyContent={'end'} alignItems={'end'}>
                      <Typography variant="h5">{count}</Typography>
                    </Stack>
                  </Stack>

                </Grid>
              </Grid>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}