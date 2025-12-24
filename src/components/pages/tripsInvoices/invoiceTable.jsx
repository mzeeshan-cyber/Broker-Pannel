import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { columns } from './invoiceTableColumns';

const TripInvoicesTable = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                style={{
                  width: col.id === 'funding_source' ? 'auto' : 120,
                  minWidth: col.id === 'funding_source' ? 150 : 120,
                  whiteSpace: col.meta?.style?.whiteSpace || 'nowrap',
                }}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  style={{
                    width: col.id === 'funding_source' ? 'auto' : 120,
                    whiteSpace: col.meta?.style?.whiteSpace || 'nowrap',
                  }}
                >
                  {row[col.accessorKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TripInvoicesTable;
