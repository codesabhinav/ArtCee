import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getChatData } from "../Hooks/useSeller";
import { FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "../contexts/LanguageProvider";
import { Link, useNavigate } from "react-router-dom";
import MessagePopupModal from "../modal/MessagePopupModal";
import Cookies from "js-cookie";

function timeAgo(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString();
}

export default function ChatList({ onOpenChat }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedChat, setSelectedChat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const status = Cookies.get("subscription_status");
    const hasActiveSubscription = (status ?? "").toLowerCase() === "active";

    if (!hasActiveSubscription) {
      navigate("/featured");
    }
  }, [navigate]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getChatData()
      .then((data) => {
        if (!mounted) return;
        setChats(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load chats");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const handleChatClick = (chat) => {
    if (onOpenChat) onOpenChat(chat);

    setSelectedChat(chat);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedChat(null), 150);
  };

  if (loading) {
    return (
      <div className="md:max-w-[80%] mx-auto p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Failed to load chats: {error}</div>;
  }

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="bg-white rounded-lg overflow-hidden md:max-w-[80%] mx-auto">
        <div className="flex flex-row items-center justify-between px-4 py-4 gap-3 md:gap-4 md:px-0 border-b">
          <Link
            to="/home"
            className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-3 sm:px-4 py-2 flex items-center"
          >
            <FaArrowLeft className="mr-2 text-xs" /> {t("business.back_to_home") || "Back to Home"}
          </Link>

          <h1 className="text-center align-center text-sm sm:text-lg md:text-xl font-bold flex-1">Inbox</h1>
        </div>

        {chats.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-600">No chats yet</div>
        ) : (
          <ul className="divide-y">
            {chats.map((c) => {
              const other = c.other_user || {};
              const profile = other.profile || {};
              const latest = c.latest_message || {};

              return (
                <li
                  key={c.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleChatClick(c)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleChatClick(c)}
                >
                  {/* avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {profile.profile_picture ? (
                      <img
                        src={profile.profile_picture}
                        alt={other.full_name || "avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-600">
                        {other.full_name ? other.full_name.charAt(0) : "?"}
                      </div>
                    )}
                  </div>

                  {/* name + last message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{other.full_name || "Unknown"}</p>
                          {c.is_active === false && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500">offline</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">{latest.message || ""}</p>
                      </div>

                      <div className="flex flex-col items-end ml-2">
                        <span className="text-[11px] text-gray-400">{timeAgo(c.last_message_at)}</span>

                        {/* {c.unread_count > 0 ? (
                          <span className="mt-2 inline-flex items-center justify-center text-xs font-semibold px-2 py-1 rounded-full bg-teal-500 text-white">
                            {c.unread_count}
                          </span>
                        ) : null} */}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selectedChat && (
        <MessagePopupModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          fullName={selectedChat.other_user?.full_name}
          uuid={selectedChat.other_user?.uuid}
          avatar={selectedChat.other_user?.profile?.profile_picture}
        />
      )}
    </div>
  );
}

ChatList.propTypes = {
  onOpenChat: PropTypes.func,
};

ChatList.defaultProps = {
  onOpenChat: null,
};
