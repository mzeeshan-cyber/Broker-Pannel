import { Page, View, Document, StyleSheet } from '@react-pdf/renderer';
import Header from './Header';
import Content from './Content';

const styles = StyleSheet.create({
  page: { padding: 30 },
  container: { flex: 1, flexDirection: 'row', '@media max-width: 400': { flexDirection: 'column' } }
});

// ==============================|| INVOICE EXPORT  ||============================== //

export default function ExportPDFView({ data, personal_driver_cost, reimbursementTripRate }) {

  return (
    <Document title={`Reimbursement trip invoice`}>
      <Page size="A4" style={styles.page}>
        <Header list={data} />
        <View style={styles.container}>
          <Content data={data} personal_driver_cost={personal_driver_cost} reimbursementTripRate={reimbursementTripRate}/>
        </View>
      </Page>
    </Document>
  );
}

