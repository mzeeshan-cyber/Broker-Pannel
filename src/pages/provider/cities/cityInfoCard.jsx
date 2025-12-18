import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    Stack,
    Divider,
    useTheme,
    Select,
    MenuItem,
    Grid,
    Tooltip
} from "@mui/material";
import { MdLocationCity } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import { fetcherDelete, fetcherPost } from "utils/axios";
import { openSnackbar } from "api/snackbar";
import IconButton from "components/@extended/IconButton";
import { Bag } from "iconsax-react";
import TransitionsModal from "sections/components-overview/modal/TransitionsModal";
import { allProviderCitiesAfterDelete } from "store/reducers/providerCitiesSlice";
import { useDispatch } from "react-redux";

const cityStatuses = [
    { name: "approved", label: "Approved", color: "success" },
    { name: "pending", label: "Pending", color: "warning" },
    { name: "rejected", label: "Rejected", color: "error" },
];

export default function CityInfoCard({ data, onStatusUpdate, noStatus }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    // State for status of each city
    const [statuses, setStatuses] = useState(
        () =>
            data?.reduce((acc, item) => {
                acc[item.id] = item.status;
                return acc;
            }, {}) || {}
    );

    const [openModals, setOpenModals] = useState(
        () =>
            data?.reduce((acc, item) => {
                acc[item.id] = false;
                return acc;
            }, {}) || {}
    );

    const handleStatusChange = async (cityId, newStatus) => {
        setStatuses((prev) => ({ ...prev, [cityId]: newStatus }));
        try {
            const response = await fetcherPost([
                `provider-operational-cities/${cityId}/status`,
                { status: newStatus }
            ]);
            if (response.status === true || response.status === 200) {
                onStatusUpdate && onStatusUpdate(cityId, newStatus);
                openSnackbar({
                    open: true,
                    message: response.message || "City Status Updated successfully!",
                    variant: "alert",
                    alert: {
                        color: "success"
                    }
                });
            } else {
                openSnackbar({
                    open: true,
                    message: response.message || response.data?.message || "Failed to update status",
                    variant: "alert",
                    alert: {
                        color: "error"
                    }
                });
            }
        } catch (err) {
            openSnackbar({
                open: true,
                message: "City Status Is Not Updated!",
                variant: "alert",
                alert: {
                    color: "error"
                }
            });
        }
    };

    const deleteCity = async (id) => {
        setIsLoading(true);
        const response = await fetcherDelete([`/provider-operational-cities/${id}/delete`]);
        if (response.status === 200) {
            dispatch(allProviderCitiesAfterDelete(id));
            openSnackbar({
                open: true,
                message: "City deleted successfully!",
                variant: "alert",
                alert: {
                    color: "success"
                }
            });
        }
        setIsLoading(false);
    };

    if (!data || !Array.isArray(data)) return null;

    return data.map((item) => {
        const status = statuses[item.id];
        const setStatus = (newStatus) => setStatuses((prev) => ({ ...prev, [item.id]: newStatus }));

        const openModal = openModals[item.id];
        const setOpenModal = (value) =>
            setOpenModals((prev) => ({ ...prev, [item.id]: value }));

        const handleOpenModal = () => setOpenModal(!openModal);

        return (
            <Grid
                key={item.id}
                item
                xs={12}
                md={noStatus ? 12 : 6}
                lg={noStatus ? 12 : 4}
                xl={noStatus ? 12 : 3}
            >
                <Card
                    elevation={isDark ? 4 : 0}
                    sx={{
                        borderRadius: "18px",
                        width: "100%",
                        overflow: "hidden",
                        minHeight: "100%",
                        background: isDark
                            ? "linear-gradient(145deg, #1e1e1e, #2a2a2a)"
                            : "linear-gradient(145deg, #ffffff, #f3f6fb)",
                        border: `1px solid ${isDark ? theme.palette.divider : "#e3e8ef"}`,
                        boxShadow: isDark ? "0 6px 22px rgba(0,0,0,0.45)" : "0 4px 20px rgba(0,0,0,0.06)",
                        transition: "0.3s ease",
                        "&:hover": {
                            boxShadow: isDark ? "0 10px 28px rgba(0,0,0,0.6)" : "0 8px 30px rgba(0,0,0,0.12)"
                        }
                    }}
                >
                    <CardContent sx={{ pb: "16px !important" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mb={2}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Box
                                    sx={{
                                        background: isDark ? "#263c55" : "#e3f2fd",
                                        p: 1,
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    <MdLocationCity size={22} color={isDark ? "#90caf9" : "#1976d2"} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                    {item.city}
                                </Typography>
                            </Stack>
                            {!noStatus &&
                                <>
                                    <Tooltip title="Delete">
                                        <IconButton color="error" onClick={handleOpenModal}>
                                            <Bag variant="Outline" />
                                        </IconButton>
                                    </Tooltip>

                                    <TransitionsModal
                                        openModal={openModal}
                                        setOpenModal={setOpenModal}
                                        title="Delete City"
                                        handleSubmit={() => deleteCity(item.id)}
                                        btnText="Delete"
                                        isSubmitting={isLoading}
                                    >
                                        <Typography id="modal-modal-description">
                                            Are you sure, you want to delete this city?
                                        </Typography>
                                    </TransitionsModal>
                                </>
                            }

                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                            <strong>State:</strong> {item.state_full} ({item.state_short})
                        </Typography>

                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                            <strong>County:</strong> {item.county}
                        </Typography>

                        {!noStatus && (
                            <Box
                                sx={{
                                    color: theme.palette.text.secondary,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "10px"
                                }}
                            >
                                <strong>Status:</strong>
                                <Select
                                    value={status || item.status}
                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                    size="small"
                                    sx={{
                                        minWidth: 140,
                                        "& .MuiSelect-select": { display: "flex", alignItems: "center" }
                                    }}
                                >
                                    {cityStatuses.map((ts) => (
                                        <MenuItem key={ts.name} value={ts.name}>
                                            <Chip color={ts.color} label={ts.label} size="small" variant="light" />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        )}

                        <Divider sx={{ mb: 2 }} />

                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Box
                                sx={{
                                    background: isDark ? "#2e4630" : "#e8f5e9",
                                    p: 1,
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <FaMapMarkedAlt size={18} color={isDark ? "#81c784" : "#2e7d32"} />
                            </Box>

                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                Zip Codes
                            </Typography>
                        </Stack>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", mt: 1 }}>
                            {(noStatus ? item?.zip_codes : item?.zip_codes?.slice(0, 9))?.map((zip, i) => (
                                <Chip
                                    key={`${item.id}-${zip}`} // ensure unique key
                                    label={zip}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        borderRadius: "6px",
                                        fontSize: "0.8rem",
                                        color: theme.palette.text.primary,
                                        borderColor: theme.palette.divider
                                    }}
                                />
                            ))}

                            {!noStatus && item?.zip_codes?.length > 8 && (
                                <Tooltip
                                    title={item.zip_codes.map((zc, i) => (
                                        <span key={i} style={{ borderRight: "1px solid white", padding: "0 2px" }}>
                                            {zc}
                                        </span>
                                    ))}
                                >
                                    <Typography sx={{ cursor: "pointer" }}>more..</Typography>
                                </Tooltip>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        );
    });
}
