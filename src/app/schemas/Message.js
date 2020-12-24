import mongoose from 'mongoose';

const Message = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  room_id: {
    type: Number,
    required: true,
  },
  room_name: {
    type: String,
    required: true,
  },
  sender_id: {
    type: Number,
    required: true,
  },
  receiver_id: {
    type: Number,
    required: true,
  },
  image_id: {
    type: Number,
    required: false,
  },
  seen: {
    type: Boolean,
    required: true,
    default: false,
  },
  sender_name: {
    type: String,
    required: false,
  },
  sender_avatar: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Message', Message);
