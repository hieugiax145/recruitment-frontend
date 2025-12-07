export const STATUS_CONFIG = {
  // Candidate Statuses
  SUBMITTED: {
    label: "Đã nộp",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-300",
  },
  REVIEWING: {
    label: "Đang xem xét",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-800",
    borderColor: "border-indigo-300",
  },
  INTERVIEW: {
    label: "Phỏng vấn",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-300",
  },
  OFFER: {
    label: "Offer",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-300",
  },
  HIRED: {
    label: "Đã tuyển",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-300",
  },
  REJECTED: {
    label: "Từ chối",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-300",
  },
  ARCHIVED: {
    label: "Lưu trữ",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    borderColor: "border-gray-300",
  },

  // Offer & Approval Statuses
  PENDING: {
    label: "Chờ duyệt",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-300",
  },
  APPROVED: {
    label: "Đã phê duyệt",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-300",
  },
  RETURNED: {
    label: "Yêu cầu chỉnh sửa",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
    borderColor: "border-orange-300",
  },
  ACCEPTED: {
    label: "Đã chấp nhận",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-300",
  },
  CANCELLED: {
    label: "Đã hủy",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    borderColor: "border-gray-300",
  },
};

export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || {
    label: status,
    bgColor: "bg-gray-200",
    textColor: "text-gray-900",
    borderColor: "border-gray-400",
  };
};
