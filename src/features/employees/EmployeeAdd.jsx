import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ContentHeader from "../../components/ui/ContentHeader";
import TextInput from "../../components/ui/TextInput";
import SelectDropdown from "../../components/ui/SelectDropdown";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateEmployee } from "../../hooks/useEmployees";
import { useAllDepartments } from "../../hooks/useDepartments";

export default function EmployeeAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: departmentsData = [] } = useAllDepartments();
  const createEmployee = useCreateEmployee();

  const [form, setForm] = useState({
    code: "",
    name: "",
    email: "",
    phone: "",
    departmentId: null,
    positionTitle: "",
    startDate: "",
    active: true,
  });

  const onChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((s) => ({ ...s, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.code || !form.name) {
      toast.error(t("error"));
      return;
    }
    const payload = { ...form };
    createEmployee.mutate(payload, {
      onSuccess: () => navigate("/employees"),
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={t("addEmployee")}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate(-1)}>{t("cancel")}</Button>
            <Button type="submit" disabled={createEmployee.isLoading}>{t("save")}</Button>
          </>
        }
      />
      <div className="flex-1 mt-4">
        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <TextInput label={t("employeeCode")} value={form.code} onChange={onChange("code")} required />
              <TextInput label={t("employeeName")} value={form.name} onChange={onChange("name")} required />
              <TextInput label={t("email")} type="email" value={form.email} onChange={onChange("email")} />
              <TextInput label={t("phone")} value={form.phone} onChange={onChange("phone")} />
              <SelectDropdown
                label={t("department")}
                options={(departmentsData || []).map((d) => ({ id: d.id, name: d.name }))}
                value={form.departmentId}
                onChange={(v) => setForm((s) => ({ ...s, departmentId: v }))}
                placeholder={t("chooseDepartment")}
              />
              <TextInput label={t("position")} value={form.positionTitle} onChange={onChange("positionTitle")} />
              <TextInput label={t("startDate")} type="date" value={form.startDate} onChange={onChange("startDate")} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((s) => ({ ...s, active: e.target.checked }))} />
              <span className="text-sm text-gray-700">{form.active ? t("active") : t("inactive")}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
