import React, { useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    FormHelperText,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Add, Trash } from 'iconsax-react';
import { Formik, Form, FieldArray } from "formik";
import { openSnackbar } from "api/snackbar";
import { useEffect } from "react";
import { fetcher } from "utils/axios";
import axios from "axios";
import * as Yup from 'yup';
import { decryptToken } from "utils/tokenUtils";
import { useTheme } from "@emotion/react";

const options = ["true", "false"];

export default function DocumentDetails() {
    const [docData, setDocData] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const theme = useTheme()

    const simplifiedDocs = docData.map(({ document_name, required }) => ({
        document_name,
        required: required.toString(),
    }));
    const initialValues = {
        documents: [
            ...simplifiedDocs
        ],
    };

    const getDocumentsData = async () => {
        const response = await fetcher(["/get-provider-credentials"]);
        if (response.status === true) {
            setDocData(response?.data);
            openSnackbar({
                open: true,
                message: response.message || 'data is fetched',
                variant: 'alert',
                alert: { color: 'success' }
            });
        }
    };

    const postDocuments = async (data) => {
        setLoading(true)
        axios.post(`${API_URL}save-broker-provider-credentials`, data,
            {
                headers: {
                    'Authorization': `Bearer ${decryptedToken}`,
                }
            }
        )
            .then(response => {
                setErrorMsg('')
                openSnackbar({
                    open: true,
                    message: response.data.message || `Documents saved successfully`,
                    variant: 'alert',

                    alert: {
                        color: 'success'
                    }
                });
                setLoading(false)
            })
            .catch(error => {
                setErrorMsg(error.response.data.message)
                setLoading(false)
            });
    }

    const handleSubmit = (values) => {
        postDocuments(values)
    };

    useEffect(() => {
        getDocumentsData()
    }, [])

    return (
        <>
            <Box sx={{ pb: 2 }}>
                <Typography variant="h5">Add Documents</Typography>
            </Box>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}
                validationSchema={Yup.object().shape({
                    documents: Yup.array().of(
                        Yup.object().shape({
                            document_name: Yup.string().max(255).required('Document name is required'),
                            required: Yup.string().required('Status is required'),
                        })
                    ).min(0)
                })}

                enableReinitialize>
                {({ values, handleChange, errors, touched }) => (
                    <Form>
                        <FieldArray name="documents">
                            {({ push, remove }) => (
                                <>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>#</TableCell>
                                                <TableCell>Document Name</TableCell>
                                                <TableCell>Required</TableCell>
                                                <TableCell align="center">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {values?.documents?.length <= 0 &&
                                                <TableRow>
                                                    <TableCell colSpan={4}>No documents</TableCell>
                                                </TableRow>
                                            }
                                            {values.documents.map((field, index) => (
                                                <TableRow
                                                    key={index}
                                                >
                                                    <TableCell>
                                                        {values.documents.indexOf(field) + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            label=""
                                                            placeholder="Document Name"
                                                            name={`documents[${index}].document_name`}
                                                            value={field.document_name}
                                                            onChange={handleChange}
                                                            fullWidth
                                                        />
                                                        {touched.documents?.[index]?.document_name && errors.documents?.[index]?.document_name && (
                                                            <FormHelperText error id="helper-text-document_name">
                                                                {errors.documents?.[index]?.document_name}
                                                            </FormHelperText>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            name={`documents[${index}].required`}
                                                            value={field.required}
                                                            onChange={handleChange}
                                                            displayEmpty
                                                            fullWidth
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Choose Option
                                                            </MenuItem>
                                                            {options.map((opt, i) => (
                                                                <MenuItem key={i} value={opt}>
                                                                    {opt}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {touched.documents?.[index]?.required && errors.documents?.[index]?.required && (
                                                            <FormHelperText error id="helper-text-required">
                                                                {errors.documents?.[index]?.required}
                                                            </FormHelperText>
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => {
                                                                const updatedDocuments = values.documents.filter((_, i) => i !== index);
                                                                postDocuments({ documents: updatedDocuments.length > 0 ? updatedDocuments : values.documents });
                                                                remove(index);
                                                            }}
                                                        // disabled={values.documents.length === 1}
                                                        >
                                                            <Trash />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Box>
                                        <Typography color={'error'}>
                                            {errorMsg}
                                        </Typography>
                                    </Box>

                                    <Button
                                        type="button"
                                        variant="outlined"
                                        startIcon={<Add />}
                                        onClick={() => push({ document_name: "", required: "" })}
                                        sx={{ my: 2 }}
                                    >
                                        Add More
                                    </Button>
                                </>
                            )}
                        </FieldArray>
                        {values?.documents?.length > 0 &&
                            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                <Button disableElevation disabled={loading} variant="contained" type="submit" sx={{
                                    '&.Mui-disabled': {
                                        bgcolor: theme.palette.primary.main,
                                    }
                                }}>
                                    {loading ? (
                                        <CircularProgress sx={{ height: '20px !important', width: '20px !important', color: 'white' }} />
                                    ) : (
                                        'Submit'
                                    )}
                                </Button>
                            </Box>
                        }
                    </Form>
                )}
            </Formik>
        </>
    );
}
