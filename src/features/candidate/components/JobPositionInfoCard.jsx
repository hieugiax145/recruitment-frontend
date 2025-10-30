import { Briefcase, Building } from "lucide-react";

export default function JobPositionInfoCard({
  jobPositionTitle,
  departmentName,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Briefcase size={18} />
        Vị trí ứng tuyển
      </h3>
      <div className="space-y-3">
        <div>
          <div className="text-sm text-gray-500 mb-1">Vị trí</div>
          <div className="font-medium text-gray-900">
            {jobPositionTitle || "-"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Phòng ban</div>
          <div className="flex items-center gap-2 text-gray-900">
            <Building size={16} />
            <span>{departmentName || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
