import { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";

import doctorImage from "../../../assets/images/doctors/doctor-6.jpg";

import Navbar from "../../../components/common/Navbar";
import Notification from "../../../components/common/Notification/Notification";
import SignOut from "../../../components/common/SignOut";

import useAuth from "../../../hooks/useAuth";

import socketService from "../../../services/socketService";
import {
  getChats,
} from "../../../services/chatService";

import {
  doctorNotifications,
} from "../data/communications";

import "../../../styles/doctor_dashboard.css";

function DashboardHeader({
  openPanel,
  onTogglePanel,
  notificationButtonRef,
  notificationPanelRef,
}) {

  /* ==========================================================
     Router
  ========================================================== */

  const location =
    useLocation();

  const isChatOpen =
    location.pathname ===
    "/doctor/inbox";

  const isNotificationOpen =
    openPanel ===
    "notifications";

  /* ==========================================================
     Auth
  ========================================================== */

  const { user } =
    useAuth();

  const profile =
    user || {

      name:
        "Dr. Julianne Moore",

      roleTitle:
        "Senior Cardiologist",

      avatar:
        doctorImage,

    };

  /* ==========================================================
     State
  ========================================================== */

  const [
    unreadChats,
    setUnreadChats,
  ] = useState(0);

  const [
    unreadNotifications,
    setUnreadNotifications,
  ] = useState(
    doctorNotifications.length
  );

  /* ==========================================================
     Load Chat Count
  ========================================================== */

  useEffect(() => {

    loadChatCount();

  }, []);

  /* ==========================================================
     Socket Events
  ========================================================== */

  useEffect(() => {

    socketService.connect();

    socketService.onRefreshChats(
      () => {

        loadChatCount();

      }
    );

    socketService.onReceiveMessage(
      () => {

        loadChatCount();

      }
    );

    socketService.onNotification(
      () => {

        setUnreadNotifications(
          previous =>
            previous + 1
        );

      }
    );

    return () => {

      socketService.off(
        "refresh-chats"
      );

      socketService.off(
        "receive-message"
      );

      socketService.off(
        "new-notification"
      );

    };

  }, []);

  /* ==========================================================
     Chat Counter
  ========================================================== */

  const loadChatCount =
    async () => {

      try {

        const response =
          await getChats();

        const chats =
          response.chats || [];

        const total =
          chats.reduce(

            (
              count,
              chat
            ) =>

              count +
              (
                chat.unreadCount ||
                0
              ),

            0

          );

        setUnreadChats(
          total
        );

      }

      catch (
        error
      ) {

        console.error(
          error
        );

      }

    };

  /* ==========================================================
     Brand Click
  ========================================================== */

  const handleLinkClick =
    (
      event,
      href
    ) => {

      event.preventDefault();

      if (
        href === "#"
      ) {

        return;

      }

      const target =
        document.querySelector(
          href
        );

      if (
        target
      ) {

        window.scrollTo({

          top:
            target.offsetTop -
            80,

          behavior:
            "smooth",

        });

      }

    };
      /* ==========================================================
     Render
  ========================================================== */

  return (

    <Navbar
      className="doc-dashboard-header"
      contentClassName="doc-header-content"

      brand={

        <div
          className="doc-brand"
          onClick={(event) =>
            handleLinkClick(
              event,
              "#home"
            )
          }
        >

          <div
            className="doc-brand-mark"
            aria-hidden="true"
          >

            <span className="material-symbols-outlined filled">
              medical_services
            </span>

          </div>

          <div>

            <p className="doc-brand-name">
              Clinic Connect
            </p>

            <p className="doc-brand-subtitle">
              Doctor Portal
            </p>

          </div>

        </div>

      }

      actions={

        <div className="doc-header-actions">

          <span
            className="doc-header-divider"
            aria-hidden="true"
          />

          {/* ======================================
              Chat
          ======================================= */}

          <Link
            to={
              isChatOpen
                ? "/doctor/dashboard"
                : "/doctor/inbox"
            }
            className={`doc-icon-button ${
              isChatOpen
                ? "is-open"
                : ""
            }`}
            aria-label={
              isChatOpen
                ? "Close inbox"
                : "Open inbox"
            }
          >

            <FiMessageSquare />

            {unreadChats > 0 && (

              <span className="doc-chat-badge">

                {unreadChats > 99
                  ? "99+"
                  : unreadChats}

              </span>

            )}

          </Link>

          {/* ======================================
              Notifications
          ======================================= */}

          <div className="doc-navbar-menu">

            <button
              type="button"
              className={`doc-icon-button doc-notification-button ${
                isNotificationOpen
                  ? "is-open"
                  : ""
              }`}
              aria-label={
                isNotificationOpen
                  ? "Close notifications"
                  : "Open notifications"
              }
              aria-controls="doctor-notifications"
              aria-expanded={
                isNotificationOpen
              }
              onClick={() =>
                onTogglePanel(
                  "notifications"
                )
              }
              ref={
                notificationButtonRef
              }
            >

              <span className="material-symbols-outlined">
                notifications
              </span>

              {unreadNotifications >
                0 && (

                <span className="doc-notification-count">

                  {unreadNotifications >
                  99
                    ? "99+"
                    : unreadNotifications}

                </span>

              )}

            </button>

            {isNotificationOpen && (

              <section
                id="doctor-notifications"
                className="doc-notification-dropdown"
                ref={
                  notificationPanelRef
                }
                aria-label="Notifications"
              >

                <div className="doc-popover-heading">

                  <h2>
                    Notifications
                  </h2>

                  <button
                    type="button"
                    className="doc-clear-notifications"
                    onClick={() =>
                      setUnreadNotifications(
                        0
                      )
                    }
                  >

                    Mark all read

                  </button>

                </div>

                <Notification
                  items={
                    doctorNotifications
                  }
                />

              </section>

            )}

          </div>

          {/* ======================================
              Profile
          ======================================= */}

          <SignOut
            triggerClassName="doc-doctor-profile"
            user={profile}
          >

            <div className="doc-doctor-details">

              <strong>

                {profile.fullName ||
                  profile.name}

              </strong>

              <span>

                {profile.roleTitle ||
                  profile.role}

              </span>

            </div>

            <img
              src={
                profile.avatar ||
                doctorImage
              }
              alt={
                profile.fullName ||
                profile.name
              }
            />

          </SignOut>

        </div>

      }
        />
  );

}

export default DashboardHeader;