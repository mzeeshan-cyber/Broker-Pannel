import { Text, View, StyleSheet } from "@react-pdf/renderer";

// Colors
const textSecondary = "#8c8c8c";
const border = "#f0f0f0";

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, fontSize: 10, fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  logoText: { fontSize: 14, fontWeight: "bold" },
  chip: { fontSize: 8, color: "#fff", backgroundColor: "#4caf50", padding: 4, borderRadius: 3 },
  section: { marginBottom: 12 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  card: { border: `1px solid ${border}`, padding: 8, width: "48%" },
  cardTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  cardText: { fontSize: 10, color: textSecondary, marginBottom: 2 },
  row: { flexDirection: "row", marginBottom: 6 },
  col: { flexDirection: "column" },
  label: { fontSize: 10, fontWeight: "bold", width: "40%" },
  value: { fontSize: 10 },
  tableHeader: { flexDirection: "row", borderBottom: `1px solid ${border}`, backgroundColor: "#f5f5f5", padding: 6 },
  tableRow: { flexDirection: "row", borderBottom: `1px solid ${border}`, padding: 6 },
  cell: { fontSize: 10 },
  flex03: { flex: 0.3 },
  flex17: { flex: 1.7 },
  flex20: { flex: 2 },
  flex07: { flex: 0.7 },
  amountRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }
});

export default function Content({ data, reimbursementTripRate, personal_driver_cost }) {

  const invoice_detail = [
    { name: "Personal Driver Millage Cost", description: "Personal Driver millage cost calculated", price: (Number(personal_driver_cost) || 0) },
    { name: "Tickets Cost", description: "Tickets cost for trip", price: Number(data?.tickets_cost || 0) },
    { name: "Breakfast Allowance", description: "Breakfast expenses allowance", price: Number(data.allowance_breakfast || 0) },
    { name: "Lodging Allowance", description: "Lodging expenses allowance", price: Number(data.allowance_lodging || 0) },
    { name: "Lunch Allowance", description: "Lunch expenses allowance", price: Number(data.allowance_lunch || 0) },
    { name: "Dinner Allowance", description: "Dinner expenses allowance", price: Number(data.allowance_dinner || 0) },
    { name: "Extra Amount", description: "Other extra charges", price: Number(data.extra_amount || 0) },
  ];

  const total = Number(data.allowance_breakfast) + Number(data.allowance_dinner) + Number(data.allowance_lodging) + Number(data.allowance_lunch) + Number(data.extra_amount) + Number(data.tickets_cost) + Number(personal_driver_cost);

  return (
    <View style={styles.container}>

      {/* Trip Details */}
      <View style={styles.section}>
        <Text style={styles.cardTitle}>Trip Details:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Funding Source:</Text>
          <Text style={styles.value}>{data?.funding_source || "No"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Trip Duration:</Text>
          <Text style={styles.value}>{data?.duration || "0"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Trip Distance:</Text>
          <Text style={styles.value}>{data?.trip_distance || "0"} miles</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobility:</Text>
          <Text style={styles.value}>{data?.mobility?.map((m, i) => `${i + 1} - ${m.replace("_", " ")}`).join(", ") || "No"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Personal Driver Millage:</Text>
          <Text style={styles.value}>{data?.personal_driver_millage || "0"} miles</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Personal Driver Per Mile Rate :</Text>
          <Text style={styles.value}>$ {reimbursementTripRate || "0"}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.section}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableTitle, styles.flex03]}>#</Text>
          <Text style={[styles.tableTitle, styles.flex17]}>NAME</Text>
          <Text style={[styles.tableTitle, styles.flex20]}>DESCRIPTION</Text>
          <Text style={[styles.tableTitle, styles.flex07]}>AMOUNT</Text>
        </View>
        {invoice_detail.map((row, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.cell, styles.flex03]}>{index + 1}</Text>
            <Text style={[styles.cell, styles.flex17]}>{row.name}</Text>
            <Text style={[styles.cell, styles.flex20]}>{row.description}</Text>
            <Text style={[styles.cell, styles.flex07]}>${row.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.section}>
        <View style={styles.amountRow}>
          <Text style={styles.label}>Grand Total:</Text>
          <Text style={styles.value}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.cardTitle}>Notes:</Text>
        <Text style={styles.caption}>
          Thank you for choosing our services. We hope your trip was comfortable and look forward to serving you again.
        </Text>
      </View>
    </View>
  );
}
