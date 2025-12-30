import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import MenuItem from "./MenuItem";
import {
  Briefcase,
  CalendarDays,
  ClipboardList,
  House,
  Mail,
  UsersRound,
  GitBranch,
  FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isVisible, toggleSidebar, sidebarWidth }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role?.name === "ADMIN";
  const isCEO = user?.role?.name === "CEO";
  const isHRDepartment = user?.department?.id === 2;
  const canAccessEmployees = isAdmin || isCEO || isHRDepartment;

  // Admin: only management; Non-admin: business functions + employees
  const adminMenus = [
    { text: t("accountManagement"), link: "/users", icon: <UsersRound /> },
    { text: t("roleManagement"), link: "/roles", icon: <UsersRound /> },
    { text: t("employeeManagement"), link: "/employees", icon: <UsersRound /> },
    { text: t("workflowManagement"), link: "/workflows", icon: <GitBranch /> },
  ];

  const businessMenus = [
    ...(canAccessEmployees ? [{ text: t("employeeManagement"), link: "/employees", icon: <UsersRound /> }] : []),
    { text: t("recruitmentReq"), link: "/recruitment-requests", icon: <ClipboardList /> },
    { text: t("jobPosition"), link: "/job-positions", icon: <Briefcase /> },
    { text: t("candidate"), link: "/candidates", icon: <UsersRound /> },
    { text: t("offers.title"), link: "/offers", icon: <FileText /> },
    { text: t("calendar"), link: "/calendar", icon: <CalendarDays /> },
    { text: t("email"), link: "/email", icon: <Mail /> },
  ];

  const menuItems = [
    { text: t("home"), link: "/", icon: <House /> },
    ...(isAdmin ? adminMenus : businessMenus),
  ];

  return (
    <aside
      className="fixed z-10 p-4 top-0 left-0 bottom-0
      transition-width duration-300 ease-in-out"
      // className="pt-4 pb-4 pl-4 pr-2 fixed top-0 bottom-0 left-0"
      style={{
        width: sidebarWidth,
        transition: "width 0.3s ease-in-out",
      }}
    >
      <nav
        className="
      h-full flex flex-col truncate bg-white rounded-xl shadow-lg
      border border-[#f3f3f3] "
      >
        <div
          className={`flex items-center ${
            isVisible ? "justify-between" : "justify-center"
          } p-4`}
        >
          {isVisible && (
            <span
              className={`overflow-hidden transition-all duration-300

          `}
            >
              {t("appName")}
            </span>
          )}
          <div
            onClick={toggleSidebar}
            className="p-1 bg-white hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <Menu />
          </div>
        </div>
        <ul
          className="flex-1 p-2 overflow-y-auto truncate
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.text}
              link={item.link}
              text={item.text}
              icon={item.icon}
              isCollapsed={!isVisible}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
