import { useNotifications, useMarkAllNotificationsAsRead } from "./hooks/useNotifications";
import { Bell, CheckCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function NotificationsDropdown() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  console.log("Notifications:", notifications);
  console.log("Unread count:", unreadCount);
  console.log("Is loading:", isLoading);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = () => {
    // Close dropdown when clicking on a notification
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors duration-200"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
            <h3 className="text-base font-semibold text-gray-900">Thông báo</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">{unreadCount} thông báo chưa đọc</p>
            )}
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-6 text-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Đang tải...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Không có thông báo nào</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    onClick={handleNotificationClick}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${!n.read ? "bg-blue-50/30" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      {!n.read && (
                        <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-5">
                            {n.title || n.message || "(Không có tiêu đề)"}
                          </h4>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {n.createdAt ? new Date(n.createdAt).toLocaleDateString("vi-VN") : ""}
                          </span>
                        </div>
                        {n.message && n.title !== n.message && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-4">
                            {n.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsRead.isPending || unreadCount === 0}
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  <CheckCheck className="w-4 h-4" />
                  {markAllAsRead.isPending ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors duration-150 ml-auto">
                  Xem tất cả thông báo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
