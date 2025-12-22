import React, { useState } from 'react';
// material-ui
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
// project import
import IconButton from 'components/@extended/IconButton';
//assets
import { Bag, Edit2, Eye } from 'iconsax-react';
import { Chip, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { registrationDocumentsStatus } from 'constants/constants';
import { updateDocumentProviderStatus } from 'store/reducers/provideDocumentSlice';
import { Link } from 'react-router-dom';
import FilePreview from 'components/common/file-preview/file-preview';
import { decryptToken } from 'utils/tokenUtils';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';

const changeStatus = async (id, status, dispatch) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);

    try {
        const response = await fetch(`${API_URL}provider-register-document/${id}/status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
                'Content-Type': 'application/json',  // Ensure JSON content type
            },
            body: JSON.stringify({ status }), // Send JSON body
        });
        const data = await response.json(); // Parse JSON response
        if (response.ok) {
            dispatch(updateDocumentProviderStatus({ id, status }));
            openSnackbar({
                open: true,
                message: data.message || "Status successfully changed",
                variant: 'alert',
                alert: { color: 'success' }
            });
        } else {
            openSnackbar({
                open: true,
                message: data.message || "An unexpected error occurred",
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
    } catch (error) {
        openSnackbar({
            open: true,
            message: error.message || "An unexpected error occurred",
            variant: 'alert',
            alert: { color: 'error' }
        });
    }
};

function EditAction({ row, table }) {
    const { provider_id } = useParams()
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }
    // const selectedCount = table.getSelectedRowModel().rows.length;
    const {isDeleting}  = useSelector(state => state.providerDocument)

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='Edit'>
                <IconButton color={'primary'} onClick={() => navigate(`/providers/${provider_id}/registration-documents/${row?.original.id}/update`)}>
                    <Edit2 variant="Outline" />
                </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
                <IconButton color="error" onClick={handleOpenModal}>
                    <Bag variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} title="Delete Document" handleSubmit={() => table.options.meta.deleteRow(row.original.id)} btnText='Delete' isSubmitting={isDeleting}>
                <Typography id="modal-modal-description">Are you sure, you want to delete this document?</Typography>
            </TransitionsModal>
        </Stack>
    );
}

const DOC_URL = import.meta.env.VITE_SERVER_IMAGE_PATH;

export const columns =
    [
        {
            id: 'document_name',
            header: 'Document Name',
            footer: 'Document Name',
            accessorKey: 'document_name',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'file_path',
            header: 'Document File',
            footer: 'Document File',
            accessorKey: 'file_path',
            cell: ({ row }) => {
                const extension = row?.original?.file_path?.split('.').pop().toLowerCase();
                return (
                    <>
                        {extension === 'pdf' ?
                            <Tooltip title='Preview'>
                                <Link target='_blank' to={`${DOC_URL}${row.original.file_path}`} style={{ padding: '4px 8px', alignItems: 'center', display: 'flex', maxWidth: 'fit-content' }}>
                                    <Eye variant="Outline" size={20} color='#00a2aee6' />
                                </Link>
                            </Tooltip>
                            :
                            // <FilePreview fileUrl={`https://file-examples.com/storage/fe24b71d34681dd839ac375/2017/02/file-sample_100kB.doc`} />
                            <FilePreview fileUrl={`${DOC_URL}${row.original.file_path}`} />
                        }
                    </>

                );
            },
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'issue_date',
            header: 'Issue Date',
            footer: 'Issue Date',
            accessorKey: 'issue_date',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'expiry_date',
            header: 'Expiry Date',
            footer: 'Expiry Date',
            accessorKey: 'expiry_date',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'status',
            header: 'Status',
            footer: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => {
                const dispatch = useDispatch();
                const handleChange = (event, rowId) => {
                    const newValue = event.target.value;
                    changeStatus(rowId, newValue, dispatch)
                };
                return (
                    <Select
                        labelId="editable-select-label"
                        sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
                        id={`editable-select-${row.original.id}`}
                        value={row.original.status} // Use row-specific value
                        onChange={(event) => handleChange(event, row.original.id)}
                        size="small"
                    >
                        {registrationDocumentsStatus.map((item, index) => (
                            <MenuItem value={item.name} key={index}>
                                <Chip color={item.color} label={item.label} size="small" variant="light" />
                            </MenuItem>
                        ))}
                    </Select>
                );
            },
            dataType: 'select',
        },
        {
            id: 'edit',
            header: 'Actions',
            cell: EditAction,
            enableGrouping: false,
            meta: { className: 'cell-center' }
        },
    ]