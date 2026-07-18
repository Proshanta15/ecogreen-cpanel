import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../store/auth';
import '../styles/faq-form.css';

import { API_BASE } from "../config";

const AdminFaqUpdate = () => {

  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  const params = useParams();
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();

  const getSingleFaqData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/faq/edit/${params.id}`, {
        method: "GET",
        headers: {
          "Authorization": authorizationToken,
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch FAQ data');
      }
      const faqData = await response.json();
      setFormData({
        question: faqData.question,
        answer: faqData.answer
      });
    } catch (error) {
      toast.error('Error fetching FAQ data: ' + error.message);
    }
  };

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
      const response = await fetch(`${API_BASE}/api/admin/faq/update/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorizationToken
        },
        body: JSON.stringify(formData)
      });
      const res_data = await response.json();

      if (response.ok) {
        toast.success('FAQ updated successfully!');
        setFormData({ question: '', answer: '' });
        navigate('/admin/faq');
      }


    } catch (error) {
      toast.error('Error adding FAQ: ' + error.message);
    }
  };
  useEffect(() => {
    getSingleFaqData();
  }, []);


  return (
    <div className="faq-form-page">
      <div className="faq-form-container">
        {/* Form */}
        <div className="faq-form-card">
          <h2 className="faq-form-card-title">
            Update FAQ
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
                Update FAQ
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminFaqUpdate;