import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaMapPin } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { IoMailUnreadOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const API_BASE = "https://api.ecogreentex.eu.com";

const defaultData = {
  visitTitle: "Visit & Connect",
  address: "Rashid Court, House-4, Road-7\nSector-3, Uttara, Dhaka",
  phone: "+8801518-900571",
  phoneLabel: "(Hotline)",
  email: "sobuj@ecogreentex.eu.com",
  hours: "Sun–Thu: 9:00 AM – 6:00 PM (BST)",
  highlightTitle: "Let's build your next collection",
  highlightDescription:
    "From denim to high-street casuals, activewear to loungewear — we reduce lead times while ensuring transparency and premium quality. Request a sourcing consultation.",
  buttonText: "Get in touch",
  buttonLink: "/contact",
};

const FooterShowcase = () => {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/footer-showcase`, {
          method: "GET",
        });
        const result = await response.json();
        if (response.ok && result.success && result.data) {
          setData({ ...defaultData, ...result.data });
        }
      } catch (error) {
        console.error("Error fetching footer showcase:", error);
      }
    };
    fetchFooter();
  }, []);

  const addressLines = (data.address || "").split("\n");

  return (
    <div className="contact-showcase">
      <div className="contact-inner">
        <div className="contact-details">
          <h3>
            <FaMapPin style={{ marginRight: "10px", color: "#D4AF37", fontSize: "23px" }} />
            {data.visitTitle}
          </h3>
          <div className="info-row">
            <FaMapMarkerAlt style={{ marginRight: "10px", color: "green", fontSize: "23px" }} />
            <p>
              {addressLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < addressLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
          <div className="info-row">
            <FiPhone style={{ marginRight: "10px", color: "green", fontSize: "23px" }} />
            <p>
              <a href={`tel:${data.phone}`}>{data.phone}</a>
              {data.phoneLabel && (
                <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                  {" "}
                  {data.phoneLabel}
                </span>
              )}
            </p>
          </div>
          <div className="info-row">
            <IoMailUnreadOutline style={{ marginRight: "10px", color: "green", fontSize: "23px" }} />
            <p>
              <a href={`mailto:${data.email}`}>{data.email}</a>
            </p>
          </div>
          <div className="info-row">
            <IoMdTime style={{ marginRight: "10px", color: "green", fontSize: "23px" }} />
            <p>{data.hours}</p>
          </div>
        </div>
        <div className="contact-highlight">
          <h4>{data.highlightTitle}</h4>
          <p>{data.highlightDescription}</p>
          <Link to={data.buttonLink || "/contact"} className="btn-modern">
            {data.buttonText} <FaArrowRight style={{ marginLeft: "10px" }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterShowcase;
