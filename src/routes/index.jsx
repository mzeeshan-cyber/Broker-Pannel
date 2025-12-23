import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from 'layout/Auth';
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import { lazy } from 'react';
import Login from 'pages/auth/auth1/login';
import Register from 'pages/auth/auth1/register';
import ForgotPassword from 'pages/auth/auth1/forgot-password';
import CodeVerification from 'pages/auth/auth1/code-verification';
import CheckMail from 'pages/auth/auth1/check-mail';
import ResetPassword from 'pages/auth/auth1/reset-password';
import VerifyResetCode from 'pages/auth/auth1/verify-reset-code';
import DashboardDefault from 'pages/dashboard/Dashboard';
import Patients from 'pages/patient/patients';
import AddPatient from 'pages/patient/add-patient';
import UpdatePatient from 'pages/patient/update-patient';
import DeletedPatient from 'pages/patient/deleted-patients';
import ReimbursementDrivers from 'pages/reimbursement-drivers/reimbursement-drivers';
import AddReimbursementDriver from 'pages/reimbursement-drivers/add-reimbursement-driver';
import DeletedDrivers from 'pages/reimbursement-drivers/deleted-drivers';
import UpdateReimbursementDriver from 'pages/reimbursement-drivers/update-reimbursement-driver';
import Attendents from 'pages/attendents/attendents';
import AddAttendent from 'pages/attendents/add-attendent';
import UpdatePatientAttendent from 'pages/attendents/update-attendent';
import DeletedAttendents from 'pages/attendents/deleted-attendents';
import Payees from 'pages/payee/payees';
import AddPayee from 'pages/payee/add-payee';
import UpdatePayee from 'pages/payee/update-payee';
import DeletedPayees from 'pages/payee/deleted-Payees';
import Provider from 'pages/provider/provider';
import AddProvider from 'pages/provider/add-provider';
import DeletedProvider from 'pages/provider/deleted-provider';
import UpdateProvider from 'pages/provider/update-provider';
import ProviderGeneralInfo from 'pages/provider/provider-general-info';
import UpdateProviderGeneralInfo from 'pages/provider/update-provider-general-info';
import GeneralSettings from 'pages/provider/general-settings/general-settings';
import RegistrationDocs from 'pages/provider/registration-doc/registration-doc';
import AddRegistrationDocument from 'pages/provider/registration-doc/add-registration-docs';
import UpdateRegistrationDocument from 'pages/provider/registration-doc/update-registration-docs';
import Drivers from 'pages/drivers/drivers';
import DriverDetailPage from 'pages/drivers/detail-page/driver-detail-page';
import Vehicles from 'pages/vehicles/vehicles';
import VehicleDetailPage from 'pages/vehicles/detail-page/vehicle-detail-page';
import RateList from 'pages/provider/rate-list/rate-list-tabs';
import { AddReimbursementTrip } from 'pages/reimbursement-trips/add-trip';
import Allowances from 'pages/reimbursement-trips/allowances';
import ReimbursementRates from 'pages/reimbursement-trips/reimbursement-rates';
import { UpdateReimbursementTrip } from 'pages/reimbursement-trips/update-trip';
import DeletedReimbursementTrips from 'pages/reimbursement-trips/deleted-trips';
import Settings from 'pages/settings/settings';
import ReimbursementTrips from 'pages/reimbursement-trips/trips';
import { AddTrip } from 'pages/trips/add-trip';
import Trips from 'pages/trips/trips';
import TripVerificationForm from 'components/pages/reimbursement-trips/ReimbursementForm';
import { UpdateTrip } from 'pages/trips/update-trip';
import DeletedTrips from 'pages/trips/deleted-trips';
import PendingTrips from 'pages/trips/pendingTrips';
import ApprovedTrips from 'pages/trips/approvedTrips';
import CanceledTrips from 'pages/trips/canceledTrips';
import CompletedTrips from 'pages/trips/completedTrips';
import SharedTrips from 'pages/trips/sharedTrips';
import AssignedTrips from 'pages/trips/assignedTrips';
import RunningTrips from 'pages/trips/runningTrips';
import NoShowTrips from 'pages/trips/noShowTrips';
import Cities from 'pages/provider/cities/cities';
import AddCity from 'pages/provider/cities/addCity';
import BulkAssignment from 'pages/tables/broker-tables/trips/bulkAssignment';
import TripsInvoices from 'pages/billings/trips-invoice';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));

