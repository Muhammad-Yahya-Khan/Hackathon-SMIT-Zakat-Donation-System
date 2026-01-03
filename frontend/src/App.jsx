// Main App Component - Handles all routes
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./pages/CampaignDetails";

// User Pages
import Dashboard from "./pages/Dashboard";
import DonationForm from "./pages/DonationForm";
import MyDonations from "./pages/MyDonations";
import Receipt from "./pages/Receipt";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import ManageDonations from "./pages/ManageDonations";
import ManageCampaigns from "./pages/ManageCampaigns";
import ManageUsers from "./pages/ManageUsers";

// Layout
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Protected Route - Only logged in users
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}

// Admin Route - Only admin users
function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

// User Layout with Sidebar
function UserLayout({ children }) {
    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">{children}</div>
        </div>
    );
}

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaigns/:id" element={<CampaignDetails />} />

                {/* User Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <UserLayout>
                                <Dashboard />
                            </UserLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/donate/:campaignId"
                    element={
                        <ProtectedRoute>
                            <UserLayout>
                                <DonationForm />
                            </UserLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-donations"
                    element={
                        <ProtectedRoute>
                            <UserLayout>
                                <MyDonations />
                            </UserLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/receipt/:id"
                    element={
                        <ProtectedRoute>
                            <UserLayout>
                                <Receipt />
                            </UserLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <UserLayout>
                                <AdminDashboard />
                            </UserLayout>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/donations"
                    element={
                        <AdminRoute>
                            <UserLayout>
                                <ManageDonations />
                            </UserLayout>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/campaigns"
                    element={
                        <AdminRoute>
                            <UserLayout>
                                <ManageCampaigns />
                            </UserLayout>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>
                            <UserLayout>
                                <ManageUsers />
                            </UserLayout>
                        </AdminRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
