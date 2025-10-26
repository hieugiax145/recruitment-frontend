import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import { useState } from "react";
import Pagination from "../../components/ui/Pagination";
import RequestCard from "./components/RequestCard";
import RequestStatus from "./components/RequestStatus";
import { Navigate, useNavigate } from "react-router-dom";
import ContentHeader from "../../components/ui/ContentHeader";
import Can from "../../components/Can";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import {
  useRecruitmentRequests,
  useDeleteRecruitmentRequest,
} from "./hooks/useRecruitmentRequests";

export default function RecruitmentRequests() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const itemsPerPage = 10;

  // Check if user is MANAGER
  const isManager = user?.role?.name === "MANAGER";

  // Build query params based on role
  const queryParams =
    isManager && user?.department?.id
      ? { departmentId: user.department.id }
      : {};

  // Fetch requests with appropriate filters
  const { data, isLoading, isError, error, refetch } =
    useRecruitmentRequests(queryParams);

  // Using useMutation for delete
  const deleteMutation = useDeleteRecruitmentRequest();

  // Get requests from the query data or use fallback
  // Ensure requests is always an array
  const requests = Array.isArray(data?.data?.result) ? data.data.result : [];

  const handleCheckboxChange = (requestId) => {
    setSelectedRequests((prevSelected) => {
      if (prevSelected.includes(requestId)) {
        return prevSelected.filter((id) => id !== requestId);
      }
      return [...prevSelected, requestId];
    });
  };

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      deleteMutation.mutate(id);
    }
  };

  const tableHeaders = (header) => {
    return (
      <>
        <th className="p-4 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
          {header}
        </th>
      </>
    );
  };

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <div className="text-red-500 text-lg font-medium">
          {error?.response?.data?.message || "Error loading requests"}
        </div>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!data && !isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={t("listRequest")}
        actions={
          <Can allowedRoles={["MANAGER"]}>
            <Button
              onClick={() => {
                navigate("/recruitment-requests/new");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo yêu cầu mới
            </Button>
          </Can>
        }
      />
      <div
        className="flex-1 flex flex-col mt-4 overflow-y-auto
        p-6 bg-white rounded-xl shadow"
      >
        <div className="flex-1 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-red-50">
                <th className="w-12 p-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedRequests.length === currentRequests.length}
                    onChange={() => {
                      if (selectedRequests.length === currentRequests.length) {
                        setSelectedRequests([]);
                      } else {
                        setSelectedRequests(currentRequests.map((r) => r.id));
                      }
                    }}
                  />
                </th>
                {tableHeaders("ID")}
                {tableHeaders("Nhân sự lập phiếu")}
                {tableHeaders("Nhân sự phụ trách")}
                {tableHeaders("Vị trí")}
                {tableHeaders("Số lượng")}
                {tableHeaders("Phòng")}
                {tableHeaders("Ngày tạo")}
                {tableHeaders("Trạng thái")}
              </tr>
            </thead>
            <tbody>
              {currentRequests.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">
                    No recruitment requests found
                  </td>
                </tr>
              ) : (
                currentRequests.map((request, index) => (
                  <tr
                    key={request.id}
                    className="border-b last:border-b-0 border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/recruitment-requests/${request.id}`)
                    }
                  >
                    <td
                      className="p-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 bg-white"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleCheckboxChange(request.id)}
                      />
                    </td>
                    <td
                      className="p-4 text-sm whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {startIndex + index + 1}
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap max-w-[150px] truncate">
                      {request.requester?.name || "N/A"}
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap max-w-[150px] truncate">
                      {request.approver?.name || "N/A"}
                    </td>
                    <td
                      className="p-4 text-sm whitespace-nowrap max-w-[200px] truncate"
                      title={request.title}
                    >
                      {request.title || "N/A"}
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap text-center">
                      {request.numberOfPositions || 0}
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap max-w-[150px] truncate">
                      {request.department?.name || "N/A"}
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap">
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString(
                            "vi-VN"
                          )
                        : "N/A"}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <RequestStatus status={request.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end items-center w-full mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      </div>
    </div>
  );
}
