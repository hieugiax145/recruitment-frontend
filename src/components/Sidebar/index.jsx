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
} from "lucide-react";
import { usePermission } from "../../hooks/usePermission";
import { PERMISSIONS } from "../../constants/permissions";

const Sidebar = ({ isVisible, toggleSidebar, sidebarWidth }) => {
  const { t } = useTranslation();
  const { can } = usePermission();
  
  const menuItems = [
    { 
      text: t("home"), 
      link: "/", 
      icon: <House />,
      permission: null // Dashboard accessible to all authenticated users
    },
    { 
      text: t("accountManagement", { defaultValue: "Quản lý tài khoản" }), 
      link: "/users", 
      icon: <UsersRound />,
      permission: PERMISSIONS.USERS_READ
    },
    { 
      text: t("roleManagement", { defaultValue: "Quản lý vai trò" }), 
      link: "/roles", 
      icon: <UsersRound />,
      permission: PERMISSIONS.ROLES_READ
    },
    { 
      text: t("employeeManagement", { defaultValue: "Quản lý nhân sự" }), 
      link: "/employees", 
      icon: <UsersRound />,
      permission: PERMISSIONS.EMPLOYEES_READ
    },
    { 
      text: t("workflowManagement", { defaultValue: "Luồng phê duyệt" }), 
      link: "/workflows", 
      icon: <GitBranch />,
      permission: PERMISSIONS.RECRUITMENT_REQUESTS_READ // Workflows related to recruitment
    },
    {
      text: t("recruitmentReq"),
      link: "/recruitment-requests",
      icon: <ClipboardList />,
      permission: PERMISSIONS.RECRUITMENT_REQUESTS_READ
    },
    { 
      text: t("jobPosition"), 
      link: "/job-positions", 
      icon: <Briefcase />,
      permission: PERMISSIONS.JOB_POSITIONS_READ
    },
    { 
      text: t("candidate"), 
      link: "/candidates", 
      icon: <UsersRound />,
      permission: PERMISSIONS.CANDIDATES_READ
    },
    { 
      text: t("calendar"), 
      link: "/calendar", 
      icon: <CalendarDays />,
      permission: PERMISSIONS.SCHEDULES_READ
    },
    { 
      text: t("email"), 
      link: "/email", 
      icon: <Mail />,
      permission: null // Email accessible to all authenticated users
    },
  ];

  // Filter menu items based on permissions
  const visibleMenuItems = menuItems.filter(item => {
    if (!item.permission) return true; // No permission required
    return can(item.permission);
  });

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
          {visibleMenuItems.map((item) => (
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
