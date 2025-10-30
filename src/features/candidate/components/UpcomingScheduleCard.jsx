import { Clock, Calendar } from "lucide-react";

export default function UpcomingScheduleCard() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock size={18} />
        Lịch sắp tới
      </h3>
      <div className="text-center py-8 text-gray-400">
        <Calendar size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">Chưa có lịch hẹn</p>
      </div>
    </div>
  );
}