function Router() {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route path="*" element={<MaintenanceError />} />
                <Route index element={<Navigate to="/dashboard" />} />
                
                {/* Dashboard */}
                <Route path="/dashboard" element={<DashboardDefault />} />
                
                {/* Patients */}
                <Route path="/patients" element={<Patients />} />
                <Route path="/patients/add" element={<AddPatient />} />
                <Route path="/patients/:id/update" element={<UpdatePatient />} />
                <Route path="/patients/deleted" element={<DeletedPatient />} />
                
                {/* Reimbursement Drivers */}
                <Route path="/patients/:id/reimbursement-drivers" element={<ReimbursementDrivers />} />
                <Route path="/patients/:id/reimbursement-drivers/add" element={<AddReimbursementDriver />} />
                <Route path="/patients/:id/reimbursement-drivers/:reimbursement_drivers/update" element={<UpdateReimbursementDriver />} />
                <Route path="/patients/:id/reimbursement-drivers/deleted" element={<DeletedDrivers />} />
                
                {/* Patient Attendents */}
                <Route path="/patients/:patient_id/attendent" element={<Attendents />} />
                <Route path="/patients/:patient_id/attendent/add" element={<AddAttendent />} />
                <Route path="/patients/:patient_id/attendent/:attendent_id/update" element={<UpdatePatientAttendent />} />
                <Route path="/patients/:patient_id/attendent/deleted" element={<DeletedAttendents />} />
                
                {/* Patient Payees */}
                <Route path="/patients/:patient_id/payee" element={<Payees />} />
                <Route path="/patients/:patient_id/payee/add" element={<AddPayee />} />
                <Route path="/patients/:patient_id/payee/:payee_id/update" element={<UpdatePayee />} />
                <Route path="/patients/:patient_id/payee/deleted" element={<DeletedPayees />} />

                {/* Providers */}
                <Route path="providers" element={<Provider />} />
                <Route path="/providers/add" element={<AddProvider />} />
                <Route path="/providers/:provider_id/general-info" element={<ProviderGeneralInfo />} />
                <Route path="/providers/:provider_id/general-info/update" element={<UpdateProviderGeneralInfo />} />
                <Route path="/providers/:provider_id/update" element={<UpdateProvider />} />
                <Route path="/providers/deleted" element={<DeletedProvider />} />
                <Route path="/providers/general-settings" element={<GeneralSettings />} />
                <Route path="/providers/:provider_id/registration-documents" element={<RegistrationDocs />} />
                <Route path="/providers/:provider_id/registration-documents/add" element={<AddRegistrationDocument/>} />
                <Route path="/providers/:provider_id/registration-documents/:document_id/update" element={<UpdateRegistrationDocument/>} />
                {/* provider drivers */}
                <Route path="/providers/:provider_id/drivers" element={<Drivers />} />
                <Route path="/providers/:provider_id/drivers/:detail_id/detail" element={<DriverDetailPage />} />
                {/* provider vehicles */}
                <Route path="/providers/:provider_id/vehicles" element={<Vehicles />} />
                <Route path="/providers/:provider_id/vehicles/:detail_id/detail" element={<VehicleDetailPage />} />
                {/* provider ratelist */}
                <Route path="/providers/:provider_id/ratelist" element={<RateList/>} />
                {/* provider cities */}
                <Route path="/providers/:provider_id/cities" element={<Cities/>} />
                <Route path="/providers/:provider_id/cities/add" element={<AddCity/>} />

                {/* Reimbursement Trips */}
                <Route path="reimbursement-trips" element={<ReimbursementTrips />} />
                <Route path="reimbursement-trips/add" element={<AddReimbursementTrip />} />
                <Route path="reimbursement-trips/:trip_id/update" element={<UpdateReimbursementTrip />} />
                <Route path="reimbursement-trips/deleted" element={<DeletedReimbursementTrips />} />
                <Route path="reimbursement-trips/allowances" element={<Allowances />} />
                <Route path="reimbursement-trips/rates" element={<ReimbursementRates />} />
                <Route path="reimbursement-trips/form" element={<TripVerificationForm />} />

                {/* Trips */}
                <Route path="trips" element={<Trips />} />
                <Route path="add-trip" element={<AddTrip />} />
                <Route path="trips/:trip_id/update" element={<UpdateTrip />} />
                <Route path="pending-trips" element={<PendingTrips />} />
                <Route path="approved-trips" element={<ApprovedTrips />} />
                <Route path="completed-trips" element={<CompletedTrips />} />
                <Route path="canceled-rejected-trips" element={<CanceledTrips />} />
                <Route path="no-show-trips" element={<NoShowTrips />} />
                <Route path="shared-trips" element={<SharedTrips />} />
                <Route path="deleted-trips" element={<DeletedTrips />} />
                <Route path="assigned-trips" element={<AssignedTrips />} />
                <Route path="running-trips" element={<RunningTrips />} />
                <Route path="approved-trips/assignment" element={<BulkAssignment />} />

                {/* Trips Invoices */}
                <Route path="trips-invoice" element={<TripsInvoices />} />

                {/* Settings */}
                <Route path="settings" element={<Settings />} />

            </Route>
            <Route path="/" element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/code-verification" element={<CodeVerification />} />
                <Route path="/check-mail" element={<CheckMail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-reset-code" element={<VerifyResetCode />} />
                <Route path="*" element={<MaintenanceError />} />
                <Route index element={<Navigate to="/login" replace />} />
            </Route>
        </Routes>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
}
