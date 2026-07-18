import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import '../styles/admin-user.css';

const API_BASE = "https://api.ecogreentex.eu.com";

export const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")
    const { authorizationToken } = useAuth();

    const getAllUsersData = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/admin/users`, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });
            const data = await response.json();
            console.log(`Users ${data}`);
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }

    const filteredUsers = useMemo(() => {
        const value = searchTerm.trim().toLowerCase();
        if (!value) return users;

        return users.filter((user) => {
            return (
                user?.username?.toLowerCase().includes(value) ||
                user?.email?.toLowerCase().includes(value) ||
                user?.phone?.toLowerCase().includes(value)
            );
        });
    }, [users, searchTerm]);

    const totalUsers = users.length;
    const totalResults = filteredUsers.length;
    const uniqueDomains = new Set(
        users.map((user) => (user.email?.split("@")[1] || "").toLowerCase())
    ).size;

    const deleteUser = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/api/admin/users/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authorizationToken,
                },
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                getAllUsersData(); // Refresh the user list after deletion
                toast.success("User deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete user");
            console.error(error);
        }
    }

    useEffect(() => {
        getAllUsersData();
    }, []);


    return (
        <section className="admin-users-page">
            <div className="admin-users-headline">
                <p className="eyebrow">
                    <span className="eyebrow-icon">👥</span> Control Panel
                </p>
                <h1>User Management</h1>
                <p className="subtitle">Manage users, review contact details, and quickly find records from one place.</p>
            </div>

            <div className="admin-users-stats">
                <article className="stat-card">
                    <div className="stat-card-icon">👤</div>
                    <div className="stat-card-content">
                        <h3>Total Users</h3>
                        <p>{totalUsers}</p>
                    </div>
                </article>
                <article className="stat-card">
                    <div className="stat-card-icon">👁️</div>
                    <div className="stat-card-content">
                        <h3>Visible Results</h3>
                        <p>{totalResults}</p>
                    </div>
                </article>
                <article className="stat-card">
                    <div className="stat-card-icon">📧</div>
                    <div className="stat-card-content">
                        <h3>Email Domains</h3>
                        <p>{uniqueDomains}</p>
                    </div>
                </article>
            </div>

            <div className="admin-users-panel">
                <div className="panel-topbar">
                    <div className="panel-title">
                        <span className="panel-title-icon">📋</span>
                        <h2>All Registered Users</h2>
                        <span className="panel-badge">{filteredUsers.length}</span>
                    </div>
                    <div className="panel-search">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="clear-search" onClick={() => setSearchTerm("")}>
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* User Cards - Grid View */}
                <div className="users-grid">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((curUser, index) => (
                            <div className="user-card" key={index}>
                                <div className="user-card-header">
                                    <div className="user-avatar-wrapper">
                                        <span className="user-avatar">
                                            {curUser.username?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                        <span className={`user-status ${curUser.isAdmin ? "admin" : "user"}`}>
                                            {curUser.isAdmin ? "👑" : "👤"}
                                        </span>
                                    </div>
                                    <div className="user-name-wrapper">
                                        <h4 className="user-name">{curUser.username}</h4>
                                        <span className="user-role">
                                            {curUser.isAdmin ? "Administrator" : "Regular User"}
                                        </span>
                                    </div>
                                    <div className={`user-badge ${curUser.isAdmin ? "admin-badge" : "user-badge"}`}>
                                        {curUser.isAdmin ? "Admin" : "User"}
                                    </div>
                                </div>

                                <div className="user-card-body">
                                    <div className="user-detail">
                                        <span className="detail-icon">📧</span>
                                        <span className="detail-value">{curUser.email}</span>
                                    </div>
                                    <div className="user-detail">
                                        <span className="detail-icon">📱</span>
                                        <span className="detail-value">{curUser.phone}</span>
                                    </div>
                                    <div className="user-detail">
                                        <span className="detail-icon">🆔</span>
                                        <span className="detail-value user-id">ID: {curUser._id?.slice(0, 8) || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="user-card-actions">
                                    <Link
                                        to={`/admin/users/${curUser._id}/edit`}
                                        className="btn btn-primary"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <span className="btn-icon">✏️</span> Edit User
                                    </Link>
                                    <button
                                        onClick={() => deleteUser(curUser._id)}
                                        className="btn btn-danger"
                                    >
                                        <span className="btn-icon">🗑️</span> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <span className="empty-icon">🔍</span>
                            <p>No users found for this search.</p>
                            <span className="empty-sub">Try adjusting your search terms</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
