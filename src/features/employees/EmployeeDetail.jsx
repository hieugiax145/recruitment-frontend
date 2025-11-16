import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ContentHeader from "../../components/ui/ContentHeader";
import Button from "../../components/ui/Button";
import LoadingContent from "../../components/ui/LoadingContent";
import { useEmployee, useDeleteEmployee } from "../../hooks/useEmployees";
import { toast } from "react-toastify";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useEmployee(id);
  const deleteEmployee = useDeleteEmployee();

  const employee = data?.data || {};

  if (isError) {
    const msg = error?.response?.data?.message || t("error");
    toast.error(msg);
  }

  const handleDelete = () => {
    if (window.confirm(t("delete") + "?")) {
      deleteEmployee.mutate(id, { onSuccess: () => navigate("/employees") });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={employee.name || employee.fullName || t("employeeDetail") || "Employee Detail"}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate(-1)}>{t("cancel")}</Button>
            <Button variant="outline" onClick={handleDelete} disabled={deleteEmployee.isLoading}>{t("delete")}</Button>
          </>
        }
      />
      <div className="flex-1 mt-4">
        <div className="bg-white rounded-xl shadow p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40"><LoadingContent /></div>
          ) : (
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <div className="font-medium text-gray-500">{t("employeeName")}</div>
                <div className="text-gray-900">{employee.name || employee.fullName || "-"}</div>
              </div>
              <div>
                <div className="font-medium text-gray-500">{t("email")}</div>
                <div className="text-gray-900">{employee.email || "-"}</div>
              </div>
              <div>
                <div className="font-medium text-gray-500">{t("phone")}</div>
                <div className="text-gray-900">{employee.phone || "-"}</div>
              </div>
              <div>
                <div className="font-medium text-gray-500">{t("department")}</div>
                <div className="text-gray-900">{employee.department?.name || "-"}</div>
              </div>
              <div>
                <div className="font-medium text-gray-500">{t("position")}</div>
                <div className="text-gray-900">{employee.position?.name || "-"}</div>
              </div>
              <div>
                <div className="font-medium text-gray-500">{t("positionLevel")}</div>
                <div className="text-gray-900">{employee.position?.level || "-"}</div>
              </div>
              <div>
                <div className="font-medium text-gray-500">{t("status")}</div>
                <div className="text-gray-900">{employee.status === "ACTIVE" ? t("active") : t("inactive")}</div>
              </div>
              <div>
                <div className="font-medium text-gray-500">{t("manager")}</div>
                <div className="text-gray-900">{employee.manager?.name || "-"}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
