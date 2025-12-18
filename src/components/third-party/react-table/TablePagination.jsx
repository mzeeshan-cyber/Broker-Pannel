import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ==============================|| TABLE PAGINATION ||============================== //

export default function TablePagination({ totalRecords, page, pageSize, handleChangePagination, handleChange }) {
  const [open, setOpen] = useState(false);

  let options = [10, 25, 50, 100];

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Grid spacing={1} container alignItems="center" justifyContent="space-between" sx={{ width: 'auto' }}>
      <Grid item>
        <Stack direction="row" spacing={1} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="secondary">
              Row per page
            </Typography>
            <FormControl sx={{ m: 1 }}>
              <Select
                id="demo-controlled-open-select"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={pageSize}
                onChange={(e)=>handleChange(e)}
                size="small"
                sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Typography variant="caption" color="secondary">
            Go to
          </Typography>
          <TextField
            size="small"
            type="number"
            value={page}
            min={1}
            onChange={(e) => handleChangePagination(e)}
            sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, width: 36 } }}
          />
        </Stack>
      </Grid>
      <Grid item sx={{ mt: { xs: 2, sm: 0 } }}>
        <Pagination
          sx={{ '& .MuiPaginationItem-root': { my: 0.5 } }}
          count={Math.ceil(totalRecords / pageSize)}  // Ensure totalRecords is passed as a prop
          page={page}  // Pages are 1-based in MUI Pagination
          onChange={handleChangePagination}
          color="primary"
          variant="combined"
          showFirstButton
          showLastButton
        />

      </Grid>
    </Grid>
  );
}

TablePagination.propTypes = {
  getPageCount: PropTypes.func,
  setPage: PropTypes.func,
  setPageSize: PropTypes.func,
  getState: PropTypes.func,
  initialPageSize: PropTypes.number
};
