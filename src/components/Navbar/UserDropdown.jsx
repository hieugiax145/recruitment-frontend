import React from "react";
import { useTranslation } from "react-i18next";
import UserIcon from "@mui/icons-material/Person";
import LanguageSwitcher from "./LanguageSwitcher";

const UserDropdown = () => {
    const { t } = useTranslation();
  return (
    <div className="relative group">
      <div className="flex items-center justify-center rounded-lg
      transition bg-white hover:bg-gray-200 p-2 gap-2 cursor-pointer">
        <UserIcon />
        <>Hello</>
      </div>

      {/* menu */}
      <div
        className="
          absolute right-0 mt-2
          opacity-0 -translate-y-1 pointer-events-none
          group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
          transition duration-200
          bg-white shadow-lg rounded-lg z-10 border border-gray-100
          [min-width:150px]
          [&::before]:content-[''] [&::before]:absolute [&::before]:-top-2 [&::before]:left-0
          [&::before]:w-full [&::before]:h-2
        "
      >
        <ul className="py-2 text-sm text-gray-700">
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{t('profile')}</li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{t('settings')}</li>
          <li className="flex items-center gap-4 px-4 py-2">{t('language')} <span><LanguageSwitcher /></span></li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-100">{t('logout')}</li>
        </ul>
      </div>
    </div>
  );
};

export default UserDropdown;
