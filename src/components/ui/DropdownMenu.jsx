import { MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/utils";

export default function DropdownMenu({ options = [], position = "right" }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleOptionClick = (e, option) => {
    e.stopPropagation();
    setShowMenu(false);
    if (option.onClick) {
      option.onClick();
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case "left":
        return "left-0";
      case "right":
      default:
        return "right-0";
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
      >
        <MoreVertical className="h-4 w-4 text-gray-600 hover:text-gray-800" />
      </div>

      {showMenu && (
        <div
          className={cn(
            "absolute mt-1 min-w-[160px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1",
            getPositionClass()
          )}
        >
          {options.map((option, index) => {
            // Skip if option is hidden
            if (option.hidden) return null;

            // Render divider
            if (option.divider) {
              return (
                <div
                  key={`divider-${index}`}
                  className="h-px bg-gray-200 my-1"
                />
              );
            }

            // Render menu item
            const Icon = option.icon;
            const textColor =
              option.variant === "danger"
                ? "text-red-600 hover:text-red-700"
                : "text-gray-700 hover:text-gray-900";

            return (
              <div
                key={option.label || index}
                className={cn(
                  "w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 transition-colors cursor-pointer",
                  textColor,
                  option.disabled &&
                    "opacity-50 cursor-not-allowed pointer-events-none"
                )}
                onClick={(e) =>
                  !option.disabled && handleOptionClick(e, option)
                }
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
