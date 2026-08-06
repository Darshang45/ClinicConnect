import jwt from "jsonwebtoken";

import User from "../models/User.js";

/* ===========================================================
   Online Users
=========================================================== */

const onlineUsers = new Map();

/* ===========================================================
   Get User From Token
=========================================================== */

const getUserFromToken = async (
  token
) => {

  try {

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return await User.findById(
      decoded.id
    );

  } catch {

    return null;

  }

};

/* ===========================================================
   Socket Initialization
=========================================================== */

const initializeSocket = (
  io
) => {

  io.use(
    async (
      socket,
      next
    ) => {

      try {

        const token =
          socket.handshake.auth
            ?.token;

        const user =
          await getUserFromToken(
            token
          );

        if (!user) {
          return next(
            new Error(
              "Unauthorized"
            )
          );
        }

        socket.user = user;

        next();

      } catch (error) {

        next(error);

      }

    }
  );

  io.on(
    "connection",
    (socket) => {

      console.log(
        `🟢 ${socket.user.fullName} connected`
      );

      /* =======================================
         Save Online User
      ======================================= */

      onlineUsers.set(
        socket.user._id.toString(),
        socket.id
      );

      io.emit(
        "online-users",
        Array.from(
          onlineUsers.keys()
        )
      );

      /* =======================================
         Join Personal Room
      ======================================= */

      socket.join(
        socket.user._id.toString()
      );

      /* =======================================
         Join Chat
      ======================================= */

      socket.on(
        "join-chat",
        (
          chatId
        ) => {

          socket.join(
            chatId
          );

        }
      );

      /* =======================================
         Leave Chat
      ======================================= */

      socket.on(
        "leave-chat",
        (
          chatId
        ) => {

          socket.leave(
            chatId
          );

        }
      );
            /* =======================================
         Typing Indicator
      ======================================= */

      socket.on(
        "typing",
        ({ chatId }) => {

          socket.to(chatId).emit(
            "typing",
            {
              chatId,
              userId:
                socket.user._id.toString(),
              userName:
                socket.user.fullName,
            }
          );

        }
      );

      /* =======================================
         Stop Typing
      ======================================= */

      socket.on(
        "stop-typing",
        ({ chatId }) => {

          socket.to(chatId).emit(
            "stop-typing",
            {
              chatId,
              userId:
                socket.user._id.toString(),
            }
          );

        }
      );

      /* =======================================
         Live Message
      ======================================= */

      socket.on(
        "send-message",
        (message) => {

          socket
            .to(message.chat)
            .emit(
              "receive-message",
              message
            );

        }
      );

      /* =======================================
         Delivered Status
      ======================================= */

      socket.on(
        "message-delivered",
        ({
          chatId,
          messageId,
        }) => {

          socket
            .to(chatId)
            .emit(
              "message-delivered",
              {
                chatId,
                messageId,
              }
            );

        }
      );

      /* =======================================
         Read Receipts
      ======================================= */

      socket.on(
        "messages-seen",
        ({
          chatId,
          userId,
        }) => {

          socket
            .to(chatId)
            .emit(
              "messages-seen",
              {
                chatId,
                userId,
              }
            );

        }
      );

      /* =======================================
         Notifications
      ======================================= */

      socket.on(
        "send-notification",
        ({
          receiverId,
          notification,
        }) => {

          const receiverSocket =
            onlineUsers.get(
              receiverId
            );

          if (
            receiverSocket
          ) {

            io.to(
              receiverSocket
            ).emit(
              "new-notification",
              notification
            );

          }

        }
      );

      /* =======================================
         Conversation Updated
      ======================================= */

      socket.on(
        "refresh-chats",
        ({
          participants,
        }) => {

          participants.forEach(
            (
              participantId
            ) => {

              const socketId =
                onlineUsers.get(
                  participantId
                );

              if (
                socketId
              ) {

                io.to(
                  socketId
                ).emit(
                  "refresh-chats"
                );

              }

            }
          );

        }
      );
            /* =======================================
         User Disconnect
      ======================================= */

      socket.on(
        "disconnect",
        () => {

          console.log(
            `🔴 ${socket.user.fullName} disconnected`
          );

          onlineUsers.delete(
            socket.user._id.toString()
          );

          io.emit(
            "online-users",
            Array.from(
              onlineUsers.keys()
            )
          );

        }
      );

    }
  );

};

/* ===========================================================
   Helper Functions
=========================================================== */

export const getOnlineUsers = () => {

  return Array.from(
    onlineUsers.keys()
  );

};

export const getSocketId = (
  userId
) => {

  return (
    onlineUsers.get(
      userId.toString()
    ) || null
  );

};

export const isUserOnline = (
  userId
) => {

  return onlineUsers.has(
    userId.toString()
  );

};

export default initializeSocket;