import { Schema, model } from 'mongoose';

const FaqSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Faq = new model('Faq', FaqSchema);

export default Faq;