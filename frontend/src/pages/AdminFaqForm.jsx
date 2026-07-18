import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../store/auth';
import '../styles/faq-form.css';

const API_BASE = "https://api.ecogreentex.eu.com";

const AdminFaqForm = () => {

  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/api/admin/faq/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorizationToken
        },
        body: JSON.stringify(formData)
      });
      const res_data = await response.json();

      if (!response.ok) {
        throw new Error(res_data.message || 'Failed to add FAQ');
      }

      setFormData({ question: '', answer: '' });
      navigate('/admin/faq');
      toast.success('FAQ added successfully!');
    } catch (error) {
      console.error("Error adding FAQ:", error);
      toast.error('Error adding FAQ: ' + error.message);
    }
  };



  return (
    <div className="faq-form-page">
      <div className="faq-form-container">
        {/* Form */}
        <div className="faq-form-card">
          <h2 className="faq-form-card-title">
            Add New FAQ
          </h2>

          <form className="faq-form" onSubmit={handleSubmit}>
            <div className="faq-form-group">
              <label htmlFor="question">Question</label>
              <input
                id="question"
                name="question"
                type="text"
                placeholder="Enter the question"
                value={formData.question}
                onChange={handleChange}
                required
              />
            </div>

            <div className="faq-form-group">
              <label htmlFor="answer">Answer</label>
              <textarea
                id="answer"
                name="answer"
                rows="4"
                placeholder="Enter the answer"
                value={formData.answer}
                onChange={handleChange}
                required
              />
            </div>

            <div className="faq-form-actions">
              <button type="submit" className="faq-form-btn-submit">
                Add FAQ
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminFaqForm;