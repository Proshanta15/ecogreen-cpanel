import { NavLink } from 'react-router-dom';
import BannerVideo from '../../../src/assets/video.mp4';

const API_BASE = "https://api.ecogreentex.eu.com";

const getMediaUrl = (src) => {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  const normalized = src.replace(/\\/g, "/");
  const match = normalized.match(/uploads\/.+$/);
  const rel = match ? match[0] : normalized.replace(/^[A-Za-z]:\//, "");
  return `${API_BASE}/${rel}`;
};

const defaultBanner = {
  title: "Your Global Partner",
  titleHighlight: "For Sustainable Apparel Sourcing",
  description: "Eco Green Tex Ltd. is an ISO-certified buying house in Dhaka, connecting world-class fashion brands with trusted, ethical factories across Bangladesh. We deliver uncompromised quality and timely delivery for every collection.",
  buttonText: "EXPLORE OUR SERVICES",
  buttonLink: "/services",
  video: "",
  image: "",
  showVideo: true,
  showImage: false,
}

const Banner = ({ banner }) => {
  const data = { ...defaultBanner, ...(banner || {}) }

  const hasVideo = Boolean(data.video)
  const hasImage = Boolean(data.image)

  // Determine which background to display based on the active/inactive
  // toggles. Video takes priority when enabled; otherwise the image is used.
  let useVideo;
  if (data.showVideo) {
    useVideo = true;
  } else if (data.showImage) {
    useVideo = false;
  } else {
    // Neither explicitly toggled: default to the static video fallback.
    useVideo = !hasImage;
  }

  // If image mode was requested but no image exists, fall back to video.
  if (!useVideo && !hasImage) {
    useVideo = true;
  }

  const videoSrc = hasVideo ? getMediaUrl(data.video) : BannerVideo

  return (
    <div className="hero-container">
      {/* Background Media */}
      {useVideo ? (
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster={hasImage ? getMediaUrl(data.image) : undefined}
        >
          <source src={videoSrc} type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          className="hero-video"
          src={getMediaUrl(data.image)}
          alt="Banner"
        />
      )}

      {/* Overlay for better text readability */}
      <div className="hero-overlay"></div>

      {/* Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          {data.title}
          <span className="hero-subtitle-line">{data.titleHighlight}</span>
        </h1>

        <p className="hero-description">{data.description}</p>
        <NavLink to={data.buttonLink || "/services"} className="hero-btn">
          {data.buttonText}
          <span className="btn-arrow">→</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Banner
