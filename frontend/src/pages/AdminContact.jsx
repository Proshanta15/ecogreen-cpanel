import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import { API_BASE_URL } from "../config";


export const AdminContact = () => {

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")
    const { authorizationToken } = useAuth();

    const getAllContactsData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/contacts`, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                }
            })
            const data = await response.json();
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

    const totalContacts = users.length;
    const totalResults = filteredUsers.length;
    const uniqueDomains = new Set(
        users.map((user) => (user.email?.split("@")[1] || "").toLowerCase())
    ).size;


    const deleteContactById = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/contacts/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authorizationToken,
                }
            })
            if (response.ok) {
                toast.success("Contact deleted successfully");
                getAllContactsData(); // Refresh the contact list after deletion
            }
        } catch (error) {
            toast.error("Failed to delete contact");
            console.log(error);
        }
    }

    useEffect(() => {
        getAllContactsData();
    }, []);

    return (
        <section className="admin-users-page">
            <div className="admin-users-headline">
                <p className="eyebrow">
                    <span className="eyebrow-icon">⚙️</span> Control Panel
                </p>
                <h1>Contact Management</h1>
                <p className="subtitle">Manage contacts, review contact details, and quickly find records from one place.</p>
            </div>

            <div className="admin-users-stats">
                <article className="stat-card">
                    <div className="stat-card-icon">📊</div>
                    <div className="stat-card-content">
                        <h3>Total Contacts</h3>
                        <p>{totalContacts}</p>
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
                    <div className="stat-card-icon">🌐</div>
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
                        <h2>All Registered Contacts</h2>
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

                {/* Contact Cards - Grid View */}
                <div className="contacts-grid">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((curUser, index) => (
                            <div className="contact-card" key={index}>
                                <div className="contact-card-header">
                                    <div className="contact-avatar-wrapper">
                                        <span className="contact-avatar">
                                            {curUser.username?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                        <span className="contact-status online"></span>
                                    </div>
                                    <div className="contact-name-wrapper">
                                        <h4 className="contact-name">{curUser.username}</h4>
                                        <span className="contact-company">{curUser.company ? <a href={`http://${curUser.company}`} target="_blank" rel="noopener noreferrer">{curUser.company}</a> : "No Company"}</span>
                                    </div>
                                </div>

                                <div className="contact-card-body">
                                    <div className="contact-detail">
                                        <span className="detail-icon">📧</span>
                                        <span className="detail-value">{curUser.email}</span>
                                    </div>
                                    <div className="contact-detail">
                                        <span className="detail-icon">📱</span>
                                        <span className="detail-value">{curUser.phone}</span>
                                    </div>
                                    <div className="contact-detail message-detail">
                                        <span className="detail-icon">💬</span>
                                        <span className="detail-value message-text">{curUser.message || "No message"}</span>
                                    </div>
                                </div>

                                <div className="contact-card-actions">
                                    <Link to={`/admin/contacts/${curUser._id}/edit`} className="btn btn-primary">
                                        <span className="btn-icon">✏️</span> Edit
                                    </Link>
                                    <button className="btn btn-danger" onClick={() => deleteContactById(curUser._id)}>
                                        <span className="btn-icon" >🗑️</span> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <span className="empty-icon">🔍</span>
                            <p>No contacts found for this search.</p>
                            <span className="empty-sub">Try adjusting your search terms</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
