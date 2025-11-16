import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import ContentHeader from "../../components/ui/ContentHeader";
import TextInput from "../../components/ui/TextInput";
import SelectDropdown from "../../components/ui/SelectDropdown";
import Button from "../../components/ui/Button";
import LoadingContent from "../../components/ui/LoadingContent";
import { useAllRoles } from "../../hooks/useRoles";
import { useCreateUser, useUpdateUser, useUser } from "../../hooks/useUsers";
import { useEmployees } from "../../hooks/useEmployees";
import { toast } from "react-toastify";
import useConfirmDialog from "../../hooks/useConfirmDialog";

export default function UserForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const isAddMode = !id;
  const [isEditMode, setIsEditMode] = useState(isAddMode);
  const { ConfirmDialogComponent, showConfirm } = useConfirmDialog();

  const [form, setForm] = useState({
    email: "",
    password: "",
    roleId: null,
    employeeId: null,
  });

  const { data: userData, isLoading: userLoading } = useUser(id, { enabled: !!id });
  const { data: rolesData = [] } = useAllRoles();
  const { data: employeesResp } = useEmployees({ page: 1, size: 1000 });
  const employees = Array.isArray(employeesResp?.data?.result)
    ? employeesResp.data.result
    : [];

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  useEffect(() => {
    if (userData) {
      setForm({
        email: userData.email || "",
        password: "", // password field not populated on edit
        roleId: userData.role?.id || null,
        employeeId: userData.employee?.id || null,
      });
    }
  }, [userData]);

  const onChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((s) => ({ ...s, [field]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    const requiredFieldsMap = isAddMode
      ? {
          email: t("email", { defaultValue: "Email" }),
          password: t("password", { defaultValue: "Password" }),
          roleId: t("role", { defaultValue: "Role" }),
          employeeId: t("chooseEmployee", { defaultValue: "Chọn nhân sự" }),
        }
      : {
          email: t("email", { defaultValue: "Email" }),
          roleId: t("role", { defaultValue: "Role" }),
          employeeId: t("chooseEmployee", { defaultValue: "Chọn nhân sự" }),
        };

    for (const [field, label] of Object.entries(requiredFieldsMap)) {
      const value = form[field];
      if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
      ) {
        toast.error(
          `${label} ${t("isRequired", { defaultValue: "is required" })}`
        );
        return;
      }
    }

    const payload = {
      email: form.email,
      roleId: Number(form.roleId),
      employeeId: Number(form.employeeId),
    };

    // Only include password on create or if user is changing it during edit
    if (isAddMode) {
      payload.password = form.password;
    } else if (form.password && form.password.trim() !== "") {
      payload.password = form.password;
    }

    if (isAddMode) {
      createUser.mutate(payload, {
        onSuccess: () => {
          navigate("/users");
        },
      });
    } else {
      updateUser.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            setIsEditMode(false);
          },
        }
      );
    }
  };

  const handleToggleActive = () => {
    if (!userData) return;
    const newActiveState = !userData._active;
    
    showConfirm({
      title: newActiveState
        ? t("confirmActivate", { defaultValue: "Xác nhận kích hoạt" })
        : t("confirmDeactivate", { defaultValue: "Xác nhận vô hiệu hóa" }),
      message: newActiveState
        ? t("confirmActivateMessage", { defaultValue: "Bạn có chắc chắn muốn kích hoạt tài khoản này?" })
        : t("confirmDeactivateMessage", { defaultValue: "Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?" }),
      onConfirm: () => {
        updateUser.mutate(
          { id, data: { isActive: newActiveState } },
          {
            onSuccess: () => {
              toast.success(
                newActiveState
                  ? t("accountActivated", { defaultValue: "Đã kích hoạt tài khoản" })
                  : t("accountDeactivated", { defaultValue: "Đã vô hiệu hóa tài khoản" })
              );
            },
            onError: (error) => {
              const message = error.response?.data?.message || t("error", { defaultValue: "Có lỗi xảy ra" });
              toast.error(message);
            },
          }
        );
      },
    });
  };

  const isPending = isAddMode ? createUser.isPending : updateUser.isPending;

  if ((userLoading && !isAddMode) || isPending) {
    return (
      <div className="flex flex-col h-full">
        <ContentHeader
          title={
            isAddMode
              ? t("addAccount", { defaultValue: "Thêm tài khoản" })
              : t("accountDetail", { defaultValue: "Chi tiết tài khoản" })
          }
          actions={
            <>
              <Button variant="outline" onClick={() => navigate(-1)}>
                {t("cancel", { defaultValue: "Hủy" })}
              </Button>
              {isAddMode ? (
                <Button onClick={() => formRef.current?.requestSubmit()}>
                  {t("save", { defaultValue: "Lưu" })}
                </Button>
              ) : isEditMode ? (
                <Button onClick={() => formRef.current?.requestSubmit()}>
                  {t("save", { defaultValue: "Lưu" })}
                </Button>
              ) : (
                <Button onClick={() => setIsEditMode(true)}>
                  {t("edit", { defaultValue: "Sửa" })}
                </Button>
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
        title={
          isAddMode
            ? t("addAccount", { defaultValue: "Thêm tài khoản" })
            : t("accountDetail", { defaultValue: "Chi tiết tài khoản" })
        }
        actions={
          <>
            {isAddMode ? (
              <>
                <Button variant="outline" onClick={() => navigate(-1)}>
                  {t("cancel", { defaultValue: "Hủy" })}
                </Button>
                <Button
                  onClick={() => formRef.current?.requestSubmit()}
                  disabled={isPending}
                >
                  {t("save", { defaultValue: "Lưu" })}
                </Button>
              </>
            ) : isEditMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(false);
                    if (userData) {
                      setForm({
                        email: userData.email || "",
                        password: "",
                        roleId: userData.role?.id || null,
                        employeeId: userData.employee?.id || null,
                      });
                    }
                  }}
                >
                  {t("cancel", { defaultValue: "Hủy" })}
                </Button>
                <Button
                  onClick={() => formRef.current?.requestSubmit()}
                  disabled={isPending}
                >
                  {t("save", { defaultValue: "Lưu" })}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate(-1)}>
                  {t("cancel", { defaultValue: "Hủy" })}
                </Button>
                <Button
                  variant={userData?._active ? "outline" : "primary"}
                  onClick={handleToggleActive}
                  disabled={isPending}
                >
                  {userData?._active
                    ? t("deactivate", { defaultValue: "Vô hiệu hóa" })
                    : t("activate", { defaultValue: "Kích hoạt" })}
                </Button>
                <Button onClick={() => setIsEditMode(true)}>
                  {t("edit", { defaultValue: "Sửa" })}
                </Button>
              </>
            )}
          </>
        }
      />

      <div className="flex-1 mt-4">
        <div className="bg-white rounded-xl shadow p-6">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    label={t("email", { defaultValue: "Email" })}
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    required
                    disabled={!isEditMode}
                  />
                  <TextInput
                    label={t("password", { defaultValue: "Mật khẩu" })}
                    type="password"
                    value={form.password}
                    onChange={onChange("password")}
                    required={isAddMode}
                    disabled={!isEditMode}
                    placeholder={
                      !isAddMode && isEditMode
                        ? t("passwordOptional", {
                            defaultValue: "Để trống nếu không đổi",
                          })
                        : ""
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectDropdown
                    label={t("chooseEmployee", { defaultValue: "Chọn nhân sự" })}
                    options={employees.map((e) => ({ id: e.id, name: e.name }))}
                    value={form.employeeId}
                    onChange={(v) => setForm((s) => ({ ...s, employeeId: v }))}
                    placeholder={t("chooseEmployee", {
                      defaultValue: "Chọn nhân sự",
                    })}
                    disabled={!isEditMode}
                  />

                  <SelectDropdown
                    label={t("role", { defaultValue: "Vai trò" })}
                    options={rolesData.map((r) => ({ id: r.id, name: r.name }))}
                    value={form.roleId}
                    onChange={(v) => setForm((s) => ({ ...s, roleId: v }))}
                    placeholder={t("chooseRole", { defaultValue: "Chọn vai trò" })}
                    disabled={!isEditMode}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {ConfirmDialogComponent}
    </div>
  );
}
