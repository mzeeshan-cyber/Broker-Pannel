import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from 'components/@extended/IconButton';
import { ArrowDown2, ArrowRight2, CloseCircle, Eye } from 'iconsax-react';
import TransitionsModal from 'sections/components-overview/modal/TransitionsModal';
import { Chip, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useNavigate } from 'react-router';
import { openSnackbar } from 'api/snackbar';
import { useDispatch } from 'react-redux';
import { TripInvoicesStatus } from 'constants/constants';
import { decryptToken } from 'utils/tokenUtils';
import { updateStatus } from 'store/reducers/tripsInvoicesSlice';
import { FaFilePdf } from 'react-icons/fa';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fontWeight } from '@mui/system';
import { upperCase } from 'lodash';

const changeStatus = async (id, status, dispatch, paid_date = null) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);

    try {
        const response = await fetch(`${API_URL}trip-invoice/${id}/status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${decryptedToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status,
                ...(paid_date && { paid_date })
            }),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch(updateStatus({ id, status, paid_date }));
            openSnackbar({
                open: true,
                message: data.message || "Status successfully changed",
                variant: 'alert',
                alert: { color: 'success' }
            });
        } else {
            throw new Error(data.message);
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

const generatePDF = (rowData) => {
    const now = new Date();
    const time24 = now.toLocaleTimeString("en-US", { hour12: false });
    const currentDate = now.toISOString().split('T')[0];

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);

        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
        }).toUpperCase();
    };

    const getMonthDay = (dateStr) => {
        const date = new Date(dateStr);
        const month = date.toLocaleString("en-US", { month: "long" }).toUpperCase();
        const day = date.getDate();
        return `${month} ${day},`;
    };

    const getYear = (dateStr) => String(new Date(dateStr).getFullYear());

    const doc = new jsPDF("p", "mm", "a4");

    /* =======================
       HEADER
    ======================== */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("CW RideLine", 105, 20, { align: "center" });
    doc.setFontSize(11);
    const text = `NEMT ${upperCase(rowData.status)} VENDOR INVOICE`;
    const x = 105;
    const y = 26;
    doc.text(text, x, y, { align: "center" });

    // Calculate text width for center alignment
    const textWidth = doc.getTextWidth(text);

    // Draw underline
    doc.setLineWidth(0.5); // thickness of underline
    doc.line(
        x - textWidth / 2, // start x (centered)
        y + 1,             // start y (a little below text)
        x + textWidth / 2, // end x
        y + 1              // end y
    );

    doc.text("FOR ELECTRONIC INVOICING", 105, 32, { align: "center" });

    /* =======================
       CONTRACTOR INFO
    ======================== */
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const drawJustifiedText = (doc, label, value, y, options = {}) => {
        const leftX = options.leftX || 20;
        const rightX = options.rightX || 106;

        // Label → BOLD
        doc.setFont("helvetica", "normal");
        doc.text(label, leftX, y);

        // Value → NORMAL
        doc.setFont("helvetica", "bold");
        doc.text(value, rightX, y, { align: "left" });
    };

    drawJustifiedText(
        doc,
        "CONTRACTOR :",
        rowData.provider.contractor,
        50
    );

    drawJustifiedText(
        doc,
        "PHYSICAL ADDRESS :",
        rowData.provider.address,
        56
    );

    drawJustifiedText(
        doc,
        "CITY/STATE :",
        `${rowData.provider.city} / ${rowData.provider.state}`,
        62
    );
    drawJustifiedText(
        doc,
        "MAILING ADDRESS :",
        rowData.provider.address,
        68
    );
    drawJustifiedText(
        doc,
        "TELEPHONE :",
        rowData.provider.phone,
        74
    );
    drawJustifiedText(
        doc,
        "TRAVEL DATE RANGE :",
        `${formatDate(rowData.min_date)} - ${formatDate(rowData.max_date)}`,
        80
    );

    drawJustifiedText(
        doc,
        "PROCESSING DATE :",
        formatDate(rowData.processing_date),
        86
    );

    drawJustifiedText(
        doc,
        "SUBMISSION DATE :",
        formatDate(rowData.submission_date),
        92
    );


    /* =======================
       SUMMARY
    ======================== */
    doc.setFont("helvetica", "bold");
    doc.text("SUMMARY", 20, 105);

    const tableData = rowData.invoice_trip_count.map((item) => [
        `${item.funding_source} INVOICE AMOUNT (${item.trips} Trips)`,
        `$ ${item.amount.toFixed(2)}`,
    ]);

    autoTable(doc, {
        startY: 108,
        margin: { left: 66 },
        body: tableData,
        theme: "plain",
        styles: {
            font: "helvetica",
            fontSize: 10,
            cellPadding: 1,
        },
        columnStyles: {
            0: { halign: "left" },
            1: { halign: "right" },
        },
    });

    /* =======================
       TOTAL CALCULATION
    ======================== */
    // Calculate total
    const grandTotal = rowData.invoice_trip_count.reduce(
        (sum, item) => sum + item.amount,
        0
    );

    // Position below table
    const totalY = doc.lastAutoTable.finalY + 4;

    // Left text
    doc.setFont("helvetica", "bold");
    doc.text("GRAND TOTAL:", 67, totalY);

    // Right aligned amount (same column width)
    doc.text(`$ ${grandTotal.toFixed(2)}`, 195, totalY, {
        align: "right",
    });

    const finalY = doc.lastAutoTable.finalY + 20;

    /* =======================
       CERTIFICATIONS SECTION
    ======================== */
    doc.setFont("helvetica", "normal");
    doc.text("I certify that the services invoiced have been provided.", 20, finalY);
    doc.text("This electronic signature represents an original signature and is accepted by both parties.", 20, finalY + 10);
    /* =======================
       LEFT SIGNATURE SECTION
    ======================== */
    let leftX = 20;
    let signY = finalY + 26;

    doc.setFont("helvetica", "normal");

    doc.text(rowData.provider.owner, leftX, signY);
    doc.text("Authorized signature designated by", leftX, signY + 10);
    doc.text("Contractor", leftX, signY + 15);

    doc.text(getMonthDay(rowData.submission_date), leftX + 60, signY);
    doc.text(getYear(rowData.submission_date), leftX + 60, signY + 5);
    doc.text("Submission Date", leftX + 60, signY + 12);

    doc.text(
        `Printed Name and Title : ${rowData.provider.owner}, Owner`,
        leftX,
        signY + 26
    );

    /* =======================
       RIGHT CHECK / APPROVAL
    ======================== */
    let rightX = 115;
    let lineY = finalY + 17;

    doc.setFont("helvetica", "normal");
    doc.text("DATE", rightX, lineY);
    doc.text("CK#", rightX + 37, lineY);

    doc.line(rightX, lineY + 2, rightX + 35, lineY + 2);
    doc.line(rightX + 37, lineY + 2, 200, lineY + 2);

    lineY += 8;
    doc.text("CHECK TOTAL $", rightX, lineY);
    doc.line(rightX, lineY + 2, 200, lineY + 2);

    doc.setFont("helvetica", "normal");
    lineY += 6;

    rowData.invoice_trip_count.forEach((item) => {
        doc.text(item.funding_source, rightX, lineY);
        doc.text(`$ ${item.amount.toFixed(2)}`, 200, lineY, {
            align: "right",
        });
        lineY += 6;
    });

    doc.line(rightX + 37, lineY, 200, lineY);

    lineY += 3;
    doc.setFont("helvetica", "bold");
    doc.text("FINE TOTAL:", rightX + 14, lineY + 2);
    doc.line(rightX + 37, lineY + 4, 200, lineY + 4);
    doc.setFont("helvetica", "normal");
    doc.text(`$ 0.00`, 200, lineY + 2, {
        align: "right",
    });

    lineY += 7;
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE TOTAL:", rightX + 8, lineY + 2);
    doc.line(rightX + 37, lineY + 4, 200, lineY + 4);
    doc.setFont("helvetica", "normal");
    doc.text(`$ ${grandTotal.toFixed(2)}`, 200, lineY + 2, {
        align: "right",
    });

    lineY += 15;
    doc.text("APPROVAL", rightX, lineY);
    doc.text("DATE", rightX + 37, lineY);

    /* =======================
       FOOTER
    ======================== */
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
        `Printed from CNavigator System on ${formatDate(currentDate)} at ${time24} by ${rowData.provider.contractor}`,
        105,
        lineY + 7,
        { align: "center" }
    );

    /* =======================
       SAVE
    ======================== */
    doc.save(`${rowData.title || "invoice"}.pdf`);
};


function EditAction({ row }) {
    const navigate = useNavigate()
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title='View Trips'>
                <IconButton color={'primary'} onClick={() => navigate(`/trips-invoice/${row?.original.id}/view`)}>
                    <Eye variant="Outline" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Download Invoice">
                <IconButton onClick={() => { generatePDF(row.original)}}>
                    <FaFilePdf variant="Outline" />
                </IconButton>
            </Tooltip>
        </Stack>
    );
}
const StatusTransitions = {
    paid: ["paid"],
    submitted: ["paid", "rejected", "submitted"],
    rejected: ["rejected",],
};

export const columns =
    [
        {
            id: 'expander',
            enableGrouping: false,
            header: () => null,
            cell: ({ row }) => {
                return row.getCanExpand() ? (
                    <IconButton color={row.getIsExpanded() ? 'primary' : 'secondary'} onClick={row.getToggleExpandedHandler()} size="small">
                        {row.getIsExpanded() ? <ArrowDown2 size="32" variant="Outline" /> : <ArrowRight2 size="32" variant="Outline" />}
                    </IconButton>
                ) : (
                    <IconButton color="secondary" size="small" disabled>
                        <CloseCircle />
                    </IconButton>
                );
            }
        },
        {
            id: 'title',
            header: 'Invoice',
            footer: 'Invoice',
            accessorKey: 'title',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'submission_date',
            header: 'Submission Date',
            footer: 'Submission Date',
            accessorKey: 'submission_date',
            dataType: 'text',
            enableGrouping: false
        },
        {
            id: 'paid_date',
            header: 'Paid Date',
            footer: 'Paid Date',
            accessorFn: row => row?.paid_date || '—',
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

                const [openPaidModal, setOpenPaidModal] = useState(false);
                const [paidDate, setPaidDate] = useState('');

                const currentStatus = row.original.status;
                const rowId = row.original.id;

                const handleChange = (event) => {
                    const newStatus = event.target.value;

                    if (newStatus === 'paid') {
                        setOpenPaidModal(true);
                    } else {
                        changeStatus(rowId, newStatus, dispatch);
                    }
                };

                const handlePaidSubmit = () => {
                    if (!paidDate) return;

                    changeStatus(rowId, 'paid', dispatch, paidDate);
                    setOpenPaidModal(false);
                    setPaidDate('');
                };

                const allowed = StatusTransitions[currentStatus] || TripInvoicesStatus.map(item => item.name);
                const filteredStatuses = TripInvoicesStatus.filter(item => allowed.includes(item.name));

                return (
                    <>
                        {currentStatus === 'submitted' ?
                            <Select
                                value={currentStatus}
                                onChange={handleChange}
                                size="small"
                                sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1 } }}
                            >
                                {filteredStatuses.map((item, index) => (
                                    <MenuItem value={item.name} key={index}>
                                        <Chip
                                            color={item.color}
                                            label={item.label}
                                            size="small"
                                            variant="light"
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                            :
                            <Chip
                                color={currentStatus === 'paid' ? 'success' : currentStatus === 'rejected' ? 'error' : 'info'}
                                label={currentStatus}
                                size="small"
                                variant="light"
                            />
                        }

                        {/* Paid Date Modal */}
                        <TransitionsModal
                            openModal={openPaidModal}
                            setOpenModal={setOpenPaidModal}
                            title="Mark Invoice as Paid"
                            handleSubmit={handlePaidSubmit}
                            btnText="Confirm"
                        >
                            <Stack spacing={1} sx={{ minWidth: '320px' }}>
                                <InputLabel>Paid Date</InputLabel>
                                <TextField
                                    type="date"
                                    value={paidDate}
                                    onChange={(e) => setPaidDate(e.target.value)}
                                    fullWidth
                                />
                            </Stack>
                        </TransitionsModal>
                    </>
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