import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import { Box, FormLabel, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Camera } from 'iconsax-react';
import Avatar from 'components/@extended/Avatar';
import { ThemeMode } from 'config';

const ImageUploader = ({image, setImage, label, id }) => {
    const theme = useTheme()

    // Preview images (optional)
    const [previewAvatar, setPreviewAvatar] = useState();

    useEffect(() => {
        if (image) setPreviewAvatar(URL.createObjectURL(image));
    }, [image]);

    return (
        <Box>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <Stack direction="row" sx={{ mt: 1 }}>
                <FormLabel
                    htmlFor="change-avtar"
                    sx={{
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer'
                    }}
                >
                    <Avatar alt="" src={previewAvatar} sx={{ width: 172, height: 172, border: '1px dashed' }} />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Stack spacing={0.5} alignItems="center">
                            <Camera style={{ color: theme.palette.secondary.light, fontSize: '2rem' }} />
                            <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                        </Stack>
                    </Box>
                </FormLabel>
                <TextField
                    type="file"
                    id="change-avtar"
                    placeholder="Outlined"
                    variant="outlined"
                    sx={{ display: 'none' }}
                    onChange={(e) => setImage(e.target.files?.[0])}
                />
            </Stack>
        </Box>
    )
}

export default ImageUploader