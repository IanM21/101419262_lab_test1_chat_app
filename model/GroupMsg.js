import mongoose from 'mongoose';

const GroupMessageSchema = new mongoose.Schema({
    from_user: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date_sent: {
        type: String,
        default: () => new Date().toLocaleString()
    }
});

const GroupMessage = mongoose.model('GroupMessage', GroupMessageSchema);

export { GroupMessage };