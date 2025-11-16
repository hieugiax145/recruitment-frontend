import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, X } from "lucide-react";
import ContentHeader from "../../components/ui/ContentHeader";
import TextInput from "../../components/ui/TextInput";
import SelectDropdown from "../../components/ui/SelectDropdown";
import Button from "../../components/ui/Button";
import { useAllDepartments } from "../../hooks/useDepartments";
import { useAllRoles } from "../../hooks/useRoles";
import { useCreateUser } from "../../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    roleId: null,
    departmentId: null,
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { data: departmentsData = [] } = useAllDepartments();
  const { data: rolesData = [] } = useAllRoles();

  const createUser = useCreateUser();

  const onChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((s) => ({ ...s, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("errorInvalidImage"));
        e.target.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(t("errorImageSize"));
        e.target.value = "";
        return;
      }

      setAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    const fileInput = document.getElementById("avatar-file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error(t("error"));
      return;
    }

    let payload;

    if (avatarFile) {
      payload = new FormData();
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("password", form.password);
      if (form.phone) payload.append("phone", form.phone);
      if (form.roleId) payload.append("roleId", form.roleId);
      if (form.departmentId) payload.append("departmentId", form.departmentId);
      payload.append("avatar", avatarFile);
    } else {
      payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        roleId: form.roleId,
        departmentId: form.departmentId,
      };
    }

    createUser.mutate(payload, {
      onSuccess: () => {
        navigate("/users");
      },
    });
  };


  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={t("addAccount")}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate(-1)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={createUser.isLoading}>
              {t("save")}
            </Button>
          </>
        }
      />

      <div className="flex-1 mt-4">
        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <TextInput
                  label={t("employeeName")}
                  value={form.name}
                  onChange={onChange("name")}
                  required
                />
                <TextInput
                  label={t("email")}
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  required
                />
                <TextInput
                  label={t("phone")}
                  type="text"
                  value={form.phone}
                  onChange={onChange("phone")}
                />
                <TextInput
                  label={t("password")}
                  type="password"
                  value={form.password}
                  onChange={onChange("password")}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <SelectDropdown
                    label={t("department")}
                    options={(departmentsData || []).map((d) => ({
                      id: d.id,
                      name: d.name,
                    }))}
                    value={form.departmentId}
                    onChange={(v) =>
                      setForm((s) => ({ ...s, departmentId: v }))
                    }
                    placeholder={t("chooseDepartment")}
                  />

                  <SelectDropdown
                    label={t("role")}
                    options={rolesData.map((r) => ({ id: r.id, name: r.name }))}
                    value={form.roleId}
                    onChange={(v) => setForm((s) => ({ ...s, roleId: v }))}
                    placeholder={t("chooseRole")}
                  />
                </div>
              </div>

              <div className="col-span-1 flex flex-col">
                <div className="flex flex-col gap-2">
                  <label className="block text-gray-700">{t("avatar")}</label>

                  {!avatarPreview ? (
                    <label
                      htmlFor="avatar-file-input"
                      className={`
                        flex-1 min-h-[200px]
                        border-2 border-dashed border-gray-300 rounded-lg p-4
                        flex flex-col items-center justify-center gap-2
                        cursor-pointer hover:border-blue-400 hover:bg-blue-50/50
                        transition-colors
                        ${
                          createUser.isLoading
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      `}
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">
                          {t("clickToUpload")}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG • {t("maxSize")} 5MB
                        </p>
                      </div>
                      <input
                        id="avatar-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        disabled={createUser.isLoading}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex-1 min-h-[200px] border border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col">
                      <div className="flex-1 flex items-center justify-center mb-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        disabled={createUser.isLoading}
                        className="w-full p-2 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 flex items-center justify-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        <span>{t("remove")}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
