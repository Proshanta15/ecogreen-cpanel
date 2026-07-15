import ContactContent from "../models/contact-content-model.js";

// Create new contact content (POST)
export const contactContentForm = async(req, res, next) =>{
    try {
        const response = req.body;
        await ContactContent.create(response);
        res.status(201).json({
            success: true,
            message: 'Contact Content sent successfully'
        });
    } catch (error) {
        next(error);
    }
}

// Get all contact content (GET)
export const getContactContent = async (req, res, next) => {
    try {
        const contactContent = await ContactContent.find();
        res.status(200).json({
            success: true,
            data: contactContent
        });
    } catch (error) {
        next(error);
    }
}

// Update contact content (POST)
export const updateContactContent = async (req, res, next) => {
    try {
        const { _id, id, ...updateContactContentData } = req.body;
        const contactId = _id || id;

        if (!contactId) {
            return res.status(400).json({ Message: 'Contact content id is required' });
        }

        const updateData = await ContactContent.updateOne({ _id: contactId }, updateContactContentData);
        res.status(200).json({ Message: 'Contact Content updated successfully' });
    } catch (error) {
        next(error);
    }
}