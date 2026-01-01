// Manage Users Page - Admin can view and update user roles
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await api.get("/admin/users");
            setUsers(response.data);
        } catch (error) {
            toast.error("Error fetching users");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Update user role
    const updateRole = async (id, role) => {
        try {
            await api.put(`/admin/users/${id}`, { role });
            toast.success(`User role updated to ${role}!`);
            fetchUsers();
        } catch (error) {
            toast.error("Error updating role");
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: "30px" }}>Manage Users</h1>

            {/* Stats */}
            <div className="grid grid-3" style={{ marginBottom: "30px" }}>
                <div className="stat-card">
                    <p className="label">Total Users</p>
                    <p className="value">{users.length}</p>
                </div>
                <div className="stat-card">
                    <p className="label">Admins</p>
                    <p className="value">
                        {users.filter((u) => u.role === "admin").length}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="label">Regular Users</p>
                    <p className="value">
                        {users.filter((u) => u.role === "user").length}
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <div className="card">
                {users.length === 0 ? (
                    <div className="empty-state">
                        <p>No users found</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                user.role === "admin"
                                                    ? "badge-success"
                                                    : "badge-warning"
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {user.role === "user" ? (
                                            <button
                                                className="btn btn-primary"
                                                style={{
                                                    padding: "5px 10px",
                                                    fontSize: "12px",
                                                }}
                                                onClick={() =>
                                                    updateRole(
                                                        user._id,
                                                        "admin"
                                                    )
                                                }
                                            >
                                                Make Admin
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-secondary"
                                                style={{
                                                    padding: "5px 10px",
                                                    fontSize: "12px",
                                                }}
                                                onClick={() =>
                                                    updateRole(user._id, "user")
                                                }
                                            >
                                                Remove Admin
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ManageUsers;
