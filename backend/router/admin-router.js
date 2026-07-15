import express from "express";
import { deleteContactById, deleteUserById, getAllContacts, getAllServices, getAllUsers, getContactById, getUserById, updateContactById, updateUserById } from "../controllers/admin-controller.js";
import adminMiddleware from "../middlewares/admin-middleware.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import { contactContentForm, getContactContent, updateContactContent } from "../controllers/contact-content-controller.js";
import { createFAQ, deleteFAQ, getAllFAQ, getSingleFAQ, updateSingleFAQ } from "../controllers/faq-controller.js";
const router = express.Router();

router.route('/users').get(authMiddleware, adminMiddleware, getAllUsers);
router.route('/users/:id').get(authMiddleware, adminMiddleware, getUserById);
router.route('/users/update/:id').patch(authMiddleware, adminMiddleware, updateUserById);
router.route('/users/delete/:id').delete(authMiddleware, adminMiddleware, deleteUserById);

router.route('/contacts').get(authMiddleware, adminMiddleware, getAllContacts);
router.route('/contacts/:id').get(authMiddleware, adminMiddleware, getContactById);
router.route('/contacts/update/:id').patch(authMiddleware, adminMiddleware, updateContactById);
router.route('/contacts/delete/:id').delete(authMiddleware, adminMiddleware, deleteContactById);



// Contact Content (GET is public for frontend display)
router.route('/contact/content').get(getContactContent);
router.route('/contact/content').post(authMiddleware, adminMiddleware, contactContentForm);
router.route('/contact/content/update/:id').patch(authMiddleware, adminMiddleware, updateContactContent);

// Faq Router (GET is public for frontend display)
router.route('/faq/create').post(authMiddleware, adminMiddleware, createFAQ);
router.route('/faq').get(getAllFAQ);
router.route('/faq/edit/:id').get(authMiddleware, adminMiddleware, getSingleFAQ);
router.route('/faq/update/:id').patch(authMiddleware, adminMiddleware, updateSingleFAQ);
router.route('/faq/delete/:id').delete(authMiddleware, adminMiddleware, deleteFAQ);


export default router;