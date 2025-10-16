import { useTranslation } from "react-i18next";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "./MenuItem";

const Sidebar = ({ isVisible, toggleSidebar , sidebarWidth }) => {
  const { t } = useTranslation();
  const menuItems = [
    { text: t("home"), link: "/", icon: <HomeRoundedIcon /> },
    { text: t("recruitmentReq"), link: "/recruitment-requests", icon: <WorkIcon /> },
    { text: t("jobPosition"), link: "/job-positions", icon: <WorkIcon /> },
    { text: t("candidate"), link: "/candidate", icon: <PeopleOutlineIcon /> },
    { text: t("calendar"), link: "/calendar", icon: <CalendarTodayIcon /> },
    { text: t("email"), link: "/email", icon: <PeopleOutlineIcon /> },
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
      <nav className="
      h-full flex flex-col truncate bg-white rounded-xl shadow-lg
      border border-[#f3f3f3] ">
        <div className="flex items-center justify-between p-4">
          <span
            className={`overflow-hidden transition-all duration-300
      
          `}
          >
            Title
          </span>
          <div
            onClick={toggleSidebar}
            className="p-1 bg-white hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <MenuIcon />
          </div>
        </div>
        <ul className="flex-1 p-2 overflow-y-auto truncate
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
