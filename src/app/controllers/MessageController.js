import ChatRoom from '../models/ChatRoom';
import User from '../models/User';
import Image from '../models/Image';
import Message from '../schemas/Message';
import Reserve from '../models/Reserve';
import * as Yup from 'yup';

class MessageController {
  async index(req, res) {
    const messages = await Message.find({
      room_id: req.params.id,
    })
    .sort({ createdAt: 'desc' })

    return res.json(messages)
  }

  async show(req, res) {
    return res.json()
  }

  async store(req, res) {

    const newMessage = await Message.create(req.body)

    req.io.to(newMessage.room_name).emit('message', newMessage);

    req.io.of('/').in(newMessage.room_name).clients(async (error, clients) => {

      if (error) throw error;

      if (!clients.includes(req.connectedUsers[newMessage.receiver_id])) {
        const chatRoom = await ChatRoom.findByPk(newMessage.room_id);

        await chatRoom.update({
          last_message_target_id: newMessage.receiver_id,
          last_message_target_read: false
        })

        const ownerSocket = req.connectedUsers[newMessage.receiver_id];

        if (ownerSocket) {
          req.io.to(ownerSocket).emit('newMessageToRoom', chatRoom);
        }
      }

    });

    return res.json({ succes: 'ok' });
  }

  async update(req, res) {
    res.json()
  }

  async delete(req, res) {
    res.json()
  }
}

export default new MessageController();
