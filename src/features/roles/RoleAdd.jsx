import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ContentHeader from "../../components/ui/ContentHeader";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { useCreateRole } from "../../hooks/useRoles";
import { toast } from "react-toastify";
import { useAllPermissions } from "../../hooks/usePermissions";
import LoadingContent from "../../components/ui/LoadingContent";

export default function RoleAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createRole = useCreateRole();

  const [form, setForm] = useState({ name: "", description: "" });
  const { data: permissionsData = [], isLoading: permsLoading } = useAllPermissions();
  const [selected, setSelected] = useState([]);

  const onChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((s) => ({ ...s, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      toast.error(t("error"));
      return;
    }
    createRole.mutate(
      { name: form.name.trim(), description: form.description || undefined, permissionIds: selected },
      { onSuccess: () => navigate("/roles") }
    );
  };

  const commonActions = ["read", "create", "update", "delete"];
  const groupedPermissions = useMemo(() => {
    const groups = {};
    (permissionsData || []).forEach((p) => {
      const parts = (p.name || "").split(":");
      let service = parts[0] || "other";
      let resource = parts[1] || "general";
      let action = (parts[2] || "read").toLowerCase();
      service = service.toLowerCase();
      if (service === "user-service") service = "user";
      if (service === "job-service") service = "job";
      if (service === "candidate-service") service = "candidate";
      if (service === "communications-service") service = "communications";
      resource = resource.toLowerCase();
      if (resource === "permissions") resource = "permission";
      if (resource === "roles") resource = "role";
      if (resource === "users") resource = "user";
      if (resource === "departments") resource = "department";
      if (resource === "job-positions") resource = "job-position";
      if (resource === "recruitment-requests") resource = "recruitment-request";
      if (resource === "applications") resource = "application";
      if (resource === "candidates") resource = "candidate";
      if (resource === "comments") resource = "comment";
      if (resource === "schedules") resource = "schedule";
      if (resource === "job-skills") resource = "job-skill";
      if (resource === "job-categories") resource = "job-category";
      if (action === "view") action = "read";
      if (action === "edit") action = "update";
      if (!groups[service]) groups[service] = { resources: {} };
      if (!groups[service].resources[resource]) groups[service].resources[resource] = {};
      groups[service].resources[resource][action] = { id: p.id, name: p.name };
    });
    return groups;
  }, [permissionsData]);

  const actionsPerGroup = useMemo(() => {
    const map = {};
    Object.entries(groupedPermissions).forEach(([service, svc]) => {
      const set = new Set();
      Object.values(svc.resources).forEach((res) => Object.keys(res).forEach((a) => set.add(a)));
      const rest = Array.from(set).filter((a) => !commonActions.includes(a)).sort();
      const ordered = [...commonActions.filter((a) => set.has(a)), ...rest];
      map[service] = ordered;
    });
    return map;
  }, [groupedPermissions]);

  const maxColumnCount = useMemo(() => {
    let max = 0;
    Object.values(actionsPerGroup).forEach((arr) => {
      if (Array.isArray(arr) && arr.length > max) max = arr.length;
    });
    return max;
  }, [actionsPerGroup]);

  const getServiceLabel = (service) => t(`permissionGroups.services.${service}`, { defaultValue: service.replace(/-/g, " ") });
  const getResourceLabel = (_service, resource) => t(`permissionGroups.resources.${resource}`, { defaultValue: resource.replace(/-/g, " ") });
  const getActionLabel = (act) => t(`permissionGroups.actions.${act}`, { defaultValue: act.charAt(0).toUpperCase() + act.slice(1) });

  const getPermIdsInGroup = (service) => {
    const svc = groupedPermissions[service];
    if (!svc) return [];
    return Object.values(svc.resources).flatMap((res) => Object.values(res).map((a) => a.id));
  };
  const getPermIdsInGroupAction = (service, action) => {
    const svc = groupedPermissions[service];
    if (!svc) return [];
    return Object.values(svc.resources).map((res) => res[action]).filter(Boolean).map((p) => p.id);
  };
  const getPermIdsInResource = (service, resource) => {
    const svc = groupedPermissions[service];
    if (!svc) return [];
    const res = svc.resources[resource];
    if (!res) return [];
    return Object.values(res).map((p) => p.id);
  };

  const toggleMany = (ids) => {
    if (!ids.length) return;
    const allSelected = ids.every((id) => selected.includes(id));
    if (allSelected) setSelected((prev) => prev.filter((id) => !ids.includes(id)));
    else setSelected((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const toggleGroup = (service) => toggleMany(getPermIdsInGroup(service));
  const toggleGroupAction = (service, action) => toggleMany(getPermIdsInGroupAction(service, action));
  const toggleResourceAll = (service, resource) => toggleMany(getPermIdsInResource(service, resource));

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title={t("addRole", { defaultValue: "Add Role" })}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate(-1)}>{t("cancel")}</Button>
            <Button type="submit" disabled={createRole.isLoading} onClick={handleSubmit}>{t("save")}</Button>
          </>
        }
      />
      <div className="flex-1 mt-4">
        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput label={t("roleName", { defaultValue: "Role Name" })} value={form.name} onChange={onChange("name")} required />
            <TextInput label={t("roleDescription", { defaultValue: "Description" })} value={form.description} onChange={onChange("description")} />
          </form>

          <div className="mt-6">
            <h4 className="font-medium mb-2">{t("permissions.label") || "Permissions"}</h4>
            {permsLoading ? (
              <div className="flex items-center justify-center h-24"><LoadingContent /></div>
            ) : Object.keys(groupedPermissions).length === 0 ? (
              <div className="text-gray-500">{t("noData")}</div>
            ) : (
              Object.entries(groupedPermissions).map(([group, perms]) => (
                <div key={group} className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <strong className="capitalize">{getServiceLabel(group)}</strong>
                    <div className="flex items-center gap-4">
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={getPermIdsInGroup(group).length > 0 && getPermIdsInGroup(group).every((id) => selected.includes(id))}
                          onChange={() => toggleGroup(group)}
                        />
                        <span className="text-sm">{t("permissions.selectAll") || "Tất cả"}</span>
                      </label>
                      {actionsPerGroup[group]?.map((act) => (
                        <label key={act} className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            title={`${getServiceLabel(group)} / ${getActionLabel(act)}`}
                            checked={(() => {
                              const ids = getPermIdsInGroupAction(group, act);
                              return ids.length > 0 && ids.every((id) => selected.includes(id));
                            })()}
                            onChange={() => toggleGroupAction(group, act)}
                          />
                          <span className="text-sm">{getActionLabel(act)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm table-fixed">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left p-3 w-[250px] font-medium text-gray-600">&nbsp;</th>
                          <th className="text-center p-3 w-[100px] font-medium text-gray-600">{t("permissions.selectAll") || "Tất cả"}</th>
                          {Array.from({ length: maxColumnCount }).map((_, i) => {
                            const act = actionsPerGroup[group]?.[i];
                            return (
                              <th key={i} className="text-center p-3 flex-1 font-medium text-gray-600" style={{ width: `${100 / (maxColumnCount + 1)}%` }}>
                                {act ? getActionLabel(act) : null}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(perms.resources).map(([resource, actions], idx) => (
                          <tr key={resource} className={`border-b border-gray-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                            <td className="p-3 w-[250px] truncate whitespace-nowrap text-gray-700">{getResourceLabel(group, resource)}</td>
                            <td className="p-3 text-center w-[100px]">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={(() => {
                                  const ids = getPermIdsInResource(group, resource);
                                  return ids.length > 0 && ids.every((id) => selected.includes(id));
                                })()}
                                onChange={() => toggleResourceAll(group, resource)}
                              />
                            </td>
                            {Array.from({ length: maxColumnCount }).map((_, i) => {
                              const act = actionsPerGroup[group]?.[i];
                              const perm = act ? actions[act] : null;
                              return (
                                <td key={i} className="p-3 text-center" style={{ width: `${100 / (maxColumnCount + 1)}%` }}>
                                  {perm ? (
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      checked={selected.includes(perm.id)}
                                      onChange={() => {
                                        setSelected((prev) =>
                                          prev.includes(perm.id)
                                            ? prev.filter((x) => x !== perm.id)
                                            : [...prev, perm.id]
                                        );
                                      }}
                                    />
                                  ) : null}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
