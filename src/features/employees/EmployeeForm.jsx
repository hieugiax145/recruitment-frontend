import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ContentHeader from "../../components/ui/ContentHeader";
import TextInput from "../../components/ui/TextInput";
import SelectDropdown from "../../components/ui/SelectDropdown";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import { useCreateEmployee, useUpdateEmployee, useEmployee, useDeleteEmployee } from "../../hooks/useEmployees";
import { useAllDepartments } from "../../hooks/useDepartments";
import { useAllPositions } from "../../hooks/usePositions";
import FileUploader from "../../components/ui/FileUploader";
import LoadingContent from "../../components/ui/LoadingContent";
import Can from "../../components/Can";
import { PERMISSIONS } from "../../constants/permissions";
import { usePermission } from "../../hooks/usePermission";

export default function EmployeeForm() {
  const { id } = useParams();
  const isEditPage = !!id;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = usePermission();
  const { data: departmentsData = [] } = useAllDepartments();
  const { data: positionsData = [] } = useAllPositions();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const { data: employeeData, isLoading: isLoadingEmployee } = useEmployee(id, { enabled: isEditPage });
  const formRef = useRef(null);

  const [isEditMode, setIsEditMode] = useState(!isEditPage);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    nationality: "",
    dateOfBirth: "",
    idNumber: "",
    departmentId: null,
    positionId: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const employee = employeeData?.data || {};

  useEffect(() => {
    if (isEditPage && employee && Object.keys(employee).length > 0) {
      setForm({
        name: employee.name || "",
        phone: employee.phone || "",
        email: employee.email || "",
        gender: employee.gender || "",
        address: employee.address || "",
        nationality: employee.nationality || "",
        dateOfBirth: employee.dateOfBirth || "",
        idNumber: employee.idNumber || "",
        departmentId: employee.department?.id || null,
        positionId: employee.position?.id || "",
      });
      if (employee.avatar) {
        setAvatarPreview(employee.avatar);
      }
    }
  }, [employee, isEditPage]);

  const onChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((s) => ({ ...s, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFieldsMap = {
      name: t("employeeName", { defaultValue: "Employee Name" }),
      phone: t("phone", { defaultValue: "Phone" }),
      email: t("email", { defaultValue: "Email" }),
      gender: t("gender", { defaultValue: "Gender" }),
      address: t("address", { defaultValue: "Address" }),
      nationality: t("nationality", { defaultValue: "Nationality" }),
      dateOfBirth: t("dateOfBirth", { defaultValue: "Date of Birth" }),
      idNumber: t("idNumber", { defaultValue: "ID Number" }),
      departmentId: t("department", { defaultValue: "Department" }),
      positionId: t("position", { defaultValue: "Position" }),
    };

    for (const [field, label] of Object.entries(requiredFieldsMap)) {
      const value = form[field];
      if (value === null || value === undefined || String(value).trim() === "") {
        toast.error(`${label} ${t("isRequired", { defaultValue: "is required" })}`);
        return;
      }
    }

    let payload;
    if (avatarFile) {
      payload = new FormData();
      payload.append("name", form.name?.trim());
      payload.append("phone", form.phone);
      payload.append("email", form.email);
      payload.append("gender", form.gender);
      payload.append("address", form.address);
      payload.append("nationality", form.nationality);
      payload.append("dateOfBirth", form.dateOfBirth);
      payload.append("idNumber", form.idNumber);
      if (form.departmentId) payload.append("departmentId", form.departmentId);
      if (form.positionId) payload.append("positionId", Number(form.positionId));
      payload.append("avatar", avatarFile);
    } else {
      payload = {
        name: form.name?.trim(),
        phone: form.phone || undefined,
        email: form.email || undefined,
        gender: form.gender || undefined,
        address: form.address || undefined,
        nationality: form.nationality || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        idNumber: form.idNumber || undefined,
        departmentId: form.departmentId ?? undefined,
        positionId: form.positionId ? Number(form.positionId) : undefined,
      };
    }

    if (isEditPage) {
      updateEmployee.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            setIsEditMode(false);
            setAvatarFile(null);
          },
        }
      );
    } else {
      createEmployee.mutate(payload, {
        onSuccess: () => navigate("/employees"),
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm(t("delete") + "?")) {
      deleteEmployee.mutate(id, { onSuccess: () => navigate("/employees") });
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setAvatarFile(null);
    if (employee && Object.keys(employee).length > 0) {
      setForm({
        name: employee.name || "",
        phone: employee.phone || "",
        email: employee.email || "",
        gender: employee.gender || "",
        address: employee.address || "",
        nationality: employee.nationality || "",
        dateOfBirth: employee.dateOfBirth || "",
        idNumber: employee.idNumber || "",
        departmentId: employee.department?.id || null,
        positionId: employee.position?.id || "",
      });
      setAvatarPreview(employee.avatar || null);
    }
  };

  const isPending = isEditPage ? updateEmployee.isPending : createEmployee.isPending;
  const title = isEditPage ? (employee.name || t("employeeDetail")) : t("addEmployee");

  if (isPending || (isEditPage && isLoadingEmployee)) {
    return (
      <div className="flex flex-col h-full">
        <ContentHeader
          title={title}
          actions={
            <>
              <Button variant="outline" onClick={() => navigate(-1)}>{t("cancel")}</Button>
              {(isEditMode || !isEditPage) && can(isEditPage ? PERMISSIONS.EMPLOYEES_UPDATE : PERMISSIONS.EMPLOYEES_CREATE) && (
                <Button onClick={() => formRef.current?.requestSubmit()}>{t("save")}</Button>
              )}
            </>
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
        title={title}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate(-1)}>{t("cancel")}</Button>
            {isEditPage && !isEditMode ? (
              <>
                {can(PERMISSIONS.EMPLOYEES_UPDATE) && (
                  <Button variant="outline" onClick={() => setIsEditMode(true)}>{t("edit")}</Button>
                )}
                {can(PERMISSIONS.EMPLOYEES_DELETE) && (
                  <Button variant="outline" onClick={handleDelete} disabled={deleteEmployee.isPending}>{t("delete")}</Button>
                )}
              </>
            ) : (
              <>
                {isEditPage && (
                  <Button variant="outline" onClick={handleCancelEdit}>{t("cancel")}</Button>
                )}
                {can(isEditPage ? PERMISSIONS.EMPLOYEES_UPDATE : PERMISSIONS.EMPLOYEES_CREATE) && (
                  <Button onClick={() => formRef.current?.requestSubmit()}>{t("save")}</Button>
                )}
              </>
            )}
          </>
        }
      />
      <div className="flex-1 mt-4">
        <div className="bg-white rounded-xl shadow p-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <TextInput 
                  label={t("employeeName", { defaultValue: "Employee Name" })} 
                  value={form.name} 
                  onChange={onChange("name")} 
                  required 
                  disabled={isEditPage && !isEditMode}
                />
                <TextInput 
                  label={t("email", { defaultValue: "Email" })} 
                  type="email" 
                  value={form.email} 
                  onChange={onChange("email")} 
                  required 
                  disabled={isEditPage && !isEditMode}
                />
                <TextInput 
                  label={t("phone", { defaultValue: "Phone" })} 
                  value={form.phone} 
                  onChange={onChange("phone")} 
                  required 
                  disabled={isEditPage && !isEditMode}
                />
                <div className="grid grid-cols-2 gap-4">
                  <SelectDropdown
                    label={t("gender", { defaultValue: "Gender" })}
                    options={[
                      { id: "Male", name: t("male", { defaultValue: "Male" }) },
                      { id: "Female", name: t("female", { defaultValue: "Female" }) },
                      { id: "Other", name: t("other", { defaultValue: "Other" }) },
                    ]}
                    value={form.gender}
                    onChange={(v) => setForm((s) => ({ ...s, gender: v }))}
                    placeholder={t("gender", { defaultValue: "Gender" })}
                    required
                    disabled={isEditPage && !isEditMode}
                  />
                  <TextInput 
                    label={t("dateOfBirth", { defaultValue: "Date of Birth" })} 
                    type="date" 
                    value={form.dateOfBirth} 
                    onChange={onChange("dateOfBirth")} 
                    required 
                    disabled={isEditPage && !isEditMode}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput 
                    label={t("idNumber", { defaultValue: "ID Number" })} 
                    value={form.idNumber} 
                    onChange={onChange("idNumber")} 
                    required 
                    disabled={isEditPage && !isEditMode}
                  />
                  <TextInput 
                    label={t("nationality", { defaultValue: "Nationality" })} 
                    value={form.nationality} 
                    onChange={onChange("nationality")} 
                    required 
                    disabled={isEditPage && !isEditMode}
                  />
                </div>
                <TextInput 
                  label={t("address", { defaultValue: "Address" })} 
                  value={form.address} 
                  onChange={onChange("address")} 
                  required 
                  disabled={isEditPage && !isEditMode}
                />
                <div className="grid grid-cols-2 gap-4">
                  <SelectDropdown
                    label={t("department", { defaultValue: "Department" })}
                    options={(departmentsData || []).map((d) => ({ id: d.id, name: d.name }))}
                    value={form.departmentId}
                    onChange={(v) => setForm((s) => ({ ...s, departmentId: v }))}
                    placeholder={t("chooseDepartment", { defaultValue: "Choose department" })}
                    required
                    disabled={isEditPage && !isEditMode}
                  />
                  <SelectDropdown
                    label={t("position", { defaultValue: "Position" })}
                    options={(positionsData || []).map((p) => ({ id: p.id, name: `${p.name}${p.level ? ` (${p.level})` : ""}` }))}
                    value={form.positionId}
                    onChange={(v) => setForm((s) => ({ ...s, positionId: v }))}
                    placeholder={t("choosePosition", { defaultValue: "Choose position" })}
                    required
                    disabled={isEditPage && !isEditMode}
                  />
                </div>
              </div>
              <div className="col-span-1 flex flex-col">
                <FileUploader
                  label={t("avatar", { defaultValue: "Avatar" })}
                  onFileChange={setAvatarFile}
                  preview={avatarPreview}
                  setPreview={setAvatarPreview}
                  disabled={(isEditPage && !isEditMode) || isPending}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
