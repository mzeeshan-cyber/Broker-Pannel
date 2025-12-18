// Patients Module
export const mobilities = [
  { value: "wheelchair", label: "Wheelchair" },
  { value: "walks", label: "Walks" },
  { value: "walker", label: "Walker" },
  { value: "sedan", label: "Sedan" },
  { value: "mini_van", label: "MiniVan" },
  { value: "cane", label: "Cane" },
  { value: "wheelchair_transferrable", label: "Wheelchair/Transferrable" },
  { value: "stretcher", label: "Stretcher" },
  { value: "secure_transportation", label: "Secure Transportation" }
];
export const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const fundingSources = [
  { value: "ihn", label: "IHN", fullName: "InterCommunity Health Network" },
  { value: "ohp", label: "OHP", fullName: "Oregon Health Plan" },
  { value: "veteran", label: "Veteran", fullName: "Veterans Assistance Program" },
  { value: "wks", label: "WKS", fullName: "Workers' Compensation Support" }
];
export const userStatuses = [
  { name: "active", label: "Active", color: "success" },
  { name: "inactive", label: "Inactive", color: "info" },
  { name: "banned", label: "Banned", color: "error" },
  { name: "suspended", label: "Suspended", color: "warning" },
  { name: "pending", label: "Pending", color: "secondary" }
];
export const reimbursementDriverStatuses = [
  { name: "approved", label: "Approved", color: "success" },
  { name: "rejected", label: "Rejected", color: "error" },
  { name: "pending", label: "Pending", color: "secondary" }
];
export const AttendentStatus = [
  { name: "active", label: "Active", color: "success" },
  { name: "inactive", label: "Inactive", color: "error" }
];

export const usStates = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" }
];

export const paymentMethods = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "check", label: "Check" },
  { value: "paypal", label: "Paypal" },
  { value: "venmo", label: "Venmo" },
  { value: "cashapp", label: "Cashapp" },
  { value: "zelle", label: "Zelle" },
  { value: "stripe", label: "Stripe" },
  { value: "google_pay", label: "Google Pay" },
  { value: "apple_pay", label: "Apple Pay" },
  { value: "money_order", label: "Money Order" },
  { value: "cash", label: "Cash" },
];

// 
// Provider
export const providerStatuses = [
  { name: "active", label: "Active", color: "success" },
  { name: "inactive", label: "Inactive", color: "info" },
  { name: "banned", label: "Banned", color: "error" },
  { name: "suspended", label: "Suspended", color: "warning" },
  { name: "pending", label: "Pending", color: "secondary" }
];
export const registrationDocumentsStatus = [
  { name: "approved", label: "Approved", color: "success" },
  { name: "rejected", label: "Rejected", color: "error" },
  { name: "pending", label: "Pending", color: "secondary" },
  { name: "expired", label: "Expired", color: "info" },
];
export const registrationDocumentsStatusForm = [
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "pending", label: "Pending" },
  { value: "expired", label: "Expired" },
];

export const documentStatus = [
  { name: "required", label: "Required", color: "error" },
  { name: "optional", label: "Optional", color: "success" }
];

export const vehicleStatus = [
  { value: "unassigned", label: "Unassigned" },
  { value: "assigned", label: "Assigned" },
  { value: "disapproved", label: "Disapproved" },
  { value: "approved", label: "Approved" }
];
export const vehicleType = [
  { value: "sedan", label: "Sedan" },
  { value: "wheelchair", label: "Wheelchair" },
];
export const inspectionType = [
  { value: "pre_trip", label: "Pre trip" },
  { value: "post_trip", label: "Post trip" },
  { value: "others", label: "Others" },
];

// rate lists
export const ratelistStatuses = [
  { name: "approved", label: "Approved", color: "success" },
  { name: "pending", label: "Pending", color: "secondary" }
];

// Trips
export const allowanceType = [
  { value: '1', label: "Yes" },
  { value: '0', label: "No" },
];

export const repeating = [
  { value: '1', label: "Yes" },
  { value: '0', label: "No" },
];

export const days = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' }
];
export const tripAllowances = [
  { value: 'allowance_breakfast', label: 'Breakfast Allowance' },
  { value: 'allowance_lunch', label: 'Lunch Allowance' },
  { value: 'allowance_dinner', label: 'Dinner Allowance' },
  { value: 'allowance_lodging', label: 'Lodging Allowance' },
];
export const reimbursementAllowances = (isRepeating) => [
  { value: 'personal_driver', label: 'Personal Driver' },
  {
    value: 'bus_ticket',
    label: 'Tickets',
    disabled: isRepeating,
  },
];

