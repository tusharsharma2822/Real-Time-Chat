import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: [5, 'Email must be atleast 5 Characters long'],
        maxLength: [50, "Email must be atmost 50 Characters long"]
    },

    password: {
        type: String,
        required: true,
        select: false
    }
})

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function() {
    return jwt.sign({ email: this.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

const userModel = mongoose.model('user', userSchema);

export default userModel;