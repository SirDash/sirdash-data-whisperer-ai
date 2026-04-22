import { Navigate } from "react-router-dom";

// Legacy route — redirect to the new nested dashboard
const AdminDashboard = () => <Navigate to="/admin/dashboard/updates" replace />;

export default AdminDashboard;
