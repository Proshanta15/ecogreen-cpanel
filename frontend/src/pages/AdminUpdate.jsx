import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import "../styles/admin-contact.css";
import { API_BASE_URL } from "../config";

export const AdminUpdate = () => {

    const [data, setData] = useState({
        username: "",
        email: "",
        phone: "",
        isAdmin: ""
    });

    const params = useParams();
    const { authorizationToken } = useAuth();
    const navigate = useNavigate();

    const getSingleUserData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${params.id}`, {
                method: "GET",
                headers: {
                    "Authorization": authorizationToken,
                }
            });
            const userData = await response.json();
            setData(userData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    useEffect(() => {
        getSingleUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/update/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authorizationToken
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                navigate("/admin/users");
                toast.success("User updated successfully");
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            toast.error("Failed to update user");
        }
    }

    return (
        <main className="contact-page">
            <section className="contact-card">
                <div className="contact-copy">
                    <p className="contact-tag">Update User</p>
                    <h1>Edit User Details</h1>
                    <p>
                        Modify the user information below and submit the changes.
                    </p>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="contact-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your username"
                            autoComplete="off"
                            value={data.username}
                            onChange={(e) => setData({ ...data, username: e.target.value })}
                        />
                    </div>

                    <div className="contact-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="off"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </div>

                    <div className="contact-field">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            placeholder="Enter your phone number"
                            autoComplete="off"
                            value={data.phone}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                        />
                    </div>
                    <div className="contact-field">
                        <label htmlFor="isAdmin">IsAdmin</label>
                        <input
                            id="isAdmin"
                            name="isAdmin"
                            type="text"
                            placeholder="Enter admin status"
                            autoComplete="off"
                            value={data.isAdmin}
                            onChange={(e) => setData({ ...data, isAdmin: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="contact-button">
                        Update
                    </button>
                </form>
            </section>
        </main>
    )
}

