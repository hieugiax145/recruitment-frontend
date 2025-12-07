import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import ContentHeader from "../../components/ui/ContentHeader";
import Button from "../../components/ui/Button";
import LoadingContent from "../../components/ui/LoadingContent";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import { useWorkflows, useDeleteWorkflow } from "../../hooks/useWorkflows";
import { toast } from "react-toastify";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import SelectDropdown from "../../components/ui/SelectDropdown";
import { useAllDepartments } from "../../hooks/useDepartments";

export default function Workflows() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const itemsPerPage = 10;

  const { data, isLoading, isError, error } = useWorkflows({
    page: currentPage,
    size: itemsPerPage,
  });
  const deleteWorkflow = useDeleteWorkflow();
  const { ConfirmDialogComponent, showConfirm } = useConfirmDialog();

  // Fetch departments for filter
  const { data: departmentsData } = useAllDepartments();
  const departments = Array.isArray(departmentsData) ? departmentsData : [];

  const allWorkflows = Array.isArray(data?.data?.result) ? data.data.result : [];
  
  // Filter by selected department
  const workflows = selectedDepartmentId
    ? allWorkflows.filter((wf) => wf.departmentId === selectedDepartmentId)
    : allWorkflows;
  const meta = data?.data?.meta;

  useEffect(() => {
    if (isError) {
      const errorMessage = error?.response?.data?.message || t("error");
      toast.error(errorMessage);
    }
  }, [isError, error, t]);

  const totalPages =
    meta?.pages ?? Math.max(1, Math.ceil((meta?.total ?? workflows.length) / itemsPerPage));

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDelete = (workflow) => {
    showConfirm({
      title: t("confirmDelete", { defaultValue: "Xác nhận xóa" }),
      message: `${t("confirmDeleteWorkflow", {
        defaultValue: "Bạn có chắc chắn muốn xóa luồng phê duyệt",
      })} "${workflow.name}"?`,
      variant: "danger",
      onConfirm: () => {
        deleteWorkflow.mutate(workflow.id);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <ContentHeader
          title={t("workflowManagement", { defaultValue: "Quản lý luồng phê duyệt" })}
          actions={
            <div className="flex items-center gap-4">
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
              <Button onClick={() => navigate("/workflows/new")}>
                <Plus className="h-4 w-4 mr-2" />
                {t("addWorkflow", { defaultValue: "Thêm luồng phê duyệt" })}
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
        title={t("workflowManagement", { defaultValue: "Quản lý luồng phê duyệt" })}
        actions={
          <div className="flex items-center gap-4">
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
            <Button onClick={() => navigate("/workflows/new")}>
              <Plus className="h-4 w-4 mr-2" />
              {t("addWorkflow", { defaultValue: "Thêm luồng phê duyệt" })}
            </Button>
          </div>
        }
      />

      <div className="flex-1 flex flex-col mt-4 min-h-0">
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow overflow-hidden">
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("id", { defaultValue: "ID" })}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("workflowName", { defaultValue: "Tên luồng" })}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("description", { defaultValue: "Mô tả" })}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("type", { defaultValue: "Loại" })}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("steps", { defaultValue: "Số bước" })}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("status", { defaultValue: "Trạng thái" })}
                  </th>
                  <th className="p-4 text-center text-sm font-medium text-gray-600">
                    {t("actions", { defaultValue: "Thao tác" })}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {workflows.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8">
                      <EmptyState title={t("noData", { defaultValue: "Không có dữ liệu" })} />
                    </td>
                  </tr>
                ) : (
                  workflows.map((workflow) => (
                    <tr
                      key={workflow.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/workflows/${workflow.id}`)}
                    >
                      <td className="p-4 text-sm text-gray-900">#{workflow.id}</td>
                      <td className="p-4 text-sm font-medium text-gray-900">
                        {workflow.name || "-"}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {workflow.description || "-"}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                          {workflow.type || "RECRUITMENT"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {workflow.steps?.length || 0} {t("steps", { defaultValue: "bước" })}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {workflow.isActive ? (
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                            {t("active", { defaultValue: "Hoạt động" })}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">
                            {t("inactive", { defaultValue: "Không hoạt động" })}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(workflow);
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                          title={t("delete", { defaultValue: "Xóa" })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {workflows.length > 0 && (
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
      {ConfirmDialogComponent}
    </div>
  );
}
