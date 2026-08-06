import { useEffect, useRef, useState } from "react";

import Button from "../../../components/common/Button";

import {
  sendMessage,
} from "../../../services/chatService";

import socketService from "../../../services/socketService";

import "../../../styles/doctor_dashboard.css";
import "../../../styles/doctor_chat.css";

function MessageInput({
  chatId,
  onMessageSent,
}) {
  const [message, setMessage] =
    useState("");

  const [attachment, setAttachment] =
    useState(null);

  const [sending, setSending] =
    useState(false);

  const [isTyping, setIsTyping] =
    useState(false);

  const typingTimeout =
    useRef(null);

  const fileInputRef =
    useRef(null);

  /* ==========================================
     Select Attachment
  ========================================== */

  const handleFileChange = (event) => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    setAttachment(file);

  };

  /* ==========================================
     Remove Attachment
  ========================================== */

  const removeAttachment = () => {

    setAttachment(null);

    if (fileInputRef.current) {

      fileInputRef.current.value = "";

    }

  };

  /* ==========================================
     Typing Indicator
  ========================================== */

  const emitTyping = () => {

    if (!chatId) return;

    if (!isTyping) {

      socketService.typing(chatId);

      setIsTyping(true);

    }

    if (typingTimeout.current) {

      clearTimeout(
        typingTimeout.current
      );

    }

    typingTimeout.current =
      setTimeout(() => {

        socketService.stopTyping(
          chatId
        );

        setIsTyping(false);

      }, 1200);

  };

  /* ==========================================
     Send Message
  ========================================== */

  const handleSend = async () => {

    if (
      sending ||
      (
        !message.trim() &&
        !attachment
      )
    ) {

      return;

    }

    try {

      setSending(true);

     const response =
  await sendMessage(
    chatId,
    {
      message: message.trim(),
    }
  );

      socketService.stopTyping(
        chatId
      );

      setIsTyping(false);

      setMessage("");

      removeAttachment();

      socketService.sendMessage(
        response.data
      );

      socketService.messageDelivered(
        chatId,
        response.data._id
      );

      if (onMessageSent) {

        onMessageSent(
          response.data
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to send message."
      );

    } finally {

      setSending(false);

    }

  };

  /* ==========================================
     Enter Key
  ========================================== */

  const handleKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSend();

    }

  };

  /* ==========================================
     Message Change
  ========================================== */

  const handleMessageChange = (
    event
  ) => {

    setMessage(
      event.target.value
    );

    emitTyping();

  };

  /* ==========================================
     Cleanup
  ========================================== */

  useEffect(() => {

    return () => {

      if (typingTimeout.current) {

        clearTimeout(
          typingTimeout.current
        );

      }

      if (
        chatId &&
        isTyping
      ) {

        socketService.stopTyping(
          chatId
        );

      }

    };

  }, [chatId, isTyping]);

  return (

    <div className="doc-message-input-container">

      {attachment && (

        <div className="doc-selected-file">

          <div>

            <span className="material-symbols-outlined">
              attach_file
            </span>

            <span>
              {attachment.name}
            </span>

          </div>

          <button
            type="button"
            onClick={
              removeAttachment
            }
          >
            ✕

          </button>

        </div>

      )}

      <div className="doc-message-input">

        <textarea
          rows={2}
          value={message}
          placeholder="Type your message..."
          onChange={
            handleMessageChange
          }
          onKeyDown={
            handleKeyDown
          }
        />

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={
            handleFileChange
          }
        />

        <Button
          type="button"
          className="doc-attach-button"
          onClick={() =>
            fileInputRef.current?.click()
          }
        >

          <span className="material-symbols-outlined">
            attach_file
          </span>

        </Button>

        <Button
          type="button"
          className="doc-send-button"
          onClick={
            handleSend
          }
          disabled={
            sending ||
            (
              !message.trim() &&
              !attachment
            )
          }
        >

          <span className="material-symbols-outlined">
            send
          </span>

        </Button>

      </div>

    </div>

  );
}

export default MessageInput;