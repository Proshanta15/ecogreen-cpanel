import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

// Secure password storage using bcrypt
userSchema.pre('save', async function (next) {

    const user = this;

    if (!user.isModified("password")) {
        return next();
    }

    try {
        const saltRound = await bycrypt.genSalt(10);
        const hash_password = await bycrypt.hash(user.password, saltRound);
        user.password = hash_password;
    } catch (error) {
        next(error);
    }
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bycrypt.compare(password, this.password);
    } catch (error) {
        console.log('Error comparing password:', error);
        return false;
    }
}

// JWT token generation method
userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin
        },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '30d' }
        );
    } catch (error) {
        console.log('Error generating token:', error);
        return null;
    }
}

const User = new mongoose.model('User', userSchema);

export default User;