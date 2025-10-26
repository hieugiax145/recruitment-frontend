import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AutoTextSize } from "auto-text-size";
import UserDropdown from "./UserDropdown";
import { useNavigate } from "react-router-dom";
const Navbar = ({ isSidebarVisible, title, sidebarWidth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getTitle = () => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment !== "");
    const mainRoute = pathSegments[0] || "";

    switch (mainRoute) {
      case "":
        return t("home");
      case "recruitment-requests":
        return t("recruitmentReq");
      case "job-positions":
        return t("jobPosition");
      case "calendar":
        return t("calendar");
      case "candidate":
        return t("candidate");
      case "orders":
        return t("orders");
      case "email":
        return t("email");
      default:
        return t("home");
    }
  };

  const cameFromMenu = location.state && location.state.from === "menu";
  const canGoBack =
    (!cameFromMenu && Boolean(location.state && location.state.from)) ||
    (typeof window !== "undefined" && window.history.length > 1);

  return (
    <div
      className="flex justify-between fixed
      pr-4 py-4
      transition-all duration-300 ease-in-out z-20
    "
      style={{
        width: `calc(100% - ${sidebarWidth}px)`,
        left: sidebarWidth,
      }}
    >
      <div
        className="flex items-center h-[60px] w-full justify-between bg-white
      rounded-xl shadow-lg border border-[#f3f3f3] px-4 py-2"
      >
        <div className="flex items-center flex-1">
          <div className="text-2xl font-bold">
            <AutoTextSize minFontSizePx={20} maxFontSizePx={30}>
              {title ?? getTitle()}
            </AutoTextSize>
          </div>
        </div>
        <UserDropdown />
      </div>
    </div>
  );
};

export default Navbar;
