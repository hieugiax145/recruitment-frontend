export default function CandidateStatus({ status }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-[#EFF4FF] text-[#3E63DD] border border-[#3E63DD]";
      case "SCREENING":
        return "bg-[#FEF6E7] text-[#F79009] border border-[#F79009]";
      case "INTERVIEW":
        return "bg-[#E0E7FF] text-[#6366F1] border border-[#6366F1]";
      case "OFFER":
        return "bg-[#ECFDF3] text-[#10B981] border border-[#10B981]";
      case "HIRED":
        return "bg-[#E7F6EC] text-[#12B76A] border border-[#12B76A]";
      case "REJECTED":
        return "bg-[#FEE4E2] text-[#F04438] border border-[#F04438]";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      SUBMITTED: "Đã nộp",
      SCREENING: "Sàng lọc",
      INTERVIEW: "Phỏng vấn",
      OFFER: "Offer",
      HIRED: "Đã tuyển",
      REJECTED: "Từ chối",
    };
    return labels[status] || status;
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
