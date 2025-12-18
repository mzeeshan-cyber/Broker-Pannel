import { useState } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import UploadMultiFile from 'components/third-party/dropzone/MultiFile';
import IconButton from 'components/@extended/IconButton';
import { Category, TableDocument } from 'iconsax-react';
import { Box, InputLabel } from '@mui/material';

export default function DropzonePage({ id, label, values, errors, touched, setFieldValue }) {
    const [list, setList] = useState(false);
    const [fileErrors, setFileErrors] = useState([]);

    const handleFileChange = (field, fileList) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        const maxSize = 1 * 1024 * 1024;
        let errorsArr = [];

        const validFiles = fileList.filter((file) => {
            if (!allowedTypes.includes(file.type)) {
                errorsArr.push(`${file.name} is not a valid format (only JPG, JPEG, PNG, PDF allowed).`);
                return false;
            }
            if (file.size > maxSize) {
                errorsArr.push(`${file.name} is larger than 1MB.`);
                return false;
            }
            return true;
        });

        setFileErrors(errorsArr);
        setFieldValue(field, validFiles);
    };

    return (
        <>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <Stack direction="row" alignItems="center" spacing={1.25}>
                    <IconButton color={list ? 'secondary' : 'primary'} size="small" onClick={() => setList(false)}>
                        <TableDocument style={{ fontSize: '1.15rem' }} />
                    </IconButton>
                    <IconButton color={list ? 'primary' : 'secondary'} size="small" onClick={() => setList(true)}>
                        <Category style={{ fontSize: '1.15rem' }} />
                    </IconButton>
                </Stack>
            </Box>
            <div>
                <Stack spacing={1.5} alignItems="center">
                    <UploadMultiFile
                        showList={list}
                        setFieldValue={(field, fileList) => handleFileChange(id, fileList)}
                        files={values || []}
                        error={touched && (!!errors || fileErrors.length > 0)}
                    />
                </Stack>
                {touched && errors && (
                    <FormHelperText error id={`helper-text-${id}`}>
                        {errors}
                    </FormHelperText>
                )}
                {fileErrors.length > 0 &&
                    fileErrors.map((err, i) => (
                        <FormHelperText key={i} error id={`file-error-${i}`}>
                            {err}
                        </FormHelperText>
                    ))}
            </div>
        </>
    );
}
