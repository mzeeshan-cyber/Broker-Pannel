import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Checkbox,
  Stack,
} from "@mui/material";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { Font } from "@react-pdf/renderer";
import DejaVuSans from "../../../fonts/DejaVuSans.ttf";
import { openSnackbar } from "api/snackbar";
import { fetcher } from "utils/axios";
import { Link } from "react-router-dom";
import UploadVerificationForm from "./UploadVerificationForm";
import { FiAlertCircle } from "react-icons/fi";
import TransitionsModal from "sections/components-overview/modal/TransitionsModal";
import CircularLoader from "components/common/loader/CircularLoader";

Font.register({
  family: "DejaVuSans",
  src: DejaVuSans,
});


// ---------------- PDF STYLES ----------------
const styles = StyleSheet.create({
  tickText: {
    fontFamily: "DejaVuSans",
    fontSize: 10,
  },
  page: {
    fontSize: 9,
    padding: 20,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bold: { fontWeight: "bold" },
  border: {
    borderWidth: 1,
    borderColor: "#000",
  },
  tableHeader: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
  },
  th: {
    borderRight: 1,
    borderColor: "#000",
    padding: 3,
    textAlign: "center",
    flexGrow: 1,
  },
  tr: {
    flexDirection: "row",
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 1,
    borderColor: "#000",
    minHeight: 50,
  },
  td: {
    flexGrow: 1,
    borderRight: 1,
    borderColor: "#000",
    padding: 3,
  },
});

