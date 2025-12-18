import React from 'react';
import FilePreview from 'components/common/file-preview/file-preview';
import { Eye } from 'iconsax-react';
const DOC_URL = import.meta.env.VITE_SERVER_IMAGE_PATH;
export const columns =
    [
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
                            (extension === 'doc' || extension === 'docx') ?
                                <FilePreview fileUrl={`${DOC_URL}${row.original.file_path}`} />
                                :
                                <img src={`${DOC_URL}${row.original.file_path}`} alt={row.original.file_path}/>
                        }
                    </>

                );
            },
            enableGrouping: false
        },
        {
            id: 'document_name',
            header: 'Document name',
            footer: 'Document name',
            accessorKey: 'document_name',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'issue_date',
            header: 'Issue date',
            footer: 'Issue date',
            accessorKey: 'issue_date',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'expiry_date',
            header: 'Expiry date',
            footer: 'Expiry date',
            accessorKey: 'expiry_date',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'document_type',
            header: 'Document type',
            footer: 'Document type',
            accessorKey: 'document_type',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'status',
            header: 'Status',
            footer: 'Status',
            accessorKey: 'status',
            dataType: 'text',
            enableGrouping: false
        }
    ]