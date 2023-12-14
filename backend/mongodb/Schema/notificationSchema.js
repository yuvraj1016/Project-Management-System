import { Schema, model } from 'mongoose';
import User from './userSchema.js';

const NotificationSchema = new Schema({
    to: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    body: {
        type: String,
        required: true,
        maxlength: 200
    },
    read: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Notification = model('notification', NotificationSchema);

export default Notification;
