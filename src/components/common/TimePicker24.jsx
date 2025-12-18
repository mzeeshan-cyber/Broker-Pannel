import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  TextField,
  Popover,
  Button,
  IconButton,
  Stack,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { FaRegClock } from "react-icons/fa";

export default function TimePicker24({
  id,
  label = "Select time",
  values, // expects "HH:MM"
  touched,
  errors,
  handleChange,
  handleBlur,
  disabled
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  const defaultHour = dayjs().format("HH");
  const defaultMinute = dayjs().format("mm");

  // Sync with Formik value or fallback
  useEffect(() => {
    if (values) {
      const [h, m] = values.split(":");
      setHour(h);
      setMinute(m);
    } else {
      setHour(defaultHour);
      setMinute(defaultMinute);
    }
  }, [values, defaultHour, defaultMinute]);

  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleConfirm = () => {
    const h = Math.max(0, Math.min(23, parseInt(hour, 10) || 0));
    const m = Math.max(0, Math.min(59, parseInt(minute, 10) || 0));
    const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    // Update Formik field
    handleChange({ target: { name: id, value: formatted } });
    setHour(String(h).padStart(2, "0"));
    setMinute(String(m).padStart(2, "0"));
    handleClose();
  };

  const handleChangeLimited = (setter, max) => (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    if (parseInt(val, 10) > max) val = String(max);
    setter(val);
  };

  const showError = Boolean(touched && errors);

  return (
    <Stack spacing={0.5}>
      <InputLabel htmlFor={id}>{label}</InputLabel>

      <TextField
        id={id}
        name={id}
        value={values || ""}
        placeholder="HH:MM"
        fullWidth
        onClick={handleOpen}
        onBlur={handleBlur}
        error={showError}
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <IconButton size="small" onClick={handleOpen}>
              <FaRegClock />
            </IconButton>
          ),
        }}
      />

      {showError && (
        <FormHelperText error sx={{ mt: 0 }}>
          {errors}
        </FormHelperText>
      )}
      {!disabled &&
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ display: "flex", gap: 1, p: 2, alignItems: "center" }}>
            <TextField
              type="number"
              value={hour}
              onChange={handleChangeLimited(setHour, 23)}
              inputProps={{ min: 0, max: 23, maxLength: 2 }}
              size="small"
              label="HH"
              sx={{ width: 70 }}
            />
            <span style={{ fontSize: 18 }}>:</span>
            <TextField
              type="number"
              value={minute}
              onChange={handleChangeLimited(setMinute, 59)}
              inputProps={{ min: 0, max: 59, maxLength: 2 }}
              size="small"
              label="MM"
              sx={{ width: 70 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleConfirm}
              sx={{ textTransform: "none" }}
            >
              OK
            </Button>
          </Box>
        </Popover>
      }
    </Stack>
  );
}
