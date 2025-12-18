// material-ui
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
// third-party
import { OutlinedInput } from '@mui/material';
import { useState } from 'react';
import IconButton from 'components/@extended/IconButton';
import { Eye, EyeSlash } from 'iconsax-react';
import 'react-phone-input-2/lib/style.css';

const PasswordField = ({
    id,
    label,
    touched,
    errors,
    values,
    handleBlur,
    handleChange,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <Stack spacing={1}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <OutlinedInput
                fullWidth
                error={Boolean(touched && errors)}
                id={id}
                type={showPassword ? 'text' : 'password'}
                value={values}
                name={id}
                onBlur={handleBlur}
                onChange={(e) => {
                    handleChange(e);
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                        >
                            {showPassword ? <Eye /> : <EyeSlash />}
                        </IconButton>
                    </InputAdornment>
                }
                placeholder="******"
                inputProps={{}}
            />
        </Stack>
    )
}

export default PasswordField