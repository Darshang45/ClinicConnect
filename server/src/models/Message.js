import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    messageType: {
      type: String,
      enum: [
        "text",
        "image",
        "pdf",
        "report",
        "file",
        "system",
      ],
      default: "text",
    },

    attachment: {
      url: {
        type: String,
        default: "",
      },

      fileName: {
        type: String,
        default: "",
      },

      mimeType: {
        type: String,
        default: "",
      },

      fileSize: {
        type: Number,
        default: 0,
      },
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
      index: true,
    },

    seenAt: {
      type: Date,
      default: null,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({
  chat: 1,
  createdAt: 1,
});

messageSchema.index({
  receiver: 1,
  status: 1,
});

messageSchema.index({
  sender: 1,
  createdAt: -1,
});

export default mongoose.model("Message", messageSchema);