

import Faq from "../models/faq-model.js";

// Create Faq
export const createFAQ = async(req, res, next) =>{
    try {
        const response = req.body;
        await Faq.create(response);
        res.status(201).json({
            success: true,
            message: 'FAQ created successfully'
        });
    } catch (error) {
        next(error);
    }
}


// Get all Faq Content
export const getAllFAQ = async (req, res, next) => {
    try {
        const faqs = await Faq.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: faqs
        });
    } catch (error) {
        next(error);
    }
}

// Get Single Faq

export const getSingleFAQ = async(req, res, next) =>{
    try {
        const id = req.params.id;

        const data = await Faq.findOne({_id: id});
        if(!data) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

// Update Single Faq
export const updateSingleFAQ = async(req, res, next) =>{
    try {
        const id = req.params.id;
        const updateFaqData = req.body;

        const updateFaq = await Faq.updateOne({ _id: id }, {
            $set: updateFaqData
        })
        return res.status(200).json({
            success: true,
            message: 'FAQ updated successfully'
        });
    } catch (error) {
        next(error);
    }
}

// Delete Faq
export const deleteFAQ = async(req, res, next) =>{
    try {
        const  id = req.params.id;
        const deletedFaq = await Faq.deleteOne({ _id: id });
        res.status(200).json({
            success: true,
            message: 'FAQ deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}