export const tickets = [
  { value: 'bus', label: 'Bus' },
  { value: 'train', label: 'Train' },
  { value: 'air', label: 'Air' },
];
export const facilityNames = [
  { value: 'pickup', label: 'Pickup' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'appointment', label: 'Appointment' },
  { value: 'others', label: 'Others' },
];
export const travelThrough = (mobility) => {
  const isTickets = mobility.includes("bus_ticket");
  const isPersonalDriver = mobility.includes("personal_driver");

  if (isTickets && isPersonalDriver) {
    return [
      { value: "air", label: "Air" },
      { value: "bus", label: "Bus" },
      { value: "train", label: "Train" },
      { value: "personal_driver", label: "Personal Driver" },
    ];
  }

  if (isTickets) {
    return [
      { value: "air", label: "Air" },
      { value: "bus", label: "Bus" },
      { value: "train", label: "Train" },
    ];
  }

  if (isPersonalDriver) {
    return [{ value: "personal_driver", label: "Personal Driver" }];
  }

  return [];
};

export const pickupFacilityNamesAddTrip = [
  { value: 'home', label: 'Home' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'hospital', label: 'Hospital' },
];
export const dropoffFacilityNamesAddTrip = [
  { value: 'home', label: 'Home' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'hospital', label: 'Hospital' },
];

export const TripStatuses = [
  { name: "completed", label: "Completed", color: "success" },
  { name: "approved", label: "Approved", color: "info" },
  { name: "pending", label: "Pending", color: "secondary" },
  { name: "cancel_by_patient", label: "Cancel By Patient", color: "warning" },
  { name: "cancel_by_broker", label: "Cancel By Broker", color: "warning" },
  { name: "rejected", label: "Rejected", color: "error" },
  { name: "assigned", label: "Assigned", color: "success" },
  { name: "en_route_to_dropoff", label: "Enroute to dropoff", color: "secondary" },
  { name: "en_route_to_pickup", label: "Enroute to pickup", color: "primary" },
  { name: "arrived_at_pickup_location", label: "Arrived Pickup", color: "secondary" },
  { name: "reached_at_destination", label: "Reached at destination", color: "success" },
  { name: "picked", label: "Picked", color: "primary" },
  { name: "no_show", label: "No show", color: "error" },
];
export const PendingTripStatuses = [
  { name: "approved", label: "Approved", color: "info" },
  { name: "pending", label: "Pending", color: "secondary" },
  { name: "rejected", label: "Rejected", color: "error" },
];
export const TripStatusesUPdate = [
  { value: "completed", label: "Completed" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "cancel_by_patient", label: "Cancel By Patient" },
  { value: "pending_for_review", label: "Pending For Review" },
  { value: "return_to_patient_for_rebilling", label: "Return To Patient For Rebilling" },
  { value: "cancel_by_broker", label: "Cancel By Broker" },
  { value: "rejected", label: "Rejected" },
];

export const mobility = [
  { value: 'sedan', label: "Sedan" },
  { value: 'wheelchair', label: "Wheelchair" },
  { value: 'minivan', label: "Mini Van" },
];
export const gender = [
  { value: 'any', label: "Any" },
  { value: 'male', label: "Male" },
  { value: 'female', label: "Female" },
];
export const hospitalDischarge = [
  { value: '1', label: "Yes" },
  { value: '0', label: "No" },
];
export const tripAttendant = [
  { value: '0', label: "0" },
  { value: '1', label: "1" },
  { value: '2', label: "2" },
  { value: '3', label: "3" },
  { value: '4', label: "4" },
  { value: '5', label: "5" },
];
export const tripBoasterSeats = [
  { value: '0', label: "0" },
  { value: '1', label: "1" },
  { value: '2', label: "2" },
  { value: '3', label: "3" },
  { value: '4', label: "4" },
  { value: '5', label: "5" },
];

export const tripTypeFilter = [
  {value : 'single_trips', label: 'Single'},
  {value : 'round_trips', label: 'Round Trip'},
  {value : 'shared_trips', label: 'Shared Trips'},
  {value : 'round_shared_trips', label: 'Shared Return Trips'}
]

export function getStatusColor(status) {
  let color;

  switch (status?.toLowerCase()) {
    case "active":
      color = "success";
      break;
    case "approved":
      color = "success";
      break;
    case "banned":
      color = "error";
      break;
    case "rejected":
      color = "error";
      break;
    case "suspended":
      color = "warning";
      break;
    case "inactive":
      color = "info";
      break;
    case "pending":
      color = "secondary";
      break;
    case "pending":
      color = "secondary";
      break;
    default:
      color = "secondary";
  }

  return color;
}

export function dateFormate(date) {
  const [datePart, timePart] = date.split(' ');
  const [day, month, year] = datePart.split('-');
  return `${year}-${month}-${day} ${timePart}`;

}

