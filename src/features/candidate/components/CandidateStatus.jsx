import { useTranslation } from "react-i18next";

export default function CandidateStatus({ status }) {
  const { t } = useTranslation();

  const getStatusStyle = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-[#EFF6FF] text-[#3B82F6] border border-[#3B82F6]";
      case "REVIEWING":
        return "bg-[#EEF2FF] text-[#6366F1] border border-[#6366F1]";
      case "INTERVIEW":
        return "bg-[#FEF3C7] text-[#F59E0B] border border-[#F59E0B]";
      case "OFFER":
        return "bg-[#F5F3FF] text-[#8B5CF6] border border-[#8B5CF6]";
      case "HIRED":
        return "bg-[#D1FAE5] text-[#10B981] border border-[#10B981]";
      case "REJECTED":
        return "bg-[#FEE2E2] text-[#EF4444] border border-[#EF4444]";
      case "ARCHIVED":
        return "bg-[#F3F4F6] text-[#6B7280] border border-[#6B7280]";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      SUBMITTED: "Đã nộp",
      REVIEWING: "Đang xem xét",
      INTERVIEW: "Phỏng vấn",
      OFFER: "Offer",
      HIRED: "Đã tuyển",
      REJECTED: "Từ chối",
      ARCHIVED: "Lưu trữ",
    };
    return statusMap[status] || status;
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyle(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
