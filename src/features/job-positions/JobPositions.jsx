import Button from "../../components/ui/Button";
import ContentHeader from "../../components/ui/ContentHeader";
import TextInput from "../../components/ui/TextInput";
import {
  Plus,
  User,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import Pagination from "../../components/ui/Pagination";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import AddCandidateModal from "../candidate/components/AddCandidateModal";
import {
  useJobPositions,
  useDeleteJobPosition,
  useUpdateJobPosition,
} from "./hooks/useJobPositions";
import { jobServices } from "./services/jobServices";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { formatSalary } from "../../utils/utils";
import SelectDropdown from "../../components/ui/SelectDropdown";
import { useAllDepartments } from "../../hooks/useDepartments";
import LoadingContent from "../../components/ui/LoadingContent";
import EmptyState from "../../components/ui/EmptyState";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/ui/StatusBadge";

export default function JobPositions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [positionForCandidate, setPositionForCandidate] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [keyword, setKeyword] = useState("");

  // Determine effective department filter
  const userDeptId = user?.department?.id;
  const isHR = userDeptId === 2;
  const shouldRestrictToUserDept = !!userDeptId && !isHR;
  const effectiveDepartmentId = shouldRestrictToUserDept
    ? userDeptId
    : selectedDepartmentId ?? undefined;

  // Fetch job positions from API with department filter when applicable
  const { data, isLoading, isError, error } = useJobPositions(
    effectiveDepartmentId ? { departmentId: effectiveDepartmentId } : {}
  );
  const deleteMutation = useDeleteJobPosition();
  const updateMutation = useUpdateJobPosition();

  // Fetch departments for filter
  const { data: departmentsData } = useAllDepartments();
  const departments = Array.isArray(departmentsData) ? departmentsData : [];

  // Get positions from API response
  const rawPositions = Array.isArray(data?.data?.result) ? data.data.result : [];

  // Map API data to UI format
  const positions = rawPositions.map((pos) => ({
    id: pos.id.toString(),
    title: pos.title,
    description: pos.description,
    responsibilities: pos.responsibilities,
    requirements: pos.requirements,
    qualifications: pos.qualifications,
    benefits: pos.benefits,
    salary: `₫ ${formatSalary(pos.salaryMin)} - ${formatSalary(pos.salaryMax)}`,
    type: pos.employmentType || "Full-time",
    location: pos.location || "N/A",
    quantity: pos.quantity,
    applicants: pos.applicationCount || 0,
    deadline: pos.deadline,
    status: pos.status?.toUpperCase() || "DRAFT",
    recruitmentRequestId: pos.recruitmentRequest?.id,
    department: pos.departmentName || "",
    experience: pos.yearsOfExperience || "N/A",
    remote: pos.remote || false,
    publishedAt: pos.publishedAt
  })).filter((pos) => {
    if (!keyword) return true;
    const searchLower = keyword.toLowerCase();
    return (
      pos.title?.toLowerCase().includes(searchLower) ||
      pos.description?.toLowerCase().includes(searchLower) ||
      pos.department?.toLowerCase().includes(searchLower)
    );
  });

  // Show toast notification when there's an error
  useEffect(() => {
    if (isError) {
      const errorMessage =
        error?.response?.data?.message || t("errorLoadingPositions");
      toast.error(errorMessage);
    }
  }, [isError, error, t]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(positions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPositions = positions.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (positionId) => {
    setExpandedRowId(expandedRowId === positionId ? null : positionId);
  };

  const handleEdit = (position) => {
    navigate(`/job-positions/${position.id}/edit`);
  };

  const handleAddCandidate = (position) => {
    setPositionForCandidate(position);
    setShowAddCandidateModal(true);
  };

  const handleDelete = (position) => {
    setPositionToDelete(position);
    setShowDeleteDialog(true);
  };

  const handleUpdateStatus = async (position, newStatus) => {
    try {
      if (newStatus === "PUBLISHED") {
        await jobServices.publishJobPosition(position.id);
      } else if (newStatus === "CLOSED") {
        await jobServices.closeJobPosition(position.id);
      } else if (newStatus === "DRAFT") {
        await jobServices.reopenJobPosition(position.id);
      } else {
        await jobServices.updateJobPosition(position.id, { status: newStatus });
      }
      // Refresh list
      updateMutation.reset();
      // Using updateMutation's onSuccess invalidation pattern
      updateMutation.mutate(
        { id: position.id, data: {} },
        { onSuccess: () => {} }
      );
    } catch (error) {
      // The hooks already handle toasts; fallback here if direct service fails
    }
  };

  const confirmDelete = () => {
    if (positionToDelete) {
      deleteMutation.mutate(positionToDelete.id, {
        onSuccess: () => {
          toast.success(t("toasts.deleteSuccess"));
          // If deleted position is expanded, close it
          if (expandedRowId === positionToDelete.id) {
            setExpandedRowId(null);
          }
          setShowDeleteDialog(false);
          setPositionToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <ContentHeader
          title={t("listJobPosition")}
          actions={
            <div className="flex gap-3 items-center">
              <TextInput
                placeholder={t("common.search")}
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                icon={Search}
                hideLabel
                className="w-[300px]"
              />
              {isHR && (
                <SelectDropdown
                  value={selectedDepartmentId}
                  onChange={setSelectedDepartmentId}
                  options={[{ id: null, name: "Tất cả phòng ban" }, ...departments.map(d => ({ id: d.id, name: d.name }))]}
                  placeholder="Tất cả phòng ban"
                  hideLabel
                  compact
                  className="min-w-[200px]"
                />
              )}
              {isHR && (
                <Button
                  onClick={() => {
                    navigate("/job-positions/new");
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("createNewPosition")}
                </Button>
              )}
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
        title={t("listJobPosition")}
        actions={
          <div className="flex gap-3 items-center">
            <TextInput
              placeholder={t("common.search")}
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1);
              }}
              icon={Search}
              hideLabel
              className="w-[300px]"
            />
            {isHR && (
              <SelectDropdown
                value={selectedDepartmentId}
                onChange={setSelectedDepartmentId}
              options={[{ id: null, name: t("jobPositions.allDepartments") }, ...departments.map(d => ({ id: d.id, name: d.name }))]}
              placeholder={t("jobPositions.allDepartments")}
                hideLabel
                compact
                className="min-w-[200px]"
              />
            )}
            {isHR && (
              <Button
                onClick={() => {
                  navigate("/job-positions/new");
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("createNewPosition")}
              </Button>
            )}
          </div>
        }
      />
      
      {/* Table View */}
      <div className="flex-1 flex flex-col mt-4 min-h-0">
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow overflow-hidden">
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    ID
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("position")}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("department")}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("quantity")}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("applicants")}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("salary")}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    {t("status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPositions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8">
                      <EmptyState title={t("noPositionsFound")} icon={Briefcase}/>
                    </td>
                  </tr>
                ) : (
                  currentPositions.map((position) => {
                    const isExpanded = expandedRowId === position.id;
                    
                    return (
                      <>
                        <tr 
                          key={position.id}
                          className={`hover:bg-gray-50 cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50' : ''}`}
                          onClick={() => handleRowClick(position.id)}
                        >
                          <td className="p-4 text-sm text-gray-900">{position.id}</td>
                          <td className="p-4">
                            <div className="text-sm font-medium text-gray-900">{position.title}</div>
                            <div className="text-xs text-gray-500">{position.type} • {position.location}</div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{position.department}</td>
                          <td className="p-4 text-sm text-gray-600">{position.quantity}</td>
                          <td className="p-4 text-sm text-gray-600">{position.applicants}</td>
                          <td className="p-4 text-sm text-gray-600">{position.salary}</td>
                          <td className="p-4">
                            <StatusBadge status={position.status} />
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan="7" className="p-0">
                              <div className="bg-gray-50 px-6 py-4 space-y-4">
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{t("jobPositions.jobDescription")}</h4>
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{position.description}</p>
                                </div>
                                
                                {position.responsibilities && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{t("jobPositions.responsibilities")}</h4>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{position.responsibilities}</p>
                                  </div>
                                )}
                                
                                {position.requirements && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{t("jobPositions.requirements")}</h4>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{position.requirements}</p>
                                  </div>
                                )}
                                
                                {position.qualifications && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{t("jobPositions.qualifications")}</h4>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{position.qualifications}</p>
                                  </div>
                                )}
                                
                                {position.benefits && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{t("jobPositions.benefits")}</h4>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{position.benefits}</p>
                                  </div>
                                )}
                                
                                {isHR && (
                                  <div className="flex items-center justify-end flex-wrap gap-2 pt-2 border-t border-gray-200">
                                    <Button onClick={() => navigate(`/job-positions/${position.id}/candidates`)}>
                                      <User className="h-4 w-4 mr-2" />
                                      {t("jobPositions.viewCandidates")} ({position.applicants})
                                    </Button>
                                    
                                    <Button variant="outline" onClick={() => handleAddCandidate(position)}>
                                      <Plus className="h-4 w-4 mr-2" />
                                      {t("jobPositions.addCandidate")}
                                    </Button>
                                    
                                    {position.status === 'DRAFT' && (
                                      <Button variant="outline" onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStatus(position, 'PUBLISHED');
                                      }}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        {t("jobPositions.publish")}
                                      </Button>
                                    )}
                                    
                                    {position.status === 'PUBLISHED' && (
                                      <Button variant="outline" onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStatus(position, 'CLOSED');
                                      }}>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        {t("jobPositions.close")}
                                      </Button>
                                    )}
                                    
                                    <Button variant="outline" onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(position);
                                    }}>
                                      <FileText className="h-4 w-4 mr-2" />
                                      {t("edit")}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {positions.length > 0 && (
            <div className="flex-shrink-0 flex justify-end items-center p-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setPositionToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Xóa vị trí tuyển dụng"
        message={`Bạn có chắc muốn xóa vị trí "${positionToDelete?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />

      {/* Add Candidate Modal */}
      <AddCandidateModal
        isOpen={showAddCandidateModal}
        onClose={() => {
          setShowAddCandidateModal(false);
          setPositionForCandidate(null);
        }}
        jobPosition={positionForCandidate}
        onSuccess={() => {
          // Refresh data after adding candidate
          // Toast is already shown in useCreateCandidate hook
        }}
      />
    </div>
  );
}
