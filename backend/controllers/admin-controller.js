import Contact from "../models/contact-model.js";
import User from "../models/user-model.js";

// Controller to get all users (admin functionality)
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password field from the response
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await User.findOne({ _id: id }, { password: 0 }); // Exclude password field from the response
        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(data);

    } catch (error) {
        next(error);
    }
}

const updateUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedUserData = req.body;

        const updateUser = await User.updateOne({ _id: id }, {
            $set: updatedUserData,
        })
        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        next(error);
    }
}

const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find({});
        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ message: "No contacts found" });
        }
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
}

const getContactById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Contact.findOne({ _id: id });
        if (!data) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const updateContactById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateContactData = req.body;

        const updateContact = await Contact.updateOne({ _id: id }, {
            $set: updateContactData,
        });
        res.status(200).json({ message: "Contact updated successfully" });
    } catch (error) {
        next(error);
    }
}

const getAllServices = async (req, res, next) => {
    try {
        return res.status(200).json({ message: "Services endpoint is under construction" });
    } catch (error) {
        next(error)
    }
}

const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedUser = await User.deleteOne({ _id: id });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}

const deleteContactById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedContact = await Contact.deleteOne({ _id: id });
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        next(error);
    }
}





export { deleteContactById, deleteUserById, getAllContacts, getAllServices, getAllUsers, getContactById, getUserById, updateContactById, updateUserById };

