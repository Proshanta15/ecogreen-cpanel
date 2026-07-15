import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AdminLayout } from "./components/layouts/AdminLayout";
import AboutPage from "./pages/AboutPage";
import { AdminContact } from "./pages/AdminContact";
import { AdminContactEdit } from "./pages/AdminContactEdit";
import { AdminUpdate } from "./pages/AdminUpdate";
import { AdminUser } from "./pages/AdminUser";
import ContactPage from "./pages/ContactPage";
import Error from "./pages/Error";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import LogoutPage from "./pages/LogoutPage";
import RegisterForm from "./pages/RegisterForm";
import ServicePage from "./pages/ServicePage";
import ScrollToTop from "./ScrollToTop";
import ContactContentForm from "./pages/ContactContentForm";
import  AdminService  from "./pages/AdminService";
import AdminAbout from "./pages/AdminAbout";
import AdminHome from "./pages/AdminHome";
import AdminFooterShowcase from "./pages/AdminFooterShowcase";
import ContactContentUpdate from "./pages/ContactContentUpdate";
import AdminFAQ from "./pages/AdminFAQ";
import AdminFaqForm from "./pages/AdminFaqForm";
import AdminFaqUpdate from "./pages/AdminFaqUpdate";
import AdminServiceCreate from "./pages/AdminServiceCreate";
import AdminServiceEdit from "./pages/AdminServiceEdit";

function App() {
  return (

    <>
      <BrowserRouter>
        <div className="App">
          <ScrollToTop />
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="*" element={<Error />} />

              <Route path="/admin" element={<AdminLayout />}>
                {/* Nested routes for admin functionalities can be added here */}
                <Route path="users" element={<AdminUser />} />
                <Route path="users/:id/edit" element={<AdminUpdate />} />
                <Route path="contacts" element={<AdminContact />} />
                <Route path="contacts/:id/edit" element={<AdminContactEdit />} />
                <Route path="contact/content" element={ <ContactContentForm />} />
                <Route path="contact/content/update/:id" element={ <ContactContentUpdate />} />
                <Route path="faq" element={ <AdminFAQ />} />
                <Route path="faq/create" element={ <AdminFaqForm />} />
                <Route path="faq/edit/:id" element={ <AdminFaqUpdate />} />
                <Route path="services" element={ <AdminService />} />
                <Route path="about" element={ <AdminAbout />} />
                <Route path="home" element={ <AdminHome />} />
                <Route path="footer-showcase" element={ <AdminFooterShowcase />} />
                <Route path="services/create" element={ <AdminServiceCreate />} />
                <Route path="services/edit/:id" element={ <AdminServiceEdit />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