// ---------------- MAIN COMPONENT ----------------
const TripVerificationForm = () => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const tripId = localStorage.getItem("tripId");
  const IMAGE_URL = import.meta.env.VITE_SERVER_IMAGE_PATH;

  const getValidationFormData = async () => {
    setIsLoading(true);
    const params = {
      id: tripId,
    }
    try {
      const response = await fetcher(["/view-reimbursement-trip-form", { params }]);
      if (response.status === true) {
        setIsLoading(false);
        setFormData(response.data);

      } else {
        setIsLoading(false);
        openSnackbar({
          open: true,
          message: response.message || 'Failed to fetch validation forms data',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    } catch (error) {
      setIsLoading(false);
      const res = response.Json();
      openSnackbar({
        open: true,
        message: res.message || 'Something went wrong',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
    finally{
      setIsLoading(false);
    }

  };

  useEffect(() => {
    getValidationFormData();
  }, []);

  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const totalDistance = formData?.trips?.reduce(
    (sum, item) => sum + Number(item.trip_distance || 0),
    0
  );
  // ---------------- PDF GENERATION ----------------
  const generatePDF = async () => {

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* ---------- HEADER SECTION ---------- */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <View style={{ flexBasis: "40%" }}>
              <Text style={{ fontSize: 13, fontWeight: "bold" }}>APPOINTMENT VERIFICATION</Text>
              <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                Please complete and return by mail
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", marginBottom: 3 }}>
                <Text style={{ width: "45%", fontWeight: "bold" }}>CLIENT NAME:</Text>
                <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                  {formData.client_detail.name}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 3 }}>
                <Text style={{ width: "25%", fontWeight: "bold" }}>PHONE:</Text>
                <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                  {formData.client_detail.phone}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 3 }}>
                <Text style={{ width: "35%", fontWeight: "bold" }}>HOME ADDRESS:</Text>
                <Text
                  style={{
                    borderBottom: 1,
                    borderColor: "#000",
                    flex: 1,
                    paddingLeft: 3,
                  }}
                >
                  {formData.client_detail.address}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 3 }}>
                <Text style={{ width: "15%", fontWeight: "bold" }}>CITY:</Text>
                <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                  {formData.client_detail.city}
                </Text>
                <Text style={{ width: "10%", marginLeft: 10, fontWeight: "bold" }}>ZIP:</Text>
                <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                  {formData.client_detail.zip}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: "35%", fontWeight: "bold" }}>OHP+ NUMBER:</Text>
                <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                  {formData?.client_detail?.number || '123'}
                </Text>
                <Text style={{ width: "35%", marginLeft: 10, fontWeight: "bold" }}>DATE OF BIRTH:</Text>
                <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                  {formData.client_detail.date_of_birth}
                </Text>
              </View>
            </View>
          </View>

          {/* ---------- TABLE HEADER ---------- */}
          <View style={{ flexDirection: "row", backgroundColor: "#d4d4d4", borderWidth: 1 }}>
            {[
              "DATE of appointment",
              "TIME of appointment",
              "REASON for appointment",
              "PHYSICIAN/CLINIC NAME & ADDRESS",
              "PHYSICIAN/CLINIC PHONE",
              "PHYSICIAN OR CLINIC SIGNATURE AND STAMP",
              "MILEAGE (RideLine)",
            ].map((h, idx) => (
              <Text
                key={idx}
                style={{
                  flex: [1, 1.1, 1, 2.5, 1.4, 2.8, 1.3][idx],
                  borderRight: idx !== 6 ? 1 : 0,
                  borderColor: "#000",
                  padding: 4,
                  fontSize: 8,
                  fontWeight: "bold",
                }}
              >
                {h}
              </Text>
            ))}
          </View>

          {/* ---------- DATA ROWS ---------- */}
          {formData?.trips?.map((a, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                borderLeft: 1,
                borderRight: 1,
                borderBottom: 1,
                borderColor: "#000",
              }}
            >
              <Text style={{ flex: 1, padding: 4 }}>{a.date_of_appointment || '--'}</Text>

              {/* TIME CHECKBOXES */}
              <View style={{
                flex: 1.1,
                padding: 4,
                borderLeft: 1,
                borderRight: 1,
                borderColor: "#000",
              }}>
                <Text style={{ marginBottom: '7px' }}>Check one:</Text>
                <Text style={styles.tickText}>{a.time_of_appointment < "12:00" ? "AM ☑" : "AM ☐"}</Text>
                <Text style={styles.tickText}>{a.time_of_appointment > "12:00" ? "PM ☑" : "PM ☐"}</Text>
              </View>

              <Text style={{ flex: 1, padding: 4 }}>{a.reason_of_appointment || '--'}</Text>

              <View style={{
                flex: 2.5, padding: 4,
                borderLeft: 1,
                borderRight: 1,
                borderColor: "#000",
              }}>
                <Text style={{ fontWeight: "bold" }}>{a.clinic_name || '--'}</Text>
                <Text>{a.clinic_or_office_address || '--'}</Text>
              </View>

              <Text style={{
                flex: 1.4, padding: 4,
              }}>{a.clinic_phone || '--'}</Text>

              <View style={{
                flex: 2.8, padding: 4,
                borderLeft: 1,
                borderRight: 1,
                borderColor: "#000",
              }}>
                <Text style={{ borderBottom: 1, borderColor: "#000" }}>{a.clinic_or_physician_signature || '--'}</Text>
                <Text style={{ fontSize: 8, marginTop: 2 }}>
                  Physician / Office Rep Signature Date
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    backgroundColor: "#f8f8f8",
                    padding: 3,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 8, color: "#777" }}>
                    Clinic / Physician Stamp Here
                  </Text>
                </View>
              </View>

              <View style={{
                flex: 1.3, padding: 4,
              }}>
                <Text style={{ marginBottom: '7px' }}>Check one:</Text>
                <Text style={styles.tickText}>{a.location_points[index].address !== a.location_points[a.location_points.length - 1].address ? "One way ☑" : "One way ☐"}</Text>
                <Text style={styles.tickText}>{a.location_points[index].address === a.location_points[a.location_points.length - 1].address ? "Round trip ☑" : "Round trip ☐"}</Text>
              </View>
            </View>
          ))}

          {/* ---------- FOOTER SECTION ---------- */}
          <View style={{ marginTop: 10, padding: 5, flexDirection: "row" }}>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              MILEAGE to be calculated by RideLine using mapping software
            </Text>
            <View style={{ flexDirection: "column", marginLeft: 'auto' }}>
              <Text style={{ fontSize: 9, fontWeight: "medium" }}>
                To be completed by RideLine:
              </Text>
              <Text style={{ fontSize: 9, marginTop: 4, fontWeight: "medium" }}>
                Total mileage both pages: <Text style={{ borderBottom: 1, borderColor: "#000", padding: "0 30px" }}>{totalDistance} miles</Text>
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 10, borderWidth: 1, borderColor: "#999", backgroundColor: "#dddcdc", padding: 5 }}>
            <Text style={{ fontSize: 9, fontWeight: "medium" }}>
              MILEAGE to be calculated by RideLine using mapping software Please complete one section for each of your appointments. Have each appointment entry
              signed by your healthcare provider. Return the form with your healthcare providers’
              original signatures (no copies or faxes). To receive travel reimbursement, we must
              receive this form within 45 days of your appointment. Trips older than 45 days are not
              eligible for payment. Mail form to: CASCADES WEST RIDELINE 1400 Queen Ave SE Suite 205 Albany, OR 97322 541-924-8738
            </Text>
            <Text style={{ fontSize: 9, marginTop: 6, fontWeight: "medium" }}>
              For lodging reimbursement, please attach your original lodging receipt to this form
            </Text>
          </View>

          {/* ---------- SIGNATURE SECTION ---------- */}
          <View style={{ marginTop: 8 }}>
            <View style={{ flexDirection: "row", marginBottom: 3 }}>
              <Text style={{ width: "45%", fontWeight: "bold" }}>Client/Guardian Signature:</Text>
              <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                {formData.client_detail.name}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 3 }}>
              <Text style={{ width: "20%", fontWeight: "bold" }}>PHONE:</Text>
              <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                {formData.client_detail.phone}
              </Text>
              <Text style={{ width: "15%", marginLeft: 10, fontWeight: "bold" }}>DATE:</Text>
              <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                {localDate}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginBottom: 3 }}>
              <Text style={{ width: "55%", fontWeight: "bold" }}>
                Mailing Address (if different):
              </Text>
              <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                {formData.client_detail.address}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginBottom: 3 }}>
              <Text style={{ width: "20%", fontWeight: "bold" }}>CITY:</Text>
              <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                {formData.client_detail.city}
              </Text>
              <Text style={{ width: "10%", marginLeft: 10, fontWeight: "bold" }}>ZIP:</Text>
              <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                {formData.client_detail.zip}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 3 }}>
              <Text style={{ width: "30%", fontWeight: "bold" }}>PAYEE NAME:</Text>
              <Text style={{ borderBottom: 1, borderColor: "#000", flex: 1, paddingLeft: 3 }}>
                {formData.client_detail.payee}
              </Text>
            </View>
            <Text style={{ fontSize: 8, color: "red", marginTop: 3 }}>
              By signing this form, you are verifying the information provided is true.
            </Text>
          </View>
        </Page>
      </Document>
    );

    const blob = await pdf(doc).toBlob();
    saveAs(blob, "Appointment_Verification.pdf");
  };

  const clinicSignature = formData?.trips?.find((item) => item.id == tripId)?.clinic_or_physician_signature

  // ---------------- SCREEN UI ----------------
  return (
    <>
      {isLoading ?
        <CircularLoader/>
        :
        <>
          {(!formData?.reimbursement_form && !clinicSignature) &&
            <>
              <Paper
                sx={{
                  p: 3,
                  my: 2,
                  backgroundColor: "#fff4e5",
                  border: "1px solid #ffa726",
                  borderRadius: 2,
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box sx={{ color: "#fb8c00" }}>
                      <FiAlertCircle fontSize="large" />
                    </Box>
                  </Grid>

                  <Grid item xs>
                    <Typography variant="h6" fontWeight="bold">
                      Verification Form Missing
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      The highlighted trip in the table does not have a reimbursement verification record.
                      Would you like to upload the verification form for this trip, or view forms for other trips?
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                        Upload Verification Form
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
              <TransitionsModal
                openModal={openModal} setOpenModal={setOpenModal} noFooter={true}
              >
                <UploadVerificationForm tripId={tripId} />
              </TransitionsModal>
            </>
          }
          {formData?.reimbursement_form ?
            <Paper sx={{ p: 4, my: 1 }}>
              <Box sx={{ display: 'flex', gap: '20px' }}>
                <Box sx={{ flexBasis: "40%" }}>
                  <Typography variant="h4" fontWeight="bold">
                    APPOINTMENT VERIFICATION
                  </Typography>
                  <Typography variant="body" fontWeight="bold">A verification form is provided below — you can download it using the button below.</Typography>
                </Box>

              </Box>
              <Button
                component={Link}
                target="_blank"
                to={`${IMAGE_URL}${formData?.reimbursement_form}`}
                variant="contained"
                color="primary"
                sx={{ textDecoration: "none", marginTop: "10px" }}
              >
                Download Verification Form
              </Button>
            </Paper>
            :
            <Paper sx={{ p: 4, my: 1 }}>
              <Box sx={{ display: 'flex', gap: '20px' }}>
                <Box sx={{ flexBasis: "40%" }}>
                  <Typography variant="h4" fontWeight="bold">
                    APPOINTMENT VERIFICATION
                  </Typography>
                  <Typography variant="body" fontWeight="bold">Please complete and return by mail</Typography>
                </Box>

                <Box sx={{ flex: '1' }}>
                  <Grid container>
                    <Grid item xs={8}>
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap" }} fontWeight="medium">CLIENT NAME:</Typography>
                        <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", margin: '0 10px' }}>{formData?.client_detail?.name}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap" }} fontWeight="medium">PHONE:</Typography>
                        <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", marginLeft: '10px' }}>{formData?.client_detail?.phone}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap" }} fontWeight="medium">HOME ADDRESS:</Typography>
                        <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", display: "flex", marginLeft: '10px' }}>
                          <Typography sx={{ flex: '1' }}>{formData?.client_detail?.address}</Typography>
                          <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap", margin: '0 10px' }} fontWeight="medium">City:</Typography>
                          {formData?.client_detail?.city}
                          <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap", margin: '0 10px' }} fontWeight="medium">Zip:</Typography>
                          {formData?.client_detail?.zip}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap" }} fontWeight="medium">OHP+ Number:</Typography>
                        <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", margin: '0 10px' }}>{formData?.client_detail?.number || '123'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap" }} fontWeight="medium">DATE OF BIRTH:</Typography>
                        <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", marginLeft: '10px' }}>{formData?.client_detail?.date_of_birth}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

              </Box>

              {/* TABLE */}
              <Box sx={{ border: "1px solid black", marginTop: "10px" }}>
                {/* Header Row */}
                <Grid container sx={{ fontWeight: "medium", borderBottom: "1px solid black" }}>
                  {[
                    "Trip id",
                    "DATE of appointment",
                    "TIME of appointment",
                    "REASON for appointment",
                    "PHYSICIAN/CLINIC NAME & ADDRESS",
                    "PHYSICIAN/CLINIC PHONE",
                    "PHYSICIAN OR CLINIC SIGNATURE AND STAMP",
                    "MILEAGE to be calculated by RideLine using mapping software",
                  ].map((label, i) => (
                    <Grid
                      key={i}
                      item
                      xs={[1, 1, 1, 1, 2, 1.5, 3, 1.5][i]}
                      sx={{
                        borderRight: i !== 7 ? "1px solid black" : "none",
                        padding: "1px 5px",
                        background: "#d4d4d4ff"
                      }}
                    >
                      {label}
                    </Grid>
                  ))}
                </Grid>

                {/* Data Rows */}
                {formData?.trips?.map((a, index) => (
                  <Grid
                    key={index}
                    container
                    sx={{
                      borderBottom: index !== formData.trips.length - 1 ? "1px solid black" : "none",
                      fontSize: "12px",
                      background: a.id == tripId ? "#e0ebdcff" : "",
                    }}
                  >
                    <Grid item xs={1} sx={{ borderRight: "1px solid black", padding: "5px" }}>
                      {a.id || '--'}
                    </Grid>
                    <Grid item xs={1} sx={{ borderRight: "1px solid black", padding: "5px" }}>
                      {a.date_of_appointment || '--'}
                    </Grid>
                    <Grid item xs={1} sx={{ borderRight: "1px solid black", padding: "5px" }}>
                      <Typography fontSize="12px">Check one:</Typography>
                      <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                        <Typography fontSize="12px">AM</Typography>
                        <Checkbox color="secondary" checked={a.time_of_appointment < "12:00"} />
                      </Box>
                      <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                        <Typography fontSize="12px">PM</Typography>
                        <Checkbox color="secondary" checked={a.time_of_appointment > '12:00'} />
                      </Box>

                    </Grid>
                    <Grid item xs={1} sx={{ borderRight: "1px solid black", padding: "5px" }}>
                      {a.reason_of_appointment || '--'}
                    </Grid>
                    <Grid item xs={2} sx={{ borderRight: "1px solid black", padding: "5px" }}>
                      <b>{a.clinic_name || '--'}</b>
                      <br />
                      {a.clinic_or_office_address || '--'}
                    </Grid>
                    <Grid item xs={1.5} sx={{ borderRight: "1px solid black", padding: "5px" }}>
                      {a.clinic_phone || '--'}
                    </Grid>
                    <Grid item xs={3} sx={{ borderRight: "1px solid black", padding: "5px" }}>
                      <Typography sx={{ borderBottom: "2px solid #252525ff", textAlign: "center" }}>
                        {a.clinic_or_physician_signature || '--'}
                      </Typography>
                      <Typography fontWeight="500">
                        Physician / Office Rep Signature date
                      </Typography>
                      <Typography sx={{ borderBottom: "2px solid #eee", background: '#f8f7f7ff', color: '#acacacff', margin: '10px 30px', textAlign: 'center' }}>
                        Clinic/ Physician Stamp Here
                      </Typography>
                    </Grid>
                    <Grid item xs={1.5} sx={{ padding: "5px" }}>
                      <Typography fontSize="12px">Check one:</Typography>
                      <Box sx={{ display: "flex", alignItems: 'center', gap: '16px' }}>
                        <Typography fontSize="12px">One Way</Typography>
                        <Checkbox color="secondary" checked={a.location_points[index].address !== a.location_points[a.location_points.length - 1].address} />
                      </Box>
                      <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                        <Typography fontSize="12px">Round trip</Typography>
                        <Checkbox color="secondary" checked={a.location_points[0].address === a.location_points[a.location_points.length - 1].address} />
                      </Box>
                    </Grid>
                  </Grid>
                ))}
              </Box>

              <Grid container sx={{ padding: '12px 0' }}>
                <Grid item xs={8}>
                  <Typography fontWeight="700" variant="h4">MILEAGE to be calculated by RideLine using mapping software</Typography>
                </Grid>
                <Grid item xs={4} border="2px solid #9e9e9eff" padding="4px 10px">
                  <Typography fontWeight="500" fontSize="13px">
                    To be completed by RideLine:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Typography fontWeight="500" fontSize="13px">
                      Total mileage both pages
                    </Typography>
                    <Typography fontWeight="500" fontSize="13px" sx={{ borderBottom: "2px solid #252525ff", padding: '0 30px' }}>
                      {totalDistance} miles
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ border: "1px solid #252525ff", padding: "2px 8px", margin: "10px 0", background: "#dddcdcff" }}>
                  <Typography variant="h5">
                    Please complete one section for each of your appointments. Have each appointment entry signed by your healthcare provider. Return the
                    form with your healthcare providers’ original signatures (no copies or faxes). To receive travel reimbursement, we must receive this form
                    <Typography sx={{ textDecoration: "underline", display: "inline", marginLeft: "5px" }} variant="h5">within 45 days</Typography> of your appointment. Trips older than 45 days are not eligible for payment. Mail form to: <Typography sx={{ display: "inline", marginLeft: "2px", fontSize: "17px", fontWeight: "700" }}>CASCADES WEST RIDELINE </Typography>
                    1400 Queen Ave SE Suite 205 Albany, OR 97322 541-924-8738
                  </Typography>
                  <Typography variant="h5" sx={{ marginTop: "8px" }}>
                    For lodging reimbursement, please attach your original lodging receipt to this form
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', width: "100%" }}>
                    <Typography fontWeight="medium" sx={{ flexWrap: 'nowrap', textWrap: "nowrap" }}>Client/Guardian Signature:</Typography>
                    <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", margin: '0 10px' }}>{formData?.client_detail?.name}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap" }} fontWeight="medium">PHONE:</Typography>
                    <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", margin: '0 10px' }}>{formData?.client_detail?.phone}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap" }} fontWeight="medium">DATE:</Typography>
                    <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", margin: '0 10px' }}>{localDate}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <Box sx={{ display: 'flex', width: "100%" }}>
                    <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap", display: "flex", alignItems: "center", gap: "5px" }} fontWeight="medium"><Typography fontWeight="medium">Mailing Address</Typography> <Typography fontSize="12px">(if different from home address):</Typography></Typography>
                    <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", margin: '0 10px' }}>{formData?.client_detail?.address}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap" }} fontWeight="medium">City:</Typography>
                    <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", margin: '0 10px' }}>{formData?.client_detail?.city}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap" }} fontWeight="medium">Zip:</Typography>
                    <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", margin: '0 10px' }}>{formData?.client_detail?.zip}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6.5}>
                  <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap", fontSize: '12px', color: 'red', fontWeight: '500' }} fontWeight="medium">By signing this form, you are verifying the information provided is true.</Typography>
                </Grid>
                <Grid item xs={5.5}>
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Typography sx={{ flexWrap: 'nowrap', textWrap: "nowrap" }} fontWeight="medium">PAYEE NAME:</Typography>
                    <Typography sx={{ borderBottom: "2px solid #252525ff", height: "20px", width: "100%", margin: "0 10px" }}>{formData?.client_detail?.payee}</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Button variant="contained" sx={{ mt: 3 }} onClick={generatePDF}>
                Generate PDF
              </Button>
            </Paper>
          }
        </>
      }
    </>
  );
};

export default TripVerificationForm;
