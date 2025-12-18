import { useTheme } from '@emotion/react';
import { Button, CircularProgress } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import React from 'react'

const SubmitButton = ({isSubmitting, text, size='large'}) => {
    const theme = useTheme();
    return (
        <AnimateButton>
            <Button disabled={isSubmitting} fullWidth size={size} type="submit" variant="contained" color="primary"
                sx={{
                    padding: '8px 22px',
                    '&.Mui-disabled': {
                        bgcolor: theme.palette.primary.main,
                    }
                }}>
                {isSubmitting ?
                    <CircularProgress sx={{ height: '20px !important', width: '20px !important', color: 'white' }} />
                    :
                    <span>{text}</span>
                }
            </Button>
        </AnimateButton>
    )
}

export default SubmitButton