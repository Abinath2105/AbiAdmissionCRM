import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MasterSetup from "./pages/MasterSetup";
import ApplicantForm from "./pages/ApplicantForm";
import SeatAllocation from "./pages/SeatAllocation";
import AdmissionConfirmation from "./pages/AdmissionConfirmation";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./Login";
import OfficerDashboard from "./pages/OfficerDashboard";
import ManagementDashboard from "./pages/ManagementDashboard";

export default function AppRoutes() {
  return (
    <Routes>
  
      <Route path="/login" element={<Login />} />

    
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/officerDashboard"
        element={
          <ProtectedRoute allowedRoles={["OFFICER"]}>
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/managementDashboard"
        element={
          <ProtectedRoute allowedRoles={["MANAGEMENT"]}>
            <ManagementDashboard />
          </ProtectedRoute>
        }
      />

    
      <Route
        path="/setup"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <MasterSetup />
          </ProtectedRoute>
        }
      />

      
      <Route
        path="/applicant"
        element={
          <ProtectedRoute allowedRoles={["OFFICER"]}>
            <ApplicantForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/allocation"
        element={
          <ProtectedRoute allowedRoles={["OFFICER"]}>
            <SeatAllocation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/confirm"
        element={
          <ProtectedRoute allowedRoles={["OFFICER"]}>
            <AdmissionConfirmation />
          </ProtectedRoute>
        }
      />

   
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}