import { useEffect, useMemo, useState } from "react";

import Button from "../../../components/common/Button";

import {
  getAvailableUsers,
  createChat,
} from "../../../services/chatService";

import socketService from "../../../services/socketService";

import "../../../styles/doctor_chat.css";

function NewChatModal({
  open,
  onClose,
  onChatCreated,
}) {

  /* ==========================================================
     State
  ========================================================== */

  const [users, setUsers] =
    useState([]);

  const [filteredUsers, setFilteredUsers] =
    useState([]);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  /* ==========================================================
     Load Users
  ========================================================== */

  useEffect(() => {

    if (!open) return;

    loadUsers();

  }, [open]);

  /* ==========================================================
     Reset Modal
  ========================================================== */

  useEffect(() => {

    if (open) return;

    setUsers([]);

    setFilteredUsers([]);

    setSelectedUser(null);

    setSearch("");

    setLoading(false);

    setCreating(false);

  }, [open]);

  /* ==========================================================
     Debounced Search
  ========================================================== */

  useEffect(() => {

    const timer =
      setTimeout(() => {

        if (!search.trim()) {

          setFilteredUsers(users);

          return;

        }

        const keyword =
          search.toLowerCase();

        setFilteredUsers(

          users.filter((user) => {

            return (

              user.fullName
                ?.toLowerCase()
                .includes(keyword)

              ||

              user.email
                ?.toLowerCase()
                .includes(keyword)

              ||

              user.role
                ?.toLowerCase()
                .includes(keyword)

              ||

              user.specialization
                ?.toLowerCase()
                .includes(keyword)

              ||

              user.department
                ?.toLowerCase()
                .includes(keyword)

            );

          })

        );

      }, 250);

    return () =>
      clearTimeout(timer);

  }, [search, users]);

  /* ==========================================================
     Load Available Users
  ========================================================== */

  const loadUsers = async () => {

    try {

      setLoading(true);

      const response =
        await getAvailableUsers();

      const availableUsers =
        response.users || [];

      setUsers(
        availableUsers
      );

      setFilteredUsers(
        availableUsers
      );

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to load users."
      );

    } finally {

      setLoading(false);

    }

  };
    /* ==========================================================
     Select User
  ========================================================== */

  const handleSelectUser = (
    user
  ) => {

    setSelectedUser(user);

  };

  /* ==========================================================
     Create Chat
  ========================================================== */

  const handleCreateChat =
    async () => {

      if (
        !selectedUser ||
        creating
      ) {

        return;

      }

      try {

        setCreating(true);

        const response =
          await createChat(
            selectedUser._id
          );

        const chat =
          response.chat;

        if (
          onChatCreated
        ) {

          onChatCreated(
            chat
          );

        }

        /* ======================================
           Refresh Chats
        ======================================= */

        socketService.refreshChats(

          chat.participants.map(
            (participant) =>
              participant._id
          )

        );

        /* ======================================
           Join Chat
        ======================================= */

        socketService.joinChat(
          chat._id
        );

        handleClose();

      } catch (error) {

        console.error(error);

        alert(

          error.response?.data
            ?.message ||

          "Unable to create conversation."

        );

      } finally {

        setCreating(false);

      }

    };

  /* ==========================================================
     Close Modal
  ========================================================== */

  const handleClose = () => {

    setSelectedUser(null);

    setSearch("");

    setUsers([]);

    setFilteredUsers([]);

    onClose();

  };

  /* ==========================================================
     Online Users
  ========================================================== */

  const onlineUsers =
    useMemo(() => {

      const socket =
        socketService.getSocket();

      if (!socket) {
        return [];
      }

      return [];

    }, []);

  /* ==========================================================
     Selected User Details
  ========================================================== */

  const selectedUserDetails =
    useMemo(() => {

      if (!selectedUser) {
        return null;
      }

      return {

        ...selectedUser,

        online:
          onlineUsers.includes(
            selectedUser._id
          ),

      };

    }, [
      selectedUser,
      onlineUsers,
    ]);

  /* ==========================================================
     Loading View
  ========================================================== */

  if (!open) {

    return null;

  }
    /* ==========================================================
     Render
  ========================================================== */

  return (

    <div className="doc-modal-overlay">

      <div className="doc-new-chat-modal">

        {/* ======================================
            Header
        ======================================= */}

        <div className="doc-modal-header">

          <h2>
            Start New Conversation
          </h2>

          <button
            type="button"
            className="doc-modal-close"
            onClick={handleClose}
          >
            ✕

          </button>

        </div>

        {/* ======================================
            Search
        ======================================= */}

        <div className="doc-modal-body">

          <div className="doc-chat-search">

            <span className="material-symbols-outlined">
              search
            </span>

            <input
              type="text"
              placeholder="Search doctor, patient, email..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          {/* ======================================
              User List
          ======================================= */}

          {loading ? (

            <div className="doc-chat-empty">

              <span className="material-symbols-outlined">
                progress_activity
              </span>

              <p>
                Loading users...
              </p>

            </div>

          ) : filteredUsers.length === 0 ? (

            <div className="doc-chat-empty">

              <span className="material-symbols-outlined">
                person_search
              </span>

              <p>
                No users found.
              </p>

            </div>

          ) : (

            <div className="doc-chat-user-list">

              {filteredUsers.map(
                (user) => {

                  const isSelected =
                    selectedUser?._id ===
                    user._id;

                  const isOnline =
                    onlineUsers.includes(
                      user._id
                    );

                  return (

                    <button
                      key={user._id}
                      type="button"
                      className={`doc-chat-user-item ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectUser(
                          user
                        )
                      }
                    >

                      <div className="doc-chat-avatar">

                        {user.profilePhoto ? (

                          <img
                            src={
                              user.profilePhoto
                            }
                            alt={
                              user.fullName
                            }
                          />

                        ) : (

                          <span className="material-symbols-outlined">
                            account_circle
                          </span>

                        )}

                        {isOnline && (
                          <span className="doc-online-indicator" />
                        )}

                      </div>

                      <div className="doc-chat-user-info">

                        <strong>
                          {user.fullName}
                        </strong>

                        <small>
                          {user.email}
                        </small>

                        <span className="doc-chat-role">
                          {user.role}
                        </span>

                        {(user.department ||
                          user.specialization) && (

                          <p className="doc-chat-user-meta">

                            {user.department}

                            {user.department &&
                              user.specialization &&
                              " • "}

                            {user.specialization}

                          </p>

                        )}

                      </div>

                    </button>

                  );

                }
              )}

            </div>

          )}

        </div>

        {/* ======================================
            Footer
        ======================================= */}

        <div className="doc-modal-footer">

          <Button
            className="doc-secondary-button"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            className="doc-primary-button"
            type="button"
            disabled={
              !selectedUser ||
              creating
            }
            onClick={
              handleCreateChat
            }
          >
            {creating
              ? "Creating..."
              : "Start Chat"}
          </Button>

        </div>

      </div>

    </div>

  );

}

export default NewChatModal;