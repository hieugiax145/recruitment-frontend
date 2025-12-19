import Can from "../../components/Can";
import Button from "../../components/ui/Button";
import ContentHeader from "../../components/ui/ContentHeader";
import {
  Plus,
  Code,
  User,
  Megaphone,
  DollarSign,
  BarChart3,
  Building2,
  FileText,
  MoreVertical,
  Search,
  Briefcase,
  Filter,
} from "lucide-react";
import Pagination from "../../components/ui/Pagination";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PositionCard from "./components/PositionCard";
import PositionDetail from "./components/PositionDetail";
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

export default function JobPositions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isDetailFixed, setIsDetailFixed] = useState(false);
  const [detailDimensions, setDetailDimensions] = useState({
    width: 0,
    left: 0,
    height: 0,
  });
  const detailRef = useRef(null);
  const detailPlaceholderRef = useRef(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [positionForCandidate, setPositionForCandidate] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  // Determine effective department filter
  const userDeptId = user?.department?.id;
  const userDeptName = user?.department?.name || "";
  const nameLower = userDeptName.toLowerCase();
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
  const filteredRawPositions = rawPositions;

  // Map API data to UI format
  const positions = filteredRawPositions.map((pos) => ({
    id: pos.id.toString(),
    title: pos.title,
    description: pos.description,
    responsibilities: pos.responsibilities,
    requirements: pos.requirements,
    qualifications: pos.qualifications,
    benefits: pos.benefits,
    salary: `₫ ${formatSalary(pos.salaryMin)} - ${formatSalary(pos.salaryMax)}`,
    salaryMin: pos.salaryMin,
    salaryMax: pos.salaryMax,
    currency: pos.currency,
    level:
      pos.experienceLevel?.toLowerCase().replace(/[_\s-]/g, "-") || "mid-level",
    experienceLevel: pos.experienceLevel,
    experience: pos.yearsOfExperience || "N/A",
    yearsOfExperience: pos.yearsOfExperience,
    type: pos.employmentType || "Full-time",
    employmentType: pos.employmentType,
    location: pos.location || "N/A",
    mode: pos.remote ? "Remote" : null,
    remoteWorkAllowed: pos.remote,
    numberOfPositions: pos.quantity,
    quantity: pos.quantity,
    applicants: pos.applicationCount || 0,
    applicationCount: pos.applicationCount,
    deadline: pos.deadline,
    status: pos.status?.toLowerCase() || "draft",
    recruitmentRequestId: pos.recruitmentRequest?.id,
    recruitmentRequest: pos.recruitmentRequest,
    department: pos.departmentName || "",
    departmentName: pos.departmentName,
    icon: Code, // Default icon
    iconBg: "bg-lime-200", // Default background
  }));

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

  const handlePositionClick = (position) => {
    if (selectedPosition?.id === position.id) {
      setSelectedPosition(null);
    } else {
      setSelectedPosition(position);
    }
  };

  const handleView = (position) => {
    console.log("View position:", position);
    setSelectedPosition(position);
  };

  const handleEdit = (position) => {
    console.log("Edit position:", position);
    // Navigate to edit page or open edit modal
    navigate(`/job-positions/${position.id}/edit`);
  };

  const handleAddCandidate = (position) => {
    console.log("Add candidate for position:", position);
    setPositionForCandidate(position);
    setShowAddCandidateModal(true);
  };

  const handleDelete = (position) => {
    console.log("Delete position:", position);
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
          // If deleted position is selected, close detail panel
          if (selectedPosition?.id === positionToDelete.id) {
            setSelectedPosition(null);
          }
          setShowDeleteDialog(false);
          setPositionToDelete(null);
        },
      });
    }
  };

  // Handle scroll to make detail panel fixed
  useEffect(() => {
    if (!selectedPosition) {
      setIsDetailFixed(false);
      return;
    }

    const handleScroll = () => {
      if (detailPlaceholderRef.current && detailRef.current) {
        const placeholderRect =
          detailPlaceholderRef.current.getBoundingClientRect();
        const detailRect = detailRef.current.getBoundingClientRect();
        // AppBar height (60px) + top padding (16px) = 76px
        // Add gap (16px) = 92px total offset
        const stickyOffset = 92;

        // Always update dimensions to handle resize and position changes
        const newDimensions = {
          width: placeholderRect.width,
          left: placeholderRect.left,
          height: detailRect.height,
        };

        // Only update state if dimensions actually changed
        setDetailDimensions((prev) => {
          if (
            prev.width !== newDimensions.width ||
            prev.left !== newDimensions.left ||
            prev.height !== newDimensions.height
          ) {
            return newDimensions;
          }
          return prev;
        });

        // Check if should be fixed with some threshold
        const shouldBeFixed = placeholderRect.top <= stickyOffset;

        if (shouldBeFixed !== isDetailFixed) {
          setIsDetailFixed(shouldBeFixed);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // Update on resize
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [selectedPosition, isDetailFixed]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <ContentHeader
          title={t("listJobPosition")}
          actions={
            <div className="flex gap-4 items-center">
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
          <div className="flex gap-4 items-center">
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
      <div
        className={`flex ${
          selectedPosition ? "" : "flex-col"
        } flex-1 mt-4 gap-4 items-start`}
      >
        {/* Left side - Positions List */}
        <div
          className={`${
            selectedPosition ? "w-1/2" : "flex-1  w-full"
          } bg-white rounded-xl shadow p-6 flex flex-col`}
        >
          <div className="flex-1 overflow-visible">
            {currentPositions.length === 0 ? (
              <div className="py-12">
                <EmptyState title={t("noPositionsFound", { defaultValue: "Không có vị trí tuyển dụng" })} icon={Briefcase}/>
              </div>
            ) : (
              <div
                className={
                  selectedPosition
                    ? `space-y-3`
                    : `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3`
                }
              >
                {currentPositions.map((position) => {
                  return (
                    <PositionCard
                      key={position.id}
                      position={position}
                      isCompact={!!selectedPosition}
                      isSelected={selectedPosition?.id === position.id}
                      onClicked={() => handlePositionClick(position)}
                      onClickedCandidates={(pos) => {
                        navigate(`/job-positions/${pos.id}/candidates`);
                      }}
                      onAddCandidate={isHR ? handleAddCandidate : undefined}
                      onView={handleView}
                      onEdit={isHR ? handleEdit : undefined}
                      onDelete={isHR ? handleDelete : undefined}
                      onUpdateStatus={isHR ? handleUpdateStatus : undefined}
                    />
                  );
                })}
              </div>
            )}
          </div>
          {/* mark: pagination */}
          <div className="flex justify-end items-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        </div>

        {/* Right side - Position Detail */}
        {selectedPosition && (
          <div
            className="w-1/2 flex"
            ref={detailPlaceholderRef}
            style={
              isDetailFixed
                ? { minHeight: `${detailDimensions.height}px` }
                : undefined
            }
          >
            <PositionDetail
              ref={detailRef}
              position={selectedPosition}
              onClose={() => setSelectedPosition(null)}
              onNavigateToCandidates={() =>
                navigate(`/job-positions/${selectedPosition.id}/candidates`)
              }
              isFixed={isDetailFixed}
              dimensions={detailDimensions}
            />
          </div>
        )}
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
