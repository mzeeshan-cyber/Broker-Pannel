// material-ui
import Grid from '@mui/material/Grid';
import Loader from 'components/Loader';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/providers/drivers/driver-doc-columns';

export default function DriverDocuments({data, loading}) {
  return (
    <Grid>
      {loading ?
        <Loader />
        :
        <CommonTable
          data={data}
          defaultColumns={columns}
          noPagination={true}
        />
      }
    </Grid>
  );
}
