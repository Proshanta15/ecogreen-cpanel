import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../store/auth';
import "../styles/admin-contact.css";
import { API_BASE_URL } from '../config';



export const AdminContactEdit = () => {
    const [data, setData] = React.useState({
        username: "",
        email: "",
        phone: "",
        company: "",
        message: "",
    });

    const params = useParams();
    const { authorizationToken } = useAuth();
    const navigate = useNavigate();

    const getSingleContactData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/contacts/${params.id}`, {
                method: "GET",
                headers: {
                    "Authorization": authorizationToken,
                }
            });
            const contactData = await response.json();
            setData(contactData);
        } catch (error) {
            console.error("Error fetching contact data:", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/admin/contacts/update/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authorizationToken
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                toast.success("Contact updated successfully");
                navigate('/admin/contacts');
            }
        } catch (error) {
            console.error("Error updating contact:", error);
            toast.error("Error updating contact");
        }
    }

    useEffect(() => {
        getSingleContactData();
    }, []);


    return (
        <main className="contact-page">
            <section className="contact-card">
                <div className="contact-copy">
                    <p className="contact-tag">Update Contact</p>
                    <h1>Edit Contact Details</h1>
                    <p>
                        Modify the contact information below and submit the changes.
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
                        <label htmlFor="company">Company</label>
                        <input
                            id="company"
                            name="company"
                            type="text"
                            placeholder="Enter company name"
                            autoComplete="off"
                            value={data.company}
                            onChange={(e) => setData({ ...data, company: e.target.value })}
                        />
                    </div>
                    <div className="contact-field">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Enter your message"
                            autoComplete="off"
                            value={data.message}
                            onChange={(e) => setData({ ...data, message: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Update Contact
                    </button>
                </form>
            </section>
        </main>
    )
}
