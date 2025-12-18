import { useMemo } from "react";
import { IconButton, Avatar, Select, MenuItem, Chip } from "@mui/material";
import { ArrowDown2, ArrowRight2, CloseCircle } from "iconsax-react";
// import { getImageUrl, ImagePath } from "../utils"; // Adjust path based on your structure
// import EditAction from "../../../../components/EditAction"; // Adjust import if needed
// import { reimbursementDriverStatuses } from "../constants/statuses"; // Adjust import if needed
import { getImageUrl, ImagePath } from "utils/getImageUrl";
import { reimbursementDriverStatuses } from "constants/constants";

export const driverTableColumns = (handleChange, actions) => {
  return useMemo(
    () => [
      {
        id: "expander",
        enableGrouping: false,
        header: () => null,
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <IconButton
              color={row.getIsExpanded() ? "primary" : "secondary"}
              onClick={row.getToggleExpandedHandler()}
              size="small"
            >
              {row.getIsExpanded() ? (
                <ArrowDown2 size="32" variant="Outline" />
              ) : (
                <ArrowRight2 size="32" variant="Outline" />
              )}
            </IconButton>
          ) : (
            <IconButton color="secondary" size="small" disabled>
              <CloseCircle />
            </IconButton>
          ),
      },
      {
        id: "avatar",
        header: "Avatar",
        accessorKey: "driver_image",
        enableColumnFilter: false,
        enableGrouping: false,
        cell: (cell) => (
          <Avatar
            alt={cell.getValue()}
            size="sm"
            src={getImageUrl(`avatar-${cell.getValue()}.png`, ImagePath.USERS)}
          />
        ),
        meta: { className: "cell-center" },
      },
      {
        id: "name",
        header: "Attendent Name",
        footer: "Name",
        accessorKey: "attendant_name",
        dataType: "text",
        enableGrouping: false,
      },
      {
        id: "phone",
        title: "Phone",
        header: "Phone",
        accessorKey: "phone_number",
        dataType: "text",
        enableColumnFilter: false,
        enableGrouping: false,
        meta: { className: "cell-center" },
      },
      {
        id: "relationship",
        title: "Relationship",
        header: "Relationship",
        accessorKey: "relationship",
        dataType: "text",
        enableColumnFilter: false,
        enableGrouping: false,
        meta: { className: "cell-center" },
      },
      {
        id: "status",
        header: "Status",
        footer: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          return (
            <Select
              labelId="editable-select-label"
              sx={{ "& .MuiOutlinedInput-input": { py: 0.75, px: 1 } }}
              id={`editable-select-${row.original.id}`}
              value={row.original.status} // Use row-specific value
              onChange={(event) => handleChange(event, row.original.id)}
              size="small"
            >
              {reimbursementDriverStatuses.map((item, index) => (
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
          );
        },
        dataType: "select",
      },
      {
        id: "edit",
        header: "Actions",
        cell: actions,
        enableGrouping: false,
        meta: { className: "cell-center" },
      },
    ],
    [handleChange]
  );
};
