import { useEffect, useRef, useState } from "react";

import Button from "../Button";

import {
  getAvailableUsers,
  createChat,
} from "../../../services/chatService";

import "../../../styles/doctor_chat.css";

function NewChatModal({
  open,
  onClose,
  onChatCreated,
}) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const usersRequestRef = useRef(0);

  const handleClose = () => {
    setUsers([]);
    setFilteredUsers([]);
    setSelectedUser(null);
    setSearch("");
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const requestId = ++usersRequestRef.current;
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await getAvailableUsers();
        if (requestId !== usersRequestRef.current) return;
        const list = response.users || [];
        setUsers(list);
        setFilteredUsers(list);
      } catch (error) {
        if (requestId === usersRequestRef.current) console.error(error);
      } finally {
        if (requestId === usersRequestRef.current) setLoading(false);
      }
    };

    void loadUsers();
    return () => {
      usersRequestRef.current += 1;
    };
  }, [open]);

  const handleSearchChange = (value) => {
    setSearch(value);

    if (!value.trim()) {
      setFilteredUsers(users);
      return;
    }

    const keyword = value.toLowerCase();

    setFilteredUsers(
      users.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(keyword) ||
          user.email?.toLowerCase().includes(keyword) ||
          user.role?.toLowerCase().includes(keyword)
      )
    );
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleCreateChat = async () => {
    if (!selectedUser || creating) return;

    try {
      setCreating(true);

      const response = await createChat(selectedUser._id);

      if (onChatCreated) {
        onChatCreated(response.chat);
      }

      handleClose();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to start chat."
      );
    } finally {
      setCreating(false);
    }
  };

  if (!open) return null;

  return (
    <div className="doc-modal-overlay">
      <div className="doc-new-chat-modal">
        <header className="doc-modal-header">
          <div>
            <h2>New Message</h2>
            <small style={{ color: "#64748b" }}>Select a user to start a conversation</small>
          </div>

          <button
            type="button"
            className="doc-modal-close"
            onClick={handleClose}
          >
            ✕
          </button>
        </header>

        <div className="doc-modal-body">
          <div className="doc-modal-search" style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", color: "#94a3b8" }}>
              search
            </span>

            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{ width: "100%", paddingLeft: "40px", paddingRight: "14px", height: "44px", borderRadius: "12px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div className="doc-chat-user-list">
            {loading ? (
              <div className="doc-chat-empty">
                Loading available users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="doc-chat-empty">
                No users available for chat.
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedUser?._id === user._id;

                return (
                  <button
                    type="button"
                    key={user._id}
                    className={`doc-chat-user-item ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="doc-chat-avatar">
                      {user.profilePhoto ? (
                        <img
                          src={user.profilePhoto}
                          alt={user.fullName}
                        />
                      ) : (
                        <span className="material-symbols-outlined">
                          account_circle
                        </span>
                      )}
                    </div>

                    <div className="doc-chat-user-info" style={{ flex: 1, textAlign: "left" }}>
                      <strong style={{ display: "block", color: "#0f172a" }}>{user.fullName}</strong>
                      <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>{user.email}</span>
                      <small style={{ fontSize: "11px", fontWeight: 600, color: "#16a34a", textTransform: "capitalize" }}>
                        {user.role}
                      </small>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <footer className="doc-modal-footer">
          <Button
            type="button"
            className="doc-modal-cancel"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="doc-modal-submit"
            disabled={!selectedUser || creating}
            onClick={handleCreateChat}
          >
            {creating ? "Starting..." : "Start Chat"}
          </Button>
        </footer>
      </div>
    </div>
  );
}

export default NewChatModal;
