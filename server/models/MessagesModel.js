const { Schema, model } = require('mongoose');

const messageSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    messages: [
      {
        sender: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          trim: true,
        },
        media: {
          type: String,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          default: 'delivered',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Message = model('Message', messageSchema);

module.exports = Message;
