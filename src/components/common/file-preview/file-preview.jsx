import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from 'components/@extended/IconButton';
import { Eye } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Typography } from '@mui/material';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFPreview = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div style={{ width: '50vw', height: '50vh' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
        </div>
    );
};

const DocPreview = ({ fileUrl }) => (
    <iframe
        src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
        style={{ width: '50vw', height: '50vh' }}
        frameBorder="0"
        title="DOC Preview"
    />
);

const FilePreview = ({ fileUrl }) => {
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(prevState => !prevState)
    }
    const extension = fileUrl?.split('.').pop().toLowerCase();

    return (
        <>
            <Tooltip title='Preview'>
                <IconButton color="info" onClick={handleOpenModal}>
                    <Eye variant="Outline" />
                </IconButton>
            </Tooltip>
            <TransitionsModal openModal={openModal} setOpenModal={setOpenModal} handleSubmit={handleOpenModal} title="Preview Document" btnText='OK' >
                <Typography id="modal-modal-description">{extension === 'pdf' ? <PDFPreview fileUrl={fileUrl} /> : extension === 'doc' || extension === 'docx' ? <DocPreview fileUrl={fileUrl} /> : 'Unsupported file type'}</Typography>
            </TransitionsModal>

        </>
    )
};

export default FilePreview;