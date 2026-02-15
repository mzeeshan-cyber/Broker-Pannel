
// assets
import { Car, I24Support, MessageProgramming, People, Setting2, SmartCar, Personalcard, Receipt, CalendarTick  } from 'iconsax-react';

const icons = {
  maintenance: MessageProgramming,
  contactus: I24Support,
  providers: People,
  reimbursementtrips: Car,
  settings: Setting2,
  trips: SmartCar,
  patient: Personalcard,
  billing: Receipt,
  complaints: I24Support,
  standingOrder: CalendarTick ,
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages = {
  id: 'group-pages',
  title: "pages",
  type: 'group',
  children: [
    {
      id: 'Patient',
      title: "Patient",
      type: 'collapse',
      icon: icons.patient,
      children: [
        {
          id: 'patients',
          title: "Patients",
          type: 'item',
          url: '/patients',
          target: false
        },
        {
          id: 'add-patient',
          title: "Add Patient",
          type: 'item',
          url: '/patients/add',
          target: false
        },
        {
          id: 'deleted-patients',
          title: "Deleted Patients",
          type: 'item',
          url: '/patients/deleted',
          target: false
        },
      ]
    },
    {
      id: 'Trips',
      title: "Trips",
      type: 'collapse',
      icon: icons.trips,
      children: [
        {
          id: 'Add Trip',
          title: "Add Trip",
          type: 'item',
          url: '/add-trip',
          target: false
        },
        {
          id: 'Pending Trips',
          title: "Pending Trips",
          type: 'item',
          url: '/pending-trips',
          target: false
        },
        {
          id: 'Assigned Trips',
          title: "Assigned Trips",
          type: 'item',
          url: '/assigned-trips',
          target: false
        },
        {
          id: 'Approved Trips',
          title: "Approved Trips",
          type: 'item',
          url: '/approved-trips',
          target: false
        },
        {
          id: 'Completed Trips',
          title: "Completed Trips",
          type: 'item',
          url: '/completed-trips',
          target: false
        },
        {
          id: 'Canceled / Rejected',
          title: "Canceled / Rejected",
          type: 'item',
          url: '/canceled-rejected-trips',
          target: false
        },
        {
          id: 'No Show',
          title: "No Show",
          type: 'item',
          url: '/no-show-trips',
          target: false
        },
        {
          id: 'Running Trips',
          title: "Running Trips",
          type: 'item',
          url: '/running-trips',
          target: false
        },
        {
          id: 'Manage Shared Trips',
          title: "Manage Shared Trips",
          type: 'item',
          url: '/shared-trips',
          target: false
        },
        {
          id: 'Deleted Trips',
          title: "Deleted Trips",
          type: 'item',
          url: '/deleted-trips',
          target: false
        },
      ]
    },
    {
      id: 'Provider',
      title: "Provider",
      type: 'collapse',
      icon: icons.providers,
      children: [
        {
          id: 'providers',
          title: "Providers",
          type: 'item',
          url: '/providers',
          target: false
        },
        {
          id: 'general-settings',
          title: "General Settings",
          type: 'item',
          url: '/providers/general-settings',
          target: false
        },
      ]
    },
    {
      id: 'Reimbursement Trips',
      title: "Reimbursement Trips",
      type: 'collapse',
      icon: icons.reimbursementtrips,
      children: [
        {
          id: 'Reimbursement Trips',
          title: "Reimbursement Trips",
          type: 'item',
          url: '/reimbursement-trips',
          target: false
        },
        {
          id: 'Add Reimbursement Trip',
          title: "Add Reimbursement Trip",
          type: 'item',
          url: '/reimbursement-trips/add',
          target: false
        },
        {
          id: 'Allowances',
          title: "Allowances",
          type: 'item',
          url: '/reimbursement-trips/allowances',
          target: false
        },
        {
          id: 'Reimbursement-rates',
          title: "Reimbursement Settings",
          type: 'item',
          url: '/reimbursement-trips/rates',
          target: false
        },
      ]
    },
    {
      id: 'Complaints',
      title: "Complaints",
      type: 'collapse',
      icon: icons.complaints,
      children: [
        {
          id: 'Complaints',
          title: "Complaints",
          type: 'item',
          url: '/complaints',
          target: false
        },
        {
          id: 'add complaint',
          title: "Add Complaint",
          type: 'item',
          url: '/complaints/add',
          target: false
        },
      ]
    },
    {
      id: 'Standing Orders',
      title: "Standing Orders",
      type: 'collapse',
      icon: icons.standingOrder,
      children: [
        {
          id: 'Standing Orders',
          title: "Standing Orders",
          type: 'item',
          url: '/standing-orders',
          target: false
        },
        {
          id: 'Add Standing Orders',
          title: "Add Standing Orders",
          type: 'item',
          url: '/standing-orders/add',
          target: false
        },
        {
          id: 'Deleted Standing Orders',
          title: "Deleted Standing Orders",
          type: 'item',
          url: '/standing-orders/deleted',
          target: false
        },
      ]
    },
    {
      id: 'Billings',
      title: "Billings",
      type: 'collapse',
      icon: icons.billing,
      children: [
        {
          id: 'Trips Invoice',
          title: "Trips Invoice",
          type: 'item',
          url: '/trips-invoice',
          target: false
        },
        // {
        //   id: 'Reimbursement Trip Invoice',
        //   title: "Reimbursement Trip Invoice",
        //   type: 'item',
        //   url: '/reimbursement-trips/add',
        //   target: false
        // },
      ]
    },
    {
      id: 'settings',
      title: "Settings",
      type: 'item',
      url: '/settings',
      icon: icons.settings,
      target: false
    },
    {
      id: 'Notification settings',
      title: "Notification Settings",
      type: 'item',
      url: '/notification-settings',
      icon: icons.settings,
      target: false
    },
  ]
};

export default pages;
