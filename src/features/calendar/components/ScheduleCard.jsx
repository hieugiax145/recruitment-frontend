import { useTranslation } from "react-i18next";

export default function ScheduleCard({ schedule, onClick }) {
  const { t } = useTranslation();
  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeString;
    }
  };

  const isDone = schedule.status === "DONE";
  const bgColor = isDone ? "bg-gray-50" : "bg-red-50";
  const borderColor = isDone ? "border-gray-200" : "border-red-200";
  const hoverBgColor = isDone ? "hover:bg-gray-100" : "hover:bg-red-100";
  const titleColor = isDone ? "text-gray-700" : "text-red-700";
  const timeColor = isDone ? "text-gray-600" : "text-red-600";

  return (
    <div
      className={`${bgColor} border ${borderColor} rounded-md p-1.5 mb-1 cursor-pointer ${hoverBgColor} transition-colors`}
      title={schedule.title || schedule.description}
      onClick={onClick}
    >
      <div className={`text-xs font-medium ${titleColor} truncate`}>
        {schedule.title || t("common.noTitle")}
      </div>
      <div className={`text-xs ${timeColor}`}>
        {formatTime(schedule.startTime)}
        {schedule.endTime && ` - ${formatTime(schedule.endTime)}`}
      </div>
    </div>
  );
}
