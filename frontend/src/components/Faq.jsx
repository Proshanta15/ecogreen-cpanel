import React, { useEffect } from "react";
import { useState } from "react";
import "../styles/faq.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import { API_BASE_URL } from "../config";


const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const { authorizationToken } = useAuth();

  const getAllFaqData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/faq`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      setFaqs(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllFaqData();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <section className="faq-section">
      <div className="faq-container">
        {/* Header Section */}
        <div className="faq-header">
          <div className="faq-badge">
            <span className="badge-question">?</span>
            KNOWLEDGE HUB
          </div>
          <h2 className="faq-title">
            Frequently Asked
            <span className="title-highlight"> Questions</span>
          </h2>
          <p className="faq-subtitle">
            Find answers to common questions about our apparel sourcing,
            production capabilities, and global operations.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="faq-grid">
          {/* Left Column - Illustration */}
          <div className="faq-illustration">
            <div className="illustration-card">
              <div className="illustration-icon">💬</div>
              <h3>Quick Support</h3>
              <p>Can't find your answer? Our team is here to help 24/7</p>
              <NavLink to="/contact" className="contact-support-btn">
              Contact Support
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </NavLink>
            </div>
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openIndex === index ? "active" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="question-icon">
                    <span className="icon-q">Q</span>
                  </div>
                  <span className="question-text">{faq.question}</span>
                  <div className="question-arrow">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M19 9L12 16L5 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                <div className="faq-answer">
                  <div className="answer-icon">
                    <span className="icon-a">A</span>
                  </div>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
