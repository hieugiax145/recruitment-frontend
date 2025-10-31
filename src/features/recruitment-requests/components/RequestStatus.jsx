import { useTranslation } from "react-i18next";

export default function RequestStatus({ status }) {
  const { t } = useTranslation();
  // Normalize status to uppercase for consistent comparison
  const normalizedStatus = status?.toUpperCase();

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-[#00B300] bg-[#F0FFF0] border border-[#00B300] rounded-[25px] px-4 py-0.5 text-xs inline-block min-w-[85px] text-center";
      case "REJECTED":
        return "text-[#FF0000] bg-[#FFF0F0] border border-[#FF0000] rounded-[25px] px-4 py-0.5 text-xs inline-block min-w-[85px] text-center";
      case "PENDING":
        return "text-[#FFA500] bg-[#FFF8E1] border border-[#FFA500] rounded-[25px] px-4 py-0.5 text-xs inline-block min-w-[85px] text-center";
      case "IN_PROGRESS":
        return "text-[#7B61FF] bg-[#F4F1FE] border border-[#7B61FF] rounded-[25px] px-4 py-0.5 text-xs inline-block min-w-[85px] text-center";
      default:
        return "text-[#7B61FF] bg-[#F4F1FE] border border-[#7B61FF] rounded-[25px] px-4 py-0.5 text-xs inline-block min-w-[85px] text-center";
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      APPROVED: "status.approved",
      PENDING: "status.pending",
      REJECTED: "status.rejected",
      IN_PROGRESS: "status.inProgress",
    };
    return t(statusMap[status] || status);
  };

  const statusColor = getStatusColor(normalizedStatus);
  const statusLabel = getStatusLabel(normalizedStatus);

  return (
    <span className={`inline-flex items-center justify-center ${statusColor}`}>
      {statusLabel}
    </span>
  );
}
