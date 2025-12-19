import { ClipboardListIcon, Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import { useState, useEffect } from "react";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
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
import LoadingContent from "../../components/ui/LoadingContent";
import SelectDropdown from "../../components/ui/SelectDropdown";
import { useAllDepartments } from "../../hooks/useDepartments";
import { formatDateTime } from "../../utils/utils";

export default function RecruitmentRequests() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const itemsPerPage = 10;

  const userDeptId = user?.department?.id;
  const userDeptName = user?.department?.name || "";
  const nameLower = userDeptName.toLowerCase();
  const isHR =
    nameLower.includes("nhân sự") ||
    nameLower.includes("human resources") ||
    nameLower.includes("hr");
  const shouldRestrictToUserDept = !!userDeptId && !isHR;
  const effectiveDepartmentId = shouldRestrictToUserDept
    ? userDeptId
    : selectedDepartmentId ?? undefined;

  const queryParams = {
    page: currentPage,
    pageSize: itemsPerPage,
    ...(effectiveDepartmentId && { departmentId: effectiveDepartmentId }),
  };

  const { data, isLoading, isError, error, refetch } =
    useRecruitmentRequests(queryParams);

  const deleteMutation = useDeleteRecruitmentRequest();

  const { data: departmentsData } = useAllDepartments();
  const departments = Array.isArray(departmentsData) ? departmentsData : [];

  const currentRequests = Array.isArray(data?.data?.result) ? data.data.result : [];
  const meta = data?.data?.meta;
  const totalPages = meta?.pages || 1;

  useEffect(() => {
    if (isError) {
      const errorMessage =
        error?.response?.data?.message || t("errorLoadingRequests");
      toast.error(errorMessage);
    }
  }, [isError, error, t]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <ContentHeader
          title={t("listRequest")}
          actions={
            <div className="flex items-center gap-4">
              {isHR && (
                <SelectDropdown
                  value={selectedDepartmentId}
                  onChange={setSelectedDepartmentId}
                  options={[
                    { id: null, name: "Tất cả phòng ban" },
                    ...departments.map((d) => ({ id: d.id, name: d.name })),
                  ]}
                  placeholder="Tất cả phòng ban"
                  hideLabel
                  compact
                  className="min-w-[200px]"
                />
              )}
              <Button
                onClick={() => {
                  navigate("/recruitment-requests/new");
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("createNewRequest")}
              </Button>
            </div>
          }
        />
        <div className="flex-1 flex items-center justify-center mt-4">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={t("listRequest")}
        actions={
          <div className="flex items-center gap-4">
            {isHR && (
              <SelectDropdown
                value={selectedDepartmentId}
                onChange={setSelectedDepartmentId}
                options={[
                  { id: null, name: "Tất cả phòng ban" },
                  ...departments.map((d) => ({ id: d.id, name: d.name })),
                ]}
                placeholder="Tất cả phòng ban"
                hideLabel
                compact
                className="min-w-[200px]"
              />
            )}
            <Button
              onClick={() => {
                navigate("/recruitment-requests/new");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("createNewRequest")}
            </Button>
          </div>
        }
      />
      <div className="flex-1 flex flex-col mt-4 min-h-0">
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow overflow-hidden">
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-red-50 sticky top-0 z-10">
                <tr>
                  {tableHeaders(t("id"))}
                  {tableHeaders(t("staffCreated"))}
                  {tableHeaders(t("position"))}
                  {tableHeaders(t("quantity"))}
                  {tableHeaders(t("department"))}
                  {tableHeaders(t("createdDate"))}
                  {tableHeaders(t("status"))}
                </tr>
              </thead>
              <tbody>
                {currentRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8">
                      <EmptyState
                        title={t("noRequestsFound", {
                          defaultValue: "Không có yêu cầu tuyển dụng",
                        })}
                        icon={ClipboardListIcon}
                      />
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
                        className="p-4 text-sm whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {startIndex + index + 1}
                      </td>
                      <td className="p-4 text-sm whitespace-nowrap max-w-[150px] truncate">
                        {request.requester?.name || "N/A"}
                      </td>
                      <td
                        className="p-4 text-sm whitespace-nowrap max-w-[200px] truncate"
                        title={request.title}
                      >
                        {request.title || "N/A"}
                      </td>
                      <td className="p-4 text-sm whitespace-nowrap text-center">
                        {request.quantity || 0}
                      </td>
                      <td className="p-4 text-sm whitespace-nowrap max-w-[150px] truncate">
                        {request.department?.name || "N/A"}
                      </td>
                      <td className="p-4 text-sm whitespace-nowrap">
                        {request.createdAt
                          ? formatDateTime(request.createdAt)
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

          {currentRequests.length > 0 && totalPages > 1 && (
            <div className="flex-shrink-0 flex justify-end items-center p-4 border-t border-gray-200 bg-white">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
