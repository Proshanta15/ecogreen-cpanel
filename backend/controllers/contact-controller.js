import Contact from "../models/contact-model.js";

export const contactForm = async (req, res, next) => {
    try {
        const response = req.body;
        await Contact.create(response);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        next(error);
    }
}