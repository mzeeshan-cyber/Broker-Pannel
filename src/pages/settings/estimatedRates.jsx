import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import { openSnackbar } from "api/snackbar";
import { fetcher } from "utils/axios";
import axios from "axios";
import { decryptToken } from "utils/tokenUtils";
import CircularLoader from "components/common/loader/CircularLoader";
import { toLower } from "lodash";
import { useTheme } from "@emotion/react";

export default function EstimatedRates() {
    const [vehicleData, setVehicleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme()

    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);

    // List of expected vehicle types
    const defaultVehicleTypes = ["sedan", "wheelchair", "minivan"];

    const initialValues = {
        rates: defaultVehicleTypes.map((type) => {
            // Check if API returned this vehicle
            const vehicle = vehicleData.find(
                (v) => toLower(v.vehicle_type) === type
            );
            return {
                vehicle_type: type,
                estimated_rate: vehicle ? vehicle.rate : 0,
            };
        }),
    };

    // Fetch vehicle rates
    const getVehicleRatesData = async () => {
        setIsLoading(true);
        try {
            const response = await fetcher(["/get-trip-rates"]);
            if (response.status === true) {
                setVehicleData(response?.data);
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || "Something went wrong",
                variant: "alert",
                alert: { color: "error" },
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Post data to API
    const postDocuments = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}store-trip-rate`,
                { trip_rates: data },
                {
                    headers: { Authorization: `Bearer ${decryptedToken}` },
                }
            );

            openSnackbar({
                open: true,
                message: response.data.message || "Vehicle rates uploaded successfully",
                variant: "alert",
                alert: { color: "success" },
            });
        } catch (error) {
            openSnackbar({
                open: true,
                message: "Something went wrong!",
                variant: "alert",
                alert: { color: "error" },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (values) => {
        const payload = values.rates.map((rate) => ({
            vehicle_type: rate.vehicle_type,
            estimated_rate: rate.estimated_rate,
        }));
        postDocuments(payload);
    };

    useEffect(() => {
        getVehicleRatesData();
    }, []);

    return (
        <>
            <Box sx={{ pb: 2 }}>
                <Typography variant="h5">Vehicles Estimated Rates</Typography>
            </Box>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
                {({ values, handleChange }) => (
                    <Form>
                        {isLoading ? (
                            <CircularLoader height="300px" />
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Vehicle Type</TableCell>
                                        <TableCell>Rates ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {values.rates.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <TextField
                                                    name={`rates[${index}].vehicle_type`}
                                                    value={row.vehicle_type}
                                                    fullWidth
                                                    aria-readonly
                                                    style={{ cursor: "disabled" }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    placeholder="Enter Rate"
                                                    name={`rates[${index}].estimated_rate`}
                                                    value={row.estimated_rate}
                                                    type="number"
                                                    onChange={handleChange}
                                                    fullWidth
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
                            <Button
                                disableElevation
                                disabled={loading}
                                variant="contained"
                                type="submit"
                                sx={{
                                    '&.Mui-disabled': {
                                        bgcolor: theme.palette.primary.main,
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress
                                        sx={{
                                            height: "20px !important",
                                            width: "20px !important", color: 'white'
                                        }}
                                    />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </>
    );
}
