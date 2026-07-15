import {Schema, model} from 'mongoose';

const contactSchema = new Schema({
    username:
    {
        type: String,
        required: true,
    },
    email:
    {
        type: String,
        required: true,
    },
    phone:
    {
        type: String,
        required: true,
    },
    company:
    {
        type: String,
        required: false,
    },
    message:
    {
        type: String,
        required: true,
    }
});

const Contact = new model('Contact', contactSchema);

export default Contact;