// material-ui
import Grid from '@mui/material/Grid';
import Loader from 'components/Loader';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/providers/drivers/vehicles-table-columns';

export default function Vehicles({data, loading}) {
  return (
    <Grid>
      {loading ?
        <Loader />
        :
        <CommonTable
          data={data}
          defaultColumns={columns}
          noPagination={true}
          tableName="driver-vehicles"
        />
      }
    </Grid>
  );
}
