import { useTranslation } from "react-i18next";

export default function RequestStatus({ status }) {
  const { t } = useTranslation();
  const normalizedStatus = status?.toUpperCase();

  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-3 py-0.5 text-xs font-medium min-w-[85px] text-center";
      case "SUBMITTED":
        return "text-blue-600 bg-blue-100 border border-blue-200 rounded-full px-3 py-0.5 text-xs font-medium min-w-[85px] text-center";
      case "PENDING":
        return "text-orange-600 bg-orange-100 border border-orange-200 rounded-full px-3 py-0.5 text-xs font-medium min-w-[85px] text-center";
      case "IN_PROGRESS":
        return "text-indigo-600 bg-indigo-100 border border-indigo-200 rounded-full px-3 py-0.5 text-xs font-medium min-w-[85px] text-center";
      case "APPROVED":
        return "text-green-600 bg-green-100 border border-green-200 rounded-full px-3 py-0.5 text-xs font-medium min-w-[85px] text-center";
      case "REJECTED":
        return "text-red-600 bg-red-100 border border-red-200 rounded-full px-3 py-0.5 text-xs font-medium min-w-[85px] text-center";
      case "RETURNED":
        return "text-yellow-700 bg-yellow-100 border border-yellow-200 rounded-full px-3 py-0.5 text-xs font-medium min-w-[85px] text-center";
      case "CANCELLED":
        return "text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-0.5 text-xs font-medium min-w-[85px] text-center";
      default:
        return "text-indigo-600 bg-indigo-100 border border-indigo-200 rounded-full px-3 py-0.5 text-xs font-medium min-w-[85px] text-center";
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      DRAFT: t("status.draft", "Nháp"),
      SUBMITTED: t("status.submitted", "Đã nộp"),
      PENDING: t("status.pending", "Đang xử lý"),
      IN_PROGRESS: t("status.inProgress", "Đang thực hiện"),
      APPROVED: t("status.approved", "Đã duyệt"),
      REJECTED: t("status.rejected", "Từ chối"),
      RETURNED: t("status.returned", "Trả về"),
      CANCELLED: t("status.cancelled", "Đã hủy"),
    };
    return statusMap[status] || status;
  };

  const statusColor = getStatusColor(normalizedStatus);
  const statusLabel = getStatusLabel(normalizedStatus);

  return (
    <span className={`inline-flex items-center justify-center ${statusColor}`}>
      {statusLabel}
    </span>
  );
}
