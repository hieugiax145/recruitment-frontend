export default function ScheduleCard({ schedule, onClick }) {
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

  return (
    <div
      className="bg-red-50 border border-red-200 rounded-md p-1.5 mb-1 cursor-pointer hover:bg-red-100 transition-colors"
      title={schedule.title || schedule.description}
      onClick={onClick}
    >
      <div className="text-xs font-medium text-red-700 truncate">
        {schedule.title || "Không có tiêu đề"}
      </div>
      <div className="text-xs text-red-600">
        {formatTime(schedule.startTime)}
        {schedule.endTime && ` - ${formatTime(schedule.endTime)}`}
      </div>
    </div>
  );
}
