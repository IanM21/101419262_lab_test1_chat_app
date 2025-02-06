import mongoose from 'mongoose';

// Mongoose Schemas
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createon: {
        type: String,
        default: () => new Date().toLocaleString()
    }
});

const User = mongoose.model('User', UserSchema);


export { User };