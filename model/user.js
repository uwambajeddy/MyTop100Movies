import mongoose from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

const { isEmail } = validator;
const { hash, compare } = bcryptjs;
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please! tell us your name.']
    },
    email: {
        type: String,
        required: [true, 'Please! provide your email.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please! provide valid email']
    },
    password: {
        type: String,
        required: [true, 'Please! provide password'],
        minlength: 8,
        select: false
    },
    password_confirm: {
        type: String,
        required: [true, 'Please provide confirm password!!'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same'
        }
    },
});

userSchema.pre('save', async function (next) {

    this.password = await hash(this.password, 12);
    this.password_confirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await compare(candidatePassword, userPassword);
};

const User = model('User', userSchema);

export default User;
